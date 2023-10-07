const express = require('express');
const router = express.Router();

const userRoute = require('./user');
const inputRoute = require('./inputs');

router.use('/user', userRoute);
router.use('/inputs', inputRoute);

module.exports = router;