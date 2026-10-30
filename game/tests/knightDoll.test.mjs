import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { ITEMS } from '../src/data/items.js';
import { emptyEquipment, SLOTS } from '../src/core/items.js';
import { newGame } from '../src/core/state.js';
import { describeKnightDoll, resolveKnightDoll } from '../src/core/knightDoll.js';
import {
  KNIGHT_DOLL_BASE_LAYERS,
  KNIGHT_DOLL_BASES,
  KNIGHT_DOLL_BODY_IDS,
  KNIGHT_DOLL_ITEM_RULES,
  KNIGHT_DOLL_LAYERS,
  KNIGHT_DOLL_SECOND_SLOT,
  KNIGHT_DOLL_SIZE,
  hasKnightDollBodyVariant,
} from '../src/data/knightDoll.js';
import { KNIGHT_DOLL_ASSET_FILES } from '../src/data/knightDollAssets.js';

const PROMPTS = readFileSync(new URL('../../art-src/PROMPTS_KNIGHT.md', import.meta.url), 'utf8');

function bareState() {
  return { equipped: emptyEquipment(), consumableBelt: [], pet: null };
}

function stateWith(item, secondSlot = false) {
  const state = bareState();
  if (item.slot === 'consumable') state.consumableBelt[secondSlot ? 1 : 0] = item.id;
  else if (item.slot === 'ring') state.equipped[secondSlot ? 'ring2' : 'ring1'] = item.id;
  else state.equipped[item.slot] = item.id;
  return state;
}

function expectedSources() {
  const sources = new Set(KNIGHT_DOLL_BODY_IDS.flatMap((bodyId) => (
    KNIGHT_DOLL_BASES[bodyId].layers.map((layer) => layer.src)
  )));
  for (const item of ITEMS) {
    const roots = hasKnightDollBodyVariant(item)
      ? KNIGHT_DOLL_BODY_IDS.map((bodyId) => `assets/knight/parts/${bodyId}`)
      : ['assets/knight/parts'];
    for (const root of roots) {
      sources.add(`${root}/${item.id}.webp`);
      if (KNIGHT_DOLL_ITEM_RULES[item.id]?.back) sources.add(`${root}/${item.id}__back.webp`);
      if (KNIGHT_DOLL_ITEM_RULES[item.id]?.grip) sources.add(`${root}/${item.id}__grip.webp`);
    }
    if (item.slot === 'ring') sources.add(`assets/knight/parts/${item.id}__ring2.webp`);
    if (item.slot === 'consumable') sources.add(`assets/knight/parts/${item.id}__belt2.webp`);
  }
  return sources;
}

function webpInfo(buffer) {
  assert.equal(buffer.toString('ascii', 0, 4), 'RIFF');
  assert.equal(buffer.toString('ascii', 8, 12), 'WEBP');
  let offset = 12;
  let width = null;
  let height = null;
  let alpha = false;
  while (offset + 8 <= buffer.length) {
    const chunk = buffer.toString('ascii', offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const data = offset + 8;
    if (data + size > buffer.length) break;
    if (chunk === 'VP8X') {
      alpha ||= !!(buffer[data] & 0x10);
      width = 1 + buffer.readUIntLE(data + 4, 3);
      height = 1 + buffer.readUIntLE(data + 7, 3);
    } else if (chunk === 'VP8L') {
      const bits = buffer.readUInt32LE(data + 1);
      width = (bits & 0x3fff) + 1;
      height = ((bits >>> 14) & 0x3fff) + 1;
      alpha ||= !!((bits >>> 28) & 1);
    } else if (chunk === 'VP8 ') {
      width = buffer.readUInt16LE(data + 6) & 0x3fff;
      height = buffer.readUInt16LE(data + 8) & 0x3fff;
    } else if (chunk === 'ALPH') {
      alpha = true;
    }
    offset = data + size + (size % 2);
  }
  return { width, height, alpha };
}

test('пустой рыцарь состоит из базовых слоёв в стабильном порядке', () => {
  const state = bareState();
  const snapshot = JSON.stringify(state);
  const layers = resolveKnightDoll(state);
  assert.equal(layers.length, KNIGHT_DOLL_BASE_LAYERS.length);
  assert.deepEqual(layers.map((layer) => layer.key), KNIGHT_DOLL_BASE_LAYERS.map((layer) => `base:${layer.key}`));
  assert.ok(layers.every((layer) => layer.required && Number.isFinite(layer.z)));
  assert.equal(new Set(layers.map((layer) => layer.key)).size, layers.length);
  assert.equal(JSON.stringify(state), snapshot);
  assert.match(describeKnightDoll(state), /Экипировка не надета/);
});

test('стартовый комплект содержит меч, щит и зелье на поясе', () => {
  const layers = resolveKnightDoll(newGame());
  const main = layers.filter((layer) => layer.itemId && layer.part === 'main');
  assert.deepEqual(main.map((layer) => layer.itemId), ['wpn_rusty_sword', 'shd_wooden', 'pot_heal']);
  assert.ok(layers.some((layer) => layer.slot === 'belt0' && layer.layer === 'belt'));
  assert.match(describeKnightDoll(newGame()), /Дедов меч/);
  assert.match(describeKnightDoll(newGame()), /Зелье лечения/);
});

test('каждый предмет имеет собственный основной слой и строку в art contract', () => {
  assert.equal(ITEMS.length, 122);
  for (const item of ITEMS) {
    const state = stateWith(item);
    const snapshot = JSON.stringify(state);
    const layers = resolveKnightDoll(state);
    const main = layers.filter((layer) => layer.itemId === item.id && layer.part === 'main');
    assert.equal(main.length, 1, item.id);
    const root = hasKnightDollBodyVariant(item)
      ? 'assets/knight/parts/male'
      : 'assets/knight/parts';
    assert.equal(main[0].src, `${root}/${item.id}.webp`, item.id);
    assert.equal(main[0].z, KNIGHT_DOLL_LAYERS[main[0].layer], item.id);
    assert.ok(main[0].z >= 0, item.id);
    assert.equal(JSON.stringify(state), snapshot, `${item.id}: resolver мутировал state`);
    assert.ok(describeKnightDoll(state).includes(item.name), `${item.id}: нет русского имени в описании`);
    assert.ok(PROMPTS.includes(`\`${item.id}\``), `${item.id}: нет записи в PROMPTS_KNIGHT.md`);
    const rule = KNIGHT_DOLL_ITEM_RULES[item.id] || {};
    assert.equal(layers.some((layer) => layer.itemId === item.id && layer.part === 'back'), !!rule.back, item.id);
    assert.equal(layers.some((layer) => layer.itemId === item.id && layer.part === 'grip'), !!rule.grip, item.id);
  }
});

test('вторые кольцо и расходник используют свои варианты и не схлопывают дубли', () => {
  const state = bareState();
  state.equipped.ring1 = 'rng_luck';
  state.equipped.ring2 = 'rng_luck';
  state.consumableBelt = ['pot_heal', 'pot_heal'];
  const layers = resolveKnightDoll(state).filter((layer) => layer.part === 'main');
  const ring1 = layers.find((layer) => layer.slot === 'ring1');
  const ring2 = layers.find((layer) => layer.slot === 'ring2');
  const belt0 = layers.find((layer) => layer.slot === 'belt0');
  const belt1 = layers.find((layer) => layer.slot === 'belt1');
  assert.equal(ring1.src, 'assets/knight/parts/rng_luck.webp');
  assert.equal(ring2.src, 'assets/knight/parts/rng_luck__ring2.webp');
  assert.equal(belt0.src, 'assets/knight/parts/pot_heal.webp');
  assert.equal(belt1.src, 'assets/knight/parts/pot_heal__belt2.webp');
  assert.notEqual(ring1.key, ring2.key);
  assert.notEqual(belt0.key, belt1.key);
  assert.equal(KNIGHT_DOLL_SECOND_SLOT.ring2.suffix, 'ring2');
  assert.equal(KNIGHT_DOLL_SECOND_SLOT.belt1.suffix, 'belt2');
});

test('двуручное скрывает щит даже в повреждённом сейве', () => {
  const state = bareState();
  state.equipped.weapon = 'wpn_greatsword_oak';
  state.equipped.shield = 'shd_wooden';
  const layers = resolveKnightDoll(state);
  assert.ok(layers.some((layer) => layer.itemId === 'wpn_greatsword_oak'));
  assert.ok(!layers.some((layer) => layer.slot === 'shield'));
  assert.ok(!describeKnightDoll(state).includes('Щит из липы'));
});

test('перчатки заменяют базовые кисти, а плащ и лук имеют заднюю часть', () => {
  const gloves = resolveKnightDoll(stateWith(ITEMS.find((item) => item.id === 'glv_herbalist')));
  assert.ok(!gloves.some((layer) => layer.key === 'base:hands'));
  assert.equal(gloves.find((layer) => layer.itemId === 'glv_herbalist').layer, 'hands');

  for (const id of ['arm_ink_cloak', 'arm_swamp_weave', 'wpn_hunter_bow']) {
    const item = ITEMS.find((candidate) => candidate.id === id);
    const layers = resolveKnightDoll(stateWith(item));
    const back = layers.find((layer) => layer.itemId === id && layer.part === 'back');
    const body = layers.find((layer) => layer.key === 'base:body');
    const root = hasKnightDollBodyVariant(item)
      ? 'assets/knight/parts/male'
      : 'assets/knight/parts';
    assert.equal(back.src, `${root}/${id}__back.webp`);
    assert.ok(back.z < body.z, `${id}: задняя часть должна быть под телом`);
  }
});

test('male/female меняют базу и броню, а невалидное тело откатывается на male', () => {
  const item = ITEMS.find((candidate) => candidate.id === 'arm_ash_wayfarer');
  const maleState = stateWith(item);
  const femaleState = stateWith(item);
  femaleState.settings = { knightBody: 'female' };
  const maleLayers = resolveKnightDoll(maleState);
  const femaleLayers = resolveKnightDoll(femaleState);
  assert.equal(maleLayers.find((layer) => layer.key === 'base:body').src, 'assets/knight/doll/male/body.webp');
  assert.equal(femaleLayers.find((layer) => layer.key === 'base:body').src, 'assets/knight/doll/female/body.webp');
  assert.equal(maleLayers.find((layer) => layer.itemId === item.id).src, 'assets/knight/parts/male/arm_ash_wayfarer.webp');
  assert.equal(femaleLayers.find((layer) => layer.itemId === item.id).src, 'assets/knight/parts/female/arm_ash_wayfarer.webp');
  assert.equal(newGame().settings.knightBody, 'male');

  femaleState.settings.knightBody = 'broken';
  const fallbackLayers = resolveKnightDoll(femaleState);
  assert.equal(fallbackLayers.find((layer) => layer.key === 'base:body').src, 'assets/knight/doll/male/body.webp');
  assert.equal(fallbackLayers.find((layer) => layer.itemId === item.id).src, 'assets/knight/parts/male/arm_ash_wayfarer.webp');
});

test('меч и щит unisex на обоих телах, а части щита огибают руку', () => {
  for (const bodyId of KNIGHT_DOLL_BODY_IDS) {
    const state = newGame();
    state.settings.knightBody = bodyId;
    const layers = resolveKnightDoll(state);
    const root = 'assets/knight/parts';
    const body = layers.find((layer) => layer.key === 'base:body');
    const hands = layers.find((layer) => layer.key === 'base:hands');
    const sword = layers.find((layer) => layer.itemId === 'wpn_rusty_sword');
    const shield = layers.find((layer) => layer.itemId === 'shd_wooden' && layer.part === 'main');
    const shieldBack = layers.find((layer) => layer.itemId === 'shd_wooden' && layer.part === 'back');
    assert.equal(sword.src, `${root}/wpn_rusty_sword.webp`);
    assert.ok(sword.z < hands.z);
    assert.equal(shield.src, `${root}/shd_wooden.webp`);
    assert.equal(shieldBack.src, `${root}/shd_wooden__back.webp`);
    assert.ok(shieldBack.z < body.z);
    assert.ok(body.z < hands.z);
    assert.ok(hands.z < shield.z);
    assert.equal(layers.filter((layer) => layer.itemId === 'shd_wooden').length, 2);
  }
});

test('питомец отдельный optional-слой, невалидные данные безопасно игнорируются', () => {
  const state = bareState();
  state.pet = 'pet_fox';
  const layers = resolveKnightDoll(state);
  const pet = layers.find((layer) => layer.slot === 'pet');
  assert.equal(pet.src, 'assets/pets/pet_fox.webp');
  assert.equal(pet.required, false);
  assert.ok(pet.position.width > 0);
  assert.match(describeKnightDoll(state), /Лисёнок/);

  state.pet = 'unknown_pet';
  state.equipped.weapon = 'arm_chain';
  state.equipped.helmet = 'missing';
  state.consumableBelt = ['wpn_rusty_sword', 'missing'];
  const invalid = resolveKnightDoll(state);
  assert.equal(invalid.length, KNIGHT_DOLL_BASE_LAYERS.length);
  assert.ok(!invalid.some((layer) => layer.slot === 'pet'));
});

test('размеры кадра едины, а depth покрывает все базовые и предметные слои', () => {
  assert.equal(KNIGHT_DOLL_SIZE.width * 5, KNIGHT_DOLL_SIZE.height * 4);
  for (const item of ITEMS) {
    for (const second of [false, true]) {
      for (const layer of resolveKnightDoll(stateWith(item, second))) {
        assert.equal(layer.z, KNIGHT_DOLL_LAYERS[layer.layer], `${item.id}: ${layer.layer}`);
      }
    }
  }
  for (const slot of SLOTS) assert.ok(slot);
});

test('manifest содержит только ожидаемые и реально существующие WebP нужного кадра', () => {
  const expected = expectedSources();
  for (const src of KNIGHT_DOLL_ASSET_FILES) {
    assert.ok(expected.has(src), `лишний файл в manifest: ${src}`);
    const url = new URL(`../${src}`, import.meta.url);
    assert.ok(existsSync(url), `manifest ссылается на отсутствующий файл: ${src}`);
    const buffer = readFileSync(url);
    assert.ok(buffer.length > 30, src);
    const info = webpInfo(buffer);
    assert.deepEqual([info.width, info.height], [KNIGHT_DOLL_SIZE.width, KNIGHT_DOLL_SIZE.height], src);
    if (src !== 'assets/knight/room.webp') assert.ok(info.alpha, `${src}: нет альфа-канала`);
  }
});
