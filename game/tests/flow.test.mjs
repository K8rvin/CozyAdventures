import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FLOW_PUZZLES } from '../src/data/puzzlesFlow.js';
import {
  createFlowPuzzle, rotateFlowTile, undoFlow, resetFlow,
  isFlowSolved, simulateFlows, flowHint, validateFlowLevel, solveFlow,
} from '../src/core/flowPuzzle.js';

const byId = (id) => FLOW_PUZZLES.find((l) => l.id === id);
const tileAt = (level, x, y) => level.tiles.findIndex((t) => t.pos[0] === x && t.pos[1] === y);

test('все уровни «Потоков» валидны и решаемы', () => {
  assert.equal(FLOW_PUZZLES.length, 8);
  for (const level of FLOW_PUZZLES) {
    const v = validateFlowLevel(level);
    assert.ok(v.ok, `${level.id} (${level.name}): ${v.problems.join('; ')}`);
  }
});

test('flow_01: решение решателя применяется к состоянию', () => {
  const level = byId('flow_01');
  const s = createFlowPuzzle(level);
  assert.equal(isFlowSolved(s), false);
  const { count, solutions, rotatable } = solveFlow(level);
  assert.ok(count > 0, 'решение должно существовать');
  rotatable.forEach((idx, k) => { s.rot[idx] = solutions[0][k]; });
  assert.ok(isFlowSolved(s));
  const sim = simulateFlows(s);
  assert.equal(sim.buyers.length, 2);
  assert.ok(sim.buyers.every((b) => b.arrived));
});

test('коллизии ловятся: общие клетки помечаются, победа не засчитывается', () => {
  const level = byId('flow_01');
  const s = createFlowPuzzle(level);
  // Лисёнок сворачивает вниз, в ряд лягушонка; лягушонок идёт своим решённым путём
  s.rot[tileAt(level, 1, 1)] = 2;
  s.rot[tileAt(level, 2, 1)] = 1;
  s.rot[tileAt(level, 1, 2)] = 1;
  s.rot[tileAt(level, 2, 2)] = 1;
  const sim = simulateFlows(s);
  assert.equal(sim.solved, false);
  assert.ok(sim.collisions.size >= 1, 'должна быть толкотня');
  assert.ok(sim.collisions.has('1,2'), 'клетка 1,2 общая для двух путей');
  assert.equal(sim.buyers[0].arrived, false);
  assert.equal(sim.buyers[0].reason, 'foreign'); // чужой лоток не пустил
  assert.equal(sim.buyers[1].arrived, true);
  assert.equal(isFlowSolved(s), false);
});

test('защита от циклов: покупатель не кружит вечно', () => {
  const level = {
    id: 'flow_test_loop', grid: [3, 3],
    tiles: [
      { type: 'start', pos: [0, 1], rot: 1, color: 0, fixed: true },
      { type: 'arrow', pos: [1, 1], rot: 1 },
      { type: 'arrow', pos: [2, 1], rot: 0 },
      { type: 'arrow', pos: [2, 0], rot: 3 },
      { type: 'arrow', pos: [1, 0], rot: 2 },
      { type: 'stall', pos: [0, 2], color: 0 },
    ],
  };
  const s = createFlowPuzzle(level);
  const sim = simulateFlows(s);
  assert.equal(sim.buyers[0].arrived, false);
  assert.equal(sim.buyers[0].reason, 'loop');
  assert.ok(sim.buyers[0].path.length <= 3 * 3 * 4, 'путь ограничен');
  assert.equal(sim.solved, false);
});

test('стена останавливает покупателя', () => {
  const level = byId('flow_03');
  const s = createFlowPuzzle(level);
  // Лисёнок: вправо, вниз, вправо — упирается в ящики на (3,1)
  s.rot[tileAt(level, 1, 0)] = 1;
  s.rot[tileAt(level, 2, 0)] = 2;
  s.rot[tileAt(level, 2, 1)] = 1;
  const sim = simulateFlows(s);
  assert.equal(sim.buyers[0].arrived, false);
  assert.equal(sim.buyers[0].reason, 'wall');
});

test('поворот и отмена/сброс', () => {
  const level = byId('flow_02');
  const s = createFlowPuzzle(level);
  const idx = tileAt(level, 1, 0);
  const before = s.rot[idx];
  rotateFlowTile(s, idx);
  assert.notEqual(s.rot[idx], before);
  undoFlow(s);
  assert.equal(s.rot[idx], before);
  rotateFlowTile(s, idx);
  resetFlow(s);
  assert.equal(s.rot[idx], before);
});

test('фиксированные плитки и не-стрелки не поворачиваются', () => {
  const level = byId('flow_01');
  const s = createFlowPuzzle(level);
  const startIdx = level.tiles.findIndex((t) => t.type === 'start');
  const stallIdx = level.tiles.findIndex((t) => t.type === 'stall');
  assert.equal(rotateFlowTile(s, startIdx), false);
  assert.equal(rotateFlowTile(s, stallIdx), false);
});

test('подсказки приводят к решению на всех уровнях', () => {
  for (const level of FLOW_PUZZLES) {
    const s = createFlowPuzzle(level);
    let guard = 100;
    while (!isFlowSolved(s) && guard-- > 0) {
      const h = flowHint(s);
      if (h.type === 'already') break;
      assert.equal(h.type, 'rotate', `${level.id}: ${h.type}`);
      rotateFlowTile(s, h.tileIndex);
    }
    assert.ok(isFlowSolved(s), `${level.id} должен решаться подсказками`);
  }
});
