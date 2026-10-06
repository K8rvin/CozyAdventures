// Экран головоломки «Книжный чердак»: восстановление фразы.
import {
  createBookPuzzle, swapLetters, undoBook, resetBook,
  isBookSolved, bookProgress, bookHint, pathCells,
} from '../core/bookPuzzle.js';
import { completePuzzle, nextPuzzle } from '../core/state.js';
import { header, showOverlay } from './common.js';

const CELL = 60;

export function renderBookPuzzle(container, ctx, level) {
  const puzzle = createBookPuzzle(level);
  const path = pathCells(level);
  let selected = null; // индекс буквы в path
  let hintsUsed = 0;
  let hintPair = null; // { i, j }
  let finished = false;

  container.appendChild(header(ctx, level.name, `Сложность: ${'★'.repeat(level.difficulty)}`, 'puzzles'));

  const wrap = document.createElement('div');
  wrap.className = 'puzzle-wrap';

  const canvasBox = document.createElement('div');
  canvasBox.className = 'puzzle-canvas-box';
  const canvas = document.createElement('canvas');
  canvas.className = 'game';
  const [gw, gh] = level.grid;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = gw * CELL * dpr;
  canvas.height = gh * CELL * dpr;
  canvas.style.width = `${gw * CELL}px`;
  canvas.style.height = `${gh * CELL}px`;
  canvas.style.maxWidth = '100%';
  canvasBox.appendChild(canvas);
  wrap.appendChild(canvasBox);

  const side = document.createElement('div');
  side.className = 'puzzle-side';
  const intro = document.createElement('div');
  intro.className = 'intro-text';
  intro.textContent = level.intro;
  side.appendChild(intro);

  const statusEl = document.createElement('div');
  statusEl.className = 'puzzle-status';
  side.appendChild(statusEl);

  const hintText = document.createElement('div');
  hintText.className = 'panel';
  hintText.style.padding = '10px 14px';
  hintText.innerHTML = `<div class="desc" style="line-height:1.8">
    Тапни букву, затем другую — они поменяются местами.<br>
    ✦ — неподвижный разделитель.<br>
    Собери фразу, читаемую змейкой сверху вниз.</div>`;
  side.appendChild(hintText);

  const controls = document.createElement('div');
  controls.className = 'puzzle-controls';
  controls.style.marginTop = '10px';
  const btnUndo = mkBtn('↩️ Отмена (Z)', doUndo);
  const btnHint = mkBtn('💡 Подсказка (H)', doHint);
  const btnReset = mkBtn('🔄 Сброс (R)', doReset);
  controls.append(btnUndo, btnHint, btnReset);
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
    if (undoBook(puzzle)) { selected = null; hintPair = null; ctx.sfx?.('tap'); draw(); }
  }
  function doReset() {
    if (finished) return;
    resetBook(puzzle);
    selected = null;
    hintPair = null;
    ctx.sfx?.('tap');
    draw();
  }
  function doHint() {
    if (finished) return;
    const h = bookHint(puzzle);
    ctx.sfx?.('hint');
    if (h.type === 'swap') {
      hintsUsed += 1;
      hintPair = { i: h.i, j: h.j };
      ctx.toast(`Кот-хранитель водит лапой: «${puzzle.letters[h.i]}» ⇄ «${puzzle.letters[h.j]}»`);
      draw();
    } else {
      ctx.toast('Фраза уже цела!');
    }
  }

  function onTap(ev) {
    if (finished) return;
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / dpr / rect.width;
    const x = Math.floor((ev.clientX - rect.left) * scale / CELL);
    const y = Math.floor((ev.clientY - rect.top) * scale / CELL);
    const idx = path.findIndex(([px, py]) => px === x && py === y);
    if (idx < 0) return;
    if (puzzle.letters[idx] === '✦') { ctx.toast('Разделитель не двигается.'); return; }
    if (selected === null) {
      selected = idx;
      ctx.sfx?.('tap');
    } else if (selected === idx) {
      selected = null;
      ctx.sfx?.('tap');
    } else {
      if (swapLetters(puzzle, selected, idx)) {
        selected = null;
        hintPair = null;
        ctx.sfx?.('rotate');
        draw();
        if (isBookSolved(puzzle)) finish();
        return;
      }
      selected = idx;
    }
    draw();
  }
  canvas.addEventListener('pointerdown', onTap);

  function onKey(ev) {
    if (ev.key === 'z' || ev.key === 'Z' || (ev.ctrlKey && ev.key === 'z')) { ev.preventDefault(); doUndo(); }
    if (ev.key === 'h' || ev.key === 'H' || ev.key === 'р' || ev.key === 'Р') doHint();
    if (ev.key === 'r' || ev.key === 'R' || ev.key === 'к' || ev.key === 'К') doReset();
    if (ev.key === 'Escape') ctx.go('puzzles');
  }
  window.addEventListener('keydown', onKey);

  function finish() {
    finished = true;
    const rewards = completePuzzle(ctx.state, level.id, { moves: puzzle.moves, hintsUsed });
    ctx.save();
    ctx.sfx?.('success');
    draw();
    setTimeout(() => {
      const next = nextPuzzle(level.id);
      showOverlay(ctx, {
        title: '📖 Фраза восстановлена!',
        subtitle: `«${level.name}» — ${level.phrase.replaceAll('✦', ' · ')}`,
        rewards,
        buttons: [
          ...(next ? [{ label: `Следующая → ${next.name}`, primary: true, onClick: () => ctx.go('puzzle', { id: next.id }) }] : []),
          { label: 'К загадкам', primary: !next, onClick: () => ctx.go('puzzles') },
          { label: 'Ещё раз', onClick: () => ctx.go('puzzle', { id: level.id }) },
          { label: 'В лавку', onClick: () => ctx.go('hub') },
        ],
      });
    }, 450);
  }

  function draw() {
    const g = canvas.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, gw * CELL, gh * CELL);

    // Страница
    g.fillStyle = '#4d4231';
    g.fillRect(0, 0, gw * CELL, gh * CELL);

    const correct = new Set();
    for (let i = 0; i < level.phrase.length; i++) {
      if (puzzle.letters[i] === level.phrase[i]) correct.add(i);
    }

    // Кляксы
    for (const [bx, by] of level.blots || []) {
      g.font = `${CELL * 0.6}px "Segoe UI Emoji", sans-serif`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText('🫟', bx * CELL + CELL / 2, by * CELL + CELL / 2);
    }

    // Буквы по пути
    path.forEach(([x, y], i) => {
      const px = x * CELL;
      const py = y * CELL;
      const letter = puzzle.letters[i];
      const isFixed = letter === '✦';
      // Плитка
      g.fillStyle = isFixed ? '#3a3226' : correct.has(i) ? '#5d6b3f' : '#6b5a3d';
      g.fillRect(px + 3, py + 3, CELL - 6, CELL - 6);
      if (selected === i || (hintPair && (hintPair.i === i || hintPair.j === i))) {
        g.strokeStyle = '#ffca7a';
        g.lineWidth = 3;
        g.strokeRect(px + 3, py + 3, CELL - 6, CELL - 6);
      }
      g.font = `${isFixed ? CELL * 0.4 : CELL * 0.55}px "Segoe UI Emoji", serif`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillStyle = isFixed ? '#ffca7a' : '#f3e6cf';
      g.fillText(letter, px + CELL / 2, py + CELL / 2 + 2);
    });

    // Статус
    const pr = bookProgress(puzzle);
    statusEl.innerHTML =
      `📜 Буквы на местах: <b>${pr.ok}/${pr.total}</b>` +
      `<div class="muted" style="font-size:13px">Ходы: ${puzzle.moves} · Подсказки: ${hintsUsed}</div>`;
  }

  draw();

  return () => {
    window.removeEventListener('keydown', onKey);
    canvas.removeEventListener('pointerdown', onTap);
  };
}
