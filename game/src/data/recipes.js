// Рецепты крафта: материалы с боёв → УНИКАЛЬНЫЕ вещи, которых нет в лавках.
// В лавках это не продаётся. Всё снаряжение крафта — сет «Мастер».
// unlockAfter — бой, после которого рецепт появляется в кузнице.
export const RECIPES = [
  // --- Зелья (двойные порции — выгоднее лавки) ---
  {
    id: 'rcp_pot_heal', name: 'Сварить два зелья лечения', icon: '🧪', kind: 'potion',
    result: { itemId: 'pot_heal', count: 2 },
    materials: { slime_jelly: 2, honey: 1 },
    unlockAfter: 'bt_bees',
    note: 'Слизь даёт тело, мёд — мягкость. Двойная порция.',
  },
  {
    id: 'rcp_pot_vigor', name: 'Сварить два зелья бодрости', icon: '🧪', kind: 'potion',
    result: { itemId: 'pot_vigor', count: 2 },
    materials: { moth_dust: 2, honey: 1 },
    unlockAfter: 'bt_moths',
    note: 'Пыльца мотылька в малых дозах бодрит. Двойная порция.',
  },
  {
    id: 'rcp_pot_stone', name: 'Сварить два зелья каменной кожи', icon: '🧪', kind: 'potion',
    result: { itemId: 'pot_stone', count: 2 },
    materials: { brick_chunk: 2, moss_stone: 1 },
    unlockAfter: 'bt_wander_golem',
    note: 'Растворить кладку — стать кладкой. Двойная порция.',
  },
  {
    id: 'rcp_pot_ink', name: 'Сварить два чернильных отвара', icon: '🧪', kind: 'potion',
    result: { itemId: 'pot_ink', count: 2 },
    materials: { ink_drop: 2, page_dust: 1 },
    unlockAfter: 'bk_blots',
    note: 'Горько, зато яд уходит. Двойная порция.',
  },
  // --- Снаряжение сета «Мастер» (только крафт) ---
  {
    id: 'rcp_master_dagger', name: 'Выковать Стилет мастера', icon: '🔪', kind: 'gear',
    result: { itemId: 'wpn_master_dagger', count: 1 },
    materials: { glow_moss: 3, moss_stone: 1 },
    coins: 80,
    unlockAfter: 'bt_spirits',
    note: 'Светящийся мох в клинке. Сет «Мастер» 1/9.',
  },
  {
    id: 'rcp_master_ring', name: 'Отлить Перстень мастера', icon: '💍', kind: 'gear',
    result: { itemId: 'rng_master', count: 1 },
    materials: { honey: 2, moth_dust: 1 },
    unlockAfter: 'bt_moths',
    note: 'Мёд держит форму, пыльца — удачу. Сет «Мастер» 2/9.',
  },
  {
    id: 'rcp_master_amulet', name: 'Собрать Фильгрань мастера', icon: '📿', kind: 'gear',
    result: { itemId: 'amu_master', count: 1 },
    materials: { rat_tail: 2, glow_moss: 2 },
    unlockAfter: 'bt_rats',
    note: 'Плаун и мох под стеклом. Сет «Мастер» 3/9.',
  },
  {
    id: 'rcp_master_gloves', name: 'Сшить Наперстки мастера', icon: '🧤', kind: 'gear',
    result: { itemId: 'glv_master', count: 1 },
    materials: { torn_cloth: 2, brick_chunk: 1 },
    unlockAfter: 'bt_bandits',
    note: 'Ткань в каменной пыли не горит. Сет «Мастер» 4/9.',
  },
  {
    id: 'rcp_master_shield', name: 'Выковать Зеркальный щит', icon: '🛡️', kind: 'gear',
    result: { itemId: 'shd_master', count: 1 },
    materials: { moss_stone: 2, brick_chunk: 2, torn_cloth: 1 },
    coins: 100,
    unlockAfter: 'bt_golem',
    note: 'Полировка до зеркала. Сет «Мастер» 5/9.',
  },
  {
    id: 'rcp_master_helmet', name: 'Сплести Обруч мастера', icon: '🪖', kind: 'gear',
    result: { itemId: 'hlm_master', count: 1 },
    materials: { willow_heart: 1, moth_dust: 2 },
    unlockAfter: 'bt_boss_willow',
    note: 'Сердце ивы в обруче. Сет «Мастер» 6/9.',
  },
  {
    id: 'rcp_master_armor', name: 'Сшить Камзол мастера', icon: '🧥', kind: 'gear',
    result: { itemId: 'arm_master', count: 1 },
    materials: { ink_drop: 3, torn_cloth: 2, moss_stone: 1 },
    unlockAfter: 'bk_blots',
    note: 'Пропитан чернилами. Сет «Мастер» 7/9.',
  },
  {
    id: 'rcp_master_boots', name: 'Склеить Сапоги мастера', icon: '🥾', kind: 'gear',
    result: { itemId: 'bt_master', count: 1 },
    materials: { rat_tail: 2, page_dust: 1, torn_cloth: 1 },
    unlockAfter: 'bk_moths',
    note: 'Бесшумные, как переворот страницы. Сет «Мастер» 8/9.',
  },
  {
    id: 'rcp_master_loop', name: 'Отлить Кольцо напарника', icon: '💍', kind: 'gear',
    result: { itemId: 'rng_master_loop', count: 1 },
    materials: { gold_leaf: 1, ink_drop: 1 },
    unlockAfter: 'bk_illustration',
    note: 'Парное к перстню. Сет «Мастер» 9/9 — собери всё!',
  },
];

export const RECIPE_BY_ID = Object.fromEntries(RECIPES.map((r) => [r.id, r]));
