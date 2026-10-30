import { ITEM_BY_ID } from '../data/items.js';
import { KNIGHT_VISUALS } from '../data/knightVisuals.js';
import { KNIGHT_DOLL_BODY_IDS, KNIGHT_DOLL_DEFAULT_BODY } from '../data/knightDoll.js';
import { SLOTS, isShieldBlocked } from './items.js';

export const KNIGHT_IMAGE_PROMPT_VERSION = 5;

function validItem(id, slot) {
  if (!id) return null;
  const item = ITEM_BY_ID[id];
  if (!item) throw new TypeError(`Неизвестный предмет: ${id}`);
  if (slot === 'ring1' || slot === 'ring2') {
    if (item.slot !== 'ring') throw new TypeError(`Предмет ${id} нельзя надеть в ${slot}`);
  } else if (item.slot !== slot) {
    throw new TypeError(`Предмет ${id} нельзя надеть в ${slot}`);
  }
  return item;
}

export function canonicalKnightImageState(state = {}) {
  const requestedBody = state.settings?.knightBody;
  const bodyId = KNIGHT_DOLL_BODY_IDS.includes(requestedBody) ? requestedBody : KNIGHT_DOLL_DEFAULT_BODY;
  const source = state.equipped || {};
  const shieldBlocked = isShieldBlocked(source);
  const equipped = [];
  for (const slot of SLOTS) {
    if (slot === 'shield' && shieldBlocked) continue;
    const item = validItem(source[slot], slot);
    if (item) equipped.push([slot, item.id]);
  }
  const consumableBelt = [];
  for (let index = 0; index < 2; index += 1) {
    const id = state.consumableBelt?.[index];
    if (!id) continue;
    const item = ITEM_BY_ID[id];
    if (!item || item.slot !== 'consumable') throw new TypeError(`Предмет ${id} нельзя положить на пояс`);
    consumableBelt.push([`belt${index}`, id]);
  }
  return { bodyId, equipped, consumableBelt };
}

export function knightImageCacheKey(state) {
  return `${KNIGHT_IMAGE_PROMPT_VERSION}:${JSON.stringify(canonicalKnightImageState(state))}`;
}

export function buildKnightImagePrompt(state) {
  const canonical = canonicalKnightImageState(state);
  const entries = [...canonical.equipped, ...canonical.consumableBelt];
  const itemIds = [...new Set(entries.map(([, id]) => id))];
  const person = canonical.bodyId === 'female' ? 'adult woman' : 'adult man';
  const equipment = entries.map(([slot, id]) => `- ${slot}: ${KNIGHT_VISUALS[id]}`).join('\n') || '- no equipped items, only the base medieval undergarments';
  const prompt = `Create one coherent full-frame 4:5 illustration of the same ${person} knight in the same warm room.\n`
    + `Reference 1 is the approved fixed ${canonical.bodyId} body and identity. Reference 2 is the approved room. `
    + `References 3 and later are the exact inventory designs for the equipped items.\n`
    + `Preserve the reference face, natural adult anatomy, calm non-combat three-quarter pose, hand and foot positions, camera, crop, character scale, warm light from the upper left and romantic storybook gouache rendering. `
    + `Whenever a one-handed weapon is equipped, its handle must be inside the closed right fist on image left with no gap. Whenever a shield is equipped, it must be mounted on the left forearm on image right and held by the hand or straps. Armor must never move the hands, sword or shield. No equipped weapon or shield may lie on the ground or floor, lean against furniture, rest at the feet, hang on a wall or float in the air. All potions on the belt must remain adjacent at the waist. `
    + `Show the character wearing exactly this equipment with believable placement, contact and size. Do not duplicate any item unless two slots explicitly list the same item ID:\n${equipment}\n`
    + `Keep the base medieval undergarments where they remain visible. Do not include mirrors, mirrored furniture or any reflective surfaces in the room, and do not show any reflection of the knight or another person. Do not add any other equipment, modern clothing, extra weapons, extra accessories, people, animals, text, letters, numbers, logos, watermarks or UI frames.`;
  return {
    key: knightImageCacheKey(state),
    prompt,
    bodyId: canonical.bodyId,
    itemIds,
    referenceIds: ['body', 'room', ...itemIds],
    promptVersion: KNIGHT_IMAGE_PROMPT_VERSION,
  };
}
