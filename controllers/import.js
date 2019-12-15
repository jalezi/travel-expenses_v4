<<<<<<< HEAD
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
=======
const _ = require('lodash');
const moment = require('moment');

const LoggerClass = require('../config/LoggerClass');

const Logger = new LoggerClass('import');
const { mainLogger, logger } = Logger;
mainLogger.debug('controllers\\import INITIALIZING!');

const Currency = require('../models/Currency');

>>>>>>> develop
const postImport = require('../utils/postImport');
const myErrors = require('../utils/myErrors');

/**
 * Import routes
 * @module controllers/import
 * @requires module:config/LoggerClass
 * @requires module:models/Currency
 * @requires module:utils/postImport
 * @requires module:utils/myErrors
 * @see {@link https://www.npmjs.com/package/lodash NPM:lodash}
 * @see {@link https://www.npmjs.com/package/moment NPM:moment}
 */

// TODO Change form. At the moment expenses import is only for multiple expenses.
/**
 * GET /import
 *
 * Page with import form.
 * You can chooses between travels or expenses import.
 * @param {http.request} req
 * @param {http.response} res
 * @param {function} next
 */
<<<<<<< HEAD
exports.getImport = async function (req, res, next) {
  const travels = res.locals.travels;
=======
exports.getImport = async (req, res, next) => {
  const { travels } = res.locals;
>>>>>>> develop

  res.render('travels/import', {
    title: 'Import',
    travels
  });
};

/**
 * POST /import
 *
 * Import travels or expenses from CSV files.
 * @param {http.request} req
 * @param {http.response} res
 * @param {function} next
 */
<<<<<<< HEAD
exports.postImport = async function (req, res, next) {
=======
exports.postImport = async (req, res, next) => {
  logger.debug('Middleware postImport');
>>>>>>> develop
  let message = '';
  const { myFile } = req.files;
  const myFilePath = req.files.myFile.path;
  let combinedCurrencies = [];

  try {
    const dataArray = await postImport
      .readCheckFileAndGetData(myFile, req.body.option)
<<<<<<< HEAD
      .catch((err) => {
        throw err;
      });
    if (dataArray instanceof Error) {
=======
      .catch(err => {
        logger.error(`Catching error: ${err.message}`);
        throw err;
      });
    if (dataArray instanceof Error) {
      logger.error(`dataArray is error: ${dataArray.message}`);
>>>>>>> develop
      throw dataArray;
    }

    // What is user importing?
    // import travels
    if (req.body.option === 'travels') {
      logger.debug('Importing travels');
      message = await postImport.travelImport(dataArray, req.user._id);
      if (message.error) {
<<<<<<< HEAD
        const error = message.error;
=======
        let { error } = message;
>>>>>>> develop
        message = message.msg;
        logger.error(`Importing travels error: ${message}`);
        throw error;
      }
    } else {
      // import expenses
<<<<<<< HEAD
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
=======
      logger.debug('Importing expenses');
      let getCurrenciesArray = await postImport.expensesImportSetCurrencyArray(
        dataArray,
        req.user._id,
        res.locals.travels
      );
      const { currenciesArray } = getCurrenciesArray;
      message = getCurrenciesArray.message;
      let error = getCurrenciesArray.err;
      if (error) {
        logger.error(`getCurrenciesArray error: ${error.message}`);
>>>>>>> develop
        throw error;
      }

      // Create new currencies
      const newCurrencies = await postImport
        .expensesImportNewCurrenciesForSave(currenciesArray)
<<<<<<< HEAD
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
=======
        .catch(err => {
          logger.error(`newCurrencies error: ${err.message}`);
          throw err;
        });
      let insertedCurrencies = await Currency.insertMany(
        newCurrencies.notExistingCurrenciesDB
      );
      combinedCurrencies = insertedCurrencies.concat(
        newCurrencies.existingCurrenciesDB
      );

      // loop trough imported data
      await _.forEach(dataArray, async value => {
>>>>>>> develop
        delete value.travelName;
        // find currency for expense
        const currency = await combinedCurrencies
          .sort((a, b) => a.date - b.date)
<<<<<<< HEAD
          .find((item) => {
            const dateEqual = value.date === moment(item.date).format('YYYY-MM-DD');
            // eslint-disable-next-line no-prototype-builtins
            const currencyMatch = item.rate.hasOwnProperty(value.currency);
            const notMileage = value.type !== 'Mileage';
            const result = dateEqual && currencyMatch && notMileage;
=======
          .find(item => {
            let dateEqual =
              value.date === moment(item.date).format('YYYY-MM-DD');
            // eslint-disable-next-line no-prototype-builtins
            let currencyMatch = item.rate.hasOwnProperty(value.currency);
            let notMileage = value.type !== 'Mileage';
            let result = dateEqual && currencyMatch && notMileage;
>>>>>>> develop
            return result;
          });

        // set currency id for expense if currency exist in DB
        if (currency) {
          value.curRate = currency._id;
        }
      });

      // Check if imported file has no data
      if (dataArray.length === 0) {
<<<<<<< HEAD
        throw new myErrors.ImportFileError('Nothing to import! File has wrong data!');
=======
        throw new myErrors.ImportFileError(
          'Nothing to import! File has wrong data!'
        );
>>>>>>> develop
      }
      message = await postImport.expenseImport(dataArray).catch(err => {
        throw err;
      });
    }

    // TODO this might be unnecessary
    if (message.error) {
<<<<<<< HEAD
      const error = message.error;
=======
      logger.warn('This is usefull');
      let { error } = message;
>>>>>>> develop
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
<<<<<<< HEAD
    if (err instanceof myErrors.ImportFileError) {
      res.status(400);
=======
    logger.error(`Catching error: ${err.message}`);
    if (!(err instanceof myErrors.ImportFileError)) {
      message = err.message;
      logger.warn('Error is not instance of ImportFileError');
      next(err);
    } else {
      res.status(500);
>>>>>>> develop
      message = err.message;
      logger.warn('Error is instance of ImportFIleError');
      req.flash('errors', {
        msg: message
      });
      res.redirect('/import');
    } else {
      message = 'Something went wrong. Check console log!';
      next(err);
    }
  }
};
