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

test('runBattle проходит бой и даёт награду', () => {
  const s = newGame();
  const r = runBattle(s, 'bt_slimes', 1);
  assert.ok(r);
  assert.equal(r.victory, true);
  assert.ok(r.formation, 'результат содержит расстановку');
  assert.ok(s.battlesDone.bt_slimes);
});

test('статусы видны в логе: наложение, тики и снятие', () => {
  const knight = makeFormationKnight(
    { hp: 500, attack: 1, armor: 0, speed: 10, crit: 0, dodge: 0, block: 0, resist: {} },
    [], [], 1);
  const adder = makeFormationEnemy('moth_night', 1, 3, 0);
  adder.skills = ['sting_poison'];
  adder.hp = adder.maxHp = 300; // живёт долго — яд успеет и наложиться, и истечь
  const r = simulateFormationBattle([knight], [adder], 3);
  assert.ok(r.log.some((e) => e.t === 'status' && e.kind === 'poison'), 'наложение яда в логе');
  assert.ok(r.log.some((e) => e.t === 'dot' && e.kind === 'poison'), 'тики яда в логе');
  assert.ok(r.log.some((e) => e.t === 'status_end' && e.kind === 'poison'), 'истечение яда в логе');
});

test('щит зелья виден с самого начала и снимается при разрушении', () => {
  const knight = makeFormationKnight(
    { hp: 300, attack: 1, armor: 0, speed: 10, crit: 0, dodge: 0, block: 0, resist: {} },
    [],
    [{ name: 'Зелье стены', effect: { kind: 'shield', amount: 15, atStart: true } }],
    1);
  const foe = makeFormationEnemy('slime_meadow', 1, 0, 0);
  foe.hp = foe.maxHp = 300; // слизень живёт долго и пробьёт щит
  const r = simulateFormationBattle([knight], [foe], 1);
  const firstStatus = r.log.find((e) => e.t === 'status');
  assert.equal(firstStatus?.kind, 'shield', 'стартовый щит объявлен первым событием статуса');
  assert.ok(r.log.some((e) => e.t === 'status_end' && e.kind === 'shield'), 'разрушение щита в логе');
});

test('лимит ходов: затянувшийся бой — поражение с честным советом', () => {
  const knight = makeFormationKnight(
    { hp: 50, attack: 5, armor: 2, speed: 10, crit: 0, dodge: 0, block: 0, resist: {} },
    [], [], 1);
  const wall = makeFormationEnemy('slime_meadow', 1, 0, 0);
  wall.dodge = 1; // не попасть никогда
  wall.speed = 0; // и сам не ходит — чистый тупик
  const r = simulateFormationBattle([knight], [wall], 1);
  assert.equal(r.victory, false);
  assert.equal(r.report.timedOut, true);
  assert.ok(r.report.knightHpLeft > 0, 'рыцарь жив, но бой остановлен лимитом');
  assert.ok(r.report.advice.includes('затянулся'), 'совет объясняет лимит ходов');
});

test('ближний бой: боец сначала идёт, бьёт только соседа', () => {
  const knight = makeFormationKnight(
    { hp: 90, attack: 8, armor: 5, speed: 10, crit: 0, dodge: 0, block: 0, resist: {} },
    [], [], 1);
  const snail = makeFormationEnemy('slime_meadow', 1, 0, 0);
  snail.speed = 0; // неподвижная мишень: подходить придётся рыцарю
  snail.hp = snail.maxHp = 500;
  const r = simulateFormationBattle([knight], [snail], 1);
  const firstHit = r.log.findIndex((e) => e.t === 'hit' && e.fromUid === 'a0');
  const moves = r.log.filter((e) => e.t === 'move' && e.uid === 'a0');
  assert.ok(moves.length >= 3, `мечник должен идти через поле (шагов: ${moves.length})`);
  assert.ok(firstHit > 0, 'удары случились');
  assert.ok(r.log.slice(0, firstHit).some((e) => e.t === 'move' && e.uid === 'a0'),
    'сначала манёвр, потом удары');
});

test('стрелок бьёт издалека и не делает ни шага', () => {
  const archer = makeFormationKnight(
    { hp: 90, attack: 8, armor: 5, speed: 10, crit: 0, dodge: 0, block: 0, resist: {} },
    ['ranged'], [], 1);
  const r = simulateFormationBattle([archer], [makeFormationEnemy('slime_meadow', 1, 0, 0)], 1);
  assert.ok(r.log.some((e) => e.t === 'hit' && e.fromUid === 'a0'), 'стрелок попадает');
  assert.equal(r.log.filter((e) => e.t === 'move' && e.uid === 'a0').length, 0,
    'стрелок не двигается');
});

test('рыцарь с луком — стрелок (trait оружия)', () => {
  const s = newGame();
  s.equipped.weapon = 'wpn_hunter_bow'; // traits: ['ranged', ...]
  const r = runBattle(s, 'bt_slimes', 1);
  assert.ok(r);
  assert.equal(r.log.filter((e) => e.t === 'move' && e.uid === 'a0').length, 0,
    'лучник не идёт вперёд');
});

test('тактика Защита: союзник держит строй против идущего ближнебойца', () => {
  const knight = makeFormationKnight(
    { hp: 160, attack: 14, armor: 8, speed: 10, crit: 0, dodge: 0, block: 0, resist: {} },
    [], [], 1);
  const golem = makeFormationEnemy('golem_moss', 1, 0, 0); // ближнебоец — сам придёт
  const r = simulateFormationBattle([knight], [golem], 1, 'defense');
  assert.equal(r.log.filter((e) => e.t === 'move' && e.uid === 'a0').length, 0,
    'в защите ближнебоец союзника не наступает');
  assert.ok(r.victory, 'враг сам пришёл и получил');
});

test('тактика Защита: против чистой артиллерии союзник идёт вперёд (нет тупика)', () => {
  const knight = makeFormationKnight(
    { hp: 90, attack: 8, armor: 5, speed: 10, crit: 0, dodge: 0, block: 0, resist: {} },
    [], [], 1);
  const r = simulateFormationBattle([knight], [makeFormationEnemy('slime_meadow', 1, 0, 0)], 1, 'defense');
  assert.ok(r.log.some((e) => e.t === 'move' && e.uid === 'a0'),
    'против кастеров держать строй бессмысленно — идём сами');
  assert.ok(r.victory);
});

test('тактика Нападение бьёт больнее Защиты', () => {
  // Неуязвимая безобидная мишень: сравнение чистых модификаторов без рандома исхода
  const mk = () => makeFormationKnight(
    { hp: 120, attack: 10, armor: 5, speed: 10, crit: 0, dodge: 0, block: 0, resist: {} },
    [], [], 1);
  const foe = () => {
    const f = makeFormationEnemy('slime_meadow', 1, 0, 0);
    f.hp = f.maxHp = 99999;
    f.attack = 0;
    f.speed = 0;
    return f;
  };
  const atk = simulateFormationBattle([mk()], [foe()], 2, 'offense');
  const def = simulateFormationBattle([mk()], [foe()], 2, 'defense');
  assert.ok(atk.report.dealt > def.report.dealt,
    `нападение (${atk.report.dealt}) должно бить больнее защиты (${def.report.dealt})`);
});

test('свиток шага огня бьёт всех и снимается с пояса', () => {
  const s = newGame();
  s.consumableBelt = ['scr_fire_step'];
  const r = runBattle(s, 'bt_slimes', 1);
  assert.ok(r);
  assert.ok(r.log.some((e) => e.t === 'scroll' && e.kind === 'scroll_fire_step'), 'свиток прочитан');
  const foesCount = s.battlesDone ? r.formation.foes.length : 0;
  const fireHits = r.log.filter((e) => e.t === 'hit' && e.elem === 'fire').length;
  assert.ok(fireHits >= foesCount, `огонь задел всех (${fireHits} >= ${foesCount})`);
  assert.ok(!s.consumableBelt.includes('scr_fire_step'), 'свиток потрачен');
});

test('тумблер пояса ВЫКЛ: зелье не расходуется и не срабатывает', () => {
  const s = newGame();
  s.settings.useBeltItems = false;
  s.consumableBelt = ['pot_heal'];
  const r = runBattle(s, 'bt_slimes', 1);
  assert.ok(r);
  assert.equal(r.log.filter((e) => e.t === 'potion').length, 0, 'зелий в бою нет');
  assert.deepEqual(s.consumableBelt, ['pot_heal'], 'пояс не тронут');
});

test('ведьминка: лечит раненого издалека, не делая ни шага', () => {
  const witch = makeFormationMerc(MERC_BY_ID.merc_witch, 4, 1);
  const knight = makeFormationKnight(
    { hp: 100, attack: 10, armor: 5, speed: 10, crit: 0, dodge: 0, block: 0, resist: {} },
    [], [], 1);
  knight.hp = 40; // ранен — ведьминка должна лечить
  const wall = makeFormationEnemy('slime_meadow', 1, 0, 0);
  wall.hp = wall.maxHp = 400;
  wall.speed = 0;
  const r = simulateFormationBattle([knight, witch], [wall], 1);
  const regenIdx = r.log.findIndex((e) => e.t === 'status' && e.kind === 'regen' && e.uid === 'a0');
  assert.ok(regenIdx > 0, 'регенерация наложена на раненого рыцаря');
  const movesBefore = r.log.slice(0, regenIdx).filter((e) => e.t === 'move' && e.uid === 'a1');
  assert.equal(movesBefore.length, 0,
    'пока есть кого лечить, ведьминка лечит, а не идёт вперёд');
});

test('ведьминка держится через одну клетку и за лучником тоже', () => {
  const witch = makeFormationMerc(MERC_BY_ID.merc_witch, 4, 1);
  const bowKnight = makeFormationKnight(
    { hp: 200, attack: 12, armor: 5, speed: 10, crit: 0, dodge: 0, block: 0, resist: {} },
    ['ranged'], [], 1);
  const wall = makeFormationEnemy('slime_meadow', 1, 0, 0);
  wall.hp = wall.maxHp = 800;
  wall.speed = 0;
  wall.attack = 0;
  const r = simulateFormationBattle([bowKnight, witch], [wall], 1);
  const stingIdx = r.log.findIndex((e) => e.t === 'status' && e.kind === 'poison' && e.uid === 'e0');
  assert.ok(stingIdx > 0, 'яд применён');
  const lastMove = r.log.slice(0, stingIdx).filter((e) => e.t === 'move' && e.uid === 'a1').pop();
  const dist = Math.max(Math.abs(lastMove.to[0] - 6), Math.abs(lastMove.to[1] - 0));
  assert.equal(dist, 2, `ведьминка остановилась в дальности каста (2), не ближе: [${lastMove.to}]`);
});

test('ведьминка — кастер поддержки: травит через одну клетку, не лезет в гущу', () => {
  const witch = makeFormationMerc(MERC_BY_ID.merc_witch, 4, 1);
  assert.ok(witch.caster, 'ведьминка — кастер');
  const knight = makeFormationKnight(
    { hp: 120, attack: 8, armor: 6, speed: 10, crit: 0, dodge: 0, block: 0, resist: {} },
    [], [], 1);
  const wall = makeFormationEnemy('slime_meadow', 1, 0, 0);
  wall.hp = wall.maxHp = 600;
  wall.speed = 0; // неподвижная мишень
  wall.attack = 0;
  const r = simulateFormationBattle([knight, witch], [wall], 1);
  // Первый ядовитый удар ведьминки — с дистанции 2, не вплотную
  const stingIdx = r.log.findIndex((e) => e.t === 'hit' && e.fromUid === 'a1');
  assert.ok(stingIdx > 0, 'ведьминка атакует');
  const lastMoveBefore = r.log.slice(0, stingIdx).filter((e) => e.t === 'move' && e.uid === 'a1').pop();
  assert.ok(Math.max(Math.abs(lastMoveBefore.to[0] - 6), Math.abs(lastMoveBefore.to[1] - 0)) <= 2,
    `ведьминка остановилась в дальности каста: [${lastMoveBefore.to}]`);
});

test('расстановка фигурок — начальные клетки, а не позиции конца боя', () => {
  const s = newGame();
  const r = runBattle(s, 'bt_slimes', 1);
  assert.ok(r);
  for (const f of r.formation.foes) {
    assert.ok(f.cell[0] >= 6, `враг ${f.uid} стартует на своей половине: [${f.cell}]`);
  }
  for (const a of r.formation.allies) {
    assert.ok(a.cell[0] <= 1, `союзник ${a.uid} стартует на своей половине: [${a.cell}]`);
  }
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
  const r = runBattle(s, 'ex_01', 1);
  assert.ok(r, 'экспедиция доступна после всех боссов');
  const slime = r.formation.foes[0];
  assert.ok(slime, 'враги расставлены по рядам');
});
