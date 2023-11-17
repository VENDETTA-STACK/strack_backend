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
                return res.status(200).json({
                    IsSuccess: true, 
                    Count: expenses.length,
                    Data: expenses, 
                    Message: 'Expense and time categories found' 
                });
            } else {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'No expense category found' });
            }
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    },

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

            if (params.preference === undefined || params.preference === null || params.preference === '') {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Preference is required parameter' });
            }

            if (params.preference.length === 0) {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Preference is required list of categoryId and theire price parameter' });
            }

            let userPreference = [];

            for (let i in params.preference) {
                const category = params.preference[i];
                
                if (category) {
                    let checkCategoryExist = await inputServices.getExpenseCategoryById(category.categoryId); 

                    if (checkCategoryExist) {
                        userPreference.push(params.preference[i]);
                    }
                }
            }

            params.userPreference = userPreference;

            let userExistPreference  = await inputServices.getPreferencesByUserId(params.userId);

            if (userExistPreference.length > 0) {
                params.preferenceId = userExistPreference[0]._id;

                let editPreference = await inputServices.editUserPreference(params);

                if (editPreference) {
                    return res.status(200).json({ IsSuccess: true, Data: editPreference, Message: 'User preference updated' });
                } else {
                    return res.status(400).json({ IsSuccess: false, Data: [], Message: 'User preference not updated' });
                }
            } else {
                let addPreference = await inputServices.addPreference(params);

                if (addPreference) {
                    return res.status(200).json({ IsSuccess: true, Data: [addPreference], Message: 'User preference added' });
                } else {
                    return res.status(400).json({ IsSuccess: false, Data: [], Message: 'User preference not added' });
                }
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
                return res.status(200).json({ IsSuccess: true, Data: 1, Message: 'User preference deleted' });
            } else {
                return res.status(400).json({ IsSuccess: false, Data: 0, Message: 'No user preference found' }); 
            }
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    },

    addUserSpendings: async (req, res, next) => {
        try {
            let params = req.body;

            if (params.userId === undefined || params.userId === null || params.userId === '') {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Please provide userId parameter' });
            }

            if (params.categoryId === undefined || params.categoryId === null || params.categoryId === '') {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Please provide categoryId parameter' });
            }

            if (params.isTime) {
                if (params.fromTime === undefined || params.fromTime === null || params.fromTime === '') {
                    return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Please provide fromTime parameter' });
                }
    
                if (params.toTime === undefined || params.toTime === null || params.toTime === '') {
                    return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Please provide toTime parameter' });
                }
            } else {
                if (params.price === undefined || params.price === null || params.price === '') {
                    return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Please provide price parameter' });
                }
            }

            let addSpendingData = await inputServices.addUserSpendings(params);

            if (addSpendingData) {
                return res.status(200).json({ IsSuccess: true, Data: [addSpendingData], Message: 'User spending added' });
            } else {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'User spending not added' });
            }
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    },

    getUserAllSpendings: async (req, res, next) => {
        try {
            const userId = req.params.userId;

            let spendings = await inputServices.getUserSpendings(userId);

            if (spendings.length > 0) {
                return res.status(200).json({ IsSuccess: true, Data: spendings, Message: 'User spendings found' }); 
            } else {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'User spendings not found' });
            }
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    },

    editUserSpendings: async (req, res, next) => {
        try {
            let params = req.body;

            if (params.spendingId === undefined || params.spendingId === null || params.spendingId === '') {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Please provide spendingId parameter' });
            }

            if (params.isTime) {
                if (params.fromTime === undefined || params.fromTime === null || params.fromTime === '') {
                    return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Please provide fromTime parameter' });
                }
    
                if (params.toTime === undefined || params.toTime === null || params.toTime === '') {
                    return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Please provide toTime parameter' });
                }
            } else {
                if (params.price === undefined || params.price === null || params.price === '') {
                    return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Please provide price parameter' });
                }
            }

            let checkExist = await inputServices.getUserSpendingById(params.spendingId);

            if (checkExist) {
                let editSpendingData = await inputServices.editUserSpendings(params);

                if (editSpendingData) {
                    return res.status(200).json({ IsSuccess: true, Data: [editSpendingData], Message: 'User spending updated' });
                } else {
                    return res.status(400).json({ IsSuccess: false, Data: [], Message: 'User spending not updated' });
                }
            } else {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'No Spending record found' });
            }
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    },

    deleteUserSpendings: async (req, res, next) => {
        try {
            const spendingId = req.params.id;

            let checkExistPreference = await inputServices.getPreferenceById(spendingId);

            if (checkExistPreference) {
                await inputServices.deleteUserSpending(spendingId);
                return res.status(200).json({ IsSuccess: true, Data: 1, Message: 'User preference deleted' });
            } else {
                return res.status(400).json({ IsSuccess: false, Data: 0, Message: 'No user preference found' }); 
            }
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    },
}