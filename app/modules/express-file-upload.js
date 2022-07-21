const path = require('path');
const { createPathDirectory } = require('./utility');

const expressFileUpload = async (req, res, next) => {
	try {
		if (req.file || Object.keys(req.files).length === 0)
			throw { status: 400, success: false, message: 'لطفا یک تصویر را انتخاب کنید.' };
		let image = req.files.image;
		const imagePath = path.join(createPathDirectory(), Date.now() + path.extname(image.name));
		req.body.image = imagePath;
		let uploadPath = path.join(__dirname, '..', '..', imagePath);
		image.mv(uploadPath, (err) => {
			if (err) throw { status: 500, success: false, message: 'بارگذاری تصویر انجام نشد.' };
			next();
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	expressFileUpload,
};
