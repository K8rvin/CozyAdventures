import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MATERIALS } from '../src/data/materials.js';
import { RECIPES } from '../src/data/recipes.js';
import { ENEMY_BY_ID } from '../src/data/enemies.js';
import {
  REGULAR_MATERIALS, BOSS_MATERIALS, BOSS_MATERIAL_IDS, isBossMaterial,
  materialExchangeTerms, validateMaterialExchange, exchangeMaterials, materialExchangeInputs,
} from '../src/core/materialExchange.js';
import { newGame, exchangeMaterial } from '../src/core/state.js';

const bossIdsFromEnemies = [...new Set(Object.values(ENEMY_BY_ID)
  .filter((enemy) => enemy.boss)
  .flatMap((enemy) => enemy.reward?.materials || []))].sort();

test('каждый материал используется в рецепте или допустим как вход обмена', () => {
  const used = new Set(RECIPES.flatMap((recipe) => Object.keys(recipe.materials)));
  assert.equal(MATERIALS.length, 57);
  assert.deepEqual([...BOSS_MATERIAL_IDS].sort(), bossIdsFromEnemies);
  assert.equal(BOSS_MATERIALS.length, 12, 'курс выводится из фактических boss-enemies/rewards');
  assert.equal(REGULAR_MATERIALS.length, 45);

  for (const material of MATERIALS) {
    const output = REGULAR_MATERIALS.find((candidate) => candidate.id !== material.id);
    const terms = materialExchangeTerms(material.id, output.id);
    assert.ok(used.has(material.id) || terms, `${material.id}: нет применения`);
    assert.ok(terms, `${material.id}: допустим как вход`);
    assert.equal(terms.cost, isBossMaterial(material.id) ? 1 : 3);
    assert.equal(terms.received, isBossMaterial(material.id) ? 2 : 1);

    const state = newGame();
    state.materials = { [material.id]: terms.cost };
    const result = exchangeMaterials(state, material.id, output.id);
    assert.equal(result.ok, true, `${material.id}: реальный обмен возможен`);
    assert.ok(Object.values(state.materials).every((count) => count >= 0));
  }
});

test('каждый обычный материал доступен как выход, боссовский получить нельзя', () => {
  for (const output of REGULAR_MATERIALS) {
    const input = MATERIALS.find((material) => material.id !== output.id);
    assert.ok(materialExchangeTerms(input.id, output.id), `${output.id}: доступен как выход`);
  }
  for (const boss of BOSS_MATERIALS) {
    assert.equal(materialExchangeTerms('slime_jelly', boss.id), null);
    const state = newGame();
    state.materials.slime_jelly = 99;
    const result = validateMaterialExchange(state, 'slime_jelly', boss.id);
    assert.equal(result.ok, false);
    assert.match(result.error, /нельзя получить обменом/);
  }
});

test('курсы 3→1 и 1→2, один журнал на успех и ни одного на ошибку', () => {
  const state = newGame();
  state.materials = { nm_mask_shard: 6, willow_heart: 1 };
  const ordinary = exchangeMaterial(state, 'nm_mask_shard', 'slime_jelly');
  assert.deepEqual(
    { input: ordinary.input, output: ordinary.output, cost: ordinary.cost, received: ordinary.received },
    { input: 'nm_mask_shard', output: 'slime_jelly', cost: 3, received: 1 },
  );
  assert.equal(state.materials.nm_mask_shard, 3);
  assert.equal(state.materials.slime_jelly, 1);
  assert.equal(state.journal.length, 1);

  const boss = exchangeMaterial(state, 'willow_heart', 'honey');
  assert.equal(boss.cost, 1);
  assert.equal(boss.received, 2);
  assert.equal(state.materials.willow_heart, undefined);
  assert.equal(state.materials.honey, 2);
  assert.equal(state.journal.length, 2, 'каждый успешный вызов пишет ровно одну запись');

  const second = exchangeMaterial(state, 'nm_mask_shard', 'slime_jelly');
  assert.equal(second.ok, true);
  assert.equal(state.materials.nm_mask_shard, undefined);
  assert.equal(state.materials.slime_jelly, 2);
  assert.equal(state.journal.length, 3);

  const beforeFailure = structuredClone(state);
  const failure = exchangeMaterial(state, 'nm_mask_shard', 'slime_jelly');
  assert.equal(failure.ok, false);
  assert.match(failure.error, /Нужно 3/);
  assert.deepEqual(state, beforeFailure, 'нехватка не меняет склад и не дублирует журнал');
  const same = exchangeMaterial(state, 'slime_jelly', 'slime_jelly');
  assert.equal(same.ok, false);
  assert.match(same.error, /разные материалы/);
  assert.deepEqual(state, beforeFailure);
});

test('обмен не уходит в минус и не зависит от materialsFind/itemFind, монет или энергии', () => {
  const state = newGame(0);
  state.materials = { slime_jelly: 2 };
  state.pet = 'pet_horse';
  state.squadCompanions = ['cmp_firefly'];
  state.equipped.ring1 = 'rng_luck';
  const before = structuredClone(state);
  const result = exchangeMaterial(state, 'slime_jelly', 'honey');
  assert.equal(result.ok, false);
  assert.deepEqual(state, before, 'нет частичного списания при нехватке');

  state.materials.slime_jelly = 3;
  const success = exchangeMaterial(state, 'slime_jelly', 'honey');
  assert.equal(success.cost, 3);
  assert.equal(success.received, 1, 'бонусы находок не меняют курс');
  assert.equal(state.materials.honey, 1);
  assert.equal(state.coins, before.coins);
  assert.equal(state.seals, before.seals);
  assert.deepEqual(state.battleEnergy, before.battleEnergy);
});

test('input select получает только достаточные запасы, core не импортирует state.js', () => {
  const state = newGame();
  state.materials = { slime_jelly: 2, honey: 3, willow_heart: 1, captain_badge: 0 };
  assert.deepEqual(materialExchangeInputs(state).map((material) => material.id), ['honey', 'willow_heart']);

  const source = readFileSync(new URL('../src/core/materialExchange.js', import.meta.url), 'utf8');
  assert.ok(!source.includes("from './state.js'"));
});
