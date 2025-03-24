const express = require("express");
const { sendMailController } = require("../controllers/emailController");

const router = express.Router();

router.post("/send", sendMailController);

module.exports = router;

