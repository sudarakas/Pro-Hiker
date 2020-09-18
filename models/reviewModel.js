const mongoose = require(`mongoose`);
//const slugify = require(`slugify`);

const reviewScheme = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review should not be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    hike: {
      //Parent Referance
      type: mongoose.Schema.ObjectId,
      ref: 'Hike',
      required: [true, 'Review must belong to a hike.'],
    },
    user: {
      //Parent Referance
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true }, //to select the virtual objetcs
    toObject: { virtuals: true },
  }
);

//Create the model with scheme
const Review = mongoose.model('Review', reviewScheme);

module.exports = Review;
