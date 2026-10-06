(() => {
  // src/data/items.js
  var ITEMS = [
    // --- Оружие: одноручное ---
    {
      id: "wpn_rusty_sword",
      name: "\u0414\u0435\u0434\u043E\u0432 \u043C\u0435\u0447",
      slot: "weapon",
      hand: "one",
      type: "sword",
      rarity: "common",
      price: 40,
      stats: { attack: 6 },
      description: "\u0421\u0442\u0430\u0440\u044B\u0439, \u043D\u043E \u043E\u0441\u0442\u0440\u044B\u0439. \u041F\u0430\u0445\u043D\u0435\u0442 \u043B\u0430\u0432\u0430\u043D\u0434\u043E\u0439 \u0438\u0437 \u043B\u0430\u0432\u043A\u0438."
    },
    {
      id: "wpn_oak_mace",
      name: "\u0414\u0443\u0431\u043E\u0432\u0430\u044F \u0431\u0443\u043B\u0430\u0432\u0430",
      slot: "weapon",
      hand: "one",
      type: "mace",
      rarity: "common",
      price: 70,
      stats: { attack: 9, speed: -1 },
      description: "\u0422\u044F\u0436\u0451\u043B\u0430\u044F \u0434\u0443\u0431\u0438\u043D\u0430. \u0425\u043E\u0440\u043E\u0448\u043E \u0441\u0442\u0443\u0447\u0438\u0442 \u043F\u043E \u043C\u0448\u0438\u0441\u0442\u044B\u043C \u0433\u043E\u043B\u0435\u043C\u0430\u043C."
    },
    {
      id: "wpn_dagger_firefly",
      name: "\u041A\u0438\u043D\u0436\u0430\u043B \u0441\u0432\u0435\u0442\u043B\u044F\u0447\u043A\u0430",
      slot: "weapon",
      hand: "one",
      type: "dagger",
      rarity: "rare",
      price: 130,
      stats: { attack: 7, speed: 3, crit: 0.08 },
      description: "\u041B\u0451\u0433\u043A\u0438\u0439 \u043A\u043B\u0438\u043D\u043E\u043A, \u0441\u0432\u0435\u0442\u0438\u0442\u0441\u044F \u0432 \u0442\u0435\u043C\u043D\u043E\u0442\u0435."
    },
    // --- Оружие: двуручное ---
    {
      id: "wpn_greatsword_oak",
      name: "\u0414\u0443\u0431\u043E\u0432\u044B\u0439 \u0434\u0432\u0443\u0440\u0443\u0447\u043D\u0438\u043A",
      slot: "weapon",
      hand: "two",
      type: "greatsword",
      rarity: "rare",
      price: 180,
      stats: { attack: 18, speed: -2 },
      traits: ["cleave_small"],
      description: "\u0422\u044F\u0436\u0451\u043B\u044B\u0439, \u043D\u043E \u043D\u0430\u0434\u0451\u0436\u043D\u044B\u0439 \u043C\u0435\u0447 \u0438\u0437 \u043C\u043E\u0440\u0451\u043D\u043E\u0433\u043E \u0434\u0443\u0431\u0430. \u0429\u0438\u0442 \u0441 \u043D\u0438\u043C \u043D\u0435 \u0443\u0434\u0435\u0440\u0436\u0430\u0442\u044C."
    },
    {
      id: "wpn_lumberaxe",
      name: "\u0422\u043E\u043F\u043E\u0440 \u0434\u0440\u043E\u0432\u043E\u0441\u0435\u043A\u0430 \u0434\u0443\u0445\u043E\u0432",
      slot: "weapon",
      hand: "two",
      type: "greataxe",
      rarity: "epic",
      price: 260,
      stats: { attack: 24, speed: -3, crit: 0.05 },
      traits: ["cleave_small", "bonus_spirit"],
      description: "\u0420\u0430\u0441\u0441\u0435\u043A\u0430\u0435\u0442 \u0442\u043E\u043B\u043F\u044B \u0434\u0443\u0445\u043E\u0432, \u043A\u0430\u043A \u0441\u0443\u0445\u0438\u0435 \u0432\u0435\u0442\u043A\u0438."
    },
    {
      id: "wpn_hunter_bow",
      name: "\u041B\u0443\u043A \u043D\u043E\u0447\u043D\u043E\u0433\u043E \u043E\u0445\u043E\u0442\u043D\u0438\u043A\u0430",
      slot: "weapon",
      hand: "two",
      type: "bow",
      rarity: "rare",
      price: 200,
      stats: { attack: 13, speed: 2, crit: 0.12 },
      traits: ["ranged", "bonus_spirit"],
      description: "\u0422\u0435\u0442\u0438\u0432\u0430 \u043D\u0430\u043F\u0435\u0432\u0430\u0435\u0442 \u0442\u0438\u0445\u043E, \u0447\u0442\u043E\u0431\u044B \u043D\u0435 \u0441\u043F\u0443\u0433\u043D\u0443\u0442\u044C \u0434\u0443\u0445\u043E\u0432."
    },
    // --- Щиты ---
    {
      id: "shd_wooden",
      name: "\u0429\u0438\u0442 \u0438\u0437 \u043B\u0438\u043F\u044B",
      slot: "shield",
      hand: "one",
      type: "shield",
      rarity: "common",
      price: 50,
      stats: { armor: 8, block: 0.15 },
      description: "\u041B\u0451\u0433\u043A\u0438\u0439 \u0449\u0438\u0442. \u041D\u0430 \u043E\u0431\u043E\u0440\u043E\u0442\u0435 \u2014 \u0434\u0435\u0442\u0441\u043A\u0438\u0439 \u0440\u0438\u0441\u0443\u043D\u043E\u043A \u0443\u0433\u043B\u0451\u043C."
    },
    {
      id: "shd_guardian",
      name: "\u0429\u0438\u0442 \u0441\u0442\u0440\u0430\u0436\u0430 \u043B\u0430\u0432\u043A\u0438",
      slot: "shield",
      hand: "one",
      type: "shield",
      rarity: "rare",
      price: 150,
      stats: { armor: 14, hp: 10, block: 0.25 },
      traits: ["thorns_small"],
      description: "\u0421 \u0442\u0430\u043A\u0438\u043C \u0449\u0438\u0442\u043E\u043C \u043B\u0430\u0432\u043A\u0430 \u043C\u043E\u0436\u0435\u0442 \u0441\u043F\u0430\u0442\u044C \u0441\u043F\u043E\u043A\u043E\u0439\u043D\u043E."
    },
    // --- Шлемы ---
    {
      id: "hlm_badger",
      name: "\u0428\u043B\u0435\u043C \u0441\u043E\u043D\u043D\u043E\u0433\u043E \u0431\u0430\u0440\u0441\u0443\u043A\u0430",
      slot: "helmet",
      type: "helmet",
      rarity: "rare",
      price: 120,
      stats: { hp: 15, resist: { sleep: 0.55 } },
      description: "\u0420\u044B\u0446\u0430\u0440\u044C \u043D\u0435 \u0437\u0430\u0441\u044B\u043F\u0430\u0435\u0442 \u043E\u0442 \u043F\u044B\u043B\u044C\u0446\u044B \u043D\u043E\u0447\u043D\u044B\u0445 \u043C\u043E\u0442\u044B\u043B\u044C\u043A\u043E\u0432."
    },
    {
      id: "hlm_leather",
      name: "\u041A\u043E\u0436\u0430\u043D\u044B\u0439 \u043A\u0430\u043F\u044E\u0448\u043E\u043D",
      slot: "helmet",
      type: "helmet",
      rarity: "common",
      price: 45,
      stats: { hp: 8, dodge: 0.03 },
      description: "\u041F\u0430\u0445\u043D\u0435\u0442 \u0434\u043E\u0436\u0434\u0451\u043C \u0438 \u0442\u0440\u0430\u0432\u0430\u043C\u0438."
    },
    // --- Броня ---
    {
      id: "arm_padded",
      name: "\u0421\u0442\u0451\u0433\u0430\u043D\u044B\u0439 \u043A\u0430\u043C\u0437\u043E\u043B",
      slot: "armor",
      type: "armor",
      rarity: "common",
      price: 60,
      stats: { armor: 10, hp: 10 },
      description: "\u0421\u0448\u0438\u0442 \u0445\u043E\u0437\u044F\u0439\u043A\u043E\u0439 \u043B\u0430\u0432\u043A\u0438. \u0422\u0451\u043F\u043B\u044B\u0439 \u0438 \u0447\u0435\u0441\u0442\u043D\u044B\u0439."
    },
    {
      id: "arm_oak_guardian",
      name: "\u0411\u0440\u043E\u043D\u044F \u0434\u0443\u0431\u043E\u0432\u043E\u0433\u043E \u0441\u0442\u0440\u0430\u0436\u0430",
      slot: "armor",
      type: "armor",
      rarity: "epic",
      price: 240,
      stats: { armor: 30, hp: 10 },
      traits: ["first_hit_reduction"],
      description: "\u041F\u0435\u0440\u0432\u044B\u0439 \u0443\u0434\u0430\u0440 \u0432 \u0431\u043E\u044E \u0441\u043D\u0438\u0436\u0430\u0435\u0442\u0441\u044F \u043D\u0430 20%."
    },
    {
      id: "arm_silken",
      name: "\u0428\u0451\u043B\u043A\u043E\u0432\u044B\u0439 \u0434\u043E\u0441\u043F\u0435\u0445 \u043C\u043E\u0442\u044B\u043B\u044C\u043A\u0430",
      slot: "armor",
      type: "armor",
      rarity: "rare",
      price: 170,
      stats: { armor: 12, speed: 3, dodge: 0.07 },
      description: "\u041B\u0451\u0433\u043A\u0438\u0439, \u043A\u0430\u043A \u043A\u0440\u044B\u043B\u043E. \u041F\u043E\u0447\u0442\u0438 \u043D\u0435 \u0447\u0443\u0432\u0441\u0442\u0432\u0443\u0435\u0442\u0441\u044F."
    },
    // --- Перчатки ---
    {
      id: "glv_herbalist",
      name: "\u041F\u0435\u0440\u0447\u0430\u0442\u043A\u0438 \u0442\u0440\u0430\u0432\u043D\u0438\u0446\u044B",
      slot: "gloves",
      type: "gloves",
      rarity: "common",
      price: 55,
      stats: { attack: 3, resist: { poison: 0.25 } },
      description: "\u041D\u0435 \u0431\u043E\u044F\u0442\u0441\u044F \u043D\u0438 \u043A\u0440\u0430\u043F\u0438\u0432\u044B, \u043D\u0438 \u044F\u0434\u043E\u0432\u0438\u0442\u044B\u0445 \u0441\u043B\u0438\u0437\u043D\u0435\u0439."
    },
    {
      id: "glv_crit",
      name: "\u041F\u0435\u0440\u0447\u0430\u0442\u043A\u0438 \u0442\u043E\u0447\u043D\u043E\u0433\u043E \u0443\u0434\u0430\u0440\u0430",
      slot: "gloves",
      type: "gloves",
      rarity: "rare",
      price: 140,
      stats: { attack: 4, crit: 0.07 },
      description: "\u0428\u0432\u044B \u043B\u043E\u0436\u0430\u0442\u0441\u044F \u0442\u043E\u0447\u043D\u043E \u043F\u043E \u043B\u0438\u043D\u0438\u044F\u043C \u0441\u0443\u0434\u044C\u0431\u044B."
    },
    // --- Сапоги ---
    {
      id: "bt_path",
      name: "\u0421\u0430\u043F\u043E\u0433\u0438 \u0442\u0440\u043E\u043F\u0438\u043D\u043E\u043A",
      slot: "boots",
      type: "boots",
      rarity: "common",
      price: 50,
      stats: { speed: 2, dodge: 0.04 },
      description: "\u0421\u0430\u043C\u0438 \u043D\u0430\u0445\u043E\u0434\u044F\u0442 \u0441\u0443\u0445\u043E\u0435 \u043C\u0435\u0441\u0442\u043E \u0432 \u043B\u0443\u0436\u0435."
    },
    {
      id: "bt_merchant",
      name: "\u0421\u0430\u043F\u043E\u0433\u0438 \u0442\u043E\u0440\u0433\u043E\u0432\u043E\u0433\u043E \u0441\u0442\u0440\u0430\u043D\u043D\u0438\u043A\u0430",
      slot: "boots",
      type: "boots",
      rarity: "rare",
      price: 110,
      stats: { speed: 1, goldFind: 0.15 },
      description: "\u041F\u043E\u0441\u043B\u0435 \u0431\u043E\u044F \u0432 \u0442\u0440\u0430\u0432\u0435 \u043D\u0430\u0445\u043E\u0434\u0438\u0442\u0441\u044F \u0431\u043E\u043B\u044C\u0448\u0435 \u043C\u043E\u043D\u0435\u0442."
    },
    // --- Амулеты ---
    {
      id: "amu_hearth",
      name: "\u0410\u043C\u0443\u043B\u0435\u0442 \u0434\u043E\u043C\u0430\u0448\u043D\u0435\u0433\u043E \u043E\u0447\u0430\u0433\u0430",
      slot: "amulet",
      type: "amulet",
      rarity: "rare",
      price: 130,
      stats: { hp: 10, resist: { fire: 0.3 } },
      traits: ["heal_after_battle"],
      description: "\u041F\u043E\u0441\u043B\u0435 \u0431\u043E\u044F \u0440\u044B\u0446\u0430\u0440\u044C \u0447\u0443\u0432\u0441\u0442\u0432\u0443\u0435\u0442 \u0441\u0435\u0431\u044F \u043A\u0430\u043A \u0434\u043E\u043C\u0430."
    },
    {
      id: "amu_antidote",
      name: "\u0410\u043C\u0443\u043B\u0435\u0442 \u043F\u0440\u043E\u0442\u0438\u0432\u043E\u044F\u0434\u0438\u044F",
      slot: "amulet",
      type: "amulet",
      rarity: "rare",
      price: 120,
      stats: { resist: { poison: 0.45 } },
      description: "\u041F\u0443\u0447\u043E\u043A \u0441\u0443\u0448\u0451\u043D\u043E\u0433\u043E \u043F\u043B\u0430\u0443\u043D\u0430 \u043F\u043E\u0434 \u0441\u0442\u0435\u043A\u043B\u043E\u043C."
    },
    // --- Кольца ---
    {
      id: "rng_luck",
      name: "\u041A\u043E\u043B\u044C\u0446\u043E \u0443\u0434\u0430\u0447\u0438",
      slot: "ring",
      type: "ring",
      rarity: "common",
      price: 60,
      stats: { itemFind: 0.1, goldFind: 0.05 },
      description: "\u041B\u0451\u0433\u043A\u043E\u0435 \u043F\u043E\u043A\u0430\u043B\u044B\u0432\u0430\u043D\u0438\u0435 \u0432 \u043F\u0430\u043B\u044C\u0446\u0435 \u2014 \u043A \u043D\u0430\u0445\u043E\u0434\u043A\u0435."
    },
    {
      id: "rng_crit",
      name: "\u041A\u043E\u043B\u044C\u0446\u043E \u043A\u0440\u0438\u0442\u0430",
      slot: "ring",
      type: "ring",
      rarity: "rare",
      price: 120,
      stats: { crit: 0.06 },
      description: "\u041A\u0430\u043C\u0435\u043D\u044C \u0432\u0441\u043F\u044B\u0445\u0438\u0432\u0430\u0435\u0442 \u0432 \u043C\u043E\u043C\u0435\u043D\u0442 \u0432\u0435\u0440\u043D\u043E\u0433\u043E \u0443\u0434\u0430\u0440\u0430."
    },
    {
      id: "rng_health",
      name: "\u041A\u043E\u043B\u044C\u0446\u043E \u0437\u0434\u043E\u0440\u043E\u0432\u044C\u044F",
      slot: "ring",
      type: "ring",
      rarity: "common",
      price: 55,
      stats: { hp: 12 },
      description: "\u0422\u0451\u043F\u043B\u043E\u0435 \u043D\u0430 \u043E\u0449\u0443\u043F\u044C, \u043A\u0430\u043A \u043A\u0440\u0443\u0436\u043A\u0430 \u0447\u0430\u044F."
    },
    // --- Расходники ---
    {
      id: "pot_heal",
      name: "\u0417\u0435\u043B\u044C\u0435 \u043B\u0435\u0447\u0435\u043D\u0438\u044F",
      slot: "consumable",
      type: "potion",
      rarity: "common",
      price: 30,
      stackable: true,
      effect: { kind: "heal", amount: 40, atHpBelow: 0.35 },
      description: "\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438 \u0432\u044B\u043F\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u0432 \u0431\u043E\u044E \u043F\u0440\u0438 \u043D\u0438\u0437\u043A\u043E\u043C \u0437\u0434\u043E\u0440\u043E\u0432\u044C\u0435."
    },
    {
      id: "pot_vigor",
      name: "\u0417\u0435\u043B\u044C\u0435 \u0431\u043E\u0434\u0440\u043E\u0441\u0442\u0438",
      slot: "consumable",
      type: "potion",
      rarity: "common",
      price: 35,
      stackable: true,
      effect: { kind: "cleanse_sleep", resistAfter: { sleep: 0.6 } },
      description: "\u0421\u043D\u0438\u043C\u0430\u0435\u0442 \u0441\u043E\u043D \u0438 \u0431\u043E\u0434\u0440\u0438\u0442 \u0434\u043E \u043A\u043E\u043D\u0446\u0430 \u0431\u043E\u044F."
    }
  ];
  ITEMS.push(
    {
      id: "wpn_iron_sword",
      name: "\u0416\u0435\u043B\u0435\u0437\u043D\u044B\u0439 \u043C\u0435\u0447 \u0441\u0442\u0440\u0430\u0436\u043D\u0438\u043A\u0430",
      slot: "weapon",
      hand: "one",
      type: "sword",
      rarity: "rare",
      price: 220,
      stats: { attack: 14, block: 0.03 },
      description: "\u041A\u0430\u0437\u0430\u0440\u043C\u0435\u043D\u043D\u0430\u044F \u0440\u0430\u0431\u043E\u0442\u0430: \u0431\u0435\u0437 \u0438\u0437\u043B\u0438\u0448\u0435\u0441\u0442\u0432, \u043D\u043E \u043D\u0430\u0434\u0451\u0436\u043D\u043E."
    },
    {
      id: "wpn_warhammer",
      name: "\u041C\u043E\u043B\u043E\u0442 \u043A\u0430\u043C\u0435\u043D\u0449\u0438\u043A\u0430",
      slot: "weapon",
      hand: "two",
      type: "greataxe",
      rarity: "epic",
      price: 340,
      stats: { attack: 30, speed: -3 },
      traits: ["cleave_small"],
      description: "\u0418\u043C \u043A\u043B\u0430\u0434\u0443\u0442 \u0441\u0442\u0435\u043D\u044B. \u0418 \u0440\u0430\u0441\u043A\u043B\u0430\u0434\u044B\u0432\u0430\u044E\u0442 \u0431\u0440\u043E\u0434\u044F\u0447\u0438\u0445 \u0433\u043E\u043B\u0435\u043C\u043E\u0432."
    },
    {
      id: "shd_tower",
      name: "\u0411\u0430\u0448\u0435\u043D\u043D\u044B\u0439 \u0449\u0438\u0442",
      slot: "shield",
      hand: "one",
      type: "shield",
      rarity: "epic",
      price: 280,
      stats: { armor: 20, hp: 15, block: 0.3, speed: -1 },
      description: "\u0417\u0430 \u0442\u0430\u043A\u0438\u043C \u0449\u0438\u0442\u043E\u043C \u043C\u043E\u0436\u043D\u043E \u043F\u0435\u0440\u0435\u0436\u0434\u0430\u0442\u044C \u0438 \u043E\u0441\u0430\u0434\u0443, \u0438 \u0434\u043E\u0436\u0434\u044C."
    },
    {
      id: "hlm_kettle",
      name: "\u0416\u0435\u043B\u0435\u0437\u043D\u044B\u0439 \u0448\u043B\u0435\u043C",
      slot: "helmet",
      type: "helmet",
      rarity: "rare",
      price: 190,
      stats: { armor: 8, hp: 12, resist: { sleep: 0.2 } },
      description: "\u0413\u0443\u043B\u043A\u043E \u0437\u0432\u0435\u043D\u0438\u0442, \u0435\u0441\u043B\u0438 \u0437\u0430\u0434\u0440\u0435\u043C\u0430\u0442\u044C \u043D\u0430 \u043F\u043E\u0441\u0442\u0443."
    },
    {
      id: "arm_chain",
      name: "\u041A\u043E\u043B\u044C\u0447\u0443\u0433\u0430 \u0434\u0432\u043E\u0440\u043D\u0438\u043A\u0430-\u0432\u0435\u0442\u0435\u0440\u0430\u043D\u0430",
      slot: "armor",
      type: "armor",
      rarity: "rare",
      price: 260,
      stats: { armor: 22, hp: 15 },
      description: "\u041A\u0430\u0436\u0434\u043E\u0435 \u043A\u043E\u043B\u044C\u0446\u043E \u043F\u043E\u043C\u043D\u0438\u0442 \u0441\u0432\u043E\u044E \u0438\u0441\u0442\u043E\u0440\u0438\u044E."
    },
    {
      id: "glv_smithee",
      name: "\u0420\u0443\u043A\u0430\u0432\u0438\u0446\u044B \u043A\u0443\u0437\u043D\u0435\u0446\u0430",
      slot: "gloves",
      type: "gloves",
      rarity: "rare",
      price: 200,
      stats: { attack: 6, resist: { fire: 0.25 } },
      description: "\u041D\u0435 \u0431\u043E\u044F\u0442\u0441\u044F \u043D\u0438 \u0433\u043E\u0440\u043D\u0430, \u043D\u0438 \u0447\u0443\u0436\u043E\u0433\u043E \u043E\u0433\u043D\u044F."
    },
    {
      id: "bt_cobble",
      name: "\u0421\u0430\u043F\u043E\u0433\u0438 \u043F\u043E \u0431\u0440\u0443\u0441\u0447\u0430\u0442\u043A\u0435",
      slot: "boots",
      type: "boots",
      rarity: "rare",
      price: 170,
      stats: { speed: 3, dodge: 0.05 },
      description: "\u041A\u0430\u0431\u043B\u0443\u043A\u0438 \u0432\u044B\u0431\u0438\u0432\u0430\u044E\u0442 \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u0443\u044E \u0434\u0440\u043E\u0431\u044C \u043F\u043E \u043C\u043E\u0441\u0442\u043E\u0432\u043E\u0439."
    },
    {
      id: "amu_fearless",
      name: "\u0410\u043C\u0443\u043B\u0435\u0442 \u043E\u0442\u0432\u0430\u0433\u0438",
      slot: "amulet",
      type: "amulet",
      rarity: "epic",
      price: 300,
      stats: { hp: 8, resist: { sleep: 0.15 } },
      traits: ["fearless"],
      description: "\u0421\u0435\u0440\u0434\u0446\u0435 \u0440\u044B\u0446\u0430\u0440\u044F \u0431\u044C\u0451\u0442\u0441\u044F \u0440\u043E\u0432\u043D\u043E, \u0434\u0430\u0436\u0435 \u043A\u043E\u0433\u0434\u0430 \u0437\u0430 \u0441\u043F\u0438\u043D\u043E\u0439 \u0448\u0435\u043F\u0447\u0435\u0442 \u043F\u0440\u0438\u0437\u0440\u0430\u043A."
    },
    {
      id: "rng_iron",
      name: "\u0416\u0435\u043B\u0435\u0437\u043D\u043E\u0435 \u043A\u043E\u043B\u044C\u0446\u043E",
      slot: "ring",
      type: "ring",
      rarity: "rare",
      price: 150,
      stats: { attack: 3, armor: 4 },
      description: "\u041F\u0440\u043E\u0441\u0442\u043E\u0435, \u043A\u0430\u043A \u0433\u0432\u043E\u0437\u0434\u044C. \u041A\u0440\u0435\u043F\u043A\u043E\u0435, \u043A\u0430\u043A \u0433\u0432\u043E\u0437\u0434\u044C."
    },
    {
      id: "rng_duelist",
      name: "\u041A\u043E\u043B\u044C\u0446\u043E \u0434\u0443\u044D\u043B\u044F\u043D\u0442\u0430",
      slot: "ring",
      type: "ring",
      rarity: "epic",
      price: 260,
      stats: { crit: 0.08, speed: 1 },
      description: "\u0414\u043B\u044F \u0442\u0435\u0445, \u043A\u0442\u043E \u0431\u044C\u0451\u0442 \u043F\u0435\u0440\u0432\u044B\u043C \u0438 \u043C\u0435\u0442\u043A\u043E."
    },
    {
      id: "pot_stone",
      name: "\u0417\u0435\u043B\u044C\u0435 \u043A\u0430\u043C\u0435\u043D\u043D\u043E\u0439 \u043A\u043E\u0436\u0438",
      slot: "consumable",
      type: "potion",
      rarity: "rare",
      price: 60,
      stackable: true,
      effect: { kind: "shield", amount: 25, atStart: true },
      description: "\u0412 \u043D\u0430\u0447\u0430\u043B\u0435 \u0431\u043E\u044F \u0434\u0430\u0451\u0442 \u0449\u0438\u0442, \u043F\u043E\u0433\u043B\u043E\u0449\u0430\u044E\u0449\u0438\u0439 25 \u0443\u0440\u043E\u043D\u0430."
    }
  );
  ITEMS.push(
    {
      id: "wpn_candle_staff",
      name: "\u041F\u043E\u0441\u043E\u0445 \u0441\u0432\u0435\u0447\u043D\u043E\u0433\u043E \u043C\u0430\u0433\u0430",
      slot: "weapon",
      hand: "two",
      type: "staff",
      rarity: "epic",
      price: 420,
      stats: { attack: 34, speed: -2 },
      traits: ["pierce"],
      description: "\u041F\u043B\u0430\u043C\u044F \u043D\u0430 \u043A\u043E\u043D\u0446\u0435 \u043F\u0440\u043E\u0448\u0438\u0432\u0430\u0435\u0442 \u0434\u0430\u0436\u0435 \u043A\u0430\u043C\u0435\u043D\u044C. \u041E\u0431\u0435 \u0440\u0443\u043A\u0438 \u0437\u0430\u043D\u044F\u0442\u044B."
    },
    {
      id: "wpn_firebird_quill",
      name: "\u041F\u0435\u0440\u043E \u0436\u0430\u0440-\u043F\u0442\u0438\u0446\u044B",
      slot: "weapon",
      hand: "one",
      type: "dagger",
      rarity: "legendary",
      price: 0,
      sealPrice: 6,
      stats: { attack: 16, speed: 4, crit: 0.18 },
      description: "\u041F\u0438\u0448\u0435\u0442 \u0438\u0441\u0442\u043E\u0440\u0438\u044E \u0431\u043E\u044F \u0441\u0430\u043C\u043E. \u041B\u0435\u0433\u0435\u043D\u0434\u0430 \u0447\u0435\u0440\u0434\u0430\u043A\u0430."
    },
    {
      id: "arm_ink_cloak",
      name: "\u0427\u0435\u0440\u043D\u0438\u043B\u044C\u043D\u044B\u0439 \u043F\u043B\u0430\u0449",
      slot: "armor",
      type: "armor",
      rarity: "epic",
      price: 380,
      stats: { armor: 18, dodge: 0.1, resist: { poison: 0.3 } },
      description: "\u041A\u043B\u044F\u043A\u0441\u044B \u0441\u043A\u043E\u043B\u044C\u0437\u044F\u0442, \u043D\u0435 \u043E\u0441\u0442\u0430\u0432\u043B\u044F\u044F \u0441\u043B\u0435\u0434\u043E\u0432."
    },
    {
      id: "hlm_page_wanderer",
      name: "\u041A\u043E\u043B\u043F\u0430\u043A \u0441\u0442\u0440\u0430\u043D\u043D\u0438\u043A\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446",
      slot: "helmet",
      type: "helmet",
      rarity: "rare",
      price: 260,
      stats: { hp: 18, resist: { sleep: 0.35 }, itemFind: 0.08 },
      description: "\u041F\u043E\u0434 \u0442\u0430\u043A\u0438\u043C \u043A\u043E\u043B\u043F\u0430\u043A\u043E\u043C \u0441\u043D\u044F\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u0445\u043E\u0440\u043E\u0448\u0438\u0435 \u0438\u0441\u0442\u043E\u0440\u0438\u0438."
    },
    {
      id: "glv_binder",
      name: "\u041F\u0435\u0440\u0447\u0430\u0442\u043A\u0438 \u043F\u0435\u0440\u0435\u043F\u043B\u0451\u0442\u0447\u0438\u043A\u0430",
      slot: "gloves",
      type: "gloves",
      rarity: "rare",
      price: 240,
      stats: { attack: 5, armor: 4 },
      description: "\u041A\u0440\u0435\u043F\u043A\u0438\u0435 \u0448\u0432\u044B \u2014 \u043A\u0440\u0435\u043F\u043A\u0430\u044F \u0445\u0432\u0430\u0442\u043A\u0430."
    },
    {
      id: "bt_quiet_step",
      name: "\u0421\u0430\u043F\u043E\u0433\u0438 \u0442\u0438\u0445\u043E\u0433\u043E \u0448\u0430\u0433\u0430",
      slot: "boots",
      type: "boots",
      rarity: "epic",
      price: 300,
      stats: { speed: 4, dodge: 0.08 },
      description: "\u0428\u0430\u0433 \u043C\u044F\u0433\u0447\u0435 \u043F\u0435\u0440\u0435\u0432\u043E\u0440\u0430\u0447\u0438\u0432\u0430\u0435\u043C\u043E\u0439 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B."
    },
    {
      id: "amu_pages",
      name: "\u0410\u043C\u0443\u043B\u0435\u0442 \u0441\u0442\u0440\u0430\u043D\u0438\u0446",
      slot: "amulet",
      type: "amulet",
      rarity: "epic",
      price: 340,
      stats: { hp: 15, resist: { sleep: 0.2, poison: 0.2 } },
      traits: ["heal_after_battle"],
      description: "\u041F\u0430\u0445\u043D\u0435\u0442 \u0441\u0442\u0430\u0440\u043E\u0439 \u0431\u0443\u043C\u0430\u0433\u043E\u0439. \u041F\u043E\u0441\u043B\u0435 \u0431\u043E\u044F \u0440\u044B\u0446\u0430\u0440\u044C \u043E\u0442\u0434\u044B\u0445\u0430\u0435\u0442 \u0431\u044B\u0441\u0442\u0440\u0435\u0435."
    },
    {
      id: "rng_ink",
      name: "\u041A\u043E\u043B\u044C\u0446\u043E \u0447\u0435\u0440\u043D\u0438\u043B",
      slot: "ring",
      type: "ring",
      rarity: "rare",
      price: 180,
      stats: { attack: 4, resist: { poison: 0.15 } },
      description: "\u0412\u043D\u0443\u0442\u0440\u0438 \u043F\u043B\u0430\u0432\u0430\u0435\u0442 \u0442\u0451\u043C\u043D\u0430\u044F \u043A\u0430\u043F\u043B\u044F."
    },
    {
      id: "rng_contents",
      name: "\u041A\u043E\u043B\u044C\u0446\u043E \u043E\u0433\u043B\u0430\u0432\u043B\u0435\u043D\u0438\u044F",
      slot: "ring",
      type: "ring",
      rarity: "epic",
      price: 280,
      stats: { speed: 2, goldFind: 0.1, itemFind: 0.1 },
      description: "\u0412\u0441\u0435\u0433\u0434\u0430 \u0437\u043D\u0430\u0435\u0442, \u043D\u0430 \u043A\u0430\u043A\u043E\u0439 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0435 \u043A\u043B\u0430\u0434."
    },
    {
      id: "pot_ink",
      name: "\u0427\u0435\u0440\u043D\u0438\u043B\u044C\u043D\u044B\u0439 \u043E\u0442\u0432\u0430\u0440",
      slot: "consumable",
      type: "potion",
      rarity: "rare",
      price: 70,
      stackable: true,
      effect: { kind: "cleanse_poison", resistAfter: { poison: 0.6 } },
      description: "\u0413\u043E\u0440\u044C\u043A\u0438\u0439. \u0412\u044B\u0432\u043E\u0434\u0438\u0442 \u044F\u0434 \u0438\u0437 \u043A\u0440\u043E\u0432\u0438 \u0438 \u0438\u0437 \u043A\u043D\u0438\u0433."
    }
  );
  var ITEM_BY_ID = Object.fromEntries(ITEMS.map((i) => [i.id, i]));
  var RARITY_LABEL = {
    common: "\u041E\u0431\u044B\u0447\u043D\u044B\u0439",
    rare: "\u0420\u0435\u0434\u043A\u0438\u0439",
    epic: "\u0412\u043E\u043B\u0448\u0435\u0431\u043D\u044B\u0439",
    legendary: "\u041B\u0435\u0433\u0435\u043D\u0434\u0430\u0440\u043D\u044B\u0439"
  };

  // src/data/shop.js
  var SHOP_STOCK = [
    // Стартовая полка
    { itemId: "wpn_rusty_sword", unlockAfter: null },
    { itemId: "shd_wooden", unlockAfter: null },
    { itemId: "hlm_leather", unlockAfter: null },
    { itemId: "arm_padded", unlockAfter: null },
    { itemId: "pot_heal", unlockAfter: null },
    { itemId: "pot_vigor", unlockAfter: null },
    { itemId: "bt_path", unlockAfter: null },
    { itemId: "rng_health", unlockAfter: null },
    // После «Пчелиного дерева» (шлем барсука — до боя с мотыльками!)
    { itemId: "glv_herbalist", unlockAfter: "bt_bees" },
    { itemId: "wpn_oak_mace", unlockAfter: "bt_bees" },
    { itemId: "bt_merchant", unlockAfter: "bt_bees" },
    { itemId: "rng_luck", unlockAfter: "bt_bees" },
    { itemId: "hlm_badger", unlockAfter: "bt_bees" },
    // После «Поляны мотыльков»
    { itemId: "amu_antidote", unlockAfter: "bt_moths" },
    { itemId: "rng_crit", unlockAfter: "bt_moths" },
    // После «Заросшей тропы»
    { itemId: "wpn_hunter_bow", unlockAfter: "bt_spirits" },
    { itemId: "arm_silken", unlockAfter: "bt_spirits" },
    { itemId: "wpn_greatsword_oak", unlockAfter: "bt_spirits" },
    { itemId: "glv_crit", unlockAfter: "bt_spirits" },
    // После «Мшистого стража»
    { itemId: "shd_guardian", unlockAfter: "bt_golem" },
    { itemId: "arm_oak_guardian", unlockAfter: "bt_golem" },
    { itemId: "amu_hearth", unlockAfter: "bt_golem" },
    { itemId: "wpn_lumberaxe", unlockAfter: "bt_golem" },
    // Мир 2: после «Крысиного переулка»
    { itemId: "wpn_iron_sword", unlockAfter: "bt_rats" },
    { itemId: "hlm_kettle", unlockAfter: "bt_rats" },
    { itemId: "bt_cobble", unlockAfter: "bt_rats" },
    { itemId: "rng_iron", unlockAfter: "bt_rats" },
    // После «Заставы у склада»
    { itemId: "arm_chain", unlockAfter: "bt_bandits" },
    { itemId: "glv_smithee", unlockAfter: "bt_bandits" },
    { itemId: "pot_stone", unlockAfter: "bt_bandits" },
    // После «Бродячей кладки»
    { itemId: "wpn_warhammer", unlockAfter: "bt_wander_golem" },
    { itemId: "shd_tower", unlockAfter: "bt_wander_golem" },
    // После «Ночного обхода»
    { itemId: "amu_fearless", unlockAfter: "bt_ghost_watch" },
    { itemId: "rng_duelist", unlockAfter: "bt_ghost_watch" },
    // Мир 3: после «Пролитых чернил»
    { itemId: "hlm_page_wanderer", unlockAfter: "bk_blots" },
    { itemId: "glv_binder", unlockAfter: "bk_blots" },
    { itemId: "pot_ink", unlockAfter: "bk_blots" },
    { itemId: "rng_ink", unlockAfter: "bk_blots" },
    // После «Моли в фолианте»
    { itemId: "arm_ink_cloak", unlockAfter: "bk_moths" },
    { itemId: "bt_quiet_step", unlockAfter: "bk_moths" },
    // После «Шорохов страниц»
    { itemId: "wpn_candle_staff", unlockAfter: "bk_spirits" },
    { itemId: "amu_pages", unlockAfter: "bk_spirits" },
    { itemId: "rng_contents", unlockAfter: "bk_spirits" },
    // После «Витражной гравюры»
    { itemId: "wpn_firebird_quill", unlockAfter: "bk_illustration" }
  ];
  var CREW_STOCK = [
    { id: "cmp_firefly", kind: "companion", unlockAfter: "bt_slimes" },
    { id: "cmp_cat", kind: "companion", unlockAfter: "bt_slimes" },
    { id: "cmp_herbalist", kind: "companion", unlockAfter: "bt_bees" },
    { id: "cmp_smith", kind: "companion", unlockAfter: "bt_boss_willow" },
    { id: "pet_puppy", kind: "pet", unlockAfter: "bt_slimes" },
    { id: "pet_hedgehog", kind: "pet", unlockAfter: "bt_moths" },
    { id: "pet_fox", kind: "pet", unlockAfter: "bt_boss_willow" },
    { id: "merc_archer", kind: "merc", unlockAfter: "bt_bees" },
    { id: "merc_guard", kind: "merc", unlockAfter: "bt_moths" },
    { id: "merc_witch", kind: "merc", unlockAfter: "bt_boss_willow" },
    { id: "merc_knight_errant", kind: "merc", unlockAfter: "bt_town_mix" },
    { id: "pet_horse", kind: "pet", unlockAfter: "bt_bandits" },
    { id: "pet_owl", kind: "pet", unlockAfter: "bk_moths" }
  ];

  // src/data/puzzles.js
  var PUZZLES = [
    {
      id: "md_01",
      world: "meadow",
      name: "\u041F\u0435\u0440\u0432\u044B\u0439 \u0441\u0432\u0435\u0442\u043B\u044F\u0447\u043E\u043A",
      difficulty: 1,
      grid: [4, 4],
      objects: [
        { type: "source", pos: [0, 1], dir: 1 },
        { type: "lantern", pos: [3, 1] }
      ],
      rewards: [{ type: "coins", amount: 40 }],
      intro: "\u0421\u043C\u043E\u0442\u0440\u0438: \u0441\u0432\u0435\u0442\u043B\u044F\u0447\u043E\u043A \u0441\u0432\u0435\u0442\u0438\u0442 \u043F\u0440\u044F\u043C\u043E \u2014 \u043B\u0443\u0447 \u0443\u0436\u0435 \u0431\u0435\u0436\u0438\u0442 \u043A \u0444\u043E\u043D\u0430\u0440\u044E! \u0422\u0430\u043A \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u0441\u0432\u0435\u0442. \u0423\u0440\u043E\u0432\u0435\u043D\u044C \u0440\u0435\u0448\u0438\u0442\u0441\u044F \u0441\u0430\u043C, \u0430 \u0434\u0430\u043B\u044C\u0448\u0435 \u043C\u044B \u0434\u043E\u0431\u0430\u0432\u0438\u043C \u0437\u0435\u0440\u043A\u0430\u043B\u0430."
    },
    {
      id: "md_02",
      world: "meadow",
      name: "\u041F\u0435\u0440\u0432\u043E\u0435 \u0437\u0435\u0440\u043A\u0430\u043B\u043E",
      difficulty: 1,
      grid: [5, 5],
      objects: [
        { type: "source", pos: [0, 2], dir: 1 },
        { type: "mirror", pos: [2, 2], orient: 0 },
        { type: "lantern", pos: [2, 0] }
      ],
      rewards: [{ type: "coins", amount: 45 }],
      intro: "\u0422\u0430\u043F\u043D\u0438 \u0437\u0435\u0440\u043A\u0430\u043B\u043E, \u0447\u0442\u043E\u0431\u044B \u043F\u043E\u0432\u0435\u0440\u043D\u0443\u0442\u044C \u0435\u0433\u043E. \u041D\u0430\u043F\u0440\u0430\u0432\u044C \u0441\u0432\u0435\u0442 \u043A \u0444\u043E\u043D\u0430\u0440\u044E."
    },
    {
      id: "md_03",
      world: "meadow",
      name: "\u041F\u043E\u0432\u043E\u0440\u043E\u0442 \u043D\u0430\u043B\u0435\u0432\u043E",
      difficulty: 1,
      grid: [5, 5],
      objects: [
        { type: "source", pos: [2, 4], dir: 0 },
        { type: "mirror", pos: [2, 2], orient: 1 },
        { type: "mirror", pos: [4, 4], orient: 0 },
        { type: "lantern", pos: [0, 2] }
      ],
      rewards: [{ type: "coins", amount: 45 }, { type: "item", id: "pot_heal" }],
      intro: "\u0417\u0435\u0440\u043A\u0430\u043B\u043E \u043E\u0442\u0440\u0430\u0436\u0430\u0435\u0442 \u0441\u0432\u0435\u0442 \u043F\u043E\u0434 \u043F\u0440\u044F\u043C\u044B\u043C \u0443\u0433\u043B\u043E\u043C."
    },
    {
      id: "md_04",
      world: "meadow",
      name: "\u0414\u0432\u0430 \u0437\u0435\u0440\u043A\u0430\u043B\u0430",
      difficulty: 2,
      grid: [6, 6],
      objects: [
        { type: "source", pos: [0, 0], dir: 1 },
        { type: "mirror", pos: [3, 0], orient: 1 },
        { type: "mirror", pos: [3, 3], orient: 0 },
        { type: "lantern", pos: [0, 3] }
      ],
      rewards: [{ type: "coins", amount: 55 }],
      intro: "\u0421\u0432\u0435\u0442 \u043C\u043E\u0436\u0435\u0442 \u043F\u043E\u0432\u043E\u0440\u0430\u0447\u0438\u0432\u0430\u0442\u044C \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0440\u0430\u0437."
    },
    {
      id: "md_05",
      world: "meadow",
      name: "\u0422\u0438\u0448\u0435, \u043C\u043E\u043B\u044C \u0441\u043F\u0438\u0442",
      difficulty: 2,
      grid: [5, 5],
      objects: [
        { type: "source", pos: [0, 2], dir: 1 },
        { type: "mirror", pos: [2, 2], orient: 0 },
        { type: "lantern", pos: [2, 0] },
        { type: "moth", pos: [2, 4] }
      ],
      rewards: [{ type: "coins", amount: 60 }],
      intro: "\u0421\u0432\u0435\u0442 \u0431\u0443\u0434\u0438\u0442 \u043D\u043E\u0447\u043D\u0443\u044E \u043C\u043E\u043B\u044C. \u041D\u0430\u043F\u0440\u0430\u0432\u044C \u043B\u0443\u0447 \u043A \u0444\u043E\u043D\u0430\u0440\u044E, \u0430 \u043D\u0435 \u043A \u043D\u0435\u0439."
    },
    {
      id: "md_06",
      world: "meadow",
      name: "\u041E\u0431\u0445\u043E\u0434\u043D\u043E\u0439 \u0441\u0432\u0435\u0442",
      difficulty: 2,
      grid: [6, 5],
      objects: [
        { type: "source", pos: [0, 2], dir: 1 },
        { type: "mirror", pos: [1, 2], orient: 0 },
        { type: "mirror", pos: [1, 0], orient: 0 },
        { type: "mirror", pos: [4, 4], orient: 1 },
        { type: "lantern", pos: [4, 0] },
        { type: "moth", pos: [4, 2] }
      ],
      rewards: [{ type: "coins", amount: 65 }],
      intro: "\u041F\u0440\u044F\u043C\u043E\u0439 \u043F\u0443\u0442\u044C \u0437\u0430\u043D\u044F\u0442 \u0441\u043F\u044F\u0449\u0435\u0439 \u043C\u043E\u043B\u044C\u044E. \u041F\u0440\u043E\u0432\u0435\u0434\u0438 \u0441\u0432\u0435\u0442 \u0441\u0432\u0435\u0440\u0445\u0443."
    },
    {
      id: "md_07",
      world: "meadow",
      name: "\u0414\u0432\u0430 \u0444\u043E\u043D\u0430\u0440\u044F",
      difficulty: 2,
      grid: [6, 6],
      objects: [
        { type: "source", pos: [0, 0], dir: 1 },
        { type: "lantern", pos: [2, 0] },
        { type: "mirror", pos: [5, 0], orient: 1 },
        { type: "lantern", pos: [5, 4] }
      ],
      rewards: [{ type: "coins", amount: 70 }],
      intro: "\u0417\u0430\u0436\u0436\u0451\u043D\u043D\u044B\u0439 \u0444\u043E\u043D\u0430\u0440\u044C \u043F\u0440\u043E\u043F\u0443\u0441\u043A\u0430\u0435\u0442 \u0441\u0432\u0435\u0442 \u0434\u0430\u043B\u044C\u0448\u0435 \u2014 \u043E\u0434\u0438\u043D \u043B\u0443\u0447 \u043C\u043E\u0436\u0435\u0442 \u0437\u0430\u0436\u0435\u0447\u044C \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E."
    },
    {
      id: "md_08",
      world: "meadow",
      name: "\u0417\u0438\u0433\u0437\u0430\u0433",
      difficulty: 3,
      grid: [7, 7],
      objects: [
        { type: "source", pos: [0, 6], dir: 0 },
        { type: "mirror", pos: [0, 4], orient: 0 },
        { type: "mirror", pos: [3, 4], orient: 1 },
        { type: "mirror", pos: [3, 6], orient: 0 },
        { type: "lantern", pos: [1, 6] }
      ],
      rewards: [{ type: "coins", amount: 80 }, { type: "item", id: "rng_luck" }],
      intro: "\u0422\u0440\u0438 \u043F\u043E\u0432\u043E\u0440\u043E\u0442\u0430 \u2014 \u0438 \u0441\u0432\u0435\u0442 \u043D\u0430\u0439\u0434\u0451\u0442 \u0434\u043E\u0440\u043E\u0433\u0443."
    },
    {
      id: "md_09",
      world: "meadow",
      name: "\u041C\u043E\u043B\u044C \u043F\u043E\u0434 \u0444\u043E\u043D\u0430\u0440\u0451\u043C",
      difficulty: 3,
      grid: [6, 6],
      objects: [
        { type: "source", pos: [5, 3], dir: 3 },
        { type: "mirror", pos: [3, 3], orient: 1 },
        { type: "mirror", pos: [3, 1], orient: 0 },
        { type: "lantern", pos: [5, 1] },
        { type: "moth", pos: [3, 5] }
      ],
      rewards: [{ type: "coins", amount: 85 }],
      intro: "\u041E\u0434\u0438\u043D \u043D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043F\u043E\u0432\u043E\u0440\u043E\u0442 \u2014 \u0438 \u043C\u043E\u043B\u044C \u043F\u0440\u043E\u0441\u043D\u0451\u0442\u0441\u044F."
    },
    {
      id: "md_10",
      world: "meadow",
      name: "\u0422\u0435\u043D\u044C \u0443 \u0434\u043E\u0440\u043E\u0433\u0438",
      difficulty: 3,
      grid: [7, 6],
      objects: [
        { type: "source", pos: [0, 0], dir: 1 },
        { type: "wall", pos: [2, 0] },
        { type: "wall", pos: [2, 1] },
        { type: "mirror", pos: [1, 0], orient: 1 },
        { type: "mirror", pos: [1, 4], orient: 1 },
        { type: "mirror", pos: [4, 4], orient: 1 },
        { type: "lantern", pos: [0, 4] }
      ],
      rewards: [{ type: "coins", amount: 90 }],
      intro: "\u0422\u0435\u043D\u044C \u043D\u0435 \u0441\u0442\u0440\u0430\u0448\u043D\u0430 \u2014 \u043E\u043D\u0430 \u043F\u0440\u043E\u0441\u0442\u043E \u043E\u0441\u0442\u0430\u043D\u0430\u0432\u043B\u0438\u0432\u0430\u0435\u0442 \u0441\u0432\u0435\u0442. \u041E\u0431\u043E\u0439\u0434\u0438 \u0435\u0451."
    },
    {
      id: "md_11",
      world: "meadow",
      name: "\u0413\u0438\u0440\u043B\u044F\u043D\u0434\u0430",
      difficulty: 4,
      grid: [7, 7],
      objects: [
        { type: "source", pos: [3, 6], dir: 0 },
        { type: "lantern", pos: [3, 4] },
        { type: "mirror", pos: [3, 2], orient: 1 },
        { type: "lantern", pos: [1, 2] },
        { type: "mirror", pos: [0, 2], orient: 0 },
        { type: "lantern", pos: [0, 4] },
        { type: "mirror", pos: [0, 6], orient: 1 },
        { type: "lantern", pos: [2, 6] }
      ],
      rewards: [{ type: "coins", amount: 110 }],
      intro: "\u0426\u0435\u043B\u0430\u044F \u0433\u0438\u0440\u043B\u044F\u043D\u0434\u0430 \u0444\u043E\u043D\u0430\u0440\u0435\u0439 \u2014 \u043A\u0430\u043A \u043D\u0430 \u043D\u043E\u0447\u043D\u043E\u043C \u0440\u044B\u043D\u043A\u0435."
    },
    {
      id: "md_12",
      world: "meadow",
      name: "\u0424\u0438\u043D\u0430\u043B \u043E\u043F\u0443\u0448\u043A\u0438",
      difficulty: 5,
      grid: [8, 8],
      objects: [
        { type: "source", pos: [0, 7], dir: 1 },
        { type: "moth", pos: [3, 7] },
        { type: "mirror", pos: [1, 7], orient: 0 },
        { type: "mirror", pos: [1, 4], orient: 0 },
        { type: "mirror", pos: [5, 4], orient: 1 },
        { type: "mirror", pos: [5, 6], orient: 0 },
        { type: "lantern", pos: [2, 6] },
        { type: "wall", pos: [2, 2] },
        { type: "wall", pos: [2, 3] }
      ],
      rewards: [{ type: "coins", amount: 150 }, { type: "seals", amount: 1 }],
      intro: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u0437\u0430\u0433\u0430\u0434\u043A\u0430 \u043E\u043F\u0443\u0448\u043A\u0438. \u041C\u043E\u043B\u044C \u0441\u0442\u043E\u0440\u043E\u0436\u0438\u0442 \u043F\u0440\u044F\u043C\u043E\u0439 \u043F\u0443\u0442\u044C."
    }
  ];
  var PUZZLE_BY_ID = Object.fromEntries(PUZZLES.map((p) => [p.id, p]));

  // src/data/puzzlesShelf.js
  var T = {
    potion: { icon: "\u{1F9EA}", tags: ["potion", "fragile"] },
    herbs: { icon: "\u{1F33F}", tags: ["herb"] },
    hammer: { icon: "\u{1F528}", tags: ["heavy", "metal"] },
    sword: { icon: "\u{1F5E1}\uFE0F", tags: ["metal"] },
    shield: { icon: "\u{1F6E1}\uFE0F", tags: ["heavy", "metal"] },
    crystal: { icon: "\u{1F52E}", tags: ["magic", "fragile", "glow"] },
    scroll: { icon: "\u{1F4DC}", tags: ["fragile"] },
    bread: { icon: "\u{1F35E}", tags: ["food"] },
    cheese: { icon: "\u{1F9C0}", tags: ["food"] },
    mug: { icon: "\u{1F37A}", tags: ["food"] },
    gem: { icon: "\u{1F48E}", tags: ["magic", "fragile", "glow"] },
    candle: { icon: "\u{1F56F}\uFE0F", tags: ["fragile"] },
    horseshoe: { icon: "\u{1F9F2}", tags: ["metal", "heavy"] }
  };
  function item(id, name, key) {
    return { id, name, icon: T[key].icon, tags: [...T[key].tags] };
  }
  var SHELF_PUZZLES = [
    {
      id: "tw_01",
      world: "town",
      mechanic: "shelf",
      name: "\u041F\u0435\u0440\u0432\u0430\u044F \u043F\u043E\u043B\u043A\u0430",
      difficulty: 1,
      grid: [3, 2],
      cells: [
        { pos: [0, 0], kind: "shelf" },
        { pos: [1, 0], kind: "shelf" },
        { pos: [2, 0], kind: "shelf" }
      ],
      items: [
        item("i_hammer", "\u041C\u043E\u043B\u043E\u0442\u043E\u043A", "hammer"),
        item("i_herbs", "\u041F\u0443\u0447\u043E\u043A \u0442\u0440\u0430\u0432", "herbs"),
        item("i_potion", "\u0417\u0435\u043B\u044C\u0435", "potion")
      ],
      rules: {
        notAdjacent: [["fragile", "heavy"]],
        mustAdjacent: [["potion", "herb"]]
      },
      rewards: [{ type: "coins", amount: 60 }],
      intro: "\u0425\u0440\u0443\u043F\u043A\u043E\u0435 \u043D\u0435 \u043A\u043B\u0430\u0434\u0451\u043C \u0440\u044F\u0434\u043E\u043C \u0441 \u0442\u044F\u0436\u0451\u043B\u044B\u043C, \u0430 \u0437\u0435\u043B\u044C\u0435 \u0434\u0435\u0440\u0436\u0438\u043C \u0431\u043B\u0438\u0436\u0435 \u043A \u0442\u0440\u0430\u0432\u0430\u043C."
    },
    {
      id: "tw_02",
      world: "town",
      mechanic: "shelf",
      name: "\u0422\u044F\u0436\u0451\u043B\u044B\u0439 \u043D\u0438\u0437",
      difficulty: 1,
      grid: [4, 2],
      cells: [
        { pos: [0, 0], kind: "shelf" },
        { pos: [1, 0], kind: "shelf" },
        { pos: [2, 0], kind: "shelf" },
        { pos: [3, 0], kind: "shelf" }
      ],
      items: [
        item("i_sword", "\u041C\u0435\u0447", "sword"),
        item("i_shield", "\u0429\u0438\u0442", "shield"),
        item("i_scroll", "\u0421\u0432\u0438\u0442\u043E\u043A", "scroll"),
        item("i_crystal", "\u041A\u0440\u0438\u0441\u0442\u0430\u043B\u043B", "crystal")
      ],
      rules: {
        notAdjacent: [["fragile", "heavy"], ["magic", "metal"]]
      },
      rewards: [{ type: "coins", amount: 70 }],
      intro: "\u041C\u0435\u0442\u0430\u043B\u043B \u0438 \u043C\u0430\u0433\u0438\u044F \u043D\u0435 \u0443\u0436\u0438\u0432\u0430\u044E\u0442\u0441\u044F. \u0425\u0440\u0443\u043F\u043A\u043E\u0435 \u2014 \u043F\u043E\u0434\u0430\u043B\u044C\u0448\u0435 \u043E\u0442 \u0442\u044F\u0436\u0451\u043B\u043E\u0433\u043E."
    },
    {
      id: "tw_03",
      world: "town",
      mechanic: "shelf",
      name: "\u0421\u0432\u0435\u0442 \u0443 \u043E\u043A\u043D\u0430",
      difficulty: 2,
      grid: [4, 2],
      cells: [
        { pos: [0, 0], kind: "light" },
        { pos: [1, 0], kind: "light" },
        { pos: [2, 0], kind: "shelf" },
        { pos: [3, 0], kind: "shelf" },
        { pos: [0, 1], kind: "shelf" },
        { pos: [1, 1], kind: "shelf" }
      ],
      items: [
        item("i_crystal", "\u041A\u0440\u0438\u0441\u0442\u0430\u043B\u043B", "crystal"),
        item("i_herbs", "\u0422\u0440\u0430\u0432\u044B", "herbs"),
        item("i_potion", "\u0417\u0435\u043B\u044C\u0435", "potion"),
        item("i_bread", "\u0425\u043B\u0435\u0431", "bread")
      ],
      rules: {
        onLight: ["glow"],
        mustAdjacent: [["potion", "herb"]]
      },
      rewards: [{ type: "coins", amount: 80 }],
      intro: "\u0421\u0432\u0435\u0442\u044F\u0449\u0438\u0435\u0441\u044F \u0432\u0435\u0449\u0438 \u043B\u044E\u0431\u044F\u0442 \u043C\u0435\u0441\u0442\u043E \u0443 \u043E\u043A\u043D\u0430."
    },
    {
      id: "tw_04",
      world: "town",
      mechanic: "shelf",
      name: "\u041A\u0443\u0437\u043D\u0435\u0447\u043D\u044B\u0439 \u043F\u043E\u0440\u044F\u0434\u043E\u043A",
      difficulty: 2,
      grid: [4, 3],
      cells: [
        { pos: [0, 0], kind: "shelf" },
        { pos: [1, 0], kind: "shelf" },
        { pos: [2, 0], kind: "shelf" },
        { pos: [3, 0], kind: "shelf" },
        { pos: [0, 2], kind: "shelf" },
        { pos: [3, 2], kind: "shelf" }
      ],
      items: [
        item("i_hammer", "\u041C\u043E\u043B\u043E\u0442", "hammer"),
        item("i_horseshoe", "\u041F\u043E\u0434\u043A\u043E\u0432\u0430", "horseshoe"),
        item("i_sword", "\u041C\u0435\u0447", "sword"),
        item("i_scroll", "\u0427\u0435\u0440\u0442\u0451\u0436", "scroll"),
        item("i_candle", "\u0421\u0432\u0435\u0447\u0430", "candle")
      ],
      rules: {
        notAdjacent: [["fragile", "heavy"]]
      },
      rewards: [{ type: "coins", amount: 90 }],
      intro: "\u041A\u0443\u0437\u043D\u0435\u0446 \u043F\u0440\u043E\u0441\u0438\u043B \u0440\u0430\u0437\u043B\u043E\u0436\u0438\u0442\u044C \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u044B. \u0427\u0435\u0440\u0442\u0451\u0436 \u0438 \u0441\u0432\u0435\u0447\u0430 \u2014 \u043D\u0435 \u043F\u043E\u0434 \u043C\u043E\u043B\u043E\u0442\u043E\u043C!"
    },
    {
      id: "tw_05",
      world: "town",
      mechanic: "shelf",
      name: "\u041F\u0440\u0438\u043B\u0430\u0432\u043E\u043A \u0442\u0440\u0430\u043A\u0442\u0438\u0440\u0430",
      difficulty: 2,
      grid: [5, 2],
      cells: [
        { pos: [0, 0], kind: "shelf" },
        { pos: [1, 0], kind: "shelf" },
        { pos: [2, 0], kind: "shelf" },
        { pos: [3, 0], kind: "shelf" },
        { pos: [4, 0], kind: "shelf" }
      ],
      items: [
        item("i_bread", "\u0425\u043B\u0435\u0431", "bread"),
        item("i_cheese", "\u0421\u044B\u0440", "cheese"),
        item("i_mug", "\u041A\u0440\u0443\u0436\u043A\u0430", "mug"),
        item("i_hammer", "\u041C\u043E\u043B\u043E\u0442\u043E\u043A", "hammer")
      ],
      rules: {
        mustAdjacent: [["food", "food"]],
        notAdjacent: [["food", "heavy"]]
      },
      rewards: [{ type: "coins", amount: 95 }],
      intro: "\u0415\u0434\u0430 \u0434\u0435\u0440\u0436\u0438\u0442\u0441\u044F \u0432\u043C\u0435\u0441\u0442\u0435 \u0438 \u043F\u043E\u0434\u0430\u043B\u044C\u0448\u0435 \u043E\u0442 \u0440\u0430\u0431\u043E\u0447\u0435\u0433\u043E \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u0430."
    },
    {
      id: "tw_06",
      world: "town",
      mechanic: "shelf",
      name: "\u041C\u0430\u0433\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0448\u043A\u0430\u0444",
      difficulty: 3,
      grid: [4, 3],
      cells: [
        { pos: [0, 0], kind: "light" },
        { pos: [3, 0], kind: "light" },
        { pos: [0, 1], kind: "shelf" },
        { pos: [1, 1], kind: "shelf" },
        { pos: [2, 1], kind: "shelf" },
        { pos: [3, 1], kind: "shelf" }
      ],
      items: [
        item("i_crystal", "\u041A\u0440\u0438\u0441\u0442\u0430\u043B\u043B", "crystal"),
        item("i_gem", "\u0421\u0430\u043C\u043E\u0446\u0432\u0435\u0442", "gem"),
        item("i_sword", "\u041C\u0435\u0447", "sword"),
        item("i_shield", "\u0429\u0438\u0442", "shield"),
        item("i_bread", "\u0425\u043B\u0435\u0431", "bread")
      ],
      rules: {
        onLight: ["glow"],
        notAdjacent: [["magic", "metal"], ["fragile", "heavy"]]
      },
      rewards: [{ type: "coins", amount: 110 }, { type: "item", id: "pot_stone" }],
      intro: "\u0414\u0432\u0430 \u0441\u0432\u0435\u0442\u044F\u0449\u0438\u0445\u0441\u044F \u2014 \u043E\u0431\u0430 \u043D\u0430 \u0441\u0432\u0435\u0442. \u0418 \u043D\u0438 \u043E\u0434\u043D\u043E\u0433\u043E \u043C\u0435\u0442\u0430\u043B\u043B\u0430 \u0440\u044F\u0434\u043E\u043C."
    },
    {
      id: "tw_07",
      world: "town",
      mechanic: "shelf",
      name: "\u041F\u043E\u043B\u043A\u0430 \u0443 \u043E\u0447\u0430\u0433\u0430",
      difficulty: 3,
      grid: [5, 3],
      cells: [
        { pos: [0, 0], kind: "light" },
        { pos: [1, 0], kind: "light" },
        { pos: [2, 0], kind: "shelf" },
        { pos: [3, 0], kind: "shelf" },
        { pos: [4, 0], kind: "shelf" },
        { pos: [0, 2], kind: "shelf" },
        { pos: [4, 2], kind: "shelf" }
      ],
      items: [
        item("i_candle", "\u0421\u0432\u0435\u0447\u0430", "candle"),
        item("i_scroll", "\u0421\u0432\u0438\u0442\u043E\u043A", "scroll"),
        item("i_hammer", "\u041C\u043E\u043B\u043E\u0442", "hammer"),
        item("i_horseshoe", "\u041F\u043E\u0434\u043A\u043E\u0432\u0430", "horseshoe"),
        item("i_cheese", "\u0421\u044B\u0440", "cheese")
      ],
      rules: {
        notAdjacent: [["fragile", "heavy"], ["food", "metal"]],
        onLight: ["fragile"]
      },
      rewards: [{ type: "coins", amount: 115 }],
      intro: "\u0425\u0440\u0443\u043F\u043A\u043E\u0435 \u2014 \u043D\u0430 \u0441\u0432\u0435\u0442, \u0441\u044B\u0440 \u2014 \u043F\u043E\u0434\u0430\u043B\u044C\u0448\u0435 \u043E\u0442 \u0436\u0435\u043B\u0435\u0437\u0430."
    },
    {
      id: "tw_08",
      world: "town",
      mechanic: "shelf",
      name: "\u0417\u0430\u043A\u0430\u0437 \u0441\u0442\u0440\u0430\u0436\u0438",
      difficulty: 3,
      grid: [5, 3],
      cells: [
        { pos: [0, 0], kind: "shelf" },
        { pos: [1, 0], kind: "shelf" },
        { pos: [2, 0], kind: "shelf" },
        { pos: [3, 0], kind: "shelf" },
        { pos: [4, 0], kind: "shelf" },
        { pos: [1, 2], kind: "shelf" },
        { pos: [2, 2], kind: "shelf" },
        { pos: [3, 2], kind: "shelf" }
      ],
      items: [
        item("i_sword", "\u041C\u0435\u0447", "sword"),
        item("i_shield", "\u0429\u0438\u0442", "shield"),
        item("i_hammer", "\u041C\u043E\u043B\u043E\u0442", "hammer"),
        item("i_potion", "\u0417\u0435\u043B\u044C\u0435", "potion"),
        item("i_herbs", "\u0422\u0440\u0430\u0432\u044B", "herbs"),
        item("i_crystal", "\u041A\u0440\u0438\u0441\u0442\u0430\u043B\u043B", "crystal")
      ],
      rules: {
        notAdjacent: [["fragile", "heavy"], ["magic", "metal"]],
        mustAdjacent: [["potion", "herb"]]
      },
      rewards: [{ type: "coins", amount: 125 }],
      intro: "\u0421\u0442\u0440\u0430\u0436\u0430 \u0437\u0430\u043A\u0430\u0437\u0430\u043B\u0430 \u043A\u043E\u043C\u043F\u043B\u0435\u043A\u0442. \u0421\u043E\u0431\u0435\u0440\u0438 \u0430\u043A\u043A\u0443\u0440\u0430\u0442\u043D\u043E \u2014 \u043C\u0430\u0433\u0438\u044F \u043D\u0435 \u0442\u0435\u0440\u043F\u0438\u0442 \u043C\u0435\u0442\u0430\u043B\u043B\u0430."
    },
    {
      id: "tw_09",
      world: "town",
      mechanic: "shelf",
      name: "\u0412\u0438\u0442\u0440\u0438\u043D\u0430 \u0434\u0438\u043A\u043E\u0432\u0438\u043D",
      difficulty: 4,
      grid: [6, 3],
      cells: [
        { pos: [0, 0], kind: "light" },
        { pos: [5, 0], kind: "light" },
        { pos: [0, 1], kind: "shelf" },
        { pos: [1, 1], kind: "shelf" },
        { pos: [2, 1], kind: "shelf" },
        { pos: [3, 1], kind: "shelf" },
        { pos: [4, 1], kind: "shelf" },
        { pos: [5, 1], kind: "shelf" }
      ],
      items: [
        item("i_crystal", "\u041A\u0440\u0438\u0441\u0442\u0430\u043B\u043B", "crystal"),
        item("i_gem", "\u0421\u0430\u043C\u043E\u0446\u0432\u0435\u0442", "gem"),
        item("i_candle", "\u0421\u0432\u0435\u0447\u0430", "candle"),
        item("i_hammer", "\u041C\u043E\u043B\u043E\u0442", "hammer"),
        item("i_shield", "\u0429\u0438\u0442", "shield"),
        item("i_mug", "\u041A\u0440\u0443\u0436\u043A\u0430", "mug")
      ],
      rules: {
        onLight: ["glow"],
        notAdjacent: [["fragile", "heavy"], ["food", "metal"]]
      },
      rewards: [{ type: "coins", amount: 140 }],
      intro: "\u0412\u0438\u0442\u0440\u0438\u043D\u0430 \u043D\u0430 \u0434\u0432\u043E\u0438\u0445 \u043E\u043A\u043D\u0430\u0445. \u0421\u0432\u0435\u0442\u044F\u0449\u0438\u0435\u0441\u044F \u0434\u0438\u043A\u043E\u0432\u0438\u043D\u044B \u2014 \u043A \u0441\u0432\u0435\u0442\u0443."
    },
    {
      id: "tw_10",
      world: "town",
      mechanic: "shelf",
      name: "\u0411\u043E\u043B\u044C\u0448\u043E\u0439 \u0448\u043A\u0430\u0444 \u043A\u0430\u043F\u0438\u0442\u0430\u043D\u0430",
      difficulty: 5,
      grid: [6, 4],
      cells: [
        { pos: [0, 0], kind: "light" },
        { pos: [5, 0], kind: "light" },
        { pos: [0, 1], kind: "shelf" },
        { pos: [1, 1], kind: "shelf" },
        { pos: [2, 1], kind: "shelf" },
        { pos: [3, 1], kind: "shelf" },
        { pos: [4, 1], kind: "shelf" },
        { pos: [5, 1], kind: "shelf" },
        { pos: [1, 3], kind: "shelf" },
        { pos: [2, 3], kind: "shelf" },
        { pos: [3, 3], kind: "shelf" },
        { pos: [4, 3], kind: "shelf" }
      ],
      items: [
        item("i_crystal", "\u041A\u0440\u0438\u0441\u0442\u0430\u043B\u043B", "crystal"),
        item("i_gem", "\u0421\u0430\u043C\u043E\u0446\u0432\u0435\u0442", "gem"),
        item("i_sword", "\u041C\u0435\u0447 \u0441\u0442\u0440\u0430\u0436\u0438", "sword"),
        item("i_shield", "\u0429\u0438\u0442 \u043A\u0430\u043F\u0438\u0442\u0430\u043D\u0430", "shield"),
        item("i_hammer", "\u041C\u043E\u043B\u043E\u0442", "hammer"),
        item("i_potion", "\u0417\u0435\u043B\u044C\u0435", "potion"),
        item("i_herbs", "\u0422\u0440\u0430\u0432\u044B", "herbs")
      ],
      rules: {
        onLight: ["glow"],
        notAdjacent: [["magic", "metal"], ["fragile", "heavy"]],
        mustAdjacent: [["potion", "herb"]]
      },
      rewards: [{ type: "coins", amount: 180 }, { type: "seals", amount: 1 }],
      intro: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439 \u0437\u0430\u043A\u0430\u0437 \u0434\u0432\u043E\u0440\u0438\u043A\u0430: \u0432\u0441\u0451 \u0441\u0440\u0430\u0437\u0443. \u041A\u0430\u043F\u0438\u0442\u0430\u043D \u0431\u0443\u0434\u0435\u0442 \u0434\u043E\u0432\u043E\u043B\u0435\u043D."
    }
  ];
  var SHELF_PUZZLE_BY_ID = Object.fromEntries(SHELF_PUZZLES.map((p) => [p.id, p]));

  // src/data/puzzlesBook.js
  var BOOK_PUZZLES = [
    {
      id: "bk_01",
      world: "attic",
      mechanic: "book",
      name: "\u041F\u0435\u0440\u0432\u043E\u0435 \u0441\u043B\u043E\u0432\u043E",
      difficulty: 1,
      grid: [3, 1],
      blots: [],
      phrase: "\u041C\u0418\u0420",
      scrambled: "\u0420\u0418\u041C",
      rewards: [{ type: "coins", amount: 90 }],
      intro: "\u0411\u0443\u043A\u0432\u044B \u0432\u0435\u0436\u043B\u0438\u0432\u043E \u0436\u0434\u0443\u0442, \u043A\u043E\u0433\u0434\u0430 \u0438\u0445 \u0432\u0435\u0440\u043D\u0443\u0442 \u043D\u0430 \u043C\u0435\u0441\u0442\u043E. \u0422\u0430\u043F\u043D\u0438 \u0434\u0432\u0435 \u2014 \u043E\u043D\u0438 \u043F\u043E\u043C\u0435\u043D\u044F\u044E\u0442\u0441\u044F."
    },
    {
      id: "bk_02",
      world: "attic",
      mechanic: "book",
      name: "\u041F\u043E\u043B\u043A\u0430 \u0441\u043A\u0430\u0437\u043E\u043A",
      difficulty: 1,
      grid: [5, 1],
      blots: [],
      phrase: "\u041A\u041D\u0418\u0413\u0410",
      scrambled: "\u0410\u0413\u0418\u041D\u041A",
      rewards: [{ type: "coins", amount: 95 }],
      intro: "\u041F\u044F\u0442\u044C \u0431\u0443\u043A\u0432, \u043E\u0434\u043D\u043E \u0443\u044E\u0442\u043D\u043E\u0435 \u0441\u043B\u043E\u0432\u043E."
    },
    {
      id: "bk_03",
      world: "attic",
      mechanic: "book",
      name: "\u041E\u0433\u0430\u0440\u043E\u043A",
      difficulty: 2,
      grid: [3, 2],
      blots: [[2, 1]],
      phrase: "\u0421\u0412\u0415\u0427\u0410",
      scrambled: "\u0410\u0427\u0415\u0412\u0421",
      rewards: [{ type: "coins", amount: 100 }],
      intro: "\u041A\u043B\u044F\u043A\u0441\u0430 \u0441\u044A\u0435\u043B\u0430 \u0443\u0433\u043E\u043B \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B. \u0411\u0443\u043A\u0432\u044B \u0447\u0438\u0442\u0430\u044E\u0442\u0441\u044F \u0437\u043C\u0435\u0439\u043A\u043E\u0439."
    },
    {
      id: "bk_04",
      world: "attic",
      mechanic: "book",
      name: "\u0412\u0435\u0447\u0435\u0440\u043D\u0438\u0439 \u0440\u0438\u0442\u0443\u0430\u043B",
      difficulty: 2,
      grid: [4, 2],
      blots: [[3, 1]],
      phrase: "\u0427\u0410\u0419\u2726\u0414\u041E\u041C",
      scrambled: "\u0414\u041E\u041C\u2726\u0419\u0410\u0427",
      rewards: [{ type: "coins", amount: 110 }],
      intro: "\u0414\u0432\u0435 \u0441\u0442\u0440\u043E\u0447\u043A\u0438 \u0447\u0435\u0440\u0435\u0437 \u0437\u0432\u0451\u0437\u0434\u043D\u044B\u0439 \u0440\u0430\u0437\u0434\u0435\u043B\u0438\u0442\u0435\u043B\u044C. \u2726 \u0432\u0441\u0435\u0433\u0434\u0430 \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u043D\u0430 \u043C\u0435\u0441\u0442\u0435."
    },
    {
      id: "bk_05",
      world: "attic",
      mechanic: "book",
      name: "\u041D\u043E\u0447\u043D\u043E\u0439 \u0437\u043E\u0432",
      difficulty: 2,
      grid: [5, 2],
      blots: [],
      phrase: "\u041B\u0423\u041D\u0410\u2726\u0417\u041E\u0412\u0401\u0422",
      scrambled: "\u0410\u041D\u0423\u041B\u2726\u0422\u0401\u0412\u041E\u0417",
      rewards: [{ type: "coins", amount: 115 }],
      intro: "\u041B\u0443\u043D\u0430 \u0437\u043E\u0432\u0451\u0442. \u0414\u0430\u0436\u0435 \u0431\u0443\u043A\u0432\u044B \u044D\u0442\u043E \u0447\u0443\u0432\u0441\u0442\u0432\u0443\u044E\u0442."
    },
    {
      id: "bk_06",
      world: "attic",
      mechanic: "book",
      name: "\u0428\u0451\u043F\u043E\u0442 \u0441\u0442\u0440\u0430\u043D\u0438\u0446",
      difficulty: 3,
      grid: [5, 3],
      blots: [],
      phrase: "\u0421\u0422\u0420\u0410\u041D\u0418\u0426\u042B\u2726\u0428\u0415\u041F\u0427\u0423\u0422",
      scrambled: "\u042B\u0426\u0418\u041D\u0410\u0420\u0422\u0421\u2726\u0422\u0423\u0427\u041F\u0415\u0428",
      rewards: [{ type: "coins", amount: 130 }, { type: "item", id: "rng_ink" }],
      rewards_extra_note: true,
      intro: "\u0414\u043B\u0438\u043D\u043D\u0430\u044F \u0444\u0440\u0430\u0437\u0430. \u0421\u043E\u0431\u0438\u0440\u0430\u0439 \u0435\u0451 \u0441\u043B\u043E\u0432\u043E \u0437\u0430 \u0441\u043B\u043E\u0432\u043E\u043C."
    },
    {
      id: "bk_07",
      world: "attic",
      mechanic: "book",
      name: "\u0427\u0435\u0440\u043D\u0438\u043B\u0430 \u0438 \u0441\u043E\u043D",
      difficulty: 3,
      grid: [4, 4],
      blots: [[0, 3], [1, 3], [2, 3]],
      phrase: "\u0427\u0415\u0420\u041D\u0418\u041B\u0410\u2726\u0418\u2726\u0421\u041E\u041D",
      scrambled: "\u0410\u041B\u0418\u041D\u0420\u0415\u0427\u2726\u0418\u2726\u041D\u041E\u0421",
      rewards: [{ type: "coins", amount: 135 }],
      intro: "\u0422\u0440\u0438 \u043A\u043B\u044F\u043A\u0441\u044B \u0432\u043D\u0438\u0437\u0443. \u0414\u0432\u0430 \u0440\u0430\u0437\u0434\u0435\u043B\u0438\u0442\u0435\u043B\u044F \u0434\u0435\u0440\u0436\u0430\u0442 \u0444\u0440\u0430\u0437\u0443."
    },
    {
      id: "bk_08",
      world: "attic",
      mechanic: "book",
      name: "\u0417\u0430\u043A\u043B\u0430\u0434\u043A\u0430 \u043C\u0435\u0447\u0442\u044B",
      difficulty: 3,
      grid: [4, 4],
      blots: [[0, 3], [3, 3]],
      phrase: "\u0417\u0410\u041A\u041B\u0410\u0414\u041A\u0410\u2726\u041C\u0415\u0427\u0422\u042B",
      scrambled: "\u0410\u0414\u041A\u0410\u041B\u0410\u041A\u0417\u2726\u042B\u0422\u0427\u0415\u041C",
      rewards: [{ type: "coins", amount: 145 }],
      intro: "\u0417\u0430\u043A\u043B\u0430\u0434\u043A\u0430 \u0432\u044B\u043F\u0430\u043B\u0430. \u0412\u0435\u0440\u043D\u0438 \u043C\u0435\u0447\u0442\u0443 \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443."
    },
    {
      id: "bk_09",
      world: "attic",
      mechanic: "book",
      name: "\u041F\u044B\u043B\u044C \u0432\u0435\u043A\u043E\u0432",
      difficulty: 4,
      grid: [4, 4],
      blots: [[0, 3]],
      phrase: "\u041F\u042B\u041B\u042C\u2726\u0412\u0415\u041A\u041E\u0412\u2726\u0416\u0414\u0401\u0422",
      scrambled: "\u042C\u041B\u042B\u041F\u2726\u0412\u041E\u041A\u0415\u0412\u2726\u0422\u0401\u0414\u0416",
      rewards: [{ type: "coins", amount: 160 }],
      intro: "\u0422\u0440\u0438 \u0441\u043B\u043E\u0432\u0430, \u0442\u0440\u0438 \u043F\u0435\u0440\u0435\u0434\u044B\u0448\u043A\u0438. \u041F\u044B\u043B\u044C \u0436\u0434\u0430\u0442\u044C \u0443\u043C\u0435\u0435\u0442."
    },
    {
      id: "bk_10",
      world: "attic",
      mechanic: "book",
      name: "\u0425\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u0442\u0438\u0448\u0438\u043D\u044B",
      difficulty: 5,
      grid: [5, 4],
      blots: [[0, 3], [1, 3], [3, 3], [4, 3]],
      phrase: "\u0425\u0420\u0410\u041D\u0418\u0422\u0415\u041B\u042C\u2726\u0422\u0418\u0428\u0418\u041D\u042B",
      scrambled: "\u042C\u041B\u0415\u0422\u0418\u041D\u0410\u0420\u0425\u2726\u042B\u041D\u0418\u0428\u0418\u0422",
      rewards: [{ type: "coins", amount: 220 }, { type: "seals", amount: 1 }],
      intro: "\u0413\u043B\u0430\u0432\u043D\u0430\u044F \u0444\u0440\u0430\u0437\u0430 \u0447\u0435\u0440\u0434\u0430\u043A\u0430. \u0428\u0435\u0441\u0442\u043D\u0430\u0434\u0446\u0430\u0442\u044C \u0431\u0443\u043A\u0432 \u0442\u0438\u0448\u0438\u043D\u044B."
    }
  ];
  var BOOK_PUZZLE_BY_ID = Object.fromEntries(BOOK_PUZZLES.map((p) => [p.id, p]));

  // src/data/puzzlesSeek.js
  function hash(str) {
    let h = 2166136261;
    for (const c of str) h = Math.imul(h ^ c.codePointAt(0), 16777619);
    return h >>> 0;
  }
  function rngFor(seedStr) {
    let seed = hash(seedStr);
    return () => {
      seed |= 0;
      seed = seed + 1831565813 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  var SCENE_SIZE = [1e3, 650];
  function buildScene(level) {
    const rnd = rngFor(level.id);
    const [W, H] = SCENE_SIZE;
    const scene = level.targets.map((t) => ({
      ...t,
      target: true,
      r: t.r ?? 34,
      scale: t.scale ?? 0.55 + rnd() * 0.2,
      rot: (rnd() - 0.5) * 0.4
    }));
    const fillerSet = level.filler.filter((f) => !level.targets.some((t) => t.icon === f));
    const minDist = 64;
    const want = level.fillerCount ?? 60;
    let guard = want * 40;
    let placed = 0;
    while (placed < want && guard-- > 0) {
      const x = 30 + rnd() * (W - 60);
      const y = 30 + rnd() * (H - 60);
      const okScene = scene.every((o) => Math.hypot(o.x - x, o.y - y) > minDist);
      if (!okScene) continue;
      scene.push({
        id: `d${placed}`,
        icon: fillerSet[Math.floor(rnd() * fillerSet.length)],
        x,
        y,
        r: 30,
        target: false,
        scale: 0.8 + rnd() * 0.5,
        rot: (rnd() - 0.5) * 0.5,
        alpha: 0.92 + rnd() * 0.08
      });
      placed += 1;
    }
    return scene;
  }
  function buildFront(level) {
    const rnd = rngFor(level.id + ":front");
    const [W, H] = SCENE_SIZE;
    const pool = level.frontPool || ["\u{1F33F}"];
    const front = [];
    const count = level.frontCount ?? 7;
    for (let i = 0; i < count; i++) {
      const edge = rnd();
      let x;
      let y;
      if (edge < 0.3) {
        x = rnd() * W;
        y = 20 + rnd() * 60;
      } else if (edge < 0.6) {
        x = rnd() * W;
        y = H - 20 - rnd() * 60;
      } else if (edge < 0.8) {
        x = 20 + rnd() * 50;
        y = rnd() * H;
      } else {
        x = 200 + rnd() * (W - 400);
        y = 150 + rnd() * (H - 300);
      }
      front.push({
        icon: pool[Math.floor(rnd() * pool.length)],
        x,
        y,
        scale: 1.3 + rnd() * 0.8,
        rot: (rnd() - 0.5) * 0.6,
        alpha: 0.7 + rnd() * 0.3
      });
    }
    return front;
  }
  var RAW = [
    // --- Мир 1: Тихая опушка ---
    {
      id: "sk_md_01",
      world: "meadow",
      mechanic: "seek",
      name: "\u0423\u0442\u0440\u0435\u043D\u043D\u044F\u044F \u043F\u043E\u043B\u044F\u043D\u0430",
      difficulty: 1,
      targets: [
        { id: "t_key", icon: "\u{1F5DD}\uFE0F", label: "\u0421\u0442\u0430\u0440\u044B\u0439 \u043A\u043B\u044E\u0447", x: 700, y: 430 },
        { id: "t_acorn", icon: "\u{1F330}", label: "\u0416\u0451\u043B\u0443\u0434\u044C", x: 180, y: 520 },
        { id: "t_candle", icon: "\u{1F56F}\uFE0F", label: "\u0421\u0432\u0435\u0447\u0430", x: 330, y: 210 }
      ],
      filler: ["\u{1F33C}", "\u{1F344}", "\u{1F33F}", "\u{1F40C}", "\u{1FAA8}", "\u{1F343}", "\u{1F33E}", "\u{1F41B}", "\u{1F331}", "\u{1FAB5}"],
      frontPool: ["\u{1F33F}", "\u{1F343}", "\u{1F33E}", "\u{1F33C}"],
      fillerCount: 55,
      rewards: [{ type: "coins", amount: 70 }],
      intro: "\u041A\u043E\u0442-\u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u0440\u0430\u0441\u0442\u0435\u0440\u044F\u043B \u043C\u0435\u043B\u043E\u0447\u0438 \u043D\u0430 \u043F\u043E\u043B\u044F\u043D\u0435. \u041D\u0430\u0439\u0434\u0438 \u0438\u0445 \u0441\u0440\u0435\u0434\u0438 \u0442\u0440\u0430\u0432."
    },
    {
      id: "sk_md_02",
      world: "meadow",
      mechanic: "seek",
      name: "\u0421\u0443\u043D\u0434\u0443\u043A \u043F\u043E\u0434 \u043A\u043E\u0440\u043D\u044F\u043C\u0438",
      difficulty: 2,
      targets: [
        { id: "t_map", icon: "\u{1F5FA}\uFE0F", label: "\u041A\u043B\u043E\u0447\u043E\u043A \u043A\u0430\u0440\u0442\u044B", x: 90, y: 300 },
        { id: "t_compass", icon: "\u{1F9ED}", label: "\u041A\u043E\u043C\u043F\u0430\u0441", x: 860, y: 140 },
        { id: "t_ring", icon: "\u{1F48D}", label: "\u041A\u043E\u043B\u0435\u0447\u043A\u043E", x: 520, y: 560 },
        { id: "t_bell", icon: "\u{1F514}", label: "\u041A\u043E\u043B\u043E\u043A\u043E\u043B\u044C\u0447\u0438\u043A", x: 260, y: 470 }
      ],
      filler: ["\u{1F33F}", "\u{1F344}", "\u{1FAA8}", "\u{1F43F}\uFE0F", "\u{1F342}", "\u{1F330}", "\u{1F331}", "\u{1F994}", "\u{1F341}", "\u{1FABA}"],
      frontPool: ["\u{1F33F}", "\u{1F342}", "\u{1F344}"],
      fillerCount: 60,
      rewards: [{ type: "coins", amount: 85 }],
      intro: "\u041F\u043E\u0434 \u043A\u043E\u0440\u043D\u044F\u043C\u0438 \u0441\u0442\u0430\u0440\u043E\u0439 \u0438\u0432\u044B \u0441\u043F\u0440\u044F\u0442\u0430\u043D \u0442\u0430\u0439\u043D\u0438\u043A. \u0421\u043E\u0431\u0435\u0440\u0438 \u0432\u0441\u0451 \u0446\u0435\u043D\u043D\u043E\u0435."
    },
    // --- Мир 2: Средневековый дворик ---
    {
      id: "sk_tw_01",
      world: "town",
      mechanic: "seek",
      name: "\u0420\u044B\u043D\u043E\u0447\u043D\u0430\u044F \u0441\u0443\u0442\u043E\u043B\u043E\u043A\u0430",
      difficulty: 3,
      targets: [
        { id: "t_coin", icon: "\u{1FA99}", label: "\u0423\u0442\u0435\u0440\u044F\u043D\u043D\u0430\u044F \u043C\u043E\u043D\u0435\u0442\u0430", x: 640, y: 180 },
        { id: "t_receipt", icon: "\u{1F9FE}", label: "\u0420\u0430\u0441\u043F\u0438\u0441\u043A\u0430", x: 140, y: 90 },
        { id: "t_spur", icon: "\u2B50", label: "\u0428\u043F\u043E\u0440\u0430", x: 900, y: 470 },
        { id: "t_thread", icon: "\u{1F9F5}", label: "\u041A\u0430\u0442\u0443\u0448\u043A\u0430 \u043D\u0438\u0442\u043E\u043A", x: 360, y: 580 }
      ],
      filler: ["\u{1F34E}", "\u{1F955}", "\u{1F9FA}", "\u{1F35E}", "\u{1F9C0}", "\u{1F956}", "\u{1F3A3}", "\u{1FAA3}", "\u{1F9C8}", "\u{1F95A}"],
      frontPool: ["\u{1F9FA}", "\u{1F38F}", "\u{1F33E}", "\u{1FAA2}"],
      fillerCount: 62,
      rewards: [{ type: "coins", amount: 110 }],
      intro: "\u041D\u0430 \u0440\u044B\u043D\u043A\u0435 \u0432\u0441\u0451 \u043A\u0430\u0442\u0438\u0442\u0441\u044F \u043F\u043E\u0434 \u043F\u0440\u0438\u043B\u0430\u0432\u043A\u0438. \u041F\u043E\u043C\u043E\u0433\u0438 \u0442\u043E\u0440\u0433\u043E\u0432\u043A\u0435 \u0441\u043E\u0431\u0440\u0430\u0442\u044C \u0443\u0442\u0440\u0430\u0447\u0435\u043D\u043D\u043E\u0435."
    },
    {
      id: "sk_tw_02",
      world: "town",
      mechanic: "seek",
      name: "\u0421\u043A\u043B\u0430\u0434 \u043A\u0443\u0437\u043D\u0435\u0446\u0430",
      difficulty: 3,
      targets: [
        { id: "t_tongs", icon: "\u{1F527}", label: "\u041A\u043B\u0435\u0449\u0438", x: 830, y: 540 },
        { id: "t_nail", icon: "\u{1F4CC}", label: "\u0413\u0432\u043E\u0437\u0434\u044C \u043E\u0441\u043E\u0431\u043E\u0439 \u0437\u0430\u043A\u0430\u043B\u043A\u0438", x: 250, y: 160 },
        { id: "t_coal", icon: "\u{1F5A4}", label: "\u0423\u0433\u043E\u043B\u0451\u043A", x: 500, y: 380 },
        { id: "t_glove", icon: "\u{1F9E4}", label: "\u0420\u0443\u043A\u0430\u0432\u0438\u0446\u0430", x: 880, y: 180 }
      ],
      filler: ["\u2699\uFE0F", "\u{1F529}", "\u26D3\uFE0F", "\u{1F528}", "\u{1FA93}", "\u{1F6E2}\uFE0F", "\u{1F9F2}", "\u2692\uFE0F", "\u{1FA9A}", "\u{1F517}"],
      frontPool: ["\u{1F578}\uFE0F", "\u{1F9F1}", "\u{1F32B}\uFE0F"],
      fillerCount: 62,
      rewards: [{ type: "coins", amount: 120 }],
      intro: "\u041A\u0443\u0437\u043D\u0435\u0446 \u043E\u043F\u044F\u0442\u044C \u0432\u0441\u0451 \u0440\u0430\u0437\u0431\u0440\u043E\u0441\u0430\u043B. \u041D\u0430\u0439\u0434\u0438 \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u044B \u0434\u043E \u043F\u0440\u0438\u0445\u043E\u0434\u0430 \u0437\u0430\u043A\u0430\u0437\u0447\u0438\u043A\u0430."
    },
    // --- Мир 3: Книжный чердак ---
    {
      id: "sk_bk_01",
      world: "attic",
      mechanic: "seek",
      name: "\u041F\u044B\u043B\u044C\u043D\u0430\u044F \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430",
      difficulty: 4,
      targets: [
        { id: "t_bookmark", icon: "\u{1F516}", label: "\u0417\u0430\u043A\u043B\u0430\u0434\u043A\u0430", x: 720, y: 260 },
        { id: "t_quill", icon: "\u{1FAB6}", label: "\u041F\u0435\u0440\u043E", x: 130, y: 540 },
        { id: "t_lens", icon: "\u{1F50D}", label: "\u041B\u0443\u043F\u0430", x: 890, y: 540 },
        { id: "t_letter", icon: "\u2709\uFE0F", label: "\u041D\u0435\u0440\u0430\u0441\u043F\u0435\u0447\u0430\u0442\u0430\u043D\u043D\u043E\u0435 \u043F\u0438\u0441\u044C\u043C\u043E", x: 330, y: 80 }
      ],
      filler: ["\u{1F4DA}", "\u{1F4D6}", "\u{1F4DC}", "\u{1F4D5}", "\u{1F4D7}", "\u{1F4D8}", "\u{1F56F}\uFE0F", "\u{1FAD6}", "\u2615", "\u{1F4D3}"],
      frontPool: ["\u{1F4DC}", "\u{1F578}\uFE0F", "\u{1F32B}\uFE0F", "\u{1FAB6}"],
      fillerCount: 65,
      rewards: [{ type: "coins", amount: 140 }],
      intro: "\u041D\u0430 \u0447\u0435\u0440\u0434\u0430\u043A\u0435 \u043A\u0430\u0436\u0434\u0430\u044F \u0432\u0435\u0449\u044C \u043F\u043E\u043C\u043D\u0438\u0442 \u0438\u0441\u0442\u043E\u0440\u0438\u044E. \u041D\u0430\u0439\u0434\u0438 \u0447\u0435\u0442\u044B\u0440\u0435 \u0441\u0430\u043C\u044B\u0435 \u0432\u0430\u0436\u043D\u044B\u0435."
    },
    {
      id: "sk_bk_02",
      world: "attic",
      mechanic: "seek",
      name: "\u0421\u0443\u043D\u0434\u0443\u043A \u0431\u0430\u0431\u0443\u0448\u043A\u0438\u043D\u044B\u0445 \u043F\u0438\u0441\u0435\u043C",
      difficulty: 5,
      bg: "seek_attic2",
      targets: [
        { id: "t_locket", icon: "\u{1F4FF}", label: "\u041C\u0435\u0434\u0430\u043B\u044C\u043E\u043D", x: 930, y: 330 },
        { id: "t_stamp", icon: "\u{1F3F7}\uFE0F", label: "\u0420\u0435\u0434\u043A\u0430\u044F \u043C\u0430\u0440\u043A\u0430", x: 60, y: 540 },
        { id: "t_key2", icon: "\u{1F5DD}\uFE0F", label: "\u041A\u043B\u044E\u0447\u0438\u043A \u043E\u0442 \u0448\u043A\u0430\u0442\u0443\u043B\u043A\u0438", x: 560, y: 560 },
        { id: "t_photo", icon: "\u{1F5BC}\uFE0F", label: "\u0421\u0442\u0430\u0440\u0430\u044F \u0444\u043E\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u044F", x: 240, y: 240 },
        { id: "t_dry", icon: "\u{1F940}", label: "\u0417\u0430\u0441\u043E\u0445\u0448\u0430\u044F \u0440\u043E\u0437\u0430", x: 790, y: 90 }
      ],
      filler: ["\u{1F4DC}", "\u2709\uFE0F", "\u{1F4DA}", "\u{1F58B}\uFE0F", "\u{1F570}\uFE0F", "\u{1F9F8}", "\u{1F3BB}", "\u{1F4D4}", "\u{1F56F}\uFE0F", "\u{1FAD9}", "\u{1F4EF}", "\u{1F3A9}"],
      frontPool: ["\u{1F4DC}", "\u{1F578}\uFE0F", "\u{1F380}", "\u{1F32B}\uFE0F"],
      fillerCount: 72,
      frontCount: 9,
      rewards: [{ type: "coins", amount: 180 }, { type: "seals", amount: 1 }],
      intro: "\u0421\u0430\u043C\u044B\u0439 \u0443\u044E\u0442\u043D\u044B\u0439 \u0442\u0430\u0439\u043D\u0438\u043A \u043B\u0430\u0432\u043A\u0438. \u041F\u044F\u0442\u044C \u043F\u0430\u043C\u044F\u0442\u043D\u044B\u0445 \u0432\u0435\u0449\u0435\u0439 \u0436\u0434\u0443\u0442 \u0441\u0432\u043E\u0435\u0439 \u043F\u043E\u043B\u043A\u0438."
    }
  ];
  var SEEK_PUZZLES = RAW.map((l) => ({
    ...l,
    sceneSize: SCENE_SIZE,
    scene: buildScene(l),
    front: buildFront(l)
  }));
  var SEEK_PUZZLE_BY_ID = Object.fromEntries(SEEK_PUZZLES.map((p) => [p.id, p]));

  // src/data/battles.js
  var BATTLES = [
    {
      id: "bt_slimes",
      name: "\u041B\u0443\u0436\u0430 \u0443 \u0442\u0440\u043E\u043F\u0438\u043D\u043A\u0438",
      world: "meadow",
      enemies: ["slime_meadow", "slime_meadow"],
      unlockAfter: null,
      tip: "\u041F\u0435\u0440\u0432\u044B\u0439 \u0432\u044B\u0445\u043E\u0434 \u0440\u044B\u0446\u0430\u0440\u044F. \u0421\u043B\u0438\u0437\u043D\u0438 \u0441\u043B\u0430\u0431\u043E \u044F\u0434\u043E\u0432\u0438\u0442\u044B."
    },
    {
      id: "bt_bees",
      name: "\u041F\u0447\u0435\u043B\u0438\u043D\u043E\u0435 \u0434\u0435\u0440\u0435\u0432\u043E",
      world: "meadow",
      enemies: ["bee_wild", "bee_wild", "bee_wild"],
      unlockAfter: "bt_slimes",
      tip: "\u041F\u0447\u0451\u043B\u044B \u0431\u044B\u0441\u0442\u0440\u044B \u0438 \u0436\u0430\u043B\u044F\u0442 \u044F\u0434\u043E\u043C. \u041F\u043E\u043C\u043E\u0433\u0443\u0442 \u043F\u0435\u0440\u0447\u0430\u0442\u043A\u0438 \u0442\u0440\u0430\u0432\u043D\u0438\u0446\u044B."
    },
    {
      id: "bt_moths",
      name: "\u041F\u043E\u043B\u044F\u043D\u0430 \u043C\u043E\u0442\u044B\u043B\u044C\u043A\u043E\u0432",
      world: "meadow",
      enemies: ["moth_night", "moth_night", "slime_meadow"],
      unlockAfter: "bt_bees",
      tip: "\u041F\u044B\u043B\u044C\u0446\u0430 \u043C\u043E\u0442\u044B\u043B\u044C\u043A\u043E\u0432 \u0443\u0441\u044B\u043F\u043B\u044F\u0435\u0442. \u0428\u043B\u0435\u043C \u0441\u043E\u043D\u043D\u043E\u0433\u043E \u0431\u0430\u0440\u0441\u0443\u043A\u0430 \u0438\u043B\u0438 \u0437\u0435\u043B\u044C\u0435 \u0431\u043E\u0434\u0440\u043E\u0441\u0442\u0438."
    },
    {
      id: "bt_spirits",
      name: "\u0417\u0430\u0440\u043E\u0441\u0448\u0430\u044F \u0442\u0440\u043E\u043F\u0430",
      world: "meadow",
      enemies: ["spirit_forest", "spirit_forest"],
      unlockAfter: "bt_moths",
      tip: "\u0414\u0443\u0445\u0438 \u0437\u0430\u043C\u0435\u0434\u043B\u044F\u044E\u0442 \u0441\u043F\u043E\u0440\u0430\u043C\u0438. \u041B\u0443\u043A \u0438 \u0442\u043E\u043F\u043E\u0440 \u0431\u044C\u044E\u0442 \u043F\u043E \u043D\u0438\u043C \u0431\u043E\u043B\u044C\u043D\u0435\u0435."
    },
    {
      id: "bt_golem",
      name: "\u041C\u0448\u0438\u0441\u0442\u044B\u0439 \u0441\u0442\u0440\u0430\u0436",
      world: "meadow",
      enemies: ["golem_moss", "slime_meadow"],
      unlockAfter: "bt_spirits",
      tip: "\u0423 \u0433\u043E\u043B\u0435\u043C\u0430 \u0442\u043E\u043B\u0441\u0442\u0430\u044F \u0448\u043A\u0443\u0440\u0430. \u041D\u0443\u0436\u0435\u043D \u0443\u0440\u043E\u043D \u043F\u043E\u0442\u044F\u0436\u0435\u043B\u0435\u0435."
    },
    {
      id: "bt_boss_willow",
      name: "\u0421\u0442\u0430\u0440\u0430\u044F \u0438\u0432\u0430",
      world: "meadow",
      enemies: ["boss_willow"],
      unlockAfter: "bt_golem",
      tip: "\u0425\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u0438\u0432\u044B \u2014 \u0438\u0441\u043F\u044B\u0442\u0430\u043D\u0438\u0435 \u0432\u0441\u0435\u0433\u043E, \u0447\u0435\u043C\u0443 \u0442\u044B \u043D\u0430\u0443\u0447\u0438\u043B\u0441\u044F."
    }
  ];
  BATTLES.push(
    {
      id: "bt_rats",
      name: "\u041A\u0440\u044B\u0441\u0438\u043D\u044B\u0439 \u043F\u0435\u0440\u0435\u0443\u043B\u043E\u043A",
      world: "town",
      enemies: ["rat_thief", "rat_thief", "rat_thief"],
      unlockAfter: "bt_boss_willow",
      tip: "\u041A\u0440\u044B\u0441\u044B \u0448\u0443\u0441\u0442\u0440\u044B\u0435 \u0438 \u044F\u0434\u043E\u0432\u0438\u0442\u044B\u0435. \u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u0438 \u0430\u043D\u0442\u0438\u0434\u043E\u0442 \u0440\u0435\u0448\u0430\u044E\u0442."
    },
    {
      id: "bt_bandits",
      name: "\u0417\u0430\u0441\u0442\u0430\u0432\u0430 \u0443 \u0441\u043A\u043B\u0430\u0434\u0430",
      world: "town",
      enemies: ["bandit", "rat_thief", "bandit"],
      unlockAfter: "bt_rats",
      tip: "\u0420\u0430\u0437\u0431\u043E\u0439\u043D\u0438\u043A\u0438 \u0431\u044C\u044E\u0442 \u0441\u0438\u043B\u044C\u043D\u043E. \u0425\u043E\u0440\u043E\u0448\u0430\u044F \u0431\u0440\u043E\u043D\u044F \u0438 \u0449\u0438\u0442 \u2014 \u043A\u0430\u043A \u043D\u0438\u043A\u043E\u0433\u0434\u0430 \u043A\u0441\u0442\u0430\u0442\u0438."
    },
    {
      id: "bt_wander_golem",
      name: "\u0411\u0440\u043E\u0434\u044F\u0447\u0430\u044F \u043A\u043B\u0430\u0434\u043A\u0430",
      world: "town",
      enemies: ["golem_wander", "rat_thief"],
      unlockAfter: "bt_bandits",
      tip: "\u0423 \u0433\u043E\u043B\u0435\u043C\u0430 \u043A\u0430\u043C\u0435\u043D\u043D\u0430\u044F \u0448\u043A\u0443\u0440\u0430 \u2014 \u0431\u0435\u0440\u0438\u0442\u0435 \u0442\u044F\u0436\u0451\u043B\u043E\u0435 \u043E\u0440\u0443\u0436\u0438\u0435."
    },
    {
      id: "bt_ghost_watch",
      name: "\u041D\u043E\u0447\u043D\u043E\u0439 \u043E\u0431\u0445\u043E\u0434",
      world: "town",
      enemies: ["ghost_guard", "ghost_guard"],
      unlockAfter: "bt_wander_golem",
      tip: "\u041F\u0440\u0438\u0437\u0440\u0430\u043A\u0438 \u043D\u0430\u0432\u043E\u0434\u044F\u0442 \u0441\u0442\u0440\u0430\u0445. \u041B\u0443\u043A \u0438 \u0442\u043E\u043F\u043E\u0440 \u0431\u044C\u044E\u0442 \u043F\u043E \u0434\u0443\u0445\u0430\u043C \u0431\u043E\u043B\u044C\u043D\u0435\u0435."
    },
    {
      id: "bt_town_mix",
      name: "\u0421\u0443\u043C\u0430\u0442\u043E\u0445\u0430 \u043D\u0430 \u0440\u044B\u043D\u043A\u0435",
      world: "town",
      enemies: ["bandit", "ghost_guard", "rat_thief"],
      unlockAfter: "bt_ghost_watch",
      tip: "\u0421\u043C\u0435\u0448\u0430\u043D\u043D\u0430\u044F \u0441\u0442\u0430\u044F: \u044F\u0434, \u0441\u0442\u0440\u0430\u0445 \u0438 \u0442\u044F\u0436\u0451\u043B\u044B\u0435 \u0443\u0434\u0430\u0440\u044B. \u0413\u043E\u0442\u043E\u0432\u044C\u0441\u044F \u043A\u0430\u043A \u0441\u043B\u0435\u0434\u0443\u0435\u0442."
    },
    {
      id: "bt_boss_captain",
      name: "\u0421\u0442\u0430\u0440\u044B\u0439 \u043A\u0430\u043F\u0438\u0442\u0430\u043D",
      world: "town",
      enemies: ["boss_captain"],
      unlockAfter: "bt_town_mix",
      tip: "\u041A\u0430\u043F\u0438\u0442\u0430\u043D \u0441\u0442\u0440\u0430\u0436\u0438 \u043D\u0435 \u043E\u0442\u0434\u044B\u0445\u0430\u0435\u0442 \u0432\u0435\u043A\u0430\u043C\u0438. \u041F\u043E\u043A\u0430\u0436\u0438 \u0435\u043C\u0443, \u0447\u0442\u043E \u043B\u0430\u0432\u043A\u0430 \u043F\u043E\u0434 \u0437\u0430\u0449\u0438\u0442\u043E\u0439."
    }
  );
  BATTLES.push(
    {
      id: "bk_blots",
      name: "\u041F\u0440\u043E\u043B\u0438\u0442\u044B\u0435 \u0447\u0435\u0440\u043D\u0438\u043B\u0430",
      world: "attic",
      enemies: ["ink_blot", "ink_blot"],
      unlockAfter: "bt_boss_captain",
      tip: "\u041A\u043B\u044F\u043A\u0441\u044B \u0442\u0440\u0430\u0432\u044F\u0442 \u0438 \u0437\u0430\u043C\u0435\u0434\u043B\u044F\u044E\u0442. \u0410\u043C\u0443\u043B\u0435\u0442 \u043F\u0440\u043E\u0442\u0438\u0432\u043E\u044F\u0434\u0438\u044F \u043F\u0440\u0438\u0433\u043E\u0434\u0438\u0442\u0441\u044F."
    },
    {
      id: "bk_moths",
      name: "\u041C\u043E\u043B\u044C \u0432 \u0444\u043E\u043B\u0438\u0430\u043D\u0442\u0435",
      world: "attic",
      enemies: ["book_moth", "book_moth", "ink_blot"],
      unlockAfter: "bk_blots",
      tip: "\u041A\u043D\u0438\u0436\u043D\u0430\u044F \u043C\u043E\u043B\u044C \u0443\u0441\u044B\u043F\u043B\u044F\u0435\u0442, \u043A\u0430\u043A \u0438 \u0435\u0451 \u043B\u0435\u0441\u043D\u044B\u0435 \u0441\u0451\u0441\u0442\u0440\u044B. \u0428\u043B\u0435\u043C \u0431\u0430\u0440\u0441\u0443\u043A\u0430 \u0432\u0441\u0451 \u0435\u0449\u0451 \u0432 \u0446\u0435\u043D\u0435."
    },
    {
      id: "bk_spirits",
      name: "\u0428\u043E\u0440\u043E\u0445\u0438 \u0441\u0442\u0440\u0430\u043D\u0438\u0446",
      world: "attic",
      enemies: ["paper_spirit", "paper_spirit"],
      unlockAfter: "bk_moths",
      tip: "\u0411\u0443\u043C\u0430\u0436\u043D\u044B\u0435 \u0434\u0443\u0445\u0438 \u043D\u0430\u0432\u043E\u0434\u044F\u0442 \u0441\u0442\u0440\u0430\u0445. \u0410\u043C\u0443\u043B\u0435\u0442 \u043E\u0442\u0432\u0430\u0433\u0438 \u0438\u043B\u0438 \u0442\u043E\u043F\u043E\u0440 \u0434\u0440\u043E\u0432\u043E\u0441\u0435\u043A\u0430."
    },
    {
      id: "bk_illustration",
      name: "\u0412\u0438\u0442\u0440\u0430\u0436\u043D\u0430\u044F \u0433\u0440\u0430\u0432\u044E\u0440\u0430",
      world: "attic",
      enemies: ["illustration", "book_moth"],
      unlockAfter: "bk_spirits",
      tip: "\u041E\u0436\u0438\u0432\u0448\u0430\u044F \u0438\u043B\u043B\u044E\u0441\u0442\u0440\u0430\u0446\u0438\u044F \u0442\u043E\u043B\u0441\u0442\u043E\u043A\u043E\u0436\u0430. \u041F\u0440\u043E\u0431\u0438\u0432\u0430\u0439 \u0442\u044F\u0436\u0451\u043B\u044B\u043C \u043E\u0440\u0443\u0436\u0438\u0435\u043C."
    },
    {
      id: "bk_storm",
      name: "\u0411\u0443\u0440\u044F \u0432 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0435",
      world: "attic",
      enemies: ["paper_spirit", "ink_blot", "book_moth"],
      unlockAfter: "bk_illustration",
      tip: "\u0412\u0441\u0435 \u043E\u0431\u0438\u0442\u0430\u0442\u0435\u043B\u0438 \u0447\u0435\u0440\u0434\u0430\u043A\u0430 \u0440\u0430\u0437\u043E\u043C. \u041F\u0440\u043E\u0432\u0435\u0440\u044C \u0441\u043E\u043F\u0440\u043E\u0442\u0438\u0432\u043B\u0435\u043D\u0438\u044F \u0438 \u0437\u0435\u043B\u044C\u044F."
    },
    {
      id: "bk_boss_keeper",
      name: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430",
      world: "attic",
      enemies: ["boss_keeper"],
      unlockAfter: "bk_storm",
      tip: "\u0425\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u043D\u0435 \u043E\u0442\u0434\u0430\u0441\u0442 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443 \u0431\u0435\u0437 \u0431\u043E\u044F. \u0421\u043E\u0431\u0435\u0440\u0438 \u0432\u0441\u0451 \u043B\u0443\u0447\u0448\u0435\u0435, \u0447\u0442\u043E \u0443 \u0442\u0435\u0431\u044F \u0435\u0441\u0442\u044C."
    }
  );
  var BATTLE_BY_ID = Object.fromEntries(BATTLES.map((b) => [b.id, b]));

  // src/data/crew.js
  var COMPANIONS = [
    {
      id: "cmp_firefly",
      name: "\u0421\u0432\u0435\u0442\u043B\u044F\u0447\u043E\u043A",
      icon: "\u2728",
      price: 90,
      currency: "coins",
      bonus: { itemFind: 0.1 },
      trait: "firefly_hint",
      description: "\u041F\u043E\u0434\u0441\u0432\u0435\u0447\u0438\u0432\u0430\u0435\u0442 \u043F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0438 \u0438 \u043D\u0430\u0445\u043E\u0434\u0438\u0442 \u0441\u0432\u0435\u0442\u044F\u0449\u0438\u0435\u0441\u044F \u043C\u0435\u043B\u043E\u0447\u0438."
    },
    {
      id: "cmp_herbalist",
      name: "\u0422\u0440\u0430\u0432\u043D\u0438\u0446\u0430",
      icon: "\u{1F33F}",
      price: 140,
      currency: "coins",
      bonus: {},
      trait: "regen_ally",
      description: "\u0412 \u0431\u043E\u044E \u0442\u0438\u0445\u043E \u043F\u043E\u0434\u043B\u0435\u0447\u0438\u0432\u0430\u0435\u0442 \u0440\u044B\u0446\u0430\u0440\u044F \u0442\u0440\u0430\u0432\u044F\u043D\u044B\u043C \u043E\u0442\u0432\u0430\u0440\u043E\u043C."
    },
    {
      id: "cmp_cat",
      name: "\u041A\u043E\u0442-\u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C",
      icon: "\u{1F408}",
      price: 110,
      currency: "coins",
      bonus: { goldFind: 0.1, dodge: 0.02 },
      trait: null,
      description: "\u041F\u043E\u0432\u044B\u0448\u0430\u0435\u0442 \u0443\u0434\u0430\u0447\u0443 \u0438 \u0438\u043D\u043E\u0433\u0434\u0430 \u043D\u0430\u0445\u043E\u0434\u0438\u0442 \u043C\u043E\u043D\u0435\u0442\u044B."
    },
    {
      id: "cmp_smith",
      name: "\u041A\u0443\u0437\u043D\u0435\u0446-\u043F\u043E\u0434\u043C\u0430\u0441\u0442\u0435\u0440\u044C\u0435",
      icon: "\u2692\uFE0F",
      price: 2,
      currency: "seals",
      bonus: { armor: 6 },
      trait: null,
      description: "\u041F\u043E\u0434\u043F\u0440\u0430\u0432\u043B\u044F\u0435\u0442 \u0431\u0440\u043E\u043D\u044E \u043F\u0440\u044F\u043C\u043E \u0432 \u043F\u043E\u0445\u043E\u0434\u0435."
    }
  ];
  var PETS = [
    {
      id: "pet_puppy",
      name: "\u0429\u0435\u043D\u043E\u043A",
      icon: "\u{1F415}",
      price: 80,
      currency: "coins",
      bonus: { goldFind: 0.15 },
      description: "\u0411\u0435\u0436\u0438\u0442 \u0440\u044F\u0434\u043E\u043C \u0438 \u0441\u043E\u0431\u0438\u0440\u0430\u0435\u0442 \u043C\u043E\u043D\u0435\u0442\u044B \u043F\u043E\u0441\u043B\u0435 \u0431\u043E\u044F."
    },
    {
      id: "pet_hedgehog",
      name: "\u0401\u0436\u0438\u043A",
      icon: "\u{1F994}",
      price: 95,
      currency: "coins",
      bonus: { itemFind: 0.12 },
      description: "\u041D\u0430\u0445\u043E\u0434\u0438\u0442 \u043C\u0435\u043B\u043A\u0438\u0435 \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u044B \u0432 \u0442\u0440\u0430\u0432\u0435."
    },
    {
      id: "pet_fox",
      name: "\u041B\u0438\u0441\u0451\u043D\u043E\u043A",
      icon: "\u{1F98A}",
      price: 3,
      currency: "seals",
      bonus: { crit: 0.04, goldFind: 0.05 },
      description: "\u0425\u0438\u0442\u0440\u044B\u0439 \u0432\u0437\u0433\u043B\u044F\u0434 \u043F\u043E\u043C\u043E\u0433\u0430\u0435\u0442 \u043D\u0430\u0445\u043E\u0434\u0438\u0442\u044C \u0441\u043B\u0430\u0431\u044B\u0435 \u043C\u0435\u0441\u0442\u0430 \u0432\u0440\u0430\u0433\u043E\u0432."
    }
  ];
  var MERCENARIES = [
    {
      id: "merc_archer",
      name: "\u041B\u0435\u0441\u043D\u0430\u044F \u043B\u0443\u0447\u043D\u0438\u0446\u0430",
      icon: "\u{1F3F9}",
      race: "\u044D\u043B\u044C\u0444",
      role: "\u0441\u0442\u0440\u0435\u043B\u043E\u043A",
      price: 120,
      currency: "coins",
      hp: 40,
      attack: 14,
      armor: 4,
      speed: 12,
      crit: 0.12,
      dodge: 0.08,
      skills: ["aimed_shot"],
      tags: ["forest", "ranged"],
      description: "\u0411\u044C\u0451\u0442 \u0441\u0430\u043C\u043E\u0433\u043E \u0445\u0440\u0443\u043F\u043A\u043E\u0433\u043E \u0432\u0440\u0430\u0433\u0430 \u043F\u0440\u0438\u0446\u0435\u043B\u044C\u043D\u044B\u043C \u0432\u044B\u0441\u0442\u0440\u0435\u043B\u043E\u043C."
    },
    {
      id: "merc_guard",
      name: "\u0414\u0432\u043E\u0440\u043E\u0432\u044B\u0439 \u0433\u0440\u043E\u043C\u0438\u043B\u0430",
      icon: "\u{1F528}",
      race: "\u0447\u0435\u043B\u043E\u0432\u0435\u043A",
      role: "\u0442\u0430\u043D\u043A",
      price: 150,
      currency: "coins",
      hp: 85,
      attack: 9,
      armor: 16,
      speed: 6,
      crit: 0.03,
      dodge: 0,
      block: 0.2,
      skills: [],
      tags: ["town"],
      description: "\u0414\u0435\u0440\u0436\u0438\u0442 \u0443\u0434\u0430\u0440, \u043F\u043E\u043A\u0430 \u0440\u044B\u0446\u0430\u0440\u044C \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442."
    },
    {
      id: "merc_witch",
      name: "\u0412\u0435\u0434\u044C\u043C\u0438\u043D\u043A\u0430 \u0441 \u0442\u043E\u043F\u0435\u0439",
      icon: "\u{1F9EA}",
      race: "\u0447\u0435\u043B\u043E\u0432\u0435\u043A",
      role: "\u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430",
      price: 200,
      currency: "coins",
      hp: 45,
      attack: 8,
      armor: 5,
      speed: 9,
      crit: 0.05,
      dodge: 0.05,
      skills: ["sting_poison", "regen_ally_skill"],
      tags: ["swamp"],
      description: "\u0422\u0440\u0430\u0432\u0438\u0442 \u0432\u0440\u0430\u0433\u043E\u0432 \u0438 \u043F\u043E\u0434\u043B\u0438\u0432\u0430\u0435\u0442 \u0440\u044B\u0446\u0430\u0440\u044E \u0436\u0438\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u043D\u0430\u0441\u0442\u043E\u0439."
    },
    {
      id: "merc_knight_errant",
      name: "\u0421\u0442\u0440\u0430\u043D\u0441\u0442\u0432\u0443\u044E\u0449\u0438\u0439 \u043A\u043B\u0438\u043D\u043E\u043A",
      icon: "\u2694\uFE0F",
      race: "\u0447\u0435\u043B\u043E\u0432\u0435\u043A",
      role: "\u0431\u043E\u0435\u0446",
      price: 4,
      currency: "seals",
      hp: 70,
      attack: 16,
      armor: 12,
      speed: 10,
      crit: 0.1,
      dodge: 0.05,
      block: 0.1,
      skills: ["heavy_blow"],
      tags: ["town"],
      description: "\u0418\u0449\u0435\u0442 \u043B\u0430\u0432\u043A\u0443 \u043D\u0430 \u043F\u0435\u0440\u0435\u043A\u0440\u0451\u0441\u0442\u043A\u0435 \u043C\u0438\u0440\u043E\u0432. \u041A\u0430\u0436\u0435\u0442\u0441\u044F, \u043D\u0430\u0448\u0451\u043B."
    }
  ];
  PETS.push(
    {
      id: "pet_horse",
      name: "\u0421\u0438\u0432\u043A\u0430",
      icon: "\u{1F434}",
      kind: "riding",
      price: 260,
      currency: "coins",
      bonus: { speed: 2, materialsFind: 0.5 },
      description: "\u0415\u0437\u0434\u043E\u0432\u043E\u0439: \u0431\u044B\u0441\u0442\u0440\u0435\u0435 \u0434\u043E\u0440\u043E\u0433\u0438, \u0431\u043E\u043B\u044C\u0448\u0435 \u043C\u0430\u0442\u0435\u0440\u0438\u0430\u043B\u043E\u0432 \u043F\u043E\u0441\u043B\u0435 \u0431\u043E\u044F."
    },
    {
      id: "pet_owl",
      name: "\u0421\u043E\u0432\u0430-\u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430\u0440\u044C",
      icon: "\u{1F989}",
      kind: "flying",
      price: 4,
      currency: "seals",
      bonus: { dodge: 0.05, crit: 0.03 },
      description: "\u041B\u0435\u0442\u0430\u044E\u0449\u0438\u0439 \u043F\u043E\u043C\u043E\u0449\u043D\u0438\u043A: \u0432\u0438\u0434\u0438\u0442 \u0441\u043B\u0430\u0431\u044B\u0435 \u043C\u0435\u0441\u0442\u0430 \u0438 \u0441\u043D\u0438\u0436\u0430\u0435\u0442 \u0448\u0430\u043D\u0441 \u0437\u0430\u0441\u0430\u0434\u044B."
    }
  );
  var COMPANION_BY_ID = Object.fromEntries(COMPANIONS.map((c) => [c.id, c]));
  var PET_BY_ID = Object.fromEntries(PETS.map((p) => [p.id, p]));
  var MERC_BY_ID = Object.fromEntries(MERCENARIES.map((m) => [m.id, m]));

  // src/data/cosmetics.js
  var COSMETICS = [
    // Круглый год
    {
      id: "cos_carpet",
      name: "\u041A\u043E\u0432\u0451\u0440 \u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044F",
      icon: "\u{1F7E5}",
      price: 200,
      season: null,
      description: "\u0413\u043B\u0443\u0431\u043E\u043A\u0438\u0439 \u0431\u043E\u0440\u0434\u043E\u0432\u044B\u0439 \u043A\u043E\u0432\u0451\u0440 \u0432 \u0446\u0435\u043D\u0442\u0440\u0435 \u043B\u0430\u0432\u043A\u0438."
    },
    {
      id: "cos_crest",
      name: "\u0424\u0438\u0440\u043C\u0435\u043D\u043D\u0430\u044F \u0432\u044B\u0432\u0435\u0441\u043A\u0430",
      icon: "\u{1FAA7}",
      sealPrice: 2,
      season: null,
      description: "\u0420\u0435\u0437\u043D\u0430\u044F \u0432\u044B\u0432\u0435\u0441\u043A\u0430 \xAB\u041B\u0430\u0432\u043A\u0430 \u043D\u0430 \u043F\u0435\u0440\u0435\u043A\u0440\u0451\u0441\u0442\u043A\u0435 \u043C\u0438\u0440\u043E\u0432\xBB."
    },
    // Сезонные наборы
    {
      id: "cos_flowers",
      name: "\u0412\u0435\u0441\u0435\u043D\u043D\u044F\u044F \u044F\u0440\u043C\u0430\u0440\u043A\u0430: \u0446\u0432\u0435\u0442\u044B",
      icon: "\u{1F338}",
      price: 120,
      season: "spring",
      description: "\u041F\u043E\u043B\u043A\u0438 \u0432 \u0446\u0432\u0435\u0442\u0430\u0445. \u041F\u0430\u0445\u043D\u0435\u0442 \u043F\u0435\u0440\u0432\u044B\u043C \u0434\u043E\u0436\u0434\u0451\u043C."
    },
    {
      id: "cos_fireflies",
      name: "\u041B\u0435\u0442\u043D\u0438\u0439 \u0444\u0435\u0441\u0442\u0438\u0432\u0430\u043B\u044C: \u0441\u0432\u0435\u0442\u043B\u044F\u0447\u043A\u0438",
      icon: "\u2728",
      price: 120,
      season: "summer",
      description: "\u041C\u0430\u043B\u0435\u043D\u044C\u043A\u0438\u0435 \u043E\u0433\u043E\u043D\u044C\u043A\u0438 \u043A\u0440\u0443\u0436\u0430\u0442 \u043D\u0430\u0434 \u043F\u0440\u0438\u043B\u0430\u0432\u043A\u043E\u043C."
    },
    {
      id: "cos_garland",
      name: "\u041E\u0441\u0435\u043D\u043D\u0438\u0439 \u0440\u044B\u043D\u043E\u043A: \u0433\u0438\u0440\u043B\u044F\u043D\u0434\u0430",
      icon: "\u{1F38F}",
      price: 120,
      season: "autumn",
      description: "\u0424\u043B\u0430\u0436\u043A\u0438 \u0438 \u0436\u0451\u043B\u0443\u0434\u0438 \u043F\u043E\u0434 \u043F\u043E\u0442\u043E\u043B\u043A\u043E\u043C."
    },
    {
      id: "cos_snow",
      name: "\u0417\u0438\u043C\u043D\u0438\u0439 \u043E\u0447\u0430\u0433: \u0441\u043D\u0435\u0433 \u0437\u0430 \u043E\u043A\u043D\u043E\u043C",
      icon: "\u2744\uFE0F",
      price: 150,
      season: "winter",
      description: "\u0417\u0430 \u043E\u043A\u043D\u043E\u043C \u0442\u0438\u0445\u043E \u043F\u0430\u0434\u0430\u0435\u0442 \u0441\u043D\u0435\u0433. \u0412\u043D\u0443\u0442\u0440\u0438 \u2014 \u0442\u0435\u043F\u043B\u043E."
    }
  ];
  var COSMETIC_BY_ID = Object.fromEntries(COSMETICS.map((c) => [c.id, c]));
  var SEASON_LABEL = {
    spring: "\u0412\u0435\u0441\u043D\u0430",
    summer: "\u041B\u0435\u0442\u043E",
    autumn: "\u041E\u0441\u0435\u043D\u044C",
    winter: "\u0417\u0438\u043C\u0430"
  };

  // src/data/recipes.js
  var RECIPES = [
    // --- Зелья ---
    {
      id: "rcp_pot_heal",
      name: "\u0421\u0432\u0430\u0440\u0438\u0442\u044C \u0437\u0435\u043B\u044C\u0435 \u043B\u0435\u0447\u0435\u043D\u0438\u044F",
      icon: "\u{1F9EA}",
      kind: "potion",
      result: { itemId: "pot_heal", count: 1 },
      materials: { slime_jelly: 2, honey: 1 },
      unlockAfter: "bt_bees",
      note: "\u0421\u043B\u0438\u0437\u044C \u0434\u0430\u0451\u0442 \u0442\u0435\u043B\u043E, \u043C\u0451\u0434 \u2014 \u043C\u044F\u0433\u043A\u043E\u0441\u0442\u044C."
    },
    {
      id: "rcp_pot_vigor",
      name: "\u0421\u0432\u0430\u0440\u0438\u0442\u044C \u0437\u0435\u043B\u044C\u0435 \u0431\u043E\u0434\u0440\u043E\u0441\u0442\u0438",
      icon: "\u{1F9EA}",
      kind: "potion",
      result: { itemId: "pot_vigor", count: 1 },
      materials: { moth_dust: 2, honey: 1 },
      unlockAfter: "bt_moths",
      note: "\u041F\u044B\u043B\u044C\u0446\u0430 \u043C\u043E\u0442\u044B\u043B\u044C\u043A\u0430 \u0432 \u043C\u0430\u043B\u044B\u0445 \u0434\u043E\u0437\u0430\u0445 \u0431\u043E\u0434\u0440\u0438\u0442."
    },
    {
      id: "rcp_pot_stone",
      name: "\u0421\u0432\u0430\u0440\u0438\u0442\u044C \u0437\u0435\u043B\u044C\u0435 \u043A\u0430\u043C\u0435\u043D\u043D\u043E\u0439 \u043A\u043E\u0436\u0438",
      icon: "\u{1F9EA}",
      kind: "potion",
      result: { itemId: "pot_stone", count: 1 },
      materials: { brick_chunk: 2, moss_stone: 1 },
      unlockAfter: "bt_wander_golem",
      note: "\u0420\u0430\u0441\u0442\u0432\u043E\u0440\u0438\u0442\u044C \u043A\u043B\u0430\u0434\u043A\u0443 \u2014 \u0441\u0442\u0430\u0442\u044C \u043A\u043B\u0430\u0434\u043A\u043E\u0439. \u041D\u0430 \u043E\u0434\u0438\u043D \u0431\u043E\u0439."
    },
    {
      id: "rcp_pot_ink",
      name: "\u0421\u0432\u0430\u0440\u0438\u0442\u044C \u0447\u0435\u0440\u043D\u0438\u043B\u044C\u043D\u044B\u0439 \u043E\u0442\u0432\u0430\u0440",
      icon: "\u{1F9EA}",
      kind: "potion",
      result: { itemId: "pot_ink", count: 1 },
      materials: { ink_drop: 2, page_dust: 1 },
      unlockAfter: "bk_blots",
      note: "\u0413\u043E\u0440\u044C\u043A\u043E, \u0437\u0430\u0442\u043E \u044F\u0434 \u0443\u0445\u043E\u0434\u0438\u0442."
    },
    // --- Снаряжение ---
    {
      id: "rcp_dagger_firefly",
      name: "\u0412\u044B\u043A\u043E\u0432\u0430\u0442\u044C \u043A\u0438\u043D\u0436\u0430\u043B \u0441\u0432\u0435\u0442\u043B\u044F\u0447\u043A\u0430",
      icon: "\u{1F52A}",
      kind: "gear",
      result: { itemId: "wpn_dagger_firefly", count: 1 },
      materials: { glow_moss: 3, moss_stone: 1 },
      coins: 50,
      unlockAfter: "bt_spirits",
      note: "\u041C\u043E\u0445 \u0441\u0432\u0435\u0442\u0438\u0442\u0441\u044F \u0432 \u043A\u043B\u0438\u043D\u043A\u0435, \u0435\u0441\u043B\u0438 \u0437\u043D\u0430\u0442\u044C, \u043A\u0443\u0434\u0430 \u0435\u0433\u043E \u0432\u0448\u0438\u0442\u044C."
    },
    {
      id: "rcp_rng_luck",
      name: "\u0421\u043B\u0435\u043F\u0438\u0442\u044C \u043A\u043E\u043B\u044C\u0446\u043E \u0443\u0434\u0430\u0447\u0438",
      icon: "\u{1F48D}",
      kind: "gear",
      result: { itemId: "rng_luck", count: 1 },
      materials: { honey: 2, moth_dust: 1 },
      unlockAfter: "bt_moths",
      note: "\u041C\u0451\u0434 \u0434\u0435\u0440\u0436\u0438\u0442 \u0444\u043E\u0440\u043C\u0443, \u043F\u044B\u043B\u044C\u0446\u0430 \u0434\u0435\u0440\u0436\u0438\u0442 \u0443\u0434\u0430\u0447\u0443."
    },
    {
      id: "rcp_amu_antidote",
      name: "\u0421\u043E\u0431\u0440\u0430\u0442\u044C \u0430\u043C\u0443\u043B\u0435\u0442 \u043F\u0440\u043E\u0442\u0438\u0432\u043E\u044F\u0434\u0438\u044F",
      icon: "\u{1F4FF}",
      kind: "gear",
      result: { itemId: "amu_antidote", count: 1 },
      materials: { rat_tail: 2, glow_moss: 2 },
      unlockAfter: "bt_rats",
      note: "\u041A\u0440\u044B\u0441\u0438\u043D\u044B\u0439 \u0445\u0432\u043E\u0441\u0442 \u2014 \u043B\u0443\u0447\u0448\u0438\u0439 \u043C\u0430\u0433\u043D\u0438\u0442 \u0434\u043B\u044F \u044F\u0434\u0430."
    },
    {
      id: "rcp_glv_smithee",
      name: "\u0421\u0448\u0438\u0442\u044C \u0440\u0443\u043A\u0430\u0432\u0438\u0446\u044B \u043A\u0443\u0437\u043D\u0435\u0446\u0430",
      icon: "\u{1F9E4}",
      kind: "gear",
      result: { itemId: "glv_smithee", count: 1 },
      materials: { torn_cloth: 2, brick_chunk: 1 },
      unlockAfter: "bt_bandits",
      note: "\u0422\u043A\u0430\u043D\u044C, \u043F\u0440\u043E\u043F\u0438\u0442\u0430\u043D\u043D\u0430\u044F \u043A\u0430\u043C\u0435\u043D\u043D\u043E\u0439 \u043F\u044B\u043B\u044C\u044E, \u043D\u0435 \u0433\u043E\u0440\u0438\u0442."
    },
    {
      id: "rcp_shd_guardian",
      name: "\u0412\u044B\u043A\u043E\u0432\u0430\u0442\u044C \u0449\u0438\u0442 \u0441\u0442\u0440\u0430\u0436\u0430 \u043B\u0430\u0432\u043A\u0438",
      icon: "\u{1F6E1}\uFE0F",
      kind: "gear",
      result: { itemId: "shd_guardian", count: 1 },
      materials: { moss_stone: 2, brick_chunk: 2, torn_cloth: 1 },
      coins: 80,
      unlockAfter: "bt_golem",
      note: "\u0422\u044F\u0436\u0451\u043B\u044B\u0439, \u043D\u0430\u0434\u0451\u0436\u043D\u044B\u0439, \u0441 \u043C\u044F\u0433\u043A\u043E\u0439 \u043F\u043E\u0434\u043A\u043B\u0430\u0434\u043A\u043E\u0439."
    },
    {
      id: "rcp_lumberaxe",
      name: "\u0412\u044B\u043A\u043E\u0432\u0430\u0442\u044C \u0442\u043E\u043F\u043E\u0440 \u0434\u0440\u043E\u0432\u043E\u0441\u0435\u043A\u0430",
      icon: "\u{1FA93}",
      kind: "gear",
      result: { itemId: "wpn_lumberaxe", count: 1 },
      materials: { willow_heart: 1, brick_chunk: 2 },
      coins: 120,
      unlockAfter: "bt_boss_willow",
      note: "\u0421\u0435\u0440\u0434\u0446\u0435 \u0438\u0432\u044B \u043F\u043E\u043C\u043D\u0438\u0442, \u043A\u0430\u043A \u0440\u0430\u0441\u0442\u0438 \u2014 \u0438 \u043A\u0430\u043A \u0440\u0443\u0431\u0438\u0442\u044C."
    },
    {
      id: "rcp_rng_ink",
      name: "\u041E\u0442\u043B\u0438\u0442\u044C \u043A\u043E\u043B\u044C\u0446\u043E \u0447\u0435\u0440\u043D\u0438\u043B",
      icon: "\u{1F48D}",
      kind: "gear",
      result: { itemId: "rng_ink", count: 1 },
      materials: { ink_drop: 3, paper_scrap: 1 },
      unlockAfter: "bk_blots",
      note: "\u0427\u0435\u0440\u043D\u0438\u043B\u0430 \u0437\u0430\u0441\u0442\u044B\u0432\u0430\u044E\u0442, \u043D\u043E \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u044E\u0442 \u043F\u0438\u0441\u0430\u0442\u044C."
    },
    {
      id: "rcp_amu_pages",
      name: "\u0421\u043E\u0431\u0440\u0430\u0442\u044C \u0430\u043C\u0443\u043B\u0435\u0442 \u0441\u0442\u0440\u0430\u043D\u0438\u0446",
      icon: "\u{1F4FF}",
      kind: "gear",
      result: { itemId: "amu_pages", count: 1 },
      materials: { page_dust: 3, gold_leaf: 1, ectoplasm: 1 },
      unlockAfter: "bk_illustration",
      note: "\u041F\u044B\u043B\u044C \u0432\u0435\u043A\u043E\u0432, \u0437\u043E\u043B\u043E\u0442\u043E \u0438 \u043A\u0430\u043F\u043B\u044F \u043F\u043E\u0442\u0443\u0441\u0442\u043E\u0440\u043E\u043D\u043D\u0435\u0433\u043E."
    }
  ];
  var RECIPE_BY_ID = Object.fromEntries(RECIPES.map((r) => [r.id, r]));

  // src/core/items.js
  var SLOTS = ["weapon", "shield", "helmet", "armor", "gloves", "boots", "amulet", "ring1", "ring2"];
  var SLOT_LABEL = {
    weapon: "\u041E\u0440\u0443\u0436\u0438\u0435",
    shield: "\u0429\u0438\u0442",
    helmet: "\u0428\u043B\u0435\u043C",
    armor: "\u0411\u0440\u043E\u043D\u044F",
    gloves: "\u041F\u0435\u0440\u0447\u0430\u0442\u043A\u0438",
    boots: "\u0421\u0430\u043F\u043E\u0433\u0438",
    amulet: "\u0410\u043C\u0443\u043B\u0435\u0442",
    ring1: "\u041A\u043E\u043B\u044C\u0446\u043E 1",
    ring2: "\u041A\u043E\u043B\u044C\u0446\u043E 2"
  };
  function emptyEquipment() {
    return Object.fromEntries(SLOTS.map((s) => [s, null]));
  }
  function isShieldBlocked(equipment) {
    const w = equipment.weapon && ITEM_BY_ID[equipment.weapon];
    return !!(w && w.hand === "two");
  }
  function equip(equipment, itemId) {
    const item2 = ITEM_BY_ID[itemId];
    if (!item2) return { ok: false, error: "\u041D\u0435\u0442 \u0442\u0430\u043A\u043E\u0433\u043E \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u0430" };
    if (item2.slot === "consumable") return { ok: false, error: "\u0417\u0435\u043B\u044C\u044F \u043D\u0430\u0434\u0435\u0432\u0430\u044E\u0442\u0441\u044F \u0432 \u043A\u0430\u0440\u043C\u0430\u0448\u043A\u0438 \u0431\u043E\u044F" };
    const swappedOff = [];
    let slot = item2.slot;
    if (slot === "ring") {
      slot = !equipment.ring1 ? "ring1" : !equipment.ring2 ? "ring2" : "ring1";
      if (equipment[slot]) swappedOff.push(equipment[slot]);
    }
    if (slot === "shield" && isShieldBlocked(equipment)) {
      return { ok: false, error: "\u0414\u0432\u0443\u0440\u0443\u0447\u043D\u043E\u0435 \u043E\u0440\u0443\u0436\u0438\u0435 \u0437\u0430\u043D\u0438\u043C\u0430\u0435\u0442 \u043E\u0431\u0435 \u0440\u0443\u043A\u0438 \u2014 \u0449\u0438\u0442 \u043D\u0435 \u043D\u0430\u0434\u0435\u0442\u044C" };
    }
    if (equipment[slot]) swappedOff.push(equipment[slot]);
    equipment[slot] = itemId;
    if (slot === "weapon" && item2.hand === "two" && equipment.shield) {
      swappedOff.push(equipment.shield);
      equipment.shield = null;
    }
    return { ok: true, swappedOff, slot };
  }
  function unequip(equipment, slot) {
    if (!SLOTS.includes(slot) || !equipment[slot]) return null;
    const id = equipment[slot];
    equipment[slot] = null;
    return id;
  }
  var KNIGHT_BASE = {
    hp: 60,
    attack: 8,
    armor: 6,
    speed: 10,
    crit: 0.05,
    dodge: 0.03,
    block: 0,
    goldFind: 0,
    itemFind: 0,
    resist: {}
  };
  function collectStats(equipment) {
    const s = { ...KNIGHT_BASE, resist: { ...KNIGHT_BASE.resist } };
    const traits = [];
    for (const slot of SLOTS) {
      const id = equipment[slot];
      if (!id) continue;
      const item2 = ITEM_BY_ID[id];
      if (!item2 || !item2.stats) continue;
      for (const [k, v] of Object.entries(item2.stats)) {
        if (k === "resist") {
          for (const [rk, rv] of Object.entries(v)) {
            s.resist[rk] = 1 - (1 - (s.resist[rk] || 0)) * (1 - rv);
          }
        } else {
          s[k] = (s[k] || 0) + v;
        }
      }
      if (item2.traits) traits.push(...item2.traits);
    }
    s.hp = Math.max(1, s.hp);
    s.crit = Math.min(0.95, Math.max(0, s.crit));
    s.dodge = Math.min(0.8, Math.max(0, s.dodge));
    s.block = Math.min(0.8, Math.max(0, s.block));
    return { stats: s, traits };
  }
  function describeItem(item2) {
    const parts = [];
    const L = {
      hp: "\u0437\u0434\u043E\u0440\u043E\u0432\u044C\u0435",
      attack: "\u0430\u0442\u0430\u043A\u0430",
      armor: "\u0431\u0440\u043E\u043D\u044F",
      speed: "\u0441\u043A\u043E\u0440\u043E\u0441\u0442\u044C",
      crit: "\u043A\u0440\u0438\u0442",
      dodge: "\u0443\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u0435",
      block: "\u0431\u043B\u043E\u043A",
      goldFind: "\u043C\u043E\u043D\u0435\u0442\u044B",
      itemFind: "\u043D\u0430\u0445\u043E\u0434\u043A\u0438",
      materialsFind: "\u043C\u0430\u0442\u0435\u0440\u0438\u0430\u043B\u044B"
    };
    const RL = { fire: "\u043E\u0433\u043D\u044E", poison: "\u044F\u0434\u0443", sleep: "\u0441\u043D\u0443", slow: "\u0437\u0430\u043C\u0435\u0434\u043B\u0435\u043D\u0438\u044E", fear: "\u0441\u0442\u0440\u0430\u0445\u0443" };
    for (const [k, v] of Object.entries(item2.stats || {})) {
      if (k === "resist") {
        for (const [rk, rv] of Object.entries(v)) {
          parts.push(`\u0441\u043E\u043F\u0440. ${RL[rk] || rk} +${Math.round(rv * 100)}%`);
        }
      } else if (k === "crit" || k === "dodge" || k === "block" || k === "goldFind" || k === "itemFind" || k === "materialsFind") {
        parts.push(`${L[k]} +${Math.round(v * 100)}%`);
      } else {
        parts.push(`${L[k] || k} ${v > 0 ? "+" : ""}${v}`);
      }
    }
    if (item2.hand === "two") parts.push("\u0434\u0432\u0443\u0440\u0443\u0447\u043D\u043E\u0435 (\u0431\u0435\u0437 \u0449\u0438\u0442\u0430)");
    return parts.join(", ");
  }

  // src/core/rng.js
  function makeRng(seed) {
    let a = seed >>> 0;
    const next = () => {
      a |= 0;
      a = a + 1831565813 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
    return {
      next,
      range: (min, max) => min + next() * (max - min),
      int: (min, max) => Math.floor(min + next() * (max - min + 1)),
      chance: (p) => next() < p,
      pick: (arr) => arr[Math.floor(next() * arr.length)]
    };
  }

  // src/data/enemies.js
  var ENEMIES = [
    {
      id: "slime_meadow",
      name: "\u041B\u0443\u0436\u0430\u0439\u043D\u044B\u0439 \u0441\u043B\u0438\u0437\u0435\u043D\u044C",
      icon: "\u{1F7E2}",
      hp: 30,
      attack: 5,
      armor: 4,
      speed: 6,
      crit: 0.02,
      dodge: 0.02,
      elem: "phys",
      skills: ["sting_poison_weak"],
      reward: { coins: [12, 20], materials: ["slime_jelly"] }
    },
    {
      id: "bee_wild",
      name: "\u0414\u0438\u043A\u0430\u044F \u043F\u0447\u0435\u043B\u0430",
      icon: "\u{1F41D}",
      hp: 22,
      attack: 7,
      armor: 2,
      speed: 14,
      crit: 0.08,
      dodge: 0.1,
      elem: "phys",
      skills: ["sting_poison"],
      reward: { coins: [15, 25], materials: ["honey"] }
    },
    {
      id: "spirit_forest",
      name: "\u041B\u0435\u0441\u043D\u043E\u0439 \u0434\u0443\u0445",
      icon: "\u{1F33F}",
      hp: 38,
      attack: 8,
      armor: 6,
      speed: 9,
      crit: 0.05,
      dodge: 0.08,
      elem: "phys",
      skills: ["slow_spores"],
      tags: ["spirit"],
      reward: { coins: [20, 32], materials: ["glow_moss"] }
    },
    {
      id: "moth_night",
      name: "\u041D\u043E\u0447\u043D\u043E\u0439 \u043C\u043E\u0442\u044B\u043B\u0451\u043A",
      icon: "\u{1F98B}",
      hp: 26,
      attack: 6,
      armor: 3,
      speed: 11,
      crit: 0.04,
      dodge: 0.12,
      elem: "phys",
      skills: ["pollen_sleep"],
      reward: { coins: [18, 28], materials: ["moth_dust"] }
    },
    {
      id: "golem_moss",
      name: "\u041C\u0448\u0438\u0441\u0442\u044B\u0439 \u0433\u043E\u043B\u0435\u043C",
      icon: "\u{1F5FF}",
      hp: 90,
      attack: 14,
      armor: 18,
      speed: 5,
      crit: 0.02,
      dodge: 0,
      elem: "phys",
      skills: ["heavy_blow"],
      reward: { coins: [35, 50], materials: ["moss_stone"] }
    },
    // Босс мира
    {
      id: "boss_willow",
      name: "\u0425\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u0441\u0442\u0430\u0440\u043E\u0439 \u0438\u0432\u044B",
      icon: "\u{1F333}",
      hp: 160,
      attack: 15,
      armor: 14,
      speed: 7,
      crit: 0.06,
      dodge: 0.03,
      elem: "phys",
      skills: ["heavy_blow", "slow_spores", "pollen_sleep"],
      boss: true,
      reward: { coins: [150, 200], seals: 1, materials: ["willow_heart"] }
    }
  ];
  ENEMIES.push(
    {
      id: "rat_thief",
      name: "\u041A\u0440\u044B\u0441\u0430-\u0432\u043E\u0440\u0438\u0448\u043A\u0430",
      icon: "\u{1F400}",
      hp: 45,
      attack: 11,
      armor: 6,
      speed: 13,
      crit: 0.1,
      dodge: 0.14,
      elem: "phys",
      skills: ["sting_poison"],
      reward: { coins: [28, 40], materials: ["rat_tail"] }
    },
    {
      id: "bandit",
      name: "\u0414\u0432\u043E\u0440\u043E\u0432\u044B\u0439 \u0440\u0430\u0437\u0431\u043E\u0439\u043D\u0438\u043A",
      icon: "\u{1F5E1}\uFE0F",
      hp: 65,
      attack: 14,
      armor: 10,
      speed: 10,
      crit: 0.08,
      dodge: 0.05,
      elem: "phys",
      skills: ["heavy_blow"],
      reward: { coins: [35, 55], materials: ["torn_cloth"] }
    },
    {
      id: "golem_wander",
      name: "\u0411\u0440\u043E\u0434\u044F\u0447\u0438\u0439 \u0433\u043E\u043B\u0435\u043C",
      icon: "\u{1F9F1}",
      hp: 110,
      attack: 16,
      armor: 22,
      speed: 5,
      crit: 0.03,
      dodge: 0,
      elem: "phys",
      skills: ["heavy_blow", "slow_spores"],
      reward: { coins: [50, 70], materials: ["brick_chunk"] }
    },
    {
      id: "ghost_guard",
      name: "\u041F\u0440\u0438\u0437\u0440\u0430\u043A \u0441\u0442\u0440\u0430\u0436\u0438",
      icon: "\u{1F47B}",
      hp: 70,
      attack: 15,
      armor: 8,
      speed: 11,
      crit: 0.07,
      dodge: 0.15,
      elem: "phys",
      skills: ["fear_chill"],
      tags: ["spirit"],
      reward: { coins: [45, 65], materials: ["ectoplasm"] }
    },
    {
      id: "boss_captain",
      name: "\u041F\u0440\u0438\u0437\u0440\u0430\u043A \u043A\u0430\u043F\u0438\u0442\u0430\u043D\u0430 \u0441\u0442\u0440\u0430\u0436\u0438",
      icon: "\u{1F480}",
      hp: 240,
      attack: 20,
      armor: 18,
      speed: 9,
      crit: 0.1,
      dodge: 0.06,
      elem: "phys",
      skills: ["heavy_blow", "fear_chill", "pollen_sleep"],
      boss: true,
      tags: ["spirit"],
      reward: { coins: [260, 340], seals: 2, materials: ["captain_badge"] }
    }
  );
  ENEMIES.push(
    {
      id: "ink_blot",
      name: "\u0427\u0435\u0440\u043D\u0438\u043B\u044C\u043D\u0430\u044F \u043A\u043B\u044F\u043A\u0441\u0430",
      icon: "\u{1FADF}",
      hp: 80,
      attack: 15,
      armor: 10,
      speed: 8,
      crit: 0.05,
      dodge: 0.04,
      elem: "phys",
      skills: ["sting_poison", "slow_spores"],
      reward: { coins: [55, 75], materials: ["ink_drop"] }
    },
    {
      id: "paper_spirit",
      name: "\u0411\u0443\u043C\u0430\u0436\u043D\u044B\u0439 \u0434\u0443\u0445",
      icon: "\u{1F4C4}",
      hp: 75,
      attack: 17,
      armor: 8,
      speed: 12,
      crit: 0.08,
      dodge: 0.16,
      elem: "phys",
      skills: ["fear_chill"],
      tags: ["spirit"],
      reward: { coins: [60, 85], materials: ["paper_scrap"] }
    },
    {
      id: "book_moth",
      name: "\u041A\u043D\u0438\u0436\u043D\u0430\u044F \u043C\u043E\u043B\u044C",
      icon: "\u{1F98B}",
      hp: 60,
      attack: 13,
      armor: 6,
      speed: 14,
      crit: 0.06,
      dodge: 0.14,
      elem: "phys",
      skills: ["pollen_sleep"],
      reward: { coins: [50, 70], materials: ["page_dust"] }
    },
    {
      id: "illustration",
      name: "\u041E\u0436\u0438\u0432\u0448\u0430\u044F \u0438\u043B\u043B\u044E\u0441\u0442\u0440\u0430\u0446\u0438\u044F",
      icon: "\u{1F5BC}\uFE0F",
      hp: 130,
      attack: 19,
      armor: 20,
      speed: 6,
      crit: 0.06,
      dodge: 0.02,
      elem: "phys",
      skills: ["heavy_blow"],
      reward: { coins: [70, 95], materials: ["gold_leaf"] }
    },
    {
      id: "boss_keeper",
      name: "\u0425\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0439 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B",
      icon: "\u{1F4D6}",
      hp: 320,
      attack: 23,
      armor: 22,
      speed: 10,
      crit: 0.1,
      dodge: 0.08,
      elem: "phys",
      skills: ["fear_chill", "heavy_blow", "pollen_sleep"],
      boss: true,
      tags: ["spirit"],
      reward: { coins: [380, 500], seals: 3, materials: ["last_page"] }
    }
  );
  var ENEMY_BY_ID = Object.fromEntries(ENEMIES.map((e) => [e.id, e]));

  // src/core/battle.js
  var GAUGE_FULL = 100;
  var MAX_TICKS = 5e3;
  function makeEnemy(id, rngSeed) {
    const def = ENEMY_BY_ID[id];
    return {
      id,
      side: "enemy",
      name: def.name,
      icon: def.icon,
      boss: !!def.boss,
      hp: def.hp,
      maxHp: def.hp,
      attack: def.attack,
      armor: def.armor,
      speed: def.speed,
      crit: def.crit || 0,
      dodge: def.dodge || 0,
      block: 0,
      elem: def.elem || "phys",
      skills: def.skills || [],
      tags: def.tags || [],
      resist: {},
      statuses: [],
      gauge: 0,
      cooldowns: {},
      stats: { dealt: 0, taken: 0 }
    };
  }
  function makeKnight(knightStats, traits, consumables) {
    const statuses = [];
    if ((traits || []).includes("regen_ally")) {
      statuses.push({ kind: "regen", ticks: 9999, dmg: 1, source: "\u0422\u0440\u0430\u0432\u043D\u0438\u0446\u0430" });
    }
    const resist = { ...knightStats.resist || {} };
    if ((traits || []).includes("fearless")) resist.fear = 1;
    const potions = (consumables || []).map((c) => {
      const p = { ...c, used: false };
      if (p.effect?.kind === "shield" && p.effect.atStart) {
        statuses.push({ kind: "shield", amount: p.effect.amount });
        p.used = true;
      }
      return p;
    });
    return {
      id: "knight",
      side: "ally",
      name: "\u0420\u044B\u0446\u0430\u0440\u044C \u043B\u0430\u0432\u043A\u0438",
      icon: "\u{1F6E1}\uFE0F",
      hp: knightStats.hp,
      maxHp: knightStats.hp,
      attack: knightStats.attack,
      armor: knightStats.armor,
      speed: knightStats.speed,
      crit: knightStats.crit,
      dodge: knightStats.dodge,
      block: knightStats.block,
      elem: "phys",
      skills: [],
      tags: [],
      traits: traits || [],
      resist,
      potions,
      statuses,
      gauge: 0,
      cooldowns: {},
      stats: { dealt: 0, taken: 0, sleptTicks: 0, poisonTicks: 0 }
    };
  }
  function makeMerc(def) {
    return {
      id: def.id,
      side: "ally",
      name: def.name,
      icon: def.icon,
      hp: def.hp,
      maxHp: def.hp,
      attack: def.attack,
      armor: def.armor,
      speed: def.speed,
      crit: def.crit || 0,
      dodge: def.dodge || 0,
      block: def.block || 0,
      elem: "phys",
      skills: def.skills || [],
      tags: def.tags || [],
      resist: {},
      traits: [],
      statuses: [],
      gauge: 0,
      cooldowns: {},
      stats: { dealt: 0, taken: 0 }
    };
  }
  function hasStatus(u, kind) {
    return u.statuses.some((s) => s.kind === kind);
  }
  function addStatus(u, status2) {
    const existing = u.statuses.find((s) => s.kind === status2.kind);
    if (existing) Object.assign(existing, status2);
    else u.statuses.push(status2);
  }
  function resistOf(u, kind) {
    return u.resist[kind] || 0;
  }
  function computeDamage(attacker, defender, rng, log, opts = {}) {
    if (!opts.neverMiss && rng.chance(defender.dodge)) {
      log.push({ t: "dodge", who: defender.name, uid: defender.uid });
      return 0;
    }
    let mult = 1;
    if (attacker.traits?.includes("bonus_spirit") && defender.tags?.includes("spirit")) mult *= 1.3;
    const elem = opts.elem || attacker.elem || "phys";
    if (elem !== "phys") mult *= 1 - resistOf(defender, elem);
    let armor = defender.armor;
    if (attacker.traits?.includes("pierce")) armor *= 0.5;
    mult *= 100 / (100 + Math.max(0, armor));
    let crit = false;
    if (rng.chance(attacker.crit)) {
      mult *= 1.75;
      crit = true;
    }
    if (hasStatus(attacker, "fear")) mult *= 0.7;
    let blocked = false;
    if (rng.chance(defender.block)) {
      mult *= 0.6;
      blocked = true;
    }
    if (defender.traits?.includes("first_hit_reduction") && defender.stats.taken === 0) mult *= 0.8;
    const raw = (opts.base ?? attacker.attack) * (opts.skillMult || 1) * mult;
    const dmg = Math.max(1, Math.round(raw));
    let remaining = dmg;
    const shield = defender.statuses.find((s) => s.kind === "shield");
    if (shield) {
      const absorbed = Math.min(shield.amount, remaining);
      shield.amount -= absorbed;
      remaining -= absorbed;
      if (shield.amount <= 0) defender.statuses = defender.statuses.filter((s) => s !== shield);
    }
    defender.hp -= remaining;
    defender.stats.taken += remaining;
    attacker.stats.dealt += remaining;
    log.push({
      t: "hit",
      from: attacker.name,
      to: defender.name,
      fromUid: attacker.uid,
      toUid: defender.uid,
      dmg: remaining,
      crit,
      blocked,
      elem
    });
    return remaining;
  }
  function tryApplyStatus(attacker, defender, kind, chance, status2, rng, log) {
    const effective = chance * (1 - resistOf(defender, kind));
    if (rng.chance(effective)) {
      addStatus(defender, status2);
      log.push({ t: "status", who: defender.name, uid: defender.uid, kind });
      return true;
    }
    return false;
  }
  function pickTarget(attacker, foes, rng) {
    const alive = foes.filter((f) => f.hp > 0);
    if (alive.length === 0) return null;
    if (attacker.traits?.includes("ranged") || attacker.tags?.includes("ranged")) {
      return alive.reduce((a, b) => a.hp < b.hp ? a : b);
    }
    return rng.pick(alive);
  }
  function checkPotions(unit, log) {
    if (!unit.potions || unit.hp <= 0) return;
    for (const p of unit.potions) {
      if (p.used) continue;
      if (p.effect.kind === "heal" && unit.hp / unit.maxHp <= p.effect.atHpBelow) {
        p.used = true;
        const healed = Math.min(p.effect.amount, unit.maxHp - unit.hp);
        unit.hp += healed;
        log.push({ t: "potion", who: unit.name, uid: unit.uid, name: p.name, healed });
      }
      if (p.effect.kind?.startsWith("cleanse_")) {
        const statusKind = p.effect.kind.slice(8);
        if (hasStatus(unit, statusKind)) {
          p.used = true;
          unit.statuses = unit.statuses.filter((s) => s.kind !== statusKind);
          if (p.effect.resistAfter) {
            for (const [k, v] of Object.entries(p.effect.resistAfter)) {
              unit.resist[k] = Math.max(unit.resist[k] || 0, v);
            }
          }
          log.push({ t: "potion", who: unit.name, uid: unit.uid, name: p.name, cleansed: statusKind });
        }
      }
    }
  }
  function act(unit, allies, foes, rng, log, tick) {
    const sleep = unit.statuses.find((s) => s.kind === "sleep");
    if (sleep) {
      sleep.ticks -= 1;
      if (sleep.ticks <= 0) unit.statuses = unit.statuses.filter((s) => s !== sleep);
      log.push({ t: "sleeps", who: unit.name, uid: unit.uid });
      return;
    }
    const target = pickTarget(unit, foes, rng);
    if (!target) return;
    const skill = unit.skills[0] && unit.skills[(unit.cooldowns._next || 0) % unit.skills.length];
    unit.cooldowns._next = (unit.cooldowns._next || 0) + 1;
    switch (skill) {
      case "pollen_sleep":
        computeDamage(unit, target, rng, log, { skillMult: 0.6 });
        tryApplyStatus(unit, target, "sleep", 0.3, { kind: "sleep", ticks: 18 }, rng, log);
        break;
      case "sting_poison":
        computeDamage(unit, target, rng, log);
        tryApplyStatus(unit, target, "poison", 0.5, { kind: "poison", ticks: 40, dmg: 2 }, rng, log);
        break;
      case "sting_poison_weak":
        computeDamage(unit, target, rng, log);
        tryApplyStatus(unit, target, "poison", 0.25, { kind: "poison", ticks: 30, dmg: 1 }, rng, log);
        break;
      case "slow_spores":
        computeDamage(unit, target, rng, log, { skillMult: 0.7 });
        tryApplyStatus(unit, target, "slow", 0.5, { kind: "slow", ticks: 40, factor: 0.6 }, rng, log);
        break;
      case "heavy_blow":
        computeDamage(unit, target, rng, log, { skillMult: 1.6 });
        break;
      case "spit_fire":
        computeDamage(unit, target, rng, log, { elem: "fire", skillMult: 1.1 });
        break;
      case "fear_chill":
        computeDamage(unit, target, rng, log, { skillMult: 0.8 });
        tryApplyStatus(unit, target, "fear", 0.5, { kind: "fear", ticks: 35 }, rng, log);
        break;
      case "aimed_shot":
        computeDamage(unit, target, rng, log, { skillMult: 1.35, neverMiss: true });
        break;
      case "regen_ally_skill": {
        const wounded = allies.filter((a) => a.hp > 0).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
        if (wounded && wounded.hp < wounded.maxHp * 0.8) {
          addStatus(wounded, { kind: "regen", ticks: 25, dmg: 2, source: unit.name });
          log.push({ t: "status", who: wounded.name, uid: wounded.uid, kind: "regen", from: unit.name });
        } else {
          computeDamage(unit, target, rng, log, { skillMult: 0.8 });
        }
        break;
      }
      default: {
        if (unit.traits?.includes("cleave_small")) {
          const alive = foes.filter((f) => f.hp > 0);
          computeDamage(unit, target, rng, log);
          for (const other of alive) {
            if (other !== target) computeDamage(unit, other, rng, log, { skillMult: 0.4 });
          }
        } else {
          computeDamage(unit, target, rng, log);
        }
      }
    }
  }
  function simulateBattle(alliesInput, enemyIds, seed = 1) {
    const rng = makeRng(seed);
    const allies = Array.isArray(alliesInput) ? alliesInput : [alliesInput];
    const knight = allies[0];
    const foes = enemyIds.map((id) => makeEnemy(id));
    allies.forEach((u, i) => {
      u.uid = `a${i}`;
    });
    foes.forEach((u, i) => {
      u.uid = `e${i}`;
    });
    const log = [{ t: "start", allies: allies.map((a) => a.name), foes: foes.map((f) => f.name) }];
    let tick = 0;
    while (tick < MAX_TICKS) {
      tick++;
      for (const u of [...allies, ...foes]) {
        if (u.hp <= 0) continue;
        for (const s of [...u.statuses]) {
          if (s.kind === "poison") {
            s.ticks -= 1;
            u.hp -= s.dmg;
            u.stats.taken += s.dmg;
            if (u.stats.poisonTicks !== void 0) u.stats.poisonTicks++;
            if (s.ticks <= 0) u.statuses = u.statuses.filter((x) => x !== s);
          }
          if (s.kind === "regen") {
            s.ticks -= 1;
            u.hp = Math.min(u.maxHp, u.hp + s.dmg);
            if (s.ticks <= 0) u.statuses = u.statuses.filter((x) => x !== s);
          }
          if (s.kind === "fear") {
            s.ticks -= 1;
            if (s.ticks <= 0) u.statuses = u.statuses.filter((x) => x !== s);
          }
        }
      }
      for (const u of [...allies, ...foes]) {
        if (u.hp <= 0) continue;
        checkPotions(u, log);
        let spd = u.speed;
        const slow = u.statuses.find((s) => s.kind === "slow");
        if (slow) {
          spd *= slow.factor;
          slow.ticks -= 1;
          if (slow.ticks <= 0) u.statuses = u.statuses.filter((x) => x !== slow);
        }
        u.gauge += spd;
      }
      const ready = [...allies, ...foes].filter((u) => u.hp > 0 && u.gauge >= GAUGE_FULL).sort((a, b) => b.gauge - a.gauge);
      for (const u of ready) {
        if (u.gauge < GAUGE_FULL || u.hp <= 0) continue;
        u.gauge -= GAUGE_FULL;
        const myAllies = u.side === "ally" ? allies : foes;
        const myFoes = u.side === "ally" ? foes : allies;
        act(u, myAllies, myFoes, rng, log, tick);
        if (u.side === "ally" && hasStatus(u, "sleep")) u.stats.sleptTicks++;
      }
      if (foes.every((f) => f.hp <= 0) || allies.every((a) => a.hp <= 0)) break;
    }
    const victory = foes.every((f) => f.hp <= 0) && allies.some((a) => a.hp > 0);
    const report = buildReport(knight, allies, foes, victory, log);
    return { victory, log, report, ticks: tick };
  }
  function buildReport(knight, allies, foes, victory, log) {
    const deathCause = knight.hp > 0 ? null : inferDeathCause(knight, log);
    return {
      victory,
      knightHpLeft: Math.max(0, knight.hp),
      knightHpMax: knight.maxHp,
      dealt: allies.reduce((sum, a) => sum + a.stats.dealt, 0),
      taken: knight.stats.taken,
      alliesDown: allies.filter((a) => a.hp <= 0).map((a) => a.name),
      alliesStats: allies.map((a) => ({ name: a.name, icon: a.icon, dealt: a.stats.dealt, taken: a.stats.taken, alive: a.hp > 0 })),
      foesDown: foes.filter((f) => f.hp <= 0).length,
      foesTotal: foes.length,
      slept: knight.stats.sleptTicks > 0,
      poisoned: knight.stats.poisonTicks > 0,
      deathCause,
      advice: victory ? null : adviceFor(knight, allies, foes, deathCause)
    };
  }
  function inferDeathCause(knight, log) {
    const hits = log.filter((e) => e.t === "hit" && e.to === knight.name);
    const last = hits[hits.length - 1];
    if (knight.stats.sleptTicks > 0) return "sleep";
    if (knight.stats.poisonTicks > 20) return "poison";
    if (last && last.elem === "fire") return "fire";
    return "phys";
  }
  function adviceFor(knight, allies, foes, cause) {
    switch (cause) {
      case "sleep":
        return "\u0420\u044B\u0446\u0430\u0440\u044C \u0443\u0441\u043D\u0443\u043B \u043E\u0442 \u043F\u044B\u043B\u044C\u0446\u044B \u043D\u043E\u0447\u043D\u044B\u0445 \u043C\u043E\u0442\u044B\u043B\u044C\u043A\u043E\u0432. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u0448\u043B\u0435\u043C \u0441 \u0441\u043E\u043F\u0440\u043E\u0442\u0438\u0432\u043B\u0435\u043D\u0438\u0435\u043C \u0441\u043D\u0443 \u0438\u043B\u0438 \u0437\u0435\u043B\u044C\u0435 \u0431\u043E\u0434\u0440\u043E\u0441\u0442\u0438.";
      case "poison":
        return "\u042F\u0434 \u043C\u0435\u0434\u043B\u0435\u043D\u043D\u043E \u0441\u044A\u0435\u0434\u0430\u043B \u0437\u0434\u043E\u0440\u043E\u0432\u044C\u0435. \u041F\u043E\u043C\u043E\u0433\u0443\u0442 \u043F\u0435\u0440\u0447\u0430\u0442\u043A\u0438 \u0442\u0440\u0430\u0432\u043D\u0438\u0446\u044B \u0438\u043B\u0438 \u0430\u043C\u0443\u043B\u0435\u0442 \u043F\u0440\u043E\u0442\u0438\u0432\u043E\u044F\u0434\u0438\u044F.";
      case "fire":
        return "\u041E\u0433\u043E\u043D\u044C \u0436\u0451\u0433 \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0441\u0438\u043B\u044C\u043D\u043E. \u041F\u0440\u0438\u0433\u043E\u0434\u0438\u0442\u0441\u044F \u0430\u043C\u0443\u043B\u0435\u0442 \u0441 \u0441\u043E\u043F\u0440\u043E\u0442\u0438\u0432\u043B\u0435\u043D\u0438\u0435\u043C \u043E\u0433\u043D\u044E.";
      default: {
        const tough = foes.some((f) => f.armor >= 14);
        if (knight.stats.dealt < 50 && tough) {
          return "\u0423\u0440\u043E\u043D \u0435\u0434\u0432\u0430 \u043F\u0440\u043E\u0431\u0438\u0432\u0430\u043B \u0442\u043E\u043B\u0441\u0442\u0443\u044E \u0448\u043A\u0443\u0440\u0443. \u041D\u0443\u0436\u043D\u043E \u043E\u0440\u0443\u0436\u0438\u0435 \u043F\u043E\u0442\u044F\u0436\u0435\u043B\u0435\u0435 \u2014 \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440, \u0434\u0432\u0443\u0440\u0443\u0447\u043D\u043E\u0435.";
        }
        if (allies.length === 1) {
          return "\u0420\u044B\u0446\u0430\u0440\u044C \u0434\u0440\u0430\u043B\u0441\u044F \u0432 \u043E\u0434\u0438\u043D\u043E\u0447\u043A\u0443. \u0412 \u0442\u0430\u0432\u0435\u0440\u043D\u0435 \u043C\u043E\u0436\u043D\u043E \u043D\u0430\u043D\u044F\u0442\u044C \u043F\u043E\u043C\u043E\u0449\u043D\u0438\u043A\u0430 \u2014 \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440, \u043B\u0443\u0447\u043D\u0438\u0446\u0443 \u0438\u043B\u0438 \u0433\u0440\u043E\u043C\u0438\u043B\u0443.";
        }
        return "\u041D\u0435 \u0445\u0432\u0430\u0442\u0438\u043B\u043E \u0436\u0438\u0432\u0443\u0447\u0435\u0441\u0442\u0438. \u041F\u0440\u043E\u0432\u0435\u0440\u044C \u0431\u0440\u043E\u043D\u044E, \u0449\u0438\u0442 \u0438 \u043D\u0435 \u0437\u0430\u0431\u0443\u0434\u044C \u0437\u0435\u043B\u044C\u0435 \u043B\u0435\u0447\u0435\u043D\u0438\u044F.";
      }
    }
  }

  // src/core/state.js
  var SAVE_KEY = "cozy_adventures_save_v2";
  function newGame() {
    return {
      coins: 80,
      seals: 0,
      materials: {},
      // id -> count
      inventory: ["pot_heal"],
      equipped: { ...emptyEquipment(), weapon: "wpn_rusty_sword", shield: "shd_wooden" },
      consumableBelt: ["pot_heal"],
      // зелья, которые рыцарь берёт в бой (до 2)
      crew: [],
      // нанятые: id спутников/питомцев/наёмников
      squadCompanions: [],
      // спутники в отряде (до 3)
      squadMercs: [],
      // наёмники в отряде (до 2)
      pet: null,
      // активный питомец
      puzzlesDone: {},
      // id -> { moves, hintsUsed }
      battlesDone: {},
      // id -> { victories }
      customPuzzles: [],
      // уровни из редактора
      cosmeticsOwned: [],
      // купленные украшения
      cosmeticsActive: [],
      // выставленные украшения
      tutorial: {},
      // пройденные этапы обучения
      tutorialSkipped: false,
      // игрок пропустил обучение целиком
      stats: { puzzlesSolved: 0, battlesWon: 0, coinsEarned: 0 }
    };
  }
  function migrate(state2) {
    state2.crew ||= [];
    state2.squadCompanions ||= [];
    state2.squadMercs ||= [];
    state2.pet ??= null;
    state2.customPuzzles ||= [];
    state2.cosmeticsOwned ||= [];
    state2.cosmeticsActive ||= [];
    state2.tutorial ||= {};
    state2.tutorialSkipped ??= false;
    state2.materials ||= {};
    state2.seals ??= 0;
    return state2;
  }
  function addCoins(state2, n) {
    state2.coins += n;
    if (n > 0) state2.stats.coinsEarned += n;
  }
  function grantRewards(state2, rewards, multipliers = {}) {
    const granted = [];
    for (const r of rewards) {
      if (r.type === "coins") {
        const amount = Math.round(r.amount * (1 + (multipliers.goldFind || 0)));
        addCoins(state2, amount);
        granted.push({ type: "coins", amount });
      } else if (r.type === "seals") {
        state2.seals += r.amount;
        granted.push({ type: "seals", amount: r.amount });
      } else if (r.type === "item") {
        state2.inventory.push(r.id);
        granted.push({ type: "item", id: r.id });
      } else if (r.type === "material") {
        state2.materials[r.id] = (state2.materials[r.id] || 0) + r.amount;
        granted.push({ type: "material", id: r.id, amount: r.amount });
      }
    }
    return granted;
  }
  function shopStock(state2) {
    return SHOP_STOCK.filter((s) => s.unlockAfter === null || state2.battlesDone[s.unlockAfter]).map((s) => ITEM_BY_ID[s.itemId]);
  }
  function buyItem(state2, itemId) {
    const item2 = ITEM_BY_ID[itemId];
    if (!item2) return { ok: false, error: "\u041D\u0435\u0442 \u0442\u0430\u043A\u043E\u0433\u043E \u0442\u043E\u0432\u0430\u0440\u0430" };
    const inStock = shopStock(state2).some((i) => i.id === itemId);
    if (!inStock) return { ok: false, error: "\u0422\u043E\u0432\u0430\u0440 \u0435\u0449\u0451 \u043D\u0435 \u043D\u0430 \u043F\u043E\u043B\u043A\u0435" };
    if (item2.sealPrice) {
      if (state2.seals < item2.sealPrice) return { ok: false, error: "\u041D\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 \u043F\u0435\u0447\u0430\u0442\u0435\u0439 \u043C\u0430\u0441\u0442\u0435\u0440\u0430" };
      state2.seals -= item2.sealPrice;
    } else {
      if (state2.coins < item2.price) return { ok: false, error: "\u041D\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 \u043C\u043E\u043D\u0435\u0442" };
      state2.coins -= item2.price;
    }
    state2.inventory.push(itemId);
    state2.stats.itemsBought = (state2.stats.itemsBought || 0) + 1;
    const auto = autoEquip(state2, itemId);
    return { ok: true, autoEquipped: auto };
  }
  function autoEquip(state2, itemId) {
    const item2 = ITEM_BY_ID[itemId];
    if (!item2) return null;
    const index = state2.inventory.lastIndexOf(itemId);
    if (index < 0) return null;
    if (item2.slot === "consumable") {
      if (state2.consumableBelt.length >= 2) return null;
      state2.inventory.splice(index, 1);
      state2.consumableBelt.push(itemId);
      return { belt: true };
    }
    let slot = item2.slot;
    if (slot === "ring") {
      slot = !state2.equipped.ring1 ? "ring1" : !state2.equipped.ring2 ? "ring2" : null;
      if (!slot) return null;
    }
    if (slot === "shield" && isShieldBlocked(state2.equipped)) return null;
    if (state2.equipped[slot]) return null;
    const result = equip(state2.equipped, itemId);
    if (!result.ok) return null;
    state2.inventory.splice(index, 1);
    return { slot: result.slot };
  }
  function sellItem(state2, inventoryIndex) {
    const id = state2.inventory[inventoryIndex];
    const item2 = ITEM_BY_ID[id];
    if (!item2) return { ok: false };
    const price = Math.max(1, Math.floor(item2.price / 2));
    state2.inventory.splice(inventoryIndex, 1);
    addCoins(state2, price);
    return { ok: true, price };
  }
  var CREW_DEF = { companion: COMPANION_BY_ID, pet: PET_BY_ID, merc: MERC_BY_ID };
  function crewStock(state2) {
    return CREW_STOCK.filter((s) => s.unlockAfter === null || state2.battlesDone[s.unlockAfter]).map((s) => ({ ...CREW_DEF[s.kind][s.id], kind: s.kind, hired: state2.crew.includes(s.id) }));
  }
  function hireCrew(state2, id, kind) {
    const def = CREW_DEF[kind]?.[id];
    if (!def) return { ok: false, error: "\u0422\u0430\u043A\u043E\u0433\u043E \u043D\u0435 \u0431\u044B\u0432\u0430\u0435\u0442" };
    if (state2.crew.includes(id)) return { ok: false, error: "\u0423\u0436\u0435 \u0432 \u043A\u043E\u043C\u0430\u043D\u0434\u0435" };
    const purse = def.currency === "seals" ? "seals" : "coins";
    if (state2[purse] < def.price) return { ok: false, error: def.currency === "seals" ? "\u041D\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 \u043F\u0435\u0447\u0430\u0442\u0435\u0439" : "\u041D\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 \u043C\u043E\u043D\u0435\u0442" };
    state2[purse] -= def.price;
    state2.crew.push(id);
    if (kind === "companion" && state2.squadCompanions.length < 3) state2.squadCompanions.push(id);
    if (kind === "merc" && state2.squadMercs.length < 2) state2.squadMercs.push(id);
    if (kind === "pet" && !state2.pet) state2.pet = id;
    return { ok: true };
  }
  function toggleCompanion(state2, id) {
    const i = state2.squadCompanions.indexOf(id);
    if (i >= 0) {
      state2.squadCompanions.splice(i, 1);
      return { ok: true, active: false };
    }
    if (state2.squadCompanions.length >= 3) return { ok: false, error: "\u0412 \u043E\u0442\u0440\u044F\u0434\u0435 \u043C\u0435\u0441\u0442\u043E \u0442\u043E\u043B\u044C\u043A\u043E \u0434\u043B\u044F \u0442\u0440\u043E\u0438\u0445 \u0441\u043F\u0443\u0442\u043D\u0438\u043A\u043E\u0432" };
    if (!state2.crew.includes(id)) return { ok: false, error: "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u043D\u0430\u0439\u043C\u0438" };
    state2.squadCompanions.push(id);
    return { ok: true, active: true };
  }
  function toggleMerc(state2, id) {
    const i = state2.squadMercs.indexOf(id);
    if (i >= 0) {
      state2.squadMercs.splice(i, 1);
      return { ok: true, active: false };
    }
    if (state2.squadMercs.length >= 2) return { ok: false, error: "\u0412 \u0431\u043E\u0439 \u0438\u0434\u0443\u0442 \u043C\u0430\u043A\u0441\u0438\u043C\u0443\u043C \u0434\u0432\u043E\u0435 \u043D\u0430\u0451\u043C\u043D\u0438\u043A\u043E\u0432" };
    if (!state2.crew.includes(id)) return { ok: false, error: "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u043D\u0430\u0439\u043C\u0438" };
    state2.squadMercs.push(id);
    return { ok: true, active: true };
  }
  function setPet(state2, id) {
    if (state2.pet === id) {
      state2.pet = null;
      return { ok: true, active: false };
    }
    if (!state2.crew.includes(id)) return { ok: false, error: "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u043F\u0440\u0438\u044E\u0442\u0438 \u043F\u0438\u0442\u043E\u043C\u0446\u0430" };
    state2.pet = id;
    return { ok: true, active: true };
  }
  function equipFromInventory(state2, inventoryIndex) {
    const id = state2.inventory[inventoryIndex];
    const item2 = ITEM_BY_ID[id];
    if (!item2) return { ok: false, error: "\u041D\u0435\u0442 \u0442\u0430\u043A\u043E\u0433\u043E \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u0430" };
    if (item2.slot === "consumable") {
      if (state2.consumableBelt.length >= 2) return { ok: false, error: "\u0412 \u043F\u043E\u044F\u0441\u0435 \u0442\u043E\u043B\u044C\u043A\u043E \u0434\u0432\u0430 \u043A\u0430\u0440\u043C\u0430\u0448\u043A\u0430" };
      state2.inventory.splice(inventoryIndex, 1);
      state2.consumableBelt.push(id);
      return { ok: true };
    }
    const result = equip(state2.equipped, id);
    if (!result.ok) return result;
    state2.inventory.splice(inventoryIndex, 1);
    for (const off of result.swappedOff || []) state2.inventory.push(off);
    return { ok: true, slot: result.slot };
  }
  function unequipToInventory(state2, slot) {
    const id = unequip(state2.equipped, slot);
    if (!id) return false;
    state2.inventory.push(id);
    return true;
  }
  function removeFromBelt(state2, index) {
    const id = state2.consumableBelt[index];
    if (!id) return false;
    state2.consumableBelt.splice(index, 1);
    state2.inventory.push(id);
    return true;
  }
  function recipeList(state2) {
    return RECIPES.filter((r) => r.unlockAfter === null || state2.battlesDone[r.unlockAfter]).map((r) => {
      const check = canCraft(state2, r.id);
      return { ...r, canCraft: check.ok, missing: check.missing || [], error: check.error };
    });
  }
  function canCraft(state2, recipeId) {
    const r = RECIPE_BY_ID[recipeId];
    if (!r) return { ok: false, error: "\u041D\u0435\u0442 \u0442\u0430\u043A\u043E\u0433\u043E \u0440\u0435\u0446\u0435\u043F\u0442\u0430" };
    if (r.unlockAfter && !state2.battlesDone[r.unlockAfter]) {
      return { ok: false, error: "\u0420\u0435\u0446\u0435\u043F\u0442 \u0435\u0449\u0451 \u043D\u0435 \u043E\u0442\u043A\u0440\u044B\u0442" };
    }
    const missing = [];
    for (const [matId, need] of Object.entries(r.materials)) {
      const have = state2.materials[matId] || 0;
      if (have < need) missing.push({ matId, need, have });
    }
    if (missing.length > 0) return { ok: false, error: "\u041D\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 \u043C\u0430\u0442\u0435\u0440\u0438\u0430\u043B\u043E\u0432", missing };
    if (r.coins && state2.coins < r.coins) return { ok: false, error: "\u041D\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 \u043C\u043E\u043D\u0435\u0442" };
    return { ok: true };
  }
  function craft(state2, recipeId) {
    const check = canCraft(state2, recipeId);
    if (!check.ok) return check;
    const r = RECIPE_BY_ID[recipeId];
    for (const [matId, need] of Object.entries(r.materials)) {
      state2.materials[matId] -= need;
      if (state2.materials[matId] <= 0) delete state2.materials[matId];
    }
    if (r.coins) state2.coins -= r.coins;
    const count = r.result.count || 1;
    for (let i = 0; i < count; i++) state2.inventory.push(r.result.itemId);
    return { ok: true, itemId: r.result.itemId, count };
  }
  function buyCosmetic(state2, id) {
    const def = COSMETIC_BY_ID[id];
    if (!def) return { ok: false, error: "\u041D\u0435\u0442 \u0442\u0430\u043A\u043E\u0433\u043E \u0443\u043A\u0440\u0430\u0448\u0435\u043D\u0438\u044F" };
    if (state2.cosmeticsOwned.includes(id)) return { ok: false, error: "\u0423\u0436\u0435 \u043A\u0443\u043F\u043B\u0435\u043D\u043E" };
    if (def.sealPrice) {
      if (state2.seals < def.sealPrice) return { ok: false, error: "\u041D\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 \u043F\u0435\u0447\u0430\u0442\u0435\u0439 \u043C\u0430\u0441\u0442\u0435\u0440\u0430" };
      state2.seals -= def.sealPrice;
    } else {
      if (state2.coins < def.price) return { ok: false, error: "\u041D\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 \u043C\u043E\u043D\u0435\u0442" };
      state2.coins -= def.price;
    }
    state2.cosmeticsOwned.push(id);
    state2.cosmeticsActive.push(id);
    return { ok: true };
  }
  function toggleCosmetic(state2, id) {
    if (!state2.cosmeticsOwned.includes(id)) return { ok: false };
    const i = state2.cosmeticsActive.indexOf(id);
    if (i >= 0) state2.cosmeticsActive.splice(i, 1);
    else state2.cosmeticsActive.push(id);
    return { ok: true, active: i < 0 };
  }
  var SEEK_BY_WORLD = (w) => SEEK_PUZZLES.filter((p) => p.world === w);
  var ALL_PUZZLES = [
    ...PUZZLES,
    ...SEEK_BY_WORLD("meadow"),
    ...SHELF_PUZZLES,
    ...SEEK_BY_WORLD("town"),
    ...BOOK_PUZZLES,
    ...SEEK_BY_WORLD("attic")
  ];
  function allPuzzles(state2) {
    return [...ALL_PUZZLES, ...state2.customPuzzles || []];
  }
  function findPuzzle(state2, id) {
    return allPuzzles(state2).find((p) => p.id === id) || null;
  }
  function puzzleAvailable(state2, index) {
    if (index === 0) return true;
    return !!state2.puzzlesDone[ALL_PUZZLES[index - 1].id];
  }
  function completePuzzle(state2, puzzleId, info = {}) {
    const puzzle = findPuzzle(state2, puzzleId);
    if (!puzzle) return null;
    const firstTime = !state2.puzzlesDone[puzzleId];
    state2.puzzlesDone[puzzleId] = {
      moves: info.moves ?? 0,
      hintsUsed: info.hintsUsed ?? 0,
      at: Date.now()
    };
    state2.stats.puzzlesSolved += 1;
    const rewards = puzzle.rewards || [{ type: "coins", amount: 15 }];
    if (!firstTime) {
      const coins = rewards.find((r) => r.type === "coins");
      const amount = coins ? Math.round(coins.amount / 3) : 10;
      addCoins(state2, amount);
      return [{ type: "coins", amount }];
    }
    return grantRewards(state2, rewards);
  }
  function nextPuzzle(currentId) {
    const idx = ALL_PUZZLES.findIndex((p) => p.id === currentId);
    return idx >= 0 && idx + 1 < ALL_PUZZLES.length ? ALL_PUZZLES[idx + 1] : null;
  }
  function firstUnsolvedPuzzle(state2) {
    return ALL_PUZZLES.find((p, i) => !state2.puzzlesDone[p.id] && puzzleAvailable(state2, i)) || null;
  }
  function nextBattle(currentId) {
    const idx = BATTLES.findIndex((b) => b.id === currentId);
    return idx >= 0 && idx + 1 < BATTLES.length ? BATTLES[idx + 1] : null;
  }
  function firstUnbeatenBattle(state2) {
    return BATTLES.find((b) => !state2.battlesDone[b.id] && battleAvailable(state2, b.id)) || null;
  }
  function battleAvailable(state2, battleId) {
    const b = BATTLE_BY_ID[battleId];
    if (!b) return false;
    return b.unlockAfter === null || !!state2.battlesDone[b.unlockAfter];
  }
  function runBattle(state2, battleId, seed = 1) {
    const battle = BATTLE_BY_ID[battleId];
    if (!battle || !battleAvailable(state2, battleId)) return null;
    const { stats, traits } = collectStats(state2.equipped);
    for (const cid of state2.squadCompanions) {
      const c = COMPANION_BY_ID[cid];
      if (!c) continue;
      for (const [k, v] of Object.entries(c.bonus || {})) stats[k] = (stats[k] || 0) + v;
      if (c.trait) traits.push(c.trait);
    }
    if (state2.pet && PET_BY_ID[state2.pet]) {
      for (const [k, v] of Object.entries(PET_BY_ID[state2.pet].bonus || {})) {
        stats[k] = (stats[k] || 0) + v;
      }
    }
    const consumables = state2.consumableBelt.map((id) => ITEM_BY_ID[id]).filter(Boolean).map((item2) => ({ itemId: item2.id, name: item2.name, effect: item2.effect }));
    const knight = makeKnight(stats, traits, consumables);
    const allies = [knight, ...state2.squadMercs.map((id) => makeMerc(MERC_BY_ID[id])).filter((m) => m.hp)];
    const result = simulateBattle(allies, battle.enemies, seed);
    const usedIds = knight.potions.filter((p) => p.used).map((p) => p.itemId);
    for (const used of usedIds) {
      const i = state2.consumableBelt.indexOf(used);
      if (i >= 0) state2.consumableBelt.splice(i, 1);
    }
    let rewards = [];
    if (result.victory) {
      const firstTime = !state2.battlesDone[battleId];
      state2.battlesDone[battleId] = {
        victories: (state2.battlesDone[battleId]?.victories || 0) + 1,
        at: Date.now()
      };
      state2.stats.battlesWon += 1;
      for (const enemyId of battle.enemies) {
        const def = enemyReward(enemyId, stats, seed);
        rewards.push(...def);
      }
      grantRewards(state2, rewards, {});
      if (traits.includes("heal_after_battle")) {
        rewards.push({ type: "note", text: "\u0410\u043C\u0443\u043B\u0435\u0442 \u043E\u0447\u0430\u0433\u0430 \u0441\u043E\u0433\u0440\u0435\u043B \u0440\u044B\u0446\u0430\u0440\u044F \u043F\u043E\u0441\u043B\u0435 \u0431\u043E\u044F." });
      }
      if (!firstTime) rewards = rewards.map((r) => r.type === "coins" ? { ...r, amount: Math.round(r.amount * 0.5) } : r);
    }
    return { ...result, rewards, battle };
  }
  function enemyReward(enemyId, knightStats, seed) {
    const def = enemyRewardDef(enemyId);
    if (!def) return [];
    const out = [];
    if (def.coins) {
      const base = Math.round((def.coins[0] + def.coins[1]) / 2);
      out.push({ type: "coins", amount: Math.round(base * (1 + (knightStats.goldFind || 0))) });
    }
    if (def.seals) out.push({ type: "seals", amount: def.seals });
    if (def.materials) {
      const matMult = (knightStats.materialsFind || 0) >= 0.5 ? 2 : 1;
      for (const m of def.materials) out.push({ type: "material", id: m, amount: matMult });
    }
    return out;
  }
  function enemyRewardDef(enemyId) {
    return ENEMY_BY_ID[enemyId]?.reward;
  }
  function saveGame(state2, storage) {
    const s = storage || (typeof localStorage !== "undefined" ? localStorage : null);
    if (!s) return false;
    s.setItem(SAVE_KEY, JSON.stringify(state2));
    return true;
  }
  function loadGame(storage) {
    const s = storage || (typeof localStorage !== "undefined" ? localStorage : null);
    if (!s) return null;
    try {
      const raw = s.getItem(SAVE_KEY) || s.getItem("cozy_adventures_save_v1");
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || typeof data.coins !== "number") return null;
      return migrate(data);
    } catch {
      return null;
    }
  }

  // src/ui/sound.js
  var ctxAudio = null;
  var enabled = true;
  function ac() {
    if (!ctxAudio && typeof AudioContext !== "undefined") {
      ctxAudio = new AudioContext();
    }
    return ctxAudio;
  }
  function initSound() {
    enabled = typeof localStorage === "undefined" || localStorage.getItem("cozy_sound") !== "off";
    if (typeof document === "undefined") return;
    const unlock = () => {
      ac()?.resume?.();
    };
    document.addEventListener?.("pointerdown", unlock, { once: true });
    document.addEventListener?.("keydown", unlock, { once: true });
  }
  function toggleSound() {
    enabled = !enabled;
    try {
      localStorage.setItem("cozy_sound", enabled ? "on" : "off");
    } catch {
    }
    return enabled;
  }
  function soundEnabled() {
    return enabled;
  }
  function tone(freq, dur, { type = "sine", gain = 0.08, delay = 0, slide = 0 } = {}) {
    const a = ac();
    if (!a || !enabled) return;
    const t0 = a.currentTime + delay;
    const osc = a.createOscillator();
    const g = a.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t0 + dur);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(1e-4, t0 + dur);
    osc.connect(g).connect(a.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }
  function sfx(name) {
    if (!enabled) return;
    switch (name) {
      case "tap":
        tone(520, 0.08, { type: "triangle", gain: 0.05 });
        break;
      case "rotate":
        tone(440, 0.07, { type: "triangle", gain: 0.06, slide: 160 });
        break;
      case "hint":
        tone(660, 0.15, { type: "sine", gain: 0.05 });
        tone(880, 0.2, { delay: 0.1, gain: 0.04 });
        break;
      case "success":
        [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.25, { delay: i * 0.09, gain: 0.06 }));
        break;
      case "coin":
        tone(990, 0.07, { type: "square", gain: 0.03 });
        tone(1320, 0.1, { delay: 0.06, type: "square", gain: 0.025 });
        break;
      case "hit":
        tone(180, 0.08, { type: "sawtooth", gain: 0.04, slide: -60 });
        break;
      case "crit":
        tone(240, 0.12, { type: "sawtooth", gain: 0.06, slide: -120 });
        break;
      case "potion":
        tone(392, 0.12, { gain: 0.05 });
        tone(523, 0.15, { delay: 0.08, gain: 0.05 });
        break;
      case "fail":
        [392, 330, 262].forEach((f, i) => tone(f, 0.3, { delay: i * 0.14, gain: 0.05 }));
        break;
      case "moth":
        tone(300, 0.2, { type: "square", gain: 0.04, slide: 80 });
        break;
      default:
        tone(440, 0.08, { gain: 0.04 });
    }
  }

  // src/ui/tutorial.js
  function tutorialDone(state2, key) {
    return !!state2.tutorialSkipped || !!state2.tutorial[key];
  }
  function skipAllTutorials(state2) {
    state2.tutorialSkipped = true;
  }
  function startTutorial(ctx2, key, steps) {
    const { state: state2 } = ctx2;
    if (tutorialDone(state2, key)) return () => {
    };
    if (!steps || steps.length === 0) return () => {
    };
    let i = 0;
    let overlay = null;
    let cancelled = false;
    function finish(markDone = true) {
      if (overlay) {
        overlay.remove();
        overlay = null;
      }
      if (markDone && !cancelled) {
        state2.tutorial[key] = true;
        ctx2.save();
      }
    }
    function finishAll() {
      cancelled = true;
      skipAllTutorials(state2);
      ctx2.save();
      finish(false);
      ctx2.toast("\u041E\u0431\u0443\u0447\u0435\u043D\u0438\u0435 \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u043E. \u041A\u043E\u0442-\u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u0432\u0441\u0435\u0433\u0434\u0430 \u0440\u044F\u0434\u043E\u043C, \u0435\u0441\u043B\u0438 \u0447\u0442\u043E.");
    }
    function showStep() {
      if (cancelled) return;
      if (i >= steps.length) {
        finish();
        return;
      }
      const step = steps[i];
      const target = typeof step.target === "function" ? step.target() : step.target;
      if (overlay) overlay.remove();
      overlay = document.createElement("div");
      overlay.className = "tut-overlay";
      const spot = document.createElement("div");
      spot.className = "tut-spot";
      if (target && target.getBoundingClientRect) {
        const r = target.getBoundingClientRect();
        const pad = 10;
        spot.style.left = `${r.left - pad + window.scrollX}px`;
        spot.style.top = `${r.top - pad + window.scrollY}px`;
        spot.style.width = `${r.width + pad * 2}px`;
        spot.style.height = `${r.height + pad * 2}px`;
        target.scrollIntoView?.({ block: "center", behavior: "smooth" });
      } else {
        spot.style.display = "none";
      }
      overlay.appendChild(spot);
      const bubble = document.createElement("div");
      bubble.className = "tut-bubble";
      bubble.innerHTML = `
      <div class="tut-cat">\u{1F408}</div>
      <div class="tut-body">
        <div class="tut-title">${step.title}</div>
        <div class="tut-text">${step.text}</div>
        <div class="tut-actions"></div>
      </div>`;
      overlay.appendChild(bubble);
      const raf2 = typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : (f) => setTimeout(f, 16);
      raf2(() => positionBubble(spot, bubble));
      const actions = bubble.querySelector(".tut-actions");
      const next = document.createElement("button");
      next.className = "primary small";
      const isLast = i === steps.length - 1;
      next.textContent = step.cta || (isLast ? "\u041F\u043E\u043D\u044F\u043B!" : "\u0414\u0430\u043B\u044C\u0448\u0435 \u2192");
      const advance = (ev) => {
        ev?.stopPropagation?.();
        i += 1;
        ctx2.sfx?.("tap");
        showStep();
      };
      next.addEventListener("click", advance);
      actions.appendChild(next);
      const skip = document.createElement("button");
      skip.className = "ghost small";
      skip.textContent = "\u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u043E\u0431\u0443\u0447\u0435\u043D\u0438\u0435";
      skip.addEventListener("click", (ev) => {
        ev.stopPropagation?.();
        finishAll();
      });
      actions.appendChild(skip);
      if (target && target.addEventListener && step.advanceOnTargetClick !== false) {
        target.addEventListener("pointerdown", advance, { once: true });
      }
      document.body.appendChild(overlay);
    }
    showStep();
    return finish;
  }
  function positionBubble(spot, bubble) {
    if (!spot || spot.style.display === "none" || !bubble) {
      if (bubble) {
        bubble.style.left = "50%";
        bubble.style.top = "20%";
        bubble.style.transform = "translateX(-50%)";
      }
      return;
    }
    const sr = spot.getBoundingClientRect();
    const bw = bubble.offsetWidth || 320;
    let left = sr.left + sr.width / 2 - bw / 2 + window.scrollX;
    left = Math.max(10, Math.min(left, (window.innerWidth || 800) - bw - 10));
    const below = sr.bottom + 14 + window.scrollY;
    const above = sr.top - (bubble.offsetHeight || 120) - 14 + window.scrollY;
    const viewportH = window.innerHeight || 600;
    const fitsBelow = sr.bottom + (bubble.offsetHeight || 120) + 20 < viewportH;
    bubble.style.left = `${left}px`;
    bubble.style.top = `${fitsBelow ? below : above}px`;
  }

  // src/ui/hub.js
  function renderHub(container, ctx2) {
    const { state: state2 } = ctx2;
    const solved = Object.keys(state2.puzzlesDone).length;
    const won = Object.keys(state2.battlesDone).length;
    const scenePanel = document.createElement("div");
    scenePanel.className = "panel hub-picture";
    scenePanel.style.padding = "0";
    scenePanel.style.overflow = "hidden";
    const picture = document.createElement("img");
    picture.className = "hub-scene";
    picture.alt = "\u041B\u0430\u0432\u043A\u0430 \u043D\u0430 \u043F\u0435\u0440\u0435\u043A\u0440\u0451\u0441\u0442\u043A\u0435 \u043C\u0438\u0440\u043E\u0432";
    const candidates = ["assets/hub_banner_web.jpg", "assets/hub_banner.jfif", "assets/hub_banner.png", "assets/hub_banner.svg"];
    let candidateIdx = 0;
    picture.addEventListener("error", () => {
      candidateIdx += 1;
      if (candidateIdx < candidates.length) picture.src = candidates[candidateIdx];
      else picture.remove();
    });
    picture.src = candidates[0];
    scenePanel.appendChild(picture);
    container.appendChild(scenePanel);
    const firstPurchaseDone = (state2.stats.itemsBought || 0) > 0;
    const hotspots = [
      ["\u{1F4DA}", "\u0413\u043E\u043B\u043E\u0432\u043E\u043B\u043E\u043C\u043A\u0438", "puzzles", 15, 42, solved === 0],
      ["\u{1FA99}", "\u041F\u0440\u0438\u043B\u0430\u0432\u043E\u043A", "shop", 43, 55, solved > 0 && !firstPurchaseDone],
      ["\u{1F43E}", "\u0422\u0430\u0432\u0435\u0440\u043D\u0430", "tavern", 27, 80, false],
      ["\u{1F6E1}\uFE0F", "\u041A\u043E\u043C\u043D\u0430\u0442\u0430 \u0440\u044B\u0446\u0430\u0440\u044F", "equip", 67, 45, false],
      ["\u{1F6AA}", "\u0412 \u043F\u043E\u0445\u043E\u0434", "battles", 77, 50, firstPurchaseDone && won === 0],
      ["\u2692\uFE0F", "\u041A\u0443\u0437\u043D\u0438\u0446\u0430 \u0438 \u043A\u043E\u0442\u0451\u043B", "craft", 50, 13, false],
      ["\u{1F6E0}\uFE0F", "\u041C\u0430\u0441\u0442\u0435\u0440\u0441\u043A\u0430\u044F", "workshop", 91, 32, false]
    ];
    const hotspotEls = {};
    for (const [icon, label, screen, x, y, dot] of hotspots) {
      const b = document.createElement("button");
      b.className = "hotspot";
      b.style.left = `${x}%`;
      b.style.top = `${y}%`;
      b.setAttribute("aria-label", label);
      b.innerHTML = `<span class="hs-icon">${icon}</span><span class="hs-label">${label}</span>${dot ? '<span class="hs-dot"></span>' : ""}`;
      b.addEventListener("click", () => {
        ctx2.sfx?.("tap");
        b.classList.add("zap");
        setTimeout(() => ctx2.go(screen), 150);
      });
      scenePanel.appendChild(b);
      hotspotEls[screen] = b;
    }
    const progress = document.createElement("div");
    progress.className = "muted center mt";
    progress.style.fontSize = "14px";
    const cosIcons = (state2.cosmeticsActive || []).length ? ` \xB7 \u0423\u043A\u0440\u0430\u0448\u0435\u043D\u0438\u044F: ${(state2.cosmeticsActive || []).map((id) => ({ cos_carpet: "\u{1F7E5}", cos_crest: "\u{1FAA7}", cos_flowers: "\u{1F338}", cos_fireflies: "\u2728", cos_garland: "\u{1F38F}", cos_snow: "\u2744\uFE0F" })[id] || "\u{1F380}").join(" ")}` : "";
    progress.innerHTML = `\u{1F9E9} \u0417\u0430\u0433\u0430\u0434\u043E\u043A \u0440\u0435\u0448\u0435\u043D\u043E: <b>${solved}/${ALL_PUZZLES.length}</b> \xB7 \u2694\uFE0F \u041F\u043E\u0445\u043E\u0434\u043E\u0432 \u043F\u0440\u043E\u0439\u0434\u0435\u043D\u043E: <b>${won}/${BATTLES.length}</b> \xB7 \u{1F43E} \u041A\u043E\u043C\u0430\u043D\u0434\u0430: <b>${(state2.crew || []).length}</b>${cosIcons}`;
    container.appendChild(progress);
    const footer = document.createElement("div");
    footer.className = "panel mt center";
    const soundBtn = document.createElement("button");
    soundBtn.className = "ghost small";
    soundBtn.textContent = soundEnabled() ? "\u{1F514} \u0417\u0432\u0443\u043A: \u0432\u043A\u043B" : "\u{1F515} \u0417\u0432\u0443\u043A: \u0432\u044B\u043A\u043B";
    soundBtn.addEventListener("click", () => {
      const on = toggleSound();
      soundBtn.textContent = on ? "\u{1F514} \u0417\u0432\u0443\u043A: \u0432\u043A\u043B" : "\u{1F515} \u0417\u0432\u0443\u043A: \u0432\u044B\u043A\u043B";
      if (on) ctx2.sfx?.("coin");
    });
    const newBtn = document.createElement("button");
    newBtn.className = "ghost small";
    newBtn.textContent = "\u{1F56F}\uFE0F \u041D\u0430\u0447\u0430\u0442\u044C \u043D\u043E\u0432\u0443\u044E \u0438\u0433\u0440\u0443";
    newBtn.addEventListener("click", () => ctx2.newGameConfirm());
    footer.append(soundBtn, " ", newBtn);
    container.appendChild(footer);
    const anim = document.createElement("img");
    anim.alt = "";
    anim.style.cssText = "width:100%;border-radius:14px;margin-top:14px;opacity:0.9";
    const animCandidates = ["assets/intro_web.jpg", "assets/intro.jfif", "assets/intro_anim.svg"];
    let animIdx = 0;
    anim.addEventListener("error", () => {
      animIdx += 1;
      if (animIdx < animCandidates.length) anim.src = animCandidates[animIdx];
      else anim.remove();
    });
    anim.src = animCandidates[0];
    container.appendChild(anim);
    startTutorial(ctx2, "welcome", [
      {
        target: picture,
        title: "\u0414\u043E\u0431\u0440\u043E \u043F\u043E\u0436\u0430\u043B\u043E\u0432\u0430\u0442\u044C, \u0445\u043E\u0437\u044F\u0438\u043D!",
        text: "\u042D\u0442\u043E \u0442\u0432\u043E\u044F \u043B\u0430\u0432\u043A\u0430 \u043D\u0430 \u043F\u0435\u0440\u0435\u043A\u0440\u0451\u0441\u0442\u043A\u0435 \u043C\u0438\u0440\u043E\u0432. \u041A\u0430\u0436\u0434\u044B\u0439 \u043F\u0440\u0435\u0434\u043C\u0435\u0442 \u0432 \u043D\u0435\u0439 \u2014 \u0436\u0438\u0432\u043E\u0439: \u043F\u043E\u043B\u043A\u0438, \u043F\u0440\u0438\u043B\u0430\u0432\u043E\u043A, \u0440\u044B\u0446\u0430\u0440\u044C, \u0434\u0432\u0435\u0440\u044C. \u041A\u043B\u0438\u043A\u0430\u0439 \u043F\u043E \u043D\u0438\u043C, \u0447\u0442\u043E\u0431\u044B \u0445\u043E\u0437\u044F\u0439\u043D\u0438\u0447\u0430\u0442\u044C."
      },
      {
        target: hotspotEls.puzzles,
        title: "\u041F\u043E\u043B\u043A\u0438 \u0441 \u0437\u0430\u0433\u0430\u0434\u043A\u0430\u043C\u0438",
        text: "\u0417\u0434\u0435\u0441\u044C \u0436\u0438\u0432\u0443\u0442 \u0445\u043E\u0437\u044F\u0439\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0435 \u0433\u043E\u043B\u043E\u0432\u043E\u043B\u043E\u043C\u043A\u0438: \u0441\u0432\u0435\u0442 \u0438 \u0444\u043E\u043D\u0430\u0440\u0438\u043A\u0438, \u0442\u043E\u0432\u0430\u0440\u044B \u043D\u0430 \u043F\u043E\u043B\u043A\u0430\u0445, \u043A\u043D\u0438\u0436\u043D\u044B\u0435 \u0444\u0440\u0430\u0437\u044B \u0438 \u043F\u043E\u0438\u0441\u043A \u043F\u043E\u0442\u0435\u0440\u044F\u043D\u043D\u044B\u0445 \u043C\u0435\u043B\u043E\u0447\u0435\u0439. \u0417\u0430 \u043D\u0438\u0445 \u2014 \u043C\u043E\u043D\u0435\u0442\u044B \u0438 \u043F\u0435\u0447\u0430\u0442\u0438."
      },
      {
        target: hotspotEls.equip,
        title: "\u041A\u043E\u043C\u043D\u0430\u0442\u0430 \u0440\u044B\u0446\u0430\u0440\u044F",
        text: "\u041D\u0430\u0433\u0440\u0430\u0434\u044B \u0442\u0440\u0430\u0442\u044C \u043D\u0430 \u0441\u043D\u0430\u0440\u044F\u0436\u0435\u043D\u0438\u0435: \u0434\u0435\u0432\u044F\u0442\u044C \u0441\u043B\u043E\u0442\u043E\u0432, \u0434\u0432\u0443\u0440\u0443\u0447\u043D\u043E\u0435 \u043E\u0440\u0443\u0436\u0438\u0435 \u0437\u0430\u043D\u0438\u043C\u0430\u0435\u0442 \u043E\u0431\u0435 \u0440\u0443\u043A\u0438. \u0412\u0435\u0449\u0438 \u0440\u0435\u0430\u043B\u044C\u043D\u043E \u043C\u0435\u043D\u044F\u044E\u0442 \u0431\u043E\u0439."
      },
      {
        target: hotspotEls.battles,
        title: "\u0414\u0432\u0435\u0440\u044C \u0432 \u043F\u043E\u0445\u043E\u0434",
        text: "\u0420\u044B\u0446\u0430\u0440\u044C \u0441\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044F \u0441\u0430\u043C \u2014 \u0442\u0432\u043E\u044F \u0437\u0430\u0431\u043E\u0442\u0430 \u0432 \u0442\u043E\u043C, \u0447\u0435\u043C \u043E\u043D \u043E\u0434\u0435\u0442 \u0438 \u043A\u0442\u043E \u0441 \u043D\u0438\u043C. \u041D\u0430\u0447\u043D\u0438 \u0441 \u043F\u0435\u0440\u0432\u043E\u0439 \u0437\u0430\u0433\u0430\u0434\u043A\u0438: \u043E\u043D\u0430 \u0443\u0436\u0435 \u0436\u0434\u0451\u0442 \u043D\u0430 \u043F\u043E\u043B\u043A\u0430\u0445.",
        cta: "\u041A \u0437\u0430\u0433\u0430\u0434\u043A\u0430\u043C!"
      }
    ]);
  }

  // src/core/puzzle.js
  var DIR = [
    [0, -1],
    // 0 вверх
    [1, 0],
    // 1 вправо
    [0, 1],
    // 2 вниз
    [-1, 0]
    // 3 влево
  ];
  function reflect(dir, orient) {
    return orient === 0 ? { 0: 3, 1: 2, 2: 1, 3: 0 }[dir] : { 0: 1, 1: 0, 2: 3, 3: 2 }[dir];
  }
  function createPuzzle(level) {
    const mirrors = level.objects.map((o, i) => ({ ...o, index: i })).filter((o) => o.type === "mirror");
    return {
      level,
      // ориентации зеркал по индексу объекта в level.objects
      orient: Object.fromEntries(mirrors.map((m) => [m.index, m.orient ?? 0])),
      history: [],
      // стек ходов для отмены
      moves: 0
    };
  }
  function rotateMirror(state2, objectIndex) {
    const obj = state2.level.objects[objectIndex];
    if (!obj || obj.type !== "mirror") return false;
    state2.history.push({ objectIndex, prev: state2.orient[objectIndex] });
    state2.orient[objectIndex] = state2.orient[objectIndex] === 0 ? 1 : 0;
    state2.moves += 1;
    return true;
  }
  function undo(state2) {
    const last = state2.history.pop();
    if (!last) return false;
    state2.orient[last.objectIndex] = last.prev;
    state2.moves += 1;
    return true;
  }
  function reset(state2) {
    for (const [idx, o] of Object.entries(state2.orient)) {
      state2.orient[idx] = state2.level.objects[idx].orient ?? 0;
    }
    state2.history = [];
    state2.moves += 1;
  }
  function traceLight(state2) {
    const { level } = state2;
    const [w, h] = level.grid;
    const at = /* @__PURE__ */ new Map();
    level.objects.forEach((o, i) => at.set(o.pos[0] + "," + o.pos[1], { obj: o, index: i }));
    const lanternsLit = /* @__PURE__ */ new Set();
    const mothsAwake = /* @__PURE__ */ new Set();
    const beams = [];
    const visited = /* @__PURE__ */ new Set();
    for (const src of level.objects) {
      if (src.type !== "source") continue;
      let [x, y] = src.pos;
      let d = src.dir;
      let guard = w * h * 4 + 16;
      while (guard-- > 0) {
        const [dx, dy] = DIR[d];
        x += dx;
        y += dy;
        if (x < 0 || y < 0 || x >= w || y >= h) break;
        beams.push({ from: [x - dx, y - dy], to: [x, y] });
        const key = `${x},${y},${d}`;
        if (visited.has(key)) break;
        visited.add(key);
        const cell = at.get(`${x},${y}`);
        if (!cell) continue;
        const t = cell.obj.type;
        if (t === "wall" || t === "moth" || t === "source") {
          if (t === "moth") mothsAwake.add(cell.index);
          break;
        }
        if (t === "lantern") {
          lanternsLit.add(cell.index);
          continue;
        }
        if (t === "mirror") {
          d = reflect(d, state2.orient[cell.index]);
        }
      }
    }
    return { lanternsLit, mothsAwake, beams };
  }
  function isSolved(state2) {
    const { level } = state2;
    const { lanternsLit, mothsAwake } = traceLight(state2);
    if (mothsAwake.size > 0) return false;
    return level.objects.every((o, i) => o.type !== "lantern" || lanternsLit.has(i));
  }
  function status(state2) {
    const { level } = state2;
    const { lanternsLit, mothsAwake } = traceLight(state2);
    const total = level.objects.filter((o) => o.type === "lantern").length;
    return {
      lanternsLit: lanternsLit.size,
      lanternsTotal: total,
      mothsAwake: mothsAwake.size,
      solved: mothsAwake.size === 0 && lanternsLit.size === total
    };
  }

  // src/core/solver.js
  function mirrorIndices(level) {
    return level.objects.map((o, i) => o.type === "mirror" ? i : -1).filter((i) => i >= 0);
  }
  function orientationsFromBits(mirrors, bits) {
    const orient = {};
    mirrors.forEach((idx, k) => {
      orient[idx] = bits >> k & 1;
    });
    return orient;
  }
  function stateWith(level, orient) {
    const s = createPuzzle(level);
    s.orient = { ...orient };
    return s;
  }
  function findSolutions(level, maxSolutions = 64) {
    const mirrors = mirrorIndices(level);
    const total = 1 << mirrors.length;
    if (mirrors.length > 20) return { count: 0, solutions: [], tooMany: true };
    const solutions = [];
    for (let bits = 0; bits < total && solutions.length < maxSolutions; bits++) {
      const s = stateWith(level, orientationsFromBits(mirrors, bits));
      if (isSolved(s)) solutions.push(s.orient);
    }
    return { count: solutions.length, solutions, tooMany: false };
  }
  function validateLevel(level) {
    const { count, solutions } = findSolutions(level);
    return {
      solvable: count > 0,
      solutionCount: count,
      solutions
    };
  }
  function hint(state2) {
    const { level } = state2;
    const { solutions } = findSolutions(level);
    if (solutions.length === 0) return { type: "unsolvable" };
    let best = null;
    let bestDist = Infinity;
    for (const sol of solutions) {
      let dist = 0;
      for (const idx2 of Object.keys(sol)) {
        if (state2.orient[idx2] !== sol[idx2]) dist++;
      }
      if (dist < bestDist) {
        bestDist = dist;
        best = sol;
      }
    }
    if (bestDist === 0) return { type: "already" };
    const idx = Object.keys(best).find((i) => state2.orient[i] !== best[i]);
    return { type: "rotate", objectIndex: Number(idx) };
  }

  // src/core/shelfPuzzle.js
  var TAG_LABEL = {
    fragile: "\u0445\u0440\u0443\u043F\u043A\u043E\u0435",
    heavy: "\u0442\u044F\u0436\u0451\u043B\u043E\u0435",
    metal: "\u043C\u0435\u0442\u0430\u043B\u043B",
    magic: "\u043C\u0430\u0433\u0438\u044F",
    potion: "\u0437\u0435\u043B\u044C\u044F",
    herb: "\u0442\u0440\u0430\u0432\u044B",
    food: "\u0435\u0434\u0430",
    glow: "\u0441\u0432\u0435\u0442\u044F\u0449\u0435\u0435\u0441\u044F"
  };
  var TAG_LABEL_INST = {
    fragile: "\u0445\u0440\u0443\u043F\u043A\u0438\u043C",
    heavy: "\u0442\u044F\u0436\u0451\u043B\u044B\u043C",
    metal: "\u043C\u0435\u0442\u0430\u043B\u043B\u043E\u043C",
    magic: "\u043C\u0430\u0433\u0438\u0435\u0439",
    potion: "\u0437\u0435\u043B\u044C\u044F\u043C\u0438",
    herb: "\u0442\u0440\u0430\u0432\u0430\u043C\u0438",
    food: "\u0435\u0434\u043E\u0439",
    glow: "\u0441\u0432\u0435\u0442\u044F\u0449\u0438\u043C\u0441\u044F"
  };
  function createShelfPuzzle(level) {
    return {
      level,
      placement: {},
      // itemId -> [x, y] | undefined
      history: [],
      moves: 0
    };
  }
  function shelfCells(level) {
    return level.cells.filter((c) => c.kind === "shelf" || c.kind === "light");
  }
  function isLightCell(level, x, y) {
    return level.cells.some((c) => c.kind === "light" && c.pos[0] === x && c.pos[1] === y);
  }
  function cellOf(state2, x, y) {
    for (const [itemId, pos] of Object.entries(state2.placement)) {
      if (pos && pos[0] === x && pos[1] === y) return itemId;
    }
    return null;
  }
  function placeItem(state2, itemId, x, y) {
    const { level } = state2;
    const item2 = level.items.find((i) => i.id === itemId);
    if (!item2) return { ok: false, error: "\u041D\u0435\u0442 \u0442\u0430\u043A\u043E\u0433\u043E \u0442\u043E\u0432\u0430\u0440\u0430" };
    const cell = shelfCells(level).find((c) => c.pos[0] === x && c.pos[1] === y);
    if (!cell) return { ok: false, error: "\u0421\u044E\u0434\u0430 \u043D\u0435 \u043F\u043E\u0441\u0442\u0430\u0432\u0438\u0442\u044C" };
    const occupant = cellOf(state2, x, y);
    if (occupant) return { ok: false, error: "\u041A\u043B\u0435\u0442\u043A\u0430 \u0437\u0430\u043D\u044F\u0442\u0430" };
    state2.history.push({ itemId, prev: state2.placement[itemId] ?? null });
    state2.placement[itemId] = [x, y];
    state2.moves += 1;
    return { ok: true };
  }
  function removeItem(state2, itemId) {
    if (!(itemId in state2.placement) || !state2.placement[itemId]) return false;
    state2.history.push({ itemId, prev: state2.placement[itemId] });
    state2.placement[itemId] = null;
    state2.moves += 1;
    return true;
  }
  function undoShelf(state2) {
    const last = state2.history.pop();
    if (!last) return false;
    state2.placement[last.itemId] = last.prev;
    state2.moves += 1;
    return true;
  }
  function resetShelf(state2) {
    state2.placement = {};
    state2.history = [];
    state2.moves += 1;
  }
  function adjacent(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) === 1;
  }
  function violations(state2) {
    const { level } = state2;
    const out = [];
    const placed = Object.entries(state2.placement).filter(([, pos]) => pos).map(([itemId, pos]) => ({ item: level.items.find((i) => i.id === itemId), pos }));
    const hasTag = (item2, tag) => item2.tags.includes(tag);
    for (const [tagA, tagB] of level.rules.notAdjacent || []) {
      for (const a of placed) {
        for (const b of placed) {
          if (a.item.id >= b.item.id) continue;
          const match = hasTag(a.item, tagA) && hasTag(b.item, tagB) || hasTag(a.item, tagB) && hasTag(b.item, tagA);
          if (match && adjacent(a.pos, b.pos)) {
            out.push({
              rule: "notAdjacent",
              itemA: a.item.id,
              itemB: b.item.id,
              text: `\xAB${a.item.name}\xBB \u043D\u0435\u043B\u044C\u0437\u044F \u0440\u044F\u0434\u043E\u043C \u0441 \xAB${b.item.name}\xBB`
            });
          }
        }
      }
    }
    for (const [tagA, tagB] of level.rules.mustAdjacent || []) {
      for (const a of placed) {
        if (!hasTag(a.item, tagA)) continue;
        const ok = placed.some((b) => b.item.id !== a.item.id && hasTag(b.item, tagB) && adjacent(a.pos, b.pos));
        if (!ok) {
          out.push({
            rule: "mustAdjacent",
            itemA: a.item.id,
            needTag: tagB,
            text: `\xAB${a.item.name}\xBB \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u0442\u043E\u044F\u0442\u044C \u0440\u044F\u0434\u043E\u043C \u0441 \xAB${TAG_LABEL_INST[tagB] || tagB}\xBB`
          });
        }
      }
    }
    for (const tag of level.rules.onLight || []) {
      for (const a of placed) {
        if (!hasTag(a.item, tag)) continue;
        if (!isLightCell(level, a.pos[0], a.pos[1])) {
          out.push({
            rule: "onLight",
            itemA: a.item.id,
            text: `\xAB${a.item.name}\xBB \u043D\u0443\u0436\u043D\u043E \u043D\u0430 \u0441\u0432\u0435\u0442\u0443`
          });
        }
      }
    }
    return out;
  }
  function isShelfSolved(state2) {
    const allPlaced = state2.level.items.every((i) => state2.placement[i.id]);
    return allPlaced && violations(state2).length === 0;
  }
  function solveShelf(level, maxSolutions = 32) {
    const items = level.items;
    const cells = shelfCells(level);
    if (items.length > cells.length) return { count: 0, solutions: [], impossible: true };
    if (cells.length > 12 || items.length > 8) return { count: 0, solutions: [], tooBig: true };
    const solutions = [];
    const assign = new Array(items.length).fill(-1);
    const usedCell = new Array(cells.length).fill(false);
    function partialOk(upto) {
      const placement = {};
      for (let i = 0; i <= upto; i++) {
        if (assign[i] >= 0) placement[items[i].id] = cells[assign[i]].pos;
      }
      const probe = { level, placement };
      const v = violations(probe);
      return !v.some((x) => x.rule === "notAdjacent" || x.rule === "onLight");
    }
    function fullOk() {
      const placement = {};
      items.forEach((it, i) => {
        placement[it.id] = cells[assign[i]].pos;
      });
      return violations({ level, placement }).length === 0;
    }
    function bt(k) {
      if (solutions.length >= maxSolutions) return;
      if (k === items.length) {
        if (fullOk()) solutions.push([...assign]);
        return;
      }
      for (let c = 0; c < cells.length; c++) {
        if (usedCell[c]) continue;
        assign[k] = c;
        usedCell[c] = true;
        if (partialOk(k)) bt(k + 1);
        assign[k] = -1;
        usedCell[c] = false;
      }
    }
    bt(0);
    return { count: solutions.length, solutions, cells };
  }
  function shelfHint(state2) {
    const { level } = state2;
    const { count, solutions, cells } = solveShelf(level, 64);
    if (count === 0) return { type: "unsolvable" };
    const bad = violations(state2).filter((v) => v.rule === "notAdjacent" || v.rule === "onLight");
    if (bad.length > 0) {
      return { type: "remove", itemId: bad[0].itemA, text: bad[0].text };
    }
    let best = null;
    let bestScore = -1;
    for (const sol of solutions) {
      let score = 0;
      level.items.forEach((it, i) => {
        const pos = cells[sol[i]].pos;
        const cur = state2.placement[it.id];
        if (cur && cur[0] === pos[0] && cur[1] === pos[1]) score++;
      });
      if (score > bestScore) {
        bestScore = score;
        best = sol;
      }
    }
    for (let i = 0; i < level.items.length; i++) {
      const it = level.items[i];
      const pos = cells[best[i]].pos;
      const cur = state2.placement[it.id];
      if (!cur) return { type: "place", itemId: it.id, pos };
      if (cur[0] !== pos[0] || cur[1] !== pos[1]) {
        return { type: "move", itemId: it.id, from: cur, pos };
      }
    }
    return { type: "already" };
  }

  // src/data/materials.js
  var MATERIALS = [
    { id: "slime_jelly", name: "\u0421\u043B\u0438\u0437\u044C \u043B\u0443\u0436\u0430\u0439\u043D\u0438\u043A\u0430", icon: "\u{1F7E2}", description: "\u041F\u0440\u043E\u0445\u043B\u0430\u0434\u043D\u0430\u044F \u0438 \u043F\u0435\u0440\u0435\u043B\u0438\u0432\u0430\u0435\u0442\u0441\u044F." },
    { id: "honey", name: "\u0414\u0438\u043A\u0438\u0439 \u043C\u0451\u0434", icon: "\u{1F36F}", description: "\u0413\u0443\u0441\u0442\u043E\u0439, \u0441 \u0437\u0430\u043F\u0430\u0445\u043E\u043C \u043B\u0443\u0433\u043E\u0432\u044B\u0445 \u0442\u0440\u0430\u0432." },
    { id: "glow_moss", name: "\u0421\u0432\u0435\u0442\u044F\u0449\u0438\u0439\u0441\u044F \u043C\u043E\u0445", icon: "\u{1F33F}", description: "\u041C\u044F\u0433\u043A\u043E \u0441\u0432\u0435\u0442\u0438\u0442\u0441\u044F \u0432 \u0442\u0435\u043C\u043D\u043E\u0442\u0435." },
    { id: "moth_dust", name: "\u041F\u044B\u043B\u044C\u0446\u0430 \u043C\u043E\u0442\u044B\u043B\u044C\u043A\u0430", icon: "\u{1F98B}", description: "\u0423\u0441\u044B\u043F\u043B\u044F\u0435\u0442, \u0435\u0441\u043B\u0438 \u043F\u043E\u043D\u044E\u0445\u0430\u0442\u044C." },
    { id: "moss_stone", name: "\u041C\u0448\u0438\u0441\u0442\u044B\u0439 \u043A\u0430\u043C\u0435\u043D\u044C", icon: "\u{1F5FF}", description: "\u041A\u0430\u043C\u0435\u043D\u044C \u0432 \u043F\u043B\u043E\u0442\u043D\u043E\u0439 \u0448\u0443\u0431\u043A\u0435 \u043C\u0445\u0430." },
    { id: "willow_heart", name: "\u0421\u0435\u0440\u0434\u0446\u0435 \u0441\u0442\u0430\u0440\u043E\u0439 \u0438\u0432\u044B", icon: "\u{1F333}", description: "\u0422\u0451\u043F\u043B\u0430\u044F \u0434\u0440\u0435\u0432\u0435\u0441\u0438\u043D\u0430 \u0441 \u0445\u0430\u0440\u0430\u043A\u0442\u0435\u0440\u043E\u043C." },
    { id: "rat_tail", name: "\u041A\u0440\u044B\u0441\u0438\u043D\u044B\u0439 \u0445\u0432\u043E\u0441\u0442", icon: "\u{1F400}", description: "\u041A\u0440\u0435\u043F\u043A\u0438\u0439 \u0438 \u0433\u0438\u0431\u043A\u0438\u0439. \u0412\u0435\u0434\u044C\u043C\u0438\u043D\u043A\u0438 \u0446\u0435\u043D\u044F\u0442." },
    { id: "torn_cloth", name: "\u0420\u0432\u0430\u043D\u0430\u044F \u0442\u043A\u0430\u043D\u044C", icon: "\u{1F9E3}", description: "\u041D\u0438\u0447\u0435\u043C \u043D\u0435 \u043F\u0430\u0445\u043D\u0435\u0442, \u043F\u0440\u0438\u0433\u043E\u0434\u0438\u0442\u0441\u044F." },
    { id: "brick_chunk", name: "\u041E\u0431\u043B\u043E\u043C\u043E\u043A \u043A\u043B\u0430\u0434\u043A\u0438", icon: "\u{1F9F1}", description: "\u0422\u044F\u0436\u0451\u043B\u044B\u0439, \u0441 \u0446\u0435\u043C\u0435\u043D\u0442\u043D\u043E\u0439 \u043F\u044B\u043B\u044C\u044E." },
    { id: "ectoplasm", name: "\u042D\u043A\u0442\u043E\u043F\u043B\u0430\u0437\u043C\u0430", icon: "\u{1F47B}", description: "\u0425\u043E\u043B\u043E\u0434\u043D\u0430\u044F \u0434\u044B\u043C\u043A\u0430 \u0432 \u0441\u043A\u043B\u044F\u043D\u043A\u0435." },
    { id: "captain_badge", name: "\u0417\u043D\u0430\u0447\u043E\u043A \u043A\u0430\u043F\u0438\u0442\u0430\u043D\u0430", icon: "\u{1F396}\uFE0F", description: "\u041F\u043E\u0442\u0451\u0440\u0442\u044B\u0439, \u043D\u043E \u0433\u043E\u0440\u0434\u044B\u0439." },
    { id: "ink_drop", name: "\u041A\u0430\u043F\u043B\u044F \u0447\u0435\u0440\u043D\u0438\u043B", icon: "\u{1FADF}", description: "\u041A\u043E\u043D\u0446\u0435\u043D\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u0430\u044F, \u043F\u043E\u0447\u0442\u0438 \u0436\u0438\u0432\u0430\u044F." },
    { id: "paper_scrap", name: "\u041E\u0431\u0440\u044B\u0432\u043E\u043A \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B", icon: "\u{1F4C4}", description: "\u0421 \u043F\u043E\u043B\u043E\u0432\u0438\u043D\u043E\u0439 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F." },
    { id: "page_dust", name: "\u041A\u043D\u0438\u0436\u043D\u0430\u044F \u043F\u044B\u043B\u044C", icon: "\u{1F4D6}", description: "\u041F\u0430\u0445\u043D\u0435\u0442 \u0441\u0442\u0430\u0440\u044B\u043C\u0438 \u0438\u0441\u0442\u043E\u0440\u0438\u044F\u043C\u0438." },
    { id: "gold_leaf", name: "\u0421\u0443\u0441\u0430\u043B\u044C\u043D\u043E\u0435 \u0437\u043E\u043B\u043E\u0442\u043E", icon: "\u{1F342}", description: "\u0422\u043E\u043D\u044C\u0448\u0435 \u043B\u0435\u043F\u0435\u0441\u0442\u043A\u0430." },
    { id: "last_page", name: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430", icon: "\u{1F4DC}", description: "\u041D\u0430 \u043D\u0435\u0439 \u2014 \u043A\u043E\u043D\u0435\u0446 \u043B\u044E\u0431\u043E\u0439 \u0438\u0441\u0442\u043E\u0440\u0438\u0438." }
  ];
  var MATERIAL_BY_ID = Object.fromEntries(MATERIALS.map((m) => [m.id, m]));
  function materialLabel(id) {
    const m = MATERIAL_BY_ID[id];
    return m ? `${m.icon} ${m.name}` : id;
  }

  // src/ui/common.js
  function header(ctx2, title, subtitle, backTo = "hub") {
    const box = document.createElement("div");
    box.className = "panel";
    const top = document.createElement("div");
    top.style.display = "flex";
    top.style.justifyContent = "space-between";
    top.style.alignItems = "center";
    const h = document.createElement("h2");
    h.textContent = title;
    h.style.margin = "0";
    const back = document.createElement("button");
    back.className = "ghost small";
    back.textContent = "\u2190 \u041D\u0430\u0437\u0430\u0434";
    back.addEventListener("click", () => ctx2.go(backTo));
    top.append(h, back);
    box.appendChild(top);
    if (subtitle) {
      const s = document.createElement("div");
      s.className = "muted";
      s.textContent = subtitle;
      box.appendChild(s);
    }
    return box;
  }
  function quickNav(ctx2, items) {
    const nav = document.createElement("div");
    nav.className = "quick-nav";
    for (const it of items) {
      const b = document.createElement("button");
      b.innerHTML = `${it.icon}<span class="qn-label">${it.label}</span>`;
      b.setAttribute("aria-label", it.label);
      if (it.primary) b.className = "primary";
      b.addEventListener("click", () => {
        ctx2.sfx?.("tap");
        ctx2.go(it.screen);
      });
      nav.appendChild(b);
    }
    return nav;
  }
  function rewardText(r) {
    if (r.type === "coins") return `\u{1FA99} ${r.amount} \u043C\u043E\u043D\u0435\u0442`;
    if (r.type === "seals") return `\u{1F530} ${r.amount} \u043F\u0435\u0447\u0430\u0442\u044C \u043C\u0430\u0441\u0442\u0435\u0440\u0430`;
    if (r.type === "item") return `\u{1F381} ${ITEM_BY_ID[r.id]?.name || r.id}`;
    if (r.type === "material") return `\u041C\u0430\u0442\u0435\u0440\u0438\u0430\u043B: ${materialLabel(r.id)}${r.amount > 1 ? ` \xD7${r.amount}` : ""}`;
    return "";
  }
  function showOverlay(ctx2, { title, subtitle, rewards, advice, buttons }) {
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    const rewardHtml = (rewards || []).map(rewardText).filter(Boolean).join("<br>");
    overlay.innerHTML = `
    <div class="card">
      <h2>${title}</h2>
      ${subtitle ? `<div class="muted">${subtitle}</div>` : ""}
      ${rewardHtml ? `<div class="rewards">${rewardHtml}</div>` : ""}
      ${advice ? `<div class="advice">\u{1F4A1} ${advice}</div>` : ""}
      <div class="actions"></div>
    </div>`;
    const actions = overlay.querySelector(".actions");
    for (const b of buttons) {
      const btn = document.createElement("button");
      btn.textContent = b.label;
      if (b.primary) btn.className = "primary";
      btn.addEventListener("click", () => {
        overlay.remove();
        b.onClick();
      });
      actions.appendChild(btn);
    }
    document.body.appendChild(overlay);
    return overlay;
  }

  // src/ui/shelfView.js
  var CELL = 64;
  function renderShelfPuzzle(container, ctx2, level) {
    const puzzle = createShelfPuzzle(level);
    let selectedItem = null;
    let hintsUsed = 0;
    let hintMark = null;
    let finished = false;
    container.appendChild(header(ctx2, level.name, `\u0421\u043B\u043E\u0436\u043D\u043E\u0441\u0442\u044C: ${"\u2605".repeat(level.difficulty)}`, "puzzles"));
    const wrap = document.createElement("div");
    wrap.className = "puzzle-wrap";
    const canvasBox = document.createElement("div");
    canvasBox.className = "puzzle-canvas-box";
    const canvas = document.createElement("canvas");
    canvas.className = "game";
    const [gw, gh] = level.grid;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = gw * CELL * dpr;
    canvas.height = gh * CELL * dpr;
    canvas.style.width = `${gw * CELL}px`;
    canvas.style.height = `${gh * CELL}px`;
    canvas.style.maxWidth = "100%";
    canvasBox.appendChild(canvas);
    wrap.appendChild(canvasBox);
    const side = document.createElement("div");
    side.className = "puzzle-side";
    const intro = document.createElement("div");
    intro.className = "intro-text";
    intro.textContent = level.intro;
    side.appendChild(intro);
    const rulesBox = document.createElement("div");
    rulesBox.className = "panel";
    rulesBox.style.padding = "10px 14px";
    rulesBox.innerHTML = `<div class="desc" style="line-height:1.8">${rulesText(level)}</div>`;
    side.appendChild(rulesBox);
    const statusEl = document.createElement("div");
    statusEl.className = "puzzle-status";
    side.appendChild(statusEl);
    const trayLabel = document.createElement("div");
    trayLabel.className = "muted";
    trayLabel.textContent = "\u041B\u043E\u0442\u043E\u043A (\u0442\u0430\u043F\u043D\u0438 \u0442\u043E\u0432\u0430\u0440, \u0437\u0430\u0442\u0435\u043C \u043A\u043B\u0435\u0442\u043A\u0443):";
    trayLabel.style.fontSize = "13px";
    trayLabel.style.marginTop = "8px";
    side.appendChild(trayLabel);
    const tray = document.createElement("div");
    tray.style.display = "flex";
    tray.style.flexWrap = "wrap";
    tray.style.gap = "8px";
    side.appendChild(tray);
    const controls = document.createElement("div");
    controls.className = "puzzle-controls";
    controls.style.marginTop = "10px";
    const btnUndo = mkBtn("\u21A9\uFE0F \u041E\u0442\u043C\u0435\u043D\u0430 (Z)", doUndo);
    const btnHint = mkBtn("\u{1F4A1} \u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430 (H)", doHint);
    const btnReset = mkBtn("\u{1F504} \u0421\u0431\u0440\u043E\u0441 (R)", doReset);
    controls.append(btnUndo, btnHint, btnReset);
    side.appendChild(controls);
    wrap.appendChild(side);
    container.appendChild(wrap);
    function mkBtn(label, fn) {
      const b = document.createElement("button");
      b.innerHTML = label;
      b.addEventListener("click", fn);
      return b;
    }
    function doUndo() {
      if (finished) return;
      if (undoShelf(puzzle)) {
        hintMark = null;
        ctx2.sfx?.("tap");
        draw();
      }
    }
    function doReset() {
      if (finished) return;
      resetShelf(puzzle);
      selectedItem = null;
      hintMark = null;
      ctx2.sfx?.("tap");
      draw();
    }
    function doHint() {
      if (finished) return;
      const h = shelfHint(puzzle);
      ctx2.sfx?.("hint");
      if (h.type === "place" || h.type === "move") {
        hintsUsed += 1;
        hintMark = { itemId: h.itemId, pos: h.pos };
        const it = level.items.find((i) => i.id === h.itemId);
        ctx2.toast(`\u041A\u043E\u0442-\u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u043A\u0438\u0432\u0430\u0435\u0442: \xAB${it?.name}\xBB \u2014 \u0432\u043E\u0442 \u0441\u044E\u0434\u0430.`);
        draw();
      } else if (h.type === "remove") {
        hintsUsed += 1;
        const it = level.items.find((i) => i.id === h.itemId);
        hintMark = { itemId: h.itemId, pos: puzzle.placement[h.itemId] };
        ctx2.toast(h.text || `\u0423\u0431\u0435\u0440\u0438 \xAB${it?.name}\xBB \u043E\u0442\u0441\u044E\u0434\u0430.`);
        draw();
      } else if (h.type === "already") {
        ctx2.toast("\u0412\u0441\u0451 \u0443\u0436\u0435 \u0441\u0442\u043E\u0438\u0442 \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E!");
      } else {
        ctx2.toast("\u0425\u043C, \u044D\u0442\u043E\u0442 \u0443\u0440\u043E\u0432\u0435\u043D\u044C \u043D\u0435 \u0440\u0435\u0448\u0430\u0435\u0442\u0441\u044F. \u0421\u043A\u0430\u0436\u0438 \u0445\u043E\u0437\u044F\u0438\u043D\u0443 \u043B\u0430\u0432\u043A\u0438!");
      }
    }
    function onTap(ev) {
      if (finished) return;
      const rect = canvas.getBoundingClientRect();
      const scale = canvas.width / dpr / rect.width;
      const x = Math.floor((ev.clientX - rect.left) * scale / CELL);
      const y = Math.floor((ev.clientY - rect.top) * scale / CELL);
      const occupantId = Object.entries(puzzle.placement).find(([, pos]) => pos && pos[0] === x && pos[1] === y)?.[0];
      if (occupantId) {
        removeItem(puzzle, occupantId);
        selectedItem = occupantId;
        hintMark = null;
        ctx2.sfx?.("tap");
        draw();
        return;
      }
      if (selectedItem) {
        const r = placeItem(puzzle, selectedItem, x, y);
        if (r.ok) {
          const placed = selectedItem;
          selectedItem = null;
          hintMark = null;
          ctx2.sfx?.("rotate");
          draw();
          if (isShelfSolved(puzzle)) finish();
        } else {
          ctx2.toast(r.error);
        }
      }
    }
    canvas.addEventListener("pointerdown", onTap);
    function onKey(ev) {
      if (ev.key === "z" || ev.key === "Z" || ev.ctrlKey && ev.key === "z") {
        ev.preventDefault();
        doUndo();
      }
      if (ev.key === "h" || ev.key === "H" || ev.key === "\u0440" || ev.key === "\u0420") doHint();
      if (ev.key === "r" || ev.key === "R" || ev.key === "\u043A" || ev.key === "\u041A") doReset();
      if (ev.key === "Escape") ctx2.go("puzzles");
    }
    window.addEventListener("keydown", onKey);
    function finish() {
      finished = true;
      const rewards = completePuzzle(ctx2.state, level.id, { moves: puzzle.moves, hintsUsed });
      ctx2.save();
      ctx2.sfx?.("success");
      draw();
      setTimeout(() => {
        const next = nextPuzzle(level.id);
        showOverlay(ctx2, {
          title: "\u{1F3EE} \u041B\u0430\u0432\u043A\u0430 \u0433\u043E\u0442\u043E\u0432\u0430 \u043A \u043E\u0442\u043A\u0440\u044B\u0442\u0438\u044E!",
          subtitle: `\xAB${level.name}\xBB \u2014 \u0440\u0435\u0448\u0435\u043D\u043E`,
          rewards,
          buttons: [
            ...next ? [{ label: `\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0430\u044F \u2192 ${next.name}`, primary: true, onClick: () => ctx2.go("puzzle", { id: next.id }) }] : [],
            { label: "\u041A \u0437\u0430\u0433\u0430\u0434\u043A\u0430\u043C", primary: !next, onClick: () => ctx2.go("puzzles") },
            { label: "\u0415\u0449\u0451 \u0440\u0430\u0437", onClick: () => ctx2.go("puzzle", { id: level.id }) },
            { label: "\u0412 \u043B\u0430\u0432\u043A\u0443", onClick: () => ctx2.go("hub") }
          ]
        });
      }, 450);
    }
    function draw() {
      const g = canvas.getContext("2d");
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, gw * CELL, gh * CELL);
      for (let y = 0; y < gh; y++) {
        for (let x = 0; x < gw; x++) {
          g.fillStyle = (x + y) % 2 === 0 ? "#4a4038" : "#524840";
          g.fillRect(x * CELL, y * CELL, CELL, CELL);
        }
      }
      for (const c of level.cells) {
        const px = c.pos[0] * CELL;
        const py = c.pos[1] * CELL;
        if (c.kind === "shelf") {
          g.fillStyle = "#6b5335";
          g.fillRect(px + 3, py + 3, CELL - 6, CELL - 6);
          g.fillStyle = "#7d6444";
          g.fillRect(px + 3, py + 3, CELL - 6, 8);
        } else if (c.kind === "light") {
          g.fillStyle = "#6b5335";
          g.fillRect(px + 3, py + 3, CELL - 6, CELL - 6);
          const grad = g.createRadialGradient(
            px + CELL / 2,
            py + CELL / 2,
            4,
            px + CELL / 2,
            py + CELL / 2,
            CELL / 2
          );
          grad.addColorStop(0, "rgba(255, 226, 138, 0.5)");
          grad.addColorStop(1, "rgba(255, 226, 138, 0.05)");
          g.fillStyle = grad;
          g.fillRect(px, py, CELL, CELL);
          g.font = `${CELL * 0.22}px sans-serif`;
          g.textAlign = "right";
          g.textBaseline = "top";
          g.fillText("\u2600\uFE0F", px + CELL - 4, py + 4);
        } else {
          g.fillStyle = "#33291f";
          g.fillRect(px + 3, py + 3, CELL - 6, CELL - 6);
        }
      }
      const v = violations(puzzle);
      const badItems = new Set(v.flatMap((x) => [x.itemA, x.itemB]).filter(Boolean));
      for (const [itemId, pos] of Object.entries(puzzle.placement)) {
        if (!pos) continue;
        const it = level.items.find((i) => i.id === itemId);
        const cx = pos[0] * CELL + CELL / 2;
        const cy = pos[1] * CELL + CELL / 2;
        if (badItems.has(itemId)) {
          g.fillStyle = "rgba(232, 138, 122, 0.3)";
          g.fillRect(pos[0] * CELL + 3, pos[1] * CELL + 3, CELL - 6, CELL - 6);
        }
        if (hintMark && hintMark.itemId === itemId) {
          g.fillStyle = "rgba(255, 202, 122, 0.35)";
          g.beginPath();
          g.arc(cx, cy, CELL * 0.46, 0, Math.PI * 2);
          g.fill();
        }
        g.font = `${CELL * 0.55}px "Segoe UI Emoji", sans-serif`;
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillText(it?.icon || "\u{1F381}", cx, cy);
      }
      if (hintMark && hintMark.pos && !badItems.size) {
        const [hx, hy] = hintMark.pos;
        const occupant = Object.values(puzzle.placement).some((p) => p && p[0] === hx && p[1] === hy);
        if (!occupant) {
          g.strokeStyle = "rgba(255, 202, 122, 0.8)";
          g.lineWidth = 3;
          g.setLineDash([6, 4]);
          g.strokeRect(hx * CELL + 5, hy * CELL + 5, CELL - 10, CELL - 10);
          g.setLineDash([]);
        }
      }
      tray.innerHTML = "";
      for (const it of level.items) {
        if (puzzle.placement[it.id]) continue;
        const b = document.createElement("button");
        b.className = "small" + (selectedItem === it.id ? " primary" : "");
        b.innerHTML = `${it.icon} ${it.name}`;
        b.title = it.tags.join(", ");
        b.addEventListener("click", () => {
          selectedItem = selectedItem === it.id ? null : it.id;
          ctx2.sfx?.("tap");
          draw();
        });
        tray.appendChild(b);
      }
      if (tray.children.length === 0) {
        tray.innerHTML = '<span class="muted">\u0412\u0441\u0435 \u0442\u043E\u0432\u0430\u0440\u044B \u043D\u0430 \u043F\u043E\u043B\u043A\u0430\u0445</span>';
      }
      const placedCount = level.items.filter((i) => puzzle.placement[i.id]).length;
      statusEl.innerHTML = `\u{1F4E6} \u0422\u043E\u0432\u0430\u0440\u044B: <b>${placedCount}/${level.items.length}</b> &nbsp; ` + (v.length > 0 ? `<span class="warn">${v[0].text}${v.length > 1 ? ` (+${v.length - 1})` : ""}</span>` : placedCount === level.items.length ? "\u2705 \u0412\u0441\u0451 \u043F\u043E \u043C\u0435\u0441\u0442\u0430\u043C!" : "\u2705 \u041F\u043E\u0440\u044F\u0434\u043E\u043A") + `<div class="muted" style="font-size:13px">\u0425\u043E\u0434\u044B: ${puzzle.moves} \xB7 \u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0438: ${hintsUsed}</div>`;
    }
    draw();
    return () => {
      window.removeEventListener("keydown", onKey);
      canvas.removeEventListener("pointerdown", onTap);
    };
  }
  function rulesText(level) {
    const lines = [];
    for (const [a, b] of level.rules.notAdjacent || []) {
      lines.push(`\u{1F6AB} ${TAG_LABEL[a] || a} \u2014 \u043D\u0435 \u0440\u044F\u0434\u043E\u043C \u0441 \xAB${TAG_LABEL[b] || b}\xBB`);
    }
    for (const [a, b] of level.rules.mustAdjacent || []) {
      lines.push(`\u{1F91D} ${TAG_LABEL[a] || a} \u2014 \u0440\u044F\u0434\u043E\u043C \u0441 \xAB${TAG_LABEL[b] || b}\xBB`);
    }
    for (const t of level.rules.onLight || []) {
      lines.push(`\u2600\uFE0F ${TAG_LABEL[t] || t} \u2014 \u043D\u0430 \u0441\u0432\u0435\u0442\u0443`);
    }
    return lines.join("<br>");
  }

  // src/core/bookPuzzle.js
  function pathCells(level) {
    const [w, h] = level.grid;
    const blots = new Set((level.blots || []).map((b) => b.join(",")));
    const path = [];
    for (let y = 0; y < h; y++) {
      const xs = [];
      for (let x = 0; x < w; x++) if (!blots.has(`${x},${y}`)) xs.push(x);
      if (y % 2 === 1) xs.reverse();
      for (const x of xs) path.push([x, y]);
    }
    return path;
  }
  function createBookPuzzle(level) {
    return {
      level,
      letters: level.scrambled.split(""),
      history: [],
      moves: 0
    };
  }
  function swapLetters(state2, i, j) {
    const n = state2.letters.length;
    if (i === j || i < 0 || j < 0 || i >= n || j >= n) return false;
    if (state2.letters[i] === "\u2726" || state2.letters[j] === "\u2726") return false;
    state2.history.push({ i, j });
    [state2.letters[i], state2.letters[j]] = [state2.letters[j], state2.letters[i]];
    state2.moves += 1;
    return true;
  }
  function undoBook(state2) {
    const last = state2.history.pop();
    if (!last) return false;
    [state2.letters[last.i], state2.letters[last.j]] = [state2.letters[last.j], state2.letters[last.i]];
    state2.moves += 1;
    return true;
  }
  function resetBook(state2) {
    state2.letters = state2.level.scrambled.split("");
    state2.history = [];
    state2.moves += 1;
  }
  function isBookSolved(state2) {
    return state2.letters.join("") === state2.level.phrase;
  }
  function bookProgress(state2) {
    const target = state2.level.phrase;
    let ok = 0;
    for (let i = 0; i < target.length; i++) if (state2.letters[i] === target[i]) ok++;
    return { ok, total: target.length };
  }
  function bookHint(state2) {
    const target = state2.level.phrase;
    for (let i = 0; i < target.length; i++) {
      if (state2.letters[i] === target[i]) continue;
      let j = state2.letters.findIndex((c, k) => k > i && c === target[i] && state2.letters[k] !== target[k]);
      if (j < 0) j = state2.letters.indexOf(target[i], i + 1);
      return { type: "swap", i, j };
    }
    return { type: "already" };
  }

  // src/ui/bookView.js
  var CELL2 = 60;
  function renderBookPuzzle(container, ctx2, level) {
    const puzzle = createBookPuzzle(level);
    const path = pathCells(level);
    let selected = null;
    let hintsUsed = 0;
    let hintPair = null;
    let finished = false;
    container.appendChild(header(ctx2, level.name, `\u0421\u043B\u043E\u0436\u043D\u043E\u0441\u0442\u044C: ${"\u2605".repeat(level.difficulty)}`, "puzzles"));
    const wrap = document.createElement("div");
    wrap.className = "puzzle-wrap";
    const canvasBox = document.createElement("div");
    canvasBox.className = "puzzle-canvas-box";
    const canvas = document.createElement("canvas");
    canvas.className = "game";
    const [gw, gh] = level.grid;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = gw * CELL2 * dpr;
    canvas.height = gh * CELL2 * dpr;
    canvas.style.width = `${gw * CELL2}px`;
    canvas.style.height = `${gh * CELL2}px`;
    canvas.style.maxWidth = "100%";
    canvasBox.appendChild(canvas);
    wrap.appendChild(canvasBox);
    const side = document.createElement("div");
    side.className = "puzzle-side";
    const intro = document.createElement("div");
    intro.className = "intro-text";
    intro.textContent = level.intro;
    side.appendChild(intro);
    const statusEl = document.createElement("div");
    statusEl.className = "puzzle-status";
    side.appendChild(statusEl);
    const hintText = document.createElement("div");
    hintText.className = "panel";
    hintText.style.padding = "10px 14px";
    hintText.innerHTML = `<div class="desc" style="line-height:1.8">
    \u0422\u0430\u043F\u043D\u0438 \u0431\u0443\u043A\u0432\u0443, \u0437\u0430\u0442\u0435\u043C \u0434\u0440\u0443\u0433\u0443\u044E \u2014 \u043E\u043D\u0438 \u043F\u043E\u043C\u0435\u043D\u044F\u044E\u0442\u0441\u044F \u043C\u0435\u0441\u0442\u0430\u043C\u0438.<br>
    \u2726 \u2014 \u043D\u0435\u043F\u043E\u0434\u0432\u0438\u0436\u043D\u044B\u0439 \u0440\u0430\u0437\u0434\u0435\u043B\u0438\u0442\u0435\u043B\u044C.<br>
    \u0421\u043E\u0431\u0435\u0440\u0438 \u0444\u0440\u0430\u0437\u0443, \u0447\u0438\u0442\u0430\u0435\u043C\u0443\u044E \u0437\u043C\u0435\u0439\u043A\u043E\u0439 \u0441\u0432\u0435\u0440\u0445\u0443 \u0432\u043D\u0438\u0437.</div>`;
    side.appendChild(hintText);
    const controls = document.createElement("div");
    controls.className = "puzzle-controls";
    controls.style.marginTop = "10px";
    const btnUndo = mkBtn("\u21A9\uFE0F \u041E\u0442\u043C\u0435\u043D\u0430 (Z)", doUndo);
    const btnHint = mkBtn("\u{1F4A1} \u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430 (H)", doHint);
    const btnReset = mkBtn("\u{1F504} \u0421\u0431\u0440\u043E\u0441 (R)", doReset);
    controls.append(btnUndo, btnHint, btnReset);
    side.appendChild(controls);
    wrap.appendChild(side);
    container.appendChild(wrap);
    function mkBtn(label, fn) {
      const b = document.createElement("button");
      b.innerHTML = label;
      b.addEventListener("click", fn);
      return b;
    }
    function doUndo() {
      if (finished) return;
      if (undoBook(puzzle)) {
        selected = null;
        hintPair = null;
        ctx2.sfx?.("tap");
        draw();
      }
    }
    function doReset() {
      if (finished) return;
      resetBook(puzzle);
      selected = null;
      hintPair = null;
      ctx2.sfx?.("tap");
      draw();
    }
    function doHint() {
      if (finished) return;
      const h = bookHint(puzzle);
      ctx2.sfx?.("hint");
      if (h.type === "swap") {
        hintsUsed += 1;
        hintPair = { i: h.i, j: h.j };
        ctx2.toast(`\u041A\u043E\u0442-\u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u0432\u043E\u0434\u0438\u0442 \u043B\u0430\u043F\u043E\u0439: \xAB${puzzle.letters[h.i]}\xBB \u21C4 \xAB${puzzle.letters[h.j]}\xBB`);
        draw();
      } else {
        ctx2.toast("\u0424\u0440\u0430\u0437\u0430 \u0443\u0436\u0435 \u0446\u0435\u043B\u0430!");
      }
    }
    function onTap(ev) {
      if (finished) return;
      const rect = canvas.getBoundingClientRect();
      const scale = canvas.width / dpr / rect.width;
      const x = Math.floor((ev.clientX - rect.left) * scale / CELL2);
      const y = Math.floor((ev.clientY - rect.top) * scale / CELL2);
      const idx = path.findIndex(([px, py]) => px === x && py === y);
      if (idx < 0) return;
      if (puzzle.letters[idx] === "\u2726") {
        ctx2.toast("\u0420\u0430\u0437\u0434\u0435\u043B\u0438\u0442\u0435\u043B\u044C \u043D\u0435 \u0434\u0432\u0438\u0433\u0430\u0435\u0442\u0441\u044F.");
        return;
      }
      if (selected === null) {
        selected = idx;
        ctx2.sfx?.("tap");
      } else if (selected === idx) {
        selected = null;
        ctx2.sfx?.("tap");
      } else {
        if (swapLetters(puzzle, selected, idx)) {
          selected = null;
          hintPair = null;
          ctx2.sfx?.("rotate");
          draw();
          if (isBookSolved(puzzle)) finish();
          return;
        }
        selected = idx;
      }
      draw();
    }
    canvas.addEventListener("pointerdown", onTap);
    function onKey(ev) {
      if (ev.key === "z" || ev.key === "Z" || ev.ctrlKey && ev.key === "z") {
        ev.preventDefault();
        doUndo();
      }
      if (ev.key === "h" || ev.key === "H" || ev.key === "\u0440" || ev.key === "\u0420") doHint();
      if (ev.key === "r" || ev.key === "R" || ev.key === "\u043A" || ev.key === "\u041A") doReset();
      if (ev.key === "Escape") ctx2.go("puzzles");
    }
    window.addEventListener("keydown", onKey);
    function finish() {
      finished = true;
      const rewards = completePuzzle(ctx2.state, level.id, { moves: puzzle.moves, hintsUsed });
      ctx2.save();
      ctx2.sfx?.("success");
      draw();
      setTimeout(() => {
        const next = nextPuzzle(level.id);
        showOverlay(ctx2, {
          title: "\u{1F4D6} \u0424\u0440\u0430\u0437\u0430 \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0430!",
          subtitle: `\xAB${level.name}\xBB \u2014 ${level.phrase.replaceAll("\u2726", " \xB7 ")}`,
          rewards,
          buttons: [
            ...next ? [{ label: `\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0430\u044F \u2192 ${next.name}`, primary: true, onClick: () => ctx2.go("puzzle", { id: next.id }) }] : [],
            { label: "\u041A \u0437\u0430\u0433\u0430\u0434\u043A\u0430\u043C", primary: !next, onClick: () => ctx2.go("puzzles") },
            { label: "\u0415\u0449\u0451 \u0440\u0430\u0437", onClick: () => ctx2.go("puzzle", { id: level.id }) },
            { label: "\u0412 \u043B\u0430\u0432\u043A\u0443", onClick: () => ctx2.go("hub") }
          ]
        });
      }, 450);
    }
    function draw() {
      const g = canvas.getContext("2d");
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, gw * CELL2, gh * CELL2);
      g.fillStyle = "#4d4231";
      g.fillRect(0, 0, gw * CELL2, gh * CELL2);
      const correct = /* @__PURE__ */ new Set();
      for (let i = 0; i < level.phrase.length; i++) {
        if (puzzle.letters[i] === level.phrase[i]) correct.add(i);
      }
      for (const [bx, by] of level.blots || []) {
        g.font = `${CELL2 * 0.6}px "Segoe UI Emoji", sans-serif`;
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillText("\u{1FADF}", bx * CELL2 + CELL2 / 2, by * CELL2 + CELL2 / 2);
      }
      path.forEach(([x, y], i) => {
        const px = x * CELL2;
        const py = y * CELL2;
        const letter = puzzle.letters[i];
        const isFixed = letter === "\u2726";
        g.fillStyle = isFixed ? "#3a3226" : correct.has(i) ? "#5d6b3f" : "#6b5a3d";
        g.fillRect(px + 3, py + 3, CELL2 - 6, CELL2 - 6);
        if (selected === i || hintPair && (hintPair.i === i || hintPair.j === i)) {
          g.strokeStyle = "#ffca7a";
          g.lineWidth = 3;
          g.strokeRect(px + 3, py + 3, CELL2 - 6, CELL2 - 6);
        }
        g.font = `${isFixed ? CELL2 * 0.4 : CELL2 * 0.55}px "Segoe UI Emoji", serif`;
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillStyle = isFixed ? "#ffca7a" : "#f3e6cf";
        g.fillText(letter, px + CELL2 / 2, py + CELL2 / 2 + 2);
      });
      const pr = bookProgress(puzzle);
      statusEl.innerHTML = `\u{1F4DC} \u0411\u0443\u043A\u0432\u044B \u043D\u0430 \u043C\u0435\u0441\u0442\u0430\u0445: <b>${pr.ok}/${pr.total}</b><div class="muted" style="font-size:13px">\u0425\u043E\u0434\u044B: ${puzzle.moves} \xB7 \u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0438: ${hintsUsed}</div>`;
    }
    draw();
    return () => {
      window.removeEventListener("keydown", onKey);
      canvas.removeEventListener("pointerdown", onTap);
    };
  }

  // src/core/seekPuzzle.js
  function createSeekPuzzle(level) {
    return {
      level,
      found: /* @__PURE__ */ new Set(),
      misses: 0,
      moves: 0
    };
  }
  function seekTargets(level) {
    return level.scene.filter((o) => o.target);
  }
  function seekTap(state2, x, y) {
    const { level } = state2;
    state2.moves += 1;
    for (let i = level.scene.length - 1; i >= 0; i--) {
      const o = level.scene[i];
      const dx = x - o.x;
      const dy = y - o.y;
      const rr = o.r * (o.scale || 1);
      if (dx * dx + dy * dy > rr * rr) continue;
      if (!o.target) {
        state2.misses += 1;
        return { result: "decoy", object: o };
      }
      if (state2.found.has(o.id)) return { result: "already", object: o };
      state2.found.add(o.id);
      return { result: "found", object: o };
    }
    return { result: "empty" };
  }
  function isSeekSolved(state2) {
    return seekTargets(state2.level).every((o) => state2.found.has(o.id));
  }
  function seekProgress(state2) {
    return { found: state2.found.size, total: seekTargets(state2.level).length };
  }
  function seekHint(state2) {
    const rest = seekTargets(state2.level).filter((o) => !state2.found.has(o.id));
    if (rest.length === 0) return { type: "already" };
    return { type: "point", x: rest[0].x, y: rest[0].y, label: rest[0].label, id: rest[0].id };
  }

  // src/ui/seekView.js
  function renderSeekPuzzle(container, ctx2, level) {
    const puzzle = createSeekPuzzle(level);
    let hintsUsed = 0;
    let hintSpot = null;
    let finished = false;
    let missFlash = null;
    const [W, H] = level.sceneSize || [1e3, 650];
    container.appendChild(header(ctx2, level.name, `\u0421\u043B\u043E\u0436\u043D\u043E\u0441\u0442\u044C: ${"\u2605".repeat(level.difficulty)}`, "puzzles"));
    const wrap = document.createElement("div");
    wrap.className = "puzzle-wrap";
    const canvasBox = document.createElement("div");
    canvasBox.className = "puzzle-canvas-box";
    const canvas = document.createElement("canvas");
    canvas.className = "game";
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = "min(100%, 880px)";
    canvas.style.height = "auto";
    canvasBox.appendChild(canvas);
    wrap.appendChild(canvasBox);
    const side = document.createElement("div");
    side.className = "puzzle-side";
    const intro = document.createElement("div");
    intro.className = "intro-text";
    intro.textContent = level.intro;
    side.appendChild(intro);
    const listPanel = document.createElement("div");
    listPanel.className = "panel";
    listPanel.style.padding = "10px 14px";
    const listTitle = document.createElement("div");
    listTitle.className = "muted";
    listTitle.style.cssText = "font-size:13px;margin-bottom:6px";
    listTitle.textContent = "\u041D\u0430\u0439\u0434\u0438 \u0432 \u043A\u043E\u043C\u043D\u0430\u0442\u0435 \u0442\u043E\u0440\u0433\u043E\u0432\u0446\u0430:";
    listPanel.appendChild(listTitle);
    const targetList = document.createElement("div");
    targetList.style.cssText = "display:flex;flex-direction:column;gap:4px";
    listPanel.appendChild(targetList);
    side.appendChild(listPanel);
    const statusEl = document.createElement("div");
    statusEl.className = "puzzle-status";
    side.appendChild(statusEl);
    const controls = document.createElement("div");
    controls.className = "puzzle-controls";
    controls.style.marginTop = "10px";
    const btnHint = mkBtn("\u{1F4A1} \u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430 (H)", doHint);
    const btnReset = mkBtn("\u{1F504} \u0417\u0430\u043D\u043E\u0432\u043E (R)", doReset);
    controls.append(btnHint, btnReset);
    side.appendChild(controls);
    wrap.appendChild(side);
    container.appendChild(wrap);
    function mkBtn(label, fn) {
      const b = document.createElement("button");
      b.innerHTML = label;
      b.addEventListener("click", fn);
      return b;
    }
    let bgImage = null;
    if (typeof Image !== "undefined") {
      const bgName = level.bg || `seek_${level.world}`;
      const candidates = [
        `assets/${bgName}_web.jpg`,
        `assets/${bgName}.jfif`,
        `assets/${bgName}.png`,
        `assets/${bgName}.svg`
      ];
      let idx = 0;
      const tryNext = () => {
        if (idx >= candidates.length) return;
        const img = new Image();
        img.onload = () => {
          bgImage = img;
          draw();
        };
        img.onerror = () => {
          idx += 1;
          tryNext();
        };
        img.src = candidates[idx];
      };
      tryNext();
    }
    function doHint() {
      if (finished) return;
      const h = seekHint(puzzle);
      if (h.type === "point") {
        hintsUsed += 1;
        hintSpot = { x: h.x, y: h.y };
        ctx2.toast(`\u0421\u0432\u0435\u0442\u043B\u044F\u0447\u043E\u043A \u043A\u0440\u0443\u0436\u0438\u0442 \u0440\u044F\u0434\u043E\u043C: \xAB${h.label}\xBB \u0433\u0434\u0435-\u0442\u043E \u0437\u0434\u0435\u0441\u044C\u2026`);
        ctx2.sfx?.("hint");
        draw();
      } else {
        ctx2.toast("\u0412\u0441\u0451 \u0443\u0436\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E!");
      }
    }
    function doReset() {
      if (finished) return;
      puzzle.found = /* @__PURE__ */ new Set();
      puzzle.misses = 0;
      puzzle.moves += 1;
      hintSpot = null;
      ctx2.sfx?.("tap");
      draw();
    }
    function onTap(ev) {
      if (finished) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / dpr / rect.width;
      const scaleY = canvas.height / dpr / rect.height;
      const x = (ev.clientX - rect.left) * scaleX;
      const y = (ev.clientY - rect.top) * scaleY;
      const r = seekTap(puzzle, x, y);
      if (r.result === "found") {
        hintSpot = null;
        ctx2.sfx?.("coin");
        ctx2.toast(`\u041D\u0430\u0439\u0434\u0435\u043D\u043E: ${r.object.label}!`);
        draw();
        if (isSeekSolved(puzzle)) finish();
      } else if (r.result === "decoy" || r.result === "empty") {
        missFlash = { x, y, until: Date.now() + 350 };
        ctx2.sfx?.("tap");
        draw();
        setTimeout(() => {
          missFlash = null;
          draw();
        }, 380);
      }
    }
    canvas.addEventListener("pointerdown", onTap);
    function onKey(ev) {
      if (ev.key === "h" || ev.key === "H" || ev.key === "\u0440" || ev.key === "\u0420") doHint();
      if (ev.key === "r" || ev.key === "R" || ev.key === "\u043A" || ev.key === "\u041A") doReset();
      if (ev.key === "Escape") ctx2.go("puzzles");
    }
    window.addEventListener("keydown", onKey);
    function finish() {
      finished = true;
      const rewards = completePuzzle(ctx2.state, level.id, { moves: puzzle.moves, hintsUsed });
      ctx2.save();
      ctx2.sfx?.("success");
      draw();
      setTimeout(() => {
        const next = nextPuzzle(level.id);
        showOverlay(ctx2, {
          title: "\u{1F9FA} \u0412\u0441\u0451 \u043D\u0430\u0439\u0434\u0435\u043D\u043E!",
          subtitle: `\xAB${level.name}\xBB \u2014 \u043F\u0440\u043E\u043C\u0430\u0445\u043E\u0432: ${puzzle.misses}`,
          rewards,
          buttons: [
            ...next ? [{ label: `\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0430\u044F \u2192 ${next.name}`, primary: true, onClick: () => ctx2.go("puzzle", { id: next.id }) }] : [],
            { label: "\u041A \u0437\u0430\u0433\u0430\u0434\u043A\u0430\u043C", primary: !next, onClick: () => ctx2.go("puzzles") },
            { label: "\u0415\u0449\u0451 \u0440\u0430\u0437", onClick: () => ctx2.go("puzzle", { id: level.id }) },
            { label: "\u0412 \u043B\u0430\u0432\u043A\u0443", onClick: () => ctx2.go("hub") }
          ]
        });
      }, 450);
    }
    function drawObject(g, o, fade) {
      g.save();
      g.translate(o.x, o.y);
      g.rotate(o.rot || 0);
      const size = 46 * (o.scale || 1);
      g.shadowColor = "rgba(0, 0, 0, 0.55)";
      g.shadowBlur = 7;
      g.shadowOffsetY = 3;
      g.globalAlpha = fade ? 0.4 : o.alpha ?? 1;
      g.font = `${size}px "Segoe UI Emoji", sans-serif`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText(o.icon, 0, 0);
      g.restore();
    }
    function draw() {
      const g = canvas.getContext("2d");
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      if (bgImage) {
        g.drawImage(bgImage, 0, 0, W, H);
      } else {
        const grad = g.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, "#54452f");
        grad.addColorStop(1, "#3a2f20");
        g.fillStyle = grad;
        g.fillRect(0, 0, W, H);
      }
      const vig = g.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, W * 0.75);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(10,6,3,0.35)");
      g.fillStyle = vig;
      g.fillRect(0, 0, W, H);
      for (const o of level.scene) {
        const isFound = o.target && puzzle.found.has(o.id);
        drawObject(g, o, isFound);
        if (isFound) {
          g.strokeStyle = "rgba(143, 209, 139, 0.85)";
          g.lineWidth = 3;
          g.beginPath();
          g.arc(o.x, o.y, 30, 0, Math.PI * 2);
          g.stroke();
          g.fillStyle = "#8fd18b";
          g.font = "bold 20px sans-serif";
          g.textAlign = "center";
          g.textBaseline = "middle";
          g.fillText("\u2713", o.x + 24, o.y - 22);
        }
        if (hintSpot && Math.hypot(o.x - hintSpot.x, o.y - hintSpot.y) < 1) {
          g.strokeStyle = "rgba(255, 226, 138, 0.95)";
          g.lineWidth = 4;
          g.setLineDash([8, 6]);
          g.beginPath();
          g.arc(o.x, o.y, 42, 0, Math.PI * 2);
          g.stroke();
          g.setLineDash([]);
        }
      }
      for (const f of level.front || []) {
        g.save();
        g.translate(f.x, f.y);
        g.rotate(f.rot || 0);
        g.globalAlpha = f.alpha ?? 0.85;
        g.shadowColor = "rgba(0,0,0,0.4)";
        g.shadowBlur = 5;
        g.font = `${52 * (f.scale || 1)}px "Segoe UI Emoji", sans-serif`;
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillText(f.icon, 0, 0);
        g.restore();
      }
      if (missFlash) {
        g.fillStyle = "rgba(232, 138, 122, 0.35)";
        g.beginPath();
        g.arc(missFlash.x, missFlash.y, 26, 0, Math.PI * 2);
        g.fill();
      }
      targetList.innerHTML = "";
      for (const t of seekTargets(level)) {
        const done = puzzle.found.has(t.id);
        const row = document.createElement("div");
        row.innerHTML = `${done ? "\u2705" : "\u{1F50D}"} ${t.label}`;
        row.style.cssText = `font-size:15px;${done ? "opacity:0.6;text-decoration:line-through" : ""}`;
        targetList.appendChild(row);
      }
      const pr = seekProgress(puzzle);
      statusEl.innerHTML = `\u{1F50D} \u041D\u0430\u0439\u0434\u0435\u043D\u043E: <b>${pr.found}/${pr.total}</b> &nbsp; <span class="muted">\u043F\u0440\u043E\u043C\u0430\u0445\u0438: ${puzzle.misses}</span><div class="muted" style="font-size:13px">\u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0438: ${hintsUsed}</div>`;
    }
    draw();
    return () => {
      window.removeEventListener("keydown", onKey);
      canvas.removeEventListener("pointerdown", onTap);
    };
  }

  // src/ui/puzzleView.js
  var WORLD_LABEL = {
    meadow: "\u{1F33F} \u0422\u0438\u0445\u0430\u044F \u043E\u043F\u0443\u0448\u043A\u0430 \u2014 \u0441\u0432\u0435\u0442 \u0438 \u0444\u043E\u043D\u0430\u0440\u0438\u043A\u0438 \xB7 \u043F\u043E\u0438\u0441\u043A \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u043E\u0432",
    town: "\u{1F3F0} \u0421\u0440\u0435\u0434\u043D\u0435\u0432\u0435\u043A\u043E\u0432\u044B\u0439 \u0434\u0432\u043E\u0440\u0438\u043A \u2014 \u043F\u043E\u043B\u043A\u0438 \u0438 \u0442\u043E\u0432\u0430\u0440\u044B \xB7 \u043F\u043E\u0438\u0441\u043A \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u043E\u0432",
    attic: "\u{1F4D6} \u041A\u043D\u0438\u0436\u043D\u044B\u0439 \u0447\u0435\u0440\u0434\u0430\u043A \u2014 \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u0444\u0440\u0430\u0437 \xB7 \u043F\u043E\u0438\u0441\u043A \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u043E\u0432"
  };
  function renderPuzzleList(container, ctx2) {
    const { state: state2 } = ctx2;
    container.appendChild(header2(ctx2, "\u0413\u043E\u043B\u043E\u0432\u043E\u043B\u043E\u043C\u043A\u0438 \u043B\u0430\u0432\u043A\u0438", "\u0425\u043E\u0437\u044F\u0439\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0435 \u0437\u0430\u0433\u0430\u0434\u043A\u0438 \u043F\u043E \u043C\u0438\u0440\u0430\u043C"));
    let lastWorld = null;
    const firstUnsolved = firstUnsolvedPuzzle(state2);
    const list = document.createElement("div");
    list.className = "list";
    ALL_PUZZLES.forEach((p, i) => {
      if (p.world !== lastWorld) {
        lastWorld = p.world;
        const wh = document.createElement("h3");
        wh.textContent = WORLD_LABEL[p.world] || p.world;
        list.appendChild(wh);
      }
      const available = puzzleAvailable(state2, i);
      const done = !!state2.puzzlesDone[p.id];
      const row = document.createElement("div");
      row.className = "row" + (available ? "" : " locked") + (done ? " done" : "");
      if (firstUnsolved && p.id === firstUnsolved.id) row.dataset.scrollTarget = "1";
      const stars = "\u2605".repeat(p.difficulty) + "\u2606".repeat(5 - p.difficulty);
      row.innerHTML = `
      <span class="icon">${available ? done ? "\u{1F3EE}" : "\u{1F9E9}" : "\u{1F512}"}</span>
      <span class="grow">
        <div class="name">${i + 1}. ${p.name} <span class="badge">${stars}</span></div>
        <div class="desc">${available ? p.intro : "\u0420\u0435\u0448\u0438 \u043F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0443\u044E \u0437\u0430\u0433\u0430\u0434\u043A\u0443, \u0447\u0442\u043E\u0431\u044B \u043E\u0442\u043A\u0440\u044B\u0442\u044C."}</div>
      </span>`;
      if (available) {
        const btn = document.createElement("button");
        btn.textContent = done ? "\u0415\u0449\u0451 \u0440\u0430\u0437" : "\u0420\u0435\u0448\u0430\u0442\u044C";
        btn.addEventListener("click", () => ctx2.go("puzzle", { id: p.id }));
        row.appendChild(btn);
      }
      list.appendChild(row);
    });
    container.appendChild(list);
    container.appendChild(quickNav(ctx2, [
      { icon: "\u{1F3E0}", label: "\u0412 \u043B\u0430\u0432\u043A\u0443", screen: "hub" }
    ]));
    const targetRow = list.querySelector?.('[data-scroll-target="1"]');
    if (targetRow && targetRow.scrollIntoView) {
      setTimeout(() => targetRow.scrollIntoView({ block: "center", behavior: "smooth" }), 60);
    }
  }
  var CELL3 = 64;
  function renderPuzzle(container, ctx2, params) {
    const level = findPuzzle(ctx2.state, params.id);
    if (!level) {
      ctx2.go("puzzles");
      return;
    }
    if (level.mechanic === "shelf") {
      return renderShelfPuzzle(container, ctx2, level);
    }
    if (level.mechanic === "book") {
      return renderBookPuzzle(container, ctx2, level);
    }
    if (level.mechanic === "seek") {
      return renderSeekPuzzle(container, ctx2, level);
    }
    const puzzle = createPuzzle(level);
    let hintsUsed = 0;
    let hintCell = null;
    let finished = false;
    container.appendChild(header2(ctx2, level.name, `\u0421\u043B\u043E\u0436\u043D\u043E\u0441\u0442\u044C: ${"\u2605".repeat(level.difficulty)}`, "puzzles"));
    const wrap = document.createElement("div");
    wrap.className = "puzzle-wrap";
    const canvasBox = document.createElement("div");
    canvasBox.className = "puzzle-canvas-box";
    const canvas = document.createElement("canvas");
    canvas.className = "game";
    const [gw, gh] = level.grid;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = gw * CELL3 * dpr;
    canvas.height = gh * CELL3 * dpr;
    canvas.style.width = `${gw * CELL3}px`;
    canvas.style.height = `${gh * CELL3}px`;
    canvas.style.maxWidth = "100%";
    canvasBox.appendChild(canvas);
    wrap.appendChild(canvasBox);
    const side = document.createElement("div");
    side.className = "puzzle-side";
    const intro = document.createElement("div");
    intro.className = "intro-text";
    intro.textContent = level.intro;
    side.appendChild(intro);
    const statusEl = document.createElement("div");
    statusEl.className = "puzzle-status";
    side.appendChild(statusEl);
    const controls = document.createElement("div");
    controls.className = "puzzle-controls";
    const btnUndo = mkBtn("\u21A9\uFE0F \u041E\u0442\u043C\u0435\u043D\u0430 (Z)", doUndo);
    const btnHint = mkBtn("\u{1F4A1} \u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430 (H)", doHint);
    const btnReset = mkBtn("\u{1F504} \u0421\u0431\u0440\u043E\u0441 (R)", doReset);
    controls.append(btnUndo, btnHint, btnReset);
    side.appendChild(controls);
    const legend = document.createElement("div");
    legend.className = "panel mt";
    legend.innerHTML = `<div class="desc" style="line-height:1.9">
    \u2728 \u0441\u0432\u0435\u0442\u043B\u044F\u0447\u043E\u043A \u2014 \u0438\u0441\u0442\u043E\u0447\u043D\u0438\u043A \u0441\u0432\u0435\u0442\u0430<br>
    \u{1FA9E} \u0437\u0435\u0440\u043A\u0430\u043B\u043E \u2014 \u0442\u0430\u043F\u043D\u0438, \u0447\u0442\u043E\u0431\u044B \u043F\u043E\u0432\u0435\u0440\u043D\u0443\u0442\u044C<br>
    \u{1F3EE} \u0444\u043E\u043D\u0430\u0440\u044C \u2014 \u0437\u0430\u0436\u0433\u0438 \u0432\u0441\u0435<br>
    \u{1F98B} \u043C\u043E\u043B\u044C \u2014 \u043D\u0435 \u0431\u0443\u0434\u0438 \u0435\u0451 \u0441\u0432\u0435\u0442\u043E\u043C!<br>
    \u{1F311} \u0442\u0435\u043D\u044C \u2014 \u043F\u0440\u043E\u0441\u0442\u043E \u0431\u043B\u043E\u043A\u0438\u0440\u0443\u0435\u0442 \u0441\u0432\u0435\u0442</div>`;
    side.appendChild(legend);
    wrap.appendChild(side);
    container.appendChild(wrap);
    function mkBtn(label, fn) {
      const b = document.createElement("button");
      b.innerHTML = label;
      b.addEventListener("click", fn);
      return b;
    }
    function doUndo() {
      if (finished) return;
      if (undo(puzzle)) {
        hintCell = null;
        draw();
      }
    }
    function doReset() {
      if (finished) return;
      reset(puzzle);
      hintCell = null;
      draw();
    }
    function doHint() {
      if (finished) return;
      const h = hint(puzzle);
      if (h.type === "rotate") {
        hintsUsed += 1;
        hintCell = level.objects[h.objectIndex].pos;
        ctx2.toast("\u041A\u043E\u0442-\u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u0441\u043C\u043E\u0442\u0440\u0438\u0442 \u043D\u0430 \u043E\u0434\u043D\u043E \u0438\u0437 \u0437\u0435\u0440\u043A\u0430\u043B\u2026");
        draw();
      } else if (h.type === "already") {
        ctx2.toast("\u0412\u0441\u0451 \u0443\u0436\u0435 \u0432\u0435\u0440\u043D\u043E \u2014 \u0444\u043E\u043D\u0430\u0440\u0438 \u0432\u043E\u0442-\u0432\u043E\u0442 \u0437\u0430\u0436\u0433\u0443\u0442\u0441\u044F!");
      } else {
        ctx2.toast("\u0425\u043C, \u044D\u0442\u043E\u0442 \u0443\u0440\u043E\u0432\u0435\u043D\u044C \u043D\u0435 \u0440\u0435\u0448\u0430\u0435\u0442\u0441\u044F. \u0421\u043E\u043E\u0431\u0449\u0438 \u0445\u043E\u0437\u044F\u0438\u043D\u0443 \u043B\u0430\u0432\u043A\u0438!");
      }
    }
    function onTap(ev) {
      if (finished) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / dpr / rect.width;
      const cx = (ev.clientX - rect.left) * scaleX;
      const cy = (ev.clientY - rect.top) * scaleX;
      const x = Math.floor(cx / CELL3);
      const y = Math.floor(cy / CELL3);
      const idx = level.objects.findIndex((o) => o.pos[0] === x && o.pos[1] === y);
      if (idx >= 0 && level.objects[idx].type === "mirror") {
        rotateMirror(puzzle, idx);
        hintCell = null;
        ctx2.sfx?.("rotate");
        draw();
        if (isSolved(puzzle)) finish();
      }
    }
    canvas.addEventListener("pointerdown", onTap);
    function onKey(ev) {
      if (ev.key === "z" || ev.key === "Z" || ev.ctrlKey && ev.key === "z") {
        ev.preventDefault();
        doUndo();
      }
      if (ev.key === "h" || ev.key === "H" || ev.key === "\u0440" || ev.key === "\u0420") doHint();
      if (ev.key === "r" || ev.key === "R" || ev.key === "\u043A" || ev.key === "\u041A") doReset();
      if (ev.key === "Escape") ctx2.go("puzzles");
    }
    window.addEventListener("keydown", onKey);
    function finish() {
      finished = true;
      const rewards = completePuzzle(ctx2.state, level.id, { moves: puzzle.moves, hintsUsed });
      ctx2.save();
      ctx2.sfx?.("success");
      draw();
      setTimeout(() => showVictory(ctx2, level, rewards), 450);
    }
    function draw() {
      const g = canvas.getContext("2d");
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, gw * CELL3, gh * CELL3);
      const { lanternsLit, mothsAwake, beams } = traceLight(puzzle);
      for (let y = 0; y < gh; y++) {
        for (let x = 0; x < gw; x++) {
          g.fillStyle = (x + y) % 2 === 0 ? "#3a5232" : "#425c38";
          g.fillRect(x * CELL3, y * CELL3, CELL3, CELL3);
        }
      }
      g.save();
      g.lineCap = "round";
      for (const pass of [{ w: 12, a: 0.18 }, { w: 5, a: 0.85 }]) {
        g.strokeStyle = `rgba(255, 226, 138, ${pass.a})`;
        g.lineWidth = pass.w;
        for (const b of beams) {
          g.beginPath();
          g.moveTo(b.from[0] * CELL3 + CELL3 / 2, b.from[1] * CELL3 + CELL3 / 2);
          g.lineTo(b.to[0] * CELL3 + CELL3 / 2, b.to[1] * CELL3 + CELL3 / 2);
          g.stroke();
        }
      }
      g.restore();
      level.objects.forEach((o, i) => {
        const cx = o.pos[0] * CELL3 + CELL3 / 2;
        const cy = o.pos[1] * CELL3 + CELL3 / 2;
        const emoji = (e, size = CELL3 * 0.62) => {
          g.font = `${size}px "Segoe UI Emoji", sans-serif`;
          g.textAlign = "center";
          g.textBaseline = "middle";
          g.fillText(e, cx, cy);
        };
        switch (o.type) {
          case "source": {
            emoji("\u2728");
            const dirs = ["\u2191", "\u2192", "\u2193", "\u2190"];
            g.fillStyle = "rgba(255, 240, 190, 0.9)";
            g.font = `bold ${CELL3 * 0.3}px sans-serif`;
            g.fillText(dirs[o.dir], cx + CELL3 * 0.28, cy - CELL3 * 0.28);
            break;
          }
          case "mirror": {
            const orient = puzzle.orient[i];
            if (hintCell && hintCell[0] === o.pos[0] && hintCell[1] === o.pos[1]) {
              g.fillStyle = "rgba(255, 202, 122, 0.35)";
              g.beginPath();
              g.arc(cx, cy, CELL3 * 0.46, 0, Math.PI * 2);
              g.fill();
            }
            g.save();
            g.translate(cx, cy);
            g.rotate(orient === 0 ? Math.PI / 4 : -Math.PI / 4);
            g.fillStyle = "#8a6f4d";
            g.fillRect(-CELL3 * 0.3, -3, CELL3 * 0.6, 6);
            g.fillStyle = "#cfe8ff";
            g.fillRect(-CELL3 * 0.3, -5, CELL3 * 0.6, 4);
            g.restore();
            emoji("\u{1FA9E}", CELL3 * 0.3);
            break;
          }
          case "lantern": {
            if (lanternsLit.has(i)) {
              g.fillStyle = "rgba(255, 214, 120, 0.35)";
              g.beginPath();
              g.arc(cx, cy, CELL3 * 0.48, 0, Math.PI * 2);
              g.fill();
              emoji("\u{1F3EE}");
            } else {
              g.globalAlpha = 0.55;
              emoji("\u{1F3EE}");
              g.globalAlpha = 1;
            }
            break;
          }
          case "moth":
            emoji(mothsAwake.has(i) ? "\u{1F621}" : "\u{1F98B}");
            if (mothsAwake.has(i)) {
              g.fillStyle = "rgba(232, 138, 122, 0.25)";
              g.fillRect(o.pos[0] * CELL3, o.pos[1] * CELL3, CELL3, CELL3);
            }
            break;
          case "wall":
            emoji("\u{1F311}");
            break;
        }
      });
      const st = status(puzzle);
      statusEl.innerHTML = `\u{1F3EE} \u0424\u043E\u043D\u0430\u0440\u0438: <b>${st.lanternsLit}/${st.lanternsTotal}</b> &nbsp; ` + (st.mothsAwake > 0 ? `<span class="warn">\u{1F98B} \u041C\u043E\u043B\u044C \u043F\u0440\u043E\u0441\u043D\u0443\u043B\u0430\u0441\u044C! \u041E\u0442\u0432\u0435\u0434\u0438 \u0441\u0432\u0435\u0442.</span>` : `\u{1F98B} \u041C\u043E\u043B\u044C \u0441\u043F\u0438\u0442`) + `<div class="muted" style="font-size:13px">\u0425\u043E\u0434\u044B: ${puzzle.moves} \xB7 \u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0438: ${hintsUsed}</div>`;
    }
    draw();
    if (!finished && isSolved(puzzle)) {
      setTimeout(() => {
        if (!finished) finish();
      }, 1400);
    }
    if (level.id === "md_02") {
      startTutorial(ctx2, "first_puzzle", [
        {
          target: canvas,
          title: "\u0422\u0432\u043E\u044F \u043F\u0435\u0440\u0432\u0430\u044F \u0437\u0430\u0433\u0430\u0434\u043A\u0430",
          text: "\u0421\u0432\u0435\u0442\u043B\u044F\u0447\u043E\u043A \u0441\u0432\u0435\u0442\u0438\u0442 \u043F\u0440\u044F\u043C\u043E, \u043D\u043E \u0444\u043E\u043D\u0430\u0440\u044C \u043D\u0435 \u043D\u0430 \u043F\u0443\u0442\u0438 \u043B\u0443\u0447\u0430. \u041D\u0438\u0447\u0435\u0433\u043E \u0441\u0442\u0440\u0430\u0448\u043D\u043E\u0433\u043E \u2014 \u043D\u0430 \u043F\u043E\u043B\u0435 \u043B\u0435\u0436\u0438\u0442 \u0437\u0435\u0440\u043A\u0430\u043B\u043E!"
        },
        {
          target: canvas,
          title: "\u0422\u0430\u043F\u043D\u0438 \u0437\u0435\u0440\u043A\u0430\u043B\u043E",
          text: "\u041E\u0434\u0438\u043D \u0442\u0430\u043F \u2014 \u0438 \u0437\u0435\u0440\u043A\u0430\u043B\u043E \u043F\u043E\u0432\u043E\u0440\u0430\u0447\u0438\u0432\u0430\u0435\u0442\u0441\u044F. \u041D\u0430\u043F\u0440\u0430\u0432\u044C \u043B\u0443\u0447 \u043D\u0430 \u0444\u043E\u043D\u0430\u0440\u044C, \u0438 \u043B\u0430\u0432\u043A\u0430 \u0437\u0430\u0436\u0436\u0451\u0442\u0441\u044F. \u041C\u043E\u0436\u043D\u043E \u043F\u0440\u044F\u043C\u043E \u0441\u0435\u0439\u0447\u0430\u0441!",
          cta: "\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u044E!"
        },
        {
          target: side,
          title: "\u0412\u0441\u0435\u0433\u0434\u0430 \u043F\u043E\u0434 \u0440\u0443\u043A\u043E\u0439",
          text: "\u041E\u0442\u043C\u0435\u043D\u0430 (Z), \u043F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430 (H) \u0438 \u0441\u0431\u0440\u043E\u0441 (R) \u2014 \u043E\u0448\u0438\u0431\u0438\u0442\u044C\u0441\u044F \u043D\u0435 \u0441\u0442\u0440\u0430\u0448\u043D\u043E. \u041A\u043E\u0442-\u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u043F\u043E\u0434\u0441\u043A\u0430\u0436\u0435\u0442, \u0435\u0441\u043B\u0438 \u0437\u0430\u0441\u0442\u0440\u044F\u043D\u0435\u0448\u044C."
        }
      ]);
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      canvas.removeEventListener("pointerdown", onTap);
    };
  }
  function showVictory(ctx2, level, rewards) {
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    const rewardHtml = rewards.map((r) => {
      if (r.type === "coins") return `\u{1FA99} ${r.amount} \u043C\u043E\u043D\u0435\u0442`;
      if (r.type === "seals") return `\u{1F530} ${r.amount} \u043F\u0435\u0447\u0430\u0442\u044C \u043C\u0430\u0441\u0442\u0435\u0440\u0430`;
      if (r.type === "item") return `\u{1F381} ${ITEM_BY_ID[r.id]?.name || r.id}`;
      return "";
    }).filter(Boolean).join("<br>");
    overlay.innerHTML = `
    <div class="card">
      <h2>\u{1F3EE} \u041B\u0430\u0432\u043A\u0430 \u0441\u0438\u044F\u0435\u0442!</h2>
      <div class="muted">\xAB${level.name}\xBB \u2014 \u0440\u0435\u0448\u0435\u043D\u043E</div>
      <div class="rewards">${rewardHtml}</div>
      <div class="actions"></div>
    </div>`;
    const actions = overlay.querySelector(".actions");
    const next = nextPuzzle(level.id);
    if (next) {
      const nextBtn = document.createElement("button");
      nextBtn.className = "primary";
      nextBtn.textContent = `\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0430\u044F \u2192 ${next.name}`;
      nextBtn.addEventListener("click", () => {
        overlay.remove();
        ctx2.go("puzzle", { id: next.id });
      });
      actions.appendChild(nextBtn);
    }
    const again = document.createElement("button");
    again.textContent = "\u0415\u0449\u0451 \u0440\u0430\u0437";
    again.addEventListener("click", () => {
      overlay.remove();
      ctx2.go("puzzle", { id: level.id });
    });
    const toList = document.createElement("button");
    if (!next) toList.className = "primary";
    toList.textContent = "\u041A \u0437\u0430\u0433\u0430\u0434\u043A\u0430\u043C";
    toList.addEventListener("click", () => {
      overlay.remove();
      ctx2.go("puzzles");
    });
    const toShop = document.createElement("button");
    toShop.textContent = "\u0412 \u043B\u0430\u0432\u043A\u0443";
    toShop.addEventListener("click", () => {
      overlay.remove();
      ctx2.go("hub");
    });
    actions.append(again, toList, toShop);
    document.body.appendChild(overlay);
  }
  function header2(ctx2, title, subtitle, backTo = "hub") {
    const box = document.createElement("div");
    box.className = "panel";
    const top = document.createElement("div");
    top.style.display = "flex";
    top.style.justifyContent = "space-between";
    top.style.alignItems = "center";
    const h = document.createElement("h2");
    h.textContent = title;
    h.style.margin = "0";
    const back = document.createElement("button");
    back.className = "ghost small";
    back.textContent = "\u2190 \u041D\u0430\u0437\u0430\u0434";
    back.addEventListener("click", () => ctx2.go(backTo));
    top.append(h, back);
    box.appendChild(top);
    if (subtitle) {
      const s = document.createElement("div");
      s.className = "muted";
      s.textContent = subtitle;
      box.appendChild(s);
    }
    return box;
  }

  // src/ui/equipView.js
  var TYPE_EMOJI = {
    sword: "\u{1F5E1}\uFE0F",
    mace: "\u{1F528}",
    dagger: "\u{1F52A}",
    greatsword: "\u2694\uFE0F",
    greataxe: "\u{1FA93}",
    bow: "\u{1F3F9}",
    shield: "\u{1F6E1}\uFE0F",
    helmet: "\u{1FA96}",
    armor: "\u{1F9E5}",
    gloves: "\u{1F9E4}",
    boots: "\u{1F97E}",
    amulet: "\u{1F4FF}",
    ring: "\u{1F48D}",
    potion: "\u{1F9EA}",
    staff: "\u{1FA84}"
  };
  function itemEmoji(item2) {
    return TYPE_EMOJI[item2?.type] || "\u{1F381}";
  }
  function renderEquip(container, ctx2) {
    const { state: state2 } = ctx2;
    const head = document.createElement("div");
    head.className = "panel";
    head.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
    <h2 style="margin:0">\u041A\u043E\u043C\u043D\u0430\u0442\u0430 \u0440\u044B\u0446\u0430\u0440\u044F</h2></div>
    <div class="muted">\u041D\u0430\u0434\u0435\u0432\u0430\u0439 \u0432\u0435\u0449\u0438 \u2014 \u043E\u043D\u0438 \u0440\u0435\u0430\u043B\u044C\u043D\u043E \u043C\u0435\u043D\u044F\u044E\u0442 \u0431\u043E\u0439. \u0414\u0432\u0443\u0440\u0443\u0447\u043D\u043E\u0435 \u043E\u0440\u0443\u0436\u0438\u0435 \u0437\u0430\u043D\u0438\u043C\u0430\u0435\u0442 \u043E\u0431\u0435 \u0440\u0443\u043A\u0438.</div>`;
    const kIcon = document.createElement("img");
    kIcon.alt = "";
    kIcon.style.cssText = "width:56px;height:56px;border-radius:12px;margin-right:10px;vertical-align:middle";
    const kCandidates = ["assets/icon_knight_web.jpg", "assets/icon_knight.jfif", "assets/icon_knight.svg"];
    let kIdx = 0;
    kIcon.addEventListener("error", () => {
      kIdx += 1;
      if (kIdx < kCandidates.length) kIcon.src = kCandidates[kIdx];
      else kIcon.remove();
    });
    kIcon.src = kCandidates[0];
    head.querySelector("h2").prepend(kIcon);
    const back = document.createElement("button");
    back.className = "ghost small";
    back.textContent = "\u2190 \u041D\u0430\u0437\u0430\u0434";
    back.addEventListener("click", () => ctx2.go("hub"));
    head.firstElementChild.appendChild(back);
    container.appendChild(head);
    container.appendChild(quickNav(ctx2, [
      { icon: "\u{1F3EA}", label: "\u041F\u0440\u0438\u043B\u0430\u0432\u043E\u043A", screen: "shop", primary: true },
      { icon: "\u{1F3E0}", label: "\u0412 \u043B\u0430\u0432\u043A\u0443", screen: "hub" }
    ]));
    const layout = document.createElement("div");
    layout.style.display = "flex";
    layout.style.flexWrap = "wrap";
    layout.style.gap = "14px";
    layout.style.alignItems = "flex-start";
    const slotsPanel = document.createElement("div");
    slotsPanel.className = "panel";
    slotsPanel.style.flex = "1";
    slotsPanel.style.minWidth = "300px";
    slotsPanel.innerHTML = "<h3>\u042D\u043A\u0438\u043F\u0438\u0440\u043E\u0432\u043A\u0430</h3>";
    const grid = document.createElement("div");
    grid.className = "equip-grid";
    const shieldBlocked = isShieldBlocked(state2.equipped);
    for (const slot of SLOTS) {
      const id = state2.equipped[slot];
      const item2 = id ? ITEM_BY_ID[id] : null;
      const cell = document.createElement("div");
      cell.className = "slot" + (item2 ? "" : " empty") + (slot === "shield" && shieldBlocked && !item2 ? " blocked" : "");
      cell.innerHTML = `
      <div class="slot-name">${SLOT_LABEL[slot]}${slot === "shield" && shieldBlocked ? " (\u0437\u0430\u043D\u044F\u0442\u043E \u0434\u0432\u0443\u0440\u0443\u0447\u043D\u044B\u043C)" : ""}</div>
      <div class="slot-item">${item2 ? itemEmoji(item2) : "\uFF0B"}</div>
      <div class="item-name">${item2 ? item2.name : "\u2014"}</div>`;
      cell.title = item2 ? `${describeItem(item2)}
${item2.description}
\u041A\u043B\u0438\u043A \u2014 \u0441\u043D\u044F\u0442\u044C` : "\u041F\u0443\u0441\u0442\u043E";
      if (item2) {
        cell.addEventListener("click", () => {
          unequipToInventory(state2, slot);
          ctx2.save();
          rerender();
        });
      }
      grid.appendChild(cell);
    }
    slotsPanel.appendChild(grid);
    const belt = document.createElement("div");
    belt.innerHTML = "<h3>\u041F\u043E\u044F\u0441 \u0437\u0435\u043B\u0438\u0439 (\u0434\u043E 2)</h3>";
    const beltRow = document.createElement("div");
    beltRow.style.display = "flex";
    beltRow.style.gap = "8px";
    for (let i = 0; i < 2; i++) {
      const id = state2.consumableBelt[i];
      const item2 = id ? ITEM_BY_ID[id] : null;
      const cell = document.createElement("div");
      cell.className = "slot" + (item2 ? "" : " empty");
      cell.style.flex = "1";
      cell.innerHTML = `
      <div class="slot-name">\u041A\u0430\u0440\u043C\u0430\u0448\u0435\u043A ${i + 1}</div>
      <div class="slot-item">${item2 ? itemEmoji(item2) : "\uFF0B"}</div>
      <div class="item-name">${item2 ? item2.name : "\u2014"}</div>`;
      if (item2) {
        cell.title = `${item2.description}
\u041A\u043B\u0438\u043A \u2014 \u0443\u0431\u0440\u0430\u0442\u044C \u0438\u0437 \u043F\u043E\u044F\u0441\u0430`;
        cell.addEventListener("click", () => {
          removeFromBelt(state2, i);
          ctx2.save();
          rerender();
        });
      }
      beltRow.appendChild(cell);
    }
    belt.appendChild(beltRow);
    slotsPanel.appendChild(belt);
    layout.appendChild(slotsPanel);
    const statsPanel = document.createElement("div");
    statsPanel.className = "panel";
    statsPanel.style.flex = "1";
    statsPanel.style.minWidth = "260px";
    statsPanel.innerHTML = "<h3>\u0425\u0430\u0440\u0430\u043A\u0442\u0435\u0440\u0438\u0441\u0442\u0438\u043A\u0438</h3>";
    const { stats, traits } = collectStats(state2.equipped);
    const sgrid = document.createElement("div");
    sgrid.className = "stats-grid";
    const rows = [
      ["\u2764\uFE0F \u0417\u0434\u043E\u0440\u043E\u0432\u044C\u0435", stats.hp],
      ["\u{1F5E1}\uFE0F \u0410\u0442\u0430\u043A\u0430", stats.attack],
      ["\u{1F6E1}\uFE0F \u0411\u0440\u043E\u043D\u044F", stats.armor],
      ["\u26A1 \u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C", stats.speed],
      ["\u{1F4A5} \u041A\u0440\u0438\u0442", `${Math.round(stats.crit * 100)}%`],
      ["\u{1F4A8} \u0423\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u0435", `${Math.round(stats.dodge * 100)}%`],
      ["\u{1F530} \u0411\u043B\u043E\u043A", `${Math.round(stats.block * 100)}%`],
      ["\u{1FA99} \u041C\u043E\u043D\u0435\u0442\u044B", `+${Math.round((stats.goldFind || 0) * 100)}%`]
    ];
    for (const [rk, rv] of Object.entries(stats.resist || {})) {
      const RL = { fire: "\u{1F525} \u043E\u0433\u043D\u044E", poison: "\u2620\uFE0F \u044F\u0434\u0443", sleep: "\u{1F634} \u0441\u043D\u0443", slow: "\u{1F40C} \u0437\u0430\u043C\u0435\u0434\u043B\u0435\u043D\u0438\u044E", fear: "\u{1F628} \u0441\u0442\u0440\u0430\u0445\u0443" };
      rows.push([`\u0421\u043E\u043F\u0440. ${RL[rk] || rk}`, `${Math.round(rv * 100)}%`]);
    }
    for (const [k, v] of rows) {
      const d = document.createElement("div");
      d.innerHTML = `${k}: <b>${v}</b>`;
      sgrid.appendChild(d);
    }
    statsPanel.appendChild(sgrid);
    if (traits.length > 0) {
      const t = document.createElement("div");
      t.className = "muted mt";
      t.style.fontSize = "13px";
      const TL = {
        cleave_small: "\u2694\uFE0F \u0420\u0430\u0441\u0441\u0435\u0447\u0435\u043D\u0438\u0435: \u0437\u0430\u0434\u0435\u0432\u0430\u0435\u0442 \u0441\u043E\u0441\u0435\u0434\u043D\u0438\u0445 \u0432\u0440\u0430\u0433\u043E\u0432",
        bonus_spirit: "\u{1F33F} \u0411\u043E\u043D\u0443\u0441 \u043F\u0440\u043E\u0442\u0438\u0432 \u0434\u0443\u0445\u043E\u0432",
        ranged: "\u{1F3F9} \u0414\u0430\u043B\u044C\u043D\u0438\u0439 \u0431\u043E\u0439: \u0431\u044C\u0451\u0442 \u0441\u0430\u043C\u043E\u0433\u043E \u0445\u0440\u0443\u043F\u043A\u043E\u0433\u043E",
        first_hit_reduction: "\u{1F6E1}\uFE0F \u041F\u0435\u0440\u0432\u044B\u0439 \u0443\u0434\u0430\u0440 \u043F\u043E \u0440\u044B\u0446\u0430\u0440\u044E \u0441\u043B\u0430\u0431\u0435\u0435 \u043D\u0430 20%",
        thorns_small: "\u{1F335} \u0428\u0438\u043F\u044B \u043D\u0430 \u0449\u0438\u0442\u0435",
        heal_after_battle: "\u{1F3EE} \u041B\u0435\u0447\u0435\u043D\u0438\u0435 \u043F\u043E\u0441\u043B\u0435 \u0431\u043E\u044F"
      };
      t.innerHTML = traits.map((x) => TL[x] || x).join("<br>");
      statsPanel.appendChild(t);
    }
    layout.appendChild(statsPanel);
    container.appendChild(layout);
    const inv = document.createElement("div");
    inv.className = "panel";
    inv.innerHTML = `<h3>\u0421\u0443\u043D\u0434\u0443\u043A (${state2.inventory.length})</h3>`;
    const list = document.createElement("div");
    list.className = "list";
    if (state2.inventory.length === 0) {
      list.innerHTML = '<div class="muted">\u041F\u0443\u0441\u0442\u043E. \u0420\u0435\u0448\u0430\u0439 \u0437\u0430\u0433\u0430\u0434\u043A\u0438 \u0438 \u0437\u0430\u0445\u043E\u0434\u0438 \u043A \u043F\u0440\u0438\u043B\u0430\u0432\u043A\u0443!</div>';
    }
    state2.inventory.forEach((id, index) => {
      const item2 = ITEM_BY_ID[id];
      if (!item2) return;
      const row = document.createElement("div");
      row.className = "row";
      const rarity = RARITY_LABEL[item2.rarity] || "";
      row.innerHTML = `
      <span class="icon">${itemEmoji(item2)}</span>
      <span class="grow">
        <div class="name">${item2.name} <span class="badge ${item2.rarity}">${rarity}</span></div>
        <div class="desc">${describeItem(item2) || item2.description}</div>
      </span>`;
      const btn = document.createElement("button");
      btn.className = "small";
      btn.textContent = item2.slot === "consumable" ? "\u0412 \u043F\u043E\u044F\u0441" : "\u041D\u0430\u0434\u0435\u0442\u044C";
      btn.addEventListener("click", () => {
        const r = equipFromInventory(state2, index);
        if (r.ok) {
          ctx2.toast(item2.slot === "consumable" ? `${item2.name} \u2014 \u0432 \u043F\u043E\u044F\u0441\u0435` : `\u041D\u0430\u0434\u0435\u0442\u043E: ${item2.name}`);
          ctx2.save();
          rerender();
        } else {
          ctx2.toast(r.error || "\u041D\u0435 \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442\u0441\u044F \u043D\u0430\u0434\u0435\u0442\u044C");
        }
      });
      row.appendChild(btn);
      if (!item2.sealPrice) {
        const sellBtn = document.createElement("button");
        sellBtn.className = "small ghost";
        sellBtn.textContent = `\u{1FA99} ${Math.max(1, Math.floor(item2.price / 2))}`;
        sellBtn.title = `\u041F\u0440\u043E\u0434\u0430\u0442\u044C \xAB${item2.name}\xBB \u0437\u0430 \u043F\u043E\u043B\u0446\u0435\u043D\u044B`;
        sellBtn.addEventListener("click", () => {
          const r = sellItem(state2, index);
          if (r.ok) {
            ctx2.toast(`\u041F\u0440\u043E\u0434\u0430\u043D\u043E: ${item2.name} \u0437\u0430 ${r.price} \u043C\u043E\u043D\u0435\u0442`);
            ctx2.sfx?.("coin");
            ctx2.save();
            rerender();
          }
        });
        row.appendChild(sellBtn);
      }
      list.appendChild(row);
    });
    inv.appendChild(list);
    container.appendChild(inv);
    function rerender() {
      container.innerHTML = "";
      renderEquip(container, ctx2);
    }
  }

  // src/ui/shopView.js
  function renderShop(container, ctx2) {
    const { state: state2 } = ctx2;
    const head = document.createElement("div");
    head.className = "panel";
    head.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
    <h2 style="margin:0">\u041F\u0440\u0438\u043B\u0430\u0432\u043E\u043A</h2></div>
    <div class="muted">\u0417\u0432\u043E\u043D \u043C\u043E\u043D\u0435\u0442, \u0434\u0435\u0440\u0435\u0432\u044F\u043D\u043D\u044B\u0435 \u043F\u043E\u043B\u043A\u0438, \u0442\u0451\u043F\u043B\u044B\u0439 \u0441\u0432\u0435\u0442. \u0410\u0441\u0441\u043E\u0440\u0442\u0438\u043C\u0435\u043D\u0442 \u0440\u0430\u0441\u0442\u0451\u0442 \u0441 \u043F\u043E\u0431\u0435\u0434\u0430\u043C\u0438 \u0440\u044B\u0446\u0430\u0440\u044F.</div>`;
    const back = document.createElement("button");
    back.className = "ghost small";
    back.textContent = "\u2190 \u041D\u0430\u0437\u0430\u0434";
    back.addEventListener("click", () => ctx2.go("hub"));
    head.firstElementChild.appendChild(back);
    container.appendChild(head);
    container.appendChild(quickNav(ctx2, [
      { icon: "\u{1F392}", label: "\u041A\u043E\u043C\u043D\u0430\u0442\u0430 \u0440\u044B\u0446\u0430\u0440\u044F", screen: "equip", primary: true },
      { icon: "\u{1F3E0}", label: "\u0412 \u043B\u0430\u0432\u043A\u0443", screen: "hub" }
    ]));
    const buyPanel = document.createElement("div");
    buyPanel.className = "panel";
    buyPanel.innerHTML = "<h3>\u041F\u043E\u043B\u043A\u0438 \u043B\u0430\u0432\u043A\u0438</h3>";
    const buyList = document.createElement("div");
    buyList.className = "list";
    for (const item2 of shopStock(state2)) {
      const row = document.createElement("div");
      row.className = "row";
      const priceLabel = item2.sealPrice ? `\u{1F530} ${item2.sealPrice}` : `\u{1FA99} ${item2.price}`;
      const afford = item2.sealPrice ? state2.seals >= item2.sealPrice : state2.coins >= item2.price;
      row.innerHTML = `
      <span class="icon">${itemEmoji(item2)}</span>
      <span class="grow">
        <div class="name">${item2.name} <span class="badge ${item2.rarity}">${RARITY_LABEL[item2.rarity]}</span></div>
        <div class="desc">${describeItem(item2) || item2.description}</div>
      </span>
      <span class="price">${priceLabel}</span>`;
      const btn = document.createElement("button");
      btn.className = "small";
      btn.textContent = "\u041A\u0443\u043F\u0438\u0442\u044C";
      btn.disabled = !afford;
      const showCompare = () => showCompareTip(state2, item2, btn);
      btn.addEventListener("mouseenter", showCompare);
      btn.addEventListener("focus", showCompare);
      btn.addEventListener("mouseleave", hideCompareTip);
      btn.addEventListener("blur", hideCompareTip);
      btn.addEventListener("click", hideCompareTip);
      btn.addEventListener("click", () => {
        const r = buyItem(state2, item2.id);
        if (r.ok) {
          ctx2.sfx?.("coin");
          if (r.autoEquipped?.belt) ctx2.toast(`\u041A\u0443\u043F\u043B\u0435\u043D\u043E: ${item2.name} \u2014 \u0443\u0436\u0435 \u0432 \u043F\u043E\u044F\u0441\u0435!`);
          else if (r.autoEquipped?.slot) ctx2.toast(`\u041A\u0443\u043F\u043B\u0435\u043D\u043E: ${item2.name} \u2014 \u0443\u0436\u0435 \u043D\u0430\u0434\u0435\u0442\u043E!`);
          else ctx2.toast(`\u041A\u0443\u043F\u043B\u0435\u043D\u043E: ${item2.name}. \u041B\u0435\u0436\u0438\u0442 \u0432 \u0441\u0443\u043D\u0434\u0443\u043A\u0435 (\u041A\u043E\u043C\u043D\u0430\u0442\u0430 \u0440\u044B\u0446\u0430\u0440\u044F).`);
          ctx2.save();
          rerender();
        } else {
          ctx2.toast(r.error);
        }
      });
      row.appendChild(btn);
      buyList.appendChild(row);
    }
    buyPanel.appendChild(buyList);
    container.appendChild(buyPanel);
    const firstBuy = buyList.querySelector?.("button:not([disabled])");
    if (firstBuy && (state2.stats.itemsBought || 0) === 0) {
      startTutorial(ctx2, "first_purchase", [
        {
          target: firstBuy,
          title: "\u041F\u0435\u0440\u0432\u0430\u044F \u043F\u043E\u043A\u0443\u043F\u043A\u0430",
          text: "\u041C\u043E\u043D\u0435\u0442\u044B \u0441 \u0437\u0430\u0433\u0430\u0434\u043E\u043A \u2014 \u044D\u0442\u043E \u0442\u043E\u0432\u0430\u0440\u044B \u0434\u043B\u044F \u0440\u044B\u0446\u0430\u0440\u044F. \u0412\u044B\u0431\u0435\u0440\u0438 \u0447\u0442\u043E-\u043D\u0438\u0431\u0443\u0434\u044C \u043F\u043E \u0434\u0443\u0448\u0435 \u0438 \u043D\u0430\u0436\u043C\u0438 \xAB\u041A\u0443\u043F\u0438\u0442\u044C\xBB: \u0432\u0435\u0449\u044C \u043B\u044F\u0436\u0435\u0442 \u0432 \u0441\u0443\u043D\u0434\u0443\u043A, \u0430 \u043D\u0430\u0434\u0435\u0442\u044C \u0435\u0451 \u043C\u043E\u0436\u043D\u043E \u0432 \u043A\u043E\u043C\u043D\u0430\u0442\u0435 \u0440\u044B\u0446\u0430\u0440\u044F.",
          cta: "\u041F\u043E\u043A\u0443\u043F\u0430\u044E!"
        }
      ]);
    }
    const sellPanel = document.createElement("div");
    sellPanel.className = "panel";
    sellPanel.innerHTML = `<h3>\u041F\u0440\u043E\u0434\u0430\u0442\u044C \u0438\u0437 \u0441\u0443\u043D\u0434\u0443\u043A\u0430 (\u0437\u0430 \u043F\u043E\u043B\u0446\u0435\u043D\u044B)</h3>`;
    const sellList = document.createElement("div");
    sellList.className = "list";
    if (state2.inventory.length === 0) {
      sellList.innerHTML = '<div class="muted">\u0421\u0443\u043D\u0434\u0443\u043A \u043F\u0443\u0441\u0442.</div>';
    }
    state2.inventory.forEach((id, index) => {
      const item2 = ITEM_BY_ID[id];
      if (!item2) return;
      const price = Math.max(1, Math.floor(item2.price / 2));
      const row = document.createElement("div");
      row.className = "row";
      row.innerHTML = `
      <span class="icon">${itemEmoji(item2)}</span>
      <span class="grow"><div class="name">${item2.name}</div></span>
      <span class="price">\u{1FA99} ${price}</span>`;
      const btn = document.createElement("button");
      btn.className = "small";
      btn.textContent = "\u041F\u0440\u043E\u0434\u0430\u0442\u044C";
      btn.addEventListener("click", () => {
        const r = sellItem(state2, index);
        if (r.ok) {
          ctx2.toast(`\u041F\u0440\u043E\u0434\u0430\u043D\u043E: ${item2.name} \u0437\u0430 ${r.price} \u043C\u043E\u043D\u0435\u0442`);
          ctx2.save();
          rerender();
        }
      });
      row.appendChild(btn);
      sellList.appendChild(row);
    });
    sellPanel.appendChild(sellList);
    container.appendChild(sellPanel);
    const cosPanel = document.createElement("div");
    cosPanel.className = "panel";
    cosPanel.innerHTML = '<h3>\u0423\u043A\u0440\u0430\u0448\u0435\u043D\u0438\u044F \u043B\u0430\u0432\u043A\u0438</h3><div class="muted" style="font-size:13px;margin-bottom:8px">\u0422\u043E\u043B\u044C\u043A\u043E \u043A\u0440\u0430\u0441\u043E\u0442\u0430 \u2014 \u043D\u0438\u043A\u0430\u043A\u043E\u0433\u043E \u0432\u043B\u0438\u044F\u043D\u0438\u044F \u043D\u0430 \u0441\u0438\u043B\u0443.</div>';
    const cosList = document.createElement("div");
    cosList.className = "list";
    for (const c of COSMETICS) {
      const owned = state2.cosmeticsOwned.includes(c.id);
      const active = state2.cosmeticsActive.includes(c.id);
      const row = document.createElement("div");
      row.className = "row" + (active ? " done" : "");
      const price = c.sealPrice ? `\u{1F530} ${c.sealPrice}` : `\u{1FA99} ${c.price}`;
      row.innerHTML = `
      <span class="icon">${c.icon}</span>
      <span class="grow">
        <div class="name">${c.name}${c.season ? ` <span class="badge">${SEASON_LABEL[c.season]}</span>` : ""}</div>
        <div class="desc">${c.description}</div>
      </span>`;
      const btn = document.createElement("button");
      btn.className = "small" + (active ? " ghost" : "");
      if (!owned) {
        btn.innerHTML = `\u041A\u0443\u043F\u0438\u0442\u044C \xB7 ${price}`;
        btn.disabled = c.sealPrice ? state2.seals < c.sealPrice : state2.coins < c.price;
        btn.addEventListener("click", () => {
          const r = buyCosmetic(state2, c.id);
          if (r.ok) {
            ctx2.toast(`${c.name} \u2014 \u0443\u0436\u0435 \u0432 \u043B\u0430\u0432\u043A\u0435!`);
            ctx2.sfx?.("success");
            ctx2.save();
            rerender();
          } else ctx2.toast(r.error);
        });
      } else {
        btn.textContent = active ? "\u0423\u0431\u0440\u0430\u0442\u044C" : "\u0412\u044B\u0441\u0442\u0430\u0432\u0438\u0442\u044C";
        btn.addEventListener("click", () => {
          toggleCosmetic(state2, c.id);
          ctx2.save();
          rerender();
        });
      }
      row.appendChild(btn);
      cosList.appendChild(row);
    }
    cosPanel.appendChild(cosList);
    container.appendChild(cosPanel);
    function rerender() {
      container.innerHTML = "";
      renderShop(container, ctx2);
    }
  }
  var compareEl = null;
  function showCompareTip(state2, item2, anchor) {
    hideCompareTip();
    compareEl = document.createElement("div");
    compareEl.className = "compare-tip";
    let html = "";
    if (item2.slot === "consumable") {
      const belt = state2.consumableBelt.map((id) => ITEM_BY_ID[id]?.name || id);
      html = `<div class="ct-title">\u041F\u043E\u044F\u0441 (${state2.consumableBelt.length}/2)</div>` + (belt.length ? belt.map((n) => `<div class="ct-item">\u{1F9EA} ${n}</div>`).join("") : '<div class="ct-empty">\u041F\u043E\u044F\u0441 \u043F\u0443\u0441\u0442 \u2014 \u0437\u0435\u043B\u044C\u0435 \u043B\u044F\u0436\u0435\u0442 \u0441\u0440\u0430\u0437\u0443 \u0432 \u0431\u043E\u0439</div>');
    } else {
      const slotsToShow = item2.slot === "ring" ? ["ring1", "ring2"] : [item2.slot];
      html = `<div class="ct-title">\u0421\u0435\u0439\u0447\u0430\u0441 \u043D\u0430\u0434\u0435\u0442\u043E (${slotsToShow.map((s) => SLOT_LABEL[s]).join(" / ")})</div>`;
      html += slotsToShow.map((s) => {
        const id = state2.equipped[s];
        if (!id) return `<div class="ct-empty">${SLOT_LABEL[s]}: \u0441\u0432\u043E\u0431\u043E\u0434\u0435\u043D</div>`;
        const cur = ITEM_BY_ID[id];
        return `<div class="ct-item">${itemEmoji(cur)} ${cur.name}</div><div class="ct-stats">${describeItem(cur) || cur.description}</div>`;
      }).join("");
      const diff = quickDiff(state2, item2, slotsToShow);
      if (diff) html += `<div class="ct-stats" style="margin-top:4px">${diff}</div>`;
    }
    compareEl.innerHTML = html;
    document.body.appendChild(compareEl);
    const r = anchor.getBoundingClientRect();
    const h = compareEl.offsetHeight || 80;
    compareEl.style.left = `${Math.max(8, r.left - 220)}px`;
    compareEl.style.top = `${Math.max(8, r.top - 8 - h)}px`;
  }
  function quickDiff(state2, item2, slotsToShow) {
    const KEYS = ["attack", "armor", "hp", "speed"];
    const NAMES = { attack: "\u2694", armor: "\u{1F6E1}", hp: "\u2764", speed: "\u26A1" };
    const cur = slotsToShow.map((s) => ITEM_BY_ID[state2.equipped[s]]).find(Boolean);
    const parts = [];
    for (const k of KEYS) {
      const nv = item2.stats?.[k] || 0;
      const cv = cur?.stats?.[k] || 0;
      const d = nv - cv;
      if (d !== 0) parts.push(`${NAMES[k]} ${d > 0 ? "+" : ""}${d}`);
    }
    return parts.length ? `\u0420\u0430\u0437\u043D\u0438\u0446\u0430 \u0441 \u043D\u0430\u0434\u0435\u0442\u044B\u043C: ${parts.join(" ")}` : "";
  }
  function hideCompareTip() {
    if (compareEl) {
      compareEl.remove();
      compareEl = null;
    }
  }

  // src/ui/battleView.js
  function renderBattleList(container, ctx2) {
    const { state: state2 } = ctx2;
    const head = document.createElement("div");
    head.className = "panel";
    head.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
    <h2 style="margin:0">\u041F\u043E\u0445\u043E\u0434\u044B \u0440\u044B\u0446\u0430\u0440\u044F</h2></div>
    <div class="muted">\u0420\u044B\u0446\u0430\u0440\u044C \u0441\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044F \u0441\u0430\u043C \u2014 \u0442\u0432\u043E\u044F \u0440\u0430\u0431\u043E\u0442\u0430: \u0441\u043D\u0430\u0440\u044F\u0434\u0438\u0442\u044C \u0435\u0433\u043E \u0441 \u0437\u0430\u0431\u043E\u0442\u043E\u0439. \u0422\u0440\u0438 \u043C\u0438\u0440\u0430 \u0436\u0434\u0443\u0442.</div>`;
    const back = document.createElement("button");
    back.className = "ghost small";
    back.textContent = "\u2190 \u041D\u0430\u0437\u0430\u0434";
    back.addEventListener("click", () => ctx2.go("hub"));
    head.firstElementChild.appendChild(back);
    container.appendChild(head);
    container.appendChild(quickNav(ctx2, [
      { icon: "\u{1F392}", label: "\u041A\u043E\u043C\u043D\u0430\u0442\u0430 \u0440\u044B\u0446\u0430\u0440\u044F", screen: "equip", primary: true },
      { icon: "\u{1F3E0}", label: "\u0412 \u043B\u0430\u0432\u043A\u0443", screen: "hub" }
    ]));
    const list = document.createElement("div");
    list.className = "list";
    const won = Object.keys(state2.battlesDone).length;
    const firstUnbeaten = firstUnbeatenBattle(state2);
    const WORLD_LABEL2 = { meadow: "\u{1F33F} \u0422\u0438\u0445\u0430\u044F \u043E\u043F\u0443\u0448\u043A\u0430", town: "\u{1F3F0} \u0421\u0440\u0435\u0434\u043D\u0435\u0432\u0435\u043A\u043E\u0432\u044B\u0439 \u0434\u0432\u043E\u0440\u0438\u043A", attic: "\u{1F4D6} \u041A\u043D\u0438\u0436\u043D\u044B\u0439 \u0447\u0435\u0440\u0434\u0430\u043A" };
    let lastWorld = null;
    for (const b of BATTLES) {
      if (b.world !== lastWorld) {
        lastWorld = b.world;
        const wh = document.createElement("h3");
        wh.textContent = WORLD_LABEL2[b.world] || b.world;
        list.appendChild(wh);
      }
      const available = battleAvailable(state2, b.id);
      const done = !!state2.battlesDone[b.id];
      const row = document.createElement("div");
      row.className = "row" + (available ? "" : " locked") + (done ? " done" : "");
      if (firstUnbeaten && b.id === firstUnbeaten.id) row.dataset.scrollTarget = "1";
      const icons = b.enemies.map((e) => ENEMY_BY_ID[e].icon).join(" ");
      row.innerHTML = `
      <span class="icon">${available ? done ? "\u{1F3C6}" : "\u2694\uFE0F" : "\u{1F512}"}</span>
      <span class="grow">
        <div class="name">${b.name} ${ENEMY_BY_ID[b.enemies[0]].boss ? '<span class="badge epic">\u0411\u041E\u0421\u0421</span>' : ""}</div>
        <div class="desc">${available ? b.tip : "\u041F\u0440\u043E\u0439\u0434\u0438 \u043F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0438\u0439 \u043F\u043E\u0445\u043E\u0434."} \xB7 \u041F\u0440\u043E\u0442\u0438\u0432: ${icons}</div>
      </span>`;
      if (available) {
        const btn = document.createElement("button");
        btn.textContent = done ? "\u0421\u043D\u043E\u0432\u0430" : "\u0412 \u043F\u043E\u0445\u043E\u0434!";
        btn.className = done ? "" : "primary";
        btn.addEventListener("click", () => ctx2.go("battle", { id: b.id }));
        row.appendChild(btn);
      }
      list.appendChild(row);
    }
    container.appendChild(list);
    const targetRow = list.querySelector?.('[data-scroll-target="1"]');
    if (targetRow && targetRow.scrollIntoView) {
      setTimeout(() => targetRow.scrollIntoView({ block: "center", behavior: "smooth" }), 60);
    }
    if (won === 0) {
      const firstBtn = list.querySelector?.(".row:not(.locked) button");
      if (firstBtn) {
        startTutorial(ctx2, "first_battle", [
          {
            target: firstBtn,
            title: "\u041F\u0435\u0440\u0432\u044B\u0439 \u043F\u043E\u0445\u043E\u0434 \u0440\u044B\u0446\u0430\u0440\u044F",
            text: "\u0411\u043E\u0439 \u0438\u0434\u0451\u0442 \u0441\u0430\u043C \u2014 \u0442\u044B \u0440\u0435\u0436\u0438\u0441\u0441\u0451\u0440, \u0430 \u043D\u0435 \u0430\u043A\u0442\u0435\u0440. \u041D\u0430\u0436\u043C\u0438 \xAB\u0412 \u043F\u043E\u0445\u043E\u0434!\xBB \u0438 \u0441\u043C\u043E\u0442\u0440\u0438, \u043A\u0430\u043A \u0442\u0432\u043E\u044F \u0437\u0430\u0431\u043E\u0442\u0430 \u043F\u0440\u0435\u0432\u0440\u0430\u0449\u0430\u0435\u0442\u0441\u044F \u0432 \u043F\u043E\u0431\u0435\u0434\u0443. \u0415\u0441\u043B\u0438 \u0447\u0442\u043E-\u0442\u043E \u043F\u043E\u0439\u0434\u0451\u0442 \u043D\u0435 \u0442\u0430\u043A, \u043E\u0442\u0447\u0451\u0442 \u043F\u043E\u0434\u0441\u043A\u0430\u0436\u0435\u0442, \u0447\u0435\u0433\u043E \u043D\u0435 \u0445\u0432\u0430\u0442\u0438\u043B\u043E.",
            cta: "\u0412 \u043F\u043E\u0445\u043E\u0434!"
          }
        ]);
      }
    }
  }
  function renderBattle(container, ctx2, params) {
    const battle = BATTLE_BY_ID[params.id];
    if (!battle) {
      ctx2.go("battles");
      return;
    }
    const { state: state2 } = ctx2;
    const seed = Date.now() % 1e5 + 1;
    const { stats: kstats } = collectStats(state2.equipped);
    const display = {
      knight: { uid: "a0", name: "\u0420\u044B\u0446\u0430\u0440\u044C \u043B\u0430\u0432\u043A\u0438", icon: "\u{1F6E1}\uFE0F", hp: kstats.hp, maxHp: kstats.hp, badges: /* @__PURE__ */ new Set() },
      mercs: state2.squadMercs.map((id, i2) => {
        const d = MERC_BY_ID[id];
        return { uid: `a${i2 + 1}`, name: d.name, icon: d.icon, hp: d.hp, maxHp: d.hp, badges: /* @__PURE__ */ new Set() };
      }),
      foes: battle.enemies.map((id, i2) => {
        const d = ENEMY_BY_ID[id];
        return { uid: `e${i2}`, name: d.name, icon: d.icon, hp: d.hp, maxHp: d.hp, badges: /* @__PURE__ */ new Set() };
      })
    };
    const result = runBattle(state2, battle.id, seed);
    if (!result) {
      ctx2.go("battles");
      return;
    }
    ctx2.save();
    const head = document.createElement("div");
    head.className = "panel";
    head.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
    <h2 style="margin:0">${battle.name}</h2></div>`;
    const back = document.createElement("button");
    back.className = "ghost small";
    back.textContent = "\u2190 \u041D\u0430\u0437\u0430\u0434";
    back.addEventListener("click", () => {
      stop();
      ctx2.go("battles");
    });
    head.firstElementChild.appendChild(back);
    container.appendChild(head);
    const arena = document.createElement("div");
    arena.className = "battle-arena";
    const knightCard = unitCard(display.knight, "ally");
    arena.appendChild(knightCard.el);
    const mercCards = display.mercs.map((m) => {
      const c = unitCard(m, "ally");
      arena.appendChild(c.el);
      return c;
    });
    const vs = document.createElement("div");
    vs.style.alignSelf = "center";
    vs.style.fontSize = "22px";
    vs.textContent = "\u2694\uFE0F";
    arena.appendChild(vs);
    const foeCards = display.foes.map((f) => {
      const c = unitCard(f, "enemy");
      arena.appendChild(c.el);
      return c;
    });
    container.appendChild(arena);
    const controls = document.createElement("div");
    controls.className = "panel";
    controls.style.display = "flex";
    controls.style.gap = "8px";
    controls.style.alignItems = "center";
    const speedLabel = document.createElement("span");
    speedLabel.textContent = "\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C:";
    const b1 = speedBtn("1x", 350);
    const b2 = speedBtn("2x", 170);
    const b4 = speedBtn("4x", 80);
    const skip = document.createElement("button");
    skip.className = "small ghost";
    skip.textContent = "\u23ED\uFE0F \u041A \u0438\u0442\u043E\u0433\u0443";
    skip.addEventListener("click", () => finishNow());
    controls.append(speedLabel, b1, b2, b4, skip);
    container.appendChild(controls);
    const logBox = document.createElement("div");
    logBox.className = "battle-log";
    container.appendChild(logBox);
    let speed = 350;
    let timer = null;
    let i = 0;
    let done = false;
    function speedBtn(label, ms) {
      const b = document.createElement("button");
      b.className = "small";
      b.textContent = label;
      b.addEventListener("click", () => {
        speed = ms;
      });
      return b;
    }
    function unitCard(u, side) {
      const el = document.createElement("div");
      el.className = "unit-card";
      el.dataset.side = side;
      el.innerHTML = `
      <div class="uicon">${u.icon}</div>
      <div class="name" style="font-size:13px;font-weight:600">${u.name}</div>
      <div class="status-badges"></div>
      <div class="hpbar"><div style="width:100%"></div></div>`;
      return { el, u };
    }
    function pulse(el, cls, ms = 500) {
      if (!el) return;
      el.classList.remove(cls);
      void el.offsetWidth;
      el.classList.add(cls);
      setTimeout(() => el.classList.remove(cls), ms);
    }
    function floatNumber(card, text, cls = "") {
      const n = document.createElement("div");
      n.className = `dmg-number ${cls}`;
      n.textContent = text;
      card.el.appendChild(n);
      setTimeout(() => n.remove(), 850);
    }
    function animateAttack(attackerCard, targetCard, dmg, crit) {
      const side = attackerCard?.el?.dataset.side === "enemy" ? "enemy" : "ally";
      pulse(attackerCard?.el, `anim-lunge-${side}`, 350);
      setTimeout(() => {
        if (crit) pulse(targetCard?.el, "anim-crit", 550);
        else pulse(targetCard?.el, "anim-hit", 480);
        floatNumber(targetCard, `\u2212${dmg}`, crit ? "crit" : "");
        if (targetCard && targetCard.u.hp <= 0) pulse(targetCard.el, "anim-death", 650);
      }, 120);
    }
    function applyEvent(e) {
      const findUnit = (uid, name) => {
        const all = [
          { card: knightCard, u: display.knight },
          ...display.mercs.map((m, i2) => ({ card: mercCards[i2], u: m })),
          ...display.foes.map((f, i2) => ({ card: foeCards[i2], u: f }))
        ];
        if (uid) {
          const hit = all.find((x) => x.u.uid === uid);
          if (hit) return hit;
        }
        return all.find((x) => x.u.name === name) || null;
      };
      const line = document.createElement("div");
      switch (e.t) {
        case "start":
          line.className = "sys";
          line.textContent = `\u0420\u044B\u0446\u0430\u0440\u044C \u0432\u044B\u0445\u043E\u0434\u0438\u0442: ${e.foes.join(", ")}.`;
          break;
        case "hit": {
          const target = findUnit(e.toUid, e.to);
          const attacker = findUnit(e.fromUid, e.from);
          if (target) {
            target.u.hp = Math.max(0, target.u.hp - e.dmg);
            updateCard(target.card, target.u);
            if (attacker) animateAttack(attacker.card, target.card, e.dmg, e.crit);
          }
          line.className = e.crit ? "crit" : "hit";
          line.textContent = `${e.from} \u2192 ${e.to}: \u2212${e.dmg}${e.crit ? " \u041A\u0420\u0418\u0422!" : ""}${e.blocked ? " (\u0431\u043B\u043E\u043A)" : ""}`;
          ctx2.sfx?.(e.crit ? "crit" : "hit");
          break;
        }
        case "dodge": {
          const target = findUnit(e.uid, e.who);
          if (target) pulse(target.card.el, "anim-dodge", 380);
          line.className = "sys";
          line.textContent = `${e.who} \u0443\u043A\u043B\u043E\u043D\u044F\u0435\u0442\u0441\u044F!`;
          break;
        }
        case "status": {
          const target = findUnit(e.uid, e.who);
          const EMOJI = { sleep: "\u{1F634}", poison: "\u2620\uFE0F", slow: "\u{1F40C}", shield: "\u{1F530}", fear: "\u{1F628}", regen: "\u{1F49A}" };
          if (target) {
            target.u.badges.add(EMOJI[e.kind] || "\u2733\uFE0F");
            updateCard(target.card, target.u);
          }
          line.className = "status";
          const NAMES = { sleep: "\u0437\u0430\u0441\u044B\u043F\u0430\u0435\u0442", poison: "\u043E\u0442\u0440\u0430\u0432\u043B\u0435\u043D", slow: "\u0437\u0430\u043C\u0435\u0434\u043B\u0435\u043D", fear: "\u043E\u0445\u0432\u0430\u0447\u0435\u043D \u0441\u0442\u0440\u0430\u0445\u043E\u043C", regen: "\u043F\u043E\u0434\u043A\u0440\u0435\u043F\u043B\u044F\u0435\u0442\u0441\u044F \u043D\u0430\u0441\u0442\u043E\u0435\u043C" };
          line.textContent = `${e.who} ${NAMES[e.kind] || e.kind}${e.from ? ` (${e.from})` : ""}`;
          break;
        }
        case "sleeps":
          line.className = "status";
          line.textContent = `${e.who} \u0441\u043F\u0438\u0442\u2026 \u{1F634}`;
          break;
        case "potion": {
          const target = findUnit(e.uid, e.who);
          if (target && e.healed) {
            target.u.hp = Math.min(target.u.maxHp, target.u.hp + e.healed);
            target.u.badges.delete("\u2620\uFE0F");
            updateCard(target.card, target.u);
            pulse(target.card.el, "anim-heal", 750);
            floatNumber(target.card, `+${e.healed}`, "heal");
          }
          if (target && e.cleansed) {
            const CLEANSE_BADGE = { sleep: "\u{1F634}", poison: "\u2620\uFE0F" };
            target.u.badges.delete(CLEANSE_BADGE[e.cleansed] || "\u2733\uFE0F");
            updateCard(target.card, target.u);
            pulse(target.card.el, "anim-heal", 750);
          }
          const CLEANSE_TEXT = { sleep: " \u2014 \u0441\u043E\u043D \u043A\u0430\u043A \u0440\u0443\u043A\u043E\u0439 \u0441\u043D\u044F\u043B\u043E!", poison: " \u2014 \u044F\u0434 \u0432\u044B\u0432\u0435\u0434\u0435\u043D!" };
          line.className = "potion";
          line.textContent = `${e.who} \u043F\u044C\u0451\u0442 ${e.name}${e.healed ? ` (+${e.healed} \u2764\uFE0F)` : ""}${e.cleansed ? CLEANSE_TEXT[e.cleansed] || "" : ""}`;
          ctx2.sfx?.("potion");
          break;
        }
        default:
          return;
      }
      logBox.appendChild(line);
      logBox.scrollTop = logBox.scrollHeight;
    }
    function updateCard(card, u) {
      const bar = card.el.querySelector(".hpbar > div");
      bar.style.width = `${Math.max(0, u.hp / u.maxHp * 100)}%`;
      card.el.querySelector(".status-badges").textContent = [...u.badges].join(" ");
      card.el.classList.toggle("dead", u.hp <= 0);
    }
    function step() {
      if (done) return;
      if (i >= result.log.length) {
        endScreen();
        return;
      }
      applyEvent(result.log[i]);
      i += 1;
      timer = setTimeout(step, speed);
    }
    function finishNow() {
      if (done) return;
      while (i < result.log.length) {
        applyEvent(result.log[i]);
        i += 1;
      }
      endScreen();
    }
    function endScreen() {
      if (done) return;
      done = true;
      clearTimeout(timer);
      const rep = result.report;
      ctx2.sfx?.(rep.victory ? "success" : "fail");
      const overlay = document.createElement("div");
      overlay.className = "overlay";
      const rewardHtml = (result.rewards || []).map((r) => {
        if (r.type === "coins") return `\u{1FA99} ${r.amount} \u043C\u043E\u043D\u0435\u0442`;
        if (r.type === "seals") return `\u{1F530} ${r.amount} \u043F\u0435\u0447\u0430\u0442\u044C \u043C\u0430\u0441\u0442\u0435\u0440\u0430`;
        if (r.type === "material") return `\u041C\u0430\u0442\u0435\u0440\u0438\u0430\u043B: ${materialLabel(r.id)}${r.amount > 1 ? ` \xD7${r.amount}` : ""}`;
        if (r.type === "item") return `\u{1F381} ${ITEM_BY_ID[r.id]?.name || r.id}`;
        return "";
      }).filter(Boolean).join("<br>");
      overlay.innerHTML = `
      <div class="card">
        <h2>${rep.victory ? "\u{1F3C6} \u041F\u043E\u0431\u0435\u0434\u0430!" : "\u{1F319} \u0420\u044B\u0446\u0430\u0440\u044C \u0432\u0435\u0440\u043D\u0443\u043B\u0441\u044F \u043E\u0442\u0434\u043E\u0445\u043D\u0443\u0442\u044C"}</h2>
        <div class="muted">
          \u0423\u0440\u043E\u043D\u0430 \u043D\u0430\u043D\u0435\u0441\u0435\u043D\u043E: <b>${rep.dealt}</b> \xB7 \u041F\u043E\u043B\u0443\u0447\u0435\u043D\u043E: <b>${rep.taken}</b> \xB7
          \u0412\u0440\u0430\u0433\u043E\u0432 \u043F\u043E\u0432\u0435\u0440\u0436\u0435\u043D\u043E: <b>${rep.foesDown}/${rep.foesTotal}</b>
        </div>
        ${(rep.alliesStats || []).length > 1 ? `<div class="muted" style="font-size:13px;margin-top:6px">${rep.alliesStats.map((a) => `${a.icon} ${a.name}: ${a.dealt} \u0443\u0440\u043E\u043D\u0430${a.alive ? "" : " (\u043F\u0430\u043B)"}`).join("<br>")}</div>` : ""}
        ${rep.victory && rewardHtml ? `<div class="rewards">${rewardHtml}</div>` : ""}
        ${rep.advice ? `<div class="advice">\u{1F4A1} ${rep.advice}</div>` : ""}
        <div class="actions"></div>
      </div>`;
      const actions = overlay.querySelector(".actions");
      const nextB = rep.victory ? nextBattle(battle.id) : null;
      if (nextB) {
        const nextBtn = document.createElement("button");
        nextBtn.className = "primary";
        nextBtn.textContent = `\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0430\u044F \u0431\u0438\u0442\u0432\u0430 \u2192 ${nextB.name}`;
        nextBtn.addEventListener("click", () => {
          overlay.remove();
          ctx2.go("battle", { id: nextB.id });
        });
        actions.appendChild(nextBtn);
      }
      const toEquip = document.createElement("button");
      toEquip.textContent = "\u{1F392} \u041A \u044D\u043A\u0438\u043F\u0438\u0440\u043E\u0432\u043A\u0435";
      toEquip.addEventListener("click", () => {
        overlay.remove();
        ctx2.go("equip");
      });
      const again = document.createElement("button");
      again.textContent = "\u{1F501} \u0415\u0449\u0451 \u0440\u0430\u0437";
      again.addEventListener("click", () => {
        overlay.remove();
        ctx2.go("battle", { id: battle.id });
      });
      const toList = document.createElement("button");
      if (!nextB) toList.className = "primary";
      toList.textContent = "\u041A \u043F\u043E\u0445\u043E\u0434\u0430\u043C";
      toList.addEventListener("click", () => {
        overlay.remove();
        ctx2.go("battles");
      });
      actions.append(toList, rep.victory ? again : toEquip, rep.victory ? toEquip : again);
      document.body.appendChild(overlay);
    }
    function onKey(ev) {
      if (ev.key === " ") {
        ev.preventDefault();
        if (done) return;
        if (timer) {
          clearTimeout(timer);
          timer = null;
        } else step();
      }
      if (ev.key === "Escape") {
        stop();
        ctx2.go("battles");
      }
    }
    window.addEventListener("keydown", onKey);
    function stop() {
      done = true;
      clearTimeout(timer);
    }
    step();
    return () => {
      stop();
      window.removeEventListener("keydown", onKey);
    };
  }

  // src/ui/tavernView.js
  var KIND_LABEL = {
    companion: "\u2728 \u0421\u043F\u0443\u0442\u043D\u0438\u043A\u0438 (\u0432 \u043E\u0442\u0440\u044F\u0434\u0435 \u0434\u043E 3)",
    pet: "\u{1F43E} \u041F\u0438\u0442\u043E\u043C\u0446\u044B (1 \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0439)",
    merc: "\u2694\uFE0F \u041D\u0430\u0451\u043C\u043D\u0438\u043A\u0438 (\u0432 \u0431\u043E\u044E \u0434\u043E 2)"
  };
  function bonusText(def) {
    const L = {
      hp: "\u0437\u0434\u043E\u0440\u043E\u0432\u044C\u0435",
      attack: "\u0430\u0442\u0430\u043A\u0430",
      armor: "\u0431\u0440\u043E\u043D\u044F",
      speed: "\u0441\u043A\u043E\u0440\u043E\u0441\u0442\u044C",
      crit: "\u043A\u0440\u0438\u0442",
      dodge: "\u0443\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u0435",
      goldFind: "\u043C\u043E\u043D\u0435\u0442\u044B",
      itemFind: "\u043D\u0430\u0445\u043E\u0434\u043A\u0438",
      materialsFind: "\u043C\u0430\u0442\u0435\u0440\u0438\u0430\u043B\u044B"
    };
    const PERCENT = ["crit", "dodge", "goldFind", "itemFind", "materialsFind"];
    const parts = [];
    for (const [k, v] of Object.entries(def.bonus || {})) {
      if (PERCENT.includes(k)) parts.push(`${L[k]} +${Math.round(v * 100)}%`);
      else parts.push(`${L[k] || k} +${v}`);
    }
    if (def.hp) parts.push(`${def.hp}\u2764 ${def.attack}\u2694 ${def.armor}\u{1F6E1} ${def.speed}\u26A1`);
    return parts.join(", ");
  }
  function renderTavern(container, ctx2) {
    const { state: state2 } = ctx2;
    const head = document.createElement("div");
    head.className = "panel";
    head.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
    <h2 style="margin:0">\u0422\u0430\u0432\u0435\u0440\u043D\u0430 \u0438 \u043A\u043E\u043D\u044E\u0448\u043D\u044F</h2></div>
    <div class="muted">\u041E\u0447\u0430\u0433, \u043A\u0440\u0443\u0436\u043A\u0438, \u0442\u0438\u0445\u0438\u0439 \u0431\u0430\u0440\u0434. \u0417\u0434\u0435\u0441\u044C \u0440\u044B\u0446\u0430\u0440\u044C \u043D\u0430\u0445\u043E\u0434\u0438\u0442 \u0434\u0440\u0443\u0437\u0435\u0439 \u0438 \u043F\u043E\u043C\u043E\u0449\u043D\u0438\u043A\u043E\u0432.</div>`;
    const back = document.createElement("button");
    back.className = "ghost small";
    back.textContent = "\u2190 \u041D\u0430\u0437\u0430\u0434";
    back.addEventListener("click", () => ctx2.go("hub"));
    head.firstElementChild.appendChild(back);
    container.appendChild(head);
    container.appendChild(quickNav(ctx2, [
      { icon: "\u{1F3E0}", label: "\u0412 \u043B\u0430\u0432\u043A\u0443", screen: "hub" }
    ]));
    const squadPanel = document.createElement("div");
    squadPanel.className = "panel";
    const petDef = state2.pet ? crewStock(state2).find((c) => c.id === state2.pet) : null;
    squadPanel.innerHTML = `<h3>\u041E\u0442\u0440\u044F\u0434 \u0441\u0435\u0439\u0447\u0430\u0441</h3>
    <div>\u0421\u043F\u0443\u0442\u043D\u0438\u043A\u0438: ${state2.squadCompanions.length ? state2.squadCompanions.map((id) => `<span class="badge">${iconOf(state2, id)}</span>`).join(" ") : '<span class="muted">\u043D\u0438\u043A\u043E\u0433\u043E</span>'}</div>
    <div class="mt">\u041D\u0430\u0451\u043C\u043D\u0438\u043A\u0438: ${state2.squadMercs.length ? state2.squadMercs.map((id) => `<span class="badge">${iconOf(state2, id)}</span>`).join(" ") : '<span class="muted">\u043D\u0438\u043A\u043E\u0433\u043E</span>'}</div>
    <div class="mt">\u041F\u0438\u0442\u043E\u043C\u0435\u0446: ${petDef ? `<span class="badge">${petDef.icon} ${petDef.name}</span>` : '<span class="muted">\u043D\u0435\u0442</span>'}</div>`;
    container.appendChild(squadPanel);
    const stock = crewStock(state2);
    for (const kind of ["companion", "pet", "merc"]) {
      const panel = document.createElement("div");
      panel.className = "panel";
      panel.innerHTML = `<h3>${KIND_LABEL[kind]}</h3>`;
      const list = document.createElement("div");
      list.className = "list";
      for (const def of stock.filter((c) => c.kind === kind)) {
        const active = kind === "companion" && state2.squadCompanions.includes(def.id) || kind === "merc" && state2.squadMercs.includes(def.id) || kind === "pet" && state2.pet === def.id;
        const row = document.createElement("div");
        row.className = "row" + (active ? " done" : "");
        const price = def.currency === "seals" ? `\u{1F530} ${def.price}` : `\u{1FA99} ${def.price}`;
        row.innerHTML = `
        <span class="icon">${def.icon}</span>
        <span class="grow">
          <div class="name">${def.name}${def.race ? ` <span class="badge">${def.race} \xB7 ${def.role}</span>` : ""}</div>
          <div class="desc">${def.description} ${bonusText(def) ? `\xB7 ${bonusText(def)}` : ""}</div>
        </span>`;
        const btn = document.createElement("button");
        btn.className = "small" + (active ? " ghost" : "");
        if (!def.hired) {
          btn.innerHTML = `\u041D\u0430\u043D\u044F\u0442\u044C \xB7 ${price}`;
          btn.disabled = def.currency === "seals" ? state2.seals < def.price : state2.coins < def.price;
          btn.addEventListener("click", () => {
            const r = hireCrew(state2, def.id, kind);
            if (r.ok) {
              ctx2.toast(`${def.name} \u0442\u0435\u043F\u0435\u0440\u044C \u0441 \u0442\u043E\u0431\u043E\u0439!`);
              ctx2.save();
              rerender();
            } else ctx2.toast(r.error);
          });
        } else {
          btn.textContent = active ? "\u0423\u0431\u0440\u0430\u0442\u044C \u0438\u0437 \u043E\u0442\u0440\u044F\u0434\u0430" : "\u0412 \u043E\u0442\u0440\u044F\u0434";
          btn.addEventListener("click", () => {
            const fn = kind === "companion" ? toggleCompanion : kind === "merc" ? toggleMerc : setPet;
            const r = fn(state2, def.id);
            if (r.ok) {
              ctx2.save();
              rerender();
            } else ctx2.toast(r.error);
          });
        }
        row.appendChild(btn);
        list.appendChild(row);
      }
      panel.appendChild(list);
      container.appendChild(panel);
    }
    function iconOf(st, id) {
      const c = crewStock(st).find((x) => x.id === id);
      return c ? `${c.icon} ${c.name}` : id;
    }
    function rerender() {
      container.innerHTML = "";
      renderTavern(container, ctx2);
    }
  }

  // src/ui/editorView.js
  var CELL4 = 56;
  var PALETTE = [
    { type: "source", icon: "\u2728", label: "\u0421\u0432\u0435\u0442\u043B\u044F\u0447\u043E\u043A (\u043F\u043E\u0432\u0442\u043E\u0440\u043D\u044B\u0439 \u0442\u0430\u043F \u2014 \u043F\u043E\u0432\u0435\u0440\u043D\u0443\u0442\u044C)" },
    { type: "mirror", icon: "\u{1FA9E}", label: "\u0417\u0435\u0440\u043A\u0430\u043B\u043E (\u0442\u0430\u043F \u2014 \u0441\u043C\u0435\u043D\u0438\u0442\u044C \u043E\u0440\u0438\u0435\u043D\u0442\u0430\u0446\u0438\u044E)" },
    { type: "lantern", icon: "\u{1F3EE}", label: "\u0424\u043E\u043D\u0430\u0440\u044C" },
    { type: "moth", icon: "\u{1F98B}", label: "\u041C\u043E\u043B\u044C" },
    { type: "wall", icon: "\u{1F311}", label: "\u0422\u0435\u043D\u044C" },
    { type: "erase", icon: "\u{1F9F9}", label: "\u0421\u0442\u0435\u0440\u0435\u0442\u044C" }
  ];
  function renderWorkshop(container, ctx2) {
    const { state: state2 } = ctx2;
    container.appendChild(header(ctx2, "\u041C\u0430\u0441\u0442\u0435\u0440\u0441\u043A\u0430\u044F \u0443\u0440\u043E\u0432\u043D\u0435\u0439", "\u0421\u043E\u0437\u0434\u0430\u0432\u0430\u0439 \u0441\u0432\u043E\u0438 \u0437\u0430\u0433\u0430\u0434\u043A\u0438 \u2014 \u0440\u0435\u0448\u0430\u0442\u0435\u043B\u044C \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442 \u0438\u0445 \u0447\u0435\u0441\u0442\u043D\u043E\u0441\u0442\u044C"));
    const newBtn = document.createElement("button");
    newBtn.className = "primary";
    newBtn.textContent = "\u2795 \u041D\u043E\u0432\u044B\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C";
    newBtn.addEventListener("click", () => ctx2.go("editor", {}));
    const panel = document.createElement("div");
    panel.className = "panel";
    panel.appendChild(newBtn);
    container.appendChild(panel);
    const list = document.createElement("div");
    list.className = "list";
    if (state2.customPuzzles.length === 0) {
      list.innerHTML = '<div class="muted panel">\u041F\u043E\u043A\u0430 \u043F\u0443\u0441\u0442\u043E. \u041D\u0430\u0436\u043C\u0438 \xAB\u041D\u043E\u0432\u044B\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C\xBB \u0438 \u0441\u043E\u0431\u0435\u0440\u0438 \u0441\u0432\u043E\u044E \u0437\u0430\u0433\u0430\u0434\u043A\u0443!</div>';
    }
    for (const p of state2.customPuzzles) {
      const row = document.createElement("div");
      row.className = "row";
      const done = !!state2.puzzlesDone[p.id];
      row.innerHTML = `
      <span class="icon">${done ? "\u{1F3EE}" : "\u{1F6E0}\uFE0F"}</span>
      <span class="grow">
        <div class="name">${p.name}</div>
        <div class="desc">\u0421\u0435\u0442\u043A\u0430 ${p.grid[0]}\xD7${p.grid[1]} \xB7 \u043E\u0431\u044A\u0435\u043A\u0442\u043E\u0432: ${p.objects.length}</div>
      </span>`;
      const play = document.createElement("button");
      play.className = "small";
      play.textContent = "\u0418\u0433\u0440\u0430\u0442\u044C";
      play.addEventListener("click", () => ctx2.go("puzzle", { id: p.id }));
      const edit = document.createElement("button");
      edit.className = "small";
      edit.textContent = "\u041F\u0440\u0430\u0432\u0438\u0442\u044C";
      edit.addEventListener("click", () => ctx2.go("editor", { id: p.id }));
      const del = document.createElement("button");
      del.className = "small ghost";
      del.textContent = "\u{1F5D1}\uFE0F";
      del.addEventListener("click", () => {
        if (confirm(`\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0443\u0440\u043E\u0432\u0435\u043D\u044C \xAB${p.name}\xBB?`)) {
          state2.customPuzzles = state2.customPuzzles.filter((x) => x.id !== p.id);
          ctx2.save();
          rerender();
        }
      });
      row.append(play, edit, del);
      list.appendChild(row);
    }
    container.appendChild(list);
    function rerender() {
      container.innerHTML = "";
      renderWorkshop(container, ctx2);
    }
  }
  function renderEditor(container, ctx2, params) {
    const { state: state2 } = ctx2;
    const existing = params.id ? state2.customPuzzles.find((p) => p.id === params.id) : null;
    let name = existing?.name || "\u041C\u043E\u044F \u0437\u0430\u0433\u0430\u0434\u043A\u0430";
    let gw = existing?.grid?.[0] || 6;
    let gh = existing?.grid?.[1] || 6;
    let objects = existing ? existing.objects.map((o) => ({ ...o, pos: [...o.pos] })) : [];
    let tool = "mirror";
    container.appendChild(header(ctx2, existing ? "\u041F\u0440\u0430\u0432\u043A\u0430 \u0443\u0440\u043E\u0432\u043D\u044F" : "\u041D\u043E\u0432\u044B\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C", "\u041C\u0435\u0445\u0430\u043D\u0438\u043A\u0430 \xAB\u0421\u0432\u0435\u0442 \u0438 \u0444\u043E\u043D\u0430\u0440\u0438\u043A\u0438\xBB", "workshop"));
    const settings = document.createElement("div");
    settings.className = "panel";
    settings.style.display = "flex";
    settings.style.flexWrap = "wrap";
    settings.style.gap = "10px";
    settings.style.alignItems = "center";
    const nameInput = document.createElement("input");
    nameInput.value = name;
    nameInput.placeholder = "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0443\u0440\u043E\u0432\u043D\u044F";
    nameInput.style.cssText = "font:inherit;padding:8px 12px;border-radius:10px;border:2px solid #6b553a;background:#241b12;color:#f3e6cf;min-width:180px";
    nameInput.addEventListener("input", () => {
      name = nameInput.value;
    });
    const mkSize = (label, val, fn) => {
      const wrap = document.createElement("span");
      wrap.className = "muted";
      wrap.textContent = `${label}: `;
      const sel = document.createElement("select");
      sel.style.cssText = "font:inherit;padding:6px;border-radius:8px;background:#241b12;color:#f3e6cf;border:2px solid #6b553a";
      for (let i = 4; i <= 10; i++) {
        const o = document.createElement("option");
        o.value = i;
        o.textContent = i;
        if (i === val) o.selected = true;
        sel.appendChild(o);
      }
      sel.addEventListener("change", () => fn(Number(sel.value)));
      wrap.appendChild(sel);
      return wrap;
    };
    settings.append(
      nameInput,
      mkSize("\u0428\u0438\u0440\u0438\u043D\u0430", gw, (v) => {
        gw = v;
        clip();
        draw();
      }),
      mkSize("\u0412\u044B\u0441\u043E\u0442\u0430", gh, (v) => {
        gh = v;
        clip();
        draw();
      })
    );
    container.appendChild(settings);
    const palette = document.createElement("div");
    palette.className = "panel";
    palette.style.display = "flex";
    palette.style.flexWrap = "wrap";
    palette.style.gap = "8px";
    for (const p of PALETTE) {
      const b = document.createElement("button");
      b.className = "small" + (tool === p.type ? " primary" : "");
      b.innerHTML = `${p.icon} ${p.label.split(" (")[0]}`;
      b.title = p.label;
      b.addEventListener("click", () => {
        tool = p.type;
        palette.querySelectorAll("button").forEach((x) => x.classList.remove("primary"));
        b.classList.add("primary");
      });
      palette.appendChild(b);
    }
    container.appendChild(palette);
    const canvasBox = document.createElement("div");
    canvasBox.className = "puzzle-canvas-box";
    canvasBox.style.display = "inline-block";
    const canvas = document.createElement("canvas");
    canvas.className = "game";
    canvasBox.appendChild(canvas);
    container.appendChild(canvasBox);
    const actions = document.createElement("div");
    actions.className = "panel mt";
    actions.style.display = "flex";
    actions.style.flexWrap = "wrap";
    actions.style.gap = "8px";
    const checkBtn = document.createElement("button");
    checkBtn.textContent = "\u{1F50D} \u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0440\u0435\u0448\u0430\u0442\u0435\u043B\u0435\u043C";
    const saveBtn = document.createElement("button");
    saveBtn.className = "primary";
    saveBtn.textContent = "\u{1F4BE} \u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0432 \u043C\u0430\u0441\u0442\u0435\u0440\u0441\u043A\u0443\u044E";
    const exportBtn = document.createElement("button");
    exportBtn.textContent = "\u{1F4E4} \u042D\u043A\u0441\u043F\u043E\u0440\u0442 JSON";
    const importBtn = document.createElement("button");
    importBtn.textContent = "\u{1F4E5} \u0418\u043C\u043F\u043E\u0440\u0442 JSON";
    actions.append(checkBtn, saveBtn, exportBtn, importBtn);
    container.appendChild(actions);
    const resultBox = document.createElement("div");
    container.appendChild(resultBox);
    function currentLevel() {
      return {
        id: existing?.id || `custom_${Date.now()}`,
        world: "custom",
        name: name || "\u0411\u0435\u0437 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044F",
        difficulty: 1,
        grid: [gw, gh],
        objects: objects.map((o) => ({ ...o })),
        rewards: [{ type: "coins", amount: 15 }],
        intro: "\u0423\u0440\u043E\u0432\u0435\u043D\u044C \u0438\u0437 \u043C\u0430\u0441\u0442\u0435\u0440\u0441\u043A\u043E\u0439."
      };
    }
    function clip() {
      objects = objects.filter((o) => o.pos[0] < gw && o.pos[1] < gh);
    }
    function validate() {
      const level = currentLevel();
      const problems = [];
      if (!level.objects.some((o) => o.type === "source")) problems.push("\u041D\u0435\u0442 \u0441\u0432\u0435\u0442\u043B\u044F\u0447\u043A\u0430 \u2014 \u0441\u0432\u0435\u0442\u0443 \u043D\u0435\u043E\u0442\u043A\u0443\u0434\u0430 \u0432\u0437\u044F\u0442\u044C\u0441\u044F.");
      if (!level.objects.some((o) => o.type === "lantern")) problems.push("\u041D\u0435\u0442 \u043D\u0438 \u043E\u0434\u043D\u043E\u0433\u043E \u0444\u043E\u043D\u0430\u0440\u044F \u2014 \u043D\u0435\u043A\u043E\u0433\u043E \u0437\u0430\u0436\u0438\u0433\u0430\u0442\u044C.");
      const v = validateLevel(level);
      resultBox.innerHTML = "";
      const verdict = problems.length === 0 && v.solvable ? `\u2705 \u0423\u0440\u043E\u0432\u0435\u043D\u044C \u0440\u0435\u0448\u0430\u0435\u043C! \u041D\u0430\u0439\u0434\u0435\u043D\u043E \u0440\u0435\u0448\u0435\u043D\u0438\u0439: <b>${v.solutionCount}</b>.` : "\u274C \u0423\u0440\u043E\u0432\u0435\u043D\u044C \u043F\u043E\u043A\u0430 \u043D\u0435 \u0433\u043E\u0442\u043E\u0432.";
      const details = [
        ...problems.map((p) => `\u26A0\uFE0F ${p}`),
        ...!v.solvable && problems.length === 0 ? ["\u26A0\uFE0F \u0420\u0435\u0448\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u043D\u0430\u0448\u0451\u043B \u043D\u0438 \u043E\u0434\u043D\u043E\u0439 \u043A\u043E\u043C\u0431\u0438\u043D\u0430\u0446\u0438\u0438 \u043F\u043E\u0432\u043E\u0440\u043E\u0442\u043E\u0432 \u0437\u0435\u0440\u043A\u0430\u043B."] : []
      ].join("<br>");
      const div = document.createElement("div");
      div.className = "panel mt";
      div.innerHTML = `<div>${verdict}</div>${details ? `<div class="warn mt" style="font-size:14px">${details}</div>` : ""}`;
      resultBox.appendChild(div);
      return problems.length === 0 && v.solvable;
    }
    checkBtn.addEventListener("click", () => {
      ctx2.sfx?.("hint");
      validate();
    });
    saveBtn.addEventListener("click", () => {
      if (!validate()) {
        ctx2.toast("\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0441\u0434\u0435\u043B\u0430\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C \u0440\u0435\u0448\u0430\u0435\u043C\u044B\u043C.");
        return;
      }
      const level = currentLevel();
      if (existing) {
        const i = state2.customPuzzles.findIndex((p) => p.id === existing.id);
        state2.customPuzzles[i] = level;
      } else {
        state2.customPuzzles.push(level);
      }
      ctx2.save();
      ctx2.sfx?.("success");
      ctx2.toast(`\xAB${level.name}\xBB \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D \u0432 \u043C\u0430\u0441\u0442\u0435\u0440\u0441\u043A\u043E\u0439!`);
      ctx2.go("workshop");
    });
    exportBtn.addEventListener("click", async () => {
      const json = JSON.stringify(currentLevel(), null, 2);
      try {
        await navigator.clipboard.writeText(json);
        ctx2.toast("JSON \u0443\u0440\u043E\u0432\u043D\u044F \u0441\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D \u0432 \u0431\u0443\u0444\u0435\u0440 \u043E\u0431\u043C\u0435\u043D\u0430.");
      } catch {
        showOverlay(ctx2, {
          title: "\u{1F4E4} \u042D\u043A\u0441\u043F\u043E\u0440\u0442",
          subtitle: "\u0421\u043A\u043E\u043F\u0438\u0440\u0443\u0439 \u0432\u0440\u0443\u0447\u043D\u0443\u044E:",
          rewards: [],
          buttons: [{ label: "\u0417\u0430\u043A\u0440\u044B\u0442\u044C", primary: true, onClick: () => {
          } }]
        });
        const ta = document.createElement("textarea");
        ta.value = json;
        ta.style.cssText = "width:100%;height:160px;background:#241b12;color:#f3e6cf;border-radius:8px;margin-top:10px";
        document.querySelector(".overlay .card")?.appendChild(ta);
      }
    });
    importBtn.addEventListener("click", () => {
      const overlay = showOverlay(ctx2, {
        title: "\u{1F4E5} \u0418\u043C\u043F\u043E\u0440\u0442 \u0443\u0440\u043E\u0432\u043D\u044F",
        subtitle: "\u0412\u0441\u0442\u0430\u0432\u044C JSON \u0443\u0440\u043E\u0432\u043D\u044F:",
        rewards: [],
        buttons: []
      });
      const card = overlay.querySelector(".card");
      const ta = document.createElement("textarea");
      ta.style.cssText = "width:100%;height:160px;background:#241b12;color:#f3e6cf;border-radius:8px;margin:10px 0";
      const ok = document.createElement("button");
      ok.className = "primary";
      ok.textContent = "\u0418\u043C\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C";
      ok.addEventListener("click", () => {
        try {
          const data = JSON.parse(ta.value);
          if (!data.grid || !Array.isArray(data.objects)) throw new Error("\u043D\u0435\u0442 grid/objects");
          name = data.name || name;
          [gw, gh] = data.grid;
          objects = data.objects.map((o) => ({ ...o }));
          nameInput.value = name;
          overlay.remove();
          ctx2.toast("\u0423\u0440\u043E\u0432\u0435\u043D\u044C \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D \u0432 \u0440\u0435\u0434\u0430\u043A\u0442\u043E\u0440. \u041F\u0440\u043E\u0432\u0435\u0440\u044C \u0435\u0433\u043E \u0440\u0435\u0448\u0430\u0442\u0435\u043B\u0435\u043C!");
          clip();
          draw();
        } catch (e) {
          ctx2.toast(`\u041D\u0435 \u043F\u043E\u0445\u043E\u0436\u0435 \u043D\u0430 \u0443\u0440\u043E\u0432\u0435\u043D\u044C: ${e.message}`);
        }
      });
      const cancel = document.createElement("button");
      cancel.textContent = "\u041E\u0442\u043C\u0435\u043D\u0430";
      cancel.addEventListener("click", () => overlay.remove());
      card.append(ta, ok, " ", cancel);
    });
    function onTap(ev) {
      const rect = canvas.getBoundingClientRect();
      const scale = canvas.width / 1 / rect.width;
      const x = Math.floor((ev.clientX - rect.left) * scale / CELL4);
      const y = Math.floor((ev.clientY - rect.top) * scale / CELL4);
      if (x < 0 || y < 0 || x >= gw || y >= gh) return;
      const idx = objects.findIndex((o) => o.pos[0] === x && o.pos[1] === y);
      if (tool === "erase") {
        if (idx >= 0) objects.splice(idx, 1);
      } else if (idx >= 0) {
        const o = objects[idx];
        if (o.type === "source") o.dir = ((o.dir ?? 1) + 1) % 4;
        else if (o.type === "mirror") o.orient = o.orient === 0 ? 1 : 0;
      } else if (tool === "source") {
        objects.push({ type: "source", pos: [x, y], dir: 1 });
      } else if (tool === "mirror") {
        objects.push({ type: "mirror", pos: [x, y], orient: 0 });
      } else {
        objects.push({ type: tool, pos: [x, y] });
      }
      ctx2.sfx?.("tap");
      draw();
    }
    canvas.addEventListener("pointerdown", onTap);
    function draw() {
      const dpr = 1;
      canvas.width = gw * CELL4;
      canvas.height = gh * CELL4;
      canvas.style.width = `${gw * CELL4}px`;
      canvas.style.height = `${gh * CELL4}px`;
      const g = canvas.getContext("2d");
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (let y = 0; y < gh; y++) {
        for (let x = 0; x < gw; x++) {
          g.fillStyle = (x + y) % 2 === 0 ? "#3a5232" : "#425c38";
          g.fillRect(x * CELL4, y * CELL4, CELL4, CELL4);
        }
      }
      const preview = createPuzzle(currentLevel());
      const { beams } = traceLight(preview);
      g.lineCap = "round";
      g.strokeStyle = "rgba(255, 226, 138, 0.5)";
      g.lineWidth = 4;
      for (const b of beams) {
        g.beginPath();
        g.moveTo(b.from[0] * CELL4 + CELL4 / 2, b.from[1] * CELL4 + CELL4 / 2);
        g.lineTo(b.to[0] * CELL4 + CELL4 / 2, b.to[1] * CELL4 + CELL4 / 2);
        g.stroke();
      }
      for (const o of objects) {
        const cx = o.pos[0] * CELL4 + CELL4 / 2;
        const cy = o.pos[1] * CELL4 + CELL4 / 2;
        const emoji = (e, size = CELL4 * 0.6) => {
          g.font = `${size}px "Segoe UI Emoji", sans-serif`;
          g.textAlign = "center";
          g.textBaseline = "middle";
          g.fillText(e, cx, cy);
        };
        if (o.type === "source") {
          emoji("\u2728");
          const dirs = ["\u2191", "\u2192", "\u2193", "\u2190"];
          g.fillStyle = "#fff2be";
          g.font = `bold ${CELL4 * 0.3}px sans-serif`;
          g.fillText(dirs[o.dir ?? 1], cx + CELL4 * 0.28, cy - CELL4 * 0.28);
        } else if (o.type === "mirror") {
          g.save();
          g.translate(cx, cy);
          g.rotate(o.orient === 0 ? Math.PI / 4 : -Math.PI / 4);
          g.fillStyle = "#cfe8ff";
          g.fillRect(-CELL4 * 0.3, -3, CELL4 * 0.6, 5);
          g.restore();
          emoji("\u{1FA9E}", CELL4 * 0.3);
        } else if (o.type === "lantern") emoji("\u{1F3EE}");
        else if (o.type === "moth") emoji("\u{1F98B}");
        else if (o.type === "wall") emoji("\u{1F311}");
      }
    }
    draw();
    return () => canvas.removeEventListener("pointerdown", onTap);
  }

  // src/ui/craftView.js
  function renderCraft(container, ctx2) {
    const { state: state2 } = ctx2;
    container.appendChild(header(
      ctx2,
      "\u041A\u0443\u0437\u043D\u0438\u0446\u0430 \u0438 \u043A\u043E\u0442\u0451\u043B",
      "\u041C\u0430\u0442\u0435\u0440\u0438\u0430\u043B\u044B \u0441 \u043F\u043E\u0445\u043E\u0434\u043E\u0432 \u0441\u0442\u0430\u043D\u043E\u0432\u044F\u0442\u0441\u044F \u0437\u0435\u043B\u044C\u044F\u043C\u0438 \u0438 \u0441\u043D\u0430\u0440\u044F\u0436\u0435\u043D\u0438\u0435\u043C. \u041D\u0430\u043A\u043E\u0432\u0430\u043B\u044C\u043D\u044F \u0433\u043E\u0440\u044F\u0447\u0430\u044F, \u043A\u043E\u0442\u0451\u043B \u0431\u0443\u043B\u044C\u043A\u0430\u0435\u0442."
    ));
    container.appendChild(quickNav(ctx2, [
      { icon: "\u{1F3E0}", label: "\u0412 \u043B\u0430\u0432\u043A\u0443", screen: "hub" }
    ]));
    const layout = document.createElement("div");
    layout.style.cssText = "display:flex;flex-wrap:wrap;gap:14px;align-items:flex-start";
    const matPanel = document.createElement("div");
    matPanel.className = "panel";
    matPanel.style.cssText = "flex:1;min-width:260px";
    matPanel.innerHTML = "<h3>\u0421\u043A\u043B\u0430\u0434 \u043C\u0430\u0442\u0435\u0440\u0438\u0430\u043B\u043E\u0432</h3>";
    const matList = document.createElement("div");
    matList.className = "list";
    const owned = MATERIALS.filter((m) => (state2.materials[m.id] || 0) > 0);
    if (owned.length === 0) {
      matList.innerHTML = '<div class="muted">\u041F\u0443\u0441\u0442\u043E. \u0420\u044B\u0446\u0430\u0440\u044C \u043F\u0440\u0438\u043D\u043E\u0441\u0438\u0442 \u043C\u0430\u0442\u0435\u0440\u0438\u0430\u043B\u044B \u0438\u0437 \u043F\u043E\u0445\u043E\u0434\u043E\u0432 \u2014 \u0430 \u0435\u0437\u0434\u043E\u0432\u043E\u0439 \u043F\u0438\u0442\u043E\u043C\u0435\u0446 \u0438\u0445 \u0443\u0434\u0432\u0430\u0438\u0432\u0430\u0435\u0442.</div>';
    }
    for (const m of owned) {
      const row = document.createElement("div");
      row.className = "row";
      row.title = m.description;
      row.innerHTML = `
      <span class="icon">${m.icon}</span>
      <span class="grow"><div class="name">${m.name}</div><div class="desc">${m.description}</div></span>
      <span class="price">\xD7${state2.materials[m.id]}</span>`;
      matList.appendChild(row);
    }
    matPanel.appendChild(matList);
    layout.appendChild(matPanel);
    const rcpPanel = document.createElement("div");
    rcpPanel.className = "panel";
    rcpPanel.style.cssText = "flex:2;min-width:320px";
    rcpPanel.innerHTML = "<h3>\u0420\u0435\u0446\u0435\u043F\u0442\u044B</h3>";
    const rcpList = document.createElement("div");
    rcpList.className = "list";
    const recipes = recipeList(state2);
    if (recipes.length === 0) {
      rcpList.innerHTML = '<div class="muted">\u0420\u0435\u0446\u0435\u043F\u0442\u044B \u043F\u043E\u044F\u0432\u044F\u0442\u0441\u044F \u043F\u043E\u0441\u043B\u0435 \u043F\u0435\u0440\u0432\u044B\u0445 \u043F\u043E\u0431\u0435\u0434 \u0440\u044B\u0446\u0430\u0440\u044F.</div>';
    }
    for (const r of recipes) {
      const item2 = ITEM_BY_ID[r.result.itemId];
      const row = document.createElement("div");
      row.className = "row";
      const costs = Object.entries(r.materials).map(([matId, need]) => {
        const have = state2.materials[matId] || 0;
        const short = have < need;
        return `<span style="${short ? "color:var(--danger)" : ""}">${materialLabel(matId)} ${have}/${need}</span>`;
      }).join(" \xB7 ");
      const coinCost = r.coins ? ` \xB7 \u{1FA99} ${r.coins}` : "";
      row.innerHTML = `
      <span class="icon">${itemEmoji(item2)}</span>
      <span class="grow">
        <div class="name">${r.name}</div>
        <div class="desc">${describeItem(item2) || item2.description}</div>
        <div class="desc">${costs}${coinCost}</div>
      </span>`;
      const btn = document.createElement("button");
      btn.className = "small" + (r.canCraft ? " primary" : "");
      btn.textContent = "\u0421\u0434\u0435\u043B\u0430\u0442\u044C";
      btn.disabled = !r.canCraft;
      btn.title = r.note;
      btn.addEventListener("click", () => {
        const res = craft(state2, r.id);
        if (res.ok) {
          ctx2.toast(`${r.name} \u2014 \u0433\u043E\u0442\u043E\u0432\u043E! \u041B\u0435\u0436\u0438\u0442 \u0432 \u0441\u0443\u043D\u0434\u0443\u043A\u0435.`);
          ctx2.sfx?.("success");
          ctx2.save();
          rerender();
        } else {
          ctx2.toast(res.error);
        }
      });
      row.appendChild(btn);
      rcpList.appendChild(row);
    }
    rcpPanel.appendChild(rcpList);
    layout.appendChild(rcpPanel);
    container.appendChild(layout);
    function rerender() {
      container.innerHTML = "";
      renderCraft(container, ctx2);
    }
  }

  // src/ui/app.js
  var screenEl = document.getElementById("screen");
  var toastEl = document.getElementById("toast");
  var state = loadGame() || newGame();
  function save() {
    saveGame(state);
    updateWallet();
  }
  function updateWallet() {
    document.getElementById("wallet-coins").textContent = `\u{1FA99} ${state.coins}`;
    document.getElementById("wallet-seals").textContent = `\u{1F530} ${state.seals}`;
  }
  var toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
  }
  var routes = {
    hub: (c, p) => renderHub(c, ctx, p),
    puzzles: (c, p) => renderPuzzleList(c, ctx, p),
    puzzle: (c, p) => renderPuzzle(c, ctx, p),
    equip: (c, p) => renderEquip(c, ctx, p),
    shop: (c, p) => renderShop(c, ctx, p),
    battles: (c, p) => renderBattleList(c, ctx, p),
    battle: (c, p) => renderBattle(c, ctx, p),
    tavern: (c, p) => renderTavern(c, ctx, p),
    workshop: (c, p) => renderWorkshop(c, ctx, p),
    editor: (c, p) => renderEditor(c, ctx, p),
    craft: (c, p) => renderCraft(c, ctx, p)
  };
  var currentCleanup = null;
  function go(name, params = {}) {
    if (currentCleanup) {
      currentCleanup();
      currentCleanup = null;
    }
    screenEl.innerHTML = "";
    screenEl.classList.remove("screen-enter");
    void screenEl.offsetWidth;
    screenEl.classList.add("screen-enter");
    const route = routes[name] || routes.hub;
    currentCleanup = route(screenEl, params) || null;
    window.scrollTo(0, 0);
  }
  function newGameConfirm() {
    if (confirm("\u041D\u0430\u0447\u0430\u0442\u044C \u043D\u043E\u0432\u0443\u044E \u0438\u0433\u0440\u0443? \u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441 \u0442\u0435\u043A\u0443\u0449\u0435\u0439 \u043B\u0430\u0432\u043A\u0438 \u0431\u0443\u0434\u0435\u0442 \u0441\u0442\u0451\u0440\u0442.")) {
      state = newGame();
      save();
      go("hub");
      toast("\u041D\u043E\u0432\u0430\u044F \u043B\u0430\u0432\u043A\u0430 \u043E\u0442\u043A\u0440\u044B\u0442\u0430. \u0414\u043E\u0431\u0440\u043E \u043F\u043E\u0436\u0430\u043B\u043E\u0432\u0430\u0442\u044C, \u0445\u043E\u0437\u044F\u0438\u043D!");
    }
  }
  var ctx = {
    get state() {
      return state;
    },
    save,
    go,
    toast,
    newGameConfirm,
    sfx
  };
  initSound();
  var spiderTrack = document.createElement("div");
  spiderTrack.id = "spidertrack";
  spiderTrack.innerHTML = '<span class="thread"></span><div class="mover"><span class="bug">\u{1F577}\uFE0F</span></div>';
  document.body.appendChild(spiderTrack);
  var spiderThread = spiderTrack.querySelector(".thread");
  var spiderMover = spiderTrack.querySelector(".mover");
  var spiderBug = spiderTrack.querySelector(".bug");
  function scrollInfo() {
    const docH = document.documentElement.scrollHeight || 0;
    const viewH = window.innerHeight || 0;
    const max = Math.max(0, docH - viewH);
    return { docH, viewH, max, ratio: max > 0 ? Math.min(1, Math.max(0, (window.scrollY || 0) / max)) : 0 };
  }
  var BUG_H = 34;
  var targetY = 0;
  var shownY = 0;
  var spiderRaf = null;
  function computeTargetY() {
    const { viewH, ratio } = scrollInfo();
    return ratio * Math.max(0, viewH - BUG_H - 8) + 4;
  }
  function renderSpider() {
    const y = Math.max(0, Math.min(shownY, (window.innerHeight || 600) - BUG_H));
    spiderMover.style.transform = `translateY(${y}px)`;
    spiderThread.style.height = `${Math.max(0, y + 8)}px`;
  }
  function spiderLoop() {
    shownY += (targetY - shownY) * 0.22;
    if (Math.abs(targetY - shownY) < 0.4) shownY = targetY;
    renderSpider();
    if (shownY !== targetY) {
      spiderRaf = raf(spiderLoop);
    } else {
      spiderRaf = null;
    }
  }
  function kickSpider() {
    const { docH, viewH } = scrollInfo();
    if (docH <= viewH + 40) {
      spiderTrack.style.display = "none";
      return;
    }
    spiderTrack.style.display = "block";
    targetY = computeTargetY();
    if (!spiderRaf) spiderRaf = raf(spiderLoop);
  }
  function scrollToRatio(ratio, smooth = true) {
    const { max } = scrollInfo();
    window.scrollTo({ top: Math.max(0, Math.min(1, ratio)) * max, behavior: smooth ? "smooth" : "auto" });
  }
  var dragging = false;
  spiderBug.addEventListener("pointerdown", (ev) => {
    dragging = true;
    spiderTrack.classList.add("dragging");
    spiderBug.setPointerCapture?.(ev.pointerId);
    ev.preventDefault();
  });
  window.addEventListener("pointermove", (ev) => {
    if (!dragging) return;
    const { viewH } = scrollInfo();
    const ratio = (ev.clientY - 20) / Math.max(1, viewH - BUG_H - 24);
    scrollToRatio(ratio, false);
    shownY = targetY = Math.max(4, Math.min(ev.clientY - 12, viewH - BUG_H));
    renderSpider();
  });
  window.addEventListener("pointerup", () => {
    dragging = false;
    spiderTrack.classList.remove("dragging");
    kickSpider();
  });
  spiderTrack.addEventListener("pointerdown", (ev) => {
    if (ev.target === spiderBug || dragging) return;
    const { viewH } = scrollInfo();
    scrollToRatio((ev.clientY - 20) / Math.max(1, viewH - BUG_H - 24), true);
  });
  var raf = window.requestAnimationFrame?.bind(window) || ((f) => setTimeout(f, 16));
  kickSpider();
  window.addEventListener("scroll", () => {
    if (!dragging) kickSpider();
  });
  window.addEventListener("resize", () => {
    targetY = computeTargetY();
    shownY = targetY;
    renderSpider();
    kickSpider();
  });
  var spiderTimer = setInterval(() => {
    const { ratio } = scrollInfo();
    if (ratio > 0.985) {
      spiderTrack.classList.add("boing");
      setTimeout(() => spiderTrack.classList.remove("boing"), 550);
    }
    kickSpider();
  }, 700);
  spiderTimer.unref?.();
  updateWallet();
  go("hub");
})();
