// Общие UI-помощники: шапка экрана и оверлей наград.
import { ITEM_BY_ID } from '../data/items.js';
import { materialLabel } from '../data/materials.js';
import { skipPuzzle, skipPuzzlePrice } from '../core/state.js';
import { onboardingBlocksStory, onboardingCtaForResult } from '../core/onboarding.js';
import { destroyTutorial } from './tutorial.js';
import { savingsGoalSummary } from './goalView.js';

// Кнопка «Пропустить загадку за монеты» для экранов головоломок.
export function puzzleSkipButton(ctx, level, onSkipped) {
  const price = skipPuzzlePrice(level);
  const b = document.createElement('button');
  b.className = 'ghost small';
  b.innerHTML = `⏭️ Пропустить за 🪙${price}`;
  b.title = 'Кот-хранитель подскажет решение соседям (награды уровня не будет)';
  b.addEventListener('click', () => {
    if (!confirm(`Пропустить «${level.name}» за ${price} монет? Награды уровня не будет.`)) return;
    const r = skipPuzzle(ctx.state, level.id);
    if (r.ok) {
      ctx.sfx?.('coin');
      ctx.toast(`Загадка пропущена. Утешение от кота: 🪙${r.consolation}`);
      ctx.save();
      onSkipped?.();
    } else {
      ctx.toast(r.error);
    }
  });
  return b;
}

// Назад к списку головоломок того же типа (по экрану типов)
export function backToPuzzleType(ctx, level) {
  ctx.go('puzzles', { mech: level?.mechanic || 'mirror' });
}

export const DEFAULT_TOPBAR_TITLE = 'Лавка на перекрёстке миров';

export function resetTopbarHeader() {
  const titleEl = document.getElementById('topbar-title');
  const back = document.getElementById('topbar-back');
  if (titleEl) {
    titleEl.textContent = DEFAULT_TOPBAR_TITLE;
    titleEl.title = DEFAULT_TOPBAR_TITLE;
  }
  if (back) {
    back.hidden = true;
    back.onclick = null;
  }
}

// Заголовок и возврат живут в закреплённом topbar, подзаголовок — в потоке страницы.
export function header(ctx, title, subtitle, backTo = 'hub') {
  const titleEl = document.getElementById('topbar-title');
  const back = document.getElementById('topbar-back');
  if (titleEl) {
    titleEl.textContent = title;
    titleEl.title = title;
  }
  if (back) {
    back.hidden = false;
    back.onclick = () => {
      if (Array.isArray(backTo)) ctx.go(backTo[0], backTo[1]);
      else ctx.go(backTo);
    };
  }
  const box = document.createElement('div');
  box.className = 'app-header';
  if (subtitle) {
    const s = document.createElement('div');
    s.className = 'muted';
    s.textContent = subtitle;
    box.appendChild(s);
  }
  return box;
}

// Плавающая панель быстрой навигации: круглые кнопки справа внизу,
// видны в любом положении скролла. items: [{ icon, label, screen, params?, primary? }]
export function quickNav(ctx, items) {
  const nav = document.createElement('div');
  nav.className = 'quick-nav';
  for (const it of items) {
    const b = document.createElement('button');
    b.innerHTML = `${it.icon}<span class="qn-label">${it.label}</span>`;
    b.setAttribute('aria-label', it.label);
    if (it.primary) b.className = 'primary';
    b.addEventListener('click', () => { ctx.sfx?.('tap'); ctx.go(it.screen, it.params || {}); });
    nav.appendChild(b);
  }
  return nav;
}

export function rewardText(r) {
  if (r.type === 'coins') return `🪙 ${r.amount} монет`;
  if (r.type === 'seals') return `🔰 ${r.amount} печать мастера`;
  if (r.type === 'item') return `🎁 ${ITEM_BY_ID[r.id]?.name || r.id}`;
  if (r.type === 'material') return `Материал: ${materialLabel(r.id)}${r.amount > 1 ? ` ×${r.amount}` : ''}`;
  return '';
}

// Оверлей результата: showOverlay(ctx, { title, subtitle, rewards, advice, buttons, onboardingResult })
export function showOverlay(ctx, { title, subtitle, rewards, advice, buttons = [], art, onboardingResult = null }) {
  destroyTutorial();
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  const rewardHtml = (rewards || []).map(rewardText).filter(Boolean).join('<br>');
  const goalHtml = onboardingResult || rewardHtml || advice
    ? savingsGoalSummary(ctx.state)
    : '';
  overlay.innerHTML = `
    <div class="card">
      ${art ? `<div class="overlay-art">${art}</div>` : ''}
      <h2>${title}</h2>
      ${subtitle ? `<div class="muted">${subtitle}</div>` : ''}
      ${rewardHtml ? `<div class="rewards">${rewardHtml}</div>` : ''}
      ${goalHtml ? `<div class="goal-progress">${goalHtml}</div>` : ''}
      ${advice ? `<div class="advice">💡 ${advice}</div>` : ''}
      <div class="actions"></div>
    </div>`;
  const actions = overlay.querySelector('.actions');
  const tutorialCta = onboardingCtaForResult(ctx.state, onboardingResult);
  if (tutorialCta) {
    const btn = document.createElement('button');
    btn.className = 'primary';
    btn.textContent = tutorialCta.label;
    btn.dataset.onboardingCta = onboardingResult.id;
    btn.addEventListener('click', () => {
      overlay.remove();
      ctx.go(tutorialCta.route.name, tutorialCta.route.params);
    });
    actions.appendChild(btn);
  }
  // История не перехватывает первую дугу; её обычный переход возвращается после неё.
  const story = ctx.state?.story;
  if (!tutorialCta && !onboardingBlocksStory(ctx.state)
    && ctx.state?.settings?.storyMode !== false && story?.justCompleted) {
    story.justCompleted = null;
    const storyBtn = document.createElement('button');
    storyBtn.className = 'primary';
    storyBtn.textContent = '📖 Дальше по истории';
    storyBtn.addEventListener('click', () => { overlay.remove(); ctx.go('story'); });
    actions.appendChild(storyBtn);
  }
  for (const b of buttons) {
    const btn = document.createElement('button');
    btn.textContent = b.label;
    if (b.primary && !tutorialCta) btn.className = 'primary';
    btn.addEventListener('click', () => { overlay.remove(); b.onClick(); });
    actions.appendChild(btn);
  }
  // Клик по фону закрывает оверлей (чтобы зависший не держал экран заложником)
  overlay.addEventListener('click', (ev) => { if (ev.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
  // Enter/пробел — основная кнопка («Следующая →» и т.п.); слушатель самоочищается
  const onKey = (ev) => {
    if (!overlay.isConnected) { window.removeEventListener('keydown', onKey); return; }
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    ev.preventDefault();
    const btn = overlay.querySelector('.actions button.primary') || overlay.querySelector('.actions button');
    btn?.click();
  };
  window.addEventListener('keydown', onKey);
  return overlay;
}
