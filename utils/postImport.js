const mongoose = require('mongoose');
const _ = require('lodash');
const moment = require('moment');
const fs = require('fs');
const Papa = require('papaparse');

const User = require('../models/User');
const Travel = require('../models/Travel');
const Expense = require('../models/Expense');
const Rate = require('../models/Rate');
const Currency = require('../models/Currency');
const ObjectId = mongoose.Types.ObjectId;

const {expenseTypes} = require('../lib/globals');
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
      encoding: "utf8",
      complete: (results) => {},
      skipEmptyLines: true
    });
    return parsedData;
  } catch (err) {
    throw err;
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

// return Error with message on condtion is true
async function checkFileFor(condition, message) {
  const suffix = 'File should be a CSV with header in first line and not empty!';
  try {
      if (condition) {
        return new myErrors.imprortFileError(`${message} - ${suffix}`);
    }
  } catch (err) {
    throw err;
  }
}

// check if file is not empty, CSV or it was not selected
const checkFile = (myFile) => {
  return new Promise(async (resolve, reject) => {
    let tripleCheck = async (myFIle) => {
      try {
        error = await checkFileFor(myFile.name === '', 'No file selected!');
        if (error) {return error}
        error = await checkFileFor(myFile.size === 0, 'Empty file!');
        if (error) {return error}
        error = await checkFileFor(myFile.path.split('.').pop() != 'csv', 'Not a CSV file!');
        if (error) {return error}
        return;
      } catch (err) {
          resolve(err);
        }
    }
    try {
      let result = await tripleCheck();
      resolve(result);
    } catch (err) {
      resolve(err)
    }
  });
}

// create currency Object
function createCurrency(value) {
  let currency = {};
  let curRate = {};
  currency['base'] = value.base;
  currency['date'] = new Date(value.date);
  curRate[value.currency] = Number(value.rate);
  currency['rate'] = curRate;
  return currency;
}

// return currency if currency does't exist in DB
const getOnlyNewCurrency = (currency, value) => {
  return new Promise((resolve, reject) => {
    if (!currency) {
      return resolve(value);
    } else {
      return resolve();
    }
  });
};

/* prepare new currencies which will save later.
*  check if currencies are only in DB and return array with new currencies
*/
async function expensesImportNewCurrenciesForSave(array) {
  let notExistingCurrenciesDB = [];
  let existingCurrenciesDB = []
  return await new Promise(async (resolve, reject) => {
    for (value of array) {
      let currency = await Currency.findOne({
        base: value.base,
        date: value.date,
        rate: value.rate
      }, (err, doc) => {
        if (err) {
          console.log('Error: ', err.message);
          throw err;
        }
      });
      await getOnlyNewCurrency(currency, value).then((value) => {
        if (value) {
          notExistingCurrenciesDB.push(value);
        } else {
          existingCurrenciesDB.push(currency);
        }
      }).catch((err) => {
        reject (err);
      });
    }
    return await resolve({notExistingCurrenciesDB, existingCurrenciesDB});
  });
}

/* read file, check file and return data or error
*  if file is not validate return custom error imprortFileError otherwise
*  return array with expenses data
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
    default:
  }

  try {
    // check if file is CSV, not empty or not even selected
    error = await checkFile(myFile).catch((err) => {
      throw err;
    });
    if (error) {throw error}

    // no error - file is CSV & has some data
    const parsedData = await readAndParseFile(myFilePath);
    let dataArray = parsedData.data;
    const expensesCountBefore = dataArray.length;

    // check if data has mathcing header
    const parsedHeaderArray = parsedData.meta.fields;
    error = await checkFileFor(!_.isEqual(headerToBe, parsedHeaderArray), `Header should be: ${headerToBe}`).catch((err) => {
      throw err;
    });
    if (error) {throw error}
    return dataArray;
} catch (err) {
  return err;
}}

/*  Get and prepare currencies from imported file
*   remove rate & base from passed array @param dataArray
*   add property _user to passed array @param dataArray
*   add property curRate to passed array @param dataArray
*/
async function expensesImportSetCurrencyArray(dataArray, userId, travels) {
  let message = '';
  let error = null;

  try {
    const expensesCountBefore = dataArray.length;

    // findRates and travel in expenses CSV
    let noTravelKeys = [];
    await _.forEach(dataArray, async (value, key, object) => {
      value._user = userId;
      let currency = {};
      if (value.type != 'Mileage') {
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
        const sameName = item.description == value.travelName;

        let result = dateRange && sameName;
        if (!result) {
          return false;
        }
        return true;
      });

      // if no travel for expense delete expense
      if (!travel) {
        noTravelKeys.push(key)
        console.log(key + 2, value.type, value.travelName, value.date);
        // console.log(key+2, value.currency, value.curRate, value.amountConverted);
        return
      } else {
        // console.log(key + 2, object[key+2]);
        object[key].travel = travel._id;
      }
    });

    // delete expenses that not belong to any existing travel
    for (value of noTravelKeys.sort(function(a, b){return b-a})) {
      // console.log('key', value, dataArray[value]);
      dataArray.splice(value, 1);
    }

    // get imported currencies
    let currenciesArray = await dataArray.reduce((result, item) => {
      if (item.curRate && item.type != 'Mileage') {
        result.push(item.curRate);
      }
      return result;
    }, []);

    // get unique currencies
    currenciesArray = [...new Map(currenciesArray.map(o => [JSON.stringify(o), o])).values()].sort(function(a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return a.date - b.date;
    });

    const expensesCountAfter = dataArray.length;
    const invalidExpensesCount = expensesCountBefore - expensesCountAfter;
    const validExpensesCount = expensesCountBefore - invalidExpensesCount;
    message = `INVALID EXPENSES: ${invalidExpensesCount}. VALID EXPENSES: ${validExpensesCount}`;

    return ({currenciesArray, message});
  } catch (err) {
    message = 'Something went wrong during expenses import! Check console log!';
    return ({err, message});
  }
}

const updateTravels = async function (uniqueTravelObjectIds, expenses) {
  return new Promise(async function (resolve, reject)  {

    try {
      let updatedTravels = await _.forEach(uniqueTravelObjectIds, async (value, key, object) => {
        let travelExpensesObjectIds = expenses.filter((item) => {
          return item.travel === value;
        });


        let aggr = await Expense.aggregate([
        {'$match': {'travel': new ObjectId(value)}},
        {'$group': {'_id': '$travel', 'total': {'$sum': '$amountConverted'}}}
  ]);

        let travel = await Travel.findByIdAndUpdate(value, {
          $addToSet: {
            'expenses': {
              $each: travelExpensesObjectIds
            }
          },
          $set: {total: aggr[0].total}
        }, {new: true});
      });
      resolve(updatedTravels);
    } catch (err) {
        resolve (err);
      }
  });
}

const expenseImport = async function (dataArray) {
  return new Promise(async function (resolve, reject) {

    try {
      let expenses = await Expense.insertMany(dataArray);
      let travelObjectIds = expenses.map(expense => expense.travel);
      let uniqueTravelObjectIds = [...new Set(travelObjectIds)];
      const updatedTravels = await updateTravels(uniqueTravelObjectIds, expenses).catch((err) => {
        throw err;
      });

      let message = `${expenses.length} imported. ${updatedTravels.length} travels updated!`;
      return resolve(message);
    } catch (err) {
      return resolve ({error: err, msg: 'Something went wrong during expense import!'});
    }
  });
}

async function travelImport(dataArray, userId) {
  let message = '';
  try {

    // add user._id to travel
    await _.forEach(dataArray, (value, key) => {
      dataArray[key]._user = userId;
    });

    // insert travels and update user with travel._id
    const travels = await Travel.insertMany(dataArray);
    const travelObjectIds = travels.map(travel => travel._id);
    await User.findByIdAndUpdate(userId, {
      $addToSet: {
        'travels': {
          $each: travelObjectIds
        }
      }
    });

    message = `${travelObjectIds.length} travels added successfully!`
    return message;

  } catch (err) {
    return {error: err, msg: 'Something went wrong during travel import!'};
  }
}

module.exports = {
  readCheckFileAndGetData,
  deleteFile,
  expensesImportSetCurrencyArray,
  expensesImportNewCurrenciesForSave,
  travelImport,
  expenseImport
}
