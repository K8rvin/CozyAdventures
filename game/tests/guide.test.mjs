import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newGame, saveGame, loadGame } from '../src/core/state.js';
import {
  startOnboardingGuide, closeOnboardingGuide, reopenOnboardingGuide,
  onboardingGuideNext, onboardingVisit,
} from '../src/core/onboarding.js';
import { ONBOARDING_GUIDE_SECTIONS } from '../src/data/onboarding.js';

function doneState() {
  const state = newGame();
  state.onboarding.status = 'done';
  state.onboarding.step = 'done';
  state.onboarding.flags.finalSeen = true;
  return state;
}

function startedState() {
  const state = doneState();
  assert.equal(startOnboardingGuide(state), true);
  return state;
}

function roundTrip(state) {
  const memory = {};
  const storage = {
    getItem: (key) => memory[key] ?? null,
    setItem: (key, value) => { memory[key] = String(value); },
  };
  saveGame(state, storage);
  return loadGame(storage);
}

test('в данных путеводителя ровно восемь уникальных необязательных разделов', () => {
  assert.equal(ONBOARDING_GUIDE_SECTIONS.length, 8);
  assert.equal(new Set(ONBOARDING_GUIDE_SECTIONS.map((section) => section.id)).size, 8);
  for (const section of ONBOARDING_GUIDE_SECTIONS) {
    assert.ok(section.title && section.short && section.route.name);
    assert.ok(!['puzzles', 'battles', 'craft'].includes(section.id));
  }
  assert.deepEqual(ONBOARDING_GUIDE_SECTIONS.find((section) => section.id === 'cabinet').route,
    { name: 'hub', params: { scene: 'cabinet' } });
});

test('guide начинается только после скрытия финала, не во время основной дуги', () => {
  const state = newGame();
  assert.equal(startOnboardingGuide(state), false);
  assert.equal(state.onboarding.guide.started, false);
  state.onboarding.guide.started = true;
  assert.equal(onboardingVisit(state, 'tavern'), false, 'даже ручной флаг не меняет active arc');
  assert.equal(state.onboarding.step, 'prolog');
  assert.equal(onboardingGuideNext(state), null);

  const done = doneState();
  done.onboarding.flags.finalSeen = false;
  assert.equal(startOnboardingGuide(done), false, 'сначала нужно закрыть финальную карточку');
  done.onboarding.flags.finalSeen = true;
  assert.equal(startOnboardingGuide(done), true);
  assert.equal(startOnboardingGuide(done), false, 'повторный запуск не сбрасывает и не дублирует');
  assert.deepEqual(done.onboarding.guide, { started: true, seen: [], closed: false });
  assert.equal(onboardingGuideNext(done).id, 'tavern');
});

test('старый done без guide мигрируется без автозапуска и без финального dock-флага', () => {
  const old = doneState();
  old.onboarding.flags.finalSeen = false;
  delete old.onboarding.guide;
  const loaded = roundTrip(old);
  assert.equal(loaded.onboarding.status, 'done');
  assert.equal(loaded.onboarding.guide.started, false);
  assert.deepEqual(loaded.onboarding.guide.seen, []);
  assert.equal(loaded.onboarding.flags.finalSeen, true, 'старый финал тоже не навязывается повторно');
  assert.equal(onboardingGuideNext(loaded), null);
});

test('visit идемпотентен и точно различает hub scene, маршрут сам ничего не начисляет', () => {
  const state = startedState();
  const before = {
    step: state.onboarding.step,
    status: state.onboarding.status,
    coins: state.coins,
    seals: state.seals,
  };
  assert.equal(onboardingVisit(state, 'tavern'), true);
  assert.equal(onboardingVisit(state, 'tavern'), false);
  assert.deepEqual(state.onboarding.guide.seen, ['tavern']);
  assert.equal(onboardingGuideNext(state).id, 'cabinet');

  for (const scene of ['lavka', 'square', 'market']) {
    assert.equal(onboardingVisit(state, 'hub', { scene }), false, `${scene} не cabinet`);
  }
  assert.equal(onboardingVisit(state, 'hub', { scene: 'cabinet' }), true);
  assert.equal(onboardingVisit(state, 'hub', { scene: 'cabinet' }), false);
  assert.deepEqual(state.onboarding.guide.seen, ['tavern', 'cabinet']);
  assert.equal(onboardingGuideNext(state).id, 'guests');
  assert.deepEqual({
    step: state.onboarding.step,
    status: state.onboarding.status,
    coins: state.coins,
    seals: state.seals,
  }, before, 'нет награды и нет изменения основной дуги');
});

test('close скрывает и останавливает отметки, reopen продолжает без сброса seen', () => {
  const state = startedState();
  onboardingVisit(state, 'tavern');
  onboardingVisit(state, 'hub', { scene: 'cabinet' });
  const seen = [...state.onboarding.guide.seen];
  assert.equal(closeOnboardingGuide(state), true);
  assert.equal(onboardingVisit(state, 'guests'), false);
  assert.equal(onboardingGuideNext(state), null);
  assert.equal(closeOnboardingGuide(state), false);

  assert.equal(reopenOnboardingGuide(state), true);
  assert.equal(state.onboarding.guide.closed, false);
  assert.deepEqual(state.onboarding.guide.seen, seen);
  assert.equal(onboardingGuideNext(state).id, 'guests');
  assert.equal(state.onboarding.status, 'done');
  assert.equal(state.onboarding.step, 'done');
  assert.equal(state.onboarding.flags.finalSeen, true, 'основная дуга не перезапускается');
});

test('все восемь посещений дают 8/8 и поздравление без нового задания', () => {
  const state = startedState();
  for (const section of ONBOARDING_GUIDE_SECTIONS) {
    assert.equal(onboardingVisit(state, section.route.name, section.route.params), true, section.id);
    assert.equal(onboardingVisit(state, section.route.name, section.route.params), false, `${section.id}: повтор`);
  }
  assert.equal(state.onboarding.guide.seen.length, 8);
  assert.equal(onboardingGuideNext(state), null);
  closeOnboardingGuide(state);
  reopenOnboardingGuide(state);
  assert.equal(state.onboarding.guide.seen.length, 8);
  assert.equal(onboardingGuideNext(state), null, 'после 8/8 остаётся только поздравление');
});

test('started/seen/closed переживают save/load без автозапуска новых посещений', () => {
  const state = startedState();
  onboardingVisit(state, 'tavern');
  closeOnboardingGuide(state);
  const loaded = roundTrip(state);
  assert.deepEqual(loaded.onboarding.guide, { started: true, seen: ['tavern'], closed: true });
  assert.equal(onboardingGuideNext(loaded), null);
  assert.equal(reopenOnboardingGuide(loaded), true);
  assert.equal(onboardingGuideNext(loaded).id, 'cabinet');
});
