// Оформление 100 «Загадок Хранителя» как десяти книжных глав по 10 уровней.
// Это только данные представления: правила, награды и порядок уровней не меняются.
import { BOOK_PUZZLES } from './puzzlesBook.js';

export const RIDDLE_CHAPTERS = [
  {
    theme: 'dawn', name: 'Первые чернила', icon: '☼', ornament: '❦', catPose: 'alert',
    catArt: 'assets/fate/guest_cat_web.jpg',
    greeting: 'Хранитель открывает первую главу и разглаживает страницу лапой.',
  },
  {
    theme: 'rain', name: 'Дождь за окном', icon: '╱', ornament: '╱ ╱ ╱', catPose: 'right',
    catArt: 'assets/fate/guest_cat_web.jpg',
    greeting: 'За окном шумит дождь, а кот смотрит на тёмное стекло.',
  },
  {
    theme: 'herbs', name: 'Травяной полдень', icon: '❧', ornament: '❧ ❧', catPose: 'left',
    catArt: 'assets/fate/guest_cat_web.jpg',
    greeting: 'Рядом со страницей пахнет сухими травами и летом.',
  },
  {
    theme: 'amber', name: 'Осенние чернила', icon: '◆', ornament: '❦', catPose: 'close',
    catArt: 'assets/fate/guest_cat_web.jpg',
    greeting: 'Пахнет сухими листьями; Хранитель особенно тих.',
  },
  {
    theme: 'frost', name: 'Зимние узоры', icon: '❄', ornament: '❄ ❄', catPose: 'close',
    catArt: 'assets/fate/guest_cat_web.jpg',
    greeting: 'Мороз рисует на стекле, а кот греет лапы у свечи.',
  },
  {
    theme: 'dawn', name: 'Рассветная библиотека', icon: '☼', ornament: '✦ ❦', catPose: 'right',
    catArt: 'assets/fate/guest_cat_web.jpg',
    greeting: 'Свет ползёт по корешкам книг: новая глава уже ждёт.',
  },
  {
    theme: 'rain', name: 'Шёпот стекла', icon: '╱', ornament: '╱ ╱ ╱', catPose: 'close',
    catArt: 'assets/fate/guest_cat_web.jpg',
    greeting: 'Капли стучат по стеклу в такт осторожным буквам.',
  },
  {
    theme: 'herbs', name: 'Аромат лета', icon: '❧', ornament: '❧ ❦', catPose: 'left',
    catArt: 'assets/fate/guest_cat_web.jpg',
    greeting: 'Кот принёс на стол свежий листок и пучок душистых трав.',
  },
  {
    theme: 'amber', name: 'Золотая библиотека', icon: '◆', ornament: '◆ ❦', catPose: 'alert',
    catArt: 'assets/fate/guest_cat_web.jpg',
    greeting: 'Поздний свет делает чернила почти золотыми.',
  },
  {
    theme: 'frost', name: 'Северная сказка', icon: '❄', ornament: '❄ ✦', catPose: 'alert',
    catArt: 'assets/fate/guest_cat_web.jpg',
    greeting: 'За последней главой — тишина снега и тёплое мурлыкание.',
  },
];

const RIDDLE_INDEX = new Map(
  BOOK_PUZZLES.filter((p) => p.mechanic === 'riddle').map((p, i) => [p.id, i]),
);

export function riddleChapter(level) {
  const index = RIDDLE_INDEX.get(level.id) ?? 0;
  const chapterIndex = Math.floor(index / 10);
  const chapter = RIDDLE_CHAPTERS[chapterIndex] || RIDDLE_CHAPTERS[0];
  return {
    ...chapter,
    number: chapterIndex + 1,
    levelInChapter: (index % 10) + 1,
    finale: index % 10 === 9,
  };
}
