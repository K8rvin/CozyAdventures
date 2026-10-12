// Уровни мира 3 «Книжный чердак»: две механики.
// «Загадка Хранителя» (riddle, bk_01–bk_05): народная загадка, ответ — ОДНО
// короткое слово (≤6 букв); попытки с расцветкой (на месте / есть / нет).
// «Строка» (hang, bk_06–bk_10): стих классика (общественное достояние) без
// последней строки; тап по букве алфавита открывает её во всей строке,
// промахи топят свечу (6 ступеней); погасшая страница — минус 10% монет.
// Каждый уровень проверен в tests/riddle.test.mjs и tests/hangman.test.mjs.

export const BOOK_PUZZLES = [
  {
    id: 'bk_01', world: 'attic', mechanic: 'riddle', name: 'Первое слово', difficulty: 1,
    riddle: ['Молчу годами, пыльной сплю в сторонке —', 'открой меня, и заговорю тихонько.'],
    answer: 'КНИГА',
    rewards: [{ type: 'coins', amount: 90 }],
    intro: 'Хранитель загадал народную загадку. Тапай буквы алфавита — они лягут в окошки ответа.',
  },
  {
    id: 'bk_02', world: 'attic', mechanic: 'riddle', name: 'Огонёк', difficulty: 1,
    riddle: ['Плачу огнём и от слёз своих таю,', 'а тьму из лавки прогоняю.'],
    answer: 'СВЕЧА',
    rewards: [{ type: 'coins', amount: 95 }],
    intro: 'Пять букв, одна тёплая отгадка.',
  },
  {
    id: 'bk_03', world: 'attic', mechanic: 'riddle', name: 'Лесной клад', difficulty: 2,
    riddle: ['Мал, удал — сквозь землю прошёл,', 'красну шапочку нашёл.'],
    answer: 'ГРИБ',
    rewards: [{ type: 'coins', amount: 100 }],
    intro: 'Короткая отгадка с опушки.',
  },
  {
    id: 'bk_04', world: 'attic', mechanic: 'riddle', name: 'Тёплая горница', difficulty: 2,
    riddle: ['Без окон, без дверей —', 'полна горница людей.'],
    answer: 'ОГУРЕЦ',
    rewards: [{ type: 'coins', amount: 110 }],
    intro: 'Загадка с грядки. В лавке её знают все.',
  },
  {
    id: 'bk_05', world: 'attic', mechanic: 'riddle', name: 'Ходики', difficulty: 2,
    riddle: ['Без ног — бегут,', 'без рук — зовут.'],
    answer: 'ЧАСЫ',
    rewards: [{ type: 'coins', amount: 115 }],
    intro: 'Тикают на стене мастерской.',
  },
  {
    id: 'bk_06', world: 'attic', mechanic: 'hang', name: 'За окном', difficulty: 3,
    riddle: ['Белая берёза', 'под моим окном', 'принакрылась снегом…'],
    answer: 'ТОЧНО✦СЕРЕБРОМ', author: 'С. А. Есенин',
    rewards: [{ type: 'coins', amount: 130 }, { type: 'item', id: 'rng_ink' }],
    rewards_extra_note: true,
    intro: 'Стихотворение без последней строки. Тапай буквы алфавита — верная откроется везде, промах топит свечу.',
  },
  {
    id: 'bk_07', world: 'attic', mechanic: 'hang', name: 'Ночные звуки', difficulty: 3,
    riddle: ['Шёпот, робкое дыханье,', 'трели соловья,', 'серебро и колыханье…'],
    answer: 'СОННОГО✦РУЧЬЯ', author: 'А. А. Фет',
    rewards: [{ type: 'coins', amount: 135 }],
    intro: 'Ночная музыка без последнего аккорда. Свеча горит — не спеши с редкими буквами.',
  },
  {
    id: 'bk_08', world: 'attic', mechanic: 'hang', name: 'Буря', difficulty: 4,
    riddle: ['Буря мглою небо кроет,', 'вихри снежные крутя;', 'то, как зверь, она завоет…'],
    answer: 'ТО✦ЗАПЛАЧЕТ✦КАК✦ДИТЯ', author: 'А. С. Пушкин',
    rewards: [{ type: 'coins', amount: 145 }],
    intro: 'Четыре слова последней строки. Ритм подскажет, алфавит откроет.',
  },
  {
    id: 'bk_09', world: 'attic', mechanic: 'hang', name: 'Лукоморье', difficulty: 4,
    riddle: ['У Лукоморья дуб зелёный;', 'златая цепь на дубе том;', 'и днём и ночью кот учёный…'],
    answer: 'ВСЁ✦ХОДИТ✦ПО✦ЦЕПИ✦КРУГОМ', author: 'А. С. Пушкин',
    rewards: [{ type: 'coins', amount: 160 }],
    intro: 'Кот-хранитель одобряет эту страницу.',
  },
  {
    id: 'bk_10', world: 'attic', mechanic: 'hang', name: 'Начало мая', difficulty: 5,
    riddle: ['Люблю грозу в начале мая,', 'когда весенний, первый гром,', 'как бы резвяся и играя…'],
    answer: 'ГРОХОЧЕТ✦В✦НЕБЕ✦ГОЛУБОМ', author: 'Ф. И. Тютчев',
    rewards: [{ type: 'coins', amount: 220 }, { type: 'seals', amount: 1 }],
    intro: 'Главная страница чердака. Девятнадцать букв грома и одна свеча.',
  },
];

export const BOOK_PUZZLE_BY_ID = Object.fromEntries(BOOK_PUZZLES.map((p) => [p.id, p]));
