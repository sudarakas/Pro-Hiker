const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

//Generate the token
const signTokenGenerator = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  //Set the model values
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
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
  //Check the email & password entered
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  //Check the login details with db
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid email or password!', 401));
  }
  //Send the jwt token to client
  const token = signTokenGenerator(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //Get the token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  //Check the token is exits in request
  if (!token) {
    return next(
      new AppError('You are not signed in! Please sign in to get access.', 401)
    );
  }

  //Verify the jwt token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //Check the user exists
  const currentUser = await User.findById(decoded.id); //check the user id is exists.
  if (!currentUser) {
    return next(
      new AppError('User does not exist! Please sign up to get access.', 401)
    );
  }

  //Check the user password with the token(if changed)
  if (currentUser.changePassowrdAfter(decoded.iat)) {
    return next(
      new AppError('You are using an older password! Please sign in agian', 401)
    );
  }

  //Grant access to protected route
  req.user = currentUser;
  next();
});

//Restrict the access permissions
exports.restrictTo = (...roles) => {
  //roles ['admin', 'guide']
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

//Forget password and send reset token
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //Get the user from email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with the email address', 404));
  }

  //Generate the random reset token
  const resetToken = user.createPasswordResetToken();

  //Update the user model with the reset token info
  await user.save({ validateBeforeSave: false });

  //Send the token to user email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `You have requested a password request!. Please follo the 
  passowrd reset link to recover your password. Reset Link: ${resetURL}. 
  If you are not requested this, ignore this message.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'ProHiker Acccount - Passwrod Reset',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token has been sent',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There is an error sending the email. Try again!', 500)
    );
  }
});

//Reset the user password
exports.resetPassword = (req, res, next) => {};
