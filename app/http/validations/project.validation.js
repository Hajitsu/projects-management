const { body } = require('express-validator');

function createProjectValidation() {
	return [
		body('title').notEmpty().withMessage('عنوان پروژه نمی‌تواند خالی باشد.'),
		body('description')
			.notEmpty()
			.isLength({ min: 25 })
			.withMessage('توضیحات نمی‌تواند کمتر از ۲۵ نویسه باشد.'),
	];
}

module.exports = {
	createProjectValidation,
};
