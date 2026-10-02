var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.json({ message: 'Sadissa API v2' });
});

module.exports = router;
