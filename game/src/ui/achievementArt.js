export function achievementArtUrl(achievement, { concealed = false } = {}) {
  const id = concealed && achievement?.secret ? '_secret' : (achievement?.id || '_book');
  return `assets/achievements/${id}.webp`;
}

export function achievementArtEl(achievement, {
  className = '', concealed = false, lazy = false,
} = {}) {
  const frame = document.createElement('span');
  frame.className = `achievement-art ${className}`.trim();
  frame.dataset.rarity = achievement?.rarity || 'common';

  const fallback = document.createElement('span');
  fallback.className = 'achievement-art-fallback';
  fallback.textContent = concealed && achievement?.secret ? 'Секрет' : 'Награда';
  frame.appendChild(fallback);

  const img = document.createElement('img');
  img.className = 'achievement-art-image';
  img.alt = '';
  img.decoding = 'async';
  img.draggable = false;
  if (lazy) img.loading = 'lazy';
  img.addEventListener('load', () => frame.classList.add('is-loaded'));
  img.addEventListener('error', () => {
    img.remove();
    frame.classList.add('is-missing');
  });
  img.src = achievementArtUrl(achievement, { concealed });
  frame.appendChild(img);
  return frame;
}
