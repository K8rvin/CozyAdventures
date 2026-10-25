import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  newGame, buyItem, hireCrew, craft, saveGame, loadGame,
} from '../src/core/state.js';
import {
  setSavingsGoal, clearSavingsGoal, savingsGoalProgress, savingsGoalRoute,
  completeSavingsGoal,
} from '../src/core/goals.js';

function roundTrip(state) {
  const memory = {};
  const storage = {
    getItem: (key) => memory[key] ?? null,
    setItem: (key, value) => { memory[key] = String(value); },
  };
  saveGame(state, storage);
  return loadGame(storage);
}

function goalJournalCount(state, name) {
  return state.journal.filter((entry) => entry.text === `Цель достигнута: ${name}.`).length;
}

test('core/goals не импортирует state.js, новый и старый сейв без цели получают null', () => {
  const source = readFileSync(new URL('../src/core/goals.js', import.meta.url), 'utf8');
  assert.ok(!source.includes("from './state.js'"));
  const state = newGame();
  assert.equal(state.savingsGoal, null);
  delete state.savingsGoal;
  const loaded = roundTrip(state);
  assert.equal(loaded.savingsGoal, null);
});

test('item: монеты, эффективная цена, готовность и маршрут к нужной лавке', () => {
  const state = newGame();
  assert.equal(setSavingsGoal(state, 'item', 'rng_health').ok, true);
  let progress = savingsGoalProgress(state);
  assert.equal(progress.name, 'Кольцо здоровья');
  assert.equal(progress.icon, '💍');
  assert.equal(progress.current, 80);
  assert.equal(progress.needed, 80);
  assert.equal(progress.remaining, 0);
  assert.equal(progress.ready, true);
  assert.equal(progress.text, 'Можно купить');
  assert.deepEqual(progress.route, { name: 'shopMagic', params: {} });
  assert.deepEqual(savingsGoalRoute(state), progress.route);

  state.coins = 9;
  progress = savingsGoalProgress(state);
  assert.equal(progress.remaining, 71);
  assert.equal(progress.ready, false);
  assert.match(progress.text, /До цели «Кольцо здоровья» осталось 71 монета/);
});

test('покупка другого предмета не очищает денежную цель, точная завершает её один раз', () => {
  const state = newGame();
  state.coins = 200;
  setSavingsGoal(state, 'item', 'rng_health');
  const other = buyItem(state, 'bt_path');
  assert.equal(other.ok, true);
  assert.equal(other.goalCompleted, undefined);
  assert.deepEqual(state.savingsGoal, { kind: 'item', id: 'rng_health' });
  assert.equal(goalJournalCount(state, 'Кольцо здоровья'), 0);

  const result = buyItem(state, 'rng_health');
  assert.equal(result.ok, true);
  assert.equal(result.goalCompleted, true);
  assert.equal(state.coins, 40, 'списаны только две реальные цены, без бонуса за цель');
  assert.equal(state.savingsGoal, null);
  assert.equal(goalJournalCount(state, 'Кольцо здоровья'), 1);
  assert.equal(completeSavingsGoal(state, 'item', 'rng_health'), false);
  assert.equal(goalJournalCount(state, 'Кольцо здоровья'), 1);
});

test('item за печати использует sealPrice и завершается один раз без награды', () => {
  const state = newGame();
  state.battlesDone.bk_illustration = { victories: 1 };
  state.seals = 2;
  assert.equal(setSavingsGoal(state, 'item', 'wpn_firebird_quill').ok, true);
  let progress = savingsGoalProgress(state);
  assert.equal(progress.currency, 'seals');
  assert.equal(progress.needed, 6);
  assert.equal(progress.remaining, 4);
  assert.match(progress.short, /печати/);
  assert.deepEqual(progress.route, { name: 'shopArmory', params: {} });

  state.seals = 6;
  const earnedBefore = state.stats.coinsEarned;
  const result = buyItem(state, 'wpn_firebird_quill');
  assert.equal(result.ok, true);
  assert.equal(result.goalCompleted, true);
  assert.equal(state.seals, 0, 'списана только цена, награды за цель нет');
  assert.equal(state.stats.coinsEarned, earnedBefore);
  assert.equal(state.savingsGoal, null);
  assert.equal(goalJournalCount(state, 'Перо жар-птицы'), 1);
  assert.equal(completeSavingsGoal(state, 'item', 'wpn_firebird_quill'), false);
  assert.equal(goalJournalCount(state, 'Перо жар-птицы'), 1);
});

test('unknown/locked не устанавливаются и не затирают прежнюю цель', () => {
  const state = newGame();
  assert.equal(setSavingsGoal(state, 'item', 'wpn_firebird_quill').ok, false, 'закрытый предмет');
  assert.equal(setSavingsGoal(state, 'crew', 'merc_archer').ok, false, 'закрытый наёмник');
  assert.equal(setSavingsGoal(state, 'recipe', 'rcp_pot_heal').ok, false, 'закрытый рецепт');
  assert.equal(setSavingsGoal(state, 'item', 'no_such_item').ok, false);
  assert.equal(setSavingsGoal(state, 'unknown', 'rng_health').ok, false);
  assert.equal(state.savingsGoal, null);

  setSavingsGoal(state, 'item', 'rng_health');
  assert.equal(setSavingsGoal(state, 'item', 'no_such_item').ok, false);
  assert.deepEqual(state.savingsGoal, { kind: 'item', id: 'rng_health' });
  state.savingsGoal = { kind: 'item', id: 'unknown' };
  assert.equal(savingsGoalProgress(state), null);
  assert.equal(savingsGoalRoute(state), null);
});

test('crew: найм по монетам, посторонний найм не очищает цель, журнал не дублируется', () => {
  const state = newGame();
  state.battlesDone.bt_slimes = { victories: 1 };
  state.coins = 1000;
  setSavingsGoal(state, 'crew', 'cmp_firefly');
  let progress = savingsGoalProgress(state);
  assert.equal(progress.name, 'Светлячок');
  assert.equal(progress.needed, 270);
  assert.equal(progress.remaining, 0);
  assert.deepEqual(progress.route, { name: 'tavern', params: {} });

  const other = hireCrew(state, 'cmp_cat', 'companion');
  assert.equal(other.ok, true);
  assert.equal(other.goalCompleted, undefined);
  assert.deepEqual(state.savingsGoal, { kind: 'crew', id: 'cmp_firefly' });
  assert.equal(goalJournalCount(state, 'Светлячок'), 0);

  const result = hireCrew(state, 'cmp_firefly', 'companion');
  assert.equal(result.ok, true);
  assert.equal(result.goalCompleted, true);
  assert.equal(state.savingsGoal, null);
  assert.ok(state.crew.includes('cmp_firefly'));
  assert.equal(goalJournalCount(state, 'Светлячок'), 1);
  assert.equal(hireCrew(state, 'cmp_firefly', 'companion').ok, false);
  assert.equal(goalJournalCount(state, 'Светлячок'), 1);
});

test('crew за печати использует собственную валюту определения', () => {
  const state = newGame();
  state.battlesDone.bt_boss_willow = { victories: 1 };
  state.seals = 1;
  setSavingsGoal(state, 'crew', 'cmp_smith');
  let progress = savingsGoalProgress(state);
  assert.equal(progress.currency, 'seals');
  assert.equal(progress.needed, 2);
  assert.equal(progress.remaining, 1);
  assert.equal(progress.ready, false);
  state.seals = 2;
  progress = savingsGoalProgress(state);
  assert.equal(progress.ready, true);
  assert.equal(progress.readyText, 'Можно нанять');
  const result = hireCrew(state, 'cmp_smith', 'companion');
  assert.equal(result.goalCompleted, true);
  assert.equal(state.seals, 0);
});

test('recipe: недостающие материалы и монеты, готовность, маршрут и точный крафт', () => {
  const state = newGame();
  state.battlesDone.bt_spirits = { victories: 1 };
  state.battlesDone.bt_moths = { victories: 1 };
  state.materials = { glow_moss: 1, honey: 2, moth_dust: 1 };
  state.coins = 50;
  assert.equal(setSavingsGoal(state, 'recipe', 'rcp_master_dagger').ok, true);
  let progress = savingsGoalProgress(state);
  assert.equal(progress.ready, false);
  assert.deepEqual(progress.route, { name: 'craft', params: {} });
  assert.equal(progress.coins.remaining, 30);
  assert.equal(progress.missing.length, 2);
  const moss = progress.missing.find((entry) => entry.matId === 'glow_moss');
  assert.equal(moss.missing, 2);
  assert.match(moss.label, /Светящийся мох/);
  assert.ok(progress.missing.some((entry) => entry.matId === 'moss_stone'));
  assert.match(progress.text, /🪙 30/);

  const other = craft(state, 'rcp_master_ring');
  assert.equal(other.ok, true);
  assert.equal(other.goalCompleted, undefined);
  assert.deepEqual(state.savingsGoal, { kind: 'recipe', id: 'rcp_master_dagger' });

  state.materials.glow_moss = 3;
  state.materials.moss_stone = 1;
  state.coins = 80;
  progress = savingsGoalProgress(state);
  assert.equal(progress.ready, true);
  assert.equal(progress.readyText, 'Можно создать');
  assert.deepEqual(progress.missing, []);
  const result = craft(state, 'rcp_master_dagger');
  assert.equal(result.ok, true);
  assert.equal(result.goalCompleted, true);
  assert.equal(state.coins, 0, 'списаны только монеты рецепта');
  assert.ok(state.inventory.includes('wpn_master_dagger'));
  assert.equal(state.savingsGoal, null);
  assert.equal(goalJournalCount(state, 'Выковать Стилет мастера'), 1);
  assert.equal(completeSavingsGoal(state, 'recipe', 'rcp_master_dagger'), false);
  assert.equal(goalJournalCount(state, 'Выковать Стилет мастера'), 1);
});

test('clear сохраняет только отмену пользователя, цель и прогресс переживают save/load', () => {
  const state = newGame();
  assert.equal(clearSavingsGoal(state), false);
  setSavingsGoal(state, 'item', 'bt_path');
  state.coins = 12;
  const loaded = roundTrip(state);
  assert.deepEqual(loaded.savingsGoal, { kind: 'item', id: 'bt_path' });
  const progress = savingsGoalProgress(loaded);
  assert.equal(progress.needed, 80);
  assert.equal(progress.remaining, 68);
  assert.deepEqual(progress.route, { name: 'shopArmorer', params: {} });
  assert.equal(clearSavingsGoal(loaded), true);
  assert.equal(loaded.savingsGoal, null);
  assert.equal(clearSavingsGoal(loaded), false);
});
