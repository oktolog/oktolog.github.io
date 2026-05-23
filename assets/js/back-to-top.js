/* Back-to-top button — appears after scrolling 400px */
(function () {
  var btn = document.getElementById('back-to-top');
  if (!btn) return;

  function update() {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
