const express = require('express');
const productsController = require('../controllers/productcontroller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = express.Router();

// router.post('/purchase', authenticate, authorize(['buyer', 'seller']), (req, res) => {
//     res.json({ message: 'Purchase successful!' });
// });

router.post('/create', authenticate, authorize(['seller', 'admin']), productsController.addProduct);
router.delete('/products/:id', authenticate, authorize(['seller', 'admin']), productsController.deleteProduct);
router.get('/', productsController.getAllProducts); 
router.get('/products/:id', productsController.getProductById); 


module.exports = router;
