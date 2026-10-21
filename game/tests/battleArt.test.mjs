// Спрайты бойцов: синхронность art-src/PROMPTS_BATTLE.md с данными юнитов.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { ENEMY_BY_ID } from '../src/data/enemies.js';
import { MERC_BY_ID } from '../src/data/crew.js';

const MD = fs.readFileSync(new URL('../../art-src/PROMPTS_BATTLE.md', import.meta.url), 'utf8');
// knight + наборы оружия рыцаря (двуручное/лук/посох) + наёмники + враги
const EXPECTED_IDS = ['knight', 'knight_twohanded', 'knight_bow', 'knight_staff',
  ...Object.keys(MERC_BY_ID), ...Object.keys(ENEMY_BY_ID)];
const POSES = ['А. Стойка', 'Б. Атака', 'В. Урон', 'Г. Падение', 'Д. Шаг'];

function sections() {
  return [...MD.matchAll(/^### (\d+)\.\s+`([a-z0-9_]+)`/gm)].map((m) => ({ n: +m[1], id: m[2], at: m.index }));
}

test('в файле промтов ровно 80 секций юнитов с нумерацией 1–80 без дыр', () => {
  const secs = sections();
  assert.equal(secs.length, 80, `секций: ${secs.length}`);
  const nums = secs.map((s) => s.n).sort((a, b) => a - b);
  nums.forEach((n, i) => assert.equal(n, i + 1, `дыра или дубль в нумерации: позиция ${i + 1}, номер ${n}`));
});

test('каждый боец из данных игры имеет секцию в PROMPTS_BATTLE.md и лишних нет', () => {
  assert.equal(EXPECTED_IDS.length, 80, `юнитов в данных: ${EXPECTED_IDS.length}`);
  const inFile = new Set(sections().map((s) => s.id));
  for (const id of EXPECTED_IDS) assert.ok(inFile.has(id), `нет секции для ${id}`);
  for (const id of inFile) assert.ok(EXPECTED_IDS.includes(id), `лишняя секция ${id}`);
});

test('у каждого юнита все 5 поз с промтами и строкой файлов', () => {
  const secs = sections();
  for (let i = 0; i < secs.length; i++) {
    const from = secs[i].at;
    const to = i + 1 < secs.length ? secs[i + 1].at : MD.length;
    const block = MD.slice(from, to);
    assert.ok(block.includes(`assets/battle/units/${secs[i].id}_{idle,atk,hurt,down,walk}_web.png`), `${secs[i].id}: нет строки «Файлы:»`);
    for (const p of POSES) assert.ok(block.includes(p), `${secs[i].id}: нет позы «${p}»`);
    const prompts = (block.match(/```/g) || []).length;
    assert.equal(prompts, 10, `${secs[i].id}: промт-блоков ${prompts / 2}, ждали 5`);
  }
});
