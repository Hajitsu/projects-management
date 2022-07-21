const { body } = require('express-validator');
const { UserModel } = require('../../models/user.model');

function registerValidator() {
	return [
		body('username').custom(async (username, ctx) => {
			if (username) {
				const usernameRegex = /^[a-z]+[a-z0-9\_\.]{3,}/gi;
				if (usernameRegex.test(username)) {
					const user = await UserModel.findOne({ username });
					if (user) throw 'نام کاربری موجود است.';
					return true;
				}
				throw 'در انتخاب نام کاربری دقت کنید.';
			}
			throw 'نام کاربری نمی‌تواند خالی باشد.';
		}),
		body('email')
			.isEmail()
			.withMessage('لطفا ایمیل صحیح وارد کنید.')
			.custom(async (email) => {
				const user = await UserModel.findOne({ email });
				if (user) throw 'ایمیل موجود است.';
				return true;
			}),
		body('mobile')
			.isMobilePhone('fa-IR')
			.withMessage('موبایل صحیح وارد کنید.')
			.custom(async (mobile) => {
				const user = await UserModel.findOne({ mobile });
				if (user) throw 'موبایل موجود است.';
				return true;
			}),
		body('password')
			.isLength({ min: 6, max: 16 })
			.withMessage('پسورد باید بین ۶ تا ۱۶ کاراکتر باشد.')
			.custom((value, { req }) => {
				if (!value) throw 'پسورد نمی‌ةواند خالی باشد.';
				if (value !== req?.body?.confirmPassword) throw 'پسورد و تاییدیه پسورد باید یکی باشند.';
				return true;
			}),
	];
}

function loginValidator() {
	return [
		body('username')
			.notEmpty()
			.withMessage('نام کاربری نمی‌تواند خالی باشد')
			.custom(async (username) => {
				const usernameRegex = /^[a-z]+[a-z0-9\_\.]{3,}/gi;
				if (usernameRegex.test(username)) {
					return true;
				}
				throw 'در انتخاب نام کاربری دقت کنید.';
			}),
		body('password').isLength({ min: 4, max: 14 }).withMessage('پسورد باید بین ۶ تا ۱۶ کاراکتر باشد.'),
	];
}

module.exports = {
	registerValidator,
	loginValidator,
};
