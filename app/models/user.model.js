const mongoose = require('mongoose');

const InviteRequestSchema = new mongoose.Schema({
	team_id: { type: mongoose.Types.ObjectId, required: true },
	inviter: { type: String, required: true, lowercase: true },
	request_date: { type: Date, dafault: new Date() },
	status: { type: String, default: 'pending' },
});

const UserSchema = new mongoose.Schema(
	{
		first_name: { type: String },
		last_name: { type: String },
		username: { type: String, required: true, unique: true, lowercase: true },
		password: { type: String, required: true },
		mobile: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true, lowercase: true },
		profile_image: { type: String, default: 'user.png' },
		token: { type: String },
		roles: { type: [String], default: ['USER'] },
		skills: { type: [String], default: [] },
		teams: { type: [mongoose.Types.ObjectId], default: [] },
		invite_requests: { type: [InviteRequestSchema], default: {} },
	},
	{ timestamps: true }
);

const UserModel = mongoose.model('user', UserSchema);
module.exports = { UserModel };
