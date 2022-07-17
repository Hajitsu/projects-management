const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function hashString(data) {
	const salt = bcrypt.genSaltSync(14);
	return bcrypt.hashSync(data, salt);
}

function generateToken(payload) {
	return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '10 days' });
}

module.exports = {
	hashString,
	generateToken,
};
