(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var toggle = document.querySelector("[data-mobile-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");

    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        menu.classList.toggle("is-open");
      });
    }

    document.querySelectorAll("[data-rail]").forEach(function (rail) {
      var section = rail.closest("section");
      var prev = section ? section.querySelector("[data-rail-prev]") : null;
      var next = section ? section.querySelector("[data-rail-next]") : null;

      if (prev) {
        prev.addEventListener("click", function () {
          rail.scrollBy({ left: -320, behavior: "smooth" });
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          rail.scrollBy({ left: 320, behavior: "smooth" });
        });
      }
    });

    document.querySelectorAll("[data-hero]").forEach(function (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var prev = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");
      var active = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }

        active = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === active);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === active);
        });
      }

      function restart() {
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(function () {
          show(active + 1);
        }, 5000);
      }

      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          show(index);
          restart();
        });
      });

      if (prev) {
        prev.addEventListener("click", function () {
          show(active - 1);
          restart();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(active + 1);
          restart();
        });
      }

      show(0);
      restart();
    });

    document.querySelectorAll("[data-search-area]").forEach(function (area) {
      var root = area.parentElement || document;
      var input = area.querySelector("[data-search-input]");
      var regionSelect = area.querySelector("[data-filter-region]");
      var yearSelect = area.querySelector("[data-filter-year]");
      var cards = Array.prototype.slice.call(root.querySelectorAll("[data-movie-card]"));
      var emptyState = root.querySelector("[data-empty-state]");
      var regions = [];
      var years = [];

      cards.forEach(function (card) {
        var region = card.getAttribute("data-region") || "";
        var year = card.getAttribute("data-year") || "";

        if (region && regions.indexOf(region) === -1) {
          regions.push(region);
        }

        if (year && years.indexOf(year) === -1) {
          years.push(year);
        }
      });

      regions.sort().forEach(function (region) {
        if (regionSelect) {
          var option = document.createElement("option");
          option.value = region;
          option.textContent = region;
          regionSelect.appendChild(option);
        }
      });

      years.sort().reverse().forEach(function (year) {
        if (yearSelect) {
          var option = document.createElement("option");
          option.value = year;
          option.textContent = year;
          yearSelect.appendChild(option);
        }
      });

      function filter() {
        var keyword = input ? input.value.trim().toLowerCase() : "";
        var regionValue = regionSelect ? regionSelect.value : "";
        var yearValue = yearSelect ? yearSelect.value : "";
        var visibleCount = 0;

        cards.forEach(function (card) {
          var text = [
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-year"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-tags")
          ].join(" ").toLowerCase();
          var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
          var matchRegion = !regionValue || card.getAttribute("data-region") === regionValue;
          var matchYear = !yearValue || card.getAttribute("data-year") === yearValue;
          var visible = matchKeyword && matchRegion && matchYear;

          card.style.display = visible ? "" : "none";
          if (visible) {
            visibleCount += 1;
          }
        });

        if (emptyState) {
          emptyState.classList.toggle("is-visible", visibleCount === 0);
        }
      }

      if (input) {
        input.addEventListener("input", filter);
      }

      if (regionSelect) {
        regionSelect.addEventListener("change", filter);
      }

      if (yearSelect) {
        yearSelect.addEventListener("change", filter);
      }
    });
  });
})();
