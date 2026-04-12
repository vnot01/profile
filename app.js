/* ============================================
   FERI FEBRIA LAKSANA — PROFILE WEBSITE v3
   Interactive JavaScript + Theme System
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // === THEME SYSTEM ===
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  // Listen to system theme changes (auto-sync when no manual override or on first visit)
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    // Only auto-switch if user hasn't manually toggled
    const saved = localStorage.getItem('theme');
    if (!saved) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Toggle button
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || getSystemTheme();
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  // === CURSOR GLOW ===
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let cx = 0, cy = 0, tx = 0, ty = 0;
    document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    (function updateCursor() {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      cursorGlow.style.left = cx + 'px';
      cursorGlow.style.top = cy + 'px';
      requestAnimationFrame(updateCursor);
    })();
  }

  // === NAVIGATION SCROLL ===
  const nav = document.getElementById('nav');
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-link');

  function onScroll() {
    // Nav background
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Active nav link
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 200;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // === HAMBURGER MENU ===
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });

    // Close menu on link click
    mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // === SCROLL REVEAL (data-aos) ===
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add staggered delay
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('[data-aos]').forEach((el, i) => {
    el.dataset.delay = (i % 6) * 80; // Stagger within view groups
    observer.observe(el);
  });

  // === SKILL BAR ANIMATION ===
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach((fill, i) => {
          setTimeout(() => {
            fill.classList.add('animate');
          }, i * 120);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skill-category').forEach(cat => {
    skillObserver.observe(cat);
  });

  // === COUNTER ANIMATION ===
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    counterObserver.observe(statsSection);
  }

  function animateCounters(container) {
    container.querySelectorAll('.stat-num[data-count]').forEach(num => {
      const target = parseInt(num.dataset.count);
      const duration = 1500;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out
        const ease = 1 - Math.pow(1 - progress, 3);
        num.textContent = Math.round(target * ease);
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
    });
  }

  // === SMOOTH SCROLL for nav links ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // === PARTICLE FIELD (subtle floating dots) ===
  const particleField = document.getElementById('particleField');
  if (particleField) {
    // Use theme-aware particle colors
    function getParticleColor() {
      const theme = root.getAttribute('data-theme');
      return theme === 'light'
        ? `rgba(15, 167, 126, ${Math.random() * 0.2 + 0.05})`
        : `rgba(34, 201, 151, ${Math.random() * 0.3 + 0.1})`;
    }

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 3 + 1}px;
        height: ${Math.random() * 3 + 1}px;
        background: ${getParticleColor()};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: particleFloat ${Math.random() * 20 + 15}s linear infinite;
        animation-delay: ${Math.random() * -20}s;
      `;
      particleField.appendChild(particle);
    }

    // Inject particle animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes particleFloat {
        0% { transform: translate(0, 0) scale(1); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translate(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 200 + 50}px, -${Math.random() * 400 + 200}px) scale(0); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // === TILT EFFECT on avatar card ===
  const avatarCard = document.querySelector('.avatar-card');
  if (avatarCard && window.matchMedia('(pointer: fine)').matches) {
    avatarCard.addEventListener('mousemove', e => {
      const rect = avatarCard.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      avatarCard.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });
    avatarCard.addEventListener('mouseleave', () => {
      avatarCard.style.transform = '';
      avatarCard.style.transition = 'transform 0.5s ease';
      setTimeout(() => { avatarCard.style.transition = ''; }, 500);
    });
  }

});
