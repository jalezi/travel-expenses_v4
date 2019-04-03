const moment = require('moment');

const Travel = require('../models/Travel');
const Expense = require('../models/Expense');
const Rate = require('../models/Rate');
const Currency = require('../models/Currency');

const findRatesByExactOrClosestDate = require('./findRatesByExactOrClosestDate');
const convertRateToHomeCurrencyRate = require('./convertRateToHomeCurrencyRate');

function checkExpenseDate(expDate, travelDateFrom, travelDateTo) {
  console.log('checkExpenseDate', expDate.toISOString(), travelDateFrom.toISOString(), travelDateTo.toISOString());
  if (expDate < travelDateFrom || expDate > travelDateTo) {
    return true;
  } else {
    return false;
  }
}

module.exports = async (travel, rates) => {
  console.log('updateExpensesToMatchTravelRangeDates');
  const dateFrom = moment(travel.dateFrom);
  const dateTo = moment(travel.dateTo);
  const travelHomeCurrency = travel.homeCurrency;
  const expenses = travel.expenses;
  console.log('travel dateFrom', travel.dateFrom.toISOString());
  // console.log(expenses);

  expenses.forEach(async (expense) => {

    if (checkExpenseDate(expense.date, travel.dateFrom, travel.dateTo)) {
      if (expense.date < travel.dateFrom) {
        expense.date = travel.dateFrom;
      } else if (expense.date > travel.dateTo) {
        expense.date = travel.dateTo;
      }
      console.log('expense date', expense.date.toISOString());
      let invoiceCurrency = Object.keys(expense.curRate.rate)[0];
      let iDate = moment(expense.date).format('YYYY-MM-DD')
      let invoiceDate = new Date(iDate);
      Currency.find({date: expense.date}, async (err, curRates) => {

        const filertedRatesFromDB = curRates.filter((item) => {
          return !isNaN(item.rate[invoiceCurrency]);
        });

        if (filertedRatesFromDB.length === 0) {
          let cur = {};
          console.log('No rate for this date and currency in database yet');

          const dateRates = await findRatesByExactOrClosestDate(invoiceDate);
          const convertedRate = await convertRateToHomeCurrencyRate(dateRates.rates, travel.homeCurrency, invoiceCurrency);
          cur[invoiceCurrency] = convertedRate;

          const curRate = new Currency({
            base: travelHomeCurrency,
            date: expense.date,
            rate: cur
          });
          await curRate.save();
          const amountConverted = Number((expense.amount / convertedRate).toFixed(2));
          await Expense.findByIdAndUpdate(expense._id, {
            $set: {
              date: expense.date,
              curRate: curRate._id,
              amountConverted: amountConverted
            }
          })
        } else {
          const convertedRate = filertedRatesFromDB[0].rate[invoiceCurrency];
          const amountConverted = Number((expense.amount / convertedRate).toFixed(2));
          await Expense.findByIdAndUpdate(expense._id, {
            $set: {
              date: expense.date,
              curRate: filertedRatesFromDB[0]._id,
              amountConverted: amountConverted
            }
          })
        }
      });
    }
  })
}
