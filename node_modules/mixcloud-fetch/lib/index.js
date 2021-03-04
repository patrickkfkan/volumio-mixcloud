const tag = require('./resources/tag');
const user = require('./resources/user');
const playlist = require('./resources/playlist');
const cloudcast = require('./resources/cloudcast');
const search = require('./resources/search');
const misc= require('./resources/misc');
const cache = require('./cache');
const limiter = require('./limiter');
const constants = require('./constants');

// Expose functions in rate limiter
const _limiter = {
    setEnabled: limiter.setEnabled,
    isEnabled: limiter.isEnabled,
    setOptions: limiter.setOptions,
};

// Expose functions in cache
const _cache = {
    setTTL: ttl => cache.setTTL('page', ttl),
    setMaxEntries: maxEntries => cache.setMaxEntries('page', maxEntries),
    clear: () => cache.clear('page')
};

module.exports = {
    tag,
    user,
    playlist,
    cloudcast,
    search,
    misc,
    cache: _cache,
    limiter: _limiter,
    const: constants
}