 const { ProjectModel } = require('../../models/project.model');

class ProjectController {
	async createProject(req, res, next) {
		try {
			const { title, description, image, tags } = req.body;
			console.log(
				`🥷🏻✶ | file: project.controller.js | line 6 | ProjectController | createProject | tags`,
				tags
			);
			const owner = req.user._id;
			const result = await ProjectModel.create({ title, description, owner, image, tags });
			if (!result)
				throw { status: 400, success: false, message: 'پروژه ایجاد نشد. دوباره تلاش کنید.' };
			return res.status(201).json({
				status: 201,
				success: true,
				message: 'پروژه ایجاد شد.',
			});
		} catch (error) {
			next(error);
		}
	}

	async updateProject(req, res, next) {}

	async removeProject(req, res, next) {
		const owner = req.user._id;
		const projectId = req.params.id;
		await this._findProject(projectId, owner);
		const deletedProject = await ProjectModel.deleteOne({ _id: projectId });
		if (deletedProject.deletedCount == 0) throw { status: 400, success: false, message: 'پروژه حذف نشد.' };
		return res.status(201).json({
			status: 201,
			success: false,
			message: 'پروژه حذف شد.',
		});
	}

	async getAllProjects(req, res, next) {
		try {
			const owner = req.user._id;
			const projects = await ProjectModel.find({ owner }, { owner: 0, __v: 0 });
			return res.status(200).json({
				status: 200,
				success: true,
				projects,
			});
		} catch (error) {
			next(error);
		}
	}

	async getProjectById(req, res, next) {
		try {
			const owner = req.user._id;
			const projectId = req.params.id;
			const project = await this._findProject(projectId, owner);
			return res.status(200).json({
				status: 200,
				success: true,
				project,
			});
		} catch (error) {
			next(error);
		}
	}

	async getAllProjectsOfTeam(req, res, next) {}

	async getProjectsOfUser(req, res, next) {}

	async _findProject(projectId, owner) {
		const project = await ProjectModel.findOne({ owner, _id: projectId }, { owner: 0, __v: 0 });
		if (!project) throw { status: 404, success: false, message: 'پروژه‌ای یافت نشد.' };
		return project;
	}
}

module.exports = { ProjectController: new ProjectController() };
