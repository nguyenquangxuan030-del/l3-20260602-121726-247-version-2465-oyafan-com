(function () {
  var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

  players.forEach(function (shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('[data-play]');
    var stream = shell.getAttribute('data-stream');
    var ready = false;
    var hls = null;

    function prepare() {
      if (ready || !video || !stream) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }

      ready = true;
    }

    function start() {
      prepare();

      if (button) {
        button.classList.add('is-hidden');
      }

      if (video) {
        var playPromise = video.play();

        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {
            if (button) {
              button.classList.remove('is-hidden');
            }
          });
        }
      }
    }

    if (button) {
      button.addEventListener('click', start);
    }

    if (video) {
      video.addEventListener('play', function () {
        if (button) {
          button.classList.add('is-hidden');
        }
      });

      video.addEventListener('click', function () {
        if (!ready) {
          start();
        }
      });
    }

    window.addEventListener('pagehide', function () {
      if (hls && typeof hls.destroy === 'function') {
        hls.destroy();
      }
    });
  });
})();
