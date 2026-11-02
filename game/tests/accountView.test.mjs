import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createAccountSection } from '../src/ui/accountView.js';

class El {
  constructor(tag) { this.tagName = tag; this.children = []; this.dataset = {}; this.style = {}; this._listeners = {}; this.value = ''; }
  set className(value) { this._className = value; }
  get className() { return this._className || ''; }
  set innerHTML(value) { this._innerHTML = String(value); this.children = []; }
  get innerHTML() { return this._innerHTML || ''; }
  set textContent(value) { this._text = String(value); this.children = []; }
  get textContent() { return this._text || ''; }
  appendChild(child) { this.children.push(child); child.parent = this; return child; }
  append(...children) { children.forEach((child) => this.appendChild(child)); }
  addEventListener(type, listener) { (this._listeners[type] ||= []).push(listener); }
  setAttribute(name, value) { this[name] = String(value); }
  async click() {
    for (const listener of this._listeners.click || []) await listener({ preventDefault() {} });
  }
  async submit() {
    for (const listener of this._listeners.submit || []) await listener({ preventDefault() {} });
  }
}

function flat(root, out = []) {
  out.push(root);
  for (const child of root.children || []) flat(child, out);
  return out;
}
function byData(root, key, value) {
  return flat(root).find((el) => value === undefined ? el.dataset?.[key] !== undefined : el.dataset?.[key] === value);
}
function byText(root, text) {
  return flat(root).find((el) => el.textContent === text);
}

test('форма регистрации и смены пароля не оставляет пароли в DOM', async () => {
  globalThis.document = { createElement: (tag) => new El(tag) };
  let snapshot = {
    configured: true, status: 'anonymous', profile: null, lastError: '',
    supporter: { active: false, grantedAt: null },
  };
  const calls = [];
  const account = {
    snapshot: () => snapshot,
    subscribe(listener) { this.listener = listener; listener(snapshot); return () => {}; },
    emit() { this.listener?.(snapshot); },
    async register(credentials) {
      calls.push(['register', credentials]);
      snapshot = { ...snapshot, status: 'authenticated', profile: { id: 'u1', email: credentials.email }, supporter: { active: true, grantedAt: 'now' } };
      this.emit();
      return snapshot.profile;
    },
    async login(credentials) { calls.push(['login', credentials]); return snapshot.profile; },
    async changePassword(credentials) {
      calls.push(['changePassword', credentials]);
      this.emit();
      return snapshot.profile;
    },
    async logout() {},
  };
  const view = createAccountSection({
    account,
    toast() {},
    persistence: {
      getStatus: () => ({ enabled: false, status: 'local' }),
      subscribe: () => () => {},
    },
  });
  byData(view.element, 'authMode', 'register').click();
  const form = byData(view.element, 'authForm', 'register');
  byData(form, 'emailInput', '1').value = 'user@example.test';
  byData(form, 'passwordInput', 'new-password').value = 'secret-password';
  await form.submit();
  assert.deepEqual(calls[0], ['register', { email: 'user@example.test', password: 'secret-password' }]);
  assert.equal(byData(form, 'passwordInput', 'new-password').value, '');

  byText(view.element, 'Сменить пароль').click();
  const change = byData(view.element, 'authForm', 'change');
  byData(change, 'passwordInput', 'current-password').value = 'secret-password';
  byData(change, 'passwordInput', 'new-password').value = 'next-password';
  await change.submit();
  assert.deepEqual(calls[1], ['changePassword', { currentPassword: 'secret-password', newPassword: 'next-password' }]);
  assert.equal(byData(change, 'passwordInput', 'current-password').value, '');
  assert.equal(byData(change, 'passwordInput', 'new-password').value, '');
  view.destroy();
});
