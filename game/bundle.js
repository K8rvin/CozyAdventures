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
      set: "town",
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
      set: "meadow",
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
      set: "meadow",
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
      set: "meadow",
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
      set: "town",
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
      set: "meadow",
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
      set: "meadow",
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
      set: "meadow",
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
      set: "meadow",
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
      set: "meadow",
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
      set: "meadow",
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
      set: "meadow",
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
      set: "attic",
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
      set: "meadow",
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
    },
    // --- Свитки заклинаний (пояс) ---
    {
      id: "scr_fire_arrow",
      name: "\u0421\u0432\u0438\u0442\u043E\u043A \u0441\u0442\u0440\u0435\u043B\u044B \u043E\u0433\u043D\u044F",
      slot: "consumable",
      type: "scroll",
      rarity: "rare",
      price: 90,
      stackable: true,
      effect: { kind: "scroll_fire_arrow", dmg: 25 },
      description: "\u0412 \u043D\u0430\u0447\u0430\u043B\u0435 \u0431\u043E\u044F \u0431\u044C\u0451\u0442 \u043E\u0433\u043D\u0451\u043C \u0441\u0430\u043C\u043E\u0433\u043E \u0436\u0438\u0432\u0443\u0447\u0435\u0433\u043E \u0432\u0440\u0430\u0433\u0430, \u0438\u0433\u043D\u043E\u0440\u0438\u0440\u0443\u044F \u043F\u043E\u043B\u043E\u0432\u0438\u043D\u0443 \u0431\u0440\u043E\u043D\u0438."
    },
    {
      id: "scr_heal_mist",
      name: "\u0421\u0432\u0438\u0442\u043E\u043A \u0446\u0435\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0439 \u0440\u043E\u0441\u044B",
      slot: "consumable",
      type: "scroll",
      rarity: "rare",
      price: 120,
      stackable: true,
      effect: { kind: "scroll_heal_mist", amount: 20 },
      description: "\u0412 \u043D\u0430\u0447\u0430\u043B\u0435 \u0431\u043E\u044F \u043B\u0435\u0447\u0438\u0442 \u0432\u0435\u0441\u044C \u043E\u0442\u0440\u044F\u0434 \u043D\u0430 20 \u0437\u0434\u043E\u0440\u043E\u0432\u044C\u044F."
    },
    {
      id: "scr_frost",
      name: "\u0421\u0432\u0438\u0442\u043E\u043A \u043B\u0435\u0434\u044F\u043D\u044B\u0445 \u043E\u043A\u043E\u0432",
      slot: "consumable",
      type: "scroll",
      rarity: "rare",
      price: 140,
      stackable: true,
      effect: { kind: "scroll_frost", ticks: 40, factor: 0.6 },
      description: "\u0412 \u043D\u0430\u0447\u0430\u043B\u0435 \u0431\u043E\u044F \u0437\u0430\u043C\u0435\u0434\u043B\u044F\u0435\u0442 \u0432\u0441\u0435\u0445 \u0432\u0440\u0430\u0433\u043E\u0432 \u2014 \u043E\u043D\u0438 \u0440\u0435\u0436\u0435 \u0445\u043E\u0434\u044F\u0442."
    },
    {
      id: "scr_storm",
      name: "\u0421\u0432\u0438\u0442\u043E\u043A \u0433\u0440\u043E\u0437\u044B",
      slot: "consumable",
      type: "scroll",
      rarity: "epic",
      price: 160,
      stackable: true,
      effect: { kind: "scroll_storm", dmg: 22 },
      description: "\u0412 \u043D\u0430\u0447\u0430\u043B\u0435 \u0431\u043E\u044F \u0431\u044C\u0451\u0442 \u043C\u043E\u043B\u043D\u0438\u0435\u0439 \u0434\u0432\u0443\u0445 \u0441\u0430\u043C\u044B\u0445 \u0445\u0440\u0443\u043F\u043A\u0438\u0445 \u0432\u0440\u0430\u0433\u043E\u0432."
    },
    {
      id: "scr_fire_step",
      name: "\u0421\u0432\u0438\u0442\u043E\u043A \u0448\u0430\u0433\u0430 \u043E\u0433\u043D\u044F",
      slot: "consumable",
      type: "scroll",
      rarity: "epic",
      price: 240,
      stackable: true,
      effect: { kind: "scroll_fire_step", dmg: 18 },
      description: "\u0412 \u043D\u0430\u0447\u0430\u043B\u0435 \u0431\u043E\u044F \u0431\u044C\u0451\u0442 \u043E\u0433\u043D\u0451\u043C \u043F\u043E \u043F\u043B\u043E\u0449\u0430\u0434\u0438 \u2014 \u0437\u0430\u0434\u0435\u0432\u0430\u0435\u0442 \u0412\u0421\u0415\u0425 \u0432\u0440\u0430\u0433\u043E\u0432. \u0414\u043E\u0440\u043E\u0433\u043E."
    }
  ];
  ITEMS.push(
    {
      id: "wpn_iron_sword",
      set: "town",
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
      set: "town",
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
      set: "town",
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
      set: "town",
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
      set: "town",
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
      set: "town",
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
      set: "town",
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
      set: "town",
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
      set: "town",
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
      set: "attic",
      name: "\u041F\u043E\u0441\u043E\u0445 \u0441\u0432\u0435\u0447\u043D\u043E\u0433\u043E \u043C\u0430\u0433\u0430",
      slot: "weapon",
      hand: "two",
      type: "staff",
      rarity: "epic",
      price: 420,
      stats: { attack: 34, speed: -2 },
      traits: ["pierce", "ranged"],
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
      set: "attic",
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
      set: "attic",
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
      set: "attic",
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
      set: "attic",
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
      set: "attic",
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
      set: "attic",
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
      set: "attic",
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
  ITEMS.push(
    {
      id: "wpn_master_dagger",
      set: "master",
      name: "\u0421\u0442\u0438\u043B\u0435\u0442 \u043C\u0430\u0441\u0442\u0435\u0440\u0430",
      slot: "weapon",
      hand: "one",
      type: "dagger",
      rarity: "epic",
      price: 0,
      stats: { attack: 18, crit: 0.06 },
      description: "\u0412\u044B\u043A\u043E\u0432\u0430\u043D \u0438\u0437 \u0441\u0432\u0435\u0442\u044F\u0449\u0435\u0433\u043E\u0441\u044F \u043C\u0445\u0430 \u0438 \u043C\u0448\u0438\u0441\u0442\u043E\u0433\u043E \u043A\u0430\u043C\u043D\u044F. \u0412 \u043B\u0430\u0432\u043A\u0435 \u0442\u0430\u043A\u043E\u0433\u043E \u043D\u0435\u0442."
    },
    {
      id: "shd_master",
      set: "master",
      name: "\u0417\u0435\u0440\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u0449\u0438\u0442 \u043C\u0430\u0441\u0442\u0435\u0440\u0430",
      slot: "shield",
      hand: "one",
      type: "shield",
      rarity: "epic",
      price: 0,
      stats: { armor: 18, block: 0.2, hp: 10 },
      description: "\u041F\u043E\u043B\u0438\u0440\u043E\u0432\u0430\u043D \u0434\u043E \u0431\u043B\u0435\u0441\u043A\u0430 \u0442\u0440\u044F\u043F\u043A\u043E\u0439 \u0438\u0437 \u0440\u0432\u0430\u043D\u043E\u0439 \u0442\u043A\u0430\u043D\u0438 \u0438 \u0442\u0435\u0440\u043F\u0435\u043D\u0438\u044F."
    },
    {
      id: "hlm_master",
      set: "master",
      name: "\u041E\u0431\u0440\u0443\u0447 \u043C\u0430\u0441\u0442\u0435\u0440\u0430",
      slot: "helmet",
      type: "helmet",
      rarity: "epic",
      price: 0,
      stats: { hp: 14, dodge: 0.04 },
      description: "\u041B\u0451\u0433\u043A\u0438\u0439 \u043E\u0431\u0440\u0443\u0447 \u0441 \u0441\u0435\u0440\u0434\u0446\u0435\u043C \u0441\u0442\u0430\u0440\u043E\u0439 \u0438\u0432\u044B \u0432\u043D\u0443\u0442\u0440\u0438."
    },
    {
      id: "arm_master",
      set: "master",
      name: "\u041A\u0430\u043C\u0437\u043E\u043B \u043C\u0430\u0441\u0442\u0435\u0440\u0430",
      slot: "armor",
      type: "armor",
      rarity: "epic",
      price: 0,
      stats: { armor: 24, hp: 18 },
      description: "\u0421\u0442\u0451\u0433\u0430\u043D\u044B\u0439, \u043F\u0440\u043E\u043F\u0438\u0442\u0430\u043D\u043D\u044B\u0439 \u0447\u0435\u0440\u043D\u0438\u043B\u044C\u043D\u044B\u043C \u043E\u0442\u0432\u0430\u0440\u043E\u043C. \u0422\u0451\u043F\u043B\u044B\u0439 \u0438 \u0432\u043E\u043B\u0448\u0435\u0431\u043D\u044B\u0439."
    },
    {
      id: "glv_master",
      set: "master",
      name: "\u041D\u0430\u043F\u0435\u0440\u0441\u0442\u043A\u0438 \u043C\u0430\u0441\u0442\u0435\u0440\u0430",
      slot: "gloves",
      type: "gloves",
      rarity: "epic",
      price: 0,
      stats: { attack: 6, crit: 0.04 },
      description: "\u041F\u0430\u043B\u044C\u0446\u044B \u0441\u0430\u043C\u0438 \u043D\u0430\u0445\u043E\u0434\u044F\u0442 \u0441\u043B\u0430\u0431\u044B\u0435 \u043C\u0435\u0441\u0442\u0430."
    },
    {
      id: "bt_master",
      set: "master",
      name: "\u0421\u0430\u043F\u043E\u0433\u0438 \u043C\u0430\u0441\u0442\u0435\u0440\u0430",
      slot: "boots",
      type: "boots",
      rarity: "epic",
      price: 0,
      stats: { speed: 3, dodge: 0.05 },
      description: "\u041F\u043E\u0434\u043E\u0448\u0432\u0430 \u0438\u0437 \u043A\u0440\u044B\u0441\u0438\u043D\u043E\u0433\u043E \u0445\u0432\u043E\u0441\u0442\u0430. \u0411\u0435\u0441\u0448\u0443\u043C\u043D\u044B."
    },
    {
      id: "amu_master",
      set: "master",
      name: "\u0424\u0438\u043B\u044C\u0433\u0440\u0430\u043D\u044C \u043C\u0430\u0441\u0442\u0435\u0440\u0430",
      slot: "amulet",
      type: "amulet",
      rarity: "epic",
      price: 0,
      stats: { hp: 12, resist: { poison: 0.3 } },
      description: "\u0410\u043C\u0443\u043B\u0435\u0442 \u0441 \u043F\u0443\u0447\u043A\u043E\u043C \u043F\u043B\u0430\u0443\u043D\u0430 \u0438 \u043A\u0430\u043F\u043B\u0435\u0439 \u0441\u0432\u0435\u0442\u044F\u0449\u0435\u0433\u043E\u0441\u044F \u043C\u0445\u0430."
    },
    {
      id: "rng_master",
      set: "master",
      name: "\u041F\u0435\u0440\u0441\u0442\u0435\u043D\u044C \u043C\u0430\u0441\u0442\u0435\u0440\u0430",
      slot: "ring",
      type: "ring",
      rarity: "epic",
      price: 0,
      stats: { crit: 0.05, goldFind: 0.08 },
      description: "\u041E\u0442\u043B\u0438\u0442 \u0438\u0437 \u043C\u0451\u0434\u0430 \u0438 \u043F\u044B\u043B\u044C\u0446\u044B \u043C\u043E\u0442\u044B\u043B\u044C\u043A\u0430. \u0412\u043D\u0443\u0442\u0440\u0438 \u0448\u0435\u0432\u0435\u043B\u0438\u0442\u0441\u044F \u0443\u0434\u0430\u0447\u0430."
    },
    {
      id: "rng_master_loop",
      set: "master",
      name: "\u041A\u043E\u043B\u044C\u0446\u043E \u043D\u0430\u043F\u0430\u0440\u043D\u0438\u043A\u0430 \u043C\u0430\u0441\u0442\u0435\u0440\u0430",
      slot: "ring",
      type: "ring",
      rarity: "epic",
      price: 0,
      stats: { attack: 3, armor: 3 },
      description: "\u0412\u0442\u043E\u0440\u043E\u0439 \u043F\u0435\u0440\u0441\u0442\u0435\u043D\u044C \u043F\u0430\u0440\u044B. \u0421 \u043F\u0435\u0440\u0432\u044B\u043C \u043C\u0443\u0440\u043B\u044B\u0447\u0435\u0442 \u0434\u0440\u0443\u0433 \u0434\u0440\u0443\u0433\u0443."
    },
    {
      id: "shd_page_shield",
      set: "attic",
      name: "\u0429\u0438\u0442-\u043F\u0435\u0440\u0435\u043F\u043B\u0451\u0442",
      slot: "shield",
      hand: "one",
      type: "shield",
      rarity: "rare",
      price: 230,
      stats: { armor: 10, dodge: 0.05, hp: 8 },
      description: "\u041A\u0440\u044B\u0448\u043A\u0430 \u0434\u0440\u0435\u0432\u043D\u0435\u0433\u043E \u0444\u043E\u043B\u0438\u0430\u043D\u0442\u0430 \u043D\u0430 \u0440\u0435\u043C\u043D\u0435. \u041B\u0435\u0433\u0447\u0435 \u0434\u0435\u0440\u0435\u0432\u0430, \u043A\u0440\u0435\u043F\u0447\u0435 \u043A\u043E\u0436\u0438."
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
    // Свитки заклинаний (лавка Мага)
    { itemId: "scr_fire_arrow", unlockAfter: "bt_golem" },
    { itemId: "scr_heal_mist", unlockAfter: "bt_rats" },
    { itemId: "scr_frost", unlockAfter: "bt_bandits" },
    { itemId: "scr_storm", unlockAfter: "bk_blots" },
    { itemId: "scr_fire_step", unlockAfter: "bk_spirits" },
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
    { itemId: "shd_page_shield", unlockAfter: "bk_spirits" },
    // После «Витражной гравюры»
    { itemId: "wpn_firebird_quill", unlockAfter: "bk_illustration" }
  ];
  var SHOPS = {
    armory: {
      name: "\u041E\u0440\u0443\u0436\u0435\u0439\u043D\u0438\u043A \xAB\u0421\u0442\u0430\u043B\u044C \u0438 \u0432\u0435\u0440\u043D\u043E\u0441\u0442\u044C\xBB",
      icon: "\u{1F5E1}\uFE0F",
      desc: "\u041A\u043B\u0438\u043D\u043A\u0438 \u0438 \u0434\u0440\u0435\u0432\u043A\u043E\u0432\u043E\u0435. \u0417\u0432\u043E\u043D \u043C\u0435\u0442\u0430\u043B\u043B\u0430, \u0437\u0430\u043F\u0430\u0445 \u043C\u0430\u0441\u043B\u0430.",
      types: ["sword", "mace", "dagger", "greatsword", "greataxe", "bow", "staff"]
    },
    armorer: {
      name: "\u0411\u0440\u043E\u043D\u043D\u0438\u043A \xAB\u0414\u0443\u0431 \u0438 \u0436\u0435\u043B\u0435\u0437\u043E\xBB",
      icon: "\u{1F6E1}\uFE0F",
      desc: "\u0429\u0438\u0442\u044B, \u0448\u043B\u0435\u043C\u044B, \u0431\u0440\u043E\u043D\u044F, \u043F\u0435\u0440\u0447\u0430\u0442\u043A\u0438 \u0438 \u0441\u0430\u043F\u043E\u0433\u0438. \u041C\u0435\u0440\u044F\u044E\u0442 \u043D\u0430 \u0433\u043B\u0430\u0437 \u0438 \u043D\u0435 \u043E\u0448\u0438\u0431\u0430\u044E\u0442\u0441\u044F.",
      types: ["shield", "helmet", "armor", "gloves", "boots"]
    },
    magic: {
      name: "\u041C\u0430\u0433 \xAB\u041B\u0443\u043D\u0430 \u0438 \u0447\u0435\u0440\u043D\u0438\u043B\u0430\xBB",
      icon: "\u{1F52E}",
      desc: "\u0410\u043C\u0443\u043B\u0435\u0442\u044B \u0438 \u043A\u043E\u043B\u044C\u0446\u0430, \u0441\u0432\u0438\u0442\u043A\u0438 \u0437\u0430\u043A\u043B\u0438\u043D\u0430\u043D\u0438\u0439, \u0437\u0432\u0451\u0437\u0434\u043D\u0430\u044F \u043F\u044B\u043B\u044C.",
      types: ["amulet", "ring", "scroll"]
    },
    alchemy: {
      name: "\u0410\u043B\u0445\u0438\u043C\u0438\u043A \xAB\u041A\u043E\u0442\u0451\u043B \u0438 \u0440\u043E\u0441\u0430\xBB",
      icon: "\u{1F9EA}",
      desc: "\u0417\u0435\u043B\u044C\u044F, \u043E\u0442\u0432\u0430\u0440\u044B \u0438 \u043D\u0430\u0441\u0442\u043E\u0439\u043A\u0438. \u0411\u0443\u043B\u044C\u043A\u0430\u0435\u0442 \u043A\u0440\u0443\u0433\u043B\u044B\u0439 \u0433\u043E\u0434.",
      types: ["potion"]
    }
  };
  function itemsForShop(state2, shopKey, allItems) {
    const shop = SHOPS[shopKey];
    if (!shop) return [];
    return allItems.filter((i) => shop.types.includes(i.type));
  }
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
        { type: "source", pos: [1, 3], dir: 0 },
        { type: "mirror", pos: [1, 1], orient: 1 },
        { type: "lantern", pos: [0, 1] }
      ],
      rewards: [{ type: "coins", amount: 40 }],
      intro: "\u0421\u0432\u0435\u0442\u043B\u044F\u0447\u043E\u043A \u0441\u0432\u0435\u0442\u0438\u0442 \u0432\u0432\u0435\u0440\u0445, \u043D\u043E \u0444\u043E\u043D\u0430\u0440\u044C \u2014 \u0441\u043B\u0435\u0432\u0430. \u0422\u0430\u043F\u043D\u0438 \u0437\u0435\u0440\u043A\u0430\u043B\u043E \u043E\u0434\u0438\u043D \u0440\u0430\u0437: \u043B\u0443\u0447 \u043F\u043E\u0432\u0435\u0440\u043D\u0451\u0442\u0441\u044F \u043A \u0444\u043E\u043D\u0430\u0440\u044E!"
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
  var R = 42;
  var SEEK_PUZZLES = [
    // --- Мир 1: Тихая опушка ---
    {
      id: "sk_md_01",
      world: "meadow",
      mechanic: "seek",
      name: "\u0423\u0442\u0440\u0435\u043D\u043D\u044F\u044F \u043F\u043E\u043B\u044F\u043D\u0430",
      difficulty: 1,
      sceneSize: [1e3, 650],
      groups: [
        {
          id: "amanita",
          label: "\u041A\u0440\u0430\u0441\u043D\u044B\u0435 \u043C\u0443\u0445\u043E\u043C\u043E\u0440\u044B",
          spots: [
            { x: 195, y: 174, r: 56 },
            { x: 73, y: 423, r: 48 },
            { x: 175, y: 598, r: 48 },
            { x: 706, y: 549, r: 48 },
            { x: 355, y: 44, r: 34 }
          ]
        },
        {
          id: "horseshoe",
          label: "\u041F\u043E\u0434\u043A\u043E\u0432\u044B",
          spots: [{ x: 651, y: 216, r: 54 }, { x: 377, y: 488, r: 34 }]
        },
        {
          id: "feather",
          label: "\u041F\u0435\u0440\u044C\u044F",
          spots: [
            { x: 584, y: 363, r: 54 },
            { x: 425, y: 524, r: 42 },
            { x: 720, y: 183, r: 42 }
          ]
        }
      ],
      rewards: [{ type: "coins", amount: 80 }],
      intro: "\u041F\u043E\u043B\u044F\u043D\u0430 \u043F\u043E\u043B\u043D\u0430 \u043D\u0430\u0445\u043E\u0434\u043E\u043A. \u0421\u043E\u0431\u0435\u0440\u0438 \u0432\u0441\u0435 \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u044B \u0438\u0437 \u0441\u043F\u0438\u0441\u043A\u0430 \u2014 \u043A\u0430\u0436\u0434\u043E\u0433\u043E \u0432\u0438\u0434\u0430 \u0434\u043E \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0433\u043E!"
    },
    {
      id: "sk_md_02",
      world: "meadow",
      mechanic: "seek",
      name: "\u0421\u0443\u043D\u0434\u0443\u043A \u043F\u043E\u0434 \u043A\u043E\u0440\u043D\u044F\u043C\u0438",
      difficulty: 2,
      sceneSize: [1e3, 650],
      groups: [
        {
          id: "snail",
          label: "\u0420\u0430\u043A\u043E\u0432\u0438\u043D\u044B \u0443\u043B\u0438\u0442\u043E\u043A",
          spots: [
            { x: 572, y: 152, r: 26 },
            { x: 215, y: 339, r: 26 },
            { x: 470, y: 563, r: 30 }
          ]
        },
        {
          id: "cone",
          label: "\u0428\u0438\u0448\u043A\u0438",
          spots: [
            { x: 406, y: 39, r: 20 },
            { x: 335, y: 215, r: 22 },
            { x: 617, y: 583, r: 32 },
            { x: 871, y: 278, r: 26 },
            { x: 141, y: 544, r: 26 },
            { x: 508, y: 618, r: 38 },
            { x: 753, y: 68, r: 22 }
          ]
        },
        {
          id: "watch",
          label: "\u041A\u0430\u0440\u043C\u0430\u043D\u043D\u044B\u0435 \u0447\u0430\u0441\u044B",
          spots: [{ x: 531, y: 249, r: 26 }]
        },
        {
          id: "bottle",
          label: "\u0421\u0442\u0435\u043A\u043B\u044F\u043D\u043D\u0430\u044F \u0431\u0443\u0442\u044B\u043B\u043A\u0430",
          spots: [{ x: 935, y: 416, r: 34 }]
        }
      ],
      rewards: [{ type: "coins", amount: 95 }],
      intro: "\u041F\u043E\u0434 \u043A\u043E\u0440\u043D\u044F\u043C\u0438 \u0441\u0442\u0430\u0440\u043E\u0439 \u0438\u0432\u044B \u2014 \u0446\u0435\u043B\u044B\u0439 \u0442\u0430\u0439\u043D\u0438\u043A. \u0422\u0435\u043F\u0435\u0440\u044C \u0443\u0436\u0435 \u043F\u043E\u0441\u043B\u043E\u0436\u043D\u0435\u0435."
    },
    // --- Мир 2: Средневековый дворик ---
    {
      id: "sk_tw_01",
      world: "town",
      mechanic: "seek",
      name: "\u0420\u044B\u043D\u043E\u0447\u043D\u0430\u044F \u0441\u0443\u0442\u043E\u043B\u043E\u043A\u0430",
      difficulty: 3,
      sceneSize: [1e3, 650],
      groups: [
        {
          id: "pigeon",
          label: "\u0413\u043E\u043B\u0443\u0431\u0438",
          spots: [
            { x: 510, y: 22, r: 12 },
            { x: 822, y: 42, r: 14 },
            { x: 774, y: 154, r: 14 },
            { x: 245, y: 488, r: 18 },
            { x: 107, y: 519, r: 18 },
            { x: 149, y: 547, r: 22 },
            { x: 393, y: 228, r: 12 },
            { x: 882, y: 210, r: 18 }
          ]
        },
        {
          id: "horseshoe2",
          label: "\u041F\u043E\u0434\u043A\u043E\u0432\u044B",
          spots: [
            { x: 621, y: 367, r: 14 },
            { x: 663, y: 372, r: 14 },
            { x: 746, y: 420, r: 12 },
            { x: 636, y: 609, r: 14 }
          ]
        },
        {
          id: "garlic",
          label: "\u0421\u0432\u044F\u0437\u043A\u0438 \u0447\u0435\u0441\u043D\u043E\u043A\u0430",
          spots: [
            { x: 388, y: 63, r: 14 },
            { x: 408, y: 54, r: 14 },
            { x: 525, y: 140, r: 22 },
            { x: 720, y: 228, r: 22 },
            { x: 921, y: 268, r: 26 }
          ]
        }
      ],
      rewards: [{ type: "coins", amount: 120 }],
      intro: "\u0413\u043E\u043B\u0443\u0431\u0435\u0439 \u0442\u0443\u0442 \u0432\u043E\u0441\u0435\u043C\u044C, \u043F\u043E\u0434\u043A\u043E\u0432 \u0447\u0435\u0442\u044B\u0440\u0435, \u0430 \u0447\u0435\u0441\u043D\u043E\u043A\u0430 \u2014 \u043F\u044F\u0442\u044C \u0441\u0432\u044F\u0437\u043E\u043A. \u0412\u0441\u0435\u0445 \u043D\u0430\u0439\u0434\u0451\u0448\u044C?"
    },
    {
      id: "sk_tw_02",
      world: "town",
      mechanic: "seek",
      name: "\u0421\u043A\u043B\u0430\u0434 \u043A\u0443\u0437\u043D\u0435\u0446\u0430",
      difficulty: 3,
      sceneSize: [1e3, 650],
      groups: [
        {
          id: "dog",
          label: "\u0421\u043F\u044F\u0449\u0438\u0435 \u0441\u043E\u0431\u0430\u043A\u0438",
          spots: [{ x: 182, y: 188, r: 42 }, { x: 153, y: 510, r: 54 }]
        },
        {
          id: "bread",
          label: "\u0411\u0443\u0445\u0430\u043D\u043A\u0438 \u0445\u043B\u0435\u0431\u0430",
          spots: [
            { x: 645, y: 218, r: 22 },
            { x: 588, y: 256, r: 30 },
            { x: 635, y: 280, r: 30 },
            { x: 722, y: 597, r: 42 }
          ]
        },
        {
          id: "cheese",
          label: "\u0413\u043E\u043B\u043E\u0432\u043A\u0438 \u0441\u044B\u0440\u0430",
          spots: [{ x: 589, y: 182, r: 36 }]
        },
        {
          id: "rope",
          label: "\u041C\u043E\u0442\u043A\u0438 \u0432\u0435\u0440\u0451\u0432\u043A\u0438",
          spots: [{ x: 785, y: 456, r: 30 }, { x: 310, y: 620, r: 34 }, { x: 552, y: 133, r: 26 }]
        }
      ],
      rewards: [{ type: "coins", amount: 130 }],
      intro: "\u041A\u0443\u0437\u043D\u0435\u0446 \u0441\u043D\u043E\u0432\u0430 \u0432\u0441\u0451 \u0440\u0430\u0441\u043A\u0438\u0434\u0430\u043B. \u0421\u043E\u0431\u0430\u043A \u043D\u0435 \u0431\u0443\u0434\u0438 \u2014 \u043F\u0440\u043E\u0441\u0442\u043E \u043E\u0442\u043C\u0435\u0442\u044C."
    },
    // --- Мир 3: Книжный чердак ---
    {
      id: "sk_bk_01",
      world: "attic",
      mechanic: "seek",
      name: "\u041F\u044B\u043B\u044C\u043D\u0430\u044F \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430",
      difficulty: 4,
      sceneSize: [1e3, 650],
      groups: [
        {
          id: "keys",
          label: "\u0421\u0442\u0430\u0440\u0438\u043D\u043D\u044B\u0435 \u043A\u043B\u044E\u0447\u0438",
          spots: [
            { x: 724, y: 465, r: 22 },
            { x: 689, y: 478, r: 26 },
            { x: 709, y: 589, r: 18 },
            { x: 332, y: 323, r: 18 }
          ]
        },
        {
          id: "candle",
          label: "\u0421\u0432\u0435\u0447\u0438",
          spots: [
            { x: 227, y: 397, r: 22 },
            { x: 661, y: 163, r: 18 },
            { x: 191, y: 396, r: 22 },
            { x: 152, y: 425, r: 22 },
            { x: 115, y: 452, r: 16 },
            { x: 91, y: 468, r: 18 }
          ]
        },
        {
          id: "openbook",
          label: "\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u044B\u0435 \u043A\u043D\u0438\u0433\u0438",
          spots: [
            { x: 335, y: 485, r: 86 },
            { x: 561, y: 518, r: 62 },
            { x: 139, y: 159, r: 26 }
          ]
        },
        {
          id: "chest",
          label: "\u0427\u0435\u043C\u043E\u0434\u0430\u043D\u0447\u0438\u043A\u0438",
          spots: [{ x: 373, y: 289, r: 42 }, { x: 427, y: 235, r: 42 }]
        }
      ],
      rewards: [{ type: "coins", amount: 150 }],
      intro: "\u041D\u0430 \u0447\u0435\u0440\u0434\u0430\u043A\u0435 \u043A\u0430\u0436\u0434\u0430\u044F \u0432\u0435\u0449\u044C \u043F\u043E\u043C\u043D\u0438\u0442 \u0438\u0441\u0442\u043E\u0440\u0438\u044E. \u041D\u0430\u0439\u0434\u0438 \u0432\u0441\u0435 \u043A\u043B\u044E\u0447\u0438, \u0441\u0432\u0435\u0447\u0438 \u0438 \u043A\u043D\u0438\u0433\u0438."
    },
    {
      id: "sk_bk_02",
      world: "attic",
      mechanic: "seek",
      name: "\u0421\u0443\u043D\u0434\u0443\u043A \u0431\u0430\u0431\u0443\u0448\u043A\u0438\u043D\u044B\u0445 \u043F\u0438\u0441\u0435\u043C",
      difficulty: 5,
      bg: "seek_attic2",
      sceneSize: [1e3, 650],
      groups: [
        {
          id: "letter",
          label: "\u041F\u0438\u0441\u044C\u043C\u0430 \u0441 \u043F\u0435\u0447\u0430\u0442\u044C\u044E",
          spots: [
            { x: 338, y: 418, r: 30 },
            { x: 389, y: 479, r: 30 },
            { x: 671, y: 436, r: 34 }
          ]
        },
        {
          id: "specs",
          label: "\u041E\u0447\u043A\u0438",
          spots: [
            { x: 556, y: 429, r: 30 },
            { x: 521, y: 253, r: 26 },
            { x: 400, y: 578, r: 30 },
            { x: 757, y: 323, r: 22 }
          ]
        },
        {
          id: "keys2",
          label: "\u041A\u043B\u044E\u0447\u0438",
          spots: [{ x: 444, y: 425, r: 30 }]
        },
        {
          id: "cup",
          label: "\u0427\u0430\u0439\u043D\u044B\u0435 \u0447\u0430\u0448\u043A\u0438",
          spots: [
            { x: 244, y: 489, r: 26 },
            { x: 805, y: 445, r: 26 },
            { x: 693, y: 332, r: 26 }
          ]
        }
      ],
      rewards: [{ type: "coins", amount: 200 }, { type: "seals", amount: 1 }],
      intro: "\u0424\u0438\u043D\u0430\u043B \u0438\u0441\u043A\u0430\u043B\u043E\u043A: \u043F\u0438\u0441\u044C\u043C\u0430, \u043E\u0447\u043A\u0438, \u043A\u043B\u044E\u0447\u0438 \u0438 \u0447\u0430\u0448\u043A\u0438 \u2014 \u0432\u0441\u0435 \u0434\u043E \u0435\u0434\u0438\u043D\u043E\u0433\u043E."
    }
  ];
  var SEEK_PUZZLE_BY_ID = Object.fromEntries(SEEK_PUZZLES.map((p) => [p.id, p]));
  SEEK_PUZZLES.push(
    {
      id: "sk_nm_01",
      world: "nm",
      mechanic: "seek",
      name: "\u041D\u043E\u0447\u043D\u043E\u0439 \u0440\u044B\u043D\u043E\u043A",
      difficulty: 4,
      bg: "seek_market",
      sceneSize: [1e3, 650],
      groups: [
        {
          id: "mask",
          label: "\u041C\u0430\u0441\u043A\u0438 \u0434\u0443\u0445\u043E\u0432",
          spots: [
            { x: 463, y: 291, r: 22 },
            { x: 499, y: 276, r: 22 },
            { x: 535, y: 248, r: 22 },
            { x: 594, y: 268, r: 22 },
            { x: 649, y: 274, r: 22 },
            { x: 695, y: 277, r: 22 },
            { x: 738, y: 281, r: 26 },
            { x: 495, y: 346, r: 22 },
            { x: 527, y: 322, r: 18 }
          ]
        },
        {
          id: "wisp",
          label: "\u0414\u0443\u0445\u0438-\u043E\u0433\u043E\u043D\u044C\u043A\u0438",
          spots: [
            { x: 333, y: 102, r: 42 },
            { x: 428, y: 87, r: 22 },
            { x: 595, y: 156, r: 34 },
            { x: 940, y: 328, r: 26 }
          ]
        },
        {
          id: "origami",
          label: "\u0411\u0443\u043C\u0430\u0436\u043D\u044B\u0435 \u0436\u0443\u0440\u0430\u0432\u043B\u0438\u043A\u0438",
          spots: [
            { x: 621, y: 350, r: 22 },
            { x: 668, y: 363, r: 18 },
            { x: 879, y: 320, r: 30 }
          ]
        },
        {
          id: "glowjar",
          label: "\u0421\u0432\u0435\u0442\u044F\u0449\u0438\u0435\u0441\u044F \u0431\u0430\u043D\u043A\u0438",
          spots: [
            { x: 47, y: 473, r: 30 },
            { x: 410, y: 376, r: 26 },
            { x: 741, y: 156, r: 18 },
            { x: 449, y: 360, r: 26 }
          ]
        }
      ],
      rewards: [{ type: "coins", amount: 220 }],
      intro: "\u0424\u043E\u043D\u0430\u0440\u0438\u043A\u0438, \u043C\u0430\u0441\u043A\u0438, \u0434\u0443\u0445\u0438 \u0442\u043E\u0440\u0433\u043E\u0432\u043B\u0438. \u041D\u043E\u0447\u043D\u043E\u0439 \u0440\u044B\u043D\u043E\u043A \u043F\u043E\u043B\u043E\u043D \u043C\u0435\u043B\u043A\u0438\u0445 \u0447\u0443\u0434\u0435\u0441."
    },
    {
      id: "sk_sw_01",
      world: "sw",
      mechanic: "seek",
      name: "\u0421\u043A\u0430\u0437\u043E\u0447\u043D\u044B\u0435 \u0442\u043E\u043F\u0438",
      difficulty: 4,
      bg: "seek_swamp",
      sceneSize: [1e3, 650],
      groups: [
        {
          id: "frog",
          label: "\u041B\u044F\u0433\u0443\u0448\u043A\u0438",
          spots: [
            { x: 394, y: 160, r: 16 },
            { x: 504, y: 225, r: 26 },
            { x: 242, y: 378, r: 22 },
            { x: 607, y: 580, r: 22 },
            { x: 702, y: 608, r: 22 }
          ]
        },
        {
          id: "glowshroom",
          label: "\u0421\u0432\u0435\u0442\u044F\u0449\u0438\u0435\u0441\u044F \u0433\u0440\u0438\u0431\u044B",
          spots: [
            { x: 557, y: 154, r: 30 },
            { x: 973, y: 148, r: 26 },
            { x: 144, y: 493, r: 38 },
            { x: 51, y: 343, r: 42 }
          ]
        },
        {
          id: "lantern",
          label: "\u0424\u043E\u043D\u0430\u0440\u0438\u043A\u0438",
          spots: [{ x: 572, y: 346, r: 30 }, { x: 753, y: 523, r: 38 }]
        },
        {
          id: "dragonfly",
          label: "\u0421\u0442\u0440\u0435\u043A\u043E\u0437\u044B",
          spots: [{ x: 900, y: 250, r: 34 }, { x: 940, y: 491, r: 34 }]
        },
        {
          id: "boot",
          label: "\u0411\u043E\u043B\u043E\u0442\u043D\u044B\u0435 \u0441\u0430\u043F\u043E\u0433\u0438",
          spots: [
            { x: 384, y: 366, r: 30 },
            { x: 455, y: 318, r: 34 },
            { x: 259, y: 514, r: 34 }
          ]
        }
      ],
      rewards: [{ type: "coins", amount: 240 }],
      intro: "\u0422\u0443\u043C\u0430\u043D, \u0438\u0437\u0431\u0443\u0448\u043A\u0430, \u043B\u044F\u0433\u0443\u0448\u043A\u0438-\u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u0438. \u0421\u0447\u0438\u0442\u0430\u0439 \u043B\u044F\u0433\u0443\u0448\u0435\u043A \u0432\u043D\u0438\u043C\u0430\u0442\u0435\u043B\u044C\u043D\u043E \u2014 \u0438\u0445 \u043F\u044F\u0442\u044C!"
    },
    {
      id: "sk_sf_01",
      world: "sf",
      mechanic: "seek",
      name: "\u0417\u0432\u0451\u0437\u0434\u043D\u0430\u044F \u044F\u0440\u043C\u0430\u0440\u043A\u0430",
      difficulty: 5,
      bg: "seek_fair",
      sceneSize: [1e3, 650],
      groups: [
        {
          id: "armillary",
          label: "\u0410\u0441\u0442\u0440\u043E\u043B\u044F\u0431\u0438\u0438",
          spots: [
            { x: 130, y: 317, r: 62 },
            { x: 554, y: 126, r: 42 },
            { x: 270, y: 241, r: 42 },
            { x: 948, y: 447, r: 50 }
          ]
        },
        {
          id: "candleorb",
          label: "\u0421\u0432\u0435\u0447\u0438 \u0432 \u0448\u0430\u0440\u0430\u0445",
          spots: [
            { x: 76, y: 223, r: 42 },
            { x: 42, y: 321, r: 42 },
            { x: 421, y: 97, r: 62 },
            { x: 828, y: 190, r: 26 },
            { x: 963, y: 281, r: 38 }
          ]
        },
        {
          id: "starcookie",
          label: "\u041F\u0435\u0447\u0435\u043D\u044C\u044F-\u0437\u0432\u0451\u0437\u0434\u044B",
          spots: [{ x: 549, y: 387, r: 42 }]
        },
        {
          id: "crystal",
          label: "\u041A\u0440\u0438\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0435 \u0431\u0443\u043A\u0435\u0442\u044B",
          spots: [
            { x: 651, y: 295, r: 34 },
            { x: 614, y: 345, r: 30 },
            { x: 692, y: 588, r: 62 }
          ]
        },
        {
          id: "moonpillow",
          label: "\u041B\u0443\u043D\u043D\u044B\u0435 \u043F\u043E\u0434\u0443\u0448\u043A\u0438",
          spots: [{ x: 431, y: 477, r: 42 }, { x: 488, y: 524, r: 42 }]
        }
      ],
      rewards: [{ type: "coins", amount: 260 }, { type: "seals", amount: 1 }],
      intro: "\u042F\u0440\u043C\u0430\u0440\u043A\u0430 \u0447\u0443\u0434\u0435\u0441 \u043F\u043E\u0434 \u0437\u0432\u0451\u0437\u0434\u0430\u043C\u0438. \u0410\u0441\u0442\u0440\u043E\u043B\u044F\u0431\u0438\u0439 \u0437\u0434\u0435\u0441\u044C \u0447\u0435\u0442\u044B\u0440\u0435 \u2014 \u0432\u0441\u0435 \u0442\u0432\u043E\u0438."
    },
    {
      id: "sk_ash_01",
      world: "ash",
      mechanic: "seek",
      name: "\u041A\u0443\u0437\u043D\u0438\u0446\u0430 \u0438\u0437\u043D\u0443\u0442\u0440\u0438",
      difficulty: 5,
      bg: "seek_forge",
      sceneSize: [1e3, 650],
      groups: [
        {
          id: "horseshoe3",
          label: "\u041F\u043E\u0434\u043A\u043E\u0432\u044B",
          spots: [
            { x: 223, y: 154, r: 54 },
            { x: 794, y: 505, r: 22 },
            { x: 762, y: 412, r: 34 },
            { x: 105, y: 594, r: 30 },
            { x: 542, y: 585, r: 26 }
          ]
        },
        {
          id: "hammer",
          label: "\u041C\u043E\u043B\u043E\u0442\u043A\u0438",
          spots: [
            { x: 400, y: 316, r: 34 },
            { x: 678, y: 405, r: 42 },
            { x: 782, y: 583, r: 54 },
            { x: 699, y: 480, r: 42 },
            { x: 861, y: 357, r: 38 },
            { x: 191, y: 54, r: 42 }
          ]
        },
        {
          id: "ingot",
          label: "\u0421\u043B\u0438\u0442\u043A\u0438",
          spots: [
            { x: 319, y: 327, r: 46 },
            { x: 389, y: 475, r: 46 },
            { x: 568, y: 507, r: 42 },
            { x: 399, y: 588, r: 42 },
            { x: 835, y: 318, r: 30 },
            { x: 428, y: 265, r: 34 }
          ]
        },
        {
          id: "gear",
          label: "\u0428\u0435\u0441\u0442\u0435\u0440\u0451\u043D\u043A\u0438",
          spots: [
            { x: 215, y: 494, r: 26 },
            { x: 901, y: 375, r: 26 },
            { x: 118, y: 310, r: 26 }
          ]
        },
        {
          id: "blade",
          label: "\u041A\u043B\u0438\u043D\u043A\u0438-\u0437\u0430\u0433\u043E\u0442\u043E\u0432\u043A\u0438",
          spots: [
            { x: 145, y: 272, r: 42 },
            { x: 153, y: 398, r: 74 },
            { x: 779, y: 237, r: 42 }
          ]
        }
      ],
      rewards: [{ type: "coins", amount: 280 }, { type: "seals", amount: 1 }],
      intro: "\u041D\u0430\u043A\u043E\u0432\u0430\u043B\u044C\u043D\u0438, \u0443\u0433\u043B\u0438, \u0442\u044B\u0441\u044F\u0447\u0430 \u043C\u0435\u043B\u043E\u0447\u0435\u0439. \u0428\u0435\u0441\u0442\u044C \u043F\u043E\u0434\u043A\u043E\u0432 \u0436\u0434\u0443\u0442 \u043D\u043E\u0432\u043E\u0433\u043E \u0445\u043E\u0437\u044F\u0438\u043D\u0430."
    }
  );
  SEEK_PUZZLES.push(
    {
      id: "sk_cr_01",
      world: "cr",
      mechanic: "seek",
      name: "\u0425\u0440\u0443\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0435 \u0433\u043E\u0440\u044B",
      difficulty: 5,
      bg: "seek_crystal",
      sceneSize: [1e3, 650],
      groups: [
        {
          id: "cave",
          label: "\u0422\u0451\u043F\u043B\u044B\u0435 \u043F\u0435\u0449\u0435\u0440\u044B",
          spots: [
            { x: 102, y: 498, r: 64 },
            { x: 649, y: 558, r: 52 },
            { x: 905, y: 526, r: 60 },
            { x: 859, y: 131, r: 80 }
          ]
        },
        {
          id: "icelantern",
          label: "\u041B\u0435\u0434\u044F\u043D\u044B\u0435 \u0444\u043E\u043D\u0430\u0440\u0438\u043A\u0438",
          spots: [{ x: 204, y: 88, r: 30 }, { x: 225, y: 258, r: 34 }]
        },
        {
          id: "rope2",
          label: "\u0410\u043B\u044C\u043F\u0438\u043D\u0438\u0441\u0442\u0441\u043A\u0438\u0435 \u0432\u0435\u0440\u0451\u0432\u043A\u0438",
          spots: [
            { x: 247, y: 108, r: 34 },
            { x: 291, y: 245, r: 42 },
            { x: 768, y: 248, r: 42 },
            { x: 975, y: 424, r: 42 },
            { x: 205, y: 605, r: 34 }
          ]
        },
        {
          id: "crate",
          label: "\u042F\u0449\u0438\u043A\u0438 \u044D\u043A\u0441\u043F\u0435\u0434\u0438\u0446\u0438\u0438",
          spots: [{ x: 685, y: 199, r: 42 }, { x: 322, y: 480, r: 34 }]
        },
        {
          id: "gem",
          label: "\u0421\u0430\u043C\u043E\u0446\u0432\u0435\u0442\u044B",
          spots: [
            { x: 124, y: 187, r: 22 },
            { x: 161, y: 169, r: 26 },
            { x: 77, y: 360, r: 26 },
            { x: 749, y: 429, r: 26 },
            { x: 122, y: 383, r: 22 },
            { x: 770, y: 196, r: 26 },
            { x: 248, y: 584, r: 26 },
            { x: 179, y: 574, r: 26 }
          ]
        }
      ],
      rewards: [{ type: "coins", amount: 280 }],
      intro: "\u0421\u0432\u0435\u0440\u043A\u0430\u044E\u0449\u0438\u0435 \u043F\u0438\u043A\u0438 \u0438 \u0442\u0451\u043F\u043B\u044B\u0435 \u043F\u0435\u0449\u0435\u0440\u044B. \u0427\u0435\u0442\u044B\u0440\u0435 \u043F\u0435\u0449\u0435\u0440\u044B \u2014 \u0432 \u043A\u0430\u0436\u0434\u043E\u0439 \u043E\u0442\u0434\u044B\u0445\u0430\u0435\u0442 \u0434\u0443\u0445 \u0433\u043E\u0440."
    },
    {
      id: "sk_jade_01",
      world: "jade",
      mechanic: "seek",
      name: "\u041D\u0435\u0444\u0440\u0438\u0442\u043E\u0432\u044B\u0439 \u0441\u0430\u0434",
      difficulty: 5,
      bg: "seek_jade",
      sceneSize: [1e3, 650],
      groups: [
        {
          id: "stonelantern",
          label: "\u041A\u0430\u043C\u0435\u043D\u043D\u044B\u0435 \u0444\u043E\u043D\u0430\u0440\u0438",
          spots: [
            { x: 263, y: 124, r: R },
            { x: 456, y: 274, r: R },
            { x: 41, y: 562, r: R }
          ]
        },
        {
          id: "crane",
          label: "\u0411\u0443\u043C\u0430\u0436\u043D\u044B\u0435 \u0436\u0443\u0440\u0430\u0432\u043B\u0438\u043A\u0438",
          spots: [
            { x: 47, y: 91, r: R },
            { x: 147, y: 271, r: R },
            { x: 644, y: 300, r: R },
            { x: 381, y: 418, r: R },
            { x: 31, y: 497, r: R }
          ]
        },
        {
          id: "statue",
          label: "\u041D\u0435\u0444\u0440\u0438\u0442\u043E\u0432\u044B\u0435 \u0441\u0442\u0430\u0442\u0443\u044D\u0442\u043A\u0438",
          spots: [
            { x: 625, y: 101, r: R },
            { x: 766, y: 108, r: R },
            { x: 844, y: 157, r: R },
            { x: 206, y: 362, r: R },
            { x: 575, y: 444, r: R }
          ]
        },
        {
          id: "fan",
          label: "\u0412\u0435\u0435\u0440\u0430",
          spots: [
            { x: 381, y: 176, r: R },
            { x: 503, y: 362, r: R },
            { x: 769, y: 597, r: R },
            { x: 953, y: 398, r: R }
          ]
        },
        {
          id: "koi",
          label: "\u041A\u043E\u0438 \u0432 \u043F\u0440\u0443\u0434\u0443",
          spots: [
            { x: 650, y: 382, r: R },
            { x: 738, y: 405, r: R },
            { x: 675, y: 555, r: R }
          ]
        }
      ],
      rewards: [{ type: "coins", amount: 300 }, { type: "seals", amount: 1 }],
      intro: "\u0421\u0430\u0434 \u043A\u0430\u043C\u043D\u0435\u0439 \u0436\u0434\u0451\u0442 \u0432\u043D\u0438\u043C\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0433\u043E \u0433\u043E\u0441\u0442\u044F. \u041F\u044F\u0442\u044C \u0441\u0442\u0430\u0442\u0443\u044D\u0442\u043E\u043A \u0438 \u043F\u044F\u0442\u044C \u0436\u0443\u0440\u0430\u0432\u043B\u0438\u043A\u043E\u0432."
    },
    {
      id: "sk_deep_01",
      world: "deep",
      mechanic: "seek",
      name: "\u041F\u043E\u0434\u0432\u043E\u0434\u043D\u044B\u0439 \u0433\u0440\u043E\u0442",
      difficulty: 5,
      bg: "seek_grotto",
      sceneSize: [1e3, 650],
      groups: [
        {
          id: "jelly",
          label: "\u041C\u0435\u0434\u0443\u0437\u044B",
          spots: [
            { x: 206, y: 379, r: R },
            { x: 756, y: 176, r: R },
            { x: 819, y: 85, r: R }
          ]
        },
        {
          id: "pearlshell",
          label: "\u0416\u0435\u043C\u0447\u0443\u0436\u043D\u044B\u0435 \u0440\u0430\u043A\u043E\u0432\u0438\u043D\u044B",
          spots: [
            { x: 200, y: 196, r: R },
            { x: 331, y: 402, r: R },
            { x: 669, y: 274, r: R }
          ]
        },
        {
          id: "amphora",
          label: "\u0410\u043C\u0444\u043E\u0440\u044B",
          spots: [
            { x: 109, y: 196, r: R },
            { x: 288, y: 157, r: R },
            { x: 494, y: 118, r: R },
            { x: 138, y: 503, r: R },
            { x: 656, y: 356, r: R }
          ]
        },
        {
          id: "crab",
          label: "\u041A\u0440\u0430\u0431\u044B",
          spots: [
            { x: 550, y: 85, r: R },
            { x: 556, y: 340, r: R },
            { x: 694, y: 607, r: R }
          ]
        },
        {
          id: "key",
          label: "\u0417\u0430\u0442\u043E\u043D\u0443\u0432\u0448\u0438\u0435 \u043A\u043B\u044E\u0447\u0438",
          spots: [{ x: 775, y: 320, r: R }, { x: 581, y: 451, r: R }]
        }
      ],
      rewards: [{ type: "coins", amount: 320 }, { type: "seals", amount: 1 }],
      intro: "\u0417\u0430\u0442\u043E\u043F\u043B\u0435\u043D\u043D\u044B\u0439 \u0433\u0440\u043E\u0442 \u0445\u0440\u0430\u043D\u0438\u0442 \u0441\u043E\u043A\u0440\u043E\u0432\u0438\u0449\u0430 \u0440\u0443\u0441\u0430\u043B\u043E\u043A. \u041F\u044F\u0442\u044C \u0430\u043C\u0444\u043E\u0440 \u2014 \u0432\u0441\u0435 \u043F\u043E\u0434\u043D\u044F\u0442\u044C \u043D\u0430\u0432\u0435\u0440\u0445."
    },
    {
      id: "sk_mist_01",
      world: "mist",
      mechanic: "seek",
      name: "\u0422\u0443\u043C\u0430\u043D\u043D\u044B\u0435 \u0447\u0430\u0441\u044B",
      difficulty: 5,
      bg: "seek_clockwork",
      sceneSize: [1e3, 650],
      groups: [
        {
          id: "hourglass",
          label: "\u041F\u0435\u0441\u043E\u0447\u043D\u044B\u0435 \u0447\u0430\u0441\u044B",
          spots: [
            { x: 650, y: 157, r: R },
            { x: 450, y: 327, r: R },
            { x: 438, y: 516, r: R },
            { x: 531, y: 268, r: R }
          ]
        },
        {
          id: "pocketwatch",
          label: "\u041A\u0430\u0440\u043C\u0430\u043D\u043D\u044B\u0435 \u0447\u0430\u0441\u044B",
          spots: [
            { x: 600, y: 209, r: R },
            { x: 244, y: 503, r: R },
            { x: 344, y: 555, r: R },
            { x: 369, y: 607, r: R },
            { x: 575, y: 346, r: R }
          ]
        },
        {
          id: "windkey",
          label: "\u0417\u0430\u0432\u043E\u0434\u043D\u044B\u0435 \u043A\u043B\u044E\u0447\u0438",
          spots: [
            { x: 488, y: 359, r: R },
            { x: 444, y: 392, r: R },
            { x: 744, y: 85, r: R }
          ]
        },
        {
          id: "brasscat",
          label: "\u041B\u0430\u0442\u0443\u043D\u043D\u044B\u0439 \u043A\u043E\u0442",
          spots: [{ x: 800, y: 398, r: R + 10 }]
        },
        {
          id: "blueprint",
          label: "\u0427\u0435\u0440\u0442\u0435\u0436\u0438",
          spots: [
            { x: 719, y: 287, r: R },
            { x: 600, y: 431, r: R },
            { x: 175, y: 340, r: R }
          ]
        }
      ],
      rewards: [{ type: "coins", amount: 350 }, { type: "seals", amount: 2 }],
      intro: "\u041A\u0440\u0430\u0439 \u0432\u0440\u0435\u043C\u0451\u043D. \u041B\u0430\u0442\u0443\u043D\u043D\u044B\u0439 \u043A\u043E\u0442 \u0437\u043D\u0430\u0435\u0442, \u043A\u0443\u0434\u0430 \u043F\u0440\u044F\u0447\u0443\u0442\u0441\u044F \u0432\u0441\u0435 \u043A\u0430\u0440\u043C\u0430\u043D\u043D\u044B\u0435 \u0447\u0430\u0441\u044B."
    }
  );

  // src/data/puzzlesPath.js
  var PATH_PUZZLES = [
    {
      id: "pp_01",
      world: "crossroads",
      mechanic: "path",
      name: "\u041F\u0435\u0440\u0432\u0430\u044F \u0442\u0440\u043E\u043F\u0438\u043D\u043A\u0430",
      difficulty: 1,
      grid: [3, 3],
      tiles: [
        { type: "start", pos: [0, 1], rot: 1, fixed: true },
        { type: "straight", pos: [1, 1], rot: 0 },
        { type: "corner", pos: [1, 0], rot: 0 },
        { type: "end", pos: [2, 1], rot: 3, fixed: true }
      ],
      rewards: [{ type: "coins", amount: 100 }],
      intro: "\u0422\u0430\u043F\u0430\u0439 \u043F\u043B\u0438\u0442\u043A\u0438 \u2014 \u043E\u043D\u0438 \u043F\u043E\u0432\u043E\u0440\u0430\u0447\u0438\u0432\u0430\u044E\u0442\u0441\u044F. \u041F\u0440\u043E\u0432\u0435\u0434\u0438 \u0442\u0440\u043E\u043F\u0438\u043D\u043A\u0443 \u043E\u0442 \u0434\u043E\u043C\u0438\u043A\u0430 \u043A \u0434\u0443\u0431\u0443."
    },
    {
      id: "pp_02",
      world: "crossroads",
      mechanic: "path",
      name: "\u041F\u0435\u0440\u0432\u044B\u0439 \u043F\u043E\u0432\u043E\u0440\u043E\u0442",
      difficulty: 1,
      grid: [3, 3],
      tiles: [
        { type: "start", pos: [0, 2], rot: 0, fixed: true },
        { type: "corner", pos: [0, 1], rot: 2 },
        { type: "corner", pos: [1, 1], rot: 0 },
        { type: "corner", pos: [1, 0], rot: 3 },
        { type: "straight", pos: [2, 2], rot: 0 },
        { type: "end", pos: [2, 0], rot: 3, fixed: true }
      ],
      rewards: [{ type: "coins", amount: 110 }],
      intro: "\u0422\u0440\u043E\u043F\u0438\u043D\u043A\u0430 \u043C\u043E\u0436\u0435\u0442 \u0438\u0437\u0432\u0438\u0432\u0430\u0442\u044C\u0441\u044F. \u0423\u0433\u043B\u044B \u2014 \u0442\u0432\u043E\u0438 \u0434\u0440\u0443\u0437\u044C\u044F."
    },
    {
      id: "pp_03",
      world: "crossroads",
      mechanic: "path",
      name: "\u0417\u043C\u0435\u0439\u043A\u0430 \u043A \u0440\u0443\u0447\u044C\u044E",
      difficulty: 2,
      grid: [4, 3],
      tiles: [
        { type: "start", pos: [0, 0], rot: 1, fixed: true },
        { type: "straight", pos: [1, 0], rot: 0 },
        { type: "corner", pos: [2, 0], rot: 0 },
        { type: "straight", pos: [2, 1], rot: 1 },
        { type: "corner", pos: [2, 2], rot: 2 },
        { type: "corner", pos: [1, 2], rot: 1 },
        { type: "end", pos: [3, 2], rot: 3, fixed: true }
      ],
      rewards: [{ type: "coins", amount: 120 }],
      intro: "\u0414\u043B\u0438\u043D\u043D\u044B\u0439 \u043F\u0443\u0442\u044C \u043A\u043E\u0440\u043E\u0447\u0435, \u0447\u0435\u043C \u043A\u0430\u0436\u0435\u0442\u0441\u044F."
    },
    {
      id: "pp_04",
      world: "crossroads",
      mechanic: "path",
      name: "\u0421\u043F\u044F\u0449\u0438\u0439 \u043A\u0430\u0431\u0430\u043D",
      difficulty: 2,
      grid: [4, 4],
      tiles: [
        { type: "start", pos: [0, 3], rot: 0, fixed: true },
        { type: "straight", pos: [0, 2], rot: 1 },
        { type: "corner", pos: [0, 1], rot: 3 },
        { type: "straight", pos: [1, 1], rot: 0 },
        { type: "corner", pos: [2, 1], rot: 3 },
        { type: "corner", pos: [2, 2], rot: 2 },
        { type: "beast", pos: [1, 2], rot: 0 },
        { type: "beast", pos: [3, 1], rot: 0 },
        { type: "end", pos: [3, 2], rot: 3, fixed: true }
      ],
      rewards: [{ type: "coins", amount: 130 }],
      intro: "\u0417\u0432\u0435\u0440\u0438 \u0441\u043F\u044F\u0442 \u2014 \u0442\u0440\u043E\u043F\u0438\u043D\u043A\u0435 \u0442\u0443\u0434\u0430 \u043D\u0435\u043B\u044C\u0437\u044F. \u041E\u0431\u043E\u0439\u0434\u0438 \u0438\u0445 \u0441\u0442\u043E\u0440\u043E\u043D\u043E\u0439."
    },
    {
      id: "pp_05",
      world: "crossroads",
      mechanic: "path",
      name: "\u0420\u0430\u0437\u0432\u0438\u043B\u043A\u0430",
      difficulty: 3,
      grid: [4, 4],
      tiles: [
        { type: "start", pos: [0, 1], rot: 1, fixed: true },
        { type: "tee", pos: [1, 1], rot: 0 },
        { type: "straight", pos: [2, 1], rot: 0 },
        { type: "straight", pos: [1, 2], rot: 1 },
        { type: "corner", pos: [1, 3], rot: 1 },
        { type: "beast", pos: [2, 2], rot: 0 },
        { type: "end", pos: [3, 1], rot: 3, fixed: true }
      ],
      rewards: [{ type: "coins", amount: 140 }],
      intro: "\u0422\u0440\u043E\u0439\u043D\u0438\u043A \u0440\u0430\u0437\u0432\u043E\u0434\u0438\u0442 \u0442\u0440\u043E\u043F\u0438\u043D\u043A\u0443 \u0432 \u0441\u0442\u043E\u0440\u043E\u043D\u044B. \u041B\u0438\u0448\u043D\u044F\u044F \u0432\u0435\u0442\u043A\u0430 \u043D\u0435 \u0441\u0442\u0440\u0430\u0448\u043D\u0430 \u2014 \u0433\u043B\u0430\u0432\u043D\u043E\u0435 \u0434\u043E\u0431\u0440\u0430\u0442\u044C\u0441\u044F."
    },
    {
      id: "pp_06",
      world: "crossroads",
      mechanic: "path",
      name: "\u041E\u0431\u0445\u043E\u0434 \u043B\u043E\u0433\u043E\u0432\u0430",
      difficulty: 3,
      grid: [5, 4],
      tiles: [
        { type: "start", pos: [0, 0], rot: 2, fixed: true },
        { type: "corner", pos: [0, 1], rot: 3 },
        { type: "straight", pos: [1, 1], rot: 0 },
        { type: "tee", pos: [2, 1], rot: 0 },
        { type: "corner", pos: [3, 1], rot: 1 },
        { type: "corner", pos: [3, 2], rot: 3 },
        { type: "straight", pos: [2, 2], rot: 1 },
        { type: "beast", pos: [2, 0], rot: 0 },
        { type: "beast", pos: [1, 0], rot: 0 },
        { type: "beast", pos: [1, 2], rot: 0 },
        { type: "end", pos: [4, 2], rot: 3, fixed: true }
      ],
      rewards: [{ type: "coins", amount: 155 }],
      intro: "\u041B\u043E\u0433\u043E\u0432\u043E \u0441\u043F\u0440\u0430\u0432\u0430 \u0441\u0432\u0435\u0440\u0445\u0443. \u0422\u0440\u043E\u043F\u0438\u043D\u043A\u0430 \u0438\u0434\u0451\u0442 \u043D\u0438\u0436\u043D\u0438\u043C \u043A\u0440\u0430\u0435\u043C."
    },
    {
      id: "pp_07",
      world: "crossroads",
      mechanic: "path",
      name: "\u0414\u0432\u0435 \u0440\u0430\u0437\u0432\u0438\u043B\u043A\u0438",
      difficulty: 4,
      grid: [5, 4],
      tiles: [
        { type: "start", pos: [0, 3], rot: 0, fixed: true },
        { type: "straight", pos: [0, 2], rot: 1 },
        { type: "corner", pos: [0, 1], rot: 3 },
        { type: "tee", pos: [1, 1], rot: 0 },
        { type: "straight", pos: [2, 1], rot: 0 },
        { type: "tee", pos: [3, 1], rot: 2 },
        { type: "corner", pos: [1, 2], rot: 2 },
        { type: "straight", pos: [3, 2], rot: 1 },
        { type: "corner", pos: [3, 3], rot: 1 },
        { type: "beast", pos: [2, 2], rot: 0 },
        { type: "end", pos: [4, 1], rot: 3, fixed: true }
      ],
      rewards: [{ type: "coins", amount: 170 }],
      intro: "\u0414\u0432\u0435 \u0440\u0430\u0437\u0432\u0438\u043B\u043A\u0438 \u043F\u043E\u0434\u0440\u044F\u0434. \u0414\u0435\u0440\u0436\u0438 \u043E\u0431\u0449\u0435\u0435 \u043D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043D\u0430 \u0432\u043E\u0441\u0442\u043E\u043A."
    },
    {
      id: "pp_08",
      world: "crossroads",
      mechanic: "path",
      name: "\u042F\u0440\u043C\u0430\u0440\u043E\u0447\u043D\u044B\u0439 \u043A\u0440\u0443\u0433",
      difficulty: 5,
      grid: [6, 5],
      tiles: [
        { type: "start", pos: [0, 4], rot: 0, fixed: true },
        { type: "corner", pos: [0, 3], rot: 3 },
        { type: "tee", pos: [1, 3], rot: 0 },
        { type: "straight", pos: [2, 3], rot: 0 },
        { type: "corner", pos: [3, 3], rot: 1 },
        { type: "corner", pos: [3, 4], rot: 2 },
        { type: "straight", pos: [4, 4], rot: 0 },
        { type: "straight", pos: [1, 2], rot: 1 },
        { type: "corner", pos: [1, 1], rot: 0 },
        { type: "corner", pos: [2, 0], rot: 1 },
        { type: "beast", pos: [2, 2], rot: 0 },
        { type: "beast", pos: [4, 2], rot: 0 },
        { type: "beast", pos: [4, 3], rot: 0 },
        { type: "corner", pos: [5, 1], rot: 2 },
        { type: "end", pos: [5, 4], rot: 3, fixed: true }
      ],
      rewards: [{ type: "coins", amount: 220 }, { type: "seals", amount: 1 }],
      intro: "\u0411\u043E\u043B\u044C\u0448\u043E\u0439 \u043A\u0440\u0443\u0433 \u0432\u043E\u043A\u0440\u0443\u0433 \u044F\u0440\u043C\u0430\u0440\u043A\u0438. \u0424\u0438\u043D\u0430\u043B \u043F\u0435\u0440\u0435\u043A\u0440\u0451\u0441\u0442\u043A\u0430!"
    }
  ];
  var PATH_PUZZLE_BY_ID = Object.fromEntries(PATH_PUZZLES.map((p) => [p.id, p]));

  // src/data/puzzlesTea.js
  var TEA_PUZZLES = [
    {
      id: "tea_01",
      world: "crossroads",
      mechanic: "tea",
      name: "\u041C\u044F\u0442\u043D\u044B\u0439 \u0434\u043B\u044F \u043C\u043E\u043A\u0440\u043E\u0433\u043E \u0441\u0442\u0440\u0430\u043D\u043D\u0438\u043A\u0430",
      difficulty: 1,
      target: { r: 0, g: 50, b: 0 },
      tolerance: 10,
      maxHeat: 50,
      ingredients: [
        { id: "mint", name: "\u041C\u044F\u0442\u0430", icon: "\u{1F33F}", dr: 0, dg: 25, db: 0, heat: -5, uses: 2 },
        { id: "water", name: "\u0420\u043E\u0434\u043D\u0438\u043A\u043E\u0432\u0430\u044F \u0432\u043E\u0434\u0430", icon: "\u{1F4A7}", dr: 0, dg: 0, db: 0, heat: -25, uses: 2 },
        { id: "fire", name: "\u041F\u043E\u043B\u0435\u0448\u043A\u043E", icon: "\u{1F525}", dr: 0, dg: 0, db: 0, heat: 20, uses: 1 }
      ],
      rewards: [{ type: "coins", amount: 100 }],
      intro: "\u0414\u043E\u0431\u0430\u0432\u043B\u044F\u0439 \u0438\u043D\u0433\u0440\u0435\u0434\u0438\u0435\u043D\u0442\u044B \u0432 \u043A\u043E\u0442\u0451\u043B. \u0426\u0432\u0435\u0442 \u043E\u0442\u0432\u0430\u0440\u0430 \u043F\u043E\u043A\u0430\u0437\u0430\u043D \u043F\u043E\u0434 \u043A\u043E\u0442\u043B\u043E\u043C, \u0446\u0435\u043B\u044C \u2014 \u043D\u0430 \u0444\u043B\u0430\u043A\u043E\u043D\u0435."
    },
    {
      id: "tea_02",
      world: "crossroads",
      mechanic: "tea",
      name: "\u041C\u0435\u0434\u043E\u0432\u044B\u0439 \u0432\u0435\u0447\u0435\u0440",
      difficulty: 1,
      target: { r: 45, g: 20, b: 0 },
      tolerance: 10,
      maxHeat: 60,
      ingredients: [
        { id: "honey", name: "\u041C\u0451\u0434", icon: "\u{1F36F}", dr: 15, dg: 10, db: 0, heat: 5, uses: 3 },
        { id: "berries", name: "\u042F\u0433\u043E\u0434\u044B", icon: "\u{1FAD0}", dr: 30, dg: 0, db: 15, heat: 5, uses: 1 },
        { id: "mint", name: "\u041C\u044F\u0442\u0430", icon: "\u{1F33F}", dr: 0, dg: 25, db: 0, heat: -5, uses: 1 },
        { id: "water", name: "\u0412\u043E\u0434\u0430", icon: "\u{1F4A7}", dr: 0, dg: 0, db: 0, heat: -25, uses: 1 }
      ],
      rewards: [{ type: "coins", amount: 110 }],
      intro: "\u041C\u0451\u0434 \u0434\u0430\u0451\u0442 \u0442\u0451\u043F\u043B\u044B\u0439 \u044F\u043D\u0442\u0430\u0440\u043D\u044B\u0439 \u0446\u0432\u0435\u0442. \u041D\u0435 \u0443\u0432\u043B\u0435\u043A\u0430\u0439\u0441\u044F \u044F\u0433\u043E\u0434\u0430\u043C\u0438."
    },
    {
      id: "tea_03",
      world: "crossroads",
      mechanic: "tea",
      name: "\u041A\u043E\u0440\u0430 \u0434\u0443\u0431\u0430 \u0434\u043B\u044F \u043B\u0435\u0441\u043D\u0438\u043A\u0430",
      difficulty: 2,
      target: { r: 20, g: 20, b: 40 },
      tolerance: 10,
      maxHeat: 55,
      ingredients: [
        { id: "bark", name: "\u041A\u043E\u0440\u0430", icon: "\u{1FAB5}", dr: 0, dg: 0, db: 20, heat: 0, uses: 2 },
        { id: "honey", name: "\u041C\u0451\u0434", icon: "\u{1F36F}", dr: 15, dg: 10, db: 0, heat: 5, uses: 2 },
        { id: "berries", name: "\u042F\u0433\u043E\u0434\u044B", icon: "\u{1FAD0}", dr: 30, dg: 0, db: 15, heat: 5, uses: 1 },
        { id: "mint", name: "\u041C\u044F\u0442\u0430", icon: "\u{1F33F}", dr: 0, dg: 25, db: 0, heat: -5, uses: 1 },
        { id: "water", name: "\u0412\u043E\u0434\u0430", icon: "\u{1F4A7}", dr: 0, dg: 0, db: 0, heat: -25, uses: 2 }
      ],
      rewards: [{ type: "coins", amount: 125 }],
      intro: "\u041A\u043E\u0440\u0430 \u0442\u044F\u043D\u0435\u0442 \u0432 \u0441\u0438\u043D\u0435\u0432\u0443, \u043C\u0451\u0434 \u2014 \u0432 \u044F\u043D\u0442\u0430\u0440\u044C. \u0411\u0430\u043B\u0430\u043D\u0441 \u2014 \u0432\u043E \u0432\u0441\u0451\u043C."
    },
    {
      id: "tea_04",
      world: "crossroads",
      mechanic: "tea",
      name: "\u042F\u0433\u043E\u0434\u043D\u044B\u0439, \u043D\u0435 \u043F\u0435\u0440\u0435\u0433\u0440\u0435\u0442\u044B\u0439",
      difficulty: 2,
      target: { r: 50, g: 0, b: 30 },
      tolerance: 10,
      maxHeat: 40,
      ingredients: [
        { id: "berries", name: "\u042F\u0433\u043E\u0434\u044B", icon: "\u{1FAD0}", dr: 30, dg: 0, db: 15, heat: 5, uses: 3 },
        { id: "fire", name: "\u041F\u043E\u043B\u0435\u0448\u043A\u043E", icon: "\u{1F525}", dr: 0, dg: 0, db: 0, heat: 20, uses: 2 },
        { id: "water", name: "\u0412\u043E\u0434\u0430", icon: "\u{1F4A7}", dr: 0, dg: 0, db: 0, heat: -25, uses: 2 },
        { id: "honey", name: "\u041C\u0451\u0434", icon: "\u{1F36F}", dr: 15, dg: 10, db: 0, heat: 5, uses: 1 },
        { id: "bark", name: "\u041A\u043E\u0440\u0430", icon: "\u{1FAB5}", dr: 0, dg: 0, db: 20, heat: 0, uses: 1 }
      ],
      rewards: [{ type: "coins", amount: 135 }],
      intro: "\u041F\u0443\u0442\u043D\u0438\u043A \u043F\u0440\u043E\u0441\u0438\u0442 \u044F\u0433\u043E\u0434\u043D\u044B\u0439, \u043D\u043E \u0445\u043E\u043B\u043E\u0434\u043D\u044B\u0439. \u041E\u0433\u043E\u043D\u044C \u0437\u0434\u0435\u0441\u044C \u2014 \u0438\u0441\u043A\u0443\u0448\u0435\u043D\u0438\u0435."
    },
    {
      id: "tea_05",
      world: "crossroads",
      mechanic: "tea",
      name: "\u041B\u0438\u043C\u043E\u043D\u043D\u0430\u044F \u043F\u043E\u043B\u044F\u043D\u0430",
      difficulty: 3,
      target: { r: 35, g: 45, b: 20 },
      tolerance: 8,
      maxHeat: 45,
      ingredients: [
        { id: "lemon", name: "\u041B\u0438\u043C\u043E\u043D", icon: "\u{1F34B}", dr: 10, dg: 20, db: 0, heat: 5, uses: 2 },
        { id: "honey", name: "\u041C\u0451\u0434", icon: "\u{1F36F}", dr: 15, dg: 10, db: 0, heat: 5, uses: 2 },
        { id: "bark", name: "\u041A\u043E\u0440\u0430", icon: "\u{1FAB5}", dr: 0, dg: 0, db: 20, heat: 0, uses: 2 },
        { id: "mint", name: "\u041C\u044F\u0442\u0430", icon: "\u{1F33F}", dr: 0, dg: 25, db: 0, heat: -5, uses: 2 },
        { id: "water", name: "\u0412\u043E\u0434\u0430", icon: "\u{1F4A7}", dr: 0, dg: 0, db: 0, heat: -25, uses: 1 },
        { id: "berries", name: "\u042F\u0433\u043E\u0434\u044B", icon: "\u{1FAD0}", dr: 30, dg: 0, db: 15, heat: 5, uses: 1 }
      ],
      rewards: [{ type: "coins", amount: 150 }],
      intro: "\u0422\u0440\u0438 \u043D\u043E\u0442\u044B: \u043B\u0438\u043C\u043E\u043D, \u043C\u0451\u0434 \u0438 \u043D\u0435\u043C\u043D\u043E\u0433\u043E \u043A\u043E\u0440\u044B. \u0414\u043E\u043F\u0443\u0441\u043A \u0436\u0451\u0441\u0442\u0447\u0435."
    },
    {
      id: "tea_06",
      world: "crossroads",
      mechanic: "tea",
      name: "\u041F\u0443\u0440\u043F\u0443\u0440 \u0441\u0443\u043C\u0435\u0440\u0435\u043A",
      difficulty: 3,
      target: { r: 60, g: 30, b: 60 },
      tolerance: 10,
      maxHeat: 50,
      ingredients: [
        { id: "berries", name: "\u042F\u0433\u043E\u0434\u044B", icon: "\u{1FAD0}", dr: 30, dg: 0, db: 15, heat: 5, uses: 3 },
        { id: "bark", name: "\u041A\u043E\u0440\u0430", icon: "\u{1FAB5}", dr: 0, dg: 0, db: 20, heat: 0, uses: 2 },
        { id: "honey", name: "\u041C\u0451\u0434", icon: "\u{1F36F}", dr: 15, dg: 10, db: 0, heat: 5, uses: 2 },
        { id: "mint", name: "\u041C\u044F\u0442\u0430", icon: "\u{1F33F}", dr: 0, dg: 25, db: 0, heat: -5, uses: 1 },
        { id: "water", name: "\u0412\u043E\u0434\u0430", icon: "\u{1F4A7}", dr: 0, dg: 0, db: 0, heat: -25, uses: 1 }
      ],
      rewards: [{ type: "coins", amount: 160 }],
      intro: "\u041F\u0443\u0440\u043F\u0443\u0440 \u2014 \u044D\u0442\u043E \u044F\u0433\u043E\u0434\u044B \u043F\u043B\u044E\u0441 \u043A\u043E\u0440\u0430, \u0430 \u0437\u0435\u043B\u0435\u043D\u044C \u043C\u044F\u0442\u044B \u0441\u043C\u044F\u0433\u0447\u0430\u0435\u0442 \u0442\u043E\u043D."
    },
    {
      id: "tea_07",
      world: "crossroads",
      mechanic: "tea",
      name: "\u0418\u0437\u0443\u043C\u0440\u0443\u0434\u043D\u044B\u0439 \u043A\u0430\u043F\u0440\u0438\u0437",
      difficulty: 4,
      target: { r: 25, g: 65, b: 35 },
      tolerance: 8,
      maxHeat: 35,
      ingredients: [
        { id: "mint", name: "\u041C\u044F\u0442\u0430", icon: "\u{1F33F}", dr: 0, dg: 25, db: 0, heat: -5, uses: 3 },
        { id: "lemon", name: "\u041B\u0438\u043C\u043E\u043D", icon: "\u{1F34B}", dr: 10, dg: 20, db: 0, heat: 5, uses: 2 },
        { id: "bark", name: "\u041A\u043E\u0440\u0430", icon: "\u{1FAB5}", dr: 0, dg: 0, db: 20, heat: 0, uses: 2 },
        { id: "honey", name: "\u041C\u0451\u0434", icon: "\u{1F36F}", dr: 15, dg: 10, db: 0, heat: 5, uses: 1 },
        { id: "water", name: "\u0412\u043E\u0434\u0430", icon: "\u{1F4A7}", dr: 0, dg: 0, db: 0, heat: -25, uses: 2 },
        { id: "berries", name: "\u042F\u0433\u043E\u0434\u044B", icon: "\u{1FAD0}", dr: 30, dg: 0, db: 15, heat: 5, uses: 1 }
      ],
      rewards: [{ type: "coins", amount: 175 }],
      intro: "\u0418\u0437\u0443\u043C\u0440\u0443\u0434\u043D\u044B\u0439 \u0446\u0432\u0435\u0442 \u043A\u0430\u043F\u0440\u0438\u0437\u0435\u043D: \u0448\u0430\u0433 \u0432\u043B\u0435\u0432\u043E, \u0448\u0430\u0433 \u0432\u043F\u0440\u0430\u0432\u043E \u2014 \u0438 \u043D\u0435 \u0442\u043E\u0442."
    },
    {
      id: "tea_08",
      world: "crossroads",
      mechanic: "tea",
      name: "\u042F\u043D\u0442\u0430\u0440\u044C \u044F\u0440\u043C\u0430\u0440\u043A\u0438",
      difficulty: 5,
      target: { r: 70, g: 50, b: 25 },
      tolerance: 8,
      maxHeat: 30,
      ingredients: [
        { id: "honey", name: "\u041C\u0451\u0434", icon: "\u{1F36F}", dr: 15, dg: 10, db: 0, heat: 5, uses: 3 },
        { id: "lemon", name: "\u041B\u0438\u043C\u043E\u043D", icon: "\u{1F34B}", dr: 10, dg: 20, db: 0, heat: 5, uses: 2 },
        { id: "berries", name: "\u042F\u0433\u043E\u0434\u044B", icon: "\u{1FAD0}", dr: 30, dg: 0, db: 15, heat: 5, uses: 2 },
        { id: "bark", name: "\u041A\u043E\u0440\u0430", icon: "\u{1FAB5}", dr: 0, dg: 0, db: 20, heat: 0, uses: 1 },
        { id: "mint", name: "\u041C\u044F\u0442\u0430", icon: "\u{1F33F}", dr: 0, dg: 25, db: 0, heat: -5, uses: 1 },
        { id: "water", name: "\u0412\u043E\u0434\u0430", icon: "\u{1F4A7}", dr: 0, dg: 0, db: 0, heat: -25, uses: 2 },
        { id: "fire", name: "\u041F\u043E\u043B\u0435\u0448\u043A\u043E", icon: "\u{1F525}", dr: 0, dg: 0, db: 0, heat: 20, uses: 1 }
      ],
      rewards: [{ type: "coins", amount: 220 }, { type: "seals", amount: 1 }],
      intro: "\u0424\u0438\u0440\u043C\u0435\u043D\u043D\u044B\u0439 \u044F\u043D\u0442\u0430\u0440\u044C \u043B\u0430\u0432\u043A\u0438. \u0425\u043E\u043B\u043E\u0434\u043D\u044B\u0439 \u043A\u043E\u0442\u0451\u043B, \u0436\u0451\u0441\u0442\u043A\u0438\u0439 \u0434\u043E\u043F\u0443\u0441\u043A \u2014 \u0432\u0435\u0440\u0448\u0438\u043D\u0430 \u0447\u0430\u0439\u043D\u043E\u0433\u043E \u0438\u0441\u043A\u0443\u0441\u0441\u0442\u0432\u0430."
    }
  ];
  var TEA_PUZZLE_BY_ID = Object.fromEntries(TEA_PUZZLES.map((p) => [p.id, p]));

  // src/data/puzzlesMech.js
  var MECH_PUZZLES = [
    {
      id: "mech_01",
      world: "crossroads",
      mechanic: "mech",
      name: "\u0420\u0436\u0430\u0432\u0430\u044F \u0440\u0443\u043A\u043E\u044F\u0442\u044C",
      difficulty: 1,
      grid: [3, 3],
      tiles: [
        { type: "start", pos: [0, 1], faces: [null, "pin", null, null], fixed: true },
        { type: "gear", pos: [1, 1], rot: 3, faces: [null, "pin", null, "socket"] },
        { type: "end", pos: [2, 1], faces: [null, null, null, "socket"], fixed: true }
      ],
      rewards: [{ type: "coins", amount: 100 }],
      intro: "\u0421\u0442\u0430\u0440\u0430\u044F \u0440\u0443\u043A\u043E\u044F\u0442\u044C \u0437\u0430\u0440\u0436\u0430\u0432\u0435\u043B\u0430. \u041F\u043E\u0432\u0435\u0440\u043D\u0438 \u0448\u0435\u0441\u0442\u0435\u0440\u0451\u043D\u043A\u0443 \u0442\u0430\u043A, \u0447\u0442\u043E\u0431\u044B \u0448\u0438\u043F \u0432\u043E\u0448\u0451\u043B \u0432 \u043F\u0430\u0437 \u2014 \u0438 \u043A\u043E\u043B\u043E\u043A\u043E\u043B\u044C\u0447\u0438\u043A \u0437\u0430\u0437\u0432\u0435\u043D\u0438\u0442."
    },
    {
      id: "mech_02",
      world: "crossroads",
      mechanic: "mech",
      name: "\u041F\u0435\u0440\u0432\u0430\u044F \u043F\u0435\u0440\u0435\u0434\u0430\u0447\u0430",
      difficulty: 1,
      grid: [3, 3],
      tiles: [
        { type: "start", pos: [0, 2], faces: ["pin", null, null, null], fixed: true },
        { type: "gear", pos: [0, 1], rot: 2, faces: [null, "pin", "socket", null] },
        { type: "gear", pos: [1, 1], rot: 1, faces: ["pin", null, null, "socket"] },
        { type: "end", pos: [1, 0], faces: [null, null, "socket", null], fixed: true }
      ],
      rewards: [{ type: "coins", amount: 110 }],
      intro: "\u041F\u0435\u0440\u0435\u0434\u0430\u0447\u0430 \u043C\u043E\u0436\u0435\u0442 \u043F\u043E\u0432\u043E\u0440\u0430\u0447\u0438\u0432\u0430\u0442\u044C \u0437\u0430 \u0443\u0433\u043E\u043B. \u0421\u043B\u0435\u0434\u0438, \u0433\u0434\u0435 \u0443 \u0448\u0435\u0441\u0442\u0435\u0440\u0451\u043D\u043A\u0438 \u0448\u0438\u043F, \u0430 \u0433\u0434\u0435 \u043F\u0430\u0437."
    },
    {
      id: "mech_03",
      world: "crossroads",
      mechanic: "mech",
      name: "\u041C\u0443\u0437\u044B\u043A\u0430\u043B\u044C\u043D\u0430\u044F \u0448\u043A\u0430\u0442\u0443\u043B\u043A\u0430",
      difficulty: 2,
      grid: [4, 3],
      tiles: [
        { type: "start", pos: [0, 0], faces: [null, "pin", null, null], fixed: true },
        { type: "gear", pos: [1, 0], rot: 1, faces: [null, null, "pin", "socket"] },
        { type: "gear", pos: [1, 1], rot: 3, faces: ["socket", "pin", null, null] },
        { type: "gear", pos: [2, 1], rot: 2, faces: [null, "pin", null, "socket"] },
        { type: "blocker", pos: [2, 0] },
        { type: "end", pos: [3, 1], faces: [null, null, null, "socket"], fixed: true }
      ],
      rewards: [{ type: "coins", amount: 120 }],
      intro: "\u0428\u043A\u0430\u0442\u0443\u043B\u043A\u0430 \u043F\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u0438\u043A\u0430 \u043C\u043E\u043B\u0447\u0438\u0442: \u043E\u0434\u043D\u0430 \u0434\u0435\u0442\u0430\u043B\u044C \u0437\u0430\u043A\u043B\u0438\u043D\u0438\u043B\u043E \u043D\u0430\u0441\u043C\u0435\u0440\u0442\u044C. \u0421\u043E\u0431\u0435\u0440\u0438 \u043F\u0435\u0440\u0435\u0434\u0430\u0447\u0443 \u0432 \u043E\u0431\u0445\u043E\u0434."
    },
    {
      id: "mech_04",
      world: "crossroads",
      mechanic: "mech",
      name: "\u0427\u0430\u0441\u043E\u0432\u043E\u0439 \u043C\u0435\u0445\u0430\u043D\u0438\u0437\u043C",
      difficulty: 2,
      grid: [4, 4],
      tiles: [
        { type: "start", pos: [0, 3], faces: ["pin", null, null, null], fixed: true },
        { type: "gear", pos: [0, 2], rot: 3, faces: [null, "pin", "socket", null] },
        { type: "gear", pos: [1, 2], rot: 2, faces: ["pin", null, null, "socket"] },
        { type: "gear", pos: [1, 1], rot: 1, faces: [null, "pin", "socket", null] },
        { type: "gear", pos: [2, 1], rot: 1, faces: [null, null, "pin", "socket"] },
        { type: "blocker", pos: [0, 1] },
        { type: "blocker", pos: [2, 3] },
        { type: "end", pos: [2, 2], faces: ["socket", null, null, null], fixed: true }
      ],
      rewards: [{ type: "coins", amount: 130 }],
      intro: "\u0427\u0430\u0441\u044B \u043B\u0430\u0432\u043A\u0438 \u0432\u0441\u0442\u0430\u043B\u0438. \u0417\u043C\u0435\u0439\u043A\u0430 \u0438\u0437 \u0447\u0435\u0442\u044B\u0440\u0451\u0445 \u0448\u0435\u0441\u0442\u0435\u0440\u0451\u043D\u043E\u043A \u2014 \u0438 \u043C\u0430\u044F\u0442\u043D\u0438\u043A \u0441\u043D\u043E\u0432\u0430 \u043A\u0430\u0447\u043D\u0451\u0442\u0441\u044F."
    },
    {
      id: "mech_05",
      world: "crossroads",
      mechanic: "mech",
      name: "\u041B\u0435\u0431\u0451\u0434\u043A\u0430 \u043A\u043E\u043B\u043E\u0434\u0446\u0430",
      difficulty: 3,
      grid: [4, 4],
      tiles: [
        { type: "start", pos: [0, 0], faces: [null, "pin", null, null], fixed: true },
        { type: "gear", pos: [1, 0], rot: 1, faces: [null, "pin", null, "socket"] },
        { type: "gear", pos: [2, 0], rot: 2, faces: [null, "socket", "pin", "socket"] },
        { type: "gear", pos: [3, 0], rot: 0, faces: [null, null, "socket", "pin"] },
        { type: "gear", pos: [2, 1], rot: 3, faces: ["socket", "pin", null, null] },
        { type: "blocker", pos: [1, 1] },
        { type: "blocker", pos: [0, 2] },
        { type: "end", pos: [3, 1], faces: [null, null, null, "socket"], fixed: true }
      ],
      rewards: [{ type: "coins", amount: 140 }],
      intro: "\u0423 \u043B\u0435\u0431\u0451\u0434\u043A\u0438 \u0435\u0441\u0442\u044C \u0448\u0435\u0441\u0442\u0435\u0440\u0451\u043D\u043A\u0430 \u0441 \u0442\u0440\u0435\u043C\u044F \u0433\u0440\u0430\u043D\u044F\u043C\u0438: \u043E\u0434\u043D\u0430 \u0432\u0435\u0442\u0432\u044C \u043A\u0440\u0443\u0442\u0438\u0442 \u0445\u043E\u043B\u043E\u0441\u0442\u043E\u0435 \u043A\u043E\u043B\u0435\u0441\u043E, \u0434\u0440\u0443\u0433\u0430\u044F \u2014 \u0431\u0430\u0440\u0430\u0431\u0430\u043D \u0441 \u043A\u043E\u043B\u043E\u043A\u043E\u043B\u044C\u0447\u0438\u043A\u043E\u043C."
    },
    {
      id: "mech_06",
      world: "crossroads",
      mechanic: "mech",
      name: "\u041C\u0435\u043B\u044C\u043D\u0438\u0447\u043D\u044B\u0439 \u043F\u0440\u0438\u0432\u043E\u0434",
      difficulty: 3,
      grid: [5, 4],
      tiles: [
        { type: "start", pos: [0, 0], faces: [null, null, "pin", null], fixed: true },
        { type: "gear", pos: [0, 1], rot: 2, faces: ["socket", "pin", null, null] },
        { type: "gear", pos: [1, 1], rot: 1, faces: [null, "pin", null, "socket"] },
        { type: "gear", pos: [2, 1], rot: 3, faces: [null, null, "pin", "socket"] },
        { type: "gear", pos: [2, 2], rot: 1, faces: ["socket", null, null, "pin"] },
        { type: "gear", pos: [1, 2], rot: 2, faces: [null, "socket", "pin", null] },
        { type: "blocker", pos: [0, 2] },
        { type: "blocker", pos: [3, 1] },
        { type: "end", pos: [1, 3], faces: ["socket", null, null, null], fixed: true }
      ],
      rewards: [{ type: "coins", amount: 155 }],
      intro: "\u041F\u0440\u0438\u0432\u043E\u0434 \u043C\u0438\u043D\u0438-\u043C\u0435\u043B\u044C\u043D\u0438\u0446\u044B \u043F\u0435\u0442\u043B\u044F\u0435\u0442 \u043F\u044F\u0442\u0451\u0440\u043A\u043E\u0439 \u0448\u0435\u0441\u0442\u0435\u0440\u0451\u043D\u043E\u043A. \u041C\u0443\u043A\u0430 \u0441\u0430\u043C\u0430 \u0441\u0435\u0431\u044F \u043D\u0435 \u0441\u043C\u0435\u043B\u0435\u0442!"
    },
    {
      id: "mech_07",
      world: "crossroads",
      mechanic: "mech",
      name: "\u041F\u043E\u0434\u044A\u0451\u043C\u043D\u0438\u043A \u043A\u043B\u0430\u0434\u043E\u0432\u043E\u0439",
      difficulty: 4,
      grid: [5, 4],
      tiles: [
        { type: "start", pos: [0, 3], faces: ["pin", null, null, null], fixed: true },
        { type: "gear", pos: [0, 2], rot: 1, faces: [null, "pin", "socket", null] },
        { type: "gear", pos: [1, 2], rot: 2, faces: ["pin", null, null, "socket"] },
        { type: "gear", pos: [1, 1], rot: 3, faces: [null, "pin", "socket", null] },
        { type: "gear", pos: [2, 1], rot: 1, faces: [null, null, "pin", "socket"] },
        { type: "gear", pos: [2, 2], rot: 2, faces: ["socket", "pin", null, null] },
        { type: "gear", pos: [3, 2], rot: 3, faces: [null, null, "pin", "socket"] },
        { type: "gear", pos: [0, 0], rot: 0, faces: [null, "socket", null, "pin"] },
        { type: "blocker", pos: [1, 3] },
        { type: "blocker", pos: [4, 1] },
        { type: "blocker", pos: [3, 0] },
        { type: "end", pos: [3, 3], faces: ["socket", null, null, null], fixed: true }
      ],
      rewards: [{ type: "coins", amount: 170 }],
      intro: "\u0414\u043B\u0438\u043D\u043D\u0430\u044F \u0446\u0435\u043F\u044C \u0438\u0437 \u0448\u0435\u0441\u0442\u0438 \u0448\u0435\u0441\u0442\u0435\u0440\u0451\u043D\u043E\u043A \u2014 \u0438 \u043E\u0434\u043D\u0430 \u043B\u0438\u0448\u043D\u044F\u044F \u0432\u0430\u043B\u044F\u0435\u0442\u0441\u044F \u0432 \u0443\u0433\u043B\u0443. \u041D\u0435 \u0432\u0441\u0435 \u0434\u0435\u0442\u0430\u043B\u0438 \u043E\u0431\u044F\u0437\u0430\u043D\u044B \u0440\u0430\u0431\u043E\u0442\u0430\u0442\u044C."
    },
    {
      id: "mech_08",
      world: "crossroads",
      mechanic: "mech",
      name: "\u042F\u0440\u043C\u0430\u0440\u043E\u0447\u043D\u044B\u0439 \u043A\u0430\u0440\u0438\u043B\u044C\u043E\u043D",
      difficulty: 5,
      grid: [6, 5],
      tiles: [
        { type: "start", pos: [0, 4], faces: [null, "pin", null, null], fixed: true },
        { type: "gear", pos: [1, 4], rot: 1, faces: ["pin", null, null, "socket"] },
        { type: "gear", pos: [1, 3], rot: 2, faces: [null, "pin", "socket", null] },
        { type: "gear", pos: [2, 3], rot: 3, faces: ["pin", "socket", null, "socket"] },
        { type: "gear", pos: [3, 3], rot: 1, faces: ["socket", null, null, "pin"] },
        { type: "gear", pos: [2, 2], rot: 1, faces: [null, "pin", "socket", null] },
        { type: "gear", pos: [3, 2], rot: 3, faces: [null, "pin", null, "socket"] },
        { type: "gear", pos: [4, 2], rot: 2, faces: ["pin", null, null, "socket"] },
        { type: "gear", pos: [4, 1], rot: 1, faces: [null, "pin", "socket", null] },
        { type: "blocker", pos: [0, 2] },
        { type: "blocker", pos: [2, 4] },
        { type: "blocker", pos: [5, 3] },
        { type: "blocker", pos: [3, 4] },
        { type: "end", pos: [5, 1], faces: [null, null, null, "socket"], fixed: true }
      ],
      rewards: [{ type: "coins", amount: 220 }, { type: "seals", amount: 1 }],
      intro: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u043C\u0435\u0445\u0430\u043D\u0438\u0437\u043C \u044F\u0440\u043C\u0430\u0440\u043A\u0438: \u0432\u043E\u0441\u0435\u043C\u044C \u0448\u0435\u0441\u0442\u0435\u0440\u0451\u043D\u043E\u043A, \u0437\u0430\u043A\u043B\u0438\u043D\u0438\u0432\u0448\u0438\u0435 \u0443\u0433\u043E\u043B\u043A\u0438 \u0438 \u0442\u0440\u043E\u0439\u043D\u0430\u044F \u043F\u0435\u0440\u0435\u0434\u0430\u0447\u0430. \u0417\u0430\u0441\u0442\u0430\u0432\u044C \u043A\u0430\u0440\u0438\u043B\u044C\u043E\u043D \u043F\u0435\u0442\u044C!"
    }
  ];
  var MECH_PUZZLE_BY_ID = Object.fromEntries(MECH_PUZZLES.map((p) => [p.id, p]));

  // src/data/puzzlesCandle.js
  var CANDLE_PUZZLES = [
    {
      id: "cd_01",
      world: "crossroads",
      mechanic: "candle",
      name: "\u041F\u0435\u0440\u0432\u0430\u044F \u0441\u0432\u0435\u0447\u0430",
      difficulty: 1,
      grid: [4, 4],
      walls: [],
      lanterns: [[2, 1]],
      spirits: [],
      radius: 2,
      candleLimit: 1,
      rewards: [{ type: "coins", amount: 100 }],
      intro: "\u0422\u0430\u043F\u043D\u0438 \u0441\u0432\u043E\u0431\u043E\u0434\u043D\u0443\u044E \u043A\u043B\u0435\u0442\u043A\u0443 \u2014 \u043F\u043E\u0441\u0442\u0430\u0432\u0438\u0448\u044C \u0441\u0432\u0435\u0447\u0443. \u0421\u0432\u0435\u0442 \u0440\u0430\u0437\u043E\u0439\u0434\u0451\u0442\u0441\u044F \u043D\u0430 2 \u043A\u043B\u0435\u0442\u043A\u0438 \u0432\u043E \u0432\u0441\u0435 \u0441\u0442\u043E\u0440\u043E\u043D\u044B. \u0417\u0430\u0436\u0433\u0438 \u0444\u043E\u043D\u0430\u0440\u044C!"
    },
    {
      id: "cd_02",
      world: "crossroads",
      mechanic: "candle",
      name: "\u0414\u0432\u0430 \u0444\u043E\u043D\u0430\u0440\u044F",
      difficulty: 1,
      grid: [5, 4],
      walls: [[2, 2]],
      lanterns: [[0, 0], [4, 3]],
      spirits: [],
      radius: 2,
      candleLimit: 2,
      rewards: [{ type: "coins", amount: 110 }],
      intro: "\u041E\u0434\u043D\u043E\u0439 \u0441\u0432\u0435\u0447\u043E\u0439 \u043E\u0431\u0430 \u0444\u043E\u043D\u0430\u0440\u044F \u043D\u0435 \u043E\u0445\u0432\u0430\u0442\u0438\u0442\u044C \u2014 \u043F\u0440\u0438\u0434\u0451\u0442\u0441\u044F \u043F\u043E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0434\u0432\u0435. \u0421\u0442\u0435\u043D\u0430 \u0432 \u0446\u0435\u043D\u0442\u0440\u0435 \u0441\u0432\u0435\u0442 \u043D\u0435 \u043F\u0440\u043E\u043F\u0443\u0441\u043A\u0430\u0435\u0442."
    },
    {
      id: "cd_03",
      world: "crossroads",
      mechanic: "candle",
      name: "\u041F\u0435\u0440\u0432\u044B\u0439 \u0434\u0443\u0445",
      difficulty: 2,
      grid: [5, 4],
      walls: [],
      lanterns: [[3, 1]],
      spirits: [[1, 1]],
      radius: 2,
      candleLimit: 1,
      rewards: [{ type: "coins", amount: 120 }],
      intro: "\u0414\u0443\u0445 \u043D\u0435 \u043F\u0435\u0440\u0435\u043D\u043E\u0441\u0438\u0442 \u0441\u0432\u0435\u0442\u0430 \u2014 \u043B\u0443\u0447 \u0435\u0433\u043E \u0442\u0440\u0435\u0432\u043E\u0436\u0438\u0442. \u0417\u0430\u0436\u0433\u0438 \u0444\u043E\u043D\u0430\u0440\u044C \u0442\u0430\u043A, \u0447\u0442\u043E\u0431\u044B \u0441\u0432\u0435\u0442 \u043D\u0435 \u043A\u043E\u0441\u043D\u0443\u043B\u0441\u044F \u0434\u0443\u0445\u0430."
    },
    {
      id: "cd_04",
      world: "crossroads",
      mechanic: "candle",
      name: "\u0421\u0442\u0435\u043D\u0430-\u0442\u0435\u043D\u044C",
      difficulty: 2,
      grid: [5, 5],
      walls: [[2, 0], [2, 1], [2, 2], [2, 3]],
      lanterns: [[0, 1]],
      spirits: [[3, 1]],
      radius: 3,
      candleLimit: 2,
      rewards: [{ type: "coins", amount: 135 }],
      intro: "\u0421\u0442\u0435\u043D\u044B \u043D\u0430\u0434\u0451\u0436\u043D\u043E \u043F\u0440\u044F\u0447\u0443\u0442 \u043E\u0442 \u0441\u0432\u0435\u0442\u0430. \u0421\u0432\u0435\u0442\u0438 \u0443 \u0444\u043E\u043D\u0430\u0440\u044F \u2014 \u0434\u0443\u0445 \u0437\u0430 \u0441\u0442\u0435\u043D\u043E\u0439 \u043D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u0437\u0430\u043C\u0435\u0442\u0438\u0442."
    },
    {
      id: "cd_05",
      world: "crossroads",
      mechanic: "candle",
      name: "\u0422\u0440\u0438 \u0444\u043E\u043D\u0430\u0440\u044F",
      difficulty: 3,
      grid: [6, 4],
      walls: [[2, 1], [3, 2]],
      lanterns: [[0, 0], [5, 0], [3, 3]],
      spirits: [[5, 3]],
      radius: 2,
      candleLimit: 3,
      rewards: [{ type: "coins", amount: 150 }],
      intro: "\u0422\u0440\u0438 \u0444\u043E\u043D\u0430\u0440\u044F, \u0442\u0440\u0438 \u0441\u0432\u0435\u0447\u0438 \u2014 \u0438 \u0434\u0443\u0445 \u043D\u0430 \u0441\u0442\u0440\u0430\u0436\u0435. \u041F\u0440\u043E\u0434\u0443\u043C\u0430\u0439 \u043A\u0430\u0436\u0434\u044B\u0439 \u0448\u0430\u0433."
    },
    {
      id: "cd_06",
      world: "crossroads",
      mechanic: "candle",
      name: "\u0414\u0430\u043B\u044C\u043D\u0438\u0439 \u0441\u0432\u0435\u0442",
      difficulty: 3,
      grid: [6, 4],
      walls: [[1, 2], [4, 1]],
      lanterns: [[0, 3], [5, 0]],
      spirits: [[2, 0], [3, 3]],
      radius: 3,
      candleLimit: 2,
      rewards: [{ type: "coins", amount: 165 }],
      intro: "\u0421\u0432\u0435\u0447\u0438 \u0433\u043E\u0440\u044F\u0442 \u044F\u0440\u0447\u0435: \u0440\u0430\u0434\u0438\u0443\u0441 3. \u0414\u0430\u043B\u0451\u043A\u0438\u0439 \u0441\u0432\u0435\u0442 \u043E\u043F\u0430\u0441\u0435\u043D \u2014 \u043F\u0440\u043E\u0432\u0435\u0440\u044C, \u043A\u043E\u0433\u043E \u043E\u043D \u0437\u0430\u0434\u0435\u043D\u0435\u0442."
    },
    {
      id: "cd_07",
      world: "crossroads",
      mechanic: "candle",
      name: "\u041B\u0430\u0431\u0438\u0440\u0438\u043D\u0442 \u0441\u0432\u0435\u0442\u0430",
      difficulty: 4,
      grid: [6, 5],
      walls: [[2, 0], [2, 1], [2, 2], [2, 3], [4, 1], [4, 2], [4, 3], [4, 4]],
      lanterns: [[0, 0], [3, 2], [5, 0]],
      spirits: [[0, 4], [5, 4]],
      radius: 3,
      candleLimit: 4,
      rewards: [{ type: "coins", amount: 185 }],
      intro: "\u0422\u0451\u043C\u043D\u044B\u0435 \u043A\u043E\u0440\u0438\u0434\u043E\u0440\u044B \u043F\u0435\u0442\u043B\u044F\u044E\u0442. \u041E\u0434\u043D\u0430 \u0443\u0434\u0430\u0447\u043D\u0430\u044F \u0441\u0432\u0435\u0447\u0430 \u0437\u0434\u0435\u0441\u044C \u043E\u0441\u0432\u0435\u0442\u0438\u0442 \u0441\u0440\u0430\u0437\u0443 \u0434\u0432\u0430 \u0444\u043E\u043D\u0430\u0440\u044F."
    },
    {
      id: "cd_08",
      world: "crossroads",
      mechanic: "candle",
      name: "\u0411\u0430\u043B \u0434\u0443\u0445\u043E\u0432",
      difficulty: 5,
      grid: [7, 5],
      walls: [[2, 0], [2, 1], [2, 3], [2, 4], [4, 0], [4, 1], [4, 3], [4, 4], [6, 2]],
      lanterns: [[0, 4], [3, 2], [6, 0]],
      spirits: [[1, 0], [3, 4], [5, 4]],
      radius: 3,
      candleLimit: 5,
      rewards: [{ type: "coins", amount: 220 }, { type: "seals", amount: 1 }],
      intro: "\u0422\u0440\u0438 \u0434\u0443\u0445\u0430 \u0443\u0441\u0442\u0440\u043E\u0438\u043B\u0438 \u0431\u0430\u043B \u0432 \u0442\u0435\u043C\u043D\u043E\u0442\u0435. \u0417\u0430\u0436\u0433\u0438 \u0432\u0441\u0435 \u0444\u043E\u043D\u0430\u0440\u0438, \u043D\u043E \u043D\u0438 \u043E\u0434\u0438\u043D \u043B\u0443\u0447 \u043D\u0435 \u0434\u043E\u043B\u0436\u0435\u043D \u043A\u043E\u0441\u043D\u0443\u0442\u044C\u0441\u044F \u0433\u043E\u0441\u0442\u0435\u0439!"
    }
  ];
  var CANDLE_PUZZLE_BY_ID = Object.fromEntries(CANDLE_PUZZLES.map((p) => [p.id, p]));

  // src/data/puzzlesFlow.js
  var FLOW_PUZZLES = [
    {
      id: "flow_01",
      world: "crossroads",
      mechanic: "flow",
      name: "\u041F\u0435\u0440\u0432\u044B\u0435 \u043E\u0433\u043D\u0438",
      difficulty: 1,
      grid: [4, 4],
      tiles: [
        { type: "start", pos: [0, 1], rot: 1, color: 0, fixed: true },
        { type: "arrow", pos: [1, 1], rot: 0 },
        { type: "arrow", pos: [2, 1], rot: 3 },
        { type: "stall", pos: [3, 1], color: 0 },
        { type: "start", pos: [0, 2], rot: 1, color: 1, fixed: true },
        { type: "arrow", pos: [1, 2], rot: 2 },
        { type: "arrow", pos: [2, 2], rot: 0 },
        { type: "stall", pos: [3, 2], color: 1 }
      ],
      rewards: [{ type: "coins", amount: 110 }],
      intro: "\u041D\u043E\u0447\u043D\u043E\u0439 \u0440\u044B\u043D\u043E\u043A \u043E\u0442\u043A\u0440\u044B\u0442! \u0422\u0430\u043F\u0430\u0439 \u0441\u0442\u0440\u0435\u043B\u043A\u0438 \u2014 \u043E\u043D\u0438 \u043F\u043E\u0432\u043E\u0440\u0430\u0447\u0438\u0432\u0430\u044E\u0442\u0441\u044F. \u041A\u0430\u0436\u0434\u044B\u0439 \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C \u0434\u043E\u043B\u0436\u0435\u043D \u0434\u043E\u0439\u0442\u0438 \u0434\u043E \u043B\u043E\u0442\u043A\u0430 \u0441\u0432\u043E\u0435\u0433\u043E \u0446\u0432\u0435\u0442\u0430."
    },
    {
      id: "flow_02",
      world: "crossroads",
      mechanic: "flow",
      name: "\u0421 \u0434\u0432\u0443\u0445 \u0441\u0442\u043E\u0440\u043E\u043D",
      difficulty: 1,
      grid: [4, 4],
      tiles: [
        { type: "start", pos: [0, 0], rot: 1, color: 0, fixed: true },
        { type: "arrow", pos: [1, 0], rot: 3 },
        { type: "arrow", pos: [2, 0], rot: 0 },
        { type: "arrow", pos: [2, 1], rot: 1 },
        { type: "stall", pos: [2, 2], color: 0 },
        { type: "start", pos: [3, 3], rot: 3, color: 1, fixed: true },
        { type: "arrow", pos: [2, 3], rot: 1 },
        { type: "arrow", pos: [1, 3], rot: 0 },
        { type: "stall", pos: [0, 3], color: 1 },
        { type: "wall", pos: [1, 1] }
      ],
      rewards: [{ type: "coins", amount: 120 }],
      intro: "\u041F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u0438 \u043F\u0440\u0438\u0445\u043E\u0434\u044F\u0442 \u0441 \u0440\u0430\u0437\u043D\u044B\u0445 \u043A\u043E\u043D\u0446\u043E\u0432 \u0440\u044B\u043D\u043A\u0430. \u0420\u0430\u0437\u0432\u0435\u0434\u0438 \u0438\u0445 \u043F\u0443\u0442\u0438 \u043F\u043E \u0443\u0433\u043B\u0430\u043C \u2014 \u0432\u0441\u0442\u0440\u0435\u0447\u0430\u0442\u044C\u0441\u044F \u0438\u043C \u043D\u0435\u043B\u044C\u0437\u044F."
    },
    {
      id: "flow_03",
      world: "crossroads",
      mechanic: "flow",
      name: "\u041C\u0435\u0436\u0434\u0443 \u044F\u0449\u0438\u043A\u043E\u0432",
      difficulty: 2,
      grid: [5, 4],
      tiles: [
        { type: "start", pos: [0, 0], rot: 1, color: 0, fixed: true },
        { type: "arrow", pos: [1, 0], rot: 3 },
        { type: "arrow", pos: [2, 0], rot: 0 },
        { type: "arrow", pos: [2, 1], rot: 1 },
        { type: "arrow", pos: [2, 2], rot: 2 },
        { type: "arrow", pos: [3, 2], rot: 0 },
        { type: "stall", pos: [4, 2], color: 0 },
        { type: "start", pos: [0, 3], rot: 1, color: 1, fixed: true },
        { type: "arrow", pos: [1, 3], rot: 2 },
        { type: "arrow", pos: [2, 3], rot: 0 },
        { type: "stall", pos: [3, 3], color: 1 },
        { type: "wall", pos: [3, 1] },
        { type: "wall", pos: [1, 2] }
      ],
      rewards: [{ type: "coins", amount: 130 }],
      intro: "\u041C\u0435\u0436\u0434\u0443 \u043F\u0440\u0438\u043B\u0430\u0432\u043A\u0430\u043C\u0438 \u0433\u0440\u0443\u0434\u044B \u044F\u0449\u0438\u043A\u043E\u0432. \u041E\u0431\u0432\u0435\u0434\u0438 \u043F\u043E\u0442\u043E\u043A \u043B\u0438\u0441\u0451\u043D\u043A\u0430 \u0441\u0432\u0435\u0440\u0445\u0443, \u0430 \u043B\u044F\u0433\u0443\u0448\u043E\u043D\u043A\u0430 \u2014 \u043D\u0438\u0436\u043D\u0438\u043C \u0440\u044F\u0434\u043E\u043C."
    },
    {
      id: "flow_04",
      world: "crossroads",
      mechanic: "flow",
      name: "\u0422\u0440\u043E\u0435 \u043D\u0430 \u0440\u044B\u043D\u043A\u0435",
      difficulty: 2,
      grid: [5, 4],
      tiles: [
        { type: "start", pos: [0, 0], rot: 1, color: 0, fixed: true },
        { type: "arrow", pos: [1, 0], rot: 0 },
        { type: "arrow", pos: [2, 0], rot: 2 },
        { type: "stall", pos: [3, 0], color: 0 },
        { type: "start", pos: [0, 2], rot: 1, color: 1, fixed: true },
        { type: "arrow", pos: [1, 2], rot: 0 },
        { type: "arrow", pos: [1, 3], rot: 3 },
        { type: "stall", pos: [2, 3], color: 1 },
        { type: "start", pos: [4, 3], rot: 0, color: 2, fixed: true },
        { type: "arrow", pos: [4, 2], rot: 1 },
        { type: "arrow", pos: [4, 1], rot: 2 },
        { type: "stall", pos: [4, 0], color: 2 },
        { type: "wall", pos: [2, 1] },
        { type: "wall", pos: [3, 2] }
      ],
      rewards: [{ type: "coins", amount: 140 }],
      intro: "\u0421\u0435\u0433\u043E\u0434\u043D\u044F \u0442\u0440\u043E\u0435 \u0437\u0430\u0440\u0430\u0437: \u043B\u0438\u0441\u0451\u043D\u043E\u043A, \u043B\u044F\u0433\u0443\u0448\u043E\u043D\u043E\u043A \u0438 \u0441\u0438\u043D\u0438\u0447\u043A\u0430. \u041A\u0430\u0436\u0434\u043E\u043C\u0443 \u2014 \u0441\u0432\u043E\u0439 \u043B\u043E\u0442\u043E\u043A, \u0438 \u0431\u0435\u0437 \u0442\u043E\u043B\u043A\u043E\u0442\u043D\u0438!"
    },
    {
      id: "flow_05",
      world: "crossroads",
      mechanic: "flow",
      name: "\u041F\u0435\u0440\u0435\u043A\u0440\u0451\u0441\u0442\u043D\u044B\u0435 \u043F\u043E\u0442\u043E\u043A\u0438",
      difficulty: 3,
      grid: [5, 5],
      tiles: [
        { type: "start", pos: [0, 0], rot: 2, color: 0, fixed: true },
        { type: "arrow", pos: [0, 1], rot: 0 },
        { type: "arrow", pos: [1, 1], rot: 2 },
        { type: "stall", pos: [2, 1], color: 0 },
        { type: "start", pos: [4, 4], rot: 3, color: 1, fixed: true },
        { type: "arrow", pos: [3, 4], rot: 1 },
        { type: "arrow", pos: [2, 4], rot: 2 },
        { type: "arrow", pos: [2, 3], rot: 0 },
        { type: "stall", pos: [1, 3], color: 1 },
        { type: "start", pos: [4, 0], rot: 2, color: 2, fixed: true },
        { type: "arrow", pos: [4, 1], rot: 3 },
        { type: "arrow", pos: [4, 2], rot: 1 },
        { type: "stall", pos: [3, 2], color: 2 },
        { type: "wall", pos: [1, 2] },
        { type: "wall", pos: [0, 3] },
        { type: "wall", pos: [3, 3] }
      ],
      rewards: [{ type: "coins", amount: 150 }],
      intro: "\u041F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u0438 \u0438\u0434\u0443\u0442 \u043D\u0430\u043F\u0435\u0440\u0435\u0440\u0435\u0437. \u0423\u0441\u0442\u0443\u043F\u0438 \u0434\u043E\u0440\u043E\u0433\u0443 \u0442\u0435\u043C, \u043A\u0442\u043E \u0434\u0432\u0438\u0436\u0435\u0442\u0441\u044F \u043A\u0440\u0430\u0435\u043C \u0440\u044B\u043D\u043A\u0430."
    },
    {
      id: "flow_06",
      world: "crossroads",
      mechanic: "flow",
      name: "\u0414\u0430\u043B\u044C\u043D\u0438\u0435 \u043B\u043E\u0442\u043A\u0438",
      difficulty: 3,
      grid: [6, 5],
      tiles: [
        { type: "start", pos: [0, 0], rot: 2, color: 0, fixed: true },
        { type: "arrow", pos: [0, 1], rot: 2 },
        { type: "arrow", pos: [1, 1], rot: 0 },
        { type: "arrow", pos: [2, 1], rot: 3 },
        { type: "stall", pos: [2, 2], color: 0 },
        { type: "start", pos: [5, 0], rot: 2, color: 1, fixed: true },
        { type: "arrow", pos: [5, 1], rot: 1 },
        { type: "arrow", pos: [4, 1], rot: 0 },
        { type: "arrow", pos: [4, 2], rot: 1 },
        { type: "stall", pos: [4, 3], color: 1 },
        { type: "start", pos: [0, 4], rot: 1, color: 2, fixed: true },
        { type: "arrow", pos: [1, 4], rot: 3 },
        { type: "arrow", pos: [2, 4], rot: 2 },
        { type: "stall", pos: [2, 3], color: 2 },
        { type: "wall", pos: [3, 1] },
        { type: "wall", pos: [1, 2] },
        { type: "wall", pos: [0, 3] },
        { type: "wall", pos: [5, 3] }
      ],
      rewards: [{ type: "coins", amount: 165 }],
      intro: "\u042F\u0440\u043C\u0430\u0440\u043A\u0430 \u0433\u0443\u0434\u0438\u0442, \u043B\u043E\u0442\u043A\u0438 \u0440\u0430\u0437\u0431\u0440\u043E\u0441\u0430\u043D\u044B \u0434\u0430\u043B\u0435\u043A\u043E. \u0414\u043B\u0438\u043D\u043D\u044B\u0439 \u043E\u0431\u0445\u043E\u0434 \u2014 \u0442\u043E\u0436\u0435 \u043F\u0443\u0442\u044C."
    },
    {
      id: "flow_07",
      world: "crossroads",
      mechanic: "flow",
      name: "\u0422\u0435\u0441\u043D\u044B\u0435 \u0440\u044F\u0434\u044B",
      difficulty: 4,
      grid: [6, 5],
      tiles: [
        { type: "start", pos: [0, 0], rot: 2, color: 0, fixed: true },
        { type: "arrow", pos: [0, 1], rot: 3 },
        { type: "arrow", pos: [1, 1], rot: 1 },
        { type: "arrow", pos: [2, 1], rot: 2 },
        { type: "stall", pos: [3, 1], color: 0 },
        { type: "start", pos: [5, 4], rot: 0, color: 1, fixed: true },
        { type: "arrow", pos: [5, 3], rot: 1 },
        { type: "arrow", pos: [4, 3], rot: 2 },
        { type: "stall", pos: [4, 2], color: 1 },
        { type: "start", pos: [0, 4], rot: 1, color: 2, fixed: true },
        { type: "arrow", pos: [1, 4], rot: 0 },
        { type: "arrow", pos: [2, 4], rot: 3 },
        { type: "arrow", pos: [2, 3], rot: 2 },
        { type: "stall", pos: [3, 3], color: 2 },
        { type: "wall", pos: [2, 2] },
        { type: "wall", pos: [1, 2] },
        { type: "wall", pos: [4, 1] }
      ],
      rewards: [{ type: "coins", amount: 180 }],
      intro: "\u0420\u044F\u0434\u044B \u0442\u0435\u0441\u043D\u044B\u0435: \u043E\u0434\u043D\u0430 \u043D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u0441\u0442\u0440\u0435\u043B\u043A\u0430 \u2014 \u0438 \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u0438 \u0441\u0442\u043E\u043B\u043A\u043D\u0443\u0442\u0441\u044F \u043B\u0431\u0430\u043C\u0438."
    },
    {
      id: "flow_08",
      world: "crossroads",
      mechanic: "flow",
      name: "\u0424\u0438\u043D\u0430\u043B\u044C\u043D\u0430\u044F \u043D\u043E\u0447\u044C \u044F\u0440\u043C\u0430\u0440\u043A\u0438",
      difficulty: 5,
      grid: [7, 6],
      tiles: [
        { type: "start", pos: [0, 0], rot: 2, color: 0, fixed: true },
        { type: "arrow", pos: [0, 1], rot: 0 },
        { type: "arrow", pos: [1, 1], rot: 3 },
        { type: "stall", pos: [2, 1], color: 0 },
        { type: "start", pos: [6, 0], rot: 2, color: 1, fixed: true },
        { type: "arrow", pos: [6, 1], rot: 1 },
        { type: "arrow", pos: [5, 1], rot: 3 },
        { type: "arrow", pos: [5, 2], rot: 0 },
        { type: "stall", pos: [4, 2], color: 1 },
        { type: "start", pos: [0, 5], rot: 1, color: 2, fixed: true },
        { type: "arrow", pos: [1, 5], rot: 2 },
        { type: "arrow", pos: [2, 5], rot: 1 },
        { type: "arrow", pos: [2, 4], rot: 3 },
        { type: "stall", pos: [3, 4], color: 2 },
        { type: "wall", pos: [3, 0] },
        { type: "wall", pos: [4, 1] },
        { type: "wall", pos: [1, 3] },
        { type: "wall", pos: [4, 4] },
        { type: "wall", pos: [6, 3] },
        { type: "wall", pos: [0, 3] }
      ],
      rewards: [{ type: "coins", amount: 240 }, { type: "seals", amount: 1 }],
      intro: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u043D\u043E\u0447\u044C \u044F\u0440\u043C\u0430\u0440\u043A\u0438! \u0422\u0440\u0438 \u043F\u043E\u0442\u043E\u043A\u0430 \u0447\u0435\u0440\u0435\u0437 \u0431\u043E\u043B\u044C\u0448\u043E\u0439 \u0440\u044B\u043D\u043E\u043A \u2014 \u0440\u0430\u0437\u0432\u0435\u0434\u0438 \u0432\u0441\u0435\u0445 \u0431\u0435\u0437 \u0435\u0434\u0438\u043D\u043E\u0439 \u0442\u043E\u043B\u0447\u043A\u0438."
    }
  ];
  var FLOW_PUZZLE_BY_ID = Object.fromEntries(FLOW_PUZZLES.map((p) => [p.id, p]));

  // src/data/puzzlesBrew.js
  var WATER = { id: "water", name: "\u0420\u043E\u0434\u043D\u0438\u043A\u043E\u0432\u0430\u044F \u0432\u043E\u0434\u0430", icon: "\u{1F4A7}" };
  var HONEY = { id: "honey", name: "\u0414\u0438\u043A\u0438\u0439 \u043C\u0451\u0434", icon: "\u{1F36F}" };
  var CHAMOMILE = { id: "chamomile", name: "\u0420\u043E\u043C\u0430\u0448\u043A\u0430", icon: "\u{1F33C}" };
  var MINT = { id: "mint", name: "\u041C\u044F\u0442\u0430 \u043F\u0435\u0440\u0435\u0447\u043D\u0430\u044F", icon: "\u{1F33F}" };
  var BERRIES = { id: "berries", name: "\u041B\u0435\u0441\u043D\u044B\u0435 \u044F\u0433\u043E\u0434\u044B", icon: "\u{1FAD0}" };
  var MUSHROOM = { id: "mushroom", name: "\u0421\u0432\u0435\u0442\u043B\u044F\u043A\u043E\u0432\u044B\u0439 \u0433\u0440\u0438\u0431", icon: "\u{1F344}" };
  var MOSS = { id: "moss", name: "\u0421\u0432\u0435\u0442\u044F\u0449\u0438\u0439\u0441\u044F \u043C\u043E\u0445", icon: "\u{1F7E2}" };
  var FEATHER = { id: "feather", name: "\u041F\u0435\u0440\u043E \u0441\u043E\u0432\u044B", icon: "\u{1FAB6}" };
  var SPIDER = { id: "spider", name: "\u041F\u0430\u0443\u0442\u0438\u043D\u043D\u0430\u044F \u043D\u0438\u0442\u044C", icon: "\u{1F578}\uFE0F" };
  var ROSE = { id: "rose", name: "\u041B\u0435\u043F\u0435\u0441\u0442\u043A\u0438 \u0440\u043E\u0437", icon: "\u{1F339}" };
  var SALT = { id: "salt", name: "\u0421\u043E\u043B\u044C", icon: "\u{1F9C2}" };
  var CHESTNUT = { id: "chestnut", name: "\u041A\u0430\u0448\u0442\u0430\u043D", icon: "\u{1F330}" };
  var STAR = { id: "star", name: "\u0417\u0432\u0451\u0437\u0434\u043D\u0430\u044F \u043F\u044B\u043B\u044C", icon: "\u{1F31F}" };
  var INK = { id: "ink", name: "\u041A\u0430\u043F\u043B\u044F \u0447\u0435\u0440\u043D\u0438\u043B", icon: "\u{1FADF}" };
  var ICE = { id: "ice", name: "\u041B\u044C\u0434\u0438\u043D\u043A\u0430", icon: "\u{1F9CA}" };
  var PEPPER = { id: "pepper", name: "\u041E\u0433\u043D\u0435\u043D\u043D\u044B\u0439 \u043F\u0435\u0440\u0435\u0446", icon: "\u{1F336}\uFE0F" };
  var BREW_PUZZLES = [
    {
      id: "brew_01",
      world: "brew",
      mechanic: "brew",
      name: "\u0420\u043E\u043C\u0430\u0448\u043A\u043E\u0432\u044B\u0439 \u0434\u043B\u044F \u043A\u043E\u0442\u0438\u043A\u0430",
      difficulty: 1,
      ingredients: [WATER, CHAMOMILE, HONEY],
      recipe: [
        { do: "add", ingredient: "water" },
        { do: "add", ingredient: "chamomile" },
        { do: "stir" }
      ],
      rewards: [{ type: "coins", amount: 110 }],
      intro: "\u041A\u043E\u0442-\u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u043F\u0440\u043E\u0441\u0442\u0443\u0434\u0438\u043B \u043D\u043E\u0441. \u0421\u0432\u0430\u0440\u0438 \u043F\u043E \u043A\u043D\u0438\u0433\u0435: \u0448\u0430\u0433\u0438 \u043F\u043E\u0434\u0441\u0432\u0435\u0447\u0435\u043D\u044B, \u043E\u0448\u0438\u0431\u0438\u0442\u044C\u0441\u044F \u043C\u043E\u0436\u043D\u043E \u0442\u0440\u0438\u0436\u0434\u044B."
    },
    {
      id: "brew_02",
      world: "brew",
      mechanic: "brew",
      name: "\u0421\u043E\u0433\u0440\u0435\u0432\u0430\u044E\u0449\u0438\u0439 \u0434\u043B\u044F \u0441\u0442\u043E\u0440\u043E\u0436\u0430",
      difficulty: 1,
      ingredients: [WATER, HONEY, BERRIES, ICE],
      recipe: [
        { do: "add", ingredient: "water" },
        { do: "heat" },
        { do: "add", ingredient: "honey" },
        { do: "stir" }
      ],
      rewards: [{ type: "coins", amount: 120 }],
      intro: "\u0421\u0442\u043E\u0440\u043E\u0436 \u043C\u0451\u0440\u0437\u043D\u0435\u0442 \u0443 \u0434\u0432\u0435\u0440\u0438. \u0412\u043E\u0434\u0443 \u0441\u043D\u0430\u0447\u0430\u043B\u0430 \u0433\u0440\u0435\u0435\u043C \u2014 \u0438\u043D\u0430\u0447\u0435 \u043C\u0451\u0434 \u043D\u0435 \u043F\u043E\u0439\u0434\u0451\u0442."
    },
    {
      id: "brew_03",
      world: "brew",
      mechanic: "brew",
      name: "\u041C\u044F\u0442\u043D\u044B\u0439 \u043E\u0442 \u043D\u0435\u0440\u0432\u043E\u0432",
      difficulty: 2,
      ingredients: [WATER, MINT, CHAMOMILE, HONEY, SALT],
      recipe: [
        { do: "add", ingredient: "water" },
        { do: "crush", ingredient: "mint" },
        { do: "stir" },
        { do: "wait" },
        { do: "cool" }
      ],
      rewards: [{ type: "coins", amount: 140 }],
      intro: "\u0422\u043E\u0440\u0433\u043E\u0432\u0435\u0446 \u0441 \u043F\u043B\u043E\u0449\u0430\u0434\u0438 \u0434\u0435\u0440\u0433\u0430\u0435\u0442\u0441\u044F. \u041C\u044F\u0442\u0443 \u0441\u043F\u0435\u0440\u0432\u0430 \u0440\u0430\u0441\u0442\u043E\u043B\u043A\u0438 \u0432 \u0441\u0442\u0443\u043F\u0435 \u2014 \u0436\u043C\u0438 \u043D\u0430 \u0441\u0442\u0443\u043F\u043A\u0443, \u043F\u043E\u0442\u043E\u043C \u043D\u0430 \u043C\u044F\u0442\u0443."
    },
    {
      id: "brew_04",
      world: "brew",
      mechanic: "brew",
      name: "\u0413\u0440\u0438\u0431\u043D\u043E\u0439 \u0441\u0432\u0435\u0442\u043B\u044F\u0447\u043E\u043A",
      difficulty: 2,
      ingredients: [WATER, MUSHROOM, MOSS, BERRIES, SALT],
      recipe: [
        { do: "add", ingredient: "water" },
        { do: "heat" },
        { do: "add", ingredient: "mushroom" },
        { do: "stir" },
        { do: "wait" },
        { do: "cool" }
      ],
      rewards: [{ type: "coins", amount: 150 }],
      intro: "\u0417\u0435\u043B\u044C\u0435, \u0447\u0442\u043E \u0441\u0432\u0435\u0442\u0438\u0442\u0441\u044F \u0432 \u0442\u0435\u043C\u043D\u043E\u0442\u0435. \u0413\u0440\u0438\u0431 \u043A\u043B\u0430\u0434\u0451\u043C \u0442\u043E\u043B\u044C\u043A\u043E \u0432 \u0433\u043E\u0440\u044F\u0447\u0443\u044E \u0432\u043E\u0434\u0443."
    },
    {
      id: "brew_05",
      world: "brew",
      mechanic: "brew",
      name: "\u042F\u0433\u043E\u0434\u043D\u043E\u0435 \u043E\u0431\u043E\u0434\u0440\u044F\u044E\u0449\u0435\u0435",
      difficulty: 3,
      ingredients: [WATER, BERRIES, CHESTNUT, HONEY, MUSHROOM, SALT, ICE, FEATHER],
      recipe: [
        { do: "add", ingredient: "water" },
        { do: "add", ingredient: "berries" },
        { do: "crush", ingredient: "chestnut" },
        { do: "heat" },
        { do: "stir" },
        { do: "add", ingredient: "honey" },
        { do: "wait" }
      ],
      rewards: [{ type: "coins", amount: 180 }],
      intro: "\u0414\u043B\u044F \u0440\u044B\u0446\u0430\u0440\u044F \u043F\u0435\u0440\u0435\u0434 \u043F\u043E\u0445\u043E\u0434\u043E\u043C. \u0421\u0442\u043E\u043B \u043F\u043E\u043B\u043E\u043D \u043B\u0438\u0448\u043D\u0435\u0433\u043E \u2014 \u0433\u043B\u044F\u0434\u0438 \u0432 \u043A\u043D\u0438\u0433\u0443, \u0430 \u043D\u0435 \u043F\u043E \u0441\u0442\u043E\u0440\u043E\u043D\u0430\u043C."
    },
    {
      id: "brew_06",
      world: "brew",
      mechanic: "brew",
      name: "\u0421\u043E\u0432\u0438\u043D\u043E\u0435 \u0437\u0435\u043B\u044C\u0435 \u0431\u043E\u0434\u0440\u043E\u0441\u0442\u0438",
      difficulty: 3,
      ingredients: [WATER, FEATHER, MINT, CHAMOMILE, BERRIES, SALT],
      recipe: [
        { do: "add", ingredient: "water" },
        { do: "heat" },
        { do: "add", ingredient: "feather" },
        { do: "stir" },
        { do: "add", ingredient: "mint" },
        { do: "cool" }
      ],
      hideRecipe: true,
      peekSeconds: 10,
      rewards: [{ type: "coins", amount: 210 }],
      intro: "\u0421\u043E\u0432\u0430-\u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430\u0440\u044C \u0434\u0438\u043A\u0442\u0443\u0435\u0442 \u043D\u0430 \u043F\u0430\u043C\u044F\u0442\u044C: \u0440\u0435\u0446\u0435\u043F\u0442 \u0432\u0438\u0434\u0435\u043D 10 \u0441\u0435\u043A\u0443\u043D\u0434, \u043F\u043E\u0442\u043E\u043C \u043A\u043D\u0438\u0433\u0430 \u0437\u0430\u043A\u0440\u044B\u0432\u0430\u0435\u0442\u0441\u044F. \u0417\u0430\u043F\u043E\u043C\u0438\u043D\u0430\u0439!"
    },
    {
      id: "brew_07",
      world: "brew",
      mechanic: "brew",
      name: "\u041F\u0430\u0443\u0442\u0438\u043D\u043D\u044B\u0439 \u0434\u043B\u044F \u0441\u043B\u0435\u0434\u043E\u043F\u044B\u0442\u0430",
      difficulty: 4,
      ingredients: [WATER, SPIDER, HONEY, MOSS, MUSHROOM, ROSE, ICE, INK],
      recipe: [
        { do: "add", ingredient: "water" },
        { do: "crush", ingredient: "spider" },
        { do: "add", ingredient: "honey" },
        { do: "heat" },
        { do: "stir" },
        { do: "wait" },
        { do: "add", ingredient: "moss" },
        { do: "stir" }
      ],
      hideRecipe: true,
      peekSeconds: 8,
      rewards: [{ type: "coins", amount: 250 }, { type: "seals", amount: 1 }],
      intro: "\u0421\u043B\u0435\u0434\u043E\u043F\u044B\u0442 \u043F\u043B\u0430\u0442\u0438\u0442 \u043F\u0435\u0447\u0430\u0442\u044C\u044E. 8 \u0441\u0435\u043A\u0443\u043D\u0434 \u043D\u0430 \u0440\u0435\u0446\u0435\u043F\u0442 \u0438\u0437 \u0432\u043E\u0441\u044C\u043C\u0438 \u0448\u0430\u0433\u043E\u0432 \u2014 \u043F\u043E\u0442\u043E\u043C \u043F\u043E \u043F\u0430\u043C\u044F\u0442\u0438."
    },
    {
      id: "brew_08",
      world: "brew",
      mechanic: "brew",
      name: "\u0417\u0432\u0451\u0437\u0434\u043D\u044B\u0439 \u044D\u043B\u0438\u043A\u0441\u0438\u0440 \u043C\u0430\u0441\u0442\u0435\u0440\u0430",
      difficulty: 5,
      ingredients: [WATER, STAR, HONEY, ROSE, FEATHER, INK, SALT, MUSHROOM, ICE, BERRIES, PEPPER],
      recipe: [
        { do: "add", ingredient: "water" },
        { do: "heat" },
        { do: "crush", ingredient: "star" },
        { do: "stir" },
        { do: "add", ingredient: "honey" },
        { do: "wait" },
        { do: "add", ingredient: "rose" },
        { do: "cool" },
        { do: "add", ingredient: "feather" },
        { do: "stir" }
      ],
      hideRecipe: true,
      peekSeconds: 8,
      rewards: [{ type: "coins", amount: 320 }, { type: "seals", amount: 2 }],
      intro: "\u0412\u0435\u0440\u0448\u0438\u043D\u0430 \u0430\u043B\u0445\u0438\u043C\u0438\u0438: \u0434\u0435\u0441\u044F\u0442\u044C \u0448\u0430\u0433\u043E\u0432, \u043F\u043E\u043B\u043D\u044B\u0439 \u0441\u0442\u043E\u043B \u043E\u0442\u0432\u043B\u0435\u043A\u0430\u044E\u0449\u0435\u0433\u043E \u0438 \u0432\u0441\u0435\u0433\u043E 8 \u0441\u0435\u043A\u0443\u043D\u0434 \u043D\u0430 \u0440\u0435\u0446\u0435\u043F\u0442."
    },
    {
      id: "brew_09",
      world: "brew",
      mechanic: "brew",
      name: "\u0423\u043A\u0440\u0435\u043F\u043B\u044F\u044E\u0449\u0435\u0435 \u043D\u0430 \u0432\u043A\u0443\u0441",
      difficulty: 4,
      ingredients: [WATER, BERRIES, HONEY, CHESTNUT, MINT, SALT, PEPPER, INK],
      recipe: [
        { do: "add", ingredient: "water" },
        { do: "heat" },
        { anyOf: [{ do: "add", ingredient: "berries" }, { do: "add", ingredient: "honey" }] },
        { do: "stir" },
        { anyOf: [{ do: "crush", ingredient: "chestnut" }, { do: "crush", ingredient: "mint" }] },
        { do: "wait" },
        { do: "cool" }
      ],
      rewards: [{ type: "coins", amount: 280 }, { type: "seals", amount: 1 }],
      intro: "\u0420\u0435\u0446\u0435\u043F\u0442 \u0440\u0430\u0441\u043F\u043B\u044B\u0432\u0447\u0430\u0442, \u043A\u0430\u043A \u043F\u0430\u043C\u044F\u0442\u044C \u0431\u0430\u0431\u0443\u0448\u043A\u0438: \u043A\u043E\u0435-\u0433\u0434\u0435 \u043D\u0430\u043F\u0438\u0441\u0430\u043D\u043E \xAB\u0447\u0442\u043E \u043F\u043E\u0434 \u0440\u0443\u043A\u043E\u0439\xBB. \u0427\u0438\u0442\u0430\u0439 \xAB\u0418\u041B\u0418\xBB \u2014 \u0433\u043E\u0434\u0438\u0442\u0441\u044F \u043B\u044E\u0431\u043E\u0439 \u0432\u0430\u0440\u0438\u0430\u043D\u0442."
    },
    {
      id: "brew_10",
      world: "brew",
      mechanic: "brew",
      name: "\u042D\u043B\u0438\u043A\u0441\u0438\u0440 \u0445\u043E\u0437\u044F\u0438\u043D\u0430 \u043B\u0430\u0432\u043A\u0438",
      difficulty: 5,
      ingredients: [WATER, STAR, ROSE, FEATHER, BERRIES, HONEY, MOSS, PEPPER, ICE, INK],
      recipe: [
        { do: "add", ingredient: "water" },
        { do: "heat" },
        { anyOf: [{ do: "add", ingredient: "star" }, { do: "crush", ingredient: "star" }] },
        { do: "stir" },
        { anyOf: [{ do: "add", ingredient: "rose" }, { do: "add", ingredient: "berries" }] },
        { do: "wait" },
        { do: "cool" },
        { anyOf: [{ do: "add", ingredient: "feather" }, { do: "add", ingredient: "moss" }] },
        { do: "stir" }
      ],
      hideRecipe: true,
      peekSeconds: 8,
      rewards: [{ type: "coins", amount: 360 }, { type: "seals", amount: 3 }],
      intro: "\u0422\u0432\u043E\u0439 \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u0440\u0435\u0446\u0435\u043F\u0442, \u0445\u043E\u0437\u044F\u0438\u043D. \u0412\u0430\u0440\u0438\u0430\u043D\u0442\u044B \xAB\u0418\u041B\u0418\xBB \u2014 \u043F\u043E \u043F\u0430\u043C\u044F\u0442\u0438, 8 \u0441\u0435\u043A\u0443\u043D\u0434. \u0413\u043E\u0440\u0434\u0438\u0441\u044C."
    }
  ];

  // src/data/worlds/nm.js
  var WORLD = {
    id: "nm",
    label: "\u{1F303} \u041D\u043E\u0447\u043D\u043E\u0439 \u0440\u044B\u043D\u043E\u043A",
    enemies: [
      {
        id: "nm_moth",
        name: "\u042F\u043D\u0442\u0430\u0440\u043D\u044B\u0439 \u043C\u043E\u0442\u044B\u043B\u0451\u043A",
        icon: "\u{1F98B}",
        hp: 80,
        attack: 15,
        armor: 8,
        speed: 14,
        crit: 0.06,
        dodge: 0.14,
        elem: "phys",
        skills: ["pollen_sleep"],
        reward: { coins: [70, 95], materials: ["nm_moth_dust"] }
      },
      {
        id: "nm_mask",
        name: "\u041E\u0436\u0438\u0432\u0448\u0430\u044F \u043C\u0430\u0441\u043A\u0430",
        icon: "\u{1F3AD}",
        hp: 95,
        attack: 18,
        armor: 10,
        speed: 11,
        crit: 0.07,
        dodge: 0.1,
        elem: "phys",
        skills: ["fear_chill"],
        tags: ["spirit"],
        reward: { coins: [80, 110], materials: ["nm_mask_shard"] }
      },
      {
        id: "nm_shadow",
        name: "\u041F\u0440\u0438\u043B\u0430\u0432\u043E\u0447\u043D\u0430\u044F \u0442\u0435\u043D\u044C",
        icon: "\u{1F312}",
        hp: 105,
        attack: 18,
        armor: 10,
        speed: 10,
        crit: 0.08,
        dodge: 0.1,
        elem: "phys",
        skills: ["sting_poison"],
        tags: ["spirit"],
        reward: { coins: [90, 120], materials: ["nm_shadow_ash"] }
      },
      {
        id: "nm_lantern",
        name: "\u0414\u0443\u0445 \u0444\u043E\u043D\u0430\u0440\u044F",
        icon: "\u{1F3EE}",
        hp: 90,
        attack: 19,
        armor: 10,
        speed: 9,
        crit: 0.06,
        dodge: 0.06,
        elem: "fire",
        skills: ["spit_fire"],
        tags: ["spirit"],
        reward: { coins: [85, 115], materials: ["nm_ember_oil"] }
      },
      {
        id: "nm_garland",
        name: "\u0413\u0438\u0440\u043B\u044F\u043D\u0434\u043D\u044B\u0439 \u0437\u043C\u0435\u0439",
        icon: "\u2728",
        hp: 120,
        attack: 17,
        armor: 16,
        speed: 8,
        crit: 0.04,
        dodge: 0.04,
        elem: "phys",
        skills: ["slow_spores", "regen_ally_skill"],
        tags: ["spirit"],
        reward: { coins: [95, 130], materials: ["nm_moth_dust"] }
      },
      {
        id: "nm_teller",
        name: "\u0422\u043E\u0440\u0433\u043E\u0432\u0435\u0446-\u0441\u043A\u0430\u0437\u0438\u0442\u0435\u043B\u044C",
        icon: "\u{1F5E3}\uFE0F",
        hp: 140,
        attack: 22,
        armor: 18,
        speed: 7,
        crit: 0.05,
        dodge: 0.03,
        elem: "phys",
        skills: ["heavy_blow", "regen_ally_skill"],
        reward: { coins: [110, 150], materials: ["nm_shadow_ash"] }
      },
      // Босс мира
      {
        id: "nm_boss_keeper",
        name: "\u0425\u043E\u0437\u044F\u0438\u043D \u043D\u043E\u0447\u043D\u043E\u0433\u043E \u0440\u044B\u043D\u043A\u0430",
        icon: "\u{1F3AA}",
        hp: 400,
        attack: 28,
        armor: 26,
        speed: 10,
        crit: 0.08,
        dodge: 0.05,
        elem: "fire",
        skills: ["heavy_blow", "fear_chill", "spit_fire"],
        boss: true,
        tags: ["spirit"],
        reward: { coins: [700, 950], seals: 5, materials: ["nm_market_crown"] }
      }
    ],
    materials: [
      {
        id: "nm_moth_dust",
        name: "\u041F\u044B\u043B\u044C\u0446\u0430 \u044F\u043D\u0442\u0430\u0440\u043D\u043E\u0433\u043E \u043C\u043E\u0442\u044B\u043B\u044C\u043A\u0430",
        icon: "\u{1F31F}",
        description: "\u041C\u0435\u0440\u0446\u0430\u0435\u0442 \u0432 \u0442\u0435\u043C\u043D\u043E\u0442\u0435 \u0442\u0451\u043F\u043B\u044B\u043C \u044F\u043D\u0442\u0430\u0440\u043D\u044B\u043C \u0441\u0432\u0435\u0442\u043E\u043C."
      },
      {
        id: "nm_mask_shard",
        name: "\u041E\u0441\u043A\u043E\u043B\u043E\u043A \u043E\u0436\u0438\u0432\u0448\u0435\u0439 \u043C\u0430\u0441\u043A\u0438",
        icon: "\u{1F3AD}",
        description: "\u041D\u0430 \u0433\u043B\u0430\u0434\u043A\u043E\u043C \u043B\u0430\u043A\u0435 \u0437\u0430\u0441\u0442\u044B\u043B\u0430 \u0447\u0443\u0436\u0430\u044F \u0443\u043B\u044B\u0431\u043A\u0430."
      },
      {
        id: "nm_shadow_ash",
        name: "\u041F\u0435\u043F\u0435\u043B \u043F\u0440\u0438\u043B\u0430\u0432\u043E\u0447\u043D\u043E\u0439 \u0442\u0435\u043D\u0438",
        icon: "\u{1F311}",
        description: "\u041B\u0451\u0433\u043A\u0438\u0439 \u043F\u0435\u043F\u0435\u043B, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u043F\u0440\u044F\u0447\u0435\u0442\u0441\u044F \u043E\u0442 \u0441\u0432\u0435\u0442\u0430."
      },
      {
        id: "nm_ember_oil",
        name: "\u041C\u0430\u0441\u043B\u043E \u0434\u0443\u0445\u043E\u0432 \u0444\u043E\u043D\u0430\u0440\u0435\u0439",
        icon: "\u{1F3EE}",
        description: "\u0413\u043E\u0440\u0438\u0442 \u0431\u0435\u0437 \u0434\u044B\u043C\u0430 \u0438 \u043D\u0435 \u0433\u0430\u0441\u043D\u0435\u0442 \u043F\u043E\u0434 \u0434\u043E\u0436\u0434\u0451\u043C."
      },
      {
        id: "nm_market_crown",
        name: "\u041A\u043E\u0440\u043E\u043D\u0430 \u0445\u043E\u0437\u044F\u0438\u043D\u0430 \u0440\u044B\u043D\u043A\u0430",
        icon: "\u{1F451}",
        description: "\u0417\u043D\u0430\u043A \u0432\u043B\u0430\u0441\u0442\u0438 \u043D\u0430\u0434 \u0432\u0441\u0435\u043C\u0438 \u043B\u0430\u0432\u043A\u0430\u043C\u0438 \u043D\u043E\u0447\u043D\u043E\u0433\u043E \u0440\u044B\u043D\u043A\u0430."
      }
    ],
    battles: [
      {
        id: "nm_01",
        name: "\u041F\u0435\u0440\u0432\u044B\u0439 \u0444\u043E\u043D\u0430\u0440\u044C",
        world: "nm",
        enemies: [{ id: "nm_moth", scale: 1.5 }],
        unlockAfter: "ex_boss",
        tip: "\u041E\u0434\u0438\u043D\u043E\u043A\u0438\u0439 \u043C\u043E\u0442\u044B\u043B\u0451\u043A \u0443\u0441\u044B\u043F\u043B\u044F\u0435\u0442. \u0411\u044B\u0441\u0442\u0440\u044B\u0439 \u0443\u0434\u0430\u0440 \u2014 \u0438 \u043F\u0443\u0442\u044C \u043E\u0442\u043A\u0440\u044B\u0442."
      },
      {
        id: "nm_02",
        name: "\u0420\u044F\u0434 \u0441 \u043C\u0430\u0441\u043A\u0430\u043C\u0438",
        world: "nm",
        enemies: [{ id: "nm_mask", scale: 1.52 }],
        unlockAfter: "nm_01",
        tip: "\u041C\u0430\u0441\u043A\u0430 \u043D\u0430\u0433\u043E\u043D\u044F\u0435\u0442 \u0441\u0442\u0440\u0430\u0445. \u0410\u043C\u0443\u043B\u0435\u0442 \u043E\u0442\u0432\u0430\u0433\u0438 \u0440\u0435\u0448\u0438\u0442 \u0432\u0441\u0451."
      },
      {
        id: "nm_03",
        name: "\u0422\u0435\u043D\u0438 \u043F\u043E\u0434 \u043F\u0440\u0438\u043B\u0430\u0432\u043A\u043E\u043C",
        world: "nm",
        enemies: [{ id: "nm_shadow", scale: 1.53 }, { id: "nm_moth", scale: 1.53 }],
        unlockAfter: "nm_02",
        tip: "\u042F\u0434 \u0438 \u0441\u043E\u043D \u0432 \u043F\u0430\u0440\u0435. \u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0432\u044B\u0431\u0435\u0439 \u043C\u043E\u0442\u044B\u043B\u044C\u043A\u0430."
      },
      {
        id: "nm_04",
        name: "\u0413\u0438\u0440\u043B\u044F\u043D\u0434\u044B \u043E\u0436\u0438\u0432\u0430\u044E\u0442",
        world: "nm",
        enemies: [{ id: "nm_garland", scale: 1.55 }, { id: "nm_moth", scale: 1.54 }],
        unlockAfter: "nm_03",
        tip: "\u0417\u043C\u0435\u0439 \u043B\u0435\u0447\u0438\u0442 \u0441\u0435\u0431\u044F \u0438 \u0437\u0430\u043C\u0435\u0434\u043B\u044F\u0435\u0442. \u0411\u0435\u0439 \u0435\u0433\u043E \u043F\u0435\u0440\u0432\u044B\u043C."
      },
      {
        id: "nm_05",
        name: "\u0416\u0430\u0440 \u043C\u0430\u0441\u043B\u044F\u043D\u044B\u0445 \u043B\u0430\u043C\u043F",
        world: "nm",
        enemies: [{ id: "nm_lantern", scale: 1.56 }, { id: "nm_lantern", scale: 1.55 }],
        unlockAfter: "nm_04",
        tip: "\u0414\u0432\u0430 \u0434\u0443\u0445\u0430 \u043E\u0433\u043D\u044F. \u0421\u043E\u043F\u0440\u043E\u0442\u0438\u0432\u043B\u0435\u043D\u0438\u0435 \u043E\u0433\u043D\u044E \u0441\u043F\u0430\u0441\u0451\u0442 \u043E\u0442 \u043E\u0436\u043E\u0433\u043E\u0432."
      },
      {
        id: "nm_06",
        name: "\u0421\u043A\u0430\u0437\u0438\u0442\u0435\u043B\u0438 \u0443 \u0436\u0430\u0440\u043E\u0432\u043D\u0438",
        world: "nm",
        enemies: [{ id: "nm_teller", scale: 1.57 }, { id: "nm_garland", scale: 1.56 }],
        unlockAfter: "nm_05",
        tip: "\u0421\u043A\u0430\u0437\u0438\u0442\u0435\u043B\u044C \u0431\u044C\u0451\u0442 \u0442\u044F\u0436\u0435\u043B\u043E, \u0437\u043C\u0435\u0439 \u0435\u0433\u043E \u043B\u0435\u0447\u0438\u0442. \u041D\u0435 \u0442\u044F\u043D\u0438 \u0431\u043E\u0439."
      },
      {
        id: "nm_07",
        name: "\u041C\u0430\u0441\u043A\u0438 \u0441\u043C\u0435\u044E\u0442\u0441\u044F \u0432 \u0442\u0435\u043C\u043D\u043E\u0442\u0435",
        world: "nm",
        enemies: [{ id: "nm_mask", scale: 1.58 }, { id: "nm_mask", scale: 1.58 }, { id: "nm_moth", scale: 1.58 }],
        unlockAfter: "nm_06",
        tip: "\u0421\u0442\u0440\u0430\u0445 \u0441 \u0434\u0432\u0443\u0445 \u0441\u0442\u043E\u0440\u043E\u043D \u0438 \u0441\u043E\u043D. \u0428\u043B\u0435\u043C \u0431\u0430\u0440\u0441\u0443\u043A\u0430 \u0441\u043D\u043E\u0432\u0430 \u0432 \u0434\u0435\u043B\u0435."
      },
      {
        id: "nm_08",
        name: "\u042F\u0434\u043E\u0432\u0438\u0442\u044B\u0439 \u0442\u0443\u043C\u0430\u043D \u0430\u0440\u043E\u043C\u0430\u0442\u043E\u0432",
        world: "nm",
        enemies: [{ id: "nm_shadow", scale: 1.6 }, { id: "nm_lantern", scale: 1.59 }, { id: "nm_garland", scale: 1.59 }],
        unlockAfter: "nm_07",
        tip: "\u042F\u0434, \u043E\u0433\u043E\u043D\u044C \u0438 \u043B\u0435\u0447\u0430\u0449\u0438\u0439 \u0437\u043C\u0435\u0439. \u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0432\u044B\u0431\u0435\u0439 \u0437\u043C\u0435\u044F."
      },
      {
        id: "nm_09",
        name: "\u0422\u0430\u043D\u0435\u0446 \u0444\u043E\u043D\u0430\u0440\u0435\u0439",
        world: "nm",
        enemies: [{ id: "nm_lantern", scale: 1.62 }, { id: "nm_mask", scale: 1.61 }, { id: "nm_moth", scale: 1.61 }],
        unlockAfter: "nm_08",
        tip: "\u041E\u0433\u043E\u043D\u044C, \u0441\u0442\u0440\u0430\u0445 \u0438 \u0441\u043E\u043D \u0440\u0430\u0437\u043E\u043C. \u0414\u0435\u0440\u0436\u0438 \u0437\u0435\u043B\u044C\u044F \u043D\u0430\u0433\u043E\u0442\u043E\u0432\u0435."
      },
      {
        id: "nm_10",
        name: "\u041D\u043E\u0447\u043D\u043E\u0439 \u0430\u0443\u043A\u0446\u0438\u043E\u043D",
        world: "nm",
        enemies: [{ id: "nm_teller", scale: 1.63 }, { id: "nm_shadow", scale: 1.62 }],
        unlockAfter: "nm_09",
        tip: "\u0422\u044F\u0436\u0451\u043B\u044B\u0439 \u0443\u0434\u0430\u0440 \u0438 \u044F\u0434. \u0413\u043B\u0443\u0448\u0438 \u0441\u043A\u0430\u0437\u0438\u0442\u0435\u043B\u044F \u043F\u0435\u0440\u0432\u044B\u043C."
      },
      {
        id: "nm_11",
        name: "\u0420\u043E\u0439 \u0443 \u043B\u0430\u043C\u043F",
        world: "nm",
        enemies: [{ id: "nm_moth", scale: 1.64 }, { id: "nm_moth", scale: 1.64 }, { id: "nm_moth", scale: 1.64 }],
        unlockAfter: "nm_10",
        tip: "\u0422\u0440\u043E\u0435 \u0443\u0441\u044B\u043F\u043B\u044F\u044E\u0449\u0438\u0445 \u043C\u043E\u0442\u044B\u043B\u044C\u043A\u043E\u0432. \u0417\u0430\u0449\u0438\u0442\u0430 \u043E\u0442 \u0441\u043D\u0430 \u0440\u0435\u0448\u0430\u0435\u0442 \u0431\u043E\u0439."
      },
      {
        id: "nm_12",
        name: "\u0422\u0435\u043D\u0435\u0432\u043E\u0439 \u0440\u044F\u0434",
        world: "nm",
        enemies: [{ id: "nm_shadow", scale: 1.66 }, { id: "nm_mask", scale: 1.65 }, { id: "nm_moth", scale: 1.64 }],
        unlockAfter: "nm_11",
        tip: "\u042F\u0434, \u0441\u0442\u0440\u0430\u0445 \u0438 \u0441\u043E\u043D. \u041F\u0440\u043E\u0442\u0438\u0432\u043E\u044F\u0434\u0438\u0435 \u0438 \u0448\u043B\u0435\u043C \u0431\u0430\u0440\u0441\u0443\u043A\u0430."
      },
      {
        id: "nm_13",
        name: "\u041C\u0430\u0441\u043B\u044F\u043D\u044B\u0439 \u043F\u043E\u0436\u0430\u0440",
        world: "nm",
        enemies: [{ id: "nm_lantern", scale: 1.67 }, { id: "nm_lantern", scale: 1.66 }, { id: "nm_garland", scale: 1.66 }],
        unlockAfter: "nm_12",
        tip: "\u041E\u0433\u043E\u043D\u044C \u0438 \u043B\u0435\u0447\u0430\u0449\u0438\u0439 \u0437\u043C\u0435\u0439. \u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0437\u043C\u0435\u0439, \u043F\u043E\u0442\u043E\u043C \u0444\u043E\u043D\u0430\u0440\u0438."
      },
      {
        id: "nm_14",
        name: "\u0411\u0430\u043B \u043C\u0430\u0441\u043E\u043A",
        world: "nm",
        enemies: [{ id: "nm_mask", scale: 1.68 }, { id: "nm_mask", scale: 1.68 }, { id: "nm_mask", scale: 1.68 }],
        unlockAfter: "nm_13",
        tip: "\u0422\u0440\u043E\u0439\u043D\u043E\u0439 \u0441\u0442\u0440\u0430\u0445. \u0411\u0435\u0437 \u0430\u043C\u0443\u043B\u0435\u0442\u0430 \u043E\u0442\u0432\u0430\u0433\u0438 \u043E\u0442\u0440\u044F\u0434 \u0434\u0440\u043E\u0433\u043D\u0435\u0442."
      },
      {
        id: "nm_15",
        name: "\u0413\u0438\u0440\u043B\u044F\u043D\u0434\u043D\u044B\u0439 \u043A\u043E\u0440\u0438\u0434\u043E\u0440",
        world: "nm",
        enemies: [{ id: "nm_garland", scale: 1.7 }, { id: "nm_garland", scale: 1.69 }, { id: "nm_teller", scale: 1.69 }],
        unlockAfter: "nm_14",
        tip: "\u0414\u0432\u0430 \u043B\u0435\u043A\u0430\u0440\u044F \u0438 \u0442\u044F\u0436\u0451\u043B\u044B\u0439 \u043A\u0443\u043B\u0430\u043A. \u041F\u0440\u043E\u0431\u0438\u0432\u0430\u0439 \u0441\u0442\u0440\u043E\u0439 \u0431\u044B\u0441\u0442\u0440\u043E."
      },
      {
        id: "nm_16",
        name: "\u0422\u0435\u043D\u0438 \u0441\u043A\u0443\u043F\u0430\u044E\u0442 \u0441\u0432\u0435\u0442",
        world: "nm",
        enemies: [{ id: "nm_shadow", scale: 1.71 }, { id: "nm_lantern", scale: 1.7 }, { id: "nm_moth", scale: 1.7 }],
        unlockAfter: "nm_15",
        tip: "\u042F\u0434, \u043E\u0433\u043E\u043D\u044C \u0438 \u0441\u043E\u043D. \u041F\u0440\u043E\u0442\u0438\u0432\u043E\u044F\u0434\u0438\u0435 \u0432\u0430\u0436\u043D\u0435\u0435 \u043E\u0433\u043D\u0435\u0443\u043F\u043E\u0440\u0430."
      },
      {
        id: "nm_17",
        name: "\u0421\u043A\u0430\u0437\u043A\u0438 \u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u043B\u0443\u043D\u043E\u0447\u0438",
        world: "nm",
        enemies: [{ id: "nm_teller", scale: 1.7 }, { id: "nm_teller", scale: 1.7 }, { id: "nm_moth", scale: 1.7 }],
        unlockAfter: "nm_16",
        tip: "\u0414\u0432\u0430 \u0441\u043A\u0430\u0437\u0438\u0442\u0435\u043B\u044F \u043B\u0435\u0447\u0430\u0442 \u0434\u0440\u0443\u0433 \u0434\u0440\u0443\u0433\u0430. \u0411\u0435\u0439 \u043E\u0434\u043D\u043E\u0433\u043E \u0434\u043E \u043A\u043E\u043D\u0446\u0430."
      },
      {
        id: "nm_18",
        name: "\u042F\u043D\u0442\u0430\u0440\u043D\u0430\u044F \u0431\u0443\u0440\u044F",
        world: "nm",
        enemies: [{ id: "nm_lantern", scale: 1.73 }, { id: "nm_lantern", scale: 1.73 }, { id: "nm_mask", scale: 1.72 }],
        unlockAfter: "nm_17",
        tip: "\u0421\u0442\u0435\u043D\u0430 \u043E\u0433\u043D\u044F \u0438 \u0441\u0442\u0440\u0430\u0445. \u041E\u0433\u043D\u0435\u0443\u043F\u043E\u0440\u043D\u0430\u044F \u0431\u0440\u043E\u043D\u044F \u2014 \u043B\u0443\u0447\u0448\u0438\u0439 \u0434\u0440\u0443\u0433."
      },
      {
        id: "nm_19",
        name: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439 \u043F\u0440\u0438\u043B\u0430\u0432\u043E\u043A",
        world: "nm",
        enemies: [{ id: "nm_teller", scale: 1.74 }, { id: "nm_garland", scale: 1.74 }, { id: "nm_lantern", scale: 1.73 }],
        unlockAfter: "nm_18",
        tip: "\u0412\u0441\u0451 \u0438 \u0441\u0440\u0430\u0437\u0443: \u043A\u0443\u043B\u0430\u043A, \u043B\u0435\u043A\u0430\u0440\u044C \u0438 \u043E\u0433\u043E\u043D\u044C. \u041F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0430."
      },
      {
        id: "nm_boss",
        name: "\u0425\u043E\u0437\u044F\u0438\u043D \u043D\u043E\u0447\u043D\u043E\u0433\u043E \u0440\u044B\u043D\u043A\u0430",
        world: "nm",
        enemies: [{ id: "nm_boss_keeper", scale: 1.75 }],
        unlockAfter: "nm_19",
        tip: "\u041E\u043D \u043F\u044B\u0448\u0435\u0442 \u0436\u0430\u0440\u043E\u043C \u0438 \u0441\u0442\u0440\u0430\u0445\u043E\u043C. \u041E\u0433\u043D\u0435\u0443\u043F\u043E\u0440 \u0438 \u043E\u0442\u0432\u0430\u0433\u0430 \u2014 \u0438 \u043A\u043E\u0440\u043E\u043D\u0430 \u0442\u0432\u043E\u044F."
      }
    ]
  };

  // src/data/worlds/sw.js
  var WORLD2 = {
    id: "sw",
    label: "\u{1F438} \u0421\u043A\u0430\u0437\u043E\u0447\u043D\u044B\u0435 \u0442\u043E\u043F\u0438",
    enemies: [
      {
        id: "sw_frog_guardian",
        name: "\u041B\u044F\u0433\u0443\u0448\u043A\u0430-\u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u0438\u0446\u0430",
        icon: "\u{1F438}",
        hp: 150,
        attack: 18,
        armor: 22,
        speed: 7,
        crit: 0.04,
        dodge: 0.02,
        elem: "phys",
        skills: ["heavy_blow"],
        reward: { coins: [70, 100], materials: ["sw_frog_amulet"] }
      },
      {
        id: "sw_bog_spirit",
        name: "\u0411\u043E\u043B\u043E\u0442\u043D\u044B\u0439 \u0434\u0443\u0445",
        icon: "\u{1F32B}\uFE0F",
        hp: 95,
        attack: 17,
        armor: 10,
        speed: 10,
        crit: 0.06,
        dodge: 0.14,
        elem: "phys",
        skills: ["fear_chill", "slow_spores"],
        tags: ["spirit"],
        reward: { coins: [65, 90], materials: ["sw_bog_mist"] }
      },
      {
        id: "sw_witch_cat",
        name: "\u0412\u0435\u0434\u044C\u043C\u0438\u043D \u043A\u043E\u0442",
        icon: "\u{1F408}\u200D\u2B1B",
        hp: 85,
        attack: 16,
        armor: 8,
        speed: 11,
        crit: 0.1,
        dodge: 0.1,
        elem: "phys",
        skills: ["aimed_shot", "sting_poison_weak"],
        reward: { coins: [60, 85], materials: ["sw_witch_thread"] }
      },
      {
        id: "sw_doll_trickster",
        name: "\u041A\u0443\u043A\u043B\u0430-\u043E\u0431\u043C\u0430\u043D\u0449\u0438\u0446\u0430",
        icon: "\u{1FA86}",
        hp: 105,
        attack: 15,
        armor: 12,
        speed: 9,
        crit: 0.05,
        dodge: 0.08,
        elem: "phys",
        skills: ["pollen_sleep", "fear_chill"],
        reward: { coins: [65, 90], materials: ["sw_witch_thread"] }
      },
      {
        id: "sw_glow_bush",
        name: "\u0421\u0432\u0435\u0442\u043E\u044F\u0433\u043E\u0434\u043D\u0438\u043A",
        icon: "\u{1FAD0}",
        hp: 120,
        attack: 14,
        armor: 14,
        speed: 6,
        crit: 0.03,
        dodge: 0.02,
        elem: "phys",
        skills: ["regen_ally_skill", "slow_spores"],
        reward: { coins: [70, 95], materials: ["sw_glow_berry"] }
      },
      {
        id: "sw_hut_walker",
        name: "\u0418\u0437\u0431\u0443\u0448\u043A\u0430-\u043F\u0440\u043E\u0445\u043E\u0436\u0430\u044F",
        icon: "\u{1F6D6}",
        hp: 160,
        attack: 22,
        armor: 20,
        speed: 6,
        crit: 0.05,
        dodge: 0,
        elem: "fire",
        skills: ["spit_fire", "heavy_blow"],
        reward: { coins: [85, 115], materials: ["sw_glow_berry"] }
      },
      // Босс мира
      {
        id: "sw_hag_queen",
        name: "\u0425\u043E\u0437\u044F\u0439\u043A\u0430 \u0422\u043E\u043F\u0435\u0439",
        icon: "\u{1F9D9}\u200D\u2640\uFE0F",
        hp: 350,
        attack: 26,
        armor: 24,
        speed: 10,
        crit: 0.1,
        dodge: 0.06,
        elem: "phys",
        skills: ["sting_poison", "fear_chill", "heavy_blow"],
        boss: true,
        reward: { coins: [450, 600], seals: 4, materials: ["sw_hag_crown"] }
      }
    ],
    materials: [
      { id: "sw_frog_amulet", name: "\u041B\u044F\u0433\u0443\u0448\u0430\u0447\u0438\u0439 \u043E\u0431\u0435\u0440\u0435\u0433", icon: "\u{1F438}", description: "\u0422\u0451\u043F\u043B\u044B\u0439 \u043A\u0430\u043C\u0435\u0448\u0435\u043A, \u0438\u0437\u0440\u0435\u0434\u043A\u0430 \u0442\u0438\u0445\u043E\u043D\u044C\u043A\u043E \u043A\u0432\u0430\u043A\u0430\u0435\u0442." },
      { id: "sw_bog_mist", name: "\u041A\u043B\u043E\u0447\u043E\u043A \u0442\u043E\u043F\u044F\u043D\u043E\u0433\u043E \u0442\u0443\u043C\u0430\u043D\u0430", icon: "\u{1F32B}\uFE0F", description: "\u041D\u0435 \u0440\u0430\u0441\u0441\u0435\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u0434\u0430\u0436\u0435 \u0432 \u043F\u043B\u043E\u0442\u043D\u043E \u0437\u0430\u043A\u0440\u044B\u0442\u043E\u0439 \u0431\u0430\u043D\u043A\u0435." },
      { id: "sw_witch_thread", name: "\u0412\u0435\u0434\u044C\u043C\u0438\u043D\u0430 \u043D\u0438\u0442\u044C", icon: "\u{1F9F5}", description: "\u0428\u044C\u0451\u0442 \u0441\u0430\u043C\u0430 \u0438 \u043A\u0443\u0441\u0430\u0435\u0442\u0441\u044F \u0441\u0430\u043C\u0430." },
      { id: "sw_glow_berry", name: "\u0421\u0432\u0435\u0442\u044F\u0449\u0430\u044F\u0441\u044F \u044F\u0433\u043E\u0434\u0430", icon: "\u{1FAD0}", description: "\u041C\u044F\u0433\u043A\u043E \u0441\u0432\u0435\u0442\u0438\u0442 \u0437\u0435\u043B\u0451\u043D\u044B\u043C, \u0440\u0430\u0441\u0442\u0451\u0442 \u0434\u0430\u0436\u0435 \u043D\u0430 \u043A\u0440\u044B\u0448\u0435 \u0438\u0437\u0431\u0443\u0448\u043A\u0438." },
      { id: "sw_hag_crown", name: "\u0412\u0435\u043D\u0435\u0446 \u0425\u043E\u0437\u044F\u0439\u043A\u0438 \u0422\u043E\u043F\u0435\u0439", icon: "\u{1F451}", description: "\u0422\u044F\u0436\u0451\u043B\u044B\u0439, \u043F\u0430\u0445\u043D\u0435\u0442 \u043A\u0443\u043F\u0430\u0432\u043E\u0439 \u0438 \u0431\u043E\u043B\u043E\u0442\u043D\u044B\u043C \u0434\u044B\u043C\u043E\u043C." }
    ],
    battles: [
      {
        id: "sw_01",
        name: "\u041A\u043E\u0447\u043A\u0438 \u0443 \u0442\u0440\u043E\u043F\u044B",
        world: "sw",
        enemies: [{ id: "sw_doll_trickster", scale: 1.6 }],
        unlockAfter: "nm_boss",
        tip: "\u041A\u0443\u043A\u043B\u0430 \u043D\u0430\u043F\u0435\u0432\u0430\u0435\u0442 \u043A\u043E\u043B\u044B\u0431\u0435\u043B\u044C\u043D\u0443\u044E \u0438 \u0443\u0441\u044B\u043F\u043B\u044F\u0435\u0442. \u041F\u0440\u0438\u0433\u043E\u0442\u043E\u0432\u044C \u0437\u0435\u043B\u044C\u0435 \u0431\u043E\u0434\u0440\u043E\u0441\u0442\u0438."
      },
      {
        id: "sw_02",
        name: "\u041A\u0432\u0430\u043A\u0430\u043D\u044C\u0435 \u0432 \u043A\u0430\u043C\u044B\u0448\u0430\u0445",
        world: "sw",
        enemies: [{ id: "sw_frog_guardian", scale: 1.61 }, { id: "sw_frog_guardian", scale: 1.61 }],
        unlockAfter: "sw_01",
        tip: "\u041B\u044F\u0433\u0443\u0448\u043A\u0438 \u0431\u044C\u044E\u0442 \u043D\u0430\u043E\u0442\u043C\u0430\u0448\u044C. \u041A\u0440\u0435\u043F\u043A\u0430\u044F \u0431\u0440\u043E\u043D\u044F \u0438 \u0449\u0438\u0442 \u2014 \u043B\u0443\u0447\u0448\u0438\u0439 \u043E\u0442\u0432\u0435\u0442."
      },
      {
        id: "sw_03",
        name: "\u0422\u0443\u043C\u0430\u043D \u043D\u0430\u0434 \u0432\u043E\u0434\u043E\u0439",
        world: "sw",
        enemies: [{ id: "sw_bog_spirit", scale: 1.63 }, { id: "sw_bog_spirit", scale: 1.63 }],
        unlockAfter: "sw_02",
        tip: "\u0414\u0443\u0445\u0438 \u043D\u0430\u0433\u043E\u043D\u044F\u044E\u0442 \u0441\u0442\u0440\u0430\u0445 \u0438 \u0437\u0430\u043C\u0435\u0434\u043B\u044F\u044E\u0442. \u041B\u0443\u043A \u0438 \u0442\u043E\u043F\u043E\u0440 \u0431\u044C\u044E\u0442 \u043F\u043E \u0434\u0443\u0445\u0430\u043C \u0431\u043E\u043B\u044C\u043D\u0435\u0435."
      },
      {
        id: "sw_04",
        name: "\u042F\u0433\u043E\u0434\u043D\u0430\u044F \u043F\u043E\u043B\u044F\u043D\u0430",
        world: "sw",
        enemies: [{ id: "sw_glow_bush", scale: 1.64 }, { id: "sw_witch_cat", scale: 1.64 }],
        unlockAfter: "sw_03",
        tip: "\u0421\u0432\u0435\u0442\u043E\u044F\u0433\u043E\u0434\u043D\u0438\u043A \u043B\u0435\u0447\u0438\u0442 \u0441\u0432\u043E\u0438\u0445 \u2014 \u0441\u0440\u0443\u0431\u0438 \u0435\u0433\u043E \u043F\u0435\u0440\u0432\u044B\u043C."
      },
      {
        id: "sw_05",
        name: "\u041A\u0443\u0440\u044C\u0438 \u0441\u043B\u0435\u0434\u044B",
        world: "sw",
        enemies: [{ id: "sw_hut_walker", scale: 1.66 }],
        unlockAfter: "sw_04",
        tip: "\u0418\u0437\u0431\u0443\u0448\u043A\u0430 \u0434\u044B\u0448\u0438\u0442 \u0436\u0430\u0440\u043A\u0438\u043C \u0434\u044B\u043C\u043E\u043C \u0438 \u0442\u043E\u043F\u0430\u0435\u0442 \u0442\u044F\u0436\u0435\u043B\u043E. \u0421\u043E\u043F\u0440\u043E\u0442\u0438\u0432\u043B\u0435\u043D\u0438\u0435 \u043E\u0433\u043D\u044E \u043F\u043E\u043C\u043E\u0436\u0435\u0442."
      },
      {
        id: "sw_06",
        name: "\u0412\u0435\u0434\u044C\u043C\u0438\u043D\u0430 \u0442\u0440\u043E\u043F\u0430",
        world: "sw",
        enemies: [{ id: "sw_witch_cat", scale: 1.67 }, { id: "sw_doll_trickster", scale: 1.67 }],
        unlockAfter: "sw_05",
        tip: "\u041A\u043E\u0442 \u0446\u0435\u043B\u0438\u0442\u0441\u044F \u043C\u0435\u0442\u043A\u043E, \u043A\u0443\u043A\u043B\u0430 \u0443\u0441\u044B\u043F\u043B\u044F\u0435\u0442. \u0414\u0435\u0440\u0436\u0438 \u0437\u0435\u043B\u044C\u044F \u043D\u0430\u0433\u043E\u0442\u043E\u0432\u0435."
      },
      {
        id: "sw_07",
        name: "\u0414\u0443\u0445 \u0438 \u043B\u0435\u043A\u0430\u0440\u044C",
        world: "sw",
        enemies: [{ id: "sw_bog_spirit", scale: 1.68 }, { id: "sw_glow_bush", scale: 1.68 }],
        unlockAfter: "sw_06",
        tip: "\u0414\u0443\u0445 \u043C\u043E\u0440\u043E\u0437\u0438\u0442 \u0441\u0442\u0440\u0430\u0445\u043E\u043C, \u0430 \u043A\u0443\u0441\u0442 \u0435\u0433\u043E \u043B\u0435\u0447\u0438\u0442. \u0420\u0430\u0437\u0431\u0435\u0440\u0438\u0441\u044C \u0441 \u043B\u0435\u043A\u0430\u0440\u0435\u043C \u043F\u0435\u0440\u0432\u044B\u043C."
      },
      {
        id: "sw_08",
        name: "\u0425\u043E\u0440\u043E\u0432\u043E\u0434 \u043A\u0443\u043A\u043E\u043B",
        world: "sw",
        enemies: [
          { id: "sw_doll_trickster", scale: 1.7 },
          { id: "sw_doll_trickster", scale: 1.7 },
          { id: "sw_witch_cat", scale: 1.7 }
        ],
        unlockAfter: "sw_07",
        tip: "\u0414\u0432\u0435 \u043A\u043E\u043B\u044B\u0431\u0435\u043B\u044C\u043D\u044B\u0435 \u0438 \u043C\u0435\u0442\u043A\u0438\u0439 \u043A\u043E\u0442. \u0417\u0435\u043B\u044C\u0435 \u0431\u043E\u0434\u0440\u043E\u0441\u0442\u0438 \u2014 \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E."
      },
      {
        id: "sw_09",
        name: "\u0411\u043E\u043B\u043E\u0442\u043D\u044B\u0439 \u043F\u0430\u0442\u0440\u0443\u043B\u044C",
        world: "sw",
        enemies: [{ id: "sw_frog_guardian", scale: 1.71 }, { id: "sw_bog_spirit", scale: 1.71 }],
        unlockAfter: "sw_08",
        tip: "\u0422\u043E\u043B\u0441\u0442\u0430\u044F \u0448\u043A\u0443\u0440\u0430 \u0441\u043F\u0435\u0440\u0435\u0434\u0438, \u0441\u0442\u0440\u0430\u0445 \u0438\u0437 \u0442\u0443\u043C\u0430\u043D\u0430. \u0410\u043C\u0443\u043B\u0435\u0442 \u043E\u0442\u0432\u0430\u0433\u0438 \u043F\u0440\u0438\u0433\u043E\u0434\u0438\u0442\u0441\u044F."
      },
      {
        id: "sw_10",
        name: "\u0414\u044B\u043C\u043D\u0430\u044F \u0438\u0437\u0431\u0443\u0448\u043A\u0430",
        world: "sw",
        enemies: [{ id: "sw_hut_walker", scale: 1.73 }, { id: "sw_glow_bush", scale: 1.73 }],
        unlockAfter: "sw_09",
        tip: "\u0418\u0437\u0431\u0443\u0448\u043A\u0430 \u043F\u043B\u044E\u0451\u0442\u0441\u044F \u0434\u044B\u043C\u043E\u043C, \u0430 \u044F\u0433\u043E\u0434\u044B \u0435\u0451 \u043B\u0435\u0447\u0430\u0442. \u0413\u0430\u0441\u0438 \u043A\u0443\u0441\u0442 \u043F\u0435\u0440\u0432\u044B\u043C."
      },
      {
        id: "sw_11",
        name: "\u041A\u043E\u0448\u043A\u0438\u043D\u044B \u0443\u043B\u043E\u0432\u043A\u0438",
        world: "sw",
        enemies: [
          { id: "sw_witch_cat", scale: 1.74 },
          { id: "sw_witch_cat", scale: 1.74 },
          { id: "sw_doll_trickster", scale: 1.74 }
        ],
        unlockAfter: "sw_10",
        tip: "\u0414\u0432\u0430 \u043A\u043E\u0442\u0430 \u0431\u044C\u044E\u0442 \u043F\u0440\u0438\u0446\u0435\u043B\u044C\u043D\u043E \u0438 \u0441\u043B\u0435\u0433\u043A\u0430 \u0442\u0440\u0430\u0432\u044F\u0442. \u041F\u0440\u043E\u0442\u0438\u0432\u043E\u044F\u0434\u0438\u0435 \u0438 \u0431\u043E\u0434\u0440\u043E\u0441\u0442\u044C."
      },
      {
        id: "sw_12",
        name: "\u041C\u0433\u043B\u0430 \u0441\u0433\u0443\u0449\u0430\u0435\u0442\u0441\u044F",
        world: "sw",
        enemies: [
          { id: "sw_bog_spirit", scale: 1.75 },
          { id: "sw_bog_spirit", scale: 1.75 },
          { id: "sw_glow_bush", scale: 1.75 }
        ],
        unlockAfter: "sw_11",
        tip: "\u0414\u0432\u043E\u0435 \u0434\u0443\u0445\u043E\u0432 \u043F\u043E\u0434 \u0437\u0430\u0449\u0438\u0442\u043E\u0439 \u043A\u0443\u0441\u0442\u0430-\u043B\u0435\u043A\u0430\u0440\u044F. \u0410\u043C\u0443\u043B\u0435\u0442 \u043E\u0442\u0432\u0430\u0433\u0438 \u0438 \u0442\u043E\u043F\u043E\u0440 \u0434\u0440\u043E\u0432\u043E\u0441\u0435\u043A\u0430."
      },
      {
        id: "sw_13",
        name: "\u042F\u0433\u043E\u0434\u043D\u044B\u0439 \u0434\u043E\u0437\u043E\u0440",
        world: "sw",
        enemies: [
          { id: "sw_glow_bush", scale: 1.77 },
          { id: "sw_frog_guardian", scale: 1.77 },
          { id: "sw_witch_cat", scale: 1.77 }
        ],
        unlockAfter: "sw_12",
        tip: "\u041B\u0435\u043A\u0430\u0440\u044C, \u0442\u0430\u043D\u043A \u0438 \u043C\u0435\u0442\u043A\u0438\u0439 \u0441\u0442\u0440\u0435\u043B\u043E\u043A. \u0420\u0435\u0436\u044C \u043B\u0435\u043A\u0430\u0440\u044F \u043F\u0435\u0440\u0432\u044B\u043C."
      },
      {
        id: "sw_14",
        name: "\u0421\u043A\u0440\u0438\u043F\u0443\u0447\u0438\u0439 \u0433\u043E\u0441\u0442\u044C",
        world: "sw",
        enemies: [{ id: "sw_hut_walker", scale: 1.78 }, { id: "sw_doll_trickster", scale: 1.78 }],
        unlockAfter: "sw_13",
        tip: "\u0418\u0437\u0431\u0443\u0448\u043A\u0430 \u0442\u043E\u043F\u0430\u0435\u0442, \u043A\u0443\u043A\u043B\u0430 \u043D\u0430\u043F\u0435\u0432\u0430\u0435\u0442. \u0421\u043E\u043D \u0438 \u043E\u0433\u043E\u043D\u044C \u0432 \u043E\u0434\u043D\u043E\u043C \u0431\u043E\u044E."
      },
      {
        id: "sw_15",
        name: "\u0422\u043E\u043F\u044F\u043D\u043E\u0435 \u0442\u0440\u0438\u043E",
        world: "sw",
        enemies: [
          { id: "sw_frog_guardian", scale: 1.65 },
          { id: "sw_bog_spirit", scale: 1.6 },
          { id: "sw_witch_cat", scale: 1.6 }
        ],
        unlockAfter: "sw_14",
        tip: "\u041B\u044F\u0433\u0443\u0448\u043A\u0430 \u0434\u0435\u0440\u0436\u0438\u0442 \u0441\u0442\u0440\u043E\u0439, \u0434\u0443\u0445 \u043C\u043E\u0440\u043E\u0437\u0438\u0442, \u043A\u043E\u0442 \u0434\u043E\u0431\u0438\u0432\u0430\u0435\u0442. \u041B\u0435\u043A\u0430\u0440\u044C \u0432 \u043E\u0442\u0440\u044F\u0434\u0435 \u043D\u0435 \u043F\u043E\u043C\u0435\u0448\u0430\u0435\u0442."
      },
      {
        id: "sw_16",
        name: "\u041A\u0443\u043A\u043E\u043B\u044C\u043D\u044B\u0439 \u0432\u0435\u0440\u0442\u0435\u043F",
        world: "sw",
        enemies: [
          { id: "sw_doll_trickster", scale: 1.81 },
          { id: "sw_doll_trickster", scale: 1.81 },
          { id: "sw_glow_bush", scale: 1.81 }
        ],
        unlockAfter: "sw_15",
        tip: "\u0414\u0432\u0435 \u043A\u0443\u043A\u043B\u044B \u0443\u0441\u044B\u043F\u043B\u044F\u044E\u0442, \u0430 \u043A\u0443\u0441\u0442 \u043B\u0435\u0447\u0438\u0442. \u0411\u043E\u0434\u0440\u043E\u0441\u0442\u044C \u2014 \u043D\u0430 \u043F\u0435\u0440\u0432\u044B\u0439 \u043F\u043B\u0430\u043D."
      },
      {
        id: "sw_17",
        name: "\u0414\u044B\u043C \u043D\u0430\u0434 \u0442\u043E\u043F\u044C\u044E",
        world: "sw",
        enemies: [
          { id: "sw_hut_walker", scale: 1.82 },
          { id: "sw_bog_spirit", scale: 1.82 },
          { id: "sw_witch_cat", scale: 1.82 }
        ],
        unlockAfter: "sw_16",
        tip: "\u041E\u0433\u043E\u043D\u044C, \u0441\u0442\u0440\u0430\u0445 \u0438 \u0442\u043E\u0447\u043D\u044B\u0435 \u0432\u044B\u0441\u0442\u0440\u0435\u043B\u044B. \u041F\u0440\u043E\u0432\u0435\u0440\u044C \u0441\u043E\u043F\u0440\u043E\u0442\u0438\u0432\u043B\u0435\u043D\u0438\u044F."
      },
      {
        id: "sw_18",
        name: "\u0412\u0435\u0434\u044C\u043C\u0438\u043D \u0441\u0431\u043E\u0440",
        world: "sw",
        enemies: [
          { id: "sw_witch_cat", scale: 1.84 },
          { id: "sw_doll_trickster", scale: 1.84 },
          { id: "sw_glow_bush", scale: 1.84 }
        ],
        unlockAfter: "sw_17",
        tip: "\u0412\u0441\u044F \u0432\u0435\u0434\u044C\u043C\u0438\u043D\u0430 \u0447\u0435\u043B\u044F\u0434\u044C \u0440\u0430\u0437\u043E\u043C: \u044F\u0434, \u0441\u043E\u043D \u0438 \u0432\u0440\u0430\u0436\u0435\u0441\u043A\u043E\u0435 \u043B\u0435\u0447\u0435\u043D\u0438\u0435."
      },
      {
        id: "sw_19",
        name: "\u0412\u0441\u0451 \u0431\u043E\u043B\u043E\u0442\u043E \u0440\u0430\u0437\u043E\u043C",
        world: "sw",
        enemies: [
          { id: "sw_hut_walker", scale: 1.85 },
          { id: "sw_glow_bush", scale: 1.83 },
          { id: "sw_doll_trickster", scale: 1.8 }
        ],
        unlockAfter: "sw_18",
        tip: "\u0418\u0437\u0431\u0443\u0448\u043A\u0443 \u043B\u0435\u0447\u0430\u0442 \u044F\u0433\u043E\u0434\u044B, \u043A\u0443\u043A\u043B\u0430 \u043D\u0430\u043F\u0435\u0432\u0430\u0435\u0442. \u0421\u0440\u0443\u0431\u0438 \u043A\u0443\u0441\u0442 \u0438 \u043D\u0435 \u0443\u0441\u043D\u0438."
      },
      {
        id: "sw_boss",
        name: "\u0425\u043E\u0437\u044F\u0439\u043A\u0430 \u0422\u043E\u043F\u0435\u0439",
        world: "sw",
        enemies: [{ id: "sw_hag_queen", scale: 1.6 }],
        unlockAfter: "sw_19",
        tip: "\u041E\u043D\u0430 \u0442\u0440\u0430\u0432\u0438\u0442, \u043D\u0430\u0433\u043E\u043D\u044F\u0435\u0442 \u0441\u0442\u0440\u0430\u0445 \u0438 \u0431\u044C\u0451\u0442 \u043D\u0430\u043E\u0442\u043C\u0430\u0448\u044C. \u0412\u043E\u0437\u044C\u043C\u0438 \u0432\u0441\u0451 \u043B\u0443\u0447\u0448\u0435\u0435, \u0447\u0442\u043E \u0435\u0441\u0442\u044C."
      }
    ]
  };

  // src/data/worlds/sf.js
  var WORLD3 = {
    id: "sf",
    label: "\u{1F3AA} \u0417\u0432\u0451\u0437\u0434\u043D\u0430\u044F \u044F\u0440\u043C\u0430\u0440\u043A\u0430",
    enemies: [
      {
        id: "sf_spirit",
        name: "\u0414\u0443\u0445 \u044F\u0440\u043C\u0430\u0440\u043A\u0438",
        icon: "\u2728",
        hp: 75,
        attack: 14,
        armor: 8,
        speed: 13,
        crit: 0.08,
        dodge: 0.16,
        elem: "phys",
        skills: ["fear_chill"],
        tags: ["spirit"],
        reward: { coins: [70, 100], materials: ["sf_spark"] }
      },
      {
        id: "sf_steed",
        name: "\u041A\u0430\u0440\u0443\u0441\u0435\u043B\u044C\u043D\u044B\u0439 \u043A\u043E\u043D\u0451\u043A",
        icon: "\u{1F3A0}",
        hp: 135,
        attack: 16,
        armor: 18,
        speed: 7,
        crit: 0.05,
        dodge: 0.02,
        elem: "phys",
        skills: ["heavy_blow"],
        reward: { coins: [85, 115], materials: ["sf_plank"] }
      },
      {
        id: "sf_guard",
        name: "\u0421\u0442\u0440\u0430\u0436 \u043F\u043E\u0440\u044F\u0434\u043A\u0430",
        icon: "\u{1F482}",
        hp: 105,
        attack: 17,
        armor: 15,
        speed: 9,
        crit: 0.1,
        dodge: 0.05,
        elem: "phys",
        skills: ["aimed_shot"],
        reward: { coins: [90, 120], materials: ["sf_ticket"] }
      },
      {
        id: "sf_firefly",
        name: "\u041E\u0433\u043D\u0435\u043D\u043D\u044B\u0439 \u0436\u043E\u043D\u0433\u043B\u0451\u0440",
        icon: "\u{1F525}",
        hp: 75,
        attack: 18,
        armor: 8,
        speed: 12,
        crit: 0.08,
        dodge: 0.1,
        elem: "fire",
        skills: ["spit_fire"],
        reward: { coins: [75, 105], materials: ["sf_candy"] }
      },
      {
        id: "sf_doll",
        name: "\u041A\u0443\u043A\u043B\u0430-\u0437\u0430\u0437\u044B\u0432\u0430\u043B\u0430",
        icon: "\u{1F38E}",
        hp: 70,
        attack: 14,
        armor: 10,
        speed: 11,
        crit: 0.06,
        dodge: 0.12,
        elem: "phys",
        skills: ["pollen_sleep"],
        reward: { coins: [70, 95], materials: ["sf_candy"] }
      },
      {
        id: "sf_wheel",
        name: "\u041E\u0436\u0438\u0432\u0448\u0435\u0435 \u043A\u043E\u043B\u0435\u0441\u043E",
        icon: "\u{1F3A1}",
        hp: 150,
        attack: 18,
        armor: 20,
        speed: 6,
        crit: 0.04,
        dodge: 0,
        elem: "phys",
        skills: ["heavy_blow", "slow_spores"],
        reward: { coins: [110, 150], materials: ["sf_plank"] }
      },
      // Босс мира
      {
        id: "sf_boss",
        name: "\u0427\u0435\u043C\u043F\u0438\u043E\u043D \u043C\u0438\u0440\u043E\u0432",
        icon: "\u{1F3C6}",
        hp: 350,
        attack: 26,
        armor: 24,
        speed: 10,
        crit: 0.12,
        dodge: 0.06,
        elem: "phys",
        skills: ["heavy_blow", "fear_chill", "regen_ally_skill"],
        boss: true,
        reward: { coins: [400, 550], seals: 4, materials: ["sf_champion_star"] }
      }
    ],
    materials: [
      { id: "sf_spark", name: "\u042F\u0440\u043C\u0430\u0440\u043E\u0447\u043D\u0430\u044F \u0438\u0441\u043A\u0440\u0430", icon: "\u2728", description: "\u0422\u0451\u043F\u043B\u044B\u0439 \u043E\u0433\u043E\u043D\u0451\u043A \u043D\u043E\u0447\u043D\u043E\u0433\u043E \u043F\u0440\u0430\u0437\u0434\u043D\u0438\u043A\u0430." },
      { id: "sf_plank", name: "\u0414\u043E\u0449\u0435\u0447\u043A\u0430 \u043A\u0430\u0440\u0443\u0441\u0435\u043B\u0438", icon: "\u{1F3A0}", description: "\u041F\u0430\u0445\u043D\u0435\u0442 \u043A\u0440\u0430\u0441\u043A\u043E\u0439 \u0438 \u043F\u043E\u043F\u0443\u0442\u043D\u044B\u043C \u0432\u0435\u0442\u0440\u043E\u043C." },
      { id: "sf_ticket", name: "\u0421\u0447\u0430\u0441\u0442\u043B\u0438\u0432\u044B\u0439 \u0431\u0438\u043B\u0435\u0442\u0438\u043A", icon: "\u{1F39F}\uFE0F", description: "\u041F\u043E\u043B\u0443\u0440\u0430\u0441\u0442\u0451\u0440\u0442\u044B\u0439, \u043D\u043E \u0443\u0434\u0430\u0447\u0430 \u0435\u0449\u0451 \u0432\u043D\u0443\u0442\u0440\u0438." },
      { id: "sf_candy", name: "\u0417\u0432\u0451\u0437\u0434\u043D\u0430\u044F \u043A\u0430\u0440\u0430\u043C\u0435\u043B\u044C", icon: "\u{1F36C}", description: "\u0421\u043B\u0430\u0434\u043A\u0430\u044F \u0438 \u0441\u043B\u0435\u0433\u043A\u0430 \u0438\u0441\u043A\u0440\u0438\u0442 \u043D\u0430 \u044F\u0437\u044B\u043A\u0435." },
      { id: "sf_champion_star", name: "\u0417\u0432\u0435\u0437\u0434\u0430 \u0447\u0435\u043C\u043F\u0438\u043E\u043D\u0430", icon: "\u{1F3C6}", description: "\u041D\u0430\u0433\u0440\u0430\u0434\u0430, \u043A\u043E\u0442\u043E\u0440\u0443\u044E \u043D\u043E\u0441\u044F\u0442 \u043D\u0430 \u0433\u0440\u0443\u0434\u0438." }
    ],
    battles: [
      {
        id: "sf_01",
        name: "\u041E\u0442\u043A\u0440\u044B\u0442\u0438\u0435 \u044F\u0440\u043C\u0430\u0440\u043A\u0438",
        world: "sf",
        enemies: [{ id: "sf_doll", scale: 1.7 }, { id: "sf_spirit", scale: 1.7 }],
        unlockAfter: "sw_boss",
        tip: "\u041A\u0443\u043A\u043B\u0430 \u0443\u0441\u044B\u043F\u043B\u044F\u0435\u0442, \u0434\u0443\u0445 \u043D\u0430\u0432\u043E\u0434\u0438\u0442 \u0441\u0442\u0440\u0430\u0445. \u0428\u043B\u0435\u043C \u0431\u0430\u0440\u0441\u0443\u043A\u0430 \u0438 \u0430\u043C\u0443\u043B\u0435\u0442 \u043E\u0442\u0432\u0430\u0433\u0438."
      },
      {
        id: "sf_02",
        name: "\u041A\u0430\u0440\u0443\u0441\u0435\u043B\u044C\u043D\u044B\u0439 \u0440\u044F\u0434",
        world: "sf",
        enemies: [{ id: "sf_steed", scale: 1.71 }, { id: "sf_steed", scale: 1.71 }],
        unlockAfter: "sf_01",
        tip: "\u041A\u043E\u043D\u044C\u043A\u0438 \u0431\u044C\u044E\u0442 \u0442\u044F\u0436\u0435\u043B\u043E, \u043D\u043E \u043C\u0435\u0434\u043B\u0435\u043D\u043D\u044B. \u0411\u0440\u043E\u043D\u044F \u0438 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u0440\u0435\u0448\u0430\u044E\u0442."
      },
      {
        id: "sf_03",
        name: "\u0416\u043E\u043D\u0433\u043B\u0451\u0440\u044B \u043E\u0433\u043D\u044F",
        world: "sf",
        enemies: [{ id: "sf_firefly", scale: 1.72 }, { id: "sf_firefly", scale: 1.72 }],
        unlockAfter: "sf_02",
        tip: "\u041F\u043B\u044E\u044E\u0442\u0441\u044F \u043E\u0433\u043D\u0451\u043C. \u0421\u043E\u043F\u0440\u043E\u0442\u0438\u0432\u043B\u0435\u043D\u0438\u0435 \u043E\u0433\u043D\u044E \u0438 \u0431\u044B\u0441\u0442\u0440\u044B\u0439 \u0434\u043E\u0431\u0438\u0432."
      },
      {
        id: "sf_04",
        name: "\u041F\u0430\u0442\u0440\u0443\u043B\u044C \u043F\u043E\u0440\u044F\u0434\u043A\u0430",
        world: "sf",
        enemies: [{ id: "sf_guard", scale: 1.74 }, { id: "sf_guard", scale: 1.74 }],
        unlockAfter: "sf_03",
        tip: "\u0421\u0442\u0440\u0430\u0436\u0438 \u0431\u044C\u044E\u0442 \u043F\u0440\u0438\u0446\u0435\u043B\u044C\u043D\u043E \u043F\u043E \u0441\u0430\u043C\u043E\u043C\u0443 \u0445\u0440\u0443\u043F\u043A\u043E\u043C\u0443. \u041F\u0440\u0438\u043A\u0440\u043E\u0439 \u0441\u043B\u0430\u0431\u044B\u0445 \u0431\u0440\u043E\u043D\u0451\u0439."
      },
      {
        id: "sf_05",
        name: "\u0421\u043E\u043D\u043D\u044B\u0435 \u043A\u0430\u0447\u0435\u043B\u0438",
        world: "sf",
        enemies: [
          { id: "sf_doll", scale: 1.75 },
          { id: "sf_doll", scale: 1.75 },
          { id: "sf_doll", scale: 1.75 }
        ],
        unlockAfter: "sf_04",
        tip: "\u0422\u0440\u0438 \u043A\u0443\u043A\u043B\u044B \u0443\u0441\u044B\u043F\u043B\u044F\u044E\u0442 \u043F\u043E \u043E\u0447\u0435\u0440\u0435\u0434\u0438. \u0417\u0435\u043B\u044C\u0435 \u0431\u043E\u0434\u0440\u043E\u0441\u0442\u0438 \u0438 \u0448\u043B\u0435\u043C \u0431\u0430\u0440\u0441\u0443\u043A\u0430."
      },
      {
        id: "sf_06",
        name: "\u0428\u0430\u0440\u043C\u0430\u043D\u043A\u0430 \u043F\u0440\u0438\u0437\u0440\u0430\u043A\u043E\u0432",
        world: "sf",
        enemies: [
          { id: "sf_spirit", scale: 1.76 },
          { id: "sf_spirit", scale: 1.76 },
          { id: "sf_doll", scale: 1.76 }
        ],
        unlockAfter: "sf_05",
        tip: "\u0421\u0442\u0440\u0430\u0445 \u0438 \u0441\u043E\u043D \u0432\u043C\u0435\u0441\u0442\u0435. \u041B\u0443\u043A \u0438 \u0442\u043E\u043F\u043E\u0440 \u0431\u044C\u044E\u0442 \u043F\u043E \u0434\u0443\u0445\u0430\u043C \u0431\u043E\u043B\u044C\u043D\u0435\u0435."
      },
      {
        id: "sf_07",
        name: "\u0420\u0430\u0437\u0433\u043E\u043D \u043E\u0447\u0435\u0440\u0435\u0434\u0438",
        world: "sf",
        enemies: [{ id: "sf_guard", scale: 1.78 }, { id: "sf_steed", scale: 1.78 }],
        unlockAfter: "sf_06",
        tip: "\u041A\u043E\u043D\u0451\u043A \u043F\u0440\u0438\u043A\u0440\u044B\u0432\u0430\u0435\u0442 \u0441\u0442\u0440\u0430\u0436\u0430. \u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0443\u0431\u0435\u0440\u0438 \u043F\u0440\u0438\u0446\u0435\u043B\u044C\u043D\u043E\u0433\u043E \u0441\u0442\u0440\u0435\u043B\u043A\u0430."
      },
      {
        id: "sf_08",
        name: "\u041E\u0433\u043D\u0435\u043D\u043D\u043E\u0435 \u043A\u043E\u043B\u0435\u0441\u043E",
        world: "sf",
        enemies: [
          { id: "sf_firefly", scale: 1.79 },
          { id: "sf_firefly", scale: 1.79 },
          { id: "sf_steed", scale: 1.79 }
        ],
        unlockAfter: "sf_07",
        tip: "\u041E\u0433\u043E\u043D\u044C \u0438 \u0442\u044F\u0436\u0451\u043B\u044B\u0435 \u0443\u0434\u0430\u0440\u044B. \u0421\u043E\u043F\u0440\u043E\u0442\u0438\u0432\u043B\u0435\u043D\u0438\u0435 \u043E\u0433\u043D\u044E \u043F\u043B\u044E\u0441 \u043A\u0440\u0435\u043F\u043A\u0438\u0439 \u0449\u0438\u0442."
      },
      {
        id: "sf_09",
        name: "\u0411\u043E\u043B\u044C\u0448\u043E\u0435 \u043A\u043E\u043B\u0435\u0441\u043E",
        world: "sf",
        enemies: [{ id: "sf_wheel", scale: 1.8 }],
        unlockAfter: "sf_08",
        tip: "\u041A\u043E\u043B\u0435\u0441\u043E \u0437\u0430\u043C\u0435\u0434\u043B\u044F\u0435\u0442 \u0438 \u0434\u0430\u0432\u0438\u0442 \u0442\u044F\u0436\u0451\u043B\u044B\u043C \u0443\u0434\u0430\u0440\u043E\u043C. \u041E\u0434\u0438\u043D, \u043D\u043E \u043E\u0447\u0435\u043D\u044C \u043A\u0440\u0435\u043F\u043A\u0438\u0439."
      },
      {
        id: "sf_10",
        name: "\u041D\u043E\u0447\u043D\u043E\u0439 \u043F\u0430\u0440\u0430\u0434",
        world: "sf",
        enemies: [
          { id: "sf_spirit", scale: 1.81 },
          { id: "sf_firefly", scale: 1.81 },
          { id: "sf_doll", scale: 1.81 }
        ],
        unlockAfter: "sf_09",
        tip: "\u0421\u0442\u0440\u0430\u0445, \u043E\u0433\u043E\u043D\u044C \u0438 \u0441\u043E\u043D \u0432 \u043E\u0434\u043D\u043E\u043C \u0441\u0442\u0440\u043E\u044E. \u0421\u043E\u0431\u0435\u0440\u0438 \u0441\u043E\u043F\u0440\u043E\u0442\u0438\u0432\u043B\u0435\u043D\u0438\u044F \u0437\u0430\u0440\u0430\u043D\u0435\u0435."
      },
      {
        id: "sf_11",
        name: "\u0421\u0442\u0440\u0430\u0436\u0430 \u043D\u0430 \u0432\u0445\u043E\u0434\u0435",
        world: "sf",
        enemies: [
          { id: "sf_guard", scale: 1.83 },
          { id: "sf_guard", scale: 1.83 }
        ],
        unlockAfter: "sf_10",
        tip: "\u0414\u0432\u0430 \u0441\u0442\u0440\u0430\u0436\u0430 \u0431\u044C\u044E\u0442 \u043F\u0440\u0438\u0446\u0435\u043B\u044C\u043D\u043E \u0438 \u043D\u0435 \u043C\u0430\u0436\u0443\u0442. \u0412\u044B\u0441\u043E\u043A\u0430\u044F \u0431\u0440\u043E\u043D\u044F \u0432\u0441\u0435\u043C\u0443 \u043E\u0442\u0440\u044F\u0434\u0443."
      },
      {
        id: "sf_12",
        name: "\u0421\u043A\u0430\u0447\u043A\u0438 \u043F\u043E \u043A\u0440\u0443\u0433\u0443",
        world: "sf",
        enemies: [
          { id: "sf_steed", scale: 1.84 },
          { id: "sf_spirit", scale: 1.84 }
        ],
        unlockAfter: "sf_11",
        tip: "\u041A\u043E\u043D\u0451\u043A \u0434\u0430\u0432\u0438\u0442 \u0442\u044F\u0436\u0451\u043B\u044B\u043C \u0443\u0434\u0430\u0440\u043E\u043C, \u0434\u0443\u0445 \u043C\u043E\u0440\u043E\u0437\u0438\u0442 \u0441\u0442\u0440\u0430\u0445\u043E\u043C. \u0410\u043C\u0443\u043B\u0435\u0442 \u043E\u0442\u0432\u0430\u0433\u0438 \u043F\u0440\u0438\u0433\u043E\u0434\u0438\u0442\u0441\u044F."
      },
      {
        id: "sf_13",
        name: "\u041A\u0443\u043A\u043E\u043B\u044C\u043D\u044B\u0439 \u0431\u0430\u043B\u0430\u0433\u0430\u043D",
        world: "sf",
        enemies: [
          { id: "sf_doll", scale: 1.85 },
          { id: "sf_doll", scale: 1.85 },
          { id: "sf_guard", scale: 1.85 }
        ],
        unlockAfter: "sf_12",
        tip: "\u041A\u0443\u043A\u043B\u044B \u0443\u0441\u044B\u043F\u043B\u044F\u044E\u0442, \u0441\u0442\u0440\u0430\u0436 \u0434\u043E\u0431\u0438\u0432\u0430\u0435\u0442 \u043F\u0440\u0438\u0446\u0435\u043B\u044C\u043D\u043E. \u041D\u0435 \u0434\u0430\u0439 \u0443\u0441\u043D\u0443\u0442\u044C \u043B\u0435\u043A\u0430\u0440\u044E."
      },
      {
        id: "sf_14",
        name: "\u041A\u043E\u043B\u0435\u0441\u043E \u0438 \u043F\u0430\u0442\u0440\u0443\u043B\u044C",
        world: "sf",
        enemies: [{ id: "sf_wheel", scale: 1.86 }, { id: "sf_guard", scale: 1.86 }],
        unlockAfter: "sf_13",
        tip: "\u041A\u043E\u043B\u0435\u0441\u043E \u0437\u0430\u043C\u0435\u0434\u043B\u044F\u0435\u0442, \u0441\u0442\u0440\u0430\u0436 \u0441\u0442\u0440\u0435\u043B\u044F\u0435\u0442 \u043F\u0440\u0438\u0446\u0435\u043B\u044C\u043D\u043E. \u0414\u0435\u0440\u0436\u0438 \u0442\u0435\u043C\u043F \u0437\u0435\u043B\u044C\u044F\u043C\u0438."
      },
      {
        id: "sf_15",
        name: "\u0424\u0435\u0439\u0435\u0440\u0432\u0435\u0440\u043A",
        world: "sf",
        enemies: [
          { id: "sf_firefly", scale: 1.88 },
          { id: "sf_firefly", scale: 1.88 },
          { id: "sf_firefly", scale: 1.88 }
        ],
        unlockAfter: "sf_14",
        tip: "\u0422\u0440\u0438 \u0436\u043E\u043D\u0433\u043B\u0451\u0440\u0430 \u0436\u0433\u0443\u0442 \u043E\u0433\u043D\u0451\u043C. \u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u043E\u0435 \u0441\u043E\u043F\u0440\u043E\u0442\u0438\u0432\u043B\u0435\u043D\u0438\u0435 \u043E\u0433\u043D\u044E."
      },
      {
        id: "sf_16",
        name: "\u041F\u043E\u043B\u043D\u043E\u0447\u043D\u044B\u0439 \u043A\u0430\u0440\u043D\u0430\u0432\u0430\u043B",
        world: "sf",
        enemies: [
          { id: "sf_spirit", scale: 1.78 },
          { id: "sf_spirit", scale: 1.78 },
          { id: "sf_wheel", scale: 1.78 }
        ],
        unlockAfter: "sf_15",
        tip: "\u0414\u0443\u0445\u0438 \u0441\u0435\u044E\u0442 \u0441\u0442\u0440\u0430\u0445, \u043A\u043E\u043B\u0435\u0441\u043E \u0434\u0430\u0432\u0438\u0442. \u0410\u043C\u0443\u043B\u0435\u0442 \u043E\u0442\u0432\u0430\u0433\u0438 \u0438 \u0442\u044F\u0436\u0451\u043B\u043E\u0435 \u043E\u0440\u0443\u0436\u0438\u0435."
      },
      {
        id: "sf_17",
        name: "\u0422\u0443\u0440\u043D\u0438\u0440 \u043F\u0440\u0435\u0442\u0435\u043D\u0434\u0435\u043D\u0442\u043E\u0432",
        world: "sf",
        enemies: [
          { id: "sf_steed", scale: 1.9 },
          { id: "sf_firefly", scale: 1.9 }
        ],
        unlockAfter: "sf_16",
        tip: "\u0418\u0441\u043F\u044B\u0442\u0430\u043D\u0438\u0435 \u0441\u043C\u0435\u043B\u043E\u0441\u0442\u0438 \u0438 \u043B\u043E\u0432\u043A\u043E\u0441\u0442\u0438: \u0442\u0430\u0440\u0430\u043D \u043A\u043E\u043D\u044C\u043A\u0430 \u0438 \u043E\u0433\u043E\u043D\u044C \u0436\u043E\u043D\u0433\u043B\u0451\u0440\u0430."
      },
      {
        id: "sf_18",
        name: "\u0412\u0441\u0451 \u0441\u0440\u0430\u0437\u0443",
        world: "sf",
        enemies: [
          { id: "sf_wheel", scale: 1.91 },
          { id: "sf_doll", scale: 1.91 },
          { id: "sf_spirit", scale: 1.91 }
        ],
        unlockAfter: "sf_17",
        tip: "\u0417\u0430\u043C\u0435\u0434\u043B\u0435\u043D\u0438\u0435, \u0441\u043E\u043D \u0438 \u0441\u0442\u0440\u0430\u0445. \u041F\u043E\u043B\u043D\u044B\u0439 \u043D\u0430\u0431\u043E\u0440 \u0441\u043E\u043F\u0440\u043E\u0442\u0438\u0432\u043B\u0435\u043D\u0438\u0439 \u0438 \u0437\u0435\u043B\u0438\u0439."
      },
      {
        id: "sf_19",
        name: "\u0413\u0440\u0430\u043D\u0434-\u0448\u043E\u0443",
        world: "sf",
        enemies: [
          { id: "sf_wheel", scale: 1.93 },
          { id: "sf_firefly", scale: 1.93 }
        ],
        unlockAfter: "sf_18",
        tip: "\u041A\u043E\u043B\u0435\u0441\u043E \u0438 \u0444\u0435\u0439\u0435\u0440\u0432\u0435\u0440\u043A \u043F\u0435\u0440\u0435\u0434 \u0444\u0438\u043D\u0430\u043B\u043E\u043C. \u0421\u043E\u043F\u0440\u043E\u0442\u0438\u0432\u043B\u0435\u043D\u0438\u0435 \u043E\u0433\u043D\u044E \u0438 \u0442\u044F\u0436\u0451\u043B\u043E\u0435 \u043E\u0440\u0443\u0436\u0438\u0435."
      },
      {
        id: "sf_boss",
        name: "\u0427\u0435\u043C\u043F\u0438\u043E\u043D \u043C\u0438\u0440\u043E\u0432",
        world: "sf",
        enemies: [{ id: "sf_boss", scale: 1.95 }],
        unlockAfter: "sf_19",
        tip: "\u0427\u0435\u043C\u043F\u0438\u043E\u043D \u0431\u044C\u0451\u0442 \u043D\u0430\u043E\u0442\u043C\u0430\u0448\u044C, \u043D\u0430\u0433\u043E\u043D\u044F\u0435\u0442 \u0441\u0442\u0440\u0430\u0445 \u0438 \u043F\u0435\u0440\u0435\u0432\u043E\u0434\u0438\u0442 \u0434\u0443\u0445. \u0414\u0435\u0440\u0436\u0438 \u0442\u0435\u043C\u043F \u0438 \u043D\u0435 \u0434\u0430\u0432\u0430\u0439 \u0435\u043C\u0443 \u043F\u0435\u0440\u0435\u0434\u044B\u0448\u043A\u0438."
      }
    ]
  };

  // src/data/worlds/cr.js
  var WORLD4 = {
    id: "cr",
    label: "\u{1F48E} \u0425\u0440\u0443\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0435 \u0433\u043E\u0440\u044B",
    enemies: [
      {
        id: "cr_owl",
        name: "\u0421\u043D\u0435\u0436\u043D\u0430\u044F \u0441\u043E\u0432\u0430",
        icon: "\u{1F989}",
        hp: 95,
        attack: 14,
        armor: 8,
        speed: 11,
        crit: 0.05,
        dodge: 0.1,
        elem: "phys",
        skills: ["pollen_sleep"],
        tags: ["ranged"],
        reward: { coins: [60, 90], materials: ["cr_owl_feather"] }
      },
      {
        id: "cr_shardling",
        name: "\u041A\u0440\u0438\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0439 \u043E\u0441\u043A\u043E\u043B\u043E\u043A",
        icon: "\u{1F539}",
        hp: 90,
        attack: 15,
        armor: 10,
        speed: 10,
        crit: 0.05,
        dodge: 0.08,
        elem: "phys",
        skills: ["aimed_shot"],
        tags: [],
        reward: { coins: [55, 80], materials: ["cr_crystal_shard"] }
      },
      {
        id: "cr_icewisp",
        name: "\u0418\u0441\u043A\u0440\u0430 \u0437\u0432\u0435\u043D\u044F\u0449\u0435\u0433\u043E \u043B\u044C\u0434\u0430",
        icon: "\u2744\uFE0F",
        hp: 95,
        attack: 16,
        armor: 10,
        speed: 13,
        crit: 0.05,
        dodge: 0.12,
        elem: "phys",
        skills: ["slow_spores"],
        tags: [],
        reward: { coins: [60, 85], materials: ["cr_ice_ring"] }
      },
      {
        id: "cr_echo",
        name: "\u0413\u043E\u0440\u043D\u044B\u0439 \u044D\u0445\u043E-\u0434\u0443\u0445",
        icon: "\u{1F3D4}\uFE0F",
        hp: 105,
        attack: 17,
        armor: 10,
        speed: 10,
        crit: 0.06,
        dodge: 0.12,
        elem: "phys",
        skills: ["fear_chill"],
        tags: ["spirit"],
        reward: { coins: [65, 95], materials: ["cr_echo_dust"] }
      },
      {
        id: "cr_golem",
        name: "\u041A\u0440\u0438\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0439 \u0433\u043E\u043B\u0435\u043C",
        icon: "\u{1F48E}",
        hp: 155,
        attack: 18,
        armor: 22,
        speed: 6,
        crit: 0.03,
        dodge: 0,
        elem: "phys",
        skills: ["heavy_blow", "slow_spores"],
        tags: [],
        reward: { coins: [80, 110], materials: ["cr_crystal_shard"] }
      },
      {
        id: "cr_dragon_young",
        name: "\u041C\u043E\u043B\u043E\u0434\u043E\u0439 \u043A\u0432\u0430\u0440\u0446\u0435\u0432\u044B\u0439 \u0434\u0440\u0430\u043A\u043E\u043D",
        icon: "\u{1F409}",
        hp: 140,
        attack: 19,
        armor: 17,
        speed: 9,
        crit: 0.08,
        dodge: 0.04,
        elem: "phys",
        skills: ["heavy_blow", "fear_chill"],
        tags: [],
        reward: { coins: [90, 120], materials: ["cr_crystal_shard"] }
      },
      // Босс мира
      {
        id: "cr_dragon_ancient",
        name: "\u0414\u0440\u0435\u0432\u043D\u0438\u0439 \u0434\u0440\u0430\u043A\u043E\u043D \u043A\u0432\u0430\u0440\u0446\u0430",
        icon: "\u{1F432}",
        hp: 380,
        attack: 26,
        armor: 24,
        speed: 8,
        crit: 0.06,
        dodge: 0.02,
        elem: "phys",
        skills: ["heavy_blow", "fear_chill", "slow_spores"],
        boss: true,
        tags: [],
        reward: { coins: [700, 950], seals: 4, materials: ["cr_quartz_heart"] }
      }
    ],
    materials: [
      { id: "cr_crystal_shard", name: "\u041E\u0441\u043A\u043E\u043B\u043E\u043A \u0445\u0440\u0443\u0441\u0442\u0430\u043B\u044F", icon: "\u{1F48E}", description: "\u0417\u0432\u0435\u043D\u0438\u0442, \u0435\u0441\u043B\u0438 \u0435\u0433\u043E \u0443\u0440\u043E\u043D\u0438\u0442\u044C." },
      { id: "cr_owl_feather", name: "\u041F\u0435\u0440\u043E \u0441\u043D\u0435\u0436\u043D\u043E\u0439 \u0441\u043E\u0432\u044B", icon: "\u{1FAB6}", description: "\u0411\u0435\u043B\u043E\u0435 \u0438 \u043F\u043E\u0447\u0442\u0438 \u043D\u0435\u0432\u0435\u0441\u043E\u043C\u043E\u0435." },
      { id: "cr_ice_ring", name: "\u0417\u0432\u0435\u043D\u044F\u0449\u0438\u0439 \u043B\u0451\u0434", icon: "\u2744\uFE0F", description: "\u041D\u0435 \u0442\u0430\u0435\u0442 \u0434\u0430\u0436\u0435 \u0443 \u043E\u0447\u0430\u0433\u0430." },
      { id: "cr_echo_dust", name: "\u041F\u044B\u043B\u044C \u044D\u0445\u0430", icon: "\u{1F514}", description: "\u0422\u0438\u0445\u043E \u043F\u043E\u0432\u0442\u043E\u0440\u044F\u0435\u0442 \u0441\u043A\u0430\u0437\u0430\u043D\u043D\u043E\u0435 \u0448\u0451\u043F\u043E\u0442\u043E\u043C." },
      { id: "cr_quartz_heart", name: "\u0421\u0435\u0440\u0434\u0446\u0435 \u043A\u0432\u0430\u0440\u0446\u0435\u0432\u043E\u0433\u043E \u0434\u0440\u0430\u043A\u043E\u043D\u0430", icon: "\u{1F4A0}", description: "\u0412\u043D\u0443\u0442\u0440\u0438 \u0434\u0440\u0435\u043C\u043B\u0435\u0442 \u0434\u0440\u0435\u0432\u043D\u0438\u0439 \u0441\u0432\u0435\u0442." }
    ],
    battles: [
      {
        id: "cr_01",
        name: "\u041F\u0435\u0440\u0432\u044B\u0439 \u0441\u043D\u0435\u0433 \u043F\u0435\u0440\u0435\u0432\u0430\u043B\u0430",
        world: "cr",
        enemies: [{ id: "cr_owl", scale: 1.8 }, { id: "cr_shardling", scale: 1.8 }],
        unlockAfter: "sf_boss",
        tip: "\u0421\u043E\u0432\u0430 \u0443\u0441\u044B\u043F\u043B\u044F\u0435\u0442, \u043E\u0441\u043A\u043E\u043B\u043E\u043A \u0431\u044C\u0451\u0442 \u0442\u043E\u0447\u043D\u043E. \u0417\u0435\u043B\u044C\u0435 \u0431\u043E\u0434\u0440\u043E\u0441\u0442\u0438 \u043F\u0440\u0438\u0433\u043E\u0434\u0438\u0442\u0441\u044F."
      },
      {
        id: "cr_02",
        name: "\u041E\u0441\u043A\u043E\u043B\u043A\u0438 \u043D\u0430 \u0442\u0440\u043E\u043F\u0435",
        world: "cr",
        enemies: [{ id: "cr_shardling", scale: 1.81 }, { id: "cr_shardling", scale: 1.81 }],
        unlockAfter: "cr_01",
        tip: "\u041E\u0441\u043A\u043E\u043B\u043A\u0438 \u0431\u044B\u0441\u0442\u0440\u044B \u0438 \u0431\u044C\u044E\u0442 \u0442\u043E\u0447\u043D\u043E. \u0414\u0435\u0440\u0436\u0438 \u0431\u0440\u043E\u043D\u044E \u0432 \u043F\u043E\u0440\u044F\u0434\u043A\u0435."
      },
      {
        id: "cr_03",
        name: "\u0417\u0432\u043E\u043D \u043B\u0435\u0434\u044F\u043D\u044B\u0445 \u0438\u0441\u043A\u0440",
        world: "cr",
        enemies: [{ id: "cr_icewisp", scale: 1.83 }, { id: "cr_icewisp", scale: 1.83 }],
        unlockAfter: "cr_02",
        tip: "\u0418\u0441\u043A\u0440\u044B \u0437\u0430\u043C\u0435\u0434\u043B\u044F\u044E\u0442 \u043C\u043E\u0440\u043E\u0437\u043D\u043E\u0439 \u043F\u044B\u043B\u044C\u044E. \u0411\u0435\u0440\u0438\u0442\u0435 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u044C."
      },
      {
        id: "cr_04",
        name: "\u042D\u0445\u043E \u0432 \u0443\u0449\u0435\u043B\u044C\u0435",
        world: "cr",
        enemies: [{ id: "cr_echo", scale: 1.84 }, { id: "cr_echo", scale: 1.84 }],
        unlockAfter: "cr_03",
        tip: "\u042D\u0445\u043E-\u0434\u0443\u0445\u0438 \u043D\u0430\u0432\u043E\u0434\u044F\u0442 \u043B\u0435\u0434\u0435\u043D\u044F\u0449\u0438\u0439 \u0441\u0442\u0440\u0430\u0445. \u0410\u043C\u0443\u043B\u0435\u0442 \u043E\u0442\u0432\u0430\u0433\u0438, \u043B\u0443\u043A \u0438\u043B\u0438 \u0442\u043E\u043F\u043E\u0440."
      },
      {
        id: "cr_05",
        name: "\u0421\u0442\u0440\u0430\u0436 \u0437\u0430\u0441\u0442\u044B\u0432\u0448\u0435\u0439 \u0440\u0435\u043A\u0438",
        world: "cr",
        enemies: [{ id: "cr_golem", scale: 1.85 }],
        unlockAfter: "cr_04",
        tip: "\u0423 \u0433\u043E\u043B\u0435\u043C\u0430 \u0445\u0440\u0443\u0441\u0442\u0430\u043B\u044C\u043D\u0430\u044F \u0431\u0440\u043E\u043D\u044F. \u041D\u0443\u0436\u0435\u043D \u0441\u0435\u0440\u044C\u0451\u0437\u043D\u044B\u0439 \u0443\u0440\u043E\u043D \u0438\u043B\u0438 \u043F\u0440\u043E\u0431\u0438\u0442\u0438\u0435."
      },
      {
        id: "cr_06",
        name: "\u0421\u043E\u0432\u0438\u043D\u0430\u044F \u043E\u0445\u043E\u0442\u0430",
        world: "cr",
        enemies: [{ id: "cr_owl", scale: 1.87 }, { id: "cr_icewisp", scale: 1.87 }],
        unlockAfter: "cr_05",
        tip: "\u0421\u043E\u043D \u0438 \u0437\u0430\u043C\u0435\u0434\u043B\u0435\u043D\u0438\u0435 \u0432\u043C\u0435\u0441\u0442\u0435. \u0420\u0430\u0437\u0431\u0443\u0434\u0438 \u0440\u044B\u0446\u0430\u0440\u044F \u0437\u0435\u043B\u044C\u0435\u043C \u0431\u043E\u0434\u0440\u043E\u0441\u0442\u0438."
      },
      {
        id: "cr_07",
        name: "\u0425\u0440\u0443\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0439 \u043A\u0430\u0440\u044C\u0435\u0440",
        world: "cr",
        enemies: [{ id: "cr_golem", scale: 1.88 }, { id: "cr_shardling", scale: 1.88 }],
        unlockAfter: "cr_06",
        tip: "\u0413\u043E\u043B\u0435\u043C \u043F\u0440\u0438\u043A\u0440\u044B\u0432\u0430\u0435\u0442 \u043E\u0441\u043A\u043E\u043B\u043E\u043A. \u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u043F\u0435\u0440\u0435\u0431\u0435\u0439 \u043C\u0435\u043B\u043E\u0447\u044C."
      },
      {
        id: "cr_08",
        name: "\u0414\u0440\u0430\u043A\u043E\u043D\u044C\u0435 \u044D\u0445\u043E",
        world: "cr",
        enemies: [{ id: "cr_dragon_young", scale: 1.89 }],
        unlockAfter: "cr_07",
        tip: "\u041C\u043E\u043B\u043E\u0434\u043E\u0439 \u0434\u0440\u0430\u043A\u043E\u043D \u0431\u044C\u0451\u0442 \u0442\u044F\u0436\u0435\u043B\u043E \u0438 \u043D\u0430\u0432\u043E\u0434\u0438\u0442 \u0441\u0442\u0440\u0430\u0445. \u0410\u043C\u0443\u043B\u0435\u0442 \u043E\u0442\u0432\u0430\u0433\u0438 \u043F\u043E\u043C\u043E\u0436\u0435\u0442."
      },
      {
        id: "cr_09",
        name: "\u041C\u043E\u0440\u043E\u0437\u043D\u044B\u0439 \u043F\u0435\u0440\u0435\u043A\u0440\u0451\u0441\u0442\u043E\u043A",
        world: "cr",
        enemies: [{ id: "cr_echo", scale: 1.91 }, { id: "cr_icewisp", scale: 1.91 }],
        unlockAfter: "cr_08",
        tip: "\u0421\u0442\u0440\u0430\u0445 \u0438 \u043C\u043E\u0440\u043E\u0437\u043D\u0430\u044F \u043F\u044B\u043B\u044C. \u041F\u0440\u043E\u0432\u0435\u0440\u044C \u0441\u043E\u043F\u0440\u043E\u0442\u0438\u0432\u043B\u0435\u043D\u0438\u044F \u0438 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u044C."
      },
      {
        id: "cr_10",
        name: "\u0413\u043E\u043B\u0435\u043C\u0438\u0439 \u0437\u0430\u0432\u0430\u043B",
        world: "cr",
        enemies: [{ id: "cr_golem", scale: 1.92 }, { id: "cr_owl", scale: 1.92 }],
        unlockAfter: "cr_09",
        tip: "\u041A\u0430\u043C\u0435\u043D\u043D\u0430\u044F \u0441\u0442\u0435\u043D\u0430, \u0430 \u0437\u0430 \u043D\u0435\u0439 \u0443\u0441\u044B\u043F\u043B\u044F\u044E\u0449\u0430\u044F \u0441\u043E\u0432\u0430. \u0417\u0435\u043B\u044C\u0435 \u0431\u043E\u0434\u0440\u043E\u0441\u0442\u0438."
      },
      {
        id: "cr_11",
        name: "\u041A\u0440\u0438\u043A \u043D\u0430\u0434 \u043F\u0440\u043E\u043F\u0430\u0441\u0442\u044C\u044E",
        world: "cr",
        enemies: [{ id: "cr_owl", scale: 1.93 }, { id: "cr_owl", scale: 1.93 }],
        unlockAfter: "cr_10",
        tip: "\u0414\u0432\u0435 \u0441\u043E\u0432\u044B \u0443\u0441\u044B\u043F\u043B\u044F\u044E\u0442 \u043F\u043E \u043E\u0447\u0435\u0440\u0435\u0434\u0438. \u0428\u043B\u0435\u043C \u043E\u0442 \u0441\u043D\u0430 \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u0435\u043D."
      },
      {
        id: "cr_12",
        name: "\u0414\u0432\u0430 \u0434\u0443\u0445\u0430 \u0443\u0449\u0435\u043B\u044C\u044F",
        world: "cr",
        enemies: [{ id: "cr_echo", scale: 1.95 }, { id: "cr_echo", scale: 1.95 }],
        unlockAfter: "cr_11",
        tip: "\u0414\u0432\u043E\u0435 \u0434\u0443\u0445\u043E\u0432 \u0441\u043E \u0441\u0442\u0440\u0430\u0445\u043E\u043C. \u041B\u0443\u043A \u0438 \u0442\u043E\u043F\u043E\u0440 \u0431\u044C\u044E\u0442 \u043F\u043E \u0434\u0443\u0445\u0430\u043C \u0431\u043E\u043B\u044C\u043D\u0435\u0435."
      },
      {
        id: "cr_13",
        name: "\u041C\u043E\u043B\u043E\u0434\u044B\u0435 \u043A\u043E\u0433\u0442\u0438",
        world: "cr",
        enemies: [{ id: "cr_dragon_young", scale: 1.96 }, { id: "cr_shardling", scale: 1.96 }],
        unlockAfter: "cr_12",
        tip: "\u0414\u0440\u0430\u043A\u043E\u043D \u0441 \u043E\u0441\u043A\u043E\u043B\u043A\u043E\u043C-\u043F\u0440\u0438\u0445\u0432\u043E\u0441\u0442\u043D\u0435\u043C. \u041F\u0435\u0440\u0435\u0431\u0435\u0439 \u043C\u0435\u043B\u043E\u0447\u044C \u0438 \u0441\u043E\u0441\u0440\u0435\u0434\u043E\u0442\u043E\u0447\u044C\u0441\u044F."
      },
      {
        id: "cr_14",
        name: "\u0417\u0432\u0435\u043D\u044F\u0449\u0430\u044F \u0441\u0442\u0435\u043D\u0430",
        world: "cr",
        enemies: [{ id: "cr_golem", scale: 1.97 }, { id: "cr_icewisp", scale: 1.97 }],
        unlockAfter: "cr_13",
        tip: "\u0413\u043E\u043B\u0435\u043C \u0438 \u0437\u0430\u043C\u0435\u0434\u043B\u044F\u044E\u0449\u0430\u044F \u0438\u0441\u043A\u0440\u0430. \u041D\u0435 \u0434\u0430\u0439 \u0441\u0435\u0431\u044F \u0437\u0430\u043A\u043E\u043F\u0430\u0442\u044C \u0432 \u0441\u043D\u0435\u0433."
      },
      {
        id: "cr_15",
        name: "\u0421\u043D\u0435\u0436\u043D\u0430\u044F \u043F\u0443\u0440\u0433\u0430",
        world: "cr",
        enemies: [{ id: "cr_owl", scale: 1.85 }, { id: "cr_icewisp", scale: 1.85 }, { id: "cr_echo", scale: 1.85 }],
        unlockAfter: "cr_14",
        tip: "\u041F\u0443\u0440\u0433\u0430 \u0438\u0437 \u0441\u043D\u0430, \u0441\u0442\u0440\u0430\u0445\u0430 \u0438 \u043C\u043E\u0440\u043E\u0437\u043D\u043E\u0439 \u043F\u044B\u043B\u0438. \u0414\u0435\u0440\u0436\u0438 \u0437\u0435\u043B\u044C\u044F \u043D\u0430\u0433\u043E\u0442\u043E\u0432\u0435."
      },
      {
        id: "cr_16",
        name: "\u041A\u0432\u0430\u0440\u0446\u0435\u0432\u043E\u0435 \u0433\u043D\u0435\u0437\u0434\u043E\u0432\u044C\u0435",
        world: "cr",
        enemies: [{ id: "cr_dragon_young", scale: 2 }, { id: "cr_owl", scale: 2 }],
        unlockAfter: "cr_15",
        tip: "\u0414\u0440\u0430\u043A\u043E\u043D \u0441\u0442\u043E\u0440\u043E\u0436\u0438\u0442 \u0433\u043D\u0435\u0437\u0434\u043E, \u0441\u043E\u0432\u0430 \u0443\u0441\u044B\u043F\u043B\u044F\u0435\u0442. \u0411\u043E\u0434\u0440\u043E\u0441\u0442\u044C \u0438 \u043E\u0442\u0432\u0430\u0433\u0430."
      },
      {
        id: "cr_17",
        name: "\u042D\u0445\u043E \u0434\u0440\u0435\u0432\u043D\u0438\u0445",
        world: "cr",
        enemies: [{ id: "cr_dragon_young", scale: 2.01 }, { id: "cr_echo", scale: 2.01 }],
        unlockAfter: "cr_16",
        tip: "\u0414\u0440\u0430\u043A\u043E\u043D \u0432 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438 \u0434\u0443\u0445\u0430. \u0410\u043C\u0443\u043B\u0435\u0442 \u043E\u0442\u0432\u0430\u0433\u0438 \u0438 \u0443\u0434\u0430\u0440 \u043F\u043E \u0434\u0440\u0430\u043A\u043E\u043D\u0443."
      },
      {
        id: "cr_18",
        name: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439 \u043B\u0435\u0434\u043D\u0438\u043A",
        world: "cr",
        enemies: [{ id: "cr_golem", scale: 2.02 }, { id: "cr_golem", scale: 2.02 }],
        unlockAfter: "cr_17",
        tip: "\u0414\u0432\u0435 \u0445\u0440\u0443\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0435 \u0441\u0442\u0435\u043D\u044B. \u041D\u0443\u0436\u0435\u043D \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0439 \u0443\u0440\u043E\u043D \u0438\u043B\u0438 \u043F\u0440\u043E\u0431\u0438\u0442\u0438\u0435."
      },
      {
        id: "cr_19",
        name: "\u0421\u0432\u0435\u0440\u043A\u0430\u044E\u0449\u0438\u0439 \u043F\u0438\u043A",
        world: "cr",
        enemies: [{ id: "cr_dragon_young", scale: 2.04 }, { id: "cr_golem", scale: 2.04 }],
        unlockAfter: "cr_18",
        tip: "\u0414\u0440\u0430\u043A\u043E\u043D \u0438 \u0435\u0433\u043E \u0445\u0440\u0443\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0439 \u0441\u0442\u0440\u0430\u0436. \u041F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u043F\u0435\u0440\u0435\u0434 \u043F\u0438\u043A\u043E\u043C."
      },
      {
        id: "cr_boss",
        name: "\u0414\u0440\u0435\u0432\u043D\u0438\u0439 \u0434\u0440\u0430\u043A\u043E\u043D \u043A\u0432\u0430\u0440\u0446\u0430",
        world: "cr",
        enemies: [{ id: "cr_dragon_ancient", scale: 2.05 }],
        unlockAfter: "cr_19",
        tip: "\u0414\u0440\u0435\u0432\u043D\u0438\u0439 \u0434\u0440\u0430\u043A\u043E\u043D \u0437\u0432\u0435\u043D\u0438\u0442 \u0442\u044B\u0441\u044F\u0447\u0435\u0439 \u0433\u0440\u0430\u043D\u0435\u0439. \u0421\u043E\u0431\u0435\u0440\u0438 \u0432\u0441\u0451 \u043B\u0443\u0447\u0448\u0435\u0435, \u0447\u0442\u043E \u0443 \u0442\u0435\u0431\u044F \u0435\u0441\u0442\u044C."
      }
    ]
  };

  // src/data/worlds/ash.js
  var WORLD5 = {
    id: "ash",
    label: "\u{1F525} \u041F\u0435\u043F\u0435\u043B\u044C\u043D\u044B\u0435 \u0441\u0442\u0435\u043F\u0438",
    enemies: [
      {
        id: "ash_wolf",
        name: "\u041F\u0435\u043F\u0435\u043B\u044C\u043D\u044B\u0439 \u0432\u043E\u043B\u043A",
        icon: "\u{1F43A}",
        hp: 75,
        attack: 14,
        armor: 8,
        speed: 10,
        crit: 0.05,
        dodge: 0.08,
        elem: "phys",
        skills: ["heavy_blow"],
        tags: [],
        reward: { coins: [60, 90], materials: ["ash_pelt"] }
      },
      {
        id: "ash_shaman",
        name: "\u041A\u043E\u0447\u0435\u0432\u043E\u0439 \u0448\u0430\u043C\u0430\u043D \u043E\u0433\u043D\u044F",
        icon: "\u{1F525}",
        hp: 80,
        attack: 16,
        armor: 8,
        speed: 9,
        crit: 0.05,
        dodge: 0.05,
        elem: "fire",
        skills: ["spit_fire", "regen_ally_skill"],
        tags: [],
        reward: { coins: [70, 100], materials: ["ash_ember"] }
      },
      {
        id: "ash_storm_spirit",
        name: "\u0414\u0443\u0445 \u043F\u0435\u043F\u0435\u043B\u044C\u043D\u043E\u0439 \u0431\u0443\u0440\u0438",
        icon: "\u{1F32A}\uFE0F",
        hp: 75,
        attack: 15,
        armor: 8,
        speed: 12,
        crit: 0.05,
        dodge: 0.12,
        elem: "phys",
        skills: ["fear_chill", "slow_spores"],
        tags: ["spirit"],
        reward: { coins: [65, 95], materials: ["ash_storm_shard"] }
      },
      {
        id: "ash_scorpion",
        name: "\u041E\u0431\u0443\u0433\u043B\u0435\u043D\u043D\u044B\u0439 \u0441\u043A\u043E\u0440\u043F\u0438\u043E\u043D",
        icon: "\u{1F982}",
        hp: 85,
        attack: 15,
        armor: 14,
        speed: 10,
        crit: 0.05,
        dodge: 0.03,
        elem: "phys",
        skills: ["sting_poison"],
        tags: [],
        reward: { coins: [65, 95], materials: ["ash_scale"] }
      },
      {
        id: "ash_vulture",
        name: "\u041F\u0435\u043F\u0435\u043B\u044C\u043D\u044B\u0439 \u0441\u0442\u0435\u0440\u0432\u044F\u0442\u043D\u0438\u043A",
        icon: "\u{1F985}",
        hp: 70,
        attack: 14,
        armor: 8,
        speed: 9,
        crit: 0.06,
        dodge: 0.1,
        elem: "phys",
        skills: ["aimed_shot"],
        tags: [],
        reward: { coins: [60, 90], materials: ["ash_pelt"] }
      },
      {
        id: "ash_ghoul",
        name: "\u0422\u0435\u043D\u044C \u043A\u0430\u0440\u0430\u0432\u0430\u043D\u0449\u0438\u043A\u0430",
        icon: "\u{1F47B}",
        hp: 85,
        attack: 16,
        armor: 10,
        speed: 11,
        crit: 0.05,
        dodge: 0.1,
        elem: "phys",
        skills: ["pollen_sleep", "fear_chill"],
        tags: ["spirit"],
        reward: { coins: [70, 100], materials: ["ash_storm_shard"] }
      },
      {
        id: "ash_khan",
        name: "\u0425\u0430\u043D \u043F\u0435\u043F\u0435\u043B\u044C\u043D\u044B\u0445 \u0431\u0443\u0440\u044C",
        icon: "\u{1F30B}",
        hp: 400,
        attack: 26,
        armor: 24,
        speed: 12,
        crit: 0.08,
        dodge: 0.05,
        elem: "fire",
        skills: ["spit_fire", "fear_chill"],
        tags: [],
        boss: true,
        reward: { coins: [220, 300], seals: 4, materials: ["ash_heart"] }
      }
    ],
    materials: [
      { id: "ash_pelt", name: "\u041F\u0435\u043F\u0435\u043B\u044C\u043D\u0430\u044F \u0448\u043A\u0443\u0440\u0430", icon: "\u{1F43A}", description: "\u0416\u0451\u0441\u0442\u043A\u0430\u044F \u0448\u043A\u0443\u0440\u0430 \u0437\u0432\u0435\u0440\u044F \u0432\u044B\u0436\u0436\u0435\u043D\u043D\u044B\u0445 \u0441\u0442\u0435\u043F\u0435\u0439." },
      { id: "ash_scale", name: "\u041E\u0431\u043E\u0436\u0436\u0451\u043D\u043D\u0430\u044F \u0447\u0435\u0448\u0443\u044F", icon: "\u{1F982}", description: "\u041F\u043B\u0430\u0441\u0442\u0438\u043D\u0430 \u0445\u0438\u0442\u0438\u043D\u0430, \u0437\u0430\u043A\u0430\u043B\u0451\u043D\u043D\u0430\u044F \u0441\u0442\u0435\u043F\u043D\u044B\u043C \u043F\u043E\u0436\u0430\u0440\u043E\u043C." },
      { id: "ash_ember", name: "\u041D\u0435\u0443\u0433\u0430\u0441\u0430\u044E\u0449\u0438\u0439 \u0443\u0433\u043E\u043B\u0451\u043A", icon: "\u{1F525}", description: "\u0422\u043B\u0435\u0435\u0442 \u0432\u0435\u0447\u043D\u043E \u2014 \u043F\u043E\u0434\u0430\u0440\u043E\u043A \u043A\u043E\u0447\u0435\u0432\u044B\u0445 \u0448\u0430\u043C\u0430\u043D\u043E\u0432." },
      { id: "ash_storm_shard", name: "\u041E\u0441\u043A\u043E\u043B\u043E\u043A \u043F\u0435\u043F\u0435\u043B\u044C\u043D\u043E\u0439 \u0431\u0443\u0440\u0438", icon: "\u{1F32A}\uFE0F", description: "\u041A\u0443\u0441\u043E\u0447\u0435\u043A \u0432\u0435\u0442\u0440\u0430, \u0437\u0430\u0441\u0442\u044B\u0432\u0448\u0438\u0439 \u0432\u043C\u0435\u0441\u0442\u0435 \u0441 \u043F\u0435\u043F\u043B\u043E\u043C." },
      { id: "ash_heart", name: "\u0421\u0435\u0440\u0434\u0446\u0435 \u0425\u0430\u043D\u0430 \u0411\u0443\u0440\u044C", icon: "\u{1F48E}", description: "\u041F\u044B\u043B\u0430\u044E\u0449\u0435\u0435 \u0441\u0435\u0440\u0434\u0446\u0435 \u043F\u043E\u0432\u0435\u043B\u0438\u0442\u0435\u043B\u044F \u043F\u0435\u043F\u0435\u043B\u044C\u043D\u044B\u0445 \u0441\u0442\u0435\u043F\u0435\u0439." }
    ],
    battles: [
      {
        id: "ash_01",
        name: "\u0412\u044B\u0436\u0436\u0435\u043D\u043D\u0430\u044F \u0433\u0440\u0430\u043D\u0438\u0446\u0430",
        world: "ash",
        enemies: [{ id: "ash_wolf", scale: 1.9 }, { id: "ash_wolf", scale: 1.9 }],
        unlockAfter: "cr_boss",
        tip: "\u041F\u0435\u043F\u0435\u043B\u044C\u043D\u044B\u0435 \u0432\u043E\u043B\u043A\u0438 \u0431\u044C\u044E\u0442 \u043C\u043E\u0449\u043D\u044B\u043C \u0443\u0434\u0430\u0440\u043E\u043C. \u041D\u0430\u0434\u0451\u0436\u043D\u0430\u044F \u0431\u0440\u043E\u043D\u044F \u0438 \u0449\u0438\u0442 \u0441\u043D\u0438\u043C\u0443\u0442 \u043B\u044C\u0432\u0438\u043D\u0443\u044E \u0434\u043E\u043B\u044E \u0443\u0440\u043E\u043D\u0430."
      },
      {
        id: "ash_02",
        name: "\u0421\u043B\u0435\u0434\u044B \u043A\u0430\u0440\u0430\u0432\u0430\u043D\u0430",
        world: "ash",
        enemies: [{ id: "ash_vulture", scale: 1.913 }, { id: "ash_wolf", scale: 1.913 }],
        unlockAfter: "ash_01",
        tip: "\u0421\u0442\u0435\u0440\u0432\u044F\u0442\u043D\u0438\u043A \u0441\u0442\u0440\u0435\u043B\u044F\u0435\u0442 \u043F\u0440\u0438\u0446\u0435\u043B\u044C\u043D\u043E \u0438\u0437\u0434\u0430\u043B\u0435\u043A\u0430. \u0423\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u0435 \u0438 \u0431\u044B\u0441\u0442\u0440\u044B\u0439 \u0442\u0435\u043C\u043F \u0431\u043E\u044F \u0440\u0435\u0448\u0430\u044E\u0442."
      },
      {
        id: "ash_03",
        name: "\u041A\u043E\u0441\u0442\u0451\u0440 \u0448\u0430\u043C\u0430\u043D\u0430",
        world: "ash",
        enemies: [{ id: "ash_shaman", scale: 1.926 }, { id: "ash_wolf", scale: 1.926 }],
        unlockAfter: "ash_02",
        tip: "\u0428\u0430\u043C\u0430\u043D \u043F\u043B\u044E\u0451\u0442\u0441\u044F \u043E\u0433\u043D\u0451\u043C \u0438 \u043B\u0435\u0447\u0438\u0442 \u0432\u043E\u043B\u043A\u0430. \u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0441\u0431\u0435\u0439 \u0448\u0430\u043C\u0430\u043D\u0430, \u043F\u043E\u043A\u0430 \u043E\u043D \u043D\u0435 \u0432\u044B\u0442\u044F\u043D\u0443\u043B \u0431\u043E\u0439."
      },
      {
        id: "ash_04",
        name: "\u0416\u0430\u043B\u0430 \u0432 \u043F\u0435\u043F\u043B\u0435",
        world: "ash",
        enemies: [{ id: "ash_scorpion", scale: 1.939 }, { id: "ash_scorpion", scale: 1.939 }],
        unlockAfter: "ash_03",
        tip: "\u0421\u043A\u043E\u0440\u043F\u0438\u043E\u043D\u044B \u044F\u0434\u043E\u0432\u0438\u0442\u044B \u0438 \u0442\u043E\u043B\u0441\u0442\u043E\u043A\u043E\u0436\u0438. \u0410\u043D\u0442\u0438\u0434\u043E\u0442 \u0438 \u0442\u044F\u0436\u0451\u043B\u043E\u0435 \u043E\u0440\u0443\u0436\u0438\u0435 \u043F\u0440\u043E\u0442\u0438\u0432 \u0438\u0445 \u043F\u0430\u043D\u0446\u0438\u0440\u0435\u0439."
      },
      {
        id: "ash_05",
        name: "\u0428\u0451\u043F\u043E\u0442 \u0431\u0443\u0440\u0438",
        world: "ash",
        enemies: [{ id: "ash_storm_spirit", scale: 1.953 }, { id: "ash_storm_spirit", scale: 1.953 }],
        unlockAfter: "ash_04",
        tip: "\u0414\u0443\u0445\u0438 \u0431\u0443\u0440\u044C \u043D\u0430\u0432\u043E\u0434\u044F\u0442 \u0441\u0442\u0440\u0430\u0445 \u0438 \u0437\u0430\u043C\u0435\u0434\u043B\u044F\u044E\u0442. \u041B\u0443\u043A \u0438 \u0442\u043E\u043F\u043E\u0440 \u0431\u044C\u044E\u0442 \u043F\u043E \u0434\u0443\u0445\u0430\u043C \u0431\u043E\u043B\u044C\u043D\u0435\u0435."
      },
      {
        id: "ash_06",
        name: "\u041F\u043E\u0433\u0438\u0431\u0448\u0438\u0439 \u043A\u0430\u0440\u0430\u0432\u0430\u043D",
        world: "ash",
        enemies: [{ id: "ash_ghoul", scale: 1.966 }, { id: "ash_vulture", scale: 1.966 }],
        unlockAfter: "ash_05",
        tip: "\u0422\u0435\u043D\u044C \u043A\u0430\u0440\u0430\u0432\u0430\u043D\u0449\u0438\u043A\u0430 \u0443\u0441\u044B\u043F\u043B\u044F\u0435\u0442 \u0438 \u043F\u0443\u0433\u0430\u0435\u0442. \u0428\u043B\u0435\u043C \u043E\u0442 \u0441\u043D\u0430 \u0438 \u0430\u043C\u0443\u043B\u0435\u0442 \u043E\u0442\u0432\u0430\u0433\u0438 \u0432 \u043E\u0434\u043D\u043E\u043C \u043F\u043E\u0445\u043E\u0434\u0435."
      },
      {
        id: "ash_07",
        name: "\u0412\u043E\u043B\u0447\u044C\u044F \u0441\u0442\u0430\u044F",
        world: "ash",
        enemies: [{ id: "ash_wolf", scale: 1.979 }, { id: "ash_wolf", scale: 1.979 }],
        unlockAfter: "ash_06",
        tip: "\u0412\u043E\u043B\u043A\u0438 \u0431\u044C\u044E\u0442 \u043C\u043E\u0449\u043D\u044B\u043C \u0443\u0434\u0430\u0440\u043E\u043C. \u041F\u043E\u0441\u0442\u0440\u043E\u0435\u043D\u0438\u0435 \u0441 \u043A\u0440\u0435\u043F\u043A\u0438\u043C \u0440\u044B\u0446\u0430\u0440\u0435\u043C \u0432\u043F\u0435\u0440\u0435\u0434\u0438 \u0441\u043F\u0430\u0441\u0430\u0435\u0442 \u043E\u0442\u0440\u044F\u0434."
      },
      {
        id: "ash_08",
        name: "\u041E\u0433\u043D\u0435\u043D\u043D\u044B\u0439 \u043E\u0431\u0440\u044F\u0434",
        world: "ash",
        enemies: [
          { id: "ash_shaman", scale: 1.992 },
          { id: "ash_shaman", scale: 1.992 },
          { id: "ash_scorpion", scale: 1.992 }
        ],
        unlockAfter: "ash_07",
        tip: "\u0414\u0432\u0430 \u0448\u0430\u043C\u0430\u043D\u0430 \u043B\u0435\u0447\u0430\u0442 \u0434\u0440\u0443\u0433 \u0434\u0440\u0443\u0433\u0430, \u0430 \u0441\u043A\u043E\u0440\u043F\u0438\u043E\u043D \u0442\u0440\u0430\u0432\u0438\u0442. \u0424\u043E\u043A\u0443\u0441\u0438\u0440\u0443\u0439 \u043E\u0433\u043E\u043D\u044C \u043D\u0430 \u043E\u0434\u043D\u043E\u043C \u0448\u0430\u043C\u0430\u043D\u0435."
      },
      {
        id: "ash_09",
        name: "\u041A\u0440\u044B\u043B\u044C\u044F \u043D\u0430\u0434 \u043F\u0435\u043F\u043B\u043E\u043C",
        world: "ash",
        enemies: [
          { id: "ash_vulture", scale: 2.005 },
          { id: "ash_ghoul", scale: 2.005 },
          { id: "ash_scorpion", scale: 2.005 }
        ],
        unlockAfter: "ash_08",
        tip: "\u0421\u0442\u0435\u0440\u0432\u044F\u0442\u043D\u0438\u043A \u043C\u0435\u0442\u043E\u043A, \u0442\u0435\u043D\u044C \u0443\u0441\u044B\u043F\u043B\u044F\u0435\u0442, \u0441\u043A\u043E\u0440\u043F\u0438\u043E\u043D \u0442\u0440\u0430\u0432\u0438\u0442. \u0428\u043B\u0435\u043C \u043E\u0442 \u0441\u043D\u0430 \u0438 \u0430\u043D\u0442\u0438\u0434\u043E\u0442."
      },
      {
        id: "ash_10",
        name: "\u042F\u0434 \u0438 \u043F\u043B\u0430\u043C\u044F",
        world: "ash",
        enemies: [{ id: "ash_scorpion", scale: 2.018 }, { id: "ash_shaman", scale: 2.018 }],
        unlockAfter: "ash_09",
        tip: "\u042F\u0434 \u0441\u043A\u043E\u0440\u043F\u0438\u043E\u043D\u0430 \u0438 \u043E\u0433\u043E\u043D\u044C \u0448\u0430\u043C\u0430\u043D\u0430 \u0432\u043C\u0435\u0441\u0442\u0435. \u041F\u0440\u043E\u0442\u0438\u0432\u043E\u044F\u0434\u0438\u0435 \u043F\u043B\u044E\u0441 \u0441\u043E\u043F\u0440\u043E\u0442\u0438\u0432\u043B\u0435\u043D\u0438\u0435 \u043E\u0433\u043D\u044E."
      },
      {
        id: "ash_11",
        name: "\u0413\u0440\u043E\u0437\u0430 \u0431\u0435\u0437 \u0434\u043E\u0436\u0434\u044F",
        world: "ash",
        enemies: [{ id: "ash_storm_spirit", scale: 2.032 }, { id: "ash_ghoul", scale: 2.032 }],
        unlockAfter: "ash_10",
        tip: "\u0414\u0432\u0430 \u0434\u0443\u0445\u0430: \u0441\u0442\u0440\u0430\u0445, \u0441\u043E\u043D \u0438 \u0437\u0430\u043C\u0435\u0434\u043B\u0435\u043D\u0438\u0435. \u041E\u0440\u0443\u0436\u0438\u0435 \u043F\u0440\u043E\u0442\u0438\u0432 \u0434\u0443\u0445\u043E\u0432 \u0438 \u0430\u043C\u0443\u043B\u0435\u0442 \u043E\u0442\u0432\u0430\u0433\u0438."
      },
      {
        id: "ash_12",
        name: "\u041E\u0441\u043A\u043E\u043B\u043A\u0438 \u0431\u0443\u0440\u0438",
        world: "ash",
        enemies: [
          { id: "ash_storm_spirit", scale: 2.045 },
          { id: "ash_storm_spirit", scale: 2.045 },
          { id: "ash_vulture", scale: 2.045 }
        ],
        unlockAfter: "ash_11",
        tip: "\u0414\u0443\u0445\u0438 \u0441\u043A\u043E\u0432\u044B\u0432\u0430\u044E\u0442, \u0441\u0442\u0435\u0440\u0432\u044F\u0442\u043D\u0438\u043A \u0434\u043E\u0431\u0438\u0432\u0430\u0435\u0442 \u0438\u0437\u0434\u0430\u043B\u0435\u043A\u0430. \u041D\u0435 \u0434\u0430\u0439 \u0441\u0435\u0431\u044F \u0437\u0430\u043C\u0435\u0434\u043B\u0438\u0442\u044C \u2014 \u0431\u0435\u0440\u0438 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u044C."
      },
      {
        id: "ash_13",
        name: "\u041A\u0430\u0440\u0430\u0432\u0430\u043D \u0442\u0435\u043D\u0435\u0439",
        world: "ash",
        enemies: [
          { id: "ash_ghoul", scale: 2.058 },
          { id: "ash_ghoul", scale: 2.058 },
          { id: "ash_shaman", scale: 2.058 }
        ],
        unlockAfter: "ash_12",
        tip: "\u0422\u0435\u043D\u0438 \u0443\u0441\u044B\u043F\u043B\u044F\u044E\u0442, \u0448\u0430\u043C\u0430\u043D \u0436\u0436\u0451\u0442 \u0438 \u043B\u0435\u0447\u0438\u0442. \u0428\u043B\u0435\u043C \u043E\u0442 \u0441\u043D\u0430 \u2014 \u0438\u043D\u0430\u0447\u0435 \u043E\u0442\u0440\u044F\u0434 \u0437\u0430\u0441\u043D\u0451\u0442 \u043F\u043E\u0434 \u043E\u0433\u043D\u0451\u043C."
      },
      {
        id: "ash_14",
        name: "\u0421\u0442\u0435\u043F\u043D\u0430\u044F \u0437\u0430\u0441\u0430\u0434\u0430",
        world: "ash",
        enemies: [
          { id: "ash_vulture", scale: 2.071 },
          { id: "ash_storm_spirit", scale: 2.071 },
          { id: "ash_ghoul", scale: 2.071 }
        ],
        unlockAfter: "ash_13",
        tip: "\u041C\u0435\u0442\u043A\u0438\u0435 \u0441\u0442\u0440\u0435\u043B\u044B, \u0441\u043F\u043E\u0440\u044B \u0438 \u0441\u043E\u043D. \u0420\u0430\u0437\u043D\u043E\u0448\u0451\u0440\u0441\u0442\u043D\u0430\u044F \u0437\u0430\u0441\u0430\u0434\u0430 \u2014 \u0434\u0435\u0440\u0436\u0438 \u0431\u0430\u043B\u0430\u043D\u0441 \u0437\u0430\u0449\u0438\u0442."
      },
      {
        id: "ash_15",
        name: "\u041F\u0435\u043F\u0435\u043B\u044C\u043D\u044B\u0439 \u043A\u0440\u0443\u0433",
        world: "ash",
        enemies: [
          { id: "ash_shaman", scale: 2.084 },
          { id: "ash_storm_spirit", scale: 2.084 },
          { id: "ash_wolf", scale: 2.084 }
        ],
        unlockAfter: "ash_14",
        tip: "\u0428\u0430\u043C\u0430\u043D \u0437\u0430 \u0441\u043F\u0438\u043D\u043E\u0439 \u0434\u0443\u0445\u0430 \u0438 \u0432\u043E\u043B\u043A\u0430. \u041F\u0440\u043E\u0440\u0432\u0438\u0441\u044C \u0441\u043A\u0432\u043E\u0437\u044C \u0441\u0442\u0440\u043E\u0439 \u0438 \u0441\u0431\u0435\u0439 \u0435\u0433\u043E \u043F\u0435\u0440\u0432\u044B\u043C."
      },
      {
        id: "ash_16",
        name: "\u0412\u0438\u0445\u0440\u044C \u043D\u0430\u0434 \u0433\u043D\u0435\u0437\u0434\u043E\u043C",
        world: "ash",
        enemies: [
          { id: "ash_vulture", scale: 2.097 },
          { id: "ash_storm_spirit", scale: 2.097 },
          { id: "ash_storm_spirit", scale: 2.097 }
        ],
        unlockAfter: "ash_15",
        tip: "\u0421\u0442\u0435\u0440\u0432\u044F\u0442\u043D\u0438\u043A \u0441\u0442\u0440\u0435\u043B\u044F\u0435\u0442 \u0438\u0437 \u043F\u0435\u043F\u0435\u043B\u044C\u043D\u043E\u0433\u043E \u0432\u0438\u0445\u0440\u044F. \u0423\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u0435 \u0438 \u043E\u0440\u0443\u0436\u0438\u0435 \u043F\u0440\u043E\u0442\u0438\u0432 \u0434\u0443\u0445\u043E\u0432."
      },
      {
        id: "ash_17",
        name: "\u0414\u044B\u0445\u0430\u043D\u0438\u0435 \u043F\u043E\u0436\u0430\u0440\u0430",
        world: "ash",
        enemies: [
          { id: "ash_shaman", scale: 2.111 },
          { id: "ash_shaman", scale: 2.111 },
          { id: "ash_storm_spirit", scale: 2.111 }
        ],
        unlockAfter: "ash_16",
        tip: "\u041F\u0430\u0440\u043D\u044B\u0435 \u0448\u0430\u043C\u0430\u043D\u044B \u043F\u043E\u0434 \u043F\u0440\u0438\u043A\u0440\u044B\u0442\u0438\u0435\u043C \u0434\u0443\u0445\u0430. \u0421\u043E\u043F\u0440\u043E\u0442\u0438\u0432\u043B\u0435\u043D\u0438\u0435 \u043E\u0433\u043D\u044E \u0438 \u043E\u0440\u0443\u0436\u0438\u0435 \u043F\u0440\u043E\u0442\u0438\u0432 \u0434\u0443\u0445\u043E\u0432."
      },
      {
        id: "ash_18",
        name: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439 \u043E\u0431\u043E\u0437",
        world: "ash",
        enemies: [
          { id: "ash_ghoul", scale: 2.124 },
          { id: "ash_wolf", scale: 2.124 },
          { id: "ash_storm_spirit", scale: 2.124 }
        ],
        unlockAfter: "ash_17",
        tip: "\u0422\u0435\u043D\u044C \u0443\u0441\u044B\u043F\u043B\u044F\u0435\u0442, \u0432\u043E\u043B\u043A \u0431\u044C\u0451\u0442 \u043C\u043E\u0449\u043D\u043E, \u0434\u0443\u0445 \u043F\u0443\u0433\u0430\u0435\u0442. \u0428\u043B\u0435\u043C \u043E\u0442 \u0441\u043D\u0430 \u0438 \u043A\u0440\u0435\u043F\u043A\u0430\u044F \u0431\u0440\u043E\u043D\u044F."
      },
      {
        id: "ash_19",
        name: "\u041F\u0435\u0440\u0435\u0434 \u043B\u0438\u0446\u043E\u043C \u0425\u0430\u043D\u0430",
        world: "ash",
        enemies: [
          { id: "ash_shaman", scale: 2.137 },
          { id: "ash_storm_spirit", scale: 2.137 },
          { id: "ash_ghoul", scale: 2.137 }
        ],
        unlockAfter: "ash_18",
        tip: "\u0412\u0441\u044F \u043D\u0435\u0447\u0438\u0441\u0442\u044C \u0441\u0442\u0435\u043F\u0438 \u0440\u0430\u0437\u043E\u043C: \u043E\u0433\u043E\u043D\u044C, \u0441\u0442\u0440\u0430\u0445 \u0438 \u0441\u043E\u043D. \u041F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u043F\u0435\u0440\u0435\u0434 \u0425\u0430\u043D\u043E\u043C."
      },
      {
        id: "ash_boss",
        name: "\u0425\u0430\u043D \u043F\u0435\u043F\u0435\u043B\u044C\u043D\u044B\u0445 \u0431\u0443\u0440\u044C",
        world: "ash",
        enemies: [{ id: "ash_khan", scale: 1.9 }],
        unlockAfter: "ash_19",
        tip: "\u0425\u0430\u043D \u0436\u0436\u0451\u0442 \u043E\u0433\u043D\u0451\u043C \u0438 \u043D\u0430\u0432\u043E\u0434\u0438\u0442 \u0441\u0442\u0440\u0430\u0445. \u0421\u043E\u0431\u0435\u0440\u0438 \u043B\u0443\u0447\u0448\u0435\u0435 \u0441\u043D\u0430\u0440\u044F\u0436\u0435\u043D\u0438\u0435 \u0438 \u043E\u0442\u0440\u044F\u0434."
      }
    ]
  };

  // src/data/worlds/jade.js
  var WORLD6 = {
    id: "jade",
    label: "\u{1F38B} \u041D\u0435\u0444\u0440\u0438\u0442\u043E\u0432\u044B\u0439 \u0441\u0430\u0434",
    enemies: [
      {
        id: "jade_warrior",
        name: "\u0411\u0443\u043C\u0430\u0436\u043D\u044B\u0439 \u0432\u043E\u0438\u043D",
        icon: "\u{1F3B4}",
        hp: 150,
        attack: 16,
        armor: 18,
        speed: 8,
        crit: 0.06,
        dodge: 0.04,
        elem: "phys",
        skills: ["heavy_blow"],
        reward: { coins: [90, 120], materials: ["jade_paper"] }
      },
      {
        id: "jade_crane",
        name: "\u041D\u0435\u0444\u0440\u0438\u0442\u043E\u0432\u044B\u0439 \u0436\u0443\u0440\u0430\u0432\u043B\u044C",
        icon: "\u{1F54A}\uFE0F",
        hp: 90,
        attack: 14,
        armor: 10,
        speed: 10,
        crit: 0.09,
        dodge: 0.12,
        elem: "phys",
        skills: ["aimed_shot"],
        reward: { coins: [85, 115], materials: ["jade_feather"] }
      },
      {
        id: "jade_lantern",
        name: "\u0424\u043E\u043D\u0430\u0440\u044C \u043D\u0430 \u0432\u043E\u0434\u0435",
        icon: "\u{1F3EE}",
        hp: 100,
        attack: 19,
        armor: 10,
        speed: 11,
        crit: 0.05,
        dodge: 0.1,
        elem: "fire",
        skills: ["spit_fire", "sting_poison"],
        tags: ["spirit"],
        reward: { coins: [85, 115], materials: ["jade_paper"] }
      },
      {
        id: "jade_kitsune",
        name: "\u0421\u0430\u0434\u043E\u0432\u0430\u044F \u043A\u0438\u0446\u0443\u043D\u044D",
        icon: "\u{1F98A}",
        hp: 110,
        attack: 17,
        armor: 12,
        speed: 12,
        crit: 0.06,
        dodge: 0.11,
        elem: "phys",
        skills: ["pollen_sleep", "fear_chill"],
        tags: ["spirit"],
        reward: { coins: [90, 120], materials: ["jade_fur"] }
      },
      {
        id: "jade_teamaster",
        name: "\u0427\u0430\u0439\u043D\u044B\u0439 \u043C\u0430\u0441\u0442\u0435\u0440-\u0434\u0443\u0445",
        icon: "\u{1F375}",
        hp: 125,
        attack: 15,
        armor: 14,
        speed: 8,
        crit: 0.04,
        dodge: 0.06,
        elem: "phys",
        skills: ["regen_ally_skill", "slow_spores"],
        tags: ["spirit"],
        reward: { coins: [95, 130], materials: ["jade_tea"] }
      },
      // Босс мира
      {
        id: "jade_boss",
        name: "\u0414\u0440\u0430\u043A\u043E\u043D-\u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u0441\u0430\u0434\u0430",
        icon: "\u{1F409}",
        hp: 400,
        attack: 26,
        armor: 26,
        speed: 9,
        crit: 0.08,
        dodge: 0.05,
        elem: "fire",
        skills: ["spit_fire", "heavy_blow", "fear_chill"],
        boss: true,
        tags: ["spirit"],
        reward: { coins: [450, 600], seals: 4, materials: ["jade_pearl"] }
      }
    ],
    materials: [
      { id: "jade_paper", name: "\u041D\u0435\u0444\u0440\u0438\u0442\u043E\u0432\u0430\u044F \u0431\u0443\u043C\u0430\u0433\u0430", icon: "\u{1F3B4}", description: "\u041F\u0440\u043E\u0447\u043D\u0430\u044F, \u043A\u0430\u043A \u0442\u043E\u043D\u043A\u0430\u044F \u043A\u043E\u043B\u044C\u0447\u0443\u0433\u0430." },
      { id: "jade_feather", name: "\u041F\u0435\u0440\u043E \u043D\u0435\u0444\u0440\u0438\u0442\u043E\u0432\u043E\u0433\u043E \u0436\u0443\u0440\u0430\u0432\u043B\u044F", icon: "\u{1FAB6}", description: "\u041B\u0451\u0433\u043A\u043E\u0435, \u0441 \u0437\u0435\u043B\u0435\u043D\u043E\u0432\u0430\u0442\u044B\u043C \u043E\u0442\u043B\u0438\u0432\u043E\u043C." },
      { id: "jade_fur", name: "\u041C\u0435\u0445 \u0441\u0430\u0434\u043E\u0432\u043E\u0439 \u043A\u0438\u0446\u0443\u043D\u044D", icon: "\u{1F98A}", description: "\u041F\u0443\u0448\u0438\u0441\u0442\u044B\u0439 \u0438 \u0447\u0443\u0442\u044C \u0442\u0451\u043F\u043B\u044B\u0439." },
      { id: "jade_tea", name: "\u041B\u0438\u0441\u0442 \u043D\u0435\u0444\u0440\u0438\u0442\u043E\u0432\u043E\u0433\u043E \u0447\u0430\u044F", icon: "\u{1F375}", description: "\u041F\u0430\u0445\u043D\u0435\u0442 \u0434\u043E\u0436\u0434\u0451\u043C \u0438 \u0441\u0442\u0430\u0440\u044B\u043C \u043A\u0430\u043C\u043D\u0435\u043C." },
      { id: "jade_pearl", name: "\u0416\u0435\u043C\u0447\u0443\u0436\u0438\u043D\u0430 \u0434\u0440\u0430\u043A\u043E\u043D\u0430", icon: "\u{1F52E}", description: "\u0412\u043D\u0443\u0442\u0440\u0438 \u043A\u043B\u0443\u0431\u0438\u0442\u0441\u044F \u0442\u0443\u043C\u0430\u043D \u0441\u0430\u0434\u0430." }
    ],
    battles: [
      {
        id: "jade_01",
        name: "\u0411\u0430\u043C\u0431\u0443\u043A\u043E\u0432\u044B\u0435 \u0432\u043E\u0440\u043E\u0442\u0430",
        world: "jade",
        enemies: [{ id: "jade_warrior", scale: 2 }, { id: "jade_teamaster", scale: 2 }],
        unlockAfter: "ash_boss",
        tip: "\u0412\u043E\u0438\u043D \u0431\u044C\u0451\u0442 \u043C\u043E\u0449\u043D\u043E, \u0430 \u043C\u0430\u0441\u0442\u0435\u0440 \u0435\u0433\u043E \u043F\u043E\u0434\u043B\u0435\u0447\u0438\u0432\u0430\u0435\u0442. \u041A\u0440\u0435\u043F\u043A\u0430\u044F \u0431\u0440\u043E\u043D\u044F \u0438 \u0437\u0430\u043F\u0430\u0441 \u0437\u0435\u043B\u0438\u0439."
      },
      {
        id: "jade_02",
        name: "\u0416\u0443\u0440\u0430\u0432\u043B\u0438\u043D\u044B\u0439 \u043F\u0440\u0443\u0434",
        world: "jade",
        enemies: [{ id: "jade_crane", scale: 2.01 }, { id: "jade_kitsune", scale: 2.01 }],
        unlockAfter: "jade_01",
        tip: "\u0422\u043E\u0447\u043D\u044B\u0439 \u043A\u043B\u044E\u0432 \u0438 \u043B\u0438\u0441\u0438\u0439 \u043C\u043E\u0440\u043E\u043A. \u0428\u043B\u0435\u043C \u043E\u0442 \u0441\u043D\u0430 \u043D\u0435 \u043F\u043E\u043C\u0435\u0448\u0430\u0435\u0442."
      },
      {
        id: "jade_03",
        name: "\u0424\u043E\u043D\u0430\u0440\u0438 \u043D\u0430 \u0432\u043E\u0434\u0435",
        world: "jade",
        enemies: [{ id: "jade_lantern", scale: 2.03 }, { id: "jade_lantern", scale: 2.03 }],
        unlockAfter: "jade_02",
        tip: "\u0424\u043E\u043D\u0430\u0440\u0438 \u0436\u0433\u0443\u0442 \u043E\u0433\u043D\u0451\u043C \u0438 \u0442\u0440\u0430\u0432\u044F\u0442 \u0434\u044B\u043C\u043E\u043C. \u0421\u043E\u043F\u0440\u043E\u0442\u0438\u0432\u043B\u0435\u043D\u0438\u0435 \u043E\u0433\u043D\u044E \u0438 \u043F\u0440\u043E\u0442\u0438\u0432\u043E\u044F\u0434\u0438\u0435."
      },
      {
        id: "jade_04",
        name: "\u041B\u0438\u0441\u044C\u044F \u0442\u0440\u043E\u043F\u0430",
        world: "jade",
        enemies: [{ id: "jade_kitsune", scale: 2.04 }, { id: "jade_kitsune", scale: 2.04 }],
        unlockAfter: "jade_03",
        tip: "\u041A\u0438\u0446\u0443\u043D\u044D \u0443\u0441\u044B\u043F\u043B\u044F\u044E\u0442 \u0438 \u043D\u0430\u0432\u043E\u0434\u044F\u0442 \u0441\u0442\u0440\u0430\u0445. \u0428\u043B\u0435\u043C \u043E\u0442 \u0441\u043D\u0430 \u0438 \u0430\u043C\u0443\u043B\u0435\u0442 \u043E\u0442\u0432\u0430\u0433\u0438."
      },
      {
        id: "jade_05",
        name: "\u041F\u043B\u0430\u043C\u044F \u0438 \u0431\u0443\u043C\u0430\u0433\u0430",
        world: "jade",
        enemies: [{ id: "jade_warrior", scale: 2.05 }, { id: "jade_lantern", scale: 2.05 }],
        unlockAfter: "jade_04",
        tip: "\u0424\u043E\u043D\u0430\u0440\u044C \u0436\u0436\u0451\u0442, \u0432\u043E\u0438\u043D \u043A\u0440\u0443\u0448\u0438\u0442. \u0421\u043E\u043F\u0440\u043E\u0442\u0438\u0432\u043B\u0435\u043D\u0438\u0435 \u043E\u0433\u043D\u044E \u0438 \u043A\u0440\u0435\u043F\u043A\u0430\u044F \u0431\u0440\u043E\u043D\u044F."
      },
      {
        id: "jade_06",
        name: "\u0416\u0443\u0440\u0430\u0432\u043B\u0438\u043D\u044B\u0439 \u0442\u0430\u043D\u0435\u0446",
        world: "jade",
        enemies: [{ id: "jade_crane", scale: 2.07 }, { id: "jade_crane", scale: 2.07 }],
        unlockAfter: "jade_05",
        tip: "\u0416\u0443\u0440\u0430\u0432\u043B\u0438\u043D\u044B\u0439 \u043A\u043B\u044E\u0432 \u043D\u0435 \u043F\u0440\u043E\u043C\u0430\u0445\u0438\u0432\u0430\u0435\u0442\u0441\u044F. \u0411\u0440\u043E\u043D\u044F \u0432\u0430\u0436\u043D\u0435\u0435 \u0443\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u044F."
      },
      {
        id: "jade_07",
        name: "\u041F\u0430\u0440 \u043D\u0430\u0434 \u0447\u0430\u0448\u0435\u0439",
        world: "jade",
        enemies: [{ id: "jade_teamaster", scale: 2.08 }, { id: "jade_crane", scale: 2.08 }],
        unlockAfter: "jade_06",
        tip: "\u041C\u0430\u0441\u0442\u0435\u0440 \u043B\u0435\u0447\u0438\u0442 \u0436\u0443\u0440\u0430\u0432\u043B\u044F, \u0430 \u0442\u043E\u0442 \u0431\u044C\u0451\u0442 \u0431\u0435\u0437 \u043F\u0440\u043E\u043C\u0430\u0445\u0430. \u0417\u0430\u043F\u0430\u0441\u0438\u0441\u044C \u0442\u0435\u0440\u043F\u0435\u043D\u0438\u0435\u043C."
      },
      {
        id: "jade_08",
        name: "\u041C\u043E\u0440\u043E\u043A \u043D\u0430\u0434 \u0432\u043E\u0434\u043E\u0439",
        world: "jade",
        enemies: [{ id: "jade_kitsune", scale: 2.09 }, { id: "jade_lantern", scale: 2.09 }],
        unlockAfter: "jade_07",
        tip: "\u0421\u043E\u043D, \u0441\u0442\u0440\u0430\u0445 \u0438 \u0435\u0434\u043A\u0438\u0439 \u0434\u044B\u043C. \u0428\u043B\u0435\u043C \u0431\u0430\u0440\u0441\u0443\u043A\u0430 \u0438 \u043F\u0440\u043E\u0442\u0438\u0432\u043E\u044F\u0434\u0438\u0435."
      },
      {
        id: "jade_09",
        name: "\u041B\u0438\u0441\u0438\u0439 \u0433\u0430\u0440\u043D\u0438\u0437\u043E\u043D",
        world: "jade",
        enemies: [{ id: "jade_warrior", scale: 2.11 }, { id: "jade_kitsune", scale: 2.11 }],
        unlockAfter: "jade_08",
        tip: "\u0412\u043E\u0438\u043D \u043F\u043E\u0434 \u043F\u0440\u0438\u043A\u0440\u044B\u0442\u0438\u0435\u043C \u043A\u0438\u0446\u0443\u043D\u044D. \u0428\u043B\u0435\u043C \u043E\u0442 \u0441\u043D\u0430 \u0438 \u0442\u044F\u0436\u0451\u043B\u0430\u044F \u0431\u0440\u043E\u043D\u044F."
      },
      {
        id: "jade_10",
        name: "\u041E\u0433\u043E\u043D\u044C\u043A\u0438 \u043D\u0430\u0434 \u043F\u0440\u0443\u0434\u043E\u043C",
        world: "jade",
        enemies: [{ id: "jade_lantern", scale: 2.12 }, { id: "jade_crane", scale: 2.12 }],
        unlockAfter: "jade_09",
        tip: "\u0424\u043E\u043D\u0430\u0440\u044C \u0436\u0436\u0451\u0442, \u0436\u0443\u0440\u0430\u0432\u043B\u044C \u043D\u0435 \u043C\u0430\u0436\u0435\u0442. \u0421\u043E\u043F\u0440\u043E\u0442\u0438\u0432\u043B\u0435\u043D\u0438\u0435 \u043E\u0433\u043D\u044E \u0438 \u0431\u0440\u043E\u043D\u044F."
      },
      {
        id: "jade_11",
        name: "\u041A\u0430\u043C\u0435\u043D\u043D\u044B\u0439 \u0441\u0430\u0434",
        world: "jade",
        enemies: [{ id: "jade_warrior", scale: 2.13 }, { id: "jade_crane", scale: 2.13 }],
        unlockAfter: "jade_10",
        tip: "\u041C\u043E\u0449\u043D\u044B\u0439 \u0443\u0434\u0430\u0440 \u0438 \u0442\u043E\u0447\u043D\u044B\u0439 \u043A\u043B\u044E\u0432. \u041A\u0440\u0435\u043F\u043A\u0430\u044F \u0431\u0440\u043E\u043D\u044F \u0440\u0435\u0448\u0430\u0435\u0442."
      },
      {
        id: "jade_12",
        name: "\u0427\u0430\u0439 \u0434\u043B\u044F \u043B\u0438\u0441\u0438\u0446\u044B",
        world: "jade",
        enemies: [{ id: "jade_teamaster", scale: 2.14 }, { id: "jade_kitsune", scale: 2.14 }],
        unlockAfter: "jade_11",
        tip: "\u041B\u0438\u0441\u0438\u0446\u0430 \u0443\u0441\u044B\u043F\u043B\u044F\u0435\u0442, \u043C\u0430\u0441\u0442\u0435\u0440 \u043B\u0435\u0447\u0438\u0442. \u0428\u043B\u0435\u043C \u043E\u0442 \u0441\u043D\u0430 \u0438 \u0442\u0435\u0440\u043F\u0435\u043D\u0438\u0435."
      },
      {
        id: "jade_13",
        name: "\u0427\u0430\u0439 \u043D\u0430 \u0432\u043E\u0434\u0435",
        world: "jade",
        enemies: [{ id: "jade_teamaster", scale: 2.16 }, { id: "jade_lantern", scale: 2.16 }],
        unlockAfter: "jade_12",
        tip: "\u041C\u0430\u0441\u0442\u0435\u0440 \u043B\u0435\u0447\u0438\u0442 \u0444\u043E\u043D\u0430\u0440\u044C, \u0430 \u0442\u043E\u0442 \u0436\u0436\u0451\u0442 \u0438 \u0442\u0440\u0430\u0432\u0438\u0442 \u0434\u044B\u043C\u043E\u043C. \u0421\u043E\u043F\u0440\u043E\u0442\u0438\u0432\u043B\u0435\u043D\u0438\u0435 \u043E\u0433\u043D\u044E \u0438 \u0442\u0435\u0440\u043F\u0435\u043D\u0438\u0435."
      },
      {
        id: "jade_14",
        name: "\u0421\u0442\u0440\u0430\u0436\u0438 \u0444\u043E\u043D\u0430\u0440\u0435\u0439",
        world: "jade",
        enemies: [{ id: "jade_warrior", scale: 2.17 }, { id: "jade_lantern", scale: 2.17 }],
        unlockAfter: "jade_13",
        tip: "\u0412\u043E\u0438\u043D \u0438 \u0444\u043E\u043D\u0430\u0440\u044C. \u0411\u0435\u0437 \u0431\u0440\u043E\u043D\u0438 \u0438 \u0441\u043E\u043F\u0440\u043E\u0442\u0438\u0432\u043B\u0435\u043D\u0438\u044F \u043E\u0433\u043D\u044E \u043D\u0435 \u0432\u044B\u0441\u0442\u043E\u044F\u0442\u044C."
      },
      {
        id: "jade_15",
        name: "\u0414\u0435\u0432\u044F\u0442\u044C \u0445\u0432\u043E\u0441\u0442\u043E\u0432",
        world: "jade",
        enemies: [{ id: "jade_kitsune", scale: 2.18 }, { id: "jade_crane", scale: 2.18 }],
        unlockAfter: "jade_14",
        tip: "\u041B\u0438\u0441\u0438\u0439 \u043C\u043E\u0440\u043E\u043A \u0438 \u0442\u043E\u0447\u043D\u044B\u0439 \u043A\u043B\u044E\u0432. \u0428\u043B\u0435\u043C \u043E\u0442 \u0441\u043D\u0430 \u0438 \u0445\u043E\u0440\u043E\u0448\u0430\u044F \u0431\u0440\u043E\u043D\u044F."
      },
      {
        id: "jade_16",
        name: "\u041F\u0435\u0441\u043D\u044F \u043A\u0430\u043C\u043D\u0435\u0439",
        world: "jade",
        enemies: [{ id: "jade_warrior", scale: 2.2 }, { id: "jade_teamaster", scale: 2.2 }],
        unlockAfter: "jade_15",
        tip: "\u0412\u043E\u0438\u043D \u0438 \u043C\u0430\u0441\u0442\u0435\u0440: \u043C\u043E\u0449\u044C \u0438 \u043B\u0435\u0447\u0435\u043D\u0438\u0435. \u0414\u043E\u043B\u0433\u0438\u0439 \u0431\u043E\u0439 \u2014 \u0431\u0435\u0440\u0438 \u0437\u0435\u043B\u044C\u044F."
      },
      {
        id: "jade_17",
        name: "\u041D\u043E\u0447\u043D\u043E\u0439 \u0444\u0435\u0441\u0442\u0438\u0432\u0430\u043B\u044C",
        world: "jade",
        enemies: [{ id: "jade_crane", scale: 2.21 }, { id: "jade_lantern", scale: 2.21 }],
        unlockAfter: "jade_16",
        tip: "\u0422\u043E\u0447\u043D\u044B\u0439 \u043A\u043B\u044E\u0432 \u0438 \u043D\u0435\u0444\u0440\u0438\u0442\u043E\u0432\u043E\u0435 \u043F\u043B\u0430\u043C\u044F. \u0421\u043E\u043F\u0440\u043E\u0442\u0438\u0432\u043B\u0435\u043D\u0438\u0435 \u043E\u0433\u043D\u044E \u0438 \u0431\u0440\u043E\u043D\u044F."
      },
      {
        id: "jade_18",
        name: "\u0422\u0438\u0445\u0430\u044F \u0446\u0435\u0440\u0435\u043C\u043E\u043D\u0438\u044F",
        world: "jade",
        enemies: [{ id: "jade_teamaster", scale: 2.22 }, { id: "jade_crane", scale: 2.22 }],
        unlockAfter: "jade_17",
        tip: "\u041C\u0430\u0441\u0442\u0435\u0440 \u043B\u0435\u0447\u0438\u0442 \u0436\u0443\u0440\u0430\u0432\u043B\u044F, \u0430 \u0442\u043E\u0442 \u0431\u044C\u0451\u0442 \u0431\u0435\u0437 \u043F\u0440\u043E\u043C\u0430\u0445\u0430. \u0414\u043E\u043B\u0433\u0438\u0439 \u0431\u043E\u0439 \u2014 \u0434\u0435\u0440\u0436\u0438 \u0437\u0435\u043B\u044C\u044F \u043D\u0430\u0433\u043E\u0442\u043E\u0432\u0435."
      },
      {
        id: "jade_19",
        name: "\u0421\u043E\u0432\u0435\u0442 \u0441\u0442\u0430\u0440\u0435\u0439\u0448\u0438\u043D",
        world: "jade",
        enemies: [{ id: "jade_warrior", scale: 2.24 }, { id: "jade_kitsune", scale: 2.24 }],
        unlockAfter: "jade_18",
        tip: "\u0412\u043E\u0438\u043D \u0438 \u043A\u0438\u0446\u0443\u043D\u044D \u043D\u0430 \u043F\u0438\u043A\u0435 \u0441\u0438\u043B\u044B. \u041F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u043F\u0435\u0440\u0435\u0434 \u0414\u0440\u0430\u043A\u043E\u043D\u043E\u043C."
      },
      {
        id: "jade_boss",
        name: "\u0414\u0440\u0430\u043A\u043E\u043D \u043D\u0435\u0444\u0440\u0438\u0442\u043E\u0432\u043E\u0433\u043E \u0441\u0430\u0434\u0430",
        world: "jade",
        enemies: [{ id: "jade_boss", scale: 2 }],
        unlockAfter: "jade_19",
        tip: "\u0425\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u0434\u044B\u0448\u0438\u0442 \u043D\u0435\u0444\u0440\u0438\u0442\u043E\u0432\u044B\u043C \u043F\u043B\u0430\u043C\u0435\u043D\u0435\u043C. \u0421\u043E\u043F\u0440\u043E\u0442\u0438\u0432\u043B\u0435\u043D\u0438\u0435 \u043E\u0433\u043D\u044E \u0438 \u0432\u0441\u0451 \u043B\u0443\u0447\u0448\u0435\u0435, \u0447\u0442\u043E \u0443 \u0442\u0435\u0431\u044F \u0435\u0441\u0442\u044C."
      }
    ]
  };

  // src/data/worlds/deep.js
  var WORLD7 = {
    id: "deep",
    label: "\u{1F41A} \u041F\u043E\u0434\u0432\u043E\u0434\u043D\u044B\u0439 \u0433\u0440\u043E\u0442",
    enemies: [
      {
        id: "deep_siren",
        name: "\u0420\u0443\u0441\u0430\u043B\u043A\u0430-\u043F\u0435\u0432\u0443\u043D\u044C\u044F",
        icon: "\u{1F9DC}\u200D\u2640\uFE0F",
        hp: 95,
        attack: 15,
        armor: 10,
        speed: 11,
        crit: 0.05,
        dodge: 0.1,
        elem: "phys",
        skills: ["pollen_sleep", "regen_ally_skill"],
        reward: { coins: [85, 120], materials: ["deep_siren_scale"] }
      },
      {
        id: "deep_pearl_guard",
        name: "\u0416\u0435\u043C\u0447\u0443\u0436\u043D\u044B\u0439 \u0441\u0442\u0440\u0430\u0436",
        icon: "\u{1F9AA}",
        hp: 150,
        attack: 17,
        armor: 24,
        speed: 6,
        crit: 0.03,
        dodge: 0,
        elem: "phys",
        skills: ["heavy_blow", "slow_spores"],
        reward: { coins: [100, 140], materials: ["deep_reef_stone"] }
      },
      {
        id: "deep_shadow",
        name: "\u0413\u043B\u0443\u0431\u043E\u043A\u043E\u0432\u043E\u0434\u043D\u0430\u044F \u0442\u0435\u043D\u044C",
        icon: "\u{1F311}",
        hp: 85,
        attack: 18,
        armor: 9,
        speed: 12,
        crit: 0.08,
        dodge: 0.14,
        elem: "phys",
        skills: ["fear_chill"],
        tags: ["spirit"],
        reward: { coins: [90, 130], materials: ["deep_sea_mist"] }
      },
      {
        id: "deep_coral_golem",
        name: "\u041A\u043E\u0440\u0430\u043B\u043B\u043E\u0432\u044B\u0439 \u0433\u043E\u043B\u0435\u043C",
        icon: "\u{1FAB8}",
        hp: 160,
        attack: 20,
        armor: 20,
        speed: 5,
        crit: 0.02,
        dodge: 0,
        elem: "phys",
        skills: ["heavy_blow", "sting_poison_weak"],
        reward: { coins: [110, 150], materials: ["deep_reef_stone"] }
      },
      {
        id: "deep_current_spirit",
        name: "\u0414\u0443\u0445 \u0442\u0435\u0447\u0435\u043D\u0438\u044F",
        icon: "\u{1F300}",
        hp: 75,
        attack: 15,
        armor: 8,
        speed: 13,
        crit: 0.06,
        dodge: 0.12,
        elem: "phys",
        skills: ["slow_spores"],
        tags: ["spirit", "ranged"],
        reward: { coins: [85, 125], materials: ["deep_sea_mist"] }
      },
      {
        id: "deep_light_bubble",
        name: "\u041F\u0443\u0437\u044B\u0440\u0451\u043A \u0441\u0432\u0435\u0442\u0430",
        icon: "\u{1FAE7}",
        hp: 68,
        attack: 13,
        armor: 8,
        speed: 12,
        crit: 0.05,
        dodge: 0.14,
        elem: "fire",
        skills: ["spit_fire"],
        reward: { coins: [80, 115], materials: ["deep_light_drop"] }
      },
      // Босс мира
      {
        id: "deep_boss_queen",
        name: "\u0412\u043B\u0430\u0434\u044B\u0447\u0438\u0446\u0430 \u0433\u0440\u043E\u0442\u0430",
        icon: "\u{1F451}",
        hp: 370,
        attack: 26,
        armor: 24,
        speed: 9,
        crit: 0.08,
        dodge: 0.05,
        elem: "phys",
        skills: ["pollen_sleep", "fear_chill", "slow_spores"],
        boss: true,
        reward: { coins: [550, 750], seals: 4, materials: ["deep_abyss_pearl"] }
      }
    ],
    materials: [
      { id: "deep_siren_scale", name: "\u0427\u0435\u0448\u0443\u044F \u043F\u0435\u0432\u0443\u043D\u044C\u0438", icon: "\u{1F3B6}", description: "\u0425\u0440\u0430\u043D\u0438\u0442 \u043E\u0442\u0437\u0432\u0443\u043A \u043F\u043E\u0434\u0432\u043E\u0434\u043D\u043E\u0439 \u043F\u0435\u0441\u043D\u0438." },
      { id: "deep_reef_stone", name: "\u041A\u0430\u043C\u0435\u043D\u044C \u0440\u0438\u0444\u0430", icon: "\u{1FAA8}", description: "\u041E\u0441\u043A\u043E\u043B\u043E\u043A \u0434\u0440\u0435\u0432\u043D\u0435\u0433\u043E \u0440\u0438\u0444\u0430, \u0442\u0451\u043F\u043B\u044B\u0439 \u043D\u0430 \u043E\u0449\u0443\u043F\u044C." },
      { id: "deep_sea_mist", name: "\u041C\u043E\u0440\u0441\u043A\u0430\u044F \u0434\u044B\u043C\u043A\u0430", icon: "\u{1F32B}\uFE0F", description: "\u0425\u043E\u043B\u043E\u0434\u043D\u044B\u0439 \u0442\u0443\u043C\u0430\u043D, \u043F\u043E\u0434\u043D\u044F\u0442\u044B\u0439 \u0441\u043E \u0434\u043D\u0430." },
      { id: "deep_light_drop", name: "\u041A\u0430\u043F\u0435\u043B\u044C\u043A\u0430 \u0441\u0432\u0435\u0442\u0430", icon: "\u{1FAE7}", description: "\u0421\u0432\u0435\u0442\u0438\u0442\u0441\u044F, \u0435\u0441\u043B\u0438 \u0435\u0451 \u043F\u043E\u0433\u043B\u0430\u0434\u0438\u0442\u044C." },
      { id: "deep_abyss_pearl", name: "\u0416\u0435\u043C\u0447\u0443\u0436\u0438\u043D\u0430 \u0431\u0435\u0437\u0434\u043D\u044B", icon: "\u{1F52E}", description: "\u0412\u043D\u0443\u0442\u0440\u0438 \u043F\u043B\u0435\u0449\u0435\u0442\u0441\u044F \u0442\u0451\u043C\u043D\u0430\u044F \u0432\u043E\u0434\u0430." }
    ],
    battles: [
      {
        id: "deep_01",
        name: "\u041F\u0443\u0437\u044B\u0440\u044C\u043A\u0438 \u0443 \u0432\u0445\u043E\u0434\u0430",
        world: "deep",
        enemies: [{ id: "deep_light_bubble", scale: 2.1 }, { id: "deep_light_bubble", scale: 2.1 }],
        unlockAfter: "jade_boss",
        tip: "\u041F\u0443\u0437\u044B\u0440\u044C\u043A\u0438 \u0436\u0433\u0443\u0442 \u043E\u0441\u043B\u0435\u043F\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u043C \u0441\u0432\u0435\u0442\u043E\u043C. \u041F\u0440\u0438\u0433\u043E\u0434\u0438\u0442\u0441\u044F \u0441\u043E\u043F\u0440\u043E\u0442\u0438\u0432\u043B\u0435\u043D\u0438\u0435 \u043E\u0433\u043D\u044E."
      },
      {
        id: "deep_02",
        name: "\u041F\u0435\u0441\u043D\u044C \u0437\u0430 \u0441\u043A\u0430\u043B\u043E\u0439",
        world: "deep",
        enemies: [{ id: "deep_siren", scale: 2.11 }, { id: "deep_siren", scale: 2.11 }],
        unlockAfter: "deep_01",
        tip: "\u041F\u0435\u0441\u043D\u044F \u0443\u0441\u044B\u043F\u043B\u044F\u0435\u0442. \u0428\u043B\u0435\u043C \u0441\u043E\u043D\u043D\u043E\u0433\u043E \u0431\u0430\u0440\u0441\u0443\u043A\u0430 \u0438\u043B\u0438 \u0437\u0435\u043B\u044C\u0435 \u0431\u043E\u0434\u0440\u043E\u0441\u0442\u0438."
      },
      {
        id: "deep_03",
        name: "\u0416\u0435\u043C\u0447\u0443\u0436\u043D\u044B\u0439 \u043F\u043E\u0441\u0442",
        world: "deep",
        enemies: [{ id: "deep_pearl_guard", scale: 2.12 }, { id: "deep_light_bubble", scale: 2.12 }],
        unlockAfter: "deep_02",
        tip: "\u0421\u0442\u0440\u0430\u0436 \u043A\u0440\u0435\u043F\u043E\u043A, \u043F\u0443\u0437\u044B\u0440\u0451\u043A \u0436\u0436\u0451\u0442\u0441\u044F. \u0422\u044F\u0436\u0451\u043B\u043E\u0435 \u043E\u0440\u0443\u0436\u0438\u0435 \u043F\u0440\u043E\u0431\u044C\u0451\u0442 \u043F\u0430\u043D\u0446\u0438\u0440\u044C."
      },
      {
        id: "deep_04",
        name: "\u0422\u0435\u043D\u044C \u0432 \u0440\u0430\u0441\u0449\u0435\u043B\u0438\u043D\u0435",
        world: "deep",
        enemies: [{ id: "deep_shadow", scale: 2.14 }, { id: "deep_shadow", scale: 2.14 }],
        unlockAfter: "deep_03",
        tip: "\u0422\u0435\u043D\u0438 \u043D\u0430\u0432\u043E\u0434\u044F\u0442 \u0443\u0436\u0430\u0441. \u0410\u043C\u0443\u043B\u0435\u0442 \u043E\u0442\u0432\u0430\u0433\u0438 \u0432\u0435\u0440\u043D\u0451\u0442 \u0440\u044B\u0446\u0430\u0440\u044E \u0442\u0432\u0451\u0440\u0434\u043E\u0441\u0442\u044C \u0440\u0443\u043A\u0438."
      },
      {
        id: "deep_05",
        name: "\u041A\u043E\u0440\u0430\u043B\u043B\u043E\u0432\u044B\u0439 \u0437\u0430\u0432\u0430\u043B",
        world: "deep",
        enemies: [{ id: "deep_coral_golem", scale: 2.15 }, { id: "deep_light_bubble", scale: 2.15 }],
        unlockAfter: "deep_04",
        tip: "\u0413\u043E\u043B\u0435\u043C \u0440\u0435\u0436\u0435\u0442 \u044F\u0434\u043E\u0432\u0438\u0442\u044B\u043C\u0438 \u043A\u043E\u0440\u0430\u043B\u043B\u0430\u043C\u0438. \u0410\u043C\u0443\u043B\u0435\u0442 \u043F\u0440\u043E\u0442\u0438\u0432\u043E\u044F\u0434\u0438\u044F \u043D\u0435 \u043F\u043E\u043C\u0435\u0448\u0430\u0435\u0442."
      },
      {
        id: "deep_06",
        name: "\u0418\u0433\u0440\u044B \u0442\u0435\u0447\u0435\u043D\u0438\u044F",
        world: "deep",
        enemies: [{ id: "deep_current_spirit", scale: 2.16 }, { id: "deep_current_spirit", scale: 2.16 }],
        unlockAfter: "deep_05",
        tip: "\u0414\u0443\u0445\u0438 \u0441\u0442\u0430\u0441\u043A\u0438\u0432\u0430\u044E\u0442 \u0442\u0435\u0447\u0435\u043D\u0438\u0435\u043C \u0438 \u0431\u044C\u044E\u0442 \u043F\u043E \u0441\u043B\u0430\u0431\u0435\u0439\u0448\u0435\u043C\u0443. \u041F\u0440\u0438\u043A\u0440\u043E\u0439 \u0437\u0430\u0434\u043D\u0438\u0439 \u0440\u044F\u0434."
      },
      {
        id: "deep_07",
        name: "\u0425\u043E\u0440 \u043D\u0430 \u043E\u0442\u043C\u0435\u043B\u0438",
        world: "deep",
        enemies: [
          { id: "deep_siren", scale: 2.18 },
          { id: "deep_siren", scale: 2.18 },
          { id: "deep_light_bubble", scale: 2.18 }
        ],
        unlockAfter: "deep_06",
        tip: "\u0425\u043E\u0440 \u0443\u0441\u044B\u043F\u043B\u044F\u0435\u0442, \u0430 \u043F\u0443\u0437\u044B\u0440\u0451\u043A \u0436\u0436\u0451\u0442\u0441\u044F. \u0417\u0435\u043B\u044C\u0435 \u0431\u043E\u0434\u0440\u043E\u0441\u0442\u0438 \u0438 \u0441\u043E\u043F\u0440\u043E\u0442\u0438\u0432\u043B\u0435\u043D\u0438\u0435 \u043E\u0433\u043D\u044E."
      },
      {
        id: "deep_08",
        name: "\u0421\u0442\u0440\u0430\u0436 \u0438 \u0442\u0435\u043D\u044C",
        world: "deep",
        enemies: [{ id: "deep_pearl_guard", scale: 2.19 }, { id: "deep_shadow", scale: 2.19 }],
        unlockAfter: "deep_07",
        tip: "\u041A\u0440\u0435\u043F\u043A\u0438\u0439 \u0441\u0442\u0440\u0430\u0436 \u0438 \u0436\u0443\u0442\u043A\u0430\u044F \u0442\u0435\u043D\u044C. \u0410\u043C\u0443\u043B\u0435\u0442 \u043E\u0442\u0432\u0430\u0433\u0438 \u0438 \u0442\u044F\u0436\u0451\u043B\u043E\u0435 \u043E\u0440\u0443\u0436\u0438\u0435."
      },
      {
        id: "deep_09",
        name: "\u0421\u0430\u0434\u044B \u043A\u043E\u0440\u0430\u043B\u043B\u043E\u0432",
        world: "deep",
        enemies: [{ id: "deep_coral_golem", scale: 2.2 }, { id: "deep_current_spirit", scale: 2.2 }],
        unlockAfter: "deep_08",
        tip: "\u042F\u0434 \u043A\u043E\u0440\u0430\u043B\u043B\u0430 \u0438 \u0441\u0442\u044F\u0433\u0443\u044E\u0449\u0435\u0435 \u0442\u0435\u0447\u0435\u043D\u0438\u0435. \u041F\u0440\u043E\u0442\u0438\u0432\u043E\u044F\u0434\u0438\u0435 \u0438 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u044C."
      },
      {
        id: "deep_10",
        name: "\u041F\u043E\u044E\u0449\u0438\u0435 \u0440\u0438\u0444\u044B",
        world: "deep",
        enemies: [{ id: "deep_siren", scale: 2.21 }, { id: "deep_shadow", scale: 2.21 }],
        unlockAfter: "deep_09",
        tip: "\u0421\u043E\u043D \u0438 \u0441\u0442\u0440\u0430\u0445 \u0432 \u043E\u0434\u043D\u043E\u043C \u0445\u043E\u0440\u0435. \u0428\u043B\u0435\u043C \u0431\u0430\u0440\u0441\u0443\u043A\u0430 \u0438 \u0430\u043C\u0443\u043B\u0435\u0442 \u043E\u0442\u0432\u0430\u0433\u0438."
      },
      {
        id: "deep_11",
        name: "\u041F\u0443\u0437\u044B\u0440\u044C\u043A\u043E\u0432\u044B\u0439 \u0440\u043E\u0439",
        world: "deep",
        enemies: [
          { id: "deep_light_bubble", scale: 2.22 },
          { id: "deep_light_bubble", scale: 2.22 },
          { id: "deep_light_bubble", scale: 2.22 }
        ],
        unlockAfter: "deep_10",
        tip: "\u0422\u0440\u043E\u0438\u0446\u0430 \u0441\u0432\u0435\u0442\u043B\u044F\u0447\u043A\u043E\u0432 \u0436\u0436\u0451\u0442 \u0440\u0430\u0437\u043E\u043C. \u0421\u043E\u043F\u0440\u043E\u0442\u0438\u0432\u043B\u0435\u043D\u0438\u0435 \u043E\u0433\u043D\u044E \u0440\u0435\u0448\u0430\u0435\u0442."
      },
      {
        id: "deep_12",
        name: "\u0416\u0435\u043C\u0447\u0443\u0436\u043D\u0430\u044F \u0441\u0442\u0440\u0430\u0436\u0430",
        world: "deep",
        enemies: [{ id: "deep_pearl_guard", scale: 2.24 }, { id: "deep_pearl_guard", scale: 2.24 }],
        unlockAfter: "deep_11",
        tip: "\u0414\u0432\u0430 \u0436\u0435\u043C\u0447\u0443\u0436\u043D\u044B\u0445 \u0441\u0442\u0440\u0430\u0436\u0430 \u2014 \u0441\u043F\u043B\u043E\u0448\u043D\u0430\u044F \u0441\u0442\u0435\u043D\u0430. \u041D\u0443\u0436\u0435\u043D \u0443\u0440\u043E\u043D \u043F\u043E\u0442\u044F\u0436\u0435\u043B\u0435\u0435."
      },
      {
        id: "deep_13",
        name: "\u0425\u043E\u043B\u043E\u0434\u043D\u044B\u0439 \u0432\u043E\u0434\u043E\u0432\u043E\u0440\u043E\u0442",
        world: "deep",
        enemies: [{ id: "deep_current_spirit", scale: 2.25 }, { id: "deep_shadow", scale: 2.25 }],
        unlockAfter: "deep_12",
        tip: "\u0422\u0435\u0447\u0435\u043D\u0438\u0435 \u0441\u0442\u0430\u0441\u043A\u0438\u0432\u0430\u0435\u0442, \u0442\u0435\u043D\u044C \u043B\u0435\u0434\u0435\u043D\u0438\u0442. \u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u0438 \u0430\u043C\u0443\u043B\u0435\u0442 \u043E\u0442\u0432\u0430\u0433\u0438."
      },
      {
        id: "deep_14",
        name: "\u041A\u043E\u0440\u0430\u043B\u043B\u043E\u0432\u044B\u0439 \u0445\u043E\u0440",
        world: "deep",
        enemies: [{ id: "deep_coral_golem", scale: 2.26 }, { id: "deep_siren", scale: 2.26 }],
        unlockAfter: "deep_13",
        tip: "\u0413\u043E\u043B\u0435\u043C \u0434\u0435\u0440\u0436\u0438\u0442 \u0443\u0434\u0430\u0440, \u043F\u043E\u043A\u0430 \u0440\u0443\u0441\u0430\u043B\u043A\u0430 \u043F\u043E\u0451\u0442. \u0411\u0443\u0434\u0438 \u0440\u044B\u0446\u0430\u0440\u044F \u043F\u043E\u0431\u044B\u0441\u0442\u0440\u0435\u0435."
      },
      {
        id: "deep_15",
        name: "\u0421\u0432\u0435\u0442\u043E\u0432\u043E\u0439 \u0432\u043E\u0434\u043E\u0432\u043E\u0440\u043E\u0442",
        world: "deep",
        enemies: [{ id: "deep_current_spirit", scale: 2.28 }, { id: "deep_light_bubble", scale: 2.28 }],
        unlockAfter: "deep_14",
        tip: "\u0414\u0443\u0445 \u0441\u0442\u0430\u0441\u043A\u0438\u0432\u0430\u0435\u0442 \u0441\u043B\u0430\u0431\u0435\u0439\u0448\u0438\u0445, \u043F\u0443\u0437\u044B\u0440\u0451\u043A \u0436\u0436\u0451\u0442 \u0441\u0432\u0435\u0442\u043E\u043C. \u041F\u0440\u0438\u043A\u0440\u043E\u0439 \u0437\u0430\u0434\u043D\u0438\u0439 \u0440\u044F\u0434."
      },
      {
        id: "deep_16",
        name: "\u041C\u0440\u0430\u043A \u0433\u0440\u043E\u0442\u0430",
        world: "deep",
        enemies: [{ id: "deep_shadow", scale: 2.29 }, { id: "deep_pearl_guard", scale: 2.29 }],
        unlockAfter: "deep_15",
        tip: "\u0421\u0442\u0435\u043D\u0430 \u043F\u0435\u0440\u043B\u0430\u043C\u0443\u0442\u0440\u0430 \u0438 \u043B\u0435\u0434\u0435\u043D\u044F\u0449\u0430\u044F \u0442\u0435\u043D\u044C. \u0410\u043C\u0443\u043B\u0435\u0442 \u043E\u0442\u0432\u0430\u0433\u0438 \u0438 \u0442\u044F\u0436\u0451\u043B\u043E\u0435 \u043E\u0440\u0443\u0436\u0438\u0435."
      },
      {
        id: "deep_17",
        name: "\u041F\u0435\u0441\u043D\u044C \u0433\u043B\u0443\u0431\u0438\u043D",
        world: "deep",
        enemies: [
          { id: "deep_siren", scale: 2.15 },
          { id: "deep_siren", scale: 2.15 },
          { id: "deep_shadow", scale: 2.15 }
        ],
        unlockAfter: "deep_16",
        tip: "\u0414\u0432\u043E\u0439\u043D\u043E\u0439 \u0445\u043E\u0440 \u0438 \u0442\u0435\u043D\u044C. \u0411\u0435\u0437 \u0431\u043E\u0434\u0440\u043E\u0441\u0442\u0438 \u0440\u044B\u0446\u0430\u0440\u044C \u0443\u0441\u043D\u0451\u0442 \u043D\u0430\u0434\u043E\u043B\u0433\u043E."
      },
      {
        id: "deep_18",
        name: "\u041A\u0440\u0435\u043F\u043E\u0441\u0442\u044C \u043A\u043E\u0440\u0430\u043B\u043B\u0430",
        world: "deep",
        enemies: [{ id: "deep_coral_golem", scale: 2.31 }, { id: "deep_coral_golem", scale: 2.31 }],
        unlockAfter: "deep_17",
        tip: "\u0414\u0432\u0430 \u043A\u043E\u0440\u0430\u043B\u043B\u043E\u0432\u044B\u0445 \u0433\u043E\u043B\u0435\u043C\u0430: \u044F\u0434 \u0438 \u0442\u043E\u043B\u0441\u0442\u044B\u0435 \u043F\u0430\u043D\u0446\u0438\u0440\u0438. \u0422\u044F\u0436\u0451\u043B\u043E\u0435 \u043E\u0440\u0443\u0436\u0438\u0435 \u0432 \u0440\u0443\u043A\u0438."
      },
      {
        id: "deep_19",
        name: "\u0413\u043E\u043B\u043E\u0441\u0430 \u0433\u0440\u043E\u0442\u0430",
        world: "deep",
        enemies: [{ id: "deep_pearl_guard", scale: 2.33 }, { id: "deep_siren", scale: 2.33 }],
        unlockAfter: "deep_18",
        tip: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439 \u043A\u0430\u0440\u0430\u0443\u043B \u043F\u0435\u0440\u0435\u0434 \u0442\u0440\u043E\u043D\u043E\u043C: \u0441\u0442\u0440\u0430\u0436 \u0438 \u043F\u0435\u0432\u0443\u043D\u044C\u044F. \u0422\u044F\u0436\u0451\u043B\u043E\u0435 \u043E\u0440\u0443\u0436\u0438\u0435 \u0438 \u0431\u043E\u0434\u0440\u043E\u0441\u0442\u044C."
      },
      {
        id: "deep_boss",
        name: "\u0412\u043B\u0430\u0434\u044B\u0447\u0438\u0446\u0430 \u0433\u0440\u043E\u0442\u0430",
        world: "deep",
        enemies: [{ id: "deep_boss_queen", scale: 2.35 }],
        unlockAfter: "deep_19",
        tip: "\u0412\u043B\u0430\u0434\u044B\u0447\u0438\u0446\u0430 \u0443\u0441\u044B\u043F\u043B\u044F\u0435\u0442 \u043F\u0435\u0441\u043D\u0435\u0439, \u043B\u0435\u0434\u0435\u043D\u0438\u0442 \u0432\u0437\u0433\u043B\u044F\u0434\u043E\u043C \u0438 \u0441\u0442\u0430\u0441\u043A\u0438\u0432\u0430\u0435\u0442 \u0442\u0435\u0447\u0435\u043D\u0438\u0435\u043C. \u0428\u043B\u0435\u043C \u0431\u0430\u0440\u0441\u0443\u043A\u0430 \u0438 \u0430\u043C\u0443\u043B\u0435\u0442 \u043E\u0442\u0432\u0430\u0433\u0438."
      }
    ]
  };

  // src/data/worlds/mist.js
  var WORLD8 = {
    id: "mist",
    label: "\u23F3 \u0422\u0443\u043C\u0430\u043D\u043D\u044B\u0435 \u0447\u0430\u0441\u044B",
    enemies: [
      {
        id: "mist_clock_spirit",
        name: "\u0427\u0430\u0441\u043E\u0432\u043E\u0439 \u0434\u0443\u0445",
        icon: "\u{1F570}\uFE0F",
        hp: 80,
        attack: 14,
        armor: 8,
        speed: 12,
        crit: 0.06,
        dodge: 0.1,
        elem: "phys",
        skills: ["fear_chill"],
        tags: ["spirit"],
        reward: { coins: [95, 130], materials: ["mist_gear_dust"] }
      },
      {
        id: "mist_rust_automaton",
        name: "\u0420\u0436\u0430\u0432\u044B\u0439 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u043E\u043D",
        icon: "\u{1F916}",
        hp: 100,
        attack: 16,
        armor: 16,
        speed: 6,
        crit: 0.04,
        dodge: 0,
        elem: "phys",
        skills: ["heavy_blow"],
        tags: [],
        reward: { coins: [110, 150], materials: ["mist_rust_flake"] }
      },
      {
        id: "mist_echo_keeper",
        name: "\u042D\u0445\u043E \u043B\u0430\u0432\u043E\u0447\u043D\u0438\u043A\u0430",
        icon: "\u{1F56F}\uFE0F",
        hp: 75,
        attack: 15,
        armor: 8,
        speed: 11,
        crit: 0.05,
        dodge: 0.14,
        elem: "phys",
        skills: ["pollen_sleep"],
        tags: ["spirit"],
        reward: { coins: [100, 135], materials: ["mist_echo_shard"] }
      },
      {
        id: "mist_sand_wisp",
        name: "\u041F\u0435\u0441\u0447\u0430\u043D\u044B\u0439 \u043E\u0433\u043E\u043D\u0451\u043A",
        icon: "\u23F3",
        hp: 85,
        attack: 14,
        armor: 10,
        speed: 13,
        crit: 0.07,
        dodge: 0.12,
        elem: "phys",
        skills: ["slow_spores"],
        tags: [],
        reward: { coins: [95, 130], materials: ["mist_sand_grain"] }
      },
      {
        id: "mist_cog_hound",
        name: "\u0428\u0435\u0441\u0442\u0435\u0440\u0451\u043D\u043D\u0430\u044F \u0433\u043E\u043D\u0447\u0430\u044F",
        icon: "\u{1F43A}",
        hp: 80,
        attack: 12,
        armor: 10,
        speed: 11,
        crit: 0.08,
        dodge: 0.08,
        elem: "phys",
        skills: ["aimed_shot"],
        tags: [],
        reward: { coins: [105, 140], materials: ["mist_gear_dust"] }
      },
      {
        id: "mist_time_warden",
        name: "\u0425\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u0432\u0440\u0435\u043C\u0435\u043D\u0438",
        icon: "\u{1F5DD}\uFE0F",
        hp: 90,
        attack: 15,
        armor: 16,
        speed: 9,
        crit: 0.05,
        dodge: 0.05,
        elem: "phys",
        skills: ["regen_ally_skill", "slow_spores"],
        tags: ["spirit"],
        reward: { coins: [120, 160], materials: ["mist_echo_shard"] }
      },
      // Босс мира: кульминация игры — само Время
      {
        id: "mist_boss",
        name: "\u0421\u0430\u043C\u043E \u0412\u0440\u0435\u043C\u044F",
        icon: "\u231B",
        hp: 500,
        attack: 33,
        armor: 34,
        speed: 11,
        crit: 0.12,
        dodge: 0.06,
        elem: "phys",
        skills: ["heavy_blow", "slow_spores", "fear_chill"],
        tags: ["spirit"],
        boss: true,
        reward: { coins: [900, 1200], seals: 6, materials: ["mist_heart_of_time"] }
      }
    ],
    materials: [
      { id: "mist_gear_dust", name: "\u0427\u0430\u0441\u043E\u0432\u0430\u044F \u043F\u044B\u043B\u044C", icon: "\u2699\uFE0F", description: "\u0422\u0438\u043A\u0430\u0435\u0442, \u0435\u0441\u043B\u0438 \u043F\u0440\u0438\u0441\u043B\u0443\u0448\u0430\u0442\u044C\u0441\u044F." },
      { id: "mist_rust_flake", name: "\u0420\u0436\u0430\u0432\u0430\u044F \u043E\u043A\u0430\u043B\u0438\u043D\u0430", icon: "\u{1F529}", description: "\u041A\u043E\u0433\u0434\u0430-\u0442\u043E \u0431\u044B\u043B\u0430 \u0447\u044C\u0438\u043C-\u0442\u043E \u0441\u0435\u0440\u0434\u0446\u0435\u043C." },
      { id: "mist_echo_shard", name: "\u041E\u0441\u043A\u043E\u043B\u043E\u043A \u044D\u0445\u0430", icon: "\u{1F52E}", description: "\u041F\u043E\u0432\u0442\u043E\u0440\u044F\u0435\u0442 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u0441\u043B\u043E\u0432\u0430 \u043B\u0430\u0432\u043E\u0447\u043D\u0438\u043A\u0430." },
      { id: "mist_sand_grain", name: "\u041F\u0435\u0441\u0447\u0438\u043D\u043A\u0430 \u0432\u0435\u0447\u043D\u043E\u0441\u0442\u0438", icon: "\u{1F32B}\uFE0F", description: "\u041F\u0430\u0434\u0430\u0435\u0442 \u0432\u0432\u0435\u0440\u0445, \u0430 \u043D\u0435 \u0432\u043D\u0438\u0437." },
      { id: "mist_heart_of_time", name: "\u0421\u0435\u0440\u0434\u0446\u0435 \u0432\u0440\u0435\u043C\u0435\u043D\u0438", icon: "\u{1F4A0}", description: "\u0411\u044C\u0451\u0442\u0441\u044F \u043E\u0434\u0438\u043D \u0440\u0430\u0437 \u0432 \u0441\u0442\u043E\u043B\u0435\u0442\u0438\u0435." }
    ],
    battles: [
      {
        id: "mist_01",
        name: "\u041F\u0435\u0440\u0432\u044B\u0439 \u0437\u0432\u043E\u043D \u0447\u0430\u0441\u043E\u0432",
        world: "mist",
        enemies: [{ id: "mist_clock_spirit", scale: 2.2 }, { id: "mist_clock_spirit", scale: 2.2 }],
        unlockAfter: "deep_boss",
        tip: "\u0427\u0430\u0441\u043E\u0432\u044B\u0435 \u0434\u0443\u0445\u0438 \u043D\u0430\u0432\u043E\u0434\u044F\u0442 \u0441\u0442\u0440\u0430\u0445. \u0410\u043C\u0443\u043B\u0435\u0442 \u043E\u0442\u0432\u0430\u0433\u0438 \u0438 \u043E\u0440\u0443\u0436\u0438\u0435 \u043F\u0440\u043E\u0442\u0438\u0432 \u0434\u0443\u0445\u043E\u0432."
      },
      {
        id: "mist_02",
        name: "\u0420\u0436\u0430\u0432\u044B\u0439 \u0437\u0430\u0432\u043E\u0434",
        world: "mist",
        enemies: [{ id: "mist_rust_automaton", scale: 2.22 }, { id: "mist_sand_wisp", scale: 2.22 }],
        unlockAfter: "mist_01",
        tip: "\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u043E\u043D \u0431\u044C\u0451\u0442 \u0442\u044F\u0436\u0435\u043B\u043E, \u043E\u0433\u043E\u043D\u0451\u043A \u0437\u0430\u043C\u0435\u0434\u043B\u044F\u0435\u0442. \u0414\u0435\u0440\u0436\u0438 \u0442\u0435\u043C\u043F \u0438 \u0437\u0435\u043B\u044C\u044F."
      },
      {
        id: "mist_03",
        name: "\u0413\u043E\u043B\u043E\u0441 \u0438\u0437-\u0437\u0430 \u043F\u0440\u0438\u043B\u0430\u0432\u043A\u0430",
        world: "mist",
        enemies: [{ id: "mist_echo_keeper", scale: 2.23 }, { id: "mist_echo_keeper", scale: 2.23 }],
        unlockAfter: "mist_02",
        tip: "\u042D\u0445\u043E \u0443\u0441\u044B\u043F\u043B\u044F\u0435\u0442 \u043F\u044B\u043B\u044C\u0446\u043E\u0439. \u0428\u043B\u0435\u043C \u0431\u0430\u0440\u0441\u0443\u043A\u0430 \u0438\u043B\u0438 \u0437\u0435\u043B\u044C\u0435 \u0431\u043E\u0434\u0440\u043E\u0441\u0442\u0438."
      },
      {
        id: "mist_04",
        name: "\u041A\u043B\u044B\u043A \u0438 \u043F\u0435\u0441\u043E\u043A",
        world: "mist",
        enemies: [{ id: "mist_cog_hound", scale: 2.25 }, { id: "mist_sand_wisp", scale: 2.25 }],
        unlockAfter: "mist_03",
        tip: "\u0413\u043E\u043D\u0447\u0430\u044F \u0431\u044C\u0451\u0442 \u043F\u0440\u0438\u0446\u0435\u043B\u044C\u043D\u043E, \u043E\u0433\u043E\u043D\u0451\u043A \u0442\u044F\u043D\u0435\u0442 \u0432\u0440\u0435\u043C\u044F. \u0423\u0431\u0435\u0439 \u0433\u043E\u043D\u0447\u0443\u044E \u043F\u0435\u0440\u0432\u043E\u0439."
      },
      {
        id: "mist_05",
        name: "\u041C\u0435\u0445\u0430\u043D\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0434\u043E\u0437\u043E\u0440",
        world: "mist",
        enemies: [{ id: "mist_rust_automaton", scale: 2.27 }, { id: "mist_clock_spirit", scale: 2.27 }],
        unlockAfter: "mist_04",
        tip: "\u0421\u0442\u0435\u043D\u0430 \u0438\u0437 \u0440\u0436\u0430\u0432\u0447\u0438\u043D\u044B \u0438 \u0434\u0443\u0445 \u0437\u0430 \u043D\u0435\u0439. \u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0434\u0443\u0445 \u2014 \u043E\u043D \u0445\u0440\u0443\u043F\u0447\u0435."
      },
      {
        id: "mist_06",
        name: "\u041F\u044B\u043B\u044C \u0432\u0435\u043A\u043E\u0432",
        world: "mist",
        enemies: [
          { id: "mist_sand_wisp", scale: 2.15 },
          { id: "mist_sand_wisp", scale: 2.15 },
          { id: "mist_echo_keeper", scale: 2.15 }
        ],
        unlockAfter: "mist_05",
        tip: "\u0417\u0430\u043C\u0435\u0434\u043B\u0435\u043D\u0438\u0435 \u0438 \u0441\u043E\u043D \u0432 \u043E\u0434\u043D\u043E\u043C \u0431\u043E\u044E. \u0417\u0435\u043B\u044C\u0435 \u0431\u043E\u0434\u0440\u043E\u0441\u0442\u0438 \u0438 \u0442\u0435\u043C\u043F."
      },
      {
        id: "mist_07",
        name: "\u0425\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u0443 \u0441\u0442\u0430\u043D\u043A\u0430",
        world: "mist",
        enemies: [{ id: "mist_time_warden", scale: 2.3 }, { id: "mist_rust_automaton", scale: 2.3 }],
        unlockAfter: "mist_06",
        tip: "\u0425\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u043B\u0435\u0447\u0438\u0442 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u043E\u043D\u0430. \u0421\u0431\u0435\u0439 \u0435\u0433\u043E \u043F\u0435\u0440\u0432\u044B\u043C, \u043F\u043E\u043A\u0430 \u0442\u0430\u043D\u043A \u0437\u0430\u043D\u044F\u0442."
      },
      {
        id: "mist_08",
        name: "\u0428\u0451\u043F\u043E\u0442 \u0431\u044B\u043B\u043E\u0439 \u043B\u0430\u0432\u043A\u0438",
        world: "mist",
        enemies: [
          { id: "mist_echo_keeper", scale: 2.32 },
          { id: "mist_echo_keeper", scale: 2.32 },
          { id: "mist_clock_spirit", scale: 2.32 }
        ],
        unlockAfter: "mist_07",
        tip: "\u0421\u043E\u043D \u0438 \u0441\u0442\u0440\u0430\u0445 \u0432\u043C\u0435\u0441\u0442\u0435. \u041A\u043E\u043D\u0442\u0440\u043E\u043B\u0438\u0440\u0443\u0439 \u043E\u0431\u0430 \u0441\u0442\u0430\u0442\u0443\u0441\u0430 \u0437\u0435\u043B\u044C\u044F\u043C\u0438."
      },
      {
        id: "mist_09",
        name: "\u041A\u043B\u0435\u0448\u043D\u0438 \u0438 \u043A\u043B\u044B\u043A\u0438",
        world: "mist",
        enemies: [{ id: "mist_rust_automaton", scale: 2.34 }, { id: "mist_cog_hound", scale: 2.34 }],
        unlockAfter: "mist_08",
        tip: "\u0422\u0430\u043D\u043A \u043F\u0440\u0438\u043A\u0440\u044B\u0432\u0430\u0435\u0442 \u043C\u0435\u0442\u043A\u0443\u044E \u0433\u043E\u043D\u0447\u0443\u044E. \u0421\u0444\u043E\u043A\u0443\u0441\u0438\u0440\u0443\u0439\u0441\u044F \u043D\u0430 \u0433\u043E\u043D\u0447\u0435\u0439."
      },
      {
        id: "mist_10",
        name: "\u041F\u0435\u0441\u043E\u0447\u043D\u044B\u0435 \u0447\u0430\u0441\u044B",
        world: "mist",
        enemies: [
          { id: "mist_clock_spirit", scale: 1.85 },
          { id: "mist_sand_wisp", scale: 1.8 },
          { id: "mist_rust_automaton", scale: 1.8 }
        ],
        unlockAfter: "mist_09",
        tip: "\u0417\u0430\u043C\u0435\u0434\u043B\u0435\u043D\u0438\u0435 \u0441\u043E \u0432\u0441\u0435\u0445 \u0441\u0442\u043E\u0440\u043E\u043D, \u0430 \u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u043B\u0430\u0442\u0430\u0435\u0442 \u0440\u0430\u043D\u044B. \u0424\u043E\u043A\u0443\u0441 \u043D\u0430 \u043D\u0451\u043C."
      },
      {
        id: "mist_11",
        name: "\u041F\u0435\u0440\u0435\u0437\u0432\u043E\u043D \u0438 \u0448\u0451\u043F\u043E\u0442",
        world: "mist",
        enemies: [{ id: "mist_clock_spirit", scale: 2.37 }, { id: "mist_echo_keeper", scale: 2.37 }],
        unlockAfter: "mist_10",
        tip: "\u0421\u0442\u0440\u0430\u0445 \u0434\u0443\u0445\u0430 \u0438 \u0443\u0441\u044B\u043F\u043B\u0435\u043D\u0438\u0435 \u044D\u0445\u0430. \u041E\u0440\u0443\u0436\u0438\u0435 \u043F\u0440\u043E\u0442\u0438\u0432 \u0434\u0443\u0445\u043E\u0432 \u043E\u043A\u0443\u043F\u0438\u0442\u0441\u044F."
      },
      {
        id: "mist_12",
        name: "\u042D\u0445\u043E \u0432 \u0448\u0435\u0441\u0442\u0435\u0440\u043D\u044F\u0445",
        world: "mist",
        enemies: [{ id: "mist_cog_hound", scale: 2.39 }, { id: "mist_echo_keeper", scale: 2.39 }],
        unlockAfter: "mist_11",
        tip: "\u041C\u0435\u0442\u043A\u0430\u044F \u0433\u043E\u043D\u0447\u0430\u044F \u0438 \u0443\u0441\u044B\u043F\u043B\u044F\u044E\u0449\u0435\u0435 \u044D\u0445\u043E. \u041D\u0435 \u0434\u0430\u0439 \u0440\u044B\u0446\u0430\u0440\u044E \u0443\u0441\u043D\u0443\u0442\u044C."
      },
      {
        id: "mist_13",
        name: "\u0414\u0432\u0430 \u043C\u0435\u0445\u0430\u043D\u0438\u0437\u043C\u0430",
        world: "mist",
        enemies: [{ id: "mist_rust_automaton", scale: 2.41 }, { id: "mist_rust_automaton", scale: 2.41 }],
        unlockAfter: "mist_12",
        tip: "\u0414\u0432\u0435 \u0440\u0436\u0430\u0432\u044B\u0435 \u0441\u0442\u0435\u043D\u044B. \u041D\u0443\u0436\u0435\u043D \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0439 \u0443\u0440\u043E\u043D \u0437\u0430 \u0443\u0434\u0430\u0440."
      },
      {
        id: "mist_14",
        name: "\u0414\u0432\u043E\u0439\u043D\u043E\u0439 \u0433\u043E\u043D",
        world: "mist",
        enemies: [{ id: "mist_cog_hound", scale: 2.3 }, { id: "mist_cog_hound", scale: 2.3 }],
        unlockAfter: "mist_13",
        tip: "\u0414\u0432\u0435 \u0433\u043E\u043D\u0447\u0438\u0435 \u0431\u044C\u044E\u0442 \u0431\u0435\u0437 \u043F\u0440\u043E\u043C\u0430\u0445\u0430. \u0411\u0440\u043E\u043D\u044F \u0438 \u0443\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u0435 \u2014 \u0442\u0432\u043E\u0438 \u0434\u0440\u0443\u0437\u044C\u044F."
      },
      {
        id: "mist_15",
        name: "\u041F\u0430\u043A\u0442 \u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044F",
        world: "mist",
        enemies: [{ id: "mist_time_warden", scale: 2.44 }, { id: "mist_clock_spirit", scale: 2.44 }],
        unlockAfter: "mist_14",
        tip: "\u041B\u0435\u0447\u0435\u043D\u0438\u0435 \u0438 \u0441\u0442\u0440\u0430\u0445. \u0420\u0430\u0437\u0431\u0435\u0440\u0438\u0441\u044C \u0441 \u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u0435\u043C \u0432 \u043F\u0435\u0440\u0432\u0443\u044E \u043E\u0447\u0435\u0440\u0435\u0434\u044C."
      },
      {
        id: "mist_16",
        name: "\u041F\u044B\u043B\u044C\u043D\u044B\u0439 \u0441\u0442\u0440\u0430\u0436",
        world: "mist",
        enemies: [{ id: "mist_rust_automaton", scale: 2.46 }, { id: "mist_sand_wisp", scale: 2.46 }],
        unlockAfter: "mist_15",
        tip: "\u0422\u044F\u0436\u0451\u043B\u044B\u0435 \u0443\u0434\u0430\u0440\u044B \u043F\u043E\u0434 \u0437\u0430\u043C\u0435\u0434\u043B\u0435\u043D\u0438\u0435\u043C. \u041D\u0435 \u0440\u0430\u0441\u0442\u044F\u0433\u0438\u0432\u0430\u0439 \u0431\u043E\u0439."
      },
      {
        id: "mist_17",
        name: "\u0413\u043E\u043D \u043F\u043E \u0440\u0435\u0437\u044C\u0431\u0435",
        world: "mist",
        enemies: [{ id: "mist_cog_hound", scale: 2.35 }, { id: "mist_sand_wisp", scale: 2.35 }],
        unlockAfter: "mist_16",
        tip: "\u0411\u044B\u0441\u0442\u0440\u0430\u044F \u043F\u0430\u0440\u0430: \u043A\u043B\u044B\u043A\u0438 \u0438 \u043F\u0435\u0441\u043E\u043A. \u0414\u0435\u0440\u0436\u0438 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u043F\u0440\u0438 \u0441\u0435\u0431\u0435."
      },
      {
        id: "mist_18",
        name: "\u0414\u0435\u0436\u0443\u0440\u0441\u0442\u0432\u043E \u044D\u0445\u0430",
        world: "mist",
        enemies: [
          { id: "mist_echo_keeper", scale: 2.35 },
          { id: "mist_echo_keeper", scale: 2.35 },
          { id: "mist_time_warden", scale: 2.35 }
        ],
        unlockAfter: "mist_17",
        tip: "\u0414\u0432\u043E\u0439\u043D\u043E\u0439 \u0441\u043E\u043D \u043F\u043E\u0434 \u043F\u0440\u0438\u043A\u0440\u044B\u0442\u0438\u0435\u043C \u043B\u0435\u0447\u0435\u043D\u0438\u044F. \u0417\u0435\u043B\u044C\u0435 \u0431\u043E\u0434\u0440\u043E\u0441\u0442\u0438 \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E."
      },
      {
        id: "mist_19",
        name: "\u041A\u0443\u0437\u043D\u0438\u0446\u0430 \u0432\u0440\u0435\u043C\u0451\u043D",
        world: "mist",
        enemies: [{ id: "mist_rust_automaton", scale: 2.51 }, { id: "mist_rust_automaton", scale: 2.51 }],
        unlockAfter: "mist_18",
        tip: "\u0414\u0432\u0430 \u0442\u0430\u043D\u043A\u0430. \u0414\u043E\u043B\u0433\u0438\u0439 \u0431\u043E\u0439 \u2014 \u0437\u0430\u043F\u0430\u0441\u0438\u0441\u044C \u0432\u044B\u043D\u043E\u0441\u043B\u0438\u0432\u043E\u0441\u0442\u044C\u044E."
      },
      {
        id: "mist_20",
        name: "\u041E\u0445\u043E\u0442\u0430 \u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044F",
        world: "mist",
        enemies: [{ id: "mist_time_warden", scale: 2.53 }, { id: "mist_cog_hound", scale: 2.53 }],
        unlockAfter: "mist_19",
        tip: "\u0413\u043E\u043D\u0447\u0430\u044F \u043F\u043E\u0434\u043B\u0435\u0447\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u0435\u043C. \u0412\u044B\u043D\u043E\u0441\u0438 \u0435\u0433\u043E \u043F\u0435\u0440\u0432\u044B\u043C."
      },
      {
        id: "mist_21",
        name: "\u0411\u0430\u0448\u043D\u044F \u0431\u0435\u0437 \u0432\u0440\u0435\u043C\u0435\u043D\u0438",
        world: "mist",
        enemies: [{ id: "mist_clock_spirit", scale: 2.55 }, { id: "mist_clock_spirit", scale: 2.55 }],
        unlockAfter: "mist_20",
        tip: "\u0414\u0432\u043E\u0439\u043D\u043E\u0439 \u0441\u0442\u0440\u0430\u0445 \u0432 \u0437\u0430\u0434\u043D\u0435\u043C \u0440\u044F\u0434\u0443. \u0421\u0442\u0440\u0435\u043B\u043A\u0438 \u0434\u043E\u0441\u0442\u0430\u043D\u0443\u0442 \u0438\u0445 \u0440\u0430\u043D\u044C\u0448\u0435."
      },
      {
        id: "mist_22",
        name: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439 \u0437\u0430\u0432\u043E\u0434 \u043F\u0440\u0443\u0436\u0438\u043D\u044B",
        world: "mist",
        enemies: [{ id: "mist_rust_automaton", scale: 2.57 }, { id: "mist_echo_keeper", scale: 2.57 }],
        unlockAfter: "mist_21",
        tip: "\u0421\u0442\u0435\u043D\u0430 \u0438\u0437 \u0440\u0436\u0430\u0432\u0447\u0438\u043D\u044B \u0438 \u0443\u0441\u044B\u043F\u043B\u0435\u043D\u0438\u0435. \u041F\u0440\u043E\u0431\u0435\u0439 \u0442\u0430\u043D\u043A\u0430, \u043D\u0435 \u0443\u0441\u043D\u0438."
      },
      {
        id: "mist_23",
        name: "\u041F\u0440\u0435\u0434\u0434\u0432\u0435\u0440\u0438\u0435 \u0432\u0435\u0447\u043D\u043E\u0441\u0442\u0438",
        world: "mist",
        enemies: [{ id: "mist_time_warden", scale: 2.58 }, { id: "mist_rust_automaton", scale: 2.58 }],
        unlockAfter: "mist_22",
        tip: "\u0425\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u0438 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u043E\u043D \u0432\u043C\u0435\u0441\u0442\u0435. \u041F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u043F\u0435\u0440\u0435\u0434 \u0412\u0440\u0435\u043C\u0435\u043D\u0435\u043C."
      },
      {
        id: "mist_boss",
        name: "\u0421\u0430\u043C\u043E \u0412\u0440\u0435\u043C\u044F",
        world: "mist",
        enemies: [{ id: "mist_boss", scale: 1 }],
        unlockAfter: "mist_23",
        tip: "\u0412\u0440\u0435\u043C\u044F \u0437\u0430\u043C\u0435\u0434\u043B\u044F\u0435\u0442 \u0438 \u0434\u0430\u0432\u0438\u0442 \u0441\u0442\u0440\u0430\u0445\u043E\u043C. \u0414\u0435\u0440\u0436\u0438 \u0442\u0435\u043C\u043F \u0438 \u043D\u0435 \u0431\u043E\u0439\u0441\u044F \u2014 \u0443 \u043B\u0430\u0432\u043A\u0438 \u0435\u0441\u0442\u044C \u0431\u0443\u0434\u0443\u0449\u0435\u0435."
      }
    ]
  };

  // src/data/worlds/index.js
  var WORLDS = [WORLD, WORLD2, WORLD3, WORLD4, WORLD5, WORLD6, WORLD7, WORLD8];
  var WORLD_BY_ID = Object.fromEntries(WORLDS.map((w) => [w.id, w]));

  // src/data/wanted.js
  var WANTED_BATTLES = [
    {
      id: "wnt_bee_queen",
      name: "\u0420\u043E\u0437\u044B\u0441\u043A: \u041A\u043E\u0440\u043E\u043B\u0435\u0432\u0430 \u0434\u0438\u043A\u0438\u0445 \u043F\u0447\u0451\u043B",
      world: "meadow",
      wanted: true,
      enemies: [{ id: "bee_wild", scale: 1.6 }, { id: "bee_wild", scale: 1.6 }, { id: "bee_wild", scale: 1.6 }, { id: "bee_wild", scale: 1.6 }],
      unlockAfter: "bt_boss_willow",
      tip: "\u0420\u043E\u0439 \u0438\u0437 \u0447\u0435\u0442\u044B\u0440\u0451\u0445 \u0443\u0441\u0438\u043B\u0435\u043D\u043D\u044B\u0445 \u043F\u0447\u0451\u043B. \u0410\u043D\u0442\u0438\u0434\u043E\u0442 \u0438 \u0440\u0430\u0441\u0441\u0435\u0447\u0435\u043D\u0438\u0435."
    },
    {
      id: "wnt_rat_king",
      name: "\u0420\u043E\u0437\u044B\u0441\u043A: \u041A\u0440\u044B\u0441\u0438\u043D\u044B\u0439 \u0431\u0430\u0440\u043E\u043D",
      world: "town",
      wanted: true,
      enemies: [{ id: "rat_thief", scale: 2 }, { id: "rat_thief", scale: 2 }, { id: "bandit", scale: 1.9 }],
      unlockAfter: "bt_boss_captain",
      tip: "\u0411\u0430\u0440\u043E\u043D \u0438 \u0435\u0433\u043E \u0448\u0430\u0439\u043A\u0430. \u041F\u043E\u0434\u043A\u043E\u0432\u044B \u0432\u0435\u0440\u0451\u0432\u043E\u043A \u043D\u0435 \u0432\u044F\u0436\u0443\u0442 \u2014 \u0431\u0435\u0440\u0438 \u0442\u044F\u0436\u0451\u043B\u043E\u0435."
    },
    {
      id: "wnt_ink_lord",
      name: "\u0420\u043E\u0437\u044B\u0441\u043A: \u041F\u043E\u0432\u0435\u043B\u0438\u0442\u0435\u043B\u044C \u043A\u043B\u044F\u043A\u0441",
      world: "attic",
      wanted: true,
      enemies: [{ id: "ink_blot", scale: 2.1 }, { id: "paper_spirit", scale: 2 }, { id: "ink_blot", scale: 2.1 }],
      unlockAfter: "bk_boss_keeper",
      tip: "\u0427\u0435\u0440\u043D\u0438\u043B\u0430 \u0442\u0435\u043A\u0443\u0447\u0438 \u0438 \u044F\u0434\u043E\u0432\u0438\u0442\u044B. \u0427\u0435\u0440\u043D\u0438\u043B\u044C\u043D\u044B\u0439 \u043E\u0442\u0432\u0430\u0440 \u2014 \u0432 \u043F\u043E\u044F\u0441."
    },
    {
      id: "wnt_lantern_thief",
      name: "\u0420\u043E\u0437\u044B\u0441\u043A: \u041F\u043E\u0445\u0438\u0442\u0438\u0442\u0435\u043B\u044C \u0444\u043E\u043D\u0430\u0440\u0435\u0439",
      world: "nm",
      wanted: true,
      enemies: [{ id: "nm_shadow", scale: 2.2 }, { id: "nm_moth", scale: 2.1 }],
      unlockAfter: "nm_boss",
      tip: "\u0422\u0435\u043D\u044C \u0438 \u0435\u0451 \u043C\u043E\u0442\u044B\u043B\u0451\u043A \u0432\u043E\u0440\u0443\u044E\u0442 \u0441\u0432\u0435\u0442 \u0441 \u0440\u044B\u043D\u043A\u0430. \u0411\u043E\u0434\u0440\u043E\u0441\u0442\u044C \u0438 \u043E\u0442\u0432\u0430\u0433\u0430!"
    }
  ];

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
      id: "bt_fireflies",
      name: "\u0420\u043E\u0441\u0441\u044B\u043F\u044C \u0441\u0432\u0435\u0442\u043B\u044F\u0447\u043A\u043E\u0432",
      world: "meadow",
      enemies: ["moth_night", "bee_wild", "moth_night", "bee_wild"],
      unlockAfter: "bt_golem",
      tip: "\u0420\u043E\u0439 \u043C\u043E\u0442\u044B\u043B\u044C\u043A\u043E\u0432 \u0438 \u043F\u0447\u0451\u043B: \u0441\u043E\u043D \u0438 \u044F\u0434 \u0432\u043C\u0435\u0441\u0442\u0435. \u0428\u043B\u0435\u043C \u0431\u0430\u0440\u0441\u0443\u043A\u0430 \u0438 \u043F\u0435\u0440\u0447\u0430\u0442\u043A\u0438 \u0442\u0440\u0430\u0432\u043D\u0438\u0446\u044B."
    },
    {
      id: "bt_overgrowth",
      name: "\u0413\u0440\u0438\u0431\u043D\u0430\u044F \u0437\u0430\u0432\u0430\u043B\u0438\u043D\u043A\u0430",
      world: "meadow",
      enemies: ["golem_moss", "spirit_forest", "spirit_forest"],
      unlockAfter: "bt_fireflies",
      tip: "\u0413\u043E\u043B\u0435\u043C \u0438 \u0434\u0432\u0430 \u0434\u0443\u0445\u0430. \u0417\u0430\u043C\u0435\u0434\u043B\u0435\u043D\u0438\u0435 \u043E\u043F\u0430\u0441\u043D\u043E \u2014 \u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u044C."
    },
    {
      id: "bt_hunt_trail",
      name: "\u041E\u0445\u043E\u0442\u043D\u0438\u0447\u044C\u044F \u0442\u0440\u043E\u043F\u0430",
      world: "meadow",
      enemies: ["bee_wild", "spirit_forest", "moth_night", "slime_meadow"],
      unlockAfter: "bt_overgrowth",
      tip: "\u0412\u0441\u044F \u043E\u043F\u0443\u0448\u043A\u0430 \u0440\u0430\u0437\u043E\u043C. \u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u043F\u0435\u0440\u0435\u0434 \u0421\u0442\u0430\u0440\u043E\u0439 \u0438\u0432\u043E\u0439."
    },
    {
      id: "bt_boss_willow",
      name: "\u0421\u0442\u0430\u0440\u0430\u044F \u0438\u0432\u0430",
      world: "meadow",
      enemies: ["boss_willow"],
      unlockAfter: "bt_hunt_trail",
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
      id: "bt_watchtower",
      name: "\u0421\u0442\u043E\u0440\u043E\u0436\u0435\u0432\u0430\u044F \u0431\u0430\u0448\u043D\u044F",
      world: "town",
      enemies: ["ghost_guard", "ghost_guard", "bandit"],
      unlockAfter: "bt_town_mix",
      tip: "\u041F\u0440\u0438\u0437\u0440\u0430\u043A\u0438 \u0438 \u0438\u0445 \u0436\u0438\u0432\u043E\u0439 \u0441\u043E\u043E\u0431\u0449\u043D\u0438\u043A. \u0421\u0442\u0440\u0430\u0445 \u0434\u0430\u0432\u0438\u0442\u044C \u0430\u043C\u0443\u043B\u0435\u0442\u043E\u043C \u043E\u0442\u0432\u0430\u0433\u0438."
    },
    {
      id: "bt_cellar",
      name: "\u041F\u043E\u0434\u0432\u0430\u043B\u044C\u043D\u044B\u0435 \u043A\u0440\u044B\u0441\u044B",
      world: "town",
      enemies: ["rat_thief", "rat_thief", "rat_thief", "rat_thief"],
      unlockAfter: "bt_watchtower",
      tip: "\u0427\u0435\u0442\u0432\u0435\u0440\u043E \u0448\u0443\u0441\u0442\u0440\u044B\u0445 \u044F\u0434\u043E\u0432\u0438\u0442\u044B\u0445. \u0410\u043C\u0443\u043B\u0435\u0442 \u043F\u0440\u043E\u0442\u0438\u0432\u043E\u044F\u0434\u0438\u044F \u0438 \u0440\u0430\u0441\u0441\u0435\u0447\u0435\u043D\u0438\u0435."
    },
    {
      id: "bt_tourney",
      name: "\u0422\u0443\u0440\u043D\u0438\u0440\u043D\u0430\u044F \u043F\u043B\u043E\u0449\u0430\u0434\u044C",
      world: "town",
      enemies: ["golem_wander", "bandit", "bandit"],
      unlockAfter: "bt_cellar",
      tip: "\u041A\u0430\u043C\u0435\u043D\u043D\u0430\u044F \u0441\u0442\u0435\u043D\u0430 \u0438 \u0434\u0432\u0430 \u043A\u043B\u0438\u043D\u043A\u0430 \u0437\u0430 \u043D\u0435\u0439. \u041F\u0440\u043E\u0431\u0438\u0432\u0430\u0439 \u0442\u044F\u0436\u0451\u043B\u044B\u043C."
    },
    {
      id: "bt_boss_captain",
      name: "\u0421\u0442\u0430\u0440\u044B\u0439 \u043A\u0430\u043F\u0438\u0442\u0430\u043D",
      world: "town",
      enemies: ["boss_captain"],
      unlockAfter: "bt_tourney",
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
      id: "bt_reading",
      name: "\u0427\u0438\u0442\u0430\u043B\u044C\u043D\u044B\u0439 \u0437\u0430\u043B",
      world: "attic",
      enemies: ["book_moth", "paper_spirit", "book_moth"],
      unlockAfter: "bk_storm",
      tip: "\u041C\u043E\u043B\u044C \u0438 \u0434\u0443\u0445 \u0441\u0440\u0435\u0434\u0438 \u0444\u043E\u043B\u0438\u0430\u043D\u0442\u043E\u0432. \u0421\u043E\u043D \u0438 \u0441\u0442\u0440\u0430\u0445 \u2014 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u0438\u0440\u0443\u0439 \u043E\u0431\u0430."
    },
    {
      id: "bt_archive",
      name: "\u041F\u044B\u043B\u044C\u043D\u044B\u0439 \u0430\u0440\u0445\u0438\u0432",
      world: "attic",
      enemies: ["illustration", "ink_blot", "ink_blot"],
      unlockAfter: "bt_reading",
      tip: "\u0413\u0440\u0430\u0432\u044E\u0440\u0430 \u0438 \u0447\u0435\u0440\u043D\u0438\u043B\u0430. \u042F\u0434 \u0437\u0430\u043C\u0435\u0434\u043B\u044F\u0435\u0442 \u2014 \u0434\u0435\u0440\u0436\u0438 \u043E\u0442\u0432\u0430\u0440 \u043D\u0430\u0433\u043E\u0442\u043E\u0432\u0435."
    },
    {
      id: "bt_inkwell",
      name: "\u0427\u0435\u0440\u043D\u0438\u043B\u044C\u043D\u044B\u0439 \u043A\u043E\u043B\u043E\u0434\u0435\u0446",
      world: "attic",
      enemies: ["ink_blot", "paper_spirit", "ink_blot", "paper_spirit"],
      unlockAfter: "bt_archive",
      tip: "\u0427\u0435\u0442\u0432\u0435\u0440\u043E \u043E\u0431\u0438\u0442\u0430\u0442\u0435\u043B\u0435\u0439 \u0447\u0435\u0440\u0434\u0430\u043A\u0430 \u0440\u0430\u0437\u043E\u043C. \u041F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u043F\u0435\u0440\u0435\u0434 \u0425\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u0435\u043C."
    },
    {
      id: "bk_boss_keeper",
      name: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430",
      world: "attic",
      enemies: ["boss_keeper"],
      unlockAfter: "bt_inkwell",
      tip: "\u0425\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u043D\u0435 \u043E\u0442\u0434\u0430\u0441\u0442 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443 \u0431\u0435\u0437 \u0431\u043E\u044F. \u0421\u043E\u0431\u0435\u0440\u0438 \u0432\u0441\u0451 \u043B\u0443\u0447\u0448\u0435\u0435, \u0447\u0442\u043E \u0443 \u0442\u0435\u0431\u044F \u0435\u0441\u0442\u044C."
    }
  );
  BATTLES.push(
    {
      id: "ex_01",
      name: "\u041F\u0435\u0440\u0435\u043A\u0440\u0451\u0441\u0442\u043D\u0430\u044F \u0442\u0440\u043E\u043F\u0430",
      world: "crossroads",
      enemies: [
        { id: "slime_meadow", scale: 1.1 },
        { id: "bandit", scale: 1.1 },
        { id: "ink_blot", scale: 1.1 }
      ],
      unlockAfter: "bk_boss_keeper",
      tip: "\u041C\u0438\u0440\u044B \u0441\u043C\u0435\u0448\u0430\u043B\u0438\u0441\u044C. \u0421\u043B\u0438\u0437\u043D\u0438, \u0440\u0430\u0437\u0431\u043E\u0439\u043D\u0438\u043A\u0438 \u0438 \u0447\u0435\u0440\u043D\u0438\u043B\u0430 \u0432 \u043E\u0434\u043D\u043E\u043C \u0431\u043E\u044E."
    },
    {
      id: "ex_02",
      name: "\u0421\u043C\u0435\u0448\u0430\u043D\u043D\u044B\u0439 \u043F\u0430\u0442\u0440\u0443\u043B\u044C",
      world: "crossroads",
      enemies: [
        { id: "rat_thief", scale: 1.15 },
        { id: "rat_thief", scale: 1.15 },
        { id: "book_moth", scale: 1.15 }
      ],
      unlockAfter: "ex_01",
      tip: "\u0411\u044B\u0441\u0442\u0440\u044B\u0435 \u0438 \u044F\u0434\u043E\u0432\u0438\u0442\u044B\u0435, \u0430 \u043C\u043E\u043B\u044C \u0443\u0441\u044B\u043F\u043B\u044F\u0435\u0442. \u0414\u0435\u0440\u0436\u0438 \u0437\u0435\u043B\u044C\u044F \u043D\u0430\u0433\u043E\u0442\u043E\u0432\u0435."
    },
    {
      id: "ex_03",
      name: "\u0414\u0443\u0445\u0438 \u043F\u0435\u0440\u0435\u043A\u0440\u0451\u0441\u0442\u043A\u0430",
      world: "crossroads",
      enemies: [
        { id: "paper_spirit", scale: 1.2 },
        { id: "ghost_guard", scale: 1.2 }
      ],
      unlockAfter: "ex_02",
      tip: "\u0414\u0432\u043E\u0435 \u0434\u0443\u0445\u043E\u0432 \u0441\u043E \u0441\u0442\u0440\u0430\u0445\u043E\u043C. \u0410\u043C\u0443\u043B\u0435\u0442 \u043E\u0442\u0432\u0430\u0433\u0438 \u0438\u043B\u0438 \u0442\u043E\u043F\u043E\u0440 \u0434\u0440\u043E\u0432\u043E\u0441\u0435\u043A\u0430."
    },
    {
      id: "ex_04",
      name: "\u041A\u0430\u043C\u0435\u043D\u043D\u044B\u0439 \u043A\u0430\u0440\u0430\u0432\u0430\u043D",
      world: "crossroads",
      enemies: [
        { id: "golem_wander", scale: 1.25 },
        { id: "golem_moss", scale: 1.25 }
      ],
      unlockAfter: "ex_03",
      tip: "\u0414\u0432\u0435 \u043A\u0430\u043C\u0435\u043D\u043D\u044B\u0435 \u0441\u0442\u0435\u043D\u044B. \u041D\u0443\u0436\u0435\u043D \u0441\u0435\u0440\u044C\u0451\u0437\u043D\u044B\u0439 \u0443\u0440\u043E\u043D \u0438\u043B\u0438 \u043F\u0440\u043E\u0431\u0438\u0442\u0438\u0435."
    },
    {
      id: "ex_05",
      name: "\u042F\u0434\u043E\u0432\u0438\u0442\u044B\u0439 \u0442\u0443\u043C\u0430\u043D",
      world: "crossroads",
      enemies: [
        { id: "ink_blot", scale: 1.3 },
        { id: "bee_wild", scale: 1.3 },
        { id: "rat_thief", scale: 1.3 }
      ],
      unlockAfter: "ex_04",
      tip: "\u042F\u0434 \u0441\u043E \u0432\u0441\u0435\u0445 \u0441\u0442\u043E\u0440\u043E\u043D. \u0410\u043C\u0443\u043B\u0435\u0442 \u043F\u0440\u043E\u0442\u0438\u0432\u043E\u044F\u0434\u0438\u044F \u2014 \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E."
    },
    {
      id: "ex_06",
      name: "\u041D\u043E\u0447\u043D\u0430\u044F \u0441\u0442\u0440\u0430\u0436\u0430",
      world: "crossroads",
      enemies: [
        { id: "ghost_guard", scale: 1.3 },
        { id: "ghost_guard", scale: 1.3 },
        { id: "moth_night", scale: 1.3 }
      ],
      unlockAfter: "ex_05",
      tip: "\u0421\u0442\u0440\u0430\u0445 \u0438 \u0441\u043E\u043D \u0432 \u043E\u0434\u043D\u043E\u043C \u0444\u043B\u0430\u043A\u043E\u043D\u0435. \u0428\u043B\u0435\u043C \u0431\u0430\u0440\u0441\u0443\u043A\u0430 \u0441\u043D\u043E\u0432\u0430 \u0432 \u0434\u0435\u043B\u0435."
    },
    {
      id: "ex_07",
      name: "\u0411\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u0447\u043D\u0430\u044F \u043E\u0441\u0430\u0434\u0430",
      world: "crossroads",
      enemies: [
        { id: "illustration", scale: 1.35 },
        { id: "paper_spirit", scale: 1.35 },
        { id: "paper_spirit", scale: 1.35 }
      ],
      unlockAfter: "ex_06",
      tip: "\u0422\u043E\u043B\u0441\u0442\u0430\u044F \u0433\u0440\u0430\u0432\u044E\u0440\u0430 \u0438 \u0434\u0432\u0430 \u0434\u0443\u0445\u0430. \u041F\u0440\u043E\u0440\u044B\u0432\u0430\u0439\u0441\u044F \u043A \u043D\u0435\u0439 \u0441\u043A\u0432\u043E\u0437\u044C \u0441\u0442\u0440\u043E\u0439."
    },
    {
      id: "ex_08",
      name: "\u0425\u0430\u043E\u0441 \u043F\u0435\u0440\u0435\u043A\u0440\u0451\u0441\u0442\u043A\u0430",
      world: "crossroads",
      enemies: [
        { id: "golem_wander", scale: 1.4 },
        { id: "ink_blot", scale: 1.4 },
        { id: "book_moth", scale: 1.4 }
      ],
      unlockAfter: "ex_07",
      tip: "\u0412\u0441\u0451 \u0438 \u0441\u0440\u0430\u0437\u0443: \u0441\u0442\u0435\u043D\u0430, \u044F\u0434 \u0438 \u0441\u043E\u043D. \u041F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u043F\u0435\u0440\u0435\u0434 \u0421\u0442\u0440\u0430\u0436\u0435\u043C."
    },
    {
      id: "ex_boss",
      name: "\u0417\u0432\u0451\u0437\u0434\u043D\u044B\u0439 \u0441\u0442\u0440\u0430\u0436",
      world: "crossroads",
      enemies: [{ id: "boss_star_guardian", scale: 1 }],
      unlockAfter: "ex_08",
      tip: "\u041E\u043D \u0433\u043E\u0440\u0438\u0442 \u0437\u0432\u0451\u0437\u0434\u043D\u044B\u043C \u043E\u0433\u043D\u0451\u043C. \u0421\u043E\u043F\u0440\u043E\u0442\u0438\u0432\u043B\u0435\u043D\u0438\u0435 \u043E\u0433\u043D\u044E \u043D\u0435 \u043F\u043E\u043C\u0435\u0448\u0430\u0435\u0442."
    }
  );
  for (const w of WORLDS) {
    if (w?.battles) BATTLES.push(...w.battles);
  }
  BATTLES.push(...WANTED_BATTLES);
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
      price: 160,
      currency: "coins",
      bonus: { goldFind: 0.15 },
      description: "\u0411\u0435\u0436\u0438\u0442 \u0440\u044F\u0434\u043E\u043C \u0438 \u0441\u043E\u0431\u0438\u0440\u0430\u0435\u0442 \u043C\u043E\u043D\u0435\u0442\u044B \u043F\u043E\u0441\u043B\u0435 \u0431\u043E\u044F."
    },
    {
      id: "pet_hedgehog",
      name: "\u0401\u0436\u0438\u043A",
      icon: "\u{1F994}",
      price: 190,
      currency: "coins",
      bonus: { itemFind: 0.12 },
      description: "\u041D\u0430\u0445\u043E\u0434\u0438\u0442 \u043C\u0435\u043B\u043A\u0438\u0435 \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u044B \u0432 \u0442\u0440\u0430\u0432\u0435."
    },
    {
      id: "pet_fox",
      name: "\u041B\u0438\u0441\u0451\u043D\u043E\u043A",
      icon: "\u{1F98A}",
      price: 5,
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
      price: 240,
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
      price: 300,
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
      price: 400,
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
      price: 6,
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
      price: 450,
      currency: "coins",
      bonus: { speed: 2, materialsFind: 0.5 },
      description: "\u0415\u0437\u0434\u043E\u0432\u043E\u0439: \u0431\u044B\u0441\u0442\u0440\u0435\u0435 \u0434\u043E\u0440\u043E\u0433\u0438, \u0431\u043E\u043B\u044C\u0448\u0435 \u043C\u0430\u0442\u0435\u0440\u0438\u0430\u043B\u043E\u0432 \u043F\u043E\u0441\u043B\u0435 \u0431\u043E\u044F."
    },
    {
      id: "pet_owl",
      name: "\u0421\u043E\u0432\u0430-\u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430\u0440\u044C",
      icon: "\u{1F989}",
      kind: "flying",
      price: 6,
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
    // --- Зелья (двойные порции — выгоднее лавки) ---
    {
      id: "rcp_pot_heal",
      name: "\u0421\u0432\u0430\u0440\u0438\u0442\u044C \u0434\u0432\u0430 \u0437\u0435\u043B\u044C\u044F \u043B\u0435\u0447\u0435\u043D\u0438\u044F",
      icon: "\u{1F9EA}",
      kind: "potion",
      result: { itemId: "pot_heal", count: 2 },
      materials: { slime_jelly: 2, honey: 1 },
      unlockAfter: "bt_bees",
      note: "\u0421\u043B\u0438\u0437\u044C \u0434\u0430\u0451\u0442 \u0442\u0435\u043B\u043E, \u043C\u0451\u0434 \u2014 \u043C\u044F\u0433\u043A\u043E\u0441\u0442\u044C. \u0414\u0432\u043E\u0439\u043D\u0430\u044F \u043F\u043E\u0440\u0446\u0438\u044F."
    },
    {
      id: "rcp_pot_vigor",
      name: "\u0421\u0432\u0430\u0440\u0438\u0442\u044C \u0434\u0432\u0430 \u0437\u0435\u043B\u044C\u044F \u0431\u043E\u0434\u0440\u043E\u0441\u0442\u0438",
      icon: "\u{1F9EA}",
      kind: "potion",
      result: { itemId: "pot_vigor", count: 2 },
      materials: { moth_dust: 2, honey: 1 },
      unlockAfter: "bt_moths",
      note: "\u041F\u044B\u043B\u044C\u0446\u0430 \u043C\u043E\u0442\u044B\u043B\u044C\u043A\u0430 \u0432 \u043C\u0430\u043B\u044B\u0445 \u0434\u043E\u0437\u0430\u0445 \u0431\u043E\u0434\u0440\u0438\u0442. \u0414\u0432\u043E\u0439\u043D\u0430\u044F \u043F\u043E\u0440\u0446\u0438\u044F."
    },
    {
      id: "rcp_pot_stone",
      name: "\u0421\u0432\u0430\u0440\u0438\u0442\u044C \u0434\u0432\u0430 \u0437\u0435\u043B\u044C\u044F \u043A\u0430\u043C\u0435\u043D\u043D\u043E\u0439 \u043A\u043E\u0436\u0438",
      icon: "\u{1F9EA}",
      kind: "potion",
      result: { itemId: "pot_stone", count: 2 },
      materials: { brick_chunk: 2, moss_stone: 1 },
      unlockAfter: "bt_wander_golem",
      note: "\u0420\u0430\u0441\u0442\u0432\u043E\u0440\u0438\u0442\u044C \u043A\u043B\u0430\u0434\u043A\u0443 \u2014 \u0441\u0442\u0430\u0442\u044C \u043A\u043B\u0430\u0434\u043A\u043E\u0439. \u0414\u0432\u043E\u0439\u043D\u0430\u044F \u043F\u043E\u0440\u0446\u0438\u044F."
    },
    {
      id: "rcp_pot_ink",
      name: "\u0421\u0432\u0430\u0440\u0438\u0442\u044C \u0434\u0432\u0430 \u0447\u0435\u0440\u043D\u0438\u043B\u044C\u043D\u044B\u0445 \u043E\u0442\u0432\u0430\u0440\u0430",
      icon: "\u{1F9EA}",
      kind: "potion",
      result: { itemId: "pot_ink", count: 2 },
      materials: { ink_drop: 2, page_dust: 1 },
      unlockAfter: "bk_blots",
      note: "\u0413\u043E\u0440\u044C\u043A\u043E, \u0437\u0430\u0442\u043E \u044F\u0434 \u0443\u0445\u043E\u0434\u0438\u0442. \u0414\u0432\u043E\u0439\u043D\u0430\u044F \u043F\u043E\u0440\u0446\u0438\u044F."
    },
    // --- Снаряжение сета «Мастер» (только крафт) ---
    {
      id: "rcp_master_dagger",
      name: "\u0412\u044B\u043A\u043E\u0432\u0430\u0442\u044C \u0421\u0442\u0438\u043B\u0435\u0442 \u043C\u0430\u0441\u0442\u0435\u0440\u0430",
      icon: "\u{1F52A}",
      kind: "gear",
      result: { itemId: "wpn_master_dagger", count: 1 },
      materials: { glow_moss: 3, moss_stone: 1 },
      coins: 80,
      unlockAfter: "bt_spirits",
      note: "\u0421\u0432\u0435\u0442\u044F\u0449\u0438\u0439\u0441\u044F \u043C\u043E\u0445 \u0432 \u043A\u043B\u0438\u043D\u043A\u0435. \u0421\u0435\u0442 \xAB\u041C\u0430\u0441\u0442\u0435\u0440\xBB 1/9."
    },
    {
      id: "rcp_master_ring",
      name: "\u041E\u0442\u043B\u0438\u0442\u044C \u041F\u0435\u0440\u0441\u0442\u0435\u043D\u044C \u043C\u0430\u0441\u0442\u0435\u0440\u0430",
      icon: "\u{1F48D}",
      kind: "gear",
      result: { itemId: "rng_master", count: 1 },
      materials: { honey: 2, moth_dust: 1 },
      unlockAfter: "bt_moths",
      note: "\u041C\u0451\u0434 \u0434\u0435\u0440\u0436\u0438\u0442 \u0444\u043E\u0440\u043C\u0443, \u043F\u044B\u043B\u044C\u0446\u0430 \u2014 \u0443\u0434\u0430\u0447\u0443. \u0421\u0435\u0442 \xAB\u041C\u0430\u0441\u0442\u0435\u0440\xBB 2/9."
    },
    {
      id: "rcp_master_amulet",
      name: "\u0421\u043E\u0431\u0440\u0430\u0442\u044C \u0424\u0438\u043B\u044C\u0433\u0440\u0430\u043D\u044C \u043C\u0430\u0441\u0442\u0435\u0440\u0430",
      icon: "\u{1F4FF}",
      kind: "gear",
      result: { itemId: "amu_master", count: 1 },
      materials: { rat_tail: 2, glow_moss: 2 },
      unlockAfter: "bt_rats",
      note: "\u041F\u043B\u0430\u0443\u043D \u0438 \u043C\u043E\u0445 \u043F\u043E\u0434 \u0441\u0442\u0435\u043A\u043B\u043E\u043C. \u0421\u0435\u0442 \xAB\u041C\u0430\u0441\u0442\u0435\u0440\xBB 3/9."
    },
    {
      id: "rcp_master_gloves",
      name: "\u0421\u0448\u0438\u0442\u044C \u041D\u0430\u043F\u0435\u0440\u0441\u0442\u043A\u0438 \u043C\u0430\u0441\u0442\u0435\u0440\u0430",
      icon: "\u{1F9E4}",
      kind: "gear",
      result: { itemId: "glv_master", count: 1 },
      materials: { torn_cloth: 2, brick_chunk: 1 },
      unlockAfter: "bt_bandits",
      note: "\u0422\u043A\u0430\u043D\u044C \u0432 \u043A\u0430\u043C\u0435\u043D\u043D\u043E\u0439 \u043F\u044B\u043B\u0438 \u043D\u0435 \u0433\u043E\u0440\u0438\u0442. \u0421\u0435\u0442 \xAB\u041C\u0430\u0441\u0442\u0435\u0440\xBB 4/9."
    },
    {
      id: "rcp_master_shield",
      name: "\u0412\u044B\u043A\u043E\u0432\u0430\u0442\u044C \u0417\u0435\u0440\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u0449\u0438\u0442",
      icon: "\u{1F6E1}\uFE0F",
      kind: "gear",
      result: { itemId: "shd_master", count: 1 },
      materials: { moss_stone: 2, brick_chunk: 2, torn_cloth: 1 },
      coins: 100,
      unlockAfter: "bt_golem",
      note: "\u041F\u043E\u043B\u0438\u0440\u043E\u0432\u043A\u0430 \u0434\u043E \u0437\u0435\u0440\u043A\u0430\u043B\u0430. \u0421\u0435\u0442 \xAB\u041C\u0430\u0441\u0442\u0435\u0440\xBB 5/9."
    },
    {
      id: "rcp_master_helmet",
      name: "\u0421\u043F\u043B\u0435\u0441\u0442\u0438 \u041E\u0431\u0440\u0443\u0447 \u043C\u0430\u0441\u0442\u0435\u0440\u0430",
      icon: "\u{1FA96}",
      kind: "gear",
      result: { itemId: "hlm_master", count: 1 },
      materials: { willow_heart: 1, moth_dust: 2 },
      unlockAfter: "bt_boss_willow",
      note: "\u0421\u0435\u0440\u0434\u0446\u0435 \u0438\u0432\u044B \u0432 \u043E\u0431\u0440\u0443\u0447\u0435. \u0421\u0435\u0442 \xAB\u041C\u0430\u0441\u0442\u0435\u0440\xBB 6/9."
    },
    {
      id: "rcp_master_armor",
      name: "\u0421\u0448\u0438\u0442\u044C \u041A\u0430\u043C\u0437\u043E\u043B \u043C\u0430\u0441\u0442\u0435\u0440\u0430",
      icon: "\u{1F9E5}",
      kind: "gear",
      result: { itemId: "arm_master", count: 1 },
      materials: { ink_drop: 3, torn_cloth: 2, moss_stone: 1 },
      unlockAfter: "bk_blots",
      note: "\u041F\u0440\u043E\u043F\u0438\u0442\u0430\u043D \u0447\u0435\u0440\u043D\u0438\u043B\u0430\u043C\u0438. \u0421\u0435\u0442 \xAB\u041C\u0430\u0441\u0442\u0435\u0440\xBB 7/9."
    },
    {
      id: "rcp_master_boots",
      name: "\u0421\u043A\u043B\u0435\u0438\u0442\u044C \u0421\u0430\u043F\u043E\u0433\u0438 \u043C\u0430\u0441\u0442\u0435\u0440\u0430",
      icon: "\u{1F97E}",
      kind: "gear",
      result: { itemId: "bt_master", count: 1 },
      materials: { rat_tail: 2, page_dust: 1, torn_cloth: 1 },
      unlockAfter: "bk_moths",
      note: "\u0411\u0435\u0441\u0448\u0443\u043C\u043D\u044B\u0435, \u043A\u0430\u043A \u043F\u0435\u0440\u0435\u0432\u043E\u0440\u043E\u0442 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B. \u0421\u0435\u0442 \xAB\u041C\u0430\u0441\u0442\u0435\u0440\xBB 8/9."
    },
    {
      id: "rcp_master_loop",
      name: "\u041E\u0442\u043B\u0438\u0442\u044C \u041A\u043E\u043B\u044C\u0446\u043E \u043D\u0430\u043F\u0430\u0440\u043D\u0438\u043A\u0430",
      icon: "\u{1F48D}",
      kind: "gear",
      result: { itemId: "rng_master_loop", count: 1 },
      materials: { gold_leaf: 1, ink_drop: 1 },
      unlockAfter: "bk_illustration",
      note: "\u041F\u0430\u0440\u043D\u043E\u0435 \u043A \u043F\u0435\u0440\u0441\u0442\u043D\u044E. \u0421\u0435\u0442 \xAB\u041C\u0430\u0441\u0442\u0435\u0440\xBB 9/9 \u2014 \u0441\u043E\u0431\u0435\u0440\u0438 \u0432\u0441\u0451!"
    }
  ];
  var RECIPE_BY_ID = Object.fromEntries(RECIPES.map((r) => [r.id, r]));

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
    { id: "last_page", name: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430", icon: "\u{1F4DC}", description: "\u041D\u0430 \u043D\u0435\u0439 \u2014 \u043A\u043E\u043D\u0435\u0446 \u043B\u044E\u0431\u043E\u0439 \u0438\u0441\u0442\u043E\u0440\u0438\u0438." },
    { id: "star_shard", name: "\u041E\u0441\u043A\u043E\u043B\u043E\u043A \u0437\u0432\u0435\u0437\u0434\u044B", icon: "\u{1F31F}", description: "\u0422\u0451\u043F\u043B\u044B\u0439, \u043A\u0430\u043A \u043C\u0430\u043B\u0435\u043D\u044C\u043A\u043E\u0435 \u0441\u043E\u043B\u043D\u0446\u0435." }
  ];
  for (const w of WORLDS) {
    if (w?.materials) MATERIALS.push(...w.materials);
  }
  var MATERIAL_BY_ID = Object.fromEntries(MATERIALS.map((m) => [m.id, m]));
  function materialLabel(id) {
    const m = MATERIAL_BY_ID[id];
    return m ? `${m.icon} ${m.name}` : id;
  }

  // src/data/sets.js
  var SETS = {
    meadow: {
      name: "\u041E\u043F\u0443\u0448\u043A\u0430",
      tiers: {
        3: { stats: { speed: 3, dodge: 0.05 }, desc: "\u041B\u0451\u0433\u043A\u043E\u0441\u0442\u044C \u043B\u0435\u0441\u0430: \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u044C +3, \u0443\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u0435 +5%" },
        6: { stats: { crit: 0.08 }, traits: ["bonus_spirit"], desc: "\u0417\u043E\u0432 \u0434\u0443\u0445\u043E\u0432: \u043A\u0440\u0438\u0442 +8%, \u0443\u0440\u043E\u043D \u043F\u043E \u0434\u0443\u0445\u0430\u043C \xD71.3" },
        9: { traits: ["regen_ally"], desc: "\u0414\u044B\u0445\u0430\u043D\u0438\u0435 \u043E\u043F\u0443\u0448\u043A\u0438: \u0440\u0435\u0433\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u044F \u0432\u0441\u044E \u0431\u0438\u0442\u0432\u0443" }
      }
    },
    town: {
      name: "\u0414\u0432\u043E\u0440\u043D\u0438\u043A",
      tiers: {
        3: { stats: { armor: 8 }, desc: "\u0422\u043E\u043B\u0449\u0438\u043D\u0430 \u0441\u0442\u0435\u043D: \u0431\u0440\u043E\u043D\u044F +8" },
        6: { stats: { block: 0.1, hp: 20 }, desc: "\u0421\u0442\u0440\u0430\u0436 \u0434\u0432\u043E\u0440\u0430: \u0431\u043B\u043E\u043A +10%, \u0437\u0434\u043E\u0440\u043E\u0432\u044C\u0435 +20" },
        9: { traits: ["first_hit_reduction"], desc: "\u041D\u0435\u0441\u043E\u043A\u0440\u0443\u0448\u0438\u043C\u043E\u0441\u0442\u044C: \u043F\u0435\u0440\u0432\u044B\u0439 \u0443\u0434\u0430\u0440 \u0432 \u0431\u043E\u044E \u221220%" }
      }
    },
    attic: {
      name: "\u0427\u0435\u0440\u0434\u0430\u043A",
      tiers: {
        3: { stats: {}, resist: { poison: 0.15, sleep: 0.15 }, desc: "\u041F\u044B\u043B\u044C \u0432\u0435\u043A\u043E\u0432: \u0441\u043E\u043F\u0440. \u044F\u0434\u0443 \u0438 \u0441\u043D\u0443 +15%" },
        6: { stats: { dodge: 0.08 }, desc: "\u0427\u0435\u0440\u043D\u0438\u043B\u044C\u043D\u0430\u044F \u043B\u0451\u0433\u043A\u043E\u0441\u0442\u044C: \u0443\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u0435 +8%" },
        9: { traits: ["fearless"], desc: "\u0422\u0438\u0448\u0438\u043D\u0430 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0438: \u0438\u043C\u043C\u0443\u043D\u0438\u0442\u0435\u0442 \u043A \u0441\u0442\u0440\u0430\u0445\u0443" }
      }
    },
    master: {
      name: "\u041C\u0430\u0441\u0442\u0435\u0440",
      tiers: {
        3: { stats: { attack: 5 }, desc: "\u0420\u0443\u043A\u0430 \u043C\u0430\u0441\u0442\u0435\u0440\u0430: \u0430\u0442\u0430\u043A\u0430 +5" },
        6: { stats: { crit: 0.06 }, desc: "\u0422\u043E\u0447\u043D\u043E\u0441\u0442\u044C \u043C\u0430\u0441\u0442\u0435\u0440\u0430: \u043A\u0440\u0438\u0442 +6%" },
        9: { traits: ["pierce"], desc: "\u0413\u043B\u0430\u0437 \u043C\u0430\u0441\u0442\u0435\u0440\u0430: \u043F\u0440\u043E\u0431\u0438\u0442\u0438\u0435 \u0431\u0440\u043E\u043D\u0438 \u0432\u0434\u0432\u043E\u0435" }
      }
    }
  };

  // src/core/items.js
  var SLOTS = ["weapon", "helmet", "shield", "gloves", "armor", "boots", "amulet", "ring1", "ring2"];
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
    const setCounts = {};
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
      if (item2.set) setCounts[item2.set] = (setCounts[item2.set] || 0) + 1;
    }
    const activeSets = [];
    for (const [setKey, count] of Object.entries(setCounts)) {
      const def = SETS[setKey];
      if (!def) continue;
      for (const tier of [3, 6, 9]) {
        if (count >= tier) {
          const t = def.tiers[tier];
          if (!t) continue;
          if (t.stats) {
            for (const [k, v] of Object.entries(t.stats)) s[k] = (s[k] || 0) + v;
          }
          if (t.resist) {
            for (const [rk, rv] of Object.entries(t.resist)) {
              s.resist[rk] = 1 - (1 - (s.resist[rk] || 0)) * (1 - rv);
            }
          }
          if (t.traits) traits.push(...t.traits);
          activeSets.push({ set: setKey, name: def.name, count, tier, desc: t.desc });
        }
      }
    }
    s.hp = Math.max(1, s.hp);
    s.crit = Math.min(0.95, Math.max(0, s.crit));
    s.dodge = Math.min(0.8, Math.max(0, s.dodge));
    s.block = Math.min(0.8, Math.max(0, s.block));
    return { stats: s, traits, activeSets };
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
  ENEMIES.push(
    {
      id: "boss_star_guardian",
      name: "\u0417\u0432\u0451\u0437\u0434\u043D\u044B\u0439 \u0441\u0442\u0440\u0430\u0436",
      icon: "\u{1F31F}",
      hp: 420,
      attack: 27,
      armor: 26,
      speed: 11,
      crit: 0.12,
      dodge: 0.08,
      elem: "fire",
      skills: ["heavy_blow", "fear_chill", "spit_fire"],
      boss: true,
      tags: ["spirit"],
      reward: { coins: [600, 800], seals: 5, materials: ["star_shard"] }
    }
  );
  for (const w of WORLDS) {
    if (w?.enemies) ENEMIES.push(...w.enemies);
  }
  var ENEMY_BY_ID = Object.fromEntries(ENEMIES.map((e) => [e.id, e]));

  // src/core/formBattle.js
  var GAUGE_FULL = 100;
  var MAX_TICKS = 5e3;
  var FRONT = [0, 1, 2];
  var COLS = 8;
  var ROWS = 3;
  var RANGED_SKILLS = [
    "spit_fire",
    "pollen_sleep",
    "slow_spores",
    "fear_chill",
    "aimed_shot",
    "sting_poison",
    "sting_poison_weak",
    "regen_ally_skill"
  ];
  function isRanged(unit) {
    return unit.tags?.includes("ranged") || unit.traits?.includes("ranged");
  }
  function unitRange(unit) {
    if (isRanged(unit)) return 99;
    if (unit.caster) return 2;
    return 1;
  }
  function effectiveRange(unit, allies) {
    if (isRanged(unit)) return 99;
    if (!unit.caster) return 1;
    const screened = allies.some((a) => a !== unit && a.hp > 0 && !a.caster);
    return screened ? 2 : 1;
  }
  function slotToCell(slot, side) {
    const row = slot % 3;
    if (side === "ally") return [FRONT.includes(slot) ? 1 : 0, row];
    return [FRONT.includes(slot) ? 6 : 7, row];
  }
  function cellDist(a, b) {
    return Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));
  }
  function makeFormationKnight(knightStats, traits, consumables, slot) {
    const statuses = [];
    if ((traits || []).includes("regen_ally")) statuses.push({ kind: "regen", ticks: 9999, dmg: 1 });
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
      uid: "a0",
      side: "ally",
      name: "\u0420\u044B\u0446\u0430\u0440\u044C \u043B\u0430\u0432\u043A\u0438",
      icon: "\u{1F6E1}\uFE0F",
      slot,
      cell: slotToCell(slot, "ally"),
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
      stats: { dealt: 0, taken: 0, sleptTicks: 0, poisonTicks: 0 }
    };
  }
  function makeFormationMerc(def, slot, index) {
    const caster = (def.skills || []).some((s) => RANGED_SKILLS.includes(s)) && !(def.tags || []).includes("ranged");
    return {
      uid: `a${index}`,
      side: "ally",
      name: def.name,
      icon: def.icon,
      slot,
      cell: slotToCell(slot, "ally"),
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
      traits: [],
      caster,
      resist: {},
      potions: [],
      statuses: [],
      gauge: 0,
      stats: { dealt: 0, taken: 0 }
    };
  }
  function makeFormationEnemy(id, scale, slot, index) {
    const def = ENEMY_BY_ID[id];
    const hp = Math.round(def.hp * (scale || 1));
    const caster = (def.skills || []).some((s) => RANGED_SKILLS.includes(s)) && !(def.tags || []).includes("ranged");
    return {
      uid: `e${index}`,
      side: "enemy",
      name: def.name,
      icon: def.icon,
      slot,
      cell: slotToCell(slot, "enemy"),
      boss: !!def.boss,
      tags: [...def.tags || []],
      caster,
      hp,
      maxHp: hp,
      attack: Math.round(def.attack * (scale || 1)),
      armor: Math.round(def.armor * (scale || 1)),
      speed: def.speed,
      crit: def.crit || 0,
      dodge: def.dodge || 0,
      block: 0,
      elem: def.elem || "phys",
      skills: def.skills || [],
      traits: [],
      resist: {},
      potions: [],
      statuses: [],
      gauge: 0,
      stats: { dealt: 0, taken: 0 }
    };
  }
  function hasStatus(u, kind) {
    return u.statuses.some((s) => s.kind === kind);
  }
  function addStatus(u, status2) {
    const ex = u.statuses.find((s) => s.kind === status2.kind);
    if (ex) Object.assign(ex, status2);
    else u.statuses.push(status2);
  }
  function computeDamage(attacker, defender, rng, log, opts = {}) {
    if (!opts.neverMiss && rng.chance(defender.dodge)) {
      log.push({ t: "dodge", who: defender.name, uid: defender.uid });
      return 0;
    }
    let mult = 1;
    if (attacker.traits?.includes("bonus_spirit") && defender.tags?.includes("spirit")) mult *= 1.3;
    const elem = opts.elem || attacker.elem || "phys";
    if (elem !== "phys") mult *= 1 - (defender.resist[elem] || 0);
    let armor = defender.armor;
    if (attacker.traits?.includes("pierce") || opts.pierce) armor *= 0.5;
    mult *= 100 / (100 + Math.max(0, armor));
    let crit = false;
    if (rng.chance(attacker.crit)) {
      mult *= 1.75;
      crit = true;
    }
    if (rng.chance(defender.block)) mult *= 0.6;
    if (hasStatus(attacker, "fear")) mult *= 0.7;
    if (defender.traits?.includes("first_hit_reduction") && defender.stats.taken === 0) mult *= 0.8;
    const dmg = Math.max(1, Math.round((opts.base ?? attacker.attack) * (opts.skillMult || 1) * mult));
    let remaining = dmg;
    const shield = defender.statuses.find((s) => s.kind === "shield");
    if (shield) {
      const absorbed = Math.min(shield.amount, remaining);
      shield.amount -= absorbed;
      remaining -= absorbed;
      if (shield.amount <= 0) {
        defender.statuses = defender.statuses.filter((s) => s !== shield);
        log.push({ t: "status_end", who: defender.name, uid: defender.uid, kind: "shield" });
      }
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
      elem,
      ranged: isRanged(attacker),
      skillName: opts.skillName || null
    });
    return remaining;
  }
  function tryApplyStatus(attacker, defender, kind, chance, status2, rng, log) {
    const effective = chance * (1 - (defender.resist[kind] || 0));
    if (rng.chance(effective)) {
      addStatus(defender, status2);
      log.push({ t: "status", who: defender.name, uid: defender.uid, kind });
      return true;
    }
    log.push({ t: "status_fail", who: defender.name, uid: defender.uid, kind });
    return false;
  }
  function pickTarget(attacker, foes, rng, range) {
    const inRange = foes.filter((f) => f.hp > 0 && cellDist(attacker.cell, f.cell) <= range);
    if (inRange.length === 0) return null;
    return inRange.reduce((a, b) => a.hp < b.hp ? a : b);
  }
  function nearestEnemy(unit, foes) {
    const alive = foes.filter((f) => f.hp > 0);
    if (alive.length === 0) return null;
    return alive.reduce((a, b) => cellDist(unit.cell, a.cell) < cellDist(unit.cell, b.cell) ? a : b);
  }
  function stepToward(unit, goal, allUnits, log) {
    const [cx, cy] = unit.cell;
    const occupied = new Set(
      allUnits.filter((u) => u !== unit && u.hp > 0).map((u) => u.cell.join(","))
    );
    const curDist = cellDist(unit.cell, goal.cell);
    let best = null;
    let bestDist = curDist;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) continue;
        if (occupied.has(`${nx},${ny}`)) continue;
        const d = cellDist([nx, ny], goal.cell);
        const dc = Math.sign(goal.cell[0] - cx);
        const score = d * 10 + (dx === dc && dc !== 0 ? 0 : 1);
        if (d < bestDist || d === bestDist && best && score < best.score) {
          best = { cell: [nx, ny], d, score };
          bestDist = d;
        }
      }
    }
    if (!best || best.d >= curDist) return false;
    const from = unit.cell;
    unit.cell = best.cell;
    log.push({ t: "move", uid: unit.uid, from, to: unit.cell });
    return true;
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
  function useScrolls(unit, allies, foes, rng, log) {
    if (!unit.potions?.length) return;
    for (const p of unit.potions) {
      if (p.used || !p.effect?.kind?.startsWith("scroll_")) continue;
      const eff = p.effect;
      const alive = foes.filter((f) => f.hp > 0);
      if (eff.kind !== "scroll_heal_mist" && alive.length === 0) continue;
      p.used = true;
      log.push({ t: "scroll", uid: unit.uid, name: p.name, kind: eff.kind });
      switch (eff.kind) {
        case "scroll_fire_arrow": {
          const t = alive.reduce((a, b) => a.hp > b.hp ? a : b);
          computeDamage(unit, t, rng, log, { base: eff.dmg, elem: "fire", pierce: true });
          break;
        }
        case "scroll_fire_step": {
          for (const t of alive) computeDamage(unit, t, rng, log, { base: eff.dmg, elem: "fire" });
          break;
        }
        case "scroll_storm": {
          const weakest = [...alive].sort((a, b) => a.hp - b.hp).slice(0, 2);
          for (const t of weakest) computeDamage(unit, t, rng, log, { base: eff.dmg, elem: "storm" });
          break;
        }
        case "scroll_frost": {
          for (const t of alive) {
            addStatus(t, { kind: "slow", ticks: eff.ticks || 40, factor: eff.factor || 0.6 });
            log.push({ t: "status", who: t.name, uid: t.uid, kind: "slow" });
          }
          break;
        }
        case "scroll_heal_mist": {
          for (const a of allies.filter((x) => x.hp > 0)) {
            const healed = Math.min(eff.amount, a.maxHp - a.hp);
            a.hp += healed;
            if (healed > 0) log.push({ t: "dot", uid: a.uid, kind: "regen", dmg: -healed });
          }
          break;
        }
      }
    }
  }
  function act(unit, allies, foes, rng, log, tactic, allUnits) {
    const sleep = unit.statuses.find((s) => s.kind === "sleep");
    if (sleep) {
      sleep.ticks -= 1;
      if (sleep.ticks <= 0) {
        unit.statuses = unit.statuses.filter((s) => s !== sleep);
        log.push({ t: "status_end", who: unit.name, uid: unit.uid, kind: "sleep" });
      }
      log.push({ t: "sleeps", who: unit.name, uid: unit.uid });
      return GAUGE_FULL;
    }
    if (unit.uid === "a0") useScrolls(unit, allies, foes, rng, log);
    if (unit.skills.includes("regen_ally_skill")) {
      const wounded = allies.filter((a) => a.hp > 0).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
      if (wounded && wounded.hp < wounded.maxHp * 0.8 && !hasStatus(wounded, "regen")) {
        addStatus(wounded, { kind: "regen", ticks: 25, dmg: 2 });
        log.push({ t: "status", who: wounded.name, uid: wounded.uid, kind: "regen", from: unit.name });
        return GAUGE_FULL;
      }
    }
    const range = effectiveRange(unit, allies);
    const target = pickTarget(unit, foes, rng, range);
    if (!target) {
      const meleeFoeAlive = foes.some((f) => f.hp > 0 && !isRanged(f) && !f.caster);
      const holds = tactic === "defense" && unit.side === "ally" && !isRanged(unit) && meleeFoeAlive;
      if (!holds) {
        const goal = nearestEnemy(unit, foes);
        if (goal) stepToward(unit, goal, allUnits, log);
      }
      return GAUGE_FULL / 2;
    }
    const SKILL_NAMES = {
      sting_poison: "\u0436\u0430\u043B\u0438\u0442 \u044F\u0434\u043E\u043C",
      sting_poison_weak: "\u0436\u0430\u043B\u0438\u0442 \u0441\u043B\u0430\u0431\u044B\u043C \u044F\u0434\u043E\u043C",
      pollen_sleep: "\u0432\u0435\u0435\u0442 \u0441\u043E\u043D\u043D\u043E\u0439 \u043F\u044B\u043B\u044C\u0446\u043E\u0439",
      slow_spores: "\u0432\u044B\u043F\u0443\u0441\u043A\u0430\u0435\u0442 \u0441\u043F\u043E\u0440\u044B",
      fear_chill: "\u043D\u0430\u0441\u044B\u043B\u0430\u0435\u0442 \u0441\u0442\u0440\u0430\u0445",
      spit_fire: "\u043F\u043B\u044E\u0451\u0442 \u043E\u0433\u043D\u0451\u043C",
      aimed_shot: "\u043F\u0440\u0438\u0446\u0435\u043B\u044C\u043D\u044B\u0439 \u0432\u044B\u0441\u0442\u0440\u0435\u043B",
      heavy_blow: "\u0442\u044F\u0436\u0451\u043B\u044B\u0439 \u0443\u0434\u0430\u0440",
      regen_ally_skill: "\u0446\u0435\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u043D\u0430\u0441\u0442\u043E\u0439"
    };
    let skill = unit.skills[0] && unit.skills[(unit._next || 0) % unit.skills.length];
    unit._next = (unit._next || 0) + 1;
    if (skill === "regen_ally_skill" && unit.skills.length > 1) {
      skill = unit.skills.find((s) => s !== "regen_ally_skill");
    }
    const sName = SKILL_NAMES[skill] || null;
    switch (skill) {
      case "pollen_sleep":
        computeDamage(unit, target, rng, log, { skillMult: 0.6, skillName: sName });
        tryApplyStatus(unit, target, "sleep", 0.3, { kind: "sleep", ticks: 18 }, rng, log);
        break;
      case "sting_poison":
        computeDamage(unit, target, rng, log, { skillName: sName });
        tryApplyStatus(unit, target, "poison", 0.5, { kind: "poison", ticks: 40, dmg: 2 }, rng, log);
        break;
      case "sting_poison_weak":
        computeDamage(unit, target, rng, log, { skillName: sName });
        tryApplyStatus(unit, target, "poison", 0.25, { kind: "poison", ticks: 30, dmg: 1 }, rng, log);
        break;
      case "slow_spores":
        computeDamage(unit, target, rng, log, { skillMult: 0.7, skillName: sName });
        tryApplyStatus(unit, target, "slow", 0.5, { kind: "slow", ticks: 40, factor: 0.6 }, rng, log);
        break;
      case "heavy_blow":
        computeDamage(unit, target, rng, log, { skillMult: 1.6, skillName: sName });
        break;
      case "fear_chill":
        computeDamage(unit, target, rng, log, { skillMult: 0.8, skillName: sName });
        tryApplyStatus(unit, target, "fear", 0.5, { kind: "fear", ticks: 35 }, rng, log);
        break;
      case "spit_fire":
        computeDamage(unit, target, rng, log, { elem: "fire", skillMult: 1.1, skillName: sName });
        break;
      case "aimed_shot":
        computeDamage(unit, target, rng, log, { skillMult: 1.35, neverMiss: true, skillName: sName });
        break;
      case "regen_ally_skill": {
        const wounded = allies.filter((a) => a.hp > 0).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
        if (wounded && wounded.hp < wounded.maxHp * 0.8) {
          addStatus(wounded, { kind: "regen", ticks: 25, dmg: 2 });
          log.push({ t: "status", who: wounded.name, uid: wounded.uid, kind: "regen", from: unit.name });
        } else {
          computeDamage(unit, target, rng, log, { skillMult: 0.8, skillName: sName });
        }
        break;
      }
      default: {
        if (unit.traits?.includes("cleave_small")) {
          const range2 = unitRange(unit);
          const others = foes.filter((f) => f !== target && f.hp > 0 && cellDist(unit.cell, f.cell) <= range2);
          computeDamage(unit, target, rng, log);
          for (const other of others) computeDamage(unit, other, rng, log, { skillMult: 0.4 });
        } else {
          computeDamage(unit, target, rng, log);
        }
      }
    }
    return GAUGE_FULL;
  }
  function simulateFormationBattle(allies, foes, seed = 1, tactic = "balance") {
    const rng = makeRng(seed);
    if (tactic === "defense") {
      for (const u of allies) {
        u.attack = Math.max(1, Math.round(u.attack * 0.85));
        u.armor = Math.round(u.armor * 1.25);
        u.dodge = (u.dodge || 0) + 0.12;
      }
    } else if (tactic === "offense") {
      for (const u of allies) {
        u.attack = Math.max(1, Math.round(u.attack * 1.2));
        u.speed = u.speed * 1.1;
        u.armor = Math.round(u.armor * 0.85);
        u.dodge = Math.max(0, (u.dodge || 0) - 0.08);
      }
    }
    const log = [{ t: "start", allies: allies.map((a) => a.name), foes: foes.map((f) => f.name) }];
    const knight = allies[0];
    for (const u of [...allies, ...foes]) {
      for (const s of u.statuses) {
        log.push({ t: "status", who: u.name, uid: u.uid, kind: s.kind });
      }
    }
    const endStatus = (u, s) => log.push({ t: "status_end", who: u.name, uid: u.uid, kind: s.kind });
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
            log.push({ t: "dot", uid: u.uid, kind: "poison", dmg: s.dmg });
            if (s.ticks <= 0) {
              u.statuses = u.statuses.filter((x) => x !== s);
              endStatus(u, s);
            }
          }
          if (s.kind === "regen") {
            s.ticks -= 1;
            const healed = Math.min(s.dmg, u.maxHp - u.hp);
            u.hp += healed;
            if (healed > 0) log.push({ t: "dot", uid: u.uid, kind: "regen", dmg: -healed });
            if (s.ticks <= 0) {
              u.statuses = u.statuses.filter((x) => x !== s);
              endStatus(u, s);
            }
          }
          if (s.kind === "fear") {
            s.ticks -= 1;
            if (s.ticks <= 0) {
              u.statuses = u.statuses.filter((x) => x !== s);
              endStatus(u, s);
            }
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
          if (slow.ticks <= 0) {
            u.statuses = u.statuses.filter((x) => x !== slow);
            endStatus(u, slow);
          }
        }
        u.gauge += spd;
      }
      const ready = [...allies, ...foes].filter((u) => u.hp > 0 && u.gauge >= GAUGE_FULL).sort((a, b) => b.gauge - a.gauge);
      for (const u of ready) {
        if (u.gauge < GAUGE_FULL || u.hp <= 0) continue;
        const myAllies = u.side === "ally" ? allies : foes;
        const myFoes = u.side === "ally" ? foes : allies;
        const cost = act(u, myAllies, myFoes, rng, log, tactic, [...allies, ...foes]);
        u.gauge -= cost ?? GAUGE_FULL;
        if (u.side === "ally" && hasStatus(u, "sleep")) u.stats.sleptTicks++;
      }
      if (foes.every((f) => f.hp <= 0) || allies.every((a) => a.hp <= 0)) break;
    }
    const victory = foes.every((f) => f.hp <= 0) && allies.some((a) => a.hp > 0);
    const timedOut = !victory && tick >= MAX_TICKS;
    const report = {
      victory,
      timedOut,
      knightHpLeft: Math.max(0, knight.hp),
      knightHpMax: knight.maxHp,
      dealt: allies.reduce((s, a) => s + a.stats.dealt, 0),
      taken: knight.stats.taken,
      alliesDown: allies.filter((a) => a.hp <= 0).map((a) => a.name),
      alliesStats: allies.map((a) => ({ name: a.name, icon: a.icon, dealt: a.stats.dealt, taken: a.stats.taken, alive: a.hp > 0 })),
      foesDown: foes.filter((f) => f.hp <= 0).length,
      foesTotal: foes.length,
      slept: knight.stats.sleptTicks > 0,
      poisoned: knight.stats.poisonTicks > 0,
      deathCause: knight.hp > 0 ? null : inferCause(knight),
      advice: victory ? null : timedOut ? "\u0411\u043E\u0439 \u0437\u0430\u0442\u044F\u043D\u0443\u043B\u0441\u044F \u0434\u043E \u043F\u0440\u0435\u0434\u0435\u043B\u0430 \u2014 \u0432\u0440\u0430\u0433\u043E\u0432 \u043D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0434\u043E\u0431\u0438\u0442\u044C \u0432\u043E\u0432\u0440\u0435\u043C\u044F. \u041F\u043E\u0434\u043D\u0438\u043C\u0430\u0439 \u0430\u0442\u0430\u043A\u0443: \u043E\u0440\u0443\u0436\u0438\u0435 \u043F\u043E\u043C\u043E\u0449\u043D\u0435\u0435, \u043A\u0440\u0438\u0442, \u043F\u0440\u043E\u0431\u0438\u0432\u0430\u043D\u0438\u0435 \u0431\u0440\u043E\u043D\u0438 \u2014 \u0438\u043B\u0438 \u043F\u043E\u0437\u043E\u0432\u0438 \u043D\u0430\u0451\u043C\u043D\u0438\u043A\u043E\u0432." : adviceFor(knight, allies, foes, inferCause(knight))
    };
    return { victory, log, report, ticks: tick };
  }
  function inferCause(knight) {
    if (knight.stats.sleptTicks > 0) return "sleep";
    if (knight.stats.poisonTicks > 20) return "poison";
    return "phys";
  }
  function adviceFor(knight, allies, foes, cause) {
    if (cause === "sleep") {
      return "\u0420\u044B\u0446\u0430\u0440\u044C \u0443\u0441\u043D\u0443\u043B \u043D\u0430 \u043F\u043E\u0441\u0442\u0443. \u0428\u043B\u0435\u043C \u0441 \u0441\u043E\u043F\u0440\u043E\u0442\u0438\u0432\u043B\u0435\u043D\u0438\u0435\u043C \u0441\u043D\u0443 \u0438\u043B\u0438 \u0437\u0435\u043B\u044C\u0435 \u0431\u043E\u0434\u0440\u043E\u0441\u0442\u0438 \u2014 \u0438 \u043F\u043E\u0440\u044F\u0434\u043E\u043A.";
    }
    if (cause === "poison") {
      return "\u042F\u0434 \u043F\u043E\u0434\u0442\u043E\u0447\u0438\u043B \u0440\u044B\u0446\u0430\u0440\u044F. \u0410\u043C\u0443\u043B\u0435\u0442 \u043F\u0440\u043E\u0442\u0438\u0432\u043E\u044F\u0434\u0438\u044F \u0438\u043B\u0438 \u0447\u0435\u0440\u043D\u0438\u043B\u044C\u043D\u044B\u0439 \u043E\u0442\u0432\u0430\u0440 \u043F\u043E\u043C\u043E\u0433\u0443\u0442.";
    }
    if (allies.length === 1) {
      return "\u0412 \u043E\u0434\u0438\u043D\u043E\u0447\u043A\u0443 \u0442\u044F\u0436\u0435\u043B\u043E. \u041D\u0430\u0439\u043C\u0438 \u0432 \u0442\u0430\u0432\u0435\u0440\u043D\u0435 \u0433\u0440\u043E\u043C\u0438\u043B\u0443 \u0432 \u043F\u0435\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u044F\u0434 \u0438 \u043B\u0443\u0447\u043D\u0438\u0446\u0443 \u0437\u0430 \u0441\u043F\u0438\u043D\u0443.";
    }
    const frontDown = allies.filter((a) => FRONT.includes(a.slot) && a.hp <= 0).length;
    if (frontDown > 0) {
      return "\u041F\u0435\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u044F\u0434 \u0440\u0443\u0445\u043D\u0443\u043B, \u0438 \u0441\u0442\u0440\u0435\u043B\u043A\u043E\u0432 \u0437\u0430 \u0441\u043F\u0438\u043D\u043E\u0439 \u0440\u0430\u0441\u0442\u043E\u043F\u0442\u0430\u043B\u0438. \u041F\u043E\u0441\u0442\u0430\u0432\u044C \u0432\u043F\u0435\u0440\u0451\u0434 \u043A\u043E\u0433\u043E-\u043D\u0438\u0431\u0443\u0434\u044C \u043F\u043E\u043A\u0440\u0435\u043F\u0447\u0435.";
    }
    return "\u041D\u0435 \u0445\u0432\u0430\u0442\u0438\u043B\u043E \u043C\u043E\u0449\u0438. \u041F\u0440\u043E\u0432\u0435\u0440\u044C \u044D\u043A\u0438\u043F\u0438\u0440\u043E\u0432\u043A\u0443, \u0437\u0435\u043B\u044C\u044F \u0438 \u0440\u0430\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0443: \u0442\u0430\u043D\u043A\u0438 \u0432\u043F\u0435\u0440\u0451\u0434, \u0441\u0442\u0440\u0435\u043B\u043A\u0438 \u043D\u0430\u0437\u0430\u0434.";
  }
  function enemyFormationSlots(enemyEntries) {
    const used = /* @__PURE__ */ new Set();
    const take = (prefs) => {
      const slot = prefs.find((s) => !used.has(s)) ?? prefs[0];
      used.add(slot);
      return slot;
    };
    return enemyEntries.map((entry) => {
      const id = typeof entry === "string" ? entry : entry.id;
      const def = ENEMY_BY_ID[id];
      if (def.boss) return take([1, 0, 2, 4, 3, 5]);
      const melee = !def.skills.some((s) => s === "pollen_sleep" || s === "fear_chill");
      return melee ? take([0, 1, 2, 3, 4, 5]) : take([3, 4, 5, 0, 1, 2]);
    });
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
      lastDailyBonus: null,
      // день, когда получен бонус заказа дня
      lastCatGift: null,
      // день последнего подарка от кота
      cosmeticsOwned: [],
      // купленные украшения
      cosmeticsActive: [],
      // выставленные украшения
      seekOverrides: {},
      // правки хотспотов искалок из редактора: levelId -> groups
      shopSeenStock: [],
      // id товаров прилавка, которые игрок уже видел
      achievements: {},
      // id -> timestamp разблокировки
      journal: [],
      // дневник кота: последние события [{icon, text, at}]
      tutorial: {},
      // пройденные этапы обучения
      tutorialSkipped: false,
      // игрок пропустил обучение целиком
      settings: { useBeltItems: true, tactic: "balance" },
      // настройки боя
      formation: { knight: 1, merc0: 0, merc1: 5 },
      // слоты 0-2 передний ряд, 3-5 задний
      cheats: { used: [], spiderHat: false },
      // активированные читы и пасхалки
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
    state2.seekOverrides ||= {};
    state2.shopSeenStock ||= [];
    state2.lastDailyBonus ??= null;
    state2.lastCatGift ??= null;
    state2.stats.catPets ||= 0;
    state2.achievements ||= {};
    state2.journal ||= [];
    state2.tutorial ||= {};
    state2.tutorialSkipped ??= false;
    state2.settings ||= {};
    delete state2.settings.battleMode;
    state2.settings.useBeltItems ??= true;
    state2.settings.tactic ??= "balance";
    state2.formation ||= { knight: 1, merc0: 0, merc1: 5 };
    state2.cheats ||= { used: [], spiderHat: false };
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
  function unseenShopItems(state2) {
    const seen = new Set(state2.shopSeenStock || []);
    return shopStock(state2).filter((i) => !seen.has(i.id));
  }
  function markShopSeen(state2) {
    state2.shopSeenStock = shopStock(state2).map((i) => i.id);
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
    journalPush(state2, "\u{1FA99}", `\u041A\u0443\u043F\u043B\u0435\u043D\u043E: ${item2.name}.`);
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
    journalPush(state2, def.icon, `${def.name} \u0442\u0435\u043F\u0435\u0440\u044C \u0441 \u043D\u0430\u043C\u0438!`);
    if (kind === "companion" && state2.squadCompanions.length < 3) state2.squadCompanions.push(id);
    if (kind === "merc" && state2.squadMercs.length < 2) {
      const idx = state2.squadMercs.length;
      state2.squadMercs.push(id);
      const key = `merc${idx}`;
      const isTank = def.role === "\u0442\u0430\u043D\u043A";
      const wantSlots = isTank ? [0, 2] : [4, 5, 3];
      const taken = Object.values(state2.formation);
      state2.formation[key] = wantSlots.find((s) => !taken.includes(s)) ?? (isTank ? 0 : 4);
    }
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
    state2.stats.itemsCrafted = (state2.stats.itemsCrafted || 0) + 1;
    journalPush(state2, "\u2692\uFE0F", `\u0413\u043E\u0442\u043E\u0432\u043E: ${r.name.toLowerCase()}.`);
    return { ok: true, itemId: r.result.itemId, count };
  }
  function journalPush(state2, icon, text) {
    state2.journal ||= [];
    state2.journal.push({ icon, text, at: Date.now() });
    if (state2.journal.length > 30) state2.journal.splice(0, state2.journal.length - 30);
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
  var PUZZLE_POOL = new Map(
    [
      ...PUZZLES,
      ...SHELF_PUZZLES,
      ...BOOK_PUZZLES,
      ...SEEK_PUZZLES,
      ...PATH_PUZZLES,
      ...TEA_PUZZLES,
      ...MECH_PUZZLES,
      ...CANDLE_PUZZLES,
      ...FLOW_PUZZLES,
      ...BREW_PUZZLES
    ].map((p) => [p.id, p])
  );
  var CAMPAIGN_ORDER = [
    "md_01",
    "md_02",
    "sk_md_01",
    "md_03",
    "md_04",
    "sk_md_02",
    "md_05",
    "tw_01",
    "md_06",
    "tw_02",
    "md_07",
    "tw_03",
    "sk_tw_01",
    "md_08",
    "tw_04",
    "md_09",
    "tw_05",
    "md_10",
    "tw_06",
    "sk_tw_02",
    "md_11",
    "tw_07",
    "bk_01",
    "tw_08",
    "bk_02",
    "md_12",
    "bk_03",
    "tw_09",
    "bk_04",
    "sk_bk_01",
    "bk_05",
    "tw_10",
    "bk_06",
    "bk_07",
    "sk_bk_02",
    "bk_08",
    "bk_09",
    "bk_10",
    // Перекрёсток: тропинки и чай вперемешку с поиском
    "pp_01",
    "tea_01",
    "pp_02",
    "tea_02",
    "pp_03",
    "tea_03",
    "pp_04",
    "tea_04",
    "pp_05",
    "tea_05",
    "pp_06",
    "tea_06",
    "pp_07",
    "tea_07",
    "pp_08",
    "tea_08",
    // Искалки новых миров
    "sk_nm_01",
    "sk_sw_01",
    "sk_sf_01",
    "sk_ash_01",
    "sk_cr_01",
    "sk_jade_01",
    "sk_deep_01",
    "sk_mist_01",
    // Мастерская механики, свечи и потоки покупателей — вперемешку
    "mech_01",
    "cd_01",
    "flow_01",
    "mech_02",
    "cd_02",
    "flow_02",
    "mech_03",
    "cd_03",
    "flow_03",
    "mech_04",
    "cd_04",
    "flow_04",
    "mech_05",
    "cd_05",
    "flow_05",
    "mech_06",
    "cd_06",
    "flow_06",
    "mech_07",
    "cd_07",
    "flow_07",
    "mech_08",
    "cd_08",
    "flow_08",
    // Алхимический стол: варка зелий по рецепту (с brew_06 — на память)
    "brew_01",
    "brew_02",
    "brew_03",
    "brew_04",
    "brew_05",
    "brew_06",
    "brew_07",
    "brew_08",
    "brew_09",
    "brew_10"
  ];
  var ALL_PUZZLES = CAMPAIGN_ORDER.map((id) => PUZZLE_POOL.get(id));
  function allPuzzles(state2) {
    return [...ALL_PUZZLES, ...state2.customPuzzles || []];
  }
  function findPuzzle(state2, id) {
    return allPuzzles(state2).find((p) => p.id === id) || null;
  }
  var SEEK_OVERRIDES_KEY = "cozy_seek_overrides_v1";
  function overrideStorage(storage) {
    return storage || (typeof localStorage !== "undefined" ? localStorage : null);
  }
  function loadSeekOverrides(storage) {
    const s = overrideStorage(storage);
    if (!s) return {};
    try {
      return JSON.parse(s.getItem(SEEK_OVERRIDES_KEY) || "{}");
    } catch {
      return {};
    }
  }
  function applySeekOverrides(state2, level, storage) {
    const ov = loadSeekOverrides(storage)[level.id] || state2.seekOverrides?.[level.id];
    if (!ov || level.mechanic !== "seek") return level;
    return { ...level, groups: JSON.parse(JSON.stringify(ov)) };
  }
  function saveSeekOverride(state2, levelId, groups, storage) {
    const all = loadSeekOverrides(storage);
    all[levelId] = JSON.parse(JSON.stringify(groups));
    const s = overrideStorage(storage);
    if (s) s.setItem(SEEK_OVERRIDES_KEY, JSON.stringify(all));
    else state2.seekOverrides[levelId] = all[levelId];
  }
  function resetSeekOverride(state2, levelId, storage) {
    const all = loadSeekOverrides(storage);
    delete all[levelId];
    const s = overrideStorage(storage);
    if (s) s.setItem(SEEK_OVERRIDES_KEY, JSON.stringify(all));
    delete state2.seekOverrides[levelId];
  }
  function migrateSeekOverrides(state2, storage) {
    const legacy = state2.seekOverrides || {};
    if (Object.keys(legacy).length === 0) return;
    const all = { ...legacy, ...loadSeekOverrides(storage) };
    const s = overrideStorage(storage);
    if (s) s.setItem(SEEK_OVERRIDES_KEY, JSON.stringify(all));
    state2.seekOverrides = {};
  }
  function puzzleAvailable(state2, index) {
    if (index === 0) return true;
    return !!state2.puzzlesDone[ALL_PUZZLES[index - 1].id];
  }
  function completePuzzle(state2, puzzleId, info = {}) {
    const puzzle = findPuzzle(state2, puzzleId);
    if (!puzzle) return null;
    const firstTime = !state2.puzzlesDone[puzzleId];
    const isDaily = firstTime && state2.lastDailyBonus !== todayKey() && isDailyPuzzle(state2, puzzleId);
    state2.puzzlesDone[puzzleId] = {
      moves: info.moves ?? 0,
      hintsUsed: info.hintsUsed ?? 0,
      at: Date.now()
    };
    state2.stats.puzzlesSolved += 1;
    journalPush(state2, "\u{1F9E9}", firstTime ? `\u0417\u0430\u0433\u0430\u0434\u043A\u0430 \xAB${puzzle.name}\xBB \u0440\u0435\u0448\u0435\u043D\u0430. \u041B\u0430\u0432\u043A\u0430 \u0441\u0432\u0435\u0442\u043B\u0435\u0435\u0442.` : `\xAB${puzzle.name}\xBB \u2014 \u0441\u043D\u043E\u0432\u0430 \u0440\u0435\u0448\u0435\u043D\u0430, \u043A\u043E\u0442 \u0434\u043E\u0432\u043E\u043B\u0435\u043D.`);
    const rewards = puzzle.rewards || [{ type: "coins", amount: 15 }];
    let dailyBonus = false;
    if (isDaily) {
      dailyBonus = true;
      state2.lastDailyBonus = todayKey();
      journalPush(state2, "\u{1F31F}", "\u0417\u0430\u043A\u0430\u0437 \u0434\u043D\u044F \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D \u2014 \u043F\u0443\u0442\u043D\u0438\u043A \u0449\u0435\u0434\u0440\u043E \u0431\u043B\u0430\u0433\u043E\u0434\u0430\u0440\u0438\u0442!");
    }
    if (!firstTime) {
      const coins = rewards.find((r) => r.type === "coins");
      const amount = coins ? Math.round(coins.amount / 3) : 10;
      addCoins(state2, amount);
      return [{ type: "coins", amount }];
    }
    const granted = grantRewards(state2, rewards.map((r) => dailyBonus && r.type === "coins" ? { ...r, amount: r.amount * 2 } : r));
    return granted;
  }
  function skipPuzzlePrice(puzzle) {
    const coins = (puzzle.rewards || []).find((r) => r.type === "coins");
    return Math.max(50, Math.round((coins?.amount || 50) * 1.5));
  }
  function skipPuzzle(state2, puzzleId) {
    const puzzle = findPuzzle(state2, puzzleId);
    if (!puzzle) return { ok: false, error: "\u041D\u0435\u0442 \u0442\u0430\u043A\u043E\u0439 \u0437\u0430\u0433\u0430\u0434\u043A\u0438" };
    const idx = ALL_PUZZLES.findIndex((p) => p.id === puzzleId);
    if (idx >= 0 && !puzzleAvailable(state2, idx)) {
      return { ok: false, error: "\u0417\u0430\u0433\u0430\u0434\u043A\u0430 \u0435\u0449\u0451 \u043D\u0435 \u043E\u0442\u043A\u0440\u044B\u0442\u0430" };
    }
    if (state2.puzzlesDone[puzzleId]) return { ok: false, error: "\u0423\u0436\u0435 \u0440\u0435\u0448\u0435\u043D\u0430" };
    const price = skipPuzzlePrice(puzzle);
    if (state2.coins < price) return { ok: false, error: "\u041D\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 \u043C\u043E\u043D\u0435\u0442", price };
    state2.coins -= price;
    state2.puzzlesDone[puzzleId] = { moves: 0, hintsUsed: 0, skipped: true, at: Date.now() };
    state2.stats.puzzlesSolved += 1;
    const coins = (puzzle.rewards || []).find((r) => r.type === "coins");
    const consolation = Math.round((coins?.amount || 30) / 3);
    addCoins(state2, consolation);
    return { ok: true, price, consolation };
  }
  var CAT_LINES = [
    "\u041C\u0440\u0440\u0440\u2026 \u043A\u043E\u0442 \u0443\u0440\u0447\u0438\u0442, \u043A\u0430\u043A \u043C\u0430\u043B\u0435\u043D\u044C\u043A\u0438\u0439 \u043E\u0447\u0430\u0433.",
    "\u041A\u043E\u0442 \u043F\u043E\u0442\u044F\u043D\u0443\u043B\u0441\u044F \u0438 \u043F\u0440\u0438\u0436\u0430\u043B\u0441\u044F \u0433\u043E\u043B\u043E\u0432\u043E\u0439 \u043A \u043B\u0430\u0434\u043E\u043D\u0438.",
    "\u0423\u0440-\u0440-\u0440-\u0440\u2026 \u0443\u0441\u044B \u0434\u0440\u043E\u0436\u0430\u0442 \u043E\u0442 \u0443\u0434\u043E\u0432\u043E\u043B\u044C\u0441\u0442\u0432\u0438\u044F.",
    "\u041A\u043E\u0442 \u043F\u0435\u0440\u0435\u0432\u0435\u0440\u043D\u0443\u043B\u0441\u044F \u043D\u0430 \u0441\u043F\u0438\u043D\u0443 \u2014 \u044D\u0442\u043E \u0432\u044B\u0441\u0448\u0435\u0435 \u0434\u043E\u0432\u0435\u0440\u0438\u0435.",
    "\u0422\u0438\u0445\u0438\u0439 \xAB\u043C\u044F\u0443\xBB \u0432 \u043E\u0442\u0432\u0435\u0442. \u041F\u043E\u043B\u043A\u0438 \u043C\u0443\u0440\u043B\u044B\u0447\u0443\u0442 \u0432 \u0442\u0430\u043A\u0442."
  ];
  function petTheCat(state2) {
    state2.stats.catPets = (state2.stats.catPets || 0) + 1;
    const line = CAT_LINES[state2.stats.catPets % CAT_LINES.length];
    journalPush(state2, "\u{1F408}", line);
    let gift = 0;
    if (state2.lastCatGift !== todayKey()) {
      state2.lastCatGift = todayKey();
      gift = 2;
      addCoins(state2, gift);
      journalPush(state2, "\u{1F408}", "\u041A\u043E\u0442 \u0447\u0442\u043E-\u0442\u043E \u043D\u0430\u043A\u043E\u043F\u0430\u043B \u0437\u0430 \u043F\u0440\u0438\u043B\u0430\u0432\u043A\u043E\u043C: +2 \u043C\u043E\u043D\u0435\u0442\u044B!");
    }
    return { pets: state2.stats.catPets, line, gift };
  }
  function dayHash(str) {
    let h = 2166136261;
    for (const c of str) h = Math.imul(h ^ c.codePointAt(0), 16777619);
    return h >>> 0;
  }
  function todayKey() {
    return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  }
  function dailyPuzzle(state2) {
    const open = ALL_PUZZLES.filter((p, i) => !state2.puzzlesDone[p.id] && puzzleAvailable(state2, i));
    const pool = open.length > 0 ? open.slice(0, 6) : ALL_PUZZLES.slice(-6);
    return pool[dayHash(todayKey()) % pool.length];
  }
  function isDailyPuzzle(state2, puzzleId) {
    return dailyPuzzle(state2).id === puzzleId;
  }
  function currentSeason() {
    const m = (/* @__PURE__ */ new Date()).getMonth();
    return m < 2 || m === 11 ? "winter" : m < 5 ? "spring" : m < 8 ? "summer" : "autumn";
  }
  var SEASON_LABEL2 = {
    winter: "\u0417\u0438\u043C\u0430 \u2744\uFE0F",
    spring: "\u0412\u0435\u0441\u043D\u0430 \u{1F338}",
    summer: "\u041B\u0435\u0442\u043E \u2728",
    autumn: "\u041E\u0441\u0435\u043D\u044C \u{1F342}"
  };
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
    return BATTLES.find((b) => !b.wanted && !state2.battlesDone[b.id] && battleAvailable(state2, b.id)) || null;
  }
  function battleAvailable(state2, battleId) {
    const b = BATTLE_BY_ID[battleId];
    if (!b) return false;
    return b.unlockAfter === null || !!state2.battlesDone[b.unlockAfter];
  }
  function runBattle(state2, battleId, seed = 1) {
    const battle = BATTLE_BY_ID[battleId];
    if (!battle || !battleAvailable(state2, battleId)) return null;
    return runFormationBattle(state2, battle, seed);
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
  var CHEATS = {
    "\u041A\u041E\u0422\u041E\u041F\u0401\u0421": (state2) => {
      addCoins(state2, 1e3);
      return "+1000 \u043C\u043E\u043D\u0435\u0442. \u041A\u043E\u0442 \u0438 \u043F\u0451\u0441 \u0434\u043E\u0432\u043E\u043B\u044C\u043D\u044B.";
    },
    "\u0417\u041E\u041B\u041E\u0422\u0410\u042F\u041B\u0410\u0412\u041A\u0410": (state2) => {
      addCoins(state2, 1e4);
      return "+10000 \u043C\u043E\u043D\u0435\u0442. \u041F\u0440\u0438\u043B\u0430\u0432\u043E\u043A \u043F\u0440\u043E\u0433\u0438\u0431\u0430\u0435\u0442\u0441\u044F!";
    },
    "\u041F\u0415\u0427\u0410\u041B\u042C": (state2) => {
      state2.seals += 10;
      return "+10 \u043F\u0435\u0447\u0430\u0442\u0435\u0439 \u043C\u0430\u0441\u0442\u0435\u0440\u0430. \u041D\u0435 \u043F\u0435\u0447\u0430\u043B\u044C\u0441\u044F.";
    },
    "\u041A\u041E\u041B\u0414\u041E\u0412\u0421\u0422\u0412\u041E": (state2) => {
      for (const m of MATERIALS) {
        state2.materials[m.id] = (state2.materials[m.id] || 0) + 10;
      }
      return "\u0412\u0441\u0435 \u043C\u0430\u0442\u0435\u0440\u0438\u0430\u043B\u044B \xD710. \u0421\u043A\u043B\u0430\u0434 \u043B\u043E\u043C\u0438\u0442\u0441\u044F.";
    },
    "\u0420\u042B\u0426\u0410\u0420\u042C": (state2) => {
      const set = [
        "wpn_firebird_quill",
        "shd_tower",
        "hlm_page_wanderer",
        "arm_ink_cloak",
        "glv_smithee",
        "bt_quiet_step",
        "amu_pages",
        "rng_duelist",
        "rng_contents"
      ];
      for (const id of set) state2.inventory.push(id);
      return "\u041B\u0435\u0433\u0435\u043D\u0434\u0430\u0440\u043D\u044B\u0439 \u043A\u043E\u043C\u043F\u043B\u0435\u043A\u0442 \u2014 \u0432 \u0441\u0443\u043D\u0434\u0443\u043A\u0435. \u041D\u0430\u0434\u0435\u043D\u044C \u0441 \u0447\u0435\u0441\u0442\u044C\u044E.";
    },
    "\u041E\u0411\u0423\u0427\u0415\u041D\u0418\u0415": (state2) => {
      state2.tutorial = {};
      state2.tutorialSkipped = false;
      return "\u041E\u0431\u0443\u0447\u0435\u043D\u0438\u0435 \u0441\u0431\u0440\u043E\u0448\u0435\u043D\u043E. \u041A\u043E\u0442-\u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u0441\u043D\u043E\u0432\u0430 \u0432\u0441\u0451 \u043F\u043E\u043A\u0430\u0436\u0435\u0442.";
    },
    "\u041F\u0410\u0423\u0427\u041E\u041A": (state2) => {
      state2.cheats.spiderHat = !state2.cheats.spiderHat;
      return state2.cheats.spiderHat ? "\u041F\u0430\u0443\u0447\u043E\u043A \u043D\u0430\u0434\u0435\u043B \u043F\u0440\u0430\u0437\u0434\u043D\u0438\u0447\u043D\u0443\u044E \u0448\u043B\u044F\u043F\u0443 \u{1F3A9}" : "\u041F\u0430\u0443\u0447\u043E\u043A \u0441\u043D\u044F\u043B \u0448\u043B\u044F\u043F\u0443.";
    }
  };
  function applyCheat(state2, rawCode) {
    const code = (rawCode || "").trim().toUpperCase().replaceAll(" ", "");
    if (!code) return { ok: false, message: "\u041F\u0443\u0441\u0442\u043E. \u041A\u043E\u0442 \u043D\u0435\u0434\u043E\u0443\u043C\u0451\u043D\u043D\u043E \u043C\u043E\u0440\u0433\u043D\u0443\u043B." };
    if (!CHEATS[code]) {
      return { ok: false, message: "\u041C\u044F\u0443? \u0422\u0430\u043A\u043E\u0433\u043E \u0437\u0430\u043A\u043B\u0438\u043D\u0430\u043D\u0438\u044F \u043B\u0430\u0432\u043A\u0430 \u043D\u0435 \u0437\u043D\u0430\u0435\u0442." };
    }
    const message = CHEATS[code](state2);
    if (!state2.cheats.used.includes(code)) state2.cheats.used.push(code);
    return { ok: true, message };
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
      const migrated = migrate(data);
      migrateSeekOverrides(migrated, s);
      return migrated;
    } catch {
      return null;
    }
  }
  function moveFormationSlot(state2, unitKey, slot) {
    if (slot < 0 || slot > 5) return false;
    const current = state2.formation[unitKey];
    const otherKey = Object.keys(state2.formation).find((k) => k !== unitKey && state2.formation[k] === slot);
    if (otherKey) state2.formation[otherKey] = current;
    state2.formation[unitKey] = slot;
    return true;
  }
  function runFormationBattle(state2, battle, seed) {
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
    const consumables = state2.settings.useBeltItems === false ? [] : state2.consumableBelt.map((id) => ITEM_BY_ID[id]).filter(Boolean).map((item2) => ({ itemId: item2.id, name: item2.name, effect: item2.effect }));
    const knight = makeFormationKnight(stats, traits, consumables, state2.formation.knight ?? 1);
    const allies = [knight];
    state2.squadMercs.forEach((id, i) => {
      const key = `merc${i}`;
      const slot = state2.formation[key] ?? (i === 0 ? 0 : 5);
      allies.push(makeFormationMerc(MERC_BY_ID[id], slot, i + 1));
    });
    const entries = battle.enemies.map((e) => typeof e === "string" ? { id: e, scale: 1 } : e);
    const slots = enemyFormationSlots(battle.enemies);
    const foes = entries.map((e, i) => makeFormationEnemy(e.id, e.scale, slots[i], i));
    const initialFormation = {
      allies: allies.map((a) => ({ uid: a.uid, slot: a.slot, cell: [...a.cell] })),
      foes: foes.map((f) => ({ uid: f.uid, slot: f.slot, cell: [...f.cell] }))
    };
    const result = simulateFormationBattle(allies, foes, seed, state2.settings.tactic || "balance");
    const usedIds = knight.potions.filter((p) => p.used).map((p) => p.itemId);
    for (const used of usedIds) {
      const i = state2.consumableBelt.indexOf(used);
      if (i >= 0) state2.consumableBelt.splice(i, 1);
    }
    let rewards = [];
    if (result.victory) {
      const firstTime = !state2.battlesDone[battle.id];
      state2.battlesDone[battle.id] = {
        victories: (state2.battlesDone[battle.id]?.victories || 0) + 1,
        at: Date.now()
      };
      state2.stats.battlesWon += 1;
      journalPush(state2, "\u2694\uFE0F", `\u041F\u043E\u0445\u043E\u0434 \xAB${battle.name}\xBB \u2014 \u043F\u043E\u0431\u0435\u0434\u0430! \u0420\u044B\u0446\u0430\u0440\u044C \u0432\u0435\u0440\u043D\u0443\u043B\u0441\u044F \u0441 \u0442\u0440\u043E\u0444\u0435\u044F\u043C\u0438.`);
      for (const entry of battle.enemies) {
        const enemyId = typeof entry === "string" ? entry : entry.id;
        const scale = typeof entry === "string" ? 1 : entry.scale || 1;
        const def = enemyReward(enemyId, stats, seed);
        for (const r of def) {
          if (r.type === "coins") r.amount = Math.round(r.amount * scale);
          rewards.push(r);
        }
      }
      grantRewards(state2, rewards, {});
      if (traits.includes("heal_after_battle")) {
        rewards.push({ type: "note", text: "\u0410\u043C\u0443\u043B\u0435\u0442 \u043E\u0447\u0430\u0433\u0430 \u0441\u043E\u0433\u0440\u0435\u043B \u0440\u044B\u0446\u0430\u0440\u044F \u043F\u043E\u0441\u043B\u0435 \u0431\u043E\u044F." });
      }
      if (!firstTime) rewards = rewards.map((r) => r.type === "coins" ? { ...r, amount: Math.round(r.amount * 0.5) } : r);
    }
    return {
      ...result,
      rewards,
      battle,
      formation: initialFormation
      // начальные клетки (не конец боя!)
    };
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
  function hasUnseenIn(state2, shopKey) {
    const unseen = new Set(unseenShopItems(state2).map((i) => i.id));
    return itemsForShop(state2, shopKey, shopStock(state2)).some((i) => unseen.has(i.id));
  }
  var CHATTER = {
    cmp_firefly: ["\u2728 \u0421\u0432\u0435\u0442\u043B\u044F\u0447\u043E\u043A \u043A\u0440\u0443\u0436\u0438\u0442 \u043D\u0430\u0434 \u043F\u043E\u043B\u043A\u0430\u043C\u0438: \xAB\u0422\u0443\u0442 \u043A\u0440\u0430\u0441\u0438\u0432\u043E!\xBB", "\u2728 \u0421\u0432\u0435\u0442\u043B\u044F\u0447\u043E\u043A \u043F\u043E\u0434\u0441\u0432\u0435\u0447\u0438\u0432\u0430\u0435\u0442 \u0441\u0430\u043C\u043E\u0435 \u0442\u0451\u043C\u043D\u043E\u0435 \u043C\u0435\u0441\u0442\u043E."],
    cmp_herbalist: ["\u{1F33F} \u0422\u0440\u0430\u0432\u043D\u0438\u0446\u0430 \u0441\u0443\u0448\u0438\u0442 \u043D\u043E\u0432\u044B\u0439 \u0441\u0431\u043E\u0440 \u043D\u0430\u0434 \u043E\u0447\u0430\u0433\u043E\u043C.", "\u{1F33F} \xAB\u041A \u043A\u043E\u0442\u043B\u0443 \u0431\u044B \u043C\u044F\u0442\u044B\u2026\xBB \u2014 \u0442\u0440\u0430\u0432\u043D\u0438\u0446\u0430 \u0437\u0430\u0433\u043B\u044F\u0434\u044B\u0432\u0430\u0435\u0442 \u0432 \u0447\u0430\u0439\u043D\u0438\u043A."],
    cmp_cat: ["\u{1F408} \u041A\u043E\u0442-\u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u043E\u0431\u0445\u043E\u0434\u0438\u0442 \u043F\u043E\u043B\u043A\u0438 \u2014 \u0432\u0441\u0451 \u043D\u0430 \u043C\u0435\u0441\u0442\u0435.", "\u{1F408} \u041A\u043E\u0442 \u0447\u0442\u043E-\u0442\u043E \u0443\u0440\u043E\u043D\u0438\u043B \u0438 \u0434\u0435\u043B\u0430\u0435\u0442 \u0432\u0438\u0434, \u0447\u0442\u043E \u0442\u0430\u043A \u0438 \u0431\u044B\u043B\u043E."],
    cmp_smith: ["\u2692\uFE0F \u041A\u0443\u0437\u043D\u0435\u0446-\u043F\u043E\u0434\u043C\u0430\u0441\u0442\u0435\u0440\u044C\u0435 \u0442\u043E\u0447\u0438\u0442 \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442 \u0443 \u043E\u043A\u043D\u0430.", "\u2692\uFE0F \xAB\u0411\u0440\u043E\u043D\u044E \u0431\u044B \u043F\u043E\u0434\u0442\u044F\u043D\u0443\u0442\u044C\xBB \u2014 \u0431\u043E\u0440\u043C\u043E\u0447\u0435\u0442 \u043A\u0443\u0437\u043D\u0435\u0446."],
    pet_puppy: ["\u{1F415} \u0429\u0435\u043D\u043E\u043A \u043F\u0440\u0438\u043D\u0451\u0441 \u043F\u0430\u043B\u043A\u0443. \u041E\u0447\u0435\u043D\u044C \u0432\u0430\u0436\u043D\u0443\u044E \u043F\u0430\u043B\u043A\u0443.", "\u{1F415} \u0429\u0435\u043D\u043E\u043A \u0432\u0438\u043B\u044F\u0435\u0442 \u0445\u0432\u043E\u0441\u0442\u043E\u043C \u0432\u0441\u0435\u0439 \u043B\u0430\u0432\u043A\u0435."],
    pet_hedgehog: ["\u{1F994} \u0401\u0436\u0438\u043A \u0441\u0432\u0435\u0440\u043D\u0443\u043B\u0441\u044F \u0432 \u0442\u0430\u043F\u043A\u0435. \u042D\u0442\u043E \u0435\u0433\u043E \u0442\u0430\u043F\u043E\u043A \u0442\u0435\u043F\u0435\u0440\u044C.", "\u{1F994} \u0401\u0436\u0438\u043A \u0444\u044B\u0440\u043A\u0430\u0435\u0442 \u043D\u0430 \u0431\u0443\u0445\u0430\u043D\u043A\u0443."],
    pet_fox: ["\u{1F98A} \u041B\u0438\u0441\u0451\u043D\u043E\u043A \u043F\u0440\u0438\u043C\u0435\u0440\u044F\u0435\u0442 \u0442\u0432\u043E\u0451 \u0448\u043B\u044F\u043F\u043D\u043E\u0435 \u043C\u0435\u0441\u0442\u043E \u0443 \u043A\u0430\u0441\u0441\u044B.", "\u{1F98A} \u041B\u0438\u0441\u0451\u043D\u043E\u043A \u0447\u0442\u043E-\u0442\u043E \u043F\u0440\u044F\u0447\u0435\u0442 \u0437\u0430 \u043F\u0440\u0438\u043B\u0430\u0432\u043A\u043E\u043C."],
    pet_horse: ["\u{1F434} \u0421\u0438\u0432\u043A\u0430 \u0444\u044B\u0440\u043A\u0430\u0435\u0442 \u0443 \u0434\u0432\u0435\u0440\u0438 \u2014 \u0441\u043A\u0443\u0447\u0430\u0435\u0442 \u043F\u043E \u0434\u043E\u0440\u043E\u0433\u0435.", "\u{1F434} \u0421\u0438\u0432\u043A\u0430 \u043E\u0431\u0433\u043B\u0430\u0434\u044B\u0432\u0430\u0435\u0442 \u0432\u0435\u043D\u0438\u043A. \u0425\u043E\u0440\u043E\u0448\u0438\u0439 \u0431\u044B\u043B \u0432\u0435\u043D\u0438\u043A."],
    pet_owl: ["\u{1F989} \u0421\u043E\u0432\u0430 \u0441\u0447\u0438\u0442\u0430\u0435\u0442 \u0432\u0441\u043B\u0443\u0445 \u043E\u0441\u0442\u0430\u0442\u043A\u0438 \u043D\u0430 \u043F\u043E\u043B\u043A\u0430\u0445. \u0421\u0431\u0438\u0432\u0430\u0435\u0442\u0441\u044F.", "\u{1F989} \u0421\u043E\u0432\u0430 \u043E\u0434\u043E\u0431\u0440\u0438\u0442\u0435\u043B\u044C\u043D\u043E \u0443\u0445\u0430\u0435\u0442 \u043D\u043E\u0432\u043E\u043C\u0443 \u043F\u043E\u0440\u044F\u0434\u043A\u0443."]
  };
  function pickChatter(state2) {
    const active = [...state2.squadCompanions || [], state2.pet].filter(Boolean);
    const pool = active.flatMap((id) => CHATTER[id] || []);
    if (pool.length === 0) return null;
    const speaker = active[Math.floor(Math.random() * active.length)];
    const lines = CHATTER[speaker];
    return lines[Math.floor(Math.random() * lines.length)];
  }
  function renderHub(container, ctx2, params = {}) {
    const { state: state2 } = ctx2;
    const solved = Object.keys(state2.puzzlesDone).length;
    const won = Object.keys(state2.battlesDone).length;
    const firstPurchaseDone = (state2.stats.itemsBought || 0) > 0;
    function rerender(scene2) {
      ctx2.setHubScene?.(scene2);
      container.innerHTML = "";
      renderHub(container, ctx2, { scene: scene2 });
    }
    const SCENES = {
      lavka: {
        candidates: ["assets/hub_banner_web.jpg", "assets/hub_banner.jfif", "assets/hub_banner.png", "assets/hub_banner.svg"],
        alt: "\u041B\u0430\u0432\u043A\u0430 \u043D\u0430 \u043F\u0435\u0440\u0435\u043A\u0440\u0451\u0441\u0442\u043A\u0435 \u043C\u0438\u0440\u043E\u0432",
        // Хотспоты: [icon, label, screen, x%, y%, showDot]
        hotspots: [
          ["\u{1F4DA}", "\u0413\u043E\u043B\u043E\u0432\u043E\u043B\u043E\u043C\u043A\u0438", "puzzles", 10, 42, () => solved === 0],
          ["\u{1FA99}", "\u041F\u0440\u0438\u043B\u0430\u0432\u043E\u043A", "shop", 43, 55, () => false],
          ["\u{1F6E1}\uFE0F", "\u041A\u043E\u043C\u043D\u0430\u0442\u0430 \u0440\u044B\u0446\u0430\u0440\u044F", "equip", 68, 50, () => false],
          ["\u{1F306}", "\u041D\u0430 \u043F\u043B\u043E\u0449\u0430\u0434\u044C", "@square", 77, 52, () => false],
          ["\u{1FA9F}", "\u0412 \u043F\u043E\u0445\u043E\u0434", "battles", 93, 45, () => firstPurchaseDone && won === 0]
        ]
      },
      square: {
        candidates: ["assets/town_square_web.jpg", "assets/seek_town_web.jpg"],
        alt: "\u0413\u043E\u0440\u043E\u0434\u0441\u043A\u0430\u044F \u043F\u043B\u043E\u0449\u0430\u0434\u044C",
        hotspots: [
          ["\u{1F37A}", "\u0422\u0430\u0432\u0435\u0440\u043D\u0430", "tavern", 79, 60, () => false],
          ["\u2692\uFE0F", "\u041A\u0443\u0437\u043D\u0438\u0446\u0430 \u0438 \u043A\u043E\u0442\u0451\u043B", "craft", 39, 58, () => false],
          ["\u{1F6E0}\uFE0F", "\u041C\u0430\u0441\u0442\u0435\u0440\u0441\u043A\u0430\u044F", "workshop", 53, 68, () => false],
          ["\u{1F4CC}", "\u0414\u043E\u0441\u043A\u0430 \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0439", "board", 7, 59, () => false],
          ["\u{1F3EE}", "\u0412 \u043B\u0430\u0432\u043A\u0443", "@lavka", 17, 50, () => false],
          ["\u{1F3EC}", "\u0422\u043E\u0440\u0433\u043E\u0432\u044B\u0439 \u043A\u0432\u0430\u0440\u0442\u0430\u043B", "@market", 58, 38, () => ["armory", "armorer", "magic", "alchemy"].some((k) => hasUnseenIn(state2, k))]
        ]
      },
      market: {
        candidates: ["assets/town_market_web.jpg", "assets/town_market.jfif", "assets/town_square_web.jpg"],
        alt: "\u0422\u043E\u0440\u0433\u043E\u0432\u044B\u0439 \u043A\u0432\u0430\u0440\u0442\u0430\u043B",
        hotspots: [
          ["\u{1F5E1}\uFE0F", "\u041E\u0440\u0443\u0436\u0435\u0439\u043D\u0438\u043A", "shopArmory", 7, 60, () => hasUnseenIn(state2, "armory")],
          ["\u{1F6E1}\uFE0F", "\u0411\u0440\u043E\u043D\u043D\u0438\u043A", "shopArmorer", 35, 60, () => hasUnseenIn(state2, "armorer")],
          ["\u{1F52E}", "\u041C\u0430\u0433", "shopMagic", 63, 62, () => hasUnseenIn(state2, "magic")],
          ["\u{1F9EA}", "\u0410\u043B\u0445\u0438\u043C\u0438\u043A", "shopAlchemy", 80, 60, () => hasUnseenIn(state2, "alchemy")],
          ["\u{1F307}", "\u041D\u0430 \u043F\u043B\u043E\u0449\u0430\u0434\u044C", "@square", 52, 60, () => false]
        ]
      }
    };
    const sceneId = params.scene || "lavka";
    const scene = SCENES[sceneId] || SCENES.lavka;
    const scenePanel = document.createElement("div");
    scenePanel.className = "panel hub-picture";
    scenePanel.style.padding = "0";
    scenePanel.style.overflow = "hidden";
    const picture = document.createElement("img");
    picture.className = "hub-scene";
    picture.alt = scene.alt;
    let candidateIdx = 0;
    picture.addEventListener("error", () => {
      candidateIdx += 1;
      if (candidateIdx < scene.candidates.length) picture.src = scene.candidates[candidateIdx];
      else picture.remove();
    });
    picture.src = scene.candidates[0];
    scenePanel.appendChild(picture);
    container.appendChild(scenePanel);
    const hotspotEls = {};
    for (const [icon, label, screen, x, y, dot] of scene.hotspots) {
      const b = document.createElement("button");
      b.className = "hotspot";
      b.style.left = `${x}%`;
      b.style.top = `${y}%`;
      b.setAttribute("aria-label", label);
      b.innerHTML = `<span class="hs-icon">${icon}</span><span class="hs-label">${label}</span>${dot() ? '<span class="hs-dot"></span>' : ""}`;
      b.addEventListener("click", () => {
        ctx2.sfx?.("tap");
        b.classList.add("zap");
        setTimeout(() => {
          if (screen === "@square") rerender("square");
          else if (screen === "@lavka") rerender("lavka");
          else if (screen === "@market") rerender("market");
          else ctx2.go(screen);
        }, 150);
      });
      scenePanel.appendChild(b);
      hotspotEls[screen] = b;
    }
    const progress = document.createElement("div");
    progress.className = "muted center mt";
    progress.style.fontSize = "14px";
    const season = SEASON_LABEL2[currentSeason()];
    const cosIcons = (state2.cosmeticsActive || []).length ? ` \xB7 \u0423\u043A\u0440\u0430\u0448\u0435\u043D\u0438\u044F: ${(state2.cosmeticsActive || []).map((id) => ({ cos_carpet: "\u{1F7E5}", cos_crest: "\u{1FAA7}", cos_flowers: "\u{1F338}", cos_fireflies: "\u2728", cos_garland: "\u{1F38F}", cos_snow: "\u2744\uFE0F" })[id] || "\u{1F380}").join(" ")}` : "";
    progress.innerHTML = `\u{1F9E9} \u0417\u0430\u0433\u0430\u0434\u043E\u043A \u0440\u0435\u0448\u0435\u043D\u043E: <b>${solved}/${ALL_PUZZLES.length}</b> \xB7 \u2694\uFE0F \u041F\u043E\u0445\u043E\u0434\u043E\u0432 \u043F\u0440\u043E\u0439\u0434\u0435\u043D\u043E: <b>${won}/${BATTLES.length}</b> \xB7 \u{1F43E} \u041A\u043E\u043C\u0430\u043D\u0434\u0430: <b>${(state2.crew || []).length}</b> \xB7 ${season}${cosIcons}`;
    container.appendChild(progress);
    function petCat(btn) {
      ctx2.sfx?.("purr");
      const r = petTheCat(state2);
      ctx2.save();
      const rect = btn.getBoundingClientRect();
      for (let i = 0; i < 4; i++) {
        const heart = document.createElement("div");
        heart.className = "cat-heart";
        heart.textContent = ["\u2764\uFE0F", "\u{1F9E1}", "\u{1F49B}"][i % 3];
        heart.style.left = `${rect.left + rect.width / 2 + (i - 1.5) * 16}px`;
        heart.style.top = `${rect.top + window.scrollY}px`;
        heart.style.animationDelay = `${i * 0.08}s`;
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1200);
      }
      ctx2.toast(r.gift > 0 ? `${r.line} ${"\u{1FA99}+2!"}` : r.line);
      rerender(sceneId);
    }
    const PET_SPOTS = {
      pet_hedgehog: { scene: "square", x: 30, y: 82, size: 62 },
      pet_fox: { scene: "lavka", x: 34, y: 75, size: 90 },
      pet_puppy: { scene: "lavka", x: 87, y: 88, size: 92, flip: true },
      pet_owl: { scene: "lavka", x: 55, y: 65, size: 64 },
      pet_horse: { scene: "square", x: 90, y: 90, size: 130 }
    };
    for (const [petId, spot] of Object.entries(PET_SPOTS)) {
      if (spot.scene !== sceneId || !(state2.crew || []).includes(petId) || !PET_BY_ID[petId]) continue;
      const def = PET_BY_ID[petId];
      const isActive = state2.pet === petId;
      const el = document.createElement("div");
      el.className = `hub-pet${isActive ? " active" : ""}`;
      el.style.left = `${spot.x}%`;
      el.style.top = `${spot.y}%`;
      el.title = isActive ? `${def.name} \u2014 \u0438\u0434\u0451\u0442 \u0441 \u0442\u043E\u0431\u043E\u0439 \u0432 \u043F\u043E\u0445\u043E\u0434\u044B` : def.name;
      const img = document.createElement("img");
      img.src = `assets/pets/${petId}.webp`;
      img.alt = def.name;
      img.style.width = `${spot.size}px`;
      if (spot.flip) img.style.transform = "scaleX(-1)";
      img.addEventListener("error", () => {
        img.remove();
        el.textContent = def.icon;
        el.style.fontSize = `${Math.round(spot.size * 0.7)}px`;
      });
      el.appendChild(img);
      el.addEventListener("click", () => {
        ctx2.sfx?.("tap");
        const lines = CHATTER[petId] || [def.name];
        ctx2.toast(lines[Math.floor(Math.random() * lines.length)]);
      });
      scenePanel.appendChild(el);
    }
    const CREW_SPOTS = [
      { id: "cmp_cat", icon: "\u{1F408}", name: "\u041A\u043E\u0442-\u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u2014 \u043F\u043E\u0433\u043B\u0430\u0434\u0438\u0442\u044C", scene: "lavka", x: 30, y: 97, size: 145, pet: true },
      { id: "cmp_firefly", scene: "lavka", x: 47, y: 15, size: 46 },
      { id: "cmp_herbalist", scene: "lavka", x: 19, y: 97, size: 145 },
      { id: "cmp_smith", scene: "square", x: 45, y: 86, size: 50 }
    ];
    for (const spot of CREW_SPOTS) {
      const owned = spot.always || (state2.crew || []).includes(spot.id);
      if (spot.scene !== sceneId || !owned) continue;
      const def = COMPANION_BY_ID[spot.id];
      const name = spot.name || def?.name || spot.id;
      const icon = spot.icon || def?.icon || "\u{1F43E}";
      const el = document.createElement("div");
      el.className = "hub-pet";
      el.style.left = `${spot.x}%`;
      el.style.top = `${spot.y}%`;
      el.title = name;
      const img = document.createElement("img");
      img.src = `assets/crew/${spot.id}.webp`;
      img.alt = name;
      img.style.width = `${spot.size}px`;
      if (spot.flip) img.style.transform = "scaleX(-1)";
      img.addEventListener("error", () => {
        img.remove();
        el.textContent = icon;
        el.style.fontSize = `${Math.round(spot.size * 0.7)}px`;
      });
      el.appendChild(img);
      el.addEventListener("click", () => {
        if (spot.pet) {
          petCat(el);
          return;
        }
        ctx2.sfx?.("tap");
        const lines = CHATTER[spot.id] || [name];
        ctx2.toast(lines[Math.floor(Math.random() * lines.length)]);
      });
      scenePanel.appendChild(el);
    }
    const fx = (cls, style, content) => {
      const e = document.createElement("div");
      e.className = `cos-fx ${cls}`;
      e.style.cssText = style;
      if (content) e.innerHTML = content;
      scenePanel.appendChild(e);
    };
    const fxImg = (id, style, stub, rot) => {
      const img = document.createElement("img");
      img.className = "cos-fx cos-img";
      img.style.cssText = style + (rot ? `;transform:rotate(${rot}deg)` : "");
      img.alt = "";
      img.addEventListener("error", () => {
        if (img.src.endsWith(".webp")) {
          img.src = `assets/cosmetics/${id}.png`;
          return;
        }
        img.remove();
        stub?.();
      });
      img.src = `assets/cosmetics/${id}.webp`;
      scenePanel.appendChild(img);
      return img;
    };
    if (sceneId === "lavka") {
      const cos = new Set(state2.cosmeticsActive || []);
      if (cos.has("cos_carpet")) {
        fxImg("cos_carpet", "left:52%;top:74%;width:30%", () => fx("cos-carpet", "left:36%;top:78%;width:26%;height:16%"), 10);
      }
      if (cos.has("cos_crest")) {
        fxImg("cos_crest", "left:71%;top:9%;width:85px", () => fx("cos-crest", "left:38%;top:4%", "\u041B\u0430\u0432\u043A\u0430 \u043D\u0430 \u043F\u0435\u0440\u0435\u043A\u0440\u0451\u0441\u0442\u043A\u0435 \u043C\u0438\u0440\u043E\u0432"), -4);
      }
      if (cos.has("cos_flowers")) {
        const spots = [
          ["left:8%;top:26%;width:80px", () => fx("sway", "left:11%;top:33%;font-size:26px", "\u{1F338}")],
          ["left:20%;top:56%;width:64px", () => fx("sway", "left:22%;top:60%;font-size:22px;animation-delay:.5s", "\u{1F337}")],
          ["left:60%;top:38%;width:72px", () => fx("sway", "left:63%;top:44%;font-size:24px;animation-delay:1s", "\u{1F33C}")]
        ];
        for (const [style, stub] of spots) {
          fxImg("cos_flowers", style + ";animation:fx-sway 3.6s ease-in-out infinite alternate", stub);
        }
      }
      if (cos.has("cos_fireflies")) {
        fxImg("cos_fireflies", "left:38%;top:34%;width:150px;animation:fx-float 5s ease-in-out infinite alternate", () => {
          for (let i = 0; i < 5; i++) fx("firefly", `left:${35 + i * 7}%;top:${38 + i % 3 * 8}%;animation-delay:${i * 0.7}s`);
        });
      }
      if (cos.has("cos_garland")) {
        fxImg("cos_garland", "left:12%;top:2%;width:58%;animation:fx-sway 4s ease-in-out infinite alternate;transform-origin:top center", () => fx("sway", "left:12%;top:3%;width:60%;font-size:20px;letter-spacing:12px", "\u{1F38F}\u{1F342}\u{1F38F}\u{1F342}\u{1F38F}\u{1F342}\u{1F38F}"));
      }
      if (cos.has("cos_snow")) {
        fxImg("cos_snow", "left:87%;top:28%;width:11%", () => {
          for (let i = 0; i < 8; i++) fx("snowflake", `left:${86 + i % 4 * 3.5}%;top:${28 + i * 6}%;animation-delay:${i * 0.5}s`, "\u2744");
        });
      }
      for (let i = 0; i < 6; i++) fx("dust", `left:${20 + i * 12}%;top:${22 + i % 3 * 14}%;animation-delay:${i * 0.9}s`);
    }
    if (sceneId === "square") {
      for (let i = 0; i < 3; i++) fx("smokepuff", `left:${33 + i}%;top:16%;animation-delay:${i * 1.3}s`);
    }
    const chatter = pickChatter(state2);
    const journal = (state2.journal || []).slice(-2).reverse();
    if (chatter || journal.length > 0) {
      const catPanel = document.createElement("div");
      catPanel.className = "panel cat-panel";
      catPanel.innerHTML = '<span class="cat-icon">\u{1F408}</span>';
      const body = document.createElement("div");
      body.style.flex = "1";
      if (chatter) {
        const line = document.createElement("div");
        line.className = "cat-line";
        line.innerHTML = chatter;
        body.appendChild(line);
      }
      for (const j of journal) {
        const entry = document.createElement("div");
        entry.className = "cat-entry";
        entry.innerHTML = `${j.icon} ${j.text}`;
        body.appendChild(entry);
      }
      catPanel.appendChild(body);
      container.appendChild(catPanel);
    }
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
    if (sceneId === "lavka") {
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
          text: "\u0420\u044B\u0446\u0430\u0440\u044C \u0441\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044F \u0441\u0430\u043C \u2014 \u0442\u0432\u043E\u044F \u0437\u0430\u0431\u043E\u0442\u0430 \u0432 \u0442\u043E\u043C, \u0447\u0435\u043C \u043E\u043D \u043E\u0434\u0435\u0442 \u0438 \u043A\u0442\u043E \u0441 \u043D\u0438\u043C. \u0410 \u0437\u0430 \u043E\u043A\u043D\u043E\u043C \u2014 \u043F\u043B\u043E\u0449\u0430\u0434\u044C \u0441 \u0442\u0430\u0432\u0435\u0440\u043D\u043E\u0439 \u0438 \u043A\u0443\u0437\u043D\u0438\u0446\u0435\u0439. \u041D\u0430\u0447\u043D\u0438 \u0441 \u043F\u0435\u0440\u0432\u043E\u0439 \u0437\u0430\u0433\u0430\u0434\u043A\u0438!",
          cta: "\u041A \u0437\u0430\u0433\u0430\u0434\u043A\u0430\u043C!"
        }
      ]);
    }
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
  function moveItem(state2, itemId, x, y) {
    const from = state2.placement[itemId];
    if (!from) return placeItem(state2, itemId, x, y);
    if (from[0] === x && from[1] === y) return { ok: true, noop: true };
    const cell = shelfCells(state2.level).find((c) => c.pos[0] === x && c.pos[1] === y);
    if (!cell) return { ok: false, error: "\u0421\u044E\u0434\u0430 \u043D\u0435 \u043F\u043E\u0441\u0442\u0430\u0432\u0438\u0442\u044C" };
    const occupant = cellOf(state2, x, y);
    if (occupant && occupant !== itemId) {
      state2.history.push({ swap: [itemId, occupant], prevA: from, prevB: state2.placement[occupant] });
      state2.placement[occupant] = from;
      state2.placement[itemId] = [x, y];
      state2.moves += 1;
      return { ok: true, swapped: occupant };
    }
    state2.history.push({ itemId, prev: from });
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
    if (last.swap) {
      state2.placement[last.swap[0]] = last.prevA;
      state2.placement[last.swap[1]] = last.prevB;
    } else {
      state2.placement[last.itemId] = last.prev;
    }
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

  // src/ui/common.js
  function puzzleSkipButton(ctx2, level, onSkipped) {
    const price = skipPuzzlePrice(level);
    const b = document.createElement("button");
    b.className = "ghost small";
    b.innerHTML = `\u23ED\uFE0F \u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u0437\u0430 \u{1FA99}${price}`;
    b.title = "\u041A\u043E\u0442-\u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u043F\u043E\u0434\u0441\u043A\u0430\u0436\u0435\u0442 \u0440\u0435\u0448\u0435\u043D\u0438\u0435 \u0441\u043E\u0441\u0435\u0434\u044F\u043C (\u043D\u0430\u0433\u0440\u0430\u0434\u044B \u0443\u0440\u043E\u0432\u043D\u044F \u043D\u0435 \u0431\u0443\u0434\u0435\u0442)";
    b.addEventListener("click", () => {
      if (!confirm(`\u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C \xAB${level.name}\xBB \u0437\u0430 ${price} \u043C\u043E\u043D\u0435\u0442? \u041D\u0430\u0433\u0440\u0430\u0434\u044B \u0443\u0440\u043E\u0432\u043D\u044F \u043D\u0435 \u0431\u0443\u0434\u0435\u0442.`)) return;
      const r = skipPuzzle(ctx2.state, level.id);
      if (r.ok) {
        ctx2.sfx?.("coin");
        ctx2.toast(`\u0417\u0430\u0433\u0430\u0434\u043A\u0430 \u043F\u0440\u043E\u043F\u0443\u0449\u0435\u043D\u0430. \u0423\u0442\u0435\u0448\u0435\u043D\u0438\u0435 \u043E\u0442 \u043A\u043E\u0442\u0430: \u{1FA99}${r.consolation}`);
        ctx2.save();
        onSkipped?.();
      } else {
        ctx2.toast(r.error);
      }
    });
    return b;
  }
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
        ctx2.go(it.screen, it.params || {});
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
  function renderShelfPuzzle(container, ctx2, level) {
    const CELL8 = Math.max(80, Math.min(120, Math.floor(500 / level.grid[0])));
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
    canvas.width = gw * CELL8 * dpr;
    canvas.height = gh * CELL8 * dpr;
    canvas.style.width = `${gw * CELL8}px`;
    canvas.style.height = `${gh * CELL8}px`;
    canvas.style.maxWidth = "100%";
    canvas.style.touchAction = "none";
    canvasBox.appendChild(canvas);
    const leftCol = document.createElement("div");
    leftCol.style.cssText = "display:flex;flex-direction:column;gap:10px;flex:0 1 auto;min-width:0";
    leftCol.appendChild(canvasBox);
    const trayPanel = document.createElement("div");
    trayPanel.className = "panel";
    trayPanel.style.padding = "10px 14px";
    const trayLabel = document.createElement("div");
    trayLabel.className = "muted";
    trayLabel.textContent = "\u0422\u043E\u0432\u0430\u0440\u044B: \u0442\u0430\u043F\u043D\u0438, \u0437\u0430\u0442\u0435\u043C \u043A\u043B\u0435\u0442\u043A\u0443 \u2014 \u0438\u043B\u0438 \u043F\u0440\u043E\u0441\u0442\u043E \u043F\u0435\u0440\u0435\u0442\u0430\u0449\u0438 \u043D\u0430 \u043F\u043E\u043B\u043A\u0443";
    trayLabel.style.fontSize = "13px";
    trayLabel.style.marginBottom = "8px";
    trayPanel.appendChild(trayLabel);
    const tray = document.createElement("div");
    tray.style.display = "flex";
    tray.style.flexWrap = "wrap";
    tray.style.gap = "10px";
    trayPanel.appendChild(tray);
    leftCol.appendChild(trayPanel);
    wrap.appendChild(leftCol);
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
    const controls = document.createElement("div");
    controls.className = "puzzle-controls";
    controls.style.marginTop = "10px";
    const btnUndo = mkBtn("\u21A9\uFE0F \u041E\u0442\u043C\u0435\u043D\u0430 (Z)", doUndo);
    const btnHint = mkBtn("\u{1F4A1} \u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430 (H)", doHint);
    const btnReset = mkBtn("\u{1F504} \u0421\u0431\u0440\u043E\u0441 (R)", doReset);
    controls.append(btnUndo, btnHint, btnReset);
    controls.appendChild(puzzleSkipButton(ctx2, level, () => ctx2.go("puzzles")));
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
      const x = Math.floor((ev.clientX - rect.left) * scale / CELL8);
      const y = Math.floor((ev.clientY - rect.top) * scale / CELL8);
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
    let drag = null;
    function cellFromEvent(ev) {
      const rect = canvas.getBoundingClientRect();
      const scale = canvas.width / dpr / rect.width;
      const x = Math.floor((ev.clientX - rect.left) * scale / CELL8);
      const y = Math.floor((ev.clientY - rect.top) * scale / CELL8);
      return x >= 0 && y >= 0 && x < level.grid[0] && y < level.grid[1] ? [x, y] : null;
    }
    function startPotentialDrag(ev, itemId) {
      if (finished) return;
      drag = { itemId, startX: ev.clientX, startY: ev.clientY, active: false, ghost: null, hover: null };
    }
    function activateDrag(ev) {
      const it = level.items.find((i) => i.id === drag.itemId);
      if (!it) return;
      const ghost = document.createElement("div");
      ghost.className = "drag-ghost";
      ghost.textContent = it.icon;
      document.body.appendChild(ghost);
      drag.ghost = ghost;
      drag.active = true;
      selectedItem = null;
      ctx2.sfx?.("tap");
    }
    function onPointerMove(ev) {
      if (!drag) return;
      if (!drag.active) {
        const dist = Math.hypot(ev.clientX - drag.startX, ev.clientY - drag.startY);
        if (dist > 8) activateDrag(ev);
        else return;
      }
      drag.ghost.style.transform = `translate(${ev.clientX - 24}px, ${ev.clientY - 24}px)`;
      const cell = cellFromEvent(ev);
      const key = cell ? cell.join(",") : null;
      if ((drag.hover ? drag.hover.join(",") : null) !== key) {
        drag.hover = cell;
        draw();
      }
    }
    function onPointerUp(ev) {
      if (!drag) return;
      const wasActive = drag.active;
      const itemId = drag.itemId;
      const cell = drag.hover;
      if (drag.ghost) drag.ghost.remove();
      drag = null;
      if (!wasActive) return;
      const trayRect = tray.getBoundingClientRect();
      const overTray = ev.clientX >= trayRect.left && ev.clientX <= trayRect.right && ev.clientY >= trayRect.top && ev.clientY <= trayRect.bottom;
      if (cell) {
        const r = moveItem(puzzle, itemId, cell[0], cell[1]);
        if (r.ok) {
          hintMark = null;
          ctx2.sfx?.("rotate");
          draw();
          if (isShelfSolved(puzzle)) finish();
        } else {
          ctx2.toast(r.error);
          draw();
        }
      } else if (overTray && puzzle.placement[itemId]) {
        removeItem(puzzle, itemId);
        hintMark = null;
        ctx2.sfx?.("tap");
        draw();
      } else {
        draw();
      }
    }
    canvas.addEventListener("pointerdown", (ev) => {
      if (finished) return;
      const cell = cellFromEvent(ev);
      if (cell) {
        const occupantId = Object.entries(puzzle.placement).find(([, pos]) => pos && pos[0] === cell[0] && pos[1] === cell[1])?.[0];
        if (occupantId) {
          startPotentialDrag(ev, occupantId);
          return;
        }
      }
      onTap(ev);
    });
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
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
      g.clearRect(0, 0, gw * CELL8, gh * CELL8);
      for (let y = 0; y < gh; y++) {
        for (let x = 0; x < gw; x++) {
          g.fillStyle = (x + y) % 2 === 0 ? "#4a4038" : "#524840";
          g.fillRect(x * CELL8, y * CELL8, CELL8, CELL8);
        }
      }
      for (const c of level.cells) {
        const px = c.pos[0] * CELL8;
        const py = c.pos[1] * CELL8;
        if (c.kind === "shelf") {
          g.fillStyle = "#6b5335";
          g.fillRect(px + 3, py + 3, CELL8 - 6, CELL8 - 6);
          g.fillStyle = "#7d6444";
          g.fillRect(px + 3, py + 3, CELL8 - 6, 8);
        } else if (c.kind === "light") {
          g.fillStyle = "#6b5335";
          g.fillRect(px + 3, py + 3, CELL8 - 6, CELL8 - 6);
          const grad = g.createRadialGradient(
            px + CELL8 / 2,
            py + CELL8 / 2,
            4,
            px + CELL8 / 2,
            py + CELL8 / 2,
            CELL8 / 2
          );
          grad.addColorStop(0, "rgba(255, 226, 138, 0.5)");
          grad.addColorStop(1, "rgba(255, 226, 138, 0.05)");
          g.fillStyle = grad;
          g.fillRect(px, py, CELL8, CELL8);
          g.font = `${CELL8 * 0.22}px sans-serif`;
          g.textAlign = "right";
          g.textBaseline = "top";
          g.fillText("\u2600\uFE0F", px + CELL8 - 4, py + 4);
        } else {
          g.fillStyle = "#33291f";
          g.fillRect(px + 3, py + 3, CELL8 - 6, CELL8 - 6);
        }
      }
      if (drag?.active && drag.hover) {
        g.strokeStyle = "rgba(255, 202, 122, 0.95)";
        g.lineWidth = 3;
        g.setLineDash([7, 5]);
        g.strokeRect(drag.hover[0] * CELL8 + 4, drag.hover[1] * CELL8 + 4, CELL8 - 8, CELL8 - 8);
        g.setLineDash([]);
      }
      const v = violations(puzzle);
      const badItems = new Set(v.flatMap((x) => [x.itemA, x.itemB]).filter(Boolean));
      for (const [itemId, pos] of Object.entries(puzzle.placement)) {
        if (!pos) continue;
        const it = level.items.find((i) => i.id === itemId);
        const cx = pos[0] * CELL8 + CELL8 / 2;
        const cy = pos[1] * CELL8 + CELL8 / 2;
        if (badItems.has(itemId)) {
          g.fillStyle = "rgba(232, 138, 122, 0.3)";
          g.fillRect(pos[0] * CELL8 + 3, pos[1] * CELL8 + 3, CELL8 - 6, CELL8 - 6);
        }
        if (hintMark && hintMark.itemId === itemId) {
          g.fillStyle = "rgba(255, 202, 122, 0.35)";
          g.beginPath();
          g.arc(cx, cy, CELL8 * 0.46, 0, Math.PI * 2);
          g.fill();
        }
        g.font = `${CELL8 * 0.55}px "Segoe UI Emoji", sans-serif`;
        g.textAlign = "center";
        g.textBaseline = "middle";
        if (drag?.active && drag.itemId === itemId) g.globalAlpha = 0.3;
        g.fillText(it?.icon || "\u{1F381}", cx, cy);
        g.globalAlpha = 1;
      }
      if (hintMark && hintMark.pos && !badItems.size) {
        const [hx, hy] = hintMark.pos;
        const occupant = Object.values(puzzle.placement).some((p) => p && p[0] === hx && p[1] === hy);
        if (!occupant) {
          g.strokeStyle = "rgba(255, 202, 122, 0.8)";
          g.lineWidth = 3;
          g.setLineDash([6, 4]);
          g.strokeRect(hx * CELL8 + 5, hy * CELL8 + 5, CELL8 - 10, CELL8 - 10);
          g.setLineDash([]);
        }
      }
      tray.innerHTML = "";
      for (const it of level.items) {
        if (puzzle.placement[it.id]) continue;
        const b = document.createElement("button");
        b.className = "small" + (selectedItem === it.id ? " primary" : "");
        b.style.fontSize = "16px";
        b.style.padding = "8px 12px";
        b.innerHTML = `${it.icon} ${it.name}`;
        b.title = it.tags.join(", ");
        b.addEventListener("pointerdown", (ev) => startPotentialDrag(ev, it.id));
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
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      if (drag?.ghost) drag.ghost.remove();
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
  var CELL = 60;
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
    controls.appendChild(puzzleSkipButton(ctx2, level, () => ctx2.go("puzzles")));
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
      const x = Math.floor((ev.clientX - rect.left) * scale / CELL);
      const y = Math.floor((ev.clientY - rect.top) * scale / CELL);
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
      g.clearRect(0, 0, gw * CELL, gh * CELL);
      g.fillStyle = "#4d4231";
      g.fillRect(0, 0, gw * CELL, gh * CELL);
      const correct = /* @__PURE__ */ new Set();
      for (let i = 0; i < level.phrase.length; i++) {
        if (puzzle.letters[i] === level.phrase[i]) correct.add(i);
      }
      for (const [bx, by] of level.blots || []) {
        g.font = `${CELL * 0.6}px "Segoe UI Emoji", sans-serif`;
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillText("\u{1FADF}", bx * CELL + CELL / 2, by * CELL + CELL / 2);
      }
      path.forEach(([x, y], i) => {
        const px = x * CELL;
        const py = y * CELL;
        const letter = puzzle.letters[i];
        const isFixed = letter === "\u2726";
        g.fillStyle = isFixed ? "#3a3226" : correct.has(i) ? "#5d6b3f" : "#6b5a3d";
        g.fillRect(px + 3, py + 3, CELL - 6, CELL - 6);
        if (selected === i || hintPair && (hintPair.i === i || hintPair.j === i)) {
          g.strokeStyle = "#ffca7a";
          g.lineWidth = 3;
          g.strokeRect(px + 3, py + 3, CELL - 6, CELL - 6);
        }
        g.font = `${isFixed ? CELL * 0.4 : CELL * 0.55}px "Segoe UI Emoji", serif`;
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillStyle = isFixed ? "#ffca7a" : "#f3e6cf";
        g.fillText(letter, px + CELL / 2, py + CELL / 2 + 2);
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
      // ключи "groupId:spotIndex"
      misses: 0,
      moves: 0
    };
  }
  function spotKey(group, index) {
    return `${group.id}:${index}`;
  }
  function seekTap(state2, x, y) {
    state2.moves += 1;
    const matches = [];
    for (const group of state2.level.groups) {
      for (let i = 0; i < group.spots.length; i++) {
        const s = group.spots[i];
        const dx = x - s.x;
        const dy = y - s.y;
        if (dx * dx + dy * dy > s.r * s.r) continue;
        matches.push({ group, spotIndex: i, spot: s, found: state2.found.has(spotKey(group, i)) });
      }
    }
    if (matches.length === 0) return { result: "empty" };
    const fresh = matches.find((m) => !m.found);
    if (!fresh) return { result: "already", ...matches[0] };
    state2.found.add(spotKey(fresh.group, fresh.spotIndex));
    return { result: "found", ...fresh };
  }
  function groupProgress(state2, group) {
    const found = group.spots.filter((_, i) => state2.found.has(spotKey(group, i))).length;
    return { found, total: group.spots.length };
  }
  function seekProgress(state2) {
    let found = 0;
    let total = 0;
    const groups = state2.level.groups.map((g) => {
      const p = groupProgress(state2, g);
      found += p.found;
      total += p.total;
      return { id: g.id, label: g.label, ...p };
    });
    return { found, total, groups };
  }
  function isSeekSolved(state2) {
    const p = seekProgress(state2);
    return p.found === p.total;
  }
  function seekHint(state2) {
    for (const group of state2.level.groups) {
      for (let i = 0; i < group.spots.length; i++) {
        if (state2.found.has(spotKey(group, i))) continue;
        const s = group.spots[i];
        return { type: "point", x: s.x, y: s.y, label: group.label, id: group.id };
      }
    }
    return { type: "already" };
  }
  function validateSeekLevel(level) {
    const problems = [];
    const [W, H] = level.sceneSize || [1e3, 650];
    if (!level.groups || level.groups.length === 0) problems.push("\u043D\u0435\u0442 \u0433\u0440\u0443\u043F\u043F \u0446\u0435\u043B\u0435\u0439");
    const ids = /* @__PURE__ */ new Set();
    for (const g of level.groups || []) {
      if (ids.has(g.id)) problems.push(`\u0434\u0443\u0431\u043B\u044C id \u0433\u0440\u0443\u043F\u043F\u044B ${g.id}`);
      ids.add(g.id);
      if (!g.label) problems.push(`\u0443 \u0433\u0440\u0443\u043F\u043F\u044B ${g.id} \u043D\u0435\u0442 label`);
      if (!g.spots || g.spots.length === 0) problems.push(`\u0443 \u0433\u0440\u0443\u043F\u043F\u044B ${g.id} \u043D\u0435\u0442 \u0441\u043F\u043E\u0442\u043E\u0432`);
      for (const s of g.spots || []) {
        if (s.x < 0 || s.x > W || s.y < 0 || s.y > H) problems.push(`\u0441\u043F\u043E\u0442 ${g.id} \u0432\u043D\u0435 \u0441\u0446\u0435\u043D\u044B`);
        if (!(s.r >= 12 && s.r <= 120)) problems.push(`\u0441\u043F\u043E\u0442 ${g.id}: \u0441\u0442\u0440\u0430\u043D\u043D\u044B\u0439 \u0440\u0430\u0434\u0438\u0443\u0441 ${s.r}`);
      }
    }
    const all = [];
    for (const g of level.groups || []) {
      for (const s of g.spots || []) all.push({ g: g.id, ...s });
    }
    for (let i = 0; i < all.length; i++) {
      for (let j = i + 1; j < all.length; j++) {
        if (all[i].g === all[j].g) continue;
        const d = Math.hypot(all[i].x - all[j].x, all[i].y - all[j].y);
        if (d < (all[i].r + all[j].r) * 0.5) {
          problems.push(`\u0441\u043F\u043E\u0442\u044B ${all[i].g} \u0438 ${all[j].g} \u043F\u0435\u0440\u0435\u043A\u0440\u044B\u0432\u0430\u044E\u0442\u0441\u044F`);
        }
      }
    }
    return { ok: problems.length === 0, problems };
  }

  // src/ui/seekView.js
  function renderSeekPuzzle(container, ctx2, rawLevel) {
    const level = applySeekOverrides(ctx2.state, rawLevel);
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
    controls.appendChild(puzzleSkipButton(ctx2, level, () => ctx2.go("puzzles")));
    const btnEdit = mkBtn("\u270F\uFE0F", () => ctx2.go("seekeditor", { id: rawLevel.id }));
    btnEdit.classList.add("ghost");
    btnEdit.title = "\u041F\u0440\u0430\u0432\u0438\u0442\u044C \u043E\u0431\u043B\u0430\u0441\u0442\u0438 \u043F\u043E\u0438\u0441\u043A\u0430";
    controls.appendChild(btnEdit);
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
        const gp = groupProgress(puzzle, r.group);
        ctx2.toast(gp.found === gp.total ? `\u0412\u0441\u0435 \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u044B: ${r.group.label}!` : `${r.group.label}: ${gp.found} \u0438\u0437 ${gp.total}!`);
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
      for (const group of level.groups) {
        group.spots.forEach((s, i) => {
          const isFound = puzzle.found.has(`${group.id}:${i}`);
          if (isFound) {
            g.strokeStyle = "rgba(143, 209, 139, 0.9)";
            g.lineWidth = 4;
            g.beginPath();
            g.arc(s.x, s.y, s.r * 0.9, 0, Math.PI * 2);
            g.stroke();
            g.fillStyle = "rgba(143, 209, 139, 0.95)";
            g.font = "bold 20px sans-serif";
            g.textAlign = "center";
            g.textBaseline = "middle";
            g.shadowColor = "rgba(0,0,0,0.6)";
            g.shadowBlur = 4;
            g.fillText("\u2713", s.x, s.y);
            g.shadowBlur = 0;
          }
          if (hintSpot && Math.hypot(s.x - hintSpot.x, s.y - hintSpot.y) < 1) {
            g.strokeStyle = "rgba(255, 226, 138, 0.95)";
            g.lineWidth = 4;
            g.setLineDash([8, 6]);
            g.beginPath();
            g.arc(s.x, s.y, s.r * 1.2, 0, Math.PI * 2);
            g.stroke();
            g.setLineDash([]);
          }
        });
      }
      if (missFlash) {
        g.fillStyle = "rgba(232, 138, 122, 0.35)";
        g.beginPath();
        g.arc(missFlash.x, missFlash.y, 26, 0, Math.PI * 2);
        g.fill();
      }
      targetList.innerHTML = "";
      const pr = seekProgress(puzzle);
      for (const g2 of pr.groups) {
        const done = g2.found === g2.total;
        const row = document.createElement("div");
        row.innerHTML = `${done ? "\u2705" : "\u{1F50D}"} ${g2.label} \u2014 <b>${g2.found} \u0438\u0437 ${g2.total}</b>`;
        row.style.cssText = `font-size:15px;${done ? "opacity:0.6;text-decoration:line-through" : ""}`;
        targetList.appendChild(row);
      }
      statusEl.innerHTML = `\u{1F50D} \u0412\u0441\u0435\u0433\u043E \u043D\u0430\u0439\u0434\u0435\u043D\u043E: <b>${pr.found} \u0438\u0437 ${pr.total}</b> &nbsp; <span class="muted">\u043F\u0440\u043E\u043C\u0430\u0445\u0438: ${puzzle.misses}</span><div class="muted" style="font-size:13px">\u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0438: ${hintsUsed}</div>`;
    }
    draw();
    return () => {
      window.removeEventListener("keydown", onKey);
      canvas.removeEventListener("pointerdown", onTap);
    };
  }

  // src/core/pathPuzzle.js
  var SIDES = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  function connections(type, rot) {
    switch (type) {
      case "straight":
        return rot % 2 === 0 ? [0, 2] : [1, 3];
      case "corner": {
        const m = [[0, 1], [1, 2], [2, 3], [3, 0]];
        return m[rot % 4];
      }
      case "tee": {
        return [0, 1, 2, 3].filter((s) => s !== (rot + 3) % 4);
      }
      case "start":
      case "end":
        return [rot % 4];
      // одна открытая сторона
      default:
        return [];
    }
  }
  function createPathPuzzle(level) {
    return {
      level,
      rot: Object.fromEntries(
        level.tiles.map((t, i) => [i, t.rot ?? 0]).filter(([, r], i) => level.tiles[i].type !== "beast")
      ),
      history: [],
      moves: 0
    };
  }
  function rotateTile(state2, tileIndex) {
    const t = state2.level.tiles[tileIndex];
    if (!t || t.type === "beast") return false;
    if (t.fixed) return false;
    state2.history.push({ tileIndex, prev: state2.rot[tileIndex] });
    state2.rot[tileIndex] = (state2.rot[tileIndex] + 1) % 4;
    state2.moves += 1;
    return true;
  }
  function undoPath(state2) {
    const last = state2.history.pop();
    if (!last) return false;
    state2.rot[last.tileIndex] = last.prev;
    state2.moves += 1;
    return true;
  }
  function resetPath(state2) {
    for (const [idx] of Object.entries(state2.rot)) {
      state2.rot[idx] = state2.level.tiles[idx].rot ?? 0;
    }
    state2.history = [];
    state2.moves += 1;
  }
  function tracePath(state2) {
    const { level } = state2;
    const [w] = level.grid;
    const at = /* @__PURE__ */ new Map();
    level.tiles.forEach((t, i) => at.set(t.pos[0] + "," + t.pos[1], i));
    const startIdx = level.tiles.findIndex((t) => t.type === "start");
    const endIdx = level.tiles.findIndex((t) => t.type === "end");
    const reached = /* @__PURE__ */ new Set();
    if (startIdx < 0 || endIdx < 0) return { solved: false, reached };
    const queue = [startIdx];
    reached.add(startIdx);
    while (queue.length > 0) {
      const i = queue.shift();
      const t = level.tiles[i];
      const conns = t.type === "beast" ? [] : connections(t.type, state2.rot[i] ?? t.rot ?? 0);
      for (const side of conns) {
        const [dx, dy] = SIDES[side];
        const nx = t.pos[0] + dx;
        const ny = t.pos[1] + dy;
        const j = at.get(`${nx},${ny}`);
        if (j === void 0 || reached.has(j)) continue;
        const nt = level.tiles[j];
        if (nt.type === "beast") continue;
        const opp = (side + 2) % 4;
        const nconns = connections(nt.type, state2.rot[j] ?? nt.rot ?? 0);
        if (nconns.includes(opp)) {
          reached.add(j);
          queue.push(j);
        }
      }
    }
    return { solved: reached.has(endIdx), reached };
  }
  function isPathSolved(state2) {
    return tracePath(state2).solved;
  }
  function solvePath(level, maxSolutions = 32) {
    const rotatable = level.tiles.map((t, i) => ({ t, i })).filter(({ t }) => t.type !== "beast" && !t.fixed && (t.type === "straight" || t.type === "corner" || t.type === "tee" || t.type === "end"));
    const variants = rotatable.map(({ t }) => t.type === "straight" ? [0, 1] : [0, 1, 2, 3]);
    const solutions = [];
    const assign = new Array(rotatable.length).fill(0);
    function bt(k) {
      if (solutions.length >= maxSolutions) return;
      if (k === rotatable.length) {
        const s = createPathPuzzle(level);
        rotatable.forEach(({ i }, k2) => {
          s.rot[i] = variants[k2][assign[k2]];
        });
        if (isPathSolved(s)) solutions.push([...assign]);
        return;
      }
      for (let v = 0; v < variants[k].length; v++) {
        assign[k] = v;
        bt(k + 1);
      }
    }
    bt(0);
    return { count: solutions.length, solutions, rotatable: rotatable.map((r) => r.i) };
  }
  function pathHint(state2) {
    const { level } = state2;
    const { count, solutions, rotatable } = solvePath(level, 64);
    if (count === 0) return { type: "unsolvable" };
    let best = null;
    let bestDist = Infinity;
    const variants = rotatable.map((i) => {
      const t = level.tiles[i];
      return t.type === "straight" ? [0, 1] : [0, 1, 2, 3];
    });
    for (const sol of solutions) {
      let dist = 0;
      rotatable.forEach((idx, k2) => {
        if (state2.rot[idx] !== variants[k2][sol[k2]]) dist++;
      });
      if (dist < bestDist) {
        bestDist = dist;
        best = sol;
      }
    }
    if (bestDist === 0) return { type: "already" };
    const k = rotatable.findIndex((idx, k2) => state2.rot[idx] !== variants[k2][best[k2]]);
    return { type: "rotate", tileIndex: rotatable[k] };
  }

  // src/ui/pathView.js
  var CELL2 = 72;
  function renderPathPuzzle(container, ctx2, level) {
    const puzzle = createPathPuzzle(level);
    let hintsUsed = 0;
    let hintTile = null;
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
    const legend = document.createElement("div");
    legend.className = "panel mt";
    legend.innerHTML = `<div class="desc" style="line-height:1.9">
    \u{1F3E0} \u0434\u043E\u043C\u0438\u043A \u043A\u0443\u0440\u044C\u0435\u0440\u0430 \u2192 \u{1F333} \u0441\u0442\u0430\u0440\u044B\u0439 \u0434\u0443\u0431<br>
    \u0422\u0430\u043F \u043F\u043E \u043F\u043B\u0438\u0442\u043A\u0435 \u2014 \u043F\u043E\u0432\u0435\u0440\u043D\u0443\u0442\u044C \u0435\u0451<br>
    \u{1F417} \u0441\u043F\u044F\u0449\u0438\u0439 \u0437\u0432\u0435\u0440\u044C \u2014 \u0442\u0443\u0434\u0430 \u043D\u0435\u043B\u044C\u0437\u044F<br>
    \u0422\u0451\u043F\u043B\u044B\u0439 \u0441\u043B\u0435\u0434 \u2014 \u0442\u0440\u043E\u043F\u0438\u043D\u043A\u0430, \u0447\u0442\u043E \u0443\u0436\u0435 \u0432\u0435\u0434\u0451\u0442 \u043E\u0442 \u0434\u043E\u043C\u0438\u043A\u0430</div>`;
    side.appendChild(legend);
    const controls = document.createElement("div");
    controls.className = "puzzle-controls";
    const btnUndo = mkBtn("\u21A9\uFE0F \u041E\u0442\u043C\u0435\u043D\u0430 (Z)", doUndo);
    const btnHint = mkBtn("\u{1F4A1} \u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430 (H)", doHint);
    const btnReset = mkBtn("\u{1F504} \u0421\u0431\u0440\u043E\u0441 (R)", doReset);
    controls.append(btnUndo, btnHint, btnReset);
    controls.appendChild(puzzleSkipButton(ctx2, level, () => ctx2.go("puzzles")));
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
      if (undoPath(puzzle)) {
        hintTile = null;
        ctx2.sfx?.("tap");
        draw();
      }
    }
    function doReset() {
      if (finished) return;
      resetPath(puzzle);
      hintTile = null;
      ctx2.sfx?.("tap");
      draw();
    }
    function doHint() {
      if (finished) return;
      const h = pathHint(puzzle);
      ctx2.sfx?.("hint");
      if (h.type === "rotate") {
        hintsUsed += 1;
        hintTile = h.tileIndex;
        ctx2.toast("\u041A\u043E\u0442-\u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u0441\u043C\u043E\u0442\u0440\u0438\u0442 \u043D\u0430 \u043E\u0434\u043D\u0443 \u0438\u0437 \u043F\u043B\u0438\u0442\u043E\u043A\u2026");
        draw();
      } else if (h.type === "already") {
        ctx2.toast("\u0422\u0440\u043E\u043F\u0438\u043D\u043A\u0430 \u0443\u0436\u0435 \u0433\u043E\u0442\u043E\u0432\u0430!");
      } else {
        ctx2.toast("\u0425\u043C, \u0442\u0443\u0442 \u043D\u0435 \u043F\u0440\u043E\u0439\u0442\u0438. \u0421\u043A\u0430\u0436\u0438 \u0445\u043E\u0437\u044F\u0438\u043D\u0443 \u043B\u0430\u0432\u043A\u0438!");
      }
    }
    function onTap(ev) {
      if (finished) return;
      const rect = canvas.getBoundingClientRect();
      const scale = canvas.width / dpr / rect.width;
      const x = Math.floor((ev.clientX - rect.left) * scale / CELL2);
      const y = Math.floor((ev.clientY - rect.top) * scale / CELL2);
      const idx = level.tiles.findIndex((t) => t.pos[0] === x && t.pos[1] === y);
      if (idx >= 0 && rotateTile(puzzle, idx)) {
        hintTile = null;
        ctx2.sfx?.("rotate");
        draw();
        if (isPathSolved(puzzle)) finish();
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
          title: "\u{1F4E6} \u041F\u043E\u0441\u044B\u043B\u043A\u0430 \u0434\u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u0430!",
          subtitle: `\xAB${level.name}\xBB \u2014 \u043A\u0443\u0440\u044C\u0435\u0440 \u0434\u043E\u0432\u043E\u043B\u0435\u043D`,
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
      const { reached } = tracePath(puzzle);
      for (let y = 0; y < gh; y++) {
        for (let x = 0; x < gw; x++) {
          g.fillStyle = (x + y) % 2 === 0 ? "#45523a" : "#4d5c40";
          g.fillRect(x * CELL2, y * CELL2, CELL2, CELL2);
        }
      }
      level.tiles.forEach((t, i) => {
        const cx = t.pos[0] * CELL2 + CELL2 / 2;
        const cy = t.pos[1] * CELL2 + CELL2 / 2;
        const onPath = reached.has(i);
        if (t.type !== "beast") {
          g.fillStyle = onPath ? "#8a6f45" : "#6b5a40";
          roundRect(g, t.pos[0] * CELL2 + 4, t.pos[1] * CELL2 + 4, CELL2 - 8, CELL2 - 8, 10);
          g.fill();
        }
        if (hintTile === i) {
          g.fillStyle = "rgba(255, 202, 122, 0.35)";
          g.beginPath();
          g.arc(cx, cy, CELL2 * 0.46, 0, Math.PI * 2);
          g.fill();
        }
        const rot = puzzle.rot[i] ?? t.rot ?? 0;
        const conns = connections(t.type, rot);
        if (conns.length > 0) {
          g.strokeStyle = onPath ? "#ffd98a" : "#4a3b28";
          g.lineCap = "round";
          g.lineWidth = onPath ? 10 : 12;
          for (const side2 of conns) {
            const [dx, dy] = SIDES[side2];
            g.beginPath();
            g.moveTo(cx, cy);
            g.lineTo(cx + dx * (CELL2 / 2 - 4), cy + dy * (CELL2 / 2 - 4));
            g.stroke();
          }
          g.fillStyle = onPath ? "#ffd98a" : "#4a3b28";
          g.beginPath();
          g.arc(cx, cy, 7, 0, Math.PI * 2);
          g.fill();
        }
        const emoji = (e, size = CELL2 * 0.5) => {
          g.font = `${size}px "Segoe UI Emoji", sans-serif`;
          g.textAlign = "center";
          g.textBaseline = "middle";
          g.fillText(e, cx, cy);
        };
        if (t.type === "start") emoji("\u{1F3E0}");
        else if (t.type === "end") emoji("\u{1F333}");
        else if (t.type === "beast") emoji("\u{1F417}", CELL2 * 0.45);
      });
      const solvedNow = isPathSolved(puzzle);
      statusEl.innerHTML = (solvedNow ? "\u2705 <b>\u0422\u0440\u043E\u043F\u0438\u043D\u043A\u0430 \u0433\u043E\u0442\u043E\u0432\u0430!</b>" : `\u{1F97E} \u0421\u043B\u0435\u0434 \u043E\u0442 \u0434\u043E\u043C\u0438\u043A\u0430: <b>${reached.size}</b> \u043F\u043B\u0438\u0442\u043E\u043A`) + `<div class="muted" style="font-size:13px">\u0425\u043E\u0434\u044B: ${puzzle.moves} \xB7 \u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0438: ${hintsUsed}</div>`;
    }
    function roundRect(g, x, y, w, h, r) {
      g.beginPath();
      g.moveTo(x + r, y);
      g.arcTo(x + w, y, x + w, y + h, r);
      g.arcTo(x + w, y + h, x, y + h, r);
      g.arcTo(x, y + h, x, y, r);
      g.arcTo(x, y, x + w, y, r);
      g.closePath();
    }
    draw();
    return () => {
      window.removeEventListener("keydown", onKey);
      canvas.removeEventListener("pointerdown", onTap);
    };
  }

  // src/core/teaPuzzle.js
  function createTeaPuzzle(level) {
    return {
      level,
      color: { r: 0, g: 0, b: 0 },
      heat: 0,
      used: {},
      // ingredientId -> count
      history: [],
      moves: 0
    };
  }
  function clamp100(v) {
    return Math.max(0, Math.min(100, v));
  }
  function addIngredient(state2, ingredientId) {
    const ing = state2.level.ingredients.find((i) => i.id === ingredientId);
    if (!ing) return { ok: false, error: "\u041D\u0435\u0442 \u0442\u0430\u043A\u043E\u0433\u043E \u0438\u043D\u0433\u0440\u0435\u0434\u0438\u0435\u043D\u0442\u0430" };
    const usedCount = state2.used[ingredientId] || 0;
    if (usedCount >= ing.uses) return { ok: false, error: "\u0417\u0430\u043A\u043E\u043D\u0447\u0438\u043B\u0441\u044F" };
    state2.history.push({
      ingredientId,
      prev: { color: { ...state2.color }, heat: state2.heat, usedCount }
    });
    state2.color = {
      r: clamp100(state2.color.r + ing.dr),
      g: clamp100(state2.color.g + ing.dg),
      b: clamp100(state2.color.b + ing.db)
    };
    state2.heat = clamp100(state2.heat + ing.heat);
    state2.used[ingredientId] = usedCount + 1;
    state2.moves += 1;
    return { ok: true };
  }
  function undoTea(state2) {
    const last = state2.history.pop();
    if (!last) return false;
    state2.color = last.prev.color;
    state2.heat = last.prev.heat;
    state2.used[last.ingredientId] = last.prev.usedCount;
    state2.moves += 1;
    return true;
  }
  function resetTea(state2) {
    state2.color = { r: 0, g: 0, b: 0 };
    state2.heat = 0;
    state2.used = {};
    state2.history = [];
    state2.moves += 1;
  }
  function teaStatus(state2) {
    const { level } = state2;
    const t = level.target;
    const tol = level.tolerance;
    const diffs = {
      r: Math.abs(state2.color.r - t.r),
      g: Math.abs(state2.color.g - t.g),
      b: Math.abs(state2.color.b - t.b)
    };
    const colorOk = diffs.r <= tol && diffs.g <= tol && diffs.b <= tol;
    const overheated = state2.heat > level.maxHeat;
    return {
      colorOk,
      overheated,
      diffs,
      solved: colorOk && !overheated,
      heat: state2.heat,
      maxHeat: level.maxHeat
    };
  }
  function isTeaSolved(state2) {
    return teaStatus(state2).solved;
  }
  function solveTea(level) {
    const ings = level.ingredients;
    const solutions = [];
    const assign = new Array(ings.length).fill(0);
    function evalCombo() {
      const color = { r: 0, g: 0, b: 0 };
      let heat = 0;
      ings.forEach((ing, i) => {
        const n = assign[i];
        color.r = clamp100(color.r + ing.dr * n);
        color.g = clamp100(color.g + ing.dg * n);
        color.b = clamp100(color.b + ing.db * n);
        heat = clamp100(heat + ing.heat * n);
      });
      const t = level.target;
      const ok = Math.abs(color.r - t.r) <= level.tolerance && Math.abs(color.g - t.g) <= level.tolerance && Math.abs(color.b - t.b) <= level.tolerance && heat <= level.maxHeat;
      if (ok) solutions.push({ counts: [...assign], heat });
    }
    function bt(k) {
      if (solutions.length >= 64) return;
      if (k === ings.length) {
        evalCombo();
        return;
      }
      for (let n = 0; n <= ings[k].uses; n++) {
        assign[k] = n;
        bt(k + 1);
      }
    }
    bt(0);
    return { count: solutions.length, solutions };
  }
  function teaHint(state2) {
    const { level } = state2;
    const { count, solutions } = solveTea(level);
    if (count === 0) return { type: "unsolvable" };
    let best = null;
    let bestCost = Infinity;
    for (const sol of solutions) {
      let cost = 0;
      let feasible = true;
      level.ingredients.forEach((ing2, i2) => {
        const used = state2.used[ing2.id] || 0;
        if (used > sol.counts[i2]) feasible = false;
        else cost += sol.counts[i2] - used;
      });
      if (feasible && cost < bestCost) {
        bestCost = cost;
        best = sol;
      }
    }
    if (!best) return { type: "reset", text: "\u0422\u0430\u043A \u0434\u0435\u043B\u043E \u043D\u0435 \u043F\u043E\u0439\u0434\u0451\u0442 \u2014 \u043A\u043E\u0442\u0451\u043B \u043F\u0440\u0438\u0434\u0451\u0442\u0441\u044F \u043E\u0441\u0432\u0435\u0436\u0438\u0442\u044C (\u0441\u0431\u0440\u043E\u0441)." };
    if (bestCost === 0) return { type: "already" };
    const i = level.ingredients.findIndex((ing2, idx) => (state2.used[ing2.id] || 0) < best.counts[idx]);
    const ing = level.ingredients[i];
    return { type: "add", ingredientId: ing.id, name: ing.name, icon: ing.icon };
  }

  // src/ui/teaView.js
  function renderTeaPuzzle(container, ctx2, level) {
    const puzzle = createTeaPuzzle(level);
    let hintsUsed = 0;
    let hintIngredient = null;
    let finished = false;
    container.appendChild(header(ctx2, level.name, `\u0421\u043B\u043E\u0436\u043D\u043E\u0441\u0442\u044C: ${"\u2605".repeat(level.difficulty)}`, "puzzles"));
    const wrap = document.createElement("div");
    wrap.className = "puzzle-wrap";
    const brewPanel = document.createElement("div");
    brewPanel.className = "panel";
    brewPanel.style.cssText = "display:flex;gap:20px;align-items:center;flex-wrap:wrap";
    brewPanel.innerHTML = '<div style="text-align:center"><div class="muted" style="font-size:12px">\u041A\u043E\u0442\u0451\u043B</div></div>';
    const potBox = document.createElement("div");
    potBox.style.cssText = "text-align:center";
    const pot = document.createElement("div");
    pot.style.cssText = `width:110px;height:110px;border-radius:50% 50% 46% 46%;
    border:6px solid #4a3a29;box-shadow:inset 0 -14px 24px rgba(0,0,0,.4), 0 6px 16px rgba(0,0,0,.4);
    transition:background .3s ease;position:relative;overflow:hidden`;
    potBox.appendChild(pot);
    const potLabel = document.createElement("div");
    potLabel.className = "muted";
    potLabel.style.fontSize = "12px";
    potLabel.textContent = "\u0446\u0432\u0435\u0442 \u043E\u0442\u0432\u0430\u0440\u0430";
    potBox.appendChild(potLabel);
    brewPanel.appendChild(potBox);
    const targetBox = document.createElement("div");
    targetBox.style.cssText = "text-align:center";
    const flask = document.createElement("div");
    flask.style.cssText = `width:64px;height:88px;border-radius:12px 12px 20px 20px;
    border:4px solid #4a3a29;box-shadow:inset 0 -10px 18px rgba(0,0,0,.35)`;
    flask.style.background = rgbCss(level.target);
    targetBox.appendChild(flask);
    const flaskLabel = document.createElement("div");
    flaskLabel.className = "muted";
    flaskLabel.style.fontSize = "12px";
    flaskLabel.textContent = "\u0437\u0430\u043A\u0430\u0437 \u043F\u0443\u0442\u043D\u0438\u043A\u0430";
    targetBox.appendChild(flaskLabel);
    brewPanel.appendChild(targetBox);
    const heatBox = document.createElement("div");
    heatBox.style.cssText = "flex:1;min-width:180px";
    heatBox.innerHTML = '<div class="muted" style="font-size:12px;margin-bottom:4px">\u0416\u0430\u0440 \u043A\u043E\u0442\u043B\u0430</div>';
    const heatBar = document.createElement("div");
    heatBar.className = "hpbar";
    heatBar.style.height = "14px";
    const heatFill = document.createElement("div");
    heatFill.style.background = "#e88a7a";
    heatBar.appendChild(heatFill);
    const heatMark = document.createElement("div");
    heatMark.className = "muted";
    heatMark.style.fontSize = "12px";
    heatBox.append(heatBar, heatMark);
    brewPanel.appendChild(heatBox);
    wrap.appendChild(brewPanel);
    const side = document.createElement("div");
    side.className = "puzzle-side";
    const intro = document.createElement("div");
    intro.className = "intro-text";
    intro.textContent = level.intro;
    side.appendChild(intro);
    const ingLabel = document.createElement("div");
    ingLabel.className = "muted";
    ingLabel.style.cssText = "font-size:13px;margin-bottom:6px";
    ingLabel.textContent = "\u0418\u043D\u0433\u0440\u0435\u0434\u0438\u0435\u043D\u0442\u044B (\u0442\u0430\u043F \u2014 \u0432 \u043A\u043E\u0442\u0451\u043B):";
    side.appendChild(ingLabel);
    const ingGrid = document.createElement("div");
    ingGrid.style.cssText = "display:flex;flex-wrap:wrap;gap:8px";
    side.appendChild(ingGrid);
    const statusEl = document.createElement("div");
    statusEl.className = "puzzle-status";
    side.appendChild(statusEl);
    const controls = document.createElement("div");
    controls.className = "puzzle-controls";
    controls.style.marginTop = "10px";
    const btnUndo = mkBtn("\u21A9\uFE0F \u041E\u0442\u043C\u0435\u043D\u0430 (Z)", doUndo);
    const btnHint = mkBtn("\u{1F4A1} \u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430 (H)", doHint);
    const btnReset = mkBtn("\u{1F504} \u0417\u0430\u043D\u043E\u0432\u043E (R)", doReset);
    controls.append(btnUndo, btnHint, btnReset);
    controls.appendChild(puzzleSkipButton(ctx2, level, () => ctx2.go("puzzles")));
    side.appendChild(controls);
    wrap.appendChild(side);
    container.appendChild(wrap);
    function mkBtn(label, fn) {
      const b = document.createElement("button");
      b.innerHTML = label;
      b.addEventListener("click", fn);
      return b;
    }
    function rgbCss(c) {
      return `rgb(${Math.round(c.r * 2.55)}, ${Math.round(c.g * 2.55)}, ${Math.round(c.b * 2.55)})`;
    }
    function doUndo() {
      if (finished) return;
      if (undoTea(puzzle)) {
        hintIngredient = null;
        ctx2.sfx?.("tap");
        draw();
      }
    }
    function doReset() {
      if (finished) return;
      resetTea(puzzle);
      hintIngredient = null;
      ctx2.sfx?.("tap");
      draw();
    }
    function doHint() {
      if (finished) return;
      const h = teaHint(puzzle);
      ctx2.sfx?.("hint");
      if (h.type === "add") {
        hintsUsed += 1;
        hintIngredient = h.ingredientId;
        ctx2.toast(`\u041A\u043E\u0442-\u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u0442\u043E\u043B\u043A\u0430\u0435\u0442 \u043D\u043E\u0441\u043E\u043C: ${h.icon} ${h.name}`);
        draw();
      } else if (h.type === "reset") {
        ctx2.toast(h.text);
      } else if (h.type === "already") {
        ctx2.toast("\u041E\u0442\u0432\u0430\u0440 \u0443\u0436\u0435 \u0438\u0434\u0435\u0430\u043B\u0435\u043D!");
      } else {
        ctx2.toast("\u0425\u043C, \u0440\u0435\u0446\u0435\u043F\u0442 \u043D\u0435 \u0441\u0445\u043E\u0434\u0438\u0442\u0441\u044F. \u0421\u043A\u0430\u0436\u0438 \u0445\u043E\u0437\u044F\u0438\u043D\u0443 \u043B\u0430\u0432\u043A\u0438!");
      }
    }
    function onAdd(ingId) {
      if (finished) return;
      const r = addIngredient(puzzle, ingId);
      if (r.ok) {
        hintIngredient = null;
        ctx2.sfx?.("potion");
        draw();
        if (isTeaSolved(puzzle)) finish();
      } else {
        ctx2.toast(r.error);
      }
    }
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
          title: "\u{1FAD6} \u041E\u0442\u0432\u0430\u0440 \u0433\u043E\u0442\u043E\u0432!",
          subtitle: `\xAB${level.name}\xBB \u2014 \u043F\u0443\u0442\u043D\u0438\u043A \u0431\u043B\u0430\u0433\u043E\u0434\u0430\u0440\u0438\u0442`,
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
      pot.style.background = rgbCss(puzzle.color);
      const st = teaStatus(puzzle);
      heatFill.style.width = `${st.heat}%`;
      heatFill.style.background = st.overheated ? "#d9432f" : "#e88a7a";
      heatMark.innerHTML = st.overheated ? '<span class="warn">\u041F\u0435\u0440\u0435\u0433\u0440\u0435\u0442! \u0422\u0430\u043A\u043E\u0439 \u043E\u0442\u0432\u0430\u0440 \u043F\u0443\u0442\u043D\u0438\u043A \u043D\u0435 \u0432\u043E\u0437\u044C\u043C\u0451\u0442.</span>' : `${st.heat}/${st.maxHeat}`;
      ingGrid.innerHTML = "";
      for (const ing of level.ingredients) {
        const left = ing.uses - (puzzle.used[ing.id] || 0);
        const b = document.createElement("button");
        b.className = "small" + (hintIngredient === ing.id ? " primary" : "");
        b.disabled = left <= 0;
        const effect = [
          ing.dr ? `R${ing.dr > 0 ? "+" : ""}${ing.dr}` : "",
          ing.dg ? `G${ing.dg > 0 ? "+" : ""}${ing.dg}` : "",
          ing.db ? `B${ing.db > 0 ? "+" : ""}${ing.db}` : "",
          ing.heat ? `\u0436\u0430\u0440${ing.heat > 0 ? "+" : ""}${ing.heat}` : ""
        ].filter(Boolean).join(" ");
        b.innerHTML = `${ing.icon} ${ing.name} <span class="badge">\xD7${left}</span>`;
        b.title = effect;
        b.addEventListener("click", () => onAdd(ing.id));
        ingGrid.appendChild(b);
      }
      const d = st.diffs;
      statusEl.innerHTML = (st.solved ? "\u2705 <b>\u0418\u0434\u0435\u0430\u043B\u044C\u043D\u044B\u0439 \u043E\u0442\u0432\u0430\u0440!</b>" : `\u{1F3AF} \u0414\u043E \u0446\u0435\u043B\u0438: <b>\xB1${Math.max(d.r, d.g, d.b)}</b> <span class="muted">(\u0434\u043E\u043F\u0443\u0441\u043A ${level.tolerance})</span>`) + `<div class="muted" style="font-size:13px">\u0425\u043E\u0434\u044B: ${puzzle.moves} \xB7 \u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0438: ${hintsUsed}</div>`;
    }
    draw();
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }

  // src/core/mechPuzzle.js
  var SIDES2 = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  function faceAt(tile, rot, side) {
    if (!Array.isArray(tile.faces)) return null;
    return tile.faces[((side - (rot ?? 0)) % 4 + 4) % 4] ?? null;
  }
  function facesMesh(a, b) {
    return a === "pin" && b === "socket" || a === "socket" && b === "pin";
  }
  function createMechPuzzle(level) {
    return {
      level,
      rot: Object.fromEntries(
        level.tiles.map((t, i) => [i, t.rot ?? 0]).filter(([i]) => level.tiles[i].type !== "blocker")
      ),
      history: [],
      moves: 0
    };
  }
  function rotateGear(state2, tileIndex) {
    const t = state2.level.tiles[tileIndex];
    if (!t || t.type !== "gear") return false;
    if (t.fixed) return false;
    state2.history.push({ tileIndex, prev: state2.rot[tileIndex] });
    state2.rot[tileIndex] = (state2.rot[tileIndex] + 1) % 4;
    state2.moves += 1;
    return true;
  }
  function undoMech(state2) {
    const last = state2.history.pop();
    if (!last) return false;
    state2.rot[last.tileIndex] = last.prev;
    state2.moves += 1;
    return true;
  }
  function resetMech(state2) {
    for (const [idx] of Object.entries(state2.rot)) {
      state2.rot[idx] = state2.level.tiles[idx].rot ?? 0;
    }
    state2.history = [];
    state2.moves += 1;
  }
  function traceMech(state2) {
    const { level } = state2;
    const at = /* @__PURE__ */ new Map();
    level.tiles.forEach((t, i) => at.set(t.pos.join(","), i));
    const startIdx = level.tiles.findIndex((t) => t.type === "start");
    const endIdx = level.tiles.findIndex((t) => t.type === "end");
    const reached = /* @__PURE__ */ new Set();
    if (startIdx < 0 || endIdx < 0) return { solved: false, reached };
    const queue = [startIdx];
    reached.add(startIdx);
    while (queue.length > 0) {
      const i = queue.shift();
      const t = level.tiles[i];
      if (t.type === "blocker") continue;
      const rotI = state2.rot[i] ?? t.rot ?? 0;
      for (let side = 0; side < 4; side++) {
        const f = faceAt(t, rotI, side);
        if (!f) continue;
        const [dx, dy] = SIDES2[side];
        const j = at.get(`${t.pos[0] + dx},${t.pos[1] + dy}`);
        if (j === void 0 || reached.has(j)) continue;
        const nt = level.tiles[j];
        if (nt.type === "blocker") continue;
        const nf = faceAt(nt, state2.rot[j] ?? nt.rot ?? 0, (side + 2) % 4);
        if (facesMesh(f, nf)) {
          reached.add(j);
          queue.push(j);
        }
      }
    }
    return { solved: reached.has(endIdx), reached };
  }
  function isMechSolved(state2) {
    return traceMech(state2).solved;
  }
  function gearVariants(tile) {
    const seen = /* @__PURE__ */ new Set();
    const out = [];
    for (let r = 0; r < 4; r++) {
      const key = [0, 1, 2, 3].map((s) => faceAt(tile, r, s) || "-").join("");
      if (!seen.has(key)) {
        seen.add(key);
        out.push(r);
      }
    }
    return out;
  }
  function solveMech(level, maxSolutions = 32) {
    const tiles = level.tiles;
    const startIdx = tiles.findIndex((t) => t.type === "start");
    const endIdx = tiles.findIndex((t) => t.type === "end");
    if (startIdx < 0 || endIdx < 0) return { count: 0, solutions: [], rotatable: [] };
    const rotatable = tiles.map((t, i) => ({ t, i })).filter(({ t }) => t.type === "gear" && !t.fixed).map(({ i }) => i);
    const variants = rotatable.map((i) => gearVariants(tiles[i]));
    const possible = tiles.map((t) => {
      const rots = t.type === "gear" && !t.fixed ? gearVariants(t) : [t.rot ?? 0];
      return [0, 1, 2, 3].map((s) => new Set(rots.map((r) => faceAt(t, r, s)).filter(Boolean)));
    });
    const at = /* @__PURE__ */ new Map();
    tiles.forEach((t, i) => at.set(t.pos.join(","), i));
    const neighbors = tiles.map((t) => {
      const list = [];
      if (t.type === "blocker") return list;
      for (let s = 0; s < 4; s++) {
        const [dx, dy] = SIDES2[s];
        const j = at.get(`${t.pos[0] + dx},${t.pos[1] + dy}`);
        if (j !== void 0 && tiles[j].type !== "blocker") list.push({ s, j });
      }
      return list;
    });
    const rotOf = tiles.map((t) => t.type === "gear" && !t.fixed ? null : t.rot ?? 0);
    function edgePossible(i, s, j) {
      const fi = rotOf[i] === null ? possible[i][s] : new Set([faceAt(tiles[i], rotOf[i], s)].filter(Boolean));
      const fj = rotOf[j] === null ? possible[j][(s + 2) % 4] : new Set([faceAt(tiles[j], rotOf[j], (s + 2) % 4)].filter(Boolean));
      for (const a of fi) for (const b of fj) if (facesMesh(a, b)) return true;
      return false;
    }
    function endReachable() {
      const seen = /* @__PURE__ */ new Set([startIdx]);
      const queue = [startIdx];
      while (queue.length > 0) {
        const i = queue.shift();
        for (const { s, j } of neighbors[i]) {
          if (seen.has(j)) continue;
          if (edgePossible(i, s, j)) {
            seen.add(j);
            queue.push(j);
          }
        }
      }
      return seen.has(endIdx);
    }
    const solutions = [];
    const assign = new Array(rotatable.length).fill(0);
    function bt(k) {
      if (solutions.length >= maxSolutions) return;
      if (k === rotatable.length) {
        const s = createMechPuzzle(level);
        rotatable.forEach((idx, k2) => {
          s.rot[idx] = variants[k2][assign[k2]];
        });
        if (isMechSolved(s)) solutions.push([...assign]);
        return;
      }
      for (let v = 0; v < variants[k].length; v++) {
        assign[k] = v;
        rotOf[rotatable[k]] = variants[k][v];
        if (endReachable()) bt(k + 1);
      }
      rotOf[rotatable[k]] = null;
    }
    bt(0);
    return { count: solutions.length, solutions, rotatable };
  }
  function mechHint(state2) {
    const { level } = state2;
    const { count, solutions, rotatable } = solveMech(level, 64);
    if (count === 0) return { type: "unsolvable" };
    const variants = rotatable.map((i) => gearVariants(level.tiles[i]));
    let best = null;
    let bestDist = Infinity;
    for (const sol of solutions) {
      let dist = 0;
      rotatable.forEach((idx, k2) => {
        if (state2.rot[idx] !== variants[k2][sol[k2]]) dist++;
      });
      if (dist < bestDist) {
        bestDist = dist;
        best = sol;
      }
    }
    if (bestDist === 0) return { type: "already" };
    const k = rotatable.findIndex((idx, k2) => state2.rot[idx] !== variants[k2][best[k2]]);
    return { type: "rotate", tileIndex: rotatable[k] };
  }

  // src/ui/mechView.js
  var CELL3 = 72;
  function renderMechPuzzle(container, ctx2, level) {
    const puzzle = createMechPuzzle(level);
    let hintsUsed = 0;
    let hintTile = null;
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
    const legend = document.createElement("div");
    legend.className = "panel mt";
    legend.innerHTML = `<div class="desc" style="line-height:1.9">
    \u{1F3A1} \u0440\u0443\u043A\u043E\u044F\u0442\u044C \u2192 \u{1F514} \u043A\u043E\u043B\u043E\u043A\u043E\u043B\u044C\u0447\u0438\u043A<br>
    \u0422\u0430\u043F \u043F\u043E \u0448\u0435\u0441\u0442\u0435\u0440\u0451\u043D\u043A\u0435 \u2014 \u043F\u043E\u0432\u0435\u0440\u043D\u0443\u0442\u044C \u043D\u0430 \u0447\u0435\u0442\u0432\u0435\u0440\u0442\u044C \u043E\u0431\u043E\u0440\u043E\u0442\u0430<br>
    \u0428\u0438\u043F \u0441\u0442\u044B\u043A\u0443\u0435\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u0441 \u043F\u0430\u0437\u043E\u043C<br>
    \u{1F529} \u0437\u0430\u043A\u043B\u0438\u043D\u0438\u0432\u0448\u0430\u044F \u0434\u0435\u0442\u0430\u043B\u044C \u2014 \u043F\u0435\u0440\u0435\u0434\u0430\u0447\u0438 \u0447\u0435\u0440\u0435\u0437 \u043D\u0435\u0451 \u043D\u0435\u0442<br>
    \u0422\u0451\u043F\u043B\u044B\u0439 \u0431\u043B\u0435\u0441\u043A \u2014 \u043F\u0435\u0440\u0435\u0434\u0430\u0447\u0430, \u0447\u0442\u043E \u0443\u0436\u0435 \u0438\u0434\u0451\u0442 \u043E\u0442 \u0440\u0443\u043A\u043E\u044F\u0442\u0438</div>`;
    side.appendChild(legend);
    const controls = document.createElement("div");
    controls.className = "puzzle-controls";
    const btnUndo = mkBtn("\u21A9\uFE0F \u041E\u0442\u043C\u0435\u043D\u0430 (Z)", doUndo);
    const btnHint = mkBtn("\u{1F4A1} \u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430 (H)", doHint);
    const btnReset = mkBtn("\u{1F504} \u0421\u0431\u0440\u043E\u0441 (R)", doReset);
    controls.append(btnUndo, btnHint, btnReset);
    controls.appendChild(puzzleSkipButton(ctx2, level, () => ctx2.go("puzzles")));
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
      if (undoMech(puzzle)) {
        hintTile = null;
        ctx2.sfx?.("tap");
        draw();
      }
    }
    function doReset() {
      if (finished) return;
      resetMech(puzzle);
      hintTile = null;
      ctx2.sfx?.("tap");
      draw();
    }
    function doHint() {
      if (finished) return;
      const h = mechHint(puzzle);
      ctx2.sfx?.("hint");
      if (h.type === "rotate") {
        hintsUsed += 1;
        hintTile = h.tileIndex;
        ctx2.toast("\u041A\u043E\u0442-\u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u043F\u043E\u0441\u0442\u0443\u043A\u0438\u0432\u0430\u0435\u0442 \u043F\u043E \u043E\u0434\u043D\u043E\u0439 \u0438\u0437 \u0448\u0435\u0441\u0442\u0435\u0440\u0451\u043D\u043E\u043A\u2026");
        draw();
      } else if (h.type === "already") {
        ctx2.toast("\u041C\u0435\u0445\u0430\u043D\u0438\u0437\u043C \u0443\u0436\u0435 \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442!");
      } else {
        ctx2.toast("\u0425\u043C, \u0442\u0443\u0442 \u0447\u0442\u043E-\u0442\u043E \u0441\u043B\u043E\u043C\u0430\u043D\u043E \u043D\u0430\u0441\u043E\u0432\u0441\u0435\u043C. \u0421\u043A\u0430\u0436\u0438 \u0445\u043E\u0437\u044F\u0438\u043D\u0443 \u043B\u0430\u0432\u043A\u0438!");
      }
    }
    function onTap(ev) {
      if (finished) return;
      const rect = canvas.getBoundingClientRect();
      const scale = canvas.width / dpr / rect.width;
      const x = Math.floor((ev.clientX - rect.left) * scale / CELL3);
      const y = Math.floor((ev.clientY - rect.top) * scale / CELL3);
      const idx = level.tiles.findIndex((t) => t.pos[0] === x && t.pos[1] === y);
      if (idx >= 0 && rotateGear(puzzle, idx)) {
        hintTile = null;
        ctx2.sfx?.("rotate");
        draw();
        if (isMechSolved(puzzle)) finish();
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
          title: "\u{1F514} \u041A\u043E\u043B\u043E\u043A\u043E\u043B\u044C\u0447\u0438\u043A \u0437\u0430\u0437\u0432\u043E\u043D\u0438\u043B!",
          subtitle: `\xAB${level.name}\xBB \u2014 \u043F\u0435\u0440\u0435\u0434\u0430\u0447\u0430 \u0441\u043E\u0431\u0440\u0430\u043D\u0430`,
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
      g.clearRect(0, 0, gw * CELL3, gh * CELL3);
      const { reached } = traceMech(puzzle);
      const at = /* @__PURE__ */ new Map();
      level.tiles.forEach((t, i) => at.set(t.pos.join(","), i));
      for (let y = 0; y < gh; y++) {
        for (let x = 0; x < gw; x++) {
          g.fillStyle = (x + y) % 2 === 0 ? "#3d4149" : "#353945";
          g.fillRect(x * CELL3, y * CELL3, CELL3, CELL3);
        }
      }
      level.tiles.forEach((t, i) => {
        if (t.type === "blocker") return;
        const rot = puzzle.rot[i] ?? t.rot ?? 0;
        for (const s of [1, 2]) {
          const f = faceAt(t, rot, s);
          if (!f) continue;
          const [dx, dy] = SIDES2[s];
          const j = at.get(`${t.pos[0] + dx},${t.pos[1] + dy}`);
          if (j === void 0) continue;
          const nt = level.tiles[j];
          if (nt.type === "blocker") continue;
          const nf = faceAt(nt, puzzle.rot[j] ?? nt.rot ?? 0, (s + 2) % 4);
          if (!facesMesh(f, nf)) continue;
          const onPath = reached.has(i) && reached.has(j);
          g.strokeStyle = onPath ? "#ffd98a" : "#6a6154";
          g.lineCap = "round";
          g.lineWidth = onPath ? 9 : 7;
          g.beginPath();
          g.moveTo(t.pos[0] * CELL3 + CELL3 / 2 + dx * CELL3 * 0.28, t.pos[1] * CELL3 + CELL3 / 2 + dy * CELL3 * 0.28);
          g.lineTo(t.pos[0] * CELL3 + CELL3 / 2 + dx * CELL3 * 0.72, t.pos[1] * CELL3 + CELL3 / 2 + dy * CELL3 * 0.72);
          g.stroke();
        }
      });
      level.tiles.forEach((t, i) => {
        const cx = t.pos[0] * CELL3 + CELL3 / 2;
        const cy = t.pos[1] * CELL3 + CELL3 / 2;
        const onPath = reached.has(i);
        const rot = puzzle.rot[i] ?? t.rot ?? 0;
        g.fillStyle = t.type === "blocker" ? "#2c2a33" : onPath ? "#7d6338" : "#52493c";
        roundRect(g, t.pos[0] * CELL3 + 4, t.pos[1] * CELL3 + 4, CELL3 - 8, CELL3 - 8, 10);
        g.fill();
        if (hintTile === i) {
          g.fillStyle = "rgba(255, 202, 122, 0.35)";
          g.beginPath();
          g.arc(cx, cy, CELL3 * 0.46, 0, Math.PI * 2);
          g.fill();
        }
        if (t.type === "gear") {
          drawGear(g, t, rot, cx, cy, onPath);
        } else if (t.type === "start" || t.type === "end") {
          g.fillStyle = onPath ? "#d9a441" : "#8d8578";
          g.beginPath();
          g.arc(cx, cy, CELL3 * 0.2, 0, Math.PI * 2);
          g.fill();
          g.strokeStyle = "#4a3b28";
          g.lineWidth = 3;
          g.stroke();
          drawFaces(g, t, rot, cx, cy);
        }
        const emoji = (e, size = CELL3 * 0.42) => {
          g.font = `${size}px "Segoe UI Emoji", sans-serif`;
          g.textAlign = "center";
          g.textBaseline = "middle";
          g.fillText(e, cx, cy);
        };
        if (t.type === "start") emoji("\u{1F3A1}");
        else if (t.type === "end") emoji("\u{1F514}");
        else if (t.type === "blocker") emoji("\u{1F529}", CELL3 * 0.4);
      });
      const solvedNow = isMechSolved(puzzle);
      statusEl.innerHTML = (solvedNow ? "\u2705 <b>\u041C\u0435\u0445\u0430\u043D\u0438\u0437\u043C \u0437\u0430\u0440\u0430\u0431\u043E\u0442\u0430\u043B!</b>" : `\u2699\uFE0F \u041F\u0435\u0440\u0435\u0434\u0430\u0447\u0430 \u043E\u0442 \u0440\u0443\u043A\u043E\u044F\u0442\u0438: <b>${reached.size}</b> \u0434\u0435\u0442\u0430\u043B\u0435\u0439`) + `<div class="muted" style="font-size:13px">\u0425\u043E\u0434\u044B: ${puzzle.moves} \xB7 \u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0438: ${hintsUsed}</div>`;
    }
    function drawGear(g, t, rot, cx, cy, onPath) {
      const r = CELL3 * 0.3;
      const body = onPath ? "#d9a441" : "#9a938a";
      const dark = onPath ? "#8a6420" : "#5e584f";
      g.fillStyle = dark;
      const baseAngle = rot * Math.PI / 2;
      for (let k = 0; k < 8; k++) {
        const a = baseAngle + k / 8 * Math.PI * 2;
        g.save();
        g.translate(cx, cy);
        g.rotate(a);
        g.fillRect(r - 2, -3.5, 8, 7);
        g.restore();
      }
      g.fillStyle = body;
      g.beginPath();
      g.arc(cx, cy, r, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = dark;
      g.lineWidth = 3;
      g.stroke();
      g.fillStyle = "#3a3428";
      g.beginPath();
      g.arc(cx, cy, 5, 0, Math.PI * 2);
      g.fill();
      drawFaces(g, t, rot, cx, cy);
    }
    function drawFaces(g, t, rot, cx, cy) {
      const r = CELL3 * 0.3;
      for (let s = 0; s < 4; s++) {
        const f = faceAt(t, rot, s);
        if (!f) continue;
        const [dx, dy] = SIDES2[s];
        if (f === "pin") {
          g.fillStyle = "#e8e0d0";
          g.strokeStyle = "#4a3b28";
          g.lineWidth = 2;
          g.beginPath();
          g.arc(cx + dx * (r + 7), cy + dy * (r + 7), 5, 0, Math.PI * 2);
          g.fill();
          g.stroke();
        } else {
          g.fillStyle = "#241f18";
          g.beginPath();
          g.arc(cx + dx * (r - 1), cy + dy * (r - 1), 6, 0, Math.PI * 2);
          g.fill();
        }
      }
    }
    function roundRect(g, x, y, w, h, r) {
      g.beginPath();
      g.moveTo(x + r, y);
      g.arcTo(x + w, y, x + w, y + h, r);
      g.arcTo(x + w, y + h, x, y + h, r);
      g.arcTo(x, y + h, x, y, r);
      g.arcTo(x, y, x + w, y, r);
      g.closePath();
    }
    draw();
    return () => {
      window.removeEventListener("keydown", onKey);
      canvas.removeEventListener("pointerdown", onTap);
    };
  }

  // src/core/candlePuzzle.js
  function createCandlePuzzle(level) {
    return {
      level,
      candles: /* @__PURE__ */ new Set(),
      // ключи "x,y"
      history: [],
      // { x, y, action: 'place' | 'remove' }
      moves: 0
    };
  }
  function cellKey(x, y) {
    return `${x},${y}`;
  }
  function keyOf(pos) {
    return pos[0] + "," + pos[1];
  }
  function candleIndex(level) {
    return {
      walls: new Set((level.walls || []).map(keyOf)),
      lanterns: new Set((level.lanterns || []).map(keyOf)),
      spirits: new Set((level.spirits || []).map(keyOf))
    };
  }
  function objectAt(level, x, y) {
    const idx = candleIndex(level);
    const k = cellKey(x, y);
    if (idx.walls.has(k)) return "wall";
    if (idx.lanterns.has(k)) return "lantern";
    if (idx.spirits.has(k)) return "spirit";
    return null;
  }
  function placeCandle(state2, x, y) {
    const { level } = state2;
    const [w, h] = level.grid;
    const k = cellKey(x, y);
    if (x < 0 || y < 0 || x >= w || y >= h) return { ok: false, error: "\u0421\u044E\u0434\u0430 \u0441\u0432\u0435\u0447\u0443 \u043D\u0435 \u043F\u043E\u0441\u0442\u0430\u0432\u0438\u0442\u044C" };
    if (state2.candles.has(k)) {
      state2.candles.delete(k);
      state2.history.push({ x, y, action: "remove" });
      state2.moves += 1;
      return { ok: true, action: "remove" };
    }
    const obj = objectAt(level, x, y);
    if (obj === "wall") return { ok: false, error: "\u041D\u0430 \u0441\u0442\u0435\u043D\u0443 \u0441\u0432\u0435\u0447\u0443 \u043D\u0435 \u043F\u043E\u0441\u0442\u0430\u0432\u0438\u0442\u044C" };
    if (obj === "lantern") return { ok: false, error: "\u0422\u0443\u0442 \u0443\u0436\u0435 \u0441\u0442\u043E\u0438\u0442 \u0444\u043E\u043D\u0430\u0440\u044C" };
    if (obj === "spirit") return { ok: false, error: "\u0414\u0443\u0445 \u043D\u0435 \u0434\u0430\u0441\u0442 \u043F\u043E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0441\u0432\u0435\u0447\u0443" };
    if (state2.candles.size >= level.candleLimit) {
      return { ok: false, error: "\u0421\u0432\u0435\u0447\u0438 \u043A\u043E\u043D\u0447\u0438\u043B\u0438\u0441\u044C \u2014 \u0443\u0431\u0435\u0440\u0438 \u043B\u0438\u0448\u043D\u044E\u044E \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u044B\u043C \u0442\u0430\u043F\u043E\u043C" };
    }
    state2.candles.add(k);
    state2.history.push({ x, y, action: "place" });
    state2.moves += 1;
    return { ok: true, action: "place" };
  }
  function undoCandle(state2) {
    const last = state2.history.pop();
    if (!last) return false;
    const k = cellKey(last.x, last.y);
    if (last.action === "place") state2.candles.delete(k);
    else state2.candles.add(k);
    state2.moves += 1;
    return true;
  }
  function resetCandles(state2) {
    state2.candles.clear();
    state2.history = [];
    state2.moves += 1;
  }
  function litByCandle(level, cx, cy) {
    const { walls } = candleIndex(level);
    const [w, h] = level.grid;
    const lit = /* @__PURE__ */ new Set([cellKey(cx, cy)]);
    const queue = [[cx, cy, 0]];
    while (queue.length > 0) {
      const [x, y, d] = queue.shift();
      if (d >= level.radius) continue;
      for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const k = cellKey(nx, ny);
        if (lit.has(k) || walls.has(k)) continue;
        lit.add(k);
        queue.push([nx, ny, d + 1]);
      }
    }
    return lit;
  }
  function litCells(level, candles) {
    const lit = /* @__PURE__ */ new Set();
    for (const k of candles) {
      const [x, y] = k.split(",").map(Number);
      for (const lk of litByCandle(level, x, y)) lit.add(lk);
    }
    return lit;
  }
  function candleStatus(state2) {
    const { level } = state2;
    const lit = litCells(level, state2.candles);
    const lanternsLit = level.lanterns.filter((p) => lit.has(keyOf(p))).length;
    const spiritsLit = level.spirits.filter((p) => lit.has(keyOf(p))).length;
    return {
      lit,
      placed: state2.candles.size,
      limit: level.candleLimit,
      lanternsLit,
      lanternsTotal: level.lanterns.length,
      spiritsLit,
      spiritsTotal: level.spirits.length,
      solved: lanternsLit === level.lanterns.length && spiritsLit === 0
    };
  }
  function isCandleSolved(state2) {
    return candleStatus(state2).solved;
  }
  function solveCandles(level, maxSolutions = 32) {
    const idx = candleIndex(level);
    const [w, h] = level.grid;
    const candidates = [];
    const lanternMask = [];
    const spiritMask = [];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const k = cellKey(x, y);
        if (idx.walls.has(k) || idx.lanterns.has(k) || idx.spirits.has(k)) continue;
        const lit = litByCandle(level, x, y);
        let lm = 0;
        let sm = 0;
        level.lanterns.forEach((p, i) => {
          if (lit.has(keyOf(p))) lm |= 1 << i;
        });
        level.spirits.forEach((p, i) => {
          if (lit.has(keyOf(p))) sm |= 1 << i;
        });
        if (lm === 0) continue;
        candidates.push([x, y]);
        lanternMask.push(lm);
        spiritMask.push(sm);
      }
    }
    const full = (1 << level.lanterns.length) - 1;
    const solutions = [];
    const pick = [];
    const maxK = Math.min(level.candleLimit, candidates.length, 6);
    function bt(start, k) {
      if (solutions.length >= maxSolutions) return;
      if (pick.length === k) {
        let lm = 0;
        let sm = 0;
        for (const i of pick) {
          lm |= lanternMask[i];
          sm |= spiritMask[i];
        }
        if (lm === full && sm === 0) solutions.push(pick.map((i) => [...candidates[i]]));
        return;
      }
      for (let i = start; i < candidates.length; i++) {
        pick.push(i);
        bt(i + 1, k);
        pick.pop();
        if (solutions.length >= maxSolutions) return;
      }
    }
    for (let k = 1; k <= maxK && solutions.length < maxSolutions; k++) bt(0, k);
    return { count: solutions.length, solutions, candidates };
  }
  function candleHint(state2) {
    const { level } = state2;
    const { count, solutions } = solveCandles(level, 64);
    if (count === 0) return { type: "unsolvable" };
    let best = null;
    let bestDist = Infinity;
    for (const sol of solutions) {
      const solSet = new Set(sol.map(keyOf));
      let dist = 0;
      for (const k of state2.candles) if (!solSet.has(k)) dist += 1;
      for (const k of solSet) if (!state2.candles.has(k)) dist += 1;
      if (dist < bestDist) {
        bestDist = dist;
        best = sol;
      }
    }
    if (bestDist === 0) return { type: "already" };
    const bestSet = new Set(best.map(keyOf));
    for (const k of state2.candles) {
      if (!bestSet.has(k)) {
        const [x, y] = k.split(",").map(Number);
        return { type: "remove", x, y };
      }
    }
    for (const [x, y] of best) {
      if (!state2.candles.has(cellKey(x, y))) return { type: "place", x, y };
    }
    return { type: "already" };
  }

  // src/ui/candleView.js
  var CELL4 = 64;
  function renderCandlePuzzle(container, ctx2, level) {
    const puzzle = createCandlePuzzle(level);
    let hintsUsed = 0;
    let hintCell = null;
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
    canvas.width = gw * CELL4 * dpr;
    canvas.height = gh * CELL4 * dpr;
    canvas.style.width = `${gw * CELL4}px`;
    canvas.style.height = `${gh * CELL4}px`;
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
    const legend = document.createElement("div");
    legend.className = "panel mt";
    legend.innerHTML = `<div class="desc" style="line-height:1.9">
    \u{1F56F}\uFE0F \u0442\u0430\u043F \u2014 \u043F\u043E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0441\u0432\u0435\u0447\u0443, \u0435\u0449\u0451 \u0442\u0430\u043F \u2014 \u0443\u0431\u0440\u0430\u0442\u044C<br>
    \u{1F3EE} \u0432\u0441\u0435 \u0444\u043E\u043D\u0430\u0440\u0438 \u0434\u043E\u043B\u0436\u043D\u044B \u0433\u043E\u0440\u0435\u0442\u044C<br>
    \u{1F47B} \u043D\u0438 \u043E\u0434\u0438\u043D \u0434\u0443\u0445 \u043D\u0435 \u0434\u043E\u043B\u0436\u0435\u043D \u043F\u043E\u043F\u0430\u0441\u0442\u044C \u0432 \u0441\u0432\u0435\u0442<br>
    \u2B1B \u0441\u0442\u0435\u043D\u0430 \u0441\u0432\u0435\u0442 \u043D\u0435 \u043F\u0440\u043E\u043F\u0443\u0441\u043A\u0430\u0435\u0442</div>`;
    side.appendChild(legend);
    const controls = document.createElement("div");
    controls.className = "puzzle-controls";
    const btnUndo = mkBtn("\u21A9\uFE0F \u041E\u0442\u043C\u0435\u043D\u0430 (Z)", doUndo);
    const btnHint = mkBtn("\u{1F4A1} \u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430 (H)", doHint);
    const btnReset = mkBtn("\u{1F504} \u0421\u0431\u0440\u043E\u0441 (R)", doReset);
    controls.append(btnUndo, btnHint, btnReset);
    controls.appendChild(puzzleSkipButton(ctx2, level, () => ctx2.go("puzzles")));
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
      if (undoCandle(puzzle)) {
        hintCell = null;
        ctx2.sfx?.("tap");
        draw();
      }
    }
    function doReset() {
      if (finished) return;
      resetCandles(puzzle);
      hintCell = null;
      ctx2.sfx?.("tap");
      draw();
    }
    function doHint() {
      if (finished) return;
      const h = candleHint(puzzle);
      ctx2.sfx?.("hint");
      if (h.type === "place") {
        hintsUsed += 1;
        hintCell = { x: h.x, y: h.y, type: "place" };
        ctx2.toast("\u041A\u043E\u0442-\u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u043A\u043B\u0435\u0442\u043A\u0443 \u0434\u043B\u044F \u0441\u0432\u0435\u0447\u0438\u2026");
        draw();
      } else if (h.type === "remove") {
        hintsUsed += 1;
        hintCell = { x: h.x, y: h.y, type: "remove" };
        ctx2.toast("\u041A\u043E\u0442-\u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u043C\u043E\u0440\u0449\u0438\u0442\u0441\u044F \u043D\u0430 \u043E\u0434\u043D\u0443 \u0438\u0437 \u0441\u0432\u0435\u0447\u0435\u0439\u2026");
        draw();
      } else if (h.type === "already") {
        ctx2.toast("\u0412\u0441\u0451 \u0443\u0436\u0435 \u0433\u043E\u0440\u0438\u0442 \u043A\u0430\u043A \u043D\u0430\u0434\u043E!");
      } else {
        ctx2.toast("\u0425\u043C, \u0442\u0443\u0442 \u0442\u0435\u043C\u043D\u043E \u0434\u0430\u0436\u0435 \u043A\u043E\u0442\u0443. \u0421\u043A\u0430\u0436\u0438 \u0445\u043E\u0437\u044F\u0438\u043D\u0443 \u043B\u0430\u0432\u043A\u0438!");
      }
    }
    function onTap(ev) {
      if (finished) return;
      const rect = canvas.getBoundingClientRect();
      const scale = canvas.width / dpr / rect.width;
      const x = Math.floor((ev.clientX - rect.left) * scale / CELL4);
      const y = Math.floor((ev.clientY - rect.top) * scale / CELL4);
      const r = placeCandle(puzzle, x, y);
      if (r.ok) {
        hintCell = null;
        ctx2.sfx?.(r.action === "place" ? "potion" : "tap");
        draw();
        if (isCandleSolved(puzzle)) finish();
      } else {
        ctx2.toast(r.error);
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
          title: "\u{1F56F}\uFE0F \u0421\u0432\u0435\u0442 \u0440\u0430\u0441\u0441\u0442\u0430\u0432\u043B\u0435\u043D!",
          subtitle: `\xAB${level.name}\xBB \u2014 \u0444\u043E\u043D\u0430\u0440\u0438 \u0433\u043E\u0440\u044F\u0442, \u0434\u0443\u0445\u0438 \u0434\u0440\u0435\u043C\u043B\u044E\u0442`,
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
      g.clearRect(0, 0, gw * CELL4, gh * CELL4);
      const st = candleStatus(puzzle);
      for (let y = 0; y < gh; y++) {
        for (let x = 0; x < gw; x++) {
          g.fillStyle = (x + y) % 2 === 0 ? "#232a3c" : "#1d2333";
          g.fillRect(x * CELL4, y * CELL4, CELL4, CELL4);
        }
      }
      for (const k of st.lit) {
        const [x, y] = k.split(",").map(Number);
        g.fillStyle = "rgba(255, 196, 96, 0.22)";
        g.fillRect(x * CELL4, y * CELL4, CELL4, CELL4);
      }
      for (const [x, y] of level.walls) {
        g.fillStyle = "#0d1017";
        g.fillRect(x * CELL4 + 2, y * CELL4 + 2, CELL4 - 4, CELL4 - 4);
        g.fillStyle = "#2c3140";
        g.fillRect(x * CELL4 + 2, y * CELL4 + 2, CELL4 - 4, 6);
      }
      for (const k of puzzle.candles) {
        const [x, y] = k.split(",").map(Number);
        const cx = x * CELL4 + CELL4 / 2;
        const cy = y * CELL4 + CELL4 / 2;
        const glow = g.createRadialGradient(cx, cy, 4, cx, cy, CELL4 * (level.radius * 0.55));
        glow.addColorStop(0, "rgba(255, 214, 130, 0.5)");
        glow.addColorStop(1, "rgba(255, 214, 130, 0)");
        g.fillStyle = glow;
        g.beginPath();
        g.arc(cx, cy, CELL4 * (level.radius * 0.55), 0, Math.PI * 2);
        g.fill();
      }
      const emoji = (e, x, y, size = CELL4 * 0.5, alpha = 1) => {
        g.globalAlpha = alpha;
        g.font = `${size}px "Segoe UI Emoji", sans-serif`;
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillText(e, x * CELL4 + CELL4 / 2, y * CELL4 + CELL4 / 2);
        g.globalAlpha = 1;
      };
      for (const [x, y] of level.lanterns) {
        const lit = st.lit.has(`${x},${y}`);
        if (lit) {
          const cx = x * CELL4 + CELL4 / 2;
          const cy = y * CELL4 + CELL4 / 2;
          const halo = g.createRadialGradient(cx, cy, 4, cx, cy, CELL4 * 0.7);
          halo.addColorStop(0, "rgba(255, 230, 150, 0.55)");
          halo.addColorStop(1, "rgba(255, 230, 150, 0)");
          g.fillStyle = halo;
          g.beginPath();
          g.arc(cx, cy, CELL4 * 0.7, 0, Math.PI * 2);
          g.fill();
        }
        emoji("\u{1F3EE}", x, y, CELL4 * 0.5, lit ? 1 : 0.45);
      }
      for (const [x, y] of level.spirits) {
        const lit = st.lit.has(`${x},${y}`);
        if (lit) {
          g.fillStyle = "rgba(160, 165, 175, 0.45)";
          g.beginPath();
          g.arc(x * CELL4 + CELL4 / 2, y * CELL4 + CELL4 / 2, CELL4 * 0.32, 0, Math.PI * 2);
          g.fill();
          emoji("\u{1F47B}", x, y, CELL4 * 0.5, 0.5);
        } else {
          emoji("\u{1F47B}", x, y, CELL4 * 0.5, 1);
        }
      }
      for (const k of puzzle.candles) {
        const [x, y] = k.split(",").map(Number);
        emoji("\u{1F56F}\uFE0F", x, y);
      }
      if (hintCell) {
        g.strokeStyle = hintCell.type === "place" ? "#8fd98a" : "#e88a7a";
        g.lineWidth = 4;
        g.beginPath();
        g.arc(hintCell.x * CELL4 + CELL4 / 2, hintCell.y * CELL4 + CELL4 / 2, CELL4 * 0.44, 0, Math.PI * 2);
        g.stroke();
      }
      const warn = st.spiritsLit > 0 ? `<div class="warn">\u{1F47B} \u0414\u0443\u0445 \u0432 \u0441\u0432\u0435\u0442\u0435: ${st.spiritsLit}! \u0422\u0430\u043A \u043D\u0435\u043B\u044C\u0437\u044F.</div>` : "";
      statusEl.innerHTML = (st.solved ? "\u2705 <b>\u0412\u0441\u0435 \u0444\u043E\u043D\u0430\u0440\u0438 \u0433\u043E\u0440\u044F\u0442, \u0434\u0443\u0445\u0438 \u0432 \u0442\u0435\u043D\u0438!</b>" : `\u{1F56F}\uFE0F \u0421\u0432\u0435\u0447\u0438: <b>${st.placed}/${st.limit}</b> \xB7 \u{1F3EE} \u0424\u043E\u043D\u0430\u0440\u0438: <b>${st.lanternsLit}/${st.lanternsTotal}</b>` + warn) + `<div class="muted" style="font-size:13px">\u0425\u043E\u0434\u044B: ${puzzle.moves} \xB7 \u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0438: ${hintsUsed}</div>`;
    }
    draw();
    return () => {
      window.removeEventListener("keydown", onKey);
      canvas.removeEventListener("pointerdown", onTap);
    };
  }

  // src/core/flowPuzzle.js
  var DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  var BUYER_COLORS = [
    { buyer: "\u{1F98A}", name: "\u041B\u0438\u0441\u0451\u043D\u043E\u043A", css: "#e8965a" },
    { buyer: "\u{1F438}", name: "\u041B\u044F\u0433\u0443\u0448\u043E\u043D\u043E\u043A", css: "#7bc47f" },
    { buyer: "\u{1F426}", name: "\u0421\u0438\u043D\u0438\u0447\u043A\u0430", css: "#6aa9e8" }
  ];
  function createFlowPuzzle(level) {
    return {
      level,
      rot: Object.fromEntries(
        level.tiles.map((t, i) => [i, t.rot ?? 0]).filter(([i]) => level.tiles[i].type === "arrow")
      ),
      history: [],
      moves: 0
    };
  }
  function rotateFlowTile(state2, tileIndex) {
    const t = state2.level.tiles[tileIndex];
    if (!t || t.type !== "arrow" || t.fixed) return false;
    state2.history.push({ tileIndex, prev: state2.rot[tileIndex] });
    state2.rot[tileIndex] = (state2.rot[tileIndex] + 1) % 4;
    state2.moves += 1;
    return true;
  }
  function undoFlow(state2) {
    const last = state2.history.pop();
    if (!last) return false;
    state2.rot[last.tileIndex] = last.prev;
    state2.moves += 1;
    return true;
  }
  function resetFlow(state2) {
    for (const [idx] of Object.entries(state2.rot)) {
      state2.rot[idx] = state2.level.tiles[idx].rot ?? 0;
    }
    state2.history = [];
    state2.moves += 1;
  }
  function simulateFlows(state2) {
    const { level } = state2;
    const [w, h] = level.grid;
    const at = /* @__PURE__ */ new Map();
    level.tiles.forEach((t, i) => at.set(t.pos[0] + "," + t.pos[1], i));
    const buyers = [];
    level.tiles.forEach((t, i) => {
      if (t.type !== "start") return;
      const path = [[t.pos[0], t.pos[1]]];
      let x = t.pos[0];
      let y = t.pos[1];
      let dir = (t.rot ?? 0) % 4;
      let arrived = false;
      let reason = "steps";
      const seen = /* @__PURE__ */ new Set([`${x},${y},${dir}`]);
      const maxSteps = w * h * 4;
      for (let step = 0; step < maxSteps; step++) {
        const [dx, dy] = DIRS[dir];
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) {
          reason = "edge";
          break;
        }
        const j = at.get(`${nx},${ny}`);
        const nt = j === void 0 ? null : level.tiles[j];
        if (nt?.type === "wall") {
          reason = "wall";
          break;
        }
        if (nt?.type === "stall") {
          if ((nt.color ?? 0) === (t.color ?? 0)) {
            path.push([nx, ny]);
            arrived = true;
            reason = "stall";
          } else {
            reason = "foreign";
          }
          break;
        }
        path.push([nx, ny]);
        x = nx;
        y = ny;
        if (!nt) {
          reason = "empty";
          break;
        }
        if (nt.type === "arrow") dir = (state2.rot[j] ?? nt.rot ?? 0) % 4;
        const key = `${x},${y},${dir}`;
        if (seen.has(key)) {
          reason = "loop";
          break;
        }
        seen.add(key);
      }
      buyers.push({ start: i, color: t.color ?? 0, path, arrived, reason });
    });
    const owners = /* @__PURE__ */ new Map();
    buyers.forEach((b, bi) => b.path.forEach(([x, y]) => {
      const key = `${x},${y}`;
      if (!owners.has(key)) owners.set(key, /* @__PURE__ */ new Set());
      owners.get(key).add(bi);
    }));
    const collisions = /* @__PURE__ */ new Set();
    for (const [key, set] of owners) if (set.size > 1) collisions.add(key);
    const arrivedCount = buyers.filter((b) => b.arrived).length;
    const solved = buyers.length > 0 && arrivedCount === buyers.length && collisions.size === 0;
    return { buyers, collisions, arrivedCount, solved };
  }
  function isFlowSolved(state2) {
    return simulateFlows(state2).solved;
  }
  function solveFlow(level, maxSolutions = 32) {
    const rotatable = level.tiles.map((t, i) => ({ t, i })).filter(({ t }) => t.type === "arrow" && !t.fixed);
    const solutions = [];
    const assign = new Array(rotatable.length).fill(0);
    function bt(k) {
      if (solutions.length >= maxSolutions) return;
      if (k === rotatable.length) {
        const s = createFlowPuzzle(level);
        rotatable.forEach(({ i }, k2) => {
          s.rot[i] = assign[k2];
        });
        if (isFlowSolved(s)) solutions.push([...assign]);
        return;
      }
      for (let v = 0; v < 4; v++) {
        assign[k] = v;
        bt(k + 1);
      }
    }
    bt(0);
    return { count: solutions.length, solutions, rotatable: rotatable.map((r) => r.i) };
  }
  var flowSolutionCache = /* @__PURE__ */ new WeakMap();
  function cachedSolutions(level) {
    let c = flowSolutionCache.get(level);
    if (!c) {
      c = solveFlow(level, 64);
      flowSolutionCache.set(level, c);
    }
    return c;
  }
  function flowHint(state2) {
    const { level } = state2;
    const { count, solutions, rotatable } = cachedSolutions(level);
    if (count === 0) return { type: "unsolvable" };
    let best = null;
    let bestDist = Infinity;
    for (const sol of solutions) {
      let dist = 0;
      rotatable.forEach((idx, k2) => {
        if (state2.rot[idx] !== sol[k2]) dist++;
      });
      if (dist < bestDist) {
        bestDist = dist;
        best = sol;
      }
    }
    if (bestDist === 0) return { type: "already" };
    const k = rotatable.findIndex((idx, k2) => state2.rot[idx] !== best[k2]);
    return { type: "rotate", tileIndex: rotatable[k] };
  }

  // src/ui/flowView.js
  var CELL5 = 72;
  function renderFlowPuzzle(container, ctx2, level) {
    const puzzle = createFlowPuzzle(level);
    let hintsUsed = 0;
    let hintTile = null;
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
    canvas.width = gw * CELL5 * dpr;
    canvas.height = gh * CELL5 * dpr;
    canvas.style.width = `${gw * CELL5}px`;
    canvas.style.height = `${gh * CELL5}px`;
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
    const legend = document.createElement("div");
    legend.className = "panel mt";
    legend.innerHTML = `<div class="desc" style="line-height:1.9">
    \u{1F98A}\u{1F438}\u{1F426} \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u0438 \u0438\u0434\u0443\u0442 \u043F\u043E \u0441\u0442\u0440\u0435\u043B\u043A\u0430\u043C \u043E\u0442 \u0441\u0432\u043E\u0435\u0433\u043E \u0441\u0442\u0430\u0440\u0442\u0430<br>
    \u041A\u0430\u0436\u0434\u043E\u043C\u0443 \u043D\u0443\u0436\u0435\u043D \u043B\u043E\u0442\u043E\u043A \u0421\u0412\u041E\u0415\u0413\u041E \u0446\u0432\u0435\u0442\u0430 \u{1F3EE}<br>
    \u0422\u0430\u043F \u043F\u043E \u0441\u0442\u0440\u0435\u043B\u043A\u0435 \u2014 \u043F\u043E\u0432\u0435\u0440\u043D\u0443\u0442\u044C \u0435\u0451<br>
    \u041F\u0443\u0442\u0438 \u043D\u0435 \u0434\u043E\u043B\u0436\u043D\u044B \u0434\u0435\u043B\u0438\u0442\u044C \u043A\u043B\u0435\u0442\u043A\u0443 \u2014 \u0431\u0443\u0434\u0435\u0442 \u0442\u043E\u043B\u043A\u043E\u0442\u043D\u044F \u{1F4A5}<br>
    \u{1F4E6} \u044F\u0449\u0438\u043A\u0438 \u2014 \u0442\u0443\u0434\u0430 \u043D\u0435 \u043F\u0440\u043E\u0439\u0442\u0438</div>`;
    side.appendChild(legend);
    const controls = document.createElement("div");
    controls.className = "puzzle-controls";
    const btnUndo = mkBtn("\u21A9\uFE0F \u041E\u0442\u043C\u0435\u043D\u0430 (Z)", doUndo);
    const btnHint = mkBtn("\u{1F4A1} \u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430 (H)", doHint);
    const btnReset = mkBtn("\u{1F504} \u0421\u0431\u0440\u043E\u0441 (R)", doReset);
    controls.append(btnUndo, btnHint, btnReset);
    controls.appendChild(puzzleSkipButton(ctx2, level, () => ctx2.go("puzzles")));
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
      if (undoFlow(puzzle)) {
        hintTile = null;
        ctx2.sfx?.("tap");
        draw();
      }
    }
    function doReset() {
      if (finished) return;
      resetFlow(puzzle);
      hintTile = null;
      ctx2.sfx?.("tap");
      draw();
    }
    function doHint() {
      if (finished) return;
      const h = flowHint(puzzle);
      ctx2.sfx?.("hint");
      if (h.type === "rotate") {
        hintsUsed += 1;
        hintTile = h.tileIndex;
        ctx2.toast("\u041A\u043E\u0442-\u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u043A\u0438\u0432\u0430\u0435\u0442 \u043D\u0430 \u043E\u0434\u043D\u0443 \u0438\u0437 \u0441\u0442\u0440\u0435\u043B\u043E\u043A\u2026");
        draw();
      } else if (h.type === "already") {
        ctx2.toast("\u041F\u043E\u0442\u043E\u043A\u0438 \u0443\u0436\u0435 \u0440\u0430\u0437\u0432\u0435\u0434\u0435\u043D\u044B!");
      } else {
        ctx2.toast("\u0425\u043C, \u0442\u0443\u0442 \u043D\u0435 \u0440\u0430\u0437\u0432\u0435\u0441\u0442\u0438 \u043F\u043E\u0442\u043E\u043A\u0438. \u0421\u043A\u0430\u0436\u0438 \u0445\u043E\u0437\u044F\u0438\u043D\u0443 \u043B\u0430\u0432\u043A\u0438!");
      }
    }
    function onTap(ev) {
      if (finished) return;
      const rect = canvas.getBoundingClientRect();
      const scale = canvas.width / dpr / rect.width;
      const x = Math.floor((ev.clientX - rect.left) * scale / CELL5);
      const y = Math.floor((ev.clientY - rect.top) * scale / CELL5);
      const idx = level.tiles.findIndex((t) => t.pos[0] === x && t.pos[1] === y);
      if (idx >= 0 && rotateFlowTile(puzzle, idx)) {
        hintTile = null;
        ctx2.sfx?.("rotate");
        draw();
        if (isFlowSolved(puzzle)) finish();
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
          title: "\u{1F319} \u0412\u0441\u0435 \u043B\u043E\u0442\u043A\u0438 \u043E\u0431\u0441\u043B\u0443\u0436\u0435\u043D\u044B!",
          subtitle: `\xAB${level.name}\xBB \u2014 \u043D\u043E\u0447\u043D\u043E\u0439 \u0440\u044B\u043D\u043E\u043A \u0434\u043E\u0432\u043E\u043B\u0435\u043D`,
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
      g.clearRect(0, 0, gw * CELL5, gh * CELL5);
      const sim = simulateFlows(puzzle);
      const cellOwner = /* @__PURE__ */ new Map();
      sim.buyers.forEach((b, bi) => b.path.forEach(([x, y]) => {
        const key = `${x},${y}`;
        if (!cellOwner.has(key)) cellOwner.set(key, bi);
      }));
      for (let y = 0; y < gh; y++) {
        for (let x = 0; x < gw; x++) {
          g.fillStyle = (x + y) % 2 === 0 ? "#2b2e4a" : "#323654";
          g.fillRect(x * CELL5, y * CELL5, CELL5, CELL5);
        }
      }
      level.tiles.forEach((t) => {
        const px = t.pos[0] * CELL5;
        const py = t.pos[1] * CELL5;
        if (t.type === "wall") {
          g.fillStyle = "#1e2033";
          roundRect(g, px + 4, py + 4, CELL5 - 8, CELL5 - 8, 10);
          g.fill();
        } else if (t.type === "arrow") {
          g.fillStyle = "#4a4370";
          roundRect(g, px + 4, py + 4, CELL5 - 8, CELL5 - 8, 10);
          g.fill();
        }
      });
      sim.buyers.forEach((b, bi) => {
        const col = BUYER_COLORS[b.color];
        g.strokeStyle = col.css;
        g.globalAlpha = b.arrived ? 0.85 : 0.45;
        g.lineCap = "round";
        g.lineJoin = "round";
        g.lineWidth = 9;
        g.beginPath();
        b.path.forEach(([x, y], i) => {
          const cx = x * CELL5 + CELL5 / 2;
          const cy = y * CELL5 + CELL5 / 2;
          if (i === 0) g.moveTo(cx, cy);
          else g.lineTo(cx, cy);
        });
        g.stroke();
        const [hx, hy] = b.path[b.path.length - 1];
        g.fillStyle = col.css;
        g.beginPath();
        g.arc(hx * CELL5 + CELL5 / 2, hy * CELL5 + CELL5 / 2, 6, 0, Math.PI * 2);
        g.fill();
        g.globalAlpha = 1;
      });
      level.tiles.forEach((t, i) => {
        if (t.type !== "arrow") return;
        const cx = t.pos[0] * CELL5 + CELL5 / 2;
        const cy = t.pos[1] * CELL5 + CELL5 / 2;
        const owner = cellOwner.get(t.pos.join(","));
        g.fillStyle = owner !== void 0 ? BUYER_COLORS[sim.buyers[owner].color].css : "#aab0e8";
        const rot = puzzle.rot[i] ?? t.rot ?? 0;
        g.save();
        g.translate(cx, cy);
        g.rotate(Math.PI / 2 * rot);
        g.beginPath();
        g.moveTo(0, -16);
        g.lineTo(12, 2);
        g.lineTo(5, 2);
        g.lineTo(5, 15);
        g.lineTo(-5, 15);
        g.lineTo(-5, 2);
        g.lineTo(-12, 2);
        g.closePath();
        g.fill();
        g.restore();
      });
      if (hintTile !== null) {
        const t = level.tiles[hintTile];
        const cx = t.pos[0] * CELL5 + CELL5 / 2;
        const cy = t.pos[1] * CELL5 + CELL5 / 2;
        g.fillStyle = "rgba(255, 202, 122, 0.35)";
        g.beginPath();
        g.arc(cx, cy, CELL5 * 0.46, 0, Math.PI * 2);
        g.fill();
      }
      const emoji = (e, cx, cy, size = CELL5 * 0.5) => {
        g.font = `${size}px "Segoe UI Emoji", sans-serif`;
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillText(e, cx, cy);
      };
      const arrivedAt = new Set(
        sim.buyers.filter((b) => b.arrived).map((b) => b.path[b.path.length - 1].join(","))
      );
      level.tiles.forEach((t) => {
        const cx = t.pos[0] * CELL5 + CELL5 / 2;
        const cy = t.pos[1] * CELL5 + CELL5 / 2;
        if (t.type === "start") {
          const col = BUYER_COLORS[t.color ?? 0];
          g.fillStyle = col.css;
          g.globalAlpha = 0.35;
          g.beginPath();
          g.arc(cx, cy, CELL5 * 0.42, 0, Math.PI * 2);
          g.fill();
          g.globalAlpha = 1;
          emoji(col.buyer, cx, cy);
        } else if (t.type === "stall") {
          const col = BUYER_COLORS[t.color ?? 0];
          if (arrivedAt.has(t.pos.join(","))) {
            g.fillStyle = col.css;
            g.globalAlpha = 0.45;
            g.beginPath();
            g.arc(cx, cy, CELL5 * 0.42, 0, Math.PI * 2);
            g.fill();
            g.globalAlpha = 1;
          }
          g.strokeStyle = col.css;
          g.lineWidth = 4;
          g.beginPath();
          g.arc(cx, cy, CELL5 * 0.4, 0, Math.PI * 2);
          g.stroke();
          emoji("\u{1F3EE}", cx, cy);
        } else if (t.type === "wall") {
          emoji("\u{1F4E6}", cx, cy, CELL5 * 0.45);
        }
      });
      for (const key of sim.collisions) {
        const [x, y] = key.split(",").map(Number);
        g.fillStyle = "rgba(255, 80, 80, 0.45)";
        roundRect(g, x * CELL5 + 6, y * CELL5 + 6, CELL5 - 12, CELL5 - 12, 10);
        g.fill();
        emoji("\u{1F4A5}", x * CELL5 + CELL5 / 2, y * CELL5 + CELL5 / 2, CELL5 * 0.4);
      }
      const n = sim.buyers.length;
      statusEl.innerHTML = (sim.solved ? "\u2705 <b>\u0412\u0441\u0435 \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u0438 \u0443 \u0441\u0432\u043E\u0438\u0445 \u043B\u043E\u0442\u043A\u043E\u0432!</b>" : `\u{1F6CD}\uFE0F \u0423 \u043B\u043E\u0442\u043A\u043E\u0432: <b>${sim.arrivedCount} \u0438\u0437 ${n}</b>` + (sim.collisions.size > 0 ? `<br>\u{1F4A5} <b>\u0422\u043E\u043B\u043A\u043E\u0442\u043D\u044F!</b> \u041F\u0443\u0442\u0438 \u043F\u0435\u0440\u0435\u0441\u0435\u043A\u0430\u044E\u0442\u0441\u044F: ${sim.collisions.size}` : "")) + `<div class="muted" style="font-size:13px">\u0425\u043E\u0434\u044B: ${puzzle.moves} \xB7 \u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0438: ${hintsUsed}</div>`;
    }
    function roundRect(g, x, y, w, h, r) {
      g.beginPath();
      g.moveTo(x + r, y);
      g.arcTo(x + w, y, x + w, y + h, r);
      g.arcTo(x + w, y + h, x, y + h, r);
      g.arcTo(x, y + h, x, y, r);
      g.arcTo(x, y, x + w, y, r);
      g.closePath();
    }
    draw();
    return () => {
      window.removeEventListener("keydown", onKey);
      canvas.removeEventListener("pointerdown", onTap);
    };
  }

  // src/core/brewPuzzle.js
  var BREW_ACTIONS = {
    add: { icon: "\u{1FAD9}", label: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C" },
    crush: { icon: "\u{1F963}", label: "\u0420\u0430\u0441\u0442\u043E\u043B\u043E\u0447\u044C \u0432 \u0441\u0442\u0443\u043F\u0435" },
    stir: { icon: "\u{1F944}", label: "\u0420\u0430\u0437\u043C\u0435\u0448\u0430\u0442\u044C" },
    heat: { icon: "\u{1F525}", label: "\u041F\u043E\u0434\u043E\u0433\u0440\u0435\u0442\u044C" },
    cool: { icon: "\u2744\uFE0F", label: "\u041E\u0441\u0442\u0443\u0434\u0438\u0442\u044C" },
    wait: { icon: "\u23F3", label: "\u0414\u0430\u0442\u044C \u043D\u0430\u0441\u0442\u043E\u044F\u0442\u044C\u0441\u044F" }
  };
  var BREW_MAX_MISTAKES = 3;
  function createBrewPuzzle(level) {
    return {
      level,
      progress: 0,
      // сколько шагов рецепта выполнено верно
      mistakes: 0,
      // ошибки в текущей варке (3 = порча)
      spoiled: 0,
      // сколько раз зелье было испорчено
      history: [],
      // успешно выполненные действия (для отмены)
      moves: 0
    };
  }
  function sameAction(a, b) {
    return !!a && !!b && a.do === b.do && (a.ingredient ?? null) === (b.ingredient ?? null);
  }
  function stepMatches(step, action) {
    if (!step) return false;
    if (Array.isArray(step.anyOf)) return step.anyOf.some((o) => sameAction(o, action));
    return sameAction(step, action);
  }
  function expectedStep(state2) {
    return state2.level.recipe[state2.progress] || null;
  }
  function doBrewAction(state2, action) {
    if (!action || !BREW_ACTIONS[action.do]) return { ok: false, error: "\u0422\u0430\u043A \u043D\u0435 \u0432\u0430\u0440\u044F\u0442" };
    if (action.do === "add" || action.do === "crush") {
      if (!state2.level.ingredients.some((i) => i.id === action.ingredient)) {
        return { ok: false, error: "\u041D\u0430 \u0441\u0442\u043E\u043B\u0435 \u0442\u0430\u043A\u043E\u0433\u043E \u043D\u0435\u0442" };
      }
    }
    if (isBrewSolved(state2)) return { ok: false, error: "\u0417\u0435\u043B\u044C\u0435 \u0443\u0436\u0435 \u0433\u043E\u0442\u043E\u0432\u043E" };
    const exp = expectedStep(state2);
    state2.moves += 1;
    if (stepMatches(exp, action)) {
      state2.history.push({ do: action.do, ingredient: action.ingredient ?? null });
      state2.progress += 1;
      return { ok: true, solved: isBrewSolved(state2) };
    }
    state2.mistakes += 1;
    if (state2.mistakes >= BREW_MAX_MISTAKES) {
      state2.progress = 0;
      state2.history = [];
      state2.mistakes = 0;
      state2.spoiled += 1;
      return { ok: false, mistake: true, spoiled: true, expected: exp };
    }
    return { ok: false, mistake: true, spoiled: false, expected: exp };
  }
  function undoBrew(state2) {
    const last = state2.history.pop();
    if (!last) return false;
    state2.progress -= 1;
    state2.moves += 1;
    return true;
  }
  function resetBrew(state2) {
    state2.progress = 0;
    state2.mistakes = 0;
    state2.history = [];
    state2.moves += 1;
  }
  function isBrewSolved(state2) {
    return state2.progress >= state2.level.recipe.length;
  }
  function brewHint(state2) {
    const step = expectedStep(state2);
    if (!step) return { type: "already" };
    return { type: "step", step, index: state2.progress, total: state2.level.recipe.length };
  }
  function brewActionText(level, step) {
    const ing = step.ingredient ? level.ingredients.find((i) => i.id === step.ingredient) : null;
    const ingLabel = ing ? `${ing.icon} ${ing.name}` : step.ingredient || "?";
    switch (step.do) {
      case "add":
        return `\u0414\u043E\u0431\u0430\u0432\u044C ${ingLabel}`;
      case "crush":
        return `\u0420\u0430\u0441\u0442\u043E\u043B\u043A\u0438 \u0432 \u0441\u0442\u0443\u043F\u0435: ${ingLabel}`;
      case "stir":
        return "\u0420\u0430\u0437\u043C\u0435\u0448\u0430\u0439 \u043B\u043E\u0436\u043A\u043E\u0439";
      case "heat":
        return "\u041F\u043E\u0434\u043E\u0433\u0440\u0435\u0439 \u043D\u0430 \u043E\u0433\u043D\u0435";
      case "cool":
        return "\u041E\u0441\u0442\u0443\u0434\u0438 \u043A\u043E\u0442\u0451\u043B";
      case "wait":
        return "\u0414\u0430\u0439 \u043D\u0430\u0441\u0442\u043E\u044F\u0442\u044C\u0441\u044F";
      default:
        return "?";
    }
  }
  function brewStepText(level, step) {
    if (Array.isArray(step?.anyOf)) {
      return step.anyOf.map((o) => brewActionText(level, o)).join(" \u0418\u041B\u0418 ");
    }
    return brewActionText(level, step);
  }

  // src/ui/brewView.js
  var POTION_COLORS = ["#6fb7d9", "#7fc98f", "#d9c26f", "#d9915f", "#b565a8", "#6f4fa8"];
  function renderBrewPuzzle(container, ctx2, level) {
    const puzzle = createBrewPuzzle(level);
    let hintsUsed = 0;
    let hintAction = null;
    let crushMode = false;
    let finished = false;
    let recipeHidden = false;
    const timers = [];
    container.appendChild(header(ctx2, level.name, `\u0421\u043B\u043E\u0436\u043D\u043E\u0441\u0442\u044C: ${"\u2605".repeat(level.difficulty)}`, "puzzles"));
    const wrap = document.createElement("div");
    wrap.className = "puzzle-wrap";
    const scene = document.createElement("div");
    scene.className = "panel brew-scene";
    const bg = document.createElement("img");
    bg.className = "brew-table-bg";
    bg.alt = "";
    const bgCandidates = ["assets/brew_table_web.jpg", "assets/brew_table.jfif", "assets/brew_table.png"];
    let bgIdx = 0;
    bg.addEventListener("error", () => {
      bgIdx += 1;
      if (bgIdx < bgCandidates.length) bg.src = bgCandidates[bgIdx];
      else bg.remove();
    });
    bg.src = bgCandidates[0];
    scene.appendChild(bg);
    const pot = document.createElement("div");
    pot.className = "brew-pot";
    const potion = document.createElement("div");
    potion.className = "brew-potion";
    pot.appendChild(potion);
    const smoke = document.createElement("div");
    smoke.className = "brew-smoke";
    smoke.textContent = "\u{1F4A8}";
    pot.appendChild(smoke);
    const fire = document.createElement("div");
    fire.className = "brew-fire";
    pot.appendChild(fire);
    scene.appendChild(pot);
    const tools = document.createElement("div");
    tools.className = "brew-tools";
    const toolDefs = [
      { do: "stir", icon: "\u{1F944}", label: "\u0420\u0430\u0437\u043C\u0435\u0448\u0430\u0442\u044C" },
      { do: "heat", icon: "\u{1F525}", label: "\u041F\u043E\u0434\u043E\u0433\u0440\u0435\u0442\u044C" },
      { do: "cool", icon: "\u2744\uFE0F", label: "\u041E\u0441\u0442\u0443\u0434\u0438\u0442\u044C" },
      { do: "wait", icon: "\u23F3", label: "\u041D\u0430\u0441\u0442\u043E\u044F\u0442\u044C\u0441\u044F" }
    ];
    const toolBtns = {};
    for (const t of toolDefs) {
      const b = document.createElement("button");
      b.className = "small";
      b.innerHTML = `${t.icon} ${t.label}`;
      b.addEventListener("click", () => onAction({ do: t.do }));
      tools.appendChild(b);
      toolBtns[t.do] = b;
    }
    const mortar = document.createElement("button");
    mortar.className = "small";
    mortar.innerHTML = "\u{1F963} \u0421\u0442\u0443\u043F\u043A\u0430";
    mortar.title = "\u0416\u043C\u0438 \u0441\u0442\u0443\u043F\u043A\u0443, \u043F\u043E\u0442\u043E\u043C \u2014 \u0447\u0442\u043E \u0440\u0430\u0441\u0442\u043E\u043B\u043E\u0447\u044C";
    mortar.addEventListener("click", () => {
      crushMode = !crushMode;
      ctx2.sfx?.("tap");
      draw();
    });
    tools.appendChild(mortar);
    scene.appendChild(tools);
    const ingRow = document.createElement("div");
    ingRow.className = "brew-ings";
    scene.appendChild(ingRow);
    wrap.appendChild(scene);
    const side = document.createElement("div");
    side.className = "puzzle-side";
    const intro = document.createElement("div");
    intro.className = "intro-text";
    intro.textContent = level.intro;
    side.appendChild(intro);
    const book = document.createElement("div");
    book.className = "brew-book";
    const bookBg = document.createElement("img");
    bookBg.className = "brew-book-bg";
    bookBg.alt = "";
    bookBg.addEventListener("error", () => bookBg.remove());
    bookBg.src = "assets/recipe_book_web.jpg";
    book.appendChild(bookBg);
    side.appendChild(book);
    const statusEl = document.createElement("div");
    statusEl.className = "puzzle-status";
    side.appendChild(statusEl);
    const controls = document.createElement("div");
    controls.className = "puzzle-controls";
    controls.style.marginTop = "10px";
    const btnUndo = mkBtn("\u21A9\uFE0F \u041E\u0442\u043C\u0435\u043D\u0430 (Z)", doUndo);
    const btnHint = mkBtn("\u{1F4A1} \u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430 (H)", doHint);
    const btnReset = mkBtn("\u{1F504} \u0417\u0430\u043D\u043E\u0432\u043E (R)", doReset);
    controls.append(btnUndo, btnHint, btnReset);
    controls.appendChild(puzzleSkipButton(ctx2, level, () => ctx2.go("puzzles")));
    side.appendChild(controls);
    wrap.appendChild(side);
    container.appendChild(wrap);
    function mkBtn(label, fn) {
      const b = document.createElement("button");
      b.innerHTML = label;
      b.addEventListener("click", fn);
      return b;
    }
    if (level.hideRecipe) {
      recipeHidden = false;
      const peek = document.createElement("div");
      peek.className = "overlay";
      peek.innerHTML = `
      <div class="card">
        <h2>\u{1F4D6} \u0417\u0430\u043F\u043E\u043C\u0438\u043D\u0430\u0439!</h2>
        <div class="muted">\u041A\u043D\u0438\u0433\u0430 \u0437\u0430\u043A\u0440\u043E\u0435\u0442\u0441\u044F \u0447\u0435\u0440\u0435\u0437 <b>${level.peekSeconds}</b> \u0441\u0435\u043A\u2026</div>
        <div class="brew-peek-list">${level.recipe.map((s, i) => `<div>${i + 1}. ${brewStepText(level, s)}</div>`).join("")}</div>
      </div>`;
      document.body.appendChild(peek);
      ctx2.sfx?.("page");
      timers.push(setTimeout(() => {
        peek.remove();
        recipeHidden = true;
        ctx2.toast("\u{1F4D5} \u041A\u043D\u0438\u0433\u0430 \u0437\u0430\u043A\u0440\u044B\u043B\u0430\u0441\u044C. \u0414\u0430\u043B\u044C\u0448\u0435 \u2014 \u043F\u043E \u043F\u0430\u043C\u044F\u0442\u0438! \u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430 \u043D\u0430\u043F\u043E\u043C\u043D\u0438\u0442 \u0448\u0430\u0433.");
        draw();
      }, level.peekSeconds * 1e3));
      peek.addEventListener("click", () => {
        peek.remove();
        recipeHidden = true;
        draw();
      });
    }
    function heatLevel() {
      let n = 0;
      for (const h of puzzle.history) {
        if (h.do === "heat") n = Math.min(3, n + 1);
        if (h.do === "cool") n = 0;
      }
      return n;
    }
    function doUndo() {
      if (finished) return;
      if (undoBrew(puzzle)) {
        hintAction = null;
        ctx2.sfx?.("tap");
        draw();
      }
    }
    function doReset() {
      if (finished) return;
      resetBrew(puzzle);
      hintAction = null;
      crushMode = false;
      ctx2.sfx?.("tap");
      draw();
    }
    function doHint() {
      if (finished) return;
      const h = brewHint(puzzle);
      if (h.type === "step") {
        hintsUsed += 1;
        hintAction = h.step;
        ctx2.sfx?.("hint");
        ctx2.toast(`\u041A\u043E\u0442-\u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u0448\u0435\u043F\u0447\u0435\u0442: \xAB${brewStepText(level, h.step)}\xBB`);
        draw();
      } else {
        ctx2.toast("\u0417\u0435\u043B\u044C\u0435 \u0443\u0436\u0435 \u0433\u043E\u0442\u043E\u0432\u043E!");
      }
    }
    function onAction(action) {
      if (finished) return;
      if (action.do === "add" && crushMode) {
        action = { do: "crush", ingredient: action.ingredient };
        crushMode = false;
      }
      const r = doBrewAction(puzzle, action);
      if (r.ok) {
        hintAction = null;
        ctx2.sfx?.(action.do === "add" || action.do === "crush" ? "potion" : "bubble");
        pulsePot();
        draw();
        if (r.solved) finish();
        return;
      }
      if (r.mistake) {
        ctx2.sfx?.("tap");
        puffSmoke();
        if (r.spoiled) {
          ctx2.toast("\u{1F4A8} \u0417\u0435\u043B\u044C\u0435 \u0438\u0441\u043F\u043E\u0440\u0447\u0435\u043D\u043E! \u041F\u0443\u0437\u044B\u0440\u0438\u0442\u0441\u044F \u0447\u0451\u0440\u043D\u044B\u043C\u2026 \u0412\u0430\u0440\u0438\u043C \u0437\u0430\u043D\u043E\u0432\u043E.");
        } else {
          ctx2.toast(`\u041D\u0435 \u0442\u043E\u0442 \u0448\u0430\u0433! \u041E\u0448\u0438\u0431\u043A\u0430 ${puzzle.mistakes} \u0438\u0437 ${BREW_MAX_MISTAKES}. \u041A\u043E\u0442 \u043C\u043E\u0440\u0449\u0438\u0442\u0441\u044F \u043E\u0442 \u0437\u0430\u043F\u0430\u0445\u0430.`);
        }
        draw();
        return;
      }
      ctx2.toast(r.error || "\u041D\u0435 \u0432\u044B\u0445\u043E\u0434\u0438\u0442");
    }
    function pulsePot() {
      pot.classList.remove("bubble");
      void pot.offsetWidth;
      pot.classList.add("bubble");
      timers.push(setTimeout(() => pot.classList.remove("bubble"), 900));
    }
    function puffSmoke() {
      smoke.classList.remove("puff");
      void smoke.offsetWidth;
      smoke.classList.add("puff");
      pot.classList.remove("shake");
      void pot.offsetWidth;
      pot.classList.add("shake");
      timers.push(setTimeout(() => {
        smoke.classList.remove("puff");
        pot.classList.remove("shake");
      }, 900));
    }
    function finish() {
      finished = true;
      const rewards = completePuzzle(ctx2.state, level.id, { moves: puzzle.moves, hintsUsed });
      ctx2.save();
      ctx2.sfx?.("success");
      draw();
      setTimeout(() => {
        const next = nextPuzzle(level.id);
        showOverlay(ctx2, {
          title: "\u2697\uFE0F \u0417\u0435\u043B\u044C\u0435 \u043F\u043E\u043B\u0443\u0447\u0438\u043B\u043E\u0441\u044C!",
          subtitle: `\xAB${level.name}\xBB \u2014 \u0441\u0432\u0430\u0440\u0435\u043D\u043E \u043F\u043E \u0432\u0441\u0435\u043C \u043F\u0440\u0430\u0432\u0438\u043B\u0430\u043C${puzzle.spoiled ? ` (\u0438\u0441\u043F\u043E\u0440\u0447\u0435\u043D\u043E \u043A\u043E\u0442\u043B\u043E\u0432: ${puzzle.spoiled})` : ""}`,
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
      const total = level.recipe.length;
      const ci = Math.min(POTION_COLORS.length - 1, Math.floor(puzzle.progress / total * POTION_COLORS.length));
      potion.style.background = POTION_COLORS[puzzle.progress === 0 ? 0 : ci];
      potion.style.height = `${20 + puzzle.progress / total * 65}%`;
      const hl = heatLevel();
      fire.textContent = hl > 0 ? "\u{1F525}".repeat(hl) : "";
      mortar.className = "small" + (crushMode ? " primary" : "");
      mortar.innerHTML = crushMode ? "\u{1F963} \u0427\u0442\u043E \u0442\u043E\u043B\u0447\u0451\u043C?" : "\u{1F963} \u0421\u0442\u0443\u043F\u043A\u0430";
      const hintOpts = hintAction ? Array.isArray(hintAction.anyOf) ? hintAction.anyOf : [hintAction] : [];
      ingRow.innerHTML = "";
      for (const ing of level.ingredients) {
        const b = document.createElement("button");
        b.className = "small brew-ing";
        const isHint = hintOpts.some((o) => (o.do === "add" || o.do === "crush") && o.ingredient === ing.id);
        if (isHint) b.className += " primary";
        b.innerHTML = `${ing.icon} ${ing.name}`;
        b.title = crushMode ? `\u0420\u0430\u0441\u0442\u043E\u043B\u043E\u0447\u044C: ${ing.name}` : ing.name;
        b.addEventListener("click", () => onAction({ do: "add", ingredient: ing.id }));
        ingRow.appendChild(b);
      }
      for (const [d, btn] of Object.entries(toolBtns)) {
        btn.className = "small" + (hintOpts.some((o) => o.do === d) ? " primary" : "");
      }
      book.innerHTML = '<div class="brew-book-title">\u{1F4D6} \u0420\u0435\u0446\u0435\u043F\u0442</div>';
      level.recipe.forEach((s, i) => {
        const row = document.createElement("div");
        const done = i < puzzle.progress;
        const current = i === puzzle.progress && !finished;
        row.className = "brew-step" + (done ? " done" : "") + (current ? " current" : "");
        const hidden = recipeHidden && !done;
        row.textContent = done ? `${i + 1}. ${brewStepText(level, s)} \u2713` : hidden ? `${i + 1}. \xB7 \xB7 \xB7` : `${i + 1}. ${brewStepText(level, s)}`;
        book.appendChild(row);
      });
      if (recipeHidden) {
        const note = document.createElement("div");
        note.className = "brew-book-note";
        note.textContent = "\u{1F4D5} \u041A\u043D\u0438\u0433\u0430 \u0437\u0430\u043A\u0440\u044B\u0442\u0430 \u2014 \u043F\u043E \u043F\u0430\u043C\u044F\u0442\u0438!";
        book.appendChild(note);
      }
      const hearts = "\u2716".repeat(puzzle.mistakes) + "\u2796".repeat(Math.max(0, BREW_MAX_MISTAKES - puzzle.mistakes));
      statusEl.innerHTML = `\u2697\uFE0F \u0428\u0430\u0433 <b>${Math.min(puzzle.progress + (finished ? 0 : 1), total)} \u0438\u0437 ${total}</b> \xB7 \u041E\u0448\u0438\u0431\u043A\u0438: ${hearts}` + (puzzle.spoiled ? ` \xB7 <span class="warn">\u0438\u0441\u043F\u043E\u0440\u0447\u0435\u043D\u043E \u043A\u043E\u0442\u043B\u043E\u0432: ${puzzle.spoiled}</span>` : "") + `<div class="muted" style="font-size:13px">\u0425\u043E\u0434\u044B: ${puzzle.moves} \xB7 \u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0438: ${hintsUsed}</div>`;
    }
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
    draw();
    return () => {
      window.removeEventListener("keydown", onKey);
      for (const t of timers) clearTimeout(t);
    };
  }

  // src/ui/puzzleView.js
  var WORLD_LABEL = {
    meadow: "\u{1F33F} \u0422\u0438\u0445\u0430\u044F \u043E\u043F\u0443\u0448\u043A\u0430 \u2014 \u0441\u0432\u0435\u0442 \u0438 \u0444\u043E\u043D\u0430\u0440\u0438\u043A\u0438 \xB7 \u043F\u043E\u0438\u0441\u043A \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u043E\u0432",
    town: "\u{1F3F0} \u0421\u0440\u0435\u0434\u043D\u0435\u0432\u0435\u043A\u043E\u0432\u044B\u0439 \u0434\u0432\u043E\u0440\u0438\u043A \u2014 \u043F\u043E\u043B\u043A\u0438 \u0438 \u0442\u043E\u0432\u0430\u0440\u044B \xB7 \u043F\u043E\u0438\u0441\u043A \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u043E\u0432",
    attic: "\u{1F4D6} \u041A\u043D\u0438\u0436\u043D\u044B\u0439 \u0447\u0435\u0440\u0434\u0430\u043A \u2014 \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u0444\u0440\u0430\u0437 \xB7 \u043F\u043E\u0438\u0441\u043A \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u043E\u0432",
    crossroads: "\u{1F31F} \u041F\u0435\u0440\u0435\u043A\u0440\u0451\u0441\u0442\u043E\u043A \u043C\u0438\u0440\u043E\u0432 \u2014 \u0442\u0440\u043E\u043F\u0438\u043D\u043A\u0438 \u0438 \u0447\u0430\u0439",
    nm: "\u{1F303} \u041D\u043E\u0447\u043D\u043E\u0439 \u0440\u044B\u043D\u043E\u043A \u2014 \u043F\u043E\u0438\u0441\u043A \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u043E\u0432",
    sw: "\u{1F438} \u0421\u043A\u0430\u0437\u043E\u0447\u043D\u044B\u0435 \u0442\u043E\u043F\u0438 \u2014 \u043F\u043E\u0438\u0441\u043A \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u043E\u0432",
    sf: "\u{1F3AA} \u0417\u0432\u0451\u0437\u0434\u043D\u0430\u044F \u044F\u0440\u043C\u0430\u0440\u043A\u0430 \u2014 \u043F\u043E\u0438\u0441\u043A \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u043E\u0432",
    ash: "\u{1F525} \u041A\u0443\u0437\u043D\u0438\u0446\u0430 \u2014 \u043F\u043E\u0438\u0441\u043A \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u043E\u0432",
    cr: "\u{1F48E} \u0425\u0440\u0443\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0435 \u0433\u043E\u0440\u044B \u2014 \u043F\u043E\u0438\u0441\u043A \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u043E\u0432",
    jade: "\u{1F38B} \u041D\u0435\u0444\u0440\u0438\u0442\u043E\u0432\u044B\u0439 \u0441\u0430\u0434 \u2014 \u043F\u043E\u0438\u0441\u043A \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u043E\u0432",
    deep: "\u{1F41A} \u041F\u043E\u0434\u0432\u043E\u0434\u043D\u044B\u0439 \u0433\u0440\u043E\u0442 \u2014 \u043F\u043E\u0438\u0441\u043A \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u043E\u0432",
    mist: "\u23F3 \u0422\u0443\u043C\u0430\u043D\u043D\u044B\u0435 \u0447\u0430\u0441\u044B \u2014 \u043F\u043E\u0438\u0441\u043A \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u043E\u0432",
    brew: "\u2697\uFE0F \u0410\u043B\u0445\u0438\u043C\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0441\u0442\u043E\u043B \u2014 \u0432\u0430\u0440\u043A\u0430 \u0437\u0435\u043B\u0438\u0439 \u043F\u043E \u0440\u0435\u0446\u0435\u043F\u0442\u0443"
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
      const dailyClaimed = state2.lastDailyBonus === todayKey();
      const isDaily = available && !done && !dailyClaimed && isDailyPuzzle(state2, p.id);
      row.innerHTML = `
      <span class="icon">${available ? done ? "\u{1F3EE}" : "\u{1F9E9}" : "\u{1F512}"}</span>
      <span class="grow">
        <div class="name">${i + 1}. ${p.name} <span class="badge">${stars}</span>${isDaily ? ' <span class="badge new-badge">\u0437\u0430\u043A\u0430\u0437 \u0434\u043D\u044F \xD72</span>' : ""}</div>
        <div class="desc">${available ? p.intro : "\u0420\u0435\u0448\u0438 \u043F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0443\u044E \u0437\u0430\u0433\u0430\u0434\u043A\u0443, \u0447\u0442\u043E\u0431\u044B \u043E\u0442\u043A\u0440\u044B\u0442\u044C."}</div>
      </span>`;
      if (available) {
        const btn = document.createElement("button");
        btn.textContent = done ? "\u0415\u0449\u0451 \u0440\u0430\u0437" : "\u0420\u0435\u0448\u0430\u0442\u044C";
        btn.addEventListener("click", () => ctx2.go("puzzle", { id: p.id }));
        row.appendChild(btn);
        if (!done) {
          const skipBtn = puzzleSkipButton(ctx2, p, () => {
            container.innerHTML = "";
            renderPuzzleList(container, ctx2);
          });
          skipBtn.className = "small ghost";
          row.appendChild(skipBtn);
        }
      }
      list.appendChild(row);
    });
    container.appendChild(list);
    container.appendChild(quickNav(ctx2, [
      { icon: "\u{1F4D6}", label: "\u041A\u043D\u0438\u0433\u0430 \u0440\u0435\u0446\u0435\u043F\u0442\u043E\u0432", screen: "brewbook" },
      { icon: "\u{1F3E0}", label: "\u0412 \u043B\u0430\u0432\u043A\u0443", screen: "hub" }
    ]));
    const targetRow = list.querySelector?.('[data-scroll-target="1"]');
    if (targetRow && targetRow.scrollIntoView) {
      setTimeout(() => targetRow.scrollIntoView({ block: "center", behavior: "smooth" }), 60);
    }
  }
  var CELL6 = 64;
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
    if (level.mechanic === "path") {
      return renderPathPuzzle(container, ctx2, level);
    }
    if (level.mechanic === "tea") {
      return renderTeaPuzzle(container, ctx2, level);
    }
    if (level.mechanic === "mech") {
      return renderMechPuzzle(container, ctx2, level);
    }
    if (level.mechanic === "candle") {
      return renderCandlePuzzle(container, ctx2, level);
    }
    if (level.mechanic === "flow") {
      return renderFlowPuzzle(container, ctx2, level);
    }
    if (level.mechanic === "brew") {
      return renderBrewPuzzle(container, ctx2, level);
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
    canvas.width = gw * CELL6 * dpr;
    canvas.height = gh * CELL6 * dpr;
    canvas.style.width = `${gw * CELL6}px`;
    canvas.style.height = `${gh * CELL6}px`;
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
    controls.appendChild(puzzleSkipButton(ctx2, level, () => ctx2.go("puzzles")));
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
      const x = Math.floor(cx / CELL6);
      const y = Math.floor(cy / CELL6);
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
      g.clearRect(0, 0, gw * CELL6, gh * CELL6);
      const { lanternsLit, mothsAwake, beams } = traceLight(puzzle);
      for (let y = 0; y < gh; y++) {
        for (let x = 0; x < gw; x++) {
          g.fillStyle = (x + y) % 2 === 0 ? "#3a5232" : "#425c38";
          g.fillRect(x * CELL6, y * CELL6, CELL6, CELL6);
        }
      }
      g.save();
      g.lineCap = "round";
      for (const pass of [{ w: 12, a: 0.18 }, { w: 5, a: 0.85 }]) {
        g.strokeStyle = `rgba(255, 226, 138, ${pass.a})`;
        g.lineWidth = pass.w;
        for (const b of beams) {
          g.beginPath();
          g.moveTo(b.from[0] * CELL6 + CELL6 / 2, b.from[1] * CELL6 + CELL6 / 2);
          g.lineTo(b.to[0] * CELL6 + CELL6 / 2, b.to[1] * CELL6 + CELL6 / 2);
          g.stroke();
        }
      }
      g.restore();
      level.objects.forEach((o, i) => {
        const cx = o.pos[0] * CELL6 + CELL6 / 2;
        const cy = o.pos[1] * CELL6 + CELL6 / 2;
        const emoji = (e, size = CELL6 * 0.62) => {
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
            g.font = `bold ${CELL6 * 0.3}px sans-serif`;
            g.fillText(dirs[o.dir], cx + CELL6 * 0.28, cy - CELL6 * 0.28);
            break;
          }
          case "mirror": {
            const orient = puzzle.orient[i];
            if (hintCell && hintCell[0] === o.pos[0] && hintCell[1] === o.pos[1]) {
              g.fillStyle = "rgba(255, 202, 122, 0.35)";
              g.beginPath();
              g.arc(cx, cy, CELL6 * 0.46, 0, Math.PI * 2);
              g.fill();
            }
            g.save();
            g.translate(cx, cy);
            g.rotate(orient === 0 ? Math.PI / 4 : -Math.PI / 4);
            g.fillStyle = "#8a6f4d";
            g.fillRect(-CELL6 * 0.3, -3, CELL6 * 0.6, 6);
            g.fillStyle = "#cfe8ff";
            g.fillRect(-CELL6 * 0.3, -5, CELL6 * 0.6, 4);
            g.restore();
            emoji("\u{1FA9E}", CELL6 * 0.3);
            break;
          }
          case "lantern": {
            if (lanternsLit.has(i)) {
              g.fillStyle = "rgba(255, 214, 120, 0.35)";
              g.beginPath();
              g.arc(cx, cy, CELL6 * 0.48, 0, Math.PI * 2);
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
              g.fillRect(o.pos[0] * CELL6, o.pos[1] * CELL6, CELL6, CELL6);
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
    const dollPanel = document.createElement("div");
    dollPanel.className = "panel";
    dollPanel.style.textAlign = "center";
    dollPanel.innerHTML = "<h3>\u0420\u044B\u0446\u0430\u0440\u044C</h3>";
    const doll = document.createElement("canvas");
    doll.width = 220;
    doll.height = 280;
    doll.style.maxWidth = "100%";
    dollPanel.appendChild(doll);
    drawKnightDoll(doll, state2);
    layout.appendChild(dollPanel);
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
    const { stats, traits, activeSets } = collectStats(state2.equipped);
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
    if ((activeSets || []).length > 0) {
      const setBox = document.createElement("div");
      setBox.className = "panel mt";
      setBox.style.background = "#3d3328";
      setBox.innerHTML = '<h3 style="margin-top:0">\u2728 \u0421\u0435\u0442\u043E\u0432\u044B\u0435 \u044D\u0444\u0444\u0435\u043A\u0442\u044B</h3>' + activeSets.map(
        (st) => `<div style="font-size:14px;margin-bottom:4px"><b>\u0421\u0435\u0442 \xAB${st.name}\xBB ${st.count}/9</b> \xB7 \u0442\u0438\u0440 ${st.tier}: <span class="muted">${st.desc}</span></div>`
      ).join("");
      statsPanel.appendChild(setBox);
    }
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
  var RARITY_PAL = {
    common: { main: "#8a7a62", dark: "#5d4732", trim: "#6b553a" },
    rare: { main: "#6a7fa0", dark: "#44536e", trim: "#a8d8ff" },
    epic: { main: "#7a5a9a", dark: "#553d6d", trim: "#d3a8ff" },
    legendary: { main: "#b8902a", dark: "#8a6a1a", trim: "#ffd98a" }
  };
  function drawKnightDoll(canvas, state2) {
    const g = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const eq = state2.equipped;
    const item2 = (slot) => eq[slot] ? ITEM_BY_ID[eq[slot]] : null;
    const pal = (it) => RARITY_PAL[it?.rarity] || RARITY_PAL.common;
    const cx = W / 2;
    const bg = g.createRadialGradient(cx, H * 0.35, 30, cx, H * 0.45, W * 0.75);
    bg.addColorStop(0, "rgba(255, 202, 122, 0.20)");
    bg.addColorStop(1, "rgba(255, 202, 122, 0)");
    g.fillStyle = bg;
    g.fillRect(0, 0, W, H);
    g.fillStyle = "rgba(0,0,0,0.3)";
    g.beginPath();
    g.ellipse(cx, H * 0.92, 62, 10, 0, 0, Math.PI * 2);
    g.fill();
    const el = (x, y, rx, ry, fill) => {
      g.fillStyle = fill;
      g.beginPath();
      g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      g.fill();
    };
    const rr = (x, y, w, h, r, fill) => {
      g.fillStyle = fill;
      g.beginPath();
      g.moveTo(x + r, y);
      g.arcTo(x + w, y, x + w, y + h, r);
      g.arcTo(x + w, y + h, x, y + h, r);
      g.arcTo(x, y + h, x, y, r);
      g.arcTo(x, y, x + w, y, r);
      g.closePath();
      g.fill();
    };
    const boots = item2("boots");
    const legCol = boots ? pal(boots).dark : "#4a3a29";
    rr(cx - 26, H * 0.62, 20, 52, 7, legCol);
    rr(cx + 6, H * 0.62, 20, 52, 7, legCol);
    const bootCol = boots ? pal(boots).main : "#6b5335";
    rr(cx - 28, H * 0.79, 26, 20, 6, bootCol);
    rr(cx + 4, H * 0.79, 26, 20, 6, bootCol);
    rr(cx - 28, H * 0.79, 26, 6, 4, boots ? pal(boots).trim : "#4a3a29");
    rr(cx + 4, H * 0.79, 26, 6, 4, boots ? pal(boots).trim : "#4a3a29");
    const armor = item2("armor");
    const torsoY = H * 0.4;
    const torsoH = 82;
    const drawTorso = (main, dark, style) => {
      rr(cx - 36, torsoY, 72, torsoH, 20, main);
      el(cx - 40, torsoY + 14, 14, 12, dark);
      el(cx + 40, torsoY + 14, 14, 12, dark);
      if (style === "mail") {
        g.fillStyle = "rgba(0,0,0,0.18)";
        for (let yy = torsoY + 10; yy < torsoY + torsoH - 8; yy += 9) {
          for (let xx = cx - 30; xx < cx + 32; xx += 9) {
            g.fillRect(xx, yy, 3, 3);
          }
        }
      }
      if (style === "plates") {
        g.fillStyle = dark;
        for (let yy = torsoY + 16; yy < torsoY + torsoH - 6; yy += 18) g.fillRect(cx - 32, yy, 64, 5);
      }
      if (style === "cloth") {
        g.strokeStyle = dark;
        g.lineWidth = 2;
        g.setLineDash([5, 5]);
        g.beginPath();
        g.moveTo(cx, torsoY + 6);
        g.lineTo(cx, torsoY + torsoH - 8);
        g.stroke();
        g.setLineDash([]);
      }
      if (style === "robe") {
        g.fillStyle = dark;
        g.beginPath();
        g.moveTo(cx - 36, torsoY + 20);
        g.lineTo(cx + 36, torsoY + 20);
        g.lineTo(cx + 30, torsoY + torsoH + 18);
        g.lineTo(cx - 30, torsoY + torsoH + 18);
        g.closePath();
        g.fill();
      }
    };
    switch (armor?.id) {
      case "arm_padded":
        drawTorso("#a08a62", "#6b5535", "cloth");
        break;
      case "arm_oak_guardian":
        drawTorso("#7a5a38", "#4a3a24", "plates");
        break;
      case "arm_silken":
        drawTorso("#6fae9d", "#4a7a6d", "cloth");
        break;
      case "arm_chain":
        drawTorso("#7d94b8", "#4a5a78", "mail");
        break;
      case "arm_ink_cloak":
        drawTorso("#4a3a5a", "#332844", "robe");
        break;
      case "arm_master":
        drawTorso("#3a5a8a", "#27405e", "plates");
        break;
      default: {
        if (armor) drawTorso(pal(armor).main, pal(armor).dark, "mail");
        else drawTorso("#8a7a62", "#6b5a48", "cloth");
      }
    }
    el(cx, torsoY + 6, 22, 8, armor ? pal(armor).trim : "#6b5a48");
    rr(cx - 34, torsoY + torsoH - 16, 68, 9, 3, "#3a2c1c");
    state2.consumableBelt.forEach((id, i) => {
      const px = cx - 22 + i * 16;
      rr(px, torsoY + torsoH - 10, 8, 14, 3, "#7a4a5a");
      rr(px + 2, torsoY + torsoH - 14, 4, 5, 2, "#c9b294");
    });
    const headY = H * 0.27;
    el(cx, headY, 24, 26, "#d9b98a");
    const helm = item2("helmet");
    switch (helm?.id) {
      case void 0:
      case null:
        el(cx, headY - 12, 24, 14, "#6b4a2f");
        el(cx - 8, headY + 2, 3, 4, "#33241a");
        el(cx + 8, headY + 2, 3, 4, "#33241a");
        g.strokeStyle = "#8a5a3a";
        g.lineWidth = 2;
        g.beginPath();
        g.arc(cx, headY + 6, 9, 0.2, Math.PI - 0.2);
        g.stroke();
        break;
      case "hlm_leather":
        el(cx, headY - 10, 26, 18, "#7a5a3a");
        rr(cx - 26, headY - 12, 52, 10, 5, "#5d4732");
        break;
      case "hlm_badger":
        el(cx, headY - 8, 26, 16, "#8a9098");
        el(cx - 16, headY - 22, 7, 9, "#8a9098");
        el(cx + 16, headY - 22, 7, 9, "#8a9098");
        rr(cx - 26, headY - 12, 52, 8, 4, "#6a7078");
        break;
      case "hlm_kettle":
        el(cx, headY - 10, 22, 16, "#9aa2ac");
        rr(cx - 30, headY - 12, 60, 7, 3, "#7a828c");
        rr(cx - 4, headY - 26, 8, 6, 2, "#c9b294");
        break;
      case "hlm_page_wanderer":
        g.fillStyle = "#4a3a5a";
        g.beginPath();
        g.moveTo(cx - 24, headY - 8);
        g.quadraticCurveTo(cx, headY - 52, cx + 24, headY - 8);
        g.closePath();
        g.fill();
        rr(cx - 26, headY - 10, 52, 8, 4, "#332844");
        el(cx + 6, headY - 30, 3, 4, "#ffd98a");
        break;
      case "hlm_master":
        rr(cx - 20, headY - 16, 40, 7, 3, "#c9a227");
        el(cx, headY - 14, 4, 5, "#ffd98a");
        break;
      default:
        el(cx, headY - 8, 26, 16, pal(helm).main);
        rr(cx - 26, headY - 12, 52, 8, 4, pal(helm).dark);
    }
    const glv = item2("gloves");
    const handCol = glv ? pal(glv).main : "#d9b98a";
    const wpn = item2("weapon");
    const twoHanded = wpn?.hand === "two";
    if (!twoHanded) {
      el(cx - 40, torsoY + 40, 9, 10, handCol);
      el(cx + 40, torsoY + 40, 9, 10, handCol);
      if (item2("ring1")) {
        el(cx - 40, torsoY + 34, 3, 3, "#ffd98a");
      }
      if (item2("ring2")) {
        el(cx + 40, torsoY + 34, 3, 3, "#ffd98a");
      }
    }
    if (wpn) {
      const steel = "#c8d4dc";
      const steelDark = "#8a98a4";
      const angle = twoHanded ? -0.44 : -0.28;
      const ax = cx - 46;
      const ay = torsoY + 46;
      g.save();
      g.translate(ax, ay);
      g.rotate(angle);
      g.shadowColor = "rgba(0,0,0,0.4)";
      g.shadowBlur = 4;
      switch (wpn.type) {
        case "sword":
          rr(-4.5, -106, 9, 98, 4.5, steel);
          g.beginPath();
          g.moveTo(0, -114);
          g.lineTo(6, -104);
          g.lineTo(-6, -104);
          g.closePath();
          g.fillStyle = steel;
          g.fill();
          rr(-18, -12, 36, 7, 3, "#c9a227");
          rr(-3, -5, 6, 22, 3, "#4a3a29");
          break;
        case "mace":
          rr(-3.5, -72, 7, 72, 3, "#6b5335");
          el(0, -84, 18, 18, steelDark);
          g.fillStyle = steelDark;
          for (let a = 0; a < 8; a++) {
            const ang = a / 8 * Math.PI * 2;
            g.beginPath();
            g.arc(Math.cos(ang) * 18, -84 + Math.sin(ang) * 18, 4, 0, Math.PI * 2);
            g.fill();
          }
          el(0, -84, 7, 7, steel);
          break;
        case "dagger":
          rr(-3.5, -64, 7, 60, 3.5, steel);
          g.beginPath();
          g.moveTo(0, -72);
          g.lineTo(5, -62);
          g.lineTo(-5, -62);
          g.closePath();
          g.fillStyle = steel;
          g.fill();
          rr(-12, -8, 24, 6, 3, "#c9a227");
          rr(-2.5, -2, 5, 15, 2, "#4a3a29");
          break;
        case "greatsword":
          rr(-7.5, -138, 15, 126, 7, steel);
          rr(-7.5, -138, 15, 20, 7, steelDark);
          rr(-22, -16, 44, 9, 4, "#c9a227");
          rr(-4.5, -7, 9, 26, 4, "#4a3a29");
          el(0, -128, 5, 5, "#ffd98a");
          break;
        case "greataxe":
          rr(-4, -100, 8, 96, 4, "#6b5335");
          g.fillStyle = steel;
          g.beginPath();
          g.moveTo(-4, -98);
          g.quadraticCurveTo(-44, -88, -36, -52);
          g.lineTo(-4, -62);
          g.closePath();
          g.fill();
          rr(-8, -106, 16, 7, 3, steelDark);
          break;
        case "bow": {
          g.strokeStyle = "#8a5a3a";
          g.lineWidth = 5.5;
          g.lineCap = "round";
          g.beginPath();
          g.moveTo(0, -88);
          g.quadraticCurveTo(-24, -52, -18, -6);
          g.quadraticCurveTo(-14, 40, 0, 76);
          g.stroke();
          g.strokeStyle = "#a06a42";
          g.lineWidth = 2;
          g.beginPath();
          g.moveTo(0, -86);
          g.quadraticCurveTo(-21, -52, -16, -7);
          g.quadraticCurveTo(-12, 38, 0, 74);
          g.stroke();
          g.strokeStyle = "#d9cdb8";
          g.lineWidth = 1.6;
          g.beginPath();
          g.moveTo(0, -88);
          g.lineTo(0, 76);
          g.stroke();
          rr(-21, -14, 8, 16, 3, "#4a3a29");
          g.strokeStyle = "#c9b294";
          g.lineWidth = 2.5;
          g.beginPath();
          g.moveTo(4, -4);
          g.lineTo(-28, -9);
          g.stroke();
          g.fillStyle = steel;
          g.beginPath();
          g.moveTo(-36, -10);
          g.lineTo(-27, -13);
          g.lineTo(-27, -6);
          g.closePath();
          g.fill();
          g.strokeStyle = "#e8dcc8";
          g.lineWidth = 1.6;
          g.beginPath();
          g.moveTo(2, -4);
          g.lineTo(-3, -11);
          g.moveTo(3, -2);
          g.lineTo(-1, 4);
          g.stroke();
          break;
        }
        case "staff":
          rr(-4, -110, 6, 108, 3, "#5d4732");
          el(0, -114, 13, 13, "#ffb85a");
          el(0, -114, 22, 22, "rgba(255,184,90,0.35)");
          el(0, -114, 5, 5, "#fff2be");
          break;
        default:
          rr(-4.5, -106, 9, 98, 4.5, steel);
          rr(-18, -12, 36, 7, 3, "#c9a227");
          rr(-3, -5, 6, 22, 3, "#4a3a29");
      }
      g.restore();
      if (twoHanded) {
        const GRIP2H = {
          greatsword: [[0, -2], [0, 16]],
          greataxe: [[0, -34], [0, -8]],
          staff: [[0, -44], [0, -14]],
          bow: [[-17, -6], [2, -4]]
          // рука на рукояти лука и на тетиве
        };
        const grips = GRIP2H[wpn.type] || [[0, -2], [0, 20]];
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const toWorld = ([x, y]) => [ax + x * cos - y * sin, ay + x * sin + y * cos];
        const [h1, h2] = grips.map(toWorld);
        g.shadowColor = "rgba(0,0,0,0.4)";
        g.shadowBlur = 4;
        el(h1[0], h1[1], 9, 10, handCol);
        el(h2[0], h2[1], 9, 10, handCol);
        if (item2("ring1")) el(h2[0], h2[1] - 6, 3, 3, "#ffd98a");
        if (item2("ring2")) el(h2[0] + 5, h2[1] - 3, 3, 3, "#ffd98a");
        g.shadowBlur = 0;
      }
    }
    const shd = item2("shield");
    if (shd) {
      const sx = cx + 48;
      const sy = torsoY + 46;
      g.save();
      g.shadowColor = "rgba(0,0,0,0.4)";
      g.shadowBlur = 4;
      const drawKite = (main, trim, boss) => {
        g.fillStyle = main;
        g.beginPath();
        g.moveTo(sx - 28, sy - 44);
        g.lineTo(sx + 28, sy - 44);
        g.lineTo(sx + 28, sy + 14);
        g.quadraticCurveTo(sx, sy + 44, sx - 28, sy + 14);
        g.closePath();
        g.fill();
        g.strokeStyle = trim;
        g.lineWidth = 5;
        g.stroke();
        if (boss) el(sx, sy - 14, 9, 9, boss);
      };
      switch (shd.id) {
        case "shd_wooden":
          el(sx, sy, 32, 35, "#8a6a45");
          el(sx, sy, 21, 23, "#7a5a38");
          el(sx, sy, 9, 9, "#6b5335");
          break;
        case "shd_tower":
          rr(sx - 21, sy - 46, 42, 84, 9, "#8a9098");
          rr(sx - 21, sy - 46, 42, 13, 7, "#6a7078");
          el(sx, sy - 8, 8, 8, "#4a3a29");
          g.fillStyle = "rgba(255,255,255,0.15)";
          g.fillRect(sx - 16, sy - 38, 8, 68);
          break;
        case "shd_master":
          drawKite("#b8c8d8", "#ffd98a", "#e8f4ff");
          g.fillStyle = "rgba(255,255,255,0.5)";
          g.beginPath();
          g.moveTo(sx - 18, sy - 38);
          g.lineTo(sx - 5, sy - 38);
          g.lineTo(sx - 13, sy + 8);
          g.lineTo(sx - 21, sy + 3);
          g.closePath();
          g.fill();
          break;
        case "shd_page_shield":
          rr(sx - 22, sy - 38, 44, 74, 7, "#6b4a2f");
          rr(sx - 22, sy - 38, 12, 74, 7, "#4a3320");
          el(sx + 3, sy, 6, 7, "#c9a227");
          break;
        default:
          drawKite(pal(shd).main, pal(shd).trim, pal(shd).trim);
      }
      g.restore();
    }
    const amu = item2("amulet");
    if (amu) {
      g.strokeStyle = "#c9b294";
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(cx - 10, torsoY + 4);
      g.quadraticCurveTo(cx, torsoY + 18, cx + 10, torsoY + 4);
      g.stroke();
      el(cx, torsoY + 24, 6, 7, pal(amu).trim);
      el(cx, torsoY + 24, 10, 12, "rgba(255,226,138,0.3)");
    }
    if (state2.pet && PET_BY_ID[state2.pet]) {
      const e = PET_BY_ID[state2.pet].icon;
      g.font = '30px "Segoe UI Emoji", sans-serif';
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText(e, W * 0.82, H * 0.86);
    }
  }

  // src/ui/shopView.js
  function buildBuyList(container, ctx2, items, newIds) {
    const { state: state2 } = ctx2;
    const btnByItemId = {};
    const buyList = document.createElement("div");
    buyList.className = "list";
    if (items.length === 0) {
      buyList.innerHTML = '<div class="muted">\u041F\u043E\u043B\u043A\u0438 \u043F\u043E\u043A\u0430 \u043F\u0443\u0441\u0442\u044B \u2014 \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0430\u0439\u0441\u044F \u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u0431\u0435\u0434 \u0440\u044B\u0446\u0430\u0440\u044F.</div>';
    }
    for (const item2 of items) {
      const row = document.createElement("div");
      row.className = "row" + (newIds.has(item2.id) ? " new-item" : "");
      const priceLabel = item2.sealPrice ? `\u{1F530} ${item2.sealPrice}` : `\u{1FA99} ${item2.price}`;
      const afford = item2.sealPrice ? state2.seals >= item2.sealPrice : state2.coins >= item2.price;
      row.innerHTML = `
      <span class="icon">${itemEmoji(item2)}</span>
      <span class="grow">
        <div class="name">${item2.name}${newIds.has(item2.id) ? ' <span class="badge new-badge">\u043D\u043E\u0432\u0438\u043D\u043A\u0430</span>' : ""} <span class="badge ${item2.rarity}">${RARITY_LABEL[item2.rarity]}</span></div>
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
          rerenderCurrent();
        } else {
          ctx2.toast(r.error);
        }
      });
      row.appendChild(btn);
      buyList.appendChild(row);
      btnByItemId[item2.id] = btn;
    }
    container.appendChild(buyList);
    return btnByItemId;
  }
  var currentRerender = () => {
  };
  function rerenderCurrent() {
    currentRerender();
  }
  function renderMarket(container, ctx2, shopKey) {
    const { state: state2 } = ctx2;
    const shop = SHOPS[shopKey];
    if (!shop) {
      ctx2.go("hub", { scene: "square" });
      return;
    }
    const head = document.createElement("div");
    head.className = "panel";
    head.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
    <h2 style="margin:0">${shop.icon} ${shop.name}</h2></div>
    <div class="muted">${shop.desc}</div>`;
    const back = document.createElement("button");
    back.className = "ghost small";
    back.textContent = "\u2190 \u0412 \u043A\u0432\u0430\u0440\u0442\u0430\u043B";
    back.addEventListener("click", () => ctx2.go("hub", { scene: "market" }));
    head.firstElementChild.appendChild(back);
    container.appendChild(head);
    container.appendChild(quickNav(ctx2, [
      { icon: "\u{1F392}", label: "\u041A\u043E\u043C\u043D\u0430\u0442\u0430 \u0440\u044B\u0446\u0430\u0440\u044F", screen: "equip", primary: true },
      { icon: "\u{1F3EC}", label: "\u0412 \u0442\u043E\u0440\u0433\u043E\u0432\u044B\u0439 \u043A\u0432\u0430\u0440\u0442\u0430\u043B", screen: "hub", params: { scene: "market" } }
    ]));
    const newIds = new Set(unseenShopItems(state2).map((i) => i.id));
    const buyPanel = document.createElement("div");
    buyPanel.className = "panel";
    buyPanel.innerHTML = "<h3>\u0412\u0438\u0442\u0440\u0438\u043D\u0430</h3>";
    container.appendChild(buyPanel);
    const items = itemsForShop(state2, shopKey, shopStock(state2));
    const btnByItemId = buildBuyList(buyPanel, ctx2, items, newIds);
    if ((state2.stats.itemsBought || 0) === 0) {
      const owned = /* @__PURE__ */ new Set([...state2.inventory || [], ...Object.values(state2.equipped || {})]);
      const afford = (it) => it.sealPrice ? state2.seals >= it.sealPrice : state2.coins >= it.price;
      const target = items.find((it) => !owned.has(it.id) && afford(it));
      const firstBuy = target ? btnByItemId[target.id] : null;
      if (firstBuy) {
        startTutorial(ctx2, "first_purchase", [
          {
            target: firstBuy,
            title: "\u041F\u0435\u0440\u0432\u0430\u044F \u043F\u043E\u043A\u0443\u043F\u043A\u0430",
            text: "\u041C\u043E\u043D\u0435\u0442\u044B \u0441 \u0437\u0430\u0433\u0430\u0434\u043E\u043A \u2014 \u044D\u0442\u043E \u0442\u043E\u0432\u0430\u0440\u044B \u0434\u043B\u044F \u0440\u044B\u0446\u0430\u0440\u044F. \u0412\u044B\u0431\u0435\u0440\u0438 \u0447\u0442\u043E-\u043D\u0438\u0431\u0443\u0434\u044C \u043F\u043E \u0434\u0443\u0448\u0435 \u0438 \u043D\u0430\u0436\u043C\u0438 \xAB\u041A\u0443\u043F\u0438\u0442\u044C\xBB: \u0432\u0435\u0449\u044C \u043B\u044F\u0436\u0435\u0442 \u0432 \u0441\u0443\u043D\u0434\u0443\u043A, \u0430 \u043D\u0430\u0434\u0435\u0442\u044C \u0435\u0451 \u043C\u043E\u0436\u043D\u043E \u0432 \u043A\u043E\u043C\u043D\u0430\u0442\u0435 \u0440\u044B\u0446\u0430\u0440\u044F.",
            cta: "\u041F\u043E\u043A\u0443\u043F\u0430\u044E!"
          }
        ]);
      }
    }
    markShopSeen(state2);
    ctx2.save();
    currentRerender = () => {
      container.innerHTML = "";
      renderMarket(container, ctx2, shopKey);
    };
  }
  function renderShop(container, ctx2) {
    const { state: state2 } = ctx2;
    const head = document.createElement("div");
    head.className = "panel";
    head.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
    <h2 style="margin:0">\u041F\u0440\u0438\u043B\u0430\u0432\u043E\u043A \u043B\u0430\u0432\u043A\u0438</h2></div>
    <div class="muted">\u0423\u043A\u0440\u0430\u0448\u0435\u043D\u0438\u044F \u0434\u043B\u044F \u0434\u043E\u043C\u0430 \u0438 \u0441\u043A\u0443\u043F\u043A\u0430 \u0442\u0432\u043E\u0438\u0445 \u043D\u0430\u0445\u043E\u0434\u043E\u043A. \u0421\u043D\u0430\u0440\u044F\u0436\u0435\u043D\u0438\u0435 \u2014 \u0432 \u043B\u0430\u0432\u043A\u0430\u0445 \u043F\u043B\u043E\u0449\u0430\u0434\u0438.</div>`;
    const back = document.createElement("button");
    back.className = "ghost small";
    back.textContent = "\u2190 \u041D\u0430\u0437\u0430\u0434";
    back.addEventListener("click", () => ctx2.go("hub"));
    head.firstElementChild.appendChild(back);
    container.appendChild(head);
    container.appendChild(quickNav(ctx2, [
      { icon: "\u{1F392}", label: "\u041A\u043E\u043C\u043D\u0430\u0442\u0430 \u0440\u044B\u0446\u0430\u0440\u044F", screen: "equip", primary: true },
      { icon: "\u{1F5E1}\uFE0F", label: "\u041E\u0440\u0443\u0436\u0435\u0439\u043D\u0438\u043A", screen: "shopArmory" },
      { icon: "\u{1F6E1}\uFE0F", label: "\u0411\u0440\u043E\u043D\u043D\u0438\u043A", screen: "shopArmorer" },
      { icon: "\u{1F52E}", label: "\u041C\u0430\u0433", screen: "shopMagic" },
      { icon: "\u{1F9EA}", label: "\u0410\u043B\u0445\u0438\u043C\u0438\u043A", screen: "shopAlchemy" },
      { icon: "\u{1F3E0}", label: "\u0412 \u043B\u0430\u0432\u043A\u0443", screen: "hub" }
    ]));
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
          rerenderCurrent();
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
            rerenderCurrent();
          } else ctx2.toast(r.error);
        });
      } else {
        btn.textContent = active ? "\u0423\u0431\u0440\u0430\u0442\u044C" : "\u0412\u044B\u0441\u0442\u0430\u0432\u0438\u0442\u044C";
        btn.addEventListener("click", () => {
          toggleCosmetic(state2, c.id);
          ctx2.save();
          rerenderCurrent();
        });
      }
      row.appendChild(btn);
      cosList.appendChild(row);
    }
    cosPanel.appendChild(cosList);
    container.appendChild(cosPanel);
    currentRerender = () => {
      container.innerHTML = "";
      renderShop(container, ctx2);
    };
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
    const WORLD_LABEL2 = {
      meadow: "\u{1F33F} \u0422\u0438\u0445\u0430\u044F \u043E\u043F\u0443\u0448\u043A\u0430",
      town: "\u{1F3F0} \u0421\u0440\u0435\u0434\u043D\u0435\u0432\u0435\u043A\u043E\u0432\u044B\u0439 \u0434\u0432\u043E\u0440\u0438\u043A",
      attic: "\u{1F4D6} \u041A\u043D\u0438\u0436\u043D\u044B\u0439 \u0447\u0435\u0440\u0434\u0430\u043A",
      crossroads: "\u{1F31F} \u042D\u043A\u0441\u043F\u0435\u0434\u0438\u0446\u0438\u0438 \u043F\u0435\u0440\u0435\u043A\u0440\u0451\u0441\u0442\u043A\u0430",
      nm: "\u{1F303} \u041D\u043E\u0447\u043D\u043E\u0439 \u0440\u044B\u043D\u043E\u043A",
      sw: "\u{1F438} \u0421\u043A\u0430\u0437\u043E\u0447\u043D\u044B\u0435 \u0442\u043E\u043F\u0438",
      sf: "\u{1F3AA} \u0417\u0432\u0451\u0437\u0434\u043D\u0430\u044F \u044F\u0440\u043C\u0430\u0440\u043A\u0430",
      cr: "\u{1F48E} \u0425\u0440\u0443\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0435 \u0433\u043E\u0440\u044B",
      ash: "\u{1F525} \u041F\u0435\u043F\u0435\u043B\u044C\u043D\u044B\u0435 \u0441\u0442\u0435\u043F\u0438",
      jade: "\u{1F38B} \u041D\u0435\u0444\u0440\u0438\u0442\u043E\u0432\u044B\u0439 \u0441\u0430\u0434",
      deep: "\u{1F41A} \u041F\u043E\u0434\u0432\u043E\u0434\u043D\u044B\u0439 \u0433\u0440\u043E\u0442",
      mist: "\u23F3 \u0422\u0443\u043C\u0430\u043D\u043D\u044B\u0435 \u0447\u0430\u0441\u044B"
    };
    let lastWorld = null;
    for (const b of BATTLES) {
      if (b.wanted) continue;
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
      const icons = b.enemies.map((e) => ENEMY_BY_ID[typeof e === "string" ? e : e.id].icon).join(" ");
      row.innerHTML = `
      <span class="icon">${available ? done ? "\u{1F3C6}" : "\u2694\uFE0F" : "\u{1F512}"}</span>
      <span class="grow">
        <div class="name">${b.name} ${ENEMY_BY_ID[typeof b.enemies[0] === "string" ? b.enemies[0] : b.enemies[0].id].boss ? '<span class="badge epic">\u0411\u041E\u0421\u0421</span>' : ""}</div>
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
      { icon: "\u{1F307}", label: "\u041D\u0430 \u043F\u043B\u043E\u0449\u0430\u0434\u044C", screen: "hub", params: { scene: "square" } }
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
  var CELL7 = 56;
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
    const seekBtn = document.createElement("button");
    seekBtn.textContent = "\u{1F50D} \u0420\u0435\u0434\u0430\u043A\u0442\u043E\u0440 \u0438\u0441\u043A\u0430\u043B\u043E\u043A";
    seekBtn.addEventListener("click", () => ctx2.go("seekeditor", {}));
    const newBtn = document.createElement("button");
    newBtn.textContent = "\u{1FA9E} \u041D\u043E\u0432\u0430\u044F \u0437\u0430\u0433\u0430\u0434\u043A\u0430 \u0441\u043E \u0441\u0432\u0435\u0442\u043E\u043C";
    newBtn.style.marginLeft = "8px";
    newBtn.addEventListener("click", () => ctx2.go("editor", {}));
    const sandboxBtn = document.createElement("button");
    sandboxBtn.textContent = "\u2694\uFE0F \u041A\u043E\u043D\u0441\u0442\u0440\u0443\u043A\u0442\u043E\u0440 \u0431\u043E\u044F";
    sandboxBtn.style.marginLeft = "8px";
    sandboxBtn.title = "\u041F\u0435\u0441\u043E\u0447\u043D\u0438\u0446\u0430: \u0441\u043E\u0431\u0435\u0440\u0438 \u043E\u0431\u0435 \u043A\u043E\u043C\u0430\u043D\u0434\u044B \u0438 \u043F\u0440\u043E\u0432\u0435\u0440\u044C \u0441\u0438\u043C\u0443\u043B\u044F\u0446\u0438\u044E";
    sandboxBtn.addEventListener("click", () => ctx2.go("sandbox"));
    const panel = document.createElement("div");
    panel.className = "panel";
    panel.append(seekBtn, newBtn, sandboxBtn);
    container.appendChild(panel);
    const list = document.createElement("div");
    list.className = "list";
    if (state2.customPuzzles.length === 0) {
      list.innerHTML = '<div class="muted panel">\u041F\u043E\u043A\u0430 \u043F\u0443\u0441\u0442\u043E. \u041D\u0430\u0436\u043C\u0438 \xAB\u041D\u043E\u0432\u0430\u044F \u0437\u0430\u0433\u0430\u0434\u043A\u0430 \u0441\u043E \u0441\u0432\u0435\u0442\u043E\u043C\xBB \u0438 \u0441\u043E\u0431\u0435\u0440\u0438 \u0441\u0432\u043E\u044E!</div>';
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
    container.appendChild(header(ctx2, existing ? "\u041F\u0440\u0430\u0432\u043A\u0430 \u0437\u0430\u0433\u0430\u0434\u043A\u0438" : "\u041D\u043E\u0432\u0430\u044F \u0437\u0430\u0433\u0430\u0434\u043A\u0430", "\u041C\u0435\u0445\u0430\u043D\u0438\u043A\u0430 \xAB\u0421\u0432\u0435\u0442 \u0438 \u0444\u043E\u043D\u0430\u0440\u0438\u043A\u0438\xBB", "workshop"));
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
      const x = Math.floor((ev.clientX - rect.left) * scale / CELL7);
      const y = Math.floor((ev.clientY - rect.top) * scale / CELL7);
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
      canvas.width = gw * CELL7;
      canvas.height = gh * CELL7;
      canvas.style.width = `${gw * CELL7}px`;
      canvas.style.height = `${gh * CELL7}px`;
      const g = canvas.getContext("2d");
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (let y = 0; y < gh; y++) {
        for (let x = 0; x < gw; x++) {
          g.fillStyle = (x + y) % 2 === 0 ? "#3a5232" : "#425c38";
          g.fillRect(x * CELL7, y * CELL7, CELL7, CELL7);
        }
      }
      const preview = createPuzzle(currentLevel());
      const { beams } = traceLight(preview);
      g.lineCap = "round";
      g.strokeStyle = "rgba(255, 226, 138, 0.5)";
      g.lineWidth = 4;
      for (const b of beams) {
        g.beginPath();
        g.moveTo(b.from[0] * CELL7 + CELL7 / 2, b.from[1] * CELL7 + CELL7 / 2);
        g.lineTo(b.to[0] * CELL7 + CELL7 / 2, b.to[1] * CELL7 + CELL7 / 2);
        g.stroke();
      }
      for (const o of objects) {
        const cx = o.pos[0] * CELL7 + CELL7 / 2;
        const cy = o.pos[1] * CELL7 + CELL7 / 2;
        const emoji = (e, size = CELL7 * 0.6) => {
          g.font = `${size}px "Segoe UI Emoji", sans-serif`;
          g.textAlign = "center";
          g.textBaseline = "middle";
          g.fillText(e, cx, cy);
        };
        if (o.type === "source") {
          emoji("\u2728");
          const dirs = ["\u2191", "\u2192", "\u2193", "\u2190"];
          g.fillStyle = "#fff2be";
          g.font = `bold ${CELL7 * 0.3}px sans-serif`;
          g.fillText(dirs[o.dir ?? 1], cx + CELL7 * 0.28, cy - CELL7 * 0.28);
        } else if (o.type === "mirror") {
          g.save();
          g.translate(cx, cy);
          g.rotate(o.orient === 0 ? Math.PI / 4 : -Math.PI / 4);
          g.fillStyle = "#cfe8ff";
          g.fillRect(-CELL7 * 0.3, -3, CELL7 * 0.6, 5);
          g.restore();
          emoji("\u{1FA9E}", CELL7 * 0.3);
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
      { icon: "\u{1F307}", label: "\u041D\u0430 \u043F\u043B\u043E\u0449\u0430\u0434\u044C", screen: "hub", params: { scene: "square" } }
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
  function playAudio(src, volume = 1) {
    if (!enabled || typeof Audio === "undefined") return false;
    try {
      const a = new Audio(src);
      a.volume = volume;
      a.play().catch(() => false);
      return true;
    } catch {
      return false;
    }
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
  function noiseBurst(dur, { freq = 2e3, q = 1, gain = 0.05, delay = 0, type = "bandpass" } = {}) {
    const a = ac();
    if (!a || !enabled) return;
    const len = Math.max(1, Math.floor(a.sampleRate * dur));
    const buf = a.createBuffer(1, len, a.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = a.createBufferSource();
    src.buffer = buf;
    const f = a.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = a.createGain();
    g.gain.value = gain;
    src.connect(f).connect(g).connect(a.destination);
    src.start(a.currentTime + delay);
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
      case "bubble": {
        for (let i = 0; i < 3; i++) {
          tone(100 + Math.random() * 90, 0.09, { type: "sine", gain: 0.05, delay: i * 0.07, slide: 50 });
        }
        noiseBurst(0.16, { freq: 750, gain: 0.018 });
        break;
      }
      case "page": {
        noiseBurst(0.15, { freq: 2800, gain: 0.05 });
        noiseBurst(0.12, { freq: 3400, gain: 0.03, delay: 0.09 });
        break;
      }
      case "purr": {
        if (playAudio("assets/3d-zvuk-murchanie-koshki_1sec.mp3", 0.7)) break;
        for (let i = 0; i < 5; i++) {
          tone(65, 0.09, { type: "sawtooth", gain: 0.05, delay: i * 0.11 });
          tone(80, 0.09, { type: "sawtooth", gain: 0.03, delay: i * 0.11 + 0.05 });
        }
        break;
      }
      default:
        tone(440, 0.08, { gain: 0.04 });
    }
  }
  var MUSIC_KEY = "cozy_music";
  var musicTimer = null;
  var musicGain = null;
  var musicNoise = null;
  var chordIdx = 0;
  var bellIdx = 0;
  var CHORDS = [
    [220, 261.63, 329.63],
    // Am
    [174.61, 220, 261.63],
    // F
    [130.81, 196, 329.63],
    // C
    [196, 246.94, 293.66]
    // G
  ];
  var BELLS = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
  function musicEnabledSetting() {
    try {
      return localStorage.getItem(MUSIC_KEY) !== "off";
    } catch {
      return true;
    }
  }
  function startMusic() {
    const a = ac();
    if (!a || musicTimer || !musicEnabledSetting()) return;
    musicGain = a.createGain();
    musicGain.gain.value = 0;
    musicGain.gain.linearRampToValueAtTime(0.045, a.currentTime + 2);
    musicGain.connect(a.destination);
    const noiseLen = a.sampleRate * 2;
    const noiseBuf = a.createBuffer(1, noiseLen, a.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseLen; i++) data[i] = (Math.random() * 2 - 1) * 0.12;
    musicNoise = a.createBufferSource();
    musicNoise.buffer = noiseBuf;
    musicNoise.loop = true;
    const noiseFilter = a.createBiquadFilter();
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.value = 900;
    const noiseGain = a.createGain();
    noiseGain.gain.value = 0.35;
    musicNoise.connect(noiseFilter).connect(noiseGain).connect(musicGain);
    musicNoise.start();
    const bar = () => {
      if (!musicGain) return;
      const t0 = a.currentTime + 0.05;
      for (const f of CHORDS[chordIdx % CHORDS.length]) {
        const osc = a.createOscillator();
        const g = a.createGain();
        osc.type = "triangle";
        osc.frequency.value = f;
        g.gain.setValueAtTime(0, t0);
        g.gain.linearRampToValueAtTime(0.5, t0 + 0.7);
        g.gain.linearRampToValueAtTime(1e-4, t0 + 3.6);
        osc.connect(g).connect(musicGain);
        osc.start(t0);
        osc.stop(t0 + 3.7);
      }
      if (Math.random() < 0.65) {
        const bt = t0 + 0.8 + Math.random() * 2.2;
        const osc = a.createOscillator();
        const g = a.createGain();
        osc.type = "sine";
        osc.frequency.value = BELLS[bellIdx++ % BELLS.length];
        g.gain.setValueAtTime(0, bt);
        g.gain.linearRampToValueAtTime(0.35, bt + 0.02);
        g.gain.exponentialRampToValueAtTime(1e-4, bt + 1.6);
        osc.connect(g).connect(musicGain);
        osc.start(bt);
        osc.stop(bt + 1.7);
      }
      chordIdx++;
    };
    bar();
    musicTimer = setInterval(bar, 3600);
  }
  function stopMusic() {
    if (musicTimer) {
      clearInterval(musicTimer);
      musicTimer = null;
    }
    try {
      musicNoise?.stop();
    } catch {
    }
    musicNoise = null;
    if (musicGain) {
      const a = ac();
      if (a) musicGain.gain.linearRampToValueAtTime(0, a.currentTime + 0.8);
      setTimeout(() => {
        try {
          musicGain?.disconnect();
        } catch {
        }
        musicGain = null;
      }, 900);
    }
  }
  function toggleMusic() {
    const on = !musicEnabledSetting();
    try {
      localStorage.setItem(MUSIC_KEY, on ? "on" : "off");
    } catch {
    }
    if (!on) stopMusic();
    else startMusic();
    return on;
  }
  function musicEnabled() {
    return musicEnabledSetting();
  }

  // src/ui/settingsView.js
  function renderSettings(container, ctx2) {
    const { state: state2 } = ctx2;
    container.appendChild(header(ctx2, "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438", "\u041B\u0430\u0432\u043A\u0430 \u043F\u043E\u0434\u0441\u0442\u0440\u0430\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u043F\u043E\u0434 \u0445\u043E\u0437\u044F\u0438\u043D\u0430"));
    const panel = document.createElement("div");
    panel.className = "panel";
    const soundTitle = document.createElement("h3");
    soundTitle.textContent = "\u0417\u0432\u0443\u043A";
    soundTitle.style.marginTop = "16px";
    panel.appendChild(soundTitle);
    const soundBtn = document.createElement("button");
    soundBtn.textContent = soundEnabled() ? "\u{1F514} \u0417\u0432\u0443\u043A \u0432\u043A\u043B\u044E\u0447\u0451\u043D" : "\u{1F515} \u0417\u0432\u0443\u043A \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D";
    soundBtn.addEventListener("click", () => {
      const on = toggleSound();
      soundBtn.textContent = on ? "\u{1F514} \u0417\u0432\u0443\u043A \u0432\u043A\u043B\u044E\u0447\u0451\u043D" : "\u{1F515} \u0417\u0432\u0443\u043A \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D";
      if (on) ctx2.sfx?.("coin");
    });
    const musicBtn = document.createElement("button");
    musicBtn.textContent = musicEnabled() ? "\u{1F3B5} \u041C\u0443\u0437\u044B\u043A\u0430 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u0430" : "\u{1F3B5} \u041C\u0443\u0437\u044B\u043A\u0430 \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u0430";
    musicBtn.style.marginLeft = "8px";
    musicBtn.addEventListener("click", () => {
      const on = toggleMusic();
      musicBtn.textContent = on ? "\u{1F3B5} \u041C\u0443\u0437\u044B\u043A\u0430 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u0430" : "\u{1F3B5} \u041C\u0443\u0437\u044B\u043A\u0430 \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u0430";
    });
    panel.append(soundBtn, musicBtn);
    const tutTitle = document.createElement("h3");
    tutTitle.textContent = "\u041E\u0431\u0443\u0447\u0435\u043D\u0438\u0435";
    tutTitle.style.marginTop = "16px";
    panel.appendChild(tutTitle);
    const tutBtn = document.createElement("button");
    tutBtn.className = "ghost";
    tutBtn.textContent = "\u{1F408} \u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u043E\u0431\u0443\u0447\u0435\u043D\u0438\u0435 \u0441\u043D\u043E\u0432\u0430";
    tutBtn.addEventListener("click", () => {
      state2.tutorial = {};
      state2.tutorialSkipped = false;
      ctx2.save();
      ctx2.toast("\u041A\u043E\u0442-\u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u0441\u043D\u043E\u0432\u0430 \u0431\u0443\u0434\u0435\u0442 \u0432\u0435\u0441\u0442\u0438 \u0442\u0435\u0431\u044F. \u041D\u0430\u0447\u043D\u0451\u043C \u0441 \u043B\u0430\u0432\u043A\u0438!");
      ctx2.go("hub");
    });
    panel.appendChild(tutBtn);
    const newTitle = document.createElement("h3");
    newTitle.textContent = "\u041B\u0430\u0432\u043A\u0430";
    newTitle.style.marginTop = "16px";
    panel.appendChild(newTitle);
    const newBtn = document.createElement("button");
    newBtn.className = "ghost";
    newBtn.textContent = "\u{1F56F}\uFE0F \u041D\u0430\u0447\u0430\u0442\u044C \u043D\u043E\u0432\u0443\u044E \u0438\u0433\u0440\u0443";
    newBtn.addEventListener("click", () => ctx2.newGameConfirm());
    panel.appendChild(newBtn);
    container.appendChild(panel);
    const secret = document.createElement("div");
    secret.className = "muted center";
    secret.style.cssText = "font-size:12px;margin-top:6px;user-select:none;cursor:default";
    let taps = 0;
    let revealed = false;
    const renderSecret = () => {
      secret.textContent = `\u041B\u0430\u0432\u043A\u0430 \u043D\u0430 \u043F\u0435\u0440\u0435\u043A\u0440\u0451\u0441\u0442\u043A\u0435 \u043C\u0438\u0440\u043E\u0432 \xB7 \u0432\u0435\u0440\u0441\u0438\u044F 0.9 \xB7 \u{1F56F}\uFE0F${taps > 0 && taps < 5 ? " \xB7 \u2026" + taps : ""}`;
    };
    renderSecret();
    secret.addEventListener("click", () => {
      if (revealed) return;
      taps += 1;
      if (taps >= 5) {
        revealed = true;
        revealCheats();
      } else {
        ctx2.sfx?.("tap");
        renderSecret();
      }
    });
    container.appendChild(secret);
    function revealCheats() {
      const box = document.createElement("div");
      box.className = "panel";
      box.innerHTML = `<h3>\u{1F92B} \u0422\u0430\u0439\u043D\u0430\u044F \u043A\u043E\u043C\u043D\u0430\u0442\u0430</h3>
      <div class="muted" style="font-size:13px">\u0427\u0438\u0442-\u043A\u043E\u0434\u044B \u0434\u043B\u044F \u0442\u0435\u0441\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F \u0438 \u0431\u044B\u0441\u0442\u0440\u043E\u0433\u043E \u043F\u0440\u043E\u043F\u0443\u0441\u043A\u0430. \u0412\u0432\u043E\u0434\u0438 \u0441\u043B\u043E\u0432\u043E \u0438 \u0436\u043C\u0438 \xAB\u0421\u043A\u0430\u0437\u0430\u0442\u044C\xBB.</div>`;
      const row = document.createElement("div");
      row.style.cssText = "display:flex;gap:8px;margin-top:10px";
      const input = document.createElement("input");
      input.placeholder = "\u0447\u0438\u0442-\u043A\u043E\u0434\u2026";
      input.style.cssText = "font:inherit;padding:8px 12px;border-radius:10px;border:2px solid #6b553a;background:#241b12;color:#f3e6cf;flex:1";
      const say = document.createElement("button");
      say.className = "primary small";
      say.textContent = "\u0421\u043A\u0430\u0437\u0430\u0442\u044C";
      const run = () => {
        const r = applyCheat(state2, input.value);
        ctx2.toast(r.message);
        if (r.ok) {
          ctx2.sfx?.("success");
          ctx2.save();
        }
        input.value = "";
        input.focus();
      };
      say.addEventListener("click", run);
      input.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") run();
      });
      row.append(input, say);
      box.appendChild(row);
      if ((state2.cheats?.used || []).length > 0) {
        const used = document.createElement("div");
        used.className = "muted mt";
        used.style.fontSize = "12px";
        used.textContent = `\u0423\u0436\u0435 \u0448\u0435\u043F\u0442\u0430\u043B\u043E\u0441\u044C: ${state2.cheats.used.join(" \xB7 ")}`;
        box.appendChild(used);
      }
      secret.replaceWith(box);
      input.focus();
    }
    function rerender() {
      container.innerHTML = "";
      renderSettings(container, ctx2);
    }
  }

  // src/ui/formationView.js
  var FRONT2 = [0, 1, 2];
  function cellPos(c, r) {
    return [5 + c * 12.5, 18 + r * 32];
  }
  function slotPos(slot, side) {
    return cellPos(...slotToCell(slot, side));
  }
  function addFieldBg(fieldEl, world) {
    const bg = document.createElement("img");
    bg.className = "form-field-bg";
    bg.alt = "";
    const cands = [`assets/battle_bg_${world}_web.jpg`, `assets/battle_bg_${world}.jfif`];
    let i = 0;
    bg.addEventListener("error", () => {
      i += 1;
      if (i < cands.length) bg.src = cands[i];
      else bg.remove();
    });
    bg.src = cands[0];
    fieldEl.prepend(bg);
  }
  function renderFormation(container, ctx2, params) {
    const battle = BATTLE_BY_ID[params.id];
    if (!battle || !battleAvailable(ctx2.state, battle.id)) {
      ctx2.go("battles");
      return;
    }
    const { state: state2 } = ctx2;
    container.appendChild(header(ctx2, `${battle.name} \u2014 \u0440\u0430\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0430`, battle.tip, "battles"));
    const prepPanel = document.createElement("div");
    prepPanel.className = "panel";
    prepPanel.innerHTML = `<h3>\u0422\u0432\u043E\u0439 \u0441\u0442\u0440\u043E\u0439</h3>
    <div class="muted" style="font-size:13px;margin-bottom:10px">
    \u0422\u0430\u043F\u043D\u0438 \u0431\u043E\u0439\u0446\u0430, \u0437\u0430\u0442\u0435\u043C \u0441\u043B\u043E\u0442. \u041F\u0435\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u044F\u0434 \u0434\u0435\u0440\u0436\u0438\u0442 \u0443\u0434\u0430\u0440, \u0437\u0430\u0434\u043D\u0438\u0439 \u2014 \u0441\u0442\u0440\u0435\u043B\u043A\u0438 \u0438 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430.</div>`;
    const field = document.createElement("div");
    field.className = "form-field";
    addFieldBg(field, battle.world);
    prepPanel.appendChild(field);
    const units = [
      { key: "knight", icon: "\u{1F6E1}\uFE0F", name: "\u0420\u044B\u0446\u0430\u0440\u044C" },
      ...state2.squadMercs.map((id, i) => ({
        key: `merc${i}`,
        icon: MERC_BY_ID[id].icon,
        name: MERC_BY_ID[id].name
      }))
    ];
    let selectedUnit = null;
    const enemyEntries = battle.enemies.map((e) => typeof e === "string" ? { id: e, scale: 1 } : e);
    const enemySlots = enemyFormationSlots(battle.enemies);
    function slotEl(slot, side) {
      const [x, y] = slotPos(slot, side);
      const el = document.createElement("div");
      el.className = "form-slot" + (FRONT2.includes(slot) ? " front" : " back");
      el.style.left = `${x}%`;
      el.style.top = `${y}%`;
      el.dataset.slot = slot;
      el.dataset.side = side;
      return el;
    }
    const slotEls = {};
    for (let s = 0; s < 6; s++) {
      const el = slotEl(s, "ally");
      field.appendChild(el);
      slotEls[`ally${s}`] = el;
      el.addEventListener("click", () => {
        if (!selectedUnit) return;
        moveFormationSlot(state2, selectedUnit, s);
        selectedUnit = null;
        ctx2.sfx?.("rotate");
        rerender();
      });
    }
    enemySlots.forEach((slot, i) => {
      const def = ENEMY_BY_ID[enemyEntries[i].id];
      const el = slotEl(slot, "enemy");
      el.innerHTML = `<span class="fs-icon">${def.icon}</span>`;
      el.classList.add("occupied", "enemy");
      field.appendChild(el);
    });
    let unitDrag = null;
    let hoverSlotEl = null;
    function findSlotAt(x, y) {
      for (let s = 0; s < 6; s++) {
        const el = slotEls[`ally${s}`];
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return s;
      }
      return null;
    }
    function onDragMove(ev) {
      if (!unitDrag) return;
      if (!unitDrag.active) {
        if (Math.hypot(ev.clientX - unitDrag.startX, ev.clientY - unitDrag.startY) < 8) return;
        const u = units.find((x) => x.key === unitDrag.key);
        if (!u) return;
        const ghost = document.createElement("div");
        ghost.className = "drag-ghost";
        ghost.textContent = u.icon;
        document.body.appendChild(ghost);
        unitDrag.ghost = ghost;
        unitDrag.active = true;
        selectedUnit = null;
        ctx2.sfx?.("tap");
      }
      unitDrag.ghost.style.transform = `translate(${ev.clientX - 22}px, ${ev.clientY - 22}px)`;
      const slot = findSlotAt(ev.clientX, ev.clientY);
      if (slot !== unitDrag.hoverSlot) {
        hoverSlotEl?.classList.remove("selected");
        hoverSlotEl = slot !== null ? slotEls[`ally${slot}`] : null;
        hoverSlotEl?.classList.add("selected");
        unitDrag.hoverSlot = slot;
      }
    }
    function onDragEnd() {
      if (!unitDrag) return;
      const { key, active, hoverSlot, ghost } = unitDrag;
      ghost?.remove();
      hoverSlotEl?.classList.remove("selected");
      unitDrag = null;
      if (!active || hoverSlot === null || hoverSlot === void 0) return;
      moveFormationSlot(state2, key, hoverSlot);
      ctx2.sfx?.("rotate");
      ctx2.save();
      rerender();
    }
    window.addEventListener("pointermove", onDragMove);
    window.addEventListener("pointerup", onDragEnd);
    for (const u of units) {
      const slot = state2.formation[u.key];
      const host = slotEls[`ally${slot}`];
      if (!host) continue;
      host.classList.add("occupied");
      host.innerHTML = `<span class="fs-icon">${u.icon}</span><span class="fs-name">${u.name}</span>`;
      host.style.touchAction = "none";
      host.addEventListener("pointerdown", (ev) => {
        unitDrag = { key: u.key, startX: ev.clientX, startY: ev.clientY, active: false, ghost: null, hoverSlot: null };
        ev.preventDefault();
      });
      host.addEventListener("click", (ev) => {
        ev.stopPropagation?.();
        selectedUnit = selectedUnit === u.key ? null : u.key;
        field.querySelectorAll(".form-slot").forEach((s) => s.classList.remove("selected"));
        if (selectedUnit) host.classList.add("selected");
        ctx2.sfx?.("tap");
      });
    }
    const tacticBox = document.createElement("div");
    tacticBox.style.cssText = "display:flex;gap:6px;align-items:center;margin-top:12px;flex-wrap:wrap";
    const tacticTitle = document.createElement("span");
    tacticTitle.textContent = "\u0422\u0430\u043A\u0442\u0438\u043A\u0430:";
    tacticBox.appendChild(tacticTitle);
    const TACTICS = [
      ["defense", "\u{1F6E1} \u0417\u0430\u0449\u0438\u0442\u0430", "\u0414\u0435\u0440\u0436\u0438\u043C \u0441\u0442\u0440\u043E\u0439: \u0431\u0440\u043E\u043D\u044F \xD71.25 \u0438 \u0443\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u0435 +12%, \u0430\u0442\u0430\u043A\u0430 \xD70.85"],
      ["balance", "\u2696 \u0411\u0430\u043B\u0430\u043D\u0441", "\u041E\u0431\u044B\u0447\u043D\u044B\u0439 \u0431\u043E\u0439 \u0431\u0435\u0437 \u043C\u043E\u0434\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440\u043E\u0432"],
      ["offense", "\u2694 \u041D\u0430\u043F\u0430\u0434\u0435\u043D\u0438\u0435", "\u0412\u0441\u0435 \u0432\u043F\u0435\u0440\u0451\u0434: \u0430\u0442\u0430\u043A\u0430 \xD71.2 \u0438 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u044C \xD71.1, \u0431\u0440\u043E\u043D\u044F \xD70.85, \u0443\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u0435 \u22128%"]
    ];
    for (const [id, label, tip] of TACTICS) {
      const b = document.createElement("button");
      b.className = "small" + ((state2.settings.tactic || "balance") === id ? " primary" : "");
      b.textContent = label;
      b.title = tip;
      b.addEventListener("click", () => {
        state2.settings.tactic = id;
        ctx2.sfx?.("tap");
        ctx2.save();
        rerender();
      });
      tacticBox.appendChild(b);
    }
    const beltLabel = document.createElement("label");
    beltLabel.style.cssText = "display:flex;gap:6px;align-items:center;cursor:pointer;margin-left:8px;font-size:14px";
    const beltCheck = document.createElement("input");
    beltCheck.type = "checkbox";
    beltCheck.checked = state2.settings.useBeltItems !== false;
    beltCheck.addEventListener("change", () => {
      state2.settings.useBeltItems = beltCheck.checked;
      ctx2.sfx?.("tap");
      ctx2.save();
    });
    beltLabel.append(beltCheck, (() => {
      const s = document.createElement("span");
      s.textContent = "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u044B \u0441 \u043F\u043E\u044F\u0441\u0430";
      return s;
    })());
    tacticBox.appendChild(beltLabel);
    prepPanel.appendChild(tacticBox);
    const actions = document.createElement("div");
    actions.style.cssText = "display:flex;gap:10px;margin-top:12px;flex-wrap:wrap";
    const goBtn = document.createElement("button");
    goBtn.className = "primary";
    goBtn.textContent = "\u2694\uFE0F \u0412 \u0431\u043E\u0439!";
    goBtn.addEventListener("click", () => startBattle());
    actions.appendChild(goBtn);
    prepPanel.appendChild(actions);
    container.appendChild(prepPanel);
    function rerender() {
      container.innerHTML = "";
      renderFormation(container, ctx2, params);
    }
    function startBattle() {
      const seed = Date.now() % 1e5 + 1;
      const result = runBattle(state2, battle.id, seed);
      ctx2.save();
      playBattle(result);
    }
    function playBattle(result) {
      const unitDefs = /* @__PURE__ */ new Map();
      unitDefs.set("a0", { name: "\u0420\u044B\u0446\u0430\u0440\u044C \u043B\u0430\u0432\u043A\u0438", icon: "\u{1F6E1}\uFE0F", hp: result.report.knightHpMax });
      state2.squadMercs.forEach((id, i) => {
        const d = MERC_BY_ID[id];
        unitDefs.set(`a${i + 1}`, { name: d.name, icon: d.icon, hp: d.hp });
      });
      enemyEntries.forEach((e, i) => {
        const d = ENEMY_BY_ID[e.id];
        unitDefs.set(`e${i}`, { name: d.name, icon: d.icon, hp: Math.round(d.hp * (e.scale || 1)) });
      });
      playBattleReplay(container, ctx2, {
        title: battle.name,
        backTo: "battles",
        world: battle.world,
        result,
        unitDefs,
        overlayButtons: (rep) => {
          const nextB = rep.victory ? nextBattle(battle.id) : null;
          return [
            ...nextB ? [{ label: `\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0430\u044F \u0431\u0438\u0442\u0432\u0430 \u2192 ${nextB.name}`, primary: true, onClick: () => ctx2.go("battle", { id: nextB.id }) }] : [],
            { label: "\u{1F392} \u041A \u044D\u043A\u0438\u043F\u0438\u0440\u043E\u0432\u043A\u0435", onClick: () => ctx2.go("equip") },
            ...rep.victory ? [] : [
              { label: "\u{1F37A} \u0412 \u0442\u0430\u0432\u0435\u0440\u043D\u0443 \u2014 \u0443\u0441\u0438\u043B\u0438\u0442\u044C \u043E\u0442\u0440\u044F\u0434", onClick: () => ctx2.go("tavern") },
              { label: "\u{1F3EC} \u0412 \u0442\u043E\u0440\u0433\u043E\u0432\u044B\u0439 \u043A\u0432\u0430\u0440\u0442\u0430\u043B \u2014 \u0441\u043D\u0430\u0440\u044F\u0436\u0435\u043D\u0438\u0435", onClick: () => ctx2.go("hub", { scene: "market" }) }
            ],
            { label: "\u{1F501} \u0415\u0449\u0451 \u0440\u0430\u0437", onClick: () => ctx2.go("battle", { id: battle.id }) },
            { label: "\u041A \u043F\u043E\u0445\u043E\u0434\u0430\u043C", primary: !nextB, onClick: () => ctx2.go("battles") }
          ];
        }
      });
    }
    return () => {
      window.removeEventListener("pointermove", onDragMove);
      window.removeEventListener("pointerup", onDragEnd);
      if (unitDrag?.ghost) unitDrag.ghost.remove();
    };
  }
  function playBattleReplay(container, ctx2, { title, backTo = "battles", world, result, unitDefs, overlayButtons }) {
    container.innerHTML = "";
    container.appendChild(header(ctx2, title, "\u0411\u043E\u0439 \u0438\u0434\u0451\u0442 \u0441\u0430\u043C \u2014 \u0441\u043C\u043E\u0442\u0440\u0438 \u0438 \u0443\u0447\u0438\u0441\u044C", backTo));
    const field2 = document.createElement("div");
    field2.className = "form-field battle";
    addFieldBg(field2, world);
    container.appendChild(field2);
    const controls = document.createElement("div");
    controls.className = "panel";
    controls.style.cssText = "display:flex;gap:8px;align-items:center;margin-top:10px";
    controls.append(document.createTextNode("\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C: "));
    for (const [label, ms] of [["1x", 500], ["2x", 250], ["4x", 120]]) {
      const b = document.createElement("button");
      b.className = "small";
      b.textContent = label;
      b.addEventListener("click", () => {
        speed = ms;
      });
      controls.appendChild(b);
    }
    const skip = document.createElement("button");
    skip.className = "small ghost";
    skip.textContent = "\u23ED\uFE0F \u041A \u0438\u0442\u043E\u0433\u0443";
    skip.addEventListener("click", () => finishNow());
    controls.appendChild(skip);
    container.appendChild(controls);
    const logBox = document.createElement("div");
    logBox.className = "battle-log";
    container.appendChild(logBox);
    const figures = /* @__PURE__ */ new Map();
    const unitsByUid = /* @__PURE__ */ new Map();
    const allyInfo = new Map(result.formation.allies.map((a) => [a.uid, a.cell]));
    const foeInfo = new Map(result.formation.foes.map((f) => [f.uid, f.cell]));
    for (const [uid, def] of unitDefs) {
      const isAlly = uid.startsWith("a");
      const cell = isAlly ? allyInfo.get(uid) : foeInfo.get(uid);
      if (!cell) continue;
      const [x, y] = cellPos(cell[0], cell[1]);
      const el = document.createElement("div");
      el.className = "unit-figure " + (isAlly ? "ally" : "enemy");
      el.style.left = `${x}%`;
      el.style.top = `${y}%`;
      el.innerHTML = `
        <div class="uf-icon">${def.icon}</div>
        <div class="uf-name">${def.name}</div>
        <div class="uf-badges"></div>
        <div class="hpbar"><div style="width:100%"></div></div>`;
      field2.appendChild(el);
      const unit = { hp: def.hp, maxHp: def.hp, badges: /* @__PURE__ */ new Set() };
      figures.set(uid, { el, unit, side: isAlly ? "ally" : "enemy", x, y });
      unitsByUid.set(uid, unit);
    }
    let speed = 500;
    let timer = null;
    let i = 0;
    let done = false;
    function figOf(uid) {
      return figures.get(uid) || null;
    }
    function setHp(uid) {
      const f = figOf(uid);
      if (!f) return;
      const bar = f.el.querySelector(".hpbar > div");
      bar.style.width = `${Math.max(0, f.unit.hp / f.unit.maxHp * 100)}%`;
      f.el.classList.toggle("dead", f.unit.hp <= 0);
    }
    const STATUS_ICON = {
      poison: "\u2620\uFE0F",
      sleep: "\u{1F634}",
      slow: "\u{1F40C}",
      fear: "\u{1F628}",
      regen: "\u{1F49A}",
      shield: "\u{1F6E1}\uFE0F"
    };
    function renderBadges(fig) {
      const box = fig.el.querySelector(".uf-badges");
      if (!box) return;
      box.textContent = [...fig.unit.badges].map((k) => STATUS_ICON[k] || "\u2754").join("");
    }
    function logLine(cls, text) {
      const line = document.createElement("div");
      line.className = cls;
      line.textContent = text;
      logBox.appendChild(line);
      logBox.scrollTop = logBox.scrollHeight;
    }
    function pulse(el, cls, ms = 480) {
      if (!el) return;
      el.classList.remove(cls);
      void el.offsetWidth;
      el.classList.add(cls);
      setTimeout(() => el.classList.remove(cls), ms);
    }
    function animateHit(e) {
      const atk = figOf(e.fromUid);
      const def = figOf(e.toUid);
      if (!atk || !def) return;
      if (e.ranged) {
        const arrow = document.createElement("div");
        arrow.className = "projectile";
        arrow.textContent = e.elem === "fire" ? "\u{1F525}" : "\u27B9";
        arrow.style.left = `${atk.x}%`;
        arrow.style.top = `${atk.y}%`;
        field2.appendChild(arrow);
        requestAnimationFrame(() => {
          arrow.style.transform = `translate(${(def.x - atk.x) * field2.offsetWidth / 100}px, ${(def.y - atk.y) * field2.offsetHeight / 100}px)`;
        });
        setTimeout(() => arrow.remove(), 340);
        setTimeout(() => hitLand(def, e), 320);
      } else {
        const dx = (def.x - atk.x) * 0.5;
        const dy = (def.y - atk.y) * 0.5;
        atk.el.style.transition = "transform 0.14s ease";
        atk.el.style.transform = `translate(${dx * field2.offsetWidth / 100}px, ${dy * field2.offsetHeight / 100}px)`;
        setTimeout(() => {
          atk.el.style.transform = "";
          hitLand(def, e);
        }, 160);
      }
    }
    function hitLand(defFig, e) {
      defFig.unit.hp = Math.max(0, defFig.unit.hp - e.dmg);
      setHp(e.toUid);
      pulse(defFig.el, e.crit ? "anim-crit" : "anim-hit", 480);
      if (defFig.unit.hp <= 0) pulse(defFig.el, "anim-death", 650);
    }
    function applyEvent(e) {
      switch (e.t) {
        case "start":
          logLine("sys", `\u0421\u0442\u0440\u043E\u0439 \u0432\u044B\u0441\u0442\u0440\u043E\u0435\u043D: ${e.allies.join(", ")} \u043F\u0440\u043E\u0442\u0438\u0432 ${e.foes.join(", ")}.`);
          break;
        case "hit":
          animateHit(e);
          logLine(
            e.crit ? "crit" : "hit",
            `${e.from} \u2192 ${e.to}${e.skillName ? ` (${e.skillName})` : ""}: \u2212${e.dmg}${e.crit ? " \u041A\u0420\u0418\u0422!" : ""}`
          );
          ctx2.sfx?.(e.crit ? "crit" : "hit");
          break;
        case "status_fail":
          logLine("sys", `${e.who}: ${{ poison: "\u044F\u0434 \u043D\u0435 \u043F\u0440\u0438\u0432\u0438\u043B\u0441\u044F", sleep: "\u0441\u043E\u043D \u043D\u0435 \u043F\u043E\u0434\u0435\u0439\u0441\u0442\u0432\u043E\u0432\u0430\u043B", slow: "\u0441\u043F\u043E\u0440\u044B \u043D\u0435 \u043F\u0440\u0438\u0432\u0438\u043B\u0438\u0441\u044C", fear: "\u0441\u0442\u0440\u0430\u0445 \u043D\u0435 \u043F\u043E\u0434\u0435\u0439\u0441\u0442\u0432\u043E\u0432\u0430\u043B" }[e.kind] || "\u0441\u0442\u0430\u0442\u0443\u0441 \u043D\u0435 \u043F\u0440\u043E\u0448\u0451\u043B"}`);
          break;
        case "dodge":
          logLine("sys", `${e.who} \u0443\u043A\u043B\u043E\u043D\u044F\u0435\u0442\u0441\u044F!`);
          if (figOf(e.uid)) pulse(figOf(e.uid).el, "anim-dodge", 380);
          break;
        case "status": {
          const f = figOf(e.uid);
          if (f) {
            f.unit.badges.add(e.kind);
            renderBadges(f);
            pulse(f.el, "anim-status", 500);
          }
          logLine("status", `${e.who}: ${statusName(e.kind)}`);
          break;
        }
        case "status_end": {
          const f = figOf(e.uid);
          if (f) {
            f.unit.badges.delete(e.kind);
            renderBadges(f);
          }
          break;
        }
        case "move": {
          const f = figOf(e.uid);
          if (f) {
            const [nx, ny] = cellPos(e.to[0], e.to[1]);
            f.x = nx;
            f.y = ny;
            f.el.style.left = `${nx}%`;
            f.el.style.top = `${ny}%`;
          }
          break;
        }
        case "scroll": {
          logLine("potion", `\u{1F4DC} \u0420\u044B\u0446\u0430\u0440\u044C \u0447\u0438\u0442\u0430\u0435\u0442: ${e.name}!`);
          ctx2.sfx?.("crit");
          const f = figOf(e.uid);
          if (f) pulse(f.el, "anim-status", 500);
          break;
        }
        case "dot": {
          const f = figOf(e.uid);
          if (f) {
            f.unit.hp = Math.max(0, Math.min(f.unit.maxHp, f.unit.hp - e.dmg));
            setHp(e.uid);
            pulse(f.el, e.kind === "poison" ? "anim-poison" : "anim-heal", 320);
          }
          break;
        }
        case "sleeps":
          logLine("status", `${e.who} \u0441\u043F\u0438\u0442\u2026 \u{1F634}`);
          break;
        case "potion": {
          const f = figOf(e.uid);
          if (f && e.healed) {
            f.unit.hp = Math.min(f.unit.maxHp, f.unit.hp + e.healed);
            setHp(e.uid);
            pulse(f.el, "anim-heal", 700);
          }
          if (f && e.cleansed) {
            f.unit.badges.delete(e.cleansed);
            renderBadges(f);
          }
          logLine("potion", `${e.who} \u043F\u044C\u0451\u0442 ${e.name}${e.healed ? ` (+${e.healed} \u2764\uFE0F)` : ""}`);
          ctx2.sfx?.("potion");
          break;
        }
      }
    }
    function statusName(kind) {
      return { sleep: "\u0437\u0430\u0441\u044B\u043F\u0430\u0435\u0442 \u{1F634}", poison: "\u043E\u0442\u0440\u0430\u0432\u043B\u0435\u043D \u2620\uFE0F", slow: "\u0437\u0430\u043C\u0435\u0434\u043B\u0435\u043D \u{1F40C}", fear: "\u043E\u0445\u0432\u0430\u0447\u0435\u043D \u0441\u0442\u0440\u0430\u0445\u043E\u043C \u{1F628}", regen: "\u043F\u043E\u0434\u043A\u0440\u0435\u043F\u043B\u044F\u0435\u0442\u0441\u044F \u{1F49A}", shield: "\u043F\u043E\u0434 \u0449\u0438\u0442\u043E\u043C \u0437\u0435\u043B\u044C\u044F \u{1F6E1}\uFE0F" }[kind] || kind;
    }
    function step() {
      if (done) return;
      if (i >= result.log.length) {
        endScreen();
        return;
      }
      applyEvent(result.log[i]);
      const applied = result.log[i];
      i += 1;
      while (i < result.log.length && result.log[i].t === "dot") {
        applyEvent(result.log[i]);
        i += 1;
      }
      const delay = applied.t === "move" ? Math.max(70, speed * 0.3) : speed;
      timer = setTimeout(step, delay);
    }
    function finishNow() {
      if (done) return;
      while (i < result.log.length) {
        i += 1;
      }
      for (const f of figures.values()) f.unit.hp = 0;
      endScreen();
    }
    function endScreen() {
      if (done) return;
      done = true;
      clearTimeout(timer);
      const rep = result.report;
      ctx2.sfx?.(rep.victory ? "success" : "fail");
      const rewardHtml = (result.rewards || []).map(rewardText).filter(Boolean).join("<br>");
      const overlay = showOverlay(ctx2, {
        title: rep.victory ? "\u{1F3C6} \u041F\u043E\u0431\u0435\u0434\u0430!" : "\u{1F319} \u0420\u044B\u0446\u0430\u0440\u044C \u0432\u0435\u0440\u043D\u0443\u043B\u0441\u044F \u043E\u0442\u0434\u043E\u0445\u043D\u0443\u0442\u044C",
        subtitle: `\u0423\u0440\u043E\u043D\u0430 \u043D\u0430\u043D\u0435\u0441\u0435\u043D\u043E: ${rep.dealt} \xB7 \u041F\u043E\u043B\u0443\u0447\u0435\u043D\u043E: ${rep.taken} \xB7 \u0412\u0440\u0430\u0433\u043E\u0432 \u043F\u043E\u0432\u0435\u0440\u0436\u0435\u043D\u043E: ${rep.foesDown}/${rep.foesTotal}` + (rep.timedOut ? "<br>\u23F3 \u0411\u043E\u0439 \u0437\u0430\u0442\u044F\u043D\u0443\u043B\u0441\u044F \u0434\u043E \u043F\u0440\u0435\u0434\u0435\u043B\u0430 \u2014 \u043F\u043E\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u044C \u043D\u0435 \u0432\u044B\u044F\u0432\u043B\u0435\u043D." : "") + ((rep.alliesStats || []).length > 1 ? "<br>" + rep.alliesStats.map((a) => `${a.icon} ${a.name}: ${a.dealt} \u0443\u0440\u043E\u043D\u0430${a.alive ? "" : " (\u043F\u0430\u043B)"}`).join(" \xB7 ") : ""),
        rewards: [],
        advice: rep.advice,
        buttons: overlayButtons(rep)
      });
      if (rewardHtml) {
        const card = overlay.querySelector(".card");
        const rw = document.createElement("div");
        rw.className = "rewards";
        rw.innerHTML = rewardHtml;
        card.insertBefore(rw, card.querySelector(".advice") || card.querySelector(".actions"));
      }
    }
    step();
  }

  // src/ui/seekEditorView.js
  function renderSeekEditorList(container, ctx2) {
    container.appendChild(header(ctx2, "\u0420\u0435\u0434\u0430\u043A\u0442\u043E\u0440 \u0438\u0441\u043A\u0430\u043B\u043E\u043A", "\u0412\u044B\u0431\u0435\u0440\u0438 \u0443\u0440\u043E\u0432\u0435\u043D\u044C \u2014 \u043F\u043E\u0434\u0432\u0438\u043D\u0443\u0442\u044C \u0438\u043B\u0438 \u0438\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u043E\u0431\u043B\u0430\u0441\u0442\u0438", "workshop"));
    const ovCount = Object.keys(loadSeekOverrides()).length;
    if (ovCount > 0) {
      const panel = document.createElement("div");
      panel.className = "panel";
      panel.innerHTML = `<div class="muted" style="font-size:13px">\u041F\u0440\u0430\u0432\u043E\u043A \u043D\u0430\u043A\u043E\u043F\u043B\u0435\u043D\u043E: <b>${ovCount}</b> \u2014 \u0445\u0440\u0430\u043D\u044F\u0442\u0441\u044F \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u043E \u043E\u0442 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F, \u043D\u043E\u0432\u0430\u044F \u0438\u0433\u0440\u0430 \u0438\u0445 \u043D\u0435 \u0441\u043E\u0442\u0440\u0451\u0442.</div>`;
      const expBtn = document.createElement("button");
      expBtn.className = "small primary";
      expBtn.textContent = "\u{1F4E6} \u042D\u043A\u0441\u043F\u043E\u0440\u0442 \u0432\u0441\u0435\u0445 \u043F\u0440\u0430\u0432\u043E\u043A";
      expBtn.addEventListener("click", async () => {
        const json = JSON.stringify(loadSeekOverrides(), null, 2);
        try {
          await navigator.clipboard.writeText(json);
          ctx2.toast("\u0412\u0441\u0435 \u043F\u0440\u0430\u0432\u043A\u0438 \u0432 \u0431\u0443\u0444\u0435\u0440\u0435 \u2014 \u043F\u0440\u0438\u0448\u043B\u0438 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A\u0443, \u0432\u0448\u044C\u0451\u043C \u0432 \u0434\u0430\u043D\u043D\u044B\u0435 \u0438\u0433\u0440\u044B.");
        } catch {
          console.log(json);
          ctx2.toast("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u2014 JSON \u0432 \u043A\u043E\u043D\u0441\u043E\u043B\u0438.");
        }
      });
      panel.appendChild(expBtn);
      container.appendChild(panel);
    }
    const list = document.createElement("div");
    list.className = "list";
    for (const p of SEEK_PUZZLES) {
      const row = document.createElement("div");
      row.className = "row";
      const hasOverride = !!loadSeekOverrides()[p.id] || !!ctx2.state.seekOverrides?.[p.id];
      row.innerHTML = `
      <span class="icon">\u{1F50D}</span>
      <span class="grow">
        <div class="name">${p.name} ${hasOverride ? '<span class="badge rare">\u043F\u0440\u0430\u0432\u043A\u0430</span>' : ""}</div>
        <div class="desc">\u0413\u0440\u0443\u043F\u043F: ${p.groups.length} \xB7 \u0441\u043F\u043E\u0442\u043E\u0432: ${p.groups.reduce((n, g) => n + g.spots.length, 0)}</div>
      </span>`;
      const btn = document.createElement("button");
      btn.className = "small";
      btn.textContent = "\u041F\u0440\u0430\u0432\u0438\u0442\u044C";
      btn.addEventListener("click", () => ctx2.go("seekeditor", { id: p.id }));
      row.appendChild(btn);
      list.appendChild(row);
    }
    container.appendChild(list);
  }
  function renderSeekEditor(container, ctx2, params) {
    const raw = SEEK_PUZZLES.find((p) => p.id === params.id);
    if (!raw) {
      ctx2.go("seekeditor");
      return;
    }
    const base = applySeekOverrides(ctx2.state, raw);
    let groups = JSON.parse(JSON.stringify(base.groups));
    let selected = null;
    let drag = null;
    container.appendChild(header(
      ctx2,
      `\u041F\u0440\u0430\u0432\u043A\u0430: ${raw.name}`,
      "\u0422\u044F\u043D\u0438 \u043A\u0440\u0443\u0433\u0438, \u0447\u0442\u043E\u0431\u044B \u0434\u0432\u0438\u0433\u0430\u0442\u044C. +/\u2212 \u043C\u0435\u043D\u044F\u0435\u0442 \u0440\u0430\u0434\u0438\u0443\u0441 (\u0438\u043B\u0438 \u043A\u043E\u043B\u0435\u0441\u043E \u043C\u044B\u0448\u0438).",
      "seekeditor"
    ));
    const [W, H] = raw.sceneSize || [1e3, 650];
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
    canvas.style.touchAction = "none";
    canvasBox.appendChild(canvas);
    wrap.appendChild(canvasBox);
    const side = document.createElement("div");
    side.className = "puzzle-side";
    const infoEl = document.createElement("div");
    infoEl.className = "puzzle-status";
    side.appendChild(infoEl);
    const radiusRow = document.createElement("div");
    radiusRow.style.cssText = "display:flex;gap:8px;align-items:center;margin-bottom:10px;flex-wrap:wrap";
    const minus = mkBtn("\u2796 \u0420\u0430\u0434\u0438\u0443\u0441", () => resize(-4));
    const plus = mkBtn("\u2795 \u0420\u0430\u0434\u0438\u0443\u0441", () => resize(4));
    radiusRow.append(minus, plus);
    const navRow = document.createElement("div");
    navRow.style.cssText = "display:flex;gap:8px;align-items:center;margin-bottom:10px";
    const navPrev = mkBtn("\u2039", () => cycleSpot(-1));
    const navLabel = document.createElement("span");
    navLabel.className = "muted";
    navLabel.style.fontSize = "14px";
    navLabel.textContent = "\u2014";
    const navNext = mkBtn("\u203A", () => cycleSpot(1));
    navRow.append(navPrev, navLabel, navNext);
    radiusRow.append(navRow);
    const addModeBtn = mkBtn("\u2795 \u041A\u0440\u0443\u0436\u043E\u043A", toggleAddMode);
    const delBtn = mkBtn("\u{1F5D1} \u0423\u0434\u0430\u043B\u0438\u0442\u044C", deleteSpot);
    radiusRow.append(addModeBtn, delBtn);
    side.appendChild(radiusRow);
    const actions = document.createElement("div");
    actions.className = "puzzle-controls";
    const saveBtn = mkBtn("\u{1F4BE} \u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C", () => {
      saveSeekOverride(ctx2.state, raw.id, groups);
      ctx2.save();
      ctx2.sfx?.("success");
      ctx2.toast("\u041F\u0440\u0430\u0432\u043A\u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u044B \u0438 \u0443\u0436\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0443\u044E\u0442 \u0432 \u0438\u0433\u0440\u0435.");
      refreshInfo();
    });
    const resetBtn = mkBtn("\u{1F5D1}\uFE0F \u041A \u0438\u0441\u0445\u043E\u0434\u043D\u044B\u043C", () => {
      if (!confirm("\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u043F\u0440\u0430\u0432\u043A\u0438 \u044D\u0442\u043E\u0433\u043E \u0443\u0440\u043E\u0432\u043D\u044F \u043A \u0438\u0441\u0445\u043E\u0434\u043D\u044B\u043C \u043A\u043E\u043E\u0440\u0434\u0438\u043D\u0430\u0442\u0430\u043C?")) return;
      resetSeekOverride(ctx2.state, raw.id);
      ctx2.save();
      groups = JSON.parse(JSON.stringify(SEEK_PUZZLES.find((p) => p.id === raw.id).groups));
      selected = null;
      ctx2.toast("\u041A\u043E\u043E\u0440\u0434\u0438\u043D\u0430\u0442\u044B \u0438\u0441\u0445\u043E\u0434\u043D\u044B\u0435.");
      draw();
      refreshInfo();
    });
    const exportBtn = mkBtn("\u{1F4E4} JSON", exportJson);
    actions.append(saveBtn, resetBtn, exportBtn);
    side.appendChild(actions);
    const groupsList = document.createElement("div");
    groupsList.className = "panel mt";
    side.appendChild(groupsList);
    wrap.appendChild(side);
    container.appendChild(wrap);
    function mkBtn(label, fn) {
      const b = document.createElement("button");
      b.className = "small";
      b.innerHTML = label;
      b.addEventListener("click", fn);
      return b;
    }
    let bgImage = null;
    if (typeof Image !== "undefined") {
      const bgName = raw.bg || `seek_${raw.world}`;
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
    function eventPos(ev) {
      const rect = canvas.getBoundingClientRect();
      const sx = canvas.width / dpr / rect.width;
      const sy = canvas.height / dpr / rect.height;
      return [(ev.clientX - rect.left) * sx, (ev.clientY - rect.top) * sy];
    }
    function spotAt(x, y) {
      let best = null;
      let bestD = Infinity;
      for (const g of groups) {
        g.spots.forEach((s, i) => {
          const d = Math.hypot(x - s.x, y - s.y);
          if (d < s.r && d < bestD) {
            bestD = d;
            best = { groupId: g.id, spotIndex: i };
          }
        });
      }
      return best;
    }
    let addMode = false;
    function toggleAddMode() {
      addMode = !addMode;
      addModeBtn.classList.toggle("primary", addMode);
      ctx2.toast(addMode ? "\u0420\u0435\u0436\u0438\u043C \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u044F: \u0442\u0430\u043F \u043F\u043E \u0441\u0446\u0435\u043D\u0435 \u043F\u043E\u0441\u0442\u0430\u0432\u0438\u0442 \u043D\u043E\u0432\u044B\u0439 \u043A\u0440\u0443\u0436\u043E\u043A \u0432 \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u044B\u0439 \u0432\u0438\u0434." : "\u0420\u0435\u0436\u0438\u043C \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D.");
      if (addMode && !selected) {
        ctx2.toast("\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0432\u044B\u0431\u0435\u0440\u0438 \u0432\u0438\u0434 \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u043E\u0432 \u0432 \u0441\u043F\u0438\u0441\u043A\u0435 \u0441\u043F\u0440\u0430\u0432\u0430.");
      }
    }
    function deleteSpot() {
      if (!selected) {
        ctx2.toast("\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0432\u044B\u0431\u0435\u0440\u0438 \u043E\u0431\u043B\u0430\u0441\u0442\u044C \u0442\u0430\u043F\u043E\u043C.");
        return;
      }
      const gi = groups.findIndex((g2) => g2.id === selected.groupId);
      if (gi < 0) return;
      const g = groups[gi];
      if (g.spots.length <= 1) {
        if (!confirm(`\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439 \u043A\u0440\u0443\u0436\u043E\u043A \u2014 \u0432\u0438\u0434 \xAB${g.label}\xBB \u0438\u0441\u0447\u0435\u0437\u043D\u0435\u0442 \u0438\u0437 \u0443\u0440\u043E\u0432\u043D\u044F. \u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C?`)) return;
        groups.splice(gi, 1);
      } else {
        g.spots.splice(selected.spotIndex, 1);
      }
      selected = null;
      ctx2.sfx?.("tap");
      draw();
      refreshInfo();
    }
    function cycleSpot(dir) {
      if (!selected) {
        ctx2.toast("\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0432\u044B\u0431\u0435\u0440\u0438 \u0432\u0438\u0434 \u0432 \u0441\u043F\u0438\u0441\u043A\u0435.");
        return;
      }
      const g = groups.find((g2) => g2.id === selected.groupId);
      if (!g) return;
      const n = g.spots.length;
      selected = { groupId: g.id, spotIndex: ((selected.spotIndex + dir) % n + n) % n };
      ctx2.sfx?.("tap");
      draw();
      refreshInfo();
    }
    canvas.addEventListener("pointerdown", (ev) => {
      const [x, y] = eventPos(ev);
      const hit = spotAt(x, y);
      if (addMode && !hit) {
        if (!selected) {
          ctx2.toast("\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0432\u044B\u0431\u0435\u0440\u0438 \u0432\u0438\u0434 \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u043E\u0432 \u0432 \u0441\u043F\u0438\u0441\u043A\u0435 \u0441\u043F\u0440\u0430\u0432\u0430.");
          return;
        }
        const g = groups.find((g2) => g2.id === selected.groupId);
        if (!g) return;
        g.spots.push({ x: Math.round(x), y: Math.round(y), r: 42 });
        selected = { groupId: g.id, spotIndex: g.spots.length - 1 };
        ctx2.sfx?.("coin");
        draw();
        refreshInfo();
        return;
      }
      selected = hit;
      if (hit) {
        drag = { startX: x, startY: y, moved: false };
        canvas.setPointerCapture?.(ev.pointerId);
      }
      draw();
      refreshInfo();
    });
    canvas.addEventListener("pointermove", (ev) => {
      if (!drag || !selected) return;
      const [x, y] = eventPos(ev);
      if (Math.hypot(x - drag.startX, y - drag.startY) > 3) drag.moved = true;
      if (drag.moved) {
        const g = groups.find((g2) => g2.id === selected.groupId);
        const s = g.spots[selected.spotIndex];
        s.x = Math.round(Math.max(0, Math.min(W, x)));
        s.y = Math.round(Math.max(0, Math.min(H, y)));
        draw();
        refreshInfo();
      }
    });
    canvas.addEventListener("pointerup", () => {
      drag = null;
    });
    canvas.addEventListener("wheel", (ev) => {
      if (!selected) return;
      ev.preventDefault();
      resize(ev.deltaY < 0 ? 4 : -4);
    }, { passive: false });
    function resize(delta) {
      if (!selected) {
        ctx2.toast("\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0432\u044B\u0431\u0435\u0440\u0438 \u043E\u0431\u043B\u0430\u0441\u0442\u044C \u0442\u0430\u043F\u043E\u043C.");
        return;
      }
      const g = groups.find((g2) => g2.id === selected.groupId);
      const s = g.spots[selected.spotIndex];
      s.r = Math.max(12, Math.min(120, s.r + delta));
      ctx2.sfx?.("tap");
      draw();
      refreshInfo();
    }
    function refreshInfo() {
      const probe = { ...raw, groups };
      const v = validateSeekLevel(probe);
      let sel = "\u0422\u0430\u043F\u043D\u0438 \u043A\u0440\u0443\u0433, \u0447\u0442\u043E\u0431\u044B \u0432\u044B\u0431\u0440\u0430\u0442\u044C \u043E\u0431\u043B\u0430\u0441\u0442\u044C.";
      if (selected) {
        const g = groups.find((g2) => g2.id === selected.groupId);
        if (g) {
          const s = g.spots[selected.spotIndex];
          sel = `\u0412\u044B\u0431\u0440\u0430\u043D\u043E: <b>${g.label}</b> \u2116${selected.spotIndex + 1} \u0438\u0437 ${g.spots.length} \xB7 x=${s.x} y=${s.y} r=${s.r}`;
          navLabel.textContent = `\u2116${selected.spotIndex + 1} \u0438\u0437 ${g.spots.length}`;
        }
      } else {
        navLabel.textContent = "\u2014";
      }
      infoEl.innerHTML = sel + `<div class="muted" style="font-size:13px">${v.ok ? "\u2705 \u0423\u0440\u043E\u0432\u0435\u043D\u044C \u0432\u0430\u043B\u0438\u0434\u0435\u043D" : "\u26A0\uFE0F " + v.problems.join("; ")}</div>`;
      groupsList.innerHTML = "";
      for (const g of groups) {
        const row = document.createElement("div");
        row.style.cssText = `font-size:13px;padding:3px 6px;border-radius:6px;cursor:pointer;${selected?.groupId === g.id ? "background:rgba(255,202,122,0.15)" : ""}`;
        row.textContent = `${g.label} \u2014 ${g.spots.length} \u0448\u0442.`;
        row.addEventListener("click", () => {
          if (selected?.groupId === g.id && g.spots.length > 1) {
            cycleSpot(1);
            return;
          }
          selected = { groupId: g.id, spotIndex: 0 };
          draw();
          refreshInfo();
        });
        groupsList.appendChild(row);
      }
    }
    function draw() {
      const g2d = canvas.getContext("2d");
      g2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      g2d.clearRect(0, 0, W, H);
      if (bgImage) g2d.drawImage(bgImage, 0, 0, W, H);
      else {
        g2d.fillStyle = "#3a2f20";
        g2d.fillRect(0, 0, W, H);
      }
      const palette = ["#ffd98a", "#8fd18b", "#a8d8ff", "#d3a8ff", "#ff9a7a", "#7adfd1", "#f3a6c8", "#c9e88a"];
      groups.forEach((g, gi) => {
        const color = palette[gi % palette.length];
        g.spots.forEach((s, i) => {
          const isSel = selected && selected.groupId === g.id && selected.spotIndex === i;
          g2d.strokeStyle = color;
          g2d.lineWidth = isSel ? 4 : 2;
          g2d.setLineDash(isSel ? [] : [6, 5]);
          g2d.beginPath();
          g2d.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          g2d.stroke();
          g2d.setLineDash([]);
          if (isSel) {
            g2d.fillStyle = color;
            g2d.beginPath();
            g2d.arc(s.x, s.y, 5, 0, Math.PI * 2);
            g2d.fill();
          }
          if (selected && selected.groupId === g.id) {
            g2d.fillStyle = color;
            g2d.font = "bold 13px sans-serif";
            g2d.textAlign = "center";
            g2d.textBaseline = "middle";
            g2d.shadowColor = "rgba(0,0,0,0.8)";
            g2d.shadowBlur = 3;
            g2d.fillText(String(i + 1), s.x, s.y - s.r - 10);
            g2d.shadowBlur = 0;
          }
        });
      });
    }
    async function exportJson() {
      const json = JSON.stringify(groups, null, 2);
      try {
        await navigator.clipboard.writeText(json);
        ctx2.toast("JSON \u0433\u0440\u0443\u043F\u043F \u0441\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D \u2014 \u043F\u0440\u0438\u0448\u043B\u0438 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A\u0443, \u0432\u0448\u044C\u0451\u043C \u0432 \u0438\u0433\u0440\u0443.");
      } catch {
        ctx2.toast("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u2014 \u0441\u043C\u043E\u0442\u0440\u0438 \u043A\u043E\u043D\u0441\u043E\u043B\u044C.");
        console.log(json);
      }
    }
    draw();
    refreshInfo();
  }

  // src/data/achievements.js
  var ACHIEVEMENTS = [
    {
      id: "first_puzzle",
      icon: "\u{1F9E9}",
      name: "\u041F\u0435\u0440\u0432\u0430\u044F \u0437\u0430\u0433\u0430\u0434\u043A\u0430",
      desc: "\u0420\u0435\u0448\u0438\u0442\u044C \u043F\u0435\u0440\u0432\u0443\u044E \u0433\u043E\u043B\u043E\u0432\u043E\u043B\u043E\u043C\u043A\u0443.",
      check: (s) => s.stats.puzzlesSolved >= 1
    },
    {
      id: "ten_puzzles",
      icon: "\u{1F3EE}",
      name: "\u0414\u0435\u0441\u044F\u0442\u043A\u0430 \u0444\u043E\u043D\u0430\u0440\u0435\u0439",
      desc: "\u0420\u0435\u0448\u0438\u0442\u044C 10 \u0433\u043E\u043B\u043E\u0432\u043E\u043B\u043E\u043C\u043E\u043A.",
      check: (s) => s.stats.puzzlesSolved >= 10
    },
    {
      id: "meadow_master",
      icon: "\u{1F33F}",
      name: "\u0425\u043E\u0437\u044F\u0438\u043D \u043E\u043F\u0443\u0448\u043A\u0438",
      desc: "\u0420\u0435\u0448\u0438\u0442\u044C \u0432\u0441\u0435 \u0437\u0430\u0433\u0430\u0434\u043A\u0438 \u0422\u0438\u0445\u043E\u0439 \u043E\u043F\u0443\u0448\u043A\u0438 (md_01\u2013md_12).",
      check: (s) => Array.from({ length: 12 }, (_, i) => `md_${String(i + 1).padStart(2, "0")}`).every((id) => s.puzzlesDone[id])
    },
    {
      id: "half_campaign",
      icon: "\u{1F4D6}",
      name: "\u041F\u043E\u043B\u043E\u0432\u0438\u043D\u0430 \u043F\u0443\u0442\u0438",
      desc: "\u0420\u0435\u0448\u0438\u0442\u044C \u043F\u043E\u043B\u043E\u0432\u0438\u043D\u0443 \u0432\u0441\u0435\u0445 \u0437\u0430\u0433\u0430\u0434\u043E\u043A \u043A\u0430\u043C\u043F\u0430\u043D\u0438\u0438.",
      check: (s, ctx2) => s.stats.puzzlesSolved >= Math.ceil(ctx2.puzzlesTotal / 2)
    },
    {
      id: "all_puzzles",
      icon: "\u{1F31F}",
      name: "\u041C\u0430\u0441\u0442\u0435\u0440 \u0437\u0430\u0433\u0430\u0434\u043E\u043A",
      desc: "\u0420\u0435\u0448\u0438\u0442\u044C \u0432\u0441\u0435 \u0437\u0430\u0433\u0430\u0434\u043A\u0438 \u043A\u0430\u043C\u043F\u0430\u043D\u0438\u0438.",
      check: (s, ctx2) => s.stats.puzzlesSolved >= ctx2.puzzlesTotal
    },
    {
      id: "first_battle",
      icon: "\u2694\uFE0F",
      name: "\u041F\u0435\u0440\u0432\u044B\u0439 \u043F\u043E\u0445\u043E\u0434",
      desc: "\u041F\u043E\u0431\u0435\u0434\u0438\u0442\u044C \u0432 \u043F\u0435\u0440\u0432\u043E\u043C \u0431\u043E\u044E.",
      check: (s) => s.stats.battlesWon >= 1
    },
    {
      id: "willow_down",
      icon: "\u{1F333}",
      name: "\u041F\u0430\u0434\u0435\u043D\u0438\u0435 \u0438\u0432\u044B",
      desc: "\u041F\u043E\u0431\u0435\u0434\u0438\u0442\u044C \u0425\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044F \u0441\u0442\u0430\u0440\u043E\u0439 \u0438\u0432\u044B.",
      check: (s) => !!s.battlesDone.bt_boss_willow
    },
    {
      id: "keeper_down",
      icon: "\u{1F4D6}",
      name: "\u041A\u043E\u043D\u0435\u0446 \u0438\u0441\u0442\u043E\u0440\u0438\u0438",
      desc: "\u041F\u043E\u0431\u0435\u0434\u0438\u0442\u044C \u0425\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044F \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0439 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B.",
      check: (s) => !!s.battlesDone.bk_boss_keeper
    },
    {
      id: "time_down",
      icon: "\u23F3",
      name: "\u0412\u0440\u0435\u043C\u0435\u043D\u0438 \u0431\u043E\u043B\u044C\u0448\u0435 \u043D\u0435\u0442",
      desc: "\u041F\u043E\u0431\u0435\u0434\u0438\u0442\u044C \u0421\u0430\u043C\u043E \u0412\u0440\u0435\u043C\u044F \u2014 \u0444\u0438\u043D\u0430\u043B\u044C\u043D\u043E\u0433\u043E \u0431\u043E\u0441\u0441\u0430.",
      check: (s) => !!s.battlesDone.mist_boss
    },
    {
      id: "fifty_battles",
      icon: "\u{1F5E1}\uFE0F",
      name: "\u041F\u043E\u043B\u0441\u043E\u0442\u043D\u0438 \u043F\u043E\u0431\u0435\u0434",
      desc: "\u041F\u0440\u043E\u0439\u0442\u0438 50 \u0431\u043E\u0451\u0432.",
      check: (s) => Object.keys(s.battlesDone).length >= 50
    },
    {
      id: "all_battles",
      icon: "\u{1F451}",
      name: "\u041F\u043E\u043A\u043E\u0440\u0438\u0442\u0435\u043B\u044C \u043C\u0438\u0440\u043E\u0432",
      desc: "\u041F\u0440\u043E\u0439\u0442\u0438 \u0432\u0441\u0435 200 \u0431\u043E\u0451\u0432.",
      check: (s, ctx2) => Object.keys(s.battlesDone).length >= ctx2.battlesTotal
    },
    {
      id: "crew_five",
      icon: "\u{1F43E}",
      name: "\u0411\u043E\u043B\u044C\u0448\u0430\u044F \u0441\u0435\u043C\u044C\u044F",
      desc: "\u041D\u0430\u043D\u044F\u0442\u044C 5 \u0447\u043B\u0435\u043D\u043E\u0432 \u043A\u043E\u043C\u0430\u043D\u0434\u044B.",
      check: (s) => (s.crew || []).length >= 5
    },
    {
      id: "first_craft",
      icon: "\u2692\uFE0F",
      name: "\u041F\u0435\u0440\u0432\u0430\u044F \u0440\u0430\u0431\u043E\u0442\u0430",
      desc: "\u0421\u0434\u0435\u043B\u0430\u0442\u044C \u0447\u0442\u043E-\u043D\u0438\u0431\u0443\u0434\u044C \u0432 \u043A\u0443\u0437\u043D\u0438\u0446\u0435.",
      check: (s) => (s.stats.itemsCrafted || 0) >= 1
    },
    {
      id: "rich",
      icon: "\u{1F4B0}",
      name: "\u0417\u0432\u043E\u043D \u043F\u043E\u043B\u043D\u044B\u0445 \u043A\u0430\u0440\u043C\u0430\u043D\u043E\u0432",
      desc: "\u0417\u0430\u0440\u0430\u0431\u043E\u0442\u0430\u0442\u044C \u0441\u0443\u043C\u043C\u0430\u0440\u043D\u043E 5000 \u043C\u043E\u043D\u0435\u0442.",
      check: (s) => s.stats.coinsEarned >= 5e3
    },
    {
      id: "seals_five",
      icon: "\u{1F530}",
      name: "\u041A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u044F \u043F\u0435\u0447\u0430\u0442\u0435\u0439",
      desc: "\u0418\u043C\u0435\u0442\u044C 5 \u043F\u0435\u0447\u0430\u0442\u0435\u0439 \u043C\u0430\u0441\u0442\u0435\u0440\u0430 \u043E\u0434\u043D\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E.",
      check: (s) => s.seals >= 5
    },
    {
      id: "shopper",
      icon: "\u{1F6CD}\uFE0F",
      name: "\u0417\u0430\u0432\u0441\u0435\u0433\u0434\u0430\u0442\u0430\u0439 \u043F\u0440\u0438\u043B\u0430\u0432\u043A\u0430",
      desc: "\u0421\u0434\u0435\u043B\u0430\u0442\u044C 20 \u043F\u043E\u043A\u0443\u043F\u043E\u043A.",
      check: (s) => (s.stats.itemsBought || 0) >= 20
    },
    {
      id: "seek_master",
      icon: "\u{1F50D}",
      name: "\u041E\u0440\u043B\u0438\u043D\u044B\u0439 \u0433\u043B\u0430\u0437",
      desc: "\u041F\u0440\u043E\u0439\u0442\u0438 \u0432\u0441\u0435 \u0438\u0441\u043A\u0430\u043B\u043A\u0438 \u043A\u0430\u043C\u043F\u0430\u043D\u0438\u0438.",
      check: (s, ctx2) => ctx2.seekIds.every((id) => s.puzzlesDone[id])
    },
    {
      id: "cat_friend",
      icon: "\u{1F408}",
      name: "\u041C\u0443\u0440\u043B\u044B\u043A\u0430\u043B\u043E",
      desc: "\u041F\u043E\u0433\u043B\u0430\u0434\u0438\u0442\u044C \u043A\u043E\u0442\u0430-\u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044F 25 \u0440\u0430\u0437.",
      check: (s) => (s.stats.catPets || 0) >= 25
    }
  ];
  function checkAchievements(state2, ctx2) {
    state2.achievements ||= {};
    const fresh = [];
    for (const a of ACHIEVEMENTS) {
      if (state2.achievements[a.id]) continue;
      if (a.check(state2, ctx2)) {
        state2.achievements[a.id] = Date.now();
        fresh.push(a);
      }
    }
    return fresh;
  }

  // src/ui/achievementsView.js
  function renderAchievements(container, ctx2) {
    const { state: state2 } = ctx2;
    const unlocked = state2.achievements || {};
    const total = Object.keys(unlocked).length;
    container.appendChild(header(
      ctx2,
      "\u0414\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u044F",
      `${total}/${ACHIEVEMENTS.length} \u2014 \u043F\u043E\u043B\u043A\u0438 \u0442\u0440\u043E\u0444\u0435\u0435\u0432 \u043B\u0430\u0432\u043A\u0438`
    ));
    const list = document.createElement("div");
    list.className = "list";
    for (const a of ACHIEVEMENTS) {
      const got = !!unlocked[a.id];
      const row = document.createElement("div");
      row.className = "row" + (got ? " done" : " locked");
      const date = got ? new Date(unlocked[a.id]).toLocaleDateString("ru-RU") : "";
      row.innerHTML = `
      <span class="icon">${got ? a.icon : "\u{1F512}"}</span>
      <span class="grow">
        <div class="name">${a.name}</div>
        <div class="desc">${a.desc}${date ? ` \xB7 ${date}` : ""}</div>
      </span>
      <span class="price">${got ? "\u2713" : ""}</span>`;
      list.appendChild(row);
    }
    container.appendChild(list);
    container.appendChild(quickNav(ctx2, [{ icon: "\u{1F3E0}", label: "\u0412 \u043B\u0430\u0432\u043A\u0443", screen: "hub" }]));
  }

  // src/ui/sandboxView.js
  var MAX_TEAM = 6;
  function renderSandbox(container, ctx2) {
    const { state: state2 } = ctx2;
    const picked = renderSandbox._picked ||= { allies: ["merc_guard", "merc_archer"], foes: ["slime_meadow", "slime_meadow"] };
    container.appendChild(header(
      ctx2,
      "\u2694\uFE0F \u041A\u043E\u043D\u0441\u0442\u0440\u0443\u043A\u0442\u043E\u0440 \u0431\u043E\u044F",
      "\u0421\u043E\u0431\u0435\u0440\u0438 \u043E\u0431\u0435 \u043A\u043E\u043C\u0430\u043D\u0434\u044B \u0438 \u043F\u0440\u043E\u0432\u0435\u0440\u044C \u0441\u0438\u043C\u0443\u043B\u044F\u0446\u0438\u044E: \u043E\u0434\u0438\u043D \u0431\u043E\u0439 \u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u0438\u043B\u0438 \u0441\u0435\u0440\u0438\u044F \u043D\u0430 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0443",
      "workshop"
    ));
    function rerender() {
      container.innerHTML = "";
      renderSandbox(container, ctx2);
    }
    function teamPanel(title, pool, list, getDef) {
      const panel = document.createElement("div");
      panel.className = "panel";
      const h = document.createElement("h3");
      h.textContent = `${title} (${list.length}/${MAX_TEAM})`;
      h.style.marginTop = "0";
      panel.appendChild(h);
      const team = document.createElement("div");
      team.style.cssText = "display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;min-height:34px";
      if (list.length === 0) {
        team.innerHTML = '<span class="muted">\u041F\u0443\u0441\u0442\u043E \u2014 \u0434\u043E\u0431\u0430\u0432\u044C \u0431\u043E\u0439\u0446\u043E\u0432 \u043D\u0438\u0436\u0435</span>';
      }
      list.forEach((id, i) => {
        const d = getDef(id);
        const chip = document.createElement("button");
        chip.className = "small primary";
        chip.textContent = `${d.icon} ${d.name} \u2715`;
        chip.title = "\u0423\u0431\u0440\u0430\u0442\u044C \u0438\u0437 \u043A\u043E\u043C\u0430\u043D\u0434\u044B";
        chip.addEventListener("click", () => {
          ctx2.sfx?.("tap");
          list.splice(i, 1);
          rerender();
        });
        team.appendChild(chip);
      });
      panel.appendChild(team);
      const grid = document.createElement("div");
      grid.style.cssText = "display:flex;flex-wrap:wrap;gap:6px;max-height:190px;overflow-y:auto";
      for (const id of pool) {
        const d = getDef(id);
        const b = document.createElement("button");
        b.className = "small";
        const count = list.filter((x) => x === id).length;
        b.innerHTML = `${d.icon} ${d.name}${d.boss ? ' <span class="badge epic">\u0411\u041E\u0421\u0421</span>' : ""}${count ? ` \xD7${count}` : ""}`;
        b.title = d.description || `${d.hp}\u2764 \u0430\u0442\u043A ${d.attack} \u0431\u0440\u043D ${d.armor} \u0441\u043A\u0440 ${d.speed}`;
        b.disabled = list.length >= MAX_TEAM;
        b.addEventListener("click", () => {
          ctx2.sfx?.("tap");
          list.push(id);
          rerender();
        });
        grid.appendChild(b);
      }
      panel.appendChild(grid);
      return panel;
    }
    container.appendChild(teamPanel(
      "\u0422\u0432\u043E\u0439 \u043E\u0442\u0440\u044F\u0434 \u2014 \u043D\u0430\u0451\u043C\u043D\u0438\u043A\u0438",
      MERCENARIES.map((m) => m.id),
      picked.allies,
      (id) => MERC_BY_ID[id]
    ));
    container.appendChild(teamPanel(
      "\u041F\u0440\u043E\u0442\u0438\u0432\u043D\u0438\u043A",
      Object.values(ENEMY_BY_ID).map((e) => e.id),
      picked.foes,
      (id) => ENEMY_BY_ID[id]
    ));
    const tacticBox = document.createElement("div");
    tacticBox.className = "panel";
    tacticBox.style.cssText = "display:flex;gap:6px;align-items:center;flex-wrap:wrap";
    const tacticTitle = document.createElement("span");
    tacticTitle.textContent = "\u0422\u0430\u043A\u0442\u0438\u043A\u0430 \u0441\u043E\u044E\u0437\u043D\u0438\u043A\u043E\u0432:";
    tacticBox.appendChild(tacticTitle);
    for (const [id, label] of [["defense", "\u{1F6E1} \u0417\u0430\u0449\u0438\u0442\u0430"], ["balance", "\u2696 \u0411\u0430\u043B\u0430\u043D\u0441"], ["offense", "\u2694 \u041D\u0430\u043F\u0430\u0434\u0435\u043D\u0438\u0435"]]) {
      const b = document.createElement("button");
      b.className = "small" + ((state2.settings.tactic || "balance") === id ? " primary" : "");
      b.textContent = label;
      b.addEventListener("click", () => {
        state2.settings.tactic = id;
        ctx2.sfx?.("tap");
        ctx2.save();
        rerender();
      });
      tacticBox.appendChild(b);
    }
    container.appendChild(tacticBox);
    const actions = document.createElement("div");
    actions.style.cssText = "display:flex;gap:10px;flex-wrap:wrap";
    const oneBtn = document.createElement("button");
    oneBtn.className = "primary";
    oneBtn.textContent = "\u2694\uFE0F \u041E\u0434\u0438\u043D \u0431\u043E\u0439 \u2014 \u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C";
    oneBtn.disabled = picked.allies.length === 0 || picked.foes.length === 0;
    oneBtn.addEventListener("click", () => runOne());
    const seriesBtn = document.createElement("button");
    seriesBtn.textContent = "\u{1F4CA} \u0421\u0435\u0440\u0438\u044F \xD730 \u2014 \u0432\u0438\u043D\u0440\u0435\u0439\u0442";
    seriesBtn.disabled = picked.allies.length === 0 || picked.foes.length === 0;
    seriesBtn.addEventListener("click", () => runSeries());
    actions.append(oneBtn, seriesBtn);
    container.appendChild(actions);
    const seriesOut = document.createElement("div");
    container.appendChild(seriesOut);
    function buildUnits() {
      const sorted = [...picked.allies].map((id) => MERC_BY_ID[id]).sort((a, b) => b.armor + b.hp / 20 - (a.armor + a.hp / 20));
      const allies = sorted.map((def, i) => {
        const slot = i < 3 ? i : i;
        return makeFormationMerc(def, slot, i);
      });
      const foeSlots = enemyFormationSlots(picked.foes);
      const foes = picked.foes.map((id, i) => makeFormationEnemy(id, 1, foeSlots[i], i));
      return { allies, foes };
    }
    function buildUnitDefs() {
      const unitDefs = /* @__PURE__ */ new Map();
      const sorted = [...picked.allies].map((id) => MERC_BY_ID[id]).sort((a, b) => b.armor + b.hp / 20 - (a.armor + a.hp / 20));
      sorted.forEach((d, i) => unitDefs.set(`a${i}`, { name: d.name, icon: d.icon, hp: d.hp }));
      picked.foes.forEach((id, i) => {
        const d = ENEMY_BY_ID[id];
        unitDefs.set(`e${i}`, { name: d.name, icon: d.icon, hp: d.hp });
      });
      return unitDefs;
    }
    function formationOf(allies, foes) {
      return {
        allies: allies.map((a) => ({ uid: a.uid, slot: a.slot, cell: [...a.cell] })),
        foes: foes.map((f) => ({ uid: f.uid, slot: f.slot, cell: [...f.cell] }))
      };
    }
    function runOne() {
      const { allies, foes } = buildUnits();
      const formation = formationOf(allies, foes);
      const seed = Date.now() % 1e5 + 1;
      const result = simulateFormationBattle(allies, foes, seed, state2.settings.tactic || "balance");
      result.formation = formation;
      result.rewards = [];
      playBattleReplay(container, ctx2, {
        title: "\u0422\u0440\u0435\u043D\u0438\u0440\u043E\u0432\u043E\u0447\u043D\u044B\u0439 \u0431\u043E\u0439",
        backTo: "sandbox",
        world: "meadow",
        result,
        unitDefs: buildUnitDefs(),
        overlayButtons: () => [
          { label: "\u{1F501} \u0415\u0449\u0451 \u0440\u0430\u0437", onClick: () => {
            container.innerHTML = "";
            renderSandbox(container, ctx2);
            runOne();
          } },
          { label: "\u{1F4CA} \u0421\u0435\u0440\u0438\u044F \xD730", onClick: () => {
            container.innerHTML = "";
            renderSandbox(container, ctx2);
            runSeries();
          } },
          { label: "\u{1F9EA} \u041A \u043A\u043E\u043D\u0441\u0442\u0440\u0443\u043A\u0442\u043E\u0440\u0443", primary: true, onClick: () => {
            container.innerHTML = "";
            renderSandbox(container, ctx2);
          } }
        ]
      });
    }
    function runSeries() {
      const N = 30;
      let wins = 0;
      let ticksSum = 0;
      for (let seed = 1; seed <= N; seed++) {
        const { allies, foes } = buildUnits();
        const r = simulateFormationBattle(allies, foes, seed * 7 + 1, state2.settings.tactic || "balance");
        if (r.victory) wins++;
        ticksSum += r.ticks;
      }
      ctx2.sfx?.(wins >= N / 2 ? "success" : "fail");
      seriesOut.innerHTML = "";
      const panel = document.createElement("div");
      panel.className = "panel";
      panel.innerHTML = `<h3 style="margin-top:0">\u{1F4CA} \u0421\u0435\u0440\u0438\u044F \u0438\u0437 ${N}: \u043F\u043E\u0431\u0435\u0434 \u043E\u0442\u0440\u044F\u0434\u0430 \u2014 <b>${wins}/${N}</b> (${Math.round(wins / N * 100)}%)</h3>
      <div class="muted">\u0421\u0440\u0435\u0434\u043D\u044F\u044F \u0434\u043B\u0438\u043D\u0430 \u0431\u043E\u044F: ${Math.round(ticksSum / N)} \u0442\u0438\u043A\u043E\u0432 \xB7 \u0442\u0430\u043A\u0442\u0438\u043A\u0430: ${{ defense: "\u{1F6E1} \u0417\u0430\u0449\u0438\u0442\u0430", balance: "\u2696 \u0411\u0430\u043B\u0430\u043D\u0441", offense: "\u2694 \u041D\u0430\u043F\u0430\u0434\u0435\u043D\u0438\u0435" }[state2.settings.tactic || "balance"]}</div>`;
      seriesOut.appendChild(panel);
    }
  }

  // src/ui/brewBookView.js
  function renderBrewBook(container, ctx2) {
    const { state: state2 } = ctx2;
    ctx2.sfx?.("page");
    container.appendChild(header(ctx2, "\u{1F4D6} \u041A\u043D\u0438\u0433\u0430 \u0440\u0435\u0446\u0435\u043F\u0442\u043E\u0432", "\u0417\u0435\u043B\u044C\u044F \u0430\u043B\u0445\u0438\u043C\u0438\u0447\u0435\u0441\u043A\u043E\u0433\u043E \u0441\u0442\u043E\u043B\u0430 \u2014 \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u044F \u0445\u043E\u0437\u044F\u0438\u043D\u0430", "puzzles"));
    const list = document.createElement("div");
    list.className = "list";
    for (const level of BREW_PUZZLES) {
      const done = !!state2.puzzlesDone[level.id];
      const stars = "\u2605".repeat(level.difficulty) + "\u2606".repeat(5 - level.difficulty);
      const entry = document.createElement("div");
      entry.className = "panel brew-book-entry";
      const steps = done ? level.recipe.map((s, i) => `<div class="brew-step done">${i + 1}. ${brewStepText(level, s)}</div>`).join("") : '<div class="muted">\u0415\u0449\u0451 \u043D\u0435 \u0441\u0432\u0430\u0440\u0435\u043D\u043E \u2014 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u0437\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u0441\u044F \u043F\u043E\u0441\u043B\u0435 \u043F\u0435\u0440\u0432\u043E\u0439 \u0432\u0430\u0440\u043A\u0438.</div>';
      entry.innerHTML = `
      <div class="name" style="font-weight:700">${done ? "\u2697\uFE0F" : "\u{1F512}"} ${level.name} <span class="badge">${stars}</span></div>
      <div class="brew-book-steps">${steps}</div>`;
      list.appendChild(entry);
    }
    container.appendChild(list);
    container.appendChild(quickNav(ctx2, [
      { icon: "\u{1F9E9}", label: "\u041A \u0437\u0430\u0433\u0430\u0434\u043A\u0430\u043C", screen: "puzzles", primary: true },
      { icon: "\u{1F3E0}", label: "\u0412 \u043B\u0430\u0432\u043A\u0443", screen: "hub" }
    ]));
  }

  // src/ui/boardView.js
  var BASE_LETTERS = [
    { icon: "\u{1F9FA}", from: "\u041F\u0440\u0430\u0447\u043A\u0430 \u0441 \u0440\u0435\u043A\u0438", text: "\u041A\u0442\u043E-\u0442\u043E \u043D\u0430\u043A\u043E\u043B\u043E\u0442\u0438\u043B \u0434\u0440\u043E\u0432 \u0443 \u043C\u043E\u0435\u0433\u043E \u043F\u043B\u043E\u0442\u0430 \u0438 \u043D\u0435 \u0432\u0437\u044F\u043B \u043F\u043B\u0430\u0442\u0443. \u0415\u0441\u043B\u0438 \u044D\u0442\u043E \u0432\u0430\u0448\u0430 \u043B\u0430\u0432\u043A\u0430 \u2014 \u0441\u043F\u0430\u0441\u0438\u0431\u043E!" },
    { icon: "\u{1F9D9}\u200D\u2640\uFE0F", from: "\u0422\u0440\u0430\u0432\u043D\u0438\u0446\u0430 \u0441 \u0442\u043E\u043F\u0435\u0439", text: "\u042F\u0433\u043E\u0434\u044B \u0441\u043D\u043E\u0432\u0430 \u0441\u0432\u0435\u0442\u044F\u0442\u0441\u044F. \u0417\u043D\u0430\u0447\u0438\u0442, \u043A\u0442\u043E-\u0442\u043E \u0437\u0430\u0431\u043E\u0442\u0438\u0442\u0441\u044F \u043E \u043C\u0438\u0440\u0435. \u0417\u0430\u0445\u043E\u0434\u0438\u0442\u0435 \u0437\u0430 \u043E\u0442\u0432\u0430\u0440\u043E\u043C." },
    { icon: "\u{1F468}\u200D\u{1F33E}", from: "\u0424\u0435\u0440\u043C\u0435\u0440 \u0441 \u044E\u0433\u0430", text: "\u041C\u043E\u044F \u043A\u043E\u0437\u0430 \u0437\u0430\u0431\u043B\u0443\u0434\u0438\u043B\u0430\u0441\u044C \u0438 \u0432\u0435\u0440\u043D\u0443\u043B\u0430\u0441\u044C \u0441\u044B\u0442\u0430\u044F. \u041D\u0430 \u043E\u0448\u0435\u0439\u043D\u0438\u043A\u0435 \u2014 \u043B\u0435\u043D\u0442\u043E\u0447\u043A\u0430 \u0432\u0430\u0448\u0435\u0439 \u043B\u0430\u0432\u043A\u0438." },
    { icon: "\u{1F4DA}", from: "\u0411\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430\u0440\u044C", text: "\u0428\u0451\u043F\u043E\u0442 \u0441\u0442\u0440\u0430\u043D\u0438\u0446 \u0441\u0442\u0430\u043B \u0434\u043E\u0431\u0440\u0435\u0435. \u0414\u0435\u0440\u0436\u0438\u0442\u0435 \u044D\u0442\u043E \u0432 \u0441\u0435\u043A\u0440\u0435\u0442\u0435, \u043D\u043E \u044F \u0441\u043A\u0443\u0447\u0430\u044E \u043F\u043E \u043A\u043B\u044F\u043A\u0441\u0430\u043C." },
    { icon: "\u{1F56F}\uFE0F", from: "\u0424\u043E\u043D\u0430\u0440\u0449\u0438\u043A", text: "\u0424\u043E\u043D\u0430\u0440\u0438 \u043D\u0430 \u043F\u043B\u043E\u0449\u0430\u0434\u0438 \u0433\u043E\u0440\u044F\u0442 \u044F\u0440\u0447\u0435 \u0441 \u0442\u0435\u0445 \u043F\u043E\u0440, \u043A\u0430\u043A \u043B\u0430\u0432\u043A\u0430 \u043E\u0442\u043A\u0440\u044B\u043B\u0430\u0441\u044C. \u0421\u0442\u0440\u0430\u043D\u043D\u043E, \u043F\u0440\u0430\u0432\u0434\u0430?" },
    { icon: "\u{1F40C}", from: "\u041F\u043E\u0447\u0442\u0430\u043B\u044C\u043E\u043D-\u0443\u043B\u0438\u0442\u043A\u0430", text: "\u041C\u0435\u0434\u043B\u0435\u043D\u043D\u043E, \u043D\u043E \u0432\u0435\u0440\u043D\u043E: \u043F\u0438\u0441\u044C\u043C\u043E \u0448\u043B\u043E \u0442\u0440\u0438 \u0434\u043D\u044F. \u0421\u043F\u0430\u0441\u0438\u0431\u043E \u0437\u0430 \u0442\u0435\u0440\u043F\u0435\u043D\u0438\u0435, \u043A\u0430\u043A \u0432\u0441\u0435\u0433\u0434\u0430." }
  ];
  function playerLetters(state2) {
    const out = [];
    if (state2.battlesDone.bt_boss_willow) {
      out.push({ icon: "\u{1F333}", from: "\u041B\u0435\u0441\u043D\u0438\u043A \u0441 \u043E\u043F\u0443\u0448\u043A\u0438", text: "\u0421\u0442\u0430\u0440\u0430\u044F \u0438\u0432\u0430 \u0441\u043D\u043E\u0432\u0430 \u0448\u0443\u043C\u0438\u0442 \u0441\u043F\u043E\u043A\u043E\u0439\u043D\u043E. \u041F\u0435\u0440\u0435\u0434\u0430\u0439\u0442\u0435 \u0440\u044B\u0446\u0430\u0440\u044E \u2014 \u043A\u043E\u0440\u043D\u0438 \u0435\u0433\u043E \u043F\u043E\u043C\u043D\u044F\u0442." });
    }
    if (state2.battlesDone.bt_boss_captain) {
      out.push({ icon: "\u{1F482}", from: "\u0421\u0442\u0440\u0430\u0436\u0430 \u0434\u0432\u043E\u0440\u0438\u043A\u0430", text: "\u041A\u0430\u043F\u0438\u0442\u0430\u043D \u043D\u0430\u043A\u043E\u043D\u0435\u0446 \u043E\u0442\u0434\u044B\u0445\u0430\u0435\u0442. \u0412\u0430\u0448 \u0440\u044B\u0446\u0430\u0440\u044C \u0431\u0443\u0434\u0435\u0442 \u0443\u043F\u043E\u043C\u044F\u043D\u0443\u0442 \u0432 \u0440\u0430\u043F\u043E\u0440\u0442\u0435. \u041A\u0443\u0440\u0441\u0438\u0432\u043E\u043C." });
    }
    if (state2.battlesDone.bk_boss_keeper) {
      out.push({ icon: "\u{1F4D6}", from: "\u0425\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u0447\u0435\u0440\u0434\u0430\u043A\u0430", text: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u0434\u043E\u043F\u0438\u0441\u0430\u043D\u0430. \u0422\u0438\u0448\u0438\u043D\u0430 \u0432 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0435 \u0441\u0442\u0430\u043B\u0430 \u0442\u0451\u043F\u043B\u043E\u0439." });
    }
    if ((state2.crew || []).length >= 3) {
      out.push({ icon: "\u{1F37A}", from: "\u0425\u043E\u0437\u044F\u0438\u043D \u0442\u0430\u0432\u0435\u0440\u043D\u044B", text: "\u0412\u0430\u0448\u0438 \u043B\u044E\u0434\u0438 \u043F\u043B\u0430\u0442\u044F\u0442 \u0447\u0435\u0441\u0442\u043D\u043E \u0438 \u043F\u043E\u044E\u0442 \u0442\u0438\u0445\u043E. \u0422\u0430\u043A\u0438\u0445 \u043E\u0442\u0440\u044F\u0434\u043E\u0432 \u043D\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442." });
    }
    if (Object.keys(state2.puzzlesDone).length >= 20) {
      out.push({ icon: "\u{1F9E9}", from: "\u0421\u043A\u0430\u0437\u0438\u0442\u0435\u043B\u044C \u0441 \u0440\u044B\u043D\u043A\u0430", text: "\u041F\u0440\u043E \u0432\u0430\u0448\u0438 \u0437\u0430\u0433\u0430\u0434\u043A\u0438 \u0443\u0436\u0435 \u0440\u0430\u0441\u0441\u043A\u0430\u0437\u044B\u0432\u0430\u044E\u0442 \u0434\u0435\u0442\u044F\u043C. \u0414\u0432\u0430\u0434\u0446\u0430\u0442\u044C \u0437\u0430\u0433\u0430\u0434\u043E\u043A! \u0425\u043E\u0434\u044F\u0442 \u043B\u0435\u0433\u0435\u043D\u0434\u044B." });
    }
    if ((state2.stats.catPets || 0) >= 10) {
      out.push({ icon: "\u{1F408}", from: "\u041A\u043E\u0442-\u0445\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C", text: "\u041C\u044F\u0443. \u041C\u044F\u0443-\u043C\u044F\u0443. \u041C\u0420\u0420\u0420\u0420. (\u041F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u043E: \u043F\u043E\u0439\u043C\u0430\u043D\u043D\u044B\u0439 \u043C\u043E\u0442\u044B\u043B\u0451\u043A.)" });
    }
    return out;
  }
  function seededLetters(state2) {
    const day = todayKey();
    let h = 2166136261;
    for (const c of day) h = Math.imul(h ^ c.codePointAt(0), 16777619);
    const pool = [...playerLetters(state2), ...BASE_LETTERS];
    const count = Math.min(pool.length, 4);
    const picked = [];
    for (let i = 0; i < count; i++) {
      h = h * 1664525 + 1013904223 >>> 0;
      picked.push(pool.splice(h % pool.length, 1)[0]);
    }
    return picked;
  }
  var CHANGELOG = [
    ["0.9", "\u0416\u0438\u0432\u0430\u044F \u043B\u0430\u0432\u043A\u0430: \u043C\u0443\u0437\u044B\u043A\u0430, \u0434\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u044F, \u0434\u043D\u0435\u0432\u043D\u0438\u043A \u043A\u043E\u0442\u0430, \u0437\u0430\u043A\u0430\u0437 \u0434\u043D\u044F; \u043C\u0435\u0445\u0430\u043D\u0438\u043A\u0438 \u2014 \u043C\u0435\u0445\u0430\u043D\u0438\u0437\u043C\u044B, \u0441\u0432\u0435\u0447\u0438, \u043F\u043E\u0442\u043E\u043A\u0438; 86 \u0437\u0430\u0433\u0430\u0434\u043E\u043A, 200 \u0431\u043E\u0451\u0432, 12 \u043C\u0438\u0440\u043E\u0432."],
    ["0.8", "\u0413\u043E\u0440\u043E\u0434\u0441\u043A\u0430\u044F \u043F\u043B\u043E\u0449\u0430\u0434\u044C, \u0438\u0441\u043A\u0430\u043B\u043A\u0438 \u043F\u043E \u043D\u0430\u0440\u0438\u0441\u043E\u0432\u0430\u043D\u043D\u044B\u043C \u0441\u0446\u0435\u043D\u0430\u043C, \u0440\u0435\u0434\u0430\u043A\u0442\u043E\u0440 \u0445\u043E\u0442\u0441\u043F\u043E\u0442\u043E\u0432, \u0447\u0438\u0442-\u043A\u043E\u0434\u044B, \u043F\u0430\u0443\u0447\u043E\u043A-\u0441\u043A\u0440\u043E\u043B\u043B\u0431\u0430\u0440."],
    ["0.7", "\u0420\u0435\u0436\u0438\u043C \u0431\u043E\u044F \xAB\u0421\u0431\u043E\u0440\xBB \u0441 \u0440\u044F\u0434\u0430\u043C\u0438 \u0438 \u0440\u0430\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u043E\u0439; \u044D\u043A\u0441\u043F\u0435\u0434\u0438\u0446\u0438\u0438 \u043F\u0435\u0440\u0435\u043A\u0440\u0451\u0441\u0442\u043A\u0430."],
    ["0.6", "\u041C\u0438\u0440\u044B \u0438 \u0446\u0435\u043F\u043E\u0447\u043A\u0438 \u0431\u043E\u0451\u0432, \u043E\u0442\u0440\u044F\u0434 \u043D\u0430\u0451\u043C\u043D\u0438\u043A\u043E\u0432, \u043A\u0440\u0430\u0444\u0442, \u043A\u043E\u0441\u043C\u0435\u0442\u0438\u043A\u0430 \u043B\u0430\u0432\u043A\u0438."],
    ["0.5", "\u041A\u043D\u0438\u0436\u043D\u044B\u0439 \u0447\u0435\u0440\u0434\u0430\u043A \u0438 \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u0444\u0440\u0430\u0437; \u0435\u0437\u0434\u043E\u0432\u044B\u0435 \u0438 \u043B\u0435\u0442\u0430\u044E\u0449\u0438\u0435 \u043F\u0438\u0442\u043E\u043C\u0446\u044B."],
    ["0.4", "\u041F\u043E\u0438\u0441\u043A \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u043E\u0432, \u043F\u043E\u043B\u043A\u0438 \u0438 \u0442\u043E\u0432\u0430\u0440\u044B, \u0442\u0430\u0432\u0435\u0440\u043D\u0430, \u0437\u0432\u0443\u043A."],
    ["0.3", "\u0421\u0432\u0435\u0442 \u0438 \u0444\u043E\u043D\u0430\u0440\u0438\u043A\u0438: \u043F\u0435\u0440\u0432\u0430\u044F \u043C\u0435\u0445\u0430\u043D\u0438\u043A\u0430, \u043F\u0435\u0440\u0432\u044B\u0439 \u0440\u044B\u0446\u0430\u0440\u044C, \u043F\u0435\u0440\u0432\u044B\u0439 \u0430\u0432\u0442\u043E\u0431\u043E\u0439."]
  ];
  var PAPER_COLORS = ["#f7ead7", "#f3dfca", "#e8d8f0", "#d8e8d0", "#fde8e0", "#e0ecf5", "#f5f0d8"];
  function renderBoard(container, ctx2) {
    const { state: state2 } = ctx2;
    container.appendChild(header(ctx2, "\u0414\u043E\u0441\u043A\u0430 \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0439", "\u0411\u0443\u043C\u0430\u0436\u043A\u0438 \u043D\u0430 \u0434\u043E\u0441\u043A\u0435 \u0443 \u0444\u043E\u043D\u0442\u0430\u043D\u0430. \u0422\u0430\u043F\u043D\u0438 \u2014 \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u0435\u0448\u044C.", "hub"));
    const board = document.createElement("div");
    board.className = "board-frame";
    let colorIdx = 0;
    const makeZone = (title) => {
      const zone = document.createElement("div");
      zone.className = "board-zone";
      const zt = document.createElement("div");
      zt.className = "board-zone-title";
      zt.textContent = title;
      zone.appendChild(zt);
      board.appendChild(zone);
      return zone;
    };
    const addNote = (zone, opts) => {
      const note = document.createElement("button");
      note.className = "paper-note";
      const rot = colorIdx * 7 % 13 - 6;
      note.style.setProperty("--rot", `${rot}deg`);
      note.style.background = PAPER_COLORS[colorIdx++ % PAPER_COLORS.length];
      note.innerHTML = `<span class="pn-icon">${opts.icon}</span><span class="pn-title">${opts.title}</span>`;
      note.addEventListener("click", (ev) => unfoldNote(ev.currentTarget, opts));
      zone.appendChild(note);
    };
    const lettersZone = makeZone("\u2709\uFE0F \u041F\u0438\u0441\u044C\u043C\u0430 \u0436\u0438\u0442\u0435\u043B\u0435\u0439");
    for (const l of seededLetters(state2)) {
      addNote(lettersZone, {
        icon: l.icon,
        title: `\u041F\u0438\u0441\u044C\u043C\u043E: ${l.from}`,
        kind: "letter",
        heading: `\u2709\uFE0F ${l.from}`,
        body: l.text
      });
    }
    const wantedZone = makeZone("\u{1F3AF} \u0420\u043E\u0437\u044B\u0441\u043A\u043D\u044B\u0435 \u043B\u0438\u0441\u0442\u044B");
    for (const w of WANTED_BATTLES) {
      const available = battleAvailable(state2, w.id);
      const done = !!state2.battlesDone[w.id];
      const icons = w.enemies.map((e) => ENEMY_BY_ID[typeof e === "string" ? e : e.id].icon).join(" ");
      addNote(wantedZone, {
        icon: "\u{1F3AF}",
        title: w.name.replace("\u0420\u043E\u0437\u044B\u0441\u043A: ", "\u0420\u041E\u0417\u042B\u0421\u041A \u2014 "),
        kind: "wanted",
        heading: `\u{1F3AF} ${w.name}`,
        body: `${available ? w.tip : "\u041F\u043E\u0431\u0435\u0434\u0438 \u0431\u043E\u0441\u0441\u0430 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u044E\u0449\u0435\u0433\u043E \u043C\u0438\u0440\u0430, \u0438 \u043B\u0438\u0441\u0442 \u043F\u043E\u044F\u0432\u0438\u0442\u0441\u044F."}<br><br>\u041F\u0440\u043E\u0442\u0438\u0432: ${icons}`,
        action: available ? { label: done ? "\u2694\uFE0F \u0421\u043D\u043E\u0432\u0430 \u043B\u043E\u0432\u0438\u0442\u044C" : "\u2694\uFE0F \u041B\u043E\u0432\u0438\u0442\u044C!", go: () => ctx2.go("battle", { id: w.id }) } : null,
        done
      });
    }
    const logZone = makeZone("\u{1F4DC} \u041B\u0435\u0442\u043E\u043F\u0438\u0441\u044C");
    addNote(logZone, {
      icon: "\u{1F4DC}",
      title: "\u041B\u0435\u0442\u043E\u043F\u0438\u0441\u044C \u043B\u0430\u0432\u043A\u0438",
      kind: "log",
      heading: "\u{1F4DC} \u0418\u0441\u0442\u043E\u0440\u0438\u044F \u043B\u0430\u0432\u043A\u0438",
      body: CHANGELOG.map(([v, t]) => `<b>v${v}</b> \u2014 ${t}`).join("<br><br>")
    });
    container.appendChild(board);
    container.appendChild(quickNav(ctx2, [
      { icon: "\u{1F307}", label: "\u041D\u0430 \u043F\u043B\u043E\u0449\u0430\u0434\u044C", screen: "hub", params: { scene: "square" }, primary: true }
    ]));
    function unfoldNote(noteEl, opts) {
      ctx2.sfx?.("hint");
      const overlay = document.createElement("div");
      overlay.className = "overlay paper-overlay";
      const paper = document.createElement("div");
      paper.className = "paper-full";
      paper.style.background = noteEl.style.background;
      paper.innerHTML = `
      <div class="pf-pin">\u{1F4CC}</div>
      <h3>${opts.heading}</h3>
      <div class="pf-body">${opts.body}</div>
      <div class="pf-actions"></div>`;
      const actions = paper.querySelector(".pf-actions");
      if (opts.action) {
        const btn = document.createElement("button");
        btn.className = "primary";
        btn.textContent = opts.action.label;
        btn.addEventListener("click", () => {
          overlay.remove();
          opts.action.go();
        });
        actions.appendChild(btn);
      }
      const close = document.createElement("button");
      close.textContent = "\u041F\u0440\u0438\u0431\u0438\u0442\u044C \u043E\u0431\u0440\u0430\u0442\u043D\u043E \u{1F4CC}";
      close.addEventListener("click", () => overlay.remove());
      actions.appendChild(close);
      overlay.appendChild(paper);
      overlay.addEventListener("click", (ev) => {
        if (ev.target === overlay) overlay.remove();
      });
      document.body.appendChild(overlay);
    }
  }

  // src/ui/app.js
  var screenEl = document.getElementById("screen");
  var toastEl = document.getElementById("toast");
  var state = loadGame() || newGame();
  function save() {
    saveGame(state);
    updateWallet();
    const fresh = checkAchievements(state, {
      puzzlesTotal: ALL_PUZZLES.length,
      battlesTotal: BATTLES.length,
      seekIds: SEEK_PUZZLES.map((p) => p.id)
    });
    for (const a of fresh) {
      setTimeout(() => {
        toast(`\u{1F3C6} \u0414\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u0435: ${a.name}!`);
        sfx("success");
      }, 600);
      saveGame(state);
    }
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
  var lastHubScene = "lavka";
  var routes = {
    hub: (c, p) => renderHub(c, ctx, { scene: p.scene || lastHubScene }),
    puzzles: (c, p) => renderPuzzleList(c, ctx, p),
    puzzle: (c, p) => renderPuzzle(c, ctx, p),
    equip: (c, p) => renderEquip(c, ctx, p),
    shop: (c, p) => renderShop(c, ctx, p),
    battles: (c, p) => renderBattleList(c, ctx, p),
    battle: (c, p) => renderFormation(c, ctx, p),
    tavern: (c, p) => renderTavern(c, ctx, p),
    workshop: (c, p) => renderWorkshop(c, ctx, p),
    editor: (c, p) => renderEditor(c, ctx, p),
    craft: (c, p) => renderCraft(c, ctx, p),
    settings: (c, p) => renderSettings(c, ctx, p),
    seekeditor: (c, p) => p.id ? renderSeekEditor(c, ctx, p) : renderSeekEditorList(c, ctx, p),
    achievements: (c, p) => renderAchievements(c, ctx, p),
    brewbook: (c, p) => renderBrewBook(c, ctx, p),
    sandbox: (c, p) => renderSandbox(c, ctx, p),
    board: (c, p) => renderBoard(c, ctx, p),
    shopArmory: (c) => renderMarket(c, ctx, "armory"),
    shopArmorer: (c) => renderMarket(c, ctx, "armorer"),
    shopMagic: (c) => renderMarket(c, ctx, "magic"),
    shopAlchemy: (c) => renderMarket(c, ctx, "alchemy")
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
    sfx,
    setHubScene(scene) {
      lastHubScene = scene;
    }
  };
  initSound();
  var musicUnlock = () => {
    startMusic();
    document.removeEventListener?.("pointerdown", musicUnlock);
    document.removeEventListener?.("keydown", musicUnlock);
  };
  document.addEventListener?.("pointerdown", musicUnlock);
  document.addEventListener?.("keydown", musicUnlock);
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
    const hat = !!state.cheats?.spiderHat;
    if (spiderBug.dataset.hat !== String(hat)) {
      spiderBug.dataset.hat = String(hat);
      spiderBug.textContent = hat ? "\u{1F3A9}\u{1F577}\uFE0F" : "\u{1F577}\uFE0F";
    }
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
  document.getElementById("settings-btn")?.addEventListener("click", () => {
    sfx("tap");
    go("settings");
  });
  document.getElementById("achievements-btn")?.addEventListener("click", () => {
    sfx("tap");
    go("achievements");
  });
  var brandEl = document.querySelector(".brand");
  var brandTaps = 0;
  var brandTimer = null;
  brandEl.style.cursor = "pointer";
  brandEl.addEventListener("click", () => {
    brandTaps += 1;
    sfx("tap");
    clearTimeout(brandTimer);
    brandTimer = setTimeout(() => {
      brandTaps = 0;
    }, 900);
    if (brandTaps >= 3) {
      brandTaps = 0;
      showAbout();
    }
  });
  function showAbout() {
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.innerHTML = `
    <div class="card" style="text-align:left">
      <h2 style="text-align:center">\u{1F3EE} \u041B\u0430\u0432\u043A\u0430 \u043D\u0430 \u043F\u0435\u0440\u0435\u043A\u0440\u0451\u0441\u0442\u043A\u0435 \u043C\u0438\u0440\u043E\u0432</h2>
      <div class="muted center" style="margin-bottom:10px">\u0432\u0435\u0440\u0441\u0438\u044F 0.9 \xB7 \u0443\u044E\u0442\u043D\u0430\u044F \u0438\u0433\u0440\u0430-\u043C\u0430\u0433\u0430\u0437\u0438\u043D \u0441 \u043F\u0440\u0438\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F\u043C\u0438</div>
      <p><b>\u0410\u0432\u0442\u043E\u0440:</b> K8rvin (\u0410\u043D\u0434\u0440\u0435\u0439)</p>
      <p><b>\u0421\u0434\u0435\u043B\u0430\u043D\u043E:</b> \u0432\u0434\u0432\u043E\u0451\u043C \u2014 \u0447\u0435\u043B\u043E\u0432\u0435\u043A \u0438 \u0418\u0418-\u0430\u0433\u0435\u043D\u0442 Kimi Code.
      \u0427\u0438\u0441\u0442\u044B\u0439 JavaScript, Canvas, SVG-\u0430\u0440\u0442, \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F. \u041D\u0438 \u0441\u0442\u0440\u043E\u0447\u043A\u0438 \u0431\u044D\u043A\u0435\u043D\u0434\u0430.</p>
      <p><b>\u0412\u043D\u0443\u0442\u0440\u0438:</b> 6 \u043C\u0435\u0445\u0430\u043D\u0438\u043A \u0433\u043E\u043B\u043E\u0432\u043E\u043B\u043E\u043C\u043E\u043A \xB7 58 \u0437\u0430\u0433\u0430\u0434\u043E\u043A \xB7 200 \u0431\u043E\u0451\u0432 \u0432 12 \u043C\u0438\u0440\u0430\u0445 \xB7
      60+ \u0441\u0443\u0449\u0435\u0441\u0442\u0432 \xB7 \u043A\u0440\u0430\u0444\u0442 \xB7 \u043E\u0442\u0440\u044F\u0434 \xB7 \u0434\u0432\u0430 \u0440\u0435\u0436\u0438\u043C\u0430 \u0430\u0432\u0442\u043E\u0431\u043E\u044F \xB7 \u0438 \u043E\u0434\u0438\u043D \u043E\u0447\u0435\u043D\u044C \u0442\u0440\u0443\u0434\u043E\u043B\u044E\u0431\u0438\u0432\u044B\u0439 \u043F\u0430\u0443\u0447\u043E\u043A \u{1F577}\uFE0F</p>
      <p class="muted">\u0421\u043F\u0430\u0441\u0438\u0431\u043E, \u0447\u0442\u043E \u0437\u0430\u0433\u043B\u044F\u043D\u0443\u043B \u043D\u0430 \u043F\u0435\u0440\u0435\u043A\u0440\u0451\u0441\u0442\u043E\u043A. \u0421\u0442\u0443\u0447\u0438 \u043F\u043E \u0432\u044B\u0432\u0435\u0441\u043A\u0435 \u0432 \u043B\u044E\u0431\u043E\u0435 \u0432\u0440\u0435\u043C\u044F.</p>
      <div class="actions" style="text-align:center"></div>
    </div>`;
    const actions = overlay.querySelector(".actions");
    const close = document.createElement("button");
    close.className = "primary";
    close.textContent = "\u0412\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F \u0432 \u043B\u0430\u0432\u043A\u0443";
    close.addEventListener("click", () => overlay.remove());
    actions.appendChild(close);
    overlay.addEventListener("click", (ev) => {
      if (ev.target === overlay) overlay.remove();
    });
    document.body.appendChild(overlay);
  }
  updateWallet();
  go("hub");
})();
