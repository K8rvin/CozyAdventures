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
    this.parent = null;
    this.dataset = {};
    this.attributes = {};
    this.style = { setProperty: () => {} };
    this._className = '';
    this._listeners = {};
    this._text = '';
    this.hidden = false;
    this.complete = false;
    this.naturalWidth = 0;
  }

  set className(value) { this._className = String(value || ''); }
  get className() { return this._className; }
  get classList() {
    const el = this;
    return {
      add: (...names) => { el.className = [...new Set([...classes(el), ...names])].join(' '); },
      remove: (...names) => { el.className = classes(el).filter((name) => !names.includes(name)).join(' '); },
      contains: (name) => classes(el).includes(name),
      toggle: (name, force) => {
        const add = force === undefined ? !classes(el).includes(name) : !!force;
        if (add) el.classList.add(name);
        else el.classList.remove(name);
        return add;
      },
    };
  }

  set textContent(value) {
    this._text = String(value ?? '');
    this.children = [];
  }
  get textContent() { return this._text; }
  set innerHTML(value) { this._innerHTML = String(value); this.children = []; }
  get innerHTML() { return this._innerHTML || ''; }

  appendChild(child) {
    if (child && typeof child === 'object') child.parent = this;
    this.children.push(child);
    return child;
  }
  append(...children) { for (const child of children) this.appendChild(child); }
  remove() {
    if (!this.parent) return;
    const index = this.parent.children.indexOf(this);
    if (index >= 0) this.parent.children.splice(index, 1);
    this.parent = null;
  }
  addEventListener(type, fn, options = {}) {
    (this._listeners[type] ||= []).push({ fn, once: !!options.once });
  }
  removeEventListener(type, fn) {
    this._listeners[type] = (this._listeners[type] || []).filter((entry) => entry.fn !== fn);
  }
  dispatch(type) {
    for (const entry of [...(this._listeners[type] || [])]) {
      entry.fn.call(this, { target: this });
      if (entry.once) this.removeEventListener(type, entry.fn);
    }
  }
  listenerCount(type) { return (this._listeners[type] || []).length; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getContext() {
    const noop = () => {};
    return new Proxy({}, {
      get: (target, prop) => {
        if (prop === 'createRadialGradient' || prop === 'createLinearGradient') {
          return () => ({ addColorStop: noop });
        }
        return noop;
      },
      set: () => true,
    });
  }
  decode() { return Promise.resolve(); }
  get isConnected() {
    let current = this;
    while (current.parent) current = current.parent;
    return current === documentStub.body;
  }
}

const createdImages = [];
const documentStub = {
  createElement(tag) {
    const el = new El(tag);
    if (tag.toLowerCase() === 'img') createdImages.push(el);
    return el;
  },
  body: new El('body'),
};
globalThis.document = documentStub;
globalThis.window = { devicePixelRatio: 1 };

const { newGame } = await import('../src/core/state.js');
const { resolveKnightDoll } = await import('../src/core/knightDoll.js');
const { KNIGHT_DOLL_ASSET_FILES } = await import('../src/data/knightDollAssets.js');
const { createKnightDoll } = await import('../src/ui/knightDollView.js');

const originalManifest = [...KNIGHT_DOLL_ASSET_FILES];

function releaseCurrent(state) {
  for (const layer of resolveKnightDoll(state)) {
    if (layer.required) KNIGHT_DOLL_ASSET_FILES.add(layer.src);
  }
}

function mount(state) {
  const view = createKnightDoll(state);
  documentStub.body.appendChild(view.el);
  return view;
}

function loaders() {
  return createdImages.filter((img) => img.listenerCount('load') || img.listenerCount('error'));
}

async function flush() {
  await new Promise((resolve) => setTimeout(resolve, 0));
  await Promise.resolve();
}

function layers(view) {
  return flat(view.el).filter((el) => classes(el).includes('knight-layer'));
}

function fallback(view) {
  return flat(view.el).find((el) => classes(el).includes('knight-fallback'));
}

function layerStack(view) {
  return flat(view.el).find((el) => classes(el).includes('knight-layers'));
}

test('без выпущенных файлов остаётся только прежний Canvas, без сетевых попыток', (t) => {
  KNIGHT_DOLL_ASSET_FILES.clear();
  createdImages.length = 0;
  const view = mount(newGame());
  t.after(() => {
    view.destroy();
    view.el.remove();
    KNIGHT_DOLL_ASSET_FILES.clear();
    for (const src of originalManifest) KNIGHT_DOLL_ASSET_FILES.add(src);
  });
  assert.ok(fallback(view));
  assert.equal(fallback(view).hidden, false);
  assert.equal(createdImages.length, 0);
  assert.equal(layers(view).length, 0);
});

test('полный загруженный комплект заменяет fallback и подсвечивает выбранный слот', async (t) => {
  KNIGHT_DOLL_ASSET_FILES.clear();
  createdImages.length = 0;
  const state = newGame();
  releaseCurrent(state);
  const view = mount(state);
  t.after(() => {
    view.destroy();
    view.el.remove();
    KNIGHT_DOLL_ASSET_FILES.clear();
    for (const src of originalManifest) KNIGHT_DOLL_ASSET_FILES.add(src);
  });
  for (const img of loaders()) {
    img.complete = true;
    img.naturalWidth = 768;
    img.dispatch('load');
  }
  await flush();
  const expected = resolveKnightDoll(state).filter((layer) => layer.required);
  assert.equal(layers(view).length, expected.length);
  assert.equal(fallback(view).hidden, true);
  assert.equal(layerStack(view).hidden, false);
  assert.equal(view.el.attributes.role, 'img');
  assert.match(view.el.attributes['aria-label'], /Дедов меч/);

  view.setHighlight('weapon');
  const highlighted = layers(view).filter((el) => classes(el).includes('is-highlighted'));
  assert.ok(highlighted.length > 0);
  assert.ok(highlighted.every((el) => el.dataset.equipSlot === 'weapon'));
  view.setHighlight(null);
  assert.ok(!layers(view).some((el) => classes(el).includes('is-highlighted')));
});

test('ошибка обязательного файла сохраняет весь fallback и не показывает часть набора', async (t) => {
  KNIGHT_DOLL_ASSET_FILES.clear();
  createdImages.length = 0;
  const state = newGame();
  state.inventory.push('arm_padded');
  const index = state.inventory.indexOf('arm_padded');
  const { equipFromInventory } = await import('../src/core/state.js');
  equipFromInventory(state, index);
  releaseCurrent(state);
  const view = mount(state);
  t.after(() => {
    view.destroy();
    view.el.remove();
    KNIGHT_DOLL_ASSET_FILES.clear();
    for (const src of originalManifest) KNIGHT_DOLL_ASSET_FILES.add(src);
  });
  const pending = loaders();
  const broken = pending.find((img) => img.src === 'assets/knight/parts/male/arm_padded.webp');
  assert.ok(broken);
  for (const img of pending) {
    if (img === broken) continue;
    img.complete = true;
    img.naturalWidth = 768;
    img.dispatch('load');
  }
  broken.dispatch('error');
  await flush();
  assert.equal(fallback(view).hidden, false);
  assert.equal(layerStack(view).hidden, true);
});

test('ошибка необязательного питомца заменяется его emoji, не затрагивая экипировку', async (t) => {
  KNIGHT_DOLL_ASSET_FILES.clear();
  createdImages.length = 0;
  const state = newGame();
  state.pet = 'pet_fox';
  releaseCurrent(state);
  const view = mount(state);
  t.after(() => {
    view.destroy();
    view.el.remove();
    KNIGHT_DOLL_ASSET_FILES.clear();
    for (const src of originalManifest) KNIGHT_DOLL_ASSET_FILES.add(src);
  });
  for (const img of loaders()) {
    if (img.src === 'assets/pets/pet_fox.webp') continue;
    img.complete = true;
    img.naturalWidth = 768;
    img.dispatch('load');
  }
  await flush();
  const pet = createdImages.find((img) => img.src === 'assets/pets/pet_fox.webp');
  assert.ok(pet);
  pet.dispatch('error');
  await flush();
  assert.equal(fallback(view).hidden, true);
  assert.equal(layerStack(view).hidden, false);
  assert.ok(flat(view.el).some((el) => el.textContent === '🦊'));
});

test('destroy запрещает позднее переключение на загруженные слои', async (t) => {
  KNIGHT_DOLL_ASSET_FILES.clear();
  createdImages.length = 0;
  const state = newGame();
  state.equipped.weapon = 'wpn_greatsword_oak';
  releaseCurrent(state);
  const view = mount(state);
  t.after(() => {
    view.el.remove();
    KNIGHT_DOLL_ASSET_FILES.clear();
    for (const src of originalManifest) KNIGHT_DOLL_ASSET_FILES.add(src);
  });
  view.destroy();
  for (const img of loaders()) {
    img.complete = true;
    img.naturalWidth = 768;
    img.dispatch('load');
  }
  await flush();
  assert.equal(fallback(view).hidden, false);
  assert.equal(layerStack(view).hidden, true);
});
