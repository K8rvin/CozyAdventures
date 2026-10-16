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
  get lastElementChild() { return this.children[this.children.length - 1] || new El('div'); }
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
const { renderPuzzleList, renderPuzzle, renderPuzzleTypeList } = await import('../src/ui/puzzleView.js');
const { renderEquip } = await import('../src/ui/equipView.js');
const { renderShop } = await import('../src/ui/shopView.js');
const { renderBattleList } = await import('../src/ui/battleView.js');
const { renderTavern } = await import('../src/ui/tavernView.js');
const { renderWorkshop, renderEditor } = await import('../src/ui/editorView.js');
const { renderCraft } = await import('../src/ui/craftView.js');
const { renderSettings } = await import('../src/ui/settingsView.js');
const { renderFormation } = await import('../src/ui/formationView.js');
const { renderSeekEditorList, renderSeekEditor } = await import('../src/ui/seekEditorView.js');
const { renderAchievements } = await import('../src/ui/achievementsView.js');
const { renderBoard } = await import('../src/ui/boardView.js');
const { renderMarket } = await import('../src/ui/shopView.js');
const { renderBrewBook } = await import('../src/ui/brewBookView.js');
const { renderSandbox } = await import('../src/ui/sandboxView.js');
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

function flatElements(el, out = []) {
  out.push(el);
  for (const c of el.children) flatElements(c, out);
  return out;
}

function fateCardsOnTable(root) {
  return flatElements(root).filter((el) => el.className === 'fate-card on-table');
}

function tapFateCard(root, cardId) {
  const src = `assets/fate/card_${cardId}_web.jpg`;
  const card = flatElements(root).find((el) => el.className === 'fate-card in-hand'
    && el.children.some((c) => c.src === src));
  assert.ok(card, `карта ${cardId} должна быть в руке`);
  const upsBefore = listeners.pointerup?.length || 0;
  for (const fn of card._listeners.pointerdown || []) {
    fn({ clientX: 0, clientY: 0, preventDefault: () => {} });
  }
  assert.ok((listeners.pointerup?.length || 0) > upsBefore, 'тап должен установить pointerup');
  listeners.pointerup.at(-1)({ clientX: 0, clientY: 0 });
}

test('все экраны рендерятся без ошибок', () => {
  const state = newGame();
  const ctx = makeUiCtx(state);

  const screens = [
    () => renderHub(new El('main'), ctx),
    () => renderHub(new El('main'), ctx, { scene: 'cabinet' }), // кабинет трофеев (пустой)
    () => { // кабинет с трофеями: открытые и закрытые места
      state.trophies = ['willow_branch', 'mini_bee'];
      return renderHub(new El('main'), ctx, { scene: 'cabinet' });
    },
    () => renderPuzzleList(new El('main'), ctx),
    // Списки по типам головоломок (13 карточек → свой список)
    ...['mirror', 'shelf', 'riddle', 'hang', 'seek', 'path', 'tea', 'mech', 'candle', 'flow', 'brew', 'fate', 'glass']
      .map((mech) => () => renderPuzzleTypeList(new El('main'), ctx, mech)),
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
    () => renderPuzzle(new El('main'), ctx, { id: 'brew_09' }), // варка с вариантами
    () => renderPuzzle(new El('main'), ctx, { id: 'brew_32' }), // варка с ножом
    () => renderPuzzle(new El('main'), ctx, { id: 'brew_41' }), // варка с пипеткой
    () => renderPuzzle(new El('main'), ctx, { id: 'brew_51' }), // варка с крышкой
    () => renderPuzzle(new El('main'), ctx, { id: 'brew_61' }), // варка с повторами ×N
    () => renderPuzzle(new El('main'), ctx, { id: 'brew_100' }), // финал книги: всё вместе, на память
    () => renderPuzzle(new El('main'), ctx, { id: 'fate_01' }), // карты судьбы
    () => renderPuzzle(new El('main'), ctx, { id: 'fate_09' }), // расклад на 4 позиции
    () => renderPuzzle(new El('main'), ctx, { id: 'gl_01' }),  // витраж миров
    () => renderPuzzle(new El('main'), ctx, { id: 'gl_12' }),  // витраж 6×4
    () => renderPuzzle(new El('main'), ctx, { id: 'gl_24' }),  // витраж-панорама 9×3
    () => renderPuzzle(new El('main'), ctx, { id: 'gl_26' }),  // вертикальный витраж 4×5
    () => renderPuzzle(new El('main'), ctx, { id: 'gl_34' }),  // витраж 8×5, 40 осколков
    () => renderPuzzle(new El('main'), ctx, { id: 'gl_46' }),  // витраж с посвящённым артом (фолбэк)
    () => renderPuzzle(new El('main'), ctx, { id: 'gl_58' }),  // финал пятой серии 8×5
    () => renderBrewBook(new El('main'), ctx), // книга рецептов
    () => renderSandbox(new El('main'), ctx), // конструктор боя
    () => renderEquip(new El('main'), ctx),
    () => renderShop(new El('main'), ctx),
    () => renderBattleList(new El('main'), ctx),
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

test('уютная варка (keepBookOpen): рецепт всегда открыт, без отсчёта и скрытых шагов', () => {
  const state = newGame();
  state.settings.keepBookOpen = true;
  const root = new El('main');
  const cleanup = renderPuzzle(root, makeUiCtx(state), { id: 'brew_06' }); // уровень на память
  const all = flatElements(root);
  const steps = all.filter((el) => (el.className || '').startsWith('brew-step'));
  assert.equal(steps.length, 6, 'все шаги рецепта на месте');
  for (const row of steps) assert.ok(!(row.textContent || '').includes('· · ·'), 'шаги не скрываются');
  assert.ok((steps[5].textContent || '').includes('Остуди котёл'), 'последний шаг виден полностью');
  assert.ok(!all.some((el) => el.className === 'brew-peek-count'), 'отсчёта запоминания нет');
  assert.ok(
    all.some((el) => el.className === 'brew-book-note' && (el.textContent || '').includes('рецепт не скрывается')),
    'есть пометка уютного режима',
  );
  assert.ok(all.some((el) => (el.innerHTML || '').includes('📖 Книга открыта')), 'кнопка показывает открытую книгу');
  if (typeof cleanup === 'function') cleanup();

  // По умолчанию (флаг выключен) режим памяти прежний: отсчёт на месте
  const root2 = new El('main');
  const cleanup2 = renderPuzzle(root2, makeUiCtx(newGame()), { id: 'brew_06' });
  assert.ok(flatElements(root2).some((el) => el.className === 'brew-peek-count'), 'по умолчанию отсчёт памяти остаётся');
  if (typeof cleanup2 === 'function') cleanup2();
});

test('книга рецептов: у сваренного зелья — флакон с цветом вместо значка', () => {
  const state = newGame();
  state.puzzlesDone.brew_01 = { moves: 3, hintsUsed: 0, at: Date.now() };
  const root = new El('main');
  renderBrewBook(root, makeUiCtx(state));
  const entry = flatElements(root).find((el) => (el.className || '') === 'panel brew-book-entry');
  assert.ok(entry, 'запись книги есть');
  assert.ok((entry.innerHTML || '').includes('<svg'), 'у сваренного зелья — флакон');
  assert.ok(!(entry.innerHTML || '').includes('🔒'), 'сваренное зелье не под замком');
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

test('«Карты судьбы»: неверный расклад раскрывается по картам до применения ошибки', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const state = newGame();
  const ctx = makeUiCtx(state);
  const sounds = [];
  const notices = [];
  ctx.sfx = (...args) => sounds.push(args);
  ctx.toast = (text) => notices.push(text);
  const root = new El('main');
  const cleanup = renderPuzzle(root, ctx, { id: 'fate_01' });
  const verdictSounds = () => sounds.filter(([name]) => name.startsWith('fate'));

  tapFateCard(root, 'star');
  tapFateCard(root, 'home');
  tapFateCard(root, 'letter');
  assert.equal(notices.length, 0, 'ошибка не показывается сразу');
  assert.equal(fateCardsOnTable(root).length, 3, 'карты остаются на столе во время вердиктов');

  t.mock.timers.tick(250);
  let cards = fateCardsOnTable(root);
  assert.ok(cards[0].classList.contains('fate-verdict-miss'));
  assert.ok(cards[0].classList.contains('fate-verdict-current'));
  assert.deepEqual(verdictSounds(), [['fateMiss', 0]]);

  t.mock.timers.tick(650);
  cards = fateCardsOnTable(root);
  assert.ok(!cards[0].classList.contains('fate-verdict-current'));
  assert.ok(cards[0].classList.contains('fate-verdict-miss'), 'первый вердикт остаётся мягко видимым');
  assert.ok(cards[1].classList.contains('fate-verdict-exact'));
  assert.ok(cards[1].classList.contains('fate-verdict-current'));
  assert.deepEqual(verdictSounds(), [['fateMiss', 0], ['fateExact', 1]]);

  t.mock.timers.tick(650);
  cards = fateCardsOnTable(root);
  assert.ok(cards[2].classList.contains('fate-verdict-exact'));
  assert.ok(cards[2].classList.contains('fate-verdict-current'));
  assert.equal(notices.length, 0, 'после третьей карты ещё есть завершающая пауза');

  t.mock.timers.tick(1049);
  assert.equal(notices.length, 0);
  assert.equal(fateCardsOnTable(root).length, 3);
  t.mock.timers.tick(1);
  assert.equal(notices.length, 1, 'после анимации появляется прежнее сообщение об ошибке');
  assert.equal(fateCardsOnTable(root).length, 0, 'после анимации карты возвращаются в руку');
  assert.equal(flatElements(root).filter((el) => el.className === 'fate-attempt').length, 1);
  assert.deepEqual(verdictSounds(), [['fateMiss', 0], ['fateExact', 1], ['fateExact', 2]]);
  assert.ok(sounds.some(([name]) => name === 'fail'), 'финальный звук ошибки сохранён');
  cleanup();
});

test('«Карты судьбы»: победа засчитывается только после всех вердиктов', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const state = newGame();
  const ctx = makeUiCtx(state);
  const sounds = [];
  ctx.sfx = (...args) => sounds.push(args);
  const root = new El('main');
  const cleanup = renderPuzzle(root, ctx, { id: 'fate_01' });

  tapFateCard(root, 'path');
  tapFateCard(root, 'home');
  tapFateCard(root, 'letter');
  assert.ok(!state.puzzlesDone.fate_01, 'заполнение расклада ещё не завершает уровень');
  t.mock.timers.tick(2599);
  assert.ok(!state.puzzlesDone.fate_01, 'уровень ждёт завершающую паузу');
  assert.deepEqual(
    sounds.filter(([name]) => name.startsWith('fate')),
    [['fateExact', 0], ['fateExact', 1], ['fateExact', 2]],
  );
  t.mock.timers.tick(1);
  assert.ok(state.puzzlesDone.fate_01, 'после последнего вердикта применяется прежняя победа');
  assert.ok(sounds.some(([name]) => name === 'success'));
  cleanup();
});
