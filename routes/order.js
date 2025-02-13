const express = require('express');
const router = express.Router();
const { requireSignIn, isAuth, isAdmin } = require('../controllers/auth');
const { userById, addOrderToUserHistory } = require('../controllers/user');
const {
  create,
  listOrders,
  getStatusValues,
  updateOrderStatus,
  orderById,
} = require('../controllers/order');
const { decreaseQuantity } = require('../controllers/product');

//controllers
router.post(
  '/order/create/:userId',
  requireSignIn,
  isAuth,
  addOrderToUserHistory,
  decreaseQuantity,
  create
  //   when ever a order is created it is added to the user history
);
router.get('/order/list/:userId', requireSignIn, isAuth, isAdmin, listOrders);
router.get(
  '/order/status-values/:userId',
  requireSignIn,
  isAuth,
  isAdmin,
  getStatusValues
);
router.put(
  '/order/:orderId/status/:userId',
  requireSignIn,
  isAuth,
  isAdmin,
  updateOrderStatus
);

//middlewares
router.param('userId', userById);
router.param('orderId', orderById);

module.exports = router;
