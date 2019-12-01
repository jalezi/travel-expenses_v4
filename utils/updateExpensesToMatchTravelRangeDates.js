/**
 * @module utils/updateExpensesToMatchTravelRangeDates
 */


const Expense = require('../models/Expense');
const Currency = require('../models/Currency');

const { findRatesByExactOrClosestDate } = require('./utils');
const { convertRateToHomeCurrencyRate } = require('./utils');

const { addLogger } = require('../config/logger');

const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);

/**
 * Returns if expense date is not in travel's date range.
 *
 * Either is greater than dateTo or lower than dateFrom.
 *
 * @param {Date} expDate Expense date.
 * @param {Date} travelDateFrom Travel date when the travel starts.
 * @param {Date} travelDateTo Travel date when the travel ends.
 * @returns {boolean} If not in travel dates range true otherwise false.
 */
function checkExpenseDate(expDate, travelDateFrom, travelDateTo) {
  const condition = expDate < travelDateFrom || expDate > travelDateTo;
  Logger.debug(`Cheking expense date. Date in travel's dates: ${!condition}`);
  if (condition) {
    return true;
  }
  return false;
}

/**
 * Returns new expense, based on travel dates range.
 *
 * @param {Date} expDate Expense date.
 * @param {Date} travelDateFrom Travel date when the travel starts.
 * @param {Date} travelDateTo Travel date when the travel ends.
 * @returns {Date} travelDateFrom || travelDateTo
 */
function setNewExpenseDate(expDate, travelDateFrom, travelDateTo) {
  if (expDate < travelDateFrom) {
    Logger.debug(`Expense date is lower than travel date from: ${expDate} < ${travelDateFrom}`);
    return travelDateFrom;
  } if (expDate > travelDateTo) {
    Logger.debug(`Expense date is greater than travel date to: ${expDate} > ${travelDateTo}`);
    return travelDateTo;
  }
}

/**
 * @typedef {Object} NewCurrency
 * @type {Object}
 * @property {Currency} curRate - Currency
 * @property {Number} convertedRate - Converted rate
 */

/**
 * Create new currency object based on user default currency.
 *
 * @param {Date} expensesDate Expense date
 * @param {string} homeCurrency User default currency
 * @param {string} invoiceCurrency Invoice currency
 * @returns {...NewCurrency} {@link NewCurrency} Object with currency object and rate.
 */
async function createNewCurrency(expenseDate, homeCurrency, invoiceCurrency) {
  Logger.debug('Creating new currency');
  try {
    let cur = {};
    const dateRates = await findRatesByExactOrClosestDate(expenseDate);
    const convertedRate = await convertRateToHomeCurrencyRate(
      dateRates.rates,
      homeCurrency,
      invoiceCurrency
    );
    cur[invoiceCurrency] = convertedRate;
    const curRate = new Currency({
      base: homeCurrency,
      date: expenseDate,
      rate: cur
    });
    Logger.debug(`New currency: {base: ${curRate.base}, date: ${curRate.date}, rate: ${cur.toString()}}`);
    /** @type {NewCurrency} */
    return { curRate, convertedRate };
  } catch (err) {
    throw new Error(err);
  }
}

// TODO jsdoc
async function updateExpense(
  expenseId,
  expenseAmount,
  expenseDate,
  convertedRate,
  rateObjectId
) {
  try {
    const amountConverted = Number((expenseAmount / convertedRate).toFixed(2));
    let doc = await Expense.findByIdAndUpdate(expenseId, {
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

// TODO jsdoc
// FIXME Promise executor functions should not be async
// eslint-disable-next-line no-async-promise-executor
module.exports = async travel => new Promise(async (resolve, reject) => {
  const { dateFrom } = travel;
  const { dateTo } = travel;
  const travelHomeCurrency = travel.homeCurrency;
  const { expenses } = travel;
  const result = [];

  try {
    await expenses.forEach(async expense => {
      if (checkExpenseDate(expense.date, dateFrom, dateTo)) {
        expense.date = setNewExpenseDate(expense.date, dateFrom, dateTo);

        if (expense.type !== 'Mileage') {
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
                  result.push(doc);
                  if (result.length === expenses.length) {
                    resolve(result);
                  }
                });
              }
            }
          );
        } else {
          await expense.save(doc => {
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
