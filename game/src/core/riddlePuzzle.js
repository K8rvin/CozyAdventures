// Головоломка «Загадка Хранителя» (мир 3, Книжный чердак). Чистая логика, без DOM.
// На странице — загадка (народная) или стихотворение классика без последней
// строки. Ответ набирается буквами ПОЛНОГО алфавита (буквы не расходуются).
// Неверная попытка остаётся на странице с расцветкой: буква на месте /
// есть в ответе / нет в ответе. Попытка = ошибка: первые FREE_MISTAKES
// бесплатны, дальше каждая съедает часть монет награды (пол MIN_FACTOR).
//
// Уровень:
//   riddle: ['строка', ...]  — стих/загадка
//   answer: 'КНИГА'          — ответ (кириллица; '✦' — видимый разделитель слов)
//   author: 'А. С. Пушкин'   — необязательная атрибуция-подсказка

export const FREE_MISTAKES = 5;
export const MISTAKE_STEP = 0.1; // −10% монет за ошибку сверх бесплатных
export const MIN_FACTOR = 0.5;

// Полный алфавит для клавиатуры
export const ALPHABET = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');

// Буквы ответа без разделителей
export function answerLetters(level) {
  return level.answer.replaceAll('✦', '').split('');
}

export function createRiddlePuzzle(level) {
  return {
    level,
    slots: Array(answerLetters(level).length).fill(null), // буквы (строки)
    attempts: [], // [{ letters: [...], marks: [...] }]
    mistakes: 0,
    history: [],
    moves: 0,
  };
}

// Положить букву в первое свободное окошко
export function placeLetter(state, letter) {
  if (!ALPHABET.includes(letter)) return false;
  const slot = state.slots.indexOf(null);
  if (slot < 0) return false;
  state.slots[slot] = letter;
  state.history.push({ kind: 'place', slot });
  state.moves += 1;
  return true;
}

// Убрать букву из окошка
export function removeSlot(state, slot) {
  if (slot < 0 || slot >= state.slots.length || !state.slots[slot]) return false;
  state.history.push({ kind: 'remove', slot, letter: state.slots[slot] });
  state.slots[slot] = null;
  state.moves += 1;
  return true;
}

export function undoRiddle(state) {
  const last = state.history.pop();
  if (!last) return false;
  if (last.kind === 'place') state.slots[last.slot] = null;
  else if (last.kind === 'remove') state.slots[last.slot] = last.letter;
  state.moves += 1;
  return true;
}

export function resetRiddle(state) {
  state.slots = state.slots.map(() => null);
  state.history = [];
  state.moves += 1;
}

export function isFull(state) {
  return state.slots.every(Boolean);
}

export function isRiddleSolved(state) {
  return isFull(state)
    && state.slots.join('') === answerLetters(state.level).join('');
}

// Разметка попытки по правилам Wordle с корректным учётом дублей:
// сначала точные совпадения, потом «есть в ответе» по остаточным буквам.
export function markAttempt(level, letters) {
  const target = answerLetters(level);
  const marks = Array(letters.length).fill('absent');
  const rest = {};
  for (let i = 0; i < letters.length; i++) {
    if (letters[i] === target[i]) marks[i] = 'exact';
    else rest[target[i]] = (rest[target[i]] || 0) + 1;
  }
  for (let i = 0; i < letters.length; i++) {
    if (marks[i] === 'exact') continue;
    if (rest[letters[i]] > 0) {
      marks[i] = 'present';
      rest[letters[i]] -= 1;
    }
  }
  return marks;
}

// Проверка заполненной строки. Верно — solved; неверно — попытка уходит
// в историю с расцветкой, окошки очищаются, засчитывается ошибка.
export function submitRiddle(state) {
  if (!isFull(state)) return null;
  if (isRiddleSolved(state)) return { solved: true };
  const letters = [...state.slots];
  const marks = markAttempt(state.level, letters);
  state.attempts.push({ letters, marks });
  state.mistakes += 1;
  state.slots = state.slots.map(() => null);
  state.history = [];
  return { solved: false, marks };
}

// Лучший известный статус буквы по всем попыткам (для окраски клавиатуры)
export function letterMarks(state) {
  const rank = { absent: 0, present: 1, exact: 2 };
  const best = {};
  for (const att of state.attempts) {
    att.letters.forEach((letter, i) => {
      const m = att.marks[i];
      if (!best[letter] || rank[m] > rank[best[letter]]) best[letter] = m;
    });
  }
  return best;
}

// Множитель монет награды: первые ошибки бесплатны, дальше −10% за штуку
export function rewardFactor(state) {
  const over = Math.max(0, state.mistakes - FREE_MISTAKES);
  return Math.max(MIN_FACTOR, 1 - over * MISTAKE_STEP);
}

// Сколько букв текущей строки стоит на своих местах (для статуса)
export function riddleProgress(state) {
  const target = answerLetters(state.level);
  const ok = state.slots.filter((s, i) => s && s === target[i]).length;
  return { ok, total: target.length };
}

// Подсказка: верная буква в первое пустое окошко
export function riddleHint(state) {
  const slot = state.slots.indexOf(null);
  if (slot < 0) return null;
  return { slot, letter: answerLetters(state.level)[slot] };
}

export function applyRiddleHint(state) {
  const h = riddleHint(state);
  if (!h) return null;
  placeLetter(state, h.letter);
  return h;
}

// Проверка уровня для конвейера
export function validateRiddleLevel(level) {
  const problems = [];
  if (!/^[А-ЯЁ✦]+$/.test(level.answer)) {
    problems.push('ответ должен состоять из кириллицы А-ЯЁ и разделителей ✦');
  }
  if (level.answer.startsWith('✦') || level.answer.endsWith('✦') || level.answer.includes('✦✦')) {
    problems.push('разделитель ✦ на краю ответа или два подряд');
  }
  if (answerLetters(level).length < 3) problems.push('ответ короче 3 букв');
  if (!Array.isArray(level.riddle) || level.riddle.length === 0
    || level.riddle.some((l) => typeof l !== 'string' || !l.trim())) {
    problems.push('загадка должна быть непустым массивом строк');
  }
  if ((level.riddle || []).some((l) => /[a-z]/i.test(l))) {
    problems.push('строки загадки латиницей');
  }
  if (level.author && !/^[А-ЯЁ]/.test(level.author)) {
    problems.push('атрибуция автора не по-русски');
  }
  return { ok: problems.length === 0, problems };
}
