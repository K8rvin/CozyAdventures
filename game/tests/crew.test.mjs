import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  newGame, hireCrew, toggleCompanion, toggleMerc, setPet, crewStock, runBattle,
} from '../src/core/state.js';
import { makeKnight, makeMerc, simulateBattle } from '../src/core/battle.js';
import { COMPANIONS, PETS, MERCENARIES, MERC_BY_ID } from '../src/data/crew.js';
import { CREW_STOCK } from '../src/data/shop.js';

function richState() {
  const s = newGame();
  s.coins = 5000;
  s.seals = 10;
  // Открываем всех в таверне
  for (const c of CREW_STOCK) s.battlesDone[c.unlockAfter] = { victories: 1 };
  return s;
}

test('данные экипажа корректны', () => {
  const ids = new Set();
  for (const list of [COMPANIONS, PETS, MERCENARIES]) {
    for (const c of list) {
      assert.ok(!ids.has(c.id), `дубль ${c.id}`);
      ids.add(c.id);
      assert.ok(c.name && c.icon && c.description);
      assert.ok(['coins', 'seals'].includes(c.currency));
    }
  }
  // Все CREW_STOCK ссылаются на существующие сущности
  const byKind = {
    companion: new Set(COMPANIONS.map((c) => c.id)),
    pet: new Set(PETS.map((c) => c.id)),
    merc: new Set(MERCENARIES.map((c) => c.id)),
  };
  for (const s of CREW_STOCK) {
    assert.ok(byKind[s.kind].has(s.id), `CREW_STOCK: нет ${s.id}`);
  }
});

test('найм списывает монеты и добавляет в команду', () => {
  const s = richState();
  const r = hireCrew(s, 'cmp_cat', 'companion');
  assert.ok(r.ok);
  assert.ok(s.crew.includes('cmp_cat'));
  assert.equal(s.coins, 5000 - 110);
  // Повторный найм нельзя
  assert.equal(hireCrew(s, 'cmp_cat', 'companion').ok, false);
});

test('лимиты отряда: 3 спутника, 2 наёмника, 1 питомец', () => {
  const s = richState();
  for (const id of ['cmp_firefly', 'cmp_herbalist', 'cmp_cat', 'cmp_smith']) hireCrew(s, id, 'companion');
  assert.equal(s.squadCompanions.length, 3, 'четвёртый спутник не должен влезть автоматически');
  assert.equal(toggleCompanion(s, 'cmp_smith').ok, false);
  toggleCompanion(s, 'cmp_cat'); // убрать
  assert.ok(toggleCompanion(s, 'cmp_smith').ok);

  for (const id of ['merc_archer', 'merc_guard', 'merc_witch']) hireCrew(s, id, 'merc');
  assert.equal(s.squadMercs.length, 2);
  assert.equal(toggleMerc(s, 'merc_witch').ok, false);

  hireCrew(s, 'pet_puppy', 'pet');
  hireCrew(s, 'pet_fox', 'pet');
  assert.equal(s.pet, 'pet_puppy');
  setPet(s, 'pet_fox');
  assert.equal(s.pet, 'pet_fox');
});

test('наёмник реально участвует в бою', () => {
  const merc = makeMerc(MERC_BY_ID.merc_archer);
  const knight = makeKnight({ hp: 60, attack: 8, armor: 6, speed: 10, crit: 0.05, dodge: 0.03, block: 0, resist: {} }, [], []);
  const r = simulateBattle([knight, merc], ['slime_meadow', 'slime_meadow'], 1);
  assert.equal(r.victory, true);
  assert.ok(r.log.some((e) => e.t === 'hit' && e.from === 'Лесная лучница'), 'лучница должна атаковать');
  assert.ok(r.report.alliesStats.length === 2);
});

test('травница даёт регенерацию рыцарю', () => {
  const knight = makeKnight(
    { hp: 60, attack: 8, armor: 6, speed: 10, crit: 0.05, dodge: 0.03, block: 0, resist: {} },
    ['regen_ally'], [],
  );
  assert.ok(knight.statuses.some((s) => s.kind === 'regen'), 'статус регенерации на старте боя');
});

test('ведьминка лечит союзника в бою', () => {
  const witch = makeMerc(MERC_BY_ID.merc_witch);
  const knight = makeKnight({ hp: 60, attack: 6, armor: 4, speed: 10, crit: 0.05, dodge: 0, block: 0, resist: {} }, [], []);
  const r = simulateBattle([knight, witch], ['golem_moss'], 6);
  assert.ok(r.log.some((e) => e.t === 'status' && e.kind === 'regen'), 'ведьминка должна наложить regen');
});

test('тексты бонусов команды строго на русском', async () => {
  const { bonusText } = await import('../src/ui/tavernView.js');
  for (const list of [COMPANIONS, PETS, MERCENARIES]) {
    for (const c of list) {
      const t = bonusText(c);
      assert.ok(!/\b(hp|attack|armor|speed|crit|dodge|goldFind|itemFind|materialsFind)\b/.test(t),
        `${c.id}: английский ключ в бонусе: ${t}`);
    }
  }
});

test('полный отряд проходит бой через runBattle', () => {
  const s = richState();
  hireCrew(s, 'merc_archer', 'merc');
  hireCrew(s, 'cmp_cat', 'companion');
  hireCrew(s, 'pet_puppy', 'pet');
  const r = runBattle(s, 'bt_slimes', 1);
  assert.ok(r);
  assert.equal(r.victory, true);
  assert.ok(r.report.alliesStats.length === 2, 'рыцарь + лучница');
});
