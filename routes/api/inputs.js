const express = require('express');
const router = express.Router();
const inputController = require('../../controllers/inputs');
const authController = require('../../middleware/auth');

router.post('/', authController, inputController.addExpenseCategory);
router.get('/', authController, inputController.getExpenseCategory);

module.exports = router;