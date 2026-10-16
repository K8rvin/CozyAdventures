// Экран головоломки «Строка»: стих без последней строки, скрытая строка,
// алфавит; промахи топят свечу (арт assets/hang/hang_candle_*.png, фолбэк — CSS).
import {
  createHangmanPuzzle, guessLetter, undoHangman, resetHangman,
  isHangmanSolved, applyHangmanHint, rewardFactor,
  CANDLE_STEPS,
} from '../core/hangmanPuzzle.js';
import { completePuzzle, nextPuzzle } from '../core/state.js';
import { header, showOverlay, puzzleSkipButton, backToPuzzleType } from './common.js';

// Стадия арта свечи по остатку воска (0 промахов — полная, догорела — out)
function candleStage(candleLeft) {
  const misses = CANDLE_STEPS - candleLeft;
  if (misses <= 1) return 'full';
  if (misses <= 3) return 'half';
  if (misses <= 5) return 'stub';
  return 'out';
}

export function renderHangmanPuzzle(container, ctx, level) {
  const puzzle = createHangmanPuzzle(level);
  let hintsUsed = 0;
  let finished = false;
  let burningOut = false; // пауза на догоревшей свече: показываем огарок, ввод заперт

  container.appendChild(header(ctx, level.name, `Сложность: ${'★'.repeat(level.difficulty)}`, ['puzzles', { mech: 'hang' }]));

  const wrap = document.createElement('div');
  wrap.className = 'puzzle-wrap hang-wrap';

  const pageBox = document.createElement('div');
  pageBox.className = 'puzzle-canvas-box';
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
    draw();
  });
  candleImg.src = 'assets/hang/hang_candle_full.png';
  candleBox.appendChild(candleImg);
  const candleLabel = document.createElement('div');
  candleLabel.className = 'muted';
  candleLabel.style.fontSize = '12px';
  candleBox.appendChild(candleLabel);
  side.appendChild(candleBox);

  const intro = document.createElement('div');
  intro.className = 'intro-text';
  intro.textContent = level.intro;
  side.appendChild(intro);

  const statusEl = document.createElement('div');
  statusEl.className = 'puzzle-status';
  side.appendChild(statusEl);

  const legend = document.createElement('div');
  legend.className = 'panel';
  legend.style.padding = '10px 14px';
  legend.innerHTML = `<div class="desc" style="line-height:1.8">
    Тапай буквы (можно и с клавиатуры). Верная откроется <b>во всех</b> местах строки.<br>
    Промах блокирует букву и топит свечу. Свеча догорела — страница погасла:
    −10% монет награды, но открытые буквы остаются.</div>`;
  side.appendChild(legend);

  const controls = document.createElement('div');
  controls.className = 'puzzle-controls';
  controls.style.marginTop = '10px';
  const btnUndo = mkBtn('↩️ Отмена (Ctrl+Z)', doUndo);
  const btnHint = mkBtn('💡 Подсказка', doHint);
  const btnReset = mkBtn('🔄 Сброс', doReset);
  controls.append(btnUndo, btnHint, btnReset);
  controls.appendChild(puzzleSkipButton(ctx, level, () => backToPuzzleType(ctx, level)));
  side.appendChild(controls);

  wrap.appendChild(side);
  container.appendChild(wrap);

  function mkBtn(label, fn) {
    const b = document.createElement('button');
    b.innerHTML = label;
    b.addEventListener('click', fn);
    return b;
  }

  function doUndo() {
    if (finished) return;
    if (undoHangman(puzzle)) { ctx.sfx?.('tap'); draw(); }
  }
  function doReset() {
    if (finished) return;
    resetHangman(puzzle);
    ctx.sfx?.('tap');
    draw();
  }
  function doHint() {
    if (finished) return;
    const h = applyHangmanHint(puzzle);
    ctx.sfx?.('hint');
    if (h) {
      hintsUsed += 1;
      ctx.toast(`Кот-хранитель дышит на страницу: буква «${h.letter}» открывается`);
      draw();
      if (isHangmanSolved(puzzle)) finish();
    } else {
      ctx.toast('Строка уже открыта!');
    }
  }

  function tapKey(letter) {
    if (finished || burningOut) return;
    const r = guessLetter(puzzle, letter);
    if (!r.ok) return;
    if (r.hit) {
      ctx.sfx?.('rotate');
    } else if (r.burned) {
      ctx.sfx?.('fail');
      // Пауза на огарке: видим догоревшую свечу, ввод заперт, затем новая свеча
      burningOut = true;
      ctx.toast(`🕯️ Свеча догорела — страница погасла! Новая свеча, но награда тает (−${Math.round((1 - rewardFactor(puzzle)) * 100)}% монет).`);
      page.classList.add('shake');
      draw();
      setTimeout(() => {
        page.classList.remove('shake');
        burningOut = false;
        draw();
      }, 1400);
      return;
    } else {
      ctx.sfx?.('fail');
      ctx.toast(`Буквы «${letter}» нет в строке. Свеча короче…`);
    }
    draw();
    if (r.hit && isHangmanSolved(puzzle)) finish();
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
    const factor = rewardFactor(puzzle);
    const rewards = completePuzzle(ctx.state, level.id, {
      moves: puzzle.moves, hintsUsed, coinFactor: factor,
    });
    ctx.save();
    ctx.sfx?.('success');
    draw();
    setTimeout(() => {
      const next = nextPuzzle(level.id);
      showOverlay(ctx, {
        title: '📖 Строка восстановлена!',
        subtitle: `«${level.name}» — ${level.answer.replaceAll('✦', ' · ')}`
          + (level.author ? ` <span class="muted">(${level.author})</span>` : '')
          + (factor < 1 ? `<br>Погасшие свечи съели часть награды (−${Math.round((1 - factor) * 100)}% монет).` : ''),
        rewards,
        buttons: [
          ...(next ? [{ label: `Следующая → ${next.name}`, primary: true, onClick: () => ctx.go('puzzle', { id: next.id }) }] : []),
          { label: 'К загадкам', primary: !next, onClick: () => backToPuzzleType(ctx, level) },
          { label: 'Ещё раз', onClick: () => ctx.go('puzzle', { id: level.id }) },
          { label: 'В лавку', onClick: () => ctx.go('hub') },
        ],
      });
    }, 450);
  }

  function draw() {
    // --- Страница: стих + скрытая строка ---
    page.innerHTML = '';

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
    page.appendChild(verse);

    // Скрытая строка: окошки с открытыми буквами или подчёркиваниями
    const row = document.createElement('div');
    row.className = 'riddle-slots';
    for (const ch of level.answer) {
      if (ch === '✦') {
        const sep = document.createElement('div');
        sep.className = 'riddle-sep';
        sep.textContent = '·';
        row.appendChild(sep);
        continue;
      }
      const cell = document.createElement('div');
      const open = puzzle.revealed.has(ch === 'Ё' ? 'Е' : ch); // Ё открывается клавишей Е
      cell.className = 'riddle-slot hang-slot' + (open ? ' filled' : '');
      cell.textContent = open ? ch : '';
      row.appendChild(cell);
    }
    page.appendChild(row);

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
        if (!isOpen && !isWrong) b.addEventListener('click', () => tapKey(letter));
        else b.disabled = true;
        rowEl.appendChild(b);
      }
      kb.appendChild(rowEl);
    });
    page.appendChild(kb);

    // --- Свеча (огарок виден на паузе догорания) ---
    const stage = burningOut ? 'out' : candleStage(puzzle.candleLeft);
    if (candleImg.parentNode) {
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

    // --- Статус ---
    const factor = rewardFactor(puzzle);
    statusEl.innerHTML =
      `🕯️ Воска: <b>${puzzle.candleLeft}/${CANDLE_STEPS}</b>`
      + (puzzle.spoiled > 0
        ? ` · погасло страниц: <b>${puzzle.spoiled}</b> (−${Math.round((1 - factor) * 100)}% монет)`
        : '')
      + `<div class="muted" style="font-size:13px">Ходы: ${puzzle.moves} · Подсказки: ${hintsUsed}</div>`;
  }

  draw();

  return () => {
    window.removeEventListener('keydown', onKey);
  };
}
