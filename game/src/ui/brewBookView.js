// Книга собранных рецептов: все зелья алхимического стола.
// Сваренные — с полным рецептом, остальные — под замком.
import { BREW_PUZZLES } from '../data/puzzlesBrew.js';
import { brewStepText } from '../core/brewPuzzle.js';
import { header, quickNav } from './common.js';

export function renderBrewBook(container, ctx) {
  const { state } = ctx;
  ctx.sfx?.('page');
  container.appendChild(header(ctx, '📖 Книга рецептов', 'Зелья алхимического стола — коллекция хозяина', 'puzzles'));

  const list = document.createElement('div');
  list.className = 'list';
  for (const level of BREW_PUZZLES) {
    const done = !!state.puzzlesDone[level.id];
    const stars = '★'.repeat(level.difficulty) + '☆'.repeat(5 - level.difficulty);
    const entry = document.createElement('div');
    entry.className = 'panel brew-book-entry';
    const steps = done
      ? level.recipe.map((s, i) => `<div class="brew-step done">${i + 1}. ${brewStepText(level, s)}</div>`).join('')
      : '<div class="muted">Ещё не сварено — страница заполнится после первой варки.</div>';
    entry.innerHTML = `
      <div class="name" style="font-weight:700">${done ? '⚗️' : '🔒'} ${level.name} <span class="badge">${stars}</span></div>
      <div class="brew-book-steps">${steps}</div>`;
    list.appendChild(entry);
  }
  container.appendChild(list);
  container.appendChild(quickNav(ctx, [
    { icon: '🧩', label: 'К загадкам', screen: 'puzzles', primary: true },
    { icon: '🏠', label: 'В лавку', screen: 'hub' },
  ]));
}
