const User = require('../models/userModel');
//const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

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
