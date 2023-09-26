const { User } = require("../models")

const addCategory = async (req, res) => {
	const { category } = req.body

	try {
		const userId = req.user._id
		const user = await User.findById(userId)

		if (
			user.notes.some(
				(n) => n.category.toLowerCase() === category.toLowerCase()
			)
		) {
			return res.status(400).json({ error: "Category already exists." })
		}

		user.notes.push({ category, note: [] })
		await user.save()

		res.status(201).json({
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
		console.error("Error occurred while adding the category:", error)
		res.status(500).json({ error: "Error occurred while adding the category." })
	}
}

const deleteCategory = async (req, res) => {
	try {
		const userId = req.user._id
		const categoryId = req.params.id
		const user = await User.findById(userId)

		const categoryIndex = user.notes.findIndex(
			(n) => n._id.toString() === categoryId
		)

		if (categoryIndex === -1) {
			return res.status(404).json({ error: "Category not found." })
		}

		const removedCategory = user.notes.splice(categoryIndex, 1)[0]

		const existingTrashCategory = user.trash.find(
			(t) => t.originalCategory === removedCategory.category
		)

		if (existingTrashCategory) {
			existingTrashCategory.note.push(...removedCategory.note)
		} else {
			user.trash.push({
				originalCategory: removedCategory.category,
				note: removedCategory.note,
			})
		}

		await user.save()

		res.status(200).json({
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
		console.error("Error occurred while deleting the category:", error)
		res
			.status(500)
			.json({ error: "Error occurred while deleting the category." })
	}
}

const patchCategory = async (req, res) => {
	const { category } = req.body

	try {
		const userId = req.user._id
		const categoryId = req.params.id
		const user = await User.findById(userId)

		const categoryIndex = user.notes.findIndex(
			(n) => n._id.toString() === categoryId
		)

		if (categoryIndex === -1) {
			return res.status(404).json({ error: "Category not found." })
		}

		const existingCategoryIndex = user.notes.findIndex(
			(item) => item.category.toLowerCase() === category.toLowerCase()
		)

		// Sprawdzamy, czy ta sama kategoria jest edytowana, czy może inna o tej samej nazwie.
		if (
			existingCategoryIndex !== -1 &&
			existingCategoryIndex !== categoryIndex
		) {
			return res.status(400).json({ error: "Category already exists." })
		}

		user.notes[categoryIndex].category = category
		await user.save()

		res.status(200).json({
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
		console.error("Error occurred while updating the category:", error)
		res
			.status(500)
			.json({ error: "Error occurred while updating the category." })
	}
}

const restoreCategory = async (req, res) => {
	const { originalCategory } = req.body
	try {
		const userId = req.user._id
		const user = await User.findById(userId)

		const trashCategoryIndex = user.trash.findIndex(
			(item) =>
				item.originalCategory.toLowerCase() === originalCategory.toLowerCase()
		)

		if (trashCategoryIndex === -1) {
			return res.status(404).json({ error: "Category not found in trash." })
		}

		const notesToRestore = user.trash[trashCategoryIndex].note

		const existingCategoryIndex = user.notes.findIndex(
			(item) => item.category.toLowerCase() === originalCategory.toLowerCase()
		)

		if (existingCategoryIndex === -1) {
			user.notes.push({ category: originalCategory, note: notesToRestore })
		} else {
			user.notes[existingCategoryIndex].note.push(...notesToRestore)
		}

		user.trash.splice(trashCategoryIndex, 1)

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
		console.error(
			"Error occurred while restoring the category and notes:",
			error
		)
		res
			.status(500)
			.json({ error: "Error occurred while restoring the category and notes" })
	}
}

module.exports = { addCategory, deleteCategory, patchCategory, restoreCategory }
