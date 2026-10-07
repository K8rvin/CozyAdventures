// Мир «Сказочные топи»: туман, избушки на курьих ножках, лягушки-хранители,
// болотные духи, ведьмины помощники, куклы-обманщики и светящиеся ягоды.
// Открывается после босса мира nm. Цепочка из 20 боёв, scale 1.6 → 1.85.
export const WORLD = {
  id: 'sw',
  label: '🐸 Сказочные топи',
  enemies: [
    {
      id: 'sw_frog_guardian', name: 'Лягушка-хранительница', icon: '🐸',
      hp: 150, attack: 18, armor: 22, speed: 7, crit: 0.04, dodge: 0.02,
      elem: 'phys', skills: ['heavy_blow'],
      reward: { coins: [70, 100], materials: ['sw_frog_amulet'] },
    },
    {
      id: 'sw_bog_spirit', name: 'Болотный дух', icon: '🌫️',
      hp: 95, attack: 17, armor: 10, speed: 10, crit: 0.06, dodge: 0.14,
      elem: 'phys', skills: ['fear_chill', 'slow_spores'], tags: ['spirit'],
      reward: { coins: [65, 90], materials: ['sw_bog_mist'] },
    },
    {
      id: 'sw_witch_cat', name: 'Ведьмин кот', icon: '🐈‍⬛',
      hp: 85, attack: 16, armor: 8, speed: 11, crit: 0.1, dodge: 0.1,
      elem: 'phys', skills: ['aimed_shot', 'sting_poison_weak'],
      reward: { coins: [60, 85], materials: ['sw_witch_thread'] },
    },
    {
      id: 'sw_doll_trickster', name: 'Кукла-обманщица', icon: '🪆',
      hp: 105, attack: 15, armor: 12, speed: 9, crit: 0.05, dodge: 0.08,
      elem: 'phys', skills: ['pollen_sleep', 'fear_chill'],
      reward: { coins: [65, 90], materials: ['sw_witch_thread'] },
    },
    {
      id: 'sw_glow_bush', name: 'Светоягодник', icon: '🫐',
      hp: 120, attack: 14, armor: 14, speed: 6, crit: 0.03, dodge: 0.02,
      elem: 'phys', skills: ['regen_ally_skill', 'slow_spores'],
      reward: { coins: [70, 95], materials: ['sw_glow_berry'] },
    },
    {
      id: 'sw_hut_walker', name: 'Избушка-прохожая', icon: '🛖',
      hp: 160, attack: 22, armor: 20, speed: 6, crit: 0.05, dodge: 0,
      elem: 'fire', skills: ['spit_fire', 'heavy_blow'],
      reward: { coins: [85, 115], materials: ['sw_glow_berry'] },
    },
    // Босс мира
    {
      id: 'sw_hag_queen', name: 'Хозяйка Топей', icon: '🧙‍♀️',
      hp: 350, attack: 26, armor: 24, speed: 10, crit: 0.1, dodge: 0.06,
      elem: 'phys', skills: ['sting_poison', 'fear_chill', 'heavy_blow'], boss: true,
      reward: { coins: [450, 600], seals: 4, materials: ['sw_hag_crown'] },
    },
  ],
  materials: [
    { id: 'sw_frog_amulet', name: 'Лягушачий оберег', icon: '🐸', description: 'Тёплый камешек, изредка тихонько квакает.' },
    { id: 'sw_bog_mist', name: 'Клочок топяного тумана', icon: '🌫️', description: 'Не рассеивается даже в плотно закрытой банке.' },
    { id: 'sw_witch_thread', name: 'Ведьмина нить', icon: '🧵', description: 'Шьёт сама и кусается сама.' },
    { id: 'sw_glow_berry', name: 'Светящаяся ягода', icon: '🫐', description: 'Мягко светит зелёным, растёт даже на крыше избушки.' },
    { id: 'sw_hag_crown', name: 'Венец Хозяйки Топей', icon: '👑', description: 'Тяжёлый, пахнет купавой и болотным дымом.' },
  ],
  battles: [
    {
      id: 'sw_01', name: 'Кочки у тропы', world: 'sw',
      enemies: [{ id: 'sw_doll_trickster', scale: 1.6 }],
      unlockAfter: 'nm_boss',
      tip: 'Кукла напевает колыбельную и усыпляет. Приготовь зелье бодрости.',
    },
    {
      id: 'sw_02', name: 'Кваканье в камышах', world: 'sw',
      enemies: [{ id: 'sw_frog_guardian', scale: 1.61 }, { id: 'sw_frog_guardian', scale: 1.61 }],
      unlockAfter: 'sw_01',
      tip: 'Лягушки бьют наотмашь. Крепкая броня и щит — лучший ответ.',
    },
    {
      id: 'sw_03', name: 'Туман над водой', world: 'sw',
      enemies: [{ id: 'sw_bog_spirit', scale: 1.63 }, { id: 'sw_bog_spirit', scale: 1.63 }],
      unlockAfter: 'sw_02',
      tip: 'Духи нагоняют страх и замедляют. Лук и топор бьют по духам больнее.',
    },
    {
      id: 'sw_04', name: 'Ягодная поляна', world: 'sw',
      enemies: [{ id: 'sw_glow_bush', scale: 1.64 }, { id: 'sw_witch_cat', scale: 1.64 }],
      unlockAfter: 'sw_03',
      tip: 'Светоягодник лечит своих — сруби его первым.',
    },
    {
      id: 'sw_05', name: 'Курьи следы', world: 'sw',
      enemies: [{ id: 'sw_hut_walker', scale: 1.66 }],
      unlockAfter: 'sw_04',
      tip: 'Избушка дышит жарким дымом и топает тяжело. Сопротивление огню поможет.',
    },
    {
      id: 'sw_06', name: 'Ведьмина тропа', world: 'sw',
      enemies: [{ id: 'sw_witch_cat', scale: 1.67 }, { id: 'sw_doll_trickster', scale: 1.67 }],
      unlockAfter: 'sw_05',
      tip: 'Кот целится метко, кукла усыпляет. Держи зелья наготове.',
    },
    {
      id: 'sw_07', name: 'Дух и лекарь', world: 'sw',
      enemies: [{ id: 'sw_bog_spirit', scale: 1.68 }, { id: 'sw_glow_bush', scale: 1.68 }],
      unlockAfter: 'sw_06',
      tip: 'Дух морозит страхом, а куст его лечит. Разберись с лекарем первым.',
    },
    {
      id: 'sw_08', name: 'Хоровод кукол', world: 'sw',
      enemies: [
        { id: 'sw_doll_trickster', scale: 1.7 }, { id: 'sw_doll_trickster', scale: 1.7 },
        { id: 'sw_witch_cat', scale: 1.7 },
      ],
      unlockAfter: 'sw_07',
      tip: 'Две колыбельные и меткий кот. Зелье бодрости — обязательно.',
    },
    {
      id: 'sw_09', name: 'Болотный патруль', world: 'sw',
      enemies: [{ id: 'sw_frog_guardian', scale: 1.71 }, { id: 'sw_bog_spirit', scale: 1.71 }],
      unlockAfter: 'sw_08',
      tip: 'Толстая шкура спереди, страх из тумана. Амулет отваги пригодится.',
    },
    {
      id: 'sw_10', name: 'Дымная избушка', world: 'sw',
      enemies: [{ id: 'sw_hut_walker', scale: 1.73 }, { id: 'sw_glow_bush', scale: 1.73 }],
      unlockAfter: 'sw_09',
      tip: 'Избушка плюётся дымом, а ягоды её лечат. Гаси куст первым.',
    },
    {
      id: 'sw_11', name: 'Кошкины уловки', world: 'sw',
      enemies: [
        { id: 'sw_witch_cat', scale: 1.74 }, { id: 'sw_witch_cat', scale: 1.74 },
        { id: 'sw_doll_trickster', scale: 1.74 },
      ],
      unlockAfter: 'sw_10',
      tip: 'Два кота бьют прицельно и слегка травят. Противоядие и бодрость.',
    },
    {
      id: 'sw_12', name: 'Мгла сгущается', world: 'sw',
      enemies: [
        { id: 'sw_bog_spirit', scale: 1.75 }, { id: 'sw_bog_spirit', scale: 1.75 },
        { id: 'sw_glow_bush', scale: 1.75 },
      ],
      unlockAfter: 'sw_11',
      tip: 'Двое духов под защитой куста-лекаря. Амулет отваги и топор дровосека.',
    },
    {
      id: 'sw_13', name: 'Ягодный дозор', world: 'sw',
      enemies: [
        { id: 'sw_glow_bush', scale: 1.77 }, { id: 'sw_frog_guardian', scale: 1.77 },
        { id: 'sw_witch_cat', scale: 1.77 },
      ],
      unlockAfter: 'sw_12',
      tip: 'Лекарь, танк и меткий стрелок. Режь лекаря первым.',
    },
    {
      id: 'sw_14', name: 'Скрипучий гость', world: 'sw',
      enemies: [{ id: 'sw_hut_walker', scale: 1.78 }, { id: 'sw_doll_trickster', scale: 1.78 }],
      unlockAfter: 'sw_13',
      tip: 'Избушка топает, кукла напевает. Сон и огонь в одном бою.',
    },
    {
      id: 'sw_15', name: 'Топяное трио', world: 'sw',
      enemies: [
        { id: 'sw_frog_guardian', scale: 1.65 }, { id: 'sw_bog_spirit', scale: 1.6 },
        { id: 'sw_witch_cat', scale: 1.6 },
      ],
      unlockAfter: 'sw_14',
      tip: 'Лягушка держит строй, дух морозит, кот добивает. Лекарь в отряде не помешает.',
    },
    {
      id: 'sw_16', name: 'Кукольный вертеп', world: 'sw',
      enemies: [
        { id: 'sw_doll_trickster', scale: 1.81 }, { id: 'sw_doll_trickster', scale: 1.81 },
        { id: 'sw_glow_bush', scale: 1.81 },
      ],
      unlockAfter: 'sw_15',
      tip: 'Две куклы усыпляют, а куст лечит. Бодрость — на первый план.',
    },
    {
      id: 'sw_17', name: 'Дым над топью', world: 'sw',
      enemies: [
        { id: 'sw_hut_walker', scale: 1.82 }, { id: 'sw_bog_spirit', scale: 1.82 },
        { id: 'sw_witch_cat', scale: 1.82 },
      ],
      unlockAfter: 'sw_16',
      tip: 'Огонь, страх и точные выстрелы. Проверь сопротивления.',
    },
    {
      id: 'sw_18', name: 'Ведьмин сбор', world: 'sw',
      enemies: [
        { id: 'sw_witch_cat', scale: 1.84 }, { id: 'sw_doll_trickster', scale: 1.84 },
        { id: 'sw_glow_bush', scale: 1.84 },
      ],
      unlockAfter: 'sw_17',
      tip: 'Вся ведьмина челядь разом: яд, сон и вражеское лечение.',
    },
    {
      id: 'sw_19', name: 'Всё болото разом', world: 'sw',
      enemies: [
        { id: 'sw_hut_walker', scale: 1.85 }, { id: 'sw_glow_bush', scale: 1.83 },
        { id: 'sw_doll_trickster', scale: 1.8 },
      ],
      unlockAfter: 'sw_18',
      tip: 'Избушку лечат ягоды, кукла напевает. Сруби куст и не усни.',
    },
    {
      id: 'sw_boss', name: 'Хозяйка Топей', world: 'sw',
      enemies: [{ id: 'sw_hag_queen', scale: 1.6 }],
      unlockAfter: 'sw_19',
      tip: 'Она травит, нагоняет страх и бьёт наотмашь. Возьми всё лучшее, что есть.',
    },
  ],
};
