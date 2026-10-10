// Конструктор боя (песочница): собери обе команды и проверь симуляцию.
// Без рыцаря — только наёмники против любых противников. Из Мастерской.
import { MERCENARIES, MERC_BY_ID } from '../data/crew.js';
import { ENEMY_BY_ID } from '../data/enemies.js';
import {
  makeFormationMerc, makeFormationEnemy, simulateFormationBattle, enemyFormationSlots,
} from '../core/formBattle.js';
import { playBattleReplay } from './formationView.js';
import { header } from './common.js';

const MAX_TEAM = 6;

export function renderSandbox(container, ctx) {
  const { state } = ctx;
  // Выбранные команды (храним между перерисовками на объекте состояния экрана)
  const picked = renderSandbox._picked ||= { allies: ['merc_guard', 'merc_archer'], foes: ['slime_meadow', 'slime_meadow'] };

  container.appendChild(header(ctx, '⚔️ Конструктор боя',
    'Собери обе команды и проверь симуляцию: один бой смотреть или серия на статистику', 'workshop'));

  function rerender() {
    container.innerHTML = '';
    renderSandbox(container, ctx);
  }

  // --- Панель выбора команды ---
  function teamPanel(title, pool, list, getDef) {
    const panel = document.createElement('div');
    panel.className = 'panel';
    const h = document.createElement('h3');
    h.textContent = `${title} (${list.length}/${MAX_TEAM})`;
    h.style.marginTop = '0';
    panel.appendChild(h);

    // Текущий состав: чипы, клик — убрать
    const team = document.createElement('div');
    team.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;min-height:34px';
    if (list.length === 0) {
      team.innerHTML = '<span class="muted">Пусто — добавь бойцов ниже</span>';
    }
    list.forEach((id, i) => {
      const d = getDef(id);
      const chip = document.createElement('button');
      chip.className = 'small primary';
      chip.textContent = `${d.icon} ${d.name} ✕`;
      chip.title = 'Убрать из команды';
      chip.addEventListener('click', () => {
        ctx.sfx?.('tap');
        list.splice(i, 1);
        rerender();
      });
      team.appendChild(chip);
    });
    panel.appendChild(team);

    // Пул: кнопки добавления
    const grid = document.createElement('div');
    grid.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;max-height:190px;overflow-y:auto';
    for (const id of pool) {
      const d = getDef(id);
      const b = document.createElement('button');
      b.className = 'small';
      const count = list.filter((x) => x === id).length;
      b.innerHTML = `${d.icon} ${d.name}${d.boss ? ' <span class="badge epic">БОСС</span>' : ''}${count ? ` ×${count}` : ''}`;
      b.title = d.description || `${d.hp}❤ атк ${d.attack} брн ${d.armor} скр ${d.speed}`;
      b.disabled = list.length >= MAX_TEAM;
      b.addEventListener('click', () => {
        ctx.sfx?.('tap');
        list.push(id);
        rerender();
      });
      grid.appendChild(b);
    }
    panel.appendChild(grid);
    return panel;
  }

  container.appendChild(teamPanel(
    'Твой отряд — наёмники',
    MERCENARIES.map((m) => m.id),
    picked.allies,
    (id) => MERC_BY_ID[id],
  ));
  container.appendChild(teamPanel(
    'Противник',
    Object.values(ENEMY_BY_ID).map((e) => e.id),
    picked.foes,
    (id) => ENEMY_BY_ID[id],
  ));

  // --- Тактика ---
  const tacticBox = document.createElement('div');
  tacticBox.className = 'panel';
  tacticBox.style.cssText = 'display:flex;gap:6px;align-items:center;flex-wrap:wrap';
  const tacticTitle = document.createElement('span');
  tacticTitle.textContent = 'Тактика союзников:';
  tacticBox.appendChild(tacticTitle);
  for (const [id, label] of [['defense', '🛡 Защита'], ['balance', '⚖ Баланс'], ['offense', '⚔ Нападение']]) {
    const b = document.createElement('button');
    b.className = 'small' + ((state.settings.tactic || 'balance') === id ? ' primary' : '');
    b.textContent = label;
    b.addEventListener('click', () => {
      state.settings.tactic = id;
      ctx.sfx?.('tap');
      ctx.save();
      rerender();
    });
    tacticBox.appendChild(b);
  }
  container.appendChild(tacticBox);

  // --- Кнопки запуска ---
  const actions = document.createElement('div');
  actions.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap';
  const oneBtn = document.createElement('button');
  oneBtn.className = 'primary';
  oneBtn.textContent = '⚔️ Один бой — смотреть';
  oneBtn.disabled = picked.allies.length === 0 || picked.foes.length === 0;
  oneBtn.addEventListener('click', () => runOne());
  const seriesBtn = document.createElement('button');
  seriesBtn.textContent = '📊 Серия ×30 — винрейт';
  seriesBtn.disabled = picked.allies.length === 0 || picked.foes.length === 0;
  seriesBtn.addEventListener('click', () => runSeries());
  actions.append(oneBtn, seriesBtn);
  container.appendChild(actions);

  // Результат серии
  const seriesOut = document.createElement('div');
  container.appendChild(seriesOut);

  // --- Сборка юнитов ---
  function buildUnits() {
    // Расстановка союзников: танки (броня+хп) в передний ряд, остальные назад
    const sorted = [...picked.allies]
      .map((id) => MERC_BY_ID[id])
      .sort((a, b) => (b.armor + b.hp / 20) - (a.armor + a.hp / 20));
    const allies = sorted.map((def, i) => {
      const slot = i < 3 ? i : i; // слоты 0-2 передний, 3-5 задний
      return makeFormationMerc(def, slot, i);
    });
    const foeSlots = enemyFormationSlots(picked.foes);
    const foes = picked.foes.map((id, i) => makeFormationEnemy(id, 1, foeSlots[i], i));
    return { allies, foes };
  }

  function buildUnitDefs() {
    const unitDefs = new Map();
    const sorted = [...picked.allies]
      .map((id) => MERC_BY_ID[id])
      .sort((a, b) => (b.armor + b.hp / 20) - (a.armor + a.hp / 20));
    sorted.forEach((d, i) => unitDefs.set(`a${i}`, { name: d.name, icon: d.icon, hp: d.hp }));
    picked.foes.forEach((id, i) => {
      const d = ENEMY_BY_ID[id];
      unitDefs.set(`e${i}`, { name: d.name, icon: d.icon, hp: d.hp });
    });
    return unitDefs;
  }

  function formationOf(allies, foes) {
    return {
      allies: allies.map((a) => ({ uid: a.uid, slot: a.slot, cell: [...a.cell] })),
      foes: foes.map((f) => ({ uid: f.uid, slot: f.slot, cell: [...f.cell] })),
    };
  }

  // --- Один бой с просмотром ---
  function runOne() {
    const { allies, foes } = buildUnits();
    const formation = formationOf(allies, foes);
    const seed = (Date.now() % 100000) + 1;
    const result = simulateFormationBattle(allies, foes, seed, state.settings.tactic || 'balance');
    result.formation = formation;
    result.rewards = [];
    playBattleReplay(container, ctx, {
      title: 'Тренировочный бой', backTo: 'sandbox', world: 'meadow',
      result, unitDefs: buildUnitDefs(),
      overlayButtons: () => [
        { label: '🔁 Ещё раз', onClick: () => { container.innerHTML = ''; renderSandbox(container, ctx); runOne(); } },
        { label: '📊 Серия ×30', onClick: () => { container.innerHTML = ''; renderSandbox(container, ctx); runSeries(); } },
        { label: '🧪 К конструктору', primary: true, onClick: () => { container.innerHTML = ''; renderSandbox(container, ctx); } },
      ],
    });
  }

  // --- Серия на статистику ---
  function runSeries() {
    const N = 30;
    let wins = 0;
    let ticksSum = 0;
    for (let seed = 1; seed <= N; seed++) {
      const { allies, foes } = buildUnits();
      const r = simulateFormationBattle(allies, foes, seed * 7 + 1, state.settings.tactic || 'balance');
      if (r.victory) wins++;
      ticksSum += r.ticks;
    }
    ctx.sfx?.(wins >= N / 2 ? 'success' : 'fail');
    seriesOut.innerHTML = '';
    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.innerHTML = `<h3 style="margin-top:0">📊 Серия из ${N}: побед отряда — <b>${wins}/${N}</b> (${Math.round(wins / N * 100)}%)</h3>
      <div class="muted">Средняя длина боя: ${Math.round(ticksSum / N)} тиков · тактика: ${{ defense: '🛡 Защита', balance: '⚖ Баланс', offense: '⚔ Нападение' }[state.settings.tactic || 'balance']}</div>`;
    seriesOut.appendChild(panel);
  }
}
