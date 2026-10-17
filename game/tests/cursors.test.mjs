// Курсоры: маппинг маршрутов на темы и синхронность styles.css с CURSOR_THEMES.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { CURSOR_THEMES, cursorForRoute, applyCursor } from '../src/ui/cursors.js';
import { ALL_PUZZLES } from '../src/core/state.js';

const PUZZLE_MECHS = ['mirror', 'shelf', 'riddle', 'hang', 'seek', 'path', 'tea', 'mech', 'candle', 'flow', 'brew', 'fate', 'glass'];

test('у каждой механики головоломки своя тема курсора', () => {
  for (const mech of PUZZLE_MECHS) {
    assert.ok(CURSOR_THEMES[mech], `нет темы для механики ${mech}`);
    const p = ALL_PUZZLES.find((x) => (x.mechanic || 'mirror') === mech);
    assert.ok(p, `нет уровня механики ${mech}`);
    assert.equal(cursorForRoute('puzzle', { id: p.id }, {}), mech);
  }
});

test('маппинг маршрутов на темы', () => {
  const cases = {
    hub: ['hub_lavka', { scene: 'lavka' }],
    equip: ['equip', {}],
    shop: ['shop', {}],
    shopArmory: ['shop', {}],
    shopArmorer: ['shop', {}],
    shopMagic: ['shop', {}],
    shopAlchemy: ['shop', {}],
    battles: ['battle', {}],
    battle: ['battle', {}],
    tavern: ['tavern', {}],
    craft: ['craft', {}],
    workshop: ['workshop', {}],
    editor: ['workshop', {}],
    seekeditor: ['workshop', {}],
    sandbox: ['workshop', {}],
    settings: ['default', {}],
    achievements: ['default', {}],
    brewbook: ['default', {}],
    guests: ['default', {}],
    story: ['default', {}],
    board: ['default', {}],
    puzzles: ['default', {}],
  };
  for (const [route, [expected, params]] of Object.entries(cases)) {
    assert.equal(cursorForRoute(route, params, {}), expected, `маршрут ${route}`);
  }
});

test('сцены хаба дают свои темы', () => {
  for (const scene of ['lavka', 'square', 'market', 'cabinet']) {
    assert.equal(cursorForRoute('hub', { scene }), `hub_${scene}`);
  }
});

test('applyCursor ставит body.dataset.cursor и держит сцену хаба', () => {
  const body = { dataset: {} };
  applyCursor('equip', {}, {}, body);
  assert.equal(body.dataset.cursor, 'equip');
  // Хаб с явной сценой переключает тему
  applyCursor('hub', { scene: 'square' }, {}, body);
  assert.equal(body.dataset.cursor, 'hub_square');
  // Хаб без сцены (возврат «как было») не сбрасывает сцену
  applyCursor('hub', {}, {}, body);
  assert.equal(body.dataset.cursor, 'hub_square');
  // Не-hуб тема хаб-фолбэком не затирается
  applyCursor('tavern', {}, {}, body);
  assert.equal(body.dataset.cursor, 'tavern');
  applyCursor('hub', {}, {}, body);
  assert.equal(body.dataset.cursor, 'hub_lavka');
});

test('styles.css содержит оба правила на каждую тему с тем же хотспотом', () => {
  const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
  const keys = Object.keys(CURSOR_THEMES);
  assert.equal(keys.length, 24, 'ожидалось 24 темы курсоров');
  for (const [key, t] of Object.entries(CURSOR_THEMES)) {
    const [x, y] = t.hotspot;
    assert.ok(x >= 0 && x < 32 && y >= 0 && y < 32, `${key}: хотспот вне сетки 32×32`);
    const base = `body[data-cursor="${key}"] { cursor: url("assets/cursors/${key}.png") ${x} ${y}, auto; }`;
    const hover = `body[data-cursor="${key}"] :is(`;
    assert.ok(css.includes(base), `${key}: нет базового правила или хотспот не совпал`);
    assert.ok(css.includes(hover), `${key}: нет hover-правила`);
    assert.ok(css.includes(`${key}_hover.png`) , `${key}: нет hover-файла в правиле`);
  }
});

test('имена файлов курсоров валидны', () => {
  for (const key of Object.keys(CURSOR_THEMES)) {
    assert.match(key, /^[a-z][a-z0-9_]*$/, key);
  }
});
