import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SEEK_PUZZLES } from '../src/data/puzzlesSeek.js';
import {
  createSeekPuzzle, seekTap, isSeekSolved, seekProgress, seekHint,
  seekTargets, validateSeekLevel,
} from '../src/core/seekPuzzle.js';

test('все уровни поиска валидны', () => {
  for (const level of SEEK_PUZZLES) {
    const v = validateSeekLevel(level);
    assert.ok(v.ok, `${level.id} (${level.name}): ${v.problems.join('; ')}`);
  }
});

test('целевые иконки не дублируются в декорациях', () => {
  for (const level of SEEK_PUZZLES) {
    const targetIcons = new Set(seekTargets(level).map((t) => t.icon));
    for (const o of level.scene) {
      if (!o.target) assert.ok(!targetIcons.has(o.icon), `${level.id}: декорация совпадает с целью`);
    }
  }
});

test('сцены достаточно плотные (реалистичная искалка)', () => {
  for (const level of SEEK_PUZZLES) {
    assert.ok(level.scene.length >= 50, `${level.id}: объектов ${level.scene.length} — маловато`);
  }
});

test('тап по цели находит предмет, повторный тап не засчитывается', () => {
  const level = SEEK_PUZZLES[0];
  const s = createSeekPuzzle(level);
  const t = seekTargets(level)[0];
  assert.equal(seekTap(s, t.x, t.y).result, 'found');
  assert.equal(seekTap(s, t.x, t.y).result, 'already');
  assert.equal(seekProgress(s).found, 1);
});

test('тап рядом с целью (в радиусе) тоже работает, вдали — нет', () => {
  const level = SEEK_PUZZLES[0];
  const s = createSeekPuzzle(level);
  const t = seekTargets(level)[0];
  const rr = t.r * (t.scale || 1);
  assert.equal(seekTap(s, t.x + rr * 0.7, t.y).result, 'found');
  const s2 = createSeekPuzzle(level);
  assert.equal(seekTap(s2, t.x + rr * 2 + 40, t.y).result, 'empty');
});

test('промахи считаются, но не наказывают', () => {
  const level = SEEK_PUZZLES[0];
  const s = createSeekPuzzle(level);
  const decoy = level.scene.find((o) => !o.target);
  assert.equal(seekTap(s, decoy.x, decoy.y).result, 'decoy');
  assert.equal(seekTap(s, 5, 5).result, 'empty');
  assert.equal(s.misses, 1);
});

test('уровень решается находкой всех целей, подсказка указывает на ненайденное', () => {
  for (const level of SEEK_PUZZLES) {
    const s = createSeekPuzzle(level);
    let guard = 10;
    while (!isSeekSolved(s) && guard-- > 0) {
      const h = seekHint(s);
      if (h.type === 'already') break;
      assert.equal(h.type, 'point');
      assert.ok(!s.found.has(h.id), `${level.id}: подсказка указывает на найденное`);
      seekTap(s, h.x, h.y);
    }
    assert.ok(isSeekSolved(s), `${level.id} должен решаться`);
  }
});

test('сцена детерминирована (одинаковый id — одинаковая расстановка)', async () => {
  const again = (await import('../src/data/puzzlesSeek.js')).SEEK_PUZZLES;
  const a = SEEK_PUZZLES[0].scene.map((o) => `${o.id}:${o.icon}:${Math.round(o.x)}:${Math.round(o.y)}`).join('|');
  const b = again[0].scene.map((o) => `${o.id}:${o.icon}:${Math.round(o.x)}:${Math.round(o.y)}`).join('|');
  assert.equal(a, b);
});
