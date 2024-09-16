const express = require('express');
const productsController = require('../controllers/productcontroller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const uploadProductImage = require('../middleware/uploadProductImage');
const router = express.Router();


router.post('/create', authenticate, authorize(['seller', 'admin']),uploadProductImage , productsController.addProduct);
router.patch('/updateproducts/:productId', authenticate, authorize(['seller', 'admin']), productsController.updateProduct);
router.delete('/products/:id', authenticate, authorize(['seller', 'admin']), productsController.deleteProduct);

router.get('/', productsController.getAllProducts); 
router.get('/products/:id', productsController.getProductById); 


module.exports = router;
