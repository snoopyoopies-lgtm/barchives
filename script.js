
/* Public Clipboard checkout. Keep paid installation links in purchased materials. */
window.BARCHIVES_CONFIG = Object.freeze({
  clipboardCheckoutUrl: "https://payhip.com/b/0P9Im"
});

(() => {
  'use strict';
  const root = document.documentElement;
  const themeButton = document.querySelector('[data-theme-toggle]');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  let selectedTheme = null;
  try { selectedTheme = localStorage.getItem('barchives-theme'); } catch (_) {}

  function applyTheme(theme) {
    root.dataset.theme = theme;
    if (themeButton) {
      themeButton.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
    }
  }
  applyTheme(selectedTheme || (systemTheme.matches ? 'dark' : 'light'));
  themeButton?.addEventListener('click', () => {
    selectedTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(selectedTheme);
    try { localStorage.setItem('barchives-theme', selectedTheme); } catch (_) {}
  });
  systemTheme.addEventListener('change', e => { if (!selectedTheme) applyTheme(e.matches ? 'dark' : 'light'); });

  const nav = document.querySelector('[data-navigation]');
  const menu = document.querySelector('[data-menu-toggle]');
  const toolsDropdown = document.querySelector('[data-tools-dropdown]');
  const toolsToggle = document.querySelector('[data-tools-toggle]');
  const toolsProducts = document.querySelector('[data-tools-products]');
  const hoverPointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let toolsCloseTimer;
  const isInTools = target => !!target && (toolsDropdown?.contains(target) || toolsProducts?.contains(target));
  const toolsAreHovered = () => toolsDropdown?.matches(':hover') || toolsProducts?.matches(':hover');
  function cancelToolsClose() { clearTimeout(toolsCloseTimer); }
  function setToolsOpen(open) {
    cancelToolsClose();
    if (toolsProducts) toolsProducts.hidden = !open;
    toolsToggle?.setAttribute('aria-expanded', String(open));
    toolsToggle?.setAttribute('aria-label', open ? 'Hide products' : 'Show products');
  }
  toolsToggle?.addEventListener('click', () => setToolsOpen(toolsToggle.getAttribute('aria-expanded') !== 'true'));
  function enterTools() { if (hoverPointer.matches) setToolsOpen(true); }
  function leaveTools(e) {
    if (!hoverPointer.matches || isInTools(e.relatedTarget)) return;
    cancelToolsClose();
    toolsCloseTimer = setTimeout(() => { if (!toolsAreHovered()) setToolsOpen(false); }, 120);
  }
  toolsDropdown?.addEventListener('pointerenter', enterTools);
  toolsDropdown?.addEventListener('pointerleave', leaveTools);
  toolsProducts?.addEventListener('pointerenter', enterTools);
  toolsProducts?.addEventListener('pointerleave', leaveTools);
  toolsDropdown?.addEventListener('focusout', e => {
    if (!isInTools(e.relatedTarget) && !(hoverPointer.matches && toolsAreHovered())) setToolsOpen(false);
  });
  toolsDropdown?.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' && e.target.closest('.nav-tools-heading')) {
      e.preventDefault();
      setToolsOpen(true);
      toolsProducts?.querySelector('a')?.focus();
    }
  });
  function closeMenu() {
    setToolsOpen(false);
    nav?.classList.remove('is-open');
    menu?.setAttribute('aria-expanded', 'false');
    menu?.setAttribute('aria-label', 'Open navigation');
  }
  menu?.addEventListener('click', () => {
    const expanded = menu.getAttribute('aria-expanded') !== 'true';
    nav?.classList.toggle('is-open', expanded);
    menu.setAttribute('aria-expanded', String(expanded));
    menu.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
  });
  nav?.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (toolsToggle?.getAttribute('aria-expanded') === 'true') {
      setToolsOpen(false);
      toolsToggle.focus();
    } else {
      const wasOpen = menu?.getAttribute('aria-expanded') === 'true';
      closeMenu();
      if (wasOpen) menu.focus();
    }
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('[data-tools-dropdown]')) setToolsOpen(false);
    if (!e.target.closest('.site-header')) closeMenu();
  });
  window.matchMedia('(min-width: 701px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

  const sections = [...document.querySelectorAll('[data-section-name]')];
  const railLinks = [...document.querySelectorAll('.ruler-link')];
  const currentSection = document.querySelector('[data-current-section]');
  const progress = document.querySelector('[data-reading-progress]');
  let ticking = false;
  function updateReading() {
    ticking = false;
    let active = sections[0];
    const threshold = Math.min(window.innerHeight * .3, 230);
    sections.forEach(section => { if (section.getBoundingClientRect().top <= threshold) active = section; });
    railLinks.forEach(link => {
      const isActive = link.hash === `#${active?.id}`;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if (currentSection && active) currentSection.textContent = `${active.dataset.sectionNumber} / ${active.dataset.sectionName}`;
    const total = root.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${total > 0 ? Math.min(100, Math.max(0, window.scrollY / total * 100)) : 0}%`;
  }
  function requestReading() { if (!ticking) { ticking = true; requestAnimationFrame(updateReading); } }
  window.addEventListener('scroll', requestReading, { passive: true });
  window.addEventListener('resize', requestReading);
  window.addEventListener('load', requestReading);
  updateReading();

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
    }, { threshold: .06, rootMargin: '0px 0px 30px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    root.classList.add('has-js');
  }

  const checkout = window.BARCHIVES_CONFIG?.clipboardCheckoutUrl?.trim();
  if (checkout) {
    try {
      const url = new URL(checkout);
      if (url.protocol === 'https:' && (url.hostname === 'payhip.com' || url.hostname.endsWith('.payhip.com'))) {
        document.querySelectorAll('[data-clipboard-checkout]').forEach(link => {
          link.href = url.href;
          link.removeAttribute('aria-disabled');
          link.removeAttribute('role');
          if (!link.querySelector('svg')) link.textContent = 'Get Clipboard — S$3 ↗';
        });
      }
    } catch (_) { /* Keep the built-in purchase link when an override is invalid. */ }
  }

  const gallery = [...document.querySelectorAll('[data-gallery-image]')];
  const dialog = document.querySelector('[data-lightbox]');
  const dialogImage = dialog?.querySelector('[data-lightbox-image]');
  const dialogCaption = dialog?.querySelector('[data-lightbox-caption]');
  const dialogCount = dialog?.querySelector('[data-lightbox-count]');
  const close = dialog?.querySelector('[data-lightbox-close]');
  const previous = dialog?.querySelector('[data-lightbox-previous]');
  const next = dialog?.querySelector('[data-lightbox-next]');
  let imageIndex = 0;
  let opener = null;
  function showImage(index) {
    imageIndex = (index + gallery.length) % gallery.length;
    const item = gallery[imageIndex];
    if (!item || !dialogImage) return;
    dialogImage.src = item.dataset.galleryImage;
    dialogImage.alt = item.dataset.galleryAlt || '';
    dialogCaption.textContent = item.dataset.galleryCaption || '';
    dialogCount.textContent = `${imageIndex + 1} / ${gallery.length}`;
    previous.hidden = next.hidden = gallery.length < 2;
  }
  gallery.forEach((item, index) => item.addEventListener('click', () => {
    if (!dialog?.showModal) { window.open(item.dataset.galleryImage, '_blank', 'noopener'); return; }
    opener = item;
    showImage(index);
    dialog.showModal();
    document.body.classList.add('dialog-open');
  }));
  close?.addEventListener('click', () => dialog.close());
  previous?.addEventListener('click', () => showImage(imageIndex - 1));
  next?.addEventListener('click', () => showImage(imageIndex + 1));
  dialog?.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); showImage(imageIndex - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); showImage(imageIndex + 1); }
  });
  dialog?.addEventListener('click', e => {
    if (e.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (e.clientX < bounds.left || e.clientX > bounds.right || e.clientY < bounds.top || e.clientY > bounds.bottom) dialog.close();
  });
  dialog?.addEventListener('close', () => { document.body.classList.remove('dialog-open'); opener?.focus(); });
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = String(new Date().getFullYear()));
})();

