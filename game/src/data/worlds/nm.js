// Мир «Ночной рынок»: тёплая ночь, янтарные фонарики, духи торговли
// и ожившие маски. Открывается после босса экспедиций (ex_boss).
export const WORLD = {
  id: 'nm',
  label: '🌃 Ночной рынок',
  enemies: [
    {
      id: 'nm_moth', name: 'Янтарный мотылёк', icon: '🦋',
      hp: 80, attack: 15, armor: 8, speed: 14, crit: 0.06, dodge: 0.14,
      elem: 'phys', skills: ['pollen_sleep'],
      reward: { coins: [70, 95], materials: ['nm_moth_dust'] },
    },
    {
      id: 'nm_mask', name: 'Ожившая маска', icon: '🎭',
      hp: 95, attack: 18, armor: 10, speed: 11, crit: 0.07, dodge: 0.1,
      elem: 'phys', skills: ['fear_chill'], tags: ['spirit'],
      reward: { coins: [80, 110], materials: ['nm_mask_shard'] },
    },
    {
      id: 'nm_shadow', name: 'Прилавочная тень', icon: '🌒',
      hp: 105, attack: 18, armor: 10, speed: 10, crit: 0.08, dodge: 0.1,
      elem: 'phys', skills: ['sting_poison'], tags: ['spirit'],
      reward: { coins: [90, 120], materials: ['nm_shadow_ash'] },
    },
    {
      id: 'nm_lantern', name: 'Дух фонаря', icon: '🏮',
      hp: 90, attack: 19, armor: 10, speed: 9, crit: 0.06, dodge: 0.06,
      elem: 'fire', skills: ['spit_fire'], tags: ['spirit'],
      reward: { coins: [85, 115], materials: ['nm_ember_oil'] },
    },
    {
      id: 'nm_garland', name: 'Гирляндный змей', icon: '✨',
      hp: 120, attack: 17, armor: 16, speed: 8, crit: 0.04, dodge: 0.04,
      elem: 'phys', skills: ['slow_spores', 'regen_ally_skill'], tags: ['spirit'],
      reward: { coins: [95, 130], materials: ['nm_moth_dust'] },
    },
    {
      id: 'nm_teller', name: 'Торговец-сказитель', icon: '🗣️',
      hp: 140, attack: 22, armor: 18, speed: 7, crit: 0.05, dodge: 0.03,
      elem: 'phys', skills: ['heavy_blow', 'regen_ally_skill'],
      reward: { coins: [110, 150], materials: ['nm_shadow_ash'] },
    },
    // Босс мира
    {
      id: 'nm_boss_keeper', name: 'Хозяин ночного рынка', icon: '🎪',
      hp: 400, attack: 28, armor: 26, speed: 10, crit: 0.08, dodge: 0.05,
      elem: 'fire', skills: ['heavy_blow', 'fear_chill', 'spit_fire'], boss: true, tags: ['spirit'],
      reward: { coins: [700, 950], seals: 5, materials: ['nm_market_crown'] },
    },
  ],
  materials: [
    {
      id: 'nm_moth_dust', name: 'Пыльца янтарного мотылька', icon: '🌟',
      description: 'Мерцает в темноте тёплым янтарным светом.',
    },
    {
      id: 'nm_mask_shard', name: 'Осколок ожившей маски', icon: '🎭',
      description: 'На гладком лаке застыла чужая улыбка.',
    },
    {
      id: 'nm_shadow_ash', name: 'Пепел прилавочной тени', icon: '🌑',
      description: 'Лёгкий пепел, который прячется от света.',
    },
    {
      id: 'nm_ember_oil', name: 'Масло духов фонарей', icon: '🏮',
      description: 'Горит без дыма и не гаснет под дождём.',
    },
    {
      id: 'nm_market_crown', name: 'Корона хозяина рынка', icon: '👑',
      description: 'Знак власти над всеми лавками ночного рынка.',
    },
  ],
  battles: [
    {
      id: 'nm_01', name: 'Первый фонарь', world: 'nm',
      enemies: [{ id: 'nm_moth', scale: 1.5 }],
      unlockAfter: 'ex_boss',
      tip: 'Одинокий мотылёк усыпляет. Быстрый удар — и путь открыт.',
    },
    {
      id: 'nm_02', name: 'Ряд с масками', world: 'nm',
      enemies: [{ id: 'nm_mask', scale: 1.52 }],
      unlockAfter: 'nm_01',
      tip: 'Маска нагоняет страх. Амулет отваги решит всё.',
    },
    {
      id: 'nm_03', name: 'Тени под прилавком', world: 'nm',
      enemies: [{ id: 'nm_shadow', scale: 1.53 }, { id: 'nm_moth', scale: 1.53 }],
      unlockAfter: 'nm_02',
      tip: 'Яд и сон в паре. Сначала выбей мотылька.',
    },
    {
      id: 'nm_04', name: 'Гирлянды оживают', world: 'nm',
      enemies: [{ id: 'nm_garland', scale: 1.55 }, { id: 'nm_moth', scale: 1.54 }],
      unlockAfter: 'nm_03',
      tip: 'Змей лечит себя и замедляет. Бей его первым.',
    },
    {
      id: 'nm_05', name: 'Жар масляных ламп', world: 'nm',
      enemies: [{ id: 'nm_lantern', scale: 1.56 }, { id: 'nm_lantern', scale: 1.55 }],
      unlockAfter: 'nm_04',
      tip: 'Два духа огня. Сопротивление огню спасёт от ожогов.',
    },
    {
      id: 'nm_06', name: 'Сказители у жаровни', world: 'nm',
      enemies: [{ id: 'nm_teller', scale: 1.57 }, { id: 'nm_garland', scale: 1.56 }],
      unlockAfter: 'nm_05',
      tip: 'Сказитель бьёт тяжело, змей его лечит. Не тяни бой.',
    },
    {
      id: 'nm_07', name: 'Маски смеются в темноте', world: 'nm',
      enemies: [{ id: 'nm_mask', scale: 1.58 }, { id: 'nm_mask', scale: 1.58 }, { id: 'nm_moth', scale: 1.58 }],
      unlockAfter: 'nm_06',
      tip: 'Страх с двух сторон и сон. Шлем барсука снова в деле.',
    },
    {
      id: 'nm_08', name: 'Ядовитый туман ароматов', world: 'nm',
      enemies: [{ id: 'nm_shadow', scale: 1.6 }, { id: 'nm_lantern', scale: 1.59 }, { id: 'nm_garland', scale: 1.59 }],
      unlockAfter: 'nm_07',
      tip: 'Яд, огонь и лечащий змей. Сначала выбей змея.',
    },
    {
      id: 'nm_09', name: 'Танец фонарей', world: 'nm',
      enemies: [{ id: 'nm_lantern', scale: 1.62 }, { id: 'nm_mask', scale: 1.61 }, { id: 'nm_moth', scale: 1.61 }],
      unlockAfter: 'nm_08',
      tip: 'Огонь, страх и сон разом. Держи зелья наготове.',
    },
    {
      id: 'nm_10', name: 'Ночной аукцион', world: 'nm',
      enemies: [{ id: 'nm_teller', scale: 1.63 }, { id: 'nm_shadow', scale: 1.62 }],
      unlockAfter: 'nm_09',
      tip: 'Тяжёлый удар и яд. Глуши сказителя первым.',
    },
    {
      id: 'nm_11', name: 'Рой у ламп', world: 'nm',
      enemies: [{ id: 'nm_moth', scale: 1.64 }, { id: 'nm_moth', scale: 1.64 }, { id: 'nm_moth', scale: 1.64 }],
      unlockAfter: 'nm_10',
      tip: 'Трое усыпляющих мотыльков. Защита от сна решает бой.',
    },
    {
      id: 'nm_12', name: 'Теневой ряд', world: 'nm',
      enemies: [{ id: 'nm_shadow', scale: 1.66 }, { id: 'nm_mask', scale: 1.65 }, { id: 'nm_moth', scale: 1.64 }],
      unlockAfter: 'nm_11',
      tip: 'Яд, страх и сон. Противоядие и шлем барсука.',
    },
    {
      id: 'nm_13', name: 'Масляный пожар', world: 'nm',
      enemies: [{ id: 'nm_lantern', scale: 1.67 }, { id: 'nm_lantern', scale: 1.66 }, { id: 'nm_garland', scale: 1.66 }],
      unlockAfter: 'nm_12',
      tip: 'Огонь и лечащий змей. Сначала змей, потом фонари.',
    },
    {
      id: 'nm_14', name: 'Бал масок', world: 'nm',
      enemies: [{ id: 'nm_mask', scale: 1.68 }, { id: 'nm_mask', scale: 1.68 }, { id: 'nm_mask', scale: 1.68 }],
      unlockAfter: 'nm_13',
      tip: 'Тройной страх. Без амулета отваги отряд дрогнет.',
    },
    {
      id: 'nm_15', name: 'Гирляндный коридор', world: 'nm',
      enemies: [{ id: 'nm_garland', scale: 1.7 }, { id: 'nm_garland', scale: 1.69 }, { id: 'nm_teller', scale: 1.69 }],
      unlockAfter: 'nm_14',
      tip: 'Два лекаря и тяжёлый кулак. Пробивай строй быстро.',
    },
    {
      id: 'nm_16', name: 'Тени скупают свет', world: 'nm',
      enemies: [{ id: 'nm_shadow', scale: 1.71 }, { id: 'nm_lantern', scale: 1.7 }, { id: 'nm_moth', scale: 1.7 }],
      unlockAfter: 'nm_15',
      tip: 'Яд, огонь и сон. Противоядие важнее огнеупора.',
    },
    {
      id: 'nm_17', name: 'Сказки после полуночи', world: 'nm',
      enemies: [{ id: 'nm_teller', scale: 1.7 }, { id: 'nm_teller', scale: 1.7 }, { id: 'nm_moth', scale: 1.7 }],
      unlockAfter: 'nm_16',
      tip: 'Два сказителя лечат друг друга. Бей одного до конца.',
    },
    {
      id: 'nm_18', name: 'Янтарная буря', world: 'nm',
      enemies: [{ id: 'nm_lantern', scale: 1.73 }, { id: 'nm_lantern', scale: 1.73 }, { id: 'nm_mask', scale: 1.72 }],
      unlockAfter: 'nm_17',
      tip: 'Стена огня и страх. Огнеупорная броня — лучший друг.',
    },
    {
      id: 'nm_19', name: 'Последний прилавок', world: 'nm',
      enemies: [{ id: 'nm_teller', scale: 1.74 }, { id: 'nm_garland', scale: 1.74 }, { id: 'nm_lantern', scale: 1.73 }],
      unlockAfter: 'nm_18',
      tip: 'Всё и сразу: кулак, лекарь и огонь. Последняя проверка.',
    },
    {
      id: 'nm_boss', name: 'Хозяин ночного рынка', world: 'nm',
      enemies: [{ id: 'nm_boss_keeper', scale: 1.75 }],
      unlockAfter: 'nm_19',
      tip: 'Он пышет жаром и страхом. Огнеупор и отвага — и корона твоя.',
    },
  ],
};
