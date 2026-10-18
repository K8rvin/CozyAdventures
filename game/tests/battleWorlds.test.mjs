// Плитки миров в «Походах рыцаря»: у каждого мира с боями есть арт плитки
// по конвенции assets/battle/battle_bg_<world>_web.jpg (её использует battleView).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BATTLES } from '../src/data/battles.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

test('походы: у каждого мира существует фон для плитки', () => {
  const worlds = [];
  for (const b of BATTLES) {
    if (b.wanted) continue;
    if (!worlds.includes(b.world)) worlds.push(b.world);
  }
  assert.equal(worlds.length, 12, 'в походах двенадцать миров');
  for (const w of worlds) {
    const file = path.join(root, 'assets', 'battle', `battle_bg_${w}_web.jpg`);
    assert.ok(fs.existsSync(file), `нет арта плитки для мира ${w}: ${file}`);
  }
});
