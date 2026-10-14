// Движок головоломки «Витраж миров» (пазл-перестановка). Чистая логика, без DOM.
// Картина разрезана на сетку cols×rows фрагментов и перемешана. Игрок меняет
// фрагменты местами (перетаскиванием или парой тапов), пока витраж не соберётся.
//
// Уровень: { id, name, grid: [cols, rows], image, seed?, ... }
// Состояние: pieces[cellIndex] = pieceIndex — какой исходный фрагмент лежит
// в клетке. Исходный фрагмент i в собранном виде стоит в клетке i (row-major).
import { makeRng } from './rng.js';

// Стабильный хеш строки (для seed по умолчанию из id уровня)
export function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Перемешивание Фишера–Йетса; гарантирует, что витраж НЕ собран на старте
// и что большинство фрагментов не на своих местах (иначе перетасовка).
function shuffledPieces(total, seed) {
  const rng = makeRng(seed);
  for (let attempt = 0; attempt < 30; attempt++) {
    const pieces = Array.from({ length: total }, (_, i) => i);
    for (let i = total - 1; i > 0; i--) {
      const j = rng.int(0, i);
      [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    const displaced = pieces.filter((p, cell) => p !== cell).length;
    if (displaced >= Math.ceil(total * 0.6)) return pieces;
  }
  // Крайний случай: простой сдвиг на 1 — всегда «не собрано»
  return Array.from({ length: total }, (_, i) => (i + 1) % total);
}

export function createGlassPuzzle(level) {
  const [cols, rows] = level.grid;
  const total = cols * rows;
  const initial = shuffledPieces(total, level.seed ?? hashSeed(level.id));
  return {
    level,
    initial,
    pieces: [...initial],
    history: [], // стек ходов {a, b} для отмены
    moves: 0,
  };
}

// Поменять фрагменты в клетках a и b. Возвращает true, если ход сделан.
export function swapPieces(state, a, b) {
  const total = state.level.grid[0] * state.level.grid[1];
  if (a === b || a < 0 || b < 0 || a >= total || b >= total) return false;
  state.history.push({ a, b });
  [state.pieces[a], state.pieces[b]] = [state.pieces[b], state.pieces[a]];
  state.moves += 1;
  return true;
}

export function undoGlass(state) {
  const last = state.history.pop();
  if (!last) return false;
  [state.pieces[last.a], state.pieces[last.b]] = [state.pieces[last.b], state.pieces[last.a]];
  state.moves += 1;
  return true;
}

export function resetGlass(state) {
  state.pieces = [...state.initial];
  state.history = [];
  state.moves += 1;
}

export function isGlassSolved(state) {
  return state.pieces.every((p, cell) => p === cell);
}

// Сколько фрагментов уже на своих местах
export function glassStatus(state) {
  const total = state.level.grid[0] * state.level.grid[1];
  const placed = state.pieces.filter((p, cell) => p === cell).length;
  return { placed, total, solved: placed === total };
}

// Подсказка: первая клетка не на месте + где сейчас лежит её фрагмент.
// Обмен по подсказке гарантированно ставит клетку from на место —
// цепочка подсказок всегда приводит к решению.
export function glassHint(state) {
  const from = state.pieces.findIndex((p, cell) => p !== cell);
  if (from < 0) return { type: 'already' };
  const to = state.pieces.indexOf(from);
  return { type: 'swap', from, to };
}

// Валидация уровня для конвейера
export function validateGlassLevel(level) {
  const problems = [];
  const [cols, rows] = level.grid || [];
  if (!Number.isInteger(cols) || !Number.isInteger(rows) || cols < 2 || rows < 2) {
    problems.push('сетка должна быть минимум 2×2');
    return { ok: false, problems };
  }
  if (cols * rows > 40) problems.push('слишком много фрагментов (>40)');
  if (!level.image) problems.push('нет картинки (image)');
  if (!level.name || !level.intro) problems.push('нужны name и intro');
  const s = createGlassPuzzle(level);
  if (isGlassSolved(s)) problems.push('витраж собран на старте');
  return { ok: problems.length === 0, problems };
}
