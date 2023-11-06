const mongoose = requrie('mongoose');

const userPreferenceSchema = mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'expenseTimeCategory'
    },
    categoryName: {
        type: String,
        require: true
    },
    price: {
        type: String,
        require: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('userPreferences', userPreferenceSchema);