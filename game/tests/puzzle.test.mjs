import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PUZZLES } from '../src/data/puzzles.js';
import {
  createPuzzle, rotateMirror, undo, reset, traceLight, isSolved, status, reflect,
} from '../src/core/puzzle.js';
import { findSolutions, validateLevel, hint, distanceToSolution } from '../src/core/solver.js';

test('reflect: зеркало \\ и / отражают корректно', () => {
  assert.equal(reflect(1, 0), 2); // вправо -> вниз (\)
  assert.equal(reflect(0, 0), 3); // вверх -> влево (\)
  assert.equal(reflect(1, 1), 0); // вправо -> вверх (/)
  assert.equal(reflect(2, 1), 3); // вниз -> влево (/)
});

test('все 12 уровней решаемы', () => {
  for (const level of PUZZLES) {
    const v = validateLevel(level);
    assert.ok(v.solvable, `уровень ${level.id} (${level.name}) должен быть решаем`);
  }
});

test('минимум в 3 уровнях есть несколько решений', () => {
  const multi = PUZZLES.filter((l) => validateLevel(l).solutionCount > 1);
  assert.ok(multi.length >= 3, `несколько решений должно быть хотя бы в 3 уровнях, сейчас: ${multi.length}`);
});

test('обучающий md_01 требует минимальное действие — один тап по зеркалу', () => {
  const level = PUZZLES.find((l) => l.id === 'md_01');
  const s = createPuzzle(level);
  assert.equal(isSolved(s), false, 'md_01 не должен решаться сам');
  const mirrorIdx = level.objects.findIndex((o) => o.type === 'mirror');
  assert.ok(mirrorIdx >= 0, 'зеркало обязано быть');
  rotateMirror(s, mirrorIdx);
  assert.ok(isSolved(s), 'один тап по зеркалу решает md_01');
});

test('уровень без решения из стартовой позиции решается поворотом', () => {
  const level = PUZZLES.find((l) => l.id === 'md_02');
  const s = createPuzzle(level);
  assert.equal(isSolved(s), false); // стартовая ориентация неверна
  const mirrorIdx = level.objects.findIndex((o) => o.type === 'mirror');
  rotateMirror(s, mirrorIdx);
  assert.equal(isSolved(s), true);
});

test('моль просыпается от света и ломает решение', () => {
  const level = PUZZLES.find((l) => l.id === 'md_05');
  const s = createPuzzle(level);
  // стартовая ориентация '\' ведёт луч вниз, на моль
  const t = traceLight(s);
  assert.equal(t.mothsAwake.size, 1);
  assert.equal(isSolved(s), false);
});

test('отмена и сброс работают', () => {
  const level = PUZZLES.find((l) => l.id === 'md_02');
  const s = createPuzzle(level);
  const mirrorIdx = level.objects.findIndex((o) => o.type === 'mirror');
  const before = s.orient[mirrorIdx];
  rotateMirror(s, mirrorIdx);
  assert.notEqual(s.orient[mirrorIdx], before);
  undo(s);
  assert.equal(s.orient[mirrorIdx], before);
  rotateMirror(s, mirrorIdx);
  reset(s);
  assert.equal(s.orient[mirrorIdx], before);
});

test('фонарь пропускает свет дальше (гирлянда)', () => {
  const level = PUZZLES.find((l) => l.id === 'md_07');
  const { solutions } = findSolutions(level);
  const s = createPuzzle(level);
  s.orient = { ...s.orient, ...solutions[0] };
  const st = status(s);
  assert.equal(st.lanternsLit, 2);
  assert.equal(st.solved, true);
});

test('подсказка ведёт к решению за distance шагов', () => {
  const level = PUZZLES.find((l) => l.id === 'md_12');
  const s = createPuzzle(level);
  let guard = 20;
  while (!isSolved(s) && guard-- > 0) {
    const h = hint(s);
    if (h.type === 'already') break;
    assert.equal(h.type, 'rotate');
    rotateMirror(s, h.objectIndex);
  }
  assert.ok(isSolved(s), 'подсказки должны привести к решению');
});

test('distanceToSolution уменьшается после подсказки', () => {
  const level = PUZZLES.find((l) => l.id === 'md_08');
  const s = createPuzzle(level);
  const d0 = distanceToSolution(s);
  const h = hint(s);
  rotateMirror(s, h.objectIndex);
  const d1 = distanceToSolution(s);
  assert.ok(d1 < d0, `дистанция должна уменьшиться: ${d0} -> ${d1}`);
});

test('в уровнях нет объектов за пределами сетки и дублей клеток', () => {
  for (const level of PUZZLES) {
    const [w, h] = level.grid;
    const seen = new Set();
    for (const o of level.objects) {
      const [x, y] = o.pos;
      assert.ok(x >= 0 && x < w && y >= 0 && y < h, `${level.id}: объект вне сетки`);
      const key = `${x},${y}`;
      assert.ok(!seen.has(key), `${level.id}: два объекта в клетке ${key}`);
      seen.add(key);
    }
  }
});
