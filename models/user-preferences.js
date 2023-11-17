const mongoose = require('mongoose');

const userPreferenceSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    preference: [{
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'expenseTimeCategory'
        },
        price: {
            type: Number
        }
    }]
},
{
    timestamps: true
});

module.exports = mongoose.model('userPreferences', userPreferenceSchema);