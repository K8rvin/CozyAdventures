// Рецепты крафта: материалы с боёв → зелья и снаряжение.
// unlockAfter — бой, после которого рецепт появляется в кузнице.
export const RECIPES = [
  // --- Зелья ---
  {
    id: 'rcp_pot_heal', name: 'Сварить зелье лечения', icon: '🧪', kind: 'potion',
    result: { itemId: 'pot_heal', count: 1 },
    materials: { slime_jelly: 2, honey: 1 },
    unlockAfter: 'bt_bees',
    note: 'Слизь даёт тело, мёд — мягкость.',
  },
  {
    id: 'rcp_pot_vigor', name: 'Сварить зелье бодрости', icon: '🧪', kind: 'potion',
    result: { itemId: 'pot_vigor', count: 1 },
    materials: { moth_dust: 2, honey: 1 },
    unlockAfter: 'bt_moths',
    note: 'Пыльца мотылька в малых дозах бодрит.',
  },
  {
    id: 'rcp_pot_stone', name: 'Сварить зелье каменной кожи', icon: '🧪', kind: 'potion',
    result: { itemId: 'pot_stone', count: 1 },
    materials: { brick_chunk: 2, moss_stone: 1 },
    unlockAfter: 'bt_wander_golem',
    note: 'Растворить кладку — стать кладкой. На один бой.',
  },
  {
    id: 'rcp_pot_ink', name: 'Сварить чернильный отвар', icon: '🧪', kind: 'potion',
    result: { itemId: 'pot_ink', count: 1 },
    materials: { ink_drop: 2, page_dust: 1 },
    unlockAfter: 'bk_blots',
    note: 'Горько, зато яд уходит.',
  },
  // --- Снаряжение ---
  {
    id: 'rcp_dagger_firefly', name: 'Выковать кинжал светлячка', icon: '🔪', kind: 'gear',
    result: { itemId: 'wpn_dagger_firefly', count: 1 },
    materials: { glow_moss: 3, moss_stone: 1 },
    coins: 50,
    unlockAfter: 'bt_spirits',
    note: 'Мох светится в клинке, если знать, куда его вшить.',
  },
  {
    id: 'rcp_rng_luck', name: 'Слепить кольцо удачи', icon: '💍', kind: 'gear',
    result: { itemId: 'rng_luck', count: 1 },
    materials: { honey: 2, moth_dust: 1 },
    unlockAfter: 'bt_moths',
    note: 'Мёд держит форму, пыльца держит удачу.',
  },
  {
    id: 'rcp_amu_antidote', name: 'Собрать амулет противоядия', icon: '📿', kind: 'gear',
    result: { itemId: 'amu_antidote', count: 1 },
    materials: { rat_tail: 2, glow_moss: 2 },
    unlockAfter: 'bt_rats',
    note: 'Крысиный хвост — лучший магнит для яда.',
  },
  {
    id: 'rcp_glv_smithee', name: 'Сшить рукавицы кузнеца', icon: '🧤', kind: 'gear',
    result: { itemId: 'glv_smithee', count: 1 },
    materials: { torn_cloth: 2, brick_chunk: 1 },
    unlockAfter: 'bt_bandits',
    note: 'Ткань, пропитанная каменной пылью, не горит.',
  },
  {
    id: 'rcp_shd_guardian', name: 'Выковать щит стража лавки', icon: '🛡️', kind: 'gear',
    result: { itemId: 'shd_guardian', count: 1 },
    materials: { moss_stone: 2, brick_chunk: 2, torn_cloth: 1 },
    coins: 80,
    unlockAfter: 'bt_golem',
    note: 'Тяжёлый, надёжный, с мягкой подкладкой.',
  },
  {
    id: 'rcp_lumberaxe', name: 'Выковать топор дровосека', icon: '🪓', kind: 'gear',
    result: { itemId: 'wpn_lumberaxe', count: 1 },
    materials: { willow_heart: 1, brick_chunk: 2 },
    coins: 120,
    unlockAfter: 'bt_boss_willow',
    note: 'Сердце ивы помнит, как расти — и как рубить.',
  },
  {
    id: 'rcp_rng_ink', name: 'Отлить кольцо чернил', icon: '💍', kind: 'gear',
    result: { itemId: 'rng_ink', count: 1 },
    materials: { ink_drop: 3, paper_scrap: 1 },
    unlockAfter: 'bk_blots',
    note: 'Чернила застывают, но продолжают писать.',
  },
  {
    id: 'rcp_amu_pages', name: 'Собрать амулет страниц', icon: '📿', kind: 'gear',
    result: { itemId: 'amu_pages', count: 1 },
    materials: { page_dust: 3, gold_leaf: 1, ectoplasm: 1 },
    unlockAfter: 'bk_illustration',
    note: 'Пыль веков, золото и капля потустороннего.',
  },
];

export const RECIPE_BY_ID = Object.fromEntries(RECIPES.map((r) => [r.id, r]));
