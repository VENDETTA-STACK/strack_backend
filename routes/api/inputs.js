const express = require('express');
const router = express.Router();
const inputController = require('../../controllers/inputs');
//const authController = require('../../middleware/auth');

//Add and get expense & time categories
router.post('/', inputController.addExpenseCategory);
router.get('/', inputController.getExpenseCategory);

//User Preferences
router.post('/preference', inputController.addUserPreferences);
router.get('/preference/:id', inputController.getAllUserPreferences);
router.put('/preference', inputController.editUserPreference);
router.delete('/preference/:id', inputController.deleteUserPreference);

//Add initial questionnaire
router.post('/question', inputController.addInitialQuestionnaire);
router.get('/question', inputController.getInitialQuestionnaire);

module.exports = router;