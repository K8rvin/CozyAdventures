import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  newGame, ALL_PUZZLES, completePuzzle, skipPuzzle, firstUnsolvedPuzzle,
  dailyPuzzle, todayKey, runBattle, shopStock, buyItem, sellItem,
  saveGame, loadGame, findPuzzle,
} from '../src/core/state.js';
import {
  coinsPerMinute, puzzleCoinReward, puzzleSkipTerms, derivePuzzle,
  battleCoinReward, battleEconomy, itemPrice,
} from '../src/core/economy.js';
import {
  ECONOMY_VERSION, ITEM_PRICE_OVERRIDES, PRICE_TARGET_MINUTES,
} from '../src/data/economy.js';
import { BATTLES, BATTLE_BY_ID } from '../src/data/battles.js';
import { ENEMY_BY_ID } from '../src/data/enemies.js';
import {
  SHOP_STOCK, CREW_STOCK, pricedShopItem, compareShopItems, itemsForShop,
} from '../src/data/shop.js';
import { ITEM_BY_ID } from '../src/data/items.js';
import { COSMETICS } from '../src/data/cosmetics.js';
import { RECIPES } from '../src/data/recipes.js';
import { COMPANION_BY_ID, PET_BY_ID, MERC_BY_ID } from '../src/data/crew.js';

const sum = (items, fn) => items.reduce((total, item) => total + fn(item), 0);
const coinReward = (result) => sum((Array.isArray(result) ? result : result.rewards).filter((r) => r.type === 'coins'), (r) => r.amount);

function unlockEverything(state) {
  for (const battle of BATTLES) state.battlesDone[battle.id] = { victories: 1 };
}

function budget() {
  const puzzleCoins = sum(ALL_PUZZLES, (p) => puzzleCoinReward(p));
  const battleCoins = sum(BATTLES, (b) => battleCoinReward(b));
  const shop = sum(SHOP_STOCK, (entry) => {
    const item = pricedShopItem(entry);
    return item.slot !== 'consumable' && !item.sealPrice ? item.price : 0;
  });
  const consumables = sum(SHOP_STOCK, (entry) => {
    const item = pricedShopItem(entry);
    return item.slot === 'consumable' && !item.sealPrice ? item.price : 0;
  });
  const crewDefs = Object.values({ ...COMPANION_BY_ID, ...PET_BY_ID, ...MERC_BY_ID });
  const crew = sum(crewDefs, (def) => def.currency !== 'seals' ? def.price : 0);
  const cosmetics = sum(COSMETICS, (def) => !def.sealPrice ? def.price : 0);
  const craft = sum(RECIPES, (recipe) => recipe.coins || 0);
  const puzzleSeals = sum(ALL_PUZZLES, (p) => sum(p.rewards.filter((r) => r.type === 'seals'), (r) => r.amount));
  const battleSeals = sum(BATTLES, (battle) => sum(battle.enemies, (entry) => {
    const id = typeof entry === 'string' ? entry : entry.id;
    return ENEMY_BY_ID[id]?.reward?.seals || 0;
  }));
  const cosmeticSealStock = sum(COSMETICS, (def) => def.sealPrice || 0);
  const sealStock = sum(crewDefs, (def) => def.currency === 'seals' ? def.price : 0)
    + sum(SHOP_STOCK.map(pricedShopItem), (item) => item.sealPrice || 0)
    + cosmeticSealStock;
  return {
    coins: puzzleCoins + battleCoins,
    puzzleCoins,
    battleCoins,
    stock: shop + consumables + crew + cosmetics + craft,
    seals: puzzleSeals + battleSeals,
    puzzleSeals,
    battleSeals,
    sealStock,
    cosmetics,
    cosmeticSealStock,
  };
}

test('нормативные ставки, учебные overrides и точные daily/factors', () => {
  assert.deepEqual([0, 1, 2, 3, 4, 5].map(coinsPerMinute), [20, 24, 28, 32, 36, 40]);
  const level = findPuzzle(newGame(), 'md_01');
  assert.equal(level.economy.expectedFirstSeconds, 120);
  assert.equal(level.economy.expectedRepeatSeconds, 60);
  assert.equal(puzzleCoinReward(level), 40);
  assert.equal(puzzleCoinReward(level, { repeat: true }), 5);
  assert.equal(puzzleCoinReward(level, { factor: 1.5 }), 60);
  assert.equal(puzzleCoinReward(level, { repeat: true, factor: 1.5 }), 5, 'perfect на повторе ограничен 1');
  assert.equal(puzzleCoinReward(level, { repeat: true, factor: 0.5 }), 3);
  assert.equal(puzzleCoinReward(level, { daily: true }), 80, 'daily ровно ×2 первой награды');
  assert.equal(puzzleCoinReward(level, { repeat: true, daily: true }), 10, 'daily ровно ×2 повтора');
  assert.deepEqual(puzzleSkipTerms(level), { price: 60, consolation: 13 });

  const custom = derivePuzzle({
    id: 'custom_test', name: 'Проверка', difficulty: 1,
    economyTier: 3, expectedFirstSeconds: 90, expectedRepeatSeconds: 45,
  }, { finale: true });
  assert.equal(puzzleCoinReward(custom), 48);
  assert.equal(puzzleCoinReward(custom, { repeat: true }), 6);
  assert.ok(custom.rewards.some((r) => r.type === 'seals' && r.amount === 1));
});

test('derived-каталог — единый источник монет и редких печатей', () => {
  assert.equal(ALL_PUZZLES.length, 838);
  const sealLevels = [];
  for (const level of ALL_PUZZLES) {
    const coins = level.rewards.find((r) => r.type === 'coins');
    assert.equal(coins.amount, puzzleCoinReward(level), `${level.id}: derived и core расходятся`);
    assert.ok(Number.isInteger(level.economy.tier) && level.economy.tier >= 0 && level.economy.tier <= 5);
    assert.ok(Number.isInteger(level.economy.order));
    const seals = level.rewards.filter((r) => r.type === 'seals');
    if (seals.length > 0) {
      assert.equal(level.economy.finale, true, `${level.id}: печать не на финале`);
      assert.deepEqual(seals, [{ type: 'seals', amount: 1 }]);
      sealLevels.push(level.id);
    }
  }
  assert.equal(sealLevels.length, 16, 'по одной печати на финал каждого типа');
  assert.ok(findPuzzle(newGame(), 'md_03').rewards.some((r) => r.type === 'item' && r.id === 'pot_heal'),
    'немонетная item-награда сохранена');
});

test('каждая механика даёт не менее 80% лучшей нормативной доходности яруса', () => {
  for (let tier = 0; tier <= 5; tier++) {
    const levels = ALL_PUZZLES.filter((p) => p.economy.tier === tier);
    const firstRates = levels.map((p) => puzzleCoinReward(p) * 60 / p.economy.expectedFirstSeconds);
    const repeatRates = levels.map((p) => puzzleCoinReward(p, { repeat: true }) * 60 / p.economy.expectedRepeatSeconds);
    const firstBest = Math.max(...firstRates);
    const repeatBest = Math.max(...repeatRates);
    for (const level of levels) {
      const first = puzzleCoinReward(level) * 60 / level.economy.expectedFirstSeconds;
      const repeat = puzzleCoinReward(level, { repeat: true }) * 60 / level.economy.expectedRepeatSeconds;
      assert.ok(first >= firstBest * 0.8, `${level.id}: первый доход ${first} < 80% от ${firstBest}`);
      assert.ok(repeat >= repeatBest * 0.8, `${level.id}: повторный доход ${repeat} < 80% от ${repeatBest}`);
    }
  }
});

test('completePuzzle: первый/повтор, факторы и фактический баланс совпадают', () => {
  const state = newGame();
  state.lastDailyBonus = todayKey();
  const level = findPuzzle(state, 'gift_01');
  const firstBefore = state.coins;
  const first = completePuzzle(state, level.id, { coinFactor: 0.75 });
  const firstExpected = puzzleCoinReward(level, { factor: 0.75 });
  assert.equal(coinReward(first), firstExpected);
  assert.equal(state.coins - firstBefore, firstExpected);

  const repeatBefore = state.coins;
  const repeat = completePuzzle(state, level.id, { coinFactor: 1.5 });
  const repeatExpected = puzzleCoinReward(level, { repeat: true, factor: 1.5 });
  assert.equal(coinReward(repeat), repeatExpected);
  assert.equal(state.coins - repeatBefore, repeatExpected);
  assert.equal(repeat.length, 1, 'повтор не дублирует немонетные награды');
  assert.equal(state.stats.puzzlesSolved, 2);
});

test('пропуск не выгоден и не превращается в repeat-farm; честное решение первое', () => {
  for (const level of ALL_PUZZLES) {
    const terms = puzzleSkipTerms(level);
    assert.ok(terms.price - terms.consolation >= puzzleCoinReward(level),
      `${level.id}: skip→honest даёт положительный арбитраж`);
  }

  const state = newGame();
  state.coins = 1000;
  state.lastDailyBonus = todayKey();
  state.story.pending = { puzzleId: 'md_01', guestId: null, beat: false };
  const skipped = skipPuzzle(state, 'md_01');
  assert.equal(skipped.ok, true);
  assert.deepEqual(skipped, { ok: true, price: 60, consolation: 13 });
  assert.equal(state.stats.puzzlesSolved, 0, 'пропуск не увеличивает честный счётчик');
  assert.equal(state.story.step, 1, 'пропуск закрывает story-задание');
  assert.equal(firstUnsolvedPuzzle(state).id, 'md_01', 'пропущенный предлагается для честного решения');

  const before = state.coins;
  const first = completePuzzle(state, 'md_01', { coinFactor: 1.5 });
  assert.equal(coinReward(first), 60, 'после пропуска выдаётся первая, а не повторная награда');
  assert.equal(state.coins - before, 60);
  assert.equal(state.puzzlesDone.md_01.skipped, undefined);
  assert.equal(state.stats.puzzlesSolved, 1);
  assert.equal(state.story.step, 1, 'история не двигается повторно');
  assert.equal(skipPuzzle(state, 'md_01').ok, false, 'повторно пропустить нельзя');

  const onlySkipped = newGame();
  for (const level of ALL_PUZZLES) onlySkipped.puzzlesDone[level.id] = {};
  onlySkipped.puzzlesDone.md_01 = { skipped: true };
  assert.equal(dailyPuzzle(onlySkipped).id, 'md_01', 'daily умеет предложить пропущенный уровень');
});

test('daily после полной кампании удваивает повтор без немонетных дублей', () => {
  const state = newGame();
  for (const level of ALL_PUZZLES) state.puzzlesDone[level.id] = {};
  const daily = dailyPuzzle(state);
  assert.equal(dailyPuzzle(state).id, daily.id, 'выбор детерминирован в пределах UTC-дня');
  assert.ok(ALL_PUZZLES.slice(-6).some((p) => p.id === daily.id));
  const inventory = [...state.inventory];
  const seals = state.seals;
  const before = state.coins;
  const base = puzzleCoinReward(daily, { repeat: true });
  const rewards = completePuzzle(state, daily.id, { coinFactor: 1.5 });
  assert.equal(coinReward(rewards), base * 2);
  assert.equal(state.coins - before, base * 2);
  assert.equal(rewards.length, 1);
  assert.deepEqual(state.inventory, inventory);
  assert.equal(state.seals, seals);
  assert.equal(state.lastDailyBonus, todayKey());
});

test('боевые монеты: scale и goldFind применяются один раз, баланс совпадает', () => {
  const state = newGame();
  state.coins = 137;
  state.pet = 'pet_puppy'; // goldFind 0.15
  const firstBefore = state.coins;
  const first = runBattle(state, 'bt_slimes', 1);
  assert.equal(first.victory, true);
  assert.equal(first.rewards.filter((r) => r.type === 'coins').length, 1, 'одна монетная награда на бой');
  assert.equal(coinReward(first), battleCoinReward(BATTLE_BY_ID.bt_slimes, { goldFind: 0.15 }));
  assert.equal(state.coins - firstBefore, coinReward(first));

  const secondBefore = state.coins;
  const second = runBattle(state, 'bt_slimes', 1);
  assert.equal(second.victory, true);
  assert.equal(coinReward(second), battleCoinReward(BATTLE_BY_ID.bt_slimes, { repeat: true, goldFind: 0.15 }));
  assert.equal(state.coins - secondBefore, coinReward(second));

  const scaled = { id: 'scaled', world: 'meadow', enemies: [{ id: 'slime_meadow', scale: 2 }] };
  const economy = battleEconomy(scaled);
  const expected = Math.round(coinsPerMinute(economy.tier) * economy.expectedFirstSeconds / 60
    * economy.bossMultiplier * 1.15);
  assert.equal(battleCoinReward(scaled, { goldFind: 0.15 }), expected, 'scale входит в нормативную мощь до одного округления');
});

function strongState(targetId) {
  const state = newGame();
  for (const battle of BATTLES) {
    if (battle.id !== targetId) state.battlesDone[battle.id] = { victories: 1 };
  }
  state.equipped = {
    weapon: 'wpn_firebird_quill', shield: 'shd_tower', helmet: 'hlm_page_wanderer',
    armor: 'arm_ink_cloak', gloves: 'glv_smithee', boots: 'bt_quiet_step',
    amulet: 'amu_pages', ring1: 'rng_duelist', ring2: 'rng_contents',
  };
  state.crew = ['cmp_herbalist', 'cmp_cat', 'cmp_smith', 'merc_archer', 'merc_witch', 'pet_fox'];
  state.squadCompanions = ['cmp_herbalist', 'cmp_cat', 'cmp_smith'];
  state.squadMercs = ['merc_archer', 'merc_witch'];
  state.pet = 'pet_fox';
  state.formation = { knight: 1, merc0: 5, merc1: 4 };
  return state;
}

test('печати босса выдаются только за первую победу, материалы остаются', () => {
  const state = strongState('bt_boss_willow');
  const first = runBattle(state, 'bt_boss_willow', 1);
  assert.equal(first.victory, true);
  const firstSeals = sum(first.rewards.filter((r) => r.type === 'seals'), (r) => r.amount);
  assert.ok(firstSeals > 0);
  const sealsAfterFirst = state.seals;
  state.consumableBelt = ['pot_heal', 'pot_vigor'];
  const second = runBattle(state, 'bt_boss_willow', 1);
  assert.equal(second.victory, true);
  assert.equal(second.rewards.some((r) => r.type === 'seals'), false);
  assert.equal(state.seals, sealsAfterFirst);
  assert.ok(second.rewards.some((r) => r.type === 'material'), 'материалы повтора сохранены');
});

test('цены следуют tier/минутам, магазин и лавки сортируются по прогрессии', () => {
  for (const entry of SHOP_STOCK) {
    assert.ok(Number.isInteger(entry.tier) && entry.tier >= 0 && entry.tier <= 5, entry.itemId);
    assert.ok(Number.isInteger(entry.order) && entry.order >= 0, entry.itemId);
    const item = pricedShopItem(entry);
    assert.equal(item.price, itemPrice(ITEM_BY_ID[entry.itemId], { tier: entry.tier }), entry.itemId);
    if (item.sealPrice || ITEM_PRICE_OVERRIDES[item.id] !== undefined) continue;
    const kind = item.slot === 'consumable' ? 'consumable' : item.rarity;
    const target = PRICE_TARGET_MINUTES[kind];
    const rawPrice = coinsPerMinute(entry.tier) * target;
    assert.ok(Math.abs(item.price - rawPrice) <= 2.5,
      `${item.id}: ${item.price} вместо ${rawPrice} с допустимым round5`);
  }
  const state = newGame();
  unlockEverything(state);
  const stock = shopStock(state);
  assert.deepEqual(stock.map((i) => i.id), [...stock].sort(compareShopItems).map((i) => i.id));
  for (const key of ['armory', 'armorer', 'magic', 'alchemy']) {
    const items = itemsForShop(state, key, stock);
    assert.deepEqual(items.map((i) => i.id), [...items].sort(compareShopItems).map((i) => i.id), key);
  }
  const late = pricedShopItem(SHOP_STOCK.find((entry) => entry.itemId === 'wpn_swamp_sickle'));
  assert.equal(late.price, 1150);
  assert.ok(late.price > ITEM_BY_ID.wpn_swamp_sickle.price * 2, 'поздний дешёвый эпик приведён к модели');
  const sealed = pricedShopItem(SHOP_STOCK.find((entry) => entry.itemId === 'wpn_firebird_quill'));
  assert.equal(sealed.sealPrice, 6);
  assert.equal(sealed.price, 0);
});

test('покупка/продажа используют одну цену; уникальные дубли запрещены, расходники разрешены', () => {
  const state = newGame();
  unlockEverything(state);
  state.coins = 10000;
  const late = pricedShopItem(SHOP_STOCK.find((entry) => entry.itemId === 'wpn_swamp_sickle'));
  const before = state.coins;
  assert.equal(buyItem(state, late.id).ok, true);
  assert.equal(state.coins, before - late.price);
  const afterPurchase = state.coins;
  const purchases = state.stats.itemsBought;
  const duplicate = buyItem(state, late.id);
  assert.equal(duplicate.ok, false);
  assert.match(duplicate.error, /уже у вас/);
  assert.equal(state.coins, afterPurchase);
  assert.equal(state.stats.itemsBought, purchases);
  const sold = sellItem(state, state.inventory.indexOf(late.id));
  assert.equal(sold.price, Math.floor(late.price / 2));
  assert.equal(state.coins, afterPurchase + sold.price);

  const bootsState = newGame();
  assert.equal(buyItem(bootsState, 'bt_path').ok, true);
  assert.equal(bootsState.equipped.boots, 'bt_path');
  assert.equal(buyItem(bootsState, 'bt_path').ok, false, 'надетая уникальная вещь тоже защищена');

  const potionState = newGame();
  potionState.coins = 1000;
  assert.equal(buyItem(potionState, 'pot_heal').ok, true);
  assert.equal(buyItem(potionState, 'pot_heal').ok, true, 'расходники можно покупать повторно');
});

test('economyVersion и повторная загрузка идемпотентны, деньги и старые дубли сохранены', () => {
  const old = newGame();
  delete old.economyVersion;
  old.coins = 12345;
  old.inventory = ['arm_padded', 'arm_padded'];
  const memory = {};
  const storage = {
    getItem: (key) => memory[key] ?? null,
    setItem: (key, value) => { memory[key] = String(value); },
  };
  saveGame(old, storage);
  const loaded = loadGame(storage);
  assert.equal(loaded.economyVersion, ECONOMY_VERSION);
  assert.equal(loaded.coins, 12345);
  assert.deepEqual(loaded.inventory, ['arm_padded', 'arm_padded'], 'старые дубли не удаляются');
  saveGame(loaded, storage);
  const loadedAgain = loadGame(storage);
  assert.deepEqual(loadedAgain, loaded, 'повторная миграция ничего не меняет');
});

test('полные бюджеты первых наград и печатей находятся в целевых отношениях', () => {
  const report = budget();
  assert.equal(report.coins, 76762, 'доход соответствует каталогу с большими сборами');
  assert.equal(report.cosmetics, 1310, 'шесть полных пакетов');
  assert.equal(report.cosmeticSealStock, 0, 'отдельной печатной вывески больше нет');
  assert.equal(report.stock, 55320);
  assert.equal(report.sealStock, 45);
  const ratio = report.coins / report.stock;
  assert.ok(Math.abs(ratio - 1.39) < 0.01, `монеты/разовые стоки: ${ratio}`);
  assert.ok(ratio >= 1.3 && ratio <= 1.8, `монеты/разовые стоки: ${ratio}`);
  const sealRatio = report.seals / report.sealStock;
  assert.ok(Math.abs(sealRatio - 62 / 45) < 1e-12, `печати/печатные стоки: ${sealRatio}`);
  assert.ok(sealRatio >= 1.2 && sealRatio <= 1.5, `печати/печатные стоки: ${sealRatio}`);
  assert.equal(report.puzzleSeals, 16);
  assert.equal(report.battleSeals, 46);
});

test('учебная доступность: все три ветки ведут к bt_path и rng_health без фарма', () => {
  for (const third of ['tw_01', 'sk_md_01', 'pp_01']) {
    const state = newGame();
    state.lastDailyBonus = todayKey(); // проверяем путь без случайного daily-бонуса
    completePuzzle(state, 'md_01');
    completePuzzle(state, 'md_02');
    completePuzzle(state, third);
    const battle = runBattle(state, 'bt_slimes', 1);
    assert.equal(battle.victory, true, `${third}: первый бой должен быть доступен`);
    assert.equal(state.coins, 250, `${third}: старт и три головоломки + первый бой`);
    assert.equal(buyItem(state, 'bt_path').ok, true, `${third}: сапоги покупаются сразу`);
    assert.equal(state.coins, 170);
    runBattle(state, 'bt_bees', 1); // поражение допустимо и не блокирует путь
    assert.ok(state.coins >= 80, `${third}: на кольцо хватает без дополнительного фарма`);
    const beforeRing = state.coins;
    assert.equal(buyItem(state, 'rng_health').ok, true);
    assert.equal(state.coins, beforeRing - 80);
  }
});
