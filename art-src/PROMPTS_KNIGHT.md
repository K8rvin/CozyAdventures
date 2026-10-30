# Комната рыцаря — художественное ТЗ и промты layered 2D-портрета

Это самостоятельное ТЗ для ручной генерации и подготовки арта. Оно не добавляет
предметы, не меняет их дизайн и не заменяет файлы изображений. Каталог ниже покрывает
**все 122 предмета** из `game/src/data/items.js`: **109 equipment + 13 consumable**.
Дизайн каждого предмета взят дословно из разделов 18 и 23 `art-src/PROMPTS.md`.

## 0. Актуальная production-схема: два тела и семейства

Практическая инструкция и рабочий dev-скрипт: `art-src/KNIGHT_ITEM_GUIDE.md` и
`game/tools/prepare-knight-item.py` (сначала dry-run, `--apply` только после приёмки).

Этот раздел заменяет технические требования разделов 2–5 к первой версии pipeline.
Описания предметов из раздела 6 и правила QA из разделов 7–8 остаются действующими.

- **Два базовых образа:** `male` и `female`, оба явно взрослые, в романтической
  сказочной гуаше. Никакой современной одежды. Лёгкая сексуализация через пластику,
  не через наготу или изменение конструкции предметов.
- **Мастер каждого тела:** `art-src/knight/doll/<bodyId>/full.png`. Он содержит тело,
  волосы и кисти в правильном масштабе и служит для difference с item composite.
  `body.png` — то же тело без отдельных кистей, `hands.png` — кисти отдельно.
  `hands_base.png` — утверждённый reusable-шаблон кулака для будущих наручей;
  `hands.png` — его вариант со срезом по нижний край конкретного рукава, включая
  диагональные срезы. Не перезаписывать шаблон при подгонке под новую броню.
  Маска кисти строится по фактическому контуру пальцев и короткого запястья, а не
  по широкому полигону вокруг руки: одежда и тени ткани остаются в body и не
  попадают в hands. Обязательна отдельная проверка области сжатого кулака.
  Волосы запечены в body: отдельные hair_back/hair_front больше не создаются и не
  требуются. `full.png` не идёт в runtime.
- **Кадр и alpha:** итоговые PNG ровно 1536×1920 (4:5), RGBA. Белый фон удаляется
  заливкой от краёв И отдельной проверкой замкнутых белых карманов между рукой,
  торсом, ногами и прядями волос. Numpy-маска перед floodfill обязательно `.copy()`.
  Проверка только углов недостаточна: нужны просмотр на светлом/тёмном фоне и
  контроль непрозрачных белых компонентов.
- **Unisex предметы:** `art-src/knight/parts/<itemId>.png` (+`__back`/`__grip`
  по rules). **Body-specific:** броня и предметы из `KNIGHT_DOLL_BODY_VARIANT_ITEMS` —
  `art-src/knight/parts/<bodyId>/<itemId>.png`. Runtime повторяет структуру в WebP 768×960.
- **Производство:** сначала золотая база, затем семейства с общим шаблоном промта и
  регистрацией кадра. Броня использует принятый difference с item composite. Оружие,
  щиты и расходники генерируются ИЗОЛИРОВАННО, без тела и кистей, затем получают alpha,
  равномерный scale и anchor через `game/tools/prepare-knight-layer.py`. Difference
  неброни и геометрический перенос инвентарных иконок остановлены.
- **Принятая броня:** `arm_ash_wayfarer` сделана на обоих телах через difference с
  `full.png`; кисти удалены по `hands_base.png` со срезом по рукаву. Слой `__back`
  для этой брони не нужен: видимые области плаща уже выделены difference-маской.
- **Принятый isolated-пилот:** `wpn_rusty_sword` и `shd_wooden` — один unisex-комплект
  на обоих телах, проверенный в Chrome; transform и маска зафиксированы в
  `KNIGHT_ITEM_GUIDE.md`. Female-дубли не нужны. Следующие расходники и предметы
  сначала проверяем как unisex; body-specific добавляем только при несовместимости.
  У щита деревянный `__back` под телом, main с ремнями — над кистью. До готовности
  обязательных слоёв комната показывает цельный fallback. Промт, master, metadata
  и пустой manifest не считаются готовым артом.

## 1. Цель и неизменные границы

Нужен полностью одетый layered 2D-портрет рыцаря в его комнате, а не новая боевая
модель и не набор квадратных иконок.

- **Стиль:** романтическая сказочная гуашь с мягкой акварельной фактурой и
  тёплыми ink outlines, выразительные силуэты и лица, правдоподобные материалы.
  Не фотореализм, не плоский вектор и не пластиковый 3D-render.
- **Пропорции:** естественные, слегка вытянутые пропорции взрослых персонажей;
  без chibi, огромной головы и кукольно коротких конечностей.
- **Кадр:** полный рост, 3/4, корпус немного повёрнут вправо по изображению, взгляд
  к зрителю. Камера, масштаб, кадрирование и горизонт неизменны для всех слоёв.
- **Поза:** спокойная, НЕбоевая. Плечи расслаблены, стопы стоят на полу, оружие
  опущено или спокойно опирается на пол. Никаких замахов, выпадов, натянутой тетивы,
  бега и эффектов атаки.
- **Две базы:** утверждённые `male` и `female`, каждая со своим лицом, причёской,
  анатомией и `full.png` мастером. Предметы не меняют эти признаки, позу, кисти,
  постановку стоп или освещение соответствующего тела.
- **Свет:** тёплый мягкий свет сверху слева; направление теней и бликов одинаковое
  на базе и на каждом предмете. Свеча в комнате — вторичный, более слабый источник.
- **Цвет:** никаких neon rarity recolor. Редкость не перекрашивает предмет и не
  добавляет фиолетовую/золотую аура. Фон редкости инвентарной иконки в портрет не
  переносится. Магические огоньки остаются локальными и сдержанными.
- **Запрещено:** надписи, буквы, числа, логотипы, watermark, рамки интерфейса,
  шахматка «прозрачности», белый ореол, лишнее снаряжение и новые декоративные
  элементы, которых нет в референсе конкретного предмета.
- **Бой не меняется:** боевые `knight`, `knight_twohanded`, `knight_bow`,
  `knight_staff` из `PROMPTS_BATTLE.md` остаются отдельной системой. Их позы 78–80
  нельзя копировать в комнату; оттуда берём только уже установленный принцип
  «двуручное/лук/посох — без щита» и колчан лучника за спиной.

`game/assets/knight/icon_knight_web.jpg` задаёт общий добрый характер и акварельную
мягкость лица. Его шлем и латный ворот не являются базовой экипировкой нового портрета.

## 2. Технический contract

### 2.1. Размеры, пути и форматы

**Исходники:** ровно **1536×1920 px, 4:5**. **Runtime:** ровно **768×960 px**,
масштаб ровно 1/2. Сначала собираем и регистрируем полный кадр 1536×1920, затем
уменьшаем весь кадр; не масштабируем предметы по отдельности.

Каноническая структура исходников:

```text
art-src/knight/
  room.png                       # предпочтительно; допускается room.jpg
  doll/
    body.png
    hair_back.png
    hair_front.png
    hands.png
  parts/
    <itemId>.png                 # основной слой каждого предмета
    arm_ink_cloak__back.png
    arm_swamp_weave__back.png
    wpn_hunter_bow__back.png
```

- `room.png` / `room.jpg` — полная неподвижная комната без рыцаря и питомцев. JPG
  допустим только потому, что комнате не нужна прозрачность.
- Все остальные исходники — **RGBA PNG полного кадра 1536×1920 с настоящей
  прозрачностью**, даже если непрозрачные пиксели занимают лишь малую часть холста.
  Не обрезать по bounding box и не делать квадратными.
- Runtime экспортируется конвейером в `game/assets/knight/` в WebP 768×960 — это
  формат текущего loader. Не переименовывать PNG в WebP вручную.
- В таблицах каталога указаны имена **PNG-исходников**. Основной слой всегда
  `parts/<itemId>.png`; обязательный референс дизайна — уже существующий
  `game/assets/items/<itemId>_web.jpg`, а не иконка другого предмета.
- Дополнительный `__grip.png` допустим только при явном `grip: true` в
  `KNIGHT_DOLL_ITEM_RULES`. Для текущих 122 предметов таких правил нет: не создавать
  лишние grip-файлы. Базовые `hands` уже располагаются над оружием.
- Питомцы, интерфейс, тени пустых слотов и инвентарные иконки в этот набор не входят.

### 2.2. Порядок слоёв

Z-порядок фиксирован `game/src/data/knightDoll.js`. Не компенсировать ошибки порядка
перерисовкой отдельных предметов.

| z | Слой | Что там находится |
|---:|---|---|
| 0 | `room` | только комната |
| 10 | `back` | задняя часть двух плащей; колчан лука |
| 15 | `hairBack` | задняя часть базовых волос |
| 20 | `body` | лицо, голова без волос, шея, корпус, руки до запястий, нательная одежда |
| 30 | `boots` | надетые сапоги |
| 40 | `armor` | передняя часть брони/одежды, ворот и застёжка плаща |
| 45 | `hairFront` | верх волос, чёлка и передние пряди |
| 50 | `weapon` | оружие в опущенном спокойном положении |
| 60 | `hands` | базовые кисти либо надетые перчатки; база скрывается при перчатках |
| 65 | `grip` | только будущий явно заданный special grip, не обязательный файл |
| 70 | `shield` | щит на свободной руке слева по изображению |
| 80 | `amulet` | подвеска поверх брони |
| 85 | `belt` | закрытые зелья и свёрнутые свитки на поясе |
| 90 | `ring` | кольца на пальцах |
| 100 | `helmet` | надетый шлем/капюшон/венок/корона |
| 110 | `pet` | существующий питомец, отдельно от этого ТЗ |

### 2.3. Special rules и производные файлы

| Предмет/слот | Обязательное правило |
|---|---|
| `arm_ink_cloak` | `parts/arm_ink_cloak.png` — ворот, застёжка и передние полы; `parts/arm_ink_cloak__back.png` — заднее полотнище. Не дублировать весь плащ в обоих файлах. |
| `arm_swamp_weave` | `parts/arm_swamp_weave.png` + `parts/arm_swamp_weave__back.png`; разделение такое же, туманные нити не закрывают лицо. |
| `wpn_hunter_bow` | `parts/wpn_hunter_bow.png` — опущенный лук и одна стрела с серебристым оперением вдоль плеча лука; `parts/wpn_hunter_bow__back.png` — только колчан со стрелами за спиной, без второго лука. |
| `hlm_leather` | `hideBase: ['hairBack', 'hairFront']`; капюшон сам закрывает всю причёску. |
| `hlm_page_wanderer` | `hideBase: ['hairBack', 'hairFront']`; вся причёска скрыта мягким капюшоном. |
| `hlm_nm_lantern` | `hideBase: ['hairBack']`; передняя чёлка остаётся и не пересекает фонарь. |
| любой `ring` | Один рисунок для `ring1`. Экспортер создаёт `<itemId>__ring2` сдвигом того же изображения: `dx=0.23` ширины, `dy=0.005` высоты. В runtime 768×960 это `+177 px`, `+5 px`. |
| любой `consumable` в `belt1` | Один рисунок для `belt0`. Экспортер создаёт `<itemId>__belt2` сдвигом: `dx=0.11` ширины, `dy=0.005` высоты; в runtime `+84 px`, `+5 px`. |

`ring2` и `belt2` — **экспортные варианты, не вторая AI-генерация**. Не менять в них
дизайн, масштаб, поворот, свет или альфу. Сдвиг выполняется на полном исходном кадре,
затем весь кадр уменьшается; нормированный сдвиг соответствует указанным runtime-
пикселям. Край не должен обрезать предмет. Одинаковые два кольца и одинаковые два
зелья обязаны выглядеть как один и тот же предмет в двух слотах.

### 2.4. Экспорт, manifest и fallback

Пока каталог неполон, экспортируем волну по явным id, чтобы ещё не нарисованные вещи
не делали всю команду неуспешной. Подставь реальные id вместо `ID_1 ID_2`; обязательную
базу указывай при её экспорте. Команды из каталога `game/`:

```bash
npm run knight:art -- room male_body male_hands female_body female_hands ID_1 ID_2
node tools/build-knight-art.mjs --check room male_body male_hands female_body female_hands ID_1 ID_2
npm run build && npm test
```

Для `armor` обычный item id выбирает обе версии, `male/<itemId>` и
`female/<itemId>` — только одну. Пример: `--check female/arm_ash_wayfarer`.
Отдельные hair-файлы в команды больше не входят; `full.png` не экспортируется.

Когда исходники всех 122 предметов готовы, полный экспорт и полная проверка:

```bash
npm run knight:art
node tools/build-knight-art.mjs --check
npm run build && npm test
```

- `npm run knight:art` — локальный Node + Python/Pillow конвейер уже подготовленных
  файлов, а не вызов генеративной модели. Он уменьшает полные кадры, создаёт WebP,
  экспортные `ring2`/`belt2` и manifest только по реально существующим файлам.
- Выборочный успешный экспорт сам обновляет manifest, сохраняя файлы других волн.
  `--manifest-only` нужен лишь чтобы заново зарегистрировать УЖЕ экспортированные
  WebP без повторной обработки; после него тоже обязателен `npm run build`.
- `game/src/data/knightDollAssets.js` — производный manifest, не список обещаний.
  Не вписывать туда пути руками и не регистрировать metadata без изображения.
- `--check` ничего не записывает: проверяет размеры, кадр, alpha, обязательные пары
  main/back и сдвиги вторых слотов. Manifest и существующие runtime WebP отдельно
  проверяет `tests/knightDoll.test.mjs`. Отсутствующий предмет не заменяется заглушкой.
- До появления всех обязательных загруженных слоёв текущего комплекта работает старый
  векторный fallback целиком; недопустима смесь fallback-частей и нового портрета.
  Питомец имеет собственный независимый fallback.
- Промт, запись в этом MD, metadata или пустой manifest **не являются готовым артом**.

## 3. Единый reference contract базы

### 3.1. Внешность и цвет

Эти признаки фиксируются после утверждения `body.png` и не пересматриваются от вещи к
вещи. HEX — контрольные референсы для ручной цветокоррекции, а не требование получить
однотонную заливку от модели.

| Признак | Фиксированное значение |
|---|---|
| Личность | молодой взрослый рыцарь лавки, ранние двадцатые, доброе спокойное лицо |
| Кожа | тёплая светлая; база около `#D9A57F`, свет `#F2C8A5`, тень `#B9785E` |
| Глаза | тёмно-карие, небольшой мягкий блик, без аниме-увеличения |
| Брови/волосы | тёмный каштан `#4A3026`; пряди на свету `#76503A` |
| Лицо | мягкие прямые брови, небольшой нос, лёгкая улыбка закрытым ртом, без бороды и шрамов |
| Причёска | короткие слегка растрёпанные волосы, боковой пробор, мягкая чёлка набок |
| Нательный слой | рубашка небелёного льна `#D8C8A9`, простые брюки `#6F6252`, домашние башмаки `#7A5238` |
| Контур | мягкий тёплый коричневый `#4A352A`, не чисто чёрный |
| Свет | тёплый `#FFE1B0` сверху слева; тени приглушённые, без цветного neon |

Базовая одежда — не equipment: она остаётся под предметами и в прозрачных участках.
В `body.png` нет съёмных вещей: ни доспеха, камзола equipment, обуви equipment,
перчаток, колец, амулета, поясных зелий, свитков, оружия, щита, шлема или плаща.
Волосы и кисти рук тоже не запечатаны в `body.png`.

### 3.2. Анатомические anchors

Координаты даны от левого верхнего угла. Сначала указан исходник 1536×1920, в скобках —
runtime 768×960. Это общие anchors для генерации, ручной вырезки и регистрации всех
слоёв, а не ориентиры, которые можно двигать ради отдельного предмета.

| Anchor | Координата / линия | Назначение |
|---|---|---|
| Макушка и центр головы | макушка `(768,160)` `(384,80)`; центр `(768,280)` `(384,140)`; подбородок около `y=384` `(192)` | размер головы, посадка волос и всех helmets |
| Плечи | центр `(768,480)` `(384,240)`; линия примерно от `(570,490)` до `(950,470)` | ворот, наплечники, плащи, задний колчан |
| Талия и пояс | центр талии `(768,880)` `(384,440)`; линия пояса `y=900` `(450)` | низ брони, belt0; первый расходник около `(680,900)` `(340,450)` |
| Свободная кисть слева по изображению | центр `(596,980)` `(298,490)` | расслабленная кисть, крепление щита, основной ring1 |
| Рабочая кисть справа по изображению | центр `(950,980)` `(475,490)` | неизменный спокойный хват оружия; пальцы поверх рукояти |
| Сапоги и пол | лодыжки `(650,1580)` `(325,790)` и `(890,1580)` `(445,790)`; подошвы на `y=1750` `(875)` | посадка обуви, длина брюк, контакт с ковром |

Допуск ручной регистрации — не более 2 px в runtime для кистей/рукоятей и не более
4 px для остальных anchors; расхождение больше исправляется перерегистрацией слоя.
Расстояние между центрами кистей соответствует экспортному сдвигу `ring2` +177 px.

Свободная кисть полуоткрыта и расслаблена. Рабочая кисть мягко охватывает условную
вертикальную рукоять. Двуручное оружие в комнате можно спокойно удерживать одной
рукой за рукоять, пока оно опирается на пол; вторая рука остаётся свободной. Это
не боевой хват и не изменение свойства `hand: 'two'`: щит всё равно скрывается.

## 4. Готовые base prompts

Порядок работы: сначала комната, затем тело; после утверждения тела — волосы и кисти
по нему как по позиционному референсу. Собрать базовый композит в графическом
редакторе и заморозить его. Любое изменение базы после вертикального среза требует
повторной регистрации уже готовых предметов, а не незаметной подгонки каждого нового.

Для всех изолированных слоёв запрашиваем именно `plain solid white background`, затем
вырезаем вручную/скриптом. Не просим модель нарисовать «transparent background»:
так часто появляется нарисованная шахматка, а не alpha.

### 4.1. `room.png` или `room.jpg`

```text
Detailed storybook realism, hand-painted watercolor with soft warm-brown ink outlines, a cozy knight's private room inside a magical shop, warm honey-colored wooden walls and floor, a woven muted russet-and-moss rug, a simple empty wooden armour stand and a tall oval mirror along the back wall, one lit beeswax candle on a small side table, a few neatly arranged shelves only near the edges, a large clear open floor and wall area in the center and on the right reserved for a full-body character and pets, no person, no pets, no armor or clothes on the stand, no weapons or clutter in the central silhouette area, full-room portrait composition, camera at standing eye level with a very mild three-quarter interior perspective, warm soft light from the upper left, a subtle secondary candle glow, realistic wood grain, linen, brass and wax textures, subdued cozy palette, no neon, no text, no letters, no numbers, no logo, no watermark --ar 4:5
```

Комната не загромождает силуэт: центральная зона фигуры и правые места питомцев
остаются свободными. Зеркало не содержит отражения рыцаря или другого персонажа.
Ковёр даёт мягкий контакт с подошвами, но не скрывает носки.

### 4.2. `doll/body.png`

```text
Detailed storybook realism, hand-painted watercolor with soft warm-brown ink outlines, full-body three-quarter portrait of a young adult male shop knight in his early twenties, natural adult proportions about seven heads tall, a kind consistent face with warm light skin, dark brown eyes, soft straight eyebrows, a small nose and a gentle closed-mouth smile, clean-shaven, standing calmly with relaxed shoulders and both feet planted, torso turned slightly toward image right and face looking toward the viewer, arms lowered in a fixed relaxed dressing-room pose, wearing only a fixed plain unbleached linen long-sleeve shirt, simple taupe trousers and soft brown house shoes, the head without any drawn hair and the wrists ending cleanly without drawn hands because hair and hands are separate layers, no armor, no equipment, no helmet, no gloves, no boots, no jewelry, no cloak, no belt items, no weapon, no shield, full figure centered with crown near eight percent of canvas height and soles near ninety-one percent, warm soft light from the upper left, realistic linen and leather textures, plain solid white background, no cast shadow, no other objects, no chibi, no combat pose, no text, no letters, no numbers, no logo, no watermark --ar 4:5
```

После генерации вручную убрать случайно нарисованные волосы, пальцы и любые лишние
вещи. Лицо этой утверждённой базы становится единственным референсом лица для всех
последующих работ.

### 4.3. `doll/hair_back.png`

Использовать утверждённый `body.png` как референс положения головы; итог всё равно
содержит только волосы на полном кадре.

```text
Use the attached approved body template only as an exact position and identity reference. Create only the isolated back-hair layer for the same young adult knight on the same full 4:5 canvas: short dark chestnut hair with a soft side part, the rear silhouette, neat nape strands and short side sections behind the ears, natural individual watercolor strands, soft warm-brown ink accents, warm light from the upper left, matching the fixed dark chestnut palette, no face, no skin, no ears, no body, no clothes, no hands, no helmet, no accessories, no front fringe, no objects, plain solid white background, no text, no logo, no watermark --ar 4:5
```

### 4.4. `doll/hair_front.png`

```text
Use the attached approved body template only as an exact position and identity reference. Create only the isolated front-hair layer for the same young adult knight on the same full 4:5 canvas: the same short dark chestnut hair with a soft side part, a gently tousled crown and a soft side-swept fringe, a few natural temple strands, natural adult hairline, detailed watercolor strands with soft warm-brown ink accents, warm light from the upper left, exactly matching the back-hair color and head anchor, no face, no skin, no ears, no body, no clothes, no hands, no helmet, no accessories, no rear nape section, no objects, plain solid white background, no text, no logo, no watermark --ar 4:5
```

Стык `hair_back`/`hair_front` проверяем на сером фоне: не должно быть белой шва,
двойной макушки или залысины. Ни один из файлов не содержит лицо или кожу головы.

### 4.5. `doll/hands.png`

```text
Use the attached approved body template only as an exact arm and wrist position reference. Create only the two isolated bare hands and short bare wrists of the same young adult knight on the same full 4:5 canvas, natural adult anatomy and warm light skin, the hand on image left relaxed and half-open with the palm inward, the working hand on image right softly curled around an imaginary lowered vertical weapon grip, both wrists aligned exactly to the approved sleeves, relaxed non-combat pose, anatomically correct fingers, soft warm-brown ink outlines, detailed watercolor skin, warm light from the upper left, no weapon, no shield, no rings, no gloves, no sleeves, no body, no objects, plain solid white background, no extra fingers, no text, no logo, no watermark --ar 4:5
```

Перчатки любого id используют ту же позу пальцев и те же запястья. Нельзя делать
отдельную «удобную» кисть для меча, лука или посоха: рукоять регистрируется под
утверждённую рабочую кисть.

## 5. Промт предмета: два обязательных референса

### 5.1. Входы и последовательность

Для каждого id прикладываем ровно два содержательных референса:

1. **Base template:** утверждённый полноростовой композит `hair_back + body +
   hair_front + hands` на белом фоне, без комнаты и без чужой экипировки.
2. **Item icon:** существующий `game/assets/items/<id>_web.jpg` именно этого id.

Иконка обязательна и определяет дизайн, материалы, цвет, орнамент и пропорции
предмета. Нельзя брать иконку похожего меча/кольца, редкость или игровое описание как
повод для нового дизайна. Если иконка нужного id недоступна, работу над этим слоем
останавливают и сначала восстанавливают правильный референс.

Сначала делаем **рабочий composite** на базе. Затем вручную отделяем изменённый
предмет, возвращаем его на полный кадр 1536×1920 и регистрируем по anchors. В runtime
уходит только предметный слой, не весь composite. AI сам не гарантирует ни чистую
alpha, ни совпадение координат: ручная вырезка, очистка краёв и регистрация обязательны.

### 5.2. Image-to-image prompt template

Подставить значения конкретной строки каталога. `{SPECIAL_NOTES}` заполняется только
из строки и общих правил слота; если дополнительных правил нет — оставить пустым.

```text
Reference 1 is the approved fixed full-body base template. Reference 2 is the mandatory inventory icon for the exact item {ITEM_ID}. Create a full-frame 4:5 registration composite by changing only the {SLOT} on Reference 1. The item is {ENGLISH_VISUAL_DESCRIPTION}. Match Reference 2 exactly in silhouette, construction, materials, colors and ornament; do not redesign it and do not borrow details from any other item. Keep the same face, identity, hair, natural adult anatomy, calm non-combat three-quarter pose, hand positions, foot positions, camera, crop, scale and warm light from the upper left. Keep all other equipment absent and preserve the fixed linen underlayer where appropriate. Fit the item naturally onto or into the approved body anchor for its slot, with realistic worn perspective and physically believable contact; this is a worn full-body portrait, not a square inventory icon. {SPECIAL_NOTES}. Detailed storybook realism, hand-painted watercolor with soft warm-brown ink outlines, realistic materials, restrained local magic only, no neon rarity recolor, no rarity background, no combat action, no extra accessories, no changed face, no changed pose, no extra fingers, no text, no letters, no numbers, no logo, no watermark, no checkerboard --ar 4:5
```

### 5.3. Обязательная интерпретация слотов

| Слот | Как переносить описание иконки на портрет |
|---|---|
| `weapon` | Держит рабочая кисть справа; рукоять проходит под пальцами. Лезвие опущено, лук не натянут, посох стоит как трость. `hand: two` означает отсутствие щита, а не обязательную боевую позу двумя руками. |
| `shield` | Надет/удерживается на свободной руке слева, не закрывает лицо и рабочую кисть. При двуручном оружии слой отсутствует даже при щите в сейве. |
| `helmet` | Надет по anchor головы, не плавает и не меняет череп. Правила `hideBase` выполняет resolver; вручную не стирать волосы в базовых файлах. |
| `armor` | Надето поверх нательного слоя, с учётом 3/4 и складок. Плащи с `__back` разделяются на заднее полотнище и передние детали. |
| `gloves` | Именно надетая пара на двух кистях, а не две свободно лежащие перчатки. Повторяют базовые пальцы и запястья; базовые `hands` скрываются. |
| `boots` | Надетая пара на обеих стопах, подошвы на общей линии пола; домашние башмаки не торчат из-под сапог. |
| `amulet` | Подвеска на груди поверх armor, шнурок следует перспективе шеи. Не превращать подвеску в отдельно парящий предмет. |
| `ring` | Миниатюрное, но читаемое кольцо на пальце свободной кисти; второй вариант только экспортным сдвигом. Не увеличивать до браслета. |
| `consumable`, potion | Закрытый флакон в первом поясном кармашке, не в руке и не выпитый. Второй кармашек — только `__belt2`. |
| `consumable`, scroll | Свёрнутый и завязанный свиток на поясе; руны остаются символическими и нечитаемыми. Второй кармашек — только `__belt2`. |

Везде действует правило: English visual description из каталога копируется без
«улучшений». Описание `a pair of...` для перчаток/сапог означает надетую пару, а
описание подвески-маски не даёт права закрыть ею лицо, если слот предмета — `amulet`.

## 6. Полный каталог предметных слоёв

Обозначения: `1H` / `2H` соответствуют `hand: 'one'` / `hand: 'two'`; у `2H` щит
скрывается. `—` в notes означает «только общие правила слота», а не свободу дизайна.
Для каждой строки обязателен референс `game/assets/items/<тот же id>_web.jpg`.
Все имена в колонке «Файл» находятся под `art-src/knight/`.

### 6.1. Стартовый блок `ITEMS`: Тихая опушка и ранние вещи (29)

Здесь сохранён порядок первого блока `data/items.js`; поле `set` показано явно,
потому что в нём уже встречаются ранние `town` и `attic`.

| id | slot | set | English visual description | Файл | Special notes |
|---|---|---|---|---|---|
| `wpn_rusty_sword` | `weapon` | — | `an old but sharp knight's shortsword with a worn leather grip and a tiny dried lavender sprig tied to the pommel` | `parts/wpn_rusty_sword.png` | `1H`; клинок опущен. |
| `wpn_oak_mace` | `weapon` | `town` | `a heavy oak mace with a rough carved wooden head and iron bands, bark texture` | `parts/wpn_oak_mace.png` | `1H`; тяжёлая головка ниже кисти. |
| `wpn_dagger_firefly` | `weapon` | `meadow` | `a slim elegant dagger with a softly glowing green blade, tiny firefly sparks around the tip` | `parts/wpn_dagger_firefly.png` | `1H`; огоньки локальные, без neon. |
| `wpn_greatsword_oak` | `weapon` | — | `a massive two-handed greatsword of dark bog oak with a wide steel blade and brass crossguard` | `parts/wpn_greatsword_oak.png` | `2H`, без щита; спокойно опущен/опирается на пол. |
| `wpn_lumberaxe` | `weapon` | — | `a huge two-handed lumberjack greataxe with a broad crescent blade, faint green spirit wisps curling off the edge` | `parts/wpn_lumberaxe.png` | `2H`, без щита; без боевого замаха. |
| `wpn_hunter_bow` | `weapon` | `meadow` | `a dark wooden longbow with a whisper-quiet string and one silver-fletched arrow resting along the limb` | `parts/wpn_hunter_bow.png` + `parts/wpn_hunter_bow__back.png` | `2H`, без щита; тетива не натянута. В `__back` только колчан со silver-fletched arrows, без второго лука. |
| `shd_wooden` | `shield` | `meadow` | `a light round linden wood shield with a warm honey grain, simple iron boss and a child's charcoal drawing faintly visible on the rim` | `parts/shd_wooden.png` | Детский рисунок — нечитаемый charcoal doodle, не надпись. |
| `shd_guardian` | `shield` | `town` | `a sturdy shop-guard shield of dark oak with a polished steel rim and small thorn-like studs, a brass lantern emblem in the center` | `parts/shd_guardian.png` | — |
| `hlm_badger` | `helmet` | `meadow` | `a rounded steel cap trimmed with striped badger fur and two small furry badger ears on top, sleepy cozy look` | `parts/hlm_badger.png` | Базовые волосы сохраняются; уши не увеличивать. |
| `hlm_leather` | `helmet` | — | `a soft brown leather hood with stitched seams and a folded rim, smelling of rain and herbs` | `parts/hlm_leather.png` | `hideBase: hairBack + hairFront`; капюшон закрывает всю причёску. |
| `arm_padded` | `armor` | — | `a warm quilted gambeson jacket of beige linen with diamond stitching and wooden toggles, handmade and honest` | `parts/arm_padded.png` | — |
| `arm_oak_guardian` | `armor` | — | `a guardian armor of polished dark oak plates riveted over a leather jerkin, carved leaf motifs and a living green sprout on the shoulder` | `parts/arm_oak_guardian.png` | Росток остаётся на плече и не закрывает лицо. |
| `arm_silken` | `armor` | `meadow` | `a weightless silken armor of sea-green moth wings layered like scales, shimmering softly with a delicate fuzzy collar` | `parts/arm_silken.png` | Без neon-блеска; крылья не становятся настоящими крыльями за спиной. |
| `glv_herbalist` | `gloves` | `meadow` | `a pair of soft herbalist gloves of greenish canvas with leather palms, a sprig of dried nettle tucked into the cuff` | `parts/glv_herbalist.png` | Надетая пара; базовые `hands` скрыты. |
| `glv_crit` | `gloves` | — | `a pair of fitted dark leather gloves with precise golden stitching following fate lines across the palm` | `parts/glv_crit.png` | Надетая пара; линии не образуют буквы. |
| `bt_path` | `boots` | `meadow` | `a pair of light trail boots of tan leather with grass-green laces and a tiny clover leaf stuck to the heel, mud-brushed toes` | `parts/bt_path.png` | — |
| `bt_merchant` | `boots` | `meadow` | `a pair of well-traveled merchant wanderer boots of chestnut leather with folded cuffs, a brass buckle and a lucky coin stitched into the side` | `parts/bt_merchant.png` | Монета без надписей и чисел. |
| `amu_hearth` | `amulet` | — | `a cozy pendant shaped like a tiny hearth with a warm ember glowing inside, on a braided leather cord` | `parts/amu_hearth.png` | Тёплый локальный огонёк, без ауры. |
| `amu_antidote` | `amulet` | `meadow` | `a small round glass pendant with a bundle of dried clubmoss herbs sealed inside, green cork top and a twine loop` | `parts/amu_antidote.png` | — |
| `rng_luck` | `ring` | `meadow` | `a simple copper ring with a tiny pressed four-leaf clover set in clear resin` | `parts/rng_luck.png` | Экспорт `__ring2`; не увеличивать клевер до броши. |
| `rng_crit` | `ring` | `attic` | `a silver ring with a sharp-cut crimson stone that flashes with a spark at its facet` | `parts/rng_crit.png` | Экспорт `__ring2`; одна сдержанная искра. |
| `rng_health` | `ring` | `meadow` | `a warm smooth amber ring glowing softly like a mug of tea, rounded and comforting` | `parts/rng_health.png` | Экспорт `__ring2`. |
| `pot_heal` | `consumable` | — | `a round glass potion bottle with a warm rose-red healing brew, tiny heart-shaped bubbles rising inside, cork stopper` | `parts/pot_heal.png` | `potion`, закрытое, на belt0; экспорт `__belt2`. |
| `pot_vigor` | `consumable` | — | `a slim glass vial with a sparkling mint-amber invigorating brew, tiny awake sparkles and a leaf of peppermint at the neck, cork stopper` | `parts/pot_vigor.png` | `potion`, закрытое, на belt0; экспорт `__belt2`. |
| `scr_fire_arrow` | `consumable` | — | `a rolled parchment scroll tied with a red ribbon, glowing rune of a fiery arrow on its side, small ember scorch marks on the edges` | `parts/scr_fire_arrow.png` | `scroll`, свёрнут, на belt0; экспорт `__belt2`; руна не буква. |
| `scr_heal_mist` | `consumable` | — | `a rolled parchment scroll tied with a mint-green ribbon, glowing rune of a dewdrop on its side, soft healing mist curling around it` | `parts/scr_heal_mist.png` | `scroll`, свёрнут, на belt0; экспорт `__belt2`; туман не закрывает фигуру. |
| `scr_frost` | `consumable` | — | `a rolled parchment scroll tied with a pale blue ribbon, glowing rune of an ice chain link on its side, frost crystals creeping over the paper edges` | `parts/scr_frost.png` | `scroll`, свёрнут, на belt0; экспорт `__belt2`. |
| `scr_storm` | `consumable` | — | `a rolled parchment scroll tied with a storm-grey ribbon, glowing rune of a lightning bolt on its side, tiny crackling sparks around the seal` | `parts/scr_storm.png` | `scroll`, свёрнут, на belt0; экспорт `__belt2`; без удара молнии. |
| `scr_fire_step` | `consumable` | — | `a rolled parchment scroll tied with a scorched orange ribbon, glowing rune of spreading flame footsteps on its side, smoldering edge embers` | `parts/scr_fire_step.png` | `scroll`, свёрнут, на belt0; экспорт `__belt2`; не поджигать комнату. |

### 6.2. Мир 2: железный ярус Средневекового дворика (11)

| id | slot | set | English visual description | Файл | Special notes |
|---|---|---|---|---|---|
| `wpn_iron_sword` | `weapon` | `town` | `a plain reliable guardsman's iron longsword, polished blade, simple wrapped grip, no ornament` | `parts/wpn_iron_sword.png` | `1H`; не добавлять орнамент. |
| `wpn_warhammer` | `weapon` | — | `a massive stonemason's war hammer with a square stone head and a sturdy oak haft, chips of granite` | `parts/wpn_warhammer.png` | `2H`, без щита; молот опущен. |
| `shd_tower` | `shield` | `town` | `a massive rectangular tower shield with rounded corners, weathered grey steel plates and a worn wooden handle, a narrow vertical highlight stripe` | `parts/shd_tower.png` | Не закрывает весь силуэт и лицо; нижний край выше ковра. |
| `hlm_kettle` | `helmet` | `town` | `a classic iron kettle hat with a wide slightly dented brim and a small rivet loop on top, honest guard gear` | `parts/hlm_kettle.png` | Поля не закрывают глаза; базовые волосы сохраняются. |
| `arm_chain` | `armor` | `town` | `a veteran chainmail shirt of blue-grey steel rings with a patched leather hem and one mismatched bronze ring, well-kept and storied` | `parts/arm_chain.png` | Кольца читаются фактурой, без чрезмерного мелкого шума. |
| `glv_smithee` | `gloves` | `town` | `a pair of heavy blacksmith mitts of scorched brown leather with metal rivets and heat-darkened fingertips, faint ember glow in the seams` | `parts/glv_smithee.png` | Надетая пара; форма пальцев остаётся рабочей для хвата. |
| `bt_cobble` | `boots` | `town` | `a pair of sturdy town boots with hobnail heels and reinforced toes, polished by cobblestone streets, confident upright stance` | `parts/bt_cobble.png` | Не менять спокойную постановку стоп. |
| `amu_fearless` | `amulet` | `town` | `a bold bronze medallion with a roaring lion relief and a steady red garnet heart in the center, on a sturdy chain` | `parts/amu_fearless.png` | — |
| `rng_iron` | `ring` | `town` | `a plain sturdy iron ring like a bent nail, honest forged texture with a slight hammered shine` | `parts/rng_iron.png` | Экспорт `__ring2`. |
| `rng_duelist` | `ring` | `town` | `an elegant duelist ring of dark steel with a thin rapier-shaped crest and a small diamond at its tip` | `parts/rng_duelist.png` | Экспорт `__ring2`; гребень не цепляет соседние пальцы. |
| `pot_stone` | `consumable` | — | `a heavy squat bottle with a swirling granite-grey brew, tiny pebbles settled at the bottom and a slate shard as a stopper` | `parts/pot_stone.png` | `potion`, закрытое, на belt0; экспорт `__belt2`. |

### 6.3. Мир 3: волшебный ярус Книжного чердака (11)

`shd_page_shield` физически объявлен позже в исходнике, но имеет `set: 'attic'` и
поэтому включён сюда, а не в сет `master`.

| id | slot | set | English visual description | Файл | Special notes |
|---|---|---|---|---|---|
| `wpn_candle_staff` | `weapon` | `attic` | `a tall mage staff topped with a burning candle flame inside a brass lantern cage, wax drips frozen mid-fall` | `parts/wpn_candle_staff.png` | `2H`, без щита; посох вертикален как трость, кисть поверх древка. |
| `wpn_firebird_quill` | `weapon` | — | `a legendary dagger shaped like a firebird feather quill, blade of warm ember-orange feather barbs with tiny sparks, ornate gold nib-like hilt` | `parts/wpn_firebird_quill.png` | `1H`; это кинжал, не письменное перо; без neon. |
| `arm_ink_cloak` | `armor` | `attic` | `a flowing cloak of deep violet-black cloth that glistens like wet ink, a stray ink blot sliding off its edge without a trace, high collar and silver clasp` | `parts/arm_ink_cloak.png` + `parts/arm_ink_cloak__back.png` | Main: ворот, застёжка, передние края и клякса. Back: заднее полотнище. Не дублировать слои. |
| `hlm_page_wanderer` | `helmet` | `attic` | `a tall soft pointed traveler hood of deep violet cloth with a floppy tip and a tiny glowing amber star charm, storybook wanderer mood` | `parts/hlm_page_wanderer.png` | `hideBase: hairBack + hairFront`; звезда без букв/чисел. |
| `glv_binder` | `gloves` | `attic` | `a pair of sturdy bookbinder gloves of waxed grey cloth with strong saddle stitching and a brass thimble on the thumb, faint ink stains` | `parts/glv_binder.png` | Надетая пара; базовые `hands` скрыты. |
| `bt_quiet_step` | `boots` | `attic` | `a pair of soft silent boots of midnight-violet suede with felt soles and a page-corner motif stitched in silver thread, whisper-quiet look` | `parts/bt_quiet_step.png` | Мотив страницы без текста. |
| `amu_pages` | `amulet` | `attic` | `a pendant of tiny folded ancient book pages layered into a flower shape, smelling of old paper, with a miniature brass bookmark chain` | `parts/amu_pages.png` | Страницы без печатного текста. |
| `rng_ink` | `ring` | `attic` | `a glass ring with a dark ink drop floating and swirling inside, silver setting` | `parts/rng_ink.png` | Экспорт `__ring2`. |
| `rng_contents` | `ring` | `attic` | `a golden ring with a tiny engraved open book on the bezel and a miniature compass needle pointing sideways` | `parts/rng_contents.png` | Экспорт `__ring2`; без букв и кардинальных подписей. |
| `pot_ink` | `consumable` | — | `a dark glass bottle with an inky violet-black brew that slowly curls like a calligraphy stroke inside, wax-sealed cork` | `parts/pot_ink.png` | `potion`, закрытое, на belt0; экспорт `__belt2`; без букв внутри. |
| `shd_page_shield` | `shield` | `attic` | `a shield made from the cover of an ancient leather-bound tome strapped to a wooden frame, brass corners, faded embossed title swirls, a leather belt strap on the back edge` | `parts/shd_page_shield.png` | Только декоративные title swirls, без читаемого названия. |

### 6.4. Сет «Мастер» (9)

| id | slot | set | English visual description | Файл | Special notes |
|---|---|---|---|---|---|
| `wpn_master_dagger` | `weapon` | `master` | `a masterwork stiletto dagger forged from glowing moss and mossy stone, thin green veins of light in the blade` | `parts/wpn_master_dagger.png` | `1H`; зелёные прожилки сдержанные. |
| `shd_master` | `shield` | `master` | `a kite-shaped shield polished to a perfect mirror shine, reflecting a tiny warm window light, golden trim and a pale blue enamel boss` | `parts/shd_master.png` | Отражение только окна, не рыцаря и не интерфейса. |
| `hlm_master` | `helmet` | `master` | `a light golden circlet with a small glowing heart of old willow wood set in the front, delicate engraved leaves` | `parts/hlm_master.png` | Базовая причёска сохраняется; обруч по anchor макушки. |
| `arm_master` | `armor` | `master` | `a masterwork quilted doublet of deep blue cloth soaked in magical ink brew, faint glowing runes in the seams and polished brass buttons` | `parts/arm_master.png` | Руны нечитаемые, свечение швов не neon. |
| `glv_master` | `gloves` | `master` | `a pair of elegant fingerless master gloves with engraved brass thimble-caps on the fingertips, glowing faint golden seams` | `parts/glv_master.png` | Надетая fingerless-пара; видимые кончики пальцев не дублируют базовые кисти. |
| `bt_master` | `boots` | `master` | `a pair of sleek masterwork boots of dark supple leather with silent braided grey soles and faint golden stitching, elegant and noiseless` | `parts/bt_master.png` | — |
| `amu_master` | `amulet` | `master` | `a delicate golden filigree pendant holding a bundle of dried clubmoss and a single glowing drop of luminous moss, intricate swirling metalwork` | `parts/amu_master.png` | — |
| `rng_master` | `ring` | `master` | `a masterwork signet ring cast of golden honeyed amber with moth pollen glints and a tiny swirl of luck moving inside` | `parts/rng_master.png` | Экспорт `__ring2`. |
| `rng_master_loop` | `ring` | `master` | `a matching golden band ring engraved with intertwined loops and a warm purring glow along the inner rim` | `parts/rng_master_loop.png` | Экспорт `__ring2`; при полном сете отличается от `rng_master`. |

### 6.5. Мир «Сказочные топи»: сет «Топь» (9)

| id | slot | set | English visual description | Файл | Special notes |
|---|---|---|---|---|---|
| `wpn_swamp_sickle` | `weapon` | `swamp` | `a curved swamp witch sickle with a crescent-moon blade, faint green wisp lights orbiting the edge` | `parts/wpn_swamp_sickle.png` | `1H`; серп опущен, огоньки не закрывают руку. |
| `shd_swamp_lily` | `shield` | `swamp` | `a shield made of a giant lily pad leaf stretched over a wooden frame, water droplets rolling off` | `parts/shd_swamp_lily.png` | Капли статичны, без потока воды на пол. |
| `hlm_swamp_wreath` | `helmet` | `swamp` | `a wreath helmet of glowing marsh berries and firefly lights hovering in a circle` | `parts/hlm_swamp_wreath.png` | Базовые волосы сохраняются; круг огоньков не закрывает лицо. |
| `arm_swamp_weave` | `armor` | `swamp` | `a woven cloak of grey-green bog mist threads, wisps curling off the hem` | `parts/arm_swamp_weave.png` + `parts/arm_swamp_weave__back.png` | Main: передние края и крепление. Back: тканое заднее полотнище; туман не становится сплошным серым силуэтом. |
| `glv_swamp_fern` | `gloves` | `swamp` | `gloves woven of dark fern fronds with tiny glowing spores on the knuckles` | `parts/glv_swamp_fern.png` | Надетая пара; пальцы сохраняют хват. |
| `bt_swamp_moss` | `boots` | `swamp` | `soft mossy boots with peat-brown laces, tiny mushrooms growing on the heels` | `parts/bt_swamp_moss.png` | Грибы только на пятках, не по всей комнате. |
| `amu_swamp_frog` | `amulet` | `swamp` | `a small frog-shaped wooden amulet with amber eyes, on a reed-fiber cord` | `parts/amu_swamp_frog.png` | Это деревянный амулет, не живой питомец. |
| `rng_swamp_thread` | `ring` | `swamp` | `a ring of twisted witch's thread with a glowing mist bead caught in the knot` | `parts/rng_swamp_thread.png` | Экспорт `__ring2`. |
| `rng_swamp_glow` | `ring` | `swamp` | `a ring holding a single glowing marsh berry, soft green light pulsing inside` | `parts/rng_swamp_glow.png` | Экспорт `__ring2`; без neon-ореола на кисти. |

### 6.6. Мир «Звёздная ярмарка»: сет «Ярмарка» (9)

| id | slot | set | English visual description | Файл | Special notes |
|---|---|---|---|---|---|
| `wpn_fair_hammer` | `weapon` | `fair` | `a festive strongman carnival hammer with red-white striped handle and a brass bell on the head` | `parts/wpn_fair_hammer.png` | `1H`; молоток опущен, колокольчик без эффекта удара. |
| `shd_fair_target` | `shield` | `fair` | `a round shield painted as a carnival shooting-range target with concentric red and cream rings` | `parts/shd_fair_target.png` | Без чисел на мишени. |
| `hlm_fair_jester` | `helmet` | `fair` | `a starry jester cap with three floppy points ending in tiny gold bells` | `parts/hlm_fair_jester.png` | Базовые волосы сохраняются; ровно три мягких конца. |
| `arm_fair_vest` | `armor` | `fair` | `a second-hand dealer's vest of patchwork velvet with many little pockets and brass buttons` | `parts/arm_fair_vest.png` | Карманы не заполнять новыми предметами. |
| `glv_fair_magician` | `gloves` | `fair` | `sleek magician gloves of white silk with a hidden card peeking from the cuff` | `parts/glv_fair_magician.png` | Надетая пара; карта без масти-чисел/букв, кромки белой ткани без halo. |
| `bt_fair_dancer` | `boots` | `fair` | `tightrope dancer boots with pointed toes and balancing ribbons at the ankles` | `parts/bt_fair_dancer.png` | Обе стопы стоят на полу, не на канате. |
| `amu_fair_ticket` | `amulet` | `fair` | `a medallion made from an eternal carnival ticket stamped with a star, on a striped ribbon` | `parts/amu_fair_ticket.png` | Билет без текста, цены и номера. |
| `rng_fair_coin` | `ring` | `fair` | `a ring made from a bent lucky fair coin, heads and tails both smiling` | `parts/rng_fair_coin.png` | Экспорт `__ring2`; без надписей на монете. |
| `rng_fair_star` | `ring` | `fair` | `a ring topped with a small golden champion star, engraved rays` | `parts/rng_fair_star.png` | Экспорт `__ring2`. |

### 6.7. Мир «Пепельные степи»: сет «Пепел» (9)

| id | slot | set | English visual description | Файл | Special notes |
|---|---|---|---|---|---|
| `wpn_ember_scimitar` | `weapon` | `ember` | `a curved ash-steppe scimitar with a heat-shimmer blade and ember glow along the fuller` | `parts/wpn_ember_scimitar.png` | `1H`; сабля опущена, heat shimmer не размывает контур. |
| `shd_ember_brazier` | `shield` | `ember` | `a shield shaped like a shallow brazier with glowing coals behind a metal grate` | `parts/shd_ember_brazier.png` | Угли локальные, без открытого пожара. |
| `hlm_ember_khan` | `helmet` | `ember` | `a half-mask helmet of steppe beast pelt with a storm shard embedded in the brow` | `parts/hlm_ember_khan.png` | Базовые волосы сохраняются; полумаска не меняет форму головы. |
| `arm_ember_scalemail` | `armor` | `ember` | `scale mail of overlapping ash-lizard scales, dark grey with ember-lit seams` | `parts/arm_ember_scalemail.png` | Чешуя не превращается в кожу ящера на теле рыцаря. |
| `glv_ember_forge` | `gloves` | `ember` | `forge gloves of heat-darkened leather with glowing coal dust in the creases` | `parts/glv_ember_forge.png` | Надетая пара; без огня на пальцах. |
| `bt_ember_storm` | `boots` | `ember` | `boots of the ash storm with smoldering soles and wind-swept straps` | `parts/bt_ember_storm.png` | Тление не поджигает ковёр, ремешки не развеваются ветром боя. |
| `amu_ember_heart` | `amulet` | `ember` | `an amulet holding a beating storm heart ember in a wire cage` | `parts/amu_ember_heart.png` | Статичный кадр с локальным тёплым светом. |
| `rng_ember_coal` | `ring` | `ember` | `a ring set with a small hot coal that glows when danger is near` | `parts/rng_ember_coal.png` | Экспорт `__ring2`; в спокойной комнате свет очень слабый. |
| `rng_ember_spark` | `ring` | `ember` | `a ring with the very first spark of a fire trapped in a tiny glass vial` | `parts/rng_ember_spark.png` | Экспорт `__ring2`; пузырёк остаётся миниатюрной частью кольца. |

### 6.8. Филлеры поздних миров (15)

#### Ночной рынок (3)

| id | slot | set | English visual description | Файл | Special notes |
|---|---|---|---|---|---|
| `wpn_nm_fang` | `weapon` | — | `a sharp dagger made from a polished fang, wrapped handle of night-market cord` | `parts/wpn_nm_fang.png` | `1H`; клинок опущен. |
| `hlm_nm_lantern` | `helmet` | — | `a hooded cap with a small glowing lantern fixed on the side, night market reflections` | `parts/hlm_nm_lantern.png` | `hideBase: hairBack`; `hairFront` остаётся, фонарь не пересекает чёлку. |
| `amu_nm_mask` | `amulet` | — | `a mysterious lacquered night guest mask with a painted smile, on a silk cord` | `parts/amu_nm_mask.png` | Слот `amulet`: маска висит на груди как подвеска, НЕ надевается на лицо. |

#### Хрустальные горы (3)

| id | slot | set | English visual description | Файл | Special notes |
|---|---|---|---|---|---|
| `wpn_cr_pick` | `weapon` | — | `a sturdy quartz-miner's pickaxe with a crystal-tipped head catching rainbows` | `parts/wpn_cr_pick.png` | `1H`; кирка опущена, радуга только в гранях. |
| `arm_cr_crystal` | `armor` | — | `a translucent crystal breastplate, heavy and clear, light refracting inside` | `parts/arm_cr_crystal.png` | Под прозрачным нагрудником виден linen, не голое тело; контролировать полупрозрачную alpha. |
| `rng_cr_echo` | `ring` | — | `a mountain echo ring of hollow silver that hums faintly when tapped` | `parts/rng_cr_echo.png` | Экспорт `__ring2`; без визуальных звуковых надписей. |

#### Нефритовый сад (3)

| id | slot | set | English visual description | Файл | Special notes |
|---|---|---|---|---|---|
| `wpn_jade_fan` | `weapon` | — | `a folded combat fan of pale jade blades with bamboo ribs, half-open` | `parts/wpn_jade_fan.png` | `1H`; веер полуоткрыт и опущен, без боевого взмаха. |
| `bt_jade_silk` | `boots` | — | `soft silk tea-ceremony boots of pale green, embroidered with bamboo leaves` | `parts/bt_jade_silk.png` | Светлый шёлк без белого ореола. |
| `amu_jade_pearl` | `amulet` | — | `a single luminous jade pearl pendant on a silk garden-green cord` | `parts/amu_jade_pearl.png` | — |

#### Подводный грот (3)

| id | slot | set | English visual description | Файл | Special notes |
|---|---|---|---|---|---|
| `wpn_deep_coral` | `weapon` | — | `a coral blade grown into a sword shape, pink branches fused along the fuller` | `parts/wpn_deep_coral.png` | `1H`; коралловый клинок опущен. |
| `shd_deep_shell` | `shield` | — | `a shield made of a giant scallop shell, pearly inside and barnacled outside` | `parts/shd_deep_shell.png` | Не превращать раковину в живого моллюска. |
| `rng_deep_pearl` | `ring` | — | `a ring with a deep-sea pearl that glows brighter the deeper you go` | `parts/rng_deep_pearl.png` | Экспорт `__ring2`; свечение сдержанное в комнате. |

#### Туманные часы (3)

| id | slot | set | English visual description | Файл | Special notes |
|---|---|---|---|---|---|
| `wpn_mist_pendulum` | `weapon` | — | `a pendulum blade on a short chain, swinging in perfect rhythm, clock engravings` | `parts/wpn_mist_pendulum.png` | `1H`; в статичном портрете цепь вертикальна, клинок опущен, без цифр. |
| `glv_mist_gear` | `gloves` | — | `clockmaker gloves with tiny brass gears on the knuckles and measuring marks` | `parts/glv_mist_gear.png` | Надетая пара; шестерни не мешают хвату, метки без чисел. |
| `amu_mist_sand` | `amulet` | — | `an hourglass pendant with mist-grey sand flowing upward` | `parts/amu_mist_sand.png` | Статичный кадр; песок остаётся внутри стекла. |

### 6.9. Легендарки боссов за печати (4)

Это отдельная четвёрка legendary, не путать её с 12 внесетовыми rare-находками из 6.11.

| id | slot | set | English visual description | Файл | Special notes |
|---|---|---|---|---|---|
| `hlm_hag_crown` | `helmet` | — | `the crown of the Mistress of the Mires, woven of black reeds with a crown of will-o-wisps` | `parts/hlm_hag_crown.png` | Базовые волосы сохраняются; огоньки не образуют neon-нимб. |
| `wpn_champion_greatsword` | `weapon` | — | `a colossal greatsword shaped like a five-pointed star of the world champion, gold and crimson` | `parts/wpn_champion_greatsword.png` | `2H`, без щита; полный силуэт в кадре, клинок опущен/опёрт на пол. |
| `amu_quartz_heart` | `amulet` | — | `the heart of the ancient quartz dragon, a large faceted crystal beating with slow light` | `parts/amu_quartz_heart.png` | Крупный, но не закрывает весь торс; статичный мягкий свет. |
| `rng_time_loop` | `ring` | — | `a ring shaped as a tiny looping spiral of time, silver mist circling inside` | `parts/rng_time_loop.png` | Экспорт `__ring2`; спираль остаётся размером с кольцо. |

### 6.10. Расходники поздних миров (4)

| id | slot | set | English visual description | Файл | Special notes |
|---|---|---|---|---|---|
| `pot_jade_tea` | `consumable` | — | `a jade-green tea potion in a porcelain bottle with a bamboo stopper, steam curling` | `parts/pot_jade_tea.png` | `potion`, закрытая бутылка на belt0, не чашка; экспорт `__belt2`; пар слабый. |
| `pot_deep_air` | `consumable` | — | `a bottle of captured surface air, shimmering bubbles swirling inside, cork sealed with wax` | `parts/pot_deep_air.png` | `potion`, закрытое, на belt0; экспорт `__belt2`; прозрачное стекло без белого контура. |
| `scr_crystal_rain` | `consumable` | — | `a scroll tied with a crystal-clear ribbon, glowing rune of falling shards on its side` | `parts/scr_crystal_rain.png` | `scroll`, свёрнут, на belt0; экспорт `__belt2`; осколки только в руне, не летят по комнате. |
| `scr_mist_slow` | `consumable` | — | `a scroll tied with a grey velvet ribbon, glowing rune of thick fog on its side` | `parts/scr_mist_slow.png` | `scroll`, свёрнут, на belt0; экспорт `__belt2`; туман не скрывает слои. |

### 6.11. Двенадцать внесетовых босс-находок из раздела 23 (12)

Все имеют `rarity: rare`, но фон иконки `#2e4a66` в портрет не переносится. Это не
новый сет и не повод объединять предметы в одну цветовую гамму.

| id | slot | set | English visual description | Файл | Special notes |
|---|---|---|---|---|---|
| `shd_willow_vow` | `shield` | — | `a sturdy round shield of dark willow wood with a living green branch curling around its rim and a small golden oath knot carved into the center` | `parts/shd_willow_vow.png` | Ветвь остаётся на ободе; узел без рунических букв. |
| `glv_captain_oath` | `gloves` | — | `a pair of dignified captain gauntlets in deep blue leather with brass wrist plates and a small crimson oath ribbon tied without writing` | `parts/glv_captain_oath.png` | Надетая пара; лента без надписи, пальцы сохраняют хват. |
| `rng_keeper_bookmark` | `ring` | — | `an antique gold ring holding a tiny folded living book page that curls like a bookmark, with a warm amber glow along its edges` | `parts/rng_keeper_bookmark.png` | Экспорт `__ring2`; страница без текста. |
| `amu_star_compass` | `amulet` | — | `a round silver pendant compass with a tiny star-shaped needle pointing toward a glowing constellation, no letters or cardinal labels` | `parts/amu_star_compass.png` | Стрелка указывает в безопасную сторону домой, без cardinal labels. |
| `wpn_nm_afterhours` | `weapon` | — | `a slim midnight-blue dagger with a moonlit silver edge and a miniature lantern-shaped pommel glowing softly in the dark` | `parts/wpn_nm_afterhours.png` | `1H`; кинжал опущен, фонарик только на pommel. |
| `bt_sw_reed` | `boots` | — | `a pair of waterproof traveler boots with woven reed patterns, moss-green lining and flexible mud-proof soles for a swamp path` | `parts/bt_sw_reed.png` | Пара стоит на ковре; сухие верх и подошвы не добавляют болотную воду. |
| `rng_sf_encore` | `ring` | — | `a festive silver ring decorated with tiny colorful fairground beads and two small ribbon loops suggesting a joyful encore` | `parts/rng_sf_encore.png` | Экспорт `__ring2`; ровно две маленькие ribbon loops, без надписей. |
| `hlm_cr_geode` | `helmet` | — | `a rounded mountain helmet of brushed steel with a split geode set into the forehead, revealing luminous blue and violet crystals` | `parts/hlm_cr_geode.png` | Базовые волосы сохраняются; кристаллы не закрывают глаза. |
| `arm_ash_wayfarer` | `armor` | — | `a layered wayfarer armor of ash-grey cloth and scorched metal plates with a travel cloak and faint ember light inside the seams` | `parts/arm_ash_wayfarer.png` | `__back` НЕ создавать: правила нет. В main только видимые спереди/сбоку части travel cloak, без второго плаща поверх тела. |
| `wpn_jade_branch` | `weapon` | — | `an elegant one-handed sword shaped around a living jade branch, with carved green leaves and a luminous vein running along the blade` | `parts/wpn_jade_branch.png` | `1H`; меч опущен, листья остаются на рукояти/конструкции клинка. |
| `shd_deep_tideglass` | `shield` | — | `a protective shield of translucent blue-green tideglass framed in dark silver, with a rolling ocean wave suspended inside the glass` | `parts/shd_deep_tideglass.png` | Волна внутри стекла; полупрозрачность контролируется вручную, без дыр и checkerboard. |
| `glv_mist_minute` | `gloves` | — | `a pair of soft mist-violet gloves with delicate silver stitching and a tiny numeral-free clock dial resting quietly on each wrist` | `parts/glv_mist_minute.png` | Надетая пара; циферблаты на запястьях, строго без чисел. |

**Контроль каталога:** 29 + 11 + 11 + 9 + 9 + 9 + 9 + 15 + 4 + 4 + 12 =
**122 уникальных id**. Из них 109 equipment и 13 consumable. Основных
`parts/<itemId>.png` должно быть по одному на каждый id; дополнительных ручных
`__back.png` — ровно три для указанных правил.

## 7. Волны работ и точки утверждения

Нумерация волн не разрешает пропускать приёмку. Список волн распределяет все 122 id
без дублей: **15 + 45 + 27 + 35 = 122**. Уже принятый предмет не генерируем заново
для следующей волны.

### Волна 0 — вертикальный срез, сначала только он

**База:** `room`, `doll/body`, `doll/hair_back`, `doll/hair_front`, `doll/hands`.
**15 предметов:**

```text
wpn_rusty_sword
shd_wooden
pot_heal
hlm_badger
arm_oak_guardian
arm_ink_cloak (+ обязательный __back)
glv_herbalist
bt_path
amu_hearth
rng_luck
rng_health
wpn_greatsword_oak
wpn_hunter_bow (+ обязательный __back с колчаном)
wpn_candle_staff
scr_fire_arrow
```

В этом срезе обязательно проверяются: одноручный меч со щитом; три разных `2H` без
щита; плащ front/back; лук и колчан; перчатки вместо базовых кистей; волосы со шлемом;
два разных кольца одновременно; два разных расходника на поясе; смена двух доспехов без
сдвига базы. Экспортные `ring2` и `belt2` проверяются на реальных слотах.

**Стоп-точка:** пользователь утверждает базу и весь вертикальный срез в Chrome до
массовой генерации. Если не утверждён хотя бы один anchor, лицо, свет, хват или alpha,
волну 1 не начинаем. Исправление базы означает повторную приёмку среза.

### Волна 1 — закрыть первые три мира и «Мастера», оставшиеся 45

После утверждения волны 0, без повторной генерации её 15 предметов.

- Остаток стартового блока, 16: `wpn_oak_mace`, `wpn_dagger_firefly`,
  `wpn_lumberaxe`, `shd_guardian`, `hlm_leather`, `arm_padded`, `arm_silken`,
  `glv_crit`, `bt_merchant`, `amu_antidote`, `rng_crit`, `pot_vigor`,
  `scr_heal_mist`, `scr_frost`, `scr_storm`, `scr_fire_step`.
- Средневековый дворик, 11: `wpn_iron_sword`, `wpn_warhammer`, `shd_tower`,
  `hlm_kettle`, `arm_chain`, `glv_smithee`, `bt_cobble`, `amu_fearless`,
  `rng_iron`, `rng_duelist`, `pot_stone`.
- Книжный чердак, оставшиеся 9: `wpn_firebird_quill`, `hlm_page_wanderer`,
  `glv_binder`, `bt_quiet_step`, `amu_pages`, `rng_ink`, `rng_contents`, `pot_ink`,
  `shd_page_shield`.
- Мастер, 9: `wpn_master_dagger`, `shd_master`, `hlm_master`, `arm_master`,
  `glv_master`, `bt_master`, `amu_master`, `rng_master`, `rng_master_loop`.

После этой волны закрыто 60/122. Делаем экспорт, `--check` и смешанные/full-set QA до
перехода дальше.

### Волна 2 — Топь, Ярмарка, Пепел, 27

- `swamp`, 9: `wpn_swamp_sickle`, `shd_swamp_lily`, `hlm_swamp_wreath`,
  `arm_swamp_weave` (+ `__back`), `glv_swamp_fern`, `bt_swamp_moss`,
  `amu_swamp_frog`, `rng_swamp_thread`, `rng_swamp_glow`.
- `fair`, 9: `wpn_fair_hammer`, `shd_fair_target`, `hlm_fair_jester`,
  `arm_fair_vest`, `glv_fair_magician`, `bt_fair_dancer`, `amu_fair_ticket`,
  `rng_fair_coin`, `rng_fair_star`.
- `ember`, 9: `wpn_ember_scimitar`, `shd_ember_brazier`, `hlm_ember_khan`,
  `arm_ember_scalemail`, `glv_ember_forge`, `bt_ember_storm`, `amu_ember_heart`,
  `rng_ember_coal`, `rng_ember_spark`.

После этой волны закрыто 87/122. Каждый полный сет проверяется как единый комплект и
в смешивании с базой, без rarity recolor.

### Волна 3 — поздние миры и полное покрытие, 35

Порядок внутри волны позволяет принимать небольшими пачками, но все четыре части
обязательны:

1. Филлеры, 15: `wpn_nm_fang`, `hlm_nm_lantern`, `amu_nm_mask`, `wpn_cr_pick`,
   `arm_cr_crystal`, `rng_cr_echo`, `wpn_jade_fan`, `bt_jade_silk`,
   `amu_jade_pearl`, `wpn_deep_coral`, `shd_deep_shell`, `rng_deep_pearl`,
   `wpn_mist_pendulum`, `glv_mist_gear`, `amu_mist_sand`.
2. Легендарки, 4: `hlm_hag_crown`, `wpn_champion_greatsword`, `amu_quartz_heart`,
   `rng_time_loop`.
3. Босс-находки, 12: `shd_willow_vow`, `glv_captain_oath`,
   `rng_keeper_bookmark`, `amu_star_compass`, `wpn_nm_afterhours`, `bt_sw_reed`,
   `rng_sf_encore`, `hlm_cr_geode`, `arm_ash_wayfarer`, `wpn_jade_branch`,
   `shd_deep_tideglass`, `glv_mist_minute`.
4. Поздние расходники, 4: `pot_jade_tea`, `pot_deep_air`, `scr_crystal_rain`,
   `scr_mist_slow`.

Финал: 122/122 основных предметных слоёв, 3 ручных `__back`, все производные
`ring2`/`belt2`, чистый `--check` и полная ручная приёмка. Нельзя считать волну
завершённой по количеству промтов или записей в MD.

## 8. QA и приёмка

### 8.1. Обязательные контрольные комплекты

Ниже `ring1/ring2` и `belt0/belt1` указаны явно. Если двуручное оружие скрывает щит,
щит всё равно оставляем экипированным в проверке, чтобы доказать правильное скрытие.

| Проверка | Комплект | Что должно получиться |
|---|---|---|
| Смешанный срез | `wpn_rusty_sword`, `shd_guardian`, `hlm_badger`, `arm_oak_guardian`, `glv_herbalist`, `bt_path`, `amu_hearth`; `rng_luck` + `rng_health`; `pot_heal` + `scr_fire_arrow` | Один рыцарь, меч и щит на нужных руках, перчатки без голых дублей, оба кольца и оба поясных предмета различимы. |
| Лук + чернила | `wpn_hunter_bow`, экипированный `shd_page_shield`, `hlm_nm_lantern`, `arm_ink_cloak`, `glv_binder`, `bt_quiet_step`, `amu_pages`; `rng_ink` + `rng_contents`; `pot_ink` + `scr_frost` | Щита нет; колчан за телом, лук впереди; `hairBack` скрыт, чёлка цела; плащ разделён без швов и дублей. |
| Топь + два одинаковых зелья | `wpn_candle_staff`, экипированный `shd_swamp_lily`, `hlm_leather`, `arm_swamp_weave`, `glv_swamp_fern`, `bt_swamp_moss`, `amu_swamp_frog`; `rng_swamp_thread` + `rng_swamp_glow`; `pot_heal` + `pot_heal` | Щита нет; обе части волос скрыты капюшоном; туманный плащ front/back корректен; два одинаковых зелья отличаются только положением. |
| Поздний микс + два одинаковых кольца | `wpn_champion_greatsword`, экипированный `shd_deep_tideglass`, `hlm_hag_crown`, `arm_ash_wayfarer`, `glv_mist_minute`, `bt_fair_dancer`, `amu_quartz_heart`; `rng_luck` + `rng_luck`; `scr_storm` + `scr_storm` | Щита нет; огромный меч не обрезан; два одинаковых кольца и свитка не получают новый дизайн; у `arm_ash_wayfarer` нет самодельного `__back`. |

### 8.2. Full sets и попарные правила

Полные наборы проверяются со всеми девятью элементами: weapon, shield, helmet, armor,
gloves, boots, amulet, ring1, ring2. Пояс отдельно заполняется двумя расходниками.

- **master:** `wpn_master_dagger`, `shd_master`, `hlm_master`, `arm_master`,
  `glv_master`, `bt_master`, `amu_master`, `rng_master`, `rng_master_loop`.
- **swamp:** `wpn_swamp_sickle`, `shd_swamp_lily`, `hlm_swamp_wreath`,
  `arm_swamp_weave`, `glv_swamp_fern`, `bt_swamp_moss`, `amu_swamp_frog`,
  `rng_swamp_thread`, `rng_swamp_glow`.
- **fair:** `wpn_fair_hammer`, `shd_fair_target`, `hlm_fair_jester`, `arm_fair_vest`,
  `glv_fair_magician`, `bt_fair_dancer`, `amu_fair_ticket`, `rng_fair_coin`,
  `rng_fair_star`.
- **ember:** `wpn_ember_scimitar`, `shd_ember_brazier`, `hlm_ember_khan`,
  `arm_ember_scalemail`, `glv_ember_forge`, `bt_ember_storm`, `amu_ember_heart`,
  `rng_ember_coal`, `rng_ember_spark`.

У `meadow`, `town`, `attic` есть альтернативные оружие/щиты/кольца: их проверяем
полными правдоподобными комплектами по одному предмету на слот, а не пытаемся надеть
все альтернативы одновременно.

Отдельный чек-лист по механикам:

- **Cloak back/front:** у `arm_ink_cloak` и `arm_swamp_weave` back находится за
  `hairBack` и body, main поверх body; ворот/застёжка не исчезают, заднее полотнище не
  продавливается через грудь, боковой шов не разрывается при смене шлема.
- **Bow quiver:** у `wpn_hunter_bow` один лук спереди и один колчан сзади. Нет второго
  лука, стрелы не проходят сквозь шею/лицо, серебристое оперение соответствует иконке.
- **Hands over grip:** для каждого weapon кисть или перчатки поверх рукояти; пальцы не
  под лезвием, рукоять не парит. Отдельно смотрим greatsword, greataxe, warhammer, bow,
  staff и `wpn_mist_pendulum`.
- **Two-handed без shield:** все шесть `2H` — `wpn_greatsword_oak`, `wpn_lumberaxe`,
  `wpn_hunter_bow`, `wpn_warhammer`, `wpn_candle_staff`,
  `wpn_champion_greatsword` — скрывают любой экипированный щит, не меняя спокойную позу.
- **Two same rings:** одинаковый id в ring1/ring2 использует один рисунок и экспортный
  сдвиг; нет второго дизайна, размытия или изменения размера. Разные кольца не сливаются.
- **Two same potions:** одинаковый id в belt0/belt1 аналогично; отдельно проверить два
  `pot_heal`, затем два одинаковых scroll. Флаконы остаются закрытыми.
- **Helmets/hair:** `hlm_leather` и `hlm_page_wanderer` скрывают оба hair-слоя;
  `hlm_nm_lantern` скрывает только `hairBack`; все остальные helmets сохраняют оба и не
  имеют неожиданной лысины, двойной макушки или прядей сквозь металл.
- **Gloves:** каждый gloves-id скрывает базовые `hands`; у `glv_master` fingerless-кожа
  принадлежит только перчаточному слою и не остаётся после его снятия.
- **Amulets:** `amu_nm_mask` висит на груди, а не на лице; остальные подвески не тонут в
  броне и не закрывают лицо.
- **Снятие предмета:** после снятия не остаются его back, перчаточные пальцы, кольца,
  волосы скрытого шлема или поясные копии; при нехватке любого обязательного файла
  возвращается целый старый fallback.

### 8.3. Pet spots и свободное пространство комнаты

Комнату и самые объёмные плащи/щиты проверяем с каждым существующим питомцем. Координаты
из `KNIGHT_DOLL_PET_SPOTS`, проценты кадра; их не сдвигаем ради арта.

| Питомец | x | y | width | Дополнительно |
|---|---:|---:|---:|---|
| `pet_puppy` | 79 | 84 | 28 | `flip: true` |
| `pet_hedgehog` | 80 | 88 | 21 | — |
| `pet_fox` | 80 | 82 | 30 | — |
| `pet_horse` | 82 | 78 | 52 | самый широкий силуэт |
| `pet_owl` | 82 | 35 | 19 | верхняя правая зона, не загромождать полками/зеркалом |

Питомец не рисуется в `room` и не вшивается в item layer. `pet_horse` и `pet_owl` —
обязательные крайние проверки: мебель, плащ, посох и щит не должны пересекать их лица и
основной силуэт. Optional pet fallback не заменяет собой весь портрет.

### 8.4. Alpha, Pillow и отсутствие halo/chessboard

AI-результат не считается готовым alpha-слоем. Обязательна ручная визуальная очистка и
регистрация даже после автоматической маски.

1. В промте просим `plain solid white background`, не chessboard и не нарисованную
   «прозрачность». Если модель всё же выдала шахматку, это брак исходника, а не текстура.
2. Для белого фона используем маску «яркий и почти серый» + заливку от краёв;
   карманы между прядями, ремнями и пальцами добавляем разрастанием маски. Светлые
   кристаллы, шёлк, стекло и белые перчатки проверяем вручную, чтобы floodfill не съел
   сам предмет.
3. **Pillow/numpy:** изображение, созданное через `Image.fromarray(numpy_mask)`, может
   быть readonly. Перед `ImageDraw.floodfill` обязательно делаем
   `mask_image = Image.fromarray(numpy_mask).copy()`, иначе заливка молча не сработает.
4. **RGBA resize:** уменьшение 1536×1920 → 768×960 выполняем только с
   премультиплицированной альфой, затем корректно возвращаем straight alpha. Обычный
   resize прозрачного RGB оставляет цветной/белый halo.
5. Не уменьшаем вырезанный предмет отдельно и не добавляем белую обводку для «читаемости».
   Полный кадр сохраняет регистрацию; мягкая акварельная кромка не равна грязной alpha.
6. Каждый слой смотрим на белом, среднесером, тёмно-сером и настоящем фоне комнаты при
   200–400%: нет белого/чёрного ореола, шахматки, прямоугольного фона, полупрозрачной
   копии тела, случайных пикселей у краёв и обрезанных полупрозрачных концов.
7. `room.jpg` не используем как источник alpha для других слоёв. Инвентарный JPG тоже
   является только дизайн-референсом, а не готовой маской портрета.

### 8.5. Ручная приёмка в Chrome

1. До реальных файлов открыть `game/index.html` и «Комнату рыцаря»: должен быть прежний
   цельный fallback, без битых `<img>` и смеси стилей.
2. После каждой волны выполнить выборочный экспорт и `--check` по её id из раздела 2.4,
   затем `npm run build && npm test`; открыть игру и нажать Ctrl+F5. При необходимости
   повторить через обычный `npm run serve`, чтобы исключить кэш файла.
3. Проверить портрет в исходном размере 768×960 и на узком экране 390 px. Масштаб всего
   стека одинаковый; нет скачков комнаты, тела, предметов и питомца.
4. Пройти все комплекты 8.1, полные сеты 8.2 и попарные правила. Сравнивать каждый предмет
   с `game/assets/items/<тот же id>_web.jpg`: силуэт, материал, цвет и отличительная
   деталь совпадают, поза и свет остаются базовыми.
5. Временно убрать/повредить путь одного обязательного слоя только как локальную проверку
   загрузчика: портрет обязан целиком вернуться на fallback. Восстановить файл после
   проверки; пустой или ручной фальшивый manifest не принимается.
6. Убедиться в отсутствии 404 для зарегистрированных файлов, белых прямоугольников,
   chessboard, halo, читаемых надписей и watermark. Отсутствие необязательного питомца
   использует его собственный fallback и не ломает весь портрет.
7. Повторить приёмку после финальной волны на всех 122 id. Только реальные загруженные и
   визуально принятые файлы считаются готовыми; этот документ сам по себе артом не является.
