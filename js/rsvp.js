// RSVP-lomake: vastaus tallentuu Google Sheetiin (CONFIG.rsvpEndpoint).
(() => {
  'use strict';
  const form = document.getElementById('rsvp-form');
  const thanks = document.getElementById('thanks');
  const submit = form.querySelector('button[type=submit]');
  const error = document.getElementById('rsvp-error');
  const attendance = form.elements.attendance;
  const eventGroup = document.getElementById('rsvp-events');
  const eventCheckboxes = Array.from(eventGroup.querySelectorAll('input[type=checkbox]'));
  const eventNames = ['thursdayRun', 'thursdayPizzaParty', 'fridayWedding', 'saturdayPoolParty'];

  function updateEventChoices() {
    const attending = attendance.value === 'Osallistun mielelläni';
    eventGroup.hidden = !attending;
    if (!attending) eventCheckboxes.forEach(checkbox => { checkbox.checked = false; });
    const selected = eventCheckboxes.some(checkbox => checkbox.checked);
    eventCheckboxes[0].required = attending;
    eventCheckboxes[0].setCustomValidity(
      attending && !selected ? SITE_LANGUAGE.t('Valitse vähintään yksi viikonlopun tapahtuma.') : ''
    );
  }

  attendance.addEventListener('change', updateEventChoices);
  eventCheckboxes.forEach(checkbox => checkbox.addEventListener('change', updateEventChoices));
  window.addEventListener('site-language-change', updateEventChoices);
  updateEventChoices();

  form.onsubmit = async e => {
    e.preventDefault();
    error.hidden = true;
    submit.disabled = true;
    submit.textContent = SITE_LANGUAGE.t('Lähetetään…');
    try {
      const payload = new URLSearchParams(new FormData(form));
      eventNames.forEach((name, index) => {
        payload.set(name, eventCheckboxes[index].checked ? 'TRUE' : 'FALSE');
      });
      const res = await fetch(CONFIG.rsvpEndpoint, { method: 'POST', body: payload });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'save failed');
      form.hidden = true;
      thanks.hidden = false;
    } catch (err) {
      error.textContent = err.message === 'events'
        ? SITE_LANGUAGE.t('Valitse vähintään yksi viikonlopun tapahtuma.')
        : SITE_LANGUAGE.t('Lähetys epäonnistui. Tarkista nettiyhteys ja yritä uudelleen. Jos ongelma jatkuu, ilmoittaudu suoraan Arttulle tai Tinyalle.');
      error.hidden = false;
    } finally {
      submit.disabled = false;
      submit.textContent = SITE_LANGUAGE.t('Lähetä ilmoittautuminen');
    }
  };

  document.getElementById('reset').onclick = () => {
    form.reset();
    updateEventChoices();
    form.hidden = false;
    thanks.hidden = true;
  };
})();
