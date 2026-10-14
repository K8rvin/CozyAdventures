// Тесты механики «Карты судьбы».
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FATE_PUZZLES, FATE_CARDS } from '../src/data/puzzlesFate.js';
import {
  createFatePuzzle, placeCard, removeSlot, undoFate, resetFate,
  submitFate, isFateSolved, applyFateHint, rewardFactor, markSpread,
  fateProgress, validateFateLevel, FATE_FREE_MISTAKES,
} from '../src/core/fatePuzzle.js';
import { newGame, completePuzzle, findPuzzle, ALL_PUZZLES } from '../src/core/state.js';

const byId = (id) => FATE_PUZZLES.find((l) => l.id === id);
const mk = (level) => createFatePuzzle(level, FATE_CARDS);

test('все уровни «Карт судьбы» валидны: история, расклад, гость', () => {
  assert.equal(FATE_PUZZLES.length, 12, 'fate_01–fate_12');
  for (const level of FATE_PUZZLES) {
    const v = validateFateLevel(level, FATE_CARDS);
    assert.ok(v.ok, `${level.id} (${level.name}): ${v.problems.join('; ')}`);
  }
});

test('карта ложится в первую свободную позицию, тап по позиции возвращает её', () => {
  const s = mk(byId('fate_01'));
  assert.ok(placeCard(s, 'path'));
  assert.ok(placeCard(s, 'star'));
  assert.deepEqual(s.slots, ['path', 'star', null]);
  assert.equal(placeCard(s, 'path'), false, 'карта разыгрывается один раз');
  assert.equal(placeCard(s, 'nope'), false, 'карты не из руки нет');
  assert.ok(removeSlot(s, 1));
  assert.deepEqual(s.slots, ['path', null, null]);
  // Вернувшаяся карта снова доступна, но идёт в ПЕРВУЮ свободную позицию
  assert.ok(placeCard(s, 'star'));
  assert.deepEqual(s.slots, ['path', 'star', null]);
});

test('отмена и сброс работают', () => {
  const s = mk(byId('fate_01'));
  placeCard(s, 'path');
  placeCard(s, 'home');
  assert.ok(undoFate(s));
  assert.deepEqual(s.slots, ['path', null, null]);
  placeCard(s, 'home');
  resetFate(s);
  assert.deepEqual(s.slots, [null, null, null]);
  assert.equal(isFateSolved(s), false);
});

test('верный расклад решает уровень', () => {
  const s = mk(byId('fate_01'));
  placeCard(s, 'path');
  placeCard(s, 'home');
  placeCard(s, 'letter');
  const res = submitFate(s);
  assert.ok(res.solved);
  assert.ok(isFateSolved(s));
});

test('неверный расклад: ошибка, расцветка в истории, карты возвращаются', () => {
  const s = mk(byId('fate_01'));
  placeCard(s, 'star'); // не подходит «Что было» (Дорога)
  placeCard(s, 'home');
  placeCard(s, 'letter');
  const res = submitFate(s);
  assert.equal(res.solved, false);
  assert.deepEqual(res.marks, ['absent', 'exact', 'exact']);
  assert.equal(s.mistakes, 1);
  assert.deepEqual(s.slots, [null, null, null], 'карты вернулись в руку');
  assert.equal(s.attempts.length, 1);
});

test('карта с общим значением подсвечивается «близко», а не «не та»', () => {
  const s = mk(byId('fate_05')); // «Что было» ждёт Нить (связь, тянучесть)
  // Письмо делит со Нитью значение «связь» → present
  assert.deepEqual(markSpread(s, ['letter', 'home', 'mirror']), ['present', 'exact', 'exact']);
  // Совсем чужая карта → absent
  assert.deepEqual(markSpread(s, ['fire', 'home', 'mirror']), ['absent', 'exact', 'exact']);
});

test('экономика ошибок: первые бесплатны, дальше −10%, пол 50%', () => {
  const s = mk(byId('fate_01'));
  for (let i = 0; i < FATE_FREE_MISTAKES; i++) {
    placeCard(s, 'star'); placeCard(s, 'home'); placeCard(s, 'letter');
    submitFate(s);
  }
  assert.equal(s.mistakes, FATE_FREE_MISTAKES);
  assert.equal(rewardFactor(s), 1, 'бесплатные ошибки не режут награду');
  placeCard(s, 'star'); placeCard(s, 'home'); placeCard(s, 'letter');
  submitFate(s);
  assert.ok(Math.abs(rewardFactor(s) - 0.9) < 1e-9, '−10% за ошибку сверх бесплатных');
  s.mistakes = 20;
  assert.equal(rewardFactor(s), 0.5, 'пол штрафа — 50%');
});

test('подсказки решают каждый уровень «Карт судьбы»', () => {
  for (const level of FATE_PUZZLES) {
    const s = mk(level);
    let guard = 10;
    while (!isFateSolved(s) && guard-- > 0) {
      const h = applyFateHint(s);
      assert.ok(h, `${level.id}: подсказка существует, пока не решено`);
    }
    assert.ok(isFateSolved(s), `${level.id} решается подсказками`);
  }
});

test('прогресс считает закрытые позиции', () => {
  const s = mk(byId('fate_09')); // 4 позиции
  assert.deepEqual(fateProgress(s), { ok: 0, total: 4 });
  placeCard(s, 'tree');
  assert.deepEqual(fateProgress(s), { ok: 1, total: 4 });
});

test('тексты уровней и карт — по-русски, без латиницы', () => {
  for (const level of FATE_PUZZLES) {
    assert.ok(!/[a-z]/i.test(level.name), `${level.id}: имя латиницей`);
    assert.ok(!/[a-z]/i.test(level.intro), `${level.id}: интро латиницей`);
    for (const part of level.story) {
      assert.ok(!/[a-z]/i.test(part.label), `${level.id}: подпись позиции латиницей`);
      assert.ok(!/[a-z]/i.test(part.text), `${level.id}: текст истории латиницей`);
    }
  }
  for (const card of Object.values(FATE_CARDS)) {
    assert.ok(!/[a-z]/i.test(card.name), `${card.id}: имя карты латиницей`);
    for (const m of card.meanings) assert.ok(!/[a-z]/i.test(m), `${card.id}: значение латиницей`);
  }
});

test('уровни «Карт судьбы» включены в кампанию', () => {
  const ids = ALL_PUZZLES.map((p) => p.id);
  for (const l of FATE_PUZZLES) assert.ok(ids.includes(l.id), `${l.id} не в кампании`);
});

test('полный цикл: расклад через движок засчитывается в состоянии игры', () => {
  const s = newGame();
  const level = findPuzzle(s, 'fate_01');
  assert.ok(level, 'fate_01 доступна в состоянии игры');
  const p = mk(level);
  placeCard(p, 'path'); placeCard(p, 'home'); placeCard(p, 'letter');
  assert.ok(submitFate(p).solved);
  const coinsBefore = s.coins;
  const rewards = completePuzzle(s, 'fate_01', { moves: p.moves, hintsUsed: 0 });
  assert.ok(s.puzzlesDone.fate_01, 'уровень засчитан');
  assert.ok(s.coins > coinsBefore, 'монеты начислены');
  assert.ok(rewards.length > 0);
});
