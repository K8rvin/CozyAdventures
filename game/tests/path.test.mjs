import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PATH_PUZZLES } from '../src/data/puzzlesPath.js';
import {
  createPathPuzzle, rotateTile, undoPath, resetPath,
  isPathSolved, tracePath, pathHint, validatePathLevel, connections,
} from '../src/core/pathPuzzle.js';

test('все уровни «Тропинки» валидны и решаемы', () => {
  for (const level of PATH_PUZZLES) {
    const v = validatePathLevel(level);
    assert.ok(v.ok, `${level.id} (${level.name}): ${v.problems.join('; ')}`);
  }
});

test('соединения плиток корректны', () => {
  assert.deepEqual(connections('straight', 0), [0, 2]);
  assert.deepEqual(connections('straight', 1), [1, 3]);
  assert.deepEqual(connections('corner', 0), [0, 1]);
  assert.deepEqual(connections('corner', 1), [1, 2]);
  assert.equal(connections('tee', 0).length, 3);
  assert.deepEqual(connections('start', 2), [2]);
});

test('pp_01 решается одним поворотом', () => {
  const level = PATH_PUZZLES.find((l) => l.id === 'pp_01');
  const s = createPathPuzzle(level);
  assert.equal(isPathSolved(s), false);
  const straight = level.tiles.findIndex((t) => t.type === 'straight');
  rotateTile(s, straight);
  assert.ok(isPathSolved(s));
  // и откатывается
  undoPath(s);
  assert.equal(isPathSolved(s), false);
});

test('зверь не пропускает тропинку', () => {
  const level = PATH_PUZZLES.find((l) => l.id === 'pp_04');
  const s = createPathPuzzle(level);
  const { reached } = tracePath(s);
  const beastIdx = level.tiles.findIndex((t) => t.type === 'beast');
  assert.ok(!reached.has(beastIdx));
});

test('поворот и отмена/сброс', () => {
  const level = PATH_PUZZLES.find((l) => l.id === 'pp_02');
  const s = createPathPuzzle(level);
  const idx = level.tiles.findIndex((t) => t.type === 'corner');
  const before = s.rot[idx];
  rotateTile(s, idx);
  assert.notEqual(s.rot[idx], before);
  undoPath(s);
  assert.equal(s.rot[idx], before);
  rotateTile(s, idx);
  resetPath(s);
  assert.equal(s.rot[idx], before);
});

test('фиксированные плитки не поворачиваются', () => {
  const level = PATH_PUZZLES.find((l) => l.id === 'pp_01');
  const s = createPathPuzzle(level);
  const startIdx = level.tiles.findIndex((t) => t.type === 'start');
  assert.equal(rotateTile(s, startIdx), false);
});

test('подсказки приводят к решению на всех уровнях', () => {
  for (const level of PATH_PUZZLES) {
    const s = createPathPuzzle(level);
    let guard = 40;
    while (!isPathSolved(s) && guard-- > 0) {
      const h = pathHint(s);
      if (h.type === 'already') break;
      assert.equal(h.type, 'rotate', `${level.id}: ${h.type}`);
      rotateTile(s, h.tileIndex);
    }
    assert.ok(isPathSolved(s), `${level.id} должен решаться подсказками`);
  }
});
