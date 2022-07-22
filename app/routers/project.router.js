const fileUpload = require('express-fileupload');
const router = require('express').Router();

const { checkLogin } = require('../http/middlewares/check-login.mw');
const { ProjectController } = require('../http/controllers/project.controller');
const { expressValidatorMapper } = require('../http/middlewares/check-errors.mw');
const { createProjectValidation } = require('../http/validations/project.validation');
const { expressFileUpload } = require('../modules/express-file-upload');

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

module.exports = { projectRoutes: router };
