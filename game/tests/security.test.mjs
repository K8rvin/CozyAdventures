import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { escapeHtml } from '../src/ui/common.js';
import { renderWorkshop } from '../src/ui/editorView.js';
import { newGame } from '../src/core/state.js';

class El {
  constructor() { this.children = []; this.style = {}; this.dataset = {}; this._listeners = {}; }
  set className(value) { this._className = value; }
  get className() { return this._className || ''; }
  set innerHTML(value) { this._innerHTML = String(value); this.children = []; }
  get innerHTML() { return this._innerHTML || ''; }
  set textContent(value) { this._text = String(value); this.children = []; }
  appendChild(child) { this.children.push(child); child.parent = this; return child; }
  append(...children) { children.forEach((child) => this.appendChild(child)); }
  addEventListener(type, fn) { (this._listeners[type] ||= []).push(fn); }
  setAttribute() {}
}

function flat(root, out = []) {
  out.push(root);
  for (const child of root.children || []) flat(child, out);
  return out;
}

test('пользовательские строки экранируются перед HTML', () => {
  assert.equal(escapeHtml('<img src=x onerror="boom">'), '&lt;img src=x onerror=&quot;boom&quot;&gt;');
  globalThis.document = {
    createElement: () => new El(),
    getElementById: () => new El(),
    body: new El(),
  };
  const state = newGame();
  state.customPuzzles.push({ id: 'custom_bad', name: '<img src=x onerror="boom">', grid: [2, 2], objects: [] });
  const root = new El();
  renderWorkshop(root, { state, go() {}, save() {} });
  const html = flat(root).map((el) => el.innerHTML).join('\n');
  assert.doesNotMatch(html, /<img src=x/);
  assert.match(html, /&lt;img src=x onerror=&quot;boom&quot;&gt;/);
});

test('CSP без inline/unsafe-eval, Service Worker не кэширует приватные API', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const sw = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
  assert.match(html, /Content-Security-Policy/);
  assert.match(html, /script-src 'self'/);
  assert.doesNotMatch(html, /accounts\.google\.com|oauth2\.googleapis\.com|unsafe-eval|<script>\s*\(function/);
  assert.match(html, /<script src="bootstrap\.js" defer><\/script>/);
  assert.match(sw, /url\.pathname\.startsWith\('\/api\/'\)/);
  assert.match(sw, /cozy-adventures-v6/);
});
