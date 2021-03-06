const _ = require('lodash');
const moment = require('moment');

const LoggerClass = require('../config/LoggerClass');

const Logger = new LoggerClass('import');
const { mainLogger, logger } = Logger;
mainLogger.debug('controllers\\import INITIALIZING!');

const Currency = require('../models/Currency');

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
exports.getImport = async (req, res, next) => {
  const { travels } = res.locals;

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
exports.postImport = async (req, res, next) => {
  logger.debug('Middleware postImport');
  let message = '';
  const { myFile } = req.files;
  let fileNameSplit = myFile.path.split('\\');
  let fileName = fileNameSplit[fileNameSplit.length - 1];
  // const { myFilePath } = req.files.myFile;
  let combinedCurrencies = [];

  try {
    const dataArray = await postImport
      .readCheckFileAndGetData(myFile, req.body.option)
      .catch(err => {
        logger.warn('readCheckFileAndGetData catching error!');
        logger.silly(`Error message: ${err.message}`);
        throw err;
      });
    if (dataArray instanceof Error) {
      logger.warn('dataArray is error');
      logger.silly(`${dataArray.message}`);
      throw dataArray;
    }

    // What is user importing?
    // import travels
    if (req.body.option === 'travels') {
      logger.debug('Importing travels');
      message = await postImport.travelImport(dataArray, req.user._id);
      if (message.error) {
        let { msg, error } = message;
        logger.warn('Importing travels error');
        logger.silly(`${msg}`);
        throw error;
      }
    } else {
      // import expenses
      logger.debug('Importing expenses');
      let getCurrenciesArray = await postImport.expensesImportSetCurrencyArray(
        dataArray,
        req.user._id,
        res.locals.travels
      );
      const { currenciesArray } = getCurrenciesArray;
      let { err } = getCurrenciesArray;
      message = getCurrenciesArray; // do not change!
      if (err) {
        logger.warn(`Experiment error message: ${message}`);
        logger.warn(`getCurrenciesArray error: ${err.message}`);
        throw err;
      }

      // Create new currencies
      const newCurrencies = await postImport
        .expensesImportNewCurrenciesForSave(currenciesArray)
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
        delete value.travelName;
        // find currency for expense
        const currency = await combinedCurrencies
          .sort((a, b) => a.date - b.date)
          .find(item => {
            let dateEqual =
              value.date === moment(item.date).format('YYYY-MM-DD');
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
        throw new myErrors.ImportFileError(
          `No expense belongs to travel. ${message.message}`
        );
      }
      message = await postImport.expenseImport(dataArray).catch(err => {
        throw err;
      });
    }

    // TODO this might be unnecessary
    if (message.error) {
      let { error } = message;
      message = message.msg;
      logger.warn(`This is useful error: ${message}`);
      throw error;
    }

    logger.silly(`${fileName} should be deleted!`);
    postImport.deleteFile(myFile.path, 'File deleted after processed!');
    req.flash('success', {
      msg: message
    });
    res.redirect('/travels');
  } catch (err) {
    logger.silly(`${fileName} should be deleted!`);
    postImport.deleteFile(myFile.path, 'File deleted after error!');
    logger.warn(`Catching error: ${err.message}`);
    let condition =
      !(err instanceof myErrors.ImportFileError) &&
      !(err instanceof myErrors.SaveToDbError);
    if (condition) {
      logger.warn('Not myError!');
      logger.error(err.message);
      next(err);
    } else {
      res.status(500);
      let { message } = err;
      logger.error(`Error: ${err.name}`);
      logger.silly(err);
      req.flash('errors', {
        msg: message
      });
      res.redirect('/import');
    }
  }
};
