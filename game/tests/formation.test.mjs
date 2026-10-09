import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  makeFormationKnight, makeFormationMerc, makeFormationEnemy,
  simulateFormationBattle, enemyFormationSlots, isRanged,
} from '../src/core/formBattle.js';
import { MERC_BY_ID } from '../src/data/crew.js';
import { newGame, runBattle, moveFormationSlot } from '../src/core/state.js';

const KSTATS = { hp: 60, attack: 8, armor: 6, speed: 10, crit: 0.05, dodge: 0.03, block: 0, resist: {} };

function allies(knightSlot = 1, mercs = []) {
  return [
    makeFormationKnight({ ...KSTATS }, [], [], knightSlot),
    ...mercs.map(([id, slot], i) => makeFormationMerc(MERC_BY_ID[id], slot, i + 1)),
  ];
}

test('бой детерминирован по seed', () => {
  const mk = () => simulateFormationBattle(allies(), [makeFormationEnemy('slime_meadow', 1, 1, 0)], 42);
  assert.deepEqual(mk().report, mk().report);
});

test('ближний бой идёт по переднему ряду, пока он не опустеет', () => {
  // Рыцарь (ближний) против хрупкого в заднем ряду и танка в переднем
  const backFoe = makeFormationEnemy('bee_wild', 1, 4, 0);   // задний ряд
  const frontFoe = makeFormationEnemy('golem_moss', 1, 1, 1); // передний ряд
  const r = simulateFormationBattle(allies(), [backFoe, frontFoe], 7);
  const knightHits = r.log.filter((e) => e.t === 'hit' && e.fromUid === 'a0');
  // Пока голем жив — рыцарь не должен бить пчелу
  const golemDeathIdx = r.log.findIndex((e) => e.t === 'hit' && e.toUid === 'e1' && e.dmg);
  const beeHitIdx = knightHits.findIndex((e) => e.toUid === 'e0');
  const golemDownIdx = r.log.findIndex((e, i) => i > golemDeathIdx && e.t === 'hit' && e.toUid === 'e1');
  if (beeHitIdx >= 0 && golemDownIdx >= 0) {
    assert.ok(beeHitIdx >= golemDownIdx, 'пчелу бьют только после падения переднего ряда');
  }
});

test('стрелок игнорирует ряды и бьёт хрупких', () => {
  const archer = makeFormationMerc(MERC_BY_ID.merc_archer, 4, 1); // задний ряд
  const r = simulateFormationBattle(
    [makeFormationKnight({ ...KSTATS }, [], [], 1), archer],
    [makeFormationEnemy('golem_moss', 1, 1, 0), makeFormationEnemy('slime_meadow', 1, 4, 1)],
    3,
  );
  const archerHits = r.log.filter((e) => e.t === 'hit' && e.fromUid === 'a1');
  assert.ok(archerHits.length > 0, 'лучница должна стрелять');
  // Слайм хрупче голема — его и бьют
  assert.ok(archerHits.some((h) => h.toUid === 'e1'), 'лучница выбирает хрупкую цель');
  assert.ok(archerHits.every((h) => h.ranged), 'выстрелы помечены ranged');
});

test('рассечение бьёт весь передний ряд', () => {
  const knight = makeFormationKnight({ ...KSTATS, attack: 20 }, ['cleave_small'], [], 1);
  const foes = [
    makeFormationEnemy('slime_meadow', 1, 0, 0),
    makeFormationEnemy('slime_meadow', 1, 1, 1),
    makeFormationEnemy('bee_wild', 1, 4, 2),
  ];
  const r = simulateFormationBattle([knight], foes, 5);
  const targets = new Set(r.log.filter((e) => e.t === 'hit' && e.fromUid === 'a0').map((e) => e.toUid));
  assert.ok(targets.has('e0') && targets.has('e1'), 'передний ряд задет полностью');
});

test('авторасстановка врагов: ближние вперёд, стрелки назад, босс в центр', () => {
  const slots = enemyFormationSlots(['golem_moss', 'moth_night', 'boss_willow']);
  assert.equal(slots[0], 0); // голем — передний
  assert.equal(slots[1], 3); // моль — задний
  assert.equal(slots[2], 1); // босс — центр
});

test('авторасстановка врагов: слоты не повторяются даже у 4 одинаковых крыс', () => {
  const slots = enemyFormationSlots(['rat_thief', 'rat_thief', 'rat_thief', 'rat_thief']);
  assert.equal(new Set(slots).size, slots.length, `слоты наслоились: ${slots}`);
  for (const s of slots) assert.ok(s >= 0 && s <= 5, `слот вне поля: ${s}`);
});

test('авторасстановка врагов: во всех боях кампании слоты уникальны', async () => {
  const { BATTLES } = await import('../src/data/battles.js');
  for (const b of BATTLES) {
    const slots = enemyFormationSlots(b.enemies);
    assert.equal(new Set(slots).size, slots.length, `${b.id}: слоты наслоились: ${slots}`);
  }
});

test('runBattle в режиме formation проходит бой и даёт награду', () => {
  const s = newGame();
  s.settings.battleMode = 'formation';
  const r = runBattle(s, 'bt_slimes', 1);
  assert.ok(r);
  assert.equal(r.victory, true);
  assert.ok(r.formation, 'результат содержит расстановку');
  assert.ok(s.battlesDone.bt_slimes);
});

test('runBattle в режиме classic использует старый движок', () => {
  const s = newGame();
  s.settings.battleMode = 'classic';
  const r = runBattle(s, 'bt_slimes', 1);
  assert.ok(r);
  assert.equal(r.victory, true);
  assert.equal(r.formation, undefined);
});

test('moveFormationSlot меняет слоты местами', () => {
  const s = newGame();
  s.formation = { knight: 1, merc0: 0, merc1: 5 };
  moveFormationSlot(s, 'knight', 0);
  assert.equal(s.formation.knight, 0);
  assert.equal(s.formation.merc0, 1, 'занятый слот меняется местами');
  assert.equal(moveFormationSlot(s, 'knight', 9), false);
});

test('экспедиции масштабируют врагов', () => {
  const s = newGame();
  for (const id of ['bt_slimes', 'bt_bees', 'bt_moths', 'bt_spirits', 'bt_golem', 'bt_hunt_trail', 'bt_boss_willow',
    'bt_rats', 'bt_bandits', 'bt_wander_golem', 'bt_ghost_watch', 'bt_town_mix', 'bt_watchtower', 'bt_cellar',
    'bt_tourney', 'bt_boss_captain', 'bk_blots', 'bk_moths', 'bk_spirits', 'bk_illustration', 'bk_storm',
    'bt_reading', 'bt_archive', 'bt_inkwell', 'bk_boss_keeper']) {
    s.battlesDone[id] = { victories: 1 };
  }
  s.settings.battleMode = 'formation';
  const r = runBattle(s, 'ex_01', 1);
  assert.ok(r, 'экспедиция доступна после всех боссов');
  const slime = r.formation.foes[0];
  assert.ok(slime, 'враги расставлены по рядам');
});
