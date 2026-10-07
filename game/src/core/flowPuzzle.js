// Движок головоломки «Потоки покупателей» (ночной рынок). Чистая логика, без DOM.
// Покупатели идут от своих стартов по плиткам-стрелкам; стрелки поворачиваются тапом.
// Победа: каждый покупатель дошёл до СВОЕГО лотка (тот же цвет), и никакие
// два пути не делят клетку (иначе толкотня).
//
// Плитки (rot 0..3 — направление: 0=верх, 1=право, 2=низ, 3=лево):
//   start — покупатель (color, направление первого шага, фиксированная)
//   arrow — стрелка, поворачивается игроком; задаёт направление дальше
//   stall — лоток (color); принимает только своего покупателя, чужих не пускает
//   wall  — груда ящиков, не пройти
// Пустые клетки проходимы, но стрелки на них нет — покупатель останавливается.

export const DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]];

// Цвета покупателей: эмодзи, имя и css-цвет пути.
export const BUYER_COLORS = [
  { buyer: '🦊', name: 'Лисёнок', css: '#e8965a' },
  { buyer: '🐸', name: 'Лягушонок', css: '#7bc47f' },
  { buyer: '🐦', name: 'Синичка', css: '#6aa9e8' },
];

export function createFlowPuzzle(level) {
  return {
    level,
    rot: Object.fromEntries(
      level.tiles.map((t, i) => [i, t.rot ?? 0]).filter(([i]) => level.tiles[i].type === 'arrow'),
    ),
    history: [],
    moves: 0,
  };
}

export function rotateFlowTile(state, tileIndex) {
  const t = state.level.tiles[tileIndex];
  if (!t || t.type !== 'arrow' || t.fixed) return false;
  state.history.push({ tileIndex, prev: state.rot[tileIndex] });
  state.rot[tileIndex] = (state.rot[tileIndex] + 1) % 4;
  state.moves += 1;
  return true;
}

export function undoFlow(state) {
  const last = state.history.pop();
  if (!last) return false;
  state.rot[last.tileIndex] = last.prev;
  state.moves += 1;
  return true;
}

export function resetFlow(state) {
  for (const [idx] of Object.entries(state.rot)) {
    state.rot[idx] = state.level.tiles[idx].rot ?? 0;
  }
  state.history = [];
  state.moves += 1;
}

// Симуляция путей покупателей по текущим поворотам стрелок.
// Возвращает { buyers: [{ start, color, path, arrived, reason }], collisions: Set('x,y'), arrivedCount, solved }
export function simulateFlows(state) {
  const { level } = state;
  const [w, h] = level.grid;
  const at = new Map();
  level.tiles.forEach((t, i) => at.set(t.pos[0] + ',' + t.pos[1], i));

  const buyers = [];
  level.tiles.forEach((t, i) => {
    if (t.type !== 'start') return;
    const path = [[t.pos[0], t.pos[1]]];
    let x = t.pos[0];
    let y = t.pos[1];
    let dir = (t.rot ?? 0) % 4;
    let arrived = false;
    let reason = 'steps';
    const seen = new Set([`${x},${y},${dir}`]);
    const maxSteps = w * h * 4; // защита от циклов: жёсткий предел шагов
    for (let step = 0; step < maxSteps; step++) {
      const [dx, dy] = DIRS[dir];
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) { reason = 'edge'; break; }
      const j = at.get(`${nx},${ny}`);
      const nt = j === undefined ? null : level.tiles[j];
      if (nt?.type === 'wall') { reason = 'wall'; break; }
      if (nt?.type === 'stall') {
        if ((nt.color ?? 0) === (t.color ?? 0)) {
          path.push([nx, ny]);
          arrived = true;
          reason = 'stall';
        } else {
          reason = 'foreign'; // чужой лоток не пускает
        }
        break;
      }
      // пустая клетка, стрелка или чужой старт — заходим
      path.push([nx, ny]);
      x = nx;
      y = ny;
      if (!nt) { reason = 'empty'; break; } // нет стрелки — покупатель встал
      if (nt.type === 'arrow') dir = (state.rot[j] ?? nt.rot ?? 0) % 4;
      const key = `${x},${y},${dir}`;
      if (seen.has(key)) { reason = 'loop'; break; }
      seen.add(key);
    }
    buyers.push({ start: i, color: t.color ?? 0, path, arrived, reason });
  });

  // Коллизии: клетка, которую делят пути двух и более покупателей
  const owners = new Map();
  buyers.forEach((b, bi) => b.path.forEach(([x, y]) => {
    const key = `${x},${y}`;
    if (!owners.has(key)) owners.set(key, new Set());
    owners.get(key).add(bi);
  }));
  const collisions = new Set();
  for (const [key, set] of owners) if (set.size > 1) collisions.add(key);

  const arrivedCount = buyers.filter((b) => b.arrived).length;
  const solved = buyers.length > 0 && arrivedCount === buyers.length && collisions.size === 0;
  return { buyers, collisions, arrivedCount, solved };
}

export function isFlowSolved(state) {
  return simulateFlows(state).solved;
}

// --- Решатель: перебор поворотов стрелок (4^n) ---
export function solveFlow(level, maxSolutions = 32) {
  const rotatable = level.tiles
    .map((t, i) => ({ t, i }))
    .filter(({ t }) => t.type === 'arrow' && !t.fixed);
  const solutions = [];
  const assign = new Array(rotatable.length).fill(0);

  function bt(k) {
    if (solutions.length >= maxSolutions) return;
    if (k === rotatable.length) {
      const s = createFlowPuzzle(level);
      rotatable.forEach(({ i }, k2) => { s.rot[i] = assign[k2]; });
      if (isFlowSolved(s)) solutions.push([...assign]);
      return;
    }
    for (let v = 0; v < 4; v++) {
      assign[k] = v;
      bt(k + 1);
    }
  }
  bt(0);
  return { count: solutions.length, solutions, rotatable: rotatable.map((r) => r.i) };
}

// Кэш решений уровня: набор решений от текущего состояния не зависит.
const flowSolutionCache = new WeakMap();
function cachedSolutions(level) {
  let c = flowSolutionCache.get(level);
  if (!c) {
    c = solveFlow(level, 64);
    flowSolutionCache.set(level, c);
  }
  return c;
}

// Подсказка: ближайшее решение → какую стрелку повернуть.
export function flowHint(state) {
  const { level } = state;
  const { count, solutions, rotatable } = cachedSolutions(level);
  if (count === 0) return { type: 'unsolvable' };
  let best = null;
  let bestDist = Infinity;
  for (const sol of solutions) {
    let dist = 0;
    rotatable.forEach((idx, k) => {
      if (state.rot[idx] !== sol[k]) dist++;
    });
    if (dist < bestDist) { bestDist = dist; best = sol; }
  }
  if (bestDist === 0) return { type: 'already' };
  const k = rotatable.findIndex((idx, k2) => state.rot[idx] !== best[k2]);
  return { type: 'rotate', tileIndex: rotatable[k] };
}

// Валидация уровня для конвейера
export function validateFlowLevel(level) {
  const problems = [];
  const [w, h] = level.grid;
  if (!(w > 0 && h > 0)) problems.push('некорректная сетка');
  const seen = new Set();
  const startColors = [];
  const stallColors = [];
  let arrows = 0;
  for (const t of level.tiles) {
    const [x, y] = t.pos;
    if (x < 0 || y < 0 || x >= w || y >= h) problems.push(`плитка ${t.type} вне сетки (${t.pos})`);
    const key = t.pos.join(',');
    if (seen.has(key)) problems.push(`две плитки в клетке ${key}`);
    seen.add(key);
    if (!['start', 'arrow', 'stall', 'wall'].includes(t.type)) problems.push(`неизвестная плитка ${t.type}`);
    if (t.type === 'start') startColors.push(t.color ?? 0);
    if (t.type === 'stall') stallColors.push(t.color ?? 0);
    if (t.type === 'arrow' && !t.fixed) arrows++;
  }
  if (startColors.length < 2 || startColors.length > 3) problems.push('нужно 2–3 покупателя (start)');
  if (stallColors.length !== startColors.length) problems.push('лотков должно быть столько же, сколько покупателей');
  if (new Set(startColors).size !== startColors.length) problems.push('цвета покупателей повторяются');
  const cs = [...startColors].sort().join(',');
  const ts = [...stallColors].sort().join(',');
  if (cs !== ts) problems.push(`цвета лотков (${ts}) не совпадают с цветами покупателей (${cs})`);
  if (startColors.some((c) => c < 0 || c >= BUYER_COLORS.length)) problems.push('неизвестный цвет покупателя');
  if (arrows > 12) problems.push('слишком много стрелок — решатель не справится');
  const { count } = solveFlow(level);
  if (count === 0) problems.push('нет решения');
  return { ok: problems.length === 0, problems, solutionCount: count };
}
