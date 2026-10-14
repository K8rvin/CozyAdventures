// Уровни «Карты судьбы»: гость рассказывает историю в 3–4 частях,
// хозяин раскладывает карты по позициям расклада. У карты — значения
// (теги смыслов, видны игроку на карте); у позиции — accept: какие карты
// подходят. Карты с общим значением (Письмо и Нить — «связь») работают
// честными обманками: подсвечиваются «близко».
// Гости — знакомцы лавки: сторож (brew_02), сова (brew_06), следопыт
// (brew_07), торговец (brew_03), паучок из хаба, сам рыцарь и кот-хранитель.
// Каждый уровень проверен валидатором в tests/fate.test.mjs.

// --- Колода: имя, иконка-фолбэк, значения (теги) ---
export const FATE_CARDS = {
  home: { id: 'home', name: 'Дом', icon: '🏠', meanings: ['очаг', 'родня'] },
  path: { id: 'path', name: 'Дорога', icon: '🥾', meanings: ['путь', 'перемены'] },
  well: { id: 'well', name: 'Колодец', icon: '🕳️', meanings: ['тайна', 'глубина'] },
  star: { id: 'star', name: 'Звезда', icon: '⭐', meanings: ['надежда', 'мечта'] },
  web: { id: 'web', name: 'Паутина', icon: '🕸️', meanings: ['запутанность', 'долг'] },
  bread: { id: 'bread', name: 'Хлеб', icon: '🍞', meanings: ['достаток', 'труд'] },
  mirror: { id: 'mirror', name: 'Зеркало', icon: '🪞', meanings: ['правда', 'двойник'] },
  candle: { id: 'candle', name: 'Свеча', icon: '🕯️', meanings: ['память', 'тепло'] },
  key: { id: 'key', name: 'Ключ', icon: '🗝️', meanings: ['ответ', 'начало'] },
  book: { id: 'book', name: 'Книга', icon: '📖', meanings: ['знание', 'запись'] },
  bell: { id: 'bell', name: 'Колокол', icon: '🔔', meanings: ['весть', 'зов'] },
  letter: { id: 'letter', name: 'Письмо', icon: '✉️', meanings: ['связь', 'ожидание'] },
  moon: { id: 'moon', name: 'Луна', icon: '🌙', meanings: ['сны', 'тишина'] },
  sun: { id: 'sun', name: 'Солнце', icon: '☀️', meanings: ['радость', 'удача'] },
  rain: { id: 'rain', name: 'Дождь', icon: '🌧️', meanings: ['грусть', 'очищение'] },
  tree: { id: 'tree', name: 'Дуб', icon: '🌳', meanings: ['корни', 'сила'] },
  bird: { id: 'bird', name: 'Птица', icon: '🐦', meanings: ['вольность', 'весточка'] },
  ship: { id: 'ship', name: 'Кораблик', icon: '⛵', meanings: ['странствие', 'возвращение'] },
  fire: { id: 'fire', name: 'Огонь', icon: '🔥', meanings: ['пыл', 'опасность'] },
  cup: { id: 'cup', name: 'Чаша', icon: '🍵', meanings: ['встреча', 'угощение'] },
  thread: { id: 'thread', name: 'Нить', icon: '🧵', meanings: ['связь', 'тянучесть'] },
  coin: { id: 'coin', name: 'Монета', icon: '🪙', meanings: ['цена', 'расчёт'] },
  gate: { id: 'gate', name: 'Ворота', icon: '🚪', meanings: ['порог', 'выбор'] },
};

export const FATE_PUZZLES = [
  {
    id: 'fate_01', world: 'fate', mechanic: 'fate', name: 'Сторож у двери', difficulty: 1,
    guest: { name: 'Сторож', icon: '🧔', art: 'assets/fate/guest_watchman_web.jpg' },
    story: [
      { label: 'Что было', text: 'Всю жизнь шагал по дворам да улицам — ноги сами помнят каждый камень у перекрёстка.', accept: ['path'] },
      { label: 'Что есть', text: 'А теперь вот стою под вашей крышей, стерегу покой хозяйский — и вроде как дома.', accept: ['home'] },
      { label: 'Что гнетёт', text: 'Только весточки от брата третий месяц нет. Жду каждый вечер — и всё мимо.', accept: ['letter'] },
    ],
    hand: ['path', 'home', 'letter', 'star', 'bread', 'mirror'],
    rewards: [{ type: 'coins', amount: 320 }],
    intro: 'Первый гость на расклад. Читай историю по частям и клади карту, чьё значение отвечает строкам.',
  },
  {
    id: 'fate_02', world: 'fate', mechanic: 'fate', name: 'Сова и каталог', difficulty: 1,
    guest: { name: 'Сова-библиотекарь', icon: '🦉', art: 'assets/fate/guest_owl_web.jpg' },
    story: [
      { label: 'Что было', text: 'Полжизни провела среди страниц — каждый фолиант мне как родной.', accept: ['book'] },
      { label: 'Что есть', text: 'А теперь засыпаю прямо на каталоге: ночи тихие, глаза слипаются.', accept: ['moon'] },
      { label: 'Что гнетёт', text: 'Боюсь, каталог мой окончательно запутается — все ниточки в один клубок.', accept: ['web'] },
    ],
    hand: ['book', 'moon', 'web', 'bell', 'ship', 'coin'],
    rewards: [{ type: 'coins', amount: 330 }],
    intro: 'Сова диктовала рецепты на память — теперь сама просит совета у карт.',
  },
  {
    id: 'fate_03', world: 'fate', mechanic: 'fate', name: 'Развилка следопыта', difficulty: 2,
    guest: { name: 'Следопыт', icon: '🧭', art: 'assets/fate/guest_ranger_web.jpg' },
    story: [
      { label: 'Что было', text: 'По топям да чащам ходил, тропы знал как свои пять пальцев.', accept: ['path'] },
      { label: 'Что есть', text: 'А нынче стою у вашего прилавка между двумя товарами — и ни туда, ни сюда.', accept: ['gate'] },
      { label: 'Что гнетёт', text: 'И долг старый за мной тянется, как тонкая ниточка, не оторвать.', accept: ['thread'] },
    ],
    hand: ['path', 'gate', 'thread', 'candle', 'well', 'rain', 'bird'],
    rewards: [{ type: 'coins', amount: 345 }],
    intro: 'Следопыт платил печатью за паутинное зелье. Сегодня распутываем его самого.',
  },
  {
    id: 'fate_04', world: 'fate', mechanic: 'fate', name: 'Пепел алхимика', difficulty: 2,
    guest: { name: 'Алхимик', icon: '⚗️', art: 'assets/fate/guest_alchemist_web.jpg' },
    story: [
      { label: 'Что было', text: 'Была у меня лавка да полный дом — ни в чём нужды не знал.', accept: ['bread'] },
      { label: 'Что есть', text: 'Пожар всё и забрал: кормил меня огонь — он же и погубил.', accept: ['fire'] },
      { label: 'Что гнетёт', text: 'Теперь маюсь: где найти ответ, с чего начать заново?', accept: ['key'] },
    ],
    hand: ['bread', 'fire', 'key', 'star', 'web', 'bell'],
    rewards: [{ type: 'coins', amount: 360 }],
    intro: 'Алхимик из лавки «Котёл и роса». Его история — про цену огня.',
  },
  {
    id: 'fate_05', world: 'fate', mechanic: 'fate', name: 'Качели паучка', difficulty: 2,
    guest: { name: 'Паучок', icon: '🕷️', art: 'assets/fate/guest_spider_web.jpg' },
    story: [
      { label: 'Что было', text: 'Спустился я однажды с самого верха лавки — на тонкой-претонкой ниточке.', accept: ['thread'] },
      { label: 'Что есть', text: 'Теперь вся страница и вся витрина — мой дом, моё кресло-качели.', accept: ['home'] },
      { label: 'Что гнетёт', text: 'А вчера глянул в блюдце — и перепугался: кто это на меня смотрит?!', accept: ['mirror'] },
    ],
    hand: ['thread', 'home', 'mirror', 'fire', 'letter', 'tree'],
    rewards: [{ type: 'coins', amount: 375 }],
    intro: 'Паучок спускается по паутине при прокрутке — но и у него есть свои страхи.',
  },
  {
    id: 'fate_06', world: 'fate', mechanic: 'fate', name: 'Три дороги рыцаря', difficulty: 3,
    guest: { name: 'Рыцарь', icon: '🛡️', art: 'assets/fate/guest_knight_web.jpg' },
    story: [
      { label: 'Что было', text: 'Служил честно: щит и меч были мне и кровом, и семьёй.', accept: ['home'] },
      { label: 'Что есть', text: 'А теперь передо мной три дороги — и каждая зовёт первым шагом.', accept: ['gate'] },
      { label: 'Что гнетёт', text: 'Гляжу за поворот — и страшно: вдруг там не слава, а тёмная бездна без дна?', accept: ['well'] },
    ],
    hand: ['home', 'gate', 'well', 'star', 'bread', 'candle', 'rain'],
    rewards: [{ type: 'coins', amount: 390 }],
    intro: 'Ты снаряжаешь его в походы — а он волнуется. Разложи расклад для своего рыцаря.',
  },
  {
    id: 'fate_07', world: 'fate', mechanic: 'fate', name: 'Звон торговца', difficulty: 3,
    guest: { name: 'Торговец', icon: '🧮', art: 'assets/fate/guest_merchant_web.jpg' },
    story: [
      { label: 'Что было', text: 'Торговал бойко, монета к монете так и липла.', accept: ['coin'] },
      { label: 'Что есть', text: 'А теперь везде слышу звон — и не пойму: то ль весть добрая, то ль сердце моё стучит.', accept: ['bell'] },
      { label: 'Что гнетёт', text: 'Душа просит тихого огонька да тёплого слова у витрины.', accept: ['candle'] },
    ],
    hand: ['coin', 'bell', 'candle', 'book', 'ship', 'mirror'],
    rewards: [{ type: 'coins', amount: 405 }],
    intro: 'Торговец с площади, что дергался от нервов, пришёл благодарить — и заодно погадать.',
  },
  {
    id: 'fate_08', world: 'fate', mechanic: 'fate', name: 'Песня путницы', difficulty: 3,
    guest: { name: 'Юная путница', icon: '🧕', art: 'assets/fate/guest_wanderer_web.jpg' },
    story: [
      { label: 'Что было', text: 'Вышла из дому налегке — одна песня за плечами, и весь мир впереди.', accept: ['bird'] },
      { label: 'Что есть', text: 'Каждый перекрёсток шепчет: направо — каравай, налево — звезда. Куда ступить?', accept: ['gate'] },
      { label: 'Что гнетёт', text: 'Страшно, что дорога выведет не к тёплому дому, а в холодный ливень.', accept: ['rain'] },
    ],
    hand: ['bird', 'gate', 'rain', 'well', 'bread', 'bell'],
    rewards: [{ type: 'coins', amount: 420 }],
    intro: 'Путница замёрзла у двери. Отгрей историю — и карты подскажут ей дорогу.',
  },
  {
    id: 'fate_09', world: 'fate', mechanic: 'fate', name: 'Сад садовника', difficulty: 3,
    guest: { name: 'Старый садовник', icon: '🌱', art: 'assets/fate/guest_gardener_web.jpg' },
    story: [
      { label: 'Что было', text: 'Посадил сад. Дубы мои уже внуков тенью кроют — корни мои, сила моя.', accept: ['tree'] },
      { label: 'Что есть', text: 'Сам состарился, руки не те. Сад просит новых рук — кому передать?', accept: ['key'] },
      { label: 'Что гнетёт', text: 'А вдруг сад забудет меня, как утро забывает свечу?', accept: ['candle'] },
      { label: 'Совет', text: 'Скажи, хозяин, чем мне сердце согреть на старости?', accept: ['sun'] },
    ],
    hand: ['tree', 'key', 'candle', 'sun', 'star', 'thread', 'ship', 'rain'],
    rewards: [{ type: 'coins', amount: 440 }],
    intro: 'Первый расклад на четыре позиции: добавляется «Совет» — карта-ответ гостю.',
  },
  {
    id: 'fate_10', world: 'fate', mechanic: 'fate', name: 'Моряк на суше', difficulty: 4,
    guest: { name: 'Моряк', icon: '⚓', art: 'assets/fate/guest_sailor_web.jpg' },
    story: [
      { label: 'Что было', text: 'Тридцать лет морей видел — палуба была мне отчим домом.', accept: ['ship'] },
      { label: 'Что есть', text: 'А теперь нога дрожит о сухую землю: стою у городского порога — и не идётся.', accept: ['gate'] },
      { label: 'Что гнетёт', text: 'Корабль мой ждёт в гавани и тянет за сердце, как тонкая нить.', accept: ['thread'] },
      { label: 'Совет', text: 'Куда ступить, чтоб сердце снова запело?', accept: ['home'] },
    ],
    hand: ['ship', 'gate', 'thread', 'home', 'star', 'well', 'fire', 'letter'],
    rewards: [{ type: 'coins', amount: 460 }],
    intro: 'Моряк сошёл на берег — и потерял почву. Восемь карт, четыре позиции.',
  },
  {
    id: 'fate_11', world: 'fate', mechanic: 'fate', name: 'Пустая страница', difficulty: 4,
    guest: { name: 'Летописец', icon: '🪶', art: 'assets/fate/guest_scribe_web.jpg' },
    story: [
      { label: 'Что было', text: 'Всю жизнь записывал чужие свадьбы и пожары. Своя жизнь — на полях страниц.', accept: ['book'] },
      { label: 'Что есть', text: 'Кончились чернила — и я увидел себя со стороны: пустая страница.', accept: ['mirror'] },
      { label: 'Что гнетёт', text: 'Боюсь, моя история останется тайной без ответа, бездонной и тёмной.', accept: ['well'] },
      { label: 'Совет', text: 'С чего начать свою первую строку?', accept: ['key'] },
    ],
    hand: ['book', 'mirror', 'well', 'key', 'candle', 'bread', 'web', 'moon'],
    rewards: [{ type: 'coins', amount: 480 }],
    intro: 'Летописец из города пришёл за чернилами — а ушёл с раскладом о себе.',
  },
  {
    id: 'fate_12', world: 'fate', mechanic: 'fate', name: 'Расклад для Хранителя', difficulty: 5,
    guest: { name: 'Кот-хранитель', icon: '🐈', art: 'assets/fate/guest_cat_web.jpg' },
    story: [
      { label: 'Что было', text: 'Когда-то я был просто котом на печи. А потом лавка позвала — и я пришёл.', accept: ['bell'] },
      { label: 'Что есть', text: 'Теперь я хранитель: все страницы и гости — моё стадо, мой очаг.', accept: ['home'] },
      { label: 'Что гнетёт', text: 'Иногда ночью мурлычу и боюсь: а вдруг всё это мне только снится?', accept: ['moon'] },
      { label: 'Совет', text: 'Кем быть завтра — сторожем суровым иль котом мечтательным?', accept: ['star'] },
    ],
    hand: ['bell', 'home', 'moon', 'star', 'mirror', 'web', 'coin', 'fire', 'rain'],
    rewards: [{ type: 'coins', amount: 510 }, { type: 'seals', amount: 2 }],
    intro: 'Финальный расклад — для самого кота-хранителя. Девять карт на столе.',
  },
];

export const FATE_PUZZLE_BY_ID = Object.fromEntries(FATE_PUZZLES.map((p) => [p.id, p]));
