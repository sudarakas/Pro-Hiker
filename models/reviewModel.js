const mongoose = require(`mongoose`);
const Hike = require('./hikeModel');

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

//Populating the ref field
reviewScheme.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'hike',
  //   select: 'name',
  // }).populate({
  //   path: 'user',
  //   select: 'name',
  // });

  this.populate({
    path: 'user',
    select: 'name',
  });

  next();
});

//Calculate rating average
reviewScheme.statics.calcAverageRating = async function (hikeId) {
  const stats = await this.aggregate([
    {
      $match: { hike: hikeId },
    },
    {
      $group: {
        _id: '$hike',
        noRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  await Hike.findByIdAndUpdate(hikeId, {
    ratingQty: stats[0].noRating,
    ratingAverage: stats[0].avgRating,
  });
};

//Update the review with rating average
reviewScheme.post('save', function () {
  this.constructor.calcAverageRating(this.hike);
});

//Create the model with scheme
const Review = mongoose.model('Review', reviewScheme);

module.exports = Review;
