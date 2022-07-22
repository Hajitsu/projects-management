const { param } = require('express-validator');

function mongoIdValidation() {
	return [param('id').isMongoId().withMessage('شناسه ارسال شده صحیح نمی‌باشد.')];
}

module.exports = { mongoIdValidation };
