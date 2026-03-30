document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.main-nav');
  const dropdownItems = document.querySelectorAll('.has-dropdown');

  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Mobile dropdown toggle
  dropdownItems.forEach((item) => {
    const link = item.querySelector('.nav-link');
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        item.classList.toggle('open');
      }
    });
  });

  // Close nav on link click
  nav.querySelectorAll('a:not(.has-dropdown > .nav-link)').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close nav on outside click
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
      nav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
});
