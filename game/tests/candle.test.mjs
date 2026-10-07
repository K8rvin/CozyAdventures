import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CANDLE_PUZZLES } from '../src/data/puzzlesCandle.js';
import {
  createCandlePuzzle, placeCandle, undoCandle, resetCandles,
  isCandleSolved, candleStatus, litByCandle, candleHint,
  solveCandles, validateCandleLevel,
} from '../src/core/candlePuzzle.js';

test('все уровни «Свечи и духи» валидны и решаемы', () => {
  assert.equal(CANDLE_PUZZLES.length, 8);
  CANDLE_PUZZLES.forEach((level, i) => {
    assert.equal(level.id, `cd_0${i + 1}`);
    const v = validateCandleLevel(level);
    assert.ok(v.ok, `${level.id} (${level.name}): ${v.problems.join('; ')}`);
  });
});

test('структура уровней по спецификации', () => {
  let prevDiff = 0;
  for (const level of CANDLE_PUZZLES) {
    assert.ok(level.name && level.intro, `${level.id}: имя и intro`);
    assert.ok(level.difficulty >= prevDiff, `${level.id}: сложность растёт`);
    prevDiff = level.difficulty;
    assert.ok(level.lanterns.length >= 1 && level.lanterns.length <= 3, `${level.id}: фонари 1-3`);
    assert.ok(level.spirits.length <= 3, `${level.id}: духи 0-3`);
    assert.ok(level.candleLimit >= 1 && level.candleLimit <= 5, `${level.id}: лимит 1-5`);
    assert.ok(level.radius >= 2 && level.radius <= 3, `${level.id}: радиус 2-3`);
    const coins = level.rewards.find((r) => r.type === 'coins');
    assert.ok(coins && coins.amount >= 100 && coins.amount <= 220, `${level.id}: монеты 100-220`);
  }
  const final = CANDLE_PUZZLES[CANDLE_PUZZLES.length - 1];
  assert.ok(final.rewards.some((r) => r.type === 'seals'), 'у финала есть печати');
});

test('свет расходится по Манхэттену и стены его блокируют', () => {
  const level = { grid: [5, 3], walls: [[2, 1]], lanterns: [], spirits: [], radius: 2, candleLimit: 1 };
  const lit = litByCandle(level, 0, 1);
  assert.ok(lit.has('1,1'), 'соседняя клетка освещена');
  assert.ok(lit.has('0,0') && lit.has('1,0'), 'диагональ через угол освещена (Манхэттен)');
  assert.ok(!lit.has('2,1'), 'стена сама не освещается');
  assert.ok(!lit.has('3,1'), 'свет не проходит сквозь стену');
  assert.ok(!lit.has('4,0'), 'дальше радиуса не светит');
});

test('постановка, повторный тап убирает, лимит свечей', () => {
  const level = CANDLE_PUZZLES.find((l) => l.id === 'cd_01');
  const s = createCandlePuzzle(level);
  const r1 = placeCandle(s, 1, 0);
  assert.deepEqual({ ok: r1.ok, action: r1.action }, { ok: true, action: 'place' });
  const r2 = placeCandle(s, 3, 3); // лимит исчерпан
  assert.equal(r2.ok, false);
  assert.equal(s.candles.size, 1);
  const r3 = placeCandle(s, 1, 0); // повторный тап — убрать
  assert.deepEqual({ ok: r3.ok, action: r3.action }, { ok: true, action: 'remove' });
  assert.equal(s.candles.size, 0);
  // На фонарь и за сетку поставить нельзя
  assert.equal(placeCandle(s, 2, 1).ok, false);
  assert.equal(placeCandle(s, 9, 9).ok, false);
});

test('отмена и сброс', () => {
  const level = CANDLE_PUZZLES.find((l) => l.id === 'cd_02');
  const s = createCandlePuzzle(level);
  placeCandle(s, 1, 0);
  placeCandle(s, 4, 1);
  assert.equal(s.candles.size, 2);
  undoCandle(s);
  assert.equal(s.candles.size, 1);
  undoCandle(s);
  assert.equal(s.candles.size, 0);
  assert.equal(undoCandle(s), false);
  placeCandle(s, 1, 0);
  resetCandles(s);
  assert.equal(s.candles.size, 0);
});

test('дух в свете блокирует решение', () => {
  const level = CANDLE_PUZZLES.find((l) => l.id === 'cd_03');
  const s = createCandlePuzzle(level);
  placeCandle(s, 2, 1); // светит и на фонарь, и на духа
  const st = candleStatus(s);
  assert.equal(st.lanternsLit, 1);
  assert.equal(st.spiritsLit, 1);
  assert.equal(st.solved, false);
  assert.equal(isCandleSolved(s), false);
  placeCandle(s, 2, 1); // убрать
  placeCandle(s, 3, 0); // только фонарь
  assert.ok(isCandleSolved(s));
});

test('cd_01 решается одной свечой', () => {
  const level = CANDLE_PUZZLES.find((l) => l.id === 'cd_01');
  const s = createCandlePuzzle(level);
  assert.equal(isCandleSolved(s), false);
  placeCandle(s, 2, 2);
  assert.ok(isCandleSolved(s));
});

test('решатель находит решения в пределах лимита', () => {
  for (const level of CANDLE_PUZZLES) {
    const { count, solutions, candidates } = solveCandles(level);
    assert.ok(count > 0, `${level.id}: нет решения`);
    assert.ok(candidates.length <= 22, `${level.id}: кандидатов ${candidates.length} > 22`);
    for (const sol of solutions) {
      assert.ok(sol.length <= level.candleLimit, `${level.id}: решение длиннее лимита`);
    }
  }
});

test('подсказки приводят к решению на всех уровнях', () => {
  for (const level of CANDLE_PUZZLES) {
    const s = createCandlePuzzle(level);
    let guard = 30;
    while (!isCandleSolved(s) && guard-- > 0) {
      const h = candleHint(s);
      if (h.type === 'already') break;
      assert.ok(h.type === 'place' || h.type === 'remove', `${level.id}: ${h.type}`);
      placeCandle(s, h.x, h.y);
    }
    assert.ok(isCandleSolved(s), `${level.id} должен решаться подсказками`);
  }
});

test('подсказка убирает лишнюю свечу', () => {
  const level = CANDLE_PUZZLES.find((l) => l.id === 'cd_03');
  const s = createCandlePuzzle(level);
  placeCandle(s, 2, 1); // лишняя: светит на духа
  placeCandle(s, 3, 0);
  const h = candleHint(s);
  assert.equal(h.type, 'remove');
  assert.deepEqual([h.x, h.y], [2, 1]);
});
