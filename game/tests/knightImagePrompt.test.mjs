import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { ITEMS } from '../src/data/items.js';
import { KNIGHT_VISUALS } from '../src/data/knightVisuals.js';
import { newGame } from '../src/core/state.js';
import {
  buildKnightImagePrompt,
  canonicalKnightImageState,
  knightImageCacheKey,
} from '../src/core/knightImagePrompt.js';

test('все 122 предмета имеют визуальное описание и иконку для Gemini', () => {
  assert.equal(ITEMS.length, 122);
  for (const item of ITEMS) {
    assert.ok(KNIGHT_VISUALS[item.id].length > 20, item.id);
    assert.ok(!KNIGHT_VISUALS[item.id].includes('`'), item.id);
    assert.ok(existsSync(new URL(`../assets/items/${item.id}_web.jpg`, import.meta.url)), item.id);
  }
});

test('prompt и key стабильны, референсы соответствуют стартовому комплекту', () => {
  const state = newGame();
  const first = buildKnightImagePrompt(state);
  assert.deepEqual(first.referenceIds, ['body', 'room', 'wpn_rusty_sword', 'shd_wooden']);
  assert.equal(first.bodyId, 'male');
  assert.equal(first.promptVersion, 6);
  assert.match(first.prompt, /old but sharp knight's shortsword/);
  assert.match(first.prompt, /light round linden wood shield/);
  assert.doesNotMatch(first.prompt, /round glass potion bottle/);
  const reordered = { ...state, equipped: Object.fromEntries(Object.entries(state.equipped).reverse()) };
  assert.equal(knightImageCacheKey(reordered), first.key);
});

test('двуручное скрывает щит, необязательные предметы не попадают в референсы', () => {
  const state = newGame();
  state.equipped.weapon = 'wpn_greatsword_oak';
  state.equipped.shield = 'shd_wooden';
  state.equipped.ring1 = 'rng_luck';
  state.equipped.ring2 = 'rng_luck';
  state.consumableBelt = ['pot_heal', 'pot_heal'];
  const result = buildKnightImagePrompt(state);
  assert.deepEqual(result.itemIds, ['wpn_greatsword_oak']);
  assert.ok(!result.referenceIds.includes('shd_wooden'));
  assert.doesNotMatch(result.prompt, /ring1: a simple copper ring/);
  assert.doesNotMatch(result.prompt, /ring2: a simple copper ring/);
  assert.doesNotMatch(result.prompt, /belt0: a round glass potion bottle/);
  assert.doesNotMatch(result.prompt, /belt1: a round glass potion bottle/);
  assert.ok(result.referenceIds.length <= 8);
  state.settings.knightBody = 'female';
  assert.notEqual(knightImageCacheKey(state), result.key);
});

test('невалидное тело безопасно откатывается на male', () => {
  const state = newGame();
  state.settings.knightBody = 'broken';
  assert.equal(canonicalKnightImageState(state).bodyId, 'male');
});

test('чужие id и предметы в неверном слоте отклоняются', () => {
  const state = newGame();
  state.equipped.weapon = 'not-an-item';
  assert.throws(() => buildKnightImagePrompt(state), /Неизвестный предмет/);
  state.equipped.weapon = 'arm_padded';
  assert.throws(() => buildKnightImagePrompt(state), /нельзя надеть/);
  state.equipped.weapon = 'wpn_rusty_sword';
  state.consumableBelt = ['arm_padded'];
  assert.throws(() => buildKnightImagePrompt(state), /нельзя положить на пояс/);
});


test('необязательные предметы не меняют ключ, обязательные меняют, валидация сохраняется', () => {
  const state = newGame();
  const originalKey = knightImageCacheKey(state);
  state.equipped.amulet = ITEMS.find((item) => item.slot === 'amulet').id;
  state.equipped.ring1 = 'rng_luck';
  state.equipped.ring2 = 'rng_luck';
  state.consumableBelt = ['pot_heal', 'pot_heal'];
  assert.equal(knightImageCacheKey(state), originalKey);
  const prompt = buildKnightImagePrompt(state).prompt;
  assert.doesNotMatch(prompt, /ring1:|ring2:|amulet:|belt0:|belt1:/);
  state.equipped.weapon = 'wpn_greatsword_oak';
  assert.notEqual(knightImageCacheKey(state), originalKey);
  state.equipped.amulet = 'not-an-item';
  assert.throws(() => buildKnightImagePrompt(state), /Неизвестный предмет/);
});


test('кастомные образы female_type имеют свои референсы, ключи и adult woman', () => {
  for (const bodyId of ['female_type4', 'female_type5', 'female_type7', 'female_type9', 'female_type11', 'female_type12', 'female_type13']) {
    const state = newGame();
    state.settings.knightBody = bodyId;
    const result = buildKnightImagePrompt(state);
    assert.equal(result.bodyId, bodyId);
    assert.equal(result.promptVersion, 6);
    assert.match(result.prompt, /adult woman knight/);
    assert.match(result.prompt, /ignore its background, border and furniture/);
    assert.match(result.prompt, /Allow the arm and hand positions to change/);
    assert.ok(result.referenceIds.length <= 8);
    assert.notEqual(result.key, buildKnightImagePrompt(newGame()).key);
    assert.ok(existsSync(new URL(`../../art-src/knight/doll/${bodyId}/full.png`, import.meta.url)), bodyId);
    assert.ok(existsSync(new URL(`../assets/knight/doll/${bodyId}/full.png`, import.meta.url)), bodyId);
  }
});
