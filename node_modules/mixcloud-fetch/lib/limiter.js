const Bottleneck = require('bottleneck');

const _limiter = new Bottleneck({
    maxConcurrent: 5,
    minTime: 200
});

let enabled = true;
function setEnabled(value) {
    enabled = value;
}
function isEnabled() {
    return enabled;
}

function schedule(fn, ...args) {
    if (isEnabled()) {
        return _limiter.schedule(fn, ...args);
    }
    else {
        return fn(...args);
    }
}

function setOptions(options) {
    _limiter.updateSettings(options);
}

module.exports = {
    setEnabled,
    isEnabled,
    setOptions,
    schedule
};