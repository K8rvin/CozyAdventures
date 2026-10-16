// Флакон готового зелья: 6 SVG-силуэтов + тонировка под цвет варки.
// Никаких файлов-артов: вид (цвет, свечение, блёстки) приходит из
// brewPotionLook/brewFinalLook. Чистые строки, DOM не нужен (тесты в node).
// Силуэты: круглая колба, высокая бутыль, квадратная, пузырёк, широкая, коническая.
const SHAPES = [
  { path: 'M26 8 h12 v18 c4 6 14 16 14 32 a20 20 0 1 1 -40 0 c0 -16 10 -26 14 -32 z', liquidY: 48, cork: { x: 25, y: 1, w: 14, h: 8 } },
  { path: 'M24 4 h16 v28 l10 12 v30 a8 8 0 0 1 -8 8 h-16 a8 8 0 0 1 -8 -8 v-30 l6 -12 z', liquidY: 44, cork: { x: 22, y: 0, w: 20, h: 7 } },
  { path: 'M22 12 h20 v12 h6 v52 a6 6 0 0 1 -6 6 h-20 a6 6 0 0 1 -6 -6 v-52 h6 z', liquidY: 42, cork: { x: 23, y: 4, w: 18, h: 8 } },
  { path: 'M32 6 h16 v48 a16 16 0 0 1 -32 0 v-48 z', liquidY: 36, cork: { x: 14, y: 0, w: 36, h: 7 } },
  { path: 'M26 10 h12 v10 h14 v44 a10 10 0 0 1 -10 10 h-20 a10 10 0 0 1 -10 -10 v-44 h14 z', liquidY: 36, cork: { x: 25, y: 2, w: 14, h: 8 } },
  { path: 'M26 6 h12 v20 l16 44 a8 8 0 0 1 -8 12 h-28 a8 8 0 0 1 -8 -12 l16 -44 z', liquidY: 58, cork: { x: 25, y: 0, w: 14, h: 7 } },
];

let flaskSeq = 0; // уникальные id клип-масок (на странице бывает до 100 флаконов)

// Силуэт флакона по id уровня: стабильно и равномерно по архетипам.
export function brewFlaskVariant(levelId) {
  const n = parseInt(String(levelId).replace(/\D/g, ''), 10);
  return Number.isFinite(n) ? n % SHAPES.length : 0;
}

// HTML флакона: look = { color, glow, sparkles }, size — ширина в px.
export function brewFlaskHtml(look, variant = 0, size = 64) {
  const s = SHAPES[((variant % SHAPES.length) + SHAPES.length) % SHAPES.length];
  const clipId = `brew-flask-${flaskSeq += 1}`;
  const h = Math.round(size * 88 / 64);
  const spark = look.sparkles ? '<span class="brew-flask-spark">✨</span>' : '';
  return `<span class="brew-flask${look.glow ? ' glow' : ''}"><svg width="${size}" height="${h}" viewBox="0 0 64 88" role="img" aria-label="Флакон зелья">
  <defs><clipPath id="${clipId}"><path d="${s.path}"/></clipPath></defs>
  <g clip-path="url(#${clipId})">
    <rect x="0" y="${s.liquidY}" width="64" height="${88 - s.liquidY}" fill="${look.color}"/>
    <ellipse cx="24" cy="60" rx="4" ry="10" fill="rgba(255,255,255,0.22)"/>
  </g>
  <path d="${s.path}" fill="rgba(215,232,245,0.10)" stroke="rgba(215,232,245,0.75)" stroke-width="2.5"/>
  <rect x="${s.cork.x}" y="${s.cork.y}" width="${s.cork.w}" height="${s.cork.h}" rx="2" fill="#8a6a42" stroke="#5d4426"/>
</svg>${spark}</span>`;
}
