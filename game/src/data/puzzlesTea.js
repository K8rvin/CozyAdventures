// Уровни «Чай для путника»: смешай отвар точного цвета, не перегрей котёл.
// Каждый уровень проверен решателем в tests/tea.test.mjs.
// Ингредиент: dr/dg/db — сдвиг цвета, heat — сдвиг жара, uses — сколько порций.

export const TEA_PUZZLES = [
  {
    id: 'tea_01', world: 'crossroads', mechanic: 'tea', name: 'Мятный для мокрого странника', difficulty: 1,
    target: { r: 0, g: 50, b: 0 }, tolerance: 10, maxHeat: 50,
    ingredients: [
      { id: 'mint', name: 'Мята', icon: '🌿', dr: 0, dg: 25, db: 0, heat: -5, uses: 2 },
      { id: 'water', name: 'Родниковая вода', icon: '💧', dr: 0, dg: 0, db: 0, heat: -25, uses: 2 },
      { id: 'fire', name: 'Полешко', icon: '🔥', dr: 0, dg: 0, db: 0, heat: 20, uses: 1 },
    ],
    rewards: [{ type: 'coins', amount: 100 }],
    intro: 'Добавляй ингредиенты в котёл. Цвет отвара показан под котлом, цель — на флаконе.',
  },
  {
    id: 'tea_02', world: 'crossroads', mechanic: 'tea', name: 'Медовый вечер', difficulty: 1,
    target: { r: 45, g: 20, b: 0 }, tolerance: 10, maxHeat: 60,
    ingredients: [
      { id: 'honey', name: 'Мёд', icon: '🍯', dr: 15, dg: 10, db: 0, heat: 5, uses: 3 },
      { id: 'berries', name: 'Ягоды', icon: '🫐', dr: 30, dg: 0, db: 15, heat: 5, uses: 1 },
      { id: 'mint', name: 'Мята', icon: '🌿', dr: 0, dg: 25, db: 0, heat: -5, uses: 1 },
      { id: 'water', name: 'Вода', icon: '💧', dr: 0, dg: 0, db: 0, heat: -25, uses: 1 },
    ],
    rewards: [{ type: 'coins', amount: 110 }],
    intro: 'Мёд даёт тёплый янтарный цвет. Не увлекайся ягодами.',
  },
  {
    id: 'tea_03', world: 'crossroads', mechanic: 'tea', name: 'Кора дуба для лесника', difficulty: 2,
    target: { r: 20, g: 20, b: 40 }, tolerance: 10, maxHeat: 55,
    ingredients: [
      { id: 'bark', name: 'Кора', icon: '🪵', dr: 0, dg: 0, db: 20, heat: 0, uses: 2 },
      { id: 'honey', name: 'Мёд', icon: '🍯', dr: 15, dg: 10, db: 0, heat: 5, uses: 2 },
      { id: 'berries', name: 'Ягоды', icon: '🫐', dr: 30, dg: 0, db: 15, heat: 5, uses: 1 },
      { id: 'mint', name: 'Мята', icon: '🌿', dr: 0, dg: 25, db: 0, heat: -5, uses: 1 },
      { id: 'water', name: 'Вода', icon: '💧', dr: 0, dg: 0, db: 0, heat: -25, uses: 2 },
    ],
    rewards: [{ type: 'coins', amount: 125 }],
    intro: 'Кора тянет в синеву, мёд — в янтарь. Баланс — во всём.',
  },
  {
    id: 'tea_04', world: 'crossroads', mechanic: 'tea', name: 'Ягодный, не перегретый', difficulty: 2,
    target: { r: 50, g: 0, b: 30 }, tolerance: 10, maxHeat: 40,
    ingredients: [
      { id: 'berries', name: 'Ягоды', icon: '🫐', dr: 30, dg: 0, db: 15, heat: 5, uses: 3 },
      { id: 'fire', name: 'Полешко', icon: '🔥', dr: 0, dg: 0, db: 0, heat: 20, uses: 2 },
      { id: 'water', name: 'Вода', icon: '💧', dr: 0, dg: 0, db: 0, heat: -25, uses: 2 },
      { id: 'honey', name: 'Мёд', icon: '🍯', dr: 15, dg: 10, db: 0, heat: 5, uses: 1 },
      { id: 'bark', name: 'Кора', icon: '🪵', dr: 0, dg: 0, db: 20, heat: 0, uses: 1 },
    ],
    rewards: [{ type: 'coins', amount: 135 }],
    intro: 'Путник просит ягодный, но холодный. Огонь здесь — искушение.',
  },
  {
    id: 'tea_05', world: 'crossroads', mechanic: 'tea', name: 'Лимонная поляна', difficulty: 3,
    target: { r: 35, g: 45, b: 20 }, tolerance: 8, maxHeat: 45,
    ingredients: [
      { id: 'lemon', name: 'Лимон', icon: '🍋', dr: 10, dg: 20, db: 0, heat: 5, uses: 2 },
      { id: 'honey', name: 'Мёд', icon: '🍯', dr: 15, dg: 10, db: 0, heat: 5, uses: 2 },
      { id: 'bark', name: 'Кора', icon: '🪵', dr: 0, dg: 0, db: 20, heat: 0, uses: 2 },
      { id: 'mint', name: 'Мята', icon: '🌿', dr: 0, dg: 25, db: 0, heat: -5, uses: 2 },
      { id: 'water', name: 'Вода', icon: '💧', dr: 0, dg: 0, db: 0, heat: -25, uses: 1 },
      { id: 'berries', name: 'Ягоды', icon: '🫐', dr: 30, dg: 0, db: 15, heat: 5, uses: 1 },
    ],
    rewards: [{ type: 'coins', amount: 150 }],
    intro: 'Три ноты: лимон, мёд и немного коры. Допуск жёстче.',
  },
  {
    id: 'tea_06', world: 'crossroads', mechanic: 'tea', name: 'Пурпур сумерек', difficulty: 3,
    target: { r: 60, g: 30, b: 60 }, tolerance: 10, maxHeat: 50,
    ingredients: [
      { id: 'berries', name: 'Ягоды', icon: '🫐', dr: 30, dg: 0, db: 15, heat: 5, uses: 3 },
      { id: 'bark', name: 'Кора', icon: '🪵', dr: 0, dg: 0, db: 20, heat: 0, uses: 2 },
      { id: 'honey', name: 'Мёд', icon: '🍯', dr: 15, dg: 10, db: 0, heat: 5, uses: 2 },
      { id: 'mint', name: 'Мята', icon: '🌿', dr: 0, dg: 25, db: 0, heat: -5, uses: 1 },
      { id: 'water', name: 'Вода', icon: '💧', dr: 0, dg: 0, db: 0, heat: -25, uses: 1 },
    ],
    rewards: [{ type: 'coins', amount: 160 }],
    intro: 'Пурпур — это ягоды плюс кора, а зелень мяты смягчает тон.',
  },
  {
    id: 'tea_07', world: 'crossroads', mechanic: 'tea', name: 'Изумрудный каприз', difficulty: 4,
    target: { r: 25, g: 65, b: 35 }, tolerance: 8, maxHeat: 35,
    ingredients: [
      { id: 'mint', name: 'Мята', icon: '🌿', dr: 0, dg: 25, db: 0, heat: -5, uses: 3 },
      { id: 'lemon', name: 'Лимон', icon: '🍋', dr: 10, dg: 20, db: 0, heat: 5, uses: 2 },
      { id: 'bark', name: 'Кора', icon: '🪵', dr: 0, dg: 0, db: 20, heat: 0, uses: 2 },
      { id: 'honey', name: 'Мёд', icon: '🍯', dr: 15, dg: 10, db: 0, heat: 5, uses: 1 },
      { id: 'water', name: 'Вода', icon: '💧', dr: 0, dg: 0, db: 0, heat: -25, uses: 2 },
      { id: 'berries', name: 'Ягоды', icon: '🫐', dr: 30, dg: 0, db: 15, heat: 5, uses: 1 },
    ],
    rewards: [{ type: 'coins', amount: 175 }],
    intro: 'Изумрудный цвет капризен: шаг влево, шаг вправо — и не тот.',
  },
  {
    id: 'tea_08', world: 'crossroads', mechanic: 'tea', name: 'Янтарь ярмарки', difficulty: 5,
    target: { r: 70, g: 50, b: 25 }, tolerance: 8, maxHeat: 30,
    ingredients: [
      { id: 'honey', name: 'Мёд', icon: '🍯', dr: 15, dg: 10, db: 0, heat: 5, uses: 3 },
      { id: 'lemon', name: 'Лимон', icon: '🍋', dr: 10, dg: 20, db: 0, heat: 5, uses: 2 },
      { id: 'berries', name: 'Ягоды', icon: '🫐', dr: 30, dg: 0, db: 15, heat: 5, uses: 2 },
      { id: 'bark', name: 'Кора', icon: '🪵', dr: 0, dg: 0, db: 20, heat: 0, uses: 1 },
      { id: 'mint', name: 'Мята', icon: '🌿', dr: 0, dg: 25, db: 0, heat: -5, uses: 1 },
      { id: 'water', name: 'Вода', icon: '💧', dr: 0, dg: 0, db: 0, heat: -25, uses: 2 },
      { id: 'fire', name: 'Полешко', icon: '🔥', dr: 0, dg: 0, db: 0, heat: 20, uses: 1 },
    ],
    rewards: [{ type: 'coins', amount: 220 }, { type: 'seals', amount: 1 }],
    intro: 'Фирменный янтарь лавки. Холодный котёл, жёсткий допуск — вершина чайного искусства.',
  },
];

export const TEA_PUZZLE_BY_ID = Object.fromEntries(TEA_PUZZLES.map((p) => [p.id, p]));
