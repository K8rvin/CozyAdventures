import { GUEST_BY_ID } from '../data/guests.js';
import {
  battleLoreScene, battleLoreFinalBattle, markBattleLoreSeen, nextCampaignBattle,
} from '../core/battleLore.js';
import { header } from './common.js';

export function renderBattleLore(container, ctx, params = {}) {
  const { world, kind } = params;
  const scene = battleLoreScene(world, kind);
  const finalBattle = battleLoreFinalBattle(world);
  if (!scene || !finalBattle || (kind === 'outro' && !ctx.state.battlesDone?.[finalBattle.id])) {
    ctx.go('battles');
    return undefined;
  }

  let index = 0;
  let finished = false;
  container.appendChild(header(ctx, scene.title,
    kind === 'intro' ? 'Вступление к походам рыцаря' : 'Завершение истории мира', 'battles'));

  const stage = document.createElement('div');
  stage.className = 'panel story-stage battle-lore-stage';

  const leave = document.createElement('button');
  leave.className = 'ghost small story-leave';
  leave.textContent = '← К походам';
  leave.addEventListener('click', () => { ctx.sfx?.('tap'); ctx.go('battles'); });
  stage.appendChild(leave);

  const portraitBox = document.createElement('div');
  portraitBox.className = 'story-portrait battle-lore-portrait';
  stage.appendChild(portraitBox);

  const who = document.createElement('div');
  who.className = 'story-who';
  stage.appendChild(who);

  const bubble = document.createElement('div');
  bubble.className = 'story-bubble';
  stage.appendChild(bubble);

  const dots = document.createElement('div');
  dots.className = 'story-dots';
  stage.appendChild(dots);

  const nextBtn = document.createElement('button');
  nextBtn.className = 'primary story-next battle-lore-next';
  stage.appendChild(nextBtn);

  function drawPortrait(step) {
    const guest = GUEST_BY_ID[step.guestId];
    portraitBox.innerHTML = '';
    if (guest.art) {
      const img = document.createElement('img');
      img.src = guest.art;
      img.alt = guest.name;
      img.addEventListener('error', () => { img.remove(); portraitBox.textContent = guest.icon; });
      portraitBox.appendChild(img);
    } else {
      portraitBox.textContent = guest.icon;
    }
  }

  function draw() {
    const step = scene.steps[index];
    const guest = GUEST_BY_ID[step.guestId];
    const isLast = index === scene.steps.length - 1;
    drawPortrait(step);
    who.textContent = `${guest.icon} ${guest.name}`;
    bubble.textContent = step.text;
    bubble.classList.remove('story-pop');
    void bubble.offsetWidth;
    bubble.classList.add('story-pop');
    dots.innerHTML = '';
    scene.steps.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = `story-dot${i <= index ? ' on' : ''}`;
      dots.appendChild(dot);
    });
    if (!isLast) nextBtn.textContent = 'Дальше ▸';
    else if (params.replay) nextBtn.textContent = 'К походам ▸';
    else if (kind === 'intro') nextBtn.textContent = 'К расстановке ▸';
    else nextBtn.textContent = nextCampaignBattle(params.battleId || finalBattle.id)
      ? 'В следующий мир ▸' : 'К походам ▸';
  }

  function finish() {
    if (finished) return;
    finished = true;
    markBattleLoreSeen(ctx.state, world, kind);
    ctx.save();
    if (!params.replay && kind === 'intro' && params.battleId) {
      ctx.go('battle', { id: params.battleId });
      return;
    }
    if (!params.replay && kind === 'outro') {
      const next = nextCampaignBattle(params.battleId || finalBattle.id);
      if (next) ctx.go('battle', { id: next.id });
      else ctx.go('battles');
      return;
    }
    ctx.go('battles');
  }

  function next() {
    if (finished) return;
    if (index >= scene.steps.length - 1) { finish(); return; }
    index += 1;
    ctx.sfx?.('page');
    draw();
  }

  nextBtn.addEventListener('click', next);
  bubble.addEventListener('click', next);
  portraitBox.addEventListener('click', next);
  const onKey = (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); next(); }
    if (ev.key === 'Escape') ctx.go('battles');
  };
  window.addEventListener('keydown', onKey);

  draw();
  ctx.sfx?.('bubble');
  container.appendChild(stage);
  return () => window.removeEventListener('keydown', onKey);
}
