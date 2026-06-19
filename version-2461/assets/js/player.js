(function () {
  var frame = document.querySelector('.player-frame');
  if (!frame) {
    return;
  }

  var video = frame.querySelector('video');
  var overlay = frame.querySelector('.player-overlay');
  var hls = null;
  var ready = false;

  function attachStream() {
    if (!video || ready) {
      return;
    }

    var streamUrl = video.getAttribute('data-hls');
    if (!streamUrl) {
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    }

    ready = true;
  }

  function beginPlay() {
    attachStream();
    if (overlay) {
      overlay.classList.add('is-hidden');
    }

    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        if (overlay) {
          overlay.classList.remove('is-hidden');
        }
      });
    }
  }

  if (overlay) {
    overlay.addEventListener('click', beginPlay);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        beginPlay();
      } else {
        video.pause();
      }
    });

    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    });

    video.addEventListener('pause', function () {
      if (overlay && video.currentTime < 1) {
        overlay.classList.remove('is-hidden');
      }
    });
  }

  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
})();
