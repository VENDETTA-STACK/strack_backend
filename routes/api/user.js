const express = require('express');
const router = express.Router();

const userController = require('../../controllers/user');
const authController = require('../../middleware/auth');

router.post('/', authController, userController.signUpUser);
router.post('/login', authController, userController.signInUser);
router.get('/', authController, userController.getUserById);
router.put('/', authController, userController.editUserProfileDetails);
router.put('/resetPassword', userController.forgetPassword);

module.exports = router;