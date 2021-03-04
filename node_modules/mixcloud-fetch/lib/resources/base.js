const {QUERY_MAX_LIMIT} = require('../constants');
const utils = require('../utils');

const DEFAULT_LIMIT = 20;

class BaseResource {
   
    constructor(key) {
        this._key = key;
    }

    getKey() {
        return this._key;
    }

    getDefaultLimit() {
        return DEFAULT_LIMIT;
    }

    validateLimit(value) {
        if (value > QUERY_MAX_LIMIT) {
            console.warn(`Overriding specified limit ${value} to max value ${QUERY_MAX_LIMIT}`);
            return QUERY_MAX_LIMIT;
        }
        else {
            return value;
        }
    }

    validateFromArray(value, valids, defaultValue, paramName) {
        if (valids.includes(value)) {
            return value;
        }
        else {
            console.warn(`Specified value for param '${paramName}' ('${value}') is invalid. Using default value '${defaultValue}'`);
            return defaultValue;
        }
    }

    paramsToQuery(params, schema) {
        const result = {};
        for(const [paramKey, paramValue] of Object.entries(params)) {
            const queryKey = utils.getProp(schema.names, paramKey, paramKey);
            const queryValue = schema.values ? utils.getProp(schema.values, `${paramKey}.${paramValue}`, paramValue) : paramValue;
            result[queryKey] = queryValue;
        }
        return result;
    }
}

module.exports = BaseResource;