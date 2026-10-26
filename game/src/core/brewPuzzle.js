// Движок головоломки «Варка зелий по рецепту». Чистая логика, без DOM.
// Перед игроком — открытая книга с рецептом: последовательность действий
// (добавить ингредиент, растолочь в ступе, нарезать ножом, накапать пипеткой,
// размешать, подогреть, остудить, дать настояться, накрыть/снять крышку).
// Нужно повторить рецепт шаг за шагом, не ошибаясь.
// Три ошибки — зелье испорчено, варка начинается заново.
// На поздних уровнях рецепт показывается лишь на несколько секунд —
// дальше игра на память.
//
// Уровень:
//   ingredients: [{ id, name, icon }]  — всё, что стоит на столе (с отвлекающими)
//   recipe: [{ do, ingredient?, times? }] — шаги рецепта по порядку;
//                                        times (1–5) — повторить действие N раз
//                                        подряд («Размешай ×2», «Накапай ×3»)
//   hideRecipe: bool                   — режим памяти (хвост рецепта прячется)
//   peekSeconds: число                 — сколько рецепт виден в начале (память)
//   hideTail?: число                   — сколько ПОСЛЕДНИХ шагов прятать (память);
//                                        без поля — по сложности (см. brewHiddenCount)

export const BREW_ACTIONS = {
  add: { icon: '🫙', label: 'Добавить' },
  crush: { icon: '🥣', label: 'Растолочь в ступе' },
  cut: { icon: '🔪', label: 'Нарезать ножом' },
  drop: { icon: '🧪', label: 'Накапать пипеткой' },
  stir: { icon: '🥄', label: 'Размешать' },
  heat: { icon: '🔥', label: 'Подогреть' },
  cool: { icon: '❄️', label: 'Остудить' },
  wait: { icon: '⏳', label: 'Дать настояться' },
  cover: { icon: '🍲', label: 'Накрыть крышкой' },
  uncover: { icon: '🍲', label: 'Снять крышку' },
};

// Действия, которые кладут ингредиент в дело (нужен id со стола).
const ING_ACTIONS = new Set(['add', 'crush', 'cut', 'drop']);

export const BREW_MAX_MISTAKES = 3;

// Сколько последних шагов рецепта скрывается в режиме памяти.
// Ранняя сложность — 1–2 шага подсказаны памятью, поздняя — почти весь рецепт.
// Поле hideTail в данных уровня переопределяет правило.
export function brewHiddenCount(level) {
  if (!level.hideRecipe) return 0;
  const len = level.recipe.length;
  let n = level.hideTail;
  if (n == null) {
    if (level.difficulty >= 5) n = len - 2;       // видны лишь первые 2 шага
    else if (level.difficulty >= 4) n = len - 4;  // видны первые 4
    else n = 2;                                    // ранние: прячем 2 последних
  }
  return Math.max(1, Math.min(len - 1, n));
}

export function createBrewPuzzle(level) {
  return {
    level,
    progress: 0,      // сколько шагов рецепта выполнено верно
    reps: 0,          // повторы текущего шага (для steps с times > 1)
    mistakes: 0,      // ошибки в текущей варке (3 = порча)
    totalMistakes: 0, // все ошибки попытки, включая сбросы и порчу
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
  if (ING_ACTIONS.has(action.do)) {
    if (!state.level.ingredients.some((i) => i.id === action.ingredient)) {
      return { ok: false, error: 'На столе такого нет' };
    }
  }
  if (isBrewSolved(state)) return { ok: false, error: 'Зелье уже готово' };

  const exp = expectedStep(state);
  state.moves += 1;
  if (stepMatches(exp, action)) {
    state.history.push({ do: action.do, ingredient: action.ingredient ?? null });
    // Шаг с times > 1: засчитывается после N одинаковых действий подряд
    if (state.reps + 1 < (exp.times ?? 1)) {
      state.reps += 1;
    } else {
      state.reps = 0;
      state.progress += 1;
    }
    return { ok: true, solved: isBrewSolved(state) };
  }
  // Ошибка: не тот шаг
  state.mistakes += 1;
  state.totalMistakes += 1;
  if (state.mistakes >= BREW_MAX_MISTAKES) {
    // Зелье испорчено: прогресс сгорает, варим заново
    state.progress = 0;
    state.reps = 0;
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
  if (state.reps > 0) {
    state.reps -= 1;
  } else {
    state.progress -= 1;
    const prev = state.level.recipe[state.progress];
    state.reps = Math.max(0, (prev?.times ?? 1) - 1);
  }
  state.moves += 1;
  return true;
}

export function resetBrew(state) {
  state.progress = 0;
  state.reps = 0;
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
    case 'cut': return `Нарежь ножом: ${ingLabel}`;
    case 'drop': return `Накапай пипеткой: ${ingLabel}`;
    case 'stir': return 'Размешай ложкой';
    case 'heat': return 'Подогрей на огне';
    case 'cool': return 'Остуди котёл';
    case 'wait': return 'Дай настояться';
    case 'cover': return 'Накрой котёл крышкой';
    case 'uncover': return 'Сними крышку';
    default: return '?';
  }
}

export function brewStepText(level, step) {
  const suffix = (step?.times ?? 1) > 1 ? ` ×${step.times}` : '';
  if (Array.isArray(step?.anyOf)) {
    return step.anyOf.map((o) => brewActionText(level, o)).join(' ИЛИ ') + suffix;
  }
  return brewActionText(level, step) + suffix;
}

// Внешний вид зелья по истории действий (для view, чистая функция):
// цвет — среднее цветов добавленных ингредиентов (поле color в данных),
// glow — есть светящийся ингредиент (мох, гриб), sparkles — блёстки (пыль, пыльца).
// Отмена/сброс меняют history, поэтому вид всегда соответствует варке.
export function brewPotionLook(level, history) {
  const byId = new Map(level.ingredients.map((i) => [i.id, i]));
  let r = 0; let g = 0; let b = 0; let n = 0;
  let glow = false; let sparkles = false;
  for (const h of history) {
    if (!ING_ACTIONS.has(h.do)) continue;
    const ing = byId.get(h.ingredient);
    if (!ing?.color) continue;
    const c = parseInt(ing.color.slice(1), 16);
    r += (c >> 16) & 255; g += (c >> 8) & 255; b += c & 255; n += 1;
    if (ing.glow) glow = true;
    if (ing.sparkle) sparkles = true;
  }
  if (n === 0) return { color: 'rgb(111, 183, 217)', glow: false, sparkles: false }; // родниковая вода
  return {
    color: `rgb(${Math.round(r / n)}, ${Math.round(g / n)}, ${Math.round(b / n)})`,
    glow,
    sparkles,
  };
}

// Вид готового зелья по ПОЛНОМУ рецепту (флакон в книге рецептов):
// шаги разворачиваются в историю (anyOf — первый вариант, times — повторы).
export function brewFinalLook(level) {
  const history = [];
  for (const step of level.recipe) {
    const a = Array.isArray(step.anyOf) ? step.anyOf[0] : step;
    for (let k = 0; k < (step.times ?? 1); k += 1) {
      history.push({ do: a.do, ingredient: a.ingredient ?? null });
    }
  }
  return brewPotionLook(level, history);
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
    if (ING_ACTIONS.has(step.do)) {
      adds += 1;
      if (!ingIds.has(step.ingredient)) {
        problems.push(`шаг ${label}: ингредиента «${step.ingredient}» нет на столе`);
      }
    } else if (step.ingredient) {
      problems.push(`шаг ${label}: действие «${step.do}» не принимает ингредиент`);
    }
  };
  level.recipe.forEach((step, i) => {
    if (step.times != null && (!Number.isInteger(step.times) || step.times < 1 || step.times > 5)) {
      problems.push(`шаг ${i + 1}: times — целое от 1 до 5`);
    }
    if (Array.isArray(step.anyOf)) {
      if (step.anyOf.length === 0) problems.push(`шаг ${i + 1}: пустой anyOf`);
      step.anyOf.forEach((o, k) => {
        if (o.times != null) problems.push(`шаг ${i + 1}.${k + 1}: times пишется на шаге, не внутри anyOf`);
        checkAction(o, `${i + 1}.${k + 1}`);
      });
    } else {
      checkAction(step, `${i + 1}`);
    }
  });
  if (adds === 0) problems.push('в рецепте ни разу ничего не добавляют в котёл');
  if (level.hideRecipe && !(level.peekSeconds > 0)) {
    problems.push('режим памяти без peekSeconds — игрок не увидит рецепт совсем');
  }
  if (level.hideTail != null && (!Number.isInteger(level.hideTail)
    || level.hideTail < 1 || level.hideTail >= level.recipe.length)) {
    problems.push('hideTail должен быть от 1 до (шагов − 1): рецепт не должен скрываться весь');
  }
  // Рецепт сам — решение: проигрываем его (из anyOf берём первый вариант,
  // шаги с times повторяем нужное число раз)
  const s = createBrewPuzzle(level);
  for (const step of level.recipe) {
    for (let k = 0; k < (step.times ?? 1); k += 1) {
      doBrewAction(s, Array.isArray(step.anyOf) ? step.anyOf[0] : step);
    }
  }
  if (!isBrewSolved(s)) problems.push('рецепт не приводит к готовому зелью');
  return { ok: problems.length === 0, problems, solutionCount: 1 };
}
