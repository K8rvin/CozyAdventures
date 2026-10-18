// Походы рыцаря: плитки миров + список боёв выбранного мира.
// Сам бой — в режиме «сбор» (formationView.js).
import { BATTLES, BATTLE_BY_ID } from '../data/battles.js';
import { ENEMY_BY_ID } from '../data/enemies.js';
import { TROPHIES } from '../data/trophies.js';
import { battleAvailable, firstUnbeatenBattle } from '../core/state.js';
import { startTutorial } from './tutorial.js';
import { header, quickNav } from './common.js';

// Метаданные миров для плиток. Арт — готовые фоны боёв assets/battle/.
const WORLD_META = {
  meadow: { label: 'Тихая опушка', icon: '🌿' },
  town: { label: 'Средневековый дворик', icon: '🏰' },
  attic: { label: 'Книжный чердак', icon: '📖' },
  crossroads: { label: 'Экспедиции перекрёстка', icon: '🌟' },
  nm: { label: 'Ночной рынок', icon: '🌃' },
  sw: { label: 'Сказочные топи', icon: '🐸' },
  sf: { label: 'Звёздная ярмарка', icon: '🎪' },
  cr: { label: 'Хрустальные горы', icon: '💎' },
  ash: { label: 'Пепельные степи', icon: '🔥' },
  jade: { label: 'Нефритовый сад', icon: '🎋' },
  deep: { label: 'Подводный грот', icon: '🐚' },
  mist: { label: 'Туманные часы', icon: '⏳' },
};

// Миры в порядке следования боёв (розыскные живут на доске объявлений).
export function battleWorlds(state) {
  const order = [];
  const byWorld = new Map();
  for (const b of BATTLES) {
    if (b.wanted) continue;
    if (!byWorld.has(b.world)) { byWorld.set(b.world, []); order.push(b.world); }
    byWorld.get(b.world).push(b);
  }
  return order.map((id) => {
    const battles = byWorld.get(id);
    const done = battles.filter((b) => state.battlesDone[b.id]).length;
    const trophy = TROPHIES.find((t) => BATTLE_BY_ID[t.battleId]?.world === id);
    return {
      id,
      battles,
      done,
      total: battles.length,
      open: battleAvailable(state, battles[0].id),
      trophy: trophy || null,
      meta: WORLD_META[id] || { label: id, icon: '🗺️' },
      art: `assets/battle/battle_bg_${id}_web.jpg`,
    };
  });
}

// Выбранный мир переживает перерисовки экрана (возврат из боя).
let selectedWorld = null;
// firstUnbeaten прошлого рендера: перескок к новому рубежу — только когда
// он сменился (пал босс выбранного мира), а не при ручном выборе старого мира.
let seenFirstUnbeaten = null;

export function renderBattleList(container, ctx) {
  const { state } = ctx;

  container.appendChild(header(ctx, 'Походы рыцаря',
    'Рыцарь сражается сам — твоя работа: снарядить его с заботой. Выбери мир и отправляйся в путь.', 'hub'));
  container.appendChild(quickNav(ctx, [
    { icon: '🎒', label: 'Комната рыцаря', screen: 'equip', primary: true },
    { icon: '🏠', label: 'В лавку', screen: 'hub' },
  ]));

  const worlds = battleWorlds(state);
  const won = Object.keys(state.battlesDone).length;
  const firstUnbeaten = firstUnbeatenBattle(state);

  // По умолчанию — мир следующего похода. Перескакиваем к новому рубежу,
  // только если пал босс выбранного мира (следующий поход сменился), —
  // ручной выбор пройденного мира для переигровки не сбрасывается.
  const cur = worlds.find((w) => w.id === selectedWorld);
  const fuId = firstUnbeaten ? firstUnbeaten.id : null;
  if (!cur || !cur.open || (cur.done === cur.total && firstUnbeaten && fuId !== seenFirstUnbeaten)) {
    selectedWorld = (firstUnbeaten && firstUnbeaten.world) || worlds[worlds.length - 1].id;
  }
  seenFirstUnbeaten = fuId;

  // --- Плитки миров (показываем только открытые) ---
  const grid = document.createElement('div');
  grid.className = 'world-grid';
  for (const w of worlds) {
    if (!w.open) continue;
    const tile = document.createElement('button');
    tile.className = 'world-tile'
      + (w.id === selectedWorld ? ' current' : '')
      + (w.done === w.total ? ' cleared' : '');
    tile.dataset.world = w.id;
    const pct = w.total ? Math.round((w.done / w.total) * 100) : 0;
    const isNext = firstUnbeaten && firstUnbeaten.world === w.id;
    tile.innerHTML = `
      <span class="wt-bg" style="background-image:url('${w.art}')"></span>
      <span class="wt-shade"></span>
      ${isNext ? '<span class="wt-tag next">⚔️ сюда</span>' : ''}
      ${w.done === w.total && w.trophy ? `<span class="wt-tag trophy">${w.trophy.icon}</span>` : ''}
      <span class="wt-body">
        <span class="wt-name">${w.meta.icon} ${w.meta.label}</span>
        <span class="wt-sub">${w.done === w.total ? `Пройден · ${w.total}/${w.total}` : `${w.done}/${w.total} походов`}</span>
        <span class="wt-bar"><i style="width:${pct}%"></i></span>
      </span>`;
    tile.addEventListener('click', () => {
      selectedWorld = w.id;
      container.innerHTML = '';
      renderBattleList(container, ctx);
    });
    grid.appendChild(tile);
  }
  container.appendChild(grid);

  // --- Бои выбранного мира ---
  const world = worlds.find((w) => w.id === selectedWorld) || worlds[0];
  const listHead = document.createElement('h3');
  listHead.dataset.listHead = '1';
  listHead.textContent = `${world.meta.icon} ${world.meta.label} · ${world.done}/${world.total}`;
  container.appendChild(listHead);

  const list = document.createElement('div');
  list.className = 'list';
  let scrollTarget = null;
  for (const b of world.battles) {
    const available = battleAvailable(state, b.id);
    const done = !!state.battlesDone[b.id];
    const row = document.createElement('div');
    row.className = 'row' + (available ? '' : ' locked') + (done ? ' done' : '');
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
    if (!scrollTarget && available && !done) scrollTarget = row;
    list.appendChild(row);
  }
  container.appendChild(list);

  // Автоскролл к первому непройденному бою выбранного мира
  // (в полностью пройденном мире цели нет — страница не листается)
  if (scrollTarget && scrollTarget.scrollIntoView) {
    setTimeout(() => scrollTarget.scrollIntoView({ block: 'center', behavior: 'smooth' }), 60);
  }

  // Обучение первому бою
  if (won === 0) {
    const firstBtn = list.children[0]?.querySelector?.('button');
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
