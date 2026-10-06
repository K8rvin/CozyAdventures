// Боевые столкновения мира «Тихая опушка»: 5 обычных + босс.
// unlock: индекс предыдущего боя, который надо пройти.
export const BATTLES = [
  {
    id: 'bt_slimes', name: 'Лужа у тропинки', world: 'meadow',
    enemies: ['slime_meadow', 'slime_meadow'],
    unlockAfter: null,
    tip: 'Первый выход рыцаря. Слизни слабо ядовиты.',
  },
  {
    id: 'bt_bees', name: 'Пчелиное дерево', world: 'meadow',
    enemies: ['bee_wild', 'bee_wild', 'bee_wild'],
    unlockAfter: 'bt_slimes',
    tip: 'Пчёлы быстры и жалят ядом. Помогут перчатки травницы.',
  },
  {
    id: 'bt_moths', name: 'Поляна мотыльков', world: 'meadow',
    enemies: ['moth_night', 'moth_night', 'slime_meadow'],
    unlockAfter: 'bt_bees',
    tip: 'Пыльца мотыльков усыпляет. Шлем сонного барсука или зелье бодрости.',
  },
  {
    id: 'bt_spirits', name: 'Заросшая тропа', world: 'meadow',
    enemies: ['spirit_forest', 'spirit_forest'],
    unlockAfter: 'bt_moths',
    tip: 'Духи замедляют спорами. Лук и топор бьют по ним больнее.',
  },
  {
    id: 'bt_golem', name: 'Мшистый страж', world: 'meadow',
    enemies: ['golem_moss', 'slime_meadow'],
    unlockAfter: 'bt_spirits',
    tip: 'У голема толстая шкура. Нужен урон потяжелее.',
  },
  {
    id: 'bt_boss_willow', name: 'Старая ива', world: 'meadow',
    enemies: ['boss_willow'],
    unlockAfter: 'bt_golem',
    tip: 'Хранитель ивы — испытание всего, чему ты научился.',
  },
];

// --- Мир 2: Средневековый дворик (открывается после Хранителя ивы) ---
BATTLES.push(
  {
    id: 'bt_rats', name: 'Крысиный переулок', world: 'town',
    enemies: ['rat_thief', 'rat_thief', 'rat_thief'],
    unlockAfter: 'bt_boss_willow',
    tip: 'Крысы шустрые и ядовитые. Скорость и антидот решают.',
  },
  {
    id: 'bt_bandits', name: 'Застава у склада', world: 'town',
    enemies: ['bandit', 'rat_thief', 'bandit'],
    unlockAfter: 'bt_rats',
    tip: 'Разбойники бьют сильно. Хорошая броня и щит — как никогда кстати.',
  },
  {
    id: 'bt_wander_golem', name: 'Бродячая кладка', world: 'town',
    enemies: ['golem_wander', 'rat_thief'],
    unlockAfter: 'bt_bandits',
    tip: 'У голема каменная шкура — берите тяжёлое оружие.',
  },
  {
    id: 'bt_ghost_watch', name: 'Ночной обход', world: 'town',
    enemies: ['ghost_guard', 'ghost_guard'],
    unlockAfter: 'bt_wander_golem',
    tip: 'Призраки наводят страх. Лук и топор бьют по духам больнее.',
  },
  {
    id: 'bt_town_mix', name: 'Суматоха на рынке', world: 'town',
    enemies: ['bandit', 'ghost_guard', 'rat_thief'],
    unlockAfter: 'bt_ghost_watch',
    tip: 'Смешанная стая: яд, страх и тяжёлые удары. Готовься как следует.',
  },
  {
    id: 'bt_boss_captain', name: 'Старый капитан', world: 'town',
    enemies: ['boss_captain'],
    unlockAfter: 'bt_town_mix',
    tip: 'Капитан стражи не отдыхает веками. Покажи ему, что лавка под защитой.',
  },
);

// --- Мир 3: Книжный чердак (открывается после Старого капитана) ---
BATTLES.push(
  {
    id: 'bk_blots', name: 'Пролитые чернила', world: 'attic',
    enemies: ['ink_blot', 'ink_blot'],
    unlockAfter: 'bt_boss_captain',
    tip: 'Кляксы травят и замедляют. Амулет противоядия пригодится.',
  },
  {
    id: 'bk_moths', name: 'Моль в фолианте', world: 'attic',
    enemies: ['book_moth', 'book_moth', 'ink_blot'],
    unlockAfter: 'bk_blots',
    tip: 'Книжная моль усыпляет, как и её лесные сёстры. Шлем барсука всё ещё в цене.',
  },
  {
    id: 'bk_spirits', name: 'Шорохи страниц', world: 'attic',
    enemies: ['paper_spirit', 'paper_spirit'],
    unlockAfter: 'bk_moths',
    tip: 'Бумажные духи наводят страх. Амулет отваги или топор дровосека.',
  },
  {
    id: 'bk_illustration', name: 'Витражная гравюра', world: 'attic',
    enemies: ['illustration', 'book_moth'],
    unlockAfter: 'bk_spirits',
    tip: 'Ожившая иллюстрация толстокожа. Пробивай тяжёлым оружием.',
  },
  {
    id: 'bk_storm', name: 'Буря в библиотеке', world: 'attic',
    enemies: ['paper_spirit', 'ink_blot', 'book_moth'],
    unlockAfter: 'bk_illustration',
    tip: 'Все обитатели чердака разом. Проверь сопротивления и зелья.',
  },
  {
    id: 'bk_boss_keeper', name: 'Последняя страница', world: 'attic',
    enemies: ['boss_keeper'],
    unlockAfter: 'bk_storm',
    tip: 'Хранитель не отдаст страницу без боя. Собери всё лучшее, что у тебя есть.',
  },
);

export const BATTLE_BY_ID = Object.fromEntries(BATTLES.map((b) => [b.id, b]));
