// Экран головоломки «Витраж миров»: пазл-перестановка фрагментов картины.
// Перетаскивание осколка на другой (или два тапа) меняет их местами.
import {
  createGlassPuzzle, swapPieces, undoGlass, resetGlass,
  isGlassSolved, glassStatus, glassHint, hashSeed,
} from '../core/glassPuzzle.js';
import { makeRng } from '../core/rng.js';
import { completePuzzle, nextPuzzle } from '../core/state.js';
import { header, showOverlay, puzzleSkipButton, backToPuzzleType } from './common.js';
import { setAchievementPresentationBusy } from './achievementCelebration.js';

export function renderGlassPuzzle(container, ctx, level) {
  const puzzle = createGlassPuzzle(level);
  let hintsUsed = 0;
  let hintCells = null; // [from, to] — подсветка подсказки
  let selected = -1;    // выбранный тапом осколок
  let finished = false;

  const [cols, rows] = level.grid;
  const total = cols * rows;
  // Клетка подбирается под сетку: витраж целиком влезает в экран
  const CELL = Math.min(240, Math.floor(720 / cols), Math.floor(560 / rows));

  container.appendChild(header(ctx, level.name, `Сложность: ${'★'.repeat(level.difficulty)}`, ['puzzles', { mech: 'glass' }]));

  const wrap = document.createElement('div');
  wrap.className = 'puzzle-wrap';

  const canvasBox = document.createElement('div');
  canvasBox.className = 'puzzle-canvas-box';
  const canvas = document.createElement('canvas');
  canvas.className = 'game';
  const dpr = window.devicePixelRatio || 1;
  canvas.width = cols * CELL * dpr;
  canvas.height = rows * CELL * dpr;
  canvas.style.width = `${cols * CELL}px`;
  canvas.style.height = `${rows * CELL}px`;
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
    Тяни осколок на другой — они поменяются местами<br>
    Или тапни два осколка по очереди<br>
    Золотая кайма — осколок уже на своём месте</div>`;
  side.appendChild(legend);

  const controls = document.createElement('div');
  controls.className = 'puzzle-controls';
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

  // --- Арт: картинка уровня или процедурный витраж-заменитель ---
  let art = null;   // источник для drawImage (img или offscreen canvas)
  let artW = 0;
  let artH = 0;

  function makeFallbackArt() {
    // Узнаваемый «витраж» по seed уровня: небо, светило, холмы, руны-ориентиры
    const c = document.createElement('canvas');
    c.width = cols * 160;
    c.height = rows * 160;
    const g = c.getContext('2d');
    const rng = makeRng(hashSeed(level.id) ^ 0x9e3779b9);
    const baseHue = rng.int(0, 359);
    const grad = g.createLinearGradient(0, 0, 0, c.height);
    grad.addColorStop(0, `hsl(${baseHue}, 45%, 62%)`);
    grad.addColorStop(1, `hsl(${(baseHue + 70) % 360}, 50%, 30%)`);
    g.fillStyle = grad;
    g.fillRect(0, 0, c.width, c.height);
    // Светило
    g.fillStyle = `hsl(${(baseHue + 40) % 360}, 90%, 78%)`;
    g.beginPath();
    g.arc(rng.range(c.width * 0.15, c.width * 0.85), rng.range(c.height * 0.12, c.height * 0.4), c.height * 0.14, 0, Math.PI * 2);
    g.fill();
    // Холмы в три слоя
    for (let layer = 0; layer < 3; layer++) {
      g.fillStyle = `hsla(${(baseHue + 30 + layer * 20) % 360}, 40%, ${34 - layer * 8}%, 0.9)`;
      g.beginPath();
      const baseY = c.height * (0.55 + layer * 0.15);
      g.moveTo(0, c.height);
      for (let x = 0; x <= c.width; x += 8) {
        g.lineTo(x, baseY + Math.sin(x / 60 + layer * 2.1) * c.height * 0.08);
      }
      g.lineTo(c.width, c.height);
      g.closePath();
      g.fill();
    }
    // Руны-ориентиры: каждая на своём месте уникальна
    const glyphs = ['✦', '❋', '☾', '★', '❆', '🍃', '🕯️', '⚙️', '🍄', '🐈', '🌿', '🔮', '🫖', '🏮', '🗝️', '🦉'];
    for (let i = 0; i < total + 4; i++) {
      g.font = `${Math.floor(c.height / rows * 0.5)}px "Segoe UI Emoji", sans-serif`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(glyphs[rng.int(0, glyphs.length - 1)], rng.range(20, c.width - 20), rng.range(20, c.height - 20));
    }
    return c;
  }

  if (typeof Image !== 'undefined') {
    const img = new Image();
    img.onload = () => { art = img; artW = img.naturalWidth; artH = img.naturalHeight; draw(); };
    img.onerror = () => {
      art = makeFallbackArt(); artW = art.width; artH = art.height; draw();
    };
    img.src = level.image;
  } else {
    art = makeFallbackArt();
    artW = art.width;
    artH = art.height;
  }

  // Кадрирование картинки под аспект сетки (cover, по центру)
  function cropRect() {
    const boardAspect = cols / rows;
    const imgAspect = artW / artH;
    if (imgAspect > boardAspect) {
      const sw = artH * boardAspect;
      return { sx: (artW - sw) / 2, sy: 0, sw, sh: artH };
    }
    const sh = artW / boardAspect;
    return { sx: 0, sy: (artH - sh) / 2, sw: artW, sh };
  }

  function doSwap(a, b) {
    if (swapPieces(puzzle, a, b)) {
      hintCells = null;
      ctx.sfx?.('rotate');
      draw();
      if (isGlassSolved(puzzle)) finish();
    }
  }

  function doUndo() {
    if (finished) return;
    if (undoGlass(puzzle)) { hintCells = null; selected = -1; ctx.sfx?.('tap'); draw(); }
  }
  function doReset() {
    if (finished) return;
    resetGlass(puzzle);
    hintCells = null; selected = -1;
    ctx.sfx?.('tap');
    draw();
  }
  function doHint() {
    if (finished) return;
    const h = glassHint(puzzle);
    ctx.sfx?.('hint');
    if (h.type === 'swap') {
      hintsUsed += 1;
      hintCells = [h.from, h.to];
      ctx.toast('Кот-хранитель переглядывается: два осколка просятся поменяться…');
      draw();
    } else {
      ctx.toast('Витраж уже цел!');
    }
  }

  // --- Ввод: перетаскивание + два тапа ---
  let dragFrom = -1;
  let dragging = false;
  let dragPos = { x: 0, y: 0 };
  let downPos = { x: 0, y: 0 };

  function eventPos(ev) {
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / dpr / rect.width;
    return { x: (ev.clientX - rect.left) * scale, y: (ev.clientY - rect.top) * scale };
  }
  function cellAt(pos) {
    const cx = Math.floor(pos.x / CELL);
    const cy = Math.floor(pos.y / CELL);
    if (cx < 0 || cy < 0 || cx >= cols || cy >= rows) return -1;
    return cy * cols + cx;
  }

  function onPointerDown(ev) {
    if (finished) return;
    const pos = eventPos(ev);
    const c = cellAt(pos);
    if (c < 0) return;
    dragFrom = c;
    dragging = false;
    dragPos = pos;
    downPos = pos;
    canvas.setPointerCapture?.(ev.pointerId);
  }
  function onPointerMove(ev) {
    if (dragFrom < 0 || finished) return;
    const pos = eventPos(ev);
    dragPos = pos;
    if (!dragging && Math.hypot(pos.x - downPos.x, pos.y - downPos.y) > CELL * 0.15) {
      dragging = true;
      selected = -1;
    }
    if (dragging) draw();
  }
  function onPointerUp(ev) {
    if (dragFrom < 0 || finished) return;
    const pos = eventPos(ev);
    const c = cellAt(pos);
    if (dragging) {
      if (c >= 0 && c !== dragFrom) doSwap(dragFrom, c);
    } else if (c >= 0) {
      // Тап: выбрать / снять выбор / поменять с выбранным
      if (selected === -1) {
        selected = c;
        ctx.sfx?.('tap');
      } else if (selected === c) {
        selected = -1;
        ctx.sfx?.('tap');
      } else {
        doSwap(selected, c);
        selected = -1;
      }
    }
    dragFrom = -1;
    dragging = false;
    draw();
  }
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', () => { dragFrom = -1; dragging = false; draw(); });

  function onKey(ev) {
    if (ev.key === 'z' || ev.key === 'Z' || (ev.ctrlKey && ev.key === 'z')) { ev.preventDefault(); doUndo(); }
    if (ev.key === 'h' || ev.key === 'H' || ev.key === 'р' || ev.key === 'Р') doHint();
    if (ev.key === 'r' || ev.key === 'R' || ev.key === 'к' || ev.key === 'К') doReset();
    if (ev.key === 'Escape') {
      if (selected >= 0) { selected = -1; draw(); }
      else backToPuzzleType(ctx, level);
    }
  }
  window.addEventListener('keydown', onKey);

  function finish() {
    finished = true;
    const rewards = completePuzzle(ctx.state, level.id, { moves: puzzle.moves, hintsUsed });
    ctx.save();
    startCelebration(rewards);
  }

  // --- Праздник сборки: каймы тают, картинка проявляется, салют, фанфара ---
  let celebration = null;
  let rafId = 0;

  function startCelebration(rewards) {
    setAchievementPresentationBusy('glass-celebration', true);
    ctx.sfx?.('fanfare');
    const canAnimate = typeof requestAnimationFrame !== 'undefined'
      && typeof performance !== 'undefined';
    if (!canAnimate) { draw(); setTimeout(() => showWin(rewards), 400); return; }
    // Вспышки салюта: время, точка, цвет, разлёт искр
    const bursts = [0.45, 0.85, 1.2, 1.55, 1.9].map((at) => ({
      at,
      x: (0.15 + Math.random() * 0.7) * cols * CELL,
      y: (0.12 + Math.random() * 0.55) * rows * CELL,
      hue: Math.floor(Math.random() * 360),
      sparks: Array.from({ length: 18 }, (_, i) => {
        const ang = (i / 18) * Math.PI * 2 + Math.random() * 0.4;
        const spd = 60 + Math.random() * 110;
        return { vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd };
      }),
    }));
    celebration = { t0: performance.now(), bursts };
    const step = () => {
      draw();
      const t = (performance.now() - celebration.t0) / 1000;
      if (t < 2.5) rafId = requestAnimationFrame(step);
      else { rafId = 0; showWin(rewards); }
    };
    rafId = requestAnimationFrame(step);
  }

  function showWin(rewards) {
    setAchievementPresentationBusy('glass-celebration', false);
    const next = nextPuzzle(level.id);
    showOverlay(ctx, {
      title: '🪟 Витраж сияет!',
      subtitle: `«${level.name}» — собран за ${puzzle.moves} ходов`,
      rewards,
      buttons: [
        ...(next ? [{ label: `Следующая → ${next.name}`, primary: true, onClick: () => ctx.go('puzzle', { id: next.id }) }] : []),
        { label: 'К загадкам', primary: !next, onClick: () => backToPuzzleType(ctx, level) },
        { label: 'Ещё раз', onClick: () => ctx.go('puzzle', { id: level.id }) },
        { label: 'В лавку', onClick: () => ctx.go('hub') },
        { label: 'Закрыть', onClick: () => {} }, // остаться полюбоваться витражом
      ],
    });
  }

  function drawPiece(pieceIdx, x, y, { dim = false, ghost = false, borderAlpha = 0.85 } = {}) {
    if (!art) return;
    const crop = cropRect();
    const pw = crop.sw / cols;
    const ph = crop.sh / rows;
    const sx = crop.sx + (pieceIdx % cols) * pw;
    const sy = crop.sy + Math.floor(pieceIdx / cols) * ph;
    g.save();
    if (dim) g.globalAlpha = 0.25;
    if (ghost) {
      g.globalAlpha = 0.92;
      g.shadowColor = 'rgba(0, 0, 0, 0.5)';
      g.shadowBlur = 14;
      g.shadowOffsetY = 6;
    }
    g.drawImage(art, sx, sy, pw, ph, x, y, CELL, CELL);
    g.restore();
    // Свинцовая кайма витража (в празднике тает)
    if (borderAlpha > 0.01) {
      g.strokeStyle = `rgba(26, 20, 16, ${borderAlpha})`;
      g.lineWidth = 2;
      g.strokeRect(x + 1, y + 1, CELL - 2, CELL - 2);
    }
  }

  // Цельная картинка без разрезов (финал праздника)
  function drawSeamless(alpha) {
    if (!art || alpha <= 0.01) return;
    const crop = cropRect();
    g.save();
    g.globalAlpha = alpha;
    g.drawImage(art, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, cols * CELL, rows * CELL);
    g.restore();
  }

  function drawFireworks(t) {
    for (const b of celebration.bursts) {
      const bt = t - b.at;
      if (bt < 0 || bt > 0.9) continue;
      const fade = 1 - bt / 0.9;
      for (const s of b.sparks) {
        const px = b.x + s.vx * bt;
        const py = b.y + s.vy * bt + 140 * bt * bt; // искры оседают
        g.fillStyle = `hsla(${b.hue}, 95%, ${65 + fade * 20}%, ${fade})`;
        g.beginPath();
        g.arc(px, py, 2.2 + fade * 1.8, 0, Math.PI * 2);
        g.fill();
      }
      // Вспышка в центре всплытия
      if (bt < 0.15) {
        g.fillStyle = `hsla(${b.hue}, 100%, 85%, ${0.5 * (1 - bt / 0.15)})`;
        g.beginPath();
        g.arc(b.x, b.y, 18 + bt * 120, 0, Math.PI * 2);
        g.fill();
      }
    }
  }

  function draw() {
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, cols * CELL, rows * CELL);

    // Рама окна
    g.fillStyle = '#241b14';
    g.fillRect(0, 0, cols * CELL, rows * CELL);

    // Прогресс праздника: каймы тают (0→0.9с), картинка проявляется (0.7→1.4с)
    let t = 0;
    if (celebration) t = (performance.now() - celebration.t0) / 1000;
    const borderAlpha = celebration ? 0.85 * (1 - Math.min(1, t / 0.9)) : 0.85;
    const seamlessAlpha = celebration ? Math.min(1, Math.max(0, (t - 0.7) / 0.7)) : 0;

    for (let cell = 0; cell < total; cell++) {
      const x = (cell % cols) * CELL;
      const y = Math.floor(cell / cols) * CELL;
      const pieceIdx = puzzle.pieces[cell];
      const beingDragged = dragging && cell === dragFrom;
      drawPiece(pieceIdx, x, y, { dim: beingDragged, borderAlpha });

      if (!celebration) {
        // Осколок на месте — тёплая золотая кайма
        if (pieceIdx === cell) {
          g.strokeStyle = 'rgba(255, 202, 122, 0.7)';
          g.lineWidth = 3;
          g.strokeRect(x + 3.5, y + 3.5, CELL - 7, CELL - 7);
        }
        // Подсказка
        if (hintCells && (hintCells[0] === cell || hintCells[1] === cell)) {
          g.fillStyle = 'rgba(255, 202, 122, 0.30)';
          g.fillRect(x, y, CELL, CELL);
        }
        // Выбранный тапом
        if (selected === cell) {
          g.strokeStyle = '#ffe28a';
          g.lineWidth = 4;
          g.strokeRect(x + 2, y + 2, CELL - 4, CELL - 4);
        }
      }
    }

    // Цельный витраж поверх — без разрезов
    drawSeamless(seamlessAlpha);
    // Салют
    if (celebration) drawFireworks(t);

    // Перетаскиваемый осколок поверх всего
    if (dragging && dragFrom >= 0) {
      drawPiece(puzzle.pieces[dragFrom], dragPos.x - CELL / 2, dragPos.y - CELL / 2, { ghost: true });
    }

    // Статус
    const st = glassStatus(puzzle);
    statusEl.innerHTML =
      (st.solved
        ? '✅ <b>Витраж собран!</b>'
        : `🪟 На месте: <b>${st.placed}</b> из ${st.total}`) +
      `<div class="muted" style="font-size:13px">Ходы: ${puzzle.moves} · Подсказки: ${hintsUsed}</div>`;
  }

  const g = canvas.getContext('2d');
  draw();

  return () => {
    window.removeEventListener('keydown', onKey);
    canvas.removeEventListener('pointerdown', onPointerDown);
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointerup', onPointerUp);
    if (rafId && typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(rafId);
    setAchievementPresentationBusy('glass-celebration', false);
  };
}
