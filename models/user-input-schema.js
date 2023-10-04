const mongoose = require('mongoose');

const userInputSchema = mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'expenseTimeCategory'
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