// Мир «Подводный грот»: затопленные пещеры за Нефритовым садом.
// Угрозы чередуются: сон хоров, страх теней, яд кораллов, жгучий свет пузырьков.
export const WORLD = {
  id: 'deep',
  label: '🐚 Подводный грот',
  enemies: [
    {
      id: 'deep_siren', name: 'Русалка-певунья', icon: '🧜‍♀️',
      hp: 95, attack: 15, armor: 10, speed: 11, crit: 0.05, dodge: 0.1,
      elem: 'phys', skills: ['pollen_sleep', 'regen_ally_skill'],
      reward: { coins: [85, 120], materials: ['deep_siren_scale'] },
    },
    {
      id: 'deep_pearl_guard', name: 'Жемчужный страж', icon: '🦪',
      hp: 150, attack: 17, armor: 24, speed: 6, crit: 0.03, dodge: 0,
      elem: 'phys', skills: ['heavy_blow', 'slow_spores'],
      reward: { coins: [100, 140], materials: ['deep_reef_stone'] },
    },
    {
      id: 'deep_shadow', name: 'Глубоководная тень', icon: '🌑',
      hp: 85, attack: 18, armor: 9, speed: 12, crit: 0.08, dodge: 0.14,
      elem: 'phys', skills: ['fear_chill'], tags: ['spirit'],
      reward: { coins: [90, 130], materials: ['deep_sea_mist'] },
    },
    {
      id: 'deep_coral_golem', name: 'Коралловый голем', icon: '🪸',
      hp: 160, attack: 20, armor: 20, speed: 5, crit: 0.02, dodge: 0,
      elem: 'phys', skills: ['heavy_blow', 'sting_poison_weak'],
      reward: { coins: [110, 150], materials: ['deep_reef_stone'] },
    },
    {
      id: 'deep_current_spirit', name: 'Дух течения', icon: '🌀',
      hp: 75, attack: 15, armor: 8, speed: 13, crit: 0.06, dodge: 0.12,
      elem: 'phys', skills: ['slow_spores'], tags: ['spirit', 'ranged'],
      reward: { coins: [85, 125], materials: ['deep_sea_mist'] },
    },
    {
      id: 'deep_light_bubble', name: 'Пузырёк света', icon: '🫧',
      hp: 68, attack: 13, armor: 8, speed: 12, crit: 0.05, dodge: 0.14,
      elem: 'fire', skills: ['spit_fire'],
      reward: { coins: [80, 115], materials: ['deep_light_drop'] },
    },
    // Босс мира
    {
      id: 'deep_boss_queen', name: 'Владычица грота', icon: '👑',
      hp: 370, attack: 26, armor: 24, speed: 9, crit: 0.08, dodge: 0.05,
      elem: 'phys', skills: ['pollen_sleep', 'fear_chill', 'slow_spores'], boss: true,
      reward: { coins: [550, 750], seals: 4, materials: ['deep_abyss_pearl'] },
    },
  ],
  materials: [
    { id: 'deep_siren_scale', name: 'Чешуя певуньи', icon: '🎶', description: 'Хранит отзвук подводной песни.' },
    { id: 'deep_reef_stone', name: 'Камень рифа', icon: '🪨', description: 'Осколок древнего рифа, тёплый на ощупь.' },
    { id: 'deep_sea_mist', name: 'Морская дымка', icon: '🌫️', description: 'Холодный туман, поднятый со дна.' },
    { id: 'deep_light_drop', name: 'Капелька света', icon: '🫧', description: 'Светится, если её погладить.' },
    { id: 'deep_abyss_pearl', name: 'Жемчужина бездны', icon: '🔮', description: 'Внутри плещется тёмная вода.' },
  ],
  battles: [
    {
      id: 'deep_01', name: 'Пузырьки у входа', world: 'deep',
      enemies: [{ id: 'deep_light_bubble', scale: 2.1 }, { id: 'deep_light_bubble', scale: 2.1 }],
      unlockAfter: 'jade_boss',
      tip: 'Пузырьки жгут ослепительным светом. Пригодится сопротивление огню.',
    },
    {
      id: 'deep_02', name: 'Песнь за скалой', world: 'deep',
      enemies: [{ id: 'deep_siren', scale: 2.11 }, { id: 'deep_siren', scale: 2.11 }],
      unlockAfter: 'deep_01',
      tip: 'Песня усыпляет. Шлем сонного барсука или зелье бодрости.',
    },
    {
      id: 'deep_03', name: 'Жемчужный пост', world: 'deep',
      enemies: [{ id: 'deep_pearl_guard', scale: 2.12 }, { id: 'deep_light_bubble', scale: 2.12 }],
      unlockAfter: 'deep_02',
      tip: 'Страж крепок, пузырёк жжётся. Тяжёлое оружие пробьёт панцирь.',
    },
    {
      id: 'deep_04', name: 'Тень в расщелине', world: 'deep',
      enemies: [{ id: 'deep_shadow', scale: 2.14 }, { id: 'deep_shadow', scale: 2.14 }],
      unlockAfter: 'deep_03',
      tip: 'Тени наводят ужас. Амулет отваги вернёт рыцарю твёрдость руки.',
    },
    {
      id: 'deep_05', name: 'Коралловый завал', world: 'deep',
      enemies: [{ id: 'deep_coral_golem', scale: 2.15 }, { id: 'deep_light_bubble', scale: 2.15 }],
      unlockAfter: 'deep_04',
      tip: 'Голем режет ядовитыми кораллами. Амулет противоядия не помешает.',
    },
    {
      id: 'deep_06', name: 'Игры течения', world: 'deep',
      enemies: [{ id: 'deep_current_spirit', scale: 2.16 }, { id: 'deep_current_spirit', scale: 2.16 }],
      unlockAfter: 'deep_05',
      tip: 'Духи стаскивают течением и бьют по слабейшему. Прикрой задний ряд.',
    },
    {
      id: 'deep_07', name: 'Хор на отмели', world: 'deep',
      enemies: [
        { id: 'deep_siren', scale: 2.18 }, { id: 'deep_siren', scale: 2.18 }, { id: 'deep_light_bubble', scale: 2.18 },
      ],
      unlockAfter: 'deep_06',
      tip: 'Хор усыпляет, а пузырёк жжётся. Зелье бодрости и сопротивление огню.',
    },
    {
      id: 'deep_08', name: 'Страж и тень', world: 'deep',
      enemies: [{ id: 'deep_pearl_guard', scale: 2.19 }, { id: 'deep_shadow', scale: 2.19 }],
      unlockAfter: 'deep_07',
      tip: 'Крепкий страж и жуткая тень. Амулет отваги и тяжёлое оружие.',
    },
    {
      id: 'deep_09', name: 'Сады кораллов', world: 'deep',
      enemies: [{ id: 'deep_coral_golem', scale: 2.2 }, { id: 'deep_current_spirit', scale: 2.2 }],
      unlockAfter: 'deep_08',
      tip: 'Яд коралла и стягующее течение. Противоядие и скорость.',
    },
    {
      id: 'deep_10', name: 'Поющие рифы', world: 'deep',
      enemies: [{ id: 'deep_siren', scale: 2.21 }, { id: 'deep_shadow', scale: 2.21 }],
      unlockAfter: 'deep_09',
      tip: 'Сон и страх в одном хоре. Шлем барсука и амулет отваги.',
    },
    {
      id: 'deep_11', name: 'Пузырьковый рой', world: 'deep',
      enemies: [
        { id: 'deep_light_bubble', scale: 2.22 }, { id: 'deep_light_bubble', scale: 2.22 },
        { id: 'deep_light_bubble', scale: 2.22 },
      ],
      unlockAfter: 'deep_10',
      tip: 'Троица светлячков жжёт разом. Сопротивление огню решает.',
    },
    {
      id: 'deep_12', name: 'Жемчужная стража', world: 'deep',
      enemies: [{ id: 'deep_pearl_guard', scale: 2.24 }, { id: 'deep_pearl_guard', scale: 2.24 }],
      unlockAfter: 'deep_11',
      tip: 'Два жемчужных стража — сплошная стена. Нужен урон потяжелее.',
    },
    {
      id: 'deep_13', name: 'Холодный водоворот', world: 'deep',
      enemies: [{ id: 'deep_current_spirit', scale: 2.25 }, { id: 'deep_shadow', scale: 2.25 }],
      unlockAfter: 'deep_12',
      tip: 'Течение стаскивает, тень леденит. Скорость и амулет отваги.',
    },
    {
      id: 'deep_14', name: 'Коралловый хор', world: 'deep',
      enemies: [{ id: 'deep_coral_golem', scale: 2.26 }, { id: 'deep_siren', scale: 2.26 }],
      unlockAfter: 'deep_13',
      tip: 'Голем держит удар, пока русалка поёт. Буди рыцаря побыстрее.',
    },
    {
      id: 'deep_15', name: 'Световой водоворот', world: 'deep',
      enemies: [{ id: 'deep_current_spirit', scale: 2.28 }, { id: 'deep_light_bubble', scale: 2.28 }],
      unlockAfter: 'deep_14',
      tip: 'Дух стаскивает слабейших, пузырёк жжёт светом. Прикрой задний ряд.',
    },
    {
      id: 'deep_16', name: 'Мрак грота', world: 'deep',
      enemies: [{ id: 'deep_shadow', scale: 2.29 }, { id: 'deep_pearl_guard', scale: 2.29 }],
      unlockAfter: 'deep_15',
      tip: 'Стена перламутра и леденящая тень. Амулет отваги и тяжёлое оружие.',
    },
    {
      id: 'deep_17', name: 'Песнь глубин', world: 'deep',
      enemies: [
        { id: 'deep_siren', scale: 2.15 }, { id: 'deep_siren', scale: 2.15 }, { id: 'deep_shadow', scale: 2.15 },
      ],
      unlockAfter: 'deep_16',
      tip: 'Двойной хор и тень. Без бодрости рыцарь уснёт надолго.',
    },
    {
      id: 'deep_18', name: 'Крепость коралла', world: 'deep',
      enemies: [{ id: 'deep_coral_golem', scale: 2.31 }, { id: 'deep_coral_golem', scale: 2.31 }],
      unlockAfter: 'deep_17',
      tip: 'Два коралловых голема: яд и толстые панцири. Тяжёлое оружие в руки.',
    },
    {
      id: 'deep_19', name: 'Голоса грота', world: 'deep',
      enemies: [{ id: 'deep_pearl_guard', scale: 2.33 }, { id: 'deep_siren', scale: 2.33 }],
      unlockAfter: 'deep_18',
      tip: 'Последний караул перед троном: страж и певунья. Тяжёлое оружие и бодрость.',
    },
    {
      id: 'deep_boss', name: 'Владычица грота', world: 'deep',
      enemies: [{ id: 'deep_boss_queen', scale: 2.35 }],
      unlockAfter: 'deep_19',
      tip: 'Владычица усыпляет песней, леденит взглядом и стаскивает течением. Шлем барсука и амулет отваги.',
    },
  ],
};
