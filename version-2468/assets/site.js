(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var menuButtons = document.querySelectorAll("[data-menu-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");
    menuButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        if (mobileNav) {
          mobileNav.classList.toggle("is-open");
        }
      });
    });

    var searchButtons = document.querySelectorAll("[data-search-toggle]");
    var searchPanel = document.querySelector("[data-search-panel]");
    searchButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        if (searchPanel) {
          searchPanel.classList.toggle("is-open");
          var input = searchPanel.querySelector("[data-search-input]");
          if (searchPanel.classList.contains("is-open") && input) {
            input.focus();
          }
        }
      });
    });

    initSearch();
    initHero();
    initLocalFilters();
    initPlayers();
  });

  function initSearch() {
    var forms = document.querySelectorAll("[data-search-form]");
    var output = document.querySelector("[data-search-output]");
    var movies = window.siteMovies || [];
    forms.forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = form.querySelector("[data-search-input]");
        var keyword = input ? input.value.trim().toLowerCase() : "";
        if (!keyword) {
          if (output) {
            output.classList.remove("is-open");
            output.innerHTML = "";
          }
          return;
        }
        var results = movies.filter(function (movie) {
          var text = [movie.title, movie.region, movie.type, movie.year, movie.genre, (movie.tags || []).join(" "), movie.oneLine].join(" ").toLowerCase();
          return text.indexOf(keyword) !== -1;
        }).slice(0, 24);
        renderSearchResults(results, output);
      });
    });
  }

  function renderSearchResults(results, output) {
    if (!output) {
      return;
    }
    output.innerHTML = "";
    output.classList.add("is-open");
    if (!results.length) {
      var empty = document.createElement("p");
      empty.textContent = "没有找到匹配影片";
      empty.style.color = "#a8a29e";
      output.appendChild(empty);
      return;
    }
    var grid = document.createElement("div");
    grid.className = "search-results-grid";
    results.forEach(function (movie) {
      var card = document.createElement("a");
      card.className = "search-card";
      card.href = movie.url;
      var img = document.createElement("img");
      img.src = movie.cover;
      img.alt = movie.title;
      img.loading = "lazy";
      var info = document.createElement("div");
      var title = document.createElement("strong");
      title.textContent = movie.title;
      var meta = document.createElement("span");
      meta.textContent = [movie.year, movie.region, movie.type].filter(Boolean).join(" · ");
      info.appendChild(title);
      info.appendChild(meta);
      card.appendChild(img);
      card.appendChild(info);
      grid.appendChild(card);
    });
    output.appendChild(grid);
  }

  function initHero() {
    var root = document.querySelector("[data-hero]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
    var prev = root.querySelector("[data-hero-prev]");
    var next = root.querySelector("[data-hero-next]");
    if (slides.length <= 1) {
      return;
    }
    var index = 0;
    var timer;
    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }
    function restart() {
      clearInterval(timer);
      timer = setInterval(function () {
        show(index + 1);
      }, 5200);
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        restart();
      });
    });
    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        restart();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        restart();
      });
    }
    restart();
  }

  function initLocalFilters() {
    var zones = document.querySelectorAll("[data-filter-zone]");
    zones.forEach(function (zone) {
      var keyword = zone.querySelector("[data-local-keyword]");
      var type = zone.querySelector("[data-local-type]");
      var year = zone.querySelector("[data-local-year]");
      var reset = zone.querySelector("[data-filter-reset]");
      var cards = Array.prototype.slice.call(zone.querySelectorAll("[data-card]"));
      var empty = zone.querySelector("[data-empty]");
      function apply() {
        var key = keyword ? keyword.value.trim().toLowerCase() : "";
        var typeValue = type ? type.value : "";
        var yearValue = year ? year.value : "";
        var visible = 0;
        cards.forEach(function (card) {
          var text = (card.getAttribute("data-search") || "").toLowerCase();
          var cardType = card.getAttribute("data-type") || "";
          var cardYear = card.getAttribute("data-year") || "";
          var passKey = !key || text.indexOf(key) !== -1;
          var passType = !typeValue || cardType.indexOf(typeValue) !== -1;
          var passYear = !yearValue || cardYear === yearValue || (yearValue === "older" && Number(cardYear) < 2022);
          var pass = passKey && passType && passYear;
          card.style.display = pass ? "" : "none";
          if (pass) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle("is-visible", visible === 0);
        }
      }
      [keyword, type, year].forEach(function (control) {
        if (control) {
          control.addEventListener("input", apply);
          control.addEventListener("change", apply);
        }
      });
      if (reset) {
        reset.addEventListener("click", function () {
          if (keyword) {
            keyword.value = "";
          }
          if (type) {
            type.value = "";
          }
          if (year) {
            year.value = "";
          }
          apply();
        });
      }
    });
  }

  function initPlayers() {
    var players = document.querySelectorAll("[data-player]");
    players.forEach(function (shell) {
      var video = shell.querySelector("video");
      var overlay = shell.querySelector("[data-play]");
      var streamUrl = shell.getAttribute("data-video");
      var initialized = false;
      var hlsInstance = null;
      function start() {
        if (!video || !streamUrl) {
          return;
        }
        if (overlay) {
          overlay.classList.add("is-hidden");
        }
        video.controls = true;
        if (initialized) {
          video.play().catch(function () {});
          return;
        }
        initialized = true;
        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(streamUrl);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = streamUrl;
          video.addEventListener("loadedmetadata", function () {
            video.play().catch(function () {});
          }, { once: true });
          video.load();
        } else {
          video.src = streamUrl;
          video.play().catch(function () {});
        }
      }
      if (overlay) {
        overlay.addEventListener("click", start);
      }
      if (video) {
        video.addEventListener("click", function () {
          if (!initialized || video.paused) {
            start();
          }
        });
      }
      window.addEventListener("pagehide", function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    });
  }
})();
