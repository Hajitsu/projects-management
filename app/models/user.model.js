const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
	{
		firstName: { type: String },
		LastName: { type: String },
		username: { type: String, required: true, uniqe: true },
		password: { type: String, required: true },
		mobile: { type: String, required: true, uniqe: true },
		email: { type: String, required: true, uniqe: true },
		roles: { type: String, default: ['USER'] },
		skills: { type: String, default: [] },
		teams: { type: String, default: [] },
	},
	{ timestamps: true }
);

const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;
