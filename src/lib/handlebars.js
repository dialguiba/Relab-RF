const { format } = require('timeago.js');

const helpers = {};

helpers.timeago = (timestamp) => {
    return format(timestamp);
};

//

helpers.if_eq = function(a, b, opts) {
    if (a === b) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
};

helpers.counter = function(index) {
    return index+1;
};


module.exports = helpers;