// Уровни мира 2 «Средневековый дворик», механика «Полки и товары».
// Товары нужно расставить по полкам с учётом правил соседства.
// Теги: fragile, heavy, metal, magic, potion, herb, food, glow.
// Каждый уровень проверен решателем в tests/shelf.test.mjs.

const T = {
  potion: { icon: '🧪', tags: ['potion', 'fragile'] },
  herbs: { icon: '🌿', tags: ['herb'] },
  hammer: { icon: '🔨', tags: ['heavy', 'metal'] },
  sword: { icon: '🗡️', tags: ['metal'] },
  shield: { icon: '🛡️', tags: ['heavy', 'metal'] },
  crystal: { icon: '🔮', tags: ['magic', 'fragile', 'glow'] },
  scroll: { icon: '📜', tags: ['fragile'] },
  bread: { icon: '🍞', tags: ['food'] },
  cheese: { icon: '🧀', tags: ['food'] },
  mug: { icon: '🍺', tags: ['food'] },
  gem: { icon: '💎', tags: ['magic', 'fragile', 'glow'] },
  candle: { icon: '🕯️', tags: ['fragile'] },
  horseshoe: { icon: '🧲', tags: ['metal', 'heavy'] },
};

function item(id, name, key) {
  return { id, name, icon: T[key].icon, tags: [...T[key].tags] };
}

export const SHELF_PUZZLES = [
  {
    id: 'tw_01', world: 'town', mechanic: 'shelf', name: 'Первая полка', difficulty: 1,
    grid: [3, 2],
    cells: [
      { pos: [0, 0], kind: 'shelf' }, { pos: [1, 0], kind: 'shelf' }, { pos: [2, 0], kind: 'shelf' },
    ],
    items: [
      item('i_hammer', 'Молоток', 'hammer'),
      item('i_herbs', 'Пучок трав', 'herbs'),
      item('i_potion', 'Зелье', 'potion'),
    ],
    rules: {
      notAdjacent: [['fragile', 'heavy']],
      mustAdjacent: [['potion', 'herb']],
    },
    rewards: [{ type: 'coins', amount: 60 }],
    intro: 'Хрупкое не кладём рядом с тяжёлым, а зелье держим ближе к травам.',
  },
  {
    id: 'tw_02', world: 'town', mechanic: 'shelf', name: 'Тяжёлый низ', difficulty: 1,
    grid: [4, 2],
    cells: [
      { pos: [0, 0], kind: 'shelf' }, { pos: [1, 0], kind: 'shelf' },
      { pos: [2, 0], kind: 'shelf' }, { pos: [3, 0], kind: 'shelf' },
    ],
    items: [
      item('i_sword', 'Меч', 'sword'),
      item('i_shield', 'Щит', 'shield'),
      item('i_scroll', 'Свиток', 'scroll'),
      item('i_crystal', 'Кристалл', 'crystal'),
    ],
    rules: {
      notAdjacent: [['fragile', 'heavy'], ['magic', 'metal']],
    },
    rewards: [{ type: 'coins', amount: 70 }],
    intro: 'Металл и магия не уживаются. Хрупкое — подальше от тяжёлого.',
  },
  {
    id: 'tw_03', world: 'town', mechanic: 'shelf', name: 'Свет у окна', difficulty: 2,
    grid: [4, 2],
    cells: [
      { pos: [0, 0], kind: 'light' }, { pos: [1, 0], kind: 'light' },
      { pos: [2, 0], kind: 'shelf' }, { pos: [3, 0], kind: 'shelf' },
      { pos: [0, 1], kind: 'shelf' }, { pos: [1, 1], kind: 'shelf' },
    ],
    items: [
      item('i_crystal', 'Кристалл', 'crystal'),
      item('i_herbs', 'Травы', 'herbs'),
      item('i_potion', 'Зелье', 'potion'),
      item('i_bread', 'Хлеб', 'bread'),
    ],
    rules: {
      onLight: ['glow'],
      mustAdjacent: [['potion', 'herb']],
    },
    rewards: [{ type: 'coins', amount: 80 }],
    intro: 'Светящиеся вещи любят место у окна.',
  },
  {
    id: 'tw_04', world: 'town', mechanic: 'shelf', name: 'Кузнечный порядок', difficulty: 2,
    grid: [4, 3],
    cells: [
      { pos: [0, 0], kind: 'shelf' }, { pos: [1, 0], kind: 'shelf' },
      { pos: [2, 0], kind: 'shelf' }, { pos: [3, 0], kind: 'shelf' },
      { pos: [0, 2], kind: 'shelf' }, { pos: [3, 2], kind: 'shelf' },
    ],
    items: [
      item('i_hammer', 'Молот', 'hammer'),
      item('i_horseshoe', 'Подкова', 'horseshoe'),
      item('i_sword', 'Меч', 'sword'),
      item('i_scroll', 'Чертёж', 'scroll'),
      item('i_candle', 'Свеча', 'candle'),
    ],
    rules: {
      notAdjacent: [['fragile', 'heavy']],
    },
    rewards: [{ type: 'coins', amount: 90 }],
    intro: 'Кузнец просил разложить инструменты. Чертёж и свеча — не под молотом!',
  },
  {
    id: 'tw_05', world: 'town', mechanic: 'shelf', name: 'Прилавок трактира', difficulty: 2,
    grid: [5, 2],
    cells: [
      { pos: [0, 0], kind: 'shelf' }, { pos: [1, 0], kind: 'shelf' },
      { pos: [2, 0], kind: 'shelf' }, { pos: [3, 0], kind: 'shelf' }, { pos: [4, 0], kind: 'shelf' },
    ],
    items: [
      item('i_bread', 'Хлеб', 'bread'),
      item('i_cheese', 'Сыр', 'cheese'),
      item('i_mug', 'Кружка', 'mug'),
      item('i_hammer', 'Молоток', 'hammer'),
    ],
    rules: {
      mustAdjacent: [['food', 'food']],
      notAdjacent: [['food', 'heavy']],
    },
    rewards: [{ type: 'coins', amount: 95 }],
    intro: 'Еда держится вместе и подальше от рабочего инструмента.',
  },
  {
    id: 'tw_06', world: 'town', mechanic: 'shelf', name: 'Магический шкаф', difficulty: 3,
    grid: [4, 3],
    cells: [
      { pos: [0, 0], kind: 'light' }, { pos: [3, 0], kind: 'light' },
      { pos: [0, 1], kind: 'shelf' }, { pos: [1, 1], kind: 'shelf' },
      { pos: [2, 1], kind: 'shelf' }, { pos: [3, 1], kind: 'shelf' },
    ],
    items: [
      item('i_crystal', 'Кристалл', 'crystal'),
      item('i_gem', 'Самоцвет', 'gem'),
      item('i_sword', 'Меч', 'sword'),
      item('i_shield', 'Щит', 'shield'),
      item('i_bread', 'Хлеб', 'bread'),
    ],
    rules: {
      onLight: ['glow'],
      notAdjacent: [['magic', 'metal'], ['fragile', 'heavy']],
    },
    rewards: [{ type: 'coins', amount: 110 }, { type: 'item', id: 'pot_stone' }],
    intro: 'Два светящихся — оба на свет. И ни одного металла рядом.',
  },
  {
    id: 'tw_07', world: 'town', mechanic: 'shelf', name: 'Полка у очага', difficulty: 3,
    grid: [5, 3],
    cells: [
      { pos: [0, 0], kind: 'light' }, { pos: [1, 0], kind: 'light' },
      { pos: [2, 0], kind: 'shelf' }, { pos: [3, 0], kind: 'shelf' }, { pos: [4, 0], kind: 'shelf' },
      { pos: [0, 2], kind: 'shelf' }, { pos: [4, 2], kind: 'shelf' },
    ],
    items: [
      item('i_candle', 'Свеча', 'candle'),
      item('i_scroll', 'Свиток', 'scroll'),
      item('i_hammer', 'Молот', 'hammer'),
      item('i_horseshoe', 'Подкова', 'horseshoe'),
      item('i_cheese', 'Сыр', 'cheese'),
    ],
    rules: {
      notAdjacent: [['fragile', 'heavy'], ['food', 'metal']],
      onLight: ['fragile'],
    },
    rewards: [{ type: 'coins', amount: 115 }],
    intro: 'Хрупкое — на свет, сыр — подальше от железа.',
  },
  {
    id: 'tw_08', world: 'town', mechanic: 'shelf', name: 'Заказ стражи', difficulty: 3,
    grid: [5, 3],
    cells: [
      { pos: [0, 0], kind: 'shelf' }, { pos: [1, 0], kind: 'shelf' },
      { pos: [2, 0], kind: 'shelf' }, { pos: [3, 0], kind: 'shelf' }, { pos: [4, 0], kind: 'shelf' },
      { pos: [1, 2], kind: 'shelf' }, { pos: [2, 2], kind: 'shelf' }, { pos: [3, 2], kind: 'shelf' },
    ],
    items: [
      item('i_sword', 'Меч', 'sword'),
      item('i_shield', 'Щит', 'shield'),
      item('i_hammer', 'Молот', 'hammer'),
      item('i_potion', 'Зелье', 'potion'),
      item('i_herbs', 'Травы', 'herbs'),
      item('i_crystal', 'Кристалл', 'crystal'),
    ],
    rules: {
      notAdjacent: [['fragile', 'heavy'], ['magic', 'metal']],
      mustAdjacent: [['potion', 'herb']],
    },
    rewards: [{ type: 'coins', amount: 125 }],
    intro: 'Стража заказала комплект. Собери аккуратно — магия не терпит металла.',
  },
  {
    id: 'tw_09', world: 'town', mechanic: 'shelf', name: 'Витрина диковин', difficulty: 4,
    grid: [6, 3],
    cells: [
      { pos: [0, 0], kind: 'light' }, { pos: [5, 0], kind: 'light' },
      { pos: [0, 1], kind: 'shelf' }, { pos: [1, 1], kind: 'shelf' }, { pos: [2, 1], kind: 'shelf' },
      { pos: [3, 1], kind: 'shelf' }, { pos: [4, 1], kind: 'shelf' }, { pos: [5, 1], kind: 'shelf' },
    ],
    items: [
      item('i_crystal', 'Кристалл', 'crystal'),
      item('i_gem', 'Самоцвет', 'gem'),
      item('i_candle', 'Свеча', 'candle'),
      item('i_hammer', 'Молот', 'hammer'),
      item('i_shield', 'Щит', 'shield'),
      item('i_mug', 'Кружка', 'mug'),
    ],
    rules: {
      onLight: ['glow'],
      notAdjacent: [['fragile', 'heavy'], ['food', 'metal']],
    },
    rewards: [{ type: 'coins', amount: 140 }],
    intro: 'Витрина на двоих окнах. Светящиеся диковины — к свету.',
  },
  {
    id: 'tw_10', world: 'town', mechanic: 'shelf', name: 'Большой шкаф капитана', difficulty: 5,
    grid: [6, 4],
    cells: [
      { pos: [0, 0], kind: 'light' }, { pos: [5, 0], kind: 'light' },
      { pos: [0, 1], kind: 'shelf' }, { pos: [1, 1], kind: 'shelf' }, { pos: [2, 1], kind: 'shelf' },
      { pos: [3, 1], kind: 'shelf' }, { pos: [4, 1], kind: 'shelf' }, { pos: [5, 1], kind: 'shelf' },
      { pos: [1, 3], kind: 'shelf' }, { pos: [2, 3], kind: 'shelf' },
      { pos: [3, 3], kind: 'shelf' }, { pos: [4, 3], kind: 'shelf' },
    ],
    items: [
      item('i_crystal', 'Кристалл', 'crystal'),
      item('i_gem', 'Самоцвет', 'gem'),
      item('i_sword', 'Меч стражи', 'sword'),
      item('i_shield', 'Щит капитана', 'shield'),
      item('i_hammer', 'Молот', 'hammer'),
      item('i_potion', 'Зелье', 'potion'),
      item('i_herbs', 'Травы', 'herbs'),
    ],
    rules: {
      onLight: ['glow'],
      notAdjacent: [['magic', 'metal'], ['fragile', 'heavy']],
      mustAdjacent: [['potion', 'herb']],
    },
    rewards: [{ type: 'coins', amount: 180 }, { type: 'seals', amount: 1 }],
    intro: 'Последний заказ дворика: всё сразу. Капитан будет доволен.',
  },
];

export const SHELF_PUZZLE_BY_ID = Object.fromEntries(SHELF_PUZZLES.map((p) => [p.id, p]));
