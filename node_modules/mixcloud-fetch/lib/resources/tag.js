const graphql = require('../graphql');
const utils = require('../utils');
const {COUNTRY_GLOBAL} = require('../constants');
const misc = require('./misc');
const BaseResource = require('./base');

const PARAMS_TO_QUERY_SCHEMA = {
    SHOW: {
        names: {
            discoverTags: 'discoverTags',
            limit: 'count',
            pageToken: 'cursor',
            orderBy: 'orderBy',
            country: 'country'
        },
        values: {
            orderBy: {
                'trending': null,
                'popular': 'POPULAR',
                'latest': 'LATEST',
            }
        }
    },
    FEATURED: {
        names: {
            discoverTags: 'discoverTags',
            limit: 'count',
            pageToken: 'cursor',
            orderBy: 'orderBy',
        },
        values: {
            orderBy: {
                'popular': 'POPULAR',
                'latest': 'LATEST',
            }
        }
    }    
};

function _slugsToDiscoverTags(slugs) {
    if (Array.isArray(slugs)) {
        return slugs.map( slug => {
            return {
                slug,
                type: 'TAG'
            };
        });
    }
    else if (typeof slugs === 'string' && slugs.trim().length > 0) {
        return [ { slug: slugs, type: 'TAG' } ];
    }
    else {
        return [];
    }
}

class Tag extends BaseResource {

    async getInfo() {
        const slugs = this.getKey();
        const variables = {
            discoverTags: _slugsToDiscoverTags(slugs)
        };
        const query = graphql.getQuery('tag', 'info');
        return graphql.fetch(query, variables).then( result => 
            graphql.parse(result)
        );
    }

    async getShows(params = {}) {
        const slugs = this.getKey();
        const defaultParams = {
            discoverTags: _slugsToDiscoverTags(slugs),
            limit: this.getDefaultLimit(),
            orderBy: 'trending',
            country: null
        };
        const fullParams = utils.assignProps(params, defaultParams, [
            'limit', 'pageToken', 'orderBy', 'country'
        ]);

        // Validation
        fullParams.limit = this.validateLimit(fullParams.limit);
        fullParams.orderBy = this.validateFromArray(fullParams.orderBy, [
            'trending', 'popular', 'latest'], 'trending', 'orderBy');

        // 'country' can only be specified when orderBy is 'trending'
        // For other orderBy values, country will always be 'global'.
        if (fullParams.orderBy === 'trending') {
            const countries = await misc.getCountries();
            if (fullParams.country === null) {
                fullParams.country = utils.getProp(countries, 'default.code') || COUNTRY_GLOBAL;
            }
            else {
                // Check if given country exists
                const countryCodes = (countries.available || []).map( c => c.code);
                fullParams.country = this.validateFromArray(fullParams.country, 
                    countryCodes, COUNTRY_GLOBAL, 'country');
            }
        }
        else if (fullParams.country !== null) {
            fullParams.country = this.validateFromArray(fullParams.country, 
                [COUNTRY_GLOBAL], COUNTRY_GLOBAL, 'country');
        }
        else {
            fullParams.country = COUNTRY_GLOBAL;
        }
            
        // Query variables
        const variables = this.paramsToQuery(fullParams, PARAMS_TO_QUERY_SCHEMA.SHOW);

        // Query
        const query = graphql.getQuery('cloudcast', 'byTag');
        return graphql.fetch(query, variables).then( result => 
            graphql.parse(result)
        ).then( parsedResult => {
            parsedResult.params = fullParams;
            delete parsedResult.params.discoverTags;
            return parsedResult;
        });
    }
    
    async getFeatured(params = {}) {
        const slugs = this.getKey();
        const defaultParams = {
            discoverTags: _slugsToDiscoverTags(slugs),
            limit: this.getDefaultLimit(),
            orderBy: 'latest'
        };
        const fullParams = utils.assignProps(params, defaultParams, [
            'limit', 'pageToken', 'orderBy'
        ]);

        // Validation
        fullParams.limit = this.validateLimit(fullParams.limit);
        fullParams.orderBy = this.validateFromArray(fullParams.orderBy, [
            'popular', 'latest'], 'latest', 'orderBy');
           
        // Query variables
        const variables = this.paramsToQuery(fullParams, PARAMS_TO_QUERY_SCHEMA.FEATURED);

        // Query
        const query = graphql.getQuery('cloudcast', 'featuredByTag');
        return graphql.fetch(query, variables).then( result => 
            graphql.parse(result)
        ).then( parsedResult => {
            parsedResult.params = fullParams;
            delete parsedResult.params.discoverTags;
            return parsedResult;
        });
    }
}

function from(slugs) {
    return new Tag(slugs);
}

module.exports = from;