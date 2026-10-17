// Настройки игры: секции со строками-тумблерами, действия отдельно от переключателей.
import { header } from './common.js';
import { toggleSound, soundEnabled, toggleMusic, musicEnabled } from './sound.js';
import { applyCheat } from '../core/state.js';
import { createPuzzleCatalogModePicker } from './puzzleCatalogView.js';
import { CURSOR_THEMES, applyCursor, cursorMode, fixedCursorTheme } from './cursors.js';

function makeSection(title, danger = false) {
  const sec = document.createElement('div');
  sec.className = danger ? 'panel set-danger' : 'panel set-section';
  const h = document.createElement('h3');
  h.textContent = title;
  sec.appendChild(h);
  return sec;
}

function makeToggleRow({ name, hint, get, flip }) {
  const row = document.createElement('div');
  row.className = 'set-row';
  const text = document.createElement('div');
  text.className = 'set-text';
  const nm = document.createElement('div');
  nm.className = 'set-name';
  nm.textContent = name;
  text.appendChild(nm);
  if (hint) {
    const h = document.createElement('div');
    h.className = 'set-hint';
    h.textContent = hint;
    text.appendChild(h);
  }
  const btn = document.createElement('button');
  btn.className = 'set-toggle';
  btn.setAttribute('aria-label', name);
  const paint = (on) => {
    btn.classList.toggle('on', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  };
  paint(get());
  btn.addEventListener('click', () => paint(flip()));
  row.append(text, btn);
  return row;
}

function makeActionRow({ name, hint, btnText, onClick }) {
  const row = document.createElement('div');
  row.className = 'set-row';
  const text = document.createElement('div');
  text.className = 'set-text';
  const nm = document.createElement('div');
  nm.className = 'set-name';
  nm.textContent = name;
  text.appendChild(nm);
  if (hint) {
    const h = document.createElement('div');
    h.className = 'set-hint';
    h.textContent = hint;
    text.appendChild(h);
  }
  const btn = document.createElement('button');
  btn.className = 'ghost';
  btn.textContent = btnText;
  btn.addEventListener('click', onClick);
  row.append(text, btn);
  return row;
}

export function renderSettings(container, ctx) {
  const { state } = ctx;
  container.appendChild(header(ctx, 'Настройки', 'Лавка подстраивается под хозяина'));

  const soundSec = makeSection('🔊 Звук');
  soundSec.appendChild(makeToggleRow({
    name: 'Звуковые эффекты',
    hint: 'Шаги кота, звон монет и победные фанфары.',
    get: () => soundEnabled(),
    flip: () => {
      const on = toggleSound();
      if (on) ctx.sfx?.('coin');
      return on;
    },
  }));
  soundSec.appendChild(makeToggleRow({
    name: 'Музыка',
    hint: 'Тихий дождь и уютный фон в лавке.',
    get: () => musicEnabled(),
    flip: () => toggleMusic(),
  }));
  container.appendChild(soundSec);

  const storySec = makeSection('📖 История');
  storySec.appendChild(makeToggleRow({
    name: 'Режим истории',
    hint: 'В лавке ждёт гость с заданием: история сама подсовывает головоломки всех типов по очереди.',
    get: () => state.settings.storyMode !== false,
    flip: () => {
      state.settings.storyMode = state.settings.storyMode === false;
      ctx.save();
      ctx.sfx?.('tap');
      return state.settings.storyMode !== false;
    },
  }));
  container.appendChild(storySec);

  const puzzleSec = makeSection('🧩 Головоломки');
  const catalogBox = document.createElement('div');
  catalogBox.className = 'pc-settings-catalog';
  const catalogLabel = document.createElement('div');
  catalogLabel.className = 'pc-layout-label';
  catalogLabel.textContent = 'Вид каталога головоломок';
  catalogBox.append(catalogLabel, createPuzzleCatalogModePicker(ctx));
  puzzleSec.appendChild(catalogBox);
  puzzleSec.appendChild(makeToggleRow({
    name: 'Книга рецептов всегда открыта',
    hint: 'В варке зелий рецепт не прячется: без тренировки памяти. Награды прежние.',
    get: () => !!state.settings.keepBookOpen,
    flip: () => {
      state.settings.keepBookOpen = !state.settings.keepBookOpen;
      ctx.save();
      ctx.sfx?.('tap');
      return state.settings.keepBookOpen;
    },
  }));
  container.appendChild(puzzleSec);

  const cursorSec = makeSection('🖱️ Курсоры');
  const CURSOR_MODES = [
    { id: 'system', name: 'Системный', icon: '🖱️', hint: 'Обычная стрелка браузера везде' },
    { id: 'themed', name: 'Тематические', icon: '🎭', hint: 'Свой курсор у каждого режима игры' },
    { id: 'fixed', name: 'Один везде', icon: '📌', hint: 'Один выбранный курсор на всю игру' },
  ];
  const cursorPicker = document.createElement('div');
  cursorPicker.className = 'pc-mode-picker set-cursor-modes';
  cursorPicker.setAttribute('role', 'group');
  cursorPicker.setAttribute('aria-label', 'Режим курсора');
  const themeGrid = document.createElement('div');
  themeGrid.className = 'set-cursor-grid';
  const syncCursorUI = () => {
    const mode = cursorMode(state);
    for (const b of cursorPicker.children) {
      const active = b.dataset.mode === mode;
      b.className = `small pc-mode-option${active ? ' primary is-active' : ' ghost'}`;
      b.setAttribute('aria-pressed', String(active));
    }
    themeGrid.style.display = mode === 'fixed' ? '' : 'none';
    const current = fixedCursorTheme(state);
    for (const chip of themeGrid.children) {
      const active = chip.dataset.theme === current;
      chip.className = `small set-cursor-chip${active ? ' primary is-active' : ' ghost'}`;
      chip.setAttribute('aria-pressed', String(active));
    }
  };
  for (const mode of CURSOR_MODES) {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.mode = mode.id;
    b.textContent = `${mode.icon} ${mode.name}`;
    b.title = mode.hint;
    b.addEventListener('click', () => {
      if (cursorMode(state) === mode.id) return;
      state.settings.cursorMode = mode.id;
      ctx.save();
      ctx.sfx?.('tap');
      syncCursorUI();
      applyCursor('settings', {}, state);
    });
    cursorPicker.appendChild(b);
  }
  for (const [key, t] of Object.entries(CURSOR_THEMES)) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.dataset.theme = key;
    chip.textContent = `${t.icon} ${t.name}`;
    chip.addEventListener('click', () => {
      if (fixedCursorTheme(state) === key) return;
      state.settings.cursorTheme = key;
      ctx.save();
      ctx.sfx?.('tap');
      syncCursorUI();
      applyCursor('settings', {}, state); // живой предпросмотр: курсор меняется сразу
    });
    themeGrid.appendChild(chip);
  }
  const cursorHint = document.createElement('div');
  cursorHint.className = 'set-hint';
  cursorHint.textContent = 'Лупа в поиске, колба в варке, меч в походе. В режиме «Один везде» выбранный курсор виден сразу.';
  cursorSec.append(cursorPicker, cursorHint, themeGrid);
  syncCursorUI();
  container.appendChild(cursorSec);

  const helpSec = makeSection('🐈 Помощь');
  helpSec.appendChild(makeActionRow({
    name: 'Обучение',
    hint: 'Кот-хранитель снова проведёт по лавке и всё покажет.',
    btnText: '🐈 Показать обучение снова',
    onClick: () => {
      state.tutorial = {};
      state.tutorialSkipped = false;
      ctx.save();
      ctx.toast('Кот-хранитель снова будет вести тебя. Начнём с лавки!');
      ctx.go('hub');
    },
  }));
  container.appendChild(helpSec);

  const dangerSec = makeSection('⚠️ Опасная зона', true);
  dangerSec.appendChild(makeActionRow({
    name: 'Новая игра',
    hint: 'Весь прогресс лавки будет стёрт. Сначала спросит подтверждение.',
    btnText: '🕯️ Начать новую игру',
    onClick: () => ctx.newGameConfirm(),
  }));
  container.appendChild(dangerSec);

  // --- Потайное место: версия. Пять тапов открывают чит-коды. ---
  const secret = document.createElement('div');
  secret.className = 'muted center';
  secret.style.cssText = 'font-size:12px;margin-top:6px;user-select:none;cursor:default';
  let taps = 0;
  let revealed = false;
  const renderSecret = () => {
    secret.textContent = `Лавка на перекрёстке миров · версия 0.9 · 🕯️${taps > 0 && taps < 5 ? ' · …' + taps : ''}`;
  };
  renderSecret();
  secret.addEventListener('click', () => {
    if (revealed) return;
    taps += 1;
    if (taps >= 5) {
      revealed = true;
      revealCheats();
    } else {
      ctx.sfx?.('tap');
      renderSecret();
    }
  });
  container.appendChild(secret);

  function revealCheats() {
    const box = document.createElement('div');
    box.className = 'panel';
    box.innerHTML = `<h3>🤫 Тайная комната</h3>
      <div class="muted" style="font-size:13px">Чит-коды для тестирования и быстрого пропуска. Вводи слово и жми «Сказать».</div>`;
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:8px;margin-top:10px';
    const input = document.createElement('input');
    input.placeholder = 'чит-код…';
    input.style.cssText = 'font:inherit;padding:8px 12px;border-radius:10px;border:2px solid #6b553a;background:#241b12;color:#f3e6cf;flex:1';
    const say = document.createElement('button');
    say.className = 'primary small';
    say.textContent = 'Сказать';
    const run = () => {
      const r = applyCheat(state, input.value);
      ctx.toast(r.message);
      if (r.ok) { ctx.sfx?.('success'); ctx.save(); }
      input.value = '';
      input.focus();
    };
    say.addEventListener('click', run);
    input.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') run(); });
    row.append(input, say);
    box.appendChild(row);
    if ((state.cheats?.used || []).length > 0) {
      const used = document.createElement('div');
      used.className = 'muted mt';
      used.style.fontSize = '12px';
      used.textContent = `Уже шепталось: ${state.cheats.used.join(' · ')}`;
      box.appendChild(used);
    }
    secret.replaceWith(box);
    input.focus();
  }
}
