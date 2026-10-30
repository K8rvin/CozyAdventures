import { PET_BY_ID } from '../data/crew.js';
import { hasKnightDollAsset } from '../data/knightDollAssets.js';
import { describeKnightDoll, resolveKnightDoll } from '../core/knightDoll.js';
import { drawKnightDoll } from './knightDollFallback.js';

const layerLoads = new Map();
const loadedLayerSources = new Set();

function loadLayer(src) {
  if (loadedLayerSources.has(src)) return Promise.resolve(src);
  if (layerLoads.has(src)) return layerLoads.get(src);

  const loader = document.createElement('img');
  const promise = new Promise((resolve, reject) => {
    const cleanup = () => {
      loader.removeEventListener('load', onLoad);
      loader.removeEventListener('error', onError);
    };
    const onLoad = () => {
      cleanup();
      loadedLayerSources.add(src);
      resolve(src);
    };
    const onError = () => {
      cleanup();
      layerLoads.delete(src);
      reject();
    };
    loader.addEventListener('load', onLoad);
    loader.addEventListener('error', onError);
  });
  layerLoads.set(src, promise);
  loader.src = src;
  return promise;
}

export function createKnightDoll(state) {
  const description = describeKnightDoll(state);
  const el = document.createElement('figure');
  el.className = 'knight-doll';
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', description);

  const stage = document.createElement('div');
  stage.className = 'knight-stage';
  const fallback = document.createElement('canvas');
  fallback.className = 'knight-fallback';
  fallback.width = 220;
  fallback.height = 280;
  fallback.setAttribute('aria-hidden', 'true');
  drawKnightDoll(fallback, state);
  const layerStack = document.createElement('div');
  layerStack.className = 'knight-layers';
  layerStack.hidden = true;
  layerStack.setAttribute('aria-hidden', 'true');
  stage.appendChild(fallback);
  stage.appendChild(layerStack);
  el.appendChild(stage);

  const caption = document.createElement('figcaption');
  caption.className = 'knight-visually-hidden';
  caption.textContent = description;
  el.appendChild(caption);

  const layers = resolveKnightDoll(state);
  const requiredLayers = layers.filter((layer) => layer.required);
  const petLayer = layers.find((layer) => layer.part === 'pet');
  const requiredImages = [];
  const itemImages = [];
  let highlightedSlot = null;
  let petImage = null;
  let petEmoji = null;
  let destroyed = false;

  function makeDisplayImage(layer, extraClass = '', onError = null) {
    const image = document.createElement('img');
    image.className = `knight-layer${extraClass ? ` ${extraClass}` : ''}`;
    image.alt = '';
    image.draggable = false;
    image.dataset.equipSlot = layer.slot ?? '';
    image.style.zIndex = String(layer.z);
    if (onError) image.addEventListener('error', onError);
    image.src = layer.src;
    return image;
  }

  function applyHighlight() {
    for (const { image, slot } of itemImages) {
      image.classList.toggle('is-highlighted', Boolean(highlightedSlot) && slot === highlightedSlot);
    }
  }

  function showFallback() {
    if (destroyed) return;
    for (const image of requiredImages) image.removeEventListener('error', showFallback);
    layerStack.hidden = true;
    fallback.hidden = false;
  }

  function showRequiredLayers() {
    if (destroyed) return;
    for (const layer of requiredLayers) {
      const image = makeDisplayImage(layer, '', showFallback);
      requiredImages.push(image);
      if (layer.itemId) itemImages.push({ image, slot: layer.slot });
      layerStack.appendChild(image);
    }
    fallback.hidden = true;
    layerStack.hidden = false;
    applyHighlight();
  }

  function placePet(element) {
    const position = petLayer.position;
    if (!position) return;
    element.style.left = `${position.x}%`;
    element.style.top = `${position.y}%`;
    element.style.width = `${position.width}%`;
    element.style.transform = `translate(-50%, -50%)${position.flip ? ' scaleX(-1)' : ''}`;
  }

  function showPetEmoji() {
    if (destroyed || petEmoji) return;
    if (petImage) {
      petImage.removeEventListener('error', showPetEmoji);
      petImage.remove();
      petImage = null;
    }
    const pet = PET_BY_ID[state.pet];
    if (!pet) return;
    const emoji = document.createElement('span');
    emoji.className = 'knight-layer knight-pet knight-pet-emoji';
    emoji.style.zIndex = String(petLayer.z);
    emoji.textContent = pet.icon;
    placePet(emoji);
    petEmoji = emoji;
    layerStack.appendChild(emoji);
  }

  function showPetImage() {
    if (destroyed || petImage || petEmoji) return;
    const image = makeDisplayImage(petLayer, 'knight-pet', showPetEmoji);
    placePet(image);
    petImage = image;
    layerStack.appendChild(image);
  }

  if (requiredLayers.every((layer) => hasKnightDollAsset(layer.src))) {
    if (requiredLayers.every((layer) => loadedLayerSources.has(layer.src))) {
      showRequiredLayers();
    } else {
      Promise.all(requiredLayers.map((layer) => loadLayer(layer.src)))
        .then(showRequiredLayers)
        .catch(showFallback);
    }

    if (petLayer) {
      if (loadedLayerSources.has(petLayer.src)) showPetImage();
      else loadLayer(petLayer.src).then(showPetImage).catch(showPetEmoji);
    }
  }

  return {
    el,
    setHighlight(slot) {
      if (destroyed) return;
      highlightedSlot = slot || null;
      applyHighlight();
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      for (const image of requiredImages) image.removeEventListener('error', showFallback);
      if (petImage) petImage.removeEventListener('error', showPetEmoji);
      requiredImages.length = 0;
      itemImages.length = 0;
    },
  };
}
