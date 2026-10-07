import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SEEK_PUZZLES } from '../src/data/puzzlesSeek.js';
import {
  createSeekPuzzle, seekTap, isSeekSolved, seekProgress, seekHint,
  seekTargets, validateSeekLevel, groupProgress,
} from '../src/core/seekPuzzle.js';

test('все уровни поиска валидны', () => {
  for (const level of SEEK_PUZZLES) {
    const v = validateSeekLevel(level);
    assert.ok(v.ok, `${level.id} (${level.name}): ${v.problems.join('; ')}`);
  }
});

test('в группах есть и одиночные, и множественные цели', () => {
  const multi = SEEK_PUZZLES.flatMap((l) => l.groups.filter((g) => g.spots.length >= 3));
  assert.ok(multi.length >= 4, 'должно быть несколько групп по 3+ экземпляра');
});

test('счётчик группы: «2 из 8»', () => {
  const level = SEEK_PUZZLES.find((l) => l.id === 'sk_tw_01'); // голуби 8
  const s = createSeekPuzzle(level);
  const pigeons = level.groups.find((g) => g.id === 'pigeon');
  assert.equal(pigeons.spots.length, 8);
  const p0 = groupProgress(s, pigeons);
  assert.deepEqual(p0, { found: 0, total: 8 });
  seekTap(s, pigeons.spots[0].x, pigeons.spots[0].y);
  seekTap(s, pigeons.spots[1].x, pigeons.spots[1].y);
  assert.deepEqual(groupProgress(s, pigeons), { found: 2, total: 8 });
  const pr = seekProgress(s);
  assert.equal(pr.groups.find((g) => g.id === 'pigeon').found, 2);
});

test('один и тот же экземпляр дважды не засчитывается', () => {
  const level = SEEK_PUZZLES[0];
  const s = createSeekPuzzle(level);
  const g = level.groups[0];
  assert.equal(seekTap(s, g.spots[0].x, g.spots[0].y).result, 'found');
  assert.equal(seekTap(s, g.spots[0].x, g.spots[0].y).result, 'already');
  assert.equal(groupProgress(s, g).found, 1);
});

test('уровень решается только когда найдены ВСЕ экземпляры', () => {
  const level = SEEK_PUZZLES[0];
  const s = createSeekPuzzle(level);
  // Находим все, кроме одного спота
  const all = level.groups.flatMap((g) => g.spots.map((sp, i) => ({ g, sp, i })));
  for (const { g, sp, i } of all.slice(1)) seekTap(s, sp.x, sp.y);
  assert.equal(isSeekSolved(s), false, 'пока не все — не решено');
  const last = all[0];
  seekTap(s, last.sp.x, last.sp.y);
  assert.ok(isSeekSolved(s));
});

test('подсказка ведёт к полному решению каждого уровня', () => {
  for (const level of SEEK_PUZZLES) {
    const s = createSeekPuzzle(level);
    let guard = 40;
    while (!isSeekSolved(s) && guard-- > 0) {
      const h = seekHint(s);
      if (h.type === 'already') break;
      assert.equal(h.type, 'point');
      const r = seekTap(s, h.x, h.y);
      assert.equal(r.result, 'found', `${level.id}: подсказка ведёт на ненайденный экземпляр`);
    }
    assert.ok(isSeekSolved(s), `${level.id} должен решаться подсказками`);
  }
});
