const fragmentDiscoverTagFields = `
  fragment DiscoverTagFields on DiscoverTagInterface {
    slug
    name
    __typename
  }
`;

const fragmentTagFields = `
  fragment TagFields on Tag {
    slug
    name
    __typename
  }
`;

const fragmentUserFields = `
  fragment UserFields on User {
    username
    name: displayName
    city
    country,
    about: biog
    url
    id,
    picture {
      urlRoot
      __typename
    }
    coverPicture {
      urlRoot
      __typename
    }
    __typename
  }
`;

const fragmentPlaylistFields = `
  fragment PlaylistFields on Playlist {
    id
    name
    slug
    description
  }
`;

const fragmentCloudcastFields = `
  fragment CloudcastFields on Cloudcast {
    id
    slug
    name
    url
    description
    publishDate
    isExclusive
    isPlayable
    duration: audioLength
    tags(country: "GLOBAL") {
      tag {
        name
        slug
        __typename
      }
    }
    owner {
      ...UserFields
    }
    picture {
      urlRoot
      __typename
    }
    streams: streamInfo {
      hls: hlsUrl
      dash: dashUrl
      http: url
      __typename
    }
    __typename
  }

  ${fragmentUserFields}
`;

module.exports = {
    fragmentDiscoverTagFields,
    fragmentTagFields,
    fragmentUserFields,
    fragmentPlaylistFields,
    fragmentCloudcastFields
};