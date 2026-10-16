// Экран головоломки «Чай для путника».
// Сцена со столом травницы: котёл (в него льётся цвет), стакан заказа,
// огонь под котлом по степени жара, чашечки ингредиентов.
// Без чисел: близость к заказу — метр сходства со словесными стадиями.
// Арт: assets/tea/tea_table_fire_N_web.jpg, tea_pot/tea_cup/tea_ing_<id>.png —
// без файлов работают эмодзи-фолбэки.
import {
  createTeaPuzzle, addIngredient, undoTea, resetTea,
  isTeaSolved, teaStatus, teaHint,
} from '../core/teaPuzzle.js';
import { completePuzzle, nextPuzzle } from '../core/state.js';
import { header, showOverlay, puzzleSkipButton, backToPuzzleType } from './common.js';

// Раскладка сцены (% от ширины/высоты фона) — подгоняется под арт стола
const TEA_SPOTS = {
  pot: { x: 23.5, y: 25, size: 26 }, // котёл висит в треноге
  fire: { x: 23.5, y: 61, size: 14 }, // огонь под котлом (фолбэк)
  cup: { x: 76, y: 34, size: 15 },   // стакан заказа
  ingsY: 84,                         // ряд чашечек ингредиентов
  ingsSize: 14,
  ingBig: { honey: 1.2 },            // миска мёда — чуть крупнее остальных
};

export function renderTeaPuzzle(container, ctx, level) {
  const puzzle = createTeaPuzzle(level);
  let hintsUsed = 0;
  let hintIngredient = null;
  let readyAnnounced = false;
  let finished = false;

  container.appendChild(header(ctx, level.name, `Сложность: ${'★'.repeat(level.difficulty)}`, ['puzzles', { mech: level.mechanic || 'mirror' }]));

  // --- Сцена со столом ---
  const scene = document.createElement('div');
  scene.className = 'tea-scene';
  // Фон-стол со встроенным огнём: вариант выбирается по жару котла
  let tableArt = true;
  let bgStage = -1;
  const bg = document.createElement('img');
  bg.className = 'tea-scene-bg';
  bg.alt = '';
  bg.addEventListener('error', () => {
    if (bgStage > 0) { bgStage = 0; bg.src = 'assets/tea/tea_table_fire_0_web.jpg'; return; }
    tableArt = false;
    bg.remove();
  });
  bgStage = 0;
  bg.src = 'assets/tea/tea_table_fire_0_web.jpg';
  scene.appendChild(bg);

  function spotEl(spot) {
    const el = document.createElement('div');
    el.className = 'tea-spot';
    el.style.cssText = `left:${spot.x}%;top:${spot.y}%;width:${spot.size}%`;
    return el;
  }
  function artImg(src, cls, fallback) {
    const img = document.createElement('img');
    img.className = cls;
    img.alt = '';
    img.src = src;
    if (fallback) {
      img.addEventListener('error', () => {
        img.remove();
        fallback();
      });
    }
    return img;
  }

  // Котёл: чаша с цветом отвара + арт котла поверх (центр арта прозрачен)
  // Геометрия окна известна из обработки (эллипс 0.5/0.5 r=0.28 от полного кадра)
  const potSpot = spotEl(TEA_SPOTS.pot);
  const potColor = document.createElement('div');
  potColor.className = 'tea-pot-color';
  potSpot.appendChild(potColor);
  potSpot.appendChild(artImg('assets/tea/tea_pot.png', 'tea-pot-art', () => {
    potSpot.classList.add('tea-noart');
    potSpot.appendChild(Object.assign(document.createElement('div'), { className: 'tea-emoji', textContent: '🫖' }));
  }));
  scene.appendChild(potSpot);

  // Огонь под котлом — эмодзи-фолбэк, если арта стола нет
  const fireSpot = spotEl(TEA_SPOTS.fire);
  scene.appendChild(fireSpot);

  // Стакан заказа путника
  const cupSpot = spotEl(TEA_SPOTS.cup);
  const cupColor = document.createElement('div');
  cupColor.className = 'tea-cup-color';
  cupColor.style.background = rgbCss(level.target);
  cupSpot.appendChild(cupColor);
  cupSpot.appendChild(artImg('assets/tea/tea_cup.png', 'tea-cup-art', () => {
    cupSpot.appendChild(Object.assign(document.createElement('div'), { className: 'tea-emoji', textContent: '🍷' }));
  }));
  scene.appendChild(cupSpot);

  // Кнопка подачи под стаканом. Кликабельна всегда: не готово — ответит
  // подсказкой (disabled-кнопка молча глотала бы первый клик).
  const serveBtn = document.createElement('button');
  serveBtn.className = 'tea-serve not-ready';
  serveBtn.textContent = '🫖 Подать путнику';
  serveBtn.addEventListener('click', () => {
    if (finished) return;
    if (isTeaSolved(puzzle)) { finish(); return; }
    ctx.sfx?.('tap');
    ctx.toast('Отвар ещё не готов — сверь цвет с заказом и жар котла.');
  });
  scene.appendChild(serveBtn);
  // Чашечки ингредиентов: компактной группой по центру ряда мисок
  const ingEls = new Map();
  level.ingredients.forEach((ing, i) => {
    const n = level.ingredients.length;
    const x = 50 + (i - (n - 1) / 2) * Math.min(11, 88 / n);
    const size = TEA_SPOTS.ingsSize * (TEA_SPOTS.ingBig[ing.id] || 1);
    const spot = { x, y: TEA_SPOTS.ingsY, size };
    const el = spotEl(spot);
    el.classList.add('tea-ing-spot');
    el.title = ing.name;
    // Влияние на цвет/жар — НАД миской (не мешает соседям)
    const top = document.createElement('div');
    top.className = 'tea-ing-top';
    el.appendChild(top);
    el.appendChild(artImg(`assets/tea/tea_ing_${ing.id}.png`, 'tea-ing-art', () => {
      el.appendChild(Object.assign(document.createElement('div'), { className: 'tea-emoji ing', textContent: ing.icon }));
    }));
    const meta = document.createElement('div');
    meta.className = 'tea-ing-meta';
    el.appendChild(meta);
    el.addEventListener('click', () => onAdd(ing.id));
    scene.appendChild(el);
    ingEls.set(ing.id, { el, meta, top, tint: tintCss(ing), heat: heatIcons(ing.heat) });
  });
  container.appendChild(scene);

  // Под сценой: метр сходства + жар словами
  const bars = document.createElement('div');
  bars.className = 'panel tea-bars';

  const simBox = document.createElement('div');
  simBox.style.cssText = 'flex:1;min-width:180px';
  simBox.innerHTML = '<div class="muted" style="font-size:12px;margin-bottom:4px">Сходство с заказом</div>';
  const simBar = document.createElement('div');
  simBar.className = 'hpbar';
  simBar.style.height = '14px';
  const simFill = document.createElement('div');
  simFill.style.cssText = 'background:#8ba35f;transition:width .3s ease';
  simBar.appendChild(simFill);
  const simLabel = document.createElement('div');
  simLabel.style.cssText = 'font-size:14px;margin-top:4px;font-weight:700;color:#c9b48a';
  simBox.append(simBar, simLabel);
  bars.appendChild(simBox);

  const heatBox = document.createElement('div');
  heatBox.style.cssText = 'flex:1;min-width:180px';
  heatBox.innerHTML = '<div class="muted" style="font-size:12px;margin-bottom:4px">Жар котла</div>';
  const heatBar = document.createElement('div');
  heatBar.className = 'hpbar';
  heatBar.style.cssText = 'height:14px;position:relative';
  const heatFill = document.createElement('div');
  heatFill.style.background = '#e88a7a';
  heatBar.appendChild(heatFill);
  // Зона заказа жара: красная за перегревом, синяя до «слишком холодно»
  if (level.minHeat > 0) {
    const coldZone = document.createElement('div');
    coldZone.style.cssText = `position:absolute;top:0;bottom:0;left:0;width:${level.minHeat}%;
      background:rgba(122,178,230,0.3);border-right:2px solid #7ab2e6;pointer-events:none`;
    heatBar.appendChild(coldZone);
  }
  const heatZone = document.createElement('div');
  heatZone.style.cssText = `position:absolute;top:0;bottom:0;right:0;width:${100 - level.maxHeat}%;
    background:rgba(217,67,47,0.35);border-left:2px solid #d9432f;pointer-events:none`;
  heatBar.appendChild(heatZone);
  const heatMark = document.createElement('div');
  heatMark.className = 'muted';
  heatMark.style.fontSize = '12px';
  heatBox.append(heatBar, heatMark);
  bars.appendChild(heatBox);
  container.appendChild(bars);

  const statusEl = document.createElement('div');
  statusEl.className = 'puzzle-status';
  container.appendChild(statusEl);

  const controls = document.createElement('div');
  controls.className = 'puzzle-controls';
  controls.style.marginTop = '10px';
  const btnUndo = mkBtn('↩️ Отмена (Z)', doUndo);
  const btnHint = mkBtn('💡 Подсказка (H)', doHint);
  const btnReset = mkBtn('🔄 Заново (R)', doReset);
  controls.append(btnUndo, btnHint, btnReset);
  controls.appendChild(puzzleSkipButton(ctx, level, () => backToPuzzleType(ctx, level)));
  container.appendChild(controls);

  function mkBtn(label, fn) {
    const b = document.createElement('button');
    b.innerHTML = label;
    b.addEventListener('click', fn);
    return b;
  }

  function rgbCss(c) {
    return `rgb(${Math.round(c.r * 2.55)}, ${Math.round(c.g * 2.55)}, ${Math.round(c.b * 2.55)})`;
  }

  // Капля-оттенок ингредиента: к какому цвету он тянет отвар (без чисел)
  function tintCss(ing) {
    const max = Math.max(Math.abs(ing.dr), Math.abs(ing.dg), Math.abs(ing.db));
    if (max === 0) return null; // нейтральные (вода) — без капли
    const k = 200 / max;
    return `rgb(${Math.round(Math.max(0, ing.dr) * k * 1.27)}, ${Math.round(Math.max(0, ing.dg) * k * 1.27)}, ${Math.round(Math.max(0, ing.db) * k * 1.27)})`;
  }

  // Жар иконками: одна на каждые ~5 единиц
  function heatIcons(heat) {
    if (!heat) return '';
    const n = Math.max(1, Math.round(Math.abs(heat) / 5));
    return (heat > 0 ? '🔥' : '❄️').repeat(n);
  }

  function similarity(st) {
    const worst = Math.max(st.diffs.r, st.diffs.g, st.diffs.b);
    if (worst <= level.tolerance) return 100;
    return Math.max(0, Math.round(100 * (1 - (worst - level.tolerance) / 40)));
  }

  function simStage(sim, st) {
    if (st.overheated) return '🥵 Перегрет! Наливать нельзя';
    if (st.tooCold) return '🥶 Остыл ниже заказа — подогрей';
    if (sim >= 100) return '✨ В самый раз — подавай!';
    if (sim >= 85) return 'Почти то самое!';
    if (sim >= 60) return 'Пахнет похоже';
    if (sim >= 30) return 'Отдалённо похоже';
    return 'Далеко от заказа';
  }

  function heatWord(st) {
    if (st.overheated) return 'Перегрет! Такой отвар путник не возьмёт.';
    if (st.tooCold) return 'Прохладно — путник просит горячего.';
    if (st.heat >= st.maxHeat * 0.75) return 'Горячо — осторожнее с огненным.';
    if (st.heat >= st.maxHeat * 0.4) return 'Тепло, в самый раз.';
    return st.minHeat > 0 ? 'Пока холодновато для этого заказа.' : 'Прохладно.';
  }

  // Степень огня под котлом: 0 — нет, 1 — язычки, 2 — средний, 3 — бурный
  function fireStage(heat) {
    if (heat <= 5) return 0;
    if (heat <= 35) return 1;
    if (heat <= 70) return 2;
    return 3;
  }

  function doUndo() {
    if (finished) return;
    if (undoTea(puzzle)) { hintIngredient = null; ctx.sfx?.('tap'); draw(); }
  }
  function doReset() {
    if (finished) return;
    resetTea(puzzle);
    hintIngredient = null;
    readyAnnounced = false;
    ctx.sfx?.('tap');
    draw();
  }
  function doHint() {
    if (finished) return;
    const h = teaHint(puzzle);
    ctx.sfx?.('hint');
    if (h.type === 'add') {
      hintsUsed += 1;
      hintIngredient = h.ingredientId;
      ctx.toast(`Кот-хранитель толкает носом: ${h.icon} ${h.name}`);
      draw();
    } else if (h.type === 'reset') {
      ctx.toast(h.text);
    } else if (h.type === 'already') {
      ctx.toast('Отвар уже идеален — подавай!');
    } else {
      ctx.toast('Хм, рецепт не сходится. Скажи хозяину лавки!');
    }
  }

  function onAdd(ingId) {
    if (finished) return;
    const r = addIngredient(puzzle, ingId);
    if (r.ok) {
      hintIngredient = null;
      ctx.sfx?.('potion');
      draw();
      potSpot.classList.add('tea-swirl');
      setTimeout(() => potSpot.classList.remove('tea-swirl'), 400);
      if (isTeaSolved(puzzle) && !readyAnnounced) {
        readyAnnounced = true;
        ctx.toast('✨ Отвар в самый раз — можно подавать!');
        ctx.sfx?.('success');
      }
      if (!isTeaSolved(puzzle)) readyAnnounced = false;
    } else {
      ctx.toast(r.error);
    }
  }

  function onKey(ev) {
    if (ev.key === 'z' || ev.key === 'Z' || (ev.ctrlKey && ev.key === 'z')) { ev.preventDefault(); doUndo(); }
    if (ev.key === 'h' || ev.key === 'H' || ev.key === 'р' || ev.key === 'Р') doHint();
    if (ev.key === 'r' || ev.key === 'R' || ev.key === 'к' || ev.key === 'К') doReset();
    if (ev.key === 'Escape') backToPuzzleType(ctx, level);
  }
  window.addEventListener('keydown', onKey);

  function finish() {
    if (finished) return; // защита от двойной подачи (клик + повторный)
    finished = true;
    const rewards = completePuzzle(ctx.state, level.id, { moves: puzzle.moves, hintsUsed });
    ctx.save();
    ctx.sfx?.('success');
    draw();
    setTimeout(() => {
      const next = nextPuzzle(level.id);
      showOverlay(ctx, {
        title: '🫖 Отвар подан!',
        subtitle: `«${level.name}» — путник благодарит`,
        rewards,
        buttons: [
          ...(next ? [{ label: `Следующая → ${next.name}`, primary: true, onClick: () => ctx.go('puzzle', { id: next.id }) }] : []),
          { label: 'К загадкам', primary: !next, onClick: () => backToPuzzleType(ctx, level) },
          { label: 'Ещё раз', onClick: () => ctx.go('puzzle', { id: level.id }) },
          { label: 'В лавку', onClick: () => ctx.go('hub') },
        ],
      });
    }, 450);
  }

  function draw() {
    const st = teaStatus(puzzle);

    // Цвет отвара в чаше котла
    potColor.style.background = rgbCss(puzzle.color);
    potSpot.classList.toggle('tea-ready', st.solved);
    potSpot.classList.toggle('tea-hot', st.overheated);

    // Огонь: встроен в арт стола (вариант по жару) или эмодзи-фолбэк
    const stage = fireStage(st.heat);
    if (tableArt) {
      if (stage !== bgStage) {
        bgStage = stage;
        bg.src = `assets/tea/tea_table_fire_${stage}_web.jpg`;
      }
    } else {
      let fe = fireSpot.querySelector('.tea-emoji.fire');
      if (!fe) {
        fe = document.createElement('div');
        fe.className = 'tea-emoji fire';
        fireSpot.appendChild(fe);
      }
      fe.textContent = '🔥'.repeat(stage);
      fireSpot.style.opacity = stage === 0 ? '0.25' : '1';
    }

    // Метр сходства
    const sim = similarity(st);
    simFill.style.width = `${sim}%`;
    simFill.style.background = sim >= 100 ? '#ffca7a' : '#8ba35f';
    simLabel.textContent = simStage(sim, st);

    // Жар словами
    heatFill.style.width = `${st.heat}%`;
    heatFill.style.background = st.overheated ? '#d9432f' : '#e88a7a';
    heatMark.textContent = heatWord(st);

    // Кнопка подачи: светится при готовности, кликабельна всегда
    serveBtn.classList.toggle('not-ready', !st.solved);
    serveBtn.classList.toggle('pulse', st.solved);

    // Чашечки: влияние над миской, имя и порции под ней
    for (const ing of level.ingredients) {
      const { el, meta, top, tint, heat } = ingEls.get(ing.id);
      const left = ing.uses - (puzzle.used[ing.id] || 0);
      el.classList.toggle('empty', left <= 0);
      el.classList.toggle('hint-ring', hintIngredient === ing.id);
      top.innerHTML = (tint ? `<span class="tea-tint" style="background:${tint}"></span>` : '')
        + (heat ? `<span class="tea-heat">${heat}</span>` : '');
      meta.innerHTML = `${ing.name} <span class="tea-uses">${'●'.repeat(left)}${'○'.repeat(ing.uses - left)}</span>`;
    }

    // Статус
    statusEl.innerHTML =
      (st.solved ? '✅ <b>Идеальный отвар!</b>' : `🎯 Сходство: <b>${sim}%</b>`)
      + `<div class="muted" style="font-size:13px">Ходы: ${puzzle.moves} · Подсказки: ${hintsUsed}</div>`;
  }

  draw();

  return () => {
    window.removeEventListener('keydown', onKey);
  };
}
