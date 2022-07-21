const router = require('express').Router();

const { checkLogin } = require('../http/middlewares/check-login.mw');
const { ProjectController } = require('../http/controllers/project.controller');
const { expressValidatorMapper } = require('../http/middlewares/check-errors.mw');
const { createProjectValidation } = require('../http/validations/project.validation');

router.post('/create', checkLogin, createProjectValidation(), expressValidatorMapper, ProjectController.createProject);

module.exports = { projectRoutes: router };
