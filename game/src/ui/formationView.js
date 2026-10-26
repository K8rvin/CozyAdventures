// Режим «сбор»: расстановка отряда на поле боя + анимированный бой.
import { BATTLE_BY_ID, OBSTACLE_KINDS } from '../data/battles.js';
import { ENEMY_BY_ID } from '../data/enemies.js';
import { ITEM_BY_ID } from '../data/items.js';
import { MERC_BY_ID } from '../data/crew.js';
import { runBattle, moveFormationSlot, nextBattle, battleAvailable } from '../core/state.js';
import { knightArtId } from '../core/items.js';
import { enemyFormationSlots, slotToCell } from '../core/formBattle.js';
import { header, showOverlay, rewardText } from './common.js';
import { onboardingCtaForResult, onboardingFixedBattleSeed } from '../core/onboarding.js';
import { battleEnergyTerms, battleEnergyCost } from '../core/energy.js';
import { bossDropStatus } from '../core/bossDrops.js';
import { BATTLE_ENERGY_CAP } from '../data/energy.js';
import { battleLoreOutroRoute } from '../core/battleLore.js';
import { setAchievementPresentationBusy } from './achievementCelebration.js';

const FRONT = [0, 1, 2];

function formatEnergyWait(ms) {
  const totalMinutes = Math.max(1, Math.ceil(ms / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours} ч ${minutes} мин` : `${minutes} мин`;
}

function formatRewardWins(count) {
  const lastTwo = count % 100;
  const last = count % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return 'наградных побед';
  if (last === 1) return 'наградная победа';
  if (last >= 2 && last <= 4) return 'наградные победы';
  return 'наградных побед';
}

// Спрайт бойца: арт assets/battle/units/<art>_<pose>_web.png поверх эмодзи.
// Нет файла позы — откат на стойку (idle) того же набора; нет и её — следующий
// набор из fallbackArt (например, наборы оружия рыцаря → базовый 'knight');
// совсем нет — молча остаётся эмодзи. mini=true — маленький размер для слотов.
export function unitSpriteEl(art, icon, mini = false, fallbackArt = null) {
  const span = document.createElement('span');
  span.className = 'uf-icon unit-art' + (mini ? ' mini' : '');
  span.textContent = icon;
  if (!art) return span;
  const arts = [...new Set([art, fallbackArt].filter(Boolean))];
  let artIdx = 0;
  const img = document.createElement('img');
  img.className = 'unit-sprite';
  img.alt = '';
  img.draggable = false;
  let gone = false;
  const setPose = (pose) => {
    if (gone) return;
    img.dataset.wantPose = pose;
    img.style.opacity = '0.4';
    img.src = `assets/battle/units/${arts[artIdx]}_${pose}_web.png`;
  };
  img.addEventListener('error', () => {
    if (img.dataset.wantPose && img.dataset.wantPose !== 'idle') setPose('idle');
    else if (artIdx + 1 < arts.length) { artIdx += 1; setPose('idle'); }
    else { gone = true; img.remove(); span.classList.remove('has-art'); }
  });
  img.addEventListener('load', () => { span.classList.add('has-art'); img.style.opacity = '1'; });
  span.setPose = setPose;
  span.appendChild(img);
  setPose('idle');
  // Спрайт уже в кэше — показываем сразу, без кадра с эмодзи
  if (img.complete && img.naturalWidth > 0) { span.classList.add('has-art'); img.style.opacity = '1'; }
  return span;
}

// Смена позы на фигурке боя (нет спрайта — тихо ничего не делает)
function setFigPose(figEl, pose) {
  const s = figEl?.querySelector('.uf-icon');
  s?.setPose?.(pose);
}

// Клетка поля [col, row] → позиция в процентах (8 колонок × 3 ряда)
function cellPos(c, r) {
  return [5 + c * 12.5, 18 + r * 32];
}

// Центр тела юнита в процентах: босс 2×2 — середина блока, якорь — левая верхняя клетка
function bodyCenter(cell, size = 1) {
  const [x, y] = cellPos(cell[0], cell[1]);
  return [x + (size - 1) * 6.25, y + (size - 1) * 16];
}

// Слот расстановки (0–5) → позиция на экране расстановки
function slotPos(slot, side) {
  return cellPos(...slotToCell(slot, side));
}

// Снаряд вылетает из верхней половины спрайта, а не из подписи/ног:
// подъём стартовой точки — доля от высоты поля (36px при 320px; босс 2×2 — 72px)
const PROJECTILE_LIFT_RATIO = 36 / 320;
const PROJECTILE_LIFT_RATIO_BIG = 72 / 320;

// Фон поля боя по миру битвы (фолбэк — без фона)
function addFieldBg(fieldEl, world) {
  const bg = document.createElement('img');
  bg.className = 'form-field-bg';
  bg.alt = '';
  const cands = [`assets/battle/battle_bg_${world}_web.jpg`];
  let i = 0;
  bg.addEventListener('error', () => {
    i += 1;
    if (i < cands.length) bg.src = cands[i];
    else bg.remove();
  });
  bg.src = cands[0];
  fieldEl.prepend(bg);
}

// Препятствия боя — непролазные клетки на нейтральной полосе
function addObstacles(fieldEl, obstacles) {
  for (const o of obstacles || []) {
    const kind = OBSTACLE_KINDS[o.kind] || OBSTACLE_KINDS.rock;
    const el = document.createElement('div');
    el.className = 'form-obstacle';
    const [x, y] = cellPos(o.cell[0], o.cell[1]);
    el.style.left = `${x}%`;
    el.style.top = `${y}%`;
    el.textContent = kind.icon;
    el.title = `${kind.name} — непролазная клетка, стрелки бьют поверх`;
    fieldEl.appendChild(el);
  }
}

export function renderFormation(container, ctx, params) {
  let currentCleanup = null;
  let disposed = false;
  const rerender = () => {
    currentCleanup?.();
    if (disposed) return;
    container.innerHTML = '';
    currentCleanup = renderFormationScreen(container, ctx, params, rerender) || null;
  };
  rerender();
  return () => {
    disposed = true;
    currentCleanup?.();
    currentCleanup = null;
  };
}

function renderFormationScreen(container, ctx, params, rerender) {
  const battle = BATTLE_BY_ID[params.id];
  if (!battle || !battleAvailable(ctx.state, battle.id)) { ctx.go('battles'); return; }
  const { state } = ctx;
  const energy = battleEnergyTerms(state, battle);
  const dropPreview = bossDropStatus(state, battle);

  container.appendChild(header(ctx, battle.name, battle.tip, 'battles'));

  // --- Экран расстановки ---
  // Поле — прямой ребёнок контейнера сразу после шапки, как на экране боя:
  // верхняя кромка поля на одной высоте, переход расстановка → бой без скачка
  const field = document.createElement('div');
  field.className = 'form-field';
  addFieldBg(field, battle.world);
  addObstacles(field, battle.obstacles);
  container.appendChild(field);

  // Панель под полем — один компактный тулбар: тактика, пояс, кнопка «В бой!»
  const prepPanel = document.createElement('div');
  prepPanel.className = 'panel form-toolbar';

  const units = [
    // Арт рыцаря — по типу экипированного оружия (фолбэк — базовый меч+щит)
    { key: 'knight', icon: '🛡️', name: 'Рыцарь', art: knightArtId(state.equipped) },
    ...state.squadMercs.map((id, i) => ({
      key: `merc${i}`, icon: MERC_BY_ID[id].icon, name: MERC_BY_ID[id].name, art: id,
    })),
  ];
  let selectedUnit = null;

  // Слоты союзника (слева) и превью врагов (справа)
  const enemyEntries = battle.enemies.map((e) => (typeof e === 'string' ? { id: e, scale: 1 } : e));
  const enemySlots = enemyFormationSlots(battle.enemies);

  function slotEl(slot, side) {
    const [x, y] = slotPos(slot, side);
    const el = document.createElement('div');
    el.className = 'form-slot' + (FRONT.includes(slot) ? ' front' : ' back');
    el.style.left = `${x}%`;
    el.style.top = `${y}%`;
    el.dataset.slot = slot;
    el.dataset.side = side;
    return el;
  }

  const slotEls = {};
  for (let s = 0; s < 6; s++) {
    const el = slotEl(s, 'ally');
    field.appendChild(el);
    slotEls[`ally${s}`] = el;
    el.addEventListener('click', () => {
      if (!selectedUnit) return;
      moveFormationSlot(state, selectedUnit, s);
      selectedUnit = null;
      ctx.save();
      ctx.sfx?.('rotate');
      rerender();
    });
  }
  enemySlots.forEach((slot, i) => {
    const def = ENEMY_BY_ID[enemyEntries[i].id];
    const el = slotEl(slot, 'enemy');
    if (def.boss) {
      // Босс 2×2: крупный маркер по центру блока, спрайт побольше
      el.classList.add('boss');
      const [bx, by] = bodyCenter(slotToCell(slot, 'enemy'), 2);
      el.style.left = `${bx}%`;
      el.style.top = `${by}%`;
      el.appendChild(unitSpriteEl(enemyEntries[i].id, def.icon));
    } else {
      el.appendChild(unitSpriteEl(enemyEntries[i].id, def.icon, true));
    }
    el.classList.add('occupied', 'enemy');
    field.appendChild(el);
  });

  // --- Перетаскивание бойцов (тап-выбор сохраняется) ---
  let unitDrag = null; // { key, startX, startY, active, ghost, hoverSlot }
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
      const ghost = document.createElement('div');
      ghost.className = 'drag-ghost';
      ghost.appendChild(unitSpriteEl(u.art, u.icon, false, u.key === 'knight' ? 'knight' : null));
      document.body.appendChild(ghost);
      unitDrag.ghost = ghost;
      unitDrag.active = true;
      selectedUnit = null;
      ctx.sfx?.('tap');
    }
    unitDrag.ghost.style.transform = `translate(${ev.clientX}px, ${ev.clientY}px)`;
    const slot = findSlotAt(ev.clientX, ev.clientY);
    if (slot !== unitDrag.hoverSlot) {
      hoverSlotEl?.classList.remove('selected');
      hoverSlotEl = slot !== null ? slotEls[`ally${slot}`] : null;
      hoverSlotEl?.classList.add('selected');
      unitDrag.hoverSlot = slot;
    }
  }

  function onDragEnd() {
    if (!unitDrag) return;
    const { key, active, hoverSlot, ghost } = unitDrag;
    ghost?.remove();
    hoverSlotEl?.classList.remove('selected');
    unitDrag = null;
    if (!active || hoverSlot === null || hoverSlot === undefined) return;
    moveFormationSlot(state, key, hoverSlot);
    ctx.sfx?.('rotate');
    ctx.save();
    rerender();
  }

  let dragActive = true;
  function cleanupDrag() {
    if (!dragActive) return;
    dragActive = false;
    window.removeEventListener('pointermove', onDragMove);
    window.removeEventListener('pointerup', onDragEnd);
    unitDrag?.ghost?.remove();
    unitDrag = null;
    hoverSlotEl?.classList.remove('selected');
    hoverSlotEl = null;
  }

  window.addEventListener('pointermove', onDragMove);
  window.addEventListener('pointerup', onDragEnd);

  // Юниты на слотах (тап выбирает, перетаскивание двигает)
  for (const u of units) {
    const slot = state.formation[u.key];
    const host = slotEls[`ally${slot}`];
    if (!host) continue;
    host.classList.add('occupied');
    host.innerHTML = '';
    host.appendChild(unitSpriteEl(u.art, u.icon, true, u.key === 'knight' ? 'knight' : null));
    host.style.touchAction = 'none';
    host.addEventListener('pointerdown', (ev) => {
      unitDrag = { key: u.key, startX: ev.clientX, startY: ev.clientY, active: false, ghost: null, hoverSlot: null };
      ev.preventDefault();
    });
    host.addEventListener('click', (ev) => {
      ev.stopPropagation?.();
      selectedUnit = selectedUnit === u.key ? null : u.key;
      field.querySelectorAll('.form-slot').forEach((s) => s.classList.remove('selected'));
      if (selectedUnit) host.classList.add('selected');
      ctx.sfx?.('tap');
    });
  }

  // --- Тактика команды (сегмент-группа), чип пояса, кнопка «В бой!» ---
  const tacticTitle = document.createElement('span');
  tacticTitle.className = 'muted';
  tacticTitle.textContent = 'Тактика:';
  prepPanel.appendChild(tacticTitle);
  const seg = document.createElement('div');
  seg.className = 'form-seg';
  const TACTICS = [
    ['defense', '🛡 Защита', 'Держим строй: броня ×1.25 и уклонение +12%, атака ×0.85'],
    ['balance', '⚖ Баланс', 'Обычный бой без модификаторов'],
    ['offense', '⚔ Нападение', 'Все вперёд: атака ×1.2 и скорость ×1.1, броня ×0.85, уклонение −8%'],
  ];
  for (const [id, label, tip] of TACTICS) {
    const b = document.createElement('button');
    b.className = 'small' + ((state.settings.tactic || 'balance') === id ? ' primary' : '');
    b.textContent = label;
    b.title = tip;
    b.addEventListener('click', () => {
      state.settings.tactic = id;
      ctx.sfx?.('tap');
      ctx.save();
      rerender();
    });
    seg.appendChild(b);
  }
  prepPanel.appendChild(seg);

  const beltLabel = document.createElement('label');
  beltLabel.className = 'belt-chip clickable';
  const beltCheck = document.createElement('input');
  beltCheck.type = 'checkbox';
  beltCheck.checked = state.settings.useBeltItems !== false;
  beltCheck.addEventListener('change', () => {
    state.settings.useBeltItems = beltCheck.checked;
    ctx.sfx?.('tap');
    ctx.save();
  });
  beltLabel.append(beltCheck, (() => { const s = document.createElement('span'); s.textContent = 'Предметы с пояса'; return s; })());
  prepPanel.appendChild(beltLabel);

  const spacer = document.createElement('span');
  spacer.className = 'form-toolbar-spacer';
  prepPanel.appendChild(spacer);

  const rewardBlocked = energy.repeat && !energy.enough;
  const goBtn = document.createElement('button');
  goBtn.className = 'small primary form-go';
  goBtn.textContent = rewardBlocked ? `Нужно ${energy.cost} ⚡` : '⚔️ В бой!';
  goBtn.dataset.battleStart = battle.id;
  goBtn.disabled = rewardBlocked;
  goBtn.title = rewardBlocked
    ? 'Для наградного повтора не хватает энергии. Тренировка доступна всегда.'
    : energy.first ? 'Первая победа бесплатна, даже при нулевой энергии.' : `Наградная победа: −${energy.cost} энергии.`;
  goBtn.addEventListener('click', () => startBattle(false));
  prepPanel.appendChild(goBtn);

  const practiceBtn = document.createElement('button');
  practiceBtn.className = 'small form-practice' + (rewardBlocked ? ' primary' : ' ghost');
  practiceBtn.textContent = rewardBlocked ? '🛡️ Тренировка без наград' : '🛡️ Тренировка';
  practiceBtn.dataset.battlePractice = battle.id;
  practiceBtn.title = 'Тот же бой: без наград и прогресса, без траты энергии и предметов пояса.';
  practiceBtn.addEventListener('click', () => startBattle(true));
  prepPanel.appendChild(practiceBtn);
  container.appendChild(prepPanel);

  const energyPanel = document.createElement('div');
  energyPanel.className = 'panel battle-energy' + (rewardBlocked ? ' is-low' : '');
  energyPanel.dataset.energyValue = String(energy.value);
  const energyMain = document.createElement('div');
  energyMain.className = 'battle-energy-main';
  energyMain.textContent = `⚡ Энергия походов: ${energy.value}/${energy.cap}`;
  const energyRules = document.createElement('div');
  energyRules.className = 'muted';
  energyRules.textContent = energy.first
    ? `Первая победа — бесплатно · следующие — ${battleEnergyCost(battle, true)} ⚡ · поражение — бесплатно.`
    : `Победа с наградой — ${energy.cost} ⚡ · поражение и тренировка — бесплатно.`;
  const energyTimer = document.createElement('div');
  energyTimer.className = 'muted battle-energy-timer';
  energyTimer.textContent = energy.value >= energy.cap
    ? 'Запас полный · восстановление: +1 за 2 часа.'
    : `До следующей единицы: ${formatEnergyWait(energy.nextInMs)} · восстановление: +1 за 2 часа.`;
  energyPanel.append(energyMain, energyRules, energyTimer);
  container.appendChild(energyPanel);

  if (dropPreview) {
    const dropItem = ITEM_BY_ID[dropPreview.itemId];
    const dropPanel = document.createElement('div');
    dropPanel.className = 'panel boss-drop-preview';
    const dropName = document.createElement('div');
    dropName.className = 'boss-drop-name';
    dropName.textContent = `🎁 Возможная находка: «${dropItem.name}»`;
    const dropChance = document.createElement('div');
    dropChance.className = 'muted';
    dropChance.textContent = dropPreview.collected
      ? 'Уже в коллекции — дубликат больше не выпадет.'
      : dropPreview.guaranteed
        ? 'Следующая наградная победа гарантирует находку.'
        : `Следующий шанс: ${Math.round(dropPreview.chance * 100)}% · гарантия не позднее чем через ${dropPreview.remaining} ${formatRewardWins(dropPreview.remaining)}.`;
    dropPanel.append(dropName, dropChance);
    container.appendChild(dropPanel);
  }

  // --- Бой ---
  let replayCleanup = null;
  function startBattle(practice = false) {
    const seed = onboardingFixedBattleSeed(state, battle.id) ?? ((Date.now() % 100000) + 1);
    const result = runBattle(state, battle.id, seed, { practice });
    if (result?.blocked) {
      ctx.toast?.(result.error);
      rerender();
      return;
    }
    if (!result) return;
    cleanupDrag();
    if (!result.practice) ctx.save();
    playBattle(result);
  }

  function playBattle(result) {
    // Имена/иконки фигурок из состояния и состава битвы
    const unitDefs = new Map();
    unitDefs.set('a0', { name: 'Рыцарь лавки', icon: '🛡️', hp: result.report.knightHpMax, art: knightArtId(state.equipped), fallbackArt: 'knight' });
    state.squadMercs.forEach((id, i) => {
      const d = MERC_BY_ID[id];
      unitDefs.set(`a${i + 1}`, { name: d.name, icon: d.icon, hp: d.hp, art: id });
    });
    enemyEntries.forEach((e, i) => {
      const d = ENEMY_BY_ID[e.id];
      unitDefs.set(`e${i}`, { name: d.name, icon: d.icon, hp: Math.round(d.hp * (e.scale || 1)), art: e.id });
    });
    replayCleanup = playBattleReplay(container, ctx, {
      title: battle.name, subtitle: battle.tip, backTo: 'battles', world: battle.world, result, unitDefs,
      onboardingResult: result.practice ? null : { kind: 'battle', id: battle.id },
      overlayButtons: (rep) => {
        const tutorialCta = result.practice ? null : onboardingCtaForResult(state, { kind: 'battle', id: battle.id });
        const outro = rep.victory && !result.practice && !tutorialCta
          ? battleLoreOutroRoute(state, battle.id) : null;
        const nextB = rep.victory && !result.practice && !tutorialCta && !outro ? nextBattle(battle.id) : null;
        return [
          ...(outro ? [{ label: '📖 Эпилог мира', primary: true, onClick: () => ctx.go('battleLore', outro) }] : []),
          ...(nextB ? [{ label: `Следующая битва → ${nextB.name}`, primary: true, onClick: () => ctx.go('battle', { id: nextB.id }) }] : []),
          { label: '🎒 К экипировке', onClick: () => ctx.go('equip') },
          ...(rep.victory ? [] : [
            { label: '🍺 В таверну — усилить отряд', onClick: () => ctx.go('tavern') },
            { label: '🏬 В торговый квартал — снаряжение', onClick: () => ctx.go('hub', { scene: 'market' }) },
          ]),
          { label: '🔁 Ещё раз', onClick: () => ctx.go('battle', { id: battle.id }) },
          { label: 'К походам', primary: !nextB && !tutorialCta && !outro, onClick: () => ctx.go('battles') },
        ];
      },
    });
  }

  return () => {
    cleanupDrag();
    replayCleanup?.();
    replayCleanup = null;
  };
}

export function playBattleReplay(container, ctx, { title, subtitle, backTo = 'battles', world, result, unitDefs, overlayButtons, onboardingResult = null }) {
  setAchievementPresentationBusy('battle-replay', true);
  container.innerHTML = '';
  // Шапка повторяет экран расстановки (заголовок/подзаголовок боя) — поле не прыгает
  container.appendChild(header(ctx, title, subtitle ?? 'Бой идёт сам — смотри и учись', backTo));

    const field2 = document.createElement('div');
    field2.className = 'form-field battle';
    addFieldBg(field2, world);
    addObstacles(field2, result.formation?.obstacles);
    container.appendChild(field2);

    const controls = document.createElement('div');
    controls.className = 'panel';
    controls.style.cssText = 'display:flex;gap:8px;align-items:center;margin-top:10px';
    // Скорость боя запоминается (как тактика): 0.5x — полюбоваться анимацией
    let speed = ctx.state?.settings?.battleSpeed || 500;
    controls.append(document.createTextNode('Скорость: '));
    for (const [label, ms] of [['0.5x', 1000], ['1x', 500], ['2x', 250], ['4x', 120]]) {
      const b = document.createElement('button');
      b.className = 'small' + (speed === ms ? ' primary' : '');
      b.textContent = label;
      b.addEventListener('click', () => {
        speed = ms;
        if (ctx.state?.settings) {
          ctx.state.settings.battleSpeed = ms;
          ctx.save?.();
        }
        controls.querySelectorAll('button.small').forEach((x) => x.classList.remove('primary'));
        b.classList.add('primary');
      });
      controls.appendChild(b);
    }
    const skip = document.createElement('button');
    skip.className = 'small ghost';
    skip.textContent = '⏭️ К итогу';
    skip.addEventListener('click', () => finishNow());
    controls.appendChild(skip);
    container.appendChild(controls);

    const logBox = document.createElement('div');
    logBox.className = 'battle-log';
    container.appendChild(logBox);

    // Фигурки по uid
    const figures = new Map(); // uid -> {el, unit, side, x, y, size}
    const unitsByUid = new Map();
    const allyInfo = new Map(result.formation.allies.map((a) => [a.uid, a]));
    const foeInfo = new Map(result.formation.foes.map((f) => [f.uid, f]));

    for (const [uid, def] of unitDefs) {
      const isAlly = uid.startsWith('a');
      const info = isAlly ? allyInfo.get(uid) : foeInfo.get(uid);
      if (!info) continue;
      const size = info.size || 1;
      const [x, y] = bodyCenter(info.cell, size);
      const el = document.createElement('div');
      el.className = 'unit-figure ' + (isAlly ? 'ally' : 'enemy') + (size > 1 ? ' big' : '');
      el.style.left = `${x}%`;
      el.style.top = `${y}%`;
      el.appendChild(unitSpriteEl(def.art, def.icon, false, def.fallbackArt || null));
      const nameEl = document.createElement('div');
      nameEl.className = 'uf-name';
      nameEl.textContent = def.name;
      el.appendChild(nameEl);
      const badgesEl = document.createElement('div');
      badgesEl.className = 'uf-badges';
      el.appendChild(badgesEl);
      const hpbar = document.createElement('div');
      hpbar.className = 'hpbar';
      const hpfill = document.createElement('div');
      hpfill.style.width = '100%';
      hpbar.appendChild(hpfill);
      el.appendChild(hpbar);
      field2.appendChild(el);
      const unit = { hp: def.hp, maxHp: def.hp, badges: new Set() };
      figures.set(uid, { el, unit, side: isAlly ? 'ally' : 'enemy', x, y, size });
      unitsByUid.set(uid, unit);
    }

    let timer = null;
    let i = 0;
    let done = false;
    let cancelled = false;
    let resultOverlay = null;
    const timers = new Set();
    const frames = new Set();

    function later(fn, ms) {
      if (cancelled) return null;
      const id = setTimeout(() => {
        timers.delete(id);
        if (!cancelled) fn();
      }, ms);
      timers.add(id);
      return id;
    }

    function cancelLater(id) {
      if (id === null || id === undefined) return;
      clearTimeout(id);
      timers.delete(id);
    }

    function frame(fn) {
      const request = window.requestAnimationFrame?.bind(window);
      if (!request) return later(fn, 16);
      const id = request(() => {
        frames.delete(id);
        if (!cancelled) fn();
      });
      frames.add(id);
      return id;
    }

    function cleanup() {
      if (cancelled) return;
      cancelled = true;
      done = true;
      for (const id of timers) clearTimeout(id);
      timers.clear();
      for (const id of frames) window.cancelAnimationFrame?.(id);
      frames.clear();
      resultOverlay?.remove();
      resultOverlay = null;
      setAchievementPresentationBusy('battle-replay', false);
    }

    function figOf(uid) {
      return figures.get(uid) || null;
    }

    function setHp(uid) {
      const f = figOf(uid);
      if (!f) return;
      const bar = f.el.querySelector('.hpbar > div');
      bar.style.width = `${Math.max(0, (f.unit.hp / f.unit.maxHp) * 100)}%`;
      f.el.classList.toggle('dead', f.unit.hp <= 0);
    }

    // Значки состояний на фигурке (яд, сон и т.п.)
    const STATUS_ICON = {
      poison: '☠️', sleep: '😴', slow: '🐌', fear: '😨', regen: '💚', shield: '🛡️',
    };
    function renderBadges(fig) {
      const box = fig.el.querySelector('.uf-badges');
      if (!box) return;
      box.textContent = [...fig.unit.badges].map((k) => STATUS_ICON[k] || '❔').join('');
    }

    function logLine(cls, text) {
      const line = document.createElement('div');
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
      later(() => el.classList.remove(cls), ms);
    }

    // Всплывающий боевой текст над головой фигурки («Уворот!», «яд — мимо»):
    // поднимается и растворяется (CSS float-rise), сам удаляется
    function floatText(fig, text, cls) {
      if (!fig) return;
      const el = document.createElement('div');
      el.className = 'float-text ' + cls;
      el.textContent = text;
      const lift = (field2.offsetHeight || 320) * (34 / 320);
      el.style.left = `${fig.x}%`;
      el.style.top = `calc(${fig.y}% - ${lift}px)`;
      field2.appendChild(el);
      later(() => el.remove(), 900);
    }

    function animateHit(e) {
      const atk = figOf(e.fromUid);
      const def = figOf(e.toUid);
      if (!atk || !def) return;
      setFigPose(atk.el, 'atk');
      later(() => { if (atk.unit.hp > 0) setFigPose(atk.el, 'idle'); }, 420);
      if (e.ranged || e.magic) {
        // Снаряд летит от атакующего к цели: магический болт, стихия или стрела
        const proj = document.createElement('div');
        proj.className = 'projectile' + (e.magic ? ' magic' : '');
        proj.textContent = e.magic
          ? (e.elem === 'fire' ? '🔥' : e.elem === 'storm' ? '⚡' : '✨')
          : (e.elem === 'fire' ? '🔥' : e.elem === 'storm' ? '⚡' : '➹');
        // Старт — из верхней половины спрайта (центр фигурки — это ноги/подпись)
        const liftRatio = (atk.size || 1) > 1 ? PROJECTILE_LIFT_RATIO_BIG : PROJECTILE_LIFT_RATIO;
        const lift = (field2.offsetHeight || 320) * liftRatio;
        proj.style.left = `${atk.x}%`;
        proj.style.top = `calc(${atk.y}% - ${lift}px)`;
        field2.appendChild(proj);
        frame(() => {
          proj.style.transform = `translate(${(def.x - atk.x) * field2.offsetWidth / 100}px, ${(def.y - atk.y) * field2.offsetHeight / 100}px)`;
        });
        later(() => proj.remove(), 340);
        later(() => hitLand(def, e), 320);
      } else {
        // Выпад: фигурка несётся к цели и возвращается
        const dx = (def.x - atk.x) * 0.5;
        const dy = (def.y - atk.y) * 0.5;
        atk.el.style.transition = 'transform 0.14s ease';
        atk.el.style.transform = `translate(-50%, -50%) translate(${dx * field2.offsetWidth / 100}px, ${dy * field2.offsetHeight / 100}px)`;
        later(() => {
          atk.el.style.transform = '';
          hitLand(def, e);
        }, 160);
      }
    }

    function hitLand(defFig, e) {
      defFig.unit.hp = Math.max(0, defFig.unit.hp - e.dmg);
      setHp(e.toUid);
      pulse(defFig.el, e.crit ? 'anim-crit' : 'anim-hit', 480);
      if (defFig.unit.hp <= 0) {
        setFigPose(defFig.el, 'down');
        pulse(defFig.el, 'anim-death', 650);
      } else {
        setFigPose(defFig.el, 'hurt');
        later(() => { if (defFig.unit.hp > 0) setFigPose(defFig.el, 'idle'); }, 480);
      }
    }

    function applyEvent(e) {
      switch (e.t) {
        case 'start':
          logLine('sys', `Строй выстроен: ${e.allies.join(', ')} против ${e.foes.join(', ')}.`);
          break;
        case 'hit':
          animateHit(e);
          logLine(e.crit ? 'crit' : 'hit',
            `${e.from} → ${e.to}${e.skillName ? ` (${e.skillName})` : ''}: −${e.dmg}${e.crit ? ' КРИТ!' : ''}`);
          ctx.sfx?.(e.crit ? 'crit' : 'hit');
          break;
        case 'status_fail': {
          logLine('sys', `${e.who}: ${{ poison: 'яд не привился', sleep: 'сон не подействовал', slow: 'споры не привились', fear: 'страх не подействовал' }[e.kind] || 'статус не прошёл'}`);
          // Визуальный отклик: серая вспышка и всплывающий «мимо» над целью
          const f = figOf(e.uid);
          if (f) {
            pulse(f.el, 'anim-resist', 400);
            floatText(f, { poison: 'яд — мимо', sleep: 'сон — мимо', slow: 'споры — мимо', fear: 'страх — мимо' }[e.kind] || 'мимо', 'resist');
            ctx.sfx?.('resist');
          }
          break;
        }
        case 'dodge': {
          logLine('sys', `${e.who} уклоняется!`);
          const f = figOf(e.uid);
          if (f) {
            pulse(f.el, 'anim-dodge', 380);
            floatText(f, 'Уворот!', 'dodge');
            ctx.sfx?.('dodge');
          }
          break;
        }
        case 'status': {
          const f = figOf(e.uid);
          if (f) {
            f.unit.badges.add(e.kind);
            renderBadges(f);
            pulse(f.el, 'anim-status', 500);
          }
          logLine('status', `${e.who}: ${statusName(e.kind)}`);
          break;
        }
        case 'status_end': {
          const f = figOf(e.uid);
          if (f) {
            f.unit.badges.delete(e.kind);
            renderBadges(f);
          }
          break;
        }
        case 'move': {
          // Шаг по полю: фигурка плавно переезжает на новую клетку
          // (to — якорь тела; у босса 2×2 центр смещён на полклетки)
          const f = figOf(e.uid);
          if (f) {
            const [nx, ny] = bodyCenter(e.to, f.size || 1);
            f.x = nx;
            f.y = ny;
            f.el.style.left = `${nx}%`;
            f.el.style.top = `${ny}%`;
            setFigPose(f.el, 'walk');
            later(() => { if (f.unit.hp > 0) setFigPose(f.el, 'idle'); }, 300);
          }
          break;
        }
        case 'scroll': {
          logLine('potion', `📜 Рыцарь читает: ${e.name}!`);
          ctx.sfx?.('crit');
          const f = figOf(e.uid);
          if (f) pulse(f.el, 'anim-status', 500);
          break;
        }
        case 'dot': {
          // Тик яда/регенерации: полоса HP движется, без строки в логе
          const f = figOf(e.uid);
          if (f) {
            f.unit.hp = Math.max(0, Math.min(f.unit.maxHp, f.unit.hp - e.dmg));
            setHp(e.uid);
            const isHarm = e.kind === 'poison' || e.kind === 'thorns';
            pulse(f.el, isHarm ? 'anim-poison' : 'anim-heal', 320);
            if (isHarm) {
              if (f.unit.hp <= 0) setFigPose(f.el, 'down');
              else {
                setFigPose(f.el, 'hurt');
                later(() => { if (f.unit.hp > 0) setFigPose(f.el, 'idle'); }, 320);
              }
            }
          }
          break;
        }
        case 'sleeps':
          logLine('status', `${e.who} спит… 😴`);
          break;
        case 'potion': {
          const f = figOf(e.uid);
          if (f && e.healed) {
            f.unit.hp = Math.min(f.unit.maxHp, f.unit.hp + e.healed);
            setHp(e.uid);
            pulse(f.el, 'anim-heal', 700);
          }
          if (f && e.cleansed) {
            f.unit.badges.delete(e.cleansed);
            renderBadges(f);
          }
          logLine('potion', `${e.who} пьёт ${e.name}${e.healed ? ` (+${e.healed} ❤️)` : ''}`);
          ctx.sfx?.('potion');
          break;
        }
      }
    }

    function statusName(kind) {
      return { sleep: 'засыпает 😴', poison: 'отравлен ☠️', slow: 'замедлен 🐌', fear: 'охвачен страхом 😨', regen: 'подкрепляется 💚', shield: 'под щитом зелья 🛡️' }[kind] || kind;
    }

    function step() {
      if (done || cancelled) return;
      if (i >= result.log.length) { endScreen(); return; }
      applyEvent(result.log[i]);
      const applied = result.log[i];
      i += 1;
      // Тики яда/регенерации применяем мгновенно, не тратя темп боя
      while (i < result.log.length && result.log[i].t === 'dot') {
        applyEvent(result.log[i]);
        i += 1;
      }
      // Шаги по полю — ускоренно, чтобы манёвр не затягивал бой
      const delay = applied.t === 'move' ? Math.max(70, speed * 0.3) : speed;
      timer = later(step, delay);
    }

    function finishNow() {
      if (done || cancelled) return;
      while (i < result.log.length) { i += 1; }
      // Мгновенно применяем финальные HP
      for (const f of figures.values()) f.unit.hp = 0;
      endScreen();
    }

    function endScreen() {
      if (done || cancelled) return;
      done = true;
      cancelLater(timer);
      timer = null;
      const rep = result.report;
      ctx.sfx?.(rep.victory ? 'success' : 'fail');
      const rewardHtml = (result.rewards || []).map(rewardText).filter(Boolean).join('<br>');
      const hasEnergy = Number.isFinite(result.energyAfter);
      const energyHtml = result.practice
        ? `<br>🛡️ Тренировка без наград: прогресс и пояс сохранены${hasEnergy ? ` · энергия ${result.energyAfter}/${BATTLE_ENERGY_CAP} не потрачена` : ''}.`
        : hasEnergy
          ? rep.victory
            ? `<br>⚡ Энергия после победы: ${result.energyAfter}/${BATTLE_ENERGY_CAP}${result.energySpent ? ` (−${result.energySpent})` : ' · без траты'}.`
            : `<br>⚡ Энергия: ${result.energyAfter}/${BATTLE_ENERGY_CAP} · поражение бесплатно.`
          : '';
      resultOverlay = showOverlay(ctx, {
        title: result.practice
          ? rep.victory ? '🛡️ Тренировка: победа' : '🛡️ Тренировка завершена'
          : rep.victory ? '🏆 Победа!' : '🌙 Рыцарь вернулся отдохнуть',
        subtitle: `Урона нанесено: ${rep.dealt} · Получено: ${rep.taken} · Врагов повержено: ${rep.foesDown}/${rep.foesTotal}` +
          energyHtml +
          (rep.timedOut ? '<br>⏳ Бой затянулся до предела — победитель не выявлен.' : '') +
          ((rep.alliesStats || []).length > 1 ? '<br>' + rep.alliesStats.map((a) => `${a.icon} ${a.name}: ${a.dealt} урона${a.alive ? '' : ' (пал)'}`).join(' · ') : ''),
        rewards: [],
        advice: rep.advice,
        onboardingResult,
        buttons: overlayButtons(rep),
      });
      if (result.bossDrop?.dropped) {
        const card = resultOverlay.querySelector('.card');
        const joy = document.createElement('div');
        joy.className = 'rewards boss-drop-joy';
        const drop = result.bossDrop;
        joy.innerHTML = `✨ <strong>Редкая находка босса!</strong><br>«${ITEM_BY_ID[drop.itemId].name}»<br>` +
          `<span class="muted">${drop.guaranteed ? 'Гарантия после долгих поисков сработала.' : `Шанс этой попытки: ${Math.round(drop.chance * 100)}%.`}</span>`;
        card.insertBefore(joy, resultOverlay.querySelector('.advice') || resultOverlay.querySelector('.actions'));
      }
      if (rewardHtml) {
        const card = resultOverlay.querySelector('.card');
        const rw = document.createElement('div');
        rw.className = 'rewards';
        rw.innerHTML = rewardHtml;
        card.insertBefore(rw, resultOverlay.querySelector('.advice') || resultOverlay.querySelector('.actions'));
      }
      setAchievementPresentationBusy('battle-replay', false);
    }

    step();
    return cleanup;
  }

