const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId
    }
});

module.exports = mongoose.model('reports', reportSchema);