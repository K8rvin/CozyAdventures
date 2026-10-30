# Остановленный эксперимент: стартовые предметы через item composite

Этот pipeline **не принят и остановлен**. Для новой работы использовать
`art-src/PROMPTS_KNIGHT_LAYERS.md` и `game/tools/prepare-knight-layer.py`:
изолированный предмет без тела, внешние маски и послойная регистрация.
Текст ниже сохранён только как история исходных композитов, не как инструкция к действию.

Для каждого предмета создаём по одному composite на тело:

```text
art-src/knight/composites/
  wpn_rusty_sword_male.jfif
  wpn_rusty_sword_female.jfif
  shd_wooden_male.jfif
  shd_wooden_female.jfif
  pot_heal_male.jfif
  pot_heal_female.jfif
```

Базовые референсы:

- `art-src/knight/doll/male/full.png`
- `art-src/knight/doll/female/full.png`
- `game/assets/items/wpn_rusty_sword_web.jpg`
- `game/assets/items/shd_wooden_web.jpg`
- `game/assets/items/pot_heal_web.jpg`

## Общая часть промта для всех предметов

```text
Reference 1 is the approved fixed full-body base template for BODY_ID. Reference 2 is the mandatory inventory icon for the exact item ITEM_ID. Create a full-frame 4:5 registration composite by changing only the item on Reference 1. Preserve exactly the same face, identity, hair, natural adult anatomy, calm non-combat three-quarter pose, hand positions, foot positions, camera, crop, character scale, warm light from the upper left and romantic storybook gouache rendering. Do not change the base underwear, do not add modern clothes, do not add any other equipment, no extra accessories beyond the carrying mount explicitly requested for this item, no extra weapons, no text, no letters, no numbers, no logo, no watermark, plain solid white background --ar 4:5
```

Затем добавляем конкретный предмет и физические ограничения из секций ниже.

## 1. `wpn_rusty_sword` — Дедов меч

Файл иконки: `game/assets/items/wpn_rusty_sword_web.jpg`.

```text
Equip the exact old but sharp knight's shortsword from Reference 2: a worn leather grip, a simple metal crossguard and a tiny dried lavender sprig tied to the pommel. The sword is held naturally in the closed right hand on image right. The hand wraps around the leather grip at the correct contact point, with no gap between palm and handle. The blade points downward and slightly toward image left, in a relaxed non-combat carry, with the tip below the waist. Use a believable shortsword length of roughly one third of the full character height, not a giant greatsword and not a dagger. Keep the blade, guard, grip and pommel fully visible and anatomically connected, no floating sword, no sword crossing the face or torso, no second weapon and no shield.
```

Проверка: рукоять находится **внутри кулака**, лезвие начинается ниже него,
не растёт из бедра или из воздуха.

## 2. `shd_wooden` — Щит из липы

Файл иконки: `game/assets/items/shd_wooden_web.jpg`.

```text
Equip the exact light round linden wood shield from Reference 2: warm honey wood grain, a simple iron boss and a faint child's charcoal drawing near the rim. Mount the shield on the relaxed left forearm on image left, with a visible handle or strap held by the left hand. The shield is a proper medium-sized round shield, with a diameter of roughly one quarter of the full character height and about two thirds of the torso height, not a tiny buckler and not a tower shield. Keep it beside the body without covering the face, chest or working right hand, no floating shield, no weapon and no second shield.
```

Проверка: щит держится за предплечье/кисть слева, не висит отдельно у бедра.
Размер читается как защитный щит, а не как медальон.

## 3. `pot_heal` — Зелье лечения

Файл иконки: `game/assets/items/pot_heal_web.jpg`.

```text
Add the exact round glass potion bottle from Reference 2: warm rose-red healing brew, a cork stopper, tiny heart-shaped bubbles inside the glass and subtle glass reflections. Add only one simple narrow cloth belt with one small pouch as the carrying mount for this bottle; no armor or other accessories. Place the closed bottle into the pouch at the waist, not into the hand. Use a small believable potion bottle size, approximately eight to ten percent of the full character height, with the cork and upper glass visible above the pouch edge, no floating bottle, no second bottle, no weapons and no shield.
```

Проверка: флакон находится в кармашке пояса, не в кулаке, не увеличен до вазы.

## 4. Обязательные правила для всех трёх предметов

- Делаем **отдельный composite на каждое тело**, а не один универсальный исходник.
- Не меняем базовое тело, лицо, причёску, позу или кисти ради предмета.
- Не добавляем другие предметы: если генерируем меч, щита нет; если щит, меча нет;
  если зелье, оружия нет.
- Не используем современную одежду, фотореализм, chibi или neon rarity recolor.
- Иконка остаётся только дизайн-референсом, не готовой маской и не готовым слоем.
- Перед записью в `parts/` обязателен preview: проверяем контакт кисти с оружием/щитом,
  размер предмета относительно тела и отсутствие фона.
- Runtime использует один unisex PNG на предмет. Сравниваем preview обоих тел и выбираем
  один совместимый слой; несовместимую посадку не маскируем сдвигом тела или кисти.

## 5. Вырезание и экспорт

Используем `game/tools/prepare-knight-item.py` с соответствующим слотом:

```bash
python tools/prepare-knight-item.py --body male --item wpn_rusty_sword --slot weapon --preview starter-male-sword.jpg
python tools/prepare-knight-item.py --body male --item shd_wooden --slot shield --preview starter-male-shield.jpg
python tools/prepare-knight-item.py --body male --item pot_heal --slot consumable --preview starter-male-potion.jpg
```

Для женского тела те же команды с `--body female`.

После приёмки добавляем `--apply` только к выбранной unisex-версии каждого предмета,
затем экспортируем:

```bash
node tools/build-knight-art.mjs room male_body male_hands female_body female_hands wpn_rusty_sword shd_wooden pot_heal
npm run build && npm test
```

`pot_heal__belt2` создаётся автоматически сдвигом, вторую генерацию для него не нужно делать.

Перед экспортом проверяем на обоих телах:

- меч в правой кисти, щит на левом предплечье;
- размер предмета соответствует телу, а не инвентарной иконке;
- кисть находится поверх рукояти;
- нет белого фона, ореола, лишних частей тела или отсутствующих частей предмета;
- нет второго оружия, второго щита или второй бутылки.
