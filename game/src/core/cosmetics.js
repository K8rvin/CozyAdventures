import { COSMETIC_BY_ID, LEGACY_COSMETIC_ALIASES } from '../data/cosmetics.js';

export const LAVKA_LAYOUT_ID = 'lavka_base_3x1';
export const BASE_LAVKA_BACKGROUND = 'assets/hub/hub_banner_web.jpg';
export const COSMETIC_SCENE_BASE = {
  lavka: { src: BASE_LAVKA_BACKGROUND, layoutId: LAVKA_LAYOUT_ID },
  square: { src: 'assets/hub/town_square_v2_web.jpg', layoutId: 'square_v2_3x1' },
  market: { src: 'assets/hub/town_market_v2_web.jpg', layoutId: 'market_v2_3x1' },
  cabinet: { src: 'assets/hub/trophy_room_v2_web.jpg', layoutId: 'cabinet_v2_3x1' },
};

export function canonicalCosmeticId(id) {
  return LEGACY_COSMETIC_ALIASES[id] || id;
}

export function activeCosmeticId(state) {
  const active = Array.isArray(state?.cosmeticsActive) ? state.cosmeticsActive : [];
  return active.length > 0 ? canonicalCosmeticId(active[active.length - 1]) : null;
}

// На входе допустимы и pack id, и старые alias id; на выходе — только реальные
// cos_* overlays, которые ещё умеет рисовать прежний fallback.
export function legacyCosmeticIds(state, selectedId = activeCosmeticId(state)) {
  if (!selectedId) return [];
  const legacy = Array.isArray(state?.legacyCosmeticsActive)
    ? state.legacyCosmeticsActive
    : (Array.isArray(state?.cosmeticsActive) ? state.cosmeticsActive : []);
  const ids = legacy.flatMap((id) => {
    if (LEGACY_COSMETIC_ALIASES[id]) return [id];
    if (COSMETIC_BY_ID[id]) {
      return Object.keys(LEGACY_COSMETIC_ALIASES)
        .filter((legacyId) => LEGACY_COSMETIC_ALIASES[legacyId] === id);
    }
    return [];
  });
  return [...new Set(ids)];
}

export function resolveCosmeticBackground(state, { scene = 'lavka', layoutId } = {}) {
  const base = COSMETIC_SCENE_BASE[scene] || COSMETIC_SCENE_BASE.lavka;
  const selectedId = activeCosmeticId(state);
  const def = selectedId ? COSMETIC_BY_ID[selectedId] : null;
  const variant = def?.scenes?.[scene] || null;
  const acceptedLayout = layoutId ?? variant?.layoutId ?? base.layoutId;
  const full = !!(def && def.kind === 'background' && variant?.src
    && variant.layoutId === acceptedLayout);
  return {
    selectedId,
    id: full ? selectedId : null,
    src: full ? variant.src : base.src,
    fallbackSrc: base.src,
    layoutId: full ? variant.layoutId : base.layoutId,
    full,
    legacyIds: scene === 'lavka' ? legacyCosmeticIds(state, selectedId) : [],
  };
}
