export const SAVE_SCHEMA_VERSION = 1;
export const SAVE_MAX_BYTES = 4 * 1024 * 1024;
export const SAVE_MAX_DEPTH = 64;
export const SAVE_MAX_NODES = 250000;

const DANGEROUS_KEYS = new Set(['__proto__', 'prototype', 'constructor']);
const encoder = new TextEncoder();

export class SaveFormatError extends Error {
  constructor(message, code = 'INVALID_SAVE') {
    super(message);
    this.name = 'SaveFormatError';
    this.code = code;
  }
}

function fail(message, code) {
  throw new SaveFormatError(message, code);
}

function isRecord(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function validateGeneration(generation) {
  if (typeof generation !== 'string' || !generation.trim() || generation.length > 256) {
    fail('Некорректный идентификатор поколения сохранения.', 'INVALID_GENERATION');
  }
}

function validateJson(value, options = {}) {
  const maxDepth = options.maxDepth ?? SAVE_MAX_DEPTH;
  const maxNodes = options.maxNodes ?? SAVE_MAX_NODES;
  const ancestors = new Set();
  let nodes = 0;

  function visit(current, depth) {
    nodes += 1;
    if (nodes > maxNodes) fail('Сохранение содержит слишком много элементов.', 'SAVE_TOO_MANY_NODES');
    if (depth > maxDepth) fail('Сохранение имеет слишком большую вложенность.', 'SAVE_TOO_DEEP');
    if (current === null || typeof current === 'string' || typeof current === 'boolean') return;
    if (typeof current === 'number') {
      if (!Number.isFinite(current)) fail('Сохранение содержит некорректное число.', 'INVALID_JSON_VALUE');
      return;
    }
    if (typeof current !== 'object') fail('Сохранение содержит значение, которое нельзя записать в JSON.', 'INVALID_JSON_VALUE');
    if (ancestors.has(current)) fail('Сохранение содержит циклическую ссылку.', 'CYCLIC_SAVE');
    if (!Array.isArray(current) && !isRecord(current)) fail('Сохранение должно содержать только простые JSON-объекты.', 'INVALID_JSON_VALUE');
    if (Object.getOwnPropertySymbols(current).length > 0) fail('Сохранение содержит неподдерживаемые ключи.', 'INVALID_JSON_VALUE');

    ancestors.add(current);
    for (const key of Object.keys(current)) {
      if (DANGEROUS_KEYS.has(key)) fail(`Сохранение содержит опасный ключ «${key}».`, 'UNSAFE_SAVE_KEY');
      const descriptor = Object.getOwnPropertyDescriptor(current, key);
      if (descriptor?.get || descriptor?.set) fail('Сохранение содержит вычисляемые свойства.', 'INVALID_JSON_VALUE');
      visit(current[key], depth + 1);
    }
    ancestors.delete(current);
  }

  visit(value, 1);
  return true;
}

function requireNonnegative(state, key) {
  if (!Number.isFinite(state[key]) || state[key] < 0) {
    fail(`Некорректное сохранение: поле ${key} должно быть конечным неотрицательным числом.`, 'INVALID_GAME_STATE');
  }
}

function requireRecord(state, key, required = true) {
  if (state[key] === undefined && !required) return;
  if (!isRecord(state[key])) fail(`Некорректное сохранение: поле ${key} должно быть объектом.`, 'INVALID_GAME_STATE');
}

function requireArray(state, key, required = false) {
  if (state[key] === undefined && !required) return;
  if (!Array.isArray(state[key])) fail(`Некорректное сохранение: поле ${key} должно быть массивом.`, 'INVALID_GAME_STATE');
}

function validateRecordValues(record, path, validate) {
  for (const [key, value] of Object.entries(record)) validate(value, `${path}.${key}`);
}

export function validateGameStateShape(state) {
  if (!isRecord(state)) fail('Состояние игры должно быть простым объектом.', 'INVALID_GAME_STATE');
  requireNonnegative(state, 'coins');
  if (state.seals !== undefined) requireNonnegative(state, 'seals');

  requireArray(state, 'inventory', true);
  requireRecord(state, 'equipped');
  requireRecord(state, 'puzzlesDone');
  requireRecord(state, 'battlesDone');
  requireRecord(state, 'stats');
  for (const key of ['materials', 'settings', 'battleLoreSeen', 'bossDrops', 'seekOverrides',
    'achievements', 'achievementStats', 'tutorial', 'onboarding', 'story', 'formation', 'cheats', 'battleEnergy']) {
    requireRecord(state, key, false);
  }
  for (const key of ['consumableBelt', 'crew', 'squadCompanions', 'squadMercs', 'customPuzzles',
    'cosmeticsOwned', 'cosmeticsActive', 'legacyCosmeticsActive', 'shopSeenStock', 'inventorySeen',
    'trophies', 'trophiesSeen', 'journal']) requireArray(state, key);

  if (state.savingsGoal !== undefined && state.savingsGoal !== null && !isRecord(state.savingsGoal)) {
    fail('Некорректное сохранение: поле savingsGoal должно быть объектом или null.', 'INVALID_GAME_STATE');
  }
  for (const key of ['pet', 'lastDailyBonus', 'lastCatGift']) {
    if (state[key] !== undefined && state[key] !== null && typeof state[key] !== 'string') {
      fail(`Некорректное сохранение: поле ${key} должно быть строкой или null.`, 'INVALID_GAME_STATE');
    }
  }
  for (const id of state.inventory) {
    if (typeof id !== 'string') fail('Некорректное сохранение: inventory должен содержать только идентификаторы.', 'INVALID_GAME_STATE');
  }
  for (const id of Object.values(state.equipped)) {
    if (id !== null && typeof id !== 'string') fail('Некорректное сохранение: equipped содержит некорректный предмет.', 'INVALID_GAME_STATE');
  }
  if (state.materials) {
    validateRecordValues(state.materials, 'materials', (value, path) => {
      if (!Number.isFinite(value) || value < 0) fail(`Некорректное количество материала в ${path}.`, 'INVALID_GAME_STATE');
    });
  }
  validateRecordValues(state.puzzlesDone, 'puzzlesDone', (value, path) => {
    if (!isRecord(value)) fail(`Некорректная запись прогресса ${path}.`, 'INVALID_GAME_STATE');
  });
  validateRecordValues(state.battlesDone, 'battlesDone', (value, path) => {
    if (!isRecord(value)) fail(`Некорректная запись похода ${path}.`, 'INVALID_GAME_STATE');
    if (value.victories !== undefined && (!Number.isFinite(value.victories) || value.victories < 0)) {
      fail(`Некорректное число побед в ${path}.`, 'INVALID_GAME_STATE');
    }
  });
  if (state.customPuzzles) {
    for (const puzzle of state.customPuzzles) {
      if (!isRecord(puzzle)) fail('Некорректное сохранение: customPuzzles должен содержать объекты уровней.', 'INVALID_GAME_STATE');
    }
  }
  for (const key of ['puzzlesSolved', 'battlesWon', 'coinsEarned', 'itemsBought', 'itemsCrafted', 'catPets']) {
    if (state.stats[key] !== undefined && (!Number.isFinite(state.stats[key]) || state.stats[key] < 0)) {
      fail(`Некорректное сохранение: поле stats.${key} должно быть неотрицательным числом.`, 'INVALID_GAME_STATE');
    }
  }
  return true;
}

function checkMaxBytes(maxBytes) {
  if (!Number.isInteger(maxBytes) || maxBytes <= 0) fail('Лимит размера сохранения должен быть положительным целым числом.', 'INVALID_SAVE_LIMIT');
}

export function serializeGameSave(state, generation, options = {}) {
  const maxBytes = options.maxBytes ?? SAVE_MAX_BYTES;
  checkMaxBytes(maxBytes);
  validateGeneration(generation);
  validateGameStateShape(state);
  const envelope = { schemaVersion: SAVE_SCHEMA_VERSION, generation, state };
  validateJson(envelope, options);
  const raw = JSON.stringify(envelope);
  if (encoder.encode(raw).byteLength > maxBytes) fail('Сохранение слишком большое.', 'SAVE_TOO_LARGE');
  return raw;
}

export function deserializeGameSave(raw, options = {}) {
  const maxBytes = options.maxBytes ?? SAVE_MAX_BYTES;
  checkMaxBytes(maxBytes);
  if (typeof raw !== 'string') fail('Сохранение должно быть JSON-строкой.', 'INVALID_SAVE');
  if (encoder.encode(raw).byteLength > maxBytes) fail('Сохранение слишком большое.', 'SAVE_TOO_LARGE');

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    fail('Не удалось прочитать сохранение: JSON повреждён.', 'INVALID_JSON');
  }
  if (!isRecord(data)) fail('Сохранение должно содержать объект.', 'INVALID_SAVE');
  validateJson(data, options);

  const wrapped = Object.hasOwn(data, 'schemaVersion')
    || (Object.hasOwn(data, 'generation') && Object.hasOwn(data, 'state'));
  let generation;
  let state;
  if (wrapped) {
    if (!Number.isInteger(data.schemaVersion) || data.schemaVersion < 1) {
      fail('Некорректная версия схемы сохранения.', 'INVALID_SAVE_SCHEMA');
    }
    if (data.schemaVersion > SAVE_SCHEMA_VERSION) {
      fail('Сохранение создано более новой версией игры. Обновите игру, чтобы открыть его.', 'FUTURE_SAVE_SCHEMA');
    }
    validateGeneration(data.generation);
    generation = data.generation;
    state = data.state;
  } else {
    generation = options.generation ?? null;
    if (generation !== null) validateGeneration(generation);
    state = data;
  }

  validateGameStateShape(state);
  const migrate = options.migrate || ((current) => current);
  if (typeof migrate !== 'function') fail('Миграция сохранения должна быть функцией.', 'INVALID_MIGRATION');
  const migrated = migrate(state, options.now ?? Date.now());
  state = migrated === undefined ? state : migrated;
  validateGameStateShape(state);
  validateJson(state, options);
  return { schemaVersion: SAVE_SCHEMA_VERSION, generation, state };
}
