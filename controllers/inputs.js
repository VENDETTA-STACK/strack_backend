const expenseTimeCategories = require('../models/expense-time-categories');
const inputServices = require('../services/inputs');

module.exports = {
    addExpenseCategory: async (req, res, next) => {
        try {
            const params = req.body;

            if (params.expenseName === undefined || params.expenseName === null || params.expenseName === '') {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Please provide expenseName parameter' });
            }

            let checkExist = await inputServices.getExpenseCategoryByName(params.expenseName);

            if (checkExist.length) {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Category already exist' });
            } else {
                let addCategory = await inputServices.addExpenseCategory(params);

                if (addCategory) {
                    return res.status(200).json({ IsSuccess: true, Data: [addCategory], Message: `${params.expenseName} category added` });
                } else {
                    return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Category not added' });
                }
            }
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    },

    getExpenseCategory: async (req, res, next) => {
        try {
            const expenses = await inputServices.getExpenseCategory();

            if (expenses && expenses.length) {
                return res.status(200).json({ IsSuccess: true, Data: expenses, Message: 'Expense and time categories found' });
            } else {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'No expense category found' });
            }
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    },

    // editExpenseCategory: async (req, res, next) => {
    //     try {
            
    //     } catch (error) {
    //         return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
    //     }
    // }

    addInitialQuestionnaire: async (req, res, next) => {
        try {
            const params = req.body;

            if (params.question === undefined || params.question === null || params.question === '') {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Please provide question parameter' });
            }

            let addQuestion = await inputServices.addIntialQuestionnaire(params);

            if (addQuestion) {
                return res.status(200).json({ IsSuccess: true, Data: [addQuestion], Message: 'Question added' });
            } else {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Question not added' });
            }
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    },

    getInitialQuestionnaire: async (req, res, next) => {
        try {
            let questions = await inputServices.getQuestions();

            if (questions.length) {
                return res.status(200).json({ IsSuccess: true, Data: questions, Message: 'Questionnaire found' });
            } else {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'No questionnaire found' });
            }
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    },

    addUserPreferences: async (req, res, next) => {
        try {
            const params = req.body;

            if (params.userId === undefined || params.userId === null || params.userId === '') {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Preference userId is required parameter' });
            }

            if (params.categoryId === undefined || params.categoryId === null || params.categoryId === '') {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Preference categoryId is required parameter' });
            }

            if (params.price === undefined || params.price === null || params.price === '') {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Preference price is required parameter' });
            }

            let checkExist = await inputServices.getExpenseCategoryById(params.categoryId);

            if (checkExist) {
                params.categoryName = checkExist.expenseName;
                let addPreference = await inputServices.addPreference(params);

                if (addPreference) {
                    return res.status(200).json({ IsSuccess: true, Data: [addPreference], Message: 'User preference added' });
                } else {
                    return res.status(400).json({ IsSuccess: false, Data: [], Message: 'User preference not added' });
                }
            } else {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'No expense category found' });
            }
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    },

    getAllUserPreferences: async (req, res, next) => {
        try {
            const userId = req.params.id;
            let preferences = await inputServices.getAllUserPreferences(userId);

            if (preferences.length) {
                return res.status(200).json({ IsSuccess: true, Data: preferences, Message: 'User preferences found' });
            } else {
                return res.status(200).json({ IsSuccess: true, Data: [], Message: 'No user preferences found' });
            }
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    },

    editUserPreference: async (req, res, next) => {
        try {
            const params = req.body;

            if (params.preferenceId === undefined || params.preferenceId === null || params.preferenceId === '') {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'User preferenceId is required parameter' });
            }

            if (params.categoryId === undefined || params.categoryId === null || params.categoryId === '') {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Preference categoryId is required parameter' });
            }

            if (params.price === undefined || params.price === null || params.price === '') {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Preference price is required parameter' });
            }

            let checkExistPreference = await inputServices.getPreferenceById(params.preferenceId);

            if (checkExistPreference) {
                let checkExistCategory = await inputServices.getExpenseCategoryById(params.categoryId);

                if (checkExistCategory) {
                    let editPreference = await inputServices.editUserPreference(params);

                    if (editPreference) {
                        return res.status(200).json({ IsSuccess: true, Data: editPreference, Message: 'User preference updated' });
                    } else {
                        return res.status(400).json({ IsSuccess: false, Data: [], Message: 'User preference not updated' });
                    }
                } else {
                    return res.status(400).json({ IsSuccess: false, Data: [], Message: 'No category found on given categoryId' });
                }
                
            } else {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'No user preference found' }); 
            }
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    },

    deleteUserPreference: async (req, res, next) => {
        try {
            const preferenceId = req.params.id;

            let checkExistPreference = await inputServices.getPreferenceById(preferenceId);

            if (checkExistPreference) {
                await inputServices.deleteUserPreference(preferenceId);
                return res.status(200).json({ IsSuccess: true, Data: [], Message: 'User preference deleted' });
            } else {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'No user preference found' }); 
            }
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    }
}