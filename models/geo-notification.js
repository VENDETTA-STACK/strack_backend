const mongoose = require('mongoose');

const geoNotification = mongoose.Schema({
    title: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'expenseTimeCategory'
    },
    price: {
        type: String
    },
},
{
    timestamps: true
});

module.exports = mongoose.model('geoNotification', geoNotification);