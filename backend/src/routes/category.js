const express = require("express");
const {
  getAllCategories,
  getByIdCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getBySlugCategory
} = require("../controllers/categoryController");
const upload = require("../middleware/uploadImage");

const router = express.Router();

router.get('/', getAllCategories);

router.get('/:id', getByIdCategory);
router.get('/slug/:slug', getBySlugCategory);

router.post('/',upload.single("image"), createCategory);

router.put('/:id',upload.single("image"), updateCategory);

router.delete('/:id', deleteCategory);

module.exports = router;
