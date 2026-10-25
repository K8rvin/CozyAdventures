import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { BOSS_DROPS } from '../src/data/bossDrops.js';
import { BATTLES, BATTLE_BY_ID } from '../src/data/battles.js';
import { ENEMY_BY_ID } from '../src/data/enemies.js';
import { ITEM_BY_ID } from '../src/data/items.js';
import { SHOP_STOCK } from '../src/data/shop.js';
import { RECIPES } from '../src/data/recipes.js';
import { TRAIT_LABEL } from '../src/ui/itemTip.js';
import {
  BOSS_DROP_BASE_CHANCE, BOSS_DROP_DRY_STEP, BOSS_DROP_PITY_WINS,
  BOSS_DROP_ITEM_FIND_CAP, bossDropChance, bossDropRoll, bossDropStatus,
  rollBossDrop, battleItemFind,
} from '../src/core/bossDrops.js';
import { newGame, runBattle, saveGame, loadGame } from '../src/core/state.js';

const EXPECTED_BOSSES = [
  'bt_boss_willow', 'bt_boss_captain', 'bk_boss_keeper', 'ex_boss',
  'nm_boss', 'sw_boss', 'sf_boss', 'cr_boss', 'ash_boss', 'jade_boss', 'deep_boss', 'mist_boss',
];

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

function roundTrip(state) {
  const memory = {};
  const storage = {
    getItem: (key) => memory[key] ?? null,
    setItem: (key, value) => { memory[key] = String(value); },
  };
  saveGame(state, storage);
  return loadGame(storage, 0);
}

test('ровно 12 фактических боссов имеют 12 уникальных внесетовых предметов', () => {
  const actualBosses = BATTLES.filter((battle) => battle.enemies.some((entry) => {
    const id = typeof entry === 'string' ? entry : entry.id;
    return ENEMY_BY_ID[id]?.boss;
  })).map((battle) => battle.id);
  assert.deepEqual([...actualBosses].sort(), [...EXPECTED_BOSSES].sort());
  assert.deepEqual(Object.keys(BOSS_DROPS).sort(), [...EXPECTED_BOSSES].sort());
  assert.equal(new Set(Object.values(BOSS_DROPS).map((drop) => drop.itemId)).size, 12);
  assert.equal(new Set(actualBosses.map((id) => BATTLE_BY_ID[id].world)).size, 12,
    'каждая находка тематически принадлежит своему миру');

  const slots = new Set();
  const statKeys = new Set([
    'hp', 'attack', 'armor', 'speed', 'crit', 'dodge', 'block',
    'goldFind', 'itemFind', 'materialsFind', 'resist',
  ]);
  for (const [battleId, drop] of Object.entries(BOSS_DROPS)) {
    const item = ITEM_BY_ID[drop.itemId];
    assert.ok(item, `${battleId}: предмет существует`);
    assert.equal(item.price, 0, `${item.id}: не имеет монетной цены`);
    assert.equal(item.set, undefined, `${item.id}: без сета`);
    assert.equal(item.sealPrice, undefined, `${item.id}: не продаётся за печати`);
    assert.notEqual(item.slot, 'consumable');
    slots.add(item.slot);
    assert.ok(!/[A-Za-z]/.test(item.name), `${item.id}: русское имя`);
    assert.ok(!/[A-Za-z]/.test(item.description), `${item.id}: русское описание`);
    assert.ok(Object.keys(item.stats || {}).every((key) => statKeys.has(key)), `${item.id}: рабочие статы`);
    assert.ok((item.traits || []).every((trait) => TRAIT_LABEL[trait]), `${item.id}: известная черта и русский label`);
    assert.ok(!SHOP_STOCK.some((stock) => stock.itemId === item.id), `${item.id}: нет в магазине`);
    assert.ok(!RECIPES.some((recipe) => recipe.result.itemId === item.id), `${item.id}: нет в рецептах`);
  }
  assert.ok(slots.size >= 8, 'находки распределены по разным слотам, а не только по оружию');
});

test('шанс растёт на 2 п.п., itemFind ограничен +5 п.п. и не отменяет pity', () => {
  assert.equal(BOSS_DROP_BASE_CHANCE, 0.05);
  assert.equal(BOSS_DROP_DRY_STEP, 0.02);
  assert.equal(BOSS_DROP_PITY_WINS, 12);
  assert.equal(BOSS_DROP_ITEM_FIND_CAP, 0.05);
  assert.ok(Math.abs(bossDropChance(0) - 0.05) < 1e-12);
  assert.ok(Math.abs(bossDropChance(1) - 0.07) < 1e-12);
  assert.ok(Math.abs(bossDropChance(10) - 0.25) < 1e-12);
  assert.equal(bossDropChance(11), 1, 'двенадцатая победа после 11 dry гарантирована');
  assert.ok(Math.abs(bossDropChance(0, 0.01) - 0.06) < 1e-12);
  assert.ok(Math.abs(bossDropChance(0, 1) - 0.10) < 1e-12, 'любой itemFind свыше 5% даёт только +5 п.п.');
  assert.equal(bossDropChance(11, 1), 1, 'бонус не делает гарантию больше ста процентов');

  const state = newGame(0);
  state.bossDrops.bt_boss_willow = { dry: 11, collected: false };
  const status = bossDropStatus(state, BATTLE_BY_ID.bt_boss_willow, 0);
  assert.equal(status.remaining, 1);
  assert.equal(status.guaranteed, true);
});

test('известный seed: независимый roll и ожидаемая вероятностная последовательность', () => {
  assert.equal(bossDropRoll('bt_boss_willow', 1, 1), 0.7162693785503507);
  assert.equal(bossDropRoll('bt_boss_willow', 1, 1), bossDropRoll('bt_boss_willow', 1, 1));
  assert.notEqual(bossDropRoll('bt_boss_willow', 1, 1), bossDropRoll('bt_boss_willow', 2, 1));

  const state = newGame(0);
  const battle = BATTLE_BY_ID.bt_boss_willow;
  const outcomes = [];
  for (let victory = 1; victory <= 5; victory++) {
    outcomes.push(rollBossDrop(state, battle, { victory, seed: 1, itemFind: 0 }));
  }
  assert.deepEqual(outcomes.map((result) => result.dropped), [false, false, false, false, true]);
  assert.deepEqual(outcomes.map((result) => result.dry), [0, 1, 2, 3, 4]);
  assert.deepEqual(outcomes.map((result) => result.dryAfter), [1, 2, 3, 4, 0]);
  for (const [index, result] of outcomes.entries()) {
    assert.ok(Math.abs(result.chance - (0.05 + index * 0.02)) < 1e-12);
  }
  assert.equal(outcomes[4].roll, 0.08754287171177566);
  assert.equal(state.bossDrops.bt_boss_willow.dry, 0, 'дроп сбрасывает pity');
  assert.equal(state.bossDrops.bt_boss_willow.collected, true);
});

test('гарантия срабатывает ровно на 12-й подходящей победе после 11 dry', () => {
  const state = newGame(0);
  const battle = BATTLE_BY_ID.bt_boss_willow;
  for (let victory = 1; victory <= 12; victory++) {
    const result = rollBossDrop(state, battle, { victory, seed: 7, itemFind: 0 });
    if (victory <= 11) {
      assert.equal(result.dropped, false, `seed 7: победа ${victory} ещё без дропа`);
      assert.equal(result.dryAfter, victory);
      assert.equal(result.guaranteed, false);
    } else {
      assert.equal(result.dry, 11);
      assert.equal(result.chance, 1);
      assert.equal(result.guaranteed, true);
      assert.equal(result.dropped, true, 'двенадцатая — гарантированная находка');
      assert.equal(result.dryAfter, 0);
    }
  }
});

test('pity и collected сохраняются; дубликат не падает даже после продажи', () => {
  const state = newGame(0);
  const battle = BATTLE_BY_ID.bt_boss_willow;
  for (let victory = 1; victory <= 5; victory++) rollBossDrop(state, battle, { victory, seed: 1, itemFind: 0 });
  const loaded = roundTrip(state);
  assert.equal(loaded.bossDrops.bt_boss_willow.collected, true);
  const again = rollBossDrop(loaded, battle, { victory: 6, seed: 1, itemFind: 0 });
  assert.equal(again.collected, true);
  assert.equal(again.dropped, false);
  assert.equal(again.roll, null, 'для собранной находки ГСЧ больше не вызывается');
  assert.equal(loaded.bossDrops.bt_boss_willow.dry, 0);

  const oldInventory = newGame(0);
  oldInventory.inventory.push('shd_willow_vow');
  assert.equal(bossDropStatus(oldInventory, battle, 0).collected, true, 'старый предмет в сундуке защищает');
  assert.equal(rollBossDrop(oldInventory, battle, { victory: 1, seed: 1, itemFind: 0 }).dropped, false);

  const oldEquipped = newGame(0);
  oldEquipped.equipped.shield = 'shd_willow_vow';
  assert.equal(bossDropStatus(oldEquipped, battle, 0).collected, true, 'старый надетый предмет защищает');
});

test('itemFind собирается из снаряжения и команды, но не меняет монеты и материалы', () => {
  const state = newGame(0);
  state.equipped.helmet = 'hlm_nm_lantern';
  state.squadCompanions = ['cmp_firefly'];
  state.pet = 'pet_hedgehog';
  assert.ok(Math.abs(battleItemFind(state) - 0.3) < 1e-12);
  assert.equal(bossDropStatus(state, BATTLE_BY_ID.bt_boss_willow).chance, 0.1,
    'фактический бонус команды также ограничен пятью пунктами');

  const plain = newGame(0);
  const lucky = newGame(0);
  lucky.squadCompanions = ['cmp_firefly'];
  lucky.pet = 'pet_hedgehog';
  const normal = runBattle(plain, 'bt_slimes', 1, { now: 0 });
  const withFind = runBattle(lucky, 'bt_slimes', 1, { now: 0 });
  const economic = (result) => result.rewards.filter((reward) => ['coins', 'material'].includes(reward.type));
  assert.deepEqual(economic(withFind), economic(normal), 'itemFind не создаёт экономический бонус вне босс-дропа');
});

test('гарантированный item проходит grantRewards один раз и попадает в результат с energy', () => {
  const state = strongBossState();
  state.bossDrops.bt_boss_willow = { dry: 11, collected: false };
  const coinsBefore = state.coins;
  const result = runBattle(state, 'bt_boss_willow', 7, { now: 0 });
  assert.equal(result.victory, true);
  assert.equal(result.bossDrop.dropped, true);
  assert.equal(result.bossDrop.chance, 1);
  assert.equal(result.bossDrop.dry, 11);
  assert.equal(result.energySpent, 0, 'первая победа бесплатна');
  assert.equal(result.energyAfter, 36);
  const items = result.rewards.filter((reward) => reward.type === 'item' && reward.id === 'shd_willow_vow');
  assert.equal(items.length, 1);
  assert.equal(state.inventory.filter((id) => id === 'shd_willow_vow').length, 1);
  const coinRewards = result.rewards.filter((reward) => reward.type === 'coins')
    .reduce((sum, reward) => sum + reward.amount, 0);
  assert.equal(state.coins - coinsBefore, coinRewards);

  const repeat = runBattle(state, 'bt_boss_willow', 7, { now: 0 });
  assert.equal(repeat.victory, true);
  assert.equal(repeat.energySpent, 3);
  assert.equal(repeat.energyAfter, 33);
  assert.equal(repeat.bossDrop.collected, true);
  assert.equal(repeat.bossDrop.dropped, false);
  assert.ok(!repeat.rewards.some((reward) => reward.type === 'item' && reward.id === 'shd_willow_vow'));
  assert.equal(state.inventory.filter((id) => id === 'shd_willow_vow').length, 1);
});

test('первая и repeat победы двигают pity, practice и поражение не двигают', () => {
  const state = strongBossState();
  state.battleEnergy.value = 0;
  const practiceFirst = runBattle(state, 'bt_boss_willow', 7, { now: 0, practice: true });
  assert.equal(practiceFirst.victory, true);
  assert.equal(practiceFirst.practice, true);
  assert.deepEqual(state.bossDrops, {});
  assert.equal(state.battlesDone.bt_boss_willow, undefined);

  state.battleEnergy.value = 36;
  const first = runBattle(state, 'bt_boss_willow', 7, { now: 0 });
  assert.equal(first.victory, true);
  assert.equal(first.bossDrop.dropped, false);
  assert.equal(state.bossDrops.bt_boss_willow.dry, 1, 'первая настоящая победа подходит');
  const dryBeforePractice = state.bossDrops.bt_boss_willow.dry;
  runBattle(state, 'bt_boss_willow', 7, { now: 0, practice: true });
  assert.equal(state.bossDrops.bt_boss_willow.dry, dryBeforePractice);
  const repeat = runBattle(state, 'bt_boss_willow', 7, { now: 0 });
  assert.equal(repeat.victory, true);
  assert.equal(state.bossDrops.bt_boss_willow.dry, 2, 'наградной repeat тоже подходит');

  const defeated = newGame(0);
  defeated.battlesDone.bt_hunt_trail = { victories: 1 };
  defeated.battlesDone.bt_boss_willow = { victories: 1 };
  defeated.bossDrops.bt_boss_willow = { dry: 4, collected: false };
  defeated.consumableBelt = [];
  const loss = runBattle(defeated, 'bt_boss_willow', 1, { now: 0 });
  assert.equal(loss.victory, false);
  assert.equal(loss.bossDrop, null);
  assert.equal(defeated.bossDrops.bt_boss_willow.dry, 4);
  assert.equal(loss.energySpent, 0);
});

test('изменение боевого лога не меняет seed и вероятность дропа', () => {
  const balanced = strongBossState();
  const offensive = strongBossState();
  offensive.settings.tactic = 'offense';
  const first = runBattle(balanced, 'bt_boss_willow', 1, { now: 0 });
  const second = runBattle(offensive, 'bt_boss_willow', 1, { now: 0 });
  assert.equal(first.victory, true);
  assert.equal(second.victory, true);
  assert.notDeepEqual(first.log, second.log, 'тактика действительно меняет боевой лог');
  assert.equal(first.bossDrop.roll, second.bossDrop.roll);
  assert.equal(first.bossDrop.chance, second.bossDrop.chance);
  assert.equal(first.bossDrop.dropped, second.bossDrop.dropped);
});

test('core/bossDrops не импортирует state.js', () => {
  const source = readFileSync(new URL('../src/core/bossDrops.js', import.meta.url), 'utf8');
  assert.ok(!source.includes("from './state.js'"));
});
