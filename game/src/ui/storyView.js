// Сцена истории: крупный портрет гостя, монолог по репликам, переход к заданию.
// Хозяин лавки не отвечает — гость говорит сам; тап/Enter листает реплики.
import { buildStoryScene, storyAcceptScene, storyStageLabel } from '../core/storyEngine.js';
import { onboardingBlocksStory, onboardingRoute } from '../core/onboarding.js';

export function renderStory(container, ctx, params = {}) {
  const { state } = ctx;
  if (onboardingBlocksStory(state) && state.story?.prologSeen) {
    ctx.go('hub');
    return undefined;
  }
  const scene = buildStoryScene(state);
  if (!scene) { ctx.go('hub'); return undefined; }
  const prologOnly = scene.kind === 'prolog'
    && (!!params.prologOnly || onboardingBlocksStory(state));

  let idx = 0;

  const stage = document.createElement('div');
  stage.className = 'panel story-stage';

  // Кнопка выхода: задание не теряется, гость просто ждёт в лавке
  const leave = document.createElement('button');
  leave.className = 'ghost small story-leave';
  leave.textContent = '← В лавку';
  leave.addEventListener('click', () => { ctx.sfx?.('tap'); ctx.go('hub'); });
  stage.appendChild(leave);

  // Крупный портрет гостя (арт или медальон-эмодзи, как в варке)
  const portraitBox = document.createElement('div');
  portraitBox.className = 'story-portrait';
  stage.appendChild(portraitBox);

  // Имя и стадия отношений
  const who = document.createElement('div');
  who.className = 'story-who';
  stage.appendChild(who);

  // Речевой пузырь
  const bubble = document.createElement('div');
  bubble.className = 'story-bubble';
  stage.appendChild(bubble);

  // Строка «Задание: ...» на последней реплике
  const taskLine = document.createElement('div');
  taskLine.className = 'story-task muted';
  stage.appendChild(taskLine);

  // Точки-прогресс реплик
  const dots = document.createElement('div');
  dots.className = 'story-dots';
  stage.appendChild(dots);

  // Основная кнопка
  const nextBtn = document.createElement('button');
  nextBtn.className = 'primary story-next';
  stage.appendChild(nextBtn);

  function drawPortrait(step) {
    portraitBox.innerHTML = '';
    if (step.art) {
      const img = document.createElement('img');
      img.src = step.art;
      img.alt = step.name;
      img.addEventListener('error', () => { img.remove(); portraitBox.textContent = step.icon; });
      portraitBox.appendChild(img);
    } else {
      portraitBox.textContent = step.icon;
    }
  }

  function draw() {
    const step = scene.steps[idx];
    const isLast = idx === scene.steps.length - 1;
    drawPortrait(step);
    who.innerHTML = '';
    const nameEl = document.createElement('b');
    nameEl.textContent = `${step.icon} ${step.name}`;
    who.appendChild(nameEl);
    if (scene.kind === 'visit') {
      const stageEl = document.createElement('span');
      stageEl.className = 'story-stage-label muted';
      stageEl.textContent = ` · ${storyStageLabel(scene.visit)}`;
      who.appendChild(stageEl);
    }
    bubble.textContent = step.text;
    bubble.classList.remove('story-pop');
    void bubble.offsetWidth;
    bubble.classList.add('story-pop');
    taskLine.textContent = !prologOnly && isLast && scene.puzzleName ? `🔔 Задание: «${scene.puzzleName}»` : '';
    dots.innerHTML = '';
    for (let i = 0; i < scene.steps.length; i += 1) {
      const d = document.createElement('span');
      d.className = `story-dot${i <= idx ? ' on' : ''}`;
      dots.appendChild(d);
    }
    if (isLast) nextBtn.textContent = prologOnly ? 'К первой загадке ▸' : scene.puzzleId ? 'К делу ▸' : 'В лавку ▸';
    else nextBtn.textContent = 'Дальше ▸';
  }

  function finish() {
    storyAcceptScene(state, scene, { prologOnly });
    ctx.save();
    if (prologOnly) {
      const nextRoute = onboardingRoute(state);
      if (nextRoute) ctx.go(nextRoute.name, nextRoute.params);
      else ctx.go('hub');
    } else if (scene.puzzleId) ctx.go('puzzle', { id: scene.puzzleId });
    else ctx.go('hub');
  }

  function next() {
    if (idx >= scene.steps.length - 1) { finish(); return; }
    idx += 1;
    ctx.sfx?.('page');
    draw();
  }

  nextBtn.addEventListener('click', next);
  bubble.addEventListener('click', next);
  portraitBox.addEventListener('click', next);
  const onKey = (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); next(); }
    if (ev.key === 'Escape') ctx.go('hub');
  };
  window.addEventListener('keydown', onKey);

  draw();
  ctx.sfx?.('bubble');
  container.appendChild(stage);

  return () => window.removeEventListener('keydown', onKey);
}
