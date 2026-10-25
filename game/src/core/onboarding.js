// Первая дуга и необязательный путеводитель: чистые факты, без DOM и state.js.
import {
  ONBOARDING_VERSION, ONBOARDING_BATTLE_SEED, ONBOARDING_BRANCHES,
  ONBOARDING_STEPS, ONBOARDING_STEP_BY_ID, ONBOARDING_EARN_ROUTE,
  ONBOARDING_GUIDE_SECTIONS,
} from '../data/onboarding.js';
import { ITEM_BY_ID } from '../data/items.js';
import { SHOP_STOCK, pricedShopItem } from '../data/shop.js';
import { RECIPE_BY_ID } from '../data/recipes.js';

const BRANCH_IDS = ONBOARDING_BRANCHES.map((branch) => branch.id);
const TRACKED_PURCHASES = new Set(['bt_path', 'rng_health']);
const processedBattleResults = new WeakSet();
const priceCache = new Map();

function copyRoute(route) {
  return route ? { name: route.name, params: { ...(route.params || {}) } } : null;
}

function hasItem(state, itemId) {
  return (state.inventory || []).includes(itemId)
    || (state.consumableBelt || []).includes(itemId)
    || Object.values(state.equipped || {}).includes(itemId);
}

function hasEquipped(state, itemId) {
  return Object.values(state.equipped || {}).includes(itemId);
}

function honestPuzzle(state, puzzleId) {
  const entry = state.puzzlesDone?.[puzzleId];
  return !!entry && !entry.skipped;
}

function priceOf(itemId) {
  if (!priceCache.has(itemId)) {
    const stock = SHOP_STOCK.find((entry) => entry.itemId === itemId);
    priceCache.set(itemId, stock ? pricedShopItem(stock).price : Infinity);
  }
  return priceCache.get(itemId);
}

export function newOnboardingState() {
  return {
    version: ONBOARDING_VERSION,
    status: 'active',
    step: 'prolog',
    freeChoiceId: null,
    flags: {},
    guide: { started: false, seen: [], closed: false },
  };
}

export function onboardingIsActive(state) {
  return state.onboarding?.status === 'active';
}

export function onboardingBlocksStory(state) {
  return ['active', 'paused'].includes(state.onboarding?.status);
}

export function onboardingBlocksLegacyTutorials(state) {
  return ['active', 'paused', 'done', 'skipped'].includes(state.onboarding?.status);
}

export function onboardingStep(state) {
  return ONBOARDING_STEP_BY_ID[state.onboarding?.step] || null;
}

function syncFacts(state) {
  const arc = state.onboarding;
  const flags = arc.flags;

  for (const itemId of TRACKED_PURCHASES) {
    if (hasItem(state, itemId)) flags[`bought_${itemId}`] = true;
    if (hasEquipped(state, itemId) && flags[`bought_${itemId}`]) flags[`ready_${itemId}`] = true;
  }
  if ((state.consumableBelt || []).length >= 2) flags.beltReady = true;

  const completedChoice = BRANCH_IDS.includes(arc.freeChoiceId) && honestPuzzle(state, arc.freeChoiceId)
    ? arc.freeChoiceId
    : BRANCH_IDS.find((id) => honestPuzzle(state, id)) || null;
  if (completedChoice) arc.freeChoiceId = completedChoice;
  else if (!BRANCH_IDS.includes(arc.freeChoiceId)) arc.freeChoiceId = null;
}

function targetStep(state) {
  const arc = state.onboarding;
  const flags = arc.flags;

  if (!state.story?.prologSeen) return 'prolog';
  if (!honestPuzzle(state, 'md_01')) return 'md_01';
  if (!honestPuzzle(state, 'md_02')) return 'md_02';
  if (!arc.freeChoiceId || !honestPuzzle(state, arc.freeChoiceId)) return 'branch';
  if (!state.battlesDone?.bt_slimes) return 'bt_slimes';
  if (!flags.squareSeen) return 'square';
  if (!flags.marketSeen) return 'market';
  if (!flags.ready_bt_path) return 'boots';
  if (!flags.beesAttempts && !state.battlesDone?.bt_bees) return 'bees_attempt';
  if (state.battlesDone?.bt_bees) return flags.crafted_rcp_pot_heal ? 'done' : 'craft';
  return flags.ready_rng_health && flags.beltReady ? 'bees_victory' : 'upgrade';
}

// Повторные вызовы ничего не начисляют: только сверяют факты и текущий указатель.
export function reconcileOnboarding(state) {
  const arc = state.onboarding;
  if (!arc) return false;
  const before = JSON.stringify(arc);
  arc.flags ||= {};
  arc.freeChoiceId ??= null;
  syncFacts(state);

  if (arc.status === 'active') {
    const target = targetStep(state);
    arc.step = target;
    if (target === 'done') arc.status = 'done';
  }
  arc.version = ONBOARDING_VERSION;
  return before !== JSON.stringify(arc);
}

function applyOnboardingEvent(state, change) {
  if (!state.onboarding) return false;
  const before = JSON.stringify(state.onboarding);
  state.onboarding.flags ||= {};
  change();
  reconcileOnboarding(state);
  return before !== JSON.stringify(state.onboarding);
}

export function onboardingPuzzleChoice(state, puzzleId) {
  if (!state.onboarding || state.onboarding.step !== 'branch' || !BRANCH_IDS.includes(puzzleId)) return false;
  return applyOnboardingEvent(state, () => { state.onboarding.freeChoiceId = puzzleId; });
}

export function onboardingPuzzleSolved(state, puzzleId) {
  return applyOnboardingEvent(state, () => {
    if (BRANCH_IDS.includes(puzzleId) && honestPuzzle(state, puzzleId)
      && (!honestPuzzle(state, state.onboarding.freeChoiceId) || state.onboarding.step === 'branch')) {
      state.onboarding.freeChoiceId = puzzleId;
    }
  });
}

export function onboardingPurchase(state, itemId) {
  return applyOnboardingEvent(state, () => {
    if (TRACKED_PURCHASES.has(itemId)) state.onboarding.flags[`bought_${itemId}`] = true;
  });
}

export function onboardingEquipmentChanged(state) {
  return reconcileOnboarding(state);
}

export function onboardingCrafted(state, recipeId) {
  return applyOnboardingEvent(state, () => {
    if (recipeId === 'rcp_pot_heal') state.onboarding.flags.crafted_rcp_pot_heal = true;
  });
}

export function onboardingScene(state, scene) {
  return applyOnboardingEvent(state, () => {
    if (scene === 'square') state.onboarding.flags.squareSeen = true;
    if (scene === 'market') {
      state.onboarding.flags.squareSeen = true;
      state.onboarding.flags.marketSeen = true;
    }
  });
}

export function onboardingBattleOptions(state, battleId) {
  return {
    preserveBeltOnDefeat: battleId === 'bt_bees'
      && onboardingIsActive(state)
      && !state.battlesDone?.bt_bees
      && !(state.onboarding.flags.beesAttempts > 0),
  };
}

export function onboardingFixedBattleSeed(state, battleId) {
  return onboardingIsActive(state) && ['bt_slimes', 'bt_bees'].includes(battleId)
    ? ONBOARDING_BATTLE_SEED
    : null;
}

export function onboardingBattleFinished(state, battleId, result) {
  if (!result || result.practice) return false;
  return applyOnboardingEvent(state, () => {
    if (battleId === 'bt_bees' && onboardingIsActive(state) && !processedBattleResults.has(result)) {
      processedBattleResults.add(result);
      state.onboarding.flags.beesAttempts = (state.onboarding.flags.beesAttempts || 0) + 1;
      if (!result.victory) state.onboarding.flags.beesDefeatSeen = true;
    }
  });
}

function earnRoute() {
  return copyRoute(ONBOARDING_EARN_ROUTE);
}

function purchaseRoute(state, itemId, shopRoute, equipRoute = { name: 'equip', params: {} }) {
  if (hasItem(state, itemId)) return copyRoute(equipRoute);
  return state.coins >= priceOf(itemId) ? copyRoute(shopRoute) : earnRoute();
}

function upgradeRoute(state) {
  const flags = state.onboarding.flags;
  if (!flags.ready_rng_health) {
    return purchaseRoute(state, 'rng_health', { name: 'shopMagic', params: {} });
  }
  if (!flags.beltReady) {
    const hasBeltItem = (state.inventory || []).some((id) => ITEM_BY_ID[id]?.slot === 'consumable');
    if (hasBeltItem) return { name: 'equip', params: {} };
    return state.coins >= priceOf('pot_heal')
      ? { name: 'shopAlchemy', params: {} }
      : earnRoute();
  }
  return { name: 'battle', params: { id: 'bt_bees' } };
}

function craftRoute(state) {
  const recipe = RECIPE_BY_ID.rcp_pot_heal;
  for (const [materialId, needed] of Object.entries(recipe.materials)) {
    if ((state.materials?.[materialId] || 0) < needed) {
      return {
        name: 'battle',
        params: { id: materialId === 'slime_jelly' ? 'bt_slimes' : 'bt_bees' },
      };
    }
  }
  return copyRoute(ONBOARDING_STEP_BY_ID.craft.route);
}

export function onboardingRoute(state) {
  if (!state.onboarding || ['done', 'skipped'].includes(state.onboarding.status)) return null;
  const step = onboardingStep(state);
  if (!step) return null;
  if (step.id === 'boots') {
    return purchaseRoute(state, 'bt_path', ONBOARDING_STEP_BY_ID.boots.route);
  }
  if (step.id === 'upgrade') return upgradeRoute(state);
  if (step.id === 'craft') return craftRoute(state);
  return copyRoute(step.route);
}

export function onboardingActionLabel(state, route = onboardingRoute(state)) {
  const step = onboardingStep(state);
  if (!step || !route) return '';
  if (route.name === 'puzzles' && step.earnCta) return step.earnCta;
  if (route.name === 'battle' && step.gatherCta) return step.gatherCta;
  return step.cta;
}

export function onboardingCtaForResult(state, result) {
  if (!onboardingIsActive(state) || !result) return null;
  const step = state.onboarding.step;
  const route = onboardingRoute(state);
  if (!route) return null;

  if (result.kind === 'puzzle' && ['md_01', 'md_02', ...BRANCH_IDS].includes(result.id)) {
    if (['prolog', 'done'].includes(step)) return null;
    const label = onboardingActionLabel(state, route);
    return label ? { label, route } : null;
  }
  if (result.kind === 'battle' && result.id === 'bt_slimes' && step !== 'prolog') {
    if (step === 'square') {
      return { label: 'Потратить добычу', route: { name: 'hub', params: { scene: 'lavka' } } };
    }
    return { label: onboardingActionLabel(state, route) || 'Продолжить дугу', route };
  }
  if (result.kind === 'battle' && result.id === 'bt_bees') {
    if (!['upgrade', 'bees_victory', 'craft'].includes(step)) return null;
    return { label: onboardingActionLabel(state, route) || 'Продолжить дугу', route };
  }
  return null;
}

export function pauseOnboarding(state) {
  if (!onboardingIsActive(state)) return false;
  state.onboarding.status = 'paused';
  return true;
}

export function resumeOnboarding(state) {
  if (state.onboarding?.status !== 'paused') return false;
  state.onboarding.status = 'active';
  reconcileOnboarding(state);
  return true;
}

export function skipOnboarding(state) {
  if (!['active', 'paused'].includes(state.onboarding?.status)) return false;
  state.onboarding.status = 'skipped';
  return true;
}

// Перезапуск сохраняет факты прошлых действий: reconcile сам пропустит готовое.
export function restartOnboarding(state) {
  const previous = state.onboarding || newOnboardingState();
  state.onboarding = {
    ...newOnboardingState(),
    freeChoiceId: previous.freeChoiceId || null,
    flags: { ...(previous.flags || {}), finalSeen: false },
  };
  reconcileOnboarding(state);
  return true;
}

export function startOnboardingGuide(state) {
  const arc = state.onboarding;
  if (arc?.status !== 'done' || !arc.flags.finalSeen || arc.guide?.started) return false;
  arc.guide = { started: true, seen: [], closed: false };
  return true;
}

export function closeOnboardingGuide(state) {
  const guide = state.onboarding?.guide;
  if (!guide?.started || guide.closed) return false;
  guide.closed = true;
  return true;
}

export function reopenOnboardingGuide(state) {
  const guide = state.onboarding?.guide;
  if (!guide?.started) return false;
  guide.closed = false;
  return true;
}

export function onboardingGuideNext(state) {
  const arc = state.onboarding;
  if (arc?.status !== 'done' || !arc.guide?.started || arc.guide.closed) return null;
  const seen = new Set(arc.guide.seen || []);
  return ONBOARDING_GUIDE_SECTIONS.find((section) => !seen.has(section.id)) || null;
}

// Посещение засчитывается только по фактическому маршруту после запуска путеводителя.
export function onboardingVisit(state, currentRoute, params = {}) {
  const arc = state.onboarding;
  if (arc?.status !== 'done' || !arc.guide?.started || arc.guide.closed) return false;
  const section = ONBOARDING_GUIDE_SECTIONS.find((candidate) => {
    if (candidate.route.name !== currentRoute) return false;
    if (currentRoute !== 'hub') return true;
    return (params.scene || 'lavka') === candidate.route.params.scene;
  });
  if (!section) return false;
  arc.guide.seen ||= [];
  if (arc.guide.seen.includes(section.id)) return false;
  arc.guide.seen.push(section.id);
  return true;
}

export { ONBOARDING_VERSION, ONBOARDING_STEPS };
