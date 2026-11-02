import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createMinuteAutosave } from '../src/core/minuteAutosave.js';

function fakeScheduler() {
  let nextId = 1;
  const callbacks = new Map();
  const intervals = [];
  return {
    intervals,
    get size() { return callbacks.size; },
    setInterval(callback, milliseconds) {
      const id = nextId;
      nextId += 1;
      callbacks.set(id, callback);
      intervals.push(milliseconds);
      return id;
    },
    clearInterval(id) { callbacks.delete(id); },
    tick() {
      for (const callback of [...callbacks.values()]) callback();
    },
  };
}

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

function flush() {
  return new Promise((resolve) => setImmediate(resolve));
}

function makeHarness(options = {}) {
  const scheduler = fakeScheduler();
  const calls = [];
  const statuses = [];
  let snapshot = { generation: 'generation-1', state: { value: 0 } };
  let clock = 1000;
  const onPut = options.onPut || ((payload, index) => Promise.resolve({ revision: index }));
  const autosave = createMinuteAutosave({
    scheduler,
    deviceId: 'device-1',
    getSnapshot: () => snapshot,
    putSnapshot(payload) {
      calls.push(payload);
      return onPut(payload, calls.length);
    },
    onStatus: (status) => statuses.push(status),
    now: () => clock,
    ...options,
  });
  return {
    autosave, scheduler, calls, statuses,
    setSnapshot(value) { snapshot = { generation: 'generation-1', state: { value } }; },
    tickClock(value) { clock = value; },
  };
}

test('до 60 секунд сети нет, затем отправляется один последний snapshot', async () => {
  const h = makeHarness();
  h.autosave.start();
  assert.deepEqual(h.scheduler.intervals, [60000]);
  assert.equal(h.calls.length, 0);

  h.setSnapshot(1);
  h.autosave.notifyDirty();
  h.setSnapshot(2);
  h.autosave.notifyDirty();
  assert.equal(h.calls.length, 0, 'notifyDirty не вызывает сеть');
  h.scheduler.tick();
  assert.equal(h.calls.length, 1);
  assert.equal(h.calls[0].state.value, 2);
  assert.equal(h.calls[0].generation, 'generation-1');
  assert.equal(h.calls[0].baseRevision, 0);
  assert.equal(h.calls[0].deviceId, 'device-1');
  assert.equal(h.calls[0].sequence, 1);
  await flush();

  assert.deepEqual(h.autosave.getStatus(), {
    status: 'synced', dirty: false, baseRevision: 1, lastSyncedAt: 1000, sequence: 1, error: null,
  });
  h.autosave.destroy();
});

test('без dirty минутный цикл не делает запрос', () => {
  const h = makeHarness();
  h.autosave.start();
  h.scheduler.tick();
  h.scheduler.tick();
  assert.equal(h.calls.length, 0);
  assert.equal(h.autosave.getStatus().status, 'local');
  h.autosave.destroy();
});

test('изменения во время in-flight ждут следующего цикла', async () => {
  const requests = [];
  const h = makeHarness({ onPut: () => {
    const request = deferred();
    requests.push(request);
    return request.promise;
  } });
  h.autosave.start();
  h.setSnapshot(1);
  h.autosave.notifyDirty();
  h.scheduler.tick();
  assert.equal(h.calls.length, 1);

  h.setSnapshot(2);
  h.autosave.notifyDirty();
  h.scheduler.tick();
  assert.equal(h.calls.length, 1, 'single-flight не запускает второй запрос');
  requests[0].resolve({ revision: 10 });
  await flush();
  assert.equal(h.autosave.getStatus().status, 'pending');
  assert.equal(h.autosave.getStatus().dirty, true);
  assert.equal(h.autosave.getStatus().baseRevision, 10);

  h.scheduler.tick();
  assert.equal(h.calls.length, 2);
  assert.equal(h.calls[1].state.value, 2);
  assert.equal(h.calls[1].baseRevision, 10);
  assert.equal(h.calls[1].sequence, 2);
  requests[1].resolve({ revision: 11 });
  await flush();
  assert.equal(h.autosave.getStatus().dirty, false);
  assert.equal(h.autosave.getStatus().status, 'synced');
  h.autosave.destroy();
});

test('syncNow возвращает тот же promise и разделяет single-flight с таймером', async () => {
  const request = deferred();
  const h = makeHarness({ onPut: () => request.promise });
  h.autosave.start();
  h.setSnapshot(1);
  h.autosave.notifyDirty();
  const first = h.autosave.syncNow();
  const second = h.autosave.syncNow();
  assert.strictEqual(first, second);
  h.scheduler.tick();
  assert.equal(h.calls.length, 1);
  request.resolve({ revision: 7 });
  const [a, b] = await Promise.all([first, second]);
  assert.equal(a, b);
  assert.equal(h.autosave.getStatus().baseRevision, 7);
  h.autosave.destroy();
});

test('offline сохраняет dirty и повторяет отправку только в следующем цикле', async () => {
  const h = makeHarness({ onPut: (payload, index) => (
    index === 1 ? Promise.reject(new TypeError('fetch failed')) : Promise.resolve({ revision: 4 })
  ) });
  h.autosave.start();
  h.autosave.notifyDirty();
  h.scheduler.tick();
  await flush();
  assert.equal(h.autosave.getStatus().status, 'offline');
  assert.equal(h.autosave.getStatus().dirty, true);
  assert.equal(h.autosave.getStatus().baseRevision, 0);
  assert.equal(h.calls.length, 1);

  h.scheduler.tick();
  assert.equal(h.calls.length, 2);
  await flush();
  assert.equal(h.autosave.getStatus().status, 'synced');
  assert.equal(h.autosave.getStatus().dirty, false);
  h.autosave.destroy();
});

test('5xx даёт error и не вызывает немедленный retry', async () => {
  const failure = { status: 503 };
  const h = makeHarness({ onPut: () => Promise.reject(failure) });
  h.autosave.notifyDirty();
  await assert.rejects(h.autosave.syncNow(), (error) => error === failure);
  assert.equal(h.autosave.getStatus().status, 'error');
  assert.equal(h.autosave.getStatus().dirty, true);
  assert.equal(h.calls.length, 1);
  await flush();
  assert.equal(h.calls.length, 1);
  h.autosave.destroy();
});

test('409 вызывает onConflict и не перезаписывает baseRevision', async () => {
  const conflict = { code: 409, remoteRevision: 8 };
  const conflicts = [];
  const h = makeHarness({
    onPut: () => Promise.reject(conflict),
    onConflict: (error, snapshot) => conflicts.push({ error, snapshot }),
  });
  h.autosave.notifyDirty();
  await assert.rejects(h.autosave.syncNow(), (error) => error === conflict);
  assert.equal(h.autosave.getStatus().status, 'conflict');
  assert.equal(h.autosave.getStatus().dirty, true);
  assert.equal(h.autosave.getStatus().baseRevision, 0);
  assert.equal(conflicts.length, 1);
  assert.strictEqual(conflicts[0].error, conflict);
  assert.strictEqual(conflicts[0].snapshot.state, h.calls[0].state);
  assert.equal(conflicts[0].snapshot.sequence, 1);
  h.autosave.destroy();
});

test('stop очищает единый таймер без сети и сохраняет dirty', async () => {
  const h = makeHarness();
  h.autosave.start();
  h.autosave.start();
  assert.equal(h.scheduler.size, 1);
  h.autosave.notifyDirty();
  h.autosave.stop();
  assert.equal(h.scheduler.size, 0);
  h.scheduler.tick();
  assert.equal(h.calls.length, 0);
  assert.equal(h.autosave.getStatus().dirty, true);

  h.autosave.start();
  h.scheduler.tick();
  assert.equal(h.calls.length, 1);
  await flush();
  h.autosave.destroy();
});

test('disabled не отправляет и не теряет dirty', async () => {
  let enabled = false;
  const h = makeHarness({ isEnabled: () => enabled });
  h.autosave.start();
  h.autosave.notifyDirty();
  h.scheduler.tick();
  assert.equal(h.calls.length, 0);
  assert.equal(h.autosave.getStatus().status, 'pending');
  assert.equal(h.autosave.getStatus().dirty, true);

  enabled = true;
  h.scheduler.tick();
  assert.equal(h.calls.length, 1);
  await flush();
  h.autosave.destroy();
});

test('dirty persistence загружается и очищается только после успеха', async () => {
  const persisted = [];
  const h = makeHarness({
    loadPending: () => true,
    savePending: (value) => persisted.push(value),
  });
  h.autosave.start();
  assert.equal(h.autosave.getStatus().status, 'pending');
  assert.equal(h.calls.length, 0);
  h.autosave.notifyDirty();
  assert.deepEqual(persisted, [true]);
  h.scheduler.tick();
  await flush();
  assert.deepEqual(persisted, [true, false]);
  assert.equal(h.autosave.getStatus().dirty, false);
  h.autosave.destroy();
});

test('destroy не отменяет fetch, но запрещает позднему ответу менять статус и revision', async () => {
  const request = deferred();
  const h = makeHarness({ onPut: () => request.promise });
  h.autosave.start();
  h.autosave.notifyDirty();
  h.scheduler.tick();
  const before = h.autosave.getStatus();
  const statusCount = h.statuses.length;
  h.autosave.destroy();
  request.resolve({ revision: 99 });
  await flush();
  assert.deepEqual(h.autosave.getStatus(), before);
  assert.equal(h.autosave.getStatus().dirty, true);
  assert.equal(h.autosave.getStatus().baseRevision, 0);
  assert.equal(h.statuses.length, statusCount);
});
