const express = require("express")
const router = express.Router()
const { decodeToken } = require("../middleware/authMiddleware")
const {
	newEvent,
	deleteEvent,
	updateEvent,
} = require("../controllers/calendarEventController")

router.post("/event", decodeToken, newEvent);
router.delete("/event/:eventId", decodeToken, deleteEvent);
router.patch("/event/:eventId", decodeToken, updateEvent);

module.exports = router
