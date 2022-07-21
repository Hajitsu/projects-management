const { body } = require('express-validator');
const path = require('path');

function imageValidation() {
	return [
		body('image').custom((image, { req }) => {
			if (Object.keys(req.file).length == 0) throw 'لطفا یک فایل را انتخاب کنید.';
			const ext = path.extname(req.file.originalname).toLowerCase();
			const validExt = ['.png', '.jpg', '.jpeg', '.gif'];
			if (!validExt.includes(ext)) throw 'فرمت عکس قابل قبول نیست.';
			const maxSize = 2 * 1024 * 1024;
			if (req.file.size > maxSize) throw 'حجم عکس نباید بیشتر از ۲ مگابایت باشد.';
			return true;
		}),
	];
}

module.exports = {
	imageValidation,
};
