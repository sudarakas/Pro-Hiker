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
    role: {
      type: String,
      enum: ['user', 'guide', 'lead-guide', 'admin'],
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: [8, 'Password must have more or equal than 8 characters'],
      select: false,
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
    passwordChangedAt: {
      type: Date,
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

userScheme.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userScheme.methods.changePassowrdAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changeTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    ); // convert the date to timestamp (in seconds)

    //If password has been changed after token generation
    return JWTTimestamp < changeTimestamp;
  }
  //If password is not changed
  return false;
};

//export the user model
const User = mongoose.model('User', userScheme);
module.exports = User;
