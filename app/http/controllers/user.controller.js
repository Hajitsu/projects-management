const { UserModel } = require('../../models/user.model');

class UserController {
	async getProfile(req, res, nex) {
		try {
			const user = req.user;
			user.profile_image =
				req.protocol +
				'://' +
				req.get('host') +
				'/' +
				user.profile_image.replace(/[\\\\]/gm, '/');
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

	async uploadProfileImage(req, res, next) {
		try {
			const userId = req.user._id;
			const filePath = req.file?.path.replace('\\', '/').substring(7);
			const result = await UserModel.updateOne(
				{ _id: userId },
				{ $set: { profile_image: filePath } }
			);
			if (result.modifiedCount === 0)
				throw {
					status: 400,
					success: false,
					message: 'upload failed. try again..',
				};

			return res.status(200).json({
				status: 200,
				success: true,
				message: 'image profile uploaded successfully.',
			});
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
