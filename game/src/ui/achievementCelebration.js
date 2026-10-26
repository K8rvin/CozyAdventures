import { achievementArtEl } from './achievementArt.js';

const RARITIES = {
  common: { label: 'Обычное', points: 10, rank: 0 },
  uncommon: { label: 'Необычное', points: 25, rank: 1 },
  rare: { label: 'Редкое', points: 50, rank: 2 },
  epic: { label: 'Эпическое', points: 100, rank: 3 },
  legendary: { label: 'Легендарное', points: 250, rank: 4 },
};

let queue = [];
let active = null;
let host = null;
let timer = null;
let observer = null;
const busy = new Set();

function rarityOf(achievement) {
  const base = RARITIES[achievement?.rarity] || RARITIES.common;
  return {
    ...base,
    ...(achievement?.rarityInfo || {}),
    label: achievement?.rarityLabel || achievement?.rarityInfo?.label || base.label,
    points: achievement?.points ?? achievement?.rarityInfo?.points ?? base.points,
  };
}

function hasOverlay() {
  const overlay = typeof document !== 'undefined' ? document.querySelector?.('.overlay') : null;
  return !!overlay?.classList?.contains?.('overlay');
}

function blocked() {
  return busy.size > 0 || hasOverlay();
}

function clearTimer() {
  if (timer !== null) clearTimeout(timer);
  timer = null;
}

function ensureHost() {
  if (host || typeof document === 'undefined') return host;
  host = document.createElement('div');
  host.id = 'achievement-celebration';
  host.hidden = true;
  host.setAttribute('role', 'status');
  host.setAttribute('aria-live', 'polite');
  host.setAttribute('aria-atomic', 'true');
  document.body.appendChild(host);
  if (typeof MutationObserver !== 'undefined') {
    observer = new MutationObserver((mutations) => {
      const changed = mutations.some((mutation) => [...mutation.addedNodes, ...mutation.removedNodes]
        .some((node) => node.classList?.contains?.('overlay')));
      if (changed) schedule(120);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
  return host;
}

function hideHost() {
  if (host) host.hidden = true;
}

function finishActive() {
  clearTimer();
  active = null;
  hideHost();
  schedule(180);
}

function present(sound = true) {
  if (!active || blocked()) { schedule(250); return; }
  const root = ensureHost();
  if (!root) return;
  clearTimer();
  const { achievement, sfx } = active;
  const rarity = rarityOf(achievement);
  root.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'achievement-celebration-card';
  card.dataset.rarity = achievement.rarity || 'common';
  card.dataset.achievementId = achievement.id;
  const glow = document.createElement('span');
  glow.className = 'achievement-celebration-glow';
  card.appendChild(glow);
  card.appendChild(achievementArtEl(achievement, { className: 'achievement-celebration-art' }));

  const body = document.createElement('div');
  body.className = 'achievement-celebration-body';
  const eyebrow = document.createElement('div');
  eyebrow.className = 'achievement-celebration-eyebrow';
  eyebrow.textContent = 'Новое достижение';
  const name = document.createElement('div');
  name.className = 'achievement-celebration-name';
  name.textContent = achievement.name;
  const meta = document.createElement('div');
  meta.className = 'achievement-celebration-meta';
  meta.textContent = `${rarity.label} · ${rarity.points} очков славы`;
  body.append(eyebrow, name, meta);
  if (queue.length) {
    const more = document.createElement('div');
    more.className = 'achievement-celebration-more';
    more.textContent = `Ещё в очереди: ${queue.length}`;
    body.appendChild(more);
  }
  card.appendChild(body);

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'achievement-celebration-close';
  close.setAttribute('aria-label', 'Закрыть уведомление');
  close.textContent = '×';
  close.addEventListener('click', finishActive);
  card.appendChild(close);
  root.appendChild(card);
  root.hidden = false;
  if (sound) sfx?.('achievement', rarity.rank);
  timer = setTimeout(finishActive, rarity.rank >= 3 ? 4800 : 3800);
  timer.unref?.();
}

function schedule(delay = 250) {
  clearTimer();
  if (!active && queue.length === 0) { hideHost(); return; }
  if (blocked()) {
    hideHost();
    timer = setTimeout(() => schedule(250), delay);
    timer.unref?.();
    return;
  }
  timer = setTimeout(() => {
    if (blocked()) { schedule(250); return; }
    if (!active) active = { ...queue.shift(), announced: false };
    const announced = active.announced;
    active.announced = true;
    present(!announced);
  }, delay);
  timer.unref?.();
}

export function queueAchievementCelebrations(achievements, { sfx } = {}) {
  const known = new Set([
    ...queue.map((entry) => entry.achievement.id),
    ...(active ? [active.achievement.id] : []),
  ]);
  for (const achievement of achievements || []) {
    if (!achievement?.id || known.has(achievement.id)) continue;
    known.add(achievement.id);
    queue.push({ achievement, sfx });
  }
  if (queue.length || active) schedule(active ? 250 : 900);
}

export function setAchievementPresentationBusy(key, value) {
  if (value) busy.add(key);
  else busy.delete(key);
  schedule(blocked() ? 250 : 120);
}

export function clearAchievementCelebrations() {
  clearTimer();
  queue = [];
  active = null;
  busy.clear();
  hideHost();
}

export function destroyAchievementCelebration() {
  clearAchievementCelebrations();
  observer?.disconnect();
  observer = null;
  host?.remove();
  host = null;
}

export function achievementCelebrationState() {
  return {
    activeId: active?.achievement.id || null,
    queuedIds: queue.map((entry) => entry.achievement.id),
    busy: [...busy],
    visible: !!host && !host.hidden,
  };
}
