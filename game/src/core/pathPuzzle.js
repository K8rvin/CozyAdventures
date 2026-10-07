// Движок головоломки «Тропинка курьера» (Pipe-стиль). Чистая логика, без DOM.
// Плитки поворачиваются тапом; цель — непрерывная тропинка от домика к дубу,
// не заходя на клетки со спящими зверями.
//
// Плитки (rot 0..3):
//   straight — прямая (соединяет противоположные стороны)
//   corner   — угол (соединяет соседние стороны)
//   tee      — тройник (соединяет три стороны)
//   start    — домик (источник, одна сторона, фиксированный тип, поворот меняется? нет — фикс)
//   end      — дуб (цель, одна сторона)
//   beast    — спящий зверь: клетка недоступна (стены вокруг)
// Пустые клетки (нет плитки) тропинку не проводят.

// Стороны: 0=верх, 1=право, 2=низ, 3=лево. Дельты:
export const SIDES = [[0, -1], [1, 0], [0, 1], [-1, 0]];

// Какие стороны соединяет плитка при повороте rot.
export function connections(type, rot) {
  switch (type) {
    case 'straight': return rot % 2 === 0 ? [0, 2] : [1, 3];
    case 'corner': {
      // базовый угол: верх+право при rot 0, далее по часовой
      const m = [[0, 1], [1, 2], [2, 3], [3, 0]];
      return m[rot % 4];
    }
    case 'tee': {
      // тройник без одной стороны: rot — сторона, которой НЕТ
      return [0, 1, 2, 3].filter((s) => s !== ((rot + 3) % 4));
    }
    case 'start':
    case 'end':
      return [rot % 4]; // одна открытая сторона
    default: return [];
  }
}

export function createPathPuzzle(level) {
  return {
    level,
    rot: Object.fromEntries(
      level.tiles.map((t, i) => [i, t.rot ?? 0]).filter(([, r], i) => level.tiles[i].type !== 'beast'),
    ),
    history: [],
    moves: 0,
  };
}

export function rotateTile(state, tileIndex) {
  const t = state.level.tiles[tileIndex];
  if (!t || t.type === 'beast') return false;
  if (t.fixed) return false;
  state.history.push({ tileIndex, prev: state.rot[tileIndex] });
  state.rot[tileIndex] = (state.rot[tileIndex] + 1) % 4;
  state.moves += 1;
  return true;
}

export function undoPath(state) {
  const last = state.history.pop();
  if (!last) return false;
  state.rot[last.tileIndex] = last.prev;
  state.moves += 1;
  return true;
}

export function resetPath(state) {
  for (const [idx] of Object.entries(state.rot)) {
    state.rot[idx] = state.level.tiles[idx].rot ?? 0;
  }
  state.history = [];
  state.moves += 1;
}

// Проверка связности от старта к финишу по соединениям плиток.
// Возвращает { solved, reached: Set(индексы плиток на пути) }
export function tracePath(state) {
  const { level } = state;
  const [w] = level.grid;
  const at = new Map();
  level.tiles.forEach((t, i) => at.set(t.pos[0] + ',' + t.pos[1], i));

  const startIdx = level.tiles.findIndex((t) => t.type === 'start');
  const endIdx = level.tiles.findIndex((t) => t.type === 'end');
  const reached = new Set();
  if (startIdx < 0 || endIdx < 0) return { solved: false, reached };

  const queue = [startIdx];
  reached.add(startIdx);
  while (queue.length > 0) {
    const i = queue.shift();
    const t = level.tiles[i];
    const conns = t.type === 'beast' ? [] : connections(t.type, state.rot[i] ?? t.rot ?? 0);
    for (const side of conns) {
      const [dx, dy] = SIDES[side];
      const nx = t.pos[0] + dx;
      const ny = t.pos[1] + dy;
      const j = at.get(`${nx},${ny}`);
      if (j === undefined || reached.has(j)) continue;
      const nt = level.tiles[j];
      if (nt.type === 'beast') continue;
      // Соседняя плитка должна принимать соединение с противоположной стороны
      const opp = (side + 2) % 4;
      const nconns = connections(nt.type, state.rot[j] ?? nt.rot ?? 0);
      if (nconns.includes(opp)) {
        reached.add(j);
        queue.push(j);
      }
    }
  }
  return { solved: reached.has(endIdx), reached };
}

export function isPathSolved(state) {
  return tracePath(state).solved;
}

// --- Решатель: перебор поворотов (4^n с отсечками по недостижимости) ---
export function solvePath(level, maxSolutions = 32) {
  const rotatable = level.tiles
    .map((t, i) => ({ t, i }))
    .filter(({ t }) => t.type !== 'beast' && !t.fixed && (t.type === 'straight' || t.type === 'corner' || t.type === 'tee' || t.type === 'end'));
  const variants = rotatable.map(({ t }) => (t.type === 'straight' ? [0, 1] : [0, 1, 2, 3]));
  const solutions = [];
  const assign = new Array(rotatable.length).fill(0);

  function bt(k) {
    if (solutions.length >= maxSolutions) return;
    if (k === rotatable.length) {
      const s = createPathPuzzle(level);
      rotatable.forEach(({ i }, k2) => { s.rot[i] = variants[k2][assign[k2]]; });
      if (isPathSolved(s)) solutions.push([...assign]);
      return;
    }
    for (let v = 0; v < variants[k].length; v++) {
      assign[k] = v;
      bt(k + 1);
    }
  }
  bt(0);
  return { count: solutions.length, solutions, rotatable: rotatable.map((r) => r.i) };
}

// Подсказка: ближайшее решение → какую плитку повернуть.
export function pathHint(state) {
  const { level } = state;
  const { count, solutions, rotatable } = solvePath(level, 64);
  if (count === 0) return { type: 'unsolvable' };
  let best = null;
  let bestDist = Infinity;
  const variants = rotatable.map((i) => {
    const t = level.tiles[i];
    return t.type === 'straight' ? [0, 1] : [0, 1, 2, 3];
  });
  for (const sol of solutions) {
    let dist = 0;
    rotatable.forEach((idx, k) => {
      if (state.rot[idx] !== variants[k][sol[k]]) dist++;
    });
    if (dist < bestDist) { bestDist = dist; best = sol; }
  }
  if (bestDist === 0) return { type: 'already' };
  const k = rotatable.findIndex((idx, k2) => state.rot[idx] !== variants[k2][best[k2]]);
  return { type: 'rotate', tileIndex: rotatable[k] };
}

// Валидация уровня для конвейера
export function validatePathLevel(level) {
  const problems = [];
  const [w, h] = level.grid;
  const seen = new Set();
  let starts = 0;
  let ends = 0;
  for (const t of level.tiles) {
    const [x, y] = t.pos;
    if (x < 0 || y < 0 || x >= w || y >= h) problems.push('плитка вне сетки');
    const key = t.pos.join(',');
    if (seen.has(key)) problems.push(`две плитки в клетке ${key}`);
    seen.add(key);
    if (t.type === 'start') starts++;
    if (t.type === 'end') ends++;
  }
  if (starts !== 1) problems.push('нужен ровно один домик (start)');
  if (ends !== 1) problems.push('нужен ровно один дуб (end)');
  const { count } = solvePath(level);
  if (count === 0) problems.push('нет решения');
  return { ok: problems.length === 0, problems, solutionCount: count };
}
