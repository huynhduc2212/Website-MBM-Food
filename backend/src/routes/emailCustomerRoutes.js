const express = require("express");
const { sendEmailController } = require("../controllers/emailCustomerController");

const router = express.Router();

router.post("/send-email", sendEmailController);

module.exports = router;
