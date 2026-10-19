// Экран головоломки «Гости за чайным столом»: комната — монолитный арт
// (level.room → SEATING_ROOMS[...].image, фолбэк — тёплый градиент из CSS).
// Особенности мест нарисованы в самом арте: поверх него живут только
// полупрозрачные интерактивные зоны мест, кружки портретов посаженных гостей
// и временные подсветки — постоянных DOM/SVG-спрайтов и эмодзи на сцене нет.
// Пока гость не рассажен — он прямоугольная карточка на подносе под сценой
// (портрет, имя, черты, пожелания); после посадки карточка становится пустым
// гнездом, а на месте появляется компактный кружок с тем же портретом.
// Посадка — drag-and-drop на pointer events (порог ~7px, призрак-клон,
// подсветка места под курсором), как в «Картах судьбы», плюс тапы: тап по
// карточке выбирает гостя, тап по месту сажает, тап по кружку поднимает
// гостя обратно на поднос. Бросок на занятое место — обмен (moveGuest).
// «Подать чай» проверяет рассадку без штрафов и таймера: при ошибке
// показывает первое несбывшееся пожелание. Подсказка кота реально
// сажает/пересаживает/поднимает гостя из единственного решения.
import {
  createSeatingPuzzle, seatGuest, moveGuest, removeGuest, undoSeating,
  resetSeating, seatingViolations, isSeatingSolved, seatingHint, guestAtSeat,
} from '../core/seatingPuzzle.js';
import { SEATING_ROOMS, SEAT_FEATURE_TEXT } from '../data/puzzlesSeating.js';
import { SEATING_GUESTS, TRAIT_LABEL } from '../data/seatingGuests.js';
import { GUEST_BY_ID } from '../data/guests.js';
import { completePuzzle, nextPuzzle } from '../core/state.js';
import { header, showOverlay, puzzleSkipButton, backToPuzzleType } from './common.js';

export function renderSeatingPuzzle(container, ctx, level) {
  const puzzle = createSeatingPuzzle(level, SEATING_ROOMS);
  const room = SEATING_ROOMS[level.room];
  let hintsUsed = 0;
  let finished = false;
  let disposed = false;
  const timers = [];
  let selected = null;   // гость, выбранный тапом по карточке (ещё на подносе)
  let hintMark = null;   // { guest, seat } — временная подсветка подсказки/нарушения

  container.appendChild(header(ctx, level.name, `Сложность: ${'★'.repeat(level.difficulty)}`, ['puzzles', { mech: 'seating' }]));

  const wrap = document.createElement('div');
  // Раскладка как в «Строках» и «Картах судьбы»: сцена слева, панель справа
  wrap.className = 'puzzle-wrap hang-wrap';

  const pageBox = document.createElement('div');
  pageBox.className = 'puzzle-canvas-box';
  const scene = document.createElement('div');
  scene.className = 'seat-scene';
  pageBox.appendChild(scene);

  // Поднос с карточками гостей — под сценой
  const tray = document.createElement('div');
  tray.className = 'seat-tray';
  pageBox.appendChild(tray);

  const btnServe = mkBtn('🫖 Подать чай', doServe);
  btnServe.className = 'primary seat-serve';
  pageBox.appendChild(btnServe);
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

  // Панель-превью: в покое — правила; при наведении — гость или место
  const preview = document.createElement('div');
  preview.className = 'panel seat-panel';
  const RULES_HTML = `<div class="desc" style="line-height:1.8">
    Гости ждут на подносе под сценой. <b>Перетащи</b> гостя на место — или тапни карточку, а потом место.<br>
    Тап по кружку на стуле поднимает гостя обратно. Брось гостя на занятое место — они поменяются.<br>
    Наведи на карточку, кружок или место — увидишь подробности здесь, в панели.<br>
    Закреплённый гость уже уютно сел — его не пересадить.<br>
    Когда все сядут — жми «Подать чай». Ошибиться не страшно: покажем первое несбывшееся пожелание.</div>`;
  preview.innerHTML = RULES_HTML;
  side.appendChild(preview);

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

  let seatZones = []; // [{ el, seat }] — для подсветки цели при перетаскивании

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

  function isFixedGuest(guestId) {
    return Object.prototype.hasOwnProperty.call(level.fixed || {}, guestId);
  }

  function wishesOf(guestId) {
    return (level.rules || []).filter((r) => r.guest === guestId);
  }

  // --- Превью в боковой панели ---
  let previewKey = null; // 'guest:id' или 'seat:id' — чтобы не сбрасывать чужое превью

  function showGuestPreview(guestId) {
    previewKey = `guest:${guestId}`;
    const g = GUEST_BY_ID[guestId];
    preview.innerHTML = '';
    const box = document.createElement('div');
    box.className = 'seat-preview';
    const frame = document.createElement('div');
    frame.className = 'seat-preview-frame';
    const icon = document.createElement('span');
    icon.className = 'seat-preview-icon';
    icon.textContent = g.name.slice(0, 1);
    frame.appendChild(icon);
    if (g.art) {
      const img = document.createElement('img');
      img.className = 'seat-preview-art';
      img.alt = g.name;
      img.addEventListener('error', () => img.remove());
      img.src = g.art;
      frame.appendChild(img);
    }
    box.appendChild(frame);
    const name = document.createElement('div');
    name.className = 'seat-preview-name';
    name.textContent = level.guestNames?.[guestId] || g.name;
    box.appendChild(name);
    const traits = document.createElement('div');
    traits.className = 'seat-preview-traits';
    traits.textContent = (level.traits?.[guestId] || []).map((t) => TRAIT_LABEL[t] || t).join(' · ');
    box.appendChild(traits);
    if (g.description) {
      const desc = document.createElement('div');
      desc.className = 'seat-preview-desc';
      desc.textContent = g.description;
      box.appendChild(desc);
    }
    const line = SEATING_GUESTS[guestId]?.line;
    if (line) {
      const quote = document.createElement('div');
      quote.className = 'seat-preview-line';
      quote.textContent = `«${line}»`;
      box.appendChild(quote);
    }
    const wishes = wishesOf(guestId);
    const wishBox = document.createElement('div');
    wishBox.className = 'seat-preview-wishes';
    if (wishes.length) {
      for (const r of wishes) {
        const w = document.createElement('div');
        w.className = 'seat-preview-wish';
        w.textContent = `• ${r.text}`;
        wishBox.appendChild(w);
      }
    } else {
      wishBox.textContent = 'Особых пожеланий нет.';
    }
    box.appendChild(wishBox);
    preview.appendChild(box);
  }

  function showSeatPreview(seat) {
    previewKey = `seat:${seat.id}`;
    preview.innerHTML = '';
    const box = document.createElement('div');
    box.className = 'seat-preview';
    const name = document.createElement('div');
    name.className = 'seat-preview-name';
    name.textContent = seat.label;
    box.appendChild(name);
    const feats = document.createElement('div');
    feats.className = 'seat-preview-traits';
    feats.textContent = (seat.features || []).length
      ? seat.features.map((f) => SEAT_FEATURE_TEXT[f] || f).join(' · ')
      : 'обычное место, без особых примет';
    box.appendChild(feats);
    const occupant = guestAtSeat(puzzle, seat.id);
    const who = document.createElement('div');
    who.className = 'seat-preview-desc';
    who.textContent = occupant
      ? `Сейчас здесь: ${level.guestNames?.[occupant] || occupant}${isFixedGuest(occupant) ? ' — закреплён' : ''}`
      : 'Место свободно.';
    box.appendChild(who);
    preview.appendChild(box);
  }

  function hidePreview(key) {
    if (previewKey !== key) return;
    previewKey = null;
    refreshPreview();
  }

  // После ухода курсора: выбранный тапом гость остаётся в превью, иначе — правила
  function refreshPreview() {
    if (previewKey) return;
    if (selected) showGuestPreview(selected);
    else preview.innerHTML = RULES_HTML;
  }

  // --- Действия ---
  function trySeat(guestId, seatId) {
    const r = moveGuest(puzzle, guestId, seatId);
    if (r.ok) {
      selected = null;
      hintMark = null;
      if (!r.noop) ctx.sfx?.('rotate');
      renderAll();
    } else {
      ctx.sfx?.('fail');
      ctx.toast(r.error);
    }
  }

  function onSeatTap(seatId) {
    if (finished) return;
    if (selected) { trySeat(selected, seatId); return; }
    // Без выбранного гостя тап по месту просто показывает его превью (для тача)
    const seat = room.seats.find((s) => s.id === seatId);
    if (seat) showSeatPreview(seat);
  }

  function onCircleTap(guestId, seatId) {
    if (finished) return;
    if (isFixedGuest(guestId)) {
      ctx.toast(`${level.guestNames?.[guestId] || guestId} уже уютно сел — его не пересадить.`);
      showGuestPreview(guestId);
      return;
    }
    // С выбранной карточкой тап по кружку — посадить выбранного на это место
    // (занятое — обменом); без выбора — поднять гостя на поднос.
    if (selected && selected !== guestId) { trySeat(selected, seatId); return; }
    if (removeGuest(puzzle, guestId)) {
      if (selected === guestId) selected = null;
      hintMark = null;
      ctx.sfx?.('tap');
      renderAll();
    }
  }

  function onCardTap(guestId) {
    if (finished) return;
    selected = selected === guestId ? null : guestId;
    ctx.sfx?.('tap');
    renderAll();
  }

  function doUndo() {
    if (finished) return;
    if (undoSeating(puzzle)) {
      selected = null;
      hintMark = null;
      ctx.sfx?.('tap');
      renderAll();
    }
  }

  function doReset() {
    if (finished) return;
    resetSeating(puzzle); // закреплённые остаются на своих местах
    selected = null;
    hintMark = null;
    ctx.sfx?.('tap');
    renderAll();
  }

  function doHint() {
    if (finished) return;
    const h = seatingHint(puzzle);
    if (h.type === 'already') {
      ctx.toast('Все уже сидят по своим желаниям — подавай чай!');
      return;
    }
    if (h.type === 'unsolvable') {
      ctx.toast('Хм, эта рассадка не сходится. Сообщи хозяину лавки!');
      return;
    }
    // Подсказка применяется по-настоящему, как в тестах core
    let ok = false;
    if (h.type === 'place') ok = seatGuest(puzzle, h.guest, h.seat).ok;
    else if (h.type === 'move') ok = moveGuest(puzzle, h.guest, h.seat).ok;
    else if (h.type === 'remove') ok = removeGuest(puzzle, h.guest);
    if (!ok) {
      ctx.toast('Подсказка споткнулась — попробуй сброс.');
      return;
    }
    hintsUsed += 1;
    selected = null;
    hintMark = { guest: h.guest, seat: h.seat || null };
    ctx.sfx?.('hint');
    ctx.toast(`Кот-хранитель мурлычет: ${h.text}`);
    renderAll();
  }

  // «Подать чай»: проверка без штрафов и таймера
  function doServe() {
    if (finished) return;
    if (isSeatingSolved(puzzle)) { finish(); return; }
    const unseated = level.guests.filter((g) => !puzzle.placement[g]);
    if (unseated.length) {
      ctx.sfx?.('fail');
      ctx.toast(`Рано подавать чай: осталось посадить гостей: ${unseated.length}.`);
      return;
    }
    const bad = seatingViolations(puzzle);
    if (bad.length) {
      ctx.sfx?.('fail');
      ctx.toast(`Пожелание не сбылось: ${bad[0].text}.`);
      // На пару секунд подсвечиваем гостя и место из нарушенного пожелания
      hintMark = { guest: bad[0].guest, seat: bad[0].rule.seat || puzzle.placement[bad[0].guest] || null };
      scene.classList.add('shake');
      later(() => scene.classList.remove('shake'), 500);
      renderAll();
      return;
    }
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
    const rewards = completePuzzle(ctx.state, level.id, { moves: puzzle.moves, hintsUsed });
    ctx.save();
    ctx.sfx?.('success');
    renderAll();
    later(() => {
      const next = nextPuzzle(level.id);
      showOverlay(ctx, {
        title: '🫖 Чай подан!',
        subtitle: `«${level.name}»: все ${level.guests.length} гостей сидят по своим желаниям.`,
        rewards,
        buttons: [
          ...(next ? [{ label: `Следующий вечер → ${next.name}`, primary: true, onClick: () => ctx.go('puzzle', { id: next.id }) }] : []),
          { label: 'К загадкам', primary: !next, onClick: () => backToPuzzleType(ctx, level) },
          { label: 'Ещё раз', onClick: () => ctx.go('puzzle', { id: level.id }) },
          { label: 'В лавку', onClick: () => ctx.go('hub') },
        ],
      });
    }, 450);
  }

  // --- Перетаскивание (pointer events, как в «Картах судьбы») ---
  function makeDraggable(el, guestId, fromSeat) {
    el.addEventListener('pointerdown', (ev) => {
      if (finished) return;
      ev.preventDefault();
      const startX = ev.clientX;
      const startY = ev.clientY;
      let dragging = false;
      let ghost = null;
      showGuestPreview(guestId);

      const onMove = (e) => {
        if (!dragging && Math.hypot(e.clientX - startX, e.clientY - startY) > 7) {
          dragging = true;
          ghost = el.cloneNode(true);
          ghost.classList.add('seat-ghost');
          document.body.appendChild(ghost);
          el.classList.add('seat-drag-src');
        }
        if (dragging && ghost) {
          ghost.style.left = `${e.clientX - ghost.offsetWidth / 2}px`;
          ghost.style.top = `${e.clientY - ghost.offsetHeight / 2}px`;
          markDropTarget(e.clientX, e.clientY, guestId);
        }
      };
      const onUp = (e) => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        clearDropTarget();
        if (ghost) ghost.remove();
        el.classList.remove('seat-drag-src');
        previewKey = null;
        refreshPreview();
        if (!dragging) {
          // Тап: карточка — выбор гостя; кружок — поднять/обменять
          if (fromSeat == null) onCardTap(guestId);
          else onCircleTap(guestId, fromSeat);
          return;
        }
        const seatId = seatAt(e.clientX, e.clientY);
        if (seatId) {
          trySeat(guestId, seatId);
        } else if (fromSeat != null) {
          // Бросок мимо мест — поднять гостя обратно на поднос
          if (removeGuest(puzzle, guestId)) {
            hintMark = null;
            ctx.sfx?.('tap');
            renderAll();
          }
        }
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    });
  }

  // --- Подсветка места под курсором при перетаскивании ---
  function seatAt(x, y) {
    for (const { el, seat } of seatZones) {
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return seat.id;
    }
    return null;
  }
  function markDropTarget(x, y, guestId) {
    const id = seatAt(x, y);
    for (const { el, seat } of seatZones) {
      const occupant = guestAtSeat(puzzle, seat.id);
      // На занятое закреплённым гостем место бросать нельзя — не подсвечиваем
      const ok = seat.id === id && (!occupant || occupant === guestId || !isFixedGuest(occupant));
      el.classList.toggle('drop-ok', ok);
    }
  }
  function clearDropTarget() {
    for (const { el } of seatZones) el.classList.remove('drop-ok');
  }

  // --- Портрет: существующий арт поверх иконки; файла нет — img удаляется ---
  function portraitEl(guestId, iconCls, artCls) {
    const g = GUEST_BY_ID[guestId];
    const box = document.createElement('div');
    const icon = document.createElement('span');
    icon.className = iconCls;
    icon.textContent = g.name.slice(0, 1);
    box.appendChild(icon);
    if (g.art) {
      const img = document.createElement('img');
      img.className = artCls;
      img.alt = g.name;
      img.addEventListener('error', () => img.remove());
      img.src = g.art;
      box.appendChild(img);
    }
    return box;
  }

  // Карточка гостя на подносе: портрет, имя, черты и все пожелания
  function cardEl(guestId) {
    const card = document.createElement('div');
    card.className = 'seat-card clickable'
      + (selected === guestId ? ' selected' : '')
      + (hintMark?.guest === guestId ? ' seat-hint' : '');
    card.dataset.guest = guestId;
    const portrait = portraitEl(guestId, 'seat-card-icon', 'seat-card-art');
    portrait.className = 'seat-card-portrait';
    card.appendChild(portrait);
    const name = document.createElement('div');
    name.className = 'seat-card-name';
    name.textContent = level.guestNames?.[guestId] || guestId;
    card.appendChild(name);
    const traits = document.createElement('div');
    traits.className = 'seat-card-traits';
    traits.textContent = (level.traits?.[guestId] || []).map((t) => TRAIT_LABEL[t] || t).join(' · ');
    card.appendChild(traits);
    const wishes = wishesOf(guestId);
    if (wishes.length) {
      const wishBox = document.createElement('div');
      wishBox.className = 'seat-card-wishes';
      for (const r of wishes) {
        const w = document.createElement('div');
        w.className = 'seat-card-wish';
        w.textContent = `• ${r.text}`;
        wishBox.appendChild(w);
      }
      card.appendChild(wishBox);
    }
    card.addEventListener('pointerenter', () => showGuestPreview(guestId));
    card.addEventListener('pointerleave', () => hidePreview(`guest:${guestId}`));
    makeDraggable(card, guestId, null);
    return card;
  }

  function renderAll() {
    // --- Сцена: монолитный арт комнаты + зоны мест + кружки гостей ---
    scene.innerHTML = '';
    const roomImg = document.createElement('img');
    roomImg.className = 'seat-room-art';
    roomImg.alt = room.name;
    roomImg.addEventListener('error', () => roomImg.remove());
    roomImg.src = room.image;
    scene.appendChild(roomImg);

    seatZones = [];
    for (const seat of room.seats) {
      const zone = document.createElement('div');
      zone.className = 'seat-zone clickable'
        + (hintMark?.seat === seat.id ? ' seat-hint' : '');
      zone.style.left = `${seat.x}%`;
      zone.style.top = `${seat.y}%`;
      zone.title = seat.label;
      zone.addEventListener('pointerenter', () => showSeatPreview(seat));
      zone.addEventListener('pointerleave', () => hidePreview(`seat:${seat.id}`));
      zone.addEventListener('click', () => onSeatTap(seat.id));
      scene.appendChild(zone);
      seatZones.push({ el: zone, seat });
    }

    // Кружки посаженных гостей поверх зон (тап/драг — по кружку)
    for (const [guestId, seatId] of Object.entries(puzzle.placement)) {
      if (!seatId) continue;
      const seat = room.seats.find((s) => s.id === seatId);
      if (!seat) continue;
      const fixed = isFixedGuest(guestId);
      const circle = document.createElement('div');
      circle.className = 'seat-circle'
        + (fixed ? ' seat-fixed' : ' clickable')
        + (hintMark?.guest === guestId ? ' seat-hint' : '');
      circle.style.left = `${seat.x}%`;
      circle.style.top = `${seat.y}%`;
      circle.dataset.guest = guestId;
      circle.title = `${level.guestNames?.[guestId] || guestId}${fixed ? ' — закреплён' : ''}`;
      const portrait = portraitEl(guestId, 'seat-circle-icon', 'seat-circle-art');
      portrait.className = 'seat-circle-portrait';
      circle.appendChild(portrait);
      circle.addEventListener('pointerenter', () => showGuestPreview(guestId));
      circle.addEventListener('pointerleave', () => hidePreview(`guest:${guestId}`));
      if (fixed) {
        circle.addEventListener('click', () => onCircleTap(guestId, seatId));
      } else {
        makeDraggable(circle, guestId, seatId);
      }
      scene.appendChild(circle);
    }

    // --- Поднос: нераспределённые гости карточками, посаженные — гнёзда ---
    tray.innerHTML = '';
    for (const guestId of level.guests) {
      if (puzzle.placement[guestId]) {
        const hole = document.createElement('div');
        hole.className = 'seat-hole';
        hole.title = 'Гость уже за столом';
        tray.appendChild(hole);
      } else {
        tray.appendChild(cardEl(guestId));
      }
    }

    // --- Статус ---
    const seated = level.guests.filter((g) => !!puzzle.placement[g]).length;
    statusEl.innerHTML =
      `🪑 За столом: <b>${seated}/${level.guests.length}</b> · мест в комнате: ${room.seats.length}`
      + `<div class="muted" style="font-size:13px">Ходы: ${puzzle.moves} · Подсказки: ${hintsUsed}</div>`;

    refreshPreview();
  }

  renderAll();

  return () => {
    disposed = true;
    window.removeEventListener('keydown', onKey);
    for (const t of timers) clearTimeout(t);
  };
}
