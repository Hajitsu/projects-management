const { verifyJWTToken } = require('../../modules/utility');
const { UserModel } = require('../../models/user.model');

const checkLogin = async (req, res, next) => {
	try {
		let authError = { status: 401, success: false, message: 'please login.' };
		const authorization = req?.headers?.authorization;
		if (!authorization) throw authError;
		let token = authorization.split(' ')?.[1];
		if (!token) throw authError;
		const user = await UserModel.findOne({ username: verifyJWTToken(token) }, { password: 0 });
		if (!user) throw authError;
		req.user = user;
		next();
	} catch (error) {
		next(error);
	}
};

module.exports = {
	checkLogin,
};
