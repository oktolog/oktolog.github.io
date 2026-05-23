/* theme.js — dark/light toggle with localStorage persistence */

function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);

  /* Sync Giscus iframe theme if present */
  const giscus = document.querySelector('iframe.giscus-frame');
  if (giscus) {
    giscus.contentWindow.postMessage(
      { giscus: { setConfig: { theme: next } } },
      'https://giscus.app'
    );
  }
}

/* Expose globally */
window.toggleTheme = toggleTheme;
