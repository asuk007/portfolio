'use strict';

// ── NAV: scroll shrink & mobile toggle ──────────────────────────────────────
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ── SCROLL REVEAL ────────────────────────────────────────────────────────────
const revealEls = document.querySelectorAll('[data-reveal]');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = parseInt(entry.target.dataset.delay || '0', 10);
    setTimeout(() => entry.target.classList.add('revealed'), delay);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// Trigger hero immediately
const heroContent = document.querySelector('#hero [data-reveal]');
if (heroContent) {
  setTimeout(() => heroContent.classList.add('revealed'), 100);
  revealObserver.unobserve(heroContent);
}

// ── ANIMATED COUNTERS ────────────────────────────────────────────────────────
function animateCount(el, target, duration = 1800) {
  const start = performance.now();
  const step = (timestamp) => {
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const counterEls = document.querySelectorAll('[data-count]');
let countersStarted = false;

const counterObserver = new IntersectionObserver((entries) => {
  if (countersStarted) return;
  if (entries.some(e => e.isIntersecting)) {
    countersStarted = true;
    counterEls.forEach(el => {
      animateCount(el, parseInt(el.dataset.count, 10));
    });
  }
}, { threshold: 0.5 });

counterEls.forEach(el => counterObserver.observe(el));

// ── ACTIVE NAV LINK on scroll ────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
    });
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => activeObserver.observe(s));

// ── PARALLAX SHIELD ──────────────────────────────────────────────────────────
const shield = document.querySelector('.hero-shield');
if (shield) {
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 12;
    const y = (e.clientY / window.innerHeight - 0.5) * 8;
    shield.style.transform = `translateY(-50%) translate(${x}px, ${y}px)`;
  }, { passive: true });
}

// ── SUBTLE CARD TILT on hover ────────────────────────────────────────────────
document.querySelectorAll('.project-card, .expertise-card, .channel-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
    card.style.transform = `translateY(-5px) rotateX(${-y}deg) rotateY(${x}deg)`;
    card.style.transition = 'transform 0.1s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease, border-color 0.25s, box-shadow 0.25s';
  });
});

// ── TYPING ANIMATION ────────────────────────────────────────────────────────
(function () {
  const el = document.getElementById('heroTyping');
  if (!el) return;

  const words = ['CISO', 'Security Leader', 'Cloud Security Expert', 'AI Security Advocate'];
  const TYPE_SPEED = 70;
  const DELETE_SPEED = 40;
  const HOLD_MS = 2000;
  const PAUSE_MS = 400;

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const word = words[wordIndex];

    if (!deleting) {
      el.textContent = word.slice(0, ++charIndex);
      if (charIndex === word.length) {
        deleting = true;
        setTimeout(tick, HOLD_MS);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      el.textContent = word.slice(0, --charIndex);
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(tick, PAUSE_MS);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  setTimeout(tick, 800);
}());

// ── SMOOTH SCROLL (fallback for older browsers) ──────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
