const jwt = require("jsonwebtoken")
const { User } = require("../models")

const getUserData = async (req, res) => {
	try {
		const token = req.cookies.userId
		if (!token) {
			return res.status(401).json({ error: "Unauthorized" })
		}

		const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
		if (!decodedToken || !decodedToken._id) {
			return res.status(401).json({ error: "Unauthorized" })
		}

		const user = await User.findById(decodedToken._id)
		if (!user) {
			return res.status(404).json({ error: "User not found" })
		}

		return res.json({
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
		console.error("Error occurred while getting user data:", error)
		return res
			.status(500)
			.json({ error: "Error occurred while getting user data" })
	}
}

module.exports = { getUserData }
