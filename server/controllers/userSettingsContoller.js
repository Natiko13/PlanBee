const bcrypt = require("bcrypt")
const { User } = require("../models")

const userSettings = async (req, res) => {
	try {
		const userId = req.user._id
		const user = await User.findById(userId)

		if (!user) {
			return res.status(404).json({ error: "User not found." })
		}

		if (req.body.name) user.name = req.body.name
		if (req.body.surname) user.surname = req.body.surname
		if (req.body.email) user.email = req.body.email

		if (req.body.currentPassword && req.body.newPassword) {
			const isMatch = await bcrypt.compare(
				req.body.currentPassword,
				user.password
			)
			if (!isMatch) {
				return res.status(400).json({ error: "Current password is incorrect." })
			}
			user.password = await bcrypt.hash(req.body.newPassword, 10)
		}

		if (req.body.profileOptions) {
			if (req.body.profileOptions.background)
				user.profileOptions.background = req.body.profileOptions.background
			if (req.body.profileOptions.avatar)
				user.profileOptions.avatar = req.body.profileOptions.avatar
			if (req.body.profileOptions.theme)
				user.profileOptions.theme = req.body.profileOptions.theme
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
		console.error("Error occurred while updating user profile:", error)
		res
			.status(500)
			.json({ error: "Error occurred while updating user profile." })
	}
}

module.exports = { userSettings }
