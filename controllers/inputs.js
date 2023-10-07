const expenseTimeCategories = require('../models/expense-time-categories');
const inputServices = require('../services/inputs');

module.exports = {
    addExpenseCategory: async (req, res, next) => {
        try {
            const params = req.body;
            let addCategory = await inputServices.addExpenseCategory(params);

            if (addCategory) {
                return res.status(200).json({ IsSuccess: true, Data: [addCategory], Message: `${params.expenseName} category added` });
            } else {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Category not added' });
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
    }
}