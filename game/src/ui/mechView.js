// Экран головоломки «Механизмы и ремонт».
import {
  createMechPuzzle, rotateGear, undoMech, resetMech,
  isMechSolved, traceMech, mechHint, faceAt, facesMesh, SIDES,
} from '../core/mechPuzzle.js';
import { completePuzzle, nextPuzzle } from '../core/state.js';
import { header, showOverlay , puzzleSkipButton } from './common.js';

const CELL = 72;

export function renderMechPuzzle(container, ctx, level) {
  const puzzle = createMechPuzzle(level);
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
    🎡 рукоять → 🔔 колокольчик<br>
    Тап по шестерёнке — повернуть на четверть оборота<br>
    Шип стыкуется только с пазом<br>
    🔩 заклинившая деталь — передачи через неё нет<br>
    Тёплый блеск — передача, что уже идёт от рукояти</div>`;
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
    if (undoMech(puzzle)) { hintTile = null; ctx.sfx?.('tap'); draw(); }
  }
  function doReset() {
    if (finished) return;
    resetMech(puzzle);
    hintTile = null;
    ctx.sfx?.('tap');
    draw();
  }
  function doHint() {
    if (finished) return;
    const h = mechHint(puzzle);
    ctx.sfx?.('hint');
    if (h.type === 'rotate') {
      hintsUsed += 1;
      hintTile = h.tileIndex;
      ctx.toast('Кот-хранитель постукивает по одной из шестерёнок…');
      draw();
    } else if (h.type === 'already') {
      ctx.toast('Механизм уже работает!');
    } else {
      ctx.toast('Хм, тут что-то сломано насовсем. Скажи хозяину лавки!');
    }
  }

  function onTap(ev) {
    if (finished) return;
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / dpr / rect.width;
    const x = Math.floor((ev.clientX - rect.left) * scale / CELL);
    const y = Math.floor((ev.clientY - rect.top) * scale / CELL);
    const idx = level.tiles.findIndex((t) => t.pos[0] === x && t.pos[1] === y);
    if (idx >= 0 && rotateGear(puzzle, idx)) {
      hintTile = null;
      ctx.sfx?.('rotate');
      draw();
      if (isMechSolved(puzzle)) finish();
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
        title: '🔔 Колокольчик зазвонил!',
        subtitle: `«${level.name}» — передача собрана`,
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

    const { reached } = traceMech(puzzle);
    const at = new Map();
    level.tiles.forEach((t, i) => at.set(t.pos.join(','), i));

    // Пол — железный пол мастерской
    for (let y = 0; y < gh; y++) {
      for (let x = 0; x < gw; x++) {
        g.fillStyle = (x + y) % 2 === 0 ? '#3d4149' : '#353945';
        g.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
    }

    // Сцепки между соседними деталями (только вправо и вниз, без дублей)
    level.tiles.forEach((t, i) => {
      if (t.type === 'blocker') return;
      const rot = puzzle.rot[i] ?? t.rot ?? 0;
      for (const s of [1, 2]) {
        const f = faceAt(t, rot, s);
        if (!f) continue;
        const [dx, dy] = SIDES[s];
        const j = at.get(`${t.pos[0] + dx},${t.pos[1] + dy}`);
        if (j === undefined) continue;
        const nt = level.tiles[j];
        if (nt.type === 'blocker') continue;
        const nf = faceAt(nt, puzzle.rot[j] ?? nt.rot ?? 0, (s + 2) % 4);
        if (!facesMesh(f, nf)) continue;
        const onPath = reached.has(i) && reached.has(j);
        g.strokeStyle = onPath ? '#ffd98a' : '#6a6154';
        g.lineCap = 'round';
        g.lineWidth = onPath ? 9 : 7;
        g.beginPath();
        g.moveTo(t.pos[0] * CELL + CELL / 2 + dx * CELL * 0.28, t.pos[1] * CELL + CELL / 2 + dy * CELL * 0.28);
        g.lineTo(t.pos[0] * CELL + CELL / 2 + dx * CELL * 0.72, t.pos[1] * CELL + CELL / 2 + dy * CELL * 0.72);
        g.stroke();
      }
    });

    // Детали
    level.tiles.forEach((t, i) => {
      const cx = t.pos[0] * CELL + CELL / 2;
      const cy = t.pos[1] * CELL + CELL / 2;
      const onPath = reached.has(i);
      const rot = puzzle.rot[i] ?? t.rot ?? 0;

      // Подложка
      g.fillStyle = t.type === 'blocker' ? '#2c2a33' : (onPath ? '#7d6338' : '#52493c');
      roundRect(g, t.pos[0] * CELL + 4, t.pos[1] * CELL + 4, CELL - 8, CELL - 8, 10);
      g.fill();

      // Подсказка
      if (hintTile === i) {
        g.fillStyle = 'rgba(255, 202, 122, 0.35)';
        g.beginPath();
        g.arc(cx, cy, CELL * 0.46, 0, Math.PI * 2);
        g.fill();
      }

      if (t.type === 'gear') {
        drawGear(g, t, rot, cx, cy, onPath);
      } else if (t.type === 'start' || t.type === 'end') {
        // Неподвижная ось с гранями
        g.fillStyle = onPath ? '#d9a441' : '#8d8578';
        g.beginPath();
        g.arc(cx, cy, CELL * 0.2, 0, Math.PI * 2);
        g.fill();
        g.strokeStyle = '#4a3b28';
        g.lineWidth = 3;
        g.stroke();
        drawFaces(g, t, rot, cx, cy);
      }

      // Иконки
      const emoji = (e, size = CELL * 0.42) => {
        g.font = `${size}px "Segoe UI Emoji", sans-serif`;
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillText(e, cx, cy);
      };
      if (t.type === 'start') emoji('🎡');
      else if (t.type === 'end') emoji('🔔');
      else if (t.type === 'blocker') emoji('🔩', CELL * 0.4);
    });

    // Статус
    const solvedNow = isMechSolved(puzzle);
    statusEl.innerHTML =
      (solvedNow
        ? '✅ <b>Механизм заработал!</b>'
        : `⚙️ Передача от рукояти: <b>${reached.size}</b> деталей`) +
      `<div class="muted" style="font-size:13px">Ходы: ${puzzle.moves} · Подсказки: ${hintsUsed}</div>`;
  }

  // Шестерёнка: зубчатый обод + грани (шипы и пазы), всё поворачивается с rot
  function drawGear(g, t, rot, cx, cy, onPath) {
    const r = CELL * 0.3;
    const body = onPath ? '#d9a441' : '#9a938a';
    const dark = onPath ? '#8a6420' : '#5e584f';

    // Зубцы (8 штук, крутятся вместе с деталью)
    g.fillStyle = dark;
    const baseAngle = rot * Math.PI / 2;
    for (let k = 0; k < 8; k++) {
      const a = baseAngle + (k / 8) * Math.PI * 2;
      g.save();
      g.translate(cx, cy);
      g.rotate(a);
      g.fillRect(r - 2, -3.5, 8, 7);
      g.restore();
    }

    // Тело
    g.fillStyle = body;
    g.beginPath();
    g.arc(cx, cy, r, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = dark;
    g.lineWidth = 3;
    g.stroke();

    // Ось
    g.fillStyle = '#3a3428';
    g.beginPath();
    g.arc(cx, cy, 5, 0, Math.PI * 2);
    g.fill();

    drawFaces(g, t, rot, cx, cy);
  }

  // Грани детали: шип — светлый набалдашник снаружи обода, паз — тёмная выемка
  function drawFaces(g, t, rot, cx, cy) {
    const r = CELL * 0.3;
    for (let s = 0; s < 4; s++) {
      const f = faceAt(t, rot, s);
      if (!f) continue;
      const [dx, dy] = SIDES[s];
      if (f === 'pin') {
        g.fillStyle = '#e8e0d0';
        g.strokeStyle = '#4a3b28';
        g.lineWidth = 2;
        g.beginPath();
        g.arc(cx + dx * (r + 7), cy + dy * (r + 7), 5, 0, Math.PI * 2);
        g.fill();
        g.stroke();
      } else {
        g.fillStyle = '#241f18';
        g.beginPath();
        g.arc(cx + dx * (r - 1), cy + dy * (r - 1), 6, 0, Math.PI * 2);
        g.fill();
      }
    }
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
