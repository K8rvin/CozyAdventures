// Уровни головоломки «Витраж миров»: картина разрезана на сетку и перемешана,
// игрок меняет фрагменты местами, пока окно не «оживёт».
// grid: [cols, rows] — фрагменты квадратные, картинка кадрируется под сетку.
// image: путь к арту (пока — сцены миров; посвящённые арты — assets/glass/,
// промты в assets/PROMPTS.md, раздел «Витраж миров»).
// Каждый уровень проверен в tests/glass.test.mjs (подсказки всегда решают).

export const GLASS_PUZZLES = [
  {
    id: 'gl_01', world: 'meadow', mechanic: 'glass', name: 'Окно в опушку', difficulty: 1,
    grid: [3, 2], image: 'assets/glass/glass_meadow_web.jpg',
    rewards: [{ type: 'coins', amount: 60 }],
    intro: 'Перекрёстный ветер рассыпал витраж над дверью. Перетаскивай осколки и меняй их местами — собери Тихую опушку.',
  },
  {
    id: 'gl_02', world: 'town', mechanic: 'glass', name: 'Переулки Городка', difficulty: 1,
    grid: [3, 2], image: 'assets/glass/glass_town_web.jpg',
    rewards: [{ type: 'coins', amount: 65 }],
    intro: 'Кот гонял моль по полкам и задел раму. Верни площади Городка их вид.',
  },
  {
    id: 'gl_03', world: 'attic', mechanic: 'glass', name: 'Чердачный витраж', difficulty: 2,
    grid: [3, 3], image: 'assets/glass/glass_attic_web.jpg',
    rewards: [{ type: 'coins', amount: 70 }],
    intro: 'Девять стёклышек, и все перепутаны. Начни с углов — там обычно края рамы.',
  },
  {
    id: 'gl_04', world: 'market', mechanic: 'glass', name: 'Ярмарочное стекло', difficulty: 2,
    grid: [3, 3], image: 'assets/glass/glass_market_web.jpg',
    rewards: [{ type: 'coins', amount: 75 }],
    intro: 'Ночной рынок на стекле: палатки, огни, толпа. Собери суету по кусочкам.',
  },
  {
    id: 'gl_05', world: 'swamp', mechanic: 'glass', name: 'Топь в раме', difficulty: 2,
    grid: [4, 3], image: 'assets/glass/glass_swamp_web.jpg',
    rewards: [{ type: 'coins', amount: 80 }],
    intro: 'Туманная топь распалась на дюжину осколков. Смотри на тени и блики воды.',
  },
  {
    id: 'gl_06', world: 'fair', mechanic: 'glass', name: 'Праздник фонарей', difficulty: 3,
    grid: [4, 3], image: 'assets/glass/glass_fair_web.jpg',
    rewards: [{ type: 'coins', amount: 90 }, { type: 'item', id: 'pot_heal' }],
    intro: 'Гирлянды ярмарки путают даже кота. Фонарь к фонарю — и картина зажжётся.',
  },
  {
    id: 'gl_07', world: 'forge', mechanic: 'glass', name: 'Кузнечный узор', difficulty: 3,
    grid: [4, 3], image: 'assets/glass/glass_forge_web.jpg',
    rewards: [{ type: 'coins', amount: 95 }],
    intro: 'Искры горна прожгли картину на части. Собери жар кузницы обратно.',
  },
  {
    id: 'gl_08', world: 'crystal', mechanic: 'glass', name: 'Хрустальный грот', difficulty: 3,
    grid: [5, 3], image: 'assets/glass/glass_crystal_web.jpg',
    rewards: [{ type: 'coins', amount: 100 }],
    intro: 'Пятнадцать осколков, и каждый блестит по-своему. Грани подскажут соседей.',
  },
  {
    id: 'gl_09', world: 'jade', mechanic: 'glass', name: 'Нефритовый сад', difficulty: 4,
    grid: [5, 3], image: 'assets/glass/glass_jade_web.jpg',
    rewards: [{ type: 'coins', amount: 110 }],
    intro: 'Тихий сад Нефритового мира не терпит суеты. Собирай спокойно, осколок за осколком.',
  },
  {
    id: 'gl_10', world: 'grotto', mechanic: 'glass', name: 'Поющий грот', difficulty: 4,
    grid: [5, 3], image: 'assets/glass/glass_grotto_web.jpg',
    rewards: [{ type: 'coins', amount: 120 }],
    intro: 'Грот поёт, когда картина цела. Осталось вернуть ей голос из пятнадцати стёкол.',
  },
  {
    id: 'gl_11', world: 'clockwork', mechanic: 'glass', name: 'Часовой витраж', difficulty: 5,
    grid: [6, 4], image: 'assets/glass/glass_clockwork_web.jpg',
    rewards: [{ type: 'coins', amount: 140 }, { type: 'item', id: 'rng_luck' }],
    intro: 'Двадцать четыре шестерёнки-осколка. Кот уже крутит хвостом: время собирать.',
  },
  {
    id: 'gl_12', world: 'crossroads', mechanic: 'glass', name: 'Перекрёсток миров', difficulty: 5,
    grid: [6, 4], image: 'assets/glass/glass_crossroads_web.jpg',
    rewards: [{ type: 'coins', amount: 170 }, { type: 'seals', amount: 1 }],
    intro: 'Главный витраж лавки — сам перекрёсток миров. Собери его, и лавка засияет всеми дорогами сразу.',
  },
  // Вторая дюжина: витражная галерея дальних миров
  {
    id: 'gl_13', world: 'town', mechanic: 'glass', name: 'Площадь Городка', difficulty: 3,
    grid: [6, 2], image: 'assets/town_square_web.jpg',
    rewards: [{ type: 'coins', amount: 130 }],
    intro: 'Широкая панорама площади легла в узкое окно-фрамугу. Двенадцать длинных стёкол — найди, где чей край.',
  },
  {
    id: 'gl_14', world: 'attic', mechanic: 'glass', name: 'Стол алхимика', difficulty: 3,
    grid: [4, 3], image: 'assets/brew_table_web.jpg',
    rewards: [{ type: 'coins', amount: 135 }],
    intro: 'Алхимик заказал витраж своего стола: котёл, склянки, травы. Собери рабочее место мастера.',
  },
  {
    id: 'gl_15', world: 'nm', mechanic: 'glass', name: 'Ночной рынок', difficulty: 3,
    grid: [5, 3], image: 'assets/battle_bg_nm_web.jpg',
    rewards: [{ type: 'coins', amount: 140 }],
    intro: 'Ночной рынок горит фонарями даже на стекле. Огоньки помогут найти соседние осколки.',
  },
  {
    id: 'gl_16', world: 'sw', mechanic: 'glass', name: 'Сказочные топи', difficulty: 3,
    grid: [5, 3], image: 'assets/battle_bg_sw_web.jpg',
    rewards: [{ type: 'coins', amount: 145 }, { type: 'item', id: 'pot_vigor' }],
    intro: 'Болотный туман стёклышек не щадит. Хозяйка Топей обещала не мешать — почти.',
  },
  {
    id: 'gl_17', world: 'sf', mechanic: 'glass', name: 'Звёздная ярмарка', difficulty: 4,
    grid: [5, 4], image: 'assets/battle_bg_sf_web.jpg',
    rewards: [{ type: 'coins', amount: 155 }],
    intro: 'Двадцать осколков праздника: карусели, гирлянды, фейерверк. Ярмарка ждёт зрителей.',
  },
  {
    id: 'gl_18', world: 'cr', mechanic: 'glass', name: 'Хрустальные горы', difficulty: 4,
    grid: [5, 4], image: 'assets/battle_bg_cr_web.jpg',
    rewards: [{ type: 'coins', amount: 160 }],
    intro: 'Кристаллы на стекле играют всеми гранями. Не спеши — грань к грани, и горы встанут.',
  },
  {
    id: 'gl_19', world: 'ash', mechanic: 'glass', name: 'Пепельные степи', difficulty: 4,
    grid: [5, 4], image: 'assets/battle_bg_ash_web.jpg',
    rewards: [{ type: 'coins', amount: 165 }, { type: 'item', id: 'scr_frost' }],
    intro: 'Жар степей тронул даже витраж — краски расплылись по осколкам. Собери тёплый закат.',
  },
  {
    id: 'gl_20', world: 'deep', mechanic: 'glass', name: 'Подводный грот', difficulty: 4,
    grid: [5, 4], image: 'assets/battle_bg_deep_web.jpg',
    rewards: [{ type: 'coins', amount: 170 }],
    intro: 'Глубина на стекле: свет сквозь воду, ракушки, тени рыб. Собери грот до дна.',
  },
  {
    id: 'gl_21', world: 'jade', mechanic: 'glass', name: 'Нефритовый дворец', difficulty: 5,
    grid: [6, 4], image: 'assets/battle_bg_jade_web.jpg',
    rewards: [{ type: 'coins', amount: 180 }],
    intro: 'Двадцать четыре оттенка нефрита. Сад уже был — теперь собери его сердце.',
  },
  {
    id: 'gl_22', world: 'mist', mechanic: 'glass', name: 'Туманные часы', difficulty: 5,
    grid: [6, 4], image: 'assets/battle_bg_mist_web.jpg',
    rewards: [{ type: 'coins', amount: 190 }],
    intro: 'Часовой мир в тумане: стрелки, шестерни, мгла. Кот говорит — время собирать.',
  },
  {
    id: 'gl_23', world: 'tea', mechanic: 'glass', name: 'Чайный столик', difficulty: 5,
    grid: [7, 4], image: 'assets/tea_table_fire_3_web.jpg',
    rewards: [{ type: 'coins', amount: 200 }],
    intro: 'Двадцать восемь осколков уютного чайного стола. Самый заторный витраж сезона.',
  },
  {
    id: 'gl_24', world: 'shop', mechanic: 'glass', name: 'Сердце лавки', difficulty: 5,
    grid: [9, 3], image: 'assets/hub_banner_web.jpg',
    rewards: [{ type: 'coins', amount: 240 }, { type: 'seals', amount: 1 }],
    intro: 'Финальный витраж — сама лавка во всю ширину окна. Двадцать семь стёкол дома, который ты построил.',
  },
  // Третья серия: редкие форматы — вертикальный витраж, панорамы, максимум осколков
  {
    id: 'gl_25', world: 'attic', mechanic: 'glass', name: 'Книга рецептов', difficulty: 3,
    grid: [4, 3], image: 'assets/recipe_book_web.jpg',
    rewards: [{ type: 'coins', amount: 130 }],
    intro: 'Алхимик переплёл свою книгу в стекло: страницы, травы, чернильные пятна. Собери рецепт целиком.',
  },
  {
    id: 'gl_26', world: 'fate', mechanic: 'glass', name: 'Стол судьбы', difficulty: 4,
    grid: [4, 5], image: 'assets/fate/fate_table_web.jpg',
    rewards: [{ type: 'coins', amount: 145 }],
    intro: 'Вертикальный витраж — редкий гость в лавке. Стол гадалки, карты, свечи: судьба собирается снизу вверх.',
  },
  {
    id: 'gl_27', world: 'meadow', mechanic: 'glass', name: 'Рассвет опушки', difficulty: 4,
    grid: [5, 3], image: 'assets/battle_bg_meadow_web.jpg',
    rewards: [{ type: 'coins', amount: 150 }],
    intro: 'Та же опушка, но на рассвете: роса, туман, первые светлячки. Собери утро по осколкам.',
  },
  {
    id: 'gl_28', world: 'tea', mechanic: 'glass', name: 'Чай на рассвете', difficulty: 4,
    grid: [5, 3], image: 'assets/tea_table_fire_0_web.jpg',
    rewards: [{ type: 'coins', amount: 155 }],
    intro: 'Чайный столик до того, как разожгли огонь. Холодный, но всё равно уютный — собери его.',
  },
  {
    id: 'gl_29', world: 'tea', mechanic: 'glass', name: 'Чай в полдень', difficulty: 4,
    grid: [5, 4], image: 'assets/tea_table_fire_1_web.jpg',
    rewards: [{ type: 'coins', amount: 160 }, { type: 'item', id: 'pot_heal' }],
    intro: 'Огонёк только разгорается, чайник ещё не свистел. Двадцать осколков дневного уюта.',
  },
  {
    id: 'gl_30', world: 'tea', mechanic: 'glass', name: 'Чай в полночь', difficulty: 5,
    grid: [6, 4], image: 'assets/tea_table_fire_2_web.jpg',
    rewards: [{ type: 'coins', amount: 170 }, { type: 'item', id: 'scr_storm' }],
    intro: 'Полночный чай при живом огне — кот уже уснул рядом. Собери тихий вечер лавки.',
  },
  {
    id: 'gl_31', world: 'shop', mechanic: 'glass', name: 'Первый день', difficulty: 5,
    grid: [8, 4], image: 'assets/intro_web.jpg',
    rewards: [{ type: 'coins', amount: 185 }],
    intro: 'Витраж о том, как всё началось: ты, лавка и дорога к перекрёстку. Тридцать два осколка воспоминаний.',
  },
  {
    id: 'gl_32', world: 'town', mechanic: 'glass', name: 'Торговый ряд', difficulty: 5,
    grid: [9, 3], image: 'assets/town_market_web.jpg',
    rewards: [{ type: 'coins', amount: 195 }],
    intro: 'Длинная лента рынка: прилавок к прилавку. Узкая фрамуга путает даже старшего кота.',
  },
  {
    id: 'gl_33', world: 'shop', mechanic: 'glass', name: 'Кабинет трофеев', difficulty: 5,
    grid: [9, 3], image: 'assets/trophy_room_web.jpg',
    rewards: [{ type: 'coins', amount: 210 }, { type: 'item', id: 'rng_crit' }],
    intro: 'Твои трофеи — на стекле над камином. Собери кабинет, которым гордишься.',
  },
  {
    id: 'gl_34', world: 'attic', mechanic: 'glass', name: 'Все сокровища чердака', difficulty: 5,
    grid: [8, 5], image: 'assets/battle_bg_attic_web.jpg',
    rewards: [{ type: 'coins', amount: 250 }, { type: 'seals', amount: 1 }],
    intro: 'Сорок осколков — самый большой витраж лавки. Весь чердак, каждая коробка, каждая пылинка света.',
  },
  // Четвёртая серия: посвящённые арты assets/glass/ (промты — PROMPTS.md, раздел 17).
  // Пока файлов нет, играется процедурный витраж-заменитель, засеянный id уровня.
  {
    id: 'gl_35', world: 'shop', mechanic: 'glass', name: 'Зима у порога', difficulty: 3,
    grid: [5, 3], image: 'assets/glass/glass_winter_web.jpg',
    rewards: [{ type: 'coins', amount: 135 }],
    intro: 'Первый снег на вывеске лавки, следы кота на крыльце. Собери зимнее окно, пока оно не запотело.',
  },
  {
    id: 'gl_36', world: 'deep', mechanic: 'glass', name: 'Порт и маяк', difficulty: 3,
    grid: [5, 3], image: 'assets/glass/glass_harbor_web.jpg',
    rewards: [{ type: 'coins', amount: 140 }],
    intro: 'Ночной порт: лодки, канаты, маяк поверх всего. Свет маяка — лучший ориентир для осколков.',
  },
  {
    id: 'gl_37', world: 'meadow', mechanic: 'glass', name: 'Ветряная мельница', difficulty: 4,
    grid: [5, 4], image: 'assets/glass/glass_mill_web.jpg',
    rewards: [{ type: 'coins', amount: 150 }],
    intro: 'Пшеничное поле и старая мельница. Крылья крутятся на четырёх осколках — начни с них.',
  },
  {
    id: 'gl_38', world: 'mist', mechanic: 'glass', name: 'Обсерватория', difficulty: 4,
    grid: [5, 4], image: 'assets/glass/glass_observatory_web.jpg',
    rewards: [{ type: 'coins', amount: 160 }],
    intro: 'Телескоп, карты звёзд и открытый купол. Собери небо, которым любуется старший кот.',
  },
  {
    id: 'gl_39', world: 'attic', mechanic: 'glass', name: 'Подземная библиотека', difficulty: 4,
    grid: [6, 4], image: 'assets/glass/glass_library_web.jpg',
    rewards: [{ type: 'coins', amount: 170 }, { type: 'item', id: 'pot_stone' }],
    intro: 'Под лавкой нашлась библиотека корней и свечей. Двадцать четыре стёкла тишины.',
  },
  {
    id: 'gl_40', world: 'jade', mechanic: 'glass', name: 'Кленовый лес', difficulty: 4,
    grid: [6, 4], image: 'assets/glass/glass_maple_web.jpg',
    rewards: [{ type: 'coins', amount: 175 }],
    intro: 'Осень в кленовом лесу: каждый осколок горит своим оттенком. Лист к листу — и лес цел.',
  },
  {
    id: 'gl_41', world: 'ash', mechanic: 'glass', name: 'Горячие источники', difficulty: 5,
    grid: [6, 4], image: 'assets/glass/glass_springs_web.jpg',
    rewards: [{ type: 'coins', amount: 185 }, { type: 'item', id: 'scr_heal_mist' }],
    intro: 'Пар над термальными бассейнами запутал витраж основательно. Дыши ровно и собирай.',
  },
  {
    id: 'gl_42', world: 'cr', mechanic: 'glass', name: 'Ледяной дворец', difficulty: 5,
    grid: [6, 4], image: 'assets/glass/glass_icepalace_web.jpg',
    rewards: [{ type: 'coins', amount: 195 }],
    intro: 'Дворец из льда и света. Осколки похожи, как снежинки, — но кот знает: одинаковых нет.',
  },
  {
    id: 'gl_43', world: 'nm', mechanic: 'glass', name: 'Лунная роща', difficulty: 5,
    grid: [7, 4], image: 'assets/glass/glass_moongrove_web.jpg',
    rewards: [{ type: 'coins', amount: 205 }],
    intro: 'Роща, где луна застряла между ветвей. Двадцать восемь осколков серебра.',
  },
  {
    id: 'gl_44', world: 'meadow', mechanic: 'glass', name: 'Улей на лугу', difficulty: 5,
    grid: [7, 4], image: 'assets/glass/glass_apiary_web.jpg',
    rewards: [{ type: 'coins', amount: 215 }],
    intro: 'Пчёлы перепутали соты и стёкла. Собери луг, пока мёд не стёк по раме.',
  },
  {
    id: 'gl_45', world: 'deep', mechanic: 'glass', name: 'Перекрёсток течений', difficulty: 5,
    grid: [9, 3], image: 'assets/glass/glass_lighthouse_web.jpg',
    rewards: [{ type: 'coins', amount: 230 }],
    intro: 'Маяк там, где встречаются морские дороги миров. Длинная фрамуга для дальнего пути.',
  },
  {
    id: 'gl_46', world: 'shop', mechanic: 'glass', name: 'Дом у камина', difficulty: 5,
    grid: [8, 5], image: 'assets/glass/glass_hearth_web.jpg',
    rewards: [{ type: 'coins', amount: 260 }, { type: 'seals', amount: 1 }],
    intro: 'Самый тёплый витраж: камин, кресло, кот клубком. Сорок осколков дома. Ты дошёл до конца — чай уже заварен.',
  },
  // Пятая серия: посвящённые арты assets/glass/ (промты — PROMPTS.md, раздел 17).
  {
    id: 'gl_47', world: 'town', mechanic: 'glass', name: 'Пекарня на рассвете', difficulty: 3,
    grid: [5, 3], image: 'assets/glass/glass_bakery_web.jpg',
    rewards: [{ type: 'coins', amount: 145 }],
    intro: 'Пекарня Городка перед открытием: хлеба рядами, мука в лучах. Собери утренний запах.',
  },
  {
    id: 'gl_48', world: 'sw', mechanic: 'glass', name: 'Грибная поляна', difficulty: 3,
    grid: [5, 3], image: 'assets/glass/glass_mushrooms_web.jpg',
    rewards: [{ type: 'coins', amount: 150 }],
    intro: 'После дождя поляна вспыхнула грибами. Хозяйка Топей просила не перепутать поганки с опятами.',
  },
  {
    id: 'gl_49', world: 'jade', mechanic: 'glass', name: 'Оранжерея', difficulty: 4,
    grid: [5, 4], image: 'assets/glass/glass_greenhouse_web.jpg',
    rewards: [{ type: 'coins', amount: 160 }],
    intro: 'Стекло в стекле: оранжерея Нефритового сада, где зима не бывает. Двадцать тёплых осколков.',
  },
  {
    id: 'gl_50', world: 'deep', mechanic: 'glass', name: 'Водопад и радуга', difficulty: 4,
    grid: [5, 4], image: 'assets/glass/glass_waterfall_web.jpg',
    rewards: [{ type: 'coins', amount: 165 }],
    intro: 'Водопад держит радугу на весу. Поймай семь цветов обратно в раму.',
  },
  {
    id: 'gl_51', world: 'sf', mechanic: 'glass', name: 'Праздник тыкв', difficulty: 4,
    grid: [6, 4], image: 'assets/glass/glass_pumpkins_web.jpg',
    rewards: [{ type: 'coins', amount: 175 }],
    intro: 'Осенняя ярмарка тыкв: все светятся, все улыбаются. Найди, где чья улыбка.',
  },
  {
    id: 'gl_52', world: 'meadow', mechanic: 'glass', name: 'Подснежники', difficulty: 4,
    grid: [6, 4], image: 'assets/glass/glass_snowdrops_web.jpg',
    rewards: [{ type: 'coins', amount: 180 }, { type: 'item', id: 'scr_fire_step' }],
    intro: 'Снег ещё лежит, а подснежники уже проснулись. Собери первую весну лавки.',
  },
  {
    id: 'gl_53', world: 'mist', mechanic: 'glass', name: 'Парусник в облаках', difficulty: 5,
    grid: [7, 4], image: 'assets/glass/glass_skyship_web.jpg',
    rewards: [{ type: 'coins', amount: 190 }],
    intro: 'Небесный парусник пришвартовался к облаку. Двадцать восемь осколков попутного ветра.',
  },
  {
    id: 'gl_54', world: 'crossroads', mechanic: 'glass', name: 'Станция миров', difficulty: 5,
    grid: [7, 4], image: 'assets/glass/glass_station_web.jpg',
    rewards: [{ type: 'coins', amount: 200 }],
    intro: 'Межмировой поезд стоит у перроны. Кот проверяет билеты, ты — стёкла. Отправление через осколок!',
  },
  {
    id: 'gl_55', world: 'nm', mechanic: 'glass', name: 'Рынок специй', difficulty: 5,
    grid: [9, 3], image: 'assets/glass/glass_spices_web.jpg',
    rewards: [{ type: 'coins', amount: 210 }],
    intro: 'Длинный ряд специй: корица, шафран, звёздный анис. Панорама пахнет так, что чихается.',
  },
  {
    id: 'gl_56', world: 'attic', mechanic: 'glass', name: 'Совиное гнездо', difficulty: 5,
    grid: [6, 4], image: 'assets/glass/glass_owlnest_web.jpg',
    rewards: [{ type: 'coins', amount: 220 }, { type: 'item', id: 'amu_hearth' }],
    intro: 'Сова-библиотекарь свила гнездо между шкафами. Собери её читальный зал.',
  },
  {
    id: 'gl_57', world: 'deep', mechanic: 'glass', name: 'Коралловый сад', difficulty: 5,
    grid: [7, 4], image: 'assets/glass/glass_coral_web.jpg',
    rewards: [{ type: 'coins', amount: 230 }],
    intro: 'Кораллы перегораживают течение, рыбы снуют между ветвей. Сад собирается ветка к ветке.',
  },
  {
    id: 'gl_58', world: 'shop', mechanic: 'glass', name: 'Праздник урожая', difficulty: 5,
    grid: [8, 5], image: 'assets/glass/glass_harvest_web.jpg',
    rewards: [{ type: 'coins', amount: 270 }, { type: 'seals', amount: 1 }],
    intro: 'Вся лавка уставлена дарами осени, и кот — генеральный дегустатор. Сорок осколков благодарности.',
  },
];

export const GLASS_PUZZLE_BY_ID = Object.fromEntries(GLASS_PUZZLES.map((p) => [p.id, p]));
