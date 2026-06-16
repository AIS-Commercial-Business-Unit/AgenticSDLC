/**
 * shared.js — AEF Website Shared Utilities
 *
 * Loaded on every page. Provides:
 *  - AEF.formatDate(isoString)   → human-readable local date/time
 *  - AEF.GITHUB_URL              → canonical GitHub repository URL
 *  - AEF.REPO_DISPLAY            → "Owner/Repo" display string
 *  - AEF.VERSION                 → framework version string
 *  - AEF.initPage(pageId)        → sets active nav state & formats all dates
 *
 * Usage in each page:
 *   <script src="shared.js"></script>
 *   <script>AEF.initPage('metrics');</script>  // pass the current page id
 *
 * Page IDs: 'home' | 'maturity' | 'governance' | 'metrics'
 */
(function (global) {
  'use strict';

  const GITHUB_URL    = 'https://github.com/AIS-Commercial-Business-Unit/AgenticSDLC';
  const REPO_DISPLAY  = 'AIS-Commercial-Business-Unit/AgenticSDLC';
  const VERSION       = '0.23.0';
  const DOCS_URL      = GITHUB_URL + '/blob/main/README.md';

  /**
   * Format an ISO 8601 timestamp as a human-readable string.
   * e.g. "2026-06-16T12:32:48.167Z" → "Jun 16, 2026, 12:32 PM UTC"
   *
   * Falls back gracefully to the raw string if parsing fails.
   *
   * @param {string|null|undefined} iso
   * @returns {string}
   */
  function formatDate(iso) {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return String(iso);
      return d.toLocaleString('en-US', {
        month:  'short',
        day:    'numeric',
        year:   'numeric',
        hour:   'numeric',
        minute: '2-digit',
        timeZone: 'UTC',
        timeZoneName: 'short'
      });
    } catch (_) {
      return String(iso);
    }
  }

  /**
   * Format an ISO date string as a short date (no time).
   * e.g. "2026-09-12" → "Sep 12, 2026"
   *
   * @param {string|null|undefined} iso
   * @returns {string}
   */
  function formatShortDate(iso) {
    if (!iso) return '—';
    try {
      // Append T00:00:00Z so it is parsed as UTC midnight, not local midnight.
      const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso + 'T00:00:00Z' : iso);
      if (isNaN(d.getTime())) return String(iso);
      return d.toLocaleDateString('en-US', {
        month:    'short',
        day:      'numeric',
        year:     'numeric',
        timeZone: 'UTC'
      });
    } catch (_) {
      return String(iso);
    }
  }

  /**
   * Set the active nav item by page ID and wire up GitHub links.
   * Also replaces any element with data-aef-date or data-aef-short-date.
   *
   * @param {string} pageId  One of: 'home'|'maturity'|'governance'|'metrics'
   */
  function initPage(pageId) {
    // -- Active nav state --
    const navMap = {
      home:       'nav-home',
      maturity:   'nav-maturity',
      governance: 'nav-governance',
      metrics:    'nav-metrics',
    };
    const activeId = navMap[pageId] || '';
    if (activeId) {
      const el = document.getElementById(activeId);
      if (el) {
        el.classList.add('nav__link--active');
        el.setAttribute('aria-current', 'page');
      }
    }

    // -- Wire GitHub links (href="#github" → real URL) --
    document.querySelectorAll('a[href="#github"]').forEach(function (a) {
      a.href = GITHUB_URL;
      a.rel  = 'noopener noreferrer';
    });

    // -- Human-readable timestamps --
    document.querySelectorAll('[data-aef-date]').forEach(function (el) {
      const iso = el.getAttribute('data-aef-date') || el.textContent;
      el.textContent = formatDate(iso);
      el.setAttribute('title', iso); // preserve ISO in tooltip
    });
    document.querySelectorAll('[data-aef-short-date]').forEach(function (el) {
      const iso = el.getAttribute('data-aef-short-date') || el.textContent;
      el.textContent = formatShortDate(iso);
      el.setAttribute('title', iso);
    });

    // -- Repo display links (replace placeholder text/href) --
    document.querySelectorAll('a[href="#repo"], [data-aef-repo]').forEach(function (el) {
      if (el.tagName === 'A') {
        el.href = GITHUB_URL;
        el.rel  = 'noopener noreferrer';
        if (!el.textContent.trim()) el.textContent = REPO_DISPLAY;
      } else {
        el.textContent = REPO_DISPLAY;
      }
    });
  }

  global.AEF = {
    GITHUB_URL:   GITHUB_URL,
    REPO_DISPLAY: REPO_DISPLAY,
    DOCS_URL:     DOCS_URL,
    VERSION:      VERSION,
    formatDate:   formatDate,
    formatShortDate: formatShortDate,
    initPage:     initPage,
  };

}(typeof window !== 'undefined' ? window : globalThis));
