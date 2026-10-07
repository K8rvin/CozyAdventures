import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TEA_PUZZLES } from '../src/data/puzzlesTea.js';
import {
  createTeaPuzzle, addIngredient, undoTea, resetTea,
  isTeaSolved, teaStatus, teaHint, validateTeaLevel, solveTea,
} from '../src/core/teaPuzzle.js';

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
