import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createKnightServer } from '../tools/knight-server.mjs';
import { PostgresStore } from '../tools/server/postgresStore.js';
import { hashPassword } from '../tools/server/passwords.js';

const ADMIN_URL = process.env.COZY_TEST_DATABASE_URL;
const options = { skip: !ADMIN_URL };

async function withTemporaryDatabase(run) {
  const { default: pg } = await import('pg');
  const admin = new pg.Pool({ connectionString: ADMIN_URL, max: 2 });
  const name = `email_auth_${randomUUID().replaceAll('-', '')}`;
  let created = false;
  try {
    await admin.query(`CREATE DATABASE "${name}"`);
    created = true;
    const url = new URL(ADMIN_URL);
    url.pathname = `/${name}`;
    return await run({ pg, url: url.toString() });
  } finally {
    try {
      if (created) await admin.query(`DROP DATABASE "${name}" WITH (FORCE)`);
    } finally {
      await admin.end();
    }
  }
}

async function request(base, path, { token, method, body } = {}) {
  const response = await fetch(`${base}${path}`, {
    method: method || (body === undefined ? 'GET' : 'POST'),
    headers: {
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: response.status, body: await response.json() };
}

test('PostgreSQL проходит HTTP register/login/me/cloud/change-password и unique register', options, async () => {
  await withTemporaryDatabase(async ({ pg, url }) => {
    const cacheDir = await mkdtemp(join(tmpdir(), 'postgres-email-auth-'));
    let server = null;
    let pool = null;
    try {
      server = await createKnightServer({
        cacheDir,
        env: {},
        databaseUrl: url,
        testMode: true,
        testGrantSupporter: true,
        loginRateLimit: 100,
      });
      await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
      pool = new pg.Pool({ connectionString: url, max: 2 });
      const base = `http://127.0.0.1:${server.address().port}`;
      const email = 'postgres@example.test';
      const password = 'пароль-для-postgres';
      const registered = await request(base, '/api/auth/register', { body: { email, password } });
      assert.equal(registered.status, 201);
      assert.deepEqual(Object.keys(registered.body.user).sort(), ['email', 'id']);
      assert.equal(registered.body.user.email, email);
      assert.equal(registered.body.supporter.active, true);
      const firstToken = registered.body.sessionToken;

      const duplicate = await request(base, '/api/auth/register', { body: { email, password } });
      assert.equal(duplicate.status, 409);
      assert.equal(duplicate.body.error, 'EMAIL_EXISTS');
      const loggedIn = await request(base, '/api/auth/login', { body: { email, password } });
      assert.equal(loggedIn.status, 200);
      assert.equal(loggedIn.body.user.id, registered.body.user.id);
      const secondToken = loggedIn.body.sessionToken;
      const me = await request(base, '/api/auth/me', { token: firstToken });
      assert.deepEqual(me.body.user, { id: registered.body.user.id, email });
      assert.equal(me.body.user.passwordHash, undefined);

      const put = await request(base, '/api/cloud-save', {
        method: 'PUT',
        token: firstToken,
        body: { generation: 'pg-generation', baseRevision: 0, deviceId: 'pg-device', state: { coins: 42 } },
      });
      assert.equal(put.status, 200);
      assert.equal(put.body.revision, 1);
      const cloud = await request(base, '/api/cloud-save', { token: secondToken });
      assert.deepEqual(cloud.body.save.state, { coins: 42 });

      const newPassword = 'новый-пароль-postgres';
      const changed = await request(base, '/api/auth/change-password', {
        token: firstToken,
        body: { currentPassword: password, newPassword },
      });
      assert.equal(changed.status, 200);
      for (const oldToken of [firstToken, secondToken]) {
        assert.equal((await request(base, '/api/auth/me', { token: oldToken })).status, 401);
      }
      assert.equal((await request(base, '/api/auth/me', { token: changed.body.sessionToken })).status, 200);
      assert.equal((await request(base, '/api/auth/login', { body: { email, password } })).status, 401);
      assert.equal((await request(base, '/api/auth/login', { body: { email, password: newPassword } })).status, 200);

      const atomicHash = await hashPassword('атомарный-postgres');
      const atomic = await Promise.all([
        server.accountStore.registerUser('atomic-pg@example.test', atomicHash),
        server.accountStore.registerUser('atomic-pg@example.test', atomicHash),
      ]);
      assert.equal(atomic.filter(Boolean).length, 1);

      const credential = await pool.query('SELECT password_hash FROM auth_credentials WHERE email = $1', [email]);
      assert.match(credential.rows[0].password_hash, /^scrypt\$16384\$8\$1\$/);
      assert.equal(credential.rows[0].password_hash.includes(password), false);
      assert.equal(credential.rows[0].password_hash.includes(newPassword), false);
      assert.equal((await pool.query("SELECT to_regclass('public.identities') AS table_name")).rows[0].table_name, null);
      assert.equal((await pool.query('SELECT count(*)::int AS count FROM users')).rows[0].count, 2);
      assert.equal((await pool.query('SELECT count(*)::int AS count FROM entitlements')).rows[0].count, 1);
      assert.equal((await pool.query('SELECT count(*)::int AS count FROM cloud_saves')).rows[0].count, 1);
    } finally {
      if (server?.listening) {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
      }
      if (pool) await pool.end();
      await rm(cacheDir, { recursive: true, force: true });
    }
  });
});

test('миграция с непустыми identities падает и сохраняет все старые данные', options, async () => {
  await withTemporaryDatabase(async ({ pg, url }) => {
    const pool = new pg.Pool({ connectionString: url, max: 2 });
    try {
      const initialSql = await readFile(new URL('../tools/server/migrations/001_accounts.sql', import.meta.url), 'utf8');
      await pool.query(initialSql);
      const user = await pool.query('INSERT INTO users(id) VALUES ($1) RETURNING id', [randomUUID()]);
      const userId = user.rows[0].id;
      await pool.query("INSERT INTO identities(provider, subject, user_id) VALUES ('legacy', 'manual-mapping', $1)", [userId]);
      await pool.query("INSERT INTO entitlements(user_id, key) VALUES ($1, 'supporter_edition')", [userId]);
      await pool.query(
        `INSERT INTO cloud_saves(user_id, generation, revision, schema_version, state, device_id)
         VALUES ($1, 'legacy-generation', 1, 1, $2::jsonb, 'legacy-device')`,
        [userId, JSON.stringify({ coins: 77 })],
      );

      const store = new PostgresStore(pool, false);
      await assert.rejects(store.migrate(), /ручное сопоставление/);
      assert.equal((await pool.query('SELECT count(*)::int AS count FROM identities')).rows[0].count, 1);
      assert.equal((await pool.query('SELECT count(*)::int AS count FROM users')).rows[0].count, 1);
      assert.equal((await pool.query('SELECT count(*)::int AS count FROM entitlements')).rows[0].count, 1);
      assert.equal((await pool.query('SELECT count(*)::int AS count FROM cloud_saves')).rows[0].count, 1);
      assert.deepEqual((await pool.query('SELECT state FROM cloud_saves WHERE user_id = $1', [userId])).rows[0].state, { coins: 77 });
      assert.equal((await pool.query("SELECT to_regclass('public.auth_credentials') AS table_name")).rows[0].table_name, null);
    } finally {
      await pool.end();
    }
  });
});
