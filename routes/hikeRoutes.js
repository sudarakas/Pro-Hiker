const express = require('express');

const router = express.Router();
const hikeController = require('../controllers/hikeController');
const authController = require('../controllers/authController');

//can use this type middleware to validate id
// router.param('id', checkHikeId);

router
  .route('/top-5-cheap')
  .get(hikeController.aliastopHikes, hikeController.getAllHikes);

router.route('/hike-stats').get(hikeController.getHikeStats);

router.route('/monthy-plan/:year').get(hikeController.getMonthyPlan);

router
  .route('/')
  .get(authController.protect, hikeController.getAllHikes)
  .post(hikeController.createHike);

router
  .route('/:id')
  .get(hikeController.getHike)
  .patch(hikeController.updateHike)
  .delete(hikeController.deleteHike);

module.exports = router;
