// Спутники, питомцы и наёмники — всё как данные (раздел 12 документа).
// Спутники: до 3 в отряде, пассивные бонусы и малые авто-эффекты.
// Питомец: 1 слот, тип «бегущий рядом».
// Наёмники: до 2 в бою как полноценные союзники.

export const COMPANIONS = [
  {
    id: 'cmp_firefly', name: 'Светлячок', icon: '✨',
    price: 90, currency: 'coins',
    bonus: { itemFind: 0.1 },
    trait: 'firefly_hint',
    description: 'Подсвечивает подсказки и находит светящиеся мелочи.',
  },
  {
    id: 'cmp_herbalist', name: 'Травница', icon: '🌿',
    price: 140, currency: 'coins',
    bonus: {},
    trait: 'regen_ally',
    description: 'В бою тихо подлечивает рыцаря травяным отваром.',
  },
  {
    id: 'cmp_cat', name: 'Кот-хранитель', icon: '🐈',
    price: 110, currency: 'coins',
    bonus: { goldFind: 0.1, dodge: 0.02 },
    trait: null,
    description: 'Повышает удачу и иногда находит монеты.',
  },
  {
    id: 'cmp_smith', name: 'Кузнец-подмастерье', icon: '⚒️',
    price: 2, currency: 'seals',
    bonus: { armor: 6 },
    trait: null,
    description: 'Подправляет броню прямо в походе.',
  },
];

export const PETS = [
  {
    id: 'pet_puppy', name: 'Щенок', icon: '🐕',
    price: 160, currency: 'coins',
    bonus: { goldFind: 0.15 },
    description: 'Бежит рядом и собирает монеты после боя.',
  },
  {
    id: 'pet_hedgehog', name: 'Ёжик', icon: '🦔',
    price: 190, currency: 'coins',
    bonus: { itemFind: 0.12 },
    description: 'Находит мелкие предметы в траве.',
  },
  {
    id: 'pet_fox', name: 'Лисёнок', icon: '🦊',
    price: 5, currency: 'seals',
    bonus: { crit: 0.04, goldFind: 0.05 },
    description: 'Хитрый взгляд помогает находить слабые места врагов.',
  },
];

// Наёмники — полноценные союзные юниты в бою (до 2).
// skills переиспользуют таблицу навыков из battle.js + aimed_shot.
export const MERCENARIES = [
  {
    id: 'merc_archer', name: 'Лесная лучница', icon: '🏹', race: 'эльф', role: 'стрелок',
    price: 240, currency: 'coins',
    hp: 40, attack: 14, armor: 4, speed: 12, crit: 0.12, dodge: 0.08,
    skills: ['aimed_shot'], tags: ['forest', 'ranged'],
    description: 'Бьёт самого хрупкого врага прицельным выстрелом.',
  },
  {
    id: 'merc_guard', name: 'Дворовый громила', icon: '🔨', race: 'человек', role: 'танк',
    price: 300, currency: 'coins',
    hp: 85, attack: 9, armor: 16, speed: 6, crit: 0.03, dodge: 0, block: 0.2,
    skills: [], tags: ['town'],
    description: 'Держит удар, пока рыцарь работает.',
  },
  {
    id: 'merc_witch', name: 'Ведьминка с топей', icon: '🧪', race: 'человек', role: 'поддержка',
    price: 400, currency: 'coins',
    hp: 45, attack: 8, armor: 5, speed: 9, crit: 0.05, dodge: 0.05,
    skills: ['sting_poison', 'regen_ally_skill'], tags: ['swamp'],
    description: 'Травит врагов и подливает рыцарю живительный настой.',
  },
  {
    id: 'merc_knight_errant', name: 'Странствующий клинок', icon: '⚔️', race: 'человек', role: 'боец',
    price: 6, currency: 'seals',
    hp: 70, attack: 16, armor: 12, speed: 10, crit: 0.1, dodge: 0.05, block: 0.1,
    skills: ['heavy_blow'], tags: ['town'],
    description: 'Ищет лавку на перекрёстке миров. Кажется, нашёл.',
  },
];

// Ездовые и летающие питомцы (миры 2–3)
PETS.push(
  {
    id: 'pet_horse', name: 'Сивка', icon: '🐴', kind: 'riding',
    price: 450, currency: 'coins',
    bonus: { speed: 2, materialsFind: 0.5 },
    description: 'Ездовой: быстрее дороги, больше материалов после боя.',
  },
  {
    id: 'pet_owl', name: 'Сова-библиотекарь', icon: '🦉', kind: 'flying',
    price: 6, currency: 'seals',
    bonus: { dodge: 0.05, crit: 0.03 },
    description: 'Летающий помощник: видит слабые места и снижает шанс засады.',
  },
);

export const COMPANION_BY_ID = Object.fromEntries(COMPANIONS.map((c) => [c.id, c]));
export const PET_BY_ID = Object.fromEntries(PETS.map((p) => [p.id, p]));
export const MERC_BY_ID = Object.fromEntries(MERCENARIES.map((m) => [m.id, m]));
