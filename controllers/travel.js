const mongoose = require('mongoose');
const _ = require('lodash');
const moment = require('moment');

const User = require('../models/User');
const Travel = require('../models/Travel');
const Expense = require('../models/Expense');
const Rate = require('../models/Rate');
const ObjectId = mongoose.Types.ObjectId;

const {expenseTypes} = require('../lib/globals');
const constants = require('../lib/constants');
const createCurrenciesArray = require('../utils/createCurrenciesArray');
const updateCurrenciesArray  = require('../utils/updateCurrenciesArray');

// get all travels
exports.getTravels = async function(req, res) {
  const travels = await Travel.find({
    _id: {$in: req.user.travels}
  });
  res.render('travels/travels', {
    title: 'Travels',
    travels
  });
}

// get all travels
exports.getNewTravel = async function(req, res) {
  // console.log('getNewTravel');
  // const travels = await Travel.find({
  //   user: req.user._id
  // });
  res.render('travels/new', {
    title: 'New travel',
    user: req.user
  });
}

// post travels
// create new travel
exports.postNewTravel = async function(req, res, next) {

  req.assert('description', 'Description is empty or to long (max 60 characters)!').isLength({min: 1, max: 60});
  req.assert('homeCurrency', 'Home currency should have exactly 3 characters!').isLength({min: 3, max: 3});

  const decimalOptions = {decimal_digits: 2};
  req.assert('perMileAmount', 'Per mile amount should be positive number with 2 decimals!').isDecimal(decimalOptions);

  const dateCompare = moment(req.body.dateTo).add(1, 'days').format('YYYY-MM-DD');
  req.assert('dateFrom', 'Date from should be before date to').isBefore(dateCompare);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/travels/new');
  }

  const dateFrom = new Date(req.body.dateFrom);
  const dateTo = new Date(req.body.dateTo);
  const travelCurrencies = {
    days: createCurrenciesArray(moment(req.body.dateFrom), moment(req.body.dateTo))};
  const travel = new Travel({
    _user: req.user._id,
    description: req.body.description.replace(/\s+/g, " ").trim(),
    dateFrom,
    dateTo,
    homeCurrency: req.body.homeCurrency,
    perMileAmount: req.body.perMileAmount,
    travelCurrencies: travelCurrencies.days
  });

  try {
    const doc = await travel.save();
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: {
        'travels': doc._id
      },
    }, (err, user) => {
      if (err) {
        return next(err);
      }
    });
  } catch (err) {
    return next(err);
  }

  req.flash('success', {msg: 'Successfully added new travel!'});
  res.redirect('/travels');
}

exports.getTravel = async function (req, res, next) {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return next(new Error('Not valid Object Id'));
  }

  const travel = res.locals.travel;
  // updateCurrenciesArray(travel);
  try {
  //   const travel = await Travel.findOne({
  //     _id: id,
  //     _user: req.user._id
  //   }).populate('expenses');
    const expenses = travel.expenses;
    // const expenses = await Expense.find({
    //   _id: {$in: travel.expenses},
    //   _user: req.user._id
    // });

    expenses.forEach((expense, index, arr) => {
      if (expense.type != 'Mileage') {
        let x = expense.findRate((err, rate) => {
          expense.rate = rate[expense.currency];
          expense.rate = expense.rate.toFixed(2);
        });
      } else {
        expense.rate = travel.perMileAmount;
      }
    });

    if (!travel) {
      return next(new Error('Travel not found'))
    }

    // res.locals.travel = travel;
    res.render('travels/travel', {
      title: 'Travel',
      travel,
      travelCurrencies: travel.travelCurrencies,
      expenses,
      expenseTypes,
      constants,
      rates: JSON.stringify(res.locals.rates)
    });
  } catch (err) {
    return next(err);
  }
};

exports.deleteTravel = async function (req, res, next) {
  const id = req.params.id;
  // console.log(id);

  if (!ObjectId.isValid(id)) {
    return next(new Error('Not valid Object Id'));
  }

  try {
    const travel = await Travel.findOneAndDelete({
      _id: id,
      _user: req.user._id
    });

    if (!travel) {
      req.flash('error', {msg: 'Travel not found!!'});
      return next(new Error('Travel not found'));
    }

    Expense.deleteMany({travel: travel._id, _user: req.user._id}, (err) => {
      if (err) {return next(err)}
    });

    User.findByIdAndUpdate(req.user._id, {$pullAll : {'travels': [travel._id]}}, (err, user) => {
      if (!err) {
        return next(err);
      }
    });
    req.flash('success', {msg: 'Travel successfully deleted!'});
    res.redirect('/travels');
  } catch (err) {
    return next(err);
  }
};

exports.updateTravel = async function (req, res, next) {

  req.assert('description', 'Description is empty or to long (max 120 characters)!').isLength({min: 1, max: 60});
  req.assert('homeCurrency', 'Home currency should have exactly 3 characters!').isLength({min: 3, max: 3});
  req.assert('perMileAmount', 'Per mile amount should be positive number with 2 decimals!').isNumeric().isCurrency(
    {
    allow_negatives: false,
    allow_negative_sign_placeholder: true,
    thousands_separator: ',',
    decimal_separator: '.',
    allow_decimal: true,
    require_decimal: false,
    digits_after_decimal: [2],
    allow_space_after_digits: false
  });


  const dateCompare = moment(req.body.dateTo).add(1, 'days').format('YYYY-MM-DD');
  req.assert('dateFrom', 'Date from should be before date to').isBefore(dateCompare);

  const errors = req.validationErrors();
  const id = req.params.id;

  if (errors) {
    req.flash('errors', errors);
    return res.redirect(`/travels/${id}`);
  }

  const body = _.pick(req.body, ['description', 'dateFrom', 'dateTo','homeCurrency', 'perMileAmount']);

  if (!ObjectId.isValid(id)) {
    return next(new Error('Not valid Object Id'));
  }

  try {
    const travel = await Travel.findOneAndUpdate({_id: id, _user: req.user.id}, {$set: body}, {new: true});

    if (!travel) {
      return next(new Error('Travel not found'));
    }

    req.flash('success', {msg: 'Travel successfully updated!'});
    res.redirect('/travels');
  } catch (err) {
    return next(err);
  }
};
