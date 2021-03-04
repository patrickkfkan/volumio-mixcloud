const mcfetch = require('../../');
const util = require('util');

/**
 * To get shows by tag, you need to provide the tag's slug.
 * You can also specify multiple tags by putting the slugs
 * in an array.
 */
const slugs = ['ambient', 'funk']; // multiple tags
// const slug = 'ambient'; <-- Single tag

/**
 * Then obtain a Tag object from mixcloud-fetch.
 */
const tag = mcfetch.tag(slugs);

/**
 * When calling getShows(), you can specify optional params:
 * - limit: number of items to fetch (default: 20)
 * - pageToken: the nextPageToken obtained in the results of 
 *   a previous call to getShows()
 * - orderBy: 'trending', 'popular' or 'latest'. Default: 'trending'
 * - country: the country code that can be obtained from 
 *   mcfetch.misc.getCountries(). ONLY effective when orderBy is 
 *   'trending'. For other orderBy values, country will 
 *   always default to 'GLOBAL'.
 */
const params = {
    limit: 30,   // Fetch 30 shows instead of the default 20
    orderBy: 'popular'
}

tag.getShows(params).then( results => {
    console.log(util.inspect(results, false, null, false));

    // Now get the next 30 shows using nextPageToken.
    // NOTE: you must check if nextPageToken is null. If
    // it is null, then you have reached the end of the list.
    if (results.nextPageToken) {
        params.pageToken = results.nextPageToken;
        tag.getShows(params).then( results => {
            console.log('\r\nNext set of results:');
            console.log(util.inspect(results, false, null, false));
        });
    }
    else {
        console.log('\r\nWe have reached the end of the list!');
    }
});
