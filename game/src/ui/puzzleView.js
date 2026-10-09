// Экран головоломки: список уровней и сама игра на Canvas.
import {
  createPuzzle, rotateMirror, undo, reset, traceLight, isSolved, status,
} from '../core/puzzle.js';
import { hint as solverHint } from '../core/solver.js';
import {
  puzzleAvailable, completePuzzle, findPuzzle, ALL_PUZZLES,
  nextPuzzle, firstUnsolvedPuzzle, isDailyPuzzle, dailyPuzzle, todayKey,
} from '../core/state.js';
import { ITEM_BY_ID } from '../data/items.js';
import { renderShelfPuzzle } from './shelfView.js';
import { renderBookPuzzle } from './bookView.js';
import { renderSeekPuzzle } from './seekView.js';
import { renderPathPuzzle } from './pathView.js';
import { renderTeaPuzzle } from './teaView.js';
import { renderMechPuzzle } from './mechView.js';
import { renderCandlePuzzle } from './candleView.js';
import { renderFlowPuzzle } from './flowView.js';
import { renderBrewPuzzle } from './brewView.js';
import { startTutorial } from './tutorial.js';
import { quickNav, puzzleSkipButton } from './common.js';

const WORLD_LABEL = {
  meadow: '🌿 Тихая опушка — свет и фонарики · поиск предметов',
  town: '🏰 Средневековый дворик — полки и товары · поиск предметов',
  attic: '📖 Книжный чердак — восстановление фраз · поиск предметов',
  crossroads: '🌟 Перекрёсток миров — тропинки и чай',
  nm: '🌃 Ночной рынок — поиск предметов',
  sw: '🐸 Сказочные топи — поиск предметов',
  sf: '🎪 Звёздная ярмарка — поиск предметов',
  ash: '🔥 Кузница — поиск предметов',
  cr: '💎 Хрустальные горы — поиск предметов',
  jade: '🎋 Нефритовый сад — поиск предметов',
  deep: '🐚 Подводный грот — поиск предметов',
  mist: '⏳ Туманные часы — поиск предметов',
  brew: '⚗️ Алхимический стол — варка зелий по рецепту',
};

// --- Список уровней ---

export function renderPuzzleList(container, ctx) {
  const { state } = ctx;
  container.appendChild(header(ctx, 'Головоломки лавки', 'Хозяйственные загадки по мирам'));

  let lastWorld = null;
  const firstUnsolved = firstUnsolvedPuzzle(state);
  const list = document.createElement('div');
  list.className = 'list';
  ALL_PUZZLES.forEach((p, i) => {
    if (p.world !== lastWorld) {
      lastWorld = p.world;
      const wh = document.createElement('h3');
      wh.textContent = WORLD_LABEL[p.world] || p.world;
      list.appendChild(wh);
    }
    const available = puzzleAvailable(state, i);
    const done = !!state.puzzlesDone[p.id];
    const row = document.createElement('div');
    row.className = 'row' + (available ? '' : ' locked') + (done ? ' done' : '');
    if (firstUnsolved && p.id === firstUnsolved.id) row.dataset.scrollTarget = '1';
    const stars = '★'.repeat(p.difficulty) + '☆'.repeat(5 - p.difficulty);
    // «Заказ дня ×2» виден только пока бонус не забран сегодня
    const dailyClaimed = state.lastDailyBonus === todayKey();
    const isDaily = available && !done && !dailyClaimed && isDailyPuzzle(state, p.id);
    row.innerHTML = `
      <span class="icon">${available ? (done ? '🏮' : '🧩') : '🔒'}</span>
      <span class="grow">
        <div class="name">${i + 1}. ${p.name} <span class="badge">${stars}</span>${isDaily ? ' <span class="badge new-badge">заказ дня ×2</span>' : ''}</div>
        <div class="desc">${available ? p.intro : 'Реши предыдущую загадку, чтобы открыть.'}</div>
      </span>`;
    if (available) {
      const btn = document.createElement('button');
      btn.textContent = done ? 'Ещё раз' : 'Решать';
      btn.addEventListener('click', () => ctx.go('puzzle', { id: p.id }));
      row.appendChild(btn);
      if (!done) {
        const skipBtn = puzzleSkipButton(ctx, p, () => {
          container.innerHTML = '';
          renderPuzzleList(container, ctx);
        });
        skipBtn.className = 'small ghost';
        row.appendChild(skipBtn);
      }
    }
    list.appendChild(row);
  });
  container.appendChild(list);
  container.appendChild(quickNav(ctx, [
    { icon: '🏠', label: 'В лавку', screen: 'hub' },
  ]));

  // Автоскролл к первой нерешённой загадке
  const targetRow = list.querySelector?.('[data-scroll-target="1"]');
  if (targetRow && targetRow.scrollIntoView) {
    setTimeout(() => targetRow.scrollIntoView({ block: 'center', behavior: 'smooth' }), 60);
  }
}

// --- Игра ---

const CELL = 64; // крупные клетки: удобно и мышью, и пальцем

export function renderPuzzle(container, ctx, params) {
  const level = findPuzzle(ctx.state, params.id);
  if (!level) { ctx.go('puzzles'); return; }
  if (level.mechanic === 'shelf') {
    return renderShelfPuzzle(container, ctx, level);
  }
  if (level.mechanic === 'book') {
    return renderBookPuzzle(container, ctx, level);
  }
  if (level.mechanic === 'seek') {
    return renderSeekPuzzle(container, ctx, level);
  }
  if (level.mechanic === 'path') {
    return renderPathPuzzle(container, ctx, level);
  }
  if (level.mechanic === 'tea') {
    return renderTeaPuzzle(container, ctx, level);
  }
  if (level.mechanic === 'mech') {
    return renderMechPuzzle(container, ctx, level);
  }
  if (level.mechanic === 'candle') {
    return renderCandlePuzzle(container, ctx, level);
  }
  if (level.mechanic === 'flow') {
    return renderFlowPuzzle(container, ctx, level);
  }
  if (level.mechanic === 'brew') {
    return renderBrewPuzzle(container, ctx, level);
  }
  const puzzle = createPuzzle(level);
  let hintsUsed = 0;
  let hintCell = null; // подсветка подсказки
  let finished = false;

  container.appendChild(header(ctx, level.name, `Сложность: ${'★'.repeat(level.difficulty)}`, 'puzzles'));

  const wrap = document.createElement('div');
  wrap.className = 'puzzle-wrap';

  // Canvas
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

  // Боковая панель
  const side = document.createElement('div');
  side.className = 'puzzle-side';
  const intro = document.createElement('div');
  intro.className = 'intro-text';
  intro.textContent = level.intro;
  side.appendChild(intro);

  const statusEl = document.createElement('div');
  statusEl.className = 'puzzle-status';
  side.appendChild(statusEl);

  const controls = document.createElement('div');
  controls.className = 'puzzle-controls';
  const btnUndo = mkBtn('↩️ Отмена (Z)', doUndo);
  const btnHint = mkBtn('💡 Подсказка (H)', doHint);
  const btnReset = mkBtn('🔄 Сброс (R)', doReset);
  controls.append(btnUndo, btnHint, btnReset);
  controls.appendChild(puzzleSkipButton(ctx, level, () => ctx.go('puzzles')));
  side.appendChild(controls);

  const legend = document.createElement('div');
  legend.className = 'panel mt';
  legend.innerHTML = `<div class="desc" style="line-height:1.9">
    ✨ светлячок — источник света<br>
    🪞 зеркало — тапни, чтобы повернуть<br>
    🏮 фонарь — зажги все<br>
    🦋 моль — не буди её светом!<br>
    🌑 тень — просто блокирует свет</div>`;
  side.appendChild(legend);
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
    if (undo(puzzle)) { hintCell = null; draw(); }
  }

  function doReset() {
    if (finished) return;
    reset(puzzle);
    hintCell = null;
    draw();
  }

  function doHint() {
    if (finished) return;
    const h = solverHint(puzzle);
    if (h.type === 'rotate') {
      hintsUsed += 1;
      hintCell = level.objects[h.objectIndex].pos;
      ctx.toast('Кот-хранитель смотрит на одно из зеркал…');
      draw();
    } else if (h.type === 'already') {
      ctx.toast('Всё уже верно — фонари вот-вот зажгутся!');
    } else {
      ctx.toast('Хм, этот уровень не решается. Сообщи хозяину лавки!');
    }
  }

  // Ввод: тап/клик по клетке
  function onTap(ev) {
    if (finished) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / dpr / rect.width;
    const cx = (ev.clientX - rect.left) * scaleX;
    const cy = (ev.clientY - rect.top) * scaleX;
    const x = Math.floor(cx / CELL);
    const y = Math.floor(cy / CELL);
    const idx = level.objects.findIndex((o) => o.pos[0] === x && o.pos[1] === y);
    if (idx >= 0 && level.objects[idx].type === 'mirror') {
      rotateMirror(puzzle, idx);
      hintCell = null;
      ctx.sfx?.('rotate');
      draw();
      if (isSolved(puzzle)) finish();
    }
  }
  canvas.addEventListener('pointerdown', onTap);

  // Клавиатура
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
    setTimeout(() => showVictory(ctx, level, rewards), 450);
  }

  function draw() {
    const g = canvas.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, gw * CELL, gh * CELL);

    const { lanternsLit, mothsAwake, beams } = traceLight(puzzle);

    // Пол — трава опушки
    for (let y = 0; y < gh; y++) {
      for (let x = 0; x < gw; x++) {
        g.fillStyle = (x + y) % 2 === 0 ? '#3a5232' : '#425c38';
        g.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
    }

    // Лучи света — мягкое свечение
    g.save();
    g.lineCap = 'round';
    for (const pass of [{ w: 12, a: 0.18 }, { w: 5, a: 0.85 }]) {
      g.strokeStyle = `rgba(255, 226, 138, ${pass.a})`;
      g.lineWidth = pass.w;
      for (const b of beams) {
        g.beginPath();
        g.moveTo(b.from[0] * CELL + CELL / 2, b.from[1] * CELL + CELL / 2);
        g.lineTo(b.to[0] * CELL + CELL / 2, b.to[1] * CELL + CELL / 2);
        g.stroke();
      }
    }
    g.restore();

    // Объекты
    level.objects.forEach((o, i) => {
      const cx = o.pos[0] * CELL + CELL / 2;
      const cy = o.pos[1] * CELL + CELL / 2;
      const emoji = (e, size = CELL * 0.62) => {
        g.font = `${size}px "Segoe UI Emoji", sans-serif`;
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillText(e, cx, cy);
      };
      switch (o.type) {
        case 'source': {
          // Стрелка направления + светлячок
          emoji('✨');
          const dirs = ['↑', '→', '↓', '←'];
          g.fillStyle = 'rgba(255, 240, 190, 0.9)';
          g.font = `bold ${CELL * 0.3}px sans-serif`;
          g.fillText(dirs[o.dir], cx + CELL * 0.28, cy - CELL * 0.28);
          break;
        }
        case 'mirror': {
          const orient = puzzle.orient[i];
          // Подсветка подсказки
          if (hintCell && hintCell[0] === o.pos[0] && hintCell[1] === o.pos[1]) {
            g.fillStyle = 'rgba(255, 202, 122, 0.35)';
            g.beginPath();
            g.arc(cx, cy, CELL * 0.46, 0, Math.PI * 2);
            g.fill();
          }
          // Зеркало как линия на подставке
          g.save();
          g.translate(cx, cy);
          g.rotate(orient === 0 ? Math.PI / 4 : -Math.PI / 4);
          g.fillStyle = '#8a6f4d';
          g.fillRect(-CELL * 0.3, -3, CELL * 0.6, 6);
          g.fillStyle = '#cfe8ff';
          g.fillRect(-CELL * 0.3, -5, CELL * 0.6, 4);
          g.restore();
          emoji('🪞', CELL * 0.3);
          break;
        }
        case 'lantern': {
          if (lanternsLit.has(i)) {
            g.fillStyle = 'rgba(255, 214, 120, 0.35)';
            g.beginPath();
            g.arc(cx, cy, CELL * 0.48, 0, Math.PI * 2);
            g.fill();
            emoji('🏮');
          } else {
            g.globalAlpha = 0.55;
            emoji('🏮');
            g.globalAlpha = 1;
          }
          break;
        }
        case 'moth':
          emoji(mothsAwake.has(i) ? '😡' : '🦋');
          if (mothsAwake.has(i)) {
            g.fillStyle = 'rgba(232, 138, 122, 0.25)';
            g.fillRect(o.pos[0] * CELL, o.pos[1] * CELL, CELL, CELL);
          }
          break;
        case 'wall':
          emoji('🌑');
          break;
      }
    });

    // Статус
    const st = status(puzzle);
    statusEl.innerHTML =
      `🏮 Фонари: <b>${st.lanternsLit}/${st.lanternsTotal}</b> &nbsp; ` +
      (st.mothsAwake > 0
        ? `<span class="warn">🦋 Моль проснулась! Отведи свет.</span>`
        : `🦋 Моль спит`) +
      `<div class="muted" style="font-size:13px">Ходы: ${puzzle.moves} · Подсказки: ${hintsUsed}</div>`;
  }

  draw();

  // Уровень уже решён на старте (обучающий «Первый светлячок»):
  // даём посмотреть на луч и мягко завершаем сами.
  if (!finished && isSolved(puzzle)) {
    setTimeout(() => { if (!finished) finish(); }, 1400);
  }

  // Первое интерактивное обучение головоломке (на уровне с первым зеркалом)
  if (level.id === 'md_02') {
    startTutorial(ctx, 'first_puzzle', [
      {
        target: canvas,
        title: 'Твоя первая загадка',
        text: 'Светлячок светит прямо, но фонарь не на пути луча. Ничего страшного — на поле лежит зеркало!',
      },
      {
        target: canvas,
        title: 'Тапни зеркало',
        text: 'Один тап — и зеркало поворачивается. Направь луч на фонарь, и лавка зажжётся. Можно прямо сейчас!',
        cta: 'Попробую!',
      },
      {
        target: side,
        title: 'Всегда под рукой',
        text: 'Отмена (Z), подсказка (H) и сброс (R) — ошибиться не страшно. Кот-хранитель подскажет, если застрянешь.',
      },
    ]);
  }

  return () => {
    window.removeEventListener('keydown', onKey);
    canvas.removeEventListener('pointerdown', onTap);
  };
}

function showVictory(ctx, level, rewards) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  const rewardHtml = rewards.map((r) => {
    if (r.type === 'coins') return `🪙 ${r.amount} монет`;
    if (r.type === 'seals') return `🔰 ${r.amount} печать мастера`;
    if (r.type === 'item') return `🎁 ${ITEM_BY_ID[r.id]?.name || r.id}`;
    return '';
  }).filter(Boolean).join('<br>');

  overlay.innerHTML = `
    <div class="card">
      <h2>🏮 Лавка сияет!</h2>
      <div class="muted">«${level.name}» — решено</div>
      <div class="rewards">${rewardHtml}</div>
      <div class="actions"></div>
    </div>`;
  const actions = overlay.querySelector('.actions');
  const next = nextPuzzle(level.id);
  if (next) {
    const nextBtn = document.createElement('button');
    nextBtn.className = 'primary';
    nextBtn.textContent = `Следующая → ${next.name}`;
    nextBtn.addEventListener('click', () => { overlay.remove(); ctx.go('puzzle', { id: next.id }); });
    actions.appendChild(nextBtn);
  }
  const again = document.createElement('button');
  again.textContent = 'Ещё раз';
  again.addEventListener('click', () => { overlay.remove(); ctx.go('puzzle', { id: level.id }); });
  const toList = document.createElement('button');
  if (!next) toList.className = 'primary';
  toList.textContent = 'К загадкам';
  toList.addEventListener('click', () => { overlay.remove(); ctx.go('puzzles'); });
  const toShop = document.createElement('button');
  toShop.textContent = 'В лавку';
  toShop.addEventListener('click', () => { overlay.remove(); ctx.go('hub'); });
  actions.append(again, toList, toShop);
  document.body.appendChild(overlay);
}

function header(ctx, title, subtitle, backTo = 'hub') {
  const box = document.createElement('div');
  box.className = 'panel';
  const top = document.createElement('div');
  top.style.display = 'flex';
  top.style.justifyContent = 'space-between';
  top.style.alignItems = 'center';
  const h = document.createElement('h2');
  h.textContent = title;
  h.style.margin = '0';
  const back = document.createElement('button');
  back.className = 'ghost small';
  back.textContent = '← Назад';
  back.addEventListener('click', () => ctx.go(backTo));
  top.append(h, back);
  box.appendChild(top);
  if (subtitle) {
    const s = document.createElement('div');
    s.className = 'muted';
    s.textContent = subtitle;
    box.appendChild(s);
  }
  return box;
}
