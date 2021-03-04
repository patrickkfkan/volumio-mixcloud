const { fragmentDiscoverTagFields, fragmentTagFields } = require('./common');

const info = `
  query TagsQuery(
    $discoverTags: [DiscoverTagType]
  ) {
    viewer {
      tags: discover(discoverTags: $discoverTags) {
        selectedTags {
          ...DiscoverTagFields
        }
      }
    }
  }
  ${fragmentDiscoverTagFields}
`;

const search = `
  query SearchTagsQuery(
    $tagCount: Int
    $cursor: String
    $term: String!
  ) {
    viewer {
      search {
        tagSearchResults: searchQuery(term: $term) {
          items: tags(first: $tagCount, after: $cursor) {
            edges {
              node {
                ...TagFields
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
  ${fragmentTagFields}
`;

module.exports = {
  info,
  search
};