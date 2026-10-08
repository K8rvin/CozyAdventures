// Хаб-лавка: одна большая картинка с интерактивными объектами.
import { ALL_PUZZLES, unseenShopItems, currentSeason, SEASON_LABEL, petTheCat, shopStock } from '../core/state.js';
import { itemsForShop } from '../data/shop.js';

// Есть ли новинки в конкретной лавке площади
function hasUnseenIn(state, shopKey) {
  const unseen = new Set(unseenShopItems(state).map((i) => i.id));
  return itemsForShop(state, shopKey, shopStock(state)).some((i) => unseen.has(i.id));
}
import { COMPANION_BY_ID, PET_BY_ID } from '../data/crew.js';
import { BATTLES } from '../data/battles.js';
import { startTutorial } from './tutorial.js';

// Реплики спутников и питомцев для дневника (случайная при визите)
const CHATTER = {
  cmp_firefly: ['✨ Светлячок кружит над полками: «Тут красиво!»', '✨ Светлячок подсвечивает самое тёмное место.'],
  cmp_herbalist: ['🌿 Травница сушит новый сбор над очагом.', '🌿 «К котлу бы мяты…» — травница заглядывает в чайник.'],
  cmp_cat: ['🐈 Кот-хранитель обходит полки — всё на месте.', '🐈 Кот что-то уронил и делает вид, что так и было.'],
  cmp_smith: ['⚒️ Кузнец-подмастерье точит инструмент у окна.', '⚒️ «Броню бы подтянуть» — бормочет кузнец.'],
  pet_puppy: ['🐕 Щенок принёс палку. Очень важную палку.', '🐕 Щенок виляет хвостом всей лавке.'],
  pet_hedgehog: ['🦔 Ёжик свернулся в тапке. Это его тапок теперь.', '🦔 Ёжик фыркает на буханку.'],
  pet_fox: ['🦊 Лисёнок примеряет твоё шляпное место у кассы.', '🦊 Лисёнок что-то прячет за прилавком.'],
  pet_horse: ['🐴 Сивка фыркает у двери — скучает по дороге.', '🐴 Сивка обгладывает веник. Он был хорошим веником.'],
  pet_owl: ['🦉 Сова считает вслух остатки на полках. Сбивается.', '🦉 Сова одобрительно ухает новому порядку.'],
};

function pickChatter(state) {
  const active = [...(state.squadCompanions || []), state.pet].filter(Boolean);
  const pool = active.flatMap((id) => CHATTER[id] || []);
  if (pool.length === 0) return null;
  const speaker = active[Math.floor(Math.random() * active.length)];
  const lines = CHATTER[speaker];
  return lines[Math.floor(Math.random() * lines.length)];
}

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
        ['🐈', 'Погладить кота', '@cat', 27, 80, () => false],
      ],
    },
    square: {
      candidates: ['assets/town_square_web.jpg', 'assets/seek_town_web.jpg'],
      alt: 'Городская площадь',
      hotspots: [
        ['🍺', 'Таверна', 'tavern', 79, 60, () => false],
        ['⚒️', 'Кузница и котёл', 'craft', 39, 52, () => false],
        ['🛠️', 'Мастерская', 'workshop', 52, 68, () => false],
        ['📌', 'Доска объявлений', 'board', 6, 55, () => false],
        ['🏮', 'В лавку', '@lavka', 17, 47, () => false],
        ['🏬', 'Торговый квартал', '@market', 52, 38, () => ['armory', 'armorer', 'magic', 'alchemy'].some((k) => hasUnseenIn(state, k))],
      ],
    },
    market: {
      candidates: ['assets/town_market_web.jpg', 'assets/town_market.jfif', 'assets/town_square_web.jpg'],
      alt: 'Торговый квартал',
      hotspots: [
        ['🗡️', 'Оружейник', 'shopArmory', 8, 60, () => hasUnseenIn(state, 'armory')],
        ['🛡️', 'Бронник', 'shopArmorer', 37, 60, () => hasUnseenIn(state, 'armorer')],
        ['🔮', 'Маг', 'shopMagic', 65, 62, () => hasUnseenIn(state, 'magic')],
        ['🧪', 'Алхимик', 'shopAlchemy', 81, 60, () => hasUnseenIn(state, 'alchemy')],
        ['🌇', 'На площадь', '@square', 50, 60, () => false],
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
      if (screen === '@cat') { petCat(b); return; }
      ctx.sfx?.('tap');
      b.classList.add('zap');
      setTimeout(() => {
        if (screen === '@square') rerender('square');
        else if (screen === '@lavka') rerender('lavka');
        else if (screen === '@market') rerender('market');
        else ctx.go(screen);
      }, 150);
    });
    scenePanel.appendChild(b);
    hotspotEls[screen] = b;
  }

  // Прогресс-подпись под картинкой (+ сезон и активные украшения)
  const progress = document.createElement('div');
  progress.className = 'muted center mt';
  progress.style.fontSize = '14px';
  const season = SEASON_LABEL[currentSeason()];
  const cosIcons = (state.cosmeticsActive || []).length
    ? ` · Украшения: ${(state.cosmeticsActive || []).map((id) => ({ cos_carpet: '🟥', cos_crest: '🪧', cos_flowers: '🌸', cos_fireflies: '✨', cos_garland: '🎏', cos_snow: '❄️' })[id] || '🎀').join(' ')}`
    : '';
  progress.innerHTML = `🧩 Загадок решено: <b>${solved}/${ALL_PUZZLES.length}</b> · ⚔️ Походов пройдено: <b>${won}/${BATTLES.length}</b> · 🐾 Команда: <b>${(state.crew || []).length}</b> · ${season}${cosIcons}`;
  container.appendChild(progress);

  // Погладить кота: сердечки, мурлыкание, дневник, ежедневный подарок
  function petCat(btn) {
    ctx.sfx?.('purr');
    const r = petTheCat(state);
    ctx.save();
    // Сердечки взлетают от кота
    const rect = btn.getBoundingClientRect();
    for (let i = 0; i < 4; i++) {
      const heart = document.createElement('div');
      heart.className = 'cat-heart';
      heart.textContent = ['❤️', '🧡', '💛'][i % 3];
      heart.style.left = `${rect.left + rect.width / 2 + (i - 1.5) * 16}px`;
      heart.style.top = `${rect.top + window.scrollY}px`;
      heart.style.animationDelay = `${i * 0.08}s`;
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 1200);
    }
    ctx.toast(r.gift > 0 ? `${r.line} ${'🪙+2!'}` : r.line);
    // Мягкая перерисовка дневника без ухода со сцены
    rerender(sceneId);
  }

  // Питомец гуляет по сцене (если есть активный)
  if (state.pet && PET_BY_ID[state.pet]) {
    const pet = document.createElement('div');
    pet.className = 'hub-pet';
    pet.textContent = PET_BY_ID[state.pet].icon;
    scenePanel.appendChild(pet);
  }

  // --- Дневник кота и реплики команды ---
  const chatter = pickChatter(state);
  const journal = (state.journal || []).slice(-2).reverse();
  if (chatter || journal.length > 0) {
    const catPanel = document.createElement('div');
    catPanel.className = 'panel cat-panel';
    catPanel.innerHTML = '<span class="cat-icon">🐈</span>';
    const body = document.createElement('div');
    body.style.flex = '1';
    if (chatter) {
      const line = document.createElement('div');
      line.className = 'cat-line';
      line.innerHTML = chatter;
      body.appendChild(line);
    }
    for (const j of journal) {
      const entry = document.createElement('div');
      entry.className = 'cat-entry';
      entry.innerHTML = `${j.icon} ${j.text}`;
      body.appendChild(entry);
    }
    catPanel.appendChild(body);
    container.appendChild(catPanel);
  }

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
