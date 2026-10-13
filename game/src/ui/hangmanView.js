// Экран головоломки «Строка»: стих без последней строки, скрытая строка,
// алфавит; промахи топят свечу (арт assets/hang_candle_*.png, фолбэк — CSS).
import {
  createHangmanPuzzle, guessLetter, undoHangman, resetHangman,
  isHangmanSolved, applyHangmanHint, rewardFactor,
  ALPHABET, CANDLE_STEPS,
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

  container.appendChild(header(ctx, level.name, `Сложность: ${'★'.repeat(level.difficulty)}`, ['puzzles', { mech: level.mechanic || 'mirror' }]));

  const wrap = document.createElement('div');
  wrap.className = 'puzzle-wrap';

  const pageBox = document.createElement('div');
  pageBox.className = 'puzzle-canvas-box';
  const page = document.createElement('div');
  page.className = 'riddle-page';
  pageBox.appendChild(page);
  wrap.appendChild(pageBox);

  const side = document.createElement('div');
  side.className = 'puzzle-side';
  const intro = document.createElement('div');
  intro.className = 'intro-text';
  intro.textContent = level.intro;
  side.appendChild(intro);

  // Свеча: арт по стадиям, фолбэк — воск-точки
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
  candleImg.src = 'assets/hang_candle_full.png';
  candleBox.appendChild(candleImg);
  const candleLabel = document.createElement('div');
  candleLabel.className = 'muted';
  candleLabel.style.fontSize = '12px';
  candleBox.appendChild(candleLabel);
  side.appendChild(candleBox);

  const statusEl = document.createElement('div');
  statusEl.className = 'puzzle-status';
  side.appendChild(statusEl);

  const legend = document.createElement('div');
  legend.className = 'panel';
  legend.style.padding = '10px 14px';
  legend.innerHTML = `<div class="desc" style="line-height:1.8">
    Тапай буквы алфавита. Верная буква откроется <b>во всех</b> местах строки.<br>
    Промах блокирует букву и топит свечу. Свеча догорела — страница погасла:
    −10% монет награды, но открытые буквы остаются.</div>`;
  side.appendChild(legend);

  const controls = document.createElement('div');
  controls.className = 'puzzle-controls';
  controls.style.marginTop = '10px';
  const btnUndo = mkBtn('↩️ Отмена (Z)', doUndo);
  const btnHint = mkBtn('💡 Подсказка (H)', doHint);
  const btnReset = mkBtn('🔄 Сброс (R)', doReset);
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
    if (finished) return;
    const r = guessLetter(puzzle, letter);
    if (!r.ok) return;
    if (r.hit) {
      ctx.sfx?.('rotate');
    } else if (r.burned) {
      ctx.sfx?.('fail');
      ctx.toast(`🕯️ Свеча догорела — страница погасла! Новая свеча, но награда тает (−${Math.round((1 - rewardFactor(puzzle)) * 100)}% монет).`);
      page.classList.add('shake');
      setTimeout(() => page.classList.remove('shake'), 500);
    } else {
      ctx.sfx?.('fail');
      ctx.toast(`Буквы «${letter}» нет в строке. Свеча короче…`);
    }
    draw();
    if (r.hit && isHangmanSolved(puzzle)) finish();
  }

  function onKey(ev) {
    if (ev.key === 'z' || ev.key === 'Z' || (ev.ctrlKey && ev.key === 'z')) { ev.preventDefault(); doUndo(); }
    if (ev.key === 'h' || ev.key === 'H' || ev.key === 'р' || ev.key === 'Р') doHint();
    if (ev.key === 'r' || ev.key === 'R' || ev.key === 'к' || ev.key === 'К') doReset();
    if (ev.key === 'Escape') backToPuzzleType(ctx, level);
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
      const open = puzzle.revealed.has(ch);
      cell.className = 'riddle-slot hang-slot' + (open ? ' filled' : '');
      cell.textContent = open ? ch : '';
      row.appendChild(cell);
    }
    page.appendChild(row);

    // Алфавит: открытые — зелёные, промахи — заблокированы
    const kb = document.createElement('div');
    kb.className = 'cipher-palette riddle-keyboard';
    for (const letter of ALPHABET) {
      const b = document.createElement('button');
      const isOpen = puzzle.revealed.has(letter);
      const isWrong = puzzle.wrong.has(letter);
      b.className = 'cipher-letter'
        + (isOpen ? ' mark-exact' : '')
        + (isWrong ? ' mark-absent' : '');
      b.textContent = letter;
      if (!isOpen && !isWrong) b.addEventListener('click', () => tapKey(letter));
      else b.disabled = true;
      kb.appendChild(b);
    }
    page.appendChild(kb);

    // --- Свеча ---
    if (candleImg.parentNode) {
      candleImg.src = `assets/hang_candle_${candleStage(puzzle.candleLeft)}.png`;
      candleImg.classList.toggle('hang-fading', puzzle.candleLeft <= 2);
    }
    if (candleFallback) {
      candleFallback.textContent = `🕯️ ${'●'.repeat(puzzle.candleLeft)}${'○'.repeat(CANDLE_STEPS - puzzle.candleLeft)}`;
    }
    candleLabel.textContent = puzzle.candleLeft >= 4 ? 'Свеча высокая'
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
