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
<<<<<<< HEAD
router.post('/refresh', requireAuth, authController.refresh);
router.post('/logout', requireAuth, authController.logout);
=======
// refresh / logout s'appuient sur le cookie refresh_token, pas sur l'access_token
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
>>>>>>> origin/develop
router.get('/me', requireAuth, authController.me);
module.exports = router;