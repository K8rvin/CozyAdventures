// Комната рыцаря: экипировка, характеристики, пояс зелий.
import { ITEM_BY_ID, RARITY_LABEL } from '../data/items.js';
import {
  SLOTS, SLOT_LABEL, collectStats, isShieldBlocked, describeItem,
} from '../core/items.js';
import {
  equipFromInventory, unequipToInventory, removeFromBelt, sellItem,
} from '../core/state.js';
import { quickNav } from './common.js';

const SLOT_ICONS = {
  weapon: 'weapon', shield: 'shield', helmet: 'helmet', armor: 'armor',
  gloves: 'gloves', boots: 'boots', amulet: 'amulet', ring1: 'ring', ring2: 'ring',
};

const TYPE_EMOJI = {
  sword: '🗡️', mace: '🔨', dagger: '🔪', greatsword: '⚔️', greataxe: '🪓', bow: '🏹',
  shield: '🛡️', helmet: '🪖', armor: '🧥', gloves: '🧤', boots: '🥾',
  amulet: '📿', ring: '💍', potion: '🧪', staff: '🪄',
};

export function itemEmoji(item) {
  return TYPE_EMOJI[item?.type] || '🎁';
}

export function renderEquip(container, ctx) {
  const { state } = ctx;

  const head = document.createElement('div');
  head.className = 'panel';
  head.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
    <h2 style="margin:0">Комната рыцаря</h2></div>
    <div class="muted">Надевай вещи — они реально меняют бой. Двуручное оружие занимает обе руки.</div>`;
  // AI-иконка рыцаря: web.jpg → jfif → svg
  const kIcon = document.createElement('img');
  kIcon.alt = '';
  kIcon.style.cssText = 'width:56px;height:56px;border-radius:12px;margin-right:10px;vertical-align:middle';
  const kCandidates = ['assets/icon_knight_web.jpg', 'assets/icon_knight.jfif', 'assets/icon_knight.svg'];
  let kIdx = 0;
  kIcon.addEventListener('error', () => {
    kIdx += 1;
    if (kIdx < kCandidates.length) kIcon.src = kCandidates[kIdx];
    else kIcon.remove();
  });
  kIcon.src = kCandidates[0];
  head.querySelector('h2').prepend(kIcon);
  const back = document.createElement('button');
  back.className = 'ghost small';
  back.textContent = '← Назад';
  back.addEventListener('click', () => ctx.go('hub'));
  head.firstElementChild.appendChild(back);
  container.appendChild(head);
  container.appendChild(quickNav(ctx, [
    { icon: '🏪', label: 'Прилавок', screen: 'shop', primary: true },
    { icon: '🏠', label: 'В лавку', screen: 'hub' },
  ]));

  const layout = document.createElement('div');
  layout.style.display = 'flex';
  layout.style.flexWrap = 'wrap';
  layout.style.gap = '14px';
  layout.style.alignItems = 'flex-start';

  // --- Слоты ---
  const slotsPanel = document.createElement('div');
  slotsPanel.className = 'panel';
  slotsPanel.style.flex = '1';
  slotsPanel.style.minWidth = '300px';
  slotsPanel.innerHTML = '<h3>Экипировка</h3>';
  const grid = document.createElement('div');
  grid.className = 'equip-grid';

  const shieldBlocked = isShieldBlocked(state.equipped);
  for (const slot of SLOTS) {
    const id = state.equipped[slot];
    const item = id ? ITEM_BY_ID[id] : null;
    const cell = document.createElement('div');
    cell.className = 'slot' + (item ? '' : ' empty') +
      (slot === 'shield' && shieldBlocked && !item ? ' blocked' : '');
    cell.innerHTML = `
      <div class="slot-name">${SLOT_LABEL[slot]}${slot === 'shield' && shieldBlocked ? ' (занято двуручным)' : ''}</div>
      <div class="slot-item">${item ? itemEmoji(item) : '＋'}</div>
      <div class="item-name">${item ? item.name : '—'}</div>`;
    cell.title = item ? `${describeItem(item)}\n${item.description}\nКлик — снять` : 'Пусто';
    if (item) {
      cell.addEventListener('click', () => {
        unequipToInventory(state, slot);
        ctx.save();
        rerender();
      });
    }
    grid.appendChild(cell);
  }
  slotsPanel.appendChild(grid);

  // --- Пояс зелий ---
  const belt = document.createElement('div');
  belt.innerHTML = '<h3>Пояс зелий (до 2)</h3>';
  const beltRow = document.createElement('div');
  beltRow.style.display = 'flex';
  beltRow.style.gap = '8px';
  for (let i = 0; i < 2; i++) {
    const id = state.consumableBelt[i];
    const item = id ? ITEM_BY_ID[id] : null;
    const cell = document.createElement('div');
    cell.className = 'slot' + (item ? '' : ' empty');
    cell.style.flex = '1';
    cell.innerHTML = `
      <div class="slot-name">Кармашек ${i + 1}</div>
      <div class="slot-item">${item ? itemEmoji(item) : '＋'}</div>
      <div class="item-name">${item ? item.name : '—'}</div>`;
    if (item) {
      cell.title = `${item.description}\nКлик — убрать из пояса`;
      cell.addEventListener('click', () => {
        removeFromBelt(state, i);
        ctx.save();
        rerender();
      });
    }
    beltRow.appendChild(cell);
  }
  belt.appendChild(beltRow);
  slotsPanel.appendChild(belt);
  layout.appendChild(slotsPanel);

  // --- Характеристики ---
  const statsPanel = document.createElement('div');
  statsPanel.className = 'panel';
  statsPanel.style.flex = '1';
  statsPanel.style.minWidth = '260px';
  statsPanel.innerHTML = '<h3>Характеристики</h3>';
  const { stats, traits } = collectStats(state.equipped);
  const sgrid = document.createElement('div');
  sgrid.className = 'stats-grid';
  const rows = [
    ['❤️ Здоровье', stats.hp],
    ['🗡️ Атака', stats.attack],
    ['🛡️ Броня', stats.armor],
    ['⚡ Скорость', stats.speed],
    ['💥 Крит', `${Math.round(stats.crit * 100)}%`],
    ['💨 Уклонение', `${Math.round(stats.dodge * 100)}%`],
    ['🔰 Блок', `${Math.round(stats.block * 100)}%`],
    ['🪙 Монеты', `+${Math.round((stats.goldFind || 0) * 100)}%`],
  ];
  for (const [rk, rv] of Object.entries(stats.resist || {})) {
    const RL = { fire: '🔥 огню', poison: '☠️ яду', sleep: '😴 сну', slow: '🐌 замедлению', fear: '😨 страху' };
    rows.push([`Сопр. ${RL[rk] || rk}`, `${Math.round(rv * 100)}%`]);
  }
  for (const [k, v] of rows) {
    const d = document.createElement('div');
    d.innerHTML = `${k}: <b>${v}</b>`;
    sgrid.appendChild(d);
  }
  statsPanel.appendChild(sgrid);
  if (traits.length > 0) {
    const t = document.createElement('div');
    t.className = 'muted mt';
    t.style.fontSize = '13px';
    const TL = {
      cleave_small: '⚔️ Рассечение: задевает соседних врагов',
      bonus_spirit: '🌿 Бонус против духов',
      ranged: '🏹 Дальний бой: бьёт самого хрупкого',
      first_hit_reduction: '🛡️ Первый удар по рыцарю слабее на 20%',
      thorns_small: '🌵 Шипы на щите',
      heal_after_battle: '🏮 Лечение после боя',
    };
    t.innerHTML = traits.map((x) => TL[x] || x).join('<br>');
    statsPanel.appendChild(t);
  }
  layout.appendChild(statsPanel);
  container.appendChild(layout);

  // --- Инвентарь ---
  const inv = document.createElement('div');
  inv.className = 'panel';
  inv.innerHTML = `<h3>Сундук (${state.inventory.length})</h3>`;
  const list = document.createElement('div');
  list.className = 'list';
  if (state.inventory.length === 0) {
    list.innerHTML = '<div class="muted">Пусто. Решай загадки и заходи к прилавку!</div>';
  }
  state.inventory.forEach((id, index) => {
    const item = ITEM_BY_ID[id];
    if (!item) return;
    const row = document.createElement('div');
    row.className = 'row';
    const rarity = RARITY_LABEL[item.rarity] || '';
    row.innerHTML = `
      <span class="icon">${itemEmoji(item)}</span>
      <span class="grow">
        <div class="name">${item.name} <span class="badge ${item.rarity}">${rarity}</span></div>
        <div class="desc">${describeItem(item) || item.description}</div>
      </span>`;
    const btn = document.createElement('button');
    btn.className = 'small';
    btn.textContent = item.slot === 'consumable' ? 'В пояс' : 'Надеть';
    btn.addEventListener('click', () => {
      const r = equipFromInventory(state, index);
      if (r.ok) {
        ctx.toast(item.slot === 'consumable' ? `${item.name} — в поясе` : `Надето: ${item.name}`);
        ctx.save();
        rerender();
      } else {
        ctx.toast(r.error || 'Не получается надеть');
      }
    });
    row.appendChild(btn);
    // Быстрая продажа прямо из сундука (за полцены; печатные не продаём)
    if (!item.sealPrice) {
      const sellBtn = document.createElement('button');
      sellBtn.className = 'small ghost';
      sellBtn.textContent = `🪙 ${Math.max(1, Math.floor(item.price / 2))}`;
      sellBtn.title = `Продать «${item.name}» за полцены`;
      sellBtn.addEventListener('click', () => {
        const r = sellItem(state, index);
        if (r.ok) {
          ctx.toast(`Продано: ${item.name} за ${r.price} монет`);
          ctx.sfx?.('coin');
          ctx.save();
          rerender();
        }
      });
      row.appendChild(sellBtn);
    }
    list.appendChild(row);
  });
  inv.appendChild(list);
  container.appendChild(inv);

  function rerender() {
    container.innerHTML = '';
    renderEquip(container, ctx);
  }
}
