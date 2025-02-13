const express = require('express');
const router = express.Router();
const {
  create,
  categoryById,
  read,
  update,
  remove,
  list,
} = require('../controllers/category');
const { userSignUpValidator } = require('../validator/index');
const { requireSignIn, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

// Category Routes
router.post('/category/create/:userId', requireSignIn, isAuth, isAdmin, create);
router.put(
  '/category/:categoryId/:userId',
  requireSignIn,
  isAuth,
  isAdmin,
  update
);
router.delete(
  '/category/:categoryId/:userId',
  requireSignIn,
  isAuth,
  isAdmin,
  remove
);
router.get('/category/:categoryId', read);
router.get('/categories', list);

router.param('userId', userById);
router.param('categoryId', categoryById);

module.exports = router;
