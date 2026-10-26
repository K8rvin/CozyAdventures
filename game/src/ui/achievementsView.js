import { ACHIEVEMENTS } from '../data/achievements.js';
import { achievementProgress } from '../core/achievements.js';
import { achievementArtEl } from './achievementArt.js';
import { header, quickNav } from './common.js';

const RARITIES = {
  common: { label: 'Обычные', one: 'Обычное', points: 10, rank: 0 },
  uncommon: { label: 'Необычные', one: 'Необычное', points: 25, rank: 1 },
  rare: { label: 'Редкие', one: 'Редкое', points: 50, rank: 2 },
  epic: { label: 'Эпические', one: 'Эпическое', points: 100, rank: 3 },
  legendary: { label: 'Легендарные', one: 'Легендарное', points: 250, rank: 4 },
};
const CATEGORIES = {
  puzzles: 'Головоломки',
  battles: 'Походы по мирам',
  general: 'Общие свершения',
  story: 'История и гости',
  collections: 'Лавка и коллекции',
  challenges: 'Испытания',
  special: 'Особые и секретные',
};
const filters = { category: 'all', rarity: 'all', status: 'all', query: '' };

function make(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function rarityOf(achievement) {
  return RARITIES[achievement.rarity] || RARITIES.common;
}

function categoryOf(achievement) {
  return achievement.categoryLabel || CATEGORIES[achievement.category] || achievement.category;
}

function unlockedAt(state, achievement) {
  return state.achievements?.[achievement.id] || 0;
}

function pointsOf(achievement) {
  return achievement.points ?? achievement.rarityInfo?.points ?? rarityOf(achievement).points;
}

function progressBar(progress, got) {
  const wrap = make('div', 'achievement-progress');
  const bar = document.createElement('progress');
  bar.max = Math.max(1, progress.target);
  bar.value = got ? progress.target : Math.min(progress.current, progress.target);
  bar.setAttribute('aria-label', `Прогресс: ${Math.min(progress.current, progress.target)} из ${progress.target}`);
  const text = make('span', 'achievement-progress-text', got
    ? `Получено · ${progress.target}/${progress.target}`
    : `${Math.min(progress.current, progress.target)}/${progress.target}`);
  wrap.append(bar, text);
  return wrap;
}

function openDetails(ctx, achievement, opener) {
  const got = unlockedAt(ctx.state, achievement);
  const concealed = achievement.secret && !got;
  const progress = achievementProgress(ctx.state, achievement);
  const rarity = rarityOf(achievement);
  const overlay = make('div', 'overlay achievement-detail-overlay');
  const card = make('section', 'card achievement-detail-card');
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-modal', 'true');
  const titleId = `achievement-title-${achievement.id}`;
  card.setAttribute('aria-labelledby', titleId);
  card.dataset.rarity = achievement.rarity;

  const close = make('button', 'achievement-detail-close', '×');
  close.type = 'button';
  close.setAttribute('aria-label', 'Закрыть карточку достижения');
  card.appendChild(close);
  card.appendChild(achievementArtEl(achievement, {
    className: 'achievement-detail-art', concealed,
  }));
  const eyebrow = make('div', 'achievement-detail-eyebrow', got ? 'Достижение получено' : 'Достижение ещё закрыто');
  const title = make('h2', '', concealed ? 'Секретное достижение' : achievement.name);
  title.id = titleId;
  const desc = make('p', 'achievement-detail-desc', concealed
    ? 'Условие и название раскроются после получения.'
    : achievement.desc);
  const meta = make('div', 'achievement-detail-meta', `${rarity.one} · ${pointsOf(achievement)} очков славы · ${categoryOf(achievement)}`);
  card.append(eyebrow, title, desc, meta, progressBar(progress, !!got));
  if (got) {
    card.appendChild(make('div', 'achievement-detail-date', `Дата получения: ${new Date(got).toLocaleString('ru-RU')}`));
  }
  overlay.appendChild(card);

  const onKey = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDetails();
    } else if (event.key === 'Tab') {
      event.preventDefault();
      close.focus?.();
    }
  };
  const closeDetails = () => {
    overlay.remove();
    window.removeEventListener('keydown', onKey);
    opener?.focus?.();
  };
  close.addEventListener('click', closeDetails);
  overlay.addEventListener('click', (event) => { if (event.target === overlay) closeDetails(); });
  document.body.appendChild(overlay);
  window.addEventListener('keydown', onKey);
  close.focus?.();
}

function achievementCard(ctx, achievement, { recent = false } = {}) {
  const got = unlockedAt(ctx.state, achievement);
  const concealed = achievement.secret && !got;
  const progress = achievementProgress(ctx.state, achievement);
  const rarity = rarityOf(achievement);
  const card = make('button', `achievement-card ${got ? 'is-unlocked' : 'is-locked'}${recent ? ' is-recent' : ''}`);
  card.type = 'button';
  card.dataset.achievementId = achievement.id;
  card.dataset.rarity = achievement.rarity;
  card.dataset.category = achievement.category;
  card.setAttribute('aria-label', `${concealed ? 'Секретное достижение' : achievement.name}. ${rarity.one}. ${got ? 'Получено' : `Прогресс ${Math.min(progress.current, progress.target)} из ${progress.target}`}`);
  card.appendChild(achievementArtEl(achievement, {
    className: recent ? 'achievement-recent-art' : 'achievement-card-art', concealed, lazy: !recent,
  }));

  const body = make('span', 'achievement-card-body');
  body.appendChild(make('span', 'achievement-card-rarity', concealed ? 'Секрет · условие скрыто' : rarity.one));
  body.appendChild(make('span', 'achievement-card-name', concealed ? 'Секретное достижение' : achievement.name));
  if (!recent) {
    body.appendChild(make('span', 'achievement-card-desc', concealed
      ? 'Название и условие раскроются после получения.'
      : achievement.desc));
  }
  body.appendChild(progressBar(progress, !!got));
  if (got) {
    body.appendChild(make('span', 'achievement-card-date', new Date(got).toLocaleDateString('ru-RU')));
  }
  card.appendChild(body);
  card.addEventListener('click', () => openDetails(ctx, achievement, card));
  return card;
}

function selectFilter(className, labelText, value, options, onChange) {
  const label = make('label', className);
  label.appendChild(make('span', '', labelText));
  const select = document.createElement('select');
  for (const [id, name] of options) {
    const option = document.createElement('option');
    option.value = id;
    option.textContent = name;
    option.selected = id === value;
    select.appendChild(option);
  }
  select.value = value;
  select.addEventListener('change', () => onChange(select.value));
  label.appendChild(select);
  return label;
}

export function renderAchievements(container, ctx) {
  const { state } = ctx;
  const unlocked = ACHIEVEMENTS.filter((achievement) => unlockedAt(state, achievement));
  const score = unlocked.reduce((sum, achievement) => sum + pointsOf(achievement), 0);
  const totalScore = ACHIEVEMENTS.reduce((sum, achievement) => sum + pointsOf(achievement), 0);
  const percent = Math.round(unlocked.length / ACHIEVEMENTS.length * 100);
  container.appendChild(header(ctx, 'Книга славы',
    `${unlocked.length}/${ACHIEVEMENTS.length} достижений · ${score} очков славы`));

  const summary = make('section', 'achievement-summary');
  summary.appendChild(achievementArtEl({ id: '_book', rarity: 'legendary' }, { className: 'achievement-summary-art' }));
  const summaryBody = make('div', 'achievement-summary-body');
  summaryBody.appendChild(make('h2', '', 'Слава лавки растёт'));
  summaryBody.appendChild(make('p', '', `Открыто ${percent}% книги · ${score} из ${totalScore} очков`));
  summaryBody.appendChild(progressBar({ current: unlocked.length, target: ACHIEVEMENTS.length }, false));
  const raritySummary = make('div', 'achievement-rarity-summary');
  for (const [id, rarity] of Object.entries(RARITIES)) {
    const all = ACHIEVEMENTS.filter((achievement) => achievement.rarity === id);
    const got = all.filter((achievement) => unlockedAt(state, achievement)).length;
    const chip = make('span', 'achievement-rarity-chip', `${rarity.label}: ${got}/${all.length}`);
    chip.dataset.rarity = id;
    raritySummary.appendChild(chip);
  }
  summaryBody.appendChild(raritySummary);
  summary.appendChild(summaryBody);
  container.appendChild(summary);

  const recent = [...unlocked].sort((a, b) => unlockedAt(state, b) - unlockedAt(state, a)).slice(0, 3);
  if (recent.length) {
    const section = make('section', 'achievement-recent');
    section.appendChild(make('h2', '', 'Недавно полученные'));
    const list = make('div', 'achievement-recent-grid');
    for (const achievement of recent) list.appendChild(achievementCard(ctx, achievement, { recent: true }));
    section.appendChild(list);
    container.appendChild(section);
  }

  const controls = make('section', 'achievement-controls');
  const categories = [...new Set(ACHIEVEMENTS.map((achievement) => achievement.category))];
  controls.appendChild(selectFilter('achievement-filter', 'Раздел', filters.category, [
    ['all', 'Все разделы'],
    ...categories.map((id) => [id, CATEGORIES[id] || ACHIEVEMENTS.find((a) => a.category === id)?.categoryLabel || id]),
  ], (value) => { filters.category = value; renderGrid(); }));
  controls.appendChild(selectFilter('achievement-filter', 'Редкость', filters.rarity, [
    ['all', 'Любая редкость'],
    ...Object.entries(RARITIES).map(([id, rarity]) => [id, rarity.label]),
  ], (value) => { filters.rarity = value; renderGrid(); }));
  controls.appendChild(selectFilter('achievement-filter', 'Состояние', filters.status, [
    ['all', 'Все'], ['unlocked', 'Полученные'], ['locked', 'В работе'],
  ], (value) => { filters.status = value; renderGrid(); }));

  const searchLabel = make('label', 'achievement-filter achievement-search');
  searchLabel.appendChild(make('span', '', 'Поиск'));
  const search = document.createElement('input');
  search.type = 'search';
  search.value = filters.query;
  search.placeholder = 'Название или описание';
  search.addEventListener('input', () => { filters.query = search.value; renderGrid(); });
  searchLabel.appendChild(search);
  controls.appendChild(searchLabel);
  const reset = make('button', 'ghost small achievement-filter-reset', 'Сбросить фильтры');
  reset.type = 'button';
  reset.addEventListener('click', () => {
    Object.assign(filters, { category: 'all', rarity: 'all', status: 'all', query: '' });
    ctx.go('achievements');
  });
  controls.appendChild(reset);
  container.appendChild(controls);

  const resultCount = make('div', 'achievement-result-count');
  const groups = make('div', 'achievement-groups');

  function matches(achievement) {
    const got = !!unlockedAt(state, achievement);
    if (filters.category !== 'all' && achievement.category !== filters.category) return false;
    if (filters.rarity !== 'all' && achievement.rarity !== filters.rarity) return false;
    if (filters.status === 'unlocked' && !got) return false;
    if (filters.status === 'locked' && got) return false;
    const query = filters.query.trim().toLocaleLowerCase('ru-RU');
    if (query) {
      const concealed = achievement.secret && !got;
      const haystack = concealed ? 'секретное достижение' : `${achievement.name} ${achievement.desc}`;
      if (!haystack.toLocaleLowerCase('ru-RU').includes(query)) return false;
    }
    return true;
  }

  function renderGrid() {
    const visible = ACHIEVEMENTS.filter(matches);
    resultCount.textContent = `Показано: ${visible.length} из ${ACHIEVEMENTS.length}`;
    groups.innerHTML = '';
    for (const category of categories) {
      const entries = visible.filter((achievement) => achievement.category === category);
      if (!entries.length) continue;
      const section = make('section', 'achievement-group');
      const got = entries.filter((achievement) => unlockedAt(state, achievement)).length;
      const title = make('h2', 'achievement-group-title', `${CATEGORIES[category] || entries[0].categoryLabel || category} · ${got}/${entries.length}`);
      section.appendChild(title);
      const grid = make('div', 'achievement-grid');
      for (const achievement of entries) grid.appendChild(achievementCard(ctx, achievement));
      section.appendChild(grid);
      groups.appendChild(section);
    }
    if (!visible.length) {
      const empty = make('div', 'panel achievement-empty', 'По этим фильтрам ничего не найдено. Попробуйте изменить запрос.');
      groups.appendChild(empty);
    }
  }

  container.append(resultCount, groups);
  renderGrid();
  container.appendChild(quickNav(ctx, [{
    icon: '<img class="quick-nav-art" src="assets/brand/fav2_mug.svg" alt="">',
    label: 'В лавку', screen: 'hub',
  }]));
}
