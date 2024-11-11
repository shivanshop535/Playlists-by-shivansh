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

// Example channel data
const channels = [
    { name: "Nobita Aur Dinosaur Yoddha", url: "https://dcoolf2l-b0e5bd96bf18.herokuapp.com/dl/671b2f5349786ef3e4a92b68", img: "path/to/image1.jpg" },
    { name: "Nobita Bana Superhero", url: "https://dcoolf2l-b0e5bd96bf18.herokuapp.com/dl/671b2f9e49786ef3e4a92b6a", img: "path/to/image2.jpg" },
    // Add more channels here
];

const channelList = document.getElementById('channel-list');

channels.forEach(channel => {
    const channelItem = document.createElement('div');
    channelItem.className = 'channel-item';
    channelItem.innerHTML = `
        <img src="${channel.img}" alt="${channel.name}">
        <h3>${channel.name}</h3>
        <button onclick="playChannel('${channel.url}', '${channel.name}')">Play</button>
    `;
    channelList.appendChild(channelItem);
});

function playChannel(url, name) {
