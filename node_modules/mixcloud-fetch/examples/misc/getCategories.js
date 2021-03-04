const mcfetch = require('../../');
const util = require('util');

/**
 * The getCategories() function returns the categories shown 
 * on Mixcloud. It provides a starting point for users to discover
 * Mixcloud Shows by utilizing the slugs provided in the returned data.
 */
mcfetch.misc.getCategories().then( results => {
    console.log(util.inspect(results, false, null, false));
});