// Достижения лавки: определения и проверка. Чистые данные + логика без DOM.
export const ACHIEVEMENTS = [
  {
    id: 'first_puzzle', icon: '🧩', name: 'Первая загадка',
    desc: 'Решить первую головоломку.',
    check: (s) => s.stats.puzzlesSolved >= 1,
  },
  {
    id: 'ten_puzzles', icon: '🏮', name: 'Десятка фонарей',
    desc: 'Решить 10 головоломок.',
    check: (s) => s.stats.puzzlesSolved >= 10,
  },
  {
    id: 'meadow_master', icon: '🌿', name: 'Хозяин опушки',
    desc: 'Решить все загадки Тихой опушки (md_01–md_12).',
    check: (s) => Array.from({ length: 12 }, (_, i) => `md_${String(i + 1).padStart(2, '0')}`).every((id) => s.puzzlesDone[id]),
  },
  {
    id: 'half_campaign', icon: '📖', name: 'Половина пути',
    desc: 'Решить половину всех загадок кампании.',
    check: (s, ctx) => s.stats.puzzlesSolved >= Math.ceil(ctx.puzzlesTotal / 2),
  },
  {
    id: 'all_puzzles', icon: '🌟', name: 'Мастер загадок',
    desc: 'Решить все загадки кампании.',
    check: (s, ctx) => s.stats.puzzlesSolved >= ctx.puzzlesTotal,
  },
  {
    id: 'first_battle', icon: '⚔️', name: 'Первый поход',
    desc: 'Победить в первом бою.',
    check: (s) => s.stats.battlesWon >= 1,
  },
  {
    id: 'willow_down', icon: '🌳', name: 'Падение ивы',
    desc: 'Победить Хранителя старой ивы.',
    check: (s) => !!s.battlesDone.bt_boss_willow,
  },
  {
    id: 'keeper_down', icon: '📖', name: 'Конец истории',
    desc: 'Победить Хранителя последней страницы.',
    check: (s) => !!s.battlesDone.bk_boss_keeper,
  },
  {
    id: 'time_down', icon: '⏳', name: 'Времени больше нет',
    desc: 'Победить Само Время — финального босса.',
    check: (s) => !!s.battlesDone.mist_boss,
  },
  {
    id: 'fifty_battles', icon: '🗡️', name: 'Полсотни побед',
    desc: 'Пройти 50 боёв.',
    check: (s) => Object.keys(s.battlesDone).length >= 50,
  },
  {
    id: 'all_battles', icon: '👑', name: 'Покоритель миров',
    desc: 'Пройти все 200 боёв.',
    check: (s, ctx) => Object.keys(s.battlesDone).length >= ctx.battlesTotal,
  },
  {
    id: 'crew_five', icon: '🐾', name: 'Большая семья',
    desc: 'Нанять 5 членов команды.',
    check: (s) => (s.crew || []).length >= 5,
  },
  {
    id: 'first_craft', icon: '⚒️', name: 'Первая работа',
    desc: 'Сделать что-нибудь в кузнице.',
    check: (s) => (s.stats.itemsCrafted || 0) >= 1,
  },
  {
    id: 'rich', icon: '💰', name: 'Звон полных карманов',
    desc: 'Заработать суммарно 5000 монет.',
    check: (s) => s.stats.coinsEarned >= 5000,
  },
  {
    id: 'seals_five', icon: '🔰', name: 'Коллекция печатей',
    desc: 'Иметь 5 печатей мастера одновременно.',
    check: (s) => s.seals >= 5,
  },
  {
    id: 'shopper', icon: '🛍️', name: 'Завсегдатай прилавка',
    desc: 'Сделать 20 покупок.',
    check: (s) => (s.stats.itemsBought || 0) >= 20,
  },
  {
    id: 'seek_master', icon: '🔍', name: 'Орлиный глаз',
    desc: 'Пройти все искалки кампании.',
    check: (s, ctx) => ctx.seekIds.every((id) => s.puzzlesDone[id]),
  },
];

// Проверяет новые разблокировки. Возвращает массив свежеразблокированных.
export function checkAchievements(state, ctx) {
  state.achievements ||= {};
  const fresh = [];
  for (const a of ACHIEVEMENTS) {
    if (state.achievements[a.id]) continue;
    if (a.check(state, ctx)) {
      state.achievements[a.id] = Date.now();
      fresh.push(a);
    }
  }
  return fresh;
}
