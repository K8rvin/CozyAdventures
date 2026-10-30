# Комната рыцаря: промты для пилотов семейств

По одному представителю на семейство. Не делаем массовую генерацию остального каталога,
пока посадка этих предметов не принята. Для аксессуаров сначала проверяем один общий
исходник на обоих телах. Броня и плащи остаются body-specific.

Общие референсы:

- стиль, свет и ракурс: `art-src/knight/doll/male/full.png`;
- точный дизайн: соответствующая иконка `game/assets/items/<itemId>_web.jpg`.

Во всех isolated-промтах Reference 1 — тело для стиля и ракурса, Reference 2 — иконка
конкретного предмета. Тело используется только как референс и в результате не нужно.
Общий стиль: romantic storybook gouache, warm light from the upper left, soft watercolor
texture, warm ink outlines. Все края предмета видны, белый фон без тени, без текста,
букв, чисел, логотипа, watermark, рамки и шахматки прозрачности.

## 1. Двуручное оружие — `wpn_greatsword_oak.jfif`

Сохранить в `art-src/knight/isolated/`.

```text
Reference 1 is only the pose, lighting and storybook style reference. Reference 2 is the mandatory design reference. Draw ONLY a massive two-handed greatsword of dark bog oak with a wide weathered steel blade and a brass crossguard as an isolated game equipment layer. Orient it for a relaxed non-combat lowered carry: pommel and long two-handed grip toward the upper right, guard below the grip, broad blade pointing down and toward the lower left. Make it clearly longer and broader than a one-handed shortsword, but keep the entire pommel, grip, guard, blade and tip visible without cropping. No person, no hands, no arms, no body, no clothes, no armor, no shield, no scabbard, no other objects, no cast shadow, no ground, plain solid white background.
```

Особая проверка: длинная двуручная рукоять, не обычный меч. Вторую кисть и отсутствие
щита проверяем при сборке отдельно.

## 2. Лук — `wpn_hunter_bow.jfif`

Сохранить в `art-src/knight/isolated/`.

```text
Reference 1 is only the pose, lighting and storybook style reference. Reference 2 is the mandatory design reference. Draw ONLY a dark wooden longbow with a quiet relaxed string and one silver-fletched arrow resting along the limb as an isolated game equipment layer. Keep the bow nearly vertical with a slight natural diagonal, relaxed and not drawn, suitable for a calm carry beside the body. Show the complete upper and lower limbs, grip, string and arrow. No person, no hands, no arms, no body, no clothes, no armor, no quiver, no additional arrows, no shield, no other objects, no cast shadow, no ground, plain solid white background.
```

### Колчан отдельно — `wpn_hunter_bow__back.jfif`

Тоже сохранить в `art-src/knight/isolated/`.

```text
Reference 1 is only the lighting and storybook style reference. Reference 2 is the mandatory design reference for the matching hunter equipment. Draw ONLY a practical leather back quiver containing several wooden arrows with silver fletching as an isolated game equipment layer. Show it in a three-quarter back-view orientation suitable for placement behind the knight's shoulder, with the complete quiver body, carrying strap and visible arrow fletching. No person, no shoulder, no neck, no head, no body, no clothes, no armor, no bow, no other objects, no cast shadow, no ground, plain solid white background.
```

Проверка: лук и колчан — разные файлы. В файле колчана не должно быть второго лука.

## 3. Капюшон — `hlm_leather.jfif`

Сохранить в `art-src/knight/isolated/`.

```text
Reference 1 is only the head angle, lighting and storybook style reference. Reference 2 is the mandatory design reference. Draw ONLY a soft brown leather hood with stitched seams and a folded rim as an isolated game equipment layer. Show it in the same gentle three-quarter orientation as the knight's head, with a natural head-shaped opening and enough volume to cover the entire hairstyle. The hood must be empty: no head, no face, no hair and no neck inside. Show the complete hood and all seams. No person, no body, no clothes, no armor, no other objects, no cast shadow, no ground, plain solid white background.
```

Проверка: нет лица и волос внутри. Капюшон должен полностью заменять видимую причёску,
а не ложиться поверх неё.

## 4. Перчатки — `glv_herbalist.jfif`

Сохранить в `art-src/knight/isolated/`.

```text
Reference 1 is only the hand positions, lighting and storybook style reference. Reference 2 is the mandatory design reference. Draw ONLY a pair of empty herbalist gloves made of greenish canvas with leather palms and a small sprig of dried nettle tucked into one cuff as an isolated game equipment layer. Arrange the gloves to match the reference pose: the glove for the hand on image right has a closed-fist shape, the glove for the hand on image left has a relaxed open-hand shape with gently curved fingers. Keep clear wrist openings and natural three-quarter orientation. The gloves are empty: no skin, no fingers, no hands, no wrists, no arms and no body inside. Show both complete gloves. No other objects, no cast shadow, no ground, plain solid white background.
```

Проверка: два пустых перчаточных силуэта в позе базовых кистей. Не принимаем пару,
лежащую витриной или смотрящую в другую сторону.

## 5. Сапоги — `bt_path.jfif`

Сохранить в `art-src/knight/isolated/`.

```text
Reference 1 is only the foot positions, lighting and storybook style reference. Reference 2 is the mandatory design reference. Draw ONLY a pair of light trail boots made of tan leather with grass-green laces, mud-brushed toes and a tiny clover leaf attached to one heel as an isolated game equipment layer. Show empty boots in a relaxed standing three-quarter orientation matching the reference feet, with distinct left and right shapes, complete soles, heels, cuffs and laces. No legs, no feet, no socks, no person, no body, no clothes, no armor, no other objects, no cast shadow, no ground, plain solid white background.
```

Проверка: оба сапога пустые, стоят в позе базовых стоп, не витринный вид сбоку.

## 6. Плащ — `arm_ink_cloak_male.jfif`

Это armor-пилот, поэтому НЕ isolated. Сохранить в `art-src/knight/composites/`.

Reference 1 — `art-src/knight/doll/male/full.png`, Reference 2 —
`game/assets/items/arm_ink_cloak_web.jpg`.

```text
Reference 1 is the approved fixed full-body male base template. Reference 2 is the mandatory design reference for the exact cloak. Create a full-frame 4:5 registration composite by dressing the character in a flowing cloak of deep violet-black cloth with a subtle wet-ink sheen, a high collar, a silver clasp and one small stray ink blot near the hem. Preserve exactly the same face, hair, adult anatomy, hand positions, relaxed three-quarter pose, feet, camera, crop, character scale and warm light from the upper left. Show enough of the front collar and clasp for the main layer and enough of the rear cloak silhouette for a separate back layer. Do not add any other armor or equipment, do not change the base underwear visible below the cloak, no modern clothes, no text, no logo, no watermark, plain solid white background.
```

Проверка: полный рост на том же теле, отдельные видимые front/back области плаща.
Ворот и застёжка не исчезают, ткань не проходит сквозь лицо и кисти.

## 7. Амулет — `amu_hearth.jfif`

Сохранить в `art-src/knight/isolated/`.

```text
Reference 1 is only the lighting and storybook style reference. Reference 2 is the mandatory design reference. Draw ONLY a cozy pendant shaped like a tiny hearth with a warm ember glowing gently inside, hanging from a braided leather cord as an isolated game equipment layer. Show the complete pendant and the full cord loop in a natural upright orientation suitable for the knight's chest. Keep the ember local and restrained, without an aura. No person, no neck, no chest, no body, no clothes, no armor, no other objects, no cast shadow, no ground, plain solid white background.
```

Проверка: виден весь шнурок, подвеска не увеличена до броши или настенного камина.

## 8. Кольцо — `rng_luck.jfif`

Сохранить в `art-src/knight/isolated/`.

```text
Reference 1 is only the lighting and storybook style reference. Reference 2 is the mandatory design reference. Draw ONLY a simple copper ring with a tiny pressed four-leaf clover sealed in clear resin as an isolated game equipment layer. Show the complete ring at a slight three-quarter angle, with readable copper material and a small clover detail of believable ring size. No finger, no hand, no person, no body, no clothes, no armor, no additional jewelry, no glow aura, no other objects, no cast shadow, no ground, plain solid white background.
```

Проверка: обычное маленькое кольцо, не брошь и не медальон. Два положения подберём
при сборке без изменения дизайна.

## 9. Свиток — `scr_fire_arrow.jfif`

Сохранить в `art-src/knight/isolated/`.

```text
Reference 1 is only the lighting and storybook style reference. Reference 2 is the mandatory design reference. Draw ONLY one compact rolled parchment spell scroll tied with a dark red cord and sealed with a small wax seal as an isolated game equipment layer. Add a subtle flame-colored motif on the visible parchment edge, without readable writing. Show the complete rolled scroll, cord and seal in a gentle three-quarter orientation suitable for a belt slot. No person, no hand, no body, no clothes, no armor, no belt, no pouch, no strap, no second scroll, no other objects, no cast shadow, no ground, no text, no letters, no numbers, plain solid white background.
```

Проверка: один закрытый свиток без пояса и без читаемых символов. Два соседних
положения подберём после генерации.

## Порядок приёмки

Сначала можно сгенерировать 2–3 файла из разных семейств. Для каждого предмета:

1. Проверяем исходник на белом фоне и отсутствие тела/лишних частей.
2. Делаем dry-run на male и female, подбираем transform и дополнительные маски.
3. Пользователь оценивает общий портрет и крупные планы.
4. Только после подтверждения — `--apply`, экспорт, тесты и Chrome.
5. Фиксируем принятые параметры в `art-src/KNIGHT_ITEM_GUIDE.md` и production manifest.
