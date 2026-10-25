// Ассортимент лавки. unlockAfter: id боя, после которого товар появляется.
import { ITEM_BY_ID } from './items.js';
import { BATTLE_BY_ID } from './battles.js';
import { battleEconomy, itemPrice, shopUnlockOrder } from '../core/economy.js';

const SHOP_STOCK_ROWS = [
  // Стартовая полка
  { itemId: 'wpn_rusty_sword', unlockAfter: null },
  { itemId: 'shd_wooden', unlockAfter: null },
  { itemId: 'hlm_leather', unlockAfter: null },
  { itemId: 'arm_padded', unlockAfter: null },
  { itemId: 'pot_heal', unlockAfter: null },
  { itemId: 'pot_vigor', unlockAfter: null },
  { itemId: 'bt_path', unlockAfter: null },
  { itemId: 'rng_health', unlockAfter: null },
  // После «Пчелиного дерева» (шлем барсука — до боя с мотыльками!)
  { itemId: 'glv_herbalist', unlockAfter: 'bt_bees' },
  { itemId: 'wpn_oak_mace', unlockAfter: 'bt_bees' },
  { itemId: 'bt_merchant', unlockAfter: 'bt_bees' },
  { itemId: 'rng_luck', unlockAfter: 'bt_bees' },
  { itemId: 'hlm_badger', unlockAfter: 'bt_bees' },
  // После «Поляны мотыльков»
  { itemId: 'amu_antidote', unlockAfter: 'bt_moths' },
  { itemId: 'rng_crit', unlockAfter: 'bt_moths' },
  // После «Заросшей тропы»
  { itemId: 'wpn_hunter_bow', unlockAfter: 'bt_spirits' },
  { itemId: 'arm_silken', unlockAfter: 'bt_spirits' },
  { itemId: 'wpn_greatsword_oak', unlockAfter: 'bt_spirits' },
  { itemId: 'glv_crit', unlockAfter: 'bt_spirits' },
  // После «Мшистого стража»
  { itemId: 'shd_guardian', unlockAfter: 'bt_golem' },
  { itemId: 'arm_oak_guardian', unlockAfter: 'bt_golem' },
  { itemId: 'amu_hearth', unlockAfter: 'bt_golem' },
  { itemId: 'wpn_lumberaxe', unlockAfter: 'bt_golem' },
  // Свитки заклинаний (лавка Мага)
  { itemId: 'scr_fire_arrow', unlockAfter: 'bt_golem' },
  { itemId: 'scr_heal_mist', unlockAfter: 'bt_rats' },
  { itemId: 'scr_frost', unlockAfter: 'bt_bandits' },
  { itemId: 'scr_storm', unlockAfter: 'bk_blots' },
  { itemId: 'scr_fire_step', unlockAfter: 'bk_spirits' },
  // Мир 2: после «Крысиного переулка»
  { itemId: 'wpn_iron_sword', unlockAfter: 'bt_rats' },
  { itemId: 'hlm_kettle', unlockAfter: 'bt_rats' },
  { itemId: 'bt_cobble', unlockAfter: 'bt_rats' },
  { itemId: 'rng_iron', unlockAfter: 'bt_rats' },
  // После «Заставы у склада»
  { itemId: 'arm_chain', unlockAfter: 'bt_bandits' },
  { itemId: 'glv_smithee', unlockAfter: 'bt_bandits' },
  { itemId: 'pot_stone', unlockAfter: 'bt_bandits' },
  // После «Бродячей кладки»
  { itemId: 'wpn_warhammer', unlockAfter: 'bt_wander_golem' },
  { itemId: 'shd_tower', unlockAfter: 'bt_wander_golem' },
  // После «Ночного обхода»
  { itemId: 'amu_fearless', unlockAfter: 'bt_ghost_watch' },
  { itemId: 'rng_duelist', unlockAfter: 'bt_ghost_watch' },
  // Мир 3: после «Пролитых чернил»
  { itemId: 'hlm_page_wanderer', unlockAfter: 'bk_blots' },
  { itemId: 'glv_binder', unlockAfter: 'bk_blots' },
  { itemId: 'pot_ink', unlockAfter: 'bk_blots' },
  { itemId: 'rng_ink', unlockAfter: 'bk_blots' },
  // После «Моли в фолианте»
  { itemId: 'arm_ink_cloak', unlockAfter: 'bk_moths' },
  { itemId: 'bt_quiet_step', unlockAfter: 'bk_moths' },
  // После «Шорохов страниц»
  { itemId: 'wpn_candle_staff', unlockAfter: 'bk_spirits' },
  { itemId: 'amu_pages', unlockAfter: 'bk_spirits' },
  { itemId: 'rng_contents', unlockAfter: 'bk_spirits' },
  { itemId: 'shd_page_shield', unlockAfter: 'bk_spirits' },
  // После «Витражной гравюры»
  { itemId: 'wpn_firebird_quill', unlockAfter: 'bk_illustration' },

  // --- Сказочные топи: сет «Топь» (лавочная часть) ---
  { itemId: 'wpn_swamp_sickle', unlockAfter: 'sw_05' },
  { itemId: 'glv_swamp_fern', unlockAfter: 'sw_06' },
  { itemId: 'bt_swamp_moss', unlockAfter: 'sw_07' },
  { itemId: 'arm_swamp_weave', unlockAfter: 'sw_08' },
  { itemId: 'rng_swamp_glow', unlockAfter: 'sw_09' },
  { itemId: 'hlm_hag_crown', unlockAfter: 'sw_boss' }, // легендарка за печати

  // --- Звёздная ярмарка: сет «Ярмарка» (лавочная часть) ---
  { itemId: 'wpn_fair_hammer', unlockAfter: 'sf_05' },
  { itemId: 'shd_fair_target', unlockAfter: 'sf_06' },
  { itemId: 'arm_fair_vest', unlockAfter: 'sf_08' },
  { itemId: 'amu_fair_ticket', unlockAfter: 'sf_09' },
  { itemId: 'rng_fair_coin', unlockAfter: 'sf_10' },
  { itemId: 'wpn_champion_greatsword', unlockAfter: 'sf_boss' }, // легендарка за печати

  // --- Пепельные степи: сет «Пепел» (лавочная часть) ---
  { itemId: 'wpn_ember_scimitar', unlockAfter: 'ash_05' },
  { itemId: 'glv_ember_forge', unlockAfter: 'ash_06' },
  { itemId: 'arm_ember_scalemail', unlockAfter: 'ash_08' },
  { itemId: 'rng_ember_coal', unlockAfter: 'ash_10' },
  { itemId: 'rng_ember_spark', unlockAfter: 'ash_11' },

  // --- Филлеры миров ---
  // Ночной рынок
  { itemId: 'wpn_nm_fang', unlockAfter: 'nm_05' },
  { itemId: 'hlm_nm_lantern', unlockAfter: 'nm_07' },
  { itemId: 'amu_nm_mask', unlockAfter: 'nm_10' },
  // Хрустальные горы
  { itemId: 'wpn_cr_pick', unlockAfter: 'cr_05' },
  { itemId: 'rng_cr_echo', unlockAfter: 'cr_06' },
  { itemId: 'arm_cr_crystal', unlockAfter: 'cr_08' },
  { itemId: 'scr_crystal_rain', unlockAfter: 'cr_10' },
  { itemId: 'amu_quartz_heart', unlockAfter: 'cr_boss' }, // легендарка за печати
  // Нефритовый сад
  { itemId: 'bt_jade_silk', unlockAfter: 'jade_05' },
  { itemId: 'pot_jade_tea', unlockAfter: 'jade_05' },
  { itemId: 'wpn_jade_fan', unlockAfter: 'jade_06' },
  { itemId: 'amu_jade_pearl', unlockAfter: 'jade_09' },
  // Подводный грот
  { itemId: 'wpn_deep_coral', unlockAfter: 'deep_05' },
  { itemId: 'pot_deep_air', unlockAfter: 'deep_06' },
  { itemId: 'shd_deep_shell', unlockAfter: 'deep_07' },
  { itemId: 'rng_deep_pearl', unlockAfter: 'deep_08' },
  // Туманные часы
  { itemId: 'glv_mist_gear', unlockAfter: 'mist_06' },
  { itemId: 'wpn_mist_pendulum', unlockAfter: 'mist_08' },
  { itemId: 'amu_mist_sand', unlockAfter: 'mist_10' },
  { itemId: 'scr_mist_slow', unlockAfter: 'mist_12' },
  { itemId: 'rng_time_loop', unlockAfter: 'mist_boss' }, // легендарка за печати
];

function shopProgress(entry) {
  const battle = entry.unlockAfter ? BATTLE_BY_ID[entry.unlockAfter] : null;
  return {
    tier: entry.tier ?? (battle ? battleEconomy(battle).tier : 0),
    order: entry.order ?? shopUnlockOrder(entry.unlockAfter),
  };
}

// Явные tier/order и эффективная цена доступны всем операциям, а не только витрине.
export const SHOP_STOCK = SHOP_STOCK_ROWS.map((entry) => ({ ...entry, ...shopProgress(entry) }));

export function pricedShopItem(entry) {
  const item = ITEM_BY_ID[entry.itemId];
  const progress = shopProgress(entry);
  return { ...item, ...progress, price: itemPrice(item, { tier: progress.tier }) };
}

export function compareShopItems(a, b) {
  return (a.tier ?? 0) - (b.tier ?? 0)
    || (a.order ?? 0) - (b.order ?? 0)
    || (a.price ?? 0) - (b.price ?? 0)
    || a.id.localeCompare(b.id, 'ru');
}

// Тематические лавки города (площадь): ассортимент выводится из SHOP_STOCK
// по типу предмета. Лавка на перекрёстке продаёт украшения и скупает товары.
export const SHOPS = {
  armory: {
    name: 'Оружейник «Сталь и верность»', icon: '🗡️',
    desc: 'Клинки и древковое. Звон металла, запах масла.',
    types: ['sword', 'mace', 'dagger', 'greatsword', 'greataxe', 'bow', 'staff'],
  },
  armorer: {
    name: 'Бронник «Дуб и железо»', icon: '🛡️',
    desc: 'Щиты, шлемы, броня, перчатки и сапоги. Меряют на глаз и не ошибаются.',
    types: ['shield', 'helmet', 'armor', 'gloves', 'boots'],
  },
  magic: {
    name: 'Маг «Луна и чернила»', icon: '🔮',
    desc: 'Амулеты и кольца, свитки заклинаний, звёздная пыль.',
    types: ['amulet', 'ring', 'scroll'],
  },
  alchemy: {
    name: 'Алхимик «Котёл и роса»', icon: '🧪',
    desc: 'Зелья, отвары и настойки. Булькает круглый год.',
    types: ['potion'],
  },
};

export function itemsForShop(state, shopKey, allItems) {
  const shop = SHOPS[shopKey];
  if (!shop) return [];
  return allItems.filter((i) => shop.types.includes(i.type)).sort(compareShopItems);
}

// Таверна и конюшня: найм спутников, питомцев и наёмников.
// kind: companion | pet | merc
export const CREW_STOCK = [
  { id: 'cmp_firefly', kind: 'companion', unlockAfter: 'bt_slimes' },
  { id: 'cmp_cat', kind: 'companion', unlockAfter: 'bt_slimes' },
  { id: 'cmp_herbalist', kind: 'companion', unlockAfter: 'bt_bees' },
  { id: 'cmp_smith', kind: 'companion', unlockAfter: 'bt_boss_willow' },
  { id: 'pet_puppy', kind: 'pet', unlockAfter: 'bt_slimes' },
  { id: 'pet_hedgehog', kind: 'pet', unlockAfter: 'bt_moths' },
  { id: 'pet_fox', kind: 'pet', unlockAfter: 'bt_boss_willow' },
  { id: 'merc_archer', kind: 'merc', unlockAfter: 'bt_bees' },
  { id: 'merc_guard', kind: 'merc', unlockAfter: 'bt_moths' },
  { id: 'merc_witch', kind: 'merc', unlockAfter: 'bt_boss_willow' },
  { id: 'merc_knight_errant', kind: 'merc', unlockAfter: 'bt_town_mix' },
  { id: 'pet_horse', kind: 'pet', unlockAfter: 'bt_bandits' },
  { id: 'pet_owl', kind: 'pet', unlockAfter: 'bk_moths' },
];
