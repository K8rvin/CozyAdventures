// Пересборка «Карт судьбы»: колода растёт по ОДНОЙ новой карте за уровень.
// Вход: текущие src/data/puzzlesFate.js (истории) + NEW_LEVELS ниже.
// Правила:
//   - fate_01 — сторож, базовая колода из 6 карт (3 ответа + 3 обманки);
//   - дальше каждый уровень добавляет в оборот ровно 1 новую карту
//     (ответом, если получилось, иначе обманкой — карта «войдёт в игру» позже);
//   - дуги гостей сохраняют порядок (продолжение истории — после прошлой);
//   - рука = ответы + обманки из УЖЕ виденных карт; перемешана, без спойлера.
// Запуск: node tools/fate-deck.mjs — переписывает src/data/puzzlesFate.js,
// затем обязательно: npm run build && npm test.
// Генератор НЕ идемпотентен: на пересобранном файле не запускается
// (восстанови вход: git checkout -- src/data/puzzlesFate.js).
import { writeFileSync, readFileSync } from 'node:fs';

const OUT = 'src/data/puzzlesFate.js';
if (readFileSync(OUT, 'utf8').includes('Файл пересобран генератором')) {
  console.error('Вход уже пересобран генератором — отказ. Восстанови: git checkout -- ' + OUT);
  process.exit(1);
}

import { FATE_PUZZLES, FATE_CARDS } from '../src/data/puzzlesFate.js';

// --- Четвёртая колода (дебюты fate_61–fate_72) + пятая (26 шт) ---
// Всего карт = числу уровней (84): 47 уже в игре + 37 здесь.
const NEW_CARDS = {
  seal: { id: 'seal', name: 'Печать', icon: '🔏', meanings: ['заверение', 'подпись'] },
  wheel: { id: 'wheel', name: 'Колесо', icon: '🛞', meanings: ['оборот', 'движение'] },
  umbrella: { id: 'umbrella', name: 'Зонт', icon: '☂️', meanings: ['укрытие', 'полог'] },
  accordion: { id: 'accordion', name: 'Гармошка', icon: '🪗', meanings: ['лад', 'веселье'] },
  smoke: { id: 'smoke', name: 'Дымок', icon: '💨', meanings: ['дым', 'улетучность'] },
  hourglass: { id: 'hourglass', name: 'Песочные часы', icon: '⌛', meanings: ['течение', 'терпенье'] },
  gear: { id: 'gear', name: 'Шестерня', icon: '⚙️', meanings: ['сцепка', 'зубец'] },
  vial: { id: 'vial', name: 'Пузырёк', icon: '🧪', meanings: ['капля', 'снадобье'] },
  spikelet: { id: 'spikelet', name: 'Колосок', icon: '🌾', meanings: ['урожай', 'колос'] },
  globe: { id: 'globe', name: 'Глобус', icon: '🌍', meanings: ['мир', 'обозрение'] },
  comet: { id: 'comet', name: 'Комета', icon: '☄️', meanings: ['вспышка', 'знак'] },
  needle: { id: 'needle', name: 'Игла', icon: '🪡', meanings: ['стежок', 'штопка'] },
  lamp: { id: 'lamp', name: 'Лампа', icon: '🪔', meanings: ['огонёк', 'масло'] },
  pie: { id: 'pie', name: 'Пирог', icon: '🥧', meanings: ['начинка', 'сдоба'] },
  map: { id: 'map', name: 'Карта', icon: '🗺️', meanings: ['чертёж', 'маршрут'] },
  boat: { id: 'boat', name: 'Лодка', icon: '🛶', meanings: ['гладь', 'вёсла'] },
  dice: { id: 'dice', name: 'Кости', icon: '🎲', meanings: ['случай', 'игра'] },
  hen: { id: 'hen', name: 'Квочка', icon: '🐔', meanings: ['наседка', 'квохтанье'] },
  stone: { id: 'stone', name: 'Камень', icon: '🪨', meanings: ['упорство', 'кремень'] },
  crown: { id: 'crown', name: 'Корона', icon: '👑', meanings: ['власть', 'почёт'] },
  cloak: { id: 'cloak', name: 'Плащ', icon: '🧥', meanings: ['полы', 'согрев'] },
  drum: { id: 'drum', name: 'Барабан', icon: '🥁', meanings: ['дробь', 'праздник'] },
  firefly: { id: 'firefly', name: 'Светлячок', icon: '✨', meanings: ['искра', 'огоньки'] },
  rope: { id: 'rope', name: 'Канат', icon: '🪢', meanings: ['узел', 'связка'] },
  inkwell: { id: 'inkwell', name: 'Чернильница', icon: '🖋️', meanings: ['марка', 'строчка'] },
  saddle: { id: 'saddle', name: 'Седло', icon: '🐎', meanings: ['верх', 'посадка'] },
  broom: { id: 'broom', name: 'Метла', icon: '🧹', meanings: ['чистка', 'порядок'] },
  sunset: { id: 'sunset', name: 'Закат', icon: '🌇', meanings: ['багрянец', 'вечер'] },
  sunrise: { id: 'sunrise', name: 'Рассвет', icon: '🌅', meanings: ['заря', 'утро'] },
  owl: { id: 'owl', name: 'Сова', icon: '🦉', meanings: ['мудрость', 'полночь'] },
  fox: { id: 'fox', name: 'Лиса', icon: '🦊', meanings: ['хитрость', 'рыжесть'] },
  goat: { id: 'goat', name: 'Коза', icon: '🐐', meanings: ['молоко', 'боданье'] },
  piglet: { id: 'piglet', name: 'Поросёнок', icon: '🐖', meanings: ['хрю', 'розовый'] },
  cheese: { id: 'cheese', name: 'Сыр', icon: '🧀', meanings: ['головка', 'созревание'] },
  grape: { id: 'grape', name: 'Виноград', icon: '🍇', meanings: ['гроздь', 'сок'] },
  suitcase: { id: 'suitcase', name: 'Чемодан', icon: '🧳', meanings: ['сборы', 'вещи'] },
  scarf: { id: 'scarf', name: 'Шарф', icon: '🧣', meanings: ['вязка', 'шея'] },
};

// --- Шестая и седьмая дюжины: 24 новые истории для старых знакомых ---
// Дебют карты — СЫРОЙ id (fate_XX временный; финальный номер = позиция).
const NEW_LEVELS = [
  {
    tempId: 61, guestArc: 'owl', name: 'Фолиант дописан',
    guest: { name: 'Сова-библиотекарь', icon: '🦉', art: 'assets/fate/guest_owl_web.jpg' },
    story: [
      { label: 'Что было', text: 'Фолиант дописан! Последняя страница — и заверение автора внизу.', accept: ['seal'] },
      { label: 'Что есть', text: 'Теперь несу его в галерею витражей — пусть висит при свете.', accept: ['lantern'] },
      { label: 'Что гнетёт', text: 'А вдруг скажут: сова не может писать — списала, притворщица?', accept: ['mask'] },
    ],
    intro: 'Сова дописала фолиант. Новая карта на столе.',
  },
  {
    tempId: 62, guestArc: 'ranger', name: 'Телега для лавки',
    guest: { name: 'Следопыт', icon: '🧭', art: 'assets/fate/guest_ranger_web.jpg' },
    story: [
      { label: 'Что было', text: 'Горы покорены — вершина за вершиной, ступенька к ступеньке.', accept: ['ladder'] },
      { label: 'Что есть', text: 'Теперь строю телегу для лавки: колёса — оборот и движение.', accept: ['wheel'] },
      { label: 'Что гнетёт', text: 'Боюсь: колесо сорвётся с оси на ухабе — и весь груз под дождём.', accept: ['rain'] },
    ],
    intro: 'Следопыт строит телегу. Новая карта на столе.',
  },
  {
    tempId: 63, guestArc: 'spider', name: 'Навесик паучка',
    guest: { name: 'Паучок', icon: '🕷️', art: 'assets/fate/guest_spider_web.jpg' },
    story: [
      { label: 'Что было', text: 'Помните блюдце? Теперь у меня витрина-дом и шляпа.', accept: ['home'] },
      { label: 'Что есть', text: 'На дождливые дни сделал себе навесик — полог от ливня.', accept: ['umbrella'] },
      { label: 'Что гнетёт', text: 'А вдруг паутину смоет вместе с навесиком — улечу волной?', accept: ['wave'] },
    ],
    intro: 'Паучок обзавёлся навесиком. Новая карта на столе.',
  },
  {
    tempId: 64, guestArc: 'cook', name: 'Капельная варка',
    guest: { name: 'Поварёнок', icon: '🍲', art: 'assets/fate/guest_cook_web.jpg' },
    story: [
      { label: 'Что было', text: 'Самовар греет гостей, беседа кипит, пар стоит столбом.', accept: ['samovar'] },
      { label: 'Что есть', text: 'Теперь учусь капельной варке: пузырёк, капля, снадобье.', accept: ['vial'] },
      { label: 'Что гнетёт', text: 'Боюсь перелить: капля лишняя — и зелье вспыхнет.', accept: ['fire'] },
    ],
    intro: 'Поварёнок учится капельной варке. Новая карта на столе.',
  },
  {
    tempId: 65, guestArc: 'clockmaker', name: 'Сцепка зубцов',
    guest: { name: 'Часовщик', icon: '⏰', art: 'assets/fate/guest_clockmaker_web.jpg' },
    story: [
      { label: 'Что было', text: 'Башни поют в один бой — сцепка зубец к зубцу.', accept: ['gear'] },
      { label: 'Что есть', text: 'Теперь вожу экскурсии по башням — обзор механизмов для гостей.', accept: ['window'] },
      { label: 'Что гнетёт', text: 'А вдруг пружина лопнет — и бой умолкнет в тишине?', accept: ['moon'] },
    ],
    intro: 'Часовщик и его башни. Новая карта на столе.',
  },
  {
    tempId: 66, guestArc: 'fisherman', name: 'Гостинец отца',
    guest: { name: 'Рыбак', icon: '🎣', art: 'assets/fate/guest_fisherman_web.jpg' },
    story: [
      { label: 'Что было', text: 'Отец прислал весточку! Жив, ловит у тёплых островов.', accept: ['letter'] },
      { label: 'Что есть', text: 'Прислал и гостинец — раковина с прибоем внутри, клад из моря.', accept: ['shell'] },
      { label: 'Что гнетёт', text: 'Хочу к нему на кораблике, да боюсь дальнего странствия.', accept: ['ship'] },
    ],
    intro: 'У рыбака радость: отец жив. Новая карта на столе.',
  },
  {
    tempId: 67, guestArc: 'dancer', name: 'Гармонист',
    guest: { name: 'Танцовщица', icon: '💃', art: 'assets/fate/guest_dancer_web.jpg' },
    story: [
      { label: 'Что было', text: 'Лента цела, зрители хлопают — радуга после грозы.', accept: ['rainbow'] },
      { label: 'Что есть', text: 'Теперь играю с гармонистом — лад да веселье, складно!', accept: ['accordion'] },
      { label: 'Что гнетёт', text: 'А вдруг он фальшивит нарочно — притворство в ладу?', accept: ['mask'] },
    ],
    intro: 'Танцовщица и гармонист. Новая карта на столе.',
  },
  {
    tempId: 68, guestArc: 'cartographer', name: 'Глобус перекрёстка',
    guest: { name: 'Картограф', icon: '🗺️', art: 'assets/fate/guest_cartographer_web.jpg' },
    story: [
      { label: 'Что было', text: 'Живая карта работает — путники не блудят, фонарь ведёт.', accept: ['lantern'] },
      { label: 'Что есть', text: 'Теперь делаю глобус перекрёстка: все миры — одно обозрение.', accept: ['globe'] },
      { label: 'Что гнетёт', text: 'Боюсь: миры кружатся — глобус устареет за один оборот?', accept: ['wheel'] },
      { label: 'Совет', text: 'Чем помечать живые карты?', accept: ['feather'] },
    ],
    intro: 'Картограф делает глобус. Новая карта на столе.',
  },
  {
    tempId: 69, guestArc: 'potter', name: 'Неспешная глина',
    guest: { name: 'Гончар', icon: '🏺', art: 'assets/fate/guest_potter_web.jpg' },
    story: [
      { label: 'Что было', text: 'Печь стоит — стук молота сделал своё дело, крепко.', accept: ['hammer'] },
      { label: 'Что есть', text: 'Теперь леплю неспешно: течение глины, терпенье рук.', accept: ['hourglass'] },
      { label: 'Что гнетёт', text: 'А вдруг запас глины кончится — корзина опустеет?', accept: ['basket'] },
    ],
    intro: 'Гончар лепит неспешно. Новая карта на столе.',
  },
  {
    tempId: 70, guestArc: 'miller', name: 'Рожь колосится',
    guest: { name: 'Мельник', icon: '🌾', art: 'assets/fate/guest_miller_web.jpg' },
    story: [
      { label: 'Что было', text: 'Поле засеяно у перекрёстка — выбор оказался верным.', accept: ['gate'] },
      { label: 'Что есть', text: 'Теперь колосится рожь — урожай, колос к колосу.', accept: ['spikelet'] },
      { label: 'Что гнетёт', text: 'Боюсь грозы в июле: наплыв дождя поляжет нивы.', accept: ['wave'] },
    ],
    intro: 'У мельника колосится рожь. Новая карта на столе.',
  },
  {
    tempId: 71, guestArc: 'beekeeper', name: 'Дымка для ульев',
    guest: { name: 'Пчеловод', icon: '🐝', art: 'assets/fate/guest_beekeeper_web.jpg' },
    story: [
      { label: 'Что было', text: 'Рой не улетел — улей гудит, община жива.', accept: ['hive'] },
      { label: 'Что есть', text: 'Теперь окуриваю ульи дымком: пчёлы мирятся, дым улётен.', accept: ['smoke'] },
      { label: 'Что гнетёт', text: 'А вдруг дымка уйдёт — и улей вспылит?', accept: ['fire'] },
    ],
    intro: 'Пчеловод окуривает ульи. Новая карта на столе.',
  },
  {
    tempId: 72, guestArc: 'spirit', name: 'Вспышка над мирами',
    guest: { name: 'Дух перекрёстка', icon: '🌀', art: 'assets/fate/guest_spirit_web.jpg' },
    story: [
      { label: 'Что было', text: 'Я был тропой, потом кругом дорог — обещание хранить всех.', accept: ['ring'] },
      { label: 'Что есть', text: 'Теперь я дом для общины гостей — лавка, витражи, фонари.', accept: ['home'] },
      { label: 'Что гнетёт', text: 'Иногда вижу вспышку над мирами — знак ли это конца?', accept: ['comet'] },
      { label: 'Совет', text: 'Чем встречать перемены, дух?', accept: ['rainbow'] },
    ],
    intro: 'Дух перекрёстка видит вспышку. Новая карта на столе.',
  },
  {
    tempId: 73, guestArc: 'miller', name: 'Мешки мельника',
    guest: { name: 'Мельник', icon: '🌾', art: 'assets/fate/guest_miller_web.jpg' },
    story: [
      { label: 'Что было', text: 'Рожь смолота — мука в мешках, урожай дома, колос отработал.', accept: ['spikelet'] },
      { label: 'Что есть', text: 'Теперь шью мешки сам — игла да стежок, штопка к штопке.', accept: ['needle'] },
      { label: 'Что гнетёт', text: 'Боюсь: мешок расползётся в дороге — мука по тропе ниткой.', accept: ['thread'] },
    ],
    intro: 'Мельник шьёт мешки сам. Новая карта на столе.',
  },
  {
    tempId: 74, guestArc: 'glassblower', name: 'Лампы за витражами',
    guest: { name: 'Стеклодув', icon: '🪟', art: 'assets/fate/guest_glassblower_web.jpg' },
    story: [
      { label: 'Что было', text: 'Галерея окон стоит — обзор на все миры открыт.', accept: ['window'] },
      { label: 'Что есть', text: 'Ночью витражи темны — ставлю за ними масляные лампы, огонёк тёплый.', accept: ['lamp'] },
      { label: 'Что гнетёт', text: 'А вдруг масло кончится — и переливы погаснут, как радуга без дождя?', accept: ['rainbow'] },
    ],
    intro: 'Стеклодув ставит лампы за витражами. Новая карта на столе.',
  },
  {
    tempId: 75, guestArc: 'cook', name: 'Пироги поварёнка',
    guest: { name: 'Поварёнок', icon: '🍲', art: 'assets/fate/guest_cook_web.jpg' },
    story: [
      { label: 'Что было', text: 'Капельная варка освоена — снадобья в пузырьках, капля в каплю.', accept: ['vial'] },
      { label: 'Что есть', text: 'Теперь пеку пироги для лавки — начинка, сдоба, пар над лотком.', accept: ['pie'] },
      { label: 'Что гнетёт', text: 'Боюсь: корка подгорит — жар да дым.', accept: ['fire'] },
    ],
    intro: 'Поварёнок печёт пироги. Новая карта на столе.',
  },
  {
    tempId: 76, guestArc: 'clockmaker', name: 'Схема башен',
    guest: { name: 'Часовщик', icon: '⏰', art: 'assets/fate/guest_clockmaker_web.jpg' },
    story: [
      { label: 'Что было', text: 'Экскурсии по башням идут — обзор механизмов всем по нраву.', accept: ['window'] },
      { label: 'Что есть', text: 'Теперь черчу схему башен для гостей — чертёж и маршрут.', accept: ['map'] },
      { label: 'Что гнетёт', text: 'А вдруг гости заблудятся без карты — тишина и ночь?', accept: ['moon'] },
    ],
    intro: 'Часовщик чертит схему башен. Новая карта на столе.',
  },
  {
    tempId: 77, guestArc: 'fisherman', name: 'Своя лодка',
    guest: { name: 'Рыбак', icon: '🎣', art: 'assets/fate/guest_fisherman_web.jpg' },
    story: [
      { label: 'Что было', text: 'К отцу не поехал — раковина греет, весточки идут.', accept: ['shell'] },
      { label: 'Что есть', text: 'Теперь строю лодку свою: гладь да вёсла, сам хозяин воды.', accept: ['boat'] },
      { label: 'Что гнетёт', text: 'Боюсь течи: дно прохудится — прибой внутри лодки?', accept: ['wave'] },
    ],
    intro: 'Рыбак строит свою лодку. Новая карта на столе.',
  },
  {
    tempId: 78, guestArc: 'cartographer', name: 'Игра путешествий',
    guest: { name: 'Картограф', icon: '🗺️', art: 'assets/fate/guest_cartographer_web.jpg' },
    story: [
      { label: 'Что было', text: 'Глобус перекрёстка крутится — все миры в обозрении.', accept: ['globe'] },
      { label: 'Что есть', text: 'Теперь веду игру путешествий для гостей: брось кости — куда судьба, случай и игра.', accept: ['dice'] },
      { label: 'Что гнетёт', text: 'А вдруг случай поведёт не туда — притворная карта?', accept: ['mask'] },
    ],
    intro: 'Картограф ведёт игру путешествий. Новая карта на столе.',
  },
  {
    tempId: 79, guestArc: 'gardener', name: 'Квочка в саду',
    guest: { name: 'Дочь садовника', icon: '🌱', art: 'assets/fate/guest_daughter_web.jpg' },
    story: [
      { label: 'Что было', text: 'Грибы под дубами пошли — сезон добрый, находка за находкой.', accept: ['mushroom'] },
      { label: 'Что есть', text: 'Завела квочку с цыплятами — наседка квохчет, гнездо полное.', accept: ['hen'] },
      { label: 'Что гнетёт', text: 'А вдруг холодок вернётся — узор льда на теплице?', accept: ['snowflake'] },
    ],
    intro: 'У дочери садовника квочка с цыплятами. Новая карта на столе.',
  },
  {
    tempId: 80, guestArc: 'smith', name: 'Камень для печи',
    guest: { name: 'Кузнец', icon: '⚒️', art: 'assets/fate/guest_smith_web.jpg' },
    story: [
      { label: 'Что было', text: 'Горн передан ученику — огонь в добрых руках.', accept: ['fire'] },
      { label: 'Что есть', text: 'Теперь мну не молот, а камень для печи — упорство, кремень.', accept: ['stone'] },
      { label: 'Что гнетёт', text: 'А вдруг рука забудет стук — молот заплачет?', accept: ['hammer'] },
    ],
    intro: 'Кузнец отдал горн и взялся за камень. Новая карта на столе.',
  },
  {
    tempId: 81, guestArc: 'elder', name: 'Старший совет',
    guest: { name: 'Староста', icon: '👴', art: 'assets/fate/guest_elder_web.jpg' },
    story: [
      { label: 'Что было', text: 'Мост стоит, долги закрыты — весы в равновесии.', accept: ['scale'] },
      { label: 'Что есть', text: 'Теперь выбирают меня в старший совет перекрёстка — власть да почёт.', accept: ['crown'] },
      { label: 'Что гнетёт', text: 'Боюсь: власть развратит — маска вместо лица?', accept: ['mask'] },
    ],
    intro: 'Староста идёт в старший совет. Новая карта на столе.',
  },
  {
    tempId: 82, guestArc: 'seamstress', name: 'Дорожные плащи',
    guest: { name: 'Швея', icon: '🪡', art: 'assets/fate/guest_seamstress_web.jpg' },
    story: [
      { label: 'Что было', text: 'Занавес в лавке греет свечу — стежки держат.', accept: ['thread'] },
      { label: 'Что есть', text: 'Теперь шью дорожные плащи для гостей — полы, согрев.', accept: ['cloak'] },
      { label: 'Что гнетёт', text: 'А вдруг мода переменится — ножницы по ткани?', accept: ['scissors'] },
    ],
    intro: 'Швея шьёт плащи для путников. Новая карта на столе.',
  },
  {
    tempId: 83, guestArc: 'cat', name: 'Вечера сказок',
    guest: { name: 'Кот-хранитель', icon: '🐈', art: 'assets/fate/guest_cat_web.jpg' },
    story: [
      { label: 'Что было', text: 'Сто историй записано — память тёплая, страницы пахнут воском.', accept: ['candle'] },
      { label: 'Что есть', text: 'Теперь вечера сказок у лавки: дробь барабана, праздник для гостей.', accept: ['drum'] },
      { label: 'Что гнетёт', text: 'А вдруг сказки кончатся — страницы под ножницы?', accept: ['scissors'] },
    ],
    intro: 'Кот-хранитель затевает вечера сказок. Новая карта на столе.',
  },
  {
    tempId: 84, guestArc: 'keeper', name: 'Огоньки лавки',
    guest: { name: 'Хозяин лавки', icon: '🧺', art: 'assets/fate/guest_keeper_web.jpg' },
    story: [
      { label: 'Что было', text: 'Лавка открыта мной — перекрёсток вспыхнул огоньками, дом для всех.', accept: ['home'] },
      { label: 'Что есть', text: 'Теперь гости из всех миров — и каждый вечер искра да огоньки.', accept: ['firefly'] },
      { label: 'Что гнетёт', text: 'Иногда думаю: всё это — дым и сон, улётится?', accept: ['smoke'] },
      { label: 'Совет', text: 'Кот шепчет: кем быть завтра, хозяин?', accept: ['star'] },
    ],
    intro: 'Финал седьмой книги: расклад для хозяина лавки. Светлячок на столе.',
  },
  // --- Филлеры (tempId 85–96): промежуточные уровни БЕЗ новых карт ---
  // Ответы — только из уже вошедших в игру карт; генератор вставляет их
  // между дебютными уровнями (примерно каждые 7–8 позиций).
  {
    tempId: 85, guestArc: 'spider', filler: true, name: 'Узоры паучка',
    guest: { name: 'Паучок', icon: '🕷️', art: 'assets/fate/guest_spider_web.jpg' },
    story: [
      { label: 'Что было', text: 'Витрина-дом, качели-нитка — живу при лавке, шляпа в порядке.', accept: ['home'] },
      { label: 'Что есть', text: 'Теперь ночи теплей — свеча горит допоздна, память греется.', accept: ['candle'] },
      { label: 'Что гнетёт', text: 'А вдруг в блюдце опять не узнаю себя — двойник страшный?', accept: ['mirror'] },
    ],
    intro: 'Паучок плетёт узоры для витрины — и снова боится блюдца.',
  },
  {
    tempId: 86, guestArc: 'baker', filler: true, name: 'Ночная выпечка',
    guest: { name: 'Пекарша', icon: '🥖', art: 'assets/fate/guest_baker_web.jpg' },
    story: [
      { label: 'Что было', text: 'Утренний стол при лавке — встречи да угощение, полный дом.', accept: ['cup'] },
      { label: 'Что есть', text: 'Теперь новый каравай каждый день — труд, достаток, руки в муке.', accept: ['bread'] },
      { label: 'Что гнетёт', text: 'А вдруг ливень в крышу — тесто не встанет?', accept: ['rain'] },
    ],
    intro: 'Пекарша печёт по ночам. Каравай каждый день — и тревога о крыше.',
  },
  {
    tempId: 87, guestArc: 'forester', filler: true, name: 'Песня с тропы',
    guest: { name: 'Лесничий', icon: '🌲', art: 'assets/fate/guest_forester_web.jpg' },
    story: [
      { label: 'Что было', text: 'Вёл гостей по тропам — путь да перемены, сосны знают меня.', accept: ['path'] },
      { label: 'Что есть', text: 'Теперь выучил ярмарочную песню — свирель зовёт гостей к лавке.', accept: ['flute'] },
      { label: 'Что гнетёт', text: 'А вдруг сухая гроза — и лес вспыхнет?', accept: ['fire'] },
    ],
    intro: 'Лесничий выучил песню и зовёт ею гостей с тропы.',
  },
  {
    tempId: 88, guestArc: 'apprentice', filler: true, name: 'Чтение коту',
    guest: { name: 'Ученик мага', icon: '🧙', art: 'assets/fate/guest_apprentice_web.jpg' },
    story: [
      { label: 'Что было', text: 'Экзамен сдан — стихия выбрана, ворота пройдены.', accept: ['gate'] },
      { label: 'Что есть', text: 'Теперь читаю гримуары вслух коту — знание на пару, запись вдвоём.', accept: ['book'] },
      { label: 'Что гнетёт', text: 'А вдруг башня запрется — ключ у учителя, а я снаружи?', accept: ['lock'] },
    ],
    intro: 'Ученик мага читает коту вслух. Кот слушает снисходительно.',
  },
  {
    tempId: 89, guestArc: 'merchant', filler: true, name: 'Выручка торговца',
    guest: { name: 'Торговец', icon: '🧮', art: 'assets/fate/guest_merchant_web.jpg' },
    story: [
      { label: 'Что было', text: 'Лоток трав жив — корзина не пустеет, сбор идёт.', accept: ['basket'] },
      { label: 'Что есть', text: 'Теперь сам считаю выручку — цена, расчёт, всё по чести.', accept: ['coin'] },
      { label: 'Что гнетёт', text: 'А вдруг долги снова сплетутся паутиной?', accept: ['web'] },
    ],
    intro: 'Торговец считает выручку сам. И опасается паутины долгов.',
  },
  {
    tempId: 90, guestArc: 'scribe', filler: true, name: 'Набело при свече',
    guest: { name: 'Летописец', icon: '🪶', art: 'assets/fate/guest_scribe_web.jpg' },
    story: [
      { label: 'Что было', text: 'Летопись лавки растёт — запись за записью, страница к странице.', accept: ['book'] },
      { label: 'Что есть', text: 'Теперь переписываю набело при свече — память и тепло строк.', accept: ['candle'] },
      { label: 'Что гнетёт', text: 'А вдруг крыша протечёт — рукопись под ливнем?', accept: ['rain'] },
    ],
    intro: 'Летописец переписывает набело. Крыша, говорят, протекает.',
  },
  {
    tempId: 91, guestArc: 'wanderer', filler: true, name: 'Гид ярмарки',
    guest: { name: 'Юная путница', icon: '🧕', art: 'assets/fate/guest_wanderer_web.jpg' },
    story: [
      { label: 'Что было', text: 'Кораблик вернул меня домой — странствие кончилось хорошо.', accept: ['ship'] },
      { label: 'Что есть', text: 'Теперь вожу гостей по ярмарке — радость и удача, солнце в ладошах.', accept: ['sun'] },
      { label: 'Что гнетёт', text: 'А вдруг заведу гостей не туда — развилка подведёт?', accept: ['gate'] },
    ],
    intro: 'Путница стала гидом ярмарки. Знает все витрины наперечёт.',
  },
  {
    tempId: 92, guestArc: 'gardener', filler: true, name: 'Печь и внуки',
    guest: { name: 'Старый садовник', icon: '🌱', art: 'assets/fate/guest_gardener_web.jpg' },
    story: [
      { label: 'Что было', text: 'Сад у дочери, гнёзда полны — я горд и спокоен.', accept: ['nest'] },
      { label: 'Что есть', text: 'Теперь сижу у печи с внуками — тишина добрая, сны рядом.', accept: ['moon'] },
      { label: 'Что гнетёт', text: 'А вдруг нитка памяти оборвётся — имена уплывут?', accept: ['thread'] },
    ],
    intro: 'Садовник греется у печи с внуками. Просит расклад о памяти.',
  },
  {
    tempId: 93, guestArc: 'shipwright', filler: true, name: 'Флотилия',
    guest: { name: 'Корабел', icon: '🚢', art: 'assets/fate/guest_shipwright_web.jpg' },
    story: [
      { label: 'Что было', text: 'Мост через гавань стоит — берега соединены, стук стих.', accept: ['bridge'] },
      { label: 'Что есть', text: 'Теперь делаю лодки-игрушки для детей перекрёстка — гладь и вёсла в миниатюре.', accept: ['boat'] },
      { label: 'Что гнетёт', text: 'А вдруг дети переломают их — конец флотилии?', accept: ['scissors'] },
    ],
    intro: 'Корабел строит флотилию игрушек для детей перекрёстка.',
  },
  {
    tempId: 94, guestArc: 'postman', filler: true, name: 'Телега почтальона',
    guest: { name: 'Почтальон', icon: '📮', art: 'assets/fate/guest_postman_web.jpg' },
    story: [
      { label: 'Что было', text: 'Маршрут через мост стал любимым — вести лечу налегке.', accept: ['letter'] },
      { label: 'Что есть', text: 'Теперь с телегой — оборот быстрей, движение лёгкое.', accept: ['wheel'] },
      { label: 'Что гнетёт', text: 'А вдруг посылка окажется под чужим замком — запертость?', accept: ['lock'] },
    ],
    intro: 'Почтальон разжился телегой. Вести летают быстрее.',
  },
  {
    tempId: 95, guestArc: 'owl', filler: true, name: 'Сова читает вслух',
    guest: { name: 'Сова-библиотекарь', icon: '🦉', art: 'assets/fate/guest_owl_web.jpg' },
    story: [
      { label: 'Что было', text: 'Фолиант дописан и заверен — печать на обложке, подпись внизу.', accept: ['seal'] },
      { label: 'Что есть', text: 'Теперь читаю гостям вслух по вечерам — полночь да мудрость.', accept: ['owl'] },
      { label: 'Что гнетёт', text: 'А вдруг голос улетит, как дым?', accept: ['smoke'] },
    ],
    intro: 'Сова читает свой фолиант гостям вслух. Полночные чтения.',
  },
  {
    tempId: 96, guestArc: 'potter', filler: true, name: 'Кружки для самовара',
    guest: { name: 'Гончар', icon: '🏺', art: 'assets/fate/guest_potter_web.jpg' },
    story: [
      { label: 'Что было', text: 'Большая печь стоит — обжиг идёт, кирпичи крепки.', accept: ['hammer'] },
      { label: 'Что есть', text: 'Теперь леплю кружки для самовара поварёнка — пар да беседа.', accept: ['samovar'] },
      { label: 'Что гнетёт', text: 'А вдруг холодок вернётся — глина трескается от узора льда?', accept: ['snowflake'] },
    ],
    intro: 'Гончар лепит кружки для самовара поварёнка.',
  },
];

// --- Дуги гостей: порядок историй внутри одного гостя сохраняется ---
const ARC = {
  watchman: [1, 37], owl: [2, 38, 61, 95], ranger: [3, 39, 62], alchemist: [4, 40],
  spider: [5, 41, 63, 85], knight: [6, 42], merchant: [7, 43, 89], wanderer: [8, 44, 91],
  gardener: [9, 31, 45, 55, 79, 92], sailor: [10, 46], scribe: [11, 47, 90], cat: [12, 48, 83],
  miller: [13, 70, 73], seamstress: [14, 82], beekeeper: [15, 71], smith: [16, 80],
  forester: [17, 87], fisherman: [18, 66, 77], baker: [19, 86], apprentice: [20, 88],
  elder: [21, 81], clockmaker: [22, 65, 76], mushroomer: [23], keeper: [24, 84],
  lamplighter: [25, 49], cook: [26, 50, 64, 75], glassblower: [27, 51, 74],
  shipwright: [28, 52, 93], piper: [29, 53], bridgewarden: [30, 54], postman: [32, 56, 94],
  dancer: [33, 57, 67], potter: [34, 58, 69, 96], cartographer: [35, 59, 68, 78],
  spirit: [36, 60, 72],
};

// Детерминированный ГСЧ (для перемешивания рук)
let rngState = 20261014;
function rng() {
  rngState = (rngState * 1103515245 + 12345) & 0x7fffffff;
  return rngState / 0x7fffffff;
}

const levels = new Map();
for (const l of FATE_PUZZLES) levels.set(Number(l.id.split('_')[1]), l);
for (const l of NEW_LEVELS) levels.set(l.tempId, l);

const TOTAL = levels.size; // 96 (84 дебютных + 12 филлеров)
const answersOf = (l) => [...new Set(l.story.flatMap((s) => s.accept))];

// Дуги: предыдущий уровень гостя должен стоять раньше
const arcPrev = new Map();
for (const chain of Object.values(ARC)) {
  chain.forEach((id, i) => { if (i > 0) arcPrev.set(id, chain[i - 1]); });
}

// Позиция 1 — судьба хранителя: сторож у двери (база колоды: 3 ответа + 3 обманки)
const order = [];
const circulation = [];
const circSet = new Set();
const debutAt = new Map(); // position -> новая карта (или null)
const placed = new Set();

function firstLevel() {
  const l = levels.get(1);
  order.push(l);
  placed.add(1);
  const base = [...answersOf(l), 'star', 'bread', 'mirror']; // обманки — скоро станут ответами
  for (const c of base) if (!circSet.has(c)) { circSet.add(c); circulation.push(c); }
  debutAt.set(1, []); // позиция 1 — база колоды, дебюта нет
}
firstLevel();

const allCardIds = () => [...Object.keys(FATE_CARDS), ...Object.keys(NEW_CARDS)];

function nextDebut() {
  // Самая востребованная невиданная карта среди оставшихся уровней
  // (иначе редкие ответы скапливаются в конце и запирают порядок)
  const demand = new Map();
  for (const l of levels.values()) {
    const id = l.tempId ?? Number(l.id.split('_')[1]);
    if (placed.has(id)) continue;
    for (const c of answersOf(l)) {
      if (!circSet.has(c)) demand.set(c, (demand.get(c) || 0) + 1);
    }
  }
  if (demand.size) return [...demand.entries()].sort((a, b) => b[1] - a[1])[0][0];
  return allCardIds().find((c) => !circSet.has(c)) || null;
}

let sinceFiller = 99; // филлеры не в начале
const circLenAt = [0, 6]; // длина оборота к каждой позиции (база 6 на первой)

for (let pos = 2; pos <= TOTAL; pos++) {
  const arcOk = (l) => {
    const id = l.tempId ?? Number(l.id.split('_')[1]);
    if (placed.has(id)) return false;
    if (id === 84) return false; // хозяин — только последним
    const prev = arcPrev.get(id);
    return prev == null || placed.has(prev);
  };
  const unseenOf = (l) => answersOf(l).filter((c) => !circSet.has(c));
  // Финал вечера закреплён последним: расклад для хозяина лавки
  const forced = pos === TOTAL ? levels.get(84) : null;

  let chosen = null;
  let relaxed = false;
  if (forced) {
    chosen = forced;
  } else {
    // Филлер-ход: давно не было филлера + есть полностью «виденный» филлер
    if (sinceFiller >= 7) {
      const fillers = [...levels.values()]
        .filter((l) => l.filler && arcOk(l) && unseenOf(l).length === 0)
        .sort((a, b) => a.tempId - b.tempId);
      if (fillers.length) chosen = fillers[0];
    }
    if (!chosen) {
      let candidates = [...levels.values()].filter((l) => {
        if (l.filler) return false; // филлеры — только своим ходом
        if (!arcOk(l)) return false;
        if (pos <= 12 && l.story.length > 3) return false; // 4 позиции — не в первой дюжине
        return unseenOf(l).length <= 1;
      });
      // Запасной ход: ни одного уровня с ≤1 невиданной картой — берём с двумя,
      // вторая новая карта входит обманкой (редко; докладываем в отчёте)
      if (!candidates.length) {
        relaxed = true;
        candidates = [...levels.values()].filter((l) => !l.filler && arcOk(l) && unseenOf(l).length <= 2);
      }
      // Все дебютные разошлись (колода исчерпана) — любой доступный филлер
      if (!candidates.length) {
        candidates = [...levels.values()].filter((l) => l.filler && arcOk(l));
      }
      if (!candidates.length) {
        const rest = [...levels.values()].filter((l) => {
          const id = l.tempId ?? Number(l.id.split('_')[1]);
          return !placed.has(id) && id !== 84;
        }).map((l) => `${l.tempId ?? l.id}:[${unseenOf(l).join(',')}]`);
        console.error(`Позиция ${pos}: клин. Остались:`, rest.join(' '));
        console.error('Невиданные карты:', allCardIds().filter((c) => !circSet.has(c)).join(', '));
        throw new Error(`Позиция ${pos}: нет допустимых уровней`);
      }
      // Предпочтение: уровень с дебютом-ответом, полегче, постарше по id
      candidates.sort((a, b) => {
        const ua = answersOf(a).filter((c) => !circSet.has(c)).length;
        const ub = answersOf(b).filter((c) => !circSet.has(c)).length;
        if (ub !== ua) return ub - ua;
        if ((a.difficulty || 3) !== (b.difficulty || 3)) return (a.difficulty || 3) - (b.difficulty || 3);
        return (a.tempId ?? Number(a.id.split('_')[1])) - (b.tempId ?? Number(b.id.split('_')[1]));
      });
      chosen = candidates[0];
    }
  }
  const id = chosen.tempId ?? Number(chosen.id.split('_')[1]);
  const unseen = unseenOf(chosen);
  const debuts = chosen.filler ? [] : (unseen.length ? unseen : [nextDebut()].filter(Boolean));
  for (const d of debuts) { circSet.add(d); circulation.push(d); }
  debutAt.set(pos, debuts);
  circLenAt[pos] = circLenAt[pos - 1] + debuts.length;
  if (relaxed && debuts.length > 1) console.warn(`  ⚠ позиция ${pos}: двойной дебют (${debuts.join(', ')})`);
  order.push(chosen);
  placed.add(id);
  sinceFiller = chosen.filler ? 0 : sinceFiller + 1;
}

// --- Руки: ответы + обманки из виденных; новая карта обязательно в руке ---
const usedAsAnswer = new Set();
const handCount = new Map(); // card -> сколько раз была в руках
const hands = new Map();

order.forEach((level, i) => {
  const pos = i + 1;
  const answers = answersOf(level);
  for (const c of answers) usedAsAnswer.add(c);
  const debuts = debutAt.get(pos) || [];
  const distractorsWanted = pos <= 42 ? 3 : pos <= 70 ? 4 : 5;
  // Обманки — только из карт, вошедших в игру к этому уровню
  // (оборот растёт по одной карте на дебютный уровень; филлеры его не растят)
  const seenSoFar = circulation.slice(0, circLenAt[pos]);
  const pool = seenSoFar.filter((c) => !answers.includes(c));
  // Предпочтение: ещё не бывшие ответами (учим заранее), затем редко бывшие в руках
  const sorted = [...pool].sort((a, b) => {
    const na = usedAsAnswer.has(a) ? 1 : 0;
    const nb = usedAsAnswer.has(b) ? 1 : 0;
    if (na !== nb) return na - nb;
    return (handCount.get(a) || 0) - (handCount.get(b) || 0);
  });
  const hand = [...answers];
  for (const d of debuts) if (!hand.includes(d)) hand.push(d);
  for (const c of sorted) {
    if (hand.length >= answers.length + distractorsWanted) break;
    if (!hand.includes(c)) hand.push(c);
  }
  // Перемешать (детерминированно), следя за антиспойлером
  for (let k = hand.length - 1; k > 0; k--) {
    const j = Math.floor(rng() * (k + 1));
    [hand[k], hand[j]] = [hand[j], hand[k]];
  }
  const trivial = level.story.every((part, si) => part.accept.includes(hand[si]));
  if (trivial) hand.push(hand.shift());
  for (const c of hand) handCount.set(c, (handCount.get(c) || 0) + 1);
  hands.set(pos, hand);
});

// --- Сложность и награды по позиции ---
function difficultyOf(pos, storyLen) {
  const band = pos <= 19 ? 1 : pos <= 38 ? 2 : pos <= 58 ? 3 : pos <= 77 ? 4 : 5;
  return Math.max(band, storyLen > 3 ? 3 : 1);
}
function rewardsOf(pos) {
  const coins = 300 + (pos - 1) * 13;
  const r = [{ type: 'coins', amount: coins }];
  if (pos === TOTAL) r.push({ type: 'seals', amount: 3 });
  else if (pos % 12 === 0) r.push({ type: 'seals', amount: 2 });
  return r;
}

// Интро: убираем устаревшие упоминания дебютов, «финалов» и размеров рук
// (порядок и награды переехали); последнему уровню — своё финальное интро
function cleanIntro(text, pos) {
  if (pos === TOTAL) return 'Последний расклад вечера — для хозяина лавки. Светлячок на столе.';
  return (text || '')
    .replace(/\s*(Новая карта на столе[^.]*\.|Дебют карты[^.]*\.|[^.]*колода входит в игру\.|Финал[^.]*\.|Девять карт[^.]*\.)/g, '')
    .trim();
}

// --- Эмиссия файла ---
const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const lines = [];
lines.push(`// Уровни «Карты судьбы»: гость рассказывает историю в 3–4 частях,`);
lines.push(`// хозяин раскладывает карты по позициям расклада. У карты — значения`);
lines.push(`// (теги смыслов, видны игроку при наведении); у позиции — accept: какие`);
lines.push(`// карты подходят. Карты с общим значением работают честными обманками.`);
lines.push(`//`);
lines.push(`// КОЛОДА РАСТЁТ: fate_01 — базовые 6 карт, дальше каждый дебютный уровень`);
lines.push(`// вводит ровно одну новую карту (ответом или обманкой); 96 уровней — 84 карты.`);
lines.push(`// Гости повторяются: новая история старого знакомого, новых портретов нет.`);
lines.push(`// Филлер-уровни (без новых карт) вставлены промежуточно, ~каждые 7–8.`);
lines.push(`// Файл пересобран генератором tools/fate-deck.mjs — правки историй вноси`);
lines.push(`// в него (или руками сюда, но тогда не запускай генератор поверх).`);
lines.push(`// Каждый уровень проверен валидатором в tests/fate.test.mjs.`);
lines.push(``);
lines.push(`// --- Колода: имя, иконка-фолбэк, значения (теги) ---`);
lines.push(`export const FATE_CARDS = {`);
const allCards = { ...FATE_CARDS, ...NEW_CARDS };
for (const c of Object.values(allCards)) {
  lines.push(`  ${c.id}: { id: ${q(c.id)}, name: ${q(c.name)}, icon: ${q(c.icon)}, meanings: [${c.meanings.map(q).join(', ')}] },`);
}
lines.push(`};`);
lines.push(``);
lines.push(`export const FATE_PUZZLES = [`);
order.forEach((level, i) => {
  const pos = i + 1;
  const id = `fate_${String(pos).padStart(2, '0')}`;
  const hand = hands.get(pos);
  lines.push(`  {`);
  lines.push(`    id: ${q(id)}, world: 'fate', mechanic: 'fate', name: ${q(level.name)}, difficulty: ${difficultyOf(pos, level.story.length)},`);
  lines.push(`    guest: { name: ${q(level.guest.name)}, icon: ${q(level.guest.icon)}, art: ${q(level.guest.art)} },`);
  lines.push(`    story: [`);
  for (const part of level.story) {
    lines.push(`      { label: ${q(part.label)}, text: ${q(part.text)}, accept: [${part.accept.map(q).join(', ')}] },`);
  }
  lines.push(`    ],`);
  lines.push(`    hand: [${hand.map(q).join(', ')}],`);
  lines.push(`    rewards: [${rewardsOf(pos).map((r) => `{ type: ${q(r.type)}, amount: ${r.amount} }`).join(', ')}],`);
  lines.push(`    intro: ${q(cleanIntro(level.intro, pos))},`);
  lines.push(`  },`);
});
lines.push(`];`);
lines.push(``);
lines.push(`export const FATE_PUZZLE_BY_ID = Object.fromEntries(FATE_PUZZLES.map((p) => [p.id, p]));`);
lines.push(``);

writeFileSync('src/data/puzzlesFate.js', lines.join('\n'), 'utf8');

// --- Отчёт ---
console.log(`Уровней: ${order.length}, карт в колоде: ${Object.keys(allCards).length}`);
console.log(`Карт в обороте к концу: ${circulation.length}`);
const missing = allCardIds().filter((c) => !circSet.has(c));
if (missing.length) console.log('НЕ ВОШЛИ В ОБОРОТ:', missing.join(', '));
for (let pos = 1; pos <= TOTAL; pos++) {
  const d = (debutAt.get(pos) || []).join('+') || '—';
  const l = order[pos - 1];
  const oldId = l.tempId ?? Number(l.id.split('_')[1]);
  console.log(`${String(pos).padStart(2, '0')}  fate_${String(pos).padStart(2, '0')}  (был ${oldId})  ${l.name}  +${d}`);
}
