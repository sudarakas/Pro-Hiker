const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const authontroller = require('../controllers/authController');

router.post('/signup', authontroller.signup);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
