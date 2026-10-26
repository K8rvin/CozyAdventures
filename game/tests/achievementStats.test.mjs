import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  newGame, saveGame, loadGame, completePuzzle, skipPuzzle, buyItem, craft,
  exchangeMaterial, selectCosmetic, currentSeason,
} from '../src/core/state.js';
import {
  recordPuzzleCompletion, recordBattleResult, recordGuestTopic,
} from '../src/core/achievementStats.js';
import { setSavingsGoal } from '../src/core/goals.js';
import { createBrewPuzzle, doBrewAction, resetBrew } from '../src/core/brewPuzzle.js';
import { BREW_PUZZLES } from '../src/data/puzzlesBrew.js';
import { createGiftPuzzle, giveGift, restartGift, selectGift } from '../src/core/giftPuzzle.js';
import { GIFT_PUZZLES, SOUVENIRS } from '../src/data/puzzlesGift.js';
import { createSeekPuzzle, seekTap } from '../src/core/seekPuzzle.js';
import { SEEK_PUZZLES } from '../src/data/puzzlesSeek.js';
import { COSMETIC_BY_ID } from '../src/data/cosmetics.js';

function memoryStorage() {
  return {
    data: {},
    getItem(key) { return this.data[key] ?? null; },
    setItem(key, value) { this.data[key] = String(value); },
    removeItem(key) { delete this.data[key]; },
  };
}

test('старый сейв получает статистику достижений идемпотентно и не теряет старые ключи', () => {
  const storage = memoryStorage();
  const old = newGame();
  delete old.achievementStats;
  old.achievements.old_unknown = 123;
  saveGame(old, storage);
  const loaded = loadGame(storage);
  assert.equal(loaded.achievements.old_unknown, 123);
  assert.equal(loaded.achievementStats.version, 1);
  assert.deepEqual(loaded.achievementStats.daily.days, []);
  loaded.achievementStats.counters.marker = 7;
  saveGame(loaded, storage);
  const again = loadGame(storage);
  assert.equal(again.achievementStats.counters.marker, 7);
  assert.equal(again.achievements.old_unknown, 123);
});

test('пропуск запоминается, честное возвращение и отсутствие подсказок не дублируются', () => {
  const state = newGame();
  state.coins = 10000;
  assert.equal(skipPuzzle(state, 'md_01').ok, true);
  const info = { moves: 1, hintsUsed: 0 };
  completePuzzle(state, 'md_01', info);
  completePuzzle(state, 'md_01', info);
  const rec = state.achievementStats.puzzles.md_01;
  assert.equal(rec.skipped, true);
  assert.equal(rec.solves, 2);
  assert.ok(rec.feats.includes('skip_comeback'));
  assert.equal(rec.feats.filter((feat) => feat === 'no_hints').length, 1);
  assert.equal(rec.feats.filter((feat) => feat === 'skip_comeback').length, 1);
});

test('ежедневные дни уникальны, серия переживает только соседние UTC-даты', () => {
  const state = newGame();
  const puzzle = { id: 'custom_daily', mechanic: 'mirror' };
  for (const day of ['2026-10-24', '2026-10-25', '2026-10-25', '2026-10-26', '2026-10-28']) {
    recordPuzzleCompletion(state, puzzle, { hintsUsed: 1 }, { isDaily: true, day });
  }
  assert.deepEqual(state.achievementStats.daily.days, ['2026-10-24', '2026-10-25', '2026-10-26', '2026-10-28']);
  assert.equal(state.achievementStats.daily.bestStreak, 3);
  assert.equal(state.achievementStats.daily.currentStreak, 1);
  assert.equal(state.achievementStats.puzzles.custom_daily.solves, 5);
});

test('особые метаданные превращаются в постоянные feats, пропущенные поля не считаются нулём', () => {
  const state = newGame();
  recordPuzzleCompletion(state, { id: 'r', mechanic: 'riddle' }, { hintsUsed: 0, achievement: { attempts: 1 } });
  recordPuzzleCompletion(state, { id: 'b', mechanic: 'brew', hideRecipe: true }, {
    hintsUsed: 0,
    achievement: { totalMistakes: 0, spoiled: 0, bookOpen: false },
  });
  recordPuzzleCompletion(state, { id: 't', mechanic: 'tea' }, { hintsUsed: 0, achievement: { exact: true } });
  recordPuzzleCompletion(state, { id: 'c', mechanic: 'candle' }, { hintsUsed: 0, achievement: { placed: 2, minimum: 2 } });
  recordPuzzleCompletion(state, { id: 's', mechanic: 'spin' }, { moves: 7, hintsUsed: 0, achievement: { par: 7 } });
  recordPuzzleCompletion(state, { id: 'u', mechanic: 'mirror' }, {});
  const stats = state.achievementStats.puzzles;
  assert.ok(stats.r.feats.includes('riddle_first_try'));
  assert.ok(stats.b.feats.includes('brew_flawless'));
  assert.ok(stats.b.feats.includes('brew_memory'));
  assert.ok(stats.t.feats.includes('tea_exact'));
  assert.ok(stats.c.feats.includes('candle_minimum'));
  assert.ok(stats.s.feats.includes('spin_par'));
  assert.deepEqual(stats.u.feats, []);
});

test('варка считает все ошибки после reset и порчи, но текущая серия до порчи сохраняет прежний смысл', () => {
  const puzzle = createBrewPuzzle(BREW_PUZZLES[0]);
  const wrong = { do: 'wait' };
  if (BREW_PUZZLES[0].recipe[0].do === 'wait') wrong.do = 'cool';
  doBrewAction(puzzle, wrong);
  resetBrew(puzzle);
  doBrewAction(puzzle, wrong);
  doBrewAction(puzzle, wrong);
  doBrewAction(puzzle, wrong);
  doBrewAction(puzzle, wrong);
  assert.equal(puzzle.totalMistakes, 5);
  assert.equal(puzzle.mistakes, 1);
  assert.equal(puzzle.spoiled, 1);
});

test('уход гостя переживает restart, победа после него даёт особое возвращение', () => {
  const level = GIFT_PUZZLES[0];
  const state = newGame();
  let puzzle = createGiftPuzzle(level, SOUVENIRS, () => 0);
  const wrong = level.shelf.find((id) => id !== level.answer);
  for (let attempt = 0; attempt < 3; attempt += 1) {
    selectGift(puzzle, wrong);
    giveGift(puzzle);
  }
  assert.equal(puzzle.gone, true);
  assert.equal(puzzle.departures, 1);
  puzzle = restartGift(puzzle, () => 0);
  assert.equal(puzzle.departures, 1);
  selectGift(puzzle, level.answer);
  assert.equal(giveGift(puzzle).result, 'win');
  recordPuzzleCompletion(state, level, {
    moves: puzzle.moves, hintsUsed: 0,
    achievement: { tries: puzzle.tries, departures: puzzle.departures },
  });
  assert.ok(state.achievementStats.puzzles[level.id].feats.includes('gift_recovery'));
});

test('промах в искалке записывается в движке, повтор найденного не считается промахом', () => {
  const puzzle = createSeekPuzzle(SEEK_PUZZLES[0]);
  assert.equal(seekTap(puzzle, -100, -100).result, 'empty');
  assert.equal(puzzle.misses, 1);
  const spot = SEEK_PUZZLES[0].groups[0].spots[0];
  assert.equal(seekTap(puzzle, spot.x, spot.y).result, 'found');
  seekTap(puzzle, spot.x, spot.y);
  assert.equal(puzzle.misses, 1);
});

function battleResult(victory, overrides = {}) {
  return {
    victory,
    report: {
      victory,
      timedOut: !victory,
      knightHpLeft: victory ? 1 : 0,
      alliesDown: [],
      alliesStats: [{ taken: 0 }, { taken: 0 }],
      foesTotal: 6,
    },
    energySpent: 0,
    bossDrop: null,
    ...overrides,
  };
}

test('боевая статистика различает поражение, возвращение и боссовские feats', () => {
  const state = newGame();
  const battle = { id: 'bt_boss_willow' };
  recordBattleResult(state, battle, battleResult(false), { mercs: 2 });
  const victory = battleResult(true, {
    bossDrop: { dropped: true, guaranteed: true },
    energySpent: 3,
  });
  recordBattleResult(state, battle, victory, {
    companions: 3, mercs: 2, pet: true, usedConsumables: [],
  });
  const rec = state.achievementStats.battles[battle.id];
  assert.equal(rec.attempts, 2);
  assert.equal(rec.defeats, 1);
  for (const feat of ['timeout', 'battle_comeback', 'battle_no_damage', 'boss_no_damage',
    'boss_all_survive', 'boss_no_consumables', 'battle_one_hp', 'boss_pity']) {
    assert.ok(rec.feats.includes(feat), feat);
  }
  assert.equal(state.achievementStats.counters.battleDefeats, 1);
  assert.equal(state.achievementStats.counters.battleEnergySpent, 3);
  assert.equal(state.achievementStats.counters.bossPityDrops, 1);
});

test('полный сбор, одиночный бой и practice не смешивают правила', () => {
  const state = newGame();
  recordBattleResult(state, { id: 'meadow_crowd_6' }, battleResult(true), {
    companions: 3, mercs: 2, pet: true, usedConsumables: ['pot_heal'],
  });
  recordBattleResult(state, { id: 'bt_slimes' }, battleResult(true), {
    companions: 0, mercs: 0, pet: false, usedConsumables: [],
  });
  assert.ok(state.achievementStats.battles.meadow_crowd_6.feats.includes('full_party_crowd'));
  assert.ok(state.achievementStats.battles.bt_slimes.feats.includes('battle_solo'));
  const before = structuredClone(state);
  assert.equal(recordBattleResult(state, { id: 'bt_slimes' }, battleResult(true, { practice: true }), {}), null);
  assert.deepEqual(state, before);
});

test('только успешные покупка, крафт, обмен и цель оставляют достижения-факты', () => {
  const state = newGame();
  state.coins = 1000;
  assert.equal(buyItem(state, 'pot_heal').ok, true);
  assert.deepEqual(state.achievementStats.boughtItems, ['pot_heal']);

  state.battlesDone.bt_bees = { victories: 1 };
  state.materials = { slime_jelly: 5, honey: 1 };
  assert.equal(setSavingsGoal(state, 'recipe', 'rcp_pot_heal').ok, true);
  assert.equal(craft(state, 'rcp_pot_heal').ok, true);
  assert.equal(state.achievementStats.counters.savingsGoals, 1);
  assert.deepEqual(state.achievementStats.craftedRecipes, ['rcp_pot_heal']);
  assert.equal(craft(state, 'rcp_pot_heal').ok, false);
  assert.equal(state.achievementStats.craftedRecipes.length, 1);
  assert.equal(state.achievementStats.counters.savingsGoals, 1);

  assert.equal(exchangeMaterial(state, 'slime_jelly', 'honey').ok, true);
  assert.equal(state.achievementStats.counters.materialExchanges, 1);
  assert.equal(exchangeMaterial(state, 'missing_material', 'honey').ok, false);
  assert.equal(state.achievementStats.counters.materialExchanges, 1);
});

test('темы разговоров уникальны и не накручиваются повторным открытием', () => {
  const state = newGame();
  assert.equal(recordGuestTopic(state, 'keeper', 1), true);
  assert.equal(recordGuestTopic(state, 'keeper', 1), false);
  assert.equal(recordGuestTopic(state, 'keeper', 0), true);
  assert.deepEqual(state.achievementStats.guestTopics.keeper, [0, 1]);
});

test('сезонное оформление записывается только при реальном подходящем выборе', () => {
  const state = newGame();
  const seasonal = Object.values(COSMETIC_BY_ID).find((pack) => pack.season === currentSeason());
  assert.ok(seasonal);
  state.cosmeticsOwned = [seasonal.id, 'hearth'];
  assert.equal(selectCosmetic(state, seasonal.id).ok, true);
  assert.equal(state.achievementStats.counters.seasonalCosmeticSelections, 1);
  assert.equal(selectCosmetic(state, 'hearth').ok, true);
  assert.equal(state.achievementStats.counters.seasonalCosmeticSelections, 1);
  assert.equal(selectCosmetic(state, 'missing').ok, false);
  assert.equal(state.achievementStats.counters.seasonalCosmeticSelections, 1);
});
