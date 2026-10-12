import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BOOK_PUZZLES } from '../src/data/puzzlesBook.js';
import {
  createHangmanPuzzle, guessLetter, undoHangman, resetHangman,
  isHangmanSolved, applyHangmanHint, rewardFactor, hangmanProgress,
  answerLetters, validateHangmanLevel, CANDLE_STEPS,
} from '../src/core/hangmanPuzzle.js';

const HANG = BOOK_PUZZLES.filter((l) => l.mechanic === 'hang');
const byId = (id) => HANG.find((l) => l.id === id);

test('все уровни «Строки» валидны: длинная строка, стих, автор', () => {
  assert.equal(HANG.length, 5, 'bk_06–bk_10 — уровни «Строки»');
  for (const level of HANG) {
    const v = validateHangmanLevel(level);
    assert.ok(v.ok, `${level.id} (${level.name}): ${v.problems.join('; ')}`);
    assert.ok(level.author, `${level.id}: у стиха есть атрибуция автора`);
  }
});

test('верная буква открывается во всех местах строки', () => {
  const s = createHangmanPuzzle(byId('bk_10')); // ГРОХОЧЕТ✦В✦НЕБЕ✦ГОЛУБОМ
  const oCount = answerLetters(byId('bk_10')).filter((c) => c === 'О').length;
  assert.equal(oCount, 4, 'четыре О в строке Тютчева');
  const r = guessLetter(s, 'О');
  assert.ok(r.ok && r.hit);
  assert.ok(s.revealed.has('О'));
  assert.equal(s.candleLeft, CANDLE_STEPS, 'верное попадание не тратит воск');
  assert.equal(isHangmanSolved(s), false);
});

test('промах блокирует букву и топит свечу', () => {
  const s = createHangmanPuzzle(byId('bk_07')); // СОННОГО✦РУЧЬЯ — без Ы
  const r = guessLetter(s, 'Ы');
  assert.ok(r.ok && !r.hit && !r.burned);
  assert.equal(s.candleLeft, CANDLE_STEPS - 1);
  assert.ok(s.wrong.has('Ы'));
  assert.equal(guessLetter(s, 'Ы').ok, false, 'та же буква не принимается повторно');
  assert.equal(guessLetter(s, '!').ok, false, 'не-алфавит отклонён');
});

test('свеча догорела: страница погасла, открытые буквы остаются, штраф растёт', () => {
  const s = createHangmanPuzzle(byId('bk_09'));
  guessLetter(s, 'У'); // откроем букву («кругом»)
  assert.ok(s.revealed.has('У'));
  let burned = false;
  for (const ch of ['А', 'Б', 'Ж', 'З', 'Л', 'Н']) {
    burned = guessLetter(s, ch).burned || burned;
  }
  assert.ok(burned, 'шестой промах догорел свечу');
  assert.equal(s.spoiled, 1);
  assert.equal(s.candleLeft, CANDLE_STEPS, 'новая свеча полная');
  assert.ok(s.revealed.has('У'), 'открытые буквы не скрываются');
  assert.ok(Math.abs(rewardFactor(s) - 0.9) < 1e-9, '−10% за погасшую страницу');
  s.spoiled = 10;
  assert.equal(rewardFactor(s), 0.5, 'пол штрафа — 50%');
});

test('отмена возвращает воск и разблокирует букву (включая догоревшую)', () => {
  const s = createHangmanPuzzle(byId('bk_08'));
  guessLetter(s, 'Ю'); // промах
  assert.equal(s.candleLeft, CANDLE_STEPS - 1);
  undoHangman(s);
  assert.equal(s.candleLeft, CANDLE_STEPS);
  assert.equal(s.wrong.size, 0);
  // Догорание тоже отменяется корректно
  for (const ch of ['Б', 'Г', 'Ж', 'Й', 'Ф', 'Ы']) guessLetter(s, ch);
  assert.equal(s.spoiled, 1);
  undoHangman(s);
  assert.equal(s.spoiled, 0, 'отмена догорания возвращает страницу');
  assert.equal(s.candleLeft, 1, 'отмена возвращает последний воск');
});

test('сброс скрывает строку, но помнит погасшие страницы', () => {
  const s = createHangmanPuzzle(byId('bk_06'));
  guessLetter(s, 'О');
  s.spoiled = 1;
  resetHangman(s);
  assert.equal(s.revealed.size, 0);
  assert.equal(s.candleLeft, CANDLE_STEPS);
  assert.equal(s.spoiled, 1, 'штраф за погасшие страницы сохраняется');
});

test('подсказки решают каждый уровень «Строки»', () => {
  for (const level of HANG) {
    const s = createHangmanPuzzle(level);
    let guard = 40;
    while (!isHangmanSolved(s) && guard-- > 0) {
      const h = applyHangmanHint(s);
      assert.ok(h, `${level.id}: подсказка существует, пока не решено`);
    }
    assert.ok(isHangmanSolved(s), `${level.id} решается подсказками`);
    assert.equal(s.spoiled, 0, 'подсказки не тратят воск');
  }
});

test('прогресс считает открытые различные буквы', () => {
  const s = createHangmanPuzzle(byId('bk_07'));
  const before = hangmanProgress(s);
  assert.equal(before.ok, 0);
  guessLetter(s, 'О'); // три О в «сонного ручья»
  const after = hangmanProgress(s);
  assert.equal(after.ok, before.ok + 1, 'различные буквы, не вхождения');
});

test('тексты уровней «Строки» — по-русски, без латинских ключей', () => {
  for (const level of HANG) {
    assert.ok(!/[a-z]/i.test(level.name), `${level.id}: имя латиницей`);
    assert.ok(!/[a-z]/i.test(level.intro), `${level.id}: интро латиницей`);
  }
});
