import '@fontsource-variable/inter';
import './styles/main.css';

import {
  initReveal,
  initParallax,
  initHero,
  initWordReveal,
  initWindowScene,
  initProcessLine,
  initCounters,
  initSpotlight,
  initHedgeDraw,
} from './js/effects.js';
import {
  renderOpeningHours,
  initReviewMarquee,
  initNav,
  fillBusinessData,
  initRequestForm,
} from './js/sections.js';

fillBusinessData();
initNav();
renderOpeningHours();
initReviewMarquee();
initRequestForm();

initReveal();
initParallax();
initHero();
initWordReveal();
initWindowScene();
initProcessLine();
initCounters();
initSpotlight();
initHedgeDraw();


