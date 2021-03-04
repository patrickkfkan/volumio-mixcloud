const {fragmentUserFields} = require('./common');

const info = `
  query UserProfileHeaderQuery(
    $lookup: UserLookup!
  ) {
    user: userLookup(lookup: $lookup) {
      ...UserFields
      ...UserItemCounts
    }
  }

  ${fragmentUserFields}
  
  fragment UserItemCounts on User {
    streamCount: stream {
      totalCount
    }
    favoriteCount: favorites {
      totalCount
    }
    historyCount: listeningHistory {
      totalCount
    }
    uploadCount: uploads {
      totalCount
    }
    postCount: posts {
      totalCount
    }
    followerCount: followers {
      totalCount
    }
    profileNavigation {
      menuItems {
        ... on PlaylistNavigationItem {
          playlist {
            id
          }
        }
      }
    }
  }
`;

const search = `
  query SearchUsersQuery(
    $term: String!
    $userCount: Int
    $cursor: String
    $dateJoinedAfter: DateJoinedAfterFilter
    $isUploader: IsUploaderFilter
  ) {
    viewer {
      search {
        userSearchResults: searchQuery(term: $term) {
          items: users(first: $userCount, after: $cursor, dateJoinedAfter: $dateJoinedAfter, isUploader: $isUploader) {
            edges {
              node {
                ...UserFields
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

  ${fragmentUserFields}
`;

module.exports = {
  info,
  search
};