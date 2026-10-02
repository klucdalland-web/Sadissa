var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', require('../controllers/type.piece.controller').getTypePiece);

module.exports = router;