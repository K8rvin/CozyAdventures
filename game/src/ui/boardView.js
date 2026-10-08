// Доска объявлений на площади: настоящая доска с приколотыми бумажками.
// Клик по бумажке — анимация приближения и разворачивания, полный текст.
import { WANTED_BATTLES } from '../data/wanted.js';
import { ENEMY_BY_ID } from '../data/enemies.js';
import { battleAvailable, todayKey } from '../core/state.js';
import { header, quickNav } from './common.js';

// Письма жителей: постоянные уютные + по делам игрока.
const BASE_LETTERS = [
  { icon: '🧺', from: 'Прачка с реки', text: 'Кто-то наколотил дров у моего плота и не взял плату. Если это ваша лавка — спасибо!' },
  { icon: '🧙‍♀️', from: 'Травница с топей', text: 'Ягоды снова светятся. Значит, кто-то заботится о мире. Заходите за отваром.' },
  { icon: '👨‍🌾', from: 'Фермер с юга', text: 'Моя коза заблудилась и вернулась сытая. На ошейнике — ленточка вашей лавки.' },
  { icon: '📚', from: 'Библиотекарь', text: 'Шёпот страниц стал добрее. Держите это в секрете, но я скучаю по кляксам.' },
  { icon: '🕯️', from: 'Фонарщик', text: 'Фонари на площади горят ярче с тех пор, как лавка открылась. Странно, правда?' },
  { icon: '🐌', from: 'Почтальон-улитка', text: 'Медленно, но верно: письмо шло три дня. Спасибо за терпение, как всегда.' },
];

function playerLetters(state) {
  const out = [];
  if (state.battlesDone.bt_boss_willow) {
    out.push({ icon: '🌳', from: 'Лесник с опушки', text: 'Старая ива снова шумит спокойно. Передайте рыцарю — корни его помнят.' });
  }
  if (state.battlesDone.bt_boss_captain) {
    out.push({ icon: '💂', from: 'Стража дворика', text: 'Капитан наконец отдыхает. Ваш рыцарь будет упомянут в рапорте. Курсивом.' });
  }
  if (state.battlesDone.bk_boss_keeper) {
    out.push({ icon: '📖', from: 'Хранитель чердака', text: 'Последняя страница дописана. Тишина в библиотеке стала тёплой.' });
  }
  if ((state.crew || []).length >= 3) {
    out.push({ icon: '🍺', from: 'Хозяин таверны', text: 'Ваши люди платят честно и поют тихо. Таких отрядов не хватает.' });
  }
  if (Object.keys(state.puzzlesDone).length >= 20) {
    out.push({ icon: '🧩', from: 'Сказитель с рынка', text: 'Про ваши загадки уже рассказывают детям. Двадцать загадок! Ходят легенды.' });
  }
  if ((state.stats.catPets || 0) >= 10) {
    out.push({ icon: '🐈', from: 'Кот-хранитель', text: 'Мяу. Мяу-мяу. МРРРР. (Приложено: пойманный мотылёк.)' });
  }
  return out;
}

function seededLetters(state) {
  const day = todayKey();
  let h = 2166136261;
  for (const c of day) h = Math.imul(h ^ c.codePointAt(0), 16777619);
  const pool = [...playerLetters(state), ...BASE_LETTERS];
  const count = Math.min(pool.length, 4);
  const picked = [];
  for (let i = 0; i < count; i++) {
    h = (h * 1664525 + 1013904223) >>> 0;
    picked.push(pool.splice(h % pool.length, 1)[0]);
  }
  return picked;
}

const CHANGELOG = [
  ['0.9', 'Живая лавка: музыка, достижения, дневник кота, заказ дня; механики — механизмы, свечи, потоки; 86 загадок, 200 боёв, 12 миров.'],
  ['0.8', 'Городская площадь, искалки по нарисованным сценам, редактор хотспотов, чит-коды, паучок-скроллбар.'],
  ['0.7', 'Режим боя «Сбор» с рядами и расстановкой; экспедиции перекрёстка.'],
  ['0.6', 'Миры и цепочки боёв, отряд наёмников, крафт, косметика лавки.'],
  ['0.5', 'Книжный чердак и восстановление фраз; ездовые и летающие питомцы.'],
  ['0.4', 'Поиск предметов, полки и товары, таверна, звук.'],
  ['0.3', 'Свет и фонарики: первая механика, первый рыцарь, первый автобой.'],
];

// Цвета бумажек
const PAPER_COLORS = ['#f7ead7', '#f3dfca', '#e8d8f0', '#d8e8d0', '#fde8e0', '#e0ecf5', '#f5f0d8'];

export function renderBoard(container, ctx) {
  const { state } = ctx;
  container.appendChild(header(ctx, 'Доска объявлений', 'Бумажки на доске у фонтана. Тапни — прочитаешь.', 'hub'));

  const board = document.createElement('div');
  board.className = 'board-frame';

  let colorIdx = 0;
  const makeZone = (title) => {
    const zone = document.createElement('div');
    zone.className = 'board-zone';
    const zt = document.createElement('div');
    zt.className = 'board-zone-title';
    zt.textContent = title;
    zone.appendChild(zt);
    board.appendChild(zone);
    return zone;
  };
  const addNote = (zone, opts) => {
    const note = document.createElement('button');
    note.className = 'paper-note';
    const rot = ((colorIdx * 7) % 13) - 6; // разброс наклона
    note.style.setProperty('--rot', `${rot}deg`);
    note.style.background = PAPER_COLORS[colorIdx++ % PAPER_COLORS.length];
    note.innerHTML = `<span class="pn-icon">${opts.icon}</span><span class="pn-title">${opts.title}</span>`;
    note.addEventListener('click', (ev) => unfoldNote(ev.currentTarget, opts));
    zone.appendChild(note);
  };

  // Зона 1: письма от жителей
  const lettersZone = makeZone('✉️ Письма жителей');
  for (const l of seededLetters(state)) {
    addNote(lettersZone, {
      icon: l.icon, title: `Письмо: ${l.from}`, kind: 'letter',
      heading: `✉️ ${l.from}`, body: l.text,
    });
  }

  // Зона 2: розыскные листы
  const wantedZone = makeZone('🎯 Розыскные листы');
  for (const w of WANTED_BATTLES) {
    const available = battleAvailable(state, w.id);
    const done = !!state.battlesDone[w.id];
    const icons = w.enemies.map((e) => ENEMY_BY_ID[typeof e === 'string' ? e : e.id].icon).join(' ');
    addNote(wantedZone, {
      icon: '🎯', title: w.name.replace('Розыск: ', 'РОЗЫСК — '), kind: 'wanted',
      heading: `🎯 ${w.name}`,
      body: `${available ? w.tip : 'Победи босса соответствующего мира, и лист появится.'}<br><br>Против: ${icons}`,
      action: available ? { label: done ? '⚔️ Снова ловить' : '⚔️ Ловить!', go: () => ctx.go('battle', { id: w.id }) } : null,
      done,
    });
  }

  // Зона 3: летопись
  const logZone = makeZone('📜 Летопись');
  addNote(logZone, {
    icon: '📜', title: 'Летопись лавки', kind: 'log',
    heading: '📜 История лавки',
    body: CHANGELOG.map(([v, t]) => `<b>v${v}</b> — ${t}`).join('<br><br>'),
  });

  container.appendChild(board);
  container.appendChild(quickNav(ctx, [
    { icon: '🌇', label: 'На площадь', screen: 'hub', params: { scene: 'square' }, primary: true },
  ]));

  // Разворачивание бумажки
  function unfoldNote(noteEl, opts) {
    ctx.sfx?.('hint');
    const overlay = document.createElement('div');
    overlay.className = 'overlay paper-overlay';
    const paper = document.createElement('div');
    paper.className = 'paper-full';
    paper.style.background = noteEl.style.background;
    paper.innerHTML = `
      <div class="pf-pin">📌</div>
      <h3>${opts.heading}</h3>
      <div class="pf-body">${opts.body}</div>
      <div class="pf-actions"></div>`;
    const actions = paper.querySelector('.pf-actions');
    if (opts.action) {
      const btn = document.createElement('button');
      btn.className = 'primary';
      btn.textContent = opts.action.label;
      btn.addEventListener('click', () => { overlay.remove(); opts.action.go(); });
      actions.appendChild(btn);
    }
    const close = document.createElement('button');
    close.textContent = 'Прибить обратно 📌';
    close.addEventListener('click', () => overlay.remove());
    actions.appendChild(close);
    overlay.appendChild(paper);
    overlay.addEventListener('click', (ev) => { if (ev.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
  }
}
