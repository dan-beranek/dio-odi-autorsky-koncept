(() => {
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (toggle && mobileNav) {
    const closeMenu = () => {
      toggle.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('is-open');
    };
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      mobileNav.classList.toggle('is-open', !isOpen);
    });
    mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  const descriptions = {
    entity: ['Entita', 'Stabilizovaný interpretační uzel: firma, osoba, produkt, projekt nebo instituce, jejíž identita má zůstat rozlišitelná.'],
    representation: ['Reprezentace', 'Texty, data, profily, publikace, vztahy a další stopy, z nichž pozorovatelé identitu skládají.'],
    interpretation: ['Interpretace', 'Význam, který z dostupných stop vytváří člověk, vyhledávač, AI nebo datový systém.'],
    trust: ['Důvěra', 'Doložitelnost, konzistence a provenance, které určují, nakolik lze rekonstrukci považovat za spolehlivou.'],
    relationship: ['Vztah', 'Vazby k lidem, organizacím, dílům, kategoriím a zdrojům, které entitu ukotvují v širším poli.'],
    reconstruction: ['Rekonstrukce', 'Výsledná podoba entity znovu sestavená konkrétním pozorovatelem z dostupných signálů a vztahů.']
  };

  const points = [...document.querySelectorAll('.k6-point')];
  const title = document.querySelector('[data-k6-title]');
  const copy = document.querySelector('[data-k6-copy]');
  const selectPoint = (point) => {
    const key = point.dataset.k6;
    if (!descriptions[key] || !title || !copy) return;
    points.forEach((item) => item.classList.toggle('is-active', item === point));
    title.textContent = descriptions[key][0];
    copy.textContent = descriptions[key][1];
  };
  points.forEach((point) => {
    point.addEventListener('click', () => selectPoint(point));
    point.addEventListener('focus', () => selectPoint(point));
    point.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectPoint(point);
      }
    });
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = document.querySelectorAll('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach((item) => observer.observe(item));
  } else {
    items.forEach((item) => item.classList.add('is-visible'));
  }
})();
