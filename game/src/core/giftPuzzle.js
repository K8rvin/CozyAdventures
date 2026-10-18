// Головоломка «Подарок для гостя»: гость рассказывает историю с зашитыми
// условиями (need — должно быть, avoid — не должно быть), а хозяин выбирает
// на витрине один сувенир, чьи теги удовлетворяют ВСЕМ условиям.
// Анти-брутфорс: всего GIFT_MAX_TRIES попытки, награда тает по GIFT_FACTORS
// (первая 100%, вторая −25%, третья −50%); после третьей неудачи гость уходит
// подумать — уровень переигрывается заново, дополнительных штрафов нет.
// Подсказка кота прячет одну обманку с витрины (навсегда для этой попытки-
// сессии). Чистая логика, без DOM. Словарь сувениров — в data/puzzlesGift.js;
// ядро получает его при создании и хранит в state.souvenirs.
//
// Уровень:
//   guest: { name, icon, art }  — гость (портрет из «Карт судьбы»)
//   story: ['реплика', ...]     — история в 3–4 частях, условия зашиты в текст
//   need: ['тег', ...]          — обязательные теги
//   avoid: ['тег', ...]         — запрещённые теги
//   shelf: ['souv_*', ...]      — витрина (6–9 сувениров, перемешивается)
//   answer: 'souv_*'            — единственный подходящий сувенир
//   thanks: '...'               — благодарность гостя (оверлей победы, дневник)

export const GIFT_MAX_TRIES = 3;
export const GIFT_FACTORS = [1, 0.75, 0.5]; // по числу уже потраченных попыток

export function createGiftPuzzle(level, souvenirs, rng = Math.random) {
  // Витрина перемешивается при создании (Фишер–Йетс); rng инжектируется в тестах
  const shelf = [...level.shelf];
  for (let i = shelf.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shelf[i], shelf[j]] = [shelf[j], shelf[i]];
  }
  return {
    level,
    souvenirs: souvenirs || {},
    shelf,
    selected: null,   // id выбранного сувенира
    hidden: [],       // id сувениров, спрятанных подсказкой
    tries: 0,         // потраченные попытки (ошибки)
    gone: false,      // гость ушёл думать — пора начинать заново
    history: [],
    moves: 0,
  };
}

export function souvenirInfo(state, id) {
  return state.souvenirs[id] || null;
}

// Нарушенные условия для сувенира: сначала запреты, потом недостающее
export function brokenConditions(level, id, souvenirs) {
  const tags = new Set((souvenirs || {})[id]?.tags || []);
  const broken = [];
  for (const tag of level.avoid || []) {
    if (tags.has(tag)) broken.push({ kind: 'avoid', tag });
  }
  for (const tag of level.need || []) {
    if (!tags.has(tag)) broken.push({ kind: 'need', tag });
  }
  return broken;
}

export function giftFits(level, id, souvenirs) {
  return brokenConditions(level, id, souvenirs).length === 0;
}

// Тап по сувениру: выбрать / снять выбор (повторный тап по тому же)
export function selectGift(state, id) {
  if (state.gone || state.hidden.includes(id)) return false;
  if (!state.shelf.includes(id)) return false;
  if (state.selected === id) {
    state.history.push({ kind: 'deselect', id });
    state.selected = null;
  } else {
    state.history.push({ kind: 'select', id, prev: state.selected });
    state.selected = id;
  }
  state.moves += 1;
  return true;
}

export function undoGift(state) {
  const last = state.history.pop();
  if (!last) return false;
  if (last.kind === 'select') state.selected = last.prev;
  else if (last.kind === 'deselect') state.selected = last.id;
  state.moves += 1;
  return true;
}

// Сброс снимает выбор; спрятанные подсказкой обманки не возвращаются
// (помощь кота — необратима, как и её запись в hintsUsed)
export function resetGift(state) {
  state.selected = null;
  state.history = [];
  state.moves += 1;
}

// Вручить выбранный подарок.
// Верно → { result: 'win' }. Неверно → { result: 'hint', broken } с честным
// намёком на первое нарушенное условие; третья неудача → { result: 'gone' }.
export function giveGift(state) {
  if (state.gone || !state.selected) return null;
  const id = state.selected;
  const broken = brokenConditions(state.level, id, state.souvenirs);
  state.moves += 1;
  if (broken.length === 0) return { result: 'win', id };
  state.tries += 1;
  state.selected = null;
  state.history = [];
  if (state.tries >= GIFT_MAX_TRIES) {
    state.gone = true;
    return { result: 'gone', id, broken: broken[0] };
  }
  return { result: 'hint', id, broken: broken[0], triesLeft: GIFT_MAX_TRIES - state.tries };
}

// Множитель монет награды: тает с каждой потраченной попыткой
export function rewardFactor(state) {
  const i = Math.min(state.tries, GIFT_FACTORS.length - 1);
  return GIFT_FACTORS[i];
}

export function giftProgress(state) {
  return { tries: state.tries, max: GIFT_MAX_TRIES, gone: state.gone };
}

// Подсказка: кот прячет с витрины одну обманку (ту, что ближе всего к ответу
// по тегам — самую опасную). Показывает, но не применяет.
export function giftHint(state) {
  if (state.gone) return null;
  const answerTags = new Set(state.souvenirs[state.level.answer]?.tags || []);
  let best = null;
  let bestScore = -1;
  for (const id of state.shelf) {
    if (id === state.level.answer || state.hidden.includes(id)) continue;
    const tags = state.souvenirs[id]?.tags || [];
    const score = tags.filter((t) => answerTags.has(t)).length;
    if (score > bestScore) { bestScore = score; best = id; }
  }
  return best ? { id: best } : null;
}

export function applyGiftHint(state) {
  const h = giftHint(state);
  if (!h) return null;
  state.hidden.push(h.id);
  if (state.selected === h.id) state.selected = null;
  state.moves += 1;
  return h;
}

// После ухода гостя уровень начинается заново: свежее состояние, тот же rng
export function restartGift(state, rng = Math.random) {
  return createGiftPuzzle(state.level, state.souvenirs, rng);
}

// Проверка уровня для конвейера
export function validateGiftLevel(level, souvenirs) {
  const problems = [];
  const dict = souvenirs || {};
  if (!Array.isArray(level.story) || level.story.length < 3 || level.story.length > 4) {
    problems.push('история должна состоять из 3–4 реплик');
  }
  (level.story || []).forEach((text, i) => {
    if ((text || '').trim().length < 12) problems.push(`реплика ${i + 1}: коротковата для истории`);
  });
  if (!Array.isArray(level.need) || level.need.length === 0) {
    problems.push('нужно хотя бы одно обязательное условие (need)');
  }
  const condTags = new Set([...(level.need || []), ...(level.avoid || [])]);
  const allTags = new Set(Object.values(dict).flatMap((s) => s.tags));
  for (const tag of condTags) {
    if (!allTags.has(tag)) problems.push(`условие «${tag}» не встречается ни у одного сувенира`);
  }
  if (!dict[level.answer]) {
    problems.push(`неизвестный ответ «${level.answer}»`);
  } else if (!giftFits(level, level.answer, dict)) {
    problems.push(`ответ «${level.answer}» сам нарушает условия`);
  }
  if (!Array.isArray(level.shelf) || level.shelf.length < 6 || level.shelf.length > 9) {
    problems.push('витрина должна держать 6–9 сувениров');
  } else {
    const shelfSet = new Set(level.shelf);
    if (shelfSet.size !== level.shelf.length) problems.push('дубли на витрине');
    for (const id of level.shelf) {
      if (!dict[id]) { problems.push(`неизвестный сувенир «${id}»`); continue; }
      const broken = brokenConditions(level, id, dict);
      if (id === level.answer) continue;
      if (broken.length === 0) problems.push(`сувенир «${id}» тоже подходит — ответ не единственный`);
    }
    if (!shelfSet.has(level.answer)) problems.push('ответа нет на витрине');
  }
  if (!level.guest || !level.guest.name || !/^[А-ЯЁ]/.test(level.guest.name)) {
    problems.push('гость без русского имени');
  }
  if ((level.story || []).some((t) => /[a-z]/i.test(t))) problems.push('история латиницей');
  if (/[a-z]/i.test(level.name || '') || /[a-z]/i.test(level.thanks || '')) {
    problems.push('имя или благодарность латиницей');
  }
  for (const s of Object.values(dict)) {
    for (const t of s.tags) {
      if (/[a-z]/i.test(t)) problems.push(`тег «${t}» латиницей`);
    }
  }
  return { ok: problems.length === 0, problems };
}
