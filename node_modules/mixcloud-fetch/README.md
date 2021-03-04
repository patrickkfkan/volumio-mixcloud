# mixcloud-fetch

A JS library for fetching Mixcloud resources.

Note: this library does not support user logins, so you won't be able to fetch exclusive content or access account-specific features.

# Installation

```
npm i mixcloud-fetch --save
```

# Usage

```
const mcfetch = require('mixcloud-fetch');

mcfetch.tag(['ambient', 'lounge']).getShows().then( shows => {
    ...
});

mcfetch.search('jazz funk').getTags().then( tags => {
    ...
});
```

### Tag functions

A tag is used to discover shows and is identified by its **slug**. To access tag-related functions, you need to obtain a `Tag` object with the slug.

```
const slug = 'jazz';
const tag = mcfetch.tag(slug);

// Fetch shows matching the 'jazz' tag
tag.getShows().then( shows => {
    ...
});
```

You can encapsulate multiple tags in a `Tag` object by putting their slugs into an array:

```
const slugs = [
    'jazz',
    'funk'
];
const tag = mcfetch.tag(slugs);

// Fetch shows matching both the 'jazz' and 'funk' tags
tag.getShows().then( shows => {
    ...
});
```

The following functions are provided by a `Tag` object. Each of these functions returns a Promise that resolves to the data requested.

| Function              | Resolves To                                 |                                                                                         |
|-----------------------|-----------------------------------------------|-------------------------------------------------------------------------------------------|
| getInfo()             | Information about the represented tag(s)      |[Example](examples/tag/getInfo.js) ([output](examples/tag/getInfo_output.txt))             |
| getShows([params])*   | Cloudcasts matching the represented tag(s)    |[Example](examples/tag/getShows.js) ([output](examples/tag/getShows_output.txt))           |
| getFeatured([params])*| Featured cloudcasts matching the represented tag(s)|[Example](examples/tag/getFeatured.js) ([output](examples/tag/getFeatured_output.txt))|

*`params` specify what to return in the results. Check the example for what params you can specify.

### User functions

A user is identified by his or her **username**. To access user-related functions, you need to obtain a `User` object with the username.

```
const username = 'jazzcat';
const user = mcfetch.user(username);

// Fetch shows uploaded by the user
user.getShows().then( shows => {
    ...
});
```

The following functions are provided by a `User` object. Each of these functions returns a Promise that resolves to the data requested.

| Function              | Resolves To                                 |                                                                                           |
|-----------------------|-----------------------------------------------|-------------------------------------------------------------------------------------------|
| getInfo()             | Information about the user                    |[Example](examples/user/getInfo.js) ([output](examples/user/getInfo_output.txt))           |
| getShows([params])*   | Cloudcasts uploaded by the user               |[Example](examples/user/getShows.js) ([output](examples/user/getShows_output.txt))         |
| getPlaylists()        | Playlists owned by the user                   |[Example](examples/user/getPlaylists.js) ([output](examples/user/getPlaylists_output.txt)) |

*`params` specify what to return in the results. Check the example for what params you can specify.

### Playlist functions

A playlist is identified by its ID. To access playlist-related functions, you need to obtain a `Playlist` object with the playlist's ID.

```
const playlistId = 'UGxheWxpc3Q6MTM5NDM2MA==';
const playlist = mcfetch.playlist(playlistId);

// Fetch shows in the playlist
playlist.getShows().then( shows => {
    ...
});
```

The following functions are provided by a `Playlist` object. Each of these functions returns a Promise that resolves to the data requested.

| Function              | Resolves To                                 |                                                                                           |
|-----------------------|-----------------------------------------------|-------------------------------------------------------------------------------------------|
| getInfo()             | Information about the playlist                |[Example](examples/playlist/getInfo.js) ([output](examples/playlist/getInfo_output.txt))   |
| getShows([params])*   | Cloudcasts in the playlist                    |[Example](examples/playlist/getShows.js) ([output](examples/playlist/getShows_output.txt)) |

*`params` specify what to return in the results. Check the example for what params you can specify.

### Cloudcast functions

A cloudcast is identified by its ID. To access cloudcast-related functions, you need to obtain a `Cloudcast` object with the cloudcast's ID.

```
const cloudcastId = 'Q2xvdWRjYXN0OjE1MDg0MzQzNA==';
const cloudcast = mcfetch.cloudcast(cloudcastId);

// Fetch info about the cloudcast
cloudcast.getInfo().then( info => {
    ...
});
```

There is only one function provided by a `Cloudcast` object:

| Function              | Resolves To                                 |                                                                                           |
|-----------------------|-----------------------------------------------|-------------------------------------------------------------------------------------------|
| getInfo()             | Information about the cloudcast               |[Example](examples/cloudcast/getInfo.js) ([output](examples/cloudcast/getInfo_output.txt)) |

### Search functions

The library supports searching Tags, Shows and Users. To access the search functions, you need to obtain a `Search` object with the keywords to search for.

```
const keywords = 'ambient lounge';
const search = mcfetch.search(keywords);

// Fetch shows matching 'ambient lounge':
search.getShows().then( shows => {
    ...
});
```

The following functions are provided by a `Search` object. Each of these functions returns a Promise that resolves to the data requested.

| Function              | Resolves To                                 |                                                                                           |
|-----------------------|-----------------------------------------------|-------------------------------------------------------------------------------------------|
| getTags([params])     | Tags matching the given keywords              |[Example](examples/search/getTags.js) ([output](examples/search/getTags_output.txt))       |
| getShows([params])    | Cloudcasts matching the given keywords        |[Example](examples/search/getShows.js) ([output](examples/search/getShows_output.txt))     |
| getUsers([params])    | Users matching the given keywords             |[Example](examples/search/getUsers.js) ([output](examples/search/getUsers_output.txt))     |

`params` specify what to return in the results. Check the example for what params you can specify.

### Miscellaneous functions

```
// Get Mixcloud categories
mcfetch.misc.getCategories().then( categories => {
    ...
});

// Get the list of available countries as well as the default
mcfetch.misc.getCountries().then( countries => {
    ...
});
```

| Function              | Resolves To                                 |                                                                                           |
|-----------------------|-----------------------------------------------|-------------------------------------------------------------------------------------------|
| getCategories()       | Mixcloud categories                           |[Example](examples/misc/getCategories.js) ([output](examples/misc/getCategories_output.txt)) |
| getCountries()        | Available countries and the default           |[Example](examples/misc/getCountries.js) ([output](examples/misc/getCountries_output.txt)) |

# Rate Limiting

Fetch requests are rate limited by default. Rate limiting is useful when you need to make a large number of queries and don't want to run the risk of getting rejected by the server for making too many requests within a short time interval.

The library uses [Bottleneck](https://www.npmjs.com/package/bottleneck) for rate limiting. You can configure the rate limiter like this:

```
mcfetch.limiter.setOptions({
    maxConcurrent: 10,  // default: 5
    minTime: 100        // default: 200
});
```
`setOptions()` is just a passthrough function to Bottleneck's `updateSettings()`. Check the [Bottleneck doc](https://www.npmjs.com/package/bottleneck#docs) for the list of options you can set.

To check if the rate limiter is enabled:

```
mcfetch.limiter.isEnabled()
```

To disable the rate limiter:

```
mcfetch.limiter.setEnabled(false);
```

# Caching

The library maintains an in-memory cache for storing results of fetch requests. You can access the cache functions as follows:

```
// Set the expiry time of cache entries (seconds)
mcfetch.cache.setTTL(500); // Default: 300

// Set the maximum number of entries that can be stored in the cache
// Specify a negative value (e.g -1) for unlimited entries.
mcfetch.cache.setMaxEntries(20); // Default: 10

// Clears the cache
mcfetch.cache.clear();
```

# License

MIT