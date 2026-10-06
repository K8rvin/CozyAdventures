// Движок головоломки «Книжный чердак» (мир 3). Чистая логика, без DOM.
// На странице-змейке разбросаны буквы светящейся фразы — их надо
// вернуть на свои места. Кляксы (blots) вырезают клетки из пути.
// Ход: поменять местами любые две буквы (тап по одной, тап по другой).
//
// Уровень:
//   grid: [w, h]
//   blots: [[x, y]]            — кляксы, клетки вне пути
//   phrase: 'СВЕТ✦ЛАМПЫ'       — целевая фраза ('✦' — неподвижный разделитель)
//   scrambled: 'ЛАМСВЕТЫПЫ✦'   — стартовая расстановка (та же мультимешок букв)

// Змейка по рядам сетки, пропуская кляксы. Возвращает [[x,y]...] по порядку чтения.
export function pathCells(level) {
  const [w, h] = level.grid;
  const blots = new Set((level.blots || []).map((b) => b.join(',')));
  const path = [];
  for (let y = 0; y < h; y++) {
    const xs = [];
    for (let x = 0; x < w; x++) if (!blots.has(`${x},${y}`)) xs.push(x);
    if (y % 2 === 1) xs.reverse();
    for (const x of xs) path.push([x, y]);
  }
  return path;
}

export function createBookPuzzle(level) {
  return {
    level,
    letters: level.scrambled.split(''),
    history: [],
    moves: 0,
  };
}

export function swapLetters(state, i, j) {
  const n = state.letters.length;
  if (i === j || i < 0 || j < 0 || i >= n || j >= n) return false;
  // Разделители неподвижны
  if (state.letters[i] === '✦' || state.letters[j] === '✦') return false;
  state.history.push({ i, j });
  [state.letters[i], state.letters[j]] = [state.letters[j], state.letters[i]];
  state.moves += 1;
  return true;
}

export function undoBook(state) {
  const last = state.history.pop();
  if (!last) return false;
  [state.letters[last.i], state.letters[last.j]] = [state.letters[last.j], state.letters[last.i]];
  state.moves += 1;
  return true;
}

export function resetBook(state) {
  state.letters = state.level.scrambled.split('');
  state.history = [];
  state.moves += 1;
}

export function isBookSolved(state) {
  return state.letters.join('') === state.level.phrase;
}

// Сколько букв уже на своих местах (для статуса в UI)
export function bookProgress(state) {
  const target = state.level.phrase;
  let ok = 0;
  for (let i = 0; i < target.length; i++) if (state.letters[i] === target[i]) ok++;
  return { ok, total: target.length };
}

// Проверка уровня для конвейера.
export function validateBookLevel(level) {
  const path = pathCells(level);
  const problems = [];
  if (path.length !== level.phrase.length) {
    problems.push(`Длина фразы (${level.phrase.length}) не равна длине пути (${path.length})`);
  }
  const sort = (s) => s.split('').sort().join('');
  if (sort(level.scrambled) !== sort(level.phrase)) {
    problems.push('scrambled не является перестановкой phrase');
  }
  const fixedInPhrase = level.phrase.split('').map((c, i) => (c === '✦' ? i : -1)).filter((i) => i >= 0);
  for (const i of fixedInPhrase) {
    if (level.scrambled[i] !== '✦') problems.push('разделитель ✦ в scrambled не на месте');
  }
  return { ok: problems.length === 0, problems };
}

// Адаптивная подсказка: первая неверная буква и с кем её поменять.
// { type:'swap', i, j } | { type:'already' }
export function bookHint(state) {
  const target = state.level.phrase;
  for (let i = 0; i < target.length; i++) {
    if (state.letters[i] === target[i]) continue;
    // Ищем букву, которая нужна на месте i, среди стоящих не на месте
    let j = state.letters.findIndex((c, k) => k > i && c === target[i] && state.letters[k] !== target[k]);
    if (j < 0) j = state.letters.indexOf(target[i], i + 1);
    return { type: 'swap', i, j };
  }
  return { type: 'already' };
}
