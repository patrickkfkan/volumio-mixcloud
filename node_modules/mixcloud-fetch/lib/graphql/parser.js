const base64Min = require("base64-min");
const utils = require('../utils');

// https://github.com/ytdl-org/youtube-dl/blob/master/youtube_dl/extractor/mixcloud.py
const _DECRYPTION_KEY = 'IFYOUWANTTHEARTISTSTOGETPAIDDONOTDOWNLOADFROMMIXCLOUD';

// Based on API fetch results
const _GENERAL_IMAGE_URLS = {
    medium: 'https://thumbnailer.mixcloud.com/unsafe/100x100/',
    '768wx768h': 'https://thumbnailer.mixcloud.com/unsafe/768x768/',
    '320wx320h': 'https://thumbnailer.mixcloud.com/unsafe/320x320/',
    extra_large: 'https://thumbnailer.mixcloud.com/unsafe/600x600/',
    large: 'https://thumbnailer.mixcloud.com/unsafe/300x300/',
    '640wx640h': 'https://thumbnailer.mixcloud.com/unsafe/640x640/',
    medium_mobile: 'https://thumbnailer.mixcloud.com/unsafe/80x80/',
    small: 'https://thumbnailer.mixcloud.com/unsafe/25x25/',
    '1024wx1024h': 'https://thumbnailer.mixcloud.com/unsafe/1024x1024/',
    thumbnail: 'https://thumbnailer.mixcloud.com/unsafe/50x50/' };

const _COVER_IMAGE_URL = 'https://thumbnailer.mixcloud.com/unsafe/1460x370/';

function parse(graph) {
    const cloudcastsByTag = utils.getProp(graph, 'data.viewer.cloudcastsByTag');
    if (cloudcastsByTag) {
        return parseCloudcastsByTag(cloudcastsByTag);
    }

    const featuredCloudcastsByTag = utils.getProp(graph, 'data.viewer.featuredCloudcastsByTag');
    if (featuredCloudcastsByTag) {
        return parseCloudcastsByTag(featuredCloudcastsByTag);
    }

    const cloudcastSearchResults = utils.getProp(graph, 'data.viewer.search.cloudcastSearchResults.items');
    if (cloudcastSearchResults) {
        return parseList(cloudcastSearchResults);
    }

    const user = utils.getProp(graph, 'data.user');
    if (user) {
        return parseUser(user);
    }

    const userSearchResults = utils.getProp(graph, 'data.viewer.search.userSearchResults.items');
    if (userSearchResults) {
        return parseList(userSearchResults);
    }

    const playlistsByUser = utils.getProp(graph, 'data.playlistsByUser');
    if (playlistsByUser) {
        return parsePlaylistsByUser(playlistsByUser);
    }

    const playlist = utils.getProp(graph, 'data.playlist');
    if (playlist) {
        return parsePlaylist(playlist);
    }

    const playlistItems = utils.getProp(graph, 'data.playlistItems');
    if (playlistItems) {
        return parsePlaylistItems(playlistItems);
    }

    const cloudcast = utils.getProp(graph, 'data.cloudcast');
    if (cloudcast) {
        return parseCloudcast(cloudcast);
    }

    const uploadsByUser = utils.getProp(graph, 'data.uploadsByUser');
    if (uploadsByUser) {
        return parseUploadsByUser(uploadsByUser);
    }

    const categories = utils.getProp(graph, 'data.viewer.categories');
    if (categories) {
        return parseCategories(categories);
    }

    const countries = utils.getProp(graph, 'data.viewer.countries');
    if (countries) {
        return parseCountries(countries);
    }

    const tags = utils.getProp(graph, 'data.viewer.tags.selectedTags');
    if (tags) {
        return parseDiscoverTags(tags);
    }

    const tagSearchResults = utils.getProp(graph, 'data.viewer.search.tagSearchResults.items');
    if (tagSearchResults) {
        return parseList(tagSearchResults);
    }
}

function parseCloudcastsByTag(graph) {
    const result = {
        selectedTags: parseDiscoverTags(graph.selectedTags)
    };
    const list = graph.items ? parseList(graph.items) : {};

    return Object.assign(result, list);
}

function parseDiscoverTags(tags) {
    if (Array.isArray(tags)) {
        return tags.filter(
            t => t.__typename === 'DiscoverTagTag' ).map(
                t => {
                    return parseTag(t);
                });
    }
    else {
        return [];
    }
}

function parseTag(tag) {
    return {
        type: 'tag',
        name: tag.name,
        slug: tag.slug
    };
}

function parseList(graph) {
    const list = {
        items: [],
    }

    const items = graph.edges;
    if (Array.isArray(items)) {
        items.map( item => item.node )
            .filter( item => item)
            .forEach( item => {
                if (item.__typename === 'Cloudcast') {
                    list.items.push(parseCloudcast(item));
                }
                else if (item.cloudcast && item.cloudcast.__typename === 'Cloudcast') {
                    list.items.push(parseCloudcast(item.cloudcast));
                }
                else if (item.__typename === 'User') {
                    list.items.push(parseUser(item));
                }
                else if (item.__typename === 'Tag') {
                    list.items.push(parseTag(item));
                }
            });
    }

    const pageInfo = graph.pageInfo;
    if (pageInfo) {
        list.nextPageToken = pageInfo.hasNextPage ? pageInfo.endCursor : null;
    }

    return list;
}

function parseCloudcast(graph) {
    const shell = {
        type: 'cloudcast',
        id: null,
        name: null,
        slug: null,
        url: null,
        description: null,
        publishDate: null,
        isExclusive: false,
        isPlayable: true,
        duration: 0,
        tags: [],
        owner: null,
        images: {},
        streams: {}
    }
    const cloudcast = utils.assignProps(graph, shell, [
        'id', 'slug', 'name', 'url', 'description', 'publishDate',
        'isExclusive', 'isPlayable', 'duration']);

    if (Array.isArray(graph.tags)) {
        graph.tags.map( t => t.tag ).forEach( tag => {
            if (tag.__typename === 'Tag') {
                cloudcast.tags.push(utils.assignProps(tag, { type: 'tag' }, ['name', 'slug']));
            }
        });
    }
    if (graph.owner && graph.owner.__typename === 'User') {
        cloudcast.owner = parseUser(graph.owner);
    }
    if (graph.picture && graph.picture.__typename === 'Picture') {
        cloudcast.images = parsePicture(graph.picture);
    }
    if (graph.streams && graph.streams.__typename === 'StreamInfo') {
        cloudcast.streams = parseStreams(graph.streams);
    }

    return cloudcast;
}

function parseUser(graph) {
    const shell = {
        type: 'user',
        id: null,
        username: null,
        name: null,
        city: null,
        country: null,
        about: null,
        url: null,
        images: {},
        coverImage: null,
        counts: {}
    };
    const user = utils.assignProps(graph, shell, [
        'id', 'username', 'name', 'city', 'country', 'about', 'url']);

    const counts = utils.assignProps(graph, {}, [
        { streamCount: 'streams' },
        { favoriteCount: 'favorites' },
        { historyCount: 'history' },
        { uploadCount: 'uploads' },
        { postCount: 'posts' },
        { followerCount: 'followers' }]);
    if (Object.keys(counts).length > 0) {
        const parsedCounts = {};
        for (const [key, value] of Object.entries(counts)) {
            const v = typeof value === 'object' && value.totalCount != undefined ? value.totalCount : value;
            parsedCounts[key] = v;
        }
        user.counts = Object.assign({
            streams: 0,
            favorites: 0,
            history: 0,
            uploads: 0,
            posts: 0,
            followers: 0
        }, parsedCounts);
    }
    else {
        delete user.counts;
    }

    if (user.counts) {
        const profileNavItems = utils.getProp(graph, 'profileNavigation.menuItems');
        if (Array.isArray(profileNavItems)) {
            user.counts.playlists = profileNavItems.filter( nav => nav.playlist ).length;
        }
    }

    if (graph.picture && graph.picture.__typename === 'Picture') {
        user.images = parsePicture(graph.picture);
    }
    if (graph.coverPicture && graph.coverPicture.__typename === 'Picture') {
        user.coverImage = parseCoverPicture(graph.coverPicture);
    }
    else {
        delete user.coverImage;
    }

    return user;
}

function parsePlaylistsByUser(graph) {
    const playlists = [];
    const userUrl = graph.url;
    const profileNavItems = utils.getProp(graph, 'profileNavigation.menuItems');
    if (Array.isArray(profileNavItems)) {
        profileNavItems.filter( nav => nav.playlist ).forEach( info => {
            const shell = {
                type: 'playlist',
                id: null,
                name: null,
                slug: null,
                url: null,
                description: null
            };
            const playlist = Object.assign(shell, 
                info.playlist, { itemCount: info.count });
            playlist.url = constructPlaylistUrl(userUrl, playlist.slug);
            playlists.push(playlist);
        });
    }
    return {
        items: playlists
    };
}

function parsePlaylist(graph) {
    const shell = {
        type: 'playlist',
        id: null,
        name: null,
        slug: null,
        url: null,
        description: null
    };
    const playlist = utils.assignProps(graph, shell, [
        'id', 'name', 'slug', 'description'
    ]);
    if (graph.owner && graph.owner.__typename === 'User') {
        playlist.owner = parseUser(graph.owner);
        playlist.url = constructPlaylistUrl(playlist.owner.url, playlist.slug);
    };
    playlist.itemCount = utils.getProp(graph, 'items.totalCount', 0);

    return playlist;
}

function constructPlaylistUrl(userUrl, playlistSlug) {
    if (userUrl && playlistSlug) {
        return `${userUrl}playlists/${playlistSlug}/`;
    }
    else {
        return null;
    }
}

function parsePlaylistItems(graph) {
    return graph.items ? parseList(graph.items) : {};
}

function parseUploadsByUser(graph) {
    return graph.items ? parseList(graph.items) : {};
}

function parsePicture(graph) {
    // Mixcloud constructs the full image URL in client-side JS. It would be more efficient
    // to just prepend known URLs to urlRoot here...
    const images = {};
    if (graph.urlRoot) {
        for (const [size, url] of Object.entries(_GENERAL_IMAGE_URLS)) {
            images[size] = url + graph.urlRoot;
        }
    }
    return images;
}

function parseCoverPicture(graph) {
    if (graph.urlRoot) {
        return _COVER_IMAGE_URL + graph.urlRoot;
    }
    else {
        return null;
    }
}

function parseStreams(graph) {
    const streams = {};
    ['dash', 'hls', 'http'].forEach( key => {
        let formatUrl = graph[key];
        if (formatUrl) {
            streams[key] = base64Min.decodeWithKey(formatUrl, _DECRYPTION_KEY);
        }
    });

    return streams;
}

function parseCategories(categories) {
    const result = {};
    for (const [k, v] of Object.entries(categories)) {
        result[k] = [];
        if (Array.isArray(v)) {
            v.forEach( category => {
                result[k].push(utils.assignProps(category, {}, [
                    'name', 'slug'
                ]));
            });
        }
    }

    return result;
}

function parseCountries(countries) {
    const result = {};
    if (countries.currentCountry) {
        result.default = parseCountry(countries.currentCountry);
    }
    else {
        result.default = null;
    }
    if (Array.isArray(countries.availableCountries)) {
        result.available = countries.availableCountries.map( 
            c => parseCountry(c) );
    }
    else {
        result.available = [];
    }

    return result;
}

function parseCountry(country) {
    return utils.assignProps(country, {}, ['code', 'name']);
}

module.exports = {
    parse
};