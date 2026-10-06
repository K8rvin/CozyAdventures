// Решатель и адаптивные подсказки для «Света и фонариков».
// Перебирает комбинации ориентаций зеркал (2^n, n обычно <= 6).
// Подсказка учитывает ТЕКУЩЕЕ состояние: выбирается решение,
// ближайшее к текущим поворотам, и показывается один шаг.

import { createPuzzle, isSolved, traceLight } from './puzzle.js';

function mirrorIndices(level) {
  return level.objects
    .map((o, i) => (o.type === 'mirror' ? i : -1))
    .filter((i) => i >= 0);
}

function orientationsFromBits(mirrors, bits) {
  const orient = {};
  mirrors.forEach((idx, k) => { orient[idx] = (bits >> k) & 1; });
  return orient;
}

function stateWith(level, orient) {
  const s = createPuzzle(level);
  s.orient = { ...orient };
  return s;
}

// Все решающие комбинации (до maxSolutions штук).
export function findSolutions(level, maxSolutions = 64) {
  const mirrors = mirrorIndices(level);
  const total = 1 << mirrors.length;
  if (mirrors.length > 20) return { count: 0, solutions: [], tooMany: true };
  const solutions = [];
  for (let bits = 0; bits < total && solutions.length < maxSolutions; bits++) {
    const s = stateWith(level, orientationsFromBits(mirrors, bits));
    if (isSolved(s)) solutions.push(s.orient);
  }
  return { count: solutions.length, solutions, tooMany: false };
}

// Проверка уровня для конвейера: решаем ли, нет ли будящейся моли в решении.
export function validateLevel(level) {
  const { count, solutions } = findSolutions(level);
  return {
    solvable: count > 0,
    solutionCount: count,
    solutions,
  };
}

// Адаптивная подсказка: возвращает ход, приближающий к ближайшему решению.
// { type: 'rotate', objectIndex } | { type: 'already' } | { type: 'unsolvable' }
export function hint(state) {
  const { level } = state;
  const { solutions } = findSolutions(level);
  if (solutions.length === 0) return { type: 'unsolvable' };

  // Ближайшее решение по числу отличающихся зеркал.
  let best = null;
  let bestDist = Infinity;
  for (const sol of solutions) {
    let dist = 0;
    for (const idx of Object.keys(sol)) {
      if (state.orient[idx] !== sol[idx]) dist++;
    }
    if (dist < bestDist) { bestDist = dist; best = sol; }
  }
  if (bestDist === 0) return { type: 'already' };

  const idx = Object.keys(best).find((i) => state.orient[i] !== best[i]);
  return { type: 'rotate', objectIndex: Number(idx) };
}

// Сколько ходов минимально отделяет текущее состояние от решения.
export function distanceToSolution(state) {
  const { level } = state;
  const { solutions } = findSolutions(level);
  if (solutions.length === 0) return Infinity;
  let best = Infinity;
  for (const sol of solutions) {
    let dist = 0;
    for (const idx of Object.keys(sol)) {
      if (state.orient[idx] !== sol[idx]) dist++;
    }
    if (dist < best) best = dist;
  }
  return best;
}

// Разбужена ли сейчас хоть одна моль (для мягкого предупреждения в UI).
export function anyMothAwake(state) {
  return traceLight(state).mothsAwake.size > 0;
}
