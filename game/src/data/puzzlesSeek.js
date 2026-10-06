// Уровни «Поиск предметов» — реалистичные искалки в духе дома торговца.
// Сцена 1000×650 (логические px): цели расставлены вручную,
// декорации рассыпаны детерминированно с минимальной дистанцией.
// Фон: assets/seek_<world>.png (или .svg как фолбэк). Поиск — по названиям.

function hash(str) {
  let h = 2166136261;
  for (const c of str) h = Math.imul(h ^ c.codePointAt(0), 16777619);
  return h >>> 0;
}

function rngFor(seedStr) {
  let seed = hash(seedStr);
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SCENE_SIZE = [1000, 650];

function buildScene(level) {
  const rnd = rngFor(level.id);
  const [W, H] = SCENE_SIZE;
  // Цели — вручную, маленькие и слегка повёрнутые
  const scene = level.targets.map((t) => ({
    ...t, target: true, r: t.r ?? 34,
    scale: t.scale ?? (0.55 + rnd() * 0.2),
    rot: (rnd() - 0.5) * 0.4,
  }));
  // Декорации: рассыпать с минимальной дистанцией, не залезая на цели
  const fillerSet = level.filler.filter((f) => !level.targets.some((t) => t.icon === f));
  const minDist = 64;
  const want = level.fillerCount ?? 60;
  let guard = want * 40;
  let placed = 0;
  while (placed < want && guard-- > 0) {
    const x = 30 + rnd() * (W - 60);
    const y = 30 + rnd() * (H - 60);
    const okScene = scene.every((o) => Math.hypot(o.x - x, o.y - y) > minDist);
    if (!okScene) continue;
    scene.push({
      id: `d${placed}`, icon: fillerSet[Math.floor(rnd() * fillerSet.length)],
      x, y, r: 30, target: false,
      scale: 0.8 + rnd() * 0.5,
      rot: (rnd() - 0.5) * 0.5,
      alpha: 0.92 + rnd() * 0.08,
    });
    placed += 1;
  }
  return scene;
}

// Передний план: крупные полупрозрачные элементы по краям и поверх предметов.
function buildFront(level) {
  const rnd = rngFor(level.id + ':front');
  const [W, H] = SCENE_SIZE;
  const pool = level.frontPool || ['🌿'];
  const front = [];
  const count = level.frontCount ?? 7;
  for (let i = 0; i < count; i++) {
    // края сцены + пара случайных внутренних
    const edge = rnd();
    let x; let y;
    if (edge < 0.3) { x = rnd() * W; y = 20 + rnd() * 60; }
    else if (edge < 0.6) { x = rnd() * W; y = H - 20 - rnd() * 60; }
    else if (edge < 0.8) { x = 20 + rnd() * 50; y = rnd() * H; }
    else { x = 200 + rnd() * (W - 400); y = 150 + rnd() * (H - 300); }
    front.push({
      icon: pool[Math.floor(rnd() * pool.length)],
      x, y, scale: 1.3 + rnd() * 0.8,
      rot: (rnd() - 0.5) * 0.6,
      alpha: 0.7 + rnd() * 0.3,
    });
  }
  return front;
}

const RAW = [
  // --- Мир 1: Тихая опушка ---
  {
    id: 'sk_md_01', world: 'meadow', mechanic: 'seek', name: 'Утренняя поляна', difficulty: 1,
    targets: [
      { id: 't_key', icon: '🗝️', label: 'Старый ключ', x: 700, y: 430 },
      { id: 't_acorn', icon: '🌰', label: 'Жёлудь', x: 180, y: 520 },
      { id: 't_candle', icon: '🕯️', label: 'Свеча', x: 330, y: 210 },
    ],
    filler: ['🌼', '🍄', '🌿', '🐌', '🪨', '🍃', '🌾', '🐛', '🌱', '🪵'],
    frontPool: ['🌿', '🍃', '🌾', '🌼'],
    fillerCount: 55,
    rewards: [{ type: 'coins', amount: 70 }],
    intro: 'Кот-хранитель растерял мелочи на поляне. Найди их среди трав.',
  },
  {
    id: 'sk_md_02', world: 'meadow', mechanic: 'seek', name: 'Сундук под корнями', difficulty: 2,
    targets: [
      { id: 't_map', icon: '🗺️', label: 'Клочок карты', x: 90, y: 300 },
      { id: 't_compass', icon: '🧭', label: 'Компас', x: 860, y: 140 },
      { id: 't_ring', icon: '💍', label: 'Колечко', x: 520, y: 560 },
      { id: 't_bell', icon: '🔔', label: 'Колокольчик', x: 260, y: 470 },
    ],
    filler: ['🌿', '🍄', '🪨', '🐿️', '🍂', '🌰', '🌱', '🦔', '🍁', '🪺'],
    frontPool: ['🌿', '🍂', '🍄'],
    fillerCount: 60,
    rewards: [{ type: 'coins', amount: 85 }],
    intro: 'Под корнями старой ивы спрятан тайник. Собери всё ценное.',
  },
  // --- Мир 2: Средневековый дворик ---
  {
    id: 'sk_tw_01', world: 'town', mechanic: 'seek', name: 'Рыночная сутолока', difficulty: 3,
    targets: [
      { id: 't_coin', icon: '🪙', label: 'Утерянная монета', x: 640, y: 180 },
      { id: 't_receipt', icon: '🧾', label: 'Расписка', x: 140, y: 90 },
      { id: 't_spur', icon: '⭐', label: 'Шпора', x: 900, y: 470 },
      { id: 't_thread', icon: '🧵', label: 'Катушка ниток', x: 360, y: 580 },
    ],
    filler: ['🍎', '🥕', '🧺', '🍞', '🧀', '🥖', '🎣', '🪣', '🧈', '🥚'],
    frontPool: ['🧺', '🎏', '🌾', '🪢'],
    fillerCount: 62,
    rewards: [{ type: 'coins', amount: 110 }],
    intro: 'На рынке всё катится под прилавки. Помоги торговке собрать утраченное.',
  },
  {
    id: 'sk_tw_02', world: 'town', mechanic: 'seek', name: 'Склад кузнеца', difficulty: 3,
    targets: [
      { id: 't_tongs', icon: '🔧', label: 'Клещи', x: 830, y: 540 },
      { id: 't_nail', icon: '📌', label: 'Гвоздь особой закалки', x: 250, y: 160 },
      { id: 't_coal', icon: '🖤', label: 'Уголёк', x: 500, y: 380 },
      { id: 't_glove', icon: '🧤', label: 'Рукавица', x: 880, y: 180 },
    ],
    filler: ['⚙️', '🔩', '⛓️', '🔨', '🪓', '🛢️', '🧲', '⚒️', '🪚', '🔗'],
    frontPool: ['🕸️', '🧱', '🌫️'],
    fillerCount: 62,
    rewards: [{ type: 'coins', amount: 120 }],
    intro: 'Кузнец опять всё разбросал. Найди инструменты до прихода заказчика.',
  },
  // --- Мир 3: Книжный чердак ---
  {
    id: 'sk_bk_01', world: 'attic', mechanic: 'seek', name: 'Пыльная библиотека', difficulty: 4,
    targets: [
      { id: 't_bookmark', icon: '🔖', label: 'Закладка', x: 720, y: 260 },
      { id: 't_quill', icon: '🪶', label: 'Перо', x: 130, y: 540 },
      { id: 't_lens', icon: '🔍', label: 'Лупа', x: 890, y: 540 },
      { id: 't_letter', icon: '✉️', label: 'Нераспечатанное письмо', x: 330, y: 80 },
    ],
    filler: ['📚', '📖', '📜', '📕', '📗', '📘', '🕯️', '🫖', '☕', '📓'],
    frontPool: ['📜', '🕸️', '🌫️', '🪶'],
    fillerCount: 65,
    rewards: [{ type: 'coins', amount: 140 }],
    intro: 'На чердаке каждая вещь помнит историю. Найди четыре самые важные.',
  },
  {
    id: 'sk_bk_02', world: 'attic', mechanic: 'seek', name: 'Сундук бабушкиных писем', difficulty: 5,
    bg: 'seek_attic2',
    targets: [
      { id: 't_locket', icon: '📿', label: 'Медальон', x: 930, y: 330 },
      { id: 't_stamp', icon: '🏷️', label: 'Редкая марка', x: 60, y: 540 },
      { id: 't_key2', icon: '🗝️', label: 'Ключик от шкатулки', x: 560, y: 560 },
      { id: 't_photo', icon: '🖼️', label: 'Старая фотография', x: 240, y: 240 },
      { id: 't_dry', icon: '🥀', label: 'Засохшая роза', x: 790, y: 90 },
    ],
    filler: ['📜', '✉️', '📚', '🖋️', '🕰️', '🧸', '🎻', '📔', '🕯️', '🫙', '📯', '🎩'],
    frontPool: ['📜', '🕸️', '🎀', '🌫️'],
    fillerCount: 72,
    frontCount: 9,
    rewards: [{ type: 'coins', amount: 180 }, { type: 'seals', amount: 1 }],
    intro: 'Самый уютный тайник лавки. Пять памятных вещей ждут своей полки.',
  },
];

export const SEEK_PUZZLES = RAW.map((l) => ({
  ...l, sceneSize: SCENE_SIZE, scene: buildScene(l), front: buildFront(l),
}));
export const SEEK_PUZZLE_BY_ID = Object.fromEntries(SEEK_PUZZLES.map((p) => [p.id, p]));
