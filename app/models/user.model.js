const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
	{
		firstName: { type: String },
		LastName: { type: String },
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		mobile: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		token: { type: String, unique: true },
		roles: { type: [String], default: ['USER'] },
		skills: { type: [String], default: [] },
		teams: { type: [mongoose.Types.ObjectId], default: [] },
	},
	{ timestamps: true }
);

const UserModel = mongoose.model('user', UserSchema);
module.exports = { UserModel };
