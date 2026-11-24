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
  const racePreference = document.getElementById('race-preference');
  const transportFields = document.getElementById('transport-fields');
  const transportDays = Array.from(document.querySelectorAll('#transport-days input[type=checkbox]'));
  const transportDetails = document.getElementById('transport-details');
  const transportInputs = Array.from(transportDetails.querySelectorAll('input'));

  function updateTransportChoices() {
    const attending = attendance.value === 'Osallistun mielelläni';
    transportFields.hidden = !attending;
    if (!attending) {
      transportDays.forEach(checkbox => { checkbox.checked = false; });
      transportInputs.forEach(input => { input.value = ''; });
    }
    const needsTransport = attending && transportDays.some(checkbox => checkbox.checked);
    transportDetails.hidden = !needsTransport;
    transportInputs.forEach(input => { input.disabled = !needsTransport; });
  }

  function updateEventChoices() {
    const attending = attendance.value === 'Osallistun mielelläni';
    eventGroup.hidden = !attending;
    if (!attending) eventCheckboxes.forEach(checkbox => { checkbox.checked = false; });
    if (!attending) racePreference.value = '';
    const selected = eventCheckboxes.some(checkbox => checkbox.checked);
    eventCheckboxes[0].required = attending && !selected;
    eventCheckboxes[0].setCustomValidity(
      attending && !selected ? SITE_LANGUAGE.t('Valitse vähintään yksi viikonlopun tapahtuma.') : ''
    );
    updateTransportChoices();
  }

  attendance.addEventListener('change', updateEventChoices);
  transportDays.forEach(checkbox => checkbox.addEventListener('change', updateTransportChoices));
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
      const attending = attendance.value === 'Osallistun mielelläni';
      const hasTransport = attending && transportDays.some(checkbox => checkbox.checked);
      payload.set('borgoPreference', attending && eventCheckboxes[0].checked ? racePreference.value : '');
      payload.set('borgoPayloadVersion', '2');
      payload.set('transportNeed', attending ? (hasTransport ? 'Kyllä' : 'Ei') : '');
      eventNames.forEach((name, index) => {
        payload.set(name, eventCheckboxes[index].checked ? 'TRUE' : 'FALSE');
      });
      transportDays.forEach(checkbox => {
        payload.set(checkbox.name, attendance.value === 'Osallistun mielelläni' && checkbox.checked ? 'TRUE' : 'FALSE');
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
