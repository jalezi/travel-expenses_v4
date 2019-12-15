<<<<<<< HEAD
/* eslint-disable security/detect-object-injection */
/* eslint-disable prefer-destructuring */
// const moment = require('moment');

// const Travel = require('../models/Travel');
const Expense = require('../models/Expense');
// const Rate = require('../models/Rate');
=======
const Expense = require('../models/Expense');
>>>>>>> develop
const Currency = require('../models/Currency');

const { findRatesByExactOrClosestDate } = require('./utils');
const { convertRateToHomeCurrencyRate } = require('./utils');
<<<<<<< HEAD
=======

const { addLogger } = require('../config/logger');

const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);
>>>>>>> develop

// Returns true if expense date is not in travel's dates range
function checkExpenseDate(expDate, travelDateFrom, travelDateTo) {
  const condition = expDate < travelDateFrom || expDate > travelDateTo;
  Logger.debug(`Cheking expense date. Date in travel's dates: ${!condition}`);
  if (condition) {
    return true;
  }
  return false;
}

// Returns new expense, based on travel dates range.
function setNewExpenseDate(expDate, travelDateFrom, travelDateTo) {
  if (expDate < travelDateFrom) {
    Logger.debug(`Expense date is lower than travel date from: ${expDate} < ${travelDateFrom}`);
    return travelDateFrom;
<<<<<<< HEAD
=======
  }
  if (expDate > travelDateTo) {
    Logger.debug(`Expense date is greater than travel date to: ${expDate} > ${travelDateTo}`);
    return travelDateTo;
>>>>>>> develop
  }
  return travelDateTo;
}


/*
Returns new currency object based on user default currency.
Throws Error if something goes wrong
*/
async function createNewCurrency(expenseDate, homeCurrency, invoiceCurrency) {
  Logger.debug('Creating new currency');
  try {
    const cur = {};
    const dateRates = await findRatesByExactOrClosestDate(expenseDate);
<<<<<<< HEAD
    const convertedRate = convertRateToHomeCurrencyRate(dateRates.rates,
      homeCurrency,
      invoiceCurrency);
    // eslint-disable-next-line security/detect-object-injection
=======
    const convertedRate = await convertRateToHomeCurrencyRate(
      dateRates.rates,
      homeCurrency,
      invoiceCurrency
    );
>>>>>>> develop
    cur[invoiceCurrency] = convertedRate;
    const curRate = new Currency({
      base: homeCurrency,
      date: expenseDate,
      rate: cur
    });
<<<<<<< HEAD
=======
    Logger.debug(`New currency: {base: ${curRate.base}, date: ${curRate.date}, rate: ${cur.toString()}}`);
>>>>>>> develop
    return { curRate, convertedRate };
  } catch (err) {
    throw new Error(err);
  }
}

// Updates expense data
async function updateExpense(
  expenseId,
  expenseAmount,
  expenseDate,
  convertedRate,
  rateObjectId
) {
  try {
    const amountConverted = Number((expenseAmount / convertedRate).toFixed(2));
    const doc = await Expense.findByIdAndUpdate(expenseId, {
      $set: {
        date: expenseDate,
        curRate: rateObjectId,
        amountConverted
      }
    });
    return doc;
  } catch (err) {
    throw new Error(err);
  }
}

<<<<<<< HEAD
module.exports = async (travel) => new Promise((resolve, reject) => {
  const dateFrom = travel.dateFrom;
  const dateTo = travel.dateTo;
  const travelHomeCurrency = travel.homeCurrency;
  const expenses = travel.expenses;
  const result = [];

  try {
    expenses.forEach(async (expense) => {
=======
// FIXME Promise executor functions should not be async

/*
  Updates all travel's expenses
  Loops through all expenses
  Checks if expense date is in travel's dates range
  Checks if expense type is mileage

*/
// eslint-disable-next-line no-async-promise-executor
module.exports = async travel => new Promise(async (resolve, reject) => {
  const { dateFrom } = travel;
  const { dateTo } = travel;
  const travelHomeCurrency = travel.homeCurrency;
  const { expenses } = travel;
  const result = [];

  try {
    await expenses.forEach(async expense => {
>>>>>>> develop
      if (checkExpenseDate(expense.date, dateFrom, dateTo)) {
        expense.date = setNewExpenseDate(expense.date, dateFrom, dateTo);

        if (expense.type !== 'Mileage') {
<<<<<<< HEAD
          const invoiceCurrency = Object.keys(expense.curRate.rate)[0];
          Currency.find({
            base: travelHomeCurrency,
            date: expense.date
          },
          async (err, curRates) => {
            // eslint-disable-next-line security/detect-object-injection
            // eslint-disable-next-line max-len
            const filertedRatesFromDB = curRates.filter((item) => !isNaN(item.rate[invoiceCurrency])); // eslint-disable-line no-restricted-globals
            if (filertedRatesFromDB.length === 0) {
              // eslint-disable-next-line max-len
              const { curRate, convertedRate } = await createNewCurrency(expense.date, travelHomeCurrency, invoiceCurrency);
              await curRate.save();
              const rateObjectId = curRate._id;
              await updateExpense(expense._id,
                expense.amount, expense.date, convertedRate, rateObjectId)
                .then((doc) => {
=======
          let invoiceCurrency = Object.keys(expense.curRate.rate)[0];
          Currency.find(
            { base: travelHomeCurrency, date: expense.date },
            async (err, curRates) => {
              const filertedRatesFromDB = curRates.filter(
                // eslint-disable-next-line no-restricted-globals
                item => !isNaN(item.rate[invoiceCurrency])
              );
              if (filertedRatesFromDB.length === 0) {
                const { curRate, convertedRate } = await createNewCurrency(
                  expense.date,
                  travelHomeCurrency,
                  invoiceCurrency
                );
                await curRate.save();
                const rateObjectId = curRate._id;
                await updateExpense(
                  expense._id,
                  expense.amount,
                  expense.date,
                  convertedRate,
                  rateObjectId
                ).then(doc => {
                  result.push(doc);
                  if (result.length === expenses.length) {
                    resolve(result);
                  }
                });
              } else {
                const convertedRate =
                    filertedRatesFromDB[0].rate[invoiceCurrency];
                const rateObjectId = filertedRatesFromDB[0]._id;
                await updateExpense(
                  expense._id,
                  expense.amount,
                  expense.date,
                  convertedRate,
                  rateObjectId
                ).then(doc => {
>>>>>>> develop
                  result.push(doc);
                  if (result.length === expenses.length) {
                    resolve(result);
                  }
                });
<<<<<<< HEAD
            } else {
              // eslint-disable-next-line security/detect-object-injection
              const convertedRate = filertedRatesFromDB[0].rate[invoiceCurrency];
              const rateObjectId = filertedRatesFromDB[0]._id;
              await updateExpense(expense._id,
                expense.amount, expense.date, convertedRate, rateObjectId).then((doc) => {
                result.push(doc);
                if (result.length === expenses.length) {
                  resolve(result);
                }
              });
            }
          });
        } else {
          await expense.save((doc) => {
=======
              }
            }
          );
        } else {
          await expense.save(doc => {
>>>>>>> develop
            result.push(doc);
            if (result.length === expenses.length) {
              resolve(result);
            }
          });
        }
      } else {
        result.push(expense);
        if (result.length === expenses.length) {
          resolve(result);
        }
      }
    });
  } catch (err) {
    reject(new Error(err));
  }
});
