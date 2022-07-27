const { UserController } = require('../http/controllers/user.controller');
const { checkLogin } = require('../http/middlewares/check-login.mw');
const { uploadByMulter } = require('../modules/multer-file-upload');
const { imageValidation } = require('../http/validations/user.validation');
const { expressValidatorMapper } = require('../http/middlewares/check-errors.mw');

const router = require('express').Router();

router.get('/profile', checkLogin, UserController.getProfile);
router.get('/invite-requests', checkLogin, UserController.getAllUserRequests);
router.get('/invite-requests/:status', checkLogin, UserController.getUserInvitionsByStatus);
router.get('/change-invite-request-status/:id/:status', checkLogin, UserController.changeInviteRequestStatus);
router.post('/profile', checkLogin, UserController.updateProfile);
router.post(
	'/profile-image',
	checkLogin,
	uploadByMulter.single(['image']),
	imageValidation(),
	expressValidatorMapper,
	checkLogin,
	UserController.uploadProfileImage
);

module.exports = { userRoutes: router };
