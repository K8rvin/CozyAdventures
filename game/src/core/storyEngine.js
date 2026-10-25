// Режим истории: движок подачи головоломок и гостей. Чистая логика без DOM.
// Порядок головоломок НЕ хардкодится: кольцо типов STORY_RING крутится от
// story.step, для типа берётся первый нерешённый уровень кампейн-цепочки.
// Гости идут кругом по STORY_GUESTS (курсор story.guestCursor); вехи
// STORY_BEATS/STORY_CAT_BEATS переопределяют гостя шага, не двигая круг.
import { ALL_PUZZLES, puzzleTypeOf, findPuzzle } from './state.js';
import { GUEST_BY_ID } from '../data/guests.js';
import {
  STORY_RING, STORY_GUESTS, STORY_PROLOG, STORY_BEATS, STORY_CAT_BEATS,
  STORY_EPILOG, TASK_LINES, GUEST_SCRIPT,
} from '../data/story.js';

export function storyEnabled(state) {
  return state.settings?.storyMode !== false && !state.story?.finished;
}

export function newStoryState() {
  return {
    step: 0,          // номер шага истории (растёт с каждым выполненным заданием)
    guestCursor: 0,   // позиция в круге гостей (вехи её не двигают)
    pending: null,    // выданное задание { puzzleId, guestId, beat }
    guests: {},       // id гостя -> { visits, lastPuzzle, silenceShown }
    prologSeen: false,
    epilogSeen: false,
    finished: false,
    justCompleted: null, // id уровня, только что завершившего story-задание (для оверлея победы)
  };
}

// Первый нерешённый уровень типа: он же первый доступный (цепочка внутри типа).
function firstUnsolvedOfType(state, mech) {
  return ALL_PUZZLES.find((p) => puzzleTypeOf(p) === mech && !state.puzzlesDone[p.id]) || null;
}

// Текущее задание истории: ближайший по кольцу тип с нерешённым уровнем.
export function storyCurrentPuzzle(state) {
  const step = state.story?.step || 0;
  for (let k = 0; k < STORY_RING.length; k += 1) {
    const mech = STORY_RING[(step + k) % STORY_RING.length];
    const puzzle = firstUnsolvedOfType(state, mech);
    if (puzzle) return puzzle;
  }
  return null;
}

// Веха на шаге: фиксированная (STORY_BEATS) или кот-интерлюдия (каждые 10 шагов).
function storyBeatAt(step) {
  if (STORY_BEATS[step]) return STORY_BEATS[step];
  if (step > 0 && step % 10 === 8) {
    const idx = Math.floor(step / 10) % STORY_CAT_BEATS.length;
    return { guestId: 'cat', steps: STORY_CAT_BEATS[idx] };
  }
  return null;
}

// Гость текущего шага: веха или очередной по кругу.
export function storyCurrentGuest(state) {
  const story = state.story;
  if (!story) return null;
  if (!story.prologSeen) return { guestId: 'spirit', beat: true };
  const beat = storyBeatAt(story.step || 0);
  if (beat) return { guestId: beat.guestId, beat: true };
  const cursor = story.guestCursor || 0;
  return { guestId: STORY_GUESTS[cursor % STORY_GUESTS.length], beat: false };
}

// Кого рисовать в лавке как «гостя, который ждёт».
export function storyHubGuest(state) {
  if (!storyEnabled(state)) return null;
  if (state.story?.finished && state.story?.epilogSeen) return null;
  if (!state.story?.prologSeen) return 'spirit';
  if (!storyCurrentPuzzle(state)) return null;
  return storyCurrentGuest(state)?.guestId || null;
}

// Метка стадии отношений по номеру визита.
export function storyStageLabel(visit) {
  if (visit <= 1) return 'Новый знакомый';
  if (visit <= 3) return 'Старый знакомый';
  return 'Свой человек';
}

// На каком визите гость подколет молчание хозяина (2 или 3, детерминированно).
function silenceVisit(guestId) {
  let h = 0;
  for (const c of guestId) h = (h * 31 + c.codePointAt(0)) >>> 0;
  return 2 + (h % 2);
}

function visitLines(script, visit) {
  const list = script.visits;
  if (visit <= list.length) return list[visit - 1];
  // Визиты 4+: чередуем варианты «свой человек»
  const variants = list.length - 3;
  return list[3 + ((visit - 4) % variants)];
}

function resolveStep(step) {
  const guest = GUEST_BY_ID[step.speaker] || {};
  return {
    speaker: step.speaker,
    name: guest.name || step.speaker,
    icon: guest.icon || '🙂',
    art: step.art || guest.art || null,
    text: step.text,
  };
}

// Сборка сцены монолога для текущего шага. Чистая функция: не мутирует state.
// Возвращает { kind, steps: [{speaker,name,icon,art,text}], puzzleId, puzzleName,
// guestId, visit } или null, если история закрыта (эпилог уже показан).
export function buildStoryScene(state) {
  const story = state.story;
  if (!story) return null;

  if (!story.prologSeen) {
    const puzzle = storyCurrentPuzzle(state);
    return {
      kind: 'prolog',
      guestId: 'spirit',
      visit: 0,
      steps: STORY_PROLOG.map(resolveStep),
      puzzleId: puzzle?.id || null,
      puzzleName: puzzle?.name || null,
    };
  }

  const puzzle = storyCurrentPuzzle(state);
  if (story.finished || !puzzle) {
    if (story.epilogSeen) return null;
    return {
      kind: 'epilog', guestId: 'spirit', visit: 0,
      steps: STORY_EPILOG.map(resolveStep), puzzleId: null, puzzleName: null,
    };
  }

  const { guestId, beat } = storyCurrentGuest(state);
  const mem = story.guests?.[guestId] || {};
  const visit = (mem.visits || 0) + 1;

  if (beat) {
    const last = storyBeatAt(story.step).steps.at(-1).speaker;
    const mech = puzzleTypeOf(puzzle);
    const task = TASK_LINES[mech][story.step % TASK_LINES[mech].length];
    return {
      kind: 'beat',
      guestId,
      visit,
      steps: [...storyBeatAt(story.step).steps.map(resolveStep), resolveStep({ speaker: last, text: task })],
      puzzleId: puzzle.id,
      puzzleName: puzzle.name,
    };
  }

  const script = GUEST_SCRIPT[guestId];
  if (!script) return null;
  const lines = [...visitLines(script, visit)];
  // Память: похвала за прошлое задание этого гостя
  if (mem.lastPuzzle) {
    const prev = findPuzzle(state, mem.lastPuzzle);
    if (prev) {
      const tpl = script.praise[(visit - 2 + script.praise.length) % script.praise.length];
      lines.push(tpl.replace('{дело}', `«${prev.name}»`));
    }
  }
  // Редкий подкол про молчание — один раз на гостя
  if (!mem.silenceShown && visit === silenceVisit(guestId)) lines.push(script.silence);
  const mech = puzzleTypeOf(puzzle);
  lines.push(TASK_LINES[mech][story.step % TASK_LINES[mech].length]);

  return {
    kind: 'visit',
    guestId,
    visit,
    steps: lines.map((text) => resolveStep({ speaker: guestId, text })),
    puzzleId: puzzle.id,
    puzzleName: puzzle.name,
  };
}

// Фиксация показанной сцены: выдать задание, отметить пролог/эпилог/подкол.
// prologOnly отмечает пролог увиденным, но не выдаёт задание story-ring.
export function storyAcceptScene(state, scene, { prologOnly = false } = {}) {
  const story = state.story;
  if (!story || !scene) return;
  if (scene.kind === 'prolog') {
    story.prologSeen = true;
    if (prologOnly) return;
  }
  if (scene.kind === 'epilog') { story.epilogSeen = true; return; }
  if (scene.puzzleId) {
    story.pending = { puzzleId: scene.puzzleId, guestId: scene.guestId, beat: scene.kind !== 'visit' };
  }
  if (scene.kind === 'visit' && scene.guestId && scene.visit === silenceVisit(scene.guestId)) {
    const mem = (story.guests[scene.guestId] ||= { visits: 0, lastPuzzle: null, silenceShown: false });
    mem.silenceShown = true;
  }
}

// Вызывается из completePuzzle/skipPuzzle: если уровень — выданное задание,
// двигает историю (шаг, круг гостей, память гостя).
export function storyOnPuzzleComplete(state, puzzleId) {
  const story = state.story;
  if (!story?.pending || story.pending.puzzleId !== puzzleId) return false;
  const { guestId, beat } = story.pending;
  if (guestId) {
    const mem = (story.guests[guestId] ||= { visits: 0, lastPuzzle: null, silenceShown: false });
    mem.visits += 1;
    mem.lastPuzzle = puzzleId;
    if (!beat) story.guestCursor = (story.guestCursor || 0) + 1;
  }
  story.step = (story.step || 0) + 1;
  story.pending = null;
  story.justCompleted = puzzleId;
  if (!ALL_PUZZLES.some((p) => !state.puzzlesDone[p.id])) story.finished = true;
  return true;
}
