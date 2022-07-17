const { body } = require('express-validator');
const { UserModel } = require('../../models/user.model');

function registerValidator() {
	return [
		body('username').custom(async (username, ctx) => {
			if (username) {
				const usernameRegex = /^[a-z]+[a-z0-9\_\.]{3,}/gi;
				if (usernameRegex.test(username)) {
					const user = await UserModel.findOne({ username });
					if (user) throw 'duplicate username';
					return true;
				}
				throw 'username pattern is invalid';
			}
			throw "username couldn't empty";
		}),
		body('email')
			.isEmail()
			.withMessage('please enter valid email.')
			.custom(async (email) => {
				const user = await UserModel.find({ email });
				if (user) throw 'duplicate email';
				return true;
			}),
		body('mobile')
			.isMobilePhone('fa-IR')
			.withMessage('please enter valid mobile')
			.custom(async (email) => {
				const user = await UserModel.find({ mobile });
				if (user) throw 'duplicate mobile';
				return true;
			}),
		body('password')
			.isLength({ min: 6, max: 16 })
			.withMessage('password length must be in 6 to 16 chars')
			.custom((value, { req }) => {
				if (!value) throw 'password could not be empty';
				if (value !== req?.body?.confirmPassword)
					throw 'password and confirm password are not same.';
				return true;
			}),
	];
}

function loginValidator() {
	return [
		body('username')
			.notEmpty()
			.withMessage('username could not be empty')
			.custom(async (username) => {
				const usernameRegex = /^[a-z]+[a-z0-9\_\.]{3,}/gi;
				if (usernameRegex.test(username)) {
					return true;
				}
				throw 'username pattern is invalid';
			}),
		body('password').isLength({ min: 4, max: 14 }).withMessage('password length must be in 6 to 16 chars'),
	];
}

module.exports = {
	registerValidator,
	loginValidator,
};
