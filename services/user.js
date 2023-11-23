const userModel = require('../models/user-schema');
const moment = require('moment-timezone');
const bcrypt = require('bcrypt');
const otpGenerator = (len) => Math.floor(10 ** (len - 1) + Math.random() * (10 ** len - 10 ** (len - 1) - 1));

module.exports = {
    registerUser: async (params) => {

        let addNewUser = await new userModel({
            firstName: params.firstName,
            lastName: params.lastName,
            email: params.email,
            contactNumber: {
                countryCode: params.countryCode,
                mobileNo: params.mobileNo
            },
            birthDate: moment.utc(params.birthDate),
            password: params.password
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

    resetPassword: async (userId, password) => {
        let update = {
            password
        };

        let updatePassword = await userModel.findByIdAndUpdate(userId, update, { new: true });

        return updatePassword;
    },

    getUserById: async (userId) => {
        let user = await userModel.findById(userId);

        return user;;
    },

    getUserByEmail: async (email) => {
        let user = await userModel.find({ email });

        return user;;
    },

    editUserProfile: async (params) => {
        let update = {
            firstName: params.firstName !== undefined && params.firstName !== '' ? params.firstName : undefined,
            lastName: params.lastName !== undefined && params.lastName !== '' ? params.lastName : undefined,
            contactNumber: {
                countryCode: params.countryCode !== undefined && params.countryCode !== '' ? params.countryCode : undefined,
                mobileNo: params.mobileNo !== undefined && params.mobileNo !== '' ? params.mobileNo : undefined,
            },
            birthDate: params.birthDate !== undefined && params.birthDate !== '' ? moment.utc(params.birthDate): undefined,
            profileImage: params.uploadedProfileImage !== undefined && params.uploadedProfileImage !== '' ? params.uploadedProfileImage : undefined
        }

        let updateProfile = await userModel.findByIdAndUpdate(params.userId, update, { new: true });

        return updateProfile;
    },

    /* Create user token */
    createUserToken: async (userId) => {
        const token = jwt.sign(
            { user_id: userId },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
            },
        );

        return token;
    },
}