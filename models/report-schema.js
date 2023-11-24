const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'expenseTimeCategory'
    },
    description: {
        type: String
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('reports', reportSchema);