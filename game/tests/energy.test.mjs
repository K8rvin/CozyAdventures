import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  newGame, runBattle, saveGame, loadGame,
} from '../src/core/state.js';
import {
  refreshBattleEnergy, battleEnergyCost, millisecondsToNextEnergy,
} from '../src/core/energy.js';
import {
  BATTLE_ENERGY_CAP, BATTLE_ENERGY_REGEN_MS,
} from '../src/data/energy.js';
import { BATTLE_BY_ID, BATTLES } from '../src/data/battles.js';
import { onboardingBattleFinished } from '../src/core/onboarding.js';

const HOUR = 60 * 60 * 1000;

function memorySave(state) {
  const memory = {};
  const storage = {
    getItem: (key) => memory[key] ?? null,
    setItem: (key, value) => { memory[key] = String(value); },
  };
  saveGame(state, storage);
  return { storage, load: (now) => loadGame(storage, now) };
}

function strongBossState(now = 0) {
  const state = newGame(now);
  for (const battle of BATTLES) {
    if (battle.id !== 'bt_boss_willow') state.battlesDone[battle.id] = { victories: 1 };
  }
  state.equipped = {
    weapon: 'wpn_champion_greatsword', shield: null, helmet: 'hlm_ember_khan',
    armor: 'arm_ember_scalemail', gloves: 'glv_ember_forge', boots: 'bt_ember_storm',
    amulet: 'amu_ember_heart', ring1: 'rng_duelist', ring2: 'rng_ember_spark',
  };
  state.consumableBelt = [];
  state.crew = ['cmp_herbalist', 'cmp_cat', 'cmp_smith', 'merc_archer', 'merc_witch', 'pet_fox'];
  state.squadCompanions = ['cmp_herbalist', 'cmp_cat', 'cmp_smith'];
  state.squadMercs = ['merc_archer', 'merc_witch'];
  state.pet = 'pet_fox';
  state.formation = { knight: 1, merc0: 5, merc1: 4 };
  return state;
}

function coinSum(result) {
  return result.rewards.filter((reward) => reward.type === 'coins')
    .reduce((sum, reward) => sum + reward.amount, 0);
}

test('новая игра и старый сейв получают полный запас без задней тарификации', () => {
  assert.deepEqual(newGame(123).battleEnergy, { version: 1, value: 36, updatedAt: 123 });

  const old = newGame(123);
  old.battlesDone.bt_slimes = { victories: 7, at: 100 };
  delete old.battleEnergy;
  const { storage, load } = memorySave(old);
  const loaded = load(456);
  assert.deepEqual(loaded.battleEnergy, { version: 1, value: 36, updatedAt: 456 });
  assert.equal(loaded.battlesDone.bt_slimes.victories, 7, 'прежние бои не стали платными');
  saveGame(loaded, storage);
  assert.deepEqual(load(456), loaded, 'миграция и повторная загрузка идемпотентны');
});

test('регенерация ровно раз в два часа сохраняет остаток и ограничена cap', () => {
  const state = newGame(0);
  state.battleEnergy = { version: 1, value: 10, updatedAt: 1000 };
  const before = structuredClone(state.battleEnergy);
  refreshBattleEnergy(state, 1000 + BATTLE_ENERGY_REGEN_MS - 1);
  assert.deepEqual(state.battleEnergy, before, 'неполный интервал ничего не меняет');

  refreshBattleEnergy(state, 1000 + BATTLE_ENERGY_REGEN_MS);
  assert.equal(state.battleEnergy.value, 11);
  assert.equal(state.battleEnergy.updatedAt, 1000 + BATTLE_ENERGY_REGEN_MS);
  refreshBattleEnergy(state, 1000 + 2 * BATTLE_ENERGY_REGEN_MS + 500);
  assert.equal(state.battleEnergy.value, 12, 'второй интервал даёт ровно ещё одну единицу');
  assert.equal(state.battleEnergy.updatedAt, 1000 + 2 * BATTLE_ENERGY_REGEN_MS);
  assert.equal(millisecondsToNextEnergy(state, 1000 + 2 * BATTLE_ENERGY_REGEN_MS + 500),
    BATTLE_ENERGY_REGEN_MS - 500, '500 мс остатка не потеряны');

  state.battleEnergy = { version: 1, value: 35, updatedAt: 0 };
  refreshBattleEnergy(state, 100 * HOUR);
  assert.equal(state.battleEnergy.value, BATTLE_ENERGY_CAP, 'даже большой offline не превышает cap');
  const capped = structuredClone(state.battleEnergy);
  refreshBattleEnergy(state, 200 * HOUR);
  assert.deepEqual(state.battleEnergy, capped, 'полный запас не накапливается сверх cap');
});

test('перевод часов назад не даёт отрицательную энергию или бесплатную регенерацию', () => {
  const state = newGame(0);
  state.battleEnergy = { version: 1, value: 5, updatedAt: 10 * BATTLE_ENERGY_REGEN_MS };
  refreshBattleEnergy(state, 0);
  assert.deepEqual(state.battleEnergy,
    { version: 1, value: 5, updatedAt: 10 * BATTLE_ENERGY_REGEN_MS },
    'метка не отъезжает назад');

  refreshBattleEnergy(state, 11 * BATTLE_ENERGY_REGEN_MS - 1);
  assert.equal(state.battleEnergy.value, 5);
  refreshBattleEnergy(state, 11 * BATTLE_ENERGY_REGEN_MS);
  assert.equal(state.battleEnergy.value, 6, 'по восстановленным часам приходит только честный интервал');
  refreshBattleEnergy(state, 0);
  refreshBattleEnergy(state, 12 * BATTLE_ENERGY_REGEN_MS);
  assert.equal(state.battleEnergy.value, 7, 'повторная перемотка не дублирует начисление');
  assert.ok(state.battleEnergy.value >= 0);
});

test('повторная загрузка не начисляет один и тот же offline дважды', () => {
  const state = newGame(0);
  state.battleEnergy = { version: 1, value: 8, updatedAt: 0 };
  const { storage, load } = memorySave(state);
  const first = load(BATTLE_ENERGY_REGEN_MS + 750);
  assert.equal(first.battleEnergy.value, 9);
  assert.equal(first.battleEnergy.updatedAt, BATTLE_ENERGY_REGEN_MS);
  saveGame(first, storage);
  assert.deepEqual(load(BATTLE_ENERGY_REGEN_MS + 750), first);
  const later = load(2 * BATTLE_ENERGY_REGEN_MS + 750);
  assert.equal(later.battleEnergy.value, 10, 'следующий полный интервал учитывается один раз');
  assert.equal(later.battleEnergy.updatedAt, 2 * BATTLE_ENERGY_REGEN_MS);
});

test('первая победа бесплатна даже при нуле, обычный repeat стоит 1', () => {
  const state = newGame(0);
  state.coins = 137;
  state.battleEnergy.value = 0;
  const first = runBattle(state, 'bt_slimes', 1, { now: 0 });
  assert.equal(first.victory, true);
  assert.equal(first.energySpent, 0);
  assert.equal(first.energyAfter, 0);
  assert.ok(first.rewards.length > 0, 'нулевая энергия не отменяет первую награду');

  state.battleEnergy.value = 36;
  const coinsBefore = state.coins;
  const earnedBefore = state.stats.coinsEarned;
  const second = runBattle(state, 'bt_slimes', 1, { now: 0 });
  assert.equal(second.victory, true);
  assert.equal(second.energySpent, 1);
  assert.equal(second.energyAfter, 35);
  assert.equal(state.battleEnergy.value, second.energyAfter);
  assert.equal(state.coins - coinsBefore, coinSum(second), 'отчёт равен фактическому балансу');
  assert.equal(state.stats.coinsEarned - earnedBefore, coinSum(second));
});

test('стоимость босса определяется enemies/boss, а не wanted', () => {
  assert.equal(battleEnergyCost(BATTLE_BY_ID.bt_boss_willow, true), 3);
  assert.equal(battleEnergyCost(BATTLE_BY_ID.wnt_bee_queen, true), 1);
  assert.equal(battleEnergyCost(BATTLE_BY_ID.bt_boss_willow, false), 0);

  const state = strongBossState();
  const first = runBattle(state, 'bt_boss_willow', 7, { now: 0 });
  assert.equal(first.victory, true);
  assert.equal(first.energySpent, 0);
  const repeat = runBattle(state, 'bt_boss_willow', 7, { now: 0 });
  assert.equal(repeat.victory, true);
  assert.equal(repeat.energySpent, 3);
  assert.equal(repeat.energyAfter, 33);
  assert.equal(state.battleEnergy.value, 33);
});

test('поражение бесплатно и не меняет победную статистику', () => {
  const state = newGame(0);
  state.battlesDone.bt_slimes = { victories: 1 };
  state.battlesDone.bt_bees = { victories: 1 };
  state.consumableBelt = [];
  const result = runBattle(state, 'bt_bees', 1, { now: 0 });
  assert.equal(result.victory, false);
  assert.equal(result.energySpent, 0);
  assert.equal(result.energyAfter, 36);
  assert.equal(state.battleEnergy.value, 36);
  assert.equal(state.battlesDone.bt_bees.victories, 1);
  assert.equal(state.stats.battlesWon, 0);
  assert.deepEqual(result.rewards, []);
});

test('наградный repeat без энергии blocked до симуляции и без скрытых наград', () => {
  const state = newGame(0);
  state.battlesDone.bt_slimes = { victories: 1 };
  state.battleEnergy.value = 0;
  const before = structuredClone(state);
  const result = runBattle(state, 'bt_slimes', 1, { now: 0 });
  assert.equal(result.blocked, 'energy');
  assert.equal(result.ok, false);
  assert.equal(result.energyCost, 1);
  assert.equal(result.energyAfter, 0);
  assert.deepEqual(result.rewards, []);
  assert.equal(result.report, undefined, 'симулятор не запускался');
  assert.match(result.error, /тренировку без наград/);
  assert.deepEqual(state, before, 'blocked не расходует пояс и не меняет прогресс');
});

test('practice использует тот же seed/log и сохраняет весь state, включая пояс и pity', () => {
  const state = newGame(0);
  state.battlesDone.bt_slimes = { victories: 1, at: 0 };
  state.stats.battlesWon = 3;
  state.consumableBelt = ['scr_fire_step'];
  state.battleEnergy.value = 0;
  state.bossDrops.bt_boss_willow = { dry: 4, collected: false };
  state.achievements.old = 123;
  state.journal.push({ icon: '🐈', text: 'Уже было.', at: 0 });

  const rewarded = structuredClone(state);
  rewarded.battleEnergy.value = 36;
  const normal = runBattle(rewarded, 'bt_slimes', 1, { now: 0 });
  assert.equal(normal.victory, true);

  const before = structuredClone(state);
  const practice = runBattle(state, 'bt_slimes', 1, { now: 0, practice: true });
  assert.equal(practice.practice, true);
  assert.equal(practice.victory, normal.victory);
  assert.deepEqual(practice.log, normal.log, 'тот же симулятор и seed дают тот же реплей');
  assert.deepEqual(practice.rewards, []);
  assert.equal(practice.energySpent, 0);
  assert.equal(practice.energyAfter, 0);
  assert.ok(practice.log.some((event) => event.t === 'scroll'), 'предмет работает только внутри реплея');
  assert.deepEqual(state, before, 'никаких монет, материалов, статистики, журнала, пояса или pity');

  const first = newGame(0);
  first.battleEnergy.value = 0;
  const firstBefore = structuredClone(first);
  const firstPractice = runBattle(first, 'bt_slimes', 1, { now: 0, practice: true });
  assert.equal(firstPractice.victory, true);
  assert.equal(firstPractice.practice, true);
  assert.deepEqual(first, firstBefore, 'тренировка не засчитывает первую победу');
});

test('onboarding safe пояс сохраняется, practice не считается учебной попыткой', () => {
  const state = newGame(0);
  state.battlesDone.bt_slimes = { victories: 1 };
  const beltBefore = [...state.consumableBelt];
  const defeat = runBattle(state, 'bt_bees', 1, { now: 0 });
  assert.equal(defeat.victory, false);
  assert.deepEqual(state.consumableBelt, beltBefore, 'прежний onboarding safe не изменён');
  assert.equal(defeat.energySpent, 0);
  assert.equal(state.onboarding.flags.beesAttempts, 1);

  const arcBefore = structuredClone(state.onboarding);
  const practice = runBattle(state, 'bt_bees', 1, { now: 0, practice: true });
  assert.equal(practice.practice, true);
  assert.deepEqual(state.onboarding, arcBefore, 'practice не двигает шаг и счётчики дуги');
  assert.equal(onboardingBattleFinished(state, 'bt_bees', practice), false,
    'даже прямой повторный вызов события игнорирует practice');
  assert.deepEqual(state.onboarding, arcBefore);
});

test('core/energy не импортирует state.js', () => {
  const source = readFileSync(new URL('../src/core/energy.js', import.meta.url), 'utf8');
  assert.ok(!source.includes("from './state.js'"));
});
