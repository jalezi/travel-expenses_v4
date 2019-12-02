const _ = require('lodash');
const moment = require('moment');

const Currency = require('../models/Currency');

const postImport = require('../utils/postImport');
const myErrors = require('../utils/myErrors');

const { addLogger } = require('../config/logger');

// Logger
const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);


// TODO Change form. At the moment expenses import is only for multiple expenses.
/**
 * GET /import
 * Page with import form.
 * You can chooses between travels or expenses import.
 */
exports.getImport = async (req, res, next) => {
  const { travels } = res.locals;

  res.render('travels/import', {
    title: 'Import',
    travels
  });
};

/**
 * POST /import
 * Import travels or expenses from CSV files.
 */
exports.postImport = async (req, res, next) => {
  Logger.debug('Middleware postImport');
  let message = '';
  const { myFile } = req.files;
  const myFilePath = req.files.myFile.path;
  let combinedCurrencies = [];

  try {
    const dataArray = await postImport.readCheckFileAndGetData(myFile, req.body.option)
      .catch(err => {
        Logger.error(`Catching error: ${err.message}`);
        throw err;
      });
    if (dataArray instanceof Error) {
      Logger.error(`dataArray is error: ${dataArray.message}`);
      throw dataArray;
    }

    // What is user importing?
    // import travels
    if (req.body.option === 'travels') {
      Logger.debug('Importing travels');
      message = await postImport.travelImport(dataArray, req.user._id);
      if (message.error) {
        let { error } = message;
        message = message.msg;
        Logger.error(`Importing travels error: ${message}`);
        throw error;
      }
    } else {
    // import expenses
      Logger.debug('Importing expenses');
      let getCurrenciesArray = await postImport.expensesImportSetCurrencyArray(
        dataArray, req.user._id, res.locals.travels
      );
      const { currenciesArray } = getCurrenciesArray;
      message = getCurrenciesArray.message;
      let error = getCurrenciesArray.err;
      if (error) {
        Logger.error(`getCurrenciesArray error: ${error.message}`);
        throw error;
      }

      // Create new currencies
      const newCurrencies = await postImport.expensesImportNewCurrenciesForSave(currenciesArray)
        .catch(err => {
          Logger.error(`newCurrencies error: ${err.message}`);
          throw err;
        });
      let insertedCurrencies = await Currency.insertMany(newCurrencies.notExistingCurrenciesDB);
      combinedCurrencies = insertedCurrencies.concat(newCurrencies.existingCurrenciesDB);

      // loop trough imported data
      await _.forEach(dataArray, async value => {
        delete value.travelName;
        // find currency for expense
        const currency = await combinedCurrencies
          .sort((a, b) => a.date - b.date)
          .find(item => {
            let dateEqual = value.date === moment(item.date).format('YYYY-MM-DD');
            // eslint-disable-next-line no-prototype-builtins
            let currencyMatch = item.rate.hasOwnProperty(value.currency);
            let notMileage = value.type !== 'Mileage';
            let result = dateEqual && currencyMatch && notMileage;
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
      message = await postImport.expenseImport(dataArray).catch(err => {
        throw err;
      });
    }

    // TODO this might be unnecessary
    if (message.error) {
      Logger.warn('This is usefull');
      let { error } = message;
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
    Logger.error(`Catching error: ${err.message}`);
    if (!(err instanceof myErrors.ImportFileError)) {
      message = err.message;
      Logger.warn('Error is not instance of ImportFileError');
      next(err);
    } else {
      res.status(500);
      message = err.message;
      Logger.warn('Error is instance of ImportFIleError');
      req.flash('errors', {
        msg: message
      });
      res.redirect('/import');
    }
  }
};
