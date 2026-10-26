import { test } from 'node:test';
import assert from 'node:assert/strict';

class El {
  constructor(tag) {
    this.tagName = tag;
    this.children = [];
    this.dataset = {};
    this.style = {};
    this.classList = {
      values: new Set(),
      add: (...values) => values.forEach((value) => this.classList.values.add(value)),
      contains: (value) => this.classList.values.has(value),
    };
    this._listeners = {};
    this.hidden = false;
  }
  set className(value) {
    this._className = value;
    this.classList.values = new Set(String(value).split(/\s+/).filter(Boolean));
  }
  get className() { return this._className || ''; }
  appendChild(child) { child.parent = this; this.children.push(child); return child; }
  append(...children) { children.forEach((child) => this.appendChild(child)); }
  remove() {
    if (!this.parent) return;
    this.parent.children = this.parent.children.filter((child) => child !== this);
    this.parent = null;
  }
  setAttribute() {}
  addEventListener(type, fn) { (this._listeners[type] ||= []).push(fn); }
  click() { for (const fn of this._listeners.click || []) fn({ preventDefault() {} }); }
  set innerHTML(value) { this.children = []; this._innerHTML = value; }
  get innerHTML() { return this._innerHTML || ''; }
}

function flat(root, out = []) {
  out.push(root);
  for (const child of root.children) flat(child, out);
  return out;
}

function setupDom() {
  const body = new El('body');
  const findOverlay = (root) => flat(root).find((el) => el.classList.contains('overlay')) || null;
  globalThis.document = {
    body,
    createElement: (tag) => new El(tag),
    querySelector: (selector) => selector === '.overlay' ? findOverlay(body) : null,
  };
  return body;
}

const {
  queueAchievementCelebrations, setAchievementPresentationBusy,
  clearAchievementCelebrations, destroyAchievementCelebration, achievementCelebrationState,
} = await import('../src/ui/achievementCelebration.js');
const { achievementArtEl } = await import('../src/ui/achievementArt.js');

function cleanup(t) {
  t.after(() => {
    destroyAchievementCelebration();
    delete globalThis.document;
  });
}

function achievement(id, rarity = 'common') {
  return { id, name: `Награда ${id}`, rarity };
}

test('очередь показывает каждое достижение отдельно, без дублей и наложения звуков', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  cleanup(t);
  const body = setupDom();
  const sounds = [];
  const sfx = (name, rank) => sounds.push([name, rank]);
  queueAchievementCelebrations([achievement('first'), achievement('second', 'legendary')], { sfx });
  queueAchievementCelebrations([achievement('first')], { sfx });
  t.mock.timers.tick(899);
  assert.equal(achievementCelebrationState().activeId, null);
  t.mock.timers.tick(1);
  assert.equal(achievementCelebrationState().activeId, 'first');
  assert.equal(achievementCelebrationState().visible, true);
  assert.deepEqual(achievementCelebrationState().queuedIds, ['second']);
  assert.deepEqual(sounds, [['achievement', 0]]);

  t.mock.timers.tick(3800);
  t.mock.timers.tick(179);
  assert.equal(achievementCelebrationState().activeId, null);
  t.mock.timers.tick(1);
  assert.equal(achievementCelebrationState().activeId, 'second');
  assert.deepEqual(sounds, [['achievement', 0], ['achievement', 4]]);
  assert.equal(flat(body).filter((el) => el.dataset.achievementId === 'second').length, 1);
});

test('busy приостанавливает очередь до конца реплея и не повторяет уже сыгранный звук', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  cleanup(t);
  setupDom();
  const sounds = [];
  setAchievementPresentationBusy('battle-replay', true);
  queueAchievementCelebrations([achievement('paused')], { sfx: (...args) => sounds.push(args) });
  t.mock.timers.tick(2000);
  assert.equal(achievementCelebrationState().activeId, null);
  setAchievementPresentationBusy('battle-replay', false);
  t.mock.timers.tick(120);
  assert.equal(achievementCelebrationState().visible, true);
  assert.equal(sounds.length, 1);
  setAchievementPresentationBusy('battle-replay', true);
  t.mock.timers.tick(250);
  assert.equal(achievementCelebrationState().visible, false);
  setAchievementPresentationBusy('battle-replay', false);
  t.mock.timers.tick(120);
  assert.equal(achievementCelebrationState().visible, true);
  assert.equal(sounds.length, 1);
});

test('открытый overlay задерживает показ, а закрытие кнопкой запускает следующий', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  cleanup(t);
  const body = setupDom();
  const overlay = new El('div');
  overlay.classList.add('overlay');
  body.appendChild(overlay);
  queueAchievementCelebrations([achievement('one'), achievement('two')]);
  t.mock.timers.tick(2000);
  assert.equal(achievementCelebrationState().activeId, null);
  overlay.remove();
  t.mock.timers.tick(250);
  t.mock.timers.tick(250);
  assert.equal(achievementCelebrationState().activeId, 'one', JSON.stringify(achievementCelebrationState()));
  const close = flat(body).find((el) => el.classList.contains('achievement-celebration-close'));
  close.click();
  t.mock.timers.tick(180);
  assert.equal(achievementCelebrationState().activeId, 'two');
  clearAchievementCelebrations();
  assert.equal(achievementCelebrationState().activeId, null);
  assert.deepEqual(achievementCelebrationState().queuedIds, []);
});

test('арт секрета и fallback не используют эмодзи', (t) => {
  cleanup(t);
  setupDom();
  const art = achievementArtEl({ id: 'hidden_test', secret: true }, { concealed: true });
  const img = flat(art).find((el) => el.tagName === 'img');
  assert.equal(img.src, 'assets/achievements/_secret.webp');
  img._listeners.error[0]();
  assert.equal(flat(art).some((el) => el.tagName === 'img'), false);
  const fallback = flat(art).find((el) => el.classList.contains('achievement-art-fallback'));
  assert.equal(fallback.textContent, 'Секрет');
  assert.doesNotMatch(fallback.textContent, /[🏆🔒✓🌟]/u);
});
