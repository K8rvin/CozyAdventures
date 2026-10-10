// Предметы первого мира «Тихая опушка».
// Слоты: weapon, shield, helmet, armor, gloves, boots, amulet, ring.
// hand: "one" | "two" — двуручное оружие блокирует слот щита.
// stats: hp, attack, armor, speed, crit (0..1), dodge (0..1), block (0..1),
//        goldFind (0..1), itemFind (0..1), resist: {fire, poison, sleep, slow}

export const ITEMS = [
  // --- Оружие: одноручное ---
  {
    id: 'wpn_rusty_sword', name: 'Дедов меч', slot: 'weapon', hand: 'one', type: 'sword',
    rarity: 'common', price: 40,
    stats: { attack: 6 },
    description: 'Старый, но острый. Пахнет лавандой из лавки.',
  },
  {
    id: 'wpn_oak_mace', set: 'town', name: 'Дубовая булава', slot: 'weapon', hand: 'one', type: 'mace',
    rarity: 'common', price: 70,
    stats: { attack: 9, speed: -1 },
    description: 'Тяжёлая дубина. Хорошо стучит по мшистым големам.',
  },
  {
    id: 'wpn_dagger_firefly', set: 'meadow', name: 'Кинжал светлячка', slot: 'weapon', hand: 'one', type: 'dagger',
    rarity: 'rare', price: 130,
    stats: { attack: 7, speed: 3, crit: 0.08 },
    description: 'Лёгкий клинок, светится в темноте.',
  },
  // --- Оружие: двуручное ---
  {
    id: 'wpn_greatsword_oak', name: 'Дубовый двуручник', slot: 'weapon', hand: 'two', type: 'greatsword',
    rarity: 'rare', price: 180,
    stats: { attack: 18, speed: -2 },
    traits: ['cleave_small'],
    description: 'Тяжёлый, но надёжный меч из морёного дуба. Щит с ним не удержать.',
  },
  {
    id: 'wpn_lumberaxe', name: 'Топор дровосека духов', slot: 'weapon', hand: 'two', type: 'greataxe',
    rarity: 'epic', price: 260,
    stats: { attack: 24, speed: -3, crit: 0.05 },
    traits: ['cleave_small', 'bonus_spirit'],
    description: 'Рассекает толпы духов, как сухие ветки.',
  },
  {
    id: 'wpn_hunter_bow', set: 'meadow', name: 'Лук ночного охотника', slot: 'weapon', hand: 'two', type: 'bow',
    rarity: 'rare', price: 200,
    stats: { attack: 13, speed: 2, crit: 0.12 },
    traits: ['ranged', 'bonus_spirit'],
    description: 'Тетива напевает тихо, чтобы не спугнуть духов.',
  },
  // --- Щиты ---
  {
    id: 'shd_wooden', set: 'meadow', name: 'Щит из липы', slot: 'shield', hand: 'one', type: 'shield',
    rarity: 'common', price: 50,
    stats: { armor: 8, block: 0.15 },
    description: 'Лёгкий щит. На обороте — детский рисунок углём.',
  },
  {
    id: 'shd_guardian', set: 'town', name: 'Щит стража лавки', slot: 'shield', hand: 'one', type: 'shield',
    rarity: 'rare', price: 150,
    stats: { armor: 14, hp: 10, block: 0.25 },
    traits: ['thorns_small'],
    description: 'С таким щитом лавка может спать спокойно.',
  },
  // --- Шлемы ---
  {
    id: 'hlm_badger', set: 'meadow', name: 'Шлем сонного барсука', slot: 'helmet', type: 'helmet',
    rarity: 'rare', price: 120,
    stats: { hp: 15, resist: { sleep: 0.55 } },
    description: 'Рыцарь не засыпает от пыльцы ночных мотыльков.',
  },
  {
    id: 'hlm_leather', name: 'Кожаный капюшон', slot: 'helmet', type: 'helmet',
    rarity: 'common', price: 45,
    stats: { hp: 8, dodge: 0.03 },
    description: 'Пахнет дождём и травами.',
  },
  // --- Броня ---
  {
    id: 'arm_padded', name: 'Стёганый камзол', slot: 'armor', type: 'armor',
    rarity: 'common', price: 60,
    stats: { armor: 10, hp: 10 },
    description: 'Сшит хозяйкой лавки. Тёплый и честный.',
  },
  {
    id: 'arm_oak_guardian', name: 'Броня дубового стража', slot: 'armor', type: 'armor',
    rarity: 'epic', price: 240,
    stats: { armor: 30, hp: 10 },
    traits: ['first_hit_reduction'],
    description: 'Первый удар в бою снижается на 20%.',
  },
  {
    id: 'arm_silken', set: 'meadow', name: 'Шёлковый доспех мотылька', slot: 'armor', type: 'armor',
    rarity: 'rare', price: 170,
    stats: { armor: 12, speed: 3, dodge: 0.07 },
    description: 'Лёгкий, как крыло. Почти не чувствуется.',
  },
  // --- Перчатки ---
  {
    id: 'glv_herbalist', set: 'meadow', name: 'Перчатки травницы', slot: 'gloves', type: 'gloves',
    rarity: 'common', price: 55,
    stats: { attack: 3, resist: { poison: 0.25 } },
    description: 'Не боятся ни крапивы, ни ядовитых слизней.',
  },
  {
    id: 'glv_crit', name: 'Перчатки точного удара', slot: 'gloves', type: 'gloves',
    rarity: 'rare', price: 140,
    stats: { attack: 4, crit: 0.07 },
    description: 'Швы ложатся точно по линиям судьбы.',
  },
  // --- Сапоги ---
  {
    id: 'bt_path', set: 'meadow', name: 'Сапоги тропинок', slot: 'boots', type: 'boots',
    rarity: 'common', price: 50,
    stats: { speed: 2, dodge: 0.04 },
    description: 'Сами находят сухое место в луже.',
  },
  {
    id: 'bt_merchant', set: 'meadow', name: 'Сапоги торгового странника', slot: 'boots', type: 'boots',
    rarity: 'rare', price: 110,
    stats: { speed: 1, goldFind: 0.15 },
    description: 'После боя в траве находится больше монет.',
  },
  // --- Амулеты ---
  {
    id: 'amu_hearth', name: 'Амулет домашнего очага', slot: 'amulet', type: 'amulet',
    rarity: 'rare', price: 130,
    stats: { hp: 10, resist: { fire: 0.3 } },
    traits: ['heal_after_battle'],
    description: 'После боя рыцарь чувствует себя как дома.',
  },
  {
    id: 'amu_antidote', set: 'meadow', name: 'Амулет противоядия', slot: 'amulet', type: 'amulet',
    rarity: 'rare', price: 120,
    stats: { resist: { poison: 0.45 } },
    description: 'Пучок сушёного плауна под стеклом.',
  },
  // --- Кольца ---
  {
    id: 'rng_luck', set: 'meadow', name: 'Кольцо удачи', slot: 'ring', type: 'ring',
    rarity: 'common', price: 60,
    stats: { itemFind: 0.1, goldFind: 0.05 },
    description: 'Лёгкое покалывание в пальце — к находке.',
  },
  {
    id: 'rng_crit', set: 'attic', name: 'Кольцо крита', slot: 'ring', type: 'ring',
    rarity: 'rare', price: 120,
    stats: { crit: 0.06 },
    description: 'Камень вспыхивает в момент верного удара.',
  },
  {
    id: 'rng_health', set: 'meadow', name: 'Кольцо здоровья', slot: 'ring', type: 'ring',
    rarity: 'common', price: 55,
    stats: { hp: 12 },
    description: 'Тёплое на ощупь, как кружка чая.',
  },
  // --- Расходники ---
  {
    id: 'pot_heal', name: 'Зелье лечения', slot: 'consumable', type: 'potion',
    rarity: 'common', price: 30, stackable: true,
    effect: { kind: 'heal', amount: 40, atHpBelow: 0.35 },
    description: 'Автоматически выпивается в бою при низком здоровье.',
  },
  {
    id: 'pot_vigor', name: 'Зелье бодрости', slot: 'consumable', type: 'potion',
    rarity: 'common', price: 35, stackable: true,
    effect: { kind: 'cleanse_sleep', resistAfter: { sleep: 0.6 } },
    description: 'Снимает сон и бодрит до конца боя.',
  },
  // --- Свитки заклинаний (пояс) ---
  {
    id: 'scr_fire_arrow', name: 'Свиток стрелы огня', slot: 'consumable', type: 'scroll',
    rarity: 'rare', price: 90, stackable: true,
    effect: { kind: 'scroll_fire_arrow', dmg: 25 },
    description: 'В начале боя бьёт огнём самого живучего врага, игнорируя половину брони.',
  },
  {
    id: 'scr_heal_mist', name: 'Свиток целительной росы', slot: 'consumable', type: 'scroll',
    rarity: 'rare', price: 120, stackable: true,
    effect: { kind: 'scroll_heal_mist', amount: 20 },
    description: 'В начале боя лечит весь отряд на 20 здоровья.',
  },
  {
    id: 'scr_frost', name: 'Свиток ледяных оков', slot: 'consumable', type: 'scroll',
    rarity: 'rare', price: 140, stackable: true,
    effect: { kind: 'scroll_frost', ticks: 40, factor: 0.6 },
    description: 'В начале боя замедляет всех врагов — они реже ходят.',
  },
  {
    id: 'scr_storm', name: 'Свиток грозы', slot: 'consumable', type: 'scroll',
    rarity: 'epic', price: 160, stackable: true,
    effect: { kind: 'scroll_storm', dmg: 22 },
    description: 'В начале боя бьёт молнией двух самых хрупких врагов.',
  },
  {
    id: 'scr_fire_step', name: 'Свиток шага огня', slot: 'consumable', type: 'scroll',
    rarity: 'epic', price: 240, stackable: true,
    effect: { kind: 'scroll_fire_step', dmg: 18 },
    description: 'В начале боя бьёт огнём по площади — задевает ВСЕХ врагов. Дорого.',
  },
];

// --- Мир 2: железный ярус Средневекового дворика ---
ITEMS.push(
  {
    id: 'wpn_iron_sword', set: 'town', name: 'Железный меч стражника', slot: 'weapon', hand: 'one', type: 'sword',
    rarity: 'rare', price: 220,
    stats: { attack: 14, block: 0.03 },
    description: 'Казарменная работа: без излишеств, но надёжно.',
  },
  {
    id: 'wpn_warhammer', name: 'Молот каменщика', slot: 'weapon', hand: 'two', type: 'greataxe',
    rarity: 'epic', price: 340,
    stats: { attack: 30, speed: -3 },
    traits: ['cleave_small'],
    description: 'Им кладут стены. И раскладывают бродячих големов.',
  },
  {
    id: 'shd_tower', set: 'town', name: 'Башенный щит', slot: 'shield', hand: 'one', type: 'shield',
    rarity: 'epic', price: 280,
    stats: { armor: 20, hp: 15, block: 0.3, speed: -1 },
    description: 'За таким щитом можно переждать и осаду, и дождь.',
  },
  {
    id: 'hlm_kettle', set: 'town', name: 'Железный шлем', slot: 'helmet', type: 'helmet',
    rarity: 'rare', price: 190,
    stats: { armor: 8, hp: 12, resist: { sleep: 0.2 } },
    description: 'Гулко звенит, если задремать на посту.',
  },
  {
    id: 'arm_chain', set: 'town', name: 'Кольчуга дворника-ветерана', slot: 'armor', type: 'armor',
    rarity: 'rare', price: 260,
    stats: { armor: 22, hp: 15 },
    description: 'Каждое кольцо помнит свою историю.',
  },
  {
    id: 'glv_smithee', set: 'town', name: 'Рукавицы кузнеца', slot: 'gloves', type: 'gloves',
    rarity: 'rare', price: 200,
    stats: { attack: 6, resist: { fire: 0.25 } },
    description: 'Не боятся ни горна, ни чужого огня.',
  },
  {
    id: 'bt_cobble', set: 'town', name: 'Сапоги по брусчатке', slot: 'boots', type: 'boots',
    rarity: 'rare', price: 170,
    stats: { speed: 3, dodge: 0.05 },
    description: 'Каблуки выбивают уверенную дробь по мостовой.',
  },
  {
    id: 'amu_fearless', set: 'town', name: 'Амулет отваги', slot: 'amulet', type: 'amulet',
    rarity: 'epic', price: 300,
    stats: { hp: 8, resist: { sleep: 0.15 } },
    traits: ['fearless'],
    description: 'Сердце рыцаря бьётся ровно, даже когда за спиной шепчет призрак.',
  },
  {
    id: 'rng_iron', set: 'town', name: 'Железное кольцо', slot: 'ring', type: 'ring',
    rarity: 'rare', price: 150,
    stats: { attack: 3, armor: 4 },
    description: 'Простое, как гвоздь. Крепкое, как гвоздь.',
  },
  {
    id: 'rng_duelist', set: 'town', name: 'Кольцо дуэлянта', slot: 'ring', type: 'ring',
    rarity: 'epic', price: 260,
    stats: { crit: 0.08, speed: 1 },
    description: 'Для тех, кто бьёт первым и метко.',
  },
  {
    id: 'pot_stone', name: 'Зелье каменной кожи', slot: 'consumable', type: 'potion',
    rarity: 'rare', price: 60, stackable: true,
    effect: { kind: 'shield', amount: 25, atStart: true },
    description: 'В начале боя даёт щит, поглощающий 25 урона.',
  },
);

// --- Мир 3: волшебный ярус Книжного чердака ---
ITEMS.push(
  {
    id: 'wpn_candle_staff', set: 'attic', name: 'Посох свечного мага', slot: 'weapon', hand: 'two', type: 'staff',
    rarity: 'epic', price: 420,
    stats: { attack: 34, speed: -2 },
    traits: ['pierce', 'ranged'],
    description: 'Пламя на конце прошивает даже камень. Обе руки заняты.',
  },
  {
    id: 'wpn_firebird_quill', name: 'Перо жар-птицы', slot: 'weapon', hand: 'one', type: 'dagger',
    rarity: 'legendary', price: 0, sealPrice: 6,
    stats: { attack: 16, speed: 4, crit: 0.18 },
    description: 'Пишет историю боя само. Легенда чердака.',
  },
  {
    id: 'arm_ink_cloak', set: 'attic', name: 'Чернильный плащ', slot: 'armor', type: 'armor',
    rarity: 'epic', price: 380,
    stats: { armor: 18, dodge: 0.1, resist: { poison: 0.3 } },
    description: 'Кляксы скользят, не оставляя следов.',
  },
  {
    id: 'hlm_page_wanderer', set: 'attic', name: 'Колпак странника страниц', slot: 'helmet', type: 'helmet',
    rarity: 'rare', price: 260,
    stats: { hp: 18, resist: { sleep: 0.35 }, itemFind: 0.08 },
    description: 'Под таким колпаком снятся только хорошие истории.',
  },
  {
    id: 'glv_binder', set: 'attic', name: 'Перчатки переплётчика', slot: 'gloves', type: 'gloves',
    rarity: 'rare', price: 240,
    stats: { attack: 5, armor: 4 },
    description: 'Крепкие швы — крепкая хватка.',
  },
  {
    id: 'bt_quiet_step', set: 'attic', name: 'Сапоги тихого шага', slot: 'boots', type: 'boots',
    rarity: 'epic', price: 300,
    stats: { speed: 4, dodge: 0.08 },
    description: 'Шаг мягче переворачиваемой страницы.',
  },
  {
    id: 'amu_pages', set: 'attic', name: 'Амулет страниц', slot: 'amulet', type: 'amulet',
    rarity: 'epic', price: 340,
    stats: { hp: 15, resist: { sleep: 0.2, poison: 0.2 } },
    traits: ['heal_after_battle'],
    description: 'Пахнет старой бумагой. После боя рыцарь отдыхает быстрее.',
  },
  {
    id: 'rng_ink', set: 'attic', name: 'Кольцо чернил', slot: 'ring', type: 'ring',
    rarity: 'rare', price: 180,
    stats: { attack: 4, resist: { poison: 0.15 } },
    description: 'Внутри плавает тёмная капля.',
  },
  {
    id: 'rng_contents', set: 'attic', name: 'Кольцо оглавления', slot: 'ring', type: 'ring',
    rarity: 'epic', price: 280,
    stats: { speed: 2, goldFind: 0.1, itemFind: 0.1 },
    description: 'Всегда знает, на какой странице клад.',
  },
  {
    id: 'pot_ink', name: 'Чернильный отвар', slot: 'consumable', type: 'potion',
    rarity: 'rare', price: 70, stackable: true,
    effect: { kind: 'cleanse_poison', resistAfter: { poison: 0.6 } },
    description: 'Горький. Выводит яд из крови и из книг.',
  },
);

// --- Сет «Мастер»: только крафт, в лавках не продаётся ---
ITEMS.push(
  {
    id: 'wpn_master_dagger', set: 'master', name: 'Стилет мастера', slot: 'weapon', hand: 'one', type: 'dagger',
    rarity: 'epic', price: 0,
    stats: { attack: 18, crit: 0.06 },
    description: 'Выкован из светящегося мха и мшистого камня. В лавке такого нет.',
  },
  {
    id: 'shd_master', set: 'master', name: 'Зеркальный щит мастера', slot: 'shield', hand: 'one', type: 'shield',
    rarity: 'epic', price: 0,
    stats: { armor: 18, block: 0.2, hp: 10 },
    description: 'Полирован до блеска тряпкой из рваной ткани и терпения.',
  },
  {
    id: 'hlm_master', set: 'master', name: 'Обруч мастера', slot: 'helmet', type: 'helmet',
    rarity: 'epic', price: 0,
    stats: { hp: 14, dodge: 0.04 },
    description: 'Лёгкий обруч с сердцем старой ивы внутри.',
  },
  {
    id: 'arm_master', set: 'master', name: 'Камзол мастера', slot: 'armor', type: 'armor',
    rarity: 'epic', price: 0,
    stats: { armor: 24, hp: 18 },
    description: 'Стёганый, пропитанный чернильным отваром. Тёплый и волшебный.',
  },
  {
    id: 'glv_master', set: 'master', name: 'Наперстки мастера', slot: 'gloves', type: 'gloves',
    rarity: 'epic', price: 0,
    stats: { attack: 6, crit: 0.04 },
    description: 'Пальцы сами находят слабые места.',
  },
  {
    id: 'bt_master', set: 'master', name: 'Сапоги мастера', slot: 'boots', type: 'boots',
    rarity: 'epic', price: 0,
    stats: { speed: 3, dodge: 0.05 },
    description: 'Подошва из крысиного хвоста. Бесшумны.',
  },
  {
    id: 'amu_master', set: 'master', name: 'Фильгрань мастера', slot: 'amulet', type: 'amulet',
    rarity: 'epic', price: 0,
    stats: { hp: 12, resist: { poison: 0.3 } },
    description: 'Амулет с пучком плауна и каплей светящегося мха.',
  },
  {
    id: 'rng_master', set: 'master', name: 'Перстень мастера', slot: 'ring', type: 'ring',
    rarity: 'epic', price: 0,
    stats: { crit: 0.05, goldFind: 0.08 },
    description: 'Отлит из мёда и пыльцы мотылька. Внутри шевелится удача.',
  },
  {
    id: 'rng_master_loop', set: 'master', name: 'Кольцо напарника мастера', slot: 'ring', type: 'ring',
    rarity: 'epic', price: 0,
    stats: { attack: 3, armor: 3 },
    description: 'Второй перстень пары. С первым мурлычет друг другу.',
  },
  {
    id: 'shd_page_shield', set: 'attic', name: 'Щит-переплёт', slot: 'shield', hand: 'one', type: 'shield',
    rarity: 'rare', price: 230,
    stats: { armor: 10, dodge: 0.05, hp: 8 },
    description: 'Крышка древнего фолианта на ремне. Легче дерева, крепче кожи.',
  },
);

export const ITEM_BY_ID = Object.fromEntries(ITEMS.map((i) => [i.id, i]));

export const RARITY_LABEL = {
  common: 'Обычный', rare: 'Редкий', epic: 'Волшебный', legendary: 'Легендарный',
};
