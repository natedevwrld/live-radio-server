const express = require('express');
const { Station, PUBLIC_EVENTS, SHUFFLE_METHODS } = require('@fridgefm/radio-core');

const app = express();
const port = 3000;

// Create a new Station instance with optional configuration
const station = new Station({
  verbose: true, // enables verbose logging for debugging purposes
  responseHeaders: {
    'icy-genre': 'jazz'
  }
});

// Add your music folder to the station
station.addFolder('User/Music');

// Define the stream endpoint
app.get('/stream', (req, res) => {
  station.connectListener(req, res);
});

// Start broadcasting
station.start();

// Set up event listeners
station.on(PUBLIC_EVENTS.NEXT_TRACK, async (track) => {
  const result = await track.getMetaAsync();
  console.log('Now playing:', result);
});

station.on(PUBLIC_EVENTS.START, () => {
  console.log('Station started');
});

station.on(PUBLIC_EVENTS.RESTART, () => {
  console.log('Station restarted, shuffling playlist');
  station.reorderPlaylist(SHUFFLE_METHODS.randomShuffle());
});

station.on(PUBLIC_EVENTS.ERROR, (e) => {
  console.error('An error occurred:', e);
});

// Start the Express server
app.listen(port, () => {
  console.log(`Radio streaming server is running at http://localhost:${port}/stream`);
});
