const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
      validate: {
        validator: function (element) {
          return element === this.password;
        },
        message: 'Confirm password does not matched',
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userScheme.pre('save', async function (next) {
  //if password not modified
  if (!this.isModified('password')) return next();
  //if password is modified encrypt it
  this.password = await bcrypt.hash(this.password, 12);

  //delete the confirm password field
  this.passwordConfirm = undefined;
  next();
});

//export the user model
const User = mongoose.model('User', userScheme);
module.exports = User;
