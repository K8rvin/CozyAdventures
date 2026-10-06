import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SHELF_PUZZLES } from '../src/data/puzzlesShelf.js';
import {
  createShelfPuzzle, placeItem, removeItem, undoShelf, resetShelf,
  violations, isShelfSolved, solveShelf, shelfHint, shelfCells,
} from '../src/core/shelfPuzzle.js';

test('все 10 уровней мира 2 решаемы', () => {
  for (const level of SHELF_PUZZLES) {
    const r = solveShelf(level);
    assert.ok(r.count > 0, `уровень ${level.id} (${level.name}) должен быть решаем`);
  }
});

test('в уровнях нет дублей клеток и предметов больше, чем полок', () => {
  for (const level of SHELF_PUZZLES) {
    const keys = new Set(level.cells.map((c) => c.pos.join(',')));
    assert.equal(keys.size, level.cells.length, `${level.id}: дубли клеток`);
    assert.ok(level.items.length <= shelfCells(level).length, `${level.id}: предметов больше чем полок`);
    const itemIds = new Set(level.items.map((i) => i.id));
    assert.equal(itemIds.size, level.items.length, `${level.id}: дубли предметов`);
  }
});

test('нарушение правила notAdjacent обнаруживается', () => {
  const level = SHELF_PUZZLES.find((l) => l.id === 'tw_01');
  const s = createShelfPuzzle(level);
  // Молоток рядом с зельем (fragile-heavy) — нарушение
  placeItem(s, 'i_hammer', 0, 0);
  placeItem(s, 'i_potion', 1, 0);
  placeItem(s, 'i_herbs', 2, 0);
  const v = violations(s);
  assert.ok(v.some((x) => x.rule === 'notAdjacent'));
  assert.equal(isShelfSolved(s), false);
});

test('правильная расстановка решает уровень tw_01', () => {
  const level = SHELF_PUZZLES.find((l) => l.id === 'tw_01');
  const s = createShelfPuzzle(level);
  placeItem(s, 'i_hammer', 0, 0);
  placeItem(s, 'i_herbs', 1, 0);
  placeItem(s, 'i_potion', 2, 0);
  assert.equal(isShelfSolved(s), true);
});

test('правило onLight работает', () => {
  const level = SHELF_PUZZLES.find((l) => l.id === 'tw_03');
  const s = createShelfPuzzle(level);
  // Кристалл (glow) не на свету — нарушение
  placeItem(s, 'i_crystal', 0, 1);
  const v = violations(s);
  assert.ok(v.some((x) => x.rule === 'onLight' && x.itemA === 'i_crystal'));
});

test('тексты нарушений строго на русском (без английских тегов)', () => {
  // Собираем нарушения mustAdjacent на уровне с едой
  const level = SHELF_PUZZLES.find((l) => l.id === 'tw_05');
  const s = createShelfPuzzle(level);
  // Ставим молоток подальше ото всех — еда не сможет стоять рядом с едой
  placeItem(s, 'i_hammer', 0, 0);
  placeItem(s, 'i_bread', 2, 0);
  const v = violations(s);
  assert.ok(v.length > 0);
  for (const x of v) {
    assert.ok(!/\b(fragile|heavy|metal|magic|potion|herb|food|glow)\b/.test(x.text),
      `английский тег в тексте: ${x.text}`);
  }
  assert.ok(v.some((x) => x.text.includes('едой')), 'ожидается «рядом с едой»');
});

test('отмена и сброс', () => {
  const level = SHELF_PUZZLES.find((l) => l.id === 'tw_01');
  const s = createShelfPuzzle(level);
  placeItem(s, 'i_hammer', 0, 0);
  assert.ok(s.placement.i_hammer);
  undoShelf(s);
  assert.ok(!s.placement.i_hammer);
  placeItem(s, 'i_hammer', 0, 0);
  resetShelf(s);
  assert.ok(!s.placement.i_hammer);
});

test('нельзя поставить два предмета в одну клетку или вне полки', () => {
  const level = SHELF_PUZZLES.find((l) => l.id === 'tw_01');
  const s = createShelfPuzzle(level);
  assert.ok(placeItem(s, 'i_hammer', 0, 0).ok);
  assert.equal(placeItem(s, 'i_herbs', 0, 0).ok, false, 'клетка занята');
  assert.equal(placeItem(s, 'i_herbs', 0, 1).ok, false, 'не полка');
  assert.equal(placeItem(s, 'нет_такого', 1, 0).ok, false);
});

test('подсказка ведёт к решению', () => {
  const level = SHELF_PUZZLES.find((l) => l.id === 'tw_05');
  const s = createShelfPuzzle(level);
  let guard = 30;
  while (!isShelfSolved(s) && guard-- > 0) {
    const h = shelfHint(s);
    if (h.type === 'already') break;
    if (h.type === 'place') {
      const r = placeItem(s, h.itemId, h.pos[0], h.pos[1]);
      assert.ok(r.ok, `подсказка должна быть легальным ходом: ${h.itemId}`);
    } else if (h.type === 'move' || h.type === 'remove') {
      removeItem(s, h.itemId);
      if (h.type === 'move') placeItem(s, h.itemId, h.pos[0], h.pos[1]);
    } else {
      break;
    }
  }
  assert.ok(isShelfSolved(s), 'подсказки должны привести к решению tw_05');
});

test('подсказка для каждого уровня мира 2 приводит к решению', () => {
  for (const level of SHELF_PUZZLES) {
    const s = createShelfPuzzle(level);
    let guard = 40;
    while (!isShelfSolved(s) && guard-- > 0) {
      const h = shelfHint(s);
      if (h.type === 'already') break;
      if (h.type === 'place') placeItem(s, h.itemId, h.pos[0], h.pos[1]);
      else if (h.type === 'move') { removeItem(s, h.itemId); placeItem(s, h.itemId, h.pos[0], h.pos[1]); }
      else if (h.type === 'remove') removeItem(s, h.itemId);
      else assert.fail(`${level.id}: подсказка ${h.type}`);
    }
    assert.ok(isShelfSolved(s), `уровень ${level.id} должен решаться по подсказкам`);
  }
});
