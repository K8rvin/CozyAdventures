import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BOOK_PUZZLES } from '../src/data/puzzlesBook.js';
import { RIDDLE_CHAPTERS, riddleChapter } from '../src/data/riddleChapters.js';

const RIDDLE = BOOK_PUZZLES.filter((p) => p.mechanic === 'riddle');
const byId = (id) => RIDDLE.find((p) => p.id === id);

test('100 загадок разбиты на 10 оформленных глав, каждая десятая — финальная', () => {
  assert.equal(RIDDLE.length, 100);
  assert.equal(RIDDLE_CHAPTERS.length, 10);
  const themes = new Set();
  RIDDLE.forEach((level, i) => {
    const chapter = riddleChapter(level);
    assert.equal(chapter.number, Math.floor(i / 10) + 1, `${level.id}: номер главы`);
    assert.equal(chapter.levelInChapter, (i % 10) + 1, `${level.id}: страница главы`);
    assert.equal(chapter.finale, i % 10 === 9, `${level.id}: финальная страница`);
    assert.ok(chapter.name && chapter.greeting, `${level.id}: название и реплика главы`);
    assert.ok(chapter.icon && chapter.ornament, `${level.id}: украшения главы`);
    assert.ok(chapter.catArt.startsWith('assets/'), `${level.id}: портрет кота`);
    assert.notEqual(chapter.catArt, 'assets/crew/cmp_cat.webp', `${level.id}: без ассета со свернувшимся котом`);
    themes.add(chapter.theme);
  });
  assert.deepEqual([...themes].sort(), ['amber', 'dawn', 'frost', 'herbs', 'rain']);

  assert.equal(riddleChapter(byId('bk_110')).finale, true, 'первая глава заканчивается печатью');
  assert.equal(riddleChapter(byId('bk_111')).number, 2);
  assert.equal(riddleChapter(byId('bk_111')).levelInChapter, 1);
  assert.equal(riddleChapter(byId('bk_120')).name, 'Дождь за окном');
  assert.equal(riddleChapter(byId('bk_120')).finale, true);
  assert.equal(riddleChapter(byId('bk_200')).number, 10);
  assert.equal(riddleChapter(byId('bk_200')).finale, true);
});
