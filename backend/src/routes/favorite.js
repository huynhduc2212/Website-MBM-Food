const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authenticate = require('../middleware/authenticate');

router.post('/add', authenticate, favoriteController.addFavorite);
router.get('/list', authenticate, favoriteController.getFavorites);
router.delete('/remove/:id_product', authenticate, favoriteController.removeFavorite);
router.get('/check/:id_product', authenticate, favoriteController.checkFavorite);
module.exports = router;
