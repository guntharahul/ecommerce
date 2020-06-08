const User = require('../models/user');
const jwt = require('jsonwebtoken'); // to generate signed token
const expressJwt = require('express-jwt'); // for authorization check
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.signup = (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err),
      });
    }
    user.salt = undefined;
    user.hashed_password = undefined;
    res.json({ user });
  });
};

exports.signin = (req, res) => {
  console.log(req.body);
  // find the user in DB based on Email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        err: 'User with that email does not exist, Please Sign Up',
      });
    }
    // if user is found make sure email and password is matched
    // created authenticate method in user model

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: 'Email and password did not match',
      });
    }

    //generate a signed Token with used Id and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    // persist the token  as 't' in cookie with expiry date.
    res.cookie('token', token, { expiry: new Date() + 9999 });
    //return response with user and token to front-end
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, email, name, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Signout success' });
};

exports.requireSignIn = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'auth',
});

//is normal User (to deny other users for accessing different profiles)
exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({
      error: 'Access Denied',
    });
  }
  next();
};

// is Admin (Middleware for which only admin can access the routes)
exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: 'Admin resource! Access Denied',
    });
  }
  next();
};
