const { TeamController } = require('../http/controllers/team.controller');
const { checkLogin } = require('../http/middlewares/check-login.mw');
const { expressValidatorMapper } = require('../http/middlewares/check-errors.mw');
const { createTeamValidation } = require('../http/validations/team.validation');

const router = require('express').Router();

router.post('/create', checkLogin, createTeamValidation(), expressValidatorMapper, TeamController.createTeam);
router.get('/list', checkLogin, TeamController.getAllTeams);

module.exports = { teamRoutes: router };
