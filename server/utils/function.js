const config = require('../config/index');


print = (...params) => {
    if (config.env === 'development') {
        console.log(...params);
    }
};

res = function(res, status, message, data) {
    return res.status(status).json({
        status: status === 200,
        message,
        data
    });
};

module.exports = {
    print,
    res
};