const moment = require('moment');

const Travel = require('../models/Travel');
const Rate = require('../models/Rate');

const checkCurrenciesArray = (dateFrom, dateTo, travelCurrencies, expenses, travel) => {
  const newObject = {};
  let trCurKeys = Object.keys(travelCurrencies);



  // trCurKeys.forEach((day) => {
  //   if ((new Date(day) < dateFrom || new Date(day) > dateTo)) {
  //     console.log(`${day} currencies to delete`);
  //   }
  // })
  for (let d = dateFrom; d <= dateTo; d.add(1, 'days')) {
    const day = moment(d).format('YYYY-MM-DD');
    let inArayTest = trCurKeys.includes(day);
    if (!inArayTest) {
      console.log(inArayTest);
      newObject[day] = [];
    } else {
      console.log(inArayTest);
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


  // expenses.forEach((expense) => {

  //   const day = moment(expense.date).format('YYYY-MM-DD');
  //   if ( trCurKeys.includes(day)) {
  //     console.log(day, trCurKeys.includes(day));
  //   } else {
  //     console.log(day, trCurKeys.includes(day));
  //   }
  // });

  return newObject;
}

module.exports = async (travel) => {
  const dateFrom = moment(travel.dateFrom);
  const dateTo = moment(travel.dateTo);
  const expenses = travel.expenses;
  const travelCurrencies = travel.travelCurrencies;
  const newObject = checkCurrenciesArray(dateFrom, dateTo, travelCurrencies, expenses, travel);
  const updatedTravel = await Travel.findByIdAndUpdate({_id: travel._id}, {$set: {travelCurrencies: newObject}}, {new: true})
}
