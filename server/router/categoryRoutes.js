const express = require("express")
const router = express.Router()
const { decodeToken } = require("../middleware/authMiddleware")
const {
	addCategory,
	deleteCategory,
	patchCategory,
	restoreCategory,
} = require("../controllers/categoryController")

router.post("/category", decodeToken, addCategory)
router.post("/restoreCategory", decodeToken, restoreCategory)
router.delete("/category/:id", decodeToken, deleteCategory)
router.patch("/category/:id", decodeToken, patchCategory)

module.exports = router
