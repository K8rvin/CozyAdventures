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
  assert.deepEqual(first.referenceIds, ['body', 'room', 'wpn_rusty_sword', 'shd_wooden', 'pot_heal']);
  assert.equal(first.bodyId, 'male');
  assert.equal(first.promptVersion, 5);
  assert.match(first.prompt, /old but sharp knight's shortsword/);
  assert.match(first.prompt, /light round linden wood shield/);
  assert.match(first.prompt, /round glass potion bottle/);
  const reordered = { ...state, equipped: Object.fromEntries(Object.entries(state.equipped).reverse()) };
  assert.equal(knightImageCacheKey(reordered), first.key);
});

test('двуручное скрывает щит, дубликаты не увеличивают референсы, тело меняет key', () => {
  const state = newGame();
  state.equipped.weapon = 'wpn_greatsword_oak';
  state.equipped.shield = 'shd_wooden';
  state.equipped.ring1 = 'rng_luck';
  state.equipped.ring2 = 'rng_luck';
  state.consumableBelt = ['pot_heal', 'pot_heal'];
  const result = buildKnightImagePrompt(state);
  assert.deepEqual(result.itemIds, ['wpn_greatsword_oak', 'rng_luck', 'pot_heal']);
  assert.ok(!result.referenceIds.includes('shd_wooden'));
  assert.match(result.prompt, /ring1: a simple copper ring/);
  assert.match(result.prompt, /ring2: a simple copper ring/);
  assert.match(result.prompt, /belt0: a round glass potion bottle/);
  assert.match(result.prompt, /belt1: a round glass potion bottle/);
  assert.ok(result.referenceIds.length <= 13);
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
