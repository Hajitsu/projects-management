const { UserModel } = require('../../models/user.model');
const { createFileLink } = require('../../modules/utility');

class UserController {
	async getProfile(req, res, nex) {
		try {
			const user = req.user;
			user.profile_image = createFileLink(req, user.profile_image);
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
					message: 'ویرایش پروفایل انجام شد.',
				});
			throw { status: 401, success: false, message: 'ویرایش پروفایل انجام نشد. دوباره تلاش کنید.' };
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
					message: 'آپلود فایل انجام نشد. دوباره تلاش کنید.',
				};

			return res.status(200).json({
				status: 200,
				success: true,
				message: 'آپلود فایل انجام شد.',
			});
		} catch (error) {
			next(error);
		}
	}

	async getAllUserRequests(req, res, next) {
		try {
			const userId = req.user._id;
			// const { invite_requests } = await UserModel.findById(userId, { invite_requests: 1 });
			const invite_requests = await UserModel.aggregate([
				{
					$match: {
						_id: userId,
					},
				},
				{
					$lookup: {
						from: 'users',
						localField: 'invite_requests.inviter',
						foreignField: 'username',
						as: 'invite_requests.inviter',
					},
				},
			]);
			return res.status(200).json({
				status: 200,
				success: true,
				requests: invite_requests || [],
			});
		} catch (error) {
			next(error);
		}
	}

	async getUserInvitionsByStatus(req, res, next) {
		try {
			const { status } = req.params;
			const userId = req.user._id;
			const requests = await UserModel.aggregate([
				{ $match: { _id: userId } },
				{
					$project: {
						invite_requests: 1,
						_id: 0,
						invite_requests: {
							$filter: {
								input: '$invite_requests',
								as: 'request',
								cond: {
									$eq: ['$$request.status', status],
								},
							},
						},
					},
				},
			]);
			res.status(200).json({
				status: 200,
				success: true,
				requests: requests?.[0]?.invite_requests || [],
			});
		} catch (error) {
			next(error);
		}
	}

	async changeInviteRequestStatus(req, res, next) {
		try {
			const { id, status } = req.params;
			const request = await UserModel.findOne({ 'invite_requests._id': id });
			if (!request)
				throw { status: 400, success: false, message: 'درخواستی با این مشخصات یافت نشد.' };
			const foundRequest = request.invite_requests.find((item) => item.id == id);
			if (foundRequest.status !== 'pending')
				throw { status: 400, success: false, message: 'این درخواست قبلا رد یا تایید شده است' };
			if (!['accepted', 'rejected'].includes(status))
				throw { status: 400, success: false, message: 'وضعیت صحیح نمی‌باشد' };
			const updateResult = await UserModel.updateOne(
				{ 'invite_requests._id': foundRequest._id },
				{
					$set: { 'invite_requests.$.status': status },
				}
			);
			if (updateResult.modifiedCount == 0)
				throw { status: 500, success: false, message: 'تغییر وضعیت انجام نشد' };
			res.status(201).json({
				status: 201,
				success: true,
				message: 'تغییر وضعیت انجام شد',
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
