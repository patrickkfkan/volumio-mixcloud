const graphql = require('../graphql');

async function getCountries() {
    const query = graphql.getQuery('country', 'list');
    return graphql.fetch(query).then( result => 
         graphql.parse(result)
    );
}

async function getCategories() {
    const query = graphql.getQuery('category', 'list');
    return graphql.fetch(query).then( result => 
         graphql.parse(result)
    );
}

module.exports = {
    getCountries,
    getCategories
};