// Тесты механики «Варка зелий по рецепту».
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createBrewPuzzle, doBrewAction, undoBrew, resetBrew,
  isBrewSolved, brewHint, brewStepText, validateBrewLevel, BREW_MAX_MISTAKES,
} from '../src/core/brewPuzzle.js';
import { BREW_PUZZLES } from '../src/data/puzzlesBrew.js';
import { newGame, completePuzzle, findPuzzle, ALL_PUZZLES } from '../src/core/state.js';

const L1 = BREW_PUZZLES[0]; // brew_01: вода, ромашка, размешать

test('верные действия по рецепту решают варку', () => {
  const p = createBrewPuzzle(L1);
  assert.equal(isBrewSolved(p), false);
  assert.equal(doBrewAction(p, { do: 'add', ingredient: 'water' }).ok, true);
  assert.equal(doBrewAction(p, { do: 'add', ingredient: 'chamomile' }).ok, true);
  const last = doBrewAction(p, { do: 'stir' });
  assert.equal(last.ok, true);
  assert.equal(last.solved, true);
  assert.equal(isBrewSolved(p), true);
});

test('ошибка не двигает прогресс, но считается', () => {
  const p = createBrewPuzzle(L1);
  const r = doBrewAction(p, { do: 'stir' }); // первым шагом — не положено
  assert.equal(r.ok, false);
  assert.equal(r.mistake, true);
  assert.deepEqual(r.expected, { do: 'add', ingredient: 'water' });
  assert.equal(p.progress, 0);
  assert.equal(p.mistakes, 1);
});

test('три ошибки портят зелье и начинают варку заново', () => {
  const p = createBrewPuzzle(L1);
  doBrewAction(p, { do: 'add', ingredient: 'water' }); // верный шаг
  doBrewAction(p, { do: 'stir' });
  doBrewAction(p, { do: 'heat' });
  const r = doBrewAction(p, { do: 'cool' }); // третья ошибка
  assert.equal(r.spoiled, true);
  assert.equal(p.progress, 0, 'прогресс сгорел');
  assert.equal(p.mistakes, 0);
  assert.equal(p.spoiled, 1);
  assert.equal(BREW_MAX_MISTAKES, 3);
});

test('отмена и сброс работают', () => {
  const p = createBrewPuzzle(L1);
  doBrewAction(p, { do: 'add', ingredient: 'water' });
  assert.equal(undoBrew(p), true);
  assert.equal(p.progress, 0);
  doBrewAction(p, { do: 'add', ingredient: 'water' });
  doBrewAction(p, { do: 'add', ingredient: 'chamomile' });
  resetBrew(p);
  assert.equal(p.progress, 0);
  assert.equal(isBrewSolved(p), false);
});

test('подсказка называет следующий шаг', () => {
  const p = createBrewPuzzle(L1);
  const h = brewHint(p);
  assert.equal(h.type, 'step');
  assert.deepEqual(h.step, { do: 'add', ingredient: 'water' });
  doBrewAction(p, { do: 'add', ingredient: 'water' });
  assert.deepEqual(brewHint(p).step, { do: 'add', ingredient: 'chamomile' });
});

test('действие с ингредиентом, которого нет на столе, отклоняется без ошибки рецепта', () => {
  const p = createBrewPuzzle(L1);
  const r = doBrewAction(p, { do: 'add', ingredient: 'pepper' });
  assert.equal(r.ok, false);
  assert.equal(r.mistake, undefined, 'это не ошибка рецепта, а невозможное действие');
  assert.equal(p.mistakes, 0);
});

test('тексты шагов — по-русски, без латинских ключей', () => {
  for (const level of BREW_PUZZLES) {
    for (const step of level.recipe) {
      const text = brewStepText(level, step);
      assert.ok(!/[a-zA-Z]/.test(text), `${level.id}: английское в тексте шага «${text}»`);
    }
    assert.ok(!/[a-zA-Z]/.test(level.intro), `${level.id}: английское во вступлении`);
    for (const ing of level.ingredients) {
      assert.ok(!/[a-zA-Z]/.test(ing.name), `${level.id}: английское имя ингредиента «${ing.name}»`);
    }
  }
});

test('все 10 уровней валидны и решаются своим рецептом', () => {
  assert.equal(BREW_PUZZLES.length, 10);
  const ids = new Set(BREW_PUZZLES.map((l) => l.id));
  assert.equal(ids.size, 10, 'id уровней дублируются');
  for (const level of BREW_PUZZLES) {
    const v = validateBrewLevel(level);
    assert.ok(v.ok, `${level.id}: ${v.problems.join('; ')}`);
  }
});

test('вариативный шаг anyOf: засчитывается любой вариант, текст с «ИЛИ»', () => {
  const L9 = BREW_PUZZLES.find((l) => l.id === 'brew_09');
  const p = createBrewPuzzle(L9);
  doBrewAction(p, { do: 'add', ingredient: 'water' });
  doBrewAction(p, { do: 'heat' });
  // Шаг 3 — «ягоды ИЛИ мёд»: мёд тоже годится
  const r = doBrewAction(p, { do: 'add', ingredient: 'honey' });
  assert.equal(r.ok, true, 'вариант anyOf должен засчитаться');
  assert.equal(p.progress, 3);
  // Не из списка — ошибка
  const bad = doBrewAction(p, { do: 'add', ingredient: 'salt' });
  assert.equal(bad.mistake, true);
  // Текст шага содержит ИЛИ
  const stepText = brewStepText(L9, L9.recipe[2]);
  assert.ok(stepText.includes(' ИЛИ '), `текст anyOf без ИЛИ: ${stepText}`);
  assert.ok(!/[a-zA-Z]/.test(stepText), 'английское в тексте anyOf');
});

test('уровни на память — только поздние и с временем показа рецепта', () => {
  for (const level of BREW_PUZZLES) {
    if (level.hideRecipe) {
      assert.ok(level.difficulty >= 3, `${level.id}: память слишком рано`);
      assert.ok(level.peekSeconds >= 5, `${level.id}: слишком мало времени на запоминание`);
    }
  }
  assert.ok(BREW_PUZZLES.filter((l) => l.hideRecipe).length >= 2, 'мало уровней на память');
});

test('уровни варки включены в кампанию после потоков', () => {
  const ids = ALL_PUZZLES.map((p) => p.id);
  const brewIdx = ids.indexOf('brew_01');
  assert.ok(brewIdx > ids.indexOf('flow_08'), 'варка должна идти после потоков');
  for (const l of BREW_PUZZLES) assert.ok(ids.includes(l.id), `${l.id} не в кампании`);
});

test('полный цикл: варка через движок засчитывается в состоянии игры', () => {
  const s = newGame();
  const level = findPuzzle(s, 'brew_01');
  assert.ok(level, 'brew_01 доступна в состоянии игры');
  const p = createBrewPuzzle(level);
  for (const step of level.recipe) doBrewAction(p, step);
  assert.ok(isBrewSolved(p));
  const coinsBefore = s.coins;
  const rewards = completePuzzle(s, 'brew_01', { moves: p.moves, hintsUsed: 0 });
  assert.ok(s.puzzlesDone.brew_01, 'уровень засчитан');
  assert.ok(s.coins > coinsBefore, 'монеты начислены');
  assert.ok(rewards.length > 0);
});
