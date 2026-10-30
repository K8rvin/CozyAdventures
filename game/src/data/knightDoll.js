export const KNIGHT_DOLL_SIZE = Object.freeze({ width: 768, height: 960 });
export const KNIGHT_DOLL_PART_ROOT = 'assets/knight/parts';

export const KNIGHT_DOLL_LAYERS = Object.freeze({
  room: 0,
  back: 10,
  hairBack: 15,
  body: 20,
  boots: 30,
  armor: 40,
  hairFront: 45,
  weapon: 50,
  hands: 60,
  grip: 65,
  shield: 70,
  amulet: 80,
  belt: 85,
  ring: 90,
  helmet: 100,
  pet: 110,
});

export const KNIGHT_DOLL_BODY_IDS = Object.freeze(['male', 'female']);
export const KNIGHT_DOLL_DEFAULT_BODY = 'male';
export const KNIGHT_DOLL_BODY_VARIANT_SLOTS = Object.freeze(['armor']);
export const KNIGHT_DOLL_BODY_VARIANT_ITEMS = Object.freeze([]);

export function hasKnightDollBodyVariant(item) {
  return KNIGHT_DOLL_BODY_VARIANT_SLOTS.includes(item.slot) || KNIGHT_DOLL_BODY_VARIANT_ITEMS.includes(item.id);
}

export const KNIGHT_DOLL_BASES = {
  male: {
    layers: [
      { key: 'room', src: 'assets/knight/room.webp', layer: 'room' },
      { key: 'body', src: 'assets/knight/doll/male/body.webp', layer: 'body' },
      { key: 'hands', src: 'assets/knight/doll/male/hands.webp', layer: 'hands' },
    ],
  },
  female: {
    layers: [
      { key: 'room', src: 'assets/knight/room.webp', layer: 'room' },
      { key: 'body', src: 'assets/knight/doll/female/body.webp', layer: 'body' },
      { key: 'hands', src: 'assets/knight/doll/female/hands.webp', layer: 'hands' },
    ],
  },
};

export const KNIGHT_DOLL_BASE_LAYERS = KNIGHT_DOLL_BASES[KNIGHT_DOLL_DEFAULT_BODY].layers;

export const KNIGHT_DOLL_ITEM_RULES = {
  arm_ink_cloak: { back: true },
  arm_swamp_weave: { back: true },
  wpn_hunter_bow: { back: true },
  shd_wooden: { back: true },
  hlm_leather: { hideBase: ['hairBack', 'hairFront'] },
  hlm_page_wanderer: { hideBase: ['hairBack', 'hairFront'] },
  hlm_nm_lantern: { hideBase: ['hairBack'] },
};

export const KNIGHT_DOLL_SECOND_SLOT = {
  ring2: { suffix: 'ring2', dx: 0.23, dy: 0.005 },
  belt1: { suffix: 'belt2', dx: 0.062, dy: 0 },
};

export const KNIGHT_DOLL_PET_SPOTS = {
  pet_puppy: { x: 79, y: 84, width: 28, flip: true },
  pet_hedgehog: { x: 80, y: 88, width: 21 },
  pet_fox: { x: 80, y: 82, width: 30 },
  pet_horse: { x: 82, y: 78, width: 52 },
  pet_owl: { x: 82, y: 35, width: 19 },
};
