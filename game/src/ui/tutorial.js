// Плавное обучение: кот-хранитель ведёт по игре прожектором.
// Одновременно существует только один сеанс; смена экрана отменяет его без отметки о прохождении.

let activeTutorial = null;

export function tutorialDone(state, key) {
  return !!state.tutorialSkipped || !!state.tutorial[key];
}

export function destroyTutorial() {
  const session = activeTutorial;
  if (!session) return;
  activeTutorial = null;
  session.destroy();
}

export function skipAllTutorials(state) {
  state.tutorialSkipped = true;
  destroyTutorial();
}

// steps: [{ target: Element | () => Element, title, text, cta? }]
// options.onSkip позволяет отдельной дуге заменить глобальный пропуск всех подсказок.
// Показывает последовательность; возвращает функцию отмены без отметки о прохождении.
export function startTutorial(ctx, key, steps, options = {}) {
  destroyTutorial();
  const { state } = ctx;
  if (tutorialDone(state, key)) return () => {};
  if (!steps || steps.length === 0) return () => {};

  const session = {
    index: 0,
    destroyed: false,
    overlay: null,
    spot: null,
    bubble: null,
    target: null,
    listeners: new Set(),
    stepListeners: new Set(),
    timers: new Set(),
    frames: new Set(),
  };
  activeTutorial = session;

  function listen(target, type, fn, options, perStep = false) {
    if (!target?.addEventListener) return;
    target.addEventListener(type, fn, options);
    const entry = { target, type, fn, options };
    (perStep ? session.stepListeners : session.listeners).add(entry);
  }

  function removeListeners(entries) {
    for (const entry of entries) {
      entry.target.removeEventListener?.(entry.type, entry.fn, entry.options);
    }
    entries.clear();
  }

  function later(fn, ms) {
    if (session.destroyed) return null;
    const id = setTimeout(() => {
      session.timers.delete(id);
      if (!session.destroyed) fn();
    }, ms);
    session.timers.add(id);
    return id;
  }

  function frame(fn) {
    const request = window.requestAnimationFrame?.bind(window);
    if (!request) return later(fn, 16);
    const id = request(() => {
      session.frames.delete(id);
      if (!session.destroyed) fn();
    });
    session.frames.add(id);
    return id;
  }

  function clearStep() {
    removeListeners(session.stepListeners);
    for (const id of session.timers) clearTimeout(id);
    session.timers.clear();
    for (const id of session.frames) window.cancelAnimationFrame?.(id);
    session.frames.clear();
    session.overlay?.remove();
    session.overlay = null;
    session.spot = null;
    session.bubble = null;
    session.target = null;
  }

  function destroy() {
    if (session.destroyed) return;
    session.destroyed = true;
    clearStep();
    removeListeners(session.listeners);
    if (activeTutorial === session) activeTutorial = null;
  }
  session.destroy = destroy;

  function finish() {
    if (session.destroyed) return;
    state.tutorial[key] = true;
    destroy();
    ctx.save();
  }

  function finishAll() {
    if (session.destroyed) return;
    if (options.onSkip) {
      options.onSkip();
      if (!session.destroyed) destroy();
      return;
    }
    skipAllTutorials(state);
    ctx.save();
    ctx.toast('Обучение выключено. Кот-хранитель всегда рядом, если что.');
  }

  function remeasure() {
    const { spot, bubble, target } = session;
    if (session.destroyed || !spot || !bubble) return;
    if (target?.getBoundingClientRect) {
      const r = target.getBoundingClientRect();
      const pad = 10;
      spot.style.display = '';
      spot.style.left = `${r.left - pad + window.scrollX}px`;
      spot.style.top = `${r.top - pad + window.scrollY}px`;
      spot.style.width = `${r.width + pad * 2}px`;
      spot.style.height = `${r.height + pad * 2}px`;
    } else {
      spot.style.display = 'none';
    }
    positionBubble(spot, bubble);
  }

  function showStep() {
    clearStep();
    if (session.destroyed) return;
    if (session.index >= steps.length) { finish(); return; }

    const stepIndex = session.index;
    const step = steps[stepIndex];
    const target = typeof step.target === 'function' ? step.target() : step.target;
    session.target = target || null;

    const overlay = document.createElement('div');
    overlay.className = 'tut-overlay';
    session.overlay = overlay;

    // Прожектор: полупрозрачная подложка с «дыркой» (box-shadow-вырез)
    const spot = document.createElement('div');
    spot.className = 'tut-spot';
    session.spot = spot;
    overlay.appendChild(spot);

    const bubble = document.createElement('div');
    bubble.className = 'tut-bubble';
    bubble.innerHTML = `
      <div class="tut-cat">🐈</div>
      <div class="tut-body">
        <div class="tut-title">${step.title}</div>
        <div class="tut-text">${step.text}</div>
        <div class="tut-actions"></div>
      </div>`;
    session.bubble = bubble;
    overlay.appendChild(bubble);
    document.body.appendChild(overlay);

    let advanced = false;
    const advance = (ev) => {
      ev?.stopPropagation?.();
      if (session.destroyed || advanced || session.index !== stepIndex) return;
      advanced = true;
      session.index += 1;
      ctx.sfx?.('tap');
      showStep();
    };

    const actions = bubble.querySelector('.tut-actions');
    const next = document.createElement('button');
    next.className = 'primary small';
    const isLast = stepIndex === steps.length - 1;
    next.textContent = step.cta || (isLast ? 'Понял!' : 'Дальше →');
    listen(next, 'click', advance, undefined, true);
    actions.appendChild(next);

    const skip = document.createElement('button');
    skip.className = 'ghost small';
    skip.textContent = options.skipLabel || 'Пропустить обучение';
    listen(skip, 'click', (ev) => { ev.stopPropagation?.(); finishAll(); }, undefined, true);
    actions.appendChild(skip);

    // Тап по самому элементу тоже двигает обучение, но не дважды за один шаг.
    if (target && step.advanceOnTargetClick !== false) {
      listen(target, 'pointerdown', advance, { once: true }, true);
    }

    target?.scrollIntoView?.({ block: 'center', behavior: 'smooth' });
    remeasure();
    frame(remeasure);
    // Плавный скролл меняет геометрию после первого кадра — измеряем ещё раз.
    later(remeasure, 80);
    later(remeasure, 400);
  }

  listen(window, 'resize', remeasure);
  listen(window, 'scroll', remeasure, true);
  showStep();
  return destroy;
}

function positionBubble(spot, bubble) {
  if (!spot || spot.style.display === 'none' || !bubble) {
    if (bubble) {
      bubble.style.left = '50%';
      bubble.style.top = '20%';
      bubble.style.transform = 'translateX(-50%)';
    }
    return;
  }
  const sr = spot.getBoundingClientRect();
  const top = sr.top || 0;
  const bottom = sr.bottom ?? (top + (sr.height || 0));
  const bw = bubble.offsetWidth || 320;
  const bh = bubble.offsetHeight || 120;
  let left = sr.left + sr.width / 2 - bw / 2 + window.scrollX;
  left = Math.max(10, Math.min(left, (window.innerWidth || 800) - bw - 10));
  const below = bottom + 14 + window.scrollY;
  const above = top - bh - 14 + window.scrollY;
  // Если снизу места мало — ставим сверху
  const viewportH = window.innerHeight || 600;
  const fitsBelow = bottom + bh + 20 < viewportH;
  bubble.style.left = `${left}px`;
  bubble.style.top = `${fitsBelow ? below : above}px`;
}
