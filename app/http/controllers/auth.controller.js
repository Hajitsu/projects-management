const bcrypt = require('bcrypt');
const { UserModel } = require('../../models/user.model');
const { hashString, generateJWTToken } = require('../../modules/utility');

class AuthController {
	async register(req, res, next) {
		try {
			const { username, password, email, mobile } = req.body;
			const hashedPassword = hashString(password);
			const result = await UserModel.create({
				username,
				password: hashedPassword,
				email,
				mobile,
			}).catch((error) => {
				console.log(JSON.stringify(error, null, 4));
				if (err?.code == 11000)
					throw { status: 400, success: false, message: 'username exist' };
			});
			return res.json(result);
		} catch (error) {
			next(error);
		}
	}
	async login(req, res, next) {
		try {
			const { username, password } = req.body;
			const user = await UserModel.findOne({ username });
			if (!user) throw { status: 401, success: false, message: 'user/password wrong' };
			if (!bcrypt.compareSync(password, user.password))
				throw { status: 401, success: false, message: 'user/password wrong' };

			const token = generateJWTToken({ username: username });
			user.token = token;
			user.save();
			return res.status(200).json({
				status: 200,
				success: true,
				message: 'login successfully',
				token: token,
			});
			return res.json(req.body);
		} catch (error) {
			next(error);
		}
	}
	resetPassword() {}
}

module.exports = {
	AuthController: new AuthController(),
};
