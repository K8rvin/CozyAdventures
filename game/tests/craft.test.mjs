import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  newGame, craft, canCraft, recipeList, runBattle,
} from '../src/core/state.js';
import { RECIPES } from '../src/data/recipes.js';
import { ITEM_BY_ID } from '../src/data/items.js';
import { MATERIALS, MATERIAL_BY_ID, materialLabel } from '../src/data/materials.js';

test('все рецепты ссылаются на существующие предметы и материалы', () => {
  for (const r of RECIPES) {
    assert.ok(ITEM_BY_ID[r.result.itemId], `${r.id}: нет предмета ${r.result.itemId}`);
    for (const matId of Object.keys(r.materials)) {
      assert.ok(MATERIAL_BY_ID[matId], `${r.id}: нет материала ${matId}`);
    }
  }
});

test('у всех материалов русские имена и иконки', () => {
  for (const m of MATERIALS) {
    assert.ok(/[А-Яа-яЁё]/.test(m.name), `${m.id}: имя не русское`);
    assert.ok(m.icon && m.description);
  }
  assert.equal(materialLabel('slime_jelly'), '🟢 Слизь лужайника');
});

test('крафт требует материалы и списывает их', () => {
  const s = newGame();
  s.battlesDone.bt_bees = { victories: 1 };
  assert.equal(canCraft(s, 'rcp_pot_heal').ok, false, 'без материалов нельзя');
  s.materials = { slime_jelly: 3, honey: 2 };
  assert.equal(canCraft(s, 'rcp_pot_heal').ok, true);
  const r = craft(s, 'rcp_pot_heal');
  assert.ok(r.ok);
  assert.deepEqual(s.materials, { slime_jelly: 1, honey: 1 });
  assert.ok(s.inventory.includes('pot_heal'));
});

test('рецепт недоступен до нужного боя', () => {
  const s = newGame();
  s.materials = { slime_jelly: 5, honey: 5 };
  assert.equal(canCraft(s, 'rcp_pot_heal').ok, false, 'без bt_bees рецепт закрыт');
  assert.ok(!recipeList(s).some((r) => r.id === 'rcp_pot_heal'));
  s.battlesDone.bt_bees = { victories: 1 };
  assert.ok(recipeList(s).some((r) => r.id === 'rcp_pot_heal'));
});

test('крафт за монеты списывает монеты', () => {
  const s = newGame();
  s.coins = 200;
  s.battlesDone.bt_golem = { victories: 1 };
  s.materials = { moss_stone: 2, brick_chunk: 2, torn_cloth: 1 };
  const r = craft(s, 'rcp_shd_guardian');
  assert.ok(r.ok);
  assert.equal(s.coins, 200 - 80);
  assert.ok(s.inventory.includes('shd_guardian'));
  // Повторно — не хватает материалов
  assert.equal(craft(s, 'rcp_shd_guardian').ok, false);
});

test('материалы реально добываются в боях', () => {
  const s = newGame();
  const r = runBattle(s, 'bt_slimes', 1);
  assert.ok(r.victory);
  assert.ok((s.materials.slime_jelly || 0) >= 1, 'слизень должен оставить слизь');
});

test('ездовой питомец удваивает материалы', () => {
  const s = newGame();
  s.pet = 'pet_horse';
  const r = runBattle(s, 'bt_slimes', 1);
  assert.ok(r.victory);
  const drops = r.rewards.filter((x) => x.type === 'material');
  assert.ok(drops.every((x) => x.amount === 2), 'с Сивкой материалов ×2');
});
