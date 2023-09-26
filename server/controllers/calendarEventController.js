const { User } = require("../models")

const newEvent = async (req, res) => {
	try {
		const {
			title,
			start,
			end,
			allDay,
			localization,
			description,
			color,
			eventClass,
		} = req.body

		if (!allDay) {
			if (!title || !start || !end) {
				return res.status(400).json({ error: "Missing required fields" })
			}
		}
		if (allDay) {
			if (!title || !start) {
				return res.status(400).json({ error: "Missing required fields" })
			}
		}

		const userId = req.user._id
		const newEvent = {
			title,
			start,
			end,
			allDay,
			localization,
			description,
			color,
			eventClass,
		}

		// Użyj findOneAndUpdate z opcją new: true
		const user = await User.findOneAndUpdate(
			{ _id: userId },
			{ $push: { calendar: newEvent } },
			{ new: true }
		)

		// Znajdź ostatni element w tablicy calendar
		const addedEvent = user.calendar[user.calendar.length - 1]

		res.status(201).json({
			user: {
				name: user.name,
				surname: user.surname,
				email: user.email,
				notes: user.notes,
				calendar: user.calendar,
				groups: user.groups,
				trash: user.trash,
				profileOptions: user.profileOptions,
			},
			calendar: user.calendar,
			addedEvent: addedEvent,
		})
	} catch (error) {
		console.error("Error occurred while adding a new event:", error)
		res.status(500).json({ error: "Something went wrong" })
	}
}

const deleteEvent = async (req, res) => {
	try {
		const userId = req.user._id
		const eventId = req.params.eventId

		if (!eventId) {
			return res.status(400).json({ error: "Event ID not provided" })
		}

		await User.findByIdAndUpdate(userId, {
			$pull: { calendar: { _id: eventId } },
		})

		const user = await User.findById(userId)
		res.status(200).json({
			user: {
				name: user.name,
				surname: user.surname,
				email: user.email,
				notes: user.notes,
				calendar: user.calendar,
				groups: user.groups,
				trash: user.trash,
				profileOptions: user.profileOptions,
			},
			calendar: user.calendar,
		})
	} catch (error) {
		console.error("Error occurred while deleting the event:", error)
		res.status(500).json({ error: "Something went wrong" })
	}
}

const updateEvent = async (req, res) => {
	try {
		const userId = req.user._id
		const eventId = req.params.eventId
		const updatedEvent = req.body

		if (!eventId) {
			return res.status(400).json({ error: "Event ID not provided" })
		}

		if (!updatedEvent.allDay) {
			if (!updatedEvent.title || !updatedEvent.start || !updatedEvent.end) {
				return res.status(400).json({ error: "Missing required fields" })
			}
		}

		if (updatedEvent.allDay) {
			if (!updatedEvent.title || !updatedEvent.start) {
				return res.status(400).json({ error: "Missing required fields" })
			}
		}

		await User.findOneAndUpdate(
			{ _id: userId, "calendar._id": eventId },
			{
				$set: { "calendar.$": updatedEvent },
			}
		)

		const user = await User.findById(userId)
		res.status(200).json({
			user: {
				name: user.name,
				surname: user.surname,
				email: user.email,
				notes: user.notes,
				calendar: user.calendar,
				groups: user.groups,
				trash: user.trash,
				profileOptions: user.profileOptions,
			},
			calendar: user.calendar,
		})
	} catch (error) {
		console.error("Error occurred while updating the event:", error)
		res.status(500).json({ error: "Something went wrong" })
	}
}

module.exports = { newEvent, deleteEvent, updateEvent }
