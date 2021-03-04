const mcfetch = require('../../');
const util = require('util');

/**
 * Set keywords to search for.
 */
const keywords = 'ambient lounge';

/**
 * Then obtain a Search object from mixcloud-fetch.
 */
const search = mcfetch.search(keywords);

/**
 * When calling getTags(), you can specify optional params:
 * - limit: number of items to fetch (default: 20)
 * - pageToken: the nextPageToken obtained in the results of 
 *   a previous call to getTags()
 */
const params = {
    limit: 10   // Fetch 10 tags instead of the default 20
}

search.getTags(params).then( results => {
    console.log(util.inspect(results, false, null, false));

    // Now get the next 10 tags using nextPageToken.
    // NOTE: you must check if nextPageToken is null. If
    // it is null, then you have reached the end of the list.
    if (results.nextPageToken) {
        params.pageToken = results.nextPageToken;
        search.getTags(params).then( results => {
            console.log('\r\nNext set of results:');
            console.log(util.inspect(results, false, null, false));
        });
    }
    else {
        console.log('\r\nWe have reached the end of the list!');
    }
});