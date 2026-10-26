// Экран головоломки «Гобелены ветров»: вращение лоскутов тканых картин.
// Тап по лоскуту крутит его на 90° по часовой (плавная анимация, где есть rAF).
// Якоря (📌) не крутятся; золотая кайма на верных лоскутах — если goldRim не false.
import {
  createSpinPuzzle, rotatePiece, undoSpin, resetSpin,
  isSpinSolved, spinStatus, spinHint, parMoves, hashSeed,
} from '../core/spinPuzzle.js';
import { makeRng } from '../core/rng.js';
import { completePuzzle, nextPuzzle } from '../core/state.js';
import { header, showOverlay, puzzleSkipButton, backToPuzzleType } from './common.js';
import { setAchievementPresentationBusy } from './achievementCelebration.js';

const ANIM_MS = 130; // длительность поворота лоскута на 90°

export function renderSpinPuzzle(container, ctx, level) {
  const puzzle = createSpinPuzzle(level);
  let hintsUsed = 0;
  let hintCell = -1;  // подсветка подсказки
  let finished = false;

  const [cols, rows] = level.grid;
  const total = cols * rows;
  const par = parMoves(puzzle);
  const goldRim = level.goldRim !== false;
  // Клетка подбирается под сетку: гобелен целиком влезает в экран
  const CELL = Math.min(240, Math.floor(720 / cols), Math.floor(560 / rows));

  container.appendChild(header(ctx, level.name, `Сложность: ${'★'.repeat(level.difficulty)}`, ['puzzles', { mech: 'spin' }]));

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

  const legendLines = ['Тапни лоскут — он повернётся по часовой'];
  legendLines.push(goldRim
    ? 'Золотая кайма — лоскут уже лежит верно'
    : 'Кайма не светится — смотри на узор');
  if (puzzle.anchors.size) legendLines.push('📌 — лоскут приколочен и не крутится');
  const legend = document.createElement('div');
  legend.className = 'panel mt';
  legend.innerHTML = `<div class="desc" style="line-height:1.9">${legendLines.join('<br>')}</div>`;
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

  // --- Арт: картинка уровня или процедурный гобелен-заменитель ---
  let art = null;
  let artW = 0;
  let artH = 0;

  function makeFallbackArt() {
    // Узнаваемый «гобелен» по seed уровня: небо, светило, холмы, руны-ориентиры
    const c = document.createElement('canvas');
    c.width = cols * 160;
    c.height = rows * 160;
    const g2 = c.getContext('2d');
    const rng = makeRng(hashSeed(level.id) ^ 0x9e3779b9);
    const baseHue = rng.int(0, 359);
    const grad = g2.createLinearGradient(0, 0, 0, c.height);
    grad.addColorStop(0, `hsl(${baseHue}, 45%, 62%)`);
    grad.addColorStop(1, `hsl(${(baseHue + 70) % 360}, 50%, 30%)`);
    g2.fillStyle = grad;
    g2.fillRect(0, 0, c.width, c.height);
    g2.fillStyle = `hsl(${(baseHue + 40) % 360}, 90%, 78%)`;
    g2.beginPath();
    g2.arc(rng.range(c.width * 0.15, c.width * 0.85), rng.range(c.height * 0.12, c.height * 0.4), c.height * 0.14, 0, Math.PI * 2);
    g2.fill();
    for (let layer = 0; layer < 3; layer++) {
      g2.fillStyle = `hsla(${(baseHue + 30 + layer * 20) % 360}, 40%, ${34 - layer * 8}%, 0.9)`;
      g2.beginPath();
      const baseY = c.height * (0.55 + layer * 0.15);
      g2.moveTo(0, c.height);
      for (let x = 0; x <= c.width; x += 8) {
        g2.lineTo(x, baseY + Math.sin(x / 60 + layer * 2.1) * c.height * 0.08);
      }
      g2.lineTo(c.width, c.height);
      g2.closePath();
      g2.fill();
    }
    const glyphs = ['✦', '❋', '☾', '★', '❆', '🍃', '🕯️', '⚙️', '🍄', '🐈', '🌿', '🔮', '🫖', '🏮', '🗝️', '🦉'];
    for (let i = 0; i < total + 4; i++) {
      g2.font = `${Math.floor(c.height / rows * 0.5)}px "Segoe UI Emoji", sans-serif`;
      g2.textAlign = 'center';
      g2.textBaseline = 'middle';
      g2.fillText(glyphs[rng.int(0, glyphs.length - 1)], rng.range(20, c.width - 20), rng.range(20, c.height - 20));
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

  // --- Анимация поворотов: vis[cell] — непрерывный угол в четвертях оборота ---
  const canAnimate = typeof requestAnimationFrame !== 'undefined'
    && typeof performance !== 'undefined';
  const vis = Array.from({ length: total }, (_, i) => puzzle.rot[i]);
  const anims = new Map(); // cell -> { from, to, t0 }
  let rafId = 0;

  function displayedAngle(cell) {
    const a = anims.get(cell);
    if (!a) return vis[cell];
    const t = Math.min(1, (performance.now() - a.t0) / ANIM_MS);
    const eased = 1 - (1 - t) * (1 - t); // ease-out
    return a.from + (a.to - a.from) * eased;
  }

  function ensureLoop() {
    if (!canAnimate || rafId) return;
    const step = () => {
      const now = performance.now();
      for (const [cell, a] of [...anims]) {
        if (now - a.t0 >= ANIM_MS) {
          vis[cell] = ((a.to % 4) + 4) % 4;
          anims.delete(cell);
        }
      }
      draw();
      // Праздник отыграл — оверлей победы (один раз)
      if (celebration && !celebration.shown && now - celebration.t0 >= 2500) {
        celebration.shown = true;
        showWin(celebration.rewards);
      }
      if (anims.size || (celebration && !celebration.shown)) {
        rafId = requestAnimationFrame(step);
      } else {
        rafId = 0;
        if (!finished && isSpinSolved(puzzle)) finish();
      }
    };
    rafId = requestAnimationFrame(step);
  }

  function spinCell(cell) {
    if (finished || puzzle.anchors.has(cell)) return;
    if (!rotatePiece(puzzle, cell)) return;
    hintCell = -1;
    ctx.sfx?.('rotate');
    if (canAnimate) {
      const from = displayedAngle(cell);
      anims.set(cell, { from, to: from + 1, t0: performance.now() });
      ensureLoop();
      draw();
      // Финиш дождётся конца анимации в ensureLoop
    } else {
      vis[cell] = puzzle.rot[cell];
      draw();
      if (isSpinSolved(puzzle)) finish();
    }
  }

  function doUndo() {
    if (finished) return;
    // Отмена снимает клетку со стека истории — запомним её для анимации
    const cell = puzzle.history.length ? puzzle.history[puzzle.history.length - 1] : -1;
    if (undoSpin(puzzle)) {
      hintCell = -1;
      ctx.sfx?.('tap');
      if (canAnimate && cell >= 0) {
        // Отмена крутит лоскут обратно — против часовой
        const from = displayedAngle(cell);
        anims.set(cell, { from, to: from - 1, t0: performance.now() });
        ensureLoop();
      } else {
        for (let i = 0; i < total; i++) vis[i] = puzzle.rot[i];
      }
      draw();
    }
  }

  function doReset() {
    if (finished) return;
    resetSpin(puzzle);
    hintCell = -1;
    ctx.sfx?.('tap');
    anims.clear();
    for (let i = 0; i < total; i++) vis[i] = puzzle.rot[i];
    draw();
  }

  function doHint() {
    if (finished) return;
    const h = spinHint(puzzle);
    ctx.sfx?.('hint');
    if (h.type === 'rotate') {
      hintsUsed += 1;
      hintCell = h.cell;
      ctx.toast('Кот-хранитель покрутил лапой: этот лоскут просится по часовой…');
      draw();
    } else {
      ctx.toast('Гобелен уже ровен!');
    }
  }

  // --- Ввод: тап = поворот по часовой ---
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
    const c = cellAt(eventPos(ev));
    if (c < 0) return;
    spinCell(c);
  }
  canvas.addEventListener('pointerdown', onPointerDown);

  function onKey(ev) {
    if (ev.key === 'z' || ev.key === 'Z' || (ev.ctrlKey && ev.key === 'z')) { ev.preventDefault(); doUndo(); }
    if (ev.key === 'h' || ev.key === 'H' || ev.key === 'р' || ev.key === 'Р') doHint();
    if (ev.key === 'r' || ev.key === 'R' || ev.key === 'к' || ev.key === 'К') doReset();
    if (ev.key === 'Escape') backToPuzzleType(ctx, level);
  }
  window.addEventListener('keydown', onKey);

  function finish() {
    if (finished) return;
    finished = true;
    const rewards = completePuzzle(ctx.state, level.id, {
      moves: puzzle.moves, hintsUsed,
      achievement: { par },
    });
    ctx.save();
    startCelebration(rewards);
  }

  // --- Праздник сборки: каймы тают, картинка проявляется, салют, фанфара ---
  let celebration = null;

  function startCelebration(rewards) {
    setAchievementPresentationBusy('spin-celebration', true);
    ctx.sfx?.('fanfare');
    if (!canAnimate) { draw(); setTimeout(() => showWin(rewards), 400); return; }
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
    celebration = { t0: performance.now(), bursts, rewards, shown: false };
    ensureLoop();
  }

  function showWin(rewards) {
    setAchievementPresentationBusy('spin-celebration', false);
    const next = nextPuzzle(level.id);
    const medal = puzzle.moves <= par ? ' · 🏅 Точная сборка!' : '';
    showOverlay(ctx, {
      title: '🖼️ Гобелен ровен!',
      subtitle: `«${level.name}» — собран за ${puzzle.moves} ходов${medal}`,
      rewards,
      buttons: [
        ...(next ? [{ label: `Следующая → ${next.name}`, primary: true, onClick: () => ctx.go('puzzle', { id: next.id }) }] : []),
        { label: 'К загадкам', primary: !next, onClick: () => backToPuzzleType(ctx, level) },
        { label: 'Ещё раз', onClick: () => ctx.go('puzzle', { id: level.id }) },
        { label: 'В лавку', onClick: () => ctx.go('hub') },
        { label: 'Закрыть', onClick: () => {} }, // остаться полюбоваться гобеленом
      ],
    });
  }

  function drawPiece(cell, { borderAlpha = 0.85 } = {}) {
    if (!art) return;
    const x = (cell % cols) * CELL;
    const y = Math.floor(cell / cols) * CELL;
    const crop = cropRect();
    const pw = crop.sw / cols;
    const ph = crop.sh / rows;
    const sx = crop.sx + (cell % cols) * pw;
    const sy = crop.sy + Math.floor(cell / cols) * ph;
    const angle = (displayedAngle(cell) * Math.PI) / 2; // четверти → радианы (по часовой)
    g.save();
    // Лоскут крутится внутри своей клетки: углы не залезают на соседей
    g.beginPath();
    g.rect(x + 1, y + 1, CELL - 2, CELL - 2);
    g.clip();
    g.translate(x + CELL / 2, y + CELL / 2);
    g.rotate(angle);
    g.drawImage(art, sx, sy, pw, ph, -CELL / 2, -CELL / 2, CELL, CELL);
    g.restore();
    // Ткацкая рама (в празднике тает)
    if (borderAlpha > 0.01) {
      g.strokeStyle = `rgba(26, 20, 16, ${borderAlpha})`;
      g.lineWidth = 2;
      g.strokeRect(x + 1, y + 1, CELL - 2, CELL - 2);
    }
  }

  // Цельный гобелен без стежков (финал праздника)
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

    // Основа гобелена
    g.fillStyle = '#241b14';
    g.fillRect(0, 0, cols * CELL, rows * CELL);

    // Прогресс праздника: каймы тают (0→0.9с), картинка проявляется (0.7→1.4с)
    let t = 0;
    if (celebration) t = (performance.now() - celebration.t0) / 1000;
    const borderAlpha = celebration ? 0.85 * (1 - Math.min(1, t / 0.9)) : 0.85;
    const seamlessAlpha = celebration ? Math.min(1, Math.max(0, (t - 0.7) / 0.7)) : 0;

    for (let cell = 0; cell < total; cell++) {
      drawPiece(cell, { borderAlpha });

      if (!celebration) {
        const x = (cell % cols) * CELL;
        const y = Math.floor(cell / cols) * CELL;
        // Лоскут лежит верно — тёплая золотая кайма (если уровень не «слепой»)
        if (goldRim && puzzle.rot[cell] === 0 && !puzzle.anchors.has(cell)) {
          g.strokeStyle = 'rgba(255, 202, 122, 0.7)';
          g.lineWidth = 3;
          g.strokeRect(x + 3.5, y + 3.5, CELL - 7, CELL - 7);
        }
        // Подсказка: подсветка + стрелка по часовой
        if (hintCell === cell) {
          g.fillStyle = 'rgba(255, 202, 122, 0.30)';
          g.fillRect(x, y, CELL, CELL);
          g.fillStyle = '#ffe28a';
          g.font = `${Math.floor(CELL * 0.4)}px "Segoe UI Emoji", sans-serif`;
          g.textAlign = 'center';
          g.textBaseline = 'middle';
          g.fillText('↻', x + CELL / 2, y + CELL / 2);
        }
        // Гвоздик у якоря
        if (puzzle.anchors.has(cell)) {
          g.font = `${Math.floor(CELL * 0.22)}px "Segoe UI Emoji", sans-serif`;
          g.textAlign = 'left';
          g.textBaseline = 'top';
          g.fillText('📌', x + CELL * 0.06, y + CELL * 0.04);
        }
      }
    }

    // Цельный гобелен поверх — без стежков
    drawSeamless(seamlessAlpha);
    // Салют
    if (celebration) drawFireworks(t);

    // Статус
    const st = spinStatus(puzzle);
    statusEl.innerHTML =
      (st.solved
        ? '✅ <b>Гобелен ровен!</b>'
        : `🖼️ Ровно: <b>${st.placed}</b> из ${st.total}`) +
      `<div class="muted" style="font-size:13px">Ходы: ${puzzle.moves} · Подсказки: ${hintsUsed} · Эталон: ${par}</div>`;
  }

  const g = canvas.getContext('2d');
  draw();

  return () => {
    window.removeEventListener('keydown', onKey);
    canvas.removeEventListener('pointerdown', onPointerDown);
    if (rafId && typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(rafId);
    setAchievementPresentationBusy('spin-celebration', false);
  };
}
