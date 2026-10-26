import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BATTLES, BATTLE_BY_ID } from '../src/data/battles.js';
import { ENEMY_BY_ID } from '../src/data/enemies.js';
import { battleEconomy } from '../src/core/economy.js';
import { enemyFormationSlots, slotToCell } from '../src/core/formBattle.js';
import { createProfile } from '../tools/sim-world.mjs';
import { runBattle } from '../src/core/state.js';

const WORLDS = ['meadow', 'town', 'attic', 'crossroads', 'nm', 'sw', 'sf', 'cr', 'ash', 'jade', 'deep', 'mist'];
const PROFILES = ['endgame', 'available', 'reasonable', 'upgrade'];
const crowdId = (world, count) => `${world}_crowd_${count}`;

test('большие сборы: 36 боёв, корректные цепочки, тексты и расстановка', () => {
  assert.equal(BATTLES.filter((battle) => !battle.wanted).length, 236);
  assert.equal(BATTLES.length, 240);
  assert.equal(new Set(BATTLES.map((battle) => battle.id)).size, BATTLES.length);

  for (const world of WORLDS) {
    const powers = [];
    for (const count of [4, 5, 6]) {
      const id = crowdId(world, count);
      const battle = BATTLE_BY_ID[id];
      assert.ok(battle, `${id}: бой не найден`);
      assert.equal(battle.world, world);
      assert.equal(battle.enemies.length, count);
      assert.ok(battle.name && battle.tip, `${id}: нужны русские имя и совет`);
      assert.ok(!/[a-z]/i.test(battle.name), `${id}: имя содержит латиницу`);
      assert.ok(!/[a-z]/i.test(battle.tip), `${id}: совет содержит латиницу`);
      assert.equal(battle.obstacles, undefined, `${id}: препятствия не входят в этот пакет`);
      assert.equal(battle.rewards, undefined, `${id}: награды только derived-слой`);
      assert.equal(battle.economy, undefined, `${id}: нет ручной экономики`);
      assert.ok(BATTLE_BY_ID[battle.unlockAfter], `${id}: нет предшественника`);

      const index = BATTLES.findIndex((candidate) => candidate.id === id);
      assert.ok(index > 0, `${id}: нет позиции в массиве`);
      assert.equal(BATTLES[index - 1].id, battle.unlockAfter, `${id}: порядок массива не совпадает с цепочкой`);
      if (count < 6) assert.equal(BATTLES[index + 1].id, crowdId(world, count + 1));
      else {
        const boss = BATTLES[index + 1];
        assert.equal(boss.unlockAfter, id, `${world}: босс не следует за сбором из шести`);
      }

      const cells = new Set();
      const slots = enemyFormationSlots(battle.enemies);
      assert.equal(new Set(slots).size, count, `${id}: слоты наслоились`);
      battle.enemies.forEach((entry, i) => {
        const enemy = ENEMY_BY_ID[entry.id];
        assert.ok(enemy, `${id}: неизвестный враг ${entry.id}`);
        assert.equal(enemy.boss, undefined, `${id}: большой сбор не должен содержать босса`);
        assert.ok(entry.scale > 0, `${id}: масштаб должен быть положительным`);
        const [x, y] = slotToCell(slots[i], 'enemy');
        const key = `${x},${y}`;
        assert.ok(!cells.has(key), `${id}: клетка ${key} занята дважды`);
        cells.add(key);
      });
      powers.push(battleEconomy(battle).power);
    }
    assert.ok(powers[0] < powers[1] && powers[1] < powers[2],
      `${world}: мощь должна расти 4 → 5 → 6: ${powers.join(' → ')}`);
  }
});

for (const world of WORLDS) {
  test(`большие сборы ${world}: четыре профиля на 24 seed`, () => {
    for (const count of [4, 5, 6]) {
      const id = crowdId(world, count);
      for (const profile of PROFILES) {
        const { state } = createProfile(id, profile);
        let wins = 0;
        for (let seed = 1; seed <= 24; seed += 1) {
          if (runBattle(structuredClone(state), id, seed)?.victory) wins += 1;
        }
        let minimum = 10;
        if (profile === 'available') minimum = 23;
        else if (world === 'meadow' && profile === 'reasonable') minimum = { 4: 10, 5: 5, 6: 3 }[count];
        if (world === 'meadow' && profile === 'upgrade') {
          const { state: reasonable } = createProfile(id, 'reasonable');
          let reasonableWins = 0;
          for (let seed = 1; seed <= 24; seed += 1) {
            if (runBattle(structuredClone(reasonable), id, seed)?.victory) reasonableWins += 1;
          }
          minimum = reasonableWins;
        }
        assert.ok(wins >= minimum, `${id}/${profile}: ${wins}/24, нужно минимум ${minimum}/24`);
      }
    }
  });
}
