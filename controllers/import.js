/* eslint-disable func-names */
/* eslint-disable prefer-destructuring */
// const mongoose = require('mongoose');
const _ = require('lodash');
const moment = require('moment');
// const fs = require('fs');
// const Papa = require('papaparse');

// const User = require('../models/User');
// const Travel = require('../models/Travel');
// const Expense = require('../models/Expense');
// const Rate = require('../models/Rate');
const Currency = require('../models/Currency');

// const { ObjectId } = mongoose.Types;

// const {expenseTypes} = require('../lib/globals');
// const constants = require('../lib/constants');
const postImport = require('../utils/postImport');
const myErrors = require('../utils/myErrors');

/*
 * GET /import
 * Page with import form.
 * You can chooses between travels or expenses import.
 * TODO Change form. At the moment expenses import is only for multiple expenses.
 */
exports.getImport = async function (req, res, next) {
  const travels = res.locals.travels;

  res.render('travels/import', {
    title: 'Import',
    travels
  });
};

/*
 * POST /import
 * Import travels or expenses from CSV files.
 */
exports.postImport = async function (req, res, next) {
  let message = '';
  const myFile = req.files.myFile;
  const myFilePath = req.files.myFile.path;
  let combinedCurrencies = [];

  try {
    const dataArray = await postImport
      .readCheckFileAndGetData(myFile, req.body.option)
      .catch((err) => {
        throw err;
      });
    if (dataArray instanceof Error) {
      throw dataArray;
    }

    // What is user importing?
    // import travels
    if (req.body.option === 'travels') {
      message = await postImport.travelImport(dataArray, req.user._id);
      if (message.error) {
        const error = message.error;
        message = message.msg;
        throw error;
      }
    } else {
      // import expenses
      // eslint-disable-next-line function-paren-newline
      const getCurrenciesArray = await postImport.expensesImportSetCurrencyArray(
        dataArray,
        req.user._id,
        res.locals.travels
      // eslint-disable-next-line function-paren-newline
      );
      const currenciesArray = getCurrenciesArray.currenciesArray;
      message = getCurrenciesArray.message;
      const error = getCurrenciesArray.err;
      if (error) {
        throw error;
      }

      // Create new currencies
      const newCurrencies = await postImport
        .expensesImportNewCurrenciesForSave(currenciesArray)
        .catch((err) => {
          throw err;
        });
      const insertedCurrencies = await Currency.insertMany(newCurrencies.notExistingCurrenciesDB);
      // eslint-disable-next-line function-paren-newline
      combinedCurrencies = insertedCurrencies.concat(
        newCurrencies.existingCurrenciesDB
      // eslint-disable-next-line function-paren-newline
      );

      // loop trough imported data
      await _.forEach(dataArray, async (value) => {
        delete value.travelName;
        // find currency for expense
        const currency = await combinedCurrencies
          .sort((a, b) => a.date - b.date)
          .find((item) => {
            const dateEqual = value.date === moment(item.date).format('YYYY-MM-DD');
            // eslint-disable-next-line no-prototype-builtins
            const currencyMatch = item.rate.hasOwnProperty(value.currency);
            const notMileage = value.type !== 'Mileage';
            const result = dateEqual && currencyMatch && notMileage;
            return result;
          });

        // set currency id for expense if currency exist in DB
        if (currency) {
          value.curRate = currency._id;
        }
      });

      // Check if imported file has no data
      if (dataArray.length === 0) {
        throw new myErrors.ImportFileError('Nothing to import! File has wrong data!');
      }
      message = await postImport.expenseImport(dataArray).catch((err) => {
        throw err;
      });
    }

    if (message.error) {
      const error = message.error;
      message = message.msg;
      throw error;
    }

    postImport.deleteFile(myFilePath, 'File deleted after processed!');
    req.flash('success', {
      msg: message
    });
    res.redirect('/travels');
  } catch (err) {
    postImport.deleteFile(myFilePath, 'File deleted after error!');
    if (!err instanceof myErrors.ImportFileError) {
      message = 'Something went wrong. Check console log!';
      next(err);
    } else {
      res.status(400);
      message = err.message;
      req.flash('errors', {
        msg: message
      });
      res.redirect('/import');
    }
  }
};
