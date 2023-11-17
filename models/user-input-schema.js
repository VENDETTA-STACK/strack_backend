const mongoose = require('mongoose');

const userInputSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'expenseTimeCategory'
    },
    categories: [{
        type: String
    }],
    isTime: {
        type: Boolean,
        require: true
    },
    text: {
        type: String
    },
    fromTime: {
        type: String
    },
    toTime: {
        type: String
    },
    price: {
        type: Number
    },
    image: {
        type: String
    }
});

module.exports = mongoose.model('userInputs', userInputSchema);