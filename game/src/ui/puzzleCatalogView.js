// Каталог типов головоломок: четыре сохраняемых варианта отображения.
import { puzzleAvailable, ALL_PUZZLES } from '../core/state.js';

export const PUZZLE_CATALOG_MODES = [
  { id: 'shelf', name: 'Полка', icon: '📚', hint: 'Горизонтальная лента с крупными карточками' },
  { id: 'preview', name: 'Живое превью', icon: '🖼️', hint: 'Список и иллюстрация выбранной категории' },
  { id: 'accordion', name: 'Список', icon: '📜', hint: 'Простой список с миниатюрами и прогрессом' },
  { id: 'bento', name: 'Мозаика', icon: '🧩', hint: 'Асимметричная сетка с фильтрами' },
];

const MODE_IDS = PUZZLE_CATALOG_MODES.map((m) => m.id);

export function currentPuzzleCatalogMode(state) {
  const mode = state.settings?.puzzleCatalogMode;
  return MODE_IDS.includes(mode) ? mode : 'shelf';
}

export function createPuzzleCatalogModePicker(ctx, onChange) {
  const picker = document.createElement('div');
  picker.className = 'pc-mode-picker';
  picker.setAttribute('role', 'group');
  picker.setAttribute('aria-label', 'Вариант отображения головоломок');
  const buttons = [];

  const sync = () => {
    const current = currentPuzzleCatalogMode(ctx.state);
    for (const b of buttons) {
      const active = b.dataset.mode === current;
      b.className = `small pc-mode-option${active ? ' primary is-active' : ' ghost'}`;
      b.setAttribute('aria-pressed', String(active));
    }
  };

  for (const mode of PUZZLE_CATALOG_MODES) {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.mode = mode.id;
    b.textContent = `${mode.icon} ${mode.name}`;
    b.title = mode.hint;
    b.addEventListener('click', () => {
      if (currentPuzzleCatalogMode(ctx.state) === mode.id) return;
      ctx.state.settings.puzzleCatalogMode = mode.id;
      ctx.save();
      ctx.sfx?.('tap');
      sync();
      onChange?.(mode.id);
    });
    buttons.push(b);
    picker.appendChild(b);
  }
  sync();
  return picker;
}

function typeOf(p) { return p.mechanic || 'mirror'; }

function catalogEntries(types, state) {
  return types.map((t) => {
    const items = ALL_PUZZLES.filter((p) => typeOf(p) === t.mech);
    const done = items.filter((p) => state.puzzlesDone[p.id]).length;
    const hasFresh = items.some((p) => !state.puzzlesDone[p.id]
      && puzzleAvailable(state, ALL_PUZZLES.indexOf(p)));
    return {
      ...t,
      done,
      total: items.length,
      hasFresh,
      complete: items.length > 0 && done === items.length,
    };
  });
}

function recommendedIndex(entries) {
  const fresh = entries.findIndex((e) => e.hasFresh);
  if (fresh >= 0) return fresh;
  const unfinished = entries.findIndex((e) => !e.complete);
  return Math.max(0, unfinished);
}

function makeArt(entry, extraClass = '') {
  const media = document.createElement('div');
  media.className = `pc-media${extraClass ? ` ${extraClass}` : ''}`;
  const fallback = document.createElement('div');
  fallback.className = 'pc-fallback';
  fallback.textContent = entry.icon;
  const img = document.createElement('img');
  img.className = 'pc-art';
  img.alt = '';
  img.loading = 'lazy';
  img.decoding = 'async';
  img.draggable = false;
  img.src = `assets/puzzle_cards/pc_${entry.mech}_web.jpg`;
  img.addEventListener('error', () => img.remove());
  media.append(fallback, img);
  return media;
}

function makeProgressText(entry) {
  const progress = document.createElement('div');
  progress.className = 'pc-progress';
  progress.textContent = `Пройдено ${entry.done} из ${entry.total}`;
  return progress;
}

function makeProgress(entry) {
  const box = document.createElement('div');
  box.className = 'pc-progress-box';
  box.appendChild(makeProgressText(entry));
  const meter = document.createElement('div');
  meter.className = 'pc-meter';
  meter.setAttribute('role', 'progressbar');
  meter.setAttribute('aria-label', `Прогресс: ${entry.name}`);
  meter.setAttribute('aria-valuemin', '0');
  meter.setAttribute('aria-valuemax', String(entry.total));
  meter.setAttribute('aria-valuenow', String(entry.done));
  const fill = document.createElement('div');
  fill.className = 'pc-meter-fill';
  fill.style.width = `${entry.total ? (entry.done / entry.total) * 100 : 0}%`;
  meter.appendChild(fill);
  box.appendChild(meter);
  return box;
}

function makeName(entry, extraClass = '') {
  const name = document.createElement('div');
  name.className = `pc-name${extraClass ? ` ${extraClass}` : ''}`;
  name.textContent = `${entry.icon} ${entry.name}`;
  return name;
}

function makeFreshBadge() {
  const badge = document.createElement('span');
  badge.className = 'pc-fresh-badge';
  badge.textContent = 'Новое';
  return badge;
}

function makeCard(entry, className, onOpen, withDescription = false) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = `pc-card ${className}${entry.complete ? ' pc-complete' : ''}`;
  card.setAttribute('aria-label', `${entry.name}. Пройдено ${entry.done} из ${entry.total}`);
  card.appendChild(makeArt(entry));
  const body = document.createElement('div');
  body.className = 'pc-card-body';
  body.appendChild(makeName(entry));
  if (withDescription) {
    const desc = document.createElement('div');
    desc.className = 'pc-desc';
    desc.textContent = entry.desc;
    body.appendChild(desc);
  }
  body.appendChild(makeProgress(entry));
  card.appendChild(body);
  if (entry.hasFresh) card.appendChild(makeFreshBadge());
  card.addEventListener('click', () => onOpen(entry));
  return card;
}

function renderShelf(container, entries, onOpen) {
  const section = document.createElement('section');
  section.className = 'pc-shelf';
  const toolbar = document.createElement('div');
  toolbar.className = 'pc-shelf-toolbar';
  const hint = document.createElement('span');
  hint.className = 'muted';
  hint.textContent = 'Листай полку';
  const counter = document.createElement('span');
  counter.className = 'pc-shelf-counter';
  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'small ghost pc-shelf-prev';
  prev.textContent = '←';
  prev.setAttribute('aria-label', 'Предыдущая головоломка');
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'small ghost pc-shelf-next';
  next.textContent = '→';
  next.setAttribute('aria-label', 'Следующая головоломка');
  toolbar.append(hint, counter, prev, next);

  const track = document.createElement('div');
  track.className = 'pc-shelf-track';
  track.tabIndex = 0;
  track.setAttribute('role', 'region');
  track.setAttribute('aria-label', 'Полка головоломок');
  const cards = [];
  const addCard = (entry, entryIndex, loopClone = false) => {
    const slot = cards.length;
    const card = makeCard(entry, 'pc-shelf-card', onOpen, true);
    card.dataset.entryIndex = String(entryIndex);
    if (loopClone) {
      // Стыковочные карточки видимы и кликабельны, но не дублируются в Tab и для скринридера.
      card.dataset.loopClone = 'true';
      card.tabIndex = -1;
      card.setAttribute('aria-hidden', 'true');
    }
    card.addEventListener('focus', () => setActive(slot));
    track.appendChild(card);
    cards.push(card);
  };
  addCard(entries[entries.length - 1], entries.length - 1, true);
  entries.forEach((entry, i) => addCard(entry, i));
  addCard(entries[0], 0, true);
  section.append(toolbar, track);
  container.appendChild(section);

  let activeSlot = 1;
  let active = 0;
  function setActive(slot) {
    activeSlot = Math.max(0, Math.min(cards.length - 1, slot));
    active = Number(cards[activeSlot].dataset.entryIndex);
    cards.forEach((card, i) => card.classList.toggle('is-active', i === activeSlot));
    counter.textContent = `${active + 1} / ${entries.length}`;
  }

  function placeCard(slot, smooth) {
    const card = cards[slot];
    const left = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
    if (!Number.isFinite(left)) return;
    if (smooth) {
      if (track.scrollTo) track.scrollTo({ left, behavior: 'smooth' });
      else track.scrollLeft = left;
      return;
    }
    // При переходе через край клон заменяется настоящей карточкой без видимого скачка анимации.
    const behavior = track.style.scrollBehavior;
    track.style.scrollBehavior = 'auto';
    if (track.scrollTo) track.scrollTo({ left, behavior: 'auto' });
    else track.scrollLeft = left;
    track.style.scrollBehavior = behavior;
  }

  function scrollToSlot(slot, smooth = true) {
    const bounded = Math.max(0, Math.min(cards.length - 1, slot));
    setActive(bounded);
    placeCard(bounded, smooth);
  }

  function step(direction) {
    const nextEntry = (active + direction + entries.length) % entries.length;
    let target = nextEntry + 1;
    // На границах движемся к клону: анимация не перескакивает через всю ленту.
    if (direction < 0 && activeSlot === 1) target = 0;
    if (direction > 0 && activeSlot === entries.length) target = entries.length + 1;
    scrollToSlot(target);
  }

  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  track.addEventListener('keydown', (ev) => {
    if (ev.key !== 'ArrowLeft' && ev.key !== 'ArrowRight') return;
    ev.preventDefault();
    step(ev.key === 'ArrowRight' ? 1 : -1);
  });
  track.addEventListener('scroll', () => {
    if (!Number.isFinite(track.scrollLeft) || !Number.isFinite(track.clientWidth) || track.clientWidth <= 0
      || !Number.isFinite(track.scrollWidth)) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let nearest = activeSlot;
    let distance = Infinity;
    cards.forEach((card, i) => {
      if (!Number.isFinite(card.offsetLeft) || !Number.isFinite(card.offsetWidth)) return;
      const d = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      if (d < distance) { distance = d; nearest = i; }
    });
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (nearest === 0 && track.scrollLeft <= 1) {
      scrollToSlot(entries.length, false);
      return;
    }
    if (nearest === cards.length - 1 && track.scrollLeft >= maxScroll - 1) {
      scrollToSlot(1, false);
      return;
    }
    setActive(nearest);
  });
  scrollToSlot(recommendedIndex(entries) + 1, false);
}

function renderPreview(container, entries, onOpen) {
  const section = document.createElement('section');
  section.className = 'pc-preview-layout';
  const menu = document.createElement('div');
  menu.className = 'pc-preview-menu';
  menu.setAttribute('aria-label', 'Категории головоломок');
  const detail = document.createElement('div');
  detail.className = 'pc-preview-detail';
  section.append(menu, detail);
  container.appendChild(section);

  const items = [];
  let selected = -1;
  function show(index) {
    if (selected === index) return;
    selected = index;
    items.forEach((item, i) => {
      item.classList.toggle('is-active', i === selected);
      item.setAttribute('aria-pressed', String(i === selected));
    });
    const entry = entries[selected];
    detail.innerHTML = '';
    const card = document.createElement('div');
    card.className = `pc-preview-card${entry.complete ? ' pc-complete' : ''}`;
    card.appendChild(makeArt(entry));
    const body = document.createElement('div');
    body.className = 'pc-preview-body';
    body.appendChild(makeName(entry));
    const desc = document.createElement('div');
    desc.className = 'pc-desc';
    desc.textContent = entry.desc;
    body.appendChild(desc);
    body.appendChild(makeProgress(entry));
    if (entry.hasFresh) {
      const fresh = document.createElement('div');
      fresh.className = 'pc-preview-fresh';
      fresh.textContent = '✦ Есть новые загадки';
      body.appendChild(fresh);
    }
    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'primary pc-preview-open';
    open.textContent = 'К уровням →';
    open.addEventListener('click', () => onOpen(entry));
    body.appendChild(open);
    card.appendChild(body);
    detail.appendChild(card);
  }

  entries.forEach((entry, i) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'pc-preview-item';
    item.setAttribute('aria-label', `${entry.name}. Пройдено ${entry.done} из ${entry.total}`);
    const icon = document.createElement('span');
    icon.className = 'pc-preview-item-icon';
    icon.textContent = entry.icon;
    const text = document.createElement('span');
    text.className = 'pc-preview-item-text';
    const name = document.createElement('span');
    name.className = 'pc-preview-item-name';
    name.textContent = entry.name;
    text.append(name, makeProgressText(entry));
    item.append(icon, text);
    if (entry.hasFresh) {
      const dot = document.createElement('span');
      dot.className = 'pc-item-dot';
      dot.setAttribute('aria-label', 'Есть новые загадки');
      item.appendChild(dot);
    }
    item.addEventListener('pointerenter', () => show(i));
    item.addEventListener('focus', () => show(i));
    item.addEventListener('click', () => show(i));
    items.push(item);
    menu.appendChild(item);
  });
  show(recommendedIndex(entries));
}

function renderSimpleList(container, entries, onOpen) {
  const list = document.createElement('section');
  list.className = 'pc-simple-list';
  list.setAttribute('aria-label', 'Список головоломок');
  for (const entry of entries) {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = `pc-simple-item${entry.complete ? ' pc-complete' : ''}`;
    item.setAttribute('aria-label', `${entry.name}. Пройдено ${entry.done} из ${entry.total}`);
    item.appendChild(makeArt(entry, 'pc-simple-thumb'));
    const text = document.createElement('span');
    text.className = 'pc-simple-text';
    text.appendChild(makeName(entry));
    const desc = document.createElement('span');
    desc.className = 'pc-desc pc-simple-desc';
    desc.textContent = entry.desc;
    text.appendChild(desc);
    text.appendChild(makeProgressText(entry));
    if (entry.hasFresh) text.appendChild(makeFreshBadge());
    const arrow = document.createElement('span');
    arrow.className = 'pc-simple-arrow';
    arrow.textContent = '→';
    item.append(text, arrow);
    item.addEventListener('click', () => onOpen(entry));
    list.appendChild(item);
  }
  container.appendChild(list);
}

const BENTO_FILTERS = [
  { id: 'all', name: 'Все', match: () => true },
  { id: 'fresh', name: 'Новые', match: (e) => e.hasFresh },
  { id: 'progress', name: 'В процессе', match: (e) => e.done > 0 && !e.complete },
  { id: 'complete', name: 'Пройденные', match: (e) => e.complete },
];

function renderBento(container, entries, onOpen) {
  const section = document.createElement('section');
  section.className = 'pc-bento';
  const filters = document.createElement('div');
  filters.className = 'pc-bento-filters';
  filters.setAttribute('role', 'group');
  filters.setAttribute('aria-label', 'Фильтр головоломок');
  const grid = document.createElement('div');
  grid.className = 'pc-bento-grid';
  const empty = document.createElement('div');
  empty.className = 'muted pc-bento-empty';
  empty.textContent = 'Здесь пока пусто. Выбери другой фильтр.';
  empty.hidden = true;
  const featured = recommendedIndex(entries);
  const cards = entries.map((entry) => makeCard(entry, 'pc-bento-card', onOpen, true));
  cards.forEach((card) => grid.appendChild(card));
  section.append(filters, grid, empty);
  container.appendChild(section);

  let current = 'all';
  const filterButtons = [];
  function applyFilter(id) {
    current = id;
    const filter = BENTO_FILTERS.find((f) => f.id === current);
    let visible = 0;
    cards.forEach((card, i) => {
      const show = filter.match(entries[i]);
      card.hidden = !show;
      card.classList.toggle('is-featured', current === 'all' && i === featured);
      if (show) visible += 1;
    });
    empty.hidden = visible > 0;
    for (const b of filterButtons) {
      const active = b.dataset.filter === current;
      b.className = `small pc-bento-filter${active ? ' primary is-active' : ' ghost'}`;
      b.setAttribute('aria-pressed', String(active));
    }
  }

  for (const filter of BENTO_FILTERS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.filter = filter.id;
    b.textContent = filter.name;
    b.addEventListener('click', () => applyFilter(filter.id));
    filterButtons.push(b);
    filters.appendChild(b);
  }
  applyFilter('all');
}

export function renderPuzzleCatalog(container, ctx, types, onSelect) {
  const entries = catalogEntries(types, ctx.state);
  const onOpen = (entry) => {
    ctx.sfx?.('tap');
    onSelect(entry.mech);
  };
  const mode = currentPuzzleCatalogMode(ctx.state);
  if (mode === 'preview') renderPreview(container, entries, onOpen);
  else if (mode === 'accordion') renderSimpleList(container, entries, onOpen);
  else if (mode === 'bento') renderBento(container, entries, onOpen);
  else renderShelf(container, entries, onOpen);
}
