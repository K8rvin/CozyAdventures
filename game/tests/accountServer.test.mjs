import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createKnightServer } from '../tools/knight-server.mjs';
import { createMemoryStore } from '../tools/server/memoryStore.js';

const EMAIL = 'player@example.test';
const PASSWORD = 'правильный-пароль';

async function launch(t, options = {}) {
  const cacheDir = await mkdtemp(join(tmpdir(), 'account-server-'));
  const server = await createKnightServer({
    cacheDir,
    env: {},
    testMode: true,
    allowedOrigins: ['https://k8rvin.github.io', 'null'],
    loginRateLimit: 100,
    ...options,
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    if (server.listening) {
      server.closeAllConnections();
      await new Promise((resolve) => server.close(resolve));
    }
    await rm(cacheDir, { recursive: true, force: true });
  });
  return { server, store: server.accountStore, base: `http://127.0.0.1:${server.address().port}` };
}

async function stop(server) {
  if (!server.listening) return;
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}

async function request(base, path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body !== undefined || options.rawBody !== undefined) headers['Content-Type'] = 'application/json';
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  if (options.origin) headers.Origin = options.origin;
  const response = await fetch(`${base}${path}`, {
    method: options.method || (options.body !== undefined || options.rawBody !== undefined ? 'POST' : 'GET'),
    headers,
    body: options.rawBody !== undefined
      ? options.rawBody
      : options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  const text = await response.text();
  let body = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }
  return { status: response.status, body, headers: response.headers };
}

function assertSession(response, status, email = EMAIL) {
  assert.equal(response.status, status);
  assert.ok(response.body.sessionToken);
  assert.ok(Number.isFinite(Date.parse(response.body.expiresAt)));
  assert.equal(response.body.user.email, email);
  assert.deepEqual(Object.keys(response.body.user).sort(), ['email', 'id']);
  assert.equal(response.body.user.password, undefined);
  assert.equal(response.body.user.passwordHash, undefined);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  return { ...response.body, token: response.body.sessionToken };
}

async function register(base, email = EMAIL, password = PASSWORD, options = {}) {
  const response = await request(base, '/api/auth/register', {
    ...options,
    body: { email, password },
  });
  return assertSession(response, 201, email.trim().toLowerCase());
}

async function login(base, email = EMAIL, password = PASSWORD, options = {}) {
  const response = await request(base, '/api/auth/login', {
    ...options,
    body: { email, password },
  });
  return assertSession(response, 200, email.trim().toLowerCase());
}

function saveBody(generation, baseRevision, deviceId, state) {
  return { generation: typeof generation === 'number' ? `g${generation}` : generation, baseRevision, deviceId, state };
}

test('регистрация, duplicate, общий отказ входа, /me, logout и запрет free cloud', async (t) => {
  const { base, store } = await launch(t);
  const first = await register(base, ' Player@Example.Test ');
  const second = await login(base, EMAIL.toUpperCase(), PASSWORD);
  assert.equal(first.user.id, second.user.id);
  assert.equal(first.user.email, EMAIL);
  assert.notEqual(first.token, second.token);
  assert.deepEqual(first.supporter, { active: false, grantedAt: null });
  assert.equal(store.sessions.has(first.token), false);
  assert.equal(store.sessions.has(second.token), false);
  assert.equal(store.sessions.size, 2);
  assert.ok([...store.sessions.keys()].every((key) => /^[a-f0-9]{64}$/.test(key)));

  const duplicate = await request(base, '/api/auth/register', {
    body: { email: ` ${EMAIL.toUpperCase()} `, password: 'другой-пароль' },
  });
  assert.equal(duplicate.status, 409);
  assert.equal(duplicate.body.error, 'EMAIL_EXISTS');
  assert.equal(store.users.size, 1);

  const wrong = await request(base, '/api/auth/login', {
    body: { email: EMAIL, password: 'неправильный-пароль' },
  });
  const missing = await request(base, '/api/auth/login', {
    body: { email: 'missing@example.test', password: 'неправильный-пароль' },
  });
  assert.equal(wrong.status, 401);
  assert.equal(wrong.body.error, 'INVALID_CREDENTIALS');
  assert.deepEqual(missing.body, wrong.body);
  assert.equal(missing.status, wrong.status);
  assert.equal(wrong.headers.get('cache-control'), 'no-store');

  const me = await request(base, '/api/auth/me', { token: first.token });
  assert.equal(me.status, 200);
  assert.deepEqual(me.body.user, { id: first.user.id, email: EMAIL });
  assert.equal(me.headers.get('cache-control'), 'no-store');

  const anonymous = await request(base, '/api/cloud-save');
  assert.equal(anonymous.status, 401);
  assert.equal(anonymous.body.error, 'AUTH_REQUIRED');
  const freeGet = await request(base, '/api/cloud-save', { token: first.token });
  assert.equal(freeGet.status, 403);
  assert.equal(freeGet.body.error, 'SUPPORTER_REQUIRED');
  const freePut = await request(base, '/api/cloud-save', {
    method: 'PUT',
    token: first.token,
    body: saveBody(1, 0, 'free', { coins: 1 }),
  });
  assert.equal(freePut.status, 403);
  assert.equal(freePut.body.error, 'SUPPORTER_REQUIRED');

  const logout = await request(base, '/api/auth/logout', { method: 'POST', token: first.token });
  assert.equal(logout.status, 200);
  const revoked = await request(base, '/api/auth/me', { token: first.token });
  assert.equal(revoked.status, 401);
  const otherSession = await request(base, '/api/auth/me', { token: second.token });
  assert.equal(otherSession.status, 200);
});

test('смена пароля отзывает все старые сессии и выдаёт только новую', async (t) => {
  const { base, store } = await launch(t);
  const first = await register(base);
  const second = await login(base);
  const previousHash = store.credentials.get(EMAIL).passwordHash;
  const wrongLogin = await request(base, '/api/auth/login', {
    body: { email: EMAIL, password: 'неправильный-пароль' },
  });
  const wrongCurrent = await request(base, '/api/auth/change-password', {
    token: first.token,
    body: { currentPassword: 'неправильный-пароль', newPassword: 'новый-надёжный-пароль' },
  });
  assert.equal(wrongCurrent.status, 401);
  assert.deepEqual(wrongCurrent.body, wrongLogin.body);
  assert.equal((await request(base, '/api/auth/me', { token: first.token })).status, 200);
  assert.equal((await request(base, '/api/auth/me', { token: second.token })).status, 200);

  const changed = assertSession(await request(base, '/api/auth/change-password', {
    token: first.token,
    body: { currentPassword: PASSWORD, newPassword: 'новый-надёжный-пароль' },
  }), 200);
  assert.equal(changed.user.id, first.user.id);
  assert.notEqual(changed.token, first.token);
  assert.notEqual(changed.token, second.token);
  assert.notEqual(store.credentials.get(EMAIL).passwordHash, previousHash);
  assert.equal(store.sessions.size, 1);
  for (const oldToken of [first.token, second.token]) {
    const response = await request(base, '/api/auth/me', { token: oldToken });
    assert.equal(response.status, 401);
    assert.equal(response.body.error, 'AUTH_REQUIRED');
  }
  assert.equal((await request(base, '/api/auth/me', { token: changed.token })).status, 200);

  const oldPassword = await request(base, '/api/auth/login', {
    body: { email: EMAIL, password: PASSWORD },
  });
  assert.equal(oldPassword.status, 401);
  assert.equal(oldPassword.body.error, 'INVALID_CREDENTIALS');
  const renewed = await login(base, EMAIL, 'новый-надёжный-пароль');
  assert.equal(renewed.user.id, first.user.id);
  assert.equal(store.sessions.size, 2);
});

test('test grant работает при register/login, а облако сохраняет CAS и изоляцию', async (t) => {
  const store = createMemoryStore();
  const firstServer = await launch(t, { store, testGrantSupporter: true });
  const a = await register(firstServer.base, 'shared@example.test');
  const b = await login(firstServer.base, 'shared@example.test', PASSWORD);
  assert.equal(a.user.id, b.user.id);
  assert.equal(a.supporter.active, true);
  assert.ok(a.supporter.grantedAt);
  assert.equal(b.supporter.active, true);

  const empty = await request(firstServer.base, '/api/cloud-save', { token: b.token });
  assert.deepEqual(empty.body.save, null);
  const first = await request(firstServer.base, '/api/cloud-save', {
    method: 'PUT',
    token: a.token,
    body: { ...saveBody(1, 0, 'device-A', { coins: 80, settings: { storyMode: true } }), sequence: 1 },
  });
  assert.equal(first.status, 200);
  assert.equal(first.body.revision, 1);
  assert.equal(first.body.generation, 'g1');
  assert.equal(first.body.schemaVersion, 1);
  assert.ok(Number.isFinite(Date.parse(first.body.updatedAt)));
  assert.ok(Number.isFinite(Date.parse(first.body.serverTime)));
  assert.equal(first.body.state, undefined);

  const fromB = await request(firstServer.base, '/api/cloud-save', { token: b.token });
  assert.equal(fromB.status, 200);
  assert.equal(fromB.body.save.revision, 1);
  assert.deepEqual(fromB.body.save.state, { coins: 80, settings: { storyMode: true } });
  const second = await request(firstServer.base, '/api/cloud-save', {
    method: 'PUT',
    token: b.token,
    body: saveBody(2, 1, 'device-B', { coins: 120, settings: { storyMode: false } }),
  });
  assert.equal(second.status, 200);
  assert.equal(second.body.revision, 2);
  assert.equal(second.body.generation, 'g2');

  const staleRevision = await request(firstServer.base, '/api/cloud-save', {
    method: 'PUT',
    token: a.token,
    body: saveBody(2, 1, 'device-A', { coins: 1 }),
  });
  assert.equal(staleRevision.status, 409);
  assert.equal(staleRevision.body.error, 'SAVE_CONFLICT');
  assert.equal(staleRevision.body.save.revision, 2);
  assert.deepEqual(staleRevision.body.save.state, { coins: 120, settings: { storyMode: false } });
  const staleGeneration = await request(firstServer.base, '/api/cloud-save', {
    method: 'PUT',
    token: a.token,
    body: saveBody(1, 1, 'device-A', { coins: 1 }),
  });
  assert.equal(staleGeneration.status, 409);
  assert.equal(staleGeneration.body.save.generation, 'g2');
  const nextGeneration = await request(firstServer.base, '/api/cloud-save', {
    method: 'PUT',
    token: a.token,
    body: saveBody(3, 2, 'device-A', { coins: 200 }),
  });
  assert.equal(nextGeneration.status, 200);
  assert.equal(nextGeneration.body.revision, 3);
  assert.equal(nextGeneration.body.generation, 'g3');

  const stranger = await register(firstServer.base, 'stranger@example.test');
  const foreign = await request(firstServer.base, '/api/cloud-save', { token: stranger.token });
  assert.equal(foreign.status, 200);
  assert.equal(foreign.body.save, null);
  const foreignPut = await request(firstServer.base, '/api/cloud-save', {
    method: 'PUT',
    token: stranger.token,
    body: saveBody(3, 3, 'stranger', { coins: 999999 }),
  });
  assert.equal(foreignPut.status, 409);
  assert.equal(foreignPut.body.save, null);

  await stop(firstServer.server);
  const restarted = await launch(t, { store, testGrantSupporter: true });
  const afterRestart = await request(restarted.base, '/api/cloud-save', { token: b.token });
  assert.equal(afterRestart.status, 200);
  assert.equal(afterRestart.body.save.revision, 3);
  assert.deepEqual(afterRestart.body.save.state, { coins: 200 });
  const repeated = await login(restarted.base, 'shared@example.test', PASSWORD);
  assert.equal(repeated.user.id, a.user.id);

  const noTestMode = await launch(t, { testMode: false, testGrantSupporter: true, store: createMemoryStore() });
  const productionLike = await register(noTestMode.base, 'production@example.test');
  assert.deepEqual(productionLike.supporter, { active: false, grantedAt: null });
});

test('строгие auth-входы, Unicode-границы и лимит тела', async (t) => {
  const { base } = await launch(t);
  const invalidEmails = [
    '', 'plain', 'player@localhost', 'a@@example.test', 'a b@example.test',
    'a@example..test', 'a@.example.test', 'a@example.test.', 'a\tb@example.test',
    'a\u0000@example.test', `${'a'.repeat(250)}@example.test`,
  ];
  for (const email of invalidEmails) {
    const response = await request(base, '/api/auth/register', { body: { email, password: PASSWORD } });
    assert.equal(response.status, 400, email);
    assert.equal(response.body.error, 'INVALID_AUTH_REQUEST');
  }
  for (const password of ['', 'к'.repeat(9), '😀'.repeat(129), null, 1234567890]) {
    const response = await request(base, '/api/auth/register', {
      body: { email: 'strict@example.test', password },
    });
    assert.equal(response.status, 400);
    assert.equal(response.body.error, 'INVALID_AUTH_REQUEST');
  }
  for (const body of [
    null, [], { email: EMAIL }, { password: PASSWORD },
    { email: EMAIL, password: PASSWORD, extra: true },
  ]) {
    const response = await request(base, '/api/auth/register', { body });
    assert.equal(response.status, 400);
    assert.equal(response.body.error, 'INVALID_AUTH_REQUEST');
  }
  const malformed = await request(base, '/api/auth/login', { rawBody: '{' });
  assert.equal(malformed.status, 400);
  assert.equal(malformed.body.error, 'INVALID_JSON');
  const wrongMethod = await request(base, '/api/auth/register', { method: 'GET' });
  assert.equal(wrongMethod.status, 405);
  assert.equal(wrongMethod.headers.get('allow'), 'POST');

  await register(base, 'cyrillic@example.test', 'ё'.repeat(10));
  await register(base, 'emoji@example.test', '😀'.repeat(10));
  await register(base, 'maximum@example.test', 'я'.repeat(128));
  const oversized = await request(base, '/api/auth/register', {
    body: { email: 'oversized@example.test', password: 'x'.repeat(17000) },
  });
  assert.equal(oversized.status, 413);
  assert.equal(oversized.body.error, 'BODY_TOO_LARGE');
});

test('облачные envelope, CORS и rate limit по IP+email', async (t) => {
  const { base } = await launch(t, { testGrantSupporter: true });
  const auth = await register(base, 'validation@example.test');
  const invalidEnvelope = await request(base, '/api/cloud-save', {
    method: 'PUT',
    token: auth.token,
    body: { ...saveBody(1, 0, 'validation', { coins: 1 }), schemaVersion: 1 },
  });
  assert.equal(invalidEnvelope.status, 400);
  assert.equal(invalidEnvelope.body.error, 'INVALID_SAVE');
  const invalidState = await request(base, '/api/cloud-save', {
    method: 'PUT',
    token: auth.token,
    body: saveBody(1, 0, 'validation', []),
  });
  assert.equal(invalidState.status, 400);
  const oversizedCloud = await request(base, '/api/cloud-save', {
    method: 'PUT',
    token: auth.token,
    body: saveBody(1, 0, 'validation', { text: 'я'.repeat(1024 * 1024) }),
  });
  assert.equal(oversizedCloud.status, 413);
  assert.equal(oversizedCloud.body.error, 'BODY_TOO_LARGE');

  const cors = await request(base, '/api/auth/me', { token: auth.token, origin: 'https://k8rvin.github.io' });
  assert.equal(cors.headers.get('access-control-allow-origin'), 'https://k8rvin.github.io');
  const preflight = await request(base, '/api/cloud-save', {
    method: 'OPTIONS',
    origin: 'https://k8rvin.github.io',
    headers: { 'Access-Control-Request-Method': 'PUT', 'Access-Control-Request-Headers': 'authorization,content-type' },
  });
  assert.equal(preflight.status, 204);
  assert.match(preflight.headers.get('access-control-allow-methods'), /PUT/);
  assert.match(preflight.headers.get('access-control-allow-headers'), /Authorization/);
  const nullOrigin = await request(base, '/api/auth/me', { token: auth.token, origin: 'null' });
  assert.equal(nullOrigin.headers.get('access-control-allow-origin'), null);
  const disallowed = await request(base, '/api/auth/me', { token: auth.token, origin: 'https://evil.example' });
  assert.equal(disallowed.headers.get('access-control-allow-origin'), null);

  const limited = await launch(t, { loginRateLimit: 2 });
  await register(limited.base, 'limited@example.test', PASSWORD, {
    headers: { 'X-Forwarded-For': '203.0.113.10' },
  });
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const response = await request(limited.base, '/api/auth/login', {
      body: { email: 'limited@example.test', password: 'неправильный-пароль' },
    });
    assert.equal(response.status, 401);
  }
  const limitedLogin = await request(limited.base, '/api/auth/login', {
    body: { email: 'limited@example.test', password: PASSWORD },
  });
  assert.equal(limitedLogin.status, 429);
  assert.equal(limitedLogin.body.error, 'LOGIN_RATE_LIMIT');
  await register(limited.base, 'other@example.test');
  const health = await request(limited.base, '/health');
  assert.equal(health.status, 200);
});

test('браузерский accountClient проходит реальные register/login/PUT/GET/logout', async (t) => {
  const { createAccountClient } = await import('../src/ui/accountClient.js');
  const { base } = await launch(t, { testGrantSupporter: true });
  const values = new Map();
  const client = createAccountClient({
    baseUrl: base,
    storage: {
      getItem: (key) => values.get(key) || null,
      setItem: (key, value) => values.set(key, String(value)),
      removeItem: (key) => values.delete(key),
    },
    fetchImpl: fetch,
  });
  const credentials = { email: 'browser@example.test', password: PASSWORD };
  const registered = await client.register(credentials);
  assert.equal(registered.supporter.active, true);
  await client.logout();
  const profile = await client.login(credentials);
  assert.equal(profile.email, credentials.email);
  const put = await client.putCloudSave({
    generation: 'browser-generation',
    baseRevision: 0,
    deviceId: 'browser-device',
    sequence: 1,
    state: { coins: 80, inventory: [] },
  });
  assert.equal(put.revision, 1);
  const cloud = await client.getCloudSave();
  assert.equal(cloud.generation, 'browser-generation');
  assert.deepEqual(cloud.state, { coins: 80, inventory: [] });
  await client.logout();
  assert.equal(client.getAccessToken(), null);
});
