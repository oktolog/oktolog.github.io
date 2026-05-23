/* progress.js — reading progress bar, single posts only */

(function() {
  const bar = document.getElementById('reading-progress');
  if (!bar) return;

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight;
    const winHeight = window.innerHeight;
    const total = docHeight - winHeight;
    if (total <= 0) { bar.style.width = '0%'; return; }
    const pct = Math.min((scrollTop / total) * 100, 100);
    bar.style.width = pct + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
})();
