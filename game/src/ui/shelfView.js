// Экран головоломки «Полки и товары».
import {
  createShelfPuzzle, placeItem, removeItem, moveItem, undoShelf, resetShelf,
  violations, isShelfSolved, shelfCells, shelfHint, TAG_LABEL,
} from '../core/shelfPuzzle.js';
import { completePuzzle, nextPuzzle } from '../core/state.js';
import { header, showOverlay , puzzleSkipButton } from './common.js';

export function renderShelfPuzzle(container, ctx, level) {
  // Крупные клетки: целимся в ширину поля ~500px, маленькие сетки — крупнее
  const CELL = Math.max(80, Math.min(120, Math.floor(500 / level.grid[0])));
  const puzzle = createShelfPuzzle(level);
  let selectedItem = null; // id предмета из лотка
  let hintsUsed = 0;
  let hintMark = null; // { itemId, pos }
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
  canvas.style.touchAction = 'none'; // перетаскивание без прокрутки страницы
  canvasBox.appendChild(canvas);
  // Левая колонка: поле + лоток ПОД полками — удобнее перетаскивать
  const leftCol = document.createElement('div');
  leftCol.style.cssText = 'display:flex;flex-direction:column;gap:10px;flex:0 1 auto;min-width:0';
  leftCol.appendChild(canvasBox);

  // Лоток с товарами — под полем
  const trayPanel = document.createElement('div');
  trayPanel.className = 'panel';
  trayPanel.style.padding = '10px 14px';
  const trayLabel = document.createElement('div');
  trayLabel.className = 'muted';
  trayLabel.textContent = 'Товары: тапни, затем клетку — или просто перетащи на полку';
  trayLabel.style.fontSize = '13px';
  trayLabel.style.marginBottom = '8px';
  trayPanel.appendChild(trayLabel);
  const tray = document.createElement('div');
  tray.style.display = 'flex';
  tray.style.flexWrap = 'wrap';
  tray.style.gap = '10px';
  trayPanel.appendChild(tray);
  leftCol.appendChild(trayPanel);
  wrap.appendChild(leftCol);

  const side = document.createElement('div');
  side.className = 'puzzle-side';
  const intro = document.createElement('div');
  intro.className = 'intro-text';
  intro.textContent = level.intro;
  side.appendChild(intro);

  // Правила уровня — всегда видимы
  const rulesBox = document.createElement('div');
  rulesBox.className = 'panel';
  rulesBox.style.padding = '10px 14px';
  rulesBox.innerHTML = `<div class="desc" style="line-height:1.8">${rulesText(level)}</div>`;
  side.appendChild(rulesBox);

  const statusEl = document.createElement('div');
  statusEl.className = 'puzzle-status';
  side.appendChild(statusEl);

  const controls = document.createElement('div');
  controls.className = 'puzzle-controls';
  controls.style.marginTop = '10px';
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
    if (undoShelf(puzzle)) { hintMark = null; ctx.sfx?.('tap'); draw(); }
  }
  function doReset() {
    if (finished) return;
    resetShelf(puzzle);
    selectedItem = null;
    hintMark = null;
    ctx.sfx?.('tap');
    draw();
  }
  function doHint() {
    if (finished) return;
    const h = shelfHint(puzzle);
    ctx.sfx?.('hint');
    if (h.type === 'place' || h.type === 'move') {
      hintsUsed += 1;
      hintMark = { itemId: h.itemId, pos: h.pos };
      const it = level.items.find((i) => i.id === h.itemId);
      ctx.toast(`Кот-хранитель кивает: «${it?.name}» — вот сюда.`);
      draw();
    } else if (h.type === 'remove') {
      hintsUsed += 1;
      const it = level.items.find((i) => i.id === h.itemId);
      hintMark = { itemId: h.itemId, pos: puzzle.placement[h.itemId] };
      ctx.toast(h.text || `Убери «${it?.name}» отсюда.`);
      draw();
    } else if (h.type === 'already') {
      ctx.toast('Всё уже стоит правильно!');
    } else {
      ctx.toast('Хм, этот уровень не решается. Скажи хозяину лавки!');
    }
  }

  function onTap(ev) {
    if (finished) return;
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / dpr / rect.width;
    const x = Math.floor((ev.clientX - rect.left) * scale / CELL);
    const y = Math.floor((ev.clientY - rect.top) * scale / CELL);

    const occupantId = Object.entries(puzzle.placement)
      .find(([, pos]) => pos && pos[0] === x && pos[1] === y)?.[0];
    if (occupantId) {
      // Снять предмет обратно в лоток
      removeItem(puzzle, occupantId);
      selectedItem = occupantId;
      hintMark = null;
      ctx.sfx?.('tap');
      draw();
      return;
    }
    if (selectedItem) {
      const r = placeItem(puzzle, selectedItem, x, y);
      if (r.ok) {
        const placed = selectedItem;
        selectedItem = null;
        hintMark = null;
        ctx.sfx?.('rotate');
        draw();
        if (isShelfSolved(puzzle)) finish();
      } else {
        ctx.toast(r.error);
      }
    }
  }
  // --- Перетаскивание предметов (тап-управление сохраняется) ---
  let drag = null; // { itemId, startX, startY, active, ghost, hover:[x,y]|null }

  function cellFromEvent(ev) {
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / dpr / rect.width;
    const x = Math.floor((ev.clientX - rect.left) * scale / CELL);
    const y = Math.floor((ev.clientY - rect.top) * scale / CELL);
    return (x >= 0 && y >= 0 && x < level.grid[0] && y < level.grid[1]) ? [x, y] : null;
  }

  function startPotentialDrag(ev, itemId) {
    if (finished) return;
    drag = { itemId, startX: ev.clientX, startY: ev.clientY, active: false, ghost: null, hover: null };
  }

  function activateDrag(ev) {
    const it = level.items.find((i) => i.id === drag.itemId);
    if (!it) return;
    const ghost = document.createElement('div');
    ghost.className = 'drag-ghost';
    ghost.textContent = it.icon;
    document.body.appendChild(ghost);
    drag.ghost = ghost;
    drag.active = true;
    selectedItem = null;
    ctx.sfx?.('tap');
  }

  function onPointerMove(ev) {
    if (!drag) return;
    if (!drag.active) {
      const dist = Math.hypot(ev.clientX - drag.startX, ev.clientY - drag.startY);
      if (dist > 8) activateDrag(ev);
      else return;
    }
    drag.ghost.style.transform = `translate(${ev.clientX - 24}px, ${ev.clientY - 24}px)`;
    const cell = cellFromEvent(ev);
    const key = cell ? cell.join(',') : null;
    if ((drag.hover ? drag.hover.join(',') : null) !== key) {
      drag.hover = cell;
      draw();
    }
  }

  function onPointerUp(ev) {
    if (!drag) return;
    const wasActive = drag.active;
    const itemId = drag.itemId;
    const cell = drag.hover;
    if (drag.ghost) drag.ghost.remove();
    drag = null;
    if (!wasActive) return; // это был тап — обрабатывают click/onTap

    const trayRect = tray.getBoundingClientRect();
    const overTray = ev.clientX >= trayRect.left && ev.clientX <= trayRect.right &&
                     ev.clientY >= trayRect.top && ev.clientY <= trayRect.bottom;

    if (cell) {
      const r = moveItem(puzzle, itemId, cell[0], cell[1]);
      if (r.ok) {
        hintMark = null;
        ctx.sfx?.('rotate');
        draw();
        if (isShelfSolved(puzzle)) finish();
      } else {
        ctx.toast(r.error);
        draw();
      }
    } else if (overTray && puzzle.placement[itemId]) {
      removeItem(puzzle, itemId);
      hintMark = null;
      ctx.sfx?.('tap');
      draw();
    } else {
      draw(); // просто отмена перетаскивания
    }
  }

  canvas.addEventListener('pointerdown', (ev) => {
    if (finished) return;
    const cell = cellFromEvent(ev);
    if (cell) {
      const occupantId = Object.entries(puzzle.placement)
        .find(([, pos]) => pos && pos[0] === cell[0] && pos[1] === cell[1])?.[0];
      if (occupantId) { startPotentialDrag(ev, occupantId); return; }
    }
    onTap(ev); // пустая клетка — тап-логика (поставить выбранный)
  });
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);

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
        title: '🏮 Лавка готова к открытию!',
        subtitle: `«${level.name}» — решено`,
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

    // Пол дворика
    for (let y = 0; y < gh; y++) {
      for (let x = 0; x < gw; x++) {
        g.fillStyle = (x + y) % 2 === 0 ? '#4a4038' : '#524840';
        g.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
    }

    // Клетки-полки
    for (const c of level.cells) {
      const px = c.pos[0] * CELL;
      const py = c.pos[1] * CELL;
      if (c.kind === 'shelf') {
        g.fillStyle = '#6b5335';
        g.fillRect(px + 3, py + 3, CELL - 6, CELL - 6);
        g.fillStyle = '#7d6444';
        g.fillRect(px + 3, py + 3, CELL - 6, 8);
      } else if (c.kind === 'light') {
        g.fillStyle = '#6b5335';
        g.fillRect(px + 3, py + 3, CELL - 6, CELL - 6);
        const grad = g.createRadialGradient(
          px + CELL / 2, py + CELL / 2, 4, px + CELL / 2, py + CELL / 2, CELL / 2);
        grad.addColorStop(0, 'rgba(255, 226, 138, 0.5)');
        grad.addColorStop(1, 'rgba(255, 226, 138, 0.05)');
        g.fillStyle = grad;
        g.fillRect(px, py, CELL, CELL);
        g.font = `${CELL * 0.22}px sans-serif`;
        g.textAlign = 'right';
        g.textBaseline = 'top';
        g.fillText('☀️', px + CELL - 4, py + 4);
      } else {
        g.fillStyle = '#33291f';
        g.fillRect(px + 3, py + 3, CELL - 6, CELL - 6);
      }
    }

    // Подсветка клетки под курсором при перетаскивании
    if (drag?.active && drag.hover) {
      g.strokeStyle = 'rgba(255, 202, 122, 0.95)';
      g.lineWidth = 3;
      g.setLineDash([7, 5]);
      g.strokeRect(drag.hover[0] * CELL + 4, drag.hover[1] * CELL + 4, CELL - 8, CELL - 8);
      g.setLineDash([]);
    }

    const v = violations(puzzle);
    const badItems = new Set(v.flatMap((x) => [x.itemA, x.itemB]).filter(Boolean));

    // Расставленные предметы
    for (const [itemId, pos] of Object.entries(puzzle.placement)) {
      if (!pos) continue;
      const it = level.items.find((i) => i.id === itemId);
      const cx = pos[0] * CELL + CELL / 2;
      const cy = pos[1] * CELL + CELL / 2;
      if (badItems.has(itemId)) {
        g.fillStyle = 'rgba(232, 138, 122, 0.3)';
        g.fillRect(pos[0] * CELL + 3, pos[1] * CELL + 3, CELL - 6, CELL - 6);
      }
      if (hintMark && hintMark.itemId === itemId) {
        g.fillStyle = 'rgba(255, 202, 122, 0.35)';
        g.beginPath();
        g.arc(cx, cy, CELL * 0.46, 0, Math.PI * 2);
        g.fill();
      }
      g.font = `${CELL * 0.55}px "Segoe UI Emoji", sans-serif`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      if (drag?.active && drag.itemId === itemId) g.globalAlpha = 0.3;
      g.fillText(it?.icon || '🎁', cx, cy);
      g.globalAlpha = 1;
    }

    // Куда кот кивает (пустая клетка из подсказки)
    if (hintMark && hintMark.pos && !badItems.size) {
      const [hx, hy] = hintMark.pos;
      const occupant = Object.values(puzzle.placement).some((p) => p && p[0] === hx && p[1] === hy);
      if (!occupant) {
        g.strokeStyle = 'rgba(255, 202, 122, 0.8)';
        g.lineWidth = 3;
        g.setLineDash([6, 4]);
        g.strokeRect(hx * CELL + 5, hy * CELL + 5, CELL - 10, CELL - 10);
        g.setLineDash([]);
      }
    }

    // Лоток
    tray.innerHTML = '';
    for (const it of level.items) {
      if (puzzle.placement[it.id]) continue;
      const b = document.createElement('button');
      b.className = 'small' + (selectedItem === it.id ? ' primary' : '');
      b.style.fontSize = '16px';
      b.style.padding = '8px 12px';
      b.innerHTML = `${it.icon} ${it.name}`;
      b.title = it.tags.join(', ');
      b.addEventListener('pointerdown', (ev) => startPotentialDrag(ev, it.id));
      b.addEventListener('click', () => {
        selectedItem = selectedItem === it.id ? null : it.id;
        ctx.sfx?.('tap');
        draw();
      });
      tray.appendChild(b);
    }
    if (tray.children.length === 0) {
      tray.innerHTML = '<span class="muted">Все товары на полках</span>';
    }

    // Статус
    const placedCount = level.items.filter((i) => puzzle.placement[i.id]).length;
    statusEl.innerHTML =
      `📦 Товары: <b>${placedCount}/${level.items.length}</b> &nbsp; ` +
      (v.length > 0
        ? `<span class="warn">${v[0].text}${v.length > 1 ? ` (+${v.length - 1})` : ''}</span>`
        : placedCount === level.items.length ? '✅ Всё по местам!' : '✅ Порядок') +
      `<div class="muted" style="font-size:13px">Ходы: ${puzzle.moves} · Подсказки: ${hintsUsed}</div>`;
  }

  draw();

  return () => {
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    if (drag?.ghost) drag.ghost.remove();
  };
}

function rulesText(level) {
  const lines = [];
  for (const [a, b] of level.rules.notAdjacent || []) {
    lines.push(`🚫 ${TAG_LABEL[a] || a} — не рядом с «${TAG_LABEL[b] || b}»`);
  }
  for (const [a, b] of level.rules.mustAdjacent || []) {
    lines.push(`🤝 ${TAG_LABEL[a] || a} — рядом с «${TAG_LABEL[b] || b}»`);
  }
  for (const t of level.rules.onLight || []) {
    lines.push(`☀️ ${TAG_LABEL[t] || t} — на свету`);
  }
  return lines.join('<br>');
}
