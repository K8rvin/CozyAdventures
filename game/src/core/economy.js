// Чистая нормативная экономика: никакого DOM, реального времени и состояния сейва.
import {
  PUZZLE_TYPE_ECONOMY, PUZZLE_ECONOMY_OVERRIDES,
  WORLD_ECONOMY_TIER, BATTLE_ECONOMY_OVERRIDES,
  PRICE_TARGET_MINUTES, ITEM_PRICE_OVERRIDES, SHOP_UNLOCK_ORDER,
  PUZZLE_REPEAT_FACTOR, BATTLE_REPEAT_FACTOR, DAILY_COIN_FACTOR,
  BOSS_COIN_MULTIPLIER, WANTED_COIN_MULTIPLIER, FIRST_COMPLETION_SECONDS,
} from '../data/economy.js';
import { ENEMY_BY_ID } from '../data/enemies.js';

export function clampTier(tier) {
  return Math.max(0, Math.min(5, Math.floor(Number(tier) || 0)));
}

export function coinsPerMinute(tier) {
  return 20 + 4 * clampTier(tier);
}

export function round5(value) {
  return Math.max(5, Math.round(value / 5) * 5);
}

export function puzzleTypeOf(puzzle) {
  return puzzle?.mechanic || 'mirror';
}

function gridCells(puzzle) {
  return Array.isArray(puzzle.grid) ? puzzle.grid[0] * puzzle.grid[1] : 0;
}

function letterCount(value) {
  return String(value || '').replaceAll('✦', '').replaceAll(' ', '').length;
}

function recipeLength(recipe) {
  return (recipe || []).reduce((sum, step) => sum + (step.times || 1), 0);
}

// Единая контентная метрика для defaults. Явные expected*Seconds всегда важнее.
export function puzzleContentMetric(puzzle) {
  const type = puzzleTypeOf(puzzle);
  if (type === 'riddle' || type === 'hang') return letterCount(puzzle.answer);
  if (type === 'seek') {
    return (puzzle.groups || []).reduce((sum, group) => sum + (group.spots?.length || 0), 0);
  }
  if (type === 'brew') {
    return recipeLength(puzzle.recipe) + (puzzle.ingredients?.length || 0) * 0.25;
  }
  if (type === 'fate') return (puzzle.story?.length || 0) + (puzzle.hand?.length || 0) * 0.5;
  if (type === 'gift') {
    const showcase = puzzle.shelf || puzzle.showcase || puzzle.display || puzzle.items || [];
    return (puzzle.story?.length || 0) + showcase.length * 0.5;
  }
  if (type === 'seating') return (puzzle.guests?.length || 0) + Object.keys(puzzle.fixed || {}).length;
  if (type === 'glass' || type === 'spin') return gridCells(puzzle);
  if (type === 'mirror') {
    const objects = (puzzle.objects || []).filter((o) => ['mirror', 'lantern', 'moth'].includes(o.type)).length;
    return objects + gridCells(puzzle) / 8;
  }
  if (type === 'shelf') {
    const items = puzzle.items || puzzle.goods || [];
    return items.length + gridCells(puzzle) / 4;
  }
  if (type === 'tea') return (puzzle.orders || puzzle.recipe || puzzle.ingredients || []).length;
  return gridCells(puzzle) / 4
    + (puzzle.objects || puzzle.nodes || puzzle.lanterns || puzzle.customers || puzzle.tiles || []).length;
}

export function puzzleEconomy(puzzle, context = {}) {
  const own = puzzle.economy || {};
  const override = PUZZLE_ECONOMY_OVERRIDES[puzzle.id] || {};
  const type = puzzleTypeOf(puzzle);
  const profile = PUZZLE_TYPE_ECONOMY[type] || PUZZLE_TYPE_ECONOMY.custom;
  const difficulty = Math.max(1, puzzle.difficulty || 1);
  const metric = Math.max(0, puzzleContentMetric(puzzle));
  const computedFirst = FIRST_COMPLETION_SECONDS + profile.first + difficulty * profile.difficulty + metric * profile.metric;
  const computedRepeat = profile.repeat + difficulty * profile.repeatDifficulty + metric * profile.repeatMetric;
  const tier = clampTier(own.tier ?? puzzle.economyTier ?? context.tier ?? (difficulty - 1));
  return {
    tier,
    order: own.order ?? context.order ?? 0,
    finale: own.finale ?? context.finale ?? false,
    expectedFirstSeconds: own.expectedFirstSeconds ?? puzzle.expectedFirstSeconds
      ?? override.expectedFirstSeconds ?? Math.max(15, Math.round(computedFirst)),
    expectedRepeatSeconds: own.expectedRepeatSeconds ?? puzzle.expectedRepeatSeconds
      ?? override.expectedRepeatSeconds ?? Math.max(60, Math.round(computedRepeat)),
  };
}

export function puzzleCoinReward(puzzle, { repeat = false, factor = 1, daily = false } = {}) {
  const economy = puzzleEconomy(puzzle);
  const seconds = repeat ? economy.expectedRepeatSeconds : economy.expectedFirstSeconds;
  const repeatFactor = repeat ? PUZZLE_REPEAT_FACTOR : 1;
  const playFactor = repeat ? Math.min(1, Math.max(0, factor)) : Math.max(0, factor);
  const amount = Math.max(1, Math.round(coinsPerMinute(economy.tier) * seconds / 60 * repeatFactor * playFactor));
  // Daily удваивает фактическую целую награду игрока, без второго округления.
  return daily ? amount * DAILY_COIN_FACTOR : amount;
}

export function puzzleRewards(puzzle, options = {}) {
  const rewards = [{ type: 'coins', amount: puzzleCoinReward(puzzle, options) }];
  if (options.repeat) return rewards;
  const economy = puzzleEconomy(puzzle);
  const items = (puzzle.rewards || []).filter((r) => r.type !== 'coins' && r.type !== 'seals');
  rewards.push(...items.map((r) => ({ ...r })));
  if (economy.finale) rewards.push({ type: 'seals', amount: 1 });
  return rewards;
}

export function derivePuzzle(puzzle, context = {}) {
  const economy = puzzleEconomy(puzzle, context);
  const derived = { ...puzzle, economy };
  return { ...derived, rewards: puzzleRewards(derived) };
}

// Производный слой кампании: tier/order/finale вычисляются один раз для всех
// типов, исходные файлы уровней и их валидаторы не переписываются.
export function derivePuzzleCatalog(levels) {
  const groups = new Map();
  for (const puzzle of levels) {
    const type = puzzleTypeOf(puzzle);
    if (!groups.has(type)) groups.set(type, []);
    groups.get(type).push(puzzle);
  }
  const contextById = new Map();
  for (const group of groups.values()) {
    group.forEach((puzzle, index) => {
      contextById.set(puzzle.id, {
        tier: Math.min(5, Math.floor(index * 6 / group.length)),
        order: index,
        finale: index === group.length - 1,
      });
    });
  }
  return levels.map((puzzle) => derivePuzzle(puzzle, contextById.get(puzzle.id)));
}

export function puzzleSkipTerms(puzzle) {
  const firstCoins = puzzleCoinReward(puzzle);
  return {
    price: Math.max(50, Math.ceil(firstCoins * 1.5)),
    consolation: Math.max(1, Math.floor(firstCoins / 3)),
  };
}

function battleEntries(battle) {
  return (battle.enemies || []).map((entry) => (
    typeof entry === 'string' ? { id: entry, scale: 1 } : { scale: 1, ...entry }
  ));
}

export function battleEconomy(battle) {
  const own = battle.economy || {};
  const override = BATTLE_ECONOMY_OVERRIDES[battle.id] || {};
  const entries = battleEntries(battle);
  let power = 0;
  let boss = false;
  for (const entry of entries) {
    const def = ENEMY_BY_ID[entry.id];
    if (!def) continue;
    const scale = entry.scale || 1;
    power += (def.hp + def.armor * 3 + def.attack * 4) * scale;
    boss ||= !!def.boss;
  }
  const computedFirst = Math.max(45, Math.round(FIRST_COMPLETION_SECONDS + 45 + power / 6));
  const expectedFirstSeconds = own.expectedFirstSeconds ?? battle.expectedFirstSeconds
    ?? override.expectedFirstSeconds ?? computedFirst;
  return {
    tier: clampTier(own.tier ?? battle.economyTier ?? WORLD_ECONOMY_TIER[battle.world] ?? 0),
    expectedFirstSeconds,
    expectedRepeatSeconds: own.expectedRepeatSeconds ?? battle.expectedRepeatSeconds
      ?? override.expectedRepeatSeconds ?? Math.max(30, Math.round(expectedFirstSeconds * 0.75)),
    bossMultiplier: own.bossMultiplier ?? battle.bossMultiplier
      ?? (boss ? BOSS_COIN_MULTIPLIER : battle.wanted ? WANTED_COIN_MULTIPLIER : 1),
    power,
  };
}

export function battleCoinReward(battle, { repeat = false, goldFind = 0 } = {}) {
  const economy = battleEconomy(battle);
  const base = coinsPerMinute(economy.tier) * economy.expectedFirstSeconds / 60 * economy.bossMultiplier;
  const repeatFactor = repeat ? BATTLE_REPEAT_FACTOR : 1;
  // goldFind и округление применяются ровно один раз к итогу боя.
  return Math.max(1, Math.round(base * repeatFactor * (1 + goldFind)));
}

export function itemPrice(item, { tier = 0 } = {}) {
  if (!item || item.sealPrice) return 0;
  const override = ITEM_PRICE_OVERRIDES[item.id];
  if (override !== undefined) return override;
  const kind = item.slot === 'consumable' ? 'consumable' : item.rarity || 'common';
  const minutes = PRICE_TARGET_MINUTES[kind] || PRICE_TARGET_MINUTES.common;
  return round5(coinsPerMinute(tier) * minutes);
}

export function shopUnlockOrder(unlockAfter) {
  const index = SHOP_UNLOCK_ORDER.indexOf(unlockAfter ?? null);
  return index >= 0 ? index : SHOP_UNLOCK_ORDER.length;
}
