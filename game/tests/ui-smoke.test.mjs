// Smoke-тест UI: рендер всех экранов с минимальной DOM-заглушкой.
// Ловит опечатки и обращения к несуществующим функциям в render-путях.
import { test } from 'node:test';
import assert from 'node:assert/strict';

// --- Минимальный DOM ---
function makeCtx2d() {
  const noop = () => {};
  return new Proxy({}, {
    get: (t, prop) => {
      if (prop === 'createRadialGradient' || prop === 'createLinearGradient') {
        return () => ({ addColorStop: noop });
      }
      if (prop === 'measureText') return () => ({ width: 0 });
      if (prop === 'getTransform') return () => ({});
      return noop;
    },
    set: () => true,
  });
}

class El {
  constructor(tag) {
    this.tagName = tag;
    this.children = [];
    this.style = { setProperty: () => {} };
    this.classList = {
      _s: new Set(),
      add: (...c) => c.forEach((x) => this.classList._s.add(x)),
      remove: (...c) => c.forEach((x) => this.classList._s.delete(x)),
      toggle: (c, f) => (f ? this.classList._s.add(c) : this.classList._s.delete(c)),
      contains: (c) => this.classList._s.has(c),
    };
    this._listeners = {};
    this._innerHTML = '';
    this.title = '';
    this.disabled = false;
    this.dataset = {};
  }
  set className(v) { this._className = v; }
  get className() { return this._className || ''; }
  set innerHTML(v) {
    this._innerHTML = v;
    this.children = [];
  }
  get innerHTML() { return this._innerHTML; }
  set textContent(v) { this._text = v; this.children = []; }
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
  addEventListener(type, fn) { (this._listeners[type] ||= []).push(fn); }
  removeEventListener() {}
  click() { (this._listeners.click || []).forEach((f) => f({ preventDefault: () => {} })); }
  getBoundingClientRect() {
    // Для canvas возвращаем CSS-размер (width задан с учётом dpr=1)
    return {
      left: 0, top: 0,
      width: this.width ? this.width / (globalThis.window.devicePixelRatio || 1) : 100,
      height: this.height ? this.height / (globalThis.window.devicePixelRatio || 1) : 100,
    };
  }
  getContext() { return makeCtx2d(); }
  querySelector(sel) {
    // Заглушка: возвращаем элемент-пустышку с нужными полями
    const el = new El('div');
    if (sel === '.hpbar > div') return new El('div');
    return el;
  }
  get firstElementChild() { return this.children[0] || new El('div'); }
  setAttribute() {}
}

const listeners = {};
const documentStub = {
  createElement: (tag) => new El(tag),
  querySelector: () => new El('div'),
    getElementById: () => new El('div'),
  body: new El('body'),
  documentElement: Object.assign(new El('html'), { scrollHeight: 2000 }),
  addEventListener: (t, f) => { (listeners[t] ||= []).push(f); },
  removeEventListener: () => {},
};

globalThis.document = documentStub;
globalThis.window = {
  addEventListener: (t, f) => { (listeners[t] ||= []).push(f); },
  removeEventListener: () => {},
  devicePixelRatio: 1,
  scrollTo: () => {},
  scrollX: 0,
  scrollY: 0,
  innerWidth: 1024,
  innerHeight: 768,
};
globalThis.confirm = () => true;
globalThis.localStorage = {
  _m: {},
  getItem(k) { return this._m[k] ?? null; },
  setItem(k, v) { this._m[k] = String(v); },
  removeItem(k) { delete this._m[k]; },
};

const { newGame, saveGame } = await import('../src/core/state.js');
const { renderHub } = await import('../src/ui/hub.js');
const { renderPuzzleList, renderPuzzle } = await import('../src/ui/puzzleView.js');
const { renderEquip } = await import('../src/ui/equipView.js');
const { renderShop } = await import('../src/ui/shopView.js');
const { renderBattleList, renderBattle } = await import('../src/ui/battleView.js');
const { renderTavern } = await import('../src/ui/tavernView.js');
const { renderWorkshop, renderEditor } = await import('../src/ui/editorView.js');
const { renderCraft } = await import('../src/ui/craftView.js');
const { renderSettings } = await import('../src/ui/settingsView.js');
const { renderFormation } = await import('../src/ui/formationView.js');
const { renderSeekEditorList, renderSeekEditor } = await import('../src/ui/seekEditorView.js');
const { renderAchievements } = await import('../src/ui/achievementsView.js');
const { renderBoard } = await import('../src/ui/boardView.js');
const { renderMarket } = await import('../src/ui/shopView.js');
const { showCompareTip, hideCompareTip } = await import('../src/ui/shopView.js');
const { ITEM_BY_ID } = await import('../src/data/items.js');

function makeUiCtx(state) {
  return {
    state,
    save: () => saveGame(state),
    go: () => {},
    toast: () => {},
    newGameConfirm: () => {},
    sfx: () => {},
  };
}

test('все экраны рендерятся без ошибок', () => {
  const state = newGame();
  const ctx = makeUiCtx(state);

  const screens = [
    () => renderHub(new El('main'), ctx),
    () => renderPuzzleList(new El('main'), ctx),
    () => renderPuzzle(new El('main'), ctx, { id: 'md_01' }),
    () => renderPuzzle(new El('main'), ctx, { id: 'md_12' }),
    () => renderPuzzle(new El('main'), ctx, { id: 'tw_01' }),   // полки
    () => renderPuzzle(new El('main'), ctx, { id: 'tw_10' }),
    () => renderPuzzle(new El('main'), ctx, { id: 'bk_01' }),   // книжный чердак
    () => renderPuzzle(new El('main'), ctx, { id: 'bk_10' }),
    () => renderPuzzle(new El('main'), ctx, { id: 'sk_md_01' }), // поиск предметов
    () => renderPuzzle(new El('main'), ctx, { id: 'sk_bk_02' }),
    () => renderPuzzle(new El('main'), ctx, { id: 'pp_01' }),   // тропинка
    () => renderPuzzle(new El('main'), ctx, { id: 'pp_08' }),
    () => renderPuzzle(new El('main'), ctx, { id: 'tea_01' }),  // чай
    () => renderPuzzle(new El('main'), ctx, { id: 'tea_08' }),
    () => renderPuzzle(new El('main'), ctx, { id: 'brew_01' }), // варка зелий
    () => renderPuzzle(new El('main'), ctx, { id: 'brew_06' }), // варка на память
    () => renderEquip(new El('main'), ctx),
    () => renderShop(new El('main'), ctx),
    () => renderBattleList(new El('main'), ctx),
    () => renderBattle(new El('main'), ctx, { id: 'bt_slimes' }),
    () => renderBattle(new El('main'), ctx, { id: 'bt_boss_captain' }),
    () => renderTavern(new El('main'), ctx),
    () => renderCraft(new El('main'), ctx),
    () => renderSettings(new El('main'), ctx),
    () => renderFormation(new El('main'), ctx, { id: 'bt_slimes' }),
    () => renderSeekEditorList(new El('main'), ctx),
    () => renderSeekEditor(new El('main'), ctx, { id: 'sk_md_01' }),
    () => renderAchievements(new El('main'), ctx),
    () => renderBoard(new El('main'), ctx),
    () => renderMarket(new El('main'), ctx, 'armory'),
    () => renderMarket(new El('main'), ctx, 'armorer'),
    () => renderMarket(new El('main'), ctx, 'magic'),
    () => renderMarket(new El('main'), ctx, 'alchemy'),
    () => renderWorkshop(new El('main'), ctx),
    () => renderEditor(new El('main'), ctx, {}),
  ];
  for (const render of screens) {
    const cleanup = render();
    if (typeof cleanup === 'function') cleanup();
  }
  assert.ok(true);
});

test('подсказка «Сейчас надето» показывает текущий слот и пустые слоты', () => {
  const state = newGame();
  const anchor = new El('button');
  // Оружие: надет Дедов меч
  showCompareTip(state, ITEM_BY_ID.wpn_oak_mace, anchor);
  let tip = documentStub.body.children.find((c) => c.className === 'compare-tip');
  assert.ok(tip, 'тултип должен появиться');
  assert.ok(tip.innerHTML.includes('Дедов меч'), 'показывает надетый меч');
  assert.ok(tip.innerHTML.includes('Сейчас надето'));
  hideCompareTip();
  assert.ok(!documentStub.body.children.some((c) => c.className === 'compare-tip'), 'тултип скрыт');
  // Шлем: слот свободен
  showCompareTip(state, ITEM_BY_ID.hlm_leather, anchor);
  tip = documentStub.body.children.find((c) => c.className === 'compare-tip');
  assert.ok(tip.innerHTML.includes('свободен'), 'показывает свободный слот шлема');
  hideCompareTip();
});

test('тап по зеркалу на md_02 решает уровень и даёт награду', () => {
  const state = newGame();
  const ctx = makeUiCtx(state);
  const root = new El('main');
  const cleanup = renderPuzzle(root, ctx, { id: 'md_02' });
  // Имитируем: находим canvas и вызываем pointerdown на клетке зеркала (2,2)
  const canvas = (function find(el) {
    if (el.tagName === 'canvas') return el;
    for (const c of el.children) {
      const r = find(c);
      if (r) return r;
    }
    return null;
  })(root);
  assert.ok(canvas, 'canvas должен существовать');
  const CELL = 64;
  canvas._listeners.pointerdown.forEach((f) => f({ clientX: 2 * CELL + 5, clientY: 2 * CELL + 5 }));
  assert.ok(state.puzzlesDone.md_02, 'уровень должен быть решён после правильного поворота');
  if (typeof cleanup === 'function') cleanup();
});
