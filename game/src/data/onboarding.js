// Первая игровая дуга: шаги, русские тексты и маршруты для спокойного проводника.
export const ONBOARDING_VERSION = 1;
export const ONBOARDING_BATTLE_SEED = 1;

export const ONBOARDING_BRANCHES = [
  {
    id: 'tw_01', name: 'Первая полка', icon: '🧺',
    route: { name: 'puzzle', params: { id: 'tw_01' } },
  },
  {
    id: 'sk_md_01', name: 'Утренняя поляна', icon: '🔍',
    route: { name: 'puzzle', params: { id: 'sk_md_01' } },
  },
  {
    id: 'pp_01', name: 'Первая тропинка', icon: '🥾',
    route: { name: 'puzzle', params: { id: 'pp_01' } },
  },
];

export const ONBOARDING_STEPS = [
  {
    id: 'prolog', title: 'Лавка выбрала хозяина',
    goal: 'Послушай короткое приветствие духа и кота. Сразу после него начнётся первое дело.',
    cta: 'К прологу', route: { name: 'story', params: { prologOnly: true } },
  },
  {
    id: 'md_01', title: 'Первый свет',
    goal: 'Поверни зеркало в «Первом светлячке» и зажги фонарь.',
    cta: 'К первой загадке', route: { name: 'puzzle', params: { id: 'md_01' } },
    hintTitle: 'Один поворот',
    hint: 'Тапни зеркало на поле. Луч изменит направление, а фонарь зажжётся.',
    targets: { puzzle: '[data-puzzle-id="md_01"]' },
  },
  {
    id: 'md_02', title: 'Луч по новому пути',
    goal: 'Реши «Первое зеркало». Отмена, подсказка и сброс остаются доступны.',
    cta: 'К «Первому зеркалу»', route: { name: 'puzzle', params: { id: 'md_02' } },
    hintTitle: 'Свет идёт за зеркалом',
    hint: 'Здесь тоже достаточно повернуть зеркало. Если захочешь проверить луч сначала, возьми подсказку — она не мешает победе.',
    targets: { puzzle: '[data-puzzle-id="md_02"]' },
  },
  {
    id: 'branch', title: 'Одна забота на выбор',
    goal: 'Выбери и честно реши одну загадку: порядок на полке, поиск находок или лесную тропинку.',
    cta: 'Выбрать загадку', route: { name: 'puzzles', params: {} },
  },
  {
    id: 'bt_slimes', title: 'Первый поход',
    goal: 'Отправь рыцаря к «Луже у тропинки». Бой идёт сам, а добыча пригодится лавке.',
    cta: 'К первому походу', route: { name: 'battle', params: { id: 'bt_slimes' } },
    hintTitle: 'Смотри на дело рыцаря',
    hint: 'Нажми «В бой!». Расстановку можно менять, но для первого выхода она уже подходит.',
    targets: {
      battles: '[data-battle-id="bt_slimes"]',
      battle: '[data-battle-start="bt_slimes"]',
    },
  },
  {
    id: 'square', title: 'Добыче — дело',
    goal: 'Вернулись монеты и слизь. Из лавки выйди на площадь: дальше найдём снаряжение.',
    cta: 'На площадь', route: { name: 'hub', params: { scene: 'square' } },
    hintTitle: 'За дверью — город',
    hint: 'Нажми «На площадь». Можно отойти и исследовать лавку: дуга подождёт на этом шаге.',
    targets: { hub: '[data-hotspot="@square"]' },
  },
  {
    id: 'market', title: 'Торговый квартал',
    goal: 'С площади пройди в торговый квартал — там работают бронник, маг и алхимик.',
    cta: 'В торговый квартал', route: { name: 'hub', params: { scene: 'market' } },
    hintTitle: 'Лавки рядом',
    hint: 'Открой торговый квартал на сцене площади.',
    targets: { hub: '[data-hotspot="@market"]' },
  },
  {
    id: 'boots', title: 'Сапоги для дороги',
    goal: 'Купи и надень «Сапоги тропинок» у бронника. Если они легли в сундук, надень их в комнате рыцаря.',
    cta: 'К броннику', earnCta: 'Заработать на сапоги', route: { name: 'shopArmorer', params: {} },
    hintTitle: 'Первая покупка с целью',
    hint: 'Купи именно «Сапоги тропинок». Свободный слот надевает вещь сразу; повторная покупка не нужна.',
    targets: {
      shopArmorer: '[data-item-id="bt_path"]',
      equip: '[data-equip-slot="boots"]',
    },
  },
  {
    id: 'bees_attempt', title: 'Проверка у пчелиного дерева',
    goal: 'Сходи к «Пчелиному дереву». Победа сразу засчитывается, а первая учебная неудача сохранит пояс.',
    cta: 'К пчёлам', route: { name: 'battle', params: { id: 'bt_bees' } },
    hintTitle: 'Проверка без потерь',
    hint: 'Запускай настоящий бой. Если он не получится с первого раза, зелья на поясе останутся для усиления.',
    targets: { battle: '[data-battle-start="bt_bees"]' },
  },
  {
    id: 'upgrade', title: 'Забота перед новой попыткой',
    goal: 'Надень «Кольцо здоровья» и заполни оба кармашка пояса. Второе зелье уже лежит в сундуке.',
    cta: 'Усилить рыцаря', earnCta: 'Заработать на усиление', route: { name: 'shopMagic', params: {} },
    hintTitle: 'Кольцо и запасное зелье',
    hint: 'Кольцо надевается в свободный слот сразу после покупки. Затем положи зелье из сундука во второй кармашек пояса.',
    targets: {
      shopMagic: '[data-item-id="rng_health"]',
      equip: '[data-equip-slot="ring1"]',
      shopAlchemy: '[data-item-id="pot_heal"]',
    },
  },
  {
    id: 'bees_victory', title: 'Назад к пчёлам',
    goal: 'С кольцом и заполненным поясом снова отправься к «Пчелиному дереву» и победи.',
    cta: 'Новая попытка', route: { name: 'battle', params: { id: 'bt_bees' } },
    hintTitle: 'Теперь ты готов',
    hint: 'Запускай обычный бой: выпитые зелья теперь расходуются как всегда, но их заменит крафт после победы.',
    targets: { battle: '[data-battle-start="bt_bees"]' },
  },
  {
    id: 'craft', title: 'Собственное зелье',
    goal: 'На площади свари два зелья лечения: после побед хватит слизи и мёда.',
    cta: 'К кузнице и котлу', gatherCta: 'Собрать материалы', route: { name: 'craft', params: {} },
    hintTitle: 'Материалы становятся делом',
    hint: 'Нажми «Сделать» у рецепта двух зелий лечения. Это настоящий крафт: слизь и мёд спишутся со склада.',
    targets: { craft: '[data-recipe-id="rcp_pot_heal"]' },
  },
  {
    id: 'done', title: 'Лавка снова жива',
    goal: 'Первые дела сделаны. Теперь выбирай свой путь: загадки, история или походы — без обязательного порядка.',
    cta: '', route: null,
  },
];

export const ONBOARDING_STEP_BY_ID = Object.fromEntries(
  ONBOARDING_STEPS.map((step) => [step.id, step]),
);

export const ONBOARDING_FINAL_ROUTES = [
  { id: 'puzzles', icon: '🧩', label: 'К загадкам', route: { name: 'puzzles', params: {} } },
  { id: 'story', icon: '📖', label: 'К истории', route: { name: 'story', params: {} } },
  { id: 'battles', icon: '⚔️', label: 'К походам', route: { name: 'battles', params: {} } },
];

export const ONBOARDING_EARN_ROUTE = { name: 'puzzles', params: {} };

// Необязательный обзор остальных разделов после первой дуги, без новых обязательных дел.
export const ONBOARDING_GUIDE_SECTIONS = [
  {
    id: 'tavern', title: 'Таверна и конюшня',
    short: 'Здесь живут спутники, питомцы и наёмники. Можно просто познакомиться с отрядом.',
    route: { name: 'tavern', params: {} },
  },
  {
    id: 'cabinet', title: 'Кабинет трофеев',
    short: 'Ниши для будущих находок уже ждут. Не нужно получать трофей, чтобы осмотреть комнату.',
    route: { name: 'hub', params: { scene: 'cabinet' } },
  },
  {
    id: 'guests', title: 'Гостевая книга',
    short: 'Портреты знакомых и спокойные разговоры о маленьких историях лавки.',
    route: { name: 'guests', params: {} },
  },
  {
    id: 'achievements', title: 'Книга рекордов',
    short: 'Здесь отмечаются дела, которые уже получились, и те, что ждут впереди.',
    route: { name: 'achievements', params: {} },
  },
  {
    id: 'deck', title: 'Колода судьбы',
    short: 'Карты открываются по мере раскладов. Полистай колоду в своём темпе.',
    route: { name: 'deck', params: {} },
  },
  {
    id: 'board', title: 'Доска объявлений',
    short: 'Розыскные листы для будущих походов. Осмотра достаточно, брать задание необязательно.',
    route: { name: 'board', params: {} },
  },
  {
    id: 'workshop', title: 'Мастерская',
    short: 'Редактор и конструктор для собственных идей, когда захочется экспериментов.',
    route: { name: 'workshop', params: {} },
  },
  {
    id: 'shop', title: 'Прилавок лавки',
    short: 'Украшения и скупка находок. Можно просто осмотреться, ничего не покупая.',
    route: { name: 'shop', params: {} },
  },
];
