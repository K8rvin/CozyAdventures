// Экран головоломки «Карты судьбы»: стол гадания (арт assets/fate/fate_table_web.jpg,
// фолбэк — тёмный градиент), портрет гостя, полоски истории с позициями расклада,
// рука карт веером. Расцветка расклада — как в «Загадке Хранителя».
import {
  createFatePuzzle, placeCard, removeSlot, undoFate, resetFate,
  submitFate, applyFateHint, rewardFactor, fateProgress,
  FATE_FREE_MISTAKES, FATE_MISTAKE_STEP,
} from '../core/fatePuzzle.js';
import { FATE_CARDS } from '../data/puzzlesFate.js';
import { completePuzzle, nextPuzzle } from '../core/state.js';
import { header, showOverlay, puzzleSkipButton, backToPuzzleType } from './common.js';

export function renderFatePuzzle(container, ctx, level) {
  const puzzle = createFatePuzzle(level, FATE_CARDS);
  let hintsUsed = 0;
  let finished = false;

  container.appendChild(header(ctx, level.name, `Сложность: ${'★'.repeat(level.difficulty)}`, ['puzzles', { mech: level.mechanic || 'mirror' }]));

  const wrap = document.createElement('div');
  // Раскладка как в «Строках» и «Загадках»: сцена слева во всю ширину, панель справа
  wrap.className = 'puzzle-wrap hang-wrap';

  const pageBox = document.createElement('div');
  pageBox.className = 'puzzle-canvas-box';
  const scene = document.createElement('div');
  scene.className = 'fate-scene';
  pageBox.appendChild(scene);
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
    Тапай карту — она ляжет в первую свободную позицию расклада. Тап по карте в раскладе — вернёт её в руку.<br>
    Под именем карты видны её значения: читай историю гостя и подбирай по смыслу.<br>
    Полный расклад проверяется: <span class="lg-exact">карта на месте</span>,
    <span class="lg-present">близко по смыслу</span>, <span class="lg-absent">не та карта</span>.<br>
    ${FATE_FREE_MISTAKES} ошибки бесплатно, дальше −${Math.round(FATE_MISTAKE_STEP * 100)}% монет за каждую.</div>`;
  side.appendChild(legend);

  const controls = document.createElement('div');
  controls.className = 'puzzle-controls';
  controls.style.marginTop = '10px';
  const btnUndo = mkBtn('↩️ Отмена (Z)', doUndo);
  const btnHint = mkBtn('💡 Подсказка (H)', doHint);
  const btnReset = mkBtn('🔄 Сброс (R)', doReset);
  controls.append(btnUndo, btnHint, btnReset);
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

  function doUndo() {
    if (finished) return;
    if (undoFate(puzzle)) { ctx.sfx?.('tap'); renderAll(); }
  }
  function doReset() {
    if (finished) return;
    resetFate(puzzle);
    ctx.sfx?.('tap');
    renderAll();
  }
  function doHint() {
    if (finished) return;
    const h = applyFateHint(puzzle);
    ctx.sfx?.('hint');
    if (h) {
      hintsUsed += 1;
      const part = level.story[h.slot];
      const card = FATE_CARDS[h.card];
      ctx.toast(`Кот-хранитель мурлычет: на «${part.label}» ложится карта «${card.name}»`);
      renderAll();
      afterMove();
    } else {
      ctx.toast('Расклад полон — проверь его или верни карту.');
    }
  }

  function tapCard(cardId) {
    if (finished) return;
    if (placeCard(puzzle, cardId)) {
      ctx.sfx?.('rotate');
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

  // После хода: расклад полон — проверяем
  function afterMove() {
    const res = submitFate(puzzle);
    if (!res) return;
    if (res.solved) { finish(); return; }
    ctx.sfx?.('fail');
    const over = puzzle.mistakes - FATE_FREE_MISTAKES;
    ctx.toast(over <= 0
      ? `Судьба не сходится — карты вернулись. Ошибка ${puzzle.mistakes} из ${FATE_FREE_MISTAKES} бесплатных.`
      : `Ошибка ${puzzle.mistakes}: сомнения гостя съедают награду (−${Math.round((1 - rewardFactor(puzzle)) * 100)}% монет).`);
    scene.classList.add('shake');
    setTimeout(() => scene.classList.remove('shake'), 500);
    renderAll();
  }

  function onKey(ev) {
    if (ev.key === 'Escape') { backToPuzzleType(ctx, level); return; }
    if ((ev.ctrlKey || ev.metaKey) && ['z', 'Z', 'я', 'Я'].includes(ev.key)) {
      ev.preventDefault();
      doUndo();
      return;
    }
    if (ev.ctrlKey || ev.altKey || ev.metaKey) return;
    if (ev.key === 'z' || ev.key === 'Z') { ev.preventDefault(); doUndo(); }
    if (ev.key === 'h' || ev.key === 'H') doHint();
    if (ev.key === 'r' || ev.key === 'R') doReset();
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
      const spread = puzzle.slots.map((c) => FATE_CARDS[c].name).join(' · ');
      showOverlay(ctx, {
        title: '🔮 Судьба разложена!',
        subtitle: `«${level.name}»: ${spread}`
          + `<br><span class="muted">${level.guest.icon} ${level.guest.name} благодарит и уходит в ночь.</span>`
          + (factor < 1 ? `<br>Сомнения гостя съели часть награды (−${Math.round((1 - factor) * 100)}% монет).` : ''),
        rewards,
        buttons: [
          ...(next ? [{ label: `Следующий гость → ${next.name}`, primary: true, onClick: () => ctx.go('puzzle', { id: next.id }) }] : []),
          { label: 'К загадкам', primary: !next, onClick: () => backToPuzzleType(ctx, level) },
          { label: 'Ещё раз', onClick: () => ctx.go('puzzle', { id: level.id }) },
          { label: 'В лавку', onClick: () => ctx.go('hub') },
        ],
      });
    }, 450);
  }

  // Карта из руки: арт с фолбэком на иконку
  function cardEl(cardId, i, mark) {
    const card = FATE_CARDS[cardId];
    const b = document.createElement('button');
    b.className = 'fate-card' + (mark ? ` mark-${mark}` : '');
    if (i % 2 === 0) b.classList.add('tilt-l');
    else b.classList.add('tilt-r');
    const icon = document.createElement('span');
    icon.className = 'fate-card-icon';
    icon.textContent = card.icon;
    b.appendChild(icon);
    const img = document.createElement('img');
    img.className = 'fate-card-art';
    img.alt = card.name;
    img.addEventListener('error', () => img.remove());
    img.src = `assets/fate/card_${cardId}_web.jpg`;
    b.appendChild(img);
    const name = document.createElement('span');
    name.className = 'fate-card-name';
    name.textContent = card.name;
    b.appendChild(name);
    const meanings = document.createElement('span');
    meanings.className = 'fate-card-meanings';
    meanings.textContent = card.meanings.join(' · ');
    b.appendChild(meanings);
    return b;
  }

  function renderAll() {
    scene.innerHTML = '';

    // Фон стола (арт), фолбэк — тёмный градиент из CSS
    const tableImg = document.createElement('img');
    tableImg.className = 'fate-table-art';
    tableImg.alt = '';
    tableImg.addEventListener('error', () => tableImg.remove());
    tableImg.src = 'assets/fate/fate_table_web.jpg';
    scene.appendChild(tableImg);

    // Гость: портрет с фолбэком на иконку + имя
    const guestBar = document.createElement('div');
    guestBar.className = 'fate-guest';
    const portrait = document.createElement('div');
    portrait.className = 'fate-portrait';
    const pIcon = document.createElement('span');
    pIcon.className = 'fate-portrait-icon';
    pIcon.textContent = level.guest.icon;
    portrait.appendChild(pIcon);
    if (level.guest.art) {
      const pImg = document.createElement('img');
      pImg.className = 'fate-portrait-art';
      pImg.alt = level.guest.name;
      pImg.addEventListener('error', () => pImg.remove());
      pImg.src = level.guest.art;
      portrait.appendChild(pImg);
    }
    guestBar.appendChild(portrait);
    const gName = document.createElement('div');
    gName.className = 'fate-guest-name';
    gName.innerHTML = `<b>${level.guest.name}</b><div class="muted">просит расклад судьбы</div>`;
    guestBar.appendChild(gName);
    scene.appendChild(guestBar);

    // История: полоски с позициями расклада
    const story = document.createElement('div');
    story.className = 'fate-story';
    level.story.forEach((part, si) => {
      const strip = document.createElement('div');
      strip.className = 'fate-strip';
      const body = document.createElement('div');
      body.className = 'fate-strip-body';
      const label = document.createElement('div');
      label.className = 'fate-strip-label';
      label.textContent = part.label;
      body.appendChild(label);
      const text = document.createElement('div');
      text.className = 'fate-strip-text';
      text.textContent = part.text;
      body.appendChild(text);
      strip.appendChild(body);
      // Позиция расклада
      const slotCard = puzzle.slots[si];
      if (slotCard) {
        const placed = cardEl(slotCard, si, null);
        placed.classList.add('fate-placed');
        placed.addEventListener('click', () => tapSlot(si));
        strip.appendChild(placed);
      } else {
        const empty = document.createElement('div');
        empty.className = 'fate-slot';
        empty.textContent = '?';
        empty.addEventListener('click', () => tapSlot(si));
        strip.appendChild(empty);
      }
      story.appendChild(strip);
    });
    scene.appendChild(story);

    // История неверных раскладов с расцветкой
    for (const att of puzzle.attempts) {
      const row = document.createElement('div');
      row.className = 'fate-attempt';
      att.cards.forEach((cardId, ci) => {
        const mini = document.createElement('div');
        mini.className = `fate-mini mark-${att.marks[ci]}`;
        mini.textContent = FATE_CARDS[cardId].icon;
        mini.title = FATE_CARDS[cardId].name;
        row.appendChild(mini);
      });
      scene.appendChild(row);
    }

    // Рука: неразыгранные карты
    const hand = document.createElement('div');
    hand.className = 'fate-hand';
    level.hand.forEach((cardId, ci) => {
      if (puzzle.slots.includes(cardId)) return;
      const b = cardEl(cardId, ci, null);
      b.addEventListener('click', () => tapCard(cardId));
      hand.appendChild(b);
    });
    scene.appendChild(hand);

    // --- Статус ---
    const factor = rewardFactor(puzzle);
    const left = Math.max(0, FATE_FREE_MISTAKES - puzzle.mistakes);
    const prog = fateProgress(puzzle);
    statusEl.innerHTML =
      `🔮 Ошибок: <b>${puzzle.mistakes}</b>`
      + (factor >= 1
        ? ` · бесплатных осталось: <b>${left}</b>`
        : ` · награда: <b>−${Math.round((1 - factor) * 100)}% монет</b>`)
      + `<div class="muted" style="font-size:13px">Позиций закрыто: ${prog.ok}/${prog.total} · Подсказки: ${hintsUsed}</div>`;
  }

  renderAll();

  return () => {
    window.removeEventListener('keydown', onKey);
  };
}
