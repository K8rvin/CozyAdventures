import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newGame, runBattle, applyCheat, equipFromInventory, loadGame } from '../src/core/state.js';
import { TROPHIES, MINI_TROPHIES, TROPHY_BY_BATTLE } from '../src/data/trophies.js';
import { BATTLE_BY_ID } from '../src/data/battles.js';

// Рыцарь в легендарном комплекте — гарантированно проходит ранних боссов
function legendKnight() {
  const s = newGame();
  applyCheat(s, 'РЫЦАРЬ');
  for (let i = s.inventory.length - 1; i >= 0; i--) {
    if (!s.inventory[i].startsWith('pot_')) equipFromInventory(s, i);
  }
  return s;
}

test('трофеи: у каждого — существующий бой, уникальный id и русские тексты', () => {
  const ids = new Set();
  for (const t of [...TROPHIES, ...MINI_TROPHIES]) {
    assert.ok(!ids.has(t.id), `дубль id ${t.id}`);
    ids.add(t.id);
    assert.ok(BATTLE_BY_ID[t.battleId], `${t.id}: нет боя ${t.battleId}`);
    assert.ok(t.name && t.lore && !/[a-z]/i.test(t.name), `${t.id}: имя по-русски`);
  }
  assert.equal(TROPHIES.length, 12, '12 трофеев боссов');
  assert.equal(MINI_TROPHIES.length, 4, '4 жетона розыска');
});

test('трофей выдаётся за первую победу над боссом и не дублируется', () => {
  const s = legendKnight();
  // Открываем цепочку до Старой ивы
  for (const id of ['bt_slimes', 'bt_bees', 'bt_moths', 'bt_spirits', 'bt_golem', 'bt_fireflies', 'bt_overgrowth', 'bt_hunt_trail', 'meadow_crowd_4', 'meadow_crowd_5', 'meadow_crowd_6']) {
    s.battlesDone[id] = { victories: 1 };
  }
  const r1 = runBattle(s, 'bt_boss_willow', 1);
  assert.ok(r1.victory, 'легендарный комплект проходит иву');
  assert.ok(s.trophies.includes('willow_branch'), 'ветвь ивы получена');
  assert.ok(r1.rewards.some((r) => r.type === 'note' && /ветвь/i.test(r.text)), 'в наградах есть записка о трофее');
  assert.ok(s.journal.some((j) => j.icon === '🏆'), 'дневник кота записал трофей');
  const before = s.trophies.length;
  runBattle(s, 'bt_boss_willow', 2);
  assert.equal(s.trophies.length, before, 'повторная победа не дублирует трофей');
});

test('мини-трофей выдаётся за розыскной лист', () => {
  const s = legendKnight();
  s.battlesDone.bt_boss_willow = { victories: 1 };
  const r = runBattle(s, 'wnt_bee_queen', 1);
  assert.ok(r.victory, 'рой королевы побеждён');
  assert.ok(s.trophies.includes('mini_bee'), 'сота Королевы пчёл получена');
});

test('миграция старого сейва: поля трофеев появляются', () => {
  const old = newGame();
  delete old.trophies;
  delete old.trophiesSeen;
  const mem = { cozy_adventures_save_v2: JSON.stringify(old) };
  const storage = { getItem: (k) => mem[k] ?? null, setItem: (k, v) => { mem[k] = v; } };
  const loaded = loadGame(storage);
  assert.deepEqual(loaded.trophies, []);
  assert.deepEqual(loaded.trophiesSeen, []);
});
