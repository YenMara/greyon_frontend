/* ==========================================================
   Booking bar (desktop hero): hotels, dates, guests, codes
   ========================================================== */
(() => {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  const fields = [...form.querySelectorAll('.booking-field')];

  // ---------- open / close panels (one at a time) ----------
  const datesField = fields[1];
  const codesField = fields[3];
  const setOpen = (field, open) => {
    const wasOpen = field.classList.contains('is-open');
    field.querySelector('.booking-trigger').setAttribute('aria-expanded', String(open));
    field.querySelector('.booking-pop').hidden = !open;
    field.classList.toggle('is-open', open);
    if (field === datesField && open !== wasOpen) {
      if (open) onDatesOpen(); else finalizeDates();
    }
    if (field === codesField && wasOpen && !open) renderCodes();
  };
  const closeAll = (except) => fields.forEach((f) => { if (f !== except) setOpen(f, false); });

  fields.forEach((field) => {
    field.querySelector('.booking-trigger').addEventListener('click', () => {
      const willOpen = field.querySelector('.booking-pop').hidden;
      closeAll(field);
      setOpen(field, willOpen);
    });
  });
  document.addEventListener('click', (e) => { if (!form.contains(e.target)) closeAll(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });

  // ---------- hotels (built from the hotels already in the slide-out menu) ----------
  const hotelField = fields[0];
  const hotelList = document.getElementById('hotelPop');
  const hotelValue = document.getElementById('hotelValue');
  let selectedHotel = '';

  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  document.querySelectorAll('.hotel-item').forEach((item) => {
    const name = item.querySelector('h3').textContent.trim();
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'booking-option';
    btn.setAttribute('role', 'option');
    btn.setAttribute('aria-selected', 'false');
    btn.dataset.name = name;
    btn.append(name);
    const region = document.createElement('small');
    region.textContent = cap(item.dataset.region || '');
    btn.append(region);
    hotelList.append(btn);
  });

  hotelList.addEventListener('click', (e) => {
    const btn = e.target.closest('.booking-option');
    if (!btn) return;
    selectedHotel = btn.dataset.name;
    hotelValue.textContent = selectedHotel;
    hotelList.querySelectorAll('.booking-option').forEach((b) =>
      b.setAttribute('aria-selected', String(b === btn))
    );
    setOpen(hotelField, false);
  });
  
  /* ===== RESERVE DRAWER LOGIC =====
   Requires Bootstrap's JS bundle (already loaded on this page for #mainMenu).
   Include this file after bootstrap.bundle.min.js, e.g.:
   <script src="./js/reserve-drawer.js"></script>
*/
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    const drawer = document.getElementById("reserveDrawer");
    if (!drawer) return;

    wireOpenTriggers(drawer);
    wireAccordionRows(drawer);
    populateHotelList(drawer);
    setupDates(drawer);
    setupGuests(drawer);
    setupCodes(drawer);
    wireSubmit(drawer);
  }

  // Open the drawer from the existing "Reserve" buttons in the navbar,
  // without needing to hand-edit data-bs-* attributes on them.
  function wireOpenTriggers(drawer) {
    const offcanvas =
      bootstrap.Offcanvas.getOrCreateInstance(drawer);
    const openButtons = document.querySelectorAll(
      ".btn-reserve, .mobile-actions button"
    );
    openButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        offcanvas.show();
      });
    });
  }

  // Each row (Hotels / Dates / Guests / Special codes) expands its own
  // panel underneath; opening one closes the others.
  function wireAccordionRows(drawer) {
    const triggers = drawer.querySelectorAll(".rd-trigger");
    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const panelId = trigger.getAttribute("aria-controls");
        const panel = document.getElementById(panelId);
        const isOpen = trigger.getAttribute("aria-expanded") === "true";

        triggers.forEach((t) => {
          t.setAttribute("aria-expanded", "false");
          const p = document.getElementById(t.getAttribute("aria-controls"));
          if (p) p.hidden = true;
        });

        if (!isOpen && panel) {
          trigger.setAttribute("aria-expanded", "true");
          panel.hidden = false;
        }
      });
    });
  }

  function populateHotelList(drawer) {
    const list = drawer.querySelector("#rdHotelList");
    const valueEl = drawer.querySelector("#rdHotelValue");
    if (!list) return;

    // Reuse the hotel names already defined in the slide-out menu.
    const names = Array.from(
      document.querySelectorAll(".hotel-item h3")
    ).map((h3) => h3.textContent.trim());

    const items = names.length ? names : ["Select a hotel"];
    items.forEach((name) => {
      const li = document.createElement("li");
      li.textContent = name;
      li.addEventListener("click", () => {
        list
          .querySelectorAll("li")
          .forEach((el) => el.classList.remove("is-selected"));
        li.classList.add("is-selected");
        if (valueEl) valueEl.textContent = name;
        closePanel(drawer, "rdHotelPanel");
      });
      list.appendChild(li);
    });
  }

  function setupDates(drawer) {
    const checkIn = drawer.querySelector("#rdCheckIn");
    const checkOut = drawer.querySelector("#rdCheckOut");
    const valueEl = drawer.querySelector("#rdDatesValue");
    const nightsEl = drawer.querySelector("#rdNights");
    if (!checkIn || !checkOut) return;

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    checkIn.value = toInputDate(today);
    checkOut.value = toInputDate(tomorrow);
    checkIn.min = toInputDate(today);

    render();

    checkIn.addEventListener("change", () => {
      if (checkOut.value <= checkIn.value) {
        const next = new Date(checkIn.value);
        next.setDate(next.getDate() + 1);
        checkOut.value = toInputDate(next);
      }
      checkOut.min = checkIn.value;
      render();
    });
    checkOut.addEventListener("change", render);

    function render() {
      const nights = Math.max(
        1,
        Math.round(
          (new Date(checkOut.value) - new Date(checkIn.value)) /
            (1000 * 60 * 60 * 24)
        )
      );
      if (valueEl) {
        valueEl.textContent =
          formatDate(checkIn.value) + " \u2192 " + formatDate(checkOut.value);
      }
      if (nightsEl) {
        nightsEl.textContent = nights + (nights === 1 ? " Night" : " Nights");
      }
    }
  }

  function toInputDate(d) {
    return d.toISOString().slice(0, 10);
  }

  function formatDate(value) {
    if (!value) return "";
    const d = new Date(value + "T00:00:00");
    return d.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  // --- Guests: rooms with adult/child steppers, "Add room" up to 8 rooms ---
  const MAX_ROOMS = 8;
  const MAX_GUESTS_PER_ROOM = 4;

  function setupGuests(drawer) {
    const container = drawer.querySelector("#rdRooms");
    const addBtn = drawer.querySelector("#rdAddRoom");
    const valueEl = drawer.querySelector("#rdGuestsValue");
    if (!container) return;

    let rooms = [{ adults: 2, children: 0 }];

    render();

    addBtn.addEventListener("click", () => {
      if (rooms.length >= MAX_ROOMS) return;
      rooms.push({ adults: 1, children: 0 });
      render();
    });

    function render() {
      container.innerHTML = "";
      rooms.forEach((room, i) => {
        const roomEl = document.createElement("div");
        roomEl.className = "rd-room";
        roomEl.innerHTML =
          '<p class="rd-room-title">Room ' +
          (i + 1) +
          "</p>" +
          stepperRow("Adults", room.adults, 1) +
          '<div class="rd-children-control">' +
          stepperRow("Children", room.children, 0) +
          '<button type="button" class="rd-remove-room" data-remove-room aria-label="Remove Room ' +
          (i + 1) +
          '">Remove</button></div>';
        container.appendChild(roomEl);

        const removeBtn = roomEl.querySelector("[data-remove-room]");
        removeBtn.disabled = rooms.length === 1;
        removeBtn.addEventListener("click", () => {
          if (rooms.length === 1) return;
          rooms.splice(i, 1);
          render();
        });

        roomEl.querySelectorAll("[data-op]").forEach((btn) => {
          btn.addEventListener("click", () => {
            const key = btn.getAttribute("data-key");
            const op = btn.getAttribute("data-op");
            const total = room.adults + room.children;
            if (op === "inc" && total < MAX_GUESTS_PER_ROOM) {
              room[key]++;
            } else if (op === "dec") {
              const min = key === "adults" ? 1 : 0;
              if (room[key] > min) room[key]--;
            }
            render();
          });
        });
      });

      addBtn.disabled = rooms.length >= MAX_ROOMS;

      const totalAdults = rooms.reduce((s, r) => s + r.adults, 0);
      const totalChildren = rooms.reduce((s, r) => s + r.children, 0);
      if (valueEl) {
        valueEl.textContent =
          rooms.length +
          (rooms.length === 1 ? " Room" : " Rooms") +
          " \u2022 " +
          totalAdults +
          " Adults " +
          totalChildren +
          " Children";
      }
    }

    function stepperRow(label, value, min) {
      return (
        '<div class="rd-stepper-row"><span>' +
        label +
        '</span><span class="rd-stepper">' +
        '<button type="button" data-op="dec" data-key="' +
        label.toLowerCase() +
        '">\u2212</button><span>' +
        value +
        '</span><button type="button" data-op="inc" data-key="' +
        label.toLowerCase() +
        '">+</button></span></div>'
      );
    }
  }

  function setupCodes(drawer) {
    const radios = drawer.querySelectorAll('input[name="rdCodeType"]');
    const promo = drawer.querySelector("#rdPromoCode");
    const group = drawer.querySelector("#rdGroupCode");
    const valueEl = drawer.querySelector("#rdCodesValue");
    const doneBtn = drawer.querySelector("#rdCodeDone");
    const advisor = drawer.querySelector("#rdAdvisorId");

    radios.forEach((radio) => {
      radio.addEventListener("change", () => {
        const isPromo = radio.value === "promo" && radio.checked;
        promo.disabled = !isPromo;
        group.disabled = isPromo;
      });
    });

    doneBtn.addEventListener("click", () => {
      const active =
        promo.value.trim() || group.value.trim() || advisor.value.trim();
      if (valueEl) {
        valueEl.textContent = active
          ? promo.value.trim() || group.value.trim() || advisor.value.trim()
          : "Add Special Codes";
      }
      closePanel(drawer, "rdCodesPanel");
    });
  }

  function closePanel(drawer, panelId) {
    const panel = document.getElementById(panelId);
    const trigger = drawer.querySelector(
      '[aria-controls="' + panelId + '"]'
    );
    if (panel) panel.hidden = true;
    if (trigger) trigger.setAttribute("aria-expanded", "false");
  }

  function wireSubmit(drawer) {
    const form = drawer.querySelector("#reserveDrawerForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // Wire this up to your actual booking/search endpoint.
      // For now it just closes the drawer once fields are chosen.
      const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(drawer);
      offcanvas.hide();
    });
  }
})();

  // ---------- dates: two-month range calendar ----------
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const MONTHS_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const WEEKDAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const DAY_MS = 86400000;

  const pad = (n) => String(n).padStart(2, '0');
  const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fromISO = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const fmt = (d) => `${pad(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  const sameDay = (a, b) => !!a && !!b && a.getTime() === b.getTime();
  const nightsLabel = (n) => `${n} Night${n === 1 ? '' : 's'}`;

  const checkIn = document.getElementById('checkIn');
  const checkOut = document.getElementById('checkOut');
  const datesValue = document.getElementById('datesValue');
  const calNights = document.getElementById('calNights');
  const calPrev = document.getElementById('calPrev');
  const calNext = document.getElementById('calNext');
  const calMonths = form.querySelector('.cal-months');
  const monthEls = [document.getElementById('calMonthA'), document.getElementById('calMonthB')];

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let start = today;              // check-in
  let end = addDays(today, 1);    // check-out (null while the guest is still choosing it)
  let pending = false;            // true after the first click, until the second click
  let hover = null;               // day under the pointer while choosing check-out
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth(); // month shown on the left

  function syncInputs() {
    checkIn.value = toISO(start);
    if (end) checkOut.value = toISO(end);
  }

  function buildMonth(el, year, month) {
    el.textContent = '';

    const title = document.createElement('div');
    title.className = 'cal-title';
    title.textContent = `${MONTHS_FULL[month]} ${year}`;

    const weekdays = document.createElement('div');
    weekdays.className = 'cal-weekdays';
    WEEKDAYS.forEach((name) => {
      const s = document.createElement('span');
      s.textContent = name;
      weekdays.append(s);
    });

    const grid = document.createElement('div');
    grid.className = 'cal-grid';
    const lead = new Date(year, month, 1).getDay();
    for (let i = 0; i < lead; i++) {
      const blank = document.createElement('span');
      blank.className = 'cal-blank';
      grid.append(blank);
    }
    const count = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= count; d++) {
      const date = new Date(year, month, d);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cal-day';
      btn.textContent = d;
      btn.dataset.date = toISO(date);
      btn.setAttribute('aria-label', `${d} ${MONTHS_FULL[month]} ${year}`);
      btn.disabled = date < today;
      grid.append(btn);
    }
    el.append(title, weekdays, grid);
  }

  function paint() {
    const previewEnd = pending && hover && hover > start ? hover : null;

    monthEls.forEach((el) => {
      el.querySelectorAll('.cal-day').forEach((btn) => {
        const d = fromISO(btn.dataset.date);
        const isStart = sameDay(d, start);
        const isEnd = !pending && sameDay(d, end);
        const inRange = isStart || (!pending && end && d >= start && d <= end);
        const inPreview = !!previewEnd && d > start && d <= previewEnd;
        btn.classList.toggle('in-range', !!inRange);
        btn.classList.toggle('is-start', isStart);
        btn.classList.toggle('is-end', isEnd);
        btn.classList.toggle('is-preview', inPreview);
      });
    });

    if (pending) {
      const n = previewEnd ? Math.round((previewEnd - start) / DAY_MS) : 0;
      calNights.textContent = n ? nightsLabel(n) : 'Select check-out';
      datesValue.textContent = `${fmt(start)} - ${previewEnd ? fmt(previewEnd) : 'Select date'}`;
    } else {
      calNights.textContent = nightsLabel(Math.round((end - start) / DAY_MS));
      datesValue.textContent = `${fmt(start)} - ${fmt(end)}`;
    }
  }

  function renderMonths() {
    buildMonth(monthEls[0], viewYear, viewMonth);
    const right = new Date(viewYear, viewMonth + 1, 1);
    buildMonth(monthEls[1], right.getFullYear(), right.getMonth());

    const offset = (viewYear - today.getFullYear()) * 12 + (viewMonth - today.getMonth());
    calPrev.disabled = offset <= 0;   // can't go before this month
    calNext.disabled = offset >= 16;  // up to ~17 months ahead
    paint();
  }

  function shiftMonth(delta) {
    const d = new Date(viewYear, viewMonth + delta, 1);
    viewYear = d.getFullYear();
    viewMonth = d.getMonth();
    renderMonths();
  }

  // if the panel closes before a check-out was picked, default to one night
  function finalizeDates() {
    if (pending) {
      end = addDays(start, 1);
      pending = false;
      hover = null;
    }
    syncInputs();
    paint();
  }

  function onDatesOpen() {
    viewYear = start.getFullYear();
    viewMonth = start.getMonth();
    renderMonths();
  }

  calPrev.addEventListener('click', () => shiftMonth(-1));
  calNext.addEventListener('click', () => shiftMonth(1));

  calMonths.addEventListener('click', (e) => {
    const btn = e.target.closest('.cal-day');
    if (!btn || btn.disabled) return;
    const day = fromISO(btn.dataset.date);

    if (!pending || day <= start) {          // first click (or an earlier day): new check-in
      start = day;
      end = null;
      pending = true;
      hover = null;
      paint();
      return;
    }
    end = day;                               // second click: check-out
    pending = false;
    hover = null;
    syncInputs();
    paint();
    setTimeout(() => setOpen(datesField, false), 250);
  });

  // preview the stay while moving the pointer over later days
  calMonths.addEventListener('mouseover', (e) => {
    if (!pending) return;
    const btn = e.target.closest('.cal-day');
    if (!btn || btn.disabled) return;
    hover = fromISO(btn.dataset.date);
    paint();
  });
  calMonths.addEventListener('mouseleave', () => {
    if (!pending) return;
    hover = null;
    paint();
  });

  syncInputs();
  renderMonths();

  // ---------- guests: per-room adults / children ----------
  const MAX_GUESTS_PER_ROOM = 4;
  const MAX_ROOMS = 8;
  const rooms = [{ adults: 2, children: 0 }];

  const guestsValue = document.getElementById('guestsValue');
  const guestsRoomsEl = document.getElementById('guestsRooms');
  const addRoomBtn = document.getElementById('addRoom');

  const ICON_MINUS = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="butt" aria-hidden="true"><path d="M1 7h12"/></svg>';
  const ICON_PLUS = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="butt" aria-hidden="true"><path d="M1 7h12M7 1v12"/></svg>';

  const guestRow = (i, kind, label, note) => {
    const room = rooms[i];
    const full = room.adults + room.children >= MAX_GUESTS_PER_ROOM;
    const atMin = kind === 'adults' ? room.adults <= 1 : room.children <= 0;
    const who = rooms.length > 1 ? ` in room ${i + 1}` : '';
    return `
      <div class="guest-row">
        <div class="guest-label">${label}${note ? `<small>${note}</small>` : ''}</div>
        <div class="stepper">
          <button type="button" data-room="${i}" data-kind="${kind}" data-dir="-1" aria-label="Fewer ${kind}${who}"${atMin ? ' disabled' : ''}>${ICON_MINUS}</button>
          <output>${room[kind]}</output>
          <button type="button" data-room="${i}" data-kind="${kind}" data-dir="1" aria-label="More ${kind}${who}"${full ? ' disabled' : ''}>${ICON_PLUS}</button>
        </div>
      </div>`;
  };

  const roomBlock = (i) => `
    <div class="guest-room">
      ${rooms.length > 1
        ? `<div class="guest-room-head"><span>Room ${i + 1}</span><button type="button" class="guest-remove" data-remove="${i}">Remove</button></div>`
        : ''}
      ${guestRow(i, 'adults', 'Adults', '')}
      ${guestRow(i, 'children', 'Children', '0 to 11yrs')}
    </div>`;

  function renderGuests() {
    const adults = rooms.reduce((sum, r) => sum + r.adults, 0);
    const children = rooms.reduce((sum, r) => sum + r.children, 0);
    guestsValue.innerHTML =
      `${rooms.length} Room${rooms.length > 1 ? 's' : ''} <span class="booking-dot">&bull;</span> ` +
      `${adults} Adult${adults > 1 ? 's' : ''} &nbsp;${children} ${children === 1 ? 'Child' : 'Children'}`;

    const scroll = guestsRoomsEl.scrollTop;
    guestsRoomsEl.innerHTML = rooms.map((_, i) => roomBlock(i)).join('');
    guestsRoomsEl.scrollTop = scroll;
    addRoomBtn.disabled = rooms.length >= MAX_ROOMS;
  }

  guestsRoomsEl.addEventListener('click', (e) => {
    const remove = e.target.closest('[data-remove]');
    if (remove) {
      rooms.splice(Number(remove.dataset.remove), 1);
      renderGuests();
      return;
    }

    const btn = e.target.closest('button[data-dir]');
    if (!btn || btn.disabled) return;
    const { room: i, kind, dir } = btn.dataset;
    const room = rooms[Number(i)];
    const next = room[kind] + Number(dir);
    const min = kind === 'adults' ? 1 : 0;
    const otherKind = kind === 'adults' ? 'children' : 'adults';
    if (next < min || next + room[otherKind] > MAX_GUESTS_PER_ROOM) return;
    room[kind] = next;
    renderGuests();

    // the buttons were rebuilt: put keyboard focus back on the same one
    const again = guestsRoomsEl.querySelector(`[data-room="${i}"][data-kind="${kind}"][data-dir="${dir}"]`);
    if (again && !again.disabled) again.focus();
  });

  addRoomBtn.addEventListener('click', () => {
    if (rooms.length >= MAX_ROOMS) return;
    rooms.push({ adults: 2, children: 0 });
    renderGuests();
    guestsRoomsEl.scrollTop = guestsRoomsEl.scrollHeight;
  });

  renderGuests();

  // ---------- special codes: promo / group code + travel advisor ----------
  const codesValue = document.getElementById('codesValue');
  const promoInput = document.getElementById('promoCode');
  const groupInput = document.getElementById('groupCode');
  const advisorInput = document.getElementById('advisorId');
  const codeTypeRadios = [...form.querySelectorAll('input[name="codeType"]')];
  const codeInputs = { promo: promoInput, group: groupInput };

  const currentCodeType = () => (codeTypeRadios.find((r) => r.checked) || {}).value || 'promo';
  const cleanCode = (input) => input.value.trim().toUpperCase();

  // only the selected type (promo or group) can be typed into
  function syncCodeInputs() {
    const type = currentCodeType();
    Object.entries(codeInputs).forEach(([key, input]) => { input.disabled = key !== type; });
  }

  function renderCodes() {
    const parts = [];
    const code = cleanCode(codeInputs[currentCodeType()]);
    const advisor = advisorInput.value.trim();
    if (code) parts.push(code);
    if (advisor) parts.push(`TA ${advisor}`);
    codesValue.textContent = parts.length ? parts.join(', ') : 'Add Special Codes';
  }

  function applyCodes() {
    renderCodes();
    setOpen(codesField, false);
  }

  codeTypeRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      syncCodeInputs();
      codeInputs[currentCodeType()].focus();
    });
  });

  document.getElementById('codeDone').addEventListener('click', applyCodes);
  [promoInput, groupInput, advisorInput].forEach((input) => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); applyCodes(); }
    });
  });

  syncCodeInputs();

  // ---------- Reserve ----------
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    finalizeDates();
    renderCodes();
    if (!selectedHotel) {            // a hotel is required: open the list instead of submitting
      closeAll(hotelField);
      setOpen(hotelField, true);
      return;
    }
    const params = new URLSearchParams({
      hotel: selectedHotel,
      checkin: checkIn.value,
      checkout: checkOut.value,
      rooms: rooms.length,
      adults: rooms.reduce((sum, r) => sum + r.adults, 0),
      children: rooms.reduce((sum, r) => sum + r.children, 0),
      roomGuests: rooms.map((r) => `${r.adults}-${r.children}`).join(','), // adults-children per room
      codeType: currentCodeType(),
      code: cleanCode(codeInputs[currentCodeType()]),
      advisorId: advisorInput.value.trim(),
    });
    // TODO: send to your booking engine, e.g.
    // window.location.href = `/booking?${params}`;
    console.log('Reserve:', params.toString());
  });
})();

/* ==========================================================
   Our Hotels carousel
   - Reads the hotels already listed in the slide-out menu
     (.hotel-item), so you only maintain that list in one place.
   - Load AFTER home.js:  <script src="./JS/our-hotels.js"></script>
   ========================================================== */
(() => {
  const carouselEl = document.getElementById("hotelsCarousel");

  if (!carouselEl) return;

  const innerEl = document.getElementById("hotelsInner");
  const prevBtn = document.getElementById("hotelsPrev");
  const nextBtn = document.getElementById("hotelsNext");
  const tabs = document.querySelectorAll(".oh-tab");

  let region = "all";

  // --------------------------------------------------
  // Get all hotel cards from THIS section only
  // --------------------------------------------------
  const hotelCards = [
    ...innerEl.querySelectorAll(".hotel-card")
  ];

  // --------------------------------------------------
  // Filter hotels by region
  // --------------------------------------------------
  function filterHotels() {

    hotelCards.forEach((card) => {

      const cardRegion = card.dataset.region;

      if (region === "all" || cardRegion === region) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }

    });

  }

  // --------------------------------------------------
  // Region tabs
  // --------------------------------------------------
  tabs.forEach((btn) => {

    btn.addEventListener("click", () => {

      // Remove active state
      tabs.forEach((tab) => {
        tab.classList.remove("is-active");
        tab.setAttribute("aria-pressed", "false");
      });

      // Add active state
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");

      // Get selected region
      region = btn.dataset.region;

      // Filter cards
      filterHotels();

    });

  });

  // --------------------------------------------------
  // Bootstrap carousel
  // --------------------------------------------------
  const carousel = new bootstrap.Carousel(carouselEl, {
    interval: false,
    ride: false,
    wrap: false,
    touch: true
  });

  // --------------------------------------------------
  // Update arrows
  // --------------------------------------------------
  function updateArrows() {

    const activeSlide = innerEl.querySelector(
      ".carousel-item.active"
    );

    if (!activeSlide) return;

    const slides = [
      ...innerEl.querySelectorAll(".carousel-item")
    ];

    const index = slides.indexOf(activeSlide);

    prevBtn.hidden = index <= 0;
    nextBtn.hidden = index >= slides.length - 1;

  }

  // --------------------------------------------------
  // Bootstrap carousel event
  // --------------------------------------------------
  carouselEl.addEventListener(
    "slid.bs.carousel",
    updateArrows
  );

  // Initial state
  filterHotels();
  updateArrows();

})();

/* ==========================================================
   Featured Offers: pause / play the card video
   Load AFTER home.js:  <script src="./JS/featured-offers.js"></script>
   ========================================================== */
(() => {
  const video = document.getElementById('offerVideo');
  const btn = document.getElementById('offerPause');
  if (!video || !btn) return;

  const setState = (paused) => {
    btn.classList.toggle('is-paused', paused);
    btn.setAttribute('aria-label', paused ? 'Play video' : 'Pause video');
  };

  btn.addEventListener('click', () => {
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });

  video.addEventListener('play', () => setState(false));
  video.addEventListener('pause', () => setState(true));

  // respect "reduce motion": start paused
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.removeAttribute('autoplay');
    video.pause();
    setState(true);
  }
})();

/* ==========================================================
   Events carousel: looping, centred slide with neighbours peeking.
   Load AFTER home.js:  <script src="./JS/events.js"></script>

   How it works: the first and last slide are cloned at the ends of the
   track so there is always a neighbour on both sides. CSS moves the track
   from a single variable (--ev-i); after sliding onto a clone, we jump
   (without animation) to the matching real slide.
   ========================================================== */
(() => {
  const root = document.getElementById('events');
  const track = document.getElementById('evTrack');
  if (!root || !track) return;

  const viewport = root.querySelector('.ev-viewport');
  const prevBtn = document.getElementById('evPrev');
  const nextBtn = document.getElementById('evNext');
  const counter = document.getElementById('evCounter');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const real = [...track.children];
  const n = real.length;
  if (n === 0) return;

  // one slide only: nothing to move
  if (n === 1) {
    root.querySelector('.ev-controls').hidden = true;
    return;
  }

  // clones at both ends
  track.prepend(real[n - 1].cloneNode(true));
  track.append(real[0].cloneNode(true));
  const all = [...track.children];          // [clone of last, ...real, clone of first]

  let pos = 1;                               // index in `all` of the centred slide
  let busy = false;
  let fallback = null;

  const pad = (v) => String(v).padStart(2, '0');

  function render() {
    track.style.setProperty('--ev-i', pos);
    const current = ((pos - 1) % n + n) % n;
    counter.textContent = `${pad(current + 1)}/${pad(n)}`;

    all.forEach((slide, i) => {
      const active = i === pos;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
      slide.querySelectorAll('a').forEach((a) => { a.tabIndex = active ? 0 : -1; });
    });
  }

  // apply a position instantly (no slide animation)
  function jumpTo(p) {
    pos = p;
    track.classList.add('no-anim');
    render();
    void track.offsetWidth;                  // flush styles so the jump isn't animated
    track.classList.remove('no-anim');
  }

  // called when the slide animation ends: leave the clones behind
  function settle() {
    clearTimeout(fallback);
    busy = false;
    if (pos === 0) jumpTo(n);
    else if (pos === n + 1) jumpTo(1);
  }

  function step(dir) {
    if (busy) return;
    pos += dir;
    render();
    if (reduceMotion.matches) {
      settle();
    } else {
      busy = true;
      fallback = setTimeout(settle, 800);    // safety net if transitionend never fires
    }
  }

  track.addEventListener('transitionend', (e) => {
    if (e.target === track && e.propertyName === 'transform') settle();
  });

  prevBtn.addEventListener('click', () => step(-1));
  nextBtn.addEventListener('click', () => step(1));

  // clicking a slide at the side brings it to the centre (instead of following its link)
  track.addEventListener('click', (e) => {
    const slide = e.target.closest('.ev-slide');
    if (!slide) return;
    const i = all.indexOf(slide);
    if (i === pos) return;
    e.preventDefault();
    if (i < pos) step(-1); else step(1);
  });

  // swipe on touch screens
  let startX = null;
  viewport.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    startX = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  });

  // left / right arrow keys while focus is inside the section
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { step(-1); }
    else if (e.key === 'ArrowRight') { step(1); }
  });

  jumpTo(1);                                 // start on the first real slide
})();


/* ==========================================================
   Stay Connected: newsletter signup
   ========================================================== */
(() => {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    if (!email) return;

    // TODO: send to your newsletter provider, e.g.
    // fetch('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) });
    console.log('Newsletter signup:', email);
    form.reset();
  });
})();

