/* search.js — Pagefind search overlay */

(function() {
  var initialized = false;
  var overlay = null;

  function init() {
    overlay = document.getElementById('search-overlay');
    if (!overlay) return;

    /* Initialize Pagefind UI */
    if (!initialized && typeof PagefindUI !== 'undefined') {
      new PagefindUI({
        element: '#search-ui',
        showImages: false,
        showEmptyFilters: false,
        resetStyles: false
      });
      initialized = true;
    }
  }

  window.openSearch = function() {
    if (!overlay) init();
    if (!overlay) return;
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    /* Focus the search input */
    setTimeout(function() {
      var input = overlay.querySelector('input[type=text], input[type=search]');
      if (input) input.focus();
    }, 50);
  };

  window.closeSearch = function() {
    if (!overlay) return;
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  /* Close on overlay background click */
  document.addEventListener('DOMContentLoaded', function() {
    init();
    var el = document.getElementById('search-overlay');
    if (!el) return;
    el.addEventListener('click', function(e) {
      if (e.target === el) closeSearch();
    });
  });
})();
