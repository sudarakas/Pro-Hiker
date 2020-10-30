const express = require('express');

const router = express.Router();
const hikeController = require('../controllers/hikeController');
const authController = require('../controllers/authController');

const reviewRouter = require('./reviewRoutes');

//can use this type middleware to validate id
// router.param('id', checkHikeId);

//Nested routes - Create new review
router.use('/:hikeId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(hikeController.aliastopHikes, hikeController.getAllHikes);

router.route('/hike-stats').get(hikeController.getHikeStats);

router
  .route('/monthy-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    hikeController.getMonthyPlan
  );

router
  .route('/hike-within/:distance/center/:latlng/unit/:unit')
  .get(hikeController.getHikeWithinRange);

router.route('/distances/:latlng/unit/:unit').get(hikeController.getDistances);

router
  .route('/')
  .get(hikeController.getAllHikes)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    hikeController.createHike
  );

router
  .route('/:id')
  .get(hikeController.getHike)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    hikeController.updateHike
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    hikeController.deleteHike
  );

module.exports = router;
