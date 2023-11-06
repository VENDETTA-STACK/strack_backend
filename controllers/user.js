const userService = require('../services/user');
const bcrypt = require('bcrypt');

module.exports = {
    signUpUser: async (req, res, next) => {
        try {
            const params = req.body;

            if (params.firstName === '' || params.firstName === null || params.firstName === undefined) {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'firstName parameter is missing' });
            }

            if (params.password === '' || params.password === null || params.password === undefined) {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'password parameter is missing' });
            }

            if (params.email === '' || params.email === null || params.email === undefined) {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'email parameter is missing' });
            }

            let checkExistUser = await userService.getUserByEmail(params.email);

            if (checkExistUser.length) {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'User already exist with this email' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashPassword = bcrypt.hashSync(params.password, salt);
            params.password = hashPassword;

            const addUser = await userService.registerUser(params);

            if (addUser) {
                return res.status(200).json({ IsSuccess: true, Data: [addUser], Message: 'User successfully registered' });
            } else {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'User registration failed' });
            }    
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    },

    signInUser: async (req, res, next) => {
        try {
            const params = req.body;

            let user = await userService.loginUser(params);

            if (user !== undefined && user !== null) {
                let userHashpassword = user.password;

                const validPassword = await bcrypt.compare(params.password, userHashpassword);

                if (validPassword) {
                    let token = await userService.createUserToken(user.id);
                    return res.status(200).json({ IsSuccess: true, Data: [...user, token], Message: 'User loggedIn' });
                } else {
                    return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Incorrect password' });
                }
            } else {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'User not found' });
            }    
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    },

    /* Create user token */
    createUserToken: async (userId) => {
        const token = jwt.sign(
            { 
                user_id: userId },
                process.env.JWT_SECRET_KEY,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
            },
        );

        return token;
    },

    forgetPassword: async (req, res, next) => {
        try {
            const { oldPassword, newPassword, userId } = req.body;

            let user = await userService.getUserById(userId);

            if (user === undefined || user === null) {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'User not found' });
            }

            const validPassword = await bcrypt.compare(oldPassword, user.password);

            if (validPassword) {
                const salt = await bcrypt.genSalt(10);
                let hashPassword = bcrypt.hashSync(newPassword, salt);
                let changePassword = await userService.resetPassword(user._id, hashPassword);
                return res.status(200).json({ IsSuccess: true, Data: [changePassword], Message: 'Password reset successfully' });
            } else {
                return res.status(400).json({ IsSuccess: true, Data: [], Message: 'Invalid password' });
            }
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    },

    getUserById: async (req, res, next) => {
        try {
            const userId = req.params.userId;

            if (!userId) {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Please provide valid userId parameter' });
            }

            let user = await userService.getUserById(userId);

            if (user !== undefined) {
                return res.status(200).json({ IsSuccess: true, Data: user, Message: 'User found' });
            } else {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'User not found' });
            }    
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    },

    editUserProfileDetails: async (req, res, next) => {
        try {
            const params = req.body;

            if (params.userId === undefined || params.userId === null || params.userId === '') {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Please provide userId required parameter' });
            }

            let edit = await userService.editUserProfile(params);

            if (edit !== undefined) {
                return res.status(200).json({ IsSuccess: true, Data: edit, Message: 'User profile updated' });
            } else {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'User not found' });
            }
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    }
}