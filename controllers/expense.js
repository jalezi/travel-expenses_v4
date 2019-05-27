const mongoose = require('mongoose');
const _ = require('lodash');
const moment = require('moment');

const User = require('../models/User');
const Travel = require('../models/Travel');
const Expense = require('../models/Expense');
const Currency = require('../models/Currency');
const ObjectId = mongoose.Types.ObjectId;

const {expenseTypes} = require('../lib/globals');
const constants = require('../lib/constants');


/*
 * GET /travels/:id/expenses/:id
 */
 exports.getExpense = (req, res, next) => {

   const id = req.params.id;
   if (!ObjectId.isValid(id)) {  return next(new Error('Not valid Object Id'));}
   let mileageType;
   const expense = res.locals.expense;
   const travel = res.locals.travel;
   const tDateFrom = travel.dateFrom;
   const tDateTo = travel.dateTo;

   if (expense.type != 'Mileage') {
     const rate = Object.values(expense.curRate.rate)[0];
     expense.rate = rate.toFixed(2);
     mileageType = false;
   } else {
     expense.rate = travel.perMileAmount;
     mileageType = true;
   }


   res.render('expenses/expense', {
     title: 'Expense',
     travel,
     expense,
     mileageType,
     tDateFrom,
     tDateTo,
     constants,
     rates: JSON.stringify(res.locals.rates),
     expenseCurRate: JSON.stringify(expense.curRate),
     expenseTypes
   });
 }

 /*
  * DELETE /travels/:id/expenses/:id
  */
exports.deleteExpense = async (req, res, next) => {

  const expenseId = req.params.id;
  const travel = res.locals.travel;
  const expense = res.locals.expense;
  const splitUrl = req.url.split('/');
  Expense.findOneAndDelete({_id: expenseId, travel: travel._id})
  .then((result) => {

    Travel.findByIdAndUpdate(travel._id, {
      $pullAll: {'expenses': [expenseId]},
      $inc: { "total" : -expense.amountConverted }
    }, (err, travel) => {
      if (!err) {return next(err);}
    });
  }).then(() => {
    req.flash('info', {msg: "Expense successfully deleted!!"});
    res.redirect(`/travels/${travel._id}`);
  }).catch( err => {
      next(err);
  });

}

/*
 * PATCH /travels/:id/expenses/:id
 */
exports.updateExpense = async (req, res, next) => {
  const travel = res.locals.travel;
  const expense = res.locals.expense;
  const body = _.pick(req.body, ['expenseType', 'expenseDescription', 'invoiceDate', 'amountDistance', 'amountDistance2', 'amountConverted', 'amountConverted2', 'invoiceCurrency', 'rate', 'amount']);
  const invoiceDate = new Date(req.body.invoiceDate);
  travel.total = travel.total - Number(expense.amountConverted) + Number(body.amountConverted) + Number(body.amountConverted2);
  // Different data if expense type is Mileage
  if (req.body.expenseType != 'Mileage') {
    const invoiceCurrency = req.body.invoiceCurrency.toUpperCase();
    let invDate = moment(invoiceDate).format('YYYY-MM-DD');
    const rate = req.body.rate;
    let cur = {};

    cur[invoiceCurrency] = Number(rate);
    let curRate = {};
    await Currency.find({base: res.locals.travel.homeCurrency, date: invoiceDate, rate: cur}, async (err, item) => {
      if (item.length === 1) {
        curRate = item[0];
      } else {
        curRate = new Currency({
          base: res.locals.travel.homeCurrency,
          date: invoiceDate,
          rate: cur
        })
        await curRate.save().then((doc) => {
        }).catch((err) => {
          next(err);
        });
      }
    });

    expense.type = body.expenseType;
    expense.description = body.expenseDescription;
    expense.date = invoiceDate;
    expense.currency = body.invoiceCurrency.toUpperCase();
    expense.curRate = curRate;
    expense.amount = body.amount;
    expense.amountConverted = body.amountConverted;
    expense.unit = undefined;
  } else {
    expense.type = body.expenseType;
    expense.description = body.expenseDescription;
    expense.date = invoiceDate;
    expense.unit = req.user.homeDistance;
    expense.amount = body.amountDistance;
    expense.amountConverted = body.amountConverted2;
    expense.currency = undefined;
    expense.curRate = undefined;

  }

  await expense.save()
  .then((doc) => {
    travel.save()
    .then(() => {
      res.redirect(`/travels/${travel._id}`);
    }).catch((err) => {
      next(err);
    });
  })
  .catch((err) => {
    next(err);
  });

}

/*
 * POST /travels/:id/expenses/new
 */
exports.postNewExpense = async function  (req, res, next) {
  const currencyOptions = {
      allow_negatives: false,
      allow_negative_sign_placeholder: true,
      thousands_separator: ',',
      decimal_separator: '.',
      allow_decimal: true,
      require_decimal: false,
      digits_after_decimal: [2],
      allow_space_after_digits: false
    };
  const decimalOptions = {decimal_digits: 2};

  req.assert('expenseDescription', 'Description is empty or to long (max 60 characters)!').isLength({min: 1, max: 60});
  let dateCompare = moment(res.locals.travel.dateFrom).add(-1, 'days').format('YYYY-MM-DD');
  req.assert('invoiceDate', 'Invoice date should be within travel dates').isAfter(dateCompare);
  dateCompare = moment(res.locals.travel.dateTo).add(1, 'days').format('YYYY-MM-DD');
  req.assert('invoiceDate', 'Invoice date should be within travel dates').isBefore(dateCompare);

  if (req.body.expenseType === 'Mileage') {
    req.assert('travelPerMileAmount', 'Per mile amount should be positive number with 2 decimals!').isDecimal(decimalOptions);
    req.assert('invoiceUnit', 'Must be "km" or "mi"').custom(() => {
      return 'km' === req.body.invoiceUnit || 'mi' === req.body.invoiceUnit
    });
    req.assert('amountDistance', 'Number with 2 decimals').isDecimal(decimalOptions);
    req.assert('amountDistance2', 'Number with 2 decimals').isDecimal(decimalOptions);
    req.assert('amountConverted2', 'Number with 2 decimals').isDecimal(decimalOptions);
  } else {
    req.assert('invoiceCurrency', 'Must be 3 charachters long').isLength({min: 3, max: 3});
    req.assert('rate', 'Currency rate with 2 decimals').isNumeric().isCurrency(currencyOptions);
    req.assert('amount', 'Number with 2 decimals').isDecimal(decimalOptions);
    req.assert('amountConverted', 'Number with 2 decimals').isDecimal(decimalOptions);
  }

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect(`/travels/${req.params.id}`);
  }

  let expense = {};
  const invoiceDate = new Date(req.body.invoiceDate);

  const invoiceCurrency = req.body.invoiceCurrency.toUpperCase();
  let invDate = moment(invoiceDate).format('YYYY-MM-DD');

  // Different data if expense type is Mileage
  if (req.body.expenseType != 'Mileage') {
    const invoiceCurrency = req.body.invoiceCurrency.toUpperCase();
    let invDate = moment(invoiceDate).format('YYYY-MM-DD');
    const rate = req.body.rate;
    let cur = {};

    cur[invoiceCurrency] = Number(rate);
    let curRate = {};
    await Currency.find({base: res.locals.travel.homeCurrency, date: invoiceDate, rate: cur}, async (err, item) => {
      if (item.length === 1) {
        curRate = item[0];
      } else {
        curRate = new Currency({
          base: res.locals.travel.homeCurrency,
          date: invoiceDate,
          rate: cur
        })
        await curRate.save();
      }
    });

    expense = new Expense ({
      travel: req.params.id,
      type: req.body.expenseType,
      description: req.body.expenseDescription,
      date: invoiceDate,
      currency: req.body.invoiceCurrency.toUpperCase(),
      curRate,
      amount: req.body.amount,
      amountConverted: req.body.amountConverted,
      _user: req.user._id
    });

  } else {
    expense = new Expense ({
      travel: req.params.id,
      type: req.body.expenseType,
      description: req.body.expenseDescription,
      date: invoiceDate,
      unit: req.user.homeDistance,
      amount: req.body.amountDistance,
      amountConverted: req.body.amountConverted2,
      _user: req.user._id
    });
  }

  try {
    const doc = await expense.save();
    const travel = await Travel.findByIdAndUpdate(res.locals.travel._id, {
      $addToSet: {'expenses': doc._id}}, (err, travel) => {
      if (err) {
        return next(err);
      }
    });
    // TODO refactor if statement. No need for if statement.
    if (doc.type != 'Mileage') {
      const result = Number(travel.total) + Number(doc.amountConverted);
      travel.total = result.toFixed(2);
      travel.save();
    } else {
      const result = Number(travel.total) + Number(doc.amountConverted);
      travel.total = result.toFixed(2);
      travel.save();
    }
  } catch (err) {
    return next(err);
  }

  req.flash('success', {msg: 'Successfully added new expense!'});
  res.redirect(`/travels/${req.params.id}`);
}
