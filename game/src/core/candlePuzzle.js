// Движок головоломки «Свечи и духи». Чистая логика, без DOM.
// Тёмная сетка: игрок ставит свечи (есть лимит) на свободные клетки.
// Свеча освещает клетки в радиусе Манхэттена R — свет расходится
// по сторонам света и НЕ проходит сквозь стены. Повторный тап убирает свечу.
// Цель: ВСЕ фонари освещены и НИ ОДИН дух не освещён.
//
// Уровень:
//   grid: [w, h]
//   walls: [[x, y], ...]    — стены: блокируют свет, ставить свечу нельзя
//   lanterns: [[x, y], ...] — фонари: все должны оказаться в свете
//   spirits: [[x, y], ...]  — духи: ни один не должен оказаться в свете
//   radius: число           — радиус света свечи (шаги по Манхэттену)
//   candleLimit: число      — сколько свечей можно поставить

export function createCandlePuzzle(level) {
  return {
    level,
    candles: new Set(), // ключи "x,y"
    history: [], // { x, y, action: 'place' | 'remove' }
    moves: 0,
  };
}

export function cellKey(x, y) {
  return `${x},${y}`;
}

function keyOf(pos) {
  return pos[0] + ',' + pos[1];
}

// Индекс занятых клеток уровня: стены, фонари, духи.
export function candleIndex(level) {
  return {
    walls: new Set((level.walls || []).map(keyOf)),
    lanterns: new Set((level.lanterns || []).map(keyOf)),
    spirits: new Set((level.spirits || []).map(keyOf)),
  };
}

// Что стоит в клетке: 'wall' | 'lantern' | 'spirit' | null (свободно).
export function objectAt(level, x, y) {
  const idx = candleIndex(level);
  const k = cellKey(x, y);
  if (idx.walls.has(k)) return 'wall';
  if (idx.lanterns.has(k)) return 'lantern';
  if (idx.spirits.has(k)) return 'spirit';
  return null;
}

// Тап по клетке: свободная — поставить свечу (если хватает лимита),
// свеча — убрать. Возвращает { ok, action, error? }.
export function placeCandle(state, x, y) {
  const { level } = state;
  const [w, h] = level.grid;
  const k = cellKey(x, y);
  if (x < 0 || y < 0 || x >= w || y >= h) return { ok: false, error: 'Сюда свечу не поставить' };
  if (state.candles.has(k)) {
    state.candles.delete(k);
    state.history.push({ x, y, action: 'remove' });
    state.moves += 1;
    return { ok: true, action: 'remove' };
  }
  const obj = objectAt(level, x, y);
  if (obj === 'wall') return { ok: false, error: 'На стену свечу не поставить' };
  if (obj === 'lantern') return { ok: false, error: 'Тут уже стоит фонарь' };
  if (obj === 'spirit') return { ok: false, error: 'Дух не даст поставить свечу' };
  if (state.candles.size >= level.candleLimit) {
    return { ok: false, error: 'Свечи кончились — убери лишнюю повторным тапом' };
  }
  state.candles.add(k);
  state.history.push({ x, y, action: 'place' });
  state.moves += 1;
  return { ok: true, action: 'place' };
}

export function undoCandle(state) {
  const last = state.history.pop();
  if (!last) return false;
  const k = cellKey(last.x, last.y);
  if (last.action === 'place') state.candles.delete(k);
  else state.candles.add(k);
  state.moves += 1;
  return true;
}

export function resetCandles(state) {
  state.candles.clear();
  state.history = [];
  state.moves += 1;
}

// Клетки, освещённые одной свечой: обход в ширину на radius шагов,
// стены свет не пропускают (и сами не освещаются).
export function litByCandle(level, cx, cy) {
  const { walls } = candleIndex(level);
  const [w, h] = level.grid;
  const lit = new Set([cellKey(cx, cy)]);
  const queue = [[cx, cy, 0]];
  while (queue.length > 0) {
    const [x, y, d] = queue.shift();
    if (d >= level.radius) continue;
    for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const k = cellKey(nx, ny);
      if (lit.has(k) || walls.has(k)) continue;
      lit.add(k);
      queue.push([nx, ny, d + 1]);
    }
  }
  return lit;
}

// Все освещённые клетки от набора свечей (Set ключей "x,y").
export function litCells(level, candles) {
  const lit = new Set();
  for (const k of candles) {
    const [x, y] = k.split(',').map(Number);
    for (const lk of litByCandle(level, x, y)) lit.add(lk);
  }
  return lit;
}

// Сводка для UI и проверки цели.
export function candleStatus(state) {
  const { level } = state;
  const lit = litCells(level, state.candles);
  const lanternsLit = level.lanterns.filter((p) => lit.has(keyOf(p))).length;
  const spiritsLit = level.spirits.filter((p) => lit.has(keyOf(p))).length;
  return {
    lit,
    placed: state.candles.size,
    limit: level.candleLimit,
    lanternsLit,
    lanternsTotal: level.lanterns.length,
    spiritsLit,
    spiritsTotal: level.spirits.length,
    solved: lanternsLit === level.lanterns.length && spiritsLit === 0,
  };
}

export function isCandleSolved(state) {
  return candleStatus(state).solved;
}

// --- Решатель: перебор наборов позиций (клеток <= 22, свечей <= 6) ---
// Оптимизация: кандидаты — только свободные клетки, с которых свет
// достаёт хотя бы до одного фонаря (свеча без фонаря — лишний риск).
export function solveCandles(level, maxSolutions = 32) {
  const idx = candleIndex(level);
  const [w, h] = level.grid;
  const candidates = [];
  const lanternMask = [];
  const spiritMask = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const k = cellKey(x, y);
      if (idx.walls.has(k) || idx.lanterns.has(k) || idx.spirits.has(k)) continue;
      const lit = litByCandle(level, x, y);
      let lm = 0;
      let sm = 0;
      level.lanterns.forEach((p, i) => { if (lit.has(keyOf(p))) lm |= 1 << i; });
      level.spirits.forEach((p, i) => { if (lit.has(keyOf(p))) sm |= 1 << i; });
      if (lm === 0) continue;
      candidates.push([x, y]);
      lanternMask.push(lm);
      spiritMask.push(sm);
    }
  }
  const full = (1 << level.lanterns.length) - 1;
  const solutions = [];
  const pick = [];
  const maxK = Math.min(level.candleLimit, candidates.length, 6);

  function bt(start, k) {
    if (solutions.length >= maxSolutions) return;
    if (pick.length === k) {
      let lm = 0;
      let sm = 0;
      for (const i of pick) { lm |= lanternMask[i]; sm |= spiritMask[i]; }
      if (lm === full && sm === 0) solutions.push(pick.map((i) => [...candidates[i]]));
      return;
    }
    for (let i = start; i < candidates.length; i++) {
      pick.push(i);
      bt(i + 1, k);
      pick.pop();
      if (solutions.length >= maxSolutions) return;
    }
  }
  for (let k = 1; k <= maxK && solutions.length < maxSolutions; k++) bt(0, k);
  return { count: solutions.length, solutions, candidates };
}

// Подсказка: ближайшее решение → какую свечу убрать или куда поставить.
export function candleHint(state) {
  const { level } = state;
  const { count, solutions } = solveCandles(level, 64);
  if (count === 0) return { type: 'unsolvable' };
  let best = null;
  let bestDist = Infinity;
  for (const sol of solutions) {
    const solSet = new Set(sol.map(keyOf));
    let dist = 0;
    for (const k of state.candles) if (!solSet.has(k)) dist += 1;
    for (const k of solSet) if (!state.candles.has(k)) dist += 1;
    if (dist < bestDist) { bestDist = dist; best = sol; }
  }
  if (bestDist === 0) return { type: 'already' };
  const bestSet = new Set(best.map(keyOf));
  for (const k of state.candles) {
    if (!bestSet.has(k)) {
      const [x, y] = k.split(',').map(Number);
      return { type: 'remove', x, y };
    }
  }
  for (const [x, y] of best) {
    if (!state.candles.has(cellKey(x, y))) return { type: 'place', x, y };
  }
  return { type: 'already' };
}

// Валидация уровня для конвейера
export function validateCandleLevel(level) {
  const problems = [];
  const [w, h] = level.grid || [0, 0];
  if (!(w >= 2 && h >= 2)) problems.push('сетка слишком мала');
  const seen = new Set();
  const mark = (pos, kind) => {
    const [x, y] = pos;
    if (x < 0 || y < 0 || x >= w || y >= h) problems.push(`${kind} вне сетки: ${pos}`);
    const k = keyOf(pos);
    if (seen.has(k)) problems.push(`два объекта в клетке ${k}`);
    seen.add(k);
  };
  (level.walls || []).forEach((p) => mark(p, 'стена'));
  (level.lanterns || []).forEach((p) => mark(p, 'фонарь'));
  (level.spirits || []).forEach((p) => mark(p, 'дух'));
  const free = w * h - seen.size;
  if (free < 1) problems.push('нет свободных клеток');
  if (free > 22) problems.push(`слишком много свободных клеток: ${free} (решатель до 22)`);
  const lanterns = (level.lanterns || []).length;
  if (lanterns < 1 || lanterns > 3) problems.push('фонарей должно быть 1-3');
  if ((level.spirits || []).length > 3) problems.push('духов должно быть не больше 3');
  if (!(level.radius >= 2 && level.radius <= 3)) problems.push('радиус свечи должен быть 2-3');
  if (!(level.candleLimit >= 1 && level.candleLimit <= 5)) problems.push('лимит свечей должен быть 1-5');
  const { count } = solveCandles(level);
  if (count === 0) problems.push('нет решения');
  return { ok: problems.length === 0, problems, solutionCount: count };
}
