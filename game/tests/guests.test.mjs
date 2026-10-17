import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { GUESTS, GUEST_BY_ID, guestKnown } from '../src/data/guests.js';
import { FATE_PUZZLES } from '../src/data/puzzlesFate.js';
import { GUESTS as BREW_GUESTS } from '../src/data/brewGuests.js';

test('гостевая книга объединяет всех гостей карт и заказчиков варки', () => {
  assert.ok(GUESTS.length >= 36, 'в книге представлен весь основной состав гостей');
  assert.equal(new Set(GUESTS.map((guest) => guest.id)).size, GUESTS.length, 'id гостей уникальны');

  for (const level of FATE_PUZZLES) {
    assert.ok(
      GUESTS.some((guest) => guest.fateLevels.includes(level.id)),
      `${level.id}: гость не попал в книгу`,
    );
  }
  for (const [brewId, source] of Object.entries(BREW_GUESTS)) {
    assert.ok(
      GUESTS.some((guest) => (source.art && guest.art === source.art) || guest.name === source.name),
      `${brewId}: заказчик варки не попал в книгу`,
    );
  }
});

test('у каждого гостя есть портрет или эмодзи, русское описание и темы разговора', () => {
  for (const guest of GUESTS) {
    assert.equal(GUEST_BY_ID[guest.id], guest);
    assert.ok(guest.name && guest.icon, `${guest.id}: нет имени или эмодзи`);
    assert.ok(guest.description && guest.greeting, `${guest.id}: пустое описание или приветствие`);
    assert.ok(guest.topics.length >= 2, `${guest.id}: нужно хотя бы две темы`);
    const phrases = [guest.description, guest.greeting];
    for (const topic of guest.topics) {
      assert.ok(topic.ask && topic.answer, `${guest.id}: пустая реплика`);
      phrases.push(topic.ask, topic.answer);
    }
    for (const phrase of phrases) {
      assert.ok(!/[a-zA-Z]/.test(phrase), `${guest.id}: латиница в тексте «${phrase}»`);
    }
    if (guest.art) {
      const path = fileURLToPath(new URL(`../${guest.art}`, import.meta.url));
      assert.ok(existsSync(path), `${guest.id}: не найден портрет ${guest.art}`);
    }
  }
});

test('знакомство определяется по любой пройденной истории или варке гостя', () => {
  const state = { puzzlesDone: {} };
  const cat = GUEST_BY_ID.cat;
  assert.equal(guestKnown(state, cat), false);
  state.puzzlesDone[cat.fateLevels[0]] = { moves: 1 };
  assert.equal(guestKnown(state, cat), true);

  const fairyState = { puzzlesDone: {} };
  const fairy = GUEST_BY_ID.fairy;
  assert.equal(guestKnown(fairyState, fairy), false);
  fairyState.puzzlesDone[fairy.brewLevels[0]] = { moves: 1 };
  assert.equal(guestKnown(fairyState, fairy), true);
});

test('полка гостей использует координаты карточек относительно самой ленты', () => {
  const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
  const track = css.match(/\.guest-shelf-track\s*\{[^}]*\}/)?.[0] || '';
  assert.match(
    track,
    /position:\s*relative/,
    'без position:relative offsetLeft карточки считается от внешнего блока и ломает правый стык',
  );
});
