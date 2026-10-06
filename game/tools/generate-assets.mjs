// Генерация игровых ассетов через cleanapis API (OpenAI-совместимый чат).
// Ключи читаются из ../.env и НИКОГДА не печатаются.
// Модель пишет SVG-код — он же и есть ассет.
//
// Режимы:
//   node tools/generate-assets.mjs              — финальные ассеты в assets/
//   node tools/generate-assets.mjs --only=hub_banner
//   node tools/generate-assets.mjs --variants   — сетка СТИЛИ × МОДЕЛИ в
//                                                 assets/variants/ + assets/gallery.html

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ENV_PATH = join(ROOT, '..', '.env');
const OUT_DIR = join(ROOT, 'assets');
const VARIANTS_DIR = join(OUT_DIR, 'variants');

function loadEnv() {
  const out = {};
  for (const line of readFileSync(ENV_PATH, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (m) out[m[1]] = m[2].trim();
  }
  return out;
}

const env = loadEnv();
const API_URL = (env.cleanapis_API_URL || 'https://cleanapis.com/v1').replace(/\/$/, '');
const API_KEY = env.cleanapis_API_KEY || env.EXPLABS_API_KEY;
if (!API_KEY) {
  console.error('Нет ключа в .env (cleanapis_API_KEY или EXPLABS_API_KEY)');
  process.exit(1);
}

const DEFAULT_MODEL = process.env.ASSET_MODEL || 'gpt-5.6-luna';
const MAX_TOKENS = 120000; // по запросу: полный бюджет на ответ

// --- Модели и стили для вариантов ---
const MODELS = ['gpt-5.6-luna', 'deepseek-v4-pro-0813', 'seed-2.1-turbo'];

const STYLES = {
  storybook: 'Classic storybook watercolor illustration, soft hand-painted texture, gentle ink outlines, warm candlelit mood, muted earthy palette with amber accents',
  pixel: 'Detailed pixel art, 2x upscale, cozy 16-bit JRPG style, limited warm palette, crisp clusters, soft dithering, no blur',
  flat: 'Modern flat vector illustration, bold clean shapes, cozy warm palette (deep brown #3d2f22, amber #ffca7a, moss #5d6b3f, cream #f3e6cf), soft shadows, minimal detail',
};

const SCENE_PROMPTS = {
  hub_banner: (style) => `${style}. A cozy magical shop interior, wide banner: wooden shelves with potions and lanterns, a counter, a sleeping cat, a knight's helmet on a stand, warm candlelight. No text, no letters, no watermarks. Output ONLY valid SVG markup starting with <svg and ending with </svg>. viewBox="0 0 1000 340".`,
  icon_knight: (style) => `${style}. A cute small knight portrait icon for a cozy fantasy game, helmet with a leaf plume, round friendly shapes, centered. No text. Output ONLY valid SVG markup starting with <svg and ending with </svg>. viewBox="0 0 128 128".`,
};

// --- Финальные ассеты (продакшн) ---
const STYLE = `Flat cozy vector illustration, warm medieval-fantasy palette (deep brown wood #3d2f22, amber light #ffca7a, moss green #5d6b3f, cream #f3e6cf), soft shapes, no text, no letters, no watermarks. Output ONLY valid SVG markup starting with <svg and ending with </svg>. No explanations.`;

const ASSETS = {
  hub_banner: { file: 'hub_banner.svg', prompt: `A cozy magical shop interior seen from above-front, wide banner: wooden shelves with potions and lanterns, a counter, a sleeping cat, a knight's helmet on a stand, warm candlelight. ${STYLE} viewBox="0 0 1000 340".` },
  meadow_scene: { file: 'seek_meadow.svg', prompt: `Top-down cozy forest glade scene for a hidden-object game: soft grass tufts, mushrooms, morning dew sparkles, fireflies, tree roots at edges. ${STYLE} viewBox="0 0 800 500".` },
  town_scene: { file: 'seek_town.svg', prompt: `Top-down cozy medieval market courtyard scene: cobblestone, crates, barrels, cart wheels, hanging lanterns, fabric awnings. ${STYLE} viewBox="0 0 800 500".` },
  attic_scene: { file: 'seek_attic.svg', prompt: `Top-down cozy old library attic scene: stacks of books, scrolls, candle stubs, ink bottles, dust motes in light beams, wooden floor. ${STYLE} viewBox="0 0 800 500".` },
  knight_icon: { file: 'icon_knight.svg', prompt: `A cute small knight portrait icon for a cozy fantasy game, helmet with a leaf plume, round friendly shapes, centered. ${STYLE} viewBox="0 0 128 128".` },
  intro_anim: { file: 'intro_anim.svg', prompt: `An ANIMATED SVG (use <animate> and <animateTransform> SMIL elements) of a cozy lantern-lit shop sign swaying gently in the wind at dusk, fireflies blinking in and out, stars fading in. Smooth slow loops. ${STYLE} viewBox="0 0 800 400".` },
};

async function chat(prompt, model) {
  const res = await fetch(`${API_URL}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'Ты — генератор SVG-графики. Отвечаешь только валидным SVG-кодом, без пояснений и без markdown-ограждений.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
      max_tokens: MAX_TOKENS,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error(`пустой ответ: ${JSON.stringify(data).slice(0, 200)}`);
  return content;
}

async function chatWithRetry(prompt, model, tries = 2) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try { return await chat(prompt, model); }
    catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 4000 * (i + 1)));
    }
  }
  throw lastErr;
}

function extractSvg(text) {
  const m = text.match(/<svg[\s\S]*<\/svg>/);
  return m ? m[0] : null;
}

// --- Финальные ассеты ---
async function genFinal() {
  mkdirSync(OUT_DIR, { recursive: true });
  const onlyArg = process.argv.find((a) => a.startsWith('--only='));
  const only = onlyArg ? onlyArg.split('=')[1].split(',') : null;
  for (const [key, asset] of Object.entries(ASSETS)) {
    if (only && !only.includes(key)) continue;
    const out = join(OUT_DIR, asset.file);
    process.stdout.write(`Генерация ${asset.file} [${DEFAULT_MODEL}]... `);
    try {
      const svg = extractSvg(await chatWithRetry(asset.prompt, DEFAULT_MODEL));
      if (!svg) { console.log('ОТВЕТ БЕЗ SVG, пропускаю'); continue; }
      writeFileSync(out, svg, 'utf8');
      console.log(`OK (${svg.length} байт)`);
    } catch (e) {
      console.log(`ОШИБКА: ${e.message}`);
    }
  }
}

// --- Варианты: СТИЛИ × МОДЕЛИ + галерея ---
async function genVariants() {
  mkdirSync(VARIANTS_DIR, { recursive: true });
  const results = [];
  for (const [styleKey, styleDesc] of Object.entries(STYLES)) {
    for (const model of MODELS) {
      for (const [assetKey, promptFn] of Object.entries(SCENE_PROMPTS)) {
        const file = `${assetKey}_${styleKey}_${model.replace(/[^a-z0-9]/gi, '-')}.svg`;
        const out = join(VARIANTS_DIR, file);
        process.stdout.write(`${file} ... `);
        try {
          const svg = extractSvg(await chatWithRetry(promptFn(styleDesc), model, 2));
          if (!svg) { console.log('БЕЗ SVG'); results.push({ file: null, styleKey, model, assetKey }); continue; }
          writeFileSync(out, svg, 'utf8');
          console.log(`OK (${svg.length} байт)`);
          results.push({ file: `variants/${file}`, styleKey, model, assetKey });
        } catch (e) {
          console.log(`ОШИБКА: ${e.message}`);
          results.push({ file: null, styleKey, model, assetKey, error: e.message });
        }
      }
    }
  }
  writeGallery(results);
  console.log('Галерея: assets/gallery.html — открой в браузере и выбери вариант.');
}

const STYLE_RU = { storybook: 'Книжная акварель', pixel: 'Пиксель-арт', flat: 'Флэт-вектор' };

function writeGallery(results) {
  const cards = results.map((r) => r.file
    ? `<div class="card"><div class="label">${r.assetKey}<br>${STYLE_RU[r.styleKey]} · ${r.model}</div>
       <img src="${r.file}" alt="${r.assetKey} ${r.styleKey} ${r.model}"><code>${r.file}</code></div>`
    : `<div class="card fail"><div class="label">${r.assetKey}<br>${STYLE_RU[r.styleKey]} · ${r.model}</div>генерация не удалась</div>`
  ).join('\n');
  const html = `<!DOCTYPE html>
<html lang="ru"><head><meta charset="UTF-8"><title>Варианты ассетов — выбор</title>
<style>
body{background:#2b2118;color:#f3e6cf;font-family:system-ui,sans-serif;padding:20px;max-width:1400px;margin:0 auto}
h1{font-size:22px}p{color:#c9b294}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px}
.card{background:#3d2f22;border-radius:12px;padding:10px}
.card img{width:100%;border-radius:8px;background:#241b12}
.label{font-size:13px;color:#ffca7a;margin-bottom:8px;font-weight:600}
code{font-size:11px;color:#c9b294;display:block;margin-top:6px;word-break:break-all}
.fail{opacity:.5;min-height:80px}
</style></head><body>
<h1>Варианты ассетов: 3 стиля × 3 модели</h1>
<p>Скажи разработчику (или ИИ-агенту), какой вариант нравится — например «hub_banner_storybook_gpt-5-6-luna».
Выбранный файл будет скопирован в assets/ как основной.</p>
<div class="grid">
${cards}
</div></body></html>`;
  writeFileSync(join(OUT_DIR, 'gallery.html'), html, 'utf8');
}

const isVariants = process.argv.includes('--variants');
const onlyArg = process.argv.find((a) => a.startsWith('--only='));
if (isVariants) genVariants();
else if (onlyArg || !process.argv.includes('--variants')) genFinal();
