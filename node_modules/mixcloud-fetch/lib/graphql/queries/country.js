const list = `
  query CategoryListQuery {
    viewer {
      countries: localisation {
        currentCountry {
          code
          name
        }
        availableCountries {
          code
          name
        }
      }
    }
  }
`;

module.exports = {
  list
};