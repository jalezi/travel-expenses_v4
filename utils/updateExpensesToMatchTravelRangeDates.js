/* eslint-disable security/detect-object-injection */
/* eslint-disable prefer-destructuring */
// const moment = require('moment');

// const Travel = require('../models/Travel');
const Expense = require('../models/Expense');
// const Rate = require('../models/Rate');
const Currency = require('../models/Currency');

const { findRatesByExactOrClosestDate } = require('./utils');
const { convertRateToHomeCurrencyRate } = require('./utils');

function checkExpenseDate(expDate, travelDateFrom, travelDateTo) {
  if (expDate < travelDateFrom || expDate > travelDateTo) {
    return true;
  }
  return false;
}

function setNewExpenseDate(expDate, travelDateFrom, travelDateTo) {
  if (expDate < travelDateFrom) {
    return travelDateFrom;
  }
  return travelDateTo;
}

async function createNewCurrency(expenseDate, homeCurrency, invoiceCurrency) {
  try {
    const cur = {};
    const dateRates = await findRatesByExactOrClosestDate(expenseDate);
    const convertedRate = convertRateToHomeCurrencyRate(dateRates.rates,
      homeCurrency,
      invoiceCurrency);
    // eslint-disable-next-line security/detect-object-injection
    cur[invoiceCurrency] = convertedRate;
    const curRate = new Currency({
      base: homeCurrency,
      date: expenseDate,
      rate: cur
    });
    return { curRate, convertedRate };
  } catch (err) {
    throw new Error(err);
  }
}

async function updateExpense(expenseId, expenseAmount, expenseDate, convertedRate, rateObjectId) {
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

module.exports = async (travel) => new Promise((resolve, reject) => {
  const dateFrom = travel.dateFrom;
  const dateTo = travel.dateTo;
  const travelHomeCurrency = travel.homeCurrency;
  const expenses = travel.expenses;
  const result = [];

  try {
    expenses.forEach(async (expense) => {
      if (checkExpenseDate(expense.date, dateFrom, dateTo)) {
        expense.date = setNewExpenseDate(expense.date, dateFrom, dateTo);

        if (expense.type !== 'Mileage') {
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
                  result.push(doc);
                  if (result.length === expenses.length) {
                    resolve(result);
                  }
                });
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
