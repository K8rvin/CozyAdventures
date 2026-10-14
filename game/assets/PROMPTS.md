# Промты для генерации ассетов (PNG/JPEG)

Отдай эти промты своим моделям (Midjourney, DALL·E, Flux, SD и т.п.).
Сохраняй результат под указанными именами в `game/assets/` — игра подхватит их автоматически
(сейчас используются `.svg`; если положишь `.png` с тем же именем — скажи, поменяю пути в коде).

Общий стиль игры: уютная волшебная лавка, тёплый свет свечей, тёмное дерево,
янтарные акценты, без текста и водяных знаков.

---

## 1. hub_banner.png — главная сцена лавки (САМЫЙ ВАЖНЫЙ)

Сейчас это канвас + SVG-баннер. Нужен детальный, правдоподобный арт интерьера.

```
Cozy magical general store interior, wide establishing shot, warm candlelight, 
dark wooden shelves filled with potions, lanterns, scrolls and jars, a wooden 
counter with a brass bell, a sleeping ginger cat on a cushion, a knight's armor 
stand near a round door on the right, a window showing a misty forest glade 
outside, garlands of dried herbs hanging from beams, soft amber glow with deep 
brown shadows, storybook watercolor illustration with gentle ink outlines, 
high detail, lived-in and loved atmosphere, no text, no watermark --ar 3:1
```

Альтернатива (флэт-вектор):

```
Cozy magical shop interior, wide banner, modern flat vector illustration, 
bold clean shapes, warm palette of deep brown #3d2f22, amber #ffca7a, 
moss green #5d6b3f, cream #f3e6cf, wooden shelves with potions and lanterns, 
counter, sleeping cat, knight helmet on a stand, window with forest view, 
no text --ar 3:1
```

## 2. seek_meadow.png — сцена поиска «Тихая опушка»

ВАЖНО: это искалка — предметов должно быть ОЧЕНЬ много, плотный зажор сцены,
много маленьких деталей, в которых тонут целевые вещи.

```
Top-down view of a cozy forest glade for a hidden-object game, EXTREMELY 
dense clutter: hundreds of small objects — spotted mushrooms of many kinds, 
wildflowers, acorns, pinecones, snail shells, pebbles, fallen leaves, fern 
fronds, moss patches, twigs, berries, feathers, tree roots at the edges, 
morning dew sparkles, fireflies, a forgotten boot, an old bird nest, a rusty 
horseshoe, dappled warm light, storybook watercolor style, every corner 
filled with tiny details, objects slightly overlapping, no text --ar 8:5
```

## 3. seek_town.png — сцена поиска «Средневековый дворик»

```
Top-down view of a cozy medieval market courtyard for a hidden-object game, 
EXTREMELY dense clutter: cobblestone pavement, dozens of wooden crates and 
barrels, a market cart spilling apples, sacks of grain, hanging lanterns, 
striped fabric awnings, bread loaves, cheese wheels, fish on ice, ropes, 
baskets, clay jugs, scattered coins, horseshoes, tools, keys, folded cloth, 
a sleeping dog in the corner, pigeons, straw everywhere, warm afternoon 
light, storybook watercolor style, hundreds of small overlapping objects, 
no text --ar 8:5
```

## 4. seek_attic.png — сцена поиска «Книжный чердак»

```
Top-down view of a cozy old library attic for a hidden-object game, 
EXTREMELY dense clutter: tall stacks of aged books everywhere, open scrolls 
and loose pages, candle stubs, brass inkwells, quills, bookmarks, spectacles, 
a globe, an astrolabe, sealed letters, wax sticks, teacups, a pocket watch, 
dried flowers between pages, cobwebs in corners, dust motes in warm light 
beams from a round window, wooden plank floor, storybook watercolor style, 
hundreds of small overlapping objects, no text --ar 8:5
```

## 4b. seek_market.png — сцена поиска «Ночной рынок»

```
Top-down view of a cozy night market for a hidden-object game, EXTREMELY 
dense clutter: paper lanterns of many colors strung overhead, food stalls 
with steaming dumplings and tea pots, masks and ribbons on strings, coins 
scattered on dark cobblestones, glowing jars, origami figures, silk cloth, 
incense sticks, a sleeping fox under a cart, shadows and warm lantern glow 
mixing, spirit wisps in the air, hundreds of small overlapping objects, 
storybook watercolor style, night palette with warm amber accents, 
no text --ar 8:5
```

## 4c. seek_swamp.png — сцена поиска «Сказочные топи»

```
Top-down view of a cozy fairy swamp for a hidden-object game, EXTREMELY 
dense clutter: glowing mushrooms, lily pads, croaking frogs, reeds and 
cattails, fireflies over misty water, an old witch's hut on chicken legs in 
the corner, hanging herbs, clay pots, wooden bridges, glowing berries, 
bubbles in murky water, dragonflies, an old boot in the mud, hundreds of 
small overlapping objects, storybook watercolor style, misty green-blue 
palette with warm glow accents, no text --ar 8:5
```

## 4d. seek_fair.png — сцена поиска «Звёздная ярмарка»

```
Top-down view of a cozy starlight fair for a hidden-object game, EXTREMELY 
dense clutter: constellation banners, telescopes, glowing star charts, 
crystal balls, moon-shaped pastries, silver wind chimes, velvet cloth with 
gold embroidery, candles in glass spheres, falling star fragments, 
comet-tailed kites, astrolabes, midnight-blue palette with silver and amber 
accents, hundreds of small overlapping objects, storybook watercolor style, 
no text --ar 8:5
```

## 4e. seek_forge.png — сцена поиска «Кузница изнутри»

```
Top-down view of a cozy medieval forge interior for a hidden-object game, 
EXTREMELY dense clutter: anvils, tongs and hammers of many sizes, horseshoes, 
glowing coals, bellows, quenching barrels with steam, nails and rivets 
scattered on the floor, sword blanks, coal piles, leather aprons, metal 
ingots, spark trails, storybook watercolor style, dark palette with hot 
orange glow accents, hundreds of small overlapping objects, no text --ar 8:5
```

## 4f. seek_crystal.png — сцена поиска «Хрустальные горы»

```
Top-down view of cozy crystal mountains for a hidden-object game, EXTREMELY 
dense clutter: sparkling quartz clusters of many sizes, snow drifts, frozen 
pines, ice shards, crystal golem parts, snow owl feathers, echo stones, 
glowing cave entrance, ropes and pitons, frost flowers, icicles, scattered 
sapphires and amethysts, a frozen lantern, storybook watercolor style, 
cold blue-white palette with warm amber glow accents, hundreds of small 
overlapping objects, no text --ar 8:5
```

## 4g. seek_jade.png — сцена поиска «Нефритовый сад»

```
Top-down view of a cozy jade oriental garden for a hidden-object game, 
EXTREMELY dense clutter: stone lanterns, bamboo stalks, paper cranes, 
tea sets on low tables, koi pond with lily pads, red torii details, 
folding fans, ink brushes, jade figurines, plum blossom petals, 
sand zen patterns with rakes, paper umbrellas, hanging red lanterns, 
a sleeping crane, hundreds of small overlapping objects, storybook 
watercolor style, jade green and ink palette with warm lantern glow, 
no text --ar 8:5
```

## 4h. seek_grotto.png — сцена поиска «Подводный грот»

```
Top-down view of a cozy flooded grotto for a hidden-object game, EXTREMELY 
dense clutter: coral formations, pearl shells, drifting bubbles, seaweed 
ribbons, sunken amphorae, glowing jellyfish, starfish, ancient coins, 
a mermaid's comb, shipwreck planks, glowing cave pearls, small crabs, 
sea glass pieces, a message in a bottle, hundreds of small overlapping 
objects, storybook watercolor style, deep teal and turquoise palette 
with glowing warm light from above, no text --ar 8:5
```

## 4i. seek_clockwork.png — сцена поиска «Туманные часы»

```
Top-down view of a cozy clockwork chamber in the mist for a hidden-object 
game, EXTREMELY dense clutter: giant brass gears and cogs, pocket watches, 
hourglasses, winding keys, rusted automatons parts, floating dust in light 
beams, old blueprints, springs and pendulums, a workbench with tiny tools, 
broken clock faces, oil cans, time-worn photo frames, a sleeping cat made 
of brass, hundreds of small overlapping objects, storybook watercolor 
style, brass and sepia palette with misty blue glow, no text --ar 8:5
```

## 1b. town_square.png — городская площадь (хаб-навигация)

Площадь для переходов: слева кузница, справа таверна, в центре верстак-мастерская,
с краю дорога/фонарь обратно в лавку. Здания должны чётко читаться по углам.

```
A cozy medieval town square, wide banner, storybook watercolor illustration 
with gentle ink outlines, warm evening light. A TAVERN on the right side 
with a hanging wooden sign, glowing windows and a bench outside; a FORGE 
on the left side with a smoking chimney, an anvil outside and sparks in 
the doorway; a small WORKBENCH with tools and lanterns in the center; 
a wooden notice board and a lantern-lit path leading away at the edge; 
cobblestones, flower pots, a fountain with doves, no people, no text, 
no watermark --ar 3:1
```

Размер: ≥1500×500 (как hub_banner). Сохранить как `assets/town_square.jfif` —
игра подхватит (цепочка `town_square_web.jpg → seek_town_web.jpg`).

## 1c. town_market.png — торговый квартал (лавки: оружейник, бронник, маг, алхимик)

Квартал, где четыре лавки чётко читаются по углам и имеют вывески-предметы.

```
A cozy medieval merchant quarter, wide banner, storybook watercolor 
illustration with gentle ink outlines, warm evening light. Four distinct 
small shops around a cobblestone lane, each with a clear hanging sign: 
a WEAPONSMITH on the left with a sword sign and blades in the window; 
an ARMORER next with a shield sign, a mail hauberk and a helmet on 
display; a MAGIC SHOP right of center with a crystal ball sign, glowing 
vials and starry drapes; an ALCHEMIST shop on the right with a potion 
flask sign, bubbling cauldrons and herb bundles. Warm lantern light, 
flower pots, a cat sleeping on a windowsill, no people, no text, 
no watermark --ar 3:1
```

Размер: ≥1500×500 (как hub_banner). Сохранить как `assets/town_market.jfif`.

## 5. icon_knight.png — портрет рыцаря (128×128)

```
Cute knight portrait icon for a cozy fantasy game, round friendly helmet 
with a small leaf plume, warm smile under the visor, soft storybook 
watercolor style, centered composition, warm amber and moss palette, 
no text --ar 1:1
```

## 6. intro.png — заставка (атмосфера лавки в сумерках)

```
A cozy lantern-lit fantasy shop sign swaying at dusk, warm light spilling 
from windows onto a cobblestone path between worlds, fireflies rising, 
a tiny spider descending on a glowing web thread in the corner, storybook 
watercolor illustration, gentle and inviting, no text --ar 2:1
```

---

## Технические заметки

- Размеры: баннер ≥1500×500, сцены поиска ≥1600×1000, иконка ≥256×256, заставка ≥1600×800.
- Если модель пишет текст/буквы — добавь в негативный промпт: `text, letters, watermark, signature, frame`.
- Сцены поиска в игре кладутся под сетку с полупрозрачным затемнением — можно чуть ярче, чем кажется нужным.

---

## 7. Питомцы — assets/pets/*.png (прозрачный фон, полный рост)

Пять питомцев, которые живут на сценах лавки и площади. Нужны ОТДЕЛЬНЫЕ
картинки на прозрачном фоне (PNG with transparent background / isolated
character). Стиль — тот же storybook watercolor с мягким чернильным контуром,
что и сцены лавки/площади, чтобы звери сидели в них как родные.
Все смотрят вправо (в профиль или три четверти), мягкий тёплый свет слева,
БЕЗ фона, тени-пятна, текста и рамок. Высота ~600–800 px.

Общий кусок стиля для всех промтов (добавляй в конец каждого):

```
storybook watercolor illustration with gentle ink outlines, warm candlelit
palette of amber, honey and deep brown, full body, side or three-quarter view
facing right, isolated on a transparent background, no ground, no shadow,
no text, no frame, cozy fantasy game character
```

### 7.1 pet_hedgehog.png — Ёжик (живёт в лавке)

```
A small cute hedgehog sitting among flour sacks in a cozy shop, soft rounded
spines with a few autumn leaves and a tiny mushroom stuck in them, curious
black bead eyes, slightly chubby, paws tucked under, storybook watercolor
illustration with gentle ink outlines, warm candlelit palette of amber, honey
and deep brown, full body, side view facing right, isolated on a transparent
background, no ground, no shadow, no text, cozy fantasy game character
```

### 7.2 pet_fox.png — Лисёнок (живёт в лавке)

```
A young red fox sitting upright with a fluffy curled tail, clever squinting
eyes and a sly little smile, one ear tilted, wearing a tiny green shopkeeper
kerchief around the neck, storybook watercolor illustration with gentle ink
outlines, warm candlelit palette of amber, honey and deep brown, full body,
three-quarter view facing right, isolated on a transparent background,
no ground, no shadow, no text, cozy fantasy game character
```

### 7.3 pet_puppy.png — Щенок (живёт в лавке)

```
A small fluffy puppy sitting with head tilted, holding an old leather coin
pouch gently in its teeth, wagging tail slightly blurred in motion, big warm
brown eyes, floppy ears, storybook watercolor illustration with gentle ink
outlines, warm candlelit palette of amber, honey and deep brown, full body,
three-quarter view facing right, isolated on a transparent background,
no ground, no shadow, no text, cozy fantasy game character
```

### 7.4 pet_owl.png — Сова-библиотекарь (живёт в лавке)

```
A small round tawny owl perched with one wing holding a tiny bookmark ribbon,
wearing miniature round spectacles, wise sleepy eyes, soft layered feathers
in warm brown and cream, storybook watercolor illustration with gentle ink
outlines, warm candlelit palette of amber, honey and deep brown, full body,
side view facing right, isolated on a transparent background, no perch,
no ground, no shadow, no text, cozy fantasy game character
```

### 7.5 pet_horse.png — Сивка, ездовая лошадь (живёт на площади у доски объявлений)

```
A sturdy gentle draft horse with a soft grey-dappled coat, calm kind eyes,
a simple leather saddle with a small rolled travel blanket and a brass
lantern hanging from the saddle, a few oats stuck in the mane, storybook
watercolor illustration with gentle ink outlines, warm afternoon palette of
amber, honey and deep brown, full body, side view facing right, isolated on
a transparent background, no ground, no shadow, no text, cozy fantasy game
character
```

Сохранять как `assets/pets/pet_hedgehog.png`, `pet_fox.png`, `pet_puppy.png`,
`pet_owl.png`, `pet_horse.png` — игра подхватит их автоматически
(пока файла нет, показывается иконка-эмодзи).

Если модель не умеет прозрачный фон — генерируй на чистом белом и вырежи,
или скажи мне, вырежу фон скриптом сам.

---

## 8. Варка зелий — ассеты алхимического стола

Механика «Варка по рецепту»: котёл и ингредиенты рисуются поверх фона-стола,
книга — отдельной вставкой. Стиль тот же storybook watercolor, что и у сцен
лавки и площади.

### 8.1 brew_table.png — главный ассет: стол алхимика (САМЫЙ ВАЖНЫЙ)

ВАЖНО: центр нижней половины должен быть СВОБОДЕН — туда игра ставит котёл
(круг ~30% ширины). Ингредиенты и приборы — по краям и в верхней части.

```
Cozy alchemist workbench seen from a slightly elevated front view, storybook
watercolor illustration with gentle ink outlines, warm candlelight: a heavy
oak table filling the frame, its center-left lower area EMPTY for a cauldron,
while the edges and background are richly detailed — glass potion bottles of
amber, green and violet, labeled jars with dried herbs, a brass mortar and
pestle, a wooden spoon, a small brazier with coals, candles, a scales with
brass weights, hanging dried lavender and garlic above, scrolls tucked at
the side, honey pot, berries in a bowl, feathers, soft amber glow with deep
brown shadows, no cauldron in the center, no text, no watermark --ar 16:10
```

Сохранить как `assets/brew_table.jfif` (я сам сожму в `brew_table_web.jpg`).

### 8.2 recipe_book.png — раскрытая книга рецептов (для заставки механики)

```
An open antique recipe book on a wooden table, seen from above at a slight
angle, storybook watercolor illustration with gentle ink outlines: yellowed
pages with handwritten-style scribbles and small painted illustrations of a
cauldron, herbs, a mortar, a spoon and flames, ink blots, a pressed dried
flower between the pages, a quill lying across the spine, warm candlelight
from the left, cozy and loved, handwritten text is decorative scribbles,
not readable letters, no watermark --ar 4:3
```

Сохранить как `assets/recipe_book.jfif`. Пока файла нет, книга в игре
рисуется CSS-пергаментом — ассет добавим фоном в панель рецепта.

---

## 9. Кот лавки и спутники — assets/crew/*.png (белый фон, полный рост)

Кот-хранитель и спутники появляются после найма, даже если не в отряде.
Кот лежит на подушке, клик = погладить. Тот же стиль storybook
watercolor, что питомцы и сцены.
ФОН: проси ровный белый (`plain solid white background`) — НЕ «transparent
background», иначе модель рисует серо-белые клетки псевдо-прозрачности,
а они вырезаются грязно. Белый фон я вырежу скриптом без потерь.

Общий хвост стиля для всех:

```
storybook watercolor illustration with gentle ink outlines, warm candlelit
palette of amber, honey and deep brown, full body, isolated on a plain
solid white background, no ground, no shadow, no text, cozy fantasy game
character
```

### 9.1 cmp_cat.png — Кот-хранитель на подушке (появляется после найма)

ВАЖНО: этот арт кладётся ПОВЕРХ кота, уже нарисованного в hub_banner —
нужно полностью перекрыть нарисованных кота и подушку. В кадре ТОЛЬКО
кот и подушка (без табурета — он остаётся от фона), тот же ракурс
(вид сбоку), голова вправо. Кот крупно, по центру, подушка снизу.

```
A plump ginger shop cat curled asleep on a round burgundy velvet cushion
with tassels, cat's tail wrapped over its paws, head resting to the right,
one ear twitching, content and warm, only the cat and the cushion in frame,
storybook watercolor illustration with gentle ink outlines, warm candlelit
palette of amber, honey and deep brown, side view facing right, isolated
on a plain solid white background, no stool, no ground, no shadow, no text,
cozy fantasy game character
```

### 9.2 cmp_firefly.png — Светлячок (порхает в лавке, крупный план)

```
A large friendly firefly with a glowing warm-yellow abdomen, delicate
translucent wings with watercolor veins, tiny smiling face, soft light halo
around the abdomen, storybook watercolor illustration with gentle ink
outlines, warm candlelit palette, isolated on a plain solid white
background, no shadow, no text, cozy fantasy game character
```

### 9.3 cmp_herbalist.png — Травница (стоит у полок в лавке)

```
A kind middle-aged herbalist woman in a moss-green apron over a linen dress,
a wicker basket of fresh herbs on her arm, a sprig of lavender in her hand,
hair in a bun with a knitted shawl, gentle smile, storybook watercolor
illustration with gentle ink outlines, warm candlelit palette of amber,
honey and deep brown, full body, three-quarter view facing right, isolated
on a plain solid white background, no ground, no shadow, no text, cozy
fantasy game character
```

### 9.4 cmp_smith.png — Кузнец-подмастерье (стоит на площади у кузницы)

```
A young stocky blacksmith apprentice with rolled-up sleeves, a leather apron,
a small hammer resting on his shoulder, a few soot smudges on his cheerful
face, rolled trousers and sturdy boots, storybook watercolor illustration
with gentle ink outlines, warm afternoon palette of amber, honey and deep
brown, full body, three-quarter view facing left, isolated on a plain solid
white background, no ground, no shadow, no text, cozy fantasy game character
```

Сохранять как `assets/crew/cmp_cat.png`, `cmp_firefly.png`, `cmp_herbalist.png`,
`cmp_smith.png` и прислать мне — вырежу белый фон скриптом, сохраню
как прозрачные PNG, и игра подхватит их автоматически (без файла
показывает иконку-эмодзи). Если тулза умеет настоящий PNG с альфой —
тоже годится, тогда резать не нужно.

---

## Заметка про фон при генерации персонажей (питомцы, спутники, кот)

- ЛУЧШЕ ВСЕГО: проси `isolated on a plain solid white background, no shadow`
  вместо «transparent background» — ровный белый фон я вырезаю скриптом
  без потерь.
- ИЗБЕГАТЬ: шахматных клеток «псевдо-прозрачности» (серо-белая клетка) —
  это модель нарисовала паттерн как картинку; контур персонажа после
  вырезания получается грязным. Если получил клетки — перегенерируй
  с формулировкой про белый фон.
- Настоящий PNG с альфа-каналом — тоже отлично, тогда вообще ничего
  резать не нужно.
- Равномерный серый фон — допустимо, справлюсь, но белый надёжнее.

---

## 10. Украшения лавки — assets/cosmetics/*.png (белый фон, вырежу скриптом)

Арт-оверлеи для внешек (покупаются в прилавке, включаются/выключаются).
Кладутся поверх сцены лавки, поэтому — изолированные объекты на белом фоне,
тот же storybook watercolor со свечной палитрой. После генерации пришли
как есть — вырежу фон, сожму в webp и заменю CSS-заглушки.

Общий хвост стиля:

```
storybook watercolor illustration with gentle ink outlines, warm candlelit
palette of amber, honey and deep brown, isolated on a plain solid white
background, no ground, no shadow, no text, cozy fantasy game prop
```

### 10.1 cos_carpet.png — Ковёр хранителя (вид строго сверху)

```
An ornate oval braided rug viewed strictly from above, deep burgundy with
amber and cream folk patterns of tiny lanterns and swirls, tasselled edge,
storybook watercolor illustration with gentle ink outlines, warm palette,
flat top-down view, isolated on a plain solid white background, no shadow,
no text, cozy fantasy game prop
```

### 10.2 cos_crest.png — Фирменная вывеска (БЕЗ БУКВ — надпись добавлю кодом)

ВАЖНО: кириллицу модели портят. Табличка пустая, текст положу поверх сам.

```
A blank carved wooden shop signboard hanging from two short chains with a
metal ring, rounded plank with a decorative burned-in border of leaves and
a tiny lantern emblem in the center-top, EMPTY writing surface, no letters
at all, storybook watercolor illustration with gentle ink outlines, warm
palette, front view, isolated on a plain solid white background, no shadow,
no text, cozy fantasy game prop
```

### 10.3 cos_flowers.png — Кадка с весенними цветами (пойдёт в 2–3 места полок)

```
A small wooden bucket pot with lush spring flowers — violets, daisies and
fresh green herbs spilling over the rim, a few petals fallen beside,
storybook watercolor illustration with gentle ink outlines, warm candlelit
palette, side view, isolated on a plain solid white background, no ground,
no shadow, no text, cozy fantasy game prop
```

### 10.4 cos_fireflies.png — Гроздь светлячков (будет медленно дрейфовать)

```
A loose cluster of six glowing fireflies with warm golden light halos and
soft watercolor glow, tiny delicate wings, different positions as if mid-
flight, storybook watercolor illustration, warm amber glow on a plain solid
white background, no ground, no shadow, no text, cozy fantasy game prop
```

### 10.5 cos_garland.png — Гирлянда из флажков и жёлудей (ШИРОКАЯ, под потолок)

ВАЖНО: широкая композиция ~5:1, верёвочка слегка провисает дугой.

```
A long hanging garland on a sagging rope: small triangular fabric flags in
mustard, burgundy and moss green alternating with brown acorns and tiny
dried orange slices, gentle downward arc, storybook watercolor illustration
with gentle ink outlines, warm palette, isolated on a plain solid white
background, no shadow, no text, cozy fantasy game prop --ar 5:1
```

### 10.6 cos_snow.png — Снежный вид за окном (оверлей на окно лавки)

ВАЖНО: это заплатка на окно сцены (правый край лавки) — зимняя версия
того же вида: туманная поляна, но в снегу, вертикальная ~3:4.

```
A winter forest glade seen through a window: misty snowy meadow, dark
spruce silhouettes in falling snow, soft blue-grey twilight with one warm
distant lantern light, gentle snowflakes, storybook watercolor illustration
with gentle ink outlines, cold palette with a warm accent, vertical
composition, isolated on a plain solid white background, no window frame,
no text, no watermark --ar 3:4
```

Сохранять как `assets/cosmetics/cos_*.png` (или пришли как есть — переименую).
Места на сцене подгоню сам: укажи только, если что-то по смыслу не совпало.

### 10.2b. cos_crest.png — вывеска С ТЕКСТОМ (замена версии без букв)

Текст — частью картинки, резной/выжженной вязью. Формулировка рассчитана
на модели, которые умеют текст (Ideogram, gpt-image-1, Flux pro —
Midjourney и SD кириллицу чаще портят). Если буквы ломаются —
перегенерируй 2–3 раза или смени модель; короткая надпись обычно
получается не с первой попытки.

```
A carved wooden shop signboard hanging from two short chains, rounded plank
with a decorative burned-in border of leaves and a tiny lantern emblem on
top, with the Cyrillic text "Лавка на перекрёстке миров" beautifully
hand-lettered in two centered lines, fantasy storybook calligraphy,
letters carved and burned dark into the warm wood, perfectly readable,
storybook watercolor illustration with gentle ink outlines, warm palette,
front view, isolated on a plain solid white background, no shadow,
no watermark
```

Важные детали для модели:
- Текст РОВНО такой: «Лавка на перекрёстке миров» — с буквой Ё.
- Две строки, по центру: «Лавка на» / «перекрёстке миров».
- Если модель упорно пишет «перекрестке» или ломает «Ё» — добавь в конец:
  `the letter Ё must have two dots on top, correct Russian spelling`.

Когда сгенерируешь — пришли файл: вырежу фон, положу в
`assets/cosmetics/cos_crest.webp`, и уберу из кода текстовую подложку
(табличка будет полностью картинкой).

---

## 11. Фоны поля боя — assets/battle_bg_<world>_web.jpg (12 миров, ВЕРСИЯ 2)

Фон под фигурки в бою «сбор» (поле 8×3 клетки). Поле в игре ОЧЕНЬ широкое
и низкое (~320px высотой на всю ширину экрана, ~4:1 на десктопе), фон
встаёт с `object-fit: cover` — поэтому:

- Аспект: максимально широкая панорама, **--ar 7:2** (или самый широкий,
  что умеет модель). Размер ≥2100×600.
- Композиция: **пустая горизонтальная ПОЛОСА по всей середине кадра**
  (ровная земля/полянка под юнитов — это «арена»). Декорации — в первую
  очередь по ЛЕВОМУ и ПРАВОМУ краям и в углах; верх и низ кадра на
  части экранов обрежутся, поэтому важных объектов вплотную к верхней
  и нижней кромке быть не должно.
- Вид сверху под углом (как настольная игра). БЕЗ текста, водяных знаков,
  людей и животных крупным планом.

Файлы: `assets/battle_bg_<world>.png` (я сожму в `_web.jpg`).

Общий хвост стиля для всех промтов:

```
storybook watercolor illustration with gentle ink outlines, warm palette,
top-down angled view like a tabletop game board, very wide panorama, EMPTY
horizontal band across the whole middle of the frame — flat bare ground for
game pieces, decorations only on the far left and right edges and corners,
nothing important touching the top or bottom edge, no people, no text,
no watermark --ar 7:2
```

### 11.1 battle_bg_meadow — Тихая опушка
```
A sunny forest glade battlefield: a wide empty band of soft green grass,
clover and tiny wildflowers across the middle, mossy roots, ferns and
spotted mushrooms crowding the far left and right edges, fireflies in the
air, dappled warm light, + хвост стиля
```

### 11.2 battle_bg_town — Средневековый дворик
```
A medieval market courtyard battlefield: a wide empty band of cobblestone
pavement across the middle, wooden crates, barrels, a market cart and
striped awnings pushed to the far left and right edges, warm afternoon
light, pigeons near the borders, + хвост
```

### 11.3 battle_bg_attic — Книжный чердак
```
An old library attic battlefield: a wide empty band of wooden plank floor
across the middle, towering book stacks, scrolls, candles and a globe
along the far left and right edges, dust motes in warm light beams from
round windows at the sides, + хвост стиля
```

### 11.4 battle_bg_crossroads — Перекрёсток миров
```
A magical crossroads battlefield at dusk: a wide empty band of soft
luminescent grass where faint glowing paths cross, floating lanterns,
portal arches and signposts at the far left and right edges, fireflies
rising, + хвост
```

### 11.5 battle_bg_nm — Ночной рынок
```
A cozy night market battlefield: a wide empty lantern-lit plaza band
across the middle, food stalls, fabric awnings and paper lantern strings
at the far left and right edges, warm bokeh lights, steam rising, deep
blue night, + хвост стиля
```

### 11.6 battle_bg_sw — Сказочные топи
```
A fairytale swamp battlefield at twilight: a wide empty mossy hummock
band across the middle, glowing mushrooms, crooked willow roots and
fireflies at the far left and right edges, soft teal-green mist, lily
pads on dark water at the corners, + хвост
```

### 11.7 battle_bg_sf — Звёздная ярмарка
```
A starlight fairground battlefield at night: a wide empty circus-ring
band of soft grass across the middle, garlands of lights, striped tents
and floating star lanterns at the far left and right edges, gentle
purple-teal glow, + хвост стиля
```

### 11.8 battle_bg_ash — Пепельные степи
```
An ashen steppe battlefield under a burnt sky: a wide empty band of
cracked grey earth with ash drifts across the middle, scorched banners,
obsidian shards and ember-glowing braziers at the far left and right
edges, drifting sparks, warm orange glow on dark tones, + хвост стиля
```

### 11.9 battle_bg_cr — Хрустальные горы
```
A crystal mountain battlefield: a wide empty band of smooth stone plateau
across the middle, glowing quartz clusters and crystalline formations at
the far left and right edges, cool blue-violet light with warm sun
accents, drifting snow, + хвост стиля
```

### 11.10 battle_bg_jade — Нефритовый сад
```
A jade garden battlefield: a wide empty band of raked sand and moss
across the middle, bamboo, stone lanterns and a small arched bridge at
the far left and right edges, soft morning mist, calm green-teal palette,
cherry petals drifting, + хвост
```

### 11.11 battle_bg_deep — Подводный грот
```
An underwater grotto battlefield: a wide empty band of sandy cavern floor
across the middle, corals, shells and glowing anemones at the far left
and right edges, soft blue light rays from cracks above, drifting
bubbles, + хвост стиля
```

### 11.12 battle_bg_mist — Туманные часы
```
A misty clockwork battlefield: a wide empty band of a floating stone
platform across the middle, giant blurred clock faces, gears and
hourglasses in the fog at the far left and right edges, silver-blue mist
with warm brass accents, + хвост стиля
```

---

## 12. Кабинет трофеев — assets/trophy_room_web.jpg + assets/trophies/*.png

Новая сцена-хаб: кабинет хозяина лавки с трофеями за боссов. Комната
нарочно с МИНИМУМОМ вещей — трофеи расставляются кодом поверх пустых
пьедесталов и полок.

### 12.1 trophy_room.png — сцена кабинета (САМЫЙ ВАЖНЫЙ)

ВАЖНО: стена с пьедесталами должна быть ПУСТОЙ — никаких предметов на
полках, в рамах и на крюках. Только камин, стол и пустые места под трофеи.

```
A cozy trophy cabinet room of a magical shopkeeper, wide establishing
shot, storybook watercolor illustration with gentle ink outlines, warm
candlelit palette of amber, honey and deep brown. A long dark wooden
wall with TWO ROWS of SIX EMPTY display pedestals and shelves — all
bare, nothing on them, faint dust outlines where trophies will stand;
below a small shelf with four tiny empty stands. On the left: a stone
fireplace with a warm fire and a rug in front of it. On the right: an
oak writing desk with an open ledger book, a quill and a candle, and a
framed blank map of worlds above it. A couple of wall hooks and empty
picture frames, wooden beams, soft evening light, lived-in but tidy,
EMPTY pedestals and shelves, no trophies, no clutter on the wall,
no people, no text, no watermark --ar 3:1
```

Размер: ≥1500×500 (как hub_banner). Сохранить как `assets/trophy_room.png`
(я сожму в `trophy_room_web.jpg`). Координаты пьедесталов потом подгоню
под арт — важно только, чтобы пустых мест было 12 (2 ряда × 6) + одна
полка на 4 мелких жетона.

### 12.2 Трофеи — assets/trophies/tro_*.png (белый фон, вырежу скриптом)

12 предметов-трофеев, по одному за босса каждого мира. Изолированные
объекты, крупно, вид спереди или три четверти, без подставок — добавлю
сам при расстановке. Общий хвост стиля (как у спутников, раздел 9):

```
storybook watercolor illustration with gentle ink outlines, warm candlelit
palette of amber, honey and deep brown, single object, centered, isolated
on a plain solid white background, no ground, no shadow, no text,
cozy fantasy game trophy
```

- **tro_willow_branch.png** — `A gnarled willow branch with soft glowing buds and two tiny fireflies circling it, warm green shimmer, + хвост`
- **tro_captain_medal.png** — `An old garrison medal on a faded blue ribbon, brass star with a tiny shield emblem, slightly tarnished, + хвост`
- **tro_keeper_quill.png** — `A large raven-black quill pen with ink that faintly glows violet at the tip, a thin ribbon tied around it, + хвост`
- **tro_star_shard.png** — `A fist-sized shard of solidified starfire, warm golden ember core inside faceted translucent stone, gentle glow, + хвост`
- **tro_nm_mask.png** — `An ornate night-market mask of a smiling merchant, deep blue and gold with lantern motifs and thin ribbon ties, + хвост`
- **tro_sw_basket.png** — `A small woven swamp basket with glowing berries, a bundle of marsh herbs and a tiny mushroom tucked in, + хвост`
- **tro_sf_cup.png** — `A slightly dented champion's golden cup with a star emblem and a faded ribbon, festive but ancient, + хвост`
- **tro_ash_helm.png** — `A heavy soot-stained warlord's helmet with a storm motif, small embers glowing in the crest, dark iron and ember orange, + хвост`
- **tro_cr_scale.png** — `A large translucent quartz dragon scale, cool blue-violet facets catching warm light, faint inner shimmer, + хвост`
- **tro_jade_fan.png** — `An elegant folding fan of pale jade with painted plum blossoms and a silk tassel, half-open, + хвост`
- **tro_deep_pearl.png** — `A large black pearl on a small drift of coral sand, a tiny moon glimmering inside it, teal glow, + хвост`
- **tro_mist_gear.png** — `A perfect golden clockwork gear with delicate engravings, faint blue mist curling around its teeth, + хвост`

Сохранять как `assets/trophies/tro_<id>.png` — вырежу белый фон скриптом,
положу прозрачные PNG, игра подхватит автоматически (без файла — эмодзи).

### 12.3 Жетоны розыска — assets/trophies/tro_mini_*.png (белый фон)

4 миниатюрных жетона за розыскные листы — на малой полке у стола.
Тот же хвост стиля, что у трофеев (12.2), объекты поменьше по духу —
сувениры, а не гордость стены:

- **tro_mini_bee.png** — `A small piece of wild honeycomb dripping with golden honey, one tiny bee wing resting on it, + хвост`
- **tro_mini_rat.png** — `A tiny crooked crown made of bent wire and a bottle-cap, slightly rusty, comically small, + хвост`
- **tro_mini_ink.png** — `A small antique inkwell with pitch-black ink that seems to swirl inside, a blot dripping over the rim, + хвост`
- **tro_mini_lantern.png** — `A small cracked paper lantern, gently patched with tape, glowing faintly warm from inside, + хвост`

Игра подхватит их автоматически тем же кодом, что и большие трофеи.

---

## 13. Чай для путника — сцена травницы (tea_*)

Механика смешивания отвара: котёл с живым цветом, стакан заказа, чашечки
ингредиентов, огонь под котлом. ВСЕ объекты — с ПУСТЫМИ местами: цвет
отвара/заказа и ингредиенты рисуются кодом поверх/внутри арта.

### 13.1 tea_table.png — фон: стол травницы (САМЫЙ ВАЖНЫЙ)

ВАЖНО: пустые места — жаровня с треногой слева (под котёл), дощечка справа
(под стакан заказа), ряд из 8 маленьких пустых чашечек вдоль нижнего края
(под ингредиенты). На них НИЧЕГО не стоит.

```
A cozy herbalist tea table seen strictly from above, storybook watercolor
illustration with gentle ink outlines, warm candlelit palette of amber,
honey and deep brown. On the LEFT: an empty iron tripod over a cold fire
pit — bare, nothing on it. On the RIGHT: a small empty wooden board for
a serving cup. Along the BOTTOM edge: a row of EIGHT small empty ceramic
bowls, evenly spaced, all bare. Free wooden table surface everywhere else,
a few scattered herb crumbs and a linen napkin in the corners, no kettle,
no cup, nothing in the bowls, no text, no watermark --ar 16:10
```

Размер ≥1600×1000. Сохранить как `assets/tea_table.png` (сожму в `_web.jpg`).

### 13.2 tea_pot.png — котёл с наклоном (белый фон, вырежу)

ВАЖНО: чаша котла ПУСТАЯ и тёмная внутри — туда код заливает цвет отвара.
Вид НЕ строго сверху, а под наклоном ~35° (открытие котла — эллипс),
котёл крупно по центру.

```
A round cast-iron cauldron tilted toward the viewer at about 35 degrees,
storybook watercolor illustration with gentle ink outlines: the opening
shows as an ellipse with a dark EMPTY interior (the brew color is drawn
there by the game), thick iron rim with a warm highlight, short legs at
the bottom, centered composition, isolated on a plain solid white
background, no fire, no liquid, no shadow, no text, cozy fantasy game prop
```

Замечание по пайплайну: у наклонного котла окно — эллипс; после генерации
пришли файл — пробью и подгоню заливку под форму отверстия.

### 13.3 tea_cup.png — стакан заказа (белый фон, вырежу)

Высокая кружка с ПУСТОЙ серединой (код заливает цвет заказа).

```
A tall rustic clay mug seen from a slightly elevated side view, storybook
watercolor illustration with gentle ink outlines: EMPTY inside, open dark
hollow top where the game draws the drink color, warm amber clay with a
cream glaze rim, centered, isolated on a plain solid white background,
no drink, no steam, no shadow, no text, cozy fantasy game prop
```

### 13.4 tea_fire_0..3.png — 4 степени огня для жаровни (белый фон)

Одинаковая жаровня, разный огонь. Вид сверху под лёгким углом.

```
A small round iron fire pit for a cauldron tripod, storybook watercolor
illustration with gentle ink outlines, isolated on a plain solid white
background, no shadow, no text, cozy fantasy game prop:
```
- **tea_fire_0.png** — `cold ashes, no fire, grey embers`
- **tea_fire_1.png** — `two tiny shy flame tongues over glowing embers`
- **tea_fire_2.png** — `a friendly medium fire with warm orange flames`
- **tea_fire_3.png** — `a roaring merry blaze, tall bright flames, sparks`

### 13.5 tea_ing_<id>.png — чашечки ингредиентов (белый фон, вырежу)

Маленькая керамическая чашечка с ингредиентом, вид сверху под углом.
Общий хвост стиля:

```
small ceramic bowl seen from above at a slight angle, storybook watercolor
illustration with gentle ink outlines, warm palette, isolated on a plain
solid white background, no shadow, no text, cozy fantasy game prop
```

- **tea_ing_mint.png** — `fresh mint leaves in the bowl`
- **tea_ing_water.png** — `clear spring water in the bowl`
- **tea_ing_fire.png** — `a small dry firewood log in the bowl`
- **tea_ing_honey.png** — `golden honey with a wooden dipper in the bowl`
- **tea_ing_berries.png** — `dark wild berries in the bowl`
- **tea_ing_bark.png** — `curled oak bark chips in the bowl`
- **tea_ing_lemon.png** — `bright lemon slices in the bowl`
- **tea_ing_ginger.png** — `a gnarled ginger root with slices in the bowl`
- **tea_ing_apple.png** — `red apple wedges in the bowl`
- **tea_ing_rosehip.png** — `rose hips in the bowl`
- **tea_ing_chamomile.png** — `chamomile flowers in the bowl`
- **tea_ing_cinnamon.png** — `cinnamon sticks in the bowl`
- **tea_ing_currant.png** — `black currant berries in the bowl`

Координаты мест на фоне (котёл, стакан, чашечки) подгоню сам после генерации —
скажи, если арт расставил места иначе, чем задумано.

---

## 14. Свеча для «Строки» — assets/hang_candle_*.png (белый фон, вырежу)

В механике «Строка» (аналог виселицы) промахи топят свечу. Нужны 4 стадии
ОДНОЙ свечи в канделябре — вертикальные, изолированные, один и тот же
ракурс и канделябр во всех четырёх (рядом в одном запросе модель сделает
серию последовательнее).

Общий хвост стиля:

```
storybook watercolor illustration with gentle ink outlines, warm candlelit
palette of amber, honey and deep brown, isolated on a plain solid white
background, no shadow, no text, cozy fantasy game prop, vertical
composition, centered
```

- **hang_candle_full.png** — `A tall cream wax candle in a small brass candlestick, bright merry flame, thin wisp of smoke, + хвост`
- **hang_candle_half.png** — `the SAME candle half-melted, wax drips running down its side, medium flame, brass candlestick, + хвост`
- **hang_candle_stub.png** — `the SAME candle as a short wax stub in the brass candlestick, tiny flickering flame, pool of melted wax at the base, + хвост`
- **hang_candle_out.png** — `the SAME candlestick with a burnt-out wax stub, NO flame, a thin curl of grey smoke rising, melted wax around, + хвост`

Если модель держит консистентность плохо — сгенерируй серию одним запросом
четырёх стадий и разрежь, или проси `the same candlestick` + один seed.
Сохранять как `assets/hang_candle_<stage>.png` — вырежу фон сам.

### 14b. hang_keyboard.png — клавиатура лавки для «Строки» (без букв!)

Фон-подложка под клавиши: деревянная клавиатура с ПУСТЫМИ клавишами
(буквы рисуем кодом поверх). Ключевое: ровная сетка 3 ряда — 12 / 11 / 10
клавиш, ровные gaps, чтобы поверх легли наши кнопки.

```
A cozy wooden keyboard for a fantasy shop game, seen strictly from above,
storybook watercolor illustration with gentle ink outlines: three rows of
EMPTY blank round-cornered wooden key caps (12 keys, then 11, then 10,
rows slightly staggered like a real typewriter), each key a warm honey
wood tile with a darker rim and a tiny brass nail in the corner, NO letters
or symbols on the keys, a dark brown felt base under the keys, a thin
brass frame around the whole keyboard, warm candlelit palette of amber,
honey and deep brown, no text, no letters, no watermark --ar 16:9
```

Сохранить как `assets/hang_keyboard.png` — подложу под кнопки и подгоню
отступы рядов под арт.

---

## 15. Карточки типов головоломок — assets/puzzle_cards/pc_<mech>.png (12 шт)

Обложки для экрана выбора типа головоломки. Яркая тематическая виньетка
на каждую: крупно, читаемо в маленьком размере, без текста. Имя файла =
ключ механики. Сохраняй в `assets/puzzle_cards/` (сожму в `_web.jpg`).

Общий хвост стиля:

```
storybook watercolor illustration with gentle ink outlines, warm candlelit
palette of amber, honey and deep brown, bright readable vignette, cozy
fantasy game card art, no text, no letters, no watermark --ar 3:2
```

- **pc_mirror.png** — `a round brass mirror on a wooden stand catching a beam of warm light, dust motes sparkling in the ray, attic shelves blurred behind, + хвост`
- **pc_shelf.png** — `cozy wooden shop shelves neatly arranged with jars, bottles and small boxes, one jar glowing softly, + хвост`
- **pc_riddle.png** — `an open old book with a riddle verse in decorative scribbles (NOT readable letters), a cat paw pointing at the page, candle light, + хвост`
- **pc_hang.png** — `a melting candle beside a page of beautiful calligraphy scribbles fading into ink blots, dramatic warm glow, + хвост`
- **pc_seek.png** — `a cluttered cozy tabletop full of tiny objects — keys, buttons, acorns, coins, a magnifying glass on top, hidden object game mood, + хвост`
- **pc_path.png** — `a winding forest path of stepping stones leading to a tiny glowing home between mossy trees, fireflies, top-down angle, + хвост`
- **pc_tea.png** — `a steaming cauldron of colorful glowing tea seen from above, bowls of herbs and berries around, swirling colors, + хвост`
- **pc_mech.png** — `brass gears and a wooden music box mechanism mid-motion, tiny bell ringing, warm workshop light, + хвост`
- **pc_candle.png** — `many small candles arranged in a glowing circle on a dark wooden floor, friendly wisps of light between them, + хвост`
- **pc_flow.png** — `a cozy shop counter seen from above with glowing arrows on the floor guiding the way to the counter, footprints of light, + хвост`
- **pc_brew.png** — `an alchemist workbench with a bubbling glowing cauldron, open recipe book, hanging herbs and potion bottles, + хвост`
- **pc_fate.png** — `a fan of hand-painted fortune-teller cards on dark velvet, one card face-up glowing softly, a candle flame reflected in a crystal ball nearby, + хвост`

---

## 16. «Карты судьбы» — assets/fate/ (стол, колода 23 шт, 12 гостей, обложка)

Сцена вечернего гадания в лавке: гость рассказывает историю, хозяин
раскладывает карты. Стиль единый для всего набора — рукодельные карты
гадалки, книжная акварель, свет свечи.

### 16.1 fate_table.png — стол гадания (фон сцены, САМЫЙ ВАЖНЫЙ)

Прямо под контентом (истории и карты лягут поверх), поэтому центр стола
спокойный, без крупных объектов: скатерть, свечи по краям, мягкая виньетка.

```
Cozy fortune-teller table seen from a slight top-down angle, dark green
velvet cloth covering a wooden table, EMPTY calm center (cards will be
placed here by the player), two burning candles in brass holders at the
top corners, a small bowl of dried herbs and a crystal ball at the top
edge, warm candlelight with deep brown shadows, soft vignette, storybook
watercolor illustration with gentle ink outlines, no cards laid out,
no text, no watermark --ar 4:5
```

### 16.2 card_<id>.png — колода (23 шт, единый дизайн)

Вертикальные карты с ОДНИМ мотивом по центру, без текста и букв (имена
дорисует игра). Держи одинаковую рамку и заливку во всех — колода должна
выглядеть колодой.

Шаблон:

```
hand-painted fortune-teller card, cozy storybook watercolor with gentle
ink outlines, <МОТИВ>, centered single motif on aged cream card stock,
thin dark-wood ornamental frame border, warm candlelit palette of amber
and deep brown, no text, no letters, no symbols, no watermark --ar 2:3
```

Мотивы по картам (имя файла = id карты):
- **card_home.png** — `a tiny glowing cottage with a lit window and smoke curling from the chimney`
- **card_path.png** — `a winding dirt road leading into misty golden hills, a single pair of footprints`
- **card_well.png** — `an old stone well with a wooden bucket, deep dark water reflecting one star`
- **card_star.png** — `one bright eight-pointed star shining over a sleeping village at night`
- **card_web.png** — `a delicate spider web with morning dew drops between two branches`
- **card_bread.png** — `a round crusty loaf of bread on a linen cloth with a few wheat ears`
- **card_mirror.png** — `an ornate oval hand mirror reflecting a warm candle flame`
- **card_candle.png** — `a single warm candle with dripping wax in a brass holder, gentle glow`
- **card_key.png** — `an old brass skeleton key tied with a red ribbon`
- **card_book.png** — `a thick old book with a worn leather cover and a ribbon bookmark`
- **card_bell.png** — `a small brass bell swinging with tiny motion lines`
- **card_letter.png** — `a sealed envelope with a red wax seal and a quill beside it`
- **card_moon.png** — `a serene crescent moon with a sleepy face among small stars`
- **card_sun.png** — `a cheerful warm sun with soft rays over a golden field`
- **card_rain.png** — `gentle rain falling from one small cloud onto a sprouting seedling`
- **card_tree.png** — `a mighty old oak with deep visible roots and a few falling leaves`
- **card_bird.png** — `a small songbird in flight carrying a ribbon in its beak`
- **card_ship.png** — `a tiny paper sailboat on wavy ink-drawn water`
- **card_fire.png** — `a lively dancing flame in a small hearth, sparks rising`
- **card_cup.png** — `a steaming tea cup on a saucer with a sprig of mint`
- **card_thread.png** — `a spool of red thread with a long loose end curling into a heart`
- **card_coin.png** — `an old copper coin with a worn emblem, a few stacked coins behind`
- **card_gate.png** — `a wooden garden gate slightly ajar with light spilling through the gap`

### 16.3 guest_<id>.png — портреты гостей (12 шт)

Бюсты по центру, смотрят на игрока, круглая обрезка в игре. Стиль — тот же.

Шаблон:

```
cozy storybook watercolor bust portrait of <ПЕРСОНАЖ>, gentle ink
outlines, warm candlelight, amber and deep brown palette, character
facing viewer, plain warm dark background, no text, no watermark --ar 1:1
```

Персонажи (имя файла = id гостя):
- **guest_watchman.png** — `a kindly elderly night watchman with a grey beard, worn coat and a lantern pole over his shoulder`
- **guest_owl.png** — `a wise sleepy owl librarian with tiny round spectacles and a book under one wing`
- **guest_ranger.png** — `a rugged young ranger in a green hooded cloak with a compass in hand`
- **guest_alchemist.png** — `a singed middle-aged alchemist with soot on his apron and a cracked potion flask`
- **guest_spider.png** — `a cute tiny cartoon spider hanging on a single thread, big friendly eyes`
- **guest_knight.png** — `a gentle honest knight in slightly worn armor, helmet under his arm, thoughtful eyes`
- **guest_merchant.png** — `a nervous plump market merchant with a counting frame (abacus) and a striped vest`
- **guest_wanderer.png** — `a young traveler girl with a patched cloak, a backpack and a songbird on her shoulder`
- **guest_gardener.png** — `a bent old gardener with soil-stained hands holding a small oak sapling`
- **guest_sailor.png** — `a weathered old sailor with a striped shirt, a beard and a tiny paper ship in his palm`
- **guest_scribe.png** — `a thin pale scribe with ink-stained fingers, an empty scroll and a quill behind his ear`
- **guest_cat.png** — `a dignified ginger shop cat with a small brass key on a ribbon collar, wise amber eyes`

### 16.4 Обложка типа головоломки

**pc_fate.png** вписан в раздел 15 вместе с остальными карточками типов.

## 17. Витраж миров (glass) — картины для пазла-перестановки

Головоломка режет картинку на сетку (от 3×2 до 6×4) — важны **крупные
различимые детали по всей площади** (иначе однотонные куски не собрать).
Формат 16:10 (`--ar 16:10`), минимум 1600×1000. Сейчас уровни используют
готовые сцены (seek_*_web.jpg, battle_bg_crossroads_web.jpg); посвящённые
арты — в `assets/glass/glass_<id>_web.jpg`, путь меняется в data/puzzlesGlass.js.

Общий стиль: `cozy fantasy scene, warm lantern light, hand-painted storybook
style, rich varied details across the whole frame (no large empty areas),
distinct landmarks in every corner, no text, no watermark, no border, no frame`

Варианты сюжетов (по одному на уровень):
- **glass_meadow.png** — `fireflies over a moonlit meadow with a tiny shop porch`
- **glass_town.png** — `a small crossroads town square at dusk, crooked houses`
- **glass_attic.png** — `a cluttered magical attic full of books, boxes and a cat`
- **glass_market.png** — `a night market with glowing stalls and string lights`
- **glass_swamp.png** — `a misty swamp with will-o-wisps and lantern posts`
- **glass_fair.png** — `a lantern festival fair with garlands and paper lanterns`
- **glass_forge.png** — `a cozy dwarven forge with sparks and glowing embers`
- **glass_crystal.png** — `a crystal grotto with glowing crystals of many colors`
- **glass_jade.png** — `a serene jade garden with a stone bridge and pond`
- **glass_grotto.png** — `a singing grotto with glowing mushrooms and water`
- **glass_clockwork.png** — `a clockwork tower interior with brass gears`
- **glass_crossroads.png** — `a magical crossroads of worlds with many glowing roads`

Вторая дюжина (gl_13–gl_24, пока используют battle_bg_*/town_square/hub_banner):
- **glass_market_sq.png** — `wide panorama of a small town square at dusk --ar 3:1`
- **glass_alchemist.png** — `an alchemist's cluttered worktable with a cauldron and herbs`
- **glass_night.png** — `a night market alley glowing with paper lanterns`
- **glass_bog.png** — `a fairy-tale swamp with will-o-wisps and a hut on legs`
- **glass_starfair.png** — `a starlight fair with carousels and fireworks`
- **glass_mountains.png** — `crystal mountains sparkling under two moons`
- **glass_ashes.png** — `ash steppes at a warm ember sunset`
- **glass_reef.png** — `an underwater grotto with light shafts and shells`
- **glass_jade2.png** — `a jade palace garden with pagoda roofs`
- **glass_mistclock.png** — `misty clock towers and floating gears`
- **glass_teatable.png** — `a cozy tea table by the fire with a sleeping cat`
- **glass_shop.png** — `wide panorama of a cozy magical shop interior --ar 3:1`

Третья серия (gl_25–gl_34, пока используют recipe_book/fate_table/tea_table/intro/town_market/trophy_room/battle_bg_*):
- **glass_recipes.png** — `an open recipe book with herbs and ink sketches`
- **glass_fatetable.png** — `a fortune-teller's table with cards and candles, vertical composition --ar 4:5`
- **glass_dawn.png** — `a meadow at dawn with dew and waking fireflies`
- **glass_tea_dawn.png** — `a tea table at dawn, fireplace not yet lit`
- **glass_tea_noon.png** — `a tea table at noon with a small fireplace flame`
- **glass_tea_night.png** — `a midnight tea table by bright fire, cat asleep nearby`
- **glass_firstday.png** — `a traveler arriving at a small shop at the crossroads --ar 2:1`
- **glass_row.png** — `wide panorama of a market row with stalls --ar 3:1`
- **glass_trophies.png** — `wide panorama of a cozy trophy room with a fireplace --ar 3:1`
- **glass_attic2.png** — `a huge cluttered attic full of treasures and light beams`

Четвёртая серия (gl_35–gl_46, файлы `assets/glass/glass_<имя>_web.jpg`):
- **glass_winter.png** — `a cozy shop porch in first snow, cat pawprints on steps`
- **glass_harbor.png** — `a night harbor with boats and a lighthouse beam`
- **glass_mill.png** — `a wheat field with an old windmill at golden hour`
- **glass_observatory.png** — `a star observatory with a telescope and open dome`
- **glass_library.png** — `an underground library among tree roots, lit by candles`
- **glass_maple.png** — `an autumn maple forest in fiery reds and golds`
- **glass_springs.png** — `steaming hot springs in the mountains at dusk`
- **glass_icepalace.png** — `an ice palace glowing blue and violet from inside`
- **glass_moongrove.png** — `a moonlit grove with the moon caught between branches`
- **glass_apiary.png** — `a meadow apiary with bees and honeycomb frames`
- **glass_lighthouse.png** — `wide panorama: a lighthouse where sea roads of worlds meet --ar 3:1`
- **glass_hearth.png** — `a warm fireplace with an armchair and a cat curled up`

Пятая серия (gl_47–gl_58, файлы `assets/glass/glass_<имя>_web.jpg`):
- **glass_bakery.png** — `a small bakery at dawn, rows of bread, flour in sunbeams`
- **glass_mushrooms.png** — `a mushroom clearing after rain, many species, dew`
- **glass_greenhouse.png** — `a lush greenhouse full of plants and warm light`
- **glass_waterfall.png** — `a waterfall holding a rainbow, mist and moss`
- **glass_pumpkins.png** — `an autumn pumpkin fair with glowing carved lanterns`
- **glass_snowdrops.png** — `first snowdrops through melting snow, early spring`
- **glass_skyship.png** — `a sailing skyship moored to a cloud, ropes and lanterns`
- **glass_station.png** — `a cozy train station between worlds, a steam train, a cat conductor`
- **glass_spices.png** — `wide panorama: a spice market row with sacks and jars --ar 3:1`
- **glass_owlnest.png** — `an owl librarian's nest between bookshelves`
- **glass_coral.png** — `a coral garden underwater with weaving fish`
- **glass_harvest.png** — `a shop interior filled with harvest gifts, pumpkins and apples`

### 17.1 Обложка типа

**pc_glass.png** — `a stained-glass window of a cozy shop glowing at dusk,
broken into a few loose glass pieces floating around it, warm colors,
square composition --ar 1:1`

### 16.5 Гости второй дюжины (fate_13–fate_24) — 12 портретов

Тот же шаблон, что в 16.3, имя файла = id гостя:

```
cozy storybook watercolor bust portrait of <ПЕРСОНАЖ>, gentle ink
outlines, warm candlelight, amber and deep brown palette, character
facing viewer, plain warm dark background, no text, no watermark --ar 1:1
```

- **guest_miller.png** — `a sturdy miller with flour dust on his rolled sleeves and a wheat stalk behind his ear`
- **guest_seamstress.png** — `a nimble seamstress with a pincushion on her wrist and a red thread over her shoulder`
- **guest_beekeeper.png** — `a calm beekeeper with a wide straw hat with a veil pushed up, a friendly bee on his sleeve`
- **guest_smith.png** — `a broad old blacksmith with sooty forearms, a leather apron and a small hammer on his belt`
- **guest_forester.png** — `a lean forester in a moss-green cloak with a twig of pine needles tucked in the hood`
- **guest_fisherman.png** — `a quiet fisherman with a folded net over his shoulder and a distant thoughtful gaze`
- **guest_baker.png** — `a rosy-cheeked baker woman with a kerchief, flour on her cheek and a tiny loaf in her hands`
- **guest_apprentice.png** — `a young mage apprentice with an oversized starry hat and ink on his nose, clutching a primer`
- **guest_elder.png** — `a dignified village elder with a grey beard, a carved wooden staff and a furrowed brow`
- **guest_clockmaker.png** — `a meticulous clockmaker with a loupe on a cord, brass gears peeking from his waistcoat pocket`
- **guest_mushroomer.png** — `a cheerful mushroom picker with a woven basket and a spotted red mushroom cap pinned to his hat`
- **guest_keeper.png** — `a warm-hearted shopkeeper (the player) with a cozy apron and a candle lantern, seen from the back three-quarter view, faceless-friendly`

### 16.6 Вторая колода — card_<id>.png (12 шт, для fate_25+)

Тот же шаблон карт, что в 16.2, имя файла = id карты:

```
hand-painted fortune-teller card, cozy storybook watercolor with gentle
ink outlines, <МОТИВ>, centered single motif on aged cream card stock,
thin dark-wood ornamental frame border, warm candlelit palette of amber
and deep brown, no text, no letters, no symbols, no watermark --ar 2:3
```

Мотивы:
- **card_lantern.png** — `a glowing paper lantern hanging from a shepherd's crook pole, lighting a dark path`
- **card_cauldron.png** — `a small cast-iron cauldron bubbling with golden stew over a gentle fire`
- **card_scissors.png** — `old tailor scissors resting on folded dark fabric, one ribbon cut`
- **card_nest.png** — `a woven bird nest with two tiny speckled eggs in a flowering apple branch`
- **card_ladder.png** — `a wooden ladder leaning against a starry night sky, fireflies around the rungs`
- **card_anchor.png** — `an old small iron anchor wrapped with rope on a wooden dock at dusk`
- **card_flute.png** — `a carved wooden flute on a mossy log, tiny musical notes as fireflies`
- **card_seed.png** — `a cupped hand holding a single sprouting seed with two green leaves`
- **card_lock.png** — `a heavy old padlock on a wooden chest corner, keyhole glowing faintly`
- **card_mask.png** — `a beautiful half carnival mask with painted swirls, casting a soft shadow`
- **card_basket.png** — `a wicker gathering basket with herbs, mushrooms and berries inside`
- **card_bridge.png** — `a small arched wooden bridge over a misty brook joining two mossy banks`

### 16.7 Гости третьей дюжины (fate_25–fate_36) — 12 портретов

Тот же шаблон бюстов, что в 16.3:

```
cozy storybook watercolor bust portrait of <ПЕРСОНАЖ>, gentle ink
outlines, warm candlelight, amber and deep brown palette, character
facing viewer, plain warm dark background, no text, no watermark --ar 1:1
```

- **guest_lamplighter.png** — `a spry old lamplighter with a long lighting pole over his shoulder and a warm grin`
- **guest_cook.png** — `a plump young cook boy with a soup ladle and a slightly sooty chef's kerchief`
- **guest_glassblower.png** — `a focused glassblower with singed gloves holding a glowing glass bubble on a blowpipe`
- **guest_shipwright.png** — `a grizzled shipwright with wood shavings in his beard and a small adze in hand`
- **guest_piper.png** — `a merry wandering piper with a wooden flute and a feathered cap, cheeks puffed`
- **guest_bridgewarden.png** — `a patient bridge keeper with a carpenter's square and a lantern hooked on his belt`
- **guest_daughter.png** — `a young gardener's daughter with a watering can and an oak leaf in her braid`
- **guest_postman.png** — `a lean postman with a worn leather satchel across his chest and a lost, kindly look`
- **guest_dancer.png** — `a fairground dancer with a ribbon around her wrist, bright eyes and a wistful smile`
- **guest_potter.png** — `a clay-smudged potter with rolled sleeves holding a small wet clay pot`
- **guest_cartographer.png** — `a dreamy cartographer with a rolled parchment map and an ink-stained compass`
- **guest_spirit.png** — `a gentle translucent crossroads spirit made of swirling mist and fireflies, vaguely human shape`

### 16.8 Третья колода — card_<id>.png (12 шт, для fate_49+)

Тот же шаблон карт, что в 16.2:

```
hand-painted fortune-teller card, cozy storybook watercolor with gentle
ink outlines, <МОТИВ>, centered single motif on aged cream card stock,
thin dark-wood ornamental frame border, warm candlelit palette of amber
and deep brown, no text, no letters, no symbols, no watermark --ar 2:3
```

Мотивы:
- **card_hive.png** — `a straw beehive skep with a few friendly bees circling it, clover flowers nearby`
- **card_feather.png** — `a single soft owl feather floating above an open book, gentle motion`
- **card_ring.png** — `a simple old brass ring on a ribbon, warm glint of candlelight on its circle`
- **card_window.png** — `a round attic window glowing warm from inside, frost at the corners`
- **card_wave.png** — `a single curling friendly wave with foam swirls, night sea sparkle`
- **card_shell.png** — `a spiral seashell on wet sand, a tiny pearl glinting inside`
- **card_mushroom.png** — `a plump porcini mushroom under an oak leaf, dew drops`
- **card_snowflake.png** — `one large ornate snowflake landing on a warm mitten`
- **card_rainbow.png** — `a soft rainbow arc over a wet meadow after rain, puddle reflections`
- **card_samovar.png** — `a gleaming brass samovar steaming gently, two small tea glasses beside`
- **card_scale.png** — `old brass balance scales in perfect balance, a feather on one pan, a coin on the other`
- **card_hammer.png** — `a small wooden-handled mallet resting on a fresh-joined wooden beam`

### 16.9 Четвёртая колода — card_<id>.png (11 шт, для fate_61+, по одной на уровень; card_shell уже в 16.8)

Тот же шаблон карт, что в 16.2:

```
hand-painted fortune-teller card, cozy storybook watercolor with gentle
ink outlines, <МОТИВ>, centered single motif on aged cream card stock,
thin dark-wood ornamental frame border, warm candlelit palette of amber
and deep brown, no text, no letters, no symbols, no watermark --ar 2:3
```

Мотивы:
- **card_seal.png** — `a red wax seal stamp pressed on an envelope flap, brass seal handle beside`
- **card_wheel.png** — `a wooden cart wheel leaning against a fence, morning light through the spokes`
- **card_umbrella.png** — `a small patched umbrella sheltering a mushroom from gentle rain`
- **card_accordion.png** — `a cheerful old accordion half-open, tiny dance notes as fireflies`
- **card_smoke.png** — `a soft curl of smoke rising from a chimney into a starry evening sky`
- **card_hourglass.png** — `a wooden hourglass with golden sand mid-flow, warm glow`
- **card_gear.png** — `a single brass gear with a ladybug sitting on a tooth`
- **card_vial.png** — `a small glass vial with shimmering turquoise potion and a cork`
- **card_spikelet.png** — `a ripe wheat spikelet bending in warm wind, a few loose grains`
- **card_globe.png** — `a small antique globe on a wooden stand, tiny painted mountains and seas`
- **card_comet.png** — `a bright friendly comet with a long soft tail over a sleeping town`

### 16.10 Пятая колода — card_<id>.png (26 шт; входят по одной на уровень, fate_73+ и как обманки раньше)

Тот же шаблон карт, что в 16.2:

```
hand-painted fortune-teller card, cozy storybook watercolor with gentle
ink outlines, <МОТИВ>, centered single motif on aged cream card stock,
thin dark-wood ornamental frame border, warm candlelit palette of amber
and deep brown, no text, no letters, no symbols, no watermark --ar 2:3
```

Мотивы:
- **card_needle.png** — `a tailor's needle with red thread looped through its eye, on dark cloth`
- **card_lamp.png** — `a small brass oil lamp with a gentle flame, behind a glowing stained-glass corner`
- **card_pie.png** — `a rustic golden pie with a crimped crust, steam curling from a slit`
- **card_map.png** — `a hand-drawn parchment map with a dotted path and a tiny compass rose`
- **card_boat.png** — `a small wooden rowboat on still mirror water at dawn`
- **card_dice.png** — `two bone dice mid-tumble on a velvet table, friendly pips`
- **card_hen.png** — `a plump mother hen on a nest with three chicks peeking out`
- **card_stone.png** — `a sturdy grey field stone with moss, stubbornly rooted in earth`
- **card_crown.png** — `a simple old brass circlet crown on a velvet cushion`
- **card_cloak.png** — `a warm travel cloak on a wooden peg, road dust on its hem`
- **card_drum.png** — `a small festival drum with wooden sticks crossed on top`
- **card_firefly.png** — `a swarm of glowing fireflies forming a gentle spiral in night air`
- **card_rope.png** — `a coiled hemp rope with a neat sailor's knot`
- **card_inkwell.png** — `a glass inkwell with black ink and a white quill resting across`
- **card_saddle.png** — `a worn leather saddle on a stable rail, warm lantern light`
- **card_broom.png** — `a birch-twig broom leaning by a swept wooden doorstep`
- **card_sunset.png** — `a crimson sunset over a quiet lake, reeds in silhouette`
- **card_sunrise.png** — `a soft pink sunrise over misty fields, dew sparkling`
- **card_owl.png** — `a round-eyed tawny owl on a book stack under moonlight`
- **card_fox.png** — `a sly ginger fox peeking from tall grass, tail curled`
- **card_goat.png** — `a cheerful white goat kid with a bell on its collar`
- **card_piglet.png** — `a pink piglet with a curled tail in clean straw`
- **card_cheese.png** — `a wheel of cheese with a wedge cut out, on a linen cloth`
- **card_grape.png** — `a hanging bunch of dark grapes with a curling vine tendril`
- **card_suitcase.png** — `a small old leather suitcase with travel stickers, buckled straps`
- **card_scarf.png** — `a hand-knitted wool scarf rolled into a cozy coil`
