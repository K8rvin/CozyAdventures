# Комната рыцаря: изолированные предметы для послойной сборки

Новый пилот. Генерируем **только предмет**, а не тело с предметом. Difference с телом,
перенос инвентарной иконки и автоматическое угадывание хвата не используются.

Сначала делаем два файла для `male`:

```text
art-src/knight/isolated/
  wpn_rusty_sword_male.jfif
  shd_wooden_male.jfif
```

После визуальной приёмки механизма тем же способом готовим `female`. Не генерируем
следующие предметы пакетами до утверждения пилота.

## Референсы

- Поза, свет и стиль: `art-src/knight/doll/male/full.png`.
- Точный дизайн меча: `game/assets/items/wpn_rusty_sword_web.jpg`.
- Точный дизайн щита: `game/assets/items/shd_wooden_web.jpg`.

Тело служит только референсом ракурса, пропорций и освещения. В результате его быть не должно.

## 1. Меч — `wpn_rusty_sword_male.jfif`

Reference 1 — базовое тело, Reference 2 — иконка предмета.

```text
Reference 1 is only the camera, lighting and storybook style reference for the approved male knight pose. Reference 2 is the mandatory design reference for the exact item. Draw ONLY the old but sharp knight's shortsword as an isolated game equipment layer: worn dark leather grip, simple weathered metal crossguard, broad steel blade and a tiny dried lavender sprig tied to the pommel. Orient the sword for a relaxed non-combat carry in the closed hand on image right: pommel and grip toward the upper right, crossguard below the grip, blade pointing downward and toward the lower left at approximately forty-five degrees. Show the complete pommel, grip, guard, blade, tip and lavender sprig, with no cropping. Use believable shortsword proportions, not a dagger and not a greatsword. Romantic storybook gouache, warm light from the upper left, soft watercolor texture and warm ink outlines, consistent with Reference 1. No person, no hand, no arm, no body, no clothes, no armor, no scabbard, no other objects, no cast shadow, no ground, no text, no letters, no numbers, no logo, no watermark, no frame, plain solid white background.
```

Проверка: рукоять и гарда ориентированы так, чтобы кулак мог лечь поверх рукояти,
а клинок уходил вниз-влево. Не нужен белый контур вокруг меча.

## 2. Щит — `shd_wooden_male.jfif`

Reference 1 — базовое тело, Reference 2 — иконка предмета.

```text
Reference 1 is only the camera, lighting and storybook style reference for the approved male knight pose. Reference 2 is the mandatory design reference for the exact item. Draw ONLY the light round linden wood shield as an isolated game equipment layer, viewed from its BACK side in the same three-quarter orientation it would have while mounted on the relaxed left forearm on image left. The round shield appears as a tall foreshortened ellipse. Use warm honey wood grain, a simple wooden rim, subtle charcoal children's drawings near the lower rim, a sturdy central handle and two practical dark leather forearm straps with small metal buckles. Keep the handle and both straps clearly visible and separated enough to be extracted as a front layer. Show the complete shield and every strap, with no cropping. Proper medium round-shield proportions, not a tiny buckler and not a tower shield. Romantic storybook gouache, warm light from the upper left, soft watercolor texture and warm ink outlines, consistent with Reference 1. No person, no hand, no forearm, no arm, no body, no clothes, no armor, no weapon, no other objects, no cast shadow, no ground, no text, no letters, no numbers, no logo, no watermark, no frame, plain solid white background.
```

Проверка: видна именно внутренняя сторона щита, а не лицевой медальон с боссом.
Деревянная основа пойдёт под тело, рукоять и ремни — в отдельный слой поверх руки.

## 3. Зелье — `pot_heal.jfif`

Сохранить результат как `art-src/knight/isolated/pot_heal.jfif`.
Reference 1 — базовое тело для света и стиля, Reference 2 —
`game/assets/items/pot_heal_web.jpg` для точного дизайна флакона.

```text
Reference 1 is only the lighting and romantic storybook style reference for the approved knight. Reference 2 is the mandatory design reference for the exact healing potion. Draw ONLY one small round glass potion bottle resting inside a simple stitched brown leather pouch as an isolated game equipment layer. Match Reference 2: warm rose-red healing brew, a natural cork stopper, tiny heart-shaped bubbles inside the glass and subtle glass reflections. Keep the bottle upright in a gentle three-quarter view, with the complete cork, neck, round glass body and the complete pouch visible. Use believable hand-sized potion proportions, delicate glass thickness and a small practical pouch without any belt or strap. Romantic storybook gouache, warm light from the upper left, soft watercolor texture and warm ink outlines, consistent with Reference 1. No person, no hand, no arm, no body, no clothes, no armor, no belt, no strap, no buckle, no stand, no other objects, no second bottle, no cast shadow, no ground, no text, no letters, no numbers, no logo, no watermark, no frame, plain solid white background.
```

Проверка: ОДИН флакон в ОДНОМ кармашке, без ремня и частей тела.
Принято: `width 125`, `height 150`, центр `(760, 900)`; второй кармашек на 95 px
вправо без dy. Оба положения проверены в Chrome на male и female. Старый composite
с ремнём больше не используем.

## Общие правила приёмки

- В исходнике нет человека, кистей, рук, одежды, доспехов и второго предмета.
- Все края предмета видны, ничего не обрезано рамкой.
- Ракурс соответствует позе, а не инвентарной иконке.
- Нет тени на фоне, подписи, логотипа или шахматки «прозрачности».
- Не выбираем вариант с белым ореолом вокруг предмета.
- Масштаб и посадку проверяем на теле в dry-run до записи в `parts/`.
- Для каждого preview сохраняем общий портрет, крупный план и слой на светлом/тёмном фоне.

## После генерации

Сначала проверяем исходники, затем используем `game/tools/prepare-knight-layer.py`.
Без `--apply` скрипт создаёт только preview в `tmp/` и не меняет игровые слои.
Принятые bounds/anchor, маски и команды фиксируются в `art-src/KNIGHT_ITEM_GUIDE.md`.
