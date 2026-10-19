// Головоломка «Гости за чайным столом»: 100 уровней seat_01–seat_100,
// 10 глав по 10. Гости — знакомые из STORY_GUESTS (портреты уже есть),
// характеры и падежи — data/seatingGuests.js, комнаты — данные ниже
// (координаты мест в процентах под арты assets/seating/seat_chXX_web.jpg).
//
// Уровни не пишутся руками по одному: их строит детерминированный генератор
// на seeded-ГСЧ при загрузке модуля. Генератор для каждого уровня:
//   1) берёт состав гостей из труппы главы (труппы пересекаются, лица
//      вводятся постепенно и повторяются, как в «Картах судьбы»);
//   2) бросает случайную рассадку-решение;
//   3) добавляет пожелания, истинные в этом решении, пока решатель
//      (core/seatingPuzzle.js) не подтвердит, что решение ровно одно;
//   4) добивает недостающие желания, чтобы у каждого гостя было хотя бы одно.
// Проверку всего пакета (валидность, единственность, дебюты механик,
// уникальность имён и интро) выполняет tests/seating.test.mjs.

import { makeRng } from '../core/rng.js';
import { GUEST_BY_ID } from './guests.js';
import { STORY_GUESTS } from './story.js';
import { SEATING_GUESTS, TRAIT_TEXT } from './seatingGuests.js';
import { solveSeating, seatingModel } from '../core/seatingPuzzle.js';

// Русские подписи особенностей мест (для текстов пожеланий)
export const SEAT_FEATURE_TEXT = {
  window: 'у окна',
  hearth: 'у огня',
  samovar: 'у самовара',
  door: 'у двери',
  quiet: 'в тихом уголке',
  blueSeat: 'с синей подушечкой',
  redSeat: 'с красной подушечкой',
  greenSeat: 'с зелёной подушечкой',
  yellowSeat: 'с жёлтой подушечкой',
  violetSeat: 'с фиолетовой подушечкой',
};

// Цветные подушечки — крайний визуальный признак для мест, которые делят
// пространственное свойство (например, оба стоят у окна). В пожеланиях цвет
// называется через короткое суеверие, шутку или припрятанную вещь.
export const SEAT_COLOR_FEATURE = {
  blueSeat: 'синий',
  redSeat: 'красный',
  greenSeat: 'зелёный',
  yellowSeat: 'жёлтый',
  violetSeat: 'фиолетовый',
};

// Гендерно-нейтральные мини-шутки. Цвет называем прямо, иначе подсказка
// рассыпается (виноград, например, бывает и белым, и тёмным — не используем).
const COLOR_JOKES = {
  blueSeat: [
    'ищет голубику под синей подушкой',
    'считает синий своим цветом',
    'гадалка нагадала: синий — к спокойствию',
    'в прошлый раз на синем стуле тоже везло в картах',
  ],
  redSeat: [
    'ищет клубнику под красной подушкой',
    'считает красный своим счастливым цветом',
    'гадалка нагадала: красный — к славе',
    'в прошлый раз на красном стуле тоже везло в картах',
  ],
  greenSeat: [
    'ищет лягушку под зелёной подушкой',
    'считает зелёный своим цветом',
    'гадалка нагадала: зелёный — к доброму урожаю',
    'в прошлый раз на зелёном стуле тоже везло в картах',
  ],
  yellowSeat: [
    'ищет лимон под жёлтой подушкой',
    'считает жёлтый своим цветом',
    'гадалка нагадала: жёлтый — к богатству',
    'в прошлый раз на жёлтом стуле тоже везло в картах',
  ],
  violetSeat: [
    'держит пару тузов под фиолетовой подушкой',
    'считает фиолетовый своим цветом',
    'гадалка нагадала: фиолетовый — к удаче',
    'в прошлый раз на фиолетовом стуле тоже везло в картах',
  ],
};

// Персональные шутки: у животных — то, что они действительно едят, у людей —
// суеверия и характерные мелочи. Приоритет выше общего списка.
const GUEST_COLOR_JOKES = {
  forester: { violetSeat: ['любит фиалки'] },
  spider: { greenSeat: ['припрятал муху под зелёной подушкой'] },
  owl: { blueSeat: ['припрятала мышку под синей подушкой'] },
  cat: { redSeat: ['припрятал рыбку под красной подушкой'] },
  beekeeper: { yellowSeat: ['припрятал банку мёда под жёлтой подушкой'] },
  mushroomer: { greenSeat: ['припрятал гриб под зелёной подушкой'] },
  gardener: { greenSeat: ['спрятал семена под зелёной подушкой'] },
  daughter: { yellowSeat: ['спрятала подсолнух под жёлтой подушкой'], violetSeat: ['спрятала фиалки под фиолетовой подушкой'] },
  cook: { yellowSeat: ['припрятал лимон под жёлтой подушкой'] },
  baker: { yellowSeat: ['припрятала булочку под жёлтой подушкой'] },
  merchant: { yellowSeat: ['гадалка нагадала: жёлтый — к богатству'] },
  knight: { redSeat: ['гадалка нагадала: красный — к славе'] },
  piper: { redSeat: ['гадалка нагадала: красный — к аплодисментам'] },
  dancer: { redSeat: ['гадалка нагадала: красный — к аплодисментам'] },
  smith: { violetSeat: ['спрятал пару тузов под фиолетовой подушкой'], blueSeat: ['держит сапфир под синей подушкой'] },
  shipwright: { blueSeat: ['считает синий цветом счастливой волны'] },
  sailor: { blueSeat: ['считает синий цветом счастливой волны'] },
  scribe: { blueSeat: ['считает синий подходящим к чернилам'] },
};

// --- Комнаты: 10 глав, по одной на главу. x/y — проценты от арта. ---
// tables — кольцевые порядки мест (соседство); opposite — явные пары
// «напротив» для длинных столов (иначе выводится из кольца).
export const SEATING_ROOMS = {
  ch01: {
    id: 'ch01', name: 'Первая чайная комната', image: 'assets/seating/seat_ch01_web.jpg',
    seats: [
      { id: 'quiet', x: 36.8, y: 45.2, label: 'стул у книжного уголка с синей подушечкой', features: ['quiet', 'window', 'blueSeat'] },
      { id: 'hearth', x: 62.0, y: 45.5, label: 'стул у огня с красной подушечкой', features: ['hearth', 'redSeat'] },
      { id: 'door', x: 61.0, y: 68.0, label: 'стул у двери с зелёной подушечкой', features: ['door', 'greenSeat'] },
      { id: 'window', x: 36.8, y: 67.0, label: 'стул у окна с фиолетовой подушечкой', features: ['window', 'violetSeat'] },
    ],
    tables: [['quiet', 'hearth', 'door', 'window']],
  },
  ch02: {
    id: 'ch02', name: 'Места у огня', image: 'assets/seating/seat_ch02_web.jpg',
    seats: [
      { id: 'quiet', x: 36.5, y: 43.0, label: 'стул у книжного уголка с зелёной подушечкой', features: ['quiet', 'window', 'greenSeat'] },
      { id: 'samovar', x: 57.2, y: 39.5, label: 'стул у самовара с жёлтой подушечкой', features: ['samovar', 'yellowSeat'] },
      { id: 'fire', x: 61.0, y: 61.5, label: 'стул у огня с красной подушечкой', features: ['hearth', 'redSeat'] },
      { id: 'door', x: 52.0, y: 75.5, label: 'стул у двери с фиолетовой подушечкой', features: ['door', 'violetSeat'] },
      { id: 'window', x: 35.0, y: 62.0, label: 'стул у окна с синей подушечкой', features: ['window', 'blueSeat'] },
    ],
    tables: [['quiet', 'samovar', 'fire', 'door', 'window']],
  },
  ch03: {
    id: 'ch03', name: 'Старые знакомые', image: 'assets/seating/seat_ch03_web.jpg',
    seats: [
      { id: 'quiet', x: 37.0, y: 41.0, label: 'место в тихом уголке', features: ['quiet'] },
      { id: 'samovar', x: 58.0, y: 38.5, label: 'место у самовара', features: ['samovar'] },
      { id: 'hearth', x: 62.5, y: 59.0, label: 'место у огня', features: ['hearth'] },
      { id: 'door', x: 53.0, y: 74.0, label: 'стул с карточкой', features: ['door'] },
      { id: 'window', x: 34.5, y: 60.0, label: 'место у окна', features: ['window'] },
    ],
    tables: [['quiet', 'samovar', 'hearth', 'door', 'window']],
  },
  ch04: {
    id: 'ch04', name: 'Свободный стул', image: 'assets/seating/seat_ch04_web.jpg',
    seats: [
      { id: 'quiet', x: 36.0, y: 40.0, label: 'место в тихом уголке', features: ['quiet'] },
      { id: 'samovar', x: 58.0, y: 38.5, label: 'место у самовара', features: ['samovar'] },
      { id: 'hearth', x: 63.5, y: 53.0, label: 'место у огня', features: ['hearth'] },
      { id: 'door', x: 59.0, y: 70.5, label: 'стул у двери', features: ['door'] },
      { id: 'spare', x: 48.5, y: 74.0, label: 'отодвинутый стул', features: [] },
      { id: 'window', x: 34.5, y: 63.0, label: 'место у окна', features: ['window'] },
      { id: 'aisle', x: 32.5, y: 49.5, label: 'стул у прохода', features: [] },
    ],
    tables: [['quiet', 'samovar', 'hearth', 'door', 'spare', 'window', 'aisle']],
  },
  ch05: {
    id: 'ch05', name: 'Характеры за столом', image: 'assets/seating/seat_ch05_web.jpg',
    seats: [
      { id: 'quiet', x: 36.0, y: 41.0, label: 'место в тихом уголке', features: ['quiet'] },
      { id: 'samovar', x: 58.0, y: 39.0, label: 'место у самовара', features: ['samovar'] },
      { id: 'hearth', x: 63.0, y: 56.0, label: 'место у огня', features: ['hearth'] },
      { id: 'door', x: 55.0, y: 73.0, label: 'стул у двери', features: ['door'] },
      { id: 'window', x: 34.0, y: 63.0, label: 'место у окна', features: ['window'] },
      { id: 'mid', x: 31.5, y: 49.0, label: 'среднее место', features: [] },
    ],
    tables: [['quiet', 'samovar', 'hearth', 'door', 'window', 'mid']],
  },
  ch06: {
    id: 'ch06', name: 'Два столика', image: 'assets/seating/seat_ch06_web.jpg',
    seats: [
      { id: 'aq', x: 36.5, y: 41.0, label: 'место в тихом уголке', features: ['quiet'] },
      { id: 'am', x: 37.5, y: 61.0, label: 'стул у малого стола', features: [] },
      { id: 'aw', x: 30.0, y: 51.0, label: 'место у окна', features: ['window'] },
      { id: 'bs', x: 57.0, y: 39.5, label: 'место у самовара', features: ['samovar'] },
      { id: 'bh', x: 64.0, y: 51.0, label: 'место у огня', features: ['hearth'] },
      { id: 'bd', x: 59.5, y: 66.5, label: 'стул у двери', features: ['door'] },
      { id: 'bm', x: 51.5, y: 62.0, label: 'стул у тележки', features: [] },
    ],
    tables: [['aq', 'am', 'aw'], ['bs', 'bh', 'bd', 'bm']],
  },
  ch07: {
    id: 'ch07', name: 'Своей компанией', image: 'assets/seating/seat_ch07_web.jpg',
    seats: [
      { id: 'at', x: 36.0, y: 40.5, label: 'место в тихом уголке', features: ['quiet'] },
      { id: 'ar', x: 43.0, y: 52.0, label: 'стул с краю', features: [] },
      { id: 'ab', x: 36.5, y: 63.0, label: 'место у окна', features: ['window'] },
      { id: 'al', x: 28.5, y: 52.5, label: 'крайний стул у окна', features: ['window'] },
      { id: 'bs', x: 59.0, y: 40.0, label: 'место у самовара', features: ['samovar'] },
      { id: 'bh', x: 66.0, y: 61.0, label: 'место у огня', features: ['hearth'] },
      { id: 'bd', x: 54.5, y: 62.5, label: 'стул у двери', features: ['door'] },
    ],
    tables: [['at', 'ar', 'ab', 'al'], ['bs', 'bh', 'bd']],
  },
  ch08: {
    id: 'ch08', name: 'Большой стол', image: 'assets/seating/seat_ch08_web.jpg',
    seats: [
      { id: 't1', x: 34.0, y: 44.0, label: 'угловое место у окна', features: ['quiet', 'window'] },
      { id: 't2', x: 44.0, y: 44.0, label: 'место с краю', features: [] },
      { id: 't3', x: 54.0, y: 44.0, label: 'место у середины', features: [] },
      { id: 't4', x: 64.0, y: 44.0, label: 'место у самовара', features: ['samovar'] },
      { id: 'b4', x: 64.0, y: 66.0, label: 'место у двери', features: ['door', 'hearth'] },
      { id: 'b3', x: 54.0, y: 66.0, label: 'место у свечей', features: [] },
      { id: 'b2', x: 44.0, y: 66.0, label: 'место у полки', features: [] },
      { id: 'b1', x: 34.0, y: 66.0, label: 'место у окна', features: ['window'] },
    ],
    tables: [['t1', 't2', 't3', 't4', 'b4', 'b3', 'b2', 'b1']],
    opposite: { t2: 'b2', b2: 't2', t3: 'b3', b3: 't3' },
  },
  ch09: {
    id: 'ch09', name: 'Вечер перекрёстка', image: 'assets/seating/seat_ch09_web.jpg',
    seats: [
      { id: 'wq', x: 36.0, y: 38.0, label: 'место в тихом уголке', features: ['quiet'] },
      { id: 'wm', x: 44.0, y: 48.0, label: 'стул у окна', features: ['window'] },
      { id: 'ww', x: 40.0, y: 64.0, label: 'место у окна', features: ['window'] },
      { id: 'wv', x: 28.0, y: 64.0, label: 'угловой стул у окна', features: ['window'] },
      { id: 'wl', x: 28.0, y: 46.0, label: 'стул у стекла', features: ['window'] },
      { id: 'fs', x: 58.0, y: 38.0, label: 'место у самовара', features: ['samovar'] },
      { id: 'fh', x: 68.0, y: 46.0, label: 'место у огня', features: ['hearth'] },
      { id: 'fe', x: 66.0, y: 64.0, label: 'стул у камина', features: ['hearth'] },
      { id: 'fd', x: 56.0, y: 66.0, label: 'стул у двери', features: ['door'] },
      { id: 'fm', x: 52.0, y: 48.0, label: 'средний стул', features: [] },
    ],
    tables: [['wq', 'wm', 'ww', 'wv', 'wl'], ['fs', 'fh', 'fe', 'fd', 'fm']],
  },
  ch10: {
    id: 'ch10', name: 'Праздник ста чашек', image: 'assets/seating/seat_ch10_web.jpg',
    seats: [
      { id: 't1', x: 33.0, y: 42.0, label: 'место в тихом уголке', features: ['quiet'] },
      { id: 't2', x: 43.0, y: 42.0, label: 'место у гирлянд', features: [] },
      { id: 't3', x: 53.0, y: 42.0, label: 'место у самовара', features: ['samovar'] },
      { id: 't4', x: 63.0, y: 42.0, label: 'место у огня', features: ['hearth'] },
      { id: 'b4', x: 63.0, y: 64.0, label: 'место у двери', features: ['door'] },
      { id: 'b3', x: 53.0, y: 64.0, label: 'место у свечей', features: [] },
      { id: 'b2', x: 43.0, y: 64.0, label: 'место у лент', features: [] },
      { id: 'b1', x: 33.0, y: 64.0, label: 'место у окна', features: ['window'] },
    ],
    tables: [['t1', 't2', 't3', 't4', 'b4', 'b3', 'b2', 'b1']],
    opposite: { t2: 'b2', b2: 't2', t3: 'b3', b3: 't3' },
  },
};

// --- Прогрессия глав (PLAN.md, «Гости за чайным столом») ---
// from/to — число гостей на первом/последнем уровне главы; maxWishes — потолок
// желаний на гостя; types — пул правил с весами (чем больше, тем чаще);
// focus — дебютная механика главы: одно такое правило гарантированно есть
// в каждом уровне главы (тест следит за дебютами).
const CHAPTER_CFG = [
  // 1. Первая чайная комната: место и «рядом/не рядом», 1 желание на гостя
  { room: 'ch01', from: 3, to: 4, maxWishes: 1, focus: ['near'], types: { seat: 3, near: 4, notNear: 2 } },
  // 2. Места у огня: особенности стульев и отрицания, первые закреплённые
  { room: 'ch02', from: 4, to: 5, maxWishes: 1, focus: ['feature', 'notFeature'], types: { seat: 2, near: 3, notNear: 2, feature: 4, notFeature: 3 } },
  // 3. Старые знакомые: «напротив» и «между»
  { room: 'ch03', from: 5, to: 5, maxWishes: 1, focus: ['opposite', 'between'], types: { seat: 1, near: 3, notNear: 2, feature: 2, notFeature: 1, opposite: 4, between: 4 } },
  // 4. Свободный стул: лишние места, пожелания про пустой соседний стул
  { room: 'ch04', from: 5, to: 6, maxWishes: 1, focus: ['emptyNear'], types: { seat: 1, near: 2, notNear: 2, feature: 2, notFeature: 1, opposite: 2, between: 2, emptyNear: 4 } },
  // 5. Характеры за столом: условия через видимые черты
  { room: 'ch05', from: 6, to: 6, maxWishes: 1, focus: ['traitNear', 'notTraitNear'], types: { seat: 1, near: 2, notNear: 1, feature: 1, notFeature: 1, opposite: 1, between: 1, traitNear: 4, notTraitNear: 3 } },
  // 6. Два столика: за одним / за разными столами
  { room: 'ch06', from: 6, to: 7, maxWishes: 1, focus: ['sameTable', 'differentTable'], types: { seat: 1, near: 2, notNear: 1, feature: 1, notFeature: 1, opposite: 1, between: 1, traitNear: 1, sameTable: 4, differentTable: 3 } },
  // 7. Своей компанией: трое подряд, до двух желаний на гостя
  { room: 'ch07', from: 7, to: 7, maxWishes: 2, focus: ['runWith'], types: { seat: 1, near: 2, notNear: 1, feature: 1, opposite: 1, between: 2, traitNear: 1, notTraitNear: 1, sameTable: 2, differentTable: 1, runWith: 4 } },
  // 8. Большой стол: длинная раскладка без новых видов правил
  { room: 'ch08', from: 7, to: 8, maxWishes: 2, focus: ['opposite', 'between'], types: { seat: 1, near: 2, notNear: 1, feature: 2, notFeature: 1, opposite: 3, between: 3, emptyNear: 2, traitNear: 1, notTraitNear: 1 } },
  // 9. Вечер перекрёстка: два стола, 8 гостей, 1–2 лишних стула
  { room: 'ch09', from: 8, to: 8, maxWishes: 2, focus: ['sameTable', 'differentTable', 'emptyNear'], types: { seat: 2, near: 2, notNear: 1, feature: 2, notFeature: 1, opposite: 2, between: 2, emptyNear: 2, traitNear: 2, notTraitNear: 1, sameTable: 3, differentTable: 2, runWith: 2 } },
  // 10. Праздник ста чашек: всё вместе, финал без новых правил
  { room: 'ch10', from: 8, to: 8, maxWishes: 2, focus: ['runWith', 'opposite', 'between'], types: { seat: 1, near: 2, notNear: 1, feature: 1, notFeature: 1, opposite: 2, between: 2, traitNear: 2, notTraitNear: 1, runWith: 2 } },
];

// --- Имена и интро: по 10 на главу, уникальные (тест следит) ---
const CHAPTER_NAMES = [
  ['Чай для троих', 'Первый вечер', 'Три чашки', 'Место у окна', 'Уголок для гостя', 'Самовар закипел', 'Первые стулья', 'Тихий час', 'Чайная посиделка', 'Четыре чашки'],
  ['У тёплого бока', 'Огонь и сквозняк', 'Красная подушка', 'Зимний вечер', 'Пять чашек', 'Где теплее', 'По старшинству стульев', 'Закреплённый стул', 'Уголок со лампой', 'Дрова и чай'],
  ['Встреча старых друзей', 'Напротив', 'Между своими', 'Давняя компания', 'Ленточка на стене', 'Стол для своих', 'Снова вместе', 'Визитные карточки', 'Кружка старого друга', 'Разговор через стол'],
  ['Лишний стул', 'Дождь за окном', 'Седьмой стул', 'Место про запас', 'Зонт у двери', 'Свободное соседство', 'Один стул пустует', 'Просторная рассадка', 'Отодвинутый стул', 'Воздух между гостями'],
  ['Характеры', 'Мастер за столом', 'Музыка и тишина', 'Значки на карточках', 'Шесть характеров', 'Профессии рядом', 'Тихоня и рассказчик', 'Кружок по интересам', 'Свирель на стене', 'Сосед по духу'],
  ['Два столика', 'Чайная тележка', 'Разные компании', 'Стол у окна', 'Летние травы', 'По разным столам', 'Одной компанией', 'Семь стульев', 'Проход между столами', 'Выбор стола'],
  ['Своей компанией', 'Трое подряд', 'Гирлянда для гостей', 'Торт под крышкой', 'Семь чашек вечера', 'Компания трёх', 'Плечом к плечу', 'Узкая рассадка', 'Три места рядом', 'Большая компания'],
  ['Большой стол', 'Дубовая раскладка', 'Свечи в ряд', 'Восемь стульев', 'Длинный вечер', 'Банкетный час', 'За длинным столом', 'Четыре напротив четырёх', 'Торец стола', 'Поздний пир'],
  ['Вечер перекрёстка', 'Огни за окном', 'Десять стульев', 'Два мира за столом', 'Ночной перекрёсток', 'Сувениры на стенах', 'Плотный вечер', 'Компания миров', 'Дорожные фонари', 'Поздние гости'],
  ['Праздник ста чашек', 'Сотая чашка', 'Гирлянды и ленты', 'Золотой вечер', 'Подарки у буфета', 'Стол праздника', 'Сто огней', 'Все в сборе', 'Финальный чай', 'Праздник лавки'],
];

const CHAPTER_INTROS = [
  [
    'Первые гости заглянули на чай. Рассади их так, чтобы сбылись все пожелания.',
    'Три чашки на столе — и три просьбы. Найди каждому своё место.',
    'Кто-то тянется к окну, кто-то — к людям. Прочти пожелания и усади гостей.',
    'Самовар уже шумит. Самое время рассадить гостей по их вкусам.',
    'Четверо за одним столом: посади каждого туда, где ему будет хорошо.',
    'Вечер начинается с рассадки. Все пожелания написаны на карточках гостей.',
    'Гости стоят у двери и ждут. Подумай, кто кому будет рад соседом.',
    'Чайный стол маленький, а характеры большие. Усади всех с умом.',
    'Сегодня гостей четверо. Пусть каждый сядет так, как просит.',
    'Первая чайная комната собрала компанию. Рассади её без обид.',
  ],
  [
    'У огня тепло, у двери сквозит. Гости просятся к особым местам — или от них.',
    'Красная подушка у камина — примета тёплого места. Учитывай её в пожеланиях.',
    'Один гость уже сел — его место закреплено. Подстраивай остальных.',
    'Зимний вечер требует точности: кто-то мёрзнет у двери, кто-то ищет самовар.',
    'Пять стульев, пять характеров. Закреплённый гость подскажет начало.',
    'Пожелания стали тоньше: «хочу у окна», «только не к сквозняку». Слушай внимательно.',
    'У самовара место почётное. Раздай особые стулья по правилам.',
    'Гость у огня уже греется. Его не пересадить — строй рассадку вокруг.',
    'У каждого стула теперь есть характер. Подбери пару каждому гостю.',
    'Холодный вечер, горячий самовар. Рассади гостей по приметам мест.',
  ],
  [
    'Старые друзья хотят сесть напротив друг друга — чтобы видеть глаза.',
    '«Между своими» — новая просьба. Оба соседа названы по именам.',
    'За этим столом встречаются давние знакомые. Появились просьбы «напротив» и «между».',
    'Кто-то просится напротив друга: разговору нужны глаза, а не затылок.',
    'Стол накрыт для встречи. Читай перекрёстные пожелания внимательно.',
    'Ленточка на стене — от прошлой компании. Сегодняшняя просит мест «между» и «напротив».',
    'Разговору нужен собеседник напротив. Усади парочки через стол.',
    'Трое старых друзей держатся вместе. Всё написано в пожеланиях.',
    'Карточка на стуле пуста, но пожелания точны. Найди каждому место.',
    'Годы разлучили, а стол соберёт. Рассади старых знакомых по просьбам.',
  ],
  [
    'Стульев больше, чем гостей. Кому-то нужен пустой стул рядом — для сумки или для души.',
    'Один стул отодвинут и ждёт. Некоторые гости просят свободное соседство.',
    'Дождь за окном, зонт у двери — и пожелание: «пусть рядом будет пусто».',
    'Лишний стул — не лишний: он выполняет пожелания о просторе.',
    'Шесть гостей, семь стульев. Кто-то обязательно попросит воздуха рядом.',
    'Не все любят тесноту. Читай пожелания про пустые места.',
    'Просторная рассадка: теперь соседом может быть и пустой стул.',
    'Кому-то нужно место для корзины. Оставь рядом с ним пустоту.',
    'Стол овальный, стульев с запасом. Рассади так, чтобы нужные места пустовали.',
    'Вечер дождливый, гости с вещами. Пустые стулья — тоже часть рассадки.',
  ],
  [
    'На карточках гостей появились черты характера. Кто-то просится рядом с мастером.',
    '«Подальше от музыканта» — не обида, а просьба. Черты решают рассадку.',
    'Шесть гостей, шесть характеров. Смотри на значки черт и на имена.',
    'Тихоня просит тишины, рассказчик — слушателя. Черты подскажут посадку.',
    'Кружок по интересам: посади мастеров и книжников так, как просят.',
    'Пожелания звучат не именами, а характерами. Ищи черты на карточках гостей.',
    'Музыкант и тихоня за одним столом? Только если так написано в пожеланиях.',
    'Свирель на стене молчит, а вот гости — нет. Учитывай их нравы.',
    'Кто рядом с кем по духу — теперь видно по чертам. Рассади сорадующихся.',
    'Характеры за столом важнее имён. Проверь каждую пару соседей.',
  ],
  [
    'В комнате два столика. Соседство считается только за своим столом.',
    '«За один стол» и «за разные столы» — новые просьбы. Столов два, выбор один.',
    'Чайная тележка разделила вечер на две компании. Разведи их по желаниям.',
    'Малый стол у окна, большой — у огня. Распредели гостей по столам.',
    'Летние травы на столах, а гости — по разным компаниям. Читай пожелания.',
    'Семь стульев у двух столов. Кому вместе, кому порознь — всё написано.',
    'Два столика — два мирка. Не перепутай, кто куда просится.',
    'Одной компанией или разными? Пожелания про столы решают всё.',
    'Столы стоят через проход. Соседи по столу — не соседи по комнате.',
    'Выбор стола — половина рассадки. Вторая половина — соседи.',
  ],
  [
    'Трое друзей просятся сидеть подряд, своей компанией. Найди им три места.',
    'Гирлянды для своих: у гостей теперь по два пожелания. Держи оба.',
    '«Три места подряд» — просьба компании. Остальным тоже есть что сказать.',
    'Торт под крышкой ждёт, а компания из трёх — свои стулья.',
    'Семь гостей, семь характеров, два желания у некоторых. Собери всё воедино.',
    'Своя компания сядет плечом к плечу. Найди им ряд из трёх мест.',
    'Просьбы группами: трое хотят подряд. Остальное — классика рассадки.',
    'Два пожелания на гостя — вдвое больше чтения, вдвое больше уюта.',
    'Компания трёх друзей держится вместе. Посади их одним рядком.',
    'Узкая рассадка: все хотят всех видеть, а трое — сидеть подряд.',
  ],
  [
    'Один длинный стол на восемь стульев. Напротив — через стол, рядом — по краю.',
    'Свечи в ряд, места в два ряда. Большой стол требует большого внимания.',
    'Семь гостей за дубовым столом. Пустой торец — тоже подсказка.',
    'Восемь стульев, четыре пары напротив. Длинная раскладка начинается.',
    'Поздний вечер, длинные тени. Рассади гостей по всей длине стола.',
    'Банкетный час: «между» и «напротив» читаются по-новому за длинным столом.',
    'Края стола — тоже места. Учитывай все восемь стульев.',
    'Семь характеров и один пустой стул за большим столом.',
    'Длинный стол сближает дальних и разъединяет ближних. Смотри на пары.',
    'Пир на весь вечер. Восемь мест, семь гостей, десятки пожеланий.',
  ],
  [
    'Вечер перекрёстка: два стола, восемь гостей и огни за окном.',
    'Десять стульев, восемь характеров. Пустые места — часть замысла.',
    'Два мира за двумя столами. Перекрёстные пожелания плотнее тумана.',
    'Сувениры на стенах помнят все миры. Столы ждут точной рассадки.',
    'Ночной перекрёсток светится. Рассади восемь гостей по двум столам.',
    'Плотный вечер: почти у каждого два пожелания и половина — про соседей.',
    'Дорожные фонари снаружи, два тёплых стола внутри. Восемь гостей ждут.',
    'Поздние гости пришли группой. Разведи компании по столам и местам.',
    'Компания миров за чаем: кто с кем, кто напротив, кто у пустого стула.',
    'Два стола по пять мест, лишние стулья и глубокая задумка вечера.',
  ],
  [
    'Праздник ста чашек начинается! Все механики вечера — в одной рассадке.',
    'Сотая чашка близко. Гирлянды, ленты и восемь характеров за столом.',
    'Золотой вечер: гости пришли все сразу. Рассади их, как умел ты всегда.',
    'Подарки у буфета, свечи по краям. Пожелания — все, что ты знаешь.',
    'Стол праздника длинный и нарядный. Новых правил нет — только мастерство.',
    'Сто огней горят в лавке. Восемь гостей ждут своих мест.',
    'Все в сборе! Проверь каждое пожелание — вечер того стоит.',
    'Финальный чай: два ряда стульев и полный набор просьб.',
    'Праздник лавки продолжается. Рассади гостей на славу.',
    'Сто чашек позади — и одна, последняя рассадка впереди. Сделай её идеальной.',
  ],
];

// --- Генератор уровней ---

const SEED = 20261018;

// Труппы глав: пересекающиеся окна по перемешанному кругу гостей.
// 35 гостей, старт окна сдвигается на 3 за главу — лица вводятся постепенно,
// а к десятой главе все побывали за столом хотя бы раз.
function buildCasts() {
  const rng = makeRng(SEED ^ 0x5eed);
  const circle = [...STORY_GUESTS];
  for (let i = circle.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [circle[i], circle[j]] = [circle[j], circle[i]];
  }
  const casts = [];
  for (let ch = 0; ch < 10; ch++) {
    const cast = [];
    const start = ch * 3;
    for (let k = 0; k < 12; k++) cast.push(circle[(start + k) % circle.length]);
    casts.push(cast);
  }
  return casts;
}

const CASTS = buildCasts();

function seatLabelOf(room, seatId) {
  return room.seats.find((s) => s.id === seatId).label;
}

// Простые причины для пространственных мест: не «место у окна», а то, что
// гость там хочет видеть или чувствовать. Сначала — персональная фраза,
// затем фраза по черте характера, затем нейтральный вариант.
const SEAT_REASONS = {
  quiet: {
    default: ['хочет поближе к книгам', 'любит почитать за чаем', 'после чая хочет прилечь'],
    books: ['хочет поближе к книгам', 'любит почитать за чаем'],
    quiet: ['после чая хочет прилечь', 'хочет поближе к книгам'],
    hearth: ['после чая хочет прилечь'],
    road: ['после дороги хочет прилечь'],
    tales: ['хочет поближе к книгам'],
  },
  hearth: {
    default: ['мёрзнет после дороги и хочет погреться', 'любит слушать, как потрескивают дрова'],
    road: ['мёрзнет после дороги и хочет погреться'],
    hearth: ['любит быть ближе к очагу'],
    craft: ['любит жар и запах дров'],
    quiet: ['хочет согреться в тишине'],
    magic: ['любит смотреть на тёплые искры'],
    nature: ['любит запах сухих трав у огня'],
  },
  door: {
    default: ['скоро уходит — нужен короткий путь к двери', 'ждёт позднего гостя и хочет видеть вход', 'слушает, не стучат ли снаружи'],
    road: ['скоро снова в путь — нужен короткий путь к двери'],
    quiet: ['ждёт тихого стука в дверь'],
    books: ['ждёт письмо и хочет видеть вход'],
    craft: ['держит дверь и петли под контролем'],
    tales: ['ждёт позднего гостя с историей'],
    magic: ['ждёт знак у порога'],
  },
  window: {
    default: ['хочет смотреть на дорогу', 'следит за луной', 'любит дождь за стеклом'],
    road: ['хочет смотреть на дорогу'],
    nature: ['смотрит, не собирается ли дождь'],
    quiet: ['следит за луной'],
    books: ['любит дождь за стеклом'],
    magic: ['следит за луной'],
    tales: ['смотрит, кто идёт к лавке'],
  },
  samovar: {
    default: ['любит наливать чай', 'хочет быть ближе к угощению', 'следит за пирогами'],
    hearth: ['хочет быть ближе к угощению'],
    nature: ['следит за травяным сбором'],
    books: ['любит наливать чай не отрываясь от разговора'],
    craft: ['присматривает за самоваром'],
    tales: ['хочет быть ближе к угощению'],
    quiet: ['любит тихий гул самовара'],
  },
};

const GUEST_SEAT_REASONS = {
  spider: { door: ['ждёт весточку от паучьей почты — ему ближе к двери'] },
  owl: { quiet: ['хочет поближе к книгам'], window: ['следит за луной'] },
  cat: { hearth: ['знает, что лучшее тепло у очага'], window: ['смотрит, кто идёт к лавке'] },
  watchman: { door: ['держит вход под контролем'] },
  cook: { samovar: ['хочет быть ближе к угощению'] },
  baker: { samovar: ['следит за пирогами'] },
  gardener: { window: ['смотрит, не собирается ли дождь'], quiet: ['после чая хочет прилечь'] },
  daughter: { window: ['хочет смотреть на дорогу'], quiet: ['хочет поближе к книгам'] },
  sailor: { window: ['хочет смотреть на дорогу'] },
  shipwright: { window: ['хочет смотреть на дорогу'] },
  scribe: { quiet: ['любит почитать за чаем'] },
};

// Отказ тоже называет причину, а не координату.
const SEAT_REJECTS = {
  quiet: ['не хочет засыпать над книгой', 'боится прилечь прямо за чаем'],
  hearth: ['не любит яркий огонь — глаза устают', 'у огня слишком жарко'],
  door: ['не любит сквозняк', 'не хочет вскакивать при каждом стуке'],
  window: ['не любит лунный свет — он мешает дремать', 'у окна слишком холодно для старых костей'],
  samovar: ['не выносит шум самовара рядом', 'не хочет следить за кипятком'],
};

function uniqueSpatialFeature(room, seat) {
  const nonColor = (seat.features || []).filter((f) => !SEAT_COLOR_FEATURE[f]);
  return nonColor.find((feature) => (
    room.seats.filter((s) => (s.features || []).includes(feature)).length === 1
  )) || null;
}

function colorJokeFor(level, guest, feature, variant) {
  const own = GUEST_COLOR_JOKES[guest]?.[feature];
  if (own?.length) return variant(own);
  return variant(COLOR_JOKES[feature]);
}

// Позитивное пожелание по особенности: сначала персональная фраза гостя,
// потом фраза по черте, потом нейтральная причина.
function featureWishText(guest, level, feature, variant) {
  const g = level.guestNames[guest];
  const own = GUEST_SEAT_REASONS[guest]?.[feature];
  if (own?.length) return `${g} ${variant(own)}`;
  const spec = SEAT_REASONS[feature];
  if (!spec) return `${g} просит ${SEAT_FEATURE_TEXT[feature]}`;
  const lines = [];
  for (const trait of level.traits[guest] || []) {
    if (spec[trait]) lines.push(...spec[trait]);
  }
  lines.push(...spec.default);
  return `${g} ${variant(lines)}`;
}

function rejectWishText(guest, level, feature, variant) {
  const g = level.guestNames[guest];
  const lines = SEAT_REJECTS[feature];
  return lines?.length ? `${g} ${variant(lines)}` : `${g} просит любое место, но не ${SEAT_FEATURE_TEXT[feature]}`;
}

// Текст точечной посадки: по возможности причина/симпатия. Цвет — только
// когда нет уникального пространственного признака (два стула у окна и т.п.),
// а совсем пустые поздние места используют свою конкретную подпись.
function seatWishText(guest, level, room, seat, variant) {
  const g = level.guestNames[guest];
  const feature = uniqueSpatialFeature(room, seat);
  if (feature) return featureWishText(guest, level, feature, variant);
  const color = (seat.features || []).find((f) => SEAT_COLOR_FEATURE[f]);
  if (color) return `${g} ${colorJokeFor(level, guest, color, variant)}`;
  return `${g} просит ${seat.label}`;
}

// Строит правило, истинное в рассадке sol (guestId -> seatId), или null.
function buildRule(type, guest, level, room, sol, rng, model) {
  const g = level.guestNames[guest];
  const forms = SEATING_GUESTS[guest];
  const seat = sol[guest];
  const gIdx = model.guestIndex.get(guest);
  const sIdx = model.seatIndex.get(seat);
  const adjSeats = model.adj[sIdx].map((i) => model.seats[i].id);
  const guestsAt = (sid) => level.guests.find((x) => sol[x] === sid);
  const pick = (arr) => arr[Math.floor(rng.next() * arr.length)];
  const variant = (list) => pick(list);

  switch (type) {
    case 'seat': {
      const text = seatWishText(guest, level, room, room.seats[sIdx], variant);
      if (!text) return null;
      return { type, guest, seat, text };
    }
    case 'feature': {
      // Цвета подушечек не входят в обычный пул пространственных особенностей:
      // они нужны только как крайний признак в точечных seat-правилах.
      const feats = (room.seats[sIdx].features || []).filter((f) => !SEAT_COLOR_FEATURE[f]);
      if (!feats.length) return null;
      const f = pick(feats);
      const text = featureWishText(guest, level, f, variant);
      return { type, guest, feature: f, text };
    }
    case 'notFeature': {
      const mine = new Set(room.seats[sIdx].features || []);
      const rest = Object.keys(SEAT_FEATURE_TEXT).filter((f) => !SEAT_COLOR_FEATURE[f] && !mine.has(f) && room.seats.some((s) => (s.features || []).includes(f)));
      if (!rest.length) return null;
      const f = pick(rest);
      const text = rejectWishText(guest, level, f, variant);
      return { type, guest, feature: f, text };
    }
    case 'near': {
      const others = level.guests.filter((x) => x !== guest && adjSeats.includes(sol[x]));
      if (!others.length) return null;
      const o = pick(others);
      const w = SEATING_GUESTS[o].with;
      const text = variant([`${g} хочет сидеть рядом ${w}`, `${g} просит место рядом ${w}`, `${g} охотно сядет рядом ${w}`]);
      return { type, guest, other: o, text };
    }
    case 'notNear': {
      const others = level.guests.filter((x) => x !== guest && !adjSeats.includes(sol[x]));
      if (!others.length) return null;
      const o = pick(others);
      const w = SEATING_GUESTS[o].with;
      const of = SEATING_GUESTS[o].of;
      const text = variant([`${g} не хочет сидеть рядом ${w}`, `${g} просит место подальше от ${of}`]);
      return { type, guest, other: o, text };
    }
    case 'opposite': {
      const oppSeats = model.opp[sIdx].map((i) => model.seats[i].id);
      const others = level.guests.filter((x) => x !== guest && oppSeats.includes(sol[x]));
      if (!others.length) return null;
      const o = pick(others);
      const of = SEATING_GUESTS[o].of;
      const text = variant([`${g} хочет сесть напротив ${of}`, `${g} просит место напротив ${of}`]);
      return { type, guest, other: o, text };
    }
    case 'between': {
      if (adjSeats.length !== 2) return null;
      const a = guestsAt(adjSeats[0]);
      const b = guestsAt(adjSeats[1]);
      if (!a || !b) return null;
      const ia = SEATING_GUESTS[a].inst;
      const ib = SEATING_GUESTS[b].inst;
      const text = variant([`${g} хочет сесть между ${ia} и ${ib}`, `${g} просит место между ${ia} и ${ib}`]);
      return { type, guest, others: [a, b], text };
    }
    case 'emptyNear': {
      const hasEmpty = adjSeats.some((sid) => !guestsAt(sid));
      if (!hasEmpty) return null;
      const text = variant([`${g} просит оставить рядом пустой стул`, `${g} хочет, чтобы рядом осталось свободное место`]);
      return { type, guest, text };
    }
    case 'traitNear': {
      const here = new Set();
      for (const sid of adjSeats) {
        const who = guestsAt(sid);
        if (who) for (const t of level.traits[who]) here.add(t);
      }
      if (!here.size) return null;
      const t = pick([...here]);
      const text = variant([`${g} хочет сидеть рядом ${TRAIT_TEXT[t].with}`, `${g} просит в соседи ${TRAIT_TEXT[t].of}`]);
      return { type, guest, trait: t, text };
    }
    case 'notTraitNear': {
      const bad = new Set();
      for (const sid of adjSeats) {
        const who = guestsAt(sid);
        if (who) for (const t of level.traits[who]) bad.add(t);
      }
      const present = new Set(level.guests.flatMap((x) => level.traits[x]));
      const rest = [...present].filter((t) => !bad.has(t));
      if (!rest.length) return null;
      const t = pick(rest);
      const text = variant([`${g} не хочет сидеть рядом ${TRAIT_TEXT[t].with}`, `${g} держится подальше от ${TRAIT_TEXT[t].of}`]);
      return { type, guest, trait: t, text };
    }
    case 'sameTable': {
      const myTable = model.seats[sIdx].table;
      const others = level.guests.filter((x) => x !== guest && model.seats[model.seatIndex.get(sol[x])].table === myTable);
      if (!others.length) return null;
      const o = pick(others);
      const w = SEATING_GUESTS[o].with;
      const text = variant([`${g} хочет сесть за один стол ${w}`, `${g} просится за общий стол ${w}`]);
      return { type, guest, other: o, text };
    }
    case 'differentTable': {
      const myTable = model.seats[sIdx].table;
      const others = level.guests.filter((x) => x !== guest && model.seats[model.seatIndex.get(sol[x])].table !== myTable);
      if (!others.length) return null;
      const o = pick(others);
      const w = SEATING_GUESTS[o].with;
      const of = SEATING_GUESTS[o].of;
      const text = variant([`${g} не хочет сидеть за одним столом ${w}`, `${g} просит стол отдельно от ${of}`]);
      return { type, guest, other: o, text };
    }
    case 'runWith': {
      // Три подряд места одного стола, где одно занято нашим гостем
      const triples = [];
      for (const ring of model.tables) {
        if (ring.length < 3) continue;
        for (let i = 0; i < ring.length; i++) {
          const win = [ring[i], ring[(i + 1) % ring.length], ring[(i + 2) % ring.length]];
          const who = win.map((si) => model.guests[modelSeatedAt(level, sol, model, si)]);
          if (who.includes(undefined)) continue;
          if (!who.includes(guest)) continue;
          const rest = who.filter((x) => x !== guest);
          if (new Set(who).size === 3) triples.push(rest);
        }
      }
      if (!triples.length) return null;
      const [a, b] = pick(triples);
      const text = variant([
        `${g}, ${level.guestNames[a]} и ${level.guestNames[b]} хотят сидеть подряд`,
        `${g}, ${level.guestNames[a]} и ${level.guestNames[b]} просят три места подряд`,
      ]);
      return { type, guest, others: [a, b], text };
    }
    default:
      return null;
  }
}

// Кто сидит на месте si в рассадке sol (guestIdx или -1)
function modelSeatedAt(level, sol, model, si) {
  const sid = model.seats[si].id;
  const g = level.guests.find((x) => sol[x] === sid);
  return g == null ? -1 : model.guestIndex.get(g);
}

function ruleKey(r) {
  return JSON.stringify([r.type, r.guest, r.seat, r.feature, r.other, r.others, r.trait]);
}

// Сила правила для жадного выбора: позиционные правила привязывают гостя
// к месту, «слабые» (за столом/подальше) почти не сокращают перебор.
const RULE_STRENGTH = {
  seat: 2.5, feature: 1.6, near: 1.6, opposite: 1.6, between: 1.6, runWith: 1.6,
  traitNear: 1.4, emptyNear: 1.2, notTraitNear: 1.1, notNear: 1, notFeature: 1,
  sameTable: 1, differentTable: 1,
};

function genLevel(ch, idx) {
  const cfg = CHAPTER_CFG[ch];
  const room = SEATING_ROOMS[cfg.room];
  const rng = makeRng(SEED + ch * 1000 + idx * 37);
  const guestCount = cfg.from + Math.round((cfg.to - cfg.from) * (idx / 9));
  const fixedCount = ch === 0 ? 0 : (idx % 4 === 3 ? 0 : 1);
  const types = Object.entries(cfg.types);

  // Состав: вращающийся срез труппы главы — лица повторяются, все играют
  const cast = CASTS[ch];
  const start = (idx * 5) % cast.length;
  const guests = [];
  for (let k = 0; guests.length < guestCount && k < cast.length * 3; k++) {
    const cand = cast[(start + k) % cast.length];
    if (!guests.includes(cand)) guests.push(cand);
  }
  // Перемешаем порядок карточек
  for (let i = guests.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [guests[i], guests[j]] = [guests[j], guests[i]];
  }

  const base = {
    id: `seat_${String(ch * 10 + idx + 1).padStart(2, '0')}`,
    world: 'seating', mechanic: 'seating',
    name: CHAPTER_NAMES[ch][idx],
    difficulty: ch + 1,
    room: cfg.room,
    guests,
    fixed: {},
    rules: [],
    traits: Object.fromEntries(guests.map((g) => [g, SEATING_GUESTS[g].traits])),
    guestNames: Object.fromEntries(guests.map((g) => [g, GUEST_BY_ID[g].name])),
    rewards: [{ type: 'coins', amount: 150 + 40 * (ch + 1) }],
    intro: CHAPTER_INTROS[ch][idx],
  };

  const seatIds = room.seats.map((s) => s.id);

  for (let attempt = 0; attempt < 400; attempt++) {
    // Случайная рассадка-решение
    const bag = [...seatIds];
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(rng.next() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    const sol = {};
    guests.forEach((g, i) => { sol[g] = bag[i]; });

    const fixedGuests = [...guests];
    for (let i = fixedGuests.length - 1; i > 0; i--) {
      const j = Math.floor(rng.next() * (i + 1));
      [fixedGuests[i], fixedGuests[j]] = [fixedGuests[j], fixedGuests[i]];
    }
    const fixed = {};
    fixedGuests.slice(0, fixedCount).forEach((g) => { fixed[g] = sol[g]; });
    const fixedSet = new Set(Object.keys(fixed));

    // Черновик пересобирается заново при каждом добавленном правиле —
    // модель/домены в core кэшируются по объекту уровня.
    let draft = { ...base, fixed, rules: [] };
    const wishes = {};
    const keys = new Set();
    let ok = false;

    // Фокусное правило главы: дебютная механика гарантированно присутствует
    if (cfg.focus?.length) {
      const model = seatingModel(draft, SEATING_ROOMS);
      const focusCands = [];
      for (const g of guests) {
        const isFixed = fixedSet.has(g);
        for (const type of cfg.focus) {
          if (isFixed && ['seat', 'feature', 'notFeature', 'emptyNear'].includes(type)) continue;
          const r = buildRule(type, g, draft, room, sol, rng, model);
          if (r) focusCands.push(r);
        }
      }
      if (!focusCands.length) continue;
      const f = focusCands[Math.floor(rng.next() * focusCands.length)];
      keys.add(ruleKey(f));
      wishes[f.guest] = (wishes[f.guest] || 0) + 1;
      draft = { ...draft, rules: [f] };
    }

    for (let step = 0; step < 90; step++) {
      // Считаем с запасом до 6: count<6 — точное число решений, 6 — «много».
      const res = solveSeating(draft, SEATING_ROOMS, 6);
      if (res.truncated) break;
      const missing = guests.filter((g) => !fixedSet.has(g) && !(wishes[g] > 0));
      if (res.count === 1 && missing.length === 0) { ok = true; break; }

      // Кандидаты: истинные в sol правила разрешённых типов. Если решение уже
      // единственно и не хватает желаний — добиваем только желающих.
      const model = seatingModel(draft, SEATING_ROOMS);
      const wantOnly = res.count === 1 ? new Set(missing) : null;
      const typeCount = {};
      for (const r of draft.rules) typeCount[r.type] = (typeCount[r.type] || 0) + 1;
      const collect = (ignoreCaps) => {
        const list = [];
        for (const g of guests) {
          if ((wishes[g] || 0) >= cfg.maxWishes) continue;
          if (wantOnly && !wantOnly.has(g)) continue;
          const isFixed = fixedSet.has(g);
          for (const [type, weight] of types) {
            if (isFixed && ['seat', 'feature', 'notFeature', 'emptyNear'].includes(type)) continue;
            // Лимиты разнообразия: «точное место» редко; фирменный тип главы
            // (вес ≥ 4) — до трёх, прочие — до двух. При затыке лимиты снимаем.
            if (!ignoreCaps) {
              const cap = type === 'seat' ? (ch === 0 ? 2 : 1) : (weight >= 4 ? 3 : 2);
              if ((typeCount[type] || 0) >= cap) continue;
            }
            const r = buildRule(type, g, draft, room, sol, rng, model);
            if (r && !keys.has(ruleKey(r))) list.push([r, weight]);
          }
        }
        return list;
      };
      const score = (list) => {
        const out = [];
        for (const [r, w] of list) {
          const probe = { ...draft, rules: [...draft.rules, r] };
          const pr = solveSeating(probe, SEATING_ROOMS, 6);
          if (pr.truncated) continue;
          const spread = (wishes[r.guest] || 0) === 0 ? 2 : 1;
          out.push({ r, w: w * (RULE_STRENGTH[r.type] || 1) * spread, count: pr.count, nodes: pr.searchNodes });
        }
        return out;
      };

      // Жадный выбор: правило, сильнее всего сокращающее число решений.
      // Если при точном счёте (< 6) лимитированные кандидаты не сокращают его,
      // пробуем без лимитов типов (разнообразие уступает решаемости);
      // не помогло — попытка обречена, желания тратятся впустую.
      let scored = score(collect(false));
      let bestCount = scored.length ? Math.min(...scored.map((s) => s.count)) : Infinity;
      if (res.count > 1 && res.count < 6 && bestCount >= res.count) {
        scored = score(collect(true));
        bestCount = scored.length ? Math.min(...scored.map((s) => s.count)) : Infinity;
      }
      if (!scored.length) break;
      if (res.count > 1 && res.count < 6 && bestCount >= res.count) break;
      const best = scored.filter((s) => s.count === bestCount);
      const bestNodes = Math.min(...best.map((s) => s.nodes));
      const pool = best.filter((s) => s.nodes <= bestNodes * 4);
      let total = 0;
      for (const s of pool) total += s.w;
      let roll = rng.next() * total;
      let chosen = pool[0].r;
      for (const s of pool) { roll -= s.w; if (roll <= 0) { chosen = s.r; break; } }
      keys.add(ruleKey(chosen));
      wishes[chosen.guest] = (wishes[chosen.guest] || 0) + 1;
      draft = { ...draft, rules: [...draft.rules, chosen] };
    }

    if (ok) return draft;
  }
  throw new Error(`seating: не удалось собрать уровень ${base.id} (${base.name})`);
}

export const SEATING_PUZZLES = [];
for (let ch = 0; ch < 10; ch++) {
  for (let idx = 0; idx < 10; idx++) {
    SEATING_PUZZLES.push(genLevel(ch, idx));
  }
}
