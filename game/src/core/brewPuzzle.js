// Движок головоломки «Варка зелий по рецепту». Чистая логика, без DOM.
// Перед игроком — открытая книга с рецептом: последовательность действий
// (добавить ингредиент, растолочь в ступе, размешать, подогреть, остудить,
// дать настояться). Нужно повторить рецепт шаг за шагом, не ошибаясь.
// Три ошибки — зелье испорчено, варка начинается заново.
// На поздних уровнях рецепт показывается лишь на несколько секунд —
// дальше игра на память.
//
// Уровень:
//   ingredients: [{ id, name, icon }]  — всё, что стоит на столе (с отвлекающими)
//   recipe: [{ do, ingredient? }]      — шаги рецепта по порядку
//   hideRecipe: bool                   — режим памяти (рецепт прячется)
//   peekSeconds: число                 — сколько рецепт виден в начале (память)

export const BREW_ACTIONS = {
  add: { icon: '🫙', label: 'Добавить' },
  crush: { icon: '🥣', label: 'Растолочь в ступе' },
  stir: { icon: '🥄', label: 'Размешать' },
  heat: { icon: '🔥', label: 'Подогреть' },
  cool: { icon: '❄️', label: 'Остудить' },
  wait: { icon: '⏳', label: 'Дать настояться' },
};

export const BREW_MAX_MISTAKES = 3;

export function createBrewPuzzle(level) {
  return {
    level,
    progress: 0,      // сколько шагов рецепта выполнено верно
    mistakes: 0,      // ошибки в текущей варке (3 = порча)
    spoiled: 0,       // сколько раз зелье было испорчено
    history: [],      // успешно выполненные действия (для отмены)
    moves: 0,
  };
}

function sameAction(a, b) {
  return !!a && !!b && a.do === b.do && (a.ingredient ?? null) === (b.ingredient ?? null);
}

// Шаг подходит под действие? Шаг-вариативный (anyOf) принимает любой из вариантов.
function stepMatches(step, action) {
  if (!step) return false;
  if (Array.isArray(step.anyOf)) return step.anyOf.some((o) => sameAction(o, action));
  return sameAction(step, action);
}

export function expectedStep(state) {
  return state.level.recipe[state.progress] || null;
}

// Выполнить действие. Возвращает:
//   { ok: true, solved }                — шаг засчитан
//   { ok: false, mistake, expected }    — ошибка рецепта
//   { ok: false, spoiled: true }        — третья ошибка, зелье испорчено
//   { ok: false, error }                — действие невозможно в принципе
export function doBrewAction(state, action) {
  if (!action || !BREW_ACTIONS[action.do]) return { ok: false, error: 'Так не варят' };
  if (action.do === 'add' || action.do === 'crush') {
    if (!state.level.ingredients.some((i) => i.id === action.ingredient)) {
      return { ok: false, error: 'На столе такого нет' };
    }
  }
  if (isBrewSolved(state)) return { ok: false, error: 'Зелье уже готово' };

  const exp = expectedStep(state);
  state.moves += 1;
  if (stepMatches(exp, action)) {
    state.history.push({ do: action.do, ingredient: action.ingredient ?? null });
    state.progress += 1;
    return { ok: true, solved: isBrewSolved(state) };
  }
  // Ошибка: не тот шаг
  state.mistakes += 1;
  if (state.mistakes >= BREW_MAX_MISTAKES) {
    // Зелье испорчено: прогресс сгорает, варим заново
    state.progress = 0;
    state.history = [];
    state.mistakes = 0;
    state.spoiled += 1;
    return { ok: false, mistake: true, spoiled: true, expected: exp };
  }
  return { ok: false, mistake: true, spoiled: false, expected: exp };
}

export function undoBrew(state) {
  const last = state.history.pop();
  if (!last) return false;
  state.progress -= 1;
  state.moves += 1;
  return true;
}

export function resetBrew(state) {
  state.progress = 0;
  state.mistakes = 0;
  state.history = [];
  state.moves += 1;
}

export function isBrewSolved(state) {
  return state.progress >= state.level.recipe.length;
}

// Подсказка — какой шаг сейчас нужен.
export function brewHint(state) {
  const step = expectedStep(state);
  if (!step) return { type: 'already' };
  return { type: 'step', step, index: state.progress, total: state.level.recipe.length };
}

// Русская фраза шага рецепта: «Добавь 🍯 Дикий мёд», «Размешай ложкой»…
function brewActionText(level, step) {
  const ing = step.ingredient
    ? level.ingredients.find((i) => i.id === step.ingredient)
    : null;
  const ingLabel = ing ? `${ing.icon} ${ing.name}` : (step.ingredient || '?');
  switch (step.do) {
    case 'add': return `Добавь ${ingLabel}`;
    case 'crush': return `Растолки в ступе: ${ingLabel}`;
    case 'stir': return 'Размешай ложкой';
    case 'heat': return 'Подогрей на огне';
    case 'cool': return 'Остуди котёл';
    case 'wait': return 'Дай настояться';
    default: return '?';
  }
}

export function brewStepText(level, step) {
  if (Array.isArray(step?.anyOf)) {
    return step.anyOf.map((o) => brewActionText(level, o)).join(' ИЛИ ');
  }
  return brewActionText(level, step);
}

// Валидация уровня для конвейера и тестов.
export function validateBrewLevel(level) {
  const problems = [];
  if (!Array.isArray(level.ingredients) || level.ingredients.length === 0) {
    problems.push('нет ингредиентов на столе');
  }
  if (!Array.isArray(level.recipe) || level.recipe.length === 0) {
    problems.push('пустой рецепт');
    return { ok: false, problems, solutionCount: 0 };
  }
  const ingIds = new Set((level.ingredients || []).map((i) => i.id));
  if (ingIds.size !== level.ingredients.length) problems.push('дубли ингредиентов на столе');
  let adds = 0;
  const checkAction = (step, label) => {
    if (!BREW_ACTIONS[step.do]) problems.push(`шаг ${label}: неизвестное действие «${step.do}»`);
    if (step.do === 'add' || step.do === 'crush') {
      adds += 1;
      if (!ingIds.has(step.ingredient)) {
        problems.push(`шаг ${label}: ингредиента «${step.ingredient}» нет на столе`);
      }
    } else if (step.ingredient) {
      problems.push(`шаг ${label}: действие «${step.do}» не принимает ингредиент`);
    }
  };
  level.recipe.forEach((step, i) => {
    if (Array.isArray(step.anyOf)) {
      if (step.anyOf.length === 0) problems.push(`шаг ${i + 1}: пустой anyOf`);
      step.anyOf.forEach((o, k) => checkAction(o, `${i + 1}.${k + 1}`));
    } else {
      checkAction(step, `${i + 1}`);
    }
  });
  if (adds === 0) problems.push('в рецепте ни разу ничего не добавляют в котёл');
  if (level.hideRecipe && !(level.peekSeconds > 0)) {
    problems.push('режим памяти без peekSeconds — игрок не увидит рецепт совсем');
  }
  // Рецепт сам — решение: проигрываем его (из anyOf берём первый вариант)
  const s = createBrewPuzzle(level);
  for (const step of level.recipe) doBrewAction(s, Array.isArray(step.anyOf) ? step.anyOf[0] : step);
  if (!isBrewSolved(s)) problems.push('рецепт не приводит к готовому зелью');
  return { ok: problems.length === 0, problems, solutionCount: 1 };
}
