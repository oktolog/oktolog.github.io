/* shortcuts.js — keyboard navigation shortcuts */

(function() {
  var gPressed = false;
  var gTimeout = null;

  document.addEventListener('keydown', function(e) {
    var tag = document.activeElement ? document.activeElement.tagName : '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    /* Single-key shortcuts */
    if (e.key === '/') {
      e.preventDefault();
      openSearch();
      return;
    }

    if (e.key === 't') {
      if (typeof toggleTheme === 'function') toggleTheme();
      return;
    }

    if (e.key === 'Escape') {
      closeSearch();
      closeShortcutsOverlay();
      return;
    }

    if (e.key === '?') {
      showShortcutsOverlay();
      return;
    }

    /* g + key navigation */
    if (e.key === 'g') {
      gPressed = true;
      if (gTimeout) clearTimeout(gTimeout);
      gTimeout = setTimeout(function() { gPressed = false; }, 1000);
      return;
    }

    if (gPressed) {
      var map = {
        h: '/',
        n: '/notes/',
        r: '/research/',
        p: '/projects/',
        c: '/ctf/',
        t: '/tags/',
        a: '/about/'
      };
      if (map[e.key]) {
        gPressed = false;
        window.location.href = map[e.key];
      }
    }
  });

  /* Expose overlay functions globally */
  window.showShortcutsOverlay = function() {
    var el = document.getElementById('shortcuts-overlay');
    if (el) el.setAttribute('aria-hidden', 'false');
  };

  window.closeShortcutsOverlay = function() {
    var el = document.getElementById('shortcuts-overlay');
    if (el) el.setAttribute('aria-hidden', 'true');
  };
})();
