import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createKnightServer } from '../tools/knight-server.mjs';
import { newGame } from '../src/core/state.js';

test('backend валидирует комплект, создаёт WebP и использует постоянный кэш', async (t) => {
  const cacheDir = await mkdtemp(join(tmpdir(), 'knight-cache-'));
  let server;
  t.after(async () => {
    if (server) {
      server.closeAllConnections();
      await new Promise((resolve) => server.close(resolve));
    }
    await rm(cacheDir, { recursive: true, force: true });
  });
  server = await createKnightServer({ cacheDir, testMode: true, allowedOrigins: ['https://k8rvin.github.io'] });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (state, origin) => fetch(`${base}/api/knight-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(origin ? { Origin: origin } : {}) },
    body: JSON.stringify(state),
  }).then(async (response) => ({ status: response.status, body: await response.json(), cors: response.headers.get('access-control-allow-origin') }));

  const health = await (await fetch(`${base}/health`)).json();
  assert.equal(health.configured, true);
  assert.equal(health.model, 'gemini-nano-banana-2.1');

  const first = await post(newGame(), 'https://k8rvin.github.io');
  assert.equal(first.status, 200);
  assert.equal(first.body.cached, false);
  assert.equal(first.cors, 'https://k8rvin.github.io');
  assert.match(first.body.key, /^[a-f0-9]{64}$/);
  const imagePath = join(cacheDir, `${first.body.key}.webp`);
  const metadataPath = join(cacheDir, `${first.body.key}.json`);
  assert.ok(existsSync(imagePath));
  assert.ok(existsSync(metadataPath));
  const image = await readFile(imagePath);
  assert.equal(image.toString('ascii', 0, 4), 'RIFF');
  assert.equal(image.toString('ascii', 8, 12), 'WEBP');
  const metadata = JSON.parse(await readFile(metadataPath, 'utf8'));
  assert.deepEqual([metadata.width, metadata.height], [768, 960]);
  assert.equal(metadata.format, 'webp');
  assert.equal(metadata.state.bodyId, 'male');
  assert.equal(metadata.promptVersion, 5);
  const cachedImage = await fetch(first.body.url);
  assert.equal(cachedImage.status, 200);
  assert.equal(cachedImage.headers.get('content-type'), 'image/webp');

  const repeated = await post(newGame());
  assert.equal(repeated.body.cached, true);
  assert.equal(repeated.body.key, first.body.key);
  const afterRepeat = await (await fetch(`${base}/health`)).json();
  assert.equal(afterRepeat.generations, 1);

  const changed = newGame();
  changed.equipped.armor = 'arm_padded';
  const [left, right] = await Promise.all([post(changed), post(changed)]);
  assert.equal(left.body.key, right.body.key);
  const afterShared = await (await fetch(`${base}/health`)).json();
  assert.equal(afterShared.generations, 2);

  const invalid = newGame();
  invalid.equipped.weapon = 'unknown_item';
  const rejected = await post(invalid);
  assert.equal(rejected.status, 400);
  const afterRejected = await (await fetch(`${base}/health`)).json();
  assert.equal(afterRejected.generations, 2);

  await new Promise((resolve) => server.close(resolve));
  server = await createKnightServer({ cacheDir, testMode: true });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const restartedBase = `http://127.0.0.1:${server.address().port}`;
  const afterRestart = await fetch(`${restartedBase}/api/knight-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newGame()),
  }).then((response) => response.json());
  assert.equal(afterRestart.cached, true);
  assert.equal(afterRestart.key, first.body.key);
  const finalHealth = await (await fetch(`${restartedBase}/health`)).json();
  assert.equal(finalHealth.generations, 0);
});
