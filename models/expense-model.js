const mongoose = require('mongoose');

const expenseModel = mongoose.Schema({
    name: {
        type: String,
    },
    Category: {
        type: String
    },
    Cost: {
        type: String
    },
    Date: {
        type: String
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('expenseModel', expenseModel);