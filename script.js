// Fetch the local M3U playlist
fetch('M3UPlus-Playlist-20241019222427.m3u')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.text();
    })
    .then(data => {
        const channels = parseM3U(data);
        console.log('Parsed Channels:', channels); // Debugging: Logs parsed channels
        displayChannels(channels);
    })
    .catch(error => console.error('Error fetching M3U file:', error));

// Function to parse the M3U file
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
            const logoMatch = line.match(/tvg-logo="([^"]+)"/); // Extracts logo from M3U
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

    // Push last channel if exists
    if (currentChannel.name) {
        channels.push(currentChannel);
    }

    return channels;
}

// Display channels in the HTML
function displayChannels(channels) {
    const container = document.getElementById('channel-list');
    container.innerHTML = ''; // Clear any existing content

    if (channels.length === 0) {
        container.innerHTML = '<p>No channels found</p>';
        console.warn('No channels were parsed from the M3U file.');
    } const params = new URLSearchParams(window.location.search);
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

// Search functionality
const searchBar = document.getElementById('search-bar');
const channelList = document.getElementById('channel-list');

const channels = [
    { name: 'Nobita Aur Dinosaur Yoddha', url: 'https://dcoolf2l-b0e5bd96bf18.herokuapp.com/dl/671b2f5349786ef3e4a92b68' },
    { name: 'Nobita Bana Superhero', url: 'https://dcoolf2l-b0e5bd96bf18.herokuapp.com/dl/671b2f9e49786ef3e4a92b6a' },
    // Add more channels here
];

function displayChannels(channels) {
    channelList.innerHTML = '';
    channels.forEach(channel => {
        const channelItem = document.createElement('div');
        channelItem.className = 'channel-item';
        channelItem.innerText = channel.name;
        channelItem.onclick = () => {
            window.location.href = `?url=${encodeURIComponent(channel.url)}&name=${encodeURIComponent(channel.name)}`;
        };
        channelList.appendChild(channelItem);
    });
}

searchBar.addEventListener('input', () => {
    const searchTerm = searchBar.value.toLowerCase();
    const filteredChannels = channels.filter(channel => channel.name.toLowerCase().includes(searchTerm));
    displayChannels(filteredChannels);
});

// Initial display
displayChannels(channels);
