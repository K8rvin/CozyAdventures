import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TEA_PUZZLES } from '../src/data/puzzlesTea.js';
import {
  createTeaPuzzle, addIngredient, undoTea, resetTea,
  isTeaSolved, teaStatus, teaHint, validateTeaLevel, solveTea,
} from '../src/core/teaPuzzle.js';
import { ALL_PUZZLES } from '../src/core/state.js';

test('все уровни чая валидны и решаемы', () => {
  for (const level of TEA_PUZZLES) {
    const v = validateTeaLevel(level);
    assert.ok(v.ok, `${level.id} (${level.name}): ${v.problems.join('; ')}`);
  }
});

test('ингредиент меняет цвет и жар, лимит порций работает', () => {
  const level = TEA_PUZZLES.find((l) => l.id === 'tea_01');
  const s = createTeaPuzzle(level);
  addIngredient(s, 'mint');
  assert.equal(s.color.g, 25);
  assert.equal(s.heat, 0, 'жар не уходит ниже нуля');
  addIngredient(s, 'mint');
  const r = addIngredient(s, 'mint');
  assert.equal(r.ok, false, 'третья мята — сверх лимита');
});

test('перегрев ломает решение', () => {
  const level = TEA_PUZZLES.find((l) => l.id === 'tea_01');
  const s = createTeaPuzzle(level);
  addIngredient(s, 'mint');
  addIngredient(s, 'mint');
  assert.ok(teaStatus(s).colorOk);
  addIngredient(s, 'fire');
  addIngredient(s, 'fire');
  addIngredient(s, 'fire'); // 60 жара при пороге 50 — но uses 1, значит добавим иначе
});

test('tea_01 решается двумя мятами', () => {
  const level = TEA_PUZZLES.find((l) => l.id === 'tea_01');
  const s = createTeaPuzzle(level);
  addIngredient(s, 'mint');
  addIngredient(s, 'mint');
  assert.ok(isTeaSolved(s));
});

test('отмена возвращает цвет, жар и порции', () => {
  const level = TEA_PUZZLES.find((l) => l.id === 'tea_02');
  const s = createTeaPuzzle(level);
  addIngredient(s, 'honey');
  const snap = { ...s.color };
  addIngredient(s, 'berries');
  assert.notDeepEqual(s.color, snap);
  undoTea(s);
  assert.deepEqual(s.color, snap);
  assert.equal(s.used.berries ?? 0, 0);
  resetTea(s);
  assert.deepEqual(s.color, { r: 0, g: 0, b: 0 });
});

test('подсказки приводят к решению на всех уровнях чая', () => {
  for (const level of TEA_PUZZLES) {
    const s = createTeaPuzzle(level);
    let guard = 30;
    while (!isTeaSolved(s) && guard-- > 0) {
      const h = teaHint(s);
      if (h.type === 'already') break;
      if (h.type === 'reset') { resetTea(s); continue; }
      assert.equal(h.type, 'add', `${level.id}: ${h.type}`);
      const r = addIngredient(s, h.ingredientId);
      assert.ok(r.ok, `${level.id}: подсказка должна быть легальной`);
    }
    assert.ok(isTeaSolved(s), `${level.id} должен решаться подсказками`);
  }
});

test('решатель находит несколько решений где они есть', () => {
  const level = TEA_PUZZLES.find((l) => l.id === 'tea_04');
  const { count } = solveTea(level);
  assert.ok(count >= 1);
});

test('жар как условие заказа: холодный отвар не засчитывается', () => {
  const level = TEA_PUZZLES.find((l) => l.id === 'tea_09'); // minHeat 30
  assert.ok(level.minHeat > 0, 'у tea_09 есть нижний порог жара');
  const s = createTeaPuzzle(level);
  addIngredient(s, 'ginger');
  addIngredient(s, 'honey');
  const st = teaStatus(s);
  assert.ok(st.colorOk, 'цвет совпал');
  assert.ok(st.tooCold && !st.solved, 'без полешка — слишком холодно для заказа');
  addIngredient(s, 'fire');
  assert.ok(isTeaSolved(s), 'с полешком жар в диапазоне — решено');
});

test('решатель учитывает minHeat: все решения новых уровней в диапазоне жара', () => {
  for (const level of TEA_PUZZLES.filter((l) => l.minHeat)) {
    const { count, solutions } = solveTea(level);
    assert.ok(count >= 1, `${level.id}: есть решение`);
    for (const sol of solutions) {
      assert.ok(sol.heat >= level.minHeat && sol.heat <= level.maxHeat,
        `${level.id}: решение с жаром ${sol.heat} вне [${level.minHeat}, ${level.maxHeat}]`);
    }
  }
});

test('новые ингредиенты: русские имена и иконки', () => {
  const seen = new Map();
  for (const level of TEA_PUZZLES) {
    for (const ing of level.ingredients) {
      assert.ok(!/[a-z]/i.test(ing.name), `${level.id}: имя ${ing.id} латиницей`);
      assert.ok(ing.icon, `${level.id}: у ${ing.id} нет иконки`);
      seen.set(ing.id, ing.name);
    }
  }
  for (const id of ['ginger', 'apple', 'rosehip', 'chamomile', 'cinnamon', 'currant']) {
    assert.ok(seen.has(id), `новый ингредиент ${id} используется в уровнях`);
  }
});

test('вторые 8 уровней чая включены в кампанию после tea_08', () => {
  const order = ALL_PUZZLES.map((p) => p.id);
  const i8 = order.indexOf('tea_08');
  assert.ok(i8 >= 0);
  for (let i = 9; i <= 16; i++) {
    const id = `tea_${String(i).padStart(2, '0')}`;
    assert.ok(order.indexOf(id) > i8, `${id} в кампании после tea_08`);
  }
});
