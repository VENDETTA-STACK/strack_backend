const userService = require('../services/user');
const bcrypt = require('bcrypt');
const fs = require('fs');

const uploadedImage = async (base64Image) => {
    const matches = base64Image.match(/^data:image\/(\w+);base64,(.+)$/);
      
    if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 image string');
    }
    
    const fileFormat = matches[1];
    const base64Data = matches[2];
    
    // Remove the data:image/png;base64 part
    const dataBuffer = Buffer.from(base64Data, 'base64');
    
    // Generate a unique filename
    const fileName = `profile_${Date.now()}.${fileFormat}`;
    
    const filePath = `uploads/${fileName}`;
    
    // Save the image to the "uploads" folder
    fs.writeFile(filePath, dataBuffer, (err) => {
        if (err) {
        console.error(err);
        throw new Error('Error uploading image');
        } else {
        console.log('Image uploaded successfully');
        }
    });
    
    return fileName;
}

const deleteImage = async (fileName) => {
    const filePath = `uploads/${fileName}`;
  
    // Delete the image file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        throw new Error('Error deleting image');
      } else {
        console.log('Image deleted successfully');
      }
    });
}

module.exports = {
    // Register new user
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

    //login user
    signInUser: async (req, res, next) => {
        try {
            const params = req.body;

            if (!params.email) {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Email is requied' }); 
            }

            if (!params.password) {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Password is requied' }); 
            }

            // let user = await userService.loginUser(params);
            let user = await userService.getUserByEmail(params.email);

            if (user.length === 1) {
                user = user[0];
                let userHashpassword = user.password;

                const validPassword = await bcrypt.compare(params.password, userHashpassword);

                if (validPassword) {
                    //let token = await userService.createUserToken(user.id);
                    return res.status(200).json({ IsSuccess: true, Data: user, Message: 'User loggedIn' });
                } else {
                    return res.status(401).json({ IsSuccess: false, Data: [], Message: 'Incorrect password' });
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

    //forget password or password change
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
            const userId = req.query.userId;

            if (!userId) {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Please provide valid userId parameter' });
            }

            let user = await userService.getUserById(userId);

            if (user !== undefined) {
                return res.status(200).json({ IsSuccess: true, Data: [user], Message: 'User found' });
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

            if (params.profileImage) {
                let fileName = await uploadedImage(params.profileImage);

                params.uploadedProfileImage = fileName;
            }

            let edit = await userService.editUserProfile(params);

            if (edit !== undefined) {
                return res.status(200).json({ IsSuccess: true, Data: edit, Message: 'User profile updated' });
            } else {

                if (params.uploadedProfileImage) {
                    await deleteImage(params.uploadedProfileImage);
                }
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'User not found' });
            }
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    }
}