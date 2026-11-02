(() => {
  const hint = document.getElementById('rotate-hint');
  const mq = window.matchMedia('(orientation: portrait)');
  const coarse = window.matchMedia('(pointer: coarse)');
  let dismissed = false;
  function update() {
    hint.hidden = dismissed || !coarse.matches || !mq.matches;
  }
  mq.addEventListener?.('change', update);
  update();
  document.getElementById('rh-dismiss').addEventListener('click', () => {
    dismissed = true;
    update();
  });
  document.getElementById('rh-fullscreen').addEventListener('click', () => {
    const el = document.documentElement;
    const req = el.requestFullscreen || el.webkitRequestFullscreen;
    const p = req ? req.call(el) : Promise.reject();
    Promise.resolve(p).then(() => {
      return screen.orientation?.lock?.('landscape').catch(() => {});
    }).catch(() => {});
    dismissed = true;
    update();
  });
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }
})();
