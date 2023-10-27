const express = require('express');
const router = express.Router();
const inputController = require('../../controllers/inputs');
const authController = require('../../middleware/auth');

router.post('/', inputController.addExpenseCategory);
router.get('/', inputController.getExpenseCategory);

module.exports = router;