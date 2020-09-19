const express = require('express');

const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

router
  .route('/')
  .get(authController.protect, reviewController.getAllReviews)
  .post(authController.protect, reviewController.createReview);

module.exports = router;
