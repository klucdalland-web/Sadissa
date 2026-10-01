const config = require('../config/index');


print = (...params) => {
    if (config.env === 'development') {
        console.log(...params);
    }
};

module.exports = {
    print
};