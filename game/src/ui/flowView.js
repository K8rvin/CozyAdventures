// Экран головоломки «Потоки покупателей» (ночной рынок).
import {
  createFlowPuzzle, rotateFlowTile, undoFlow, resetFlow,
  isFlowSolved, simulateFlows, flowHint, BUYER_COLORS,
} from '../core/flowPuzzle.js';
import { completePuzzle, nextPuzzle } from '../core/state.js';
import { header, showOverlay , puzzleSkipButton } from './common.js';

const CELL = 72;

export function renderFlowPuzzle(container, ctx, level) {
  const puzzle = createFlowPuzzle(level);
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
    🦊🐸🐦 покупатели идут по стрелкам от своего старта<br>
    Каждому нужен лоток СВОЕГО цвета 🏮<br>
    Тап по стрелке — повернуть её<br>
    Пути не должны делить клетку — будет толкотня 💥<br>
    📦 ящики — туда не пройти</div>`;
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
    if (undoFlow(puzzle)) { hintTile = null; ctx.sfx?.('tap'); draw(); }
  }
  function doReset() {
    if (finished) return;
    resetFlow(puzzle);
    hintTile = null;
    ctx.sfx?.('tap');
    draw();
  }
  function doHint() {
    if (finished) return;
    const h = flowHint(puzzle);
    ctx.sfx?.('hint');
    if (h.type === 'rotate') {
      hintsUsed += 1;
      hintTile = h.tileIndex;
      ctx.toast('Кот-хранитель кивает на одну из стрелок…');
      draw();
    } else if (h.type === 'already') {
      ctx.toast('Потоки уже разведены!');
    } else {
      ctx.toast('Хм, тут не развести потоки. Скажи хозяину лавки!');
    }
  }

  function onTap(ev) {
    if (finished) return;
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / dpr / rect.width;
    const x = Math.floor((ev.clientX - rect.left) * scale / CELL);
    const y = Math.floor((ev.clientY - rect.top) * scale / CELL);
    const idx = level.tiles.findIndex((t) => t.pos[0] === x && t.pos[1] === y);
    if (idx >= 0 && rotateFlowTile(puzzle, idx)) {
      hintTile = null;
      ctx.sfx?.('rotate');
      draw();
      if (isFlowSolved(puzzle)) finish();
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
        title: '🌙 Все лотки обслужены!',
        subtitle: `«${level.name}» — ночной рынок доволен`,
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

    const sim = simulateFlows(puzzle);
    // Клетка → первый покупатель, чей путь её проходит (для окраски стрелок)
    const cellOwner = new Map();
    sim.buyers.forEach((b, bi) => b.path.forEach(([x, y]) => {
      const key = `${x},${y}`;
      if (!cellOwner.has(key)) cellOwner.set(key, bi);
    }));

    // Пол — ночная брусчатка
    for (let y = 0; y < gh; y++) {
      for (let x = 0; x < gw; x++) {
        g.fillStyle = (x + y) % 2 === 0 ? '#2b2e4a' : '#323654';
        g.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
    }

    // Подложки плиток и ящики
    level.tiles.forEach((t) => {
      const px = t.pos[0] * CELL;
      const py = t.pos[1] * CELL;
      if (t.type === 'wall') {
        g.fillStyle = '#1e2033';
        roundRect(g, px + 4, py + 4, CELL - 8, CELL - 8, 10);
        g.fill();
      } else if (t.type === 'arrow') {
        g.fillStyle = '#4a4370';
        roundRect(g, px + 4, py + 4, CELL - 8, CELL - 8, 10);
        g.fill();
      }
    });

    // Пути покупателей — цветные линии
    sim.buyers.forEach((b, bi) => {
      const col = BUYER_COLORS[b.color];
      g.strokeStyle = col.css;
      g.globalAlpha = b.arrived ? 0.85 : 0.45;
      g.lineCap = 'round';
      g.lineJoin = 'round';
      g.lineWidth = 9;
      g.beginPath();
      b.path.forEach(([x, y], i) => {
        const cx = x * CELL + CELL / 2;
        const cy = y * CELL + CELL / 2;
        if (i === 0) g.moveTo(cx, cy);
        else g.lineTo(cx, cy);
      });
      g.stroke();
      // Голова пути
      const [hx, hy] = b.path[b.path.length - 1];
      g.fillStyle = col.css;
      g.beginPath();
      g.arc(hx * CELL + CELL / 2, hy * CELL + CELL / 2, 6, 0, Math.PI * 2);
      g.fill();
      g.globalAlpha = 1;
    });

    // Стрелки
    level.tiles.forEach((t, i) => {
      if (t.type !== 'arrow') return;
      const cx = t.pos[0] * CELL + CELL / 2;
      const cy = t.pos[1] * CELL + CELL / 2;
      const owner = cellOwner.get(t.pos.join(','));
      g.fillStyle = owner !== undefined ? BUYER_COLORS[sim.buyers[owner].color].css : '#aab0e8';
      const rot = puzzle.rot[i] ?? t.rot ?? 0;
      g.save();
      g.translate(cx, cy);
      g.rotate((Math.PI / 2) * rot); // rot 0 = вверх
      g.beginPath();
      g.moveTo(0, -16);
      g.lineTo(12, 2);
      g.lineTo(5, 2);
      g.lineTo(5, 15);
      g.lineTo(-5, 15);
      g.lineTo(-5, 2);
      g.lineTo(-12, 2);
      g.closePath();
      g.fill();
      g.restore();
    });

    // Подсказка
    if (hintTile !== null) {
      const t = level.tiles[hintTile];
      const cx = t.pos[0] * CELL + CELL / 2;
      const cy = t.pos[1] * CELL + CELL / 2;
      g.fillStyle = 'rgba(255, 202, 122, 0.35)';
      g.beginPath();
      g.arc(cx, cy, CELL * 0.46, 0, Math.PI * 2);
      g.fill();
    }

    // Иконки стартов и лотков
    const emoji = (e, cx, cy, size = CELL * 0.5) => {
      g.font = `${size}px "Segoe UI Emoji", sans-serif`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(e, cx, cy);
    };
    const arrivedAt = new Set(
      sim.buyers.filter((b) => b.arrived).map((b) => b.path[b.path.length - 1].join(',')),
    );
    level.tiles.forEach((t) => {
      const cx = t.pos[0] * CELL + CELL / 2;
      const cy = t.pos[1] * CELL + CELL / 2;
      if (t.type === 'start') {
        const col = BUYER_COLORS[t.color ?? 0];
        g.fillStyle = col.css;
        g.globalAlpha = 0.35;
        g.beginPath();
        g.arc(cx, cy, CELL * 0.42, 0, Math.PI * 2);
        g.fill();
        g.globalAlpha = 1;
        emoji(col.buyer, cx, cy);
      } else if (t.type === 'stall') {
        const col = BUYER_COLORS[t.color ?? 0];
        if (arrivedAt.has(t.pos.join(','))) {
          g.fillStyle = col.css;
          g.globalAlpha = 0.45;
          g.beginPath();
          g.arc(cx, cy, CELL * 0.42, 0, Math.PI * 2);
          g.fill();
          g.globalAlpha = 1;
        }
        g.strokeStyle = col.css;
        g.lineWidth = 4;
        g.beginPath();
        g.arc(cx, cy, CELL * 0.4, 0, Math.PI * 2);
        g.stroke();
        emoji('🏮', cx, cy);
      } else if (t.type === 'wall') {
        emoji('📦', cx, cy, CELL * 0.45);
      }
    });

    // Коллизии — красным
    for (const key of sim.collisions) {
      const [x, y] = key.split(',').map(Number);
      g.fillStyle = 'rgba(255, 80, 80, 0.45)';
      roundRect(g, x * CELL + 6, y * CELL + 6, CELL - 12, CELL - 12, 10);
      g.fill();
      emoji('💥', x * CELL + CELL / 2, y * CELL + CELL / 2, CELL * 0.4);
    }

    // Статус
    const n = sim.buyers.length;
    statusEl.innerHTML =
      (sim.solved
        ? '✅ <b>Все покупатели у своих лотков!</b>'
        : `🛍️ У лотков: <b>${sim.arrivedCount} из ${n}</b>` +
          (sim.collisions.size > 0
            ? `<br>💥 <b>Толкотня!</b> Пути пересекаются: ${sim.collisions.size}`
            : '')) +
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
