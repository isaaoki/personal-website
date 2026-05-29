/* 1. DARK MODE TOGGLE */
const html         = document.documentElement;
const themeToggle  = document.getElementById('themeToggle');

// Respect saved preference, then OS preference
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme ?? (prefersDark ? 'dark' : 'light');

html.setAttribute('data-theme', initialTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* 2. SCROLL — frosted nav border */
const navbar = document.getElementById('navbar');

const onScroll = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
};

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load

/* 3. ACTIVE NAV LINK — IntersectionObserver */
const sections   = document.querySelectorAll('main section[id]');
const navLinks   = document.querySelectorAll('.nav__link');
const mobileLinks = document.querySelectorAll('.mobile-menu__link');

const allLinks = [...navLinks, ...mobileLinks];

// Map section id → all matching links
function setActive(id) {
  allLinks.forEach(link => {
    const matches = link.dataset.section === id;
    link.classList.toggle('active', matches);
  });
}

const observerOptions = {
  root: null,
  // Trigger when section reaches ~20% from top of viewport
  rootMargin: `-${parseInt(getComputedStyle(html).getPropertyValue('--nav-height') || 60)}px 0px -60% 0px`,
  threshold: 0,
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setActive(entry.target.id);
    }
  });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));

/* 4. MOBILE MENU */
const menuToggle   = document.getElementById('menuToggle');
const menuClose    = document.getElementById('menuClose');
const mobileMenu   = document.getElementById('mobileMenu');
const backdrop     = document.getElementById('menuBackdrop');

function openMenu() {
  mobileMenu.classList.add('open');
  backdrop.classList.add('open');
  menuToggle.classList.add('open');
  menuToggle.setAttribute('aria-expanded', 'true');
  mobileMenu.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // prevent scroll behind overlay
}

function closeMenu() {
  mobileMenu.classList.remove('open');
  backdrop.classList.remove('open');
  menuToggle.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

menuToggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('open');
  isOpen ? closeMenu() : openMenu();
});

menuClose.addEventListener('click', closeMenu);
backdrop.addEventListener('click', closeMenu);

// Close on link click (smooth scroll + close)
mobileLinks.forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    closeMenu();
    menuToggle.focus(); // return focus for accessibility
  }
});

/* 5. SMOOTH SCROLL */
// Most modern browsers handle scroll-behavior: smooth in CSS,
// but this ensures hash links inside the mobile menu also work.
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});