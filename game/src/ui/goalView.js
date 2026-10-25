// Компактная карточка необязательной цели накопления и её краткая строка для наград.
import {
  savingsGoalProgress, clearSavingsGoal,
} from '../core/goals.js';

export function savingsGoalSummary(state) {
  const progress = savingsGoalProgress(state);
  if (!progress) return '';
  return `🎯 ${progress.name}: ${progress.ready ? progress.readyText : `осталось ${progress.short}`}`;
}

export function createSavingsGoalCard(ctx, { onChange } = {}) {
  const progress = savingsGoalProgress(ctx.state);
  if (!progress) return null;

  const card = document.createElement('section');
  card.className = 'panel savings-goal';
  card.dataset.goalKind = progress.kind;
  card.dataset.goalId = progress.id;

  const title = document.createElement('div');
  title.className = 'savings-goal-title';
  title.textContent = `${progress.icon} Цель: ${progress.name}`;
  card.appendChild(title);

  if (progress.kind === 'recipe') {
    const status = document.createElement('div');
    status.className = 'savings-goal-status';
    status.textContent = progress.ready ? progress.readyText : 'Пока не хватает:';
    card.appendChild(status);
    if (!progress.ready) {
      const missing = document.createElement('div');
      missing.className = 'savings-goal-missing';
      for (const entry of progress.missing) {
        const line = document.createElement('div');
        line.textContent = entry.text;
        missing.appendChild(line);
      }
      if (progress.coins.needed > 0) {
        const coins = document.createElement('div');
        coins.textContent = `🪙 ${progress.coins.current}/${progress.coins.needed}`;
        missing.appendChild(coins);
      }
      card.appendChild(missing);
    }
  } else {
    const status = document.createElement('div');
    status.className = 'savings-goal-status';
    status.textContent = progress.text;
    card.appendChild(status);
  }

  const actions = document.createElement('div');
  actions.className = 'savings-goal-actions';
  const route = document.createElement('button');
  route.className = 'small primary';
  route.textContent = 'К цели';
  route.title = progress.routeLabel;
  route.dataset.goalRoute = '1';
  route.addEventListener('click', () => ctx.go(progress.route.name, progress.route.params));
  const clear = document.createElement('button');
  clear.className = 'small ghost';
  clear.textContent = 'Сбросить';
  clear.dataset.goalClear = '1';
  clear.addEventListener('click', () => {
    if (!clearSavingsGoal(ctx.state)) return;
    ctx.save();
    if (onChange) onChange();
    else card.remove();
  });
  actions.append(route, clear);
  card.appendChild(actions);
  return card;
}
