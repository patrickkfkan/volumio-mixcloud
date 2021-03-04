const mcfetch = require('../../');
const util = require('util');

/**
 * To obtain information about a playlist, you need the playlist's ID.
 */
const playlistId = 'UGxheWxpc3Q6NjUwMjE4';

/**
 * Then obtain a Playlist object from mixcloud-fetch.
 */
const playlist = mcfetch.playlist(playlistId);

/**
 * Finally, fetch information about the playlist.
 */
playlist.getInfo().then( results => {
    console.log(util.inspect(results, false, null, false));
});