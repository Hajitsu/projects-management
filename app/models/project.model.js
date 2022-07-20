const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		text: { type: String },
		image: { type: String,default:'/defaults/project.png' },
		owner: { type: mongoose.Types.ObjectId, required: true },
		team: { type: mongoose.Types.ObjectId },
		private: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

const ProjectModel = mongoose.model('team', ProjectSchema);
module.exports = ProjectModel;