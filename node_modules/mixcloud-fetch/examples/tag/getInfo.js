const mcfetch = require('../../');
const util = require('util');

/**
 * To get information about a tag, you need the tag's slug.
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
 * Finally, fetch information about the tags.
 */
tag.getInfo().then( results => {
    console.log(util.inspect(results, false, null, false));
});