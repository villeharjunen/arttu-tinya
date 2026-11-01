// Etusivun kuvanauha: liukuu jatkuvasti, nuolet siirtävät kuva kerrallaan, ja liike pysähtyy painikkeesta.
(() => {
  'use strict';
  const hero = document.getElementById('home');
  const track = hero?.querySelector('.film-track');
  const site = document.getElementById('site');
  if (!track || !site) return;

  // Kuvat ovat HTML:ssä kerran; kopiot perään tekevät saumattoman silmukan.
  const originals = [...track.querySelectorAll('img')];
  if (!originals.length) return;
  originals.forEach(img => track.appendChild(img.cloneNode(false)));
  const images = [...track.querySelectorAll('img')];
  const count = originals.length;

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pause = document.getElementById('film-pause');
  let paused = motion.matches;
  const arrows = [];

  function updatePause() {
    if (!pause) return;
    pause.textContent = SITE_LANGUAGE.t(paused ? 'Jatka kuvanauhaa' : 'Pysäytä kuvanauha');
    pause.setAttribute('aria-pressed', String(paused));
  }
  if (pause) pause.addEventListener('click', () => { paused = !paused; updatePause(); });
  updatePause();

  let offset = 0, last = 0, tween = null, hold = 0;
  const wrap = (v, total) => ((v % total) + total) % total;

  function metrics() {
    const step = images[0].getBoundingClientRect().width;
    return { step, total: step * count };
  }

  function draw() {
    const { total } = metrics();
    if (total > 0) track.style.transform = `translate3d(${-wrap(offset, total)}px,0,0)`;
  }

  function jump(direction) {
    const now = performance.now(), { step, total } = metrics();
    if (!step || !total) return;
    offset = wrap(offset, total);
    const position = offset / step;
    const target = (direction > 0 ? Math.floor(position + .015) + 1 : Math.ceil(position - .015) - 1) * step;
    tween = { start: now, from: offset, to: target, duration: motion.matches ? 0 : 650 };
    hold = now + (motion.matches ? 0 : 650);
    if (motion.matches) { offset = target; tween = null; draw(); }
  }

  for (const [direction, label, cls, symbol] of [[-1, 'Edellinen kuva', 'film-prev', '‹'], [1, 'Seuraava kuva', 'film-next', '›']]) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'film-arrow ' + cls;
    b.setAttribute('data-label-fi', label);
    b.setAttribute('aria-label', SITE_LANGUAGE.t(label));
    b.textContent = symbol;
    b.addEventListener('click', () => jump(direction));
    hero.appendChild(b);
    arrows.push(b);
  }
  window.addEventListener('site-language-change', () => {
    updatePause();
    arrows.forEach(button => button.setAttribute('aria-label', SITE_LANGUAGE.t(button.dataset.labelFi)));
  });

  function tick(now) {
    const dt = last ? Math.min(now - last, 60) : 0;
    last = now;
    if (!site.hidden && !document.hidden) {
      if (tween) {
        const p = tween.duration ? Math.min(1, (now - tween.start) / tween.duration) : 1;
        const eased = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        offset = tween.from + (tween.to - tween.from) * eased;
        if (p === 1) tween = null;
      } else if (!paused && now > hold) {
        const { total } = metrics();
        offset += total * dt / 76000;
      }
      draw();
    }
    requestAnimationFrame(tick);
  }

  new MutationObserver(() => { last = 0; draw(); }).observe(site, { attributes: true, attributeFilter: ['hidden'] });
  let previousWidth = metrics().step;
  window.addEventListener('resize', () => {
    const { step } = metrics();
    if (previousWidth > 0) offset = offset / previousWidth * step;
    previousWidth = step;
    tween = null;
    draw();
  });
  document.addEventListener('visibilitychange', () => { last = 0; });
  hero.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      jump(e.key === 'ArrowRight' ? 1 : -1);
    }
  });
  draw();
  requestAnimationFrame(tick);
})();
