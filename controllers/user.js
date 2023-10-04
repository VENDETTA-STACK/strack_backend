const userService = require('../services/user');

module.exports = {
    signUpUser: async (req, res, next) => {
        const addUser = await userService.registerUser('hello');
    }
}