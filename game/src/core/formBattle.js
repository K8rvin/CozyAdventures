// Движок режима «сбор»: автобой на поле боя с клетками. Чистая логика, без DOM.
// Поле: 8 колонок × 3 ряда (24 клетки). Союзники слева (колонки 0–1),
// враги справа (колонки 6–7), между ними нейтральная полоса для манёвра.
// Порядок бойцов важен:
//   - холодное оружие бьёт только по СОСЕДНЕЙ клетке (8-направленно);
//   - стрелки и кастеры (tags ranged) бьют любой ряд, предпочитая хрупких;
//   - нет цели в дальности — боец делает шаг на клетку к врагу;
//   - рассечение бьёт по всем врагам в дальности.
// Тики, статусы и формулы урона — как в классическом автобое.

import { makeRng } from './rng.js';
import { ENEMY_BY_ID } from '../data/enemies.js';

const GAUGE_FULL = 100;
const MAX_TICKS = 5000;
const FRONT = [0, 1, 2];
const COLS = 8;
const ROWS = 3;
// Скиллы, которые кастуются издалека — их носители становятся кастерами
// (дальность 2 клетки: бьют через одну, не лезут в самую гущу)
const RANGED_SKILLS = ['spit_fire', 'pollen_sleep', 'slow_spores', 'fear_chill', 'aimed_shot',
  'sting_poison', 'sting_poison_weak', 'regen_ally_skill'];

export function isRanged(unit) {
  return unit.tags?.includes('ranged') || unit.traits?.includes('ranged');
}

export function unitRange(unit) {
  if (isRanged(unit)) return 99;      // настоящие стрелки — через всё поле
  if (unit.caster) return 2;          // кастеры — через одну клетку (см. effectiveRange)
  return 1;                            // холодное оружие — только соседняя
}

// Дальность с учётом прикрытия: кастер держится через одну клетку, только
// пока жив союзник-заслон (любой не-кастер). Без заслона — идёт в упор.
function effectiveRange(unit, allies) {
  if (isRanged(unit)) return 99;
  if (!unit.caster) return 1;
  const screened = allies.some((a) => a !== unit && a.hp > 0 && !a.caster);
  return screened ? 2 : 1;
}

// Слот расстановки (0–5) → клетка поля [col, row]
export function slotToCell(slot, side) {
  const row = slot % 3;
  if (side === 'ally') return [FRONT.includes(slot) ? 1 : 0, row];
  return [FRONT.includes(slot) ? 6 : 7, row];
}

// Чебышёвское расстояние между клетками (соседи — 8 направлений)
function cellDist(a, b) {
  return Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));
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
    cell: slotToCell(slot, 'ally'),
    hp: knightStats.hp, maxHp: knightStats.hp,
    attack: knightStats.attack, armor: knightStats.armor, speed: knightStats.speed,
    crit: knightStats.crit, dodge: knightStats.dodge, block: knightStats.block,
    elem: 'phys', skills: [], tags: [], traits: traits || [], resist, potions,
    statuses, gauge: 0,
    stats: { dealt: 0, taken: 0, sleptTicks: 0, poisonTicks: 0 },
  };
}

export function makeFormationMerc(def, slot, index) {
  // Кастеры поддержки (ведьминка и т.п.) — дальность 2, как у вражеских кастеров
  const caster = (def.skills || []).some((s) => RANGED_SKILLS.includes(s))
    && !(def.tags || []).includes('ranged');
  return {
    uid: `a${index}`, side: 'ally', name: def.name, icon: def.icon, slot,
    cell: slotToCell(slot, 'ally'),
    hp: def.hp, maxHp: def.hp,
    attack: def.attack, armor: def.armor, speed: def.speed,
    crit: def.crit || 0, dodge: def.dodge || 0, block: def.block || 0,
    elem: 'phys', skills: def.skills || [], tags: def.tags || [], traits: [], caster,
    resist: {}, potions: [], statuses: [], gauge: 0,
    stats: { dealt: 0, taken: 0 },
  };
}

export function makeFormationEnemy(id, scale, slot, index) {
  const def = ENEMY_BY_ID[id];
  const hp = Math.round(def.hp * (scale || 1));
  // Кастеры бьют через одну клетку, но подходят близко — как бойцы передней линии
  const caster = (def.skills || []).some((s) => RANGED_SKILLS.includes(s))
    && !(def.tags || []).includes('ranged');
  return {
    uid: `e${index}`, side: 'enemy', name: def.name, icon: def.icon, slot,
    cell: slotToCell(slot, 'enemy'),
    boss: !!def.boss, tags: [...(def.tags || [])], caster,
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
  if (attacker.traits?.includes('pierce') || opts.pierce) armor *= 0.5;
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
    if (shield.amount <= 0) {
      defender.statuses = defender.statuses.filter((s) => s !== shield);
      log.push({ t: 'status_end', who: defender.name, uid: defender.uid, kind: 'shield' });
    }
  }
  defender.hp -= remaining;
  defender.stats.taken += remaining;
  attacker.stats.dealt += remaining;
  log.push({
    t: 'hit', from: attacker.name, to: defender.name,
    fromUid: attacker.uid, toUid: defender.uid,
    dmg: remaining, crit, elem, ranged: isRanged(attacker),
    skillName: opts.skillName || null,
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
  // Промах/сопротивление — тоже показываем, иначе «не травит» выглядит багом
  log.push({ t: 'status_fail', who: defender.name, uid: defender.uid, kind });
  return false;
}

// Цель по правилам дальности: холодное оружие — только соседняя клетка,
// стрелок — любая, предпочитая хрупких.
function pickTarget(attacker, foes, rng, range) {
  const inRange = foes.filter((f) => f.hp > 0 && cellDist(attacker.cell, f.cell) <= range);
  if (inRange.length === 0) return null;
  return inRange.reduce((a, b) => (a.hp < b.hp ? a : b));
}

// Ближайший живой враг (цель движения)
function nearestEnemy(unit, foes) {
  const alive = foes.filter((f) => f.hp > 0);
  if (alive.length === 0) return null;
  return alive.reduce((a, b) => (
    cellDist(unit.cell, a.cell) < cellDist(unit.cell, b.cell) ? a : b));
}

// Шаг на одну клетку к цели: лучший свободный сосед, приближающий к цели.
// Возвращает true, если шаг совершён.
function stepToward(unit, goal, allUnits, log) {
  const [cx, cy] = unit.cell;
  const occupied = new Set(
    allUnits.filter((u) => u !== unit && u.hp > 0).map((u) => u.cell.join(',')),
  );
  const curDist = cellDist(unit.cell, goal.cell);
  let best = null;
  let bestDist = curDist;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) continue;
      if (occupied.has(`${nx},${ny}`)) continue;
      const d = cellDist([nx, ny], goal.cell);
      // При равенстве предпочитаем движение вперёд (к колонке врага)
      const dc = Math.sign(goal.cell[0] - cx);
      const score = d * 10 + (dx === dc && dc !== 0 ? 0 : 1);
      if (d < bestDist || (d === bestDist && best && score < best.score)) {
        best = { cell: [nx, ny], d, score };
        bestDist = d;
      }
    }
  }
  if (!best || best.d >= curDist) return false; // дальше не подойти — стоим
  const from = unit.cell;
  unit.cell = best.cell;
  log.push({ t: 'move', uid: unit.uid, from, to: unit.cell });
  return true;
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

// Свитки рыцаря: применяются в его первый подход, до обычной атаки.
function useScrolls(unit, allies, foes, rng, log) {
  if (!unit.potions?.length) return;
  for (const p of unit.potions) {
    if (p.used || !p.effect?.kind?.startsWith('scroll_')) continue;
    const eff = p.effect;
    const alive = foes.filter((f) => f.hp > 0);
    if (eff.kind !== 'scroll_heal_mist' && alive.length === 0) continue;
    p.used = true;
    log.push({ t: 'scroll', uid: unit.uid, name: p.name, kind: eff.kind });
    switch (eff.kind) {
      case 'scroll_fire_arrow': {
        const t = alive.reduce((a, b) => (a.hp > b.hp ? a : b));
        computeDamage(unit, t, rng, log, { base: eff.dmg, elem: 'fire', pierce: true });
        break;
      }
      case 'scroll_fire_step': {
        for (const t of alive) computeDamage(unit, t, rng, log, { base: eff.dmg, elem: 'fire' });
        break;
      }
      case 'scroll_storm': {
        const weakest = [...alive].sort((a, b) => a.hp - b.hp).slice(0, 2);
        for (const t of weakest) computeDamage(unit, t, rng, log, { base: eff.dmg, elem: 'storm' });
        break;
      }
      case 'scroll_frost': {
        for (const t of alive) {
          addStatus(t, { kind: 'slow', ticks: eff.ticks || 40, factor: eff.factor || 0.6 });
          log.push({ t: 'status', who: t.name, uid: t.uid, kind: 'slow' });
        }
        break;
      }
      case 'scroll_heal_mist': {
        for (const a of allies.filter((x) => x.hp > 0)) {
          const healed = Math.min(eff.amount, a.maxHp - a.hp);
          a.hp += healed;
          if (healed > 0) log.push({ t: 'dot', uid: a.uid, kind: 'regen', dmg: -healed });
        }
        break;
      }
    }
  }
}

function act(unit, allies, foes, rng, log, tactic, allUnits) {
  const sleep = unit.statuses.find((s) => s.kind === 'sleep');
  if (sleep) {
    sleep.ticks -= 1;
    if (sleep.ticks <= 0) {
      unit.statuses = unit.statuses.filter((s) => s !== sleep);
      log.push({ t: 'status_end', who: unit.name, uid: unit.uid, kind: 'sleep' });
    }
    log.push({ t: 'sleeps', who: unit.name, uid: unit.uid });
    return GAUGE_FULL;
  }
  // Свитки рыцаря — в первый подход
  if (unit.uid === 'a0') useScrolls(unit, allies, foes, rng, log);

  // Поддержка прежде всего: есть раненый союзник БЕЗ регенерации — лечим.
  // (Не хилим вечно: у цели уже тикает настой — идём травить дальше)
  if (unit.skills.includes('regen_ally_skill')) {
    const wounded = allies.filter((a) => a.hp > 0)
      .sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
    if (wounded && wounded.hp < wounded.maxHp * 0.8 && !hasStatus(wounded, 'regen')) {
      addStatus(wounded, { kind: 'regen', ticks: 25, dmg: 2 });
      log.push({ t: 'status', who: wounded.name, uid: wounded.uid, kind: 'regen', from: unit.name });
      return GAUGE_FULL;
    }
  }

  const range = effectiveRange(unit, allies);
  const target = pickTarget(unit, foes, rng, range);
  if (!target) {
    // Нет цели в дальности — манёвр к врагу (манёвр вдвое быстрее атаки).
    // Защита: союзные ближнебойцы держат строй, пока ЖИВ хоть один вражеский
    // ближнебоец — он сам идёт к нам. Против чистой артиллерии идём вперёд,
    // иначе бой встанет в тупик.
    const meleeFoeAlive = foes.some((f) => f.hp > 0 && !isRanged(f) && !f.caster);
    const holds = tactic === 'defense' && unit.side === 'ally' && !isRanged(unit) && meleeFoeAlive;
    if (!holds) {
      const goal = nearestEnemy(unit, foes);
      if (goal) stepToward(unit, goal, allUnits, log);
    }
    return GAUGE_FULL / 2;
  }

// Названия скиллов для лога: чтобы укус яда не выглядел обычным ударом
const SKILL_NAMES = {
  sting_poison: 'жалит ядом', sting_poison_weak: 'жалит слабым ядом',
  pollen_sleep: 'веет сонной пыльцой', slow_spores: 'выпускает споры',
  fear_chill: 'насылает страх', spit_fire: 'плюёт огнём',
  aimed_shot: 'прицельный выстрел', heavy_blow: 'тяжёлый удар',
  regen_ally_skill: 'целительный настой',
};

  let skill = unit.skills[0] && unit.skills[(unit._next || 0) % unit.skills.length];
  unit._next = (unit._next || 0) + 1;
  // Лечить некому (проверено выше) — не тратим ход на лечебный скилл, бьём ядом
  if (skill === 'regen_ally_skill' && unit.skills.length > 1) {
    skill = unit.skills.find((s) => s !== 'regen_ally_skill');
  }

  const sName = SKILL_NAMES[skill] || null;
  switch (skill) {
    case 'pollen_sleep':
      computeDamage(unit, target, rng, log, { skillMult: 0.6, skillName: sName });
      tryApplyStatus(unit, target, 'sleep', 0.3, { kind: 'sleep', ticks: 18 }, rng, log);
      break;
    case 'sting_poison':
      computeDamage(unit, target, rng, log, { skillName: sName });
      tryApplyStatus(unit, target, 'poison', 0.5, { kind: 'poison', ticks: 40, dmg: 2 }, rng, log);
      break;
    case 'sting_poison_weak':
      computeDamage(unit, target, rng, log, { skillName: sName });
      tryApplyStatus(unit, target, 'poison', 0.25, { kind: 'poison', ticks: 30, dmg: 1 }, rng, log);
      break;
    case 'slow_spores':
      computeDamage(unit, target, rng, log, { skillMult: 0.7, skillName: sName });
      tryApplyStatus(unit, target, 'slow', 0.5, { kind: 'slow', ticks: 40, factor: 0.6 }, rng, log);
      break;
    case 'heavy_blow':
      computeDamage(unit, target, rng, log, { skillMult: 1.6, skillName: sName });
      break;
    case 'fear_chill':
      computeDamage(unit, target, rng, log, { skillMult: 0.8, skillName: sName });
      tryApplyStatus(unit, target, 'fear', 0.5, { kind: 'fear', ticks: 35 }, rng, log);
      break;
    case 'spit_fire':
      computeDamage(unit, target, rng, log, { elem: 'fire', skillMult: 1.1, skillName: sName });
      break;
    case 'aimed_shot':
      computeDamage(unit, target, rng, log, { skillMult: 1.35, neverMiss: true, skillName: sName });
      break;
    case 'regen_ally_skill': {
      const wounded = allies.filter((a) => a.hp > 0).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
      if (wounded && wounded.hp < wounded.maxHp * 0.8) {
        addStatus(wounded, { kind: 'regen', ticks: 25, dmg: 2 });
        log.push({ t: 'status', who: wounded.name, uid: wounded.uid, kind: 'regen', from: unit.name });
      } else {
        computeDamage(unit, target, rng, log, { skillMult: 0.8, skillName: sName });
      }
      break;
    }
    default: {
      if (unit.traits?.includes('cleave_small')) {
        // Рассечение: по всем врагам в дальности
        const range = unitRange(unit);
        const others = foes.filter((f) => f !== target && f.hp > 0
          && cellDist(unit.cell, f.cell) <= range);
        computeDamage(unit, target, rng, log);
        for (const other of others) computeDamage(unit, other, rng, log, { skillMult: 0.4 });
      } else {
        computeDamage(unit, target, rng, log);
      }
    }
  }
  return GAUGE_FULL;
}

// units: [...allies, ...foes] со slot'ами и клетками. Возвращает { victory, log, report, ticks }
// События лога: start, hit, dodge, status (наложен), status_end (снят/истёк),
// sleeps, potion, scroll, move (шаг по полю), dot (тик яда/регенерации).
// tactic: 'defense' | 'balance' | 'offense' — модификаторы союзников на бой.
export function simulateFormationBattle(allies, foes, seed = 1, tactic = 'balance') {
  const rng = makeRng(seed);
  // Тактика команды: снимок модификаторов на этот бой
  if (tactic === 'defense') {
    for (const u of allies) {
      u.attack = Math.max(1, Math.round(u.attack * 0.85));
      u.armor = Math.round(u.armor * 1.25);
      u.dodge = (u.dodge || 0) + 0.12;
    }
  } else if (tactic === 'offense') {
    for (const u of allies) {
      u.attack = Math.max(1, Math.round(u.attack * 1.2));
      u.speed = u.speed * 1.1;
      u.armor = Math.round(u.armor * 0.85);
      u.dodge = Math.max(0, (u.dodge || 0) - 0.08);
    }
  }
  const log = [{ t: 'start', allies: allies.map((a) => a.name), foes: foes.map((f) => f.name) }];
  const knight = allies[0];

  // Начальные статусы (щит зелья, регенерация черты) — показать сразу
  for (const u of [...allies, ...foes]) {
    for (const s of u.statuses) {
      log.push({ t: 'status', who: u.name, uid: u.uid, kind: s.kind });
    }
  }

  const endStatus = (u, s) => log.push({ t: 'status_end', who: u.name, uid: u.uid, kind: s.kind });

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
          log.push({ t: 'dot', uid: u.uid, kind: 'poison', dmg: s.dmg });
          if (s.ticks <= 0) {
            u.statuses = u.statuses.filter((x) => x !== s);
            endStatus(u, s);
          }
        }
        if (s.kind === 'regen') {
          s.ticks -= 1;
          const healed = Math.min(s.dmg, u.maxHp - u.hp);
          u.hp += healed;
          if (healed > 0) log.push({ t: 'dot', uid: u.uid, kind: 'regen', dmg: -healed });
          if (s.ticks <= 0) {
            u.statuses = u.statuses.filter((x) => x !== s);
            endStatus(u, s);
          }
        }
        if (s.kind === 'fear') {
          s.ticks -= 1;
          if (s.ticks <= 0) {
            u.statuses = u.statuses.filter((x) => x !== s);
            endStatus(u, s);
          }
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
        if (slow.ticks <= 0) {
          u.statuses = u.statuses.filter((x) => x !== slow);
          endStatus(u, slow);
        }
      }
      u.gauge += spd;
    }
    const ready = [...allies, ...foes].filter((u) => u.hp > 0 && u.gauge >= GAUGE_FULL)
      .sort((a, b) => b.gauge - a.gauge);
    for (const u of ready) {
      if (u.gauge < GAUGE_FULL || u.hp <= 0) continue;
      const myAllies = u.side === 'ally' ? allies : foes;
      const myFoes = u.side === 'ally' ? foes : allies;
      const cost = act(u, myAllies, myFoes, rng, log, tactic, [...allies, ...foes]);
      u.gauge -= cost ?? GAUGE_FULL; // манёвр стоит вдвое дешевле атаки
      if (u.side === 'ally' && hasStatus(u, 'sleep')) u.stats.sleptTicks++;
    }
    if (foes.every((f) => f.hp <= 0) || allies.every((a) => a.hp <= 0)) break;
  }

  const victory = foes.every((f) => f.hp <= 0) && allies.some((a) => a.hp > 0);
  // Лимит ходов: бой затянулся, победитель не выявлен — засчитывается поражение
  const timedOut = !victory && tick >= MAX_TICKS;
  const report = {
    victory,
    timedOut,
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
    advice: victory
      ? null
      : timedOut
        ? 'Бой затянулся до предела — врагов не удалось добить вовремя. Поднимай атаку: оружие помощнее, крит, пробивание брони — или позови наёмников.'
        : adviceFor(knight, allies, foes, inferCause(knight)),
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
