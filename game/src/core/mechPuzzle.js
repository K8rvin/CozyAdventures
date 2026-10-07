// Движок головоломки «Механизмы и ремонт». Чистая логика, без DOM.
// На сетке лежат шестерёнки; у каждой грани (стороны) тип: 'pin' (шип),
// 'socket' (паз) или пусто. Соседние грани сцепляются, только если шип
// входит в паз (pin ↔ socket). Тап поворачивает шестерёнку на четверть
// оборота (4 положения). Цель — непрерывная передача вращения от рукояти
// (start) к колокольчику (end) по сцепленным шестерёнкам.
//
// Детали (rot 0..3):
//   start   — рукоять (источник, фиксированная, хотя бы один шип)
//   end     — колокольчик (цель, фиксированная, хотя бы один паз)
//   gear    — шестерёнка с набором граней faces: [верх, право, низ, лево]
//   blocker — заклинившая деталь: клетка недоступна, передачу не проводит

// Стороны: 0=верх, 1=право, 2=низ, 3=лево. Дельты:
export const SIDES = [[0, -1], [1, 0], [0, 1], [-1, 0]];

// Грань детали на стороне side при повороте rot (по часовой).
export function faceAt(tile, rot, side) {
  if (!Array.isArray(tile.faces)) return null;
  return tile.faces[(((side - (rot ?? 0)) % 4) + 4) % 4] ?? null;
}

// Сцепление: шип стыкуется только с пазом.
export function facesMesh(a, b) {
  return (a === 'pin' && b === 'socket') || (a === 'socket' && b === 'pin');
}

export function createMechPuzzle(level) {
  return {
    level,
    rot: Object.fromEntries(
      level.tiles
        .map((t, i) => [i, t.rot ?? 0])
        .filter(([i]) => level.tiles[i].type !== 'blocker'),
    ),
    history: [],
    moves: 0,
  };
}

export function rotateGear(state, tileIndex) {
  const t = state.level.tiles[tileIndex];
  if (!t || t.type !== 'gear') return false;
  if (t.fixed) return false;
  state.history.push({ tileIndex, prev: state.rot[tileIndex] });
  state.rot[tileIndex] = (state.rot[tileIndex] + 1) % 4;
  state.moves += 1;
  return true;
}

export function undoMech(state) {
  const last = state.history.pop();
  if (!last) return false;
  state.rot[last.tileIndex] = last.prev;
  state.moves += 1;
  return true;
}

export function resetMech(state) {
  for (const [idx] of Object.entries(state.rot)) {
    state.rot[idx] = state.level.tiles[idx].rot ?? 0;
  }
  state.history = [];
  state.moves += 1;
}

// Трассировка передачи от рукояти по сцепленным граням.
// Возвращает { solved, reached: Set(индексы деталей, куда дошло вращение) }.
export function traceMech(state) {
  const { level } = state;
  const at = new Map();
  level.tiles.forEach((t, i) => at.set(t.pos.join(','), i));

  const startIdx = level.tiles.findIndex((t) => t.type === 'start');
  const endIdx = level.tiles.findIndex((t) => t.type === 'end');
  const reached = new Set();
  if (startIdx < 0 || endIdx < 0) return { solved: false, reached };

  const queue = [startIdx];
  reached.add(startIdx);
  while (queue.length > 0) {
    const i = queue.shift();
    const t = level.tiles[i];
    if (t.type === 'blocker') continue;
    const rotI = state.rot[i] ?? t.rot ?? 0;
    for (let side = 0; side < 4; side++) {
      const f = faceAt(t, rotI, side);
      if (!f) continue;
      const [dx, dy] = SIDES[side];
      const j = at.get(`${t.pos[0] + dx},${t.pos[1] + dy}`);
      if (j === undefined || reached.has(j)) continue;
      const nt = level.tiles[j];
      if (nt.type === 'blocker') continue;
      // Соседняя деталь должна принять передачу противоположной гранью
      const nf = faceAt(nt, state.rot[j] ?? nt.rot ?? 0, (side + 2) % 4);
      if (facesMesh(f, nf)) {
        reached.add(j);
        queue.push(j);
      }
    }
  }
  return { solved: reached.has(endIdx), reached };
}

export function isMechSolved(state) {
  return traceMech(state).solved;
}

// Различные положения детали: симметричные повороты (с тем же узором граней)
// не плодим — это первая отсечка решателя.
export function gearVariants(tile) {
  const seen = new Set();
  const out = [];
  for (let r = 0; r < 4; r++) {
    const key = [0, 1, 2, 3].map((s) => faceAt(tile, r, s) || '-').join('');
    if (!seen.has(key)) {
      seen.add(key);
      out.push(r);
    }
  }
  return out;
}

// --- Решатель: перебор поворотов (4^n) с отсечками ---
// Отсечки: 1) симметричные повороты схлопнуты (gearVariants);
// 2) при частичном назначении колокольчик должен оставаться ОПТИМИСТИЧНО
// достижим: неназначенные шестерёнки считаем способными показать любую свою
// грань на любой стороне. Если даже так конец недостижим — ветку режем
// (корректные решения это не отсекает).
export function solveMech(level, maxSolutions = 32) {
  const tiles = level.tiles;
  const startIdx = tiles.findIndex((t) => t.type === 'start');
  const endIdx = tiles.findIndex((t) => t.type === 'end');
  if (startIdx < 0 || endIdx < 0) return { count: 0, solutions: [], rotatable: [] };

  const rotatable = tiles
    .map((t, i) => ({ t, i }))
    .filter(({ t }) => t.type === 'gear' && !t.fixed)
    .map(({ i }) => i);
  const variants = rotatable.map((i) => gearVariants(tiles[i]));

  // Возможные грани каждой детали на каждой стороне (по всем её положениям)
  const possible = tiles.map((t) => {
    const rots = t.type === 'gear' && !t.fixed ? gearVariants(t) : [t.rot ?? 0];
    return [0, 1, 2, 3].map((s) => new Set(rots.map((r) => faceAt(t, r, s)).filter(Boolean)));
  });

  // Соседство по сетке (blocker не участвует)
  const at = new Map();
  tiles.forEach((t, i) => at.set(t.pos.join(','), i));
  const neighbors = tiles.map((t) => {
    const list = [];
    if (t.type === 'blocker') return list;
    for (let s = 0; s < 4; s++) {
      const [dx, dy] = SIDES[s];
      const j = at.get(`${t.pos[0] + dx},${t.pos[1] + dy}`);
      if (j !== undefined && tiles[j].type !== 'blocker') list.push({ s, j });
    }
    return list;
  });

  // Текущее назначение: номер поворота или null (ещё не назначена / не крутится)
  const rotOf = tiles.map((t) => (t.type === 'gear' && !t.fixed ? null : (t.rot ?? 0)));

  // Может ли передача пройти по грани i—j при текущем частичном назначении
  function edgePossible(i, s, j) {
    const fi = rotOf[i] === null ? possible[i][s] : new Set([faceAt(tiles[i], rotOf[i], s)].filter(Boolean));
    const fj = rotOf[j] === null ? possible[j][(s + 2) % 4] : new Set([faceAt(tiles[j], rotOf[j], (s + 2) % 4)].filter(Boolean));
    for (const a of fi) for (const b of fj) if (facesMesh(a, b)) return true;
    return false;
  }

  // Отсечка: колокольчик ещё достижим (оптимистично)?
  function endReachable() {
    const seen = new Set([startIdx]);
    const queue = [startIdx];
    while (queue.length > 0) {
      const i = queue.shift();
      for (const { s, j } of neighbors[i]) {
        if (seen.has(j)) continue;
        if (edgePossible(i, s, j)) {
          seen.add(j);
          queue.push(j);
        }
      }
    }
    return seen.has(endIdx);
  }

  const solutions = [];
  const assign = new Array(rotatable.length).fill(0);

  function bt(k) {
    if (solutions.length >= maxSolutions) return;
    if (k === rotatable.length) {
      const s = createMechPuzzle(level);
      rotatable.forEach((idx, k2) => { s.rot[idx] = variants[k2][assign[k2]]; });
      if (isMechSolved(s)) solutions.push([...assign]);
      return;
    }
    for (let v = 0; v < variants[k].length; v++) {
      assign[k] = v;
      rotOf[rotatable[k]] = variants[k][v];
      if (endReachable()) bt(k + 1);
    }
    rotOf[rotatable[k]] = null;
  }
  bt(0);
  return { count: solutions.length, solutions, rotatable };
}

// Подсказка: ближайшее решение → какую шестерёнку повернуть.
export function mechHint(state) {
  const { level } = state;
  const { count, solutions, rotatable } = solveMech(level, 64);
  if (count === 0) return { type: 'unsolvable' };
  const variants = rotatable.map((i) => gearVariants(level.tiles[i]));
  let best = null;
  let bestDist = Infinity;
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
export function validateMechLevel(level) {
  const problems = [];
  const [w, h] = level.grid;
  const seen = new Set();
  let starts = 0;
  let ends = 0;
  for (const t of level.tiles) {
    const [x, y] = t.pos;
    if (x < 0 || y < 0 || x >= w || y >= h) problems.push('деталь вне сетки');
    const key = t.pos.join(',');
    if (seen.has(key)) problems.push(`две детали в клетке ${key}`);
    seen.add(key);
    if (t.type === 'start') starts++;
    if (t.type === 'end') ends++;
    if (t.type === 'start' || t.type === 'end' || t.type === 'gear') {
      if (!Array.isArray(t.faces) || t.faces.length !== 4) {
        problems.push(`деталь ${key}: нужны ровно 4 грани (faces)`);
      } else {
        for (const f of t.faces) {
          if (f !== 'pin' && f !== 'socket' && f != null) {
            problems.push(`деталь ${key}: недопустимая грань «${f}»`);
          }
        }
      }
    }
    if (t.type === 'start' && !(t.faces || []).includes('pin')) {
      problems.push('рукояти нужен хотя бы один шип (pin)');
    }
    if (t.type === 'end' && !(t.faces || []).includes('socket')) {
      problems.push('колокольчику нужен хотя бы один паз (socket)');
    }
    if (t.type === 'gear' && Array.isArray(t.faces) && t.faces.filter(Boolean).length < 2) {
      problems.push(`шестерёнка ${key}: меньше двух активных граней`);
    }
  }
  if (starts !== 1) problems.push('нужна ровно одна рукоять (start)');
  if (ends !== 1) problems.push('нужен ровно один колокольчик (end)');
  const { count } = solveMech(level);
  if (count === 0) problems.push('нет решения');
  return { ok: problems.length === 0, problems, solutionCount: count };
}
