// Экипировка: 9 слотов, правило двуручного оружия, сборка характеристик.
import { ITEM_BY_ID } from '../data/items.js';

// Порядок = раскладка 3×3 в комнате рыцаря:
// оружие · шлем · щит / перчатки · броня · сапоги / амулет · кольца
export const SLOTS = ['weapon', 'helmet', 'shield', 'gloves', 'armor', 'boots', 'amulet', 'ring1', 'ring2'];

export const SLOT_LABEL = {
  weapon: 'Оружие', shield: 'Щит', helmet: 'Шлем', armor: 'Броня',
  gloves: 'Перчатки', boots: 'Сапоги', amulet: 'Амулет',
  ring1: 'Кольцо 1', ring2: 'Кольцо 2',
};

export function emptyEquipment() {
  return Object.fromEntries(SLOTS.map((s) => [s, null]));
}

// Двуручное оружие блокирует слот щита.
export function isShieldBlocked(equipment) {
  const w = equipment.weapon && ITEM_BY_ID[equipment.weapon];
  return !!(w && w.hand === 'two');
}

// Попытка надеть предмет. Возвращает { ok, error?, swappedOff?: [id...] }
export function equip(equipment, itemId) {
  const item = ITEM_BY_ID[itemId];
  if (!item) return { ok: false, error: 'Нет такого предмета' };
  if (item.slot === 'consumable') return { ok: false, error: 'Зелья надеваются в кармашки боя' };

  const swappedOff = [];
  let slot = item.slot;
  if (slot === 'ring') {
    slot = !equipment.ring1 ? 'ring1' : !equipment.ring2 ? 'ring2' : 'ring1';
    if (equipment[slot]) swappedOff.push(equipment[slot]);
  }

  if (slot === 'shield' && isShieldBlocked(equipment)) {
    return { ok: false, error: 'Двуручное оружие занимает обе руки — щит не надеть' };
  }

  if (equipment[slot]) swappedOff.push(equipment[slot]);
  equipment[slot] = itemId;

  // Надели двуручное — щит уходит в инвентарь.
  if (slot === 'weapon' && item.hand === 'two' && equipment.shield) {
    swappedOff.push(equipment.shield);
    equipment.shield = null;
  }
  return { ok: true, swappedOff, slot };
}

export function unequip(equipment, slot) {
  if (!SLOTS.includes(slot) || !equipment[slot]) return null;
  const id = equipment[slot];
  equipment[slot] = null;
  return id;
}

// Итоговые характеристики рыцаря = база + сумма предметов.
export const KNIGHT_BASE = {
  hp: 60, attack: 8, armor: 6, speed: 10, crit: 0.05, dodge: 0.03, block: 0,
  goldFind: 0, itemFind: 0, resist: {},
};

export function collectStats(equipment) {
  const s = { ...KNIGHT_BASE, resist: { ...KNIGHT_BASE.resist } };
  const traits = [];
  for (const slot of SLOTS) {
    const id = equipment[slot];
    if (!id) continue;
    const item = ITEM_BY_ID[id];
    if (!item || !item.stats) continue;
    for (const [k, v] of Object.entries(item.stats)) {
      if (k === 'resist') {
        for (const [rk, rv] of Object.entries(v)) {
          // Сопротивления складываются мультипликативно: 1-(1-a)(1-b)
          s.resist[rk] = 1 - (1 - (s.resist[rk] || 0)) * (1 - rv);
        }
      } else {
        s[k] = (s[k] || 0) + v;
      }
    }
    if (item.traits) traits.push(...item.traits);
  }
  s.hp = Math.max(1, s.hp);
  s.crit = Math.min(0.95, Math.max(0, s.crit));
  s.dodge = Math.min(0.8, Math.max(0, s.dodge));
  s.block = Math.min(0.8, Math.max(0, s.block));
  return { stats: s, traits };
}

// Краткое текстовое описание характеристик предмета для UI.
export function describeItem(item) {
  const parts = [];
  const L = {
    hp: 'здоровье', attack: 'атака', armor: 'броня', speed: 'скорость',
    crit: 'крит', dodge: 'уклонение', block: 'блок',
    goldFind: 'монеты', itemFind: 'находки', materialsFind: 'материалы',
  };
  const RL = { fire: 'огню', poison: 'яду', sleep: 'сну', slow: 'замедлению', fear: 'страху' };
  for (const [k, v] of Object.entries(item.stats || {})) {
    if (k === 'resist') {
      for (const [rk, rv] of Object.entries(v)) {
        parts.push(`сопр. ${RL[rk] || rk} +${Math.round(rv * 100)}%`);
      }
    } else if (k === 'crit' || k === 'dodge' || k === 'block' || k === 'goldFind' || k === 'itemFind' || k === 'materialsFind') {
      parts.push(`${L[k]} +${Math.round(v * 100)}%`);
    } else {
      parts.push(`${L[k] || k} ${v > 0 ? '+' : ''}${v}`);
    }
  }
  if (item.hand === 'two') parts.push('двуручное (без щита)');
  return parts.join(', ');
}
