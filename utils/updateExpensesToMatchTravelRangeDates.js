const moment = require('moment');

const Travel = require('../models/Travel');
const Expense = require('../models/Expense');
const Rate = require('../models/Rate');
const Currency = require('../models/Currency');

const findRatesByExactOrClosestDate = require('./findRatesByExactOrClosestDate');
const convertRateToHomeCurrencyRate = require('./convertRateToHomeCurrencyRate');

function checkExpenseDate(expDate, travelDateFrom, travelDateTo) {
  if (expDate < travelDateFrom || expDate > travelDateTo) {
    return true;
  } else {
    return false;
  }
}

function setNewExpenseDate(expDate, travelDateFrom, travelDateTo) {
  if (expDate < travelDateFrom) {
    return travelDateFrom;
  } else if (expDate > travelDateTo) {
    return travelDateTo;
  }
}

async function createNewCurrency(expenseDate, homeCurrency, invoiceCurrency) {
  try {
    let cur = {};
    const dateRates = await findRatesByExactOrClosestDate(expenseDate);
    const convertedRate = await convertRateToHomeCurrencyRate(dateRates.rates, homeCurrency, invoiceCurrency);
    cur[invoiceCurrency] = convertedRate;
    const curRate = new Currency({
      base: homeCurrency,
      date: expenseDate,
      rate: cur
    });
    return {curRate, convertedRate};
  } catch (err) {
    throw new Error(err);
}
}

async function updateExpense(expenseId, expenseAmount, expenseDate, convertedRate, rateObjectId) {
  try {
    const amountConverted = Number((expenseAmount / convertedRate).toFixed(2));
    await Expense.findByIdAndUpdate(expenseId, {
      $set: {
        date: expenseDate,
        curRate: rateObjectId,
        amountConverted: amountConverted
      }
    })
  } catch (e) {
    throw new Error(err);
  }
}

module.exports = async (travel, rates) => {
  const dateFrom = travel.dateFrom;
  const dateTo = travel.dateTo;
  const travelHomeCurrency = travel.homeCurrency;
  const expenses = travel.expenses;

  try {
    expenses.forEach(async (expense) => {

      if (checkExpenseDate(expense.date, dateFrom, dateTo)) {
        expense.date = setNewExpenseDate(expense.date, dateFrom, dateTo);

        if (expense.type != 'Mileage') {
          let invoiceCurrency = Object.keys(expense.curRate.rate)[0];
          Currency.find({base: travelHomeCurrency, date: expense.date}, async (err, curRates) => {
            const filertedRatesFromDB = curRates.filter((item) => {
              return !isNaN(item.rate[invoiceCurrency]);
            });

            if (filertedRatesFromDB.length === 0) {
              const {curRate, convertedRate} = await createNewCurrency(expense.date, travelHomeCurrency, invoiceCurrency);
              await curRate.save();
              const rateObjectId = curRate._id
              await updateExpense(expense._id, expense.amount, expense.date, convertedRate, rateObjectId);
              // const amountConverted = Number((expense.amount / convertedRate).toFixed(2));
              // await Expense.findByIdAndUpdate(expense._id, {
              //   $set: {
              //     date: expense.date,
              //     curRate: curRate._id,
              //     amountConverted: amountConverted
              //   }
              // });
            } else {
              const convertedRate = filertedRatesFromDB[0].rate[invoiceCurrency];
              const rateObjectId = filertedRatesFromDB[0]._id
              await updateExpense(expense._id, expense.amount, expense.date, convertedRate, rateObjectId);
              // const amountConverted = Number((expense.amount / convertedRate).toFixed(2));
              // await Expense.findByIdAndUpdate(expense._id, {
              //   $set: {
              //     date: expense.date,
              //     curRate: filertedRatesFromDB[0]._id,
              //     amountConverted: amountConverted
              //   }
              // })
            }
          });
        } else {
          await expense.save();
        }
      }
    });
  } catch (err) {
    throw new Error(err)
  }
}
