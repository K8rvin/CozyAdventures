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
    default: tone(440, 0.08, { gain: 0.04 });
  }
}
