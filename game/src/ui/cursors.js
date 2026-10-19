// Тематические курсоры: у каждого режима игры свой PNG-курсор из assets/cursors/.
// Тема выставляется как body[data-cursor="<key>"], сами правила — в styles.css
// (cursor: url(...) x y, fallback). Пока PNG нет — браузер молча использует fallback.
// hotspot — точка клика в сетке 32×32; держать синхронно со styles.css и art-src/PROMPTS.md.
import { findPuzzle } from '../core/state.js';

export const CURSOR_THEMES = {
  default: { hotspot: [4, 28], name: 'Перо хозяина', icon: '🪶' },
  hub_lavka: { hotspot: [8, 4], name: 'Фонарик лавки', icon: '🏮' },
  hub_square: { hotspot: [6, 4], name: 'Уличный фонарь', icon: '🌇' },
  hub_market: { hotspot: [16, 4], name: 'Весы торговца', icon: '⚖️' },
  hub_cabinet: { hotspot: [16, 6], name: 'Кубок трофеев', icon: '🏆' },
  mirror: { hotspot: [8, 6], name: 'Зеркальце', icon: '🪞' },
  shelf: { hotspot: [10, 6], name: 'Кувшин с полки', icon: '🏺' },
  riddle: { hotspot: [8, 6], name: 'Свиток загадок', icon: '📜' },
  hang: { hotspot: [4, 28], name: 'Чернильное перо', icon: '🖋️' },
  seek: { hotspot: [12, 12], name: 'Лупа', icon: '🔍' },
  path: { hotspot: [5, 5], name: 'Ботинок путника', icon: '🥾' },
  tea: { hotspot: [16, 8], name: 'Чашка чая', icon: '🍵' },
  mech: { hotspot: [16, 16], name: 'Шестерёнка', icon: '⚙️' },
  candle: { hotspot: [16, 4], name: 'Свеча', icon: '🕯️' },
  flow: { hotspot: [8, 8], name: 'Волна', icon: '🌊' },
  brew: { hotspot: [16, 4], name: 'Колба', icon: '⚗️' },
  fate: { hotspot: [6, 4], name: 'Карта судьбы', icon: '🔮' },
  glass: { hotspot: [16, 4], name: 'Осколок витража', icon: '🪟' },
  spin: { hotspot: [10, 6], name: 'Лоскут гобелена', icon: '🖼️' },
  gift: { hotspot: [8, 8], name: 'Подарочный свёрток', icon: '🎁' },
  seating: { hotspot: [8, 6], name: 'Стул у чайного стола', icon: '🪑' },
  battle: { hotspot: [4, 4], name: 'Меч рыцаря', icon: '⚔️' },
  equip: { hotspot: [16, 6], name: 'Шлем рыцаря', icon: '🪖' },
  shop: { hotspot: [16, 16], name: 'Монета', icon: '🪙' },
  tavern: { hotspot: [10, 6], name: 'Кружка', icon: '🍺' },
  craft: { hotspot: [6, 6], name: 'Молот кузнеца', icon: '🔨' },
  workshop: { hotspot: [6, 6], name: 'Ключ мастера', icon: '🔧' },
};

// Маршрут → тема. Для puzzle — по механике уровня, для hub — по сцене.
const ROUTE_CURSORS = {
  puzzle: (p, state) => findPuzzle(state, p.id)?.mechanic || 'mirror',
  hub: (p) => `hub_${p.scene || 'lavka'}`, // без сцены applyCursor оставит прошлую hub_*-тему
  equip: () => 'equip',
  shop: () => 'shop',
  shopArmory: () => 'shop',
  shopArmorer: () => 'shop',
  shopMagic: () => 'shop',
  shopAlchemy: () => 'shop',
  battles: () => 'battle',
  battle: () => 'battle',
  tavern: () => 'tavern',
  craft: () => 'craft',
  workshop: () => 'workshop',
  editor: () => 'workshop',
  seekeditor: () => 'workshop',
  sandbox: () => 'workshop',
  deck: () => 'fate',
};

export function cursorForRoute(name, params = {}, state = null) {
  const fn = ROUTE_CURSORS[name];
  const key = fn ? fn(params, state) : 'default';
  if (key && CURSOR_THEMES[key]) return key;
  return 'default';
}

// Режим «один курсор везде»: тема из настроек с фолбэком на default.
export function fixedCursorTheme(state) {
  const key = state?.settings?.cursorTheme;
  return CURSOR_THEMES[key] ? key : 'default';
}

export function cursorMode(state) {
  const mode = state?.settings?.cursorMode;
  return ['system', 'themed', 'fixed'].includes(mode) ? mode : 'themed';
}

// Вызывается роутером после отрисовки экрана.
export function applyCursor(name, params = {}, state = null, body = document.body) {
  if (!body) return;
  const mode = cursorMode(state);
  // «Системный курсор»: снимаем тему, браузер рисует обычную стрелку
  if (mode === 'system') {
    delete body.dataset.cursor;
    return;
  }
  // «Один везде»: выбранная тема на всех экранах
  if (mode === 'fixed') {
    body.dataset.cursor = fixedCursorTheme(state);
    return;
  }
  // «Тематические»: своя тема у каждого режима игры
  const prev = body.dataset?.cursor;
  let key = cursorForRoute(name, params, state);
  // Хаб без явной сцены — остаёмся на прошлой hub_*-теме
  if (name === 'hub' && !params.scene && prev && CURSOR_THEMES[prev] && prev.startsWith('hub_')) {
    key = prev;
  }
  body.dataset.cursor = key;
}
