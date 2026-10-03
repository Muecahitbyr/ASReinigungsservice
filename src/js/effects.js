import { onScroll, stickyProgress, viewProgress, clamp, reducedMotion } from './scroll.js';

// Elemente mit [data-reveal] blenden beim Hereinscrollen weich ein.
export function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  document.querySelectorAll('[data-reveal-group]').forEach((group) => {
    group.querySelectorAll('[data-reveal]').forEach((el, i) => el.style.setProperty('--delay', `${i * 80}ms`));
  });

  if (reducedMotion || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
  );
  items.forEach((el) => io.observe(el));
}

// Parallax: [data-speed] verschiebt sich relativ zur Mitte seines Elterncontainers.
export function initParallax() {
  if (reducedMotion) return;
  const items = [...document.querySelectorAll('[data-speed]')].map((el) => ({
    el,
    speed: parseFloat(el.dataset.speed),
    scope: el.closest('[data-parallax-scope]') || el.parentElement,
  }));

  onScroll((vh) => {
    items.forEach(({ el, speed, scope }) => {
      const r = scope.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const offset = (r.top + r.height / 2 - vh / 2) * -speed;
      el.style.setProperty('--py', `${offset.toFixed(1)}px`);
    });
  });
}

// Hero: Inhalt schrumpft und verblasst beim Wegscrollen.
export function initHero() {
  const hero = document.querySelector('.hero');
  const content = hero?.querySelector('.hero__content');
  if (!hero || !content || reducedMotion) return;

  onScroll(() => {
    const p = clamp(window.scrollY / hero.offsetHeight);
    content.style.transform = `translate3d(0, ${p * 90}px, 0) scale(${1 - p * 0.08})`;
    content.style.opacity = String(clamp(1 - p * 1.4));
  });
}

// Statement: Wort für Wort wird beim Scrollen eingefärbt.
export function initWordReveal() {
  const section = document.querySelector('.statement');
  const text = section?.querySelector('.statement__text');
  if (!section || !text) return;

  const words = text.textContent.trim().split(/\s+/);
  text.innerHTML = words.map((w) => `<span class="word">${w}</span>`).join(' ');
  const spans = [...text.querySelectorAll('.word')];

  if (reducedMotion) {
    spans.forEach((s) => s.classList.add('is-lit'));
    return;
  }

  onScroll((vh) => {
    const p = clamp(stickyProgress(section, vh) * 1.25);
    const lit = Math.round(p * spans.length);
    spans.forEach((s, i) => s.classList.toggle('is-lit', i < lit));
  });
}

// Fenster-Szene: Rakel wischt den Schmutz von links nach rechts weg.
export function initWindowScene() {
  const section = document.querySelector('.clean');
  if (!section) return;
  const stage = section.querySelector('.clean__stage');

  const apply = (wipe) => {
    stage.style.setProperty('--wipe', `${(wipe * 100).toFixed(2)}%`);
    section.classList.toggle('is-wiping', wipe > 0.01 && wipe < 0.99);
    section.classList.toggle('is-half', wipe > 0.55);
    section.classList.toggle('is-clean', wipe >= 0.99);
  };

  if (reducedMotion) {
    apply(1);
    return;
  }

  onScroll((vh) => {
    const p = stickyProgress(section, vh);
    apply(clamp((p - 0.12) / 0.66));
  });
}

// Ablauf: Verbindungslinie füllt sich beim Scrollen.
export function initProcessLine() {
  const steps = document.querySelector('.steps');
  if (!steps) return;
  const items = [...steps.querySelectorAll('.step')];

  onScroll((vh) => {
    const p = reducedMotion ? 1 : clamp((viewProgress(steps, vh) - 0.2) / 0.4);
    steps.style.setProperty('--fill', p.toFixed(3));
    items.forEach((el, i) => el.classList.toggle('is-active', p >= i / (items.length - 1) - 0.02));
  });
}

// Zahlen zählen hoch, sobald sie sichtbar werden.
export function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const run = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const fmt = new Intl.NumberFormat('de-DE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    if (reducedMotion) {
      el.textContent = fmt.format(target);
      return;
    }
    const start = performance.now();
    const duration = 1600;
    const tick = (now) => {
      const t = clamp((now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = fmt.format(target * eased);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          run(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => io.observe(el));
}

// Lichtschein folgt dem Mauszeiger auf den Karten.
export function initSpotlight() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  document.querySelectorAll('[data-spotlight]').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

// Hecken-Plan: saubere Formschnitt-Kontur zeichnet sich beim Hereinscrollen.
export function initHedgeDraw() {
  const section = document.querySelector('.hedge');
  if (!section) return;
  if (reducedMotion) {
    section.classList.add('is-drawn');
    return;
  }
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        section.classList.add('is-drawn');
        io.disconnect();
      }
    },
    { threshold: 0.35 }
  );
  io.observe(section);
}
