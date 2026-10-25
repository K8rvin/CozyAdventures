// Предметы первого мира «Тихая опушка».
// Слоты: weapon, shield, helmet, armor, gloves, boots, amulet, ring.
// hand: "one" | "two" — двуручное оружие блокирует слот щита.
// stats: hp, attack, armor, speed, crit (0..1), dodge (0..1), block (0..1),
//        goldFind (0..1), itemFind (0..1), resist: {fire, poison, sleep, slow}

export const ITEMS = [
  // --- Оружие: одноручное ---
  {
    id: 'wpn_rusty_sword', name: 'Дедов меч', slot: 'weapon', hand: 'one', type: 'sword',
    rarity: 'common', price: 60,
    stats: { attack: 6 },
    description: 'Старый, но острый. Пахнет лавандой из лавки.',
  },
  {
    id: 'wpn_oak_mace', set: 'town', name: 'Дубовая булава', slot: 'weapon', hand: 'one', type: 'mace',
    rarity: 'common', price: 110,
    stats: { attack: 9, speed: -1 },
    description: 'Тяжёлая дубина. Хорошо стучит по мшистым големам.',
  },
  {
    id: 'wpn_dagger_firefly', set: 'meadow', name: 'Кинжал светлячка', slot: 'weapon', hand: 'one', type: 'dagger',
    rarity: 'rare', price: 330,
    stats: { attack: 7, speed: 3, crit: 0.08 },
    description: 'Лёгкий клинок, светится в темноте.',
  },
  // --- Оружие: двуручное ---
  {
    id: 'wpn_greatsword_oak', name: 'Дубовый двуручник', slot: 'weapon', hand: 'two', type: 'greatsword',
    rarity: 'rare', price: 450,
    stats: { attack: 18, speed: -2 },
    traits: ['cleave_small'],
    description: 'Тяжёлый, но надёжный меч из морёного дуба. Щит с ним не удержать.',
  },
  {
    id: 'wpn_lumberaxe', name: 'Топор дровосека духов', slot: 'weapon', hand: 'two', type: 'greataxe',
    rarity: 'epic', price: 910,
    stats: { attack: 24, speed: -3, crit: 0.05 },
    traits: ['cleave_small', 'bonus_spirit'],
    description: 'Рассекает толпы духов, как сухие ветки.',
  },
  {
    id: 'wpn_hunter_bow', set: 'meadow', name: 'Лук ночного охотника', slot: 'weapon', hand: 'two', type: 'bow',
    rarity: 'rare', price: 500,
    stats: { attack: 13, speed: 2, crit: 0.12 },
    traits: ['ranged', 'bonus_spirit'],
    description: 'Тетива напевает тихо, чтобы не спугнуть духов.',
  },
  // --- Щиты ---
  {
    id: 'shd_wooden', set: 'meadow', name: 'Щит из липы', slot: 'shield', hand: 'one', type: 'shield',
    rarity: 'common', price: 80,
    stats: { armor: 8, block: 0.15 },
    description: 'Лёгкий щит. На обороте — детский рисунок углём.',
  },
  {
    id: 'shd_guardian', set: 'town', name: 'Щит стража лавки', slot: 'shield', hand: 'one', type: 'shield',
    rarity: 'rare', price: 380,
    stats: { armor: 14, hp: 10, block: 0.25 },
    traits: ['thorns_small'],
    description: 'С таким щитом лавка может спать спокойно.',
  },
  // --- Шлемы ---
  {
    id: 'hlm_badger', set: 'meadow', name: 'Шлем сонного барсука', slot: 'helmet', type: 'helmet',
    rarity: 'rare', price: 300,
    stats: { hp: 15, resist: { sleep: 0.55 } },
    description: 'Рыцарь не засыпает от пыльцы ночных мотыльков.',
  },
  {
    id: 'hlm_leather', name: 'Кожаный капюшон', slot: 'helmet', type: 'helmet',
    rarity: 'common', price: 70,
    stats: { hp: 8, dodge: 0.03 },
    description: 'Пахнет дождём и травами.',
  },
  // --- Броня ---
  {
    id: 'arm_padded', name: 'Стёганый камзол', slot: 'armor', type: 'armor',
    rarity: 'common', price: 90,
    stats: { armor: 10, hp: 10 },
    description: 'Сшит хозяйкой лавки. Тёплый и честный.',
  },
  {
    id: 'arm_oak_guardian', name: 'Броня дубового стража', slot: 'armor', type: 'armor',
    rarity: 'epic', price: 600,
    stats: { armor: 30, hp: 10 },
    traits: ['first_hit_reduction'],
    description: 'Первый удар в бою снижается на 20%.',
  },
  {
    id: 'arm_silken', set: 'meadow', name: 'Шёлковый доспех мотылька', slot: 'armor', type: 'armor',
    rarity: 'rare', price: 430,
    stats: { armor: 12, speed: 3, dodge: 0.07 },
    description: 'Лёгкий, как крыло. Почти не чувствуется.',
  },
  // --- Перчатки ---
  {
    id: 'glv_herbalist', set: 'meadow', name: 'Перчатки травницы', slot: 'gloves', type: 'gloves',
    rarity: 'common', price: 80,
    stats: { attack: 3, resist: { poison: 0.25 } },
    description: 'Не боятся ни крапивы, ни ядовитых слизней.',
  },
  {
    id: 'glv_crit', name: 'Перчатки точного удара', slot: 'gloves', type: 'gloves',
    rarity: 'rare', price: 350,
    stats: { attack: 4, crit: 0.07 },
    description: 'Швы ложатся точно по линиям судьбы.',
  },
  // --- Сапоги ---
  {
    id: 'bt_path', set: 'meadow', name: 'Сапоги тропинок', slot: 'boots', type: 'boots',
    rarity: 'common', price: 80,
    stats: { speed: 2, dodge: 0.04 },
    description: 'Сами находят сухое место в луже.',
  },
  {
    id: 'bt_merchant', set: 'meadow', name: 'Сапоги торгового странника', slot: 'boots', type: 'boots',
    rarity: 'rare', price: 280,
    stats: { speed: 1, goldFind: 0.15 },
    description: 'После боя в траве находится больше монет.',
  },
  // --- Амулеты ---
  {
    id: 'amu_hearth', name: 'Амулет домашнего очага', slot: 'amulet', type: 'amulet',
    rarity: 'rare', price: 330,
    stats: { hp: 10, resist: { fire: 0.3 } },
    traits: ['heal_after_battle'],
    description: 'После боя рыцарь чувствует себя как дома.',
  },
  {
    id: 'amu_antidote', set: 'meadow', name: 'Амулет противоядия', slot: 'amulet', type: 'amulet',
    rarity: 'rare', price: 300,
    stats: { resist: { poison: 0.45 } },
    description: 'Пучок сушёного плауна под стеклом.',
  },
  // --- Кольца ---
  {
    id: 'rng_luck', set: 'meadow', name: 'Кольцо удачи', slot: 'ring', type: 'ring',
    rarity: 'common', price: 90,
    stats: { itemFind: 0.1, goldFind: 0.05 },
    description: 'Лёгкое покалывание в пальце — к находке.',
  },
  {
    id: 'rng_crit', set: 'attic', name: 'Кольцо крита', slot: 'ring', type: 'ring',
    rarity: 'rare', price: 300,
    stats: { crit: 0.06 },
    description: 'Камень вспыхивает в момент верного удара.',
  },
  {
    id: 'rng_health', set: 'meadow', name: 'Кольцо здоровья', slot: 'ring', type: 'ring',
    rarity: 'common', price: 80,
    stats: { hp: 12 },
    description: 'Тёплое на ощупь, как кружка чая.',
  },
  // --- Расходники ---
  {
    id: 'pot_heal', name: 'Зелье лечения', slot: 'consumable', type: 'potion',
    rarity: 'common', price: 50, stackable: true,
    effect: { kind: 'heal', amount: 40, atHpBelow: 0.35 },
    description: 'Автоматически выпивается в бою при низком здоровье.',
  },
  {
    id: 'pot_vigor', name: 'Зелье бодрости', slot: 'consumable', type: 'potion',
    rarity: 'common', price: 50, stackable: true,
    effect: { kind: 'cleanse_sleep', resistAfter: { sleep: 0.6 } },
    description: 'Снимает сон и бодрит до конца боя.',
  },
  // --- Свитки заклинаний (пояс) ---
  {
    id: 'scr_fire_arrow', name: 'Свиток стрелы огня', slot: 'consumable', type: 'scroll',
    rarity: 'rare', price: 140, stackable: true,
    effect: { kind: 'scroll_fire_arrow', dmg: 25 },
    description: 'В начале боя бьёт огнём самого живучего врага, игнорируя половину брони.',
  },
  {
    id: 'scr_heal_mist', name: 'Свиток целительной росы', slot: 'consumable', type: 'scroll',
    rarity: 'rare', price: 300, stackable: true,
    effect: { kind: 'scroll_heal_mist', amount: 20 },
    description: 'В начале боя лечит весь отряд на 20 здоровья.',
  },
  {
    id: 'scr_frost', name: 'Свиток ледяных оков', slot: 'consumable', type: 'scroll',
    rarity: 'rare', price: 350, stackable: true,
    effect: { kind: 'scroll_frost', ticks: 40, factor: 0.6 },
    description: 'В начале боя замедляет всех врагов — они реже ходят.',
  },
  {
    id: 'scr_storm', name: 'Свиток грозы', slot: 'consumable', type: 'scroll',
    rarity: 'epic', price: 400, stackable: true,
    effect: { kind: 'scroll_storm', dmg: 22 },
    description: 'В начале боя бьёт молнией двух самых хрупких врагов.',
  },
  {
    id: 'scr_fire_step', name: 'Свиток шага огня', slot: 'consumable', type: 'scroll',
    rarity: 'epic', price: 600, stackable: true,
    effect: { kind: 'scroll_fire_step', dmg: 18 },
    description: 'В начале боя бьёт огнём по площади — задевает ВСЕХ врагов. Дорого.',
  },
];

// --- Мир 2: железный ярус Средневекового дворика ---
ITEMS.push(
  {
    id: 'wpn_iron_sword', set: 'town', name: 'Железный меч стражника', slot: 'weapon', hand: 'one', type: 'sword',
    rarity: 'rare', price: 550,
    stats: { attack: 14, block: 0.03 },
    description: 'Казарменная работа: без излишеств, но надёжно.',
  },
  {
    id: 'wpn_warhammer', name: 'Молот каменщика', slot: 'weapon', hand: 'two', type: 'greataxe',
    rarity: 'epic', price: 1190,
    stats: { attack: 30, speed: -3 },
    traits: ['cleave_small'],
    description: 'Им кладут стены. И раскладывают бродячих големов.',
  },
  {
    id: 'shd_tower', set: 'town', name: 'Башенный щит', slot: 'shield', hand: 'one', type: 'shield',
    rarity: 'epic', price: 980,
    stats: { armor: 20, hp: 15, block: 0.3, speed: -1 },
    description: 'За таким щитом можно переждать и осаду, и дождь.',
  },
  {
    id: 'hlm_kettle', set: 'town', name: 'Железный шлем', slot: 'helmet', type: 'helmet',
    rarity: 'rare', price: 480,
    stats: { armor: 8, hp: 12, resist: { sleep: 0.2 } },
    description: 'Гулко звенит, если задремать на посту.',
  },
  {
    id: 'arm_chain', set: 'town', name: 'Кольчуга дворника-ветерана', slot: 'armor', type: 'armor',
    rarity: 'rare', price: 910,
    stats: { armor: 22, hp: 15 },
    description: 'Каждое кольцо помнит свою историю.',
  },
  {
    id: 'glv_smithee', set: 'town', name: 'Рукавицы кузнеца', slot: 'gloves', type: 'gloves',
    rarity: 'rare', price: 500,
    stats: { attack: 6, resist: { fire: 0.25 } },
    description: 'Не боятся ни горна, ни чужого огня.',
  },
  {
    id: 'bt_cobble', set: 'town', name: 'Сапоги по брусчатке', slot: 'boots', type: 'boots',
    rarity: 'rare', price: 430,
    stats: { speed: 3, dodge: 0.05 },
    description: 'Каблуки выбивают уверенную дробь по мостовой.',
  },
  {
    id: 'amu_fearless', set: 'town', name: 'Амулет отваги', slot: 'amulet', type: 'amulet',
    rarity: 'epic', price: 1050,
    stats: { hp: 8, resist: { sleep: 0.15 } },
    traits: ['fearless'],
    description: 'Сердце рыцаря бьётся ровно, даже когда за спиной шепчет призрак.',
  },
  {
    id: 'rng_iron', set: 'town', name: 'Железное кольцо', slot: 'ring', type: 'ring',
    rarity: 'rare', price: 380,
    stats: { attack: 3, armor: 4 },
    description: 'Простое, как гвоздь. Крепкое, как гвоздь.',
  },
  {
    id: 'rng_duelist', set: 'town', name: 'Кольцо дуэлянта', slot: 'ring', type: 'ring',
    rarity: 'epic', price: 910,
    stats: { crit: 0.08, speed: 1 },
    description: 'Для тех, кто бьёт первым и метко.',
  },
  {
    id: 'pot_stone', name: 'Зелье каменной кожи', slot: 'consumable', type: 'potion',
    rarity: 'rare', price: 90, stackable: true,
    effect: { kind: 'shield', amount: 25, atStart: true },
    description: 'В начале боя даёт щит, поглощающий 25 урона.',
  },
);

// --- Мир 3: волшебный ярус Книжного чердака ---
ITEMS.push(
  {
    id: 'wpn_candle_staff', set: 'attic', name: 'Посох свечного мага', slot: 'weapon', hand: 'two', type: 'staff',
    rarity: 'epic', price: 1890,
    stats: { attack: 34, speed: -2 },
    traits: ['pierce', 'ranged', 'magic'],
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
    rarity: 'epic', price: 1330,
    stats: { armor: 18, dodge: 0.1, resist: { poison: 0.3 } },
    description: 'Кляксы скользят, не оставляя следов.',
  },
  {
    id: 'hlm_page_wanderer', set: 'attic', name: 'Колпак странника страниц', slot: 'helmet', type: 'helmet',
    rarity: 'rare', price: 910,
    stats: { hp: 18, resist: { sleep: 0.35 }, itemFind: 0.08 },
    description: 'Под таким колпаком снятся только хорошие истории.',
  },
  {
    id: 'glv_binder', set: 'attic', name: 'Перчатки переплётчика', slot: 'gloves', type: 'gloves',
    rarity: 'rare', price: 600,
    stats: { attack: 5, armor: 4 },
    description: 'Крепкие швы — крепкая хватка.',
  },
  {
    id: 'bt_quiet_step', set: 'attic', name: 'Сапоги тихого шага', slot: 'boots', type: 'boots',
    rarity: 'epic', price: 1050,
    stats: { speed: 4, dodge: 0.08 },
    description: 'Шаг мягче переворачиваемой страницы.',
  },
  {
    id: 'amu_pages', set: 'attic', name: 'Амулет страниц', slot: 'amulet', type: 'amulet',
    rarity: 'epic', price: 1190,
    stats: { hp: 15, resist: { sleep: 0.2, poison: 0.2 } },
    traits: ['heal_after_battle'],
    description: 'Пахнет старой бумагой. После боя рыцарь отдыхает быстрее.',
  },
  {
    id: 'rng_ink', set: 'attic', name: 'Кольцо чернил', slot: 'ring', type: 'ring',
    rarity: 'rare', price: 450,
    stats: { attack: 4, resist: { poison: 0.15 } },
    description: 'Внутри плавает тёмная капля.',
  },
  {
    id: 'rng_contents', set: 'attic', name: 'Кольцо оглавления', slot: 'ring', type: 'ring',
    rarity: 'epic', price: 980,
    stats: { speed: 2, goldFind: 0.1, itemFind: 0.1 },
    description: 'Всегда знает, на какой странице клад.',
  },
  {
    id: 'pot_ink', name: 'Чернильный отвар', slot: 'consumable', type: 'potion',
    rarity: 'rare', price: 110, stackable: true,
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

// --- Мир «Сказочные топи»: сет «Топь» (5 в лавке, 4 в крафте) ---
ITEMS.push(
  {
    id: 'wpn_swamp_sickle', set: 'swamp', name: 'Серп трясичной ведьмы', slot: 'weapon', hand: 'one', type: 'dagger',
    rarity: 'epic', price: 420,
    stats: { attack: 26, crit: 0.08, speed: 2 },
    traits: ['lifesteal_small'],
    description: 'Кривой, как месяц над топью. Пьёт чужую боль.',
  },
  {
    id: 'shd_swamp_lily', set: 'swamp', name: 'Щит-кувшинка', slot: 'shield', hand: 'one', type: 'shield',
    rarity: 'rare', price: 0,
    stats: { armor: 16, hp: 12, dodge: 0.05, resist: { poison: 0.2 } },
    description: 'Плотная, как лист великана-кувшинки. Вода скатывается сама.',
  },
  {
    id: 'hlm_swamp_wreath', set: 'swamp', name: 'Венок болотных огоньков', slot: 'helmet', type: 'helmet',
    rarity: 'rare', price: 0,
    stats: { hp: 20, resist: { sleep: 0.3, poison: 0.2 } },
    description: 'Огоньки кружат над головой и жужжат колыбельную наоборот.',
  },
  {
    id: 'arm_swamp_weave', set: 'swamp', name: 'Плащ сплетённого тумана', slot: 'armor', type: 'armor',
    rarity: 'epic', price: 460,
    stats: { armor: 26, hp: 14, resist: { poison: 0.25 } },
    description: 'Хозяйка Топей ткёт его по ночам, путая нити с тропами.',
  },
  {
    id: 'glv_swamp_fern', set: 'swamp', name: 'Перчатки папоротника', slot: 'gloves', type: 'gloves',
    rarity: 'rare', price: 300,
    stats: { attack: 5, resist: { poison: 0.2 } },
    description: 'Пахнут тиной и чужими секретами.',
  },
  {
    id: 'bt_swamp_moss', set: 'swamp', name: 'Мшистые ступни', slot: 'boots', type: 'boots',
    rarity: 'rare', price: 320,
    stats: { speed: 3, dodge: 0.06, hp: 8 },
    description: 'Шаг в них мягок, как подход к чужому костру.',
  },
  {
    id: 'amu_swamp_frog', set: 'swamp', name: 'Жабий оберег', slot: 'amulet', type: 'amulet',
    rarity: 'rare', price: 0,
    stats: { hp: 16, resist: { poison: 0.3 } },
    description: 'Тихо квакает, когда рядом яд.',
  },
  {
    id: 'rng_swamp_thread', set: 'swamp', name: 'Кольцо ведьминой нити', slot: 'ring', type: 'ring',
    rarity: 'epic', price: 0,
    stats: { attack: 4, speed: 1, resist: { sleep: 0.15 } },
    description: 'Нить сама находит слабые места.',
  },
  {
    id: 'rng_swamp_glow', set: 'swamp', name: 'Кольцо светоягоды', slot: 'ring', type: 'ring',
    rarity: 'epic', price: 360,
    stats: { hp: 10, crit: 0.04 },
    description: 'Светится тем ярче, чем темнее место.',
  },
);

// --- Мир «Звёздная ярмарка»: сет «Ярмарка» (экономика: монеты и находки) ---
ITEMS.push(
  {
    id: 'wpn_fair_hammer', set: 'fair', name: 'Молоток сильномера', slot: 'weapon', hand: 'one', type: 'mace',
    rarity: 'epic', price: 450,
    stats: { attack: 30, speed: -1 },
    description: 'Стоило звонка — получи приз.',
  },
  {
    id: 'shd_fair_target', set: 'fair', name: 'Щит-мишень тира', slot: 'shield', hand: 'one', type: 'shield',
    rarity: 'rare', price: 340,
    stats: { armor: 18, block: 0.2, hp: 10 },
    description: 'Попади в десятку — засчитано.',
  },
  {
    id: 'hlm_fair_jester', set: 'fair', name: 'Колпак звёздного шута', slot: 'helmet', type: 'helmet',
    rarity: 'rare', price: 0,
    stats: { hp: 16, dodge: 0.06, itemFind: 0.05 },
    description: 'Бубенчики звенят ровно тогда, когда ты увернулся.',
  },
  {
    id: 'arm_fair_vest', set: 'fair', name: 'Камзол барахольщика', slot: 'armor', type: 'armor',
    rarity: 'epic', price: 440,
    stats: { armor: 24, hp: 12, goldFind: 0.1 },
    description: 'В каждом кармане по монетке. И ещё одна — в подкладке.',
  },
  {
    id: 'glv_fair_magician', set: 'fair', name: 'Перчатки фокусника', slot: 'gloves', type: 'gloves',
    rarity: 'rare', price: 0,
    stats: { attack: 4, itemFind: 0.08, crit: 0.03 },
    description: 'Теперь ты видишь, откуда монета.',
  },
  {
    id: 'bt_fair_dancer', set: 'fair', name: 'Сапоги канатоходца', slot: 'boots', type: 'boots',
    rarity: 'epic', price: 0,
    stats: { speed: 4, dodge: 0.07 },
    description: 'Натянутая проволока? Удобно.',
  },
  {
    id: 'amu_fair_ticket', set: 'fair', name: 'Медальон вечного билета', slot: 'amulet', type: 'amulet',
    rarity: 'epic', price: 400,
    stats: { hp: 12, goldFind: 0.12 },
    description: 'Действителен во всех мирах. Пропуск один — удача везде.',
  },
  {
    id: 'rng_fair_coin', set: 'fair', name: 'Кольцо счастливой монеты', slot: 'ring', type: 'ring',
    rarity: 'rare', price: 330,
    stats: { goldFind: 0.1, itemFind: 0.05 },
    description: 'Орёл или решка — ты всё равно выиграл.',
  },
  {
    id: 'rng_fair_star', set: 'fair', name: 'Кольцо звезды чемпиона', slot: 'ring', type: 'ring',
    rarity: 'epic', price: 0,
    stats: { attack: 3, crit: 0.05, goldFind: 0.05 },
    description: 'Выдано лично Чемпионом миров.',
  },
);

// --- Мир «Пепельные степи»: сет «Пепел» (жар горна: атака и крит) ---
ITEMS.push(
  {
    id: 'wpn_ember_scimitar', set: 'ember', name: 'Пепельная сабля', slot: 'weapon', hand: 'one', type: 'sword',
    rarity: 'epic', price: 480,
    stats: { attack: 32, crit: 0.06 },
    description: 'Лезвие помнит жар горна и просит ещё.',
  },
  {
    id: 'shd_ember_brazier', set: 'ember', name: 'Щит-жаровня', slot: 'shield', hand: 'one', type: 'shield',
    rarity: 'epic', price: 0,
    stats: { armor: 20, block: 0.18 },
    traits: ['thorns_small'],
    description: 'Кто ударит — обожжётся.',
  },
  {
    id: 'hlm_ember_khan', set: 'ember', name: 'Полумаска хана бурь', slot: 'helmet', type: 'helmet',
    rarity: 'epic', price: 0,
    stats: { hp: 22, attack: 4 },
    description: 'Шкура степного зверя. В ней слышен ветер.',
  },
  {
    id: 'arm_ember_scalemail', set: 'ember', name: 'Чешуйная кольчуга степей', slot: 'armor', type: 'armor',
    rarity: 'epic', price: 500,
    stats: { armor: 28, hp: 16, resist: { fire: 0.2 } },
    description: 'Чешуя пепельных ящеров. Не горит.',
  },
  {
    id: 'glv_ember_forge', set: 'ember', name: 'Рукавицы горна', slot: 'gloves', type: 'gloves',
    rarity: 'rare', price: 360,
    stats: { attack: 7, resist: { fire: 0.25 } },
    description: 'Можно брать угли голыми руками. Почти.',
  },
  {
    id: 'bt_ember_storm', set: 'ember', name: 'Сапоги пепельной бури', slot: 'boots', type: 'boots',
    rarity: 'epic', price: 0,
    stats: { speed: 3, attack: 3, dodge: 0.04 },
    description: 'След после них тлеет ещё час.',
  },
  {
    id: 'amu_ember_heart', set: 'ember', name: 'Амулет сердца бури', slot: 'amulet', type: 'amulet',
    rarity: 'epic', price: 0,
    stats: { hp: 18, attack: 5, crit: 0.04 },
    description: 'Бьётся в такт шагам.',
  },
  {
    id: 'rng_ember_coal', set: 'ember', name: 'Кольцо горячего угля', slot: 'ring', type: 'ring',
    rarity: 'rare', price: 350,
    stats: { attack: 5, resist: { fire: 0.15 } },
    description: 'Тёплое. Иногда честно жжётся.',
  },
  {
    id: 'rng_ember_spark', set: 'ember', name: 'Кольцо первой искры', slot: 'ring', type: 'ring',
    rarity: 'epic', price: 380,
    stats: { crit: 0.06, speed: 2 },
    description: 'С неё начался пожар. Хороший пожар.',
  },
);

// --- Филлеры миров nm, cr, jade, deep, mist: по три вещи в лавку ---
ITEMS.push(
  // Ночной рынок
  {
    id: 'wpn_nm_fang', name: 'Кинжал зубного лавочника', slot: 'weapon', hand: 'one', type: 'dagger',
    rarity: 'rare', price: 320,
    stats: { attack: 24, crit: 0.1 },
    description: 'Вынут без боли. Почти.',
  },
  {
    id: 'hlm_nm_lantern', name: 'Фонарный колпак', slot: 'helmet', type: 'helmet',
    rarity: 'rare', price: 300,
    stats: { hp: 18, itemFind: 0.08 },
    description: 'Светит в обе стороны рынка.',
  },
  {
    id: 'amu_nm_mask', name: 'Маска ночного гостя', slot: 'amulet', type: 'amulet',
    rarity: 'epic', price: 380,
    stats: { hp: 14, dodge: 0.05 },
    description: 'В ней свои не узнают. И чужие тоже.',
  },
  // Хрустальные горы
  {
    id: 'wpn_cr_pick', name: 'Кирка кварцекопа', slot: 'weapon', hand: 'one', type: 'mace',
    rarity: 'epic', price: 400,
    stats: { attack: 27, armor: 4 },
    description: 'Режет камень и настроение врагов.',
  },
  {
    id: 'arm_cr_crystal', name: 'Хрустальный нагрудник', slot: 'armor', type: 'armor',
    rarity: 'epic', price: 450,
    stats: { armor: 30, speed: -2 },
    description: 'Тяжёлый, прозрачный, непробиваемый.',
  },
  {
    id: 'rng_cr_echo', name: 'Кольцо эха гор', slot: 'ring', type: 'ring',
    rarity: 'rare', price: 300,
    stats: { attack: 3, hp: 8 },
    description: 'Отвечает вторым ударом.',
  },
  // Нефритовый сад
  {
    id: 'wpn_jade_fan', name: 'Боевой веер сада', slot: 'weapon', hand: 'one', type: 'dagger',
    rarity: 'epic', price: 420,
    stats: { attack: 25, speed: 4, crit: 0.08 },
    description: 'Раскрывается один раз. Хватает.',
  },
  {
    id: 'bt_jade_silk', name: 'Сапоги чайной церемонии', slot: 'boots', type: 'boots',
    rarity: 'rare', price: 320,
    stats: { speed: 4, dodge: 0.06 },
    description: 'Не шуршат даже по гравию.',
  },
  {
    id: 'amu_jade_pearl', name: 'Жемчужина хранителя', slot: 'amulet', type: 'amulet',
    rarity: 'epic', price: 420,
    stats: { hp: 20, resist: { fear: 0.3 } },
    description: 'Дракон-хранитель роняет такие в пруд раз в сто лет.',
  },
  // Подводный грот
  {
    id: 'wpn_deep_coral', name: 'Коралловый клинок', slot: 'weapon', hand: 'one', type: 'sword',
    rarity: 'rare', price: 360,
    stats: { attack: 26, hp: 10 },
    description: 'Растёт медленно, режет быстро.',
  },
  {
    id: 'shd_deep_shell', name: 'Щит-раковина', slot: 'shield', hand: 'one', type: 'shield',
    rarity: 'rare', price: 380,
    stats: { armor: 19, block: 0.22, resist: { slow: 0.2 } },
    description: 'Внутри слышно море и сдачу врага.',
  },
  {
    id: 'rng_deep_pearl', name: 'Кольцо глубинной жемчужины', slot: 'ring', type: 'ring',
    rarity: 'rare', price: 340,
    stats: { hp: 12, dodge: 0.04 },
    description: 'Светится, когда глубоко.',
  },
  // Туманные часы
  {
    id: 'wpn_mist_pendulum', name: 'Маятниковый клинок', slot: 'weapon', hand: 'one', type: 'sword',
    rarity: 'epic', price: 460,
    stats: { attack: 29, speed: 2 },
    description: 'Качается ровно в такт чужому страху.',
  },
  {
    id: 'glv_mist_gear', name: 'Перчатки часовщика', slot: 'gloves', type: 'gloves',
    rarity: 'rare', price: 340,
    stats: { attack: 5, crit: 0.05 },
    description: 'Пальцы двигаются точно по расписанию.',
  },
  {
    id: 'amu_mist_sand', name: 'Амулет песка времени', slot: 'amulet', type: 'amulet',
    rarity: 'epic', price: 400,
    stats: { hp: 16, resist: { slow: 0.3 } },
    description: 'Песок внутри сыплется вверх. Тебе — вперёд.',
  },
);

// --- Легендарки боссов: только за печати мастера ---
ITEMS.push(
  {
    id: 'hlm_hag_crown', name: 'Корона Хозяйки Топей', slot: 'helmet', type: 'helmet',
    rarity: 'legendary', price: 0, sealPrice: 4,
    stats: { hp: 30, resist: { poison: 0.4, sleep: 0.4 } },
    traits: ['lifesteal_small'],
    description: 'Тяжела. Внутри — вся Топь.',
  },
  {
    id: 'wpn_champion_greatsword', name: 'Звезда чемпиона миров', slot: 'weapon', hand: 'two', type: 'greatsword',
    rarity: 'legendary', price: 0, sealPrice: 6,
    stats: { attack: 44, crit: 0.1 },
    traits: ['cleave_small'],
    description: 'Её вручают только тем, кто уже победил.',
  },
  {
    id: 'amu_quartz_heart', name: 'Сердце кварцевого дракона', slot: 'amulet', type: 'amulet',
    rarity: 'legendary', price: 0, sealPrice: 5,
    stats: { hp: 26, armor: 8, resist: { fear: 0.5 } },
    traits: ['heal_after_battle'],
    description: 'Стучит раз в минуту. Этого хватает.',
  },
  {
    id: 'rng_time_loop', name: 'Кольцо петли времени', slot: 'ring', type: 'ring',
    rarity: 'legendary', price: 0, sealPrice: 5,
    stats: { speed: 5, dodge: 0.08, crit: 0.05 },
    description: 'Второй шанс. Иногда третий.',
  },
);

// --- Расходники поздних миров: зелья Алхимику, свитки Магу ---
ITEMS.push(
  {
    id: 'pot_jade_tea', name: 'Чай нефритового дракона', slot: 'consumable', type: 'potion',
    rarity: 'rare', price: 90, stackable: true,
    effect: { kind: 'heal', amount: 60, atHpBelow: 0.5 },
    description: 'Горячий даже через год в поясном кармане.',
  },
  {
    id: 'pot_deep_air', name: 'Пузырёк грота', slot: 'consumable', type: 'potion',
    rarity: 'rare', price: 100, stackable: true,
    effect: { kind: 'shield', amount: 40, atStart: true },
    description: 'Глоток воздуха с поверхности. В бою — как броня.',
  },
  {
    id: 'scr_crystal_rain', name: 'Свиток кристального дождя', slot: 'consumable', type: 'scroll',
    rarity: 'epic', price: 200, stackable: true,
    effect: { kind: 'scroll_storm', dmg: 30 },
    description: 'Осколки летят в двух самых хрупких врагов.',
  },
  {
    id: 'scr_mist_slow', name: 'Свиток густого тумана', slot: 'consumable', type: 'scroll',
    rarity: 'epic', price: 220, stackable: true,
    effect: { kind: 'scroll_frost', ticks: 50, factor: 0.5 },
    description: 'Враги двигаются, как во сне про понедельник.',
  },
);

// --- Личные находки двенадцати боссов: внесетовые сайдгрейды, не товары и не рецепты ---
ITEMS.push(
  {
    id: 'shd_willow_vow', name: 'Щит ивовой клятвы', slot: 'shield', hand: 'one', type: 'shield',
    rarity: 'rare', price: 0,
    stats: { armor: 10, hp: 6, block: 0.12 },
    traits: ['first_hit_reduction'],
    description: 'Гибкие ветви гасят первый натиск, но не заменяют крепкий башенный щит.',
  },
  {
    id: 'glv_captain_oath', name: 'Перчатки капитанской клятвы', slot: 'gloves', type: 'gloves',
    rarity: 'rare', price: 0,
    stats: { attack: 4, armor: 3 },
    traits: ['thorns_small'],
    description: 'Потёртые наручи отвечают обидчику лёгким ответным ударом.',
  },
  {
    id: 'rng_keeper_bookmark', name: 'Кольцо живой закладки', slot: 'ring', type: 'ring',
    rarity: 'rare', price: 0,
    stats: { hp: 4, speed: 2, itemFind: 0.04 },
    description: 'Шелестит на нужной странице и бережёт маленькие находки.',
  },
  {
    id: 'amu_star_compass', name: 'Амулет звёздного компаса', slot: 'amulet', type: 'amulet',
    rarity: 'rare', price: 0,
    stats: { hp: 12, crit: 0.02, resist: { fire: 0.15 } },
    description: 'Стрелка указывает не на север, а на безопасную дорогу домой.',
  },
  {
    id: 'wpn_nm_afterhours', name: 'Кинжал после полуночи', slot: 'weapon', hand: 'one', type: 'dagger',
    rarity: 'rare', price: 0,
    stats: { attack: 17, speed: 2, crit: 0.04 },
    description: 'Лёгкий клинок для тихих переулков; уступает рыночным тяжеловесам в уроне.',
  },
  {
    id: 'bt_sw_reed', name: 'Сапоги камышовой тропы', slot: 'boots', type: 'boots',
    rarity: 'rare', price: 0,
    stats: { speed: 2, dodge: 0.05, resist: { poison: 0.1 } },
    description: 'Сухие только сверху, зато знают каждую кочку и не боятся болотной мошки.',
  },
  {
    id: 'rng_sf_encore', name: 'Кольцо ярмарочного биса', slot: 'ring', type: 'ring',
    rarity: 'rare', price: 0,
    stats: { crit: 0.04, dodge: 0.03, itemFind: 0.03 },
    description: 'Звенит после удачного выступления и подмигивает следующей находке.',
  },
  {
    id: 'hlm_cr_geode', name: 'Шлем жеодового эха', slot: 'helmet', type: 'helmet',
    rarity: 'rare', price: 0,
    stats: { hp: 16, armor: 5, resist: { slow: 0.15 } },
    description: 'Пустой кварцевый купол звенит в такт шагам и отгоняет сонную медлительность.',
  },
  {
    id: 'arm_ash_wayfarer', name: 'Броня пепельного путника', slot: 'armor', type: 'armor',
    rarity: 'rare', price: 0,
    stats: { armor: 18, hp: 12, resist: { fire: 0.15 } },
    description: 'Лёгкая дорожная чешуя для жаркого ветра, а не парадная броня хана.',
  },
  {
    id: 'wpn_jade_branch', name: 'Меч нефритовой ветви', slot: 'weapon', hand: 'one', type: 'sword',
    rarity: 'rare', price: 0,
    stats: { attack: 22, hp: 5, speed: 2 },
    description: 'Ровный клинок с живой рукоятью; спокойнее и медленнее боевого веера.',
  },
  {
    id: 'shd_deep_tideglass', name: 'Щит приливного стекла', slot: 'shield', hand: 'one', type: 'shield',
    rarity: 'rare', price: 0,
    stats: { armor: 14, hp: 8, block: 0.16, resist: { slow: 0.1 } },
    description: 'Внутри плещется маленькая волна; легче раковины, но и мягче удар.',
  },
  {
    id: 'glv_mist_minute', name: 'Перчатки тихой минуты', slot: 'gloves', type: 'gloves',
    rarity: 'rare', price: 0,
    stats: { attack: 4, speed: 1, resist: { slow: 0.15 } },
    description: 'Секундная стрелка на манжете помогает не терять темп в густом тумане.',
  },
);

export const ITEM_BY_ID = Object.fromEntries(ITEMS.map((i) => [i.id, i]));

export const RARITY_LABEL = {
  common: 'Обычный', rare: 'Редкий', epic: 'Волшебный', legendary: 'Легендарный',
};
