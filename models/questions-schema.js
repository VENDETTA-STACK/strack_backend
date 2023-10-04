const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    question: {
        type: String
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model('questions', questionSchema);