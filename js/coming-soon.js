// Väliaikaisen avautumissivun laskuri ja kielivalinta.
(() => {
  'use strict';
  const page = document.getElementById('coming-soon');
  if (document.documentElement.dataset.comingSoon !== 'true') return;

  page.hidden = false;
  const target = new Date(CONFIG.SITE_LAUNCH_DATE).getTime();
  if (!Number.isFinite(target)) {
    console.error('Sivuston avautumisaika on virheellinen.');
    return;
  }
  const fields = {
    days: document.getElementById('coming-soon-days'),
    hours: document.getElementById('coming-soon-hours'),
    minutes: document.getElementById('coming-soon-minutes'),
    seconds: document.getElementById('coming-soon-seconds')
  };
  const switcher = page.querySelector('.coming-soon-language-switch');
  const date = page.querySelector('.coming-soon-date time');
  const note = page.querySelector('.countdown-note');
  let reloading = false;

  function checkLaunch() {
    if (Date.now() >= target) {
      if (!reloading) {
        reloading = true;
        location.reload();
      }
      return;
    }
    window.setTimeout(checkLaunch, Math.min(target - Date.now(), 2147483647));
  }

  function updateCountdown() {
    const remaining = Math.max(0, Math.ceil((target - Date.now()) / 1000));
    const values = {
      days: Math.floor(remaining / 86400),
      hours: Math.floor(remaining % 86400 / 3600),
      minutes: Math.floor(remaining % 3600 / 60),
      seconds: remaining % 60
    };
    Object.entries(values).forEach(([unit, value]) => {
      fields[unit].textContent = String(value).padStart(2, '0');
    });
  }

  function setLanguage(language) {
    const selected = language === 'sv' ? 'sv' : 'fi';
    document.documentElement.lang = selected;
    page.querySelector('[data-countdown-label]').setAttribute(
      'aria-label',
      selected === 'sv' ? 'Nedräkning till webbplatsens öppning' : 'Sivuston avautumislaskuri'
    );
    page.querySelector('[role="timer"]').setAttribute(
      'aria-label',
      selected === 'sv' ? 'Tid kvar till webbplatsens öppning' : 'Aikaa sivuston avautumiseen'
    );
    switcher.setAttribute('aria-label', selected === 'sv' ? 'Välj språk' : 'Valitse kieli');
    page.querySelectorAll('[data-fi][data-sv]').forEach(element => {
      element.textContent = element.dataset[selected];
    });
    const day = new Intl.DateTimeFormat('fi-FI', { timeZone: 'Europe/Helsinki', day: 'numeric', month: 'numeric', year: 'numeric' }).format(target);
    const time = new Intl.DateTimeFormat('fi-FI', { timeZone: 'Europe/Helsinki', hour: '2-digit', minute: '2-digit', hour12: false }).format(target);
    date.dateTime = CONFIG.SITE_LAUNCH_DATE;
    date.textContent = day + (selected === 'sv' ? ' kl. ' : ' klo ') + time;
    note.textContent = selected === 'sv'
      ? 'Webbplatsen öppnar ' + date.textContent + ' finsk tid.'
      : 'Sivusto avautuu ' + date.textContent + ' Suomen aikaa.';
    switcher.querySelectorAll('button').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.language === selected));
    });
    try { localStorage.setItem('arttu-tinya-language', selected); } catch (error) {}
  }

  switcher.addEventListener('click', event => {
    const button = event.target.closest('button[data-language]');
    if (button) setLanguage(button.dataset.language);
  });
  setLanguage(document.documentElement.lang);
  updateCountdown();
  window.setInterval(updateCountdown, 1000);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && Date.now() >= target) checkLaunch();
  });
  checkLaunch();
})();
