const autoBind = require('auto-bind');
const TeamModel = require('../../models/team.model');
const { UserModel } = require('../../models/user.model');

class TeamController {
	constructor() {
		autoBind(this);
	}

	async createTeam(req, res, next) {
		try {
			const { name, description, unique_title } = req.body;
			const owner = req.user._id;
			const newTeam = await TeamModel.create({ name, description, unique_title, owner });
			if (!newTeam) throw { status: 400, success: false, message: 'تیم ایجاد نشد.' };
			return res.status(201).json({
				status: 201,
				success: true,
				message: 'تیم با موفقیت ایجاد شد.',
			});
		} catch (error) {
			next(error);
		}
	}

	async getAllTeams(req, res, next) {
		try {
			const teams = await TeamModel.find({}, { __v: 0 });
			return res.status(200).json({
				status: 200,
				success: true,
				teams,
			});
		} catch (error) {
			next(error);
		}
	}

	async getTeamById(req, res, next) {
		try {
			const teamId = req.params.id;
			const team = await TeamModel.findById({ _id: teamId }, { __v: 0 });
			if (!team) throw { status: 400, success: false, message: 'تیم یافت نشد.' };
			return res.status(200).json({
				status: 200,
				success: true,
				team,
			});
		} catch (error) {
			next(error);
		}
	}

	async getUserTeams(req, res, next) {
		try {
			const userId = req.user._id;
			// const teams = await TeamModel.find({ $or: [{ owner: userId }, { users: userId }] }, { __v: 0 });
			const teams = await TeamModel.aggregate([
				{
					$match: { $or: [{ owner: userId }, { users: userId }] },
				},
				{
					$lookup: {
						from: 'users',
						localField: 'owner',
						foreignField: '_id',
						as: 'owner',
					},
				},
				{
					// $project: {
					// 	'owner.roles': 0,
					// 	'owner.password': 0,
					// 	'owner.skills': 0,
					// 	'owner.__v': 0,
					// 	'owner.teams': 0,
					// 	'owner.invite_requests': 0,
					// },
					$project: {
						'owner.username': 1,
						'owner.first_name': 1,
						'owner.last_name': 1,
					},
				},
				{
					$unwind: '$owner',
				},
			]);
			if (!teams) throw { status: 400, success: false, message: 'تیم یافت نشد.' };
			return res.status(200).json({
				status: 200,
				success: true,
				teams,
			});
		} catch (error) {
			next(error);
		}
	}

	async inviteUserToTeam(req, res, next) {
		try {
			const userId = req.user._id;
			const { teamId, invitedUserId } = req.params;
			const team = await this._findUserInTeam(teamId, userId);
			if (!team)
				throw {
					status: 400,
					success: false,
					message: 'شما عضو تیم نیستید و اجازه دعوت ندارید.',
				};

			const invitedUser = await UserModel.findOne({ invitedUserId });
			if (!invitedUser) throw { status: 400, success: false, message: 'کاربر مورد نظر یافت نشد' };

			const hadInvitedBefore = await this._findUserInTeam(teamId, invitedUserId);
			if (hadInvitedBefore)
				throw { status: 400, success: false, message: 'این کاربر قبلا به تیم اضافه شده است' };

			const inviteRequest = {
				inviter: req.user.username,
				team_id: teamId,
			};

			const updateInviteResult = await UserModel.updateOne(
				{ _id: invitedUserId },
				{ $push: { invite_requests: inviteRequest } }
			);

			if (updateInviteResult.modifiedCount == 0)
				throw { status: 500, success: false, message: 'دعوت ثبت نشد' };

			return res.status(201).json({
				status: 201,
				success: true,
				message: 'دعوت ثبت شد',
			});
		} catch (error) {
			next(error);
		}
	}

	async removeTeam(req, res, next) {
		try {
			const teamId = req.params.id;
			const team = await TeamModel.findById({ _id: teamId });
			if (!team) throw { status: 400, success: false, message: 'تیم یافت نشد.' };
			const deletedTeam = await TeamModel.deleteOne({ _id: teamId });
			if (deletedTeam.deletedCount == 0)
				throw { status: 500, success: false, message: 'تیم حذف نشد.' };
			return res.status(201).json({
				status: 201,
				success: true,
				message: 'تیم حذف شد.',
			});
		} catch (error) {
			next(error);
		}
	}

	async updateTeam(req, res, next) {
		try {
			const data = { ...req.body };
			Object.keys(data).forEach((key) => {
				if (!data[key]) delete data[key];
				if (['', ' ', NaN, undefined, null].includes(data[key])) delete data[key];
			});
			const owner = req.user._id;
			const { id } = req.params;
			const team = await TeamModel.findOne({ _id: id, owner: owner });
			if (!team) throw { status: 400, success: false, message: 'تیم یافت نشد.' };
			const updateResult = await TeamModel.updateOne(
				{ _id: id },
				{
					$set: data,
				}
			);
			if (updateResult.modifiedCount == 0)
				throw { status: 500, success: false, message: 'تیم بروزرسانی نشد.' };

			return res.status(201).json({
				status: 201,
				success: true,
				message: 'تیم بروزرسانی شد.',
			});
		} catch (error) {
			next(error);
		}
	}

	async _findUserInTeam(teamId, userId) {
		const result = await TeamModel.findOne({
			_id: teamId,
			$or: [{ owner: userId }, { users: userId }],
		});
		return !!result;
	}
}

module.exports = { TeamController: new TeamController() };
