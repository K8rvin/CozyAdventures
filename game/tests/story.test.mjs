import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newGame, completePuzzle, puzzleTypeOf, findPuzzle, ALL_PUZZLES } from '../src/core/state.js';
import {
  storyCurrentPuzzle, storyCurrentGuest, storyHubGuest, buildStoryScene,
  storyAcceptScene, storyStageLabel,
} from '../src/core/storyEngine.js';
import {
  STORY_RING, STORY_GUESTS, STORY_PROLOG, STORY_BEATS, STORY_CAT_BEATS,
  STORY_EPILOG, TASK_LINES, GUEST_SCRIPT,
} from '../src/data/story.js';
import { GUEST_BY_ID } from '../src/data/guests.js';

// Один шаг истории: построить сцену, принять задание, «решить» уровень.
function storyStep(state) {
  const scene = buildStoryScene(state);
  assert.ok(scene, 'сцена истории должна собираться');
  storyAcceptScene(state, scene);
  if (scene.puzzleId) completePuzzle(state, scene.puzzleId, {});
  return scene;
}

test('пролог ведёт к первому заданию и двигает историю', () => {
  const state = newGame();
  const scene = buildStoryScene(state);
  assert.equal(scene.kind, 'prolog');
  assert.equal(scene.puzzleId, 'md_01'); // первый уровень кольца (mirror)
  assert.equal(scene.steps[0].speaker, 'spirit');
  assert.ok(scene.steps.some((s) => s.speaker === 'cat'));

  storyAcceptScene(state, scene);
  assert.equal(state.story.prologSeen, true);
  assert.equal(state.story.pending?.puzzleId, 'md_01');

  completePuzzle(state, 'md_01', {});
  assert.equal(state.story.step, 1);
  assert.equal(state.story.pending, null);
  assert.equal(state.story.justCompleted, 'md_01');
});

test('движок подсовывает типы головоломок по кольцу, без хардкода порядка', () => {
  const state = newGame();
  storyStep(state); // пролог, шаг 0 → mirror
  for (let s = 1; s <= 26; s += 1) {
    const puzzle = storyCurrentPuzzle(state);
    assert.ok(puzzle, `шаг ${s}: задание есть`);
    assert.equal(
      puzzleTypeOf(puzzle), STORY_RING[s % STORY_RING.length],
      `шаг ${s}: тип должен идти по кольцу`,
    );
    assert.ok(!state.puzzlesDone[puzzle.id], `шаг ${s}: уровень ещё не решён`);
    storyStep(state);
  }
});

test('гости идут кругом, вехи не сдвигают круг', () => {
  const state = newGame();
  storyStep(state); // пролог
  const guests = [];
  for (let s = 1; s <= 41; s += 1) guests.push(storyStep(state));

  // Первые гости круга — по порядку STORY_GUESTS
  assert.equal(guests[0].guestId, STORY_GUESTS[0]); // сторож первым
  assert.equal(guests[0].visit, 1);
  assert.equal(guests[1].guestId, STORY_GUESTS[1]);
  // Шаг 8 и 18 — кот-интерлюдия, круг не двигается
  assert.equal(guests[7].kind, 'beat');
  assert.equal(guests[7].guestId, 'cat');
  assert.equal(guests[8].guestId, STORY_GUESTS[7]);
  assert.equal(guests[17].guestId, 'cat');
  // Шаг 37 — веха духа
  assert.equal(guests[36].guestId, 'spirit');
  // После полного круга сторож возвращается со вторым визитом
  const watchmanAgain = guests.find((s) => s.kind === 'visit' && s.guestId === STORY_GUESTS[0] && s.visit === 2);
  assert.ok(watchmanAgain, 'сторож должен вернуться с визитом 2');
});

test('память: повторный визит хвалит за конкретное прошлое задание', () => {
  const state = newGame();
  storyStep(state); // пролог
  const first = storyStep(state); // сторож, визит 1
  const firstTaskName = findPuzzle(state, first.puzzleId).name;
  // Крутим историю до второго визита сторожа
  let scene = null;
  for (let i = 0; i < 60 && !scene; i += 1) {
    const s = storyStep(state);
    if (s.kind === 'visit' && s.guestId === STORY_GUESTS[0]) scene = s;
  }
  assert.ok(scene, 'сторож должен вернуться');
  assert.equal(scene.visit, 2);
  const texts = scene.steps.map((s) => s.text).join('\n');
  assert.ok(texts.includes(`«${firstTaskName}»`), 'похвала должна помнить прошлое задание');
});

test('подкол про молчание показывается один раз на гостя', () => {
  const state = newGame();
  storyStep(state);
  const silenceByGuest = {};
  for (let i = 0; i < 130; i += 1) {
    const s = storyStep(state);
    if (s.kind !== 'visit') continue;
    const script = GUEST_SCRIPT[s.guestId];
    const texts = s.steps.map((x) => x.text);
    if (texts.includes(script.silence)) {
      silenceByGuest[s.guestId] = (silenceByGuest[s.guestId] || 0) + 1;
    }
  }
  assert.ok(Object.keys(silenceByGuest).length > 10, 'подколы должны быть у многих гостей');
  for (const [g, n] of Object.entries(silenceByGuest)) {
    assert.equal(n, 1, `${g}: подкол про молчание должен быть ровно один раз`);
    assert.equal(state.story.guests[g].silenceShown, true);
  }
});

test('решённые вне истории уровни учитываются, шаг не двигается без pending', () => {
  const state = newGame();
  storyAcceptScene(state, buildStoryScene(state)); // пролог принят, pending = md_01
  completePuzzle(state, 'tw_01', {}); // решён «мимо истории»
  assert.equal(state.story.step, 0, 'шаг не должен двигаться без задания');
  completePuzzle(state, 'md_01', {});
  assert.equal(state.story.step, 1);
  // tw_01 уже решён — задание shelf берёт следующий нерешённый уровень типа
  const puzzle = storyCurrentPuzzle(state);
  assert.equal(puzzleTypeOf(puzzle), 'shelf');
  assert.notEqual(puzzle.id, 'tw_01');
});

test('тип без нерешённых уровней пропускается, конец контента → эпилог', () => {
  const state = newGame();
  storyStep(state); // пролог
  // «Решим» все уровни mirror и shelf вне истории
  for (const p of ALL_PUZZLES) {
    if (['mirror', 'shelf'].includes(puzzleTypeOf(p))) state.puzzlesDone[p.id] = { moves: 1, at: 1 };
  }
  const puzzle = storyCurrentPuzzle(state);
  assert.equal(puzzleTypeOf(puzzle), 'riddle', 'mirror и shelf должны быть пропущены');

  // Решено вообще всё → заданий нет, сцена — эпилог, потом история закрыта
  const state2 = newGame();
  storyStep(state2);
  for (const p of ALL_PUZZLES) state2.puzzlesDone[p.id] = { moves: 1, at: 1 };
  state2.story.finished = true;
  assert.equal(storyCurrentPuzzle(state2), null);
  const epilog = buildStoryScene(state2);
  assert.equal(epilog.kind, 'epilog');
  assert.equal(epilog.puzzleId, null);
  storyAcceptScene(state2, epilog);
  assert.equal(state2.story.epilogSeen, true);
  assert.equal(buildStoryScene(state2), null);
  assert.equal(storyHubGuest(state2), null);
});

test('режим истории выключается настройкой', () => {
  const state = newGame();
  assert.equal(storyHubGuest(state), 'spirit'); // до пролога в лавке дух
  state.settings.storyMode = false;
  assert.equal(storyHubGuest(state), null);
});

test('гость в лавке соответствует текущему шагу', () => {
  const state = newGame();
  assert.equal(storyHubGuest(state), 'spirit');
  storyStep(state);
  assert.equal(storyHubGuest(state), STORY_GUESTS[0]);
  assert.equal(storyCurrentGuest(state).guestId, STORY_GUESTS[0]);
  assert.equal(storyStageLabel(1), 'Новый знакомый');
  assert.equal(storyStageLabel(3), 'Старый знакомый');
  assert.equal(storyStageLabel(5), 'Свой человек');
});

test('сценарные данные: все гости круга имеют реплики, тексты без латиницы', () => {
  assert.equal(STORY_GUESTS.length, 35);
  assert.ok(!STORY_GUESTS.includes('keeper') && !STORY_GUESTS.includes('spirit'));

  const noLatin = (text, where) => assert.ok(
    !/[a-zA-Z]/.test(text.replace('{дело}', '')),
    `${where}: латиница в тексте «${text}»`,
  );

  for (const guestId of STORY_GUESTS) {
    assert.ok(GUEST_BY_ID[guestId], `${guestId}: гость должен быть в гостевой книге`);
    const script = GUEST_SCRIPT[guestId];
    assert.ok(script, `${guestId}: нет сценария`);
    assert.ok(script.visits.length >= 4, `${guestId}: нужны визиты 1-3 и «свой человек»`);
    for (const [vi, lines] of script.visits.entries()) {
      assert.ok(lines.length >= 1, `${guestId}: визит ${vi + 1} пуст`);
      for (const line of lines) noLatin(line, `${guestId} визит ${vi + 1}`);
    }
    assert.ok(script.praise.length >= 1, `${guestId}: нужна похвала-память`);
    for (const tpl of script.praise) {
      assert.ok(tpl.includes('{дело}'), `${guestId}: похвала без плейсхолдера {дело}`);
      noLatin(tpl, `${guestId} praise`);
    }
    assert.ok(script.silence, `${guestId}: нужен подкол про молчание`);
    noLatin(script.silence, `${guestId} silence`);
  }

  for (const mech of STORY_RING) {
    assert.ok(TASK_LINES[mech]?.length >= 2, `${mech}: нужно хотя бы 2 фразы-задания`);
    for (const line of TASK_LINES[mech]) noLatin(line, `задание ${mech}`);
  }

  const frames = [
    ...STORY_PROLOG, ...STORY_EPILOG,
    ...Object.values(STORY_BEATS).flatMap((b) => b.steps),
    ...STORY_CAT_BEATS.flat(),
  ];
  for (const frame of frames) {
    assert.ok(GUEST_BY_ID[frame.speaker], `спикер ${frame.speaker} существует`);
    noLatin(frame.text, `кадр ${frame.speaker}`);
  }
});

test('сцена визита заканчивается заданием и не пуста', () => {
  const state = newGame();
  storyStep(state);
  for (let i = 0; i < 20; i += 1) {
    const scene = buildStoryScene(state);
    assert.ok(scene.steps.length >= 2, 'сцена должна содержать реплики и задание');
    const last = scene.steps.at(-1).text;
    const mech = puzzleTypeOf(findPuzzle(state, scene.puzzleId));
    assert.ok(TASK_LINES[mech].includes(last), 'последняя реплика — задание по типу');
    storyAcceptScene(state, scene);
    completePuzzle(state, scene.puzzleId, {});
  }
});
