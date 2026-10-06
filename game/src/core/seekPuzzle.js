// Движок «Поиск предметов» — реалистичная искалка. Чистая логика, без DOM.
// Сцена — цельная иллюстрация; предметы стоят в свободных координатах
// (проценты ширины/высоты сцены), у каждого радиус попадания.
// Игрок ищет предметы по НАЗВАНИЯМ из списка.
//
// Уровень:
//   sceneSize: [w, h]           — логический размер сцены в px (напр. 1000×650)
//   scene: [{ id, icon, x, y, r, scale?, rot?, alpha?, target?, label }]
//   front: [{ icon, x, y, scale, alpha }] — передний план (рисуется поверх)

export function createSeekPuzzle(level) {
  return {
    level,
    found: new Set(),
    misses: 0,
    moves: 0,
  };
}

export function seekTargets(level) {
  return level.scene.filter((o) => o.target);
}

// Тап в ЛОГИЧЕСКИХ координатах сцены (px). Проверяем сверху вниз
// (поздние объекты рисуются поверх). Возвращает { result, object? }
export function seekTap(state, x, y) {
  const { level } = state;
  state.moves += 1;
  for (let i = level.scene.length - 1; i >= 0; i--) {
    const o = level.scene[i];
    const dx = x - o.x;
    const dy = y - o.y;
    const rr = o.r * (o.scale || 1);
    if (dx * dx + dy * dy > rr * rr) continue;
    if (!o.target) {
      state.misses += 1;
      return { result: 'decoy', object: o };
    }
    if (state.found.has(o.id)) return { result: 'already', object: o };
    state.found.add(o.id);
    return { result: 'found', object: o };
  }
  return { result: 'empty' };
}

export function isSeekSolved(state) {
  return seekTargets(state.level).every((o) => state.found.has(o.id));
}

export function seekProgress(state) {
  return { found: state.found.size, total: seekTargets(state.level).length };
}

// Подсказка: первый ненайденный предмет (светлячок укажет место).
export function seekHint(state) {
  const rest = seekTargets(state.level).filter((o) => !state.found.has(o.id));
  if (rest.length === 0) return { type: 'already' };
  return { type: 'point', x: rest[0].x, y: rest[0].y, label: rest[0].label, id: rest[0].id };
}

// Валидация для конвейера.
export function validateSeekLevel(level) {
  const problems = [];
  const targets = seekTargets(level);
  if (targets.length === 0) problems.push('нет ни одной цели (target)');
  const [W, H] = level.sceneSize || [1000, 650];
  const ids = new Set();
  for (const o of level.scene) {
    if (ids.has(o.id)) problems.push(`дубль id ${o.id}`);
    ids.add(o.id);
    if (o.x < 0 || o.x > W || o.y < 0 || o.y > H) problems.push(`объект ${o.id} вне сцены`);
    if (!(o.r >= 12 && o.r <= 90)) problems.push(`объект ${o.id}: странный радиус ${o.r}`);
    if (o.target && !o.label) problems.push(`у цели ${o.id} нет label`);
  }
  // Цели не должны полностью перекрывать друг друга
  for (let i = 0; i < targets.length; i++) {
    for (let j = i + 1; j < targets.length; j++) {
      const dx = targets[i].x - targets[j].x;
      const dy = targets[i].y - targets[j].y;
      if (Math.hypot(dx, dy) < (targets[i].r + targets[j].r) * 0.5) {
        problems.push(`цели ${targets[i].id} и ${targets[j].id} перекрываются`);
      }
    }
  }
  return { ok: problems.length === 0, problems };
}
