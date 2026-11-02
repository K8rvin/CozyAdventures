import http from 'node:http';
import { createReadStream, existsSync } from 'node:fs';
import { mkdir, readFile, rename, stat, unlink, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildKnightImagePrompt, canonicalKnightImageState } from '../src/core/knightImagePrompt.js';
import { bodyJson, HttpError, json } from './server/http.js';
import { createAccountStore } from './server/store.js';
import { createAccountRouter } from './server/accountRoutes.js';

const execFileAsync = promisify(execFile);

const GAME_ROOT = fileURLToPath(new URL('..', import.meta.url));
const REPO_ROOT = resolve(GAME_ROOT, '..');
const CONVERTER = join(GAME_ROOT, 'tools', 'convert-knight-image.py');
const TEST_PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+0h0kAAAAASUVORK5CYII=';
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

function loadEnv() {
  const path = join(REPO_ROOT, '.env');
  if (!existsSync(path)) return {};
  const result = {};
  return readFile(path, 'utf8').then((text) => {
    for (const line of text.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (match) result[match[1]] = match[2].trim();
    }
    return result;
  });
}

async function configuration(options) {
  const env = options.env || (options.testMode ? {} : await loadEnv());
  const testMode = options.testMode ?? (process.env.KNIGHT_TEST_MODE || env.KNIGHT_TEST_MODE) === '1';
  const provider = options.provider || process.env.KNIGHT_IMAGE_PROVIDER || env.KNIGHT_IMAGE_PROVIDER || (!testMode && (process.env.OPENROUTER_API_KEY || env.OPENROUTER_API_KEY) ? 'openrouter' : 'gemini');
  const apiKey = provider === 'openrouter'
    ? options.apiKey || process.env.OPENROUTER_API_KEY || env.OPENROUTER_API_KEY || ''
    : options.apiKey || process.env.GEMINI_API_KEY || env.GEMINI_API_KEY || '';
  const origins = options.allowedOrigins || (process.env.KNIGHT_ALLOWED_ORIGINS || env.KNIGHT_ALLOWED_ORIGINS || 'https://k8rvin.github.io,http://localhost:8787,http://127.0.0.1:8787,http://localhost:8081,http://127.0.0.1:8081').split(',');
  const databaseUrl = options.databaseUrl || process.env.DATABASE_URL || env.DATABASE_URL || '';
  if ((process.env.NODE_ENV || env.NODE_ENV) === 'production' && !testMode && !options.store && !databaseUrl) {
    throw new Error('DATABASE_URL обязателен в production: memory store запрещён');
  }
  return {
    provider,
    cacheDir: options.cacheDir || process.env.KNIGHT_CACHE_DIR || env.KNIGHT_CACHE_DIR || join(GAME_ROOT, '.cache', 'knight'),
    model: options.model || (provider === 'openrouter' ? process.env.OPENROUTER_IMAGE_MODEL || env.OPENROUTER_IMAGE_MODEL || 'google/gemini-3.1-flash-image' : process.env.GEMINI_IMAGE_MODEL || env.GEMINI_IMAGE_MODEL || 'gemini-nano-banana-2.1'),
    apiKey,
    testMode,
    allowedOrigins: new Set(origins.map((origin) => origin.trim()).filter((origin) => origin && origin !== 'null')),
    rateLimit: options.rateLimit || Number(process.env.KNIGHT_RATE_LIMIT || env.KNIGHT_RATE_LIMIT || 20),
    publicUrl: options.publicUrl || process.env.KNIGHT_PUBLIC_URL || env.KNIGHT_PUBLIC_URL || '',
    store: options.store,
    databaseUrl,
    databasePoolSize: options.databasePoolSize || Number(process.env.DATABASE_POOL_SIZE || env.DATABASE_POOL_SIZE || 0) || undefined,
    databaseSsl: options.databaseSsl,
    testGrantSupporter: options.testGrantSupporter === true,
    loginRateLimit: options.loginRateLimit ?? Number(process.env.KNIGHT_LOGIN_RATE_LIMIT || env.KNIGHT_LOGIN_RATE_LIMIT || 10),
    sessionTtlSeconds: options.sessionTtlSeconds || Number(process.env.ACCOUNT_SESSION_TTL_SECONDS || env.ACCOUNT_SESSION_TTL_SECONDS || 0) || undefined,
  };
}

function cors(req, res, config) {
  const origin = req.headers.origin;
  if (origin && config.allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
}

function publicBase(req, config) {
  if (config.publicUrl) return config.publicUrl.replace(/\/$/, '');
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  return `${protocol}://${req.headers.host}`;
}

function hashRequest(built, model) {
  return createHash('sha256').update(`${model}\0${built.promptVersion}\0${built.key}`).digest('hex');
}

async function callGemini(built, config) {
  const bodyPath = join(REPO_ROOT, 'art-src', 'knight', 'doll', built.bodyId, 'full.png');
  const roomPath = join(REPO_ROOT, 'art-src', 'knight', 'room_no_mirrors.png');
  const references = [
    { label: `Reference 1: approved ${built.bodyId} body and identity`, path: bodyPath, mime: 'image/png' },
    { label: 'Reference 2: approved room', path: roomPath, mime: 'image/png' },
    ...built.itemIds.map((id, index) => ({
      label: `Reference ${index + 3}: exact inventory design for ${id}`,
      path: join(GAME_ROOT, 'assets', 'items', `${id}_web.jpg`),
      mime: 'image/jpeg',
    })),
  ];
  const input = [];
  for (const reference of references) {
    input.push({ type: 'text', text: reference.label });
    input.push({ type: 'image', mime_type: reference.mime, data: (await readFile(reference.path)).toString('base64') });
  }
  input.push({ type: 'text', text: built.prompt });
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': config.apiKey },
      body: JSON.stringify({
        model: config.model,
        input,
        response_format: { type: 'image', mime_type: 'image/jpeg', aspect_ratio: '4:5', image_size: '1K' },
      }),
      signal: AbortSignal.timeout(120000),
    });
    if (response.ok) {
      const data = await response.json();
      const encoded = data.output_image?.data || data.interaction?.output_image?.data;
      if (!encoded) throw new Error('Gemini не вернул изображение');
      return Buffer.from(encoded, 'base64');
    }
    if ((response.status === 429 || response.status >= 500) && attempt === 0) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      continue;
    }
    const text = await response.text().catch(() => '');
    throw new HttpError(502, `Gemini HTTP ${response.status}: ${text.slice(0, 160)}`);
  }
  throw new Error('Gemini не вернул изображение');
}

async function callOpenRouter(built, config) {
  const references = [
    { label: `Reference 1: approved ${built.bodyId} body and identity`, path: join(REPO_ROOT, 'art-src', 'knight', 'doll', built.bodyId, 'full.png'), mime: 'image/png' },
    { label: 'Reference 2: approved room', path: join(REPO_ROOT, 'art-src', 'knight', 'room_no_mirrors.png'), mime: 'image/png' },
    ...built.itemIds.map((id, index) => ({
      label: `Reference ${index + 3}: exact inventory design for ${id}`,
      path: join(GAME_ROOT, 'assets', 'items', `${id}_web.jpg`),
      mime: 'image/jpeg',
    })),
  ];
  const content = [];
  for (const reference of references) {
    content.push({ type: 'text', text: reference.label });
    content.push({ type: 'image_url', image_url: { url: `data:${reference.mime};base64,${(await readFile(reference.path)).toString('base64')}` } });
  }
  content.push({ type: 'text', text: built.prompt });
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
        'HTTP-Referer': 'https://k8rvin.github.io/CozyAdventures/',
        'X-OpenRouter-Title': 'Cozy Adventures',
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: 'user', content }],
        modalities: ['image', 'text'],
        image_config: { aspect_ratio: '4:5', image_size: '1K' },
      }),
      signal: AbortSignal.timeout(120000),
    });
    if (response.ok) {
      const data = await response.json();
      const image = data.choices?.[0]?.message?.images?.[0];
      const url = image?.image_url?.url || image?.imageUrl?.url || '';
      if (!url.startsWith('data:image/')) throw new Error('OpenRouter не вернул изображение');
      return Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
    }
    if ((response.status === 429 || response.status >= 500) && attempt === 0) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      continue;
    }
    const text = await response.text().catch(() => '');
    throw new HttpError(502, `OpenRouter HTTP ${response.status}: ${text.slice(0, 160)}`);
  }
  throw new Error('OpenRouter не вернул изображение');
}

export async function createKnightServer(options = {}) {
  const config = await configuration(options);
  const inflight = new Map();
  const rates = new Map();
  const stats = { generations: 0, active: 0, queued: 0 };
  await mkdir(config.cacheDir, { recursive: true });
  const accountStore = await createAccountStore(config);
  const accounts = createAccountRouter({ ...config, store: accountStore.store });

  function rateAllowed(req) {
    const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
    const now = Date.now();
    const current = rates.get(ip) || { start: now, count: 0 };
    if (now - current.start >= 3600000) {
      current.start = now;
      current.count = 0;
    }
    if (current.count >= config.rateLimit) return false;
    current.count += 1;
    rates.set(ip, current);
    return true;
  }

  async function convert(raw, built, key, force = false) {
    const rawPath = join(config.cacheDir, `.${key}.raw.png`);
    const outputPath = join(config.cacheDir, `${key}.webp`);
    const metadataPath = join(config.cacheDir, `${key}.json`);
    try {
      await writeFile(rawPath, raw);
      const python = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');
      const args = [
        CONVERTER, rawPath, outputPath, metadataPath,
        '--key', key,
        '--model', config.model,
        '--prompt-version', String(built.promptVersion),
        '--state', JSON.stringify(canonicalKnightImageState(built.state)),
      ];
      if (force) args.push('--force');
      try {
        await execFileAsync(python, args, { encoding: 'utf8', timeout: 30000, maxBuffer: 1024 * 1024, windowsHide: true });
      } catch (error) {
        throw new Error(`Конвертация не удалась: ${error.stderr || error.message}`);
      }
      stats.generations += 1;
    } finally {
      await unlink(rawPath).catch(() => {});
      await unlink(join(config.cacheDir, `.${key}.tmp.webp`)).catch(() => {});
    }
  }

  async function versionedUrl(baseUrl, cachedPath) {
    const info = await stat(cachedPath);
    return `${baseUrl}?v=${Math.round(info.mtimeMs).toString(36)}`;
  }

  async function generate(payload, req) {
    const built = buildKnightImagePrompt(payload);
    built.state = payload;
    const key = hashRequest(built, config.model);
    const baseUrl = `${publicBase(req, config)}/api/knight-cache/${key}.webp`;
    const cachedPath = join(config.cacheDir, `${key}.webp`);
    if (payload.regenerate !== true && existsSync(cachedPath)) return { key, url: await versionedUrl(baseUrl, cachedPath), cached: true };
    if (inflight.has(key)) return inflight.get(key);
    if (!config.testMode && !config.apiKey) throw new HttpError(503, 'Gemini API key не настроен');
    if (!rateAllowed(req)) throw new HttpError(429, 'Слишком много генераций, попробуйте позже');
    const promise = (async () => {
      stats.queued += 1;
      while (stats.active >= 2) await new Promise((resolve) => setTimeout(resolve, 25));
      stats.queued -= 1;
      stats.active += 1;
      try {
        const raw = config.testMode ? Buffer.from(TEST_PNG, 'base64') : await (config.provider === 'openrouter' ? callOpenRouter(built, config) : callGemini(built, config));
        await convert(raw, built, key, payload.regenerate === true);
        return { key, url: await versionedUrl(baseUrl, cachedPath), cached: false };
      } finally {
        stats.active -= 1;
      }
    })();
    inflight.set(key, promise);
    try {
      return await promise;
    } finally {
      inflight.delete(key);
    }
  }

  function fail(req, res, error) {
    const status = error.status || (error instanceof TypeError ? 400 : 500);
    const pathname = String(req.url || '').split('?')[0];
    const accountRoute = pathname.startsWith('/api/auth/') || pathname === '/api/cloud-save';
    if (status >= 500) {
      console.error(accountRoute ? `[knight-server] Ошибка маршрута ${pathname}` : `[knight-server] ${error.message}`);
    }
    if (res.headersSent) {
      res.end();
      return;
    }
    const fallback = pathname === '/api/knight-image'
      ? 'Не удалось создать портрет'
      : pathname === '/api/cloud-save'
        ? 'Не удалось обработать облачное сохранение'
        : accountRoute
          ? 'Не удалось обработать запрос аккаунта'
          : 'Внутренняя ошибка сервера';
    const body = error.code
      ? { error: error.code, code: error.code, message: status >= 500 && !(error instanceof HttpError) ? fallback : error.message }
      : { error: status >= 500 ? fallback : error.message };
    if (error.details && typeof error.details === 'object') Object.assign(body, error.details);
    json(res, status, body);
  }

  async function handle(req, res) {
    cors(req, res, config);
    try {
      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
      }
      const url = new URL(req.url, 'http://localhost');
      if (url.pathname === '/health') {
        json(res, 200, { ok: true, provider: config.provider, model: config.model, configured: config.testMode || Boolean(config.apiKey), generations: stats.generations, active: stats.active, queued: stats.queued });
        return;
      }
      if (await accounts.handle(req, res)) return;
      if (url.pathname === '/api/knight-image' && req.method === 'POST') {
        const result = await generate(await bodyJson(req), req);
        json(res, 200, result);
        return;
      }
      if (url.pathname.startsWith('/api/knight-cache/') && req.method === 'GET') {
        const name = url.pathname.slice('/api/knight-cache/'.length);
        if (!/^[a-f0-9]{64}\.webp$/.test(name)) throw new HttpError(404, 'Изображение не найдено');
        const file = join(config.cacheDir, name);
        if (!existsSync(file)) throw new HttpError(404, 'Изображение не найдено');
        res.writeHead(200, { 'Content-Type': 'image/webp', 'Cache-Control': 'public, max-age=31536000, immutable' });
        createReadStream(file).pipe(res);
        return;
      }
      if (url.pathname.startsWith('/api/')) throw new HttpError(404, 'Маршрут не найден');
      if (req.method !== 'GET' && req.method !== 'HEAD') throw new HttpError(405, 'Метод не поддерживается');
      const pathname = decodeURIComponent(url.pathname);
      if (pathname.split('/').some((part) => part.startsWith('.'))) throw new HttpError(404, 'Файл не найден');
      const file = resolve(GAME_ROOT, `.${pathname === '/' ? '/index.html' : pathname}`);
      if (!file.startsWith(GAME_ROOT) || !existsSync(file) || !(await stat(file)).isFile()) throw new HttpError(404, 'Файл не найден');
      res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
      if (req.method === 'HEAD') res.end();
      else createReadStream(file).pipe(res);
    } catch (error) {
      fail(req, res, error);
    }
  }

  const server = http.createServer((req, res) => {
    handle(req, res).catch((error) => fail(req, res, error));
  });
  server.on('close', () => {
    if (accountStore.owned) accountStore.store.close().catch(() => console.error('[knight-server] Не удалось закрыть store'));
  });
  server.knightStats = stats;
  server.accountStore = accountStore.store;
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 8787);
  const server = await createKnightServer();
  server.listen(port, '0.0.0.0', () => console.log(`Комната рыцаря: http://127.0.0.1:${port}`));
}
