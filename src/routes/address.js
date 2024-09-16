const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addresscontroller');
const authenticate = require('../middleware/authenticate');

router.post('/addAddress', authenticate, addressController.createAddress);
router.delete('/deleteAddress/:addressId', authenticate, addressController.deleteAddress);
router.patch('/favoriteAddress/:addressId', authenticate, addressController.FavoriteAddress);

module.exports = router;