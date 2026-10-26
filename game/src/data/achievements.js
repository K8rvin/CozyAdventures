import { ALL_PUZZLES } from '../core/state.js';
import {
  achievementProgress as evaluateAchievement,
  checkAchievements as sweepAchievements,
} from '../core/achievements.js';
import { createSpinPuzzle, parMoves } from '../core/spinPuzzle.js';
import { BATTLES } from './battles.js';
import { ENEMY_BY_ID } from './enemies.js';
import { STORY_GUESTS } from './story.js';
import { GUESTS } from './guests.js';
import { BREW_LEVEL_GUESTS } from './brewGuests.js';
import { SEATING_PUZZLES } from './puzzlesSeating.js';
import { FATE_CARDS, FATE_PUZZLES } from './puzzlesFate.js';
import { ONBOARDING_GUIDE_SECTIONS } from './onboarding.js';
import { BATTLE_LORE } from './battleLore.js';
import { RECIPES } from './recipes.js';
import { COMPANIONS, PETS, MERCENARIES } from './crew.js';
import { TROPHIES, MINI_TROPHIES } from './trophies.js';
import { BOSS_DROPS } from './bossDrops.js';
import { COSMETIC_PACKS } from './cosmetics.js';
import { SETS } from './sets.js';
import { ITEMS } from './items.js';

export const ACHIEVEMENT_CATEGORIES = Object.freeze({
  puzzles: { label: 'Головоломки' },
  battles: { label: 'Походы' },
  general: { label: 'Общие свершения' },
  story: { label: 'История и гости' },
  collections: { label: 'Лавка и коллекции' },
  challenges: { label: 'Испытания' },
  special: { label: 'Особые и секретные' },
});

export const ACHIEVEMENT_RARITIES = Object.freeze({
  common: { label: 'Обычное', points: 10 },
  uncommon: { label: 'Необычное', points: 25 },
  rare: { label: 'Редкое', points: 50 },
  epic: { label: 'Эпическое', points: 100 },
  legendary: { label: 'Легендарное', points: 250 },
});

export const CATEGORY_LABELS = Object.freeze(
  Object.fromEntries(Object.entries(ACHIEVEMENT_CATEGORIES).map(([id, value]) => [id, value.label])),
);
export const RARITY_LABELS = Object.freeze(
  Object.fromEntries(Object.entries(ACHIEVEMENT_RARITIES).map(([id, value]) => [id, value.label])),
);
export const RARITY_POINTS = Object.freeze(
  Object.fromEntries(Object.entries(ACHIEVEMENT_RARITIES).map(([id, value]) => [id, value.points])),
);

export const ACHIEVEMENT_TELEMETRY_KEYS = Object.freeze({
  counters: Object.freeze([
    'materialExchanges',
    'savingsGoals',
    'battleDefeats',
    'seasonalCosmeticSelections',
  ]),
  puzzleFeats: Object.freeze([
    'no_hints',
    'skip_comeback',
    'riddle_first_try',
    'hang_perfect',
    'brew_flawless',
    'brew_memory',
    'brew_recovery',
    'fate_perfect',
    'gift_first_try',
    'gift_third_try',
    'gift_recovery',
    'tea_exact',
    'candle_minimum',
    'spin_par',
    'seek_no_miss',
    'seating_first_serve',
  ]),
  battleFeats: Object.freeze([
    'timeout',
    'battle_comeback',
    'battle_no_damage',
    'boss_no_damage',
    'boss_all_survive',
    'battle_solo',
    'boss_no_consumables',
    'battle_one_hp',
    'merc_last_stand',
    'full_party_crowd',
    'boss_pity',
  ]),
});

const ART = {
  campaign: 'assets/glass/glass_firstday_web.jpg',
  battle: 'assets/battle/battle_bg_crossroads_web.jpg',
  daily: 'assets/glass/glass_tea_dawn_web.jpg',
  story: 'assets/fate/guest_spirit_dark_web.jpg',
  guests: 'assets/fate/guest_owl_web.jpg',
  crew: 'assets/glass/glass_hearth_web.jpg',
  craft: 'assets/glass/glass_forge_web.jpg',
  recipes: 'assets/glass/glass_recipes_web.jpg',
  market: 'assets/hub/town_market_v2_web.jpg',
  coins: 'assets/gift/souv_abacus_web.jpg',
  seals: 'assets/gift/souv_seal_web.jpg',
  trophy: 'assets/trophies/tro_willow_branch.png',
  wanted: 'assets/trophies/tro_mini_bee.png',
  bossDrop: 'assets/items/shd_willow_vow_web.jpg',
  cosmetics: 'assets/cosmetics/lavka_pack_hearth_web.jpg',
  spring: 'assets/cosmetics/lavka_pack_spring_web.jpg',
  fate: 'assets/puzzle_cards/pc_fate_web.jpg',
  goals: 'assets/glass/glass_shop_web.jpg',
  cat: 'assets/fate/guest_cat_web.jpg',
  knight: 'assets/battle/units/knight_idle_web.png',
  merc: 'assets/battle/units/merc_archer_idle_web.png',
  boss: 'assets/battle/units/boss_willow_idle_web.png',
  bees: 'assets/battle/units/bee_wild_idle_web.png',
  spider: 'assets/fate/guest_spider_web.jpg',
  cabinet: 'assets/hub/trophy_room_v2_web.jpg',
  exchange: 'assets/gift/souv_prism_web.jpg',
};

const definitions = [];

function add({
  id, name, desc, category, rarity = 'common', secret = false,
  condition, target, sourceArt, motif, rank = 1,
}) {
  const definition = {
    id, name, desc, category, categoryLabel: ACHIEVEMENT_CATEGORIES[category].label,
    rarity, secret, condition, target, sourceArt,
    variant: { frame: rarity, motif, stage: rank - 1 },
  };
  definition.check = (state, ctx = {}) => achievementProgress(state, definition, ctx).done;
  definitions.push(definition);
  return definition;
}

function plural(value, forms) {
  const n = Math.abs(value) % 100;
  const last = n % 10;
  if (n > 10 && n < 20) return forms[2];
  if (last === 1) return forms[0];
  if (last > 1 && last < 5) return forms[1];
  return forms[2];
}

const LEVEL_FORMS = ['уровень', 'уровня', 'уровней'];
const PUZZLE_TYPES = [
  {
    id: 'mirror', label: 'Свет и фонарики', art: 'assets/puzzle_cards/pc_mirror_web.jpg',
    names: ['Первая искра', 'Свет на полках', 'Лучи над опушкой', 'Фонарный мастер', 'Хозяин опушки'],
  },
  {
    id: 'shelf', label: 'Полки и товары', art: 'assets/puzzle_cards/pc_shelf_web.jpg',
    names: ['Первый товар на месте', 'Полки в порядке', 'Соседи помирились', 'Завсегдатай полок', 'Хранитель витрины'],
  },
  {
    id: 'riddle', label: 'Загадки Хранителя', art: 'assets/puzzle_cards/pc_riddle_web.jpg',
    names: ['Первое слово Хранителя', 'Страница народных загадок', 'Полкниги мудрости', 'Собеседник Хранителя', 'Все ответы Хранителя'],
  },
  {
    id: 'hang', label: 'Строки при свече', art: 'assets/puzzle_cards/pc_hang_web.jpg',
    names: ['Первая строка при свече', 'Четверть восстановленной книги', 'Половина ночных строк', 'Почти целая рукопись', 'Летописец свечи'],
  },
  {
    id: 'seek', label: 'Поиск предметов', art: 'assets/puzzle_cards/pc_seek_web.jpg',
    names: ['Первая находка', 'Глаз на мелочи', 'Половина потерянных вещей', 'Следопыт лавки', 'Орлиный глаз'],
  },
  {
    id: 'path', label: 'Тропинки', art: 'assets/puzzle_cards/pc_path_web.jpg',
    names: ['Первая тропинка домой', 'Знакомые перепутья', 'Половина лесных дорог', 'Проводник зверьков', 'Хозяин всех тропинок'],
  },
  {
    id: 'tea', label: 'Чай для путника', art: 'assets/puzzle_cards/pc_tea_web.jpg',
    names: ['Первая чашка путнику', 'Травяная палитра', 'Половина чайной книги', 'Мастер цвета и тепла', 'Чайный мастер перекрёстка'],
  },
  {
    id: 'mech', label: 'Механизмы', art: 'assets/puzzle_cards/pc_mech_web.jpg',
    names: ['Первая шестерёнка', 'Мастерская оживает', 'Половина хитрых механизмов', 'Настройщик лавки', 'Владыка шестерёнок'],
  },
  {
    id: 'candle', label: 'Свечи и духи', art: 'assets/puzzle_cards/pc_candle_web.jpg',
    names: ['Первая свеча для духов', 'Круг тёплого света', 'Половина духовных огней', 'Хранитель фитилей', 'Мир свечей и духов'],
  },
  {
    id: 'flow', label: 'Потоки покупателей', art: 'assets/puzzle_cards/pc_flow_web.jpg',
    names: ['Первый поток гостей', 'Прилавок без толпы', 'Половина людских рек', 'Распорядитель потоков', 'Хозяин людских рек'],
  },
  {
    id: 'brew', label: 'Варка зелий', art: 'assets/puzzle_cards/pc_brew_web.jpg',
    names: ['Первое зелье по книге', 'Котёл полон рецептов', 'Половина алхимической книги', 'Почти мастер зелий', 'Хранитель книги варки'],
  },
  {
    id: 'fate', label: 'Карты судьбы', art: 'assets/puzzle_cards/pc_fate_web.jpg',
    names: ['Первый расклад судьбы', 'Карты легли по кругу', 'Половина предсказаний', 'Собеседник судьбы', 'Полная книга раскладов'],
  },
  {
    id: 'glass', label: 'Витраж миров', art: 'assets/puzzle_cards/pc_glass_web.jpg',
    names: ['Первый осколок мира', 'Витражное созвездие', 'Половина окон миров', 'Стекольщик перекрёстка', 'Все витражи миров'],
  },
  {
    id: 'spin', label: 'Гобелены ветров', art: 'assets/puzzle_cards/pc_spin_web.jpg',
    names: ['Первый лоскут по узору', 'Гобелены слушаются', 'Половина вышитых ветров', 'Почти целый гобелен', 'Мастер всех гобеленов'],
  },
  {
    id: 'gift', label: 'Подарок для гостя', art: 'assets/puzzle_cards/pc_gift_web.jpg',
    names: ['Первый верный подарок', 'Витрина добрых знаков', 'Половина подарочных историй', 'Знаток сердечных мелочей', 'Мастер всех подарков'],
  },
  {
    id: 'seating', label: 'Гости за чайным столом', art: 'assets/puzzle_cards/pc_seating_web.jpg',
    names: ['Первый гость за столом', 'Чайная компания растёт', 'Половина чайных рассадок', 'Хозяин застолья', 'Мастер чайного этикета'],
  },
];

const SERIES_RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
const LEGACY_TYPE_FINAL = { mirror: 'meadow_master', seek: 'seek_master' };

for (const type of PUZZLE_TYPES) {
  const levels = ALL_PUZZLES.filter((puzzle) => (puzzle.mechanic || 'mirror') === type.id);
  const targets = [1, Math.ceil(levels.length * 0.25), Math.ceil(levels.length * 0.5), Math.ceil(levels.length * 0.75), levels.length];
  const descriptions = [
    `Честно решить первый уровень раздела «${type.label}». Пропуск не заменяет решение.`,
    `Честно решить ${targets[1]} ${plural(targets[1], LEVEL_FORMS)} раздела «${type.label}» — его первую четверть.`,
    `Честно решить ${targets[2]} ${plural(targets[2], LEVEL_FORMS)} раздела «${type.label}» — половину серии без повторов.`,
    `Честно решить ${targets[3]} ${plural(targets[3], LEVEL_FORMS)} раздела «${type.label}» — три четверти серии.`,
    `Честно решить все ${targets[4]} ${plural(targets[4], LEVEL_FORMS)} раздела «${type.label}»; пропуски не входят в полную серию.`,
  ];
  for (let index = 0; index < 5; index += 1) {
    add({
      id: index === 4 ? LEGACY_TYPE_FINAL[type.id] || `${type.id}_100` : `${type.id}_${[1, 25, 50, 75][index]}`,
      name: type.names[index],
      desc: descriptions[index],
      category: 'puzzles', rarity: SERIES_RARITIES[index],
      condition: { kind: 'puzzles', mechanic: type.id }, target: targets[index],
      sourceArt: type.art, motif: type.id, rank: index + 1,
    });
  }
}

const WORLD_INFO = {
  meadow: { label: 'Тихая опушка', names: ['Первый шаг по опушке', 'Половина лесной тропы', 'Вся тропа под ивой', 'Падение ивы'] },
  town: { label: 'Средневековый дворик', names: ['Двор открывает ворота', 'Половина городской вахты', 'Весь двор под защитой', 'Капитан сменил вахту'] },
  attic: { label: 'Книжный чердак', names: ['Первый шорох чердака', 'Половина пыльного архива', 'Все страницы чердака', 'Конец истории'] },
  crossroads: { label: 'Экспедиции перекрёстка', names: ['На перекрёстной тропе', 'Половина смешанных дорог', 'Все экспедиции перекрёстка', 'Звёздный страж повержен'] },
  nm: { label: 'Ночной рынок', names: ['Первый фонарь рынка', 'Половина ночных прилавков', 'Весь ночной рынок', 'Маска ночного хозяина'] },
  sw: { label: 'Сказочные топи', names: ['Первый след в топи', 'Половина болотной тропы', 'Все сказочные топи', 'Хозяйка топей отступила'] },
  sf: { label: 'Звёздная ярмарка', names: ['Первый билет ярмарки', 'Половина звёздного шатра', 'Вся звёздная ярмарка', 'Чемпион снял корону'] },
  cr: { label: 'Хрустальные горы', names: ['Первый хрустальный перевал', 'Половина кварцевой тропы', 'Все хрустальные горы', 'Древний дракон уснул'] },
  ash: { label: 'Пепельные степи', names: ['Первый шаг по пеплу', 'Половина пепельной степи', 'Все пепельные степи', 'Хан бурь отступил'] },
  jade: { label: 'Нефритовый сад', names: ['Первый лист нефритового сада', 'Половина нефритовой аллеи', 'Весь нефритовый сад', 'Дракон сада склонился'] },
  deep: { label: 'Глубоководный грот', names: ['Первый нырок в грот', 'Половина глубоководной тропы', 'Весь глубоководный грот', 'Владычица глубин отступила'] },
  mist: { label: 'Мир за гранью времени', names: ['Первый час за гранью', 'Половина дороги времени', 'Все миры за гранью', 'Времени больше нет'] },
};
const LEGACY_BOSS = { meadow: 'willow_down', attic: 'keeper_down', mist: 'time_down' };
const WORLD_TROPHY_ART = {
  meadow: 'willow_branch', town: 'captain_medal', attic: 'keeper_quill',
  crossroads: 'star_shard', nm: 'nm_mask', sw: 'sw_basket', sf: 'sf_cup',
  cr: 'cr_scale', ash: 'ash_helm', jade: 'jade_fan', deep: 'deep_pearl', mist: 'mist_gear',
};
const WORLD_ORDER = [...new Set(BATTLES.filter((battle) => !battle.wanted).map((battle) => battle.world))];

for (const world of WORLD_ORDER) {
  const info = WORLD_INFO[world];
  const battles = BATTLES.filter((battle) => !battle.wanted && battle.world === world);
  const ids = battles.map((battle) => battle.id);
  const boss = battles.find((battle) => battle.enemies.some((entry) => ENEMY_BY_ID[typeof entry === 'string' ? entry : entry.id]?.boss));
  if (!info || !boss) throw new Error(`Не размечен мир достижений: ${world}`);
  const targets = [1, Math.ceil(ids.length / 2), ids.length, 1];
  const descriptions = [
    `Победить в первом походе мира «${info.label}»; розыскные листы для этого не нужны.`,
    `Победить в ${targets[1]} разных походах мира «${info.label}» — пройти половину его дороги.`,
    `Победить во всех ${targets[2]} походах мира «${info.label}», не заменяя победы розыскными боями.`,
    `Победить в бою «${boss.name}» и завершить главное испытание мира «${info.label}».`,
  ];
  for (let index = 0; index < 4; index += 1) {
    add({
      id: index === 3
        ? LEGACY_BOSS[world] || `${world}_boss`
        : `${world}_${['first', 'half', 'complete'][index]}`,
      name: info.names[index], desc: descriptions[index], category: 'battles',
      rarity: ['common', 'uncommon', 'epic', index === 3 && world === 'mist' ? 'legendary' : 'rare'][index],
      condition: { kind: 'battles', ids: index === 3 ? [boss.id] : ids }, target: targets[index],
      sourceArt: index === 3
        ? `assets/trophies/tro_${WORLD_TROPHY_ART[world]}.png`
        : `assets/battle/battle_bg_${world}_web.jpg`,
      motif: world, rank: index + 1,
    });
  }
}

const puzzleTotal = ALL_PUZZLES.length;
const puzzleMilestones = [
  ['first_puzzle', 'Первая загадка', 'Честно решить первую головоломку большой книги лавки.', 1, 'common'],
  ['ten_puzzles', 'Десятка фонарей', 'Честно решить десять разных головоломок из любых разделов.', 10, 'common'],
  ['quarter_campaign', 'Четверть большой книги', `Честно решить ${Math.ceil(puzzleTotal / 4)} разных головоломок — четверть всей кампании.`, Math.ceil(puzzleTotal / 4), 'rare'],
  ['half_campaign', 'Половина пути', `Честно решить ${Math.ceil(puzzleTotal / 2)} разных головоломок — половину всей кампании.`, Math.ceil(puzzleTotal / 2), 'epic'],
  ['three_quarter_campaign', 'Три четверти пути', `Честно решить ${Math.ceil(puzzleTotal * 0.75)} разных головоломок — три четверти кампании.`, Math.ceil(puzzleTotal * 0.75), 'epic'],
  ['all_puzzles', 'Мастер загадок', `Честно решить все ${puzzleTotal} головоломок кампании без учёта пропусков и уровней Мастерской.`, puzzleTotal, 'legendary'],
];
for (const [id, name, desc, target, rarity] of puzzleMilestones) {
  add({ id, name, desc, category: 'general', rarity, condition: { kind: 'puzzles' }, target, sourceArt: ART.campaign, motif: 'campaign', rank: target === 1 ? 1 : target === puzzleTotal ? 5 : 3 });
}

for (const [target, name, desc, rarity] of [
  [100, 'Сто возвращений к загадкам', 'Решить головоломки сто раз с учётом честных повторов.', 'uncommon'],
  [500, 'Пятьсот решённых дел', 'Решить головоломки пятьсот раз; каждая честная повторная попытка тоже идёт в счёт.', 'rare'],
  [1000, 'Тысяча уютных побед', 'Совершить тысячу честных решений головоломок, включая повторы любимых уровней.', 'legendary'],
]) {
  add({ id: `puzzle_solves_${target}`, name, desc, category: 'general', rarity, condition: { kind: 'puzzleSolves' }, target, sourceArt: ART.campaign, motif: 'repeat-puzzles', rank: target === 1000 ? 5 : 3 });
}

for (const [id, name, desc, target, rarity] of [
  ['first_battle', 'Первый поход', 'Победить в первом настоящем бою из боевого каталога.', 1, 'common'],
  ['fifty_battles', 'Полсотни побед', 'Победить в пятидесяти разных боях, включая розыскные.', 50, 'uncommon'],
  ['battle_unique_100', 'Сто боёв в летописи', 'Победить в ста разных боях боевого каталога.', 100, 'rare'],
  ['battle_unique_200', 'Двести дорог позади', 'Победить в двухстах разных боях и оставить позади двести опасных дорог.', 200, 'epic'],
  ['all_battles', 'Покоритель миров', `Победить во всех ${BATTLES.length} боях каталога, включая четыре розыскных листа.`, BATTLES.length, 'legendary'],
]) {
  add({ id, name, desc, category: 'general', rarity, condition: { kind: 'battles' }, target, sourceArt: ART.battle, motif: 'campaign-battles', rank: target === 240 ? 5 : 3 });
}

for (const [target, name, desc, rarity] of [
  [100, 'Сто победных возвращений', 'Одержать сто настоящих побед с учётом повторных походов.', 'uncommon'],
  [250, 'Двести пятьдесят побед', 'Одержать двести пятьдесят настоящих побед; тренировки не учитываются.', 'rare'],
  [500, 'Пятьсот побед ради лавки', 'Одержать пятьсот настоящих побед ради спокойствия лавки и её гостей.', 'legendary'],
]) {
  add({ id: `battle_wins_${target}`, name, desc, category: 'general', rarity, condition: { kind: 'battleWins' }, target, sourceArt: ART.battle, motif: 'repeat-battles', rank: target === 500 ? 5 : 3 });
}

for (const [id, name, desc, target, rarity] of [
  ['daily_first', 'Заказ на сегодня', 'Выполнить первый заказ дня и записать его дату в книгу.', 1, 'common'],
  ['daily_10', 'Десять дней особых заказов', 'Выполнить заказ дня в десять разных календарных дней.', 10, 'rare'],
  ['daily_30', 'Тридцать дней заботы', 'Выполнить заказ дня в тридцать разных календарных дней; необязательно подряд.', 30, 'epic'],
]) {
  add({ id, name, desc, category: 'general', rarity, condition: { kind: 'daily' }, target, sourceArt: ART.daily, motif: 'daily', rank: target === 30 ? 4 : 2 });
}

const storyDefinitions = [
  ['story_prolog', 'Ключи от лавки', 'Послушать пролог и принять ключи от лавки на перекрёстке миров.', { kind: 'storyFlag', flag: 'prologSeen' }, 1, 'common', ART.story],
  ['story_10', 'Десять страниц истории', 'Выполнить десять заданий режима истории.', { kind: 'storyStep' }, 10, 'uncommon', ART.story],
  ['spirit_37', 'Дух на пороге дома', 'Увидеть особую встречу с духом на тридцать седьмом шаге истории.', { kind: 'storyBeat', step: 37 }, 1, 'rare', ART.story],
  ['spirit_74', 'Дух среди старых друзей', 'Увидеть вторую особую встречу с духом на семьдесят четвёртом шаге истории.', { kind: 'storyBeat', step: 74 }, 1, 'rare', ART.story],
  ['spirit_100', 'Сто шагов с духом', 'Увидеть встречу с духом на сотом шаге истории.', { kind: 'storyBeat', step: 100 }, 1, 'epic', ART.story],
  ['story_epilog', 'Окно не погаснет', 'Дойти до эпилога истории и услышать последние слова духа и кота.', { kind: 'storyFlag', flag: 'epilogSeen' }, 1, 'legendary', ART.story],
  ['story_guests_10', 'Десять знакомых по истории', 'Встретить десять обычных гостей круга истории.', { kind: 'storyGuests', visits: 1 }, 10, 'common', ART.guests],
  ['story_guests_35', 'Весь круг гостей', 'Встретить всех тридцать пять обычных гостей круга истории.', { kind: 'storyGuests', visits: 1 }, STORY_GUESTS.length, 'epic', ART.guests],
  ['story_own_5', 'Пятеро своих', 'Достичь статуса «Свой человек» у пяти гостей истории.', { kind: 'storyGuests', visits: 4 }, 5, 'rare', ART.guests],
  ['story_own_35', 'Свой для всего круга', 'Достичь статуса «Свой человек» у всех тридцати пяти гостей истории.', { kind: 'storyGuests', visits: 4 }, STORY_GUESTS.length, 'legendary', ART.guests],
  ['guide_complete', 'Вся лавка как на ладони', 'Посмотреть все восемь разделов необязательного путеводителя.', { kind: 'guide' }, ONBOARDING_GUIDE_SECTIONS.length, 'uncommon', ART.cabinet],
  ['book_guests_10', 'Десять портретов в книге', 'Познакомиться с десятью героями гостевой книги через честные решения их уровней.', { kind: 'bookGuests' }, 10, 'common', ART.guests],
  ['book_guests_25', 'Двадцать пять знакомых лиц', 'Познакомиться с двадцатью пятью героями гостевой книги.', { kind: 'bookGuests' }, 25, 'rare', ART.guests],
  ['book_guests_37', 'Полная гостевая книга', `Познакомиться со всеми ${GUESTS.length} героями гостевой книги, включая хозяина и духа.`, { kind: 'bookGuests' }, GUESTS.length, 'epic', ART.guests],
  ['topic_first', 'Первая тема за чаем', 'Открыть первую тему разговора с любым героем гостевой книги.', { kind: 'guestTopics', mode: 'any' }, 1, 'common', ART.guests],
  ['topics_one', 'Душевный разговор', 'Открыть все темы разговора хотя бы одного героя гостевой книги.', { kind: 'guestTopics', mode: 'one' }, Math.min(...GUESTS.map((guest) => guest.topics.length)), 'uncommon', ART.guests],
  ['topics_all', 'Все истории гостевой книги', 'Открыть каждую тему разговора каждого героя без повторного накручивания старых тем.', { kind: 'guestTopics', mode: 'all' }, GUESTS.reduce((sum, guest) => sum + guest.topics.length, 0), 'legendary', ART.guests],
  ['brew_guests_all', 'Зелье для каждого заказчика', 'Честно выполнить заказ каждого из тринадцати гостей варки.', { kind: 'guestLevels', group: 'brew' }, new Set(Object.values(BREW_LEVEL_GUESTS)).size, 'epic', 'assets/puzzle_cards/pc_brew_web.jpg'],
  ['seating_guests_all', 'Все лица за чайным столом', 'Честно пройти рассадки со всеми тридцатью пятью гостями чайного стола.', { kind: 'guestLevels', group: 'seating' }, new Set(SEATING_PUZZLES.flatMap((level) => level.guests)).size, 'epic', 'assets/puzzle_cards/pc_seating_web.jpg'],
  ['battle_lore_all', 'Летопись двенадцати миров', 'Прочитать все двадцать четыре вступительные и завершающие лор-сцены походов.', { kind: 'lore' }, Object.keys(BATTLE_LORE).length * 2, 'legendary', 'assets/battle/battle_bg_mist_web.jpg'],
];
for (const [id, name, desc, condition, target, rarity, sourceArt] of storyDefinitions) {
  add({ id, name, desc, category: 'story', rarity, condition, target, sourceArt, motif: condition.kind, rank: rarity === 'legendary' ? 5 : 3 });
}

const allCrew = [...COMPANIONS, ...PETS, ...MERCENARIES];
const allTrophies = [...TROPHIES, ...MINI_TROPHIES];
const collectionDefinitions = [
  ['crew_first', 'Первый помощник', 'Нанять первого спутника, питомца или наёмника.', { kind: 'crew' }, 1, 'common', ART.crew],
  ['crew_five', 'Большая семья', 'Нанять пять разных членов команды лавки.', { kind: 'crew' }, 5, 'uncommon', ART.crew],
  ['crew_all', 'Вся команда в сборе', `Нанять всех ${allCrew.length} доступных спутников, питомцев и наёмников.`, { kind: 'crew' }, allCrew.length, 'epic', ART.crew],
  ['party_full', 'Полная группа в походе', 'Одновременно выбрать трёх спутников, двух наёмников и активного питомца.', { kind: 'fullParty' }, 1, 'rare', ART.knight],
  ['first_craft', 'Первая работа', 'Создать первую вещь по любому рецепту кузницы или котла.', { kind: 'stat', key: 'itemsCrafted' }, 1, 'common', ART.craft],
  ['craft_25', 'Двадцать пять заказов кузницы', 'Успешно выполнить двадцать пять крафтов с учётом повторов рецептов.', { kind: 'stat', key: 'itemsCrafted' }, 25, 'uncommon', ART.craft],
  ['craft_100', 'Сто дел мастерской', 'Успешно выполнить сто крафтов; неудачные попытки не считаются.', { kind: 'stat', key: 'itemsCrafted' }, 100, 'rare', ART.craft],
  ['recipes_all', 'Все двадцать пять рецептов', `Использовать каждый из ${RECIPES.length} рецептов хотя бы один раз.`, { kind: 'unique', key: 'craftedRecipes', ids: RECIPES.map((recipe) => recipe.id) }, RECIPES.length, 'epic', ART.recipes],
  ['shopper', 'Завсегдатай прилавка', 'Совершить двадцать успешных покупок товаров.', { kind: 'stat', key: 'itemsBought' }, 20, 'common', ART.market],
  ['purchases_100', 'Сотня покупок', 'Совершить сто успешных покупок товаров без учёта неудачных попыток.', { kind: 'stat', key: 'itemsBought' }, 100, 'rare', ART.market],
  ['rich', 'Звон полных карманов', 'Заработать суммарно пять тысяч монет честной игрой.', { kind: 'stat', key: 'coinsEarned' }, 5000, 'uncommon', ART.coins],
  ['rich_50000', 'Пятьдесят тысяч честного дохода', 'Заработать суммарно пятьдесят тысяч монет; текущий остаток неважен.', { kind: 'stat', key: 'coinsEarned' }, 50000, 'epic', ART.coins],
  ['seals_five', 'Коллекция печатей', 'Иметь пять печатей мастера одновременно.', { kind: 'seals' }, 5, 'uncommon', ART.seals],
  ['seals_45', 'Сорок пять печатей в книге', 'Иметь сорок пять печатей мастера одновременно, не потратив их на покупки.', { kind: 'seals' }, 45, 'epic', ART.seals],
  ['first_trophy', 'Первая полка', 'Поставить первый боссовский или розыскной трофей в кабинете.', { kind: 'trophies', ids: allTrophies.map((trophy) => trophy.id) }, 1, 'common', ART.trophy],
  ['cabinet_full', 'Полный кабинет', 'Собрать все двенадцать трофеев с боссов миров.', { kind: 'trophies', ids: TROPHIES.map((trophy) => trophy.id) }, TROPHIES.length, 'epic', ART.cabinet],
  ['trophies_16', 'Весь кабинет трофеев', `Собрать все ${allTrophies.length} трофеев: двенадцать боссовских и четыре розыскных.`, { kind: 'trophies', ids: allTrophies.map((trophy) => trophy.id) }, allTrophies.length, 'legendary', ART.cabinet],
  ['wanted_trophies', 'Четыре розыскных жетона', 'Получить все четыре мини-трофея за розыскные листы.', { kind: 'trophies', ids: MINI_TROPHIES.map((trophy) => trophy.id) }, MINI_TROPHIES.length, 'rare', ART.wanted],
  ['boss_find_1', 'Первая редкая находка', 'Получить первую внесетовую вещь с босса.', { kind: 'bossDrops' }, 1, 'uncommon', ART.bossDrop],
  ['boss_find_6', 'Шесть боссовских реликвий', 'Собрать шесть разных внесетовых находок с боссов.', { kind: 'bossDrops' }, 6, 'rare', ART.bossDrop],
  ['boss_find_12', 'Полная дюжина реликвий', `Собрать все ${Object.keys(BOSS_DROPS).length} внесетовых находок с боссов.`, { kind: 'bossDrops' }, Object.keys(BOSS_DROPS).length, 'legendary', ART.bossDrop],
  ['cosmetic_1', 'Лавка в новом образе', 'Купить первое полное оформление лавки.', { kind: 'cosmetics' }, 1, 'common', ART.cosmetics],
  ['cosmetic_all', 'Все шесть оформлений', `Собрать все ${COSMETIC_PACKS.length} полных оформления лавки.`, { kind: 'cosmetics' }, COSMETIC_PACKS.length, 'epic', ART.cosmetics],
  ['fate_deck_full', 'Полная колода судьбы', `Открыть все ${Object.keys(FATE_CARDS).length} карт через честно решённые расклады; пропуски не открывают эту награду.`, { kind: 'fateDeck' }, Object.keys(FATE_CARDS).length, 'legendary', ART.fate],
  ['set_first', 'Девять вещей одного сета', 'Впервые активировать высший ярус любого комплекта из девяти вещей.', { kind: 'sets', tier: 9 }, 1, 'epic', ART.craft],
  ['sets_all', 'Семь полных комплектов', `Активировать высший ярус всех ${Object.keys(SETS).length} комплектов хотя бы один раз в истории снаряжения.`, { kind: 'sets', tier: 9 }, Object.keys(SETS).length, 'legendary', ART.craft],
  ['exchange_first', 'Первый обмен материалов', 'Успешно обменять материалы в первый раз.', { kind: 'counter', key: 'materialExchanges' }, 1, 'common', ART.exchange],
  ['exchange_50', 'Полсотни честных обменов', 'Успешно завершить пятьдесят обменов материалов; отклонённые обмены не считаются.', { kind: 'counter', key: 'materialExchanges' }, 50, 'rare', ART.exchange],
  ['goal_first', 'Первая цель достигнута', 'Завершить первую цель накопления подтверждённой покупкой, наймом или крафтом.', { kind: 'counter', key: 'savingsGoals' }, 1, 'common', ART.goals],
  ['goal_10', 'Десять сбывшихся целей', 'Завершить десять целей накопления.', { kind: 'counter', key: 'savingsGoals' }, 10, 'rare', ART.goals],
  ['cat_friend', 'Мурлыкало', 'Погладить кота-хранителя двадцать пять раз.', { kind: 'stat', key: 'catPets' }, 25, 'uncommon', ART.cat],
  ['cat_100', 'Сто мурлыканий', 'Погладить кота-хранителя сто раз и заслужить его полное доверие.', { kind: 'stat', key: 'catPets' }, 100, 'rare', ART.cat],
];
for (const [id, name, desc, condition, target, rarity, sourceArt] of collectionDefinitions) {
  add({ id, name, desc, category: 'collections', rarity, condition, target, sourceArt, motif: condition.key || condition.kind, rank: rarity === 'legendary' ? 5 : 3 });
}

const MEMORY_LEVELS = ALL_PUZZLES.filter((level) => level.mechanic === 'brew' && level.hideRecipe);
const BLIND_SPINS = ALL_PUZZLES.filter((level) => level.mechanic === 'spin' && level.goldRim === false);
const puzzleChallenges = [
  ['no_hints_10', 'Десять дел своим умом', 'Честно решить десять разных кампанийских уровней с явно записанным нулём подсказок.', { kind: 'puzzles', noHints: true }, 10, 'uncommon'],
  ['no_hints_100', 'Сто решений без подсказок', 'Честно решить сто разных кампанийских уровней без подсказок.', { kind: 'puzzles', noHints: true }, 100, 'epic'],
  ['riddle_first_try', 'Слово с первого раза', 'Отгадать любую загадку Хранителя с первой попытки.', { kind: 'puzzleFeat', feat: 'riddle_first_try', mechanic: 'riddle' }, 1, 'rare'],
  ['hang_perfect', 'Ни кляксы, ни ожогов', 'Восстановить любые строки при свече без ошибок и порчи страницы.', { kind: 'puzzleFeat', feat: 'hang_perfect', mechanic: 'hang' }, 1, 'rare'],
  ['brew_flawless', 'Чистая варка', 'Сварить любое зелье без единой ошибки и без порчи за всю попытку.', { kind: 'puzzleFeat', feat: 'brew_flawless', mechanic: 'brew' }, 1, 'rare'],
  ['brew_memory_first', 'Книга осталась закрытой', `Пройти уровень «${MEMORY_LEVELS[0].name}» — первый рецепт на память — без постоянно открытой книги.`, { kind: 'puzzleFeat', feat: 'brew_memory', mechanic: 'brew', ids: [MEMORY_LEVELS[0].id] }, 1, 'rare'],
  ['brew_memory_all', 'Вся книга на память', `Пройти все ${MEMORY_LEVELS.length} уровней варки на память без постоянно открытой книги.`, { kind: 'puzzleFeat', feat: 'brew_memory', mechanic: 'brew', ids: MEMORY_LEVELS.map((level) => level.id) }, MEMORY_LEVELS.length, 'legendary'],
  ['fate_perfect', 'Расклад без помех', 'Завершить любой расклад судьбы без единой ошибочной карты.', { kind: 'puzzleFeat', feat: 'fate_perfect', mechanic: 'fate' }, 1, 'rare'],
  ['gift_first_try', 'Подарок с первого взгляда', 'Выбрать правильный подарок с первой попытки.', { kind: 'puzzleFeat', feat: 'gift_first_try', mechanic: 'gift' }, 1, 'uncommon'],
  ['gift_third_try', 'Третья попытка — с любовью', 'Выбрать правильный подарок ровно с третьей попытки.', { kind: 'puzzleFeat', feat: 'gift_third_try', mechanic: 'gift' }, 1, 'rare'],
  ['tea_exact', 'Точный оттенок чая', 'Приготовить чай с нулевым отклонением по всем каналам цвета и правильной теплотой.', { kind: 'puzzleFeat', feat: 'tea_exact', mechanic: 'tea' }, 1, 'epic'],
  ['candle_minimum', 'Ни одной лишней свечи', 'Пройти уровень «Свечи и духи» минимальным числом свечей по решателю.', { kind: 'puzzleFeat', feat: 'candle_minimum', mechanic: 'candle' }, 1, 'epic'],
  ['spin_par_first', 'Точная сборка гобелена', 'Собрать любой гобелен не выше эталона ходов и без подсказок.', { kind: 'puzzleFeat', feat: 'spin_par', mechanic: 'spin' }, 1, 'rare'],
  ['spin_par_25', 'Двадцать пять точных узоров', 'Собрать двадцать пять разных гобеленов не выше эталона ходов и без подсказок.', { kind: 'puzzleFeat', feat: 'spin_par', mechanic: 'spin' }, 25, 'epic'],
  ['spin_blind_all', 'Тридцать шесть слепых гобеленов', `Честно собрать все ${BLIND_SPINS.length} гобеленов без золотой подсказки каймы.`, { kind: 'puzzles', ids: BLIND_SPINS.map((level) => level.id) }, BLIND_SPINS.length, 'legendary'],
  ['seek_no_miss', 'Ни промаха, ни подсказки', 'Завершить любую искалку без промахов по пустым местам и без подсказок.', { kind: 'puzzleFeat', feat: 'seek_no_miss', mechanic: 'seek' }, 1, 'rare'],
  ['seating_first_serve', 'Чай принят сразу', 'Получить одобрение чайной рассадки с первой подачи.', { kind: 'puzzleFeat', feat: 'seating_first_serve', mechanic: 'seating' }, 1, 'rare'],
  ['glass_no_hints_25', 'Двадцать пять витражей своим умом', 'Собрать двадцать пять разных витражей без подсказок.', { kind: 'puzzles', mechanic: 'glass', noHints: true }, 25, 'epic'],
];
const puzzleArt = Object.fromEntries(PUZZLE_TYPES.map((type) => [type.id, type.art]));
for (const [id, name, desc, condition, target, rarity] of puzzleChallenges) {
  add({ id, name, desc, category: 'challenges', rarity, condition, target, sourceArt: puzzleArt[condition.mechanic] || ART.campaign, motif: condition.feat || 'no-hints', rank: rarity === 'legendary' ? 5 : 4 });
}

const battleChallenges = [
  ['battle_no_damage', 'Без единой царапины', 'Победить в настоящем бою без урона всему отряду по суммарной статистике союзников.', 'battle_no_damage', null, 'rare', ART.knight],
  ['boss_all_survive', 'Все вернулись с босса', 'Победить любого босса без погибших союзников.', 'boss_all_survive', null, 'rare', ART.boss],
  ['battle_solo', 'Один рыцарь, одна победа', 'Победить в настоящем бою без наёмников в отряде.', 'battle_solo', null, 'uncommon', ART.knight],
  ['boss_no_consumables', 'Босс без зелий и свитков', 'Победить любого босса без использованных расходников.', 'boss_no_consumables', null, 'rare', ART.boss],
  ['battle_one_hp', 'На волосок от поражения', 'Победить в настоящем бою, оставив рыцарю ровно одну единицу здоровья.', 'battle_one_hp', null, 'epic', ART.knight],
  ['merc_last_stand', 'Последний боец наёмник', 'Победить после гибели рыцаря, когда финальный удар остался наёмнику.', 'merc_last_stand', null, 'epic', ART.merc],
  ['battle_timeout', 'Долгий бой проигран', 'Получить настоящее поражение по лимиту ходов; тренировка не засчитывается.', 'timeout', null, 'uncommon', 'assets/battle/battle_bg_mist_web.jpg'],
  ['battle_comeback', 'После поражения — победа', 'Победить в любом бою, где раньше было записано настоящее поражение.', 'battle_comeback', null, 'uncommon', ART.battle],
  ['boss_no_damage', 'Босс не коснулся отряда', 'Победить любого босса без урона всему отряду.', 'boss_no_damage', null, 'legendary', ART.boss],
  ['full_party_crowd', 'Полный строй против шести', 'Победить в сборе из шести врагов с полной группой и без погибших бойцов.', 'full_party_crowd', null, 'legendary', ART.knight],
  ['boss_pity', 'Двенадцатая настойчивость', 'Получить гарантированную босс-находку на двенадцатой сухой наградной победе.', 'boss_pity', null, 'legendary', 'assets/items/glv_mist_minute_web.jpg'],
];
for (const [id, name, desc, feat, battleId, rarity, sourceArt] of battleChallenges) {
  add({ id, name, desc, category: 'challenges', rarity, condition: { kind: 'battleFeat', feat, ...(battleId ? { id: battleId } : {}) }, target: 1, sourceArt, motif: feat, rank: rarity === 'legendary' ? 5 : 4 });
}
add({
  id: 'battle_defeats_10', name: 'Десять честных поражений',
  desc: 'Записать десять настоящих поражений; тренировки и блокировка энергии ничего не добавляют.',
  category: 'challenges', rarity: 'rare', condition: { kind: 'battleDefeats' }, target: 10,
  sourceArt: ART.battle, motif: 'battle-defeats', rank: 3,
});

const specialDefinitions = [
  ['workshop_create', 'Собственный уровень', 'Создать и сохранить первый решаемый уровень в Мастерской.', { kind: 'custom', mode: 'created' }, 'rare', 'assets/puzzle_cards/pc_mirror_web.jpg'],
  ['workshop_solve', 'Автор прошёл своё творение', 'Честно решить собственный сохранённый уровень; в кампанию он не входит.', { kind: 'custom', mode: 'solved' }, 'rare', 'assets/puzzle_cards/pc_mirror_web.jpg'],
  ['bees_return', 'Возвращение к пчёлам', 'После записанного поражения вернуться к «Пчелиному дереву» и победить.', { kind: 'battleFeat', feat: 'battle_comeback', id: 'bt_bees' }, 'rare', ART.bees],
  ['skip_return', 'Второй шанс для загадки', 'Честно решить уровень, ранее отмеченный как пропущенный.', { kind: 'puzzleFeat', feat: 'skip_comeback', includeCustom: true }, 'uncommon', ART.campaign],
  ['brew_recovery', 'Из порченого котла — доброе зелье', 'Сварить зелье после одной или нескольких порч в той же попытке.', { kind: 'puzzleFeat', feat: 'brew_recovery', mechanic: 'brew' }, 'rare', puzzleArt.brew],
  ['gift_recovery', 'Подарок после прощания', 'Вручить правильный подарок после ухода гостя и новой попытки.', { kind: 'puzzleFeat', feat: 'gift_recovery', mechanic: 'gift' }, 'rare', puzzleArt.gift],
  ['spider_secret', 'Паучий праздник', 'Найти паучью пасхалку и оставить ей место в истории лавки.', { kind: 'spider' }, 'epic', ART.spider],
  ['seasonal_style', 'Лавка в ритме сезона', 'Выбрать оформление лавки, подходящее сезону в момент выбора.', { kind: 'counter', key: 'seasonalCosmeticSelections' }, 'epic', ART.spring],
  ['story_silence_all', 'Молчание — тоже разговор', 'Услышать особые реплики о молчании всех тридцати пяти обычных гостей истории.', { kind: 'silence' }, 'legendary', ART.guests],
  ['achievement_meta', 'Книга всех свершений', 'Получить все остальные двести тридцать девять достижений актуального каталога.', { kind: 'meta' }, 'legendary', 'assets/glass/glass_trophies_web.jpg'],
];
for (const [id, name, desc, condition, rarity, sourceArt] of specialDefinitions) {
  add({
    id, name, desc, category: 'special', rarity, secret: true, condition,
    target: id === 'story_silence_all' ? STORY_GUESTS.length : id === 'achievement_meta' ? 239 : 1,
    sourceArt, motif: condition.feat || condition.kind, rank: id === 'achievement_meta' ? 5 : 4,
  });
}

export const ACHIEVEMENTS = definitions;

const PUZZLE_CONTENT = ALL_PUZZLES.map((puzzle) => ({
  ...puzzle,
  achievementPar: puzzle.mechanic === 'spin' ? parMoves(createSpinPuzzle(puzzle)) : undefined,
}));
const GUEST_CONTENT = GUESTS.map((guest) => ({
  id: guest.id,
  levelIds: [...guest.fateLevels, ...guest.brewLevels],
  topicCount: guest.topics.length,
}));
const BREW_GUEST_LEVELS = Object.fromEntries(
  [...new Set(Object.values(BREW_LEVEL_GUESTS))].map((guestId) => [
    guestId,
    Object.entries(BREW_LEVEL_GUESTS).filter(([, id]) => id === guestId).map(([levelId]) => levelId),
  ]),
);
const SEATING_GUEST_LEVELS = Object.fromEntries(
  [...new Set(SEATING_PUZZLES.flatMap((level) => level.guests))].map((guestId) => [
    guestId,
    SEATING_PUZZLES.filter((level) => level.guests.includes(guestId)).map((level) => level.id),
  ]),
);
const LORE_KEYS = Object.keys(BATTLE_LORE).flatMap((world) => [`${world}:intro`, `${world}:outro`]);
const ITEM_SETS = Object.fromEntries(ITEMS.filter((item) => item.set).map((item) => [item.id, item.set]));
const BASE_CONTEXT = {
  puzzles: PUZZLE_CONTENT,
  battles: BATTLES,
  guests: GUEST_CONTENT,
  storyGuestIds: STORY_GUESTS,
  guideIds: ONBOARDING_GUIDE_SECTIONS.map((section) => section.id),
  loreKeys: LORE_KEYS,
  brewGuestLevels: BREW_GUEST_LEVELS,
  seatingGuestLevels: SEATING_GUEST_LEVELS,
  crewIds: allCrew.map((member) => member.id),
  companionIds: COMPANIONS.map((member) => member.id),
  mercIds: MERCENARIES.map((member) => member.id),
  petIds: PETS.map((member) => member.id),
  cosmeticIds: COSMETIC_PACKS.map((pack) => pack.id),
  bossDrops: Object.fromEntries(Object.entries(BOSS_DROPS).map(([battleId, drop]) => [battleId, drop.itemId])),
  fateCardIds: Object.keys(FATE_CARDS),
  fateLevels: FATE_PUZZLES.map((level) => ({ id: level.id, cards: level.hand })),
  setIds: Object.keys(SETS),
  itemSets: ITEM_SETS,
};

const DEFINITION_CONTEXT = {
  ...BASE_CONTEXT,
  achievementIds: ACHIEVEMENTS.map((definition) => definition.id),
};
for (const definition of ACHIEVEMENTS) {
  Object.defineProperty(definition, 'evaluationContext', {
    value: DEFINITION_CONTEXT,
    enumerable: false,
  });
}

function catalogContext(ctx = {}) {
  return { ...ctx, ...DEFINITION_CONTEXT };
}

export function achievementProgress(state, definition, ctx = {}) {
  return evaluateAchievement(state, definition, catalogContext(ctx));
}

export function checkAchievements(state, ctx = {}) {
  return sweepAchievements(state, ACHIEVEMENTS, catalogContext(ctx));
}
