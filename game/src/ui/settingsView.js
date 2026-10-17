// Настройки игры: секции со строками-тумблерами, действия отдельно от переключателей.
import { header } from './common.js';
import { toggleSound, soundEnabled, toggleMusic, musicEnabled } from './sound.js';
import { applyCheat } from '../core/state.js';
import { createPuzzleCatalogModePicker } from './puzzleCatalogView.js';

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
