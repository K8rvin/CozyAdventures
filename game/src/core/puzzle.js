// Движок головоломки «Свет и фонарики». Чистая логика, без DOM.
// Состояние = уровень + текущие ориентации зеркал + история ходов.

export const DIR = [
  [0, -1], // 0 вверх
  [1, 0],  // 1 вправо
  [0, 1],  // 2 вниз
  [-1, 0], // 3 влево
];

// Отражение направления луча зеркалом.
// orient 0 = '\', orient 1 = '/'
export function reflect(dir, orient) {
  return orient === 0
    ? { 0: 3, 1: 2, 2: 1, 3: 0 }[dir] // '\'
    : { 0: 1, 1: 0, 2: 3, 3: 2 }[dir]; // '/'
}

export function createPuzzle(level) {
  const mirrors = level.objects
    .map((o, i) => ({ ...o, index: i }))
    .filter((o) => o.type === 'mirror');
  return {
    level,
    // ориентации зеркал по индексу объекта в level.objects
    orient: Object.fromEntries(mirrors.map((m) => [m.index, m.orient ?? 0])),
    history: [], // стек ходов для отмены
    moves: 0,
  };
}

// Повернуть зеркало (по индексу объекта). Возвращает true, если ход сделан.
export function rotateMirror(state, objectIndex) {
  const obj = state.level.objects[objectIndex];
  if (!obj || obj.type !== 'mirror') return false;
  state.history.push({ objectIndex, prev: state.orient[objectIndex] });
  state.orient[objectIndex] = state.orient[objectIndex] === 0 ? 1 : 0;
  state.moves += 1;
  return true;
}

export function undo(state) {
  const last = state.history.pop();
  if (!last) return false;
  state.orient[last.objectIndex] = last.prev;
  state.moves += 1;
  return true;
}

export function reset(state) {
  for (const [idx, o] of Object.entries(state.orient)) {
    state.orient[idx] = state.level.objects[idx].orient ?? 0;
  }
  state.history = [];
  state.moves += 1;
}

// Трассировка света. Возвращает:
// { lit: Map "x,y" -> true, lanternsLit: Set(индексы), mothsAwake: Set(индексы), beams: [сегменты] }
export function traceLight(state) {
  const { level } = state;
  const [w, h] = level.grid;
  const at = new Map(); // "x,y" -> {obj, index}
  level.objects.forEach((o, i) => at.set(o.pos[0] + ',' + o.pos[1], { obj: o, index: i }));

  const lanternsLit = new Set();
  const mothsAwake = new Set();
  const beams = [];
  const visited = new Set(); // "x,y,dir" — защита от циклов

  for (const src of level.objects) {
    if (src.type !== 'source') continue;
    let [x, y] = src.pos;
    let d = src.dir;
    let guard = w * h * 4 + 16;
    while (guard-- > 0) {
      const [dx, dy] = DIR[d];
      x += dx; y += dy;
      if (x < 0 || y < 0 || x >= w || y >= h) break;
      beams.push({ from: [x - dx, y - dy], to: [x, y] });
      const key = `${x},${y},${d}`;
      if (visited.has(key)) break;
      visited.add(key);
      const cell = at.get(`${x},${y}`);
      if (!cell) continue;
      const t = cell.obj.type;
      if (t === 'wall' || t === 'moth' || t === 'source') {
        if (t === 'moth') mothsAwake.add(cell.index);
        break;
      }
      if (t === 'lantern') {
        lanternsLit.add(cell.index);
        continue; // фонарь пропускает свет дальше
      }
      if (t === 'mirror') {
        d = reflect(d, state.orient[cell.index]);
      }
    }
  }

  return { lanternsLit, mothsAwake, beams };
}

export function isSolved(state) {
  const { level } = state;
  const { lanternsLit, mothsAwake } = traceLight(state);
  if (mothsAwake.size > 0) return false;
  return level.objects.every((o, i) => o.type !== 'lantern' || lanternsLit.has(i));
}

// Краткий статус для UI: сколько фонарей горит и не разбужена ли моль.
export function status(state) {
  const { level } = state;
  const { lanternsLit, mothsAwake } = traceLight(state);
  const total = level.objects.filter((o) => o.type === 'lantern').length;
  return {
    lanternsLit: lanternsLit.size,
    lanternsTotal: total,
    mothsAwake: mothsAwake.size,
    solved: mothsAwake.size === 0 && lanternsLit.size === total,
  };
}
