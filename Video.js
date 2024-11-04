<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MY KIDS (By Shivansh)</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://vjs.zencdn.net/7.11.4/video-js.css" rel="stylesheet" />
</head>
<body>
    <div class="container">
        <h1>MY KIDS CHANNEL</h1>
        <input type="text" id="search-bar" placeholder="Search for a video...">
        <div id="channel-list"></div>
        <video id="video-player" class="video-js vjs-default-skin" controls preload="auto" width="640" height="264">
            <source src="" type="application/x-mpegURL">
        </video>
    </div>
    <script src="https://vjs.zencdn.net/7.11.4/video.min.js"></script>
    <script src="script.js"></script>
</body>
</html>
