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
const { renderGuestBook } = await import('../src/ui/guestBookView.js');
const { renderStory } = await import('../src/ui/storyView.js');
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
    () => renderGuestBook(new El('main'), ctx), // гостевая книга
    () => renderStory(new El('main'), ctx), // режим истории: пролог
    () => { // режим истории: обычный визит гостя (пролог пройден)
      state.story.prologSeen = true;
      return renderStory(new El('main'), ctx);
    },
    () => { // хаб с гостем истории в лавке
      return renderHub(new El('main'), ctx);
    },
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

test('каталог головоломок: четыре режима и общий переключатель в настройках', () => {
  const state = newGame();
  const ctx = makeUiCtx(state);
  const layouts = {
    shelf: 'pc-shelf-track',
    preview: 'pc-preview-layout',
    accordion: 'pc-accordion',
    bento: 'pc-bento-grid',
  };
  for (const [mode, marker] of Object.entries(layouts)) {
    state.settings.puzzleCatalogMode = mode;
    const root = new El('main');
    renderPuzzleList(root, ctx);
    assert.ok(
      flatElements(root).some((el) => (el.className || '').split(' ').includes(marker)),
      `режим ${mode} должен рендерить ${marker}`,
    );
  }

  state.settings.puzzleCatalogMode = 'shelf';
  const root = new El('main');
  renderPuzzleList(root, ctx);
  const options = flatElements(root).filter((el) => (el.className || '').includes('pc-mode-option'));
  assert.equal(options.length, 4, 'на экране каталога доступны все варианты');
  options.find((el) => el.dataset.mode === 'bento').click();
  assert.equal(state.settings.puzzleCatalogMode, 'bento');
  assert.ok(flatElements(root).some((el) => el.className === 'pc-bento-grid'), 'каталог обновляется сразу');

  const settingsRoot = new El('main');
  renderSettings(settingsRoot, ctx);
  const settingsOptions = flatElements(settingsRoot)
    .filter((el) => (el.className || '').includes('pc-mode-option'));
  assert.equal(settingsOptions.length, 4, 'в настройках доступны все варианты');
  settingsOptions.find((el) => el.dataset.mode === 'preview').click();
  assert.equal(state.settings.puzzleCatalogMode, 'preview');
  const saved = JSON.parse(localStorage.getItem('cozy_adventures_save_v2'));
  assert.equal(saved.settings.puzzleCatalogMode, 'preview', 'выбор сохраняется');
});

test('каталог головоломок: превью, аккордеон и фильтры мозаики реагируют на выбор', () => {
  const state = newGame();
  const ctx = makeUiCtx(state);

  state.settings.puzzleCatalogMode = 'preview';
  const previewRoot = new El('main');
  renderPuzzleList(previewRoot, ctx);
  const previewItems = flatElements(previewRoot).filter((el) => el.className === 'pc-preview-item');
  assert.equal(previewItems.length, 13);
  previewItems[1].click();
  assert.ok(previewItems[1].classList.contains('is-active'), 'пункт обновляет живое превью');

  state.settings.puzzleCatalogMode = 'accordion';
  const accordionRoot = new El('main');
  renderPuzzleList(accordionRoot, ctx);
  const accordionAll = flatElements(accordionRoot);
  const rows = accordionAll.filter((el) => (el.className || '').startsWith('pc-accordion-item'));
  const headers = accordionAll.filter((el) => el.className === 'pc-accordion-header');
  const openButtons = accordionAll.filter((el) => el.className === 'primary pc-accordion-open');
  const firstOpen = rows.findIndex((row) => row.classList.contains('is-open'));
  const nextOpen = (firstOpen + 1) % rows.length;
  headers[nextOpen].click();
  assert.ok(rows[nextOpen].classList.contains('is-open'), 'выбранная строка раскрывается');
  assert.ok(!rows[firstOpen].classList.contains('is-open'), 'прежняя строка закрывается');
  assert.equal(openButtons[nextOpen].tabIndex, 0, 'кнопка раскрытой панели доступна с клавиатуры');
  assert.equal(openButtons[firstOpen].tabIndex, -1, 'кнопка скрытой панели не попадает в Tab');

  for (let i = 1; i <= 12; i += 1) {
    state.puzzlesDone[`md_${String(i).padStart(2, '0')}`] = { moves: 1, hintsUsed: 0 };
  }
  state.settings.puzzleCatalogMode = 'bento';
  const bentoRoot = new El('main');
  renderPuzzleList(bentoRoot, ctx);
  const bentoAll = flatElements(bentoRoot);
  const cards = bentoAll.filter((el) => (el.className || '').includes('pc-bento-card'));
  const filters = bentoAll.filter((el) => (el.className || '').includes('pc-bento-filter'));
  filters.find((el) => el.dataset.filter === 'complete').click();
  assert.equal(cards.filter((card) => !card.hidden).length, 1, 'фильтр оставляет только пройденную категорию');
  filters.find((el) => el.dataset.filter === 'progress').click();
  assert.equal(cards.filter((card) => !card.hidden).length, 0, 'пустая выборка поддерживается');
  assert.equal(bentoAll.find((el) => el.className === 'muted pc-bento-empty').hidden, false);
  filters.find((el) => el.dataset.filter === 'all').click();
  assert.equal(cards.filter((card) => !card.hidden).length, 13, 'фильтр «Все» возвращает карточки');
});

test('гостевая книга: четыре режима и сохранение выбранного вида', () => {
  const state = newGame();
  const ctx = makeUiCtx(state);
  const layouts = {
    shelf: 'guest-shelf-track',
    preview: 'guest-preview-layout',
    accordion: 'guest-accordion',
    bento: 'guest-bento-grid',
  };
  for (const [mode, marker] of Object.entries(layouts)) {
    state.settings.guestCatalogMode = mode;
    const root = new El('main');
    const cleanup = renderGuestBook(root, ctx);
    assert.ok(
      flatElements(root).some((el) => (el.className || '').split(' ').includes(marker)),
      `режим ${mode} должен рендерить ${marker}`,
    );
    cleanup();
  }

  state.settings.guestCatalogMode = 'shelf';
  const root = new El('main');
  const cleanup = renderGuestBook(root, ctx);
  const options = flatElements(root).filter((el) => (el.className || '').includes('guest-mode-option'));
  assert.equal(options.length, 4, 'на экране гостей доступны все варианты');
  options.find((el) => el.dataset.mode === 'bento').click();
  assert.equal(state.settings.guestCatalogMode, 'bento');
  assert.ok(flatElements(root).some((el) => el.className === 'guest-bento-grid'), 'каталог обновляется сразу');
  const saved = JSON.parse(localStorage.getItem('cozy_adventures_save_v2'));
  assert.equal(saved.settings.guestCatalogMode, 'bento', 'выбор вида гостей сохраняется');
  cleanup();
});

test('гостевая книга: фильтры, разговор, листание и закрытие профиля', () => {
  const state = newGame();
  state.settings.guestCatalogMode = 'bento';
  const ctx = makeUiCtx(state);
  const root = new El('main');
  const cleanup = renderGuestBook(root, ctx);
  const all = flatElements(root);
  const cards = all.filter((el) => (el.className || '').includes('guest-bento-card'));
  const filters = all.filter((el) => (el.className || '').includes('guest-bento-filter'));
  assert.ok(cards.length >= 36, 'в мозаике показаны все гости');

  filters.find((el) => el.dataset.filter === 'known').click();
  assert.equal(cards.filter((card) => !card.hidden).length, 0, 'в новой игре знакомых гостей ещё нет');
  assert.equal(all.find((el) => el.className === 'muted guest-bento-empty').hidden, false);
  filters.find((el) => el.dataset.filter === 'fresh').click();
  assert.equal(cards.filter((card) => !card.hidden).length, cards.length, 'фильтр показывает новые знакомства');
  state.puzzlesDone.fate_01 = { moves: 1, hintsUsed: 0 };
  filters.find((el) => el.dataset.filter === 'known').click();
  assert.ok(cards.filter((card) => !card.hidden).length > 0, 'пройденная история делает гостя знакомым');
  filters.find((el) => el.dataset.filter === 'all').click();

  cards[0].click();
  const overlay = documentStub.body.children.find((el) => (el.className || '').includes('guest-profile-overlay'));
  assert.ok(overlay, 'карточка открывает профиль гостя');
  const firstName = flatElements(overlay).find((el) => el.className === 'guest-name').textContent;
  const chat = flatElements(overlay).find((el) => el.className === 'guest-chat');
  assert.equal(chat.children.length, 1, 'в новом разговоре видно приветствие');
  const topic = flatElements(overlay).find((el) => el.className === 'guest-topic');
  topic.click();
  assert.equal(chat.children.length, 3, 'фраза игрока и ответ гостя добавляются в переписку');
  assert.equal(topic.disabled, true, 'одну тему нельзя повторять бесконечно');

  flatElements(overlay).find((el) => (el.className || '').includes('guest-profile-next')).click();
  const secondName = flatElements(overlay).find((el) => el.className === 'guest-name').textContent;
  assert.notEqual(secondName, firstName, 'следующий гость открывается без закрытия окна');
  flatElements(overlay).find((el) => (el.className || '').includes('guest-profile-close')).click();
  assert.ok(!documentStub.body.children.some((el) => (el.className || '').includes('guest-profile-overlay')), 'профиль закрывается');
  cleanup();
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

test('«Загадки Хранителя»: буквы получают вердикты до черновика и кляксы', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const state = newGame();
  const ctx = makeUiCtx(state);
  const sounds = [];
  ctx.sfx = (...args) => sounds.push(args);
  const root = new El('main');
  const cleanup = renderPuzzle(root, ctx, { id: 'bk_01' });
  const verdictSounds = () => sounds.filter(([name]) => (
    ['riddleExact', 'riddlePresent', 'riddleAbsent'].includes(name)
  ));

  tapRiddleKey(root, 'К');
  let slots = currentRiddleSlots(root);
  assert.ok(slots[0].classList.contains('ink-fresh'), 'свежая буква проявляется как чернила');
  assert.ok(riddleKey(root, 'К').classList.contains('is-pressed'), 'деревянная клавиша нажимается');
  assert.ok(sounds.some(([name]) => name === 'riddleKey'));
  assert.ok(sounds.some(([name]) => name === 'riddleWrite'));

  slots[0].click();
  slots = currentRiddleSlots(root);
  assert.ok(slots[0].classList.contains('ink-erased'), 'удалённая буква оставляет тающий след');
  assert.ok(sounds.some(([name]) => name === 'riddleErase'));

  // КАБББ против КНИГА: точная К, затем А в слове и три отсутствующие Б.
  for (const letter of ['К', 'А', 'Б', 'Б', 'Б']) tapRiddleKey(root, letter);
  assert.ok(riddleStatus(root).includes('Ошибок: <b>0</b>'), 'заполнение строки ещё не считается ошибкой');
  assert.equal(riddleDrafts(root).length, 0);

  t.mock.timers.tick(120);
  slots = currentRiddleSlots(root);
  assert.ok(slots[0].classList.contains('mark-exact'));
  assert.ok(slots[0].classList.contains('verdict-current'));
  assert.deepEqual(verdictSounds(), [['riddleExact', 0]]);

  t.mock.timers.tick(110);
  slots = currentRiddleSlots(root);
  assert.ok(!slots[0].classList.contains('verdict-current'));
  assert.ok(slots[1].classList.contains('mark-present'));
  assert.deepEqual(verdictSounds(), [['riddleExact', 0], ['riddlePresent', 1]]);

  t.mock.timers.tick(330);
  slots = currentRiddleSlots(root);
  assert.ok(slots[4].classList.contains('mark-absent'));
  assert.ok(riddleStatus(root).includes('Ошибок: <b>0</b>'), 'есть завершающая пауза после всех букв');
  assert.equal(riddleDrafts(root).length, 0);

  t.mock.timers.tick(329);
  assert.ok(riddleStatus(root).includes('Ошибок: <b>0</b>'));
  t.mock.timers.tick(1);
  assert.ok(riddleStatus(root).includes('Ошибок: <b>1</b>'), 'ошибка применяется после вердиктов');
  assert.equal(riddleDrafts(root).length, 1, 'попытка ушла в компактные черновики');
  assert.ok(riddlePage(root).classList.contains('shake'), 'потряхивание сохранено');
  assert.ok(riddleKeeperText(root).includes('Мур'), 'Хранитель комментирует результат');
  assert.deepEqual(verdictSounds(), [
    ['riddleExact', 0], ['riddlePresent', 1], ['riddleAbsent', 2],
    ['riddleAbsent', 3], ['riddleAbsent', 4],
  ]);
  assert.ok(sounds.some(([name]) => name === 'fail'));
  cleanup();
});

test('«Загадки Хранителя»: победа сияет после вердиктов и мурлычет', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const state = newGame();
  const ctx = makeUiCtx(state);
  const sounds = [];
  ctx.sfx = (...args) => sounds.push(args);
  const root = new El('main');
  const cleanup = renderPuzzle(root, ctx, { id: 'bk_01' });

  for (const letter of 'КНИГА') tapRiddleKey(root, letter);
  assert.ok(!state.puzzlesDone.bk_01, 'победа ждёт последовательный вердикт');
  t.mock.timers.tick(889);
  assert.ok(!state.puzzlesDone.bk_01, 'победа ждёт завершающую паузу');
  t.mock.timers.tick(1);
  assert.ok(state.puzzlesDone.bk_01, 'верное слово засчитано после вердиктов');
  assert.ok(riddlePage(root).classList.contains('riddle-solved'), 'страница получила золотое свечение');
  assert.equal(currentRiddleSlots(root)[4].style.animationDelay, '280ms', 'буквы сияют по очереди');
  assert.ok(sounds.some(([name]) => name === 'page'), 'слышен шелест страницы');
  assert.ok(sounds.some(([name]) => name === 'success'));
  assert.ok(!sounds.some(([name]) => name === 'purr'), 'мурлыкание следует после короткой паузы');
  t.mock.timers.tick(250);
  assert.ok(sounds.some(([name]) => name === 'purr'));
  assert.ok(riddleKeeperText(root).includes('верное слово'));
  cleanup();
});

test('«Загадки Хранителя»: перо пишет подсказку, правила сворачиваются', () => {
  const state = newGame();
  const ctx = makeUiCtx(state);
  const root = new El('main');
  const cleanup = renderPuzzle(root, ctx, { id: 'bk_02' });
  const all = flatElements(root);
  const rules = all.find((el) => el.className === 'panel riddle-rules');
  const quill = all.find((el) => el.className === 'riddle-quill');
  const hint = all.find((el) => el.tagName === 'button' && el.innerHTML.includes('Подсказка'));

  assert.ok(all.some((el) => el.className === 'riddle-sheet'), 'загадка лежит на отдельном пергаментном листе');
  assert.equal(rules.open, false, 'после первого уровня правила компактно свёрнуты');
  assert.ok(quill, 'перо Хранителя присутствует на сцене');
  hint.click();
  const firstReaction = riddleKeeperText(root);
  assert.ok(quill.classList.contains('is-writing'), 'перо подлетаёт к подсказанному окошку');
  assert.ok(quill.style.left.endsWith('px'), 'позиция пера вычислена по окошку');
  hint.click();
  assert.notEqual(riddleKeeperText(root), firstReaction, 'реплики Хранителя не повторяются подряд');
  assert.ok(currentRiddleSlots(root)[1].classList.contains('ink-fresh'), 'подсказка тоже проявляется чернилами');
  cleanup();
});

test('«Загадки Хранителя»: главы меняют сцену, десятая страница получает печать', () => {
  const state = newGame();
  const ctx = makeUiCtx(state);
  const root = new El('main');
  const cleanup = renderPuzzle(root, ctx, { id: 'bk_120' });
  const all = flatElements(root);
  const cat = all.find((el) => el.className === 'riddle-keeper-art');

  assert.ok(riddlePage(root).classList.contains('riddle-theme-rain'), 'вторая глава — дождливая сцена');
  assert.ok(riddlePage(root).classList.contains('riddle-finale'), 'двадцатый уровень — финал второй главы');
  assert.ok(all.some((el) => el.className === 'riddle-bookmark'), 'на листе есть закладка главы');
  assert.ok(all.some((el) => el.className === 'riddle-wax-seal'), 'на финальной странице есть сургучная печать');
  assert.equal(cat.src, 'assets/fate/guest_cat_web.jpg', 'в главах используется читаемый портрет кота');
  assert.ok(!all.some((el) => el.src === 'assets/crew/cmp_cat.webp'), 'ассет со свернувшимся котом не используется');
  assert.ok(riddleKeeperText(root).includes('дождь'), 'реплика соответствует главе');
  cleanup();

  const root2 = new El('main');
  const cleanup2 = renderPuzzle(root2, ctx, { id: 'bk_111' });
  assert.ok(riddlePage(root2).classList.contains('riddle-theme-rain'));
  assert.ok(!riddlePage(root2).classList.contains('riddle-finale'), 'первая страница главы не финальная');
  assert.ok(!flatElements(root2).some((el) => el.className === 'riddle-wax-seal'), 'печати на обычной странице нет');
  cleanup2();
});

test('«Загадки Хранителя»: ЛЕД решает ЛЁД без подсказки', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const state = newGame();
  const ctx = makeUiCtx(state);
  const root = new El('main');
  const cleanup = renderPuzzle(root, ctx, { id: 'bk_120' });

  for (const letter of 'ЛЕД') tapRiddleKey(root, letter);
  assert.ok(!state.puzzlesDone.bk_120, 'уровень ждёт последовательный вердикт');
  t.mock.timers.tick(669);
  assert.ok(!state.puzzlesDone.bk_120, 'уровень ждёт завершающую паузу');
  t.mock.timers.tick(1);
  assert.ok(state.puzzlesDone.bk_120, 'ЛЕД принято как ЛЁД без подсказки');
  const shown = currentRiddleSlots(root).map((cell) => cell.children[0]?.textContent || '').join('');
  assert.equal(shown, 'ЛЁД', 'победная страница показывает правильное написание');
  const rules = flatElements(root).find((el) => el.className === 'panel riddle-rules');
  assert.ok(rules.innerHTML.includes('Е и Ё — одна клавиша'), 'правило объяснено игроку');
  cleanup();
});

test('«Строки при свече»: вердикт наступает после паузы, ввод не зависает', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const state = newGame();
  const ctx = makeUiCtx(state);
  const sounds = [];
  ctx.sfx = (...args) => sounds.push(args);
  const root = new El('main');
  const cleanup = renderPuzzle(root, ctx, { id: 'bk_06' });
  const all = flatElements(root);
  const rules = all.find((el) => (el.className || '').includes('hang-rules'));

  assert.ok(all.some((el) => el.className === 'riddle-sheet'), 'стих лежит на пергаменте');
  assert.ok(all.some((el) => (el.className || '').includes('hang-keeper')), 'Хранитель остаётся рядом со свечой');
  assert.ok(rules.innerHTML.includes('−5% монет') && rules.innerHTML.includes('×1,5 монет'));
  assert.ok(riddleStatus(root).includes('Монеты: <b>×1,5</b>'), 'бонус без ошибок виден сразу');

  tapRiddleKey(root, 'Т');
  assert.ok(riddleStatus(root).includes('Ходы: 0'), 'до паузы ход ещё не применён');
  assert.equal(currentHangSlots(root)[0].children.length, 0, 'буква ещё не проявилась');
  assert.ok(riddlePage(root).classList.contains('hang-awaiting'));
  assert.ok(riddlePage(root).classList.contains('checking'));
  assert.ok(riddleKey(root, 'Т').classList.contains('is-pressed'));
  assert.ok(sounds.some(([name]) => name === 'riddleKey'));
  assert.ok(sounds.some(([name]) => name === 'riddleWrite'));

  t.mock.timers.tick(259);
  assert.ok(riddleStatus(root).includes('Ходы: 0'), 'вердикт не наступает раньше времени');
  t.mock.timers.tick(1);
  assert.ok(riddleStatus(root).includes('Ходы: 1'));
  assert.equal(currentHangSlots(root)[0].children[0]?.textContent, 'Т');
  assert.ok(currentHangSlots(root)[0].classList.contains('ink-fresh'), 'верная буква проявляется чернилами');
  assert.ok(!riddlePage(root).classList.contains('checking'), 'после обычного вердикта ввод свободен');
  assert.ok(sounds.some(([name]) => name === 'riddleExact'));

  tapRiddleKey(root, 'Ы');
  tapRiddleKey(root, 'О'); // во время паузы второй ход должен быть проигнорирован
  t.mock.timers.tick(260);
  assert.ok(riddleStatus(root).includes('Ходы: 2'));
  assert.ok(riddleStatus(root).includes('Ошибок: <b>1</b>'));
  assert.ok(riddleStatus(root).includes('Монеты: <b>×0,95</b>'));
  assert.equal(currentHangSlots(root)[1].children.length, 0, 'ход во время паузы не прошёл');
  assert.ok(riddleKey(root, 'Ы').className.includes('mark-absent'));
  assert.ok(flatElements(root).some((el) => (el.className || '').includes('hang-ink-blot')));
  assert.ok(riddleKeeperText(root).includes('пять процентов'));
  assert.ok(sounds.some(([name]) => name === 'riddleAbsent'));
  cleanup();
});

test('«Строки при свече»: безошибочная победа сияет после последнего вердикта', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const state = newGame();
  const ctx = makeUiCtx(state);
  const sounds = [];
  ctx.sfx = (...args) => sounds.push(args);
  const root = new El('main');
  const cleanup = renderPuzzle(root, ctx, { id: 'bk_06' });

  for (const letter of ['Т', 'О', 'Ч', 'Н', 'С', 'Е', 'Р', 'Б']) {
    tapRiddleKey(root, letter);
    t.mock.timers.tick(260);
  }
  assert.ok(!state.puzzlesDone.bk_06, 'строка ждёт последней буквы');
  tapRiddleKey(root, 'М');
  t.mock.timers.tick(259);
  assert.ok(!state.puzzlesDone.bk_06, 'победа ждёт последний вердикт');
  t.mock.timers.tick(1);
  assert.ok(state.puzzlesDone.bk_06, 'после вердикта строка засчитана');
  assert.ok(riddlePage(root).classList.contains('riddle-solved'));
  assert.ok(riddleStatus(root).includes('Монеты: <b>×1,5</b>'));
  const slots = currentHangSlots(root);
  assert.equal(slots.at(-1).style.animationDelay, `${(slots.length - 1) * 55}ms`, 'буквы сияют по очереди');
  assert.ok(sounds.some(([name]) => name === 'page'));
  assert.ok(sounds.some(([name]) => name === 'success'));
  assert.ok(!sounds.some(([name]) => name === 'purr'), 'мурлыкание следует после короткой паузы');
  t.mock.timers.tick(250);
  assert.ok(sounds.some(([name]) => name === 'purr'));
  assert.ok(riddleKeeperText(root).includes('полтора'));
  cleanup();
});

function currentHangSlots(root) {
  const row = flatElements(root).find((el) => (el.className || '').includes('hang-answer'));
  assert.ok(row, 'строка «Строк при свече» должна существовать');
  return row.children.filter((el) => (el.className || '').startsWith('riddle-slot'));
}

function riddleKey(root, letter) {
  return flatElements(root).find((el) => el.tagName === 'button'
    && el.textContent === letter && (el.className || '').includes('hang-key'));
}

function tapRiddleKey(root, letter) {
  const key = riddleKey(root, letter);
  assert.ok(key, `клавиша ${letter} должна существовать`);
  key.click();
}

function currentRiddleSlots(root) {
  const row = flatElements(root).find((el) => el.className === 'riddle-slots riddle-current');
  assert.ok(row, 'текущая строка ответа должна существовать');
  return row.children.filter((el) => (el.className || '').startsWith('riddle-slot'));
}

function riddlePage(root) {
  return flatElements(root).find((el) => el.className === 'riddle-page');
}

function riddleStatus(root) {
  return flatElements(root).find((el) => el.className === 'puzzle-status')?.innerHTML || '';
}

function riddleDrafts(root) {
  return flatElements(root).filter((el) => el.className === 'riddle-draft');
}

function riddleKeeperText(root) {
  return flatElements(root).find((el) => el.className === 'intro-text riddle-keeper-text')?.textContent || '';
}
