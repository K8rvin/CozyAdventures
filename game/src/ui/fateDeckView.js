// Колода судьбы: полистать и рассмотреть все карты головоломки «Карты судьбы».
// Встреченные карты (из рук пройденных/пропущенных уровней) открыты лицом,
// остальные лежат рубашкой — без имени и значений. Два вида: полка-лента
// и мозаика с фильтрами; клик по открытой карте — крупный профиль с листанием.
import { FATE_CARDS, FATE_PUZZLES, metFateCards } from '../data/puzzlesFate.js';
import { header, quickNav } from './common.js';

export const DECK_MODES = [
  { id: 'shelf', name: 'Полка', icon: '📚', hint: 'Горизонтальная лента с крупными картами' },
  { id: 'bento', name: 'Мозаика', icon: '🧩', hint: 'Сетка карт с фильтрами' },
];

const MODE_IDS = DECK_MODES.map((mode) => mode.id);
const CARD_LIST = Object.values(FATE_CARDS);
const TOTAL = CARD_LIST.length;

export function currentDeckMode(state) {
  const mode = state.settings?.fateDeckMode;
  return MODE_IDS.includes(mode) ? mode : 'shelf';
}

function deckEntries(state) {
  const met = metFateCards(state.puzzlesDone);
  return CARD_LIST.map((card) => ({ card, met: met.has(card.id) }));
}

// Первая невстреченная карта — «фронтир» колоды, к нему и подводим ленту
function frontierIndex(entries) {
  const fresh = entries.findIndex((entry) => !entry.met);
  return fresh >= 0 ? fresh : 0;
}

// Уровни, в чьих руках карта уже попадалась игроку
function metInLevels(state, cardId) {
  return FATE_PUZZLES.filter((level) => state.puzzlesDone[level.id] && level.hand.includes(cardId));
}

function createModePicker(ctx, onChange) {
  const picker = document.createElement('div');
  picker.className = 'deck-mode-picker';
  picker.setAttribute('role', 'group');
  picker.setAttribute('aria-label', 'Вариант отображения колоды');
  const buttons = [];

  const sync = () => {
    const current = currentDeckMode(ctx.state);
    for (const button of buttons) {
      const active = button.dataset.mode === current;
      button.className = `small deck-mode-option${active ? ' primary is-active' : ' ghost'}`;
      button.setAttribute('aria-pressed', String(active));
    }
  };

  for (const mode of DECK_MODES) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.mode = mode.id;
    button.textContent = `${mode.icon} ${mode.name}`;
    button.title = mode.hint;
    button.addEventListener('click', () => {
      if (currentDeckMode(ctx.state) === mode.id) return;
      ctx.state.settings.fateDeckMode = mode.id;
      ctx.save();
      ctx.sfx?.('tap');
      sync();
      onChange(mode.id);
    });
    buttons.push(button);
    picker.appendChild(button);
  }
  sync();
  return picker;
}

// Лицо или рубашка: арт с молчаливым фолбэком на эмодзи/орнамент
function makeCardMedia(entry, extraClass = '') {
  const media = document.createElement('div');
  media.className = `deck-media${extraClass ? ` ${extraClass}` : ''}${entry.met ? '' : ' deck-back'}`;
  const fallback = document.createElement('div');
  fallback.className = entry.met ? 'deck-card-icon' : 'deck-back-icon';
  fallback.textContent = entry.met ? entry.card.icon : '🌙';
  media.appendChild(fallback);
  const img = document.createElement('img');
  img.className = 'deck-card-art';
  img.src = entry.met
    ? `assets/fate/card_${entry.card.id}_web.jpg`
    : 'assets/fate/card_back_web.jpg';
  img.alt = entry.met ? entry.card.name : 'Рубашка карты';
  img.loading = 'lazy';
  img.decoding = 'async';
  img.draggable = false;
  img.addEventListener('error', () => img.remove());
  media.appendChild(img);
  return media;
}

function makeName(entry) {
  const name = document.createElement('div');
  name.className = 'deck-name';
  name.textContent = entry.met ? `${entry.card.icon} ${entry.card.name}` : '???';
  return name;
}

function makeStatus(entry) {
  const status = document.createElement('div');
  status.className = `deck-status${entry.met ? ' is-met' : ''}`;
  status.textContent = entry.met ? entry.card.meanings.join(' · ') : 'Ещё не встречена';
  return status;
}

function makeCard(entry, className, onOpen, withStatus = true) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = `deck-card ${className}${entry.met ? ' deck-met' : ''}`;
  card.dataset.cardId = entry.card.id;
  card.setAttribute('aria-label', entry.met
    ? `${entry.card.name}. Рассмотреть карту`
    : 'Карта ещё не встречена');
  card.appendChild(makeCardMedia(entry));
  const body = document.createElement('div');
  body.className = 'deck-card-body';
  body.appendChild(makeName(entry));
  if (withStatus) body.appendChild(makeStatus(entry));
  card.appendChild(body);
  card.addEventListener('click', () => onOpen(entry.card.id));
  return card;
}

function renderShelf(container, ctx, entries, onOpen) {
  const section = document.createElement('section');
  section.className = 'deck-shelf';
  const toolbar = document.createElement('div');
  toolbar.className = 'deck-shelf-toolbar';
  const hint = document.createElement('span');
  hint.className = 'muted';
  hint.textContent = 'Листай колоду';
  const counter = document.createElement('span');
  counter.className = 'deck-shelf-counter';
  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'small ghost deck-shelf-prev';
  prev.textContent = '←';
  prev.setAttribute('aria-label', 'Предыдущая карта');
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'small ghost deck-shelf-next';
  next.textContent = '→';
  next.setAttribute('aria-label', 'Следующая карта');
  toolbar.append(hint, counter, prev, next);

  const track = document.createElement('div');
  track.className = 'deck-shelf-track';
  track.tabIndex = 0;
  track.setAttribute('role', 'region');
  track.setAttribute('aria-label', 'Полка колоды');
  const cards = [];
  const addCard = (entry, entryIndex, loopClone = false) => {
    const slot = cards.length;
    const card = makeCard(entry, 'deck-shelf-card', onOpen);
    card.dataset.entryIndex = String(entryIndex);
    if (loopClone) {
      // Края ленты кликабельны, но не дублируют карты в Tab и для скринридера.
      card.dataset.loopClone = 'true';
      card.tabIndex = -1;
      card.setAttribute('aria-hidden', 'true');
    }
    card.addEventListener('focus', () => setActive(slot));
    track.appendChild(card);
    cards.push(card);
  };
  addCard(entries[entries.length - 1], entries.length - 1, true);
  entries.forEach((entry, index) => addCard(entry, index));
  addCard(entries[0], 0, true);
  section.append(toolbar, track);
  container.appendChild(section);

  let activeSlot = 1;
  let active = 0;
  function setActive(slot) {
    activeSlot = Math.max(0, Math.min(cards.length - 1, slot));
    active = Number(cards[activeSlot].dataset.entryIndex);
    cards.forEach((card, index) => card.classList.toggle('is-active', index === activeSlot));
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
    // Подмена мгновенная; snap временно выключен, чтобы браузер не вернул старую точку.
    const behavior = track.style.scrollBehavior;
    const snap = track.style.scrollSnapType;
    track.style.scrollBehavior = 'auto';
    track.style.scrollSnapType = 'none';
    if (track.scrollTo) track.scrollTo({ left, behavior: 'instant' });
    else track.scrollLeft = left;
    void track.offsetWidth;
    track.style.scrollBehavior = behavior;
    track.style.scrollSnapType = snap;
  }

  function scrollToSlot(slot, smooth = true) {
    const bounded = Math.max(0, Math.min(cards.length - 1, slot));
    setActive(bounded);
    placeCard(bounded, smooth);
  }

  function step(direction) {
    const nextEntry = (active + direction + entries.length) % entries.length;
    let target = nextEntry + 1;
    // На границах листаем к клону, чтобы не прокручивать всю ленту обратно.
    if (direction < 0 && activeSlot === 1) target = 0;
    if (direction > 0 && activeSlot === entries.length) target = entries.length + 1;
    scrollToSlot(target);
  }

  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  track.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    step(event.key === 'ArrowRight' ? 1 : -1);
  });

  function nearestSlot() {
    const center = track.scrollLeft + track.clientWidth / 2;
    let nearest = activeSlot;
    let distance = Infinity;
    cards.forEach((card, index) => {
      if (!Number.isFinite(card.offsetLeft) || !Number.isFinite(card.offsetWidth)) return;
      const current = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      if (current < distance) { distance = current; nearest = index; }
    });
    return nearest;
  }

  let settleTimer = null;
  function settleAtEdge() {
    settleTimer = null;
    if (!Number.isFinite(track.scrollLeft) || !Number.isFinite(track.clientWidth) || track.clientWidth <= 0
      || !Number.isFinite(track.scrollWidth)) return;
    const nearest = nearestSlot();
    // После остановки клон не должен оставаться на экране. Координаты края не проверяем:
    // scroll-snap может остановить правую ленту в нескольких пикселях от maxScroll.
    if (nearest === 0) {
      scrollToSlot(entries.length, false);
      return;
    }
    if (nearest === cards.length - 1) scrollToSlot(1, false);
  }

  track.addEventListener('scroll', () => {
    if (!Number.isFinite(track.scrollLeft) || !Number.isFinite(track.clientWidth) || track.clientWidth <= 0
      || !Number.isFinite(track.scrollWidth)) return;
    setActive(nearestSlot());
    // Во время инерции и snap не телепортируем ленту: ждём короткой паузы в событиях.
    clearTimeout(settleTimer);
    settleTimer = setTimeout(settleAtEdge, 90);
    settleTimer.unref?.();
  });
  scrollToSlot(frontierIndex(entries) + 1, false);
}

const BENTO_FILTERS = [
  { id: 'all', name: 'Все', match: () => true },
  { id: 'met', name: 'Открытые', match: (entry) => entry.met },
  { id: 'fresh', name: 'Ещё не встречены', match: (entry) => !entry.met },
];

function renderBento(container, ctx, entries, onOpen) {
  const section = document.createElement('section');
  section.className = 'deck-bento';
  const filters = document.createElement('div');
  filters.className = 'deck-bento-filters';
  filters.setAttribute('role', 'group');
  filters.setAttribute('aria-label', 'Фильтр карт');
  const grid = document.createElement('div');
  grid.className = 'deck-bento-grid';
  const empty = document.createElement('div');
  empty.className = 'muted deck-bento-empty';
  empty.textContent = 'Здесь пока пусто. Выбери другой фильтр.';
  empty.hidden = true;
  const featured = frontierIndex(entries);
  const cards = entries.map((entry) => makeCard(entry, 'deck-bento-card', onOpen, false));
  cards.forEach((card) => grid.appendChild(card));
  section.append(filters, grid, empty);
  container.appendChild(section);

  const filterButtons = [];
  function applyFilter(id) {
    const filter = BENTO_FILTERS.find((item) => item.id === id) || BENTO_FILTERS[0];
    let visible = 0;
    cards.forEach((card, index) => {
      const show = filter.match(entries[index]);
      card.hidden = !show;
      card.classList.toggle('is-featured', filter.id === 'all' && index === featured);
      if (show) visible += 1;
    });
    empty.hidden = visible > 0;
    for (const button of filterButtons) {
      const active = button.dataset.filter === filter.id;
      button.className = `small deck-bento-filter${active ? ' primary is-active' : ' ghost'}`;
      button.setAttribute('aria-pressed', String(active));
    }
  }

  for (const filter of BENTO_FILTERS) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.filter = filter.id;
    button.textContent = filter.name;
    button.addEventListener('click', () => applyFilter(filter.id));
    filterButtons.push(button);
    filters.appendChild(button);
  }
  applyFilter('all');
}

function renderCatalog(container, ctx, entries, onOpen) {
  const mode = currentDeckMode(ctx.state);
  if (mode === 'bento') renderBento(container, ctx, entries, onOpen);
  else renderShelf(container, ctx, entries, onOpen);
}

export function renderFateDeck(container, ctx) {
  const { state } = ctx;
  const entries = deckEntries(state);
  const metCount = entries.filter((entry) => entry.met).length;

  container.appendChild(header(
    ctx,
    'Колода судьбы',
    `Открыто ${metCount} из ${TOTAL} карт. Новые карты приходят с гостями раскладов.`,
    ['hub', { scene: 'cabinet' }],
  ));

  let profile = null;
  function closeProfile() {
    if (!profile) return;
    window.removeEventListener('keydown', profile.onKey);
    profile.overlay.remove();
    profile = null;
  }

  function openProfile(cardId) {
    let index = entries.findIndex((entry) => entry.card.id === cardId);
    if (index < 0) return;
    if (!entries[index].met) {
      ctx.toast('Эта карта ещё не встречалась в раскладах. Заглядывай к гостям почаще!');
      return;
    }
    closeProfile();
    const overlay = document.createElement('div');
    overlay.className = 'overlay deck-profile-overlay';
    const panel = document.createElement('section');
    panel.className = 'deck-profile';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    overlay.appendChild(panel);
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) closeProfile();
    });
    document.body.appendChild(overlay);

    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeProfile();
      }
    };
    window.addEventListener('keydown', onKey);
    profile = { overlay, onKey };

    function show() {
      const entry = entries[index];
      const { card } = entry;
      panel.setAttribute('aria-label', entry.met ? `Карта: ${card.name}` : 'Карта ещё не встречена');
      panel.innerHTML = '';

      const top = document.createElement('div');
      top.className = 'deck-profile-top';
      const prev = document.createElement('button');
      prev.type = 'button';
      prev.className = 'small ghost deck-profile-prev';
      prev.textContent = '← Предыдущая';
      const counter = document.createElement('span');
      counter.className = 'deck-profile-counter';
      counter.textContent = `${index + 1} / ${entries.length}`;
      const next = document.createElement('button');
      next.type = 'button';
      next.className = 'small ghost deck-profile-next';
      next.textContent = 'Следующая →';
      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'small ghost deck-profile-close';
      close.textContent = '✕ Закрыть';
      prev.addEventListener('click', () => {
        index = (index - 1 + entries.length) % entries.length;
        ctx.sfx?.('page');
        show();
      });
      next.addEventListener('click', () => {
        index = (index + 1) % entries.length;
        ctx.sfx?.('page');
        show();
      });
      close.addEventListener('click', closeProfile);
      top.append(prev, counter, next, close);

      const layout = document.createElement('div');
      layout.className = 'deck-profile-layout';
      const mediaBox = document.createElement('div');
      mediaBox.className = 'deck-profile-media-box';
      mediaBox.appendChild(makeCardMedia(entry, 'deck-profile-media'));
      layout.appendChild(mediaBox);

      const body = document.createElement('div');
      body.className = 'deck-profile-body';
      body.append(makeName(entry), makeStatus(entry));
      if (entry.met) {
        const levels = metInLevels(state, card.id);
        if (levels.length > 0) {
          const places = document.createElement('div');
          places.className = 'deck-profile-levels';
          const shown = levels.slice(0, 5).map((level) => `«${level.name}»`).join(', ');
          places.textContent = `Расклады с этой картой: ${shown}${levels.length > 5 ? ` и ещё ${levels.length - 5}` : ''}`;
          body.appendChild(places);
        }
      } else {
        const hint = document.createElement('div');
        hint.className = 'deck-profile-hint muted';
        hint.textContent = 'Колода растёт: новая карта приходит вместе с новым гостем раскладов.';
        body.appendChild(hint);
      }
      layout.appendChild(body);
      panel.append(top, layout);
      close.focus?.();
    }

    show();
    ctx.sfx?.('page');
  }

  const layoutPanel = document.createElement('div');
  layoutPanel.className = 'panel deck-layout-panel';
  const layoutLabel = document.createElement('div');
  layoutLabel.className = 'deck-layout-label';
  layoutLabel.textContent = 'Вид колоды';
  const catalogHost = document.createElement('div');
  catalogHost.className = 'deck-catalog-host';
  const rerenderCatalog = () => {
    closeProfile();
    catalogHost.innerHTML = '';
    renderCatalog(catalogHost, ctx, entries, openProfile);
  };
  layoutPanel.append(layoutLabel, createModePicker(ctx, rerenderCatalog));
  container.append(layoutPanel, catalogHost);
  renderCatalog(catalogHost, ctx, entries, openProfile);
  container.appendChild(quickNav(ctx, [
    { icon: '🦌', label: 'В кабинет', screen: 'hub', params: { scene: 'cabinet' } },
  ]));

  return closeProfile;
}
