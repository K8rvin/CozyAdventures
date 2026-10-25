// Лавка на перекрёстке (оформление + скупка) и тематические лавки площади.
import { ITEM_BY_ID, RARITY_LABEL } from '../data/items.js';
import { itemIconEl, itemIconHtml } from './itemTip.js';
import { describeItem, SLOTS, SLOT_LABEL } from '../core/items.js';
import {
  shopStock, buyItem, buyCosmetic, toggleCosmetic, selectCosmetic,
  unseenShopItems, markShopSeen,
} from '../core/state.js';
import { COSMETIC_PACKS, SEASON_LABEL } from '../data/cosmetics.js';
import { SHOPS, itemsForShop } from '../data/shop.js';
import { startTutorial } from './tutorial.js';
import { header, quickNav } from './common.js';
import { onboardingBlocksLegacyTutorials } from '../core/onboarding.js';
import { setSavingsGoal } from '../core/goals.js';

// --- Список товаров (общий строитель). Возвращает карту itemId -> кнопка «Купить» ---
function buildBuyList(container, ctx, items, newIds) {
  const { state } = ctx;
  const btnByItemId = {};
  const buyList = document.createElement('div');
  buyList.className = 'list';
  if (items.length === 0) {
    buyList.innerHTML = '<div class="muted">Полки пока пусты — возвращайся после побед рыцаря.</div>';
  }
  for (const item of items) {
    const row = document.createElement('div');
    row.className = 'row' + (newIds.has(item.id) ? ' new-item' : '');
    const priceLabel = item.sealPrice ? `🔰 ${item.sealPrice}` : `🪙 ${item.price}`;
    const afford = item.sealPrice ? state.seals >= item.sealPrice : state.coins >= item.price;
    row.innerHTML = `
      <span class="grow">
        <div class="name">${item.name}${newIds.has(item.id) ? ' <span class="badge new-badge">новинка</span>' : ''} <span class="badge ${item.rarity}">${RARITY_LABEL[item.rarity]}</span></div>
        <div class="desc">${describeItem(item) || item.description}</div>
      </span>
      <span class="price">${priceLabel}</span>`;
    row.prepend(itemIconEl(item));
    const owned = item.slot !== 'consumable' && (
      state.inventory.includes(item.id)
      || state.consumableBelt.includes(item.id)
      || Object.values(state.equipped).includes(item.id)
    );
    const btn = document.createElement('button');
    btn.className = 'small';
    btn.dataset.itemId = item.id;
    btn.textContent = owned ? 'Уже есть' : 'Купить';
    btn.disabled = owned || !afford;
    // Сравнение с надетым: характеристики текущего слота при наведении
    const showCompare = () => showCompareTip(state, item, btn);
    btn.addEventListener('mouseenter', showCompare);
    btn.addEventListener('focus', showCompare);
    btn.addEventListener('mouseleave', hideCompareTip);
    btn.addEventListener('blur', hideCompareTip);
    btn.addEventListener('click', hideCompareTip);
    btn.addEventListener('click', () => {
      const r = buyItem(state, item.id);
      if (r.ok) {
        ctx.sfx?.('coin');
        if (r.autoEquipped?.belt) ctx.toast(`Куплено: ${item.name} — уже в поясе!`);
        else if (r.autoEquipped?.slot) ctx.toast(`Куплено: ${item.name} — уже надето!`);
        else ctx.toast(`Куплено: ${item.name}. Лежит в сундуке (Комната рыцаря).`);
        ctx.save();
        rerenderCurrent();
      } else {
        ctx.toast(r.error);
      }
    });
    row.appendChild(btn);
    if (!owned) {
      const goalBtn = document.createElement('button');
      const selected = state.savingsGoal?.kind === 'item' && state.savingsGoal.id === item.id;
      goalBtn.className = 'small ghost goal-set';
      goalBtn.dataset.goalKind = 'item';
      goalBtn.dataset.goalId = item.id;
      goalBtn.textContent = selected ? 'Цель ✓' : 'Цель';
      goalBtn.title = 'Сделать целью накопления';
      goalBtn.addEventListener('click', () => {
        const result = setSavingsGoal(state, 'item', item.id);
        if (!result.ok) { ctx.toast(result.error); return; }
        ctx.sfx?.('tap');
        ctx.save();
        rerenderCurrent();
      });
      row.appendChild(goalBtn);
    }
    buyList.appendChild(row);
    btnByItemId[item.id] = btn;
  }
  container.appendChild(buyList);
  return btnByItemId;
}

let currentRerender = () => {};
function rerenderCurrent() {
  currentRerender();
}

// --- Тематическая лавка на площади ---
export function renderMarket(container, ctx, shopKey) {
  const { state } = ctx;
  const shop = SHOPS[shopKey];
  if (!shop) { ctx.go('hub', { scene: 'square' }); return; }

  container.appendChild(header(ctx, `${shop.icon} ${shop.name}`, shop.desc, ['hub', { scene: 'market' }]));
  container.appendChild(quickNav(ctx, [
    { icon: '🎒', label: 'Комната рыцаря', screen: 'equip', primary: true },
    { icon: '🏬', label: 'В торговый квартал', screen: 'hub', params: { scene: 'market' } },
  ]));

  const newIds = new Set(unseenShopItems(state).map((i) => i.id));
  const buyPanel = document.createElement('div');
  buyPanel.className = 'panel';
  buyPanel.innerHTML = '<h3>Витрина</h3>';
  container.appendChild(buyPanel);
  const items = itemsForShop(state, shopKey, shopStock(state));
  const btnByItemId = buildBuyList(buyPanel, ctx, items, newIds);

  // Обучение первой покупке: целимся в первую вещь, которой у игрока ЕЩЁ НЕТ
  // (начальный «Дедов меч» уже надет — предлагать его бессмысленно)
  if ((state.stats.itemsBought || 0) === 0 && !onboardingBlocksLegacyTutorials(state)) {
    const owned = new Set([...(state.inventory || []), ...Object.values(state.equipped || {})]);
    const afford = (it) => (it.sealPrice ? state.seals >= it.sealPrice : state.coins >= it.price);
    const target = items.find((it) => !owned.has(it.id) && afford(it));
    const firstBuy = target ? btnByItemId[target.id] : null;
    if (firstBuy) {
      startTutorial(ctx, 'first_purchase', [
        {
          target: firstBuy,
          title: 'Первая покупка',
          text: 'Монеты с загадок — это товары для рыцаря. Выбери что-нибудь по душе и нажми «Купить»: вещь ляжет в сундук, а надеть её можно в комнате рыцаря.',
          cta: 'Покупаю!',
        },
      ]);
    }
  }

  markShopSeen(state);
  ctx.save();

  currentRerender = () => {
    container.innerHTML = '';
    renderMarket(container, ctx, shopKey);
  };
}

// --- Лавка на перекрёстке: оформление и скупка ---
export function renderShop(container, ctx) {
  const { state } = ctx;

  container.appendChild(header(ctx, 'Прилавок лавки',
    'Оформление для дома и скупка твоих находок. Снаряжение — в лавках площади.', 'hub'));
  container.appendChild(quickNav(ctx, [
    { icon: '🎒', label: 'Комната рыцаря', screen: 'equip', primary: true },
    { icon: '🗡️', label: 'Оружейник', screen: 'shopArmory' },
    { icon: '🛡️', label: 'Бронник', screen: 'shopArmorer' },
    { icon: '🔮', label: 'Маг', screen: 'shopMagic' },
    { icon: '🧪', label: 'Алхимик', screen: 'shopAlchemy' },
    { icon: '🏠', label: 'В лавку', screen: 'hub' },
  ]));

  const cosPanel = document.createElement('div');
  cosPanel.className = 'panel';
  cosPanel.dataset.cosmeticsPanel = 'lavka';
  cosPanel.innerHTML = '<h3>Оформление лавки</h3><div class="muted" style="font-size:13px;margin-bottom:8px">Одна полная тема за раз: текстиль, фурнитура, полки, свет и вид за окном, а не один спрайт.</div>';
  if (!state.settings.cosmeticsPackNoticeDismissed) {
    const note = document.createElement('div');
    note.className = 'cosmetic-notice';
    const text = document.createElement('span');
    text.textContent = 'Прежние покупки сохранены в пакетах без повторной оплаты. Полные темы включаются по мере добавления файлов; пока файла нет, действуют базовая лавка и прежний sprite fallback.';
    const dismiss = document.createElement('button');
    dismiss.type = 'button';
    dismiss.className = 'small ghost';
    dismiss.dataset.cosmeticNoticeDismiss = '1';
    dismiss.textContent = 'Понятно';
    dismiss.setAttribute('aria-label', 'Скрыть пояснение об оформлении');
    dismiss.addEventListener('click', () => {
      state.settings.cosmeticsPackNoticeDismissed = true;
      ctx.save();
      note.remove();
    });
    note.append(text, dismiss);
    cosPanel.appendChild(note);
  }
  const cosList = document.createElement('div');
  cosList.className = 'list';
  const previewEl = (src, icon) => {
    const preview = document.createElement('span');
    preview.className = 'cosmetic-preview';
    preview.textContent = icon;
    const img = document.createElement('img');
    img.className = 'cosmetic-preview-img';
    img.alt = '';
    img.addEventListener('error', () => img.remove());
    img.src = src;
    preview.prepend(img);
    return preview;
  };

  const baseActive = state.cosmeticsActive.length === 0;
  const baseRow = document.createElement('div');
  baseRow.className = 'row' + (baseActive ? ' done' : '');
  baseRow.dataset.cosmeticRow = 'base';
  baseRow.innerHTML = '<span class="grow"><div class="name">Базовая лавка</div><div class="desc">Исходный вид без дополнительного оформления.</div></span><span class="price">Бесплатно</span>';
  baseRow.prepend(previewEl('assets/hub/hub_banner_web.jpg', '🏮'));
  const baseBtn = document.createElement('button');
  baseBtn.type = 'button';
  baseBtn.className = 'small' + (baseActive ? ' ghost' : '');
  baseBtn.dataset.cosmeticId = 'base';
  baseBtn.textContent = baseActive ? 'Выбрана' : 'Выбрать';
  baseBtn.setAttribute('aria-pressed', String(baseActive));
  baseBtn.addEventListener('click', () => {
    selectCosmetic(state, null);
    ctx.save();
    rerenderCurrent();
  });
  baseRow.appendChild(baseBtn);
  cosList.appendChild(baseRow);

  for (const c of COSMETIC_PACKS) {
    const owned = state.cosmeticsOwned.includes(c.id);
    const active = state.cosmeticsActive.length === 1 && state.cosmeticsActive[0] === c.id;
    const row = document.createElement('div');
    row.className = 'row' + (active ? ' done' : '');
    row.dataset.cosmeticRow = c.id;
    const price = c.sealPrice ? `🔰 ${c.sealPrice}` : `🪙 ${c.price}`;
    row.innerHTML = `
      <span class="grow">
        <div class="name">${c.name}${c.season ? ` <span class="badge">${SEASON_LABEL[c.season]}</span>` : ''}</div>
        <ul class="cosmetic-changes">${c.changes.map((change) => `<li>${change}</li>`).join('')}</ul>
      </span>`;
    row.prepend(previewEl(c.scenes.lavka.preview, c.icon));
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'small' + (active ? ' ghost' : '');
    btn.dataset.cosmeticId = c.id;
    btn.setAttribute('aria-pressed', String(active));
    if (!owned) {
      btn.innerHTML = `Купить · ${price}`;
      btn.disabled = c.sealPrice ? state.seals < c.sealPrice : state.coins < c.price;
      btn.addEventListener('click', () => {
        const r = buyCosmetic(state, c.id);
        if (r.ok) { ctx.toast(`${c.name} — оформление выбрано.`); ctx.sfx?.('success'); ctx.save(); rerenderCurrent(); }
        else ctx.toast(r.error);
      });
    } else {
      btn.textContent = active ? 'Убрать' : 'Выбрать';
      btn.addEventListener('click', () => { toggleCosmetic(state, c.id); ctx.save(); rerenderCurrent(); });
    }
    row.appendChild(btn);
    cosList.appendChild(row);
  }
  cosPanel.appendChild(cosList);
  container.appendChild(cosPanel);

  currentRerender = () => {
    container.innerHTML = '';
    renderShop(container, ctx);
  };
}

// --- Подсказка-сравнение «Сейчас надето» ---
let compareEl = null;

function showCompareTip(state, item, anchor) {
  hideCompareTip();
  compareEl = document.createElement('div');
  compareEl.className = 'compare-tip';

  let html = '';
  if (item.slot === 'consumable') {
    const belt = state.consumableBelt.map((id) => ITEM_BY_ID[id]?.name || id);
    html = `<div class="ct-title">Пояс (${state.consumableBelt.length}/2)</div>` +
      (belt.length
        ? belt.map((n) => `<div class="ct-item">🧪 ${n}</div>`).join('')
        : '<div class="ct-empty">Пояс пуст — зелье ляжет сразу в бой</div>');
  } else {
    const slotsToShow = item.slot === 'ring' ? ['ring1', 'ring2'] : [item.slot];
    html = `<div class="ct-title">Сейчас надето (${slotsToShow.map((s) => SLOT_LABEL[s]).join(' / ')})</div>`;
    html += slotsToShow.map((s) => {
      const id = state.equipped[s];
      if (!id) return `<div class="ct-empty">${SLOT_LABEL[s]}: свободен</div>`;
      const cur = ITEM_BY_ID[id];
      return `<div class="ct-item">${itemIconHtml(cur, 'ct-ico')} ${cur.name}</div>` +
        `<div class="ct-stats">${describeItem(cur) || cur.description}</div>`;
    }).join('');
    const diff = quickDiff(state, item, slotsToShow);
    if (diff) html += `<div class="ct-stats" style="margin-top:4px">${diff}</div>`;
  }
  compareEl.innerHTML = html;
  document.body.appendChild(compareEl);
  const r = anchor.getBoundingClientRect();
  const h = compareEl.offsetHeight || 80;
  compareEl.style.left = `${Math.max(8, r.left - 220)}px`;
  compareEl.style.top = `${Math.max(8, r.top - 8 - h)}px`;
}

function quickDiff(state, item, slotsToShow) {
  const KEYS = ['attack', 'armor', 'hp', 'speed'];
  const NAMES = { attack: '⚔', armor: '🛡', hp: '❤', speed: '⚡' };
  const cur = slotsToShow.map((s) => ITEM_BY_ID[state.equipped[s]]).find(Boolean);
  const parts = [];
  for (const k of KEYS) {
    const nv = item.stats?.[k] || 0;
    const cv = cur?.stats?.[k] || 0;
    const d = nv - cv;
    if (d !== 0) parts.push(`${NAMES[k]} ${d > 0 ? '+' : ''}${d}`);
  }
  return parts.length ? `Разница с надетым: ${parts.join(' ')}` : '';
}

function hideCompareTip() {
  if (compareEl) { compareEl.remove(); compareEl = null; }
}

export { showCompareTip, hideCompareTip };
