// Иконки предметов и богатый тултип: имя цветом редкости, статы, сет, сравнение.
import { ITEM_BY_ID, RARITY_LABEL } from '../data/items.js';
import { SLOTS, SLOT_LABEL, itemScore } from '../core/items.js';
import { SETS } from '../data/sets.js';

const TYPE_EMOJI = {
  sword: '🗡️', mace: '🔨', dagger: '🔪', greatsword: '⚔️', greataxe: '🪓', bow: '🏹',
  shield: '🛡️', helmet: '🪖', armor: '🧥', gloves: '🧤', boots: '🥾',
  amulet: '📿', ring: '💍', potion: '🧪', staff: '🪄', scroll: '📜',
};

export function itemEmoji(item) {
  return TYPE_EMOJI[item?.type] || '🎁';
}

// Иконка с будущим артом: пока файла нет — остаётся эмодзи (img само удаляется).
export function itemIconEl(item, cls = 'icon') {
  const span = document.createElement('span');
  span.className = `${cls} item-ico ${item.rarity || 'common'}`;
  span.textContent = itemEmoji(item);
  const img = document.createElement('img');
  img.className = 'item-art';
  img.alt = '';
  img.addEventListener('error', () => img.remove());
  img.src = `assets/items/${item.id}_web.jpg`;
  span.appendChild(img);
  return span;
}

const STAT_META = {
  hp: ['❤️', 'Здоровье', 'flat'], attack: ['🗡️', 'Атака', 'flat'],
  armor: ['🛡️', 'Броня', 'flat'], speed: ['⚡', 'Скорость', 'flat'],
  crit: ['💥', 'Крит', 'pct'], dodge: ['💨', 'Уклонение', 'pct'],
  block: ['🔰', 'Блок', 'pct'], goldFind: ['🪙', 'Монеты', 'pct+'],
  itemFind: ['🎁', 'Находки', 'pct+'], materialsFind: ['🧵', 'Материалы', 'pct+'],
};
const RESIST_LABEL = {
  fire: '🔥 Сопр. огню', poison: '☠️ Сопр. яду', sleep: '😴 Сопр. сну',
  slow: '🐌 Сопр. замедлению', fear: '😨 Сопр. страху',
};
export const TRAIT_LABEL = {
  cleave_small: '⚔️ Рассечение: задевает соседних врагов',
  bonus_spirit: '🌿 Бонус против духов',
  ranged: '🏹 Дальний бой: бьёт самого хрупкого',
  first_hit_reduction: '🛡️ Первый удар по рыцарю слабее на 20%',
  thorns_small: '🌵 Шипы: отражают часть урона',
  heal_after_battle: '🏮 Лечение после боя',
  regen_ally: '🌱 Регенерация всю битву',
  fearless: '🦁 Иммунитет к страху',
  pierce: '🗡️ Пробитие: броня врага считается вдвое слабее',
};

function fmtStat(key, v) {
  const meta = STAT_META[key];
  if (!meta) return null;
  const [icon, label, kind] = meta;
  const val = kind === 'flat' ? `${v > 0 ? '+' : ''}${v}` : `+${Math.round(v * 100)}%`;
  return `<div class="it-stat">${icon} ${label} <b>${val}</b></div>`;
}

function statsHtml(item) {
  const rows = [];
  for (const [k, v] of Object.entries(item.stats || {})) {
    if (k === 'resist') {
      for (const [rk, rv] of Object.entries(v)) {
        rows.push(`<div class="it-stat">${RESIST_LABEL[rk] || rk} <b>+${Math.round(rv * 100)}%</b></div>`);
      }
    } else {
      const row = fmtStat(k, v);
      if (row) rows.push(row);
    }
  }
  return rows.join('');
}

function diffHtml(item, state) {
  if (!state) return '';
  if (item.slot === 'consumable') {
    const belt = (state.consumableBelt || []).map((id) => ITEM_BY_ID[id]?.name || id);
    return `<div class="it-diff"><div class="it-diff-title">Пояс (${belt.length}/2)</div>` +
      (belt.length ? belt.map((n) => `<div class="it-stat">🧪 ${n}</div>`).join('')
        : '<div class="it-stat it-good">кармашек свободен</div>') + '</div>';
  }
  let cur = null;
  if (item.slot === 'ring') {
    const r1 = ITEM_BY_ID[state.equipped.ring1];
    const r2 = ITEM_BY_ID[state.equipped.ring2];
    cur = [r1, r2].filter(Boolean).sort((a, b) => itemScore(a) - itemScore(b))[0] || null;
  } else {
    cur = ITEM_BY_ID[state.equipped[item.slot]] || null;
  }
  if (!cur) return `<div class="it-diff"><div class="it-stat it-good">слот свободен — наденется сразу</div></div>`;
  if (cur.id === item.id) return '';
  const KEYS = ['attack', 'armor', 'hp', 'speed', 'crit', 'dodge', 'block'];
  const parts = [];
  for (const k of KEYS) {
    const nv = item.stats?.[k] || 0;
    const cv = cur.stats?.[k] || 0;
    const d = nv - cv;
    if (d === 0) continue;
    const meta = STAT_META[k];
    const val = meta[2] === 'flat' ? `${d > 0 ? '+' : ''}${d}` : `${d > 0 ? '+' : ''}${Math.round(d * 100)}%`;
    parts.push(`<span class="${d > 0 ? 'it-good' : 'it-bad'}">${meta[0]} ${val}</span>`);
  }
  if (!parts.length) return `<div class="it-diff"><div class="it-diff-title">Как «${cur.name}»</div></div>`;
  return `<div class="it-diff"><div class="it-diff-title">Разница с «${cur.name}»</div>` +
    `<div class="it-diff-row">${parts.join(' ')}</div></div>`;
}

function setHtml(item, state) {
  if (!item.set || !SETS[item.set]) return '';
  const def = SETS[item.set];
  let count = 0;
  if (state) {
    for (const slot of SLOTS) {
      const it = ITEM_BY_ID[state.equipped[slot]];
      if (it?.set === item.set) count += 1;
    }
  }
  const tiers = [3, 6, 9].map((t) => {
    const active = count >= t;
    const td = def.tiers[t];
    return td ? `<div class="it-set-tier ${active ? 'on' : ''}">${active ? '●' : '○'} ${t}: ${td.desc}</div>` : '';
  }).join('');
  return `<div class="it-set"><div class="it-set-name">✨ Сет «${def.name}» — надето ${count}/9</div>${tiers}</div>`;
}

let tipEl = null;
let tipPinned = false;
let tipOutsideCloser = null;

export function hideItemTip() {
  if (tipOutsideCloser) {
    document.removeEventListener('pointerdown', tipOutsideCloser, true);
    tipOutsideCloser = null;
  }
  if (tipEl) { tipEl.remove(); tipEl = null; }
  tipPinned = false;
}

// Показать тултип у элемента anchor. opts.state — для сравнения и сетового прогресса.
// opts.pinned + opts.actionLabel/opts.onAction — тач-режим: кнопка действия и ✕.
export function showItemTip(item, anchor, opts = {}) {
  hideItemTip();
  if (!item) return;
  const rarity = RARITY_LABEL[item.rarity] || '';
  const slotLabel = item.slot === 'consumable' ? 'Расходник'
    : item.slot === 'ring' ? 'Кольцо' : (SLOT_LABEL[item.slot] || '');
  tipEl = document.createElement('div');
  tipEl.className = `item-tip ${item.rarity || 'common'}`;
  tipEl.innerHTML = `
    <div class="it-head">
      <span class="it-ico">${itemEmoji(item)}</span>
      <span>
        <div class="it-name">${item.name}</div>
        <div class="it-sub">${rarity}${slotLabel ? ` · ${slotLabel}` : ''}${item.hand === 'two' ? ' · двуручное' : ''}</div>
      </span>
    </div>
    ${statsHtml(item) ? `<div class="it-stats">${statsHtml(item)}</div>` : ''}
    ${(item.traits || []).length ? `<div class="it-traits">${item.traits.map((t) => TRAIT_LABEL[t] || t).join('<br>')}</div>` : ''}
    ${setHtml(item, opts.state)}
    ${diffHtml(item, opts.state)}
    ${item.description ? `<div class="it-desc">${item.description}</div>` : ''}`;
  if (opts.pinned) {
    tipEl.classList.add('pinned');
    const actions = document.createElement('div');
    actions.className = 'it-actions';
    if (opts.actionLabel && opts.onAction) {
      const act = document.createElement('button');
      act.className = 'small';
      act.textContent = opts.actionLabel;
      act.addEventListener('click', () => { hideItemTip(); opts.onAction(); });
      actions.appendChild(act);
    }
    const close = document.createElement('button');
    close.className = 'ghost small';
    close.textContent = '✕';
    close.addEventListener('click', hideItemTip);
    actions.appendChild(close);
    tipEl.appendChild(actions);
    tipPinned = true;
    tipOutsideCloser = (ev) => {
      if (tipEl && typeof tipEl.contains === 'function' && ev.target && tipEl.contains(ev.target)) return;
      hideItemTip();
    };
    document.addEventListener('pointerdown', tipOutsideCloser, true);
  }
  tipEl.style.visibility = 'hidden';
  document.body.appendChild(tipEl);
  const w = tipEl.offsetWidth || 260;
  const h = tipEl.offsetHeight || 140;
  const r = anchor.getBoundingClientRect();
  const right = r.right ?? (r.left + (r.width || 0));
  const winW = window.innerWidth || 1024;
  const winH = window.innerHeight || 768;
  let left = r.left - w - 10;
  if (left < 8) left = Math.min(right + 10, Math.max(8, winW - w - 8));
  let top = r.top + (r.height || 0) / 2 - h / 2;
  top = Math.max(8, Math.min(top, winH - h - 8));
  tipEl.style.left = `${left}px`;
  tipEl.style.top = `${top}px`;
  tipEl.style.visibility = '';
}

// Навешивает тултип на элемент (только мышь; на таче тап = действие).
export function bindItemTip(el, item, opts = {}) {
  el.addEventListener('pointerenter', (ev) => {
    if (ev.pointerType && ev.pointerType !== 'mouse') return;
    showItemTip(item, el, opts);
  });
  el.addEventListener('pointerleave', () => { if (!tipPinned) hideItemTip(); });
}
