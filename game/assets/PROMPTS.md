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
