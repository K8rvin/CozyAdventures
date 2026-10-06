// Таверна и конюшня: найм спутников, питомцев, наёмников, состав отряда.
import { crewStock, hireCrew, toggleCompanion, toggleMerc, setPet } from '../core/state.js';
import { quickNav } from './common.js';

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

  const head = document.createElement('div');
  head.className = 'panel';
  head.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
    <h2 style="margin:0">Таверна и конюшня</h2></div>
    <div class="muted">Очаг, кружки, тихий бард. Здесь рыцарь находит друзей и помощников.</div>`;
  const back = document.createElement('button');
  back.className = 'ghost small';
  back.textContent = '← Назад';
  back.addEventListener('click', () => ctx.go('hub'));
  head.firstElementChild.appendChild(back);
  container.appendChild(head);
  container.appendChild(quickNav(ctx, [
    { icon: '🏠', label: 'В лавку', screen: 'hub' },
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
