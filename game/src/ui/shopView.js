// Прилавок: покупка и продажа + косметика лавки.
import { ITEM_BY_ID, RARITY_LABEL } from '../data/items.js';
import { itemEmoji } from './equipView.js';
import { describeItem, SLOTS, SLOT_LABEL } from '../core/items.js';
import { shopStock, buyItem, sellItem, buyCosmetic, toggleCosmetic } from '../core/state.js';
import { COSMETICS, SEASON_LABEL } from '../data/cosmetics.js';
import { startTutorial } from './tutorial.js';
import { quickNav } from './common.js';

export function renderShop(container, ctx) {
  const { state } = ctx;

  const head = document.createElement('div');
  head.className = 'panel';
  head.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
    <h2 style="margin:0">Прилавок</h2></div>
    <div class="muted">Звон монет, деревянные полки, тёплый свет. Ассортимент растёт с победами рыцаря.</div>`;
  const back = document.createElement('button');
  back.className = 'ghost small';
  back.textContent = '← Назад';
  back.addEventListener('click', () => ctx.go('hub'));
  head.firstElementChild.appendChild(back);
  container.appendChild(head);
  container.appendChild(quickNav(ctx, [
    { icon: '🎒', label: 'Комната рыцаря', screen: 'equip', primary: true },
    { icon: '🏠', label: 'В лавку', screen: 'hub' },
  ]));

  // --- Покупка ---
  const buyPanel = document.createElement('div');
  buyPanel.className = 'panel';
  buyPanel.innerHTML = '<h3>Полки лавки</h3>';
  const buyList = document.createElement('div');
  buyList.className = 'list';
  for (const item of shopStock(state)) {
    const row = document.createElement('div');
    row.className = 'row';
    const priceLabel = item.sealPrice ? `🔰 ${item.sealPrice}` : `🪙 ${item.price}`;
    const afford = item.sealPrice ? state.seals >= item.sealPrice : state.coins >= item.price;
    row.innerHTML = `
      <span class="icon">${itemEmoji(item)}</span>
      <span class="grow">
        <div class="name">${item.name} <span class="badge ${item.rarity}">${RARITY_LABEL[item.rarity]}</span></div>
        <div class="desc">${describeItem(item) || item.description}</div>
      </span>
      <span class="price">${priceLabel}</span>`;
    const btn = document.createElement('button');
    btn.className = 'small';
    btn.textContent = 'Купить';
    btn.disabled = !afford;
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
        rerender();
      } else {
        ctx.toast(r.error);
      }
    });
    row.appendChild(btn);
    buyList.appendChild(row);
  }
  buyPanel.appendChild(buyList);
  container.appendChild(buyPanel);

  // Обучение первой покупке: подсвечиваем первую доступную кнопку
  const firstBuy = buyList.querySelector?.('button:not([disabled])');
  if (firstBuy && (state.stats.itemsBought || 0) === 0) {
    startTutorial(ctx, 'first_purchase', [
      {
        target: firstBuy,
        title: 'Первая покупка',
        text: 'Монеты с загадок — это товары для рыцаря. Выбери что-нибудь по душе и нажми «Купить»: вещь ляжет в сундук, а надеть её можно в комнате рыцаря.',
        cta: 'Покупаю!',
      },
    ]);
  }

  // --- Продажа ---
  const sellPanel = document.createElement('div');
  sellPanel.className = 'panel';
  sellPanel.innerHTML = `<h3>Продать из сундука (за полцены)</h3>`;
  const sellList = document.createElement('div');
  sellList.className = 'list';
  if (state.inventory.length === 0) {
    sellList.innerHTML = '<div class="muted">Сундук пуст.</div>';
  }
  state.inventory.forEach((id, index) => {
    const item = ITEM_BY_ID[id];
    if (!item) return;
    const price = Math.max(1, Math.floor(item.price / 2));
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `
      <span class="icon">${itemEmoji(item)}</span>
      <span class="grow"><div class="name">${item.name}</div></span>
      <span class="price">🪙 ${price}</span>`;
    const btn = document.createElement('button');
    btn.className = 'small';
    btn.textContent = 'Продать';
    btn.addEventListener('click', () => {
      const r = sellItem(state, index);
      if (r.ok) {
        ctx.toast(`Продано: ${item.name} за ${r.price} монет`);
        ctx.save();
        rerender();
      }
    });
    row.appendChild(btn);
    sellList.appendChild(row);
  });
  sellPanel.appendChild(sellList);
  container.appendChild(sellPanel);

  // --- Косметика и сезонные наборы (не влияет на силу) ---
  const cosPanel = document.createElement('div');
  cosPanel.className = 'panel';
  cosPanel.innerHTML = '<h3>Украшения лавки</h3><div class="muted" style="font-size:13px;margin-bottom:8px">Только красота — никакого влияния на силу.</div>';
  const cosList = document.createElement('div');
  cosList.className = 'list';
  for (const c of COSMETICS) {
    const owned = state.cosmeticsOwned.includes(c.id);
    const active = state.cosmeticsActive.includes(c.id);
    const row = document.createElement('div');
    row.className = 'row' + (active ? ' done' : '');
    const price = c.sealPrice ? `🔰 ${c.sealPrice}` : `🪙 ${c.price}`;
    row.innerHTML = `
      <span class="icon">${c.icon}</span>
      <span class="grow">
        <div class="name">${c.name}${c.season ? ` <span class="badge">${SEASON_LABEL[c.season]}</span>` : ''}</div>
        <div class="desc">${c.description}</div>
      </span>`;
    const btn = document.createElement('button');
    btn.className = 'small' + (active ? ' ghost' : '');
    if (!owned) {
      btn.innerHTML = `Купить · ${price}`;
      btn.disabled = c.sealPrice ? state.seals < c.sealPrice : state.coins < c.price;
      btn.addEventListener('click', () => {
        const r = buyCosmetic(state, c.id);
        if (r.ok) { ctx.toast(`${c.name} — уже в лавке!`); ctx.sfx?.('success'); ctx.save(); rerender(); }
        else ctx.toast(r.error);
      });
    } else {
      btn.textContent = active ? 'Убрать' : 'Выставить';
      btn.addEventListener('click', () => { toggleCosmetic(state, c.id); ctx.save(); rerender(); });
    }
    row.appendChild(btn);
    cosList.appendChild(row);
  }
  cosPanel.appendChild(cosList);
  container.appendChild(cosPanel);

  function rerender() {
    container.innerHTML = '';
    renderShop(container, ctx);
  }
}

// --- Подсказка-сравнение «Сейчас надето» ---
let compareEl = null;

export { showCompareTip, hideCompareTip };

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
      return `<div class="ct-item">${itemEmoji(cur)} ${cur.name}</div>` +
        `<div class="ct-stats">${describeItem(cur) || cur.description}</div>`;
    }).join('');
    // Подсказка выгоды: разница атаки/брони/здоровья
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
