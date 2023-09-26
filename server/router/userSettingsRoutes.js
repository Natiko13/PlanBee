const express = require("express")
const router = express.Router()
const { userSettings } = require("../controllers/userSettingsContoller")
const { decodeToken } = require("../middleware/authMiddleware")

router.patch("/userSettings", decodeToken, userSettings)

module.exports = router
