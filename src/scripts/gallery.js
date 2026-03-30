/**
 * gallery.js — Otter Valley Rod & Gun Club
 * Fetches /data/gallery.json, builds filter bar + image grid,
 * and manages a keyboard/mouse-accessible lightbox.
 * Uses safe DOM methods only (createElement / textContent / appendChild).
 */

(function () {
  'use strict';

  const FILTER_LABELS = {
    all:      'All',
    trap:     'Trap & Clays',
    rifle:    'Rifle',
    handgun:  'Handgun',
    archery:  'Archery',
    fishing:  'Fishing',
    facility: 'Facility',
    event:    'Events',
  };

  const FILTER_ORDER = ['all', 'trap', 'rifle', 'handgun', 'archery', 'fishing', 'facility', 'event'];

  let allItems   = [];
  let filtered   = [];
  let lbIndex    = 0;
  let activeFilter = 'all';

  // ── DOM refs ───────────────────────────────────────
  const filterBar = document.getElementById('gallery-filter-bar');
  const grid      = document.getElementById('gallery-grid');
  const lightbox  = document.getElementById('gallery-lightbox');
  const lbOverlay = lightbox ? lightbox.querySelector('.lightbox-overlay') : null;
  const lbImg     = document.getElementById('lb-img');
  const lbCaption = document.getElementById('lb-caption');
  const lbClose   = lightbox ? lightbox.querySelector('.lb-close') : null;
  const lbPrev    = lightbox ? lightbox.querySelector('.lb-prev') : null;
  const lbNext    = lightbox ? lightbox.querySelector('.lb-next') : null;

  // ── Fetch & init ───────────────────────────────────
  async function init() {
    if (!grid) return;

    const src = grid.dataset.src || '/data/gallery.json';

    try {
      const resp = await fetch(src);
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      allItems = await resp.json();
    } catch (err) {
      grid.textContent = 'Gallery unavailable. Please try again later.';
      console.error('[gallery.js] fetch error:', err);
      return;
    }

    buildFilterBar();
    applyFilter('all');
    bindLightbox();
  }

  // ── Filter bar ─────────────────────────────────────
  function buildFilterBar() {
    if (!filterBar) return;

    const existing = FILTER_ORDER.filter((key) => {
      if (key === 'all') return true;
      return allItems.some((item) => item.category === key);
    });

    existing.forEach((key) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gallery-filter-btn' + (key === 'all' ? ' active' : '');
      btn.dataset.filter = key;
      btn.textContent = FILTER_LABELS[key] || key;
      btn.addEventListener('click', () => {
        activeFilter = key;
        filterBar.querySelectorAll('.gallery-filter-btn').forEach((b) => {
          b.classList.toggle('active', b.dataset.filter === key);
        });
        applyFilter(key);
      });
      filterBar.appendChild(btn);
    });
  }

  // ── Grid rendering ─────────────────────────────────
  function applyFilter(filter) {
    filtered = filter === 'all'
      ? allItems.slice()
      : allItems.filter((item) => item.category === filter);

    renderGrid();
  }

  function renderGrid() {
    if (!grid) return;

    // Clear existing tiles (not the loading paragraph — already replaced on first run)
    while (grid.firstChild) grid.removeChild(grid.firstChild);

    if (filtered.length === 0) {
      const msg = document.createElement('p');
      msg.className = 'gallery-loading';
      msg.textContent = 'No photos in this category yet.';
      grid.appendChild(msg);
      return;
    }

    filtered.forEach((item, idx) => {
      const tile = document.createElement('div');
      tile.className = 'gallery-tile';
      tile.setAttribute('role', 'button');
      tile.setAttribute('tabindex', '0');
      tile.setAttribute('aria-label', 'View: ' + item.alt);

      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt;
      img.loading = 'lazy';
      img.decoding = 'async';

      const overlay = document.createElement('div');
      overlay.className = 'gallery-tile-overlay';
      overlay.textContent = item.alt;

      tile.appendChild(img);
      tile.appendChild(overlay);

      tile.addEventListener('click', () => openLightbox(idx));
      tile.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(idx);
        }
      });

      grid.appendChild(tile);
    });
  }

  // ── Lightbox ───────────────────────────────────────
  function openLightbox(idx) {
    if (!lightbox) return;
    lbIndex = idx;
    showLbItem(lbIndex);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose && lbClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  function showLbItem(idx) {
    const item = filtered[idx];
    if (!item || !lbImg || !lbCaption) return;
    lbImg.src = item.src;
    lbImg.alt = item.alt;
    lbCaption.textContent = item.alt;

    // Prev / next visibility
    if (lbPrev) lbPrev.style.visibility = idx > 0 ? 'visible' : 'hidden';
    if (lbNext) lbNext.style.visibility = idx < filtered.length - 1 ? 'visible' : 'hidden';
  }

  function prevItem() {
    if (lbIndex > 0) {
      lbIndex -= 1;
      showLbItem(lbIndex);
    }
  }

  function nextItem() {
    if (lbIndex < filtered.length - 1) {
      lbIndex += 1;
      showLbItem(lbIndex);
    }
  }

  function bindLightbox() {
    if (!lightbox) return;

    lbClose  && lbClose.addEventListener('click', closeLightbox);
    lbPrev   && lbPrev.addEventListener('click', prevItem);
    lbNext   && lbNext.addEventListener('click', nextItem);
    lbOverlay && lbOverlay.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (e) => {
      if (lightbox.hidden) return;
      if (e.key === 'Escape')      closeLightbox();
      if (e.key === 'ArrowLeft')   prevItem();
      if (e.key === 'ArrowRight')  nextItem();
    });
  }

  // ── Boot ───────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
