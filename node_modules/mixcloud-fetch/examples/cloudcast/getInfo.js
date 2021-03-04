const mcfetch = require('../../');
const util = require('util');

/**
 * To obtain information about a cloudcast, 
 * you need the cloudcast's ID.
 */
const cloudcastId = 'Q2xvdWRjYXN0OjE1MDg0MzQzNA==';

/**
 * Then obtain a Cloudcast object from mixcloud-fetch.
 */
const cloudcast = mcfetch.cloudcast(cloudcastId);

/**
 * Finally, fetch information about the Cloudcast.
 */
cloudcast.getInfo().then( results => {
    console.log(util.inspect(results, false, null, false));
});