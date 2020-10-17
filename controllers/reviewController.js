const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');

//Get all reviews
exports.getAllReviews = catchAsync(async (req, res, next) => {
  //Create the filter
  let filter = {};
  //If req URL contains a hike id, filter hike
  if (req.params.hikeId) filter = { hike: req.params.hikeId };
  //Apply the filter
  const reviews = await Review.find(filter);

  //Send the response
  res.status(200).json({
    status: 'success',
    result: reviews.length,
    data: {
      reviews: reviews,
    },
  });
});

exports.setHikeUserIds = (req, res, next) => {
  //Allow nested routes
  //Set the hike from the params if the id is not available in body
  if (!req.body.hike) req.body.hike = req.params.hikeId;
  //Set the user from the params if the id is not available in body
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

//Create new review
exports.createReview = handlerFactory.createOne(Review);
//Update Review
exports.updateReview = handlerFactory.updateOne(Review);
//Delete Review
exports.deleteReview = handlerFactory.deleteOne(Review);
