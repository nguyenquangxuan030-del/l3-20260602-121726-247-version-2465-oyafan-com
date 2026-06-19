(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var prev = document.querySelector('[data-hero-prev]');
  var next = document.querySelector('[data-hero-next]');
  var current = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  }

  function restartTimer() {
    if (timer) {
      window.clearInterval(timer);
    }

    if (slides.length > 1) {
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  if (prev) {
    prev.addEventListener('click', function () {
      showSlide(current - 1);
      restartTimer();
    });
  }

  if (next) {
    next.addEventListener('click', function () {
      showSlide(current + 1);
      restartTimer();
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
      restartTimer();
    });
  });

  restartTimer();

  var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));

  panels.forEach(function (panel) {
    var searchInput = panel.querySelector('[data-local-search]');
    var resetButton = panel.querySelector('[data-filter-reset]');
    var cardList = document.querySelector('[data-card-list]');
    var empty = document.querySelector('[data-empty-state]');
    var selectedYear = '';
    var selectedRegion = '';

    if (!cardList) {
      return;
    }

    var cards = Array.prototype.slice.call(cardList.querySelectorAll('.movie-card'));

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function applyFilters() {
      var query = normalize(searchInput ? searchInput.value : '');
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-category'),
          card.textContent
        ].join(' '));

        var yearMatches = !selectedYear || card.getAttribute('data-year') === selectedYear;
        var regionMatches = !selectedRegion || card.getAttribute('data-region') === selectedRegion;
        var queryMatches = !query || text.indexOf(query) !== -1;
        var shouldShow = yearMatches && regionMatches && queryMatches;

        card.hidden = !shouldShow;

        if (shouldShow) {
          visible += 1;
        }
      });

      if (empty) {
        empty.hidden = visible !== 0;
      }
    }

    if (searchInput) {
      var params = new URLSearchParams(window.location.search);
      var initialQuery = params.get('q');

      if (initialQuery) {
        searchInput.value = initialQuery;
      }

      searchInput.addEventListener('input', applyFilters);
    }

    panel.querySelectorAll('[data-filter-year]').forEach(function (button) {
      button.addEventListener('click', function () {
        selectedYear = button.getAttribute('data-filter-year') || '';
        panel.querySelectorAll('[data-filter-year]').forEach(function (item) {
          item.classList.toggle('is-active', item === button);
        });
        applyFilters();
      });
    });

    panel.querySelectorAll('[data-filter-region]').forEach(function (button) {
      button.addEventListener('click', function () {
        selectedRegion = button.getAttribute('data-filter-region') || '';
        panel.querySelectorAll('[data-filter-region]').forEach(function (item) {
          item.classList.toggle('is-active', item === button);
        });
        applyFilters();
      });
    });

    if (resetButton) {
      resetButton.addEventListener('click', function () {
        selectedYear = '';
        selectedRegion = '';

        if (searchInput) {
          searchInput.value = '';
        }

        panel.querySelectorAll('[data-filter-year], [data-filter-region]').forEach(function (button) {
          var value = button.getAttribute('data-filter-year');
          var region = button.getAttribute('data-filter-region');
          button.classList.toggle('is-active', value === '' || region === '');
        });

        applyFilters();
      });
    }

    applyFilters();
  });
})();
