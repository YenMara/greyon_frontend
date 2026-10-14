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
  header?.classList.toggle('scrolled', isScrolled);
  nav?.classList.toggle('scrolled', isScrolled);
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

hotelsToggle?.addEventListener('click', (event) => {
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

mainMenu?.addEventListener('hidden.bs.offcanvas', () => {
  mainMenu.classList.remove('hotels-open');
  hotelsToggle.classList.remove('active');
});

const menuBack = document.getElementById('menuBack');
menuBack?.addEventListener('click', () => {
  mainMenu.classList.remove('hotels-open');
  hotelsToggle.classList.remove('active');
});
(function () {
  const createHotelSelectionPanel = () => {
    const panel = document.createElement('div');
    panel.className = 'offcanvas offcanvas-start select-hotel-menu';
    panel.tabIndex = -1;
    panel.id = 'hotelSelectMenu';
    panel.setAttribute('aria-label', 'Select a hotel');

    const icon = (name) => {
      const element = document.createElement('i');
      element.className = `fa-solid ${name}`;
      element.setAttribute('aria-hidden', 'true');
      return element;
    };

    const top = document.createElement('div');
    top.className = 'sh-top';

    const backButton = document.createElement('button');
    backButton.type = 'button';
    backButton.className = 'sh-back';
    backButton.id = 'shBack';
    backButton.setAttribute('aria-label', 'Back to menu');
    backButton.append(icon('fa-chevron-left'));
    const backLabel = document.createElement('span');
    backLabel.textContent = 'Back';
    backButton.append(backLabel);

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close-custom sh-close';
    closeButton.setAttribute('data-bs-dismiss', 'offcanvas');
    closeButton.setAttribute('aria-label', 'Close menu');
    closeButton.append(icon('fa-xmark'));
    top.append(backButton, closeButton);

    const body = document.createElement('div');
    body.className = 'sh-body';
    const regions = document.createElement('ul');
    regions.className = 'sh-regions';
    regions.id = 'shRegions';
    const hotelList = document.createElement('ul');
    hotelList.className = 'sh-hotels';
    hotelList.id = 'shHotels';

    [
      { name: 'All Regions', id: 'all' },
      { name: 'Asia', id: 'asia' },
      { name: 'Europe', id: 'europe' },
      { name: 'Americas', id: 'americas' },
    ].forEach(({ name, id }, index) => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = '#';
      link.className = `sh-region${index === 0 ? ' active' : ''}`;
      link.dataset.region = id;
      const label = document.createElement('span');
      label.textContent = name;
      link.append(label, icon('fa-chevron-right'));
      item.append(link);
      regions.append(item);
    });

    [
      ['asia', 'The Greyon Hong Kong', 'The Grande Dame of the Far East'],
      ['asia', 'The Greyon Shanghai', 'Glamour redefined on The Bund'],
      ['asia', 'The Greyon Beijing', 'Heart of the Capital, Timeless Elegance'],
      ['asia', 'The Greyon Tokyo', 'A shining landmark located opposite the Imperial Palace'],
      ['americas', 'The Greyon New York', 'Fifth Avenue’s most glamorous address'],
      ['americas', 'The Greyon Chicago', 'Far Eastern graciousness meets Midwestern hospitality'],
      ['americas', 'The Greyon Beverly Hills', 'An exclusive oasis in The City of Angels'],
      ['europe', 'The Greyon London', 'Stylish Grandeur in the Heart of Belgravia'],
    ].forEach(([region, name, description]) => {
      const item = document.createElement('li');
      item.className = 'sh-hotel';
      item.dataset.region = region;
      const link = document.createElement('a');
      link.href = '#';

      const thumbnail = document.createElement('span');
      thumbnail.className = 'sh-thumb';
      const image = document.createElement('img');
      image.src = './asset/img/Poolside Lunch-min.jpg';
      image.alt = '';
      thumbnail.append(image);

      const copy = document.createElement('span');
      copy.className = 'sh-copy';
      const title = document.createElement('strong');
      title.textContent = name;
      const detail = document.createElement('em');
      detail.textContent = description;
      copy.append(title, detail);
      link.append(thumbnail, copy);
      item.append(link);
      hotelList.append(item);
    });

    body.append(regions, hotelList);
    panel.append(top, body);
    document.body.append(panel);
    return panel;
  };

  const mainMenuElement = document.getElementById('mainMenu');
  const openLinks = document.querySelectorAll('#selectHotelLink, [data-select-hotel]');
  if (!openLinks.length) return;

  let hotelMenuElement = document.getElementById('hotelSelectMenu');
  if (!hotelMenuElement) hotelMenuElement = createHotelSelectionPanel();

  const backButton = document.getElementById('shBack');
  if (!backButton) return;

  const mainMenuInstance = mainMenuElement
    ? bootstrap.Offcanvas.getOrCreateInstance(mainMenuElement)
    : null;
  const hotelMenuInstance = bootstrap.Offcanvas.getOrCreateInstance(hotelMenuElement);
  const hotelRegionLinks = document.querySelectorAll('#shRegions .sh-region');
  const selectHotelItems = document.querySelectorAll('#shHotels .sh-hotel');

  function swapOffcanvas(fromInstance, fromElement, toInstance) {
    fromElement.addEventListener(
      'hide.bs.offcanvas',
      () => toInstance.show(),
      { once: true },
    );
    fromInstance.hide();
  }

  openLinks.forEach((openLink) => {
    openLink.addEventListener('click', (event) => {
      event.preventDefault();
      if (mainMenuInstance && mainMenuElement.classList.contains('show')) {
        swapOffcanvas(mainMenuInstance, mainMenuElement, hotelMenuInstance);
      } else {
        hotelMenuInstance.show();
      }
    });
  });

  backButton.addEventListener('click', () => {
    if (mainMenuInstance) {
      swapOffcanvas(hotelMenuInstance, hotelMenuElement, mainMenuInstance);
    } else {
      hotelMenuInstance.hide();
    }
  });

  function filterHotels(region) {
    hotelRegionLinks.forEach((link) => {
      link.classList.toggle('active', link.dataset.region === region);
    });
    selectHotelItems.forEach((item) => {
      item.hidden = region !== 'all' && item.dataset.region !== region;
    });
  }

  hotelRegionLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      filterHotels(link.dataset.region);
    });
  });

  hotelMenuElement.addEventListener('show.bs.offcanvas', () => filterHotels('all'));
})();
