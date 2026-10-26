import { BATTLES, BATTLE_BY_ID } from '../data/battles.js';
import { BATTLE_LORE } from '../data/battleLore.js';

export function battleLoreScene(world, kind) {
  return BATTLE_LORE[world]?.[kind] || null;
}

export function battleLoreSeen(state, world, kind) {
  return !!state.battleLoreSeen?.[`${world}:${kind}`];
}

export function markBattleLoreSeen(state, world, kind) {
  if (!battleLoreScene(world, kind) || battleLoreSeen(state, world, kind)) return false;
  state.battleLoreSeen ||= {};
  state.battleLoreSeen[`${world}:${kind}`] = true;
  return true;
}

export function battleLoreFinalBattle(world) {
  const battles = BATTLES.filter((battle) => !battle.wanted && battle.world === world);
  return battles[battles.length - 1] || null;
}

export function battleLoreIntroRoute(state, battleId) {
  const battle = BATTLE_BY_ID[battleId];
  if (!battle || battle.wanted || !battleLoreScene(battle.world, 'intro')) return null;
  if (battleLoreSeen(state, battle.world, 'intro')) return null;
  return { world: battle.world, kind: 'intro', battleId };
}

export function battleLoreOutroRoute(state, battleId) {
  const battle = BATTLE_BY_ID[battleId];
  if (!battle || battle.wanted || battleLoreFinalBattle(battle.world)?.id !== battleId) return null;
  if (!state.battlesDone?.[battleId] || battleLoreSeen(state, battle.world, 'outro')) return null;
  return { world: battle.world, kind: 'outro', battleId };
}

export function nextCampaignBattle(currentId) {
  const index = BATTLES.findIndex((battle) => battle.id === currentId);
  if (index < 0) return null;
  return BATTLES.slice(index + 1).find((battle) => !battle.wanted) || null;
}
