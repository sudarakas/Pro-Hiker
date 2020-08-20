const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

//generate the token
const signTokenGenerator = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  //set the model values
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signTokenGenerator(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //check the email & password entered
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  //check the login details with db
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid email or password!', 401));
  }
  //send the jwt token to client
  const token = signTokenGenerator(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //get the token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  //check the token is exits in request
  if (!token) {
    return next(
      new AppError('You are not signed in! Please sign in to get access.', 401)
    );
  }

  //verify the jwt token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //check the user exists
  const refreshUser = await User.findById(decoded.id); //check the user id is exists.
  if (!refreshUser) {
    return next(
      new AppError('User does not exist! Please sign up to get access.', 401)
    );
  }

  //check the user password with the token(if changed)
  next();
});
