// Редактор хотспотов искалок: подвинуть, расширить/сузить области поиска.
// Правки сохраняются в игру и применяются к уровням; можно экспортировать JSON.
import { findPuzzle, applySeekOverrides, saveSeekOverride, resetSeekOverride, loadSeekOverrides } from '../core/state.js';
import { SEEK_PUZZLES } from '../data/puzzlesSeek.js';
import { header } from './common.js';
import { seekTargets, validateSeekLevel } from '../core/seekPuzzle.js';

export function renderSeekEditorList(container, ctx) {
  container.appendChild(header(ctx, 'Редактор искалок', 'Выбери уровень — подвинуть или изменить области', 'workshop'));

  // Экспорт ВСЕХ правок разом (для вшивания в данные игры)
  const ovCount = Object.keys(loadSeekOverrides()).length;
  if (ovCount > 0) {
    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.innerHTML = `<div class="muted" style="font-size:13px">Правок накоплено: <b>${ovCount}</b> — хранятся отдельно от сохранения, новая игра их не сотрёт.</div>`;
    const expBtn = document.createElement('button');
    expBtn.className = 'small primary';
    expBtn.textContent = '📦 Экспорт всех правок';
    expBtn.addEventListener('click', async () => {
      const json = JSON.stringify(loadSeekOverrides(), null, 2);
      try {
        await navigator.clipboard.writeText(json);
        ctx.toast('Все правки в буфере — пришли разработчику, вшьём в данные игры.');
      } catch {
        console.log(json);
        ctx.toast('Не удалось скопировать — JSON в консоли.');
      }
    });
    panel.appendChild(expBtn);
    container.appendChild(panel);
  }
  const list = document.createElement('div');
  list.className = 'list';
  for (const p of SEEK_PUZZLES) {
    const row = document.createElement('div');
    row.className = 'row';
    const hasOverride = !!loadSeekOverrides()[p.id] || !!ctx.state.seekOverrides?.[p.id];
    row.innerHTML = `
      <span class="icon">🔍</span>
      <span class="grow">
        <div class="name">${p.name} ${hasOverride ? '<span class="badge rare">правка</span>' : ''}</div>
        <div class="desc">Групп: ${p.groups.length} · спотов: ${p.groups.reduce((n, g) => n + g.spots.length, 0)}</div>
      </span>`;
    const btn = document.createElement('button');
    btn.className = 'small';
    btn.textContent = 'Править';
    btn.addEventListener('click', () => ctx.go('seekeditor', { id: p.id }));
    row.appendChild(btn);
    list.appendChild(row);
  }
  container.appendChild(list);
}

export function renderSeekEditor(container, ctx, params) {
  const raw = SEEK_PUZZLES.find((p) => p.id === params.id);
  if (!raw) { ctx.go('workshop'); return; }
  const base = applySeekOverrides(ctx.state, raw);
  // Рабочая копия групп
  let groups = JSON.parse(JSON.stringify(base.groups));
  let selected = null; // { groupId, spotIndex }
  let drag = null;

  container.appendChild(header(ctx, `Правка: ${raw.name}`,
    'Тяни круги, чтобы двигать. +/− меняет радиус (или колесо мыши).', 'workshop'));

  const [W, H] = raw.sceneSize || [1000, 650];
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
  canvas.style.touchAction = 'none';
  canvasBox.appendChild(canvas);
  wrap.appendChild(canvasBox);

  const side = document.createElement('div');
  side.className = 'puzzle-side';

  const infoEl = document.createElement('div');
  infoEl.className = 'puzzle-status';
  side.appendChild(infoEl);

  const radiusRow = document.createElement('div');
  radiusRow.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:10px;flex-wrap:wrap';
  const minus = mkBtn('➖ Радиус', () => resize(-4));
  const plus = mkBtn('➕ Радиус', () => resize(4));
  radiusRow.append(minus, plus);

  // Переключение между экземплярами вида: ‹ 2 из 5 ›
  const navRow = document.createElement('div');
  navRow.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:10px';
  const navPrev = mkBtn('‹', () => cycleSpot(-1));
  const navLabel = document.createElement('span');
  navLabel.className = 'muted';
  navLabel.style.fontSize = '14px';
  navLabel.textContent = '—';
  const navNext = mkBtn('›', () => cycleSpot(1));
  navRow.append(navPrev, navLabel, navNext);
  radiusRow.append(navRow);

  // Добавить/удалить кружки
  const addModeBtn = mkBtn('➕ Кружок', toggleAddMode);
  const delBtn = mkBtn('🗑 Удалить', deleteSpot);
  radiusRow.append(addModeBtn, delBtn);
  side.appendChild(radiusRow);

  const actions = document.createElement('div');
  actions.className = 'puzzle-controls';
  const saveBtn = mkBtn('💾 Сохранить', () => {
    saveSeekOverride(ctx.state, raw.id, groups);
    ctx.save();
    ctx.sfx?.('success');
    ctx.toast('Правки сохранены и уже действуют в игре.');
    refreshInfo();
  });
  const resetBtn = mkBtn('🗑️ К исходным', () => {
    if (!confirm('Сбросить правки этого уровня к исходным координатам?')) return;
    resetSeekOverride(ctx.state, raw.id);
    ctx.save();
    groups = JSON.parse(JSON.stringify(SEEK_PUZZLES.find((p) => p.id === raw.id).groups));
    selected = null;
    ctx.toast('Координаты исходные.');
    draw();
    refreshInfo();
  });
  const exportBtn = mkBtn('📤 JSON', exportJson);
  actions.append(saveBtn, resetBtn, exportBtn);
  side.appendChild(actions);

  const groupsList = document.createElement('div');
  groupsList.className = 'panel mt';
  side.appendChild(groupsList);

  wrap.appendChild(side);
  container.appendChild(wrap);

  function mkBtn(label, fn) {
    const b = document.createElement('button');
    b.className = 'small';
    b.innerHTML = label;
    b.addEventListener('click', fn);
    return b;
  }

  // Фон уровня (та же цепочка, что в игре)
  let bgImage = null;
  if (typeof Image !== 'undefined') {
    const bgName = raw.bg || `seek_${raw.world}`;
    const candidates = [
      `assets/${bgName}_web.jpg`, `assets/${bgName}.jfif`,
      `assets/${bgName}.png`, `assets/${bgName}.svg`,
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

  function eventPos(ev) {
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / dpr / rect.width;
    const sy = canvas.height / dpr / rect.height;
    return [(ev.clientX - rect.left) * sx, (ev.clientY - rect.top) * sy];
  }

  function spotAt(x, y) {
    // выбираем ближайший спот в радиусе (сверху вниз)
    let best = null;
    let bestD = Infinity;
    for (const g of groups) {
      g.spots.forEach((s, i) => {
        const d = Math.hypot(x - s.x, y - s.y);
        if (d < s.r && d < bestD) { bestD = d; best = { groupId: g.id, spotIndex: i }; }
      });
    }
    return best;
  }

  let addMode = false;

  function toggleAddMode() {
    addMode = !addMode;
    addModeBtn.classList.toggle('primary', addMode);
    ctx.toast(addMode
      ? 'Режим добавления: тап по сцене поставит новый кружок в выбранный вид.'
      : 'Режим добавления выключен.');
    if (addMode && !selected) {
      ctx.toast('Сначала выбери вид предметов в списке справа.');
    }
  }

  function deleteSpot() {
    if (!selected) { ctx.toast('Сначала выбери область тапом.'); return; }
    const gi = groups.findIndex((g) => g.id === selected.groupId);
    if (gi < 0) return;
    const g = groups[gi];
    if (g.spots.length <= 1) {
      if (!confirm(`Удалить последний кружок — вид «${g.label}» исчезнет из уровня. Продолжить?`)) return;
      groups.splice(gi, 1);
    } else {
      g.spots.splice(selected.spotIndex, 1);
    }
    selected = null;
    ctx.sfx?.('tap');
    draw();
    refreshInfo();
  }

  function cycleSpot(dir) {
    if (!selected) { ctx.toast('Сначала выбери вид в списке.'); return; }
    const g = groups.find((g2) => g2.id === selected.groupId);
    if (!g) return;
    const n = g.spots.length;
    selected = { groupId: g.id, spotIndex: ((selected.spotIndex + dir) % n + n) % n };
    ctx.sfx?.('tap');
    draw();
    refreshInfo();
  }

  canvas.addEventListener('pointerdown', (ev) => {
    const [x, y] = eventPos(ev);
    const hit = spotAt(x, y);
    // Режим добавления: тап в пустое место — новый кружок в выбранную группу
    if (addMode && !hit) {
      if (!selected) { ctx.toast('Сначала выбери вид предметов в списке справа.'); return; }
      const g = groups.find((g2) => g2.id === selected.groupId);
      if (!g) return;
      g.spots.push({ x: Math.round(x), y: Math.round(y), r: 42 });
      selected = { groupId: g.id, spotIndex: g.spots.length - 1 };
      ctx.sfx?.('coin');
      draw();
      refreshInfo();
      return;
    }
    selected = hit;
    if (hit) {
      drag = { startX: x, startY: y, moved: false };
      canvas.setPointerCapture?.(ev.pointerId);
    }
    draw();
    refreshInfo();
  });

  canvas.addEventListener('pointermove', (ev) => {
    if (!drag || !selected) return;
    const [x, y] = eventPos(ev);
    if (Math.hypot(x - drag.startX, y - drag.startY) > 3) drag.moved = true;
    if (drag.moved) {
      const g = groups.find((g2) => g2.id === selected.groupId);
      const s = g.spots[selected.spotIndex];
      s.x = Math.round(Math.max(0, Math.min(W, x)));
      s.y = Math.round(Math.max(0, Math.min(H, y)));
      draw();
      refreshInfo();
    }
  });

  canvas.addEventListener('pointerup', () => { drag = null; });

  canvas.addEventListener('wheel', (ev) => {
    if (!selected) return;
    ev.preventDefault();
    resize(ev.deltaY < 0 ? 4 : -4);
  }, { passive: false });

  function resize(delta) {
    if (!selected) { ctx.toast('Сначала выбери область тапом.'); return; }
    const g = groups.find((g2) => g2.id === selected.groupId);
    const s = g.spots[selected.spotIndex];
    s.r = Math.max(12, Math.min(120, s.r + delta));
    ctx.sfx?.('tap');
    draw();
    refreshInfo();
  }

  function refreshInfo() {
    const probe = { ...raw, groups };
    const v = validateSeekLevel(probe);
    let sel = 'Тапни круг, чтобы выбрать область.';
    if (selected) {
      const g = groups.find((g2) => g2.id === selected.groupId);
      if (g) {
        const s = g.spots[selected.spotIndex];
        sel = `Выбрано: <b>${g.label}</b> №${selected.spotIndex + 1} из ${g.spots.length} · x=${s.x} y=${s.y} r=${s.r}`;
        navLabel.textContent = `№${selected.spotIndex + 1} из ${g.spots.length}`;
      }
    } else {
      navLabel.textContent = '—';
    }
    infoEl.innerHTML = sel +
      `<div class="muted" style="font-size:13px">${v.ok ? '✅ Уровень валиден' : '⚠️ ' + v.problems.join('; ')}</div>`;
    // Список групп со счётчиками
    groupsList.innerHTML = '';
    for (const g of groups) {
      const row = document.createElement('div');
      row.style.cssText = `font-size:13px;padding:3px 6px;border-radius:6px;cursor:pointer;${
        selected?.groupId === g.id ? 'background:rgba(255,202,122,0.15)' : ''}`;
      row.textContent = `${g.label} — ${g.spots.length} шт.`;
      row.addEventListener('click', () => {
        // При повторном тапе по виду — следующий экземпляр, при первом — первый
        if (selected?.groupId === g.id && g.spots.length > 1) {
          cycleSpot(1);
          return;
        }
        selected = { groupId: g.id, spotIndex: 0 };
        draw();
        refreshInfo();
      });
      groupsList.appendChild(row);
    }
  }

  function draw() {
    const g2d = canvas.getContext('2d');
    g2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    g2d.clearRect(0, 0, W, H);
    if (bgImage) g2d.drawImage(bgImage, 0, 0, W, H);
    else {
      g2d.fillStyle = '#3a2f20';
      g2d.fillRect(0, 0, W, H);
    }
    const palette = ['#ffd98a', '#8fd18b', '#a8d8ff', '#d3a8ff', '#ff9a7a', '#7adfd1', '#f3a6c8', '#c9e88a'];
    groups.forEach((g, gi) => {
      const color = palette[gi % palette.length];
      g.spots.forEach((s, i) => {
        const isSel = selected && selected.groupId === g.id && selected.spotIndex === i;
        g2d.strokeStyle = color;
        g2d.lineWidth = isSel ? 4 : 2;
        g2d.setLineDash(isSel ? [] : [6, 5]);
        g2d.beginPath();
        g2d.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        g2d.stroke();
        g2d.setLineDash([]);
        if (isSel) {
          g2d.fillStyle = color;
          g2d.beginPath();
          g2d.arc(s.x, s.y, 5, 0, Math.PI * 2);
          g2d.fill();
        }
        // Номера кружков внутри выбранной группы
        if (selected && selected.groupId === g.id) {
          g2d.fillStyle = color;
          g2d.font = 'bold 13px sans-serif';
          g2d.textAlign = 'center';
          g2d.textBaseline = 'middle';
          g2d.shadowColor = 'rgba(0,0,0,0.8)';
          g2d.shadowBlur = 3;
          g2d.fillText(String(i + 1), s.x, s.y - s.r - 10);
          g2d.shadowBlur = 0;
        }
      });
    });
  }

  async function exportJson() {
    const json = JSON.stringify(groups, null, 2);
    try {
      await navigator.clipboard.writeText(json);
      ctx.toast('JSON групп скопирован — пришли разработчику, вшьём в игру.');
    } catch {
      ctx.toast('Не удалось скопировать — смотри консоль.');
      console.log(json);
    }
  }

  draw();
  refreshInfo();
}
