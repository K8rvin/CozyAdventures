// Мастерская уровней: редактор «Света и фонариков» + проверка решателем.
// Уровни сохраняются в state.customPuzzles и играются как обычные.
import { createPuzzle, traceLight } from '../core/puzzle.js';
import { validateLevel } from '../core/solver.js';
import { header, showOverlay } from './common.js';

const CELL = 56;

const PALETTE = [
  { type: 'source', icon: '✨', label: 'Светлячок (повторный тап — повернуть)' },
  { type: 'mirror', icon: '🪞', label: 'Зеркало (тап — сменить ориентацию)' },
  { type: 'lantern', icon: '🏮', label: 'Фонарь' },
  { type: 'moth', icon: '🦋', label: 'Моль' },
  { type: 'wall', icon: '🌑', label: 'Тень' },
  { type: 'erase', icon: '🧹', label: 'Стереть' },
];

// --- Список мастерской ---

export function renderWorkshop(container, ctx) {
  const { state } = ctx;
  container.appendChild(header(ctx, 'Мастерская уровней', 'Создавай свои загадки — решатель проверит их честность'));

  const seekBtn = document.createElement('button');
  seekBtn.textContent = '🔍 Редактор искалок';
  seekBtn.addEventListener('click', () => ctx.go('seekeditor', {}));
  const newBtn = document.createElement('button');
  newBtn.textContent = '🪞 Новая загадка со светом';
  newBtn.style.marginLeft = '8px';
  newBtn.addEventListener('click', () => ctx.go('editor', {}));
  const panel = document.createElement('div');
  panel.className = 'panel';
  panel.append(seekBtn, newBtn);
  container.appendChild(panel);

  const list = document.createElement('div');
  list.className = 'list';
  if (state.customPuzzles.length === 0) {
    list.innerHTML = '<div class="muted panel">Пока пусто. Нажми «Новая загадка со светом» и собери свою!</div>';
  }
  for (const p of state.customPuzzles) {
    const row = document.createElement('div');
    row.className = 'row';
    const done = !!state.puzzlesDone[p.id];
    row.innerHTML = `
      <span class="icon">${done ? '🏮' : '🛠️'}</span>
      <span class="grow">
        <div class="name">${p.name}</div>
        <div class="desc">Сетка ${p.grid[0]}×${p.grid[1]} · объектов: ${p.objects.length}</div>
      </span>`;
    const play = document.createElement('button');
    play.className = 'small';
    play.textContent = 'Играть';
    play.addEventListener('click', () => ctx.go('puzzle', { id: p.id }));
    const edit = document.createElement('button');
    edit.className = 'small';
    edit.textContent = 'Править';
    edit.addEventListener('click', () => ctx.go('editor', { id: p.id }));
    const del = document.createElement('button');
    del.className = 'small ghost';
    del.textContent = '🗑️';
    del.addEventListener('click', () => {
      if (confirm(`Удалить уровень «${p.name}»?`)) {
        state.customPuzzles = state.customPuzzles.filter((x) => x.id !== p.id);
        ctx.save();
        rerender();
      }
    });
    row.append(play, edit, del);
    list.appendChild(row);
  }
  container.appendChild(list);

  function rerender() {
    container.innerHTML = '';
    renderWorkshop(container, ctx);
  }
}

// --- Редактор ---

export function renderEditor(container, ctx, params) {
  const { state } = ctx;
  const existing = params.id ? state.customPuzzles.find((p) => p.id === params.id) : null;

  let name = existing?.name || 'Моя загадка';
  let gw = existing?.grid?.[0] || 6;
  let gh = existing?.grid?.[1] || 6;
  let objects = existing ? existing.objects.map((o) => ({ ...o, pos: [...o.pos] })) : [];
  let tool = 'mirror';

  container.appendChild(header(ctx, existing ? 'Правка загадки' : 'Новая загадка', 'Механика «Свет и фонарики»', 'workshop'));

  // Настройки
  const settings = document.createElement('div');
  settings.className = 'panel';
  settings.style.display = 'flex';
  settings.style.flexWrap = 'wrap';
  settings.style.gap = '10px';
  settings.style.alignItems = 'center';

  const nameInput = document.createElement('input');
  nameInput.value = name;
  nameInput.placeholder = 'Название уровня';
  nameInput.style.cssText = 'font:inherit;padding:8px 12px;border-radius:10px;border:2px solid #6b553a;background:#241b12;color:#f3e6cf;min-width:180px';
  nameInput.addEventListener('input', () => { name = nameInput.value; });

  const mkSize = (label, val, fn) => {
    const wrap = document.createElement('span');
    wrap.className = 'muted';
    wrap.textContent = `${label}: `;
    const sel = document.createElement('select');
    sel.style.cssText = 'font:inherit;padding:6px;border-radius:8px;background:#241b12;color:#f3e6cf;border:2px solid #6b553a';
    for (let i = 4; i <= 10; i++) {
      const o = document.createElement('option');
      o.value = i; o.textContent = i;
      if (i === val) o.selected = true;
      sel.appendChild(o);
    }
    sel.addEventListener('change', () => fn(Number(sel.value)));
    wrap.appendChild(sel);
    return wrap;
  };
  settings.append(
    nameInput,
    mkSize('Ширина', gw, (v) => { gw = v; clip(); draw(); }),
    mkSize('Высота', gh, (v) => { gh = v; clip(); draw(); }),
  );
  container.appendChild(settings);

  // Палитра
  const palette = document.createElement('div');
  palette.className = 'panel';
  palette.style.display = 'flex';
  palette.style.flexWrap = 'wrap';
  palette.style.gap = '8px';
  for (const p of PALETTE) {
    const b = document.createElement('button');
    b.className = 'small' + (tool === p.type ? ' primary' : '');
    b.innerHTML = `${p.icon} ${p.label.split(' (')[0]}`;
    b.title = p.label;
    b.addEventListener('click', () => {
      tool = p.type;
      palette.querySelectorAll('button').forEach((x) => x.classList.remove('primary'));
      b.classList.add('primary');
    });
    palette.appendChild(b);
  }
  container.appendChild(palette);

  // Холст
  const canvasBox = document.createElement('div');
  canvasBox.className = 'puzzle-canvas-box';
  canvasBox.style.display = 'inline-block';
  const canvas = document.createElement('canvas');
  canvas.className = 'game';
  canvasBox.appendChild(canvas);
  container.appendChild(canvasBox);

  // Действия
  const actions = document.createElement('div');
  actions.className = 'panel mt';
  actions.style.display = 'flex';
  actions.style.flexWrap = 'wrap';
  actions.style.gap = '8px';
  const checkBtn = document.createElement('button');
  checkBtn.textContent = '🔍 Проверить решателем';
  const saveBtn = document.createElement('button');
  saveBtn.className = 'primary';
  saveBtn.textContent = '💾 Сохранить в мастерскую';
  const exportBtn = document.createElement('button');
  exportBtn.textContent = '📤 Экспорт JSON';
  const importBtn = document.createElement('button');
  importBtn.textContent = '📥 Импорт JSON';
  actions.append(checkBtn, saveBtn, exportBtn, importBtn);
  container.appendChild(actions);

  const resultBox = document.createElement('div');
  container.appendChild(resultBox);

  function currentLevel() {
    return {
      id: existing?.id || `custom_${Date.now()}`,
      world: 'custom', name: name || 'Без названия', difficulty: 1,
      grid: [gw, gh],
      objects: objects.map((o) => ({ ...o })),
      rewards: [{ type: 'coins', amount: 15 }],
      intro: 'Уровень из мастерской.',
    };
  }

  function clip() {
    objects = objects.filter((o) => o.pos[0] < gw && o.pos[1] < gh);
  }

  function validate() {
    const level = currentLevel();
    const problems = [];
    if (!level.objects.some((o) => o.type === 'source')) problems.push('Нет светлячка — свету неоткуда взяться.');
    if (!level.objects.some((o) => o.type === 'lantern')) problems.push('Нет ни одного фонаря — некого зажигать.');
    const v = validateLevel(level);
    resultBox.innerHTML = '';
    const verdict = problems.length === 0 && v.solvable
      ? `✅ Уровень решаем! Найдено решений: <b>${v.solutionCount}</b>.`
      : '❌ Уровень пока не готов.';
    const details = [
      ...problems.map((p) => `⚠️ ${p}`),
      ...(!v.solvable && problems.length === 0 ? ['⚠️ Решатель не нашёл ни одной комбинации поворотов зеркал.'] : []),
    ].join('<br>');
    const div = document.createElement('div');
    div.className = 'panel mt';
    div.innerHTML = `<div>${verdict}</div>${details ? `<div class="warn mt" style="font-size:14px">${details}</div>` : ''}`;
    resultBox.appendChild(div);
    return problems.length === 0 && v.solvable;
  }

  checkBtn.addEventListener('click', () => { ctx.sfx?.('hint'); validate(); });

  saveBtn.addEventListener('click', () => {
    if (!validate()) { ctx.toast('Сначала сделай уровень решаемым.'); return; }
    const level = currentLevel();
    if (existing) {
      const i = state.customPuzzles.findIndex((p) => p.id === existing.id);
      state.customPuzzles[i] = level;
    } else {
      state.customPuzzles.push(level);
    }
    ctx.save();
    ctx.sfx?.('success');
    ctx.toast(`«${level.name}» сохранён в мастерской!`);
    ctx.go('workshop');
  });

  exportBtn.addEventListener('click', async () => {
    const json = JSON.stringify(currentLevel(), null, 2);
    try {
      await navigator.clipboard.writeText(json);
      ctx.toast('JSON уровня скопирован в буфер обмена.');
    } catch {
      showOverlay(ctx, {
        title: '📤 Экспорт',
        subtitle: 'Скопируй вручную:',
        rewards: [],
        buttons: [{ label: 'Закрыть', primary: true, onClick: () => {} }],
      });
      const ta = document.createElement('textarea');
      ta.value = json;
      ta.style.cssText = 'width:100%;height:160px;background:#241b12;color:#f3e6cf;border-radius:8px;margin-top:10px';
      document.querySelector('.overlay .card')?.appendChild(ta);
    }
  });

  importBtn.addEventListener('click', () => {
    const overlay = showOverlay(ctx, {
      title: '📥 Импорт уровня',
      subtitle: 'Вставь JSON уровня:',
      rewards: [],
      buttons: [],
    });
    const card = overlay.querySelector('.card');
    const ta = document.createElement('textarea');
    ta.style.cssText = 'width:100%;height:160px;background:#241b12;color:#f3e6cf;border-radius:8px;margin:10px 0';
    const ok = document.createElement('button');
    ok.className = 'primary';
    ok.textContent = 'Импортировать';
    ok.addEventListener('click', () => {
      try {
        const data = JSON.parse(ta.value);
        if (!data.grid || !Array.isArray(data.objects)) throw new Error('нет grid/objects');
        name = data.name || name;
        [gw, gh] = data.grid;
        objects = data.objects.map((o) => ({ ...o }));
        nameInput.value = name;
        overlay.remove();
        ctx.toast('Уровень загружен в редактор. Проверь его решателем!');
        clip();
        draw();
      } catch (e) {
        ctx.toast(`Не похоже на уровень: ${e.message}`);
      }
    });
    const cancel = document.createElement('button');
    cancel.textContent = 'Отмена';
    cancel.addEventListener('click', () => overlay.remove());
    card.append(ta, ok, ' ', cancel);
  });

  function onTap(ev) {
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / 1 / rect.width; // dpr=1 для редактора
    const x = Math.floor((ev.clientX - rect.left) * scale / CELL);
    const y = Math.floor((ev.clientY - rect.top) * scale / CELL);
    if (x < 0 || y < 0 || x >= gw || y >= gh) return;
    const idx = objects.findIndex((o) => o.pos[0] === x && o.pos[1] === y);
    if (tool === 'erase') {
      if (idx >= 0) objects.splice(idx, 1);
    } else if (idx >= 0) {
      const o = objects[idx];
      if (o.type === 'source') o.dir = ((o.dir ?? 1) + 1) % 4;
      else if (o.type === 'mirror') o.orient = o.orient === 0 ? 1 : 0;
    } else if (tool === 'source') {
      objects.push({ type: 'source', pos: [x, y], dir: 1 });
    } else if (tool === 'mirror') {
      objects.push({ type: 'mirror', pos: [x, y], orient: 0 });
    } else {
      objects.push({ type: tool, pos: [x, y] });
    }
    ctx.sfx?.('tap');
    draw();
  }
  canvas.addEventListener('pointerdown', onTap);

  function draw() {
    const dpr = 1;
    canvas.width = gw * CELL;
    canvas.height = gh * CELL;
    canvas.style.width = `${gw * CELL}px`;
    canvas.style.height = `${gh * CELL}px`;
    const g = canvas.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (let y = 0; y < gh; y++) {
      for (let x = 0; x < gw; x++) {
        g.fillStyle = (x + y) % 2 === 0 ? '#3a5232' : '#425c38';
        g.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
    }
    // Превью света
    const preview = createPuzzle(currentLevel());
    const { beams } = traceLight(preview);
    g.lineCap = 'round';
    g.strokeStyle = 'rgba(255, 226, 138, 0.5)';
    g.lineWidth = 4;
    for (const b of beams) {
      g.beginPath();
      g.moveTo(b.from[0] * CELL + CELL / 2, b.from[1] * CELL + CELL / 2);
      g.lineTo(b.to[0] * CELL + CELL / 2, b.to[1] * CELL + CELL / 2);
      g.stroke();
    }
    // Объекты
    for (const o of objects) {
      const cx = o.pos[0] * CELL + CELL / 2;
      const cy = o.pos[1] * CELL + CELL / 2;
      const emoji = (e, size = CELL * 0.6) => {
        g.font = `${size}px "Segoe UI Emoji", sans-serif`;
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillText(e, cx, cy);
      };
      if (o.type === 'source') {
        emoji('✨');
        const dirs = ['↑', '→', '↓', '←'];
        g.fillStyle = '#fff2be';
        g.font = `bold ${CELL * 0.3}px sans-serif`;
        g.fillText(dirs[o.dir ?? 1], cx + CELL * 0.28, cy - CELL * 0.28);
      } else if (o.type === 'mirror') {
        g.save();
        g.translate(cx, cy);
        g.rotate(o.orient === 0 ? Math.PI / 4 : -Math.PI / 4);
        g.fillStyle = '#cfe8ff';
        g.fillRect(-CELL * 0.3, -3, CELL * 0.6, 5);
        g.restore();
        emoji('🪞', CELL * 0.3);
      } else if (o.type === 'lantern') emoji('🏮');
      else if (o.type === 'moth') emoji('🦋');
      else if (o.type === 'wall') emoji('🌑');
    }
  }

  draw();

  return () => canvas.removeEventListener('pointerdown', onTap);
}
