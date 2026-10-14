const heroNav = document.querySelector('.hero-nav');
const topbarH = document.querySelector('.topbar').offsetHeight;
const logoImg = document.querySelector('.brand-logo');

function onScroll() {
  const y = window.scrollY;

  // Slide the nav up under the top bar, then pin it to the top of the screen
  heroNav.style.top = Math.max(0, topbarH - y) + 'px';

  // Switch to white once the top bar has scrolled away
  const scrolled = y >= topbarH;
  heroNav.classList.toggle('scrolled', scrolled);

  // Swap the logo (white version on the image, dark version on white)
  const wanted = scrolled ? logoImg.dataset.logoScrolled : logoImg.dataset.logoDefault;
  if (!logoImg.src.endsWith(wanted.replace('./', ''))) logoImg.src = wanted;
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load
   
   
   
   
   const tabs = [...document.querySelectorAll('.slide-tab')];
    const title = document.getElementById('heroTitle');
    const hero = document.querySelector('.hero');
    const pauseBtn = document.getElementById('pauseBtn');
    let current = 0, timer = null, paused = false;
 
    function show(i) {
      current = i;
      tabs.forEach((t, n) => {
        t.classList.remove('active');
        if (n === i) { void t.offsetWidth; t.classList.add('active'); } // restart progress animation
      });
      title.textContent = tabs[i].dataset.title;
      hero.style.backgroundImage = `linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.15) 35%, rgba(0,0,0,.55) 100%), url("${tabs[i].dataset.image}")`;
    }
    function start() { stop(); timer = setInterval(() => show((current + 1) % tabs.length), 6000); }
    function stop() { clearInterval(timer); }
 
    tabs.forEach((t, i) => t.addEventListener('click', () => { show(i); if (!paused) start(); }));
    pauseBtn.addEventListener('click', () => {
      paused = !paused;
      pauseBtn.firstElementChild.className = paused ? 'bi bi-play-circle' : 'bi bi-pause-circle';
      pauseBtn.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
      document.querySelectorAll('.progress-bar-gold').forEach(b => b.style.animationPlayState = paused ? 'paused' : 'running');
      paused ? stop() : start();
    });
    start();


// section2
const PAGE_SIZE = 8;                                   // photos revealed per click
  const hiddenTiles = () => document.querySelectorAll('#experienceGrid .more.d-none');
  const loadBtn  = document.getElementById('loadMoreBtn');
  const shownEl  = document.getElementById('shownCount');
  const totalEl  = document.getElementById('totalCount');
  const total    = document.querySelectorAll('#experienceGrid .col').length;
 
  function updateCount() {
    shownEl.textContent = total - hiddenTiles().length;
    totalEl.textContent = total;
    loadBtn.hidden = hiddenTiles().length === 0;         // hide button when all are shown
  }
 
  loadBtn.addEventListener('click', () => {
    [...hiddenTiles()].slice(0, PAGE_SIZE).forEach(el => el.classList.remove('d-none'));
    updateCount();
  });
 
  updateCount();