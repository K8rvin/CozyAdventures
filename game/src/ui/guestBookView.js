// Гостевая книга: каталог знакомых персонажей и короткие разговоры с ними.
import { GUESTS, GUEST_BY_ID, guestKnown } from '../data/guests.js';
import { header, quickNav } from './common.js';
import { recordGuestTopic } from '../core/achievementStats.js';

export const GUEST_CATALOG_MODES = [
  { id: 'shelf', name: 'Полка', icon: '📚', hint: 'Горизонтальная лента с крупными портретами' },
  { id: 'preview', name: 'Портрет', icon: '🖼️', hint: 'Список гостей и живое превью выбранного персонажа' },
  { id: 'accordion', name: 'Список', icon: '📜', hint: 'Компактные строки с описанием и переходом к разговору' },
  { id: 'bento', name: 'Мозаика', icon: '🧩', hint: 'Сетка портретов с фильтрами знакомств' },
];

const MODE_IDS = GUEST_CATALOG_MODES.map((mode) => mode.id);

export function currentGuestCatalogMode(state) {
  const mode = state.settings?.guestCatalogMode;
  return MODE_IDS.includes(mode) ? mode : 'shelf';
}

function createModePicker(ctx, onChange) {
  const picker = document.createElement('div');
  picker.className = 'guest-mode-picker';
  picker.setAttribute('role', 'group');
  picker.setAttribute('aria-label', 'Вариант отображения гостей');
  const buttons = [];

  const sync = () => {
    const current = currentGuestCatalogMode(ctx.state);
    for (const button of buttons) {
      const active = button.dataset.mode === current;
      button.className = `small guest-mode-option${active ? ' primary is-active' : ' ghost'}`;
      button.setAttribute('aria-pressed', String(active));
    }
  };

  for (const mode of GUEST_CATALOG_MODES) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.mode = mode.id;
    button.textContent = `${mode.icon} ${mode.name}`;
    button.title = mode.hint;
    button.addEventListener('click', () => {
      if (currentGuestCatalogMode(ctx.state) === mode.id) return;
      ctx.state.settings.guestCatalogMode = mode.id;
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

function makePortrait(guest, extraClass = '', alt = '') {
  const media = document.createElement('div');
  media.className = `guest-media${extraClass ? ` ${extraClass}` : ''}`;
  const fallback = document.createElement('div');
  fallback.className = 'guest-fallback';
  fallback.textContent = guest.icon;
  media.appendChild(fallback);
  if (guest.art) {
    const img = document.createElement('img');
    img.className = 'guest-art';
    img.src = guest.art;
    img.alt = alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.draggable = false;
    img.addEventListener('error', () => img.remove());
    media.appendChild(img);
  }
  return media;
}

function makeName(guest) {
  const name = document.createElement('div');
  name.className = 'guest-name';
  name.textContent = `${guest.icon} ${guest.name}`;
  return name;
}

function makeStatus(state, guest) {
  const status = document.createElement('div');
  const known = guestKnown(state, guest);
  status.className = `guest-status${known ? ' is-known' : ''}`;
  status.textContent = known ? '✦ Уже знакомы' : 'Новое знакомство';
  return status;
}

function makeDescription(guest) {
  const description = document.createElement('div');
  description.className = 'guest-description';
  description.textContent = guest.description;
  return description;
}

function makeGuestCard(state, guest, className, onOpen, withDescription = false) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = `guest-card ${className}${guestKnown(state, guest) ? ' guest-known' : ''}`;
  card.dataset.guestId = guest.id;
  card.setAttribute('aria-label', `${guest.name}. Рассмотреть и поговорить`);
  card.appendChild(makePortrait(guest));
  const body = document.createElement('div');
  body.className = 'guest-card-body';
  body.append(makeName(guest), makeStatus(state, guest));
  if (withDescription) body.appendChild(makeDescription(guest));
  card.appendChild(body);
  card.addEventListener('click', () => onOpen(guest.id));
  return card;
}

function recommendedIndex(state) {
  const fresh = GUESTS.findIndex((guest) => !guestKnown(state, guest));
  return fresh >= 0 ? fresh : 0;
}

function renderShelf(container, ctx, onOpen) {
  const section = document.createElement('section');
  section.className = 'guest-shelf';
  const toolbar = document.createElement('div');
  toolbar.className = 'guest-shelf-toolbar';
  const hint = document.createElement('span');
  hint.className = 'muted';
  hint.textContent = 'Листай гостей';
  const counter = document.createElement('span');
  counter.className = 'guest-shelf-counter';
  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'small ghost guest-shelf-prev';
  prev.textContent = '←';
  prev.setAttribute('aria-label', 'Предыдущий гость');
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'small ghost guest-shelf-next';
  next.textContent = '→';
  next.setAttribute('aria-label', 'Следующий гость');
  toolbar.append(hint, counter, prev, next);

  const track = document.createElement('div');
  track.className = 'guest-shelf-track';
  track.tabIndex = 0;
  track.setAttribute('role', 'region');
  track.setAttribute('aria-label', 'Полка гостей');
  const cards = [];
  const addCard = (guest, guestIndex, loopClone = false) => {
    const slot = cards.length;
    const card = makeGuestCard(ctx.state, guest, 'guest-shelf-card', onOpen, true);
    card.dataset.guestIndex = String(guestIndex);
    if (loopClone) {
      // Края ленты кликабельны, но не дублируют гостей в Tab и для скринридера.
      card.dataset.loopClone = 'true';
      card.tabIndex = -1;
      card.setAttribute('aria-hidden', 'true');
    }
    card.addEventListener('focus', () => setActive(slot));
    track.appendChild(card);
    cards.push(card);
  };
  addCard(GUESTS[GUESTS.length - 1], GUESTS.length - 1, true);
  GUESTS.forEach((guest, index) => addCard(guest, index));
  addCard(GUESTS[0], 0, true);
  section.append(toolbar, track);
  container.appendChild(section);

  let activeSlot = 1;
  let active = 0;
  function setActive(slot) {
    activeSlot = Math.max(0, Math.min(cards.length - 1, slot));
    active = Number(cards[activeSlot].dataset.guestIndex);
    cards.forEach((card, index) => card.classList.toggle('is-active', index === activeSlot));
    counter.textContent = `${active + 1} / ${GUESTS.length}`;
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
    const nextGuest = (active + direction + GUESTS.length) % GUESTS.length;
    let target = nextGuest + 1;
    // На границах листаем к клону, чтобы не прокручивать всю ленту обратно.
    if (direction < 0 && activeSlot === 1) target = 0;
    if (direction > 0 && activeSlot === GUESTS.length) target = GUESTS.length + 1;
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
      scrollToSlot(GUESTS.length, false);
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
  scrollToSlot(recommendedIndex(ctx.state) + 1, false);
}

function renderPreview(container, ctx, onOpen) {
  const section = document.createElement('section');
  section.className = 'guest-preview-layout';
  const menu = document.createElement('div');
  menu.className = 'guest-preview-menu';
  menu.setAttribute('aria-label', 'Гости лавки');
  const detail = document.createElement('div');
  detail.className = 'guest-preview-detail';
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
    const guest = GUESTS[selected];
    detail.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'guest-preview-card';
    card.appendChild(makePortrait(guest));
    const body = document.createElement('div');
    body.className = 'guest-preview-body';
    body.append(makeName(guest), makeStatus(ctx.state, guest), makeDescription(guest));
    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'primary guest-preview-open';
    open.textContent = 'Рассмотреть и поговорить →';
    open.addEventListener('click', () => onOpen(guest.id));
    body.appendChild(open);
    card.appendChild(body);
    detail.appendChild(card);
  }

  GUESTS.forEach((guest, index) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'guest-preview-item';
    item.setAttribute('aria-label', guest.name);
    const icon = document.createElement('span');
    icon.className = 'guest-preview-item-icon';
    icon.textContent = guest.icon;
    const text = document.createElement('span');
    text.className = 'guest-preview-item-text';
    const name = document.createElement('span');
    name.className = 'guest-preview-item-name';
    name.textContent = guest.name;
    text.append(name, makeStatus(ctx.state, guest));
    item.append(icon, text);
    item.addEventListener('pointerenter', () => show(index));
    item.addEventListener('focus', () => show(index));
    item.addEventListener('click', () => show(index));
    items.push(item);
    menu.appendChild(item);
  });
  show(recommendedIndex(ctx.state));
}

function renderSimpleList(container, ctx, onOpen) {
  const list = document.createElement('section');
  list.className = 'guest-simple-list';
  list.setAttribute('aria-label', 'Список гостей');
  for (const guest of GUESTS) {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = `guest-simple-item${guestKnown(ctx.state, guest) ? ' guest-known' : ''}`;
    item.setAttribute('aria-label', `${guest.name}. Рассмотреть и поговорить`);
    item.appendChild(makePortrait(guest, 'guest-simple-thumb'));
    const text = document.createElement('span');
    text.className = 'guest-simple-text';
    text.appendChild(makeName(guest));
    const description = makeDescription(guest);
    description.classList.add('guest-simple-desc');
    text.append(description, makeStatus(ctx.state, guest));
    const arrow = document.createElement('span');
    arrow.className = 'guest-simple-arrow';
    arrow.textContent = '→';
    item.append(text, arrow);
    item.addEventListener('click', () => onOpen(guest.id));
    list.appendChild(item);
  }
  container.appendChild(list);
}

const BENTO_FILTERS = [
  { id: 'all', name: 'Все', match: () => true },
  { id: 'known', name: 'Уже знакомы', match: (state, guest) => guestKnown(state, guest) },
  { id: 'fresh', name: 'Новые знакомства', match: (state, guest) => !guestKnown(state, guest) },
];

function renderBento(container, ctx, onOpen) {
  const section = document.createElement('section');
  section.className = 'guest-bento';
  const filters = document.createElement('div');
  filters.className = 'guest-bento-filters';
  filters.setAttribute('role', 'group');
  filters.setAttribute('aria-label', 'Фильтр гостей');
  const grid = document.createElement('div');
  grid.className = 'guest-bento-grid';
  const empty = document.createElement('div');
  empty.className = 'muted guest-bento-empty';
  empty.textContent = 'Здесь пока пусто. Выбери другой фильтр.';
  empty.hidden = true;
  const featured = recommendedIndex(ctx.state);
  const cards = GUESTS.map((guest) => makeGuestCard(ctx.state, guest, 'guest-bento-card', onOpen, true));
  cards.forEach((card) => grid.appendChild(card));
  section.append(filters, grid, empty);
  container.appendChild(section);

  const filterButtons = [];
  function applyFilter(id) {
    const filter = BENTO_FILTERS.find((item) => item.id === id) || BENTO_FILTERS[0];
    let visible = 0;
    cards.forEach((card, index) => {
      const show = filter.match(ctx.state, GUESTS[index]);
      card.hidden = !show;
      card.classList.toggle('is-featured', filter.id === 'all' && index === featured);
      if (show) visible += 1;
    });
    empty.hidden = visible > 0;
    for (const button of filterButtons) {
      const active = button.dataset.filter === filter.id;
      button.className = `small guest-bento-filter${active ? ' primary is-active' : ' ghost'}`;
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

function renderCatalog(container, ctx, onOpen) {
  const mode = currentGuestCatalogMode(ctx.state);
  if (mode === 'preview') renderPreview(container, ctx, onOpen);
  else if (mode === 'accordion') renderSimpleList(container, ctx, onOpen);
  else if (mode === 'bento') renderBento(container, ctx, onOpen);
  else renderShelf(container, ctx, onOpen);
}

function makeBubble(kind, speaker, text) {
  const bubble = document.createElement('div');
  bubble.className = `guest-bubble guest-bubble-${kind}`;
  const who = document.createElement('span');
  who.className = 'guest-bubble-speaker';
  who.textContent = speaker;
  const phrase = document.createElement('span');
  phrase.textContent = text;
  bubble.append(who, phrase);
  return bubble;
}

export function renderGuestBook(container, ctx) {
  container.appendChild(header(ctx, 'Гостевая книга', 'Рассмотри знакомых гостей и перекинься с ними парой фраз'));

  let profile = null;
  function closeProfile() {
    if (!profile) return;
    window.removeEventListener('keydown', profile.onKey);
    profile.overlay.remove();
    profile = null;
  }

  function openProfile(guestId) {
    if (!GUEST_BY_ID[guestId]) return;
    closeProfile();
    let index = GUESTS.findIndex((guest) => guest.id === guestId);
    const overlay = document.createElement('div');
    overlay.className = 'overlay guest-profile-overlay';
    const panel = document.createElement('section');
    panel.className = 'guest-profile';
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
      const guest = GUESTS[index];
      panel.setAttribute('aria-label', `Гость: ${guest.name}`);
      panel.innerHTML = '';

      const top = document.createElement('div');
      top.className = 'guest-profile-top';
      const prev = document.createElement('button');
      prev.type = 'button';
      prev.className = 'small ghost guest-profile-prev';
      prev.textContent = '← Предыдущий';
      const counter = document.createElement('span');
      counter.className = 'guest-profile-counter';
      counter.textContent = `${index + 1} / ${GUESTS.length}`;
      const next = document.createElement('button');
      next.type = 'button';
      next.className = 'small ghost guest-profile-next';
      next.textContent = 'Следующий →';
      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'small ghost guest-profile-close';
      close.textContent = '✕ Закрыть';
      prev.addEventListener('click', () => {
        index = (index - 1 + GUESTS.length) % GUESTS.length;
        ctx.sfx?.('page');
        show();
      });
      next.addEventListener('click', () => {
        index = (index + 1) % GUESTS.length;
        ctx.sfx?.('page');
        show();
      });
      close.addEventListener('click', closeProfile);
      top.append(prev, counter, next, close);

      const layout = document.createElement('div');
      layout.className = 'guest-profile-layout';
      const person = document.createElement('div');
      person.className = 'guest-profile-person';
      person.appendChild(makePortrait(guest, 'guest-profile-media', guest.name));
      person.append(makeName(guest), makeStatus(ctx.state, guest), makeDescription(guest));

      const conversation = document.createElement('div');
      conversation.className = 'guest-conversation';
      const title = document.createElement('h3');
      title.textContent = 'Перекинуться парой фраз';
      const chat = document.createElement('div');
      chat.className = 'guest-chat';
      chat.setAttribute('aria-live', 'polite');
      chat.appendChild(makeBubble('guest', guest.name, guest.greeting));
      const topicsLabel = document.createElement('div');
      topicsLabel.className = 'guest-topics-label';
      topicsLabel.textContent = 'Что сказать?';
      const topics = document.createElement('div');
      topics.className = 'guest-topics';
      guest.topics.forEach((topic, topicIndex) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'guest-topic';
        button.dataset.topic = String(topicIndex);
        button.textContent = topic.ask;
        button.addEventListener('click', () => {
          if (button.disabled) return;
          button.disabled = true;
          chat.append(
            makeBubble('player', 'Ты', topic.ask),
            makeBubble('guest', guest.name, topic.answer),
          );
          chat.scrollTop = chat.scrollHeight;
          ctx.sfx?.('tap');
          if (recordGuestTopic(ctx.state, guest.id, topicIndex)) ctx.save();
          if ([...topics.children].every((item) => item.disabled)) {
            const done = document.createElement('div');
            done.className = 'guest-topics-done muted';
            done.textContent = 'На этом пока всё — гость ещё заглянет в лавку.';
            topics.appendChild(done);
          }
        });
        topics.appendChild(button);
      });
      conversation.append(title, chat, topicsLabel, topics);
      layout.append(person, conversation);
      panel.append(top, layout);
      close.focus?.();
    }

    show();
    ctx.sfx?.('page');
  }

  const layoutPanel = document.createElement('div');
  layoutPanel.className = 'panel guest-layout-panel';
  const layoutLabel = document.createElement('div');
  layoutLabel.className = 'guest-layout-label';
  layoutLabel.textContent = 'Вид списка';
  const catalogHost = document.createElement('div');
  catalogHost.className = 'guest-catalog-host';
  const rerenderCatalog = () => {
    closeProfile();
    catalogHost.innerHTML = '';
    renderCatalog(catalogHost, ctx, openProfile);
  };
  layoutPanel.append(layoutLabel, createModePicker(ctx, rerenderCatalog));
  container.append(layoutPanel, catalogHost);
  renderCatalog(catalogHost, ctx, openProfile);
  container.appendChild(quickNav(ctx, [
    { icon: '🏠', label: 'В лавку', screen: 'hub' },
  ]));

  return closeProfile;
}
