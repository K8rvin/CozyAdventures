// Проверка: собранный bundle.js загружается и приложение стартует.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';

function makeCtx2d() {
  const noop = () => {};
  return new Proxy({}, {
    get: (t, prop) => {
      if (prop === 'createRadialGradient' || prop === 'createLinearGradient') {
        return () => ({ addColorStop: noop });
      }
      if (prop === 'measureText') return () => ({ width: 0 });
      return noop;
    },
    set: () => true,
  });
}

class El {
  constructor(tag) {
    this.tagName = tag;
    this.children = [];
    this.style = {};
    this.classList = {
      _s: new Set(),
      add: (...c) => c.forEach((x) => this.classList._s.add(x)),
      remove: (...c) => c.forEach((x) => this.classList._s.delete(x)),
      toggle: (c, f) => (f ? this.classList._s.add(c) : this.classList._s.delete(c)),
    };
    this._listeners = {};
    this.title = '';
    this.dataset = {};
  }
  set className(v) { this._className = v; }
  get className() { return this._className || ''; }
  set innerHTML(v) { this._innerHTML = v; this.children = []; }
  get innerHTML() { return this._innerHTML || ''; }
  set textContent(v) { this._text = v; }
  get textContent() { return this._text || ''; }
  appendChild(c) { if (c && typeof c === 'object') c.parent = this; this.children.push(c); return c; }
  append(...cs) { cs.forEach((c) => this.appendChild(c)); }
  prepend(c) { c.parent = this; this.children.unshift(c); return c; }
  remove() {
    if (!this.parent) return;
    const i = this.parent.children.indexOf(this);
    if (i >= 0) this.parent.children.splice(i, 1);
    this.parent = null;
  }
  addEventListener(t, f) { (this._listeners[t] ||= []).push(f); }
  removeEventListener() {}
  getBoundingClientRect() { return { left: 0, top: 0, width: 100, height: 100 }; }
  getContext() { return makeCtx2d(); }
  querySelector() { return new El('div'); }
  get firstElementChild() { return this.children[0] || new El('div'); }
  setAttribute() {}
}

test('bundle.js существует и приложение стартует без ошибок', async () => {
  assert.ok(existsSync(new URL('../bundle.js', import.meta.url)), 'bundle.js должен быть собран (npm run build)');

  const byId = {
    screen: new El('main'),
    toast: new El('div'),
    'wallet-coins': new El('span'),
    'wallet-seals': new El('span'),
  };
  globalThis.document = {
    createElement: (t) => new El(t),
    getElementById: (id) => byId[id] || new El('div'),
    body: new El('body'),
    documentElement: Object.assign(new El('html'), { scrollHeight: 2000 }),
    addEventListener: () => {},
    removeEventListener: () => {},
  };
  globalThis.window = {
    addEventListener: () => {},
    removeEventListener: () => {},
    devicePixelRatio: 1,
    scrollTo: () => {},
    scrollX: 0,
    scrollY: 0,
    innerWidth: 1024,
    innerHeight: 768,
  };
  globalThis.localStorage = {
    _m: {},
    getItem(k) { return this._m[k] ?? null; },
    setItem(k, v) { this._m[k] = String(v); },
    removeItem(k) { delete this._m[k]; },
  };
  globalThis.confirm = () => false;

  await import('../bundle.js');

  // Хаб отрисован, кошелёк обновлён
  assert.ok(byId.screen.children.length > 0, 'хаб должен отрисоваться');
  assert.ok(byId['wallet-coins'].textContent.includes('80'), 'стартовые монеты в топбаре');
});
