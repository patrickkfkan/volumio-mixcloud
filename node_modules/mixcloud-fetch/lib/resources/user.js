const graphql = require('../graphql');
const utils = require('../utils');
const BaseResource = require('./base');

const PARAMS_TO_QUERY_SCHEMA = {
    SHOW: {
        names: {
            username: 'lookup',
            limit: 'count',
            pageToken: 'cursor',
            orderBy: 'orderBy',
        },
        values: {
            orderBy: {
                'trending': 'HOT',
                'popular': 'POPULAR',
                'latest': 'LATEST',
                'oldest': 'OLDEST'
            }
        }
    }
}

class User extends BaseResource {

    async getInfo() {
        const username = this.getKey();
        const variables = {
            lookup: { username }
        };
        const query = graphql.getQuery('user', 'info');
        return graphql.fetch(query, variables).then( result => 
            graphql.parse(result)
        );
    }

    async getPlaylists() {
        const username = this.getKey();
        const variables = {
            lookup: { username }
        };
        const query = graphql.getQuery('playlist', 'byUser');
        return graphql.fetch(query, variables).then( result => 
            graphql.parse(result)
        );
    }

    async getShows(params = {}) {
        const username = this.getKey();
        const defaultParams = {
            username: { username },
            limit: this.getDefaultLimit(),
            orderBy: 'latest'
        };
        const fullParams = utils.assignProps(params, defaultParams, [
            'limit', 'pageToken', 'orderBy'
        ]);

        // Validation
        fullParams.limit = this.validateLimit(fullParams.limit);
        fullParams.orderBy = this.validateFromArray(fullParams.orderBy, [
            'trending', 'popular', 'latest', 'oldest'], 'latest', 'orderBy');

        // Query variables
        const variables = this.paramsToQuery(fullParams, PARAMS_TO_QUERY_SCHEMA.SHOW);

        // Query
        const query = graphql.getQuery('cloudcast', 'byUser');
        return graphql.fetch(query, variables).then( result => 
            graphql.parse(result)
        ).then( parsedResult => {
            parsedResult.params = fullParams;
            delete parsedResult.params.username;
            return parsedResult;
        });
    }

    // TODO: 
    // getComments
    // getFollowers
    // getFavorites
    // getFollowing
    // getHistory ( cloudcasts listened to )
    // getFeed
}

function from(username) {
    return new User(username);
}

module.exports = from;