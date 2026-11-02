import { createHash, randomBytes } from 'node:crypto';
import { bodyJson, HttpError, json } from './http.js';
import { getDummyPasswordHash, hashPassword, isValidPassword, normalizeEmail, verifyPassword } from './passwords.js';

const AUTH_BODY_LIMIT = 16384;
const CLOUD_BODY_LIMIT = 2 * 1024 * 1024;
const SUPPORTER = 'supporter_edition';
const PATHS = new Set([
  '/api/auth/register',
  '/api/auth/login',
  '/api/auth/change-password',
  '/api/auth/logout',
  '/api/auth/me',
  '/api/cloud-save',
]);

function publicUser(user) {
  return { id: user.id, email: user.email };
}

function publicSave(save) {
  return save ? {
    state: save.state,
    generation: save.generation,
    revision: save.revision,
    schemaVersion: save.schemaVersion,
    updatedAt: save.updatedAt,
  } : null;
}

function saveMetadata(save, serverTime) {
  return {
    generation: save.generation,
    revision: save.revision,
    schemaVersion: save.schemaVersion,
    updatedAt: save.updatedAt,
    serverTime,
  };
}

function tokenHash(token) {
  return createHash('sha256').update(token).digest('hex');
}

function bearer(req) {
  const match = /^Bearer ([A-Za-z0-9_-]{43,128})$/.exec(String(req.headers.authorization || ''));
  return match ? match[1] : null;
}

function exactObject(value, keys) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const actual = Object.keys(value).sort();
  return actual.length === keys.length && keys.every((key, index) => actual[index] === key);
}

function validState(state) {
  if (!state || typeof state !== 'object' || Array.isArray(state)) return false;
  const pending = [{ value: state, depth: 0 }];
  while (pending.length) {
    const { value, depth } = pending.pop();
    if (depth > 64) return false;
    if (value === null) continue;
    if (Array.isArray(value)) {
      for (const child of value) pending.push({ value: child, depth: depth + 1 });
      continue;
    }
    if (typeof value === 'object') {
      const prototype = Object.getPrototypeOf(value);
      if (prototype !== Object.prototype && prototype !== null) return false;
      for (const [key, child] of Object.entries(value)) {
        if (['__proto__', 'prototype', 'constructor'].includes(key)) return false;
        pending.push({ value: child, depth: depth + 1 });
      }
      continue;
    }
    if (typeof value === 'number' && !Number.isFinite(value)) return false;
    if (!['string', 'boolean', 'number', 'undefined'].includes(typeof value)) return false;
  }
  return true;
}

function cloudInput(value) {
  const plainEnvelope = exactObject(value, ['baseRevision', 'deviceId', 'generation', 'state']);
  const sequencedEnvelope = exactObject(value, ['baseRevision', 'deviceId', 'generation', 'sequence', 'state'])
    && Number.isSafeInteger(value.sequence)
    && value.sequence > 0;
  if ((!plainEnvelope && !sequencedEnvelope)
    || typeof value.generation !== 'string'
    || !value.generation.trim()
    || value.generation.length > 256
    || !Number.isSafeInteger(value.baseRevision)
    || value.baseRevision < 0
    || typeof value.deviceId !== 'string'
    || value.deviceId.length < 1
    || value.deviceId.length > 128
    || !validState(value.state)) {
    throw new HttpError(400, 'Некорректное облачное сохранение', 'INVALID_SAVE');
  }
  return value;
}

export function createAccountRouter(config) {
  const store = config.store;
  const loginRates = new Map();
  const loginRateLimit = Math.max(1, Number(config.loginRateLimit) || 10);
  const sessionTtlSeconds = Math.max(60, Number(config.sessionTtlSeconds) || 30 * 24 * 3600);
  const rateWindowMs = 3600000;
  let lastRateCleanup = 0;

  function cleanupLoginRates(now) {
    if (now - lastRateCleanup < 60000 && loginRates.size < 1000) return;
    for (const [key, value] of loginRates) {
      if (now - value.start >= rateWindowMs) loginRates.delete(key);
    }
    lastRateCleanup = now;
  }

  function loginAllowed(req, email) {
    const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
    const now = Date.now();
    cleanupLoginRates(now);
    const key = `${ip}\n${email || '<invalid>'}`;
    const current = loginRates.get(key) || { start: now, count: 0 };
    if (now - current.start >= rateWindowMs) {
      current.start = now;
      current.count = 0;
    }
    if (current.count >= loginRateLimit) return false;
    current.count += 1;
    loginRates.set(key, current);
    return true;
  }

  function credentialsInput(input) {
    if (!exactObject(input, ['email', 'password'])) return null;
    const email = normalizeEmail(input.email);
    if (!email || !isValidPassword(input.password)) return null;
    return { email, password: input.password };
  }

  function invalidCredentials() {
    return new HttpError(401, 'Неверный email или пароль', 'INVALID_CREDENTIALS');
  }

  async function authenticatedUser(req) {
    const token = bearer(req);
    const user = token ? await store.getSessionUser(tokenHash(token)) : null;
    if (!user) throw new HttpError(401, 'Требуется вход в аккаунт', 'AUTH_REQUIRED');
    return user;
  }

  async function supporter(userId) {
    const value = await store.getEntitlement(userId, SUPPORTER);
    return { active: value.active === true, grantedAt: value.active === true ? value.grantedAt : null };
  }

  async function requireSupporter(userId) {
    const value = await supporter(userId);
    if (!value.active) throw new HttpError(403, 'Облачные сохранения доступны в supporter edition', 'SUPPORTER_REQUIRED');
  }

  async function issueSession(res, status, user, allowTestGrant = false) {
    if (allowTestGrant && config.testMode && config.testGrantSupporter) {
      await store.grantEntitlement(user.id, SUPPORTER);
    }
    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + sessionTtlSeconds * 1000).toISOString();
    await store.createSession(user.id, tokenHash(token), expiresAt);
    json(res, status, {
      token,
      sessionToken: token,
      expiresAt,
      user: publicUser(user),
      supporter: await supporter(user.id),
    });
    return true;
  }

  async function handle(req, res) {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    if (!PATHS.has(pathname)) return false;
    res.setHeader('Cache-Control', 'no-store');

    if (pathname === '/api/auth/register' || pathname === '/api/auth/login') {
      if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        throw new HttpError(405, 'Метод не поддерживается', 'METHOD_NOT_ALLOWED');
      }
      const input = await bodyJson(req, AUTH_BODY_LIMIT);
      if (!loginAllowed(req, normalizeEmail(input?.email))) {
        throw new HttpError(429, 'Слишком много попыток входа', 'LOGIN_RATE_LIMIT');
      }
      const credentials = credentialsInput(input);
      if (!credentials) throw new HttpError(400, 'Некорректный запрос авторизации', 'INVALID_AUTH_REQUEST');

      if (pathname === '/api/auth/register') {
        if (await store.getUserByEmail(credentials.email)) {
          throw new HttpError(409, 'Аккаунт с таким email уже существует', 'EMAIL_EXISTS');
        }
        const passwordHash = await hashPassword(credentials.password);
        const user = await store.registerUser(credentials.email, passwordHash);
        if (!user) throw new HttpError(409, 'Аккаунт с таким email уже существует', 'EMAIL_EXISTS');
        return issueSession(res, 201, user, true);
      }

      const user = await store.getUserByEmail(credentials.email);
      const encodedHash = user?.passwordHash || await getDummyPasswordHash();
      const passwordMatches = await verifyPassword(credentials.password, encodedHash);
      if (!user || !passwordMatches) throw invalidCredentials();
      return issueSession(res, 200, user, true);
    }

    if (pathname === '/api/auth/change-password') {
      if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        throw new HttpError(405, 'Метод не поддерживается', 'METHOD_NOT_ALLOWED');
      }
      const user = await authenticatedUser(req);
      const input = await bodyJson(req, AUTH_BODY_LIMIT);
      if (!loginAllowed(req, user.email)) {
        throw new HttpError(429, 'Слишком много попыток входа', 'LOGIN_RATE_LIMIT');
      }
      if (!exactObject(input, ['currentPassword', 'newPassword'])
        || !isValidPassword(input.currentPassword)
        || !isValidPassword(input.newPassword)) {
        throw new HttpError(400, 'Некорректный запрос смены пароля', 'INVALID_AUTH_REQUEST');
      }
      const credentialUser = await store.getUserByEmail(user.email);
      const encodedHash = credentialUser?.passwordHash || await getDummyPasswordHash();
      const passwordMatches = await verifyPassword(input.currentPassword, encodedHash);
      if (!credentialUser || !passwordMatches) throw invalidCredentials();
      const passwordHash = await hashPassword(input.newPassword);
      if (!await store.updateUserPassword(user.id, passwordHash)) {
        throw new Error('Учётные данные аккаунта отсутствуют');
      }
      await store.revokeAllSessions(user.id);
      return issueSession(res, 200, user);
    }

    if (pathname === '/api/auth/logout') {
      if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        throw new HttpError(405, 'Метод не поддерживается', 'METHOD_NOT_ALLOWED');
      }
      await authenticatedUser(req);
      await store.revokeSession(tokenHash(bearer(req)));
      json(res, 200, { ok: true });
      return true;
    }

    if (pathname === '/api/auth/me') {
      if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        throw new HttpError(405, 'Метод не поддерживается', 'METHOD_NOT_ALLOWED');
      }
      const user = await authenticatedUser(req);
      json(res, 200, { user: publicUser(user), supporter: await supporter(user.id) });
      return true;
    }

    if (!['GET', 'PUT'].includes(req.method)) {
      res.setHeader('Allow', 'GET, PUT');
      throw new HttpError(405, 'Метод не поддерживается', 'METHOD_NOT_ALLOWED');
    }
    const user = await authenticatedUser(req);
    await requireSupporter(user.id);
    if (req.method === 'GET') {
      const save = await store.getCloudSave(user.id);
      json(res, 200, { save: publicSave(save), serverTime: new Date().toISOString() });
      return true;
    }
    const input = cloudInput(await bodyJson(req, CLOUD_BODY_LIMIT));
    const result = await store.putCloudSave(user.id, input);
    if (!result.ok) {
      throw new HttpError(409, 'Сохранение изменилось на другом устройстве', 'SAVE_CONFLICT', {
        save: publicSave(result.save),
        serverTime: new Date().toISOString(),
      });
    }
    json(res, 200, saveMetadata(result.save, new Date().toISOString()));
    return true;
  }

  return { handle };
}
