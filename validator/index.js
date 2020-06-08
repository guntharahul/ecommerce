exports.userSignUpValidator = (req, res, next) => {
  req.check('name', 'Name is required').exists().notEmpty().isString();
  req
    .check('email', 'Email must be 7 to 32 characters')
    .notEmpty()
    .withMessage('Email is required')
    .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    .withMessage('Please fill a valid email address')
    .isLength({
      min: 7,
      max: 32,
    });
  req.check('password', 'Password is required').notEmpty();
  req
    .check('password')
    .isLength({
      min: 8,
    })
    .withMessage('Password must contain at least 8 characters')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/, 'i')
    .withMessage(
      'Please enter a password at least 8 character and contain at least one uppercase, at least one lower case, at least one special character. '
    );
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({
      error: firstError,
    });
  }
  next();
};
