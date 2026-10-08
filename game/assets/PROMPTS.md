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
