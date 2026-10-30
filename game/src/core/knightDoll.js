import { ITEM_BY_ID } from '../data/items.js';
import { PET_BY_ID } from '../data/crew.js';
import { SLOTS, isShieldBlocked } from './items.js';
import {
  KNIGHT_DOLL_BASES,
  KNIGHT_DOLL_BODY_IDS,
  KNIGHT_DOLL_DEFAULT_BODY,
  KNIGHT_DOLL_ITEM_RULES,
  KNIGHT_DOLL_LAYERS,
  KNIGHT_DOLL_PART_ROOT,
  KNIGHT_DOLL_PET_SPOTS,
  KNIGHT_DOLL_SECOND_SLOT,
  hasKnightDollBodyVariant,
} from '../data/knightDoll.js';

function equippedItem(equipment, slot) {
  const item = equipment?.[slot] && ITEM_BY_ID[equipment[slot]];
  if (!item) return null;
  if (slot === 'ring1' || slot === 'ring2') return item.slot === 'ring' ? item : null;
  return item.slot === slot ? item : null;
}

function beltItem(state, index) {
  const item = state?.consumableBelt?.[index] && ITEM_BY_ID[state.consumableBelt[index]];
  return item?.slot === 'consumable' ? item : null;
}

function itemLayerName(item, slot) {
  if (slot === 'ring1' || slot === 'ring2') return 'ring';
  if (slot === 'belt0' || slot === 'belt1') return 'belt';
  if (slot === 'gloves') return 'hands';
  return item.slot;
}

function makeItemLayers(item, slot, bodyId) {
  const rule = KNIGHT_DOLL_ITEM_RULES[item.id] || {};
  const variant = KNIGHT_DOLL_SECOND_SLOT[slot];
  const suffix = variant ? `__${variant.suffix}` : '';
  const root = hasKnightDollBodyVariant(item)
    ? `${KNIGHT_DOLL_PART_ROOT}/${bodyId}`
    : KNIGHT_DOLL_PART_ROOT;
  const common = { itemId: item.id, slot, required: true };
  const layers = [];
  if (rule.back) {
    layers.push({
      ...common,
      key: `${slot}:${item.id}:back`,
      part: 'back',
      layer: 'back',
      src: `${root}/${item.id}__back.webp`,
    });
  }
  layers.push({
    ...common,
    key: `${slot}:${item.id}:main`,
    part: 'main',
    layer: itemLayerName(item, slot),
    src: `${root}/${item.id}${suffix}.webp`,
  });
  if (rule.grip) {
    layers.push({
      ...common,
      key: `${slot}:${item.id}:grip`,
      part: 'grip',
      layer: 'grip',
      src: `${root}/${item.id}__grip.webp`,
    });
  }
  return layers;
}

function withDepth(layer) {
  return { ...layer, z: KNIGHT_DOLL_LAYERS[layer.layer] };
}

export function resolveKnightDoll(state) {
  const equipment = state?.equipped || {};
  const items = [];
  const shieldBlocked = isShieldBlocked(equipment);
  for (const slot of SLOTS) {
    if (slot === 'shield' && shieldBlocked) continue;
    const item = equippedItem(equipment, slot);
    if (item) items.push({ item, slot });
  }
  for (let index = 0; index < 2; index += 1) {
    const item = beltItem(state, index);
    if (item) items.push({ item, slot: `belt${index}` });
  }

  const hiddenBase = new Set();
  for (const { item, slot } of items) {
    if (slot === 'gloves') hiddenBase.add('hands');
    for (const key of KNIGHT_DOLL_ITEM_RULES[item.id]?.hideBase || []) hiddenBase.add(key);
  }

  const requestedBody = state?.settings?.knightBody;
  const bodyId = KNIGHT_DOLL_BODY_IDS.includes(requestedBody) ? requestedBody : KNIGHT_DOLL_DEFAULT_BODY;
  const layers = KNIGHT_DOLL_BASES[bodyId].layers
    .filter((layer) => !hiddenBase.has(layer.key))
    .map((layer) => ({
      ...layer,
      key: `base:${layer.key}`,
      part: 'base',
      itemId: null,
      slot: null,
      required: true,
    }));
  for (const { item, slot } of items) layers.push(...makeItemLayers(item, slot, bodyId));

  const pet = state?.pet && PET_BY_ID[state.pet];
  if (pet) {
    layers.push({
      key: `pet:${pet.id}`,
      part: 'pet',
      itemId: null,
      slot: 'pet',
      layer: 'pet',
      src: `assets/pets/${pet.id}.webp`,
      required: false,
      position: KNIGHT_DOLL_PET_SPOTS[pet.id],
    });
  }
  return layers.map(withDepth).sort((a, b) => a.z - b.z);
}

export function describeKnightDoll(state) {
  const equipment = state?.equipped || {};
  const shieldBlocked = isShieldBlocked(equipment);
  const names = [];
  for (const slot of SLOTS) {
    if (slot === 'shield' && shieldBlocked) continue;
    const item = equippedItem(equipment, slot);
    if (item) names.push(item.name);
  }
  const beltNames = [0, 1].map((index) => beltItem(state, index)?.name).filter(Boolean);
  const pet = state?.pet && PET_BY_ID[state.pet];
  const parts = ['Рыцарь лавки.'];
  parts.push(names.length ? `Надето: ${names.join(', ')}.` : 'Экипировка не надета.');
  if (beltNames.length) parts.push(`На поясе: ${beltNames.join(', ')}.`);
  if (pet) parts.push(`Рядом: ${pet.name}.`);
  return parts.join(' ');
}
