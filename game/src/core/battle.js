// Тиковый автобой. Детерминирован по seed. Чистая логика, без DOM.
// Юнит действует, когда его шкала действия (gauge) заполняется до 100.
// Скорость gauge = speed юнита за тик.

import { makeRng } from './rng.js';
import { ENEMY_BY_ID } from '../data/enemies.js';

const GAUGE_FULL = 100;
const MAX_TICKS = 5000;

function makeEnemy(id, scale = 1) {
  const def = ENEMY_BY_ID[id];
  const hp = Math.round(def.hp * scale);
  return {
    id, side: 'enemy', name: def.name, icon: def.icon, boss: !!def.boss,
    hp, maxHp: hp,
    attack: Math.round(def.attack * scale), armor: Math.round(def.armor * scale), speed: def.speed,
    crit: def.crit || 0, dodge: def.dodge || 0, block: 0,
    elem: def.elem || 'phys',
    skills: def.skills || [], tags: def.tags || [],
    resist: {}, statuses: [], gauge: 0, cooldowns: {},
    stats: { dealt: 0, taken: 0 },
  };
}

export function makeKnight(knightStats, traits, consumables) {
  const statuses = [];
  // Спутник-травница: тихая регенерация весь бой
  if ((traits || []).includes('regen_ally')) {
    statuses.push({ kind: 'regen', ticks: 9999, dmg: 1, source: 'Травница' });
  }
  const resist = { ...(knightStats.resist || {}) };
  // Амулет отваги: полный иммунитет к страху
  if ((traits || []).includes('fearless')) resist.fear = 1;
  // Зелья с эффектом "в начале боя" применяются сразу и помечаются использованными
  const potions = (consumables || []).map((c) => {
    const p = { ...c, used: false };
    if (p.effect?.kind === 'shield' && p.effect.atStart) {
      statuses.push({ kind: 'shield', amount: p.effect.amount });
      p.used = true;
    }
    return p;
  });
  return {
    id: 'knight', side: 'ally', name: 'Рыцарь лавки', icon: '🛡️',
    hp: knightStats.hp, maxHp: knightStats.hp,
    attack: knightStats.attack, armor: knightStats.armor, speed: knightStats.speed,
    crit: knightStats.crit, dodge: knightStats.dodge, block: knightStats.block,
    elem: 'phys', skills: [], tags: [],
    traits: traits || [],
    resist,
    potions,
    statuses, gauge: 0, cooldowns: {},
    stats: { dealt: 0, taken: 0, sleptTicks: 0, poisonTicks: 0 },
  };
}

// Наёмник из данных crew.js — полноценный союзник.
export function makeMerc(def) {
  return {
    id: def.id, side: 'ally', name: def.name, icon: def.icon,
    hp: def.hp, maxHp: def.hp,
    attack: def.attack, armor: def.armor, speed: def.speed,
    crit: def.crit || 0, dodge: def.dodge || 0, block: def.block || 0,
    elem: 'phys', skills: def.skills || [], tags: def.tags || [],
    resist: {}, traits: [],
    statuses: [], gauge: 0, cooldowns: {},
    stats: { dealt: 0, taken: 0 },
  };
}

function hasStatus(u, kind) {
  return u.statuses.some((s) => s.kind === kind);
}

function addStatus(u, status) {
  const existing = u.statuses.find((s) => s.kind === status.kind);
  if (existing) Object.assign(existing, status);
  else u.statuses.push(status);
}

function resistOf(u, kind) {
  return u.resist[kind] || 0;
}

// Урон: атака × стихия × броневой множитель × крит. Броня: 100/(100+броня).
function computeDamage(attacker, defender, rng, log, opts = {}) {
  // Уклонение
  if (!opts.neverMiss && rng.chance(defender.dodge)) {
    log.push({ t: 'dodge', who: defender.name, uid: defender.uid });
    return 0;
  }
  let mult = 1;
  // Бонус против типа (духи)
  if (attacker.traits?.includes('bonus_spirit') && defender.tags?.includes('spirit')) mult *= 1.3;
  // Стихийное сопротивление цели
  const elem = opts.elem || attacker.elem || 'phys';
  if (elem !== 'phys') mult *= 1 - resistOf(defender, elem);
  // Броня
  let armor = defender.armor;
  if (attacker.traits?.includes('pierce')) armor *= 0.5;
  mult *= 100 / (100 + Math.max(0, armor));
  // Крит
  let crit = false;
  if (rng.chance(attacker.crit)) { mult *= 1.75; crit = true; }
  // Страх: −30% к урону
  if (hasStatus(attacker, 'fear')) mult *= 0.7;
  // Блок щитом
  let blocked = false;
  if (rng.chance(defender.block)) { mult *= 0.6; blocked = true; }
  // Первый удар по «Броне дубового стража»
  if (defender.traits?.includes('first_hit_reduction') && defender.stats.taken === 0) mult *= 0.8;

  const raw = (opts.base ?? attacker.attack) * (opts.skillMult || 1) * mult;
  const dmg = Math.max(1, Math.round(raw));

  // Щит-статус поглощает
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
    dmg: remaining, crit, blocked, elem,
  });
  return remaining;
}

function tryApplyStatus(attacker, defender, kind, chance, status, rng, log) {
  const effective = chance * (1 - resistOf(defender, kind));
  if (rng.chance(effective)) {
    addStatus(defender, status);
    log.push({ t: 'status', who: defender.name, uid: defender.uid, kind });
    return true;
  }
  return false;
}

function pickTarget(attacker, foes, rng) {
  const alive = foes.filter((f) => f.hp > 0);
  if (alive.length === 0) return null;
  // Лучники бьют самого хрупкого, остальные — случайного
  if (attacker.traits?.includes('ranged') || attacker.tags?.includes('ranged')) {
    return alive.reduce((a, b) => (a.hp < b.hp ? a : b));
  }
  return rng.pick(alive);
}

// Тактика зелий: проверяется каждый тик, чтобы зелье лечения
// успевало выпиться даже между ходами, а бодрость будила сразу.
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
    // Зелья-очистки: cleanse_sleep, cleanse_poison и т.п.
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

function act(unit, allies, foes, rng, log, tick) {
  // Сон: пропуск хода
  const sleep = unit.statuses.find((s) => s.kind === 'sleep');
  if (sleep) {
    sleep.ticks -= 1;
    if (sleep.ticks <= 0) unit.statuses = unit.statuses.filter((s) => s !== sleep);
    log.push({ t: 'sleeps', who: unit.name, uid: unit.uid });
    return;
  }

  const target = pickTarget(unit, foes, rng);
  if (!target) return;

  // Навыки врагов
  const skill = unit.skills[0] && unit.skills[(unit.cooldowns._next || 0) % unit.skills.length];
  unit.cooldowns._next = (unit.cooldowns._next || 0) + 1;

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
    case 'spit_fire':
      computeDamage(unit, target, rng, log, { elem: 'fire', skillMult: 1.1 });
      break;
    case 'fear_chill':
      // Леденящий ужас: урон + страх (−30% к урону цели)
      computeDamage(unit, target, rng, log, { skillMult: 0.8 });
      tryApplyStatus(unit, target, 'fear', 0.5, { kind: 'fear', ticks: 35 }, rng, log);
      break;
    case 'aimed_shot':
      // Прицельный выстрел по самому хрупкому (цель уже выбрана ranged-логикой)
      computeDamage(unit, target, rng, log, { skillMult: 1.35, neverMiss: true });
      break;
    case 'regen_ally_skill': {
      // Поддержка: настой самому раненому союзнику вместо атаки
      const wounded = allies.filter((a) => a.hp > 0).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
      if (wounded && wounded.hp < wounded.maxHp * 0.8) {
        addStatus(wounded, { kind: 'regen', ticks: 25, dmg: 2, source: unit.name });
        log.push({ t: 'status', who: wounded.name, uid: wounded.uid, kind: 'regen', from: unit.name });
      } else {
        computeDamage(unit, target, rng, log, { skillMult: 0.8 });
      }
      break;
    }
    default: {
      // Рыцарь: рассечение двуручным оружием
      if (unit.traits?.includes('cleave_small')) {
        const alive = foes.filter((f) => f.hp > 0);
        computeDamage(unit, target, rng, log);
        for (const other of alive) {
          if (other !== target) computeDamage(unit, other, rng, log, { skillMult: 0.4 });
        }
      } else {
        computeDamage(unit, target, rng, log);
      }
    }
  }
}

// Прогон всего боя. allies — массив юнитов (рыцарь первым), enemyIds — id врагов.
// Возвращает { victory, log, report, ticks }
export function simulateBattle(alliesInput, enemyIds, seed = 1) {
  const rng = makeRng(seed);
  const allies = Array.isArray(alliesInput) ? alliesInput : [alliesInput];
  const knight = allies[0];
  const foes = enemyIds.map((entry) => (typeof entry === 'string' ? makeEnemy(entry) : makeEnemy(entry.id, entry.scale)));
  // Уникальные uid для привязки анимации к конкретному юниту (имена могут совпадать)
  allies.forEach((u, i) => { u.uid = `a${i}`; });
  foes.forEach((u, i) => { u.uid = `e${i}`; });
  const log = [{ t: 'start', allies: allies.map((a) => a.name), foes: foes.map((f) => f.name) }];

  let tick = 0;
  while (tick < MAX_TICKS) {
    tick++;
    // Тик статусов (яд, реген)
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
    // Шкалы действия и тактика зелий
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
    // Действия (по убыванию gauge, чтобы не было гонок)
    const ready = [...allies, ...foes].filter((u) => u.hp > 0 && u.gauge >= GAUGE_FULL)
      .sort((a, b) => b.gauge - a.gauge);
    for (const u of ready) {
      if (u.gauge < GAUGE_FULL || u.hp <= 0) continue;
      u.gauge -= GAUGE_FULL;
      const myAllies = u.side === 'ally' ? allies : foes;
      const myFoes = u.side === 'ally' ? foes : allies;
      act(u, myAllies, myFoes, rng, log, tick);
      if (u.side === 'ally' && hasStatus(u, 'sleep')) u.stats.sleptTicks++;
    }
    if (foes.every((f) => f.hp <= 0) || allies.every((a) => a.hp <= 0)) break;
  }

  const victory = foes.every((f) => f.hp <= 0) && allies.some((a) => a.hp > 0);
  const report = buildReport(knight, allies, foes, victory, log);
  return { victory, log, report, ticks: tick };
}

function buildReport(knight, allies, foes, victory, log) {
  const deathCause = knight.hp > 0 ? null : inferDeathCause(knight, log);
  return {
    victory,
    knightHpLeft: Math.max(0, knight.hp),
    knightHpMax: knight.maxHp,
    dealt: allies.reduce((sum, a) => sum + a.stats.dealt, 0),
    taken: knight.stats.taken,
    alliesDown: allies.filter((a) => a.hp <= 0).map((a) => a.name),
    alliesStats: allies.map((a) => ({ name: a.name, icon: a.icon, dealt: a.stats.dealt, taken: a.stats.taken, alive: a.hp > 0 })),
    foesDown: foes.filter((f) => f.hp <= 0).length,
    foesTotal: foes.length,
    slept: knight.stats.sleptTicks > 0,
    poisoned: knight.stats.poisonTicks > 0,
    deathCause,
    advice: victory ? null : adviceFor(knight, allies, foes, deathCause),
  };
}

function inferDeathCause(knight, log) {
  // Последние события урона по рыцарю
  const hits = log.filter((e) => e.t === 'hit' && e.to === knight.name);
  const last = hits[hits.length - 1];
  if (knight.stats.sleptTicks > 0) return 'sleep';
  if (knight.stats.poisonTicks > 20) return 'poison';
  if (last && last.elem === 'fire') return 'fire';
  return 'phys';
}

function adviceFor(knight, allies, foes, cause) {
  switch (cause) {
    case 'sleep':
      return 'Рыцарь уснул от пыльцы ночных мотыльков. Попробуй шлем с сопротивлением сну или зелье бодрости.';
    case 'poison':
      return 'Яд медленно съедал здоровье. Помогут перчатки травницы или амулет противоядия.';
    case 'fire':
      return 'Огонь жёг слишком сильно. Пригодится амулет с сопротивлением огню.';
    default: {
      const tough = foes.some((f) => f.armor >= 14);
      if (knight.stats.dealt < 50 && tough) {
        return 'Урон едва пробивал толстую шкуру. Нужно оружие потяжелее — например, двуручное.';
      }
      if (allies.length === 1) {
        return 'Рыцарь дрался в одиночку. В таверне можно нанять помощника — например, лучницу или громилу.';
      }
      return 'Не хватило живучести. Проверь броню, щит и не забудь зелье лечения.';
    }
  }
}
