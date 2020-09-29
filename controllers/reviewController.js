const Review = require('../models/reviewModel');
//const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
//const AppError = require('../utils/appError');

//Get all reviews
exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  //Send the response
  res.status(200).json({
    status: 'success',
    result: reviews.length,
    data: {
      reviews: reviews,
    },
  });
});

//Create new review
exports.createReview = catchAsync(async (req, res, next) => {
  //Allow nested routes
  //Set the hike from the params if the id is not available in body
  if (!req.body.hike) req.body.hike = req.params.hikeId;
  //Set the user from the params if the id is not available in body
  if (!req.body.user) req.body.user = req.user.id;
  const newReview = await Review.create(req.body);

  //Send the response
  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});
