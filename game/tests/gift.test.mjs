// Тесты механики «Подарок для гостя».
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GIFT_PUZZLES, SOUVENIRS } from '../src/data/puzzlesGift.js';
import {
  createGiftPuzzle, selectGift, undoGift, resetGift, giveGift,
  applyGiftHint, rewardFactor, giftProgress, restartGift,
  brokenConditions, giftFits, validateGiftLevel,
  GIFT_MAX_TRIES, GIFT_FACTORS,
} from '../src/core/giftPuzzle.js';
import { newGame, completePuzzle, findPuzzle, ALL_PUZZLES } from '../src/core/state.js';

const byId = (id) => GIFT_PUZZLES.find((l) => l.id === id);
const mk = (level) => createGiftPuzzle(level, SOUVENIRS);

test('все уровни «Подарка для гостя» валидны: история, витрина, единственный ответ', () => {
  assert.equal(GIFT_PUZZLES.length, 100, 'gift_01–gift_100');
  for (const level of GIFT_PUZZLES) {
    const v = validateGiftLevel(level, SOUVENIRS);
    assert.ok(v.ok, `${level.id} (${level.name}): ${v.problems.join('; ')}`);
  }
});

test('все 66 сувениров встречаются на витринах хотя бы раз', () => {
  const seen = new Set(GIFT_PUZZLES.flatMap((l) => l.shelf));
  for (const id of Object.keys(SOUVENIRS)) {
    assert.ok(seen.has(id), `${id} не попал ни на одну витрину`);
  }
});

test('имена уровней, истории и благодарности уникальны', () => {
  const names = new Set(GIFT_PUZZLES.map((l) => l.name));
  assert.equal(names.size, GIFT_PUZZLES.length, 'имена повторяются');
  const thanks = new Set(GIFT_PUZZLES.map((l) => l.thanks));
  assert.equal(thanks.size, GIFT_PUZZLES.length, 'благодарности повторяются');
});

test('витрина перемешивается при создании (состав не меняется)', () => {
  const level = byId('gift_01');
  const s = createGiftPuzzle(level, SOUVENIRS, () => 0); // детерминированный ГСЧ
  assert.deepEqual([...s.shelf].sort(), [...level.shelf].sort(), 'те же сувениры');
  assert.notDeepEqual(s.shelf, level.shelf, 'порядок перемешан');
});

test('выбор, повторный тап и отмена', () => {
  const s = mk(byId('gift_01'));
  assert.ok(selectGift(s, 'souv_scarf'));
  assert.equal(s.selected, 'souv_scarf');
  // Повторный тап снимает выбор
  assert.ok(selectGift(s, 'souv_scarf'));
  assert.equal(s.selected, null);
  // Отмена возвращает последний выбор
  assert.ok(undoGift(s));
  assert.equal(s.selected, 'souv_scarf');
  // Новый выбор замещает старый, отмена откатывает к нему
  selectGift(s, 'souv_bell');
  assert.equal(s.selected, 'souv_bell');
  undoGift(s);
  assert.equal(s.selected, 'souv_scarf');
  assert.equal(selectGift(s, 'souv_nope'), false, 'нет сувенира не с витрины');
});

test('сброс снимает выбор, но не возвращает спрятанные подсказкой', () => {
  const s = mk(byId('gift_01'));
  const h = applyGiftHint(s);
  assert.ok(h && s.hidden.length === 1);
  selectGift(s, 'souv_scarf');
  resetGift(s);
  assert.equal(s.selected, null);
  assert.equal(s.hidden.length, 1, 'помощь кота необратима');
  assert.equal(selectGift(s, s.hidden[0]), false, 'спрятанное не выбрать');
});

test('верный подарок решает уровень с первой попытки (100% награды)', () => {
  const level = byId('gift_01');
  const s = mk(level);
  selectGift(s, level.answer);
  const res = giveGift(s);
  assert.equal(res.result, 'win');
  assert.equal(rewardFactor(s), 1);
});

test('неверный подарок: честный намёк на первое нарушенное условие', () => {
  const level = byId('gift_01'); // need тёплый, avoid металл
  const s = mk(level);
  selectGift(s, 'souv_bell'); // металл
  const res = giveGift(s);
  assert.equal(res.result, 'hint');
  assert.deepEqual(res.broken, { kind: 'avoid', tag: 'металл' });
  assert.equal(s.tries, 1);
  assert.equal(s.selected, null, 'выбор сброшен после вручения');
  assert.equal(rewardFactor(s), GIFT_FACTORS[1], 'награда растаяла до 75%');
});

test('намёк на недостающее условие идёт после запретов', () => {
  const level = byId('gift_01');
  const s = mk(level);
  selectGift(s, 'souv_honey'); // не тёплый
  const res = giveGift(s);
  assert.deepEqual(res.broken, { kind: 'need', tag: 'тёплый' });
});

test('третья неудача: гость уходит, уровень начинается заново без штрафов', () => {
  const level = byId('gift_01');
  const s = mk(level);
  for (let i = 0; i < GIFT_MAX_TRIES; i++) {
    selectGift(s, 'souv_bell');
    giveGift(s);
  }
  assert.equal(s.gone, true);
  assert.equal(giftProgress(s).gone, true);
  assert.equal(selectGift(s, level.answer), false, 'ушедшему гостю не вручить');
  const fresh = restartGift(s, () => 0.5);
  assert.equal(fresh.tries, 0);
  assert.equal(rewardFactor(fresh), 1, 'переигровка без дополнительных штрафов');
  selectGift(fresh, level.answer);
  assert.equal(giveGift(fresh).result, 'win');
});

test('награда тает: 100% / 75% / 50%', () => {
  const level = byId('gift_01');
  const s = mk(level);
  assert.equal(rewardFactor(s), 1);
  selectGift(s, 'souv_bell'); giveGift(s);
  assert.equal(rewardFactor(s), 0.75);
  selectGift(s, 'souv_bell'); giveGift(s);
  assert.equal(rewardFactor(s), 0.5);
});

test('подсказка прячет самую опасную обманку (ближайшую к ответу по тегам)', () => {
  const level = byId('gift_06'); // answer souv_sachet (ткань, ароматный, спокойный)
  const s = createGiftPuzzle(level, SOUVENIRS, () => 0);
  const h = applyGiftHint(s);
  assert.ok(h, 'подсказка есть');
  assert.ok(s.hidden.includes(h.id));
  assert.notEqual(h.id, level.answer, 'ответ не прячут');
  const tags = SOUVENIRS[h.id].tags;
  assert.ok(brokenConditions(level, h.id, SOUVENIRS).length > 0, 'прячется именно обманка');
  // candle делит с ответом «спокойный» — самый опасный сосед
  assert.equal(h.id, 'souv_candle', `спрятали ${tags.join(',')}`);
});

test('подсказки решают каждый уровень «Подарка для гостя»', () => {
  for (const level of GIFT_PUZZLES) {
    const s = mk(level);
    let guard = 12;
    while (guard-- > 0) {
      if (s.shelf.filter((id) => !s.hidden.includes(id)).length === 1) break;
      const h = applyGiftHint(s);
      assert.ok(h, `${level.id}: подсказка существует, пока есть обманки`);
    }
    const left = s.shelf.filter((id) => !s.hidden.includes(id));
    assert.deepEqual(left, [level.answer], `${level.id}: на витрине остался только ответ`);
    assert.ok(giftFits(level, left[0], SOUVENIRS));
    selectGift(s, left[0]);
    assert.equal(giveGift(s).result, 'win', `${level.id} решается после подсказок`);
  }
});

test('у каждого уровня ровно один подходящий сувенир на витрине', () => {
  for (const level of GIFT_PUZZLES) {
    const fitting = level.shelf.filter((id) => giftFits(level, id, SOUVENIRS));
    assert.deepEqual(fitting, [level.answer], `${level.id}: подходящих ${fitting.length}`);
  }
});

test('тексты уровней и сувениров — по-русски, без латиницы', () => {
  for (const level of GIFT_PUZZLES) {
    assert.ok(!/[a-z]/i.test(level.name), `${level.id}: имя латиницей`);
    assert.ok(!/[a-z]/i.test(level.intro), `${level.id}: интро латиницей`);
    assert.ok(!/[a-z]/i.test(level.thanks), `${level.id}: благодарность латиницей`);
    for (const line of level.story) {
      assert.ok(!/[a-z]/i.test(line), `${level.id}: реплика латиницей`);
    }
    assert.ok(!/[a-z]/i.test(level.guest.name), `${level.id}: гость латиницей`);
  }
  for (const s of Object.values(SOUVENIRS)) {
    assert.ok(!/[a-z]/i.test(s.name), `${s.id}: имя латиницей`);
    assert.ok(!/[a-z]/i.test(s.desc), `${s.id}: описание латиницей`);
    for (const t of s.tags) assert.ok(!/[a-z]/i.test(t), `${s.id}: тег латиницей`);
  }
});

test('уровни «Подарка для гостя» включены в кампанию', () => {
  const ids = ALL_PUZZLES.map((p) => p.id);
  for (const l of GIFT_PUZZLES) assert.ok(ids.includes(l.id), `${l.id} не в кампании`);
});

test('полный цикл: подарок через движок засчитывается в состоянии игры', () => {
  const s = newGame();
  const level = findPuzzle(s, 'gift_01');
  assert.ok(level, 'gift_01 доступна в состоянии игры');
  const p = mk(level);
  // Одна ошибка (75%), потом верный выбор
  selectGift(p, 'souv_bell');
  giveGift(p);
  selectGift(p, level.answer);
  assert.equal(giveGift(p).result, 'win');
  const coinsBefore = s.coins;
  const rewards = completePuzzle(s, 'gift_01', { moves: p.moves, hintsUsed: 0, coinFactor: rewardFactor(p) });
  assert.ok(s.puzzlesDone.gift_01, 'уровень засчитан');
  assert.ok(s.coins > coinsBefore, 'монеты начислены');
  assert.ok(rewards.length > 0);
  const coins = rewards.find((r) => r.type === 'coins');
  assert.equal(coins.amount, Math.round(250 * 0.75), 'награда урезана тающим фактором');
});
