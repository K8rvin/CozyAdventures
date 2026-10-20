// Режим «сбор»: расстановка отряда на поле боя + анимированный бой.
import { BATTLE_BY_ID, OBSTACLE_KINDS } from '../data/battles.js';
import { ENEMY_BY_ID } from '../data/enemies.js';
import { ITEM_BY_ID } from '../data/items.js';
import { MERC_BY_ID } from '../data/crew.js';
import { runBattle, moveFormationSlot, nextBattle, battleAvailable } from '../core/state.js';
import { enemyFormationSlots, slotToCell } from '../core/formBattle.js';
import { header, showOverlay, rewardText } from './common.js';

const FRONT = [0, 1, 2];

// Спрайт бойца: арт assets/battle/units/<art>_<pose>_web.png поверх эмодзи.
// Нет файла — молча остаётся эмодзи; нет конкретной позы — откат на стойку (idle).
// mini=true — маленький размер для слотов расстановки.
export function unitSpriteEl(art, icon, mini = false) {
  const span = document.createElement('span');
  span.className = 'uf-icon unit-art' + (mini ? ' mini' : '');
  span.textContent = icon;
  if (!art) return span;
  const img = document.createElement('img');
  img.className = 'unit-sprite';
  img.alt = '';
  img.draggable = false;
  let gone = false;
  const setPose = (pose) => {
    if (gone) return;
    img.dataset.wantPose = pose;
    img.style.opacity = '0.4';
    img.src = `assets/battle/units/${art}_${pose}_web.png`;
  };
  img.addEventListener('error', () => {
    if (img.dataset.wantPose && img.dataset.wantPose !== 'idle') setPose('idle');
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

// Слот расстановки (0–5) → позиция на экране расстановки
function slotPos(slot, side) {
  return cellPos(...slotToCell(slot, side));
}

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
  const battle = BATTLE_BY_ID[params.id];
  if (!battle || !battleAvailable(ctx.state, battle.id)) { ctx.go('battles'); return; }
  const { state } = ctx;

  container.appendChild(header(ctx, `${battle.name} — расстановка`, battle.tip, 'battles'));

  // --- Экран расстановки ---
  const prepPanel = document.createElement('div');
  prepPanel.className = 'panel';
  prepPanel.innerHTML = `<h3>Твой строй</h3>
    <div class="muted" style="font-size:13px;margin-bottom:10px">
    Тапни бойца, затем слот. Передний ряд держит удар, задний — стрелки и поддержка.</div>`;

  const field = document.createElement('div');
  field.className = 'form-field';
  addFieldBg(field, battle.world);
  addObstacles(field, battle.obstacles);
  prepPanel.appendChild(field);

  const units = [
    { key: 'knight', icon: '🛡️', name: 'Рыцарь', art: 'knight' },
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
      ctx.sfx?.('rotate');
      rerender();
    });
  }
  enemySlots.forEach((slot, i) => {
    const def = ENEMY_BY_ID[enemyEntries[i].id];
    const el = slotEl(slot, 'enemy');
    el.appendChild(unitSpriteEl(enemyEntries[i].id, def.icon, true));
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
      ghost.appendChild(unitSpriteEl(u.art, u.icon));
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

  window.addEventListener('pointermove', onDragMove);
  window.addEventListener('pointerup', onDragEnd);

  // Юниты на слотах (тап выбирает, перетаскивание двигает)
  for (const u of units) {
    const slot = state.formation[u.key];
    const host = slotEls[`ally${slot}`];
    if (!host) continue;
    host.classList.add('occupied');
    host.innerHTML = '';
    host.appendChild(unitSpriteEl(u.art, u.icon, true));
    const nm = document.createElement('span');
    nm.className = 'fs-name';
    nm.textContent = u.name;
    host.appendChild(nm);
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

  // --- Тактика команды и тумблер пояса ---
  const tacticBox = document.createElement('div');
  tacticBox.style.cssText = 'display:flex;gap:6px;align-items:center;margin-top:12px;flex-wrap:wrap';
  const tacticTitle = document.createElement('span');
  tacticTitle.textContent = 'Тактика:';
  tacticBox.appendChild(tacticTitle);
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
    tacticBox.appendChild(b);
  }
  const beltLabel = document.createElement('label');
  beltLabel.style.cssText = 'display:flex;gap:6px;align-items:center;margin-left:8px;font-size:14px';
  beltLabel.classList.add('clickable');
  const beltCheck = document.createElement('input');
  beltCheck.type = 'checkbox';
  beltCheck.checked = state.settings.useBeltItems !== false;
  beltCheck.addEventListener('change', () => {
    state.settings.useBeltItems = beltCheck.checked;
    ctx.sfx?.('tap');
    ctx.save();
  });
  beltLabel.append(beltCheck, (() => { const s = document.createElement('span'); s.textContent = 'Использовать предметы с пояса'; return s; })());
  tacticBox.appendChild(beltLabel);
  prepPanel.appendChild(tacticBox);

  // Кнопка «В бой!»
  const actions = document.createElement('div');
  actions.style.cssText = 'display:flex;gap:10px;margin-top:12px;flex-wrap:wrap';
  const goBtn = document.createElement('button');
  goBtn.className = 'primary';
  goBtn.textContent = '⚔️ В бой!';
  goBtn.addEventListener('click', () => startBattle());
  actions.appendChild(goBtn);
  prepPanel.appendChild(actions);
  container.appendChild(prepPanel);

  function rerender() {
    container.innerHTML = '';
    renderFormation(container, ctx, params);
  }

  // --- Бой ---
  function startBattle() {
    const seed = (Date.now() % 100000) + 1;
    const result = runBattle(state, battle.id, seed);
    ctx.save();
    playBattle(result);
  }

  function playBattle(result) {
    // Имена/иконки фигурок из состояния и состава битвы
    const unitDefs = new Map();
    unitDefs.set('a0', { name: 'Рыцарь лавки', icon: '🛡️', hp: result.report.knightHpMax, art: 'knight' });
    state.squadMercs.forEach((id, i) => {
      const d = MERC_BY_ID[id];
      unitDefs.set(`a${i + 1}`, { name: d.name, icon: d.icon, hp: d.hp, art: id });
    });
    enemyEntries.forEach((e, i) => {
      const d = ENEMY_BY_ID[e.id];
      unitDefs.set(`e${i}`, { name: d.name, icon: d.icon, hp: Math.round(d.hp * (e.scale || 1)), art: e.id });
    });
    playBattleReplay(container, ctx, {
      title: battle.name, backTo: 'battles', world: battle.world, result, unitDefs,
      overlayButtons: (rep) => {
        const nextB = rep.victory ? nextBattle(battle.id) : null;
        return [
          ...(nextB ? [{ label: `Следующая битва → ${nextB.name}`, primary: true, onClick: () => ctx.go('battle', { id: nextB.id }) }] : []),
          { label: '🎒 К экипировке', onClick: () => ctx.go('equip') },
          ...(rep.victory ? [] : [
            { label: '🍺 В таверну — усилить отряд', onClick: () => ctx.go('tavern') },
            { label: '🏬 В торговый квартал — снаряжение', onClick: () => ctx.go('hub', { scene: 'market' }) },
          ]),
          { label: '🔁 Ещё раз', onClick: () => ctx.go('battle', { id: battle.id }) },
          { label: 'К походам', primary: !nextB, onClick: () => ctx.go('battles') },
        ];
      },
    });
  }

  // Очистка слушателей перетаскивания при уходе со страницы
  return () => {
    window.removeEventListener('pointermove', onDragMove);
    window.removeEventListener('pointerup', onDragEnd);
    if (unitDrag?.ghost) unitDrag.ghost.remove();
  };
}

export function playBattleReplay(container, ctx, { title, backTo = 'battles', world, result, unitDefs, overlayButtons }) {
  container.innerHTML = '';
  container.appendChild(header(ctx, title, 'Бой идёт сам — смотри и учись', backTo));

    const field2 = document.createElement('div');
    field2.className = 'form-field battle';
    addFieldBg(field2, world);
    addObstacles(field2, result.formation?.obstacles);
    container.appendChild(field2);

    const controls = document.createElement('div');
    controls.className = 'panel';
    controls.style.cssText = 'display:flex;gap:8px;align-items:center;margin-top:10px';
    controls.append(document.createTextNode('Скорость: '));
    for (const [label, ms] of [['1x', 500], ['2x', 250], ['4x', 120]]) {
      const b = document.createElement('button');
      b.className = 'small';
      b.textContent = label;
      b.addEventListener('click', () => { speed = ms; });
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
    const figures = new Map(); // uid -> {el, unit, side}
    const unitsByUid = new Map();
    const allyInfo = new Map(result.formation.allies.map((a) => [a.uid, a.cell]));
    const foeInfo = new Map(result.formation.foes.map((f) => [f.uid, f.cell]));

    for (const [uid, def] of unitDefs) {
      const isAlly = uid.startsWith('a');
      const cell = isAlly ? allyInfo.get(uid) : foeInfo.get(uid);
      if (!cell) continue;
      const [x, y] = cellPos(cell[0], cell[1]);
      const el = document.createElement('div');
      el.className = 'unit-figure ' + (isAlly ? 'ally' : 'enemy');
      el.style.left = `${x}%`;
      el.style.top = `${y}%`;
      el.appendChild(unitSpriteEl(def.art, def.icon));
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
      figures.set(uid, { el, unit, side: isAlly ? 'ally' : 'enemy', x, y });
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
      setTimeout(() => el.classList.remove(cls), ms);
    }

    function animateHit(e) {
      const atk = figOf(e.fromUid);
      const def = figOf(e.toUid);
      if (!atk || !def) return;
      setFigPose(atk.el, 'atk');
      setTimeout(() => { if (atk.unit.hp > 0) setFigPose(atk.el, 'idle'); }, 420);
      if (e.ranged || e.magic) {
        // Снаряд летит от атакующего к цели: магический болт, стихия или стрела
        const proj = document.createElement('div');
        proj.className = 'projectile' + (e.magic ? ' magic' : '');
        proj.textContent = e.magic
          ? (e.elem === 'fire' ? '🔥' : e.elem === 'storm' ? '⚡' : '✨')
          : (e.elem === 'fire' ? '🔥' : e.elem === 'storm' ? '⚡' : '➹');
        proj.style.left = `${atk.x}%`;
        proj.style.top = `${atk.y}%`;
        field2.appendChild(proj);
        requestAnimationFrame(() => {
          proj.style.transform = `translate(${(def.x - atk.x) * field2.offsetWidth / 100}px, ${(def.y - atk.y) * field2.offsetHeight / 100}px)`;
        });
        setTimeout(() => proj.remove(), 340);
        setTimeout(() => hitLand(def, e), 320);
      } else {
        // Выпад: фигурка несётся к цели и возвращается
        const dx = (def.x - atk.x) * 0.5;
        const dy = (def.y - atk.y) * 0.5;
        atk.el.style.transition = 'transform 0.14s ease';
        atk.el.style.transform = `translate(${dx * field2.offsetWidth / 100}px, ${dy * field2.offsetHeight / 100}px)`;
        setTimeout(() => {
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
        setTimeout(() => { if (defFig.unit.hp > 0) setFigPose(defFig.el, 'idle'); }, 480);
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
        case 'status_fail':
          logLine('sys', `${e.who}: ${{ poison: 'яд не привился', sleep: 'сон не подействовал', slow: 'споры не привились', fear: 'страх не подействовал' }[e.kind] || 'статус не прошёл'}`);
          break;
        case 'dodge':
          logLine('sys', `${e.who} уклоняется!`);
          if (figOf(e.uid)) pulse(figOf(e.uid).el, 'anim-dodge', 380);
          break;
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
          const f = figOf(e.uid);
          if (f) {
            const [nx, ny] = cellPos(e.to[0], e.to[1]);
            f.x = nx;
            f.y = ny;
            f.el.style.left = `${nx}%`;
            f.el.style.top = `${ny}%`;
            setFigPose(f.el, 'walk');
            setTimeout(() => { if (f.unit.hp > 0) setFigPose(f.el, 'idle'); }, 300);
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
                setTimeout(() => { if (f.unit.hp > 0) setFigPose(f.el, 'idle'); }, 320);
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
      if (done) return;
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
      timer = setTimeout(step, delay);
    }

    function finishNow() {
      if (done) return;
      while (i < result.log.length) { i += 1; }
      // Мгновенно применяем финальные HP
      for (const f of figures.values()) f.unit.hp = 0;
      endScreen();
    }

    function endScreen() {
      if (done) return;
      done = true;
      clearTimeout(timer);
      const rep = result.report;
      ctx.sfx?.(rep.victory ? 'success' : 'fail');
      const rewardHtml = (result.rewards || []).map(rewardText).filter(Boolean).join('<br>');
      const overlay = showOverlay(ctx, {
        title: rep.victory ? '🏆 Победа!' : '🌙 Рыцарь вернулся отдохнуть',
        subtitle: `Урона нанесено: ${rep.dealt} · Получено: ${rep.taken} · Врагов повержено: ${rep.foesDown}/${rep.foesTotal}` +
          (rep.timedOut ? '<br>⏳ Бой затянулся до предела — победитель не выявлен.' : '') +
          ((rep.alliesStats || []).length > 1 ? '<br>' + rep.alliesStats.map((a) => `${a.icon} ${a.name}: ${a.dealt} урона${a.alive ? '' : ' (пал)'}`).join(' · ') : ''),
        rewards: [],
        advice: rep.advice,
        buttons: overlayButtons(rep),
      });
      if (rewardHtml) {
        const card = overlay.querySelector('.card');
        const rw = document.createElement('div');
        rw.className = 'rewards';
        rw.innerHTML = rewardHtml;
        card.insertBefore(rw, card.querySelector('.advice') || card.querySelector('.actions'));
      }
    }

    step();
  }

