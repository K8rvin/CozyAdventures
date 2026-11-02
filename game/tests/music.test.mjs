import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  MUSIC_PRESETS, musicPreset, setMusicPreset, toggleMusic, musicEnabled,
} from '../src/ui/sound.js';

function storage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}

test('дождь бесплатен, три дополнительных пресета принадлежат изданию', () => {
  globalThis.localStorage = storage();
  assert.deepEqual(MUSIC_PRESETS.map((preset) => [preset.id, !!preset.supporter]), [
    ['rain', false], ['hearth', true], ['night_market', true], ['lute', true],
  ]);
  assert.equal(musicPreset(), 'rain');
  assert.equal(setMusicPreset('hearth').ok, false);
  assert.equal(musicPreset(), 'rain', 'запрещённый выбор не записывается');
  assert.equal(setMusicPreset('hearth', { supporter: true }).ok, true);
  assert.equal(musicPreset(), 'rain', 'без supporter сохранённый платный пресет откатывается к дождю');
  assert.equal(musicPreset({ supporter: true }), 'hearth');
  assert.equal(setMusicPreset('unknown', { supporter: true }).ok, false);
});

test('переключатель музыки сохраняется без Web Audio', () => {
  globalThis.localStorage = storage();
  assert.equal(musicEnabled(), true);
  assert.equal(toggleMusic(), false);
  assert.equal(musicEnabled(), false);
  assert.equal(toggleMusic({ supporter: true }), true);
  assert.equal(musicEnabled(), true);
});
