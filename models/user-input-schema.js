const mongoose = require('mongoose');

const userInputSchema = mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'expenseTimeCategory'
    },
    categories: [{
        type: String
    }],
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