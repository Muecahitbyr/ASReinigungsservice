// Ein einziger rAF-gesteuerter Scroll-Loop für alle scrollabhängigen Effekte.

const subscribers = new Set();
let ticking = false;

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

// Fortschritt eines Elements mit Sticky-Inhalt: 0 = Oberkante erreicht, 1 = Ende erreicht.
export function stickyProgress(el, vh) {
  const r = el.getBoundingClientRect();
  const total = r.height - vh;
  return total <= 0 ? 0 : clamp(-r.top / total);
}

// Fortschritt, während ein Element durch den Viewport läuft (0 = taucht unten auf, 1 = oben verschwunden).
export function viewProgress(el, vh) {
  const r = el.getBoundingClientRect();
  return clamp((vh - r.top) / (vh + r.height));
}

function update() {
  ticking = false;
  const vh = window.innerHeight;
  subscribers.forEach((fn) => fn(vh));
}

function request() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(update);
  }
}

export function onScroll(fn) {
  subscribers.add(fn);
  request();
}

window.addEventListener('scroll', request, { passive: true });
window.addEventListener('resize', request);
