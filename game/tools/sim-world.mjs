// Баланс мира: 24 seed на бой, четыре независимые progression-модели.
// Запуск: node tools/sim-world.mjs <worldId> [minWinrate%] [endgame|available|reasonable|upgrade|all]
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { WORLDS } from '../src/data/worlds/index.js';
import {
  newGame, runBattle, addCoins, shopStock, buyItem, autoEquipBest,
  crewStock, hireCrew, toggleCompanion, toggleMerc, setPet, equipFromInventory,
} from '../src/core/state.js';
import { BATTLES, BATTLE_BY_ID } from '../src/data/battles.js';
import { ENEMY_BY_ID } from '../src/data/enemies.js';
import { ITEM_BY_ID } from '../src/data/items.js';
import { RECIPES } from '../src/data/recipes.js';
import { BOSS_DROPS } from '../src/data/bossDrops.js';
import { COMPANION_BY_ID, PET_BY_ID, MERC_BY_ID } from '../src/data/crew.js';
import { battleCoinReward } from '../src/core/economy.js';
import { collectStats, itemScore, isShieldBlocked } from '../src/core/items.js';

const SEEDS = 24;
const PROFILES = ['endgame', 'available', 'reasonable', 'upgrade'];
const CREW_PRIORITY = ['merc_archer', 'merc_guard', 'cmp_herbalist'];
const PROFILE_LABEL = {
  endgame: 'эндгейм-билд, как раньше',
  available: 'верхняя граница открытого не-seal снаряжения и команды, не путь игрока',
  reasonable: 'первая нормативная монетная награда и консервативный buyer',
  upgrade: 'reasonable + ровно одно следующее усиление; недостающие монеты — явное сценарное допущение',
};

export const SIM_WORLDS = (() => {
  const packaged = new Set(WORLDS.map((world) => world.id));
  const early = [];
  for (const battle of BATTLES) {
    if (battle.wanted || packaged.has(battle.world)) continue;
    let world = early.find((candidate) => candidate.id === battle.world);
    if (!world) {
      world = { id: battle.world, label: battle.world, battles: [] };
      early.push(world);
    }
    world.battles.push(battle);
  }
  return [...early, ...WORLDS];
})();

export function battleChain(targetId) {
  const chain = [];
  const seen = new Set();
  let battle = BATTLE_BY_ID[targetId];
  if (!battle) throw new Error(`Неизвестный бой: ${targetId}`);
  while (battle) {
    if (seen.has(battle.id)) throw new Error(`Цикл unlockAfter: ${battle.id}`);
    seen.add(battle.id);
    chain.unshift(battle);
    battle = battle.unlockAfter ? BATTLE_BY_ID[battle.unlockAfter] : null;
  }
  return chain;
}

function previousBattles(targetId) {
  return battleChain(targetId).slice(0, -1);
}

function endgameState() {
  const state = newGame();
  state.coins = 99999;
  state.seals = 99;
  for (const id of Object.keys(BATTLE_BY_ID)) state.battlesDone[id] = { victories: 0 };
  state.equipped = {
    weapon: 'wpn_firebird_quill', shield: 'shd_tower', helmet: 'hlm_page_wanderer',
    armor: 'arm_ink_cloak', gloves: 'glv_smithee', boots: 'bt_quiet_step',
    amulet: 'amu_pages', ring1: 'rng_duelist', ring2: 'rng_contents',
  };
  state.consumableBelt = ['pot_heal', 'pot_vigor'];
  state.crew = ['cmp_herbalist', 'cmp_cat', 'cmp_smith', 'merc_archer', 'merc_witch', 'pet_fox'];
  state.squadCompanions = ['cmp_herbalist', 'cmp_cat', 'cmp_smith'];
  state.squadMercs = ['merc_archer', 'merc_witch'];
  state.pet = 'pet_fox';
  state.formation = { knight: 1, merc0: 5, merc1: 4 };
  return state;
}

function hasItem(state, id) {
  return state.inventory.includes(id)
    || state.consumableBelt.includes(id)
    || Object.values(state.equipped).includes(id);
}

function scoreAt(state, slot) {
  const id = state.equipped[slot];
  return id ? itemScore(ITEM_BY_ID[id]) : -1;
}

function gearCandidates(state, affordable = true) {
  return shopStock(state)
    .filter((item) => !item.sealPrice && item.slot !== 'consumable' && !hasItem(state, item.id))
    .map((item) => {
      if (item.slot === 'shield' && isShieldBlocked(state.equipped)) return null;
      const current = item.slot === 'ring'
        ? Math.min(scoreAt(state, 'ring1'), scoreAt(state, 'ring2'))
        : scoreAt(state, item.slot);
      const gain = itemScore(item) - current;
      return gain > 0 && (!affordable || item.price <= state.coins) ? { item, gain } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.gain - a.gain || a.item.price - b.item.price || a.item.id.localeCompare(b.item.id));
}

function buyBestGear(state) {
  const candidate = gearCandidates(state)[0];
  if (!candidate) return null;
  const { item } = candidate;
  const result = buyItem(state, item.id);
  if (!result.ok) return null;
  autoEquipBest(state);
  return item.id;
}

function nextPriorityCrew(state) {
  const available = crewStock(state);
  for (const id of CREW_PRIORITY) {
    const def = available.find((candidate) => candidate.id === id);
    if (def && def.currency !== 'seals' && !state.crew.includes(id)) return def;
  }
  return null;
}

// Buyer сначала копит на базовый отряд, потом берёт лучшие реальные улучшения.
// Никакого дохода головоломок, печатей, крафта, читов или закрытых вещей.
function shopReasonable(state) {
  const crew = nextPriorityCrew(state);
  if (crew) {
    if (state.coins >= crew.price) hireCrew(state, crew.id, crew.kind);
    return;
  }
  for (let i = 0; i < 24 && buyBestGear(state); i++) { /* покупки пересчитываются после каждой */ }
}

function bonusTotal(state, key) {
  let total = collectStats(state.equipped).stats[key] || 0;
  for (const id of state.squadCompanions) total += COMPANION_BY_ID[id]?.bonus?.[key] || 0;
  total += PET_BY_ID[state.pet]?.bonus?.[key] || 0;
  return total;
}

function formationForSquad(state) {
  const formation = { knight: 1 };
  const taken = new Set([1]);
  state.squadMercs.forEach((id, index) => {
    const tank = MERC_BY_ID[id]?.role === 'танк';
    const preferences = tank ? [0, 2] : [4, 5, 3];
    const slot = preferences.find((candidate) => !taken.has(candidate)) ?? (tank ? 2 : 5);
    formation[`merc${index}`] = slot;
    taken.add(slot);
  });
  return formation;
}

function prepareBelt(state, targetId) {
  const skills = new Set((BATTLE_BY_ID[targetId]?.enemies || []).flatMap((entry) => {
    const id = typeof entry === 'string' ? entry : entry.id;
    return ENEMY_BY_ID[id]?.skills || [];
  }));
  const preferred = [];
  if (skills.has('pollen_sleep')) preferred.push('pot_vigor');
  if (skills.has('sting_poison') || skills.has('sting_poison_weak')) preferred.push('pot_ink');
  preferred.push('pot_heal', 'pot_stone');
  const stock = shopStock(state);
  for (const id of [...new Set(preferred)]) {
    if (state.consumableBelt.length >= 2) break;
    const item = stock.find((candidate) => candidate.id === id && !candidate.sealPrice);
    if (!item) continue;
    const inventoryIndex = state.inventory.indexOf(id);
    if (inventoryIndex >= 0) equipFromInventory(state, inventoryIndex);
    else if (state.coins >= item.price) buyItem(state, id);
  }
}

function reasonableState(targetId) {
  const state = newGame(0);
  state.consumableBelt = [];
  for (const battle of previousBattles(targetId)) {
    // Единственный боевой доход модели: core-функция первой награды, без повторов.
    addCoins(state, battleCoinReward(battle, { repeat: false, goldFind: bonusTotal(state, 'goldFind') }));
    state.battlesDone[battle.id] = { victories: 1, at: 0 };
    shopReasonable(state);
  }
  prepareBelt(state, targetId);
  state.formation = formationForSquad(state);
  return state;
}

function combatBonusScore(bonus = {}, trait = null) {
  let score = 0;
  for (const [key, value] of Object.entries(bonus)) {
    if (key === 'attack') score += value * 5;
    else if (key === 'hp') score += value;
    else if (key === 'armor') score += value * 3;
    else if (key === 'speed') score += value * 4;
    else if (['crit', 'dodge', 'block'].includes(key)) score += value * 100;
    else if (key === 'resist') score += Object.values(value).reduce((sum, entry) => sum + entry * 50, 0);
  }
  if (trait === 'regen_ally') score += 20;
  return score;
}

function mercPower(def) {
  return def.hp + def.armor * 3 + def.attack * 4 + def.speed
    + (def.crit || 0) * 100 + (def.dodge || 0) * 100 + (def.block || 0) * 100
    + (def.tags?.includes('ranged') ? 15 : 0) + (def.skills?.includes('regen_ally_skill') ? 10 : 0);
}

function availableState(targetId) {
  const state = newGame(0);
  for (const battle of previousBattles(targetId)) state.battlesDone[battle.id] = { victories: 1, at: 0 };
  state.coins = 0;
  state.seals = 0;
  const stock = shopStock(state).filter((item) => !item.sealPrice);
  const availableIds = new Set(stock.map((item) => item.id));
  for (const recipe of RECIPES) {
    if (state.battlesDone[recipe.unlockAfter]) availableIds.add(recipe.result.itemId);
  }
  for (const [battleId, drop] of Object.entries(BOSS_DROPS)) {
    if (state.battlesDone[battleId]) availableIds.add(drop.itemId);
  }
  for (const id of availableIds) {
    if (!ITEM_BY_ID[id]?.sealPrice) state.inventory.push(id);
  }
  autoEquipBest(state);
  const consumables = [...availableIds].map((id) => ITEM_BY_ID[id])
    .filter((item) => item && !item.sealPrice && item.slot === 'consumable')
    .sort((a, b) => itemScore(b) - itemScore(a) || a.id.localeCompare(b.id));
  for (const item of consumables) {
    if (state.consumableBelt.length >= 2) break;
    const index = state.inventory.indexOf(item.id);
    if (index >= 0) equipFromInventory(state, index);
  }

  const crew = crewStock(state).filter((def) => def.currency !== 'seals');
  state.crew = crew.map((def) => def.id);
  state.squadCompanions = crew.filter((def) => def.kind === 'companion').slice(0, 3).map((def) => def.id);
  state.squadMercs = crew.filter((def) => def.kind === 'merc')
    .sort((a, b) => mercPower(MERC_BY_ID[b.id]) - mercPower(MERC_BY_ID[a.id]))
    .slice(0, 2).map((def) => def.id);
  state.pet = crew.filter((def) => def.kind === 'pet')
    .sort((a, b) => combatBonusScore(PET_BY_ID[b.id].bonus) - combatBonusScore(PET_BY_ID[a.id].bonus))[0]?.id || null;
  state.formation = formationForSquad(state);
  return state;
}

function combatGearScore(state, targetId) {
  const { stats, traits } = collectStats(state.equipped);
  const enemies = (BATTLE_BY_ID[targetId]?.enemies || []).map((entry) => (
    ENEMY_BY_ID[typeof entry === 'string' ? entry : entry.id]
  )).filter(Boolean);
  const unique = new Set(traits);
  let score = stats.attack * 6 + stats.hp + stats.armor * 3 + stats.speed * 4
    + (stats.crit + stats.dodge + stats.block) * 100;
  score += Object.values(stats.resist || {}).reduce((sum, value) => sum + value * 50, 0);
  if (unique.has('ranged')) score += 18;
  if (unique.has('cleave_small')) score += Math.max(0, enemies.length - 1) * 8;
  if (unique.has('pierce')) {
    score += enemies.reduce((sum, enemy) => sum + enemy.armor, 0) / Math.max(1, enemies.length) * 0.75;
  }
  if (unique.has('bonus_spirit')) {
    score += enemies.filter((enemy) => enemy.tags?.includes('spirit')).length / Math.max(1, enemies.length) * 30;
  }
  if (unique.has('fearless') && enemies.some((enemy) => enemy.skills?.includes('fear_chill'))) score += 25;
  if (unique.has('first_hit_reduction')) score += 5;
  if (unique.has('thorns_small')) score += 8;
  if (unique.has('lifesteal_small')) score += 10;
  if (unique.has('regen_ally')) score += 20;
  return score;
}

function upgradeGearCandidates(state, targetId) {
  const baseScore = combatGearScore(state, targetId);
  return shopStock(state)
    .filter((item) => !item.sealPrice && item.slot !== 'consumable' && !hasItem(state, item.id))
    .map((item) => {
      const candidate = structuredClone(state);
      candidate.inventory.push(item.id);
      const result = equipFromInventory(candidate, candidate.inventory.length - 1);
      if (!result.ok) return null;
      const gain = combatGearScore(candidate, targetId) - baseScore;
      return gain > 0 ? { item, gain } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.gain - a.gain || a.item.price - b.item.price || a.item.id.localeCompare(b.item.id));
}

function nextCrewUpgrade(state) {
  return crewStock(state)
    .filter((def) => def.currency !== 'seals')
    .map((def) => {
      if (def.kind === 'companion' && !state.squadCompanions.includes(def.id) && state.squadCompanions.length < 3) {
        return { def, score: combatBonusScore(def.bonus, def.trait) };
      }
      if (def.kind === 'merc' && !state.squadMercs.includes(def.id) && state.squadMercs.length < 2) {
        return { def, score: mercPower(def) / 10 };
      }
      if (def.kind === 'pet' && state.pet !== def.id && !state.pet) {
        return { def, score: combatBonusScore(def.bonus) };
      }
      return null;
    })
    .filter((candidate) => candidate?.score > 0)
    .sort((a, b) => b.score - a.score || a.def.price - b.def.price || a.def.id.localeCompare(b.def.id))[0] || null;
}

export function upgradeProfileState(baseState, targetId) {
  const state = structuredClone(baseState);
  const gear = upgradeGearCandidates(state, targetId)[0];
  if (gear) {
    const { item } = gear;
    const beforeCoins = state.coins;
    if (state.coins < item.price) state.coins = item.price;
    const result = buyItem(state, item.id);
    if (result.ok && !result.autoEquipped) {
      equipFromInventory(state, state.inventory.lastIndexOf(item.id));
    }
    return {
      state,
      action: result.ok ? {
        kind: 'item', id: item.id, name: item.name, price: item.price,
        scenarioCoins: Math.max(0, item.price - beforeCoins),
      } : null,
    };
  }

  const crew = nextCrewUpgrade(state);
  if (crew) {
    const { def } = crew;
    const beforeCoins = state.coins;
    if (state.coins < def.price) state.coins = def.price;
    let result = { ok: true };
    if (!state.crew.includes(def.id)) result = hireCrew(state, def.id, def.kind);
    else if (def.kind === 'companion') result = toggleCompanion(state, def.id);
    else if (def.kind === 'merc') result = toggleMerc(state, def.id);
    else if (def.kind === 'pet') result = setPet(state, def.id);
    state.formation = formationForSquad(state);
    return {
      state,
      action: result.ok ? {
        kind: def.kind, id: def.id, name: def.name, price: def.price,
        scenarioCoins: Math.max(0, def.price - beforeCoins),
      } : null,
    };
  }
  return { state, action: null };
}

export function createProfile(targetId, profile = 'endgame') {
  if (!PROFILES.includes(profile)) throw new Error(`Неизвестный профиль: ${profile}`);
  if (profile === 'endgame') return { state: endgameState(), action: null };
  if (profile === 'available') return { state: availableState(targetId), action: null };
  const reasonable = reasonableState(targetId);
  if (profile === 'reasonable') return { state: reasonable, action: null };
  return upgradeProfileState(reasonable, targetId);
}

function usage() {
  console.log('Использование: node tools/sim-world.mjs <worldId> [minWinrate%] [endgame|available|reasonable|upgrade|all]');
  console.log('По умолчанию: endgame и 60%. Миры:', SIM_WORLDS.map((world) => world.id).join(', '));
  for (const profile of PROFILES) console.log(`  ${profile}: ${PROFILE_LABEL[profile]}`);
}

function runProfile(world, minWinrate, profile) {
  let failed = 0;
  console.log(`\n=== МИР ${world.id} · ПРОФИЛЬ ${profile}: ${PROFILE_LABEL[profile]} ===`);
  for (const battle of world.battles) {
    const { state, action } = createProfile(battle.id, profile);
    let wins = 0;
    for (let seed = 1; seed <= SEEDS; seed++) {
      const result = runBattle(structuredClone(state), battle.id, seed);
      if (result?.victory) wins++;
    }
    const winrate = Math.round(wins / SEEDS * 100);
    const ok = winrate >= minWinrate;
    if (!ok) failed++;
    const upgrade = action ? ` · +${action.name}` : '';
    console.log(`${ok ? 'OK  ' : 'СЛАБ'} ${battle.id.padEnd(12)} ${battle.name.padEnd(24)} винрейт ${winrate}% · ${profile}${upgrade}`);
  }
  console.log(failed === 0
    ? `=== ${world.id}/${profile}: БАЛАНС OK (минимум ${minWinrate}%) ===`
    : `=== ${world.id}/${profile}: ${failed} боёв ниже порога ${minWinrate}% ===`);
  return failed;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isMain) {
  const worldId = process.argv[2];
  const minWinrate = Number(process.argv[3] || 60);
  const requestedProfile = process.argv[4] || 'endgame';
  const world = SIM_WORLDS.find((candidate) => candidate.id === worldId);
  if (!world || !Number.isFinite(minWinrate) || minWinrate < 0 || minWinrate > 100
    || ![...PROFILES, 'all'].includes(requestedProfile)) {
    usage();
    if (worldId && !world) console.error('Мир не найден:', worldId);
    if (![...PROFILES, 'all'].includes(requestedProfile)) console.error('Профиль не найден:', requestedProfile);
    process.exit(1);
  }
  const profiles = requestedProfile === 'all' ? PROFILES : [requestedProfile];
  const failed = profiles.reduce((sum, profile) => sum + runProfile(world, minWinrate, profile), 0);
  process.exit(failed === 0 ? 0 : 1);
}
