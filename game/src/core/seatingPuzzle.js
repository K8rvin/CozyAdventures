// Движок головоломки «Гости за чайным столом». Чистая логика, без DOM.
// Игрок рассаживает знакомых гостей по местам комнаты так, чтобы выполнялись
// все видимые пожелания (правила). Часть гостей может быть закреплена
// (fixed) — это стартовая посадка-зацепка, а не правило: таких гостей
// двигать и поднимать нельзя, сброс возвращает их на место.
//
// Уровень (см. data/puzzlesSeating.js):
//   { id, world:'seating', mechanic:'seating', name, difficulty, room,
//     guests: [guestId...], fixed: { guestId: seatId }, rules: [...],
//     traits: { guestId: [traitKey...] }, guestNames: { guestId: 'Имя' },
//     rewards, intro }
// Комната (SEATING_ROOMS):
//   { id, name, image, seats: [{ id, x, y, label, features: [] }],
//     tables: [[seatId...кольцевой порядок]], opposite?: { seatId: seatId } }
// Правила — плоские, с полем guest и видимым русским text:
//   seat {guest, seat}            — точное место
//   feature / notFeature {guest, feature} — место с особенностью / без неё
//   near / notNear {guest, other} — соседние места за одним столом
//   opposite {guest, other}       — напротив за одним столом
//   between {guest, others:[a,b]} — соседи гостя ровно эти двое
//   emptyNear {guest}             — рядом нужен пустой стул
//   traitNear / notTraitNear {guest, trait} — сосед с чертой / без неё
//   sameTable / differentTable {guest, other} — за одним / разными столами
//   runWith {guest, others:[a,b]} — трое занимают три подряд места одного стола
// «Слева/справа» нарочно нет: у круглого стола это спорно.

export const SEATING_RULE_TYPES = [
  'seat', 'feature', 'notFeature', 'near', 'notNear', 'opposite', 'between',
  'emptyNear', 'traitNear', 'notTraitNear', 'sameTable', 'differentTable',
  'runWith',
];

// --- Модель уровня: строится один раз и кэшируется по объекту уровня ---
const MODELS = new WeakMap();

export function seatingModel(level, rooms) {
  let model = MODELS.get(level);
  if (model) return model;
  const room = rooms[level.room];
  if (!room) throw new Error(`seating: неизвестная комната ${level.room}`);

  const seatIndex = new Map(room.seats.map((s, i) => [s.id, i]));
  const seats = room.seats.map((s, i) => ({
    id: s.id, idx: i, x: s.x, y: s.y, label: s.label || s.id,
    features: new Set(s.features || []), table: -1,
  }));
  const tables = room.tables.map((ring) => ring.map((id) => seatIndex.get(id)));
  tables.forEach((ring, t) => ring.forEach((si) => { seats[si].table = t; }));

  // Соседство — по кольцевому порядку стола
  const adj = seats.map(() => []);
  for (const ring of tables) {
    const n = ring.length;
    ring.forEach((si, i) => {
      adj[si].push(ring[(i + n - 1) % n], ring[(i + 1) % n]);
    });
  }
  // Напротив: явная карта комнаты или формула кольца (для нечётного кольца —
  // оба места «через стол»; для колец короче 4 мест «напротив» нет)
  const opp = seats.map(() => []);
  if (room.opposite) {
    for (const [a, b] of Object.entries(room.opposite)) {
      opp[seatIndex.get(a)].push(seatIndex.get(b));
      opp[seatIndex.get(b)].push(seatIndex.get(a));
    }
  } else {
    for (const ring of tables) {
      const n = ring.length;
      if (n < 4) continue;
      ring.forEach((si, i) => {
        if (n % 2 === 0) {
          opp[si].push(ring[(i + n / 2) % n]);
        } else {
          opp[si].push(ring[(i + Math.floor(n / 2)) % n], ring[(i + Math.ceil(n / 2)) % n]);
        }
      });
    }
  }

  const guests = [...level.guests];
  const guestIndex = new Map(guests.map((g, i) => [g, i]));
  const traits = guests.map((g) => new Set(level.traits?.[g] || []));

  const rules = (level.rules || []).map((r) => ({
    type: r.type,
    g: guestIndex.get(r.guest),
    s: r.seat != null ? seatIndex.get(r.seat) : -1,
    f: r.feature || null,
    o: r.other != null ? guestIndex.get(r.other) : -1,
    os: (r.others || []).map((id) => guestIndex.get(id)),
    trait: r.trait || null,
    text: r.text,
    ref: r,
  }));
  const rulesByGuest = guests.map(() => []);
  rules.forEach((r) => rulesByGuest[r.g].push(r));

  // Закреплённые гости: стартовая посадка
  const fixed = new Map();
  for (const [g, s] of Object.entries(level.fixed || {})) {
    fixed.set(guestIndex.get(g), seatIndex.get(s));
  }

  // Домены мест для каждого гостя: закрепление + унарные правила
  const fixedSeats = new Set(fixed.values());
  const domains = guests.map((g, gi) => {
    if (fixed.has(gi)) return [fixed.get(gi)];
    let dom = seats.map((s) => s.idx).filter((si) => !fixedSeats.has(si));
    for (const r of rulesByGuest[gi]) {
      if (r.type === 'seat') dom = dom.filter((si) => si === r.s);
      if (r.type === 'feature') dom = dom.filter((si) => seats[si].features.has(r.f));
      if (r.type === 'notFeature') dom = dom.filter((si) => !seats[si].features.has(r.f));
    }
    return dom;
  });

  // Порядок перебора: сначала самые узкие домены, потом самые связанные
  const order = guests.map((_, gi) => gi).sort((a, b) => (
    domains[a].length - domains[b].length ||
    rulesByGuest[b].length - rulesByGuest[a].length ||
    a - b
  ));

  model = { room, seats, seatIndex, tables, adj, opp, guests, guestIndex, traits, rules, rulesByGuest, fixed, domains, order };
  MODELS.set(level, model);
  return model;
}

export function seatingSeats(level, rooms) {
  return seatingModel(level, rooms).seats;
}

export function seatingRoom(level, rooms) {
  return seatingModel(level, rooms).room;
}

// --- Состояние ---

export function createSeatingPuzzle(level, rooms) {
  seatingModel(level, rooms); // проверка ссылок сразу
  return {
    level,
    rooms,
    placement: { ...(level.fixed || {}) }, // guestId -> seatId
    history: [],
    moves: 0,
  };
}

export function guestAtSeat(state, seatId) {
  for (const [g, s] of Object.entries(state.placement)) {
    if (s === seatId) return g;
  }
  return null;
}

function isFixed(state, guestId) {
  return Object.prototype.hasOwnProperty.call(state.level.fixed || {}, guestId);
}

// Посадить гостя на СВОБОДНОЕ место (из подноса или с другого места).
export function seatGuest(state, guestId, seatId) {
  const model = seatingModel(state.level, state.rooms);
  if (!model.guestIndex.has(guestId)) return { ok: false, error: 'Нет такого гостя' };
  if (!model.seatIndex.has(seatId)) return { ok: false, error: 'Нет такого места' };
  if (isFixed(state, guestId)) return { ok: false, error: 'Гость уже закреплён за местом' };
  const occupant = guestAtSeat(state, seatId);
  if (occupant && occupant !== guestId) return { ok: false, error: 'Место занято' };
  const prev = state.placement[guestId] ?? null;
  if (prev === seatId) return { ok: true, noop: true };
  state.history.push({ guest: guestId, prev });
  state.placement[guestId] = seatId;
  state.moves += 1;
  return { ok: true };
}

// Перенос одним движением (drag&drop): на занятое место — обмен, если
// сосед не закреплён.
export function moveGuest(state, guestId, seatId) {
  const model = seatingModel(state.level, state.rooms);
  if (!model.guestIndex.has(guestId)) return { ok: false, error: 'Нет такого гостя' };
  if (!model.seatIndex.has(seatId)) return { ok: false, error: 'Нет такого места' };
  if (isFixed(state, guestId)) return { ok: false, error: 'Гость уже закреплён за местом' };
  const from = state.placement[guestId] ?? null;
  if (from === seatId) return { ok: true, noop: true };
  const occupant = guestAtSeat(state, seatId);
  if (occupant && occupant !== guestId) {
    if (isFixed(state, occupant)) return { ok: false, error: 'Место закреплено' };
    state.history.push({ swap: [guestId, occupant], prevA: from, prevB: seatId });
    state.placement[occupant] = from;
    state.placement[guestId] = seatId;
    state.moves += 1;
    return { ok: true, swapped: occupant };
  }
  state.history.push({ guest: guestId, prev: from });
  state.placement[guestId] = seatId;
  state.moves += 1;
  return { ok: true };
}

// Поднять гостя со стула (обратно на поднос).
export function removeGuest(state, guestId) {
  if (isFixed(state, guestId)) return false;
  if (!state.placement[guestId]) return false;
  state.history.push({ guest: guestId, prev: state.placement[guestId] });
  state.placement[guestId] = null;
  state.moves += 1;
  return true;
}

export function undoSeating(state) {
  const last = state.history.pop();
  if (!last) return false;
  if (last.swap) {
    state.placement[last.swap[0]] = last.prevA;
    state.placement[last.swap[1]] = last.prevB;
  } else {
    state.placement[last.guest] = last.prev;
  }
  state.moves += 1;
  return true;
}

// Сброс: все на поднос, закреплённые — на своих местах.
export function resetSeating(state) {
  state.placement = { ...(state.level.fixed || {}) };
  state.history = [];
  state.moves += 1;
}

// --- Проверка правил (общая для UI, решателя и валидатора) ---
// assign: guestIdx -> seatIdx | -1; occ: seatIdx -> guestIdx | -1.
// Семантика частичной рассадки: правило нарушено, если оно уже не может
// выполниться (оба участника сидят, соседние места заняты чужими и т.п.).
function ruleOk(model, assign, occ, r) {
  const gs = assign[r.g];
  switch (r.type) {
    case 'seat':
      return gs < 0 || gs === r.s;
    case 'feature':
      return gs < 0 || model.seats[gs].features.has(r.f);
    case 'notFeature':
      return gs < 0 || !model.seats[gs].features.has(r.f);
    case 'near': {
      if (gs < 0) return true;
      const os = assign[r.o];
      if (os >= 0) return model.adj[gs].includes(os);
      return model.adj[gs].some((si) => occ[si] < 0);
    }
    case 'notNear': {
      if (gs < 0) return true;
      const os = assign[r.o];
      return os < 0 || !model.adj[gs].includes(os);
    }
    case 'opposite': {
      if (gs < 0) return true;
      const os = assign[r.o];
      if (os >= 0) return model.opp[gs].includes(os);
      return model.opp[gs].some((si) => occ[si] < 0);
    }
    case 'between': {
      if (gs < 0) return true;
      const [a, b] = r.os;
      const sa = assign[a];
      const sb = assign[b];
      if (sa >= 0 && !model.adj[gs].includes(sa)) return false;
      if (sb >= 0 && !model.adj[gs].includes(sb)) return false;
      for (const nb of model.adj[gs]) {
        const who = occ[nb];
        if (who >= 0 && who !== a && who !== b) return false;
      }
      return true;
    }
    case 'emptyNear': {
      if (gs < 0) return true;
      return model.adj[gs].some((si) => occ[si] < 0);
    }
    case 'traitNear': {
      if (gs < 0) return true;
      let free = false;
      for (const nb of model.adj[gs]) {
        const who = occ[nb];
        if (who < 0) { free = true; continue; }
        if (model.traits[who].has(r.trait)) return true;
      }
      return free; // ещё есть куда сесть носителю черты
    }
    case 'notTraitNear': {
      if (gs < 0) return true;
      for (const nb of model.adj[gs]) {
        const who = occ[nb];
        if (who >= 0 && model.traits[who].has(r.trait)) return false;
      }
      return true;
    }
    case 'sameTable': {
      const os = assign[r.o];
      if (gs < 0 || os < 0) return true;
      return model.seats[gs].table === model.seats[os].table;
    }
    case 'differentTable': {
      const os = assign[r.o];
      if (gs < 0 || os < 0) return true;
      return model.seats[gs].table !== model.seats[os].table;
    }
    case 'runWith': {
      const seatsWanted = [assign[r.g], ...r.os.map((o) => assign[o])];
      if (seatsWanted.some((s) => s < 0)) return true;
      const wanted = new Set(seatsWanted);
      return model.tables.some((ring) => ring.some((_, i) => (
        wanted.has(ring[i]) &&
        wanted.has(ring[(i + 1) % ring.length]) &&
        wanted.has(ring[(i + 2) % ring.length])
      )));
    }
    default:
      return true;
  }
}

// Список нарушенных пожеланий: { rule, guest, text }.
export function seatingViolations(state) {
  const model = seatingModel(state.level, state.rooms);
  const n = model.guests.length;
  const assign = new Array(n).fill(-1);
  const occ = new Array(model.seats.length).fill(-1);
  for (const [g, s] of Object.entries(state.placement)) {
    if (!s) continue;
    const gi = model.guestIndex.get(g);
    const si = model.seatIndex.get(s);
    if (gi == null || si == null) continue;
    assign[gi] = si;
    occ[si] = gi;
  }
  const out = [];
  for (const r of model.rules) {
    if (!ruleOk(model, assign, occ, r)) {
      out.push({ rule: r.ref, guest: model.guests[r.g], text: r.text });
    }
  }
  return out;
}

export function isSeatingSolved(state) {
  const allSeated = state.level.guests.every((g) => !!state.placement[g]);
  return allSeated && seatingViolations(state).length === 0;
}

// --- Решатель (бэктрекинг с отсечками по частичной рассадке) ---
// Возвращает { count, placement, searchNodes, truncated }:
//   count — число найденных решений (не больше maxSolutions);
//   placement — первое решение { guestId: seatId } или null;
//   truncated — true, если поиск упёрся в лимит узлов (count тогда нижняя оценка).
const SEATING_NODE_CAP = 1_500_000;

export function solveSeating(level, rooms, maxSolutions = 2) {
  const model = seatingModel(level, rooms);
  const n = model.guests.length;
  const result = { count: 0, placement: null, solutions: [], searchNodes: 0, truncated: false };
  if (n > model.seats.length) return result;
  if (model.domains.some((d) => d.length === 0)) return result;

  const assign = new Array(n).fill(-1);
  const occ = new Array(model.seats.length).fill(-1);

  function bt(k) {
    if (result.count >= maxSolutions || result.truncated) return;
    if (k === n) {
      result.count += 1;
      const p = {};
      model.guests.forEach((g, gi) => { p[g] = model.seats[assign[gi]].id; });
      if (!result.placement) result.placement = p;
      result.solutions.push(p);
      return;
    }
    const g = model.order[k];
    for (const si of model.domains[g]) {
      if (occ[si] >= 0) continue;
      assign[g] = si;
      occ[si] = g;
      result.searchNodes += 1;
      if (result.searchNodes > SEATING_NODE_CAP) {
        result.truncated = true;
      } else if (model.rules.every((r) => ruleOk(model, assign, occ, r))) {
        bt(k + 1);
      }
      assign[g] = -1;
      occ[si] = -1;
      if (result.count >= maxSolutions || result.truncated) return;
    }
  }
  bt(0);
  return result;
}

// --- Подсказка из единственного решения ---
// Решение уровня кэшируется (состояние между экранами не сохраняется,
// а решение — свойство уровня). Цепочка подсказок обязана решать уровень:
// каждый шаг увеличивает число гостей на своих местах, remove лишь
// освобождает чужое место для следующего шага.
const SOLUTIONS = new WeakMap();

function uniqueSolution(level, rooms) {
  if (!SOLUTIONS.has(level)) {
    const r = solveSeating(level, rooms, 2);
    SOLUTIONS.set(level, r.count === 1 ? r.placement : null);
  }
  return SOLUTIONS.get(level);
}

export function seatingHint(state) {
  const model = seatingModel(state.level, state.rooms);
  const sol = uniqueSolution(state.level, state.rooms);
  if (!sol) return { type: 'unsolvable' };
  const nameOf = (g) => state.level.guestNames?.[g] || g;
  for (const g of state.level.guests) {
    const cur = state.placement[g] ?? null;
    const target = sol[g];
    if (cur === target) continue;
    const label = model.seats[model.seatIndex.get(target)].label;
    if (cur === null) {
      const occupant = guestAtSeat(state, target);
      if (!occupant) {
        return { type: 'place', guest: g, seat: target, text: `${nameOf(g)} — ${label}` };
      }
      return { type: 'remove', guest: occupant, text: `${nameOf(occupant)} — поднять со стула` };
    }
    return { type: 'move', guest: g, seat: target, text: `${nameOf(g)} — ${label}` };
  }
  return { type: 'already' };
}

// --- Валидатор уровня ---
// rooms — SEATING_ROOMS, guestsDict — SEATING_GUESTS (черты и формы).
// Проверяет структуру, все ссылки и ровно одно решение.
export function validateSeatingLevel(level, rooms, guestsDict) {
  const problems = [];
  const latin = /[a-z]/i;

  if (!/^seat_\d+$/.test(level.id || '')) problems.push('id не вида seat_NN');
  if (level.world !== 'seating' || level.mechanic !== 'seating') problems.push('world/mechanic должны быть seating');
  if (!level.name || latin.test(level.name)) problems.push('имя пустое или латиницей');
  if (!level.intro || latin.test(level.intro)) problems.push('интро пустое или латиницей');
  if (!Number.isInteger(level.difficulty) || level.difficulty < 1) problems.push('нет сложности');
  if (!Array.isArray(level.rewards) || level.rewards.length === 0) problems.push('нет наград');

  const room = rooms[level.room];
  if (!room) {
    problems.push(`неизвестная комната ${level.room}`);
    return { ok: false, problems };
  }
  const seatIds = new Set(room.seats.map((s) => s.id));
  const roomFeatures = new Set(room.seats.flatMap((s) => s.features || []));
  const multiTable = room.tables.length > 1;
  const hasOpposite = !!room.opposite || room.tables.some((t) => t.length >= 4);
  const hasRun = room.tables.some((t) => t.length >= 3);

  if (!Array.isArray(level.guests) || level.guests.length === 0) {
    problems.push('нет гостей');
    return { ok: false, problems };
  }
  const guestSet = new Set(level.guests);
  if (guestSet.size !== level.guests.length) problems.push('дубли гостей');
  if (level.guests.length > room.seats.length) problems.push('гостей больше, чем мест');
  for (const g of level.guests) {
    if (!guestsDict[g]) { problems.push(`неизвестный гость ${g}`); continue; }
    const t = level.traits?.[g];
    if (!Array.isArray(t) || t.length === 0) problems.push(`у гостя ${g} нет черт в данных уровня`);
    if (!level.guestNames?.[g] || latin.test(level.guestNames[g])) problems.push(`у гостя ${g} нет русского имени`);
  }

  const fixedSeats = new Set();
  for (const [g, s] of Object.entries(level.fixed || {})) {
    if (!guestSet.has(g)) problems.push(`fixed: ${g} не среди гостей`);
    if (!seatIds.has(s)) problems.push(`fixed: нет места ${s}`);
    if (fixedSeats.has(s)) problems.push(`fixed: место ${s} занято дважды`);
    fixedSeats.add(s);
  }

  const wishes = {};
  const ruleKeys = new Set();
  for (const r of level.rules || []) {
    if (!SEATING_RULE_TYPES.includes(r.type)) { problems.push(`неизвестный тип правила ${r.type}`); continue; }
    if (!guestSet.has(r.guest)) { problems.push(`правило ${r.type}: нет гостя ${r.guest}`); continue; }
    wishes[r.guest] = (wishes[r.guest] || 0) + 1;
    if (wishes[r.guest] > 2) problems.push(`у ${r.guest} больше двух желаний`);
    if (!r.text || latin.test(r.text)) problems.push(`правило ${r.type} без русского текста`);
    const key = JSON.stringify([r.type, r.guest, r.seat, r.feature, r.other, r.others, r.trait]);
    if (ruleKeys.has(key)) problems.push(`дубль правила: ${r.text}`);
    ruleKeys.add(key);

    const needOther = ['near', 'notNear', 'opposite', 'sameTable', 'differentTable'].includes(r.type);
    if (needOther) {
      if (!guestSet.has(r.other)) problems.push(`правило ${r.type}: нет гостя ${r.other}`);
      if (r.other === r.guest) problems.push(`правило ${r.type}: гость ссылается на себя`);
    }
    if (r.type === 'seat' && !seatIds.has(r.seat)) problems.push('seat: нет такого места');
    if ((r.type === 'feature' || r.type === 'notFeature') && !roomFeatures.has(r.feature)) {
      problems.push(`${r.type}: особенности ${r.feature} нет в комнате`);
    }
    if (r.type === 'opposite' && !hasOpposite) problems.push('opposite: в комнате некуда сесть напротив');
    if ((r.type === 'sameTable' || r.type === 'differentTable') && !multiTable) {
      problems.push(`${r.type}: в комнате один стол`);
    }
    if (r.type === 'between' || r.type === 'runWith') {
      const others = r.others || [];
      if (others.length !== 2 || !others.every((o) => guestSet.has(o))) {
        problems.push(`${r.type}: нужно ровно два других гостя из уровня`);
      } else if (new Set([r.guest, ...others]).size !== 3) {
        problems.push(`${r.type}: гости повторяются`);
      }
      if (!hasRun) problems.push(`${r.type}: нет стола с тремя местами подряд`);
    }
    if (r.type === 'emptyNear' && level.guests.length >= room.seats.length) {
      problems.push('emptyNear: пустых мест нет и быть не может');
    }
    if (r.type === 'traitNear' || r.type === 'notTraitNear') {
      if (!guestsDict[r.guest] || !Object.keys(guestsDict).length) continue;
      const traitKnown = Object.values(guestsDict).some((d) => d.traits.includes(r.trait));
      if (!traitKnown) { problems.push(`${r.type}: неизвестная черта ${r.trait}`); continue; }
      const holderHere = level.guests.some((g) => (level.traits?.[g] || []).includes(r.trait));
      if (!holderHere) problems.push(`${r.type}: за столом нет носителя черты ${r.trait}`);
    }
  }
  // У каждого незакреплённого гостя — хотя бы одно желание
  for (const g of level.guests) {
    if (!(level.fixed || {})[g] && !wishes[g]) problems.push(`у гостя ${g} нет ни одного желания`);
  }

  if (problems.length > 0) return { ok: false, problems };

  const res = solveSeating(level, rooms, 2);
  if (res.truncated) problems.push('решатель упёрся в лимит — уровень слишком слепой');
  else if (res.count === 0) problems.push('нет решения');
  else if (res.count > 1) problems.push(`решений больше одного (минимум ${res.count})`);
  return { ok: problems.length === 0, problems };
}
