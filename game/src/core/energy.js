// Энергия повторных боёв: чистые правила времени и стоимости, без DOM и state.js.
import {
  BATTLE_ENERGY_VERSION, BATTLE_ENERGY_CAP, BATTLE_ENERGY_REGEN_MS,
  BATTLE_ENERGY_NORMAL_COST, BATTLE_ENERGY_BOSS_COST,
} from '../data/energy.js';
import { ENEMY_BY_ID } from '../data/enemies.js';

export function newBattleEnergy(now = Date.now()) {
  return { version: BATTLE_ENERGY_VERSION, value: BATTLE_ENERGY_CAP, updatedAt: now };
}

function finiteNow(now) {
  return Number.isFinite(now) ? now : Date.now();
}

// updatedAt — начало текущего двухчасового интервала, поэтому остаток не теряется.
// При переводе часов назад метка не двигается: перемотка туда-обратно не создаёт энергию.
export function refreshBattleEnergy(state, now = Date.now()) {
  const energy = state.battleEnergy;
  if (!energy) return null;
  const at = finiteNow(now);
  energy.version = BATTLE_ENERGY_VERSION;
  energy.value = Number.isFinite(energy.value)
    ? Math.max(0, Math.min(BATTLE_ENERGY_CAP, Math.floor(energy.value)))
    : BATTLE_ENERGY_CAP;
  energy.updatedAt = Number.isFinite(energy.updatedAt) ? energy.updatedAt : at;
  if (at < energy.updatedAt) return energy;

  if (energy.value >= BATTLE_ENERGY_CAP) {
    energy.value = BATTLE_ENERGY_CAP;
    return energy;
  }

  const gained = Math.floor((at - energy.updatedAt) / BATTLE_ENERGY_REGEN_MS);
  if (gained <= 0) return energy;
  energy.value = Math.min(BATTLE_ENERGY_CAP, energy.value + gained);
  energy.updatedAt = energy.value >= BATTLE_ENERGY_CAP
    ? at
    : energy.updatedAt + gained * BATTLE_ENERGY_REGEN_MS;
  return energy;
}

export function isBossBattle(battle) {
  return (battle?.enemies || []).some((entry) => {
    const id = typeof entry === 'string' ? entry : entry.id;
    return !!ENEMY_BY_ID[id]?.boss;
  });
}

export function battleEnergyCost(battle, repeat = true) {
  if (!repeat) return 0;
  return isBossBattle(battle) ? BATTLE_ENERGY_BOSS_COST : BATTLE_ENERGY_NORMAL_COST;
}

export function millisecondsToNextEnergy(state, now = Date.now()) {
  const energy = state.battleEnergy;
  if (!energy || energy.value >= BATTLE_ENERGY_CAP) return 0;
  return Math.max(0, energy.updatedAt + BATTLE_ENERGY_REGEN_MS - finiteNow(now));
}

export function battleEnergyTerms(state, battle, now = Date.now()) {
  refreshBattleEnergy(state, now);
  const victories = state.battlesDone?.[battle.id]?.victories || 0;
  const repeat = victories > 0;
  const cost = battleEnergyCost(battle, repeat);
  const value = state.battleEnergy.value;
  return {
    value,
    cap: BATTLE_ENERGY_CAP,
    cost,
    first: !repeat,
    repeat,
    boss: isBossBattle(battle),
    enough: value >= cost,
    nextInMs: millisecondsToNextEnergy(state, now),
  };
}

// Списание происходит только после настоящей победы, в общей транзакции наград.
export function spendBattleEnergy(state, amount, now = Date.now()) {
  const at = finiteNow(now);
  refreshBattleEnergy(state, at);
  const energy = state.battleEnergy;
  const cost = Math.max(0, Math.floor(amount));
  if (!energy || energy.value < cost) return false;
  const wasFull = energy.value >= BATTLE_ENERGY_CAP;
  energy.value -= cost;
  // После траты из полного запаса отсчёт начинается с момента победы.
  if (cost > 0 && wasFull && at >= energy.updatedAt) energy.updatedAt = at;
  return true;
}
