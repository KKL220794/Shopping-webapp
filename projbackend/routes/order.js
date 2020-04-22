const express = require('express');
const router = express.Router();

const { isSignedIn , isAuthenticated, isAdmin } = require('../controllers/auth');
const {getUserById, getUser, updateUser, userPurchaseList, pushProductToPurchaseList} = require('../controllers/user');
const {getOrderById, createOrder, getAllOrder, getOrderStatus, updateStatus}  = require('../controllers/order')
const {updateStock}  = require('../controllers/products')


router.param("userId", getUserById);
router.param("orderId", getOrderById);

router.post('/order/create/:userId', isSignedIn, isAuthenticated,pushProductToPurchaseList,updateStock, createOrder);
router.get('/order/all/:userId', isSignedIn, isAuthenticated, isAdmin, getAllOrder);

router.get('/order/status/:userId', isSignedIn, isAuthenticated, isAdmin, getOrderStatus);
router.put('/order/:orderId/status/:userId',isSignedIn, isAuthenticated, isAdmin, updateStatus);

module.exports = router;