// Состояние игры: экономика, инвентарь, прогресс, сохранения.
import { ITEM_BY_ID } from '../data/items.js';
import { SHOP_STOCK, CREW_STOCK } from '../data/shop.js';
import { PUZZLES } from '../data/puzzles.js';
import { SHELF_PUZZLES } from '../data/puzzlesShelf.js';
import { BOOK_PUZZLES } from '../data/puzzlesBook.js';
import { SEEK_PUZZLES } from '../data/puzzlesSeek.js';
import { PATH_PUZZLES } from '../data/puzzlesPath.js';
import { TEA_PUZZLES } from '../data/puzzlesTea.js';
import { BATTLES, BATTLE_BY_ID } from '../data/battles.js';
import { COMPANION_BY_ID, PET_BY_ID, MERC_BY_ID } from '../data/crew.js';
import { COSMETIC_BY_ID } from '../data/cosmetics.js';
import { RECIPES, RECIPE_BY_ID } from '../data/recipes.js';
import { MATERIALS } from '../data/materials.js';
import { emptyEquipment, equip, unequip, collectStats, isShieldBlocked } from './items.js';
import { makeKnight, makeMerc, simulateBattle } from './battle.js';
import {
  makeFormationKnight, makeFormationMerc, makeFormationEnemy,
  simulateFormationBattle, enemyFormationSlots,
} from './formBattle.js';
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
    seekOverrides: {},      // правки хотспотов искалок из редактора: levelId -> groups
    shopSeenStock: [],      // id товаров прилавка, которые игрок уже видел
    tutorial: {},           // пройденные этапы обучения
    tutorialSkipped: false, // игрок пропустил обучение целиком
    settings: { battleMode: 'formation' }, // 'classic' | 'formation'
    formation: { knight: 1, merc0: 0, merc1: 5 }, // слоты 0-2 передний ряд, 3-5 задний
    cheats: { used: [], spiderHat: false }, // активированные читы и пасхалки
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
  state.seekOverrides ||= {};
  state.shopSeenStock ||= [];
  state.tutorial ||= {};
  state.tutorialSkipped ??= false;
  state.settings ||= {};
  state.settings.battleMode ||= 'formation';
  state.formation ||= { knight: 1, merc0: 0, merc1: 5 };
  state.cheats ||= { used: [], spiderHat: false };
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

// Товары, появившиеся в продаже с последнего визита в прилавок.
export function unseenShopItems(state) {
  const seen = new Set(state.shopSeenStock || []);
  return shopStock(state).filter((i) => !seen.has(i.id));
}

// Отметить весь текущий ассортимент как просмотренный.
export function markShopSeen(state) {
  state.shopSeenStock = shopStock(state).map((i) => i.id);
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
  if (kind === 'merc' && state.squadMercs.length < 2) {
    const idx = state.squadMercs.length;
    state.squadMercs.push(id);
    // Авторасстановка: танк в передний ряд, остальные — назад
    const key = `merc${idx}`;
    const isTank = def.role === 'танк';
    const wantSlots = isTank ? [0, 2] : [4, 5, 3];
    const taken = Object.values(state.formation);
    state.formation[key] = wantSlots.find((s) => !taken.includes(s)) ?? (isTank ? 0 : 4);
  }
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

// Полный список уровней кампании. Механики ЧЕРЕДУЮТСЯ (свет, полки, книги,
// поиск), чтобы не идти одной тематикой подряд; внутри каждой механики
// сложность растёт по своей цепочке.
const PUZZLE_POOL = new Map(
  [...PUZZLES, ...SHELF_PUZZLES, ...BOOK_PUZZLES, ...SEEK_PUZZLES, ...PATH_PUZZLES, ...TEA_PUZZLES]
    .map((p) => [p.id, p]),
);
const CAMPAIGN_ORDER = [
  'md_01', 'md_02', 'sk_md_01', 'md_03', 'md_04', 'sk_md_02',
  'md_05', 'tw_01', 'md_06', 'tw_02', 'md_07', 'tw_03', 'sk_tw_01',
  'md_08', 'tw_04', 'md_09', 'tw_05', 'md_10', 'tw_06', 'sk_tw_02',
  'md_11', 'tw_07', 'bk_01', 'tw_08', 'bk_02', 'md_12',
  'bk_03', 'tw_09', 'bk_04', 'sk_bk_01',
  'bk_05', 'tw_10', 'bk_06', 'bk_07', 'sk_bk_02', 'bk_08', 'bk_09', 'bk_10',
  // Перекрёсток: тропинки и чай вперемешку с поиском
  'pp_01', 'tea_01', 'pp_02', 'tea_02', 'pp_03', 'tea_03',
  'pp_04', 'tea_04', 'pp_05', 'tea_05', 'pp_06', 'tea_06',
  'pp_07', 'tea_07', 'pp_08', 'tea_08',
  // Искалки новых миров
  'sk_nm_01', 'sk_sw_01', 'sk_sf_01', 'sk_ash_01',
  'sk_cr_01', 'sk_jade_01', 'sk_deep_01', 'sk_mist_01',
];
export const ALL_PUZZLES = CAMPAIGN_ORDER.map((id) => PUZZLE_POOL.get(id));

export function allPuzzles(state) {
  return [...ALL_PUZZLES, ...(state.customPuzzles || [])];
}

export function findPuzzle(state, id) {
  return allPuzzles(state).find((p) => p.id === id) || null;
}

// Уровень искалки с учётом правок из редактора хотспотов.
// Правки хранятся ОТДЕЛЬНО от сохранения игры (инструмент разработчика):
// новая игра их не стирает.
const SEEK_OVERRIDES_KEY = 'cozy_seek_overrides_v1';

function overrideStorage(storage) {
  return storage || (typeof localStorage !== 'undefined' ? localStorage : null);
}

export function loadSeekOverrides(storage) {
  const s = overrideStorage(storage);
  if (!s) return {};
  try {
    return JSON.parse(s.getItem(SEEK_OVERRIDES_KEY) || '{}');
  } catch {
    return {};
  }
}

export function applySeekOverrides(state, level, storage) {
  const ov = loadSeekOverrides(storage)[level.id] || state.seekOverrides?.[level.id];
  if (!ov || level.mechanic !== 'seek') return level;
  return { ...level, groups: JSON.parse(JSON.stringify(ov)) };
}

export function saveSeekOverride(state, levelId, groups, storage) {
  const all = loadSeekOverrides(storage);
  all[levelId] = JSON.parse(JSON.stringify(groups));
  const s = overrideStorage(storage);
  if (s) s.setItem(SEEK_OVERRIDES_KEY, JSON.stringify(all));
  else state.seekOverrides[levelId] = all[levelId]; // фолбэк в сохранение
}

export function resetSeekOverride(state, levelId, storage) {
  const all = loadSeekOverrides(storage);
  delete all[levelId];
  const s = overrideStorage(storage);
  if (s) s.setItem(SEEK_OVERRIDES_KEY, JSON.stringify(all));
  delete state.seekOverrides[levelId];
}

// Миграция правок из старого сохранения в отдельное хранилище.
function migrateSeekOverrides(state, storage) {
  const legacy = state.seekOverrides || {};
  if (Object.keys(legacy).length === 0) return;
  const all = { ...legacy, ...loadSeekOverrides(storage) }; // новые правки важнее
  const s = overrideStorage(storage);
  if (s) s.setItem(SEEK_OVERRIDES_KEY, JSON.stringify(all));
  state.seekOverrides = {};
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

// Пропуск головоломки за монеты: цепочка открывается, но наград нет.
export function skipPuzzlePrice(puzzle) {
  const coins = (puzzle.rewards || []).find((r) => r.type === 'coins');
  return Math.max(50, Math.round((coins?.amount || 50) * 1.5));
}

export function skipPuzzle(state, puzzleId) {
  const puzzle = findPuzzle(state, puzzleId);
  if (!puzzle) return { ok: false, error: 'Нет такой загадки' };
  const idx = ALL_PUZZLES.findIndex((p) => p.id === puzzleId);
  if (idx >= 0 && !puzzleAvailable(state, idx)) {
    return { ok: false, error: 'Загадка ещё не открыта' };
  }
  if (state.puzzlesDone[puzzleId]) return { ok: false, error: 'Уже решена' };
  const price = skipPuzzlePrice(puzzle);
  if (state.coins < price) return { ok: false, error: 'Не хватает монет', price };
  state.coins -= price;
  state.puzzlesDone[puzzleId] = { moves: 0, hintsUsed: 0, skipped: true, at: Date.now() };
  state.stats.puzzlesSolved += 1;
  // Утешение от кота-хранителя: треть монет уровня, без предметов и печатей
  const coins = (puzzle.rewards || []).find((r) => r.type === 'coins');
  const consolation = Math.round((coins?.amount || 30) / 3);
  addCoins(state, consolation);
  return { ok: true, price, consolation };
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
  if ((state.settings?.battleMode || 'formation') === 'formation') {
    return runFormationBattle(state, battle, seed);
  }
  return runClassicBattle(state, battle, seed);
}

function runClassicBattle(state, battle, seed) {

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
    const firstTime = !state.battlesDone[battle.id];
    state.battlesDone[battle.id] = {
      victories: (state.battlesDone[battle.id]?.victories || 0) + 1,
      at: Date.now(),
    };
    state.stats.battlesWon += 1;
    for (const entry of battle.enemies) {
      const enemyId = typeof entry === 'string' ? entry : entry.id;
      const scale = typeof entry === 'string' ? 1 : (entry.scale || 1);
      const def = enemyReward(enemyId, stats, seed);
      for (const r of def) {
        if (r.type === 'coins') r.amount = Math.round(r.amount * scale);
        rewards.push(r);
      }
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

// --- Чит-коды и пасхалки (тестовый инструментарий) ---

const CHEATS = {
  'КОТОПЁС': (state) => {
    addCoins(state, 1000);
    return '+1000 монет. Кот и пёс довольны.';
  },
  'ЗОЛОТАЯЛАВКА': (state) => {
    addCoins(state, 10000);
    return '+10000 монет. Прилавок прогибается!';
  },
  'ПЕЧАЛЬ': (state) => {
    state.seals += 10;
    return '+10 печатей мастера. Не печалься.';
  },
  'КОЛДОВСТВО': (state) => {
    for (const m of MATERIALS) {
      state.materials[m.id] = (state.materials[m.id] || 0) + 10;
    }
    return 'Все материалы ×10. Склад ломится.';
  },
  'РЫЦАРЬ': (state) => {
    const set = ['wpn_firebird_quill', 'shd_tower', 'hlm_page_wanderer', 'arm_ink_cloak',
      'glv_smithee', 'bt_quiet_step', 'amu_pages', 'rng_duelist', 'rng_contents'];
    for (const id of set) state.inventory.push(id);
    return 'Легендарный комплект — в сундуке. Надень с честью.';
  },
  'ОБУЧЕНИЕ': (state) => {
    state.tutorial = {};
    state.tutorialSkipped = false;
    return 'Обучение сброшено. Кот-хранитель снова всё покажет.';
  },
  'ПАУЧОК': (state) => {
    state.cheats.spiderHat = !state.cheats.spiderHat;
    return state.cheats.spiderHat
      ? 'Паучок надел праздничную шляпу 🎩'
      : 'Паучок снял шляпу.';
  },
};

// Применить чит-код. Возвращает { ok, message }
export function applyCheat(state, rawCode) {
  const code = (rawCode || '').trim().toUpperCase().replaceAll(' ', '');
  if (!code) return { ok: false, message: 'Пусто. Кот недоумённо моргнул.' };
  if (!CHEATS[code]) {
    return { ok: false, message: 'Мяу? Такого заклинания лавка не знает.' };
  }
  const message = CHEATS[code](state);
  if (!state.cheats.used.includes(code)) state.cheats.used.push(code);
  return { ok: true, message };
}

export function cheatList() {
  return Object.keys(CHEATS);
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
    const migrated = migrate(data);
    migrateSeekOverrides(migrated, s);
    return migrated;
  } catch {
    return null;
  }
}

// --- Режим «сбор»: автобой на поле боя с рядами ---

export function moveFormationSlot(state, unitKey, slot) {
  if (slot < 0 || slot > 5) return false;
  // Меняемся местами, если слот занят
  const current = state.formation[unitKey];
  const otherKey = Object.keys(state.formation).find((k) => k !== unitKey && state.formation[k] === slot);
  if (otherKey) state.formation[otherKey] = current;
  state.formation[unitKey] = slot;
  return true;
}

function runFormationBattle(state, battle, seed) {
  const { stats, traits } = collectStats(state.equipped);
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

  const knight = makeFormationKnight(stats, traits, consumables, state.formation.knight ?? 1);
  const allies = [knight];
  state.squadMercs.forEach((id, i) => {
    const key = `merc${i}`;
    const slot = state.formation[key] ?? (i === 0 ? 0 : 5);
    allies.push(makeFormationMerc(MERC_BY_ID[id], slot, i + 1));
  });

  const entries = battle.enemies.map((e) => (typeof e === 'string' ? { id: e, scale: 1 } : e));
  const slots = enemyFormationSlots(battle.enemies);
  const foes = entries.map((e, i) => makeFormationEnemy(e.id, e.scale, slots[i], i));

  const result = simulateFormationBattle(allies, foes, seed);

  const usedIds = knight.potions.filter((p) => p.used).map((p) => p.itemId);
  for (const used of usedIds) {
    const i = state.consumableBelt.indexOf(used);
    if (i >= 0) state.consumableBelt.splice(i, 1);
  }

  let rewards = [];
  if (result.victory) {
    const firstTime = !state.battlesDone[battle.id];
    state.battlesDone[battle.id] = {
      victories: (state.battlesDone[battle.id]?.victories || 0) + 1,
      at: Date.now(),
    };
    state.stats.battlesWon += 1;
    for (const entry of battle.enemies) {
      const enemyId = typeof entry === 'string' ? entry : entry.id;
      const scale = typeof entry === 'string' ? 1 : (entry.scale || 1);
      const def = enemyReward(enemyId, stats, seed);
      for (const r of def) {
        if (r.type === 'coins') r.amount = Math.round(r.amount * scale);
        rewards.push(r);
      }
    }
    grantRewards(state, rewards, {});
    if (traits.includes('heal_after_battle')) {
      rewards.push({ type: 'note', text: 'Амулет очага согрел рыцаря после боя.' });
    }
    if (!firstTime) rewards = rewards.map((r) => (r.type === 'coins' ? { ...r, amount: Math.round(r.amount * 0.5) } : r));
  }
  return {
    ...result, rewards, battle,
    formation: {
      allies: allies.map((a) => ({ uid: a.uid, slot: a.slot })),
      foes: foes.map((f) => ({ uid: f.uid, slot: f.slot })),
    },
  };
}

export { SLOTS, collectStats, isShieldBlocked } from './items.js';
