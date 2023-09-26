const express = require("express")
const router = express.Router()
const { decodeToken } = require("../middleware/authMiddleware")
const {
	addNote,
	updateNote,
	deleteNote,
	restoreNote,
	emptyTrash,
} = require("../controllers/noteController")

router.post("/note", decodeToken, addNote)
router.patch("/note", decodeToken, updateNote)
router.delete("/note", decodeToken, deleteNote)
router.post("/restoreNote", decodeToken, restoreNote)
router.post("/emptyTrash", decodeToken, emptyTrash)

module.exports = router
