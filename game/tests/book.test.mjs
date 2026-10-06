import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BOOK_PUZZLES } from '../src/data/puzzlesBook.js';
import {
  createBookPuzzle, swapLetters, undoBook, resetBook, isBookSolved,
  bookProgress, bookHint, pathCells, validateBookLevel,
} from '../src/core/bookPuzzle.js';

test('все уровни мира 3 валидны (путь, мультимешок, разделители)', () => {
  for (const level of BOOK_PUZZLES) {
    const v = validateBookLevel(level);
    assert.ok(v.ok, `${level.id} (${level.name}): ${v.problems.join('; ')}`);
  }
});

test('путь-змейка пропускает кляксы', () => {
  const level = BOOK_PUZZLES.find((l) => l.id === 'bk_03'); // grid 3x2, blot [2,1]
  const path = pathCells(level);
  assert.equal(path.length, 5);
  assert.deepEqual(path, [[0, 0], [1, 0], [2, 0], [1, 1], [0, 1]]);
});

test('ни один уровень не решён на старте', () => {
  for (const level of BOOK_PUZZLES) {
    const s = createBookPuzzle(level);
    assert.equal(isBookSolved(s), false, `${level.id} не должен быть решён на старте`);
  }
});

test('обмен, отмена, сброс', () => {
  const level = BOOK_PUZZLES.find((l) => l.id === 'bk_01'); // МИР <- РИМ
  const s = createBookPuzzle(level);
  assert.equal(s.letters.join(''), 'РИМ');
  assert.ok(swapLetters(s, 0, 2));
  assert.equal(s.letters.join(''), 'МИР');
  assert.ok(isBookSolved(s));
  undoBook(s);
  assert.equal(s.letters.join(''), 'РИМ');
  swapLetters(s, 0, 2);
  resetBook(s);
  assert.equal(s.letters.join(''), 'РИМ');
});

test('разделитель ✦ неподвижен', () => {
  const level = BOOK_PUZZLES.find((l) => l.id === 'bk_04');
  const s = createBookPuzzle(level);
  const starIdx = s.letters.indexOf('✦');
  assert.equal(swapLetters(s, starIdx, 0), false);
});

test('подсказки решают каждый уровень мира 3', () => {
  for (const level of BOOK_PUZZLES) {
    const s = createBookPuzzle(level);
    let guard = 60;
    while (!isBookSolved(s) && guard-- > 0) {
      const h = bookHint(s);
      if (h.type === 'already') break;
      assert.equal(h.type, 'swap');
      assert.ok(swapLetters(s, h.i, h.j), `${level.id}: подсказка должна быть легальным ходом`);
    }
    assert.ok(isBookSolved(s), `${level.id} должен решаться по подсказкам`);
  }
});

test('прогресс считает буквы на местах', () => {
  const level = BOOK_PUZZLES.find((l) => l.id === 'bk_01');
  const s = createBookPuzzle(level);
  const before = bookProgress(s);
  swapLetters(s, 0, 2);
  const after = bookProgress(s);
  assert.ok(after.ok > before.ok);
  assert.equal(after.total, 3);
});
