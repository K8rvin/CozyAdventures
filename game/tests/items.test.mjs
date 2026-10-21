import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ITEMS, ITEM_BY_ID } from '../src/data/items.js';
import { SHOP_STOCK } from '../src/data/shop.js';
import {
  emptyEquipment, equip, unequip, collectStats, isShieldBlocked, KNIGHT_BASE, SLOTS, describeItem,
  knightArtId,
} from '../src/core/items.js';

test('арт рыцаря в бою выбирается по типу оружия', () => {
  const eq = emptyEquipment();
  assert.equal(knightArtId(eq), 'knight', 'пустой слот — базовый набор');
  eq.weapon = 'wpn_rusty_sword';
  assert.equal(knightArtId(eq), 'knight', 'меч — базовый набор');
  eq.weapon = 'wpn_oak_mace';
  assert.equal(knightArtId(eq), 'knight', 'одноручная булава — базовый набор');
  eq.weapon = 'wpn_dagger_firefly';
  assert.equal(knightArtId(eq), 'knight', 'кинжал — базовый набор');
  eq.weapon = 'wpn_greatsword_oak';
  assert.equal(knightArtId(eq), 'knight_twohanded', 'двуручный меч — свой набор');
  eq.weapon = 'wpn_lumberaxe';
  assert.equal(knightArtId(eq), 'knight_twohanded', 'двуручный топор — свой набор');
  eq.weapon = 'wpn_hunter_bow';
  assert.equal(knightArtId(eq), 'knight_bow', 'лук — свой набор');
  eq.weapon = 'wpn_candle_staff';
  assert.equal(knightArtId(eq), 'knight_staff', 'посох — свой набор');
  eq.weapon = 'no_such_item';
  assert.equal(knightArtId(eq), 'knight', 'битый id — тихий откат на базовый набор');
});

test('у всех предметов уникальный id и корректный слот', () => {
  const ids = new Set();
  const validSlots = [...SLOTS, 'ring', 'consumable'];
  for (const item of ITEMS) {
    assert.ok(!ids.has(item.id), `дубль id ${item.id}`);
    ids.add(item.id);
    assert.ok(validSlots.includes(item.slot), `${item.id}: слот ${item.slot}`);
  }
});

test('двуручное оружие блокирует щит и снимает надетый', () => {
  const eq = emptyEquipment();
  assert.ok(equip(eq, 'wpn_rusty_sword').ok);
  assert.ok(equip(eq, 'shd_wooden').ok);
  assert.equal(isShieldBlocked(eq), false);
  const r = equip(eq, 'wpn_greatsword_oak');
  assert.ok(r.ok);
  assert.equal(isShieldBlocked(eq), true);
  assert.equal(eq.shield, null, 'щит должен сняться');
  assert.ok(r.swappedOff.includes('shd_wooden'));
  // Пока двуручник надет, щит не надевается
  const r2 = equip(eq, 'shd_wooden');
  assert.equal(r2.ok, false);
  // Сняли двуручник — можно снова
  unequip(eq, 'weapon');
  assert.ok(equip(eq, 'shd_wooden').ok);
});

test('лук считается двуручным', () => {
  const eq = emptyEquipment();
  equip(eq, 'wpn_hunter_bow');
  assert.equal(isShieldBlocked(eq), true);
});

test('два кольца занимают разные слоты, третье вытесняет первое', () => {
  const eq = emptyEquipment();
  equip(eq, 'rng_luck');
  equip(eq, 'rng_health');
  assert.equal(eq.ring1, 'rng_luck');
  assert.equal(eq.ring2, 'rng_health');
  const r = equip(eq, 'rng_crit');
  assert.ok(r.ok);
  assert.equal(eq.ring1, 'rng_crit');
  assert.equal(eq.ring2, 'rng_health');
});

test('характеристики предметов суммируются с базой', () => {
  const eq = emptyEquipment();
  equip(eq, 'wpn_rusty_sword');   // +6 атаки
  equip(eq, 'arm_padded');        // +10 брони, +10 hp
  const { stats } = collectStats(eq);
  assert.equal(stats.attack, KNIGHT_BASE.attack + 6);
  assert.equal(stats.armor, KNIGHT_BASE.armor + 10);
  assert.equal(stats.hp, KNIGHT_BASE.hp + 10);
});

test('сопротивления предметов попадают в итоговые характеристики', () => {
  const eq = emptyEquipment();
  equip(eq, 'hlm_badger');
  const { stats } = collectStats(eq);
  const expected = ITEM_BY_ID.hlm_badger.stats.resist.sleep;
  assert.ok(Math.abs(stats.resist.sleep - expected) < 1e-9);
});

test('описания предметов строго на русском (без ключей данных)', () => {
  for (const item of ITEMS) {
    const text = describeItem(item);
    assert.ok(!/\b(sleep|poison|fire|slow|fear|attack|armor|speed|crit|dodge|block|hp)\b/i.test(text),
      `${item.id}: английский ключ в описании: ${text}`);
  }
});

test('сетовые эффекты: тиры 3/6/9 усиливаются', () => {
  const eq = emptyEquipment();
  // Сет «Дворник»: 3 вещи
  equip(eq, 'arm_chain');
  equip(eq, 'hlm_kettle');
  equip(eq, 'bt_cobble');
  let r = collectStats(eq);
  assert.equal(r.stats.armor, KNIGHT_BASE.armor + 22 + 8 + 8, 'тир 3: броня сета +8');
  assert.equal(r.activeSets.length, 1);
  // Добавляем до 6
  equip(eq, 'glv_smithee');
  equip(eq, 'rng_iron');
  equip(eq, 'wpn_iron_sword');
  r = collectStats(eq);
  assert.equal(r.stats.block, KNIGHT_BASE.block + 0.03 + 0.1, 'тир 6: блок меча 0.03 + сета +10%');
  assert.equal(r.stats.hp, KNIGHT_BASE.hp + 15 + 12 + 20, 'тир 6: здоровье +20');
  // До 9: ровно 9 town-предметов по всем слотам
  equip(eq, 'shd_tower');
  equip(eq, 'rng_duelist');
  equip(eq, 'amu_fearless');
  r = collectStats(eq);
  const townSet = r.activeSets.find((s2) => s2.set === 'town' && s2.tier === 9);
  assert.ok(townSet, 'тир 9 Дворника активен');
  assert.equal(townSet.count, 9, 'все 9 предметов сета Дворник надеты');
  assert.ok(r.traits.includes('first_hit_reduction'), 'тир 9: черта несокрушимости');
});

test('не-сетовые предметы не дают сетовых бонусов', () => {
  const eq = emptyEquipment();
  equip(eq, 'wpn_rusty_sword');
  equip(eq, 'arm_padded');
  const r = collectStats(eq);
  assert.equal(r.activeSets.length, 0);
});

test('сеты миров-сателлитов: у каждого ровно 9 предметов и все слоты', () => {
  for (const setKey of ['swamp', 'fair', 'ember']) {
    const pieces = ITEMS.filter((i) => i.set === setKey);
    assert.equal(pieces.length, 9, `сет ${setKey}: должно быть 9 предметов`);
    const slots = pieces.map((i) => i.slot);
    for (const need of ['weapon', 'shield', 'helmet', 'armor', 'gloves', 'boots', 'amulet']) {
      assert.ok(slots.includes(need), `сет ${setKey}: нет слота ${need}`);
    }
    assert.equal(slots.filter((s) => s === 'ring').length, 2, `сет ${setKey}: два кольца`);
  }
});

test('сет «Топь»: тиры 3/6/9 дают вампиризм и регенерацию', () => {
  const eq = emptyEquipment();
  // Без серпа: вампиризм — только от сетового тира 6, не от предметов
  equip(eq, 'shd_swamp_lily');
  equip(eq, 'hlm_swamp_wreath');
  equip(eq, 'glv_swamp_fern');
  let r = collectStats(eq);
  assert.ok(r.activeSets.some((s) => s.set === 'swamp' && s.tier === 3));
  assert.ok(!r.traits.includes('lifesteal_small'), 'до тира 6 вампиризма нет');
  equip(eq, 'arm_swamp_weave');
  equip(eq, 'bt_swamp_moss');
  equip(eq, 'amu_swamp_frog');
  r = collectStats(eq);
  assert.ok(r.traits.includes('lifesteal_small'), 'тир 6: вампиризм');
  assert.ok(r.traits.includes('bonus_spirit'), 'тир 6: бонус против духов');
  equip(eq, 'rng_swamp_thread');
  equip(eq, 'rng_swamp_glow');
  equip(eq, 'wpn_swamp_sickle');
  r = collectStats(eq);
  assert.ok(r.traits.includes('regen_ally'), 'тир 9: регенерация');
});

test('сет «Ярмарка»: экономика растёт по тирам', () => {
  const eq = emptyEquipment();
  equip(eq, 'wpn_fair_hammer');
  equip(eq, 'shd_fair_target');
  equip(eq, 'hlm_fair_jester');
  const r = collectStats(eq);
  assert.ok(Math.abs(r.stats.goldFind - 0.15) < 1e-9, 'тир 3: монеты +15% (предметы goldFind не дают)');
  assert.ok(Math.abs(r.stats.itemFind - 0.05) < 1e-9, 'itemFind только с колпака');
});

test('сет «Пепел»: тир 9 даёт пробитие', () => {
  const eq = emptyEquipment();
  for (const id of ['wpn_ember_scimitar', 'shd_ember_brazier', 'hlm_ember_khan', 'arm_ember_scalemail',
    'glv_ember_forge', 'bt_ember_storm', 'amu_ember_heart', 'rng_ember_coal', 'rng_ember_spark']) {
    assert.ok(equip(eq, id).ok, `надевается ${id}`);
  }
  const r = collectStats(eq);
  assert.ok(r.traits.includes('pierce'), 'тир 9: пробитие');
  assert.ok(r.stats.attack >= KNIGHT_BASE.attack + 32 + 8, 'тир 3: атака сета учтена');
});

test('крафтовые части новых сетов не продаются в лавках', () => {
  // цены 0 у крафтовых — в SHOP_STOCK их быть не должно
  const stockIds = new Set(SHOP_STOCK.map((s) => s.itemId));
  for (const id of ['shd_swamp_lily', 'hlm_swamp_wreath', 'amu_swamp_frog', 'rng_swamp_thread',
    'hlm_fair_jester', 'glv_fair_magician', 'bt_fair_dancer', 'rng_fair_star',
    'shd_ember_brazier', 'hlm_ember_khan', 'bt_ember_storm', 'amu_ember_heart']) {
    assert.ok(!stockIds.has(id), `${id} — только крафт`);
  }
});

test('зелья нельзя надеть в слот экипировки', () => {
  const eq = emptyEquipment();
  const r = equip(eq, 'pot_heal');
  assert.equal(r.ok, false);
});
