// Генерируется командой `node tools/build-knight-art.mjs` по реально существующим файлам.
export const KNIGHT_DOLL_ASSET_FILES = new Set([
  'assets/knight/doll/female/body.webp',
  'assets/knight/doll/female/hands.webp',
  'assets/knight/doll/male/body.webp',
  'assets/knight/doll/male/hands.webp',
  'assets/knight/parts/female/arm_ash_wayfarer.webp',
  'assets/knight/parts/male/arm_ash_wayfarer.webp',
  'assets/knight/parts/pot_heal.webp',
  'assets/knight/parts/pot_heal__belt2.webp',
  'assets/knight/parts/shd_wooden.webp',
  'assets/knight/parts/shd_wooden__back.webp',
  'assets/knight/parts/wpn_rusty_sword.webp',
  'assets/knight/room.webp',
]);

export function hasKnightDollAsset(src) {
  return KNIGHT_DOLL_ASSET_FILES.has(src);
}
