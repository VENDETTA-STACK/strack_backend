const inputServices = require('../services/inputs');

module.exports = {
    addExpenseCategory: async (req, res, next) => {
        try {
            
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    }
}