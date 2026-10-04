var express = require('express');
var router = express.Router();

var usersRouter = require('./users.route');
var typepieceRouter = require('./typepiece.route');
var authRouter = require('./auth.route');
<<<<<<< HEAD
// var authRouter = require('./auth.route');
=======
var campaignsRouter = require('./campaigns.route');
>>>>>>> origin/develop

router.get('/', function(req, res) {
    res.json({ message: 'Sadissa API v1' });
});

router.use('/users', usersRouter);
router.use('/typepiece', typepieceRouter);
<<<<<<< HEAD
router.use('/auth', require('./auth.route'));
// router.use('/auth', authRouter);
=======
router.use('/auth', authRouter);
router.use('/campaigns', campaignsRouter);
>>>>>>> origin/develop

module.exports = router;