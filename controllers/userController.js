const User = require('../models/userModel');
//const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObject = (object, ...fields) => {
  const updatedObject = {};
  Object.keys(object).forEach((element) => {
    if (fields.includes(element)) updatedObject[element] = object[element];
  });
  return updatedObject;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const hikes = await User.find();

  //send the response
  res.status(200).json({
    status: 'success',
    result: hikes.length,
    data: {
      hikes: hikes,
    },
  });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  //Reject update password data
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError('Request can not be completed. Please try again!', 400)
    );

  //Filter the user object
  const filteredBody = filterObject(req.body, 'name', 'email');
  //Get the user from the user id and update
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  //Send the response
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'Server Issue',
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'Server Issue',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'Server Issue',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Server Issue',
  });
};
