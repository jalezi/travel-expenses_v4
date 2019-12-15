/* eslint-disable no-useless-catch */
/* eslint-disable no-return-await */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-async-promise-executor */

// TODO Unnecessary try/catch wrapper.eslint(no-useless-catch)
// TODO iterators/generators require regenerator-runtime,...(no-restricted-syntax)
// TODO Unexpected `await` inside a loop.eslint(no-await-in-loop)
// TODO Redundant use of `await` on a return value.eslint(no-return-await)
// TODO Promise executor functions should not be async.eslint(no-async-promise-executor)

// Functions and methods to import travels and expenses from CSV file.

const mongoose = require('mongoose');
const _ = require('lodash');
const fs = require('fs');
const Papa = require('papaparse');

const User = require('../models/User');
const Travel = require('../models/Travel');
const Expense = require('../models/Expense');
const Currency = require('../models/Currency');

<<<<<<< HEAD
const { ObjectId } = mongoose.Types;

=======
>>>>>>> develop
const constants = require('../lib/constants');
const myErrors = require('../utils/myErrors');

const { addLogger } = require('../config/logger');

const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);

const { ObjectId } = mongoose.Types;

// Reads and parses CSV file
async function readAndParseFile(filePath, enc = 'utf8') {
  Logger.debug(
    `Reading and parsing CSV file\npath: ${filePath}\nencoding: ${enc}`
  );
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
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
<<<<<<< HEAD
    return err;
  }
}

// delete uploaded file
function deleteFile(filePath, message = '') {
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (fs.existsSync(filePath)) {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
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
=======
    Logger.error(err);
    throw err;
  }
}


// Returns Error with message on condition is true
>>>>>>> develop
async function checkFileFor(condition, message) {
  const suffix =
    'File should be a CSV with header in first line and not empty!';
  try {
    if (condition) {
      return new myErrors.ImportFileError(`${message} - ${suffix}`);
    }
  } catch (err) {
    return err;
  }
}

<<<<<<< HEAD
// check if file is not empty, CSV or it was not selected
const checkFile = (myFile) => new Promise((resolve) => {
  const tripleCheck = () => {
    let error;
    try {
      error = checkFileFor(myFile.name === '', 'No file selected!');
      // if (error) { return error; }
      error = checkFileFor(myFile.size === 0, 'Empty file!');
      // if (error) { return error; }
      error = checkFileFor(myFile.path.split('.').pop() !== 'csv', 'Not a CSV file!');
      // if (error) { return error; }
      resolve(error);
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
=======
/*
 Checks if file is valid file
 Promise object represents undefined or specific error
 */
const checkFile = myFile =>
  new Promise(resolve => {
    Logger.debug('Checking file for errors');
    let error;

    /*
     Checks if user is trying to import wrong file.
     Checks if file is not empty, CSV or it was not selected
     */
    const tripleCheck = async () => {
      Logger.silly('Beggining of triple check for errors in selected file');
      try {
        error = await checkFileFor(myFile.name === '', 'No file selected!');
        if (error) {
          return error;
        }
        error = await checkFileFor(myFile.size === 0, 'Empty file!');
        if (error) {
          return error;
        }
        error = await checkFileFor(
          myFile.path.split('.').pop() !== 'csv',
          'Not a CSV file!'
        );
        if (error) {
          return error;
        }
        Logger.silly('Triple check. No errors');
        return;
      } catch (err) {
        Logger.warn(`Selected file is not OK\n${err}`);
        return err;
      }
    };

    tripleCheck()
      .then(result => {
        Logger.debug(`File triple check => ${result}`);
        resolve(result);
      })
      .catch(err => {
        Logger.error(err);
        resolve(err);
      });
  });

>>>>>>> develop

// Creates currency object
function createCurrency(value) {
  Logger.debug(`Creating currency from: ${value}`);
  const currency = {};
  const curRate = {};
  currency.base = value.base;
  currency.date = new Date(value.date);
  curRate[value.currency] = Number(value.rate);
  currency.rate = curRate;
  Logger.silly(`Create currency: ${currency}\nfrom value: ${value}`);
  return currency;
}

<<<<<<< HEAD
// return currency if currency doesn't exist in DB
const getOnlyNewCurrency = (currency, value) => new Promise((resolve) => {
  if (!currency) {
    return resolve(value);
  }
  return resolve();
});
=======
/*
 Middleware function when importing expenses
 Returns currency if currency doesn't exist
 Promise object represents undefined or value object
 */
const getOnlyNewCurrency = (currency, value) =>
  new Promise(resolve => {
    Logger.silly(`@param currency: ${currency}, @param value: ${value}`);
    if (!currency) {
      return resolve(value);
    }
    return resolve();
  });

>>>>>>> develop

/*
 Updates traves after with imported expenses
 Returns updated travels
 Promise object represents error or updated travels
 */
<<<<<<< HEAD
async function expensesImportNewCurrenciesForSave(array) {
  const notExistingCurrenciesDB = [];
  const existingCurrenciesDB = [];
  return new Promise((resolve, reject) => {
    // TODO fix this
    // eslint-disable-next-line no-restricted-syntax
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
=======
const updateTravels = async (uniqueTravelObjectIds, expenses) =>
  new Promise(async resolve => {
    try {
      const updatedTravels = await _.forEach(
        uniqueTravelObjectIds,
        async value => {
          const travelExpensesObjectIds = expenses.filter(
            item => item.travel === value
          );

          const aggr = await Expense.aggregate([
            { $match: { travel: new ObjectId(value) } },
            { $group: { _id: '$travel', total: { $sum: '$amountConverted' } } }
          ]);

          await Travel.findByIdAndUpdate(
            value,
            {
              $addToSet: {
                expenses: {
                  $each: travelExpensesObjectIds
                }
              },
              $set: { total: aggr[0].total }
            },
            { new: true }
          );
>>>>>>> develop
        }
      );
      resolve(updatedTravels);
    } catch (err) {
      resolve(err);
    }
<<<<<<< HEAD
    resolve({ notExistingCurrenciesDB, existingCurrenciesDB });
=======
>>>>>>> develop
  });

<<<<<<< HEAD
/* read file, check file and return data or error
 * if file is not validate return custom error ImportFileError otherwise
 * return array with expenses data
=======

/*
 Reads, checks file and returns data or error
 Returns array with expenses data.
 Throws custom error ImportFileError
>>>>>>> develop
 */
async function readCheckFileAndGetData(myFile, option) {
  Logger.debug('Check file and get data if no error in file or data');
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
    Logger.debug('Checking if file is CSV, not empty or not even selected');
    error = await checkFile(myFile).catch(err => {
      throw err;
    });
    if (error) {
      throw error;
    }

    // no error - file is CSV & has some data
    Logger.debug('No error - file is CSV & has some data');
    const parsedData = await readAndParseFile(myFilePath);
    /** @type {Papa.ParseResult.data} */
    const dataArray = parsedData.data;

    // check if data has matching header
    const parsedHeaderArray = parsedData.meta.fields;
    error = await checkFileFor(
      !_.isEqual(headerToBe, parsedHeaderArray),
      `Header should be: ${headerToBe}`
    ).catch(err => {
      Logger.error(`Catching and throwing error in checkFileFor => ${err}`);
      throw err;
    });
    if (error) {
      Logger.error(`Throwing error after checkFileFor => ${error}`);
      throw error;
    }
    return dataArray;
  } catch (err) {
    Logger.error(`Returning error in try/catch => ${err}`);
    return err;
  }
}


// Deletes uploaded file from server
function deleteFile(filePath, message = '') {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, err => {
        if (err) {
          throw err;
        }
        Logger.debug(message);
      });
    }
  } catch (err) {
    Logger.error(`File: ${filePath} not deleted!`);
    Logger.error(err);
    throw err;
  }
}


/*
 Gets and prepares currencies from imported file.
 Removes rate & base from passed array dataArray
 Adds property _user to passed array dataArray
 Adds property curRate to passed array dataArray
 Returns currencies array and message or error and message
 */
async function expensesImportSetCurrencyArray(dataArray, userId, travels) {
  Logger.debug('Setting currencies array for expenseImport');
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
      const travel = await travels.find(item => {
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
        // eslint-disable-next-line security/detect-object-injection
        object[key].travel = travel._id;
      }
    });

<<<<<<< HEAD
    // delete expenses that not belong to any existing travel
    // TODO fix this
    // eslint-disable-next-line no-restricted-syntax
    for (const value of noTravelKeys.sort((a, b) => b - a)) {
=======
    // delete expenses that don't belong to any existing travel
    for (let value of noTravelKeys.sort((a, b) => b - a)) {
>>>>>>> develop
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
<<<<<<< HEAD
    // eslint-disable-next-line max-len
    currenciesArray = [...new Map(currenciesArray.map((o) => [JSON.stringify(o), o])).values()].sort((a, b) =>
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      a.date - b.date);
=======
    currenciesArray = [
      ...new Map(currenciesArray.map(o => [JSON.stringify(o), o])).values()
    ].sort(
      (a, b) =>
        /*
         Turn your strings into dates, and then subtract them
         to get a value that is either negative, positive, or zero.
         */
        a.date - b.date
    );
>>>>>>> develop

    const expensesCountAfter = dataArray.length;
    const invalidExpensesCount = expensesCountBefore - expensesCountAfter;
    const validExpensesCount = expensesCountBefore - invalidExpensesCount;
    message = `INVALID EXPENSES: ${invalidExpensesCount}. VALID EXPENSES: ${validExpensesCount}`;
    Logger.debug(message);
    return { currenciesArray, message };
  } catch (err) {
    message = 'Something went wrong during expenses import! Check console log!';
    Logger.error(message);
    Logger.error(err);
    return { err, message };
  }
}

<<<<<<< HEAD
// eslint-disable-next-line func-names
const updateTravels = function (uniqueTravelObjectIds) {
  return new Promise(((resolve) => {
    try {
      const updatedTravels = _.forEach(uniqueTravelObjectIds, async (value) => {
        // const travelExpensesObjectIds = expenses.filter((item) => item.travel === value);


        Expense.aggregate([
          { $match: { travel: new ObjectId(value) } },
          { $group: { _id: '$travel', total: { $sum: '$amountConverted' } } }
        ]);
      });
      resolve(updatedTravels);
    } catch (err) {
      resolve(err);
=======

/*
 Prepares new currencies which will save later.
 Checks if currencies are only in DB and return array with new currencies
 Resolves object with 2 arrays. Currencies NOT in DB and in DB.
 Rejects error
 */
async function expensesImportNewCurrenciesForSave(array) {
  Logger.debug('expensesImport - New Currencies For Save');
  const notExistingCurrenciesDB = [];
  const existingCurrenciesDB = [];
  return await new Promise(async (resolve, reject) => {
    for (let value of array) {
      const currency = await Currency.findOne(
        {
          base: value.base,
          date: value.date,
          rate: value.rate
        },
        err => {
          if (err) {
            console.log('Error: ', err.message);
            throw err;
          }
        }
      );
      await getOnlyNewCurrency(currency, value)
        .then(value => {
          if (value) {
            notExistingCurrenciesDB.push(value);
          } else {
            existingCurrenciesDB.push(currency);
          }
        })
        .catch(err => {
          reject(err);
        });
>>>>>>> develop
    }
    return resolve({ notExistingCurrenciesDB, existingCurrenciesDB });
  });
}

<<<<<<< HEAD
// eslint-disable-next-line func-names
const expenseImport = function (dataArray) {
  return new Promise(((resolve) => {
    try {
      Expense.insertMany(dataArray)
        .then((expenses) => {
          console.log(expenses);
          if (!expenses) {
            resolve(new myErrors.SaveToDbError('No expenses saved!'));
          }
          const travelObjectIds = expenses.map((expense) => expense.travel);
          const uniqueTravelObjectIds = [...new Set(travelObjectIds)];
          return expenses, uniqueTravelObjectIds;
        })
        .then((expenses, uniqueTravelObjectIds) => {
          const updatedTravels = updateTravels(uniqueTravelObjectIds,
            expenses).catch((err) => {
            console.log('update Travels', err);
            resolve(new myErrors.SaveToDbError('Something went wrong during updating travels with expenses!'));
          });

          const message = `${expenses.length} imported. ${updatedTravels.length} travels updated!`;
          resolve(message);
        })
        .catch((err) => {
          console.log(err);
          resolve(new myErrors.SaveToDbError('Something went wrong during saving expenses to DB!'));
        });
=======
// TODO Check if expense is already in DB
// https://stackoverflow.com/questions/8389811/how-to-query-mongodb-to-test-if-an-item-exists
/*
 Inserts expenses in DB
 Promise
 Resolves on success with message, on error with error object
 */
const expenseImport = async dataArray =>
  new Promise(async resolve => {
    Logger.debug('Expense Import');
    try {
      const expenses = await Expense.insertMany(dataArray).catch(err => {
        Logger.error(err);
        throw new myErrors.SaveToDbError(
          'Something went wrong during saving expenses to DB!'
        );
      });
      if (!expenses) {
        throw new myErrors.SaveToDbError('No expenses saved!');
      }
      const travelObjectIds = expenses.map(expense => expense.travel);
      const uniqueTravelObjectIds = [...new Set(travelObjectIds)];
      const updatedTravels = await updateTravels(
        uniqueTravelObjectIds,
        expenses
      ).catch(err => {
        Logger.error(err);
        throw new myErrors.SaveToDbError(
          'Something went wrong during updating travels with expenses!'
        );
      });

      const message = `${expenses.length} imported. ${updatedTravels.length} travels updated!`;
      Logger.info(message);
      resolve(message);
>>>>>>> develop
    } catch (err) {
      Logger.error('Something went wrong during expense import!');
      Logger.error(err);
      resolve({
        error: err,
        msg: 'Something went wrong during expense import!'
      });
    }
  });

<<<<<<< HEAD
const hello = async (dataArray) => {
  await Travel.insertMany(dataArray).catch((err) => {
    console.dir(Object.keys(err.errors));
    switch (err.name) {
      case 'ValidationError':
        throw new myErrors.SaveToDbError(`${Object.keys(err.errors).toString()} in wrong format! Check input file`);
      default:
        throw new myErrors.SaveToDbError(`${err.message}`);
    }
  });
};

=======
// TODO Check if travel is already in DB
/*
 Inserts travels in DB
 Returns Promise
 Promise resolves on success with message, on error with error object
 */
>>>>>>> develop
async function travelImport(dataArray, userId) {
  Logger.debug('Travel import');
  let message = '';
<<<<<<< HEAD
  return new Promise((resolve) => {
    try {
      // add user._id to travel
      _.forEach(dataArray, (value) => {
=======
  return new Promise(async resolve => {
    try {
      // add user._id to travel
      await _.forEach(dataArray, value => {
>>>>>>> develop
        value._user = userId;
        value.total = Number(0).toFixed(2);
      });

      // insert travels and update user with travel._id
<<<<<<< HEAD
      hello(dataArray).then((travels) => {
        console.log('hello', travels);
        if (travels instanceof Error) {
          throw travels;
        }
        if (!travels) {
          throw new myErrors.SaveToDbError('No travels saved!');
        }
        const travelObjectIds = travels.map((travel) => travel._id);
        User.findByIdAndUpdate(userId, {
          $addToSet: {
            travels: {
              $each: travelObjectIds
            }
          }
        }).catch(() => {
          throw new myErrors.SaveToDbError('Something went wrong during updating user with travels!');
        });

        message = `${travelObjectIds.length} travels added successfully!`;
        resolve(message);
      }).catch((err) => {
        resolve({
          error: err,
          msg: 'Something went wrong during travel import!'
        });
      });
=======
      const travels = await Travel.insertMany(dataArray).catch(err => {
        Logger.error(err);
        throw new myErrors.SaveToDbError(
          'Something went wrong during saving to DB!'
        );
      });

      if (!travels) {
        throw new myErrors.SaveToDbError('No travels saved!');
      }

      const travelObjectIds = travels.map(travel => travel._id);
      await User.findByIdAndUpdate(userId, {
        $addToSet: {
          travels: {
            $each: travelObjectIds
          }
        }
      }).catch(err => {
        Logger.error('Something went wrong during updating user with travels');
        Logger.error(err);
        throw new myErrors.SaveToDbError(
          'Something went wrong during updating user with travels!'
        );
      });

      message = `${travelObjectIds.length} travels added successfully!`;
      Logger.info(message);
      resolve(message);
>>>>>>> develop
    } catch (err) {
      Logger.error('Something went wrong during travel import!');
      Logger.error(err);
      resolve({
        error: err,
        msg: 'Something went wrong during travel import!'
      });
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
