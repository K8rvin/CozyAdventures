// Крошечный WebAudio-синтезатор: уютные звуки без аудиофайлов.
let ctxAudio = null;
let enabled = true;

function ac() {
  if (!ctxAudio && typeof AudioContext !== 'undefined') {
    ctxAudio = new AudioContext();
  }
  return ctxAudio;
}

export function initSound() {
  enabled = (typeof localStorage === 'undefined') ||
    localStorage.getItem('cozy_sound') !== 'off';
  if (typeof document === 'undefined') return;
  const unlock = () => { ac()?.resume?.(); };
  document.addEventListener?.('pointerdown', unlock, { once: true });
  document.addEventListener?.('keydown', unlock, { once: true });
}

export function toggleSound() {
  enabled = !enabled;
  try { localStorage.setItem('cozy_sound', enabled ? 'on' : 'off'); } catch { /* ignore */ }
  return enabled;
}

export function soundEnabled() {
  return enabled;
}

// Проиграть аудиофайл; вернуть true, если файл есть и звук запущен.
function playAudio(src, volume = 1) {
  if (!enabled || typeof Audio === 'undefined') return false;
  try {
    const a = new Audio(src);
    a.volume = volume;
    a.play().catch(() => false);
    return true;
  } catch {
    return false;
  }
}

function tone(freq, dur, { type = 'sine', gain = 0.08, delay = 0, slide = 0 } = {}) {
  const a = ac();
  if (!a || !enabled) return;
  const t0 = a.currentTime + delay;
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t0 + dur);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(a.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

export function sfx(name) {
  if (!enabled) return;
  switch (name) {
    case 'tap': tone(520, 0.08, { type: 'triangle', gain: 0.05 }); break;
    case 'rotate': tone(440, 0.07, { type: 'triangle', gain: 0.06, slide: 160 }); break;
    case 'hint': tone(660, 0.15, { type: 'sine', gain: 0.05 }); tone(880, 0.2, { delay: 0.1, gain: 0.04 }); break;
    case 'success':
      [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.25, { delay: i * 0.09, gain: 0.06 }));
      break;
    case 'coin': tone(990, 0.07, { type: 'square', gain: 0.03 }); tone(1320, 0.1, { delay: 0.06, type: 'square', gain: 0.025 }); break;
    case 'hit': tone(180, 0.08, { type: 'sawtooth', gain: 0.04, slide: -60 }); break;
    case 'crit': tone(240, 0.12, { type: 'sawtooth', gain: 0.06, slide: -120 }); break;
    case 'potion': tone(392, 0.12, { gain: 0.05 }); tone(523, 0.15, { delay: 0.08, gain: 0.05 }); break;
    case 'fail':
      [392, 330, 262].forEach((f, i) => tone(f, 0.3, { delay: i * 0.14, gain: 0.05 }));
      break;
    case 'moth': tone(300, 0.2, { type: 'square', gain: 0.04, slide: 80 }); break;
    case 'purr': {
      // Настоящее мурлыкание кота (assets/…_1sec.mp3), фолбэк — синтез
      if (playAudio('assets/3d-zvuk-murchanie-koshki_1sec.mp3', 0.7)) break;
      for (let i = 0; i < 5; i++) {
        tone(65, 0.09, { type: 'sawtooth', gain: 0.05, delay: i * 0.11 });
        tone(80, 0.09, { type: 'sawtooth', gain: 0.03, delay: i * 0.11 + 0.05 });
      }
      break;
    }
    default: tone(440, 0.08, { gain: 0.04 });
  }
}

// --- Генеративная фоновая музыка лавки (лоу-фай, без файлов) ---
// Медленные аккорды Am–F–C–G, мягкие треугольные волны, редкие колокольчики,
// лёгкий шелест дождя. Управление: startMusic/stopMusic/toggleMusic.

const MUSIC_KEY = 'cozy_music';
let musicTimer = null;
let musicGain = null;
let musicNoise = null;
let chordIdx = 0;
let bellIdx = 0;

const CHORDS = [
  [220.0, 261.63, 329.63], // Am
  [174.61, 220.0, 261.63], // F
  [130.81, 196.0, 329.63], // C
  [196.0, 246.94, 293.66], // G
];
const BELLS = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];

function musicEnabledSetting() {
  try { return localStorage.getItem(MUSIC_KEY) !== 'off'; } catch { return true; }
}

export function startMusic() {
  const a = ac();
  if (!a || musicTimer || !musicEnabledSetting()) return;
  musicGain = a.createGain();
  musicGain.gain.value = 0.0;
  musicGain.gain.linearRampToValueAtTime(0.045, a.currentTime + 2);
  musicGain.connect(a.destination);

  // Шелест дождя: петля шума через фильтр
  const noiseLen = a.sampleRate * 2;
  const noiseBuf = a.createBuffer(1, noiseLen, a.sampleRate);
  const data = noiseBuf.getChannelData(0);
  for (let i = 0; i < noiseLen; i++) data[i] = (Math.random() * 2 - 1) * 0.12;
  musicNoise = a.createBufferSource();
  musicNoise.buffer = noiseBuf;
  musicNoise.loop = true;
  const noiseFilter = a.createBiquadFilter();
  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.value = 900;
  const noiseGain = a.createGain();
  noiseGain.gain.value = 0.35;
  musicNoise.connect(noiseFilter).connect(noiseGain).connect(musicGain);
  musicNoise.start();

  const bar = () => {
    if (!musicGain) return;
    const t0 = a.currentTime + 0.05;
    // Аккорд (3 ноты по 3.6 сек)
    for (const f of CHORDS[chordIdx % CHORDS.length]) {
      const osc = a.createOscillator();
      const g = a.createGain();
      osc.type = 'triangle';
      osc.frequency.value = f;
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(0.5, t0 + 0.7);
      g.gain.linearRampToValueAtTime(0.0001, t0 + 3.6);
      osc.connect(g).connect(musicGain);
      osc.start(t0);
      osc.stop(t0 + 3.7);
    }
    // Редкий колокольчик с вероятностью
    if (Math.random() < 0.65) {
      const bt = t0 + 0.8 + Math.random() * 2.2;
      const osc = a.createOscillator();
      const g = a.createGain();
      osc.type = 'sine';
      osc.frequency.value = BELLS[bellIdx++ % BELLS.length];
      g.gain.setValueAtTime(0, bt);
      g.gain.linearRampToValueAtTime(0.35, bt + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, bt + 1.6);
      osc.connect(g).connect(musicGain);
      osc.start(bt);
      osc.stop(bt + 1.7);
    }
    chordIdx++;
  };
  bar();
  musicTimer = setInterval(bar, 3600);
}

export function stopMusic() {
  if (musicTimer) { clearInterval(musicTimer); musicTimer = null; }
  try { musicNoise?.stop(); } catch { /* ignore */ }
  musicNoise = null;
  if (musicGain) {
    const a = ac();
    if (a) musicGain.gain.linearRampToValueAtTime(0, a.currentTime + 0.8);
    setTimeout(() => { try { musicGain?.disconnect(); } catch { /* ignore */ } musicGain = null; }, 900);
  }
}

export function toggleMusic() {
  const on = !musicEnabledSetting();
  try { localStorage.setItem(MUSIC_KEY, on ? 'on' : 'off'); } catch { /* ignore */ }
  if (!on) stopMusic();
  else startMusic();
  return on;
}

export function musicOn() {
  return !!musicTimer;
}

export function musicEnabled() {
  return musicEnabledSetting();
}
