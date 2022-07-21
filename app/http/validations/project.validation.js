const { body } = require('express-validator');

function createProjectValidation() {
	return [
		body('title').notEmpty().withMessage('عنوان پروژه نمی‌تواند خالی باشد.'),
		body('description')
			.notEmpty()
			.isLength({ min: 25 })
			.withMessage('توضیحات نمی‌تواند کمتر از ۲۵ نویسه باشد.'),
		body('tags').isArray({ min: 0, max: 10 }).withMessage('حداکثر تعداد هشتگ‌ها ۱۰ عدد است.'),
	];
}

module.exports = {
	createProjectValidation,
};
