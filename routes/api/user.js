const express = require('express');
const router = express.Router();

const userController = require('../../controllers/user');
//const authController = require('../../middleware/auth');

router.post('/', userController.signUpUser);
router.post('/login', userController.signInUser);
router.get('/', userController.getUserById);
router.put('/', userController.editUserProfileDetails);
router.put('/resetPassword', userController.forgetPassword);

module.exports = router;