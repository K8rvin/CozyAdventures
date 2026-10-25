// Обменник перекрёстка: потерьчатая услуга для любых материалов, без DOM и state.js.
import { MATERIALS, MATERIAL_BY_ID } from '../data/materials.js';
import { ENEMY_BY_ID } from '../data/enemies.js';

export const BOSS_MATERIAL_IDS = [...new Set(
  Object.values(ENEMY_BY_ID)
    .filter((enemy) => enemy.boss)
    .flatMap((enemy) => enemy.reward?.materials || [])
    .filter((id) => MATERIAL_BY_ID[id]),
)];
const BOSS_MATERIAL_SET = new Set(BOSS_MATERIAL_IDS);

export const REGULAR_MATERIALS = MATERIALS.filter((material) => !BOSS_MATERIAL_SET.has(material.id));
export const BOSS_MATERIALS = BOSS_MATERIAL_IDS.map((id) => MATERIAL_BY_ID[id]);

export function isBossMaterial(id) {
  return BOSS_MATERIAL_SET.has(id);
}

export function materialExchangeTerms(inputId, outputId) {
  if (!MATERIAL_BY_ID[inputId] || !MATERIAL_BY_ID[outputId]) return null;
  if (inputId === outputId || isBossMaterial(outputId)) return null;
  const inputBoss = isBossMaterial(inputId);
  return {
    input: inputId,
    output: outputId,
    cost: inputBoss ? 1 : 3,
    received: inputBoss ? 2 : 1,
    inputBoss,
  };
}

export function materialExchangeInputs(state) {
  return MATERIALS.filter((material) => {
    const have = state.materials?.[material.id] || 0;
    return have >= (isBossMaterial(material.id) ? 1 : 3);
  });
}

export function validateMaterialExchange(state, inputId, outputId) {
  if (!MATERIAL_BY_ID[inputId] || !MATERIAL_BY_ID[outputId]) {
    return { ok: false, error: 'Нет такого материала' };
  }
  if (inputId === outputId) {
    return { ok: false, error: 'Выбери разные материалы для обмена' };
  }
  if (isBossMaterial(outputId)) {
    return { ok: false, error: 'Боссовский материал нельзя получить обменом' };
  }
  const terms = materialExchangeTerms(inputId, outputId);
  const have = Number.isFinite(state.materials?.[inputId])
    ? Math.max(0, Math.floor(state.materials[inputId]))
    : 0;
  if (have < terms.cost) {
    return {
      ...terms, ok: false, have,
      error: `Нужно ${terms.cost} шт. материала для обмена, есть ${have}`,
    };
  }
  return { ...terms, ok: true, have };
}

// Только атомарное изменение складских чисел. Журнал добавляет state.js после успеха.
export function exchangeMaterials(state, inputId, outputId) {
  const check = validateMaterialExchange(state, inputId, outputId);
  if (!check.ok) return check;
  state.materials ||= {};
  state.materials[inputId] -= check.cost;
  if (state.materials[inputId] <= 0) delete state.materials[inputId];
  state.materials[outputId] = (state.materials[outputId] || 0) + check.received;
  return { ...check, ok: true };
}
