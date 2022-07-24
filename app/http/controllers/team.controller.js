const autoBind = require('auto-bind');
const TeamModel = require('../../models/team.model');

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
			const teams = await TeamModel.find({ $or: [{ owner: userId }, { users: userId }] }, { __v: 0 });
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
		} catch (error) {
			next(error);
		}
	}
}

module.exports = { TeamController: new TeamController() };
