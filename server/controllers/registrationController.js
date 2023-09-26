const bcrypt = require("bcrypt")
const { User } = require("../models")

const registerUser = async (req, res) => {
	const { name, surname, password, email, privacyPolicy } = req.body

	try {
		// Input data validation
		if (!name || !surname || !password || !email || !privacyPolicy) {
			return res.status(400).json({ error: "Missing required fields." })
		}

		// Check if a user with the same email already exists
		const existingUser = await User.findOne({ email })

		if (existingUser) {
			return res.status(400).json({ error: "Email already in use." })
		}

		// Hash the password
		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(password, salt)

		// Save the user in the database
		const newUser = new User({
			name,
			surname,
			email,
			password: hashedPassword,
			notes: [
				{ category: "Notatki", note: [] },
				{ category: "Zadania", note: [] },
			],
			profileOptions: {
				background: "bg.png",
				avatar: "Avatar1.png",
				theme: "light",
			},
			privacyPolicy,
		})
		await newUser.save()

		res.json({
			message: "Registration successful",
			name: newUser.name,
			surname: newUser.surname,
			email: newUser.email,
		})
	} catch (error) {
		console.error("Error occurred during registration:", error)
		res.status(500).json({ error: "Error occurred during registration." })
	}
}

module.exports = { registerUser }
