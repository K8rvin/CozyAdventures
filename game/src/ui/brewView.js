// Экран головоломки «Варка зелий по рецепту».
// Сцена: стол с ингредиентами и приборами, котёл, раскрытая книга рецептов.
// Поздние уровни — на память: книга видна несколько секунд, потом закрывается.
import {
  createBrewPuzzle, doBrewAction, undoBrew, resetBrew,
  isBrewSolved, brewHint, brewStepText, BREW_MAX_MISTAKES,
} from '../core/brewPuzzle.js';
import { completePuzzle, nextPuzzle } from '../core/state.js';
import { header, showOverlay, puzzleSkipButton } from './common.js';

// Цвет зелья по мере готовности: от родниковой воды к глубокому фиолетовому
const POTION_COLORS = ['#6fb7d9', '#7fc98f', '#d9c26f', '#d9915f', '#b565a8', '#6f4fa8'];

export function renderBrewPuzzle(container, ctx, level) {
  const puzzle = createBrewPuzzle(level);
  let hintsUsed = 0;
  let hintAction = null;   // подсвеченное действие { do, ingredient }
  let crushMode = false;   // ступка активна: следующий ингредиент — растолочь
  let finished = false;
  let recipeHidden = false;
  const timers = [];

  container.appendChild(header(ctx, level.name, `Сложность: ${'★'.repeat(level.difficulty)}`, 'puzzles'));

  const wrap = document.createElement('div');
  wrap.className = 'puzzle-wrap';

  // --- Сцена: стол и котёл ---
  const scene = document.createElement('div');
  scene.className = 'panel brew-scene';
  const bg = document.createElement('img');
  bg.className = 'brew-table-bg';
  bg.alt = '';
  const bgCandidates = ['assets/brew_table_web.jpg', 'assets/brew_table.jfif', 'assets/brew_table.png'];
  let bgIdx = 0;
  bg.addEventListener('error', () => {
    bgIdx += 1;
    if (bgIdx < bgCandidates.length) bg.src = bgCandidates[bgIdx];
    else bg.remove();
  });
  bg.src = bgCandidates[0];
  scene.appendChild(bg);

  const pot = document.createElement('div');
  pot.className = 'brew-pot';
  const potion = document.createElement('div');
  potion.className = 'brew-potion';
  pot.appendChild(potion);
  const smoke = document.createElement('div');
  smoke.className = 'brew-smoke';
  smoke.textContent = '💨';
  pot.appendChild(smoke);
  const fire = document.createElement('div');
  fire.className = 'brew-fire';
  pot.appendChild(fire);
  scene.appendChild(pot);

  // Инструменты
  const tools = document.createElement('div');
  tools.className = 'brew-tools';
  const toolDefs = [
    { do: 'stir', icon: '🥄', label: 'Размешать' },
    { do: 'heat', icon: '🔥', label: 'Подогреть' },
    { do: 'cool', icon: '❄️', label: 'Остудить' },
    { do: 'wait', icon: '⏳', label: 'Настояться' },
  ];
  const toolBtns = {};
  for (const t of toolDefs) {
    const b = document.createElement('button');
    b.className = 'small';
    b.innerHTML = `${t.icon} ${t.label}`;
    b.addEventListener('click', () => onAction({ do: t.do }));
    tools.appendChild(b);
    toolBtns[t.do] = b;
  }
  const mortar = document.createElement('button');
  mortar.className = 'small';
  mortar.innerHTML = '🥣 Ступка';
  mortar.title = 'Жми ступку, потом — что растолочь';
  mortar.addEventListener('click', () => {
    crushMode = !crushMode;
    ctx.sfx?.('tap');
    draw();
  });
  tools.appendChild(mortar);
  scene.appendChild(tools);

  // Ингредиенты на столе
  const ingRow = document.createElement('div');
  ingRow.className = 'brew-ings';
  scene.appendChild(ingRow);
  wrap.appendChild(scene);

  // --- Книга рецептов ---
  const side = document.createElement('div');
  side.className = 'puzzle-side';
  const intro = document.createElement('div');
  intro.className = 'intro-text';
  intro.textContent = level.intro;
  side.appendChild(intro);

  const book = document.createElement('div');
  book.className = 'brew-book';
  side.appendChild(book);

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

  // --- Память: показать рецепт на peekSeconds и спрятать ---
  if (level.hideRecipe) {
    recipeHidden = false;
    const peek = document.createElement('div');
    peek.className = 'overlay';
    peek.innerHTML = `
      <div class="card">
        <h2>📖 Запоминай!</h2>
        <div class="muted">Книга закроется через <b>${level.peekSeconds}</b> сек…</div>
        <div class="brew-peek-list">${
          level.recipe.map((s, i) => `<div>${i + 1}. ${brewStepText(level, s)}</div>`).join('')
        }</div>
      </div>`;
    document.body.appendChild(peek);
    timers.push(setTimeout(() => {
      peek.remove();
      recipeHidden = true;
      ctx.toast('📕 Книга закрылась. Дальше — по памяти! Подсказка напомнит шаг.');
      draw();
    }, level.peekSeconds * 1000));
    // Клик по карточке — закрыть досрочно
    peek.addEventListener('click', () => {
      peek.remove();
      recipeHidden = true;
      draw();
    });
  }

  function heatLevel() {
    // Сколько раз грели после последнего остывания (0..3)
    let n = 0;
    for (const h of puzzle.history) {
      if (h.do === 'heat') n = Math.min(3, n + 1);
      if (h.do === 'cool') n = 0;
    }
    return n;
  }

  function doUndo() {
    if (finished) return;
    if (undoBrew(puzzle)) { hintAction = null; ctx.sfx?.('tap'); draw(); }
  }
  function doReset() {
    if (finished) return;
    resetBrew(puzzle);
    hintAction = null;
    crushMode = false;
    ctx.sfx?.('tap');
    draw();
  }
  function doHint() {
    if (finished) return;
    const h = brewHint(puzzle);
    if (h.type === 'step') {
      hintsUsed += 1;
      hintAction = h.step;
      ctx.sfx?.('hint');
      ctx.toast(`Кот-хранитель шепчет: «${brewStepText(level, h.step)}»`);
      draw();
    } else {
      ctx.toast('Зелье уже готово!');
    }
  }

  function onAction(action) {
    if (finished) return;
    // Режим ступки: ингредиент превращается в crush-действие
    if (action.do === 'add' && crushMode) {
      action = { do: 'crush', ingredient: action.ingredient };
      crushMode = false;
    }
    const r = doBrewAction(puzzle, action);
    if (r.ok) {
      hintAction = null;
      ctx.sfx?.(action.do === 'add' || action.do === 'crush' ? 'potion' : 'tap');
      pulsePot();
      draw();
      if (r.solved) finish();
      return;
    }
    if (r.mistake) {
      ctx.sfx?.('tap');
      puffSmoke();
      if (r.spoiled) {
        ctx.toast('💨 Зелье испорчено! Пузырится чёрным… Варим заново.');
      } else {
        ctx.toast(`Не тот шаг! Ошибка ${puzzle.mistakes} из ${BREW_MAX_MISTAKES}. Кот морщится от запаха.`);
      }
      draw();
      return;
    }
    ctx.toast(r.error || 'Не выходит');
  }

  // Бурление котла при верном шаге
  function pulsePot() {
    pot.classList.remove('bubble');
    void pot.offsetWidth;
    pot.classList.add('bubble');
    timers.push(setTimeout(() => pot.classList.remove('bubble'), 900));
  }

  // Чёрный дымок при ошибке
  function puffSmoke() {
    smoke.classList.remove('puff');
    void smoke.offsetWidth;
    smoke.classList.add('puff');
    pot.classList.remove('shake');
    void pot.offsetWidth;
    pot.classList.add('shake');
    timers.push(setTimeout(() => { smoke.classList.remove('puff'); pot.classList.remove('shake'); }, 900));
  }

  function finish() {
    finished = true;
    const rewards = completePuzzle(ctx.state, level.id, { moves: puzzle.moves, hintsUsed });
    ctx.save();
    ctx.sfx?.('success');
    draw();
    setTimeout(() => {
      const next = nextPuzzle(level.id);
      showOverlay(ctx, {
        title: '⚗️ Зелье получилось!',
        subtitle: `«${level.name}» — сварено по всем правилам${puzzle.spoiled ? ` (испорчено котлов: ${puzzle.spoiled})` : ''}`,
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
    // Котёл: цвет зелья по прогрессу, огонь по греву
    const total = level.recipe.length;
    const ci = Math.min(POTION_COLORS.length - 1, Math.floor((puzzle.progress / total) * POTION_COLORS.length));
    potion.style.background = POTION_COLORS[puzzle.progress === 0 ? 0 : ci];
    potion.style.height = `${20 + (puzzle.progress / total) * 65}%`;
    const hl = heatLevel();
    fire.textContent = hl > 0 ? '🔥'.repeat(hl) : '';

    // Ступка
    mortar.className = 'small' + (crushMode ? ' primary' : '');
    mortar.innerHTML = crushMode ? '🥣 Что толчём?' : '🥣 Ступка';

    // Ингредиенты
    ingRow.innerHTML = '';
    for (const ing of level.ingredients) {
      const b = document.createElement('button');
      b.className = 'small brew-ing';
      const isHint = hintAction && (hintAction.do === 'add' || hintAction.do === 'crush')
        && hintAction.ingredient === ing.id;
      if (isHint) b.className += ' primary';
      b.innerHTML = `${ing.icon} ${ing.name}`;
      b.title = crushMode ? `Растолочь: ${ing.name}` : ing.name;
      b.addEventListener('click', () => onAction({ do: 'add', ingredient: ing.id }));
      ingRow.appendChild(b);
    }
    // Подсветка инструмента из подсказки
    for (const [d, btn] of Object.entries(toolBtns)) {
      btn.className = 'small' + (hintAction && hintAction.do === d ? ' primary' : '');
    }

    // Книга рецептов
    book.innerHTML = '<div class="brew-book-title">📖 Рецепт</div>';
    level.recipe.forEach((s, i) => {
      const row = document.createElement('div');
      const done = i < puzzle.progress;
      const current = i === puzzle.progress && !finished;
      row.className = 'brew-step' + (done ? ' done' : '') + (current ? ' current' : '');
      const hidden = recipeHidden && !done;
      row.textContent = done
        ? `${i + 1}. ${brewStepText(level, s)} ✓`
        : hidden
          ? `${i + 1}. · · ·`
          : `${i + 1}. ${brewStepText(level, s)}`;
      book.appendChild(row);
    });
    if (recipeHidden) {
      const note = document.createElement('div');
      note.className = 'brew-book-note';
      note.textContent = '📕 Книга закрыта — по памяти!';
      book.appendChild(note);
    }

    // Статус
    const hearts = '✖'.repeat(puzzle.mistakes) + '➖'.repeat(Math.max(0, BREW_MAX_MISTAKES - puzzle.mistakes));
    statusEl.innerHTML =
      `⚗️ Шаг <b>${Math.min(puzzle.progress + (finished ? 0 : 1), total)} из ${total}</b> · Ошибки: ${hearts}` +
      (puzzle.spoiled ? ` · <span class="warn">испорчено котлов: ${puzzle.spoiled}</span>` : '') +
      `<div class="muted" style="font-size:13px">Ходы: ${puzzle.moves} · Подсказки: ${hintsUsed}</div>`;
  }

  function onKey(ev) {
    if (ev.key === 'z' || ev.key === 'Z' || (ev.ctrlKey && ev.key === 'z')) { ev.preventDefault(); doUndo(); }
    if (ev.key === 'h' || ev.key === 'H' || ev.key === 'р' || ev.key === 'Р') doHint();
    if (ev.key === 'r' || ev.key === 'R' || ev.key === 'к' || ev.key === 'К') doReset();
    if (ev.key === 'Escape') ctx.go('puzzles');
  }
  window.addEventListener('keydown', onKey);

  draw();

  return () => {
    window.removeEventListener('keydown', onKey);
    for (const t of timers) clearTimeout(t);
  };
}
