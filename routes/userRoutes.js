const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser
);

router.patch(
  '/updateProfile',
  authController.protect,
  userController.updateProfile
);
router.delete(
  '/deleteProfile',
  authController.protect,
  userController.deleteProfile
);

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
