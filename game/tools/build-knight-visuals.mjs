import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ITEMS } from '../src/data/items.js';

const promptsPath = fileURLToPath(new URL('../../art-src/PROMPTS_KNIGHT.md', import.meta.url));
const outputPath = fileURLToPath(new URL('../src/data/knightVisuals.js', import.meta.url));
const markdown = readFileSync(promptsPath, 'utf8');
const descriptions = {};
const row = /^\|\s*`([^`]+)`\s*\|[^|]*\|[^|]*\|([^|]+?)\s*\|\s*`parts\//gm;
for (const match of markdown.matchAll(row)) descriptions[match[1]] = match[2].trim().replace(/^`(.*)`$/, '$1');

const missing = ITEMS.filter((item) => !descriptions[item.id]).map((item) => item.id);
const unknown = Object.keys(descriptions).filter((id) => !ITEMS.some((item) => item.id === id));
if (missing.length || unknown.length || ITEMS.length !== 122) {
  throw new Error(`Каталог визуальных описаний не совпал: missing=${missing.join(',') || 'нет'}; unknown=${unknown.join(',') || 'нет'}; items=${ITEMS.length}`);
}

const ordered = Object.fromEntries(ITEMS.map((item) => [item.id, descriptions[item.id]]));
const content = `// Генерируется командой \`node tools/build-knight-visuals.mjs\` из art-src/PROMPTS_KNIGHT.md.\n`
  + `export const KNIGHT_VISUALS = Object.freeze(${JSON.stringify(ordered, null, 2)});\n`;
writeFileSync(outputPath, content, 'utf8');
console.log(`Визуальные описания обновлены: ${Object.keys(ordered).length} предметов.`);
