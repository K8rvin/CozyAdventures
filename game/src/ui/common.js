// Общие UI-помощники: шапка экрана и оверлей наград.
import { ITEM_BY_ID } from '../data/items.js';
import { materialLabel } from '../data/materials.js';
import { skipPuzzle, skipPuzzlePrice } from '../core/state.js';

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

export function header(ctx, title, subtitle, backTo = 'hub') {
  const box = document.createElement('div');
  box.className = 'panel';
  const top = document.createElement('div');
  top.style.display = 'flex';
  top.style.justifyContent = 'space-between';
  top.style.alignItems = 'center';
  const h = document.createElement('h2');
  h.textContent = title;
  h.style.margin = '0';
  const back = document.createElement('button');
  back.className = 'ghost small';
  back.textContent = '← Назад';
  back.addEventListener('click', () => ctx.go(backTo));
  top.append(h, back);
  box.appendChild(top);
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

// Оверлей результата: showOverlay(ctx, { title, subtitle, rewardsHtml, advice, buttons: [{label, primary, onClick}] })
export function showOverlay(ctx, { title, subtitle, rewards, advice, buttons }) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  const rewardHtml = (rewards || []).map(rewardText).filter(Boolean).join('<br>');
  overlay.innerHTML = `
    <div class="card">
      <h2>${title}</h2>
      ${subtitle ? `<div class="muted">${subtitle}</div>` : ''}
      ${rewardHtml ? `<div class="rewards">${rewardHtml}</div>` : ''}
      ${advice ? `<div class="advice">💡 ${advice}</div>` : ''}
      <div class="actions"></div>
    </div>`;
  const actions = overlay.querySelector('.actions');
  for (const b of buttons) {
    const btn = document.createElement('button');
    btn.textContent = b.label;
    if (b.primary) btn.className = 'primary';
    btn.addEventListener('click', () => { overlay.remove(); b.onClick(); });
    actions.appendChild(btn);
  }
  document.body.appendChild(overlay);
  return overlay;
}
