const SNAPSHOT = Symbol('achievementSnapshot');

const own = (value, key) => Object.prototype.hasOwnProperty.call(value || {}, key);
const object = (value) => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
const list = (value) => Array.isArray(value) ? value : [];
const count = (value) => Number.isFinite(value) && value > 0 ? value : 0;
const unique = (values) => [...new Set(values)];

function honestEntry(entry) {
  return !!entry && !entry.skipped;
}

function victoriousEntry(entry) {
  if (!entry) return false;
  if (typeof entry !== 'object') return true;
  return entry.victories === undefined || count(entry.victories) > 0;
}

function validDay(day) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day || '')) return false;
  const date = new Date(`${day}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === day;
}

function idsFrom(values) {
  return new Set(list(values).filter((id) => typeof id === 'string' && id.length > 0));
}

function matchingIds(source, condition, snapshot, custom = false) {
  let ids = [...source];
  if (condition.ids) {
    const allowed = idsFrom(condition.ids);
    ids = ids.filter((id) => allowed.has(id));
  }
  if (condition.mechanic) {
    ids = ids.filter((id) => snapshot.puzzleMechanics.get(id) === condition.mechanic);
  }
  if (!custom) ids = ids.filter((id) => snapshot.campaignPuzzleIds.has(id));
  return ids;
}

function progress(current, target, done) {
  const safeCurrent = count(current);
  const safeTarget = Math.max(1, count(target));
  return {
    current: safeCurrent,
    target: safeTarget,
    done: done === undefined ? safeCurrent >= safeTarget : !!done,
  };
}

function readTopics(snapshot) {
  const read = new Map();
  const source = object(snapshot.telemetry.guestTopics);
  for (const guest of snapshot.guests) {
    const indexes = new Set(
      list(source[guest.id]).filter((index) => Number.isInteger(index) && index >= 0 && index < guest.topicCount),
    );
    read.set(guest.id, indexes.size);
  }
  return read;
}

export function createAchievementSnapshot(state, ctx = {}) {
  const puzzles = list(ctx.puzzles).filter((puzzle) => typeof puzzle?.id === 'string');
  const campaignPuzzleIds = new Set(puzzles.map((puzzle) => puzzle.id));
  const customPuzzleIds = new Set(
    list(state.customPuzzles)
      .map((puzzle) => puzzle?.id)
      .filter((id) => typeof id === 'string' && id && !campaignPuzzleIds.has(id)),
  );
  const knownPuzzleIds = new Set([...campaignPuzzleIds, ...customPuzzleIds]);
  const puzzleMechanics = new Map(puzzles.map((puzzle) => [puzzle.id, puzzle.mechanic || 'mirror']));
  for (const puzzle of list(state.customPuzzles)) {
    if (customPuzzleIds.has(puzzle?.id)) puzzleMechanics.set(puzzle.id, puzzle.mechanic || 'mirror');
  }

  const honestPuzzleIds = new Set();
  for (const id of knownPuzzleIds) {
    if (honestEntry(object(state.puzzlesDone)[id])) honestPuzzleIds.add(id);
  }
  const campaignHonestPuzzleIds = new Set([...honestPuzzleIds].filter((id) => campaignPuzzleIds.has(id)));
  const customHonestPuzzleIds = new Set([...honestPuzzleIds].filter((id) => customPuzzleIds.has(id)));

  const battleIds = new Set(
    list(ctx.battles).map((battle) => battle?.id).filter((id) => typeof id === 'string' && id),
  );
  const wonBattleIds = new Set();
  for (const id of battleIds) {
    if (victoriousEntry(object(state.battlesDone)[id])) wonBattleIds.add(id);
  }

  const telemetry = object(state.achievementStats);
  const telemetryPuzzles = object(telemetry.puzzles);
  const puzzleFeats = new Map();
  const noHintPuzzleIds = new Set();
  const puzzleDefinitions = new Map(puzzles.map((puzzle) => [puzzle.id, puzzle]));
  for (const id of honestPuzzleIds) {
    const feats = new Set(list(telemetryPuzzles[id]?.feats).filter((feat) => typeof feat === 'string'));
    const saved = object(state.puzzlesDone)[id];
    if (saved.hintsUsed === 0) feats.add('no_hints');
    const definition = puzzleDefinitions.get(id);
    if (
      definition?.mechanic === 'spin' && saved.hintsUsed === 0
      && Number.isFinite(saved.moves) && saved.moves > 0
      && Number.isFinite(definition.achievementPar) && saved.moves <= definition.achievementPar
    ) feats.add('spin_par');
    if (feats.has('no_hints')) noHintPuzzleIds.add(id);
    if (feats.size) puzzleFeats.set(id, feats);
  }

  const telemetryBattles = object(telemetry.battles);
  const battleFeats = new Map();
  let recordedDefeats = 0;
  for (const id of battleIds) {
    const record = object(telemetryBattles[id]);
    const feats = new Set(list(record.feats).filter((feat) => typeof feat === 'string'));
    if (feats.size) battleFeats.set(id, feats);
    recordedDefeats += count(record.defeats);
  }

  const guests = list(ctx.guests).map((guest) => ({
    id: guest.id,
    levelIds: list(guest.levelIds),
    topicCount: count(guest.topicCount),
  })).filter((guest) => typeof guest.id === 'string');
  const storyGuestIds = idsFrom(ctx.storyGuestIds);
  const story = object(state.story);
  const storyGuests = object(story.guests);
  const storyGuestsMet = new Set();
  const storyOwnPeople = new Set();
  const silentGuests = new Set();
  for (const id of storyGuestIds) {
    const memory = object(storyGuests[id]);
    if (count(memory.visits) > 0) storyGuestsMet.add(id);
    if (count(memory.visits) >= 4) storyOwnPeople.add(id);
    if (memory.silenceShown === true) silentGuests.add(id);
  }
  if (storyGuestIds.has(story.pending?.guestId)) storyGuestsMet.add(story.pending.guestId);

  const achievementIds = idsFrom(ctx.achievementIds);
  const unlockedAchievementIds = new Set();
  for (const id of achievementIds) {
    if (own(state.achievements, id)) unlockedAchievementIds.add(id);
  }

  const setTiers = new Map();
  const itemSets = object(ctx.itemSets);
  const setIds = idsFrom(ctx.setIds);
  const equipment = object(state.equipped);
  for (const id of setIds) {
    const equippedCount = Object.values(equipment).filter((itemId) => itemSets[itemId] === id).length;
    const currentTier = equippedCount >= 9 ? 9 : equippedCount >= 6 ? 6 : equippedCount >= 3 ? 3 : 0;
    setTiers.set(id, Math.max(currentTier, count(object(telemetry.setTiers)[id])));
  }

  const fateCards = new Set();
  const fateCardIds = idsFrom(ctx.fateCardIds);
  for (const level of list(ctx.fateLevels)) {
    if (!campaignHonestPuzzleIds.has(level.id)) continue;
    for (const cardId of list(level.cards)) {
      if (fateCardIds.has(cardId)) fateCards.add(cardId);
    }
  }
  const dailyDays = new Set(list(object(telemetry.daily).days).filter(validDay));
  if (validDay(state.lastDailyBonus)) dailyDays.add(state.lastDailyBonus);

  return {
    [SNAPSHOT]: true,
    state,
    telemetry,
    counters: object(telemetry.counters),
    campaignPuzzleIds,
    customPuzzleIds,
    campaignHonestPuzzleIds,
    customHonestPuzzleIds,
    puzzleMechanics,
    puzzleFeats,
    noHintPuzzleIds,
    battleIds,
    wonBattleIds,
    battleFeats,
    recordedDefeats,
    guests,
    topicRead: readTopics({ telemetry, guests }),
    storyGuestIds,
    storyGuestsMet,
    storyOwnPeople,
    silentGuests,
    achievementIds,
    unlockedAchievementIds,
    setTiers,
    fateCards,
    dailyDays,
    guideIds: idsFrom(ctx.guideIds),
    loreKeys: idsFrom(ctx.loreKeys),
    crewIds: idsFrom(ctx.crewIds),
    companionIds: idsFrom(ctx.companionIds),
    mercIds: idsFrom(ctx.mercIds),
    petIds: idsFrom(ctx.petIds),
    cosmeticIds: idsFrom(ctx.cosmeticIds),
    bossDrops: object(ctx.bossDrops),
    brewGuestLevels: object(ctx.brewGuestLevels),
    seatingGuestLevels: object(ctx.seatingGuestLevels),
  };
}

function evaluate(snapshot, definition) {
  const { state } = snapshot;
  const condition = object(definition.condition);
  const target = definition.target;

  switch (condition.kind) {
    case 'puzzles': {
      const noHints = condition.noHints === true;
      const source = noHints ? snapshot.noHintPuzzleIds : snapshot.campaignHonestPuzzleIds;
      return progress(matchingIds(source, condition, snapshot).length, target);
    }
    case 'puzzleSolves':
      return progress(object(state.stats).puzzlesSolved, target);
    case 'battles': {
      let ids = [...snapshot.wonBattleIds];
      if (condition.ids) {
        const allowed = idsFrom(condition.ids);
        ids = ids.filter((id) => allowed.has(id));
      }
      return progress(ids.length, target);
    }
    case 'battleWins':
      return progress(object(state.stats).battlesWon, target);
    case 'daily':
      return progress(snapshot.dailyDays.size, target);
    case 'storyFlag':
      return progress(Number(state.story?.[condition.flag] === true), target);
    case 'storyStep':
      return progress(object(state.story).step, target);
    case 'storyBeat': {
      const story = object(state.story);
      const reached = count(story.step) > condition.step || (
        count(story.step) === condition.step && story.pending?.beat === true
        && story.pending?.guestId === 'spirit'
      );
      return progress(Number(reached), target);
    }
    case 'storyGuests': {
      const source = condition.visits >= 4 ? snapshot.storyOwnPeople : snapshot.storyGuestsMet;
      return progress(source.size, target);
    }
    case 'guide': {
      const seen = new Set(list(state.onboarding?.guide?.seen));
      return progress([...snapshot.guideIds].filter((id) => seen.has(id)).length, target);
    }
    case 'bookGuests': {
      const current = snapshot.guests.filter((guest) => (
        guest.levelIds.some((id) => snapshot.campaignHonestPuzzleIds.has(id))
      )).length;
      return progress(current, target);
    }
    case 'guestTopics': {
      const values = [...snapshot.topicRead.values()];
      if (condition.mode === 'one') {
        const done = snapshot.guests.some((guest) => (
          guest.topicCount > 0 && snapshot.topicRead.get(guest.id) >= guest.topicCount
        ));
        return progress(Math.max(0, ...values), target, done);
      }
      return progress(values.reduce((sum, value) => sum + value, 0), target);
    }
    case 'guestLevels': {
      const groups = condition.group === 'seating' ? snapshot.seatingGuestLevels : snapshot.brewGuestLevels;
      const current = Object.values(groups).filter((ids) => (
        list(ids).some((id) => snapshot.campaignHonestPuzzleIds.has(id))
      )).length;
      return progress(current, target);
    }
    case 'lore': {
      const seen = object(state.battleLoreSeen);
      return progress([...snapshot.loreKeys].filter((key) => seen[key] === true).length, target);
    }
    case 'crew': {
      const hired = new Set(list(state.crew));
      return progress([...snapshot.crewIds].filter((id) => hired.has(id)).length, target);
    }
    case 'fullParty': {
      const companions = new Set(list(state.squadCompanions).filter((id) => snapshot.companionIds.has(id)));
      const mercs = new Set(list(state.squadMercs).filter((id) => snapshot.mercIds.has(id)));
      const full = companions.size >= 3 && mercs.size >= 2 && snapshot.petIds.has(state.pet);
      return progress(Number(full), target);
    }
    case 'stat':
      return progress(object(state.stats)[condition.key], target);
    case 'unique': {
      const allowed = idsFrom(condition.ids);
      const values = new Set(list(snapshot.telemetry[condition.key]));
      return progress([...allowed].filter((id) => values.has(id)).length, target);
    }
    case 'seals':
      return progress(state.seals, target);
    case 'trophies': {
      const owned = new Set(list(state.trophies));
      return progress(condition.ids.filter((id) => owned.has(id)).length, target);
    }
    case 'bossDrops': {
      const ownedItems = new Set([
        ...list(state.inventory), ...list(state.consumableBelt), ...Object.values(object(state.equipped)),
      ]);
      const current = Object.entries(snapshot.bossDrops).filter(([battleId, itemId]) => (
        object(state.bossDrops)[battleId]?.collected === true || ownedItems.has(itemId)
      )).length;
      return progress(current, target);
    }
    case 'cosmetics': {
      const owned = new Set(list(state.cosmeticsOwned));
      return progress([...snapshot.cosmeticIds].filter((id) => owned.has(id)).length, target);
    }
    case 'fateDeck':
      return progress(snapshot.fateCards.size, target);
    case 'sets':
      return progress([...snapshot.setTiers.values()].filter((tier) => tier >= condition.tier).length, target);
    case 'counter':
      return progress(snapshot.counters[condition.key], target);
    case 'puzzleFeat': {
      const source = condition.includeCustom
        ? new Set([...snapshot.campaignHonestPuzzleIds, ...snapshot.customHonestPuzzleIds])
        : snapshot.campaignHonestPuzzleIds;
      const ids = matchingIds(source, condition, snapshot, condition.includeCustom);
      const current = ids.filter((id) => snapshot.puzzleFeats.get(id)?.has(condition.feat)).length;
      return progress(current, target);
    }
    case 'battleFeat': {
      let ids = [...snapshot.battleFeats.keys()];
      if (condition.id) ids = ids.filter((id) => id === condition.id);
      return progress(ids.filter((id) => snapshot.battleFeats.get(id)?.has(condition.feat)).length, target);
    }
    case 'battleDefeats':
      return progress(Math.max(count(snapshot.counters.battleDefeats), snapshot.recordedDefeats), target);
    case 'custom': {
      const source = condition.mode === 'solved' ? snapshot.customHonestPuzzleIds : snapshot.customPuzzleIds;
      return progress(source.size, target);
    }
    case 'spider':
      return progress(Number(
        state.cheats?.spiderHat === true || list(state.cheats?.used).includes('ПАУЧОК'),
      ), target);
    case 'silence':
      return progress(snapshot.silentGuests.size, target);
    case 'meta': {
      const current = [...snapshot.unlockedAchievementIds].filter((id) => id !== definition.id).length;
      return progress(current, target);
    }
    default:
      throw new Error(`Неизвестное условие достижения: ${condition.kind || 'пусто'}`);
  }
}

export function achievementProgress(state, definition, ctx) {
  const context = ctx || definition.evaluationContext || {};
  const snapshot = context?.[SNAPSHOT] ? context : createAchievementSnapshot(state, context);
  return evaluate(snapshot, definition);
}

export function checkAchievements(state, definitions, ctx) {
  if (!state.achievements || typeof state.achievements !== 'object' || Array.isArray(state.achievements)) {
    state.achievements = {};
  }
  const catalog = list(definitions);
  const context = ctx || catalog[0]?.evaluationContext || {};
  const snapshot = context?.[SNAPSHOT] ? context : createAchievementSnapshot(state, {
    ...context,
    achievementIds: context.achievementIds || catalog.map((definition) => definition.id),
  });
  const ordered = [
    ...catalog.filter((definition) => definition.condition?.kind !== 'meta'),
    ...catalog.filter((definition) => definition.condition?.kind === 'meta'),
  ];
  const timestamp = Number.isFinite(context.now) ? context.now : Date.now();
  const fresh = [];
  for (const definition of ordered) {
    if (own(state.achievements, definition.id)) continue;
    if (!evaluate(snapshot, definition).done) continue;
    state.achievements[definition.id] = timestamp;
    snapshot.unlockedAchievementIds.add(definition.id);
    fresh.push(definition);
  }
  return fresh;
}
