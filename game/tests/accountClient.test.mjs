import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createAccountClient } from '../src/ui/accountClient.js';

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}

function response(data, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => data };
}

test('регистрация, вход и смена пароля сохраняют только session token', async () => {
  const storage = memoryStorage();
  const calls = [];
  const client = createAccountClient({
    baseUrl: 'https://api.example.test', storage,
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      if (url.endsWith('/api/auth/register')) {
        assert.deepEqual(JSON.parse(init.body), { email: 'user@example.test', password: 'secret-password' });
        return response({
          sessionToken: 'secret-session', expiresAt: '2027-01-01T00:00:00Z',
          user: { id: 'u1', email: 'user@example.test' }, supporter: { active: true, grantedAt: '2026-01-01T00:00:00Z' }, cloud: null,
        }, 201);
      }
      if (url.endsWith('/api/auth/change-password')) {
        assert.equal(init.headers.Authorization, 'Bearer secret-session');
        assert.deepEqual(JSON.parse(init.body), { currentPassword: 'secret-password', newPassword: 'next-password' });
        return response({
          sessionToken: 'next-session', expiresAt: '2027-02-01T00:00:00Z',
          user: { id: 'u1', email: 'user@example.test' }, supporter: { active: true, grantedAt: '2026-01-01T00:00:00Z' }, cloud: null,
        });
      }
      if (url.endsWith('/api/cloud-save') && init.method === 'PUT') {
        assert.equal(init.headers.Authorization, 'Bearer next-session');
        return response({ generation: 'g1', revision: 1, updatedAt: '2026-01-01T00:00:00Z' });
      }
      if (url.endsWith('/api/auth/logout')) return response({ ok: true });
      throw new Error(`Неожиданный ${url}`);
    },
  });
  assert.equal(client.isSupporter(), false);
  const profile = await client.register({ email: 'user@example.test', password: 'secret-password' });
  assert.equal(profile.email, 'user@example.test');
  assert.equal(client.isSupporter(), true);
  await client.changePassword({ currentPassword: 'secret-password', newPassword: 'next-password' });
  assert.equal(client.getAccessToken(), 'next-session');
  await client.putCloudSave({ generation: 'g1', baseRevision: 0, state: { coins: 80 } });
  const persisted = storage.getItem('cozy_account_session_v1');
  assert.ok(persisted.includes('next-session'));
  assert.doesNotMatch(persisted, /secret-password|next-password/);
  assert.equal(calls[0].init.headers.Authorization, undefined, 'до входа Bearer отсутствует');
  await client.logout();
  assert.equal(client.getAccessToken(), null);
  assert.equal(storage.getItem('cozy_account_session_v1'), null);
  assert.equal(client.isSupporter(), false);
});

test('истёкшая сессия удаляется при 401, сетевая ошибка сохраняет её', async () => {
  const storage = memoryStorage();
  storage.setItem('cozy_account_session_v1', JSON.stringify({ token: 'old' }));
  let status = 401;
  const client = createAccountClient({
    baseUrl: 'https://api.example.test', storage,
    fetchImpl: async () => {
      if (status === 0) throw new Error('offline');
      return response({ error: 'Сессия недействительна' }, status);
    },
  });
  await assert.rejects(client.refresh(), /Сессия/);
  assert.equal(client.getAccessToken(), null);
  storage.setItem('cozy_account_session_v1', JSON.stringify({ token: 'old-2' }));
  status = 0;
  const reloaded = createAccountClient({
    baseUrl: 'https://api.example.test', storage,
    fetchImpl: async () => { throw new Error('offline'); },
  });
  await assert.rejects(reloaded.refresh(), /offline/);
  assert.equal(reloaded.getAccessToken(), 'old-2');
});
