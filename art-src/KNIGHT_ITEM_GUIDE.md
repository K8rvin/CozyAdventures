# Подготовка предмета и кистей для 2D-рыцаря

Практическое руководство на примере `arm_ash_wayfarer`. Здесь зафиксирован именно
**принятый визуальной приёмкой pipeline**, а не промежуточные неудачные маски.

Связанные инструменты:

- `game/tools/prepare-knight-item.py` — повторяемая подготовка композита, брони и кистей.
- `game/tools/build-knight-art.mjs` и `game/tools/build_knight_art.py` — экспорт WebP,
  вторые варианты ring/belt, manifest и QA-листы.
- `art-src/PROMPTS_KNIGHT.md` — художественный контракт и каталог визуальных описаний.

Одноразовые скрипты из ручных итераций не сохранены. Вместо них оставлен повторяемый
`prepare-knight-item.py`, реализующий отработанную последовательность.

## 1. Что должно получиться

Для каждого тела (`male` и `female`) нужны:

- полный согласованный мастер `full.png`;
- `body.png` без отдельных кистей;
- `hands_base.png` — неизменяемый reusable-шаблон кистей;
- `hands.png` — вариант шаблона со срезом по конкретному рукаву;
- `parts/<bodyId>/<itemId>.png` — предметный слой брони;
- preview `body + armor + hands` на светлом и тёмном фоне и в комнате.

Все исходные PNG слоёв — **1536×1920 (4:5), RGBA**. Runtime WebP — **768×960** с той же
регистрацией кадра. `full.png` в runtime не идёт: это мастер для difference.

Не меняем голый мастер при подгонке брони под рукав. Срез выполняется на копии шаблона
кистей, а `body` собирается заново из полного мастера.

## 2. Каноническая структура файлов

```text
art-src/knight/
  room.png
  body_male_fist.jfif
  body_female_fist.jfif
  composites/
    arm_ash_wayfarer_male.jfif
    arm_ash_wayfarer_female.jfif
  doll/
    male/
      full.png
      body.png
      hands.png
      hands_base.png
    female/
      full.png
      body.png
      hands.png
      hands_base.png
  parts/
    male/arm_ash_wayfarer.png
    female/arm_ash_wayfarer.png
```

`hands_base.png` не перезаписывается при подгонке под новый рукав. `hands.png` — рабочая
версия для текущего предмета.

## 3. Обязательные входы перед работой

1. `doll/<bodyId>/full.png` — утверждённый полный композит тела, волос и кистей.
2. `doll/<bodyId>/hands_base.png` — принятые кисти по фактическому контуру.
3. `composites/<itemId>_<bodyId>.jfif` — полный композит тела в новой броне.
4. `room.png` — комната без персонажа и питомцев.
5. `game/assets/items/<itemId>_web.jpg` — точная инвентарная иконка предмета.

Перед массовой работой проверь:

- тело и кисти имеют один масштаб;
- нет современной одежды;
- волосы запечены в `body`, отдельные hair-файлы не нужны;
- все углы прозрачные;
- нет непрозрачных белых карманов между рукой, торсом, ногами и прядями;
- `body + hands` визуально совпадает с `full`.

## 4. Рабочая последовательность

### 4.1. Нормализация кадра и прозрачности

1. Удалить внешний белый фон заливкой от краёв.
2. Отдельно удалить замкнутые белые области: между рукой и торсом, между ногами,
   между прядями волос. Наружная заливка их не находит.
3. Дополнить холст до 4:5 без обрезки персонажа. Для исходника 1856×2304 сначала
   добавить высоту до 1856×2320, затем уменьшить до 1536×1920.
4. RGBA уменьшать только через premultiplied alpha (`RGBa -> resize -> RGBA`).

**Обязательно:** маска из numpy перед `ImageDraw.floodfill` получает `.copy()`.
`Image.fromarray(numpy_mask)` может быть read-only, и floodfill молча не сработает.

### 4.2. Reusable-шаблон кисти

1. Обвести кулак по фактическому контуру пальцев и короткого запястья.
2. В `hands_base` не должно быть одежды и её теней. Широкий полигон вокруг руки не подходит.
3. Не удалять светлые пиксели внутри контура: это портит кожу и блики.
4. Сохранить `hands_base` отдельно от текущего `hands`.

### 4.3. Полный item composite

Создаём его по утверждённому `full.png` и точной иконке предмета:

- меняется только снаряжение;
- лицо, волосы, кисти, поза, камера, масштаб, свет и стиль остаются неизменными;
- это не квадратная инвентарная иконка, а полный рост на теле;
- наруч не рисуем заново ради маски — он пригодится как есть.

### 4.4. Выделение брони

1. Нормализовать composite к тому же кадру, что и `full.png`.
2. Вычислить RGB distance между базой и composite.
3. Сохранить изменённые области брони, убрать неизменённое тело и фон.
4. Кисти удалять по `hands_base`, а не по широкой связной области кожи.
5. Наруч восстановить из исходного composite, затем убрать кисть по срезу рукава.

**Не расширять маску руки по связной области кожи ниже талии.** У мужского варианта
это стирает торс и открывает белое бельё. Работаем только внутри `hands_base`.

### 4.5. Срез по рукаву

Срез диагональный и соответствует нижнему краю наруча:

```text
правая кисть: y = right_b + right_a * (x - 950)
левая кисть:  y = left_b  + left_a  * (x - 550)
```

Оставляем только пиксели шаблона, для которых `y >= cut_line`. Наруч при этом не режем.
Его пиксели восстанавливаем из исходного composite.

Принятые параметры:

| Тело | Правая кисть | Левая кисть |
|---|---|---|
| `male` | `y = 985 + 0.3 * (x - 950)` | `y = 980 + 0.25 * (x - 550)` |
| `female` | `y = 1000 + 0.4 * (x - 950)` | без отдельного среза |

Не сдвигаем кулак и не растягиваем наруч: эти приёмы дали ореолы и дыры. Линия берётся
по фактическому нижнему краю наруча, а не как произвольное округление.

### 4.6. Preview до экспорта

Сначала смотрим `body + armor + hands` на светлом/тёмном фоне и в комнате. Проверяем:

- кисть начинается ровно по низу наруча;
- нет фона внутри кулака;
- нет одежды и её теней в `hands`;
- нет дырки в наруче;
- нет силуэта тела в предметном слое;
- нет белых карманов и белого ореола;
- обе кисти на своих местах.

Только после визуального подтверждения запускаем `--apply` и runtime-экспорт.

## 5. Использование prepare-knight-item.py

Запуск из `game/`. Требуются Python, Pillow и numpy только для разработки.

### 5.1. Безопасный dry-run

```bash
python tools/prepare-knight-item.py \
  --body male \
  --item arm_ash_wayfarer \
  --preview guide-male-review.jpg

python tools/prepare-knight-item.py \
  --body female \
  --item arm_ash_wayfarer \
  --preview guide-female-review.jpg
```

Без `--apply` скрипт создаёт только `tmp/guide-<body>-review.jpg` и не меняет рабочие файлы.

По умолчанию composite ищется как `art-src/knight/composites/<item>_<body>.jfif`.
Другой файл можно задать через `--composite`.

### 5.2. Применить принятый результат

```bash
python tools/prepare-knight-item.py \
  --body male \
  --item arm_ash_wayfarer \
  --preview guide-male-review.jpg \
  --apply

python tools/prepare-knight-item.py \
  --body female \
  --item arm_ash_wayfarer \
  --preview guide-female-review.jpg \
  --apply
```

`--apply` пишет только `body.png`, `hands.png` и предметный слой в `art-src`.
`hands_base.png` не перезаписывается. Оригинальные JFIF не изменяются.

### 5.3. Свои линии среза

Мужской вариант с двумя кистями:

```bash
python tools/prepare-knight-item.py \
  --body male \
  --item arm_ash_wayfarer \
  --cut-right-a 0.3 --cut-right-b 985 \
  --cut-left-a 0.25 --cut-left-b 980 \
  --preview guide-male-review.jpg
```

Женский вариант только с правым срезом:

```bash
python tools/prepare-knight-item.py \
  --body female \
  --item arm_ash_wayfarer \
  --cut-right-a 0.4 --cut-right-b 1000 \
  --preview guide-female-review.jpg
```

Не задавайте левые параметры, если левая кисть не требует среза. Если заданы только
`--cut-right-*`, левая остаётся без отдельного среза (кроме принятого male-default).

Дополнительные настройки armor-скрипта:

- `--threshold 20` — порог отличия от базы;
- `--seed-x 768 --seed-y 600` — точка связной области брони;
- `--head-cut 350` для male / `400` для female — очистка базовой головы;
- `--armor-out`, `--body-out`, `--hands-out`, `--template-out` — пути относительно `art-src`;
- `--preview` — путь относительно общего `tmp/`.

### 5.4. Оружие, щиты и расходники: isolated layers

Полноростовой difference для неброни остановлен: он подхватывал контуры тела и не давал
надёжного предметного слоя. Новый источник — изолированный предмет в ракурсе позы,
без человека, кистей и одежды. Промты пилота: `art-src/PROMPTS_KNIGHT_LAYERS.md`.

Входы первой волны:

```text
art-src/knight/isolated/wpn_rusty_sword_male.jfif
art-src/knight/isolated/shd_wooden_male.jfif
```

Подготовка выполняется `game/tools/prepare-knight-layer.py` из `game/`:

- внешний белый фон удаляется заливкой от краёв, RGB-difference с телом не используется;
- `--pocket X Y` явно добавляет замкнутый белый карман в исходных координатах;
- `--width`, `--height`, `--center-x`, `--center-y` задают равномерный scale и центр
  исходного alpha bbox на кадре 1536×1920; непропорционального растяжения нет;
- `--part main|back|both` выбирает части, `--mask` задаёт внешнюю белую маску main;
- для `both` transform вычисляется по ПОЛНОМУ alpha bbox, а не по masked bbox,
  поэтому back и main совпадают;
- без `--apply` создаются только четыре preview-панели: портрет, деталь, dark и light;
- `--apply` пишет только предметные PNG, тело и кисти не изменяются.

Для меча используется `--part main` и z-порядок `body → weapon → hands`.
Для щита — `--part both --mask knight/masks/<file>.png`:

```text
room → shd_wooden__back (дерево) → body → hands → shd_wooden (ремни)
```

Принятые unisex-выходы:

```text
parts/wpn_rusty_sword.png
parts/shd_wooden__back.png
parts/shd_wooden.png
```

Одинаковый transform подтверждён на male и female, поэтому body-specific дубли удалены.
`hasKnightDollBodyVariant(item)` выбирает отдельные пути только для брони и будущих id
из `KNIGHT_DOLL_BODY_VARIANT_ITEMS`; сейчас список пуст. Новые предметы сначала проверяем
как unisex, разделение добавляем только после доказанной несовместимости. У щита
`back: true` задано в `KNIGHT_DOLL_ITEM_RULES`, второй `__back` сдвигом не создаётся.

Принятые команды unisex (сначала без `--apply`):

```bash
python tools/prepare-knight-layer.py \
  --body male --item wpn_rusty_sword --slot weapon --output-mode shared \
  --angle -45 --pocket 2490 710 \
  --width 600 --height 620 --center-x 840 --center-y 1180 \
  --preview layer-unisex-sword-approved.jpg

python tools/prepare-knight-layer.py \
  --body male --item shd_wooden --slot shield --part both --output-mode shared \
  --mask knight/masks/shd_wooden_male_main.png \
  --width 360 --height 650 --center-x 540 --center-y 1070 \
  --preview layer-unisex-shield-approved.jpg
```

После визуального подтверждения к обеим командам добавляется `--apply`. Экспорт:

```bash
node tools/build-knight-art.mjs --check wpn_rusty_sword shd_wooden
node tools/build-knight-art.mjs wpn_rusty_sword shd_wooden
```

В Chrome проверен полный стартовый комплект на ОБОИХ телах: одинаковые unisex-пути,
`room → shield back → body → weapon → hands → shield main → belt`, 7 слоёв с одним
зельем и 8 с двумя. Все WebP загружены, fallback скрыт, overflow отсутствует. Снимки:
`tmp/knight-starter-male-two-chrome.jpg` и `tmp/knight-starter-female-two-chrome.jpg`.

Принятое зелье — `isolated/pot_heal.jfif`, только флакон в кармашке, БЕЗ ремня.
Команда (сначала без `--apply`):

```bash
python tools/prepare-knight-layer.py \
  --body male --item pot_heal --slot consumable --output-mode shared \
  --source knight/isolated/pot_heal.jfif \
  --width 125 --height 150 --center-x 760 --center-y 900 \
  --preview layer-unisex-potion-approved.jpg
```

`belt1` создаётся экспортёром сдвигом `dx=0.062`, `dy=0` (95 px вправо): кармашки
соседние, второго ремня нет. Старый композит с ремнём и маска `pot_heal_male_source.png`
в активном pipeline не используются. Экспорт: `node tools/build-knight-art.mjs pot_heal`.

### 5.5. Production manifest и партии

`art-src/knight/production-manifest.json` хранит `id`, `slot`, `part`, `source`, `mask`,
`outputMode`, `angle`, `pockets`, `width/height`, `centerX/centerY` и `status`.
Для дополнительного файла вроде колчана используется `outputId` основного предмета.
Статусы: `pending` (ждём исходник/transform), `preview` (на визуальной приёмке),
`approved` (подтверждено пользователем), `exported` (выпущено). Не переводить предмет
в approved без явной приёмки.

Из `game/`:

```bash
python tools/prepare-knight-batch.py --all-ready --body both
python tools/prepare-knight-batch.py wpn_rusty_sword shd_wooden pot_heal --body both
python tools/prepare-knight-batch.py <id> --body both --apply
```

Без `--apply` создаются только `tmp/batch-<body>-<id>-review.jpg`. Флаг разрешён только
для approved/exported; pending и preview отклоняются. Пакетный слоты: weapon, shield,
boots, gloves, amulet, ring, helmet и consumable. Плащи/броня продолжают отдельный
body-specific pipeline, в isolated manifest не смешиваются. Промты новых семейств:
`art-src/PROMPTS_FAMILY_PILOTS.md`.

## 6. Экспорт в игру после подтверждения

Из `game/`:

```bash
node tools/build-knight-art.mjs --check room male_body male_hands female_body female_hands arm_ash_wayfarer
node tools/build-knight-art.mjs room male_body male_hands female_body female_hands arm_ash_wayfarer
npm run build && npm test
```

Для одного тела:

```bash
node tools/build-knight-art.mjs male_body male_hands male/arm_ash_wayfarer
node tools/build-knight-art.mjs female_body female_hands female/arm_ash_wayfarer
```

Обычный `arm_ash_wayfarer` выбирает обе версии, `male/arm_ash_wayfarer` и
`female/arm_ash_wayfarer` — по одной.

Экспортёр создаёт WebP 768×960, manifest только по реально существующим файлам и QA:
`tmp/knight-contact[-patch]-<bodyId>-N.jpg`. Пустой или неполный комплект в игре
по-прежнему показывает цельный старый Canvas fallback.

## 7. Проверка в реальном интерфейсе

Для пилота оставляем только `arm_ash_wayfarer`, чтобы все обязательные слои были готовы.
Ожидаемые четыре слоя:

```text
room + body + arm_ash_wayfarer + hands
```

Проверяем в Chrome отдельно `settings.knightBody = male` и `female`:

- новый layered портрет виден, fallback скрыт;
- битых изображений и overflow нет;
- кисть и наруч стыкуются без фона;
- нет белой области одежды и ореола;
- обе версии тела выбираются по правильным путям.

Переключатель образа в настройках уже реализован. До готовности всех обязательных
слоёв стартового комплекта комната должна показывать цельный fallback, а не смесь стилей.

## 8. Что именно помогло получить результат

1. **Одна золотая база**, а не независимо сгенерированные тело, волосы и кисти.
2. **Неизменяемый `hands_base`**, а не новая маска для каждой вещи.
3. **Срез по фактическому наручу**, включая диагональ, а не фиксированная горизонталь.
4. **Срез только кисти и соответствующей части armor**, без удаления торса.
5. **Восстановление наруча из исходного composite**, а не закрашивание дыр случайным цветом.
6. **Никакого удаления светлых пикселей внутри кулака.**
7. **Никакого сдвига руки и растяжения наруча ради маскировки стыка.**
8. **Проверка не только alpha углов, но и замкнутых белых областей.**
9. **Preview до `--apply` и ещё один preview уже в реальном интерфейсе.**
10. **Возврат к исходному композиту при ошибке вместо наслоения новых масок.**

## 9. Типичные ошибки и как их исправлять

| Симптом | Причина | Решение |
|---|---|---|
| Белая область между рукой и торсом | Замкнутый фон не найден наружной заливкой | Удалить белый компонент по маске, затем проверить alpha |
| В `hands` видна одежда | Слишком широкий полигон или захват тени ткани | Оставить только фактический контур кисти |
| Кулак испорчен | Удалены светлые пиксели внутри контура | Восстановить `hands_base`, цветовую очистку внутри контура не делать |
| Дырка в наруче | Наруч удалён вместе с кистью | Восстановить наруч из исходного composite, затем убрать только кисть |
| Исчез торс или видно бельё | Маска расширилась за пределы кисти | Использовать `hands_base`, не расширять связную область кожи |
| Срез не виден | Изменён только `hands`, но не armor/body | Применить линию ко всем трём слоям и собрать их заново |
| Между наручем и кулаком фон | Простое удаление запястья без восстановления наруча | Вернуть наруч из исходника, затем обрезать кисть по линии |
| Цветной ореол | RGBA resize без premultiplied alpha или сдвиг с интерполяцией | `RGBa -> resize -> RGBA`; не двигать кулак ради стыка |
| Экспорт не принимает файл | Нет alpha или кадр не 4:5 | Привести слои к 1536×1920 RGBA, затем повторить `--check` |

## 10. Масштабирование на следующие предметы

- Броня и id из `KNIGHT_DOLL_BODY_VARIANT_ITEMS` используют `parts/<bodyId>/`,
  остальные предметы — unisex `parts/<itemId>.png`; выбор делает общий helper.
- Сначала делаем одну золотую базу и один предмет на каждое тело, затем идём по семействам.
- Оружие, щиты, кольца, амулеты и расходники генерируются изолированно в ракурсе позы.
- Составные предметы получают отдельные back/main/grip по правилам слоёв, а не маски тела.
- Иконка остаётся только референсом дизайна; её геометрический перенос не используется.
- Семейства ускоряют работу общим шаблоном промта, регистрацией кадра и параметрами
  подготовки, но каждый предмет проходит отдельную визуальную приёмку.
- Новые арты выпускаются только после визуальной приёмки. Промт, master или metadata сами
  по себе готовым изображением не являются.
