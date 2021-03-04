const graphql = require('../graphql');
const utils = require('../utils');
const BaseResource = require('./base');

const PARAMS_TO_QUERY_SCHEMA = {
    SHOW: {
        names: {
            playlistID: 'playlistID',
            limit: 'count',
            pageToken: 'cursor'
        }
    }
};

class Playlist extends BaseResource {

    async getInfo() {
        const playlistID = this.getKey();
        const variables = { playlistID };
        const query = graphql.getQuery('playlist', 'info');
        return graphql.fetch(query, variables).then( result => 
            graphql.parse(result)
        );        
    }

    async getShows(params = {}) {
        const playlistID = this.getKey();
        const defaultParams = {
            playlistID,
            limit: this.getDefaultLimit()
        };
        const fullParams = utils.assignProps(params, defaultParams, [
            'limit', 'pageToken'
        ]);

        // Validation
        fullParams.limit = this.validateLimit(fullParams.limit);

        // Query variables
        const variables = this.paramsToQuery(fullParams, PARAMS_TO_QUERY_SCHEMA.SHOW);

        // Query
        const query = graphql.getQuery('cloudcast', 'byPlaylist');
        return graphql.fetch(query, variables).then( result => 
            graphql.parse(result)
        ).then( parsedResult => {
            parsedResult.params = fullParams;
            delete parsedResult.params.playlistID;
            return parsedResult;
        });
    }
}

function from(playlistId) {
    return new Playlist(playlistId);
}

module.exports = from;