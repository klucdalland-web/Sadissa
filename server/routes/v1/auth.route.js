var express = require('express');
var router = express.Router();
var authController = require('../../controllers/auth.controller');
var {
  validateRegister,
  validateLogin,
} = require('../../middlewares/v1/auth.validation');

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

module.exports = router;
