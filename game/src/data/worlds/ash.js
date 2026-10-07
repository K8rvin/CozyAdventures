// Мир «Пепельные степи»: выжженные равнины, кочевые шаманы огня,
// пепельные волки, духи бурь и остатки погибшего каравана.
// Открывается после cr_boss, цепочка из 20 боёв, scale 1.9 → 2.15.
export const WORLD = {
  id: 'ash',
  label: '🔥 Пепельные степи',
  enemies: [
    {
      id: 'ash_wolf', name: 'Пепельный волк', icon: '🐺',
      hp: 75, attack: 14, armor: 8, speed: 10, crit: 0.05, dodge: 0.08,
      elem: 'phys', skills: ['heavy_blow'], tags: [],
      reward: { coins: [60, 90], materials: ['ash_pelt'] },
    },
    {
      id: 'ash_shaman', name: 'Кочевой шаман огня', icon: '🔥',
      hp: 80, attack: 16, armor: 8, speed: 9, crit: 0.05, dodge: 0.05,
      elem: 'fire', skills: ['spit_fire', 'regen_ally_skill'], tags: [],
      reward: { coins: [70, 100], materials: ['ash_ember'] },
    },
    {
      id: 'ash_storm_spirit', name: 'Дух пепельной бури', icon: '🌪️',
      hp: 75, attack: 15, armor: 8, speed: 12, crit: 0.05, dodge: 0.12,
      elem: 'phys', skills: ['fear_chill', 'slow_spores'], tags: ['spirit'],
      reward: { coins: [65, 95], materials: ['ash_storm_shard'] },
    },
    {
      id: 'ash_scorpion', name: 'Обугленный скорпион', icon: '🦂',
      hp: 85, attack: 15, armor: 14, speed: 10, crit: 0.05, dodge: 0.03,
      elem: 'phys', skills: ['sting_poison'], tags: [],
      reward: { coins: [65, 95], materials: ['ash_scale'] },
    },
    {
      id: 'ash_vulture', name: 'Пепельный стервятник', icon: '🦅',
      hp: 70, attack: 14, armor: 8, speed: 9, crit: 0.06, dodge: 0.1,
      elem: 'phys', skills: ['aimed_shot'], tags: [],
      reward: { coins: [60, 90], materials: ['ash_pelt'] },
    },
    {
      id: 'ash_ghoul', name: 'Тень караванщика', icon: '👻',
      hp: 85, attack: 16, armor: 10, speed: 11, crit: 0.05, dodge: 0.1,
      elem: 'phys', skills: ['pollen_sleep', 'fear_chill'], tags: ['spirit'],
      reward: { coins: [70, 100], materials: ['ash_storm_shard'] },
    },
    {
      id: 'ash_khan', name: 'Хан пепельных бурь', icon: '🌋',
      hp: 400, attack: 26, armor: 24, speed: 12, crit: 0.08, dodge: 0.05,
      elem: 'fire', skills: ['spit_fire', 'fear_chill'], tags: [], boss: true,
      reward: { coins: [220, 300], seals: 4, materials: ['ash_heart'] },
    },
  ],
  materials: [
    { id: 'ash_pelt', name: 'Пепельная шкура', icon: '🐺', description: 'Жёсткая шкура зверя выжженных степей.' },
    { id: 'ash_scale', name: 'Обожжённая чешуя', icon: '🦂', description: 'Пластина хитина, закалённая степным пожаром.' },
    { id: 'ash_ember', name: 'Неугасающий уголёк', icon: '🔥', description: 'Тлеет вечно — подарок кочевых шаманов.' },
    { id: 'ash_storm_shard', name: 'Осколок пепельной бури', icon: '🌪️', description: 'Кусочек ветра, застывший вместе с пеплом.' },
    { id: 'ash_heart', name: 'Сердце Хана Бурь', icon: '💎', description: 'Пылающее сердце повелителя пепельных степей.' },
  ],
  battles: [
    {
      id: 'ash_01', name: 'Выжженная граница', world: 'ash',
      enemies: [{ id: 'ash_wolf', scale: 1.9 }, { id: 'ash_wolf', scale: 1.9 }],
      unlockAfter: 'cr_boss',
      tip: 'Пепельные волки бьют мощным ударом. Надёжная броня и щит снимут львиную долю урона.',
    },
    {
      id: 'ash_02', name: 'Следы каравана', world: 'ash',
      enemies: [{ id: 'ash_vulture', scale: 1.913 }, { id: 'ash_wolf', scale: 1.913 }],
      unlockAfter: 'ash_01',
      tip: 'Стервятник стреляет прицельно издалека. Уклонение и быстрый темп боя решают.',
    },
    {
      id: 'ash_03', name: 'Костёр шамана', world: 'ash',
      enemies: [{ id: 'ash_shaman', scale: 1.926 }, { id: 'ash_wolf', scale: 1.926 }],
      unlockAfter: 'ash_02',
      tip: 'Шаман плюётся огнём и лечит волка. Сначала сбей шамана, пока он не вытянул бой.',
    },
    {
      id: 'ash_04', name: 'Жала в пепле', world: 'ash',
      enemies: [{ id: 'ash_scorpion', scale: 1.939 }, { id: 'ash_scorpion', scale: 1.939 }],
      unlockAfter: 'ash_03',
      tip: 'Скорпионы ядовиты и толстокожи. Антидот и тяжёлое оружие против их панцирей.',
    },
    {
      id: 'ash_05', name: 'Шёпот бури', world: 'ash',
      enemies: [{ id: 'ash_storm_spirit', scale: 1.953 }, { id: 'ash_storm_spirit', scale: 1.953 }],
      unlockAfter: 'ash_04',
      tip: 'Духи бурь наводят страх и замедляют. Лук и топор бьют по духам больнее.',
    },
    {
      id: 'ash_06', name: 'Погибший караван', world: 'ash',
      enemies: [{ id: 'ash_ghoul', scale: 1.966 }, { id: 'ash_vulture', scale: 1.966 }],
      unlockAfter: 'ash_05',
      tip: 'Тень караванщика усыпляет и пугает. Шлем от сна и амулет отваги в одном походе.',
    },
    {
      id: 'ash_07', name: 'Волчья стая', world: 'ash',
      enemies: [{ id: 'ash_wolf', scale: 1.979 }, { id: 'ash_wolf', scale: 1.979 }],
      unlockAfter: 'ash_06',
      tip: 'Волки бьют мощным ударом. Построение с крепким рыцарем впереди спасает отряд.',
    },
    {
      id: 'ash_08', name: 'Огненный обряд', world: 'ash',
      enemies: [
        { id: 'ash_shaman', scale: 1.992 }, { id: 'ash_shaman', scale: 1.992 }, { id: 'ash_scorpion', scale: 1.992 },
      ],
      unlockAfter: 'ash_07',
      tip: 'Два шамана лечат друг друга, а скорпион травит. Фокусируй огонь на одном шамане.',
    },
    {
      id: 'ash_09', name: 'Крылья над пеплом', world: 'ash',
      enemies: [
        { id: 'ash_vulture', scale: 2.005 }, { id: 'ash_ghoul', scale: 2.005 }, { id: 'ash_scorpion', scale: 2.005 },
      ],
      unlockAfter: 'ash_08',
      tip: 'Стервятник меток, тень усыпляет, скорпион травит. Шлем от сна и антидот.',
    },
    {
      id: 'ash_10', name: 'Яд и пламя', world: 'ash',
      enemies: [{ id: 'ash_scorpion', scale: 2.018 }, { id: 'ash_shaman', scale: 2.018 }],
      unlockAfter: 'ash_09',
      tip: 'Яд скорпиона и огонь шамана вместе. Противоядие плюс сопротивление огню.',
    },
    {
      id: 'ash_11', name: 'Гроза без дождя', world: 'ash',
      enemies: [{ id: 'ash_storm_spirit', scale: 2.032 }, { id: 'ash_ghoul', scale: 2.032 }],
      unlockAfter: 'ash_10',
      tip: 'Два духа: страх, сон и замедление. Оружие против духов и амулет отваги.',
    },
    {
      id: 'ash_12', name: 'Осколки бури', world: 'ash',
      enemies: [
        { id: 'ash_storm_spirit', scale: 2.045 }, { id: 'ash_storm_spirit', scale: 2.045 },
        { id: 'ash_vulture', scale: 2.045 },
      ],
      unlockAfter: 'ash_11',
      tip: 'Духи сковывают, стервятник добивает издалека. Не дай себя замедлить — бери скорость.',
    },
    {
      id: 'ash_13', name: 'Караван теней', world: 'ash',
      enemies: [
        { id: 'ash_ghoul', scale: 2.058 }, { id: 'ash_ghoul', scale: 2.058 }, { id: 'ash_shaman', scale: 2.058 },
      ],
      unlockAfter: 'ash_12',
      tip: 'Тени усыпляют, шаман жжёт и лечит. Шлем от сна — иначе отряд заснёт под огнём.',
    },
    {
      id: 'ash_14', name: 'Степная засада', world: 'ash',
      enemies: [
        { id: 'ash_vulture', scale: 2.071 }, { id: 'ash_storm_spirit', scale: 2.071 }, { id: 'ash_ghoul', scale: 2.071 },
      ],
      unlockAfter: 'ash_13',
      tip: 'Меткие стрелы, споры и сон. Разношёрстная засада — держи баланс защит.',
    },
    {
      id: 'ash_15', name: 'Пепельный круг', world: 'ash',
      enemies: [
        { id: 'ash_shaman', scale: 2.084 }, { id: 'ash_storm_spirit', scale: 2.084 }, { id: 'ash_wolf', scale: 2.084 },
      ],
      unlockAfter: 'ash_14',
      tip: 'Шаман за спиной духа и волка. Прорвись сквозь строй и сбей его первым.',
    },
    {
      id: 'ash_16', name: 'Вихрь над гнездом', world: 'ash',
      enemies: [
        { id: 'ash_vulture', scale: 2.097 }, { id: 'ash_storm_spirit', scale: 2.097 },
        { id: 'ash_storm_spirit', scale: 2.097 },
      ],
      unlockAfter: 'ash_15',
      tip: 'Стервятник стреляет из пепельного вихря. Уклонение и оружие против духов.',
    },
    {
      id: 'ash_17', name: 'Дыхание пожара', world: 'ash',
      enemies: [
        { id: 'ash_shaman', scale: 2.111 }, { id: 'ash_shaman', scale: 2.111 },
        { id: 'ash_storm_spirit', scale: 2.111 },
      ],
      unlockAfter: 'ash_16',
      tip: 'Парные шаманы под прикрытием духа. Сопротивление огню и оружие против духов.',
    },
    {
      id: 'ash_18', name: 'Последний обоз', world: 'ash',
      enemies: [
        { id: 'ash_ghoul', scale: 2.124 }, { id: 'ash_wolf', scale: 2.124 }, { id: 'ash_storm_spirit', scale: 2.124 },
      ],
      unlockAfter: 'ash_17',
      tip: 'Тень усыпляет, волк бьёт мощно, дух пугает. Шлем от сна и крепкая броня.',
    },
    {
      id: 'ash_19', name: 'Перед лицом Хана', world: 'ash',
      enemies: [
        { id: 'ash_shaman', scale: 2.137 }, { id: 'ash_storm_spirit', scale: 2.137 }, { id: 'ash_ghoul', scale: 2.137 },
      ],
      unlockAfter: 'ash_18',
      tip: 'Вся нечисть степи разом: огонь, страх и сон. Последняя проверка перед Ханом.',
    },
    {
      id: 'ash_boss', name: 'Хан пепельных бурь', world: 'ash',
      enemies: [{ id: 'ash_khan', scale: 1.9 }],
      unlockAfter: 'ash_19',
      tip: 'Хан жжёт огнём и наводит страх. Собери лучшее снаряжение и отряд.',
    },
  ],
};
