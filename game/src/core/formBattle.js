// Движок режима «сбор»: автобой на поле боя с рядами. Чистая логика, без DOM.
// Поле: 2 ряда × 3 слота у каждой стороны (0-2 передний, 3-5 задний).
// Порядок бойцов важен:
//   - рукопашные бьют только передний ряд врага (пока он не опустеет);
//   - стрелки (bow / tags ranged) бьют любой ряд, предпочитая хрупких;
//   - рассечение бьёт по всему переднему ряду.
// Тики, статусы и формулы урона — как в классическом автобое.

import { makeRng } from './rng.js';
import { ENEMY_BY_ID } from '../data/enemies.js';

const GAUGE_FULL = 100;
const MAX_TICKS = 5000;
const FRONT = [0, 1, 2];
const BACK = [3, 4, 5];

export function isRanged(unit) {
  return unit.tags?.includes('ranged') || unit.traits?.includes('ranged');
}

export function makeFormationKnight(knightStats, traits, consumables, slot) {
  const statuses = [];
  if ((traits || []).includes('regen_ally')) statuses.push({ kind: 'regen', ticks: 9999, dmg: 1 });
  const resist = { ...(knightStats.resist || {}) };
  if ((traits || []).includes('fearless')) resist.fear = 1;
  const potions = (consumables || []).map((c) => {
    const p = { ...c, used: false };
    if (p.effect?.kind === 'shield' && p.effect.atStart) {
      statuses.push({ kind: 'shield', amount: p.effect.amount });
      p.used = true;
    }
    return p;
  });
  return {
    uid: 'a0', side: 'ally', name: 'Рыцарь лавки', icon: '🛡️', slot,
    hp: knightStats.hp, maxHp: knightStats.hp,
    attack: knightStats.attack, armor: knightStats.armor, speed: knightStats.speed,
    crit: knightStats.crit, dodge: knightStats.dodge, block: knightStats.block,
    elem: 'phys', skills: [], tags: [], traits: traits || [], resist, potions,
    statuses, gauge: 0,
    stats: { dealt: 0, taken: 0, sleptTicks: 0, poisonTicks: 0 },
  };
}

export function makeFormationMerc(def, slot, index) {
  return {
    uid: `a${index}`, side: 'ally', name: def.name, icon: def.icon, slot,
    hp: def.hp, maxHp: def.hp,
    attack: def.attack, armor: def.armor, speed: def.speed,
    crit: def.crit || 0, dodge: def.dodge || 0, block: def.block || 0,
    elem: 'phys', skills: def.skills || [], tags: def.tags || [], traits: [],
    resist: {}, potions: [], statuses: [], gauge: 0,
    stats: { dealt: 0, taken: 0 },
  };
}

export function makeFormationEnemy(id, scale, slot, index) {
  const def = ENEMY_BY_ID[id];
  const hp = Math.round(def.hp * (scale || 1));
  return {
    uid: `e${index}`, side: 'enemy', name: def.name, icon: def.icon, slot,
    boss: !!def.boss, tags: def.tags || [],
    hp, maxHp: hp,
    attack: Math.round(def.attack * (scale || 1)),
    armor: Math.round(def.armor * (scale || 1)),
    speed: def.speed, crit: def.crit || 0, dodge: def.dodge || 0, block: 0,
    elem: def.elem || 'phys', skills: def.skills || [], traits: [],
    resist: {}, potions: [], statuses: [], gauge: 0,
    stats: { dealt: 0, taken: 0 },
  };
}

function hasStatus(u, kind) {
  return u.statuses.some((s) => s.kind === kind);
}

function addStatus(u, status) {
  const ex = u.statuses.find((s) => s.kind === status.kind);
  if (ex) Object.assign(ex, status);
  else u.statuses.push(status);
}

function computeDamage(attacker, defender, rng, log, opts = {}) {
  if (!opts.neverMiss && rng.chance(defender.dodge)) {
    log.push({ t: 'dodge', who: defender.name, uid: defender.uid });
    return 0;
  }
  let mult = 1;
  if (attacker.traits?.includes('bonus_spirit') && defender.tags?.includes('spirit')) mult *= 1.3;
  const elem = opts.elem || attacker.elem || 'phys';
  if (elem !== 'phys') mult *= 1 - (defender.resist[elem] || 0);
  let armor = defender.armor;
  if (attacker.traits?.includes('pierce')) armor *= 0.5;
  mult *= 100 / (100 + Math.max(0, armor));
  let crit = false;
  if (rng.chance(attacker.crit)) { mult *= 1.75; crit = true; }
  if (rng.chance(defender.block)) mult *= 0.6;
  if (hasStatus(attacker, 'fear')) mult *= 0.7;
  if (defender.traits?.includes('first_hit_reduction') && defender.stats.taken === 0) mult *= 0.8;

  const dmg = Math.max(1, Math.round((opts.base ?? attacker.attack) * (opts.skillMult || 1) * mult));
  let remaining = dmg;
  const shield = defender.statuses.find((s) => s.kind === 'shield');
  if (shield) {
    const absorbed = Math.min(shield.amount, remaining);
    shield.amount -= absorbed;
    remaining -= absorbed;
    if (shield.amount <= 0) defender.statuses = defender.statuses.filter((s) => s !== shield);
  }
  defender.hp -= remaining;
  defender.stats.taken += remaining;
  attacker.stats.dealt += remaining;
  log.push({
    t: 'hit', from: attacker.name, to: defender.name,
    fromUid: attacker.uid, toUid: defender.uid,
    dmg: remaining, crit, elem, ranged: isRanged(attacker),
  });
  return remaining;
}

function tryApplyStatus(attacker, defender, kind, chance, status, rng, log) {
  const effective = chance * (1 - (defender.resist[kind] || 0));
  if (rng.chance(effective)) {
    addStatus(defender, status);
    log.push({ t: 'status', who: defender.name, uid: defender.uid, kind });
    return true;
  }
  return false;
}

// Цель по правилам рядов.
function pickTarget(attacker, foes, rng) {
  const alive = foes.filter((f) => f.hp > 0);
  if (alive.length === 0) return null;
  if (isRanged(attacker)) {
    return alive.reduce((a, b) => (a.hp < b.hp ? a : b));
  }
  const frontAlive = alive.filter((f) => FRONT.includes(f.slot));
  const row = frontAlive.length > 0 ? frontAlive : alive.filter((f) => BACK.includes(f.slot));
  const pool = row.length > 0 ? row : alive;
  return rng.pick(pool);
}

function checkPotions(unit, log) {
  if (!unit.potions || unit.hp <= 0) return;
  for (const p of unit.potions) {
    if (p.used) continue;
    if (p.effect.kind === 'heal' && unit.hp / unit.maxHp <= p.effect.atHpBelow) {
      p.used = true;
      const healed = Math.min(p.effect.amount, unit.maxHp - unit.hp);
      unit.hp += healed;
      log.push({ t: 'potion', who: unit.name, uid: unit.uid, name: p.name, healed });
    }
    if (p.effect.kind?.startsWith('cleanse_')) {
      const statusKind = p.effect.kind.slice(8);
      if (hasStatus(unit, statusKind)) {
        p.used = true;
        unit.statuses = unit.statuses.filter((s) => s.kind !== statusKind);
        if (p.effect.resistAfter) {
          for (const [k, v] of Object.entries(p.effect.resistAfter)) {
            unit.resist[k] = Math.max(unit.resist[k] || 0, v);
          }
        }
        log.push({ t: 'potion', who: unit.name, uid: unit.uid, name: p.name, cleansed: statusKind });
      }
    }
  }
}

function act(unit, allies, foes, rng, log) {
  const sleep = unit.statuses.find((s) => s.kind === 'sleep');
  if (sleep) {
    sleep.ticks -= 1;
    if (sleep.ticks <= 0) unit.statuses = unit.statuses.filter((s) => s !== sleep);
    log.push({ t: 'sleeps', who: unit.name, uid: unit.uid });
    return;
  }
  const target = pickTarget(unit, foes, rng);
  if (!target) return;

  const skill = unit.skills[0] && unit.skills[(unit._next || 0) % unit.skills.length];
  unit._next = (unit._next || 0) + 1;

  switch (skill) {
    case 'pollen_sleep':
      computeDamage(unit, target, rng, log, { skillMult: 0.6 });
      tryApplyStatus(unit, target, 'sleep', 0.3, { kind: 'sleep', ticks: 18 }, rng, log);
      break;
    case 'sting_poison':
      computeDamage(unit, target, rng, log);
      tryApplyStatus(unit, target, 'poison', 0.5, { kind: 'poison', ticks: 40, dmg: 2 }, rng, log);
      break;
    case 'sting_poison_weak':
      computeDamage(unit, target, rng, log);
      tryApplyStatus(unit, target, 'poison', 0.25, { kind: 'poison', ticks: 30, dmg: 1 }, rng, log);
      break;
    case 'slow_spores':
      computeDamage(unit, target, rng, log, { skillMult: 0.7 });
      tryApplyStatus(unit, target, 'slow', 0.5, { kind: 'slow', ticks: 40, factor: 0.6 }, rng, log);
      break;
    case 'heavy_blow':
      computeDamage(unit, target, rng, log, { skillMult: 1.6 });
      break;
    case 'fear_chill':
      computeDamage(unit, target, rng, log, { skillMult: 0.8 });
      tryApplyStatus(unit, target, 'fear', 0.5, { kind: 'fear', ticks: 35 }, rng, log);
      break;
    case 'spit_fire':
      computeDamage(unit, target, rng, log, { elem: 'fire', skillMult: 1.1 });
      break;
    case 'aimed_shot':
      computeDamage(unit, target, rng, log, { skillMult: 1.35, neverMiss: true });
      break;
    case 'regen_ally_skill': {
      const wounded = allies.filter((a) => a.hp > 0).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
      if (wounded && wounded.hp < wounded.maxHp * 0.8) {
        addStatus(wounded, { kind: 'regen', ticks: 25, dmg: 2 });
        log.push({ t: 'status', who: wounded.name, uid: wounded.uid, kind: 'regen', from: unit.name });
      } else {
        computeDamage(unit, target, rng, log, { skillMult: 0.8 });
      }
      break;
    }
    default: {
      if (unit.traits?.includes('cleave_small')) {
        // Рассечение: по всему переднему ряду
        const row = foes.filter((f) => f.hp > 0 && FRONT.includes(f.slot));
        const others = row.filter((f) => f !== target);
        computeDamage(unit, target, rng, log);
        for (const other of others) computeDamage(unit, other, rng, log, { skillMult: 0.4 });
      } else {
        computeDamage(unit, target, rng, log);
      }
    }
  }
}

// units: [...allies, ...foes] со slot'ами. Возвращает { victory, log, report, ticks }
export function simulateFormationBattle(allies, foes, seed = 1) {
  const rng = makeRng(seed);
  const log = [{ t: 'start', allies: allies.map((a) => a.name), foes: foes.map((f) => f.name) }];
  const knight = allies[0];

  let tick = 0;
  while (tick < MAX_TICKS) {
    tick++;
    for (const u of [...allies, ...foes]) {
      if (u.hp <= 0) continue;
      for (const s of [...u.statuses]) {
        if (s.kind === 'poison') {
          s.ticks -= 1;
          u.hp -= s.dmg;
          u.stats.taken += s.dmg;
          if (u.stats.poisonTicks !== undefined) u.stats.poisonTicks++;
          if (s.ticks <= 0) u.statuses = u.statuses.filter((x) => x !== s);
        }
        if (s.kind === 'regen') {
          s.ticks -= 1;
          u.hp = Math.min(u.maxHp, u.hp + s.dmg);
          if (s.ticks <= 0) u.statuses = u.statuses.filter((x) => x !== s);
        }
        if (s.kind === 'fear') {
          s.ticks -= 1;
          if (s.ticks <= 0) u.statuses = u.statuses.filter((x) => x !== s);
        }
      }
    }
    for (const u of [...allies, ...foes]) {
      if (u.hp <= 0) continue;
      checkPotions(u, log);
      let spd = u.speed;
      const slow = u.statuses.find((s) => s.kind === 'slow');
      if (slow) {
        spd *= slow.factor;
        slow.ticks -= 1;
        if (slow.ticks <= 0) u.statuses = u.statuses.filter((x) => x !== slow);
      }
      u.gauge += spd;
    }
    const ready = [...allies, ...foes].filter((u) => u.hp > 0 && u.gauge >= GAUGE_FULL)
      .sort((a, b) => b.gauge - a.gauge);
    for (const u of ready) {
      if (u.gauge < GAUGE_FULL || u.hp <= 0) continue;
      u.gauge -= GAUGE_FULL;
      const myAllies = u.side === 'ally' ? allies : foes;
      const myFoes = u.side === 'ally' ? foes : allies;
      act(u, myAllies, myFoes, rng, log);
      if (u.side === 'ally' && hasStatus(u, 'sleep')) u.stats.sleptTicks++;
    }
    if (foes.every((f) => f.hp <= 0) || allies.every((a) => a.hp <= 0)) break;
  }

  const victory = foes.every((f) => f.hp <= 0) && allies.some((a) => a.hp > 0);
  const report = {
    victory,
    knightHpLeft: Math.max(0, knight.hp),
    knightHpMax: knight.maxHp,
    dealt: allies.reduce((s, a) => s + a.stats.dealt, 0),
    taken: knight.stats.taken,
    alliesDown: allies.filter((a) => a.hp <= 0).map((a) => a.name),
    alliesStats: allies.map((a) => ({ name: a.name, icon: a.icon, dealt: a.stats.dealt, taken: a.stats.taken, alive: a.hp > 0 })),
    foesDown: foes.filter((f) => f.hp <= 0).length,
    foesTotal: foes.length,
    slept: knight.stats.sleptTicks > 0,
    poisoned: knight.stats.poisonTicks > 0,
    deathCause: knight.hp > 0 ? null : inferCause(knight),
    advice: victory ? null : adviceFor(knight, allies, foes, inferCause(knight)),
  };
  return { victory, log, report, ticks: tick };
}

function inferCause(knight) {
  if (knight.stats.sleptTicks > 0) return 'sleep';
  if (knight.stats.poisonTicks > 20) return 'poison';
  return 'phys';
}

function adviceFor(knight, allies, foes, cause) {
  if (cause === 'sleep') {
    return 'Рыцарь уснул на посту. Шлем с сопротивлением сну или зелье бодрости — и порядок.';
  }
  if (cause === 'poison') {
    return 'Яд подточил рыцаря. Амулет противоядия или чернильный отвар помогут.';
  }
  if (allies.length === 1) {
    return 'В одиночку тяжело. Найми в таверне громилу в передний ряд и лучницу за спину.';
  }
  const frontDown = allies.filter((a) => FRONT.includes(a.slot) && a.hp <= 0).length;
  if (frontDown > 0) {
    return 'Передний ряд рухнул, и стрелков за спиной растоптали. Поставь вперёд кого-нибудь покрепче.';
  }
  return 'Не хватило мощи. Проверь экипировку, зелья и расстановку: танки вперёд, стрелки назад.';
}

// Авторасстановка врагов: каждый занимает СВОЙ слот — ближние вперёд,
// стрелки назад, босс предпочитает центр переднего ряда.
export function enemyFormationSlots(enemyEntries) {
  const used = new Set();
  const take = (prefs) => {
    const slot = prefs.find((s) => !used.has(s)) ?? prefs[0];
    used.add(slot);
    return slot;
  };
  return enemyEntries.map((entry) => {
    const id = typeof entry === 'string' ? entry : entry.id;
    const def = ENEMY_BY_ID[id];
    if (def.boss) return take([1, 0, 2, 4, 3, 5]); // босс в центр переднего ряда
    const melee = !def.skills.some((s) => s === 'pollen_sleep' || s === 'fear_chill');
    return melee ? take([0, 1, 2, 3, 4, 5]) : take([3, 4, 5, 0, 1, 2]);
  });
}
