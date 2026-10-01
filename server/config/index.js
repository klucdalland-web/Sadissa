require('dotenv').config();
var path = require('path');

var config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),

};



module.exports = config;