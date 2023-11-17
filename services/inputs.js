const expense_time_categories = require('../models/expense-time-categories');
const questionModel = require('../models/questions-schema');
const userPreferenceModel = require('../models/user-preferences');

module.exports = {
    addExpenseCategory: async (params) => {
        const addCategory = await new expense_time_categories({
            expenseName: params.expenseName
        });

        if (addCategory != null) {
            await addCategory.save();
            return addCategory;
        } else {
            return false;
        }
    },
    
    getExpenseCategory: async () => {
        const expenseCategories = await expense_time_categories.find();

        return expenseCategories;
    },

    getExpenseCategoryById: async (categoryId) => {
        const expenseCategory = await expense_time_categories.findById(categoryId);

        return expenseCategory;
    },

    getExpenseCategoryByName: async (categoryName) => {
        const query = {
            expenseName: {
              $regex: new RegExp(categoryName, 'i')
            }
          };
        const expenseCategory = await expense_time_categories.find(query);

        return expenseCategory;
    },

    addIntialQuestionnaire: async (params) => {
        let addQuestion = await new questionModel({
            question: params.question
        });

        if (addQuestion != null) {
            await addQuestion.save();
            return addQuestion;
        } else {
            return undefined;
        }
    },

    getQuestions: async () => {
        let questions = await questionModel.find();

        if (questions.length) {
            return questions
        } else {
            return [];
        }
    },

    addPreference: async (params) => {
        let addNewPreference = await new userPreferenceModel({
            userId: params.userId,
            preference: params.userPreference
        });

        if (addNewPreference) {
            return addNewPreference.save();
        } else {
            return undefined;
        }
    },

    getPreferencesByUserId: async (userId) => {
        let getPreferences = await userPreferenceModel.find({ userId });

        return getPreferences;
    },

    getAllUserPreferences: async (userId) => {
        let getPreferences = await userPreferenceModel.find({ userId })
                                                      .populate({
                                                        path: 'preference.categoryId'
                                                      });

        return getPreferences;
    },

    getPreferenceById: async (preferenceId) => {
        let getPreference = await userPreferenceModel.findById(preferenceId);

        return getPreference;
    },

    editUserPreference: async (params) => {
        let update = {
            categoryId: params.categoryId,
            preference: params.userPreference
        };

        let updateUserPreference = await userPreferenceModel.findByIdAndUpdate(params.preferenceId, update, { new: true });

        if (updateUserPreference) {
            return updateUserPreference;
        } else {
            return undefined;
        }
    },

    deleteUserPreference: async (preferenceId) => {
        let deletePreferenceId = await userPreferenceModel.findByIdAndDelete(preferenceId);

        return true;
    }
}