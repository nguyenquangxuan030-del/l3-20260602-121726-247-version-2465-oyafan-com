import { H as Hls } from './hls-vendor-dru42stk.js';

function attachPlayer(shell) {
  var video = shell.querySelector('video');
  var cover = shell.querySelector('[data-player-cover]');
  var source = shell.getAttribute('data-m3u8');
  var started = false;
  var hls = null;

  function setStatus(message) {
    var card = shell.closest('.player-card');
    var status = card ? card.querySelector('[data-player-status]') : null;
    if (status) {
      status.textContent = message;
    }
  }

  function start() {
    if (!video || !source || started) {
      return;
    }

    started = true;

    if (cover) {
      cover.classList.add('is-hidden');
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.play().catch(function () {
        setStatus('请点击播放器上的播放按钮继续。');
      });
      return;
    }

    if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hls.loadSource(source);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch(function () {
          setStatus('请点击播放器上的播放按钮继续。');
        });
      });

      hls.on(Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          setStatus('播放源暂时无法连接，请稍后重试或切换网络。');
          if (hls) {
            hls.destroy();
            hls = null;
          }
        }
      });
    } else {
      setStatus('当前浏览器不支持 HLS 播放，请使用新版 Chrome、Edge、Safari 或移动端浏览器。');
    }
  }

  if (cover) {
    cover.addEventListener('click', start);
  }

  video.addEventListener('play', function () {
    if (cover) {
      cover.classList.add('is-hidden');
    }
  });
}

document.querySelectorAll('[data-player]').forEach(attachPlayer);
