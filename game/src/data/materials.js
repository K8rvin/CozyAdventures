// Материалы: русские имена, иконки, описания. Используются в крафте и наградах.
export const MATERIALS = [
  { id: 'slime_jelly', name: 'Слизь лужайника', icon: '🟢', description: 'Прохладная и переливается.' },
  { id: 'honey', name: 'Дикий мёд', icon: '🍯', description: 'Густой, с запахом луговых трав.' },
  { id: 'glow_moss', name: 'Светящийся мох', icon: '🌿', description: 'Мягко светится в темноте.' },
  { id: 'moth_dust', name: 'Пыльца мотылька', icon: '🦋', description: 'Усыпляет, если понюхать.' },
  { id: 'moss_stone', name: 'Мшистый камень', icon: '🗿', description: 'Камень в плотной шубке мха.' },
  { id: 'willow_heart', name: 'Сердце старой ивы', icon: '🌳', description: 'Тёплая древесина с характером.' },
  { id: 'rat_tail', name: 'Крысиный хвост', icon: '🐀', description: 'Крепкий и гибкий. Ведьминки ценят.' },
  { id: 'torn_cloth', name: 'Рваная ткань', icon: '🧣', description: 'Ничем не пахнет, пригодится.' },
  { id: 'brick_chunk', name: 'Обломок кладки', icon: '🧱', description: 'Тяжёлый, с цементной пылью.' },
  { id: 'ectoplasm', name: 'Эктоплазма', icon: '👻', description: 'Холодная дымка в склянке.' },
  { id: 'captain_badge', name: 'Значок капитана', icon: '🎖️', description: 'Потёртый, но гордый.' },
  { id: 'ink_drop', name: 'Капля чернил', icon: '🫟', description: 'Концентрированная, почти живая.' },
  { id: 'paper_scrap', name: 'Обрывок страницы', icon: '📄', description: 'С половиной предложения.' },
  { id: 'page_dust', name: 'Книжная пыль', icon: '📖', description: 'Пахнет старыми историями.' },
  { id: 'gold_leaf', name: 'Сусальное золото', icon: '🍂', description: 'Тоньше лепестка.' },
  { id: 'last_page', name: 'Последняя страница', icon: '📜', description: 'На ней — конец любой истории.' },
];

export const MATERIAL_BY_ID = Object.fromEntries(MATERIALS.map((m) => [m.id, m]));

export function materialLabel(id) {
  const m = MATERIAL_BY_ID[id];
  return m ? `${m.icon} ${m.name}` : id;
}
