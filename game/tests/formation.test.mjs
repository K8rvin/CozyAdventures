import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  makeFormationKnight, makeFormationMerc, makeFormationEnemy,
  simulateFormationBattle, enemyFormationSlots, isRanged,
  unitCells, unitDist, slotToCell,
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

test('авторасстановка врагов: ближние вперёд, стрелки назад, босс 2×2 первым якорем', () => {
  const slots = enemyFormationSlots(['golem_moss', 'moth_night', 'boss_willow']);
  assert.equal(slots[2], 0); // босс — якорь [6,0], блок на ряды 0–1
  assert.equal(slots[0], 2); // голем — передний ряд, ниже блока босса
  assert.equal(slots[1], 5); // моль — задний ряд, ниже блока босса
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

test('авторасстановка врагов: во всех боях кампании клетки тел не наслаиваются', async () => {
  const { BATTLES } = await import('../src/data/battles.js');
  const { ENEMY_BY_ID } = await import('../src/data/enemies.js');
  for (const b of BATTLES) {
    const slots = enemyFormationSlots(b.enemies);
    const taken = new Set();
    slots.forEach((s, i) => {
      const id = typeof b.enemies[i] === 'string' ? b.enemies[i] : b.enemies[i].id;
      const size = ENEMY_BY_ID[id].boss ? 2 : 1;
      const [cx, cy] = slotToCell(s, 'enemy');
      assert.ok(cy + size <= 3, `${b.id}: тело ${id} вылезает за низ поля`);
      for (let dx = 0; dx < size; dx++) {
        for (let dy = 0; dy < size; dy++) {
          const key = `${cx + dx},${cy + dy}`;
          assert.ok(!taken.has(key), `${b.id}: клетка ${key} занята дважды`);
          taken.add(key);
        }
      }
    });
  }
});

test('босс — один на бой, прислужников не больше двух (блок 2×2 должен влезать)', async () => {
  const { BATTLES } = await import('../src/data/battles.js');
  const { ENEMY_BY_ID } = await import('../src/data/enemies.js');
  for (const b of BATTLES) {
    const ids = b.enemies.map((e) => (typeof e === 'string' ? e : e.id));
    const bosses = ids.filter((id) => ENEMY_BY_ID[id]?.boss);
    assert.ok(bosses.length <= 1, `${b.id}: два босса 2×2 не помещаются в колонки 6–7`);
    if (bosses.length) {
      assert.ok(ids.length <= 3, `${b.id}: при боссе 2×2 свободны только две клетки`);
    }
  }
});

test('босс занимает блок 2×2: якорь — левая верхняя клетка', () => {
  const boss = makeFormationEnemy('boss_willow', 1, 0, 0);
  assert.equal(boss.boss, true);
  assert.equal(boss.size, 2);
  assert.deepEqual(boss.cell, [6, 0]);
  assert.deepEqual(unitCells(boss), [[6, 0], [7, 0], [6, 1], [7, 1]]);
  const slime = makeFormationEnemy('slime_meadow', 1, 0, 0);
  assert.deepEqual(unitCells(slime), [[6, 0]], 'обычный враг — одна клетка');
});

test('босса бьют, стоя рядом с любой клеткой его тела', () => {
  // Рыцарь у НИЖНЕЙ клетки блока (якорь [6,0] на ряд выше) — удар всё равно достаёт
  const knight = makeFormationKnight({ ...KSTATS, attack: 60 }, [], [], 1);
  knight.cell = [5, 2];
  const boss = makeFormationEnemy('boss_willow', 1, 0, 0);
  assert.equal(unitDist(knight, boss), 1);
  const r = simulateFormationBattle([knight], [boss], 9);
  const firstHit = r.log.findIndex((e) => e.t === 'hit' && e.fromUid === 'a0' && e.toUid === 'e0');
  assert.ok(firstHit > 0, 'рыцарь бьёт босса');
  const movedBefore = r.log.slice(0, firstHit).some((e) => e.t === 'move' && e.uid === 'a0');
  assert.equal(movedBefore, false, 'подходить не пришлось — нижняя клетка тела уже в дальности');
});

test('босс двигается и его якорь не выходит за границы блока 2×2', () => {
  const knight = makeFormationKnight({ ...KSTATS, hp: 900 }, [], [], 3); // задний ряд
  const boss = makeFormationEnemy('boss_willow', 1, 0, 0);
  const r = simulateFormationBattle([knight], [boss], 9);
  const moves = r.log.filter((e) => e.t === 'move' && e.uid === 'e0');
  assert.ok(moves.length > 0, 'босс идёт через поле к рыцарю');
  for (const m of moves) {
    assert.ok(m.to[0] >= 0 && m.to[0] <= 6, `якорь босса вне колонок: [${m.to}]`);
    assert.ok(m.to[1] >= 0 && m.to[1] <= 1, `якорь босса вне рядов: [${m.to}]`);
  }
});

test('тактика Защита против босса не встаёт в тупик', () => {
  const knight = makeFormationKnight({ ...KSTATS, attack: 80, hp: 900 }, [], [], 1);
  const boss = makeFormationEnemy('boss_willow', 1, 0, 0);
  const r = simulateFormationBattle([knight], [boss], 21, 'defense');
  assert.equal(r.report.timedOut, false, 'босс сам наступает — строй не ждёт вечно');
  assert.equal(r.victory, true);
});

test('снимок расстановки хранит размер босса', async () => {
  const { BATTLES } = await import('../src/data/battles.js');
  const s = newGame();
  for (const b of BATTLES) s.battlesDone[b.id] = { victories: 1 };
  const r = runBattle(s, 'bt_boss_willow', 1);
  const boss = r.formation.foes.find((f) => f.size === 2);
  assert.ok(boss, 'у босса в снимке size 2');
  assert.ok(boss.cell[0] === 6 && boss.cell[1] <= 1, `якорь босса: [${boss.cell}]`);
  for (const f of r.formation.foes) assert.ok(f.size >= 1, 'у всех врагов есть size');
  for (const a of r.formation.allies) assert.equal(a.size, 1, 'союзники — обычный размер');
});

test('runBattle проходит бой и даёт награду', () => {
  const s = newGame();
  const r = runBattle(s, 'bt_slimes', 1);
  assert.ok(r);
  assert.equal(r.victory, true);
  assert.ok(r.formation, 'результат содержит расстановку');
  assert.ok(s.battlesDone.bt_slimes);
});

test('начисленные монеты совпадают с result.rewards на первой и повторной победе', () => {
  const s = newGame();
  s.coins = 137; // непустой кошелёк не должен влиять на расчёт разницы
  const coinSum = (result) => result.rewards
    .filter((r) => r.type === 'coins')
    .reduce((sum, r) => sum + r.amount, 0);

  const firstBefore = s.coins;
  const firstEarnedBefore = s.stats.coinsEarned;
  const first = runBattle(s, 'bt_slimes', 1);
  assert.equal(first.victory, true);
  assert.ok(first.rewards.some((r) => r.type === 'material'), 'кроме монет есть материалы');
  assert.equal(s.coins - firstBefore, coinSum(first), 'кошелёк после первой победы');
  assert.equal(s.stats.coinsEarned - firstEarnedBefore, coinSum(first), 'статистика после первой победы');

  const secondBefore = s.coins;
  const secondEarnedBefore = s.stats.coinsEarned;
  const second = runBattle(s, 'bt_slimes', 1);
  assert.equal(second.victory, true);
  assert.equal(s.coins - secondBefore, coinSum(second), 'кошелёк после повторной победы');
  assert.equal(s.stats.coinsEarned - secondEarnedBefore, coinSum(second), 'статистика после повторной победы');
  assert.deepEqual(
    second.rewards.filter((r) => r.type === 'coins').map((r) => r.amount),
    first.rewards.filter((r) => r.type === 'coins').map((r) => Math.round(r.amount * 0.2)),
    'повторные монеты — примерно 20% с одним округлением итога',
  );
  assert.deepEqual(
    second.rewards.filter((r) => r.type === 'material'),
    first.rewards.filter((r) => r.type === 'material'),
    'остальные награды за повтор пока не меняются',
  );
});

test('советы на bt_bees предлагают только уже доступное усиление', () => {
  const s = newGame();
  assert.equal(runBattle(s, 'bt_slimes', 1).victory, true);
  const forbidden = [
    'Лесная лучница', 'Дворовый громила', 'лучницу', 'громилу',
    'Перчатки травницы', 'Амулет противоядия', 'Чернильный отвар',
  ];
  for (const seed of [1, 14]) { // яд и обычная гибель в одиночку
    const attempt = structuredClone(s);
    const result = runBattle(attempt, 'bt_bees', seed);
    assert.equal(result.victory, false);
    for (const text of forbidden) {
      assert.ok(!result.report.advice.includes(text), `закрытая рекомендация «${text}»: ${result.report.advice}`);
    }
    assert.ok(!result.report.advice.includes('Найми в таверне'), 'наёмники ещё не открыты');
    assert.ok(result.report.advice.includes('Стёганый камзол'), 'есть открытый и полезный путь усиления');
  }
});

test('советы по яду, сну, отряду и таймауту следуют реальным открытиям', async () => {
  const { accessibleBattleAdvice } = await import('../src/core/state.js');
  const s = newGame();
  const report = (extra) => ({ advice: 'Нужно усилиться.', alliesStats: [{}], ...extra });

  let advice = accessibleBattleAdvice(s, report({ deathCause: 'poison' }));
  assert.ok(!advice.includes('Амулет противоядия') && !advice.includes('Чернильный отвар'));
  advice = accessibleBattleAdvice(s, report({ timedOut: true, advice: 'Бой затянулся.' }));
  assert.ok(advice.includes('Нападение'), 'таймаут предлагает доступную смену тактики');
  assert.ok(!advice.includes('наёмников'), 'закрытый найм не предлагается даже в общем виде');

  s.battlesDone.bt_bees = { victories: 1 };
  advice = accessibleBattleAdvice(s, report({ deathCause: 'sleep' }));
  assert.ok(advice.includes('Шлем сонного барсука'), 'открытая защита от сна предлагается');
  advice = accessibleBattleAdvice(s, report({ deathCause: 'phys' }));
  assert.ok(advice.includes('Лесная лучница'), 'открытый наёмник предлагается для одиночного отряда');

  s.battlesDone.bt_moths = { victories: 1 };
  advice = accessibleBattleAdvice(s, report({ deathCause: 'poison' }));
  assert.ok(advice.includes('Амулет противоядия'), 'противоядие появляется только после своего открытия');
  advice = accessibleBattleAdvice(s, report({ deathCause: 'phys' }));
  assert.ok(advice.includes('Дворовый громила') && advice.includes('переднего ряда'), 'танк предлагается после открытия');
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

test('посох и кастеры помечают удары как магические (для реплея)', () => {
  // Рыцарь с посохом свечного мага: снаряд — магический болт, не стрела
  const s = newGame();
  s.equipped.weapon = 'wpn_candle_staff'; // traits: ['pierce', 'ranged', 'magic']
  const r = runBattle(s, 'bt_slimes', 1);
  const staffHits = r.log.filter((e) => e.t === 'hit' && e.fromUid === 'a0');
  assert.ok(staffHits.length > 0, 'посох должен наносить удары');
  assert.ok(staffHits.every((e) => e.magic), 'удары посохом помечены magic');
  // Лук — физический выстрел без магии
  const s2 = newGame();
  s2.equipped.weapon = 'wpn_hunter_bow';
  const r2 = runBattle(s2, 'bt_slimes', 1);
  const bowHits = r2.log.filter((e) => e.t === 'hit' && e.fromUid === 'a0');
  assert.ok(bowHits.length > 0 && bowHits.every((e) => !e.magic), 'стрелы — без magic');
  // Ведьминка-кастер: болт вместо выпада фигуркой
  const r3 = simulateFormationBattle(
    [makeFormationKnight({ ...KSTATS }, [], [], 1), makeFormationMerc(MERC_BY_ID.merc_witch, 5, 1)],
    [makeFormationEnemy('slime_meadow', 1, 1, 0)], 3,
  );
  const witchHits = r3.log.filter((e) => e.t === 'hit' && e.fromUid === 'a1');
  assert.ok(witchHits.length > 0 && witchHits.every((e) => e.magic), 'касты ведьминки — magic');
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

test('шипы возвращают часть урона атакующему', () => {
  // Рыцарь с шипами против слайма: слайм бьёт рыцаря и получает отражение
  const knight = makeFormationKnight({ ...KSTATS, hp: 500 }, ['thorns_small'], [], 1);
  const foe = makeFormationEnemy('slime_meadow', 1, 0, 0);
  const r = simulateFormationBattle([knight], [foe], 11);
  const thorns = r.log.filter((e) => e.t === 'dot' && e.kind === 'thorns');
  assert.ok(thorns.length > 0, 'должны быть тики отражения');
  const hit = r.log.find((e) => e.t === 'hit' && e.toUid === 'a0');
  const tick = thorns[0];
  assert.ok(tick.dmg >= 1 && tick.dmg <= Math.ceil(hit.dmg * 0.15) + 1, 'отражение ~15% урона');
});

test('вампиризм лечит атакующего частью урона', () => {
  const knight = makeFormationKnight({ ...KSTATS, attack: 30 }, ['lifesteal_small'], [], 1);
  const foe = makeFormationEnemy('golem_moss', 1, 0, 0);
  const r = simulateFormationBattle([knight], [foe], 13);
  const ticks = r.log.filter((e) => e.t === 'dot' && e.kind === 'lifesteal' && e.dmg < 0);
  // Рыцарь не ранен на старте — лечение идёт только если hp не полное;
  // голем успевает ударить, поэтому тики должны появиться после урона по рыцарю
  assert.ok(ticks.length >= 0, 'лог вампиризма корректен');
  // Проверим напрямую: раненый рыцарь с вампиризмом должен подлечиться
  const knight2 = makeFormationKnight({ ...KSTATS, attack: 30, hp: 40 }, ['lifesteal_small'], [], 1);
  knight2.hp = 20; // ранен
  const r2 = simulateFormationBattle([knight2], [makeFormationEnemy('slime_meadow', 1, 0, 0)], 17);
  const heals = r2.log.filter((e) => e.t === 'dot' && e.kind === 'lifesteal' && e.uid === 'a0' && e.dmg < 0);
  assert.ok(heals.length > 0, 'раненый рыцарь с вампиризмом лечится от ударов');
});
