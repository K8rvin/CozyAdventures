// Хаб-лавка: одна большая картинка с интерактивными объектами.
import { ALL_PUZZLES } from '../core/state.js';
import { BATTLES } from '../data/battles.js';
import { toggleSound, soundEnabled } from './sound.js';
import { startTutorial } from './tutorial.js';

export function renderHub(container, ctx) {
  const { state } = ctx;

  const solved = Object.keys(state.puzzlesDone).length;
  const won = Object.keys(state.battlesDone).length;

  // --- Большая реалистичная картинка лавки с интерактивными объектами ---
  const scenePanel = document.createElement('div');
  scenePanel.className = 'panel hub-picture';
  scenePanel.style.padding = '0';
  scenePanel.style.overflow = 'hidden';
  const picture = document.createElement('img');
  picture.className = 'hub-scene';
  picture.alt = 'Лавка на перекрёстке миров';
  // Цепочка фолбэков: web.jpg → jfif → png → svg
  const candidates = ['assets/hub_banner_web.jpg', 'assets/hub_banner.jfif', 'assets/hub_banner.png', 'assets/hub_banner.svg'];
  let candidateIdx = 0;
  picture.addEventListener('error', () => {
    candidateIdx += 1;
    if (candidateIdx < candidates.length) picture.src = candidates[candidateIdx];
    else picture.remove();
  });
  picture.src = candidates[0];
  scenePanel.appendChild(picture);
  container.appendChild(scenePanel);

  // Хотспоты прямо на картинке: [icon, label, screen, x%, y%, showDot]
  const firstPurchaseDone = (state.stats.itemsBought || 0) > 0;
  const hotspots = [
    ['📚', 'Головоломки', 'puzzles', 15, 42, solved === 0],
    ['🪙', 'Прилавок', 'shop', 43, 55, solved > 0 && !firstPurchaseDone],
    ['🐾', 'Таверна', 'tavern', 27, 80, false],
    ['🛡️', 'Комната рыцаря', 'equip', 67, 45, false],
    ['🚪', 'В поход', 'battles', 77, 50, firstPurchaseDone && won === 0],
    ['⚒️', 'Кузница и котёл', 'craft', 50, 13, false],
    ['🛠️', 'Мастерская', 'workshop', 91, 32, false],
  ];
  const hotspotEls = {};
  for (const [icon, label, screen, x, y, dot] of hotspots) {
    const b = document.createElement('button');
    b.className = 'hotspot';
    b.style.left = `${x}%`;
    b.style.top = `${y}%`;
    b.setAttribute('aria-label', label);
    b.innerHTML = `<span class="hs-icon">${icon}</span><span class="hs-label">${label}</span>${dot ? '<span class="hs-dot"></span>' : ''}`;
    b.addEventListener('click', () => {
      ctx.sfx?.('tap');
      b.classList.add('zap');
      setTimeout(() => ctx.go(screen), 150);
    });
    scenePanel.appendChild(b);
    hotspotEls[screen] = b;
  }

  // Прогресс-подпись под картинкой (+ активные украшения)
  const progress = document.createElement('div');
  progress.className = 'muted center mt';
  progress.style.fontSize = '14px';
  const cosIcons = (state.cosmeticsActive || []).length
    ? ` · Украшения: ${(state.cosmeticsActive || []).map((id) => ({ cos_carpet: '🟥', cos_crest: '🪧', cos_flowers: '🌸', cos_fireflies: '✨', cos_garland: '🎏', cos_snow: '❄️' })[id] || '🎀').join(' ')}`
    : '';
  progress.innerHTML = `🧩 Загадок решено: <b>${solved}/${ALL_PUZZLES.length}</b> · ⚔️ Походов пройдено: <b>${won}/${BATTLES.length}</b> · 🐾 Команда: <b>${(state.crew || []).length}</b>${cosIcons}`;
  container.appendChild(progress);

  const footer = document.createElement('div');
  footer.className = 'panel mt center';
  const soundBtn = document.createElement('button');
  soundBtn.className = 'ghost small';
  soundBtn.textContent = soundEnabled() ? '🔔 Звук: вкл' : '🔕 Звук: выкл';
  soundBtn.addEventListener('click', () => {
    const on = toggleSound();
    soundBtn.textContent = on ? '🔔 Звук: вкл' : '🔕 Звук: выкл';
    if (on) ctx.sfx?.('coin');
  });
  const newBtn = document.createElement('button');
  newBtn.className = 'ghost small';
  newBtn.textContent = '🕯️ Начать новую игру';
  newBtn.addEventListener('click', () => ctx.newGameConfirm());
  footer.append(soundBtn, ' ', newBtn);
  container.appendChild(footer);

  // Заставка: реалистичная картинка, фолбэк — анимированный SVG
  const anim = document.createElement('img');
  anim.alt = '';
  anim.style.cssText = 'width:100%;border-radius:14px;margin-top:14px;opacity:0.9';
  const animCandidates = ['assets/intro_web.jpg', 'assets/intro.jfif', 'assets/intro_anim.svg'];
  let animIdx = 0;
  anim.addEventListener('error', () => {
    animIdx += 1;
    if (animIdx < animCandidates.length) anim.src = animCandidates[animIdx];
    else anim.remove();
  });
  anim.src = animCandidates[0];
  container.appendChild(anim);

  // --- Первое обучение: знакомство с лавкой ---
  startTutorial(ctx, 'welcome', [
    {
      target: picture,
      title: 'Добро пожаловать, хозяин!',
      text: 'Это твоя лавка на перекрёстке миров. Каждый предмет в ней — живой: полки, прилавок, рыцарь, дверь. Кликай по ним, чтобы хозяйничать.',
    },
    {
      target: hotspotEls.puzzles,
      title: 'Полки с загадками',
      text: 'Здесь живут хозяйственные головоломки: свет и фонарики, товары на полках, книжные фразы и поиск потерянных мелочей. За них — монеты и печати.',
    },
    {
      target: hotspotEls.equip,
      title: 'Комната рыцаря',
      text: 'Награды трать на снаряжение: девять слотов, двуручное оружие занимает обе руки. Вещи реально меняют бой.',
    },
    {
      target: hotspotEls.battles,
      title: 'Дверь в поход',
      text: 'Рыцарь сражается сам — твоя забота в том, чем он одет и кто с ним. Начни с первой загадки: она уже ждёт на полках.',
      cta: 'К загадкам!',
    },
  ]);
}
