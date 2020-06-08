const express = require('express');
const router = express.Router();
const {
  create,
  productById,
  read,
  remove,
  update,
  list,
  listRelated,
  listCategories,
  listBySearch,
  listSearch,
  photo,
} = require('../controllers/product');
const { userSignUpValidator } = require('../validator/index');
const { requireSignIn, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

// routes
router.post('/product/create/:userId', requireSignIn, isAuth, isAdmin, create);
router.get('/product/:productId', read);
router.delete(
  '/product/:productId/:userId',
  requireSignIn,
  isAuth,
  isAdmin,
  remove
);
router.put(
  '/product/:productId/:userId',
  requireSignIn,
  isAuth,
  isAdmin,
  update
);
router.param('userId', userById);
router.param('productId', productById);

//Sending products with queries
router.get('/products', list); // get list of all the products in the database based on query params
router.get('/products/related/:productId', listRelated); // route to get related products based on a single product ID.
router.get('/products/categories', listCategories); // route to return all the categories based on products
router.post('/products/by/search', listBySearch); // products by search
router.get('/products/search', listSearch); // get the products based on query from the search bar
router.get('/product/photo/:productId', photo); // get product Photo

module.exports = router;
