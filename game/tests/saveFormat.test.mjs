import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newGame } from '../src/core/state.js';
import {
  SAVE_SCHEMA_VERSION, SaveFormatError, serializeGameSave, deserializeGameSave,
  validateGameStateShape,
} from '../src/core/saveFormat.js';

const GENERATION = '7f2d92bb-8221-44bc-a02f-a22cecc59880';

function expectCode(action, code, pattern) {
  assert.throws(action, (error) => {
    assert.ok(error instanceof SaveFormatError);
    assert.equal(error.code, code);
    if (pattern) assert.match(error.message, pattern);
    return true;
  });
}

test('текущий newGame проходит round-trip без изменений и лишней миграции', () => {
  const state = newGame(123456);
  const before = structuredClone(state);
  const raw = serializeGameSave(state, GENERATION);
  assert.deepEqual(state, before);

  let migrated = 0;
  const loaded = deserializeGameSave(raw, {
    now: 999,
    migrate(current, now) {
      migrated += 1;
      assert.equal(now, 999);
      return current;
    },
  });
  assert.equal(migrated, 1);
  assert.equal(loaded.schemaVersion, SAVE_SCHEMA_VERSION);
  assert.equal(loaded.generation, GENERATION);
  assert.deepEqual(loaded.state, state);
  assert.equal(validateGameStateShape(state), true);
});

test('развитый сейв с customPuzzles не отклоняется', () => {
  const state = newGame(100);
  state.coins = 5432.5;
  state.seals = 17;
  state.materials = { herb: 8, ember: 0 };
  state.inventory.push('wpn_firebird_quill');
  state.puzzlesDone.custom_extra = { moves: 4, hintsUsed: 0, at: 200 };
  state.battlesDone.bt_slimes = { victories: 3, at: 300 };
  state.customPuzzles.push({
    id: 'custom_extra', mechanic: 'seek', name: 'Свой уровень',
    groups: [[{ id: 'cup', x: 0.25, y: 0.5, radius: 0.04 }]],
    nested: { nullable: null, flags: [true, false] },
  });

  const loaded = deserializeGameSave(serializeGameSave(state, GENERATION));
  assert.deepEqual(loaded.state, state);
  assert.deepEqual(loaded.state.customPuzzles[0].groups, state.customPuzzles[0].groups);
});

test('legacy state получает generation из параметров и мигрирует после shape validation', () => {
  const legacy = newGame(10);
  delete legacy.seals;
  delete legacy.materials;
  delete legacy.settings;
  delete legacy.customPuzzles;
  const calls = [];
  const loaded = deserializeGameSave(JSON.stringify(legacy), {
    generation: 'legacy-device-1', now: 777,
    migrate(state, now) {
      calls.push({ state, now });
      return { ...state, seals: 0, materials: {}, settings: {}, customPuzzles: [], migrated: true };
    },
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].now, 777);
  assert.equal(calls[0].state.seals, undefined);
  assert.equal(loaded.generation, 'legacy-device-1');
  assert.equal(loaded.state.migrated, true);
  assert.equal(loaded.state.seals, 0);

  const withoutGeneration = deserializeGameSave(JSON.stringify(legacy));
  assert.equal(withoutGeneration.generation, null);
});

test('future schema получает отдельную русскую ошибку до миграции', () => {
  const state = newGame();
  const raw = JSON.stringify({ schemaVersion: SAVE_SCHEMA_VERSION + 1, generation: GENERATION, state });
  let migrated = false;
  expectCode(() => deserializeGameSave(raw, { migrate: () => { migrated = true; return state; } }),
    'FUTURE_SAVE_SCHEMA', /новой версией игры/);
  assert.equal(migrated, false);
});

test('базовая форма проверяет монеты и ключевые структуры до миграции', () => {
  const negative = newGame();
  negative.coins = -1;
  expectCode(() => validateGameStateShape(negative), 'INVALID_GAME_STATE', /coins/);

  const nonfinite = newGame();
  nonfinite.coins = Infinity;
  expectCode(() => serializeGameSave(nonfinite, GENERATION), 'INVALID_GAME_STATE');

  const wrong = newGame();
  wrong.puzzlesDone = [];
  let migrated = false;
  expectCode(() => deserializeGameSave(JSON.stringify(wrong), {
    migrate: () => { migrated = true; return wrong; },
  }), 'INVALID_GAME_STATE', /puzzlesDone/);
  assert.equal(migrated, false);

  for (const key of ['materials', 'inventory', 'equipped', 'battlesDone', 'settings']) {
    const state = newGame();
    state[key] = key === 'inventory' ? {} : [];
    expectCode(() => validateGameStateShape(state), 'INVALID_GAME_STATE');
  }
});

test('не-JSON значения, циклы и опасные ключи отклоняются на любом уровне', () => {
  for (const value of [undefined, () => {}, NaN, Infinity, 1n, Symbol('x')]) {
    const state = newGame();
    state.extra = { value };
    expectCode(() => serializeGameSave(state, GENERATION), 'INVALID_JSON_VALUE');
  }

  const cyclic = newGame();
  cyclic.extra = {};
  cyclic.extra.self = cyclic.extra;
  expectCode(() => serializeGameSave(cyclic, GENERATION), 'CYCLIC_SAVE');

  for (const key of ['__proto__', 'prototype', 'constructor']) {
    const state = newGame();
    state.extra = JSON.parse(`{"${key}":{"value":1}}`);
    expectCode(() => serializeGameSave(state, GENERATION), 'UNSAFE_SAVE_KEY');
  }
});

test('лимиты размера учитывают UTF-8, глубину и число узлов', () => {
  const state = newGame();
  state.customPuzzles.push({ id: 'custom', name: 'ё'.repeat(200) });
  expectCode(() => serializeGameSave(state, GENERATION, { maxBytes: 500 }), 'SAVE_TOO_LARGE');
  const raw = serializeGameSave(state, GENERATION);
  expectCode(() => deserializeGameSave(raw, { maxBytes: 500 }), 'SAVE_TOO_LARGE');

  const deep = newGame();
  deep.extra = { a: { b: { c: true } } };
  expectCode(() => serializeGameSave(deep, GENERATION, { maxDepth: 5 }), 'SAVE_TOO_DEEP');
  expectCode(() => serializeGameSave(newGame(), GENERATION, { maxNodes: 20 }), 'SAVE_TOO_MANY_NODES');
});

test('результат миграции повторно проверяется', () => {
  const state = newGame();
  expectCode(() => deserializeGameSave(JSON.stringify(state), {
    migrate: () => ({ ...state, coins: Number.NaN }),
  }), 'INVALID_GAME_STATE');

  expectCode(() => deserializeGameSave(JSON.stringify(state), {
    migrate: () => ({ ...state, extra: { dangerous: undefined } }),
  }), 'INVALID_JSON_VALUE');
});

test('повреждённый JSON и некорректная оболочка не проходят', () => {
  expectCode(() => deserializeGameSave('{'), 'INVALID_JSON', /JSON/);
  expectCode(() => deserializeGameSave('null'), 'INVALID_SAVE');
  expectCode(() => deserializeGameSave(JSON.stringify({
    schemaVersion: 1, generation: '', state: newGame(),
  })), 'INVALID_GENERATION');
});
