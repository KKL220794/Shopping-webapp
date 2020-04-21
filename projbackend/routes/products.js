const express = require('express');
const router = express.Router();

const { isSignedIn , isAuthenticated, isAdmin } = require('../controllers/auth');
const {getUserById, getUser, updateUser, userPurchaseList} = require('../controllers/user');
const { getProductById, createProduct, getProduct, photo, updateProduct, deleteProduct, getAllProducts, uniqueCategory } = require('../controllers/products');

router.param('productId', getProductById);
router.param('userId', getUserById);

router.post('/product/create/:userId', isSignedIn, isAuthenticated, isAdmin, createProduct);

//update product
router.put('/product/:productId/:userId', isSignedIn, isAuthenticated, isAdmin, updateProduct);

//delete product
router.delete('/product/productId/:userId', isSignedIn, isAuthenticated, isAdmin, deleteProduct);

//listing product

router.get('/product/:productId', getProduct)
router.get('/product/photo/:productId', photo)
router.get('/products', getAllProducts)
router.get('/products/category', uniqueCategory)

module.exports = router;