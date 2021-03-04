const mcfetch = require('../../');
const util = require('util');

/**
 * To get playlists owned by a user, you need the user's username.
 */
const username = 'Jazzmo';

/**
 * Then obtain a User object from mixcloud-fetch.
 */
const user = mcfetch.user(username);

/**
 * Finally, get the playlists.
 */
user.getPlaylists().then( results => {
    console.log(util.inspect(results, false, null, false));
});