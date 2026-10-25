// Цель накопления: чистый расчёт по существующим данным, без state.js и новых цен.
import {
  SHOP_STOCK, CREW_STOCK, SHOPS, pricedShopItem,
} from '../data/shop.js';
import { RECIPE_BY_ID } from '../data/recipes.js';
import { COMPANION_BY_ID, PET_BY_ID, MERC_BY_ID } from '../data/crew.js';
import { materialLabel } from '../data/materials.js';

const CREW_DEF = { companion: COMPANION_BY_ID, pet: PET_BY_ID, merc: MERC_BY_ID };
const SHOP_ROUTE = { armory: 'shopArmory', armorer: 'shopArmorer', magic: 'shopMagic', alchemy: 'shopAlchemy' };
const ITEM_ICON = {
  sword: '🗡️', mace: '🔨', dagger: '🔪', greatsword: '⚔️', greataxe: '🪓', bow: '🏹',
  shield: '🛡️', helmet: '🪖', armor: '🧥', gloves: '🧤', boots: '🥾',
  amulet: '📿', ring: '💍', potion: '🧪', staff: '🪄', scroll: '📜',
};

function unlocked(state, unlockAfter) {
  return !unlockAfter || !!state.battlesDone?.[unlockAfter];
}

function itemDefinition(state, id) {
  const stock = SHOP_STOCK.find((entry) => entry.itemId === id);
  if (!stock || !unlocked(state, stock.unlockAfter)) return null;
  const item = pricedShopItem(stock);
  const shopEntry = Object.entries(SHOPS).find(([, shop]) => shop.types.includes(item.type));
  if (!shopEntry) return null;
  const [shopKey, shop] = shopEntry;
  return {
    kind: 'item', id, name: item.name, icon: ITEM_ICON[item.type] || '🎁', item,
    route: { name: SHOP_ROUTE[shopKey], params: {} }, routeLabel: shop.name,
  };
}

function crewDefinition(state, id) {
  const stock = CREW_STOCK.find((entry) => entry.id === id);
  if (!stock || !unlocked(state, stock.unlockAfter)) return null;
  const crew = CREW_DEF[stock.kind]?.[id];
  if (!crew) return null;
  return {
    kind: 'crew', id, name: crew.name, icon: crew.icon || '🐾', crew,
    route: { name: 'tavern', params: {} }, routeLabel: 'Таверна и конюшня',
  };
}

function recipeDefinition(state, id) {
  const recipe = RECIPE_BY_ID[id];
  if (!recipe || !unlocked(state, recipe.unlockAfter)) return null;
  return {
    kind: 'recipe', id, name: recipe.name, icon: recipe.icon || '⚒️', recipe,
    route: { name: 'craft', params: {} }, routeLabel: 'Кузница и котёл',
  };
}

function definition(state, goal) {
  if (!goal) return null;
  if (goal.kind === 'item') return itemDefinition(state, goal.id);
  if (goal.kind === 'crew') return crewDefinition(state, goal.id);
  if (goal.kind === 'recipe') return recipeDefinition(state, goal.id);
  return null;
}

function currencyText(currency, amount) {
  const lastTwo = amount % 100;
  const last = amount % 10;
  const one = last === 1 && (lastTwo < 11 || lastTwo > 14);
  const few = last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14);
  if (currency === 'seals') {
    if (one) return 'печать';
    if (few) return 'печати';
    return 'печатей';
  }
  if (one) return 'монета';
  if (few) return 'монеты';
  return 'монет';
}

function currencyIcon(currency) {
  return currency === 'seals' ? '🔰' : '🪙';
}

export function setSavingsGoal(state, kind, id) {
  const candidate = { kind, id };
  const def = definition(state, candidate);
  if (!def) return { ok: false, error: 'Такой цели нет или она ещё закрыта' };
  state.savingsGoal = candidate;
  return { ok: true, goal: { ...candidate } };
}

export function clearSavingsGoal(state) {
  if (!state.savingsGoal) return false;
  state.savingsGoal = null;
  return true;
}

export function savingsGoalProgress(state) {
  const goal = state.savingsGoal;
  const def = definition(state, goal);
  if (!def) return null;

  if (def.kind === 'recipe') {
    const recipe = def.recipe;
    const missing = [];
    for (const [matId, need] of Object.entries(recipe.materials)) {
      const have = state.materials?.[matId] || 0;
      if (have < need) {
        missing.push({
          matId, need, have, missing: need - have,
          label: materialLabel(matId), text: `${materialLabel(matId)} ${have}/${need}`,
        });
      }
    }
    const needed = recipe.coins || 0;
    const current = state.coins || 0;
    const remaining = Math.max(0, needed - current);
    const ready = missing.length === 0 && remaining === 0;
    const parts = missing.map((entry) => `${entry.label} ×${entry.missing}`);
    if (remaining > 0) parts.push(`🪙 ${remaining}`);
    const short = parts.join(' · ');
    return {
      kind: def.kind, id: def.id, name: def.name, icon: def.icon,
      route: def.route, routeLabel: def.routeLabel,
      ready, readyText: 'Можно создать', missing,
      coins: { current, needed, remaining },
      short,
      text: ready ? 'Можно создать' : `Осталось: ${short}`,
    };
  }

  const source = def.kind === 'item' ? def.item : def.crew;
  const currency = source.sealPrice ? 'seals' : source.currency === 'seals' ? 'seals' : 'coins';
  const needed = source.sealPrice || source.price;
  const current = state[currency] || 0;
  const remaining = Math.max(0, needed - current);
  const ready = remaining === 0;
  const readyText = def.kind === 'item' ? 'Можно купить' : 'Можно нанять';
  const short = `${remaining} ${currencyText(currency, remaining)}`;
  return {
    kind: def.kind, id: def.id, name: def.name, icon: def.icon,
    route: def.route, routeLabel: def.routeLabel,
    ready, readyText, current, needed, remaining, currency,
    currencyIcon: currencyIcon(currency), missing: [],
    short,
    text: ready ? readyText : `До цели «${def.name}» осталось ${short}`,
  };
}

export function savingsGoalRoute(state) {
  return savingsGoalProgress(state)?.route || null;
}

function goalJournal(state, icon, text) {
  state.journal ||= [];
  state.journal.push({ icon, text, at: Date.now() });
  if (state.journal.length > 30) state.journal.splice(0, state.journal.length - 30);
}

export function completeSavingsGoal(state, kind, id) {
  if (state.savingsGoal?.kind !== kind || state.savingsGoal.id !== id) return false;
  const progress = savingsGoalProgress(state);
  if (!progress) return false;
  state.savingsGoal = null;
  goalJournal(state, progress.icon, `Цель достигнута: ${progress.name}.`);
  return true;
}
