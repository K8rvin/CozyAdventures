// Экран головоломки «Свечи и духи».
import {
  createCandlePuzzle, placeCandle, undoCandle, resetCandles,
  isCandleSolved, candleStatus, candleHint,
} from '../core/candlePuzzle.js';
import { completePuzzle, nextPuzzle } from '../core/state.js';
import { header, showOverlay , puzzleSkipButton } from './common.js';

const CELL = 64;

export function renderCandlePuzzle(container, ctx, level) {
  const puzzle = createCandlePuzzle(level);
  let hintsUsed = 0;
  let hintCell = null; // { x, y, type: 'place' | 'remove' }
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
    🕯️ тап — поставить свечу, ещё тап — убрать<br>
    🏮 все фонари должны гореть<br>
    👻 ни один дух не должен попасть в свет<br>
    ⬛ стена свет не пропускает</div>`;
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
    if (undoCandle(puzzle)) { hintCell = null; ctx.sfx?.('tap'); draw(); }
  }
  function doReset() {
    if (finished) return;
    resetCandles(puzzle);
    hintCell = null;
    ctx.sfx?.('tap');
    draw();
  }
  function doHint() {
    if (finished) return;
    const h = candleHint(puzzle);
    ctx.sfx?.('hint');
    if (h.type === 'place') {
      hintsUsed += 1;
      hintCell = { x: h.x, y: h.y, type: 'place' };
      ctx.toast('Кот-хранитель показывает клетку для свечи…');
      draw();
    } else if (h.type === 'remove') {
      hintsUsed += 1;
      hintCell = { x: h.x, y: h.y, type: 'remove' };
      ctx.toast('Кот-хранитель морщится на одну из свечей…');
      draw();
    } else if (h.type === 'already') {
      ctx.toast('Всё уже горит как надо!');
    } else {
      ctx.toast('Хм, тут темно даже коту. Скажи хозяину лавки!');
    }
  }

  function onTap(ev) {
    if (finished) return;
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / dpr / rect.width;
    const x = Math.floor((ev.clientX - rect.left) * scale / CELL);
    const y = Math.floor((ev.clientY - rect.top) * scale / CELL);
    const r = placeCandle(puzzle, x, y);
    if (r.ok) {
      hintCell = null;
      ctx.sfx?.(r.action === 'place' ? 'potion' : 'tap');
      draw();
      if (isCandleSolved(puzzle)) finish();
    } else {
      ctx.toast(r.error);
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
        title: '🕯️ Свет расставлен!',
        subtitle: `«${level.name}» — фонари горят, духи дремлют`,
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

    const st = candleStatus(puzzle);

    // Пол — тёмная сетка
    for (let y = 0; y < gh; y++) {
      for (let x = 0; x < gw; x++) {
        g.fillStyle = (x + y) % 2 === 0 ? '#232a3c' : '#1d2333';
        g.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
    }

    // Свет: тёплая заливка освещённых клеток
    for (const k of st.lit) {
      const [x, y] = k.split(',').map(Number);
      g.fillStyle = 'rgba(255, 196, 96, 0.22)';
      g.fillRect(x * CELL, y * CELL, CELL, CELL);
    }

    // Стены — тёмные камни
    for (const [x, y] of level.walls) {
      g.fillStyle = '#0d1017';
      g.fillRect(x * CELL + 2, y * CELL + 2, CELL - 4, CELL - 4);
      g.fillStyle = '#2c3140';
      g.fillRect(x * CELL + 2, y * CELL + 2, CELL - 4, 6);
    }

    // Свечи: свечение радиуса + сама свеча
    for (const k of puzzle.candles) {
      const [x, y] = k.split(',').map(Number);
      const cx = x * CELL + CELL / 2;
      const cy = y * CELL + CELL / 2;
      const glow = g.createRadialGradient(cx, cy, 4, cx, cy, CELL * (level.radius * 0.55));
      glow.addColorStop(0, 'rgba(255, 214, 130, 0.5)');
      glow.addColorStop(1, 'rgba(255, 214, 130, 0)');
      g.fillStyle = glow;
      g.beginPath();
      g.arc(cx, cy, CELL * (level.radius * 0.55), 0, Math.PI * 2);
      g.fill();
    }

    const emoji = (e, x, y, size = CELL * 0.5, alpha = 1) => {
      g.globalAlpha = alpha;
      g.font = `${size}px "Segoe UI Emoji", sans-serif`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(e, x * CELL + CELL / 2, y * CELL + CELL / 2);
      g.globalAlpha = 1;
    };

    // Фонари: освещённый горит, тёмный — едва виден
    for (const [x, y] of level.lanterns) {
      const lit = st.lit.has(`${x},${y}`);
      if (lit) {
        const cx = x * CELL + CELL / 2;
        const cy = y * CELL + CELL / 2;
        const halo = g.createRadialGradient(cx, cy, 4, cx, cy, CELL * 0.7);
        halo.addColorStop(0, 'rgba(255, 230, 150, 0.55)');
        halo.addColorStop(1, 'rgba(255, 230, 150, 0)');
        g.fillStyle = halo;
        g.beginPath();
        g.arc(cx, cy, CELL * 0.7, 0, Math.PI * 2);
        g.fill();
      }
      emoji('🏮', x, y, CELL * 0.5, lit ? 1 : 0.45);
    }

    // Духи: в свете сереют и бледнеют
    for (const [x, y] of level.spirits) {
      const lit = st.lit.has(`${x},${y}`);
      if (lit) {
        g.fillStyle = 'rgba(160, 165, 175, 0.45)';
        g.beginPath();
        g.arc(x * CELL + CELL / 2, y * CELL + CELL / 2, CELL * 0.32, 0, Math.PI * 2);
        g.fill();
        emoji('👻', x, y, CELL * 0.5, 0.5);
      } else {
        emoji('👻', x, y, CELL * 0.5, 1);
      }
    }

    // Свечи поверх
    for (const k of puzzle.candles) {
      const [x, y] = k.split(',').map(Number);
      emoji('🕯️', x, y);
    }

    // Подсказка: зелёное кольцо — поставить, красное — убрать
    if (hintCell) {
      g.strokeStyle = hintCell.type === 'place' ? '#8fd98a' : '#e88a7a';
      g.lineWidth = 4;
      g.beginPath();
      g.arc(hintCell.x * CELL + CELL / 2, hintCell.y * CELL + CELL / 2, CELL * 0.44, 0, Math.PI * 2);
      g.stroke();
    }

    // Статус
    const warn = st.spiritsLit > 0
      ? `<div class="warn">👻 Дух в свете: ${st.spiritsLit}! Так нельзя.</div>`
      : '';
    statusEl.innerHTML =
      (st.solved
        ? '✅ <b>Все фонари горят, духи в тени!</b>'
        : `🕯️ Свечи: <b>${st.placed}/${st.limit}</b> · 🏮 Фонари: <b>${st.lanternsLit}/${st.lanternsTotal}</b>` + warn) +
      `<div class="muted" style="font-size:13px">Ходы: ${puzzle.moves} · Подсказки: ${hintsUsed}</div>`;
  }

  draw();

  return () => {
    window.removeEventListener('keydown', onKey);
    canvas.removeEventListener('pointerdown', onTap);
  };
}
