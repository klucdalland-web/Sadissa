var express = require('express');
var router = express.Router();

var v1Router = require('./v1');
// var v2Router = require('./v2');

router.use('/v1', v1Router);
// router.use('/v2', v2Router);

module.exports = router;
