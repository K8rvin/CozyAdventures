// Уровни «Варка зелий по рецепту»: повтори шаги из книги рецептов.
// На столе всегда лежат и лишние ингредиенты — отвлекающие.
// С brew_06 — режим памяти: рецепт виден несколько секунд, потом прячется.
// Каждый уровень проверен валидатором в tests/brew.test.mjs.

const WATER = { id: 'water', name: 'Родниковая вода', icon: '💧' };
const HONEY = { id: 'honey', name: 'Дикий мёд', icon: '🍯' };
const CHAMOMILE = { id: 'chamomile', name: 'Ромашка', icon: '🌼' };
const MINT = { id: 'mint', name: 'Мята перечная', icon: '🌿' };
const BERRIES = { id: 'berries', name: 'Лесные ягоды', icon: '🫐' };
const MUSHROOM = { id: 'mushroom', name: 'Светляковый гриб', icon: '🍄' };
const MOSS = { id: 'moss', name: 'Светящийся мох', icon: '🟢' };
const FEATHER = { id: 'feather', name: 'Перо совы', icon: '🪶' };
const SPIDER = { id: 'spider', name: 'Паутинная нить', icon: '🕸️' };
const ROSE = { id: 'rose', name: 'Лепестки роз', icon: '🌹' };
const SALT = { id: 'salt', name: 'Соль', icon: '🧂' };
const CHESTNUT = { id: 'chestnut', name: 'Каштан', icon: '🌰' };
const STAR = { id: 'star', name: 'Звёздная пыль', icon: '🌟' };
const INK = { id: 'ink', name: 'Капля чернил', icon: '🫟' };
const ICE = { id: 'ice', name: 'Льдинка', icon: '🧊' };
const PEPPER = { id: 'pepper', name: 'Огненный перец', icon: '🌶️' };

export const BREW_PUZZLES = [
  {
    id: 'brew_01', world: 'brew', mechanic: 'brew', name: 'Ромашковый для котика', difficulty: 1,
    ingredients: [WATER, CHAMOMILE, HONEY],
    recipe: [
      { do: 'add', ingredient: 'water' },
      { do: 'add', ingredient: 'chamomile' },
      { do: 'stir' },
    ],
    rewards: [{ type: 'coins', amount: 110 }],
    intro: 'Кот-хранитель простудил нос. Свари по книге: шаги подсвечены, ошибиться можно трижды.',
  },
  {
    id: 'brew_02', world: 'brew', mechanic: 'brew', name: 'Согревающий для сторожа', difficulty: 1,
    ingredients: [WATER, HONEY, BERRIES, ICE],
    recipe: [
      { do: 'add', ingredient: 'water' },
      { do: 'heat' },
      { do: 'add', ingredient: 'honey' },
      { do: 'stir' },
    ],
    rewards: [{ type: 'coins', amount: 120 }],
    intro: 'Сторож мёрзнет у двери. Воду сначала греем — иначе мёд не пойдёт.',
  },
  {
    id: 'brew_03', world: 'brew', mechanic: 'brew', name: 'Мятный от нервов', difficulty: 2,
    ingredients: [WATER, MINT, CHAMOMILE, HONEY, SALT],
    recipe: [
      { do: 'add', ingredient: 'water' },
      { do: 'crush', ingredient: 'mint' },
      { do: 'stir' },
      { do: 'wait' },
      { do: 'cool' },
    ],
    rewards: [{ type: 'coins', amount: 140 }],
    intro: 'Торговец с площади дергается. Мяту сперва растолки в ступе — жми на ступку, потом на мяту.',
  },
  {
    id: 'brew_04', world: 'brew', mechanic: 'brew', name: 'Грибной светлячок', difficulty: 2,
    ingredients: [WATER, MUSHROOM, MOSS, BERRIES, SALT],
    recipe: [
      { do: 'add', ingredient: 'water' },
      { do: 'heat' },
      { do: 'add', ingredient: 'mushroom' },
      { do: 'stir' },
      { do: 'wait' },
      { do: 'cool' },
    ],
    rewards: [{ type: 'coins', amount: 150 }],
    intro: 'Зелье, что светится в темноте. Гриб кладём только в горячую воду.',
  },
  {
    id: 'brew_05', world: 'brew', mechanic: 'brew', name: 'Ягодное ободряющее', difficulty: 3,
    ingredients: [WATER, BERRIES, CHESTNUT, HONEY, MUSHROOM, SALT, ICE, FEATHER],
    recipe: [
      { do: 'add', ingredient: 'water' },
      { do: 'add', ingredient: 'berries' },
      { do: 'crush', ingredient: 'chestnut' },
      { do: 'heat' },
      { do: 'stir' },
      { do: 'add', ingredient: 'honey' },
      { do: 'wait' },
    ],
    rewards: [{ type: 'coins', amount: 180 }],
    intro: 'Для рыцаря перед походом. Стол полон лишнего — гляди в книгу, а не по сторонам.',
  },
  {
    id: 'brew_06', world: 'brew', mechanic: 'brew', name: 'Совиное зелье бодрости', difficulty: 3,
    ingredients: [WATER, FEATHER, MINT, CHAMOMILE, BERRIES, SALT],
    recipe: [
      { do: 'add', ingredient: 'water' },
      { do: 'heat' },
      { do: 'add', ingredient: 'feather' },
      { do: 'stir' },
      { do: 'add', ingredient: 'mint' },
      { do: 'cool' },
    ],
    hideRecipe: true, peekSeconds: 10,
    rewards: [{ type: 'coins', amount: 210 }],
    intro: 'Сова-библиотекарь диктует на память: рецепт виден 10 секунд, потом книга закрывается. Запоминай!',
  },
  {
    id: 'brew_07', world: 'brew', mechanic: 'brew', name: 'Паутинный для следопыта', difficulty: 4,
    ingredients: [WATER, SPIDER, HONEY, MOSS, MUSHROOM, ROSE, ICE, INK],
    recipe: [
      { do: 'add', ingredient: 'water' },
      { do: 'crush', ingredient: 'spider' },
      { do: 'add', ingredient: 'honey' },
      { do: 'heat' },
      { do: 'stir' },
      { do: 'wait' },
      { do: 'add', ingredient: 'moss' },
      { do: 'stir' },
    ],
    hideRecipe: true, peekSeconds: 8,
    rewards: [{ type: 'coins', amount: 250 }, { type: 'seals', amount: 1 }],
    intro: 'Следопыт платит печатью. 8 секунд на рецепт из восьми шагов — потом по памяти.',
  },
  {
    id: 'brew_08', world: 'brew', mechanic: 'brew', name: 'Звёздный эликсир мастера', difficulty: 5,
    ingredients: [WATER, STAR, HONEY, ROSE, FEATHER, INK, SALT, MUSHROOM, ICE, BERRIES, PEPPER],
    recipe: [
      { do: 'add', ingredient: 'water' },
      { do: 'heat' },
      { do: 'crush', ingredient: 'star' },
      { do: 'stir' },
      { do: 'add', ingredient: 'honey' },
      { do: 'wait' },
      { do: 'add', ingredient: 'rose' },
      { do: 'cool' },
      { do: 'add', ingredient: 'feather' },
      { do: 'stir' },
    ],
    hideRecipe: true, peekSeconds: 8,
    rewards: [{ type: 'coins', amount: 320 }, { type: 'seals', amount: 2 }],
    intro: 'Вершина алхимии: десять шагов, полный стол отвлекающего и всего 8 секунд на рецепт.',
  },
  {
    id: 'brew_09', world: 'brew', mechanic: 'brew', name: 'Укрепляющее на вкус', difficulty: 4,
    ingredients: [WATER, BERRIES, HONEY, CHESTNUT, MINT, SALT, PEPPER, INK],
    recipe: [
      { do: 'add', ingredient: 'water' },
      { do: 'heat' },
      { anyOf: [{ do: 'add', ingredient: 'berries' }, { do: 'add', ingredient: 'honey' }] },
      { do: 'stir' },
      { anyOf: [{ do: 'crush', ingredient: 'chestnut' }, { do: 'crush', ingredient: 'mint' }] },
      { do: 'wait' },
      { do: 'cool' },
    ],
    rewards: [{ type: 'coins', amount: 280 }, { type: 'seals', amount: 1 }],
    intro: 'Рецепт расплывчат, как память бабушки: кое-где написано «что под рукой». Читай «ИЛИ» — годится любой вариант.',
  },
  {
    id: 'brew_10', world: 'brew', mechanic: 'brew', name: 'Эликсир хозяина лавки', difficulty: 5,
    ingredients: [WATER, STAR, ROSE, FEATHER, BERRIES, HONEY, MOSS, PEPPER, ICE, INK],
    recipe: [
      { do: 'add', ingredient: 'water' },
      { do: 'heat' },
      { anyOf: [{ do: 'add', ingredient: 'star' }, { do: 'crush', ingredient: 'star' }] },
      { do: 'stir' },
      { anyOf: [{ do: 'add', ingredient: 'rose' }, { do: 'add', ingredient: 'berries' }] },
      { do: 'wait' },
      { do: 'cool' },
      { anyOf: [{ do: 'add', ingredient: 'feather' }, { do: 'add', ingredient: 'moss' }] },
      { do: 'stir' },
    ],
    hideRecipe: true, peekSeconds: 8,
    rewards: [{ type: 'coins', amount: 360 }, { type: 'seals', amount: 3 }],
    intro: 'Твой собственный рецепт, хозяин. Варианты «ИЛИ» — по памяти, 8 секунд. Гордись.',
  },
];
