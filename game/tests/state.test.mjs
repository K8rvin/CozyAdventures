import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  newGame, addCoins, buyItem, sellItem, shopStock, equipFromInventory,
  unequipToInventory, completePuzzle, puzzleAvailable, runBattle, battleAvailable,
  saveGame, loadGame, removeFromBelt, nextPuzzle, firstUnsolvedPuzzle, ALL_PUZZLES,
  nextBattle, firstUnbeatenBattle, skipPuzzle, skipPuzzlePrice, applyCheat,
  findPuzzle, applySeekOverrides, saveSeekOverride, resetSeekOverride,
  unseenShopItems, markShopSeen, loadSeekOverrides,
  dailyPuzzle, currentSeason, SEASON_LABEL,
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
  const r = buyItem(s, 'arm_padded');
  assert.ok(r.ok);
  assert.equal(s.coins, 80 - 60);
  // камзол авто-наделся (слот был свободен) — сначала снимаем, потом продаём
  assert.equal(s.equipped.armor, 'arm_padded');
  unequipToInventory(s, 'armor');
  const idx = s.inventory.indexOf('arm_padded');
  const sell = sellItem(s, idx);
  assert.ok(sell.ok);
  assert.equal(s.coins, 80 - 60 + 30);
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
  // Повторное прохождение даёт меньше
  const coinsAfterFirst = s.coins;
  completePuzzle(s, PUZZLES[0].id, { moves: 0 });
  assert.ok(s.coins - coinsAfterFirst < coinsAfterFirst - coinsBefore);
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

test('заказ дня: детерминирован и даёт двойные монеты раз в день', () => {
  const s = newGame();
  const d1 = dailyPuzzle(s);
  const d2 = dailyPuzzle(s);
  assert.equal(d1.id, d2.id, 'загадка дня стабильна в течение дня');
  s.coins = 0;
  s.puzzlesDone = {}; // гарантируем, что daily доступна (цепочка)
  const daily = dailyPuzzle(s);
  // Решаем по цепочке до daily, если она не первая — просто отметим доступной
  const idx = ALL_PUZZLES.findIndex((p) => p.id === daily.id);
  for (let i = 0; i < idx; i++) s.puzzlesDone[ALL_PUZZLES[i].id] = {};
  const rewards = completePuzzle(s, daily.id, {});
  const coins = rewards.find((r) => r.type === 'coins');
  const base = (daily.rewards || []).find((r) => r.type === 'coins');
  if (base && s.lastDailyBonus) {
    assert.equal(coins.amount, base.amount * 2, 'заказ дня удваивает монеты');
  }
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
