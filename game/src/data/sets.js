// Сетовые эффекты: за 3, 6 и 9 надетых предметов одного сета.
// Не все предметы сетовые — поле `set` у предмета в data/items.js.
export const SETS = {
  meadow: {
    name: 'Опушка',
    tiers: {
      3: { stats: { speed: 3, dodge: 0.05 }, desc: 'Лёгкость леса: скорость +3, уклонение +5%' },
      6: { stats: { crit: 0.08 }, traits: ['bonus_spirit'], desc: 'Зов духов: крит +8%, урон по духам ×1.3' },
      9: { traits: ['regen_ally'], desc: 'Дыхание опушки: регенерация всю битву' },
    },
  },
  town: {
    name: 'Дворник',
    tiers: {
      3: { stats: { armor: 8 }, desc: 'Толщина стен: броня +8' },
      6: { stats: { block: 0.1, hp: 20 }, desc: 'Страж двора: блок +10%, здоровье +20' },
      9: { traits: ['first_hit_reduction'], desc: 'Несокрушимость: первый удар в бою −20%' },
    },
  },
  attic: {
    name: 'Чердак',
    tiers: {
      3: { stats: { }, resist: { poison: 0.15, sleep: 0.15 }, desc: 'Пыль веков: сопр. яду и сну +15%' },
      6: { stats: { dodge: 0.08 }, desc: 'Чернильная лёгкость: уклонение +8%' },
      9: { traits: ['fearless'], desc: 'Тишина библиотеки: иммунитет к страху' },
    },
  },
  master: {
    name: 'Мастер',
    tiers: {
      3: { stats: { attack: 5 }, desc: 'Рука мастера: атака +5' },
      6: { stats: { crit: 0.06 }, desc: 'Точность мастера: крит +6%' },
      9: { traits: ['pierce'], desc: 'Глаз мастера: пробитие брони вдвое' },
    },
  },
};
