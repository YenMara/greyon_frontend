const mainMenu = document.getElementById('mainMenu');
const hotelsToggle = document.getElementById('hotelsToggle');
const header = document.querySelector('.peninsula-header');
const nav = document.querySelector('.peninsula-nav');
const languageToggle = document.getElementById('languageToggle');
const languageMenu = document.getElementById('languageMenu');
const mobileLanguageToggle = document.getElementById('mobileLanguageToggle');
const mobileLanguageMenu = document.getElementById('mobileLanguageMenu');
const regionLinks = document.querySelectorAll('.region-link');
const hotelItems = document.querySelectorAll('.hotel-item');

const updateHeaderState = () => {
  const isScrolled = window.scrollY > 50;
  header.classList.toggle('scrolled', isScrolled);
  nav.classList.toggle('scrolled', isScrolled);
  document.querySelectorAll('.brand-logo[data-logo-default][data-logo-scrolled]').forEach((img) => {
    img.src = isScrolled ? img.dataset.logoScrolled : img.dataset.logoDefault;
  });
};

window.addEventListener('scroll', updateHeaderState, { passive: true });
updateHeaderState();

const languageControls = [
  { toggle: languageToggle, menu: languageMenu },
  { toggle: mobileLanguageToggle, menu: mobileLanguageMenu },
].filter(({ toggle, menu }) => toggle && menu);

languageControls.forEach(({ toggle, menu }) => {
  toggle.addEventListener('click', (event) => {
    event.preventDefault();
    const isOpen = menu.hidden;
    languageControls.forEach(({ toggle: otherToggle, menu: otherMenu }) => {
      otherMenu.hidden = true;
      otherToggle.setAttribute('aria-expanded', 'false');
    });
    menu.hidden = !isOpen;
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  menu.addEventListener('click', (event) => {
    const option = event.target.closest('[data-language]');
    if (!option) return;
    event.preventDefault();
    toggle.querySelector('span:last-child').textContent = option.dataset.language;
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('click', (event) => {
  languageControls.forEach(({ toggle, menu }) => {
    if (!toggle.contains(event.target) && !menu.contains(event.target)) {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  languageControls.forEach(({ toggle, menu }) => {
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
  });
});

hotelsToggle.addEventListener('click', (event) => {
  event.preventDefault();
  mainMenu.classList.toggle('hotels-open');
  hotelsToggle.classList.toggle('active');
});

regionLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    regionLinks.forEach((regionLink) => regionLink.classList.remove('active'));
    link.classList.add('active');

    const region = link.dataset.region;
    hotelItems.forEach((item) => {
      const show = region === 'all' || item.dataset.region === region;
      item.style.display = show ? '' : 'none';
    });
  });
});

mainMenu.addEventListener('hidden.bs.offcanvas', () => {
  mainMenu.classList.remove('hotels-open');
  hotelsToggle.classList.remove('active');
});

const menuBack = document.getElementById('menuBack');
menuBack.addEventListener('click', () => {
  mainMenu.classList.remove('hotels-open');
  hotelsToggle.classList.remove('active');
});
