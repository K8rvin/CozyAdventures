import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  newGame, completePuzzle, skipPuzzle, buyItem, equipFromInventory, runBattle,
  craft, recipeList, saveGame, loadGame, todayKey,
} from '../src/core/state.js';
import {
  ONBOARDING_VERSION, newOnboardingState, reconcileOnboarding, onboardingScene,
  onboardingPuzzleSolved, onboardingPuzzleChoice, onboardingPurchase, onboardingCrafted,
  onboardingBattleFinished, onboardingBattleOptions, onboardingFixedBattleSeed,
  onboardingRoute, onboardingActionLabel, onboardingCtaForResult, pauseOnboarding, resumeOnboarding,
  skipOnboarding, restartOnboarding, onboardingBlocksStory,
} from '../src/core/onboarding.js';
import { buildStoryScene, storyAcceptScene } from '../src/core/storyEngine.js';
import { STORY_PROLOG } from '../src/data/story.js';
import { ECONOMY_VERSION } from '../src/data/economy.js';
import { ITEM_BY_ID } from '../src/data/items.js';

function beginArc(state) {
  state.lastDailyBonus = todayKey();
  const scene = buildStoryScene(state);
  assert.equal(scene.kind, 'prolog');
  assert.equal(scene.steps.length, STORY_PROLOG.length);
  storyAcceptScene(state, scene, { prologOnly: true });
  reconcileOnboarding(state);
  assert.equal(state.story.prologSeen, true);
  assert.equal(state.story.pending, null, 'учебный пролог не выдаёт задание story-ring');
  assert.equal(state.settings.storyMode, true, 'настройка истории не переключается');
  assert.equal(state.onboarding.step, 'md_01');
  return scene;
}

function reachBees(state, branch = 'tw_01') {
  beginArc(state);
  completePuzzle(state, 'md_01');
  completePuzzle(state, 'md_02');
  completePuzzle(state, branch);
  const slimes = runBattle(state, 'bt_slimes', 1);
  assert.equal(slimes.victory, true);
  onboardingScene(state, 'lavka');
  onboardingScene(state, 'square');
  onboardingScene(state, 'market');
  assert.equal(buyItem(state, 'bt_path').ok, true);
  return slimes;
}

function prepareUpgrade(state) {
  assert.equal(buyItem(state, 'rng_health').ok, true);
  while (state.consumableBelt.length < 2) {
    const index = state.inventory.findIndex((id) => ITEM_BY_ID[id]?.slot === 'consumable');
    if (index >= 0) {
      assert.equal(equipFromInventory(state, index).ok, true);
      continue;
    }
    assert.equal(buyItem(state, 'pot_heal').ok, true);
  }
}

function loadRoundTrip(state) {
  const memory = {};
  const storage = {
    getItem: (key) => memory[key] ?? null,
    setItem: (key, value) => { memory[key] = String(value); },
  };
  saveGame(state, storage);
  return { loaded: loadGame(storage), storage };
}

test('все три ветки проходят реальную дугу с одинаковой честной экономикой', () => {
  for (const branch of ['tw_01', 'sk_md_01', 'pp_01']) {
    const state = newGame();
    assert.equal(state.onboarding.status, 'active');
    assert.equal(state.onboarding.step, 'prolog');
    assert.equal(state.onboarding.version, ONBOARDING_VERSION);
    assert.equal(state.economyVersion, ECONOMY_VERSION);
    beginArc(state);

    completePuzzle(state, 'md_01');
    assert.equal(state.onboarding.step, 'md_02');
    completePuzzle(state, 'md_02');
    assert.equal(state.onboarding.step, 'branch');
    completePuzzle(state, branch);
    assert.equal(state.onboarding.step, 'bt_slimes');
    assert.equal(state.onboarding.freeChoiceId, branch, `${branch}: выбор сохранён`);

    const slimes = runBattle(state, 'bt_slimes', 1);
    assert.equal(slimes.victory, true);
    assert.equal(state.onboarding.step, 'square');
    assert.equal(state.coins, 250, `${branch}: старт, три загадки и первый бой`);
    assert.equal(state.materials.slime_jelly, 2);
    const afterSlimesCta = onboardingCtaForResult(state, { kind: 'battle', id: 'bt_slimes' });
    assert.equal(afterSlimesCta.label, 'Потратить добычу');
    assert.deepEqual(afterSlimesCta.route, { name: 'hub', params: { scene: 'lavka' } });
    assert.notEqual(afterSlimesCta.route.params.id, 'bt_bees', 'после слизней не скачем сразу к пчёлам');

    onboardingScene(state, 'lavka');
    assert.equal(state.onboarding.step, 'square', 'возврат в лавку не пропускает переход на площадь');
    onboardingScene(state, 'square');
    assert.equal(state.onboarding.step, 'market');
    onboardingScene(state, 'market');
    assert.equal(state.onboarding.step, 'boots');

    const boots = buyItem(state, 'bt_path');
    assert.deepEqual(boots.autoEquipped, { slot: 'boots' });
    assert.equal(state.equipped.boots, 'bt_path');
    assert.equal(state.onboarding.step, 'bees_attempt');
    assert.equal(state.coins, 170);

    const beltBefore = [...state.consumableBelt];
    const firstBees = runBattle(state, 'bt_bees', 1);
    assert.equal(firstBees.victory, false, `${branch}: учебное поражение честное`);
    assert.deepEqual(state.consumableBelt, beltBefore, 'пояс сохранён только при первом поражении');
    assert.equal(state.onboarding.step, 'upgrade');
    assert.equal(state.onboarding.flags.beesAttempts, 1);
    assert.ok(firstBees.report.advice.length > 0, 'доступный совет остаётся в отчёте');

    prepareUpgrade(state);
    assert.equal(state.equipped.ring1, 'rng_health', 'автоэкипировка засчитана');
    assert.equal(state.consumableBelt.length, 2, 'стартовое зелье из сундука стало вторым');
    assert.equal(state.onboarding.step, 'bees_victory');
    assert.equal(state.coins, 90, 'дополнительная покупка зелья не потребовалась');
    assert.equal(buyItem(state, 'rng_health').ok, false, 'повторная покупка кольца не требуется');

    const secondBees = runBattle(state, 'bt_bees', 1);
    assert.equal(secondBees.victory, true, `${branch}: усиленный рыцарь побеждает тем же seed`);
    assert.equal(state.onboarding.step, 'craft');
    assert.equal(state.coins, 121);
    assert.equal(state.materials.honey, 3);
    assert.deepEqual(state.consumableBelt, [], 'повторная попытка расходует зелья обычным образом');
    const recipe = recipeList(state).find((entry) => entry.id === 'rcp_pot_heal');
    assert.ok(recipe?.canCraft, 'победа открыла рецепт, материалов хватает');

    const made = craft(state, 'rcp_pot_heal');
    assert.deepEqual(made, { ok: true, itemId: 'pot_heal', count: 2 });
    assert.equal(state.onboarding.status, 'done');
    assert.equal(state.onboarding.step, 'done');
    assert.equal(state.coins, 121, `${branch}: итоговые монеты`);
    assert.deepEqual(state.materials, { honey: 2 }, `${branch}: реальные материалы рецепта списаны`);
    assert.equal(state.inventory.filter((id) => id === 'pot_heal').length, 2);
    assert.equal(state.battlesDone.bt_bees.victories, 1);
    assert.equal(state.story.step, 0, 'учебные дела не запускают story-ring');
    assert.equal(state.story.pending, null);

    const settled = structuredClone(state.onboarding);
    assert.equal(reconcileOnboarding(state), false, 'повторная сверка идемпотентна');
    assert.deepEqual(state.onboarding, settled);
  }
});

test('ранняя победа над пчёлами пропускает поражение и обязательное усиление', () => {
  const state = newGame();
  reachBees(state, 'tw_01');
  assert.equal(buyItem(state, 'rng_health').ok, true, 'кольцо можно купить заранее');
  assert.equal(state.onboarding.step, 'bees_attempt');
  const result = runBattle(state, 'bt_bees', 1);
  assert.equal(result.victory, true);
  assert.equal(state.onboarding.step, 'craft');
  assert.equal(state.onboarding.flags.beesAttempts, 1);
  assert.equal(state.onboarding.flags.beesDefeatSeen, undefined);
  assert.deepEqual(state.consumableBelt, [], 'даже в safe-режиме победа расходует выпитое зелье');
  assert.equal(craft(state, 'rcp_pot_heal').ok, true);
  assert.equal(state.onboarding.status, 'done');
  assert.equal(state.coins, 121);
  assert.equal(state.inventory.filter((id) => id === 'pot_heal').length, 3);
});

test('safe-режим отличается только сохранением пояса при поражении', () => {
  const source = newGame();
  reachBees(source, 'pp_01');
  const safe = structuredClone(source);
  const ordinary = structuredClone(source);
  ordinary.onboarding.status = 'done';
  ordinary.onboarding.step = 'done';

  assert.equal(onboardingBattleOptions(safe, 'bt_bees').preserveBeltOnDefeat, true);
  assert.equal(onboardingBattleOptions(ordinary, 'bt_bees').preserveBeltOnDefeat, false);
  assert.equal(onboardingFixedBattleSeed(safe, 'bt_bees'), 1);
  assert.equal(onboardingFixedBattleSeed(safe, 'bt_slimes'), 1);
  assert.equal(onboardingFixedBattleSeed(safe, 'bt_moths'), null);
  assert.equal(onboardingFixedBattleSeed(ordinary, 'bt_bees'), null);

  const safeBelt = [...safe.consumableBelt];
  const safeResult = runBattle(safe, 'bt_bees', 1);
  const ordinaryResult = runBattle(ordinary, 'bt_bees', 1);
  assert.equal(safeResult.victory, false);
  assert.equal(ordinaryResult.victory, false);
  assert.deepEqual(safeResult, ordinaryResult, 'лог, исход, совет и результат боя не подменяются');
  assert.deepEqual(safe.consumableBelt, safeBelt);
  assert.deepEqual(ordinary.consumableBelt, []);

  const withoutArcAndBelt = (state) => {
    const copy = structuredClone(state);
    delete copy.onboarding;
    delete copy.consumableBelt;
    return copy;
  };
  assert.deepEqual(withoutArcAndBelt(safe), withoutArcAndBelt(ordinary),
    'монеты, инвентарь, статистика и весь остальной прогресс совпадают');
});

test('события и reconcile идемпотентны, повтор одного результата не удваивает попытку', () => {
  const state = newGame();
  reachBees(state, 'sk_md_01');
  const result = runBattle(state, 'bt_bees', 1);
  const attempts = state.onboarding.flags.beesAttempts;
  onboardingBattleFinished(state, 'bt_bees', result);
  assert.equal(state.onboarding.flags.beesAttempts, attempts);

  onboardingScene(state, 'market');
  const afterScene = structuredClone(state.onboarding);
  onboardingScene(state, 'market');
  assert.deepEqual(state.onboarding, afterScene);
  onboardingPuzzleSolved(state, 'sk_md_01');
  onboardingPurchase(state, 'bt_path');
  onboardingCrafted(state, 'rcp_pot_heal');
  const settled = structuredClone(state.onboarding);
  onboardingCrafted(state, 'rcp_pot_heal');
  assert.deepEqual(state.onboarding, settled, 'флаги событий не являются наградами и не дублируются');
  assert.equal(reconcileOnboarding(state), false);
});

test('пропуск загадки не засчитывается, а последующее честное решение двигает дугу', () => {
  const state = newGame();
  beginArc(state);
  state.coins = 1000;
  assert.equal(skipPuzzle(state, 'md_01').ok, true);
  reconcileOnboarding(state);
  assert.equal(state.onboarding.step, 'md_01');
  assert.equal(state.puzzlesDone.md_01.skipped, true);
  completePuzzle(state, 'md_01');
  assert.equal(state.puzzlesDone.md_01.skipped, undefined);
  assert.equal(state.onboarding.step, 'md_02');
});

test('пауза, продолжение и перезагрузка сохраняют шаг и сверяют сделанное', () => {
  const state = newGame();
  beginArc(state);
  completePuzzle(state, 'md_01');
  assert.equal(pauseOnboarding(state), true);
  assert.equal(state.onboarding.status, 'paused');
  assert.equal(state.onboarding.step, 'md_02');
  completePuzzle(state, 'md_02');
  assert.equal(state.onboarding.step, 'md_02', 'на паузе указатель не скачет');

  const { loaded } = loadRoundTrip(state);
  assert.equal(loaded.onboarding.status, 'paused');
  assert.equal(loaded.onboarding.step, 'md_02');
  assert.equal(resumeOnboarding(loaded), true);
  assert.equal(loaded.onboarding.status, 'active');
  assert.equal(loaded.onboarding.step, 'branch', 'при продолжении засчитано реальное решение');
  assert.equal(resumeOnboarding(loaded), false);
  const again = loadRoundTrip(loaded).loaded;
  assert.equal(again.onboarding.step, 'branch');
});

test('ручной restart посреди дуги не повторяет поражение, покупки или победу', () => {
  const state = newGame();
  reachBees(state, 'tw_01');
  assert.equal(runBattle(state, 'bt_bees', 1).victory, false);
  assert.equal(state.onboarding.step, 'upgrade');
  restartOnboarding(state);
  assert.equal(state.onboarding.step, 'upgrade');
  assert.equal(state.onboarding.flags.beesAttempts, 1);
  assert.equal(onboardingBattleOptions(state, 'bt_bees').preserveBeltOnDefeat, false,
    'перезапуск не назначает ещё одно обязательное учебное поражение');

  prepareUpgrade(state);
  const coins = state.coins;
  restartOnboarding(state);
  assert.equal(state.onboarding.step, 'bees_victory');
  assert.equal(state.coins, coins);
  assert.equal(buyItem(state, 'rng_health').ok, false);
  assert.equal(runBattle(state, 'bt_bees', 1).victory, true);
  restartOnboarding(state);
  assert.equal(state.onboarding.step, 'craft', 'победа уже есть и не требуется повторно');
  assert.equal(craft(state, 'rcp_pot_heal').ok, true);
  restartOnboarding(state);
  assert.equal(state.onboarding.status, 'done');
});

test('маршрут при нехватке монет ведёт к заработку, при нехватке материалов — к добыче', () => {
  const state = newGame();
  reachBees(state, 'tw_01');
  state.coins = 0;
  assert.deepEqual(onboardingRoute(state), { name: 'battle', params: { id: 'bt_bees' } },
    'сапоги уже куплены и надеты, reconcile прошёл дальше');
  runBattle(state, 'bt_bees', 1);
  assert.equal(state.onboarding.step, 'upgrade');
  assert.deepEqual(onboardingRoute(state), { name: 'puzzles', params: {} });
  assert.equal(onboardingActionLabel(state), 'Заработать на усиление');
  state.coins = 80;
  assert.deepEqual(onboardingRoute(state), { name: 'shopMagic', params: {} });
  prepareUpgrade(state);
  const won = runBattle(state, 'bt_bees', 1);
  assert.equal(won.victory, true);
  const materials = structuredClone(state.materials);
  state.materials = {};
  assert.deepEqual(onboardingRoute(state), { name: 'battle', params: { id: 'bt_slimes' } });
  assert.equal(onboardingActionLabel(state), 'Собрать материалы');
  state.materials = { slime_jelly: 2 };
  assert.deepEqual(onboardingRoute(state), { name: 'battle', params: { id: 'bt_bees' } });
  state.materials = materials;
  assert.deepEqual(onboardingRoute(state), { name: 'craft', params: {} });
});

test('CTA только сообщает маршрут и не продвигает шаг само', () => {
  const state = newGame();
  beginArc(state);
  completePuzzle(state, 'md_01');
  const before = structuredClone(state.onboarding);
  const cta = onboardingCtaForResult(state, { kind: 'puzzle', id: 'md_01' });
  assert.deepEqual(cta.route, { name: 'puzzle', params: { id: 'md_02' } });
  assert.deepEqual(state.onboarding, before);
  assert.equal(onboardingCtaForResult(state, { kind: 'puzzle', id: 'brew_01' }), null);
});

test('выбор свободной ветки сохраняется до решения, но не заменяет честную победу', () => {
  const state = newGame();
  beginArc(state);
  completePuzzle(state, 'md_01');
  completePuzzle(state, 'md_02');
  assert.equal(state.onboarding.step, 'branch');
  assert.equal(onboardingPuzzleChoice(state, 'pp_01'), true);
  assert.equal(state.onboarding.freeChoiceId, 'pp_01');
  assert.equal(state.onboarding.step, 'branch', 'выбор маршрута сам не завершает задание');
  const loaded = loadRoundTrip(state).loaded;
  assert.equal(loaded.onboarding.freeChoiceId, 'pp_01');
  assert.equal(loaded.onboarding.step, 'branch');
  completePuzzle(loaded, 'pp_01');
  assert.equal(loaded.onboarding.step, 'bt_slimes');
});

test('out-of-order md_02 и pp_01 не перескакивают md_01, выбор ветки сохраняется', () => {
  const state = newGame();
  beginArc(state);
  completePuzzle(state, 'md_02');
  completePuzzle(state, 'pp_01');
  assert.equal(state.onboarding.step, 'md_01');
  assert.equal(state.onboarding.freeChoiceId, 'pp_01');
  completePuzzle(state, 'md_01');
  assert.equal(state.onboarding.step, 'bt_slimes', 'после md_01 уже готовые предшественники засчитаны');
  assert.equal(state.onboarding.freeChoiceId, 'pp_01');
});

test('пчёлы до bt_path не пропускают покупку даже после поражения или победы', () => {
  const defeated = newGame();
  beginArc(defeated);
  completePuzzle(defeated, 'md_01');
  completePuzzle(defeated, 'md_02');
  completePuzzle(defeated, 'pp_01');
  runBattle(defeated, 'bt_slimes', 1);
  onboardingScene(defeated, 'square');
  onboardingScene(defeated, 'market');
  assert.equal(defeated.onboarding.step, 'boots');
  assert.equal(runBattle(defeated, 'bt_bees', 1).victory, false);
  assert.equal(defeated.onboarding.step, 'boots', 'поражение не заменяет сапоги');
  assert.equal(buyItem(defeated, 'bt_path').ok, true);
  assert.equal(defeated.onboarding.step, 'upgrade');

  const victorious = newGame();
  beginArc(victorious);
  completePuzzle(victorious, 'md_01');
  completePuzzle(victorious, 'md_02');
  completePuzzle(victorious, 'pp_01');
  runBattle(victorious, 'bt_slimes', 1);
  onboardingScene(victorious, 'square');
  onboardingScene(victorious, 'market');
  assert.equal(buyItem(victorious, 'rng_health').ok, true);
  assert.equal(equipFromInventory(victorious, victorious.inventory.indexOf('pot_heal')).ok, true);
  assert.equal(runBattle(victorious, 'bt_bees', 1).victory, true);
  assert.equal(victorious.onboarding.step, 'boots', 'ранняя победа тоже ждёт сапоги');
  assert.equal(buyItem(victorious, 'bt_path').ok, true);
  assert.equal(victorious.onboarding.step, 'craft', 'после сапог победа ведёт сразу к крафту');
});

test('миграция пустого старого сейва запускает дугу, развитого — done, skip учитывается', () => {
  const empty = newGame();
  delete empty.onboarding;
  const emptyLoaded = loadRoundTrip(empty).loaded;
  assert.equal(emptyLoaded.onboarding.status, 'active');
  assert.equal(emptyLoaded.onboarding.step, 'prolog');
  assert.equal(emptyLoaded.onboarding.version, ONBOARDING_VERSION);
  assert.equal(emptyLoaded.economyVersion, ECONOMY_VERSION);

  const skipped = newGame();
  skipped.tutorialSkipped = true;
  delete skipped.onboarding;
  const skippedLoaded = loadRoundTrip(skipped).loaded;
  assert.equal(skippedLoaded.onboarding.status, 'skipped');

  const developed = newGame();
  developed.tutorialSkipped = true;
  developed.story.prologSeen = true;
  developed.story.pending = { puzzleId: 'md_02', guestId: 'watchman', beat: false };
  developed.story.step = 3;
  developed.puzzlesDone.md_01 = { moves: 1 };
  developed.battlesDone.bt_slimes = { victories: 1 };
  delete developed.onboarding;
  const developedLoaded = loadRoundTrip(developed).loaded;
  assert.equal(developedLoaded.onboarding.status, 'done', 'развитие важнее старого флага пропуска');
  assert.equal(developedLoaded.onboarding.step, 'done');
  assert.equal(developedLoaded.tutorialSkipped, true, 'сам старый флаг не стирается');
  assert.deepEqual(developedLoaded.story.pending, developed.story.pending,
    'сохранённая история не пересоздаётся и не сбрасывается');
  assert.equal(developedLoaded.settings.storyMode, true);
});

test('повторная миграция не меняет сейв, ручной restart пропускает готовое', () => {
  const old = newGame();
  old.story.prologSeen = true;
  old.puzzlesDone.md_01 = { moves: 1 };
  old.equipped.boots = 'bt_path';
  delete old.onboarding;
  const { loaded, storage } = loadRoundTrip(old);
  assert.equal(loaded.onboarding.status, 'done');
  saveGame(loaded, storage);
  assert.deepEqual(loadGame(storage), loaded, 'повторная загрузка идемпотентна');

  restartOnboarding(loaded);
  assert.equal(loaded.onboarding.status, 'active');
  assert.equal(loaded.onboarding.step, 'md_02', 'пролог и md_01 не повторяются');
  assert.equal(loaded.onboarding.flags.ready_bt_path, true, 'надетые сапоги засчитаны без покупки');
  const coins = loaded.coins;
  assert.equal(buyItem(loaded, 'bt_path').ok, false);
  assert.equal(loaded.coins, coins);
});

test('миграция однозначного старого крафта не требует повторного крафта при restart', () => {
  const old = newGame();
  old.story.prologSeen = true;
  old.puzzlesDone = { md_01: {}, md_02: {}, tw_01: {} };
  old.battlesDone = { bt_slimes: { victories: 1 }, bt_bees: { victories: 1 } };
  old.equipped.boots = 'bt_path';
  old.stats.itemsCrafted = 1;
  delete old.onboarding;
  const loaded = loadRoundTrip(old).loaded;
  assert.equal(loaded.onboarding.status, 'done');
  restartOnboarding(loaded);
  assert.equal(loaded.onboarding.status, 'done');
  assert.equal(loaded.onboarding.flags.crafted_rcp_pot_heal, true);
});

test('после done или skipped обычная история продолжается с сохранённым pending', () => {
  for (const status of ['done', 'skipped']) {
    const state = newGame();
    state.onboarding.status = status;
    state.onboarding.step = status === 'done' ? 'done' : 'prolog';
    const scene = buildStoryScene(state);
    storyAcceptScene(state, scene);
    assert.equal(state.story.pending.puzzleId, 'md_01');
    assert.equal(onboardingBlocksStory(state), false);
    completePuzzle(state, 'md_01');
    assert.equal(state.story.step, 1);
    assert.equal(state.story.justCompleted, 'md_01');
    assert.equal(state.onboarding.status, status);
    assert.equal(state.settings.storyMode, true);
  }
});

test('skipOnboarding меняет только статус дуги и не трогает историю', () => {
  const state = newGame();
  beginArc(state);
  const storyBefore = structuredClone(state.story);
  assert.equal(skipOnboarding(state), true);
  assert.equal(state.onboarding.status, 'skipped');
  assert.deepEqual(state.story, storyBefore);
  assert.equal(skipOnboarding(state), false);
  assert.equal(onboardingRoute(state), null);
});

test('новое состояние дуги не зависит от state.js и имеет собственную версию', () => {
  const source = readFileSync(new URL('../src/core/onboarding.js', import.meta.url), 'utf8');
  assert.ok(!source.includes("from './state.js'"), 'чистый движок не импортирует state.js');
  const arc = newOnboardingState();
  assert.equal(arc.version, 1);
  assert.equal(ECONOMY_VERSION, 1, 'экономическая версия не менялась');
});
