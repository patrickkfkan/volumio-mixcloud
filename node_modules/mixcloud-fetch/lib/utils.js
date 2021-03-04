const fetch = require('node-fetch');
const limiter = require('./limiter');
const cache = require('./cache');

async function fetchPage(url, json = false, fetchOptions = null) {
    return cache.getOrSet('page', url + (json ? ':json' : ':html') + (fetchOptions ? ':' + JSON.stringify(fetchOptions) : ''), () => {
        const fetchArgs = fetchOptions ? [url, fetchOptions] : [url];
        const doFetch = limiter.schedule(fetch, ...fetchArgs);
        return doFetch.then( res => {
            if (res.status === 429) {
                const err = new Error('429 Too Many Requests');
                err.type = '429';
                throw err;
            }
            else {
                return json ? res.json() : res.text();
            }
        });
    });
}

function assignProps(objFrom, objTo, propNames) {
    propNames.forEach( prop => {
        let propName, newPropName;
        if (typeof prop === 'object') {
            propName = Object.keys(prop)[0];
            newPropName = prop[propName];
        }
        else {
            propName = newPropName = prop;
        }
        if (objFrom[propName] !== undefined) {
            objTo[newPropName] = objFrom[propName];
        }
    });

    return objTo;
}

function getProp(obj, propName, defaultVal = null) {
    const p = propName.split('.');
    let v = obj[p.shift()];
    while (v != undefined && typeof v === 'object' && p.length > 0) {
        v = v[p.shift()];
    }
    return v !== undefined && p.length === 0 ? v : defaultVal;
}

module.exports = {
    fetchPage,
    assignProps,
    getProp,
};