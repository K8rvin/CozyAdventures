// Косметика лавки и сезонные наборы. Никакого влияния на силу —
// только красота (раздел 18 документа). Покупается за игровые монеты/печати.
export const COSMETICS = [
  // Круглый год
  { id: 'cos_carpet', name: 'Ковёр хранителя', icon: '🟥', price: 200, season: null,
    description: 'Глубокий бордовый ковёр в центре лавки.' },
  { id: 'cos_crest', name: 'Фирменная вывеска', icon: '🪧', sealPrice: 2, season: null,
    description: 'Резная вывеска «Лавка на перекрёстке миров».' },
  // Сезонные наборы
  { id: 'cos_flowers', name: 'Весенняя ярмарка: цветы', icon: '🌸', price: 120, season: 'spring',
    description: 'Полки в цветах. Пахнет первым дождём.' },
  { id: 'cos_fireflies', name: 'Летний фестиваль: светлячки', icon: '✨', price: 120, season: 'summer',
    description: 'Маленькие огоньки кружат над прилавком.' },
  { id: 'cos_garland', name: 'Осенний рынок: гирлянда', icon: '🎏', price: 120, season: 'autumn',
    description: 'Флажки и жёлуди под потолком.' },
  { id: 'cos_snow', name: 'Зимний очаг: снег за окном', icon: '❄️', price: 150, season: 'winter',
    description: 'За окном тихо падает снег. Внутри — тепло.' },
];

export const COSMETIC_BY_ID = Object.fromEntries(COSMETICS.map((c) => [c.id, c]));

export const SEASON_LABEL = {
  spring: 'Весна', summer: 'Лето', autumn: 'Осень', winter: 'Зима',
};
