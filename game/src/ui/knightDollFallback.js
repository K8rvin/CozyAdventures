// --- Рыцарь-бумажная кукла: внешний вид зависит от экипировки (вектор) ---
import { ITEM_BY_ID } from '../data/items.js';
import { PET_BY_ID } from '../data/crew.js';

const RARITY_PAL = {
  common: { main: '#8a7a62', dark: '#5d4732', trim: '#6b553a' },
  rare: { main: '#6a7fa0', dark: '#44536e', trim: '#a8d8ff' },
  epic: { main: '#7a5a9a', dark: '#553d6d', trim: '#d3a8ff' },
  legendary: { main: '#b8902a', dark: '#8a6a1a', trim: '#ffd98a' },
};

export function drawKnightDoll(canvas, state) {
  const g = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const eq = state.equipped;
  const item = (slot) => (eq[slot] ? ITEM_BY_ID[eq[slot]] : null);
  const pal = (it) => RARITY_PAL[it?.rarity] || RARITY_PAL.common;
  const cx = W / 2;

  // --- Фон: тёплая ниша и тень ---
  const bg = g.createRadialGradient(cx, H * 0.35, 30, cx, H * 0.45, W * 0.75);
  bg.addColorStop(0, 'rgba(255, 202, 122, 0.20)');
  bg.addColorStop(1, 'rgba(255, 202, 122, 0)');
  g.fillStyle = bg;
  g.fillRect(0, 0, W, H);
  g.fillStyle = 'rgba(0,0,0,0.3)';
  g.beginPath();
  g.ellipse(cx, H * 0.92, 62, 10, 0, 0, Math.PI * 2);
  g.fill();

  const el = (x, y, rx, ry, fill) => {
    g.fillStyle = fill;
    g.beginPath();
    g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    g.fill();
  };
  const rr = (x, y, w, h, r, fill) => {
    g.fillStyle = fill;
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
    g.fill();
  };

  // === НОГИ (поножи) ===
  const boots = item('boots');
  const legCol = boots ? pal(boots).dark : '#4a3a29';
  rr(cx - 26, H * 0.62, 20, 52, 7, legCol);
  rr(cx + 6, H * 0.62, 20, 52, 7, legCol);
  // Сапоги
  const bootCol = boots ? pal(boots).main : '#6b5335';
  rr(cx - 28, H * 0.79, 26, 20, 6, bootCol);
  rr(cx + 4, H * 0.79, 26, 20, 6, bootCol);
  rr(cx - 28, H * 0.79, 26, 6, 4, boots ? pal(boots).trim : '#4a3a29');
  rr(cx + 4, H * 0.79, 26, 6, 4, boots ? pal(boots).trim : '#4a3a29');

  // === ТОРС ПО БРОНЕ ===
  const armor = item('armor');
  const torsoY = H * 0.4;
  const torsoH = 82;
  const drawTorso = (main, dark, style) => {
    rr(cx - 36, torsoY, 72, torsoH, 20, main);
    // плечи
    el(cx - 40, torsoY + 14, 14, 12, dark);
    el(cx + 40, torsoY + 14, 14, 12, dark);
    if (style === 'mail') {
      // кольчужная фактура
      g.fillStyle = 'rgba(0,0,0,0.18)';
      for (let yy = torsoY + 10; yy < torsoY + torsoH - 8; yy += 9) {
        for (let xx = cx - 30; xx < cx + 32; xx += 9) {
          g.fillRect(xx, yy, 3, 3);
        }
      }
    }
    if (style === 'plates') {
      g.fillStyle = dark;
      for (let yy = torsoY + 16; yy < torsoY + torsoH - 6; yy += 18) g.fillRect(cx - 32, yy, 64, 5);
    }
    if (style === 'cloth') {
      g.strokeStyle = dark;
      g.lineWidth = 2;
      g.setLineDash([5, 5]);
      g.beginPath();
      g.moveTo(cx, torsoY + 6);
      g.lineTo(cx, torsoY + torsoH - 8);
      g.stroke();
      g.setLineDash([]);
    }
    if (style === 'robe') {
      g.fillStyle = dark;
      g.beginPath();
      g.moveTo(cx - 36, torsoY + 20);
      g.lineTo(cx + 36, torsoY + 20);
      g.lineTo(cx + 30, torsoY + torsoH + 18);
      g.lineTo(cx - 30, torsoY + torsoH + 18);
      g.closePath();
      g.fill();
    }
  };
  switch (armor?.id) {
    case 'arm_padded': drawTorso('#a08a62', '#6b5535', 'cloth'); break;
    case 'arm_oak_guardian': drawTorso('#7a5a38', '#4a3a24', 'plates'); break;
    case 'arm_silken': drawTorso('#6fae9d', '#4a7a6d', 'cloth'); break;
    case 'arm_chain': drawTorso('#7d94b8', '#4a5a78', 'mail'); break;
    case 'arm_ink_cloak': drawTorso('#4a3a5a', '#332844', 'robe'); break;
    case 'arm_master': drawTorso('#3a5a8a', '#27405e', 'plates'); break;
    default: {
      if (armor) drawTorso(pal(armor).main, pal(armor).dark, 'mail');
      else drawTorso('#8a7a62', '#6b5a48', 'cloth');
    }
  }
  // Воротник
  el(cx, torsoY + 6, 22, 8, armor ? pal(armor).trim : '#6b5a48');

  // Пояс и зелья
  rr(cx - 34, torsoY + torsoH - 16, 68, 9, 3, '#3a2c1c');
  state.consumableBelt.forEach((id, i) => {
    const px = cx - 22 + i * 16;
    rr(px, torsoY + torsoH - 10, 8, 14, 3, '#7a4a5a');
    rr(px + 2, torsoY + torsoH - 14, 4, 5, 2, '#c9b294');
  });

  // === ГОЛОВА И ШЛЕМ ===
  const headY = H * 0.27;
  el(cx, headY, 24, 26, '#d9b98a'); // лицо
  const helm = item('helmet');
  switch (helm?.id) {
    case undefined:
    case null:
      // Волосы и лицо
      el(cx, headY - 12, 24, 14, '#6b4a2f');
      el(cx - 8, headY + 2, 3, 4, '#33241a');
      el(cx + 8, headY + 2, 3, 4, '#33241a');
      g.strokeStyle = '#8a5a3a';
      g.lineWidth = 2;
      g.beginPath();
      g.arc(cx, headY + 6, 9, 0.2, Math.PI - 0.2);
      g.stroke();
      break;
    case 'hlm_leather':
      el(cx, headY - 10, 26, 18, '#7a5a3a');
      rr(cx - 26, headY - 12, 52, 10, 5, '#5d4732');
      break;
    case 'hlm_badger':
      el(cx, headY - 8, 26, 16, '#8a9098');
      el(cx - 16, headY - 22, 7, 9, '#8a9098');
      el(cx + 16, headY - 22, 7, 9, '#8a9098');
      rr(cx - 26, headY - 12, 52, 8, 4, '#6a7078');
      break;
    case 'hlm_kettle':
      el(cx, headY - 10, 22, 16, '#9aa2ac');
      rr(cx - 30, headY - 12, 60, 7, 3, '#7a828c');
      rr(cx - 4, headY - 26, 8, 6, 2, '#c9b294');
      break;
    case 'hlm_page_wanderer':
      g.fillStyle = '#4a3a5a';
      g.beginPath();
      g.moveTo(cx - 24, headY - 8);
      g.quadraticCurveTo(cx, headY - 52, cx + 24, headY - 8);
      g.closePath();
      g.fill();
      rr(cx - 26, headY - 10, 52, 8, 4, '#332844');
      el(cx + 6, headY - 30, 3, 4, '#ffd98a');
      break;
    case 'hlm_master':
      rr(cx - 20, headY - 16, 40, 7, 3, '#c9a227');
      el(cx, headY - 14, 4, 5, '#ffd98a');
      break;
    default:
      el(cx, headY - 8, 26, 16, pal(helm).main);
      rr(cx - 26, headY - 12, 52, 8, 4, pal(helm).dark);
  }

  // === ПЕРЧАТКИ (кисти) ===
  const glv = item('gloves');
  const handCol = glv ? pal(glv).main : '#d9b98a';
  const wpn = item('weapon');
  const twoHanded = wpn?.hand === 'two';
  // Двуручное оружие: кисти рисуются позже — на древке, одна выше, другая ниже
  if (!twoHanded) {
    el(cx - 40, torsoY + 40, 9, 10, handCol);
    el(cx + 40, torsoY + 40, 9, 10, handCol);
    // Кольца — искры
    if (item('ring1')) { el(cx - 40, torsoY + 34, 3, 3, '#ffd98a'); }
    if (item('ring2')) { el(cx + 40, torsoY + 34, 3, 3, '#ffd98a'); }
  }

  // === ОРУЖИЕ (правая рука — слева от зрителя, рукоять в кисти) ===
  if (wpn) {
    const steel = '#c8d4dc';
    const steelDark = '#8a98a4';
    // Наклон ОТ рыцаря; двуручное — сильнее, чтобы легло на два хвата
    const angle = twoHanded ? -0.44 : -0.28;
    const ax = cx - 46;
    const ay = torsoY + 46;
    g.save();
    g.translate(ax, ay); // рукоять в правой кисти
    g.rotate(angle);
    g.shadowColor = 'rgba(0,0,0,0.4)';
    g.shadowBlur = 4;
    switch (wpn.type) {
      case 'sword':
        rr(-4.5, -106, 9, 98, 4.5, steel);
        g.beginPath();
        g.moveTo(0, -114);
        g.lineTo(6, -104);
        g.lineTo(-6, -104);
        g.closePath();
        g.fillStyle = steel;
        g.fill();
        rr(-18, -12, 36, 7, 3, '#c9a227');
        rr(-3, -5, 6, 22, 3, '#4a3a29');
        break;
      case 'mace':
        rr(-3.5, -72, 7, 72, 3, '#6b5335');
        el(0, -84, 18, 18, steelDark);
        g.fillStyle = steelDark;
        for (let a = 0; a < 8; a++) {
          const ang = (a / 8) * Math.PI * 2;
          g.beginPath();
          g.arc(Math.cos(ang) * 18, -84 + Math.sin(ang) * 18, 4, 0, Math.PI * 2);
          g.fill();
        }
        el(0, -84, 7, 7, steel);
        break;
      case 'dagger':
        rr(-3.5, -64, 7, 60, 3.5, steel);
        g.beginPath();
        g.moveTo(0, -72);
        g.lineTo(5, -62);
        g.lineTo(-5, -62);
        g.closePath();
        g.fillStyle = steel;
        g.fill();
        rr(-12, -8, 24, 6, 3, '#c9a227');
        rr(-2.5, -2, 5, 15, 2, '#4a3a29');
        break;
      case 'greatsword':
        rr(-7.5, -138, 15, 126, 7, steel);
        rr(-7.5, -138, 15, 20, 7, steelDark);
        rr(-22, -16, 44, 9, 4, '#c9a227');
        rr(-4.5, -7, 9, 26, 4, '#4a3a29');
        el(0, -128, 5, 5, '#ffd98a');
        break;
      case 'greataxe':
        rr(-4, -100, 8, 96, 4, '#6b5335');
        g.fillStyle = steel;
        g.beginPath();
        g.moveTo(-4, -98);
        g.quadraticCurveTo(-44, -88, -36, -52);
        g.lineTo(-4, -62);
        g.closePath();
        g.fill();
        rr(-8, -106, 16, 7, 3, steelDark);
        break;
      case 'bow': {
        // Плечи лука: плавная дуга, живот наружу (влево от рыцаря)
        g.strokeStyle = '#8a5a3a';
        g.lineWidth = 5.5;
        g.lineCap = 'round';
        g.beginPath();
        g.moveTo(0, -88);
        g.quadraticCurveTo(-24, -52, -18, -6);
        g.quadraticCurveTo(-14, 40, 0, 76);
        g.stroke();
        // Светлая кромка дерева
        g.strokeStyle = '#a06a42';
        g.lineWidth = 2;
        g.beginPath();
        g.moveTo(0, -86);
        g.quadraticCurveTo(-21, -52, -16, -7);
        g.quadraticCurveTo(-12, 38, 0, 74);
        g.stroke();
        // Тетива
        g.strokeStyle = '#d9cdb8';
        g.lineWidth = 1.6;
        g.beginPath();
        g.moveTo(0, -88);
        g.lineTo(0, 76);
        g.stroke();
        // Намотка рукояти (в «животе» дуги)
        rr(-21, -14, 8, 16, 3, '#4a3a29');
        // Стрела на тетиве
        g.strokeStyle = '#c9b294';
        g.lineWidth = 2.5;
        g.beginPath();
        g.moveTo(4, -4);
        g.lineTo(-28, -9);
        g.stroke();
        g.fillStyle = steel;
        g.beginPath();
        g.moveTo(-36, -10);
        g.lineTo(-27, -13);
        g.lineTo(-27, -6);
        g.closePath();
        g.fill();
        // Оперение
        g.strokeStyle = '#e8dcc8';
        g.lineWidth = 1.6;
        g.beginPath();
        g.moveTo(2, -4);
        g.lineTo(-3, -11);
        g.moveTo(3, -2);
        g.lineTo(-1, 4);
        g.stroke();
        break;
      }
      case 'staff':
        rr(-4, -110, 6, 108, 3, '#5d4732');
        el(0, -114, 13, 13, '#ffb85a');
        el(0, -114, 22, 22, 'rgba(255,184,90,0.35)');
        el(0, -114, 5, 5, '#fff2be');
        break;
      default:
        rr(-4.5, -106, 9, 98, 4.5, steel);
        rr(-18, -12, 36, 7, 3, '#c9a227');
        rr(-3, -5, 6, 22, 3, '#4a3a29');
    }
    g.restore();

    // Двуручный хват: кисти поверх древка — одна выше, другая ниже.
    // Точки хвата заданы в локальных координатах оружия (после наклона).
    if (twoHanded) {
      const GRIP2H = {
        greatsword: [[0, -2], [0, 16]],
        greataxe: [[0, -34], [0, -8]],
        staff: [[0, -44], [0, -14]],
        bow: [[-17, -6], [2, -4]], // рука на рукояти лука и на тетиве
      };
      const grips = GRIP2H[wpn.type] || [[0, -2], [0, 20]];
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const toWorld = ([x, y]) => [ax + x * cos - y * sin, ay + x * sin + y * cos];
      const [h1, h2] = grips.map(toWorld);
      g.shadowColor = 'rgba(0,0,0,0.4)';
      g.shadowBlur = 4;
      el(h1[0], h1[1], 9, 10, handCol);
      el(h2[0], h2[1], 9, 10, handCol);
      // Кольца — искры на нижней руке
      if (item('ring1')) el(h2[0], h2[1] - 6, 3, 3, '#ffd98a');
      if (item('ring2')) el(h2[0] + 5, h2[1] - 3, 3, 3, '#ffd98a');
      g.shadowBlur = 0;
    }
  }

  // === ЩИТ (левая рука — справа от зрителя, крупно на предплечье) ===
  const shd = item('shield');
  if (shd) {
    const sx = cx + 48;
    const sy = torsoY + 46;
    g.save();
    g.shadowColor = 'rgba(0,0,0,0.4)';
    g.shadowBlur = 4;
    const drawKite = (main, trim, boss) => {
      g.fillStyle = main;
      g.beginPath();
      g.moveTo(sx - 28, sy - 44);
      g.lineTo(sx + 28, sy - 44);
      g.lineTo(sx + 28, sy + 14);
      g.quadraticCurveTo(sx, sy + 44, sx - 28, sy + 14);
      g.closePath();
      g.fill();
      g.strokeStyle = trim;
      g.lineWidth = 5;
      g.stroke();
      if (boss) el(sx, sy - 14, 9, 9, boss);
    };
    switch (shd.id) {
      case 'shd_wooden':
        el(sx, sy, 32, 35, '#8a6a45');
        el(sx, sy, 21, 23, '#7a5a38');
        el(sx, sy, 9, 9, '#6b5335');
        break;
      case 'shd_tower':
        rr(sx - 21, sy - 46, 42, 84, 9, '#8a9098');
        rr(sx - 21, sy - 46, 42, 13, 7, '#6a7078');
        el(sx, sy - 8, 8, 8, '#4a3a29');
        g.fillStyle = 'rgba(255,255,255,0.15)';
        g.fillRect(sx - 16, sy - 38, 8, 68);
        break;
      case 'shd_master':
        drawKite('#b8c8d8', '#ffd98a', '#e8f4ff');
        g.fillStyle = 'rgba(255,255,255,0.5)';
        g.beginPath();
        g.moveTo(sx - 18, sy - 38);
        g.lineTo(sx - 5, sy - 38);
        g.lineTo(sx - 13, sy + 8);
        g.lineTo(sx - 21, sy + 3);
        g.closePath();
        g.fill();
        break;
      case 'shd_page_shield':
        rr(sx - 22, sy - 38, 44, 74, 7, '#6b4a2f');
        rr(sx - 22, sy - 38, 12, 74, 7, '#4a3320');
        el(sx + 3, sy, 6, 7, '#c9a227');
        break;
      default:
        drawKite(pal(shd).main, pal(shd).trim, pal(shd).trim);
    }
    g.restore();
  }

  // === АМУЛЕТ ===
  const amu = item('amulet');
  if (amu) {
    g.strokeStyle = '#c9b294';
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(cx - 10, torsoY + 4);
    g.quadraticCurveTo(cx, torsoY + 18, cx + 10, torsoY + 4);
    g.stroke();
    el(cx, torsoY + 24, 6, 7, pal(amu).trim);
    el(cx, torsoY + 24, 10, 12, 'rgba(255,226,138,0.3)');
  }

  // Питомец у ног
  if (state.pet && PET_BY_ID[state.pet]) {
    const e = PET_BY_ID[state.pet].icon;
    g.font = '30px "Segoe UI Emoji", sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(e, W * 0.82, H * 0.86);
  }

  // (без подписи — вид говорит сам за себя)
}
