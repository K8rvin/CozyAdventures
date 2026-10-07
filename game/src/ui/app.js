// Роутер экранов и общий контекст UI.
import { newGame, saveGame, loadGame } from '../core/state.js';
import { renderHub } from './hub.js';
import { renderPuzzleList, renderPuzzle } from './puzzleView.js';
import { renderEquip } from './equipView.js';
import { renderShop } from './shopView.js';
import { renderBattleList, renderBattle } from './battleView.js';
import { renderTavern } from './tavernView.js';
import { renderEditor, renderWorkshop } from './editorView.js';
import { renderCraft } from './craftView.js';
import { renderSettings } from './settingsView.js';
import { renderFormation } from './formationView.js';
import { renderSeekEditorList, renderSeekEditor } from './seekEditorView.js';
import { initSound, sfx } from './sound.js';

const screenEl = document.getElementById('screen');
const toastEl = document.getElementById('toast');

let state = loadGame() || newGame();

function save() {
  saveGame(state);
  updateWallet();
}

function updateWallet() {
  document.getElementById('wallet-coins').textContent = `🪙 ${state.coins}`;
  document.getElementById('wallet-seals').textContent = `🔰 ${state.seals}`;
}

let toastTimer = null;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
}

let lastHubScene = 'lavka';

const routes = {
  hub: (c, p) => renderHub(c, ctx, { scene: p.scene || lastHubScene }),
  puzzles: (c, p) => renderPuzzleList(c, ctx, p),
  puzzle: (c, p) => renderPuzzle(c, ctx, p),
  equip: (c, p) => renderEquip(c, ctx, p),
  shop: (c, p) => renderShop(c, ctx, p),
  battles: (c, p) => renderBattleList(c, ctx, p),
  battle: (c, p) => (state.settings?.battleMode === 'formation'
    ? renderFormation(c, ctx, p)
    : renderBattle(c, ctx, p)),
  tavern: (c, p) => renderTavern(c, ctx, p),
  workshop: (c, p) => renderWorkshop(c, ctx, p),
  editor: (c, p) => renderEditor(c, ctx, p),
  craft: (c, p) => renderCraft(c, ctx, p),
  settings: (c, p) => renderSettings(c, ctx, p),
  seekeditor: (c, p) => (p.id ? renderSeekEditor(c, ctx, p) : renderSeekEditorList(c, ctx, p)),
};

let currentCleanup = null;

function go(name, params = {}) {
  if (currentCleanup) { currentCleanup(); currentCleanup = null; }
  screenEl.innerHTML = '';
  // Плавный переход между экранами
  screenEl.classList.remove('screen-enter');
  void screenEl.offsetWidth;
  screenEl.classList.add('screen-enter');
  const route = routes[name] || routes.hub;
  currentCleanup = route(screenEl, params) || null;
  window.scrollTo(0, 0);
}

function newGameConfirm() {
  if (confirm('Начать новую игру? Прогресс текущей лавки будет стёрт.')) {
    state = newGame();
    save();
    go('hub');
    toast('Новая лавка открыта. Добро пожаловать, хозяин!');
  }
}

const ctx = {
  get state() { return state; },
  save, go, toast, newGameConfirm,
  sfx,
  setHubScene(scene) { lastHubScene = scene; },
};

// Звук инициализируется по первому взаимодействию (требование браузеров).
initSound();

// Паучок = скроллбар: паутина прибита к верху трека, паучок плавно спускается.
const spiderTrack = document.createElement('div');
spiderTrack.id = 'spidertrack';
spiderTrack.innerHTML = '<span class="thread"></span><div class="mover"><span class="bug">🕷️</span></div>';
document.body.appendChild(spiderTrack);
const spiderThread = spiderTrack.querySelector('.thread');
const spiderMover = spiderTrack.querySelector('.mover');
const spiderBug = spiderTrack.querySelector('.bug');

function scrollInfo() {
  const docH = document.documentElement.scrollHeight || 0;
  const viewH = window.innerHeight || 0;
  const max = Math.max(0, docH - viewH);
  return { docH, viewH, max, ratio: max > 0 ? Math.min(1, Math.max(0, (window.scrollY || 0) / max)) : 0 };
}

// Плавное движение: цель обновляется по скроллу, паучок догоняет через lerp.
const BUG_H = 34;
let targetY = 0;
let shownY = 0;
let spiderRaf = null;

function computeTargetY() {
  const { viewH, ratio } = scrollInfo();
  return ratio * Math.max(0, viewH - BUG_H - 8) + 4;
}

function renderSpider() {
  // Клэмп, чтобы паучок никогда не уходил за пределы экрана
  const y = Math.max(0, Math.min(shownY, (window.innerHeight || 600) - BUG_H));
  spiderMover.style.transform = `translateY(${y}px)`;
  spiderThread.style.height = `${Math.max(0, y + 8)}px`;
  // Пасхалка: праздничная шляпа из чит-кода ПАУЧОК
  const hat = !!state.cheats?.spiderHat;
  if (spiderBug.dataset.hat !== String(hat)) {
    spiderBug.dataset.hat = String(hat);
    spiderBug.textContent = hat ? '🎩🕷️' : '🕷️';
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
  if (docH <= viewH + 40) { spiderTrack.style.display = 'none'; return; }
  spiderTrack.style.display = 'block';
  targetY = computeTargetY();
  if (!spiderRaf) spiderRaf = raf(spiderLoop);
}

function scrollToRatio(ratio, smooth = true) {
  const { max } = scrollInfo();
  window.scrollTo({ top: Math.max(0, Math.min(1, ratio)) * max, behavior: smooth ? 'smooth' : 'auto' });
}

// Перетаскивание паучка — скроллит страницу
let dragging = false;
spiderBug.addEventListener('pointerdown', (ev) => {
  dragging = true;
  spiderTrack.classList.add('dragging');
  spiderBug.setPointerCapture?.(ev.pointerId);
  ev.preventDefault();
});
window.addEventListener('pointermove', (ev) => {
  if (!dragging) return;
  const { viewH } = scrollInfo();
  const ratio = (ev.clientY - 20) / Math.max(1, viewH - BUG_H - 24);
  scrollToRatio(ratio, false);
  shownY = targetY = Math.max(4, Math.min(ev.clientY - 12, viewH - BUG_H));
  renderSpider();
});
window.addEventListener('pointerup', () => {
  dragging = false;
  spiderTrack.classList.remove('dragging');
  kickSpider();
});
// Клик по треку (не по паучку) — прыжок
spiderTrack.addEventListener('pointerdown', (ev) => {
  if (ev.target === spiderBug || dragging) return;
  const { viewH } = scrollInfo();
  scrollToRatio((ev.clientY - 20) / Math.max(1, viewH - BUG_H - 24), true);
});

const raf = window.requestAnimationFrame?.bind(window) || ((f) => setTimeout(f, 16));
kickSpider(); // стартовая позиция
window.addEventListener('scroll', () => { if (!dragging) kickSpider(); });
window.addEventListener('resize', () => { targetY = computeTargetY(); shownY = targetY; renderSpider(); kickSpider(); });
// контент меняет высоту при переходах; unref — чтобы не держать Node-процесс в тестах
const spiderTimer = setInterval(() => {
  const { ratio } = scrollInfo();
  if (ratio > 0.985) {
    spiderTrack.classList.add('boing');
    setTimeout(() => spiderTrack.classList.remove('boing'), 550);
  }
  kickSpider();
}, 700);
spiderTimer.unref?.();

document.getElementById('settings-btn')?.addEventListener('click', () => { sfx('tap'); go('settings'); });

// Пасхалка «Об игре»: три стука по вывеске лавки.
const brandEl = document.querySelector('.brand');
let brandTaps = 0;
let brandTimer = null;
brandEl.style.cursor = 'pointer';
brandEl.addEventListener('click', () => {
  brandTaps += 1;
  sfx('tap');
  clearTimeout(brandTimer);
  brandTimer = setTimeout(() => { brandTaps = 0; }, 900);
  if (brandTaps >= 3) {
    brandTaps = 0;
    showAbout();
  }
});

function showAbout() {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = `
    <div class="card" style="text-align:left">
      <h2 style="text-align:center">🏮 Лавка на перекрёстке миров</h2>
      <div class="muted center" style="margin-bottom:10px">версия 0.9 · уютная игра-магазин с приключениями</div>
      <p><b>Автор:</b> K8rvin (Андрей)</p>
      <p><b>Сделано:</b> вдвоём — человек и ИИ-агент Kimi Code.
      Чистый JavaScript, Canvas, SVG-арт, локальные сохранения. Ни строчки бэкенда.</p>
      <p><b>Внутри:</b> 6 механик головоломок · 58 загадок · 200 боёв в 12 мирах ·
      60+ существ · крафт · отряд · два режима автобоя · и один очень трудолюбивый паучок 🕷️</p>
      <p class="muted">Спасибо, что заглянул на перекрёсток. Стучи по вывеске в любое время.</p>
      <div class="actions" style="text-align:center"></div>
    </div>`;
  const actions = overlay.querySelector('.actions');
  const close = document.createElement('button');
  close.className = 'primary';
  close.textContent = 'Вернуться в лавку';
  close.addEventListener('click', () => overlay.remove());
  actions.appendChild(close);
  overlay.addEventListener('click', (ev) => { if (ev.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

updateWallet();
go('hub');
