const mongoose = require('mongoose');

const userPreferenceSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'expenseTimeCategory'
    },
    categoryName: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('userPreferences', userPreferenceSchema);