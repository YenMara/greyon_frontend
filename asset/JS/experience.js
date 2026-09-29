// Keep the highlight on the selected city
    document.querySelectorAll('#cities .city').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector('#cities .active')?.classList.remove('active');
        link.classList.add('active');
      });
    });
    // Expand / collapse the overview copy
    const overview = document.getElementById('overview');
    const readMore = document.getElementById('readMore');
    readMore.addEventListener('click', () => {
      const open = overview.classList.toggle('collapsed') === false;
      readMore.textContent = open ? 'Read Less' : 'Read More';
      readMore.setAttribute('aria-expanded', open);
    });
     // Dining slide counter
    document.getElementById('diningCarousel').addEventListener('slid.bs.carousel', e => {
      document.getElementById('diningCount').textContent = String(e.to + 1).padStart(2, '0') + '/04';
    });

       // Arrive slide counter
    document.getElementById('arriveCarousel').addEventListener('slid.bs.carousel', e => {
      document.getElementById('arriveCount').textContent = String(e.to + 1).padStart(2, '0') + '/04';
    });