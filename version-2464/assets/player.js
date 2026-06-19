function initMoviePlayer(mediaUrl) {
    var frame = document.querySelector("[data-player]");
    if (!frame) {
        return;
    }

    var video = frame.querySelector("video");
    var cover = frame.querySelector(".player-cover");
    var loaded = false;
    var hlsInstance = null;

    function attachMedia() {
        if (loaded || !video || !mediaUrl) {
            return;
        }

        loaded = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = mediaUrl;
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(mediaUrl);
            hlsInstance.attachMedia(video);
            return;
        }

        video.src = mediaUrl;
    }

    function playVideo() {
        attachMedia();
        frame.classList.add("is-playing");
        video.controls = true;
        var result = video.play();
        if (result && typeof result.catch === "function") {
            result.catch(function () {});
        }
    }

    if (cover) {
        cover.addEventListener("click", playVideo);
    }

    if (video) {
        video.addEventListener("click", function () {
            if (video.paused) {
                playVideo();
            }
        });
        video.addEventListener("ended", function () {
            frame.classList.remove("is-playing");
        });
    }

    window.addEventListener("beforeunload", function () {
        if (hlsInstance && typeof hlsInstance.destroy === "function") {
            hlsInstance.destroy();
        }
    });
}
