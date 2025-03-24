const express = require("express");
const {
  getAllProducts,
  getByIdProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getByCategory,
  getBySlugProduct,
  updateStatusProduct,
  updateViewProduct,
  getAllProductsForAdmin
} = require("../controllers/productController");

const upload = require("../middleware/uploadImage");

const multerFields = [];
const MAX_VARIANTS = 10; 

for (let i = 0; i < MAX_VARIANTS; i++) {
  multerFields.push({ name: `variants[${i}][image]` });
}

const router = express.Router();

router.get('/', getAllProducts);

router.get('/admin', getAllProductsForAdmin);

router.get('/:id', getByIdProduct);

router.get('/categories/:idcate', getByCategory);

router.post('/', upload.fields(multerFields), createProduct);

router.put('/:id', upload.fields(multerFields), updateProduct);

router.delete('/:id', deleteProduct);

router.get('/slug/:slug', getBySlugProduct);

router.put('/:id/status', updateStatusProduct);

router.put('/:id/view', updateViewProduct)

module.exports = router;
