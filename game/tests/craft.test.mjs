import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  newGame, craft, canCraft, recipeList, runBattle, shopStock,
} from '../src/core/state.js';
import { RECIPES } from '../src/data/recipes.js';
import { ITEM_BY_ID } from '../src/data/items.js';
import { MATERIALS, MATERIAL_BY_ID, materialLabel } from '../src/data/materials.js';
import { BATTLES, BATTLE_BY_ID } from '../src/data/battles.js';
import { battleEconomy } from '../src/core/economy.js';

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

test('крафт за монеты списывает монеты, результат уникален (не из лавки)', () => {
  const s = newGame();
  s.coins = 300;
  s.battlesDone.bt_golem = { victories: 1 };
  s.materials = { moss_stone: 2, brick_chunk: 2, torn_cloth: 1 };
  const r = craft(s, 'rcp_master_shield');
  assert.ok(r.ok);
  assert.equal(s.coins, 300 - 100);
  assert.ok(s.inventory.includes('shd_master'));
  // Повторно — не хватает материалов
  assert.equal(craft(s, 'rcp_master_shield').ok, false);
  // Крафтовый предмет не продаётся в лавках
  assert.ok(!shopStock(s).some((i) => i.id === 'shd_master'), 'сет Мастер только из крафта');
});

test('зелья крафтятся двойными порциями', () => {
  const s = newGame();
  s.battlesDone.bt_bees = { victories: 1 };
  s.materials = { slime_jelly: 4, honey: 2 };
  const before = s.inventory.filter((i) => i === 'pot_heal').length;
  const r = craft(s, 'rcp_pot_heal');
  assert.ok(r.ok);
  const after = s.inventory.filter((i) => i === 'pot_heal').length;
  assert.equal(after - before, 2, 'порций ровно две');
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

test('продажа крафтовой вещи не создаёт магазинную цену из ниоткуда', async () => {
  const { sellItem } = await import('../src/core/state.js');
  const s = newGame();
  s.inventory = ['shd_master'];
  const result = sellItem(s, 0);
  assert.equal(result.ok, true);
  assert.equal(result.price, 1, 'у крафтовой вещи price: 0 — продаётся за одну монету');
});

test('рецепты идут по progression unlockAfter, доступности и цене без смены canCraft', () => {
  const state = newGame();
  for (const battle of BATTLES) state.battlesDone[battle.id] = { victories: 1 };
  const recipes = recipeList(state);
  assert.equal(recipes[0].id, 'rcp_pot_heal', 'учебный рецепт остаётся первым открытым');
  const index = (id) => recipes.findIndex((recipe) => recipe.id === id);
  assert.ok(index('rcp_master_dagger') < index('rcp_master_shield'));
  assert.ok(index('rcp_master_shield') < index('rcp_master_amulet'));
  assert.ok(index('rcp_master_amulet') < index('rcp_master_gloves'),
    'исторический массив больше не ставит поздние открытия раньше ранних');

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    assert.equal(recipe.canCraft, canCraft(state, recipe.id).ok, `${recipe.id}: доступность не изменилась`);
    const progress = (entry) => ({
      tier: battleEconomy(BATTLE_BY_ID[entry.unlockAfter]).tier,
      order: BATTLES.findIndex((battle) => battle.id === entry.unlockAfter),
    });
    if (i > 0) {
      const previous = progress(recipes[i - 1]);
      const current = progress(recipe);
      assert.ok(previous.tier < current.tier
        || (previous.tier === current.tier && previous.order <= current.order),
      `${recipes[i - 1].id} → ${recipe.id}: порядок progression`);
    }
  }

  state.materials = { honey: 2, moth_dust: 1 };
  const sameUnlock = recipeList(state).filter((recipe) => recipe.unlockAfter === 'bt_moths');
  assert.equal(sameUnlock[0].id, 'rcp_master_ring', 'при равном unlockAfter доступный рецепт идёт раньше');
  assert.equal(sameUnlock[0].canCraft, canCraft(state, sameUnlock[0].id).ok);
});
