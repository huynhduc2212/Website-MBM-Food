const express = require("express");
const {
  createBanner,
  getAllBanners,
  getByIdBanner,
  updateBanner,
  deleteBanner,
} = require("../controllers/bannerController");
const upload = require("../middleware/uploadImage");

const router = express.Router();

router.get("/", getAllBanners);

router.get("/:id", getByIdBanner);

router.post("/", upload.single("image"), createBanner);

router.put("/:id", upload.single("image"), updateBanner);

router.delete("/:id", deleteBanner);

module.exports = router;
