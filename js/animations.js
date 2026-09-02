(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector('.site-header');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EASE = 'cubic-bezier(.22,1,.36,1)';
  const activeSwaps = new WeakMap();

  root.classList.add(reduced ? 'motion-reduce' : 'motion-enabled');

  const cancelAnimations = element => {
    if (!element?.getAnimations) return;
    element.getAnimations().forEach(animation => animation.cancel());
  };

  const enter = (element, options = {}) => {
    if (!element || reduced || !element.animate) return null;
    const { x = 0, y = 8, duration = 300, delay = 0, opacityFrom = 0 } = options;
    cancelAnimations(element);
    return element.animate([
      { opacity: opacityFrom, transform: `translate3d(${x}px,${y}px,0)` },
      { opacity: 1, transform: 'translate3d(0,0,0)' }
    ], { duration, delay, easing: EASE, fill: 'both' });
  };

  const swap = (container, update, options = {}) => {
    if (!container || typeof update !== 'function') return;
    if (reduced || !container.animate) {
      update();
      return;
    }

    activeSwaps.get(container)?.cancel?.();
    cancelAnimations(container);
    const { y = 5, outDuration = 80, inDuration = 190 } = options;
    const outgoing = container.animate([
      { opacity: 1, transform: 'translate3d(0,0,0)' },
      { opacity: .2, transform: `translate3d(0,-${Math.max(2, Math.round(y * .4))}px,0)` }
    ], { duration: outDuration, easing: 'ease-in', fill: 'forwards' });

    activeSwaps.set(container, outgoing);
    outgoing.finished.then(() => {
      if (activeSwaps.get(container) !== outgoing) return;
      update();
      const incoming = container.animate([
        { opacity: 0, transform: `translate3d(0,${y}px,0)` },
        { opacity: 1, transform: 'translate3d(0,0,0)' }
      ], { duration: inDuration, easing: EASE, fill: 'both' });
      activeSwaps.set(container, incoming);
      incoming.finished.catch(() => {}).finally(() => {
        if (activeSwaps.get(container) === incoming) activeSwaps.delete(container);
      });
    }).catch(() => {
      update();
      activeSwaps.delete(container);
    });
  };

  window.AppMotion = Object.freeze({ reduced, enter, swap });

  // Viewport reveal: first-screen content is shown immediately so navigation never causes a blank/jump.
  document.querySelectorAll('.reveal-stagger').forEach(group => {
    [...group.children].forEach((child, index) => child.style.setProperty('--stagger-index', index));
  });

  const revealElements = [...document.querySelectorAll('.reveal,.reveal-stagger')];
  const reveal = element => element.classList.add('is-visible');

  if (reduced || !('IntersectionObserver' in window)) {
    revealElements.forEach(reveal);
  } else {
    const viewportCutoff = innerHeight * 1.08;
    revealElements.forEach(element => {
      if (element.getBoundingClientRect().top < viewportCutoff) reveal(element);
    });

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        reveal(entry.target);
        observer.unobserve(entry.target);
      }
    }, { threshold: .06, rootMargin: '0px 0px -4% 0px' });

    revealElements.filter(element => !element.classList.contains('is-visible')).forEach(element => observer.observe(element));
  }

  // Standalone intro: home page only, first visit in this tab/session only.
  const intro = document.querySelector('[data-site-intro]');
  const shouldPlayIntro = Boolean(window.__shouldPlaySiteIntro && body.dataset.page === 'home' && intro);
  const introKey = window.__siteIntroKey || 'ai-sang-tao-intro-seen';

  const markIntroSeen = () => {
    try { sessionStorage.setItem(introKey, '1'); } catch (_) {}
  };

  const finishIntro = () => {
    markIntroSeen();
    window.clearTimeout(window.__introFallback);
    intro?.remove();
    root.classList.remove('intro-pending');
    body.classList.remove('intro-active');
    try { scrollTo(0, 0); } catch (_) {}
  };

  const playIntro = () => {
    if (!shouldPlayIntro || reduced || !intro?.animate) {
      finishIntro();
      return;
    }

    body.classList.add('intro-active');
    const brand = intro.querySelector('.site-intro-brand');
    const cells = [...intro.querySelectorAll('.site-intro-mark i')];
    const core = intro.querySelector('.site-intro-core');
    const left = intro.querySelector('.site-intro-side--left');
    const right = intro.querySelector('.site-intro-side--right');
    const lines = [...intro.querySelectorAll('.site-intro-line')];
    const caption = intro.querySelector('.site-intro-caption');

    if (!brand || !core || !left || !right || !caption || cells.length !== 4 || lines.length !== 2) {
      finishIntro();
      return;
    }

    try {
      brand.animate([
        { opacity: 0, transform: 'translate3d(0,8px,0)' },
        { opacity: 1, transform: 'translate3d(0,0,0)' }
      ], { duration: 300, delay: 60, easing: EASE, fill: 'both' });

      cells.forEach((cell, index) => cell.animate([
        { opacity: 0, transform: 'scale(.3)' },
        { opacity: 1, transform: 'scale(1)' }
      ], { duration: 220, delay: 120 + index * 45, easing: EASE, fill: 'both' }));

      core.animate([
        { opacity: 0, transform: 'scale(.8)' },
        { opacity: 1, transform: 'scale(1)' }
      ], { duration: 340, delay: 250, easing: EASE, fill: 'both' });

      left.animate([
        { opacity: 0, transform: 'translate3d(14px,0,0)' },
        { opacity: 1, transform: 'translate3d(0,0,0)' }
      ], { duration: 340, delay: 380, easing: EASE, fill: 'both' });

      right.animate([
        { opacity: 0, transform: 'translate3d(-14px,0,0)' },
        { opacity: 1, transform: 'translate3d(0,0,0)' }
      ], { duration: 340, delay: 420, easing: EASE, fill: 'both' });

      lines.forEach((line, index) => line.animate([
        { transform: 'scaleX(0)' },
        { transform: 'scaleX(1)' }
      ], { duration: 300, delay: 420 + index * 40, easing: EASE, fill: 'both' }));

      caption.animate([
        { opacity: 0, transform: 'translate3d(0,6px,0)' },
        { opacity: 1, transform: 'translate3d(0,0,0)' }
      ], { duration: 300, delay: 600, easing: EASE, fill: 'both' });

      window.setTimeout(() => {
        const leave = intro.animate([
          { opacity: 1 },
          { opacity: 0 }
        ], { duration: 260, easing: 'ease-in', fill: 'forwards' });
        leave.finished.catch(() => {}).finally(finishIntro);
      }, 980);
    } catch (_) {
      finishIntro();
    }
  };

  requestAnimationFrame(() => requestAnimationFrame(playIntro));

  // Header progress only. No page transition, no scroll transform, no layout-affecting animation.
  let raf = 0;
  const updateProgress = () => {
    const max = Math.max(1, root.scrollHeight - innerHeight);
    header?.style.setProperty('--page-progress', Math.min(1, Math.max(0, scrollY / max)).toFixed(4));
    raf = 0;
  };
  addEventListener('scroll', () => {
    if (raf) return;
    raf = requestAnimationFrame(updateProgress);
  }, { passive: true });
  updateProgress();
})();
