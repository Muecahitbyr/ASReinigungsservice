import { business, openingHours, reviews } from './config.js';
import { reducedMotion } from './scroll.js';

const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// ---------- Öffnungszeiten ----------

// Wochentag in Bottrop (Europe/Berlin), unabhängig von der Zeitzone des Besuchers. 0 = Montag.
function berlinWeekdayIndex() {
  const name = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'Europe/Berlin' }).format(new Date());
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(name);
}

export function renderOpeningHours() {
  const list = document.querySelector('[data-hours]');
  if (!list) return;

  const render = () => {
    const today = berlinWeekdayIndex();
    list.innerHTML = openingHours
      .map(({ day, hours }, i) => {
        const time = hours ? `${hours[0]} – ${hours[1]} Uhr` : 'Geschlossen';
        const current = i === today;
        return `<li class="hours__row${current ? ' is-today' : ''}${hours ? '' : ' is-closed'}"${current ? ' aria-current="date"' : ''}>
          <span class="hours__day">${day}</span>
          <span class="hours__time">${time}</span>
        </li>`;
      })
      .join('');
  };

  render();
  // Hervorhebung nach Mitternacht aktualisieren, falls die Seite offen bleibt.
  setInterval(render, 60_000);
}

// ---------- Bewertungen (Endlos-Laufband) ----------

const starIcon =
  '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z"/></svg>';

const googleIcon = `<svg viewBox="0 0 24 24" aria-hidden="true" class="review__google">
  <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h5.9c-.3 1.4-1 2.5-2.2 3.3v2.7h3.5c2.1-1.9 3.3-4.7 3.3-8z"/>
  <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2.1v2.8C3.9 20.5 7.7 23 12 23z"/>
  <path fill="#FBBC05" d="M5.7 14.1c-.2-.7-.4-1.4-.4-2.1s.1-1.4.4-2.1V7.1H2.1C1.4 8.6 1 10.2 1 12s.4 3.4 1.1 4.9l3.6-2.8z"/>
  <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2C17.5 2.1 15 1 12 1 7.7 1 3.9 3.5 2.1 7.1l3.6 2.8c.9-2.6 3.4-4.5 6.3-4.5z"/>
</svg>`;

function reviewCard({ name, rating, text }) {
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const li = document.createElement('li');
  li.className = 'review';
  li.innerHTML = `
    <div class="review__head">
      <span class="review__avatar">${escapeHtml(initials)}</span>
      <div>
        <p class="review__name">${escapeHtml(name)}</p>
        <p class="review__stars" aria-label="${rating} von 5 Sternen">${starIcon.repeat(rating)}</p>
      </div>
      ${googleIcon}
    </div>
    <blockquote class="review__text">„${escapeHtml(text)}“</blockquote>`;
  return li;
}

export function initReviewMarquee() {
  const marquee = document.querySelector('[data-marquee]');
  if (!marquee) return;
  const track = marquee.querySelector('.marquee__track');
  const speed = 45; // px pro Sekunde

  const build = () => {
    track.innerHTML = '';
    const group = document.createElement('ul');
    group.className = 'marquee__group';
    track.append(group);

    // Gruppe so lange auffüllen, bis sie breiter als der Viewport ist …
    do {
      reviews.forEach((r) => group.append(reviewCard(r)));
    } while (group.scrollWidth < window.innerWidth * 1.15);

    // … und dann einmal duplizieren: Die Animation verschiebt um genau eine
    // Gruppenbreite, dadurch entsteht ein nahtloser Loop ohne Anfang und Ende.
    const clone = group.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.append(clone);

    track.style.setProperty('--duration', `${group.scrollWidth / speed}s`);
  };

  build();
  if (reducedMotion) marquee.classList.add('is-static');

  let lastWidth = window.innerWidth;
  let timer;
  window.addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        build();
      }
    }, 200);
  });
}

// ---------- Navigation ----------

export function initNav() {
  const header = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const fab = document.querySelector('.fab-call');
  if (!header) return;

  const darkSections = [...document.querySelectorAll('[data-nav-dark]')];
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
    const probe = header.offsetHeight / 2;
    const overDark = darkSections.some((s) => {
      const r = s.getBoundingClientRect();
      return r.top <= probe && r.bottom >= probe;
    });
    header.classList.toggle('is-dark', overDark && !header.classList.contains('is-open'));
    fab?.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.7);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const setOpen = (open) => {
    header.classList.toggle('is-open', open);
    toggle?.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('no-scroll', open);
  };
  toggle?.addEventListener('click', () => setOpen(!header.classList.contains('is-open')));
  header.querySelectorAll('.nav__links a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  window.addEventListener('keydown', (e) => e.key === 'Escape' && setOpen(false));

  // Aktiven Abschnitt in der Navigation markieren.
  const links = [...header.querySelectorAll('.nav__links a[href^="#"]')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`));
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach((s) => io.observe(s));
}

// ---------- Kontaktdaten & Anfrageformular ----------

export function fillBusinessData() {
  document.querySelectorAll('[data-phone-link]').forEach((a) => (a.href = business.phoneHref));
  document.querySelectorAll('[data-phone-text]').forEach((el) => (el.textContent = business.phoneDisplay));
  document.querySelectorAll('[data-maps-link]').forEach((a) => (a.href = business.mapsUrl));
  document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
}

export function initRequestForm() {
  const form = document.querySelector('[data-request-form]');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const lines = [
      `Hallo ${business.name},`,
      '',
      `ich interessiere mich für: ${data.get('service')}.`,
      data.get('message') ? `\n${data.get('message')}` : '',
      '',
      `Name: ${data.get('name')}`,
      data.get('phone') ? `Telefon: ${data.get('phone')}` : '',
      data.get('place') ? `Ort: ${data.get('place')}` : '',
    ].filter((l, i, arr) => l !== '' || arr[i - 1] !== '');

    const url = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener');
  });
}
