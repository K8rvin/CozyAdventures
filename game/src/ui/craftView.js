// Кузница и котёл: крафт из материалов, склад материалов.
import { recipeList, craft } from '../core/state.js';
import { MATERIALS, materialLabel } from '../data/materials.js';
import { ITEM_BY_ID } from '../data/items.js';
import { describeItem } from '../core/items.js';
import { header , quickNav } from './common.js';
import { itemEmoji } from './equipView.js';

export function renderCraft(container, ctx) {
  const { state } = ctx;
  container.appendChild(header(ctx, 'Кузница и котёл',
    'Материалы с походов становятся зельями и снаряжением. Наковальня горячая, котёл булькает.'));
  container.appendChild(quickNav(ctx, [
    { icon: '🌇', label: 'На площадь', screen: 'hub', params: { scene: 'square' } },
  ]));

  const layout = document.createElement('div');
  layout.style.cssText = 'display:flex;flex-wrap:wrap;gap:14px;align-items:flex-start';

  // --- Склад материалов ---
  const matPanel = document.createElement('div');
  matPanel.className = 'panel';
  matPanel.style.cssText = 'flex:1;min-width:260px';
  matPanel.innerHTML = '<h3>Склад материалов</h3>';
  const matList = document.createElement('div');
  matList.className = 'list';
  const owned = MATERIALS.filter((m) => (state.materials[m.id] || 0) > 0);
  if (owned.length === 0) {
    matList.innerHTML = '<div class="muted">Пусто. Рыцарь приносит материалы из походов — а ездовой питомец их удваивает.</div>';
  }
  for (const m of owned) {
    const row = document.createElement('div');
    row.className = 'row';
    row.title = m.description;
    row.innerHTML = `
      <span class="icon">${m.icon}</span>
      <span class="grow"><div class="name">${m.name}</div><div class="desc">${m.description}</div></span>
      <span class="price">×${state.materials[m.id]}</span>`;
    matList.appendChild(row);
  }
  matPanel.appendChild(matList);
  layout.appendChild(matPanel);

  // --- Рецепты ---
  const rcpPanel = document.createElement('div');
  rcpPanel.className = 'panel';
  rcpPanel.style.cssText = 'flex:2;min-width:320px';
  rcpPanel.innerHTML = '<h3>Рецепты</h3>';
  const rcpList = document.createElement('div');
  rcpList.className = 'list';

  const recipes = recipeList(state);
  if (recipes.length === 0) {
    rcpList.innerHTML = '<div class="muted">Рецепты появятся после первых побед рыцаря.</div>';
  }
  for (const r of recipes) {
    const item = ITEM_BY_ID[r.result.itemId];
    const row = document.createElement('div');
    row.className = 'row';
    const costs = Object.entries(r.materials).map(([matId, need]) => {
      const have = state.materials[matId] || 0;
      const short = have < need;
      return `<span style="${short ? 'color:var(--danger)' : ''}">${materialLabel(matId)} ${have}/${need}</span>`;
    }).join(' · ');
    const coinCost = r.coins ? ` · 🪙 ${r.coins}` : '';
    row.innerHTML = `
      <span class="icon">${itemEmoji(item)}</span>
      <span class="grow">
        <div class="name">${r.name}</div>
        <div class="desc">${describeItem(item) || item.description}</div>
        <div class="desc">${costs}${coinCost}</div>
      </span>`;
    const btn = document.createElement('button');
    btn.className = 'small' + (r.canCraft ? ' primary' : '');
    btn.textContent = 'Сделать';
    btn.disabled = !r.canCraft;
    btn.title = r.note;
    btn.addEventListener('click', () => {
      const res = craft(state, r.id);
      if (res.ok) {
        ctx.toast(`${r.name} — готово! Лежит в сундуке.`);
        ctx.sfx?.('success');
        ctx.save();
        rerender();
      } else {
        ctx.toast(res.error);
      }
    });
    row.appendChild(btn);
    rcpList.appendChild(row);
  }
  rcpPanel.appendChild(rcpList);
  layout.appendChild(rcpPanel);
  container.appendChild(layout);

  function rerender() {
    container.innerHTML = '';
    renderCraft(container, ctx);
  }
}
