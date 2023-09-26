const jwt = require("jsonwebtoken")

function auth(req, res, next) {
	const token = req.cookie.userId
	if (!token) return res.status(401).send("Access denide. No token provided.")

	try {
		const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
		req.user = decoded
		next()
	} catch (error) {
		res.status(400).send("Invalid token.")
	}
}
function decodeToken(req, res, next) {
	const token = req.cookies.userId
	if (!token) return next()

	try {
		const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
		req.user = decoded
		next()
	} catch (ex) {
		next()
	}
}

module.exports = { auth, decodeToken }
