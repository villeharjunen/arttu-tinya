// Ohjelmakortit: klikkaus kääntää kortin ja näyttää päivän aikataulun.
(() => {
  'use strict';
  document.querySelectorAll('.flip-toggle').forEach(button => button.addEventListener('click', () => {
    const flipped = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(flipped));
    button.querySelector('.flip-front').setAttribute('aria-hidden', String(flipped));
    button.querySelector('.flip-back').setAttribute('aria-hidden', String(!flipped));
  }));
  const raceCard = document.querySelector('.race-day');
  const raceFront = raceCard.querySelector('.flip-front');
  const raceFrontToggle = raceCard.querySelector('.race-front-toggle');
  const raceBack = raceCard.querySelector('.flip-back');
  const raceReturn = raceCard.querySelector('.race-return');
  function setRaceFlipped(flipped) {
    raceCard.classList.toggle('is-flipped', flipped);
    raceFrontToggle.setAttribute('aria-expanded', String(flipped));
    raceFront.setAttribute('aria-hidden', String(flipped));
    raceFront.inert = flipped;
    raceBack.setAttribute('aria-hidden', String(!flipped));
    raceBack.inert = !flipped;
    (flipped ? raceReturn : raceFrontToggle).focus({ preventScroll: true });
  }
  raceFront.addEventListener('click', event => {
    if (event.target.closest('a, button')) return;
    setRaceFlipped(true);
  });
  raceBack.addEventListener('click', event => {
    if (event.target.closest('a, button')) return;
    setRaceFlipped(false);
  });
  raceFrontToggle.addEventListener('click', () => setRaceFlipped(true));
  raceReturn.addEventListener('click', () => setRaceFlipped(false));
})();
