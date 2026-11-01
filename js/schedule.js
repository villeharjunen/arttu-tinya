// Ohjelmakortit: klikkaus kääntää kortin ja näyttää päivän aikataulun.
(() => {
  'use strict';
  document.querySelectorAll('.flip-toggle').forEach(button => button.addEventListener('click', () => {
    const flipped = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(flipped));
    button.querySelector('.flip-front').setAttribute('aria-hidden', String(flipped));
    button.querySelector('.flip-back').setAttribute('aria-hidden', String(!flipped));
  }));
})();
