fetch('M3UPlus-Playlist-20241019222427.m3u')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.text();
    })
    .then(data => {
        const channels = parseM3U(data);
        console.log('Parsed Channels:', channels);
        displayChannels(channels);
    })
    .catch(error => console.error('Error fetching M3U file:', error));

function parseM3U(data) {
    const lines = data.split('\n');
    const channels = [];
    let currentChannel = {};
    
    lines.forEach(line => {
        line = line.trim();
        if (line.startsWith('#EXTINF:')) {
            if (currentChannel.name) {
                channels.push(currentChannel);
                currentChannel = {};
            }
            const nameMatch = line.match(/,(.+)$/);
            const logoMatch = line.match(/tvg-logo="([^"]+)"/);
            if (nameMatch) {
                currentChannel.name = nameMatch[1].trim();
            }
            if (logoMatch) {
                currentChannel.logo = logoMatch[1];
            }
        } else if (line && !line.startsWith('#')) {
            currentChannel.url = line.trim();
        }
    });

    if (currentChannel.name) {
        channels.push(currentChannel);
    }

    return channels;
}

function displayChannels(channels) {
    const container = document.getElementById('channel-list');
    container.innerHTML = '';

    if (channels.length === 0) {
        container.innerHTML = '<p>No channels found</p>';
    } else {
        channels.forEach(channel => {
            const channelDiv = document.createElement('div');
            channelDiv.classList.add('channel');
            channelDiv.innerHTML = `
                <img src="${channel.logo || 'path/to/default_logo.png'}" alt="${channel.name}" class="channel-logo" onclick="playStream('${encodeURIComponent(channel.url)}', '${encodeURIComponent(channel.name)}')">
                <p>${channel.name}</p>
            `;
            container.appendChild(channelDiv);
        });
    }
}

function playStream(url, name) {
    window.location.href = `proxy.html?url=${url}&name=${name}`;
}
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
    const player = videojs(videoElement);
    player.src({ src: streamUrl, type: streamUrl.includes(".ts") ? "video/mp2t" : "application/x-mpegURL" });
    player.play();
    player.on('error', () => {
        logMessage('Video.js encountered an error while trying to play the stream.');
        errorMessage.innerText = 'Error: Unable to load the video stream with Video.js.';
    });

    player.qualityLevels();
    player.httpSourceSelector({
        default: 'auto'
    });
}

if (streamUrl) {
    initializeVideoJS();
} else {
    errorMessage.innerText = 'Error: Invalid stream URL.';
}
