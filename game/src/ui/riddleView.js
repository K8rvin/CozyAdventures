// Экран головоломки «Загадка Хранителя»: стих/загадка, история попыток
// с расцветкой (на месте / есть в ответе / нет), окошки ответа, алфавит.
import {
  createRiddlePuzzle, placeLetter, removeSlot, undoRiddle, resetRiddle,
  submitRiddle, isRiddleSolved, applyRiddleHint, rewardFactor, letterMarks,
  ALPHABET, FREE_MISTAKES, MISTAKE_STEP,
} from '../core/riddlePuzzle.js';
import { completePuzzle, nextPuzzle } from '../core/state.js';
import { header, showOverlay, puzzleSkipButton } from './common.js';

export function renderRiddlePuzzle(container, ctx, level) {
  const puzzle = createRiddlePuzzle(level);
  let hintsUsed = 0;
  let finished = false;

  container.appendChild(header(ctx, level.name, `Сложность: ${'★'.repeat(level.difficulty)}`, 'puzzles'));

  const wrap = document.createElement('div');
  wrap.className = 'puzzle-wrap';

  const pageBox = document.createElement('div');
  pageBox.className = 'puzzle-canvas-box';
  const page = document.createElement('div');
  page.className = 'riddle-page';
  pageBox.appendChild(page);
  wrap.appendChild(pageBox);

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
  legend.className = 'panel';
  legend.style.padding = '10px 14px';
  legend.innerHTML = `<div class="desc" style="line-height:1.8">
    Тапай буквы алфавита — они встанут в окошки ответа. Тап по окошку убирает букву.<br>
    Заполненная строка проверяется: <span class="lg-exact">буква на месте</span>,
    <span class="lg-present">есть в ответе</span>, <span class="lg-absent">нет в ответе</span>.<br>
    ${FREE_MISTAKES} ошибок бесплатно, дальше −${Math.round(MISTAKE_STEP * 100)}% монет за каждую.</div>`;
  side.appendChild(legend);

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
    if (undoRiddle(puzzle)) { ctx.sfx?.('tap'); renderAll(); }
  }
  function doReset() {
    if (finished) return;
    resetRiddle(puzzle);
    ctx.sfx?.('tap');
    renderAll();
  }
  function doHint() {
    if (finished) return;
    const h = applyRiddleHint(puzzle);
    ctx.sfx?.('hint');
    if (h) {
      hintsUsed += 1;
      ctx.toast(`Кот-хранитель шепчет: на место ${h.slot + 1} ложится «${h.letter}»`);
      renderAll();
      afterMove();
    } else {
      ctx.toast('Строка полна — реши её или убери букву.');
    }
  }

  function tapKey(letter) {
    if (finished) return;
    if (placeLetter(puzzle, letter)) {
      ctx.sfx?.('tap');
      renderAll();
      afterMove();
    }
  }

  function tapSlot(slot) {
    if (finished) return;
    if (removeSlot(puzzle, slot)) {
      ctx.sfx?.('tap');
      renderAll();
    }
  }

  // После хода: строка заполнена — проверяем ответ
  function afterMove() {
    const res = submitRiddle(puzzle);
    if (!res) return;
    if (res.solved) { finish(); return; }
    ctx.sfx?.('fail');
    const over = puzzle.mistakes - FREE_MISTAKES;
    ctx.toast(over <= 0
      ? `Не то слово — страница в кляксе. Ошибка ${puzzle.mistakes} из ${FREE_MISTAKES} бесплатных.`
      : `Ошибка ${puzzle.mistakes}: кляксы съедают награду (−${Math.round((1 - rewardFactor(puzzle)) * 100)}% монет).`);
    page.classList.add('shake');
    setTimeout(() => page.classList.remove('shake'), 500);
    renderAll();
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
    const factor = rewardFactor(puzzle);
    const rewards = completePuzzle(ctx.state, level.id, {
      moves: puzzle.moves, hintsUsed, coinFactor: factor,
    });
    ctx.save();
    ctx.sfx?.('success');
    renderAll();
    setTimeout(() => {
      const next = nextPuzzle(level.id);
      showOverlay(ctx, {
        title: '📜 Загадка отгадана!',
        subtitle: `«${level.name}» — ${level.answer.replaceAll('✦', ' · ')}`
          + (level.author ? ` <span class="muted">(${level.author})</span>` : '')
          + (factor < 1 ? `<br>Кляксы съели часть награды (−${Math.round((1 - factor) * 100)}% монет).` : ''),
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

  // Ряд букв-окошек (текущая строка или попытка из истории)
  function slotsRow(letters, marks) {
    const row = document.createElement('div');
    row.className = 'riddle-slots';
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
      if (marks) {
        cell.className = `riddle-slot mark-${marks[li]}`;
        cell.textContent = letter;
      } else {
        cell.className = 'riddle-slot' + (letter ? ' filled' : '');
        cell.textContent = letter || '';
        const idx = li;
        cell.addEventListener('click', () => tapSlot(idx));
      }
      row.appendChild(cell);
      li += 1;
    }
    return row;
  }

  function renderAll() {
    page.innerHTML = '';

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
    page.appendChild(verse);

    // История попыток с расцветкой
    for (const att of puzzle.attempts) {
      page.appendChild(slotsRow(att.letters, att.marks));
    }

    // Текущая строка
    page.appendChild(slotsRow(puzzle.slots, null));

    // Алфавит с окраской клавиш по прошлым попыткам
    const marks = letterMarks(puzzle);
    const kb = document.createElement('div');
    kb.className = 'cipher-palette riddle-keyboard';
    for (const letter of ALPHABET) {
      const b = document.createElement('button');
      b.className = 'cipher-letter' + (marks[letter] ? ` mark-${marks[letter]}` : '');
      b.textContent = letter;
      b.addEventListener('click', () => tapKey(letter));
      kb.appendChild(b);
    }
    page.appendChild(kb);

    // --- Статус ---
    const factor = rewardFactor(puzzle);
    const left = Math.max(0, FREE_MISTAKES - puzzle.mistakes);
    statusEl.innerHTML =
      `🖋 Ошибок: <b>${puzzle.mistakes}</b>`
      + (factor >= 1
        ? ` · бесплатных осталось: <b>${left}</b>`
        : ` · награда: <b>−${Math.round((1 - factor) * 100)}% монет</b>`)
      + `<div class="muted" style="font-size:13px">Попыток в истории: ${puzzle.attempts.length} · Подсказки: ${hintsUsed}</div>`;
  }

  renderAll();

  return () => {
    window.removeEventListener('keydown', onKey);
  };
}
