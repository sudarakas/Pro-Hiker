const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//Apply auth middleware
router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser);
router.patch('/updatePassword', authController.updatePassword);
router.patch('/updateProfile', userController.updateProfile);
router.delete('/deleteProfile', userController.deleteProfile);

//Allow for admin users
router.use(authController.restrictTo('admin'));

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
