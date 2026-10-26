// Состояние игры: экономика, инвентарь, прогресс, сохранения.
import { ITEM_BY_ID } from '../data/items.js';
import { SHOP_STOCK, CREW_STOCK, pricedShopItem, compareShopItems } from '../data/shop.js';
import { ECONOMY_VERSION } from '../data/economy.js';
import {
  derivePuzzleCatalog, derivePuzzle, puzzleRewards, puzzleSkipTerms,
  battleCoinReward, battleEconomy, itemPrice,
} from './economy.js';
import { PUZZLES } from '../data/puzzles.js';
import { SHELF_PUZZLES } from '../data/puzzlesShelf.js';
import { BOOK_PUZZLES } from '../data/puzzlesBook.js';
import { SEEK_PUZZLES } from '../data/puzzlesSeek.js';
import { PATH_PUZZLES } from '../data/puzzlesPath.js';
import { TEA_PUZZLES } from '../data/puzzlesTea.js';
import { MECH_PUZZLES } from '../data/puzzlesMech.js';
import { CANDLE_PUZZLES } from '../data/puzzlesCandle.js';
import { FLOW_PUZZLES } from '../data/puzzlesFlow.js';
import { BREW_PUZZLES } from '../data/puzzlesBrew.js';
import { FATE_PUZZLES } from '../data/puzzlesFate.js';
import { GLASS_PUZZLES } from '../data/puzzlesGlass.js';
import { SPIN_PUZZLES } from '../data/puzzlesSpin.js';
import { GIFT_PUZZLES } from '../data/puzzlesGift.js';
import { SEATING_PUZZLES } from '../data/puzzlesSeating.js';
import { BATTLES, BATTLE_BY_ID } from '../data/battles.js';
import { TROPHY_BY_BATTLE } from '../data/trophies.js';
import { COMPANION_BY_ID, PET_BY_ID, MERC_BY_ID } from '../data/crew.js';
import { COSMETIC_BY_ID, LEGACY_COSMETIC_ALIASES, COSMETICS_VERSION } from '../data/cosmetics.js';
import { RECIPES, RECIPE_BY_ID } from '../data/recipes.js';
import { MATERIALS, materialLabel } from '../data/materials.js';
import { exchangeMaterials } from './materialExchange.js';
import { emptyEquipment, equip, unequip, collectStats, isShieldBlocked, itemScore } from './items.js';
import {
  makeFormationKnight, makeFormationMerc, makeFormationEnemy,
  simulateFormationBattle, enemyFormationSlots,
} from './formBattle.js';
import { ENEMY_BY_ID } from '../data/enemies.js';
import { newStoryState, storyOnPuzzleComplete } from './storyEngine.js';
import {
  ONBOARDING_VERSION, ONBOARDING_STEPS, newOnboardingState, reconcileOnboarding,
  onboardingPuzzleSolved, onboardingPurchase, onboardingEquipmentChanged,
  onboardingCrafted, onboardingBattleOptions, onboardingBattleFinished,
  restartOnboarding,
} from './onboarding.js';
import { completeSavingsGoal } from './goals.js';
import {
  newBattleEnergy, refreshBattleEnergy, battleEnergyTerms, spendBattleEnergy,
} from './energy.js';
import { rollBossDrop } from './bossDrops.js';
import { BATTLE_LORE } from '../data/battleLore.js';
import { battleLoreFinalBattle, nextCampaignBattle } from './battleLore.js';
import {
  newAchievementStats, ensureAchievementStats, recordPuzzleSkip, recordPuzzleCompletion,
  recordBattleResult, recordShopPurchase, recordCraft, recordMaterialExchange,
  recordSavingsGoal, recordEquipmentSets, recordSeasonalCosmetic,
} from './achievementStats.js';

const SAVE_KEY = 'cozy_adventures_save_v2';

export function newGame(now = Date.now()) {
  return {
    economyVersion: ECONOMY_VERSION,
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
    battleLoreSeen: {},     // world:intro/outro -> true после последней реплики
    battleEnergy: newBattleEnergy(now), // только наградные повторы; поражения и первые победы бесплатны
    bossDrops: {},          // battleId -> { dry, collected }: личный pity и защита от дублей
    customPuzzles: [],      // уровни из редактора
    lastDailyBonus: null,   // день, когда получен бонус заказа дня
    lastCatGift: null,      // день последнего подарка от кота
    cosmeticsVersion: COSMETICS_VERSION, // пакетная модель полных тем
    cosmeticsOwned: [],     // все купленные пакеты без дублей
    cosmeticsActive: [],    // не более одного выбранного pack id
    legacyCosmeticsActive: [], // прежние спрайты только для fallback до загрузки полного фона
    seekOverrides: {},      // правки хотспотов искалок из редактора: levelId -> groups
    shopSeenStock: [],      // id товаров прилавка, которые игрок уже видел
    inventorySeen: [],      // id предметов сундука, которые игрок уже видел (метка «новое»)
    achievements: {},       // id -> timestamp разблокировки
    achievementStats: newAchievementStats(), // вечные рекорды и факты особых событий
    trophies: [],           // id трофеев кабинета (за боссов и розыск)
    trophiesSeen: [],       // id трофеев, которые игрок уже посмотрел в кабинете
    journal: [],            // дневник кота: последние события [{icon, text, at}]
    savingsGoal: null,      // необязательная цель накопления { kind, id }
    tutorial: {},           // пройденные этапы обучения
    tutorialSkipped: false, // игрок пропустил обучение целиком
    onboarding: newOnboardingState(), // первая дуга и путеводитель: версия, факты и посещения
    story: newStoryState(), // режим истории: шаг, круг гостей, память визитов
    settings: { useBeltItems: true, tactic: 'balance', keepBookOpen: false, puzzleCatalogMode: 'shelf', guestCatalogMode: 'shelf', storyMode: true, cursorMode: 'themed', cursorTheme: 'default', cosmeticsNoticeDismissed: false, cosmeticsPackNoticeDismissed: false }, // настройки (бой, каталоги, оформление)
    formation: { knight: 1, merc0: 0, merc1: 5 }, // слоты 0-2 передний ряд, 3-5 задний
    cheats: { used: [], spiderHat: false }, // активированные читы и пасхалки
    stats: { puzzlesSolved: 0, battlesWon: 0, coinsEarned: 0 },
  };
}

// Миграция старых сохранений: прежние настройки, накопления и первая дуга.
function migrate(state, now = Date.now()) {
  const hadOnboarding = !!state.onboarding;
  const hadGuide = !!state.onboarding?.guide;
  const hadBattleLore = state.battleLoreSeen && typeof state.battleLoreSeen === 'object'
    && !Array.isArray(state.battleLoreSeen);
  // Денежную массу и накопления не пересчитываем: версия только фиксирует модель.
  state.economyVersion ||= ECONOMY_VERSION;
  state.crew ||= [];
  state.squadCompanions ||= [];
  state.squadMercs ||= [];
  state.pet ??= null;
  state.customPuzzles ||= [];
  state.cosmeticsOwned = Array.isArray(state.cosmeticsOwned) ? state.cosmeticsOwned : [];
  const previousOwned = [...state.cosmeticsOwned];
  const previousActive = Array.isArray(state.cosmeticsActive) ? [...state.cosmeticsActive] : [];
  const previousLegacy = Array.isArray(state.legacyCosmeticsActive)
    ? [...state.legacyCosmeticsActive]
    : previousActive;
  if ((state.cosmeticsVersion || 1) < COSMETICS_VERSION) {
    // carpet+crest схлопываются в один hearth; активным становится pack последнего id.
    const owned = [];
    for (const id of previousOwned) {
      const packId = LEGACY_COSMETIC_ALIASES[id] || id;
      if (!owned.includes(packId)) owned.push(packId);
    }
    const lastId = previousActive[previousActive.length - 1];
    const activePack = lastId ? (LEGACY_COSMETIC_ALIASES[lastId] || lastId) : null;
    state.cosmeticsOwned = owned;
    state.cosmeticsActive = activePack && COSMETIC_BY_ID[activePack] ? [activePack] : [];
    // Для fallback сохраняются только реальные старые cos_* id, не товарные pack id.
    state.legacyCosmeticsActive = previousLegacy.filter((id) => LEGACY_COSMETIC_ALIASES[id]);
  }
  state.cosmeticsVersion = COSMETICS_VERSION;
  state.seekOverrides ||= {};
  state.shopSeenStock ||= [];
  state.inventorySeen ||= [];
  state.lastDailyBonus ??= null;
  state.lastCatGift ??= null;
  state.stats.catPets ||= 0;
  state.achievements ||= {};
  ensureAchievementStats(state);
  state.trophies ||= [];
  state.trophiesSeen ||= [];
  state.journal ||= [];
  state.tutorial ||= {};
  state.tutorialSkipped ??= false;
  state.settings ||= {};
  delete state.settings.battleMode; // режим «простой» упразднён, бой всегда «сбор»
  state.settings.useBeltItems ??= true;
  state.settings.tactic ??= 'balance';
  state.settings.keepBookOpen ??= false; // уютная варка: рецепт всегда открыт (без памяти)
  state.settings.puzzleCatalogMode ??= 'shelf'; // вид каталога: полка, превью, список или мозаика
  state.settings.guestCatalogMode ??= 'shelf'; // вид гостевой книги: полка, портрет, список или мозаика
  state.settings.storyMode ??= true; // режим истории: гость в лавке ведёт по сюжету
  state.settings.cosmeticsNoticeDismissed ??= false; // прежнее пояснение о полных фонах
  state.settings.cosmeticsPackNoticeDismissed ??= false; // отдельное пояснение пакетной модели
  // Курсоры: system (обычная стрелка) / themed (по режимам) / fixed (один везде)
  state.settings.cursorMode ??= state.settings.themedCursors === false ? 'system' : 'themed';
  delete state.settings.themedCursors;
  state.settings.cursorTheme ??= 'default';
  state.story ||= newStoryState();
  state.story.guests ||= {};
  state.story.guestCursor ||= 0;
  state.formation ||= { knight: 1, merc0: 0, merc1: 5 };
  state.cheats ||= { used: [], spiderHat: false };
  state.materials ||= {};
  state.seals ??= 0;
  state.savingsGoal ??= null;
  state.battleLoreSeen = hadBattleLore ? state.battleLoreSeen : {};
  if (!hadBattleLore) {
    for (const world of Object.keys(BATTLE_LORE)) {
      const battles = BATTLES.filter((battle) => !battle.wanted && battle.world === world);
      if (battles.some((battle) => state.battlesDone?.[battle.id])) {
        state.battleLoreSeen[`${world}:intro`] = true;
      }
      const finalBattle = battleLoreFinalBattle(world);
      if (finalBattle && state.battlesDone?.[finalBattle.id]) {
        state.battleLoreSeen[`${world}:outro`] = true;
      }
    }
  }
  // Старым сейвам выдаём полный запас: прошлые победы задним числом не тарифицируются.
  if (!state.battleEnergy || typeof state.battleEnergy !== 'object' || Array.isArray(state.battleEnergy)) {
    state.battleEnergy = newBattleEnergy(now);
  }
  state.bossDrops ||= {};
  refreshBattleEnergy(state, now);

  if (!hadOnboarding) {
    const developed = Object.keys(state.puzzlesDone || {}).length > 0
      || Object.keys(state.battlesDone || {}).length > 0
      || Object.keys(state.materials || {}).length > 0
      || (state.crew || []).length > 0
      || (state.stats.puzzlesSolved || 0) > 0
      || (state.stats.battlesWon || 0) > 0
      || (state.stats.itemsBought || 0) > 0
      || (state.stats.itemsCrafted || 0) > 0
      || !!state.story.prologSeen || !!state.story.pending || (state.story.step || 0) > 0
      || state.coins !== 80 || state.seals !== 0;
    state.onboarding = newOnboardingState();
    if ((state.stats.itemsCrafted || 0) > 0 && state.battlesDone?.bt_bees) {
      const laterRecipeOpen = RECIPES.some((recipe) => recipe.id !== 'rcp_pot_heal'
        && state.battlesDone?.[recipe.unlockAfter]);
      if (!laterRecipeOpen) state.onboarding.flags.crafted_rcp_pot_heal = true;
    }
    const hasTrailBoots = (state.inventory || []).includes('bt_path')
      || Object.values(state.equipped || {}).includes('bt_path');
    if (hasTrailBoots || state.onboarding.flags.crafted_rcp_pot_heal) {
      state.onboarding.flags.squareSeen = true;
      state.onboarding.flags.marketSeen = true;
    }
    if (developed) {
      state.onboarding.status = 'done';
      state.onboarding.step = 'done';
    } else if (state.tutorialSkipped) state.onboarding.status = 'skipped';
  } else {
    const current = state.onboarding;
    state.onboarding = { ...newOnboardingState(), ...current, flags: { ...(current.flags || {}) } };
    if (!['active', 'paused', 'skipped', 'done'].includes(state.onboarding.status)) {
      state.onboarding.status = 'active';
    }
    if (!ONBOARDING_STEPS.some((step) => step.id === state.onboarding.step)) {
      state.onboarding.step = 'prolog';
    }
    if (state.onboarding.status === 'done') state.onboarding.step = 'done';
  }
  if (!hadGuide) {
    state.onboarding.guide = { started: false, seen: [], closed: false };
    if (state.onboarding.status === 'done') state.onboarding.flags.finalSeen = true;
  }
  state.onboarding.guide.started ??= false;
  state.onboarding.guide.seen = Array.isArray(state.onboarding.guide.seen) ? state.onboarding.guide.seen : [];
  state.onboarding.guide.closed ??= false;
  state.onboarding.version = ONBOARDING_VERSION;
  reconcileOnboarding(state);
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
    .map(pricedShopItem)
    .sort(compareShopItems);
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
  if (!ITEM_BY_ID[itemId]) return { ok: false, error: 'Нет такого товара' };
  const item = shopStock(state).find((candidate) => candidate.id === itemId);
  if (!item) return { ok: false, error: 'Товар ещё не на полке' };
  const owned = item.slot !== 'consumable' && (
    state.inventory.includes(itemId)
    || state.consumableBelt.includes(itemId)
    || Object.values(state.equipped).includes(itemId)
  );
  if (owned) return { ok: false, error: 'Эта вещь уже у вас: в сундуке, на поясе или надета.' };
  if (item.sealPrice) {
    if (state.seals < item.sealPrice) return { ok: false, error: 'Не хватает печатей мастера' };
    state.seals -= item.sealPrice;
  } else {
    if (state.coins < item.price) return { ok: false, error: 'Не хватает монет' };
    state.coins -= item.price;
  }
  state.inventory.push(itemId);
  state.stats.itemsBought = (state.stats.itemsBought || 0) + 1;
  recordShopPurchase(state, itemId);
  journalPush(state, '🪙', `Куплено: ${item.name}.`);

  // Авто-экипировка: если слот свободен (или есть место в поясе) — надеваем сразу.
  const auto = autoEquip(state, itemId);
  onboardingPurchase(state, itemId);
  const result = { ok: true, autoEquipped: auto };
  if (completeSavingsGoal(state, 'item', itemId)) {
    recordSavingsGoal(state);
    result.goalCompleted = true;
  }
  return result;
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
  recordEquipmentSets(state);
  return { slot: result.slot };
}

export function sellItem(state, inventoryIndex) {
  const id = state.inventory[inventoryIndex];
  const item = ITEM_BY_ID[id];
  if (!item) return { ok: false };
  const stock = SHOP_STOCK.find((entry) => entry.itemId === id);
  const basePrice = stock ? itemPrice(item, { tier: stock.tier }) : item.price;
  const price = Math.max(1, Math.floor(basePrice / 2));
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
  journalPush(state, def.icon, `${def.name} теперь с нами!`);
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
  const result = { ok: true };
  if (completeSavingsGoal(state, 'crew', id)) {
    recordSavingsGoal(state);
    result.goalCompleted = true;
  }
  return result;
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
    onboardingEquipmentChanged(state);
    return { ok: true };
  }
  const result = equip(state.equipped, id);
  if (!result.ok) return result;
  state.inventory.splice(inventoryIndex, 1);
  for (const off of result.swappedOff || []) state.inventory.push(off);
  onboardingEquipmentChanged(state);
  recordEquipmentSets(state);
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

// Кнопка «Надеть лучшее»: жадно надевает лучшие по itemScore вещи из сундука.
// Расходники не трогает. Возвращает { changed, names }.
export function autoEquipBest(state) {
  const scoreOf = (slotId) => {
    const id = state.equipped[slotId];
    return id ? itemScore(ITEM_BY_ID[id]) : -1;
  };
  const names = [];
  // Кандидаты по убыванию скора; дубли одного id равнозначны — берём по одному
  const candIds = [...new Set(
    state.inventory.filter((id) => ITEM_BY_ID[id] && ITEM_BY_ID[id].slot !== 'consumable'),
  )].sort((a, b) => itemScore(ITEM_BY_ID[b]) - itemScore(ITEM_BY_ID[a]));

  for (const id of candIds) {
    const item = ITEM_BY_ID[id];
    const sc = itemScore(item);
    let ringSlot = null;
    if (item.slot === 'ring') {
      // Целимся в более слабое из двух колец
      ringSlot = scoreOf('ring1') <= scoreOf('ring2') ? 'ring1' : 'ring2';
      if (sc <= scoreOf(ringSlot)) continue;
    } else if (sc <= scoreOf(item.slot)) {
      continue;
    }
    if (item.slot === 'shield' && isShieldBlocked(state.equipped)) continue;
    // Кольцо в конкретный слот: сначала освобождаем его (вытесненное — в сундук)
    if (ringSlot && state.equipped[ringSlot]) unequipToInventory(state, ringSlot);
    const idx = state.inventory.indexOf(id);
    if (idx < 0) continue;
    const r = equipFromInventory(state, idx);
    if (r.ok) names.push(item.name);
  }
  return { changed: names.length, names };
}

// --- Крафт: материалы → зелья и снаряжение ---

const RECIPE_PROGRESS = new Map(RECIPES.map((recipe) => {
  const battle = recipe.unlockAfter ? BATTLE_BY_ID[recipe.unlockAfter] : null;
  const order = recipe.unlockAfter ? BATTLES.findIndex((entry) => entry.id === recipe.unlockAfter) : -1;
  return [recipe.id, {
    tier: battle ? battleEconomy(battle).tier : 0,
    order,
  }];
}));

export function recipeList(state) {
  return RECIPES
    .filter((r) => r.unlockAfter === null || state.battlesDone[r.unlockAfter])
    .map((r) => {
      const check = canCraft(state, r.id);
      return { ...r, canCraft: check.ok, missing: check.missing || [], error: check.error };
    })
    .sort((a, b) => {
      const pa = RECIPE_PROGRESS.get(a.id);
      const pb = RECIPE_PROGRESS.get(b.id);
      return pa.tier - pb.tier || pa.order - pb.order
        || Number(!a.canCraft) - Number(!b.canCraft)
        || (a.coins || 0) - (b.coins || 0)
        || Number(a.kind !== 'potion') - Number(b.kind !== 'potion')
        || a.id.localeCompare(b.id, 'ru');
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
  state.stats.itemsCrafted = (state.stats.itemsCrafted || 0) + 1;
  recordCraft(state, recipeId);
  journalPush(state, '⚒️', `Готово: ${r.name.toLowerCase()}.`);
  onboardingCrafted(state, recipeId);
  const result = { ok: true, itemId: r.result.itemId, count };
  if (completeSavingsGoal(state, 'recipe', recipeId)) {
    recordSavingsGoal(state);
    result.goalCompleted = true;
  }
  return result;
}

export function exchangeMaterial(state, inputId, outputId) {
  const result = exchangeMaterials(state, inputId, outputId);
  if (result.ok) {
    recordMaterialExchange(state);
    journalPush(state, '🔁', `Обмен: ${materialLabel(inputId)} ×${result.cost} → ${materialLabel(outputId)} ×${result.received}.`);
  }
  return result;
}

// --- Дневник кота: последние события глазами кота-хранителя ---
export function journalPush(state, icon, text) {
  state.journal ||= [];
  state.journal.push({ icon, text, at: Date.now() });
  if (state.journal.length > 30) state.journal.splice(0, state.journal.length - 30);
}

// --- Оформление лавки (только красота, без влияния на силу) ---

export function selectCosmetic(state, id) {
  if (id === null) {
    state.cosmeticsActive = [];
    state.legacyCosmeticsActive = [];
    return { ok: true, active: false };
  }
  if (!COSMETIC_BY_ID[id] || !state.cosmeticsOwned.includes(id)) return { ok: false, active: false };
  state.cosmeticsActive = [id];
  state.legacyCosmeticsActive = [id];
  recordSeasonalCosmetic(state, COSMETIC_BY_ID[id], currentSeason());
  return { ok: true, active: true };
}

export function buyCosmetic(state, id) {
  const def = COSMETIC_BY_ID[id];
  if (!def) return { ok: false, error: 'Нет такого оформления' };
  if (state.cosmeticsOwned.includes(id)) return { ok: false, error: 'Уже куплено' };
  if (def.sealPrice) {
    if (state.seals < def.sealPrice) return { ok: false, error: 'Не хватает печатей мастера' };
    state.seals -= def.sealPrice;
  } else {
    if (state.coins < def.price) return { ok: false, error: 'Не хватает монет' };
    state.coins -= def.price;
  }
  state.cosmeticsOwned.push(id);
  selectCosmetic(state, id); // покупка сразу заменяет текущее оформление
  return { ok: true };
}

export function toggleCosmetic(state, id) {
  const active = state.cosmeticsActive.length === 1 && state.cosmeticsActive[0] === id;
  return selectCosmetic(state, active ? null : id);
}

// --- Головоломки ---

// Полный список уровней кампании. Механики ЧЕРЕДУЮТСЯ (свет, полки, книги,
// поиск), чтобы не идти одной тематикой подряд; внутри каждой механики
// сложность растёт по своей цепочке.
const PUZZLE_POOL = new Map(
  [...PUZZLES, ...SHELF_PUZZLES, ...BOOK_PUZZLES, ...SEEK_PUZZLES, ...PATH_PUZZLES, ...TEA_PUZZLES,
    ...MECH_PUZZLES, ...CANDLE_PUZZLES, ...FLOW_PUZZLES, ...BREW_PUZZLES, ...FATE_PUZZLES, ...GLASS_PUZZLES,
    ...SPIN_PUZZLES, ...GIFT_PUZZLES, ...SEATING_PUZZLES]
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
  // Вторая чайная половина: новые ингредиенты и жар как условие заказа
  'tea_09', 'tea_10', 'tea_11', 'tea_12', 'tea_13', 'tea_14', 'tea_15', 'tea_16',
  // Искалки новых миров
  'sk_nm_01', 'sk_sw_01', 'sk_sf_01', 'sk_ash_01',
  'sk_cr_01', 'sk_jade_01', 'sk_deep_01', 'sk_mist_01',
  // Мастерская механики, свечи и потоки покупателей — вперемешку
  'mech_01', 'cd_01', 'flow_01', 'mech_02', 'cd_02', 'flow_02',
  'mech_03', 'cd_03', 'flow_03', 'mech_04', 'cd_04', 'flow_04',
  'mech_05', 'cd_05', 'flow_05', 'mech_06', 'cd_06', 'flow_06',
  'mech_07', 'cd_07', 'flow_07', 'mech_08', 'cd_08', 'flow_08',
  // Алхимический стол: варка зелий по рецепту (с brew_06 — на память)
  'brew_01', 'brew_02', 'brew_03', 'brew_04',
  'brew_05', 'brew_06', 'brew_07', 'brew_08', 'brew_09', 'brew_10',
  // Вторая половина книги рецептов: имбирь, лимон, клевер, лунный камень
  'brew_11', 'brew_12', 'brew_13', 'brew_14', 'brew_15', 'brew_16', 'brew_17', 'brew_18', 'brew_19', 'brew_20',
  'brew_21', 'brew_22', 'brew_23', 'brew_24', 'brew_25', 'brew_26', 'brew_27', 'brew_28', 'brew_29', 'brew_30',
  // Нож, пипетка, крышка, повторы ×N: книга рецептов растёт до ста страниц
  'brew_31', 'brew_32', 'brew_33', 'brew_34', 'brew_35', 'brew_36', 'brew_37', 'brew_38', 'brew_39', 'brew_40',
  'brew_41', 'brew_42', 'brew_43', 'brew_44', 'brew_45', 'brew_46', 'brew_47', 'brew_48', 'brew_49', 'brew_50',
  'brew_51', 'brew_52', 'brew_53', 'brew_54', 'brew_55', 'brew_56', 'brew_57', 'brew_58', 'brew_59', 'brew_60',
  'brew_61', 'brew_62', 'brew_63', 'brew_64', 'brew_65', 'brew_66', 'brew_67', 'brew_68', 'brew_69', 'brew_70',
  'brew_71', 'brew_72', 'brew_73', 'brew_74', 'brew_75', 'brew_76', 'brew_77', 'brew_78', 'brew_79', 'brew_80',
  'brew_81', 'brew_82', 'brew_83', 'brew_84', 'brew_85', 'brew_86', 'brew_87', 'brew_88', 'brew_89', 'brew_90',
  'brew_91', 'brew_92', 'brew_93', 'brew_94', 'brew_95', 'brew_96', 'brew_97', 'brew_98', 'brew_99', 'brew_100',
  // Вторая книга «Строк при свече»: стихи и цитаты классиков
  'bk_11', 'bk_12', 'bk_13', 'bk_14', 'bk_15', 'bk_16', 'bk_17', 'bk_18', 'bk_19', 'bk_20',
  'bk_21', 'bk_22', 'bk_23', 'bk_24', 'bk_25', 'bk_26', 'bk_27', 'bk_28', 'bk_29', 'bk_30',
  // Третья книга «Строк при свече»: до ста уровней
  'bk_31', 'bk_32', 'bk_33', 'bk_34', 'bk_35', 'bk_36', 'bk_37', 'bk_38', 'bk_39', 'bk_40',
  'bk_41', 'bk_42', 'bk_43', 'bk_44', 'bk_45', 'bk_46', 'bk_47', 'bk_48', 'bk_49', 'bk_50',
  'bk_51', 'bk_52', 'bk_53', 'bk_54', 'bk_55', 'bk_56', 'bk_57', 'bk_58', 'bk_59', 'bk_60',
  'bk_61', 'bk_62', 'bk_63', 'bk_64', 'bk_65', 'bk_66', 'bk_67', 'bk_68', 'bk_69', 'bk_70',
  'bk_71', 'bk_72', 'bk_73', 'bk_74', 'bk_75', 'bk_76', 'bk_77', 'bk_78', 'bk_79', 'bk_80',
  'bk_81', 'bk_82', 'bk_83', 'bk_84', 'bk_85', 'bk_86', 'bk_87', 'bk_88', 'bk_89', 'bk_90',
  'bk_91', 'bk_92', 'bk_93', 'bk_94', 'bk_95', 'bk_96', 'bk_97', 'bk_98', 'bk_99', 'bk_100',
  'bk_101', 'bk_102', 'bk_103', 'bk_104', 'bk_105',
  // Загадки Хранителя: 95 народных загадок (раздел «Загадки Хранителя»)
  'bk_106', 'bk_107', 'bk_108', 'bk_109', 'bk_110', 'bk_111', 'bk_112', 'bk_113', 'bk_114', 'bk_115', 'bk_116', 'bk_117', 'bk_118', 'bk_119', 'bk_120', 'bk_121', 'bk_122', 'bk_123', 'bk_124',
  'bk_125', 'bk_126', 'bk_127', 'bk_128', 'bk_129', 'bk_130', 'bk_131', 'bk_132', 'bk_133', 'bk_134', 'bk_135', 'bk_136', 'bk_137', 'bk_138', 'bk_139', 'bk_140', 'bk_141', 'bk_142', 'bk_143',
  'bk_144', 'bk_145', 'bk_146', 'bk_147', 'bk_148', 'bk_149', 'bk_150', 'bk_151', 'bk_152', 'bk_153', 'bk_154', 'bk_155', 'bk_156', 'bk_157', 'bk_158', 'bk_159', 'bk_160', 'bk_161', 'bk_162',
  'bk_163', 'bk_164', 'bk_165', 'bk_166', 'bk_167', 'bk_168', 'bk_169', 'bk_170', 'bk_171', 'bk_172', 'bk_173', 'bk_174', 'bk_175', 'bk_176', 'bk_177', 'bk_178', 'bk_179', 'bk_180', 'bk_181',
  'bk_182', 'bk_183', 'bk_184', 'bk_185', 'bk_186', 'bk_187', 'bk_188', 'bk_189', 'bk_190', 'bk_191', 'bk_192', 'bk_193', 'bk_194', 'bk_195', 'bk_196', 'bk_197', 'bk_198', 'bk_199', 'bk_200',
  // Карты судьбы: вечерние гости лавки и расклады
  'fate_01', 'fate_02', 'fate_03', 'fate_04', 'fate_05', 'fate_06',
  'fate_07', 'fate_08', 'fate_09', 'fate_10', 'fate_11', 'fate_12',
  // Витраж миров: собери разбитые окна-картины из осколков
  'gl_01', 'gl_02', 'gl_03', 'gl_04', 'gl_05', 'gl_06',
  'gl_07', 'gl_08', 'gl_09', 'gl_10', 'gl_11', 'gl_12',
  // Вторая дюжина витражей: галерея дальних миров и сердце лавки
  'gl_13', 'gl_14', 'gl_15', 'gl_16', 'gl_17', 'gl_18',
  'gl_19', 'gl_20', 'gl_21', 'gl_22', 'gl_23', 'gl_24',
  // Третья серия витражей: вертикальный формат, панорамы, максимум осколков
  'gl_25', 'gl_26', 'gl_27', 'gl_28', 'gl_29',
  'gl_30', 'gl_31', 'gl_32', 'gl_33', 'gl_34',
  // Четвёртая серия витражей: посвящённые арты assets/glass/ (процедурный фолбэк до генерации)
  'gl_35', 'gl_36', 'gl_37', 'gl_38', 'gl_39', 'gl_40',
  'gl_41', 'gl_42', 'gl_43', 'gl_44', 'gl_45', 'gl_46',
  // Пятая серия витражей: посвящённые арты assets/glass/
  'gl_47', 'gl_48', 'gl_49', 'gl_50', 'gl_51', 'gl_52',
  'gl_53', 'gl_54', 'gl_55', 'gl_56', 'gl_57', 'gl_58',
  // Гобелены ветров: сквозняк повернул лоскуты — крути каждый по часовой.
  // Глава 1: первые сквозняки (якоря — с sp_05, слепые — с sp_09)
  'sp_01', 'sp_02', 'sp_03', 'sp_04', 'sp_05', 'sp_06', 'sp_07', 'sp_08', 'sp_09', 'sp_10',
  // Глава 2: по миру за ветром (панорамы двенадцати миров)
  'sp_11', 'sp_12', 'sp_13', 'sp_14', 'sp_15', 'sp_16', 'sp_17', 'sp_18', 'sp_19', 'sp_20',
  // Глава 3: сторис-искалки (сцены поиска предметов)
  'sp_21', 'sp_22', 'sp_23', 'sp_24', 'sp_25', 'sp_26', 'sp_27', 'sp_28', 'sp_29', 'sp_30',
  // Глава 4: лавка и чайный стол
  'sp_31', 'sp_32', 'sp_33', 'sp_34', 'sp_35', 'sp_36', 'sp_37', 'sp_38', 'sp_39', 'sp_40',
  // Глава 5: вторая вышивка (витражные сцены в новой раскройке)
  'sp_41', 'sp_42', 'sp_43', 'sp_44', 'sp_45', 'sp_46', 'sp_47', 'sp_48', 'sp_49', 'sp_50',
  // Глава 6: тёмная половина (слепые через одного)
  'sp_51', 'sp_52', 'sp_53', 'sp_54', 'sp_55', 'sp_56', 'sp_57', 'sp_58', 'sp_59', 'sp_60',
  // Глава 7: панорамы (дебют 8×5)
  'sp_61', 'sp_62', 'sp_63', 'sp_64', 'sp_65', 'sp_66', 'sp_67', 'sp_68', 'sp_69', 'sp_70',
  // Глава 8: гвоздики и ветер
  'sp_71', 'sp_72', 'sp_73', 'sp_74', 'sp_75', 'sp_76', 'sp_77', 'sp_78', 'sp_79', 'sp_80',
  // Глава 9: восемь на пять
  'sp_81', 'sp_82', 'sp_83', 'sp_84', 'sp_85', 'sp_86', 'sp_87', 'sp_88', 'sp_89', 'sp_90',
  // Глава 10: все ветра (финал — слепой гобелен на четырёх гвоздиках)
  'sp_91', 'sp_92', 'sp_93', 'sp_94', 'sp_95', 'sp_96', 'sp_97', 'sp_98', 'sp_99', 'sp_100',
  // Карты судьбы: вторая дюжина гостей (мельник, швея, пчеловод… хозяин лавки)
  'fate_13', 'fate_14', 'fate_15', 'fate_16', 'fate_17', 'fate_18',
  'fate_19', 'fate_20', 'fate_21', 'fate_22', 'fate_23', 'fate_24',
  // Третья дюжина: в игру входит вторая колода (фонарь, котёл, ножницы…)
  'fate_25', 'fate_26', 'fate_27', 'fate_28', 'fate_29', 'fate_30',
  'fate_31', 'fate_32', 'fate_33', 'fate_34', 'fate_35', 'fate_36',
  // Четвёртая дюжина: старые знакомые с новыми историями (гости повторяются)
  'fate_37', 'fate_38', 'fate_39', 'fate_40', 'fate_41', 'fate_42',
  'fate_43', 'fate_44', 'fate_45', 'fate_46', 'fate_47', 'fate_48',
  // Пятая дюжина: третья колода (улей, перо, кольцо, окно, волна…)
  'fate_49', 'fate_50', 'fate_51', 'fate_52', 'fate_53', 'fate_54',
  'fate_55', 'fate_56', 'fate_57', 'fate_58', 'fate_59', 'fate_60',
  // Шестая дюжина: по одной новой карте на уровень (печать, колесо, зонт…)
  'fate_61', 'fate_62', 'fate_63', 'fate_64', 'fate_65', 'fate_66',
  'fate_67', 'fate_68', 'fate_69', 'fate_70', 'fate_71', 'fate_72',
  // Седьмая дюжина и финал для хозяина лавки
  'fate_73', 'fate_74', 'fate_75', 'fate_76', 'fate_77', 'fate_78',
  'fate_79', 'fate_80', 'fate_81', 'fate_82', 'fate_83', 'fate_84',
  // Филлеры и остаток вечера гаданий
  'fate_85', 'fate_86', 'fate_87', 'fate_88', 'fate_89', 'fate_90',
  'fate_91', 'fate_92', 'fate_93', 'fate_94', 'fate_95', 'fate_96',
  // Подарок для гостя: витрина сувениров и истории с зашитыми условиями
  'gift_01', 'gift_02', 'gift_03', 'gift_04', 'gift_05', 'gift_06',
  'gift_07', 'gift_08', 'gift_09', 'gift_10', 'gift_11', 'gift_12',
  // Вторая дюжина: кузнец, поварёнок, мельник… картограф (шесть новых сувениров)
  'gift_13', 'gift_14', 'gift_15', 'gift_16', 'gift_17', 'gift_18',
  'gift_19', 'gift_20', 'gift_21', 'gift_22', 'gift_23', 'gift_24',
  // Третья дюжина: сторож, паучок, рыцарь… финал для духа перекрёстка
  'gift_25', 'gift_26', 'gift_27', 'gift_28', 'gift_29', 'gift_30',
  'gift_31', 'gift_32', 'gift_33', 'gift_34', 'gift_35', 'gift_36',
  // Четвёртая дюжина: старые знакомые с новыми историями (гости повторяются)
  'gift_37', 'gift_38', 'gift_39', 'gift_40', 'gift_41', 'gift_42',
  'gift_43', 'gift_44', 'gift_45', 'gift_46', 'gift_47', 'gift_48',
  // Пятая дюжина: водяной, полярник, матрёшка; финал — ответный подарок паучка
  'gift_49', 'gift_50', 'gift_51', 'gift_52', 'gift_53', 'gift_54',
  'gift_55', 'gift_56', 'gift_57', 'gift_58', 'gift_59', 'gift_60',
  // Шестая дюжина: свадьбы, юбилеи, новоселья; финал — кот на сто дежурств
  'gift_61', 'gift_62', 'gift_63', 'gift_64', 'gift_65', 'gift_66',
  'gift_67', 'gift_68', 'gift_69', 'gift_70', 'gift_71', 'gift_72',
  // Седьмая дюжина: награды верным помощникам; финал — подарок хозяину
  'gift_73', 'gift_74', 'gift_75', 'gift_76', 'gift_77', 'gift_78',
  'gift_79', 'gift_80', 'gift_81', 'gift_82', 'gift_83', 'gift_84',
  // Восьмая дюжина: витрина пополняется (санки, глёг, вышивка, призма…)
  'gift_85', 'gift_86', 'gift_87', 'gift_88', 'gift_89', 'gift_90',
  'gift_91', 'gift_92', 'gift_93', 'gift_94', 'gift_95', 'gift_96',
  // Финал витрины: от кассира до праздника ста подарков
  'gift_97', 'gift_98', 'gift_99', 'gift_100',
  // Гости за чайным столом: 10 глав по 10 рассадок (seat_01–seat_100)
  'seat_01', 'seat_02', 'seat_03', 'seat_04', 'seat_05', 'seat_06', 'seat_07', 'seat_08', 'seat_09', 'seat_10',
  'seat_11', 'seat_12', 'seat_13', 'seat_14', 'seat_15', 'seat_16', 'seat_17', 'seat_18', 'seat_19', 'seat_20',
  'seat_21', 'seat_22', 'seat_23', 'seat_24', 'seat_25', 'seat_26', 'seat_27', 'seat_28', 'seat_29', 'seat_30',
  'seat_31', 'seat_32', 'seat_33', 'seat_34', 'seat_35', 'seat_36', 'seat_37', 'seat_38', 'seat_39', 'seat_40',
  'seat_41', 'seat_42', 'seat_43', 'seat_44', 'seat_45', 'seat_46', 'seat_47', 'seat_48', 'seat_49', 'seat_50',
  'seat_51', 'seat_52', 'seat_53', 'seat_54', 'seat_55', 'seat_56', 'seat_57', 'seat_58', 'seat_59', 'seat_60',
  'seat_61', 'seat_62', 'seat_63', 'seat_64', 'seat_65', 'seat_66', 'seat_67', 'seat_68', 'seat_69', 'seat_70',
  'seat_71', 'seat_72', 'seat_73', 'seat_74', 'seat_75', 'seat_76', 'seat_77', 'seat_78', 'seat_79', 'seat_80',
  'seat_81', 'seat_82', 'seat_83', 'seat_84', 'seat_85', 'seat_86', 'seat_87', 'seat_88', 'seat_89', 'seat_90',
  'seat_91', 'seat_92', 'seat_93', 'seat_94', 'seat_95', 'seat_96', 'seat_97', 'seat_98', 'seat_99', 'seat_100',
];
// Единый производный слой наград: исходные 838 уровней не дублируют формулы.
export const ALL_PUZZLES = derivePuzzleCatalog(CAMPAIGN_ORDER.map((id) => PUZZLE_POOL.get(id)));

export function allPuzzles(state) {
  const custom = (state.customPuzzles || []).map((p) => derivePuzzle(p, {
    tier: p.economyTier ?? 0, order: 0, finale: false,
  }));
  return [...ALL_PUZZLES, ...custom];
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

// Тип головоломки: цепочка блокировок своя внутри типа
export function puzzleTypeOf(p) {
  return p.mechanic || 'mirror';
}

export function puzzleAvailable(state, index) {
  const p = ALL_PUZZLES[index];
  if (!p) return false;
  // Первый уровень каждого типа доступен сразу; остальные — после
  // предыдущего уровня того же типа (порядок — кампейнский).
  const sameType = ALL_PUZZLES.filter((q) => puzzleTypeOf(q) === puzzleTypeOf(p));
  const pos = sameType.indexOf(p);
  if (pos <= 0) return true;
  return !!state.puzzlesDone[sameType[pos - 1].id];
}

export function puzzleNeedsHonest(state, puzzleId) {
  const entry = state.puzzlesDone[puzzleId];
  return !entry || !!entry.skipped;
}

export function completePuzzle(state, puzzleId, info = {}) {
  const puzzle = findPuzzle(state, puzzleId);
  if (!puzzle) return null;
  const previous = state.puzzlesDone[puzzleId];
  const firstHonest = !previous || !!previous.skipped;
  const repeat = !firstHonest;
  // Daily определяется до записи решения и работает как за первое, так и за повторное.
  const dailyDay = todayKey();
  const isDaily = state.lastDailyBonus !== dailyDay && isDailyPuzzle(state, puzzleId);
  state.puzzlesDone[puzzleId] = {
    moves: info.moves ?? 0,
    hintsUsed: info.hintsUsed ?? 0,
    at: Date.now(),
  };
  state.stats.puzzlesSolved += 1;
  recordPuzzleCompletion(state, puzzle, info, { isDaily, day: dailyDay });
  storyOnPuzzleComplete(state, puzzleId); // после пропуска pending уже закрыт и не продвинется повторно
  journalPush(state, '🧩', firstHonest
    ? `Загадка «${puzzle.name}» решена. Лавка светлеет.`
    : `«${puzzle.name}» — снова решена, кот доволен.`);
  if (isDaily) {
    state.lastDailyBonus = dailyDay;
    journalPush(state, '🌟', 'Заказ дня выполнен — путник щедро благодарит!');
  }
  const rewards = puzzleRewards(puzzle, {
    repeat,
    factor: info.coinFactor ?? 1,
    daily: isDaily,
  });
  const granted = grantRewards(state, rewards, {});
  onboardingPuzzleSolved(state, puzzleId);
  return granted;
}

// Пропуск открывает цепочку/историю, но не превращает уровень в дешёвый repeat-farm.
export function skipPuzzlePrice(puzzle) {
  return puzzleSkipTerms(puzzle).price;
}

export function skipPuzzle(state, puzzleId) {
  const puzzle = findPuzzle(state, puzzleId);
  if (!puzzle) return { ok: false, error: 'Нет такой загадки' };
  const idx = ALL_PUZZLES.findIndex((p) => p.id === puzzleId);
  if (idx >= 0 && !puzzleAvailable(state, idx)) {
    return { ok: false, error: 'Загадка ещё не открыта' };
  }
  if (state.puzzlesDone[puzzleId]) return { ok: false, error: 'Уже решена' };
  const { price, consolation } = puzzleSkipTerms(puzzle);
  if (state.coins < price) return { ok: false, error: 'Не хватает монет', price };
  state.coins -= price;
  state.puzzlesDone[puzzleId] = { moves: 0, hintsUsed: 0, skipped: true, at: Date.now() };
  recordPuzzleSkip(state, puzzleId);
  storyOnPuzzleComplete(state, puzzleId); // пропуск тоже закрывает задание истории
  // Утешение считается от первой нормативной награды, без предметов и печатей.
  addCoins(state, consolation);
  return { ok: true, price, consolation };
}

// --- Погладить кота (интерактив в лавке) ---

const CAT_LINES = [
  'Мррр… кот урчит, как маленький очаг.',
  'Кот потянулся и прижался головой к ладони.',
  'Ур-р-р-р… усы дрожат от удовольствия.',
  'Кот перевернулся на спину — это высшее доверие.',
  'Тихий «мяу» в ответ. Полки мурлычут в такт.',
];

export function petTheCat(state) {
  state.stats.catPets = (state.stats.catPets || 0) + 1;
  const line = CAT_LINES[state.stats.catPets % CAT_LINES.length];
  journalPush(state, '🐈', line);
  let gift = 0;
  if (state.lastCatGift !== todayKey()) {
    state.lastCatGift = todayKey();
    gift = 2;
    addCoins(state, gift);
    journalPush(state, '🐈', 'Кот что-то накопал за прилавком: +2 монеты!');
  }
  return { pets: state.stats.catPets, line, gift };
}

// --- Ежедневные уютные события: заказ дня ---

function dayHash(str) {
  let h = 2166136261;
  for (const c of str) h = Math.imul(h ^ c.codePointAt(0), 16777619);
  return h >>> 0;
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

// Загадка дня: ближайшие открытые нерешённые/пропущенные, а после кампании — повторные.
export function dailyPuzzle(state) {
  const open = ALL_PUZZLES.filter((p, i) => puzzleNeedsHonest(state, p.id) && puzzleAvailable(state, i));
  const pool = open.length > 0 ? open.slice(0, 6) : ALL_PUZZLES.slice(-6);
  return pool[dayHash(todayKey()) % pool.length];
}

export function isDailyPuzzle(state, puzzleId) {
  return dailyPuzzle(state).id === puzzleId;
}

// Текущий сезон по месяцу.
export function currentSeason() {
  const m = new Date().getMonth();
  return m < 2 || m === 11 ? 'winter' : m < 5 ? 'spring' : m < 8 ? 'summer' : 'autumn';
}

export const SEASON_LABEL = {
  winter: 'Зима ❄️', spring: 'Весна 🌸', summer: 'Лето ✨', autumn: 'Осень 🍂',
};

// Следующая кампейн-головоломка после текущей (для кнопки «Следующая →»).
export function nextPuzzle(currentId) {
  // Следующая загадка того же типа (прогрессия — внутри раздела)
  const idx = ALL_PUZZLES.findIndex((p) => p.id === currentId);
  if (idx < 0) return null;
  const mech = puzzleTypeOf(ALL_PUZZLES[idx]);
  return ALL_PUZZLES.slice(idx + 1).find((p) => puzzleTypeOf(p) === mech) || null;
}

// Первая нерешённая или ожидающая честного решения после пропуска.
export function firstUnsolvedPuzzle(state) {
  return ALL_PUZZLES.find((p, i) => puzzleNeedsHonest(state, p.id) && puzzleAvailable(state, i)) || null;
}

// Следующая кампейнская битва после текущей (для кнопки «Следующая битва →»).
export function nextBattle(currentId) {
  return nextCampaignBattle(currentId);
}

// Первая доступная непройденная битва (для автоскролла списка походов).
export function firstUnbeatenBattle(state) {
  return BATTLES.find((b) => !b.wanted && !state.battlesDone[b.id] && battleAvailable(state, b.id)) || null;
}

// --- Бои ---

export function battleAvailable(state, battleId) {
  const b = BATTLE_BY_ID[battleId];
  if (!b) return false;
  return !!state.battlesDone[battleId] || b.unlockAfter === null || !!state.battlesDone[b.unlockAfter];
}

// Конкретный совет только из уже доступных источников усиления.
// Чистая функция: не меняет состояние и не открывает контент раньше времени.
export function accessibleBattleAdvice(state, report) {
  const sources = new Map();
  for (const id of state.inventory || []) if (ITEM_BY_ID[id]) sources.set(id, 'inventory');
  for (const id of state.consumableBelt || []) if (ITEM_BY_ID[id]) sources.set(id, 'belt');
  for (const item of shopStock(state)) if (!sources.has(item.id)) sources.set(item.id, 'shop');
  for (const recipe of recipeList(state)) {
    if (!sources.has(recipe.result.itemId)) sources.set(recipe.result.itemId, 'recipe');
  }
  const equippedIds = new Set(Object.values(state.equipped || {}).filter(Boolean));

  const itemAction = (id) => {
    const item = ITEM_BY_ID[id];
    const source = sources.get(id);
    if (!item || !source || source === 'belt' || equippedIds.has(id)) return null;
    if (source === 'inventory') {
      return item.slot === 'consumable'
        ? `Положи на пояс «${item.name}» из сундука`
        : `Надень «${item.name}» из сундука`;
    }
    if (source === 'shop') return `Купи «${item.name}» в торговом квартале`;
    return `Создай «${item.name}» в кузнице — рецепт уже открыт`;
  };

  const bestItem = (filter = () => true, score = itemScore) => {
    const options = [];
    for (const id of sources.keys()) {
      const item = ITEM_BY_ID[id];
      if (!filter(item)) continue;
      const text = itemAction(id);
      if (text) options.push({ item, text });
    }
    options.sort((a, b) => score(b.item) - score(a.item));
    return options[0]?.text || null;
  };

  const isUpgrade = (item) => {
    if (item.slot === 'shield' && isShieldBlocked(state.equipped)) return false;
    const scoreAt = (slot) => state.equipped[slot] ? itemScore(ITEM_BY_ID[state.equipped[slot]]) : -1;
    const current = item.slot === 'ring'
      ? Math.min(scoreAt('ring1'), scoreAt('ring2'))
      : scoreAt(item.slot);
    return itemScore(item) > current;
  };
  const gearAction = (filter = () => true) => bestItem(
    (item) => item.slot !== 'consumable' && isUpgrade(item) && filter(item),
  );
  const defenseAction = () => gearAction(
    (item) => (item.stats?.armor || 0) > 0 || (item.stats?.hp || 0) > 0 || (item.stats?.block || 0) > 0,
  ) || gearAction() || bestItem((item) => item.id === 'pot_heal');

  const mercAction = () => {
    const candidates = crewStock(state).filter((m) => m.kind === 'merc' && !state.squadMercs.includes(m.id));
    candidates.sort((a, b) => Number(b.role === 'танк') - Number(a.role === 'танк'));
    const merc = candidates[0];
    if (!merc) return null;
    if (state.crew.includes(merc.id)) return `Возьми «${merc.name}» в отряд через таверну`;
    return `Найми в таверне «${merc.name}»${merc.role === 'танк' ? ' для переднего ряда' : ''}`;
  };

  let action = null;
  if (report.timedOut) {
    action = state.settings.tactic !== 'offense'
      ? 'Смени тактику на «Нападение»'
      : bestItem(
        (item) => item.slot !== 'consumable' && isUpgrade(item)
          && ((item.stats?.attack || 0) > 0 || (item.stats?.crit || 0) > 0 || item.traits?.includes('pierce')),
        (item) => (item.stats?.attack || 0) * 4 + (item.stats?.crit || 0) * 100 + itemScore(item) / 100,
      ) || mercAction() || defenseAction();
  } else if (report.deathCause === 'sleep') {
    action = bestItem((item) => (item.stats?.resist?.sleep || 0) > 0 || item.effect?.kind === 'cleanse_sleep')
      || defenseAction();
  } else if (report.deathCause === 'poison') {
    action = bestItem((item) => (item.stats?.resist?.poison || 0) > 0 || item.effect?.kind === 'cleanse_poison')
      || defenseAction();
  } else if ((report.alliesStats || []).length === 1) {
    action = mercAction() || defenseAction();
  } else {
    action = defenseAction();
  }
  action ||= 'Переставь крепких бойцов в передний ряд, а стрелков — за их спины';
  return `${report.advice || 'Не хватило мощи.'} ${action}.`;
}

export function runBattle(state, battleId, seed = 1, options = {}) {
  const battle = BATTLE_BY_ID[battleId];
  if (!battle || !battleAvailable(state, battleId)) return null;
  const practice = options.practice === true;
  const now = options.now ?? Date.now();
  const energy = battleEnergyTerms(state, battle, now);
  if (!practice && energy.repeat && !energy.enough) {
    return {
      blocked: 'energy', ok: false, battle, practice: false, rewards: [],
      energySpent: 0, energyAfter: energy.value, energyCost: energy.cost,
      error: `Для наградного повтора нужно ${energy.cost} энергии. Сейчас: ${energy.value}. Можно выбрать тренировку без наград.`,
    };
  }
  const tutorial = onboardingBattleOptions(state, battleId);
  const result = runFormationBattle(state, battle, seed, {
    preserveBeltOnDefeat: options.preserveBeltOnDefeat ?? tutorial.preserveBeltOnDefeat,
    practice, now, energy,
  });
  if (!result.victory) result.report.advice = accessibleBattleAdvice(state, result.report);
  if (!practice) onboardingBattleFinished(state, battleId, result);
  return result;
}

function enemyReward(enemyId, knightStats) {
  // Монеты считаются на уровне боя; здесь остаются немонетные награды врагов.
  const def = enemyRewardDef(enemyId);
  if (!def) return [];
  const out = [];
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
    restartOnboarding(state);
    return state.onboarding.status === 'done'
      ? 'Учебная дуга сверена: уже сделанное повторять не нужно.'
      : 'Обучение сброшено. Кот-хранитель снова всё покажет.';
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

export function loadGame(storage, now = Date.now()) {
  const s = storage || (typeof localStorage !== 'undefined' ? localStorage : null);
  if (!s) return null;
  try {
    const raw = s.getItem(SAVE_KEY) || s.getItem('cozy_adventures_save_v1');
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data.coins !== 'number') return null;
    const migrated = migrate(data, now);
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

function runFormationBattle(state, battle, seed, options = {}) {
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
  const consumables = state.settings.useBeltItems === false
    ? []
    : state.consumableBelt
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

  // Начальные клетки для расстановки фигурок — ДО прогона боя
  const obstacles = battle.obstacles || [];
  const initialFormation = {
    allies: allies.map((a) => ({ uid: a.uid, slot: a.slot, cell: [...a.cell], size: a.size || 1 })),
    foes: foes.map((f) => ({ uid: f.uid, slot: f.slot, cell: [...f.cell], size: f.size || 1 })),
    obstacles,
  };

  const result = simulateFormationBattle(allies, foes, seed, state.settings.tactic || 'balance', obstacles);

  const usedIds = knight.potions.filter((p) => p.used).map((p) => p.itemId);
  if (!options.practice && !(options.preserveBeltOnDefeat && !result.victory)) {
    for (const used of usedIds) {
      const i = state.consumableBelt.indexOf(used);
      if (i >= 0) state.consumableBelt.splice(i, 1);
    }
  }

  let rewards = [];
  let energySpent = 0;
  let bossDrop = null;
  if (result.victory && !options.practice) {
    const firstTime = (state.battlesDone[battle.id]?.victories || 0) === 0;
    const energyCost = options.energy?.cost || 0;
    // Единая синхронная транзакция: энергия, победа, находки и обычные награды.
    if (energyCost > 0 && spendBattleEnergy(state, energyCost, options.now ?? Date.now())) {
      energySpent = energyCost;
    }
    state.battlesDone[battle.id] = {
      victories: (state.battlesDone[battle.id]?.victories || 0) + 1,
      at: options.now ?? Date.now(),
    };
    state.stats.battlesWon += 1;
    journalPush(state, '⚔️', `Поход «${battle.name}» — победа! Рыцарь вернулся с трофеями.`);
    rewards.push({
      type: 'coins',
      amount: battleCoinReward(battle, { repeat: !firstTime, goldFind: stats.goldFind || 0 }),
    });
    for (const entry of battle.enemies) {
      const enemyId = typeof entry === 'string' ? entry : entry.id;
      for (const reward of enemyReward(enemyId, stats)) {
        if (reward.type === 'seals' && !firstTime) continue;
        rewards.push(reward);
      }
    }
    bossDrop = rollBossDrop(state, battle, {
      victory: state.battlesDone[battle.id].victories,
      seed,
      itemFind: stats.itemFind || 0,
    });
    if (bossDrop?.dropped) rewards.push({ type: 'item', id: bossDrop.itemId });
    // Повтор: 20% монет и никаких новых печатей; материалы не меняются.
    // Внесетовая находка проходит тот же grantRewards ровно один раз.
    rewards = grantRewards(state, rewards, {});
    if (bossDrop?.dropped) {
      journalPush(state, '🎁', `Редкая находка босса: «${ITEM_BY_ID[bossDrop.itemId].name}».`);
    }
    // Трофей кабинета за первую победу над боем (боссы и розыскные листы)
    const trophy = TROPHY_BY_BATTLE[battle.id];
    if (trophy && !state.trophies.includes(trophy.id)) {
      state.trophies.push(trophy.id);
      rewards.push({ type: 'note', text: `Трофей «${trophy.name}» займёт своё место в кабинете.` });
      journalPush(state, '🏆', `Новый трофей в кабинете: «${trophy.name}» (${battle.name}).`);
    }
    if (traits.includes('heal_after_battle')) {
      rewards.push({ type: 'note', text: 'Амулет очага согрел рыцаря после боя.' });
    }
  }
  if (!options.practice) {
    recordBattleResult(state, battle, {
      ...result, bossDrop, energySpent, practice: false,
    }, {
      companions: state.squadCompanions.length,
      mercs: state.squadMercs.length,
      pet: !!state.pet,
      usedConsumables: usedIds,
    });
  }
  return {
    ...result, rewards, battle, bossDrop,
    practice: options.practice === true,
    energySpent,
    energyAfter: state.battleEnergy?.value ?? 0,
    formation: initialFormation, // начальные клетки (не конец боя!)
  };
}

export { SLOTS, collectStats, isShieldBlocked } from './items.js';
