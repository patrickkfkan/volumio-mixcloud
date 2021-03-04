const {parse} = require('./parser');
const utils = require('../utils');

const GRAPHQL_URL = 'https://www.mixcloud.com/graphql';

function getQuery(resource, queryName) {
    return require(`./queries/${resource}`)[queryName];
}

async function fetch(query, variables = {}) {
    const payload = {
        query,
        variables
    };
    const fetchOptions = {
        method: 'post',
        body: JSON.stringify(payload),
        headers: {'Content-Type': 'application/json'}
    };
    return utils.fetchPage(GRAPHQL_URL, true, fetchOptions).then( json => {
        if (json.errors) {
            const e = json.errors[0];
            const ep = Array.isArray(e.path) ? e.path.join('.') : '';
            throw new Error(ep + ': ' + e.message);
        }
        else {
            return json;
        }
    });
}

module.exports = {
    getQuery,
    fetch,
    parse
}
