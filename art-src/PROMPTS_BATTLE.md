# Промты для бойцов режима «Походы рыцаря» (PNG 256×256)

Отдельный файл от PROMPTS.md: здесь только спрайты юнитов боя (союзники и враги).
Код игры берёт `assets/battle/units/<id>_<pose>_web.png`, позы: `idle` (стойка),
`atk` (атака), `hurt` (получение урона), `down` (падение), `walk` (шаг).
**Пока файла нет — показывается старый эмодзи**, игра не ломается, генерируем
в любом темпе.

## Техника

Итоговый файл — PNG **256×256 с прозрачным фоном**. Генерируем крупно
(1024×1024), вырезаем белый фон скриптом (маска «яркий и почти серый» +
заливка от краёв + разрастание, как питомцы/курсоры), ужимаем до 256×256
**только с премультиплицированной альфой**, иначе цветной ореол. Оригиналы —
в `art-src/battle/units/`, в рантайм — `game/assets/battle/units/`.

## Как генерировать (важно!)

1. Сначала генерируем **позу А (стойку)** юнита — это его эталон.
2. Позы Б–Д генерируем **image-to-image по референсу А** (прикладываем
   картинку стойки + промт «Same character as the reference image…»), так
   дизайн и палитра совпадут между позами.
3. Все юниты смотрят **вправо** (facing right) — врагов код зеркалит сам.
4. Спрайт читается на высоте ~70 px: крупный силуэт, без мелкого шума.
5. Боссы (помечены БОСС) — та же стойка, но фигура массивнее, заполняет кадр.

## Волны генерации

- Волна 1: 1–22 (союзники, Тихая опушка, Средневековый дворик, Книжный чердак, Перекрёсток)
- Волна 2: 23–29 (Ночной рынок) · Волна 3: 30–36 (Сказочные топи)
- Волна 4: 37–43 (Звёздная ярмарка) · Волна 5: 44–50 (Пепельные степи)
- Волна 6: 51–57 (Хрустальные горы) · Волна 7: 58–63 (Нефритовый сад)
- Волна 8: 64–70 (Подводный грот) · Волна 9: 71–77 (Туманные часы)

---

## Союзники (1–5)

### 1. `knight` — Рыцарь лавки (союзник)
Файлы: `assets/battle/units/knight_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка** (генерируется первой — референс для Б–Д):
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a small brave knight in slightly oversized warm brass-and-leather armor, a cozy knitted scarf, short sword and a round shield with a tiny lantern emblem, standing in a ready battle stance, alert, weight slightly forward, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm muted palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака** (по референсу А):
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: lunging sword thrust forward, shield tucked close, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: recoiling from a hit, flinching backward, eyes squeezed shut, shield raised instinctively, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: lying defeated on the ground, eyes peacefully closed, sword slipped from a relaxed hand, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: mid-step walking forward, one boot lifted, shield up, body leaning ahead, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 2. `merc_archer` — Лесная лучница (союзник)
Файлы: `assets/battle/units/merc_archer_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a slender forest elf archer girl in a leaf-green hood, a wooden longbow in hand and a quiver on her back, standing in a ready battle stance, alert, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm muted palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: drawing the bowstring fully back, arrow aimed forward, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: recoiling from a hit, flinching backward, hood slipping, eyes squeezed shut, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: sitting defeated on the ground, bow lying across her knees, eyes closed, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: mid-step sneaking forward, one foot lifted, bow half-raised, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 3. `merc_guard` — Дворовый громила (союзник)
Файлы: `assets/battle/units/merc_guard_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a stout friendly human bruiser in a padded town-guard vest, holding a big wooden mallet with both hands, standing in a ready battle stance, feet wide apart, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm muted palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: swinging the big mallet overhead in a heavy downward arc, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: staggering from a hit, one knee dipping, mallet planted for support, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: lying flat on his back, arms spread, mallet beside him, eyes closed, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: heavy mid-step stomp forward, mallet resting on shoulder, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 4. `merc_witch` — Ведьминка с топей (союзник)
Файлы: `assets/battle/units/merc_witch_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a young swamp witch girl with a crooked pointed hat and a reed basket on her belt, holding a small bubbling potion flask, standing in a ready battle stance, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm muted palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: tossing the glowing potion flask forward, other hand raised, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: recoiling from a hit, clutching her hat, stumbling back, eyes squeezed shut, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: sitting on the ground leaning on her basket, hat tipped over her eyes, peacefully out of the fight, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: mid-step walking forward, skirts swishing, flask held close, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 5. `merc_knight_errant` — Странствующий клинок (союзник)
Файлы: `assets/battle/units/merc_knight_errant_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a wandering human knight in modest travel-worn steel armor and a dusty cloak, holding a long sword lowered but ready, standing in a calm battle stance, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm muted palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a heavy two-handed overhead sword swing, cloak flaring, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: knocked half a step back, sword dipped, cloak wrapping from the blow, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: on one knee, sword planted into the ground, head bowed, cloak pooled, defeated but dignified, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: steady mid-step forward, cloak swaying, sword held low, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

---

## Тихая опушка (6–11)

### 6. `slime_meadow` — Лужайный слизень
Файлы: `assets/battle/units/slime_meadow_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a small translucent green meadow slime blob with a tiny leaf stuck on top and simple shiny eyes, sitting alert in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm muted palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: stretching its whole gooey body forward in a lunging splash, leaf flying, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: squashed flat and wobbling from a hit, eyes spinning, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: melted into a still puddle, leaf resting on top, eyes closed, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: mid-hop forward, body stretched upward in a bounce, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 7. `bee_wild` — Дикая пчела
Файлы: `assets/battle/units/bee_wild_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a chubby wild honeybee with fuzzy amber stripes, a tiny stinger and blurred little wings, hovering in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm muted palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: darting forward stinger-first, wings a blur, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: tumbling backward in the air from a hit, legs flailing, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: lying on its back on the ground, legs curled up, wings folded, peacefully still, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: buzzing forward in a low glide with small motion swirls, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 8. `spirit_forest` — Лесной дух
Файлы: `assets/battle/units/spirit_forest_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a gentle forest spirit made of layered leaves and twigs with a softly glowing moss heart in its chest, twig arms lowered, hovering slightly above the ground, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm muted palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: releasing a puff of glowing spores from raised twig arms, leaves swirling, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: scattering a few loose leaves from a hit, body tilted back, glow flickering, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: collapsed into a small neat pile of leaves with the moss heart dimmed, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: drifting forward with leaves trailing in soft motion swirls, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 9. `moth_night` — Ночной мотылёк
Файлы: `assets/battle/units/moth_night_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a soft night moth with dusty violet wings, a fuzzy body and gentle antennae, hovering in a ready pose, wings half-open, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm muted palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: fluttering upward and shaking a cloud of sleepy dust from its wings, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: knocked sideways in the air, wings folded unevenly, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: resting on the ground with wings folded like a little tent, antennae drooped, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: fluttering forward with soft wing-blur and a dust trail, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 10. `golem_moss` — Мшистый голем
Файлы: `assets/battle/units/golem_moss_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a squat moss-covered stone golem with pebble eyes and small ferns growing on its shoulders, standing heavy and ready, stone fists lowered, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm muted palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a slow heavy overhead smash with one stone fist, moss shaking off, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: rocked back on its heels, a crack of dust rising, pebble eyes rattled, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: settled into a motionless mossy rock pile, indistinguishable from ordinary stones, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a slow stomping mid-step, one stone foot raised, small dust puff, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 11. `boss_willow` — Хранитель старой ивы (БОСС)
Файлы: `assets/battle/units/boss_willow_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, an ancient willow-tree guardian come alive, gnarled trunk body, sweeping branch arms, hanging willow strands like hair, warm amber sap glowing in cracks, imposing and larger, filling the frame, standing rooted and ready, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm muted palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: sweeping a huge gnarled branch arm in a wide arc, willow strands flying, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: trunk shuddering from a hit, leaves and twigs falling, sap glow flaring, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: toppled over like a fallen old tree, branches resting on the ground, sap glow fading warm, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: lumbering a heavy root-step forward, ground trembling in small dust puffs, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

---

## Средневековый дворик (12–16)

### 12. `rat_thief` — Крыса-воришка
Файлы: `assets/battle/units/rat_thief_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a sneaky upright rat thief with a tiny bandit mask, a little sack over its shoulder and a rusty little dagger, hunched in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm muted palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a quick stabbing lunge with the tiny dagger, tail whipping, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: knocked back onto its tail, sack spilling a coin or two, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: curled up on the ground hugging its sack, eyes closed, defeated, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: tiptoeing mid-step forward, dagger ready, tail low, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 13. `bandit` — Дворовый разбойник
Файлы: `assets/battle/units/bandit_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a burly courtyard bandit in a patched coat and a cloth hood, holding a knotted wooden club, standing in a hunched ready stance, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm muted palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a heavy horizontal club swing, coat flapping, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: stumbling back with a hand to his face, club dipped, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: sitting on the ground with legs spread, club dropped, head hanging, defeated, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: swaggering mid-step forward, club resting on shoulder, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 14. `golem_wander` — Бродячий голем
Файлы: `assets/battle/units/golem_wander_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a wandering golem built of stacked red bricks with a single round pebble eye and a small chimney pot on top, standing heavy and ready, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm muted palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a slow two-fisted brick slam forward, mortar dust puffing, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: one brick knocked loose and tilting, body leaned back, dust rising, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: collapsed into a tidy stack of loose bricks, the chimney pot resting on top, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a slow stomping mid-step, one brick foot raised, small dust puff, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 15. `ghost_guard` — Призрак стражи
Файлы: `assets/battle/units/ghost_guard_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a translucent pale-blue ghost of a town guard in an old breastplate, holding a spectral halberd, lower body fading into wisps, floating in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, cool muted palette with warm accents, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a spectral halberd thrust, body leaning through the air, wisps trailing, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: flickering and half-dissolved from a hit, halberd drooping, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: sunk low to the ground as a dim puddle of mist with the breastplate resting in it, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: gliding forward, wisps trailing behind, halberd levelled, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 16. `boss_captain` — Призрак капитана стражи (БОСС)
Файлы: `assets/battle/units/boss_captain_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, the translucent ghost of a guard captain with a plumed helmet, a tattered spectral cape and a glowing sabre, imposing and larger, filling the frame, floating in a proud ready stance, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, cool muted palette with warm accents, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a sweeping slash with the spectral sabre, cape flaring wide, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: flickering violently from a hit, cape torn into wisps, sabre dipped, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: melted into a low mist with the plumed helmet resting quietly on top, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: gliding forward solemnly, cape streaming, sabre raised, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

---

## Книжный чердак (17–21)

### 17. `ink_blot` — Чернильная клякса
Файлы: `assets/battle/units/ink_blot_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a living glossy black ink blot with mischievous white eyes and dripping tendrils, sitting alert and ready, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, muted palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: splashing forward and flinging ink droplets, body stretched, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: splattered sideways from a hit, droplets flying, eyes dizzy, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a still flat ink puddle with closed eyes, one tiny drip settling, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: sloshing forward in a rolling motion, leaving a tiny wet trail, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 18. `paper_spirit` — Бумажный дух
Файлы: `assets/battle/units/paper_spirit_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a paper spirit folded like an origami figure with ink-drawn eyes and crisp folded edges, hovering slightly in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm muted palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: spinning like a paper dart and slashing with a sharp folded edge, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: crumpled on one side from a hit, tilted and wobbling, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: flattened into a single quiet sheet of paper lying on the ground, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: fluttering forward like a leaf in the wind, soft motion swirls, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 19. `book_moth` — Книжная моль
Файлы: `assets/battle/units/book_moth_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a grey book moth with wings patterned like tiny book pages, a fuzzy body and small antennae, hovering in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm muted palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: darting in a zigzag, wings shedding page-dust, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: knocked sideways in the air, one wing bent, dust puffing, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: lying on the ground between its folded wings like a closed little book, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: fluttering forward with soft wing-blur, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 20. `illustration` — Ожившая иллюстрация
Файлы: `assets/battle/units/illustration_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, an ornate golden picture frame come alive, its painted landscape forming a sturdy body with small gilded legs, a tiny painted knight visible inside the picture, standing ready, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm muted palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: the tiny painted knight thrusting a lance out of the picture while the frame leans forward, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: frame tilted and cracked at a corner from a hit, picture skewed, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: lying flat on the ground like a dropped painting, picture dimmed, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: waddling mid-step on its little gilded legs, frame tilting forward, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 21. `boss_keeper` — Хранитель последней страницы (БОСС)
Файлы: `assets/battle/units/boss_keeper_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a tall robed book-spirit made of fluttering pages, a bookmark sash across its chest and a stern ink-drawn face, imposing and larger, filling the frame, hovering in a ready stance, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm muted palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: sending a wave of razor-edged pages swirling forward, robe billowing, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: pages scattering from a hit, robe gaping, form flickering, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: collapsed into a neat stack of closed pages with the bookmark sash resting on top, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: gliding forward, pages fluttering behind like a train, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

---

## Перекрёсток миров (22)

### 22. `boss_star_guardian` — Звёздный страж (БОСС)
Файлы: `assets/battle/units/boss_star_guardian_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a radiant star guardian spirit in celestial armor patterned with constellations, a warm starfire glow in its chest and hands, imposing and larger, filling the frame, floating in a noble ready stance, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, deep blue palette with golden accents, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: hurling a small burning star bolt from an open palm, armor flaring with light, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: rocked back with constellation lines flickering and dimming from a hit, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: kneeling low, light dimmed to embers, helmet bowed, constellation lines faded, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: gliding forward with a trail of tiny star sparks, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

---

## Ночной рынок (23–29)

### 23. `nm_moth` — Янтарный мотылёк
Файлы: `assets/battle/units/nm_moth_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, an amber night moth with warm glowing dust on its wings and a soft fuzzy body, hovering in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm amber palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: dipping forward and puffing a cloud of amber dust from its wings, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: knocked sideways in the air, glow sputtering, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: resting on the ground with wings folded, amber glow dimmed to embers, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: fluttering forward with a warm dust trail, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 24. `nm_mask` — Ожившая маска
Файлы: `assets/battle/units/nm_mask_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a floating painted carnival mask with ribbon ties fluttering like limbs and glowing eyes in the slits, hovering in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm muted palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: spinning like a disc, ribbons lashing forward, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: knocked askew with a crack across one cheek, ribbons tangled, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: lying face-up on the ground like a dropped mask, ribbons limp, eyes dark, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: bobbing forward through the air, ribbons trailing, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 25. `nm_shadow` — Прилавочная тень
Файлы: `assets/battle/units/nm_shadow_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a soft dark silhouette creature of living shadow with two warm cat-like amber eyes, edges dissolving into wisps, crouched in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, muted palette with warm eye glow, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: stretching into a long clawed swipe, body elongating, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: torn into ragged wisps from a hit, eyes blinking, reforming, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a flat still shadow lying on the ground with closed eyes, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: flowing forward low to the ground like spilled ink, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 26. `nm_lantern` — Дух фонаря
Файлы: `assets/battle/units/nm_lantern_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a red paper lantern spirit with a warm flame face glowing inside and a tassel tail, floating in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm red-and-gold palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: spitting a small warm fireball, lantern body puffed, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: dented and tilted from a hit, inner flame guttering, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a collapsed paper lantern lying on the ground, flame out, tassel still, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: bobbing forward with a gentle sway, tassel swinging, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 27. `nm_garland` — Гирляндный змей
Файлы: `assets/battle/units/nm_garland_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a serpent made of a glowing garland string with warm light bulbs for scales and a larger bulb head, coiled in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm golden palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: whipping forward like a striking snake, bulbs sparking, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: tangled into a loose knot from a hit, a few bulbs flickering out, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a loose dark coil of garland lying on the ground, lights off, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: slithering forward in an S-curve, bulbs bobbing, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 28. `nm_teller` — Торговец-сказитель
Файлы: `assets/battle/units/nm_teller_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a stout night-market storyteller merchant with a pointed beard, a coin sash and a heavy coin-purse in hand, standing in a ready stance, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm muted palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: bonking forward with the heavy coin-purse swung like a club, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: stumbling back, coins spilling from the sash, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: sitting on the ground rubbing his head, coin-purse spilled beside him, defeated, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: bustling mid-step forward, coin-purse swinging, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 29. `nm_boss_keeper` — Хозяин ночного рынка (БОСС)
Файлы: `assets/battle/units/nm_boss_keeper_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a tall showman spirit of the night market wearing a striped tent-cape and a top hat with a candle on it, a silver cane in hand, imposing and larger, filling the frame, floating in a theatrical ready stance, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm festive palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a grand ringmaster swipe with the silver cane, sparks and tickets flying, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: reeling back, top hat knocked crooked, cape wrapping, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: collapsed into a folded striped tent-heap with the top hat resting on top, candle out, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: gliding forward theatrically, cape billowing, cane tapping the air, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

---

## Сказочные топи (30–36)

### 30. `sw_frog_guardian` — Лягушка-хранительница
Файлы: `assets/battle/units/sw_frog_guardian_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a large solemn guardian frog with a lily-pad cape and a reed spear held upright, sitting in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm green palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a huge leaping lunge with the reed spear thrust forward, tongue lashing, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: knocked back onto her rear, throat puffed, spear dipped, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: sitting slumped with eyes closed, lily-pad cape over her head, spear resting alongside, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: mid-hop forward, legs tucked, spear held level, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 31. `sw_bog_spirit` — Болотный дух
Файлы: `assets/battle/units/sw_bog_spirit_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a misty bog spirit of swirling pale-green fog with duckweed on its shoulders and two calm glowing eyes, floating in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, muted green palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: exhaling a rolling wave of chilling mist forward, arms spread, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: blown half-apart by a hit, fog swirling thin, eyes wide, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: settled into a low thin ground-fog with dim eyes closing, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: drifting forward with fog trailing in soft curls, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 32. `sw_witch_cat` — Ведьмин кот
Файлы: `assets/battle/units/sw_witch_cat_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a sleek black witch cat with a tiny crooked pointed hat and a curled tail, green eyes narrowed, crouched in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, muted palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a lightning-fast paw swipe, back arched, tail high, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: skidding back on all fours, fur puffed, hat sliding over one eye, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: curled into a tight black ball, hat resting on top, looking fast asleep, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: slinking mid-step forward, belly low, tail curled, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 33. `sw_doll_trickster` — Кукла-обманщица
Файлы: `assets/battle/units/sw_doll_trickster_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a painted wooden matryoshka trickster doll with a sly smile and rosy cheeks, a slightly open seam at the waist hinting at smaller dolls inside, standing in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm folk palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: popping open at the waist, a smaller doll springing out fists-first, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: rocked back with the lid rattling loose, painted smile tilted, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: tipped over and open, all the smaller dolls spilled out in a row, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: waddling mid-step forward, wooden base rocking, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 34. `sw_glow_bush` — Светоягодник
Файлы: `assets/battle/units/sw_glow_bush_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a walking berry bush creature with branches for arms, glowing blue berries all over and two shy eyes among the leaves, standing in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, muted green palette with glowing blue accents, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: shaking hard and flinging a burst of glowing berries forward, leaves flying, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: bent sideways from a hit, a few berries dropping, leaves trembling, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a motionless ordinary berry bush with dimmed berries, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: shuffling forward on root-feet, berries bobbing, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 35. `sw_hut_walker` — Избушка-прохожая
Файлы: `assets/battle/units/sw_hut_walker_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a tiny walking hut on two chicken legs with glowing windows for eyes and a crooked chimney, standing in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm wooden palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: rearing up and stomping forward with both chicken legs, door swinging open, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: tilted sideways on wobbling legs, a shutter knocked loose, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: settled down as an ordinary still hut, legs tucked underneath, windows dark, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: mid-step on one chicken leg, hut tilting forward, smoke puffing from the chimney, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 36. `sw_hag_queen` — Хозяйка Топей (БОСС)
Файлы: `assets/battle/units/sw_hag_queen_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a majestic bog witch queen with a crown of water-lilies, a cloak of reeds and a gnarled bog-staff topped with a glowing marsh light, imposing and larger, filling the frame, standing in a regal ready stance, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, muted green-and-gold palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a sweeping strike with the bog-staff, marsh light flaring, reed cloak billowing, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: staggered back, crown slipping, staff dipped, marsh light flickering, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: kneeling low, cloak pooled around her, crown resting beside her, staff laid down, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: striding a slow regal step forward, reed cloak swaying, staff tapping, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

---

## Звёздная ярмарка (37–43)

### 37. `sf_spirit` — Дух ярмарки
Файлы: `assets/battle/units/sf_spirit_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a tiny glowing fairground spark spirit shaped like a small warm star with stubby arms and a curious face, floating in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm golden palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: bursting into a shower of sparks thrown forward, arms flung wide, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: flickering and spinning from a hit, glow sputtering, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a dim little star lying on the ground, glow faded to embers, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: bobbing forward leaving a short spark trail, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 38. `sf_steed` — Карусельный конёк
Файлы: `assets/battle/units/sf_steed_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a painted carousel horse come alive with a gilded saddle, a brass pole stub on its back and a flowing painted mane, standing in a lively ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm festive palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: rearing and kicking forward with painted hooves, mane flying, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: stumbling sideways with paint chipping off one flank, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: lying on its side like a wooden toy, legs folded, paint calm, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a bouncy carousel gait mid-step, one hoof raised high, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 39. `sf_guard` — Страж порядка
Файлы: `assets/battle/units/sf_guard_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a wooden toy-soldier fairground guard with a tall painted shako, a wind-up key on his back and a toy rifle with a blunt bayonet, standing at attention in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm toy palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a crisp marching bayonet lunge, wind-up key spinning, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: knocked stiffly backward, shako tilted, key rattling, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: tipped over like a toy, lying straight as a plank, key stopped, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a stiff toy-soldier march mid-step, one leg straight up, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 40. `sf_firefly` — Огненный жонглёр
Файлы: `assets/battle/units/sf_firefly_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a small impish fire juggler with soot-smudged cheeks, a patched jester collar and three little flame torches floating around him, standing in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm ember palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: tossing a flaming torch in a high arc forward, other torches mid-juggle, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: stumbling back, torches dropping around him, collar singed, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: sitting on the ground with torches extinguished around him, rubbing his head, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a jaunty mid-step forward, torches orbiting, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 41. `sf_doll` — Кукла-зазывала
Файлы: `assets/battle/units/sf_doll_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a porcelain barker doll with a painted grin, rosy cheeks, a tiny striped megaphone in hand and a frilly fairground dress, standing in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm festive palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a spinning slap with porcelain hands, megaphone swinging wide, dress flaring, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: wobbling back with a hairline crack on one cheek, grin askew, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: sitting propped like a doll on a shelf, megaphone in her lap, eyes closed, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a stiff doll waddle mid-step, megaphone raised, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 42. `sf_wheel` — Ожившее колесо
Файлы: `assets/battle/units/sf_wheel_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a small living ferris-wheel ring with gondola cabins hanging around its rim and two warm eyes glowing between the spokes, balanced upright in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm festive palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: rolling forward fast and ramming, gondolas swinging wildly, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: wobbling in place from a hit, one gondola dangling loose, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: toppled over lying flat on the ground, gondolas still, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: rolling forward slowly, spokes turning, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 43. `sf_boss` — Чемпион миров (БОСС)
Файлы: `assets/battle/units/sf_boss_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a tall proud fairground champion in a striped strongman leotard with a trophy-star chestplate, a curled moustache and a heavy ceremonial sword, imposing and larger, filling the frame, standing in a confident ready stance, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm festive palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a champion's overhead sword slam, star chestplate flaring, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: staggered back a step, moustache drooping, sword dipped, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: sitting on the ground with the sword across his knees, star dimmed, gracious in defeat, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a proud parade mid-step forward, sword on shoulder, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

---

## Пепельные степи (44–50)

### 44. `ash_wolf` — Пепельный волк
Файлы: `assets/battle/units/ash_wolf_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, an ash-grey wolf with sooty fur, ember-orange eyes and faint glowing cracks along its back, crouched in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, muted grey palette with ember accents, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a snarling lunging bite, body stretched in mid-leap, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: skidding back on all fours, fur puffed, embers sputtering, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: lying on its side like a sleeping dog, ember cracks dimmed, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a low prowling mid-step, head low, tail level, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 45. `ash_shaman` — Кочевой шаман огня
Файлы: `assets/battle/units/ash_shaman_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a nomad fire shaman in layered steppe robes with feather charms and a wooden mask, holding an ember-tipped staff, standing in a ready stance, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm ochre palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: sweeping the ember staff in an arc, scattering sparks and feathers, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: reeling back, mask tilted, charms scattering, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: sitting cross-legged on the ground, staff across his knees, mask resting beside, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a measured mid-step forward, robes swaying, staff tapping, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 46. `ash_storm_spirit` — Дух пепельной бури
Файлы: `assets/battle/units/ash_storm_spirit_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a small swirling ash-storm spirit shaped like a grey tornado with ember sparks inside and two bright eyes, hovering in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, muted grey palette with ember accents, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: spinning into a fast ash funnel lunge forward, sparks flying, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: blown ragged by a hit, funnel wobbling thin, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: settled into a small still pile of ash with dim eyes, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: spinning forward with an ash trail, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 47. `ash_scorpion` — Обугленный скорпион
Файлы: `assets/battle/units/ash_scorpion_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a charred black scorpion with glowing orange cracks between its armor plates and a raised stinger tail, crouched in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, muted black palette with ember accents, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a quick stinger strike arcing over the head, claws snapping, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: flipped half onto its side, legs flailing, stinger drooping, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: lying still with legs curled and tail slack, cracks dimmed, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: scuttling mid-step forward, tail curled high, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 48. `ash_vulture` — Пепельный стервятник
Файлы: `assets/battle/units/ash_vulture_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a scruffy ash vulture with sooty feathers, a hunched neck and keen amber eyes, wings half-folded in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, muted grey palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a diving talon swoop with wings flared wide, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: knocked into a clumsy flutter, feathers flying, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: hunched on the ground with wings folded like a cloak, head tucked, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a waddling hop-step forward, wings half-open, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 49. `ash_ghoul` — Тень караванщика
Файлы: `assets/battle/units/ash_ghoul_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, the translucent ghost of a caravan trader in dusty robes with a spectral pack on his back and sad glowing eyes, floating in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, muted cool palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a chilling reach forward with both translucent hands, wisps trailing, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: flickering thin from a hit, pack slipping through him, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a low mist shaped like a sleeping traveler with the pack resting beside, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: drifting forward wearily, robes trailing, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 50. `ash_khan` — Хан пепельных бурь (БОСС)
Файлы: `assets/battle/units/ash_khan_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a mighty steppe khan warrior in soot-dark lamellar armor with an ember banner on his back and a heavy curved ember-blade, imposing and larger, filling the frame, standing in a commanding ready stance, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, muted charcoal palette with ember accents, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a mighty two-handed ember-blade swing, banner snapping, sparks flying, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: forced half a step back, banner drooping, armor cracks glowing, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: on one knee with the blade planted before him, banner fallen across his shoulders, head bowed, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a heavy deliberate mid-step forward, banner swaying, blade low, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

---

## Хрустальные горы (51–57)

### 51. `cr_owl` — Снежная сова
Файлы: `assets/battle/units/cr_owl_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a snowy owl with crystal-tipped wing feathers and calm round eyes, wings half-open in a ready hover, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, cool white-and-teal palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a silent diving talon strike, wings swept back, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: knocked into a fluttering spin, a crystal feather falling, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: sitting on the ground with wings wrapped like a shawl, eyes closed, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: gliding forward low, wings spread wide, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 52. `cr_shardling` — Кристальный осколок
Файлы: `assets/battle/units/cr_shardling_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a small living crystal shard creature, a floating pointed quartz gem with tiny crystal arms and a curious face in its facets, hovering in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, cool teal palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: spinning like a thrown shard, point forward, light streaking, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: chipped and wobbling in the air, small fragments falling, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: resting on the ground like an ordinary dull crystal, facets dim, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: bobbing forward with a gentle spin, light glinting, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 53. `cr_icewisp` — Искра звенящего льда
Файлы: `assets/battle/units/cr_icewisp_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a floating ice wisp shaped like a delicate ringing snowflake spark with a soft glow and tiny ice crystals orbiting it, hovering in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, cool icy palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: bursting into a ring of ringing ice shards flying forward, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: flickering and melting at the edges from a hit, glow wavering, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a small still snowflake resting on the ground, glow faded, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: drifting forward with orbiting crystals trailing, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 54. `cr_echo` — Горный эхо-дух
Файлы: `assets/battle/units/cr_echo_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a translucent mountain echo spirit shaped like a small figure made of concentric sound-wave rings, a soft hum glow, floating in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, cool misty palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: emitting a visible sound-wave punch, rings rippling forward, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: rings scattering unevenly from a hit, form wavering, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: faded to a single faint ring resting on the ground, silent, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: drifting forward with rings pulsing gently, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 55. `cr_golem` — Кристальный голем
Файлы: `assets/battle/units/cr_golem_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a sturdy golem of fused quartz crystal blocks with glowing seams and small crystal horns, standing heavy in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, cool teal palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a heavy crystal fist slam, seams flaring bright, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: rocked back, a new crack across one block, glitter dust falling, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: settled into a motionless cluster of dull crystals, seams dark, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a slow stomping mid-step, one crystal foot raised, glinting, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 56. `cr_dragon_young` — Молодой кварцевый дракон
Файлы: `assets/battle/units/cr_dragon_young_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a young quartz dragon with translucent crystal horns and wing edges, a chunky curious body and a short tail, crouched in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, cool teal palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a snapping bite with crystal teeth, wings flared for balance, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: skidding back on all fours, wings folded tight, a chip off one horn, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: curled up asleep-like with tail over nose, crystals dimmed, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: an eager bounding mid-step, wings half-open, tail up, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 57. `cr_dragon_ancient` — Древний дракон кварца (БОСС)
Файлы: `assets/battle/units/cr_dragon_ancient_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, an ancient quartz dragon with a crown of huge crystals, a long elegant body, faceted wings and a heavy crystal tail, imposing and larger, filling the frame, rearing in a regal ready stance, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, cool teal-and-silver palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a sweeping crystal tail smash, facets flaring, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: recoiling with wings shielding its body, a crack across one facet, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: lying in a majestic coil, wings folded, crystal crown resting on the ground, glow dimmed, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a slow majestic stride mid-step, tail swaying, crystals chiming, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

---

## Нефритовый сад (58–63)

### 58. `jade_warrior` — Бумажный воин
Файлы: `assets/battle/units/jade_warrior_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, an origami paper warrior with folded armor plates, a paper spear and an ink-drawn stern face, standing in a ready stance, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, muted jade palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a folded-paper spear thrust, body unfolding into the lunge, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: half-crumpled from a hit, one fold bent back, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: flattened into a quiet stack of folded paper with the spear resting on top, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a crisp folded mid-step forward, spear levelled, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 59. `jade_crane` — Нефритовый журавль
Файлы: `assets/battle/units/jade_crane_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, an elegant jade-green crane with a slender crest, long legs and folded wings, standing tall in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, muted jade palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a precise beak strike in a graceful arc, wings swept open, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: stumbling on one leg, crest ruffled, wings flailing, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: sitting with legs tucked and head resting on folded wings, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a high delicate mid-step, one leg raised, neck curved, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 60. `jade_lantern` — Фонарь на воде
Файлы: `assets/battle/units/jade_lantern_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a floating paper garden lantern with a warm glow, a painted plum-blossom pattern and a small water ripple beneath it, hovering in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, muted jade palette with warm glow, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: spitting a ribbon of warm flame, lantern tilted forward, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: dented and spinning from a hit, glow guttering, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a dark folded paper lantern lying flat, ripple stilled, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: drifting forward with the ripple gliding beneath, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 61. `jade_kitsune` — Садовая кицунэ
Файлы: `assets/battle/units/jade_kitsune_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a graceful garden kitsune fox spirit with two flowing tails, jade-green eyes and a small blossom behind one ear, crouched in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm cream-and-jade palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a darting double-tail swipe, body twisted mid-leap, petals swirling, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: skidding back on all fours, tails puffed, blossom falling, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: curled up with both tails wrapped around, eyes closed, blossom resting on her head, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a light trotting mid-step, tails streaming, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 62. `jade_teamaster` — Чайный мастер-дух
Файлы: `assets/battle/units/jade_teamaster_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a serene tea-master spirit in a robe of layered tea leaves, holding a bamboo whisk, a faint steam halo around him, floating slightly in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, muted jade palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: flicking a splash of scalding glowing tea from the whisk, robe swirling, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: swaying back with tea leaves scattering, steam halo broken, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: sitting in quiet meditation on the ground, whisk resting in his lap, steam gone, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: gliding forward serenely, robe trailing, steam curling, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 63. `jade_boss` — Дракон-хранитель сада (БОСС)
Файлы: `assets/battle/units/jade_boss_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a long jade serpent-dragon guardian of the garden with whiskers, small antlers, plum-blossom markings and a coiled elegant body, imposing and larger, filling the frame, rearing in a ready stance, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, muted jade palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a coiling lunge with jaws open, petals swirling in the wake, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: recoiling in a tight coil, whiskers bristling, a blossom marking flaked off, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: resting in a calm long coil along the ground, eyes closed, petals settling on his back, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: slithering forward in an elegant S-curve, antlers high, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

---

## Подводный грот (64–70)

### 64. `deep_siren` — Русалка-певунья
Файлы: `assets/battle/units/deep_siren_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a gentle mermaid singer with a teal tail, seaweed hair and a small shell harp in her hands, floating upright in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, muted teal palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a sweeping harp-strum sending a glowing sound wave forward, hair drifting, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: tumbling backward with arms shielding her face, harp slipping, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: resting curled on the ground like on a seabed, harp hugged close, eyes closed, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: swimming forward with a graceful tail stroke, bubbles trailing, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 65. `deep_pearl_guard` — Жемчужный страж
Файлы: `assets/battle/units/deep_pearl_guard_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, an oyster knight standing upright on a small foot, heavy shell halves like a shield and a helmet, a glowing pearl core inside, standing in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, muted teal palette with pearl glow, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: clamping forward with a heavy shell snap, pearl flaring, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: rocked back with shell halves rattling, pearl flickering, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a closed ordinary oyster lying still, pearl glow hidden inside, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a slow hopping mid-step on its foot, shell bouncing, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 66. `deep_shadow` — Глубоководная тень
Файлы: `assets/battle/units/deep_shadow_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a dark eel-like deep-water shadow creature, a long flowing silhouette with two pale glowing eyes, coiled in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, muted deep-blue palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: an eel-like darting bite, body whipping forward, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: torn into ragged wisps from a hit, reforming, eyes blinking, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a still dark ribbon lying flat on the ground, eyes closed, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: undulating forward in a flowing S-motion, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 67. `deep_coral_golem` — Коралловый голем
Файлы: `assets/battle/units/deep_coral_golem_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a sturdy golem of pink coral branches with barnacle knuckles and small anemones on its shoulders, standing heavy in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, muted coral palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a coral-branch overhead smash, anemones flaring, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: rocked back, a small branch snapping off, bubbles rising, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a motionless coral outcrop on the ground, anemones closed, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a slow stomping mid-step, one coral foot raised, bubbles puffing, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 68. `deep_current_spirit` — Дух течения
Файлы: `assets/battle/units/deep_current_spirit_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a swirling water current spirit shaped like a small translucent vortex with a calm face and floating droplets around, hovering in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, muted teal palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a spiraling water-jet lunge forward, droplets spraying, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: splashed half-apart from a hit, vortex wobbling, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a small still puddle with a faint swirl, droplets settled, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: flowing forward in a swirling glide, droplets trailing, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 69. `deep_light_bubble` — Пузырёк света
Файлы: `assets/battle/units/deep_light_bubble_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a glowing bubble creature with a tiny happy fish inside, a shimmering membrane and small sparkles, floating in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, muted teal palette with warm glow, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: popping a bright flash burst forward, membrane stretched, fish braced, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: squished oval and wobbling from a hit, fish dizzy, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: half-deflated resting on the ground, fish curled asleep inside, glow dimmed, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: bobbing forward with the fish paddling inside, sparkles trailing, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 70. `deep_boss_queen` — Владычица грота (БОСС)
Файлы: `assets/battle/units/deep_boss_queen_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a majestic sea queen of the grotto with a coral crown, a flowing kelp robe and a pearl scepter, a calm stern face, imposing and larger, filling the frame, floating in a regal ready stance, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, muted teal palette with pearl accents, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a regal sweep of the pearl scepter, a small wave rising beside her, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: swaying back, crown tilted, kelp robe tangled, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: seated on the ground like on a throne, scepter laid across her knees, crown in her hands, dignified, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: gliding forward with the kelp robe flowing, scepter raised, bubbles trailing, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

---

## Туманные часы (71–77)

### 71. `mist_clock_spirit` — Часовой дух
Файлы: `assets/battle/units/mist_clock_spirit_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a floating antique clock-face spirit with brass hands like arms, a calm face on the dial and mist curling from its edges, hovering in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, muted brass palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a slashing strike with its clock hands spun like blades, mist swirling, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: tilted with the glass cracked and hands spinning loose, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: lying face-up on the ground like a dropped pocket watch, hands stopped, mist gone, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: bobbing forward with a gentle tick-sway, mist trailing, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 72. `mist_rust_automaton` — Ржавый автоматон
Файлы: `assets/battle/units/mist_rust_automaton_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a rusty wind-up automaton soldier with a round riveted body, a key on its back and a dented dome head with one glowing eye, standing stiffly in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, muted rust palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a stiff piston punch forward with winding clanks and a steam puff, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: jolted backward with a rivet popping off, key spinning wildly, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: slumped sitting with head bowed, key stopped, eye dark, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a stiff mechanical mid-step, one leg raised, key turning, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 73. `mist_echo_keeper` — Эхо лавочника
Файлы: `assets/battle/units/mist_echo_keeper_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, the translucent echo of a kindly shopkeeper in an apron, holding a small candle with a warm flame, soft blurred edges, floating in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, muted misty palette with warm candle glow, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: swinging the candle forward, warm wax-sparks flying, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: flickering thin from a hit, candle flame guttering, apron edges blurring, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a faint kneeling silhouette with the candle set down and gently burning out, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: drifting forward thoughtfully, candle held ahead like a lantern, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 74. `mist_sand_wisp` — Песчаный огонёк
Файлы: `assets/battle/units/mist_sand_wisp_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a floating wisp of golden hourglass sand, a swirling little spark with two warm eyes and sand grains orbiting it, hovering in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, warm sandy palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: bursting into a stinging sand swirl thrown forward, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: scattered into loose sand grains from a hit, reforming, eyes dizzy, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a small neat pile of hourglass sand on the ground, glow faded, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: drifting forward with sand grains spiralling behind, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 75. `mist_cog_hound` — Шестерённая гончая
Файлы: `assets/battle/units/mist_cog_hound_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a clockwork hound built of brass gears, springs and riveted plates, a small winding tail and keen glowing eyes, crouched in a ready pose, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, muted brass palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a spring-loaded pounce, gears whirring, jaws of brass open, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: skidding back with a gear popping loose, springs sproinging, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: lying on its side like a switched-off toy, legs tucked, eyes dark, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a trotting mechanical mid-step, gears visibly turning, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 76. `mist_time_warden` — Хранитель времени
Файлы: `assets/battle/units/mist_time_warden_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a robed keeper of time with a hood full of soft mist, holding a great brass key like a staff, faint clock rings orbiting him, floating in a ready stance, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, muted brass-and-mist palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a heavy strike with the great key staff, clock rings rippling, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: swaying back, hood slipping, clock rings stuttering, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: kneeling with the key staff planted, hood bowed, rings stopped and resting around him, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: gliding forward slowly, robe trailing, key staff tapping the air, side view, full body, facing right, plain solid white background, no text --ar 1:1
```

### 77. `mist_boss` — Само Время (БОСС)
Файлы: `assets/battle/units/mist_boss_{idle,atk,hurt,down,walk}_web.png`

**А. Стойка:**
```
Cozy storybook watercolor battle sprite for a fantasy shop game, a towering hooded figure of flowing hourglass sand and orbiting clock rings, a faint galaxy of sand grains where the face should be, imposing and larger, filling the frame, floating in an inevitable calm stance, side view, full body, facing right, bold readable silhouette, soft dark warm-brown ink outlines, muted sand-and-brass palette, plain solid white background, no drop shadow, no text, no watermark --ar 1:1
```
**Б. Атака:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: a slow inevitable sweep of a sand-blade hand, clock rings contracting, dynamic action, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**В. Урон:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: its sand flow stuttering and thinning from a hit, rings wobbling, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
**Г. Падение:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: gently collapsing into a calm dune of sand with the clock rings resting on top like a wreath, side view, full body, plain solid white background, no text --ar 1:1
```
**Д. Шаг:**
```
Same character as the reference image, identical design, colors and cozy watercolor style, new pose: flowing forward like a slow sand tide, rings orbiting steadily, side view, full body, facing right, plain solid white background, no text --ar 1:1
```
