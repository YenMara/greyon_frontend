(function () {
  const root   = document.querySelector('[data-peek]');
  if (!root) return;
  const stage  = root.querySelector('.peek-stage');
  const slides = Array.from(root.querySelectorAll('.peek-slide'));
  const n      = slides.length;
  const half   = Math.floor(n / 2);
  let active   = 0;
  let prev     = null;

  // position of slide i relative to the active one: ... -2, -1, 0, 1, 2 ...
  const offsetOf = (i, a) => ((i - a + n + half) % n) - half;

  function render() {
    const now = slides.map((_, i) => offsetOf(i, active));

    slides.forEach((s, i) => {
      const o = now[i];
      // a slide that wraps around the loop jumps without animating
      if (prev && Math.abs(o - prev[i]) > 1) s.style.transition = 'none';

      s.style.setProperty('--o', o);
      s.classList.toggle('is-active', o === 0);
      s.classList.toggle('is-near', Math.abs(o) === 1);
      s.dataset.o = o;
      s.setAttribute('aria-hidden', o === 0 ? 'false' : 'true');
    });

    void stage.offsetWidth; // apply the jump before turning transitions back on
    requestAnimationFrame(() => slides.forEach(s => (s.style.transition = '')));
    prev = now;
  }

  const go = (d) => { active = (active + d + n) % n; render(); };

  root.querySelectorAll('.peek-btn').forEach(b =>
    b.addEventListener('click', () => go(Number(b.dataset.dir)))
  );

  // click a faded side slide to move to it
  slides.forEach(s => s.addEventListener('click', () => {
    const o = Number(s.dataset.o);
    if (Math.abs(o) === 1) go(o);
  }));

  // keyboard
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  go(-1);
    if (e.key === 'ArrowRight') go(1);
  });

  // swipe on touch screens
  let startX = null;
  stage.addEventListener('pointerdown', (e) => { startX = e.clientX; });
  stage.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    startX = null;
  });
  stage.addEventListener('pointercancel', () => { startX = null; });

  render();
})();