// Хаб-лавка: одна большая картинка с интерактивными объектами.
import { ALL_PUZZLES, unseenShopItems } from '../core/state.js';
import { BATTLES } from '../data/battles.js';
import { startTutorial } from './tutorial.js';

export function renderHub(container, ctx, params = {}) {
  const { state } = ctx;

  const solved = Object.keys(state.puzzlesDone).length;
  const won = Object.keys(state.battlesDone).length;
  const firstPurchaseDone = (state.stats.itemsBought || 0) > 0;

  function rerender(scene) {
    ctx.setHubScene?.(scene);
    container.innerHTML = '';
    renderHub(container, ctx, { scene });
  }

  // --- Сцены хаба: уютная лавка и городская площадь ---
  const SCENES = {
    lavka: {
      candidates: ['assets/hub_banner_web.jpg', 'assets/hub_banner.jfif', 'assets/hub_banner.png', 'assets/hub_banner.svg'],
      alt: 'Лавка на перекрёстке миров',
      // Хотспоты: [icon, label, screen, x%, y%, showDot]
      hotspots: [
        ['📚', 'Головоломки', 'puzzles', 15, 42, () => solved === 0],
        ['🪙', 'Прилавок', 'shop', 43, 55, () => (solved > 0 && !firstPurchaseDone) || unseenShopItems(state).length > 0],
        ['🛡️', 'Комната рыцаря', 'equip', 67, 45, () => false],
        ['🌆', 'На площадь', '@square', 77, 50, () => false],
        ['🪟', 'В поход', 'battles', 93, 45, () => firstPurchaseDone && won === 0],
      ],
    },
    square: {
      candidates: ['assets/town_square_web.jpg', 'assets/seek_town_web.jpg'],
      alt: 'Городская площадь',
      hotspots: [
        ['🍺', 'Таверна', 'tavern', 82, 45, () => false],
        ['⚒️', 'Кузница и котёл', 'craft', 35, 55, () => false],
        ['🛠️', 'Мастерская', 'workshop', 52, 68, () => false],
        ['🏮', 'В лавку', '@lavka', 6, 55, () => false],
      ],
    },
  };

  const sceneId = params.scene || 'lavka';
  const scene = SCENES[sceneId] || SCENES.lavka;

  const scenePanel = document.createElement('div');
  scenePanel.className = 'panel hub-picture';
  scenePanel.style.padding = '0';
  scenePanel.style.overflow = 'hidden';
  const picture = document.createElement('img');
  picture.className = 'hub-scene';
  picture.alt = scene.alt;
  let candidateIdx = 0;
  picture.addEventListener('error', () => {
    candidateIdx += 1;
    if (candidateIdx < scene.candidates.length) picture.src = scene.candidates[candidateIdx];
    else picture.remove();
  });
  picture.src = scene.candidates[0];
  scenePanel.appendChild(picture);
  container.appendChild(scenePanel);

  const hotspotEls = {};
  for (const [icon, label, screen, x, y, dot] of scene.hotspots) {
    const b = document.createElement('button');
    b.className = 'hotspot';
    b.style.left = `${x}%`;
    b.style.top = `${y}%`;
    b.setAttribute('aria-label', label);
    b.innerHTML = `<span class="hs-icon">${icon}</span><span class="hs-label">${label}</span>${dot() ? '<span class="hs-dot"></span>' : ''}`;
    b.addEventListener('click', () => {
      ctx.sfx?.('tap');
      b.classList.add('zap');
      setTimeout(() => {
        if (screen === '@square') rerender('square');
        else if (screen === '@lavka') rerender('lavka');
        else ctx.go(screen);
      }, 150);
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

  // --- Первое обучение: знакомство с лавкой (только в сцене лавки) ---
  if (sceneId === 'lavka') {
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
        text: 'Рыцарь сражается сам — твоя забота в том, чем он одет и кто с ним. А за окном — площадь с таверной и кузницей. Начни с первой загадки!',
        cta: 'К загадкам!',
      },
    ]);
  }
}
