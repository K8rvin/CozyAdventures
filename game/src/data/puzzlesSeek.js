// Уровни «Поиск предметов»: найди ВСЕ экземпляры каждого вида.
// Предметы уже нарисованы в сцене (AI-арт). Координаты — логические 1000×650.

const R = 42; // базовый радиус попадания (тач-дружелюбный)

export const SEEK_PUZZLES = [
  // --- Мир 1: Тихая опушка ---
  {
    id: 'sk_md_01', world: 'meadow', mechanic: 'seek', name: 'Утренняя поляна', difficulty: 1,
    sceneSize: [1000, 650],
    groups: [
      {
        id: 'amanita', label: 'Красные мухоморы',
        spots: [
          { x: 195, y: 174, r: 56 }, { x: 73, y: 423, r: 48 },
          { x: 175, y: 598, r: 48 }, { x: 706, y: 549, r: 48 },
          { x: 355, y: 44, r: 34 },
        ],
      },
      {
        id: 'horseshoe', label: 'Подковы',
        spots: [{ x: 651, y: 216, r: 54 }, { x: 377, y: 488, r: 34 }],
      },
      {
        id: 'feather', label: 'Перья',
        spots: [
          { x: 584, y: 363, r: 54 }, { x: 425, y: 524, r: 42 }, { x: 720, y: 183, r: 42 },
        ],
      },
    ],
    rewards: [{ type: 'coins', amount: 80 }],
    intro: 'Поляна полна находок. Собери все предметы из списка — каждого вида до последнего!',
  },
  {
    id: 'sk_md_02', world: 'meadow', mechanic: 'seek', name: 'Сундук под корнями', difficulty: 2,
    sceneSize: [1000, 650],
    groups: [
      {
        id: 'snail', label: 'Раковины улиток',
        spots: [
          { x: 572, y: 152, r: 26 }, { x: 215, y: 339, r: 26 }, { x: 470, y: 563, r: 30 },
        ],
      },
      {
        id: 'cone', label: 'Шишки',
        spots: [
          { x: 406, y: 39, r: 20 }, { x: 335, y: 215, r: 22 },
          { x: 617, y: 583, r: 32 }, { x: 871, y: 278, r: 26 },
          { x: 141, y: 544, r: 26 }, { x: 508, y: 618, r: 38 },
          { x: 753, y: 68, r: 22 },
        ],
      },
      {
        id: 'watch', label: 'Карманные часы',
        spots: [{ x: 531, y: 249, r: 26 }],
      },
      {
        id: 'bottle', label: 'Стеклянная бутылка',
        spots: [{ x: 935, y: 416, r: 34 }],
      },
    ],
    rewards: [{ type: 'coins', amount: 95 }],
    intro: 'Под корнями старой ивы — целый тайник. Теперь уже посложнее.',
  },
  // --- Мир 2: Средневековый дворик ---
  {
    id: 'sk_tw_01', world: 'town', mechanic: 'seek', name: 'Рыночная сутолока', difficulty: 3,
    sceneSize: [1000, 650],
    groups: [
      {
        id: 'pigeon', label: 'Голуби',
        spots: [
          { x: 510, y: 22, r: 12 }, { x: 822, y: 42, r: 14 }, { x: 774, y: 154, r: 14 },
          { x: 245, y: 488, r: 18 }, { x: 107, y: 519, r: 18 }, { x: 149, y: 547, r: 22 },
          { x: 393, y: 228, r: 12 }, { x: 882, y: 210, r: 18 },
        ],
      },
      {
        id: 'horseshoe2', label: 'Подковы',
        spots: [
          { x: 621, y: 367, r: 14 }, { x: 663, y: 372, r: 14 },
          { x: 746, y: 420, r: 12 }, { x: 636, y: 609, r: 14 },
        ],
      },
      {
        id: 'garlic', label: 'Связки чеснока',
        spots: [
          { x: 388, y: 63, r: 14 }, { x: 408, y: 54, r: 14 }, { x: 525, y: 140, r: 22 },
          { x: 720, y: 228, r: 22 }, { x: 921, y: 268, r: 26 },
        ],
      },
    ],
    rewards: [{ type: 'coins', amount: 120 }],
    intro: 'Голубей тут восемь, подков четыре, а чеснока — пять связок. Всех найдёшь?',
  },
  {
    id: 'sk_tw_02', world: 'town', mechanic: 'seek', name: 'Склад кузнеца', difficulty: 3,
    sceneSize: [1000, 650],
    groups: [
      {
        id: 'dog', label: 'Спящие собаки',
        spots: [{ x: 182, y: 188, r: 42 }, { x: 153, y: 510, r: 54 }],
      },
      {
        id: 'bread', label: 'Буханки хлеба',
        spots: [
          { x: 645, y: 218, r: 22 }, { x: 588, y: 256, r: 30 },
          { x: 635, y: 280, r: 30 }, { x: 722, y: 597, r: 42 },
        ],
      },
      {
        id: 'cheese', label: 'Головки сыра',
        spots: [{ x: 589, y: 182, r: 36 }],
      },
      {
        id: 'rope', label: 'Мотки верёвки',
        spots: [{ x: 785, y: 456, r: 30 }, { x: 310, y: 620, r: 34 }, { x: 552, y: 133, r: 26 }],
      },
    ],
    rewards: [{ type: 'coins', amount: 130 }],
    intro: 'Кузнец снова всё раскидал. Собак не буди — просто отметь.',
  },
  // --- Мир 3: Книжный чердак ---
  {
    id: 'sk_bk_01', world: 'attic', mechanic: 'seek', name: 'Пыльная библиотека', difficulty: 4,
    sceneSize: [1000, 650],
    groups: [
      {
        id: 'keys', label: 'Старинные ключи',
        spots: [
          { x: 724, y: 465, r: 22 }, { x: 689, y: 478, r: 26 },
          { x: 709, y: 589, r: 18 }, { x: 332, y: 323, r: 18 },
        ],
      },
      {
        id: 'candle', label: 'Свечи',
        spots: [
          { x: 227, y: 397, r: 22 }, { x: 661, y: 163, r: 18 }, { x: 191, y: 396, r: 22 },
          { x: 152, y: 425, r: 22 }, { x: 115, y: 452, r: 16 }, { x: 91, y: 468, r: 18 },
        ],
      },
      {
        id: 'openbook', label: 'Раскрытые книги',
        spots: [
          { x: 335, y: 485, r: 86 }, { x: 561, y: 518, r: 62 }, { x: 139, y: 159, r: 26 },
        ],
      },
      {
        id: 'chest', label: 'Чемоданчики',
        spots: [{ x: 373, y: 289, r: 42 }, { x: 427, y: 235, r: 42 }],
      },
    ],
    rewards: [{ type: 'coins', amount: 150 }],
    intro: 'На чердаке каждая вещь помнит историю. Найди все ключи, свечи и книги.',
  },
  {
    id: 'sk_bk_02', world: 'attic', mechanic: 'seek', name: 'Сундук бабушкиных писем', difficulty: 5,
    bg: 'seek_attic2',
    sceneSize: [1000, 650],
    groups: [
      {
        id: 'letter', label: 'Письма с печатью',
        spots: [
          { x: 338, y: 418, r: 30 }, { x: 389, y: 479, r: 30 }, { x: 671, y: 436, r: 34 },
        ],
      },
      {
        id: 'specs', label: 'Очки',
        spots: [
          { x: 556, y: 429, r: 30 }, { x: 521, y: 253, r: 26 },
          { x: 400, y: 578, r: 30 }, { x: 757, y: 323, r: 22 },
        ],
      },
      {
        id: 'keys2', label: 'Ключи',
        spots: [{ x: 444, y: 425, r: 30 }],
      },
      {
        id: 'cup', label: 'Чайные чашки',
        spots: [
          { x: 244, y: 489, r: 26 }, { x: 805, y: 445, r: 26 }, { x: 693, y: 332, r: 26 },
        ],
      },
    ],
    rewards: [{ type: 'coins', amount: 200 }, { type: 'seals', amount: 1 }],
    intro: 'Финал искалок: письма, очки, ключи и чашки — все до единого.',
  },
];

export const SEEK_PUZZLE_BY_ID = Object.fromEntries(SEEK_PUZZLES.map((p) => [p.id, p]));

// --- Искалки новых миров (фоны сгенерированы игроком по промптам) ---
SEEK_PUZZLES.push(
  {
    id: 'sk_nm_01', world: 'nm', mechanic: 'seek', name: 'Ночной рынок', difficulty: 4,
    bg: 'seek_market',
    sceneSize: [1000, 650],
    groups: [
      {
        id: 'mask', label: 'Маски духов',
        spots: [
          { x: 463, y: 291, r: 22 }, { x: 499, y: 276, r: 22 }, { x: 535, y: 248, r: 22 },
          { x: 594, y: 268, r: 22 }, { x: 649, y: 274, r: 22 }, { x: 695, y: 277, r: 22 },
          { x: 738, y: 281, r: 26 }, { x: 495, y: 346, r: 22 }, { x: 527, y: 322, r: 18 },
        ],
      },
      {
        id: 'wisp', label: 'Духи-огоньки',
        spots: [
          { x: 333, y: 102, r: 42 }, { x: 428, y: 87, r: 22 },
          { x: 595, y: 156, r: 34 }, { x: 940, y: 328, r: 26 },
        ],
      },
      {
        id: 'origami', label: 'Бумажные журавлики',
        spots: [
          { x: 621, y: 350, r: 22 }, { x: 668, y: 363, r: 18 }, { x: 879, y: 320, r: 30 },
        ],
      },
      {
        id: 'glowjar', label: 'Светящиеся банки',
        spots: [
          { x: 47, y: 473, r: 30 }, { x: 410, y: 376, r: 26 },
          { x: 741, y: 156, r: 18 }, { x: 449, y: 360, r: 26 },
        ],
      },
    ],
    rewards: [{ type: 'coins', amount: 220 }],
    intro: 'Фонарики, маски, духи торговли. Ночной рынок полон мелких чудес.',
  },
  {
    id: 'sk_sw_01', world: 'sw', mechanic: 'seek', name: 'Сказочные топи', difficulty: 4,
    bg: 'seek_swamp',
    sceneSize: [1000, 650],
    groups: [
      {
        id: 'frog', label: 'Лягушки',
        spots: [
          { x: 394, y: 160, r: 16 }, { x: 504, y: 225, r: 26 }, { x: 242, y: 378, r: 22 },
          { x: 607, y: 580, r: 22 }, { x: 702, y: 608, r: 22 },
        ],
      },
      {
        id: 'glowshroom', label: 'Светящиеся грибы',
        spots: [
          { x: 557, y: 154, r: 30 }, { x: 973, y: 148, r: 26 },
          { x: 144, y: 493, r: 38 }, { x: 51, y: 343, r: 42 },
        ],
      },
      {
        id: 'lantern', label: 'Фонарики',
        spots: [{ x: 572, y: 346, r: 30 }, { x: 753, y: 523, r: 38 }],
      },
      {
        id: 'dragonfly', label: 'Стрекозы',
        spots: [{ x: 900, y: 250, r: 34 }, { x: 940, y: 491, r: 34 }],
      },
      {
        id: 'boot', label: 'Болотные сапоги',
        spots: [
          { x: 384, y: 366, r: 30 }, { x: 455, y: 318, r: 34 }, { x: 259, y: 514, r: 34 },
        ],
      },
    ],
    rewards: [{ type: 'coins', amount: 240 }],
    intro: 'Туман, избушка, лягушки-хранители. Считай лягушек внимательно — их пять!',
  },
  {
    id: 'sk_sf_01', world: 'sf', mechanic: 'seek', name: 'Звёздная ярмарка', difficulty: 5,
    bg: 'seek_fair',
    sceneSize: [1000, 650],
    groups: [
      {
        id: 'armillary', label: 'Астролябии',
        spots: [
          { x: 130, y: 317, r: 62 }, { x: 554, y: 126, r: 42 },
          { x: 270, y: 241, r: 42 }, { x: 948, y: 447, r: 50 },
        ],
      },
      {
        id: 'candleorb', label: 'Свечи в шарах',
        spots: [
          { x: 76, y: 223, r: 42 }, { x: 42, y: 321, r: 42 }, { x: 421, y: 97, r: 62 },
          { x: 828, y: 190, r: 26 }, { x: 963, y: 281, r: 38 },
        ],
      },
      {
        id: 'starcookie', label: 'Печенья-звёзды',
        spots: [{ x: 549, y: 387, r: 42 }],
      },
      {
        id: 'crystal', label: 'Кристальные букеты',
        spots: [
          { x: 651, y: 295, r: 34 }, { x: 614, y: 345, r: 30 }, { x: 692, y: 588, r: 62 },
        ],
      },
      {
        id: 'moonpillow', label: 'Лунные подушки',
        spots: [{ x: 431, y: 477, r: 42 }, { x: 488, y: 524, r: 42 }],
      },
    ],
    rewards: [{ type: 'coins', amount: 260 }, { type: 'seals', amount: 1 }],
    intro: 'Ярмарка чудес под звёздами. Астролябий здесь четыре — все твои.',
  },
  {
    id: 'sk_ash_01', world: 'ash', mechanic: 'seek', name: 'Кузница изнутри', difficulty: 5,
    bg: 'seek_forge',
    sceneSize: [1000, 650],
    groups: [
      {
        id: 'horseshoe3', label: 'Подковы',
        spots: [
          { x: 223, y: 154, r: 54 }, { x: 794, y: 505, r: 22 }, { x: 762, y: 412, r: 34 },
          { x: 105, y: 594, r: 30 }, { x: 542, y: 585, r: 26 },
        ],
      },
      {
        id: 'hammer', label: 'Молотки',
        spots: [
          { x: 400, y: 316, r: 34 }, { x: 678, y: 405, r: 42 }, { x: 782, y: 583, r: 54 },
          { x: 699, y: 480, r: 42 }, { x: 861, y: 357, r: 38 }, { x: 191, y: 54, r: 42 },
        ],
      },
      {
        id: 'ingot', label: 'Слитки',
        spots: [
          { x: 319, y: 327, r: 46 }, { x: 389, y: 475, r: 46 }, { x: 568, y: 507, r: 42 },
          { x: 399, y: 588, r: 42 }, { x: 835, y: 318, r: 30 }, { x: 428, y: 265, r: 34 },
        ],
      },
      {
        id: 'gear', label: 'Шестерёнки',
        spots: [
          { x: 215, y: 494, r: 26 }, { x: 901, y: 375, r: 26 }, { x: 118, y: 310, r: 26 },
        ],
      },
      {
        id: 'blade', label: 'Клинки-заготовки',
        spots: [
          { x: 145, y: 272, r: 42 }, { x: 153, y: 398, r: 74 }, { x: 779, y: 237, r: 42 },
        ],
      },
    ],
    rewards: [{ type: 'coins', amount: 280 }, { type: 'seals', amount: 1 }],
    intro: 'Наковальни, угли, тысяча мелочей. Шесть подков ждут нового хозяина.',
  },
);

// --- Искалки миров cr, jade, deep, mist (сцены от игрока) ---
SEEK_PUZZLES.push(
  {
    id: 'sk_cr_01', world: 'cr', mechanic: 'seek', name: 'Хрустальные горы', difficulty: 5,
    bg: 'seek_crystal',
    sceneSize: [1000, 650],
    groups: [
      {
        id: 'cave', label: 'Тёплые пещеры',
        spots: [
          { x: 102, y: 498, r: 64 }, { x: 649, y: 558, r: 52 },
          { x: 905, y: 526, r: 60 }, { x: 859, y: 131, r: 80 },
        ],
      },
      {
        id: 'icelantern', label: 'Ледяные фонарики',
        spots: [{ x: 204, y: 88, r: 30 }, { x: 225, y: 258, r: 34 }],
      },
      {
        id: 'rope2', label: 'Альпинистские верёвки',
        spots: [
          { x: 247, y: 108, r: 34 }, { x: 291, y: 245, r: 42 },
          { x: 768, y: 248, r: 42 }, { x: 975, y: 424, r: 42 }, { x: 205, y: 605, r: 34 },
        ],
      },
      {
        id: 'crate', label: 'Ящики экспедиции',
        spots: [{ x: 685, y: 199, r: 42 }, { x: 322, y: 480, r: 34 }],
      },
      {
        id: 'gem', label: 'Самоцветы',
        spots: [
          { x: 124, y: 187, r: 22 }, { x: 161, y: 169, r: 26 },
          { x: 77, y: 360, r: 26 }, { x: 749, y: 429, r: 26 },
          { x: 122, y: 383, r: 22 }, { x: 770, y: 196, r: 26 },
          { x: 248, y: 584, r: 26 }, { x: 179, y: 574, r: 26 },
        ],
      },
    ],
    rewards: [{ type: 'coins', amount: 280 }],
    intro: 'Сверкающие пики и тёплые пещеры. Четыре пещеры — в каждой отдыхает дух гор.',
  },
  {
    id: 'sk_jade_01', world: 'jade', mechanic: 'seek', name: 'Нефритовый сад', difficulty: 5,
    bg: 'seek_jade',
    sceneSize: [1000, 650],
    groups: [
      {
        id: 'stonelantern', label: 'Каменные фонари',
        spots: [
          { x: 263, y: 124, r: R }, { x: 456, y: 274, r: R }, { x: 41, y: 562, r: R },
        ],
      },
      {
        id: 'crane', label: 'Бумажные журавлики',
        spots: [
          { x: 47, y: 91, r: R }, { x: 147, y: 271, r: R }, { x: 644, y: 300, r: R },
          { x: 381, y: 418, r: R }, { x: 31, y: 497, r: R },
        ],
      },
      {
        id: 'statue', label: 'Нефритовые статуэтки',
        spots: [
          { x: 625, y: 101, r: R }, { x: 766, y: 108, r: R }, { x: 844, y: 157, r: R },
          { x: 206, y: 362, r: R }, { x: 575, y: 444, r: R },
        ],
      },
      {
        id: 'fan', label: 'Веера',
        spots: [
          { x: 381, y: 176, r: R }, { x: 503, y: 362, r: R },
          { x: 769, y: 597, r: R }, { x: 953, y: 398, r: R },
        ],
      },
      {
        id: 'koi', label: 'Кои в пруду',
        spots: [
          { x: 650, y: 382, r: R }, { x: 738, y: 405, r: R }, { x: 675, y: 555, r: R },
        ],
      },
    ],
    rewards: [{ type: 'coins', amount: 300 }, { type: 'seals', amount: 1 }],
    intro: 'Сад камней ждёт внимательного гостя. Пять статуэток и пять журавликов.',
  },
  {
    id: 'sk_deep_01', world: 'deep', mechanic: 'seek', name: 'Подводный грот', difficulty: 5,
    bg: 'seek_grotto',
    sceneSize: [1000, 650],
    groups: [
      {
        id: 'jelly', label: 'Медузы',
        spots: [
          { x: 206, y: 379, r: R }, { x: 756, y: 176, r: R }, { x: 819, y: 85, r: R },
        ],
      },
      {
        id: 'pearlshell', label: 'Жемчужные раковины',
        spots: [
          { x: 200, y: 196, r: R }, { x: 331, y: 402, r: R }, { x: 669, y: 274, r: R },
        ],
      },
      {
        id: 'amphora', label: 'Амфоры',
        spots: [
          { x: 109, y: 196, r: R }, { x: 288, y: 157, r: R }, { x: 494, y: 118, r: R },
          { x: 138, y: 503, r: R }, { x: 656, y: 356, r: R },
        ],
      },
      {
        id: 'crab', label: 'Крабы',
        spots: [
          { x: 550, y: 85, r: R }, { x: 556, y: 340, r: R }, { x: 694, y: 607, r: R },
        ],
      },
      {
        id: 'key', label: 'Затонувшие ключи',
        spots: [{ x: 775, y: 320, r: R }, { x: 581, y: 451, r: R }],
      },
    ],
    rewards: [{ type: 'coins', amount: 320 }, { type: 'seals', amount: 1 }],
    intro: 'Затопленный грот хранит сокровища русалок. Пять амфор — все поднять наверх.',
  },
  {
    id: 'sk_mist_01', world: 'mist', mechanic: 'seek', name: 'Туманные часы', difficulty: 5,
    bg: 'seek_clockwork',
    sceneSize: [1000, 650],
    groups: [
      {
        id: 'hourglass', label: 'Песочные часы',
        spots: [
          { x: 650, y: 157, r: R }, { x: 450, y: 327, r: R },
          { x: 438, y: 516, r: R }, { x: 531, y: 268, r: R },
        ],
      },
      {
        id: 'pocketwatch', label: 'Карманные часы',
        spots: [
          { x: 600, y: 209, r: R }, { x: 244, y: 503, r: R }, { x: 344, y: 555, r: R },
          { x: 369, y: 607, r: R }, { x: 575, y: 346, r: R },
        ],
      },
      {
        id: 'windkey', label: 'Заводные ключи',
        spots: [
          { x: 488, y: 359, r: R }, { x: 444, y: 392, r: R }, { x: 744, y: 85, r: R },
        ],
      },
      {
        id: 'brasscat', label: 'Латунный кот',
        spots: [{ x: 800, y: 398, r: R + 10 }],
      },
      {
        id: 'blueprint', label: 'Чертежи',
        spots: [
          { x: 719, y: 287, r: R }, { x: 600, y: 431, r: R }, { x: 175, y: 340, r: R },
        ],
      },
    ],
    rewards: [{ type: 'coins', amount: 350 }, { type: 'seals', amount: 2 }],
    intro: 'Край времён. Латунный кот знает, куда прячутся все карманные часы.',
  },
);
