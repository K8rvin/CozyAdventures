// Режим «сбор»: расстановка отряда на поле боя + анимированный бой.
import { BATTLE_BY_ID } from '../data/battles.js';
import { ENEMY_BY_ID } from '../data/enemies.js';
import { ITEM_BY_ID } from '../data/items.js';
import { MERC_BY_ID } from '../data/crew.js';
import { runBattle, moveFormationSlot, nextBattle, battleAvailable } from '../core/state.js';
import { enemyFormationSlots } from '../core/formBattle.js';
import { header, showOverlay, rewardText } from './common.js';

const FRONT = [0, 1, 2];

// Позиции слотов в процентах поля: [x%, y%]
function slotPos(slot, side) {
  const row = slot % 3;
  const y = 18 + row * 32;
  const x = side === 'ally'
    ? (FRONT.includes(slot) ? 30 : 8)
    : (FRONT.includes(slot) ? 70 : 92);
  return [x, y];
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
  prepPanel.appendChild(field);

  const units = [
    { key: 'knight', icon: '🛡️', name: 'Рыцарь' },
    ...state.squadMercs.map((id, i) => ({
      key: `merc${i}`, icon: MERC_BY_ID[id].icon, name: MERC_BY_ID[id].name,
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
    el.innerHTML = `<span class="fs-icon">${def.icon}</span>`;
    el.classList.add('occupied', 'enemy');
    field.appendChild(el);
  });

  // Юниты на слотах
  for (const u of units) {
    const slot = state.formation[u.key];
    const host = slotEls[`ally${slot}`];
    if (!host) continue;
    host.classList.add('occupied');
    host.innerHTML = `<span class="fs-icon">${u.icon}</span><span class="fs-name">${u.name}</span>`;
    host.addEventListener('click', (ev) => {
      ev.stopPropagation?.();
      selectedUnit = selectedUnit === u.key ? null : u.key;
      field.querySelectorAll('.form-slot').forEach((s) => s.classList.remove('selected'));
      if (selectedUnit) host.classList.add('selected');
      ctx.sfx?.('tap');
    });
  }

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
    container.innerHTML = '';
    container.appendChild(header(ctx, battle.name, 'Бой идёт сам — смотри и учись', 'battles'));

    const field2 = document.createElement('div');
    field2.className = 'form-field battle';
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
    const allyInfo = new Map(result.formation.allies.map((a) => [a.uid, a.slot]));
    const foeInfo = new Map(result.formation.foes.map((f) => [f.uid, f.slot]));

    // Имена/иконки берём из первого start-события лога нельзя — собираем из state/battle
    const unitDefs = new Map();
    unitDefs.set('a0', { name: 'Рыцарь лавки', icon: '🛡️', hp: 0 });
    state.squadMercs.forEach((id, i) => {
      const d = MERC_BY_ID[id];
      unitDefs.set(`a${i + 1}`, { name: d.name, icon: d.icon, hp: d.hp });
    });
    enemyEntries.forEach((e, i) => {
      const d = ENEMY_BY_ID[e.id];
      unitDefs.set(`e${i}`, { name: d.name, icon: d.icon, hp: Math.round(d.hp * (e.scale || 1)) });
    });
    // HP рыцаря: из отчёта
    unitDefs.get('a0').hp = result.report.knightHpMax;

    for (const [uid, def] of unitDefs) {
      const isAlly = uid.startsWith('a');
      const slot = isAlly ? allyInfo.get(uid) : foeInfo.get(uid);
      if (slot === undefined) continue;
      const [x, y] = slotPos(slot, isAlly ? 'ally' : 'enemy');
      const el = document.createElement('div');
      el.className = 'unit-figure ' + (isAlly ? 'ally' : 'enemy');
      el.style.left = `${x}%`;
      el.style.top = `${y}%`;
      el.innerHTML = `
        <div class="uf-icon">${def.icon}</div>
        <div class="uf-name">${def.name}</div>
        <div class="hpbar"><div style="width:100%"></div></div>`;
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
      if (e.ranged) {
        // Стрела летит от атакующего к цели
        const arrow = document.createElement('div');
        arrow.className = 'projectile';
        arrow.textContent = e.elem === 'fire' ? '🔥' : '➹';
        arrow.style.left = `${atk.x}%`;
        arrow.style.top = `${atk.y}%`;
        field2.appendChild(arrow);
        requestAnimationFrame(() => {
          arrow.style.transform = `translate(${(def.x - atk.x) * field2.offsetWidth / 100}px, ${(def.y - atk.y) * field2.offsetHeight / 100}px)`;
        });
        setTimeout(() => arrow.remove(), 340);
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
      if (defFig.unit.hp <= 0) pulse(defFig.el, 'anim-death', 650);
    }

    function applyEvent(e) {
      switch (e.t) {
        case 'start':
          logLine('sys', `Строй выстроен: ${e.allies.join(', ')} против ${e.foes.join(', ')}.`);
          break;
        case 'hit':
          animateHit(e);
          logLine(e.crit ? 'crit' : 'hit', `${e.from} → ${e.to}: −${e.dmg}${e.crit ? ' КРИТ!' : ''}`);
          ctx.sfx?.(e.crit ? 'crit' : 'hit');
          break;
        case 'dodge':
          logLine('sys', `${e.who} уклоняется!`);
          if (figOf(e.uid)) pulse(figOf(e.uid).el, 'anim-dodge', 380);
          break;
        case 'status': {
          logLine('status', `${e.who}: ${statusName(e.kind)}`);
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
          logLine('potion', `${e.who} пьёт ${e.name}${e.healed ? ` (+${e.healed} ❤️)` : ''}`);
          ctx.sfx?.('potion');
          break;
        }
      }
    }

    function statusName(kind) {
      return { sleep: 'засыпает 😴', poison: 'отравлен ☠️', slow: 'замедлен 🐌', fear: 'охвачен страхом 😨', regen: 'подкрепляется 💚' }[kind] || kind;
    }

    function step() {
      if (done) return;
      if (i >= result.log.length) { endScreen(); return; }
      applyEvent(result.log[i]);
      i += 1;
      timer = setTimeout(step, speed);
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
      const nextB = rep.victory ? nextBattle(battle.id) : null;
      const overlay = showOverlay(ctx, {
        title: rep.victory ? '🏆 Победа!' : '🌙 Рыцарь вернулся отдохнуть',
        subtitle: `Урона нанесено: ${rep.dealt} · Получено: ${rep.taken} · Врагов повержено: ${rep.foesDown}/${rep.foesTotal}` +
          ((rep.alliesStats || []).length > 1 ? '<br>' + rep.alliesStats.map((a) => `${a.icon} ${a.name}: ${a.dealt} урона${a.alive ? '' : ' (пал)'}`).join(' · ') : ''),
        rewards: [],
        advice: rep.advice,
        buttons: [
          ...(nextB ? [{ label: `Следующая битва → ${nextB.name}`, primary: true, onClick: () => ctx.go('battle', { id: nextB.id }) }] : []),
          { label: '🎒 К экипировке', onClick: () => ctx.go('equip') },
          { label: '🔁 Ещё раз', onClick: () => ctx.go('battle', { id: battle.id }) },
          { label: 'К походам', primary: !nextB, onClick: () => ctx.go('battles') },
        ],
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
}
