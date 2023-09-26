const express = require("express")
const router = express.Router()
const { decodeToken } = require("../middleware/authMiddleware")
const {
	createGroup,
	updateGroupName,
	addMembersToGroup,
	deleteGroup,
	removeMemberFromGroup,
	addItemToGroup,
	editItemInGroup,
	deleteItemFromGroup,
	checkEmailExistence,
} = require("../controllers/collaborationController")

router.get("/groups/:email", checkEmailExistence)

router.post("/groups", decodeToken, createGroup)
router.post("/groups/:groupId/members", decodeToken, addMembersToGroup)
router.post("/groups/:groupId/:category", decodeToken, addItemToGroup)

router.put("/groups/:groupId", decodeToken, updateGroupName)
router.put("/groups/:groupId/:category/:taskId", decodeToken, editItemInGroup)

router.delete("/groups/:groupId", decodeToken, deleteGroup)
router.delete(
	"/groups/:groupId/:category/:taskId",
	decodeToken,
	deleteItemFromGroup
)
router.delete("/groups/:groupId/members", decodeToken, removeMemberFromGroup)

module.exports = router
