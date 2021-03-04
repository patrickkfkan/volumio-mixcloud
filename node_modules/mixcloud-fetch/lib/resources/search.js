const graphql = require('../graphql');
const utils = require('../utils');
const BaseResource = require('./base');

const PARAMS_TO_QUERY_SCHEMA = {
    TAG: {
        names: {
            keywords: 'term',
            limit: 'tagCount',
            pageToken: 'cursor'
        }
    },
    SHOW: {
        names: {
            keywords: 'term',
            limit: 'cloudcastCount',
            pageToken: 'cursor',
            dateUploaded: 'createdAfter',
            requireTimestamp: 'isTimestamped'
        },
        values: {
            dateUploaded: {
                'pastWeek': 'PAST_WEEK',
                'pastMonth': 'PAST_MONTH',
                'pastYear': 'PAST_YEAR',
                'anyTime': null
            },
            requireTimestamp: {
                'true': 'YES',
                'false': null
            }
        }
    },
    USER: {
        names: {
            keywords: 'term',
            limit: 'userCount',
            pageToken: 'cursor',
            dateJoined: 'dateJoinedAfter',
            userType: 'isUploader'
        },
        values: {
            dateJoined: {
                'pastWeek': 'PAST_WEEK',
                'pastMonth': 'PAST_MONTH',
                'pastYear': 'PAST_YEAR',
                'anyTime': null,
            },
            userType: {
                'uploader': 'YES',
                'listener': 'NO',
                'any': null
            }
        }
    }    
};

class Search extends BaseResource {

    async getTags(params = {}) {
        const keywords = this.getKey();
        const defaultParams = {
            keywords,
            limit: this.getDefaultLimit()
        };
        const fullParams = utils.assignProps(params, defaultParams, [
            'limit', 'pageToken'
        ]);

        // Validation
        fullParams.limit = this.validateLimit(fullParams.limit);

        // Query variables
        const variables = this.paramsToQuery(fullParams, PARAMS_TO_QUERY_SCHEMA.TAG);

        // Query
        const query = graphql.getQuery('tag', 'search');
        return graphql.fetch(query, variables).then( result => 
            graphql.parse(result)
        ).then( parsedResult => {
            parsedResult.params = fullParams;
            delete parsedResult.params.keywords;
            return parsedResult;
        });
    }

    async getShows(params = {}) {
        const keywords = this.getKey();
        const defaultParams = {
            keywords,
            limit: this.getDefaultLimit(),
            dateUploaded: 'anyTime',
            requireTimestamp: false
        };
        const fullParams = utils.assignProps(params, defaultParams, [
            'limit', 'pageToken', 'dateUploaded', 'requireTimestamp'
        ]);

        // Validation
        fullParams.limit = this.validateLimit(fullParams.limit);
        fullParams.dateUploaded = this.validateFromArray(fullParams.dateUploaded, [
            'pastWeek', 'pastMonth', 'pastYear', 'anyTime'], 'anyTime', 'dateUploaded');
        fullParams.requireTimestamp = fullParams.requireTimestamp ? true: false;

        // Query variables
        const variables = this.paramsToQuery(fullParams, PARAMS_TO_QUERY_SCHEMA.SHOW);

        // Query
        const query = graphql.getQuery('cloudcast', 'search');
        return graphql.fetch(query, variables).then( result => 
            graphql.parse(result)
        ).then( parsedResult => {
            parsedResult.params = fullParams;
            delete parsedResult.params.keywords;
            return parsedResult;
        });
    }

    async getUsers(params = {}) {
        const keywords = this.getKey();
        const defaultParams = {
            keywords,
            limit: this.getDefaultLimit(),
            dateJoined: 'anyTime',
            userType: 'any'
        };
        const fullParams = utils.assignProps(params, defaultParams, [
            'limit', 'pageToken', 'dateJoined', 'userType'
        ]);

        // Validation
        fullParams.limit = this.validateLimit(fullParams.limit);
        fullParams.dateJoined = this.validateFromArray(fullParams.dateJoined, [
            'pastWeek', 'pastMonth', 'pastYear', 'anyTime'], 'anyTime', 'dateJoined');
        fullParams.userType = this.validateFromArray(fullParams.userType, [
            'uploader', 'listener', 'any'], 'any', 'userType');

        // Query variables
        const variables = this.paramsToQuery(fullParams, PARAMS_TO_QUERY_SCHEMA.USER);

        // Query
        const query = graphql.getQuery('user', 'search');
        return graphql.fetch(query, variables).then( result => 
            graphql.parse(result)
        ).then( parsedResult => {
            parsedResult.params = fullParams;
            delete parsedResult.params.keywords;
            return parsedResult;
        });
    }

}

function from(keywords) {
    return new Search(keywords);
}

module.exports = from;