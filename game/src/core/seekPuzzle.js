// Движок «Поиск предметов» — искалка по предметам, нарисованным в сцене.
// Ищем ВСЕ экземпляры каждого вида: «Все голуби: 2 из 8».
//
// Уровень:
//   sceneSize: [w, h]
//   groups: [{ id, label, spots: [{ x, y, r }] }]

export function createSeekPuzzle(level) {
  return {
    level,
    found: new Set(), // ключи "groupId:spotIndex"
    misses: 0,
    moves: 0,
  };
}

export function seekTargets(level) {
  return level.groups;
}

function spotKey(group, index) {
  return `${group.id}:${index}`;
}

// Тап в ЛОГИЧЕСКИХ координатах сцены. Споты могут перекрываться —
// тогда предпочитаем ещё НЕ найденный экземпляр.
export function seekTap(state, x, y) {
  state.moves += 1;
  const matches = [];
  for (const group of state.level.groups) {
    for (let i = 0; i < group.spots.length; i++) {
      const s = group.spots[i];
      const dx = x - s.x;
      const dy = y - s.y;
      if (dx * dx + dy * dy > s.r * s.r) continue;
      matches.push({ group, spotIndex: i, spot: s, found: state.found.has(spotKey(group, i)) });
    }
  }
  if (matches.length === 0) return { result: 'empty' };
  const fresh = matches.find((m) => !m.found);
  if (!fresh) return { result: 'already', ...matches[0] };
  state.found.add(spotKey(fresh.group, fresh.spotIndex));
  return { result: 'found', ...fresh };
}

export function groupProgress(state, group) {
  const found = group.spots.filter((_, i) => state.found.has(spotKey(group, i))).length;
  return { found, total: group.spots.length };
}

export function seekProgress(state) {
  let found = 0;
  let total = 0;
  const groups = state.level.groups.map((g) => {
    const p = groupProgress(state, g);
    found += p.found;
    total += p.total;
    return { id: g.id, label: g.label, ...p };
  });
  return { found, total, groups };
}

export function isSeekSolved(state) {
  const p = seekProgress(state);
  return p.found === p.total;
}

// Подсказка: первый ненайденный экземпляр.
export function seekHint(state) {
  for (const group of state.level.groups) {
    for (let i = 0; i < group.spots.length; i++) {
      if (state.found.has(spotKey(group, i))) continue;
      const s = group.spots[i];
      return { type: 'point', x: s.x, y: s.y, label: group.label, id: group.id };
    }
  }
  return { type: 'already' };
}

// Валидация для конвейера.
export function validateSeekLevel(level) {
  const problems = [];
  const [W, H] = level.sceneSize || [1000, 650];
  if (!level.groups || level.groups.length === 0) problems.push('нет групп целей');
  const ids = new Set();
  for (const g of level.groups || []) {
    if (ids.has(g.id)) problems.push(`дубль id группы ${g.id}`);
    ids.add(g.id);
    if (!g.label) problems.push(`у группы ${g.id} нет label`);
    if (!g.spots || g.spots.length === 0) problems.push(`у группы ${g.id} нет спотов`);
    for (const s of g.spots || []) {
      if (s.x < 0 || s.x > W || s.y < 0 || s.y > H) problems.push(`спот ${g.id} вне сцены`);
      if (!(s.r >= 12 && s.r <= 120)) problems.push(`спот ${g.id}: странный радиус ${s.r}`);
    }
  }
  // Споты разных групп не должны перекрываться
  const all = [];
  for (const g of level.groups || []) {
    for (const s of g.spots || []) all.push({ g: g.id, ...s });
  }
  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      if (all[i].g === all[j].g) continue;
      const d = Math.hypot(all[i].x - all[j].x, all[i].y - all[j].y);
      if (d < (all[i].r + all[j].r) * 0.5) {
        problems.push(`споты ${all[i].g} и ${all[j].g} перекрываются`);
      }
    }
  }
  return { ok: problems.length === 0, problems };
}
