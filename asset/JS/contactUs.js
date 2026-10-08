  /* contact.js - load after the Bootstrap bundle and header.js
   The number cards live in contact.html; this script only filters,
   copies and validates. */
(function () {
  "use strict";

  var listEl = document.getElementById("ctNumbers");
  if (!listEl) return;

  var items = Array.prototype.slice.call(listEl.querySelectorAll(".ct-item"));
  var searchEl = document.getElementById("ctSearch");
  var pillsEl = document.getElementById("ctPills");
  var emptyEl = document.getElementById("ctEmpty");
  var emptyTerm = document.getElementById("ctEmptyTerm");
  var toastEl = document.getElementById("ctToast");
  var region = "all";

  function norm(s) {
    return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  /* ---------- filter ---------- */
  function applyFilter() {
    var q = norm(searchEl.value.trim());
    var visible = 0;

    items.forEach(function (el) {
      var okRegion = region === "all" || el.dataset.region === region;
      var okText =
        !q ||
        norm(el.dataset.name).indexOf(q) > -1 ||
        norm(el.dataset.code).indexOf(q) === 0;
      var show = okRegion && okText;
      el.classList.toggle("d-none", !show);
      if (show) visible++;
    });

    emptyEl.classList.toggle("d-none", visible > 0);
    if (visible === 0) emptyTerm.textContent = searchEl.value.trim();
  }

  searchEl.addEventListener("input", applyFilter);

  pillsEl.addEventListener("click", function (e) {
    var btn = e.target.closest(".ct-pill");
    if (!btn) return;
    region = btn.getAttribute("data-region");
    pillsEl.querySelectorAll(".ct-pill").forEach(function (b) {
      b.classList.toggle("active", b === btn);
    });
    applyFilter();
  });

  /* ---------- copy number ---------- */
  var toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("show");
    }, 1800);
  }

  listEl.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-copy]");
    if (!btn) return;
    var text = btn.getAttribute("data-copy");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        toast("Number copied");
      });
    } else {
      var t = document.createElement("textarea");
      t.value = text;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      document.body.removeChild(t);
      toast("Number copied");
    }
  });

  /* ---------- form ---------- */
  var form = document.getElementById("ctForm");
  if (form) {
    var submitBtn = document.getElementById("ctSubmit");
    var spinner = submitBtn.querySelector(".spinner-border");
    var successEl = document.getElementById("ctSuccess");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      successEl.classList.add("d-none");
      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }
      submitBtn.disabled = true;
      spinner.classList.remove("d-none");

      // TODO: replace this timeout with your real request, e.g.
      // fetch("/api/contact", { method: "POST", body: new FormData(form) })
      setTimeout(function () {
        submitBtn.disabled = false;
        spinner.classList.add("d-none");
        form.reset();
        form.classList.remove("was-validated");
        successEl.classList.remove("d-none");
      }, 900);
    });
  }
})();
