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
    id: 'bt_fireflies', name: 'Россыпь светлячков', world: 'meadow',
    enemies: ['moth_night', 'bee_wild', 'moth_night', 'bee_wild'],
    unlockAfter: 'bt_golem',
    tip: 'Рой мотыльков и пчёл: сон и яд вместе. Шлем барсука и перчатки травницы.',
  },
  {
    id: 'bt_overgrowth', name: 'Грибная завалинка', world: 'meadow',
    enemies: ['golem_moss', 'spirit_forest', 'spirit_forest'],
    unlockAfter: 'bt_fireflies',
    tip: 'Голем и два духа. Замедление опасно — берите скорость.',
  },
  {
    id: 'bt_hunt_trail', name: 'Охотничья тропа', world: 'meadow',
    enemies: ['bee_wild', 'spirit_forest', 'moth_night', 'slime_meadow'],
    unlockAfter: 'bt_overgrowth',
    tip: 'Вся опушка разом. Проверка перед Старой ивой.',
  },
  {
    id: 'bt_boss_willow', name: 'Старая ива', world: 'meadow',
    enemies: ['boss_willow'],
    unlockAfter: 'bt_hunt_trail',
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
    id: 'bt_watchtower', name: 'Сторожевая башня', world: 'town',
    enemies: ['ghost_guard', 'ghost_guard', 'bandit'],
    unlockAfter: 'bt_town_mix',
    tip: 'Призраки и их живой сообщник. Страх давить амулетом отваги.',
  },
  {
    id: 'bt_cellar', name: 'Подвальные крысы', world: 'town',
    enemies: ['rat_thief', 'rat_thief', 'rat_thief', 'rat_thief'],
    unlockAfter: 'bt_watchtower',
    tip: 'Четверо шустрых ядовитых. Амулет противоядия и рассечение.',
  },
  {
    id: 'bt_tourney', name: 'Турнирная площадь', world: 'town',
    enemies: ['golem_wander', 'bandit', 'bandit'],
    unlockAfter: 'bt_cellar',
    tip: 'Каменная стена и два клинка за ней. Пробивай тяжёлым.',
  },
  {
    id: 'bt_boss_captain', name: 'Старый капитан', world: 'town',
    enemies: ['boss_captain'],
    unlockAfter: 'bt_tourney',
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
    id: 'bt_reading', name: 'Читальный зал', world: 'attic',
    enemies: ['book_moth', 'paper_spirit', 'book_moth'],
    unlockAfter: 'bk_storm',
    tip: 'Моль и дух среди фолиантов. Сон и страх — контролируй оба.',
  },
  {
    id: 'bt_archive', name: 'Пыльный архив', world: 'attic',
    enemies: ['illustration', 'ink_blot', 'ink_blot'],
    unlockAfter: 'bt_reading',
    tip: 'Гравюра и чернила. Яд замедляет — держи отвар наготове.',
  },
  {
    id: 'bt_inkwell', name: 'Чернильный колодец', world: 'attic',
    enemies: ['ink_blot', 'paper_spirit', 'ink_blot', 'paper_spirit'],
    unlockAfter: 'bt_archive',
    tip: 'Четверо обитателей чердака разом. Последняя проверка перед Хранителем.',
  },
  {
    id: 'bk_boss_keeper', name: 'Последняя страница', world: 'attic',
    enemies: ['boss_keeper'],
    unlockAfter: 'bt_inkwell',
    tip: 'Хранитель не отдаст страницу без боя. Собери всё лучшее, что у тебя есть.',
  },
);

// --- Экспедиции перекрёстка (после Последней страницы, сложность растёт) ---
// scale умножает здоровье, атаку и броню врагов.
BATTLES.push(
  {
    id: 'ex_01', name: 'Перекрёстная тропа', world: 'crossroads',
    enemies: [
      { id: 'slime_meadow', scale: 1.1 }, { id: 'bandit', scale: 1.1 }, { id: 'ink_blot', scale: 1.1 },
    ],
    unlockAfter: 'bk_boss_keeper',
    tip: 'Миры смешались. Слизни, разбойники и чернила в одном бою.',
  },
  {
    id: 'ex_02', name: 'Смешанный патруль', world: 'crossroads',
    enemies: [
      { id: 'rat_thief', scale: 1.15 }, { id: 'rat_thief', scale: 1.15 }, { id: 'book_moth', scale: 1.15 },
    ],
    unlockAfter: 'ex_01',
    tip: 'Быстрые и ядовитые, а моль усыпляет. Держи зелья наготове.',
  },
  {
    id: 'ex_03', name: 'Духи перекрёстка', world: 'crossroads',
    enemies: [
      { id: 'paper_spirit', scale: 1.2 }, { id: 'ghost_guard', scale: 1.2 },
    ],
    unlockAfter: 'ex_02',
    tip: 'Двое духов со страхом. Амулет отваги или топор дровосека.',
  },
  {
    id: 'ex_04', name: 'Каменный караван', world: 'crossroads',
    enemies: [
      { id: 'golem_wander', scale: 1.25 }, { id: 'golem_moss', scale: 1.25 },
    ],
    unlockAfter: 'ex_03',
    tip: 'Две каменные стены. Нужен серьёзный урон или пробитие.',
  },
  {
    id: 'ex_05', name: 'Ядовитый туман', world: 'crossroads',
    enemies: [
      { id: 'ink_blot', scale: 1.3 }, { id: 'bee_wild', scale: 1.3 }, { id: 'rat_thief', scale: 1.3 },
    ],
    unlockAfter: 'ex_04',
    tip: 'Яд со всех сторон. Амулет противоядия — обязательно.',
  },
  {
    id: 'ex_06', name: 'Ночная стража', world: 'crossroads',
    enemies: [
      { id: 'ghost_guard', scale: 1.3 }, { id: 'ghost_guard', scale: 1.3 }, { id: 'moth_night', scale: 1.3 },
    ],
    unlockAfter: 'ex_05',
    tip: 'Страх и сон в одном флаконе. Шлем барсука снова в деле.',
  },
  {
    id: 'ex_07', name: 'Библиотечная осада', world: 'crossroads',
    enemies: [
      { id: 'illustration', scale: 1.35 }, { id: 'paper_spirit', scale: 1.35 }, { id: 'paper_spirit', scale: 1.35 },
    ],
    unlockAfter: 'ex_06',
    tip: 'Толстая гравюра и два духа. Прорывайся к ней сквозь строй.',
  },
  {
    id: 'ex_08', name: 'Хаос перекрёстка', world: 'crossroads',
    enemies: [
      { id: 'golem_wander', scale: 1.4 }, { id: 'ink_blot', scale: 1.4 }, { id: 'book_moth', scale: 1.4 },
    ],
    unlockAfter: 'ex_07',
    tip: 'Всё и сразу: стена, яд и сон. Последняя проверка перед Стражем.',
  },
  {
    id: 'ex_boss', name: 'Звёздный страж', world: 'crossroads',
    enemies: [{ id: 'boss_star_guardian', scale: 1 }],
    unlockAfter: 'ex_08',
    tip: 'Он горит звёздным огнём. Сопротивление огню не помешает.',
  },
);

// Контентпаки миров (src/data/worlds/*.js)
import { WORLDS } from './worlds/index.js';
for (const w of WORLDS) {
  if (w?.battles) BATTLES.push(...w.battles);
}

// Розыскные листы (показываются на доске объявлений, не в списке походов)
import { WANTED_BATTLES } from './wanted.js';
BATTLES.push(...WANTED_BATTLES);

export const BATTLE_BY_ID = Object.fromEntries(BATTLES.map((b) => [b.id, b]));
