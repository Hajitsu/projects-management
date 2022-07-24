const { body } = require('express-validator');
const TeamModel = require('../../models/team.model');

function createTeamValidation() {
	return [
		body('name').isLength({ min: 5 }).withMessage('نام تیم نمی‌تواند کمتر از ۵ نویسه باشد.'),
		body('description').notEmpty().withMessage('توضیحات نمی‌تواند خالی باشد.'),
		body('unique_title').custom(async (unique_title) => {
			const regex_unique_title = /^[A-Za-z]+[a-zA-Z0-9\.\_]{3,}/gim;
			if (regex_unique_title.test(unique_title)) {
				const team = await TeamModel.findOne({ unique_title });
				if (team) throw 'نام تیم تکراری است.';
				return true;
			}
			throw 'نام یکتا را به طور کامل وارد وارد کنید.';
		}),
	];
}

module.exports = { createTeamValidation };
