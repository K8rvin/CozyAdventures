import { test } from 'node:test';
import assert from 'node:assert/strict';

function classes(el) {
  return String(el.className || '').split(/\s+/).filter(Boolean);
}

function matches(el, selector) {
  if (selector.startsWith('.')) {
    const wanted = selector.slice(1).split('.').filter(Boolean);
    return wanted.every((name) => classes(el).includes(name));
  }
  const [tag, ...wanted] = selector.split('.');
  return String(el.tagName || '').toLowerCase() === tag.toLowerCase()
    && wanted.every((name) => classes(el).includes(name));
}

function flat(el, out = []) {
  out.push(el);
  for (const child of el.children || []) flat(child, out);
  return out;
}

function textOf(value) {
  return String(value || '').replace(/<[^>]*>/g, '');
}

class El {
  constructor(tag) {
    this.tagName = tag.toUpperCase();
    this.children = [];
    this.parent = null;
    this.style = { setProperty: () => {} };
    this.dataset = {};
    this._className = '';
    this._listeners = {};
    this._innerHTML = '';
    this._text = '';
    this.offsetWidth = 320;
    this.offsetHeight = 120;
    this.clientHeight = 600;
    this.scrollHeight = 600;
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
        const has = classes(el).includes(name);
        const add = force === undefined ? !has : !!force;
        if (add) el.classList.add(name);
        else el.classList.remove(name);
        return add;
      },
    };
  }

  clearChildren() {
    for (const child of this.children) if (child && typeof child === 'object') child.parent = null;
    this.children = [];
  }

  set innerHTML(value) {
    this.clearChildren();
    this._innerHTML = String(value);
    if (classes(this).includes('overlay') && this._innerHTML.includes('class="card"')) {
      const card = new El('div');
      card.className = 'card';
      if (this._innerHTML.includes('class="advice"')) {
        const advice = new El('div');
        advice.className = 'advice';
        card.appendChild(advice);
      }
      const actions = new El('div');
      actions.className = 'actions';
      card.appendChild(actions);
      this.appendChild(card);
    }
    if (classes(this).includes('tut-bubble')) {
      const cat = new El('div');
      cat.className = 'tut-cat';
      const body = new El('div');
      body.className = 'tut-body';
      const title = new El('div');
      title.className = 'tut-title';
      title.textContent = textOf(this._innerHTML.match(/<div class="tut-title">([\s\S]*?)<\/div>/)?.[1]);
      const text = new El('div');
      text.className = 'tut-text';
      text.textContent = textOf(this._innerHTML.match(/<div class="tut-text">([\s\S]*?)<\/div>/)?.[1]);
      const actions = new El('div');
      actions.className = 'tut-actions';
      body.append(title, text, actions);
      this.append(cat, body);
    }
  }
  get innerHTML() { return this._innerHTML; }

  set textContent(value) {
    this.clearChildren();
    this._text = String(value ?? '');
  }
  get textContent() { return this._text; }

  appendChild(child) {
    if (child && typeof child === 'object') child.parent = this;
    this.children.push(child);
    return child;
  }
  append(...children) { for (const child of children) this.appendChild(child); }
  prepend(child) {
    if (child && typeof child === 'object') child.parent = this;
    this.children.unshift(child);
    return child;
  }
  insertBefore(child, before) {
    const index = this.children.indexOf(before);
    if (index < 0) return this.appendChild(child);
    if (child && typeof child === 'object') child.parent = this;
    this.children.splice(index, 0, child);
    return child;
  }
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
  dispatch(type, event = {}) {
    event.target ||= this;
    event.preventDefault ||= () => {};
    event.stopPropagation ||= () => {};
    for (const entry of [...(this._listeners[type] || [])]) {
      entry.fn.call(this, event);
      if (entry.once) this.removeEventListener(type, entry.fn);
    }
  }
  click() { this.dispatch('click'); }
  listenerCount(type) { return (this._listeners[type] || []).length; }

  querySelectorAll(selector) {
    if (selector.includes(' > ')) {
      const [parentSelector, childSelector] = selector.split(' > ');
      return flat(this).filter((el) => el !== this && matches(el, childSelector)
        && el.parent && matches(el.parent, parentSelector));
    }
    if (selector.includes(' ')) {
      const [ancestorSelector, childSelector] = selector.split(/\s+/);
      return flat(this).filter((el) => {
        if (!matches(el, childSelector)) return false;
        let parent = el.parent;
        while (parent && parent !== this) {
          if (matches(parent, ancestorSelector)) return true;
          parent = parent.parent;
        }
        return false;
      });
    }
    return flat(this).filter((el) => el !== this && matches(el, selector));
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }

  getBoundingClientRect() {
    return this._rect || { left: 0, top: 0, right: 100, bottom: 100, width: 100, height: 100 };
  }
  scrollIntoView() { this.scrollCalls = (this.scrollCalls || 0) + 1; }
  setAttribute(name, value) { this[name] = value; }
  get firstElementChild() { return this.children[0] || null; }
  get lastElementChild() { return this.children.at(-1) || null; }
  get isConnected() {
    let current = this;
    while (current.parent) current = current.parent;
    return current === documentStub.body;
  }
}

const documentListeners = {};
const windowListeners = {};
const documentStub = {
  createElement: (tag) => new El(tag),
  createTextNode: (text) => ({ textContent: text, parent: null }),
  body: new El('body'),
  documentElement: new El('html'),
  _ids: new Map(),
  getElementById(id) {
    if (!this._ids.has(id)) this._ids.set(id, new El('div'));
    return this._ids.get(id);
  },
  querySelector: () => null,
  addEventListener: (type, fn) => { (documentListeners[type] ||= []).push(fn); },
  removeEventListener: (type, fn) => {
    documentListeners[type] = (documentListeners[type] || []).filter((entry) => entry !== fn);
  },
};
documentStub.documentElement.scrollHeight = 2000;

globalThis.document = documentStub;
globalThis.window = {
  addEventListener: (type, fn) => { (windowListeners[type] ||= []).push(fn); },
  removeEventListener: (type, fn) => {
    windowListeners[type] = (windowListeners[type] || []).filter((entry) => entry !== fn);
  },
  scrollTo: () => {},
  scrollX: 0,
  scrollY: 0,
  innerWidth: 1024,
  innerHeight: 768,
  devicePixelRatio: 1,
};
globalThis.confirm = () => true;

const { newGame, completePuzzle, buyItem, saveGame, loadGame } = await import('../src/core/state.js');
const {
  reconcileOnboarding, onboardingVisit, startOnboardingGuide, closeOnboardingGuide,
  reopenOnboardingGuide,
} = await import('../src/core/onboarding.js');
const { renderFormation, playBattleReplay } = await import('../src/ui/formationView.js');
const { renderSandbox } = await import('../src/ui/sandboxView.js');
const { renderStory } = await import('../src/ui/storyView.js');
const { renderCraft } = await import('../src/ui/craftView.js');
const { REGULAR_MATERIALS } = await import('../src/core/materialExchange.js');
const { STORY_PROLOG } = await import('../src/data/story.js');
const { ONBOARDING_GUIDE_SECTIONS } = await import('../src/data/onboarding.js');
const { showOverlay } = await import('../src/ui/common.js');
const { syncOnboardingDock, destroyOnboardingDock } = await import('../src/ui/onboardingView.js');

function listenerCount(type) { return (windowListeners[type] || []).length; }
function overlays() { return flat(documentStub.body).filter((el) => classes(el).includes('overlay')); }
function docks() { return flat(documentStub.body).filter((el) => classes(el).includes('onboarding-dock')); }
function byText(root, text) { return flat(root).find((el) => el.textContent === text); }
function byData(root, key, value) { return flat(root).filter((el) => el.dataset?.[key] === value); }
function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

function makeCtx(state = newGame()) {
  return { state, saves: 0, save() { this.saves += 1; }, go: () => {}, toast: () => {}, sfx: () => {} };
}

function makeDockCtx(state) {
  const current = { name: 'hub', params: { scene: 'lavka' } };
  const ctx = makeCtx(state);
  ctx.visits = [];
  ctx.go = (...args) => ctx.visits.push(args);
  const save = ctx.save.bind(ctx);
  ctx.save = () => { save(); syncOnboardingDock(ctx, current); };
  return ctx;
}

function makeResult(log = []) {
  return {
    victory: false,
    log,
    rewards: [],
    formation: { allies: [], foes: [], obstacles: [] },
    report: {
      victory: false,
      timedOut: false,
      dealt: 0,
      taken: 0,
      foesDown: 0,
      foesTotal: 0,
      alliesStats: [],
      advice: 'Проверь снаряжение.',
      knightHpMax: 60,
    },
  };
}

function resetDom() {
  destroyOnboardingDock();
  documentStub.body.clearChildren();
  for (const key of Object.keys(windowListeners)) delete windowListeners[key];
}

const { startTutorial, destroyTutorial, skipAllTutorials } = await import('../src/ui/tutorial.js');
function tutorials() { return flat(documentStub.body).filter((el) => classes(el).includes('tut-overlay')); }

test('обучение singleton: новый сеанс и destroy полностью очищают прежний', (t) => {
  t.after(() => destroyTutorial());
  destroyTutorial();
  resetDom();
  const firstCtx = makeCtx();
  const secondCtx = makeCtx();
  const firstTarget = new El('button');
  const secondTarget = new El('button');
  const cancelFirst = startTutorial(firstCtx, 'first', [
    { target: firstTarget, title: 'Первый', text: 'Текст' },
  ]);
  assert.equal(tutorials().length, 1);
  assert.equal(firstTarget.listenerCount('pointerdown'), 1);
  assert.equal(listenerCount('resize'), 1);
  assert.equal(listenerCount('scroll'), 1);

  startTutorial(secondCtx, 'second', [
    { target: secondTarget, title: 'Второй', text: 'Текст' },
  ]);
  assert.equal(tutorials().length, 1, 'одновременно только один прожектор');
  assert.equal(firstTarget.listenerCount('pointerdown'), 0, 'слушатель старой цели снят');
  assert.equal(secondTarget.listenerCount('pointerdown'), 1);
  assert.equal(listenerCount('resize'), 1, 'resize не накапливается');
  assert.equal(listenerCount('scroll'), 1, 'scroll не накапливается');

  cancelFirst();
  assert.equal(tutorials().length, 1, 'отмена старого сеанса не закрывает новый');
  assert.equal(secondTarget.listenerCount('pointerdown'), 1);
  destroyTutorial();
  assert.equal(tutorials().length, 0);
  assert.equal(secondTarget.listenerCount('pointerdown'), 0);
  assert.equal(listenerCount('resize'), 0);
  assert.equal(listenerCount('scroll'), 0);
  assert.equal(firstCtx.saves, 0);
  assert.equal(secondCtx.saves, 0);
  assert.ok(!firstCtx.state.tutorial.first && !secondCtx.state.tutorial.second,
    'отмена не отмечает обучение пройденным');
});

test('CTA и последующий pointerdown цели не продвигают один шаг дважды', (t) => {
  t.after(() => destroyTutorial());
  destroyTutorial();
  resetDom();
  const ctx = makeCtx();
  const target = new El('button');
  startTutorial(ctx, 'steps', [
    { target, title: 'Шаг один', text: 'Первый текст' },
    { target, title: 'Шаг два', text: 'Второй текст' },
  ]);
  const firstNext = byText(tutorials()[0], 'Дальше →');
  const oldCta = firstNext._listeners.click[0].fn;
  const oldTarget = target._listeners.pointerdown[0].fn;
  firstNext.click();
  assert.equal(tutorials().length, 1);
  assert.equal(tutorials()[0].querySelector('.tut-title').textContent, 'Шаг два');

  oldCta({ stopPropagation: () => {} });
  oldTarget({ stopPropagation: () => {} });
  assert.equal(tutorials()[0].querySelector('.tut-title').textContent, 'Шаг два',
    'старые события не перескакивают через второй шаг');
  assert.equal(ctx.saves, 0, 'промежуточный шаг не сохраняется как пройденный');

  const lastNext = byText(tutorials()[0], 'Понял!');
  const oldLast = lastNext._listeners.click[0].fn;
  lastNext.click();
  assert.equal(tutorials().length, 0);
  assert.equal(ctx.state.tutorial.steps, true);
  assert.equal(ctx.saves, 1);
  oldLast({ stopPropagation: () => {} });
  assert.equal(ctx.saves, 1, 'завершение тоже защищено от повторного события');
  assert.equal(target.listenerCount('pointerdown'), 0);
});

test('прожектор переизмеряется и полностью выключается кнопкой пропуска', (t) => {
  t.after(() => destroyTutorial());
  destroyTutorial();
  resetDom();
  const ctx = makeCtx();
  let toasts = 0;
  ctx.toast = () => { toasts += 1; };
  const target = new El('button');
  startTutorial(ctx, 'measure', [{ target, title: 'Замер', text: 'Текст' }]);
  assert.equal(target.scrollCalls, 1, 'цель прокручена в видимую область');
  const spot = tutorials()[0].querySelector('.tut-spot');
  target._rect = { left: 50, top: 60, right: 250, bottom: 140, width: 200, height: 80 };
  window.scrollX = 5;
  window.scrollY = 7;
  for (const fn of [...(windowListeners.resize || [])]) fn();
  assert.equal(spot.style.left, '45px');
  assert.equal(spot.style.top, '57px');
  assert.equal(spot.style.width, '220px');
  assert.equal(spot.style.height, '100px');

  byText(tutorials()[0], 'Пропустить обучение').click();
  assert.equal(ctx.state.tutorialSkipped, true);
  assert.equal(ctx.saves, 1);
  assert.equal(toasts, 1);
  assert.equal(tutorials().length, 0);
  assert.equal(target.listenerCount('pointerdown'), 0);
  assert.equal(listenerCount('resize'), 0);
  assert.equal(listenerCount('scroll'), 0);
  skipAllTutorials(ctx.state);
  assert.equal(tutorials().length, 0, 'публичный пропуск без активного сеанса безопасен');
  window.scrollX = 0;
  window.scrollY = 0;
});

test('tap-перестановка сохраняется, а перерисовка не копит window-слушатели', () => {
  resetDom();
  const ctx = makeCtx();
  const root = new El('main');
  const cleanup = renderFormation(root, ctx, { id: 'bt_slimes' });
  assert.equal(listenerCount('pointermove'), 1);
  assert.equal(listenerCount('pointerup'), 1);

  const knightSlot = () => flat(root).find((el) => classes(el).includes('form-slot')
    && el.dataset.side === 'ally' && Number(el.dataset.slot) === ctx.state.formation.knight);
  const targetSlot = (slot) => flat(root).find((el) => classes(el).includes('form-slot')
    && el.dataset.side === 'ally' && Number(el.dataset.slot) === slot);

  knightSlot().click();
  targetSlot(3).click();
  assert.equal(ctx.state.formation.knight, 3);
  assert.equal(ctx.saves, 1, 'перестановка тапом сохранена');
  assert.equal(listenerCount('pointermove'), 1, 'старый pointermove удалён до rerender');
  assert.equal(listenerCount('pointerup'), 1, 'старый pointerup удалён до rerender');

  knightSlot().click();
  targetSlot(4).click();
  assert.equal(ctx.state.formation.knight, 4);
  assert.equal(ctx.saves, 2);
  assert.equal(listenerCount('pointermove'), 1);
  assert.equal(listenerCount('pointerup'), 1);

  byText(root, '⚔️ В бой!').click();
  assert.equal(listenerCount('pointermove'), 0, 'при входе в реплей перетаскивание отключено');
  assert.equal(listenerCount('pointerup'), 0);
  cleanup();
  assert.equal(listenerCount('pointermove'), 0, 'cleanup внешнего экрана снимает текущий rerender');
  assert.equal(listenerCount('pointerup'), 0);
});

test('отмена реплея не даёт отложенному итогу появиться на другом экране', async () => {
  resetDom();
  const ctx = makeCtx();
  ctx.state.settings.battleSpeed = 5;
  const root = new El('main');
  const result = makeResult([{ t: 'sleeps', who: 'Рыцарь' }]);
  const cleanup = playBattleReplay(root, ctx, {
    title: 'Проверка', result, unitDefs: new Map(), overlayButtons: () => [],
  });
  cleanup();
  root.innerHTML = '';
  const nextScreen = new El('section');
  nextScreen.textContent = 'Другой экран';
  root.appendChild(nextScreen);
  await sleep(30);
  assert.equal(overlays().length, 0, 'таймер итога отменён');
  assert.equal(root.firstElementChild, nextScreen, 'новый экран не затронут');
});

test('итоговый оверлей реплея удаляется его cleanup', () => {
  resetDom();
  const ctx = makeCtx();
  const cleanup = playBattleReplay(new El('main'), ctx, {
    title: 'Проверка', result: makeResult(), unitDefs: new Map(), overlayButtons: () => [],
  });
  assert.equal(overlays().length, 1);
  cleanup();
  cleanup();
  assert.equal(overlays().length, 0);
});

test('реплей работает без requestAnimationFrame через отменяемый fallback', async () => {
  resetDom();
  const ctx = makeCtx();
  ctx.state.settings.battleSpeed = 5;
  const result = makeResult([{
    t: 'hit', fromUid: 'a0', toUid: 'e0', from: 'Рыцарь', to: 'Слизень', dmg: 5, ranged: true,
  }]);
  result.formation.allies = [{ uid: 'a0', cell: [0, 0], size: 1 }];
  result.formation.foes = [{ uid: 'e0', cell: [6, 0], size: 1 }];
  const unitDefs = new Map([
    ['a0', { name: 'Рыцарь', icon: '🛡️', hp: 60 }],
    ['e0', { name: 'Слизень', icon: '🟢', hp: 20 }],
  ]);
  const root = new El('main');
  const cleanup = playBattleReplay(root, ctx, {
    title: 'Проверка', result, unitDefs, overlayButtons: () => [],
  });
  const projectile = flat(root).find((el) => classes(el).includes('projectile'));
  assert.ok(projectile);
  await sleep(30);
  assert.ok(projectile.style.transform.includes('translate'), 'кадр fallback реально выполнен');
  cleanup();
  assert.equal(overlays().length, 0);
  await sleep(30);
  assert.equal(overlays().length, 0, 'отложенные эффекты после cleanup ничего не открывают');
});

test('Конструктор сохраняет кнопки реплея и отменяет текущий прогон при уходе', async () => {
  resetDom();
  const ctx = makeCtx();
  ctx.state.settings.battleSpeed = 5;
  const root = new El('main');
  const cleanup = renderSandbox(root, ctx);
  const one = byText(root, '⚔️ Один бой — смотреть');
  assert.ok(one, 'кнопка одиночного боя осталась');
  one.click();
  const skip = byText(root, '⏭️ К итогу');
  assert.ok(skip, 'кнопка пропуска реплея осталась');
  skip.click();
  const overlay = overlays()[0];
  assert.ok(overlay, 'итог Конструктора показан');
  const again = byText(overlay, '🔁 Ещё раз');
  assert.ok(again, 'кнопка повторного боя осталась');
  again.click();
  assert.equal(overlays().length, 0, 'старый итог закрыт перед новым прогоном');
  cleanup();
  await sleep(30);
  assert.equal(overlays().length, 0, 'новый прогон тоже отменён внешним cleanup');
});

test('onboarding dock единственный, переживает rerender, сворачивается и пропускается', () => {
  resetDom();
  const ctx = makeDockCtx(newGame());
  syncOnboardingDock(ctx, { name: 'hub', params: { scene: 'lavka' } });
  syncOnboardingDock(ctx, { name: 'hub', params: { scene: 'lavka' } });
  assert.equal(docks().length, 1, 'повторная синхронизация не создаёт второй dock');
  const screen = new El('main');
  screen.innerHTML = '<div>Новый экран</div>';
  assert.equal(docks().length, 1, 'внутренний rerender экрана не удаляет внешний dock');

  byData(docks()[0], 'onboardingAction', 'pause')[0].click();
  assert.equal(ctx.state.onboarding.status, 'paused');
  assert.equal(ctx.state.onboarding.step, 'prolog');
  assert.equal(docks().length, 1);
  assert.ok(docks()[0].classList.contains('compact'));
  assert.ok(byText(docks()[0], 'Продолжить обучение'));

  byData(docks()[0], 'onboardingAction', 'resume')[0].click();
  assert.equal(ctx.state.onboarding.status, 'active');
  assert.equal(ctx.state.onboarding.step, 'prolog', 'resume не выдаёт игровой прогресс');
  assert.deepEqual(ctx.visits.at(-1), ['story', { prologOnly: true }]);

  byData(docks()[0], 'onboardingAction', 'skip')[0].click();
  assert.equal(ctx.state.onboarding.status, 'skipped');
  assert.equal(docks().length, 0, 'skipped полностью скрывает dock');
  assert.equal(ctx.state.settings.storyMode, true);
});

test('финал дуги даёт три равноправных маршрута без нового задания', () => {
  resetDom();
  const state = newGame();
  state.onboarding.status = 'done';
  state.onboarding.step = 'done';
  const ctx = makeDockCtx(state);
  syncOnboardingDock(ctx, { name: 'craft', params: {} });
  const choices = byData(docks()[0], 'onboardingRoute', 'puzzles')
    .concat(byData(docks()[0], 'onboardingRoute', 'story'), byData(docks()[0], 'onboardingRoute', 'battles'));
  assert.equal(choices.length, 3);
  assert.ok(choices.every((button) => !button.classList.contains('primary')), 'ни один путь не навязан как основной');

  choices[0].click();
  assert.equal(state.onboarding.status, 'done');
  assert.equal(state.onboarding.step, 'done');
  assert.equal(state.onboarding.flags.finalSeen, true);
  assert.deepEqual(ctx.visits.at(-1), ['puzzles', {}]);
  assert.equal(state.onboarding.guide.started, true, 'после финала предлагается необязательный путеводитель');
  assert.equal(docks().length, 1, 'финал сменяется guide-dock, без второго слоя');
  byData(docks()[0], 'onboardingAction', 'guide-close')[0].click();
  assert.equal(state.onboarding.guide.closed, true);
  assert.equal(docks().length, 0, 'только скрытие самого путеводителя убирает dock');
});

test('смена маршрута и оверлей очищают прожектор без дублей dock', () => {
  resetDom();
  const state = newGame();
  state.story.prologSeen = true;
  reconcileOnboarding(state);
  const ctx = makeDockCtx(state);
  syncOnboardingDock(ctx, { name: 'puzzle', params: { id: 'md_01' } });
  const target = new El('button');
  documentStub.body.appendChild(target);
  startTutorial(ctx, 'route_cleanup', [{ target, title: 'Цель', text: 'Подсказка' }]);
  assert.equal(tutorials().length, 1);

  syncOnboardingDock(ctx, { name: 'battles', params: {} });
  assert.equal(tutorials().length, 0, 'старый прожектор удалён при смене маршрута');
  assert.equal(docks().length, 1);

  startTutorial(ctx, 'overlay_cleanup', [{ target, title: 'Цель', text: 'Подсказка' }]);
  const overlay = showOverlay(ctx, { title: 'Итог', buttons: [] });
  assert.equal(tutorials().length, 0, 'над итоговым оверлеем не остаётся прожектора');
  assert.equal(overlays().length, 1);
  assert.equal(docks().length, 1, 'dock остаётся под оверлеем, а не дублируется');
  overlay.remove();
  destroyOnboardingDock();
  assert.equal(docks().length, 0);
});

test('общий оверлей ведёт по учебному маршруту через Enter и не двигает шаг кнопкой', () => {
  resetDom();
  const state = newGame();
  state.story.prologSeen = true;
  reconcileOnboarding(state);
  completePuzzle(state, 'md_01');
  state.savingsGoal = { kind: 'item', id: 'rng_health' };
  const ctx = makeCtx(state);
  ctx.visits = [];
  ctx.go = (...args) => ctx.visits.push(args);
  const ordinary = () => ({ label: 'Обычный переход', primary: true, onClick: () => {} });
  showOverlay(ctx, {
    title: 'Победа', onboardingResult: { kind: 'puzzle', id: 'md_01' }, buttons: [ordinary()],
  });
  assert.match(overlays()[0].innerHTML, /goal-progress/);
  assert.match(overlays()[0].innerHTML, /Кольцо здоровья/, 'строка цели внутри общего оверлея');
  const cta = byText(overlays()[0], 'К «Первому зеркалу»');
  assert.ok(cta?.classList.contains('primary'));
  assert.ok(!byText(overlays()[0], 'Обычный переход').classList.contains('primary'));
  const before = structuredClone(state.onboarding);
  for (const fn of [...(windowListeners.keydown || [])]) fn({ key: 'Enter', preventDefault: () => {} });
  assert.deepEqual(ctx.visits.at(-1), ['puzzle', { id: 'md_02' }]);
  assert.deepEqual(state.onboarding, before, 'сам переход не отметил md_02 решённым');
  assert.equal(overlays().length, 0);

  showOverlay(ctx, {
    title: 'Победа', onboardingResult: { kind: 'puzzle', id: 'md_01' }, buttons: [ordinary()],
  });
  for (const fn of [...(windowListeners.keydown || [])]) fn({ key: ' ', preventDefault: () => {} });
  assert.equal(ctx.visits.length, 2, 'пробел тоже нажимает учебную основную кнопку');
});

test('story CTA подавлен в дуге и возвращается после done или skipped', () => {
  resetDom();
  const state = newGame();
  state.story.justCompleted = 'md_01';
  const ctx = makeCtx(state);
  ctx.visits = [];
  ctx.go = (...args) => ctx.visits.push(args);
  showOverlay(ctx, { title: 'Победа', buttons: [] });
  assert.ok(!byText(overlays()[0], '📖 Дальше по истории'));
  assert.equal(state.story.justCompleted, 'md_01', 'сохранённый переход не съедается');
  overlays()[0].remove();

  for (const status of ['done', 'skipped']) {
    state.onboarding.status = status;
    state.onboarding.step = status === 'done' ? 'done' : 'prolog';
    showOverlay(ctx, { title: 'Победа', buttons: [] });
    const storyButton = byText(overlays().at(-1), '📖 Дальше по истории');
    assert.ok(storyButton, `${status}: обычная история доступна`);
    storyButton.click();
    assert.deepEqual(ctx.visits.at(-1), ['story']);
    assert.equal(state.story.justCompleted, null);
    state.story.justCompleted = 'md_01';
  }
});

test('formation после слизней показывает учебный CTA вместо следующей битвы', () => {
  resetDom();
  const state = newGame();
  state.story.prologSeen = true;
  state.puzzlesDone = { md_01: {}, md_02: {}, tw_01: {} };
  state.onboarding.step = 'bt_slimes';
  const ctx = makeCtx(state);
  ctx.visits = [];
  ctx.go = (...args) => ctx.visits.push(args);
  const root = new El('main');
  const cleanup = renderFormation(root, ctx, { id: 'bt_slimes' });
  const start = byText(root, '⚔️ В бой!');
  assert.equal(start.dataset.battleStart, 'bt_slimes');
  start.click();
  byText(root, '⏭️ К итогу').click();
  const overlay = overlays()[0];
  assert.ok(overlay, 'реальный итог боя показан');
  assert.equal(state.onboarding.step, 'square');
  assert.ok(!flat(overlay).some((el) => String(el.textContent || '').includes('Следующая битва')));
  const cta = byText(overlay, 'Потратить добычу');
  assert.ok(cta?.classList.contains('primary'));
  cta.click();
  assert.deepEqual(ctx.visits.at(-1), ['hub', { scene: 'lavka' }]);
  assert.equal(state.onboarding.step, 'square', 'CTA не заменяет фактический переход по сценам');
  cleanup();
});

test('formation при нуле энергии предлагает practice и не выдаёт прогресс', () => {
  resetDom();
  const state = newGame();
  state.onboarding.status = 'done';
  state.onboarding.step = 'done';
  state.battlesDone.bt_slimes = { victories: 1 };
  state.battleEnergy.value = 0;
  const ctx = makeCtx(state);
  const root = new El('main');
  const cleanup = renderFormation(root, ctx, { id: 'bt_slimes' });
  assert.ok(byData(root, 'energyValue', '0').length > 0);
  const rewarded = byText(root, 'Нужно 1 ⚡');
  assert.equal(rewarded.disabled, true, 'наградная кнопка честно заблокирована');
  assert.equal(byText(root, '⚔️ В бой!'), undefined);
  const practice = byText(root, '🛡️ Тренировка без наград');
  assert.ok(practice?.classList.contains('primary'), 'тренировка — понятный основной выход');

  const before = structuredClone(state);
  practice.click();
  byText(root, '⏭️ К итогу').click();
  const overlay = overlays()[0];
  assert.match(overlay.innerHTML, /Тренировка без наград/);
  assert.match(overlay.innerHTML, /энергия 0\/36 не потрачена/);
  assert.equal(byText(overlay, 'Потратить добычу'), undefined, 'учебный CTA не принимает practice за победу');
  assert.deepEqual(state, before, 'UI practice не меняет ни прогресс, ни пояс, ни энергию');
  assert.equal(ctx.saves, 0, 'тренировка не запускает сохранение и проверку достижений');
  cleanup();
  assert.equal(overlays().length, 0);
});

test('formation босса показывает название находки и ближайшую гарантию', () => {
  resetDom();
  const state = newGame();
  state.battlesDone.bt_hunt_trail = { victories: 1 };
  state.battlesDone.bt_boss_willow = { victories: 1 };
  state.bossDrops.bt_boss_willow = { dry: 11, collected: false };
  const root = new El('main');
  const cleanup = renderFormation(root, makeCtx(state), { id: 'bt_boss_willow' });
  assert.ok(byText(root, '🎁 Возможная находка: «Щит ивовой клятвы»'));
  assert.ok(byText(root, 'Следующая наградная победа гарантирует находку.'));
  assert.ok(flat(root).some((el) => String(el.textContent || '').includes('Победа с наградой — 3 ⚡')));
  cleanup();
});

test('итог босса показывает отдельную радость дропа и энергию после победы', () => {
  resetDom();
  const result = makeResult();
  result.victory = true;
  result.report.victory = true;
  result.report.advice = null;
  result.energySpent = 3;
  result.energyAfter = 33;
  result.bossDrop = {
    dropped: true, itemId: 'shd_willow_vow', chance: 1, dry: 11, guaranteed: true,
  };
  const cleanup = playBattleReplay(new El('main'), makeCtx(), {
    title: 'Старая ива', result, unitDefs: new Map(), overlayButtons: () => [],
  });
  const overlay = overlays()[0];
  const joy = flat(overlay).find((el) => classes(el).includes('boss-drop-joy'));
  assert.ok(joy, 'отдельный блок редкой находки внутри прежнего overlay');
  assert.match(joy.innerHTML, /Редкая находка босса/);
  assert.match(joy.innerHTML, /Щит ивовой клятвы/);
  assert.match(joy.innerHTML, /Гарантия/);
  assert.match(overlay.innerHTML, /Энергия после победы: 33\/36 \(−3\)/);
  cleanup();
  assert.equal(overlays().length, 0);
});

test('prologOnly на последней реплике ведёт к md_01 без story.pending', () => {
  resetDom();
  const state = newGame();
  const ctx = makeCtx(state);
  ctx.visits = [];
  ctx.go = (...args) => ctx.visits.push(args);
  ctx.save = () => { ctx.saves += 1; reconcileOnboarding(state); };
  const root = new El('main');
  const cleanup = renderStory(root, ctx, { prologOnly: true });
  const next = () => flat(root).find((el) => classes(el).includes('story-next'));
  for (let i = 0; i < STORY_PROLOG.length; i += 1) next().click();

  assert.equal(state.story.prologSeen, true);
  assert.equal(state.story.pending, null);
  assert.equal(state.story.step, 0);
  assert.equal(state.onboarding.step, 'md_01');
  assert.deepEqual(ctx.visits.at(-1), ['puzzle', { id: 'md_01' }]);
  assert.equal(state.settings.storyMode, true);
  const revisit = renderStory(new El('main'), ctx, { prologOnly: true });
  assert.equal(revisit, undefined, 'повторный prologOnly не открывает story-ring');
  assert.deepEqual(ctx.visits.at(-1), ['hub']);
  assert.equal(state.story.pending, null);
  cleanup();
});

test('formation после победы над пчёлами ведёт к реальному рецепту, а не к следующей битве', () => {
  resetDom();
  const state = newGame();
  state.coins = 200;
  state.story.prologSeen = true;
  state.puzzlesDone = { md_01: {}, md_02: {}, tw_01: {} };
  state.battlesDone.bt_slimes = { victories: 1 };
  state.materials.slime_jelly = 2;
  state.onboarding.flags.squareSeen = true;
  state.onboarding.flags.marketSeen = true;
  state.onboarding.step = 'bees_attempt';
  assert.equal(buyItem(state, 'bt_path').ok, true);
  assert.equal(buyItem(state, 'rng_health').ok, true);
  const ctx = makeCtx(state);
  ctx.visits = [];
  ctx.go = (...args) => ctx.visits.push(args);
  const root = new El('main');
  const cleanup = renderFormation(root, ctx, { id: 'bt_bees' });
  byText(root, '⚔️ В бой!').click();
  byText(root, '⏭️ К итогу').click();
  const overlay = overlays()[0];
  assert.equal(state.battlesDone.bt_bees.victories, 1);
  assert.equal(state.onboarding.step, 'craft');
  assert.ok(!flat(overlay).some((el) => String(el.textContent || '').includes('Следующая битва')));
  const cta = byText(overlay, 'К кузнице и котлу');
  assert.ok(cta?.classList.contains('primary'));
  cta.click();
  assert.deepEqual(ctx.visits.at(-1), ['craft', {}]);
  assert.equal(state.onboarding.step, 'craft', 'крафт ещё нужно сделать руками');
  cleanup();
});

test('старый done без guide не создаёт dock после миграции', () => {
  resetDom();
  const old = newGame();
  old.onboarding.status = 'done';
  old.onboarding.step = 'done';
  old.onboarding.flags.finalSeen = false;
  delete old.onboarding.guide;
  const memory = {};
  const storage = {
    getItem: (key) => memory[key] ?? null,
    setItem: (key, value) => { memory[key] = String(value); },
  };
  saveGame(old, storage);
  const loaded = loadGame(storage);
  const ctx = makeDockCtx(loaded);
  syncOnboardingDock(ctx, { name: 'hub', params: { scene: 'lavka' } });
  assert.equal(loaded.onboarding.guide.started, false);
  assert.equal(docks().length, 0);
});

test('guide dock не дублируется, CTA не отмечает визит, close/reopen идут до 8/8', () => {
  resetDom();
  const state = newGame();
  state.onboarding.status = 'done';
  state.onboarding.step = 'done';
  const ctx = makeDockCtx(state);
  syncOnboardingDock(ctx, { name: 'craft', params: {} });
  byData(docks()[0], 'onboardingAction', 'dismiss')[0].click();
  assert.equal(state.onboarding.guide.started, true);
  assert.equal(docks().length, 1);
  syncOnboardingDock(ctx, { name: 'tavern', params: {} });
  assert.equal(docks().length, 1);
  assert.ok(byText(docks()[0], 'Таверна и конюшня'));

  byData(docks()[0], 'onboardingGuideRoute', 'tavern')[0].click();
  assert.deepEqual(ctx.visits.at(-1), ['tavern', {}]);
  assert.deepEqual(state.onboarding.guide.seen, [], 'кнопка маршрута сама визит не отмечает');
  onboardingVisit(state, 'tavern');
  syncOnboardingDock(ctx, { name: 'tavern', params: {} });
  assert.ok(byText(docks()[0], 'Кабинет трофеев'));

  byData(docks()[0], 'onboardingAction', 'guide-close')[0].click();
  assert.equal(docks().length, 0);
  assert.equal(onboardingVisit(state, 'guests'), false, 'после скрытия визиты не идут');
  reopenOnboardingGuide(state);
  syncOnboardingDock(ctx, { name: 'guests', params: {} });
  assert.ok(byText(docks()[0], 'Кабинет трофеев'), 'reopen сохраняет следующий раздел');

  for (const section of ONBOARDING_GUIDE_SECTIONS) onboardingVisit(state, section.route.name, section.route.params);
  syncOnboardingDock(ctx, { name: 'shop', params: {} });
  assert.ok(byText(docks()[0], 'Лавка знакома'));
  assert.ok(flat(docks()[0]).some((el) => String(el.textContent || '') === 'Путеводитель 8/8'));
  assert.ok(!byText(docks()[0], 'Посмотреть раздел'), 'после 8/8 нет нового обязательного CTA');
  byData(docks()[0], 'onboardingAction', 'guide-close')[0].click();
  assert.equal(docks().length, 0);
});

test('кузница: обменник выбирает нужный выход, меняет курс и не копит обработчики', () => {
  resetDom();
  const emptyRoot = new El('main');
  renderCraft(emptyRoot, makeCtx(newGame()));
  assert.ok(!flat(emptyRoot).some((el) => classes(el).includes('material-exchange')),
    'без достаточного входа пустой панели нет');

  const state = newGame();
  state.battlesDone.bt_bees = { victories: 1 };
  state.materials = { nm_mask_shard: 6, willow_heart: 1 };
  const ctx = makeCtx(state);
  const root = new El('main');
  renderCraft(root, ctx);
  assert.ok(flat(root).some((el) => classes(el).includes('material-exchange')));
  const input = byData(root, 'exchangeInput', '1')[0];
  const output = byData(root, 'exchangeOutput', '1')[0];
  assert.equal(input.children.length, 2, 'вход только с достаточным количеством');
  assert.equal(output.children.length, REGULAR_MATERIALS.length, 'все обычные материалы доступны как выход');
  assert.equal(output.value, 'slime_jelly', 'по умолчанию выбран недостающий материал открытого рецепта');

  input.value = 'willow_heart';
  input.dispatch('change');
  const rate = flat(root).find((el) => classes(el).includes('material-exchange-rate'));
  assert.match(rate.textContent, /1 × .* → 2 ×/);
  byData(root, 'materialExchange', '1')[0].click();
  assert.equal(state.materials.willow_heart, undefined);
  assert.equal(state.materials.slime_jelly, 2);
  assert.equal(state.materials.nm_mask_shard, 6);
  assert.equal(state.journal.length, 1);
  assert.equal(ctx.saves, 1);

  assert.equal(byData(root, 'exchangeOutput', '1')[0].value, 'honey',
    'после получения слизи предпочтение перешло к недостающему мёду');
  let button = byData(root, 'materialExchange', '1')[0];
  assert.equal(button.listenerCount('click'), 1, 'rerender создаёт один живой обработчик');
  button.click();
  assert.equal(state.materials.nm_mask_shard, 3);
  assert.equal(state.materials.slime_jelly, 2);
  assert.equal(state.materials.honey, 1);
  assert.equal(state.journal.length, 2);
  assert.equal(ctx.saves, 2);

  button = byData(root, 'materialExchange', '1')[0];
  assert.equal(button.listenerCount('click'), 1);
  button.click();
  assert.equal(state.materials.nm_mask_shard, undefined);
  assert.equal(state.materials.slime_jelly, 3);
  assert.equal(state.materials.honey, 1);
  assert.equal(state.journal.length, 3);
  button = byData(root, 'materialExchange', '1')[0];
  assert.equal(button.listenerCount('click'), 1);
  button.click();
  assert.equal(state.materials.slime_jelly, undefined);
  assert.equal(state.materials.honey, 2);
  assert.equal(state.journal.length, 4);
  assert.ok(!flat(root).some((el) => classes(el).includes('material-exchange')),
    'после исчерпания допустимых входов панель исчезает');
});
