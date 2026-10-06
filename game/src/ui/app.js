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

const routes = {
  hub: (c, p) => renderHub(c, ctx, p),
  puzzles: (c, p) => renderPuzzleList(c, ctx, p),
  puzzle: (c, p) => renderPuzzle(c, ctx, p),
  equip: (c, p) => renderEquip(c, ctx, p),
  shop: (c, p) => renderShop(c, ctx, p),
  battles: (c, p) => renderBattleList(c, ctx, p),
  battle: (c, p) => renderBattle(c, ctx, p),
  tavern: (c, p) => renderTavern(c, ctx, p),
  workshop: (c, p) => renderWorkshop(c, ctx, p),
  editor: (c, p) => renderEditor(c, ctx, p),
  craft: (c, p) => renderCraft(c, ctx, p),
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

updateWallet();
go('hub');
