// Док первой дуги и необязательного путеводителя: в body, а не внутри экрана.
import {
  onboardingStep, onboardingRoute, onboardingActionLabel,
  pauseOnboarding, resumeOnboarding, skipOnboarding,
  startOnboardingGuide, closeOnboardingGuide, onboardingGuideNext,
} from '../core/onboarding.js';
import {
  ONBOARDING_STEPS, ONBOARDING_BRANCHES, ONBOARDING_FINAL_ROUTES, ONBOARDING_GUIDE_SECTIONS,
} from '../data/onboarding.js';
import { startTutorial, destroyTutorial } from './tutorial.js';

let dockEl = null;
let dockParent = null;
let viewKey = '';
let hintSignature = '';
let hintTarget = null;

function makeButton(label, className, onClick, data = {}) {
  const button = document.createElement('button');
  button.className = className;
  button.textContent = label;
  Object.assign(button.dataset, data);
  button.addEventListener('click', () => {
    button.disabled = true;
    onClick();
  });
  return button;
}

function removeDock() {
  dockEl?.remove();
  dockEl = null;
  dockParent = null;
  viewKey = '';
  hintSignature = '';
  hintTarget = null;
}

export function destroyOnboardingDock() {
  destroyTutorial();
  removeDock();
}

function skipArc(ctx) {
  if (!skipOnboarding(ctx.state)) return;
  destroyTutorial();
  ctx.save();
  ctx.toast?.('Первая дуга пропущена. Все разделы остаются открыты.');
}

function goRoute(ctx, route) {
  if (route) ctx.go(route.name, route.params || {});
}

function finishCard(ctx) {
  ctx.state.onboarding.flags.finalSeen = true;
  startOnboardingGuide(ctx.state);
  ctx.save();
}

function hideGuide(ctx) {
  if (!closeOnboardingGuide(ctx.state)) return;
  destroyTutorial();
  ctx.save();
}

function targetSelector(step, route, state) {
  let selector = step.targets?.[route.name] || null;
  if (step.id === 'upgrade' && route.name === 'equip'
    && Object.values(state.equipped || {}).includes('rng_health')) {
    selector = '[data-belt-slot="1"]';
  }
  return selector;
}

function maybeHint(ctx, step, route) {
  const selector = targetSelector(step, route, ctx.state);
  if (!selector || !step.hint) return;
  if (hintTarget && hintTarget.isConnected === false) {
    destroyTutorial();
    hintSignature = '';
    hintTarget = null;
  }
  const signature = `${step.id}|${route.name}|${JSON.stringify(route.params || {})}|${selector}`;
  if (hintSignature === signature) return;
  const target = document.querySelector(selector);
  if (!target) return;
  hintSignature = signature;
  hintTarget = target;
  startTutorial(ctx, `onboarding_${step.id}`, [{
    target,
    title: step.hintTitle || step.title,
    text: step.hint,
    cta: 'Понятно',
    advanceOnTargetClick: false,
  }], {
    skipLabel: 'Пропустить дугу',
    onSkip: () => skipArc(ctx),
  });
}

function renderGuide(ctx) {
  const guide = ctx.state.onboarding.guide;
  const next = onboardingGuideNext(ctx.state);
  const count = (guide.seen || []).length;
  const head = document.createElement('div');
  head.className = 'onboarding-head';
  const eyebrow = document.createElement('span');
  eyebrow.className = 'onboarding-eyebrow';
  eyebrow.textContent = `Путеводитель ${count}/${ONBOARDING_GUIDE_SECTIONS.length}`;
  const title = document.createElement('div');
  title.className = 'onboarding-title';
  title.textContent = next ? next.title : 'Лавка знакома';
  head.append(eyebrow, title);
  const goal = document.createElement('div');
  goal.className = 'onboarding-goal';
  goal.textContent = next
    ? next.short
    : 'Все разделы осмотрены. Возвращайся к ним в любое время — обязательных дел больше нет.';
  const actions = document.createElement('div');
  actions.className = 'onboarding-actions';
  if (next) {
    actions.appendChild(makeButton('Посмотреть раздел', 'primary small', () => {
      goRoute(ctx, next.route);
    }, { onboardingGuideRoute: next.id }));
  }
  actions.appendChild(makeButton('Скрыть', 'ghost small', () => hideGuide(ctx), {
    onboardingAction: 'guide-close',
  }));
  dockEl.append(head, goal, actions);
}

export function syncOnboardingDock(ctx, current = { name: 'hub', params: {} }) {
  const arc = ctx.state.onboarding;
  const step = onboardingStep(ctx.state);
  const guideVisible = arc?.status === 'done' && arc.guide?.started && !arc.guide.closed;
  const finalVisible = arc?.status === 'done' && !arc.flags.finalSeen;
  const arcVisible = ['active', 'paused'].includes(arc?.status);
  if (current.name === 'battleLore' || !arc || !step || arc.status === 'skipped'
    || (!arcVisible && !finalVisible && !guideVisible)) {
    removeDock();
    destroyTutorial();
    return;
  }

  const nextViewKey = `${arc.status}|${step.id}|${current.name}|${JSON.stringify(current.params || {})}|${guideVisible ? (arc.guide.seen || []).length : 'нет'}|${arc.guide?.closed ? 1 : 0}`;
  if (nextViewKey !== viewKey) {
    destroyTutorial();
    hintSignature = '';
    hintTarget = null;
    viewKey = nextViewKey;
  }

  if (dockEl && ((dockEl.parent || dockEl.parentNode) !== document.body || dockParent !== document.body)) {
    removeDock();
  }
  if (!dockEl) {
    dockEl = document.createElement('aside');
    dockParent = document.body;
    document.body.appendChild(dockEl);
  }
  dockEl.className = `onboarding-dock${arc.status === 'paused' ? ' compact' : guideVisible ? ' guide' : ''}`;
  dockEl.dataset.onboardingStatus = arc.status;
  dockEl.dataset.onboardingStep = step.id;
  dockEl.dataset.onboardingGuide = guideVisible ? '1' : '0';
  dockEl.setAttribute('aria-label', guideVisible ? 'Путеводитель хозяина' : 'Первая игровая дуга');
  dockEl.setAttribute('aria-live', 'polite');
  dockEl.innerHTML = '';

  if (arc.status === 'paused') {
    const text = document.createElement('span');
    text.className = 'onboarding-paused-text';
    text.textContent = `Пауза: ${step.title}`;
    const resume = makeButton('Продолжить обучение', 'primary small', () => {
      if (!resumeOnboarding(ctx.state)) return;
      ctx.save();
      goRoute(ctx, onboardingRoute(ctx.state));
    }, { onboardingAction: 'resume' });
    dockEl.append(text, resume);
    return;
  }

  if (guideVisible) {
    renderGuide(ctx);
    destroyTutorial();
    return;
  }

  if (arc.status === 'done') {
    const title = document.createElement('div');
    title.className = 'onboarding-title';
    title.textContent = `🏮 ${step.title}`;
    const goal = document.createElement('div');
    goal.className = 'onboarding-goal';
    goal.textContent = step.goal;
    const routes = document.createElement('div');
    routes.className = 'onboarding-final-routes';
    for (const item of ONBOARDING_FINAL_ROUTES) {
      routes.appendChild(makeButton(`${item.icon} ${item.label}`, 'ghost small', () => {
        finishCard(ctx);
        goRoute(ctx, item.route);
      }, { onboardingRoute: item.id }));
    }
    const close = makeButton('Скрыть финал', 'ghost small', () => finishCard(ctx), {
      onboardingAction: 'dismiss',
    });
    dockEl.append(title, goal, routes, close);
    destroyTutorial();
    return;
  }

  const head = document.createElement('div');
  head.className = 'onboarding-head';
  const position = ONBOARDING_STEPS.findIndex((candidate) => candidate.id === step.id) + 1;
  const total = ONBOARDING_STEPS.length - 1;
  const eyebrow = document.createElement('span');
  eyebrow.className = 'onboarding-eyebrow';
  eyebrow.textContent = `Первая дуга · ${position}/${total}`;
  const title = document.createElement('div');
  title.className = 'onboarding-title';
  title.textContent = step.title;
  head.append(eyebrow, title);

  const goal = document.createElement('div');
  goal.className = 'onboarding-goal';
  goal.textContent = step.goal;
  const actions = document.createElement('div');
  actions.className = 'onboarding-actions';
  const route = onboardingRoute(ctx.state);
  if (route) {
    actions.appendChild(makeButton(onboardingActionLabel(ctx.state, route), 'primary small', () => goRoute(ctx, route), {
      onboardingRoute: step.id,
    }));
  }
  actions.appendChild(makeButton('Свернуть', 'ghost small', () => {
    if (pauseOnboarding(ctx.state)) {
      destroyTutorial();
      ctx.save();
    }
  }, { onboardingAction: 'pause' }));
  actions.appendChild(makeButton('Пропустить дугу', 'ghost small', () => skipArc(ctx), {
    onboardingAction: 'skip',
  }));
  dockEl.append(head, goal, actions);

  if (step.id === 'branch') {
    const choices = document.createElement('div');
    choices.className = 'onboarding-branches';
    for (const branch of ONBOARDING_BRANCHES) {
      choices.appendChild(makeButton(`${branch.icon} ${branch.name}`, 'ghost small', () => {
        goRoute(ctx, branch.route);
      }, { onboardingChoice: branch.id }));
    }
    dockEl.appendChild(choices);
  }

  maybeHint(ctx, step, current);
}
