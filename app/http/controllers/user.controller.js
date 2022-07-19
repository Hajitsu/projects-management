const { UserModel } = require('../../models/user.model');

class UserController {
	async getProfile(req, res, nex) {
		try {
			const user = req.user;
			return res.status(200).json({
				status: 200,
				success: true,
				user,
			});
		} catch (error) {
			next(error);
		}
	}
	async updateProfile(req, res, next) {
		try {
			let data = req.body;
			const userId = req.user._id;
			Object.entries(data).forEach(([key, value]) => {
				let fields = ['first_name', 'last_name', 'skills'];
				let badValues = ['', ' ', '.', null, undefined, 0, -1, NaN];
				if (!fields.includes(key)) delete data[key];
				if (badValues.includes(value)) delete data[key];
			});
			
			console.log(`🥷🏻✶ | file: user.controller.js | line 21 | UserController | Object.entries | data`, data);
			const result = await UserModel.updateOne({ _id: userId }, { $set: data });
			if (result.modifiedCount > 0)
				return res.status(200).json({
					status: 200,
					success: true,
					message: 'update profile success.',
				});
			throw { status: 401, success: false, message: 'update user failed' };
		} catch (error) {
			next(error);
		}
	}
	addSkills() {}
	updateSkills() {}
	acceptInviteInTeam() {}
	rejectInviteInTeam() {}
}

module.exports = { UserController: new UserController() };
