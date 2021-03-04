const list = `
  query CategoryListQuery {
    viewer {
      categories {
        music {
          name
          slug
        }
        talk {
          name
          slug
        }
      }
    }
  }
`;

module.exports = {
    list
};