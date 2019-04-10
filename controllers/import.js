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

exports.getImport = async function(req, res, next) {
  const travels = res.locals.travels;

  res.render('travels/import', {
    title: 'Import',
    travels
  })
}

async function checkFile(condition, message) {
  const suffix = 'File should be a CSV with header in first line and not empty!'
  if (condition) {
    throw new Error(`${message} - ${suffix}`);
  }
}


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

async function travelImport(myFile, userId) {
  let message = '';
  const myFilePath = myFile.path;
  const travelHeaderArray = constants.IMPORT_TRAVEL_HEADER;
  try {
    // check if file is selected, not empty and CSV
    await checkFile(myFile.name === '', 'No file selected!');
    await checkFile(myFile.size === 0, 'Empty file!');
    await checkFile(myFilePath.split('.').pop() != 'csv', 'Not a CSV file!');

    const parsedData = await readAndParseFile(myFilePath);
    const dataArray = parsedData.data;

    // check if file has correct header
    const parsedHeaderArray = parsedData.meta.fields;
    await checkFile(!_.isEqual(travelHeaderArray, parsedHeaderArray), `Header should be: ${travelHeaderArray}`);

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
    throw err;
  }
}

function createCurrency(value) {
  let currency = {};
  let curRate = {};
  currency['base'] = value.base;
  currency['date'] = new Date(value.date);
  curRate[value.currency] = value.rate;
  currency['rate'] = curRate;
  // console.log(currencyMongo);
  return currency;
}

async function expensesImport(myFile, userId, travels) {

  let message = '';
  const myFilePath = myFile.path;
  const expenseHeaderArray = constants.IMPORT_EXPENSE_HEADER;
  try {
    // check if file is selected, not empty and CSV
    await checkFile(myFile.name === '', 'No file selected!');
    await checkFile(myFile.size === 0, 'Empty file!');
    await checkFile(myFilePath.split('.').pop() != 'csv', 'Not a CSV file!');

    const parsedData = await readAndParseFile(myFilePath);
    let dataArray = parsedData.data;
    const expensesCountBefore = dataArray.length;

    // check if file has correct header
    const parsedHeaderArray = parsedData.meta.fields;
    await checkFile(!_.isEqual(expenseHeaderArray, parsedHeaderArray), `Header should be: ${expenseHeaderArray}`);

    // findRates and travel in expenses CSV
    let travelObjectsIds = [];
    let currenciesArray = [];
    dataArray = await _.forEach(dataArray, async (value, key, object) => {
      let currency = {};
      if (value.type != 'Mileage') {
        currency = createCurrency(value);
        currenciesArray.push(currency);
        value._user = userId;
        delete value.rate;
        delete value.base;
      }

      const travel = travels.find((item) => {
        const date = new Date(value.date)
        const dateRange = item.dateFrom <= date && item.dateTo >= date;
        const sameName = item.description === value.travelName;
        result = dateRange && sameName;

        if (!result) {
          return false;
        }
        return true;
      });

      if (!travel) {
        object.splice(key, 1);
        console.log(key, value.type, value.travelName, value.date, value.amountConverted);
      } else {
        object[key].travel = travel._id;
      }
    });
    // console.log(dataArray);
    currenciesArray = [...new Set(currenciesArray)];



    const expensesCountAfter = dataArray.length;
    const invalidExpensesCount = expensesCountBefore - expensesCountAfter;
    const validExpensesCount = expensesCountBefore - invalidExpensesCount;

    return `Invalid expenses: ${invalidExpensesCount}. ${validExpensesCount} imported!`
  } catch (err) {
    throw err;
  }
}


exports.postImport = async function(req, res, next) {
  let message = '';
  const myFile = req.files.myFile;
  const myFilePath = req.files.myFile.path;

  try {
    if (req.body.option === 'travels') {
      message = await travelImport(myFile, req.user._id);

    } else {

      message = await expensesImport(myFile, req.user._id, res.locals.travels);

    }

    deleteFile(myFilePath, 'File deleted after processed!');
    req.flash('success', {
      msg: message
    });
    res.redirect('/travels')
  } catch (err) {
    deleteFile(myFilePath, 'File deleted after error!');
    req.flash('errors', {
      msg: err.message
    })
    console.log(err);
    res.redirect('/import');
  }
}
