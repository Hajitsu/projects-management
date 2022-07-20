const { body } = require('express-validator');
const path = require('path');

function imageValidation() {
	return [
		body('image').custom((image, { req }) => {
			if (Object.keys(req.file).length == 0) throw 'upload failed. try again..';
			const ext = path.extname(req.file.originalname).toLowerCase();
			const validExt = ['.png', '.jpg', '.jpeg', '.gif'];
			if (!validExt.includes(ext)) throw 'ext invalid';
			const maxSize = 2 * 1024 * 1024;
			if (req.file.size > maxSize) throw 'invalid max size';
			return true;
		}),
	];
}

module.exports = {
	imageValidation,
};
