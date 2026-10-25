import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  newGame, addCoins, buyItem, sellItem, shopStock, equipFromInventory,
  unequipToInventory, completePuzzle, puzzleAvailable, runBattle, battleAvailable,
  saveGame, loadGame, removeFromBelt, nextPuzzle, firstUnsolvedPuzzle, ALL_PUZZLES,
  nextBattle, firstUnbeatenBattle, skipPuzzle, skipPuzzlePrice, applyCheat,
  findPuzzle, applySeekOverrides, saveSeekOverride, resetSeekOverride,
  unseenShopItems, markShopSeen, loadSeekOverrides, autoEquipBest,
  dailyPuzzle, currentSeason, SEASON_LABEL, petTheCat, todayKey, isDailyPuzzle,
  buyCosmetic, toggleCosmetic, selectCosmetic,
} from '../src/core/state.js';
import { PUZZLES } from '../src/data/puzzles.js';
import { BATTLES } from '../src/data/battles.js';

test('новая игра: стартовый набор и монеты', () => {
  const s = newGame();
  assert.equal(s.coins, 80);
  assert.equal(s.equipped.weapon, 'wpn_rusty_sword');
  assert.equal(s.equipped.shield, 'shd_wooden');
  assert.deepEqual(s.inventory, ['pot_heal'], 'надетые предметы не дублируются в сундуке');
});

test('покупка и продажа', () => {
  const s = newGame();
  s.coins = 200;
  const r = buyItem(s, 'arm_padded');
  assert.ok(r.ok);
  assert.equal(s.coins, 200 - 90);
  // камзол авто-наделся (слот был свободен) — сначала снимаем, потом продаём
  assert.equal(s.equipped.armor, 'arm_padded');
  unequipToInventory(s, 'armor');
  const idx = s.inventory.indexOf('arm_padded');
  const sell = sellItem(s, idx);
  assert.ok(sell.ok);
  assert.equal(s.coins, 200 - 90 + 45);
});

test('не хватает монет — покупка отклоняется', () => {
  const s = newGame();
  s.coins = 10;
  const r = buyItem(s, 'arm_padded');
  assert.equal(r.ok, false);
});

test('ассортимент магазина растёт после побед', () => {
  const s = newGame();
  const before = shopStock(s).length;
  s.battlesDone.bt_bees = { victories: 1 };
  const after = shopStock(s).length;
  assert.ok(after > before);
  assert.ok(shopStock(s).some((i) => i.id === 'wpn_oak_mace'));
});

test('экипировка из инвентаря и обратно', () => {
  const s = newGame();
  s.coins = 200;
  const r = buyItem(s, 'arm_padded');
  assert.ok(r.ok);
  assert.equal(s.equipped.armor, 'arm_padded', 'покупка авто-надевается в свободный слот');
  assert.deepEqual(r.autoEquipped, { slot: 'armor' });
  assert.ok(!s.inventory.includes('arm_padded'));
  unequipToInventory(s, 'armor');
  assert.ok(s.inventory.includes('arm_padded'));
  // И ручное надевание тоже работает
  const idx = s.inventory.indexOf('arm_padded');
  const r2 = equipFromInventory(s, idx);
  assert.ok(r2.ok);
  assert.equal(s.equipped.armor, 'arm_padded');
});

test('авто-экипировка при покупке: свободный слот, пояс, занятый слот', () => {
  const s = newGame();
  s.coins = 2000;
  s.battlesDone.bt_bees = { victories: 1 }; // шлем барсука на полке
  s.battlesDone.bt_moths = { victories: 1 }; // кольцо крита на полке
  // Шлем — слот свободен → надевается
  let r = buyItem(s, 'hlm_leather');
  assert.deepEqual(r.autoEquipped, { slot: 'helmet' });
  assert.equal(s.equipped.helmet, 'hlm_leather');
  // Второй шлем — слот занят → в сундук
  r = buyItem(s, 'hlm_badger');
  assert.equal(r.autoEquipped, null);
  assert.ok(s.inventory.includes('hlm_badger'));
  // Зелье — в пояс, пока есть место (стартово 1 из 2)
  r = buyItem(s, 'pot_vigor');
  assert.deepEqual(r.autoEquipped, { belt: true });
  assert.ok(s.consumableBelt.includes('pot_vigor'));
  // Пояс полон (2) — следующее зелье в сундук
  r = buyItem(s, 'pot_heal');
  assert.equal(r.autoEquipped, null);
  assert.ok(s.inventory.includes('pot_heal'));
  // Кольца: первое и второе — в слоты, третье — в сундук
  assert.deepEqual(buyItem(s, 'rng_health').autoEquipped, { slot: 'ring1' });
  assert.deepEqual(buyItem(s, 'rng_luck').autoEquipped, { slot: 'ring2' });
  assert.equal(buyItem(s, 'rng_crit').autoEquipped, null);
});

test('авто-экипировка щита не срабатывает при двуручном оружии', () => {
  const s = newGame();
  unequipToInventory(s, 'weapon');
  unequipToInventory(s, 'shield');
  equipFromInventory(s, s.inventory.indexOf('wpn_rusty_sword'));
  // Надеваем двуручник напрямую
  s.equipped.weapon = null;
  s.inventory.push('wpn_greatsword_oak');
  equipFromInventory(s, s.inventory.indexOf('wpn_greatsword_oak'));
  assert.equal(s.equipped.shield, null);
  s.battlesDone.bt_bees = { victories: 1 }; // щит есть в продаже всегда
  s.coins = 200;
  // Отделяем проверку двуручника от нового запрета повторной покупки имеющейся вещи.
  s.inventory = s.inventory.filter((id) => id !== 'shd_wooden');
  const r = buyItem(s, 'shd_wooden');
  assert.equal(r.autoEquipped, null, 'щит не должен авто-надеваться под двуручник');
  assert.ok(s.inventory.includes('shd_wooden'));
});

test('зелье уходит в пояс при экипировке', () => {
  const s = newGame();
  const r = buyItem(s, 'pot_vigor');
  assert.ok(r.ok);
  assert.deepEqual(r.autoEquipped, { belt: true }, 'зелье авто-ложится в пояс');
  assert.equal(s.consumableBelt.length, 2); // стартовое pot_heal + pot_vigor
  // И ручная кладка в пояс из сундука работает
  removeFromBelt(s, 1);
  s.inventory.push('pot_vigor');
  const r2 = equipFromInventory(s, s.inventory.indexOf('pot_vigor'));
  assert.ok(r2.ok);
  assert.ok(s.consumableBelt.includes('pot_vigor'));
});

test('пояс вмещает максимум 2 зелья', () => {
  const s = newGame();
  s.consumableBelt = ['pot_heal', 'pot_vigor'];
  buyItem(s, 'pot_heal');
  const r = equipFromInventory(s, s.inventory.indexOf('pot_heal'));
  assert.equal(r.ok, false);
  removeFromBelt(s, 0);
  assert.equal(s.consumableBelt.length, 1);
});

test('головоломки открываются по цепочке и дают награду', () => {
  const s = newGame();
  assert.ok(puzzleAvailable(s, 0));
  assert.ok(!puzzleAvailable(s, 1));
  const coinsBefore = s.coins;
  const rewards = completePuzzle(s, PUZZLES[0].id, { moves: 0 });
  assert.ok(puzzleAvailable(s, 1));
  assert.ok(s.coins > coinsBefore);
  assert.ok(rewards.some((r) => r.type === 'coins'));
  const coinsAfterFirst = s.coins;
  completePuzzle(s, PUZZLES[0].id, { moves: 0 });
  assert.ok(s.coins - coinsAfterFirst < coinsAfterFirst - coinsBefore);
});

test('блокировки по типам: первый уровень каждого раздела доступен сразу', () => {
  const s = newGame();
  // Первый уровень каждого типа — без предусловий
  const firsts = ['md_01', 'tw_01', 'bk_01', 'bk_06', 'sk_md_01', 'pp_01', 'tea_01', 'mech_01', 'cd_01', 'flow_01', 'brew_01'];
  for (const id of firsts) {
    const i = ALL_PUZZLES.findIndex((p) => p.id === id);
    assert.ok(i >= 0, `${id} существует`);
    assert.ok(puzzleAvailable(s, i), `${id} доступен с самого начала`);
  }
  // Второй уровень типа заперт до первого уровня того же типа
  const iTea2 = ALL_PUZZLES.findIndex((p) => p.id === 'tea_02');
  assert.ok(!puzzleAvailable(s, iTea2), 'tea_02 заперт на старте');
  completePuzzle(s, 'tea_01', {});
  assert.ok(puzzleAvailable(s, iTea2), 'tea_02 открылся после tea_01');
  const iBk2 = ALL_PUZZLES.findIndex((p) => p.id === 'bk_02');
  assert.ok(!puzzleAvailable(s, iBk2), 'решение чая не открывает загадки');
  // «Следующая» — внутри типа
  assert.equal(nextPuzzle('tea_01').id, 'tea_02');
  assert.equal(nextPuzzle('bk_05').id, 'bk_106', 'после bk_05 — новые народные загадки');
  assert.equal(nextPuzzle('bk_200'), null, 'у сотой загадки нет следующей');
});

test('полный цикл: головоломка -> монеты -> предмет -> бой', () => {
  const s = newGame();
  completePuzzle(s, PUZZLES[0].id, {});
  completePuzzle(s, PUZZLES[1].id, {});
  assert.ok(s.coins >= 80);
  assert.ok(battleAvailable(s, BATTLES[0].id));
  const result = runBattle(s, BATTLES[0].id, 1);
  assert.ok(result);
  assert.equal(result.victory, true, 'стартовый рыцарь проходит первый бой');
  assert.ok(s.battlesDone[BATTLES[0].id]);
  assert.ok(battleAvailable(s, BATTLES[1].id));
});

test('использованное зелье уходит из пояса после боя', () => {
  const s = newGame();
  s.consumableBelt = ['pot_heal'];
  s.inventory = s.inventory.filter((i) => i !== 'pot_heal');
  // Бой с големом: здоровье точно просядет ниже порога
  s.battlesDone = { bt_slimes: { victories: 1 }, bt_bees: { victories: 1 }, bt_moths: { victories: 1 }, bt_spirits: { victories: 1 } };
  const result = runBattle(s, 'bt_golem', 5);
  assert.ok(result);
  assert.equal(s.consumableBelt.length, 0, 'выпитое зелье должно уйти из пояса');
});

test('nextPuzzle и firstUnsolvedPuzzle', () => {
  const s = newGame();
  assert.equal(nextPuzzle(PUZZLES[0].id).id, PUZZLES[1].id);
  assert.equal(nextPuzzle('custom_xxx'), null, 'у мастерских нет следующей кампейнской');
  assert.equal(nextPuzzle(ALL_PUZZLES[ALL_PUZZLES.length - 1].id), null, 'последняя загадка — без следующей');
  assert.equal(firstUnsolvedPuzzle(s).id, PUZZLES[0].id);
  completePuzzle(s, PUZZLES[0].id, {});
  assert.equal(firstUnsolvedPuzzle(s).id, PUZZLES[1].id);
  // Если решить всё — null
  for (const p of ALL_PUZZLES) s.puzzlesDone[p.id] = {};
  assert.equal(firstUnsolvedPuzzle(s), null);
});

test('пропуск головоломки за монеты', () => {
  const s = newGame();
  s.coins = 1000;
  const p0 = PUZZLES[0]; // md_01, монет 40 → цена 60
  assert.equal(skipPuzzlePrice(p0), 60);
  // Пропускаем
  const r = skipPuzzle(s, p0.id);
  assert.ok(r.ok);
  assert.equal(s.coins, 1000 - 60 + Math.round(40 / 3), 'цена минус, утешение плюс');
  assert.ok(s.puzzlesDone[p0.id].skipped, 'помечена как пропущенная');
  assert.ok(puzzleAvailable(s, 1), 'цепочка открылась');
  // Повторно нельзя
  assert.equal(skipPuzzle(s, p0.id).ok, false);
  // Закрытую цепочкой нельзя
  const late = ALL_PUZZLES[5];
  assert.equal(skipPuzzle(s, late.id).ok, false);
  // Не хватает монет
  const s2 = newGame();
  s2.coins = 10;
  const r2 = skipPuzzle(s2, p0.id);
  assert.equal(r2.ok, false);
  assert.equal(r2.price, 60);
});

test('nextBattle и firstUnbeatenBattle', () => {
  const s = newGame();
  assert.equal(nextBattle(BATTLES[0].id).id, BATTLES[1].id);
  assert.equal(nextBattle(BATTLES[BATTLES.length - 1].id), null, 'последняя битва — без следующей');
  assert.equal(firstUnbeatenBattle(s).id, BATTLES[0].id);
  s.battlesDone[BATTLES[0].id] = { victories: 1 };
  assert.equal(firstUnbeatenBattle(s).id, BATTLES[1].id);
  for (const b of BATTLES) s.battlesDone[b.id] = { victories: 1 };
  assert.equal(firstUnbeatenBattle(s), null, 'все битвы пройдены');
});

test('чит-коды: монеты, печати, шляпа, неведомое слово', () => {
  const s = newGame();
  let r = applyCheat(s, 'котопёс');
  assert.ok(r.ok);
  assert.equal(s.coins, 80 + 1000);
  assert.ok(s.cheats.used.includes('КОТОПЁС'));
  r = applyCheat(s, ' ПЕЧАЛЬ ');
  assert.ok(r.ok);
  assert.equal(s.seals, 10);
  r = applyCheat(s, 'паучок');
  assert.ok(r.ok);
  assert.equal(s.cheats.spiderHat, true);
  r = applyCheat(s, 'паучок');
  assert.equal(s.cheats.spiderHat, false, 'повторный ПАУЧОК снимает шляпу');
  r = applyCheat(s, 'колдунство');
  assert.ok(!r.ok, 'неведомое слово не срабатывает');
  r = applyCheat(s, 'рыцарь');
  assert.ok(s.inventory.includes('wpn_firebird_quill'));
  r = applyCheat(s, 'колдовство');
  assert.ok(r.ok);
  assert.ok(Object.keys(s.materials).length > 10, 'материалы выдаются пачками');
});

test('правки искалок из редактора применяются и сбрасываются', () => {
  const mem = {};
  const storage = { getItem: (k) => mem[k] ?? null, setItem: (k, v) => { mem[k] = v; } };
  const s = newGame();
  const level = findPuzzle(s, 'sk_md_01');
  const edited = applySeekOverrides(s, level, storage);
  assert.deepEqual(edited.groups, level.groups, 'без правок — исходные группы');
  const newGroups = JSON.parse(JSON.stringify(level.groups));
  newGroups[0].spots[0].x = 111;
  newGroups[0].spots[0].r = 55;
  saveSeekOverride(s, 'sk_md_01', newGroups, storage);
  const applied = applySeekOverrides(s, level, storage);
  assert.equal(applied.groups[0].spots[0].x, 111, 'правка применена');
  assert.equal(applied.groups[0].spots[0].r, 55);
  assert.equal(level.groups[0].spots[0].x, 195, 'исходные данные не тронуты');
  // Правки переживают новую игру
  const fresh = newGame();
  const afterNew = applySeekOverrides(fresh, level, storage);
  assert.equal(afterNew.groups[0].spots[0].x, 111, 'новая игра не стирает правки');
  resetSeekOverride(s, 'sk_md_01', storage);
  assert.deepEqual(applySeekOverrides(s, level, storage).groups, level.groups, 'сброс возвращает исходные');
});

test('миграция правок искалок из старого сохранения', () => {
  const mem = {
    cozy_adventures_save_v2: JSON.stringify({ ...newGame(), seekOverrides: { sk_md_01: [{ id: 'x', label: 'y', spots: [{ x: 1, y: 2, r: 30 }] }] } }),
  };
  const storage = {
    getItem: (k) => mem[k] ?? null,
    setItem: (k, v) => { mem[k] = v; },
  };
  const loaded = loadGame(storage);
  assert.ok(loaded);
  assert.deepEqual(loaded.seekOverrides, {}, 'в сохранении очищено');
  const ov = loadSeekOverrides(storage);
  assert.ok(ov.sk_md_01, 'правки переехали в отдельное хранилище');
});

test('миграция старого сейва: настройки каталогов получают значения по умолчанию', () => {
  const old = newGame();
  delete old.settings.keepBookOpen; // сейв до появления настройки уютной варки
  delete old.settings.puzzleCatalogMode; // сейв до появления вариантов каталога
  delete old.settings.guestCatalogMode; // сейв до появления гостевой книги
  delete old.settings.cursorMode; // сейв до появления режимов курсоров
  delete old.settings.cursorTheme;
  const mem = { cozy_adventures_save_v2: JSON.stringify(old) };
  const storage = {
    getItem: (k) => mem[k] ?? null,
    setItem: (k, v) => { mem[k] = v; },
  };
  const loaded = loadGame(storage);
  assert.equal(loaded.settings.keepBookOpen, false, 'прежнее поведение: рецепт по памяти');
  assert.equal(loaded.settings.puzzleCatalogMode, 'shelf', 'каталог по умолчанию показывается полкой');
  assert.equal(loaded.settings.guestCatalogMode, 'shelf', 'гостевая книга по умолчанию показывается полкой');
  assert.equal(loaded.settings.cursorMode, 'themed', 'курсоры по умолчанию тематические');
  assert.equal(loaded.settings.cursorTheme, 'default', 'тема «один везде» по умолчанию — перо хозяина');
});

test('миграция сейва с булевой themedCursors: false становится системным режимом', () => {
  const old = newGame();
  delete old.settings.cursorMode;
  delete old.settings.cursorTheme;
  old.settings.themedCursors = false; // сейв эпохи тумблера «системный курсор»
  const mem = { cozy_adventures_save_v2: JSON.stringify(old) };
  const storage = {
    getItem: (k) => mem[k] ?? null,
    setItem: (k, v) => { mem[k] = v; },
  };
  const loaded = loadGame(storage);
  assert.equal(loaded.settings.cursorMode, 'system', 'выключенные тематические курсоры → системный режим');
  assert.equal('themedCursors' in loaded.settings, false, 'старый ключ удалён');
});

test('новинки прилавка: появились, видны, гаснут после визита', () => {
  const s = newGame();
  // Изначально весь стартовый ассортимент — новинка
  assert.ok(unseenShopItems(s).length > 0);
  markShopSeen(s);
  assert.equal(unseenShopItems(s).length, 0, 'после визита новинок нет');
  // После победы ассортимент растёт — появляются новинки
  s.battlesDone.bt_bees = { victories: 1 };
  const fresh = unseenShopItems(s);
  assert.ok(fresh.length > 0);
  assert.ok(fresh.every((i) => ['glv_herbalist', 'wpn_oak_mace', 'bt_merchant', 'rng_luck', 'hlm_badger'].includes(i.id)));
  markShopSeen(s);
  assert.equal(unseenShopItems(s).length, 0);
});

test('достижения разблокируются по событиям', async () => {
  const { checkAchievements, ACHIEVEMENTS } = await import('../src/data/achievements.js');
  const { SEEK_PUZZLES } = await import('../src/data/puzzlesSeek.js');
  const s = newGame();
  const ctx = { puzzlesTotal: ALL_PUZZLES.length, battlesTotal: 200, seekIds: SEEK_PUZZLES.map((p) => p.id) };
  assert.equal(checkAchievements(s, ctx).length, 0);
  completePuzzle(s, PUZZLES[0].id, {});
  const fresh = checkAchievements(s, ctx);
  assert.ok(fresh.some((a) => a.id === 'first_puzzle'));
  assert.ok(!checkAchievements(s, ctx).some((a) => a.id === 'first_puzzle'), 'повторно не выдаётся');
  assert.ok(ACHIEVEMENTS.length >= 15);
});

test('достижения кампании считают уникальные решения, а не повторы и пропуски', async () => {
  const { ACHIEVEMENTS } = await import('../src/data/achievements.js');
  const byId = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));
  const ctx = { puzzlesTotal: 4 };
  const s = newGame();
  s.coins = 1000;

  completePuzzle(s, 'md_01', {});
  completePuzzle(s, 'md_01', {});
  completePuzzle(s, 'md_01', {});
  assert.equal(s.stats.puzzlesSolved, 3, 'повторы по-прежнему видны в общей статистике');
  assert.equal(byId.half_campaign.check(s, ctx), false, 'три записи одного уровня — не половина кампании');

  assert.equal(skipPuzzle(s, 'md_02').ok, true);
  assert.equal(s.stats.puzzlesSolved, 3, 'сам пропуск не увеличивает счётчик честных решений');
  assert.equal(byId.half_campaign.check(s, ctx), false, 'пропуск не заменяет второе уникальное решение');
  assert.equal(byId.all_puzzles.check(s, ctx), false, 'завышенный счётчик не открывает награду за всю кампанию');

  completePuzzle(s, 'md_03', {});
  completePuzzle(s, 'md_04', {});
  assert.equal(byId.half_campaign.check(s, ctx), true, 'два разных решения засчитаны');
  assert.equal(byId.all_puzzles.check(s, ctx), false, 'пропущенный уровень не входит в полное прохождение');

  const campaignCtx = { puzzlesTotal: 2, puzzleIds: ['md_01', 'md_02'] };
  const customState = newGame();
  customState.puzzlesDone.md_01 = {};
  customState.puzzlesDone.custom_extra = {};
  assert.equal(byId.all_puzzles.check(customState, campaignCtx), false, 'уровень Мастерской не заменяет кампанию');
  customState.puzzlesDone.md_02 = {};
  assert.equal(byId.all_puzzles.check(customState, campaignCtx), true);
});

test('десятка и искалки не засчитывают пропуски, выданные достижения сохраняются', async () => {
  const { ACHIEVEMENTS, checkAchievements } = await import('../src/data/achievements.js');
  const byId = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));
  const s = newGame();
  s.stats.puzzlesSolved = 100;
  for (let i = 0; i < 9; i++) s.puzzlesDone[`level_${i}`] = {};
  s.puzzlesDone.skipped_level = { skipped: true };
  assert.equal(byId.ten_puzzles.check(s, {}), false, 'девять решений и пропуск — ещё не десять');
  s.puzzlesDone.level_9 = {};
  assert.equal(byId.ten_puzzles.check(s, {}), true, 'десятая уникальная запись засчитана');

  const seekCtx = { seekIds: ['seek_1', 'seek_2'] };
  s.puzzlesDone.seek_1 = { skipped: true };
  s.puzzlesDone.seek_2 = {};
  assert.equal(byId.seek_master.check(s, seekCtx), false, 'пропущенная искалка не завершает серию');
  s.puzzlesDone.seek_1 = {};
  assert.equal(byId.seek_master.check(s, seekCtx), true);

  s.achievements.seek_master = 12345;
  s.puzzlesDone.seek_1 = { skipped: true };
  const fresh = checkAchievements(s, { ...seekCtx, puzzlesTotal: 1000, battlesTotal: 200 });
  assert.equal(s.achievements.seek_master, 12345, 'ранее выданное достижение не отзывается');
  assert.ok(!fresh.some((a) => a.id === 'seek_master'), 'и не выдаётся повторно');
});

test('заказ дня: детерминирован и даёт двойные монеты раз в день', () => {
  const s = newGame();
  const d1 = dailyPuzzle(s);
  const d2 = dailyPuzzle(s);
  assert.equal(d1.id, d2.id, 'загадка дня стабильна в течение дня');
  s.coins = 0;
  s.puzzlesDone = {}; // гарантируем, что daily доступна (цепочка)
  const daily = dailyPuzzle(s);
  // Открываем daily по её типу: решаем предшественников в её разделе
  const mech = daily.mechanic || 'mirror';
  const sameType = ALL_PUZZLES.filter((p) => (p.mechanic || 'mirror') === mech);
  const pos = sameType.findIndex((p) => p.id === daily.id);
  for (let i = 0; i < pos; i++) s.puzzlesDone[sameType[i].id] = {};
  const rewards = completePuzzle(s, daily.id, {});
  const coins = rewards.find((r) => r.type === 'coins');
  const base = (daily.rewards || []).find((r) => r.type === 'coins');
  assert.equal(s.lastDailyBonus, todayKey(), 'бонус заказа дня выдан и записан');
  assert.equal(coins.amount, base.amount * 2, 'заказ дня удваивает монеты');
  // Регрессия: условие значка «заказ дня ×2» из списка загадок после выдачи
  // бонуса ложно для любой нерешённой загадки (dailyClaimed = true)
  const badgeWouldShow = (id) =>
    !s.puzzlesDone[id] && s.lastDailyBonus !== todayKey() && isDailyPuzzle(s, id);
  const anyBadge = ALL_PUZZLES.some((p) => badgeWouldShow(p.id));
  assert.equal(anyBadge, false, 'после выдачи бонуса значок ни у кого не горит');
  // Бонус забран — в тот же день больше не выдаётся
  s.puzzlesDone = {};
  const idx2 = ALL_PUZZLES.findIndex((p) => p.id === dailyPuzzle(s).id);
  for (let i = 0; i < idx2; i++) s.puzzlesDone[ALL_PUZZLES[i].id] = {};
  const rewards2 = completePuzzle(s, dailyPuzzle(s).id, {});
  const coins2 = rewards2.find((r) => r.type === 'coins');
  const base2 = (dailyPuzzle(s).rewards || []).find((r) => r.type === 'coins');
  assert.notEqual(coins2.amount, (base2?.amount || 0) * 2, 'второй бонус в тот же день не выдаётся');
});

test('дневник кота пишет события', () => {
  const s = newGame();
  assert.equal((s.journal || []).length, 0);
  completePuzzle(s, PUZZLES[0].id, {});
  buyItem(s, 'arm_padded');
  assert.ok(s.journal.length >= 2);
  assert.ok(s.journal.some((j) => j.text.includes('решена')));
  assert.ok(s.journal.some((j) => j.text.includes('Куплено')));
});

test('сезон определяется по месяцу', () => {
  assert.ok(['winter', 'spring', 'summer', 'autumn'].includes(currentSeason()));
  assert.ok(SEASON_LABEL[currentSeason()]);
});

test('погладить кота: счётчик, дневник, ежедневный подарок', () => {
  const s = newGame();
  s.coins = 0;
  const r1 = petTheCat(s);
  assert.equal(r1.pets, 1);
  assert.equal(r1.gift, 2, 'первый раз за день — монетка от кота');
  assert.equal(s.coins, 2);
  const r2 = petTheCat(s);
  assert.equal(r2.pets, 2);
  assert.equal(r2.gift, 0, 'повторно в тот же день — без монет');
  assert.equal(s.coins, 2);
  assert.ok(s.journal.some((j) => j.text.includes('Кот что-то накопал')));
  assert.ok(s.stats.catPets === 2);
});

test('тематические лавки: весь ассортимент распределён без пересечений', async () => {
  const { SHOPS, itemsForShop } = await import('../src/data/shop.js');
  const s = newGame();
  for (const id of Object.keys(s.battlesDone = {})) { /* noop */ }
  // Открываем весь ассортимент
  const { BATTLES } = await import('../src/data/battles.js');
  for (const b of BATTLES) s.battlesDone[b.id] = { victories: 1 };
  const all = shopStock(s);
  const distributed = ['armory', 'armorer', 'magic', 'alchemy']
    .flatMap((k) => itemsForShop(s, k, all).map((i) => i.id));
  assert.equal(new Set(distributed).size, distributed.length, 'без дублей между лавками');
  assert.equal(distributed.length, all.length, 'каждый товар попадает в ровно одну лавку');
  // Зелья — только у алхимика, свитки — только у мага
  assert.ok(itemsForShop(s, 'alchemy', all).every((i) => i.type === 'potion'));
  assert.ok(itemsForShop(s, 'armory', all).every((i) => i.slot === 'weapon'));
  assert.ok(itemsForShop(s, 'magic', all).every((i) => i.slot === 'amulet' || i.slot === 'ring' || i.type === 'scroll'));
  assert.ok(itemsForShop(s, 'magic', all).some((i) => i.type === 'scroll'), 'витрина Мага содержит свитки');
});

test('«Надеть лучшее»: надевает сильнейшее и не трогает худшее', () => {
  const s = newGame();
  // стартовые: Дедов меч (атака 6, common) и Щит из липы надеты
  s.inventory.push('wpn_greatsword_oak', 'arm_padded', 'pot_heal');
  const r = autoEquipBest(s);
  assert.ok(r.changed >= 2, 'двуручник и камзол должны надеться');
  assert.equal(s.equipped.weapon, 'wpn_greatsword_oak', 'лучшее оружие надето');
  assert.equal(s.equipped.armor, 'arm_padded');
  assert.equal(s.equipped.shield, null, 'двуручник снял щит');
  assert.ok(s.inventory.includes('wpn_rusty_sword'), 'старый меч вернулся в сундук');
  assert.ok(s.inventory.includes('shd_wooden'), 'щит вернулся в сундук');
  assert.ok(s.inventory.includes('pot_heal'), 'зелья остаются в сундуке');
  // Повторный вызов ничего не меняет
  assert.equal(autoEquipBest(s).changed, 0);
});

test('«Надеть лучшее»: кольцо вытесняет более слабое', () => {
  const s = newGame();
  s.inventory.push('rng_luck', 'rng_health', 'rng_crit');
  autoEquipBest(s);
  const rings = [s.equipped.ring1, s.equipped.ring2].filter(Boolean);
  assert.equal(rings.length, 2);
  // rng_crit (rare, крит) сильнее rng_luck (common) — третьим захода не должно быть хуже
  const r2 = autoEquipBest(s);
  assert.equal(r2.changed, 0, 'худшие кольца не вытесняют лучшие');
});

test('сохранение и загрузка', () => {
  const mem = {};
  const storage = {
    getItem: (k) => mem[k] ?? null,
    setItem: (k, v) => { mem[k] = v; },
  };
  const s = newGame();
  s.coins = 777;
  saveGame(s, storage);
  const loaded = loadGame(storage);
  assert.equal(loaded.coins, 777);
});

test('миграция оформления: aliases без дублей, active последний, legacy полный и повтор стабилен', () => {
  const old = newGame(1000);
  old.cosmeticsVersion = 1;
  old.coins = 777;
  old.seals = 9;
  old.inventory = ['pot_heal', 'custom_keepsake'];
  old.materials = { slime_jelly: 4 };
  old.battlesDone = { bt_slimes: { victories: 2 } };
  old.cosmeticsOwned = ['cos_carpet', 'cos_flowers', 'cos_crest'];
  old.cosmeticsActive = ['cos_carpet', 'cos_flowers', 'cos_crest'];
  delete old.legacyCosmeticsActive;
  const memory = { cozy_adventures_save_v2: JSON.stringify(old) };
  const storage = {
    getItem: (k) => memory[k] ?? null,
    setItem: (k, v) => { memory[k] = String(v); },
  };
  const loaded = loadGame(storage, 2000);
  assert.equal(loaded.cosmeticsVersion, 2);
  assert.deepEqual(loaded.cosmeticsOwned, ['hearth', 'spring'], 'carpet+crest — одна hearth, остальные покупки сохранены');
  assert.deepEqual(loaded.cosmeticsActive, ['hearth']);
  assert.deepEqual(loaded.legacyCosmeticsActive, old.cosmeticsActive, 'исходные cos_* сохранены только для sprite-fallback');
  for (const key of ['coins', 'seals', 'inventory', 'materials', 'battlesDone', 'equipped']) {
    assert.deepEqual(loaded[key], old[key], `миграция не трогает ${key}`);
  }

  saveGame(loaded, storage);
  const again = loadGame(storage, 2000);
  assert.deepEqual(again.cosmeticsOwned, loaded.cosmeticsOwned);
  assert.deepEqual(again.cosmeticsActive, loaded.cosmeticsActive);
  assert.deepEqual(again.legacyCosmeticsActive, loaded.legacyCosmeticsActive);
});

test('оформление: покупка и выбор заменяют pack id, повтор снимает, база очищает legacy', () => {
  const s = newGame();
  assert.equal(s.cosmeticsVersion, 2);
  s.coins = 1000;
  s.seals = 5;
  const inventory = structuredClone(s.inventory);
  const battles = structuredClone(s.battlesDone);
  assert.equal(buyCosmetic(s, 'hearth').ok, true);
  assert.deepEqual(s.cosmeticsActive, ['hearth']);
  assert.deepEqual(s.legacyCosmeticsActive, ['hearth']);
  assert.equal(buyCosmetic(s, 'spring').ok, true);
  assert.deepEqual(s.cosmeticsOwned, ['hearth', 'spring']);
  assert.deepEqual(s.cosmeticsActive, ['spring'], 'второй выбор не складывается с первым');
  assert.deepEqual(s.legacyCosmeticsActive, ['spring']);

  assert.equal(toggleCosmetic(s, 'spring').active, false);
  assert.deepEqual(s.cosmeticsActive, []);
  assert.deepEqual(s.legacyCosmeticsActive, []);
  assert.equal(selectCosmetic(s, 'hearth').active, true);
  assert.deepEqual(s.legacyCosmeticsActive, ['hearth']);
  assert.equal(toggleCosmetic(s, 'halloween').ok, false, 'некупленный пакет не выбирается');
  assert.deepEqual(s.cosmeticsActive, ['hearth']);
  assert.equal(selectCosmetic(s, null).active, false);
  assert.deepEqual(s.cosmeticsActive, []);
  assert.deepEqual(s.legacyCosmeticsActive, []);

  assert.equal(buyCosmetic(s, 'halloween').ok, true);
  assert.equal(s.coins, 80, '200 + 120 + 600 монет, без печатного SKU');
  assert.equal(s.seals, 5, 'печати не тратятся');
  assert.deepEqual(s.cosmeticsActive, ['halloween']);
  assert.deepEqual(s.legacyCosmeticsActive, ['halloween']);
  assert.deepEqual(s.inventory, inventory);
  assert.deepEqual(s.battlesDone, battles);
});
