import { spawnSync } from 'node:child_process';
import { statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ITEMS } from '../src/data/items.js';
import {
  KNIGHT_DOLL_BASES,
  KNIGHT_DOLL_BODY_IDS,
  KNIGHT_DOLL_DEFAULT_BODY,
  KNIGHT_DOLL_ITEM_RULES,
  KNIGHT_DOLL_LAYERS,
  KNIGHT_DOLL_SECOND_SLOT,
  KNIGHT_DOLL_SIZE,
  hasKnightDollBodyVariant,
} from '../src/data/knightDoll.js';
import { resolveKnightDoll } from '../src/core/knightDoll.js';

const GAME_ROOT = fileURLToPath(new URL('..', import.meta.url));
const MANIFEST_PATH = path.join(GAME_ROOT, 'src', 'data', 'knightDollAssets.js');
const RUNTIME_PREFIX = 'assets/knight/';
const SPECIAL_IDS = [
  'room',
  ...KNIGHT_DOLL_BODY_IDS.flatMap((bodyId) => KNIGHT_DOLL_BASES[bodyId].layers
    .filter((base) => base.key !== 'room')
    .map((base) => `${bodyId}_${base.key}`)),
];

const HELP = `Использование (cwd = game, Node >= 22, Python + Pillow только для разработки):
  node tools/build-knight-art.mjs [--check] [--manifest-only] [itemId ...]
  node tools/build-knight-art.mjs room male_body male_hands female_body female_hands
  node tools/build-knight-art.mjs --check arm_ash_wayfarer rng_luck pot_heal
  node tools/build-knight-art.mjs --check male/arm_ash_wayfarer
  node tools/build-knight-art.mjs --check female/arm_ash_wayfarer

Без itemId обрабатываются все доступные исходники. Валидные комплекты экспортируются,
а каждый отсутствующий или невалидный источник попадает в отчёт и даёт exit 1;
в этом случае manifest не перезаписывается. Иконки предметов не используются.

  --check          только проверить выбранные исходники, alpha, кадры и сдвиги;
                   ничего не записывать, включая manifest и контактные листы
  --manifest-only  не открывать изображения; заново собрать manifest по ВСЕМ
                   ожидаемым runtime-файлам, которые уже существуют. Переданные
                   itemId игнорируются. Не совместимо с --check
  --help, -h       показать эту справку

Выборочно разрешены специальные id:
  ${SPECIAL_IDS.join(', ')}
Для предметов с hasKnightDollBodyVariant(item) обычный itemId выбирает обе версии,
а <bodyId>/<itemId> — только одну. Это armor и id из KNIGHT_DOLL_BODY_VARIANT_ITEMS.
Для остальных предметов используется прежний неуточнённый itemId.

Исходники: ../art-src/knight/room.png (или room.jpg), doll/<bodyId>/*.png,
parts/<bodyId>/<itemId>.png для body-specific предметов и parts/<itemId>.png
для остальных. Специальные back/grip лежат рядом с соответствующим main.
full.png — только master для difference, экспортёр его не читает.
Результат: assets/knight/**/*.webp, 768x960, WebP quality=89, method=6.
Все doll/parts одного комплекта должны иметь одинаковый кадр 4:5, ориентир
1536x1920. Для ring и consumable второй WebP создаётся сдвигом исходного
полноразмерного слоя; выход содержимого за кадр является ошибкой.

Если room и база конкретного тела доступны, создаются
../tmp/knight-contact[-patch]-<bodyId>-*.jpg. Unisex-предметы проверяются на
${KNIGHT_DOLL_DEFAULT_BODY}, body-specific — на своём теле. Неготовая база одного тела
не останавливает экспорт слоёв или QA другого тела. Manifest после успешного
выборочного экспорта сохраняет файлы других волн и обе версии body-specific предметов.
Питомцы в manifest не входят. .env не читается.`;

function runtimePath(src) {
  return path.join(GAME_ROOT, ...src.split('/'));
}

function sourceFromRuntime(layer) {
  if (!layer.src.startsWith(RUNTIME_PREFIX) || !layer.src.endsWith('.webp')) {
    throw new Error(`Неожиданный runtime-путь слоя: ${layer.src}`);
  }
  const relative = layer.src.slice(RUNTIME_PREFIX.length, -'.webp'.length);
  return {
    part: layer.part,
    src: layer.src,
    sourceCandidates: [`${relative}.png`],
  };
}

function makeBaseTask(base, id, bodyId) {
  const source = sourceFromRuntime({ src: base.src, part: 'main' });
  if (base.key === 'room') source.sourceCandidates = ['room.png', 'room.jpg'];
  return {
    id,
    key: base.key,
    kind: 'base',
    bodyId,
    wave: bodyId ? `основа/${bodyId}` : 'основа',
    slot: base.layer,
    z: KNIGHT_DOLL_LAYERS[base.layer],
    runtimeSrc: base.src,
    sources: [source],
  };
}

const defaultBaseLayers = KNIGHT_DOLL_BASES[KNIGHT_DOLL_DEFAULT_BODY].layers;
const roomLayer = defaultBaseLayers.find((base) => base.key === 'room');
if (!roomLayer) throw new Error('В KNIGHT_DOLL_BASES нет общей room.');
const baseTasks = [makeBaseTask(roomLayer, 'room', null)];
for (const bodyId of KNIGHT_DOLL_BODY_IDS) {
  for (const base of KNIGHT_DOLL_BASES[bodyId].layers) {
    if (base.key === 'room') {
      if (base.src !== roomLayer.src) throw new Error(`Room тела ${bodyId} отличается от общей.`);
      continue;
    }
    baseTasks.push(makeBaseTask(base, `${bodyId}_${base.key}`, bodyId));
  }
}

function stateForItem(item, slot, bodyId) {
  const settings = { knightBody: bodyId };
  if (slot === 'belt0' || slot === 'belt1') {
    const consumableBelt = [null, null];
    consumableBelt[Number(slot.slice(-1))] = item.id;
    return { consumableBelt, settings };
  }
  return { equipped: { [slot]: item.id }, settings };
}

function itemLayers(item, slot, bodyId) {
  return resolveKnightDoll(stateForItem(item, slot, bodyId))
    .filter((layer) => layer.itemId === item.id)
    .map((layer) => ({ src: layer.src, z: layer.z, part: layer.part }));
}

function secondSlotFor(item) {
  if (item.slot === 'ring') return 'ring2';
  if (item.slot === 'consumable') return 'belt1';
  return null;
}

function makeItemTask(item, bodyId) {
  const bodySpecific = hasKnightDollBodyVariant(item);
  const primarySlot = item.slot === 'ring' ? 'ring1' : item.slot === 'consumable' ? 'belt0' : item.slot;
  const primaryLayers = itemLayers(item, primarySlot, bodyId);
  const primaryMain = primaryLayers.find((layer) => layer.part === 'main');
  if (!primaryMain) throw new Error(`Resolver не вернул основной слой предмета: ${item.id}`);
  const variants = [{ slot: primarySlot, layers: primaryLayers }];
  let second = null;
  const secondSlot = secondSlotFor(item);
  if (secondSlot) {
    const secondLayers = itemLayers(item, secondSlot, bodyId);
    const secondMain = secondLayers.find((layer) => layer.part === 'main');
    const shift = KNIGHT_DOLL_SECOND_SLOT[secondSlot];
    if (!secondMain || !shift) throw new Error(`Не задан второй слот предмета: ${item.id}`);
    second = {
      from: primaryMain.src,
      src: secondMain.src,
      dx: shift.dx,
      dy: shift.dy,
    };
    variants.push({ slot: secondSlot, layers: secondLayers });
  }
  const hideBase = new Set(KNIGHT_DOLL_ITEM_RULES[item.id]?.hideBase || []);
  if (item.slot === 'gloves') hideBase.add('hands');
  return {
    id: bodySpecific ? `${bodyId}/${item.id}` : item.id,
    itemId: item.id,
    kind: 'item',
    bodyId,
    bodySpecific,
    wave: item.set || 'без сета',
    slot: item.slot,
    hideBase: [...hideBase],
    sources: primaryLayers.map(sourceFromRuntime),
    variants,
    second,
  };
}

const itemTasks = ITEMS.flatMap((item) => {
  const bodyIds = hasKnightDollBodyVariant(item)
    ? KNIGHT_DOLL_BODY_IDS
    : [KNIGHT_DOLL_DEFAULT_BODY];
  return bodyIds.map((bodyId) => makeItemTask(item, bodyId));
});

const tasks = [...baseTasks, ...itemTasks];
const taskById = new Map();
for (const task of tasks) {
  if (taskById.has(task.id)) throw new Error(`Повторный id в каталоге экспорта: ${task.id}`);
  taskById.set(task.id, task);
}

function tasksForCliId(id) {
  const direct = taskById.get(id);
  if (direct) return [direct];
  return itemTasks.filter((task) => task.bodySpecific && task.itemId === id);
}

const expectedRuntime = [...new Set([
  ...baseTasks.map((task) => task.runtimeSrc),
  ...itemTasks.flatMap((task) => task.variants.flatMap((variant) => variant.layers.map((layer) => layer.src))),
])].sort();

function updateManifest() {
  const existing = expectedRuntime.filter((src) => {
    try {
      return statSync(runtimePath(src)).isFile();
    } catch {
      return false;
    }
  });
  const entries = existing.map((src) => `  '${src}',`).join('\n');
  const content = `// Генерируется командой \`node tools/build-knight-art.mjs\` по реально существующим файлам.\n`
    + `export const KNIGHT_DOLL_ASSET_FILES = new Set([\n${entries}${entries ? '\n' : ''}]);\n\n`
    + `export function hasKnightDollAsset(src) {\n`
    + `  return KNIGHT_DOLL_ASSET_FILES.has(src);\n`
    + `}\n`;
  writeFileSync(MANIFEST_PATH, content, 'utf8');
  console.log(`Manifest обновлён: ${existing.length} из ${expectedRuntime.length} ожидаемых runtime-файлов.`);
}

function parseArgs(argv) {
  const options = { check: false, manifestOnly: false, help: false, ids: [] };
  for (const arg of argv) {
    if (arg === '--check') options.check = true;
    else if (arg === '--manifest-only') options.manifestOnly = true;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg.startsWith('-')) throw new Error(`Неизвестный флаг: ${arg}`);
    else options.ids.push(arg);
  }
  options.ids = [...new Set(options.ids)];
  return options;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(HELP);
    return;
  }
  if (options.check && options.manifestOnly) {
    throw new Error('--check и --manifest-only нельзя использовать вместе.');
  }
  const unknown = options.ids.filter((id) => tasksForCliId(id).length === 0);
  if (unknown.length) throw new Error(`Неизвестные id: ${unknown.join(', ')}`);

  if (options.manifestOnly) {
    if (options.ids.length) console.log('В режиме --manifest-only выбор id игнорируется: сканируются все ожидаемые файлы.');
    updateManifest();
    return;
  }

  const selectedIds = options.ids.length
    ? [...new Set(options.ids.flatMap((id) => tasksForCliId(id).map((task) => task.id)))]
    : tasks.map((task) => task.id);
  const result = spawnSync('python', ['tools/build_knight_art.py'], {
    cwd: GAME_ROOT,
    input: JSON.stringify({
      check: options.check,
      target: KNIGHT_DOLL_SIZE,
      tasks,
      selectedIds,
      contactPrefix: options.ids.length ? 'knight-contact-patch' : 'knight-contact',
    }),
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error) console.error(`Не удалось запустить Python + Pillow: ${result.error.message}`);
  const status = result.status ?? 1;
  if (status !== 0) {
    if (!options.check) console.error('Manifest не перезаписывался: обработка завершилась с ошибкой.');
    process.exitCode = status;
    return;
  }
  if (!options.check) updateManifest();
}

try {
  main();
} catch (error) {
  console.error(`${error.message}\nСправка: node tools/build-knight-art.mjs --help`);
  process.exitCode = 1;
}
