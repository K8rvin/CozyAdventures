import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { ACHIEVEMENTS } from '../src/data/achievements.js';

const special = [
  {
    id: '_book', rarity: 'legendary', variant: 4,
    sourceArt: 'assets/trophies/tro_captain_medal.png',
  },
  {
    id: '_secret', rarity: 'epic', variant: 3, secret: true,
    sourceArt: 'assets/trophies/tro_keeper_quill.png',
  },
];
const requested = new Set(process.argv.slice(2));
const known = new Set([...ACHIEVEMENTS, ...special].map((achievement) => achievement.id));
const unknown = [...requested].filter((id) => !known.has(id));
if (unknown.length) {
  console.error(`Неизвестные достижения: ${unknown.join(', ')}`);
  process.exit(1);
}
const catalog = requested.size ? ACHIEVEMENTS.filter((achievement) => requested.has(achievement.id)) : ACHIEVEMENTS;
const extras = requested.size ? special.filter((achievement) => requested.has(achievement.id)) : special;
const items = [...catalog, ...extras].map((achievement) => ({
  id: achievement.id,
  rarity: achievement.rarity,
  variant: achievement.variant,
  secret: achievement.secret === true,
  sourceArt: achievement.sourceArt,
}));

const errors = [];
const ids = new Set();
for (const item of items) {
  if (ids.has(item.id)) errors.push(`Повторный id: ${item.id}`);
  ids.add(item.id);
  if (!item.sourceArt || !existsSync(new URL(`../${item.sourceArt}`, import.meta.url))) {
    errors.push(`Нет исходника для ${item.id}: ${item.sourceArt || 'не задан'}`);
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

const result = spawnSync('python', ['tools/build_achievement_art.py'], {
  cwd: new URL('..', import.meta.url),
  input: JSON.stringify(items),
  encoding: 'utf8',
  maxBuffer: 1024 * 1024,
  env: {
    ...process.env,
    ACHIEVEMENT_CONTACT_PREFIX: requested.size ? 'achievements-patch' : 'achievements-contact',
  },
});
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
process.exit(result.status ?? 1);
