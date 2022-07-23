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
	expressFileUpload,
	createProjectValidation(),
	expressValidatorMapper,
	ProjectController.createProject
);

router.get('/list', checkLogin, ProjectController.getAllProjects);
router.get('/:id', checkLogin, mongoIdValidation(), expressValidatorMapper, ProjectController.getProjectById);
router.get('/remove/:id', checkLogin, mongoIdValidation(), expressValidatorMapper, ProjectController.removeProject);
router.put('/update/:id', checkLogin, mongoIdValidation(), expressValidatorMapper, ProjectController.updateProject);
router.patch(
	'/update-profile-image/:id',
	fileUpload(),
	checkLogin,
	expressFileUpload,
	mongoIdValidation(),
	expressValidatorMapper,
	ProjectController.updateProjectProfileImage
);

module.exports = { projectRoutes: router };
