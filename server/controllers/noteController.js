const { User } = require("../models")

const addNote = async (req, res) => {
	const { category, title, content } = req.body
	const addedTime = new Date()

	try {
		const userId = req.user._id
		const user = await User.findById(userId)

		if (!user) {
			return res.status(404).json({ error: "User not found" })
		}

		const categoryIndex = user.notes.findIndex(
			(item) => item.category === category
		)

		if (categoryIndex === -1) {
			user.notes.push({ category, note: [{ title, content, addedTime }] })
		} else {
			user.notes[categoryIndex].note.push({ title, content, addedTime })
		}

		const updatedUser = await user.save()

		const newNote = user.notes[categoryIndex].note.find(
			(n) =>
				n.title === title &&
				n.content === content &&
				n.addedTime.getTime() === addedTime.getTime()
		)

		res.json({
			user: {
				name: user.name,
				surname: user.surname,
				email: user.email,
				notes: user.notes,
				calendar: user.calendar,
				groups: user.groups,
				profileOptions: user.profileOptions,
			},
			notes: updatedUser.notes,
			newNote: newNote,
		})
	} catch (error) {
		console.error("Error occurred while adding a new note:", error)
		res.status(500).json({ error: "Error occurred while adding a new note" })
	}
}

const updateNote = async (req, res) => {
	const { category, _id, title, content } = req.body

	try {
		const userId = req.user._id
		const user = await User.findById(userId)
		const categoryNotes = user.notes.find((n) => n.category === category)

		if (!categoryNotes) {
			return res.status(404).json({ error: "Category not found." })
		}

		const noteToEdit = categoryNotes.note.find((n) => n._id.toString() === _id)
		if (!noteToEdit) {
			return res.status(404).json({ error: "Note not found." })
		}

		noteToEdit.title = title
		noteToEdit.content = content
		noteToEdit.addedTime = new Date()

		await user.save()

		res.json({
			name: user.name,
			surname: user.surname,
			email: user.email,
			notes: user.notes,
			calendar: user.calendar,
			groups: user.groups,
			trash: user.trash,
			profileOptions: user.profileOptions,
		})
	} catch (error) {
		console.error("Error occurred while editing the note:", error)
		res.status(500).json({ error: "Error occurred while editing the note" })
	}
}

const deleteNote = async (req, res) => {
	const { category, noteId } = req.body
	try {
		const userId = req.user._id
		const user = await User.findById(userId)
		const categoryNotes = user.notes.find((n) => n.category === category)

		if (!categoryNotes) {
			return res.status(404).json({ error: "Category not found." })
		}

		const noteIndex = categoryNotes.note.findIndex(
			(n) => n._id.toString() === noteId
		)

		if (noteIndex === -1) {
			return res.status(404).json({ error: "Note not found." })
		}

		const noteToTrash = categoryNotes.note.splice(noteIndex, 1)[0]

		const trashCategoryIndex = user.trash.findIndex(
			(item) => item.originalCategory === category
		)

		if (trashCategoryIndex === -1) {
			user.trash.push({ originalCategory: category, note: [noteToTrash] })
		} else {
			user.trash[trashCategoryIndex].note.push(noteToTrash)
		}

		await user.save()

		res.json({
			name: user.name,
			surname: user.surname,
			email: user.email,
			notes: user.notes,
			calendar: user.calendar,
			groups: user.groups,
			trash: user.trash,
			profileOptions: user.profileOptions,
		})
	} catch (error) {
		console.error("Error occurred while deleting the note:", error)
		res.status(500).json({ error: "Error occurred while deleting the note" })
	}
}

const restoreNote = async (req, res) => {
	const { originalCategory, noteId } = req.body
	try {
		const userId = req.user._id
		const user = await User.findById(userId)

		const trashCategoryIndex = user.trash.findIndex(
			(item) => item.originalCategory.toLowerCase() === originalCategory.toLowerCase()
		)

		if (trashCategoryIndex === -1) {
			return res.status(404).json({ error: "Category not found in trash." })
		}

		const trashNoteIndex = user.trash[trashCategoryIndex].note.findIndex(
			(note) => note._id.toString() === noteId
		)

		if (trashNoteIndex === -1) {
			return res.status(404).json({ error: "Note not found in trash." })
		}

		const noteToRestore = user.trash[trashCategoryIndex].note.splice(
			trashNoteIndex,
			1
		)[0]

		const categoryIndex = user.notes.findIndex(
			(item) => item.category.toLowerCase() === originalCategory.toLowerCase()
		)

		if (categoryIndex === -1) {
			user.notes.push({ category: originalCategory, note: [noteToRestore] })
		} else {
			user.notes[categoryIndex].note.push(noteToRestore)
		}

		if (user.trash[trashCategoryIndex].note.length === 0) {
			user.trash.splice(trashCategoryIndex, 1)
		}

		await user.save()

		res.json({
			name: user.name,
			surname: user.surname,
			email: user.email,
			notes: user.notes,
			calendar: user.calendar,
			trash: user.trash,
			groups: user.groups,
			profileOptions: user.profileOptions,
		})
	} catch (error) {
		console.error("Error occurred while restoring the note:", error)
		res.status(500).json({ error: "Error occurred while restoring the note" })
	}
}

const emptyTrash = async (req, res) => {
	try {
		const userId = req.user._id
		const user = await User.findById(userId)

		if (!user) {
			return res.status(404).json({ error: "User not found" })
		}

		user.trash = []

		await user.save()

		res.json({
			message: "Trash emptied successfully",
			name: user.name,
			surname: user.surname,
			email: user.email,
			notes: user.notes,
			calendar: user.calendar,
			trash: user.trash,
			groups: user.groups,
			profileOptions: user.profileOptions,
		})
	} catch (error) {
		console.error("Error occurred while emptying the trash:", error)
		res.status(500).json({ error: "Error occurred while emptying the trash" })
	}
}

module.exports = { addNote, updateNote, deleteNote, restoreNote, emptyTrash }
