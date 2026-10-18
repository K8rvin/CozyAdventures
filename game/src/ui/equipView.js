// Комната рыцаря: экипировка, сундук с фильтрами, характеристики, пояс зелий.
// Справа — вкладки «Сундук»/«Характеристики»; драг предметов — на pointer events.
import { ITEM_BY_ID, RARITY_LABEL } from '../data/items.js';
import {
  SLOTS, SLOT_LABEL, collectStats, isShieldBlocked,
} from '../core/items.js';
import {
  equipFromInventory, unequipToInventory, removeFromBelt, autoEquipBest,
} from '../core/state.js';
import { SETS } from '../data/sets.js';
import { PET_BY_ID } from '../data/crew.js';
import { quickNav } from './common.js';
import {
  itemEmoji, itemIconEl, showItemTip, hideItemTip, bindItemTip, TRAIT_LABEL,
} from './itemTip.js';

export { itemEmoji }; // для craftView и shopView

// --- Состояние экрана: живёт между rerender, чистится при уходе со страницы ---
let activeTab = 'chest';     // 'chest' | 'stats'
let filterSlot = 'all';      // 'all' | slot | 'ring' | 'consumable'
let filterRarity = 'all';    // 'all' | rarity
let targetSlot = null;       // слот или 'belt', для которого подбираем предмет
let newIds = null;           // Set id новых предметов этого визита (метка ✦)
let suppressClick = false;   // только что закончился драг — глушим клик
let escHandler = null;

const RARITY_RANK = { common: 0, rare: 1, epic: 2, legendary: 3 };
const SLOT_CHIPS = [
  ['weapon', 'Оружие'], ['shield', 'Щит'], ['helmet', 'Шлем'], ['armor', 'Броня'],
  ['gloves', 'Перчатки'], ['boots', 'Сапоги'], ['amulet', 'Амулет'],
  ['ring', 'Кольца'], ['consumable', 'Расходники'],
];
const SET_TAG_CLASS = {
  meadow: 'meadow', town: 'town', attic: 'attic', master: 'master',
  swamp: 'swamp', fair: 'fair', ember: 'ember',
};

function matchesTarget(item, ts) {
  if (ts === 'belt') return item.slot === 'consumable';
  if (ts === 'ring1' || ts === 'ring2') return item.slot === 'ring';
  return item.slot === ts;
}

function filterForTarget(ts) {
  if (ts === 'belt') return 'consumable';
  if (ts === 'ring1' || ts === 'ring2') return 'ring';
  return ts;
}

function slotMatchesFilter(item, f) {
  if (f === 'all') return true;
  if (f === 'ring') return item.slot === 'ring';
  if (f === 'consumable') return item.slot === 'consumable';
  return item.slot === f;
}

export function renderEquip(container, ctx) {
  const { state } = ctx;

  // Метки «новое»: diff инвентаря против inventorySeen — один раз за визит
  if (newIds === null) {
    const seen = new Set(state.inventorySeen || []);
    newIds = new Set(state.inventory.filter((id) => id && !seen.has(id)));
    if (newIds.size) {
      state.inventorySeen = [...new Set([...state.inventorySeen || [], ...state.inventory])];
      ctx.save();
    }
  }
  if (targetSlot && targetSlot !== 'belt' && state.equipped[targetSlot]) targetSlot = null;

  const head = document.createElement('div');
  head.className = 'panel';
  head.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
    <h2 style="margin:0">Комната рыцаря</h2></div>
    <div class="muted">Надевай вещи — они реально меняют бой. Перетаскивай предметы или кликай по пустому слоту.</div>`;
  // AI-иконка рыцаря: web.jpg, фолбэк — без иконки
  const kIcon = document.createElement('img');
  kIcon.alt = '';
  kIcon.style.cssText = 'width:56px;height:56px;border-radius:12px;margin-right:10px;vertical-align:middle';
  const kCandidates = ['assets/knight/icon_knight_web.jpg'];
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

  // Esc снимает режим выбора для слота
  if (escHandler) window.removeEventListener('keydown', escHandler);
  escHandler = (ev) => {
    if (ev.key === 'Escape' && targetSlot) {
      targetSlot = null;
      filterSlot = 'all';
      rerender();
    }
  };
  window.addEventListener('keydown', escHandler);

  const layout = document.createElement('div');
  layout.style.display = 'flex';
  layout.style.flexWrap = 'wrap';
  layout.style.gap = '14px';
  layout.style.alignItems = 'flex-start';

  // --- Живой рыцарь: внешний вид от экипировки ---
  const dollPanel = document.createElement('div');
  dollPanel.className = 'panel';
  dollPanel.style.textAlign = 'center';
  dollPanel.innerHTML = '<h3>Рыцарь</h3>';
  const doll = document.createElement('canvas');
  doll.width = 220;
  doll.height = 280;
  doll.style.maxWidth = '100%';
  dollPanel.appendChild(doll);
  drawKnightDoll(doll, state);
  layout.appendChild(dollPanel);

  // --- Слоты + пояс (drop-зоны собираем по ходу рендера) ---
  const slotEls = {};  // slot -> el
  const beltEls = [];  // i -> el
  let chestListEl = null;

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
      (slot === 'shield' && shieldBlocked && !item ? ' blocked' : '') +
      (slot === targetSlot ? ' targeting' : '');
    cell.innerHTML = `
      <div class="slot-name">${SLOT_LABEL[slot]}${slot === 'shield' && shieldBlocked ? ' (занято двуручным)' : ''}</div>
      <div class="slot-item"></div>
      <div class="item-name">${item ? item.name : '—'}</div>`;
    const icoBox = cell.querySelector('.slot-item');
    if (item) icoBox.appendChild(itemIconEl(item, 'slot-ico'));
    else icoBox.textContent = '＋';
    slotEls[slot] = cell;
    if (item) {
      bindItemTip(cell, item, { state });
      cell.addEventListener('click', () => {
        if (suppressClick) return;
        unequipToInventory(state, slot);
        ctx.sfx?.('tap');
        ctx.save();
        rerender();
      });
      cell.addEventListener('pointerdown', (ev) => {
        startItemDrag(ev, { kind: 'slot', slot, item });
      });
    } else if (!(slot === 'shield' && shieldBlocked)) {
      // Клик по пустому слоту — режим выбора: сундук фильтруется под слот
      cell.addEventListener('click', () => {
        if (suppressClick) return;
        if (targetSlot === slot) {
          targetSlot = null;
          filterSlot = 'all';
        } else {
          targetSlot = slot;
          filterSlot = filterForTarget(slot);
          activeTab = 'chest';
        }
        ctx.sfx?.('tap');
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
    cell.className = 'slot' + (item ? '' : ' empty') + (targetSlot === 'belt' && !item ? ' targeting' : '');
    cell.style.flex = '1';
    cell.innerHTML = `
      <div class="slot-name">Кармашек ${i + 1}</div>
      <div class="slot-item"></div>
      <div class="item-name">${item ? item.name : '—'}</div>`;
    const icoBox = cell.querySelector('.slot-item');
    if (item) icoBox.appendChild(itemIconEl(item, 'slot-ico'));
    else icoBox.textContent = '＋';
    beltEls[i] = cell;
    if (item) {
      bindItemTip(cell, item, { state });
      cell.addEventListener('click', () => {
        if (suppressClick) return;
        removeFromBelt(state, i);
        ctx.sfx?.('tap');
        ctx.save();
        rerender();
      });
      cell.addEventListener('pointerdown', (ev) => {
        startItemDrag(ev, { kind: 'belt', i, item });
      });
    } else {
      cell.addEventListener('click', () => {
        if (suppressClick) return;
        if (targetSlot === 'belt') {
          targetSlot = null;
          filterSlot = 'all';
        } else {
          targetSlot = 'belt';
          filterSlot = 'consumable';
          activeTab = 'chest';
        }
        ctx.sfx?.('tap');
        rerender();
      });
    }
    beltRow.appendChild(cell);
  }
  belt.appendChild(beltRow);
  slotsPanel.appendChild(belt);
  layout.appendChild(slotsPanel);

  // --- Правая панель: вкладки «Сундук» / «Характеристики» ---
  const side = document.createElement('div');
  side.className = 'panel equip-side';
  const tabbar = document.createElement('div');
  tabbar.className = 'equip-tabs';
  const mkTab = (key, label) => {
    const b = document.createElement('button');
    b.className = 'equip-tab' + (activeTab === key ? ' on' : '');
    b.textContent = label;
    b.addEventListener('click', () => { activeTab = key; rerender(); });
    return b;
  };
  tabbar.appendChild(mkTab('chest', `Сундук (${state.inventory.length})`));
  tabbar.appendChild(mkTab('stats', 'Характеристики'));
  side.appendChild(tabbar);

  if (activeTab === 'chest') side.appendChild(buildChest());
  else side.appendChild(buildStats());
  layout.appendChild(side);
  container.appendChild(layout);

  // === Вкладка «Сундук»: строка селектов-фильтров + сетка иконок 3×N ===
  function buildChest() {
    const box = document.createElement('div');

    // Строка режима выбора (видна, только пока выбираем предмет для слота)
    if (targetSlot) {
      const bar = document.createElement('div');
      bar.className = 'chest-bar';
      const t = document.createElement('span');
      t.className = 'chest-target';
      const label = targetSlot === 'belt' ? 'Пояс' : SLOT_LABEL[targetSlot];
      t.innerHTML = `Выбор: <b>${label}</b> `;
      const x = document.createElement('button');
      x.className = 'ghost small';
      x.textContent = '✕';
      x.addEventListener('click', () => { targetSlot = null; filterSlot = 'all'; rerender(); });
      t.appendChild(x);
      bar.appendChild(t);
      box.appendChild(bar);
    }

    // Одна строка: фильтр типа + фильтр редкости + «Надеть лучшее»
    const filters = document.createElement('div');
    filters.className = 'chest-filters';

    const present = new Set(state.inventory.map((id) => {
      const it = ITEM_BY_ID[id];
      if (!it) return null;
      return it.slot === 'ring' ? 'ring' : it.slot;
    }).filter(Boolean));
    const mkOpt = (sel, val, label, cur) => {
      const o = document.createElement('option');
      o.value = val;
      o.textContent = label;
      if (val === cur) o.selected = true;
      sel.appendChild(o);
    };
    const typeSel = document.createElement('select');
    typeSel.className = 'chest-filter';
    typeSel.title = 'Фильтр по типу предмета';
    mkOpt(typeSel, 'all', 'Все типы', filterSlot);
    for (const [key, label] of SLOT_CHIPS) {
      if (present.has(key)) mkOpt(typeSel, key, label, filterSlot);
    }
    typeSel.addEventListener('change', () => {
      filterSlot = typeSel.value;
      if (filterSlot !== 'all' && targetSlot && filterForTarget(targetSlot) !== filterSlot) targetSlot = null;
      rerender();
    });
    filters.appendChild(typeSel);

    const presentR = new Set(state.inventory.map((id) => ITEM_BY_ID[id]?.rarity).filter(Boolean));
    const rarSel = document.createElement('select');
    rarSel.className = 'chest-filter';
    rarSel.title = 'Фильтр по редкости';
    mkOpt(rarSel, 'all', 'Любая редкость', filterRarity);
    for (const r of ['common', 'rare', 'epic', 'legendary']) {
      if (presentR.has(r)) mkOpt(rarSel, r, RARITY_LABEL[r], filterRarity);
    }
    rarSel.addEventListener('change', () => { filterRarity = rarSel.value; rerender(); });
    filters.appendChild(rarSel);

    const best = document.createElement('button');
    best.className = 'small chest-best';
    best.textContent = '✨';
    best.title = 'Надеть лучшее из сундука';
    best.addEventListener('click', () => {
      const r = autoEquipBest(state);
      if (r.changed) {
        ctx.toast(`Надето лучшее: ${r.names.join(', ')}`);
        ctx.sfx?.('success');
        ctx.save();
        rerender();
      } else {
        ctx.toast('Лучшее уже надето');
      }
    });
    filters.appendChild(best);
    box.appendChild(filters);

    // Сетка с фильтрами и сортировкой: сеты группами, редкость по убыванию
    const entries = state.inventory
      .map((id, index) => ({ id, index, item: ITEM_BY_ID[id] }))
      .filter((e) => e.item)
      .filter((e) => slotMatchesFilter(e.item, filterSlot))
      .filter((e) => filterRarity === 'all' || e.item.rarity === filterRarity);
    entries.sort((a, b) => {
      const sa = a.item.set ? 0 : 1;
      const sb = b.item.set ? 0 : 1;
      if (sa !== sb) return sa - sb;
      if (sa === 0) {
        const cmp = (SETS[a.item.set]?.name || '').localeCompare(SETS[b.item.set]?.name || '', 'ru');
        if (cmp) return cmp;
      }
      const rd = (RARITY_RANK[b.item.rarity] ?? 0) - (RARITY_RANK[a.item.rarity] ?? 0);
      if (rd) return rd;
      return a.item.name.localeCompare(b.item.name, 'ru');
    });

    const grid = document.createElement('div');
    grid.className = 'chest-grid';
    chestListEl = grid;
    if (!state.inventory.length) {
      grid.innerHTML = '<div class="muted">Пусто. Решай загадки и заходи к прилавку!</div>';
    } else if (!entries.length) {
      grid.innerHTML = '<div class="muted">Под фильтр ничего не подпало.</div>';
    }
    for (const { id, index, item } of entries) {
      const cell = document.createElement('div');
      cell.className = `chest-cell ${item.rarity || 'common'}`;
      cell.appendChild(itemIconEl(item, 'tile-ico'));
      if (newIds.has(id)) {
        const star = document.createElement('span');
        star.className = 'new-star';
        star.textContent = '✦';
        star.title = 'Новое в сундуке';
        cell.appendChild(star);
      }
      if (item.set && SETS[item.set]) {
        const dot = document.createElement('span');
        dot.className = `set-dot ${SET_TAG_CLASS[item.set] || ''}`;
        dot.title = `Сет «${SETS[item.set].name}»`;
        cell.appendChild(dot);
      }
      bindItemTip(cell, item, { state });
      cell.addEventListener('pointerdown', (ev) => {
        startItemDrag(ev, {
          kind: 'chest',
          index,
          item,
          onTap: (e) => {
            // Тач: тап = закреплённый тултип с кнопкой; мышь: клик = надеть
            if (e.pointerType === 'touch') {
              showItemTip(item, cell, {
                state,
                pinned: true,
                actionLabel: item.slot === 'consumable' ? 'В пояс' : 'Надеть',
                onAction: () => equipTile(item),
              });
            } else {
              equipTile(item);
            }
          },
        });
      });
      grid.appendChild(cell);
    }
    box.appendChild(grid);
    return box;
  }

  // Надеть предмет из сундука (клик по плитке или кнопка в тултипе)
  function equipTile(item) {
    const index = state.inventory.indexOf(item.id);
    if (index < 0) return;
    const r = equipFromInventory(state, index);
    if (r.ok) {
      ctx.toast(item.slot === 'consumable' ? `${item.name} — в поясе` : `Надето: ${item.name}`);
      if (targetSlot && matchesTarget(item, targetSlot)) targetSlot = null;
      ctx.sfx?.('rotate');
      ctx.save();
      rerender();
    } else {
      ctx.toast(r.error || 'Не получается надеть');
    }
  }

  // === Вкладка «Характеристики» ===
  function buildStats() {
    const box = document.createElement('div');
    const { stats, traits, activeSets } = collectStats(state.equipped);
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
    box.appendChild(sgrid);
    // Сетовые эффекты
    if ((activeSets || []).length > 0) {
      const setBox = document.createElement('div');
      setBox.className = 'panel mt';
      setBox.style.background = '#3d3328';
      setBox.innerHTML = '<h3 style="margin-top:0">✨ Сетовые эффекты</h3>' +
        activeSets.map((st) =>
          `<div style="font-size:14px;margin-bottom:4px"><b>Сет «${st.name}» ${st.count}/9</b> · тир ${st.tier}: <span class="muted">${st.desc}</span></div>`
        ).join('');
      box.appendChild(setBox);
    }
    if (traits.length > 0) {
      const t = document.createElement('div');
      t.className = 'muted mt';
      t.style.fontSize = '13px';
      t.innerHTML = traits.map((x) => TRAIT_LABEL[x] || x).join('<br>');
      box.appendChild(t);
    }
    if (!traits.length && !(activeSets || []).length) {
      const hint = document.createElement('div');
      hint.className = 'muted mt';
      hint.style.fontSize = '13px';
      hint.textContent = 'Надевай вещи из сундука — характеристики вырастут.';
      box.appendChild(hint);
    }
    return box;
  }

  // === Драг-анд-дроп на pointer events (паттерн «Карт судьбы») ===
  function dropTargetsFor(payload) {
    const list = [];
    if (payload.kind === 'chest') {
      if (payload.item.slot === 'consumable') {
        beltEls.forEach((el, i) => list.push({ type: 'belt', i, el }));
      } else if (payload.item.slot === 'ring') {
        list.push({ type: 'slot', slot: 'ring1', el: slotEls.ring1 });
        list.push({ type: 'slot', slot: 'ring2', el: slotEls.ring2 });
      } else {
        list.push({ type: 'slot', slot: payload.item.slot, el: slotEls[payload.item.slot] });
      }
    } else if (payload.kind === 'slot') {
      if (chestListEl) list.push({ type: 'chest', el: chestListEl });
      // Кольца можно менять местами
      if (payload.slot === 'ring1') list.push({ type: 'slot', slot: 'ring2', el: slotEls.ring2, swap: true });
      if (payload.slot === 'ring2') list.push({ type: 'slot', slot: 'ring1', el: slotEls.ring1, swap: true });
    } else if (payload.kind === 'belt') {
      if (chestListEl) list.push({ type: 'chest', el: chestListEl });
    }
    return list.filter((t) => t.el);
  }

  function startItemDrag(ev, payload) {
    if (ev.button != null && ev.button !== 0) return;
    ev.preventDefault();
    hideItemTip();
    const startX = ev.clientX;
    const startY = ev.clientY;
    const targets = dropTargetsFor(payload);
    let dragging = false;
    let ghost = null;
    let hover = null;

    const twoHandWarn = payload.kind === 'chest' && payload.item.slot === 'weapon'
      && payload.item.hand === 'two' && state.equipped.shield;

    const clearMarks = () => {
      for (const t of targets) t.el.classList.remove('drop-cand', 'drop-ok');
      if (twoHandWarn && slotEls.shield) slotEls.shield.classList.remove('drop-warn');
      hover = null;
    };
    const targetAt = (x, y) => targets.find((t) => {
      const r = t.el.getBoundingClientRect();
      const right = r.right ?? (r.left + (r.width || 0));
      const bottom = r.bottom ?? (r.top + (r.height || 0));
      return x >= r.left && x <= right && y >= r.top && y <= bottom;
    });

    const onMove = (e) => {
      if (!dragging && Math.hypot(e.clientX - startX, e.clientY - startY) > 7) {
        dragging = true;
        ghost = document.createElement('div');
        ghost.className = 'drag-ghost';
        ghost.textContent = itemEmoji(payload.item);
        document.body.appendChild(ghost);
        for (const t of targets) t.el.classList.add('drop-cand');
        if (twoHandWarn && slotEls.shield) slotEls.shield.classList.add('drop-warn');
      }
      if (dragging && ghost) {
        ghost.style.transform = `translate(${e.clientX - 21}px, ${e.clientY - 21}px)`;
        const t = targetAt(e.clientX, e.clientY);
        if (t !== hover) {
          hover = t || null;
          for (const x of targets) x.el.classList.toggle('drop-ok', x === t);
        }
      }
    };
    const onUp = (e) => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      clearMarks();
      if (ghost) ghost.remove();
      const cancelled = e.type === 'pointercancel'; // системный скролл — не тап и не дроп
      if (!dragging) { if (!cancelled) payload.onTap?.(e); return; }
      if (cancelled) return;
      suppressClick = true;
      setTimeout(() => { suppressClick = false; }, 60);
      const t = e.clientX != null ? targetAt(e.clientX, e.clientY) : null;
      if (t) handleDrop(payload, t);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  }

  function handleDrop(payload, t) {
    let ok = false;
    let msg = '';
    if (payload.kind === 'chest' && (t.type === 'slot' || t.type === 'belt')) {
      // Кольцо в конкретный занятый слот: сначала освобождаем его
      if (t.type === 'slot' && payload.item.slot === 'ring' && state.equipped[t.slot]) {
        unequipToInventory(state, t.slot);
      }
      // Зелье в занятый кармашек: меняемся местами
      if (t.type === 'belt' && state.consumableBelt[t.i]) removeFromBelt(state, t.i);
      const idx = state.inventory.indexOf(payload.item.id);
      // index из payload мог съехать после манипуляций выше — ищем заново
      const r = equipFromInventory(state, idx >= 0 ? idx : payload.index);
      ok = r.ok;
      msg = ok
        ? (payload.item.slot === 'consumable' ? `${payload.item.name} — в поясе` : `Надето: ${payload.item.name}`)
        : (r.error || 'Не получается надеть');
      if (ok && targetSlot && matchesTarget(payload.item, targetSlot)) targetSlot = null;
    } else if (payload.kind === 'slot' && t.type === 'chest') {
      ok = unequipToInventory(state, payload.slot);
      msg = ok ? `Снято: ${payload.item.name}` : '';
    } else if (payload.kind === 'slot' && t.type === 'slot' && t.swap) {
      const a = state.equipped[payload.slot];
      state.equipped[payload.slot] = state.equipped[t.slot];
      state.equipped[t.slot] = a;
      ok = true;
      msg = 'Кольца поменялись местами';
    } else if (payload.kind === 'belt' && t.type === 'chest') {
      ok = removeFromBelt(state, payload.i);
      msg = ok ? `${payload.item.name} — в сундуке` : '';
    }
    if (ok) {
      ctx.toast(msg);
      ctx.sfx?.('rotate');
      ctx.save();
      rerender();
    } else if (msg) {
      ctx.toast(msg);
    }
  }

  function rerender() {
    hideItemTip(); // якорь тултипа уничтожается перерисовкой — закрываем его
    container.innerHTML = '';
    renderEquip(container, ctx);
  }

  // Уход со страницы: чистим обработчики и «новые» метки визита
  return () => {
    if (escHandler) window.removeEventListener('keydown', escHandler);
    escHandler = null;
    newIds = null;
    targetSlot = null;
    hideItemTip();
  };
}


// --- Рыцарь-бумажная кукла: внешний вид зависит от экипировки (вектор) ---
const RARITY_PAL = {
  common: { main: '#8a7a62', dark: '#5d4732', trim: '#6b553a' },
  rare: { main: '#6a7fa0', dark: '#44536e', trim: '#a8d8ff' },
  epic: { main: '#7a5a9a', dark: '#553d6d', trim: '#d3a8ff' },
  legendary: { main: '#b8902a', dark: '#8a6a1a', trim: '#ffd98a' },
};

export function drawKnightDoll(canvas, state) {
  const g = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const eq = state.equipped;
  const item = (slot) => (eq[slot] ? ITEM_BY_ID[eq[slot]] : null);
  const pal = (it) => RARITY_PAL[it?.rarity] || RARITY_PAL.common;
  const cx = W / 2;

  // --- Фон: тёплая ниша и тень ---
  const bg = g.createRadialGradient(cx, H * 0.35, 30, cx, H * 0.45, W * 0.75);
  bg.addColorStop(0, 'rgba(255, 202, 122, 0.20)');
  bg.addColorStop(1, 'rgba(255, 202, 122, 0)');
  g.fillStyle = bg;
  g.fillRect(0, 0, W, H);
  g.fillStyle = 'rgba(0,0,0,0.3)';
  g.beginPath();
  g.ellipse(cx, H * 0.92, 62, 10, 0, 0, Math.PI * 2);
  g.fill();

  const el = (x, y, rx, ry, fill) => {
    g.fillStyle = fill;
    g.beginPath();
    g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    g.fill();
  };
  const rr = (x, y, w, h, r, fill) => {
    g.fillStyle = fill;
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
    g.fill();
  };

  // === НОГИ (поножи) ===
  const boots = item('boots');
  const legCol = boots ? pal(boots).dark : '#4a3a29';
  rr(cx - 26, H * 0.62, 20, 52, 7, legCol);
  rr(cx + 6, H * 0.62, 20, 52, 7, legCol);
  // Сапоги
  const bootCol = boots ? pal(boots).main : '#6b5335';
  rr(cx - 28, H * 0.79, 26, 20, 6, bootCol);
  rr(cx + 4, H * 0.79, 26, 20, 6, bootCol);
  rr(cx - 28, H * 0.79, 26, 6, 4, boots ? pal(boots).trim : '#4a3a29');
  rr(cx + 4, H * 0.79, 26, 6, 4, boots ? pal(boots).trim : '#4a3a29');

  // === ТОРС ПО БРОНЕ ===
  const armor = item('armor');
  const torsoY = H * 0.4;
  const torsoH = 82;
  const drawTorso = (main, dark, style) => {
    rr(cx - 36, torsoY, 72, torsoH, 20, main);
    // плечи
    el(cx - 40, torsoY + 14, 14, 12, dark);
    el(cx + 40, torsoY + 14, 14, 12, dark);
    if (style === 'mail') {
      // кольчужная фактура
      g.fillStyle = 'rgba(0,0,0,0.18)';
      for (let yy = torsoY + 10; yy < torsoY + torsoH - 8; yy += 9) {
        for (let xx = cx - 30; xx < cx + 32; xx += 9) {
          g.fillRect(xx, yy, 3, 3);
        }
      }
    }
    if (style === 'plates') {
      g.fillStyle = dark;
      for (let yy = torsoY + 16; yy < torsoY + torsoH - 6; yy += 18) g.fillRect(cx - 32, yy, 64, 5);
    }
    if (style === 'cloth') {
      g.strokeStyle = dark;
      g.lineWidth = 2;
      g.setLineDash([5, 5]);
      g.beginPath();
      g.moveTo(cx, torsoY + 6);
      g.lineTo(cx, torsoY + torsoH - 8);
      g.stroke();
      g.setLineDash([]);
    }
    if (style === 'robe') {
      g.fillStyle = dark;
      g.beginPath();
      g.moveTo(cx - 36, torsoY + 20);
      g.lineTo(cx + 36, torsoY + 20);
      g.lineTo(cx + 30, torsoY + torsoH + 18);
      g.lineTo(cx - 30, torsoY + torsoH + 18);
      g.closePath();
      g.fill();
    }
  };
  switch (armor?.id) {
    case 'arm_padded': drawTorso('#a08a62', '#6b5535', 'cloth'); break;
    case 'arm_oak_guardian': drawTorso('#7a5a38', '#4a3a24', 'plates'); break;
    case 'arm_silken': drawTorso('#6fae9d', '#4a7a6d', 'cloth'); break;
    case 'arm_chain': drawTorso('#7d94b8', '#4a5a78', 'mail'); break;
    case 'arm_ink_cloak': drawTorso('#4a3a5a', '#332844', 'robe'); break;
    case 'arm_master': drawTorso('#3a5a8a', '#27405e', 'plates'); break;
    default: {
      if (armor) drawTorso(pal(armor).main, pal(armor).dark, 'mail');
      else drawTorso('#8a7a62', '#6b5a48', 'cloth');
    }
  }
  // Воротник
  el(cx, torsoY + 6, 22, 8, armor ? pal(armor).trim : '#6b5a48');

  // Пояс и зелья
  rr(cx - 34, torsoY + torsoH - 16, 68, 9, 3, '#3a2c1c');
  state.consumableBelt.forEach((id, i) => {
    const px = cx - 22 + i * 16;
    rr(px, torsoY + torsoH - 10, 8, 14, 3, '#7a4a5a');
    rr(px + 2, torsoY + torsoH - 14, 4, 5, 2, '#c9b294');
  });

  // === ГОЛОВА И ШЛЕМ ===
  const headY = H * 0.27;
  el(cx, headY, 24, 26, '#d9b98a'); // лицо
  const helm = item('helmet');
  switch (helm?.id) {
    case undefined:
    case null:
      // Волосы и лицо
      el(cx, headY - 12, 24, 14, '#6b4a2f');
      el(cx - 8, headY + 2, 3, 4, '#33241a');
      el(cx + 8, headY + 2, 3, 4, '#33241a');
      g.strokeStyle = '#8a5a3a';
      g.lineWidth = 2;
      g.beginPath();
      g.arc(cx, headY + 6, 9, 0.2, Math.PI - 0.2);
      g.stroke();
      break;
    case 'hlm_leather':
      el(cx, headY - 10, 26, 18, '#7a5a3a');
      rr(cx - 26, headY - 12, 52, 10, 5, '#5d4732');
      break;
    case 'hlm_badger':
      el(cx, headY - 8, 26, 16, '#8a9098');
      el(cx - 16, headY - 22, 7, 9, '#8a9098');
      el(cx + 16, headY - 22, 7, 9, '#8a9098');
      rr(cx - 26, headY - 12, 52, 8, 4, '#6a7078');
      break;
    case 'hlm_kettle':
      el(cx, headY - 10, 22, 16, '#9aa2ac');
      rr(cx - 30, headY - 12, 60, 7, 3, '#7a828c');
      rr(cx - 4, headY - 26, 8, 6, 2, '#c9b294');
      break;
    case 'hlm_page_wanderer':
      g.fillStyle = '#4a3a5a';
      g.beginPath();
      g.moveTo(cx - 24, headY - 8);
      g.quadraticCurveTo(cx, headY - 52, cx + 24, headY - 8);
      g.closePath();
      g.fill();
      rr(cx - 26, headY - 10, 52, 8, 4, '#332844');
      el(cx + 6, headY - 30, 3, 4, '#ffd98a');
      break;
    case 'hlm_master':
      rr(cx - 20, headY - 16, 40, 7, 3, '#c9a227');
      el(cx, headY - 14, 4, 5, '#ffd98a');
      break;
    default:
      el(cx, headY - 8, 26, 16, pal(helm).main);
      rr(cx - 26, headY - 12, 52, 8, 4, pal(helm).dark);
  }

  // === ПЕРЧАТКИ (кисти) ===
  const glv = item('gloves');
  const handCol = glv ? pal(glv).main : '#d9b98a';
  const wpn = item('weapon');
  const twoHanded = wpn?.hand === 'two';
  // Двуручное оружие: кисти рисуются позже — на древке, одна выше, другая ниже
  if (!twoHanded) {
    el(cx - 40, torsoY + 40, 9, 10, handCol);
    el(cx + 40, torsoY + 40, 9, 10, handCol);
    // Кольца — искры
    if (item('ring1')) { el(cx - 40, torsoY + 34, 3, 3, '#ffd98a'); }
    if (item('ring2')) { el(cx + 40, torsoY + 34, 3, 3, '#ffd98a'); }
  }

  // === ОРУЖИЕ (правая рука — слева от зрителя, рукоять в кисти) ===
  if (wpn) {
    const steel = '#c8d4dc';
    const steelDark = '#8a98a4';
    // Наклон ОТ рыцаря; двуручное — сильнее, чтобы легло на два хвата
    const angle = twoHanded ? -0.44 : -0.28;
    const ax = cx - 46;
    const ay = torsoY + 46;
    g.save();
    g.translate(ax, ay); // рукоять в правой кисти
    g.rotate(angle);
    g.shadowColor = 'rgba(0,0,0,0.4)';
    g.shadowBlur = 4;
    switch (wpn.type) {
      case 'sword':
        rr(-4.5, -106, 9, 98, 4.5, steel);
        g.beginPath();
        g.moveTo(0, -114);
        g.lineTo(6, -104);
        g.lineTo(-6, -104);
        g.closePath();
        g.fillStyle = steel;
        g.fill();
        rr(-18, -12, 36, 7, 3, '#c9a227');
        rr(-3, -5, 6, 22, 3, '#4a3a29');
        break;
      case 'mace':
        rr(-3.5, -72, 7, 72, 3, '#6b5335');
        el(0, -84, 18, 18, steelDark);
        g.fillStyle = steelDark;
        for (let a = 0; a < 8; a++) {
          const ang = (a / 8) * Math.PI * 2;
          g.beginPath();
          g.arc(Math.cos(ang) * 18, -84 + Math.sin(ang) * 18, 4, 0, Math.PI * 2);
          g.fill();
        }
        el(0, -84, 7, 7, steel);
        break;
      case 'dagger':
        rr(-3.5, -64, 7, 60, 3.5, steel);
        g.beginPath();
        g.moveTo(0, -72);
        g.lineTo(5, -62);
        g.lineTo(-5, -62);
        g.closePath();
        g.fillStyle = steel;
        g.fill();
        rr(-12, -8, 24, 6, 3, '#c9a227');
        rr(-2.5, -2, 5, 15, 2, '#4a3a29');
        break;
      case 'greatsword':
        rr(-7.5, -138, 15, 126, 7, steel);
        rr(-7.5, -138, 15, 20, 7, steelDark);
        rr(-22, -16, 44, 9, 4, '#c9a227');
        rr(-4.5, -7, 9, 26, 4, '#4a3a29');
        el(0, -128, 5, 5, '#ffd98a');
        break;
      case 'greataxe':
        rr(-4, -100, 8, 96, 4, '#6b5335');
        g.fillStyle = steel;
        g.beginPath();
        g.moveTo(-4, -98);
        g.quadraticCurveTo(-44, -88, -36, -52);
        g.lineTo(-4, -62);
        g.closePath();
        g.fill();
        rr(-8, -106, 16, 7, 3, steelDark);
        break;
      case 'bow': {
        // Плечи лука: плавная дуга, живот наружу (влево от рыцаря)
        g.strokeStyle = '#8a5a3a';
        g.lineWidth = 5.5;
        g.lineCap = 'round';
        g.beginPath();
        g.moveTo(0, -88);
        g.quadraticCurveTo(-24, -52, -18, -6);
        g.quadraticCurveTo(-14, 40, 0, 76);
        g.stroke();
        // Светлая кромка дерева
        g.strokeStyle = '#a06a42';
        g.lineWidth = 2;
        g.beginPath();
        g.moveTo(0, -86);
        g.quadraticCurveTo(-21, -52, -16, -7);
        g.quadraticCurveTo(-12, 38, 0, 74);
        g.stroke();
        // Тетива
        g.strokeStyle = '#d9cdb8';
        g.lineWidth = 1.6;
        g.beginPath();
        g.moveTo(0, -88);
        g.lineTo(0, 76);
        g.stroke();
        // Намотка рукояти (в «животе» дуги)
        rr(-21, -14, 8, 16, 3, '#4a3a29');
        // Стрела на тетиве
        g.strokeStyle = '#c9b294';
        g.lineWidth = 2.5;
        g.beginPath();
        g.moveTo(4, -4);
        g.lineTo(-28, -9);
        g.stroke();
        g.fillStyle = steel;
        g.beginPath();
        g.moveTo(-36, -10);
        g.lineTo(-27, -13);
        g.lineTo(-27, -6);
        g.closePath();
        g.fill();
        // Оперение
        g.strokeStyle = '#e8dcc8';
        g.lineWidth = 1.6;
        g.beginPath();
        g.moveTo(2, -4);
        g.lineTo(-3, -11);
        g.moveTo(3, -2);
        g.lineTo(-1, 4);
        g.stroke();
        break;
      }
      case 'staff':
        rr(-4, -110, 6, 108, 3, '#5d4732');
        el(0, -114, 13, 13, '#ffb85a');
        el(0, -114, 22, 22, 'rgba(255,184,90,0.35)');
        el(0, -114, 5, 5, '#fff2be');
        break;
      default:
        rr(-4.5, -106, 9, 98, 4.5, steel);
        rr(-18, -12, 36, 7, 3, '#c9a227');
        rr(-3, -5, 6, 22, 3, '#4a3a29');
    }
    g.restore();

    // Двуручный хват: кисти поверх древка — одна выше, другая ниже.
    // Точки хвата заданы в локальных координатах оружия (после наклона).
    if (twoHanded) {
      const GRIP2H = {
        greatsword: [[0, -2], [0, 16]],
        greataxe: [[0, -34], [0, -8]],
        staff: [[0, -44], [0, -14]],
        bow: [[-17, -6], [2, -4]], // рука на рукояти лука и на тетиве
      };
      const grips = GRIP2H[wpn.type] || [[0, -2], [0, 20]];
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const toWorld = ([x, y]) => [ax + x * cos - y * sin, ay + x * sin + y * cos];
      const [h1, h2] = grips.map(toWorld);
      g.shadowColor = 'rgba(0,0,0,0.4)';
      g.shadowBlur = 4;
      el(h1[0], h1[1], 9, 10, handCol);
      el(h2[0], h2[1], 9, 10, handCol);
      // Кольца — искры на нижней руке
      if (item('ring1')) el(h2[0], h2[1] - 6, 3, 3, '#ffd98a');
      if (item('ring2')) el(h2[0] + 5, h2[1] - 3, 3, 3, '#ffd98a');
      g.shadowBlur = 0;
    }
  }

  // === ЩИТ (левая рука — справа от зрителя, крупно на предплечье) ===
  const shd = item('shield');
  if (shd) {
    const sx = cx + 48;
    const sy = torsoY + 46;
    g.save();
    g.shadowColor = 'rgba(0,0,0,0.4)';
    g.shadowBlur = 4;
    const drawKite = (main, trim, boss) => {
      g.fillStyle = main;
      g.beginPath();
      g.moveTo(sx - 28, sy - 44);
      g.lineTo(sx + 28, sy - 44);
      g.lineTo(sx + 28, sy + 14);
      g.quadraticCurveTo(sx, sy + 44, sx - 28, sy + 14);
      g.closePath();
      g.fill();
      g.strokeStyle = trim;
      g.lineWidth = 5;
      g.stroke();
      if (boss) el(sx, sy - 14, 9, 9, boss);
    };
    switch (shd.id) {
      case 'shd_wooden':
        el(sx, sy, 32, 35, '#8a6a45');
        el(sx, sy, 21, 23, '#7a5a38');
        el(sx, sy, 9, 9, '#6b5335');
        break;
      case 'shd_tower':
        rr(sx - 21, sy - 46, 42, 84, 9, '#8a9098');
        rr(sx - 21, sy - 46, 42, 13, 7, '#6a7078');
        el(sx, sy - 8, 8, 8, '#4a3a29');
        g.fillStyle = 'rgba(255,255,255,0.15)';
        g.fillRect(sx - 16, sy - 38, 8, 68);
        break;
      case 'shd_master':
        drawKite('#b8c8d8', '#ffd98a', '#e8f4ff');
        g.fillStyle = 'rgba(255,255,255,0.5)';
        g.beginPath();
        g.moveTo(sx - 18, sy - 38);
        g.lineTo(sx - 5, sy - 38);
        g.lineTo(sx - 13, sy + 8);
        g.lineTo(sx - 21, sy + 3);
        g.closePath();
        g.fill();
        break;
      case 'shd_page_shield':
        rr(sx - 22, sy - 38, 44, 74, 7, '#6b4a2f');
        rr(sx - 22, sy - 38, 12, 74, 7, '#4a3320');
        el(sx + 3, sy, 6, 7, '#c9a227');
        break;
      default:
        drawKite(pal(shd).main, pal(shd).trim, pal(shd).trim);
    }
    g.restore();
  }

  // === АМУЛЕТ ===
  const amu = item('amulet');
  if (amu) {
    g.strokeStyle = '#c9b294';
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(cx - 10, torsoY + 4);
    g.quadraticCurveTo(cx, torsoY + 18, cx + 10, torsoY + 4);
    g.stroke();
    el(cx, torsoY + 24, 6, 7, pal(amu).trim);
    el(cx, torsoY + 24, 10, 12, 'rgba(255,226,138,0.3)');
  }

  // Питомец у ног
  if (state.pet && PET_BY_ID[state.pet]) {
    const e = PET_BY_ID[state.pet].icon;
    g.font = '30px "Segoe UI Emoji", sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(e, W * 0.82, H * 0.86);
  }

  // (без подписи — вид говорит сам за себя)
}

function roundRectDoll(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}
// (вспомогательная, оставлена для будущих деталей куклы)
