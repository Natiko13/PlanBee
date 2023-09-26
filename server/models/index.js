const mongoose = require("mongoose")

const noteSchema = new mongoose.Schema({
	category: { type: String, required: true },
	note: [
		{
			title: { type: String, required: true },
			content: { type: String, required: true },
			addedTime: { type: Date },
		},
	],
})

const taskSchema = new mongoose.Schema({
	title: { type: String, required: true },
	content: { type: String },
	addedTime: { type: Date },
})

const groupSchema = new mongoose.Schema({
	name: { type: String, default: "Nazwa grupy" },
	members: [{ type: String }],
	notes: [taskSchema],
	tasks: [taskSchema],
})

const calendarSchema = new mongoose.Schema({
	title: { type: String, required: true },
	start: { type: String },
	end: { type: String },
	allDay: { type: Boolean },
	localization: { type: String },
	description: { type: String },
	color: { type: String },
	eventClass: { type: String },
})

const trashNoteSchema = new mongoose.Schema({
	originalCategory: { type: String, required: true },
	note: [
		{
			title: { type: String, required: true },
			content: { type: String, required: true },
			addedTime: { type: Date },
		},
	],
})

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	surname: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	notes: [noteSchema],
	calendar: [calendarSchema],
	groups: [groupSchema],
	trash: [trashNoteSchema],
	profileOptions: {
		background: { type: String },
		avatar: { type: String },
		theme: { type: String },
	},
	privacyPolicy: { type: Boolean, required: true },
})

const User = mongoose.model("User", userSchema)

module.exports = { User }
