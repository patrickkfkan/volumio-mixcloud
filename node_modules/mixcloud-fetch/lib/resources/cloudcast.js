const graphql = require('../graphql');
const BaseResource = require('./base');

class Cloudcast extends BaseResource {

    async getInfo() {
        const cloudcastId = this.getKey();
        const variables = { cloudcastId };
        const query = graphql.getQuery('cloudcast', 'info');
        return graphql.fetch(query, variables).then( result => 
            graphql.parse(result)
        );
    }

    // TODO:
    // getListeners
    // getSimilar
    // getComments
    // getFavorites (list of users who favorited this)

}

function from(cloudcastId) {
    return new Cloudcast(cloudcastId);
}

module.exports = from;