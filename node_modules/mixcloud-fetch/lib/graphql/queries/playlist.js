const {fragmentPlaylistFields, fragmentUserFields} = require('./common');

const info = `
  query PlaylistQuery(
    $playlistID: ID!
  ) {
    playlist(id: $playlistID) {
      ...PlaylistFields
      owner {
        ...UserFields
      }
      items(first: 0) {
        totalCount
      }
    }
  }

  ${fragmentPlaylistFields}
  ${fragmentUserFields}
`;

const byUser = `
  query PlaylistsByUserQuery(
    $lookup: UserLookup!
  ) {
    playlistsByUser: userLookup(lookup: $lookup) {
      url
      ...Playlists
    }
  }

  fragment Playlists on User {
    profileNavigation {
      menuItems {
        ... on PlaylistNavigationItem {
          count
          playlist {
            ...PlaylistFields
          }
        }
      }
    }
  }

  ${fragmentPlaylistFields}
`;

module.exports = {
  info,
  byUser
};