// Тесты механики «Гости за чайным столом».
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SEATING_PUZZLES, SEATING_ROOMS } from '../src/data/puzzlesSeating.js';
import { SEATING_GUESTS, TRAIT_LABEL, TRAIT_TEXT } from '../src/data/seatingGuests.js';
import { GUEST_BY_ID } from '../src/data/guests.js';
import { STORY_GUESTS } from '../src/data/story.js';
import {
  createSeatingPuzzle, seatGuest, moveGuest, removeGuest, undoSeating, resetSeating,
  seatingViolations, isSeatingSolved, solveSeating, seatingHint, validateSeatingLevel,
  SEATING_RULE_TYPES,
} from '../src/core/seatingPuzzle.js';

const byId = (id) => SEATING_PUZZLES.find((l) => l.id === id);
const mk = (level, rooms = SEATING_ROOMS) => createSeatingPuzzle(level, rooms);
const LATIN = /[a-z]/i;

// Мини-комната для точных семантических проверок: кольцо из 4 + столик на 2
const TEST_ROOMS = {
  mini: {
    id: 'mini', name: 'пробная', image: 'x',
    seats: [
      { id: 'a', x: 10, y: 10, label: 'место а', features: ['window'] },
      { id: 'b', x: 20, y: 10, label: 'место б', features: [] },
      { id: 'c', x: 30, y: 10, label: 'место в', features: ['hearth'] },
      { id: 'd', x: 40, y: 10, label: 'место г', features: [] },
      { id: 'e', x: 60, y: 10, label: 'место д', features: ['quiet'] },
      { id: 'f', x: 70, y: 10, label: 'место е', features: [] },
    ],
    tables: [['a', 'b', 'c', 'd'], ['e', 'f']],
  },
};
const miniLevel = (over) => ({
  id: 'seat_test', world: 'seating', mechanic: 'seating', name: 'Проба', difficulty: 1,
  room: 'mini', guests: ['owl', 'cat', 'smith', 'piper'], fixed: {}, rules: [],
  traits: { owl: ['books'], cat: ['hearth'], smith: ['craft'], piper: ['music'] },
  guestNames: { owl: 'Сова', cat: 'Кот', smith: 'Кузнец', piper: 'Музыкант' },
  rewards: [{ type: 'coins', amount: 100 }], intro: 'Пробная рассадка.',
  ...over,
});

test('каталог: 100 уровней seat_01–seat_100, сложность не убывает, комнаты по главам', () => {
  assert.equal(SEATING_PUZZLES.length, 100);
  SEATING_PUZZLES.forEach((l, i) => {
    assert.equal(l.id, `seat_${String(i + 1).padStart(2, '0')}`);
    assert.equal(l.world, 'seating');
    assert.equal(l.mechanic, 'seating');
    assert.equal(l.room, `ch${String(Math.floor(i / 10) + 1).padStart(2, '0')}`);
    if (i > 0) assert.ok(l.difficulty >= SEATING_PUZZLES[i - 1].difficulty, 'сложность не убывает');
  });
  assert.deepEqual(Object.keys(SEATING_ROOMS), Array.from({ length: 10 }, (_, i) => `ch${String(i + 1).padStart(2, '0')}`));
});

test('все 100 уровней валидны: структура, ссылки, ровно одно решение', () => {
  for (const level of SEATING_PUZZLES) {
    const v = validateSeatingLevel(level, SEATING_ROOMS, SEATING_GUESTS);
    assert.ok(v.ok, `${level.id} (${level.name}): ${v.problems.join('; ')}`);
  }
});

test('решатель: единственное решение и малая глубина перебора у всех уровней', () => {
  let maxNodes = 0;
  for (const level of SEATING_PUZZLES) {
    const r = solveSeating(level, SEATING_ROOMS, 2);
    assert.equal(r.count, 1, `${level.id}: решений ${r.count}`);
    assert.ok(!r.truncated, `${level.id}: решатель упёрся в лимит`);
    maxNodes = Math.max(maxNodes, r.searchNodes);
  }
  assert.ok(maxNodes < 100_000, `слепой перебор: ${maxNodes} узлов`);
});

test('имена и интро уникальны, все пользовательские строки по-русски', () => {
  const names = new Set(SEATING_PUZZLES.map((l) => l.name));
  const intros = new Set(SEATING_PUZZLES.map((l) => l.intro));
  assert.equal(names.size, 100, 'имена повторяются');
  assert.equal(intros.size, 100, 'интро повторяются');
  for (const l of SEATING_PUZZLES) {
    assert.ok(!LATIN.test(l.name), `${l.id}: имя латиницей`);
    assert.ok(!LATIN.test(l.intro), `${l.id}: интро латиницей`);
    for (const r of l.rules) assert.ok(!LATIN.test(r.text), `${l.id}: правило латиницей: ${r.text}`);
    for (const n of Object.values(l.guestNames)) assert.ok(!LATIN.test(n), `${l.id}: имя гостя латиницей`);
  }
  for (const room of Object.values(SEATING_ROOMS)) {
    assert.ok(!LATIN.test(room.name), `${room.id}: имя комнаты латиницей`);
    for (const s of room.seats) assert.ok(!LATIN.test(s.label), `${room.id}: подпись места латиницей`);
  }
  for (const [id, d] of Object.entries(SEATING_GUESTS)) {
    assert.ok(!LATIN.test(d.line), `${id}: реплика латиницей`);
    for (const f of [d.inst, d.with, d.of]) assert.ok(!LATIN.test(f), `${id}: падеж латиницей`);
  }
  for (const [k, label] of Object.entries(TRAIT_LABEL)) {
    assert.ok(!LATIN.test(label), `черта ${k} латиницей`);
    assert.ok(TRAIT_TEXT[k]?.with && TRAIT_TEXT[k]?.of, `черта ${k} без падежей`);
  }
});

test('гости: только 35 из STORY_GUESTS, без keeper/spirit, все хотя бы раз за столом', () => {
  const storySet = new Set(STORY_GUESTS);
  assert.equal(Object.keys(SEATING_GUESTS).length, 35);
  for (const id of Object.keys(SEATING_GUESTS)) {
    assert.ok(storySet.has(id), `${id} не из STORY_GUESTS`);
    assert.ok(GUEST_BY_ID[id], `${id} без портрета в GUEST_BY_ID`);
    const t = SEATING_GUESTS[id].traits;
    assert.ok(t.length >= 2 && t.length <= 4, `${id}: черт ${t.length}`);
    for (const key of t) assert.ok(TRAIT_LABEL[key], `${id}: неизвестная черта ${key}`);
  }
  assert.ok(!SEATING_GUESTS.keeper && !SEATING_GUESTS.spirit);
  const seen = new Set(SEATING_PUZZLES.flatMap((l) => l.guests));
  for (const id of STORY_GUESTS) assert.ok(seen.has(id), `${id} ни разу не сел за стол`);
  for (const l of SEATING_PUZZLES) {
    for (const g of l.guests) assert.ok(storySet.has(g), `${l.id}: чужой гость ${g}`);
    // Черты в данных уровня синхронны со слоем гостей
    for (const g of l.guests) assert.deepEqual(l.traits[g], SEATING_GUESTS[g].traits, `${l.id}: черты ${g}`);
  }
});

test('дебюты механик по главам и полное покрытие типов правил', () => {
  const num = (l) => Number(l.id.slice(5));
  const has = (l, types) => l.rules.some((r) => types.includes(r.type));
  const DEBUT = [
    [11, ['feature', 'notFeature']],
    [21, ['opposite', 'between']],
    [31, ['emptyNear']],
    [41, ['traitNear', 'notTraitNear']],
    [51, ['sameTable', 'differentTable']],
    [61, ['runWith']],
  ];
  for (const [first, types] of DEBUT) {
    for (const l of SEATING_PUZZLES) {
      if (num(l) < first) {
        assert.ok(!has(l, types), `${l.id}: ${types} раньше seat_${first}`);
      }
    }
    // В главе дебюта каждый уровень содержит хотя бы одно правило дебюта
    for (const l of SEATING_PUZZLES.filter((x) => num(x) >= first && num(x) < first + 10)) {
      assert.ok(has(l, types), `${l.id}: нет дебютной механики ${types}`);
    }
  }
  // Закреплённые гости — со второй главы
  for (const l of SEATING_PUZZLES) {
    if (num(l) <= 10) assert.equal(Object.keys(l.fixed).length, 0, `${l.id}: fixed в первой главе`);
  }
  assert.ok(SEATING_PUZZLES.some((l) => Object.keys(l.fixed).length > 0), 'fixed нигде не встречается');
  // Все типы правил встречаются
  const used = new Set(SEATING_PUZZLES.flatMap((l) => l.rules.map((r) => r.type)));
  for (const t of SEATING_RULE_TYPES) assert.ok(used.has(t), `тип ${t} нигде не встречается`);
});

test('цветные подушечки различают два стула у окна без прямой инструкции', () => {
  const seats = Object.fromEntries(SEATING_ROOMS.ch01.seats.map((s) => [s.id, s]));
  assert.deepEqual(seats.quiet.features, ['quiet', 'window', 'blueSeat']);
  assert.deepEqual(seats.hearth.features, ['hearth', 'redSeat']);
  assert.deepEqual(seats.door.features, ['door', 'greenSeat']);
  assert.deepEqual(seats.window.features, ['window', 'violetSeat']);
  const windowSeats = SEATING_ROOMS.ch01.seats.filter((s) => s.features.includes('window'));
  assert.deepEqual(windowSeats.map((s) => s.id), ['quiet', 'window'], 'оба левых стула у окна');

  const level = byId('seat_01');
  const texts = level.rules.map((r) => r.text);
  assert.ok(texts.includes('Лесничий любит фиалки'), 'предпочтение должно быть предметным');
  assert.ok(texts.some((t) => t.includes('паучьей почты')), 'у двери должна быть паучья причина');
  for (const banned of ['нужен стул', 'ищет стул', 'выбирает подушечку', 'просит стул', 'место у окна']) {
    assert.ok(!texts.some((t) => t.includes(banned)), `прямая подсказка: ${banned}`);
  }
  // Цвет остаётся крайним признаком seat-правил и не лезет в feature-пул;
  // ассоциации — однозначные и уютные, без белого/тёмного винограда и крови.
  const allTexts = SEATING_PUZZLES.flatMap((l) => l.rules.map((r) => r.text));
  assert.ok(!allTexts.some((t) => t.includes('виноград')), 'виноград неоднозначен по цвету');
  assert.ok(!allTexts.some((t) => t.includes('кровь')), 'неуютная ассоциация');
  assert.ok(allTexts.some((t) => t.includes('подушкой') || t.includes('нагадала') || t.includes('везло в картах')),
    'нужна хотя бы одна тематическая цветная шутка');
  for (const l of SEATING_PUZZLES) {
    for (const r of l.rules) {
      if (['feature', 'notFeature'].includes(r.type)) assert.ok(!String(r.feature).endsWith('Seat'), `${l.id}: цвет в feature`);
    }
  }
  const solution = solveSeating(level, SEATING_ROOMS, 2);
  assert.equal(solution.count, 1);
  assert.equal(solution.placement.forester, 'window');
});

test('повторяющиеся наборы гостей дают новую раскладку правил', () => {
  const sigs = new Set();
  for (const l of SEATING_PUZZLES) {
    const sig = JSON.stringify([
      [...l.guests].sort(),
      l.rules.map((r) => [r.type, r.guest, r.seat, r.feature, r.other, r.others, r.trait].join(':')).sort(),
      Object.entries(l.fixed).sort(),
    ]);
    assert.ok(!sigs.has(sig), `${l.id}: дубль набора гостей и правил`);
    sigs.add(sig);
  }
});

test('посадка, занятое место, обмен, подъём, отмена и сброс', () => {
  const level = byId('seat_01');
  const s = mk(level);
  const [g1, g2] = level.guests.filter((g) => !level.fixed[g]);
  const seats = SEATING_ROOMS[level.room].seats.map((x) => x.id);
  assert.ok(seatGuest(s, g1, seats[0]).ok);
  assert.equal(seatGuest(s, g2, seats[0]).ok, false, 'место занято');
  assert.equal(seatGuest(s, g2, 'нет_такого').ok, false);
  // Обмен через moveGuest
  assert.ok(seatGuest(s, g2, seats[1]).ok);
  const mv = moveGuest(s, g1, seats[1]);
  assert.ok(mv.ok && mv.swapped === g2, 'обмен местами');
  assert.equal(s.placement[g1], seats[1]);
  assert.equal(s.placement[g2], seats[0]);
  // Отмена обмена
  undoSeating(s);
  assert.equal(s.placement[g1], seats[0]);
  assert.equal(s.placement[g2], seats[1]);
  // Подъём и отмена подъёма
  assert.ok(removeGuest(s, g1));
  assert.equal(s.placement[g1], null);
  undoSeating(s);
  assert.equal(s.placement[g1], seats[0]);
  // На то же место — noop
  assert.ok(moveGuest(s, g1, seats[0]).noop);
  // Сброс очищает всё, кроме fixed
  resetSeating(s);
  assert.deepEqual(s.placement, { ...level.fixed });
});

test('закреплённого гостя нельзя двигать, а сброс его сохраняет', () => {
  const level = SEATING_PUZZLES.find((l) => Object.keys(l.fixed).length > 0);
  const s = mk(level);
  const [fg, fs] = Object.entries(level.fixed)[0];
  assert.equal(s.placement[fg], fs, 'закреплённый сидит с самого начала');
  assert.equal(moveGuest(s, fg, SEATING_ROOMS[level.room].seats[0].id).ok, false);
  assert.equal(removeGuest(s, fg), false);
  // На закреплённое место другого не посадить, даже обменом
  const other = level.guests.find((g) => g !== fg);
  assert.equal(moveGuest(s, other, fs).ok, false, 'обмен с закреплённым запрещён');
  const free = SEATING_ROOMS[level.room].seats.find((x) => x.id !== fs).id;
  seatGuest(s, other, free);
  resetSeating(s);
  assert.equal(s.placement[fg], fs, 'сброс сохраняет закреплённого');
  assert.equal(s.placement[other], undefined, 'остальные на подносе');
});

test('нарушения видны по-русски, верная рассадка решает уровень', () => {
  const level = SEATING_PUZZLES.find((l) => l.rules.some((r) => r.type === 'near'));
  const s = mk(level);
  // Рассадим всех по решению — нарушений нет
  const sol = solveSeating(level, SEATING_ROOMS).placement;
  for (const [g, seat] of Object.entries(sol)) seatGuest(s, g, seat);
  assert.equal(seatingViolations(s).length, 0);
  assert.ok(isSeatingSolved(s));
  // Пересадим двух незакреплённых наоборот — может появиться нарушение
  const free = level.guests.filter((g) => !level.fixed[g]);
  resetSeating(s);
  const shifted = { ...sol };
  const [a, b] = free;
  [shifted[a], shifted[b]] = [shifted[b], shifted[a]];
  for (const [g, seat] of Object.entries(shifted)) {
    if (!level.fixed[g]) seatGuest(s, g, seat);
  }
  const v = seatingViolations(s);
  if (v.length > 0) {
    assert.ok(!isSeatingSolved(s));
    for (const x of v) assert.ok(!LATIN.test(x.text), `нарушение латиницей: ${x.text}`);
  }
});

test('семантика правил: near/opposite/between/emptyNear/trait на мини-комнате', () => {
  // Кольцо a-b-c-d: напротив a-c, b-d
  const level = miniLevel({
    rules: [
      { type: 'opposite', guest: 'owl', other: 'smith', text: 'Сова напротив Кузнеца' },
      { type: 'between', guest: 'cat', others: ['owl', 'piper'], text: 'Кот между Совой и Музыкантом' },
    ],
  });
  const s = mk(level, TEST_ROOMS);
  seatGuest(s, 'owl', 'a');
  seatGuest(s, 'cat', 'b');
  seatGuest(s, 'smith', 'd'); // напротив a — это c, не d
  let v = seatingViolations(s);
  assert.ok(v.some((x) => x.rule.type === 'opposite'), 'opposite нарушен');
  moveGuest(s, 'smith', 'c');
  v = seatingViolations(s);
  assert.ok(!v.some((x) => x.rule.type === 'opposite'), 'opposite выполнен');
  // cat@b: соседи a,c = owl, smith; нужны owl и piper → нарушение
  assert.ok(v.some((x) => x.rule.type === 'between'));
});

test('семантика: emptyNear, traitNear/notTraitNear, sameTable/differentTable', () => {
  const level = miniLevel({
    guests: ['owl', 'cat', 'smith'],
    traits: { owl: ['books'], cat: ['hearth'], smith: ['craft'] },
    guestNames: { owl: 'Сова', cat: 'Кот', smith: 'Кузнец' },
    rules: [
      { type: 'emptyNear', guest: 'owl', text: 'Сове нужен пустой стул рядом' },
      { type: 'notTraitNear', guest: 'owl', trait: 'craft', text: 'Сова не рядом с мастером' },
      { type: 'differentTable', guest: 'cat', other: 'owl', text: 'Кот за другим столом' },
    ],
  });
  const s = mk(level, TEST_ROOMS);
  // Сова за малым столом e-f: рядом f; кот рядом с совой за малым столом
  seatGuest(s, 'owl', 'e');
  seatGuest(s, 'cat', 'f');
  let v = seatingViolations(s);
  assert.ok(v.some((x) => x.rule.type === 'emptyNear'), 'emptyNear нарушен (f занят)');
  assert.ok(v.some((x) => x.rule.type === 'differentTable'), 'differentTable нарушен');
  moveGuest(s, 'cat', 'b'); // кот за большой стол, рядом с b никого
  moveGuest(s, 'smith', 'c');
  v = seatingViolations(s);
  assert.ok(!v.some((x) => x.rule.type === 'emptyNear'), 'emptyNear выполнен (f пуст)');
  assert.ok(!v.some((x) => x.rule.type === 'differentTable'), 'differentTable выполнен');
  // Посадим кузнеца (craft) рядом с совой? Сова за e — сосед только f
  moveGuest(s, 'smith', 'f');
  v = seatingViolations(s);
  assert.ok(v.some((x) => x.rule.type === 'notTraitNear'), 'notTraitNear нарушен');
});

test('семантика runWith: трое занимают три подряд места одного стола', () => {
  const level = miniLevel({
    guests: ['owl', 'cat', 'smith', 'piper'],
    rules: [{ type: 'runWith', guest: 'owl', others: ['cat', 'smith'], text: 'Трое подряд' }],
  });
  const s = mk(level, TEST_ROOMS);
  seatGuest(s, 'owl', 'a');
  seatGuest(s, 'cat', 'b');
  seatGuest(s, 'smith', 'e'); // за другим столом — не подряд
  seatGuest(s, 'piper', 'f');
  assert.ok(seatingViolations(s).some((x) => x.rule.type === 'runWith'));
  moveGuest(s, 'smith', 'c'); // a,b,c — подряд
  assert.equal(seatingViolations(s).length, 0);
  assert.ok(isSeatingSolved(s));
  // Кольцо из четырёх: любые три места идут подряд (через край)
  moveGuest(s, 'smith', 'd'); // a,b,d = d,a,b через край кольца
  assert.equal(seatingViolations(s).length, 0);
});

test('подсказки решают каждый уровень: цепочка place/move/remove/already', () => {
  for (const level of SEATING_PUZZLES) {
    const s = mk(level);
    let guard = level.guests.length * 3 + 10;
    const seenTypes = new Set();
    while (!isSeatingSolved(s) && guard-- > 0) {
      const h = seatingHint(s);
      seenTypes.add(h.type);
      if (h.type === 'already') break;
      if (h.type === 'place') {
        const r = seatGuest(s, h.guest, h.seat);
        assert.ok(r.ok, `${level.id}: подсказка place нелегальна`);
      } else if (h.type === 'move') {
        const r = moveGuest(s, h.guest, h.seat);
        assert.ok(r.ok, `${level.id}: подсказка move нелегальна`);
      } else if (h.type === 'remove') {
        assert.ok(removeGuest(s, h.guest), `${level.id}: подсказка remove нелегальна`);
      } else {
        assert.fail(`${level.id}: подсказка ${h.type}`);
      }
    }
    assert.ok(isSeatingSolved(s), `${level.id} должен решаться по подсказкам`);
    assert.equal(seatingHint(s).type, 'already', `${level.id}: после решения — already`);
  }
});

test('подсказка remove: освободить место, нужное другому гостю', () => {
  const level = SEATING_PUZZLES.find((l) => Object.keys(l.fixed).length === 0);
  const s = mk(level);
  const sol = solveSeating(level, SEATING_ROOMS).placement;
  const [y, x] = level.guests; // y раньше в порядке карточек
  // x садится на место, которое в решении принадлежит y
  assert.ok(seatGuest(s, x, sol[y]).ok);
  const h = seatingHint(s);
  assert.equal(h.type, 'remove');
  assert.equal(h.guest, x);
  assert.ok(!LATIN.test(h.text));
  // Цепочка продолжается после снятия
  assert.ok(removeGuest(s, h.guest));
  const h2 = seatingHint(s);
  assert.equal(h2.type, 'place');
  assert.equal(h2.guest, y);
  assert.equal(h2.seat, sol[y]);
});

test('подсказка move ведёт к месту из решения, place — на свободное место', () => {
  const level = byId('seat_01');
  const s = mk(level);
  const sol = solveSeating(level, SEATING_ROOMS).placement;
  const h = seatingHint(s);
  assert.equal(h.type, 'place');
  assert.equal(sol[h.guest], h.seat);
  assert.ok(!LATIN.test(h.text));
  // Посадим гостя не на его место — подсказка move
  const g = h.guest;
  const wrong = SEATING_ROOMS[level.room].seats.map((x) => x.id).find((id) => id !== sol[g]);
  seatGuest(s, g, wrong);
  const h2 = seatingHint(s);
  assert.equal(h2.type, 'move');
  assert.equal(h2.guest, g);
  assert.equal(h2.seat, sol[g]);
});

test('валидатор отлавливает битые уровни', () => {
  const good = byId('seat_01');
  const broken = (patch) => validateSeatingLevel({ ...good, ...patch }, SEATING_ROOMS, SEATING_GUESTS);
  assert.ok(!broken({ guests: ['owl', 'нет_такого'] }).ok, 'неизвестный гость');
  assert.ok(!broken({ name: 'Tea time' }).ok, 'латинское имя');
  assert.ok(!broken({ rules: [{ type: 'near', guest: good.guests[0], other: 'дух', text: 'рядом' }] }).ok);
  assert.ok(!broken({ rules: [{ type: 'oops', guest: good.guests[0], text: 'что-то' }] }).ok, 'неизвестный тип');
  assert.ok(!broken({ rules: [] }).ok, 'без правил не сойтись');
  assert.ok(!broken({ guests: [] }).ok, 'без гостей');
});
