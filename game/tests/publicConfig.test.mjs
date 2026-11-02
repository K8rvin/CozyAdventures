import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseEnv, publicConfigSource } from '../tools/build-public-config.mjs';

test('публичный конфиг содержит только адреса и никаких auth-настроек', () => {
  const source = publicConfigSource({
    COZY_API_BASE_URL: 'https://api.example.test/',
    UNUSED_CLIENT_ID: 'must-not-leak',
    DATABASE_URL: 'postgres://secret-password@db/private',
    PAYMENT_WEBHOOK_SECRET: 'never-in-browser',
  });
  assert.match(source, /KNIGHT_IMAGE_API_URL = "https:\/\/api\.example\.test\/api\/knight-image"/);
  assert.match(source, /COZY_API_BASE_URL = "https:\/\/api\.example\.test"/);
  assert.doesNotMatch(source, /secret-password|never-in-browser|must-not-leak|GOOGLE|DATABASE_URL|PAYMENT_WEBHOOK_SECRET/);
});

test('парсер env принимает пустые значения и не исполняет содержимое', () => {
  const env = parseEnv('COZY_API_BASE_URL=https://example.test\n# comment\n');
  assert.equal(env.COZY_API_BASE_URL, 'https://example.test');
  assert.equal(publicConfigSource(env).includes('undefined'), false);
});
