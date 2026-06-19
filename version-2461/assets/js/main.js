(function () {
  var body = document.body;
  var toggle = document.querySelector('.menu-toggle');

  if (toggle) {
    toggle.addEventListener('click', function () {
      body.classList.toggle('menu-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var controls = Array.prototype.slice.call(document.querySelectorAll('.hero-control'));
  var current = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === current);
    });

    controls.forEach(function (control, i) {
      control.classList.toggle('active', i === current);
    });
  }

  function startHero() {
    if (slides.length < 2) {
      return;
    }

    timer = window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  controls.forEach(function (control, i) {
    control.addEventListener('click', function () {
      window.clearInterval(timer);
      showSlide(i);
      startHero();
    });
  });

  showSlide(0);
  startHero();

  var searchInput = document.querySelector('[data-filter-search]');
  var regionFilter = document.querySelector('[data-filter-region]');
  var typeFilter = document.querySelector('[data-filter-type]');
  var clearButton = document.querySelector('[data-filter-clear]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
  var emptyState = document.querySelector('.empty-state');

  function valueOf(node) {
    return node ? node.value.trim().toLowerCase() : '';
  }

  function applyFilters() {
    if (!cards.length) {
      return;
    }

    var query = valueOf(searchInput);
    var region = valueOf(regionFilter);
    var type = valueOf(typeFilter);
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = [
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-year'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-type'),
        card.textContent
      ].join(' ').toLowerCase();

      var okQuery = !query || haystack.indexOf(query) !== -1;
      var okRegion = !region || String(card.getAttribute('data-region')).toLowerCase().indexOf(region) !== -1;
      var okType = !type || String(card.getAttribute('data-type')).toLowerCase().indexOf(type) !== -1;
      var show = okQuery && okRegion && okType;

      card.classList.toggle('hidden-card', !show);
      if (show) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle('show', visible === 0);
    }
  }

  if (searchInput) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q) {
      searchInput.value = q;
    }
  }

  [searchInput, regionFilter, typeFilter].forEach(function (node) {
    if (node) {
      node.addEventListener('input', applyFilters);
      node.addEventListener('change', applyFilters);
    }
  });

  if (clearButton) {
    clearButton.addEventListener('click', function () {
      if (searchInput) {
        searchInput.value = '';
      }
      if (regionFilter) {
        regionFilter.value = '';
      }
      if (typeFilter) {
        typeFilter.value = '';
      }
      applyFilters();
    });
  }

  applyFilters();
})();
