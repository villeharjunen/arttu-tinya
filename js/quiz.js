// Kutsun avaamista edeltävä tietovisa.
const QUIZ = (() => {
  'use strict';
  const page = document.getElementById('quiz');
  if (!CONFIG.QUIZ_MODE) {
    if (page) page.remove();
    return { start() {} };
  }
  const form = document.getElementById('quiz-form');
  const nickname = document.getElementById('quiz-nickname');
  const error = document.getElementById('quiz-error');
  const steps = Array.from(form.querySelectorAll('[data-quiz-step]'));
  const submit = steps[3].querySelector('button[type=submit]');
  let step = 0;
  let startedAt;
  let onComplete;

  function showStep(index) {
    step = index;
    steps.forEach((element, i) => { element.hidden = i !== index; });
    const focusTarget = index === 0 ? nickname : steps[index].querySelector('input');
    focusTarget.focus();
  }

  nickname.addEventListener('input', () => nickname.setCustomValidity(''));
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (step === 0) {
      nickname.value = nickname.value.trim();
      nickname.setCustomValidity(nickname.value ? '' : SITE_LANGUAGE.t('Kirjoita nimimerkki.'));
      if (!nickname.reportValidity()) return;
    } else {
      const required = steps[step].querySelector('input[required]');
      if (!required.reportValidity()) return;
    }
    if (step < 3) {
      showStep(step + 1);
      return;
    }

    error.hidden = true;
    submit.disabled = true;
    submit.textContent = SITE_LANGUAGE.t('Lähetetään…');
    try {
      const payload = new URLSearchParams(new FormData(form));
      payload.set('type', 'quiz');
      payload.set('startedAt', startedAt);
      const response = await fetch(CONFIG.rsvpEndpoint, { method: 'POST', body: payload });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error('quiz save failed');
      page.hidden = true;
      onComplete();
    } catch (err) {
      error.textContent = SITE_LANGUAGE.t('Vastausten lähetys epäonnistui. Tarkista nettiyhteys ja yritä uudelleen.');
      error.hidden = false;
    } finally {
      submit.disabled = false;
      submit.textContent = SITE_LANGUAGE.t('Lähetä vastaukset');
    }
  });

  return {
    start(callback) {
      form.reset();
      nickname.setCustomValidity('');
      error.hidden = true;
      startedAt = new Date().toISOString();
      onComplete = callback;
      page.hidden = false;
      showStep(0);
      window.scrollTo(0, 0);
    }
  };
})();
