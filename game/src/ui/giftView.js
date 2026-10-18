// Экран головоломки «Подарок для гостя»: прилавок-витрина
// (арт assets/gift/gift_counter_web.jpg, фолбэк — тёплый градиент).
// Гость рассказывает историю ПОРЦИЯМИ — репликами в речевом пузыре
// (листаются тапом по пузырю). На витрине 6–9 сувениров: тап — выбор,
// наведение — превью с тегами в боковой панели. Кнопка «Завернуть и вручить»
// запускает упаковку (шелест, анимация) и вердикт гостя: радость, честный
// намёк на нарушенное условие или (третья неудача) уход «подумать» —
// уровень переигрывается без дополнительных штрафов. Подсказка кота прячет
// с витрины самую опасную обманку.
import {
  createGiftPuzzle, selectGift, undoGift, resetGift, giveGift,
  applyGiftHint, rewardFactor, giftProgress, restartGift,
  GIFT_MAX_TRIES, GIFT_FACTORS,
} from '../core/giftPuzzle.js';
import { SOUVENIRS } from '../data/puzzlesGift.js';
import { completePuzzle, nextPuzzle, journalPush } from '../core/state.js';
import { header, showOverlay, puzzleSkipButton, backToPuzzleType } from './common.js';

// Реплики гостя при промахе: честный намёк на нарушенное условие.
const REACT_AVOID = {
  металл: 'Ой… железо. Я его не переношу — холодное да звенит.',
  стекло: 'Стекло? Ох, оно бьётся от одного неловкого взгляда…',
  съедобный: 'Еда? Нет-нет, тут дело не в еде.',
  сладкий: 'Сладкое? Аж зубы сводит. Не то.',
  бумага: 'Бумага не выдержит: размокнет, порвётся…',
  музыкальный: 'Музыка? Ох, звуки сейчас не в радость.',
  холодный: 'Холодное… Мёрзнут лапы и душа.',
  глина: 'Глина? Разобьётся или загорится — не переживёт.',
  дерево: 'Дерево? У нас оно или горит, или пилится. Не то.',
  воск: 'Воск? Погаснет при первом же ветре…',
  ткань: 'Ткань? У неё на шерсть аллергия — чихает с октября.',
  светящийся: 'Светится? Он от огоньков прячется и ворчит…',
  письменный: 'Письменное? У него этого — как у вас банок с вареньем.',
  дорожный: 'Дорожное? Пусть дома сидит. Или: наездился уже.',
  ароматный: 'Запах? Ох, травяные запахи не переношу…',
  тёплый: 'Горячее? У печи весь день — нагорячелся…',
  украшение: 'Украшение? Я их не ношу — всё в работе…',
  домашний: 'Домашнее? У меня омут, а не кладовая…',
  загадочный: 'Тайна? Она простая, прямая — тайн не любит…',
  весёлый: 'Весёлое? Учитель строгий — не веселья ради…',
};
const REACT_NEED = {
  тёплый: 'Хм… а греет ли оно? Хотелось бы тепла.',
  домашний: 'Милый предмет, но хочется чего-то для дома, надолго.',
  дорожный: 'Хорошая вещь, да не дорожная — в путь такую не возьмёшь.',
  съедобный: 'А съесть-то это можно? Вот в чём вопрос.',
  письменный: 'Для письма годится? Кажется, не очень…',
  спокойный: 'Чего-то спокойного в нём не хватает.',
  ароматный: 'А запах? Хотелось бы аромата.',
  музыкальный: 'А мелодия? Без неё никак.',
  весёлый: 'Грустновато. Хочется веселья!',
  украшение: 'Носить-то его как? Нужна вещица-украшение.',
  загадочный: 'Слишком просто. Тайны в нём нет.',
  светящийся: 'А светится оно? Нужен именно свет.',
  дерево: 'А дерево ли это? Хочется живого дерева, тёплого.',
  бумага: 'А бумага ли это? Нужен лист, страница, карта…',
  ткань: 'А мягкое ли оно? Хотелось бы ткани.',
  металл: 'А железо ли это? Нужно что-то железное.',
  холодный: 'А холодное ли оно? Нужен мороз в ладонях.',
  стекло: 'А стекло ли это? Нужно стекло, хрустальное.',
  сладкий: 'А сладкое ли оно? Нужна сладость.',
  глина: 'А глина ли это? Нужна глина, нашего поля ягода.',
};

function reactionFor(broken) {
  const map = broken.kind === 'avoid' ? REACT_AVOID : REACT_NEED;
  return map[broken.tag]
    || (broken.kind === 'avoid'
      ? `Ох, «${broken.tag}» — это точно не подойдёт…`
      : `Чего-то не хватает… кажется, «${broken.tag}».`);
}

export function renderGiftPuzzle(container, ctx, level) {
  let puzzle = createGiftPuzzle(level, SOUVENIRS);
  let hintsUsed = 0;
  let finished = false;
  let checking = false;
  let disposed = false;
  const timers = [];
  let storyIdx = 0;     // какая реплика истории показана
  let reaction = null;  // намёк гостя после промаха (перекрывает историю)

  container.appendChild(header(ctx, level.name, `Сложность: ${'★'.repeat(level.difficulty)}`, ['puzzles', { mech: level.mechanic || 'mirror' }]));

  const wrap = document.createElement('div');
  // Раскладка как в «Строках» и «Картах судьбы»: сцена слева, панель справа
  wrap.className = 'puzzle-wrap hang-wrap';

  const pageBox = document.createElement('div');
  pageBox.className = 'puzzle-canvas-box';
  const scene = document.createElement('div');
  scene.className = 'gift-scene';
  pageBox.appendChild(scene);
  wrap.appendChild(pageBox);

  const side = document.createElement('div');
  side.className = 'puzzle-side';
  const intro = document.createElement('div');
  intro.className = 'intro-text';
  intro.textContent = level.intro;
  side.appendChild(intro);

  const statusEl = document.createElement('div');
  statusEl.className = 'puzzle-status';
  side.appendChild(statusEl);

  // Панель-превью: в покое — правила; при выборе/наведении — сувенир
  const preview = document.createElement('div');
  preview.className = 'panel fate-panel';
  const RULES_HTML = `<div class="desc" style="line-height:1.8">
    Гость рассказывает историю — тапай речевой пузырь, чтобы переслушать.<br>
    В истории спрятаны условия: что подарок должен уметь и что ему нельзя.<br>
    <b>Тапни сувенир</b> на витрине — увидишь его пометки здесь, в панели.<br>
    Когда уверен — жми «Завернуть и вручить». Ошибся — гость честно намекнёт.<br>
    Попыток всего ${GIFT_MAX_TRIES}: награда тает (${GIFT_FACTORS.map((f) => `${Math.round(f * 100)}%`).join(' → ')}), потом гость уходит думать — придётся начать заново.</div>`;
  preview.innerHTML = RULES_HTML;
  side.appendChild(preview);

  // Кнопка вручения живёт на сцене сразу под витриной (append — в renderAll)
  const btnGive = mkBtn('🎁 Завернуть и вручить', doGive);
  btnGive.className = 'primary gift-give';

  const controls = document.createElement('div');
  controls.className = 'puzzle-controls';
  controls.style.marginTop = '10px';
  const btnUndo = mkBtn('↩️ Отмена (Z)', doUndo);
  const btnHint = mkBtn('💡 Подсказка (H)', doHint);
  const btnReset = mkBtn('🔄 Сброс (R)', doReset);
  const btnSkip = puzzleSkipButton(ctx, level, () => backToPuzzleType(ctx, level));
  controls.append(btnUndo, btnHint, btnReset);
  controls.appendChild(btnSkip);
  side.appendChild(controls);

  // Кнопка переигровки (тоже под витриной) — появляется, когда гость ушёл думать
  const btnRestart = mkBtn('🌙 Гость вернётся — начать заново', () => {
    if (checking || finished) return;
    puzzle = restartGift(puzzle);
    reaction = null;
    storyIdx = 0;
    ctx.sfx?.('page');
    renderAll();
  });
  btnRestart.className = 'primary gift-give';

  wrap.appendChild(side);
  container.appendChild(wrap);

  function mkBtn(label, fn) {
    const b = document.createElement('button');
    b.innerHTML = label;
    b.addEventListener('click', fn);
    return b;
  }

  function later(fn, ms) {
    const timer = setTimeout(() => { if (!disposed) fn(); }, ms);
    timers.push(timer);
    return timer;
  }

  function setChecking(value) {
    checking = value;
    scene.classList.toggle('checking', value);
    for (const b of [btnGive, btnUndo, btnHint, btnReset, btnSkip]) b.disabled = value;
  }

  function doUndo() {
    if (finished || checking || puzzle.gone) return;
    if (undoGift(puzzle)) { reaction = null; ctx.sfx?.('tap'); renderAll(); }
  }
  function doReset() {
    if (finished || checking || puzzle.gone) return;
    resetGift(puzzle);
    reaction = null;
    ctx.sfx?.('tap');
    renderAll();
  }
  function doHint() {
    if (finished || checking || puzzle.gone) return;
    const h = applyGiftHint(puzzle);
    ctx.sfx?.('hint');
    if (h) {
      hintsUsed += 1;
      reaction = null;
      const s = SOUVENIRS[h.id];
      ctx.toast(`Кот-хранитель мурлычет и сдвигает лапой «${s.name}» подальше от вас.`);
      renderAll();
    } else {
      ctx.toast('Прячь дальше некуда — на витрине осталась суть.');
    }
  }

  // --- Превью сувенира в боковой панели ---
  let previewId = null;
  function showPreview(id) {
    previewId = id;
    const s = SOUVENIRS[id];
    preview.innerHTML = '';
    const box = document.createElement('div');
    box.className = 'fate-preview';
    const frame = document.createElement('div');
    frame.className = 'fate-preview-frame';
    const icon = document.createElement('span');
    icon.className = 'fate-preview-icon';
    icon.textContent = s.icon;
    frame.appendChild(icon);
    const img = document.createElement('img');
    img.className = 'fate-preview-art';
    img.alt = s.name;
    img.addEventListener('error', () => img.remove());
    img.src = `assets/gift/souv_${id.replace(/^souv_/, '')}_web.jpg`;
    frame.appendChild(img);
    box.appendChild(frame);
    const name = document.createElement('div');
    name.className = 'fate-preview-name';
    name.textContent = s.name;
    box.appendChild(name);
    const tags = document.createElement('div');
    tags.className = 'fate-preview-meanings';
    tags.textContent = s.tags.join(' · ');
    box.appendChild(tags);
    const desc = document.createElement('div');
    desc.className = 'gift-preview-desc';
    desc.textContent = s.desc;
    box.appendChild(desc);
    preview.appendChild(box);
  }
  function hidePreview(id) {
    if (previewId !== id) return;
    previewId = null;
    preview.innerHTML = RULES_HTML;
  }
  function refreshPreview() {
    if (puzzle.selected) showPreview(puzzle.selected);
    else { previewId = null; preview.innerHTML = RULES_HTML; }
  }

  // --- Вручение подарка: упаковка, затем вердикт гостя ---
  function doGive() {
    if (finished || checking || puzzle.gone) return;
    if (!puzzle.selected) {
      ctx.toast('Сначала выбери сувенир на витрине.');
      return;
    }
    setChecking(true);
    ctx.sfx?.('gift');
    const chosen = scene.querySelector('.gift-item.selected');
    if (chosen) chosen.classList.add('gift-wrapping');

    later(() => {
      const res = giveGift(puzzle);
      if (res?.result === 'win') { finish(); return; }
      setChecking(false);
      if (!res) { renderAll(); return; }
      if (res.result === 'gone') {
        ctx.sfx?.('fail');
        reaction = null;
        ctx.toast(`${level.guest.name} ушёл думать… Вернётся — начнёте заново.`);
        scene.classList.add('shake');
        later(() => scene.classList.remove('shake'), 500);
        renderAll();
        return;
      }
      // Честный намёк: гость называет нарушенное условие
      ctx.sfx?.('fateMiss');
      reaction = reactionFor(res.broken);
      const factor = Math.round(rewardFactor(puzzle) * 100);
      ctx.toast(res.triesLeft > 0
        ? `Не то. Осталось попыток: ${res.triesLeft} · награда уже ${factor}%.`
        : 'Не то…');
      scene.classList.add('shake');
      later(() => scene.classList.remove('shake'), 500);
      renderAll();
    }, 650);
  }

  function onKey(ev) {
    if (ev.key === 'Escape') { backToPuzzleType(ctx, level); return; }
    if ((ev.ctrlKey || ev.metaKey) && ['z', 'Z', 'я', 'Я'].includes(ev.key)) {
      ev.preventDefault();
      doUndo();
      return;
    }
    if (ev.ctrlKey || ev.altKey || ev.metaKey) return;
    if (ev.key === 'z' || ev.key === 'Z') { ev.preventDefault(); doUndo(); }
    if (ev.key === 'h' || ev.key === 'H') doHint();
    if (ev.key === 'r' || ev.key === 'R') doReset();
    if ((ev.key === 'Enter' || ev.key === ' ') && puzzle.selected) { ev.preventDefault(); doGive(); }
  }
  window.addEventListener('keydown', onKey);

  function finish() {
    finished = true;
    const factor = rewardFactor(puzzle);
    const rewards = completePuzzle(ctx.state, level.id, {
      moves: puzzle.moves, hintsUsed, coinFactor: factor,
    });
    const gift = SOUVENIRS[level.answer];
    journalPush(ctx.state, '🎁', `${level.guest.name} принял(а) подарок: ${gift.name}.`);
    ctx.save();
    ctx.sfx?.('success');
    if (level.guest.icon === '🐈') ctx.sfx?.('purr');
    renderAll();
    later(() => {
      const next = nextPuzzle(level.id);
      showOverlay(ctx, {
        title: '🎁 Подарок вручён!',
        subtitle: `«${level.name}»: ${gift.icon} ${gift.name}`
          + `<br><span class="muted">${level.guest.icon} ${level.guest.name}: «${level.thanks}»</span>`
          + (factor < 1 ? `<br>Терпение гостя растопило часть награды (−${Math.round((1 - factor) * 100)}% монет).` : ''),
        rewards,
        buttons: [
          ...(next ? [{ label: `Следующий гость → ${next.name}`, primary: true, onClick: () => ctx.go('puzzle', { id: next.id }) }] : []),
          { label: 'К загадкам', primary: !next, onClick: () => backToPuzzleType(ctx, level) },
          { label: 'Ещё раз', onClick: () => ctx.go('puzzle', { id: level.id }) },
          { label: 'В лавку', onClick: () => ctx.go('hub') },
        ],
      });
    }, 450);
  }

  // Речевой пузырь гостя: история листается тапом; после промаха — намёк
  function renderBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'fate-bubble clickable';
    const chip = document.createElement('span');
    chip.className = 'fate-bubble-chip';
    const text = document.createElement('span');
    text.className = 'fate-bubble-text';
    if (puzzle.gone) {
      chip.textContent = 'Пауза';
      text.textContent = `${level.guest.name} задумался и вышел за дверь. Вернётся, когда выдохнет, — начнёте с чистой витриной.`;
    } else if (reaction) {
      chip.textContent = 'Намёк';
      text.textContent = `«${reaction}»`;
    } else {
      chip.textContent = `История ${storyIdx + 1}/${level.story.length}`;
      text.textContent = `«${level.story[storyIdx]}»`;
      bubble.title = 'Тапни, чтобы переслушать дальше';
    }
    bubble.append(chip, text);
    bubble.addEventListener('click', () => {
      if (puzzle.gone) return;
      reaction = null;
      storyIdx = (storyIdx + 1) % level.story.length;
      ctx.sfx?.('page');
      renderAll();
    });
    return bubble;
  }

  function renderAll() {
    scene.innerHTML = '';

    // Фон прилавка (арт), фолбэк — тёплый градиент из CSS
    const counterImg = document.createElement('img');
    counterImg.className = 'gift-counter-art';
    counterImg.alt = '';
    counterImg.addEventListener('error', () => counterImg.remove());
    counterImg.src = 'assets/gift/gift_counter_web.jpg';
    scene.appendChild(counterImg);

    // Гость: портрет с фолбэком на иконку + имя + речевой пузырь
    const guestBar = document.createElement('div');
    guestBar.className = 'fate-guest gift-guest';
    const portrait = document.createElement('div');
    portrait.className = 'fate-portrait';
    const pIcon = document.createElement('span');
    pIcon.className = 'fate-portrait-icon';
    pIcon.textContent = level.guest.icon;
    portrait.appendChild(pIcon);
    if (level.guest.art) {
      const pImg = document.createElement('img');
      pImg.className = 'fate-portrait-art';
      pImg.alt = level.guest.name;
      pImg.addEventListener('error', () => pImg.remove());
      pImg.src = level.guest.art;
      portrait.appendChild(pImg);
    }
    guestBar.appendChild(portrait);
    const gName = document.createElement('div');
    gName.className = 'fate-guest-name';
    gName.innerHTML = `<b>${level.guest.name}</b><div class="muted">ищет подарок</div>`;
    guestBar.appendChild(gName);
    guestBar.appendChild(renderBubble());
    scene.appendChild(guestBar);

    // Витрина: сетка сувениров (порядок перемешан при создании)
    const shelf = document.createElement('div');
    shelf.className = 'gift-shelf';
    puzzle.shelf.forEach((id) => {
      const s = SOUVENIRS[id];
      const item = document.createElement('div');
      item.className = 'gift-item clickable'
        + (puzzle.selected === id ? ' selected' : '')
        + (puzzle.hidden.includes(id) ? ' gift-hidden' : '');
      const iconBox = document.createElement('div');
      iconBox.className = 'gift-item-box';
      const icon = document.createElement('span');
      icon.className = 'gift-item-icon';
      icon.textContent = s.icon;
      iconBox.appendChild(icon);
      const img = document.createElement('img');
      img.className = 'gift-item-art';
      img.alt = s.name;
      img.addEventListener('error', () => img.remove());
      img.src = `assets/gift/souv_${id.replace(/^souv_/, '')}_web.jpg`;
      iconBox.appendChild(img);
      item.appendChild(iconBox);
      const name = document.createElement('div');
      name.className = 'gift-item-name';
      name.textContent = s.name;
      item.appendChild(name);
      if (puzzle.hidden.includes(id)) {
        const paw = document.createElement('div');
        paw.className = 'gift-item-paw';
        paw.textContent = '🐾';
        paw.title = 'Кот спрятал: точно не оно';
        item.appendChild(paw);
      }
      item.addEventListener('pointerenter', () => { if (!puzzle.hidden.includes(id)) showPreview(id); });
      item.addEventListener('pointerleave', () => { hidePreview(id); refreshPreview(); });
      item.addEventListener('click', () => {
        if (finished || checking || puzzle.gone) return;
        if (selectGift(puzzle, id)) {
          reaction = null;
          ctx.sfx?.('tap');
          renderAll();
          refreshPreview();
        }
      });
      shelf.appendChild(item);
    });
    scene.appendChild(shelf);

    // Кнопка действия сразу под витриной: вручить, а после ухода — переигровка
    const actionBtn = puzzle.gone ? btnRestart : btnGive;
    scene.appendChild(actionBtn);
    btnGive.disabled = checking || !puzzle.selected;

    // --- Статус ---
    const prog = giftProgress(puzzle);
    const factor = rewardFactor(puzzle);
    const tries = Array.from({ length: GIFT_MAX_TRIES }, (_, i) => (i < prog.tries ? '🕯️' : '🎁')).join(' ');
    statusEl.innerHTML =
      `🎁 Попытки: <b>${tries}</b>`
      + (factor >= 1
        ? ' · награда полная'
        : ` · награда: <b>${Math.round(factor * 100)}%</b>`)
      + `<div class="muted" style="font-size:13px">Условия спрятаны в истории гостя · Подсказки: ${hintsUsed}</div>`;

    refreshPreview();
  }

  renderAll();

  return () => {
    disposed = true;
    window.removeEventListener('keydown', onKey);
    for (const t of timers) clearTimeout(t);
  };
}
