import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { SPIN_PUZZLES } from '../src/data/puzzlesSpin.js';
import {
  createSpinPuzzle, rotatePiece, undoSpin, resetSpin,
  isSpinSolved, spinStatus, spinHint, parMoves, hashSeed, validateSpinLevel,
} from '../src/core/spinPuzzle.js';

test('все уровни «Гобелены ветров» валидны', () => {
  const ids = new Set();
  for (const level of SPIN_PUZZLES) {
    const v = validateSpinLevel(level);
    assert.ok(v.ok, `${level.id} (${level.name}): ${v.problems.join('; ')}`);
    assert.ok(!ids.has(level.id), `дубль id ${level.id}`);
    ids.add(level.id);
    assert.equal(level.mechanic, 'spin', `${level.id}: mechanic должен быть spin`);
    // Русские строки заполнены
    assert.ok(/[А-Яа-яЁё]/.test(level.name), `${level.id}: name по-русски`);
    assert.ok(/[А-Яа-яЁё]/.test(level.intro), `${level.id}: intro по-русски`);
    // Картинка существует в рантайме
    assert.ok(level.image.startsWith('assets/'), `${level.id}: image из assets/`);
    assert.ok(fs.existsSync(new URL(`../${level.image}`, import.meta.url)),
      `${level.id}: файл ${level.image} не найден`);
  }
});

test('ровно сто уровней, нумерация sp_01..sp_100 без дыр', () => {
  assert.equal(SPIN_PUZZLES.length, 100, 'должно быть 100 уровней');
  SPIN_PUZZLES.forEach((level, i) => {
    const expected = `sp_${String(i + 1).padStart(2, '0')}`;
    assert.equal(level.id, expected, `позиция ${i + 1}: ожидался ${expected}`);
  });
});

test('имена и интро всех ста уровней уникальны', () => {
  const names = new Set();
  const intros = new Set();
  for (const level of SPIN_PUZZLES) {
    assert.ok(!names.has(level.name), `дубль имени «${level.name}» (${level.id})`);
    names.add(level.name);
    assert.ok(!intros.has(level.intro), `дубль интро (${level.id})`);
    intros.add(level.intro);
  }
});

test('сложность не убывает по цепочке', () => {
  let prev = 0;
  for (const level of SPIN_PUZZLES) {
    assert.ok(level.difficulty >= prev,
      `${level.id}: сложность ${level.difficulty} ниже предыдущей ${prev}`);
    prev = level.difficulty;
  }
});

test('комбинация картинки и раскройки уникальна у каждого уровня', () => {
  const combos = new Set();
  for (const level of SPIN_PUZZLES) {
    const key = [level.image, level.grid.join('x'),
      (level.anchors || []).join(','), level.goldRim === false ? 'blind' : 'rim'].join('|');
    assert.ok(!combos.has(key), `дубль комбинации: ${key} (${level.id})`);
    combos.add(key);
  }
});

test('начальные повороты детерминированы и гобелен не собран на старте', () => {
  const level = SPIN_PUZZLES[0];
  const a = createSpinPuzzle(level);
  const b = createSpinPuzzle(level);
  assert.deepEqual(a.rot, b.rot, 'одинаковый seed → одинаковые повороты');
  assert.ok(!isSpinSolved(a), 'на старте не решено');
  const st = spinStatus(a);
  assert.ok(st.placed <= st.total - Math.ceil(st.total * 0.6), 'большинство лоскутов повёрнуты');
});

test('поворот, отмена и сброс', () => {
  const level = SPIN_PUZZLES.find((l) => l.id === 'sp_03');
  const s = createSpinPuzzle(level);
  const start = [...s.rot];
  assert.equal(rotatePiece(s, -1), false, 'клетка вне поля — не ход');
  assert.equal(rotatePiece(s, 99), false, 'клетка вне поля — не ход');
  rotatePiece(s, 0);
  assert.equal(s.rot[0], (start[0] + 1) % 4);
  assert.equal(s.moves, 1);
  undoSpin(s);
  assert.deepEqual(s.rot, start, 'отмена вернула поворот');
  rotatePiece(s, 2);
  rotatePiece(s, 3);
  resetSpin(s);
  assert.deepEqual(s.rot, start, 'сброс вернул начальные повороты');
  assert.equal(s.history.length, 0);
});

test('якоря не крутятся и всегда верны', () => {
  const level = SPIN_PUZZLES.find((l) => l.id === 'sp_05');
  const s = createSpinPuzzle(level);
  assert.ok(level.anchors.length >= 2, 'у sp_05 должны быть якоря');
  for (const a of level.anchors) {
    assert.equal(s.rot[a], 0, `якорь ${a} на старте верен`);
    assert.equal(rotatePiece(s, a), false, `якорь ${a} не крутится`);
  }
  assert.equal(s.moves, 0, 'неуспешные повороты не считаются ходами');
});

test('эталон равен сумме тапов до сборки и достижим', () => {
  for (const level of SPIN_PUZZLES) {
    const s = createSpinPuzzle(level);
    const par = parMoves(s);
    assert.ok(par > 0, `${level.id}: эталон больше нуля`);
    // Собираем ровно за эталон: каждый лоскут чинится за (4 - rot) % 4 тапов
    const total = level.grid[0] * level.grid[1];
    for (let cell = 0; cell < total; cell++) {
      while (s.rot[cell] !== 0) rotatePiece(s, cell);
    }
    assert.ok(isSpinSolved(s), `${level.id} собран`);
    assert.equal(s.moves, par, `${level.id}: собран за эталонное число ходов`);
  }
});

test('подсказки приводят к решению на всех уровнях', () => {
  for (const level of SPIN_PUZZLES) {
    const s = createSpinPuzzle(level);
    let guard = parMoves(s) + 5;
    while (!isSpinSolved(s) && guard-- > 0) {
      const h = spinHint(s);
      if (h.type === 'already') break;
      assert.equal(h.type, 'rotate', `${level.id}: неожиданный тип подсказки`);
      assert.ok(s.rot[h.cell] !== 0, `${level.id}: клетка реально не в нуле`);
      assert.equal(h.left, (4 - s.rot[h.cell]) % 4, `${level.id}: left — тапов до верного`);
      const before = s.rot[h.cell];
      rotatePiece(s, h.cell);
      assert.equal(s.rot[h.cell], (before + 1) % 4, `${level.id}: подсказка крутит по часовой`);
    }
    assert.ok(isSpinSolved(s), `${level.id} должен решаться подсказками`);
  }
  // На собранном гобелене подсказка — «уже»
  const done = createSpinPuzzle(SPIN_PUZZLES[0]);
  const total = SPIN_PUZZLES[0].grid[0] * SPIN_PUZZLES[0].grid[1];
  for (let cell = 0; cell < total; cell++) {
    while (done.rot[cell] !== 0) rotatePiece(done, cell);
  }
  assert.equal(spinHint(done).type, 'already');
});

test('дебюты механик по уровням', () => {
  const byId = new Map(SPIN_PUZZLES.map((l) => [l.id, l]));
  // Якоря дебютируют на sp_05, раньше их нет
  for (const l of SPIN_PUZZLES) {
    const hasAnchors = (l.anchors || []).length > 0;
    if (l.id < 'sp_05') assert.ok(!hasAnchors, `${l.id}: якоря раньше sp_05`);
  }
  assert.ok(byId.get('sp_05').anchors.length > 0, 'sp_05: дебют якорей');
  // «Слепые» уровни (без каймы) дебютируют на sp_09
  for (const l of SPIN_PUZZLES) {
    if (l.id < 'sp_09') assert.ok(l.goldRim !== false, `${l.id}: goldRim выкл раньше sp_09`);
  }
  assert.equal(byId.get('sp_09').goldRim, false, 'sp_09: дебют слепых уровней');
});

test('hashSeed стабилен и различается между уровнями', () => {
  assert.equal(hashSeed('sp_01'), hashSeed('sp_01'));
  assert.notEqual(hashSeed('sp_01'), hashSeed('sp_02'));
});
