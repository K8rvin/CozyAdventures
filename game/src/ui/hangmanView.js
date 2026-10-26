// Экран головоломки «Строка»: стих без последней строки, скрытая строка,
// алфавит; промахи топят свечу (арт assets/hang/hang_candle_*.png, фолбэк — CSS).
// Каждый ход сначала получает короткую паузу, затем чернильный вердикт.
import {
  createHangmanPuzzle, guessLetter, undoHangman, resetHangman,
  isHangmanSolved, applyHangmanHint, rewardFactor, canonLetter,
  CANDLE_STEPS, MISTAKE_STEP, SPOIL_STEP, MIN_FACTOR, PERFECT_FACTOR,
} from '../core/hangmanPuzzle.js';
import { completePuzzle, nextPuzzle } from '../core/state.js';
import { header, showOverlay, puzzleSkipButton, backToPuzzleType } from './common.js';

const VERDICT_DELAY_MS = 260;
const BURNOUT_DELAY_MS = 1400;
const VICTORY_DELAY_MS = 1050;

const KEEPER_REACTIONS = {
  hit: [
    'Мур… есть такая буква. Смотри, чернила разбегаются по всем её местам.',
    'Хранитель кивает: верно. Строка стала чуть теплее.',
    'Кот проводит лапой по странице: эта буква здесь действительно живёт.',
  ],
  miss: [
    'Такой буквы строка не знает. Свеча вздрогнула, а монет стало на пять процентов меньше.',
    'Мур… мимо. Клякса останется, зато следующий выбор будет точнее.',
    'Хранитель бережно закрывает строку лапой: этой буквы здесь нет.',
  ],
  burn: [
    'Свеча догорела, и страница погасла. Зажжём новую, но утраченной награды не вернуть.',
    'Огонёк исчез вместе с частью награды. Хранитель уже достал новую свечу.',
  ],
};
const HINT_REACTIONS = [
  (letter) => `Кот дышит на страницу, и проступает буква «${letter}». Подсказка ошибкой не считается.`,
  (letter) => `Хранитель касается чернил лапой: здесь пригодится буква «${letter}».`,
  (letter) => `Мур… страница сама шепнула букву «${letter}». Слушаем дальше.`,
];

// Стадия арта свечи по остатку воска (0 промахов — полная, догорела — out)
function candleStage(candleLeft) {
  const misses = CANDLE_STEPS - candleLeft;
  if (misses <= 1) return 'full';
  if (misses <= 3) return 'half';
  if (misses <= 5) return 'stub';
  return 'out';
}

function formatFactor(value) {
  return String(Math.round(value * 100) / 100).replace('.', ',');
}

export function renderHangmanPuzzle(container, ctx, level) {
  const puzzle = createHangmanPuzzle(level);
  let hintsUsed = 0;
  let finished = false;
  let checking = false;
  let burningOut = false; // пауза на догоревшей свече: показываем огарок, ввод заперт
  let disposed = false;
  let freshLetter = null;
  let reactionSerial = 0;
  let keyEls = new Map();
  const reactionCounts = { hit: 0, miss: 0, burn: 0 };
  const timers = [];

  container.appendChild(header(ctx, level.name, `Сложность: ${'★'.repeat(level.difficulty)}`, ['puzzles', { mech: 'hang' }]));

  const wrap = document.createElement('div');
  wrap.className = 'puzzle-wrap hang-wrap';

  const pageBox = document.createElement('div');
  pageBox.className = 'puzzle-canvas-box riddle-stage';
  const page = document.createElement('div');
  page.className = 'riddle-page';
  pageBox.appendChild(page);
  wrap.appendChild(pageBox);

  const side = document.createElement('div');
  side.className = 'puzzle-side';

  // Свеча крупно и первой в боковой панели: арт по стадиям, фолбэк — воск-точки
  const candleBox = document.createElement('div');
  candleBox.className = 'hang-candle-box';
  const candleImg = document.createElement('img');
  candleImg.className = 'hang-candle-art';
  candleImg.alt = 'Свеча';
  let candleFallback = null;
  candleImg.addEventListener('error', () => {
    candleImg.remove();
    candleFallback = document.createElement('div');
    candleFallback.className = 'hang-candle-css';
    candleBox.appendChild(candleFallback);
    if (!disposed) draw();
  });
  candleImg.src = 'assets/hang/hang_candle_full.png';
  candleBox.appendChild(candleImg);
  const candleLabel = document.createElement('div');
  candleLabel.className = 'muted';
  candleLabel.style.fontSize = '12px';
  candleBox.appendChild(candleLabel);
  side.appendChild(candleBox);

  // Кот комментирует ходы на месте вместо технических всплывающих сообщений.
  const keeper = document.createElement('div');
  keeper.className = 'riddle-keeper hang-keeper';
  const portrait = document.createElement('div');
  portrait.className = 'riddle-keeper-portrait';
  const keeperImg = document.createElement('img');
  keeperImg.className = 'riddle-keeper-art';
  keeperImg.alt = 'Кот-хранитель';
  keeperImg.src = 'assets/fate/guest_cat_web.jpg';
  keeperImg.addEventListener('error', () => {
    keeperImg.remove();
    const fallback = document.createElement('span');
    fallback.className = 'riddle-keeper-fallback';
    fallback.textContent = '🐈';
    portrait.appendChild(fallback);
  });
  portrait.appendChild(keeperImg);
  const keeperText = document.createElement('div');
  keeperText.className = 'intro-text riddle-keeper-text';
  keeperText.textContent = level.intro;
  keeperText.setAttribute('aria-live', 'polite');
  keeper.append(portrait, keeperText);
  side.appendChild(keeper);

  const statusEl = document.createElement('div');
  statusEl.className = 'puzzle-status';
  side.appendChild(statusEl);

  const legend = document.createElement('details');
  legend.className = 'panel riddle-rules hang-rules';
  legend.open = level.id === 'bk_06' && !ctx.state.puzzlesDone?.[level.id];
  legend.innerHTML = `<summary>Как играть</summary><div class="desc" style="line-height:1.8">
    Тапай буквы (можно и с клавиатуры). Верная откроется <b>во всех</b> местах строки.<br>
    Каждый промах: <b>−${Math.round(MISTAKE_STEP * 100)}% монет</b>; догоревшая свеча — ещё <b>−${Math.round(SPOIL_STEP * 100)}%</b>.<br>
    Награда не опустится ниже ${Math.round(MIN_FACTOR * 100)}%. Решение без ошибок — <b>×${formatFactor(PERFECT_FACTOR)} монет</b>.<br>
    Отмена и сброс возвращают буквы и воск, но не стирают цену уже сделанных ошибок.</div>`;
  side.appendChild(legend);

  const controls = document.createElement('div');
  controls.className = 'puzzle-controls';
  controls.style.marginTop = '10px';
  const btnUndo = mkBtn('↩️ Отмена (Ctrl+Z)', doUndo);
  const btnHint = mkBtn('💡 Подсказка', doHint);
  const btnReset = mkBtn('🔄 Сброс', doReset);
  const btnSkip = puzzleSkipButton(ctx, level, () => backToPuzzleType(ctx, level));
  controls.append(btnUndo, btnHint, btnReset, btnSkip);
  side.appendChild(controls);

  wrap.appendChild(side);
  container.appendChild(wrap);

  function mkBtn(label, fn) {
    const b = document.createElement('button');
    b.innerHTML = label;
    b.addEventListener('click', fn);
    return b;
  }

  function later(fn, ms) {
    const timer = setTimeout(() => { if (!disposed) fn(); }, ms);
    timers.push(timer);
    return timer;
  }

  function setChecking(value) {
    checking = value;
    page.classList.toggle('checking', checking);
    for (const b of [btnUndo, btnHint, btnReset, btnSkip]) {
      b.disabled = checking || burningOut || finished;
    }
  }

  function react(text) {
    keeperText.textContent = text;
    const serial = ++reactionSerial;
    keeper.classList.add('is-speaking');
    later(() => {
      if (serial === reactionSerial) keeper.classList.remove('is-speaking');
    }, 350);
  }

  function reactToResult(kind) {
    const options = KEEPER_REACTIONS[kind];
    const index = reactionCounts[kind]++;
    react(options[index % options.length]);
  }

  function showInkBlot() {
    const blot = document.createElement('div');
    blot.className = 'riddle-ink-blot hang-ink-blot';
    page.appendChild(blot);
    later(() => blot.remove(), 850);
  }

  function doUndo() {
    if (finished || checking || burningOut) return;
    if (undoHangman(puzzle)) {
      freshLetter = null;
      ctx.sfx?.('riddleErase');
      draw();
    }
  }

  function doReset() {
    if (finished || checking || burningOut) return;
    resetHangman(puzzle);
    freshLetter = null;
    ctx.sfx?.('riddleErase');
    draw();
  }

  function doHint() {
    if (finished || checking || burningOut) return;
    const h = applyHangmanHint(puzzle);
    if (h) {
      hintsUsed += 1;
      freshLetter = h.letter;
      ctx.sfx?.('hint');
      ctx.sfx?.('riddleWrite');
      react(HINT_REACTIONS[(hintsUsed - 1) % HINT_REACTIONS.length](h.letter));
      draw();
      const key = keyEls.get(h.letter);
      key?.classList.add('is-pressed');
      later(() => key?.classList.remove('is-pressed'), 130);
      if (isHangmanSolved(puzzle)) finish();
    } else {
      react('Вся строка уже открыта. Хранителю осталось только мурлыкнуть.');
    }
  }

  // Состояние меняется только после короткой паузы: сначала тактильная клавиша
  // и дрожание света, затем проявленные буквы, клякса или догоревшая свеча.
  function tapKey(letter) {
    if (finished || checking || burningOut) return;
    const canon = canonLetter(letter);
    if (puzzle.revealed.has(canon) || puzzle.wrong.has(canon)) return;
    setChecking(true);
    page.classList.add('hang-awaiting');
    candleBox.classList.add('hang-candle-check');
    keyEls.get(canon)?.classList.add('is-pressed');
    ctx.sfx?.('riddleKey');
    ctx.sfx?.('riddleWrite');

    later(() => {
      page.classList.remove('hang-awaiting');
      candleBox.classList.remove('hang-candle-check');
      const r = guessLetter(puzzle, canon);
      freshLetter = r.ok && r.hit ? canon : null;
      if (!r.ok) {
        setChecking(false);
        draw();
        return;
      }

      if (r.hit) {
        ctx.sfx?.('riddleExact');
        if (isHangmanSolved(puzzle)) { finish(); return; }
        draw();
        reactToResult('hit');
        setChecking(false);
        return;
      }

      burningOut = r.burned;
      ctx.sfx?.(r.burned ? 'fail' : 'riddleAbsent');
      draw();
      showInkBlot();
      reactToResult(r.burned ? 'burn' : 'miss');
      if (r.burned) {
        page.classList.add('shake');
        later(() => {
          page.classList.remove('shake');
          burningOut = false;
          setChecking(false);
          draw();
        }, BURNOUT_DELAY_MS);
        return;
      }
      setChecking(false);
    }, VERDICT_DELAY_MS);
  }

  // Физическая клавиатура: кириллические буквы — ходы; Ctrl+Z — отмена, Esc — назад
  function onKey(ev) {
    if (ev.key === 'Escape') { backToPuzzleType(ctx, level); return; }
    if ((ev.ctrlKey || ev.metaKey) && ['z', 'Z', 'я', 'Я'].includes(ev.key)) {
      ev.preventDefault();
      doUndo();
      return;
    }
    if (ev.ctrlKey || ev.altKey || ev.metaKey) return;
    const ch = (ev.key || '').toUpperCase();
    if (/^[А-ЯЁ]$/.test(ch)) tapKey(ch);
  }
  window.addEventListener('keydown', onKey);

  function finish() {
    finished = true;
    burningOut = false;
    setChecking(false);
    const factor = rewardFactor(puzzle);
    const perfect = puzzle.mistakes === 0 && puzzle.spoiled === 0;
    const rewards = completePuzzle(ctx.state, level.id, {
      moves: puzzle.moves, hintsUsed, coinFactor: factor,
      achievement: { mistakes: puzzle.mistakes, spoiled: puzzle.spoiled },
    });
    ctx.save();
    page.classList.add('riddle-solved');
    draw();
    react(perfect
      ? 'Ни одной кляксы! Мур-р… За такую чистую строку монет положено в полтора раза больше.'
      : 'Последняя строка встала на место. Страница снова тёплая, и Хранитель доволен.');
    ctx.sfx?.('page');
    ctx.sfx?.('success');
    later(() => ctx.sfx?.('purr'), 250);
    later(() => {
      const next = nextPuzzle(level.id);
      showOverlay(ctx, {
        title: perfect ? '✨ Строка восстановлена без клякс!' : '📖 Строка восстановлена!',
        subtitle: `«${level.name}» — ${level.answer.replaceAll('✦', ' · ')}`
          + (level.author ? ` <span class="muted">(${level.author})</span>` : '')
          + (perfect
            ? `<br>Без ошибок — монеты <b>×${formatFactor(PERFECT_FACTOR)}</b>!`
            : factor < 1
              ? `<br>Ошибки и погасшие страницы съели часть награды (−${Math.round((1 - factor) * 100)}% монет).`
              : ''),
        rewards,
        buttons: [
          ...(next ? [{ label: `Следующая → ${next.name}`, primary: true, onClick: () => ctx.go('puzzle', { id: next.id }) }] : []),
          { label: 'К загадкам', primary: !next, onClick: () => backToPuzzleType(ctx, level) },
          { label: 'Ещё раз', onClick: () => ctx.go('puzzle', { id: level.id }) },
          { label: 'В лавку', onClick: () => ctx.go('hub') },
        ],
      });
    }, VICTORY_DELAY_MS);
  }

  function draw() {
    // --- Пергамент: стих + скрытая строка ---
    page.innerHTML = '';
    keyEls = new Map();

    const sheet = document.createElement('div');
    sheet.className = 'riddle-sheet';
    page.appendChild(sheet);

    const verse = document.createElement('div');
    verse.className = 'riddle-text';
    for (const line of level.riddle) {
      const p = document.createElement('div');
      p.textContent = line;
      verse.appendChild(p);
    }
    if (level.author) {
      const a = document.createElement('div');
      a.className = 'riddle-author';
      a.textContent = `— ${level.author}`;
      verse.appendChild(a);
    }
    sheet.appendChild(verse);

    // Скрытая строка: новая буква проявляется чернилами во всех своих окошках.
    const row = document.createElement('div');
    row.className = 'riddle-slots riddle-current hang-answer';
    let slotIndex = 0;
    for (const ch of level.answer) {
      if (ch === '✦') {
        const sep = document.createElement('div');
        sep.className = 'riddle-sep';
        sep.textContent = '·';
        row.appendChild(sep);
        continue;
      }
      const cell = document.createElement('div');
      const canon = canonLetter(ch);
      const open = puzzle.revealed.has(canon);
      cell.className = 'riddle-slot hang-slot' + (open ? ' filled' : '');
      if (open && freshLetter === canon) cell.classList.add('ink-fresh');
      if (finished) cell.style.animationDelay = `${slotIndex * 55}ms`;
      if (open) {
        const glyph = document.createElement('span');
        glyph.className = 'riddle-glyph';
        glyph.textContent = ch;
        cell.appendChild(glyph);
      }
      row.appendChild(cell);
      slotIndex += 1;
    }
    sheet.appendChild(row);

    // Клавиатура ЙЦУКЕН (без Ё — она открывается клавишей Е):
    // арт клавиатуры подложен под кнопки; состояния — тонировкой буквы.
    const kb = document.createElement('div');
    kb.className = 'hang-kb has-art';
    const kbArt = document.createElement('img');
    kbArt.className = 'hang-kb-art';
    kbArt.alt = '';
    kbArt.addEventListener('error', () => { kbArt.remove(); kb.classList.remove('has-art'); });
    kbArt.src = 'assets/hang/hang_keyboard_scene.png';
    kb.appendChild(kbArt);
    const KB_ROWS = ['ЙЦУКЕНГШЩЗХЪ', 'ФЫВАПРОЛДЖЭ', 'ЯЧСМИТЬБЮ'];
    KB_ROWS.forEach((rowLetters, ri) => {
      const rowEl = document.createElement('div');
      rowEl.className = `hang-kb-row kb-row${ri + 1}`;
      for (const letter of rowLetters) {
        const b = document.createElement('button');
        const isOpen = puzzle.revealed.has(letter);
        const isWrong = puzzle.wrong.has(letter);
        b.className = 'cipher-letter hang-key'
          + (isOpen ? ' mark-exact' : '')
          + (isWrong ? ' mark-absent' : '');
        b.textContent = letter;
        keyEls.set(letter, b);
        if (!isOpen && !isWrong && !finished) b.addEventListener('click', () => tapKey(letter));
        else b.disabled = true;
        rowEl.appendChild(b);
      }
      kb.appendChild(rowEl);
    });
    page.appendChild(kb);

    // --- Свеча (огарок виден на паузе догорания) ---
    const stage = burningOut ? 'out' : candleStage(puzzle.candleLeft);
    if (candleImg.parentNode || candleImg.parent) {
      candleImg.src = `assets/hang/hang_candle_${stage}.png`;
      candleImg.classList.toggle('hang-fading', !burningOut && puzzle.candleLeft <= 2);
    }
    if (candleFallback) {
      candleFallback.textContent = burningOut
        ? '🕯️ догорела…'
        : `🕯️ ${'●'.repeat(puzzle.candleLeft)}${'○'.repeat(CANDLE_STEPS - puzzle.candleLeft)}`;
    }
    candleLabel.textContent = burningOut ? 'Страница погасла…'
      : puzzle.candleLeft >= 4 ? 'Свеча высокая'
        : puzzle.candleLeft >= 2 ? 'Свеча тает…'
          : 'Огонёк на последнем воске!';

    // --- Статус и текущая цена строки ---
    const factor = rewardFactor(puzzle);
    const perfect = puzzle.mistakes === 0 && puzzle.spoiled === 0;
    statusEl.innerHTML =
      `🕯️ Воска: <b>${puzzle.candleLeft}/${CANDLE_STEPS}</b> · Ошибок: <b>${puzzle.mistakes}</b>`
      + `<div>Монеты: <b>×${formatFactor(factor)}</b>${perfect ? ' · бонус без ошибок сохранён' : ''}</div>`
      + (puzzle.spoiled > 0 ? `<div class="warn">Погасло страниц: ${puzzle.spoiled}</div>` : '')
      + `<div class="muted" style="font-size:13px">Ходы: ${puzzle.moves} · Подсказки: ${hintsUsed}</div>`;
  }

  draw();

  return () => {
    disposed = true;
    timers.forEach(clearTimeout);
    window.removeEventListener('keydown', onKey);
  };
}
