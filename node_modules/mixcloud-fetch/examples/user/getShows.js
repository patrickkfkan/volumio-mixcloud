const mcfetch = require('../../');
const util = require('util');

/**
 * To get shows uploaded by a user, you need the user's username.
 */
const username = 'nicolemoudaber';

/**
 * Then obtain a User object from mixcloud-fetch.
 */
const user = mcfetch.user(username);

/**
 * When calling getShows(), you can specify optional params:
 * - limit: number of items to fetch (default: 20)
 * - pageToken: the nextPageToken obtained in the results of 
 *   a previous call to getShows()
 * - orderBy: 'trending', 'popular', 'latest' or 'oldest'. Default: 'latest'
 */

const params = {
    limit: 30,   // Fetch 30 shows instead of the default 20
    orderBy: 'trending',
}

user.getShows(params).then( results => {
    console.log(util.inspect(results, false, null, false));

    // Now get the next 30 shows using nextPageToken.
    // NOTE: you must check if nextPageToken is null. If
    // it is null, then you have reached the end of the list.
    if (results.nextPageToken) {
        params.pageToken = results.nextPageToken;
        user.getShows(params).then( results => {
            console.log('\r\nNext set of results:');
            console.log(util.inspect(results, false, null, false));
        });
    }
    else {
        console.log('\r\nWe have reached the end of the list!');
    }
});