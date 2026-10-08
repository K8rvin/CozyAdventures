// Розыскные листы на доске объявлений: усиленные особи за хорошую плату.
// Это обычные бои с флагом wanted (в общем списке походов не показываются).
export const WANTED_BATTLES = [
  {
    id: 'wnt_bee_queen', name: 'Розыск: Королева диких пчёл', world: 'meadow', wanted: true,
    enemies: [{ id: 'bee_wild', scale: 1.6 }, { id: 'bee_wild', scale: 1.6 }, { id: 'bee_wild', scale: 1.6 }, { id: 'bee_wild', scale: 1.6 }],
    unlockAfter: 'bt_boss_willow',
    tip: 'Рой из четырёх усиленных пчёл. Антидот и рассечение.',
  },
  {
    id: 'wnt_rat_king', name: 'Розыск: Крысиный барон', world: 'town', wanted: true,
    enemies: [{ id: 'rat_thief', scale: 2.0 }, { id: 'rat_thief', scale: 2.0 }, { id: 'bandit', scale: 1.9 }],
    unlockAfter: 'bt_boss_captain',
    tip: 'Барон и его шайка. Подковы верёвок не вяжут — бери тяжёлое.',
  },
  {
    id: 'wnt_ink_lord', name: 'Розыск: Повелитель клякс', world: 'attic', wanted: true,
    enemies: [{ id: 'ink_blot', scale: 2.1 }, { id: 'paper_spirit', scale: 2.0 }, { id: 'ink_blot', scale: 2.1 }],
    unlockAfter: 'bk_boss_keeper',
    tip: 'Чернила текучи и ядовиты. Чернильный отвар — в пояс.',
  },
  {
    id: 'wnt_lantern_thief', name: 'Розыск: Похититель фонарей', world: 'nm', wanted: true,
    enemies: [{ id: 'nm_shadow', scale: 2.2 }, { id: 'nm_moth', scale: 2.1 }],
    unlockAfter: 'nm_boss',
    tip: 'Тень и её мотылёк воруют свет с рынка. Бодрость и отвага!',
  },
];
