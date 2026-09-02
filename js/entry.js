(() => {
  'use strict';
  const KEY = 'ai-sang-tao-intro-seen';
  const isHome = document.documentElement.dataset.entry === 'home';
  let seen = false;
  let storageAvailable = true;

  try { seen = sessionStorage.getItem(KEY) === '1'; }
  catch (_) { storageAvailable = false; }

  if (!isHome) {
    if (storageAvailable && !seen) {
      document.documentElement.style.visibility = 'hidden';
      location.replace('index.html');
    }
    return;
  }

  window.__siteIntroKey = KEY;
  window.__shouldPlaySiteIntro = storageAvailable && !seen;

  if (!window.__shouldPlaySiteIntro) {
    document.documentElement.classList.add('intro-skipped');
    return;
  }

  try {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  } catch (_) {}

  document.documentElement.classList.add('intro-pending');

  // Hard fail-safe. Page content is never hidden, so this only dismisses the overlay.
  window.__introFallback = window.setTimeout(() => {
    try { sessionStorage.setItem(KEY, '1'); } catch (_) {}
    document.documentElement.classList.remove('intro-pending');
    document.querySelector('[data-site-intro]')?.remove();
    document.body?.classList.remove('intro-active');
  }, 1800);
})();
