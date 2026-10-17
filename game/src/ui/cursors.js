// Тематические курсоры: у каждого режима игры свой PNG-курсор из assets/cursors/.
// Тема выставляется как body[data-cursor="<key>"], сами правила — в styles.css
// (cursor: url(...) x y, fallback). Пока PNG нет — браузер молча использует fallback.
// hotspot — точка клика в сетке 32×32; держать синхронно со styles.css и art-src/PROMPTS.md.
import { findPuzzle } from '../core/state.js';

export const CURSOR_THEMES = {
  default: { hotspot: [4, 28], name: 'Перо хозяина' },
  hub_lavka: { hotspot: [8, 4], name: 'Фонарик лавки' },
  hub_square: { hotspot: [6, 4], name: 'Уличный фонарь' },
  hub_market: { hotspot: [16, 4], name: 'Весы торговца' },
  hub_cabinet: { hotspot: [16, 6], name: 'Кубок трофеев' },
  mirror: { hotspot: [8, 6], name: 'Зеркальце' },
  shelf: { hotspot: [10, 6], name: 'Кувшин с полки' },
  riddle: { hotspot: [8, 6], name: 'Свиток загадок' },
  hang: { hotspot: [4, 28], name: 'Чернильное перо' },
  seek: { hotspot: [12, 12], name: 'Лупа' },
  path: { hotspot: [5, 5], name: 'Ботинок путника' },
  tea: { hotspot: [16, 8], name: 'Чашка чая' },
  mech: { hotspot: [16, 16], name: 'Шестерёнка' },
  candle: { hotspot: [16, 4], name: 'Свеча' },
  flow: { hotspot: [8, 8], name: 'Волна' },
  brew: { hotspot: [16, 4], name: 'Колба' },
  fate: { hotspot: [6, 4], name: 'Карта судьбы' },
  glass: { hotspot: [16, 4], name: 'Осколок витража' },
  battle: { hotspot: [4, 4], name: 'Меч рыцаря' },
  equip: { hotspot: [16, 6], name: 'Шлем рыцаря' },
  shop: { hotspot: [16, 16], name: 'Монета' },
  tavern: { hotspot: [10, 6], name: 'Кружка' },
  craft: { hotspot: [6, 6], name: 'Молот кузнеца' },
  workshop: { hotspot: [6, 6], name: 'Ключ мастера' },
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

// Вызывается роутером после отрисовки экрана.
export function applyCursor(name, params = {}, state = null, body = document.body) {
  if (!body) return;
  // Настройка «стандартный курсор»: снимаем тему, браузер рисует обычную стрелку
  if (state?.settings?.themedCursors === false) {
    delete body.dataset.cursor;
    return;
  }
  const prev = body.dataset?.cursor;
  let key = cursorForRoute(name, params, state);
  // Хаб без явной сцены — остаёмся на прошлой hub_*-теме
  if (name === 'hub' && !params.scene && prev && CURSOR_THEMES[prev] && prev.startsWith('hub_')) {
    key = prev;
  }
  body.dataset.cursor = key;
}
