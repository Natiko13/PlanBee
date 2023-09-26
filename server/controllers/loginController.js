const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { User } = require("../models")

const login = async (req, res) => {
	const { email, password, rememberMe } = req.body

	try {
		const user = await User.findOne({ email })
		if (!user) {
			return res.status(404).json({ error: "This user does not exist." })
		}

		const validPassword = await bcrypt.compare(password, user.password)
		if (!validPassword) {
			return res.status(400).json({ error: "Invalid password." })
		}

		const token = jwt.sign(
			{
				_id: user._id,
				email: user.email,
			},
			process.env.JWT_PRIVATE_KEY,
			{ expiresIn: "7d" }
		)

		const cookieOptions = {
			httpOnly: false,
		}
		const now = Math.floor(Date.now() / 1000)

		if (rememberMe) {
			cookieOptions.maxAge =
				Math.floor(Date.now() / 1000) + 10 * 365 * 24 * 60 * 60
		} 

		res.cookie("userId", token, cookieOptions)

		// Map the user data to the UserData interface structure
		const userData = {
			name: user.name,
			surname: user.surname,
			email: user.email,
			notes: user.notes,
			calendar: user.calendar,
			groups: user.groups,
			trash: user.trash,
			profileOptions: user.profileOptions,
		}

		// Include the user data in the response
		res.json({ message: "Login successful", userData })
	} catch (error) {
		console.error("Error occurred during login:", error)
		res.status(500).json({ error: "Error occurred during login." })
	}
}

const logout = (req, res) => {
	try {
		res.clearCookie("userId")
		res.clearCookie("isLogin")
		res.json({ message: "Logout successful" })
	} catch (error) {
		console.error("Error occurred during logout:", error)
		res.status(500).json({ error: "Error occurred during logout." })
	}
}

module.exports = { login, logout }
