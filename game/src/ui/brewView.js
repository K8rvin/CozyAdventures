// Экран головоломки «Варка зелий по рецепту».
// Сцена: стол с ингредиентами и приборами, котёл, раскрытая книга рецептов.
// Поздние уровни — на память: книга видна несколько секунд, потом закрывается.
import {
  createBrewPuzzle, doBrewAction, undoBrew, resetBrew,
  isBrewSolved, brewHint, brewStepText, brewHiddenCount, BREW_MAX_MISTAKES,
} from '../core/brewPuzzle.js';
import { completePuzzle, nextPuzzle } from '../core/state.js';
import { header, showOverlay, puzzleSkipButton, backToPuzzleType } from './common.js';

// Цвет зелья по мере готовности: от родниковой воды к глубокому фиолетовому
const POTION_COLORS = ['#6fb7d9', '#7fc98f', '#d9c26f', '#d9915f', '#b565a8', '#6f4fa8'];

// Инструменты подготовки: сначала жмём инструмент, потом ингредиент (как ступка)
const PREP_TOOLS = [
  { do: 'crush', icon: '🥣', label: 'Ступка', active: 'Что толчём?', verb: 'Растолочь', hint: 'Жми ступку, потом — что растолочь' },
  { do: 'cut', icon: '🔪', label: 'Нож', active: 'Что режем?', verb: 'Нарезать', hint: 'Жми нож, потом — что нарезать' },
  { do: 'drop', icon: '🧪', label: 'Пипетка', active: 'Что капаем?', verb: 'Накапать', hint: 'Жми пипетку, потом — что накапать' },
];

export function renderBrewPuzzle(container, ctx, level) {
  const puzzle = createBrewPuzzle(level);
  let hintsUsed = 0;
  let hintAction = null;   // подсвеченное действие { do, ingredient }
  let prepMode = null;     // активный инструмент (crush/cut/drop): следующий ингредиент — обработать им
  let finished = false;
  let recipeHidden = false;
  const timers = [];
  // Уютный режим (настройка keepBookOpen): книга рецептов не закрывается
  const cozy = () => !!ctx.state.settings?.keepBookOpen;

  container.appendChild(header(ctx, level.name, `Сложность: ${'★'.repeat(level.difficulty)}`, ['puzzles', { mech: level.mechanic || 'mirror' }]));

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
  const prepBtns = {};
  for (const t of PREP_TOOLS) {
    const b = document.createElement('button');
    b.className = 'small';
    b.innerHTML = `${t.icon} ${t.label}`;
    b.title = t.hint;
    b.addEventListener('click', () => {
      prepMode = prepMode === t.do ? null : t.do;
      ctx.sfx?.('tap');
      draw();
    });
    tools.appendChild(b);
    prepBtns[t.do] = b;
  }
  // Крышка котла: накрыть/снять (состояние — из истории действий, как огонь)
  const lid = document.createElement('button');
  lid.className = 'small';
  lid.innerHTML = '🍲 Крышка';
  lid.title = 'Накрыть котёл крышкой или снять её';
  lid.addEventListener('click', () => onAction({ do: lidOn() ? 'uncover' : 'cover' }));
  tools.appendChild(lid);
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
  const bookBg = document.createElement('img');
  bookBg.className = 'brew-book-bg';
  bookBg.alt = '';
  bookBg.addEventListener('error', () => bookBg.remove());
  bookBg.src = 'assets/recipe_book_web.jpg';
  book.appendChild(bookBg);
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
  // Уютный режим прямо на экране варки (только уровни с памятью).
  // Подпись обновляется в draw(); тот же флаг, что и в Настройках.
  let btnCozy = null;
  if (level.hideRecipe) {
    btnCozy = mkBtn('', () => {
      const s = ctx.state.settings;
      s.keepBookOpen = !s.keepBookOpen;
      ctx.save();
      if (s.keepBookOpen) {
        if (peekTimer) { clearInterval(peekTimer); peekTimer = null; }
        recipeHidden = false;
        ctx.toast('📖 Книга больше не закроется — вари в удовольствие!');
      } else {
        startPeek(); // память включена обратно: отсчёт начинается заново
      }
      ctx.sfx?.('tap');
      draw();
    });
    controls.appendChild(btnCozy);
  }
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

  // --- Память: рецепт виден в панели книги peekSeconds (с отсчётом),
  // затем прячется ХВОСТ рецепта (brewHiddenCount). «Заново» открывает снова ---
  let peekTimer = null;
  let peekLeft = 0;
  function startPeek() {
    if (!level.hideRecipe || cozy()) return; // уютный режим: память не включаем
    recipeHidden = false;
    peekLeft = level.peekSeconds;
    if (peekTimer) clearInterval(peekTimer);
    peekTimer = setInterval(() => {
      peekLeft -= 1;
      if (peekLeft <= 0) {
        clearInterval(peekTimer);
        peekTimer = null;
        recipeHidden = true;
        ctx.toast(`📕 Книга прикрылась: последние ${brewHiddenCount(level)} шага — по памяти!`);
      }
      draw();
    }, 1000);
    timers.push(peekTimer);
    ctx.sfx?.('page');
    draw();
  }

  if (level.hideRecipe) startPeek();

  function heatLevel() {
    // Сколько раз грели после последнего остывания (0..3)
    let n = 0;
    for (const h of puzzle.history) {
      if (h.do === 'heat') n = Math.min(3, n + 1);
      if (h.do === 'cool') n = 0;
    }
    return n;
  }

  function lidOn() {
    // Крышка на котле? Последнее из cover/uncover в истории
    let on = false;
    for (const h of puzzle.history) {
      if (h.do === 'cover') on = true;
      if (h.do === 'uncover') on = false;
    }
    return on;
  }

  function doUndo() {
    if (finished) return;
    if (undoBrew(puzzle)) { hintAction = null; ctx.sfx?.('tap'); draw(); }
  }
  function doReset() {
    if (finished) return;
    resetBrew(puzzle);
    hintAction = null;
    prepMode = null;
    // Режим памяти: «Заново» открывает книгу ещё раз на те же секунды
    if (level.hideRecipe && recipeHidden) {
      ctx.toast('📖 Книга открылась ещё раз — запоминай!');
      startPeek();
    }
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
    // Активный инструмент (ступка/нож/пипетка): ингредиент превращается в его действие
    if (action.do === 'add' && prepMode) {
      action = { do: prepMode, ingredient: action.ingredient };
      prepMode = null;
    }
    const r = doBrewAction(puzzle, action);
    if (r.ok) {
      hintAction = null;
      const sfx = ['add', 'crush', 'cut', 'drop'].includes(action.do) ? 'potion'
        : (action.do === 'cover' || action.do === 'uncover' ? 'tap' : 'bubble');
      ctx.sfx?.(sfx);
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
          { label: 'К загадкам', primary: !next, onClick: () => backToPuzzleType(ctx, level) },
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

    // Ингредиенты
    const hintOpts = hintAction ? (Array.isArray(hintAction.anyOf) ? hintAction.anyOf : [hintAction]) : [];
    const prepTool = PREP_TOOLS.find((t) => t.do === prepMode) || null;
    ingRow.innerHTML = '';
    for (const ing of level.ingredients) {
      const b = document.createElement('button');
      b.className = 'small brew-ing';
      // При подсказке «растолочь/нарезать/накапать» ингредиент светится, только
      // когда инструмент уже выбран: иначе порядок (инструмент → ингредиент) неочевиден
      const isHint = hintOpts.some((o) => (o.do === 'add' || o.do === prepMode) && o.ingredient === ing.id);
      if (isHint) b.className += ' primary';
      b.innerHTML = `${ing.icon} ${ing.name}`;
      b.title = prepTool ? `${prepTool.verb}: ${ing.name}` : ing.name;
      b.addEventListener('click', () => onAction({ do: 'add', ingredient: ing.id }));
      ingRow.appendChild(b);
    }
    // Подсветка инструмента из подсказки; инструмент подготовки светится при своём
    // шаге, пока не выбран (сначала инструмент, потом ингредиент)
    for (const [d, btn] of Object.entries(toolBtns)) {
      btn.className = 'small' + (hintOpts.some((o) => o.do === d) ? ' primary' : '');
    }
    for (const t of PREP_TOOLS) {
      const btn = prepBtns[t.do];
      const need = hintOpts.some((o) => o.do === t.do);
      btn.className = 'small' + ((prepMode === t.do || need) ? ' primary' : '');
      btn.innerHTML = prepMode === t.do ? `${t.icon} ${t.active}` : `${t.icon} ${t.label}`;
    }
    const lidNeed = hintOpts.some((o) => o.do === 'cover' || o.do === 'uncover');
    lid.className = 'small' + (lidNeed ? ' primary' : '');
    lid.innerHTML = lidOn() ? '🍲 Снять крышку' : '🍲 Крышка';

    // Книга рецептов: хвост прячется частично (последние hideCount шагов),
    // во время запоминания — отсчёт прямо в панели книги
    const hideCount = brewHiddenCount(level);
    book.innerHTML = '<div class="brew-book-title">📖 Рецепт</div>';
    // Отсчёт — только при живом таймере (в уютном режиме его нет совсем)
    if (level.hideRecipe && !recipeHidden && peekTimer) {
      const peek = document.createElement('div');
      peek.className = 'brew-peek-count';
      peek.textContent = `👁 Запоминай! Хвост скроется через ${peekLeft} сек…`;
      book.appendChild(peek);
    }
    level.recipe.forEach((s, i) => {
      const row = document.createElement('div');
      const done = i < puzzle.progress;
      const current = i === puzzle.progress && !finished;
      row.className = 'brew-step' + (done ? ' done' : '') + (current ? ' current' : '');
      const hidden = recipeHidden && !done && i >= total - hideCount;
      // Шаг с повторами (times): у текущего показываем, сколько уже сделано
      const repNote = current && !hidden && (s.times ?? 1) > 1 ? ` (${puzzle.reps}/${s.times})` : '';
      row.textContent = done
        ? `${i + 1}. ${brewStepText(level, s)} ✓`
        : hidden
          ? `${i + 1}. · · ·`
          : `${i + 1}. ${brewStepText(level, s)}${repNote}`;
      book.appendChild(row);
    });
    if (recipeHidden) {
      const note = document.createElement('div');
      note.className = 'brew-book-note';
      note.textContent = `📕 Последние ${hideCount} шага скрыты — по памяти! «Заново» откроет книгу ещё раз.`;
      book.appendChild(note);
    }
    if (cozy() && level.hideRecipe) {
      const note = document.createElement('div');
      note.className = 'brew-book-note';
      note.textContent = '📖 Уютный режим: рецепт не скрывается — вари в удовольствие.';
      book.appendChild(note);
    }
    if (btnCozy) btnCozy.innerHTML = cozy() ? '📖 Книга открыта' : '📕 Держать книгу открытой';

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
    if (ev.key === 'Escape') backToPuzzleType(ctx, level);
  }
  window.addEventListener('keydown', onKey);

  draw();

  return () => {
    window.removeEventListener('keydown', onKey);
    for (const t of timers) clearTimeout(t);
  };
}
