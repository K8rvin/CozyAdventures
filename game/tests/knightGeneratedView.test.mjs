import { test } from 'node:test';
import assert from 'node:assert/strict';

function classes(el) {
  return String(el.className || '').split(/\s+/).filter(Boolean);
}

function flat(el, out = []) {
  out.push(el);
  for (const child of el.children || []) flat(child, out);
  return out;
}

class El {
  constructor(tag) {
    this.tagName = tag.toUpperCase();
    this.children = [];
    this.dataset = {};
    this.attributes = {};
    this.style = {};
    this.hidden = false;
    this._className = '';
    this._listeners = {};
    this.textContent = '';
  }
  set className(value) { this._className = String(value || ''); }
  get className() { return this._className; }
  get classList() {
    const el = this;
    return {
      toggle(name, force) {
        const values = new Set(classes(el));
        const add = force === undefined ? !values.has(name) : !!force;
        if (add) values.add(name);
        else values.delete(name);
        el.className = [...values].join(' ');
      },
      contains(name) { return classes(el).includes(name); },
    };
  }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  appendChild(child) { this.children.push(child); return child; }
}

function makeIdb() {
  const records = new Map();
  const request = (value, action) => {
    const req = {};
    queueMicrotask(() => {
      action?.();
      req.result = value;
      req.onsuccess?.();
    });
    return req;
  };
  return {
    records,
    open() {
      const req = {};
      queueMicrotask(() => {
        req.result = {
          objectStoreNames: { contains: () => true },
          transaction() {
            const transaction = {
              objectStore() {
                return {
                  get: (key) => request(records.get(key)),
                  put: (value) => request(undefined, () => records.set(value.key, value)),
                };
              },
            };
            queueMicrotask(() => transaction.oncomplete?.());
            return transaction;
          },
          close() {},
        };
        req.onsuccess?.();
      });
      return req;
    },
  };
}

const originalFetch = globalThis.fetch;
const originalIdb = globalThis.indexedDB;
const originalApi = globalThis.KNIGHT_IMAGE_API_URL;
const originalObjectUrl = URL.createObjectURL;
globalThis.document = { createElement: (tag) => new El(tag) };
globalThis.window = {};
const { newGame } = await import('../src/core/state.js');
const { createKnightGeneratedDoll, resetKnightGeneratedCache } = await import('../src/ui/knightGeneratedView.js');

function cleanup(t) {
  t.after(() => {
    globalThis.fetch = originalFetch;
    globalThis.indexedDB = originalIdb;
    globalThis.KNIGHT_IMAGE_API_URL = originalApi;
    URL.createObjectURL = originalObjectUrl;
    resetKnightGeneratedCache();
  });
}

function flush(ms = 15) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test('без API нет запросов и нет старого fallback', async (t) => {
  cleanup(t);
  resetKnightGeneratedCache();
  globalThis.KNIGHT_IMAGE_API_URL = '';
  let calls = 0;
  globalThis.fetch = async () => { calls += 1; throw new Error('Сеть не нужна'); };
  const view = createKnightGeneratedDoll(newGame(), { debounceMs: 0 });
  t.after(() => view.destroy());
  await flush();
  assert.equal(calls, 0);
  assert.ok(!flat(view.el).some((el) => classes(el).includes('knight-fallback')));
  const empty = flat(view.el).find((el) => classes(el).includes('knight-empty'));
  assert.equal(empty.hidden, false);
  const status = flat(view.el).find((el) => classes(el).includes('knight-generation-status'));
  assert.match(status.textContent, /не настроен/);
});

test('успех сохраняет WebP в IndexedDB, повтор читается без сети', async (t) => {
  cleanup(t);
  resetKnightGeneratedCache();
  const idb = makeIdb();
  globalThis.indexedDB = idb;
  globalThis.KNIGHT_IMAGE_API_URL = 'http://api';
  const url = 'http://api/cache/portrait.webp';
  let apiCalls = 0;
  globalThis.fetch = async (target) => {
    if (target === 'http://api/api/knight-image') {
      apiCalls += 1;
      return { ok: true, json: async () => ({ key: 'a'.repeat(64), url, cached: false }) };
    }
    return { ok: true, blob: async () => ({ type: 'image/webp', size: 10 }) };
  };
  const view = createKnightGeneratedDoll(newGame(), { debounceMs: 0 });
  await flush();
  assert.equal(apiCalls, 1);
  assert.equal(idb.records.size, 1);
  const image = flat(view.el).find((el) => classes(el).includes('knight-generated-image'));
  assert.equal(image.src, url);
  assert.equal(image.hidden, false);
  view.destroy();
  resetKnightGeneratedCache();
  globalThis.KNIGHT_IMAGE_API_URL = '';
  URL.createObjectURL = (blob) => `blob:${blob.size}`;
  globalThis.fetch = async () => { throw new Error('Сеть не нужна'); };
  const cachedView = createKnightGeneratedDoll(newGame(), { debounceMs: 0 });
  t.after(() => cachedView.destroy());
  await flush();
  const cachedImage = flat(cachedView.el).find((el) => classes(el).includes('knight-generated-image'));
  assert.equal(cachedImage.src, 'blob:10');
  assert.equal(cachedImage.hidden, false);
});

test('при ошибке нового комплекта остаётся последнее generated image', async (t) => {
  cleanup(t);
  resetKnightGeneratedCache();
  globalThis.KNIGHT_IMAGE_API_URL = 'http://api';
  globalThis.fetch = async (target) => {
    if (target === 'http://api/api/knight-image') {
      return { ok: true, json: async () => ({ key: 'a'.repeat(64), url: 'http://api/ready.webp', cached: false }) };
    }
    return { ok: true, blob: async () => ({ type: 'image/webp' }) };
  };
  const first = createKnightGeneratedDoll(newGame(), { debounceMs: 0 });
  await flush();
  first.destroy();
  globalThis.fetch = async () => ({ ok: false, json: async () => ({ error: 'Временно недоступно' }) });
  const changed = newGame();
  changed.equipped.armor = 'arm_padded';
  const second = createKnightGeneratedDoll(changed, { debounceMs: 0 });
  t.after(() => second.destroy());
  await flush();
  const image = flat(second.el).find((el) => classes(el).includes('knight-generated-image'));
  assert.equal(image.src, 'http://api/ready.webp');
  assert.equal(image.hidden, false);
  const status = flat(second.el).find((el) => classes(el).includes('knight-generation-status'));
  assert.match(status.textContent, /Временно недоступно/);
});

test('destroy не даёт позднему ответу заменить портрет', async (t) => {
  cleanup(t);
  resetKnightGeneratedCache();
  globalThis.KNIGHT_IMAGE_API_URL = 'http://api';
  let resolveApi;
  globalThis.fetch = () => new Promise((resolve) => { resolveApi = resolve; });
  const view = createKnightGeneratedDoll(newGame(), { debounceMs: 0 });
  await flush(1);
  view.destroy();
  resolveApi({ ok: true, json: async () => ({ key: 'a'.repeat(64), url: 'http://api/late.webp' }) });
  await flush();
  const image = flat(view.el).find((el) => classes(el).includes('knight-generated-image'));
  assert.equal(image.hidden, true);
  const empty = flat(view.el).find((el) => classes(el).includes('knight-empty'));
  assert.equal(empty.hidden, false);
});
