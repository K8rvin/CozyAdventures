// Движок головоломки «Полки и товары» (мир 2). Чистая логика, без DOM.
// Игрок расставляет товары по полкам так, чтобы выполнялись правила соседства.

// Русские названия тегов для текстов правил и нарушений
export const TAG_LABEL = {
  fragile: 'хрупкое', heavy: 'тяжёлое', metal: 'металл', magic: 'магия',
  potion: 'зелья', herb: 'травы', food: 'еда', glow: 'светящееся',
};
// Творительный падеж для «рядом с …»
const TAG_LABEL_INST = {
  fragile: 'хрупким', heavy: 'тяжёлым', metal: 'металлом', magic: 'магией',
  potion: 'зельями', herb: 'травами', food: 'едой', glow: 'светящимся',
};
//
// Уровень:
//   grid: [w, h]
//   cells: [{ pos:[x,y], kind: 'shelf' | 'light' | 'blocked' }]  — shelf и light можно ставить
//   items: [{ id, name, icon, tags: [] }]
//   rules: {
//     notAdjacent: [[tagA, tagB]],  — такие предметы НЕ рядом (по стороне)
//     mustAdjacent: [[tagA, tagB]], — каждый предмет с tagA должен стоять рядом с tagB
//     onLight: [tag]                — предметы с тегом должны стоять на свету (клетка 'light')
//   }

export function createShelfPuzzle(level) {
  return {
    level,
    placement: {}, // itemId -> [x, y] | undefined
    history: [],
    moves: 0,
  };
}

export function shelfCells(level) {
  return level.cells.filter((c) => c.kind === 'shelf' || c.kind === 'light');
}

export function isLightCell(level, x, y) {
  return level.cells.some((c) => c.kind === 'light' && c.pos[0] === x && c.pos[1] === y);
}

function cellKey(x, y) {
  return `${x},${y}`;
}

export function cellOf(state, x, y) {
  for (const [itemId, pos] of Object.entries(state.placement)) {
    if (pos && pos[0] === x && pos[1] === y) return itemId;
  }
  return null;
}

// Поставить предмет на клетку. Возвращает { ok, error? }
export function placeItem(state, itemId, x, y) {
  const { level } = state;
  const item = level.items.find((i) => i.id === itemId);
  if (!item) return { ok: false, error: 'Нет такого товара' };
  const cell = shelfCells(level).find((c) => c.pos[0] === x && c.pos[1] === y);
  if (!cell) return { ok: false, error: 'Сюда не поставить' };
  const occupant = cellOf(state, x, y);
  if (occupant) return { ok: false, error: 'Клетка занята' };
  state.history.push({ itemId, prev: state.placement[itemId] ?? null });
  state.placement[itemId] = [x, y];
  state.moves += 1;
  return { ok: true };
}

export function removeItem(state, itemId) {
  if (!(itemId in state.placement) || !state.placement[itemId]) return false;
  state.history.push({ itemId, prev: state.placement[itemId] });
  state.placement[itemId] = null;
  state.moves += 1;
  return true;
}

export function undoShelf(state) {
  const last = state.history.pop();
  if (!last) return false;
  state.placement[last.itemId] = last.prev;
  state.moves += 1;
  return true;
}

export function resetShelf(state) {
  state.placement = {};
  state.history = [];
  state.moves += 1;
}

// --- Проверка правил ---

function adjacent(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) === 1;
}

// Возвращает список нарушений: { rule, itemA?, itemB?, text }
export function violations(state) {
  const { level } = state;
  const out = [];
  const placed = Object.entries(state.placement)
    .filter(([, pos]) => pos)
    .map(([itemId, pos]) => ({ item: level.items.find((i) => i.id === itemId), pos }));

  const hasTag = (item, tag) => item.tags.includes(tag);

  for (const [tagA, tagB] of level.rules.notAdjacent || []) {
    for (const a of placed) {
      for (const b of placed) {
        if (a.item.id >= b.item.id) continue;
        const match = (hasTag(a.item, tagA) && hasTag(b.item, tagB)) ||
                      (hasTag(a.item, tagB) && hasTag(b.item, tagA));
        if (match && adjacent(a.pos, b.pos)) {
          out.push({
            rule: 'notAdjacent', itemA: a.item.id, itemB: b.item.id,
            text: `«${a.item.name}» нельзя рядом с «${b.item.name}»`,
          });
        }
      }
    }
  }

  for (const [tagA, tagB] of level.rules.mustAdjacent || []) {
    for (const a of placed) {
      if (!hasTag(a.item, tagA)) continue;
      const ok = placed.some((b) => b.item.id !== a.item.id && hasTag(b.item, tagB) && adjacent(a.pos, b.pos));
      if (!ok) {
        out.push({
          rule: 'mustAdjacent', itemA: a.item.id, needTag: tagB,
          text: `«${a.item.name}» должен стоять рядом с «${TAG_LABEL_INST[tagB] || tagB}»`,
        });
      }
    }
  }

  for (const tag of level.rules.onLight || []) {
    for (const a of placed) {
      if (!hasTag(a.item, tag)) continue;
      if (!isLightCell(level, a.pos[0], a.pos[1])) {
        out.push({
          rule: 'onLight', itemA: a.item.id,
          text: `«${a.item.name}» нужно на свету`,
        });
      }
    }
  }

  return out;
}

export function isShelfSolved(state) {
  const allPlaced = state.level.items.every((i) => state.placement[i.id]);
  return allPlaced && violations(state).length === 0;
}

// --- Решатель (бэктрекинг) ---

// Находит до maxSolutions решений. items и клеток немного, перебор с отсечками.
export function solveShelf(level, maxSolutions = 32) {
  const items = level.items;
  const cells = shelfCells(level);
  if (items.length > cells.length) return { count: 0, solutions: [], impossible: true };
  if (cells.length > 12 || items.length > 8) return { count: 0, solutions: [], tooBig: true };

  const solutions = [];
  const assign = new Array(items.length).fill(-1); // itemIdx -> cellIdx
  const usedCell = new Array(cells.length).fill(false);

  // Частичная проверка: только правила, где оба предмета уже расставлены / onLight для расставленных
  function partialOk(upto) {
    const placement = {};
    for (let i = 0; i <= upto; i++) {
      if (assign[i] >= 0) placement[items[i].id] = cells[assign[i]].pos;
    }
    const probe = { level, placement };
    const v = violations(probe);
    // notAdjacent и onLight нарушения окончательны; mustAdjacent может исправиться позже
    return !v.some((x) => x.rule === 'notAdjacent' || x.rule === 'onLight');
  }

  function fullOk() {
    const placement = {};
    items.forEach((it, i) => { placement[it.id] = cells[assign[i]].pos; });
    return violations({ level, placement }).length === 0;
  }

  function bt(k) {
    if (solutions.length >= maxSolutions) return;
    if (k === items.length) {
      if (fullOk()) solutions.push([...assign]);
      return;
    }
    for (let c = 0; c < cells.length; c++) {
      if (usedCell[c]) continue;
      assign[k] = c;
      usedCell[c] = true;
      if (partialOk(k)) bt(k + 1);
      assign[k] = -1;
      usedCell[c] = false;
    }
  }
  bt(0);
  return { count: solutions.length, solutions, cells };
}

// Адаптивная подсказка: ближайшее к текущей расстановке решение.
// { type:'place', itemId, pos } | { type:'remove', itemId } | { type:'already' } | { type:'unsolvable' }
export function shelfHint(state) {
  const { level } = state;
  const { count, solutions, cells } = solveShelf(level, 64);
  if (count === 0) return { type: 'unsolvable' };

  // Если какой-то поставленный предмет уже нарушает жёсткое правило — предложить убрать
  const bad = violations(state).filter((v) => v.rule === 'notAdjacent' || v.rule === 'onLight');
  if (bad.length > 0) {
    return { type: 'remove', itemId: bad[0].itemA, text: bad[0].text };
  }

  let best = null;
  let bestScore = -1;
  for (const sol of solutions) {
    let score = 0;
    level.items.forEach((it, i) => {
      const pos = cells[sol[i]].pos;
      const cur = state.placement[it.id];
      if (cur && cur[0] === pos[0] && cur[1] === pos[1]) score++;
    });
    if (score > bestScore) { bestScore = score; best = sol; }
  }

  // Первый предмет, который стоит не там (или ещё не поставлен)
  for (let i = 0; i < level.items.length; i++) {
    const it = level.items[i];
    const pos = cells[best[i]].pos;
    const cur = state.placement[it.id];
    if (!cur) return { type: 'place', itemId: it.id, pos };
    if (cur[0] !== pos[0] || cur[1] !== pos[1]) {
      return { type: 'move', itemId: it.id, from: cur, pos };
    }
  }
  return { type: 'already' };
}
