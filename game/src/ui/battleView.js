// Походы рыцаря: список боёв и экран автобоя с логом и отчётом.
import { BATTLES, BATTLE_BY_ID } from '../data/battles.js';
import { ENEMY_BY_ID } from '../data/enemies.js';
import { ITEM_BY_ID } from '../data/items.js';
import { battleAvailable, runBattle, nextBattle, firstUnbeatenBattle } from '../core/state.js';
import { collectStats } from '../core/items.js';
import { MERC_BY_ID } from '../data/crew.js';
import { materialLabel } from '../data/materials.js';
import { startTutorial } from './tutorial.js';
import { quickNav } from './common.js';

// --- Список боёв ---

export function renderBattleList(container, ctx) {
  const { state } = ctx;

  const head = document.createElement('div');
  head.className = 'panel';
  head.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
    <h2 style="margin:0">Походы рыцаря</h2></div>
    <div class="muted">Рыцарь сражается сам — твоя работа: снарядить его с заботой. Три мира ждут.</div>`;
  const back = document.createElement('button');
  back.className = 'ghost small';
  back.textContent = '← Назад';
  back.addEventListener('click', () => ctx.go('hub'));
  head.firstElementChild.appendChild(back);
  container.appendChild(head);
  container.appendChild(quickNav(ctx, [
    { icon: '🎒', label: 'Комната рыцаря', screen: 'equip', primary: true },
    { icon: '🏠', label: 'В лавку', screen: 'hub' },
  ]));

  const list = document.createElement('div');
  list.className = 'list';
  const won = Object.keys(state.battlesDone).length;
  const firstUnbeaten = firstUnbeatenBattle(state);
  const WORLD_LABEL = {
    meadow: '🌿 Тихая опушка', town: '🏰 Средневековый дворик', attic: '📖 Книжный чердак',
    crossroads: '🌟 Экспедиции перекрёстка',
    nm: '🌃 Ночной рынок', sw: '🐸 Сказочные топи', sf: '🎪 Звёздная ярмарка',
    cr: '💎 Хрустальные горы', ash: '🔥 Пепельные степи', jade: '🎋 Нефритовый сад',
    deep: '🐚 Подводный грот', mist: '⏳ Туманные часы',
  };
  let lastWorld = null;
  for (const b of BATTLES) {
    if (b.world !== lastWorld) {
      lastWorld = b.world;
      const wh = document.createElement('h3');
      wh.textContent = WORLD_LABEL[b.world] || b.world;
      list.appendChild(wh);
    }
    const available = battleAvailable(state, b.id);
    const done = !!state.battlesDone[b.id];
    const row = document.createElement('div');
    row.className = 'row' + (available ? '' : ' locked') + (done ? ' done' : '');
    if (firstUnbeaten && b.id === firstUnbeaten.id) row.dataset.scrollTarget = '1';
    const icons = b.enemies.map((e) => ENEMY_BY_ID[typeof e === 'string' ? e : e.id].icon).join(' ');
    row.innerHTML = `
      <span class="icon">${available ? (done ? '🏆' : '⚔️') : '🔒'}</span>
      <span class="grow">
        <div class="name">${b.name} ${ENEMY_BY_ID[typeof b.enemies[0] === 'string' ? b.enemies[0] : b.enemies[0].id].boss ? '<span class="badge epic">БОСС</span>' : ''}</div>
        <div class="desc">${available ? b.tip : 'Пройди предыдущий поход.'} · Против: ${icons}</div>
      </span>`;
    if (available) {
      const btn = document.createElement('button');
      btn.textContent = done ? 'Снова' : 'В поход!';
      btn.className = done ? '' : 'primary';
      btn.addEventListener('click', () => ctx.go('battle', { id: b.id }));
      row.appendChild(btn);
    }
    list.appendChild(row);
  }
  container.appendChild(list);

  // Автоскролл к первой доступной непройденной битве
  const targetRow = list.querySelector?.('[data-scroll-target="1"]');
  if (targetRow && targetRow.scrollIntoView) {
    setTimeout(() => targetRow.scrollIntoView({ block: 'center', behavior: 'smooth' }), 60);
  }

  // Обучение первому бою
  if (won === 0) {
    const firstBtn = list.querySelector?.('.row:not(.locked) button');
    if (firstBtn) {
      startTutorial(ctx, 'first_battle', [
        {
          target: firstBtn,
          title: 'Первый поход рыцаря',
          text: 'Бой идёт сам — ты режиссёр, а не актер. Нажми «В поход!» и смотри, как твоя забота превращается в победу. Если что-то пойдёт не так, отчёт подскажет, чего не хватило.',
          cta: 'В поход!',
        },
      ]);
    }
  }
}

// --- Экран боя ---

export function renderBattle(container, ctx, params) {
  const battle = BATTLE_BY_ID[params.id];
  if (!battle) { ctx.go('battles'); return; }

  const { state } = ctx;
  const seed = (Date.now() % 100000) + 1;

  // Подготовка отображаемых юнитов ДО прогона (runBattle мутирует состояние).
  const { stats: kstats } = collectStats(state.equipped);
  const display = {
    knight: { uid: 'a0', name: 'Рыцарь лавки', icon: '🛡️', hp: kstats.hp, maxHp: kstats.hp, badges: new Set() },
    mercs: state.squadMercs.map((id, i) => {
      const d = MERC_BY_ID[id];
      return { uid: `a${i + 1}`, name: d.name, icon: d.icon, hp: d.hp, maxHp: d.hp, badges: new Set() };
    }),
    foes: battle.enemies.map((entry, i) => {
      const id = typeof entry === 'string' ? entry : entry.id;
      const scale = typeof entry === 'string' ? 1 : (entry.scale || 1);
      const d = ENEMY_BY_ID[id];
      return { uid: `e${i}`, name: d.name, icon: d.icon, hp: Math.round(d.hp * scale), maxHp: Math.round(d.hp * scale), badges: new Set() };
    }),
  };

  const result = runBattle(state, battle.id, seed);
  if (!result) { ctx.go('battles'); return; }
  ctx.save(); // награды/пояс уже применены — сохраняем сразу

  const head = document.createElement('div');
  head.className = 'panel';
  head.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
    <h2 style="margin:0">${battle.name}</h2></div>`;
  const back = document.createElement('button');
  back.className = 'ghost small';
  back.textContent = '← Назад';
  back.addEventListener('click', () => { stop(); ctx.go('battles'); });
  head.firstElementChild.appendChild(back);
  container.appendChild(head);

  // Арена: рыцарь + наёмники против врагов
  const arena = document.createElement('div');
  arena.className = 'battle-arena';
  const knightCard = unitCard(display.knight, 'ally');
  arena.appendChild(knightCard.el);
  const mercCards = display.mercs.map((m) => {
    const c = unitCard(m, 'ally');
    arena.appendChild(c.el);
    return c;
  });
  const vs = document.createElement('div');
  vs.style.alignSelf = 'center';
  vs.style.fontSize = '22px';
  vs.textContent = '⚔️';
  arena.appendChild(vs);
  const foeCards = display.foes.map((f) => {
    const c = unitCard(f, 'enemy');
    arena.appendChild(c.el);
    return c;
  });
  container.appendChild(arena);

  // Управление скоростью
  const controls = document.createElement('div');
  controls.className = 'panel';
  controls.style.display = 'flex';
  controls.style.gap = '8px';
  controls.style.alignItems = 'center';
  const speedLabel = document.createElement('span');
  speedLabel.textContent = 'Скорость:';
  const b1 = speedBtn('1x', 350);
  const b2 = speedBtn('2x', 170);
  const b4 = speedBtn('4x', 80);
  const skip = document.createElement('button');
  skip.className = 'small ghost';
  skip.textContent = '⏭️ К итогу';
  skip.addEventListener('click', () => finishNow());
  controls.append(speedLabel, b1, b2, b4, skip);
  container.appendChild(controls);

  // Лог
  const logBox = document.createElement('div');
  logBox.className = 'battle-log';
  container.appendChild(logBox);

  let speed = 350;
  let timer = null;
  let i = 0;
  let done = false;

  function speedBtn(label, ms) {
    const b = document.createElement('button');
    b.className = 'small';
    b.textContent = label;
    b.addEventListener('click', () => { speed = ms; });
    return b;
  }

  function unitCard(u, side) {
    const el = document.createElement('div');
    el.className = 'unit-card';
    el.dataset.side = side;
    el.innerHTML = `
      <div class="uicon">${u.icon}</div>
      <div class="name" style="font-size:13px;font-weight:600">${u.name}</div>
      <div class="status-badges"></div>
      <div class="hpbar"><div style="width:100%"></div></div>`;
    return { el, u };
  }

  // --- Анимационные помощники ---
  function pulse(el, cls, ms = 500) {
    if (!el) return;
    el.classList.remove(cls);
    void el.offsetWidth; // перезапуск анимации
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), ms);
  }

  function floatNumber(card, text, cls = '') {
    const n = document.createElement('div');
    n.className = `dmg-number ${cls}`;
    n.textContent = text;
    card.el.appendChild(n);
    setTimeout(() => n.remove(), 850);
  }

  function animateAttack(attackerCard, targetCard, dmg, crit) {
    const side = attackerCard?.el?.dataset.side === 'enemy' ? 'enemy' : 'ally';
    pulse(attackerCard?.el, `anim-lunge-${side}`, 350);
    setTimeout(() => {
      if (crit) pulse(targetCard?.el, 'anim-crit', 550);
      else pulse(targetCard?.el, 'anim-hit', 480);
      floatNumber(targetCard, `−${dmg}`, crit ? 'crit' : '');
      if (targetCard && targetCard.u.hp <= 0) pulse(targetCard.el, 'anim-death', 650);
    }, 120);
  }

  function applyEvent(e) {
    // Привязка события к карточке: по uid (точно), иначе по имени (старые логи)
    const findUnit = (uid, name) => {
      const all = [
        { card: knightCard, u: display.knight },
        ...display.mercs.map((m, i) => ({ card: mercCards[i], u: m })),
        ...display.foes.map((f, i) => ({ card: foeCards[i], u: f })),
      ];
      if (uid) {
        const hit = all.find((x) => x.u.uid === uid);
        if (hit) return hit;
      }
      return all.find((x) => x.u.name === name) || null;
    };
    const line = document.createElement('div');

    switch (e.t) {
      case 'start':
        line.className = 'sys';
        line.textContent = `Рыцарь выходит: ${e.foes.join(', ')}.`;
        break;
      case 'hit': {
        const target = findUnit(e.toUid, e.to);
        const attacker = findUnit(e.fromUid, e.from);
        if (target) {
          target.u.hp = Math.max(0, target.u.hp - e.dmg);
          updateCard(target.card, target.u);
          if (attacker) animateAttack(attacker.card, target.card, e.dmg, e.crit);
        }
        line.className = e.crit ? 'crit' : 'hit';
        line.textContent = `${e.from} → ${e.to}: −${e.dmg}${e.crit ? ' КРИТ!' : ''}${e.blocked ? ' (блок)' : ''}`;
        ctx.sfx?.(e.crit ? 'crit' : 'hit');
        break;
      }
      case 'dodge': {
        const target = findUnit(e.uid, e.who);
        if (target) pulse(target.card.el, 'anim-dodge', 380);
        line.className = 'sys';
        line.textContent = `${e.who} уклоняется!`;
        break;
      }
      case 'status': {
        const target = findUnit(e.uid, e.who);
        const EMOJI = { sleep: '😴', poison: '☠️', slow: '🐌', shield: '🔰', fear: '😨', regen: '💚' };
        if (target) {
          target.u.badges.add(EMOJI[e.kind] || '✳️');
          updateCard(target.card, target.u);
        }
        line.className = 'status';
        const NAMES = { sleep: 'засыпает', poison: 'отравлен', slow: 'замедлен', fear: 'охвачен страхом', regen: 'подкрепляется настоем' };
        line.textContent = `${e.who} ${NAMES[e.kind] || e.kind}${e.from ? ` (${e.from})` : ''}`;
        break;
      }
      case 'sleeps':
        line.className = 'status';
        line.textContent = `${e.who} спит… 😴`;
        break;
      case 'potion': {
        const target = findUnit(e.uid, e.who);
        if (target && e.healed) {
          target.u.hp = Math.min(target.u.maxHp, target.u.hp + e.healed);
          target.u.badges.delete('☠️');
          updateCard(target.card, target.u);
          pulse(target.card.el, 'anim-heal', 750);
          floatNumber(target.card, `+${e.healed}`, 'heal');
        }
        if (target && e.cleansed) {
          const CLEANSE_BADGE = { sleep: '😴', poison: '☠️' };
          target.u.badges.delete(CLEANSE_BADGE[e.cleansed] || '✳️');
          updateCard(target.card, target.u);
          pulse(target.card.el, 'anim-heal', 750);
        }
        const CLEANSE_TEXT = { sleep: ' — сон как рукой сняло!', poison: ' — яд выведен!' };
        line.className = 'potion';
        line.textContent = `${e.who} пьёт ${e.name}${e.healed ? ` (+${e.healed} ❤️)` : ''}${e.cleansed ? (CLEANSE_TEXT[e.cleansed] || '') : ''}`;
        ctx.sfx?.('potion');
        break;
      }
      default:
        return;
    }
    logBox.appendChild(line);
    logBox.scrollTop = logBox.scrollHeight;
  }

  function updateCard(card, u) {
    const bar = card.el.querySelector('.hpbar > div');
    bar.style.width = `${Math.max(0, (u.hp / u.maxHp) * 100)}%`;
    card.el.querySelector('.status-badges').textContent = [...u.badges].join(' ');
    card.el.classList.toggle('dead', u.hp <= 0);
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
    while (i < result.log.length) { applyEvent(result.log[i]); i += 1; }
    endScreen();
  }

  function endScreen() {
    if (done) return;
    done = true;
    clearTimeout(timer);
    const rep = result.report;
    ctx.sfx?.(rep.victory ? 'success' : 'fail');
    const overlay = document.createElement('div');
    overlay.className = 'overlay';

    const rewardHtml = (result.rewards || []).map((r) => {
      if (r.type === 'coins') return `🪙 ${r.amount} монет`;
      if (r.type === 'seals') return `🔰 ${r.amount} печать мастера`;
      if (r.type === 'material') return `Материал: ${materialLabel(r.id)}${r.amount > 1 ? ` ×${r.amount}` : ''}`;
      if (r.type === 'item') return `🎁 ${ITEM_BY_ID[r.id]?.name || r.id}`;
      return '';
    }).filter(Boolean).join('<br>');

    overlay.innerHTML = `
      <div class="card">
        <h2>${rep.victory ? '🏆 Победа!' : '🌙 Рыцарь вернулся отдохнуть'}</h2>
        <div class="muted">
          Урона нанесено: <b>${rep.dealt}</b> · Получено: <b>${rep.taken}</b> ·
          Врагов повержено: <b>${rep.foesDown}/${rep.foesTotal}</b>
        </div>
        ${(rep.alliesStats || []).length > 1 ? `<div class="muted" style="font-size:13px;margin-top:6px">${
          rep.alliesStats.map((a) => `${a.icon} ${a.name}: ${a.dealt} урона${a.alive ? '' : ' (пал)'}`).join('<br>')
        }</div>` : ''}
        ${rep.victory && rewardHtml ? `<div class="rewards">${rewardHtml}</div>` : ''}
        ${rep.advice ? `<div class="advice">💡 ${rep.advice}</div>` : ''}
        <div class="actions"></div>
      </div>`;
    const actions = overlay.querySelector('.actions');
    const nextB = rep.victory ? nextBattle(battle.id) : null;
    if (nextB) {
      const nextBtn = document.createElement('button');
      nextBtn.className = 'primary';
      nextBtn.textContent = `Следующая битва → ${nextB.name}`;
      nextBtn.addEventListener('click', () => { overlay.remove(); ctx.go('battle', { id: nextB.id }); });
      actions.appendChild(nextBtn);
    }
    const toEquip = document.createElement('button');
    toEquip.textContent = '🎒 К экипировке';
    toEquip.addEventListener('click', () => { overlay.remove(); ctx.go('equip'); });
    const again = document.createElement('button');
    again.textContent = '🔁 Ещё раз';
    again.addEventListener('click', () => { overlay.remove(); ctx.go('battle', { id: battle.id }); });
    const toList = document.createElement('button');
    if (!nextB) toList.className = 'primary';
    toList.textContent = 'К походам';
    toList.addEventListener('click', () => { overlay.remove(); ctx.go('battles'); });
    actions.append(toList, rep.victory ? again : toEquip, rep.victory ? toEquip : again);
    document.body.appendChild(overlay);
  }

  function onKey(ev) {
    if (ev.key === ' ') { ev.preventDefault(); if (done) return; if (timer) { clearTimeout(timer); timer = null; } else step(); }
    if (ev.key === 'Escape') { stop(); ctx.go('battles'); }
  }
  window.addEventListener('keydown', onKey);

  function stop() {
    done = true;
    clearTimeout(timer);
  }

  step();

  return () => {
    stop();
    window.removeEventListener('keydown', onKey);
  };
}
