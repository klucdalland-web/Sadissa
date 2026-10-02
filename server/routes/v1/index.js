var express = require('express');
var router = express.Router();

var usersRouter = require('./users.route');
var typepieceRouter = require('./typepiece.route');
var authRouter = require('./auth.route');
// var authRouter = require('./auth.route');

router.get('/', function(req, res) {
    res.json({ message: 'Sadissa API v1' });
});

router.use('/users', usersRouter);
router.use('/typepiece', typepieceRouter);
router.use('/auth', require('./auth.route'));
// router.use('/auth', authRouter);

module.exports = router;