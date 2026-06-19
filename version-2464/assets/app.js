(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
            return;
        }
        fn();
    }

    ready(function () {
        var toggle = document.querySelector("[data-menu-toggle]");
        var mobileNav = document.querySelector("[data-mobile-nav]");

        if (toggle && mobileNav) {
            toggle.addEventListener("click", function () {
                mobileNav.classList.toggle("open");
                document.body.classList.toggle("menu-open", mobileNav.classList.contains("open"));
            });
        }

        var hero = document.querySelector("[data-hero]");
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
            var current = 0;
            var timer = null;

            function showSlide(index) {
                if (!slides.length) {
                    return;
                }
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("active", slideIndex === current);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("active", dotIndex === current);
                });
            }

            function restart() {
                if (timer) {
                    clearInterval(timer);
                }
                timer = setInterval(function () {
                    showSlide(current + 1);
                }, 5200);
            }

            dots.forEach(function (dot) {
                dot.addEventListener("click", function () {
                    showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
                    restart();
                });
            });

            showSlide(0);
            restart();
        }

        document.querySelectorAll("[data-filter-panel]").forEach(function (panel) {
            var scope = panel.parentElement;
            var grid = scope ? scope.querySelector("[data-filter-grid]") : null;
            if (!grid) {
                return;
            }

            var keywordInput = panel.querySelector("[data-filter-keyword]");
            var yearSelect = panel.querySelector("[data-filter-year]");
            var genreSelect = panel.querySelector("[data-filter-genre]");
            var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-movie-card], .rank-item"));

            function readText(card) {
                return [
                    card.getAttribute("data-title") || "",
                    card.getAttribute("data-tags") || "",
                    card.getAttribute("data-genre") || "",
                    card.getAttribute("data-category") || "",
                    card.textContent || ""
                ].join(" ").toLowerCase();
            }

            function applyFilter() {
                var keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : "";
                var year = yearSelect ? yearSelect.value : "";
                var genre = genreSelect ? genreSelect.value : "";

                cards.forEach(function (card) {
                    var text = readText(card);
                    var yearMatch = !year || (card.getAttribute("data-year") || "") === year || text.indexOf(year.toLowerCase()) > -1;
                    var genreMatch = !genre || (card.getAttribute("data-genre") || "").indexOf(genre) > -1 || text.indexOf(genre.toLowerCase()) > -1;
                    var keywordMatch = !keyword || text.indexOf(keyword) > -1;
                    card.hidden = !(yearMatch && genreMatch && keywordMatch);
                });
            }

            [keywordInput, yearSelect, genreSelect].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", applyFilter);
                    control.addEventListener("change", applyFilter);
                }
            });
        });
    });
})();
