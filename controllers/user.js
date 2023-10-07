const userService = require('../services/user');
const bcrypt = require('bcrypt');

module.exports = {
    signUpUser: async (req, res, next) => {
        try {
            const params = req.body;

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
                    return res.status(200).json({ IsSuccess: true, Data: [user], Message: 'User loggedIn' });
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
    }
}