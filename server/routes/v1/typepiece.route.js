var express = require('express');
var router = express.Router();
const typePieceController = require('../../controllers/type.piece.controller');

router.get('/', typePieceController.getTypePiece);

module.exports = router;
