import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, statSync, readFileSync } from 'node:fs';
import {
  ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES, ACHIEVEMENT_RARITIES,
  CATEGORY_LABELS, RARITY_LABELS, RARITY_POINTS, ACHIEVEMENT_TELEMETRY_KEYS,
  achievementProgress, checkAchievements,
} from '../src/data/achievements.js';
import {
  achievementProgress as coreProgress,
  checkAchievements as coreCheck,
  createAchievementSnapshot,
} from '../src/core/achievements.js';
import { ALL_PUZZLES, newGame, completePuzzle } from '../src/core/state.js';
import { createSpinPuzzle, parMoves } from '../src/core/spinPuzzle.js';
import { BATTLES } from '../src/data/battles.js';
import { ENEMY_BY_ID } from '../src/data/enemies.js';
import { STORY_GUESTS } from '../src/data/story.js';
import { GUESTS } from '../src/data/guests.js';
import { BREW_LEVEL_GUESTS } from '../src/data/brewGuests.js';
import { SEATING_PUZZLES } from '../src/data/puzzlesSeating.js';
import { FATE_CARDS, FATE_PUZZLES } from '../src/data/puzzlesFate.js';
import { ONBOARDING_GUIDE_SECTIONS } from '../src/data/onboarding.js';
import { BATTLE_LORE } from '../src/data/battleLore.js';
import { RECIPES } from '../src/data/recipes.js';
import { COMPANIONS, PETS, MERCENARIES } from '../src/data/crew.js';
import { TROPHIES, MINI_TROPHIES } from '../src/data/trophies.js';
import { BOSS_DROPS } from '../src/data/bossDrops.js';
import { COSMETIC_PACKS } from '../src/data/cosmetics.js';
import { SETS } from '../src/data/sets.js';
import { ITEMS } from '../src/data/items.js';

const byId = Object.fromEntries(ACHIEVEMENTS.map((definition) => [definition.id, definition]));
const levelsOf = (mechanic) => ALL_PUZZLES.filter((puzzle) => (puzzle.mechanic || 'mirror') === mechanic);
const memoryLevels = levelsOf('brew').filter((level) => level.hideRecipe);
const blindSpins = levelsOf('spin').filter((level) => level.goldRim === false);

function emptyState() {
  return {
    coins: 0,
    seals: 0,
    puzzlesDone: {},
    battlesDone: {},
    battleLoreSeen: {},
    bossDrops: {},
    customPuzzles: [],
    achievements: {},
    trophies: [],
    crew: [],
    squadCompanions: [],
    squadMercs: [],
    pet: null,
    inventory: [],
    consumableBelt: [],
    equipped: {},
    cosmeticsOwned: [],
    cosmeticsActive: [],
    onboarding: { guide: { seen: [] } },
    story: { step: 0, prologSeen: false, epilogSeen: false, guests: {}, pending: null },
    cheats: { used: [], spiderHat: false },
    stats: { puzzlesSolved: 0, battlesWon: 0, coinsEarned: 0, itemsCrafted: 0, itemsBought: 0, catPets: 0 },
    achievementStats: {
      version: 1,
      counters: {},
      puzzles: {},
      battles: {},
      daily: { days: [], currentStreak: 0, bestStreak: 0 },
      craftedRecipes: [],
      boughtItems: [],
      guestTopics: {},
      setTiers: {},
    },
  };
}

function honest(state, id, saved = {}) {
  state.puzzlesDone[id] = { moves: 1, hintsUsed: 1, ...saved };
}

function puzzleFeat(state, id, feat, saved = {}) {
  honest(state, id, saved);
  state.achievementStats.puzzles[id] = { solves: 1, skipped: false, feats: [feat] };
}

function battleFeat(state, id, feat, { victory = true, defeats = 0 } = {}) {
  if (victory) state.battlesDone[id] = { victories: 1 };
  state.achievementStats.battles[id] = { attempts: Math.max(1, defeats + Number(victory)), defeats, feats: [feat] };
}

function progress(state, id) {
  return achievementProgress(state, byId[id]);
}

function done(state, id) {
  return progress(state, id).done;
}

test('каталог: ровно 240 определений, точные разделы, редкости и уникальные русские тексты', () => {
  assert.equal(ACHIEVEMENTS.length, 240);
  assert.deepEqual(
    Object.fromEntries(Object.keys(ACHIEVEMENT_CATEGORIES).map((category) => [
      category,
      ACHIEVEMENTS.filter((definition) => definition.category === category).length,
    ])),
    { puzzles: 80, battles: 48, general: 20, story: 20, collections: 32, challenges: 30, special: 10 },
  );
  for (const field of ['id', 'name', 'desc']) {
    assert.equal(new Set(ACHIEVEMENTS.map((definition) => definition[field])).size, 240, `дубли ${field}`);
  }
  assert.deepEqual(Object.values(RARITY_POINTS), [10, 25, 50, 100, 250]);
  assert.deepEqual(Object.values(RARITY_LABELS), ['Обычное', 'Необычное', 'Редкое', 'Эпическое', 'Легендарное']);
  assert.deepEqual(Object.keys(ACHIEVEMENT_RARITIES), Object.keys(RARITY_LABELS));
  for (const [category, metadata] of Object.entries(ACHIEVEMENT_CATEGORIES)) {
    assert.equal(CATEGORY_LABELS[category], metadata.label);
  }
  const usedRarities = new Set();
  for (const definition of ACHIEVEMENTS) {
    assert.match(definition.id, /^[a-z][a-z0-9_]*$/);
    assert.match(definition.name, /[А-Яа-яЁё]/);
    assert.match(definition.desc, /[А-Яа-яЁё]/);
    assert.ok(ACHIEVEMENT_CATEGORIES[definition.category]);
    assert.ok(ACHIEVEMENT_RARITIES[definition.rarity]);
    assert.equal(typeof definition.secret, 'boolean');
    assert.equal(typeof definition.check, 'function');
    assert.equal(definition.check(emptyState(), {}), false);
    assert.ok(Number.isInteger(definition.target) && definition.target > 0);
    assert.ok(definition.condition && typeof definition.condition.kind === 'string');
    assert.equal(definition.categoryLabel, CATEGORY_LABELS[definition.category]);
    assert.equal(definition.variant.frame, definition.rarity);
    assert.ok(definition.variant.motif);
    assert.ok(Number.isInteger(definition.variant.stage) && definition.variant.stage >= 0);
    assert.ok(!Object.keys(definition).includes('evaluationContext'), 'контентный ctx не дублируется в JSON карточки');
    usedRarities.add(definition.rarity);
  }
  assert.deepEqual([...usedRarities].sort(), Object.keys(ACHIEVEMENT_RARITIES).sort());
  assert.ok(ACHIEVEMENTS.filter((definition) => definition.category === 'special').every((definition) => definition.secret));
});

test('все sourceArt — существующие локальные изображения, без ссылок на будущие WebP достижений', () => {
  for (const definition of ACHIEVEMENTS) {
    assert.match(definition.sourceArt, /^assets\/.+\.(?:jpg|png|webp)$/);
    assert.ok(!definition.sourceArt.startsWith('assets/achievements/'), definition.id);
    assert.ok(!/[\u{1f300}-\u{1faff}]/u.test(definition.sourceArt), definition.id);
    const url = new URL(`../${definition.sourceArt}`, import.meta.url);
    assert.ok(existsSync(url), `${definition.id}: ${definition.sourceArt}`);
    assert.ok(statSync(url).size > 0, definition.sourceArt);
  }
});

function webpDimensions(buffer) {
  assert.equal(buffer.toString('ascii', 0, 4), 'RIFF');
  assert.equal(buffer.toString('ascii', 8, 12), 'WEBP');
  const chunk = buffer.toString('ascii', 12, 16);
  if (chunk === 'VP8X') {
    return [buffer.readUIntLE(24, 3) + 1, buffer.readUIntLE(27, 3) + 1];
  }
  if (chunk === 'VP8 ') {
    assert.deepEqual([...buffer.subarray(23, 26)], [0x9d, 0x01, 0x2a]);
    return [buffer.readUIntLE(26, 2) & 0x3fff, buffer.readUIntLE(28, 2) & 0x3fff];
  }
  if (chunk === 'VP8L') {
    const b = buffer.subarray(21, 25);
    return [
      (b[0] | ((b[1] & 0x3f) << 8)) + 1,
      ((b[1] >> 6) | (b[2] << 2) | ((b[3] & 0x0f) << 10)) + 1,
    ];
  }
  throw new Error(`Неизвестный WebP chunk: ${chunk}`);
}

test('у каждого достижения есть настоящий локальный WebP 512×512, включая служебные обложки', () => {
  for (const id of [...ACHIEVEMENTS.map((definition) => definition.id), '_book', '_secret']) {
    const url = new URL(`../assets/achievements/${id}.webp`, import.meta.url);
    assert.ok(existsSync(url), `Нет медальона ${id}`);
    const buffer = readFileSync(url);
    assert.ok(buffer.length > 500, `Пустой медальон ${id}`);
    assert.deepEqual(webpDimensions(buffer), [512, 512], id);
  }
});

test('серии головоломок: 16×5, потолки долей и различные рубежи малых серий', () => {
  const types = [...new Set(ALL_PUZZLES.map((puzzle) => puzzle.mechanic || 'mirror'))];
  assert.equal(types.length, 16);
  for (const mechanic of types) {
    const series = ACHIEVEMENTS.filter((definition) => definition.category === 'puzzles' && definition.condition.mechanic === mechanic);
    const total = levelsOf(mechanic).length;
    assert.equal(series.length, 5, mechanic);
    assert.deepEqual(series.map((definition) => definition.target), [
      1, Math.ceil(total * 0.25), Math.ceil(total * 0.5), Math.ceil(total * 0.75), total,
    ], mechanic);
    assert.equal(new Set(series.map((definition) => definition.target)).size, 5, mechanic);
    assert.ok(series.every((definition) => definition.target <= total));
  }
  assert.equal(byId.meadow_master.condition.mechanic, 'mirror');
  assert.equal(byId.seek_master.condition.mechanic, 'seek');
  assert.equal(byId.meadow_master.target, 12);
  assert.equal(byId.seek_master.target, 14);
});

test('походы: 12×4, только настоящие ID и босс каждого мира', () => {
  const worlds = [...new Set(BATTLES.filter((battle) => !battle.wanted).map((battle) => battle.world))];
  const validBattles = new Set(BATTLES.map((battle) => battle.id));
  assert.equal(worlds.length, 12);
  for (const world of worlds) {
    const series = ACHIEVEMENTS.filter((definition) => definition.category === 'battles' && definition.variant.motif === world);
    const worldBattles = BATTLES.filter((battle) => !battle.wanted && battle.world === world);
    assert.equal(series.length, 4, world);
    assert.deepEqual(series.map((definition) => definition.target), [1, Math.ceil(worldBattles.length / 2), worldBattles.length, 1]);
    const bossEntry = series[3].condition.ids[0];
    const boss = BATTLES.find((battle) => battle.id === bossEntry);
    assert.ok(boss.enemies.some((entry) => ENEMY_BY_ID[typeof entry === 'string' ? entry : entry.id]?.boss), world);
    assert.deepEqual(series[2].condition.ids, worldBattles.map((battle) => battle.id));
  }
  for (const definition of ACHIEVEMENTS) {
    for (const id of definition.condition.kind === 'battles' ? definition.condition.ids || [] : []) {
      assert.ok(validBattles.has(id), `${definition.id}: ${id}`);
    }
    if (definition.condition.kind === 'battleFeat' && definition.condition.id) {
      assert.ok(validBattles.has(definition.condition.id), definition.id);
    }
  }
});

test('все 20 прежних ID сохранены, а реестр telemetry покрывает условия каталога', () => {
  const legacy = [
    'first_puzzle', 'ten_puzzles', 'meadow_master', 'half_campaign', 'all_puzzles',
    'first_battle', 'willow_down', 'keeper_down', 'time_down', 'fifty_battles', 'all_battles',
    'crew_five', 'first_craft', 'rich', 'seals_five', 'shopper', 'seek_master', 'cat_friend',
    'first_trophy', 'cabinet_full',
  ];
  assert.equal(legacy.length, 20);
  for (const id of legacy) assert.ok(byId[id], id);

  const counters = new Set(ACHIEVEMENTS.filter((definition) => definition.condition.kind === 'counter').map((definition) => definition.condition.key));
  counters.add('battleDefeats');
  assert.deepEqual([...counters].sort(), [...ACHIEVEMENT_TELEMETRY_KEYS.counters].sort());
  const puzzleFeats = new Set(ACHIEVEMENTS.filter((definition) => definition.condition.kind === 'puzzleFeat').map((definition) => definition.condition.feat));
  if (ACHIEVEMENTS.some((definition) => definition.condition.noHints)) puzzleFeats.add('no_hints');
  assert.deepEqual([...puzzleFeats].sort(), [...ACHIEVEMENT_TELEMETRY_KEYS.puzzleFeats].sort());
  const battleFeats = new Set(ACHIEVEMENTS.filter((definition) => definition.condition.kind === 'battleFeat').map((definition) => definition.condition.feat));
  assert.deepEqual([...battleFeats].sort(), [...ACHIEVEMENT_TELEMETRY_KEYS.battleFeats].sort());
});

test('все 30 испытаний и 10 особых условий из плана присутствуют явно', () => {
  const challenges = [
    'no_hints_10', 'no_hints_100', 'riddle_first_try', 'hang_perfect',
    'brew_flawless', 'brew_memory_first', 'brew_memory_all', 'fate_perfect',
    'gift_first_try', 'gift_third_try', 'tea_exact', 'candle_minimum',
    'spin_par_first', 'spin_par_25', 'spin_blind_all', 'seek_no_miss',
    'seating_first_serve', 'glass_no_hints_25', 'battle_no_damage',
    'boss_all_survive', 'battle_solo', 'boss_no_consumables', 'battle_one_hp',
    'merc_last_stand', 'battle_timeout', 'battle_defeats_10', 'battle_comeback',
    'boss_no_damage', 'full_party_crowd', 'boss_pity',
  ];
  const special = [
    'workshop_create', 'workshop_solve', 'bees_return', 'skip_return',
    'brew_recovery', 'gift_recovery', 'spider_secret', 'seasonal_style',
    'story_silence_all', 'achievement_meta',
  ];
  assert.deepEqual(
    ACHIEVEMENTS.filter((definition) => definition.category === 'challenges').map((definition) => definition.id).sort(),
    challenges.sort(),
  );
  assert.deepEqual(
    ACHIEVEMENTS.filter((definition) => definition.category === 'special').map((definition) => definition.id).sort(),
    special.sort(),
  );
});

test('чистое ядро получает контент через ctx и строит единый snapshot для проверки и прогресса', () => {
  const state = emptyState();
  state.puzzlesDone.a = {};
  state.puzzlesDone.custom = {};
  state.puzzlesDone.skipped = { skipped: true };
  const definitions = [
    { id: 'one', condition: { kind: 'puzzles' }, target: 1 },
    { id: 'both', condition: { kind: 'puzzles' }, target: 2 },
  ];
  const ctx = {
    puzzles: [{ id: 'a', mechanic: 'mirror' }, { id: 'b', mechanic: 'mirror' }, { id: 'skipped', mechanic: 'mirror' }],
    battles: [], achievementIds: definitions.map((definition) => definition.id),
  };
  const snapshot = createAchievementSnapshot(state, ctx);
  assert.deepEqual(coreProgress(state, definitions[0], snapshot), { current: 1, target: 1, done: true });
  assert.deepEqual(coreProgress(state, definitions[1], snapshot), { current: 1, target: 2, done: false });
  state.puzzlesDone.b = {};
  assert.equal(coreProgress(state, definitions[1], snapshot).current, 1, 'snapshot не перестраивается посреди sweep');
  const fresh = coreCheck(state, definitions, { ...ctx, now: 77 });
  assert.deepEqual(fresh.map((definition) => definition.id), ['one', 'both']);
  assert.equal(state.achievements.both, 77);
});

test('первое реальное решение использует общий прогресс и не выдаёт награду повторно', () => {
  const state = newGame();
  assert.equal(checkAchievements(state, { now: 10 }).length, 0);
  completePuzzle(state, 'md_01', { moves: 1, hintsUsed: 0 });
  const first = progress(state, 'first_puzzle');
  assert.deepEqual(first, { current: 1, target: 1, done: true });
  assert.deepEqual(coreProgress(state, byId.first_puzzle), first, 'двухаргументный вызов для UI тоже получает контент');
  assert.equal(byId.first_puzzle.check(state, {}), true);
  const fresh = checkAchievements(state, { now: 12345 });
  assert.ok(fresh.some((definition) => definition.id === 'first_puzzle'));
  assert.ok(fresh.some((definition) => definition.id === 'mirror_1'));
  assert.ok(fresh.every((definition) => state.achievements[definition.id] === 12345));
  const timestamps = { ...state.achievements };
  assert.deepEqual(checkAchievements(state, { now: 999 }), []);
  assert.deepEqual(state.achievements, timestamps);
});

test('честная кампания: уникальные ID, без пропусков, повторов, custom и неизвестных ключей', () => {
  const state = emptyState();
  state.stats.puzzlesSolved = 20;
  honest(state, 'md_01');
  honest(state, 'custom_extra');
  honest(state, 'unknown_old_level');
  state.customPuzzles.push({ id: 'custom_extra', mechanic: 'mirror', name: 'Свой свет' });
  state.puzzlesDone.md_02 = { skipped: true };
  assert.equal(progress(state, 'first_puzzle').current, 1);
  assert.equal(progress(state, 'ten_puzzles').current, 1);
  assert.equal(progress(state, 'mirror_1').current, 1);
  assert.equal(done(state, 'workshop_create'), true);
  assert.equal(done(state, 'workshop_solve'), true);
  assert.equal(done(state, 'all_puzzles'), false);
  honest(state, 'md_02');
  assert.equal(progress(state, 'ten_puzzles').current, 2);
  for (const puzzle of ALL_PUZZLES.slice(2, 10)) honest(state, puzzle.id);
  assert.equal(done(state, 'ten_puzzles'), true);
  const uniqueCount = progress(state, 'ten_puzzles').current;
  honest(state, 'md_01');
  assert.equal(progress(state, 'ten_puzzles').current, uniqueCount, 'повтор не добавляет второй уникальный уровень');
});

test('пропуски не открывают серии, знакомства и колоду; возврат требует сохранённого факта пропуска', () => {
  const state = emptyState();
  state.puzzlesDone.fate_01 = { skipped: true };
  state.puzzlesDone.sk_md_01 = { skipped: true };
  assert.equal(progress(state, 'seek_1').current, 0);
  assert.equal(progress(state, 'fate_deck_full').current, 0);
  assert.equal(progress(state, 'book_guests_10').current, 0);
  assert.equal(done(state, 'skip_return'), false);
  honest(state, 'fate_01');
  assert.equal(progress(state, 'fate_deck_full').current, FATE_PUZZLES[0].hand.length);
  assert.equal(progress(state, 'book_guests_10').current, 1);
  assert.equal(done(state, 'skip_return'), false, 'честное решение само по себе не доказывает старый пропуск');
  state.achievementStats.puzzles.fate_01 = { solves: 1, skipped: true, feats: ['skip_comeback'] };
  assert.equal(done(state, 'skip_return'), true);
});

test('старые timestamps и неизвестные ключи сохраняются, условия не отзывают полученное', () => {
  const state = emptyState();
  state.achievements = { seek_master: 12345, unknown_old_key: 777 };
  state.puzzlesDone.sk_md_01 = { skipped: true };
  const fresh = checkAchievements(state, { now: 999 });
  assert.equal(state.achievements.seek_master, 12345);
  assert.equal(state.achievements.unknown_old_key, 777);
  assert.ok(!fresh.some((definition) => definition.id === 'seek_master'));
  assert.equal(byId.seek_master.check(state, {}), false, 'check по-прежнему сообщает текущее условие');
});

test('мета-достижение открывается после последнего обычного в том же sweep', () => {
  const state = emptyState();
  for (const definition of ACHIEVEMENTS) {
    if (!['first_puzzle', 'achievement_meta'].includes(definition.id)) state.achievements[definition.id] = 10;
  }
  state.achievements.unknown_old_key = 20;
  honest(state, 'md_01');
  const fresh = checkAchievements(state, { now: 555 });
  assert.deepEqual(fresh.map((definition) => definition.id), ['first_puzzle', 'achievement_meta']);
  assert.equal(state.achievements.first_puzzle, 555);
  assert.equal(state.achievements.achievement_meta, 555);
  assert.equal(Object.keys(state.achievements).filter((id) => byId[id]).length, 240);
  assert.deepEqual(checkAchievements(state, { now: 556 }), []);

  const unknownOnly = emptyState();
  unknownOnly.achievements = Object.fromEntries(Array.from({ length: 500 }, (_, index) => [`old_${index}`, 1]));
  assert.equal(done(unknownOnly, 'achievement_meta'), false);
});

test('общие боевые серии считают только валидные уникальные победы, повторы — отдельно', () => {
  const state = emptyState();
  state.battlesDone.unknown_battle = { victories: 100 };
  assert.equal(done(state, 'first_battle'), false);
  state.battlesDone.bt_slimes = { victories: 1 };
  assert.equal(done(state, 'first_battle'), true);
  assert.equal(done(state, 'meadow_first'), true);
  for (const battle of BATTLES.slice(0, 50)) state.battlesDone[battle.id] = { victories: 1 };
  assert.equal(done(state, 'fifty_battles'), true);
  assert.equal(done(state, 'battle_unique_100'), false);
  state.stats.battlesWon = 250;
  assert.equal(done(state, 'battle_wins_100'), true);
  assert.equal(done(state, 'battle_wins_250'), true);
  assert.equal(done(state, 'battle_wins_500'), false);
  state.stats.puzzlesSolved = 1000;
  assert.equal(done(state, 'puzzle_solves_100'), true);
  assert.equal(done(state, 'puzzle_solves_500'), true);
  assert.equal(done(state, 'puzzle_solves_1000'), true);
});

test('daily: уникальные корректные даты, последний старый день доказывает только один заказ, streak не выдумывается', () => {
  const state = emptyState();
  state.achievementStats.daily.bestStreak = 99;
  state.achievementStats.daily.currentStreak = 99;
  assert.equal(done(state, 'daily_first'), false);
  state.lastDailyBonus = '2026-01-01';
  assert.equal(done(state, 'daily_first'), true);
  assert.equal(done(state, 'daily_10'), false);
  state.achievementStats.daily.days = [
    '2026-01-01', '2026-01-01', 'bad', '2026-02-30',
    ...Array.from({ length: 9 }, (_, index) => `2026-02-${String(index + 1).padStart(2, '0')}`),
  ];
  assert.equal(progress(state, 'daily_10').current, 10);
  assert.equal(done(state, 'daily_10'), true);
  state.achievementStats.daily.days = Array.from({ length: 30 }, (_, index) => `2026-03-${String(index + 1).padStart(2, '0')}`);
  state.achievementStats.daily.currentStreak = 0;
  state.achievementStats.daily.bestStreak = 0;
  assert.equal(done(state, 'daily_30'), true);
});

test('история: пролог, шаги, встречи духа, гости, свой человек, путеводитель и лор-сцены', () => {
  const state = emptyState();
  state.story.prologSeen = true;
  state.story.step = 10;
  assert.equal(done(state, 'story_prolog'), true);
  assert.equal(done(state, 'story_10'), true);
  state.story.step = 37;
  assert.equal(done(state, 'spirit_37'), false, 'номер шага без сцены не доказывает встречу');
  state.story.pending = { beat: true, guestId: 'spirit', puzzleId: 'md_01' };
  assert.equal(done(state, 'spirit_37'), true);
  state.story.step = 38;
  state.story.pending = null;
  assert.equal(done(state, 'spirit_37'), true);
  state.story.step = 74;
  state.story.pending = { beat: true, guestId: 'spirit', puzzleId: 'md_02' };
  assert.equal(done(state, 'spirit_74'), true);
  state.story.step = 100;
  state.story.pending = { beat: true, guestId: 'spirit', puzzleId: 'md_03' };
  assert.equal(done(state, 'spirit_100'), true);
  state.story.epilogSeen = true;
  assert.equal(done(state, 'story_epilog'), true);

  for (const id of STORY_GUESTS) state.story.guests[id] = { visits: 1, silenceShown: false };
  state.story.guests.spirit = { visits: 99, silenceShown: true };
  assert.equal(done(state, 'story_guests_10'), true);
  assert.equal(done(state, 'story_guests_35'), true);
  assert.equal(done(state, 'story_own_5'), false);
  for (const id of STORY_GUESTS.slice(0, 5)) state.story.guests[id].visits = 4;
  assert.equal(done(state, 'story_own_5'), true);
  for (const id of STORY_GUESTS) state.story.guests[id].visits = 4;
  assert.equal(done(state, 'story_own_35'), true);

  state.onboarding.guide.seen = [...ONBOARDING_GUIDE_SECTIONS.map((section) => section.id), 'unknown'];
  assert.equal(done(state, 'guide_complete'), true);
  for (const world of Object.keys(BATTLE_LORE)) {
    state.battleLoreSeen[`${world}:intro`] = true;
    state.battleLoreSeen[`${world}:outro`] = true;
  }
  state.battleLoreSeen['unknown:intro'] = true;
  assert.equal(done(state, 'battle_lore_all'), true);
});

test('гостевая книга: честные знакомства, уникальные темы, все гости варки и рассадок', () => {
  const state = emptyState();
  honest(state, 'fate_01');
  honest(state, 'brew_01');
  assert.ok(progress(state, 'book_guests_10').current >= 2);
  state.achievementStats.guestTopics.watchman = [0, 0, -1, 99, '1'];
  assert.equal(progress(state, 'topic_first').current, 1);
  assert.equal(done(state, 'topics_one'), false);
  state.achievementStats.guestTopics.watchman = [0, 1];
  assert.equal(done(state, 'topics_one'), true);
  for (const guest of GUESTS) state.achievementStats.guestTopics[guest.id] = [0, 1, 0, 99];
  assert.equal(progress(state, 'topics_all').current, GUESTS.length * 2);
  assert.equal(done(state, 'topics_all'), true);

  for (const guestId of new Set(Object.values(BREW_LEVEL_GUESTS))) {
    const levelId = Object.keys(BREW_LEVEL_GUESTS).find((id) => BREW_LEVEL_GUESTS[id] === guestId);
    honest(state, levelId);
  }
  assert.equal(done(state, 'brew_guests_all'), true);
  for (const guestId of new Set(SEATING_PUZZLES.flatMap((level) => level.guests))) {
    const level = SEATING_PUZZLES.find((entry) => entry.guests.includes(guestId));
    honest(state, level.id);
  }
  assert.equal(done(state, 'seating_guests_all'), true);
});

test('команда, крафт, покупки, доход, печати и рецепты используют надёжное состояние и уникальные ID', () => {
  const state = emptyState();
  const allCrew = [...COMPANIONS, ...PETS, ...MERCENARIES];
  state.crew = [...allCrew.slice(0, 5).map((member) => member.id), 'unknown'];
  assert.equal(done(state, 'crew_five'), true);
  assert.equal(done(state, 'crew_all'), false);
  state.crew = allCrew.map((member) => member.id);
  assert.equal(done(state, 'crew_all'), true);
  state.squadCompanions = COMPANIONS.slice(0, 3).map((member) => member.id);
  state.squadMercs = MERCENARIES.slice(0, 2).map((member) => member.id);
  state.pet = PETS[0].id;
  assert.equal(done(state, 'party_full'), true);

  state.stats.itemsCrafted = 100;
  state.stats.itemsBought = 100;
  state.stats.coinsEarned = 50000;
  state.seals = 45;
  for (const id of ['first_craft', 'craft_25', 'craft_100', 'shopper', 'purchases_100', 'rich', 'rich_50000', 'seals_five', 'seals_45']) {
    assert.equal(done(state, id), true, id);
  }
  state.achievementStats.craftedRecipes = [...RECIPES.map((recipe) => recipe.id), RECIPES[0].id, 'unknown'];
  assert.equal(done(state, 'recipes_all'), true);
});

test('трофеи, босс-находки, оформления и честно открытая колода', () => {
  const state = emptyState();
  state.trophies = [...TROPHIES.map((trophy) => trophy.id), 'unknown'];
  assert.equal(done(state, 'first_trophy'), true);
  assert.equal(done(state, 'cabinet_full'), true);
  assert.equal(done(state, 'trophies_16'), false);
  state.trophies.push(...MINI_TROPHIES.map((trophy) => trophy.id));
  assert.equal(done(state, 'wanted_trophies'), true);
  assert.equal(done(state, 'trophies_16'), true);

  const dropEntries = Object.entries(BOSS_DROPS);
  state.bossDrops[dropEntries[0][0]] = { collected: true };
  state.inventory.push(dropEntries[1][1].itemId);
  state.bossDrops.unknown = { collected: true };
  assert.equal(progress(state, 'boss_find_1').current, 2);
  assert.equal(done(state, 'boss_find_6'), false);
  for (const [battleId] of dropEntries) state.bossDrops[battleId] = { collected: true };
  assert.equal(done(state, 'boss_find_6'), true);
  assert.equal(done(state, 'boss_find_12'), true);

  state.cosmeticsOwned = [...COSMETIC_PACKS.map((pack) => pack.id), 'unknown'];
  assert.equal(done(state, 'cosmetic_1'), true);
  assert.equal(done(state, 'cosmetic_all'), true);
  for (const level of FATE_PUZZLES) honest(state, level.id);
  assert.equal(progress(state, 'fate_deck_full').current, Object.keys(FATE_CARDS).length);
  assert.equal(done(state, 'fate_deck_full'), true);
});

test('сеты учитывают текущую экипировку и исторический максимум; обмены, цели и кот накапливаются', () => {
  const state = emptyState();
  const master = ITEMS.filter((item) => item.set === 'master').slice(0, 9);
  assert.equal(master.length, 9);
  state.equipped = Object.fromEntries(master.map((item, index) => [`slot_${index}`, item.id]));
  assert.equal(done(state, 'set_first'), true);
  assert.equal(done(state, 'sets_all'), false);
  for (const id of Object.keys(SETS)) state.achievementStats.setTiers[id] = 9;
  assert.equal(done(state, 'sets_all'), true);
  state.achievementStats.counters.materialExchanges = 50;
  state.achievementStats.counters.savingsGoals = 10;
  state.stats.catPets = 100;
  for (const id of ['exchange_first', 'exchange_50', 'goal_first', 'goal_10', 'cat_friend', 'cat_100']) {
    assert.equal(done(state, id), true, id);
  }
});

test('отсутствие старых полей не является нулём подсказок; явный ноль и telemetry засчитываются один раз на уровень', () => {
  const state = emptyState();
  for (const puzzle of ALL_PUZZLES.slice(0, 9)) honest(state, puzzle.id, { hintsUsed: 0 });
  honest(state, ALL_PUZZLES[9].id, { hintsUsed: undefined });
  delete state.puzzlesDone[ALL_PUZZLES[9].id].hintsUsed;
  assert.equal(progress(state, 'no_hints_10').current, 9);
  assert.equal(done(state, 'no_hints_10'), false);
  state.achievementStats.puzzles[ALL_PUZZLES[9].id] = { solves: 1, skipped: false, feats: ['no_hints'] };
  assert.equal(done(state, 'no_hints_10'), true);
  state.achievementStats.puzzles[ALL_PUZZLES[9].id].feats.push('no_hints');
  assert.equal(progress(state, 'no_hints_10').current, 10);
  for (const puzzle of ALL_PUZZLES.slice(10, 100)) honest(state, puzzle.id, { hintsUsed: 0 });
  assert.equal(done(state, 'no_hints_100'), true);

  const glass = emptyState();
  for (const level of levelsOf('glass').slice(0, 25)) honest(glass, level.id, { hintsUsed: 0 });
  assert.equal(done(glass, 'glass_no_hints_25'), true);
});

test('все одиночные головоломочные feats требуют явной записи и привязаны к реальному уровню', () => {
  const cases = [
    ['riddle_first_try', 'riddle_first_try', 'bk_01'],
    ['hang_perfect', 'hang_perfect', 'bk_06'],
    ['brew_flawless', 'brew_flawless', 'brew_01'],
    ['brew_memory_first', 'brew_memory', memoryLevels[0].id],
    ['fate_perfect', 'fate_perfect', 'fate_01'],
    ['gift_first_try', 'gift_first_try', 'gift_01'],
    ['gift_third_try', 'gift_third_try', 'gift_01'],
    ['tea_exact', 'tea_exact', 'tea_01'],
    ['candle_minimum', 'candle_minimum', 'cd_01'],
    ['spin_par_first', 'spin_par', 'sp_01'],
    ['seek_no_miss', 'seek_no_miss', 'sk_md_01'],
    ['seating_first_serve', 'seating_first_serve', 'seat_01'],
  ];
  for (const [achievementId, feat, levelId] of cases) {
    const missing = emptyState();
    honest(missing, levelId);
    assert.equal(done(missing, achievementId), false, `${achievementId}: нет доказательства из старого сейва`);
    const state = emptyState();
    puzzleFeat(state, levelId, feat);
    assert.equal(done(state, achievementId), true, achievementId);
  }
});

test('сохранённые точные moves восстанавливают только доказуемый spin par, не нулевую заглушку', () => {
  const level = levelsOf('spin')[0];
  const par = parMoves(createSpinPuzzle(level));
  assert.ok(par > 0);
  const state = emptyState();
  honest(state, level.id, { moves: par, hintsUsed: 0 });
  assert.equal(done(state, 'spin_par_first'), true);
  const zero = emptyState();
  honest(zero, level.id, { moves: 0, hintsUsed: 0 });
  assert.equal(done(zero, 'spin_par_first'), false);
  const excess = emptyState();
  honest(excess, level.id, { moves: par + 1, hintsUsed: 0 });
  assert.equal(done(excess, 'spin_par_first'), false);
});

test('многоуровневые испытания: 25 точных гобеленов, 45 memory-рецептов и 36 слепых сборок', () => {
  const spins = emptyState();
  for (const level of levelsOf('spin').slice(0, 25)) puzzleFeat(spins, level.id, 'spin_par');
  assert.equal(done(spins, 'spin_par_25'), true);

  const brew = emptyState();
  assert.equal(memoryLevels.length, 45);
  for (const level of memoryLevels.slice(0, 44)) puzzleFeat(brew, level.id, 'brew_memory');
  assert.equal(progress(brew, 'brew_memory_all').current, 44);
  assert.equal(done(brew, 'brew_memory_all'), false);
  puzzleFeat(brew, memoryLevels[44].id, 'brew_memory');
  assert.equal(done(brew, 'brew_memory_all'), true);

  const blind = emptyState();
  assert.equal(blindSpins.length, 36);
  for (const level of blindSpins) honest(blind, level.id);
  assert.equal(done(blind, 'spin_blind_all'), true);
  blind.puzzlesDone[blindSpins[0].id] = { skipped: true };
  assert.equal(done(blind, 'spin_blind_all'), false);
});

test('все боевые feats читают компактные записи настоящих боёв, без ретроспекции по HP', () => {
  const cases = [
    ['battle_no_damage', 'battle_no_damage', 'bt_slimes'],
    ['boss_all_survive', 'boss_all_survive', 'bt_boss_willow'],
    ['battle_solo', 'battle_solo', 'bt_slimes'],
    ['boss_no_consumables', 'boss_no_consumables', 'bt_boss_willow'],
    ['battle_one_hp', 'battle_one_hp', 'bt_slimes'],
    ['merc_last_stand', 'merc_last_stand', 'bt_slimes'],
    ['battle_comeback', 'battle_comeback', 'bt_slimes'],
    ['boss_no_damage', 'boss_no_damage', 'bt_boss_willow'],
    ['full_party_crowd', 'full_party_crowd', 'meadow_crowd_6'],
    ['boss_pity', 'boss_pity', 'bt_boss_willow'],
  ];
  for (const [achievementId, feat, battleId] of cases) {
    const missing = emptyState();
    missing.battlesDone[battleId] = { victories: 1 };
    assert.equal(done(missing, achievementId), false, achievementId);
    const state = emptyState();
    battleFeat(state, battleId, feat, { defeats: feat === 'battle_comeback' ? 1 : 0 });
    assert.equal(done(state, achievementId), true, achievementId);
  }
  const timeout = emptyState();
  battleFeat(timeout, 'bt_slimes', 'timeout', { victory: false, defeats: 1 });
  assert.equal(done(timeout, 'battle_timeout'), true);
  assert.equal(done(timeout, 'first_battle'), false, 'timeout не считается победой');
});

test('поражения суммируются только по настоящим боям; blocked/practice без записи ничего не доказывают', () => {
  const state = emptyState();
  state.achievementStats.battles.unknown = { attempts: 100, defeats: 100, feats: ['timeout'] };
  assert.equal(done(state, 'battle_defeats_10'), false);
  assert.equal(done(state, 'battle_timeout'), false);
  for (const battle of BATTLES.slice(0, 10)) {
    state.achievementStats.battles[battle.id] = { attempts: 1, defeats: 1, feats: [] };
  }
  assert.equal(done(state, 'battle_defeats_10'), true);
  state.achievementStats.counters.battleDefeats = 20;
  assert.equal(progress(state, 'battle_defeats_10').current, 20);

  const noRecord = emptyState();
  assert.deepEqual(checkAchievements(noRecord, { now: 1 }), []);
  assert.equal(done(noRecord, 'battle_no_damage'), false);
  assert.equal(done(noRecord, 'boss_pity'), false);
});

test('особые возвращения, пасхалка, сезон и реплики о молчании', () => {
  const state = emptyState();
  battleFeat(state, 'bt_bees', 'battle_comeback', { defeats: 1 });
  assert.equal(done(state, 'bees_return'), true);
  puzzleFeat(state, 'brew_01', 'brew_recovery');
  puzzleFeat(state, 'gift_01', 'gift_recovery');
  assert.equal(done(state, 'brew_recovery'), true);
  assert.equal(done(state, 'gift_recovery'), true);
  state.cheats.used.push('ПАУЧОК');
  state.cheats.spiderHat = false;
  assert.equal(done(state, 'spider_secret'), true);
  state.achievementStats.counters.seasonalCosmeticSelections = 1;
  assert.equal(done(state, 'seasonal_style'), true);
  for (const id of STORY_GUESTS) state.story.guests[id] = { visits: 3, silenceShown: true };
  state.story.guests.spirit = { visits: 99, silenceShown: true };
  assert.equal(done(state, 'story_silence_all'), true);
});
