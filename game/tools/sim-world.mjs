// Проверка баланса мира: прогоняет всю цепочку боёв мира в режиме «сбор»
// с типовым эндгейм-билдом. Каждый бой должен побеждаться хотя бы в N% попыток.
// Запуск: node tools/sim-world.mjs <worldId> [minWinrate%]
import { WORLDS } from '../src/data/worlds/index.js';
import { newGame, runBattle } from '../src/core/state.js';
import { BATTLE_BY_ID } from '../src/data/battles.js';

const worldId = process.argv[2];
const minWinrate = Number(process.argv[3] || 60);
const SEEDS = 24;

const world = WORLDS.find((w) => w.id === worldId);
if (!world) {
  console.error('Мир не найден:', worldId, 'доступны:', WORLDS.map((w) => w.id).join(', '));
  process.exit(1);
}

// Типовой эндгейм-билд: топовая экипировка трёх ярусов + полный отряд.
function endgameState() {
  const s = newGame();
  s.coins = 99999;
  s.seals = 99;
  // Разблокируем все бои, чтобы runBattle работал по цепочке мира
  for (const id of Object.keys(BATTLE_BY_ID)) s.battlesDone[id] = { victories: 0 };
  const gear = [
    'wpn_firebird_quill', 'shd_tower', 'hlm_page_wanderer', 'arm_ink_cloak',
    'glv_smithee', 'bt_quiet_step', 'amu_pages', 'rng_duelist', 'rng_contents',
  ];
  s.equipped = {
    weapon: 'wpn_firebird_quill', shield: 'shd_tower', helmet: 'hlm_page_wanderer',
    armor: 'arm_ink_cloak', gloves: 'glv_smithee', boots: 'bt_quiet_step',
    amulet: 'amu_pages', ring1: 'rng_duelist', ring2: 'rng_contents',
  };
  s.consumableBelt = ['pot_heal', 'pot_vigor'];
  s.crew = ['cmp_herbalist', 'cmp_cat', 'cmp_smith', 'merc_archer', 'merc_witch', 'pet_fox'];
  s.squadCompanions = ['cmp_herbalist', 'cmp_cat', 'cmp_smith'];
  s.squadMercs = ['merc_archer', 'merc_witch'];
  s.pet = 'pet_fox';
  s.formation = { knight: 1, merc0: 5, merc1: 4 };
  return s;
}

let failed = 0;
for (const b of world.battles) {
  let wins = 0;
  for (let seed = 1; seed <= SEEDS; seed++) {
    const s = endgameState();
    const r = runBattle(s, b.id, seed);
    if (r?.victory) wins++;
  }
  const wr = Math.round((wins / SEEDS) * 100);
  const ok = wr >= minWinrate;
  if (!ok) failed++;
  console.log(`${ok ? 'OK  ' : 'СЛАБ'} ${b.id.padEnd(12)} ${b.name.padEnd(24)} винрейт ${wr}%`);
}
console.log(failed === 0
  ? `=== МИР ${worldId}: БАЛАНС OK (минимум ${minWinrate}%) ===`
  : `=== МИР ${worldId}: ${failed} боёв ниже порога ${minWinrate}% — понизь scale или статусы ===`);
process.exit(failed === 0 ? 0 : 1);
