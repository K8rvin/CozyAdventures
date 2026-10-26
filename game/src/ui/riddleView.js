// Экран головоломки «Загадка Хранителя»: живые чернила, деревянные клавиши,
// последовательный вердикт, реплики кота и компактные черновики попыток.
import {
  createRiddlePuzzle, placeLetter, removeSlot, undoRiddle, resetRiddle,
  submitRiddle, isRiddleSolved, isFull, markAttempt, applyRiddleHint,
  rewardFactor, letterMarks, FREE_MISTAKES, MISTAKE_STEP,
} from '../core/riddlePuzzle.js';
import { completePuzzle, nextPuzzle } from '../core/state.js';
import { header, showOverlay, puzzleSkipButton, backToPuzzleType } from './common.js';
import { riddleChapter } from '../data/riddleChapters.js';

const VERDICT_STEP_MS = 110;
const VERDICT_SFX = {
  exact: 'riddleExact',
  present: 'riddlePresent',
  absent: 'riddleAbsent',
};
const KEEPER_REACTIONS = {
  exact: [
    'Мур… некоторые буквы уже сидят верно. Их тёплый след поможет с новой попыткой.',
    'Хранитель мягко стучит лапой по полям: верные места уже проступили. Остальное — дело следующей строки.',
    'Кот склоняет голову: несколько букв пришли прямо домой. Бережём их и продолжаем.',
  ],
  present: [
    'Эти буквы знакомы странице, но некоторые заблудились. Попробуй поменять им места.',
    'Мур… буквы те, да дорожки перепутали. Пусть побродят по строке и найдут свои места.',
    'Хранитель принюхался к чернилам: нужные буквы здесь, но слово пока не сложилось.',
  ],
  absent: [
    'Страница сморгнула кляксой: такого слова она не знает. Попробуем другое.',
    'Кот аккуратно прикрыл строку лапой. Не то слово — зато теперь мы знаем, куда не стоит идти.',
    'Мур… эти буквы сегодня не пришли на страницу. Сотрём сомнения и позовём другие.',
  ],
};
const HINT_REACTIONS = [
  (slot, letter) => `Мур… на место ${slot + 1} ложится «${letter}». Перо всё запишет.`,
  (slot, letter) => `Хранитель подводит перо к окошку ${slot + 1}: здесь должна быть «${letter}».`,
  (slot, letter) => `Кот шепчет странице, и над местом ${slot + 1} проступает «${letter}».`,
];

export function renderRiddlePuzzle(container, ctx, level) {
  const puzzle = createRiddlePuzzle(level);
  const chapter = riddleChapter(level);
  let hintsUsed = 0;
  let finished = false;
  let checking = false;
  let disposed = false;
  let lastInkSlot = null;
  let lastErasedSlot = null;
  let currentSlotEls = [];
  let keyEls = new Map();
  let reactionSerial = 0;
  let quillSerial = 0;
  let quillAvailable = true;
  const reactionCounts = { exact: 0, present: 0, absent: 0 };
  const timers = [];

  const subtitle = `Глава ${chapter.number}: ${chapter.name} · ${chapter.levelInChapter}/10`
    + ` · Сложность: ${'★'.repeat(level.difficulty)}${chapter.finale ? ' ✦' : ''}`;
  container.appendChild(header(ctx, level.name, subtitle, ['puzzles', { mech: level.mechanic || 'mirror' }]));

  const wrap = document.createElement('div');
  // Раскладка как в «Строках при свече»: страница с клавиатурой — во всю ширину,
  // боковая панель — фиксированные 300px (класс hang-wrap)
  wrap.className = 'puzzle-wrap hang-wrap';

  const pageBox = document.createElement('div');
  pageBox.className = 'puzzle-canvas-box riddle-stage';
  const page = document.createElement('div');
  page.className = 'riddle-page';
  page.classList.add(`riddle-theme-${chapter.theme}`);
  if (chapter.finale) page.classList.add('riddle-finale');
  pageBox.appendChild(page);
  const quillImg = document.createElement('img');
  quillImg.className = 'riddle-quill';
  quillImg.alt = '';
  quillImg.src = 'assets/trophies/tro_keeper_quill.png';
  quillImg.addEventListener('error', () => {
    quillAvailable = false;
    quillImg.remove();
  });
  pageBox.appendChild(quillImg);
  wrap.appendChild(pageBox);

  const side = document.createElement('div');
  side.className = 'puzzle-side';

  // Хранитель остаётся на экране и реагирует на события вместо технических toast'ов.
  const keeper = document.createElement('div');
  keeper.className = 'riddle-keeper';
  keeper.classList.add(`riddle-cat-${chapter.catPose}`);
  const portrait = document.createElement('div');
  portrait.className = 'riddle-keeper-portrait';
  const keeperImg = document.createElement('img');
  keeperImg.className = 'riddle-keeper-art';
  keeperImg.alt = 'Кот-хранитель';
  keeperImg.src = chapter.catArt;
  keeperImg.addEventListener('error', () => {
    keeperImg.remove();
    const fallback = document.createElement('span');
    fallback.className = 'riddle-keeper-fallback';
    fallback.textContent = '🐈';
    portrait.appendChild(fallback);
  });
  portrait.appendChild(keeperImg);
  const keeperText = document.createElement('div');
  keeperText.className = 'intro-text riddle-keeper-text';
  const finaleNote = chapter.finale ? ' Хранитель уже готовит сургучную печать.' : '';
  keeperText.textContent = `${level.intro} ${chapter.greeting}${finaleNote}`;
  keeperText.setAttribute('aria-live', 'polite');
  keeper.append(portrait, keeperText);
  side.appendChild(keeper);

  const statusEl = document.createElement('div');
  statusEl.className = 'puzzle-status';
  side.appendChild(statusEl);

  // На первом уровне правила раскрыты; дальше остаются доступны по клику,
  // но не занимают место у Хранителя и черновиков.
  const legend = document.createElement('details');
  legend.className = 'panel riddle-rules';
  legend.open = level.id === 'bk_01' && !ctx.state.puzzlesDone?.[level.id];
  legend.innerHTML = `<summary>Как играть</summary><div class="desc" style="line-height:1.8">
    Тапай буквы (можно и с клавиатуры) — они встанут в окошки ответа. Тап по окошку убирает букву.<br>
    Е и Ё — одна клавиша; при победе страница покажет правильное написание.<br>
    Заполненная строка проверяется: <span class="lg-exact">буква на месте</span>,
    <span class="lg-present">есть в ответе</span>, <span class="lg-absent">нет в ответе</span>.<br>
    ${FREE_MISTAKES} ошибок бесплатно, дальше −${Math.round(MISTAKE_STEP * 100)}% монет за каждую.</div>`;
  side.appendChild(legend);

  // Полная история живёт отдельно и не сдвигает клавиатуру вниз.
  const drafts = document.createElement('div');
  drafts.className = 'panel riddle-drafts';
  side.appendChild(drafts);

  const controls = document.createElement('div');
  controls.className = 'puzzle-controls';
  controls.style.marginTop = '10px';
  const btnUndo = mkBtn('↩️ Отмена (Z)', doUndo);
  const btnHint = mkBtn('💡 Подсказка (H)', doHint);
  const btnReset = mkBtn('🔄 Сброс (R)', doReset);
  const btnSkip = puzzleSkipButton(ctx, level, () => backToPuzzleType(ctx, level));
  controls.append(btnUndo, btnHint, btnReset, btnSkip);
  side.appendChild(controls);

  wrap.appendChild(side);
  container.appendChild(wrap);

  function mkBtn(label, fn) {
    const b = document.createElement('button');
    b.innerHTML = label;
    b.addEventListener('click', fn);
    return b;
  }

  function later(fn, ms) {
    const timer = setTimeout(() => { if (!disposed) fn(); }, ms);
    timers.push(timer);
    return timer;
  }

  function setChecking(value) {
    checking = value;
    page.classList.toggle('checking', checking);
    for (const b of [btnUndo, btnHint, btnReset, btnSkip]) {
      b.disabled = checking || finished;
    }
  }

  function react(text) {
    keeperText.textContent = text;
    const serial = ++reactionSerial;
    keeper.classList.add('is-speaking');
    later(() => {
      if (serial === reactionSerial) keeper.classList.remove('is-speaking');
    }, 350);
  }

  function pulseKey(letter) {
    const key = keyEls.get(letter);
    if (!key) return;
    key.classList.add('is-pressed');
    later(() => key.classList.remove('is-pressed'), 130);
  }

  // Перо подлетает к только что заполненному окошку и делает несколько
  // коротких движений. Координаты считаются после рендера, включая подсказку.
  function animateQuill(slot) {
    if (!quillAvailable) return;
    const cell = currentSlotEls[slot];
    if (!cell) return;
    const stageRect = pageBox.getBoundingClientRect();
    const cellRect = cell.getBoundingClientRect();
    const left = cellRect.left - stageRect.left + cellRect.width / 2 - 8;
    const top = cellRect.top - stageRect.top - 78;
    quillImg.style.left = `${Math.max(2, left)}px`;
    quillImg.style.top = `${Math.max(2, top)}px`;
    const serial = ++quillSerial;
    quillImg.classList.add('is-writing');
    later(() => {
      if (serial === quillSerial) quillImg.classList.remove('is-writing');
    }, 380);
  }

  function showInkBlot() {
    const blot = document.createElement('div');
    blot.className = 'riddle-ink-blot';
    page.appendChild(blot);
    later(() => blot.remove(), 850);
  }

  function doUndo() {
    if (finished || checking) return;
    const last = puzzle.history[puzzle.history.length - 1];
    if (undoRiddle(puzzle)) {
      lastInkSlot = last?.kind === 'remove' ? last.slot : null;
      lastErasedSlot = last?.kind === 'place' ? last.slot : null;
      ctx.sfx?.(last?.kind === 'remove' ? 'riddleWrite' : 'riddleErase');
      renderAll();
      if (last?.kind === 'remove') animateQuill(last.slot);
    }
  }

  function doReset() {
    if (finished || checking) return;
    resetRiddle(puzzle);
    lastInkSlot = null;
    lastErasedSlot = null;
    ctx.sfx?.('riddleErase');
    renderAll();
  }

  function doHint() {
    if (finished || checking) return;
    const h = applyRiddleHint(puzzle);
    if (h) {
      hintsUsed += 1;
      lastInkSlot = h.slot;
      lastErasedSlot = null;
      ctx.sfx?.('hint');
      const phrase = HINT_REACTIONS[(hintsUsed - 1) % HINT_REACTIONS.length];
      react(phrase(h.slot, h.letter));
      renderAll();
      animateQuill(h.slot);
      afterMove();
    } else {
      react('Строка уже полна. Сотри букву или дай странице проверить слово.');
    }
  }

  function tapKey(letter) {
    if (finished || checking) return;
    const slot = puzzle.slots.indexOf(null);
    if (placeLetter(puzzle, letter)) {
      lastInkSlot = slot;
      lastErasedSlot = null;
      ctx.sfx?.('riddleKey');
      ctx.sfx?.('riddleWrite');
      renderAll();
      animateQuill(slot);
      pulseKey(letter);
      afterMove();
    }
  }

  function tapSlot(slot) {
    if (finished || checking) return;
    if (removeSlot(puzzle, slot)) {
      lastInkSlot = null;
      lastErasedSlot = slot;
      ctx.sfx?.('riddleErase');
      renderAll();
    }
  }

  function reactToAttempt(marks) {
    const exact = marks.filter((m) => m === 'exact').length;
    const present = marks.filter((m) => m === 'present').length;
    const kind = exact > 0 ? 'exact' : present > 0 ? 'present' : 'absent';
    const options = KEEPER_REACTIONS[kind];
    const index = reactionCounts[kind]++;
    let text = options[index % options.length];
    if (puzzle.mistakes > FREE_MISTAKES) text += ' Клякса съела часть награды.';
    react(text);
  }

  // Заполненная строка сначала раскрывается слева направо, и только потом
  // применяется исход: неверная попытка уходит в черновики, верная — сияет.
  function afterMove() {
    if (finished || checking || !isFull(puzzle)) return;
    const letters = [...puzzle.slots];
    const solved = isRiddleSolved(puzzle);
    const marks = solved ? letters.map(() => 'exact') : markAttempt(level, letters);
    const verdictEls = [...currentSlotEls];
    setChecking(true);
    lastInkSlot = null;
    lastErasedSlot = null;

    marks.forEach((mark, i) => {
      later(() => {
        verdictEls.forEach((el) => el.classList.remove('verdict-current'));
        const el = verdictEls[i];
        if (!el) return;
        el.classList.add(`mark-${mark}`, 'verdict-current', 'verdict-reveal');
        ctx.sfx?.(VERDICT_SFX[mark], i);
      }, 120 + i * VERDICT_STEP_MS);
    });

    later(() => {
      const res = submitRiddle(puzzle);
      if (res?.solved) { finish(); return; }
      if (!res) { setChecking(false); renderAll(); return; }
      ctx.sfx?.('fail');
      renderAll();
      page.classList.add('shake');
      showInkBlot();
      reactToAttempt(marks);
      later(() => {
        page.classList.remove('shake');
        setChecking(false);
      }, 500);
    }, 120 + marks.length * VERDICT_STEP_MS + 220);
  }

  // Физическая клавиатура: кириллические буквы — ходы (как в «Строках при свече»);
  // Z/H/R латиницей — отмена/подсказка/сброс (русские З/Р/К — это буквы ответа)
  function onKey(ev) {
    if (ev.key === 'Escape') { backToPuzzleType(ctx, level); return; }
    if ((ev.ctrlKey || ev.metaKey) && ['z', 'Z', 'я', 'Я'].includes(ev.key)) {
      ev.preventDefault();
      doUndo();
      return;
    }
    if (ev.ctrlKey || ev.altKey || ev.metaKey) return;
    const ch = (ev.key || '').toUpperCase();
    if (/^[А-ЯЁ]$/.test(ch)) { tapKey(ch); return; }
    if (ev.key === 'z' || ev.key === 'Z') { ev.preventDefault(); doUndo(); }
    if (ev.key === 'h' || ev.key === 'H') doHint();
    if (ev.key === 'r' || ev.key === 'R') doReset();
  }
  window.addEventListener('keydown', onKey);

  function finish() {
    finished = true;
    setChecking(false);
    const factor = rewardFactor(puzzle);
    const rewards = completePuzzle(ctx.state, level.id, {
      moves: puzzle.moves, hintsUsed, coinFactor: factor,
      achievement: { attempts: puzzle.attempts.length },
    });
    ctx.save();
    page.classList.add('riddle-solved');
    renderAll();
    react('Вот оно, верное слово. Мур-р… Страница довольна, и Хранитель тоже.');
    ctx.sfx?.('page');
    ctx.sfx?.('success');
    later(() => ctx.sfx?.('purr'), 250);
    later(() => {
      const next = nextPuzzle(level.id);
      showOverlay(ctx, {
        title: '📜 Загадка отгадана!',
        subtitle: `«${level.name}» — ${level.answer.replaceAll('✦', ' · ')}`
          + (level.author ? ` <span class="muted">(${level.author})</span>` : '')
          + (factor < 1 ? `<br>Кляксы съели часть награды (−${Math.round((1 - factor) * 100)}% монет).` : ''),
        rewards,
        buttons: [
          ...(next ? [{ label: `Следующая → ${next.name}`, primary: true, onClick: () => ctx.go('puzzle', { id: next.id }) }] : []),
          { label: 'К загадкам', primary: !next, onClick: () => backToPuzzleType(ctx, level) },
          { label: 'Ещё раз', onClick: () => ctx.go('puzzle', { id: level.id }) },
          { label: 'В лавку', onClick: () => ctx.go('hub') },
        ],
      });
    }, 1100);
  }

  // Ряд букв-окошек (текущая строка или попытка из черновиков)
  function slotsRow(letters, marks, current = false) {
    const row = document.createElement('div');
    row.className = 'riddle-slots' + (current ? ' riddle-current' : '');
    let li = 0;
    for (const ch of level.answer) {
      if (ch === '✦') {
        const sep = document.createElement('div');
        sep.className = 'riddle-sep';
        sep.textContent = '✦';
        row.appendChild(sep);
        continue;
      }
      const cell = document.createElement('div');
      const letter = letters[li];
      const idx = li;
      if (marks) {
        cell.className = `riddle-slot mark-${marks[li]}`;
      } else {
        cell.className = 'riddle-slot' + (letter ? ' filled' : '');
        if (current) {
          if (lastInkSlot === idx) cell.classList.add('ink-fresh');
          if (lastErasedSlot === idx) cell.classList.add('ink-erased');
          if (finished) cell.style.animationDelay = `${idx * 70}ms`;
          cell.addEventListener('click', () => tapSlot(idx));
          currentSlotEls.push(cell);
        }
      }
      if (letter) {
        const glyph = document.createElement('span');
        glyph.className = 'riddle-glyph';
        glyph.textContent = letter;
        cell.appendChild(glyph);
      }
      row.appendChild(cell);
      li += 1;
    }
    return row;
  }

  function renderDrafts() {
    drafts.innerHTML = '';
    const title = document.createElement('div');
    title.className = 'riddle-drafts-title';
    title.textContent = 'Черновики Хранителя';
    drafts.appendChild(title);
    if (puzzle.attempts.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'muted riddle-drafts-empty';
      empty.textContent = 'Пока ни одной кляксы.';
      drafts.appendChild(empty);
      return;
    }
    puzzle.attempts.forEach((att, i) => {
      const item = document.createElement('div');
      item.className = 'riddle-draft';
      const label = document.createElement('div');
      label.className = 'riddle-draft-name';
      label.textContent = `Попытка ${i + 1}`;
      item.append(label, slotsRow(att.letters, att.marks));
      drafts.appendChild(item);
    });
  }

  function renderAll() {
    page.innerHTML = '';
    currentSlotEls = [];
    keyEls = new Map();

    // Пергаментный лист отделён от деревянной клавиатуры: текст, текущий ответ
    // и последний черновик живут на бумаге, а не на общей тёмной панели.
    const sheet = document.createElement('div');
    sheet.className = 'riddle-sheet';
    page.appendChild(sheet);

    const bookmark = document.createElement('div');
    bookmark.className = 'riddle-bookmark';
    bookmark.textContent = chapter.icon;
    bookmark.title = `Глава ${chapter.number}: ${chapter.name}`;
    bookmark.setAttribute('aria-hidden', 'true');
    const ornament = document.createElement('div');
    ornament.className = 'riddle-chapter-ornament';
    ornament.textContent = chapter.ornament;
    ornament.setAttribute('aria-hidden', 'true');
    sheet.append(bookmark, ornament);
    if (chapter.finale) {
      const seal = document.createElement('div');
      seal.className = 'riddle-wax-seal';
      seal.textContent = '✦';
      seal.title = `Особая страница: завершение главы ${chapter.number}`;
      seal.setAttribute('aria-label', seal.title);
      sheet.appendChild(seal);
    }

    const verse = document.createElement('div');
    verse.className = 'riddle-text';
    for (const line of level.riddle) {
      const p = document.createElement('div');
      p.textContent = line;
      verse.appendChild(p);
    }
    if (level.author) {
      const a = document.createElement('div');
      a.className = 'riddle-author';
      a.textContent = `— ${level.author}`;
      verse.appendChild(a);
    }
    sheet.appendChild(verse);

    // На листе остаётся только последняя попытка; место под неё зарезервировано,
    // поэтому клавиатура не прыгает ни после первой ошибки, ни после следующих.
    const lastAttempt = document.createElement('div');
    lastAttempt.className = 'riddle-last-attempt';
    const latest = puzzle.attempts[puzzle.attempts.length - 1];
    if (latest) lastAttempt.appendChild(slotsRow(latest.letters, latest.marks));
    sheet.appendChild(lastAttempt);

    // Текущая строка
    sheet.appendChild(slotsRow(puzzle.slots, null, true));

    // Клавиатура ЙЦУКЕН с окраской клавиш по прошлым попыткам.
    const marks = letterMarks(puzzle);
    const kb = document.createElement('div');
    kb.className = 'hang-kb has-art';
    const kbArt = document.createElement('img');
    kbArt.className = 'hang-kb-art';
    kbArt.alt = '';
    kbArt.addEventListener('error', () => { kbArt.remove(); kb.classList.remove('has-art'); });
    kbArt.src = 'assets/hang/hang_keyboard_scene.png';
    kb.appendChild(kbArt);
    const KB_ROWS = ['ЙЦУКЕНГШЩЗХЪ', 'ФЫВАПРОЛДЖЭ', 'ЯЧСМИТЬБЮ'];
    KB_ROWS.forEach((rowLetters, ri) => {
      const rowEl = document.createElement('div');
      rowEl.className = `hang-kb-row kb-row${ri + 1}`;
      for (const letter of rowLetters) {
        const b = document.createElement('button');
        b.className = 'cipher-letter hang-key' + (marks[letter] ? ` mark-${marks[letter]}` : '');
        b.textContent = letter;
        b.addEventListener('click', () => tapKey(letter));
        keyEls.set(letter, b);
        rowEl.appendChild(b);
      }
      kb.appendChild(rowEl);
    });
    page.appendChild(kb);

    renderDrafts();

    // --- Статус ---
    const factor = rewardFactor(puzzle);
    const left = Math.max(0, FREE_MISTAKES - puzzle.mistakes);
    statusEl.innerHTML =
      `🖋 Ошибок: <b>${puzzle.mistakes}</b>`
      + (factor >= 1
        ? ` · бесплатных осталось: <b>${left}</b>`
        : ` · награда: <b>−${Math.round((1 - factor) * 100)}% монет</b>`)
      + `<div class="muted" style="font-size:13px">Черновиков: ${puzzle.attempts.length} · Подсказки: ${hintsUsed}</div>`;
  }

  renderAll();

  return () => {
    disposed = true;
    timers.forEach(clearTimeout);
    window.removeEventListener('keydown', onKey);
  };
}
