const express = require("express");
const {
  createRegister,
  getAllRegisters,
  getRegisterById,
  getRegistersByUser,
  updateRegisterStatus,
} = require("../controllers/registerController");

const router = express.Router();

router.post("/", createRegister);

router.get("/", getAllRegisters);

router.get("/:id", getRegisterById);

router.get("/user/:userId", getRegistersByUser);

router.put("/:id/status", updateRegisterStatus);

module.exports = router;
