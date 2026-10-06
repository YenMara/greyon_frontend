(function () {
  function init() {
    var box = document.getElementById('featureText');
    var btn = document.getElementById('readMore');
    if (!box || !btn) return;
    btn.addEventListener('click', function () {
      var open = box.classList.toggle('open');
      btn.textContent = open ? 'Read Less' : 'Read More';
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      // desktop: grow the frame so the longer text stays inside it
      var frame = box.parentNode;
      if (window.matchMedia('(min-width: 992px)').matches) {
        frame.style.height = open ? Math.max(439.5, box.offsetHeight + 29.5 * 2 + 16) + 'px' : '';
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();