const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

function hashString(data) {
	const salt = bcrypt.genSaltSync(14);
	return bcrypt.hashSync(data, salt);
}

function generateJWTToken(payload) {
	return jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '10 days'});
}

function verifyJWTToken(token) {
	const result = jwt.verify(token, process.env.SECRET_KEY);
	if (!result?.username) throw {status: 401, success: false, message: 'please login.'};
	return result.username;
}

function createPathDirectory() {
	let date = new Date();
	const year = date.getFullYear().toString();
	const month = date.getMonth().toString();
	const day = date.getDay().toString();
	
	fs.mkdirSync(path.join(__dirname, '..', '..', 'public', 'uploads', year, month, day), {recursive: true});
	return path.join('public', 'uploads', year, month, day);
}

createPathDirectory();
module.exports = {
	hashString,
	generateJWTToken,
	verifyJWTToken,
	createPathDirectory
};
