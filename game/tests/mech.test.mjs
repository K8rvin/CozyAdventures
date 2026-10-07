import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MECH_PUZZLES } from '../src/data/puzzlesMech.js';
import {
  createMechPuzzle, rotateGear, undoMech, resetMech,
  isMechSolved, traceMech, mechHint, validateMechLevel,
  faceAt, facesMesh, gearVariants,
} from '../src/core/mechPuzzle.js';

test('все уровни «Механизмов» валидны и решаемы', () => {
  assert.equal(MECH_PUZZLES.length, 8);
  for (const level of MECH_PUZZLES) {
    const v = validateMechLevel(level);
    assert.ok(v.ok, `${level.id} (${level.name}): ${v.problems.join('; ')}`);
    assert.ok(v.solutionCount >= 1, `${level.id}: решатель должен найти решение`);
  }
});

test('грани сцепляются только шип-с-пазом', () => {
  assert.ok(facesMesh('pin', 'socket'));
  assert.ok(facesMesh('socket', 'pin'));
  assert.ok(!facesMesh('pin', 'pin'));
  assert.ok(!facesMesh('socket', 'socket'));
  assert.ok(!facesMesh('pin', null));
  assert.ok(!facesMesh(null, null));
});

test('поворот сдвигает грани по сторонам', () => {
  const t = { faces: ['pin', 'socket', null, null] };
  assert.equal(faceAt(t, 0, 0), 'pin');
  assert.equal(faceAt(t, 1, 0), null);
  assert.equal(faceAt(t, 1, 1), 'pin');   // шип ушёл направо
  assert.equal(faceAt(t, 3, 0), 'socket'); // паз пришёл сверху
  assert.equal(faceAt({ faces: null }, 0, 0), null);
});

test('симметричные повороты схлопываются в вариантах', () => {
  const sym = { faces: ['pin', 'socket', 'pin', 'socket'] };
  assert.equal(gearVariants(sym).length, 2);
  const asym = { faces: ['pin', 'socket', null, null] };
  assert.equal(gearVariants(asym).length, 4);
});

test('mech_01 решается одним поворотом', () => {
  const level = MECH_PUZZLES.find((l) => l.id === 'mech_01');
  const s = createMechPuzzle(level);
  assert.equal(isMechSolved(s), false);
  const gear = level.tiles.findIndex((t) => t.type === 'gear');
  rotateGear(s, gear);
  assert.ok(isMechSolved(s));
  // и откатывается
  undoMech(s);
  assert.equal(isMechSolved(s), false);
});

test('заклинившая деталь не проводит передачу', () => {
  const level = MECH_PUZZLES.find((l) => l.id === 'mech_03');
  const s = createMechPuzzle(level);
  const { reached } = traceMech(s);
  const blockerIdx = level.tiles.findIndex((t) => t.type === 'blocker');
  assert.ok(!reached.has(blockerIdx));
});

test('поворот и отмена/сброс', () => {
  const level = MECH_PUZZLES.find((l) => l.id === 'mech_02');
  const s = createMechPuzzle(level);
  const idx = level.tiles.findIndex((t) => t.type === 'gear');
  const before = s.rot[idx];
  rotateGear(s, idx);
  assert.notEqual(s.rot[idx], before);
  undoMech(s);
  assert.equal(s.rot[idx], before);
  rotateGear(s, idx);
  resetMech(s);
  assert.equal(s.rot[idx], before);
  // история очищена: отменять нечего
  assert.equal(undoMech(s), false);
});

test('рукоять и колокольчик не поворачиваются', () => {
  const level = MECH_PUZZLES.find((l) => l.id === 'mech_01');
  const s = createMechPuzzle(level);
  const startIdx = level.tiles.findIndex((t) => t.type === 'start');
  const endIdx = level.tiles.findIndex((t) => t.type === 'end');
  assert.equal(rotateGear(s, startIdx), false);
  assert.equal(rotateGear(s, endIdx), false);
});

test('подсказки приводят к решению на всех уровнях', () => {
  for (const level of MECH_PUZZLES) {
    const s = createMechPuzzle(level);
    let guard = 60;
    while (!isMechSolved(s) && guard-- > 0) {
      const h = mechHint(s);
      if (h.type === 'already') break;
      assert.equal(h.type, 'rotate', `${level.id}: ${h.type}`);
      rotateGear(s, h.tileIndex);
    }
    assert.ok(isMechSolved(s), `${level.id} должен решаться подсказками`);
  }
});
