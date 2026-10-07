// Мир «Звёздная ярмарка»: ярмарка чудес под ночным небом.
// Духи ярмарки, стражи порядка, карусельные коньки, ожившие аттракционы
// и Чемпион миров в финале. Открывается после босса мира sw.
export const WORLD = {
  id: 'sf',
  label: '🎪 Звёздная ярмарка',
  enemies: [
    {
      id: 'sf_spirit', name: 'Дух ярмарки', icon: '✨',
      hp: 75, attack: 14, armor: 8, speed: 13, crit: 0.08, dodge: 0.16,
      elem: 'phys', skills: ['fear_chill'], tags: ['spirit'],
      reward: { coins: [70, 100], materials: ['sf_spark'] },
    },
    {
      id: 'sf_steed', name: 'Карусельный конёк', icon: '🎠',
      hp: 135, attack: 16, armor: 18, speed: 7, crit: 0.05, dodge: 0.02,
      elem: 'phys', skills: ['heavy_blow'],
      reward: { coins: [85, 115], materials: ['sf_plank'] },
    },
    {
      id: 'sf_guard', name: 'Страж порядка', icon: '💂',
      hp: 105, attack: 17, armor: 15, speed: 9, crit: 0.1, dodge: 0.05,
      elem: 'phys', skills: ['aimed_shot'],
      reward: { coins: [90, 120], materials: ['sf_ticket'] },
    },
    {
      id: 'sf_firefly', name: 'Огненный жонглёр', icon: '🔥',
      hp: 75, attack: 18, armor: 8, speed: 12, crit: 0.08, dodge: 0.1,
      elem: 'fire', skills: ['spit_fire'],
      reward: { coins: [75, 105], materials: ['sf_candy'] },
    },
    {
      id: 'sf_doll', name: 'Кукла-зазывала', icon: '🎎',
      hp: 70, attack: 14, armor: 10, speed: 11, crit: 0.06, dodge: 0.12,
      elem: 'phys', skills: ['pollen_sleep'],
      reward: { coins: [70, 95], materials: ['sf_candy'] },
    },
    {
      id: 'sf_wheel', name: 'Ожившее колесо', icon: '🎡',
      hp: 150, attack: 18, armor: 20, speed: 6, crit: 0.04, dodge: 0,
      elem: 'phys', skills: ['heavy_blow', 'slow_spores'],
      reward: { coins: [110, 150], materials: ['sf_plank'] },
    },
    // Босс мира
    {
      id: 'sf_boss', name: 'Чемпион миров', icon: '🏆',
      hp: 350, attack: 26, armor: 24, speed: 10, crit: 0.12, dodge: 0.06,
      elem: 'phys', skills: ['heavy_blow', 'fear_chill', 'regen_ally_skill'], boss: true,
      reward: { coins: [400, 550], seals: 4, materials: ['sf_champion_star'] },
    },
  ],
  materials: [
    { id: 'sf_spark', name: 'Ярмарочная искра', icon: '✨', description: 'Тёплый огонёк ночного праздника.' },
    { id: 'sf_plank', name: 'Дощечка карусели', icon: '🎠', description: 'Пахнет краской и попутным ветром.' },
    { id: 'sf_ticket', name: 'Счастливый билетик', icon: '🎟️', description: 'Полурастёртый, но удача ещё внутри.' },
    { id: 'sf_candy', name: 'Звёздная карамель', icon: '🍬', description: 'Сладкая и слегка искрит на языке.' },
    { id: 'sf_champion_star', name: 'Звезда чемпиона', icon: '🏆', description: 'Награда, которую носят на груди.' },
  ],
  battles: [
    {
      id: 'sf_01', name: 'Открытие ярмарки', world: 'sf',
      enemies: [{ id: 'sf_doll', scale: 1.7 }, { id: 'sf_spirit', scale: 1.7 }],
      unlockAfter: 'sw_boss',
      tip: 'Кукла усыпляет, дух наводит страх. Шлем барсука и амулет отваги.',
    },
    {
      id: 'sf_02', name: 'Карусельный ряд', world: 'sf',
      enemies: [{ id: 'sf_steed', scale: 1.71 }, { id: 'sf_steed', scale: 1.71 }],
      unlockAfter: 'sf_01',
      tip: 'Коньки бьют тяжело, но медленны. Броня и скорость решают.',
    },
    {
      id: 'sf_03', name: 'Жонглёры огня', world: 'sf',
      enemies: [{ id: 'sf_firefly', scale: 1.72 }, { id: 'sf_firefly', scale: 1.72 }],
      unlockAfter: 'sf_02',
      tip: 'Плюются огнём. Сопротивление огню и быстрый добив.',
    },
    {
      id: 'sf_04', name: 'Патруль порядка', world: 'sf',
      enemies: [{ id: 'sf_guard', scale: 1.74 }, { id: 'sf_guard', scale: 1.74 }],
      unlockAfter: 'sf_03',
      tip: 'Стражи бьют прицельно по самому хрупкому. Прикрой слабых бронёй.',
    },
    {
      id: 'sf_05', name: 'Сонные качели', world: 'sf',
      enemies: [
        { id: 'sf_doll', scale: 1.75 }, { id: 'sf_doll', scale: 1.75 }, { id: 'sf_doll', scale: 1.75 },
      ],
      unlockAfter: 'sf_04',
      tip: 'Три куклы усыпляют по очереди. Зелье бодрости и шлем барсука.',
    },
    {
      id: 'sf_06', name: 'Шарманка призраков', world: 'sf',
      enemies: [
        { id: 'sf_spirit', scale: 1.76 }, { id: 'sf_spirit', scale: 1.76 }, { id: 'sf_doll', scale: 1.76 },
      ],
      unlockAfter: 'sf_05',
      tip: 'Страх и сон вместе. Лук и топор бьют по духам больнее.',
    },
    {
      id: 'sf_07', name: 'Разгон очереди', world: 'sf',
      enemies: [{ id: 'sf_guard', scale: 1.78 }, { id: 'sf_steed', scale: 1.78 }],
      unlockAfter: 'sf_06',
      tip: 'Конёк прикрывает стража. Сначала убери прицельного стрелка.',
    },
    {
      id: 'sf_08', name: 'Огненное колесо', world: 'sf',
      enemies: [
        { id: 'sf_firefly', scale: 1.79 }, { id: 'sf_firefly', scale: 1.79 }, { id: 'sf_steed', scale: 1.79 },
      ],
      unlockAfter: 'sf_07',
      tip: 'Огонь и тяжёлые удары. Сопротивление огню плюс крепкий щит.',
    },
    {
      id: 'sf_09', name: 'Большое колесо', world: 'sf',
      enemies: [{ id: 'sf_wheel', scale: 1.8 }],
      unlockAfter: 'sf_08',
      tip: 'Колесо замедляет и давит тяжёлым ударом. Один, но очень крепкий.',
    },
    {
      id: 'sf_10', name: 'Ночной парад', world: 'sf',
      enemies: [
        { id: 'sf_spirit', scale: 1.81 }, { id: 'sf_firefly', scale: 1.81 }, { id: 'sf_doll', scale: 1.81 },
      ],
      unlockAfter: 'sf_09',
      tip: 'Страх, огонь и сон в одном строю. Собери сопротивления заранее.',
    },
    {
      id: 'sf_11', name: 'Стража на входе', world: 'sf',
      enemies: [
        { id: 'sf_guard', scale: 1.83 }, { id: 'sf_guard', scale: 1.83 },
      ],
      unlockAfter: 'sf_10',
      tip: 'Два стража бьют прицельно и не мажут. Высокая броня всему отряду.',
    },
    {
      id: 'sf_12', name: 'Скачки по кругу', world: 'sf',
      enemies: [
        { id: 'sf_steed', scale: 1.84 }, { id: 'sf_spirit', scale: 1.84 },
      ],
      unlockAfter: 'sf_11',
      tip: 'Конёк давит тяжёлым ударом, дух морозит страхом. Амулет отваги пригодится.',
    },
    {
      id: 'sf_13', name: 'Кукольный балаган', world: 'sf',
      enemies: [
        { id: 'sf_doll', scale: 1.85 }, { id: 'sf_doll', scale: 1.85 }, { id: 'sf_guard', scale: 1.85 },
      ],
      unlockAfter: 'sf_12',
      tip: 'Куклы усыпляют, страж добивает прицельно. Не дай уснуть лекарю.',
    },
    {
      id: 'sf_14', name: 'Колесо и патруль', world: 'sf',
      enemies: [{ id: 'sf_wheel', scale: 1.86 }, { id: 'sf_guard', scale: 1.86 }],
      unlockAfter: 'sf_13',
      tip: 'Колесо замедляет, страж стреляет прицельно. Держи темп зельями.',
    },
    {
      id: 'sf_15', name: 'Фейерверк', world: 'sf',
      enemies: [
        { id: 'sf_firefly', scale: 1.88 }, { id: 'sf_firefly', scale: 1.88 }, { id: 'sf_firefly', scale: 1.88 },
      ],
      unlockAfter: 'sf_14',
      tip: 'Три жонглёра жгут огнём. Максимальное сопротивление огню.',
    },
    {
      id: 'sf_16', name: 'Полночный карнавал', world: 'sf',
      enemies: [
        { id: 'sf_spirit', scale: 1.78 }, { id: 'sf_spirit', scale: 1.78 }, { id: 'sf_wheel', scale: 1.78 },
      ],
      unlockAfter: 'sf_15',
      tip: 'Духи сеют страх, колесо давит. Амулет отваги и тяжёлое оружие.',
    },
    {
      id: 'sf_17', name: 'Турнир претендентов', world: 'sf',
      enemies: [
        { id: 'sf_steed', scale: 1.9 }, { id: 'sf_firefly', scale: 1.9 },
      ],
      unlockAfter: 'sf_16',
      tip: 'Испытание смелости и ловкости: таран конька и огонь жонглёра.',
    },
    {
      id: 'sf_18', name: 'Всё сразу', world: 'sf',
      enemies: [
        { id: 'sf_wheel', scale: 1.91 }, { id: 'sf_doll', scale: 1.91 }, { id: 'sf_spirit', scale: 1.91 },
      ],
      unlockAfter: 'sf_17',
      tip: 'Замедление, сон и страх. Полный набор сопротивлений и зелий.',
    },
    {
      id: 'sf_19', name: 'Гранд-шоу', world: 'sf',
      enemies: [
        { id: 'sf_wheel', scale: 1.93 }, { id: 'sf_firefly', scale: 1.93 },
      ],
      unlockAfter: 'sf_18',
      tip: 'Колесо и фейерверк перед финалом. Сопротивление огню и тяжёлое оружие.',
    },
    {
      id: 'sf_boss', name: 'Чемпион миров', world: 'sf',
      enemies: [{ id: 'sf_boss', scale: 1.95 }],
      unlockAfter: 'sf_19',
      tip: 'Чемпион бьёт наотмашь, нагоняет страх и переводит дух. Держи темп и не давай ему передышки.',
    },
  ],
};
