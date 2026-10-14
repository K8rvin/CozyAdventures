// Тесты механики «Карты судьбы».
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FATE_PUZZLES, FATE_CARDS } from '../src/data/puzzlesFate.js';
import {
  createFatePuzzle, placeCard, placeCardAt, removeSlot, undoFate, resetFate,
  submitFate, isFateSolved, applyFateHint, rewardFactor, markSpread,
  fateProgress, validateFateLevel, FATE_FREE_MISTAKES,
} from '../src/core/fatePuzzle.js';
import { newGame, completePuzzle, findPuzzle, ALL_PUZZLES } from '../src/core/state.js';

const byId = (id) => FATE_PUZZLES.find((l) => l.id === id);
const mk = (level) => createFatePuzzle(level, FATE_CARDS);

test('все уровни «Карт судьбы» валидны: история, расклад, гость', () => {
  assert.equal(FATE_PUZZLES.length, 96, 'fate_01–fate_96');
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

test('карту можно положить в конкретную позицию (перетаскивание)', () => {
  const s = mk(byId('fate_01'));
  assert.ok(placeCardAt(s, 'letter', 2), 'карта легла в третью позицию');
  assert.deepEqual(s.slots, [null, null, 'letter']);
  assert.equal(placeCardAt(s, 'home', 2), false, 'позиция занята');
  assert.equal(placeCardAt(s, 'star', 5), false, 'позиции не существует');
  assert.equal(placeCardAt(s, 'letter', 0), false, 'карта уже на столе');
  // Отмена возвращает именно эту позицию
  assert.ok(undoFate(s));
  assert.deepEqual(s.slots, [null, null, null]);
});

test('сброс очищает историю раскладов, но помнит штрафы', () => {
  const s = mk(byId('fate_01'));
  placeCard(s, 'star'); placeCard(s, 'home'); placeCard(s, 'letter');
  submitFate(s); // неверный расклад → попытка в истории, ошибка засчитана
  assert.equal(s.attempts.length, 1);
  assert.equal(s.mistakes, 1);
  resetFate(s);
  assert.equal(s.attempts.length, 0, 'история раскладов очищена');
  assert.equal(s.mistakes, 1, 'штрафы-ошибки остаются (экономика)');
});

test('рука перемешивается при создании (содержимое не меняется)', () => {
  const level = byId('fate_12');
  // Детерминированный ГСЧ: всегда 0 → каждый шаг меняет местами с первым
  const s = createFatePuzzle(level, FATE_CARDS, () => 0);
  assert.deepEqual([...s.hand].sort(), [...level.hand].sort(), 'те же карты');
  assert.notDeepEqual(s.hand, level.hand, 'порядок перемешан');
  // По умолчанию — Math.random, валидность хода проверяется по перемешанной руке
  const s2 = mk(level);
  assert.ok(placeCard(s2, s2.hand[0]), 'карта из перемешанной руки ложится');
});

test('в данных рука не начинается с ответов подряд (антиспойлер)', () => {
  for (const level of FATE_PUZZLES) {
    const trivial = level.story.every((part, i) => part.accept.includes(level.hand[i]));
    assert.ok(!trivial, `${level.id}: первые карты руки повторяют расклад — перемешай hand`);
  }
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
  // Ищем по содержанию, а не по id: порядок уровней пересобирается генератором
  const level = FATE_PUZZLES.find((l) => l.name === 'Качели паучка'); // Что было → Нить (связь)
  const s = mk(level);
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
  const level = FATE_PUZZLES.find((l) => l.story.length === 4); // расклад на 4 позиции
  const s = mk(level);
  assert.deepEqual(fateProgress(s), { ok: 0, total: 4 });
  placeCard(s, level.story[0].accept[0]);
  assert.deepEqual(fateProgress(s), { ok: 1, total: 4 });
});

test('колода растёт по одной карте за уровень (первая — база из 6)', () => {
  const seen = new Set();
  FATE_PUZZLES.forEach((level, i) => {
    const fresh = level.hand.filter((c) => !seen.has(c));
    const limit = i === 0 ? 6 : 1;
    assert.ok(fresh.length <= limit,
      `${level.id}: новых карт ${fresh.length} > ${limit} (${fresh.join(', ')})`);
    fresh.forEach((c) => seen.add(c));
  });
  assert.equal(seen.size, Object.keys(FATE_CARDS).length, 'вся колода вошла в игру');
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
