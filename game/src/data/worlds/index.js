// Реестр миров-контентпаков: каждый файл мира экспортирует
//   export const WORLD = {
//     id, label, enemies: [], materials: [], battles: [],
//   }
// Бои мира — линейная цепочка по unlockAfter, мир открывается после
// босса предыдущего мира (firstBattleUnlockAfter).
import { WORLD as nm } from './nm.js';
import { WORLD as sw } from './sw.js';
import { WORLD as sf } from './sf.js';
import { WORLD as cr } from './cr.js';
import { WORLD as ash } from './ash.js';
import { WORLD as jade } from './jade.js';
import { WORLD as deep } from './deep.js';
import { WORLD as mist } from './mist.js';

export const WORLDS = [nm, sw, sf, cr, ash, jade, deep, mist];

export const WORLD_BY_ID = Object.fromEntries(WORLDS.map((w) => [w.id, w]));
