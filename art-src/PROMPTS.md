# Промты для генерации ассетов (PNG/JPEG)

Отдай эти промты своим моделям (Midjourney, DALL·E, Flux, SD и т.п.).
Большие оригиналы храни в `art-src/<тема>/`; в `game/assets/` попадают сжатые
файлы по указанным runtime-путям. Новые v2-сцены и полные темы лавки не появятся
в игре просто от копирования файла: сначала нужны приёмка и отдельная интеграция.

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

## 1б. hub_banner — детальная V1 под хотспоты (исторический референс)

Раздел сохраняет прежнюю композицию как референс, а не как актуальную разметку.
Текущий источник координат лавки — `LAVKA_HOTSPOT_SHAPES` в `game/src/ui/hub.js`:
7 силуэтных полигонов. Числа ниже НЕ копировать в код и не использовать для проверки
совпадений. Людей и животных по-прежнему не рисуем: персонажи накладываются спрайтами.
Для новых полных тем базовый `hub_banner_gpt.png` служит только неизменным входом;
сам базовый арт и его runtime-файл не перезаписываем — работа идёт в разделе 22.

Исторические V1-якоря: 📚 Головоломки (10,42) — книжный шкаф слева · 🪙 Прилавок (43,55) ·
📖 Гостевая книга (47,70) — аналой перед прилавком · 🛡️ Комната рыцаря (68,50) —
доспех + арка · 🌆 На площадь (77,52) — круглая дверь · 🪟 В поход (93,45) — окно
с дорогой · 🦌 Кабинет трофеев (72,90) — низкая арка со ступенями вниз и рогами ·
пет-споты: травница (19,97), кот (30,97 — пустой пуфик), лисёнок (34,75), щенок
(87,88), гость (57,78), светлячок (47,15 — фонарик под потолком).

```
Cozy magical general store interior, very wide establishing shot, storybook
watercolor illustration with gentle ink outlines, warm candlelight, dark wooden
beams, amber glow, deep brown shadows, high detail, lived-in and loved
atmosphere, no people, no animals, no text, no watermark.

Layout, left to right:
- Far left wall (about 10% from the left edge, middle height): a tall dark-wood
  bookcase crammed with ancient tomes, scrolls, puzzle boxes and a small glowing
  riddle lantern — a "puzzle corner";
- Lower-left floor (about 19-30% from the left, near the bottom edge): a low
  herbalist's side table with drying herbs and a teapot, and an empty round
  cushioned stool;
- Center (about 43% from the left, middle height): a long wooden merchant
  counter with a brass bell, balance scales, an open ledger, a coin pouch and
  an inkwell;
- In front of the counter (about 47% from the left, lower): a small wooden
  lectern with an open guest book and a quill;
- Open floor in front of the counter (about 34% and 57% from the left, lower
  third): patterned rugs, clear standing space for visitors;
- Right of center (about 68% from the left): a polished knight's armor stand
  with helmet, shield and halberd beside a small arched doorway to the knight's
  room;
- Lower right wall (about 72% from the left, near the floor): a low arched
  cellar doorway with three stone steps going down, mounted deer antlers and a
  small golden trophy cup above the arch, faint golden light from below —
  the entrance to a trophy cabinet;
- Right wall (about 77% from the left): a round wooden door with iron hinges
  and a warm hanging lantern above it, leading to the town square;
- Far right (about 93% from the left, middle height): a large multi-paned
  window showing a misty forest road winding toward distant blue mountains;
- Lower-right corner (about 87% from the left, near the floor): clear floor
  with the corner of a rug;
- Top center (about 47% from the left, near the ceiling): a small glowing
  hanging lantern among garlands of dried herbs and garlic.

Stone floor, candles in brass candelabras, shelves with potion bottles and jars
along the back wall, soft evening light mixing candlelight and cool window glow.
--ar 3:1
```

Исторический V1-формат: ≥2400×800, 3:1, оригинал в `art-src/hub/`.
Для новой работы используй раздел 22: source ≥3000×1000, versioned filenames и
ручная приёмка по фактическому изображению. Базовую лавку при создании тем не меняем.

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

## 1b. town_square.png — V1 городской площади (исторический референс)

Сохранённая композиция старой площади: слева кузница, справа таверна, в центре
верстак-мастерская, с краю дорога обратно в лавку. **Для новой работы этот
text-only промт не использовать:** актуальные reference contract, имена и приёмка —
в разделе 22, `town_square_v2.png`.

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

Исторический V1-размер: ≥1500×500, исходник `art-src/hub/town_square.jfif`.
Старые пути и предположение о fallback-цепочке не использовать для v2.

## 1c. town_market.png — V1 торгового квартала (исторический референс)

Сохранённая композиция четырёх лавок с вывесками-предметами. **Не конкурирует
с новой работой:** для `town_market_v2.png` использовать только раздел 22;
животные и читаемые надписи из старых вариантов там запрещены.

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

Исторический V1-размер: ≥1500×500, исходник `art-src/hub/town_market.jfif`.
Новая версия и её интеграция — только по разделу 22.

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

## 10. LEGACY-спрайты оформления — только исторический overlay-workflow

Эти изолированные объекты остаются описанием уже существующих спрайтов для
временного fallback. **Для новых работ раздел не использовать.** Новое оформление —
не prop/overlay, а полный фон лавки с сохранённой архитектурой по разделу 22.
Ниже намеренно сохранены старые промты и приёмы вырезания, чтобы не терять историю;
они не требуют новой генерации и не описывают текущую целевую интеграцию.

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

Исторические файлы — `art-src/cosmetics/cos_*.png` и уже готовые legacy webp/png.
Новые `lavka_pack_*` по этому workflow не создаём: их полные фоны — в разделе 22.

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

Это описание уже выполненного legacy-преобразования, а не новое задание и не
инструкция менять код. Полный пакет `lavka_pack_hearth` согласует вывеску без
читаемого текста с остальными деталями сцены по разделу 22.

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

## 12. Кабинет трофеев — V1-сцена + assets/trophies/*.png

Комната нарочно с МИНИМУМОМ вещей — трофеи расставляются кодом поверх пустых
пьедесталов и полок. Промты самих трофеев ниже остаются актуальными, а V1-сцена
сохранена только как исторический composition reference.

### 12.1 trophy_room.png — V1-сцена (исторический референс)

Стена с пьедесталами должна быть ПУСТОЙ — никаких предметов на полках, в рамах
и на крюках. **Для новой сцены этот text-only промт не использовать:** нужны
`trophy_room_v2.png`, общий reference contract и приёмка из раздела 22.

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

Исторический V1-размер: ≥1500×500, исходник `art-src/hub/trophy_room.png`.
Для v2 — source ≥3000×1000 и ручная разметка по факту: ровно 12 ниш 2×6 плюс
4 маленьких пустых постамента, книга рекордов, карта миров, колода и ясный выход.

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

## 15. Карточки типов головоломок — assets/puzzle_cards/pc_<mech>.png

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
- **pc_gift.png** — `a small gift box wrapped in craft paper with a red-gold ribbon on a cozy shop counter, tiny souvenirs blurred on shelves behind, warm candlelight, + хвост`
- **pc_seating.png** — `a cozy tea room seen from a high top-down angle with a round wooden table, four empty chairs and steaming cups waiting for guests, one empty chair invitingly pulled out, warm candlelight, + хвост`

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

### 16.11 Заказчики варки (brewGuests) — портреты по мере надобности

Тот же шаблон бюстов, что в 16.3:

```
cozy storybook watercolor bust portrait of <ПЕРСОНАЖ>, gentle ink
outlines, warm candlelight, amber and deep brown palette, character
facing viewer, plain warm dark background, no text, no watermark --ar 1:1
```

- **guest_fairy.png** — `a tiny meadow fairy with iridescent dragonfly wings, a dress of bluebell petals and a clover crown, mischievous kind smile, a pinch of glowing golden dust between her fingers, soft sparkles floating around`
- **guest_cook.png** — уже есть в 16.7 (поварёнок из «Карт судьбы»): при появлении файла использовать тот же портрет

После генерации: сжать в `game/assets/fate/guest_<id>_web.jpg` и заменить
`art: null` на путь в `game/src/data/brewGuests.js` — гостевая книга подхватит
автоматически.

### 16.12 Рубашка колоды — card_back.png (1 шт)

Рубашка для ещё не встреченных карт на странице «Колода судьбы». Та же рамка
и пропорции, что у лицевых карт (16.2), но зеркально-тёмная гамма и строгая
симметрия — рубашка должна читаться как «оборот той же колоды»:

```
hand-painted fortune-teller card back, cozy storybook watercolor with gentle
ink outlines, symmetrical ornamental pattern of interwoven vines and tiny
stars around a small central crescent moon emblem, on aged deep-indigo card
stock, thin dark-wood ornamental frame border, warm candlelit palette of
amber, deep brown and midnight blue, perfectly symmetrical, centered,
no text, no letters, no watermark --ar 2:3
```

После генерации: сжать в `game/assets/fate/card_back_web.jpg`. До появления
файла игра молча рисует CSS-рубашку (градиент + 🌙).

## 18. Иконки предметов — assets/items/<id>_web.jpg (оружие, потом остальное)

Переходим с эмодзи на полноценные иконки. Код уже умеет подхватывать арт:
`itemIconEl()` в `game/src/ui/itemTip.js` кладёт `assets/items/<id>_web.jpg`
поверх эмодзи, при отсутствии файла картинка молча убирается. Оригиналы —
в `art-src/items/`, в рантайм — сжатые `*_web.jpg` (квадрат, 256–512 px хватает).

**Фон = редкость предмета.** Просим ровно этот HEX (те же цвета, что у
подложки `.item-ico` в `styles.css` — иконка и подложка сольются бесшовно):

| Редкость    | HEX фона  | Ощущение |
|-------------|-----------|----------|
| common      | `#4a3f33` | тёплый тёмно-коричневый, «дерево и кожа» |
| rare        | `#2e4a66` | глубокий синий, «ночное небо» |
| epic        | `#4a3466` | глубокий фиолетовый, «магия и чернила» |
| legendary   | `#6a5216` | тёмное золото, «старинная легенда» |

Модель может промахнуться по оттенку — тогда фон доводим скриптом
(заливка от углов точным HEX, как с белым фоном у питомцев).

Шаблон (подставить SUBJECT и BG_HEX по редкости):

```
Game inventory icon, {SUBJECT}, single object centered, filling about 70%
of the frame, slightly angled three-quarter view, cozy storybook watercolor
style with gentle ink outlines, warm light from the upper left, soft shadow
under the object, plain solid background of exact hex color {BG_HEX}, no
other objects, no text, no watermark --ar 1:1
```

### Оружие (11 штук, slot: weapon)

- **wpn_rusty_sword.png** (common) — `an old but sharp knight's shortsword with a worn leather grip and a tiny dried lavender sprig tied to the pommel`
- **wpn_oak_mace.png** (common) — `a heavy oak mace with a rough carved wooden head and iron bands, bark texture`
- **wpn_dagger_firefly.png** (rare) — `a slim elegant dagger with a softly glowing green blade, tiny firefly sparks around the tip`
- **wpn_greatsword_oak.png** (rare) — `a massive two-handed greatsword of dark bog oak with a wide steel blade and brass crossguard`
- **wpn_iron_sword.png** (rare) — `a plain reliable guardsman's iron longsword, polished blade, simple wrapped grip, no ornament`
- **wpn_hunter_bow.png** (rare) — `a dark wooden longbow with a whisper-quiet string and one silver-fletched arrow resting along the limb`
- **wpn_lumberaxe.png** (epic) — `a huge two-handed lumberjack greataxe with a broad crescent blade, faint green spirit wisps curling off the edge`
- **wpn_warhammer.png** (epic) — `a massive stonemason's war hammer with a square stone head and a sturdy oak haft, chips of granite`
- **wpn_candle_staff.png** (epic) — `a tall mage staff topped with a burning candle flame inside a brass lantern cage, wax drips frozen mid-fall`
- **wpn_master_dagger.png** (epic) — `a masterwork stiletto dagger forged from glowing moss and mossy stone, thin green veins of light in the blade`
- **wpn_firebird_quill.png** (legendary) — `a legendary dagger shaped like a firebird feather quill, blade of warm ember-orange feather barbs with tiny sparks, ornate gold nib-like hilt`

### Щиты (5 штук, slot: shield)

- **shd_wooden.png** (common) — `a light round linden wood shield with a warm honey grain, simple iron boss and a child's charcoal drawing faintly visible on the rim`
- **shd_guardian.png** (rare) — `a sturdy shop-guard shield of dark oak with a polished steel rim and small thorn-like studs, a brass lantern emblem in the center`
- **shd_tower.png** (epic) — `a massive rectangular tower shield with rounded corners, weathered grey steel plates and a worn wooden handle, a narrow vertical highlight stripe`
- **shd_master.png** (epic) — `a kite-shaped shield polished to a perfect mirror shine, reflecting a tiny warm window light, golden trim and a pale blue enamel boss`
- **shd_page_shield.png** (rare) — `a shield made from the cover of an ancient leather-bound tome strapped to a wooden frame, brass corners, faded embossed title swirls, a leather belt strap on the back edge`

### Шлемы (5 штук, slot: helmet)

- **hlm_leather.png** (common) — `a soft brown leather hood with stitched seams and a folded rim, smelling of rain and herbs`
- **hlm_badger.png** (rare) — `a rounded steel cap trimmed with striped badger fur and two small furry badger ears on top, sleepy cozy look`
- **hlm_kettle.png** (rare) — `a classic iron kettle hat with a wide slightly dented brim and a small rivet loop on top, honest guard gear`
- **hlm_page_wanderer.png** (rare) — `a tall soft pointed traveler hood of deep violet cloth with a floppy tip and a tiny glowing amber star charm, storybook wanderer mood`
- **hlm_master.png** (epic) — `a light golden circlet with a small glowing heart of old willow wood set in the front, delicate engraved leaves`

### Перчатки (5 штук, slot: gloves)

- **glv_herbalist.png** (common) — `a pair of soft herbalist gloves of greenish canvas with leather palms, a sprig of dried nettle tucked into the cuff`
- **glv_crit.png** (rare) — `a pair of fitted dark leather gloves with precise golden stitching following fate lines across the palm`
- **glv_smithee.png** (rare) — `a pair of heavy blacksmith mitts of scorched brown leather with metal rivets and heat-darkened fingertips, faint ember glow in the seams`
- **glv_binder.png** (rare) — `a pair of sturdy bookbinder gloves of waxed grey cloth with strong saddle stitching and a brass thimble on the thumb, faint ink stains`
- **glv_master.png** (epic) — `a pair of elegant fingerless master gloves with engraved brass thimble-caps on the fingertips, glowing faint golden seams`

### Броня (6 штук, slot: armor)

- **arm_padded.png** (common) — `a warm quilted gambeson jacket of beige linen with diamond stitching and wooden toggles, handmade and honest`
- **arm_oak_guardian.png** (epic) — `a guardian armor of polished dark oak plates riveted over a leather jerkin, carved leaf motifs and a living green sprout on the shoulder`
- **arm_silken.png** (rare) — `a weightless silken armor of sea-green moth wings layered like scales, shimmering softly with a delicate fuzzy collar`
- **arm_chain.png** (rare) — `a veteran chainmail shirt of blue-grey steel rings with a patched leather hem and one mismatched bronze ring, well-kept and storied`
- **arm_ink_cloak.png** (epic) — `a flowing cloak of deep violet-black cloth that glistens like wet ink, a stray ink blot sliding off its edge without a trace, high collar and silver clasp`
- **arm_master.png** (epic) — `a masterwork quilted doublet of deep blue cloth soaked in magical ink brew, faint glowing runes in the seams and polished brass buttons`

### Сапоги (5 штук, slot: boots)

- **bt_path.png** (common) — `a pair of light trail boots of tan leather with grass-green laces and a tiny clover leaf stuck to the heel, mud-brushed toes`
- **bt_merchant.png** (rare) — `a pair of well-traveled merchant wanderer boots of chestnut leather with folded cuffs, a brass buckle and a lucky coin stitched into the side`
- **bt_cobble.png** (rare) — `a pair of sturdy town boots with hobnail heels and reinforced toes, polished by cobblestone streets, confident upright stance`
- **bt_quiet_step.png** (epic) — `a pair of soft silent boots of midnight-violet suede with felt soles and a page-corner motif stitched in silver thread, whisper-quiet look`
- **bt_master.png** (epic) — `a pair of sleek masterwork boots of dark supple leather with silent braided grey soles and faint golden stitching, elegant and noiseless`

### Амулеты (5 штук, slot: amulet)

- **amu_hearth.png** (rare) — `a cozy pendant shaped like a tiny hearth with a warm ember glowing inside, on a braided leather cord`
- **amu_antidote.png** (rare) — `a small round glass pendant with a bundle of dried clubmoss herbs sealed inside, green cork top and a twine loop`
- **amu_fearless.png** (epic) — `a bold bronze medallion with a roaring lion relief and a steady red garnet heart in the center, on a sturdy chain`
- **amu_pages.png** (epic) — `a pendant of tiny folded ancient book pages layered into a flower shape, smelling of old paper, with a miniature brass bookmark chain`
- **amu_master.png** (epic) — `a delicate golden filigree pendant holding a bundle of dried clubmoss and a single glowing drop of luminous moss, intricate swirling metalwork`

### Кольца (9 штук, slot: ring)

- **rng_luck.png** (common) — `a simple copper ring with a tiny pressed four-leaf clover set in clear resin`
- **rng_crit.png** (rare) — `a silver ring with a sharp-cut crimson stone that flashes with a spark at its facet`
- **rng_health.png** (common) — `a warm smooth amber ring glowing softly like a mug of tea, rounded and comforting`
- **rng_iron.png** (rare) — `a plain sturdy iron ring like a bent nail, honest forged texture with a slight hammered shine`
- **rng_duelist.png** (epic) — `an elegant duelist ring of dark steel with a thin rapier-shaped crest and a small diamond at its tip`
- **rng_ink.png** (rare) — `a glass ring with a dark ink drop floating and swirling inside, silver setting`
- **rng_contents.png** (epic) — `a golden ring with a tiny engraved open book on the bezel and a miniature compass needle pointing sideways`
- **rng_master.png** (epic) — `a masterwork signet ring cast of golden honeyed amber with moth pollen glints and a tiny swirl of luck moving inside`
- **rng_master_loop.png** (epic) — `a matching golden band ring engraved with intertwined loops and a warm purring glow along the inner rim`

### Зелья (4 штуки, slot: consumable, type: potion)

- **pot_heal.png** (common) — `a round glass potion bottle with a warm rose-red healing brew, tiny heart-shaped bubbles rising inside, cork stopper`
- **pot_vigor.png** (common) — `a slim glass vial with a sparkling mint-amber invigorating brew, tiny awake sparkles and a leaf of peppermint at the neck, cork stopper`
- **pot_stone.png** (rare) — `a heavy squat bottle with a swirling granite-grey brew, tiny pebbles settled at the bottom and a slate shard as a stopper`
- **pot_ink.png** (rare) — `a dark glass bottle with an inky violet-black brew that slowly curls like a calligraphy stroke inside, wax-sealed cork`

### Свитки (5 штук, slot: consumable, type: scroll)

- **scr_fire_arrow.png** (rare) — `a rolled parchment scroll tied with a red ribbon, glowing rune of a fiery arrow on its side, small ember scorch marks on the edges`
- **scr_heal_mist.png** (rare) — `a rolled parchment scroll tied with a mint-green ribbon, glowing rune of a dewdrop on its side, soft healing mist curling around it`
- **scr_frost.png** (rare) — `a rolled parchment scroll tied with a pale blue ribbon, glowing rune of an ice chain link on its side, frost crystals creeping over the paper edges`
- **scr_storm.png** (epic) — `a rolled parchment scroll tied with a storm-grey ribbon, glowing rune of a lightning bolt on its side, tiny crackling sparks around the seal`
- **scr_fire_step.png** (epic) — `a rolled parchment scroll tied with a scorched orange ribbon, glowing rune of spreading flame footsteps on its side, smoldering edge embers`

### Сет «Топь» (Сказочные топи, 9 штук)

- **wpn_swamp_sickle.png** (epic) — `a curved swamp witch sickle with a crescent-moon blade, faint green wisp lights orbiting the edge`
- **shd_swamp_lily.png** (rare) — `a shield made of a giant lily pad leaf stretched over a wooden frame, water droplets rolling off`
- **hlm_swamp_wreath.png** (rare) — `a wreath helmet of glowing marsh berries and firefly lights hovering in a circle`
- **arm_swamp_weave.png** (epic) — `a woven cloak of grey-green bog mist threads, wisps curling off the hem`
- **glv_swamp_fern.png** (rare) — `gloves woven of dark fern fronds with tiny glowing spores on the knuckles`
- **bt_swamp_moss.png** (rare) — `soft mossy boots with peat-brown laces, tiny mushrooms growing on the heels`
- **amu_swamp_frog.png** (rare) — `a small frog-shaped wooden amulet with amber eyes, on a reed-fiber cord`
- **rng_swamp_thread.png** (epic) — `a ring of twisted witch's thread with a glowing mist bead caught in the knot`
- **rng_swamp_glow.png** (epic) — `a ring holding a single glowing marsh berry, soft green light pulsing inside`

### Сет «Ярмарка» (Звёздная ярмарка, 9 штук)

- **wpn_fair_hammer.png** (epic) — `a festive strongman carnival hammer with red-white striped handle and a brass bell on the head`
- **shd_fair_target.png** (rare) — `a round shield painted as a carnival shooting-range target with concentric red and cream rings`
- **hlm_fair_jester.png** (rare) — `a starry jester cap with three floppy points ending in tiny gold bells`
- **arm_fair_vest.png** (epic) — `a second-hand dealer's vest of patchwork velvet with many little pockets and brass buttons`
- **glv_fair_magician.png** (rare) — `sleek magician gloves of white silk with a hidden card peeking from the cuff`
- **bt_fair_dancer.png** (epic) — `tightrope dancer boots with pointed toes and balancing ribbons at the ankles`
- **amu_fair_ticket.png** (epic) — `a medallion made from an eternal carnival ticket stamped with a star, on a striped ribbon`
- **rng_fair_coin.png** (rare) — `a ring made from a bent lucky fair coin, heads and tails both smiling`
- **rng_fair_star.png** (epic) — `a ring topped with a small golden champion star, engraved rays`

### Сет «Пепел» (Пепельные степи, 9 штук)

- **wpn_ember_scimitar.png** (epic) — `a curved ash-steppe scimitar with a heat-shimmer blade and ember glow along the fuller`
- **shd_ember_brazier.png** (epic) — `a shield shaped like a shallow brazier with glowing coals behind a metal grate`
- **hlm_ember_khan.png** (epic) — `a half-mask helmet of steppe beast pelt with a storm shard embedded in the brow`
- **arm_ember_scalemail.png** (epic) — `scale mail of overlapping ash-lizard scales, dark grey with ember-lit seams`
- **glv_ember_forge.png** (rare) — `forge gloves of heat-darkened leather with glowing coal dust in the creases`
- **bt_ember_storm.png** (epic) — `boots of the ash storm with smoldering soles and wind-swept straps`
- **amu_ember_heart.png** (epic) — `an amulet holding a beating storm heart ember in a wire cage`
- **rng_ember_coal.png** (rare) — `a ring set with a small hot coal that glows when danger is near`
- **rng_ember_spark.png** (epic) — `a ring with the very first spark of a fire trapped in a tiny glass vial`

### Филлеры миров (по 3 на мир, 15 штук)

- **wpn_nm_fang.png** (rare) — `a sharp dagger made from a polished fang, wrapped handle of night-market cord`
- **hlm_nm_lantern.png** (rare) — `a hooded cap with a small glowing lantern fixed on the side, night market reflections`
- **amu_nm_mask.png** (epic) — `a mysterious lacquered night guest mask with a painted smile, on a silk cord`
- **wpn_cr_pick.png** (epic) — `a sturdy quartz-miner's pickaxe with a crystal-tipped head catching rainbows`
- **arm_cr_crystal.png** (epic) — `a translucent crystal breastplate, heavy and clear, light refracting inside`
- **rng_cr_echo.png** (rare) — `a mountain echo ring of hollow silver that hums faintly when tapped`
- **wpn_jade_fan.png** (epic) — `a folded combat fan of pale jade blades with bamboo ribs, half-open`
- **bt_jade_silk.png** (rare) — `soft silk tea-ceremony boots of pale green, embroidered with bamboo leaves`
- **amu_jade_pearl.png** (epic) — `a single luminous jade pearl pendant on a silk garden-green cord`
- **wpn_deep_coral.png** (rare) — `a coral blade grown into a sword shape, pink branches fused along the fuller`
- **shd_deep_shell.png** (rare) — `a shield made of a giant scallop shell, pearly inside and barnacled outside`
- **rng_deep_pearl.png** (rare) — `a ring with a deep-sea pearl that glows brighter the deeper you go`
- **wpn_mist_pendulum.png** (epic) — `a pendulum blade on a short chain, swinging in perfect rhythm, clock engravings`
- **glv_mist_gear.png** (rare) — `clockmaker gloves with tiny brass gears on the knuckles and measuring marks`
- **amu_mist_sand.png** (epic) — `an hourglass pendant with mist-grey sand flowing upward`

### Легендарки боссов (4 штуки, legendary)

- **hlm_hag_crown.png** (legendary) — `the crown of the Mistress of the Mires, woven of black reeds with a crown of will-o-wisps`
- **wpn_champion_greatsword.png** (legendary) — `a colossal greatsword shaped like a five-pointed star of the world champion, gold and crimson`
- **amu_quartz_heart.png** (legendary) — `the heart of the ancient quartz dragon, a large faceted crystal beating with slow light`
- **rng_time_loop.png** (legendary) — `a ring shaped as a tiny looping spiral of time, silver mist circling inside`

### Расходники поздних миров (4 штуки)

- **pot_jade_tea.png** (rare) — `a jade-green tea potion in a porcelain bottle with a bamboo stopper, steam curling`
- **pot_deep_air.png** (rare) — `a bottle of captured surface air, shimmering bubbles swirling inside, cork sealed with wax`
- **scr_crystal_rain.png** (epic) — `a scroll tied with a crystal-clear ribbon, glowing rune of falling shards on its side`
- **scr_mist_slow.png** (epic) — `a scroll tied with a grey velvet ribbon, glowing rune of thick fog on its side`

Все предметы из `game/src/data/items.js` покрыты. Новые предметы — тем же
шаблоном, фон строго по редкости, имя файла = id предмета.

## 19. Тени-силуэты пустых слотов — assets/slots/<kind>_web.png (9 штук)

Пустой слот экипировки показывает тёмный силуэт того типа вещи, который
туда надевается (`slotGhostEl` в `equipView.js`; без файла — затемнённый
эмодзи-фолбэк). Оригиналы — в `art-src/slots/`, в рантайм — PNG 128–256 px
с ПРОЗРАЧНЫМ фоном (генерируем на белом и вырезаем скриптом, как питомцев).

Шаблон (подставить SUBJECT):

```
Flat vector silhouette icon for an empty inventory slot, solid dark brown
shape of exact hex color #241b12, {SUBJECT}, pure silhouette with no
internal details, centered on a plain solid white background, clean smooth
edges, no text, no watermark --ar 1:1
```

- **weapon_web.png** — `a knight's shortsword pointing diagonally up-left`
- **shield_web.png** — `a classic kite shield`
- **helmet_web.png** — `a kettle hat helmet`
- **armor_web.png** — `a quilted gambeson torso`
- **gloves_web.png** — `a pair of gloves side by side`
- **boots_web.png** — `a pair of boots side by side`
- **amulet_web.png** — `a round pendant hanging on a cord loop`
- **ring_web.png** — `a ring with a small gem on top`
- **potion_web.png** — `a round-bottom potion flask with a cork`

## 19. Курсоры — assets/cursors/<key>.png + <key>_hover.png (25 тем × 2)

Тематические курсоры мыши для ПК-версии: у каждого режима игры (типы
головоломок, бой, комната рыцаря, сцены хаба, лавки) свой курсор. Код готов:
роутер ставит `body[data-cursor="<key>"]` (`game/src/ui/cursors.js`), а
`styles.css` берёт `assets/cursors/<key>.png`, над кликабельным —
`<key>_hover.png`. **Пока файла нет — стоит стандартный курсор**, так что
генерируем в любом темпе, игра не ломается.

**Техника.** Итоговый файл — PNG **32×32 с прозрачным фоном**. Генерируем
крупно (512×512), вырезаем белый фон скриптом (как питомцев: маска «яркий и
почти серый» + заливка от краёв + разрастание), ужимаем до 32×32 **только с
премультиплицированной альфой**, иначе цветной ореол. Оригиналы —
в `art-src/cursors/`, в рантайм — `game/assets/cursors/`.

**Хотспот** (точка клика) задан в `CURSOR_THEMES` в `cursors.js` и зашит в
`styles.css` — предмет рисуем так, чтобы «рабочий кончик» смотрел в указанную
точку сетки 32×32 (0,0 — левый верх). Остриё/носик — к хотспоту.

**Hover-вариант** (`*_hover.png`) — тот же предмет, но чуть приподнят/наклонён
и с тёплым золотым свечением вокруг. Проще всего: берём готовый вырезанный
PNG базового курсора и добавляем свечение скриптом (размытый золотой контур
`#ffca7a` под слоем), без повторной генерации.

Шаблон:

```
Mouse cursor icon for a cozy fantasy shop game, {SUBJECT}, single small
object, bold readable silhouette that stays clear at 32 pixels, dark
warm-brown ink outline, cozy storybook watercolor style, warm palette with
golden #ffca7a accents, pointing tip oriented toward {TIP}, plain solid
white background, no drop shadow, no text, no watermark --ar 1:1
```

Приоритет — волна 1 (самые частые экраны): default, hub_lavka, seek, brew,
fate, battle, equip, shop. Волна 2 — остальные.

| Файл (без .png) | Сюжет (SUBJECT) | Кончик смотрит в |
|---|---|---|
| default | a goose quill pen angled like an arrow cursor, tip down-left | левый низ (4,28) |
| hub_lavka | a tiny hanging shop lantern with a warm candle flame, handle up | верх (8,4) |
| hub_square | a wrought-iron street lantern on a small post | левый верх (6,4) |
| hub_market | a tiny merchant's brass balance scale | верх (16,4) |
| hub_cabinet | a small golden trophy cup | верх (16,6) |
| mirror | a small round hand mirror in a brass frame, handle down | левый верх (8,6) |
| shelf | a small clay jug with a cork | верх (10,6) |
| riddle | a curled parchment scroll with a wax seal | левый верх (8,6) |
| hang | an ink-dipped quill pen, nib pointing down-left | левый низ (4,28) |
| seek | a round magnifying glass with a wooden handle | центр стекла (12,12) |
| path | a tiny worn traveler's boot, toe pointing up-left | левый верх (5,5) |
| tea | a small steaming tea cup, side view | верх (16,8) |
| mech | a single brass gear with a hole in the middle | центр (16,16) |
| candle | a lit candle with a small flame | пламя, верх (16,4) |
| flow | a stylized curling water wave | левый верх (8,8) |
| brew | a round alchemical flask with glowing teal liquid | горлышко, верх (16,4) |
| fate | a single ornate tarot card, corner tilted up-left | левый верх (6,4) |
| glass | a diamond-shaped stained-glass shard, amber and teal | вершина ромба (16,4) |
| battle | a knight's sword pointing up-left, tip first | остриё (4,4) |
| equip | a knight's helmet with a tiny plume | верх (16,6) |
| shop | a single golden coin with a lantern emblem | центр (16,16) |
| tavern | a foamy wooden beer mug | верх (10,6) |
| craft | a blacksmith's hammer, head up-left | левый верх (6,6) |
| workshop | a small wrench or awl, tip up-left | левый верх (6,6) |
| gift | a tiny gift box in craft paper with a red ribbon bow | бант, левый верх (8,8) |
| seating | a tiny wooden chair with a steaming teacup on its seat, chair back pointing up-left | левый верх (8,6) |

---

## 20. «Подарок для гостя» — assets/gift/ (фон-сцена + 66 сувениров)

Новая механика: гость рассказывает историю с зашитыми условиями, игрок
выбирает подарок на витрине (`game/src/data/puzzlesGift.js`). Гости и их
портреты — уже готовые из раздела 16, генерировать не нужно. Здесь только
фон прилавка и сувениры. До генерации игра показывает эмодзи-фолбэки.

### 20.1 gift_counter.png — прилавок-витрина (фон сцены)

Поверх лягут портрет гостя, реплики и сетка сувениров, поэтому центр —
спокойная деревянная столешница без крупных объектов; товары размыты
на заднем плане у краёв.

```
Cozy fantasy shop counter for gift-giving seen from a slight top-down angle,
warm polished wooden countertop with an EMPTY calm center (souvenirs will be
placed here by the player), shelves with blurred jars, boxes and folded
ribbons along the top edge, a small brass bell and a burning candle at the
top corners, craft wrapping paper and twine spool at the bottom edge, warm
candlelight with honey-amber glow and deep brown shadows, soft vignette,
storybook watercolor illustration with gentle ink outlines, no text,
no watermark --ar 8:5
```

Сохранить в `game/assets/gift/gift_counter_web.jpg` (≥1600×1000, сжать).

### 20.2 Сувениры — assets/gift/souv_<id>_png → souv_<id>_web.jpg (66 шт)

Иконки сувениров на витрине и в превью (квадрат). Как иконки предметов
(р.18), но не боевые: тёплые сувениры лавки. Один предмет крупно в центре
(70% кадра), вид в три четверти, на тёплом кремовом фоне `#f3e6cf` (НЕ
прозрачном: рендер — `object-fit: cover` поверх карточки). Генерировать
512×512, сжимать в `souv_<id>_web.jpg`.

Общий хвост стиля:

```
single souvenir item centered, three-quarter view, storybook watercolor
illustration with gentle ink outlines, warm palette of amber, honey and deep
brown, plain warm cream background #f3e6cf, cozy fantasy shop keepsake,
no text, no watermark --ar 1:1
```

| id | Сувенир | SUBJECT |
|---|---|---|
| souv_scarf | Шарф мёдовой шерсти | a folded knitted scarf in honey-yellow wool with a tassel fringe |
| souv_honey | Липовый мёд | a small glass jar of golden linden honey with a wooden dipper leaning on it |
| souv_candle | Свеча «Тихий вечер» | a thick cream beeswax candle with a small calm flame, wax drips |
| souv_box | Шкатулка с напевом | a carved wooden music box with a brass crank, lid slightly open showing a twirling tiny dancer |
| souv_bell | Колокольчик с лентой | a small brass bell with a red ribbon bow on its handle |
| souv_comb | Гребень из бука | a polished beechwood hair comb with carved vine pattern |
| souv_whistle | Свистулька-птица | a clay bird-shaped whistle, painted folk-style, cheerful |
| souv_tea | Чайная смесь «Камин» | a small paper pouch of herbal tea with dried berries spilling out, tied with twine |
| souv_lantern | Фонарик-крошка | a palm-sized brass travel lantern with a warm glowing flame inside |
| souv_book | Тетрадь в ситцевой обложке | a small notebook in floral chintz cloth cover, tied with a string |
| souv_quill | Перо странствующего писца | an elegant travel quill with a carved wooden handle and a tiny ink stain |
| souv_marmalade | Мармелад звёздный | star-shaped marmalade candies dusted with sugar in a small paper cone |
| souv_socks | Носки бабушкиной вязки | a pair of thick hand-knitted socks with a colorful fir-tree pattern |
| souv_brooch | Брошь «Лунный мох» | an ornate bronze brooch with a moonstone that seems to hold moss under moonlight |
| souv_snowball | Шар со снегом | a glass snow globe with a tiny cozy shop inside, snowflakes mid-air |
| souv_sachet | Саше с лавандой | a small linen sachet pouch with lavender sprigs tucked under a string bow |
| souv_spoon | Ложка резная | a carved wooden spoon with a vine pattern on the handle |
| souv_inkwell | Чернильница «Паучок» | a glass inkwell with dark ink and a tiny decorative glass spider at the bottom |
| souv_gingerbread | Пряничный домик | a gingerbread house with icing windows and a snowy roof |
| souv_nightowl | Ночник «Совушка» | a small clay owl night lamp with a warm glow from within |
| souv_kite | Воздушный змей | a folded paper kite with a diamond shape, red and gold pattern, tail of bows |
| souv_thimble | Напёрсток счастливый | a tiny brass thimble with an engraved star, lying on its side |
| souv_ribbon | Лента ярмарочная | a curled roll of scarlet ribbon with golden edges |
| souv_spyglass | Подзорная трубка | a brass three-section spyglass with a leather grip, slightly extended |
| souv_pie | Пирог с рябиной | a rustic lattice-crust pie with red rowan berries peeking through |
| souv_flute | Свирель из ивы | a slender willow-wood flute with carved rings, calm and plain |
| souv_map | Карта звёздного неба | a hand-drawn star chart on aged paper, constellations inked, slightly rolled |
| souv_accordion | Гармошка тульская | a small folk accordion, half-extended bellows, mother-of-pearl buttons |
| souv_yarn | Клубок со спицами | a soft ball of wool yarn with two smooth knitting needles stuck through |
| souv_seeds | Семена редких трав | little paper seed packets with handwritten-style marks (NOT readable), twine-tied |
| souv_samovar | Самоварчик медный | a small copper samovar for two cups, gently steaming, cherry-wood handles |
| souv_letters | Пачка писем с сургучом | a bundle of old letters tied with string, one red wax seal, mysterious |
| souv_basket | Корзинка плетёная | a woven willow basket with a curved handle |
| souv_rattle | Погремушка из тыквы | a dried gourd rattle with a carved wooden handle, peas inside |
| souv_blanket | Плед лоскутный | a folded patchwork quilt of colorful fabric scraps, warm and cheerful |
| souv_fan | Веер из перьев | an elegant feather hand fan, half-open, calm earthy tones |
| souv_pillow | Подушечка с душицей | a small linen sachet-pillow with embroidered herbs, dried oregano sprigs |
| souv_paints | Краски яичные | a small box of twelve egg tempera paint pods with a tiny brush |
| souv_compass | Компас ладонный | a palm-sized brass compass with a glass top, needle pointing north |
| souv_cocoa | Какао с зефиром | a tin of cocoa powder with a small bag of marshmallows, cozy |
| souv_chimes | Металлофон нежный | a small wind chime of thin brass plates, gentle and calm |
| souv_ushanka | Ушанка заячья | a fluffy rabbit-fur ushanka hat with ear flaps tied up |
| souv_jam | Варенье из шишек | a jar of young pine cone jam, amber and resinous, a small cone on top |
| souv_doll | Матрёшка резная | a hand-painted wooden nesting doll, the smallest one beside it, cheerful |
| souv_dreamcatcher | Ловец снов | a dreamcatcher with a woven web and a single feather, calm earthy tones |
| souv_kaleidoscope | Калейдоскоп | a brass-and-glass kaleidoscope with a splash of colorful shards beside it |
| souv_snowshoes | Снегоступы | a pair of wooden snowshoes with leather straps, light and sturdy |
| souv_birdhouse | Скворечник | a neat wooden birdhouse with a round entrance hole, welcoming |
| souv_bellows | Мехи домашние | a wooden fireplace bellows with leather sides and a brass nozzle |
| souv_astrolabe | Астролябия | a brass astrolabe with rings within rings, engraved stars, mysterious |
| souv_perfume | Духи луговые | a delicate glass perfume bottle with meadow flowers inside |
| souv_abacus | Счёты дубовые | an oak abacus with smooth wooden beads, well-worn |
| souv_locket | Медальон с портретом | an oval brass locket, open, showing a tiny painted portrait inside |
| souv_gloves | Перчатки охотничьи | a pair of soft leather hunting gloves with sturdy stitching |
| souv_toy_knight | Рыцарь деревянный | a wooden toy knight with a linden-wood sword and bark shield |
| souv_seedling | Саженец в горшочке | a young apple tree seedling in a birch-bark pot, ready to travel |
| souv_seal | Печать с сургучом | a brass wax seal stamp with a crest and a stick of red sealing wax |
| souv_moth | Моль плюшевая | a plush moth toy with velvet wings, soft and smiling |
| souv_watch | Часы карманные | a pocket watch on a chain with a lighthouse engraving |
| souv_herbarium | Гербарий | an old herbarium album with pressed herbs and dated pages |
| souv_sleigh | Санки детские | a small wooden sled with curved runners and a rope |
| souv_glogg | Глёг ягодный | a bottle of berry glogg with steam rising from a poured mug beside |
| souv_embroidery | Вышивка «Перекрёсток» | a framed embroidery of a cozy shop with a lantern and a cat, cross-stitch |
| souv_prism | Призма солнечная | a faceted glass prism casting a small rainbow, mysterious sparkle |
| souv_brazier | Жаровня походная | a brass travel brazier with glowing coals behind a vented lid |
| souv_ladle | Ковш кедровый | a carved cedar ladle with painted folk pattern on the side |

### 20.3 Карточка типа и курсор

- Карточка типа **pc_gift.png** — в разделе 15 (добавлена в список).
- Курсор **gift.png / gift_hover.png** — в разделе 19 (строка в таблице).

---

## 21. «Гости за чайным столом» — assets/seating/ (10 комнат)

Новая механика: рассадить знакомых гостей по местам согласно их пожеланиям.
Комнаты должны выглядеть монолитно: стол, стулья, окно, камин, дверь, самовар
и особенности мест — части одного арта. Поверх код кладёт только портреты
гостей и временные подсветки. Людей и животных в комнатах НЕ рисуем.

Каждый промт ниже самодостаточен: его можно использовать отдельно, в text-to-image,
без базового изображения, референсов и дополнительных инструкций. Ракурс и планировка
повторяются в каждом промте намеренно — так комнаты останутся визуально связаны.

### 21.1 seat_ch01.png — глава 1, первая чайная комната

```
Create a finished 16:10 game background of an empty cozy magical tea room inside
a fantasy crossroads shop. Storybook watercolor, gentle ink outlines, amber and
honey light, dark wooden beams and plank floor. High-angle view at about 70
degrees, all furniture and chair cushions clearly visible. Large multi-paned
window on the LEFT wall, low stone fireplace on the RIGHT wall, wooden door at
the FAR RIGHT, copper samovar on a BACK-RIGHT sideboard, quiet bookshelf nook
at the BACK LEFT.

In the CENTER place one small round dark-oak tea table with exactly FOUR wooden
chairs and no other seating. Arrange the chairs at upper left, upper right,
lower right and lower left. Upper-left chair: BLUE cushion, beside the quiet
bookshelf, window behind it. Upper-right chair: RED cushion, beside the warm
fireplace rug. Lower-right chair: GREEN cushion, closer to the drafty door.
Lower-left chair: VIOLET cushion, with a clear side view of the window. Put a
modest teapot, four plain cups and biscuits on the table.

Every cushion must be fully visible, flat, empty and unobstructed for a circular
portrait overlay. No people, no animals, no extra chairs or stools, no readable
text, no letters, no numbers, no UI, no watermark. --ar 16:10
```

### 21.2 seat_ch02.png — глава 2, места у огня

```
Create a finished 16:10 game background of an empty cozy magical tea room inside
a fantasy crossroads shop on a winter evening. Storybook watercolor, gentle ink
outlines, amber firelight, dark wooden beams and plank floor. High-angle view at
about 70 degrees, all furniture and chair cushions clearly visible. Large snowy
multi-paned window on the LEFT wall, bright low stone fireplace with a braided
rug and copper fire tools on the RIGHT wall, wooden door at the FAR RIGHT,
copper samovar on a BACK-RIGHT sideboard, quiet bookshelf nook at the BACK LEFT.

In the CENTER place one round dark-oak tea table with exactly FIVE wooden chairs
and no other seating. Upper-left chair: GREEN cushion, beside the quiet reading
nook, window behind it. Upper-right chair: YELLOW cushion, beside the samovar.
Middle-right chair: RED cushion, beside the fireplace. Bottom-center chair:
VIOLET cushion, nearer the door draft. Lower-left chair: BLUE cushion, with a
clear side view of the window. Set five cups and a small covered treat dish.

Every cushion must be fully visible, flat, empty and unobstructed for a circular
portrait overlay. No people, no animals, no extra chairs or stools, no readable
text, no letters, no numbers, no UI, no watermark. --ar 16:10
```

### 21.3 seat_ch03.png — глава 3, старые знакомые

```
Create a finished 16:10 game background of an empty, lived-in magical tea room
inside a fantasy crossroads shop. Storybook watercolor, gentle ink outlines,
warm amber and honey palette, dark beams and plank floor. High-angle view at
about 70 degrees, all furniture and chair cushions clearly visible. Large
multi-paned evening window on the LEFT wall, low stone fireplace on the RIGHT
wall, wooden door at the FAR RIGHT, copper samovar on a BACK-RIGHT sideboard,
quiet bookshelf nook at the BACK LEFT. Decorate the walls with small framed
keepsakes without writing, dried flowers, ribbons and travel trinkets.

In the CENTER place one round oak tea table with exactly FIVE wooden chairs and
no other seating: upper-left chair in the quiet nook, upper-right chair beside
the samovar, middle-right chair beside the fireplace, bottom-center chair near
the door, lower-left chair beside the window. Turn the bottom-center chair
slightly outward and place a completely blank place card before it. Set the
table warmly for a reunion of old friends.

Every plain cushion must be fully visible, flat, empty and unobstructed for a
circular portrait overlay. No people, no animals, no extra chairs or stools, no
readable text, no letters, no numbers, no UI, no watermark. --ar 16:10
```

### 21.4 seat_ch04.png — глава 4, свободный стул

```
Create a finished 16:10 game background of an empty cozy magical tea room inside
a fantasy crossroads shop on a rainy evening. Storybook watercolor, gentle ink
outlines, warm amber interior against cool rain, dark beams and plank floor.
High-angle view at about 70 degrees, all furniture and chair cushions clearly
visible. Large rain-streaked window on the LEFT wall, low stone fireplace on the
RIGHT wall, wooden door with a folded umbrella at the FAR RIGHT, copper samovar
on a BACK-RIGHT sideboard, quiet bookshelf nook at the BACK LEFT.

In the CENTER place one comfortable oval oak tea table with exactly SEVEN wooden
chairs and no other seating. Place chairs at upper left by the quiet nook, upper
right by the samovar, middle right by the fireplace, lower right near the door,
bottom center, lower left by the window, and middle left near the open aisle.
Pull the bottom-center chair noticeably farther from the table so it reads as a
spare seat; keep all seven chairs usable and clearly associated with the table.

Every cushion must be fully visible, flat, empty and unobstructed for a circular
portrait overlay. No people, no animals, no extra chairs or stools, no readable
text, no letters, no numbers, no UI, no watermark. --ar 16:10
```

### 21.5 seat_ch05.png — глава 5, характеры за столом

```
Create a finished 16:10 game background of an empty cozy magical tea room inside
a fantasy crossroads shop. Storybook watercolor, gentle ink outlines, amber and
honey light, dark wooden beams and plank floor. High-angle view at about 70
degrees, all furniture and chair cushions clearly visible. Large multi-paned
window on the LEFT wall, low stone fireplace on the RIGHT wall, wooden door at
the FAR RIGHT, copper samovar on a BACK-RIGHT sideboard, quiet bookshelf nook at
the BACK LEFT. Along the walls add a flute on a small stand, a craft repair tray,
a shelf of rolled maps without writing, and potted culinary herbs.

In the CENTER place one round oak tea table with exactly SIX wooden chairs and
no other seating: upper-left chair in the quiet nook, upper-right chair beside
the samovar, middle-right chair beside the fireplace, bottom-right chair near
the door, lower-left chair beside the window, and middle-left chair in the open
space between window and nook. Keep decorative hobby objects away from seats.

Every cushion must be fully visible, flat, empty and unobstructed for a circular
portrait overlay. No people, no animals, no extra chairs or stools, no readable
text, no letters, no numbers, no UI, no watermark. --ar 16:10
```

### 21.6 seat_ch06.png — глава 6, два столика

```
Create a finished 16:10 game background of an empty cozy magical tea room inside
a fantasy crossroads shop on a summer evening. Storybook watercolor, gentle ink
outlines, amber and honey light, dark wooden beams and plank floor. High-angle
view at about 70 degrees, all furniture and chair cushions clearly visible.
Large flower-decorated window on the LEFT wall, low stone fireplace on the RIGHT
wall, wooden door at the FAR RIGHT, copper samovar on a BACK-RIGHT sideboard,
quiet bookshelf nook at the BACK LEFT, fresh herbs and flowers along the walls.

Place TWO clearly separate small round tea tables with exactly SEVEN wooden
chairs total and no other seating. LEFT table: exactly THREE chairs, one at the
upper-right edge by the quiet nook, one at the lower-right edge, one at the left
edge by the window. RIGHT table: exactly FOUR chairs, upper-right by the samovar,
middle-right by the fireplace, lower-right near the door, lower-left beside a
narrow tea trolley. Separate the groups with open floor and the trolley; make
chair ownership of each table immediately obvious.

Every cushion must be fully visible, flat, empty and unobstructed for a circular
portrait overlay. No people, no animals, no extra chairs or stools, no readable
text, no letters, no numbers, no UI, no watermark. --ar 16:10
```

### 21.7 seat_ch07.png — глава 7, своей компанией

```
Create a finished 16:10 game background of an empty cozy magical tea room inside
a fantasy crossroads shop, prepared for a small friendly celebration. Storybook
watercolor, gentle ink outlines, warm golden candlelight, dark beams and plank
floor. High-angle view at about 70 degrees, all furniture and chair cushions
clearly visible. Large multi-paned window on the LEFT wall, low stone fireplace
on the RIGHT wall, wooden door at the FAR RIGHT, copper samovar on a BACK-RIGHT
sideboard, quiet bookshelf nook at the BACK LEFT. Add letter-free cloth bunting,
a covered cake stand, extra cups and warm garlands.

Place TWO separate tables with exactly SEVEN wooden chairs total and no other
seating. LEFT ROUND table: exactly FOUR chairs at top by the quiet nook, right
edge, bottom by the window, and left edge by the window. RIGHT OVAL table:
exactly THREE chairs at top by the samovar, lower-right by the fireplace, and
lower-left near the door. Leave open floor between the groups and make every
chair's table immediately obvious.

Every cushion must be fully visible, flat, empty and unobstructed for a circular
portrait overlay. No people, no animals, no extra chairs or stools, no readable
text, no letters, no numbers, no UI, no watermark. --ar 16:10
```

### 21.8 seat_ch08.png — глава 8, большой стол

```
Create a finished 16:10 game background of an empty cozy magical tea room inside
a fantasy crossroads shop late in the evening. Storybook watercolor, gentle ink
outlines, amber candlelight and long soft shadows, dark beams and plank floor.
High-angle view at about 70 degrees, all furniture and chair cushions clearly
visible. Large multi-paned night window on the LEFT wall, low stone fireplace on
the RIGHT wall, wooden door at the FAR RIGHT, copper samovar on a BACK-RIGHT
sideboard, quiet bookshelf nook at the BACK LEFT.

In the CENTER place ONE long polished oak banquet table, horizontally oriented,
with exactly EIGHT wooden chairs and no other seating. Place FOUR chairs in an
evenly spaced row along the FAR long side and FOUR directly opposite them along
the NEAR long side, forming four obvious opposite pairs. Keep both short ends
empty. The far-left chair belongs to the quiet window nook, far-right to the
samovar, near-right to the door and fireplace, near-left to the window. Put a
row of small candles along the table center without hiding any chair.

Every cushion must be fully visible, flat, empty and unobstructed for a circular
portrait overlay. No people, no animals, no extra chairs or stools, no readable
text, no letters, no numbers, no UI, no watermark. --ar 16:10
```

### 21.9 seat_ch09.png — глава 9, вечер перекрёстка

```
Create a finished 16:10 game background of an empty magical tea room inside a
fantasy crossroads shop deep at night. Storybook watercolor, gentle ink outlines,
warm interior light against blue night, dark beams and plank floor. High-angle
view at about 70 degrees, all furniture and chair cushions clearly visible.
Large window on the LEFT wall showing a moonlit crossroads and distant lights,
low stone fireplace on the RIGHT wall, wooden door at the FAR RIGHT, copper
samovar on a BACK-RIGHT sideboard, quiet bookshelf nook at the BACK LEFT. Add
rolled maps without writing, travel lanterns and small world souvenirs on walls.

Place TWO separate round tables with exactly TEN wooden chairs total and no
other seating. LEFT table by the window: FIVE chairs evenly around it, including
one beside the quiet nook and four distinctly window-side positions. RIGHT table
by the fireplace: FIVE chairs evenly around it, including positions beside the
samovar, fireplace, door and open middle floor. Pull one chair at each table
slightly outward as a spare, while preserving clear membership in its group.

Every cushion must be fully visible, flat, empty and unobstructed for a circular
portrait overlay. No people, no animals, no extra chairs or stools, no readable
text, no letters, no numbers, no UI, no watermark. --ar 16:10
```

### 21.10 seat_ch10.png — глава 10, праздник ста чашек

```
Create a finished 16:10 game background of an empty magical tea room inside a
fantasy crossroads shop, decorated for a joyful hundred-cup celebration.
Storybook watercolor, gentle ink outlines, radiant golden candlelight, dark
wooden beams and plank floor. High-angle view at about 70 degrees, all furniture
and chair cushions clearly visible. Large multi-paned window on the LEFT wall,
low stone fireplace on the RIGHT wall, wooden door at the FAR RIGHT, copper
samovar on a BACK-RIGHT sideboard, quiet bookshelf nook at the BACK LEFT. Add
garlands of dried herbs, ribbons, letter-free teacup motifs, wrapped gifts on
the sideboard and many small candles.

In the CENTER place ONE long festive oak table, horizontally oriented, with
exactly EIGHT wooden chairs and no other seating. Place FOUR evenly spaced
chairs along the FAR long side and FOUR directly opposite along the NEAR long
side, forming four clear opposite pairs; keep both short ends empty. Far-left
chair belongs to the quiet nook, far-right to the fireplace, near-right to the
door, near-left to the window. Keep decorations away from all sitting surfaces.

Every cushion must be fully visible, flat, empty and unobstructed for a circular
portrait overlay. No people, no animals, no extra chairs or stools, no readable
text, no letters, no numbers, no UI, no watermark. --ar 16:10
```

Сохранение:

- оригиналы — `art-src/seating/seat_chXX.png`;
- рантайм — `game/assets/seating/seat_chXX_web.jpg`;
- размер ≥1600×1000, формат 16:10;
- каждый промт используется независимо, без референсов и image-to-image.

### 21.11 Карточка типа и курсор

- Карточка типа **pc_seating.png** — в разделе 15 (добавлена в список).
- Курсор **seating.png / seating_hover.png** — в разделе 19 (строка в таблице).

---

## 22. Хабы v2 и полные фоны (актуальный workflow)

Этот раздел — единственный актуальный workflow для новых `town_square_v2`,
`town_market_v2`, `trophy_room_v2` и полных лавочных тем. Разделы 1b/1c/10/12.1 —
только исторические референсы. Изображения создаёт пользователь; само наличие
промта не означает готовый ассет или интеграцию.

### 22.1 Общий reference contract

- **Стиль по умолчанию:** `art-src/hub/hub_banner_gpt.png`. Текущая сцена каждого хаба —
  только composition reference, а не источник нового стиля. Если редактирование исходника
  не нравится, используй самостоятельные text-only промты из 22.5.12 без референса.
- **Формат:** ровно 3:1, source минимум **3000×1000**, runtime **2400×800**.
  Оригиналы v2 — `art-src/hub/`; оригиналы тем — `art-src/cosmetics/`.
- Во всех сценах: no people, no animals, no readable text, no letters, no numbers,
  no watermark, no UI. Вывески — только предметные знаки без букв.
- Интерактивные якоря должны быть крупными, различимыми и разнесёнными, с пустым
  пространством для спрайтов питомцев/команды. Не запекать трофеи нигде.
- Runtime v2 уже интегрированы: `game/assets/hub/town_square_v2_web.jpg`,
  `town_market_v2_web.jpg`, `trophy_room_v2_web.jpg`.
- Промты ниже самодостаточны и повторяют нужные ограничения: склеивать их с V1 или
  добавлять старые координаты не требуется.

### 22.2 town_square_v2.png — городская площадь

Composition reference: `art-src/hub/town_square.jfif`. Результат — новый versioned
файл `art-src/hub/town_square_v2.png`, не замена текущей сцены.

```
Create a finished high-resolution 3:1 game background of a cozy medieval town
square. Use art-src/hub/hub_banner_gpt.png ONLY as the visual style reference:
storybook watercolor, gentle ink outlines, warm amber light, deep wood and soft
evening shadows. Use art-src/hub/town_square.jfif ONLY as the broad composition
reference; create a cleaner new image rather than repainting its defects.
Output exactly 3:1, at least 3000x1000 pixels, suitable for a 2400x800 runtime image.

Keep six large, distinct and clearly separated navigation anchors:
1. a wooden notice board with blank, unreadable pinned notes;
2. a welcoming entrance to the magical shop, with a lantern and a clear path home;
3. a working forge with an anvil and its own tall smoking chimney;
4. a separate craftsman workshop with a workbench and tools;
5. an unmistakable road or arch leading to the merchant quarter;
6. a cozy tavern with a mug-shaped sign and warm windows.
Leave several quiet open cobblestone areas near the edges for future pet and crew
sprites. Keep architecture and props from covering those empty spaces. Rich
high-resolution detail, readable silhouettes at one-third scale, no people, no
animals, no birds, no readable text, no letters, no numbers, no watermark, no UI,
no logos, no trophies or trophy displays baked into the scene. --ar 3:1
```

### 22.3 town_market_v2.png — торговый квартал

Composition reference: `art-src/hub/town_market.jfif`. Результат — новый versioned
файл `art-src/hub/town_market_v2.png`.

```
Create a finished high-resolution 3:1 game background of a cozy merchant quarter.
Use art-src/hub/hub_banner_gpt.png ONLY as the visual style reference: storybook
watercolor, gentle ink outlines, warm candlelit amber and deep brown tones. Use
art-src/hub/town_market.jfif ONLY as the broad composition reference, improving
clarity and separation. Output exactly 3:1, at least 3000x1000 pixels, suitable
for a 2400x800 runtime image.

Show FOUR visually distinct, separate shops around a cobblestone lane:
- a weaponsmith with a crossed-swords sign, blades and a practice shield;
- an armorer with a shield-shaped sign, an empty armor stand and helmets;
- a magic shop with a crystal-ball sign, starry cloth and glowing bottles;
- an alchemist with a flask-shaped sign, herbs, a cauldron and glass retorts.
All signs must use objects and symbols only, absolutely no letters. Give each shop
a different roofline, doorway and color accent so the four click targets cannot be
confused. Add one clear, unobstructed road back to the town square. Preserve open
walking space between the shops and crisp fine detail for a high-resolution image.
No people, no animals, no cats, no readable text, no letters, no numbers, no
watermark, no UI, no logos, no trophies baked into windows or displays. --ar 3:1
```

### 22.4 trophy_room_v2.png — кабинет трофеев

Composition reference: `art-src/hub/trophy_room.png`. Результат — новый versioned
файл `art-src/hub/trophy_room_v2.png`.

```
Create a finished high-resolution 3:1 game background of an empty trophy cabinet
inside a magical shopkeeper's home. Use art-src/hub/hub_banner_gpt.png ONLY as the
visual style reference: storybook watercolor, gentle ink outlines, warm wood and
candlelight. Use art-src/hub/trophy_room.png ONLY as the broad composition
reference. Output exactly 3:1, at least 3000x1000 pixels, suitable for 2400x800.

The wall must contain EXACTLY TWELVE large empty display niches arranged as TWO
ROWS OF SIX, with every niche fully visible and separated. Add EXACTLY FOUR small
empty pedestals together on one lower shelf. All sixteen display places must be
completely bare: no trophies, cups, weapons, antlers, statues, books or decorative
objects inside them and no objects pretending to be future trophies.
Also include, as separate anchors: an open record book on a desk, a framed world
map with no labels, a physical deck of oversized fate cards on a side table, and
a clearly visible unobstructed exit back to the shop. A quiet fireplace is allowed
outside the display wall. No people, no animals, no readable text, no letters,
no numbers, no map labels, no watermark, no UI, no logos, and ABSOLUTELY NO TROPHIES
ANYWHERE in the image. --ar 3:1
```

### 22.5 Полные пакеты лавки `lavka_pack_<id>` (первая волна, 6 тем)

В магазине только `hearth`, `spring`, `summer`, `autumn`, `winter`, `halloween`.
Одиночные ковёр, вывеска, цветы или гирлянда больше не являются отдельными заданиями:
ковёр уже есть в базовой лавке. Каждый пакет меняет согласованный НАБОР деталей.

Общий контракт всех шести промтов: edit provided `hub_banner_gpt.png`, не изменять
сам исходник; ONE complete full-background 3:1, source ≥3000×1000, runtime 2400×800.
Сохранить камеру, архитектуру и точные силуэты `lavka_base_3x1`: левый книжный шкаф,
центральный прилавок с отдельным аналоем, пустой доспех и высокая арка за ним,
нижняя светящаяся арка, большая правая деревянная дверь и всё правое окно с рамой.
Меняем coordinated SET decorations/textiles/shelf contents/hardware/lighting/outdoor
view, не isolated prop/overlay/collage. Якоря остаются раздельными, без людей,
животных, читаемого текста, букв, цифр, watermark, UI, logos и запечённых трофеев.

Preview создаётся из того же полного фона, отдельной генерации не требуется.
Если редактирование исходника даёт слабый результат, не пытайся исправлять его десятками
попыток: сразу переходи к самостоятельным text-only промтам из 22.5.12 — они описывают
ту же комнату и темы с нуля, без приложенной картинки и режима редактирования.

#### 22.5.1 lavka_pack_hearth.png — Домашний очаг

Source: `art-src/cosmetics/lavka_pack_hearth.png` · runtime: `assets/cosmetics/lavka_pack_hearth_web.jpg`.

```
Edit the provided art-src/hub/hub_banner_gpt.png and do not alter the source file.
Create ONE complete full-background 3:1 image, at least 3000x1000 pixels, suitable
for a 2400x800 runtime background. Preserve the EXACT camera, perspective and
architecture of lavka_base_3x1: left bookcase, central counter with a separate
lectern, empty armor stand and tall arch behind it, lower glowing arch, large right
wooden door, and the entire right window with its frame. Keep all seven interaction
silhouettes fixed, visible and separated.
Create a coordinated HOME HEARTH edition, never a single-prop decoration. Layer a
narrow woven runner and soft wool curtains over the EXISTING rug; do not add another
rug and do not make a rug the main change. Add a carved crest with NO writing,
matched brass hardware, beloved books and handmade ceramics on shelves, grouped
candles of different heights and warm amber lighting. Keep the familiar quiet forest
outside the unchanged window. This is one complete background, not an overlay,
isolated prop, transparent patch, collage or before-and-after comparison. No people,
no animals, no human figures baked into the scene, no readable text, no letters,
no numbers, no watermark, no UI, no logos, no trophies anywhere. --ar 3:1
```

#### 22.5.2 lavka_pack_spring.png — Весеннее пробуждение

Source: `art-src/cosmetics/lavka_pack_spring.png` · runtime: `assets/cosmetics/lavka_pack_spring_web.jpg`.

```
Edit the provided art-src/hub/hub_banner_gpt.png and do not alter the source file.
Create ONE complete full-background 3:1 image, at least 3000x1000 pixels, suitable
for a 2400x800 runtime background. Preserve the EXACT camera, perspective and
architecture of lavka_base_3x1: left bookcase, central counter with a separate
lectern, empty armor stand and tall arch behind it, lower glowing arch, large right
wooden door, and the entire right window with its frame. Keep all seven interaction
silhouettes fixed, visible and separated.
Create a coordinated SPRING AWAKENING edition: pots of violets and daisies, pastel
ribbons and light curtains, seed packets with no writing, small garden tools,
copper and honey-colored hardware, fresh morning light and a flowering road outside
the unchanged window. Balance flowers with updated shelf contents, textiles and
lighting rather than adding one flower asset. Deliver ONE complete background,
not an overlay, isolated prop, transparent patch or collage. No people, no animals,
no human figures baked into the scene, no readable text, no letters, no numbers,
no watermark, no UI, no logos, no trophies anywhere. --ar 3:1
```

#### 22.5.3 lavka_pack_summer.png — Летний фестиваль огоньков

Source: `art-src/cosmetics/lavka_pack_summer.png` · runtime: `assets/cosmetics/lavka_pack_summer_web.jpg`.

```
Edit the provided art-src/hub/hub_banner_gpt.png and do not alter the source file.
Create ONE complete full-background 3:1 image, at least 3000x1000 pixels, suitable
for a 2400x800 runtime background. Preserve the EXACT camera, perspective and
architecture of lavka_base_3x1: left bookcase, central counter with a separate
lectern, empty armor stand and tall arch behind it, lower glowing arch, large right
wooden door, and the entire right window with its frame. Keep all seven interaction
silhouettes fixed, visible and separated.
Create a coordinated SUMMER LIGHT FESTIVAL edition with a teal twilight palette,
golden lanterns and abstract points of magical light, light garlands, summer herbs,
fruit and colorful glass on shelves, airy curtains and a lush summer forest outside.
Use abstract lights ONLY, not fireflies, insects or animals. Unify fabrics, hardware,
shelf contents and lighting; do not make one garland the whole theme. Deliver ONE
complete background, not an overlay, particle sprite, transparent patch or collage.
No people, no animals, no insects, no human figures baked into the scene, no
readable text, no letters, no numbers, no watermark, no UI, no logos, no trophies
anywhere. --ar 3:1
```

#### 22.5.4 lavka_pack_autumn.png — Осенняя ярмарка

Source: `art-src/cosmetics/lavka_pack_autumn.png` · runtime: `assets/cosmetics/lavka_pack_autumn_web.jpg`.

```
Edit the provided art-src/hub/hub_banner_gpt.png and do not alter the source file.
Create ONE complete full-background 3:1 image, at least 3000x1000 pixels, suitable
for a 2400x800 runtime background. Preserve the EXACT camera, perspective and
architecture of lavka_base_3x1: left bookcase, central counter with a separate
lectern, empty armor stand and tall arch behind it, lower glowing arch, large right
wooden door, and the entire right window with its frame. Keep all seven interaction
silhouettes fixed, visible and separated.
Create a coordinated AUTUMN FAIR edition: pumpkins, wheat sheaves, dried orange
slices, completely blank fabric flags, woven baskets and wooden crates on shelves,
copper and burgundy textiles, a few dry leaves and warm amber light. Keep pumpkins
away from the lectern and all navigation silhouettes. Unify shelf contents,
hardware, fabrics and outdoor autumn colors instead of adding one garland. Deliver
ONE complete background, not an overlay, isolated prop, transparent patch or
collage. No people, no animals, no human figures baked into the scene, no readable
text, no letters, no numbers, no watermark, no UI, no logos, no trophies anywhere.
--ar 3:1
```

#### 22.5.5 lavka_pack_winter.png — Зимний очаг

Source: `art-src/cosmetics/lavka_pack_winter.png` · runtime: `assets/cosmetics/lavka_pack_winter_web.jpg`.

```
Edit the provided art-src/hub/hub_banner_gpt.png and do not alter the source file.
Create ONE complete full-background 3:1 image, at least 3000x1000 pixels, suitable
for a 2400x800 runtime background. Preserve the EXACT camera, perspective and
architecture of lavka_base_3x1: left bookcase, central counter with a separate
lectern, empty armor stand and tall arch behind it, lower glowing arch, large right
wooden door, and the entire right window with its frame. Keep all seven interaction
silhouettes fixed, visible and separated.
Create a coordinated WINTER HEARTH edition: snowy forest and distant mountains
outside, delicate frost ONLY on the outer edges of the glass, evergreen branches,
knitted textiles, stacked firewood, thick wool curtains, candles and pinecones.
Keep the interior dry, warm, bright and uncluttered, with no snow covering anchors.
Unify textiles, shelf supplies, hardware, lighting and outdoor view; do not add a
single snow overlay. Deliver ONE static complete background, not an overlay,
transparent patch, video or collage. No people, no animals, no human figures baked
into the scene, no readable text, no letters, no numbers, no watermark, no UI,
no logos, no trophies anywhere. --ar 3:1
```

#### 22.5.6 lavka_pack_halloween.png — Хэллоуин «Тени и тыквы» (первый showcase)

Source: `art-src/cosmetics/lavka_pack_halloween.png` · runtime: `assets/cosmetics/lavka_pack_halloween_web.jpg`.

```
Edit the provided art-src/hub/hub_banner_gpt.png and do not alter the source file.
Create ONE complete full-background 3:1 image, at least 3000x1000 pixels, suitable
for a 2400x800 runtime background. Preserve the EXACT camera, perspective and
architecture of lavka_base_3x1: left bookcase, central counter with a separate
lectern, empty armor stand and tall arch behind it, lower glowing arch, large right
wooden door, and the entire right window with its frame. Keep all seven interaction
silhouettes fixed, visible and separated.
Create the FIRST seasonal showcase edition, COZY HALLOWEEN, never horror: orange,
purple and charcoal fabrics, smiling pumpkin lanterns, paper bats, black candles,
small webs ONLY in free corners, purple potions and a moonlit fog outside. Unify
textiles, shelf contents, hardware and lighting. Do not cover the bookcase, counter,
lectern, armor stand, either arch, door or window with webs, bats or pumpkins.
Deliver ONE complete background, not an overlay, isolated prop, transparent patch
or collage. No people, no animals, no human figures baked into the scene, no
readable text, no letters, no numbers, no watermark, no UI, no logos, no trophies
anywhere. --ar 3:1
```

#### 22.5.7 lavka_pack_night_market.png — БУДУЩАЯ идея, НЕ в магазине

Source для будущей работы: `art-src/cosmetics/lavka_pack_night_market.png`;
runtime только после отдельной интеграции: `assets/cosmetics/lavka_pack_night_market_web.jpg`.

```
Using the provided art-src/hub/hub_banner_gpt.png as the editing base, create ONE
complete full-background 3:1 image at least 3000x1000 pixels for a 2400x800 runtime,
without altering the source. Preserve lavka_base_3x1 camera, architecture, all
seven anchor silhouettes and their separation. Create a coordinated NIGHT MARKET
edition with indigo and purple lanterns, decorative masks displayed as objects,
folded silk, hanging ornaments, richer shelf displays and a glowing night city
outside the unchanged right window. No isolated prop or overlay. No people,
animals, readable text, letters, numbers, watermark, UI, logos or trophies. --ar 3:1
```

#### 22.5.8 lavka_pack_star_fair.png — БУДУЩАЯ идея, НЕ в магазине

Source: `art-src/cosmetics/lavka_pack_star_fair.png`; runtime после интеграции:
`assets/cosmetics/lavka_pack_star_fair_web.jpg`.

```
Using the provided art-src/hub/hub_banner_gpt.png as the editing base, create ONE
complete full-background 3:1 image at least 3000x1000 pixels for a 2400x800 runtime,
without altering the source. Preserve lavka_base_3x1 camera, architecture, all
seven anchor silhouettes and their separation. Create a coordinated STAR FAIR
edition in navy and gold: constellation ornaments with no writing, a telescope,
an armillary sphere, luminous crystals and distant fireworks outside, while keeping
the shop calm and readable. Unify textiles, hardware, shelves and lighting, not just
one telescope. No people, animals, readable text, letters, numbers, watermark, UI,
logos or trophies. --ar 3:1
```

#### 22.5.9 lavka_pack_rainy_hearth.png — БУДУЩАЯ идея, НЕ в магазине

Source: `art-src/cosmetics/lavka_pack_rainy_hearth.png`; runtime после интеграции:
`assets/cosmetics/lavka_pack_rainy_hearth_web.jpg`.

```
Using the provided art-src/hub/hub_banner_gpt.png as the editing base, create ONE
complete full-background 3:1 image at least 3000x1000 pixels for a 2400x800 runtime,
without altering the source. Preserve lavka_base_3x1 camera, architecture, all
seven anchor silhouettes and their separation. Create a coordinated RAINY HEARTH
edition: rain on the outside of the right window, grey-green curtains, an umbrella
stand, folded towels, a tea tray with copper mugs, healthy houseplants and a bright
warm hearth. Keep the interior dry and the anchors unobstructed. No isolated prop
or overlay. No people, animals, readable text, letters, numbers, watermark, UI,
logos or trophies. --ar 3:1
```

#### 22.5.10 lavka_pack_arcane_library.png — БУДУЩАЯ идея, НЕ в магазине

Source: `art-src/cosmetics/lavka_pack_arcane_library.png`; runtime после интеграции:
`assets/cosmetics/lavka_pack_arcane_library_web.jpg`.

```
Using the provided art-src/hub/hub_banner_gpt.png as the editing base, create ONE
complete full-background 3:1 image at least 3000x1000 pixels for a 2400x800 runtime,
without altering the source. Preserve lavka_base_3x1 camera, architecture, all
seven anchor silhouettes and their separation. Create a coordinated ARCANE LIBRARY
edition: more books and manuscripts with unreadable pages, rolled maps without
labels, green reading lamps, ribbon bookmarks, an ink set and a small reading nook
that does not move the existing anchors. Unify shelf contents, textiles, hardware
and lighting. No people, animals, readable text, letters, numbers, watermark, UI,
logos or trophies. --ar 3:1
```

#### 22.5.11 CUSTOM layout variant — только после отдельного layoutId

Это вариант на будущее, не товар и не разрешение менять базовую карту. Source:
`art-src/cosmetics/lavka_pack_custom_<layoutId>.png`; runtime после отдельной
интеграции: `assets/cosmetics/lavka_pack_custom_<layoutId>_web.jpg`.
Перед работой нужен новый layoutId и ПОЛНАЯ переразметка всех семи маршрутов;
`lavka_base_3x1` и его полигоны не переиспользуются. Missing image всегда возвращает
base src + base layout, не custom-полигоны.

```
Edit the provided art-src/hub/hub_banner_gpt.png without altering the source, and
create ONE complete full-background 3:1 image at least 3000x1000 pixels for a
2400x800 runtime. This is an approved CUSTOM LAYOUT edition, not the base layout.
You may rearrange furniture, but preserve seven distinct, understandable functions:
puzzle books, merchant counter, guest lectern, empty armor stand, trophy-cabinet
arch, town-square door and expedition window. Give every function a separate,
visible, practical silhouette with empty space for native buttons and character
sprites. Use a coordinated set of textiles, shelf contents, hardware and lighting,
not an isolated prop or overlay. No people, animals, readable text, letters,
numbers, watermark, UI, logos or trophies. After generation, every hotspot must be
manually remapped and assigned a new layoutId before integration. --ar 3:1
```

#### 22.5.12 TEXT-ONLY без референса — если редактирование исходника не нравится

Это **альтернативный самостоятельный конвейер**, а не редактирование. Используй его,
когда результат `Edit provided...` выглядит плохо: не прикладывай `hub_banner_gpt.png`
и не проси модель повторить его. Каждый промт ниже уже содержит полную композицию.
Проценты — только ориентир для художника, а не готовые координаты для кода: после
генерации всё равно проверяем силуэты глазами. Source/runtime-пути те же, что в 22.5.1–6.

```
Create ONE complete finished game background from WRITTEN DESCRIPTION ONLY.
Do not use or request a reference image, editing mask, overlay or before/after comparison.
Wide 3:1 panorama, at least 3000x1000 pixels, for a 2400x800 runtime. Detailed painterly
storybook illustration with gentle ink outlines, coherent perspective and contact shadows,
warm amber light, dark wood and deep brown shadows. No flat vector, no clip-art, no collage.

Interior, eye-level view from the entrance toward the back wall. Approximate composition:
a tall dark-wood bookcase fills x=3–17% and most of the left wall; a long merchant counter
stands at x=24–52%, y=52–77%; a separate small lectern with an open book stands in front
of it at x=40–49%, y=56–92%. An EMPTY armor stand is right of center at x=51–58%,
y=26–70%, with a tall arched doorway behind it. A lower glowing arch sits at x=65–72%,
y=55–76%. A large wooden door with iron hinges occupies x=75–85%, y=21–82%. A huge
multi-paned window with a complete wooden frame fills x=87–100%, y=0–68%, showing a
quiet forest road and distant blue mountains. Stone floor, exposed beams, candles,
potions and handmade objects on shelves. Keep all seven areas visually separated.

Theme: COZY HOME HEARTH. Layer a narrow woven runner and soft wool curtains over the
existing rug, not a second rug and not a rug-focused scene. Add a carved shop crest
with NO writing, matching brass hardware, beloved books and handmade ceramics on
shelves, grouped candles of different heights and a gentle amber glow. Change the whole
coordinated set of textiles, shelf contents, hardware and lighting, not one isolated prop.
Keep the familiar quiet forest outside. No people, no animals, no readable text, letters,
numbers, watermark, UI, logos or trophies anywhere. --ar 3:1
```

```
Create ONE complete finished game background from WRITTEN DESCRIPTION ONLY.
Do not use or request a reference image, editing mask, overlay or before/after comparison.
Wide 3:1 panorama, at least 3000x1000 pixels, for a 2400x800 runtime. Detailed painterly
storybook illustration with gentle ink outlines, coherent perspective and contact shadows,
warm amber light, dark wood and deep brown shadows. No flat vector, no clip-art, no collage.

Use this exact interior concept: left wall x=3–17% is a tall bookcase; a merchant counter
is at x=24–52%, y=52–77%; a separate lectern with an open book is at x=40–49%, y=56–92%;
an EMPTY armor stand and a tall arch behind it are at x=51–58%, y=26–70%; a lower glowing
arch is at x=65–72%, y=55–76%; a large hinged wooden door is at x=75–85%, y=21–82%;
a complete multi-paned window is at x=87–100%, y=0–68%, with forest and mountains outside.
Stone floor, exposed beams, candles and varied handmade goods. All seven zones remain
distinct and unobstructed.

Theme: SPRING AWAKENING. Fill the room with a coordinated spring redesign: pots of violets
and daisies, pastel ribbons and light curtains, unlabeled seed packets, small garden tools,
copper and honey-colored hardware, fresh handmade ceramics and brighter morning light.
Show a flowering road and fresh green hills outside the complete window frame. Change
shelf contents, textiles and lighting together, not just one flower prop. No people,
animals, readable text, letters, numbers, watermark, UI, logos or trophies anywhere. --ar 3:1
```

```
Create ONE complete finished game background from WRITTEN DESCRIPTION ONLY.
Do not use or request a reference image, editing mask, overlay or before/after comparison.
Wide 3:1 panorama, at least 3000x1000 pixels, for a 2400x800 runtime. Detailed painterly
storybook illustration with gentle ink outlines, coherent perspective and contact shadows,
deep wood, warm amber light and deep brown shadows. No flat vector, no clip-art, no collage.

Interior composition: a tall bookcase at x=3–17%; merchant counter at x=24–52%, y=52–77%;
separate lectern with an open book at x=40–49%, y=56–92%; EMPTY armor stand and a tall arch
at x=51–58%, y=26–70%; lower glowing arch at x=65–72%, y=55–76%; large wooden door with
iron hinges at x=75–85%, y=21–82%; complete multi-paned window at x=87–100%, y=0–68%.
Stone floor, beams, candles and shelf goods. All seven interaction zones stay separated.

Theme: SUMMER LIGHT FESTIVAL. Use a coordinated teal-twilight redesign with golden lanterns,
abstract points of magical light, light garlands, summer herbs, fruit and colorful glass on
the shelves, airy curtains and a lush summer forest outside. Use abstract lights ONLY,
never insects or animals. Unify fabrics, hardware, shelf contents and lighting; do not make
one garland the whole theme. No people, animals, insects, readable text, letters, numbers,
watermark, UI, logos or trophies anywhere. --ar 3:1
```

```
Create ONE complete finished game background from WRITTEN DESCRIPTION ONLY.
Do not use or request a reference image, editing mask, overlay or before/after comparison.
Wide 3:1 panorama, at least 3000x1000 pixels, for a 2400x800 runtime. Detailed painterly
storybook illustration with gentle ink outlines, coherent perspective and contact shadows,
warm amber light, dark wood and deep brown shadows. No flat vector, no clip-art, no collage.

Interior composition: a tall bookcase at x=3–17%; merchant counter at x=24–52%, y=52–77%;
separate lectern with an open book at x=40–49%, y=56–92%; EMPTY armor stand and a tall arch
at x=51–58%, y=26–70%; lower glowing arch at x=65–72%, y=55–76%; large wooden door with
iron hinges at x=75–85%, y=21–82%; complete multi-paned window at x=87–100%, y=0–68%.
Stone floor, beams, candles and shelf goods. All seven interaction zones stay separated.

Theme: AUTUMN FAIR. Redesign the whole shop with pumpkins, wheat sheaves, dried orange
slices, completely blank fabric flags, woven baskets and wooden crates on the shelves,
copper and burgundy textiles, a few dry leaves and warm amber light. Keep pumpkins away
from the lectern and every navigation silhouette. Unify shelf contents, hardware, fabrics
and outdoor autumn colors; do not add just one garland. No people, animals, readable text,
letters, numbers, watermark, UI, logos or trophies anywhere. --ar 3:1
```

```
Create ONE complete finished game background from WRITTEN DESCRIPTION ONLY.
Do not use or request a reference image, editing mask, overlay or before/after comparison.
Wide 3:1 panorama, at least 3000x1000 pixels, for a 2400x800 runtime. Detailed painterly
storybook illustration with gentle ink outlines, coherent perspective and contact shadows,
warm amber light, dark wood and deep brown shadows. No flat vector, no clip-art, no collage.

Interior composition: a tall bookcase at x=3–17%; merchant counter at x=24–52%, y=52–77%;
separate lectern with an open book at x=40–49%, y=56–92%; EMPTY armor stand and a tall arch
at x=51–58%, y=26–70%; lower glowing arch at x=65–72%, y=55–76%; large wooden door with
iron hinges at x=75–85%, y=21–82%; complete multi-paned window at x=87–100%, y=0–68%.
Stone floor, beams, candles and shelf goods. All seven interaction zones stay separated.

Theme: WINTER HEARTH. Show a snowy forest and distant blue mountains outside the complete
window frame, with delicate frost ONLY on the outer edges of the glass. Add evergreen
branches, knitted textiles, stacked firewood, thick wool curtains, candles and pinecones.
Keep the interior dry, warm, bright and uncluttered, with no snow covering any anchor.
Unify textiles, shelf supplies, hardware, lighting and outdoor view; no single snow overlay.
No people, animals, readable text, letters, numbers, watermark, UI, logos or trophies anywhere.
--ar 3:1
```

```
Create ONE complete finished game background from WRITTEN DESCRIPTION ONLY.
Do not use or request a reference image, editing mask, overlay or before/after comparison.
Wide 3:1 panorama, at least 3000x1000 pixels, for a 2400x800 runtime. Detailed painterly
storybook illustration with gentle ink outlines, coherent perspective and contact shadows,
warm amber light, dark wood and deep brown shadows. No flat vector, no clip-art, no collage.

Interior composition: a tall bookcase at x=3–17%; merchant counter at x=24–52%, y=52–77%;
separate lectern with an open book at x=40–49%, y=56–92%; EMPTY armor stand and a tall arch
at x=51–58%, y=26–70%; lower glowing arch at x=65–72%, y=55–76%; large wooden door with
iron hinges at x=75–85%, y=21–82%; complete multi-paned window at x=87–100%, y=0–68%.
Stone floor, beams, candles and shelf goods. All seven interaction zones stay separated.

Theme: COZY HALLOWEEN, never horror. Use orange, purple and charcoal fabrics, smiling
pumpkin lanterns, paper bats, black candles, small webs ONLY in free corners, purple
potions and a moonlit fog outside. Unify textiles, shelf contents, hardware and lighting.
Do not cover the bookcase, counter, lectern, armor stand, either arch, door or window
with webs, bats or pumpkins. Deliver a complete new scene, not an overlay or isolated prop.
No people, animals, readable text, letters, numbers, watermark, UI, logos or trophies anywhere.
--ar 3:1
```

### 22.6 OPTIONAL: согласованные multi-scene editions после стабилизации лавки

**Это семейство будущих вариантов, а не готовый продукт и не текущая задача.**
Сначала должны быть созданы и приняты полные темы лавки. Только затем можно делать
согласованные seasonal/holiday/rain/night editions для square, market и cabinet:
каждая сцена получает СВОЙ полный фон, не общий растянутый арт и не видео.

- `square_v2_3x1`: сохранить доску, вход в лавку, кузницу с трубой, отдельную
  мастерскую, арку market, таверну и свободные pet/crew spaces; фонтан не маршрут.
- `market_v2_3x1`: сохранить четыре раздельных фасада и центральную дорогу обратно.
- `cabinet_v2_3x1`: сохранить карту, книгу, колоду и выход, ровно 12 пустых ниш
  2×6 и 4 пустые малые подставки; трофеи в фон не запекать.
- Source по существующей конвенции: `art-src/hub/town_square_pack_<edition>.png`,
  `town_market_pack_<edition>.png`, `trophy_room_pack_<edition>.png`. Runtime-пути
  появляются только после отдельной интеграции; базовые v2 не перезаписываются.
- Новые наборы не превращают бесплатные темы в платные. Ни бонусов, ни энергии,
  ни силы за покупку. Реальный payment URL и платформа обсуждаются отдельно,
  не как обязательная часть набора.

Шаблон для одной сцены из будущей edition (подставить тему и нужную сцену):

```
Create ONE complete full-background 3:1 image for the <edition> edition of the
existing <town_square_v2 | town_market_v2 | trophy_room_v2> scene. Work on one
scene at a time, edit the corresponding current v2 reference without altering its
source file, and use art-src/hub/hub_banner_gpt.png only as the style reference.
Output at least 3000x1000 pixels, suitable for a 2400x800 runtime background.
Preserve the exact current layoutId, camera, architecture, all navigation
silhouettes and empty character spaces. Apply the <edition> as a coordinated set
of textiles, props, hardware, lighting and outdoor details, not an isolated prop,
overlay, collage, video or animation. For the trophy room, keep exactly twelve
empty niches in two rows of six and four empty small pedestals, with no trophies
anywhere. No people, animals, readable text, letters, numbers, watermark, UI,
logos or baked trophies. Generate each scene independently with its own versioned
filename; do not replace the current v2 backgrounds. --ar 3:1
```


### 22.7 Приёмка, выравнивание и интеграция

- **Уже готово:** `town_square_v2_web.jpg`, `town_market_v2_web.jpg`,
  `trophy_room_v2_web.jpg` интегрированы в 2400×800 и прошли Chrome-приёмку,
  включая hit-test и 12+4 мест кабинета. Их layoutId — `square_v2_3x1`,
  `market_v2_3x1`, `cabinet_v2_3x1`; error возвращает старый файл и legacy circles.
  Не описывать эти сцены как отсутствующие и не генерировать заново без причины.
- **Ещё не созданы:** `lavka_pack_hearth/spring/summer/autumn/winter/halloween`.
  Source — `art-src/cosmetics/lavka_pack_<id>.png`, runtime после обработки —
  `assets/cosmetics/lavka_pack_<id>_web.jpg`, 2400×800. Не создавать placeholder
  и не объявлять путь готовым файлом.
- Для каждой новой темы проверить source ≥3000×1000, ровно 3:1, отсутствие растяжения,
  людей, животных, читаемого текста, watermark/UI/logos и запечённых трофеев.
  Прилавок и аналой остаются раздельными, все семь якорей видимы и не перекрыты.
- Связка `src + layoutId` обязательна. Все текущие пакеты используют
  `lavka_base_3x1` и `LAVKA_HOTSPOT_SHAPES`. Неизвестный layout возвращает base src
  и base layout; custom требует нового layoutId и полной разметки, а не заимствования
  базовых полигонов.
- Миграция `COSMETICS_VERSION=2`: carpet+crest → одна hearth без повторной оплаты,
  flowers → spring, fireflies → summer, garland → autumn, snow → winter. Старые
  `cos_*` остаются только для legacy fallback, не для каталога.
- Missing selected image → базовый `hub_banner_web.jpg` + прежние legacy overlays;
  successful load полного pack-фона → legacy-слой полностью скрывается. Проверить
  обе ветки на реальном файле, не надеясь только на наличие metadata.
- Preview делается из того же полного фона, без новой генерации. В магазине видны
  3–5 содержательных changes пакета, а не описание одного спрайта.
- Versioned filenames обязательны. Не перезаписывать `hub_banner_gpt.png`, текущие
  v2 и особенно старые `glass`/`spin`: эти изображения нужны другим головоломкам.
- `night_market`, `star_fair`, `rainy_hearth`, `arcane_library` и multi-scene editions —
  только идеи до появления реальных файлов. Не добавлять их заранее в данные или
  магазин и не превращать бесплатные темы в платные.
- Для КАЖДОЙ новой темы после генерации выполнить Chrome-приёмку: загрузка без error,
  сравнение с базой на одном полотне, hit-test всех якорей, mobile nav, клавиатура и
  touch, missing/successful load и отсутствие legacy поверх полного фона. Для
  halloween дополнительно проверить первый showcase: паутина и тыквы не закрывают
  якоря. Для custom — отдельно проверить новую разметку и base fallback.

---

## 23. Иконки внесетовых босс-находок (12 предметов)

Предметы уже существуют в `game/src/data/items.js` и связаны с боссами через
`game/src/data/bossDrops.js`. Здесь только иконки, **не новые предметы и не новые
сеты**. Оригиналы — `art-src/items/`, runtime — `game/assets/items/<id>_web.jpg`
(квадрат 256–512 px). При отсутствии файла уже работает эмодзи-fallback.

Единый шаблон в стиле раздела 18. Подставь English visual prompt из списка в
`{SUBJECT}`; фон у всех **rare**, точный HEX `#2e4a66`.

```
Game inventory icon, {SUBJECT}, single object centered, filling about 70%
of the frame, slightly angled three-quarter view, cozy storybook watercolor
style with gentle ink outlines, warm light from the upper left, soft shadow
under the object, plain solid background of exact hex color #2e4a66, no
other objects, no readable text, no letters, no numbers, no watermark --ar 1:1
```

1. **shd_willow_vow — Щит ивовой клятвы**
   `a sturdy round shield of dark willow wood with a living green branch curling around its rim and a small golden oath knot carved into the center`
2. **glv_captain_oath — Перчатки капитанской клятвы**
   `a pair of dignified captain gauntlets in deep blue leather with brass wrist plates and a small crimson oath ribbon tied without writing`
3. **rng_keeper_bookmark — Кольцо живой закладки**
   `an antique gold ring holding a tiny folded living book page that curls like a bookmark, with a warm amber glow along its edges`
4. **amu_star_compass — Амулет звёздного компаса**
   `a round silver pendant compass with a tiny star-shaped needle pointing toward a glowing constellation, no letters or cardinal labels`
5. **wpn_nm_afterhours — Кинжал после полуночи**
   `a slim midnight-blue dagger with a moonlit silver edge and a miniature lantern-shaped pommel glowing softly in the dark`
6. **bt_sw_reed — Сапоги камышовой тропы**
   `a pair of waterproof traveler boots with woven reed patterns, moss-green lining and flexible mud-proof soles for a swamp path`
7. **rng_sf_encore — Кольцо ярмарочного биса**
   `a festive silver ring decorated with tiny colorful fairground beads and two small ribbon loops suggesting a joyful encore`
8. **hlm_cr_geode — Шлем жеодового эха**
   `a rounded mountain helmet of brushed steel with a split geode set into the forehead, revealing luminous blue and violet crystals`
9. **arm_ash_wayfarer — Броня пепельного путника**
   `a layered wayfarer armor of ash-grey cloth and scorched metal plates with a travel cloak and faint ember light inside the seams`
10. **wpn_jade_branch — Меч нефритовой ветви**
    `an elegant one-handed sword shaped around a living jade branch, with carved green leaves and a luminous vein running along the blade`
11. **shd_deep_tideglass — Щит приливного стекла**
    `a protective shield of translucent blue-green tideglass framed in dark silver, with a rolling ocean wave suspended inside the glass`
12. **glv_mist_minute — Перчатки тихой минуты**
    `a pair of soft mist-violet gloves with delicate silver stitching and a tiny numeral-free clock dial resting quietly on each wrist`

