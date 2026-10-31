import { describeKnightDoll } from '../core/knightDoll.js';
import { knightImageCacheKey } from '../core/knightImagePrompt.js';

const DB_NAME = 'knight_portraits_v1';
const STORE_NAME = 'portraits';
const memoryCache = new Map();
let latestPortrait = null;

function openDatabase() {
  if (!globalThis.indexedDB) return Promise.resolve(null);
  return new Promise((resolve) => {
    const request = globalThis.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) request.result.createObjectStore(STORE_NAME, { keyPath: 'key' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
}

async function readCached(key) {
  const db = await openDatabase();
  if (!db) return null;
  return new Promise((resolve) => {
    const request = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(key);
    request.onsuccess = () => {
      db.close();
      resolve(request.result || null);
    };
    request.onerror = () => {
      db.close();
      resolve(null);
    };
  });
}

async function writeCached(key, blob) {
  const db = await openDatabase();
  if (!db) return;
  await new Promise((resolve) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).put({ key, blob });
    transaction.oncomplete = resolve;
    transaction.onerror = resolve;
  }).catch(() => {});
  db.close();
}

function apiUrl() {
  const configured = String(globalThis.KNIGHT_IMAGE_API_URL || '').replace(/\/$/, '');
  if (!configured) return '';
  return configured.endsWith('/api/knight-image') ? configured : `${configured}/api/knight-image`;
}

function stateSnapshot(state) {
  return {
    settings: { knightBody: state.settings?.knightBody },
    equipped: state.equipped || {},
    consumableBelt: state.consumableBelt || [],
  };
}

async function requestPortrait(state, signal, regenerate = false) {
  const key = knightImageCacheKey(state);
  if (!regenerate) {
    if (memoryCache.has(key)) return memoryCache.get(key);
    const cached = await readCached(key);
    if (cached?.blob) {
      const result = { key, src: URL.createObjectURL(cached.blob) };
      memoryCache.set(key, result);
      return result;
    }
  }
  const endpoint = apiUrl();
  if (!endpoint) throw new Error('Сервер портретов не настроен');
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...stateSnapshot(state), ...(regenerate ? { regenerate: true } : {}) }),
    signal,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Не удалось создать портрет');
  const imageResponse = await fetch(data.url, { signal });
  if (!imageResponse.ok) throw new Error('Не удалось загрузить готовый портрет');
  const blob = await imageResponse.blob();
  await writeCached(key, blob).catch(() => {});
  const result = { key, src: data.url };
  memoryCache.set(key, result);
  return result;
}

export function resetKnightGeneratedCache() {
  memoryCache.clear();
  latestPortrait = null;
}

export function createKnightGeneratedDoll(state, options = {}) {
  const key = knightImageCacheKey(state);
  const description = describeKnightDoll(state);
  const el = document.createElement('figure');
  el.className = 'knight-doll knight-generated';
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', description);
  const stage = document.createElement('div');
  stage.className = 'knight-stage';
  const image = document.createElement('img');
  image.className = 'knight-layer knight-generated-image';
  image.alt = '';
  image.draggable = false;
  image.hidden = true;
  const empty = document.createElement('div');
  empty.className = 'knight-empty';
  empty.textContent = 'Портрет ещё не создан';
  const fx = document.createElement('div');
  fx.className = 'knight-generation-fx';
  fx.hidden = true;
  fx.setAttribute('aria-hidden', 'true');
  const orbit = document.createElement('div');
  orbit.className = 'knight-generation-orbit';
  const star = document.createElement('span');
  star.className = 'knight-generation-star';
  star.textContent = '✦';
  orbit.appendChild(star);
  fx.appendChild(orbit);
  for (let index = 0; index < 4; index += 1) {
    const spark = document.createElement('span');
    spark.className = `knight-generation-spark spark-${index + 1}`;
    spark.textContent = '✦';
    fx.appendChild(spark);
  }
  const status = document.createElement('div');
  status.className = 'knight-generation-status';
  status.setAttribute('role', 'status');
  stage.appendChild(image);
  stage.appendChild(empty);
  stage.appendChild(fx);
  stage.appendChild(status);
  el.appendChild(stage);
  const caption = document.createElement('figcaption');
  caption.className = 'knight-visually-hidden';
  caption.textContent = description;
  el.appendChild(caption);

  let destroyed = false;
  let controller = null;
  let timer = null;
  let taps = [];

  function showLatest() {
    if (!latestPortrait) return;
    image.src = latestPortrait.src;
    image.hidden = false;
    empty.hidden = true;
  }

  function showReady(result) {
    el.dataset.generatedState = destroyed ? 'destroyed' : result.key !== key ? 'stale' : 'ready';
    if (destroyed || result.key !== key) return;
    latestPortrait = result;
    image.src = result.src;
    image.hidden = false;
    empty.hidden = true;
    fx.hidden = true;
    status.hidden = true;
  }

  async function generate(regenerate = false) {
    if (destroyed) return;
    controller?.abort();
    controller = new AbortController();
    el.dataset.generatedState = 'loading';
    status.textContent = regenerate ? 'Перегенерируем портрет…' : 'Генерируем текущий комплект…';
    status.hidden = false;
    fx.hidden = false;
    try {
      const result = await requestPortrait(state, controller.signal, regenerate);
      showReady(result);
    } catch (error) {
      if (destroyed || error.name === 'AbortError') return;
      el.dataset.generatedState = 'error';
      fx.hidden = true;
      status.textContent = error.message || 'Не удалось создать портрет';
      status.hidden = false;
    }
  }

  function regenerate() {
    if (destroyed) return Promise.resolve();
    const message = 'Заново сгенерировать этот портрет через OpenRouter? Прежнее изображение останется на экране до готовности.';
    if (globalThis.confirm?.(message) === false) return Promise.resolve();
    return generate(true);
  }

  el.addEventListener('click', (event) => {
    if (!event.ctrlKey || !event.shiftKey) return;
    event.preventDefault();
    regenerate();
  });
  el.addEventListener('pointerup', (event) => {
    if (event.pointerType !== 'touch') return;
    const now = Date.now();
    taps = [...taps.filter((time) => now - time < 2000), now];
    if (taps.length >= 5) {
      taps = [];
      regenerate();
    }
  });

  showLatest();
  timer = setTimeout(() => generate(false), options.debounceMs ?? 400);

  return {
    el,
    regenerate,
    setHighlight(slot) {
      if (destroyed) return;
      image.dataset.equipSlot = slot || '';
      image.classList.toggle('is-highlighted', Boolean(slot));
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      clearTimeout(timer);
      controller?.abort();
    },
  };
}
