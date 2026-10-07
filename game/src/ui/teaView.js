// Экран головоломки «Чай для путника».
import {
  createTeaPuzzle, addIngredient, undoTea, resetTea,
  isTeaSolved, teaStatus, teaHint,
} from '../core/teaPuzzle.js';
import { completePuzzle, nextPuzzle } from '../core/state.js';
import { header, showOverlay , puzzleSkipButton } from './common.js';

export function renderTeaPuzzle(container, ctx, level) {
  const puzzle = createTeaPuzzle(level);
  let hintsUsed = 0;
  let hintIngredient = null;
  let finished = false;

  container.appendChild(header(ctx, level.name, `Сложность: ${'★'.repeat(level.difficulty)}`, 'puzzles'));

  const wrap = document.createElement('div');
  wrap.className = 'puzzle-wrap';

  // Котёл и флакон-цель
  const brewPanel = document.createElement('div');
  brewPanel.className = 'panel';
  brewPanel.style.cssText = 'display:flex;gap:20px;align-items:center;flex-wrap:wrap';
  brewPanel.innerHTML = '<div style="text-align:center"><div class="muted" style="font-size:12px">Котёл</div></div>';
  const potBox = document.createElement('div');
  potBox.style.cssText = 'text-align:center';
  const pot = document.createElement('div');
  pot.style.cssText = `width:110px;height:110px;border-radius:50% 50% 46% 46%;
    border:6px solid #4a3a29;box-shadow:inset 0 -14px 24px rgba(0,0,0,.4), 0 6px 16px rgba(0,0,0,.4);
    transition:background .3s ease;position:relative;overflow:hidden`;
  potBox.appendChild(pot);
  const potLabel = document.createElement('div');
  potLabel.className = 'muted';
  potLabel.style.fontSize = '12px';
  potLabel.textContent = 'цвет отвара';
  potBox.appendChild(potLabel);
  brewPanel.appendChild(potBox);

  const targetBox = document.createElement('div');
  targetBox.style.cssText = 'text-align:center';
  const flask = document.createElement('div');
  flask.style.cssText = `width:64px;height:88px;border-radius:12px 12px 20px 20px;
    border:4px solid #4a3a29;box-shadow:inset 0 -10px 18px rgba(0,0,0,.35)`;
  flask.style.background = rgbCss(level.target);
  targetBox.appendChild(flask);
  const flaskLabel = document.createElement('div');
  flaskLabel.className = 'muted';
  flaskLabel.style.fontSize = '12px';
  flaskLabel.textContent = 'заказ путника';
  targetBox.appendChild(flaskLabel);
  brewPanel.appendChild(targetBox);

  // Шкала жара
  const heatBox = document.createElement('div');
  heatBox.style.cssText = 'flex:1;min-width:180px';
  heatBox.innerHTML = '<div class="muted" style="font-size:12px;margin-bottom:4px">Жар котла</div>';
  const heatBar = document.createElement('div');
  heatBar.className = 'hpbar';
  heatBar.style.height = '14px';
  const heatFill = document.createElement('div');
  heatFill.style.background = '#e88a7a';
  heatBar.appendChild(heatFill);
  const heatMark = document.createElement('div');
  heatMark.className = 'muted';
  heatMark.style.fontSize = '12px';
  heatBox.append(heatBar, heatMark);
  brewPanel.appendChild(heatBox);
  wrap.appendChild(brewPanel);

  const side = document.createElement('div');
  side.className = 'puzzle-side';
  const intro = document.createElement('div');
  intro.className = 'intro-text';
  intro.textContent = level.intro;
  side.appendChild(intro);

  const ingLabel = document.createElement('div');
  ingLabel.className = 'muted';
  ingLabel.style.cssText = 'font-size:13px;margin-bottom:6px';
  ingLabel.textContent = 'Ингредиенты (тап — в котёл):';
  side.appendChild(ingLabel);
  const ingGrid = document.createElement('div');
  ingGrid.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px';
  side.appendChild(ingGrid);

  const statusEl = document.createElement('div');
  statusEl.className = 'puzzle-status';
  side.appendChild(statusEl);

  const controls = document.createElement('div');
  controls.className = 'puzzle-controls';
  controls.style.marginTop = '10px';
  const btnUndo = mkBtn('↩️ Отмена (Z)', doUndo);
  const btnHint = mkBtn('💡 Подсказка (H)', doHint);
  const btnReset = mkBtn('🔄 Заново (R)', doReset);
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

  function rgbCss(c) {
    return `rgb(${Math.round(c.r * 2.55)}, ${Math.round(c.g * 2.55)}, ${Math.round(c.b * 2.55)})`;
  }

  function doUndo() {
    if (finished) return;
    if (undoTea(puzzle)) { hintIngredient = null; ctx.sfx?.('tap'); draw(); }
  }
  function doReset() {
    if (finished) return;
    resetTea(puzzle);
    hintIngredient = null;
    ctx.sfx?.('tap');
    draw();
  }
  function doHint() {
    if (finished) return;
    const h = teaHint(puzzle);
    ctx.sfx?.('hint');
    if (h.type === 'add') {
      hintsUsed += 1;
      hintIngredient = h.ingredientId;
      ctx.toast(`Кот-хранитель толкает носом: ${h.icon} ${h.name}`);
      draw();
    } else if (h.type === 'reset') {
      ctx.toast(h.text);
    } else if (h.type === 'already') {
      ctx.toast('Отвар уже идеален!');
    } else {
      ctx.toast('Хм, рецепт не сходится. Скажи хозяину лавки!');
    }
  }

  function onAdd(ingId) {
    if (finished) return;
    const r = addIngredient(puzzle, ingId);
    if (r.ok) {
      hintIngredient = null;
      ctx.sfx?.('potion');
      draw();
      if (isTeaSolved(puzzle)) finish();
    } else {
      ctx.toast(r.error);
    }
  }

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
        title: '🫖 Отвар готов!',
        subtitle: `«${level.name}» — путник благодарит`,
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
    // Котёл
    pot.style.background = rgbCss(puzzle.color);

    // Жар
    const st = teaStatus(puzzle);
    heatFill.style.width = `${st.heat}%`;
    heatFill.style.background = st.overheated ? '#d9432f' : '#e88a7a';
    heatMark.innerHTML = st.overheated
      ? '<span class="warn">Перегрет! Такой отвар путник не возьмёт.</span>'
      : `${st.heat}/${st.maxHeat}`;

    // Ингредиенты
    ingGrid.innerHTML = '';
    for (const ing of level.ingredients) {
      const left = ing.uses - (puzzle.used[ing.id] || 0);
      const b = document.createElement('button');
      b.className = 'small' + (hintIngredient === ing.id ? ' primary' : '');
      b.disabled = left <= 0;
      const effect = [
        ing.dr ? `R${ing.dr > 0 ? '+' : ''}${ing.dr}` : '',
        ing.dg ? `G${ing.dg > 0 ? '+' : ''}${ing.dg}` : '',
        ing.db ? `B${ing.db > 0 ? '+' : ''}${ing.db}` : '',
        ing.heat ? `жар${ing.heat > 0 ? '+' : ''}${ing.heat}` : '',
      ].filter(Boolean).join(' ');
      b.innerHTML = `${ing.icon} ${ing.name} <span class="badge">×${left}</span>`;
      b.title = effect;
      b.addEventListener('click', () => onAdd(ing.id));
      ingGrid.appendChild(b);
    }

    // Статус
    const d = st.diffs;
    statusEl.innerHTML =
      (st.solved
        ? '✅ <b>Идеальный отвар!</b>'
        : `🎯 До цели: <b>±${Math.max(d.r, d.g, d.b)}</b> <span class="muted">(допуск ${level.tolerance})</span>`) +
      `<div class="muted" style="font-size:13px">Ходы: ${puzzle.moves} · Подсказки: ${hintsUsed}</div>`;
  }

  draw();

  return () => {
    window.removeEventListener('keydown', onKey);
  };
}
