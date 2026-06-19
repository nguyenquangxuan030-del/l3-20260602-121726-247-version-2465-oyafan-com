(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');

    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        var isOpen = menu.classList.toggle('is-open');
        document.body.classList.toggle('menu-open', isOpen);
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }

    document.querySelectorAll('img').forEach(function (image) {
      image.addEventListener('error', function () {
        image.classList.add('is-missing');
      });
    });

    var slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
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

      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    function startSlider() {
      if (slides.length <= 1) {
        return;
      }

      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    function stopSlider() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        stopSlider();
        showSlide(index);
        startSlider();
      });
    });

    showSlide(0);
    startSlider();

    var filterInput = document.querySelector('[data-filter-input]');
    var cards = Array.from(document.querySelectorAll('[data-movie-card]'));
    var countNode = document.querySelector('[data-filter-count]');

    function updateFilter() {
      if (!filterInput || !cards.length) {
        return;
      }

      var keyword = filterInput.value.trim().toLowerCase();
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = (card.getAttribute('data-search') || '').toLowerCase();
        var match = !keyword || haystack.indexOf(keyword) !== -1;
        card.style.display = match ? '' : 'none';
        if (match) {
          visible += 1;
        }
      });

      if (countNode) {
        countNode.textContent = String(visible);
      }
    }

    if (filterInput) {
      filterInput.addEventListener('input', updateFilter);
      updateFilter();
    }
  });
})();
