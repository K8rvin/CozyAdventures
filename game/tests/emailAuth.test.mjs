import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createMemoryStore } from '../tools/server/memoryStore.js';
import {
  getDummyPasswordHash,
  hashPassword,
  isValidPassword,
  normalizeEmail,
  verifyPassword,
} from '../tools/server/passwords.js';

test('normalizeEmail и длина пароля соблюдают Unicode-границы', () => {
  assert.equal(normalizeEmail(' Player@Example.Test '), 'player@example.test');
  assert.equal(normalizeEmail('player+shop@example.test'), 'player+shop@example.test');
  for (const value of [null, 42, '', 'a', 'a@localhost', 'a@@b.test', 'a b@b.test', 'a@b..test']) {
    assert.equal(normalizeEmail(value), null);
  }
  assert.equal(normalizeEmail(`${'a'.repeat(250)}@example.test`), null);
  assert.equal(isValidPassword('ё'.repeat(9)), false);
  assert.equal(isValidPassword('ё'.repeat(10)), true);
  assert.equal(isValidPassword('😀'.repeat(128)), true);
  assert.equal(isValidPassword('😀'.repeat(129)), false);
});

test('scrypt использует отдельную соль и constant-time сверку результата', async () => {
  const password = 'пароль-с-кириллицей';
  const first = await hashPassword(password);
  const second = await hashPassword(password);
  assert.match(first, /^scrypt\$16384\$8\$1\$[A-Za-z0-9_-]+\$[A-Za-z0-9_-]+$/);
  assert.notEqual(first, second);
  assert.equal(first.includes(password), false);
  assert.equal(await verifyPassword(password, first), true);
  assert.equal(await verifyPassword('другой-пароль', first), false);
  assert.equal(await verifyPassword(password, `${first}x`), false);
  assert.equal(await verifyPassword(password, 'invalid'), false);
  const dummy = await getDummyPasswordHash();
  assert.match(dummy, /^scrypt\$16384\$8\$1\$/);
  assert.equal(await getDummyPasswordHash(), dummy);
  assert.equal(await verifyPassword(password, dummy), false);
});

test('memory store атомарно отклоняет duplicate и не возвращает hash через сессию', async () => {
  const store = createMemoryStore();
  const email = 'atomic@example.test';
  const passwordHash = await hashPassword('атомарный-пароль');
  const results = await Promise.all([
    store.registerUser(email, passwordHash),
    store.registerUser(email, passwordHash),
  ]);
  assert.equal(results.filter(Boolean).length, 1);
  assert.equal(store.users.size, 1);
  const user = results.find(Boolean);
  const credentialUser = await store.getUserByEmail(email);
  assert.equal(credentialUser.passwordHash, passwordHash);
  await store.createSession(user.id, 'a'.repeat(64), new Date(Date.now() + 60000).toISOString());
  const sessionUser = await store.getSessionUser('a'.repeat(64));
  assert.deepEqual(sessionUser, user);
  assert.equal(sessionUser.passwordHash, undefined);
  assert.equal(await store.updateUserPassword(user.id, 'scrypt$new'), true);
  assert.equal((await store.getUserByEmail(email)).passwordHash, 'scrypt$new');
  await store.revokeAllSessions(user.id);
  assert.equal(await store.getSessionUser('a'.repeat(64)), null);
});
