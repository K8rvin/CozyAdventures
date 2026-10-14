// Тесты механики «Варка зелий по рецепту».
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createBrewPuzzle, doBrewAction, undoBrew, resetBrew,
  isBrewSolved, brewHint, brewStepText, brewHiddenCount, validateBrewLevel, BREW_MAX_MISTAKES,
} from '../src/core/brewPuzzle.js';
import { BREW_PUZZLES } from '../src/data/puzzlesBrew.js';
import { newGame, completePuzzle, findPuzzle, ALL_PUZZLES } from '../src/core/state.js';

const L1 = BREW_PUZZLES[0]; // brew_01: вода, ромашка, размешать

test('верные действия по рецепту решают варку', () => {
  const p = createBrewPuzzle(L1);
  assert.equal(isBrewSolved(p), false);
  assert.equal(doBrewAction(p, { do: 'add', ingredient: 'water' }).ok, true);
  assert.equal(doBrewAction(p, { do: 'add', ingredient: 'chamomile' }).ok, true);
  const last = doBrewAction(p, { do: 'stir' });
  assert.equal(last.ok, true);
  assert.equal(last.solved, true);
  assert.equal(isBrewSolved(p), true);
});

test('ошибка не двигает прогресс, но считается', () => {
  const p = createBrewPuzzle(L1);
  const r = doBrewAction(p, { do: 'stir' }); // первым шагом — не положено
  assert.equal(r.ok, false);
  assert.equal(r.mistake, true);
  assert.deepEqual(r.expected, { do: 'add', ingredient: 'water' });
  assert.equal(p.progress, 0);
  assert.equal(p.mistakes, 1);
});

test('три ошибки портят зелье и начинают варку заново', () => {
  const p = createBrewPuzzle(L1);
  doBrewAction(p, { do: 'add', ingredient: 'water' }); // верный шаг
  doBrewAction(p, { do: 'stir' });
  doBrewAction(p, { do: 'heat' });
  const r = doBrewAction(p, { do: 'cool' }); // третья ошибка
  assert.equal(r.spoiled, true);
  assert.equal(p.progress, 0, 'прогресс сгорел');
  assert.equal(p.mistakes, 0);
  assert.equal(p.spoiled, 1);
  assert.equal(BREW_MAX_MISTAKES, 3);
});

test('отмена и сброс работают', () => {
  const p = createBrewPuzzle(L1);
  doBrewAction(p, { do: 'add', ingredient: 'water' });
  assert.equal(undoBrew(p), true);
  assert.equal(p.progress, 0);
  doBrewAction(p, { do: 'add', ingredient: 'water' });
  doBrewAction(p, { do: 'add', ingredient: 'chamomile' });
  resetBrew(p);
  assert.equal(p.progress, 0);
  assert.equal(isBrewSolved(p), false);
});

test('подсказка называет следующий шаг', () => {
  const p = createBrewPuzzle(L1);
  const h = brewHint(p);
  assert.equal(h.type, 'step');
  assert.deepEqual(h.step, { do: 'add', ingredient: 'water' });
  doBrewAction(p, { do: 'add', ingredient: 'water' });
  assert.deepEqual(brewHint(p).step, { do: 'add', ingredient: 'chamomile' });
});

test('действие с ингредиентом, которого нет на столе, отклоняется без ошибки рецепта', () => {
  const p = createBrewPuzzle(L1);
  const r = doBrewAction(p, { do: 'add', ingredient: 'pepper' });
  assert.equal(r.ok, false);
  assert.equal(r.mistake, undefined, 'это не ошибка рецепта, а невозможное действие');
  assert.equal(p.mistakes, 0);
});

test('тексты шагов — по-русски, без латинских ключей', () => {
  for (const level of BREW_PUZZLES) {
    for (const step of level.recipe) {
      const text = brewStepText(level, step);
      assert.ok(!/[a-zA-Z]/.test(text), `${level.id}: английское в тексте шага «${text}»`);
    }
    assert.ok(!/[a-zA-Z]/.test(level.intro), `${level.id}: английское во вступлении`);
    for (const ing of level.ingredients) {
      assert.ok(!/[a-zA-Z]/.test(ing.name), `${level.id}: английское имя ингредиента «${ing.name}»`);
    }
  }
});

test('все 100 уровней валидны и решаются своим рецептом', () => {
  assert.equal(BREW_PUZZLES.length, 100);
  const ids = new Set(BREW_PUZZLES.map((l) => l.id));
  assert.equal(ids.size, 100, 'id уровней дублируются');
  for (const level of BREW_PUZZLES) {
    const v = validateBrewLevel(level);
    assert.ok(v.ok, `${level.id}: ${v.problems.join('; ')}`);
  }
});

test('подсказка при шаге «растолочь» возвращает crush-шаг (view подсвечивает сначала ступку)', () => {
  const L3 = BREW_PUZZLES.find((l) => l.id === 'brew_03'); // шаг 2 — растолочь мяту
  const p = createBrewPuzzle(L3);
  doBrewAction(p, { do: 'add', ingredient: 'water' });
  const h = brewHint(p);
  assert.equal(h.type, 'step');
  assert.equal(h.step.do, 'crush', 'шаг — растолчение, не добавление');
  assert.equal(h.step.ingredient, 'mint');
});

test('вариативный шаг anyOf: засчитывается любой вариант, текст с «ИЛИ»', () => {
  const L9 = BREW_PUZZLES.find((l) => l.id === 'brew_09');
  const p = createBrewPuzzle(L9);
  doBrewAction(p, { do: 'add', ingredient: 'water' });
  doBrewAction(p, { do: 'heat' });
  // Шаг 3 — «ягоды ИЛИ мёд»: мёд тоже годится
  const r = doBrewAction(p, { do: 'add', ingredient: 'honey' });
  assert.equal(r.ok, true, 'вариант anyOf должен засчитаться');
  assert.equal(p.progress, 3);
  // Не из списка — ошибка
  const bad = doBrewAction(p, { do: 'add', ingredient: 'salt' });
  assert.equal(bad.mistake, true);
  // Текст шага содержит ИЛИ
  const stepText = brewStepText(L9, L9.recipe[2]);
  assert.ok(stepText.includes(' ИЛИ '), `текст anyOf без ИЛИ: ${stepText}`);
  assert.ok(!/[a-zA-Z]/.test(stepText), 'английское в тексте anyOf');
});

test('режим памяти скрывает хвост по сложности: ранние — 1–2 шага, поздние — почти весь рецепт', () => {
  const byIdBrew = (id) => BREW_PUZZLES.find((l) => l.id === id);
  assert.equal(brewHiddenCount(byIdBrew('brew_06')), 2, 'd3, 6 шагов → 2 последних скрыты');
  assert.equal(brewHiddenCount(byIdBrew('brew_07')), 4, 'd4, 8 шагов → 4 последних скрыты');
  assert.equal(brewHiddenCount(byIdBrew('brew_08')), 8, 'd5, 10 шагов → видны лишь первые 2');
  for (const l of BREW_PUZZLES.filter((x) => x.hideRecipe)) {
    const n = brewHiddenCount(l);
    assert.ok(n >= 1 && n < l.recipe.length, `${l.id}: скрыто ${n} из ${l.recipe.length} — в допуске`);
    if (l.difficulty >= 5) assert.ok(n >= l.recipe.length - 2, `${l.id}: поздний уровень — почти весь рецепт скрыт`);
    if (l.difficulty <= 3) assert.ok(n <= 3, `${l.id}: ранний уровень — скрыто немного`);
  }
  // Явный hideTail в данных побеждает правило по сложности
  const custom = { recipe: [1, 2, 3, 4, 5].map(() => ({ do: 'stir' })), hideRecipe: true, hideTail: 1, difficulty: 5 };
  assert.equal(brewHiddenCount(custom), 1);
});

test('уровни на память — только поздние и с временем показа рецепта', () => {  for (const level of BREW_PUZZLES) {
    if (level.hideRecipe) {
      assert.ok(level.difficulty >= 3, `${level.id}: память слишком рано`);
      assert.ok(level.peekSeconds >= 5, `${level.id}: слишком мало времени на запоминание`);
    }
  }
  assert.ok(BREW_PUZZLES.filter((l) => l.hideRecipe).length >= 2, 'мало уровней на память');
});

test('уровни варки включены в кампанию после потоков', () => {
  const ids = ALL_PUZZLES.map((p) => p.id);
  const brewIdx = ids.indexOf('brew_01');
  assert.ok(brewIdx > ids.indexOf('flow_08'), 'варка должна идти после потоков');
  for (const l of BREW_PUZZLES) assert.ok(ids.includes(l.id), `${l.id} не в кампании`);
});

test('полный цикл: варка через движок засчитывается в состоянии игры', () => {
  const s = newGame();
  const level = findPuzzle(s, 'brew_01');
  assert.ok(level, 'brew_01 доступна в состоянии игры');
  const p = createBrewPuzzle(level);
  for (const step of level.recipe) doBrewAction(p, step);
  assert.ok(isBrewSolved(p));
  const coinsBefore = s.coins;
  const rewards = completePuzzle(s, 'brew_01', { moves: p.moves, hintsUsed: 0 });
  assert.ok(s.puzzlesDone.brew_01, 'уровень засчитан');
  assert.ok(s.coins > coinsBefore, 'монеты начислены');
  assert.ok(rewards.length > 0);
});

test('нож и пипетка: свои действия, ингредиент проверяется на столе', () => {
  const L32 = BREW_PUZZLES.find((l) => l.id === 'brew_32'); // дебют ножа
  const p = createBrewPuzzle(L32);
  doBrewAction(p, { do: 'add', ingredient: 'water' });
  doBrewAction(p, { do: 'heat' });
  assert.equal(doBrewAction(p, { do: 'cut', ingredient: 'lemon' }).ok, true);
  assert.equal(p.progress, 3);
  assert.equal(brewStepText(L32, L32.recipe[2]), 'Нарежь ножом: 🍋 Ломтик лимона');

  const L41 = BREW_PUZZLES.find((l) => l.id === 'brew_41'); // дебют пипетки
  const q = createBrewPuzzle(L41);
  doBrewAction(q, { do: 'add', ingredient: 'water' });
  assert.equal(doBrewAction(q, { do: 'add', ingredient: 'ink' }).mistake, true, 'лить вместо капель — ошибка');
  assert.equal(doBrewAction(q, { do: 'drop', ingredient: 'ink' }).ok, true);
  const bad = doBrewAction(q, { do: 'drop', ingredient: 'pepper' });
  assert.equal(bad.error, 'На столе такого нет');
  assert.equal(q.mistakes, 1, 'невозможное действие не считается ошибкой рецепта');
});

test('крышка: накрыть и снять — отдельные шаги', () => {
  const L51 = BREW_PUZZLES.find((l) => l.id === 'brew_51');
  const p = createBrewPuzzle(L51);
  doBrewAction(p, { do: 'add', ingredient: 'water' });
  doBrewAction(p, { do: 'heat' });
  doBrewAction(p, { do: 'add', ingredient: 'chamomile' });
  assert.equal(doBrewAction(p, { do: 'wait' }).mistake, true, 'без крышки настаивать нельзя');
  assert.equal(doBrewAction(p, { do: 'cover' }).ok, true);
  assert.equal(doBrewAction(p, { do: 'wait' }).ok, true);
  assert.equal(doBrewAction(p, { do: 'uncover' }).ok, true);
  assert.equal(doBrewAction(p, { do: 'stir' }).solved, true);
  assert.equal(brewStepText(L51, L51.recipe[3]), 'Накрой котёл крышкой');
  assert.equal(brewStepText(L51, L51.recipe[5]), 'Сними крышку');
});

test('повторы ×N: шаг засчитывается после N действий, отмена и сброс учитывают повторы', () => {
  const L61 = BREW_PUZZLES.find((l) => l.id === 'brew_61'); // шаг 4 — «Размешай ×2»
  const p = createBrewPuzzle(L61);
  doBrewAction(p, { do: 'add', ingredient: 'water' });
  doBrewAction(p, { do: 'heat' });
  doBrewAction(p, { do: 'add', ingredient: 'berries' });
  assert.equal(doBrewAction(p, { do: 'stir' }).ok, true);
  assert.equal(p.progress, 3, 'после первого мешания шаг не закрыт');
  assert.equal(p.reps, 1);
  assert.equal(doBrewAction(p, { do: 'stir' }).ok, true);
  assert.equal(p.progress, 4, 'после второго мешания шаг засчитан');
  assert.equal(p.reps, 0);
  assert.equal(brewStepText(L61, L61.recipe[3]), 'Размешай ложкой ×2');

  const q = createBrewPuzzle(L61);
  for (const a of [{ do: 'add', ingredient: 'water' }, { do: 'heat' }, { do: 'add', ingredient: 'berries' }, { do: 'stir' }, { do: 'stir' }]) {
    doBrewAction(q, a);
  }
  assert.equal(undoBrew(q), true);
  assert.equal(q.progress, 3, 'отмена вернулась на шаг с повторами');
  assert.equal(q.reps, 1, 'один повтор из двух остался сделанным');
  resetBrew(q);
  assert.equal(q.progress, 0);
  assert.equal(q.reps, 0);
});

test('валидатор: times проверяется и на шаге, и внутри anyOf', () => {
  const base = BREW_PUZZLES.find((l) => l.id === 'brew_61');
  assert.ok(validateBrewLevel(base).ok, 'рецепт с повторами проигрывается до конца');
  const badTimes = { ...base, recipe: [{ do: 'add', ingredient: 'water' }, { do: 'stir', times: 9 }] };
  assert.equal(validateBrewLevel(badTimes).ok, false, 'times вне 1–5 отклоняется');
  const inAnyOf = { ...base, recipe: [{ do: 'add', ingredient: 'water' }, { anyOf: [{ do: 'stir', times: 2 }, { do: 'heat' }] }] };
  assert.equal(validateBrewLevel(inAnyOf).ok, false, 'times внутри anyOf отклоняется');
});

test('100 уровней не повторяются: уникальные имена и рецепты', () => {
  const names = new Set(BREW_PUZZLES.map((l) => l.name));
  assert.equal(names.size, 100, 'имена зелий дублируются');
  const recipes = new Set(BREW_PUZZLES.map((l) => JSON.stringify(l.recipe)));
  assert.equal(recipes.size, 100, 'рецепты дублируются');
});

test('новые механики вводятся по главам: дебют без памяти, дальше используются регулярно', () => {
  const stepsOf = (l) => l.recipe.flatMap((s) => (Array.isArray(s.anyOf) ? [s, ...s.anyOf] : [s]));
  const withDo = (d) => BREW_PUZZLES.filter((l) => stepsOf(l).some((s) => s.do === d));
  for (const d of ['cut', 'drop', 'cover', 'uncover']) {
    const levels = withDo(d);
    assert.ok(levels.length >= 5, `${d}: механика используется слишком редко (${levels.length})`);
    assert.ok(!levels[0].hideRecipe, `${d}: дебют (${levels[0].id}) должен быть без режима памяти`);
  }
  const withTimes = BREW_PUZZLES.filter((l) => l.recipe.some((s) => (s.times ?? 1) > 1));
  assert.ok(withTimes.length >= 5, 'повторы ×N используются слишком редко');
  assert.ok(!withTimes[0].hideRecipe, 'дебют повторов — без режима памяти');
  assert.equal(withDo('cut')[0].id, 'brew_32', 'нож дебютирует в своей главе');
  assert.equal(withDo('drop')[0].id, 'brew_41', 'пипетка дебютирует в своей главе');
  assert.equal(withDo('cover')[0].id, 'brew_51', 'крышка дебютирует в своей главе');
  assert.equal(withTimes[0].id, 'brew_61', 'повторы дебютируют в своей главе');
});
