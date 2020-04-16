const express = require('express');
const router = express.Router();

const { isSignedIn , isAuthenticated, isAdmin } = require('../controllers/auth');
const {getUserById, getUser, updateUser, userPurchaseList} = require('../controllers/user');
const { getProductById, createProduct } = require('../controllers/products');

router.param('productId', getProductById);
router.param('userId', getUserById);

router.post('/product/create/:userId', isSignedIn, isAuthenticated, isAdmin, createProduct);

module.exports = router;