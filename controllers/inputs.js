const fs = require('fs');
const path = require('path');
const expenseTimeCategories = require('../models/expense-time-categories');
const inputServices = require('../services/inputs');
const csv = require('csv-parser');
const moment = require('moment-timezone');

const { exec } = require('child_process');

const runPythonScript = (data) => {
    return new Promise((resolve, reject) => {
        // Modify the command to include the input data
        const csvFilePath = path.join(__dirname, 'split_wise.csv');
        const joblibPath = path.join(__dirname, 'label_encoder.joblib');

        console.log(data)

        let dataIs = {
            'Category': data.Category,
            'Cost': data.Cost,
            'Month': data.Month,
            'DayOfWeek': data.DayOfWeek,
        }

        console.log(dataIs)

        let inputData = JSON.stringify(data);

        console.log(csvFilePath, inputData);   
        const command = `python3 ${__dirname}/suggestion_model.py ${csvFilePath} ${JSON.stringify(inputData)} ${joblibPath}`;
    
        exec(command, (error, stdout, stderr) => {
          if (error) {
            reject(error);
          } else {
            resolve(stdout);
          }
        });
      });
}

const addRowToCSV = (newRow, filePath) => {
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            // Process each existing row
        })
        .on('end', () => {
            // Append the new row to the CSV file
            fs.appendFileSync(filePath, `${newRow.join(',')}\n`);
            console.log('New row added successfully.');
        });
}

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
    const fileName = `spendings_${Date.now()}.${fileFormat}`;
    
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

// const readData = async () => {
//     const csvFilePath = path.join(__dirname, 'split_wise.csv');
//     const uniqueCategories = new Set();

//     fs.createReadStream(csvFilePath)
//     .pipe(csv())
//     .on('data', (row) => {
//         // Assuming the 'Category' column exists in your CSV data
//         if (row.Category) {
//         uniqueCategories.add(row.Category);
//         }
//     })
//     .on('end', async () => {
//         console.log('Unique Categories:', Array.from(uniqueCategories));
//         let categories = Array.from(uniqueCategories);

//         for (let i in categories) {
//             console.log(categories[i]);
//             await inputServices.addExpenseCategory(categories[i])
//         }

//         // Continue with your processing logic here
//     })
//     .on('error', (error) => {
//         console.error('Error reading CSV file:', error);
//     });
// }

module.exports = {
    addExpenseCategory: async (req, res, next) => {
        try {
            const params = req.body;

            if (params.expenseName === undefined || params.expenseName === null || params.expenseName === '') {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Please provide expenseName parameter' });
            }

            let checkExist = await inputServices.getExpenseCategoryByName(params.expenseName);

            if (checkExist.length) {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Category already exist' });
            } else {
                let addCategory = await inputServices.addExpenseCategory(params);

                if (addCategory) {
                    if (params.userId) {
                        let userExistPreference  = await inputServices.getPreferencesByUserId(params.userId);

                        if (userExistPreference.length === 0) {
                            params.userPreference = [
                                {
                                    categoryId: addCategory._id,
                                    price: 0
                                }
                            ];
                            let addPreference = await inputServices.addPreference(params);

                            if (addPreference) {
                                return res.status(200).json({ IsSuccess: true, Data: [addPreference], Message: 'User category and preference added' });
                            } else {
                                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Category added' });
                            }   
                        }
                    }
                    return res.status(200).json({ IsSuccess: true, Data: [addCategory], Message: `${params.expenseName} category added` });
                } else {
                    return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Category not added' });
                }
            }
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    },

    getExpenseCategory: async (req, res, next) => {
        try {
            const expenses = await inputServices.getExpenseCategory();

            if (expenses && expenses.length) {
                // await readData()
                return res.status(200).json({
                    IsSuccess: true, 
                    Count: expenses.length,
                    Data: expenses, 
                    Message: 'Expense and time categories found' 
                });
            } else {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'No expense category found' });
            }
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    },

    addInitialQuestionnaire: async (req, res, next) => {
        try {
            const params = req.body;

            if (params.question === undefined || params.question === null || params.question === '') {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Please provide question parameter' });
            }

            let addQuestion = await inputServices.addIntialQuestionnaire(params);

            if (addQuestion) {
                return res.status(200).json({ IsSuccess: true, Data: [addQuestion], Message: 'Question added' });
            } else {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Question not added' });
            }
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    },

    getInitialQuestionnaire: async (req, res, next) => {
        try {
            let questions = await inputServices.getQuestions();

            if (questions.length) {
                return res.status(200).json({ IsSuccess: true, Data: questions, Message: 'Questionnaire found' });
            } else {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'No questionnaire found' });
            }
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    },

    addUserPreferences: async (req, res, next) => {
        try {
            const params = req.body;

            if (params.userId === undefined || params.userId === null || params.userId === '') {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Preference userId is required parameter' });
            }

            if (params.preference === undefined || params.preference === null || params.preference === '') {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Preference is required parameter' });
            }

            if (params.preference.length === 0) {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Preference is required list of categoryId and theire price parameter' });
            }

            let userPreference = [];

            for (let i in params.preference) {
                const category = params.preference[i];
                
                if (category) {
                    let checkCategoryExist = await inputServices.getExpenseCategoryById(category.categoryId); 

                    if (checkCategoryExist) {
                        userPreference.push(params.preference[i]);
                    }
                }
            }

            params.userPreference = userPreference;

            let userExistPreference  = await inputServices.getPreferencesByUserId(params.userId);

            if (userExistPreference.length > 0) {
                params.preferenceId = userExistPreference[0]._id;

                let editPreference = await inputServices.editUserPreference(params);

                if (editPreference) {
                    return res.status(200).json({ IsSuccess: true, Data: editPreference, Message: 'User preference updated' });
                } else {
                    return res.status(400).json({ IsSuccess: false, Data: [], Message: 'User preference not updated' });
                }
            } else {
                let addPreference = await inputServices.addPreference(params);

                if (addPreference) {
                    return res.status(200).json({ IsSuccess: true, Data: [addPreference], Message: 'User preference added' });
                } else {
                    return res.status(400).json({ IsSuccess: false, Data: [], Message: 'User preference not added' });
                }
            }
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    },

    getAllUserPreferences: async (req, res, next) => {
        try {
            const userId = req.params.id;
            let preferences = await inputServices.getAllUserPreferences(userId);

            if (preferences.length) {
                return res.status(200).json({ IsSuccess: true, Data: preferences, Message: 'User preferences found' });
            } else {
                return res.status(200).json({ IsSuccess: true, Data: [], Message: 'No user preferences found' });
            }
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    },

    editUserPreference: async (req, res, next) => {
        try {
            const params = req.body;

            if (params.preferenceId === undefined || params.preferenceId === null || params.preferenceId === '') {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'User preferenceId is required parameter' });
            }

            if (params.categoryId === undefined || params.categoryId === null || params.categoryId === '') {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Preference categoryId is required parameter' });
            }

            if (params.price === undefined || params.price === null || params.price === '') {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Preference price is required parameter' });
            }

            let checkExistPreference = await inputServices.getPreferenceById(params.preferenceId);

            if (checkExistPreference) {
                let checkExistCategory = await inputServices.getExpenseCategoryById(params.categoryId);

                if (checkExistCategory) {
                    let editPreference = await inputServices.editUserPreference(params);

                    if (editPreference) {
                        return res.status(200).json({ IsSuccess: true, Data: editPreference, Message: 'User preference updated' });
                    } else {
                        return res.status(400).json({ IsSuccess: false, Data: [], Message: 'User preference not updated' });
                    }
                } else {
                    return res.status(400).json({ IsSuccess: false, Data: [], Message: 'No category found on given categoryId' });
                }
                
            } else {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'No user preference found' }); 
            }
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    },

    deleteUserPreference: async (req, res, next) => {
        try {
            const preferenceId = req.params.id;

            let checkExistPreference = await inputServices.getPreferenceById(preferenceId);

            if (checkExistPreference) {
                await inputServices.deleteUserPreference(preferenceId);
                return res.status(200).json({ IsSuccess: true, Data: 1, Message: 'User preference deleted' });
            } else {
                return res.status(400).json({ IsSuccess: false, Data: 0, Message: 'No user preference found' }); 
            }
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    },

    addUserSpendings: async (req, res, next) => {
        try {
            let params = req.body;

            if (params.userId === undefined || params.userId === null || params.userId === '') {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Please provide userId parameter' });
            }

            if (params.categoryId === undefined || params.categoryId === null || params.categoryId === '') {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Please provide categoryId parameter' });
            }

            if (params.isTime) {
                if (params.fromTime === undefined || params.fromTime === null || params.fromTime === '') {
                    return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Please provide fromTime parameter' });
                }
    
                if (params.toTime === undefined || params.toTime === null || params.toTime === '') {
                    return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Please provide toTime parameter' });
                }
            } else {
                if (params.price === undefined || params.price === null || params.price === '') {
                    return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Please provide price parameter' });
                }
            }

            if (params.image) {
                let fileName = await uploadedImage(params.image);

                params.uploadedImage = fileName.toString();
            }

            let addSpendingData = await inputServices.addUserSpendings(params);

            if (addSpendingData) {
                const csvFilePath = path.join(__dirname, 'split_wise.csv');
                let createdDate = moment().format('YYYY-MM-DD');
                // const dateIs = createdDate.split('T')[0];

                console.log(createdDate);
                let category = await inputServices.getExpenseCategoryById(addSpendingData.categoryId)
                const newDataRow = [createdDate, addSpendingData.text, category.expenseName, addSpendingData.price, 'INR', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', 'YourName'];

                addRowToCSV(newDataRow, csvFilePath);
                return res.status(200).json({ IsSuccess: true, Data: [addSpendingData], Message: 'User spending added' });
            } else {

                if (params.uploadedImage) {
                    await deleteImage(params.uploadedImage);
                }

                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'User spending not added' });
            }
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    },

    getUserAllSpendings: async (req, res, next) => {
        try {
            const userId = req.params.userId;

            let spendings = await inputServices.getUserSpendings(userId);

            if (spendings.length > 0) {
                return res.status(200).json({ IsSuccess: true, Data: spendings, Message: 'User spendings found' }); 
            } else {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'User spendings not found' });
            }
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    },

    editUserSpendings: async (req, res, next) => {
        try {
            let params = req.body;

            if (params.spendingId === undefined || params.spendingId === null || params.spendingId === '') {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Please provide spendingId parameter' });
            }

            if (params.isTime) {
                if (params.fromTime === undefined || params.fromTime === null || params.fromTime === '') {
                    return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Please provide fromTime parameter' });
                }
    
                if (params.toTime === undefined || params.toTime === null || params.toTime === '') {
                    return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Please provide toTime parameter' });
                }
            } else {
                if (params.price === undefined || params.price === null || params.price === '') {
                    return res.status(400).json({ IsSuccess: false, Data: [], Message: 'Please provide price parameter' });
                }
            }

            let checkExist = await inputServices.getUserSpendingById(params.spendingId);

            if (checkExist) {
                
                if (params.image) {
                    let fileName = await uploadedImage(params.image);
    
                    params.uploadedImage = fileName.toString();
                }

                let editSpendingData = await inputServices.editUserSpendings(params);

                if (editSpendingData) {
                    return res.status(200).json({ IsSuccess: true, Data: [editSpendingData], Message: 'User spending updated' });
                } else {
                    return res.status(400).json({ IsSuccess: false, Data: [], Message: 'User spending not updated' });
                }
            } else {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: 'No Spending record found' });
            }
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    },

    deleteUserSpendings: async (req, res, next) => {
        try {
            const spendingId = req.params.id;

            let checkExistPreference = await inputServices.getUserSpendingById(spendingId);

            if (checkExistPreference) {
                await inputServices.deleteUserSpending(spendingId);
                return res.status(200).json({ IsSuccess: true, Data: 1, Message: 'User preference deleted' });
            } else {
                return res.status(400).json({ IsSuccess: false, Data: 0, Message: 'No user preference found' }); 
            }
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    },

    getUserReports: async (req, res, next) => {
        try {
            const params = req.body;

            const pythonResult = await runPythonScript(params.inputData);

            if (pythonResult) {
                return res.status(200).json({ IsSuccess: true, Data: pythonResult, Message: "User report found" });
            } else {
                return res.status(400).json({ IsSuccess: false, Data: [], Message: "User report not found" });
            }
        } catch (error) {
            return res.status(500).json({ IsSuccess: false, Data: [], Message: error.message });
        }
    }
}