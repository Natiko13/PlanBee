const express = require("express")
const router = express.Router()
const { decodeToken } = require("../middleware/authMiddleware")
const { getUserData } = require("../controllers/getUserController")

router.get("/getUserData", decodeToken, getUserData)

module.exports = router
