// Настройки нормативной экономики. Это не таймеры игрока: секунды описывают
// условный объём чтения, освоения и действий, нужный для сравнения контента.
export const ECONOMY_VERSION = 1;
// Вступление и завершение первого стандартного прохождения; повтор не увеличивает.
export const FIRST_COMPLETION_SECONDS = 20;
export const PUZZLE_REPEAT_FACTOR = 0.25;
export const BATTLE_REPEAT_FACTOR = 0.2;
export const DAILY_COIN_FACTOR = 2;
export const BOSS_COIN_MULTIPLIER = 1.6;
export const WANTED_COIN_MULTIPLIER = 1.35;

// first/repeat — базовые секунды; difficulty/metric — добавки за сложность и
// контентные метрики (буквы, клетки, карты, шаги рецепта, гости и т.п.).
export const PUZZLE_TYPE_ECONOMY = {
  mirror: { first: 40, repeat: 25, difficulty: 8, repeatDifficulty: 4, metric: 2, repeatMetric: 1 },
  shelf: { first: 45, repeat: 30, difficulty: 8, repeatDifficulty: 4, metric: 3, repeatMetric: 2 },
  riddle: { first: 35, repeat: 20, difficulty: 6, repeatDifficulty: 3, metric: 1, repeatMetric: 0.5 },
  hang: { first: 55, repeat: 35, difficulty: 8, repeatDifficulty: 4, metric: 1.5, repeatMetric: 0.8 },
  seek: { first: 45, repeat: 30, difficulty: 8, repeatDifficulty: 4, metric: 3, repeatMetric: 1.5 },
  path: { first: 45, repeat: 30, difficulty: 8, repeatDifficulty: 4, metric: 2, repeatMetric: 1 },
  tea: { first: 50, repeat: 32, difficulty: 8, repeatDifficulty: 4, metric: 3, repeatMetric: 1.5 },
  mech: { first: 50, repeat: 32, difficulty: 8, repeatDifficulty: 4, metric: 2, repeatMetric: 1 },
  candle: { first: 45, repeat: 30, difficulty: 8, repeatDifficulty: 4, metric: 2, repeatMetric: 1 },
  flow: { first: 55, repeat: 35, difficulty: 8, repeatDifficulty: 4, metric: 2, repeatMetric: 1 },
  brew: { first: 45, repeat: 30, difficulty: 6, repeatDifficulty: 3, metric: 3, repeatMetric: 1.5 },
  fate: { first: 45, repeat: 30, difficulty: 6, repeatDifficulty: 3, metric: 3, repeatMetric: 1.5 },
  glass: { first: 40, repeat: 25, difficulty: 5, repeatDifficulty: 3, metric: 1.2, repeatMetric: 0.7 },
  spin: { first: 40, repeat: 25, difficulty: 5, repeatDifficulty: 3, metric: 1.2, repeatMetric: 0.7 },
  gift: { first: 45, repeat: 30, difficulty: 6, repeatDifficulty: 3, metric: 3, repeatMetric: 1.5 },
  seating: { first: 50, repeat: 35, difficulty: 6, repeatDifficulty: 3, metric: 5, repeatMetric: 3 },
  custom: { first: 45, repeat: 30, difficulty: 6, repeatDifficulty: 3, metric: 1, repeatMetric: 0.5 },
};

// Первые задания включают время на знакомство с правилами. Их награды остаются
// в диапазоне 20 монет/мин, а стартовая корзина не требует дополнительного фарма.
export const PUZZLE_ECONOMY_OVERRIDES = {
  md_01: { expectedFirstSeconds: 120, expectedRepeatSeconds: 60 },
  md_02: { expectedFirstSeconds: 135, expectedRepeatSeconds: 60 },
  tw_01: { expectedFirstSeconds: 135, expectedRepeatSeconds: 60 },
  sk_md_01: { expectedFirstSeconds: 135, expectedRepeatSeconds: 60 },
  pp_01: { expectedFirstSeconds: 135, expectedRepeatSeconds: 60 },
};

export const WORLD_ECONOMY_TIER = {
  meadow: 0,
  town: 1,
  attic: 2,
  crossroads: 3,
  nm: 3,
  sw: 3,
  sf: 3,
  cr: 4,
  ash: 4,
  jade: 4,
  deep: 5,
  mist: 5,
};

export const BATTLE_ECONOMY_OVERRIDES = {
  bt_slimes: { expectedFirstSeconds: 120, expectedRepeatSeconds: 70 },
};

export const PRICE_TARGET_MINUTES = {
  consumable: 2,
  common: 6,
  rare: 16,
  epic: 36,
  legendary: 40,
};

// Осознанные стартовые цены. Остальные товары считаются по ярусу и редкости.
export const ITEM_PRICE_OVERRIDES = {
  wpn_rusty_sword: 60,
  shd_wooden: 80,
  hlm_leather: 70,
  arm_padded: 90,
  pot_heal: 50,
  pot_vigor: 50,
  bt_path: 80,
  rng_health: 80,
};

// Порядок открытия магазина, независимый от расположения записей в SHOP_STOCK.
export const SHOP_UNLOCK_ORDER = [
  null,
  'bt_bees', 'bt_moths', 'bt_spirits', 'bt_golem',
  'bt_rats', 'bt_bandits', 'bt_wander_golem', 'bt_ghost_watch',
  'bk_blots', 'bk_moths', 'bk_spirits', 'bk_illustration',
  'nm_05', 'nm_07', 'nm_10',
  'sw_05', 'sw_06', 'sw_07', 'sw_08', 'sw_09', 'sw_boss',
  'sf_05', 'sf_06', 'sf_08', 'sf_09', 'sf_10', 'sf_boss',
  'cr_05', 'cr_06', 'cr_08', 'cr_10', 'cr_boss',
  'ash_05', 'ash_06', 'ash_08', 'ash_10', 'ash_11',
  'jade_05', 'jade_06', 'jade_09',
  'deep_05', 'deep_06', 'deep_07', 'deep_08',
  'mist_06', 'mist_08', 'mist_10', 'mist_12', 'mist_boss',
];
