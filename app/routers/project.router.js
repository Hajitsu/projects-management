const fileUpload = require('express-fileupload');
const router = require('express').Router();

const { checkLogin } = require('../http/middlewares/check-login.mw');
const { ProjectController } = require('../http/controllers/project.controller');
const { expressValidatorMapper } = require('../http/middlewares/check-errors.mw');
const { createProjectValidation } = require('../http/validations/project.validation');
const { mongoIdValidation } = require('../http/validations/general.validation');
const { expressFileUpload } = require('../modules/express-file-upload');
const projectController = require('../http/controllers/project.controller');

router.post(
	'/create',
	fileUpload(),
	checkLogin,
	createProjectValidation(),
	expressValidatorMapper,
	expressFileUpload,
	ProjectController.createProject
);

router.get('/list', checkLogin, ProjectController.getAllProjects);
router.get(
	'/:id',
	checkLogin,
	mongoIdValidation(),
	expressValidatorMapper,
	ProjectController.getProjectById.bind(ProjectController)
);
router.get(
	'/remove/:id',
	checkLogin,
	mongoIdValidation(),
	expressValidatorMapper,
	ProjectController.removeProject.bind(ProjectController)
);

module.exports = { projectRoutes: router };
