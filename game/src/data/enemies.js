// Враги мира «Тихая опушка».
// skills: базовая атака есть у всех; skills добавляют эффекты.
//  - pollen_sleep: шанс усыпить цель
//  - sting_poison: шанс отравить
//  - heavy_blow: раз в N ходов сильный удар
//  - spit_fire: урон огнём (сопротивление fire)
// elem: стихия урона базовой атаки ('phys' | 'fire' | 'poison')

export const ENEMIES = [
  {
    id: 'slime_meadow', name: 'Лужайный слизень', icon: '🟢',
    hp: 30, attack: 5, armor: 4, speed: 6, crit: 0.02, dodge: 0.02,
    elem: 'phys', skills: ['sting_poison_weak'],
    reward: { coins: [12, 20], materials: ['slime_jelly'] },
  },
  {
    id: 'bee_wild', name: 'Дикая пчела', icon: '🐝',
    hp: 22, attack: 7, armor: 2, speed: 14, crit: 0.08, dodge: 0.1,
    elem: 'phys', skills: ['sting_poison'],
    reward: { coins: [15, 25], materials: ['honey'] },
  },
  {
    id: 'spirit_forest', name: 'Лесной дух', icon: '🌿',
    hp: 38, attack: 8, armor: 6, speed: 9, crit: 0.05, dodge: 0.08,
    elem: 'phys', skills: ['slow_spores'], tags: ['spirit'],
    reward: { coins: [20, 32], materials: ['glow_moss'] },
  },
  {
    id: 'moth_night', name: 'Ночной мотылёк', icon: '🦋',
    hp: 26, attack: 6, armor: 3, speed: 11, crit: 0.04, dodge: 0.12,
    elem: 'phys', skills: ['pollen_sleep'],
    reward: { coins: [18, 28], materials: ['moth_dust'] },
  },
  {
    id: 'golem_moss', name: 'Мшистый голем', icon: '🗿',
    hp: 90, attack: 14, armor: 18, speed: 5, crit: 0.02, dodge: 0,
    elem: 'phys', skills: ['heavy_blow'],
    reward: { coins: [35, 50], materials: ['moss_stone'] },
  },
  // Босс мира
  {
    id: 'boss_willow', name: 'Хранитель старой ивы', icon: '🌳',
    hp: 160, attack: 15, armor: 14, speed: 7, crit: 0.06, dodge: 0.03,
    elem: 'phys', skills: ['heavy_blow', 'slow_spores', 'pollen_sleep'], boss: true,
    reward: { coins: [150, 200], seals: 1, materials: ['willow_heart'] },
  },
];

// --- Мир 2: Средневековый дворик ---
ENEMIES.push(
  {
    id: 'rat_thief', name: 'Крыса-воришка', icon: '🐀',
    hp: 45, attack: 11, armor: 6, speed: 13, crit: 0.1, dodge: 0.14,
    elem: 'phys', skills: ['sting_poison'],
    reward: { coins: [28, 40], materials: ['rat_tail'] },
  },
  {
    id: 'bandit', name: 'Дворовый разбойник', icon: '🗡️',
    hp: 65, attack: 14, armor: 10, speed: 10, crit: 0.08, dodge: 0.05,
    elem: 'phys', skills: ['heavy_blow'],
    reward: { coins: [35, 55], materials: ['torn_cloth'] },
  },
  {
    id: 'golem_wander', name: 'Бродячий голем', icon: '🧱',
    hp: 110, attack: 16, armor: 22, speed: 5, crit: 0.03, dodge: 0,
    elem: 'phys', skills: ['heavy_blow', 'slow_spores'],
    reward: { coins: [50, 70], materials: ['brick_chunk'] },
  },
  {
    id: 'ghost_guard', name: 'Призрак стражи', icon: '👻',
    hp: 70, attack: 15, armor: 8, speed: 11, crit: 0.07, dodge: 0.15,
    elem: 'phys', skills: ['fear_chill'], tags: ['spirit'],
    reward: { coins: [45, 65], materials: ['ectoplasm'] },
  },
  {
    id: 'boss_captain', name: 'Призрак капитана стражи', icon: '💀',
    hp: 240, attack: 20, armor: 18, speed: 9, crit: 0.1, dodge: 0.06,
    elem: 'phys', skills: ['heavy_blow', 'fear_chill', 'pollen_sleep'], boss: true, tags: ['spirit'],
    reward: { coins: [260, 340], seals: 2, materials: ['captain_badge'] },
  },
);

// --- Мир 3: Книжный чердак ---
ENEMIES.push(
  {
    id: 'ink_blot', name: 'Чернильная клякса', icon: '🫟',
    hp: 80, attack: 15, armor: 10, speed: 8, crit: 0.05, dodge: 0.04,
    elem: 'phys', skills: ['sting_poison', 'slow_spores'],
    reward: { coins: [55, 75], materials: ['ink_drop'] },
  },
  {
    id: 'paper_spirit', name: 'Бумажный дух', icon: '📄',
    hp: 75, attack: 17, armor: 8, speed: 12, crit: 0.08, dodge: 0.16,
    elem: 'phys', skills: ['fear_chill'], tags: ['spirit'],
    reward: { coins: [60, 85], materials: ['paper_scrap'] },
  },
  {
    id: 'book_moth', name: 'Книжная моль', icon: '🦋',
    hp: 60, attack: 13, armor: 6, speed: 14, crit: 0.06, dodge: 0.14,
    elem: 'phys', skills: ['pollen_sleep'],
    reward: { coins: [50, 70], materials: ['page_dust'] },
  },
  {
    id: 'illustration', name: 'Ожившая иллюстрация', icon: '🖼️',
    hp: 130, attack: 19, armor: 20, speed: 6, crit: 0.06, dodge: 0.02,
    elem: 'phys', skills: ['heavy_blow'],
    reward: { coins: [70, 95], materials: ['gold_leaf'] },
  },
  {
    id: 'boss_keeper', name: 'Хранитель последней страницы', icon: '📖',
    hp: 320, attack: 23, armor: 22, speed: 10, crit: 0.1, dodge: 0.08,
    elem: 'phys', skills: ['fear_chill', 'heavy_blow', 'pollen_sleep'], boss: true, tags: ['spirit'],
    reward: { coins: [380, 500], seals: 3, materials: ['last_page'] },
  },
);

export const ENEMY_BY_ID = Object.fromEntries(ENEMIES.map((e) => [e.id, e]));
