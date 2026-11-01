// RSVP-lomake: vastaus tallentuu Google Sheetiin (CONFIG.rsvpEndpoint).
(() => {
  'use strict';
  const form = document.getElementById('rsvp-form');
  const thanks = document.getElementById('thanks');
  const submit = form.querySelector('button[type=submit]');
  const error = document.getElementById('rsvp-error');

  form.onsubmit = async e => {
    e.preventDefault();
    error.hidden = true;
    submit.disabled = true;
    submit.textContent = SITE_LANGUAGE.t('Lähetetään…');
    try {
      const res = await fetch(CONFIG.rsvpEndpoint, { method: 'POST', body: new URLSearchParams(new FormData(form)) });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'save failed');
      form.hidden = true;
      thanks.hidden = false;
    } catch (err) {
      error.textContent = SITE_LANGUAGE.t('Lähetys epäonnistui. Tarkista nettiyhteys ja yritä uudelleen. Jos ongelma jatkuu, ilmoittaudu suoraan Arttulle tai Tinyalle.');
      error.hidden = false;
    } finally {
      submit.disabled = false;
      submit.textContent = SITE_LANGUAGE.t('Lähetä ilmoittautuminen');
    }
  };

  document.getElementById('reset').onclick = () => {
    form.reset();
    form.hidden = false;
    thanks.hidden = true;
  };
})();
