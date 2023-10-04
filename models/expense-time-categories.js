const mongoose = require('mongoose');

const expense_time_categories = mongoose.Schema({
    expenseName: {
        type: String
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('expenseTimeCategory', expense_time_categories);