import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newGame } from '../src/core/state.js';
import { createPersistence } from '../src/ui/persistence.js';

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}

function makeAccount(initial = null) {
  let remote = initial ? structuredClone(initial) : null;
  const account = {
    puts: 0,
    snapshot() { return { profile: { id: 'user-1' } }; },
    isSupporter() { return true; },
    async getCloudSave() {
      if (!remote) throw Object.assign(new Error('Нет сейва'), { status: 404 });
      return structuredClone(remote);
    },
    async putCloudSave(payload) {
      if (remote && payload.baseRevision !== remote.revision) {
        throw Object.assign(new Error('Конфликт'), { status: 409 });
      }
      this.puts += 1;
      remote = {
        schemaVersion: 1,
        generation: payload.generation,
        revision: (remote?.revision || 0) + 1,
        state: structuredClone(payload.state),
        updatedAt: '2026-01-01T00:00:00Z',
      };
      return structuredClone(remote);
    },
    get remote() { return remote; },
  };
  return account;
}

function harness({ account = makeAccount(), state = newGame(), hadLocalSave = true, choice = 'local', confirm = true } = {}) {
  const storage = memoryStorage();
  const service = createPersistence({
    account, storage, hadLocalSave,
    getState: () => state,
    replaceState(next) { state = next; },
    chooseConflict: async () => choice,
    confirmInitialUpload: async () => confirm,
  });
  return {
    account, service, storage,
    get state() { return state; },
    set state(value) { state = value; },
    destroy() { service.destroy(); },
  };
}

test('первая привязка требует согласия и создаёт первую ревизию', async () => {
  const denied = harness({ confirm: false });
  await denied.service.setEnabled(true);
  assert.equal(denied.account.puts, 0);
  assert.equal(denied.service.getStatus().enabled, false);
  denied.destroy();

  const h = harness();
  await h.service.setEnabled(true);
  assert.equal(h.account.puts, 1);
  assert.equal(h.account.remote.revision, 1);
  assert.equal(h.account.remote.state.coins, 80);
  assert.equal(h.service.getStatus().pending, false);
  h.state.coins = 120;
  h.service.notifyDirty();
  await h.service.syncNow();
  assert.equal(h.account.remote.revision, 2);
  assert.equal(h.account.remote.state.coins, 120);
  h.destroy();
});

test('на новом устройстве облачный сейв скачивается и мигрируется', async () => {
  const remoteState = newGame();
  remoteState.coins = 555;
  const account = makeAccount({ schemaVersion: 1, generation: 'cloud-1', revision: 4, state: remoteState });
  const h = harness({ account, hadLocalSave: false });
  await h.service.setEnabled(true);
  assert.equal(h.state.coins, 555);
  assert.equal(h.account.puts, 0);
  assert.equal(h.service.getStatus().generation, 'cloud-1');
  h.destroy();
});

test('конфликт решается явным выбором облака или устройства', async () => {
  const remoteState = newGame();
  remoteState.coins = 700;
  const account = makeAccount({ schemaVersion: 1, generation: 'cloud-2', revision: 3, state: remoteState });
  const remote = harness({ account, choice: 'remote' });
  await remote.service.setEnabled(true);
  assert.equal(remote.state.coins, 700);
  assert.equal(remote.account.puts, 0);
  remote.destroy();

  const local = harness({ account, choice: 'local' });
  await local.service.setEnabled(true);
  assert.equal(local.account.remote.state.coins, 80);
  assert.equal(local.account.remote.revision, 4);
  assert.equal(local.service.getStatus().pending, false);
  local.destroy();
});

test('logout не удаляет локальное состояние, новая игра меняет generation', async () => {
  const h = harness();
  await h.service.setEnabled(true);
  const generation = h.service.getStatus().generation;
  h.service.reset();
  assert.equal(h.state.coins, 80);
  assert.equal(h.service.getStatus().enabled, false);
  await h.service.setEnabled(true);
  h.service.beginNewGeneration();
  assert.notEqual(h.service.getStatus().generation, generation);
  await h.service.syncNow();
  assert.notEqual(h.account.remote.generation, generation);
  assert.equal(h.account.remote.revision, 3, 'повторная привязка и новое поколение — две записи');
  h.destroy();
});

test('export/import использует оболочку без аккаунтных данных', async () => {
  const h = harness();
  const raw = h.service.exportSave();
  assert.doesNotMatch(raw, /sessionToken|supporter|user-1/);
  const other = newGame();
  other.coins = 999;
  const imported = h.service.importSave(JSON.stringify({ schemaVersion: 1, generation: 'file-1', state: other }));
  assert.equal(imported.state.coins, 999);
  assert.equal(h.state.coins, 999);
  assert.equal(h.service.getStatus().generation, 'file-1');
  h.destroy();
});

test('другая вкладка останавливает автосохранение до выбора конфликта', async () => {
  const previous = globalThis.window;
  class Channel {
    static all = [];
    constructor() { Channel.all.push(this); }
    postMessage(data) {
      for (const other of Channel.all) {
        if (other !== this && other.onmessage) other.onmessage({ data });
      }
    }
    close() { Channel.all = Channel.all.filter((item) => item !== this); }
  }
  globalThis.window = {
    BroadcastChannel: Channel,
    addEventListener() {},
    removeEventListener() {},
  };
  const account = makeAccount();
  const shared = memoryStorage();
  const firstState = newGame();
  const secondState = newGame();
  const first = createPersistence({
    account, storage: shared, hadLocalSave: true,
    getState: () => firstState, replaceState() {},
    confirmInitialUpload: async () => true, chooseConflict: async () => 'local',
  });
  const second = createPersistence({
    account, storage: shared, hadLocalSave: true,
    getState: () => secondState, replaceState() {},
    confirmInitialUpload: async () => true, chooseConflict: async () => 'local',
  });
  try {
    await first.setEnabled(true);
    await second.setEnabled(true);
    first.notifyDirty();
    assert.equal(second.getStatus().status, 'conflict');
    assert.match(second.getStatus().error, /Другая вкладка/);
  } finally {
    first.destroy();
    second.destroy();
    globalThis.window = previous;
  }
});
