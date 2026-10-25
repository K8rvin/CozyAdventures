// Редкие находки боссов: независимый ГСЧ, личный pity и защита коллекции от дублей.
import { BOSS_DROPS } from '../data/bossDrops.js';
import { ENEMY_BY_ID } from '../data/enemies.js';
import { COMPANION_BY_ID, PET_BY_ID } from '../data/crew.js';
import { collectStats } from './items.js';
import { makeRng } from './rng.js';

export const BOSS_DROP_BASE_CHANCE = 0.05;
export const BOSS_DROP_DRY_STEP = 0.02;
export const BOSS_DROP_PITY_WINS = 12;
export const BOSS_DROP_ITEM_FIND_CAP = 0.05;

export function isBossDropBattle(battle) {
  return (battle?.enemies || []).some((entry) => {
    const id = typeof entry === 'string' ? entry : entry.id;
    return !!ENEMY_BY_ID[id]?.boss;
  }) && !!BOSS_DROPS[battle.id];
}

export function bossDropChance(dry = 0, itemFind = 0) {
  const misses = Math.max(0, Math.floor(Number(dry) || 0));
  if (misses >= BOSS_DROP_PITY_WINS - 1) return 1;
  const findBonus = Math.min(BOSS_DROP_ITEM_FIND_CAP, Math.max(0, Number(itemFind) || 0));
  return Math.min(1, BOSS_DROP_BASE_CHANCE + misses * BOSS_DROP_DRY_STEP + findBonus);
}

function hashSeed(text) {
  let hash = 2166136261;
  for (const char of text) hash = Math.imul(hash ^ char.codePointAt(0), 16777619);
  return hash >>> 0;
}

// Номер победы отличает попытки; боевой лог и его длина в формулу не входят.
export function bossDropRoll(battleId, victory, battleSeed) {
  return makeRng(hashSeed(`${battleId}|${victory}|${battleSeed}`)).next();
}

export function battleItemFind(state) {
  let itemFind = collectStats(state.equipped || {}).stats.itemFind || 0;
  for (const id of state.squadCompanions || []) {
    itemFind += COMPANION_BY_ID[id]?.bonus?.itemFind || 0;
  }
  itemFind += PET_BY_ID[state.pet]?.bonus?.itemFind || 0;
  return itemFind;
}

function ownsItem(state, itemId) {
  return (state.inventory || []).includes(itemId)
    || (state.consumableBelt || []).includes(itemId)
    || Object.values(state.equipped || {}).includes(itemId);
}

export function bossDropStatus(state, battle, itemFind = battleItemFind(state)) {
  if (!isBossDropBattle(battle)) return null;
  const saved = state.bossDrops?.[battle.id] || {};
  const dry = Math.max(0, Math.min(BOSS_DROP_PITY_WINS - 1, Math.floor(saved.dry || 0)));
  const collected = !!saved.collected || ownsItem(state, BOSS_DROPS[battle.id].itemId);
  const chance = bossDropChance(dry, itemFind);
  return {
    battleId: battle.id,
    itemId: BOSS_DROPS[battle.id].itemId,
    chance,
    dry,
    dryAfter: dry,
    remaining: collected ? 0 : BOSS_DROP_PITY_WINS - dry,
    guaranteed: dry >= BOSS_DROP_PITY_WINS - 1,
    collected,
    dropped: false,
    roll: null,
  };
}

// Вызывается только для настоящей наградной победы. dry в результате — число
// неудач ДО этой попытки; dryAfter позволяет показать следующий шанс без пересчёта.
export function rollBossDrop(state, battle, { victory, seed, itemFind = battleItemFind(state) } = {}) {
  const status = bossDropStatus(state, battle, itemFind);
  if (!status || status.collected) return status;

  const roll = bossDropRoll(battle.id, victory, seed);
  const dropped = roll < status.chance;
  const dryAfter = dropped ? 0 : Math.min(BOSS_DROP_PITY_WINS - 1, status.dry + 1);
  state.bossDrops ||= {};
  state.bossDrops[battle.id] = {
    ...(state.bossDrops[battle.id] || {}),
    dry: dryAfter,
    collected: dropped,
  };
  return {
    ...status,
    dropped,
    collected: dropped,
    dryAfter,
    remaining: dropped ? 0 : BOSS_DROP_PITY_WINS - dryAfter,
    roll,
  };
}
