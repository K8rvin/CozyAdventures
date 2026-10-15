// Экран головоломки «Карты судьбы»: стол гадания (арт assets/fate/fate_table_web.jpg,
// фолбэк — тёмный градиент). Гость рассказывает историю ПОРЦИЯМИ — репликами
// в речевом пузыре; переслушать части истории можно тапом по пустой позиции
// расклада на столе. Карты: тап — в выбранную (или первую свободную) позицию,
// перетаскивание — pointer events (мышь и тач). Рука статична: сыгранная карта
// оставляет пустое гнездо, остальные не сдвигаются. Наведение/нажатие на карту —
// увеличенное превью со значениями в боковой панели (на картах текста нет).
// История неверных раскладов — в отдельной панели справа под превью (на столе
// её нет, стол не тянется); «Сброс» очищает и историю раскладов. Полный расклад
// сначала получает последовательный световой и звуковой вердикт по каждой карте.
import {
  createFatePuzzle, placeCardAt, removeSlot, undoFate, resetFate,
  submitFate, applyFateHint, rewardFactor, fateProgress, isFull, markSpread,
  FATE_FREE_MISTAKES, FATE_MISTAKE_STEP,
} from '../core/fatePuzzle.js';
import { FATE_CARDS } from '../data/puzzlesFate.js';
import { completePuzzle, nextPuzzle } from '../core/state.js';
import { header, showOverlay, puzzleSkipButton, backToPuzzleType } from './common.js';

export function renderFatePuzzle(container, ctx, level) {
  const puzzle = createFatePuzzle(level, FATE_CARDS);
  let hintsUsed = 0;
  let finished = false;
  let checking = false;
  let disposed = false;
  const timers = [];
  let viewSlot = null; // какая реплика показана в пузыре (null — первая пустая)

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

  // Панель-легенда: в покое — правила; при наведении на карту — её превью
  const legend = document.createElement('div');
  legend.className = 'panel fate-panel';
  const LEGEND_HTML = `<div class="desc" style="line-height:1.8">
    Тапни карту или <b>перетащи</b> её на позицию расклада на столе. Тап по карте на столе — вернёт её в руку.<br>
    Гость рассказывает историю по частям — тапай пустую позицию расклада, чтобы переслушать реплику.<br>
    Наведи на карту — увидишь её значения здесь, в панели.<br>
    Полный расклад проверяется: <span class="lg-exact">карта на месте</span>,
    <span class="lg-present">близко по смыслу</span>, <span class="lg-absent">не та карта</span>.<br>
    ${FATE_FREE_MISTAKES} ошибки бесплатно, дальше −${Math.round(FATE_MISTAKE_STEP * 100)}% монет за каждую.</div>`;
  legend.innerHTML = LEGEND_HTML;
  side.appendChild(legend);

  // Панель истории раскладов — справа под превью, фоном кусок стола
  const logPanel = document.createElement('div');
  logPanel.className = 'panel fate-log';
  side.appendChild(logPanel);

  const controls = document.createElement('div');
  controls.className = 'puzzle-controls';
  controls.style.marginTop = '10px';
  const btnUndo = mkBtn('↩️ Отмена (Z)', doUndo);
  const btnHint = mkBtn('💡 Подсказка (H)', doHint);
  const btnReset = mkBtn('🔄 Сброс (R)', doReset);
  const btnSkip = puzzleSkipButton(ctx, level, () => backToPuzzleType(ctx, level));
  controls.append(btnUndo, btnHint, btnReset);
  controls.appendChild(btnSkip);
  side.appendChild(controls);

  wrap.appendChild(side);
  container.appendChild(wrap);

  let slotEls = []; // рамки позиций на столе (для подсветки при драге)

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
    scene.classList.toggle('checking', value);
    for (const b of [btnUndo, btnHint, btnReset, btnSkip]) b.disabled = value;
  }

  // Текущая реплика: явно выбранная, иначе первая пустая позиция
  function shownSlot() {
    if (viewSlot != null) return viewSlot;
    const first = puzzle.slots.indexOf(null);
    return first < 0 ? level.story.length - 1 : first;
  }

  // Позиция для тапа по карте: выбранная пустая, иначе первая свободная
  function targetSlot() {
    if (viewSlot != null && !puzzle.slots[viewSlot]) return viewSlot;
    return puzzle.slots.indexOf(null);
  }

  function doUndo() {
    if (finished || checking) return;
    if (undoFate(puzzle)) { viewSlot = null; ctx.sfx?.('tap'); renderAll(); }
  }
  function doReset() {
    if (finished || checking) return;
    resetFate(puzzle);
    viewSlot = null;
    ctx.sfx?.('tap');
    renderAll();
  }
  function doHint() {
    if (finished || checking) return;
    const h = applyFateHint(puzzle);
    ctx.sfx?.('hint');
    if (h) {
      hintsUsed += 1;
      viewSlot = null;
      const part = level.story[h.slot];
      const card = FATE_CARDS[h.card];
      ctx.toast(`Кот-хранитель мурлычет: на «${part.label}» ложится карта «${card.name}»`);
      renderAll();
      afterMove();
    } else {
      ctx.toast('Расклад полон — проверь его или верни карту.');
    }
  }

  // --- Превью карты в боковой панели ---
  let previewCard = null;
  function showPreview(cardId) {
    previewCard = cardId;
    const card = FATE_CARDS[cardId];
    legend.innerHTML = '';
    const box = document.createElement('div');
    box.className = 'fate-preview';
    const frame = document.createElement('div');
    frame.className = 'fate-preview-frame';
    const icon = document.createElement('span');
    icon.className = 'fate-preview-icon';
    icon.textContent = card.icon;
    frame.appendChild(icon);
    const img = document.createElement('img');
    img.className = 'fate-preview-art';
    img.alt = card.name;
    img.addEventListener('error', () => img.remove());
    img.src = `assets/fate/card_${cardId}_web.jpg`;
    frame.appendChild(img);
    box.appendChild(frame);
    const name = document.createElement('div');
    name.className = 'fate-preview-name';
    name.textContent = card.name;
    box.appendChild(name);
    const meanings = document.createElement('div');
    meanings.className = 'fate-preview-meanings';
    meanings.textContent = card.meanings.join(' · ');
    box.appendChild(meanings);
    legend.appendChild(box);
  }
  function hidePreview(cardId) {
    if (previewCard !== cardId) return;
    previewCard = null;
    legend.innerHTML = LEGEND_HTML;
  }

  // --- Карта (рука или стол): арт без текста, драг и тап ---
  function cardEl(cardId, fromSlot) {
    const card = FATE_CARDS[cardId];
    const b = document.createElement('div');
    b.className = 'fate-card' + (fromSlot == null ? ' in-hand' : ' on-table');
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
    // Превью по наведению (мышь) и по нажатию (тач)
    b.addEventListener('pointerenter', () => showPreview(cardId));
    b.addEventListener('pointerleave', () => hidePreview(cardId));
    makeDraggable(b, cardId, fromSlot);
    return b;
  }

  function makeDraggable(el, cardId, fromSlot) {
    el.addEventListener('pointerdown', (ev) => {
      if (finished || checking) return;
      ev.preventDefault();
      const startX = ev.clientX;
      const startY = ev.clientY;
      let dragging = false;
      let ghost = null;
      showPreview(cardId);

      const onMove = (e) => {
        if (!dragging && Math.hypot(e.clientX - startX, e.clientY - startY) > 7) {
          dragging = true;
          ghost = el.cloneNode(true);
          ghost.classList.add('fate-ghost');
          document.body.appendChild(ghost);
          el.classList.add('fate-drag-src');
        }
        if (dragging && ghost) {
          ghost.style.left = `${e.clientX - ghost.offsetWidth / 2}px`;
          ghost.style.top = `${e.clientY - ghost.offsetHeight / 2}px`;
          markDropTarget(e.clientX, e.clientY);
        }
      };
      const onUp = (e) => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        clearDropTarget();
        if (ghost) ghost.remove();
        el.classList.remove('fate-drag-src');
        hidePreview(cardId);
        if (!dragging) {
          // Тап: из руки — в выбранную (или первую свободную) позицию; со стола — в руку
          if (fromSlot == null) {
            const want = targetSlot();
            if (want >= 0 && placeCardAt(puzzle, cardId, want)) {
              viewSlot = null;
              ctx.sfx?.('rotate');
              renderAll();
              afterMove();
            }
          } else if (removeSlot(puzzle, fromSlot)) {
            viewSlot = null;
            ctx.sfx?.('tap');
            renderAll();
          }
          return;
        }
        const slot = slotAt(e.clientX, e.clientY);
        if (fromSlot == null) {
          if (slot != null && !puzzle.slots[slot]) {
            placeCardAt(puzzle, cardId, slot);
            viewSlot = null;
            ctx.sfx?.('rotate');
            renderAll();
            afterMove();
          }
        } else if (slot == null) {
          // Со стола мимо расклада — вернуть в руку
          removeSlot(puzzle, fromSlot);
          viewSlot = null;
          ctx.sfx?.('tap');
          renderAll();
        } else if (slot !== fromSlot && !puzzle.slots[slot]) {
          removeSlot(puzzle, fromSlot);
          placeCardAt(puzzle, cardId, slot);
          viewSlot = null;
          ctx.sfx?.('rotate');
          renderAll();
          afterMove();
        }
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    });
  }

  // --- Подсветка позиции под курсором при перетаскивании ---
  function slotAt(x, y) {
    for (let i = 0; i < slotEls.length; i++) {
      const r = slotEls[i].getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return i;
    }
    return null;
  }
  function markDropTarget(x, y) {
    const s = slotAt(x, y);
    slotEls.forEach((el, i) => {
      el.classList.toggle('drop-ok', i === s && !puzzle.slots[i]);
    });
  }
  function clearDropTarget() {
    slotEls.forEach((el) => el.classList.remove('drop-ok'));
  }

  // Полный расклад сначала раскрывается слева направо, и только потом применяется исход.
  function afterMove() {
    if (checking || finished || !isFull(puzzle)) return;
    const marks = markSpread(puzzle, [...puzzle.slots]);
    const verdictEls = [...slotEls];
    const STEP_MS = 650;
    setChecking(true);

    marks.forEach((mark, i) => {
      later(() => {
        verdictEls.forEach((el) => el.classList.remove('fate-verdict-current'));
        const exact = mark === 'exact';
        verdictEls[i].classList.add(
          exact ? 'fate-verdict-exact' : 'fate-verdict-miss',
          'fate-verdict-current',
        );
        ctx.sfx?.(exact ? 'fateExact' : 'fateMiss', i);
      }, 250 + i * STEP_MS);
    });

    later(() => {
      const res = submitFate(puzzle);
      if (res?.solved) { finish(); return; }
      setChecking(false);
      if (!res) { renderAll(); return; }
      ctx.sfx?.('fail');
      const over = puzzle.mistakes - FATE_FREE_MISTAKES;
      ctx.toast(over <= 0
        ? `Судьба не сходится — карты вернулись. Ошибка ${puzzle.mistakes} из ${FATE_FREE_MISTAKES} бесплатных.`
        : `Ошибка ${puzzle.mistakes}: сомнения гостя съедают награду (−${Math.round((1 - rewardFactor(puzzle)) * 100)}% монет).`);
      scene.classList.add('shake');
      later(() => scene.classList.remove('shake'), 500);
      renderAll();
    }, 250 + marks.length * STEP_MS + 400);
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
    later(() => {
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

  // Речевой пузырь гостя: показанная реплика (листание — тапом по позициям на столе)
  function renderBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'fate-bubble';
    const part = level.story[shownSlot()];
    const chip = document.createElement('span');
    chip.className = 'fate-bubble-chip';
    chip.textContent = part.label;
    bubble.appendChild(chip);
    const text = document.createElement('span');
    text.className = 'fate-bubble-text';
    text.textContent = `«${part.text}»`;
    bubble.appendChild(text);
    return bubble;
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

    // Гость: портрет с фолбэком на иконку + имя + речевой пузырь
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
    guestBar.appendChild(renderBubble());
    scene.appendChild(guestBar);

    // Расклад на столе: позиции с подписями
    slotEls = [];
    const active = shownSlot();
    const spread = document.createElement('div');
    spread.className = 'fate-spread';
    level.story.forEach((part, si) => {
      const cell = document.createElement('div');
      cell.className = 'fate-spread-cell';
      const slotCard = puzzle.slots[si];
      if (slotCard) {
        cell.appendChild(cardEl(slotCard, si));
      } else {
        const empty = document.createElement('div');
        empty.className = 'fate-slot' + (si === active ? ' active' : '');
        empty.textContent = '?';
        empty.title = 'Тапни, чтобы слушать эту реплику';
        empty.addEventListener('click', () => {
          viewSlot = si;
          ctx.sfx?.('tap');
          renderAll();
        });
        cell.appendChild(empty);
      }
      slotEls.push(cell.lastElementChild);
      const chip = document.createElement('div');
      chip.className = 'fate-slot-label';
      chip.textContent = part.label;
      cell.appendChild(chip);
      spread.appendChild(cell);
    });
    scene.appendChild(spread);

    // Рука статична: сыгранная карта оставляет пустое гнездо, места не едут.
    // Порядок — перемешанный при создании уровня (puzzle.hand)
    const hand = document.createElement('div');
    hand.className = 'fate-hand';
    puzzle.hand.forEach((cardId) => {
      if (puzzle.slots.includes(cardId)) {
        const hole = document.createElement('div');
        hole.className = 'fate-hand-hole';
        hand.appendChild(hole);
        return;
      }
      hand.appendChild(cardEl(cardId, null));
    });
    scene.appendChild(hand);

    // История неверных раскладов — в боковой панели под превью (стол свободен).
    // Прокрутка — мини-паучок на нити, как в основной игре (нативный скролл скрыт)
    logPanel.innerHTML = '<div class="fate-log-title">🃏 История раскладов</div>';
    const attemptsWrap = document.createElement('div');
    attemptsWrap.className = 'fate-attempts-wrap';
    const attemptsBox = document.createElement('div');
    attemptsBox.className = 'fate-attempts';
    if (!puzzle.attempts.length) {
      const empty = document.createElement('div');
      empty.className = 'muted';
      empty.style.fontSize = '13px';
      empty.textContent = 'Пока ни одного — судьба благоволит.';
      attemptsBox.appendChild(empty);
    }
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
      attemptsBox.appendChild(row);
    }
    attemptsWrap.appendChild(attemptsBox);
    // Мини-паучок: нить сверху до текущей позиции, паучок ползёт за скроллом
    const spTrack = document.createElement('div');
    spTrack.className = 'fate-spidertrack';
    spTrack.innerHTML = '<span class="thread"></span><div class="mover"><span class="bug">🕷️</span></div>';
    attemptsWrap.appendChild(spTrack);
    logPanel.appendChild(attemptsWrap);
    const spThread = spTrack.querySelector('.thread');
    const spMover = spTrack.querySelector('.mover');
    const updateSpider = () => {
      const over = (attemptsBox.scrollHeight || 0) - (attemptsBox.clientHeight || 0);
      if (!(over > 4)) { spTrack.style.display = 'none'; return; }
      spTrack.style.display = '';
      const ratio = attemptsBox.scrollTop / over;
      const trackH = spTrack.clientHeight || attemptsBox.clientHeight || 0;
      const y = ratio * Math.max(0, trackH - 20);
      spMover.style.transform = `translateY(${y}px)`;
      spThread.style.height = `${Math.max(0, y + 8)}px`;
    };
    attemptsBox.addEventListener('scroll', updateSpider);
    // В тестовом DOM-стабе requestAnimationFrame нет — обновляем напрямую
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(updateSpider);
    else updateSpider();

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
    disposed = true;
    window.removeEventListener('keydown', onKey);
    for (const t of timers) clearTimeout(t);
  };
}
