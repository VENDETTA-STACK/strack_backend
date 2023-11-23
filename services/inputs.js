const expense_time_categories = require('../models/expense-time-categories');
const questionModel = require('../models/questions-schema');
const userPreferenceModel = require('../models/user-preferences');
const userInputModel = require('../models/user-input-schema');
const moment = require('moment-timezone');

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
    },

    addUserSpendings: async (params) => {
        let addSpending = await new userInputModel({
            userId: params.userId,
            categoryId: params.categoryId,
            text: params.text,
            isTime: params.isTime,
            fromTime: params.isTime ? moment.utc(params.fromTime, 'HH:mm') : undefined,
            toTime: params.isTime ? moment.utc(params.toTime, 'HH:mm') : undefined,
            price: params.isTime === false ? params.price : undefined,
            image: params.uploadedImage
        });

        if (addSpending) {
            return addSpending.save();
        } else {
            return undefined;
        }
    },

    getUserSpendings: async (userId) => {
        let spendings = await userInputModel.find({ userId });

        let userSpendings = []

        spendings.forEach((spend) => {

            let data;
            if (spend.isTime) {
                data = {
                    _id: spend._id,
                    userId: spend.userId,
                    categoryId: spend.categoryId,
                    text: spend.text,
                    fromTime: moment.utc(spend.fromTime).format('hh:mm A'),
                    fromDate: moment.utc(spend.fromTime).format('DD/MM/YYYY'),
                    toTime: moment.utc(spend.toTime).format('hh:mm A'),
                    toDate: moment.utc(spend.toTime).format('DD/MM/YYYY'),
                    image: spend.image,
                    isTime: spend.isTime,
                }
            } else {
                data = spend;
            }

            userSpendings.push(data);
            
        });

        return userSpendings;
    },

    getUserSpendingById: async (spendingId) => {
        const spending = await userInputModel.findOne({ _id: spendingId });

        return spending;
    },

    editUserSpendings: async (params) => {
        let update = {
            categoryId: params.categoryId !== undefined && params.categoryId !== '' ? params.categoryId : undefined,
            text: params.text !== undefined && params.text !== '' ? params.text : undefined,
            fromTime: params.isTime ? moment.utc(params.fromTime, 'HH:mm').toString() : undefined,
            toTime: params.isTime ? moment.utc(params.toTime, 'HH:mm').toString() : undefined,
            price: params.isTime === false ? params.price : undefined,
            image: params.image !== undefined && params.image !== '' ? params.image : undefined
        }

        let updateUserSpending = await userInputModel.findByIdAndUpdate(params.spendingId, update, { new: true });

        if (updateUserSpending) {
            return updateUserSpending;
        } else {
            return undefined;
        }
    },

    deleteUserSpending: async (spendingId) => {
        let deleteSpending = await userInputModel.findByIdAndDelete(spendingId);

        return true;
    },
}