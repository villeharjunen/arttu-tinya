// Kirjekuori ja salasana. Avattu kutsu muistetaan välilehden ajan, ja #osio-linkit avaavat suoraan oikean kohdan.
(() => {
  'use strict';
  const entry = document.getElementById('entry');
  const site = document.getElementById('site');
  const dialog = document.getElementById('password-dialog');
  const form = document.getElementById('password-form');
  const input = document.getElementById('wedding-password');
  const error = document.getElementById('password-error');
  const UNLOCK_KEY = 'arttu-tinya-unlocked';

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

  document.getElementById('open').onclick = () => {
    if (isUnlocked()) showSite(); else askPassword();
  };

  document.getElementById('back').onclick = () => {
    site.hidden = true;
    entry.hidden = false;
    history.replaceState(null, '', location.pathname + location.search);
    window.scrollTo(0, 0);
  };

  window.addEventListener('hashchange', () => {
    if (site.hidden && location.hash.length > 1) {
      if (isUnlocked()) showSite(); else if (!dialog.open) askPassword();
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

  if (isUnlocked()) showSite(); else if (location.hash.length > 1) askPassword();
})();
