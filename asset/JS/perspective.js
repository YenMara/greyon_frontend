// Cards live in the HTML. JS only slides the track one card at a time.
  const track = document.getElementById("track");
  const pager = document.getElementById("pager");
  const total = track.children.length;
  [...track.children].forEach((el, i) => el.dataset.id = i);
 
  let busy = false;
  const perView = () => (window.innerWidth >= 992 ? 3 : window.innerWidth >= 576 ? 2 : 1);
  const step = () => 100 / perView();
 
  // one hexagon dot per card
  pager.innerHTML = Array.from({ length: total }, (_, i) =>
    `<button class="hex" data-i="${i}" aria-label="Go to card ${i + 1}"></button>`).join("");
 
  function updateDots() {
    const first = +track.firstElementChild.dataset.id;
    [...pager.children].forEach((b, i) => b.classList.toggle("active", i === first));
  }
 
  function layout() {
    track.style.setProperty("--n", perView());
    track.style.transition = "none";
    track.style.transform = "translateX(0)";
    updateDots();
  }
 
  function slide(fromPercent, toPercent, done) {
    busy = true;
    track.style.transition = "none";
    track.style.transform = `translateX(${fromPercent}%)`;
    track.offsetWidth;                                   // force reflow
    track.style.transition = "transform .45s ease";
    track.style.transform = `translateX(${toPercent}%)`;
    track.addEventListener("transitionend", function end(e) {
      if (e.target !== track) return;
      track.removeEventListener("transitionend", end);
      done();
      track.style.transition = "none";
      track.style.transform = "translateX(0)";
      busy = false;
      updateDots();
    });
  }
 
  function next() {
    if (busy) return;
    slide(0, -step(), () => track.appendChild(track.firstElementChild));
  }
 
  function prev() {
    if (busy) return;
    track.insertBefore(track.lastElementChild, track.firstElementChild);
    slide(-step(), 0, () => {});
  }
 
  function goTo(id) {
    if (busy) return;
    while (+track.firstElementChild.dataset.id !== id) track.appendChild(track.firstElementChild);
    updateDots();
  }
 
  const destPrevBtn = document.getElementById("destPrev");
  const destNextBtn = document.getElementById("destNext");

  if (destPrevBtn) destPrevBtn.addEventListener("click", prev);
  if (destNextBtn) destNextBtn.addEventListener("click", next);

  pager.addEventListener("click", e => {
    const b = e.target.closest(".hex");
    if (b) goTo(+b.dataset.i);
  });
  window.addEventListener("resize", layout);
  layout();


  // section5
 (function () {
  function init() {
    var qs  = function (sel, root) { return (root || document).querySelector(sel); };
    var qsa = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
 
    function activePane() { return qs('.city-pane.active'); }
 
    function showPerson(pane, i) {
      var slides = qsa('.person-slide', pane);
      var tabs   = qsa('.person-nav .nav-link', pane);
      if (!slides.length) return;
      i = (i + slides.length) % slides.length;
      slides.forEach(function (el, k) { el.classList.toggle('active', k === i); });
      tabs.forEach(function (el, k) { el.classList.toggle('active', k === i); });
      var counter = qs('.p-counter', pane);
      if (counter) counter.textContent = ('0' + (i + 1)).slice(-2) + '/' + ('0' + slides.length).slice(-2);
    }
 
    function currentIndex(pane) {
      var slides = qsa('.person-slide', pane);
      for (var k = 0; k < slides.length; k++) if (slides[k].classList.contains('active')) return k;
      return 0;
    }
 
    function showCity(btn) {
      var id = btn.getAttribute('data-city');
      var pane = document.getElementById(id);
      if (!pane) return;
      qsa('#cityNav .nav-link').forEach(function (el) { el.classList.toggle('active', el === btn); });
      qsa('.city-pane').forEach(function (p) { p.classList.toggle('active', p === pane); });
      showPerson(pane, 0);
    }
 
    var nav = document.getElementById('cityNav');
    function updateChevrons() {
      var prev = document.getElementById('cityPrev'), next = document.getElementById('cityNext');
      if (!nav || !prev || !next) return;
      prev.disabled = nav.scrollLeft <= 0;
      next.disabled = nav.scrollLeft + nav.clientWidth >= nav.scrollWidth - 1;
    }
 
    // One delegated click handler for everything
    document.addEventListener('click', function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
 
      var cityBtn = t.closest('#cityNav [data-city]');
      if (cityBtn) { showCity(cityBtn); return; }
 
      var personBtn = t.closest('.person-nav [data-i]');
      if (personBtn) { showPerson(personBtn.closest('.city-pane'), parseInt(personBtn.getAttribute('data-i'), 10)); return; }
 
      var prev = t.closest('.p-prev');
      if (prev) { var p1 = prev.closest('.city-pane'); showPerson(p1, currentIndex(p1) - 1); return; }
 
      var next = t.closest('.p-next');
      if (next) { var p2 = next.closest('.city-pane'); showPerson(p2, currentIndex(p2) + 1); return; }
 
      if (t.closest('#cityPrev')) { nav.scrollLeft -= 160; setTimeout(updateChevrons, 50); return; }
      if (t.closest('#cityNext')) { nav.scrollLeft += 160; setTimeout(updateChevrons, 50); return; }
 
      if (t.closest('.read-more')) e.preventDefault();
    });
 
    if (nav) nav.addEventListener('scroll', updateChevrons);
    updateChevrons();
  }
 
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();


// section6
(function () {
  function init() {
    var qs  = function (s, r) { return (r || document).querySelector(s); };
    var qsa = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
 
    // Activate hotel i in a pane (card + city tab) and scroll the slider to it
    function showHotel(pane, i, scroll) {
      var cards = qsa('.hotel-card', pane), tabs = qsa('.city-nav .nav-link', pane), track = qs('.track', pane);
      if (!cards.length) return;
      i = Math.max(0, Math.min(i, cards.length - 1));
      cards.forEach(function (el, k) { el.classList.toggle('active', k === i); });
      tabs.forEach(function (el, k) { el.classList.toggle('active', k === i); });
      if (scroll) track.scrollTo({ left: cards[i].offsetLeft, behavior: 'smooth' });
    }
    function cardIndex(card) { return qsa('.hotel-card', card.closest('.cat-pane')).indexOf(card); }
 
    document.addEventListener('click', function (e) {
      var t = e.target; if (!t || !t.closest) return;
 
      var catBtn = t.closest('#catNav [data-cat]');
      if (catBtn) {
        qsa('#catNav .nav-link').forEach(function (el) { el.classList.toggle('active', el === catBtn); });
        qsa('.cat-pane').forEach(function (p) { p.classList.toggle('active', p.id === catBtn.getAttribute('data-cat')); });
        var pane = document.getElementById(catBtn.getAttribute('data-cat'));
        qs('.track', pane).scrollLeft = 0;
        showHotel(pane, 0, false);
        return;
      }
 
      var cityBtn = t.closest('.city-nav [data-i]');
      if (cityBtn) { showHotel(cityBtn.closest('.cat-pane'), parseInt(cityBtn.getAttribute('data-i'), 10), true); return; }
 
      var prev = t.closest('.s-prev'), next = t.closest('.s-next');
      if (prev || next) {
        var track = qs('.track', (prev || next).closest('.cat-pane'));
        track.scrollBy({ left: (next ? 1 : -1) * 399.5, behavior: 'smooth' });
        return;
      }
 
      if (t.closest('.hotel-link')) { e.preventDefault(); return; }
 
      var card = t.closest('.hotel-card');
      if (card) showHotel(card.closest('.cat-pane'), cardIndex(card), false);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();