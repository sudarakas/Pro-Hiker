const Review = require('../models/reviewModel');
const handlerFactory = require('./handlerFactory');

exports.setHikeUserIds = (req, res, next) => {
  //Allow nested routes
  //Set the hike from the params if the id is not available in body
  if (!req.body.hike) req.body.hike = req.params.hikeId;
  //Set the user from the params if the id is not available in body
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

//Get all reviews
exports.getAllReviews = handlerFactory.getAll(Review);
//Get Review
exports.getReview = handlerFactory.getOne(Review);
//Create new review
exports.createReview = handlerFactory.createOne(Review);
//Update Review
exports.updateReview = handlerFactory.updateOne(Review);
//Delete Review
exports.deleteReview = handlerFactory.deleteOne(Review);
