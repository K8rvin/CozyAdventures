// Мир «Туманные часы»: край времён. Часовые духи, ржавые автоматоны,
// эхо прошлого лавочника и хранители времени. Финальный босс — само Время.
// 24 боя, линейная цепочка; открывается после deep_boss. scale 2.2 → 2.6.
export const WORLD = {
  id: 'mist',
  label: '⏳ Туманные часы',
  enemies: [
    {
      id: 'mist_clock_spirit', name: 'Часовой дух', icon: '🕰️',
      hp: 80, attack: 14, armor: 8, speed: 12, crit: 0.06, dodge: 0.1,
      elem: 'phys', skills: ['fear_chill'], tags: ['spirit'],
      reward: { coins: [95, 130], materials: ['mist_gear_dust'] },
    },
    {
      id: 'mist_rust_automaton', name: 'Ржавый автоматон', icon: '🤖',
      hp: 100, attack: 16, armor: 16, speed: 6, crit: 0.04, dodge: 0,
      elem: 'phys', skills: ['heavy_blow'], tags: [],
      reward: { coins: [110, 150], materials: ['mist_rust_flake'] },
    },
    {
      id: 'mist_echo_keeper', name: 'Эхо лавочника', icon: '🕯️',
      hp: 75, attack: 15, armor: 8, speed: 11, crit: 0.05, dodge: 0.14,
      elem: 'phys', skills: ['pollen_sleep'], tags: ['spirit'],
      reward: { coins: [100, 135], materials: ['mist_echo_shard'] },
    },
    {
      id: 'mist_sand_wisp', name: 'Песчаный огонёк', icon: '⏳',
      hp: 85, attack: 14, armor: 10, speed: 13, crit: 0.07, dodge: 0.12,
      elem: 'phys', skills: ['slow_spores'], tags: [],
      reward: { coins: [95, 130], materials: ['mist_sand_grain'] },
    },
    {
      id: 'mist_cog_hound', name: 'Шестерённая гончая', icon: '🐺',
      hp: 80, attack: 12, armor: 10, speed: 11, crit: 0.08, dodge: 0.08,
      elem: 'phys', skills: ['aimed_shot'], tags: [],
      reward: { coins: [105, 140], materials: ['mist_gear_dust'] },
    },
    {
      id: 'mist_time_warden', name: 'Хранитель времени', icon: '🗝️',
      hp: 90, attack: 15, armor: 16, speed: 9, crit: 0.05, dodge: 0.05,
      elem: 'phys', skills: ['regen_ally_skill', 'slow_spores'], tags: ['spirit'],
      reward: { coins: [120, 160], materials: ['mist_echo_shard'] },
    },
    // Босс мира: кульминация игры — само Время
    {
      id: 'mist_boss', name: 'Само Время', icon: '⌛',
      hp: 500, attack: 33, armor: 34, speed: 11, crit: 0.12, dodge: 0.06,
      elem: 'phys', skills: ['heavy_blow', 'slow_spores', 'fear_chill'], tags: ['spirit'], boss: true,
      reward: { coins: [900, 1200], seals: 6, materials: ['mist_heart_of_time'] },
    },
  ],
  materials: [
    { id: 'mist_gear_dust', name: 'Часовая пыль', icon: '⚙️', description: 'Тикает, если прислушаться.' },
    { id: 'mist_rust_flake', name: 'Ржавая окалина', icon: '🔩', description: 'Когда-то была чьим-то сердцем.' },
    { id: 'mist_echo_shard', name: 'Осколок эха', icon: '🔮', description: 'Повторяет последние слова лавочника.' },
    { id: 'mist_sand_grain', name: 'Песчинка вечности', icon: '🌫️', description: 'Падает вверх, а не вниз.' },
    { id: 'mist_heart_of_time', name: 'Сердце времени', icon: '💠', description: 'Бьётся один раз в столетие.' },
  ],
  battles: [
    {
      id: 'mist_01', name: 'Первый звон часов', world: 'mist',
      enemies: [{ id: 'mist_clock_spirit', scale: 2.2 }, { id: 'mist_clock_spirit', scale: 2.2 }],
      unlockAfter: 'deep_boss',
      tip: 'Часовые духи наводят страх. Амулет отваги и оружие против духов.',
    },
    {
      id: 'mist_02', name: 'Ржавый завод', world: 'mist',
      enemies: [{ id: 'mist_rust_automaton', scale: 2.22 }, { id: 'mist_sand_wisp', scale: 2.22 }],
      unlockAfter: 'mist_01',
      tip: 'Автоматон бьёт тяжело, огонёк замедляет. Держи темп и зелья.',
    },
    {
      id: 'mist_03', name: 'Голос из-за прилавка', world: 'mist',
      enemies: [{ id: 'mist_echo_keeper', scale: 2.23 }, { id: 'mist_echo_keeper', scale: 2.23 }],
      unlockAfter: 'mist_02',
      tip: 'Эхо усыпляет пыльцой. Шлем барсука или зелье бодрости.',
    },
    {
      id: 'mist_04', name: 'Клык и песок', world: 'mist',
      enemies: [{ id: 'mist_cog_hound', scale: 2.25 }, { id: 'mist_sand_wisp', scale: 2.25 }],
      unlockAfter: 'mist_03',
      tip: 'Гончая бьёт прицельно, огонёк тянет время. Убей гончую первой.',
    },
    {
      id: 'mist_05', name: 'Механический дозор', world: 'mist',
      enemies: [{ id: 'mist_rust_automaton', scale: 2.27 }, { id: 'mist_clock_spirit', scale: 2.27 }],
      unlockAfter: 'mist_04',
      tip: 'Стена из ржавчины и дух за ней. Сначала дух — он хрупче.',
    },
    {
      id: 'mist_06', name: 'Пыль веков', world: 'mist',
      enemies: [
        { id: 'mist_sand_wisp', scale: 2.15 }, { id: 'mist_sand_wisp', scale: 2.15 },
        { id: 'mist_echo_keeper', scale: 2.15 },
      ],
      unlockAfter: 'mist_05',
      tip: 'Замедление и сон в одном бою. Зелье бодрости и темп.',
    },
    {
      id: 'mist_07', name: 'Хранитель у станка', world: 'mist',
      enemies: [{ id: 'mist_time_warden', scale: 2.3 }, { id: 'mist_rust_automaton', scale: 2.3 }],
      unlockAfter: 'mist_06',
      tip: 'Хранитель лечит автоматона. Сбей его первым, пока танк занят.',
    },
    {
      id: 'mist_08', name: 'Шёпот былой лавки', world: 'mist',
      enemies: [
        { id: 'mist_echo_keeper', scale: 2.32 }, { id: 'mist_echo_keeper', scale: 2.32 },
        { id: 'mist_clock_spirit', scale: 2.32 },
      ],
      unlockAfter: 'mist_07',
      tip: 'Сон и страх вместе. Контролируй оба статуса зельями.',
    },
    {
      id: 'mist_09', name: 'Клешни и клыки', world: 'mist',
      enemies: [{ id: 'mist_rust_automaton', scale: 2.34 }, { id: 'mist_cog_hound', scale: 2.34 }],
      unlockAfter: 'mist_08',
      tip: 'Танк прикрывает меткую гончую. Сфокусируйся на гончей.',
    },
    {
      id: 'mist_10', name: 'Песочные часы', world: 'mist',
      enemies: [
        { id: 'mist_clock_spirit', scale: 1.85 }, { id: 'mist_sand_wisp', scale: 1.8 },
        { id: 'mist_rust_automaton', scale: 1.8 },
      ],
      unlockAfter: 'mist_09',
      tip: 'Замедление со всех сторон, а хранитель латает раны. Фокус на нём.',
    },
    {
      id: 'mist_11', name: 'Перезвон и шёпот', world: 'mist',
      enemies: [{ id: 'mist_clock_spirit', scale: 2.37 }, { id: 'mist_echo_keeper', scale: 2.37 }],
      unlockAfter: 'mist_10',
      tip: 'Страх духа и усыпление эха. Оружие против духов окупится.',
    },
    {
      id: 'mist_12', name: 'Эхо в шестернях', world: 'mist',
      enemies: [{ id: 'mist_cog_hound', scale: 2.39 }, { id: 'mist_echo_keeper', scale: 2.39 }],
      unlockAfter: 'mist_11',
      tip: 'Меткая гончая и усыпляющее эхо. Не дай рыцарю уснуть.',
    },
    {
      id: 'mist_13', name: 'Два механизма', world: 'mist',
      enemies: [{ id: 'mist_rust_automaton', scale: 2.41 }, { id: 'mist_rust_automaton', scale: 2.41 }],
      unlockAfter: 'mist_12',
      tip: 'Две ржавые стены. Нужен максимальный урон за удар.',
    },
    {
      id: 'mist_14', name: 'Двойной гон', world: 'mist',
      enemies: [{ id: 'mist_cog_hound', scale: 2.3 }, { id: 'mist_cog_hound', scale: 2.3 }],
      unlockAfter: 'mist_13',
      tip: 'Две гончие бьют без промаха. Броня и уклонение — твои друзья.',
    },
    {
      id: 'mist_15', name: 'Пакт хранителя', world: 'mist',
      enemies: [{ id: 'mist_time_warden', scale: 2.44 }, { id: 'mist_clock_spirit', scale: 2.44 }],
      unlockAfter: 'mist_14',
      tip: 'Лечение и страх. Разберись с хранителем в первую очередь.',
    },
    {
      id: 'mist_16', name: 'Пыльный страж', world: 'mist',
      enemies: [{ id: 'mist_rust_automaton', scale: 2.46 }, { id: 'mist_sand_wisp', scale: 2.46 }],
      unlockAfter: 'mist_15',
      tip: 'Тяжёлые удары под замедлением. Не растягивай бой.',
    },
    {
      id: 'mist_17', name: 'Гон по резьбе', world: 'mist',
      enemies: [{ id: 'mist_cog_hound', scale: 2.35 }, { id: 'mist_sand_wisp', scale: 2.35 }],
      unlockAfter: 'mist_16',
      tip: 'Быстрая пара: клыки и песок. Держи скорость при себе.',
    },
    {
      id: 'mist_18', name: 'Дежурство эха', world: 'mist',
      enemies: [
        { id: 'mist_echo_keeper', scale: 2.35 }, { id: 'mist_echo_keeper', scale: 2.35 },
        { id: 'mist_time_warden', scale: 2.35 },
      ],
      unlockAfter: 'mist_17',
      tip: 'Двойной сон под прикрытием лечения. Зелье бодрости обязательно.',
    },
    {
      id: 'mist_19', name: 'Кузница времён', world: 'mist',
      enemies: [{ id: 'mist_rust_automaton', scale: 2.51 }, { id: 'mist_rust_automaton', scale: 2.51 }],
      unlockAfter: 'mist_18',
      tip: 'Два танка. Долгий бой — запасись выносливостью.',
    },
    {
      id: 'mist_20', name: 'Охота хранителя', world: 'mist',
      enemies: [{ id: 'mist_time_warden', scale: 2.53 }, { id: 'mist_cog_hound', scale: 2.53 }],
      unlockAfter: 'mist_19',
      tip: 'Гончая подлечивается хранителем. Выноси его первым.',
    },
    {
      id: 'mist_21', name: 'Башня без времени', world: 'mist',
      enemies: [{ id: 'mist_clock_spirit', scale: 2.55 }, { id: 'mist_clock_spirit', scale: 2.55 }],
      unlockAfter: 'mist_20',
      tip: 'Двойной страх в заднем ряду. Стрелки достанут их раньше.',
    },
    {
      id: 'mist_22', name: 'Последний завод пружины', world: 'mist',
      enemies: [{ id: 'mist_rust_automaton', scale: 2.57 }, { id: 'mist_echo_keeper', scale: 2.57 }],
      unlockAfter: 'mist_21',
      tip: 'Стена из ржавчины и усыпление. Пробей танка, не усни.',
    },
    {
      id: 'mist_23', name: 'Преддверие вечности', world: 'mist',
      enemies: [{ id: 'mist_time_warden', scale: 2.58 }, { id: 'mist_rust_automaton', scale: 2.58 }],
      unlockAfter: 'mist_22',
      tip: 'Хранитель и автоматон вместе. Последняя проверка перед Временем.',
    },
    {
      id: 'mist_boss', name: 'Само Время', world: 'mist',
      enemies: [{ id: 'mist_boss', scale: 1 }],
      unlockAfter: 'mist_23',
      tip: 'Время замедляет и давит страхом. Держи темп и не бойся — у лавки есть будущее.',
    },
  ],
};
