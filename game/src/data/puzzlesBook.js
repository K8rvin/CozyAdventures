// Уровни мира 3 «Книжный чердак», механика «Восстановление фразы».
// Буквы светящейся фразы рассыпались по странице-змейке; кляксы съели часть клеток.
// Ход — поменять местами две буквы. ✦ — неподвижный разделитель.
// Каждый уровень проверен в tests/book.test.mjs (валидность + подсказки решают).

export const BOOK_PUZZLES = [
  {
    id: 'bk_01', world: 'attic', mechanic: 'book', name: 'Первое слово', difficulty: 1,
    grid: [3, 1], blots: [],
    phrase: 'МИР', scrambled: 'РИМ',
    rewards: [{ type: 'coins', amount: 90 }],
    intro: 'Буквы вежливо ждут, когда их вернут на место. Тапни две — они поменяются.',
  },
  {
    id: 'bk_02', world: 'attic', mechanic: 'book', name: 'Полка сказок', difficulty: 1,
    grid: [5, 1], blots: [],
    phrase: 'КНИГА', scrambled: 'АГИНК',
    rewards: [{ type: 'coins', amount: 95 }],
    intro: 'Пять букв, одно уютное слово.',
  },
  {
    id: 'bk_03', world: 'attic', mechanic: 'book', name: 'Огарок', difficulty: 2,
    grid: [3, 2], blots: [[2, 1]],
    phrase: 'СВЕЧА', scrambled: 'АЧЕВС',
    rewards: [{ type: 'coins', amount: 100 }],
    intro: 'Клякса съела угол страницы. Буквы читаются змейкой.',
  },
  {
    id: 'bk_04', world: 'attic', mechanic: 'book', name: 'Вечерний ритуал', difficulty: 2,
    grid: [4, 2], blots: [[3, 1]],
    phrase: 'ЧАЙ✦ДОМ', scrambled: 'ДОМ✦ЙАЧ',
    rewards: [{ type: 'coins', amount: 110 }],
    intro: 'Две строчки через звёздный разделитель. ✦ всегда остаётся на месте.',
  },
  {
    id: 'bk_05', world: 'attic', mechanic: 'book', name: 'Ночной зов', difficulty: 2,
    grid: [5, 2], blots: [],
    phrase: 'ЛУНА✦ЗОВЁТ', scrambled: 'АНУЛ✦ТЁВОЗ',
    rewards: [{ type: 'coins', amount: 115 }],
    intro: 'Луна зовёт. Даже буквы это чувствуют.',
  },
  {
    id: 'bk_06', world: 'attic', mechanic: 'book', name: 'Шёпот страниц', difficulty: 3,
    grid: [5, 3], blots: [],
    phrase: 'СТРАНИЦЫ✦ШЕПЧУТ', scrambled: 'ЫЦИНАРТС✦ТУЧПЕШ',
    rewards: [{ type: 'coins', amount: 130 }, { type: 'item', id: 'rng_ink' }],
    rewards_extra_note: true,
    intro: 'Длинная фраза. Собирай её слово за словом.',
  },
  {
    id: 'bk_07', world: 'attic', mechanic: 'book', name: 'Чернила и сон', difficulty: 3,
    grid: [4, 4], blots: [[0, 3], [1, 3], [2, 3]],
    phrase: 'ЧЕРНИЛА✦И✦СОН', scrambled: 'АЛИНРЕЧ✦И✦НОС',
    rewards: [{ type: 'coins', amount: 135 }],
    intro: 'Три кляксы внизу. Два разделителя держат фразу.',
  },
  {
    id: 'bk_08', world: 'attic', mechanic: 'book', name: 'Закладка мечты', difficulty: 3,
    grid: [4, 4], blots: [[0, 3], [3, 3]],
    phrase: 'ЗАКЛАДКА✦МЕЧТЫ', scrambled: 'АДКАЛАКЗ✦ЫТЧЕМ',
    rewards: [{ type: 'coins', amount: 145 }],
    intro: 'Закладка выпала. Верни мечту на страницу.',
  },
  {
    id: 'bk_09', world: 'attic', mechanic: 'book', name: 'Пыль веков', difficulty: 4,
    grid: [4, 4], blots: [[0, 3]],
    phrase: 'ПЫЛЬ✦ВЕКОВ✦ЖДЁТ', scrambled: 'ЬЛЫП✦ВОКЕВ✦ТЁДЖ',
    rewards: [{ type: 'coins', amount: 160 }],
    intro: 'Три слова, три передышки. Пыль ждать умеет.',
  },
  {
    id: 'bk_10', world: 'attic', mechanic: 'book', name: 'Хранитель тишины', difficulty: 5,
    grid: [5, 4], blots: [[0, 3], [1, 3], [3, 3], [4, 3]],
    phrase: 'ХРАНИТЕЛЬ✦ТИШИНЫ', scrambled: 'ЬЛЕТИНАРХ✦ЫНИШИТ',
    rewards: [{ type: 'coins', amount: 220 }, { type: 'seals', amount: 1 }],
    intro: 'Главная фраза чердака. Шестнадцать букв тишины.',
  },
];

export const BOOK_PUZZLE_BY_ID = Object.fromEntries(BOOK_PUZZLES.map((p) => [p.id, p]));
