(function () {
  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function setupMenu() {
    var button = document.querySelector("[data-menu-button]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (!button || !menu) {
      return;
    }
    button.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    if (slides.length < 2 || dots.length < 2) {
      return;
    }
    var active = 0;
    var timer = null;

    function show(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === active);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(active + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
        start();
      });
    });

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      hero.addEventListener("mouseenter", stop);
      hero.addEventListener("mouseleave", start);
    }
    start();
  }

  function setupFilters() {
    var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]"));
    panels.forEach(function (panel) {
      var scope = panel.parentElement || document;
      var cards = Array.prototype.slice.call(scope.querySelectorAll(".filter-card"));
      var input = panel.querySelector("[data-filter-input]");
      var regionSelect = panel.querySelector("[data-filter-region]");
      var yearSelect = panel.querySelector("[data-filter-year]");
      var sortSelect = panel.querySelector("[data-filter-sort]");
      var results = scope.querySelector("[data-filter-results]");
      var empty = scope.querySelector("[data-empty-state]");

      function fillSelect(select, values) {
        if (!select) {
          return;
        }
        var current = select.value;
        values.forEach(function (value) {
          var option = document.createElement("option");
          option.value = value;
          option.textContent = value;
          select.appendChild(option);
        });
        select.value = current;
      }

      var regions = Array.from(new Set(cards.map(function (card) {
        return card.getAttribute("data-region") || "";
      }).filter(Boolean))).sort();

      var years = Array.from(new Set(cards.map(function (card) {
        return card.getAttribute("data-year") || "";
      }).filter(Boolean))).sort().reverse();

      fillSelect(regionSelect, regions);
      fillSelect(yearSelect, years);

      function apply() {
        var keyword = normalize(input && input.value);
        var region = normalize(regionSelect && regionSelect.value);
        var year = normalize(yearSelect && yearSelect.value);
        var visible = [];

        cards.forEach(function (card) {
          var text = normalize(card.getAttribute("data-text"));
          var cardRegion = normalize(card.getAttribute("data-region"));
          var cardYear = normalize(card.getAttribute("data-year"));
          var matched = true;
          if (keyword && text.indexOf(keyword) === -1) {
            matched = false;
          }
          if (region && cardRegion !== region) {
            matched = false;
          }
          if (year && cardYear !== year) {
            matched = false;
          }
          card.style.display = matched ? "" : "none";
          if (matched) {
            visible.push(card);
          }
        });

        if (sortSelect && results) {
          var sortValue = sortSelect.value;
          visible.sort(function (a, b) {
            if (sortValue === "year") {
              return Number(b.getAttribute("data-year")) - Number(a.getAttribute("data-year"));
            }
            if (sortValue === "views") {
              var aText = a.textContent.match(/(\d+) 次播放/);
              var bText = b.textContent.match(/(\d+) 次播放/);
              return Number(bText && bText[1] || 0) - Number(aText && aText[1] || 0);
            }
            return 0;
          });
          visible.forEach(function (card) {
            results.appendChild(card);
          });
        }

        if (empty) {
          empty.classList.toggle("is-visible", visible.length === 0);
        }
      }

      [input, regionSelect, yearSelect, sortSelect].forEach(function (node) {
        if (node) {
          node.addEventListener("input", apply);
          node.addEventListener("change", apply);
        }
      });

      var params = new URLSearchParams(window.location.search);
      var query = params.get("q");
      if (query && input) {
        input.value = query;
      }
      apply();
    });
  }

  setupMenu();
  setupHero();
  setupFilters();
})();
