const moment = require('moment');

const Travel = require('../models/Travel');
const Expense = require('../models/Expense');
const Rate = require('../models/Rate');
const Currency = require('../models/Currency');

const findRatesByExactOrClosestDate = require('./findRatesByExactOrClosestDate');

const checkCurrenciesArray = (dateFrom, dateTo, travelCurrencies, expenses, travel) => {
  const newObject = {};
  let trCurKeys = Object.keys(travelCurrencies);

  for (let d = dateFrom; d <= dateTo; d.add(1, 'days')) {
    const day = moment(d).format('YYYY-MM-DD');
    let inArayTest = trCurKeys.includes(day);
    if (!inArayTest) {
      // console.log(inArayTest);
      newObject[day] = [];
    } else {
      // console.log(inArayTest);
      newObject[day] = travelCurrencies[day]
    }
  }
  trCurKeys = Object.keys(newObject);
  expenses.forEach((expense) => {
    const day = moment(d).format('YYYY-MM-DD');
    const cur = expense.invoiceCurrency;
    let rates = Rate.findRatesOnDate(getTravels);
    if (rates.length === 0) {
      rates = Rate.findRateBeforeOrAfterDate(travel)
    }
  });

  return newObject;
}

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

        const x = curRates.filter((item) => {
          return !isNaN(item.rate[invoiceCurrency]);
        })
        // console.log('x', x);
        if (x.length === 0) {
          let cur = {};

          // const condition = {$or: [
          //   {date: invoiceDate},
          //   {date: {$gte: invoiceDate}},
          //   {date: {$lte: invoiceDate}}
          // ]};

          const dateRates = await findRatesByExactOrClosestDate(invoiceDate);
          console.log('dateRates date', dateRates.date.toISOString());
          cur[invoiceCurrency] = Number((dateRates.rates[invoiceCurrency]).toFixed(2));
          const curRate = new Currency({
            base: travelHomeCurrency,
            date: expense.date,
            rate: cur
          });
          await curRate.save();
          expense.curRate = curRate._id
          await Expense.findByIdAndUpdate(expense._id, {
            $set: {
              date: expense.date,
              curRate: curRate._id
            }
          })

          // await Rate.findOne(condition, async (err, item) => {
          //   // console.log(item);
          //   cur[invoiceCurrency] = item.rates[invoiceCurrency];
          //   // console.log(cur);
          //   const curRate = new Currency({
          //     base: travelHomeCurrency,
          //     date: expense.date,
          //     rate: cur
          //   });
          //   await curRate.save();
          //   expense.curRate = curRate._id
          //   await Expense.findByIdAndUpdate(expense._id, {
          //     $set: {
          //       date: expense.date,
          //       curRate: curRate._id
          //     }
          //   })
          // }).sort({date: 0});
        } else {
          await Expense.findByIdAndUpdate(expense._id, {
            $set: {
              date: expense.date,
              curRate: x[0]._id
            }
          })
        }
      });
    }

    // let invoiceCurrency = Object.keys(expense.curRate.rate)[0];
    // console.log('invoiceCurrency', invoiceCurrency);
    // Currency.find({date: expense.date}, (err, curRates) => {
    //
    //   const x = curRates.filter((item) => {
    //     return !isNaN(item.rate[invoiceCurrency]);
    //   })
    //   if (x.length === 0) {
    //     let curRate = {};
    //     Rate.find({date: expense.date}, (item) => {
    //       curRate = item.rates[invoiceCurrency];
    //       expense.curRate = curRate;
    //     })
    //   }
    // });




  })
  // const newObject = checkCurrenciesArray(dateFrom, dateTo, travelCurrencies, expenses, travel);
  // const updatedTravel = await Travel.findByIdAndUpdate({_id: travel._id}, {$set: {travelCurrencies: newObject}}, {new: true})
}
