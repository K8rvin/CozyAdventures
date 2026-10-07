// Экран «Поиск предметов»: цельная иллюстрированная сцена, поиск по названиям.
// Фон: assets/seek_<world>.png, фолбэк — assets/seek_<world>.svg, затем заливка.
import {
  createSeekPuzzle, seekTap, isSeekSolved, seekProgress, seekHint, groupProgress,
} from '../core/seekPuzzle.js';
import { completePuzzle, nextPuzzle, applySeekOverrides } from '../core/state.js';
import { header, showOverlay , puzzleSkipButton } from './common.js';

export function renderSeekPuzzle(container, ctx, rawLevel) {
  const level = applySeekOverrides(ctx.state, rawLevel); // правки из редактора
  const puzzle = createSeekPuzzle(level);
  let hintsUsed = 0;
  let hintSpot = null; // {x, y}
  let finished = false;
  let missFlash = null;

  const [W, H] = level.sceneSize || [1000, 650];

  container.appendChild(header(ctx, level.name, `Сложность: ${'★'.repeat(level.difficulty)}`, 'puzzles'));

  const wrap = document.createElement('div');
  wrap.className = 'puzzle-wrap';

  const canvasBox = document.createElement('div');
  canvasBox.className = 'puzzle-canvas-box';
  const canvas = document.createElement('canvas');
  canvas.className = 'game';
  const dpr = window.devicePixelRatio || 1;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = 'min(100%, 880px)';
  canvas.style.height = 'auto';
  canvasBox.appendChild(canvas);
  wrap.appendChild(canvasBox);

  const side = document.createElement('div');
  side.className = 'puzzle-side';
  const intro = document.createElement('div');
  intro.className = 'intro-text';
  intro.textContent = level.intro;
  side.appendChild(intro);

  const listPanel = document.createElement('div');
  listPanel.className = 'panel';
  listPanel.style.padding = '10px 14px';
  const listTitle = document.createElement('div');
  listTitle.className = 'muted';
  listTitle.style.cssText = 'font-size:13px;margin-bottom:6px';
  listTitle.textContent = 'Найди в комнате торговца:';
  listPanel.appendChild(listTitle);
  const targetList = document.createElement('div');
  targetList.style.cssText = 'display:flex;flex-direction:column;gap:4px';
  listPanel.appendChild(targetList);
  side.appendChild(listPanel);

  const statusEl = document.createElement('div');
  statusEl.className = 'puzzle-status';
  side.appendChild(statusEl);

  const controls = document.createElement('div');
  controls.className = 'puzzle-controls';
  controls.style.marginTop = '10px';
  const btnHint = mkBtn('💡 Подсказка (H)', doHint);
  const btnReset = mkBtn('🔄 Заново (R)', doReset);
  controls.append(btnHint, btnReset);
  controls.appendChild(puzzleSkipButton(ctx, level, () => ctx.go('puzzles')));
  const btnEdit = mkBtn('✏️', () => ctx.go('seekeditor', { id: rawLevel.id }));
  btnEdit.classList.add('ghost');
  btnEdit.title = 'Править области поиска';
  controls.appendChild(btnEdit);
  side.appendChild(controls);

  wrap.appendChild(side);
  container.appendChild(wrap);

  function mkBtn(label, fn) {
    const b = document.createElement('button');
    b.innerHTML = label;
    b.addEventListener('click', fn);
    return b;
  }

  // Фон: web.jpg → jfif → png → svg → заливка (уровень может задать свой bg)
  let bgImage = null;
  if (typeof Image !== 'undefined') {
    const bgName = level.bg || `seek_${level.world}`;
    const candidates = [
      `assets/${bgName}_web.jpg`,
      `assets/${bgName}.jfif`,
      `assets/${bgName}.png`,
      `assets/${bgName}.svg`,
    ];
    let idx = 0;
    const tryNext = () => {
      if (idx >= candidates.length) return;
      const img = new Image();
      img.onload = () => { bgImage = img; draw(); };
      img.onerror = () => { idx += 1; tryNext(); };
      img.src = candidates[idx];
    };
    tryNext();
  }

  function doHint() {
    if (finished) return;
    const h = seekHint(puzzle);
    if (h.type === 'point') {
      hintsUsed += 1;
      hintSpot = { x: h.x, y: h.y };
      ctx.toast(`Светлячок кружит рядом: «${h.label}» где-то здесь…`);
      ctx.sfx?.('hint');
      draw();
    } else {
      ctx.toast('Всё уже найдено!');
    }
  }

  function doReset() {
    if (finished) return;
    puzzle.found = new Set();
    puzzle.misses = 0;
    puzzle.moves += 1;
    hintSpot = null;
    ctx.sfx?.('tap');
    draw();
  }

  function onTap(ev) {
    if (finished) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / dpr / rect.width;
    const scaleY = canvas.height / dpr / rect.height;
    const x = (ev.clientX - rect.left) * scaleX;
    const y = (ev.clientY - rect.top) * scaleY;
    const r = seekTap(puzzle, x, y);
    if (r.result === 'found') {
      hintSpot = null;
      ctx.sfx?.('coin');
      const gp = groupProgress(puzzle, r.group);
      ctx.toast(gp.found === gp.total
        ? `Все предметы: ${r.group.label}!`
        : `${r.group.label}: ${gp.found} из ${gp.total}!`);
      draw();
      if (isSeekSolved(puzzle)) finish();
    } else if (r.result === 'decoy' || r.result === 'empty') {
      missFlash = { x, y, until: Date.now() + 350 };
      ctx.sfx?.('tap');
      draw();
      setTimeout(() => { missFlash = null; draw(); }, 380);
    }
  }
  canvas.addEventListener('pointerdown', onTap);

  function onKey(ev) {
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
        title: '🧺 Всё найдено!',
        subtitle: `«${level.name}» — промахов: ${puzzle.misses}`,
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
    g.clearRect(0, 0, W, H);

    // Фон сцены
    if (bgImage) {
      g.drawImage(bgImage, 0, 0, W, H);
    } else {
      const grad = g.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#54452f');
      grad.addColorStop(1, '#3a2f20');
      g.fillStyle = grad;
      g.fillRect(0, 0, W, H);
    }

    // Лёгкое виньетирование для глубины
    const vig = g.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, W * 0.75);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(10,6,3,0.35)');
    g.fillStyle = vig;
    g.fillRect(0, 0, W, H);

    // Предметы не дорисовываем: они уже есть в иллюстрации.
    // Найденное — мягкое зелёное кольцо, подсказка — янтарный пунктир.
    for (const group of level.groups) {
      group.spots.forEach((s, i) => {
        const isFound = puzzle.found.has(`${group.id}:${i}`);
        if (isFound) {
          g.strokeStyle = 'rgba(143, 209, 139, 0.9)';
          g.lineWidth = 4;
          g.beginPath();
          g.arc(s.x, s.y, s.r * 0.9, 0, Math.PI * 2);
          g.stroke();
          g.fillStyle = 'rgba(143, 209, 139, 0.95)';
          g.font = 'bold 20px sans-serif';
          g.textAlign = 'center';
          g.textBaseline = 'middle';
          g.shadowColor = 'rgba(0,0,0,0.6)';
          g.shadowBlur = 4;
          g.fillText('✓', s.x, s.y);
          g.shadowBlur = 0;
        }
        if (hintSpot && Math.hypot(s.x - hintSpot.x, s.y - hintSpot.y) < 1) {
          g.strokeStyle = 'rgba(255, 226, 138, 0.95)';
          g.lineWidth = 4;
          g.setLineDash([8, 6]);
          g.beginPath();
          g.arc(s.x, s.y, s.r * 1.2, 0, Math.PI * 2);
          g.stroke();
          g.setLineDash([]);
        }
      });
    }

    // Вспышка промаха
    if (missFlash) {
      g.fillStyle = 'rgba(232, 138, 122, 0.35)';
      g.beginPath();
      g.arc(missFlash.x, missFlash.y, 26, 0, Math.PI * 2);
      g.fill();
    }

    // Список целей со счётчиками «2 из 8»
    targetList.innerHTML = '';
    const pr = seekProgress(puzzle);
    for (const g of pr.groups) {
      const done = g.found === g.total;
      const row = document.createElement('div');
      row.innerHTML = `${done ? '✅' : '🔍'} ${g.label} — <b>${g.found} из ${g.total}</b>`;
      row.style.cssText = `font-size:15px;${done ? 'opacity:0.6;text-decoration:line-through' : ''}`;
      targetList.appendChild(row);
    }

    statusEl.innerHTML =
      `🔍 Всего найдено: <b>${pr.found} из ${pr.total}</b> &nbsp; <span class="muted">промахи: ${puzzle.misses}</span>` +
      `<div class="muted" style="font-size:13px">Подсказки: ${hintsUsed}</div>`;
  }

  draw();

  return () => {
    window.removeEventListener('keydown', onKey);
    canvas.removeEventListener('pointerdown', onTap);
  };
}
