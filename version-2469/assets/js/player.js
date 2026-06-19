import { H as Hls } from './hls-vendor-dru42stk.js';

export function mountPlayer(playbackUrl) {
  const video = document.querySelector('[data-video-player]');
  const trigger = document.querySelector('[data-play-trigger]');

  if (!video || !trigger || !playbackUrl) {
    return;
  }

  let started = false;
  let hls = null;

  function attachSource() {
    if (started) {
      return;
    }

    started = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = playbackUrl;
    } else if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(playbackUrl);
      hls.attachMedia(video);
    } else {
      video.src = playbackUrl;
    }
  }

  function playVideo() {
    attachSource();
    trigger.classList.add('hidden');
    const attempt = video.play();

    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(() => {
        trigger.classList.remove('hidden');
      });
    }
  }

  trigger.addEventListener('click', playVideo);

  video.addEventListener('play', () => {
    trigger.classList.add('hidden');
  });

  video.addEventListener('pause', () => {
    if (!video.ended) {
      trigger.classList.remove('hidden');
    }
  });

  video.addEventListener('ended', () => {
    trigger.classList.remove('hidden');
  });

  window.addEventListener('pagehide', () => {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
}
