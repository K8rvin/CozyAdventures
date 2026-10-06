// Состояние игры: экономика, инвентарь, прогресс, сохранения.
import { ITEM_BY_ID } from '../data/items.js';
import { SHOP_STOCK, CREW_STOCK } from '../data/shop.js';
import { PUZZLES } from '../data/puzzles.js';
import { SHELF_PUZZLES } from '../data/puzzlesShelf.js';
import { BOOK_PUZZLES } from '../data/puzzlesBook.js';
import { SEEK_PUZZLES } from '../data/puzzlesSeek.js';
import { BATTLES, BATTLE_BY_ID } from '../data/battles.js';
import { COMPANION_BY_ID, PET_BY_ID, MERC_BY_ID } from '../data/crew.js';
import { COSMETIC_BY_ID } from '../data/cosmetics.js';
import { RECIPES, RECIPE_BY_ID } from '../data/recipes.js';
import { emptyEquipment, equip, unequip, collectStats, isShieldBlocked } from './items.js';
import { makeKnight, makeMerc, simulateBattle } from './battle.js';
import { ENEMY_BY_ID } from '../data/enemies.js';

const SAVE_KEY = 'cozy_adventures_save_v2';

export function newGame() {
  return {
    coins: 80,
    seals: 0,
    materials: {},          // id -> count
    inventory: ['pot_heal'],
    equipped: { ...emptyEquipment(), weapon: 'wpn_rusty_sword', shield: 'shd_wooden' },
    consumableBelt: ['pot_heal'], // зелья, которые рыцарь берёт в бой (до 2)
    crew: [],               // нанятые: id спутников/питомцев/наёмников
    squadCompanions: [],    // спутники в отряде (до 3)
    squadMercs: [],         // наёмники в отряде (до 2)
    pet: null,              // активный питомец
    puzzlesDone: {},        // id -> { moves, hintsUsed }
    battlesDone: {},        // id -> { victories }
    customPuzzles: [],      // уровни из редактора
    cosmeticsOwned: [],     // купленные украшения
    cosmeticsActive: [],    // выставленные украшения
    tutorial: {},           // пройденные этапы обучения
    tutorialSkipped: false, // игрок пропустил обучение целиком
    stats: { puzzlesSolved: 0, battlesWon: 0, coinsEarned: 0 },
  };
}

// Миграция старых сохранений (v1 без crew)
function migrate(state) {
  state.crew ||= [];
  state.squadCompanions ||= [];
  state.squadMercs ||= [];
  state.pet ??= null;
  state.customPuzzles ||= [];
  state.cosmeticsOwned ||= [];
  state.cosmeticsActive ||= [];
  state.tutorial ||= {};
  state.tutorialSkipped ??= false;
  state.materials ||= {};
  state.seals ??= 0;
  return state;
}

// --- Экономика ---

export function addCoins(state, n) {
  state.coins += n;
  if (n > 0) state.stats.coinsEarned += n;
}

export function grantRewards(state, rewards, multipliers = {}) {
  const granted = [];
  for (const r of rewards) {
    if (r.type === 'coins') {
      const amount = Math.round(r.amount * (1 + (multipliers.goldFind || 0)));
      addCoins(state, amount);
      granted.push({ type: 'coins', amount });
    } else if (r.type === 'seals') {
      state.seals += r.amount;
      granted.push({ type: 'seals', amount: r.amount });
    } else if (r.type === 'item') {
      state.inventory.push(r.id);
      granted.push({ type: 'item', id: r.id });
    } else if (r.type === 'material') {
      state.materials[r.id] = (state.materials[r.id] || 0) + r.amount;
      granted.push({ type: 'material', id: r.id, amount: r.amount });
    }
  }
  return granted;
}

// --- Магазин ---

export function shopStock(state) {
  return SHOP_STOCK
    .filter((s) => s.unlockAfter === null || state.battlesDone[s.unlockAfter])
    .map((s) => ITEM_BY_ID[s.itemId]);
}

export function buyItem(state, itemId) {
  const item = ITEM_BY_ID[itemId];
  if (!item) return { ok: false, error: 'Нет такого товара' };
  const inStock = shopStock(state).some((i) => i.id === itemId);
  if (!inStock) return { ok: false, error: 'Товар ещё не на полке' };
  if (item.sealPrice) {
    if (state.seals < item.sealPrice) return { ok: false, error: 'Не хватает печатей мастера' };
    state.seals -= item.sealPrice;
  } else {
    if (state.coins < item.price) return { ok: false, error: 'Не хватает монет' };
    state.coins -= item.price;
  }
  state.inventory.push(itemId);
  state.stats.itemsBought = (state.stats.itemsBought || 0) + 1;

  // Авто-экипировка: если слот свободен (или есть место в поясе) — надеваем сразу.
  const auto = autoEquip(state, itemId);
  return { ok: true, autoEquipped: auto };
}

// Надеть вещь, только если целевой слот пуст (без замены).
// Возвращает { slot } | { belt: true } | null.
function autoEquip(state, itemId) {
  const item = ITEM_BY_ID[itemId];
  if (!item) return null;
  const index = state.inventory.lastIndexOf(itemId);
  if (index < 0) return null;

  if (item.slot === 'consumable') {
    if (state.consumableBelt.length >= 2) return null;
    state.inventory.splice(index, 1);
    state.consumableBelt.push(itemId);
    return { belt: true };
  }

  let slot = item.slot;
  if (slot === 'ring') {
    slot = !state.equipped.ring1 ? 'ring1' : !state.equipped.ring2 ? 'ring2' : null;
    if (!slot) return null;
  }
  if (slot === 'shield' && isShieldBlocked(state.equipped)) return null;
  if (state.equipped[slot]) return null; // слот занят — остаётся в сундуке

  const result = equip(state.equipped, itemId);
  if (!result.ok) return null;
  state.inventory.splice(index, 1);
  return { slot: result.slot };
}

export function sellItem(state, inventoryIndex) {
  const id = state.inventory[inventoryIndex];
  const item = ITEM_BY_ID[id];
  if (!item) return { ok: false };
  const price = Math.max(1, Math.floor(item.price / 2));
  state.inventory.splice(inventoryIndex, 1);
  addCoins(state, price);
  return { ok: true, price };
}

// --- Таверна и конюшня: спутники, питомцы, наёмники ---

const CREW_DEF = { companion: COMPANION_BY_ID, pet: PET_BY_ID, merc: MERC_BY_ID };

export function crewStock(state) {
  return CREW_STOCK
    .filter((s) => s.unlockAfter === null || state.battlesDone[s.unlockAfter])
    .map((s) => ({ ...CREW_DEF[s.kind][s.id], kind: s.kind, hired: state.crew.includes(s.id) }));
}

export function hireCrew(state, id, kind) {
  const def = CREW_DEF[kind]?.[id];
  if (!def) return { ok: false, error: 'Такого не бывает' };
  if (state.crew.includes(id)) return { ok: false, error: 'Уже в команде' };
  const purse = def.currency === 'seals' ? 'seals' : 'coins';
  if (state[purse] < def.price) return { ok: false, error: def.currency === 'seals' ? 'Не хватает печатей' : 'Не хватает монет' };
  state[purse] -= def.price;
  state.crew.push(id);
  // Автоматически в отряд, если есть место
  if (kind === 'companion' && state.squadCompanions.length < 3) state.squadCompanions.push(id);
  if (kind === 'merc' && state.squadMercs.length < 2) state.squadMercs.push(id);
  if (kind === 'pet' && !state.pet) state.pet = id;
  return { ok: true };
}

export function toggleCompanion(state, id) {
  const i = state.squadCompanions.indexOf(id);
  if (i >= 0) { state.squadCompanions.splice(i, 1); return { ok: true, active: false }; }
  if (state.squadCompanions.length >= 3) return { ok: false, error: 'В отряде место только для троих спутников' };
  if (!state.crew.includes(id)) return { ok: false, error: 'Сначала найми' };
  state.squadCompanions.push(id);
  return { ok: true, active: true };
}

export function toggleMerc(state, id) {
  const i = state.squadMercs.indexOf(id);
  if (i >= 0) { state.squadMercs.splice(i, 1); return { ok: true, active: false }; }
  if (state.squadMercs.length >= 2) return { ok: false, error: 'В бой идут максимум двое наёмников' };
  if (!state.crew.includes(id)) return { ok: false, error: 'Сначала найми' };
  state.squadMercs.push(id);
  return { ok: true, active: true };
}

export function setPet(state, id) {
  if (state.pet === id) { state.pet = null; return { ok: true, active: false }; }
  if (!state.crew.includes(id)) return { ok: false, error: 'Сначала приюти питомца' };
  state.pet = id;
  return { ok: true, active: true };
}

// --- Экипировка (делегирует core/items.js) ---

export function equipFromInventory(state, inventoryIndex) {
  const id = state.inventory[inventoryIndex];
  const item = ITEM_BY_ID[id];
  if (!item) return { ok: false, error: 'Нет такого предмета' };
  if (item.slot === 'consumable') {
    // Зелья — в пояс (до 2)
    if (state.consumableBelt.length >= 2) return { ok: false, error: 'В поясе только два кармашка' };
    state.inventory.splice(inventoryIndex, 1);
    state.consumableBelt.push(id);
    return { ok: true };
  }
  const result = equip(state.equipped, id);
  if (!result.ok) return result;
  state.inventory.splice(inventoryIndex, 1);
  for (const off of result.swappedOff || []) state.inventory.push(off);
  return { ok: true, slot: result.slot };
}

export function unequipToInventory(state, slot) {
  const id = unequip(state.equipped, slot);
  if (!id) return false;
  state.inventory.push(id);
  return true;
}

export function removeFromBelt(state, index) {
  const id = state.consumableBelt[index];
  if (!id) return false;
  state.consumableBelt.splice(index, 1);
  state.inventory.push(id);
  return true;
}

// --- Крафт: материалы → зелья и снаряжение ---

export function recipeList(state) {
  return RECIPES
    .filter((r) => r.unlockAfter === null || state.battlesDone[r.unlockAfter])
    .map((r) => {
      const check = canCraft(state, r.id);
      return { ...r, canCraft: check.ok, missing: check.missing || [], error: check.error };
    });
}

export function canCraft(state, recipeId) {
  const r = RECIPE_BY_ID[recipeId];
  if (!r) return { ok: false, error: 'Нет такого рецепта' };
  if (r.unlockAfter && !state.battlesDone[r.unlockAfter]) {
    return { ok: false, error: 'Рецепт ещё не открыт' };
  }
  const missing = [];
  for (const [matId, need] of Object.entries(r.materials)) {
    const have = state.materials[matId] || 0;
    if (have < need) missing.push({ matId, need, have });
  }
  if (missing.length > 0) return { ok: false, error: 'Не хватает материалов', missing };
  if (r.coins && state.coins < r.coins) return { ok: false, error: 'Не хватает монет' };
  return { ok: true };
}

export function craft(state, recipeId) {
  const check = canCraft(state, recipeId);
  if (!check.ok) return check;
  const r = RECIPE_BY_ID[recipeId];
  for (const [matId, need] of Object.entries(r.materials)) {
    state.materials[matId] -= need;
    if (state.materials[matId] <= 0) delete state.materials[matId];
  }
  if (r.coins) state.coins -= r.coins;
  const count = r.result.count || 1;
  for (let i = 0; i < count; i++) state.inventory.push(r.result.itemId);
  return { ok: true, itemId: r.result.itemId, count };
}

// --- Косметика лавки (только красота, без влияния на силу) ---

export function buyCosmetic(state, id) {
  const def = COSMETIC_BY_ID[id];
  if (!def) return { ok: false, error: 'Нет такого украшения' };
  if (state.cosmeticsOwned.includes(id)) return { ok: false, error: 'Уже куплено' };
  if (def.sealPrice) {
    if (state.seals < def.sealPrice) return { ok: false, error: 'Не хватает печатей мастера' };
    state.seals -= def.sealPrice;
  } else {
    if (state.coins < def.price) return { ok: false, error: 'Не хватает монет' };
    state.coins -= def.price;
  }
  state.cosmeticsOwned.push(id);
  state.cosmeticsActive.push(id); // сразу выставляем
  return { ok: true };
}

export function toggleCosmetic(state, id) {
  if (!state.cosmeticsOwned.includes(id)) return { ok: false };
  const i = state.cosmeticsActive.indexOf(id);
  if (i >= 0) state.cosmeticsActive.splice(i, 1);
  else state.cosmeticsActive.push(id);
  return { ok: true, active: i < 0 };
}

// --- Головоломки ---

// Полный список уровней кампании по порядку (миры 1, 2, 3 + поиск предметов).
const SEEK_BY_WORLD = (w) => SEEK_PUZZLES.filter((p) => p.world === w);
export const ALL_PUZZLES = [
  ...PUZZLES, ...SEEK_BY_WORLD('meadow'),
  ...SHELF_PUZZLES, ...SEEK_BY_WORLD('town'),
  ...BOOK_PUZZLES, ...SEEK_BY_WORLD('attic'),
];

export function allPuzzles(state) {
  return [...ALL_PUZZLES, ...(state.customPuzzles || [])];
}

export function findPuzzle(state, id) {
  return allPuzzles(state).find((p) => p.id === id) || null;
}

export function puzzleAvailable(state, index) {
  if (index === 0) return true;
  return !!state.puzzlesDone[ALL_PUZZLES[index - 1].id];
}

export function completePuzzle(state, puzzleId, info = {}) {
  const puzzle = findPuzzle(state, puzzleId);
  if (!puzzle) return null;
  const firstTime = !state.puzzlesDone[puzzleId];
  state.puzzlesDone[puzzleId] = {
    moves: info.moves ?? 0,
    hintsUsed: info.hintsUsed ?? 0,
    at: Date.now(),
  };
  state.stats.puzzlesSolved += 1;
  // Уровни из мастерской: скромная награда за повторное прохождение чужих загадок
  const rewards = puzzle.rewards || [{ type: 'coins', amount: 15 }];
  if (!firstTime) {
    const coins = rewards.find((r) => r.type === 'coins');
    const amount = coins ? Math.round(coins.amount / 3) : 10;
    addCoins(state, amount);
    return [{ type: 'coins', amount }];
  }
  return grantRewards(state, rewards);
}

// Следующая кампейн-головоломка после текущей (для кнопки «Следующая →»).
export function nextPuzzle(currentId) {
  const idx = ALL_PUZZLES.findIndex((p) => p.id === currentId);
  return idx >= 0 && idx + 1 < ALL_PUZZLES.length ? ALL_PUZZLES[idx + 1] : null;
}

// Первая нерешённая кампейн-головоломка (для автоскролла списка).
export function firstUnsolvedPuzzle(state) {
  return ALL_PUZZLES.find((p, i) => !state.puzzlesDone[p.id] && puzzleAvailable(state, i)) || null;
}

// Следующая битва после текущей (для кнопки «Следующая битва →»).
export function nextBattle(currentId) {
  const idx = BATTLES.findIndex((b) => b.id === currentId);
  return idx >= 0 && idx + 1 < BATTLES.length ? BATTLES[idx + 1] : null;
}

// Первая доступная непройденная битва (для автоскролла списка походов).
export function firstUnbeatenBattle(state) {
  return BATTLES.find((b) => !state.battlesDone[b.id] && battleAvailable(state, b.id)) || null;
}

// --- Бои ---

export function battleAvailable(state, battleId) {
  const b = BATTLE_BY_ID[battleId];
  if (!b) return false;
  return b.unlockAfter === null || !!state.battlesDone[b.unlockAfter];
}

export function runBattle(state, battleId, seed = 1) {
  const battle = BATTLE_BY_ID[battleId];
  if (!battle || !battleAvailable(state, battleId)) return null;

  const { stats, traits } = collectStats(state.equipped);
  // Бонусы спутников и питомца
  for (const cid of state.squadCompanions) {
    const c = COMPANION_BY_ID[cid];
    if (!c) continue;
    for (const [k, v] of Object.entries(c.bonus || {})) stats[k] = (stats[k] || 0) + v;
    if (c.trait) traits.push(c.trait);
  }
  if (state.pet && PET_BY_ID[state.pet]) {
    for (const [k, v] of Object.entries(PET_BY_ID[state.pet].bonus || {})) {
      stats[k] = (stats[k] || 0) + v;
    }
  }
  const consumables = state.consumableBelt
    .map((id) => ITEM_BY_ID[id])
    .filter(Boolean)
    .map((item) => ({ itemId: item.id, name: item.name, effect: item.effect }));

  const knight = makeKnight(stats, traits, consumables);
  const allies = [knight, ...state.squadMercs.map((id) => makeMerc(MERC_BY_ID[id])).filter((m) => m.hp)];
  const result = simulateBattle(allies, battle.enemies, seed);

  // Использованные зелья уходят из пояса.
  const usedIds = knight.potions.filter((p) => p.used).map((p) => p.itemId);
  for (const used of usedIds) {
    const i = state.consumableBelt.indexOf(used);
    if (i >= 0) state.consumableBelt.splice(i, 1);
  }

  let rewards = [];
  if (result.victory) {
    const firstTime = !state.battlesDone[battleId];
    state.battlesDone[battleId] = {
      victories: (state.battlesDone[battleId]?.victories || 0) + 1,
      at: Date.now(),
    };
    state.stats.battlesWon += 1;
    for (const enemyId of battle.enemies) {
      const def = enemyReward(enemyId, stats, seed);
      rewards.push(...def);
    }
    grantRewards(state, rewards, {});
    // Лечение после боя от амулета очага.
    if (traits.includes('heal_after_battle')) {
      rewards.push({ type: 'note', text: 'Амулет очага согрел рыцаря после боя.' });
    }
    if (!firstTime) rewards = rewards.map((r) => (r.type === 'coins' ? { ...r, amount: Math.round(r.amount * 0.5) } : r));
  }
  return { ...result, rewards, battle };
}

function enemyReward(enemyId, knightStats, seed) {
  // Детерминированная награда: среднее диапазона, goldFind влияет.
  const def = enemyRewardDef(enemyId);
  if (!def) return [];
  const out = [];
  if (def.coins) {
    const base = Math.round((def.coins[0] + def.coins[1]) / 2);
    out.push({ type: 'coins', amount: Math.round(base * (1 + (knightStats.goldFind || 0))) });
  }
  if (def.seals) out.push({ type: 'seals', amount: def.seals });
  if (def.materials) {
    // Ездовой питомец: материалов больше
    const matMult = (knightStats.materialsFind || 0) >= 0.5 ? 2 : 1;
    for (const m of def.materials) out.push({ type: 'material', id: m, amount: matMult });
  }
  return out;
}

function enemyRewardDef(enemyId) {
  return ENEMY_BY_ID[enemyId]?.reward;
}

// --- Сохранения ---

export function saveGame(state, storage) {
  const s = storage || (typeof localStorage !== 'undefined' ? localStorage : null);
  if (!s) return false;
  s.setItem(SAVE_KEY, JSON.stringify(state));
  return true;
}

export function loadGame(storage) {
  const s = storage || (typeof localStorage !== 'undefined' ? localStorage : null);
  if (!s) return null;
  try {
    const raw = s.getItem(SAVE_KEY) || s.getItem('cozy_adventures_save_v1');
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data.coins !== 'number') return null;
    return migrate(data);
  } catch {
    return null;
  }
}

export { SLOTS, collectStats, isShieldBlocked } from './items.js';
