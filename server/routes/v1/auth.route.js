var express = require('express');
var router = express.Router();
var authController = require('../../controllers/auth.controller');
var {
    validateRegister,
    validateLogin,

} = require('../../middlewares/v1/auth.validation');
var { requireAuth } = require('../../middlewares/v1/auth.middleware');

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
// refresh / logout s'appuient sur le cookie refresh_token, pas sur l'access_token
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.me);
module.exports = router;