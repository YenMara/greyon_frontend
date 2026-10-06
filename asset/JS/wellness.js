// Prev / next moves the track by ONE card
  (function () {
    const track = document.getElementById("hotelTrack");
    const count = document.getElementById("hotelCount");
    if (!track || !count) return;

    const total = track.children.length;
    let index = 0;
 
    const perView = () => parseInt(getComputedStyle(track).getPropertyValue("--per"), 10);
    const pad = n => String(n).padStart(2, "0");
 
    function go(i) {
      const last = total - perView();
      index = i > last ? 0 : i < 0 ? last : i;   // loop around
      track.style.transform = `translateX(-${index * 100 / perView()}%)`;
      count.textContent = `${pad(index + 1)}/${total}`;
    }
    const prevBtn = document.getElementById("hotelPrev");
    const nextBtn = document.getElementById("hotelNext");
    if (!prevBtn || !nextBtn) return;

    prevBtn.onclick = () => go(index - 1);
    nextBtn.onclick = () => go(index + 1);
    window.addEventListener("resize", () => go(index));
  })();