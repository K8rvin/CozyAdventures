// Настройки игры: режим боя, звук, обучение, новая игра и тайные места.
import { header } from './common.js';
import { toggleSound, soundEnabled, toggleMusic, musicEnabled } from './sound.js';
import { applyCheat } from '../core/state.js';

export function renderSettings(container, ctx) {
  const { state } = ctx;
  container.appendChild(header(ctx, 'Настройки', 'Лавка подстраивается под хозяина'));

  const panel = document.createElement('div');
  panel.className = 'panel';

  // --- Режим боя ---
  const modeTitle = document.createElement('h3');
  modeTitle.textContent = 'Режим боя';
  panel.appendChild(modeTitle);

  const modes = [
    {
      id: 'formation', icon: '⚔️', name: 'Сбор (поле боя)',
      desc: 'Ряды и порядок бойцов: танки вперёд, стрелки назад. Расстановка перед боем, фигурки, выстрелы и удары.',
    },
    {
      id: 'classic', icon: '📜', name: 'Простой',
      desc: 'Спокойный автобой: лог событий и карточки юнитов. Как было изначально.',
    },
  ];
  for (const m of modes) {
    const row = document.createElement('div');
    row.className = 'row' + (state.settings.battleMode === m.id ? ' done' : '');
    row.style.cursor = 'pointer';
    row.innerHTML = `
      <span class="icon">${m.icon}</span>
      <span class="grow">
        <div class="name">${m.name}</div>
        <div class="desc">${m.desc}</div>
      </span>
      <span class="price">${state.settings.battleMode === m.id ? '✓' : ''}</span>`;
    row.addEventListener('click', () => {
      state.settings.battleMode = m.id;
      ctx.sfx?.('tap');
      ctx.save();
      rerender();
    });
    panel.appendChild(row);
  }

  // --- Звук ---
  const soundTitle = document.createElement('h3');
  soundTitle.textContent = 'Звук';
  soundTitle.style.marginTop = '16px';
  panel.appendChild(soundTitle);
  const soundBtn = document.createElement('button');
  soundBtn.textContent = soundEnabled() ? '🔔 Звук включён' : '🔕 Звук выключен';
  soundBtn.addEventListener('click', () => {
    const on = toggleSound();
    soundBtn.textContent = on ? '🔔 Звук включён' : '🔕 Звук выключен';
    if (on) ctx.sfx?.('coin');
  });
  const musicBtn = document.createElement('button');
  musicBtn.textContent = musicEnabled() ? '🎵 Музыка включена' : '🎵 Музыка выключена';
  musicBtn.style.marginLeft = '8px';
  musicBtn.addEventListener('click', () => {
    const on = toggleMusic();
    musicBtn.textContent = on ? '🎵 Музыка включена' : '🎵 Музыка выключена';
  });
  panel.append(soundBtn, musicBtn);

  // --- Обучение ---
  const tutTitle = document.createElement('h3');
  tutTitle.textContent = 'Обучение';
  tutTitle.style.marginTop = '16px';
  panel.appendChild(tutTitle);
  const tutBtn = document.createElement('button');
  tutBtn.className = 'ghost';
  tutBtn.textContent = '🐈 Показать обучение снова';
  tutBtn.addEventListener('click', () => {
    state.tutorial = {};
    state.tutorialSkipped = false;
    ctx.save();
    ctx.toast('Кот-хранитель снова будет вести тебя. Начнём с лавки!');
    ctx.go('hub');
  });
  panel.appendChild(tutBtn);

  // --- Новая игра (переехала сюда с главной) ---
  const newTitle = document.createElement('h3');
  newTitle.textContent = 'Лавка';
  newTitle.style.marginTop = '16px';
  panel.appendChild(newTitle);
  const newBtn = document.createElement('button');
  newBtn.className = 'ghost';
  newBtn.textContent = '🕯️ Начать новую игру';
  newBtn.addEventListener('click', () => ctx.newGameConfirm());
  panel.appendChild(newBtn);

  container.appendChild(panel);

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

  function rerender() {
    container.innerHTML = '';
    renderSettings(container, ctx);
  }
}
