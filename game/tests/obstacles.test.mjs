import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  makeFormationKnight, makeFormationMerc, simulateFormationBattle,
} from '../src/core/formBattle.js';
import { BATTLES, OBSTACLE_KINDS } from '../src/data/battles.js';
import { MERC_BY_ID } from '../src/data/crew.js';

const KSTATS = { hp: 200, attack: 30, armor: 10, speed: 12, crit: 0.05, dodge: 0.03, block: 0, resist: {} };

test('данные препятствий валидны: 1–2 шт, нейтральная полоса, известный вид', () => {
  const withObstacles = BATTLES.filter((b) => b.obstacles);
  assert.ok(withObstacles.length > 0, 'хотя бы несколько боёв с препятствиями');
  for (const b of withObstacles) {
    assert.ok(b.obstacles.length >= 1 && b.obstacles.length <= 2,
      `${b.id}: препятствий 1–2, а не ${b.obstacles.length}`);
    const seen = new Set();
    for (const o of b.obstacles) {
      const [c, r] = o.cell;
      assert.ok(c >= 2 && c <= 5 && r >= 0 && r <= 2,
        `${b.id}: клетка [${c},${r}] вне нейтральной полосы (колонки 2–5)`);
      assert.ok(!seen.has(o.cell.join(',')), `${b.id}: дубль клетки ${o.cell}`);
      seen.add(o.cell.join(','));
      assert.ok(OBSTACLE_KINDS[o.kind], `${b.id}: неизвестный вид препятствия ${o.kind}`);
    }
  }
});

test('препятствие блокирует клетку: никто не встаёт на неё', () => {
  const obstacles = [{ cell: [3, 1], kind: 'rock' }];
  const r = simulateFormationBattle(
    [makeFormationKnight({ ...KSTATS }, [], [], 1)],
    [{ uid: 'e0', side: 'enemy', name: 'Голем', icon: '🗿', slot: 1, cell: [6, 1], hp: 150, maxHp: 150, attack: 5, armor: 5, speed: 8, crit: 0, dodge: 0, block: 0, elem: 'phys', skills: [], tags: [], traits: [], resist: {}, potions: [], statuses: [], gauge: 0, stats: { dealt: 0, taken: 0 } }],
    11, 'balance', obstacles,
  );
  const bad = r.log.filter((e) => e.t === 'move' && e.to.join(',') === '3,1');
  assert.equal(bad.length, 0, 'никто не шагает на препятствие');
});

test('боец обходит препятствие и добивается победы', () => {
  // Стена из двух камней по центру — обход только с флангов
  const obstacles = [{ cell: [3, 1], kind: 'rock' }, { cell: [4, 1], kind: 'rock' }];
  const foe = {
    uid: 'e0', side: 'enemy', name: 'Слизень', icon: '🟢', slot: 1, cell: [6, 1],
    hp: 40, maxHp: 40, attack: 2, armor: 0, speed: 6, crit: 0, dodge: 0, block: 0,
    elem: 'phys', skills: [], tags: [], traits: [], resist: {}, potions: [], statuses: [],
    gauge: 0, stats: { dealt: 0, taken: 0 },
  };
  const r = simulateFormationBattle(
    [makeFormationKnight({ ...KSTATS }, [], [], 1)], [foe], 5, 'balance', obstacles,
  );
  assert.ok(r.victory, 'рыцарь обходит стену и добивает слизня');
  assert.ok(!r.report.timedOut, 'бой не должен уходить в тупик из-за препятствий');
});

test('стрелок бьёт поверх препятствий и не двигается', () => {
  const obstacles = [{ cell: [3, 0], kind: 'rock' }, { cell: [3, 1], kind: 'rock' }];
  const archer = makeFormationMerc(MERC_BY_ID.merc_archer, 4, 1);
  const foe = {
    uid: 'e0', side: 'enemy', name: 'Голем', icon: '🗿', slot: 1, cell: [6, 1],
    hp: 60, maxHp: 60, attack: 3, armor: 5, speed: 5, crit: 0, dodge: 0, block: 0,
    elem: 'phys', skills: [], tags: [], traits: [], resist: {}, potions: [], statuses: [],
    gauge: 0, stats: { dealt: 0, taken: 0 },
  };
  const r = simulateFormationBattle([archer], [foe], 3, 'balance', obstacles);
  const archerHits = r.log.filter((e) => e.t === 'hit' && e.fromUid === 'a1');
  assert.ok(archerHits.length > 0, 'лучница стреляет поверх камней');
  const archerMoves = r.log.filter((e) => e.t === 'move' && e.uid === 'a1');
  assert.equal(archerMoves.length, 0, 'лучнице не нужно идти в обход');
});

test('бой с препятствиями детерминирован по seed', () => {
  const obstacles = [{ cell: [3, 1], kind: 'rock' }];
  const mk = () => simulateFormationBattle(
    [makeFormationKnight({ ...KSTATS }, [], [], 1)],
    [{
      uid: 'e0', side: 'enemy', name: 'Крыса', icon: '🐀', slot: 1, cell: [6, 1],
      hp: 80, maxHp: 80, attack: 6, armor: 2, speed: 11, crit: 0, dodge: 0.1, block: 0,
      elem: 'phys', skills: [], tags: [], traits: [], resist: {}, potions: [], statuses: [],
      gauge: 0, stats: { dealt: 0, taken: 0 },
    }],
    42, 'balance', obstacles,
  );
  assert.deepEqual(mk().report, mk().report);
});
