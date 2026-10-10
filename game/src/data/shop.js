// Ассортимент лавки. unlockAfter: id боя, после которого товар появляется.
export const SHOP_STOCK = [
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
];

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
  return allItems.filter((i) => shop.types.includes(i.type));
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
