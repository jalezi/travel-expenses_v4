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

async function checkFile(condition, message) {
  const suffix = 'File should be a CSV with header in first line and not empty!'
  if (condition) {
    return new Error(`${message} - ${suffix}`);
  }
}

function createCurrency(value) {
  let currency = {};
  let curRate = {};
  currency['base'] = value.base;
  currency['date'] = new Date(value.date);
  curRate[value.currency] = Number(value.rate);
  currency['rate'] = curRate;
  // console.log(currencyMongo);
  return currency;
}

const getOnlyNewCurrency = (currency, value) => {
  return new Promise((resolve, reject) => {
    if (!currency) {
      return resolve(value);
    } else {
      return resolve();
    }
  });
};

async function expensesImportSaveOrGetCurrencies(array) {

  console.log('Cur array', array.length);
  let currenciesArray = [];
  return await new Promise(async (resolve, reject) => {
    // if(!array) {
    //   reject(new Error('expensesImportSaveOrGetCurrencies'));
    // }
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
          currenciesArray.push(value);
        }
      }).catch((err) => {
        throw err;
      });
    }
    return await resolve(currenciesArray);
  });
}

async function expensesImportSetCurrencyArray(myFile, userId, travels) {

  let message = '';
  let error = null;
  const myFilePath = myFile.path;
  const expenseHeaderArray = constants.IMPORT_EXPENSE_HEADER;
  try {
    // check if file is selected, not empty and CSV
    error = await checkFile(myFile.name === '', 'No file selected!');
    if (error) {throw error}
    error = await checkFile(myFile.size === 0, 'Empty file!');
    if (error) {throw error}
    error = await checkFile(myFilePath.split('.').pop() != 'csv', 'Not a CSV file!');
    if (error) {throw error}

    const parsedData = await readAndParseFile(myFilePath);
    let dataArray = parsedData.data;
    const expensesCountBefore = dataArray.length;

    // check if file has correct header
    const parsedHeaderArray = parsedData.meta.fields;
    error = await checkFile(!_.isEqual(expenseHeaderArray, parsedHeaderArray), `Header should be: ${expenseHeaderArray}`);
    if (error) {throw error}

    // findRates and travel in expenses CSV
    let travelObjectsIds = [];
    let noTravelKeys = [];
    await _.forEach(dataArray, async (value, key, object) => {
      // console.log(key+2, value.type, value.travelName, object.length);


      let currency = {};
      if (value.type != 'Mileage') {
        currency = createCurrency(value);
        value._user = userId;
        value.curRate = currency;
        object[key].curRate = value.curRate;
        delete value.rate;
        delete value.base;
      }

      // find travel for expense
      const travel = await travels.find((item) => {
        const date = new Date(value.date);
        const dateRange = item.dateFrom <= date && item.dateTo >= date;
        const sameName = item.description === value.travelName;
        let result = dateRange && sameName;
        if (!result) {
          return false;
        }

        return true;
      });

      // if no travel for expense delete expense
      if (!travel) {
        // object.splice(key, 1);
        noTravelKeys.push(key)
        console.log(key + 2, value.type, value.travelName, value.date);
        // console.log(key+2, value.currency, value.curRate, value.amountConverted);

        return
      } else {
        // console.log(key + 2, object[key+2]);
        object[key].travel = travel._id;
      }
    });
    // console.log('dataArray', dataArray.length);
    // console.log('noTravelKeys', noTravelKeys);
    for (value of noTravelKeys.sort(function(a, b){return b-a})) {
      // console.log('key', value, dataArray[value]);
      dataArray.splice(value, 1);
    }
    // console.log('dataArray', dataArray.length);
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

    return {currenciesArray, message};
  } catch (err) {
    message = 'Something went wrong during expenses import! Check console log!';
    return {err, message};
  }
}

async function travelImport(myFile, userId) {
  let message = '';
  let error = null;
  const myFilePath = myFile.path;
  const travelHeaderArray = constants.IMPORT_TRAVEL_HEADER;
  try {
    // check if file is selected, not empty and CSV
    error = await checkFile(myFile.name === '', 'No file selected!');
    if (error) {throw error}
    error = await checkFile(myFile.size === 0, 'Empty file!');
    if (error) {throw error}
    error = await checkFile(myFilePath.split('.').pop() != 'csv', 'Not a CSV file!');
    if (error) {throw error}

    const parsedData = await readAndParseFile(myFilePath);
    const dataArray = parsedData.data;

    // check if file has correct header
    const parsedHeaderArray = parsedData.meta.fields;
    error = await checkFile(!_.isEqual(travelHeaderArray, parsedHeaderArray), `Header should be: ${travelHeaderArray}`);
    if (error) {throw error}
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
  deleteFile,
  expensesImportSetCurrencyArray,
  expensesImportSaveOrGetCurrencies,
  travelImport
}
