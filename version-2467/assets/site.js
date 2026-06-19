function ready(callback) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", callback);
    } else {
        callback();
    }
}

ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobilePanel = document.querySelector("[data-mobile-panel]");

    if (menuButton && mobilePanel) {
        menuButton.addEventListener("click", function () {
            mobilePanel.classList.toggle("open");
        });
    }

    var slides = Array.from(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.from(document.querySelectorAll("[data-hero-dot]"));

    if (slides.length > 0) {
        var index = 0;

        function showSlide(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("active", i === index);
            });
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                showSlide(i);
            });
        });

        showSlide(0);

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(index + 1);
            }, 5200);
        }
    }

    var searchPage = document.querySelector("[data-search-page]");
    if (searchPage) {
        var queryInput = searchPage.querySelector("[data-search-input]");
        var cards = Array.from(searchPage.querySelectorAll(".movie-card"));
        var empty = searchPage.querySelector("[data-empty-search]");
        var params = new URLSearchParams(window.location.search);
        var initial = params.get("q") || "";

        if (queryInput) {
            queryInput.value = initial;
        }

        function normalize(value) {
            return String(value || "").toLowerCase().trim();
        }

        function applySearch() {
            var query = normalize(queryInput ? queryInput.value : initial);
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute("data-title"),
                    card.getAttribute("data-genre"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-tags")
                ].join(" "));
                var matched = !query || haystack.indexOf(query) !== -1;
                card.style.display = matched ? "" : "none";
                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle("show", visible === 0);
            }
        }

        if (queryInput) {
            queryInput.addEventListener("input", applySearch);
        }

        applySearch();
    }
});

function initMoviePlayer(video, overlay, sourceUrl) {
    if (!video || !sourceUrl) {
        return;
    }

    var started = false;
    var hlsInstance = null;

    function startPlayback() {
        if (started) {
            video.play();
            return;
        }

        started = true;

        if (overlay) {
            overlay.classList.add("hide");
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = sourceUrl;
            video.play();
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(sourceUrl);
            hlsInstance.attachMedia(video);
            hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                video.play();
            });
            return;
        }

        video.src = sourceUrl;
        video.play();
    }

    if (overlay) {
        overlay.addEventListener("click", startPlayback);
    }

    video.addEventListener("click", function () {
        if (video.paused) {
            startPlayback();
        }
    });

    window.addEventListener("beforeunload", function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}
