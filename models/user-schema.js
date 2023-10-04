const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Firstname is mandatory field']
    },
    lastName: {
        type: String,
        required: [true, 'Firstname is mandatory field']
    },
    email: {
        type: String,
        required: [true, 'Email is mandatory field']
    },
    contactNumber: {
        countryCode: {
            type: String,
            default: ''
        },
        mobileNo: {
            type: String,
            default: ''
        },
    },
    birthDate: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        default: true
    },
    password: {
        type: String,
        required: [true, 'Password is mandatory field']
    },
},
{
    timestamps: true
});

module.exports = mongoose.model('users', userSchema);