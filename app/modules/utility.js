const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function hashString(data) {
	const salt = bcrypt.genSaltSync(14);
	return bcrypt.hashSync(data, salt);
}

function generateJWTToken(payload) {
	return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '10 days' });
}

function verifyJWTToken(token) {
	const result = jwt.verify(token, process.env.SECRET_KEY);
	if (!result?.username) throw { status: 401, success: false, message: 'please login.' };
	return result.username;
}

module.exports = {
	hashString,
	generateJWTToken,
	verifyJWTToken,
};
