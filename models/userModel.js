const mongoose = require('mongoose');
const validator = require('validator');

const userScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
    },
    email: {
      type: String,
      required: [true, 'Please enter your name email address'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please enter a valid email address'],
    },
    photo: {
      type: String,
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: [8, 'Password must have more or equal than 8 characters'],
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please enter confirm password'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//export the user model
const User = mongoose.model('User', userScheme);
module.exports = User;
