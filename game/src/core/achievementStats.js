import { BOSS_DROPS } from '../data/bossDrops.js';
import { collectStats } from './items.js';

export function newAchievementStats() {
  return {
    version: 1,
    counters: {},
    puzzles: {},
    battles: {},
    daily: { days: [], currentStreak: 0, bestStreak: 0 },
    craftedRecipes: [],
    boughtItems: [],
    guestTopics: {},
    setTiers: {},
  };
}

export function ensureAchievementStats(state) {
  const stats = state.achievementStats;
  if (!stats || typeof stats !== 'object' || Array.isArray(stats)) {
    state.achievementStats = newAchievementStats();
    return state.achievementStats;
  }
  stats.version = 1;
  stats.counters = stats.counters && typeof stats.counters === 'object' && !Array.isArray(stats.counters)
    ? stats.counters : {};
  stats.puzzles = stats.puzzles && typeof stats.puzzles === 'object' && !Array.isArray(stats.puzzles)
    ? stats.puzzles : {};
  stats.battles = stats.battles && typeof stats.battles === 'object' && !Array.isArray(stats.battles)
    ? stats.battles : {};
  stats.daily = stats.daily && typeof stats.daily === 'object' && !Array.isArray(stats.daily)
    ? stats.daily : { days: [], currentStreak: 0, bestStreak: 0 };
  stats.daily.days = Array.isArray(stats.daily.days) ? stats.daily.days : [];
  stats.daily.currentStreak = Number.isFinite(stats.daily.currentStreak) ? stats.daily.currentStreak : 0;
  stats.daily.bestStreak = Number.isFinite(stats.daily.bestStreak) ? stats.daily.bestStreak : 0;
  for (const key of ['craftedRecipes', 'boughtItems']) {
    stats[key] = Array.isArray(stats[key]) ? stats[key] : [];
  }
  stats.guestTopics = stats.guestTopics && typeof stats.guestTopics === 'object' && !Array.isArray(stats.guestTopics)
    ? stats.guestTopics : {};
  stats.setTiers = stats.setTiers && typeof stats.setTiers === 'object' && !Array.isArray(stats.setTiers)
    ? stats.setTiers : {};
  return stats;
}

function addUnique(list, value) {
  if (!list.includes(value)) list.push(value);
}

function puzzleRecord(stats, id) {
  const rec = stats.puzzles[id] ||= { solves: 0, skipped: false, feats: [] };
  rec.solves = Number.isFinite(rec.solves) ? rec.solves : 0;
  rec.skipped = rec.skipped === true;
  rec.feats = Array.isArray(rec.feats) ? rec.feats : [];
  return rec;
}

function battleRecord(stats, id) {
  const rec = stats.battles[id] ||= { attempts: 0, defeats: 0, feats: [] };
  rec.attempts = Number.isFinite(rec.attempts) ? rec.attempts : 0;
  rec.defeats = Number.isFinite(rec.defeats) ? rec.defeats : 0;
  rec.feats = Array.isArray(rec.feats) ? rec.feats : [];
  return rec;
}

function addFeat(rec, feat) {
  addUnique(rec.feats, feat);
}

function dayNumber(day) {
  return Date.parse(`${day}T00:00:00Z`) / 86400000;
}

function recordDaily(stats, day) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day || '') || !Number.isFinite(dayNumber(day))) return;
  if (stats.daily.days.includes(day)) return;
  stats.daily.days.push(day);
  stats.daily.days.sort();
  let best = 0;
  let streak = 0;
  let previous = null;
  for (const value of stats.daily.days) {
    const current = dayNumber(value);
    streak = previous !== null && current - previous === 1 ? streak + 1 : 1;
    best = Math.max(best, streak);
    previous = current;
  }
  stats.daily.bestStreak = Math.max(stats.daily.bestStreak, best);
  const latest = stats.daily.days.at(-1);
  stats.daily.currentStreak = 1;
  for (let i = stats.daily.days.length - 1; i > 0; i -= 1) {
    if (dayNumber(stats.daily.days[i]) - dayNumber(stats.daily.days[i - 1]) !== 1) break;
    stats.daily.currentStreak += 1;
  }
  if (latest !== day) {
    const latestTime = dayNumber(latest);
    const givenTime = dayNumber(day);
    if (latestTime - givenTime > 0) {
      stats.daily.currentStreak = 1;
      for (let i = stats.daily.days.indexOf(day); i > 0; i -= 1) {
        if (dayNumber(stats.daily.days[i]) - dayNumber(stats.daily.days[i - 1]) !== 1) break;
        stats.daily.currentStreak += 1;
      }
    }
  }
}

export function recordPuzzleSkip(state, puzzleId) {
  const stats = ensureAchievementStats(state);
  puzzleRecord(stats, puzzleId).skipped = true;
}

export function recordPuzzleCompletion(state, puzzle, info = {}, options = {}) {
  const stats = ensureAchievementStats(state);
  const rec = puzzleRecord(stats, puzzle.id);
  const meta = info.achievement || {};
  rec.solves += 1;
  if (info.hintsUsed === 0) addFeat(rec, 'no_hints');
  if (rec.skipped) addFeat(rec, 'skip_comeback');

  switch (puzzle.mechanic || 'mirror') {
    case 'riddle':
      if (meta.attempts === 1) addFeat(rec, 'riddle_first_try');
      break;
    case 'hang':
      if (meta.mistakes === 0 && meta.spoiled === 0) addFeat(rec, 'hang_perfect');
      break;
    case 'brew':
      if (meta.totalMistakes === 0 && meta.spoiled === 0) addFeat(rec, 'brew_flawless');
      if (puzzle.hideRecipe && meta.bookOpen === false) addFeat(rec, 'brew_memory');
      if ((meta.spoiled || 0) > 0) addFeat(rec, 'brew_recovery');
      break;
    case 'fate':
      if (meta.mistakes === 0) addFeat(rec, 'fate_perfect');
      break;
    case 'gift':
      if (meta.tries === 0) addFeat(rec, 'gift_first_try');
      if (meta.tries === 2) addFeat(rec, 'gift_third_try');
      if ((meta.departures || 0) > 0) addFeat(rec, 'gift_recovery');
      break;
    case 'tea':
      if (meta.exact === true) addFeat(rec, 'tea_exact');
      break;
    case 'candle':
      if (Number.isInteger(meta.minimum) && meta.placed === meta.minimum) addFeat(rec, 'candle_minimum');
      break;
    case 'spin':
      if (Number.isFinite(meta.par) && info.moves <= meta.par && info.hintsUsed === 0) addFeat(rec, 'spin_par');
      break;
    case 'seek':
      if (meta.misses === 0 && info.hintsUsed === 0) addFeat(rec, 'seek_no_miss');
      break;
    case 'seating':
      if (meta.failedServes === 0) addFeat(rec, 'seating_first_serve');
      break;
    default:
      break;
  }
  if (options.isDaily) recordDaily(stats, options.day);
  return rec;
}

export function recordBattleResult(state, battle, result, context = {}) {
  if (!battle?.id || !result || result.practice || context.practice) return null;
  const stats = ensureAchievementStats(state);
  const rec = battleRecord(stats, battle.id);
  const report = result.report || {};
  const victory = result.victory === true || report.victory === true;
  const allies = Array.isArray(report.alliesStats) ? report.alliesStats : [];
  const isBoss = !!BOSS_DROPS[battle.id];
  rec.attempts += 1;
  stats.counters.battleEnergySpent = (stats.counters.battleEnergySpent || 0) + (result.energySpent || 0);

  if (!victory) {
    rec.defeats += 1;
    stats.counters.battleDefeats = (stats.counters.battleDefeats || 0) + 1;
    if (report.timedOut) addFeat(rec, 'timeout');
    return rec;
  }

  if (rec.defeats > 0) addFeat(rec, 'battle_comeback');
  const noDamage = allies.length > 0 && allies.every((ally) => (ally.taken || 0) === 0);
  const allSurvive = Array.isArray(report.alliesDown) && report.alliesDown.length === 0;
  if (noDamage) addFeat(rec, 'battle_no_damage');
  if (noDamage && isBoss) addFeat(rec, 'boss_no_damage');
  if (allSurvive && isBoss) addFeat(rec, 'boss_all_survive');
  if (context.mercs === 0) addFeat(rec, 'battle_solo');
  if (isBoss && (context.usedConsumables || []).length === 0) addFeat(rec, 'boss_no_consumables');
  if (report.knightHpLeft === 1) addFeat(rec, 'battle_one_hp');
  if (report.knightHpLeft === 0 && context.mercs > 0) addFeat(rec, 'merc_last_stand');
  if (/_crowd_6$/.test(battle.id) && report.foesTotal === 6 && allSurvive
    && context.companions === 3 && context.mercs === 2 && context.pet) addFeat(rec, 'full_party_crowd');
  if (result.bossDrop?.dropped && result.bossDrop?.guaranteed) {
    addFeat(rec, 'boss_pity');
    stats.counters.bossPityDrops = (stats.counters.bossPityDrops || 0) + 1;
  }
  return rec;
}

export function recordShopPurchase(state, itemId) {
  addUnique(ensureAchievementStats(state).boughtItems, itemId);
}

export function recordCraft(state, recipeId) {
  addUnique(ensureAchievementStats(state).craftedRecipes, recipeId);
}

export function recordMaterialExchange(state) {
  const stats = ensureAchievementStats(state);
  stats.counters.materialExchanges = (stats.counters.materialExchanges || 0) + 1;
}

export function recordSavingsGoal(state) {
  const stats = ensureAchievementStats(state);
  stats.counters.savingsGoals = (stats.counters.savingsGoals || 0) + 1;
}

export function recordEquipmentSets(state) {
  const stats = ensureAchievementStats(state);
  for (const active of collectStats(state.equipped).activeSets) {
    stats.setTiers[active.set] = Math.max(stats.setTiers[active.set] || 0, active.tier);
  }
}

export function recordGuestTopic(state, guestId, topicIndex) {
  if (!guestId || !Number.isInteger(topicIndex) || topicIndex < 0) return false;
  const stats = ensureAchievementStats(state);
  const topics = stats.guestTopics[guestId] ||= [];
  if (!Array.isArray(topics)) return false;
  if (topics.includes(topicIndex)) return false;
  topics.push(topicIndex);
  topics.sort((a, b) => a - b);
  return true;
}

export function recordSeasonalCosmetic(state, pack, season) {
  if (!pack?.season || pack.season !== season) return false;
  const stats = ensureAchievementStats(state);
  stats.counters.seasonalCosmeticSelections = (stats.counters.seasonalCosmeticSelections || 0) + 1;
  return true;
}
