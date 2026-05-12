// ============================================
// MOVION - Main JavaScript
// ============================================

'use strict';

// ---- Hamburger / mobile menu ----
const hamburger = document.querySelector('.hamburger');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
  });
}

// ---- Stats: Intersection Observer para animar números ----
function animateCounter(el, target, suffix) {
  const duration = 1800;
  const start = performance.now();
  const isDecimal = target % 1 !== 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = target * ease;

    if (isDecimal) {
      el.textContent = current.toFixed(1) + suffix;
    } else {
      el.textContent = Math.round(current).toLocaleString() + suffix;
    }

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// Parsea el valor visible y anima
function parseStatValue(text) {
  const cleaned = text.trim().replace(/,/g, '');
  const match = cleaned.match(/([\d.]+)\s*([KMB]?)/i);
  if (!match) return { value: 0, suffix: '' };

  let num = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  let suffix = '';

  if (unit === 'K') { suffix = 'K'; }
  else if (unit === 'M') { suffix = ' M'; num = num; }
  else if (unit === 'B') { suffix = 'B'; }

  return { value: num, suffix };
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const valueEl = entry.target.querySelector('.stats__value');
      if (valueEl && !valueEl.dataset.animated) {
        valueEl.dataset.animated = 'true';
        const { value, suffix } = parseStatValue(valueEl.textContent);
        animateCounter(valueEl, value, suffix);
      }
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.stats__item').forEach(item => {
  statsObserver.observe(item);
});

// ---- Smooth scroll para los CTA ----
document.querySelectorAll('a[href="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => e.preventDefault());
});

// ---- Active state en mobile nav ----
document.querySelectorAll('.mobile-nav__item').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mobile-nav__item').forEach(b =>
      b.classList.remove('mobile-nav__item--active')
    );
    btn.classList.add('mobile-nav__item--active');
  });
});

// ---- Poster cards: keyboard navigation ----
document.querySelectorAll('.posters__card').forEach(card => {
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
});

// ---- Header: add background on scroll ----
const header = document.querySelector('.header');
if (header) {
  const handleScroll = () => {
    if (window.scrollY > 60) {
      header.style.background = 'rgba(0,0,0,0.9)';
      header.style.backdropFilter = 'blur(12px)';
      header.style.transition = 'background 0.3s ease';
    } else {
      header.style.background = 'transparent';
      header.style.backdropFilter = 'none';
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}
