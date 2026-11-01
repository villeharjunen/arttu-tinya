// Laskuri vihkimiseen (aika: CONFIG.weddingTime).
(() => {
  'use strict';
  const target = new Date(CONFIG.weddingTime).getTime();

  function update() {
    const remaining = Math.max(0, Math.floor((target - Date.now()) / 1000));
    const values = {
      days: Math.floor(remaining / 86400),
      hours: Math.floor(remaining % 86400 / 3600),
      minutes: Math.floor(remaining % 3600 / 60),
      seconds: remaining % 60
    };
    Object.entries(values).forEach(([unit, value]) => {
      document.getElementById('cd-' + unit).textContent = String(value).padStart(2, '0');
    });
    if (remaining === 0) document.getElementById('countdown-note').textContent = SITE_LANGUAGE.t('Häähetki on täällä!');
  }

  update();
  setInterval(update, 1000);
})();
