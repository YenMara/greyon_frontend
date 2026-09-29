const footerNewsletterForm = document.getElementById('footerNewsletterForm');

if (footerNewsletterForm) {
  footerNewsletterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = footerNewsletterForm.email.value.trim();
    if (!email) return;

    console.log('Footer newsletter signup:', email);
    footerNewsletterForm.reset();
  });
}

const footerLanguageLinks = document.querySelectorAll('.fb-lang a[data-language]');
footerLanguageLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    footerLanguageLinks.forEach((languageLink) => languageLink.classList.remove('active'));
    link.classList.add('active');
  });
});

const footerYear = document.getElementById('footerYear');
if (footerYear) footerYear.textContent = new Date().getFullYear();
