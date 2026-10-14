import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GLASS_PUZZLES } from '../src/data/puzzlesGlass.js';
import {
  createGlassPuzzle, swapPieces, undoGlass, resetGlass,
  isGlassSolved, glassStatus, glassHint, hashSeed, validateGlassLevel,
} from '../src/core/glassPuzzle.js';

test('все уровни «Витраж миров» валидны', () => {
  const ids = new Set();
  for (const level of GLASS_PUZZLES) {
    const v = validateGlassLevel(level);
    assert.ok(v.ok, `${level.id} (${level.name}): ${v.problems.join('; ')}`);
    assert.ok(!ids.has(level.id), `дубль id ${level.id}`);
    ids.add(level.id);
    assert.equal(level.mechanic, 'glass', `${level.id}: mechanic должен быть glass`);
    // Русские строки заполнены
    assert.ok(/[А-Яа-яЁё]/.test(level.name), `${level.id}: name по-русски`);
    assert.ok(/[А-Яа-яЁё]/.test(level.intro), `${level.id}: intro по-русски`);
  }
});

test('перемешивание детерминировано и витраж не собран на старте', () => {
  const level = GLASS_PUZZLES[0];
  const a = createGlassPuzzle(level);
  const b = createGlassPuzzle(level);
  assert.deepEqual(a.pieces, b.pieces, 'одинаковый seed → одинаковая расстановка');
  assert.ok(!isGlassSolved(a), 'на старте не решено');
  const st = glassStatus(a);
  assert.ok(st.placed <= st.total - Math.ceil(st.total * 0.6), 'большинство осколков не на месте');
});

test('обмен, отмена и сброс', () => {
  const level = GLASS_PUZZLES.find((l) => l.id === 'gl_03');
  const s = createGlassPuzzle(level);
  const start = [...s.pieces];
  assert.equal(swapPieces(s, 0, 0), false, 'обмен с собой — не ход');
  swapPieces(s, 0, 1);
  assert.equal(s.pieces[0], start[1]);
  assert.equal(s.pieces[1], start[0]);
  assert.equal(s.moves, 1);
  undoGlass(s);
  assert.deepEqual(s.pieces, start, 'отмена вернула расстановку');
  swapPieces(s, 2, 5);
  swapPieces(s, 1, 3);
  resetGlass(s);
  assert.deepEqual(s.pieces, start, 'сброс вернул начальную расстановку');
  assert.equal(s.history.length, 0);
});

test('решение собранной расстановкой засчитывается', () => {
  const level = GLASS_PUZZLES[0];
  const s = createGlassPuzzle(level);
  // Собираем вручную: ставим каждый осколок на место
  const total = level.grid[0] * level.grid[1];
  for (let cell = 0; cell < total; cell++) {
    const at = s.pieces.indexOf(cell);
    if (at !== cell) swapPieces(s, cell, at);
  }
  assert.ok(isGlassSolved(s));
  const st = glassStatus(s);
  assert.equal(st.placed, st.total);
});

test('подсказки приводят к решению на всех уровнях', () => {
  for (const level of GLASS_PUZZLES) {
    const s = createGlassPuzzle(level);
    const total = level.grid[0] * level.grid[1];
    let guard = total + 5;
    while (!isGlassSolved(s) && guard-- > 0) {
      const h = glassHint(s);
      if (h.type === 'already') break;
      assert.equal(h.type, 'swap', `${level.id}: неожиданный тип подсказки`);
      assert.ok(s.pieces[h.from] !== h.from, `${level.id}: from реально не на месте`);
      assert.equal(s.pieces[h.to], h.from, `${level.id}: to держит нужный осколок`);
      swapPieces(s, h.from, h.to);
      // Обмен по подсказке ставит клетку from на место
      assert.equal(s.pieces[h.from], h.from, `${level.id}: подсказка должна чинить клетку`);
    }
    assert.ok(isGlassSolved(s), `${level.id} должен решаться подсказками`);
  }
  const solved = createGlassPuzzle(GLASS_PUZZLES[0]);
  for (let cell = 0; cell < 6; cell++) {
    const at = solved.pieces.indexOf(cell);
    if (at !== cell) swapPieces(solved, cell, at);
  }
  assert.equal(glassHint(solved).type, 'already');
});

test('hashSeed стабилен и различается между уровнями', () => {
  assert.equal(hashSeed('gl_01'), hashSeed('gl_01'));
  assert.notEqual(hashSeed('gl_01'), hashSeed('gl_02'));
});
