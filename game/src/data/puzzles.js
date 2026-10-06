// Уровни мира «Тихая опушка», механика «Свет и фонарики».
// Сетка сверху, координаты [x, y] от левого верхнего угла.
// dir: 0=вверх, 1=вправо, 2=вниз, 3=влево.
// Типы объектов:
//   source  — светлячок, светит в направлении dir (неподвижен)
//   mirror  — зеркало, orient: 0='\', 1='/', тап поворачивает на 90°
//   lantern — фонарь: загорается от света и ПРОПУСКАЕТ его дальше
//   moth    — ночная моль: свет её будит (поглощает луч) — нельзя!
//   wall    — тень/куст: просто блокирует свет
// Цель: зажечь ВСЕ фонари и не разбудить ни одной моли.
// Каждый уровень проверен решателем в tests/puzzle.test.mjs.

export const PUZZLES = [
  {
    id: 'md_01', world: 'meadow', name: 'Первый светлячок', difficulty: 1,
    grid: [4, 4],
    objects: [
      { type: 'source', pos: [0, 1], dir: 1 },
      { type: 'lantern', pos: [3, 1] },
    ],
    rewards: [{ type: 'coins', amount: 40 }],
    intro: 'Смотри: светлячок светит прямо — луч уже бежит к фонарю! Так работает свет. Уровень решится сам, а дальше мы добавим зеркала.',
  },
  {
    id: 'md_02', world: 'meadow', name: 'Первое зеркало', difficulty: 1,
    grid: [5, 5],
    objects: [
      { type: 'source', pos: [0, 2], dir: 1 },
      { type: 'mirror', pos: [2, 2], orient: 0 },
      { type: 'lantern', pos: [2, 0] },
    ],
    rewards: [{ type: 'coins', amount: 45 }],
    intro: 'Тапни зеркало, чтобы повернуть его. Направь свет к фонарю.',
  },
  {
    id: 'md_03', world: 'meadow', name: 'Поворот налево', difficulty: 1,
    grid: [5, 5],
    objects: [
      { type: 'source', pos: [2, 4], dir: 0 },
      { type: 'mirror', pos: [2, 2], orient: 1 },
      { type: 'mirror', pos: [4, 4], orient: 0 },
      { type: 'lantern', pos: [0, 2] },
    ],
    rewards: [{ type: 'coins', amount: 45 }, { type: 'item', id: 'pot_heal' }],
    intro: 'Зеркало отражает свет под прямым углом.',
  },
  {
    id: 'md_04', world: 'meadow', name: 'Два зеркала', difficulty: 2,
    grid: [6, 6],
    objects: [
      { type: 'source', pos: [0, 0], dir: 1 },
      { type: 'mirror', pos: [3, 0], orient: 1 },
      { type: 'mirror', pos: [3, 3], orient: 0 },
      { type: 'lantern', pos: [0, 3] },
    ],
    rewards: [{ type: 'coins', amount: 55 }],
    intro: 'Свет может поворачивать несколько раз.',
  },
  {
    id: 'md_05', world: 'meadow', name: 'Тише, моль спит', difficulty: 2,
    grid: [5, 5],
    objects: [
      { type: 'source', pos: [0, 2], dir: 1 },
      { type: 'mirror', pos: [2, 2], orient: 0 },
      { type: 'lantern', pos: [2, 0] },
      { type: 'moth', pos: [2, 4] },
    ],
    rewards: [{ type: 'coins', amount: 60 }],
    intro: 'Свет будит ночную моль. Направь луч к фонарю, а не к ней.',
  },
  {
    id: 'md_06', world: 'meadow', name: 'Обходной свет', difficulty: 2,
    grid: [6, 5],
    objects: [
      { type: 'source', pos: [0, 2], dir: 1 },
      { type: 'mirror', pos: [1, 2], orient: 0 },
      { type: 'mirror', pos: [1, 0], orient: 0 },
      { type: 'mirror', pos: [4, 4], orient: 1 },
      { type: 'lantern', pos: [4, 0] },
      { type: 'moth', pos: [4, 2] },
    ],
    rewards: [{ type: 'coins', amount: 65 }],
    intro: 'Прямой путь занят спящей молью. Проведи свет сверху.',
  },
  {
    id: 'md_07', world: 'meadow', name: 'Два фонаря', difficulty: 2,
    grid: [6, 6],
    objects: [
      { type: 'source', pos: [0, 0], dir: 1 },
      { type: 'lantern', pos: [2, 0] },
      { type: 'mirror', pos: [5, 0], orient: 1 },
      { type: 'lantern', pos: [5, 4] },
    ],
    rewards: [{ type: 'coins', amount: 70 }],
    intro: 'Зажжённый фонарь пропускает свет дальше — один луч может зажечь несколько.',
  },
  {
    id: 'md_08', world: 'meadow', name: 'Зигзаг', difficulty: 3,
    grid: [7, 7],
    objects: [
      { type: 'source', pos: [0, 6], dir: 0 },
      { type: 'mirror', pos: [0, 4], orient: 0 },
      { type: 'mirror', pos: [3, 4], orient: 1 },
      { type: 'mirror', pos: [3, 6], orient: 0 },
      { type: 'lantern', pos: [1, 6] },
    ],
    rewards: [{ type: 'coins', amount: 80 }, { type: 'item', id: 'rng_luck' }],
    intro: 'Три поворота — и свет найдёт дорогу.',
  },
  {
    id: 'md_09', world: 'meadow', name: 'Моль под фонарём', difficulty: 3,
    grid: [6, 6],
    objects: [
      { type: 'source', pos: [5, 3], dir: 3 },
      { type: 'mirror', pos: [3, 3], orient: 1 },
      { type: 'mirror', pos: [3, 1], orient: 0 },
      { type: 'lantern', pos: [5, 1] },
      { type: 'moth', pos: [3, 5] },
    ],
    rewards: [{ type: 'coins', amount: 85 }],
    intro: 'Один неверный поворот — и моль проснётся.',
  },
  {
    id: 'md_10', world: 'meadow', name: 'Тень у дороги', difficulty: 3,
    grid: [7, 6],
    objects: [
      { type: 'source', pos: [0, 0], dir: 1 },
      { type: 'wall', pos: [2, 0] },
      { type: 'wall', pos: [2, 1] },
      { type: 'mirror', pos: [1, 0], orient: 1 },
      { type: 'mirror', pos: [1, 4], orient: 1 },
      { type: 'mirror', pos: [4, 4], orient: 1 },
      { type: 'lantern', pos: [0, 4] },
    ],
    rewards: [{ type: 'coins', amount: 90 }],
    intro: 'Тень не страшна — она просто останавливает свет. Обойди её.',
  },
  {
    id: 'md_11', world: 'meadow', name: 'Гирлянда', difficulty: 4,
    grid: [7, 7],
    objects: [
      { type: 'source', pos: [3, 6], dir: 0 },
      { type: 'lantern', pos: [3, 4] },
      { type: 'mirror', pos: [3, 2], orient: 1 },
      { type: 'lantern', pos: [1, 2] },
      { type: 'mirror', pos: [0, 2], orient: 0 },
      { type: 'lantern', pos: [0, 4] },
      { type: 'mirror', pos: [0, 6], orient: 1 },
      { type: 'lantern', pos: [2, 6] },
    ],
    rewards: [{ type: 'coins', amount: 110 }],
    intro: 'Целая гирлянда фонарей — как на ночном рынке.',
  },
  {
    id: 'md_12', world: 'meadow', name: 'Финал опушки', difficulty: 5,
    grid: [8, 8],
    objects: [
      { type: 'source', pos: [0, 7], dir: 1 },
      { type: 'moth', pos: [3, 7] },
      { type: 'mirror', pos: [1, 7], orient: 0 },
      { type: 'mirror', pos: [1, 4], orient: 0 },
      { type: 'mirror', pos: [5, 4], orient: 1 },
      { type: 'mirror', pos: [5, 6], orient: 0 },
      { type: 'lantern', pos: [2, 6] },
      { type: 'wall', pos: [2, 2] },
      { type: 'wall', pos: [2, 3] },
    ],
    rewards: [{ type: 'coins', amount: 150 }, { type: 'seals', amount: 1 }],
    intro: 'Последняя загадка опушки. Моль сторожит прямой путь.',
  },
];

export const PUZZLE_BY_ID = Object.fromEntries(PUZZLES.map((p) => [p.id, p]));
