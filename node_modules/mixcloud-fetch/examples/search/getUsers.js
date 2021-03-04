const mcfetch = require('../../');
const util = require('util');

/**
 * Set keywords to search for.
 */
const keywords = 'dj cool';

/**
 * Then obtain a Search object from mixcloud-fetch.
 */
const search = mcfetch.search(keywords);

/**
 * When calling getUsers(), you can specify optional params:
 * - limit: number of items to fetch (default: 20)
 * - pageToken: the nextPageToken obtained in the results of 
 *   a previous call to getUsers()
 * - dateJoined: 'pastWeek', 'pastMonth', 'pastYear' or 
 *   'anyTime'. Default: 'anyTime'
 * - userType: 'uploader', 'listener' or 'any'. Default: 'any'
  */
const params = {
    dateJoined: 'pastYear',
    userType: 'any' // Same as default
    // We have not specified 'limit', which defaults to 20.
}

search.getUsers(params).then( results => {
    console.log(util.inspect(results, false, null, false));

    // Now get the next 20 users using nextPageToken.
    // NOTE: you must check if nextPageToken is null. If
    // it is null, then you have reached the end of the list.
    if (results.nextPageToken) {
        params.pageToken = results.nextPageToken;
        search.getUsers(params).then( results => {
            console.log('\r\nNext set of results:');
            console.log(util.inspect(results, false, null, false));
        });
    }
    else {
        console.log('\r\nWe have reached the end of the list!');
    }
});