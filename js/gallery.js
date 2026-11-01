// Kuvagalleria: kuva aukeaa suurena dialogiin.
(() => {
  'use strict';
  const box = document.getElementById('lightbox');
  const large = document.getElementById('large');

  document.querySelectorAll('.photo-button').forEach(button => {
    button.onclick = () => {
      large.src = button.querySelector('img').src;
      box.showModal();
    };
  });
  document.getElementById('close').onclick = () => box.close();
  box.onclick = e => { if (e.target === box) box.close(); };
})();
