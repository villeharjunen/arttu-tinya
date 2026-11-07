// Kirjekuori ja salasana. Avattu kutsu muistetaan välilehden ajan, ja #osio-linkit avaavat suoraan oikean kohdan.
(() => {
  'use strict';
  const entry = document.getElementById('entry');
  const site = document.getElementById('site');
  const dialog = document.getElementById('password-dialog');
  const form = document.getElementById('password-form');
  const input = document.getElementById('wedding-password');
  const error = document.getElementById('password-error');
  const openButton = document.getElementById('open');
  const UNLOCK_KEY = 'arttu-tinya-unlocked';
  let opening = false;

  function isUnlocked() {
    try { return sessionStorage.getItem(UNLOCK_KEY) === '1'; } catch (e) { return false; }
  }

  function showSite() {
    try { sessionStorage.setItem(UNLOCK_KEY, '1'); } catch (e) {}
    entry.hidden = true;
    site.hidden = false;
    const target = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target && site.contains(target)) requestAnimationFrame(() => target.scrollIntoView());
    else window.scrollTo(0, 0);
  }

  function askPassword() {
    form.reset();
    error.hidden = true;
    dialog.showModal();
    input.focus();
  }

  function openEnvelope() {
    if (isUnlocked()) {
      showSite();
      return;
    }
    if (openButton.classList.contains('is-open')) {
      askPassword();
      return;
    }
    if (opening) return;

    opening = true;
    openButton.setAttribute('aria-expanded', 'true');
    openButton.classList.add('is-opening');
    const finishOpening = () => {
      openButton.classList.remove('is-opening');
      openButton.classList.add('is-open');
      opening = false;
      askPassword();
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finishOpening();
    } else {
      window.setTimeout(finishOpening, 1450);
    }
  }

  openButton.addEventListener('click', openEnvelope);

  document.getElementById('back').onclick = () => {
    site.hidden = true;
    entry.hidden = false;
    openButton.classList.remove('is-open', 'is-opening');
    openButton.setAttribute('aria-expanded', 'false');
    opening = false;
    openButton.focus();
    history.replaceState(null, '', location.pathname + location.search);
    window.scrollTo(0, 0);
  };

  window.addEventListener('hashchange', () => {
    if (site.hidden && location.hash.length > 1) {
      if (isUnlocked()) showSite(); else if (!dialog.open) openEnvelope();
    }
  });

  form.onsubmit = e => {
    e.preventDefault();
    if (input.value === CONFIG.password) {
      dialog.close();
      form.reset();
      showSite();
    } else {
      error.hidden = false;
      input.select();
      input.focus();
    }
  };
  document.getElementById('password-cancel').onclick = () => dialog.close();
  dialog.addEventListener('close', () => {
    form.reset();
    error.hidden = true;
  });

  if (isUnlocked()) showSite(); else if (location.hash.length > 1) openEnvelope();
})();
