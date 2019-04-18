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
const postImport = require('../utils/postImport');
const myErrors = require('../utils/myErrors');

exports.getImport = async function(req, res, next) {
  const travels = res.locals.travels;

  res.render('travels/import', {
    title: 'Import',
    travels
  })
}

exports.postImport = async function(req, res, next) {
  let message = '';
  const myFile = req.files.myFile;
  const myFilePath = req.files.myFile.path;
  let combinedCurrencies = [];

  try {
    const dataArray = await postImport.readCheckFileAndGetData(myFile, req.body.option).catch((err) => {
      throw err;
    });
    if (dataArray instanceof Error) {
      throw dataArray
    }


    if (req.body.option === 'travels') {
      message = await postImport.travelImport(dataArray, req.user._id);
      if (message.error) {
        error = message.error;
        message = message.msg;
        throw error;
      }
    } else {

      let getCurrenciesArray = await postImport.expensesImportSetCurrencyArray(dataArray, req.user._id, res.locals.travels);
      const currenciesArray = getCurrenciesArray.currenciesArray;
      message = getCurrenciesArray.message;
      let error = getCurrenciesArray.err;
      if (error) {throw error;}

      const allCurrencies = await postImport.expensesImportNewCurrenciesForSave(currenciesArray).catch((err) => {
        throw err;
      });
      let insertedCurrencies = await Currency.insertMany(allCurrencies.notExistingCurrenciesDB);
      combinedCurrencies = insertedCurrencies.concat(allCurrencies.existingCurrenciesDB);

      await _.forEach(dataArray, async (value, key, object) => {
        delete value.travelName;
        const currency = await combinedCurrencies
        .sort((a, b) => {
          return a.date - b.date;
        })
        .find((item) => {
          let dateEqual = value.date ===  moment(item.date).format('YYYY-MM-DD');
          let currencyMatch = item.rate.hasOwnProperty(value.currency);
          let notMileage = value.type != 'Mileage';
          let result = dateEqual && currencyMatch && notMileage;
          return result;
        });

        if (currency) {
          console.log('YES', key, currency._id);
          value.curRate = currency._id;
        } else {
          console.log('NO', key);
        }
      });
      message = await postImport.expenseImport(dataArray).catch((err) => {
        throw err;
      });
    }

    if (message.error) {
      error = message.error;
      message = message.msg;
      throw error;
    }

    postImport.deleteFile(myFilePath, 'File deleted after processed!');
    req.flash('success', {
      msg: message
    });
    res.redirect('/travels')
  } catch (err) {
    if (!err instanceof myErrors.imprortFileError) {
      message = 'Something went wrong. Check console log!'
    } else {
      res.status(400);
      message = err.message;
    }
    postImport.deleteFile(myFilePath, 'File deleted after error!');
    req.flash('errors', {
      msg: message
    });
    next(err);
    // res.redirect('/import');
  }
}
