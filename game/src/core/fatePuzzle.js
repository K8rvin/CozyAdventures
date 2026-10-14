// Головоломка «Карты судьбы»: гость лавки рассказывает историю в 3–4 частях
// («Что было», «Что есть», «Что гнетёт», «Совет»), а хозяин раскладывает
// карты судьбы по позициям расклада. У каждой карты — имя и значения
// (теги смыслов); у каждой позиции истории — список подходящих карт (accept).
// Полный расклад проверяется с расцветкой, как в «Загадке Хранителя»:
//   exact   — карта подходит этой позиции
//   present — карта НЕ подходит, но делит значение с ожидаемой (близко!)
//   absent  — совсем не та карта
// Неверный расклад — ошибка: первые FATE_FREE_MISTAKES бесплатны, дальше
// каждая съедает часть монет награды (пол FATE_MIN_FACTOR).
// Чистая логика, без DOM. Словарь карт (имена/значения) — в data/puzzlesFate.js;
// ядро получает его при создании и хранит в state.cards.
//
// Уровень:
//   guest: { name, icon }           — гость (иконка-фолбэк под портрет)
//   story: [{ label, text, accept: ['cardId', ...] }] — 3–4 позиции расклада
//   hand: ['cardId', ...]           — карты на столе (с обманками)
//
// Рука ПЕРЕМЕШИВАЕТСЯ при создании (иначе порядок в данных прожаривает ответ).
// Третий аргумент createFatePuzzle — ГСЧ для детерминированных тестов.

export const FATE_FREE_MISTAKES = 3;
export const FATE_MISTAKE_STEP = 0.1; // −10% монет за ошибку сверх бесплатных
export const FATE_MIN_FACTOR = 0.5;

export function createFatePuzzle(level, cards, rng = Math.random) {
  // Рука перемешивается при создании (Фишер–Йетс); rng инжектируется в тестах
  const hand = [...level.hand];
  for (let i = hand.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [hand[i], hand[j]] = [hand[j], hand[i]];
  }
  return {
    level,
    cards: cards || {},
    hand,
    slots: Array(level.story.length).fill(null), // id карт по позициям
    attempts: [], // [{ cards: [...], marks: [...] }]
    mistakes: 0,
    history: [],
    moves: 0,
  };
}

export function cardInfo(state, cardId) {
  return state.cards[cardId] || null;
}

// Положить карту в первую свободную позицию. Карта разыгрывается один раз.
export function placeCard(state, cardId) {
  if (!state.hand.includes(cardId)) return false;
  if (state.slots.includes(cardId)) return false;
  const slot = state.slots.indexOf(null);
  if (slot < 0) return false;
  return placeCardAt(state, cardId, slot);
}

// Положить карту в конкретную позицию (перетаскивание на столе)
export function placeCardAt(state, cardId, slot) {
  if (!state.hand.includes(cardId)) return false;
  if (slot < 0 || slot >= state.slots.length || state.slots[slot]) return false;
  if (state.slots.includes(cardId)) return false;
  state.slots[slot] = cardId;
  state.history.push({ kind: 'place', slot, card: cardId });
  state.moves += 1;
  return true;
}

// Вернуть карту с позиции в руку
export function removeSlot(state, slot) {
  if (slot < 0 || slot >= state.slots.length || !state.slots[slot]) return false;
  state.history.push({ kind: 'remove', slot, card: state.slots[slot] });
  state.slots[slot] = null;
  state.moves += 1;
  return true;
}

export function undoFate(state) {
  const last = state.history.pop();
  if (!last) return false;
  if (last.kind === 'place') state.slots[last.slot] = null;
  else if (last.kind === 'remove') state.slots[last.slot] = last.card;
  state.moves += 1;
  return true;
}

export function resetFate(state) {
  state.slots = state.slots.map(() => null);
  state.history = [];
  state.attempts = []; // история неверных раскладов тоже сгорает (ошибки-штрафы остаются)
  state.moves += 1;
}

export function isFull(state) {
  return state.slots.every(Boolean);
}

// Карта точно подходит позиции?
function isExact(level, slot, cardId) {
  return level.story[slot].accept.includes(cardId);
}

export function isFateSolved(state) {
  return isFull(state) && state.slots.every((c, i) => isExact(state.level, i, c));
}

// Карта «близко» к позиции: делит хотя бы одно значение с ожидаемой картой
function isNear(state, slot, cardId) {
  const mine = new Set(cardInfo(state, cardId)?.meanings || []);
  if (!mine.size) return false;
  return state.level.story[slot].accept.some((wantId) =>
    (cardInfo(state, wantId)?.meanings || []).some((m) => mine.has(m)));
}

// Разметка расклада по позициям
export function markSpread(state, cards) {
  return cards.map((cardId, i) => {
    if (isExact(state.level, i, cardId)) return 'exact';
    if (isNear(state, i, cardId)) return 'present';
    return 'absent';
  });
}

// Проверка полного расклада. Верно — solved; неверно — расклад уходит
// в историю с расцветкой, карты возвращаются, засчитывается ошибка.
export function submitFate(state) {
  if (!isFull(state)) return null;
  if (isFateSolved(state)) return { solved: true };
  const cards = [...state.slots];
  const marks = markSpread(state, cards);
  state.attempts.push({ cards, marks });
  state.mistakes += 1;
  state.slots = state.slots.map(() => null);
  state.history = [];
  return { solved: false, marks };
}

// Множитель монет награды: первые ошибки бесплатны, дальше −10% за штуку
export function rewardFactor(state) {
  const over = Math.max(0, state.mistakes - FATE_FREE_MISTAKES);
  return Math.max(FATE_MIN_FACTOR, 1 - over * FATE_MISTAKE_STEP);
}

// Сколько позиций занято (для статуса)
export function fateProgress(state) {
  return { ok: state.slots.filter(Boolean).length, total: state.slots.length };
}

// Подсказка: верная карта в первую пустую позицию (из ещё не разыгранных)
export function fateHint(state) {
  const slot = state.slots.indexOf(null);
  if (slot < 0) return null;
  const card = state.level.story[slot].accept.find((c) => !state.slots.includes(c));
  return card ? { slot, card } : null;
}

export function applyFateHint(state) {
  const h = fateHint(state);
  if (!h) return null;
  placeCard(state, h.card);
  return h;
}

// Проверка уровня для конвейера
export function validateFateLevel(level, cards) {
  const problems = [];
  const dict = cards || {};
  if (!Array.isArray(level.story) || level.story.length < 3 || level.story.length > 4) {
    problems.push('история должна состоять из 3–4 позиций расклада');
  }
  const seen = new Set();
  (level.story || []).forEach((part, i) => {
    if (!part.label || !part.text) problems.push(`позиция ${i + 1}: пустой подпись или текст`);
    if ((part.text || '').trim().length < 12) problems.push(`позиция ${i + 1}: текст коротковат для истории`);
    if (!Array.isArray(part.accept) || part.accept.length === 0) {
      problems.push(`позиция ${i + 1}: нет подходящих карт (accept)`);
    }
    for (const c of part.accept || []) {
      if (!dict[c]) problems.push(`позиция ${i + 1}: неизвестная карта «${c}»`);
      if (seen.has(c)) problems.push(`карта «${c}» подходит двум позициям — расклад неоднозначен`);
      seen.add(c);
    }
  });
  if (!Array.isArray(level.hand) || level.hand.length === 0) {
    problems.push('нет карт на столе (hand)');
  } else {
    const handSet = new Set(level.hand);
    if (handSet.size !== level.hand.length) problems.push('дубли карт на столе');
    for (const c of level.hand) if (!dict[c]) problems.push(`неизвестная карта на столе «${c}»`);
    for (const c of seen) {
      if (!handSet.has(c)) problems.push(`подходящей карты «${c}» нет на столе`);
    }
    if (level.hand.length < (level.story || []).length + 2) {
      problems.push('мало карт-обманок: на столе должно быть минимум на 2 карты больше позиций');
    }
  }
  if (!level.guest || !level.guest.name || !/^[А-ЯЁ]/.test(level.guest.name)) {
    problems.push('гость без русского имени');
  }
  if ((level.story || []).some((p) => /[a-z]/i.test(p.text) || /[a-z]/i.test(p.label))) {
    problems.push('тексты истории латиницей');
  }
  return { ok: problems.length === 0, problems };
}
