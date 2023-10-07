const expense_time_categories = require('../models/expense-time-categories');
const questionModel = require('../models/questions-schema');

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
    }
}