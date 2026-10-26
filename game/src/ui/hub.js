// Хаб-лавка: одна большая картинка с интерактивными объектами.
import { ALL_PUZZLES, unseenShopItems, currentSeason, SEASON_LABEL, petTheCat, shopStock } from '../core/state.js';
import { itemsForShop } from '../data/shop.js';

// Есть ли новинки в конкретной лавке площади
function hasUnseenIn(state, shopKey) {
  const unseen = new Set(unseenShopItems(state).map((i) => i.id));
  return itemsForShop(state, shopKey, shopStock(state)).some((i) => unseen.has(i.id));
}
import { COMPANION_BY_ID, PET_BY_ID } from '../data/crew.js';
import { BATTLES, BATTLE_BY_ID } from '../data/battles.js';
import { TROPHIES, MINI_TROPHIES } from '../data/trophies.js';
import { storyHubGuest } from '../core/storyEngine.js';
import { GUEST_BY_ID } from '../data/guests.js';
import { showOverlay } from './common.js';
import { startTutorial } from './tutorial.js';
import { applyCursor } from './cursors.js';
import { onboardingBlocksStory, onboardingBlocksLegacyTutorials } from '../core/onboarding.js';
import { createSavingsGoalCard } from './goalView.js';
import { mergeSceneLayout, scenePolygonGeometry } from '../core/hubGeometry.js';
import { resolveCosmeticBackground, BASE_LAVKA_BACKGROUND, LAVKA_LAYOUT_ID } from '../core/cosmetics.js';
import { LAVKA_COSMETIC_LAYOUTS } from '../data/cosmetics.js';

// Реплики спутников и питомцев для дневника (случайная при визите)
const CHATTER = {
  cmp_firefly: ['✨ Светлячок кружит над полками: «Тут красиво!»', '✨ Светлячок подсвечивает самое тёмное место.'],
  cmp_herbalist: ['🌿 Травница сушит новый сбор над очагом.', '🌿 «К котлу бы мяты…» — травница заглядывает в чайник.'],
  cmp_cat: ['🐈 Кот-хранитель обходит полки — всё на месте.', '🐈 Кот что-то уронил и делает вид, что так и было.'],
  cmp_smith: ['⚒️ Кузнец-подмастерье точит инструмент у окна.', '⚒️ «Броню бы подтянуть» — бормочет кузнец.'],
  pet_puppy: ['🐕 Щенок принёс палку. Очень важную палку.', '🐕 Щенок виляет хвостом всей лавке.'],
  pet_hedgehog: ['🦔 Ёжик свернулся в тапке. Это его тапок теперь.', '🦔 Ёжик фыркает на буханку.'],
  pet_fox: ['🦊 Лисёнок примеряет твоё шляпное место у кассы.', '🦊 Лисёнок что-то прячет за прилавком.'],
  pet_horse: ['🐴 Сивка фыркает у двери — скучает по дороге.', '🐴 Сивка обгладывает веник. Хороший был веник.'],
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

// Размер спрайта на сцене: до базовой ширины (~1028px) — как раньше в px,
// на широких экранах — пропорционально сцене (cqw = % ширины .hub-picture)
const spr = (px) => `max(${px}px, ${(px / 10.28).toFixed(2)}cqw)`;

// Силуэты лавки размечены по hub_banner_web.jpg (2172×724), в процентах сцены.
// Это рабочие пользовательские координаты; прилавок имеет выемку вокруг аналоя.
export const LAVKA_HOTSPOT_SHAPES = {
  puzzles: [
    [3.5, 0], [16.3, 0], [17.4, 8], [17.4, 68], [16.3, 72],
    [16.3, 82], [13.8, 86], [8.5, 86], [7.5, 80], [3.4, 77],
  ],
  shop: [
    [24.2, 52.8], [51.2, 52.8], [52.4, 55.5], [51.7, 75.5],
    [50.5, 77], [48.7, 77], [48.7, 55.5], [39.5, 55.5],
    [39.5, 77], [25.2, 77], [24.3, 74.5], [23.5, 56],
  ],
  guests: [
    [46.8, 55.5], [48.2, 57], [47.8, 62], [48.5, 64.5],
    [47.5, 68.5], [45.8, 69.5], [45.8, 87], [47.5, 89],
    [47.2, 92.5], [41, 92.5], [40.5, 90], [42.2, 87],
    [42.2, 70], [40, 68.5], [39.6, 64], [41.3, 60.5],
    [45.8, 60], [46.2, 57.5],
  ],
  equip: [
    [53.8, 26.5], [55.2, 26.5], [56, 29], [55.8, 33.5],
    [57.2, 35], [58, 40], [57.5, 47], [56.6, 52.5],
    [52.4, 52.5], [51.5, 47], [51.2, 40], [52, 36],
    [53.2, 33.5], [53.2, 29],
  ],
  '@square': [
    [75.2, 30], [76.2, 25], [78, 22], [80.5, 21], [82.5, 24],
    [84, 29], [84.8, 36], [84.8, 78], [83.5, 82], [76.5, 82],
    [75.2, 78], [74.8, 38],
  ],
  battles: [
    [88.2, 0], [100, 0], [100, 65.5], [98, 68], [89, 66], [87.2, 62], [87.2, 14],
  ],
  '@cabinet': [
    [65.2, 62], [65.8, 58], [67.2, 55.5], [69.2, 55], [70.8, 57.5],
    [71.6, 61], [71.6, 75.5], [65, 75.5], [64.8, 68],
  ],
};

const LAVKA_BASE_SPRITE_SPOTS = {
  pet_puppy: { x: 88, y: 92 },
  cmp_cat: { x: 26, y: 89 },
  cmp_firefly: { x: 47, y: 13 },
  story_guest: { x: 57, y: 90 },
};
const LAVKA_BASE_LAYOUT = {
  hotspots: LAVKA_HOTSPOT_SHAPES,
  sprites: LAVKA_BASE_SPRITE_SPOTS,
};
export const LAVKA_LAYOUTS = {
  [LAVKA_LAYOUT_ID]: LAVKA_BASE_LAYOUT,
  ...Object.fromEntries(Object.entries(LAVKA_COSMETIC_LAYOUTS).map(([id, layout]) => [
    id,
    mergeSceneLayout(LAVKA_BASE_LAYOUT, layout),
  ])),
};
export const LAVKA_LAYOUT_SHAPES = Object.fromEntries(
  Object.entries(LAVKA_LAYOUTS).map(([id, layout]) => [id, layout.hotspots]),
);

// V2 размечены по фактическим runtime-изображениям 2400×800. Координаты не
// наследуются от старых сцен: при error включается отдельный legacy-layout.
export const SQUARE_V2_HOTSPOT_SHAPES = {
  board: [[1.5, 35], [5, 31], [10, 36], [11.5, 42], [11, 75], [8, 78], [1, 77], [0.5, 55]],
  '@lavka': [[12, 28], [18, 18], [22, 9], [26, 15], [31, 16], [34, 28], [34, 62], [31, 66], [15, 66], [12, 58]],
  craft: [[35, 27], [39, 20], [44, 17], [45.5, 8], [48.5, 8], [49.2, 31], [51, 35], [49.5, 53], [43, 53], [43, 63], [35, 63]],
  workshop: [[52.5, 28], [57, 21], [63, 24], [67, 30], [69, 39], [69, 63], [60, 63], [60, 55], [55, 55], [55, 52], [52, 52]],
  '@market': [[70.5, 32], [74, 28], [80, 28], [83, 33], [83.5, 61], [81, 64], [71, 63], [69.5, 47]],
  tavern: [[88, 0], [100, 0], [100, 68], [84, 68], [84, 54], [84, 36]],
};

export const MARKET_V2_HOTSPOT_SHAPES = {
  shopArmory: [[0, 0], [10, 0], [18, 7], [24.5, 18], [24.5, 78], [22, 88], [0, 88]],
  shopArmorer: [[24.5, 0], [34, 0], [41, 8], [44, 20], [44, 82], [41, 87], [27, 87], [24.5, 70]],
  shopMagic: [[58, 9], [64, 0], [73, 0], [78, 12], [78, 82], [75, 88], [59, 88], [57, 70]],
  shopAlchemy: [[81, 0], [100, 0], [100, 90], [79, 90], [78, 74], [78, 20]],
  '@square': [
    [44, 68], [44, 45], [45, 30], [44, 20], [46, 15], [46, 5],
    [50, 1], [55, 1], [57, 8], [56, 18], [57, 35], [57, 68], [57, 100], [44, 100],
  ],
};

export const CABINET_V2_HOTSPOT_SHAPES = {
  achievements: [[2.5, 74], [8, 70], [14, 72], [20, 70], [24, 76], [23, 85], [18, 90], [8, 92], [2, 86]],
  battles: [[10.7, 16.5], [22.4, 16.5], [22.4, 44.5], [10.7, 44.5]],
  deck: [[87, 76], [93, 73], [98, 76], [97.5, 85], [94, 89], [87, 87]],
  '@lavka': [[80.5, 12], [84, 6], [90, 5], [94, 11], [95, 24], [95, 70], [92, 73], [81, 73], [80, 58]],
};

const CABINET_V2_COLUMNS = [28, 36.7, 45.4, 54.2, 62.9, 71.7];
export const CABINET_V2_TROPHY_SPOTS = [
  ...CABINET_V2_COLUMNS.map((x) => ({ x, y: 35, size: 52 })),
  ...CABINET_V2_COLUMNS.map((x) => ({ x, y: 64, size: 52 })),
];
export const CABINET_V2_MINI_SPOTS = [41.7, 46.9, 52.3, 57.6]
  .map((x) => ({ x, y: 79, size: 30 }));

export function renderHub(container, ctx, params = {}) {
  const { state } = ctx;

  const solved = Object.keys(state.puzzlesDone).length;
  const won = Object.keys(state.battlesDone).length;
  const firstPurchaseDone = (state.stats.itemsBought || 0) > 0;

  function rerender(scene) {
    ctx.setHubScene?.(scene);
    container.innerHTML = '';
    renderHub(container, ctx, { scene });
    ctx.syncOnboarding?.();
  }

  // --- Сцены хаба: уютная лавка и городская площадь ---
  const SCENES = {
    lavka: {
      candidates: ['assets/hub/hub_banner_web.jpg'],
      layoutId: 'lavka_base_3x1',
      shapes: LAVKA_HOTSPOT_SHAPES,
      alt: 'Лавка на перекрёстке миров',
      // [icon, label, screen, x%, y%, showDot]; x/y — только legacy-круги.
      hotspots: [
        ['📚', 'Головоломки', 'puzzles', 10, 42, () => solved === 0],
        ['🪙', 'Прилавок', 'shop', 37, 60, () => false],
        ['📖', 'Гостевая книга', 'guests', 44, 66, () => false],
        ['🛡️', 'Комната рыцаря', 'equip', 55, 42, () => false],
        ['🌆', 'На площадь', '@square', 80, 52, () => false],
        ['🪟', 'В поход', 'battles', 94, 32, () => firstPurchaseDone && won === 0],
        ['🦌', 'Кабинет трофеев', '@cabinet', 68, 62, () => (state.trophies || []).some((id) => !(state.trophiesSeen || []).includes(id))],
      ],
    },
    square: {
      candidates: ['assets/hub/town_square_v2_web.jpg', 'assets/hub/town_square_web.jpg'],
      layoutId: 'square_v2_3x1',
      legacyLayoutId: 'square_legacy_3x1',
      shapes: SQUARE_V2_HOTSPOT_SHAPES,
      alt: 'Городская площадь',
      hotspots: [
        ['📌', 'Доска объявлений', 'board', 7, 59, () => false],
        ['🏮', 'В лавку', '@lavka', 17, 50, () => false],
        ['⚒️', 'Кузница и котёл', 'craft', 39, 58, () => false],
        ['🛠️', 'Мастерская', 'workshop', 53, 68, () => false],
        ['🏬', 'Торговый квартал', '@market', 58, 38, () => ['armory', 'armorer', 'magic', 'alchemy'].some((k) => hasUnseenIn(state, k))],
        ['🍺', 'Таверна', 'tavern', 79, 60, () => false],
      ],
    },
    market: {
      candidates: ['assets/hub/town_market_v2_web.jpg', 'assets/hub/town_market_web.jpg'],
      layoutId: 'market_v2_3x1',
      legacyLayoutId: 'market_legacy_3x1',
      shapes: MARKET_V2_HOTSPOT_SHAPES,
      alt: 'Торговый квартал',
      hotspots: [
        ['🗡️', 'Оружейник', 'shopArmory', 7, 60, () => hasUnseenIn(state, 'armory')],
        ['🛡️', 'Бронник', 'shopArmorer', 35, 60, () => hasUnseenIn(state, 'armorer')],
        ['🌇', 'На площадь', '@square', 52, 60, () => false],
        ['🔮', 'Маг', 'shopMagic', 63, 62, () => hasUnseenIn(state, 'magic')],
        ['🧪', 'Алхимик', 'shopAlchemy', 80, 60, () => hasUnseenIn(state, 'alchemy')],
      ],
    },
    cabinet: {
      candidates: ['assets/hub/trophy_room_v2_web.jpg', 'assets/hub/trophy_room_web.jpg'],
      layoutId: 'cabinet_v2_3x1',
      legacyLayoutId: 'cabinet_legacy_3x1',
      shapes: CABINET_V2_HOTSPOT_SHAPES,
      alt: 'Кабинет трофеев',
      hotspots: [
        ['📖', 'Книга рекордов', 'achievements', 87.5, 64, () => false],
        ['🗺️', 'Карта миров', 'battles', 87, 33, () => false],
        ['🃏', 'Колода судьбы', 'deck', 12, 55, () => false],
        ['🏮', 'В лавку', '@lavka', 50, 92, () => false],
      ],
    },
  };

  const sceneId = params.scene || 'lavka';
  const scene = SCENES[sceneId] || SCENES.lavka;
  applyCursor('hub', { scene: sceneId }, state);

  const scenePanel = document.createElement('div');
  scenePanel.className = 'panel hub-picture';
  scenePanel.dataset.scene = sceneId;
  scenePanel.dataset.layoutId = scene.layoutId;
  scenePanel.dataset.layoutMode = 'primary';
  scenePanel.style.padding = '0';
  scenePanel.style.overflow = 'hidden';
  scenePanel.style.aspectRatio = '3 / 1';
  let cosmeticBackground = null;
  let effectiveLavkaLayoutId = LAVKA_LAYOUT_ID;
  if (sceneId === 'lavka') {
    const resolved = resolveCosmeticBackground(state, { scene: 'lavka' });
    const knownLayout = !!LAVKA_LAYOUT_SHAPES[resolved.layoutId];
    cosmeticBackground = knownLayout ? resolved : {
      ...resolved,
      src: BASE_LAVKA_BACKGROUND,
      layoutId: LAVKA_LAYOUT_ID,
      full: false,
      id: null,
    };
    effectiveLavkaLayoutId = cosmeticBackground.full ? LAVKA_LAYOUT_ID : cosmeticBackground.layoutId;
    scenePanel.dataset.layoutId = effectiveLavkaLayoutId;
  }
  const legacyLayer = cosmeticBackground?.legacyIds.length ? document.createElement('div') : null;
  if (legacyLayer) {
    legacyLayer.className = 'hub-legacy-cosmetics';
    legacyLayer.dataset.legacyCosmetics = cosmeticBackground.legacyIds.join(' ');
  }
  const picture = document.createElement('img');
  picture.className = 'hub-scene';
  picture.alt = scene.alt;
  const candidates = [cosmeticBackground?.src || scene.candidates[0], ...scene.candidates.slice(1)];
  let candidateIdx = 0;
  const trophyEls = [];
  const sceneSpriteEls = [];
  const smokeEls = [];
  const usingLegacyLayout = () => Boolean(scene.legacyLayoutId && candidateIdx > 0);
  function applySceneLayout() {
    const legacy = usingLegacyLayout();
    scenePanel.dataset.layoutId = legacy ? scene.legacyLayoutId
      : (sceneId === 'lavka' ? effectiveLavkaLayoutId : scene.layoutId);
    scenePanel.dataset.layoutMode = legacy ? 'legacy' : 'primary';
    renderHotspots();
    layoutTrophies();
    layoutSceneSprites();
    layoutAtmosphere();
  }
  let currentSrc = candidates[0];
  const setPictureSrc = (src) => {
    currentSrc = src;
    picture.src = src;
  };
  const legacyMode = () => cosmeticBackground?.legacyIds.length ? 'legacy' : 'base';
  if (cosmeticBackground) scenePanel.dataset.cosmeticMode = cosmeticBackground.full ? 'pending' : legacyMode();
  picture.addEventListener('load', () => {
    if (!cosmeticBackground) return;
    const fullLoaded = cosmeticBackground.full && currentSrc === cosmeticBackground.src;
    effectiveLavkaLayoutId = fullLoaded ? cosmeticBackground.layoutId : LAVKA_LAYOUT_ID;
    if (fullLoaded) {
      legacyLayer?.remove();
      scenePanel.dataset.cosmeticMode = 'full';
    } else {
      if (legacyLayer && !legacyLayer.parent) scenePanel.appendChild(legacyLayer);
      scenePanel.dataset.cosmeticMode = legacyMode();
    }
    applySceneLayout();
    ctx.syncOnboarding?.();
  });
  picture.addEventListener('error', () => {
    if (cosmeticBackground && currentSrc !== BASE_LAVKA_BACKGROUND) {
      effectiveLavkaLayoutId = LAVKA_LAYOUT_ID;
      scenePanel.dataset.cosmeticMode = legacyMode();
      setPictureSrc(BASE_LAVKA_BACKGROUND);
      if (legacyLayer && !legacyLayer.parent) scenePanel.appendChild(legacyLayer);
      applySceneLayout();
      ctx.syncOnboarding?.();
      return;
    }
    const wasLegacy = usingLegacyLayout();
    candidateIdx += 1;
    if (candidateIdx < candidates.length) {
      setPictureSrc(candidates[candidateIdx]);
      if (wasLegacy !== usingLegacyLayout()) {
        applySceneLayout();
        ctx.syncOnboarding?.();
      }
    } else {
      picture.remove();
      scenePanel.classList.add('hub-scene-missing');
    }
  });
  setPictureSrc(candidates[0]);
  scenePanel.appendChild(picture);
  if (legacyLayer) scenePanel.appendChild(legacyLayer);
  container.appendChild(scenePanel);

  const hotspotRoot = document.createElement('div');
  hotspotRoot.className = 'hub-hotspot-layout';
  scenePanel.appendChild(hotspotRoot);
  const hotspotEls = {};
  const activateHotspot = (screen, source) => {
    ctx.sfx?.('tap');
    (hotspotEls[screen] || source).classList.add('zap');
    setTimeout(() => {
      if (screen === '@square') rerender('square');
      else if (screen === '@lavka') rerender('lavka');
      else if (screen === '@market') rerender('market');
      else if (screen === '@cabinet') rerender('cabinet');
      else ctx.go(screen);
    }, 150);
  };
  const span = (className, text) => {
    const el = document.createElement('span');
    el.className = className;
    el.textContent = text;
    return el;
  };
  function renderHotspots() {
    hotspotRoot.innerHTML = '';
    for (const key of Object.keys(hotspotEls)) delete hotspotEls[key];
    const shapes = usingLegacyLayout() ? null
      : (sceneId === 'lavka' ? LAVKA_LAYOUT_SHAPES[effectiveLavkaLayoutId] : scene.shapes);
    for (const [, label, screen, x, y, dot] of scene.hotspots) {
      const geometry = shapes?.[screen] ? scenePolygonGeometry(shapes[screen]) : null;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = geometry ? 'hotspot hub-shape' : 'hotspot';
      b.dataset.hotspot = screen;
      b.setAttribute('aria-label', label);
      b.addEventListener('click', () => activateHotspot(screen, b));
      hotspotEls[screen] = b;

      const labelEl = span('hs-label', label);
      const dotEl = dot() ? span('hs-dot', '') : null;
      if (geometry) {
        const holder = document.createElement('div');
        holder.className = 'hub-shape-hotspot';
        b.style.left = `${geometry.left}%`;
        b.style.top = `${geometry.top}%`;
        b.style.width = `${geometry.width}%`;
        b.style.height = `${geometry.height}%`;
        b.style.clipPath = geometry.polygon;
        b.style.webkitClipPath = geometry.polygon;
        labelEl.style.left = `${geometry.labelAnchor.x}%`;
        labelEl.style.top = `${geometry.labelAnchor.y}%`;
        holder.append(b, labelEl);
        if (dotEl) {
          dotEl.classList.add('hub-shape-dot');
          dotEl.style.left = `${geometry.center.x}%`;
          dotEl.style.top = `${geometry.top}%`;
          holder.appendChild(dotEl);
        }
        hotspotRoot.appendChild(holder);
      } else {
        b.style.left = `${x}%`;
        b.style.top = `${y}%`;
        b.appendChild(labelEl);
        if (dotEl) b.appendChild(dotEl);
        hotspotRoot.appendChild(b);
      }
    }
  }
  function currentTrophySpots() {
    if (sceneId !== 'cabinet') return [];
    if (usingLegacyLayout()) {
      // Старая формула сохраняется только для legacy-файла.
      const trophies = TROPHIES.map((t, i) => ({
        t, x: 29.7 + (i % 6) * 8.4, y: i < 6 ? 35 : 61.5, size: 52,
      }));
      const minis = MINI_TROPHIES.map((t, i) => ({ t, x: 42 + i * 5.5, y: 76.5, size: 30 }));
      return [...trophies, ...minis];
    }
    return [
      ...TROPHIES.map((t, i) => ({ t, ...CABINET_V2_TROPHY_SPOTS[i] })),
      ...MINI_TROPHIES.map((t, i) => ({ t, ...CABINET_V2_MINI_SPOTS[i] })),
    ];
  }
  function layoutTrophies() {
    const spots = currentTrophySpots();
    for (let i = 0; i < trophyEls.length; i += 1) {
      trophyEls[i].style.left = `${spots[i].x}%`;
      trophyEls[i].style.top = `${spots[i].y}%`;
    }
  }
  function positionedSpot(spot, spriteId) {
    const position = !usingLegacyLayout() && spot.v2 ? { ...spot, ...spot.v2 } : spot;
    if (sceneId !== 'lavka' || usingLegacyLayout() || !spriteId) return position;
    return { ...position, ...LAVKA_LAYOUTS[effectiveLavkaLayoutId]?.sprites?.[spriteId] };
  }
  function layoutSceneSprites() {
    for (const { el, spot, spriteId } of sceneSpriteEls) {
      const position = positionedSpot(spot, spriteId);
      el.style.left = `${position.x}%`;
      el.style.top = `${position.y}%`;
    }
  }
  function layoutAtmosphere() {
    for (let i = 0; i < smokeEls.length; i += 1) {
      smokeEls[i].style.left = `${usingLegacyLayout() ? 33 + i : 46.3 + i * 0.9}%`;
      smokeEls[i].style.top = `${usingLegacyLayout() ? 16 : 11 - i * 1.5}%`;
    }
  }
  renderHotspots();

  // Текстовые маршруты доступны без наведения и остаются крупными на тач-экранах.
  const textNav = document.createElement('nav');
  textNav.className = 'hub-text-nav';
  textNav.setAttribute('aria-label', `Разделы: ${scene.alt}`);
  const highlightHotspot = (screen, active) => {
    const hotspot = hotspotEls[screen];
    if (hotspot) hotspot.classList[active ? 'add' : 'remove']('nav-highlight');
  };
  for (const [icon, label, screen] of scene.hotspots) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ghost';
    b.dataset.hubRoute = screen;
    b.textContent = `${icon} ${label}`;
    b.addEventListener('pointerenter', () => highlightHotspot(screen, true));
    b.addEventListener('pointerleave', () => highlightHotspot(screen, false));
    b.addEventListener('focus', () => highlightHotspot(screen, true));
    b.addEventListener('blur', () => highlightHotspot(screen, false));
    b.addEventListener('click', () => activateHotspot(screen, b));
    textNav.appendChild(b);
  }
  container.appendChild(textNav);

  // Прогресс-подпись под картинкой (+ сезон и выбранное оформление)
  const progress = document.createElement('div');
  progress.className = 'muted center mt';
  progress.style.fontSize = '14px';
  const season = SEASON_LABEL[currentSeason()];
  const cosIcons = (state.cosmeticsActive || []).length
    ? ` · Оформление: ${(state.cosmeticsActive || []).map((id) => ({ cos_carpet: '🟥', cos_crest: '🪧', cos_flowers: '🌸', cos_fireflies: '✨', cos_garland: '🎏', cos_snow: '❄️' })[id] || '🎀').join(' ')}`
    : '';
  progress.innerHTML = `🧩 Загадок решено: <b>${solved}/${ALL_PUZZLES.length}</b> · ⚔️ Походов пройдено: <b>${won}/${BATTLES.length}</b> · 🐾 Команда: <b>${(state.crew || []).length}</b> · ${season}${cosIcons}`;
  container.appendChild(progress);

  // Необязательная цель живёт под сценой и не меняет её координаты или спрайты.
  const goalCard = createSavingsGoalCard(ctx, { onChange: () => rerender(sceneId) });
  if (goalCard) container.appendChild(goalCard);

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

  // Питомцы — все купленные, каждый на своём месте в своей сцене.
  // Картинка assets/pets/<id>.webp; если её нет — иконка-фолбэк.
  const PET_SPOTS = {
    pet_hedgehog: { scene: 'square', x: 30, y: 82, size: 50, v2: { x: 50, y: 84 } },
    pet_fox: { scene: 'square', x: 9, y: 97, size: 60 },
    pet_puppy: { scene: 'lavka', ...LAVKA_BASE_SPRITE_SPOTS.pet_puppy, size: 92, flip: true },
    pet_owl: { scene: 'square', x: 7, y: 44, size: 64, v2: { x: 7.5, y: 35, size: 52 } },
    pet_horse: { scene: 'square', x: 90, y: 90, size: 130 },
  };
  for (const [petId, spot] of Object.entries(PET_SPOTS)) {
    if (spot.scene !== sceneId || !(state.crew || []).includes(petId) || !PET_BY_ID[petId]) continue;
    const def = PET_BY_ID[petId];
    const isActive = state.pet === petId;
    const el = document.createElement('button');
    sceneSpriteEls.push({ el, spot, spriteId: petId });
    const position = positionedSpot(spot, petId);
    el.type = 'button';
    el.className = `hub-pet${isActive ? ' active' : ''}`;
    el.dataset.sprite = petId;
    el.style.left = `${position.x}%`;
    el.style.top = `${position.y}%`;
    el.title = isActive ? `${def.name} — идёт с тобой в походы` : def.name;
    el.setAttribute('aria-label', el.title);
    const img = document.createElement('img');
    img.src = `assets/pets/${petId}.webp`;
    img.alt = def.name;
    img.style.width = spr(position.size);
    if (spot.flip) img.style.transform = 'scaleX(-1)';
    img.addEventListener('error', () => {
      img.remove();
      el.textContent = def.icon;
      el.style.fontSize = spr(Math.round(position.size * 0.7));
    });
    el.appendChild(img);
    el.addEventListener('click', () => {
      ctx.sfx?.('tap');
      const lines = CHATTER[petId] || [def.name];
      ctx.toast(lines[Math.floor(Math.random() * lines.length)]);
    });
    scenePanel.appendChild(el);
  }

  // Кот-хранитель (после найма, клик = погладить) и спутники —
  // появляются, когда наняты (активность в отряде не обязательна).
  // Картинка assets/crew/<id>.webp; если её нет — иконка-фолбэк.
  const CREW_SPOTS = [
    { id: 'cmp_cat', icon: '🐈', name: 'Кот-хранитель — погладить', scene: 'lavka', ...LAVKA_BASE_SPRITE_SPOTS.cmp_cat, size: 85, pet: true },
    { id: 'cmp_firefly', scene: 'lavka', ...LAVKA_BASE_SPRITE_SPOTS.cmp_firefly, size: 26 },
    { id: 'cmp_herbalist', scene: 'square', x: 21, y: 97, size: 85 },
    { id: 'cmp_smith', scene: 'square', x: 45, y: 86, size: 50, v2: { x: 36, y: 88 } },
  ];
  for (const spot of CREW_SPOTS) {
    const owned = spot.always || (state.crew || []).includes(spot.id);
    if (spot.scene !== sceneId || !owned) continue;
    const def = COMPANION_BY_ID[spot.id];
    const name = spot.name || def?.name || spot.id;
    const icon = spot.icon || def?.icon || '🐾';
    const el = document.createElement('button');
    sceneSpriteEls.push({ el, spot, spriteId: spot.id });
    const position = positionedSpot(spot, spot.id);
    el.type = 'button';
    el.className = 'hub-pet';
    el.dataset.sprite = spot.id;
    el.style.left = `${position.x}%`;
    el.style.top = `${position.y}%`;
    el.title = name;
    el.setAttribute('aria-label', name);
    const img = document.createElement('img');
    img.src = `assets/crew/${spot.id}.webp`;
    img.alt = name;
    img.style.width = spr(spot.size);
    if (spot.flip) img.style.transform = 'scaleX(-1)';
    img.addEventListener('error', () => {
      img.remove();
      el.textContent = icon;
      el.style.fontSize = spr(Math.round(spot.size * 0.7));
    });
    el.appendChild(img);
    el.addEventListener('click', () => {
      if (spot.pet) { petCat(el); return; }
      ctx.sfx?.('tap');
      const lines = CHATTER[spot.id] || [name];
      ctx.toast(lines[Math.floor(Math.random() * lines.length)]);
    });
    scenePanel.appendChild(el);
  }

  // --- Гость режима истории: ждёт в лавке с заданием, клик = сцена-монолог.
  // Портрет — арт из assets/fate/, фолбэк — эмодзи (как у питомцев выше).
  const STORY_GUEST_SPOT = { scene: 'lavka', ...LAVKA_BASE_SPRITE_SPOTS.story_guest, size: 110 };
  const storyGuestId = onboardingBlocksStory(state) ? null : storyHubGuest(state);
  if (storyGuestId && STORY_GUEST_SPOT.scene === sceneId) {
    const g = GUEST_BY_ID[storyGuestId];
    if (g) {
      const el = document.createElement('button');
      const position = positionedSpot(STORY_GUEST_SPOT, 'story_guest');
      sceneSpriteEls.push({ el, spot: STORY_GUEST_SPOT, spriteId: 'story_guest' });
      el.type = 'button';
      el.className = 'hub-pet hub-guest';
      el.dataset.sprite = 'story_guest';
      el.style.left = `${position.x}%`;
      el.style.top = `${position.y}%`;
      el.title = `${g.name} — ждёт с заданием`;
      el.setAttribute('aria-label', el.title);
      if (g.art) {
        const img = document.createElement('img');
        img.src = g.art;
        img.alt = g.name;
        img.style.width = spr(position.size);
        img.addEventListener('error', () => {
          img.remove();
          el.textContent = g.icon;
          el.style.fontSize = spr(Math.round(position.size * 0.7));
        });
        el.appendChild(img);
      } else {
        el.textContent = g.icon;
        el.style.fontSize = spr(Math.round(position.size * 0.7));
      }
      const dot = document.createElement('span');
      dot.className = 'hs-dot hub-guest-dot';
      el.appendChild(dot);
      el.addEventListener('click', () => { ctx.sfx?.('page'); ctx.go('story'); });
      scenePanel.appendChild(el);
    }
  }

  // --- Кабинет трофеев: места на стене (12 боссов) и полка жетонов (розыск).
  // Закрытый трофей — полупрозрачный силуэт; клик по открытому — карточка с лором.
  if (sceneId === 'cabinet') {
    // Визит в кабинет гасит точку-индикатор на двери
    const unseen = (state.trophies || []).filter((id) => !(state.trophiesSeen || []).includes(id));
    if (unseen.length > 0) {
      state.trophiesSeen = [...(state.trophiesSeen || []), ...unseen];
      ctx.save();
    }
    // Активный layout выбирает ниши по v2-арту либо прежнюю формулу для legacy.
    const spots = currentTrophySpots();
    for (const spot of spots) {
      const owned = (state.trophies || []).includes(spot.t.id);
      const el = document.createElement('button');
      el.type = 'button';
      el.className = `hub-trophy${owned ? '' : ' locked'}`;
      el.style.left = `${spot.x}%`;
      el.style.top = `${spot.y}%`;
      el.title = owned ? spot.t.name : '???';
      el.setAttribute('aria-label', owned ? spot.t.name : 'Пустое место для трофея — узнать условие');
      if (owned) {
        const img = document.createElement('img');
        img.src = `assets/trophies/tro_${spot.t.id}.png`;
        img.alt = spot.t.name;
        img.style.width = spr(spot.size);
        img.addEventListener('error', () => {
          img.remove();
          el.textContent = spot.t.icon;
          el.style.fontSize = spr(Math.round(spot.size * 0.7));
        });
        el.appendChild(img);
      } else {
        el.textContent = '❔';
        el.style.fontSize = spr(Math.round(spot.size * 0.6));
      }
      el.addEventListener('click', () => {
        ctx.sfx?.('tap');
        if (!owned) {
          const battle = BATTLE_BY_ID[spot.t.battleId];
          ctx.toast(`Пустое место. Сюда встанет трофей за победу: «${battle?.name || '?'}».`);
          return;
        }
        const wins = state.battlesDone[spot.t.battleId]?.victories || 1;
        showOverlay(ctx, {
          title: `${spot.t.icon} ${spot.t.name}`,
          subtitle: `${spot.t.lore}<br><br>Побед в бою «${BATTLE_BY_ID[spot.t.battleId]?.name || ''}»: ${wins}`,
          buttons: [{ label: 'Закрыть', primary: true, onClick: () => {} }],
        });
      });
      scenePanel.appendChild(el);
      trophyEls.push(el);
    }
  }

  // --- Прежние спрайты оформления (только fallback) и атмосфера сцен ---
  const fx = (cls, style, content, root = scenePanel) => {
    const e = document.createElement('div');
    e.className = `cos-fx ${cls}`;
    e.style.cssText = style;
    if (content) e.innerHTML = content;
    root.appendChild(e);
    return e;
  };
  const legacyFx = (cls, style, content) => fx(cls, style, content, legacyLayer);
  // Старый арт остаётся до готовности полного фона: .webp → исходный .png → CSS-заглушка.
  // load выбранного фона удаляет весь legacyLayer, поэтому старые предметы не дублируются.
  const fxImg = (id, style, stub, rot) => {
    if (!legacyLayer) return null;
    const img = document.createElement('img');
    img.className = 'cos-fx cos-img';
    img.style.cssText = style + (rot ? `;transform:rotate(${rot}deg)` : '');
    img.alt = '';
    img.addEventListener('error', () => {
      if (img.src.endsWith('.webp')) { img.src = `assets/cosmetics/${id}.png`; return; }
      img.remove();
      stub?.();
    });
    img.src = `assets/cosmetics/${id}.webp`;
    legacyLayer.appendChild(img);
    return img;
  };
  if (sceneId === 'lavka') {
    const cos = new Set(cosmeticBackground.legacyIds);
    if (cos.has('cos_carpet')) {
      fxImg('cos_carpet', 'left:52%;top:74%;width:30%', () => legacyFx('cos-carpet', 'left:36%;top:78%;width:26%;height:16%'), 10);
    }
    if (cos.has('cos_crest')) {
      // Текст зашит в картинку (генерация), подложки больше нет
      fxImg('cos_crest', 'left:71%;top:9%;width:max(85px, 8.27cqw)', () => legacyFx('cos-crest', 'left:38%;top:4%', 'Лавка на перекрёстке миров'),-4);
    }
    if (cos.has('cos_flowers')) {
      const spots = [
        //['left:24%;top:20%;width:60px', () => legacyFx('sway', 'left:11%;top:33%;font-size:26px', '🌸')],
        ['left:50%;top:76%;width:max(74px, 7.2cqw)', () => legacyFx('sway', 'left:22%;top:60%;font-size:22px;animation-delay:.5s', '🌷')],
        //['left:60%;top:41%;width:60px', () => legacyFx('sway', 'left:63%;top:44%;font-size:24px;animation-delay:1s', '🌼')],
      ];
      for (const [style, stub] of spots) {
        fxImg('cos_flowers', style + ';animation:fx-sway 3.6s ease-in-out infinite alternate', stub);
      }
    }
    if (cos.has('cos_fireflies')) {
      fxImg('cos_fireflies', 'left:22%;top:22%;width:max(80px, 7.78cqw);animation:fx-float 5s ease-in-out infinite alternate', () => {
        for (let i = 0; i < 5; i++) legacyFx('firefly', `left:${35 + i * 7}%;top:${38 + (i % 3) * 8}%;animation-delay:${i * 0.7}s`);
      });
    }
    if (cos.has('cos_garland')) {
      fxImg('cos_garland', 'left:60%;top:20%;width:32%;animation:fx-sway 4s ease-in-out infinite alternate;transform-origin:top center', () => legacyFx('sway', 'left:12%;top:3%;width:60%;font-size:20px;letter-spacing:12px', '🎏🍂🎏🍂🎏🍂🎏'));
    }
    if (cos.has('cos_snow')) {
      fxImg('cos_snow', 'left:89%;top:30%;width:8%', () => {
        for (let i = 0; i < 8; i++) legacyFx('snowflake', `left:${86 + (i % 4) * 3.5}%;top:${28 + i * 6}%;animation-delay:${i * 0.5}s`, '❄');
      });
    }
    // Пыльинки в лучах света — атмосфера, не предметный legacy-оверлей.
    for (let i = 0; i < 6; i++) fx('dust', `left:${20 + i * 12}%;top:${22 + (i % 3) * 14}%;animation-delay:${i * 0.9}s`);
  }
  if (sceneId === 'square') {
    // V2: высокая труба у x47%; legacy-координаты восстанавливает layoutAtmosphere.
    for (let i = 0; i < 3; i++) {
      smokeEls.push(fx('smokepuff', `left:${33 + i}%;top:16%;animation-delay:${i * 1.3}s`));
    }
    layoutAtmosphere();
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

  // Прежнее знакомство не дублирует проводник первой дуги.
  if (sceneId === 'lavka' && !onboardingBlocksLegacyTutorials(state)) {
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
