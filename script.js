/* ============================================
   MOG AI — Landing Page Script
   All modules inside DOMContentLoaded
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ──────────────────────────────────────────
  // Module 1: Page Load Sequence
  // ──────────────────────────────────────────
  // Triggers hero entry animations via body.loaded class + delayed actions
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 0);

  // After hero card appears, animate the score ring and bars
  setTimeout(() => {
    animateScoreRing('hero-ring', 78, 408.407);
  }, 1200);

  setTimeout(() => {
    animateCounter('hero-score', 78, 800);
  }, 1800);

  // Stagger category bar fills
  setTimeout(() => {
    const bars = document.querySelectorAll('.hero-card .category-bar-fill');
    bars.forEach((bar, i) => {
      setTimeout(() => {
        bar.style.width = bar.dataset.width;
      }, i * 60);
    });
  }, 1800);


  // ──────────────────────────────────────────
  // Module 2: ScrollObserver
  // ──────────────────────────────────────────
  const animatedRings = new Set();

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay, 10) || 0;
        setTimeout(() => {
          el.classList.add('is-visible');
        }, delay);

        // Trigger score ring animations inside sections (not hero)
        if (!el.closest('.hero')) {
          const rings = el.querySelectorAll('[data-score]');
          rings.forEach(ring => {
            if (!animatedRings.has(ring.id)) {
              animatedRings.add(ring.id);
              const score = parseInt(ring.dataset.score, 10);
              const circ = parseFloat(ring.dataset.circumference) || 408.407;
              animateScoreRing(ring.id, score, circ);

              // Find sibling counter
              const wrap = ring.closest('.score-ring-wrap') || ring.closest('.phone-ring');
              if (wrap) {
                const counter = wrap.querySelector('[data-count-to]');
                if (counter) {
                  animateCounter(counter.id, parseInt(counter.dataset.countTo, 10), 800);
                }
              }
            }
          });

          // Animate feature card bars when visible
          const barFills = el.querySelectorAll('.feature-card-bar-fill[data-width]');
          barFills.forEach(bar => {
            bar.style.width = bar.dataset.width;
          });
        }
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    scrollObserver.observe(el);
  });


  // ──────────────────────────────────────────
  // Module 3: ScoreRingAnimator
  // ──────────────────────────────────────────
  function animateScoreRing(ringId, targetScore, circumference) {
    const ring = document.getElementById(ringId);
    if (!ring) return;

    const targetOffset = circumference * (1 - targetScore / 100);
    const startOffset = circumference;
    const duration = 1200;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentOffset = startOffset - (startOffset - targetOffset) * eased;
      ring.style.strokeDashoffset = currentOffset;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }


  // ──────────────────────────────────────────
  // Module 4: CounterAnimator
  // ──────────────────────────────────────────
  function animateCounter(elementId, target, duration) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }


  // ──────────────────────────────────────────
  // Module 5: NavScrollBehavior
  // ──────────────────────────────────────────
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }


  // ──────────────────────────────────────────
  // Module 6: MobileMenu
  // ──────────────────────────────────────────
  const hamburger = document.querySelector('.nav-hamburger');
  const drawer = document.querySelector('.nav-drawer');
  const drawerClose = document.querySelector('.nav-drawer-close');
  const drawerLinks = document.querySelectorAll('.nav-drawer-inner a');

  function openMenu() {
    if (!drawer || !hamburger) return;
    drawer.classList.add('menu-open');
    drawer.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!drawer || !hamburger) return;
    drawer.classList.remove('menu-open');
    drawer.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (drawerClose) drawerClose.addEventListener('click', closeMenu);
  if (drawer) {
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) closeMenu();
    });
  }
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });


  // ──────────────────────────────────────────
  // Module 7: CategoryScrollSpy
  // ──────────────────────────────────────────
  function initCategoryScrollSpy() {
    if (window.innerWidth < 1024) return;

    const pills = document.querySelectorAll('.features-nav-pill');
    const sections = document.querySelectorAll('[data-category]');

    if (pills.length === 0 || sections.length === 0) return;

    // Click handler: scroll to section
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        const target = document.getElementById(pill.dataset.target);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });

    // Scroll spy
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          pills.forEach(p => {
            p.classList.toggle('active', p.dataset.target === id);
          });
        }
      });
    }, { threshold: 0.4, rootMargin: '-100px 0px -40% 0px' });

    sections.forEach(s => spyObserver.observe(s));
  }

  initCategoryScrollSpy();
  window.addEventListener('resize', () => {
    // Re-init on resize crossing 1024
    initCategoryScrollSpy();
  });


  // ──────────────────────────────────────────
  // Module 8: CoachingCardCycler
  // ──────────────────────────────────────────
  const tips = [
    'Try jawline exercises 3x weekly for definition',
    'Switch to matte skincare \u2014 clearer texture scores better',
    'Shorter sides, textured top adds facial definition'
  ];

  let tipIndex = 0;
  let tipInterval = null;
  const tipTextEl = document.getElementById('coaching-tip-text');
  const tipContainer = document.getElementById('coaching-tip');
  const coachingCard = document.getElementById('coaching-card');
  let tipPaused = false;

  function cycleTip() {
    if (!tipTextEl || !tipContainer) return;
    // Fade out
    tipContainer.style.opacity = '0';
    setTimeout(() => {
      tipIndex = (tipIndex + 1) % tips.length;
      tipTextEl.textContent = tips[tipIndex];
      // Fade in
      tipContainer.style.opacity = '1';
    }, 300);
  }

  function startTipCycler() {
    if (tipInterval) return;
    tipInterval = setInterval(() => {
      if (!tipPaused) cycleTip();
    }, 3000);
  }

  function stopTipCycler() {
    if (tipInterval) {
      clearInterval(tipInterval);
      tipInterval = null;
    }
  }

  startTipCycler();

  // Pause on hover
  if (coachingCard) {
    coachingCard.addEventListener('mouseenter', () => { tipPaused = true; });
    coachingCard.addEventListener('mouseleave', () => { tipPaused = false; });
  }

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopTipCycler();
    } else {
      startTipCycler();
    }
  });


  // ──────────────────────────────────────────
  // Module 9: TierCardTouch (Mobile)
  // ──────────────────────────────────────────
  let activeTierCard = null;

  document.querySelectorAll('.tier-card').forEach(card => {
    card.addEventListener('touchstart', (e) => {
      if (activeTierCard === card) {
        card.classList.remove('touch-active');
        activeTierCard = null;
      } else {
        if (activeTierCard) {
          activeTierCard.classList.remove('touch-active');
        }
        card.classList.add('touch-active');
        activeTierCard = card;
      }
    }, { passive: true });
  });

});
