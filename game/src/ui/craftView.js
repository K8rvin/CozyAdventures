// Кузница и котёл: крафт, склад и потерьчатый обмен материалов между мирами.
import { recipeList, craft, exchangeMaterial } from '../core/state.js';
import { MATERIALS, materialLabel } from '../data/materials.js';
import {
  REGULAR_MATERIALS, materialExchangeInputs, materialExchangeTerms, isBossMaterial,
} from '../core/materialExchange.js';
import { ITEM_BY_ID } from '../data/items.js';
import { describeItem } from '../core/items.js';
import { header , quickNav } from './common.js';
import { itemIconEl } from './itemTip.js';
import { setSavingsGoal } from '../core/goals.js';

function preferredExchangeOutput(state, inputId) {
  for (const recipe of recipeList(state)) {
    for (const [matId, need] of Object.entries(recipe.materials)) {
      if (matId === inputId || isBossMaterial(matId)) continue;
      if ((state.materials[matId] || 0) < need) return matId;
    }
  }
  return REGULAR_MATERIALS.find((material) => material.id !== inputId)?.id || null;
}

function appendMaterialExchange(container, state, ctx, rerender) {
  const inputs = materialExchangeInputs(state);
  if (inputs.length === 0) return;

  const panel = document.createElement('div');
  panel.className = 'panel material-exchange';
  panel.innerHTML = '<h3>Обменник перекрёстка</h3>';
  const description = document.createElement('div');
  description.className = 'muted';
  description.textContent = 'Обычный материал: 3 → 1 · боссовский: 1 → 2. Менять можно между любыми мирами; получить боссовский материал нельзя.';
  panel.appendChild(description);

  const controls = document.createElement('div');
  controls.className = 'material-exchange-controls';
  const inputLabel = document.createElement('label');
  inputLabel.textContent = 'Отдать';
  const inputSelect = document.createElement('select');
  inputSelect.dataset.exchangeInput = '1';
  for (const material of inputs) {
    const option = document.createElement('option');
    option.value = material.id;
    option.textContent = `${material.icon} ${material.name} ×${state.materials[material.id]}${isBossMaterial(material.id) ? ' · боссовский' : ''}`;
    inputSelect.appendChild(option);
  }
  inputSelect.value = inputs[0].id;
  inputLabel.appendChild(inputSelect);

  const outputLabel = document.createElement('label');
  outputLabel.textContent = 'Получить';
  const outputSelect = document.createElement('select');
  outputSelect.dataset.exchangeOutput = '1';
  for (const material of REGULAR_MATERIALS) {
    const option = document.createElement('option');
    option.value = material.id;
    option.textContent = `${material.icon} ${material.name}`;
    outputSelect.appendChild(option);
  }
  outputSelect.value = preferredExchangeOutput(state, inputSelect.value);
  outputLabel.appendChild(outputSelect);

  const button = document.createElement('button');
  button.className = 'small primary';
  button.dataset.materialExchange = '1';
  button.textContent = 'Обменять';
  const rate = document.createElement('div');
  rate.className = 'muted material-exchange-rate';

  function syncTerms() {
    for (const option of outputSelect.children) option.disabled = option.value === inputSelect.value;
    if (outputSelect.value === inputSelect.value) {
      outputSelect.value = preferredExchangeOutput(state, inputSelect.value);
    }
    const terms = materialExchangeTerms(inputSelect.value, outputSelect.value);
    button.disabled = !terms || (state.materials[inputSelect.value] || 0) < terms.cost;
    rate.textContent = terms
      ? `Курс: ${terms.cost} × ${materialLabel(terms.input)} → ${terms.received} × ${materialLabel(terms.output)}.`
      : 'Выбери разные материалы. Боссовский материал доступен только как вход.';
  }

  inputSelect.addEventListener('change', syncTerms);
  outputSelect.addEventListener('change', syncTerms);
  button.addEventListener('click', () => {
    const result = exchangeMaterial(state, inputSelect.value, outputSelect.value);
    if (!result.ok) { ctx.toast(result.error); return; }
    ctx.toast(`Обмен состоялся: ${materialLabel(result.output)} ×${result.received}.`);
    ctx.sfx?.('success');
    ctx.save();
    rerender();
  });

  controls.append(inputLabel, outputLabel, button);
  panel.append(controls, rate);
  container.appendChild(panel);
  syncTerms();
}

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
      <span class="grow">
        <div class="name">${r.name}</div>
        <div class="desc">${describeItem(item) || item.description}</div>
        <div class="desc">${costs}${coinCost}</div>
      </span>`;
    row.prepend(itemIconEl(item));
    const btn = document.createElement('button');
    btn.className = 'small' + (r.canCraft ? ' primary' : '');
    btn.dataset.recipeId = r.id;
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
    const goalBtn = document.createElement('button');
    const selected = state.savingsGoal?.kind === 'recipe' && state.savingsGoal.id === r.id;
    goalBtn.className = 'small ghost goal-set';
    goalBtn.dataset.goalKind = 'recipe';
    goalBtn.dataset.goalId = r.id;
    goalBtn.textContent = selected ? 'Цель ✓' : 'Цель';
    goalBtn.title = 'Сделать целью накопления';
    goalBtn.addEventListener('click', () => {
      const result = setSavingsGoal(state, 'recipe', r.id);
      if (!result.ok) { ctx.toast(result.error); return; }
      ctx.sfx?.('tap');
      ctx.save();
      rerender();
    });
    row.appendChild(goalBtn);
    rcpList.appendChild(row);
  }
  rcpPanel.appendChild(rcpList);
  layout.appendChild(rcpPanel);
  container.appendChild(layout);
  appendMaterialExchange(container, state, ctx, rerender);

  function rerender() {
    container.innerHTML = '';
    renderCraft(container, ctx);
  }
}
