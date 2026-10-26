import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

class El {
  constructor(tag) {
    this.tagName = tag.toLowerCase();
    this.children = [];
    this.parent = null;
    this.style = { setProperty: () => {} };
    this.dataset = {};
    this.attributes = {};
    this._listeners = {};
    this._className = '';
    this._innerHTML = '';
    this._text = '';
    this.disabled = false;
  }
  set className(value) { this._className = String(value || ''); }
  get className() { return this._className; }
  get classList() {
    const el = this;
    return {
      add: (...names) => { el.className = [...new Set([...classes(el), ...names])].join(' '); },
      remove: (...names) => { el.className = classes(el).filter((name) => !names.includes(name)).join(' '); },
      contains: (name) => classes(el).includes(name),
    };
  }
  clearChildren() {
    for (const child of this.children) child.parent = null;
    this.children = [];
  }
  set innerHTML(value) { this.clearChildren(); this._innerHTML = String(value); }
  get innerHTML() { return this._innerHTML; }
  set textContent(value) { this.clearChildren(); this._text = String(value ?? ''); }
  get textContent() { return this._text; }
  appendChild(child) { child.parent = this; this.children.push(child); return child; }
  append(...children) { for (const child of children) this.appendChild(child); }
  prepend(child) { child.parent = this; this.children.unshift(child); return child; }
  remove() {
    if (!this.parent) return;
    const index = this.parent.children.indexOf(this);
    if (index >= 0) this.parent.children.splice(index, 1);
    this.parent = null;
  }
  addEventListener(type, fn) { (this._listeners[type] ||= []).push(fn); }
  removeEventListener(type, fn) { this._listeners[type] = (this._listeners[type] || []).filter((fn2) => fn2 !== fn); }
  dispatch(type, event = {}) {
    event.target ||= this;
    event.preventDefault ||= () => {};
    for (const fn of [...(this._listeners[type] || [])]) fn(event);
  }
  click() { if (!this.disabled) this.dispatch('click'); }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  getBoundingClientRect() { return { left: 0, top: 0, width: 100, height: 100 }; }
  querySelector() { return null; }
}

function classes(el) {
  return String(el.className || '').split(/\s+/).filter(Boolean);
}
function flat(el, out = []) {
  out.push(el);
  for (const child of el.children || []) flat(child, out);
  return out;
}
function hasClass(el, name) { return classes(el).includes(name); }
function byClass(root, name) { return flat(root).filter((el) => hasClass(el, name)); }
function byData(root, key, value) {
  return flat(root).filter((el) => value === undefined ? el.dataset?.[key] !== undefined : el.dataset?.[key] === value);
}

const ids = new Map();
const documentStub = {
  createElement: (tag) => new El(tag),
  body: new El('body'),
  documentElement: new El('html'),
  getElementById(id) {
    if (!ids.has(id)) ids.set(id, new El('div'));
    return ids.get(id);
  },
  querySelector: () => null,
  addEventListener: () => {},
  removeEventListener: () => {},
};
globalThis.document = documentStub;
globalThis.window = {
  scrollX: 0,
  scrollY: 0,
  devicePixelRatio: 1,
  addEventListener: () => {},
  removeEventListener: () => {},
};
globalThis.confirm = () => true;

const { newGame, saveGame, loadGame, buyCosmetic } = await import('../src/core/state.js');
const {
  renderHub, LAVKA_HOTSPOT_SHAPES, LAVKA_LAYOUT_SHAPES, LAVKA_LAYOUTS,
  SQUARE_V2_HOTSPOT_SHAPES, MARKET_V2_HOTSPOT_SHAPES, CABINET_V2_HOTSPOT_SHAPES,
  CABINET_V2_TROPHY_SPOTS, CABINET_V2_MINI_SPOTS,
} = await import('../src/ui/hub.js');
const { renderShop } = await import('../src/ui/shopView.js');
const { scenePolygonGeometry, normalizeScenePoints, mergeSceneLayout } = await import('../src/core/hubGeometry.js');
const {
  resolveCosmeticBackground, legacyCosmeticIds, BASE_LAVKA_BACKGROUND, LAVKA_LAYOUT_ID,
  COSMETIC_SCENE_BASE,
} = await import('../src/core/cosmetics.js');
const {
  COSMETICS, COSMETIC_PACKS, COSMETIC_BY_ID, COSMETIC_PACK_BY_ID,
  LEGACY_COSMETIC_ALIASES, COSMETICS_VERSION, LAVKA_COSMETIC_LAYOUTS,
} = await import('../src/data/cosmetics.js');

function makeCtx(state = newGame()) {
  const ctx = {
    state,
    visits: [],
    scenes: [],
    notices: [],
    saves: 0,
    go(...args) { this.visits.push(args); },
    setHubScene(scene) { this.scenes.push(scene); },
    syncOnboarding: () => {},
    toast(text) { this.notices.push(text); },
    save() { this.saves += 1; },
    sfx: () => {},
  };
  return ctx;
}
function hotspotButtons(root) { return byData(root, 'hotspot'); }
function scenePanel(root) { return byClass(root, 'hub-picture')[0]; }
function sceneImage(root) { return byClass(root, 'hub-scene')[0]; }

function jpegInfo(path) {
  const bytes = readFileSync(path);
  assert.equal(bytes[0], 0xff);
  assert.equal(bytes[1], 0xd8);
  const sof = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  let offset = 2;
  while (offset + 8 < bytes.length) {
    if (bytes[offset] !== 0xff) { offset += 1; continue; }
    const marker = bytes[offset + 1];
    offset += 2;
    if (marker === 0xff || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd8)) continue;
    if (marker === 0xd9) break;
    const length = bytes.readUInt16BE(offset);
    assert.ok(length >= 2 && offset + length <= bytes.length);
    if (sof.has(marker)) {
      return {
        height: bytes.readUInt16BE(offset + 3),
        width: bytes.readUInt16BE(offset + 5),
        components: bytes[offset + 7],
      };
    }
    offset += length;
  }
  throw new Error('JPEG SOF не найден');
}

test('hub geometry: валидация, bbox, локальный polygon и якоря пересчитываются', () => {
  const g = scenePolygonGeometry([[10, 20], [30, 20], [30, 60], [10, 60]]);
  assert.deepEqual(g.bbox, { left: 10, top: 20, width: 20, height: 40 });
  assert.equal(g.polygon, 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)');
  assert.deepEqual(g.center, { x: 20, y: 40 });
  assert.deepEqual(g.localCenter, { x: 50, y: 50 });
  assert.deepEqual(g.labelAnchor, { x: 20, y: 60 });
  assert.deepEqual(normalizeScenePoints([{ x: 0, y: 100 }, [100, 0], [50, 50]]),
    [{ x: 0, y: 100 }, { x: 100, y: 0 }, { x: 50, y: 50 }]);

  const moved = scenePolygonGeometry([[40, 5], [60, 5], [60, 45], [40, 45]]);
  assert.equal(moved.polygon, g.polygon, 'polygon локален и не зависит от смещения bbox');
  assert.deepEqual(moved.labelAnchor, { x: 50, y: 45 });
  for (const invalid of [
    null, [], [[0, 0], [1, 1]], [[0, 0], [1, 1], [NaN, 2]],
    [[0, 0], [1, 1], [Infinity, 2]], [[0, 0], [1, 1], [-1, 2]],
    [[0, 0], [1, 1], [101, 2]], [[2, 0], [2, 10], [2, 20]],
    [[0, 2], [10, 2], [20, 2]],
  ]) assert.throws(() => scenePolygonGeometry(invalid));
});

test('все семь силуэтов лавки валидны и привязаны к нужным частям арта', () => {
  const routes = ['puzzles', 'shop', 'guests', 'equip', '@square', 'battles', '@cabinet'];
  assert.deepEqual(Object.keys(LAVKA_HOTSPOT_SHAPES), routes);
  for (const route of routes) {
    const g = scenePolygonGeometry(LAVKA_HOTSPOT_SHAPES[route]);
    assert.ok(g.width > 0 && g.height > 0, route);
    assert.ok(g.polygon.startsWith('polygon('), route);
  }
  const equip = scenePolygonGeometry(LAVKA_HOTSPOT_SHAPES.equip);
  assert.ok(equip.bbox.top >= 26 && equip.bbox.top + equip.height <= 53, 'рыцарь ограничен шлемом и верхом доспеха');
  const cabinet = scenePolygonGeometry(LAVKA_HOTSPOT_SHAPES['@cabinet']);
  assert.ok(cabinet.center.x > 65 && cabinet.center.x < 72 && cabinet.center.y > 55 && cabinet.center.y < 76,
    'кабинет ведёт в нижнюю светящуюся арку');
  const battles = scenePolygonGeometry(LAVKA_HOTSPOT_SHAPES.battles);
  assert.ok(battles.left >= 87 && battles.left + battles.width === 100, 'поход занимает всё правое окно с рамой');
});

test('cosmetic layout merge: частичные overrides наследуют базу без мутаций', () => {
  const base = {
    hotspots: {
      puzzles: [[0, 0], [10, 0], [10, 10], [0, 10]],
      shop: [[20, 20], [30, 20], [30, 30], [20, 30]],
    },
    sprites: {
      cmp_cat: { x: 26, y: 89, size: 85 },
      story_guest: { x: 57, y: 90 },
    },
  };
  const customPuzzles = [[1, 1], [11, 1], [11, 11], [1, 11]];
  const merged = mergeSceneLayout(base, {
    hotspots: { puzzles: customPuzzles },
    sprites: { cmp_cat: { x: 73 } },
  });
  assert.equal(merged.hotspots.puzzles, customPuzzles);
  assert.equal(merged.hotspots.shop, base.hotspots.shop);
  assert.deepEqual(merged.sprites.cmp_cat, { x: 73, y: 89, size: 85 });
  assert.deepEqual(merged.sprites.story_guest, { x: 57, y: 90 });
  assert.deepEqual(base.sprites.cmp_cat, { x: 26, y: 89, size: 85 });
  assert.deepEqual(base.hotspots.puzzles, [[0, 0], [10, 0], [10, 10], [0, 10]]);
});

test('cosmetic runtime: шесть JPEG 2400×800 RGB, собственные layouts и спрайты', () => {
  const routes = ['puzzles', 'shop', 'guests', 'equip', '@square', 'battles', '@cabinet'];
  const sprites = ['pet_puppy', 'cmp_cat', 'cmp_firefly', 'story_guest'];
  assert.deepEqual(Object.keys(LAVKA_COSMETIC_LAYOUTS), COSMETIC_PACKS.map((pack) => `lavka_pack_${pack.id}_3x1`));
  for (const pack of COSMETIC_PACKS) {
    const layoutId = `lavka_pack_${pack.id}_3x1`;
    assert.equal(pack.scenes.lavka.layoutId, layoutId);
    const info = jpegInfo(new URL(`../assets/cosmetics/lavka_pack_${pack.id}_web.jpg`, import.meta.url));
    assert.deepEqual(info, { width: 2400, height: 800, components: 3 }, pack.id);
    const layout = LAVKA_LAYOUTS[layoutId];
    assert.equal(LAVKA_LAYOUT_SHAPES[layoutId], layout.hotspots);
    assert.deepEqual(Object.keys(layout.hotspots), routes);
    assert.deepEqual(Object.keys(layout.sprites), sprites);
    for (const route of routes) {
      const geometry = scenePolygonGeometry(layout.hotspots[route]);
      assert.ok(geometry.width > 0 && geometry.height > 0, `${pack.id}:${route}`);
    }
    for (const sprite of sprites) {
      const spot = layout.sprites[sprite];
      assert.ok(Number.isFinite(spot.x) && spot.x >= 0 && spot.x <= 100, `${pack.id}:${sprite}:x`);
      assert.ok(Number.isFinite(spot.y) && spot.y >= 0 && spot.y <= 100, `${pack.id}:${sprite}:y`);
    }
    assert.notDeepEqual(layout.hotspots, LAVKA_HOTSPOT_SHAPES, pack.id);
  }
});

test('лавка: native shape buttons, sibling labels/dots, текстовые маршруты и click', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const state = newGame();
  const ctx = makeCtx(state);
  const root = new El('main');
  renderHub(root, ctx);
  const buttons = hotspotButtons(root);
  const routes = ['puzzles', 'shop', 'guests', 'equip', '@square', 'battles', '@cabinet'];
  assert.deepEqual(buttons.map((b) => b.dataset.hotspot), routes);
  assert.equal(byClass(root, 'lens').length, 0);
  assert.equal(byClass(root, 'hs-icon').length, 0);
  assert.equal(byClass(root, 'hs-glint').length, 0);
  for (const b of buttons) {
    assert.equal(b.tagName, 'button');
    assert.equal(b.type, 'button');
    assert.ok(b.getAttribute('aria-label'));
    assert.ok(hasClass(b, 'hub-shape'));
    assert.ok(b.style.clipPath.startsWith('polygon('));
    assert.ok(Number.parseFloat(b.style.width) > 0 && Number.parseFloat(b.style.height) > 0);
    assert.equal(b._listeners.pointerdown, undefined, 'активация только через click');
    const holder = b.parent;
    const label = holder.children.find((el) => hasClass(el, 'hs-label'));
    assert.ok(label && label.parent === holder && label.parent !== b, 'подпись вне clipped-button');
  }
  const dot = byClass(root, 'hub-shape-dot')[0];
  assert.ok(dot && !hasClass(dot.parent, 'hub-shape'), 'hs-dot тоже sibling вне обрезки');
  assert.equal(byData(root, 'hotspot', '@square').length, 1, 'onboarding target не дублируется текстовой навигацией');

  const nav = byClass(root, 'hub-text-nav')[0];
  assert.equal(nav.tagName, 'nav');
  assert.deepEqual(nav.children.map((b) => b.dataset.hubRoute), routes);
  assert.ok(nav.children.every((b) => b.tagName === 'button' && b.type === 'button'));
  nav.children[0].dispatch('pointerenter');
  assert.ok(hasClass(buttons[0], 'nav-highlight'));
  assert.ok(buttons.slice(1).every((b) => !hasClass(b, 'nav-highlight')));
  nav.children[0].dispatch('pointerleave');
  assert.ok(!hasClass(buttons[0], 'nav-highlight'));
  nav.children[0].dispatch('focus');
  assert.ok(hasClass(buttons[0], 'nav-highlight'));
  nav.children[0].dispatch('blur');
  assert.ok(!hasClass(buttons[0], 'nav-highlight'));
  nav.children[0].click();
  t.mock.timers.tick(150);
  assert.deepEqual(ctx.visits.at(-1), ['puzzles']);
  buttons.find((b) => b.dataset.hotspot === 'shop').click();
  t.mock.timers.tick(150);
  assert.deepEqual(ctx.visits.at(-1), ['shop']);
});

test('v2 runtime: JPEG 2400×800 RGB, валидные полигоны и разнесённые bbox', () => {
  const layouts = [
    ['square', 'town_square_v2_web.jpg', SQUARE_V2_HOTSPOT_SHAPES],
    ['market', 'town_market_v2_web.jpg', MARKET_V2_HOTSPOT_SHAPES],
    ['cabinet', 'trophy_room_v2_web.jpg', CABINET_V2_HOTSPOT_SHAPES],
  ];
  for (const [scene, filename, shapes] of layouts) {
    const info = jpegInfo(new URL(`../assets/hub/${filename}`, import.meta.url));
    assert.deepEqual(info, { width: 2400, height: 800, components: 3 });
    const geometry = Object.entries(shapes).map(([route, points]) => [route, scenePolygonGeometry(points)]);
    assert.ok(geometry.length >= 4);
    for (const [route, g] of geometry) {
      assert.ok(g.width > 0 && g.height > 0, `${scene}:${route}`);
      assert.ok(g.polygon.startsWith('polygon('));
    }
    for (let i = 0; i < geometry.length; i += 1) {
      for (let j = i + 1; j < geometry.length; j += 1) {
        const [aRoute, a] = geometry[i];
        const [bRoute, b] = geometry[j];
        const overlapX = Math.min(a.left + a.width, b.left + b.width) - Math.max(a.left, b.left);
        const overlapY = Math.min(a.top + a.height, b.top + b.height) - Math.max(a.top, b.top);
        assert.ok(overlapX <= 0 || overlapY <= 0, `${scene}: bbox ${aRoute}/${bRoute} пересекаются`);
      }
    }
  }
  assert.equal(scenePolygonGeometry(MARKET_V2_HOTSPOT_SHAPES['@square']).top, 1,
    'переход на площадь охватывает улицу до верхнего края');
  assert.equal(CABINET_V2_TROPHY_SPOTS.length, 12);
  assert.deepEqual(CABINET_V2_TROPHY_SPOTS.map((spot) => spot.y), [35, 35, 35, 35, 35, 35, 64, 64, 64, 64, 64, 64]);
  assert.equal(CABINET_V2_MINI_SPOTS.length, 4);
  assert.ok(CABINET_V2_MINI_SPOTS.every((spot) => spot.y === 79));
});

test('v2 square/market/cabinet: primary layouts, native shapes, routes и переходы', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const expected = {
    square: {
      src: 'assets/hub/town_square_v2_web.jpg', layoutId: 'square_v2_3x1', shapes: SQUARE_V2_HOTSPOT_SHAPES,
      routes: ['board', '@lavka', 'craft', 'workshop', '@market', 'tavern'],
    },
    market: {
      src: 'assets/hub/town_market_v2_web.jpg', layoutId: 'market_v2_3x1', shapes: MARKET_V2_HOTSPOT_SHAPES,
      routes: ['shopArmory', 'shopArmorer', '@square', 'shopMagic', 'shopAlchemy'],
    },
    cabinet: {
      src: 'assets/hub/trophy_room_v2_web.jpg', layoutId: 'cabinet_v2_3x1', shapes: CABINET_V2_HOTSPOT_SHAPES,
      routes: ['achievements', 'battles', 'deck', '@lavka'],
    },
  };
  for (const [scene, def] of Object.entries(expected)) {
    const root = new El('main');
    renderHub(root, makeCtx(), { scene });
    assert.equal(sceneImage(root).src, def.src);
    assert.equal(scenePanel(root).dataset.layoutId, def.layoutId);
    assert.equal(scenePanel(root).dataset.layoutMode, 'primary');
    const buttons = hotspotButtons(root);
    assert.deepEqual(buttons.map((b) => b.dataset.hotspot), def.routes);
    for (const b of buttons) {
      assert.equal(b.tagName, 'button');
      assert.equal(b.type, 'button');
      assert.ok(hasClass(b, 'hub-shape'), `${scene}:${b.dataset.hotspot}`);
      assert.equal(b.style.clipPath, scenePolygonGeometry(def.shapes[b.dataset.hotspot]).polygon);
      const label = b.parent.children.find((el) => hasClass(el, 'hs-label'));
      assert.ok(label && label.parent !== b, 'label остаётся вне clipping');
      assert.equal(b._listeners.pointerdown, undefined);
    }
    const nav = byClass(root, 'hub-text-nav')[0];
    assert.deepEqual(nav.children.map((b) => b.dataset.hubRoute), def.routes);
    assert.equal(flat(root).filter((el) => el.src === 'assets/hub/intro_web.jpg').length, 0);
  }
  const squareRoot = new El('main');
  renderHub(squareRoot, makeCtx(), { scene: 'square' });
  assert.equal(byData(squareRoot, 'hotspot', '@market').length, 1, 'onboarding target единственный');

  const ctx = makeCtx();
  const root = new El('main');
  renderHub(root, ctx);
  hotspotButtons(root).find((b) => b.dataset.hotspot === '@square').click();
  t.mock.timers.tick(150);
  assert.equal(scenePanel(root).dataset.scene, 'square');
  assert.equal(sceneImage(root).src, expected.square.src);
  hotspotButtons(root).find((b) => b.dataset.hotspot === '@market').click();
  t.mock.timers.tick(150);
  assert.equal(scenePanel(root).dataset.scene, 'market');
  assert.equal(sceneImage(root).src, expected.market.src);
  assert.ok(sceneImage(root).src.includes('_v2_'));
  assert.deepEqual(ctx.scenes, ['square', 'market']);
});

test('v2 error → старый файл, legacy circles/центры и прежние trophy spots', () => {
  const expected = {
    square: {
      src: 'assets/hub/town_square_web.jpg', layoutId: 'square_legacy_3x1',
      spots: { tavern: [79, 60], craft: [39, 58], workshop: [53, 68], board: [7, 59], '@lavka': [17, 50], '@market': [58, 38] },
    },
    market: {
      src: 'assets/hub/town_market_web.jpg', layoutId: 'market_legacy_3x1',
      spots: { shopArmory: [7, 60], shopArmorer: [35, 60], shopMagic: [63, 62], shopAlchemy: [80, 60], '@square': [52, 60] },
    },
    cabinet: {
      src: 'assets/hub/trophy_room_web.jpg', layoutId: 'cabinet_legacy_3x1',
      spots: { achievements: [87.5, 64], battles: [87, 33], deck: [12, 55], '@lavka': [50, 92] },
    },
  };
  for (const [scene, def] of Object.entries(expected)) {
    const root = new El('main');
    renderHub(root, makeCtx(), { scene });
    const image = sceneImage(root);
    assert.ok(image.src.includes('_v2_'));
    image.dispatch('error');
    assert.equal(image.src, def.src);
    assert.equal(scenePanel(root).dataset.layoutId, def.layoutId);
    assert.equal(scenePanel(root).dataset.layoutMode, 'legacy');
    for (const b of hotspotButtons(root)) {
      assert.ok(!hasClass(b, 'hub-shape'), `${scene}:${b.dataset.hotspot} снова круг`);
      const [x, y] = def.spots[b.dataset.hotspot];
      assert.equal(b.style.left, `${x}%`);
      assert.equal(b.style.top, `${y}%`);
      assert.ok(b.getAttribute('aria-label'));
    }
    assert.equal(hotspotButtons(root).length, Object.keys(def.spots).length);
    assert.ok(byClass(root, 'hub-text-nav')[0]);
  }
  const cabinet = new El('main');
  renderHub(cabinet, makeCtx(), { scene: 'cabinet' });
  sceneImage(cabinet).dispatch('error');
  const trophies = byClass(cabinet, 'hub-trophy');
  assert.equal(trophies.length, 16);
  assert.equal(trophies[0].style.left, '29.7%');
  assert.equal(trophies[0].style.top, '35%');
  assert.equal(trophies.at(-4).style.left, '42%');
  assert.equal(trophies.at(-4).style.top, '76.5%');

  const square = new El('main');
  renderHub(square, makeCtx(), { scene: 'square' });
  sceneImage(square).dispatch('error');
  assert.equal(byClass(square, 'smokepuff')[0].style.left, '33%');
  assert.equal(byClass(square, 'smokepuff')[0].style.top, '16%');
});

test('missing scene image не схлопывает 3:1; без дополнительной заставки; reduced-motion и zoom fallback', () => {
  const lavka = new El('main');
  renderHub(lavka, makeCtx());
  assert.equal(scenePanel(lavka).style.aspectRatio, '3 / 1');
  assert.equal(flat(lavka).filter((el) => el.src === 'assets/hub/intro_web.jpg').length, 0);

  const square = new El('main');
  renderHub(square, makeCtx(), { scene: 'square' });
  const panel = scenePanel(square);
  const image = sceneImage(square);
  image.dispatch('error');
  assert.equal(image.src, 'assets/hub/town_square_web.jpg', 'сначала пробуем legacy-файл');
  image.dispatch('error');
  assert.ok(!flat(square).includes(image), 'только второй error оставляет сцену без изображения');
  assert.ok(flat(square).includes(panel));
  assert.ok(hasClass(panel, 'hub-scene-missing'));
  assert.equal(panel.style.aspectRatio, '3 / 1');
  assert.equal(byClass(square, 'hub-text-nav')[0].children.length, 6, 'текстовые маршруты остаются без картинки');
  assert.ok(hotspotButtons(square).every((b) => !hasClass(b, 'hub-shape')), 'legacy-круги тоже остаются');

  const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(css, /\.hub-picture\s*\{[^}]*aspect-ratio:\s*3\s*\/\s*1/s);
  assert.match(css, /\.hub-picture\.hub-scene-missing\s*\{[^}]*background:/s);
  assert.ok(css.includes('@supports not (clip-path:'));
  assert.match(css, /@media \(pointer: coarse\), \(max-width: 720px\)\s*\{\s*\.hub-text-nav button\s*\{\s*min-height:\s*52px/s);
  assert.ok(css.includes('.hotspot.hub-shape.nav-highlight ~ .hs-label'));
  assert.ok(css.includes('body[data-route="hub"] .hub-picture .cos-fx'));
  assert.ok(css.includes('body[data-route="hub"] #screen.screen-enter'));
  assert.match(css, /@media \(max-width: 720px\), \(pointer: coarse\)\s*\{\s*\.quick-nav\s*\{\s*position:\s*static;/s);
  assert.match(css, /\.quick-nav button \{ width: 52px; height: 52px; flex: 0 0 52px; \}/);
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.ok(!html.includes('user-scalable=no'));
});

test('питомцы, команда, гость и 12+4 трофея — доступные кнопки на активном layout', () => {
  const state = newGame();
  state.onboarding.status = 'done';
  state.onboarding.step = 'done';
  state.crew = ['pet_puppy', 'cmp_cat', 'pet_owl', 'cmp_smith'];
  state.pet = 'pet_puppy';
  const ctx = makeCtx(state);
  const root = new El('main');
  renderHub(root, ctx);
  const actors = byClass(root, 'hub-pet');
  assert.equal(actors.length, 3, 'питомец, кот и гость');
  assert.ok(actors.every((el) => el.tagName === 'button' && el.type === 'button' && el.getAttribute('aria-label')));
  assert.deepEqual(new Set(actors.map((el) => el.style.left)), new Set(['88%', '26%', '57%']));
  byClass(root, 'hub-guest')[0].click();
  assert.deepEqual(ctx.visits.at(-1), ['story']);

  const square = new El('main');
  renderHub(square, ctx, { scene: 'square' });
  const squareActors = byClass(square, 'hub-pet');
  assert.equal(squareActors.length, 2);
  assert.equal(squareActors[0].style.left, '7.5%', 'сова сидит на жерди над доской');
  assert.equal(squareActors[0].style.top, '35%');
  assert.equal(squareActors[0].children[0].style.width, 'max(52px, 5.06cqw)');
  assert.equal(squareActors[1].style.left, '36%', 'кузнец не перекрывает фонтан');
  assert.equal(squareActors[1].style.top, '88%');
  assert.equal(byClass(square, 'smokepuff')[0].style.left, '46.3%');
  assert.equal(byClass(square, 'smokepuff')[0].style.top, '11%');
  sceneImage(square).dispatch('error');
  assert.equal(squareActors[0].style.left, '7%', 'legacy возвращает прежнюю сову');
  assert.equal(squareActors[0].style.top, '44%');
  assert.equal(squareActors[1].style.left, '45%');
  assert.equal(squareActors[1].style.top, '86%');

  const trophyState = newGame();
  trophyState.trophies = ['willow_branch'];
  const trophyCtx = makeCtx(trophyState);
  const cabinet = new El('main');
  renderHub(cabinet, trophyCtx, { scene: 'cabinet' });
  const trophies = byClass(cabinet, 'hub-trophy');
  assert.equal(trophies.length, 16);
  assert.ok(trophies.every((el) => el.tagName === 'button' && el.type === 'button' && el.getAttribute('aria-label')));
  assert.equal(trophies[0].style.left, '28%');
  assert.equal(trophies[0].style.top, '35%');
  assert.equal(trophies.at(-4).style.left, '41.7%');
  assert.equal(trophies.at(-4).style.top, '79%');
  sceneImage(cabinet).dispatch('error');
  assert.equal(byClass(cabinet, 'hub-trophy')[0], trophies[0], 'fallback не пересоздаёт кнопку трофея');
  assert.equal(trophies[0].style.left, '29.7%');
  assert.equal(trophies.at(-4).style.left, '42%');
  assert.equal(trophies.at(-4).style.top, '76.5%');
  trophies.find((el) => hasClass(el, 'locked')).click();
  assert.match(trophyCtx.notices.at(-1), /Пустое место/);
});

test('pack metadata, aliases и scene resolver: полные темы без старых товарных id', () => {
  assert.equal(COSMETICS_VERSION, 2);
  assert.equal(COSMETICS, COSMETIC_PACKS);
  assert.equal(COSMETIC_BY_ID, COSMETIC_PACK_BY_ID);
  const expected = {
    hearth: ['Домашний очаг', '🏮', 200, null, 5],
    spring: ['Весеннее пробуждение', '🌸', 120, 'spring', 4],
    summer: ['Летний фестиваль огоньков', '✨', 120, 'summer', 4],
    autumn: ['Осенняя ярмарка', '🎏', 120, 'autumn', 4],
    winter: ['Зимний очаг', '❄️', 150, 'winter', 4],
    halloween: ['Хэллоуин «Тени и тыквы»', '🎃', 600, 'autumn', 5],
  };
  assert.deepEqual(Object.keys(COSMETIC_BY_ID), Object.keys(expected));
  for (const c of COSMETIC_PACKS) {
    const [name, icon, price, season, changes] = expected[c.id];
    assert.equal(c.name, name);
    assert.equal(c.icon, icon);
    assert.equal(c.price, price);
    assert.equal(c.season, season);
    assert.equal(c.kind, 'background');
    assert.equal(c.sealPrice, undefined);
    assert.equal(c.changes.length, changes);
    assert.ok(c.changes.length >= 3 && c.changes.length <= 5);
    assert.ok(c.changes.every((change) => /[А-Яа-яЁё]/.test(change)));
    assert.deepEqual(Object.keys(c.scenes), ['lavka']);
    assert.equal(c.scenes.lavka.src, `assets/cosmetics/lavka_pack_${c.id}_web.jpg`);
    assert.equal(c.scenes.lavka.preview, c.scenes.lavka.src);
    assert.equal(c.scenes.lavka.layoutId, `lavka_pack_${c.id}_3x1`);
    assert.ok(LAVKA_COSMETIC_LAYOUTS[c.scenes.lavka.layoutId]);
  }
  assert.deepEqual(LEGACY_COSMETIC_ALIASES, {
    cos_carpet: 'hearth', cos_crest: 'hearth', cos_flowers: 'spring',
    cos_fireflies: 'summer', cos_garland: 'autumn', cos_snow: 'winter',
  });
  for (const oldId of Object.keys(LEGACY_COSMETIC_ALIASES)) assert.equal(COSMETIC_BY_ID[oldId], undefined);

  const empty = resolveCosmeticBackground(newGame());
  assert.equal(empty.src, BASE_LAVKA_BACKGROUND);
  assert.equal(empty.layoutId, LAVKA_LAYOUT_ID);
  assert.equal(empty.full, false);
  assert.deepEqual(empty.legacyIds, []);

  const state = newGame();
  state.cosmeticsOwned = ['hearth', 'spring'];
  state.cosmeticsActive = ['hearth'];
  state.legacyCosmeticsActive = ['hearth'];
  const selected = resolveCosmeticBackground(state);
  assert.equal(selected.selectedId, 'hearth');
  assert.equal(selected.src, COSMETIC_BY_ID.hearth.scenes.lavka.src);
  assert.equal(selected.fallbackSrc, BASE_LAVKA_BACKGROUND);
  assert.equal(selected.layoutId, 'lavka_pack_hearth_3x1');
  assert.equal(selected.full, true);
  assert.deepEqual(selected.legacyIds, ['cos_carpet', 'cos_crest']);
  assert.deepEqual(legacyCosmeticIds({ cosmeticsActive: ['cos_crest'] }), ['cos_crest']);
  assert.deepEqual(legacyCosmeticIds({ cosmeticsActive: ['halloween'] }), []);
  const wrongLayout = resolveCosmeticBackground(state, { layoutId: 'unknown_layout' });
  assert.equal(wrongLayout.src, BASE_LAVKA_BACKGROUND);
  assert.equal(wrongLayout.layoutId, LAVKA_LAYOUT_ID);
  assert.equal(wrongLayout.full, false);
  assert.equal(wrongLayout.id, null);
  for (const scene of ['square', 'market', 'cabinet']) {
    const fallback = resolveCosmeticBackground(state, { scene });
    assert.equal(fallback.src, COSMETIC_SCENE_BASE[scene].src, `${scene}: база именно этой сцены`);
    assert.equal(fallback.fallbackSrc, COSMETIC_SCENE_BASE[scene].src);
    assert.equal(fallback.layoutId, COSMETIC_SCENE_BASE[scene].layoutId);
    assert.equal(fallback.full, false);
    assert.deepEqual(fallback.legacyIds, [], 'legacy sprites только для lavka');
  }
});

test('resolver пропускает будущий custom layout, а hub без registry возвращает базу и legacy', () => {
  const state = newGame();
  state.cosmeticsOwned = ['hearth'];
  state.cosmeticsActive = ['hearth'];
  state.legacyCosmeticsActive = ['hearth'];
  const original = COSMETIC_BY_ID.hearth.scenes.lavka.layoutId;
  try {
    COSMETIC_BY_ID.hearth.scenes.lavka.layoutId = 'future_custom_3x1';
    const resolved = resolveCosmeticBackground(state);
    assert.equal(resolved.full, true);
    assert.equal(resolved.layoutId, 'future_custom_3x1');
    assert.equal(resolved.src, COSMETIC_BY_ID.hearth.scenes.lavka.src);

    const root = new El('main');
    renderHub(root, makeCtx(state));
    assert.equal(sceneImage(root).src, BASE_LAVKA_BACKGROUND);
    assert.equal(scenePanel(root).dataset.layoutId, LAVKA_LAYOUT_ID);
    assert.equal(hotspotButtons(root)[0].style.clipPath,
      scenePolygonGeometry(LAVKA_HOTSPOT_SHAPES.puzzles).polygon);
    assert.equal(byClass(root, 'hub-legacy-cosmetics').length, 1);
  } finally {
    COSMETIC_BY_ID.hearth.scenes.lavka.layoutId = original;
  }
});

test('фон: error выбранного src → база + legacy; successful load → без legacy; без выбора → только база', () => {
  const state = newGame();
  state.cosmeticsOwned = ['hearth', 'spring'];
  state.cosmeticsActive = ['hearth'];
  state.legacyCosmeticsActive = ['hearth'];

  const missingRoot = new El('main');
  renderHub(missingRoot, makeCtx(state));
  const missingImage = sceneImage(missingRoot);
  assert.equal(missingImage.src, COSMETIC_BY_ID.hearth.scenes.lavka.src);
  const legacy = byClass(missingRoot, 'hub-legacy-cosmetics')[0];
  assert.ok(legacy);
  assert.equal(legacy.dataset.legacyCosmetics, 'cos_carpet cos_crest');
  assert.ok(byClass(missingRoot, 'cos-img').length >= 2);
  missingImage.dispatch('error');
  assert.equal(missingImage.src, BASE_LAVKA_BACKGROUND);
  assert.equal(scenePanel(missingRoot).dataset.cosmeticMode, 'legacy');
  assert.ok(flat(missingRoot).includes(legacy));

  const loadedRoot = new El('main');
  renderHub(loadedRoot, makeCtx(state));
  const loadedImage = sceneImage(loadedRoot);
  loadedImage.dispatch('load');
  assert.equal(loadedImage.src, COSMETIC_BY_ID.hearth.scenes.lavka.src);
  assert.equal(scenePanel(loadedRoot).dataset.cosmeticMode, 'full');
  assert.equal(byClass(loadedRoot, 'hub-legacy-cosmetics').length, 0);
  assert.equal(byClass(loadedRoot, 'cos-img').length, 0, 'старые предметные overlays удалены');
  assert.equal(byClass(loadedRoot, 'dust').length, 6, 'атмосферная пыль допустима');

  const baseState = newGame();
  baseState.legacyCosmeticsActive = ['cos_carpet'];
  const baseRoot = new El('main');
  renderHub(baseRoot, makeCtx(baseState));
  assert.equal(sceneImage(baseRoot).src, BASE_LAVKA_BACKGROUND);
  assert.equal(byClass(baseRoot, 'hub-legacy-cosmetics').length, 0);
});

test('pack layouts: pending/load/error синхронно меняют фон, хотспоты и всех спрайтов', () => {
  const base = LAVKA_LAYOUTS[LAVKA_LAYOUT_ID];
  for (const pack of COSMETIC_PACKS) {
    const state = newGame();
    state.onboarding.status = 'done';
    state.onboarding.step = 'done';
    state.crew = ['pet_puppy', 'cmp_cat', 'cmp_firefly'];
    state.pet = 'pet_puppy';
    state.cosmeticsOwned = [pack.id];
    state.cosmeticsActive = [pack.id];
    state.legacyCosmeticsActive = [];
    const root = new El('main');
    renderHub(root, makeCtx(state));
    const panel = scenePanel(root);
    const image = sceneImage(root);
    const layoutId = `lavka_pack_${pack.id}_3x1`;
    const custom = LAVKA_LAYOUTS[layoutId];
    const sprite = (id) => byData(root, 'sprite', id)[0];
    const assertHotspots = (layout, stage) => {
      for (const route of Object.keys(layout.hotspots)) {
        const button = byData(root, 'hotspot', route)[0];
        assert.equal(button.style.clipPath, scenePolygonGeometry(layout.hotspots[route]).polygon,
          `${pack.id}:${route}:${stage}`);
      }
    };
    assert.equal(panel.dataset.layoutId, LAVKA_LAYOUT_ID, `${pack.id}: pending`);
    assert.equal(panel.dataset.cosmeticMode, 'pending');
    assertHotspots(base, 'pending');
    for (const id of Object.keys(base.sprites)) {
      assert.equal(sprite(id).style.left, `${base.sprites[id].x}%`, `${pack.id}:${id}:pending.x`);
      assert.equal(sprite(id).style.top, `${base.sprites[id].y}%`, `${pack.id}:${id}:pending.y`);
    }
    image.dispatch('load');
    assert.equal(panel.dataset.layoutId, layoutId, `${pack.id}: loaded`);
    assert.equal(panel.dataset.cosmeticMode, 'full');
    assertHotspots(custom, 'loaded');
    for (const id of Object.keys(custom.sprites)) {
      assert.equal(sprite(id).style.left, `${custom.sprites[id].x}%`, `${pack.id}:${id}:loaded.x`);
      assert.equal(sprite(id).style.top, `${custom.sprites[id].y}%`, `${pack.id}:${id}:loaded.y`);
    }
    image.dispatch('error');
    assert.equal(image.src, BASE_LAVKA_BACKGROUND);
    assert.equal(panel.dataset.layoutId, LAVKA_LAYOUT_ID, `${pack.id}: error`);
    assertHotspots(base, 'error');
    for (const id of Object.keys(base.sprites)) {
      assert.equal(sprite(id).style.left, `${base.sprites[id].x}%`, `${pack.id}:${id}:error.x`);
      assert.equal(sprite(id).style.top, `${base.sprites[id].y}%`, `${pack.id}:${id}:error.y`);
    }
    image.dispatch('load');
    assert.equal(panel.dataset.layoutId, LAVKA_LAYOUT_ID, `${pack.id}: загрузка базы не включает pack layout`);
  }
});

test('pack error после successful load возвращает legacy overlays вместе с базовым layout', () => {
  const state = newGame();
  state.cosmeticsOwned = ['hearth'];
  state.cosmeticsActive = ['hearth'];
  state.legacyCosmeticsActive = ['hearth'];
  const root = new El('main');
  renderHub(root, makeCtx(state));
  const image = sceneImage(root);
  image.dispatch('load');
  assert.equal(byClass(root, 'hub-legacy-cosmetics').length, 0);
  image.dispatch('error');
  assert.equal(scenePanel(root).dataset.layoutId, LAVKA_LAYOUT_ID);
  assert.equal(scenePanel(root).dataset.cosmeticMode, 'legacy');
  assert.equal(byClass(root, 'hub-legacy-cosmetics').length, 1);
  image.dispatch('load');
  assert.equal(scenePanel(root).dataset.layoutId, LAVKA_LAYOUT_ID);
  assert.equal(byClass(root, 'hub-legacy-cosmetics').length, 1);
});

test('старый владелец carpet+crest получает одну hearth бесплатно; successful load скрывает legacy', () => {
  const old = newGame(1000);
  old.cosmeticsVersion = 1;
  old.coins = 777;
  old.seals = 9;
  old.cosmeticsOwned = ['cos_carpet', 'cos_crest'];
  old.cosmeticsActive = ['cos_crest'];
  old.legacyCosmeticsActive = ['cos_carpet', 'cos_crest'];
  const memory = { cozy_adventures_save_v2: JSON.stringify(old) };
  const storage = {
    getItem: (key) => memory[key] ?? null,
    setItem: (key, value) => { memory[key] = String(value); },
  };
  const loaded = loadGame(storage, 2000);
  assert.equal(loaded.cosmeticsVersion, 2);
  assert.deepEqual(loaded.cosmeticsOwned, ['hearth']);
  assert.deepEqual(loaded.cosmeticsActive, ['hearth']);
  assert.deepEqual(loaded.legacyCosmeticsActive, ['cos_carpet', 'cos_crest']);
  assert.equal(buyCosmetic(loaded, 'hearth').ok, false, 'повторная оплата не требуется');
  assert.equal(loaded.coins, 777);
  assert.equal(loaded.seals, 9);

  const root = new El('main');
  renderHub(root, makeCtx(loaded));
  const image = sceneImage(root);
  assert.equal(image.src, COSMETIC_BY_ID.hearth.scenes.lavka.src);
  assert.equal(byClass(root, 'hub-legacy-cosmetics').length, 1);
  image.dispatch('load');
  assert.equal(scenePanel(root).dataset.cosmeticMode, 'full');
  assert.equal(byClass(root, 'hub-legacy-cosmetics').length, 0);
  assert.equal(byClass(root, 'cos-img').length, 0);
});

test('прилавок: полные pack-карточки, одиночный выбор, preview и dismissible пояснение', () => {
  const state = newGame();
  state.cosmeticsOwned = ['hearth', 'spring'];
  state.cosmeticsActive = ['hearth'];
  state.legacyCosmeticsActive = ['hearth'];
  const ctx = makeCtx(state);
  const root = new El('main');
  renderShop(root, ctx);
  const panel = () => byData(root, 'cosmeticsPanel', 'lavka')[0];
  assert.match(panel().innerHTML, /Оформление лавки/);
  assert.match(panel().innerHTML, /не один спрайт/);
  assert.equal(byData(root, 'cosmeticId').length, 7, 'база и ровно шесть пакетов');
  assert.equal(byData(root, 'cosmeticId', 'cos_carpet').length, 0, 'старых товарных id нет');
  const choice = (id) => byData(root, 'cosmeticId', id)[0];
  assert.equal(choice('base').getAttribute('aria-pressed'), 'false');
  assert.equal(choice('hearth').getAttribute('aria-pressed'), 'true');
  assert.equal(byData(root, 'cosmeticId').filter((b) => b.getAttribute('aria-pressed') === 'true').length, 1);
  for (const pack of COSMETIC_PACKS) {
    const row = byData(root, 'cosmeticRow', pack.id)[0];
    const count = (row.innerHTML.match(/<li>/g) || []).length;
    assert.equal(count, pack.changes.length, `${pack.id}: все изменения видны`);
    assert.ok(count >= 3 && count <= 5);
  }
  assert.match(choice('halloween').innerHTML, /🪙 600/);
  assert.ok(!choice('halloween').innerHTML.includes('🔰'));

  const preview = flat(panel()).find((el) => el.src === COSMETIC_BY_ID.spring.scenes.lavka.preview);
  const previewBox = preview.parent;
  preview.dispatch('error');
  assert.ok(!flat(panel()).includes(preview));
  assert.equal(previewBox.textContent, '🌸');

  choice('spring').click();
  assert.deepEqual(state.cosmeticsActive, ['spring']);
  assert.deepEqual(state.legacyCosmeticsActive, ['spring']);
  assert.equal(choice('spring').getAttribute('aria-pressed'), 'true');
  assert.equal(choice('hearth').getAttribute('aria-pressed'), 'false');
  choice('spring').click();
  assert.deepEqual(state.cosmeticsActive, []);
  assert.deepEqual(state.legacyCosmeticsActive, []);
  assert.equal(choice('base').getAttribute('aria-pressed'), 'true');

  const dismiss = byData(root, 'cosmeticNoticeDismiss', '1')[0];
  assert.ok(dismiss);
  dismiss.click();
  assert.equal(state.settings.cosmeticsPackNoticeDismissed, true);
  assert.equal(byData(root, 'cosmeticNoticeDismiss', '1').length, 0);
  const rerendered = new El('main');
  renderShop(rerendered, ctx);
  assert.equal(byData(rerendered, 'cosmeticNoticeDismiss', '1').length, 0);
  assert.ok(ctx.saves >= 3);
});

test('pack-миграция идемпотентна даже при повторном load после save', () => {
  const old = newGame(1000);
  old.cosmeticsVersion = 1;
  old.cosmeticsOwned = ['cos_carpet', 'cos_flowers', 'cos_crest'];
  old.cosmeticsActive = [...old.cosmeticsOwned];
  delete old.legacyCosmeticsActive;
  const memory = { cozy_adventures_save_v2: JSON.stringify(old) };
  const storage = {
    getItem: (key) => memory[key] ?? null,
    setItem: (key, value) => { memory[key] = String(value); },
  };
  const loaded = loadGame(storage, 2000);
  assert.equal(loaded.cosmeticsVersion, 2);
  assert.deepEqual(loaded.cosmeticsOwned, ['hearth', 'spring']);
  assert.deepEqual(loaded.cosmeticsActive, ['hearth']);
  assert.deepEqual(loaded.legacyCosmeticsActive, old.cosmeticsOwned);
  saveGame(loaded, storage);
  const again = loadGame(storage, 2000);
  assert.deepEqual(again.cosmeticsOwned, ['hearth', 'spring']);
  assert.deepEqual(again.cosmeticsActive, ['hearth']);
  assert.deepEqual(again.legacyCosmeticsActive, old.cosmeticsOwned);
});
