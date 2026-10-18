// Движок головоломки «Гобелены ветров» (вращение лоскутов). Чистая логика, без DOM.
// Гобелен разрезан на сетку cols×rows лоскутов; сквозняк повернул каждый лоскут
// на 0/90/180/270 градусов. Тап по лоскуту крутит его на 90° по часовой.
// Гобелен собран, когда все лоскуты повернуты верно (rot === 0).
//
// Уровень: { id, name, grid: [cols, rows], image, seed?, goldRim?, anchors?, ... }
//   goldRim: false — «слепой» уровень, золотая кайма на верных лоскутах не рисуется
//   anchors: [cellIndex...] — приколоченные лоскуты (всегда верны, не крутятся)
// Состояние: rot[cell] ∈ 0..3 — четверти оборота по часовой от верного положения.
import { makeRng } from './rng.js';
import { hashSeed } from './glassPuzzle.js';

export { hashSeed };

// Начальные повороты: seeded; ≥60% свободных лоскутов не в нуле,
// якоря всегда 0, гобелен гарантированно не собран на старте.
function shuffledRots(total, anchors, seed) {
  const rng = makeRng(seed);
  const free = [];
  for (let cell = 0; cell < total; cell++) if (!anchors.has(cell)) free.push(cell);
  for (let attempt = 0; attempt < 30; attempt++) {
    const rot = Array.from({ length: total }, () => 0);
    for (const cell of free) rot[cell] = rng.int(0, 3);
    const twisted = free.filter((c) => rot[c] !== 0).length;
    if (twisted >= Math.max(1, Math.ceil(free.length * 0.6))) return rot;
  }
  // Крайний случай: все свободные на 90°
  return Array.from({ length: total }, (_, cell) => (anchors.has(cell) ? 0 : 1));
}

export function createSpinPuzzle(level) {
  const [cols, rows] = level.grid;
  const total = cols * rows;
  const anchors = new Set(level.anchors || []);
  const initial = shuffledRots(total, anchors, level.seed ?? hashSeed(level.id));
  return {
    level,
    anchors,
    initial,
    rot: [...initial],
    history: [], // стек ходов (индексы клеток) для отмены
    moves: 0,
  };
}

// Повернуть лоскут на 90° по часовой. Якорь не крутится. true — ход сделан.
export function rotatePiece(state, cell) {
  const total = state.level.grid[0] * state.level.grid[1];
  if (cell < 0 || cell >= total || state.anchors.has(cell)) return false;
  state.history.push(cell);
  state.rot[cell] = (state.rot[cell] + 1) % 4;
  state.moves += 1;
  return true;
}

export function undoSpin(state) {
  const last = state.history.pop();
  if (last === undefined) return false;
  state.rot[last] = (state.rot[last] + 3) % 4;
  state.moves += 1;
  return true;
}

export function resetSpin(state) {
  state.rot = [...state.initial];
  state.history = [];
  state.moves += 1;
}

export function isSpinSolved(state) {
  return state.rot.every((r) => r === 0);
}

// Сколько лоскутов уже повёрнуто верно (якоря верны сразу)
export function spinStatus(state) {
  const total = state.level.grid[0] * state.level.grid[1];
  const placed = state.rot.filter((r) => r === 0).length;
  return { placed, total, solved: placed === total };
}

// Эталон: минимум тапов для сборки из начальной раскладки.
// Лоскут с поворотом r чинится за (4 − r) % 4 тапов по часовой.
export function parMoves(state) {
  return state.initial.reduce((sum, r) => sum + ((4 - r) % 4), 0);
}

// Подсказка: первый лоскут не в нуле. Поворот по подсказке приближает сборку
// на один тап — цепочка подсказок всегда приводит к решению.
export function spinHint(state) {
  const cell = state.rot.findIndex((r) => r !== 0);
  if (cell < 0) return { type: 'already' };
  return { type: 'rotate', cell, left: (4 - state.rot[cell]) % 4 };
}

// Валидация уровня для конвейера
export function validateSpinLevel(level) {
  const problems = [];
  const [cols, rows] = level.grid || [];
  if (!Number.isInteger(cols) || !Number.isInteger(rows) || cols < 2 || rows < 2) {
    problems.push('сетка должна быть минимум 2×2');
    return { ok: false, problems };
  }
  const total = cols * rows;
  if (total > 40) problems.push('слишком много лоскутов (>40)');
  if (!level.image) problems.push('нет картинки (image)');
  if (!level.name || !level.intro) problems.push('нужны name и intro');
  for (const a of level.anchors || []) {
    if (!Number.isInteger(a) || a < 0 || a >= total) problems.push(`якорь вне поля: ${a}`);
  }
  if ((level.anchors || []).length > total - 2) problems.push('нужно хотя бы два свободных лоскута');
  const s = createSpinPuzzle(level);
  if (isSpinSolved(s)) problems.push('гобелен собран на старте');
  if (parMoves(s) === 0) problems.push('эталон нулевой — нечего крутить');
  return { ok: problems.length === 0, problems };
}
