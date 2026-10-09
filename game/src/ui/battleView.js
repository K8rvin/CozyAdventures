// Походы рыцаря: список боёв. Сам бой — в режиме «сбор» (formationView.js).
import { BATTLES } from '../data/battles.js';
import { ENEMY_BY_ID } from '../data/enemies.js';
import { battleAvailable, firstUnbeatenBattle } from '../core/state.js';
import { startTutorial } from './tutorial.js';
import { quickNav } from './common.js';

// --- Список боёв ---

export function renderBattleList(container, ctx) {
  const { state } = ctx;

  const head = document.createElement('div');
  head.className = 'panel';
  head.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
    <h2 style="margin:0">Походы рыцаря</h2></div>
    <div class="muted">Рыцарь сражается сам — твоя работа: снарядить его с заботой. Три мира ждут.</div>`;
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

  const list = document.createElement('div');
  list.className = 'list';
  const won = Object.keys(state.battlesDone).length;
  const firstUnbeaten = firstUnbeatenBattle(state);
  const WORLD_LABEL = {
    meadow: '🌿 Тихая опушка', town: '🏰 Средневековый дворик', attic: '📖 Книжный чердак',
    crossroads: '🌟 Экспедиции перекрёстка',
    nm: '🌃 Ночной рынок', sw: '🐸 Сказочные топи', sf: '🎪 Звёздная ярмарка',
    cr: '💎 Хрустальные горы', ash: '🔥 Пепельные степи', jade: '🎋 Нефритовый сад',
    deep: '🐚 Подводный грот', mist: '⏳ Туманные часы',
  };
  let lastWorld = null;
  for (const b of BATTLES) {
    if (b.wanted) continue; // розыскные живут на доске объявлений
    if (b.world !== lastWorld) {
      lastWorld = b.world;
      const wh = document.createElement('h3');
      wh.textContent = WORLD_LABEL[b.world] || b.world;
      list.appendChild(wh);
    }
    const available = battleAvailable(state, b.id);
    const done = !!state.battlesDone[b.id];
    const row = document.createElement('div');
    row.className = 'row' + (available ? '' : ' locked') + (done ? ' done' : '');
    if (firstUnbeaten && b.id === firstUnbeaten.id) row.dataset.scrollTarget = '1';
    const icons = b.enemies.map((e) => ENEMY_BY_ID[typeof e === 'string' ? e : e.id].icon).join(' ');
    row.innerHTML = `
      <span class="icon">${available ? (done ? '🏆' : '⚔️') : '🔒'}</span>
      <span class="grow">
        <div class="name">${b.name} ${ENEMY_BY_ID[typeof b.enemies[0] === 'string' ? b.enemies[0] : b.enemies[0].id].boss ? '<span class="badge epic">БОСС</span>' : ''}</div>
        <div class="desc">${available ? b.tip : 'Пройди предыдущий поход.'} · Против: ${icons}</div>
      </span>`;
    if (available) {
      const btn = document.createElement('button');
      btn.textContent = done ? 'Снова' : 'В поход!';
      btn.className = done ? '' : 'primary';
      btn.addEventListener('click', () => ctx.go('battle', { id: b.id }));
      row.appendChild(btn);
    }
    list.appendChild(row);
  }
  container.appendChild(list);

  // Автоскролл к первой доступной непройденной битве
  const targetRow = list.querySelector?.('[data-scroll-target="1"]');
  if (targetRow && targetRow.scrollIntoView) {
    setTimeout(() => targetRow.scrollIntoView({ block: 'center', behavior: 'smooth' }), 60);
  }

  // Обучение первому бою
  if (won === 0) {
    const firstBtn = list.querySelector?.('.row:not(.locked) button');
    if (firstBtn) {
      startTutorial(ctx, 'first_battle', [
        {
          target: firstBtn,
          title: 'Первый поход рыцаря',
          text: 'Бой идёт сам — ты режиссёр, а не актер. Нажми «В поход!» и смотри, как твоя забота превращается в победу. Если что-то пойдёт не так, отчёт подскажет, чего не хватило.',
          cta: 'В поход!',
        },
      ]);
    }
  }
}
