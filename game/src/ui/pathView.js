// Экран головоломки «Тропинка курьера».
import {
  createPathPuzzle, rotateTile, undoPath, resetPath,
  isPathSolved, tracePath, pathHint, connections, SIDES,
} from '../core/pathPuzzle.js';
import { completePuzzle, nextPuzzle } from '../core/state.js';
import { header, showOverlay , puzzleSkipButton } from './common.js';

const CELL = 72;

export function renderPathPuzzle(container, ctx, level) {
  const puzzle = createPathPuzzle(level);
  let hintsUsed = 0;
  let hintTile = null;
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

  const legend = document.createElement('div');
  legend.className = 'panel mt';
  legend.innerHTML = `<div class="desc" style="line-height:1.9">
    🏠 домик курьера → 🌳 старый дуб<br>
    Тап по плитке — повернуть её<br>
    🐗 спящий зверь — туда нельзя<br>
    Тёплый след — тропинка, что уже ведёт от домика</div>`;
  side.appendChild(legend);

  const controls = document.createElement('div');
  controls.className = 'puzzle-controls';
  const btnUndo = mkBtn('↩️ Отмена (Z)', doUndo);
  const btnHint = mkBtn('💡 Подсказка (H)', doHint);
  const btnReset = mkBtn('🔄 Сброс (R)', doReset);
  controls.append(btnUndo, btnHint, btnReset);
  controls.appendChild(puzzleSkipButton(ctx, level, () => ctx.go('puzzles')));
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
    if (undoPath(puzzle)) { hintTile = null; ctx.sfx?.('tap'); draw(); }
  }
  function doReset() {
    if (finished) return;
    resetPath(puzzle);
    hintTile = null;
    ctx.sfx?.('tap');
    draw();
  }
  function doHint() {
    if (finished) return;
    const h = pathHint(puzzle);
    ctx.sfx?.('hint');
    if (h.type === 'rotate') {
      hintsUsed += 1;
      hintTile = h.tileIndex;
      ctx.toast('Кот-хранитель смотрит на одну из плиток…');
      draw();
    } else if (h.type === 'already') {
      ctx.toast('Тропинка уже готова!');
    } else {
      ctx.toast('Хм, тут не пройти. Скажи хозяину лавки!');
    }
  }

  function onTap(ev) {
    if (finished) return;
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / dpr / rect.width;
    const x = Math.floor((ev.clientX - rect.left) * scale / CELL);
    const y = Math.floor((ev.clientY - rect.top) * scale / CELL);
    const idx = level.tiles.findIndex((t) => t.pos[0] === x && t.pos[1] === y);
    if (idx >= 0 && rotateTile(puzzle, idx)) {
      hintTile = null;
      ctx.sfx?.('rotate');
      draw();
      if (isPathSolved(puzzle)) finish();
    }
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
        title: '📦 Посылка доставлена!',
        subtitle: `«${level.name}» — курьер доволен`,
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

    const { reached } = tracePath(puzzle);

    // Пол — лесная земля
    for (let y = 0; y < gh; y++) {
      for (let x = 0; x < gw; x++) {
        g.fillStyle = (x + y) % 2 === 0 ? '#45523a' : '#4d5c40';
        g.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
    }

    // Плитки
    level.tiles.forEach((t, i) => {
      const cx = t.pos[0] * CELL + CELL / 2;
      const cy = t.pos[1] * CELL + CELL / 2;
      const onPath = reached.has(i);

      // Подложка плитки
      if (t.type !== 'beast') {
        g.fillStyle = onPath ? '#8a6f45' : '#6b5a40';
        roundRect(g, t.pos[0] * CELL + 4, t.pos[1] * CELL + 4, CELL - 8, CELL - 8, 10);
        g.fill();
      }

      // Подсказка
      if (hintTile === i) {
        g.fillStyle = 'rgba(255, 202, 122, 0.35)';
        g.beginPath();
        g.arc(cx, cy, CELL * 0.46, 0, Math.PI * 2);
        g.fill();
      }

      // Пути (соединения)
      const rot = puzzle.rot[i] ?? t.rot ?? 0;
      const conns = connections(t.type, rot);
      if (conns.length > 0) {
        g.strokeStyle = onPath ? '#ffd98a' : '#4a3b28';
        g.lineCap = 'round';
        g.lineWidth = onPath ? 10 : 12;
        for (const side of conns) {
          const [dx, dy] = SIDES[side];
          g.beginPath();
          g.moveTo(cx, cy);
          g.lineTo(cx + dx * (CELL / 2 - 4), cy + dy * (CELL / 2 - 4));
          g.stroke();
        }
        // Центр
        g.fillStyle = onPath ? '#ffd98a' : '#4a3b28';
        g.beginPath();
        g.arc(cx, cy, 7, 0, Math.PI * 2);
        g.fill();
      }

      // Иконки
      const emoji = (e, size = CELL * 0.5) => {
        g.font = `${size}px "Segoe UI Emoji", sans-serif`;
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillText(e, cx, cy);
      };
      if (t.type === 'start') emoji('🏠');
      else if (t.type === 'end') emoji('🌳');
      else if (t.type === 'beast') emoji('🐗', CELL * 0.45);
    });

    // Статус
    const solvedNow = isPathSolved(puzzle);
    statusEl.innerHTML =
      (solvedNow
        ? '✅ <b>Тропинка готова!</b>'
        : `🥾 След от домика: <b>${reached.size}</b> плиток`) +
      `<div class="muted" style="font-size:13px">Ходы: ${puzzle.moves} · Подсказки: ${hintsUsed}</div>`;
  }

  function roundRect(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }

  draw();

  return () => {
    window.removeEventListener('keydown', onKey);
    canvas.removeEventListener('pointerdown', onTap);
  };
}
