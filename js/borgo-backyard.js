// Kilpailusivu käyttää samaa kielivalintaa kuin hääsivusto.
(() => {
  'use strict';
  const buttons = document.querySelectorAll('[data-language]');
  function setLanguage(language) {
    const selected = language === 'sv' ? 'sv' : 'fi';
    document.documentElement.lang = selected;
    document.querySelectorAll('[data-fi][data-sv]').forEach(element => {
      element.textContent = element.dataset[selected];
    });
    document.querySelectorAll('[data-fi-aria][data-sv-aria]').forEach(element => {
      element.setAttribute('aria-label', selected === 'sv' ? element.dataset.svAria : element.dataset.fiAria);
    });
    document.querySelectorAll('[data-fi-alt][data-sv-alt]').forEach(element => {
      element.setAttribute('alt', selected === 'sv' ? element.dataset.svAlt : element.dataset.fiAlt);
    });
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === selected)));
    try { localStorage.setItem('arttu-tinya-language', selected); } catch (error) {}
    const url = new URL(location.href);
    url.searchParams.set('lang', selected);
    history.replaceState(null, '', url.pathname + url.search + url.hash);
  }
  buttons.forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language)));
  let language = new URLSearchParams(location.search).get('lang');
  if (language !== 'fi' && language !== 'sv') {
    try { language = localStorage.getItem('arttu-tinya-language'); } catch (error) {}
  }
  setLanguage(language);
})();
