// Таверна и конюшня: найм спутников, питомцев, наёмников, состав отряда.
import { crewStock, hireCrew, toggleCompanion, toggleMerc, setPet } from '../core/state.js';
import { header, quickNav } from './common.js';
import { setSavingsGoal } from '../core/goals.js';

const KIND_LABEL = {
  companion: '✨ Спутники (в отряде до 3)',
  pet: '🐾 Питомцы (1 активный)',
  merc: '⚔️ Наёмники (в бою до 2)',
};

export function bonusText(def) {
  const L = {
    hp: 'здоровье', attack: 'атака', armor: 'броня', speed: 'скорость',
    crit: 'крит', dodge: 'уклонение', goldFind: 'монеты', itemFind: 'находки',
    materialsFind: 'материалы',
  };
  const PERCENT = ['crit', 'dodge', 'goldFind', 'itemFind', 'materialsFind'];
  const parts = [];
  for (const [k, v] of Object.entries(def.bonus || {})) {
    if (PERCENT.includes(k)) parts.push(`${L[k]} +${Math.round(v * 100)}%`);
    else parts.push(`${L[k] || k} +${v}`);
  }
  if (def.hp) parts.push(`${def.hp}❤ ${def.attack}⚔ ${def.armor}🛡 ${def.speed}⚡`);
  return parts.join(', ');
}

export function renderTavern(container, ctx) {
  const { state } = ctx;

  container.appendChild(header(ctx, 'Таверна и конюшня',
    'Очаг, кружки, тихий бард. Здесь рыцарь находит друзей и помощников.', 'hub'));
  container.appendChild(quickNav(ctx, [
    { icon: '🌇', label: 'На площадь', screen: 'hub', params: { scene: 'square' } },
  ]));

  // Состав отряда
  const squadPanel = document.createElement('div');
  squadPanel.className = 'panel';
  const petDef = state.pet ? crewStock(state).find((c) => c.id === state.pet) : null;
  squadPanel.innerHTML = `<h3>Отряд сейчас</h3>
    <div>Спутники: ${state.squadCompanions.length ? state.squadCompanions.map((id) => `<span class="badge">${iconOf(state, id)}</span>`).join(' ') : '<span class="muted">никого</span>'}</div>
    <div class="mt">Наёмники: ${state.squadMercs.length ? state.squadMercs.map((id) => `<span class="badge">${iconOf(state, id)}</span>`).join(' ') : '<span class="muted">никого</span>'}</div>
    <div class="mt">Питомец: ${petDef ? `<span class="badge">${petDef.icon} ${petDef.name}</span>` : '<span class="muted">нет</span>'}</div>`;
  container.appendChild(squadPanel);

  const stock = crewStock(state);
  for (const kind of ['companion', 'pet', 'merc']) {
    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.innerHTML = `<h3>${KIND_LABEL[kind]}</h3>`;
    const list = document.createElement('div');
    list.className = 'list';
    for (const def of stock.filter((c) => c.kind === kind)) {
      const active =
        (kind === 'companion' && state.squadCompanions.includes(def.id)) ||
        (kind === 'merc' && state.squadMercs.includes(def.id)) ||
        (kind === 'pet' && state.pet === def.id);
      const row = document.createElement('div');
      row.className = 'row' + (active ? ' done' : '');
      const price = def.currency === 'seals' ? `🔰 ${def.price}` : `🪙 ${def.price}`;
      row.innerHTML = `
        <span class="icon">${def.icon}</span>
        <span class="grow">
          <div class="name">${def.name}${def.race ? ` <span class="badge">${def.race} · ${def.role}</span>` : ''}</div>
          <div class="desc">${def.description} ${bonusText(def) ? `· ${bonusText(def)}` : ''}</div>
        </span>`;
      const btn = document.createElement('button');
      btn.className = 'small' + (active ? ' ghost' : '');
      if (!def.hired) {
        btn.innerHTML = `Нанять · ${price}`;
        btn.disabled = def.currency === 'seals' ? state.seals < def.price : state.coins < def.price;
        btn.addEventListener('click', () => {
          const r = hireCrew(state, def.id, kind);
          if (r.ok) { ctx.toast(`${def.name} теперь с тобой!`); ctx.save(); rerender(); }
          else ctx.toast(r.error);
        });
      } else {
        btn.textContent = active ? 'Убрать из отряда' : 'В отряд';
        btn.addEventListener('click', () => {
          const fn = kind === 'companion' ? toggleCompanion : kind === 'merc' ? toggleMerc : setPet;
          const r = fn(state, def.id);
          if (r.ok) { ctx.save(); rerender(); }
          else ctx.toast(r.error);
        });
      }
      row.appendChild(btn);
      if (!def.hired) {
        const goalBtn = document.createElement('button');
        const selected = state.savingsGoal?.kind === 'crew' && state.savingsGoal.id === def.id;
        goalBtn.className = 'small ghost goal-set';
        goalBtn.dataset.goalKind = 'crew';
        goalBtn.dataset.goalId = def.id;
        goalBtn.textContent = selected ? 'Цель ✓' : 'Цель';
        goalBtn.title = 'Сделать целью накопления';
        goalBtn.addEventListener('click', () => {
          const result = setSavingsGoal(state, 'crew', def.id);
          if (!result.ok) { ctx.toast(result.error); return; }
          ctx.sfx?.('tap');
          ctx.save();
          rerender();
        });
        row.appendChild(goalBtn);
      }
      list.appendChild(row);
    }
    panel.appendChild(list);
    container.appendChild(panel);
  }

  function iconOf(st, id) {
    const c = crewStock(st).find((x) => x.id === id);
    return c ? `${c.icon} ${c.name}` : id;
  }

  function rerender() {
    container.innerHTML = '';
    renderTavern(container, ctx);
  }
}
