/* copy-code.js — copy button + language badge on code blocks */

document.addEventListener('DOMContentLoaded', function() {

  /* ── Code block toolbar ───────────────────────────────────────
     Move the badge + copy button into a toolbar div that sits
     ABOVE the pre, so they never scroll with the code content.
     Uses .highlight (Hugo's Chroma wrapper) as the anchor, or
     creates a .code-wrap if no .highlight parent exists.
  ───────────────────────────────────────────────────────────── */
  document.querySelectorAll('pre').forEach(function(pre) {
    const code = pre.querySelector('code');
    if (!code) return;

    /* Find Hugo's .highlight wrapper or create one */
    const wrapper = pre.closest('.highlight') || (function() {
      const w = document.createElement('div');
      w.className = 'code-wrap';
      pre.parentNode.insertBefore(w, pre);
      w.appendChild(pre);
      return w;
    })();
    wrapper.classList.add('code-has-toolbar');

    /* Language from class name */
    const lang = (code.className || '')
      .replace(/language-/g, '')
      .split(/\s+/)
      .filter(Boolean)[0];

    /* Build toolbar */
    const toolbar = document.createElement('div');
    toolbar.className = 'code-toolbar';

    /* Lang badge (left) */
    const badge = document.createElement('span');
    badge.className = 'code-lang-badge';
    badge.textContent = (lang && lang !== 'text' && lang !== 'plaintext') ? lang : '';
    toolbar.appendChild(badge);

    /* Copy button (right) */
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'copy';
    btn.setAttribute('aria-label', 'Copy code to clipboard');
    btn.addEventListener('click', function() {
      const text = code.innerText || code.textContent;
      navigator.clipboard.writeText(text).then(function() {
        btn.textContent = '✓';
        setTimeout(function() { btn.textContent = 'copy'; }, 2000);
      }).catch(function() {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        btn.textContent = '✓';
        setTimeout(function() { btn.textContent = 'copy'; }, 2000);
      });
    });
    toolbar.appendChild(btn);

    /* Insert toolbar before pre inside the wrapper */
    wrapper.insertBefore(toolbar, pre);
  });

  /* ── Heading anchor links ─────────────────────────────────── */
  document.querySelectorAll('.post-content h2, .post-content h3, .post-content h4')
    .forEach(function(heading) {
      if (!heading.id) return;
      const anchor = document.createElement('a');
      anchor.className = 'heading-anchor';
      anchor.href = '#' + heading.id;
      anchor.textContent = '#';
      anchor.setAttribute('aria-label', 'Copy anchor link');
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const url = window.location.origin + window.location.pathname + '#' + heading.id;
        navigator.clipboard.writeText(url).catch(function() {});
        window.location.hash = heading.id;
      });
      heading.appendChild(anchor);
    });

  /* ── TOC active heading via IntersectionObserver ──────────── */
  const tocLinks = document.querySelectorAll('.toc a');
  if (tocLinks.length > 0) {
    const headings = document.querySelectorAll('.post-content h2, .post-content h3');
    const obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          tocLinks.forEach(function(l) { l.classList.remove('active'); });
          const active = document.querySelector('.toc a[href="#' + entry.target.id + '"]');
          if (active) active.classList.add('active');
        }
      });
    }, { rootMargin: '0px 0px -70% 0px', threshold: 0 });
    headings.forEach(function(h) { if (h.id) obs.observe(h); });
  }

  /* ── Obsidian-style callout parsing: > [!type] ────────────── */
  document.querySelectorAll('.post-content blockquote').forEach(function(bq) {
    const first = bq.querySelector('p');
    if (!first) return;
    const match = (first.textContent || '').match(/^\[!(note|tip|warning|danger|info)\]/i);
    if (!match) return;
    const type = match[1].toLowerCase();
    const icons = { note: 'ℹ', tip: '✓', warning: '⚠', danger: '✕', info: '◉' };
    const div = document.createElement('div');
    div.className = 'callout callout-' + type;
    const iconSpan = document.createElement('span');
    iconSpan.className = 'callout-icon';
    iconSpan.textContent = icons[type] || 'ℹ';
    const contentDiv = document.createElement('div');
    contentDiv.className = 'callout-content';
    Array.from(bq.childNodes).forEach(function(node) {
      if (node === first) {
        const p = first.cloneNode(true);
        p.textContent = p.textContent.replace(/^\[!(note|tip|warning|danger|info)\]\s*/i, '');
        if (p.textContent.trim()) contentDiv.appendChild(p);
      } else {
        contentDiv.appendChild(node.cloneNode(true));
      }
    });
    div.appendChild(iconSpan);
    div.appendChild(contentDiv);
    bq.parentNode.replaceChild(div, bq);
  });

  /* ── Footnote hover tooltips ──────────────────────────────── */
  document.querySelectorAll('sup[id^="fnref"] a').forEach(function(ref) {
    const fnId = ref.getAttribute('href');
    if (!fnId) return;
    const fn = document.querySelector(fnId);
    if (!fn) return;
    let tooltip = null;
    ref.addEventListener('mouseenter', function(e) {
      tooltip = document.createElement('div');
      tooltip.className = 'footnote-tooltip';
      tooltip.innerHTML = fn.innerHTML;
      const backRef = tooltip.querySelector('.footnote-backref');
      if (backRef) backRef.remove();
      document.body.appendChild(tooltip);
      positionTooltip(e);
    });
    ref.addEventListener('mousemove', positionTooltip);
    ref.addEventListener('mouseleave', function() {
      if (tooltip) { tooltip.remove(); tooltip = null; }
    });
    function positionTooltip(e) {
      if (!tooltip) return;
      const x = e.clientX + 12, y = e.clientY + 12;
      tooltip.style.left = Math.min(x, window.innerWidth  - tooltip.offsetWidth  - 16) + 'px';
      tooltip.style.top  = Math.min(y, window.innerHeight - tooltip.offsetHeight - 16) + 'px';
    }
  });

  /* ── Share: copy link ─────────────────────────────────────── */
  window.copyPageLink = function(btn) {
    const url = btn.dataset.url || window.location.href;
    navigator.clipboard.writeText(url).then(function() {
      const orig = btn.textContent;
      btn.textContent = '✓ copied';
      setTimeout(function() { btn.textContent = orig; }, 2000);
    });
  };
});
