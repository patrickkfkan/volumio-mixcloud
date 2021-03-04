const {
  fragmentDiscoverTagFields, 
  fragmentCloudcastFields,
  fragmentPlaylistFields} = require('./common');

const info = `
  query CloudcastQuery(
    $cloudcastId: ID!
  ) {
    cloudcast(id: $cloudcastId) {
      ...CloudcastFields
    }
  }

  ${fragmentCloudcastFields}
`;

const byTag = `
  query CloudcastsByTagQuery(
    $count: Int!
    $cursor: String
    $discoverTags: [DiscoverTagType]
    $orderBy: DiscoverOrderByEnum
    $country: String
  ) {
    viewer {
      cloudcastsByTag: discover(discoverTags: $discoverTags, country: $country) {
        selectedTags {
          ...DiscoverTagFields
        }
        items: shows(first: $count, after: $cursor, orderBy: $orderBy) {
          edges {
            node {
              ...CloudcastFields
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }
  ${fragmentDiscoverTagFields}
  ${fragmentCloudcastFields}
`;

const featuredByTag = `
  query StaffPicksQuery(
    $discoverTags: [DiscoverTagType]
    $count: Int!
    $cursor: String
    $orderBy: DiscoverOrderByEnum
  ) {
    viewer {
      featuredCloudcastsByTag: discover(discoverTags: $discoverTags) {
        selectedTags {
          ...DiscoverTagFields
        }
        items: staffPicks(first: $count, after: $cursor, orderBy: $orderBy) {
          edges {
            node {
              ...CloudcastFields
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }
  ${fragmentDiscoverTagFields}
  ${fragmentCloudcastFields}
`;

const byPlaylist = `
  query PlaylistItemsQuery(
    $count: Int!
    $cursor: String
    $playlistID: ID!
  ) {
    playlistItems: playlist(id: $playlistID) {
      ...PlaylistItems
    }
  }

  fragment PlaylistItems on Playlist {
    ...PlaylistFields
    owner {
      ...UserFields
    }
    items(first: $count, after: $cursor) {
      totalCount
      edges {
        node {
          cloudcast {
            ...CloudcastFields
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }

  ${fragmentPlaylistFields}
  ${fragmentCloudcastFields}
`;

const byUser = `
  query UserUploadsQuery(
    $count: Int!
    $cursor: String
    $lookup: UserLookup!
    $orderBy: CloudcastOrderByEnum
  ) {
    uploadsByUser: userLookup(lookup: $lookup) {
      ...UserFields
      items: uploads(first: $count, after: $cursor, orderBy: $orderBy) {
        edges {
          node {
            ...CloudcastFields
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }

  ${fragmentCloudcastFields}
`;

const search = `
  query SearchCloudcastsQuery(
    $term: String!
    $cloudcastCount: Int
    $cursor: String
    $createdAfter: CreatedAfterFilter
    $isTimestamped: IsTimestampedFilter
  ) {
    viewer {
      search {
        cloudcastSearchResults: searchQuery(term: $term) {
          items: cloudcasts(first: $cloudcastCount, after: $cursor, createdAfter: $createdAfter, isTimestamped: $isTimestamped) {
            edges {
              node {
                ...CloudcastFields
              }
            }
            pageInfo {
              endCursor
              hasNextPage
            }
          }
        }
      }
    }
  }

  ${fragmentCloudcastFields}
`;

module.exports = {
  info,
  byTag,
  featuredByTag,
  byPlaylist,
  byUser,
  search
};
