<script>
    const params = new URLSearchParams(window.location.search);
    const streamUrl = decodeURIComponent(params.get('url'));
    const channelName = decodeURIComponent(params.get('name'));
    document.getElementById('channel-name').innerText = channelName;

    const logMessage = (message) => {
        const logContainer = document.getElementById('debug-log');
        const logEntry = document.createElement('p');
        logEntry.innerText = message;
        logContainer.appendChild(logEntry);
    };

    const errorMessage = document.getElementById('error-message');
    let videoElement = document.getElementById('video');

    function initializeVideoJS() {
        logMessage('Attempting playback with Video.js...');
        const player = videojs(videoElement, {
            plugins: {
                httpSourceSelector: {
                    default: 'auto'
                }
            }
        });
        player.src({ src: streamUrl, type: streamUrl.includes(".ts") ? "video/mp2t" : "application/x-mpegURL" });
        player.play();
        player.on('error', () => {
            logMessage('Video.js encountered an error while trying to play the stream.');
            errorMessage.innerText = 'Error: Unable to load the video stream with Video.js.';
        });
    }

    if (streamUrl) {
        initializeVideoJS();
    } else {
        errorMessage.innerText = 'Error: Invalid stream URL.';
    }
</script>
