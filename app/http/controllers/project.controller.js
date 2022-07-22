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

	async removeProject(req, res, next) {}

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

	async getProjectById(req, res, next) {}

	async getAllProjectsOfTeam(req, res, next) {}

	async getProjectsOfUser(req, res, next) {}
}

module.exports = { ProjectController: new ProjectController() };
