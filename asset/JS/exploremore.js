(function () {
  const carouselEl = document.getElementById('yourStayCarousel');
  const counterEl  = document.getElementById('ysCounter');
  const items      = carouselEl.querySelectorAll('.carousel-item');
  const pad = (n) => String(n).padStart(2, '0');
 
  // Counter: 01/05
  function updateCounter(index) {
    counterEl.textContent = `${pad(index + 1)}/${pad(items.length)}`;
  }
  updateCounter(0);
 
  // Hide the play button on slides that have no video
  items.forEach(item => {
    if (!item.dataset.video) item.querySelector('.ys-play')?.remove();
  });
 
  // Put the photo + play button back (used when leaving a slide that is playing)
  function resetSlide(item) {
    const video = item.querySelector('video');
    if (!video) return;
    video.pause();
    video.remove();
    item.querySelector('img').hidden = false;
    const btn = item.querySelector('.ys-play');
    if (btn) btn.hidden = false;
  }
 
  // Click play: swap the photo for a <video> and start it
  carouselEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.ys-play');
    if (!btn) return;
    const item = btn.closest('.carousel-item');
    const video = document.createElement('video');
    video.src = item.dataset.video;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    item.querySelector('img').hidden = true;
    btn.hidden = true;
    item.appendChild(video);
  });
 
  // When the slide changes: stop any video, then update the counter
  carouselEl.addEventListener('slide.bs.carousel', (e) => {
    resetSlide(items[e.from]);
  });
  carouselEl.addEventListener('slid.bs.carousel', (e) => {
    updateCounter(e.to);
  });
})();

// section3
 (function () {
  const track  = document.getElementById('bbTrack');
  const slides = [...track.children];
  const tabs   = [...document.querySelectorAll('#bbTabs .bb-tab')];
  const total  = slides.length;
  let current  = 0;
 
  function go(i) {
    current = (i + total) % total;                       // wrap around
    track.style.setProperty('--bb-i', current);
    tabs.forEach((t, n) => {
      t.classList.toggle('active', n === current);
      t.setAttribute('aria-selected', n === current);
    });
  }
 
  document.getElementById('bbPrev').addEventListener('click', () => go(current - 1));
  document.getElementById('bbNext').addEventListener('click', () => go(current + 1));
  tabs.forEach((t, i) => t.addEventListener('click', () => go(i)));
 
  // Click a peeking neighbour to bring it to the centre
  slides.forEach((s, i) => s.addEventListener('click', () => { if (i !== current) go(i); }));
 
  // Swipe on touch screens
  let startX = null;
  const vp = track.parentElement;
  vp.addEventListener('pointerdown', e => { startX = e.clientX; });
  vp.addEventListener('pointerup', e => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 50) go(current + (dx < 0 ? 1 : -1));
    startX = null;
  });
 
  go(0);
})();