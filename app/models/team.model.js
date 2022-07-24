const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema(
	{
		unique_title: { type: String, requirede: true, unique: true },
		name: { type: String, requirede: true },
		description: { type: String },
		users: { type: [mongoose.Types.ObjectId], default: [] },
		owner: { type: mongoose.Types.ObjectId, required: true },
	},
	{ timestamps: true }
);

const TeamModel = mongoose.model('team', TeamSchema);
module.exports = TeamModel;
