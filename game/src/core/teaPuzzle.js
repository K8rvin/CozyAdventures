// Движок головоломки «Чай для путника». Чистая логика, без DOM.
// Путник просит отвар точного цвета и нужной теплоты. Ингредиенты меняют
// цвет (R,G,B 0..100) и жар (0..100). Превысил жар — отвар перегрет.
// Цель: попасть в цвет с допуском и не выйти за максимум жара.
//
// Уровень:
//   target: { r, g, b }     — целевой цвет
//   tolerance: число        — допуск по каждому каналу
//   maxHeat: число          — порог перегрева
//   ingredients: [{ id, name, icon, dr, dg, db, heat, uses }]
// Ход: добавить ингредиент (пока есть uses).

export function createTeaPuzzle(level) {
  return {
    level,
    color: { r: 0, g: 0, b: 0 },
    heat: 0,
    used: {}, // ingredientId -> count
    history: [],
    moves: 0,
  };
}

function clamp100(v) {
  return Math.max(0, Math.min(100, v));
}

export function addIngredient(state, ingredientId) {
  const ing = state.level.ingredients.find((i) => i.id === ingredientId);
  if (!ing) return { ok: false, error: 'Нет такого ингредиента' };
  const usedCount = state.used[ingredientId] || 0;
  if (usedCount >= ing.uses) return { ok: false, error: 'Закончился' };
  state.history.push({
    ingredientId,
    prev: { color: { ...state.color }, heat: state.heat, usedCount },
  });
  state.color = {
    r: clamp100(state.color.r + ing.dr),
    g: clamp100(state.color.g + ing.dg),
    b: clamp100(state.color.b + ing.db),
  };
  state.heat = clamp100(state.heat + ing.heat);
  state.used[ingredientId] = usedCount + 1;
  state.moves += 1;
  return { ok: true };
}

export function undoTea(state) {
  const last = state.history.pop();
  if (!last) return false;
  state.color = last.prev.color;
  state.heat = last.prev.heat;
  state.used[last.ingredientId] = last.prev.usedCount;
  state.moves += 1;
  return true;
}

export function resetTea(state) {
  state.color = { r: 0, g: 0, b: 0 };
  state.heat = 0;
  state.used = {};
  state.history = [];
  state.moves += 1;
}

export function teaStatus(state) {
  const { level } = state;
  const t = level.target;
  const tol = level.tolerance;
  const diffs = {
    r: Math.abs(state.color.r - t.r),
    g: Math.abs(state.color.g - t.g),
    b: Math.abs(state.color.b - t.b),
  };
  const colorOk = diffs.r <= tol && diffs.g <= tol && diffs.b <= tol;
  const overheated = state.heat > level.maxHeat;
  return {
    colorOk, overheated, diffs,
    solved: colorOk && !overheated,
    heat: state.heat, maxHeat: level.maxHeat,
  };
}

export function isTeaSolved(state) {
  return teaStatus(state).solved;
}

// --- Решатель: перебор количеств использований каждого ингредиента ---
export function solveTea(level) {
  const ings = level.ingredients;
  const solutions = [];
  const assign = new Array(ings.length).fill(0);

  function evalCombo() {
    const color = { r: 0, g: 0, b: 0 };
    let heat = 0;
    ings.forEach((ing, i) => {
      const n = assign[i];
      color.r = clamp100(color.r + ing.dr * n);
      color.g = clamp100(color.g + ing.dg * n);
      color.b = clamp100(color.b + ing.db * n);
      heat = clamp100(heat + ing.heat * n);
    });
    const t = level.target;
    const ok = Math.abs(color.r - t.r) <= level.tolerance &&
      Math.abs(color.g - t.g) <= level.tolerance &&
      Math.abs(color.b - t.b) <= level.tolerance &&
      heat <= level.maxHeat;
    if (ok) solutions.push({ counts: [...assign], heat });
  }

  function bt(k) {
    if (solutions.length >= 64) return;
    if (k === ings.length) { evalCombo(); return; }
    for (let n = 0; n <= ings[k].uses; n++) {
      assign[k] = n;
      bt(k + 1);
    }
  }
  bt(0);
  return { count: solutions.length, solutions };
}

// Подсказка: какой ингредиент добавить, чтобы приблизиться к ближайшему решению.
export function teaHint(state) {
  const { level } = state;
  const { count, solutions } = solveTea(level);
  if (count === 0) return { type: 'unsolvable' };
  // Решение, ближайшее к текущим количествам (нужно минимум новых добавлений)
  let best = null;
  let bestCost = Infinity;
  for (const sol of solutions) {
    let cost = 0;
    let feasible = true;
    level.ingredients.forEach((ing, i) => {
      const used = state.used[ing.id] || 0;
      if (used > sol.counts[i]) feasible = false; // перебрали — это решение недостижимо
      else cost += sol.counts[i] - used;
    });
    if (feasible && cost < bestCost) { bestCost = cost; best = sol; }
  }
  if (!best) return { type: 'reset', text: 'Так дело не пойдёт — котёл придётся освежить (сброс).' };
  if (bestCost === 0) return { type: 'already' };
  const i = level.ingredients.findIndex((ing, idx) => (state.used[ing.id] || 0) < best.counts[idx]);
  const ing = level.ingredients[i];
  return { type: 'add', ingredientId: ing.id, name: ing.name, icon: ing.icon };
}

export function validateTeaLevel(level) {
  const problems = [];
  if (!level.target) problems.push('нет целевого цвета');
  if (!(level.tolerance >= 0)) problems.push('нет допуска');
  if (!(level.maxHeat > 0)) problems.push('нет порога жара');
  if (!level.ingredients || level.ingredients.length < 2) problems.push('мало ингредиентов');
  const { count } = solveTea(level);
  if (count === 0) problems.push('нет решения');
  return { ok: problems.length === 0, problems, solutionCount: count };
}
