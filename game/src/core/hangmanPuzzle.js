// Головоломка «Строка» (мир 3, Книжный чердак) — по мотивам «виселицы».
// Чистая логика, без DOM. Стих без последней строки; строка скрыта под
// подчёркиваниями, игрок тапает буквы полного алфавита: верно — буква
// открывается во ВСЕХ местах строки, промах — буква блокируется, а свеча
// догорает на ступень. Каждый промах съедает 5% монет, догоревшая страница —
// ещё 10% (пол 30%). Решение без промахов даёт ×1,5 монет. Открытые буквы
// после догорания остаются, а новая свеча не возвращает уже потерянную награду.
//
// Уровень:
//   riddle: ['строка', ...]  — стих без последней строки
//   answer: 'ТОЧНО✦СЕРЕБРОМ' — скрытая строка (кириллица; '✦' — разделитель слов)
//   author: 'С. А. Есенин'   — необязательная атрибуция-подсказка

export const CANDLE_STEPS = 6; // ступеней воска до догорания
export const MISTAKE_STEP = 0.05; // −5% монет за каждый промах
export const SPOIL_STEP = 0.1; // дополнительно −10% за погасшую страницу
export const MIN_FACTOR = 0.3;
export const PERFECT_FACTOR = 1.5;

export const ALPHABET = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');

// Ё и Е — одна клавиша: ход «Е» открывает обе, «Ё» на клавиатуре нет
export function canonLetter(ch) {
  return ch === 'Ё' ? 'Е' : ch;
}

// Буквы строки без разделителей (канонизированные: Ё → Е)
export function answerLetters(level) {
  return level.answer.replaceAll('✦', '').split('').map(canonLetter);
}

export function createHangmanPuzzle(level) {
  return {
    level,
    revealed: new Set(),  // открытые буквы
    wrong: new Set(),     // промахи (заблокированные буквы)
    mistakes: 0,          // все промахи попытки; отмена и сброс не стирают их
    candleLeft: CANDLE_STEPS,
    spoiled: 0,           // сколько страниц погасло (тоже накопительно)
    history: [],          // для отмены
    moves: 0,
  };
}

// Тап по букве. Возвращает { ok, hit, burned } | { ok:false }
export function guessLetter(state, letter) {
  const canon = canonLetter(letter);
  if (!ALPHABET.includes(canon)) return { ok: false };
  if (state.revealed.has(canon) || state.wrong.has(canon)) return { ok: false };
  if (isHangmanSolved(state)) return { ok: false };
  state.moves += 1;
  const hit = answerLetters(state.level).includes(canon);
  const entry = { letter: canon, hit, prevCandle: state.candleLeft };
  state.history.push(entry);
  if (hit) {
    state.revealed.add(canon);
    return { ok: true, hit: true, burned: false };
  }
  state.wrong.add(canon);
  state.mistakes += 1;
  state.candleLeft -= 1;
  if (state.candleLeft <= 0) {
    // Свеча догорела: страница погасла. Открытые буквы остаются, новая свеча.
    state.spoiled += 1;
    state.candleLeft = CANDLE_STEPS;
    return { ok: true, hit: false, burned: true };
  }
  return { ok: true, hit: false, burned: false };
}

export function undoHangman(state) {
  const last = state.history.pop();
  if (!last) return false;
  if (last.hit) state.revealed.delete(last.letter);
  else state.wrong.delete(last.letter);
  state.candleLeft = last.prevCandle;
  state.moves += 1;
  // mistakes и spoiled сохраняются: отмена возвращает поле, но не стирает цену ошибки
  return true;
}

export function resetHangman(state) {
  state.revealed.clear();
  state.wrong.clear();
  state.candleLeft = CANDLE_STEPS;
  state.history = [];
  state.moves += 1;
  // mistakes и spoiled сохраняются: сброс не обнуляет цену уже сделанных ошибок
}

export function isHangmanSolved(state) {
  return answerLetters(state.level).every((ch) => state.revealed.has(ch));
}

// ×1,5 без единого промаха; иначе −5% за промах и −10% за страницу, пол 30%
export function rewardFactor(state) {
  if (state.mistakes === 0 && state.spoiled === 0) return PERFECT_FACTOR;
  return Math.max(MIN_FACTOR, 1 - state.mistakes * MISTAKE_STEP - state.spoiled * SPOIL_STEP);
}

// Прогресс: сколько различных букв строки открыто
export function hangmanProgress(state) {
  const distinct = new Set(answerLetters(state.level));
  const ok = [...distinct].filter((ch) => state.revealed.has(ch)).length;
  return { ok, total: distinct.size };
}

// Подсказка: открыть самую частую скрытую букву (детерминированно)
export function hangmanHint(state) {
  const counts = {};
  for (const ch of answerLetters(state.level)) {
    if (!state.revealed.has(ch)) counts[ch] = (counts[ch] || 0) + 1;
  }
  const best = Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ru'))[0];
  if (!best) return null;
  return { letter: best[0], count: best[1] };
}

export function applyHangmanHint(state) {
  const h = hangmanHint(state);
  if (!h) return null;
  const r = guessLetter(state, h.letter);
  return r.ok ? h : null;
}

// Проверка уровня для конвейера
export function validateHangmanLevel(level) {
  const problems = [];
  if (!/^[А-ЯЁ✦]+$/.test(level.answer)) {
    problems.push('ответ должен состоять из кириллицы А-ЯЁ и разделителей ✦');
  }
  if (level.answer.startsWith('✦') || level.answer.endsWith('✦') || level.answer.includes('✦✦')) {
    problems.push('разделитель ✦ на краю ответа или два подряд');
  }
  const letters = answerLetters(level);
  if (letters.length < 8) problems.push('строка короче 8 букв — это уровень для «Загадки», не «Строки»');
  if (letters.length > 24) problems.push('строка длиннее 24 букв — нечитаемо');
  if (new Set(letters).size < 4) problems.push('слишком мало различных букв');
  if (!Array.isArray(level.riddle) || level.riddle.length === 0
    || level.riddle.some((l) => typeof l !== 'string' || !l.trim())) {
    problems.push('стих должен быть непустым массивом строк');
  }
  if ((level.riddle || []).some((l) => /[a-z]/i.test(l))) {
    problems.push('строки стиха латиницей');
  }
  if (level.author && !/^[А-ЯЁ]/.test(level.author)) {
    problems.push('атрибуция автора не по-русски');
  }
  return { ok: problems.length === 0, problems };
}
