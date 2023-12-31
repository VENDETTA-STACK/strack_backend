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

//Add User Expense and Time
router.post('/spending', inputController.addUserSpendings);
router.get('/spending/:userId', inputController.getUserAllSpendings);
router.put('/spending', inputController.editUserSpendings);
router.delete('/spending/:id', inputController.deleteUserSpendings);

//Add initial questionnaire
router.post('/question', inputController.addInitialQuestionnaire);
router.get('/question', inputController.getInitialQuestionnaire);

router.post('/report', inputController.getUserReports);

module.exports = router;