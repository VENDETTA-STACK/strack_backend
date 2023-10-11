const express = require('express');
const router = express.Router();

const userController = require('../../controllers/user');

router.post('/', userController.signUpUser);
router.post('/login', userController.signInUser);
router.get('/', userController.getUserById);
router.put('/', userController.editUserProfileDetails);

module.exports = router;