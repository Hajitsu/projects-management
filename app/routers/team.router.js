const { TeamController } = require('../http/controllers/team.controller');
const { checkLogin } = require('../http/middlewares/check-login.mw');
const { expressValidatorMapper } = require('../http/middlewares/check-errors.mw');
const { createTeamValidation } = require('../http/validations/team.validation');
const { mongoIdValidation } = require('../http/validations/general.validation');

const router = require('express').Router();

router.post('/create', checkLogin, createTeamValidation(), expressValidatorMapper, TeamController.createTeam);
router.get('/list', checkLogin, TeamController.getAllTeams);
router.get('/user-teams', checkLogin, TeamController.getUserTeams);
router.get(
	'/invite/:teamId/:invitedUserId',
	checkLogin,
	// mongoIdValidation(),
	// expressValidatorMapper,
	TeamController.inviteUserToTeam
);
router.get('/:id', checkLogin, mongoIdValidation(), expressValidatorMapper, TeamController.getTeamById);
router.delete('/delete/:id', checkLogin, mongoIdValidation(), expressValidatorMapper, TeamController.removeTeam);

module.exports = { teamRoutes: router };
