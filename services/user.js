const userModel = require('../models/user-schema');
const moment = require('moment-timezone');
const bcrypt = require('bcrypt');
const otpGenerator = (len) => Math.floor(10 ** (len - 1) + Math.random() * (10 ** len - 10 ** (len - 1) - 1));

module.exports = {
    registerUser: async (params) => {

        const OTP = otpGenerator(4);

        let addNewUser = await new userModel({
            firstName: params.firstName,
            lastName: params.lastName,
            email: params.email,
            contactNumber: {
                countryCode: params.countryCode,
                mobileNo: params.mobileNo
            },
            birthDate: moment.utc(params.birthDate),
            password: params.password,
            OTP
        });

        if (addNewUser != null) {
            await addNewUser.save();
            return addNewUser;
        } else {
            return undefined;
        }
    },

    loginUser: async (params) => {
        let findUserWithContactNumber = await userModel.find({ 
            'contactNumber.countryCode': params.countryCode,
            'contactNumber.mobileNo': params.mobileNo
        });

        if (findUserWithContactNumber.length === 1) {
            return findUserWithContactNumber[0];
        } else {
            return undefined;
        }
    },

    getUserById: async (userId) => {
        let user = await userModel.findById(userId);

        return user;;
    }
}