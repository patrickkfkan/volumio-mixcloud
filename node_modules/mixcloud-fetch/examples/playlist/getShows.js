const mcfetch = require('../../');
const util = require('util');

/**
 * To get shows (Cloudcasts) in a playlist, you need the
 * playlist's ID.
 */
const playlistId = 'UGxheWxpc3Q6MTM5NDM2MA==';

/**
 * Then obtain a Playlist object from mixcloud-fetch.
 */
const playlist = mcfetch.playlist(playlistId);

/**
 * When calling getShows(), you can specify optional params:
 * - limit: number of items to fetch (default: 20)
 * - pageToken: the nextPageToken obtained in the results of 
 *   a previous call to getShows().
 */
const params = {
    limit: 50   // Fetch 50 shows instead of the default 20
}

/**
 * Fetch shows in the playlist
 */
playlist.getShows(params).then( results => {
    console.log(util.inspect(results, false, null, false));

    // Now get the next 50 shows using nextPageToken.
    // NOTE: you must check if nextPageToken is null. If
    // it is null, then you have reached the end of the list.
    if (results.nextPageToken) {
        params.pageToken = results.nextPageToken;
        playlist.getShows(params).then( results => {
            console.log('\r\nNext set of results:');
            console.log(util.inspect(results, false, null, false));
        });
    }
    else {
        console.log('\r\nWe have reached the end of the list!');
    }
});