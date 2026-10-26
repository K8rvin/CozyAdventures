import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BATTLE_LORE } from '../src/data/battleLore.js';
import { GUEST_BY_ID } from '../src/data/guests.js';
import { BATTLE_BY_ID } from '../src/data/battles.js';
import { ENEMY_BY_ID } from '../src/data/enemies.js';
import {
  battleLoreFinalBattle, battleLoreIntroRoute, battleLoreOutroRoute,
  battleLoreSeen, markBattleLoreSeen,
} from '../src/core/battleLore.js';
import { battleAvailable, loadGame, newGame, nextBattle, saveGame } from '../src/core/state.js';

const WORLDS = ['meadow', 'town', 'attic', 'crossroads', 'nm', 'sw', 'sf', 'cr', 'ash', 'jade', 'deep', 'mist'];

test('лор походов: 24 сцены, существующие гости и финальные боссы', () => {
  assert.deepEqual(Object.keys(BATTLE_LORE), WORLDS);
  for (const world of WORLDS) {
    const finalBattle = battleLoreFinalBattle(world);
    assert.ok(finalBattle, `${world}: нет финального боя`);
    assert.equal(finalBattle.world, world);
    assert.equal(finalBattle.unlockAfter, `${world}_crowd_6`);
    const firstEnemy = finalBattle.enemies[0];
    const enemyId = typeof firstEnemy === 'string' ? firstEnemy : firstEnemy.id;
    assert.ok(BATTLE_BY_ID[finalBattle.id] && ENEMY_BY_ID[enemyId]?.boss, `${world}: финал не босс`);
    for (const kind of ['intro', 'outro']) {
      const scene = BATTLE_LORE[world][kind];
      assert.ok(scene?.title && !/[a-z]/i.test(scene.title), `${world}/${kind}: русский заголовок`);
      assert.ok(scene.steps.length >= 2 && scene.steps.length <= 3, `${world}/${kind}: 2–3 кадра`);
      for (const step of scene.steps) {
        assert.ok(GUEST_BY_ID[step.guestId], `${world}/${kind}: нет гостя ${step.guestId}`);
        assert.notEqual(step.guestId, 'keeper', 'хозяин лавки не говорит');
        assert.ok(step.text && !/[a-z]/i.test(step.text), `${world}/${kind}: русская реплика`);
      }
    }
  }
});

test('просмотр отмечается явно и не меняет story или onboarding', () => {
  const state = newGame();
  const before = { story: structuredClone(state.story), onboarding: structuredClone(state.onboarding) };
  assert.deepEqual(battleLoreIntroRoute(state, 'bt_slimes'),
    { world: 'meadow', kind: 'intro', battleId: 'bt_slimes' });
  assert.equal(battleLoreSeen(state, 'meadow', 'intro'), false);
  assert.equal(markBattleLoreSeen(state, 'meadow', 'intro'), true);
  assert.equal(markBattleLoreSeen(state, 'meadow', 'intro'), false);
  assert.equal(battleLoreIntroRoute(state, 'bt_slimes'), null);

  assert.equal(battleLoreOutroRoute(state, 'bt_boss_willow'), null);
  state.battlesDone.bt_boss_willow = { victories: 1 };
  assert.deepEqual(battleLoreOutroRoute(state, 'bt_boss_willow'),
    { world: 'meadow', kind: 'outro', battleId: 'bt_boss_willow' });
  assert.equal(markBattleLoreSeen(state, 'meadow', 'outro'), true);
  assert.equal(battleLoreOutroRoute(state, 'bt_boss_willow'), null);
  assert.deepEqual(state.story, before.story);
  assert.deepEqual(state.onboarding, before.onboarding);
});

test('миграция не вызывает очередь старых сцен и идемпотентна', () => {
  const old = newGame(0);
  delete old.battleLoreSeen;
  old.battlesDone = {
    bt_slimes: { victories: 1 },
    bt_boss_willow: { victories: 1 },
  };
  const memory = {};
  const storage = {
    getItem: (key) => memory[key] ?? null,
    setItem: (key, value) => { memory[key] = String(value); },
  };
  saveGame(old, storage);
  const loaded = loadGame(storage, 1000);
  assert.equal(loaded.battleLoreSeen['meadow:intro'], true);
  assert.equal(loaded.battleLoreSeen['meadow:outro'], true);
  assert.equal(loaded.battleLoreSeen['town:intro'], undefined);
  assert.equal(loaded.battleLoreSeen['town:outro'], undefined);
  assert.equal(loaded.coins, old.coins);
  assert.equal(loaded.battlesDone.meadow_crowd_4, undefined);
  saveGame(loaded, storage);
  assert.deepEqual(loadGame(storage, 1000), loaded);
});

test('пройденный бой не блокируется новыми предшественниками, wanted не следующий', () => {
  const state = newGame();
  state.battlesDone.bt_boss_willow = { victories: 1 };
  assert.equal(battleAvailable(state, 'bt_boss_willow'), true);
  assert.equal(battleAvailable(state, 'town_crowd_4'), false);
  assert.equal(nextBattle('ex_boss').id, 'nm_01');
  assert.equal(nextBattle('mist_boss'), null);
  assert.equal(nextBattle('неизвестный-бой'), null);
});
