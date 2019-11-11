const mongoose = require('mongoose');
const _ = require('lodash');
// const moment = require('moment');
const fs = require('fs');
const Papa = require('papaparse');

const User = require('../models/User');
const Travel = require('../models/Travel');
const Expense = require('../models/Expense');
// const Rate = require('../models/Rate');
const Currency = require('../models/Currency');

const { ObjectId } = mongoose.Types;

const constants = require('../lib/constants');
const myErrors = require('../utils/myErrors');

// read and parse file
async function readAndParseFile(filePath, enc = 'utf8') {
  try {
    const myFile = fs.readFileSync(filePath, enc);
    const parsedData = Papa.parse(myFile, {
      quoteChar: '"',
      escapeChar: '"',
      header: true,
      dynamicTyping: false,
      preview: 0,
      encoding: 'utf8',
      complete: () => {},
      skipEmptyLines: true
    });
    return parsedData;
  } catch (err) {
    return err;
  }
}

// delete uploaded file
function deleteFile(filePath, message = '') {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          throw err;
        }
        console.log(message);
      });
    }
  } catch (err) {
    console.log(`File: ${filePath} not deleted!`);
    throw err;
  }
}

// return Error with message on condition is true
async function checkFileFor(condition, message) {
  const suffix = 'File should be a CSV with header in first line and not empty!';
  try {
    if (condition) {
      return new myErrors.importFileError(`${message} - ${suffix}`);
    }
  } catch (err) {
    return err;
  }
}

// check if file is not empty, CSV or it was not selected
const checkFile = (myFile) => new Promise((resolve) => {
  const tripleCheck = function () {
    let error;
    try {
      error = checkFileFor(myFile.name === '', 'No file selected!');
      if (error) { return error; }
      error = checkFileFor(myFile.size === 0, 'Empty file!');
      if (error) { return error; }
      error = checkFileFor(myFile.path.split('.').pop() !== 'csv', 'Not a CSV file!');
      if (error) { return error; }
      return;
    } catch (err) {
      resolve(err);
    }
  };
  try {
    const result = tripleCheck();
    resolve(result);
  } catch (err) {
    resolve(err);
  }
});

// create currency Object
function createCurrency(value) {
  const currency = {};
  const curRate = {};
  currency.base = value.base;
  currency.date = new Date(value.date);
  curRate[value.currency] = Number(value.rate);
  currency.rate = curRate;
  return currency;
}

// return currency if currency doesn't exist in DB
const getOnlyNewCurrency = (currency, value) => new Promise((resolve) => {
  if (!currency) {
    return resolve(value);
  }
  return resolve();
});

/* Prepare new currencies which will save later.
 * Check if currencies are only in DB and return array with new currencies
 */
async function expensesImportNewCurrenciesForSave(array) {
  const notExistingCurrenciesDB = [];
  const existingCurrenciesDB = [];
  return new Promise((resolve, reject) => {
    for (const value of array) {
      const currency = Currency.findOne({
        base: value.base,
        date: value.date,
        rate: value.rate
      }, (err) => {
        if (err) {
          console.log('Error: ', err.message);
          throw err;
        }
      });
      getOnlyNewCurrency(currency, value).then((value) => {
        if (value) {
          notExistingCurrenciesDB.push(value);
        } else {
          existingCurrenciesDB.push(currency);
        }
      }).catch((err) => {
        reject(err);
      });
    }
    resolve({ notExistingCurrenciesDB, existingCurrenciesDB });
  });
}

/* read file, check file and return data or error
 * if file is not validate return custom error importFileError otherwise
 * return array with expenses data
 */
async function readCheckFileAndGetData(myFile, option) {
  let error = null;
  const myFilePath = myFile.path;
  let headerToBe;
  switch (option) {
    case 'travels':
      headerToBe = constants.IMPORT_TRAVEL_HEADER;
      break;
    case 'expenses':
      headerToBe = constants.IMPORT_EXPENSE_HEADER;
      break;
    default:
  }

  try {
    // check if file is CSV, not empty or not even selected
    error = await checkFile(myFile).catch((err) => {
      throw err;
    });
    if (error) { throw error; }

    // no error - file is CSV & has some data
    const parsedData = await readAndParseFile(myFilePath);
    const dataArray = parsedData.data;

    // check if data has matching header
    const parsedHeaderArray = parsedData.meta.fields;
    error = await checkFileFor(!_.isEqual(headerToBe, parsedHeaderArray), `Header should be: ${headerToBe}`).catch((err) => {
      throw err;
    });
    if (error) { throw error; }
    return dataArray;
  } catch (err) {
    return err;
  }
}

/* Get and prepare currencies from imported file
 * remove rate & base from passed array @param dataArray
 * add property _user to passed array @param dataArray
 * add property curRate to passed array @param dataArray
 */
async function expensesImportSetCurrencyArray(dataArray, userId, travels) {
  let message = '';

  try {
    const expensesCountBefore = dataArray.length;

    // findRates and travel in expenses CSV
    const noTravelKeys = [];
    await _.forEach(dataArray, async (value, key, object) => {
      value._user = userId;
      value.amount = Number(value.amount).toFixed(2);
      value.rate = Number(value.rate).toFixed(2);
      value.amountConverted = Number(value.amountConverted).toFixed(2);
      let currency = {};
      if (value.type !== 'Mileage') {
        currency = createCurrency(value);
        value.curRate = currency;
        delete value.rate;
        delete value.base;
      } else {
        delete value.currency;
      }


      // find travel for expense
      const travel = await travels.find((item) => {
        const date = new Date(value.date);
        const dateRange = item.dateFrom <= date && item.dateTo >= date;
        const sameName = item.description === value.travelName;

        const result = dateRange && sameName;
        if (!result) {
          return false;
        }
        return true;
      });

      // if no travel for expense delete expense
      if (!travel) {
        noTravelKeys.push(key);
      } else {
        object[key].travel = travel._id;
      }
    });

    // delete expenses that not belong to any existing travel
    for (const value of noTravelKeys.sort((a, b) => b - a)) {
      dataArray.splice(value, 1);
    }

    // get imported currencies
    let currenciesArray = await dataArray.reduce((result, item) => {
      if (item.curRate && item.type !== 'Mileage') {
        result.push(item.curRate);
      }
      return result;
    }, []);

    // get unique currencies
    currenciesArray = [...new Map(currenciesArray.map((o) => [JSON.stringify(o), o])).values()].sort((a, b) =>
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      a.date - b.date);

    const expensesCountAfter = dataArray.length;
    const invalidExpensesCount = expensesCountBefore - expensesCountAfter;
    const validExpensesCount = expensesCountBefore - invalidExpensesCount;
    message = `INVALID EXPENSES: ${invalidExpensesCount}. VALID EXPENSES: ${validExpensesCount}`;

    return ({ currenciesArray, message });
  } catch (err) {
    message = 'Something went wrong during expenses import! Check console log!';
    return ({ err, message });
  }
}

const updateTravels = function (uniqueTravelObjectIds, expenses) {
  return new Promise(((resolve) => {
    try {
      const updatedTravels = _.forEach(uniqueTravelObjectIds, async (value) => {
        const travelExpensesObjectIds = expenses.filter((item) => item.travel === value);


        const aggr = Expense.aggregate([
          { $match: { travel: new ObjectId(value) } },
          { $group: { _id: '$travel', total: { $sum: '$amountConverted' } } }
        ]);
      });
      resolve(updatedTravels);
    } catch (err) {
      resolve(err);
    }
  }));
};

const expenseImport = function (dataArray) {
  return new Promise(((resolve) => {
    try {
      const expenses = Expense.insertMany(dataArray).catch(() => {
        throw new myErrors.saveToDbError('Something went wrong during saving expenses to DB!');
      });
      if (!expenses) {
        throw new myErrors.saveToDbError('No expenses saved!');
      }
      const travelObjectIds = expenses.map((expense) => expense.travel);
      const uniqueTravelObjectIds = [...new Set(travelObjectIds)];
      const updatedTravels = updateTravels(uniqueTravelObjectIds, expenses).catch(() => {
        throw new myErrors.saveToDbError('Something went wrong during updating travels with expenses!');
      });

      const message = `${expenses.length} imported. ${updatedTravels.length} travels updated!`;
      resolve(message);
    } catch (err) {
      resolve({ error: err, msg: 'Something went wrong during expense import!' });
    }
  }));
};

async function travelImport(dataArray, userId) {
  let message = '';
  return new Promise((resolve) => {
    try {
      // add user._id to travel
      _.forEach(dataArray, (value) => {
        value._user = userId;
        value.total = Number(0).toFixed(2);
      });

      // insert travels and update user with travel._id
      const travels = Travel.insertMany(dataArray).catch(() => {
        throw new myErrors.saveToDbError('Something went wrong during saving to DB!');
      });

      if (!travels) {
        throw new myErrors.saveToDbError('No travels saved!');
      }

      const travelObjectIds = travels.map((travel) => travel._id);
      User.findByIdAndUpdate(userId, {
        $addToSet: {
          travels: {
            $each: travelObjectIds
          }
        }
      }).catch(() => {
        throw new myErrors.saveToDbError('Something went wrong during updating user with travels!');
      });

      message = `${travelObjectIds.length} travels added successfully!`;
      resolve(message);
    } catch (err) {
      resolve({ error: err, msg: 'Something went wrong during travel import!' });
    }
  });
}

module.exports = {
  readCheckFileAndGetData,
  deleteFile,
  expensesImportSetCurrencyArray,
  expensesImportNewCurrenciesForSave,
  travelImport,
  expenseImport
};
