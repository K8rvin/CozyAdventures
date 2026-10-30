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
import { header, quickNav } from './common.js';
import {
  itemEmoji, itemIconEl, showItemTip, hideItemTip, bindItemTip, TRAIT_LABEL,
} from './itemTip.js';
import { createKnightGeneratedDoll } from './knightGeneratedView.js';

export { itemEmoji }; // для craftView и shopView

// --- Состояние экрана: живёт между rerender, чистится при уходе со страницы ---
let activeTab = 'chest';     // 'chest' | 'stats'
let filterSlot = 'all';      // 'all' | slot | 'ring' | 'consumable'
let filterRarity = 'all';    // 'all' | rarity
let targetSlot = null;       // слот или 'belt', для которого подбираем предмет
let newIds = null;           // Set id новых предметов этого визита (метка ✦)
let suppressClick = false;   // только что закончился драг — глушим клик
let escHandler = null;
let dollView = null;

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

// Тень-силуэт типа предмета на пустом слоте (вместо плюсика).
// Арт assets/slots/<kind>_web.png поверх затемнённого эмодзи-фолбэка.
const SLOT_GHOST_EMOJI = {
  weapon: '🗡️', shield: '🛡️', helmet: '🪖', armor: '🧥', gloves: '🧤',
  boots: '🥾', amulet: '📿', ring1: '💍', ring2: '💍', potion: '🧪',
};
const SLOT_GHOST_ART = { ring1: 'ring', ring2: 'ring' };

function slotGhostEl(slot) {
  const span = document.createElement('span');
  span.className = 'slot-ghost';
  if (!slot) { // щит, занятый двуручным — просто прочерк
    span.textContent = '—';
    return span;
  }
  const emo = document.createElement('span');
  emo.className = 'slot-ghost-emoji';
  emo.textContent = SLOT_GHOST_EMOJI[slot] || '＋';
  span.appendChild(emo);
  const img = document.createElement('img');
  img.className = 'slot-ghost-art';
  img.alt = '';
  img.addEventListener('error', () => img.remove());
  img.addEventListener('load', () => { emo.remove(); span.classList.add('on'); });
  img.src = `assets/slots/${SLOT_GHOST_ART[slot] || slot}_web.png`;
  span.appendChild(img);
  return span;
}

function bindDollHighlight(cell, slot) {
  cell.addEventListener('pointerenter', () => dollView?.setHighlight(slot));
  cell.addEventListener('pointerleave', () => dollView?.setHighlight(null));
  cell.addEventListener('focus', () => dollView?.setHighlight(slot));
  cell.addEventListener('blur', () => dollView?.setHighlight(null));
}

function makeCellActivatable(cell, label) {
  cell.tabIndex = 0;
  cell.setAttribute('role', 'button');
  cell.setAttribute('aria-label', label);
  cell.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    ev.preventDefault();
    cell.click();
  });
}

function destroyDollView() {
  dollView?.destroy();
  dollView = null;
}

export function renderEquip(container, ctx) {
  const { state } = ctx;
  destroyDollView();

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

  const head = header(ctx, 'Комната рыцаря',
    'Надевай вещи — они реально меняют бой. Перетаскивай предметы или кликай по пустому слоту.', 'hub');
  head.style.display = 'flex';
  head.style.alignItems = 'center';
  head.style.gap = '10px';
  container.appendChild(head);
  container.appendChild(quickNav(ctx, [
    { icon: '⚔️', label: 'Походы рыцаря', screen: 'battles', primary: true },
    { icon: '🏪', label: 'Прилавок', screen: 'shop' },
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
  layout.className = 'equip-layout';

  // --- Живой рыцарь: внешний вид от экипировки ---
  const dollPanel = document.createElement('div');
  dollPanel.className = 'panel knight-panel';
  dollPanel.innerHTML = '<h3>Рыцарь</h3>';
  dollView = createKnightGeneratedDoll(state);
  dollPanel.appendChild(dollView.el);
  layout.appendChild(dollPanel);

  // --- Слоты + пояс (drop-зоны собираем по ходу рендера) ---
  const slotEls = {};  // slot -> el
  const beltEls = [];  // i -> el
  let chestListEl = null;

  const slotsPanel = document.createElement('div');
  slotsPanel.className = 'panel equip-slots-panel';
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
    cell.dataset.equipSlot = slot;
    const icoBox = document.createElement('div');
    icoBox.className = 'slot-item';
    cell.appendChild(icoBox);
    if (item) icoBox.appendChild(itemIconEl(item, 'slot-ico'));
    else icoBox.appendChild(slotGhostEl(slot === 'shield' && shieldBlocked ? null : slot));
    if (slot === 'shield' && shieldBlocked && !item) cell.title = 'Занято двуручным оружием';
    slotEls[slot] = cell;
    if (item) {
      bindItemTip(cell, item, { state });
      cell.addEventListener('click', () => {
        if (suppressClick) return;
        unequipToInventory(state, slot);
        // Слот освободился — сундук сразу фильтруется под него (режим выбора)
        targetSlot = slot;
        filterSlot = filterForTarget(slot);
        activeTab = 'chest';
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
    if (item) bindDollHighlight(cell, slot);
    if (item || !(slot === 'shield' && shieldBlocked)) {
      makeCellActivatable(cell, item
        ? `${SLOT_LABEL[slot]}: ${item.name}. Нажмите, чтобы снять.`
        : `${SLOT_LABEL[slot]}: выбрать предмет.`);
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
    cell.dataset.beltSlot = String(i);
    // Кармашек той же ширины, что и слоты сетки (3 колонки, gap 10px)
    cell.style.flex = '0 0 calc((100% - 20px) / 3)';
    const icoBox = document.createElement('div');
    icoBox.className = 'slot-item';
    cell.appendChild(icoBox);
    if (item) icoBox.appendChild(itemIconEl(item, 'slot-ico'));
    else icoBox.appendChild(slotGhostEl('potion'));
    beltEls[i] = cell;
    if (item) {
      bindItemTip(cell, item, { state });
      cell.addEventListener('click', () => {
        if (suppressClick) return;
        removeFromBelt(state, i);
        // Кармашек освободился — сундук фильтруется под расходники
        targetSlot = 'belt';
        filterSlot = 'consumable';
        activeTab = 'chest';
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
    if (item) bindDollHighlight(cell, `belt${i}`);
    makeCellActivatable(cell, item
      ? `Пояс, кармашек ${i + 1}: ${item.name}. Нажмите, чтобы снять.`
      : `Пояс, кармашек ${i + 1}: выбрать расходник.`);
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
    // Если отфильтрованный тип кончился (надели последний) — фильтр сбрасываем,
    // иначе список пуст при «живых» вещах, а селект вводит в заблуждение
    if (filterSlot !== 'all' && !present.has(filterSlot)) filterSlot = 'all';
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
    if (filterRarity !== 'all' && !presentR.has(filterRarity)) filterRarity = 'all';
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
    destroyDollView();
    container.innerHTML = '';
    renderEquip(container, ctx);
  }

  // Уход со страницы: чистим обработчики и «новые» метки визита
  return () => {
    destroyDollView();
    if (escHandler) window.removeEventListener('keydown', escHandler);
    escHandler = null;
    newIds = null;
    targetSlot = null;
    hideItemTip();
  };
}
