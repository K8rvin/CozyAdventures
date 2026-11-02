import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createKnightServer } from '../tools/knight-server.mjs';
import { createAccountClient } from '../src/ui/accountClient.js';
import { createPersistence } from '../src/ui/persistence.js';
import { newGame } from '../src/core/state.js';

function storage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}

test('два устройства синхронизируют реальный HTTP сейв и явно решают конфликт', async (t) => {
  const cacheDir = await mkdtemp(join(tmpdir(), 'cloud-persistence-'));
  const server = await createKnightServer({
    cacheDir, testMode: true, testGrantSupporter: true, loginRateLimit: 100,
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const services = [];
  t.after(async () => {
    for (const service of services) service.destroy();
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    await rm(cacheDir, { recursive: true, force: true });
  });

  async function device(hadLocalSave, choice = 'local', mode = 'login') {
    const account = createAccountClient({ baseUrl: base, storage: storage(), fetchImpl: fetch });
    const credentials = { email: 'two-devices@example.test', password: 'общий-надёжный-пароль' };
    if (mode === 'register') await account.register(credentials);
    else await account.login(credentials);
    let state = newGame();
    const service = createPersistence({
      account, storage: storage(), hadLocalSave,
      getState: () => state,
      replaceState(next) { state = next; },
      confirmInitialUpload: async () => true,
      chooseConflict: async () => choice,
    });
    services.push(service);
    return { account, service, get state() { return state; }, set state(next) { state = next; } };
  }

  const a = await device(true, 'local', 'register');
  await a.service.setEnabled(true);
  a.state.coins = 140;
  a.service.notifyDirty();
  await a.service.syncNow();
  assert.equal(a.service.getStatus().baseRevision, 2);

  const b = await device(false);
  await b.service.setEnabled(true);
  assert.equal(b.state.coins, 140);
  assert.equal(b.service.getStatus().baseRevision, 2);

  a.state.coins = 200;
  a.service.notifyDirty();
  b.state.coins = 300;
  b.service.notifyDirty();
  await b.service.syncNow();
  assert.equal(b.service.getStatus().baseRevision, 3);
  await a.service.syncNow();
  assert.equal(a.service.getStatus().baseRevision, 4, 'выбор устройства записывается от свежей ревизии');

  const cloud = await b.account.getCloudSave();
  assert.equal(cloud.state.coins, 200);
  assert.equal(cloud.revision, 4);
});
