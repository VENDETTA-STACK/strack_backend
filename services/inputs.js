const expense_time_categories = require('../models/expense-time-categories');

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
    }
}