import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  newGame, addCoins, buyItem, sellItem, shopStock, equipFromInventory,
  unequipToInventory, completePuzzle, puzzleAvailable, runBattle, battleAvailable,
  saveGame, loadGame, removeFromBelt, nextPuzzle, firstUnsolvedPuzzle, ALL_PUZZLES,
  nextBattle, firstUnbeatenBattle,
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
