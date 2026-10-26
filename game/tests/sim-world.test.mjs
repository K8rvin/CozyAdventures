import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createProfile, upgradeProfileState, battleChain, SIM_WORLDS } from '../tools/sim-world.mjs';
import { SHOP_STOCK, CREW_STOCK } from '../src/data/shop.js';
import { ITEM_BY_ID } from '../src/data/items.js';
import { RECIPES } from '../src/data/recipes.js';
import { BOSS_DROPS } from '../src/data/bossDrops.js';
import { COMPANION_BY_ID, PET_BY_ID, MERC_BY_ID } from '../src/data/crew.js';
import { BATTLE_BY_ID } from '../src/data/battles.js';
import { battleCoinReward } from '../src/core/economy.js';
import { runBattle } from '../src/core/state.js';

const CREW_DEF = { companion: COMPANION_BY_ID, pet: PET_BY_ID, merc: MERC_BY_ID };

test('sim-world охватывает все двенадцать миров без wanted', () => {
  assert.deepEqual(SIM_WORLDS.map((world) => world.id),
    ['meadow', 'town', 'attic', 'crossroads', 'nm', 'sw', 'sf', 'cr', 'ash', 'jade', 'deep', 'mist']);
  for (const world of SIM_WORLDS) {
    assert.ok(world.battles.length > 0, `${world.id}: пустой список боёв`);
    assert.ok(world.battles.every((battle) => !battle.wanted), `${world.id}: wanted попал в мир`);
  }
});

function assertLegalProfile(state, targetId) {
  assert.ok(state.coins >= 0, 'монеты не уходят в минус');
  assert.ok(state.seals >= 0, 'печати не уходят в минус');
  assert.equal(state.battlesDone[targetId], undefined, 'цель остаётся первой и бесплатной для энергии');
  assert.ok(state.consumableBelt.length <= 2);

  const itemIds = [
    ...state.inventory,
    ...state.consumableBelt,
    ...Object.values(state.equipped).filter(Boolean),
  ];
  for (const id of itemIds) {
    const item = ITEM_BY_ID[id];
    const stock = SHOP_STOCK.find((entry) => entry.itemId === id);
    const recipe = RECIPES.find((entry) => entry.result.itemId === id);
    const bossBattle = Object.keys(BOSS_DROPS).find((battleId) => BOSS_DROPS[battleId].itemId === id);
    assert.ok(item && (stock || recipe || bossBattle), `${id}: предмет из реального открытого источника`);
    assert.equal(item.sealPrice, undefined, `${id}: профиль не использует seal-снаряжение`);
    if (stock) {
      assert.ok(stock.unlockAfter === null || state.battlesDone[stock.unlockAfter],
        `${id}: ${stock.unlockAfter} уже открыт по цепочке`);
    } else if (recipe) {
      assert.ok(state.battlesDone[recipe.unlockAfter], `${id}: рецепт ${recipe.unlockAfter} открыт`);
    } else {
      assert.ok(state.battlesDone[bossBattle], `${id}: босс ${bossBattle} уже побеждён`);
    }
  }

  for (const id of state.crew) {
    const stock = CREW_STOCK.find((entry) => entry.id === id);
    assert.ok(stock, `${id}: команда из реального stock`);
    const def = CREW_DEF[stock.kind][id];
    assert.notEqual(def.currency, 'seals', `${id}: нет найма за печати при боевом доходе`);
    assert.ok(state.battlesDone[stock.unlockAfter], `${id}: ${stock.unlockAfter} открыт`);
  }
  assert.ok(state.squadCompanions.every((id) => state.crew.includes(id)));
  assert.ok(state.squadMercs.every((id) => state.crew.includes(id)));
  assert.ok(state.squadCompanions.length <= 3);
  assert.ok(state.squadMercs.length <= 2);
}

test('reasonable проходит только предыдущую цепочку и использует первую core-награду', () => {
  const targetId = 'bt_bees';
  const { state } = createProfile(targetId, 'reasonable');
  assert.deepEqual(Object.keys(state.battlesDone), ['bt_slimes']);
  assert.equal(state.stats.coinsEarned,
    battleCoinReward(BATTLE_BY_ID.bt_slimes, { repeat: false, goldFind: 0 }),
    'нет дохода головоломок, повторов или самодельной формулы');
  assertLegalProfile(state, targetId);
  assert.deepEqual(battleChain(targetId).map((battle) => battle.id), ['bt_slimes', 'bt_bees']);
});

test('reasonable и available на nm_17 не содержат закрытых вещей или команды', () => {
  for (const profile of ['reasonable', 'available']) {
    const { state } = createProfile('nm_17', profile);
    assertLegalProfile(state, 'nm_17');
    assert.ok(state.battlesDone.nm_16);
    assert.ok(!state.battlesDone.nm_17);
    assert.ok(!state.crew.includes('cmp_smith'), 'печатный кузнец не входит в не-seal профили');
    assert.ok(!Object.values(state.equipped).includes('wpn_firebird_quill'),
      'эндгеймовая печатная вещь не подмешана');
  }
  const { state: available } = createProfile('nm_17', 'available');
  const availableItems = [...available.inventory, ...Object.values(available.equipped).filter(Boolean)];
  assert.ok(availableItems.includes('arm_master'), 'available включает открытый крафт');
  assert.ok(availableItems.includes('shd_willow_vow'), 'available включает находку уже побеждённого босса');
});

test('upgrade отличается ровно одним осмысленным приобретением и не меняет reasonable', () => {
  const { state: reasonable } = createProfile('nm_17', 'reasonable');
  const before = structuredClone(reasonable);
  const beforeItems = [...reasonable.inventory, ...reasonable.consumableBelt,
    ...Object.values(reasonable.equipped).filter(Boolean)];
  const { state: upgraded, action } = upgradeProfileState(reasonable, 'nm_17');
  assert.deepEqual(reasonable, before, 'исходный профиль не мутирован');
  assert.ok(action, 'следующее усиление найдено');
  assert.equal(action.id, 'wpn_candle_staff', 'выбрана боевая польза, а не просто редкость или itemFind');
  assert.equal(action.kind, 'item');
  assert.equal(upgraded.equipped.weapon, action.id);
  assert.notEqual(upgraded.equipped.weapon, before.equipped.weapon);
  assert.deepEqual(upgraded.crew, before.crew, 'никакого второго усиления наймом');
  const afterItems = [...upgraded.inventory, ...upgraded.consumableBelt,
    ...Object.values(upgraded.equipped).filter(Boolean)];
  assert.equal(afterItems.length, beforeItems.length + 1, 'ровно один новый предмет');
  assert.ok(upgraded.coins >= 0);
  assert.ok(action.scenarioCoins >= 0, 'сценарное допущение цены явно возвращается отчётом');
  assertLegalProfile(upgraded, 'nm_17');
});

test('nm_17 проходит порог endgame, а upgrade не хуже reasonable', () => {
  const wins = (profile) => {
    const { state } = createProfile('nm_17', profile);
    let count = 0;
    for (let seed = 1; seed <= 24; seed++) {
      if (runBattle(structuredClone(state), 'nm_17', seed)?.victory) count++;
    }
    return count;
  };
  const endgame = wins('endgame');
  const reasonable = wins('reasonable');
  const upgrade = wins('upgrade');
  assert.ok(endgame >= 10, `endgame ${endgame}/24 ниже порога 40%`);
  assert.ok(endgame < 24, 'точечная настройка не превратила бой в 100% trivial');
  assert.ok(reasonable >= 10, `reasonable ${reasonable}/24 показывает реальный путь усиления`);
  assert.ok(upgrade >= reasonable, `upgrade ${upgrade}/24 ниже reasonable ${reasonable}/24`);
});
