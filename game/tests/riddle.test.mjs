import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BOOK_PUZZLES } from '../src/data/puzzlesBook.js';
import {
  createRiddlePuzzle, placeLetter, removeSlot, undoRiddle, resetRiddle,
  submitRiddle, isRiddleSolved, applyRiddleHint, rewardFactor, letterMarks,
  markAttempt, answerLetters, validateRiddleLevel, FREE_MISTAKES, ALPHABET,
} from '../src/core/riddlePuzzle.js';
import { newGame, completePuzzle, todayKey } from '../src/core/state.js';

const RIDDLE = BOOK_PUZZLES.filter((l) => l.mechanic === 'riddle');
const byId = (id) => RIDDLE.find((l) => l.id === id);

test('все уровни «Загадки» валидны: короткое слово, загадка', () => {
  assert.equal(RIDDLE.length, 100, '100 уровней «Загадки Хранителя»');
  for (const level of RIDDLE) {
    const v = validateRiddleLevel(level);
    assert.ok(v.ok, `${level.id} (${level.name}): ${v.problems.join('; ')}`);
    assert.ok(answerLetters(level).length <= 6, `${level.id}: ответ не длиннее 6 букв`);
    assert.ok(!level.answer.includes('✦'), `${level.id}: ответ — одно слово`);
  }
});

test('ни один уровень не решён на старте', () => {
  for (const level of RIDDLE) {
    assert.equal(isRiddleSolved(createRiddlePuzzle(level)), false, level.id);
  }
});

test('положить/убрать/отмена/сброс (буквы не расходуются)', () => {
  const s = createRiddlePuzzle(byId('bk_01')); // ПАУТИНА
  assert.ok(placeLetter(s, 'П'));
  assert.ok(placeLetter(s, 'П'), 'одна и та же буква доступна повторно');
  assert.equal(s.slots[0], 'П');
  undoRiddle(s);
  assert.equal(s.slots[1], null, 'отмена сняла последнюю букву');
  assert.equal(s.slots[0], 'П');
  removeSlot(s, 0);
  assert.equal(s.slots[0], null);
  placeLetter(s, 'А');
  placeLetter(s, 'Б');
  resetRiddle(s);
  assert.ok(s.slots.every((x) => x === null));
});

test('разметка Wordle: точные, присутствующие, дубли', () => {
  const level = { answer: 'КАПУСТА' };
  // А в ответе дважды (позиции 1 и 6) — обе съедены точными попаданиями
  const m1 = markAttempt(level, 'ААААААА'.split(''));
  assert.deepEqual(m1, ['absent', 'exact', 'absent', 'absent', 'absent', 'absent', 'exact'],
    'двух точных А достаточно, остальные А — absent');
  const m2 = markAttempt(level, 'КАПУСТА'.split(''));
  assert.ok(m2.every((m) => m === 'exact'), 'полное совпадение — все exact');
  // Анаграмма без единой буквы на месте, кроме последней А
  const m3 = markAttempt(level, 'ТУКАПСА'.split(''));
  assert.deepEqual(m3, ['present', 'present', 'present', 'present', 'present', 'present', 'exact']);
});

test('неверная попытка уходит в историю с расцветкой', () => {
  const s = createRiddlePuzzle(byId('bk_02')); // СВЕЧА
  for (const _ of answerLetters(byId('bk_02'))) placeLetter(s, 'Б');
  const res = submitRiddle(s);
  assert.ok(res && res.solved === false);
  assert.equal(s.attempts.length, 1);
  assert.deepEqual(s.attempts[0].letters, 'БББББ'.split(''));
  assert.ok(s.attempts[0].marks.every((m) => m === 'absent'), 'все Б вне ответа');
  assert.equal(s.mistakes, 1);
  assert.ok(s.slots.every((x) => x === null), 'окошки очищены для новой попытки');
});

test('клавиатура окрашивается лучшим статусом буквы', () => {
  const s = createRiddlePuzzle(byId('bk_01')); // КНИГА
  // Попытка 1: К в начале (точное), попытка 2: К не на месте
  placeLetter(s, 'К');
  for (let i = 1; i < 5; i++) placeLetter(s, 'Б');
  submitRiddle(s);
  placeLetter(s, 'А');
  placeLetter(s, 'К'); // К на втором месте — в ответе там Н
  for (let i = 2; i < 5; i++) placeLetter(s, 'Ж');
  submitRiddle(s);
  const marks = letterMarks(s);
  assert.equal(marks['К'], 'exact', 'точное сильнее «есть в ответе»');
  assert.equal(marks['А'], 'present', 'А на нулевой позиции — есть в ответе, не на месте');
  assert.equal(marks['Б'], 'absent');
});

test('штраф за ошибки: первые 5 бесплатны, дальше −10% до пола 50%', () => {
  const s = createRiddlePuzzle(byId('bk_05'));
  assert.equal(rewardFactor(s), 1);
  s.mistakes = FREE_MISTAKES;
  assert.equal(rewardFactor(s), 1);
  s.mistakes = FREE_MISTAKES + 1;
  assert.ok(Math.abs(rewardFactor(s) - 0.9) < 1e-9);
  s.mistakes = 100;
  assert.equal(rewardFactor(s), 0.5);
});

test('подсказки решают каждый уровень «Загадки»', () => {
  for (const level of RIDDLE) {
    const s = createRiddlePuzzle(level);
    let guard = 30;
    while (!isRiddleSolved(s) && guard-- > 0) {
      const h = applyRiddleHint(s);
      assert.ok(h, `${level.id}: подсказка существует, пока не решено`);
      submitRiddle(s); // последняя буква заполняет строку — засчитываем
    }
    assert.ok(isRiddleSolved(s), `${level.id} решается подсказками`);
    assert.equal(s.mistakes, 0, 'подсказки не дают ошибок');
  }
});

test('штраф доезжает до награды: coinFactor уменьшает монеты', () => {
  // Заказ дня ×2 зависит от даты и состава кампании: гасим его,
  // чтобы тест был детерминированным
  const st = newGame();
  st.lastDailyBonus = todayKey();
  const full = completePuzzle(st, 'bk_01', {});
  assert.equal(full.find((r) => r.type === 'coins').amount, 90);
  const st2 = newGame();
  st2.lastDailyBonus = todayKey();
  const cut = completePuzzle(st2, 'bk_01', { coinFactor: 0.8 });
  assert.equal(cut.find((r) => r.type === 'coins').amount, 72);
});

test('тексты уровней — по-русски, ответы без самоназвания в имени', () => {
  for (const level of RIDDLE) {
    assert.ok(!/[a-z]/i.test(level.name), `${level.id}: имя латиницей`);
    assert.ok(!/[a-z]/i.test(level.intro), `${level.id}: интро латиницей`);
    assert.ok(!level.name.toUpperCase().includes(answerLetters(level)[0] + answerLetters(level)[1]),
      `${level.id}: имя не должно намекать на начало ответа`);
  }
});
