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

//Avoide duplicate entries from same user
reviewScheme.index({ hike: 1, user: 1 }, { unique: true });

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

  //Handling the no review for Hike
  if (stats.length < 0) {
    await Hike.findByIdAndUpdate(hikeId, {
      ratingQty: stats[0].noRating,
      ratingAverage: stats[0].avgRating,
    });
  } else {
    await Hike.findByIdAndUpdate(hikeId, {
      ratingQty: 0,
      ratingAverage: 0,
    });
  }
};

//Update the review with rating average
reviewScheme.post('save', function () {
  this.constructor.calcAverageRating(this.hike);
});

//Get the update & delete review and pass it using this
reviewScheme.pre(/^findOneAnd/, async function (next) {
  this.currentReview = await this.findOne();
  next();
});

//Update the average rating after updating or deleting reviews
reviewScheme.post(/^findOneAnd/, async function () {
  await this.currentReview.constructor.calcAverageRating(
    this.currentReview.hike
  );
});

//Create the model with scheme
const Review = mongoose.model('Review', reviewScheme);

module.exports = Review;
