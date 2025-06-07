const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { checkToken } = require("../controllers/authController");

// Kiểm tra token trước khi xử lý request
router.get("/check-token", authMiddleware, checkToken);

module.exports = router;
