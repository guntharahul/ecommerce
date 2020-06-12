const express = require('express');
const router = express.Router();
const {
  userById,
  read,
  update,
  purchaseHistory,
} = require('../controllers/user');
const { requireSignIn, isAdmin, isAuth } = require('../controllers/auth');

// routes to get admin profile
router.get('/secret/:userId', requireSignIn, isAuth, isAdmin, (req, res) => {
  res.json({
    user: req.profile,
  });
});
router.get('/user/:userId', requireSignIn, isAuth, read); // get user profile with his ID
router.get('/orders/by/user/:userId', requireSignIn, isAuth, purchaseHistory);
router.put('/user/:userId', requireSignIn, isAuth, update); // Update user profile with his ID

router.param('userId', userById);
router.param('userId', userById);
module.exports = router;
