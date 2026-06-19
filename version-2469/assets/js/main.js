const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');

if (menuButton && mobileMenu) {
  menuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
}

const heroSlides = Array.from(document.querySelectorAll('[data-hero-slide]'));
const heroDots = Array.from(document.querySelectorAll('[data-hero-dot]'));
let heroIndex = 0;

function showHeroSlide(index) {
  if (!heroSlides.length) {
    return;
  }

  heroIndex = (index + heroSlides.length) % heroSlides.length;

  heroSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle('active', slideIndex === heroIndex);
  });

  heroDots.forEach((dot, dotIndex) => {
    dot.classList.toggle('active', dotIndex === heroIndex);
  });
}

heroDots.forEach((dot, dotIndex) => {
  dot.addEventListener('click', () => {
    showHeroSlide(dotIndex);
  });
});

if (heroSlides.length > 1) {
  window.setInterval(() => {
    showHeroSlide(heroIndex + 1);
  }, 5200);
}

function normalizeText(value) {
  return String(value || '').trim().toLowerCase();
}

function applyCardFilters() {
  const queryInput = document.querySelector('[data-card-filter]');
  const yearSelect = document.querySelector('[data-year-filter]');
  const query = normalizeText(queryInput ? queryInput.value : '');
  const year = yearSelect ? yearSelect.value : '';
  const cards = Array.from(document.querySelectorAll('.movie-card, .ranking-row'));

  cards.forEach((card) => {
    const text = normalizeText(card.getAttribute('data-card-text'));
    const cardYear = card.getAttribute('data-year') || '';
    const queryMatched = !query || text.includes(query);
    const yearMatched = !year || cardYear.includes(year);
    const matched = queryMatched && yearMatched;
    card.toggleAttribute('hidden-by-filter', !matched);
  });
}

const filterInput = document.querySelector('[data-card-filter]');
const yearFilter = document.querySelector('[data-year-filter]');

if (filterInput) {
  filterInput.addEventListener('input', applyCardFilters);
}

if (yearFilter) {
  yearFilter.addEventListener('change', applyCardFilters);
}
