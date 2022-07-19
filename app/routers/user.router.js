const { UserController } = require('../http/controllers/user.controller');
const { checkLogin } = require('../http/middlewares/check-login.mw');

const router = require('express').Router();

router.get('/profile', checkLogin, UserController.getProfile);
router.post('/profile', checkLogin, UserController.updateProfile);

module.exports = { userRoutes: router };
