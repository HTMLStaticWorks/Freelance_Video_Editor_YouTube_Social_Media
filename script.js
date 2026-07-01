/* ==============================================
   CineEdit Pro – script.js
   All interactive functionality
   ============================================== */

'use strict';

/* ==========================================
   1. UTILITY HELPERS
   ========================================== */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const $ = id => document.getElementById(id);

/* ==========================================
   GLOBAL REVEAL FALLBACK
   Forces all .reveal-up elements to show after
   1.5s no matter what, so content is never hidden.
   ========================================== */
function revealAll() {
  qsa('.reveal-up').forEach(el => el.classList.add('revealed'));
}
setTimeout(revealAll, 1500);

/* ==========================================
   2. NAVBAR — scroll + active link
   ========================================== */
const navbar = $('navbar');

// Declare floatBtns HERE so toggleFloatCTA can safely reference it
// before onScroll() is called below.
const floatBtns = $('floating-buttons');

function onScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  updateActiveNavLink();
  toggleFloatCTA();
}

function updateActiveNavLink() {
  const sections = qsa('section[id]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  qsa('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load

/* ==========================================
   3. MOBILE HAMBURGER MENU
   ========================================== */
const hamburger   = $('hamburger');
const mobileMenu  = $('mobile-menu');
const overlay     = $('mobile-overlay');
const mobileClose = $('mobile-close');

function openMobileMenu() {
  hamburger.classList.add('active');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileMenu.classList.add('active');
  mobileMenu.setAttribute('aria-hidden', 'false');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('active');
  mobileMenu.setAttribute('aria-hidden', 'true');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  hamburger.classList.contains('active') ? closeMobileMenu() : openMobileMenu();
});
mobileClose.addEventListener('click', closeMobileMenu);
overlay.addEventListener('click', closeMobileMenu);
qsa('.mobile-nav-link').forEach(link => link.addEventListener('click', closeMobileMenu));

/* ==========================================
   4. THEME TOGGLE (dark / light)
   ========================================== */
const themeBtn  = $('theme-btn');
const themeIcon = $('theme-icon');
const html      = document.documentElement;

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('cineTheme', theme);
  themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

// Load saved theme
const savedTheme = localStorage.getItem('cineTheme') || 'dark';
setTheme(savedTheme);

themeBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

/* ==========================================
   5. RTL TOGGLE
   ========================================== */
const rtlBtn   = $('rtl-btn');
const rtlLabel = $('rtl-label');

function setDir(dir) {
  html.setAttribute('dir', dir);
  localStorage.setItem('cineDir', dir);
  rtlLabel.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
}

// Load saved direction
const savedDir = localStorage.getItem('cineDir') || 'ltr';
setDir(savedDir);

rtlBtn.addEventListener('click', () => {
  const current = html.getAttribute('dir');
  setDir(current === 'rtl' ? 'ltr' : 'rtl');
});

/* ==========================================
   6. SCROLL-REVEAL ANIMATIONS
   ========================================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('revealed'), delay);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0, rootMargin: '0px 0px 0px 0px' });

qsa('.reveal-up').forEach(el => {
  // Immediately reveal elements already in viewport on load
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom >= 0) {
    const delay = parseInt(el.dataset.delay || 0);
    setTimeout(() => el.classList.add('revealed'), delay + 100);
  } else {
    revealObserver.observe(el);
  }
});

/* ==========================================
   7. ANIMATED COUNTERS
   ========================================== */
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);

  const tick = () => {
    start += step;
    if (start >= target) {
      el.textContent = target;
      return;
    }
    el.textContent = Math.floor(start);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      animateCounter(el, parseInt(el.dataset.count));
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

qsa('[data-count]').forEach(el => counterObserver.observe(el));

/* ==========================================
   8. PORTFOLIO FILTER TABS
   ========================================== */
const filterBtns  = qsa('.filter-btn');
const portfolioItems = qsa('.portfolio-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    portfolioItems.forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;
      if (match) {
        item.classList.remove('hidden');
        item.style.animation = 'none';
        requestAnimationFrame(() => {
          item.style.animation = '';
          item.style.animationName = 'fadeInUp';
          item.style.animationDuration = '0.4s';
        });
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

/* ==========================================
   9. BEFORE / AFTER COMPARISON SLIDER
   ========================================== */
const compContainer = $('comparison-container');
const compSlider    = $('comparison-slider');
const compAfter     = compContainer ? compContainer.querySelector('.comparison-after') : null;

if (compContainer && compSlider && compAfter) {
  let isDragging = false;

  function setSliderPos(clientX) {
    const rect = compContainer.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(2, Math.min(98, pct));
    compAfter.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    compSlider.style.left = `${pct}%`;
    compSlider.setAttribute('aria-valuenow', Math.round(pct));
  }

  compSlider.addEventListener('mousedown', e => { isDragging = true; e.preventDefault(); });
  document.addEventListener('mousemove', e => { if (isDragging) setSliderPos(e.clientX); });
  document.addEventListener('mouseup', () => { isDragging = false; });

  compSlider.addEventListener('touchstart', e => { isDragging = true; }, { passive: true });
  document.addEventListener('touchmove', e => { if (isDragging) setSliderPos(e.touches[0].clientX); }, { passive: true });
  document.addEventListener('touchend', () => { isDragging = false; });

  // Keyboard support
  compSlider.addEventListener('keydown', e => {
    const rect = compContainer.getBoundingClientRect();
    const currentLeft = parseFloat(compSlider.style.left) || 50;
    if (e.key === 'ArrowLeft') setSliderPos(rect.left + rect.width * (currentLeft - 5) / 100);
    if (e.key === 'ArrowRight') setSliderPos(rect.left + rect.width * (currentLeft + 5) / 100);
  });
}

/* ==========================================
   10. TESTIMONIALS SLIDER
   ========================================== */
const track = $('testimonials-track');
const dots  = qsa('.dot');
let currentSlide = 0;
let autoSlideTimer;

function goToSlide(index) {
  const cards = qsa('.testimonial-card');
  currentSlide = (index + cards.length) % cards.length;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

$('testi-prev').addEventListener('click', () => {
  goToSlide(currentSlide - 1);
  resetAutoSlide();
});
$('testi-next').addEventListener('click', () => {
  goToSlide(currentSlide + 1);
  resetAutoSlide();
});
dots.forEach(dot => dot.addEventListener('click', () => {
  goToSlide(parseInt(dot.dataset.index));
  resetAutoSlide();
}));

function resetAutoSlide() {
  clearInterval(autoSlideTimer);
  autoSlideTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
}
resetAutoSlide();

/* ==========================================
   11. PRICING TOGGLE (monthly / per-project)
   ========================================== */
const pricingToggle = $('pricing-toggle-input');
if (pricingToggle) {
  pricingToggle.addEventListener('change', () => {
    const isProject = pricingToggle.checked;
    qsa('.monthly-price').forEach(el => el.style.display = isProject ? 'none' : 'inline');
    qsa('.project-price').forEach(el => el.style.display = isProject ? 'inline' : 'none');
    qsa('.monthly-period').forEach(el => el.style.display = isProject ? 'none' : 'inline');
    qsa('.project-period').forEach(el => el.style.display = isProject ? 'inline' : 'none');
  });
}

/* ==========================================
   12. FAQ ACCORDION
   ========================================== */
qsa('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const answer = btn.nextElementSibling;
    const isOpen = !answer.hidden;

    // Close all
    qsa('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      i.querySelector('.faq-answer').hidden = true;
    });

    // Open clicked (if wasn't open)
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      answer.hidden = false;
    }
  });
});

/* ==========================================
   13. CONTACT FORM SUBMISSION
   ========================================== */
const contactForm = $('contact-form');
const formSuccess = $('form-success');
const formSubmit  = $('form-submit-btn');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    // Basic validation
    const name    = $('form-name').value.trim();
    const email   = $('form-email').value.trim();
    const message = $('form-message').value.trim();

    if (!name || !email || !message) {
      alert('Please fill in all required fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Simulate form submission
    formSubmit.disabled = true;
    formSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    setTimeout(() => {
      formSubmit.style.display = 'none';
      formSuccess.hidden = false;
      contactForm.reset();
    }, 1800);
  });
}

/* ==========================================
   14. VIDEO MODAL
   ========================================== */
const videoModal  = $('video-modal');
const modalClose  = $('modal-close');
const modalOverlay = $('modal-overlay');

function openModal() {
  videoModal.hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  videoModal.hidden = true;
  document.body.style.overflow = '';
}

if ($('play-showreel')) {
  $('play-showreel').addEventListener('click', openModal);
}
if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ==========================================
   15. FLOATING BUTTONS — show after scroll & back to top
   ========================================== */
function toggleFloatCTA() {
  if (floatBtns) floatBtns.classList.toggle('visible', window.scrollY > 400);
}

const backToTopBtn = $('back-to-top');
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================
   16. SMOOTH SCROLL for anchor links
   ========================================== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

/* ==========================================
   17. HERO PARTICLES
   ========================================== */
(function createParticles() {
  const container = $('hero-particles');
  if (!container) return;

  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const x    = Math.random() * 100;
    const delay = Math.random() * 8;
    const dur   = Math.random() * 12 + 8;

    Object.assign(p.style, {
      position:        'absolute',
      width:           `${size}px`,
      height:          `${size}px`,
      borderRadius:    '50%',
      background:      `rgba(139,92,246,${Math.random() * 0.5 + 0.1})`,
      left:            `${x}%`,
      bottom:          '-20px',
      animation:       `particleFloat ${dur}s ${delay}s linear infinite`,
      pointerEvents:   'none',
    });
    container.appendChild(p);
  }

  // Inject keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes particleFloat {
      0%   { transform: translateY(0)   rotate(0deg); opacity: 0; }
      10%  { opacity: 1; }
      90%  { opacity: 0.5; }
      100% { transform: translateY(-110vh) rotate(720deg); opacity: 0; }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
})();

/* ==========================================
   18. PORTFOLIO ITEM HOVER PREVIEW (subtle)
   ========================================== */
qsa('.portfolio-thumb img').forEach(img => {
  const thumb = img.closest('.portfolio-thumb');
  thumb.addEventListener('mousemove', e => {
    const rect  = thumb.getBoundingClientRect();
    const x     = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y     = ((e.clientY - rect.top)  / rect.height - 0.5) * 12;
    img.style.transform = `scale(1.06) translate(${x}px, ${y}px)`;
  });
  thumb.addEventListener('mouseleave', () => {
    img.style.transform = '';
  });
});

/* ==========================================
   19. PAGE LOAD — stagger hero reveals
   ========================================== */
// Use DOMContentLoaded so hero content doesn't wait for images
function revealHero() {
  qsa('.hero .reveal-up').forEach((el, i) => {
    setTimeout(() => el.classList.add('revealed'), 150 + i * 150);
  });
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', revealHero);
} else {
  revealHero(); // already ready
}
window.addEventListener('load', revealHero); // belt-and-suspenders
