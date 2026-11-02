import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function publicConfigSource(env = {}) {
  const base = String(env.COZY_API_BASE_URL || '').replace(/\/$/, '');
  const portrait = String(env.KNIGHT_IMAGE_API_URL || (base ? `${base}/api/knight-image` : ''));
  return `globalThis.KNIGHT_IMAGE_API_URL = ${JSON.stringify(portrait)};\n`
    + `globalThis.COZY_API_BASE_URL = ${JSON.stringify(base)};\n`;
}

export function parseEnv(text) {
  const result = {};
  for (const line of String(text).split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (match) result[match[1]] = match[2].trim();
  }
  return result;
}

async function main() {
  const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
  const envPath = resolve(root, '.env');
  if (!existsSync(envPath)) return;
  const env = parseEnv(await readFile(envPath, 'utf8'));
  await writeFile(resolve(root, 'game', 'knight-api.js'), publicConfigSource(env), 'utf8');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
