// Нормативная экономика игры. Запуск: node tools/sim-economy.mjs [сценарий] [параметр]
// Сценарии: new, favorite-type [gift|fate|spin], mixed, battle [battleId], shopping, all.
import {
  ALL_PUZZLES, newGame, runBattle,
} from '../src/core/state.js';
import {
  puzzleCoinReward, battleCoinReward, battleEconomy, coinsPerMinute,
} from '../src/core/economy.js';
import { BATTLES, BATTLE_BY_ID } from '../src/data/battles.js';
import { ENEMY_BY_ID } from '../src/data/enemies.js';
import { SHOP_STOCK, pricedShopItem } from '../src/data/shop.js';
import { COMPANION_BY_ID, PET_BY_ID, MERC_BY_ID } from '../src/data/crew.js';
import { COSMETICS } from '../src/data/cosmetics.js';
import { RECIPES } from '../src/data/recipes.js';
import { battleEnergyCost } from '../src/core/energy.js';
import { BATTLE_ENERGY_CAP, BATTLE_ENERGY_PER_DAY } from '../src/data/energy.js';
import { BOSS_DROPS } from '../src/data/bossDrops.js';
import { ITEM_BY_ID } from '../src/data/items.js';
import { bossDropChance, BOSS_DROP_PITY_WINS } from '../src/core/bossDrops.js';

const sum = (items, fn) => items.reduce((total, item) => total + fn(item), 0);
const fmt = (value) => Math.round(value).toLocaleString('ru-RU');
const decimal = (value) => value.toFixed(2).replace('.', ',');
const minutes = (seconds) => `${decimal(seconds / 60)} мин`;

function percentile(values, q) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const position = (sorted.length - 1) * q;
  const low = Math.floor(position);
  const high = Math.ceil(position);
  return sorted[low] + (sorted[high] - sorted[low]) * (position - low);
}

function puzzleProfile(levels, repeat = false) {
  const coins = sum(levels, (p) => puzzleCoinReward(p, { repeat }));
  const seconds = sum(levels, (p) => repeat ? p.economy.expectedRepeatSeconds : p.economy.expectedFirstSeconds);
  return { count: levels.length, coins, seconds, perMinute: seconds ? coins * 60 / seconds : 0 };
}

function battleProfile(battles) {
  const coins = sum(battles, (b) => battleCoinReward(b));
  const seconds = sum(battles, (b) => battleEconomy(b).expectedFirstSeconds);
  return { count: battles.length, coins, seconds, perMinute: seconds ? coins * 60 / seconds : 0 };
}

function printProfile(label, profile) {
  console.log(`${label}: ${profile.count} прохождений · ${fmt(profile.coins)} монет · ${minutes(profile.seconds)} · ${decimal(profile.perMinute)} монет/мин`);
}

function scenarioNew() {
  console.log('\n=== Новый сейв: только первые прохождения ===');
  printProfile('Головоломки', puzzleProfile(ALL_PUZZLES));
  printProfile('Бои (победы)', battleProfile(BATTLES));
  for (let tier = 0; tier <= 5; tier++) {
    const levels = ALL_PUZZLES.filter((p) => p.economy.tier === tier);
    printProfile(`  Ярус ${tier}, v=${coinsPerMinute(tier)}`, puzzleProfile(levels));
  }
}

function scenarioFavorite(requested) {
  const types = requested ? [requested] : ['gift', 'fate', 'spin'];
  for (const type of types) {
    const levels = ALL_PUZZLES.filter((p) => (p.mechanic || 'mirror') === type);
    if (levels.length === 0) {
      console.log(`Неизвестный тип «${type}». Доступны: gift, fate, spin.`);
      continue;
    }
    console.log(`\n=== Любимый тип: ${type} ===`);
    printProfile('Первые', puzzleProfile(levels));
    printProfile('Повторные', puzzleProfile(levels, true));
  }
}

function scenarioMixed() {
  const types = ['gift', 'fate', 'spin', 'brew', 'mirror'];
  const selected = [];
  for (let round = 0; round < 6; round++) {
    for (const type of types) {
      const levels = ALL_PUZZLES.filter((p) => (p.mechanic || 'mirror') === type);
      selected.push(levels[round]);
    }
  }
  const firstCoins = sum(selected, (p) => puzzleCoinReward(p));
  const repeatCoins = sum(selected, (p) => puzzleCoinReward(p, { repeat: true }));
  const firstSeconds = sum(selected, (p) => p.economy.expectedFirstSeconds);
  const repeatSeconds = sum(selected, (p) => p.economy.expectedRepeatSeconds);
  const coins = firstCoins + repeatCoins;
  const seconds = firstSeconds + repeatSeconds;
  console.log('\n=== Смешанная сессия: 30 первых + те же 30 повторных ===');
  console.log(`Типы: ${types.join(', ')} · ${selected.length * 2} прохождений`);
  console.log(`${fmt(coins)} монет · ${minutes(seconds)} · ${decimal(coins * 60 / seconds)} монет/мин`);
  console.log(`Первые: ${fmt(firstCoins)} · повторные: ${fmt(repeatCoins)} · детерминированно, p50 = p90`);
}

function printBossDropForecast(battleId) {
  const drop = BOSS_DROPS[battleId];
  if (!drop) return;
  let survival = 1;
  let cumulative = 0;
  let mean = 0;
  let p50 = null;
  let p90 = null;
  for (let win = 1; win <= BOSS_DROP_PITY_WINS; win++) {
    const chance = bossDropChance(win - 1, 0);
    const probability = survival * chance;
    mean += win * probability;
    cumulative += probability;
    if (p50 === null && cumulative >= 0.5) p50 = win;
    if (p90 === null && cumulative >= 0.9) p90 = win;
    survival *= 1 - chance;
  }
  console.log(`Редкая находка «${ITEM_BY_ID[drop.itemId].name}»: старт ${Math.round(bossDropChance(0) * 100)}%, +2 п.п. за dry, гарантия на ${BOSS_DROP_PITY_WINS}-й наградной победе.`);
  console.log(`Точное распределение с pity (itemFind = 0): ожидание ${decimal(mean)} наградных побед · p50 ${p50} · p90 ${p90}; это не геометрическая оценка без гарантии.`);
}

function scenarioBattle(battleId = 'bt_slimes') {
  const battle = BATTLE_BY_ID[battleId];
  if (!battle) {
    console.log(`Бой «${battleId}» не найден.`);
    return;
  }
  const economy = battleEconomy(battle);
  const attempts = [];
  for (let seed = 1; seed <= 24; seed++) {
    const state = newGame();
    state.coins = 0;
    for (const id of Object.keys(BATTLE_BY_ID)) state.battlesDone[id] = { victories: 1 };
    state.battlesDone[battleId] = { victories: 1 };
    // Энергия не отключена: каждый независимый seed оплачивает один repeat.
    const result = runBattle(state, battleId, seed);
    attempts.push(result?.victory
      ? sum(result.rewards.filter((r) => r.type === 'coins'), (r) => r.amount)
      : 0);
  }
  const wins = attempts.filter((coins) => coins > 0).length;
  const mean = sum(attempts, (coins) => coins) / attempts.length;
  const p50 = percentile(attempts, 0.5);
  const p90 = percentile(attempts, 0.9);
  const expected = battleCoinReward(battle, { repeat: true });
  const energyCost = battleEnergyCost(battle, true);
  const reserveWins = Math.floor(BATTLE_ENERGY_CAP / energyCost);
  const dailyWins = Math.floor((BATTLE_ENERGY_CAP + BATTLE_ENERGY_PER_DAY) / energyCost);
  console.log(`\n=== Боевой фарм: ${battleId}, повтор, 24 фактических seed ===`);
  console.log(`Побед ${wins}/24 · награда за победу по модели ${expected} · среднее ${decimal(mean)} монет`);
  console.log(`p50 ${decimal(p50)} · p90 ${decimal(p90)} монет за попытку (поражение = 0)`);
  console.log(`Нормативное повторное время ${economy.expectedRepeatSeconds} с: среднее ${decimal(mean * 60 / economy.expectedRepeatSeconds)}, p50 ${decimal(p50 * 60 / economy.expectedRepeatSeconds)}, p90 ${decimal(p90 * 60 / economy.expectedRepeatSeconds)} монет/мин`);
  console.log(`Энергия: ${energyCost} за наградную победу · серия из полного запаса ${reserveWins} · максимум ${dailyWins} за сутки при своевременной трате запаса и ${BATTLE_ENERGY_PER_DAY} восстановленных единиц.`);
  console.log('Поражения бесплатны; после исчерпания энергии доступна practice с нулём монет, материалов, pity и прогресса. Редкие предметы не переводятся в монеты.');
  printBossDropForecast(battleId);
}

function oneTimeStocks() {
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
  return { shop, consumables, crew, cosmetics, craft, total: shop + consumables + crew + cosmetics + craft };
}

function budget() {
  const puzzleCoins = sum(ALL_PUZZLES, (p) => puzzleCoinReward(p));
  const battleCoins = sum(BATTLES, (b) => battleCoinReward(b));
  const stocks = oneTimeStocks();
  const puzzleSeals = sum(ALL_PUZZLES, (p) => sum(p.rewards.filter((r) => r.type === 'seals'), (r) => r.amount));
  const battleSeals = sum(BATTLES, (battle) => sum(battle.enemies, (entry) => {
    const id = typeof entry === 'string' ? entry : entry.id;
    return ENEMY_BY_ID[id]?.reward?.seals || 0;
  }));
  const itemSeals = sum(Object.values({ ...COMPANION_BY_ID, ...PET_BY_ID, ...MERC_BY_ID }),
    (def) => def.currency === 'seals' ? def.price : 0);
  const gearSeals = sum(Object.values(SHOP_STOCK.map(pricedShopItem)), (item) => item.sealPrice || 0);
  const cosmeticSeals = sum(COSMETICS, (def) => def.sealPrice || 0);
  return {
    puzzleCoins, battleCoins, totalCoins: puzzleCoins + battleCoins, stocks,
    puzzleSeals, battleSeals, sealStock: itemSeals + gearSeals + cosmeticSeals,
  };
}

function battleChainSeconds(unlockAfter) {
  const seen = new Set();
  let current = unlockAfter;
  let seconds = 0;
  while (current && !seen.has(current)) {
    seen.add(current);
    const battle = BATTLE_BY_ID[current];
    if (!battle) break;
    seconds += battleEconomy(battle).expectedFirstSeconds;
    current = battle.unlockAfter;
  }
  return seconds;
}

function printGoal(label, unlockAfter, price, tier = 0) {
  const unlock = unlockAfter ? `${unlockAfter}, цепочка ${minutes(battleChainSeconds(unlockAfter))}` : 'доступно сразу';
  const earn = price / coinsPerMinute(tier);
  console.log(`  ${label}: ${unlock} · цена ${fmt(price)} · накопление ${decimal(earn)} мин при v(${tier})`);
}

function scenarioShopping() {
  const report = budget();
  const { stocks } = report;
  console.log('\n=== Первые доходы и разовые стоки ===');
  console.log(`Головоломки ${fmt(report.puzzleCoins)} · бои ${fmt(report.battleCoins)} · всего ${fmt(report.totalCoins)}`);
  console.log(`Магазин ${fmt(stocks.shop)} · расходники ${fmt(stocks.consumables)} · крафт ${fmt(stocks.craft)} · команда ${fmt(stocks.crew)} · косметика ${fmt(stocks.cosmetics)} · всего ${fmt(stocks.total)}`);
  console.log(`Доход/сток ${decimal(report.totalCoins / stocks.total)} · доля магазина в стоках ${decimal(stocks.shop * 100 / stocks.total)}%`);
  console.log(`Печати ${report.puzzleSeals + report.battleSeals}/${report.sealStock} = ${decimal((report.puzzleSeals + report.battleSeals) / report.sealStock)} (головоломки ${report.puzzleSeals}, боссы ${report.battleSeals})`);

  console.log('\n=== Стратегии покупки: сила / команда / косметика ===');
  for (const [name, stock] of [['сила', stocks.shop], ['команда', stocks.crew], ['косметика', stocks.cosmetics]]) {
    console.log(`  ${name}: сток ${fmt(stock)} (${decimal(stock * 100 / report.totalCoins)}% первого дохода) · остаток после полной покупки ${fmt(report.totalCoins - stock)}`);
  }

  console.log('\n=== Цели по unlockAfter (только нормативное время боевой цепочки) ===');
  for (const id of ['bt_path', 'rng_health', 'wpn_oak_mace', 'wpn_swamp_sickle']) {
    const entry = SHOP_STOCK.find((candidate) => candidate.itemId === id);
    const item = pricedShopItem(entry);
    printGoal(item.name, entry.unlockAfter, item.price, entry.tier);
  }
  const archer = MERC_BY_ID.merc_archer;
  printGoal(archer.name, 'bt_bees', archer.price, battleEconomy(BATTLE_BY_ID.bt_bees).tier);
}

const scenario = process.argv[2] || 'all';
const parameter = process.argv[3];
console.log('ЭКОНОМИКА: нормативное время, не фактическое ожидание игрока');
if (scenario === 'new') scenarioNew();
else if (scenario === 'favorite-type') scenarioFavorite(parameter);
else if (scenario === 'mixed') scenarioMixed();
else if (scenario === 'battle') scenarioBattle(parameter);
else if (scenario === 'shopping') scenarioShopping();
else if (scenario === 'all') {
  scenarioNew();
  scenarioFavorite();
  scenarioMixed();
  scenarioBattle(parameter);
  scenarioShopping();
} else {
  console.log(`Неизвестный сценарий «${scenario}». Используй: new, favorite-type, mixed, battle, shopping, all.`);
  process.exitCode = 1;
}
