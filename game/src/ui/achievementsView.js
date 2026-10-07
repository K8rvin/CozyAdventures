// Экран достижений лавки.
import { ACHIEVEMENTS } from '../data/achievements.js';
import { header, quickNav } from './common.js';

export function renderAchievements(container, ctx) {
  const { state } = ctx;
  const unlocked = state.achievements || {};
  const total = Object.keys(unlocked).length;

  container.appendChild(header(ctx, 'Достижения',
    `${total}/${ACHIEVEMENTS.length} — полки трофеев лавки`));

  const list = document.createElement('div');
  list.className = 'list';
  for (const a of ACHIEVEMENTS) {
    const got = !!unlocked[a.id];
    const row = document.createElement('div');
    row.className = 'row' + (got ? ' done' : ' locked');
    const date = got ? new Date(unlocked[a.id]).toLocaleDateString('ru-RU') : '';
    row.innerHTML = `
      <span class="icon">${got ? a.icon : '🔒'}</span>
      <span class="grow">
        <div class="name">${a.name}</div>
        <div class="desc">${a.desc}${date ? ` · ${date}` : ''}</div>
      </span>
      <span class="price">${got ? '✓' : ''}</span>`;
    list.appendChild(row);
  }
  container.appendChild(list);
  container.appendChild(quickNav(ctx, [{ icon: '🏠', label: 'В лавку', screen: 'hub' }]));
}
