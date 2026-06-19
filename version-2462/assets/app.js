(function() {
  function qs(selector, parent) {
    return (parent || document).querySelector(selector);
  }

  function qsa(selector, parent) {
    return Array.prototype.slice.call((parent || document).querySelectorAll(selector));
  }

  var menu = qs("[data-menu-toggle]");
  var panel = qs("[data-mobile-panel]");
  if (menu && panel) {
    menu.addEventListener("click", function() {
      panel.classList.toggle("open");
    });
  }

  qsa("[data-site-search]").forEach(function(form) {
    form.addEventListener("submit", function(event) {
      event.preventDefault();
      var input = qs("input", form);
      var value = input ? input.value.trim() : "";
      var root = form.getAttribute("data-root") || "";
      var href = root + "search.html";
      if (value) {
        href += "?q=" + encodeURIComponent(value);
      }
      window.location.href = href;
    });
  });

  var slides = qsa("[data-hero-slide]");
  var dots = qsa("[data-hero-dot]");
  if (slides.length > 1) {
    var active = 0;
    function show(index) {
      active = index % slides.length;
      if (active < 0) {
        active = slides.length - 1;
      }
      slides.forEach(function(slide, i) {
        slide.classList.toggle("active", i === active);
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle("active", i === active);
      });
    }
    dots.forEach(function(dot, i) {
      dot.addEventListener("click", function() {
        show(i);
      });
    });
    setInterval(function() {
      show(active + 1);
    }, 5200);
  }

  var filterRoot = qs("[data-filter-root]");
  if (filterRoot) {
    var input = qs("[data-filter-input]");
    var type = qs("[data-filter-type]");
    var year = qs("[data-filter-year]");
    var sort = qs("[data-filter-sort]");
    var cards = qsa("[data-card]", filterRoot);
    var grid = qs("[data-card-grid]", filterRoot);

    function applyFilter() {
      var term = input ? input.value.trim().toLowerCase() : "";
      var typeValue = type ? type.value : "";
      var yearValue = year ? year.value : "";

      cards.forEach(function(card) {
        var text = [
          card.getAttribute("data-title") || "",
          card.getAttribute("data-region") || "",
          card.getAttribute("data-genre") || "",
          card.getAttribute("data-tags") || "",
          card.getAttribute("data-year") || ""
        ].join(" ").toLowerCase();
        var okTerm = !term || text.indexOf(term) !== -1;
        var okType = !typeValue || (card.getAttribute("data-type") || "") === typeValue;
        var okYear = !yearValue || (card.getAttribute("data-year") || "") === yearValue;
        card.classList.toggle("hide", !(okTerm && okType && okYear));
      });
    }

    function applySort() {
      if (!grid || !sort) {
        return;
      }
      var value = sort.value;
      var sorted = cards.slice().sort(function(a, b) {
        if (value === "title") {
          return (a.getAttribute("data-title") || "").localeCompare(b.getAttribute("data-title") || "", "zh-Hans-CN");
        }
        var ay = parseInt(a.getAttribute("data-year") || "0", 10);
        var by = parseInt(b.getAttribute("data-year") || "0", 10);
        if (value === "year-asc") {
          return ay - by;
        }
        return by - ay;
      });
      sorted.forEach(function(card) {
        grid.appendChild(card);
      });
    }

    [input, type, year].forEach(function(el) {
      if (el) {
        el.addEventListener("input", applyFilter);
        el.addEventListener("change", applyFilter);
      }
    });

    if (sort) {
      sort.addEventListener("change", function() {
        applySort();
        applyFilter();
      });
    }

    var params = new URLSearchParams(window.location.search);
    var q = params.get("q");
    if (q && input) {
      input.value = q;
      applyFilter();
    }
  }
})();

function initMoviePlayer(src, videoId, overlayId) {
  var video = document.getElementById(videoId);
  var overlay = document.getElementById(overlayId);
  if (!video || !overlay || !src) {
    return;
  }

  var ready = false;
  var hlsInstance = null;

  function attach() {
    if (ready) {
      return;
    }
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new Hls();
      hlsInstance.loadSource(src);
      hlsInstance.attachMedia(video);
    } else {
      video.src = src;
    }
    ready = true;
  }

  function start() {
    attach();
    overlay.classList.add("is-hidden");
    var played = video.play();
    if (played && typeof played.catch === "function") {
      played.catch(function() {});
    }
  }

  overlay.addEventListener("click", start);
  video.addEventListener("click", function() {
    if (!ready || video.paused) {
      start();
    }
  });
  video.addEventListener("play", function() {
    overlay.classList.add("is-hidden");
  });
  video.addEventListener("ended", function() {
    overlay.classList.remove("is-hidden");
  });
}
