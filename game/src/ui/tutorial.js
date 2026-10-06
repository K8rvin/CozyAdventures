// Плавное обучение: кот-хранитель ведёт по игре прожектором.
// Не череда окон — один мягкий прожектор за раз, по элементам экрана.
// Можно пропустить всё одной кнопкой. Показывается один раз на игрока.

export function tutorialDone(state, key) {
  return !!state.tutorialSkipped || !!state.tutorial[key];
}

export function skipAllTutorials(state) {
  state.tutorialSkipped = true;
}

// steps: [{ target: Element | () => Element, title, text, cta? }]
// Показывает последовательность; возвращает функцию отмены.
export function startTutorial(ctx, key, steps) {
  const { state } = ctx;
  if (tutorialDone(state, key)) return () => {};
  if (!steps || steps.length === 0) return () => {};

  let i = 0;
  let overlay = null;
  let cancelled = false;

  function finish(markDone = true) {
    if (overlay) { overlay.remove(); overlay = null; }
    if (markDone && !cancelled) {
      state.tutorial[key] = true;
      ctx.save();
    }
  }

  function finishAll() {
    cancelled = true;
    skipAllTutorials(state);
    ctx.save();
    finish(false);
    ctx.toast('Обучение выключено. Кот-хранитель всегда рядом, если что.');
  }

  function showStep() {
    if (cancelled) return;
    if (i >= steps.length) { finish(); return; }
    const step = steps[i];
    const target = typeof step.target === 'function' ? step.target() : step.target;

    if (overlay) overlay.remove();
    overlay = document.createElement('div');
    overlay.className = 'tut-overlay';

    // Прожектор: полупрозрачная подложка с «дыркой» (box-shadow-вырез)
    const spot = document.createElement('div');
    spot.className = 'tut-spot';
    if (target && target.getBoundingClientRect) {
      const r = target.getBoundingClientRect();
      const pad = 10;
      spot.style.left = `${r.left - pad + window.scrollX}px`;
      spot.style.top = `${r.top - pad + window.scrollY}px`;
      spot.style.width = `${r.width + pad * 2}px`;
      spot.style.height = `${r.height + pad * 2}px`;
      target.scrollIntoView?.({ block: 'center', behavior: 'smooth' });
    } else {
      spot.style.display = 'none';
    }
    overlay.appendChild(spot);

    // Пузырь с репликой кота
    const bubble = document.createElement('div');
    bubble.className = 'tut-bubble';
    bubble.innerHTML = `
      <div class="tut-cat">🐈</div>
      <div class="tut-body">
        <div class="tut-title">${step.title}</div>
        <div class="tut-text">${step.text}</div>
        <div class="tut-actions"></div>
      </div>`;
    overlay.appendChild(bubble);

    // Позиционирование пузыря рядом с прожектором
    const raf = (typeof requestAnimationFrame !== 'undefined') ? requestAnimationFrame : (f) => setTimeout(f, 16);
    raf(() => positionBubble(spot, bubble));

    const actions = bubble.querySelector('.tut-actions');
    const next = document.createElement('button');
    next.className = 'primary small';
    const isLast = i === steps.length - 1;
    next.textContent = step.cta || (isLast ? 'Понял!' : 'Дальше →');
    const advance = (ev) => {
      ev?.stopPropagation?.();
      i += 1;
      ctx.sfx?.('tap');
      showStep();
    };
    next.addEventListener('click', advance);
    actions.appendChild(next);

    const skip = document.createElement('button');
    skip.className = 'ghost small';
    skip.textContent = 'Пропустить обучение';
    skip.addEventListener('click', (ev) => { ev.stopPropagation?.(); finishAll(); });
    actions.appendChild(skip);

    // Тап по самому элементу тоже двигает обучение
    if (target && target.addEventListener && step.advanceOnTargetClick !== false) {
      target.addEventListener('pointerdown', advance, { once: true });
    }

    document.body.appendChild(overlay);
  }

  showStep();
  return finish;
}

function positionBubble(spot, bubble) {
  if (!spot || spot.style.display === 'none' || !bubble) {
    if (bubble) { bubble.style.left = '50%'; bubble.style.top = '20%'; bubble.style.transform = 'translateX(-50%)'; }
    return;
  }
  const sr = spot.getBoundingClientRect();
  const bw = bubble.offsetWidth || 320;
  let left = sr.left + sr.width / 2 - bw / 2 + window.scrollX;
  left = Math.max(10, Math.min(left, (window.innerWidth || 800) - bw - 10));
  const below = sr.bottom + 14 + window.scrollY;
  const above = sr.top - (bubble.offsetHeight || 120) - 14 + window.scrollY;
  // Если снизу места мало — ставим сверху
  const viewportH = window.innerHeight || 600;
  const fitsBelow = sr.bottom + (bubble.offsetHeight || 120) + 20 < viewportH;
  bubble.style.left = `${left}px`;
  bubble.style.top = `${fitsBelow ? below : above}px`;
}
