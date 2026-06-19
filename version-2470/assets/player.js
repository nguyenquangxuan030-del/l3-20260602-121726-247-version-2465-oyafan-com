(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    document.querySelectorAll("[data-player]").forEach(function (player) {
      var video = player.querySelector("video");
      var button = player.querySelector("[data-player-start]");
      var stream = video ? video.getAttribute("data-stream") : "";
      var hls = null;
      var attached = false;

      function attach() {
        if (!video || !stream || attached) {
          return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
          attached = true;
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(stream);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (!data || !data.fatal) {
              return;
            }

            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
              hls.startLoad();
            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              hls.recoverMediaError();
            } else {
              hls.destroy();
              if (button) {
                button.querySelector("span:last-child").textContent = "暂时无法播放";
              }
            }
          });
          attached = true;
          return;
        }

        if (button) {
          button.querySelector("span:last-child").textContent = "暂时无法播放";
        }
      }

      function start() {
        if (!video) {
          return;
        }

        attach();
        player.classList.add("is-playing");
        var action = video.play();

        if (action && typeof action.catch === "function") {
          action.catch(function () {
            player.classList.remove("is-playing");
          });
        }
      }

      if (button) {
        button.addEventListener("click", start);
      }

      if (video) {
        video.addEventListener("play", function () {
          player.classList.add("is-playing");
        });
        video.addEventListener("click", function () {
          if (video.paused) {
            start();
          }
        });
      }

      window.addEventListener("pagehide", function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  });
})();
